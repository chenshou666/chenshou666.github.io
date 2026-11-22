(function (global) {
  'use strict';

  const U = (global.Weapons && global.Weapons.U) ? global.Weapons.U : 96;

  // ===== 固定逻辑世界 / DPR 位图提升（仅渲染层，玩法坐标与系数一字不改） =====
  const LOGICAL_W = 1280;
  const LOGICAL_H = 720;
  const MAX_BACKING_PIXELS = 3686400; // 2560×1440
  const PLAYER_COLOR = '#FF4D5E';
  const AI_COLOR = '#2563EB';

  class TrainingGame {
    constructor() {
      this.canvas =
        document.getElementById('game') ||
        document.getElementById('gameCanvas') ||
        document.querySelector('canvas');
      this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

      // 逻辑世界尺寸恒定，不再从 canvas.width / height 读取
      this.width = LOGICAL_W;
      this.height = LOGICAL_H;

      this.cssW = LOGICAL_W;
      this.cssH = LOGICAL_H;
      this.dprEff = 1;
      this.viewScale = 1;
      this.viewOffsetX = 0;
      this.viewOffsetY = 0;
      this.bgCanvas = null;
      this.bgCtx = null;
      this.bgKey = '';

      this.arenaBounds = {
        minX: 0.6 * U,
        maxX: this.width - 0.6 * U,
        minY: this.height * 0.62,
        maxY: this.height * 0.92
      };

      const weapon = global.Weapons.Galewakizashi;

      this.spawn = {
        player: { x: this.width * 0.28, y: this.height * 0.80, facing: 1 },
        ai: { x: this.width * 0.72, y: this.height * 0.80, facing: -1 }
      };

      this.player = new global.Entities.Stickman({
        id: 'player',
        name: '红方·玩家',
        isAI: false,
        color: PLAYER_COLOR,
        x: this.spawn.player.x,
        y: this.spawn.player.y,
        facing: this.spawn.player.facing,
        weapon: weapon
      });

      this.ai = new global.Entities.Stickman({
        id: 'ai',
        name: '蓝方·AI',
        isAI: true,
        color: AI_COLOR,
        x: this.spawn.ai.x,
        y: this.spawn.ai.y,
        facing: this.spawn.ai.facing,
        weapon: weapon
      });

      this.effects = [];
      this.texts = [];
      this.ended = false;
      this.started = false;
      this.paused = false;

      // AI 决策计时器
      this.aiThinkTimer = 0;
      this.aiWanderDirX = -1;
      this.aiWanderDirY = 0;
      this.aiS1RolledOnReady = false;

      // 键盘兜底（仅当 GameInput 不可用时）
      this.keys = {};
      this.prevButtons = { attack: false, s1: false, s2: false, s3: false };

      this.lastTime = performance.now();
      this.bindResize();
      this.bindFallbackKeyboard();
      this.bindOverlay();
      this.syncHudStaticTexts();
      this.updateDOMHud();
    }

    bindResize() {
      const resize = () => {
        if (!this.canvas) return;
        const rect = this.canvas.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          this.cssW = rect.width;
          this.cssH = rect.height;

          const dprBase = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
          let dprEff = Math.min(dprBase, Math.sqrt(MAX_BACKING_PIXELS / (this.cssW * this.cssH)));
          dprEff = Math.max(1, Math.min(2, dprEff));
          this.dprEff = dprEff;

          this.canvas.width = Math.round(this.cssW * dprEff);
          this.canvas.height = Math.round(this.cssH * dprEff);

          // 世界→位图等比缩放 + 居中 letterbox（禁止非等比拉伸）
          const s = Math.min(this.canvas.width / LOGICAL_W, this.canvas.height / LOGICAL_H);
          this.viewScale = s;
          this.viewOffsetX = (this.canvas.width - LOGICAL_W * s) * 0.5;
          this.viewOffsetY = (this.canvas.height - LOGICAL_H * s) * 0.5;

          // 以下表达式与系数一字不改（固定逻辑世界后自动成为固定逻辑坐标）
          this.arenaBounds.maxX = this.width - 0.6 * U;
          this.arenaBounds.minY = this.height * 0.62;
          this.arenaBounds.maxY = this.height * 0.92;
          this.spawn.player.x = this.width * 0.28;
          this.spawn.player.y = this.height * 0.80;
          this.spawn.ai.x = this.width * 0.72;
          this.spawn.ai.y = this.height * 0.80;
          // 首帧 canvas 常从默认小尺寸放大，只在首次有效布局时把人拉到出生点
          if (!this._initialLayoutDone) {
            this.resetFighter(this.player, this.spawn.player);
            this.resetFighter(this.ai, this.spawn.ai);
            this._initialLayoutDone = true;
          }
        }
      };
      window.addEventListener('resize', resize);
      resize();
    }

    // 桌面调试键盘兜底（WASD + J/K/L/U）；与 GameInput 并存时以 GameInput 为准
    bindFallbackKeyboard() {
      window.addEventListener('keydown', (e) => { this.keys[e.code] = true; });
      window.addEventListener('keyup', (e) => { this.keys[e.code] = false; });
    }

    bindOverlay() {
      const btn = document.getElementById('btn-restart');
      if (btn) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.restart();
        });
      }
    }

    syncHudStaticTexts() {
      const wName =
        document.getElementById('weapon-name') ||
        document.getElementById('weaponName') ||
        document.querySelector('.weapon-name');
      if (wName) wName.textContent = '武器：疾风忍刀';
    }

    // 优先 GameInput.getMove + consume(*Pressed)；保留键盘兜底
    readPlayerInput() {
      const gi = global.GameInput;

      let moveX = 0;
      let moveY = 0;
      let justAttack = false;
      let justS1 = false;
      let justS2 = false;
      let justS3 = false;

      if (gi && typeof gi.getMove === 'function') {
        const mv = gi.getMove();
        moveX = mv.x || 0;
        moveY = mv.y || 0;
      } else if (gi) {
        moveX = gi.moveX || 0;
        moveY = gi.moveY || 0;
        if (this.keys['KeyA'] || this.keys['ArrowLeft']) moveX = -1;
        if (this.keys['KeyD'] || this.keys['ArrowRight']) moveX = 1;
        if (this.keys['KeyW'] || this.keys['ArrowUp']) moveY = -1;
        if (this.keys['KeyS'] || this.keys['ArrowDown']) moveY = 1;
      } else {
        if (this.keys['KeyA'] || this.keys['ArrowLeft']) moveX = -1;
        if (this.keys['KeyD'] || this.keys['ArrowRight']) moveX = 1;
        if (this.keys['KeyW'] || this.keys['ArrowUp']) moveY = -1;
        if (this.keys['KeyS'] || this.keys['ArrowDown']) moveY = 1;
      }

      if (gi && typeof gi.consume === 'function') {
        // 现有 input.js 标志名为 attackPressed / s1Pressed / …
        justAttack = !!gi.consume('attackPressed');
        justS1 = !!gi.consume('s1Pressed');
        justS2 = !!gi.consume('s2Pressed');
        justS3 = !!gi.consume('s3Pressed');
      } else {
        // 无 GameInput 时的边沿检测兜底
        const rawAttack = !!(this.keys['KeyJ'] || this.keys['Space']);
        const rawS1 = !!(this.keys['KeyK'] || this.keys['Digit1']);
        const rawS2 = !!(this.keys['KeyL'] || this.keys['Digit2']);
        const rawS3 = !!(this.keys['KeyU'] || this.keys['Digit3']);
        justAttack = rawAttack && !this.prevButtons.attack;
        justS1 = rawS1 && !this.prevButtons.s1;
        justS2 = rawS2 && !this.prevButtons.s2;
        justS3 = rawS3 && !this.prevButtons.s3;
        this.prevButtons.attack = rawAttack;
        this.prevButtons.s1 = rawS1;
        this.prevButtons.s2 = rawS2;
        this.prevButtons.s3 = rawS3;
      }

      return { moveX, moveY, justAttack, justS1, justS2, justS3 };
    }

    resetFighter(f, spawn) {
      f.hp = f.maxHp;
      f.x = spawn.x;
      f.y = spawn.y;
      f.z = 0;
      f.vx = 0;
      f.vy = 0;
      f.vz = 0;
      f.gravity = 0;
      f.facing = spawn.facing;
      f.state = 'idle';
      f.subPhase = 'none';
      f.phaseTimer = 0;
      f.actionElapsed = 0;
      f.comboIndex = 0;
      f.comboResetTimer = 0;
      f.queuedNextAttack = false;
      f.currentAction = null;
      f.triggeredHitIndices = [];
      f.cds = { s1: 0, s2: 0, s3: 0 };
      f.stunTimer = 0;
      f.invulnTimer = 0;
      f.comboTakenDmg = 0;
      f.airborneTime = 0;
      f.comboCountTaken = 0;
      f.grabbedBy = null;
      f.grabTarget = null;
    }

    showResult(win) {
      this.ended = true;
      const overlay = document.getElementById('overlay');
      const title = document.getElementById('result-title');
      const desc = document.getElementById('result-desc');
      if (title) title.textContent = win ? '胜利' : '失败';
      if (desc) {
        desc.textContent = win
          ? '蓝方机器人已被击败'
          : '再练练 4A 连段、居合取消与燕返抓取';
      }
      if (overlay) overlay.classList.remove('hidden');
    }

    restart() {
      this.resetFighter(this.player, this.spawn.player);
      this.resetFighter(this.ai, this.spawn.ai);
      this.effects = [];
      this.texts = [];
      this.ended = false;
      this.aiThinkTimer = 0;
      this.aiWanderDirX = -1;
      this.aiWanderDirY = 0;
      this.aiS1RolledOnReady = false;
      const overlay = document.getElementById('overlay');
      if (overlay) overlay.classList.add('hidden');
      this.updateDOMHud();
    }

    // 蓝方 AI 战术行为逻辑
    updateAI(dt) {
      const ai = this.ai;
      const pl = this.player;

      // 1. 强制受身检查：单次连招伤害 > 450 或 浮空滞空 > 4.0s
      if (ai.comboTakenDmg > 450 || ai.airborneTime > 4.0) {
        ai.triggerUkemi(pl.facing, this.effects, this.texts);
        return { moveX: 0, moveY: 0 };
      }

      // 标记 S1 冷却就绪状态以供 50% 概率判定
      if (ai.cds.s1 > 0) {
        this.aiS1RolledOnReady = false;
      }

      const dx = pl.x - ai.x;
      const dy = pl.y - ai.y;
      const distPx = Math.abs(dx);
      const distU = distPx / U;
      const dirToPlayer = dx >= 0 ? 1 : -1;

      // 2. 若玩家已被击飞浮空（如4A后或升龙后），优先用 S2 / S3 追击
      if (pl.isAirborne() && distU <= 3.5 && (ai.canAct() || ai.canCancelWithSkill())) {
        if (ai.cds.s3 <= 0) {
          ai.requestSkill('s3', dirToPlayer, 0, pl, this.effects, this.texts);
          return { moveX: 0, moveY: 0 };
        }
        if (ai.cds.s2 <= 0) {
          ai.requestSkill('s2', dirToPlayer, Math.sign(dy), pl, this.effects, this.texts);
          return { moveX: 0, moveY: 0 };
        }
      }

      // 3. 距离分段决策
      if (distU > 4.5) {
        // >4.5U：S1 就绪时 50% 概率直接释放瞬步·居合
        if (ai.cds.s1 <= 0 && !this.aiS1RolledOnReady && ai.canAct()) {
          this.aiS1RolledOnReady = true;
          if (Math.random() < 0.50) {
            ai.requestSkill('s1', dirToPlayer, 0, pl, this.effects, this.texts);
            return { moveX: 0, moveY: 0 };
          }
        }
        // 游走逼近
        this.aiThinkTimer -= dt;
        if (this.aiThinkTimer <= 0) {
          this.aiThinkTimer = 0.45 + Math.random() * 0.35;
          this.aiWanderDirX = Math.random() < 0.75 ? dirToPlayer : -dirToPlayer * 0.5;
          this.aiWanderDirY = (Math.random() - 0.5) * 0.8;
        }
        return { moveX: this.aiWanderDirX, moveY: this.aiWanderDirY };
      }

      if (distU >= 2.0 && distU <= 4.5) {
        // 2~4.5U：优先释放 S2 旋风升龙斩
        if (ai.cds.s2 <= 0 && (ai.canAct() || ai.canCancelWithSkill())) {
          ai.requestSkill('s2', dirToPlayer, Math.sign(dy), pl, this.effects, this.texts);
          return { moveX: 0, moveY: 0 };
        }
        // S2 冷却时若 S1 可用则择机突进，否则拉近至 <2U
        if (ai.cds.s1 <= 0 && distU > 3.2 && ai.canAct() && Math.random() < 0.04) {
          ai.requestSkill('s1', dirToPlayer, 0, pl, this.effects, this.texts);
          return { moveX: 0, moveY: 0 };
        }
        return {
          moveX: dirToPlayer * 0.9,
          moveY: Math.abs(dy) > 10 ? Math.sign(dy) * 0.7 : 0
        };
      }

      // <2U：贴身打 1A~4A 普攻连段，4A 击飞后衔接 S2/S3
      if (Math.abs(dy) > 0.7 * U && ai.canAct()) {
        return { moveX: dirToPlayer * 0.5, moveY: Math.sign(dy) };
      }

      if (ai.canAct() || ai.state === 'attack') {
        ai.requestAttack(dirToPlayer);
      }
      return { moveX: 0, moveY: 0 };
    }

    checkEnd() {
      if (this.ended) return;
      if (this.player.hp <= 0) {
        this.player.hp = 0;
        this.showResult(false);
        return;
      }
      if (this.ai.hp <= 0) {
        this.ai.hp = 0;
        this.showResult(true);
      }
    }

    update(dt) {
      if (this.ended) {
        // 结束后仍刷新 HUD / 轻微效果衰减
        for (let i = this.effects.length - 1; i >= 0; i--) {
          this.effects[i].update(dt);
          if (this.effects[i].life <= 0) this.effects.splice(i, 1);
        }
        for (let i = this.texts.length - 1; i >= 0; i--) {
          this.texts[i].update(dt);
          if (this.texts[i].life <= 0) this.texts.splice(i, 1);
        }
        this.updateDOMHud();
        return;
      }

      // 玩家同样享有 >450 连招伤害或 >4s 浮空的受身保护
      if (this.player.comboTakenDmg > 450 || this.player.airborneTime > 4.0) {
        this.player.triggerUkemi(this.ai.facing, this.effects, this.texts);
      }

      const pIn = this.readPlayerInput();
      if (pIn.justS1) this.player.requestSkill('s1', pIn.moveX, pIn.moveY, this.ai, this.effects, this.texts);
      else if (pIn.justS2) this.player.requestSkill('s2', pIn.moveX, pIn.moveY, this.ai, this.effects, this.texts);
      else if (pIn.justS3) this.player.requestSkill('s3', pIn.moveX, pIn.moveY, this.ai, this.effects, this.texts);
      else if (pIn.justAttack) this.player.requestAttack(pIn.moveX);

      const aiMove = this.updateAI(dt);

      this.player.update(dt, pIn, this.ai, this.effects, this.texts, this.arenaBounds);
      this.ai.update(dt, aiMove, this.player, this.effects, this.texts, this.arenaBounds);

      for (let i = this.effects.length - 1; i >= 0; i--) {
        this.effects[i].update(dt);
        if (this.effects[i].life <= 0) this.effects.splice(i, 1);
      }
      for (let i = this.texts.length - 1; i >= 0; i--) {
        this.texts[i].update(dt);
        if (this.texts[i].life <= 0) this.texts.splice(i, 1);
      }

      this.checkEnd();
      this.updateDOMHud();
    }

    setCdUI(btnId, cdId, remain) {
      const btn = document.getElementById(btnId);
      const cd = document.getElementById(cdId);
      if (cd) {
        if (remain > 0.05) {
          cd.textContent = remain.toFixed(1);
        } else {
          cd.textContent = '';
        }
      }
      if (btn) {
        if (remain > 0.05) btn.classList.add('cooling');
        else btn.classList.remove('cooling');
      }
    }

    updateDOMHud() {
      const pFill =
        document.getElementById('hp-player') ||
        document.getElementById('playerHpFill') ||
        document.querySelector('.player-hp .hp-fill');
      const aFill =
        document.getElementById('hp-enemy') ||
        document.getElementById('aiHpFill') ||
        document.querySelector('.ai-hp .hp-fill');
      if (pFill) {
        pFill.style.width =
          ((Math.max(0, this.player.hp) / this.player.maxHp) * 100).toFixed(1) + '%';
      }
      if (aFill) {
        aFill.style.width =
          ((Math.max(0, this.ai.hp) / this.ai.maxHp) * 100).toFixed(1) + '%';
      }

      // 普攻无 CD；技能 CD 写到 #cd-s1 / #cd-s2 / #cd-s3（及可选 #cd-attack）
      this.setCdUI('btn-attack', 'cd-attack', 0);
      this.setCdUI('btn-s1', 'cd-s1', this.player.cds.s1 || 0);
      this.setCdUI('btn-s2', 'cd-s2', this.player.cds.s2 || 0);
      this.setCdUI('btn-s3', 'cd-s3', this.player.cds.s3 || 0);
    }

    // 静态背景烘焙：整幅 drawArena 画到 1 张逻辑离屏位图，每帧仅 1 次 drawImage
    // 位图按「逻辑世界 → 画布物理像素」的实际缩放烘焙，保证 1:1 无欠采样
    // 重建条件仅位图物理尺寸（由 viewScale / CSS 尺寸派生）变化，与战斗状态无关
    _ensureBackground() {
      // 上限：不超过实际世界缩放、不超过像素预算 sqrt(MAX/(1280*720))=2
      let bgScale = Math.min(this.viewScale || 1, 2,
        Math.sqrt(MAX_BACKING_PIXELS / (LOGICAL_W * LOGICAL_H)));
      // 下限：小屏不低于逻辑分辨率，避免 1px 线条在烘焙时消失
      bgScale = Math.max(1, bgScale);
      const w = Math.round(LOGICAL_W * bgScale);
      const h = Math.round(LOGICAL_H * bgScale);
      const key = w + 'x' + h;
      if (this.bgCanvas && this.bgKey === key) return;

      if (!this.bgCanvas) {
        this.bgCanvas = document.createElement('canvas');
        this.bgCtx = this.bgCanvas.getContext('2d');
      }
      this.bgCanvas.width = w;
      this.bgCanvas.height = h;
      const bctx = this.bgCtx;
      bctx.setTransform(1, 0, 0, 1, 0, 0);
      bctx.clearRect(0, 0, w, h);
      bctx.setTransform(w / LOGICAL_W, 0, 0, h / LOGICAL_H, 0, 0);
      this.drawArena(bctx);
      bctx.setTransform(1, 0, 0, 1, 0, 0);
      this.bgKey = key;
    }

    // 赛博霓虹训练场：类别 0 缺失，实例减半 + 权重下调（仅烘焙时执行）
    drawArena(ctx) {
      const width = this.width;
      const height = this.height;
      const unit = U;
      const b = this.arenaBounds || {};
      const bounds = {
        x: (typeof b.minX === 'number') ? b.minX : width * 0.08,
        y: (typeof b.minY === 'number') ? b.minY : height * 0.76,
        w: (typeof b.minX === 'number' && typeof b.maxX === 'number')
          ? (b.maxX - b.minX)
          : width * 0.84,
        h: (typeof b.minY === 'number' && typeof b.maxY === 'number')
          ? (b.maxY - b.minY)
          : height * 0.14
      };

      const centerX = bounds.x + bounds.w * 0.5;
      const floorY = bounds.y;
      const holoCenterY = Math.min(floorY - unit * 1.45, height * 0.44);

      ctx.save();

      // 1. 天幕 4 stop（色值不变）
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#02050d');
      bgGrad.addColorStop(0.52, '#060d1f');
      bgGrad.addColorStop(0.82, '#0b1530');
      bgGrad.addColorStop(1, '#040711');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // ambient 径向渐变（色值不变）
      const ambientGrad = ctx.createRadialGradient(
        centerX, holoCenterY, unit * 0.2,
        centerX, holoCenterY, Math.max(width, height) * 0.62
      );
      ambientGrad.addColorStop(0, 'rgba(30, 64, 175, 0.16)');
      ambientGrad.addColorStop(0.55, 'rgba(15, 23, 42, 0.06)');
      ambientGrad.addColorStop(1, 'rgba(2, 6, 23, 0)');
      ctx.fillStyle = ambientGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. 天际线剪影：10 -> 5 栋，填充 .88 -> .72，描边 .07 -> .035（中性）
      ctx.save();
      ctx.fillStyle = 'rgba(8, 15, 32, 0.72)';
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.035)';
      ctx.lineWidth = 1;
      const skyline = [
        [-0.39, 0.05, 2.1], [-0.24, 0.05, 2.5],
        [0.00, 0.06, 1.8],
        [0.20, 0.05, 2.4], [0.35, 0.05, 2.0]
      ];
      for (let i = 0; i < skyline.length; i++) {
        const sb = skyline[i];
        const bx = centerX + sb[0] * width;
        const bw = sb[1] * width;
        const bh = sb[2] * unit;
        const by = floorY - bh;
        ctx.fillRect(bx, by, bw, bh);
        ctx.strokeRect(bx, by, bw, bh);
      }
      ctx.restore();

      // 3. 竖向虚线网格：8 -> 4 列，.07 -> .035；中线 1 条 .22 -> .14 中性
      ctx.save();
      const cols = 4;
      const colStep = width / cols;
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.035)';
      ctx.lineWidth = 1;
      ctx.setLineDash([unit * 0.08, unit * 0.14]);
      ctx.beginPath();
      for (let c = 1; c < cols; c++) {
        const gx = c * colStep;
        if (Math.abs(gx - centerX) < colStep * 0.35) continue;
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, floorY);
      }
      ctx.stroke();

      ctx.strokeStyle = 'rgba(226, 232, 240, 0.14)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([unit * 0.12, unit * 0.09]);
      ctx.beginPath();
      ctx.moveTo(centerX, unit * 0.3);
      ctx.lineTo(centerX, floorY);
      ctx.stroke();
      ctx.restore();

      // 4. 全息战术圆环：4 -> 2 层（outer 187 + inner 69），准线 2 -> 1 条
      ctx.save();
      const outerR = 187;
      const innerR = 69;

      ctx.strokeStyle = 'rgba(226, 232, 240, 0.10)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(centerX, holoCenterY, outerR, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(226, 232, 240, 0.12)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(centerX, holoCenterY, outerR, -Math.PI * 0.22, Math.PI * 0.22);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(centerX, holoCenterY, outerR, Math.PI * 0.78, Math.PI * 1.22);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(226, 232, 240, 0.10)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(centerX, holoCenterY, innerR, 0, Math.PI * 2);
      ctx.stroke();

      // 水平准线 1 条：.20 -> .12
      ctx.strokeStyle = 'rgba(226, 232, 240, 0.12)';
      ctx.beginPath();
      ctx.moveTo(centerX - outerR * 1.18, holoCenterY);
      ctx.lineTo(centerX + outerR * 1.18, holoCenterY);
      ctx.stroke();
      ctx.restore();

      // 5. 地板渐变 3 stop + 叠层 .65 -> .35；透视线 9 -> 3 条，.10 -> .045
      ctx.save();
      const deckGrad = ctx.createLinearGradient(0, floorY, 0, height);
      deckGrad.addColorStop(0, '#091326');
      deckGrad.addColorStop(0.25, '#050b16');
      deckGrad.addColorStop(1, '#010308');
      ctx.fillStyle = deckGrad;
      ctx.fillRect(0, floorY, width, height - floorY);

      ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
      ctx.fillRect(bounds.x, floorY, bounds.w, Math.max(bounds.h, height - floorY));

      ctx.strokeStyle = 'rgba(148, 163, 184, 0.045)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      const perspectiveLines = 3;
      for (let p = 0; p <= perspectiveLines; p++) {
        const ratio = p / perspectiveLines;
        const topX = bounds.x + bounds.w * ratio;
        const spread = (ratio - 0.5) * 1.45;
        const botX = centerX + bounds.w * spread;
        ctx.moveTo(topX, floorY);
        ctx.lineTo(botX, height);
      }
      ctx.stroke();

      ctx.save();
      ctx.globalCompositeOperation = 'lighter';

      // 地面霓虹边：3 stop，左红 #FF4D5E / 中 #E0F2FE / 右蓝 #2563EB
      const edgeGlowGrad = ctx.createLinearGradient(bounds.x, floorY, bounds.x + bounds.w, floorY);
      edgeGlowGrad.addColorStop(0, 'rgba(255, 77, 94, 0.45)');
      edgeGlowGrad.addColorStop(0.5, 'rgba(224, 242, 254, 0.65)');
      edgeGlowGrad.addColorStop(1, 'rgba(37, 99, 235, 0.45)');

      ctx.strokeStyle = edgeGlowGrad;
      ctx.lineWidth = unit * 0.09;
      ctx.shadowColor = '#E0F2FE';
      ctx.shadowBlur = Math.min(24, 0.22 * unit); // 21px，仅烘焙 1 次，不进单帧预算
      ctx.beginPath();
      ctx.moveTo(bounds.x, floorY);
      ctx.lineTo(bounds.x + bounds.w, floorY);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 地平面白高光线 2px
      ctx.strokeStyle = 'rgba(240, 249, 255, 0.85)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(bounds.x, floorY);
      ctx.lineTo(bounds.x + bounds.w, floorY);
      ctx.stroke();

      // 端柱：左 #FF4D5E / 右 #2563EB，3px · 高 27px
      const pillarH = unit * 0.28;
      ctx.strokeStyle = '#FF4D5E';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(bounds.x, floorY - pillarH);
      ctx.lineTo(bounds.x, floorY + pillarH * 0.4);
      ctx.stroke();

      ctx.strokeStyle = '#2563EB';
      ctx.beginPath();
      ctx.moveTo(bounds.x + bounds.w, floorY - pillarH);
      ctx.lineTo(bounds.x + bounds.w, floorY + pillarH * 0.4);
      ctx.stroke();

      ctx.restore();
      ctx.restore();

      // 6. 扫描线：步长 16px 保留，仅烘焙时绘制（每帧循环 0 次）
      ctx.save();
      ctx.fillStyle = 'rgba(148, 163, 184, 0.018)';
      const scanStep = 16;
      for (let sy = 0; sy < height; sy += scanStep) {
        ctx.fillRect(0, sy, width, 1);
      }
      ctx.restore();

      // 暗角 .55 -> .40
      const vig = ctx.createRadialGradient(centerX, holoCenterY, Math.min(width, height) * 0.25, centerX, holoCenterY, Math.max(width, height) * 0.72);
      vig.addColorStop(0, 'rgba(0,0,0,0)');
      vig.addColorStop(0.65, 'rgba(0,0,0,0.15)');
      vig.addColorStop(1, 'rgba(0,0,0,0.40)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, width, height);

      ctx.restore();
    }

    // 并发上限：effects ≤6 / texts ≤8，超出丢弃 life 最小者（纯渲染层，不改 update）
    _capEffects() {
      const EFFECTS_CAP = 6;
      const TEXTS_CAP = 8;
      while (this.effects.length > EFFECTS_CAP) {
        let mi = 0;
        for (let i = 1; i < this.effects.length; i++) {
          if (this.effects[i].life < this.effects[mi].life) mi = i;
        }
        this.effects.splice(mi, 1);
      }
      while (this.texts.length > TEXTS_CAP) {
        let mj = 0;
        for (let j = 1; j < this.texts.length; j++) {
          if (this.texts[j].life < this.texts[mj].life) mj = j;
        }
        this.texts.splice(mj, 1);
      }
    }

    draw() {
      const ctx = this.ctx;
      if (!ctx) return;

      const cw = this.canvas.width;
      const ch = this.canvas.height;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, cw, ch);
      ctx.setTransform(this.viewScale, 0, 0, this.viewScale,
        this.viewOffsetX, this.viewOffsetY);

      // 静态位图 → 角色 → effects → texts
      this._ensureBackground();
      if (this.bgCanvas) {
        ctx.drawImage(this.bgCanvas, 0, 0, LOGICAL_W, LOGICAL_H);
      }

      this._capEffects();

      // 按 Y 坐标景深排序绘制角色
      const chars = [this.player, this.ai].sort((a, b) => a.y - b.y);
      chars.forEach((c) => c.draw(ctx));

      // effects 统一包 1 次 lighter；effects>4 时 S1~S3 降为 2 层
      const crowded = this.effects.length > 4;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      this.effects.forEach((e) => { e._crowded = crowded; e.draw(ctx); });
      ctx.restore();

      // 美术可读性限制：可见伤害飘字 ≤3、状态文字 ≤1（技术池仍 ≤8，不改 update）
      const dmgTexts = this.texts.filter((t) => t.isDamage)
        .sort((a, b) => b.life - a.life).slice(0, 3);
      const stateTexts = this.texts.filter((t) => !t.isDamage)
        .sort((a, b) => b.life - a.life).slice(0, 1);
      dmgTexts.concat(stateTexts).forEach((t) => t.draw(ctx));
    }

    loop(now) {
      const rawDt = (now - this.lastTime) / 1000;
      const dt = Math.min(rawDt, 1 / 20);
      this.lastTime = now;

      if (!this.started || this.paused) {
        this.lastTime = now;
        this.draw();
        requestAnimationFrame((t) => this.loop(t));
        return;
      }

      this.update(dt);
      this.draw();
      requestAnimationFrame((t) => this.loop(t));
    }

    start() {
      this.lastTime = performance.now();
      requestAnimationFrame((t) => this.loop(t));
    }

    setPaused(v) {
      this.paused = !!v;
      this.lastTime = performance.now();
    }

    backToStart() {
      const startScreen = document.getElementById('start-screen');
      if (startScreen) startScreen.classList.remove('hidden');
      this.started = false;
      this.setPaused(true);
      this.restart();
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    if (global.GameInput && typeof global.GameInput.init === 'function') {
      global.GameInput.init();
    }
    global.Game = new TrainingGame();
    global.Game.start();

    const exitBtn = document.getElementById('btn-exit');
    if (exitBtn) {
      exitBtn.addEventListener('click', () => { global.Game.backToStart(); });
    }

    const startBtn = document.getElementById('btn-start');
    const startScreen = document.getElementById('start-screen');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        if (startScreen) startScreen.classList.add('hidden');
        global.Game.started = true;
        global.Game.restart();
        global.Game.lastTime = performance.now();
      });
    }
  });
})(window);
