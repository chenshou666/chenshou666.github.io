(function (global) {
  'use strict';

  const U = (global.Weapons && global.Weapons.U) ? global.Weapons.U : 96;


  // ===== 绘制层常量：显式阵营 / 技能标识取色（取代 hex 子串嗅探） =====
  const TEAM_RED = '#FF4D5E';
  const TEAM_BLUE = '#2563EB';
  const TEXT_NEUTRAL = '#E2E8F0';
  const TEAM_BLUE_KEY = TEAM_BLUE.toLowerCase();
  const TEXT_NEUTRAL_KEY = TEXT_NEUTRAL.toLowerCase();
  const SHADOW_BLUR_MAX = Math.min(24, 0.18 * U); // 设计值 17.28 逻辑 px，硬上限 24

  function _blur(v) {
    return Math.min(SHADOW_BLUR_MAX, v);
  }

  const STICKMAN_PALETTES = {
    red: {
      base: '#FF4D5E', mid: '#FF8A99', core: '#FFF1F2',
      rgb: '255, 77, 94', glowRgb: '255, 90, 110'
    },
    blue: {
      base: '#2563EB', mid: '#60A5FA', core: '#EFF6FF',
      rgb: '37, 99, 235', glowRgb: '59, 130, 246'
    }
  };

  function _getStickmanPalette(team) {
    return STICKMAN_PALETTES[team === 'blue' ? 'blue' : 'red'];
  }

  const SLASH_ATTACK = {
    base: '#FF6B6B', mid: '#FF8A99', core: '#FFF1F2', rgb: '255, 107, 107'
  };
  const SLASH_VFX = {
    slash_h: SLASH_ATTACK,
    slash_up: SLASH_ATTACK,
    spin: SLASH_ATTACK,
    heavy_arc: SLASH_ATTACK,
    iai: { base: '#FF9F45', mid: '#FFC48A', core: '#FFF1F2', rgb: '255, 159, 69' },
    rising_dragon: { base: '#FFD166', mid: '#FFE3A3', core: '#FFF1F2', rgb: '255, 209, 102' },
    swallow_return: { base: '#FF5D8F', mid: '#FF9CBB', core: '#FFF1F2', rgb: '255, 93, 143' }
  };
  const SLASH_BLUE = {
    base: '#2563EB', mid: '#60A5FA', core: '#EFF6FF', rgb: '37, 99, 235'
  };
  const SLASH_NEUTRAL = {
    base: '#E2E8F0', mid: '#F1F5F9', core: '#FFFFFF', rgb: '226, 232, 240'
  };

  // 显式阵营标识（精确等值，非「非红即青」子串兜底）+ 技能 vfx 标识
  // color 统一大小写归一，避免合法小写 hex 静默错阵营
  function _getSlashPalette(type, color) {
    var c = String(color || '').toLowerCase();
    if (c === TEXT_NEUTRAL_KEY) return SLASH_NEUTRAL; // 受身：中性无色相
    if (c === TEAM_BLUE_KEY) return SLASH_BLUE;       // 蓝方：统一冷蓝
    var t = String(type || 'slash_h').toLowerCase();
    return SLASH_VFX[t] || SLASH_ATTACK;
  }

  // 脚底光晕渐变：按 ctx + 阵营各缓存 1 份，每帧 0 次创建
  function _getFloorGradient(ctx, team) {
    var key = team === 'blue' ? '_artFloorBlue' : '_artFloorRed';
    if (!ctx[key]) {
      var p = _getStickmanPalette(team);
      var g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
      g.addColorStop(0, 'rgba(255, 255, 255, 0.55)');
      g.addColorStop(0.28, 'rgba(' + p.rgb + ', 0.48)');
      g.addColorStop(0.65, 'rgba(' + p.rgb + ', 0.16)');
      g.addColorStop(1, 'rgba(' + p.rgb + ', 0)');
      ctx[key] = g;
    }
    return ctx[key];
  }

  // ===== Neon art helpers：骨头/头 2 stroke + 1 blur，保白芯 =====
  function _drawNeonBone(ctx, x1, y1, x2, y2, radius, palette, isHurtFlash, useBlur) {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = isHurtFlash ? 'rgba(255, 255, 255, 0.70)' : palette.base;
    ctx.lineWidth = radius * 1.15;
    if (useBlur !== false) {
      ctx.shadowColor = isHurtFlash ? 'rgba(255, 255, 255, 0.70)' : palette.mid;
      ctx.shadowBlur = _blur(radius * 0.9);
    }
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = isHurtFlash ? 'rgba(255, 255, 255, 0.70)' : palette.core;
    ctx.lineWidth = radius * 0.42;
    ctx.stroke();
    ctx.restore();
  }

  function _drawNeonHead(ctx, cx, cy, r, thickness, palette, isHurtFlash) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = isHurtFlash ? 'rgba(255, 255, 255, 0.70)' : palette.base;
    ctx.lineWidth = thickness * 1.15;
    ctx.shadowColor = isHurtFlash ? 'rgba(255, 255, 255, 0.70)' : palette.mid;
    ctx.shadowBlur = _blur(thickness * 1.0);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = isHurtFlash ? 'rgba(255, 255, 255, 0.70)' : palette.core;
    ctx.lineWidth = thickness * 0.42;
    ctx.stroke();
    ctx.restore();
  }

  // 刀身 2 层（15px 主体 + 4px 白芯）；刀尖光斑 / 十字星 / 挥刀扇形 gradient 全部删除
  function _drawNeonKatana(ctx, handX, handY, angle, bladeLen, unit, palette, slashProgress, isAttacking) {
    var tipX = handX + Math.cos(angle) * bladeLen;
    var tipY = handY + Math.sin(angle) * bladeLen;
    var hiltLen = 0.22 * unit;
    var pommelX = handX - Math.cos(angle) * hiltLen;
    var pommelY = handY - Math.sin(angle) * hiltLen;

    ctx.save();
    ctx.lineCap = 'round';

    // 刀柄
    ctx.beginPath();
    ctx.moveTo(pommelX, pommelY);
    ctx.lineTo(handX, handY);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 0.08 * unit;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(pommelX, pommelY);
    ctx.lineTo(handX, handY);
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 0.03 * unit;
    ctx.stroke();

    // 护手（唯一保留的刀身外 blur）
    var perpX = -Math.sin(angle) * (0.11 * unit);
    var perpY = Math.cos(angle) * (0.11 * unit);
    ctx.beginPath();
    ctx.moveTo(handX - perpX, handY - perpY);
    ctx.lineTo(handX + perpX, handY + perpY);
    ctx.strokeStyle = palette.mid;
    ctx.lineWidth = 0.05 * unit;
    ctx.shadowColor = palette.base;
    ctx.shadowBlur = _blur(0.12 * unit);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // 主体 15px
    ctx.beginPath();
    ctx.moveTo(handX, handY);
    ctx.lineTo(tipX, tipY);
    ctx.strokeStyle = palette.base;
    ctx.lineWidth = 0.16 * unit;
    ctx.shadowColor = palette.mid;
    ctx.shadowBlur = _blur(0.18 * unit);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // 白芯 4px
    ctx.beginPath();
    ctx.moveTo(handX, handY);
    ctx.lineTo(tipX, tipY);
    ctx.strokeStyle = palette.core;
    ctx.lineWidth = 0.045 * unit;
    ctx.stroke();

    ctx.restore();
  }

  // 弧线路径步数 24 -> 12
  function _traceCrescentArc(ctx, cx, cy, r, startAngle, endAngle, maxThickness) {
    var steps = 12;
    var delta = endAngle - startAngle;
    ctx.beginPath();

    for (var i = 0; i <= steps; i++) {
      var u = i / steps;
      var a = startAngle + delta * u;
      var profile = Math.sin(u * Math.PI);
      var rOut = r + maxThickness * 0.55 * profile;
      var px = cx + Math.cos(a) * rOut;
      var py = cy + Math.sin(a) * rOut;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }

    for (var j = steps; j >= 0; j--) {
      var u2 = j / steps;
      var a2 = startAngle + delta * u2;
      var profile2 = Math.sin(u2 * Math.PI);
      var rIn = Math.max(2, r - maxThickness * 0.45 * profile2);
      var px2 = cx + Math.cos(a2) * rIn;
      var py2 = cy + Math.sin(a2) * rIn;
      ctx.lineTo(px2, py2);
    }

    ctx.closePath();
  }

  // 每条火花 1 stroke + globalAlpha，循环内 0 次 shadowBlur
  function _drawTangentSparks(ctx, cx, cy, r, startAngle, endAngle, progress, count, unit, palette, alpha) {
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineWidth = 0.05 * unit;
    ctx.strokeStyle = 'rgba(' + palette.rgb + ', 1)';
    var span = endAngle - startAngle;

    for (var i = 0; i < count; i++) {
      var seed1 = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
      var frac1 = seed1 - Math.floor(seed1);
      var seed2 = Math.sin(i * 45.164 + 19.123) * 23421.631;
      var frac2 = seed2 - Math.floor(seed2);

      var baseAngle = startAngle + span * (0.12 + 0.82 * frac1);
      var tangentAngle = baseAngle + (span >= 0 ? Math.PI * 0.5 : -Math.PI * 0.5) + (frac2 - 0.45) * 0.45;

      var originX = cx + Math.cos(baseAngle) * (r + (frac2 - 0.5) * 0.16 * unit);
      var originY = cy + Math.sin(baseAngle) * (r + (frac2 - 0.5) * 0.16 * unit);

      var travelDist = (0.12 + progress * (0.55 + frac1 * 0.65)) * unit;
      var sparkLen = (1 - progress * 0.72) * (0.12 + frac2 * 0.18) * unit;

      var sx1 = originX + Math.cos(tangentAngle) * travelDist;
      var sy1 = originY + Math.sin(tangentAngle) * travelDist;
      var sx2 = sx1 + Math.cos(tangentAngle) * sparkLen;
      var sy2 = sy1 + Math.sin(tangentAngle) * sparkLen;

      var sparkAlpha = Math.min(0.90, alpha) * Math.max(0, 1 - progress * 0.85);
      if (sparkAlpha <= 0.02) continue;

      ctx.globalAlpha = sparkAlpha;
      ctx.beginPath();
      ctx.moveTo(sx1, sy1);
      ctx.lineTo(sx2, sy2);
      ctx.stroke();
    }
    ctx.restore();
  }


  // 刀光与技能视觉特效实体
  class SlashEffect {
    constructor(opts) {
      this.x = opts.x;
      this.y = opts.y;
      this.z = opts.z || 0;
      this.facing = opts.facing || 1;
      this.type = opts.type || 'slash_h';
      this.color = opts.color || '#FF6B6B';
      this.maxLife = Math.min(0.35, opts.life || 0.22);
      this.life = this.maxLife;
      this.w = opts.w || 1.9 * U;
      this.h = opts.h || 1.0 * U;
    }

    update(dt) {
      this.life -= dt;
    }

    draw(ctx) {
      if (this.life <= 0) return;
      var unit = U;
      var lifeRatio = (this.maxLife > 0)
        ? Math.max(0, Math.min(1, this.life / this.maxLife))
        : 0;
      var progress = 1 - lifeRatio;
      var alpha = Math.pow(lifeRatio, 0.72);
      if (alpha <= 0.01) return;

      var scalePop = 0.88 + 0.24 * Math.sin(Math.min(1, progress * 1.6) * Math.PI * 0.5);
      var baseRadius = (this.w || (1.2 * unit)) * 0.55 * scalePop;
      var facing = (this.facing === -1) ? -1 : 1;
      var type = String(this.type || 'slash_h').toLowerCase();
      var palette = _getSlashPalette(type, this.color);
      // effects>4 时 S1~S3 由 3 层降为 2 层
      var skillLayers = this._crowded ? 2 : 3;
      // Project height: screen y is ground line minus air height
      var drawY = this.y - (this.z || 0) - 1.25 * unit;

      ctx.save();
      ctx.translate(this.x || 0, drawY);
      ctx.scale(facing, 1);

      // S1 瞬步·居合：直线 + 箭头（外发光 / 主体 / 白芯，功能互异）
      if (type === 'iai' || type === 'thrust' || type === 'pierce') {
        var reach = Math.max(baseRadius * 1.6, (this.w || 1.9 * unit) * 0.85) * (1.05 + progress * 0.2);
        var beamWidth = (0.34 * unit) * lifeRatio;
        var startX = -0.25 * unit;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(startX, 0);
        ctx.lineTo(reach, 0);
        ctx.strokeStyle = 'rgba(' + palette.rgb + ', ' + (alpha * 0.32) + ')';
        ctx.lineWidth = beamWidth * 2.2;
        ctx.lineCap = 'round';
        ctx.shadowColor = palette.base;
        ctx.shadowBlur = _blur(0.42 * unit);
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(startX, 0);
        ctx.lineTo(reach * 0.28, -beamWidth * 0.55);
        ctx.lineTo(reach * 1.08, 0);
        ctx.lineTo(reach * 0.28, beamWidth * 0.55);
        ctx.closePath();
        ctx.fillStyle = 'rgba(' + palette.rgb + ', ' + (alpha * 0.92) + ')';
        if (skillLayers >= 3) {
          ctx.shadowColor = palette.base;
          ctx.shadowBlur = _blur(0.25 * unit);
        }
        ctx.fill();
        ctx.restore();

        if (skillLayers >= 3) {
          ctx.beginPath();
          ctx.moveTo(startX * 0.5, 0);
          ctx.lineTo(reach * 0.32, -beamWidth * 0.22);
          ctx.lineTo(reach * 1.12, 0);
          ctx.lineTo(reach * 0.32, beamWidth * 0.22);
          ctx.closePath();
          ctx.fillStyle = palette.core;
          ctx.globalAlpha = alpha;
          ctx.fill();
          ctx.globalAlpha = 1;
        }

        for (var s = 0; s < 6; s++) {
          var ratio = (s + 1) / 6;
          var spX = reach * ratio * (0.35 + progress * 0.7);
          var spY = ((s % 2 === 0 ? 1 : -1) * (0.06 + (s % 3) * 0.05) * unit) * (0.5 + progress);
          var spLen = (0.18 + (s % 3) * 0.08) * unit * lifeRatio;
          ctx.beginPath();
          ctx.moveTo(spX, spY);
          ctx.lineTo(spX + spLen, spY * 1.25);
          ctx.strokeStyle = (s % 2 === 0) ? 'rgba(255,255,255,' + alpha + ')' : 'rgba(' + palette.rgb + ',' + alpha + ')';
          ctx.lineWidth = 0.026 * unit;
          ctx.stroke();
        }

      // S2 旋风升龙斩：双轮螺旋，功能互异
      } else if (type === 'rising_dragon' || type === 'whirlwind') {
        var rotOffset = progress * Math.PI * 1.8;
        var ringThickness = (0.34 * unit) * lifeRatio;
        var spinR = Math.max(baseRadius, 0.9 * unit);

        for (var w = 0; w < 2; w++) {
          var aStart = rotOffset + w * Math.PI;
          var aEnd = aStart + Math.PI * 1.35;
          var subR = spinR * (w === 0 ? 1.0 : 0.86);

          ctx.save();
          _traceCrescentArc(ctx, 0, 0, subR, aStart, aEnd, ringThickness * 1.7);
          ctx.fillStyle = 'rgba(' + palette.rgb + ', ' + (alpha * 0.32) + ')';
          if (w === 0) {
            ctx.shadowColor = palette.base;
            ctx.shadowBlur = _blur(0.35 * unit);
          }
          ctx.fill();
          ctx.restore();

          ctx.save();
          _traceCrescentArc(ctx, 0, 0, subR, aStart, aEnd, ringThickness * 0.95);
          ctx.fillStyle = 'rgba(' + palette.rgb + ', ' + (alpha * 0.92) + ')';
          if (w === 1 && skillLayers >= 3) {
            ctx.shadowColor = palette.base;
            ctx.shadowBlur = _blur(0.22 * unit);
          }
          ctx.fill();
          ctx.restore();

          if (skillLayers >= 3) {
            ctx.save();
            _traceCrescentArc(ctx, 0, 0, subR, aStart + 0.08, aEnd - 0.08, ringThickness * 0.42);
            ctx.fillStyle = palette.core;
            ctx.globalAlpha = alpha;
            ctx.fill();
            ctx.restore();
          }
        }

        _drawTangentSparks(ctx, 0, 0, spinR, rotOffset, rotOffset + Math.PI * 2, progress, 8, unit, palette, alpha);

      // S3 影袭·燕返：X 斩（走技能语义色，不再硬编码）
      } else if (type === 'swallow_return' || type === 'slam') {
        var span = 0.95 * unit;
        var col = palette.base;
        var drawX = function () {
          ctx.beginPath();
          ctx.moveTo(-span, -span * 1.15);
          ctx.lineTo(span, span * 0.35);
          ctx.moveTo(span, -span * 1.15);
          ctx.lineTo(-span, span * 0.35);
          ctx.stroke();
        };
        ctx.save();
        ctx.globalAlpha = alpha * 0.32;
        ctx.strokeStyle = col;
        ctx.lineWidth = Math.max(8, 0.28 * unit);
        ctx.shadowColor = col;
        ctx.shadowBlur = _blur(0.5 * unit);
        drawX();
        ctx.restore();

        if (skillLayers >= 3) {
          ctx.save();
          ctx.globalAlpha = alpha * 0.92;
          ctx.strokeStyle = col;
          ctx.lineWidth = Math.max(4, 0.12 * unit);
          ctx.shadowColor = col;
          ctx.shadowBlur = _blur(0.25 * unit);
          drawX();
          ctx.restore();
        }

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = palette.core;
        ctx.lineWidth = Math.max(2, 0.05 * unit);
        drawX();
        ctx.restore();

        for (var i = 0; i < 6; i++) {
          var seed = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
          var fr = seed - Math.floor(seed);
          var ang = fr * Math.PI * 2;
          var ox = (fr - 0.5) * 1.4 * unit;
          var oy = ((i % 5) / 5 - 0.5) * 1.6 * unit;
          var len = (0.14 + fr * 0.22) * unit * lifeRatio;
          ctx.beginPath();
          ctx.moveTo(ox, oy);
          ctx.lineTo(ox + Math.cos(ang) * len, oy + Math.sin(ang) * len);
          ctx.strokeStyle = (i % 2 === 0) ? 'rgba(255,255,255,' + alpha + ')' : 'rgba(' + palette.rgb + ',' + alpha + ')';
          ctx.lineWidth = 0.03 * unit;
          ctx.stroke();
        }

      // 普攻 4A 下劈：重型弧（与 S3 的 X 斩形状不同）
      } else if (type === 'heavy_arc') {
        var hArcStart = -Math.PI * 0.78 + progress * 0.32;
        var hArcEnd = Math.PI * 0.68 + progress * 0.32;
        var hArcR = Math.max(baseRadius, (this.w || 1.6 * unit) * 0.55) * 1.15;
        var hMaxThick = 0.44 * unit * lifeRatio;

        ctx.save();
        _traceCrescentArc(ctx, 0, 0, hArcR, hArcStart, hArcEnd, hMaxThick * 1.85);
        ctx.fillStyle = 'rgba(' + palette.rgb + ', ' + (alpha * 0.38) + ')';
        ctx.shadowColor = palette.base;
        ctx.shadowBlur = _blur(0.42 * unit);
        ctx.fill();
        ctx.restore();

        ctx.save();
        _traceCrescentArc(ctx, 0, 0, hArcR, hArcStart + 0.06, hArcEnd - 0.06, hMaxThick * 0.44);
        ctx.fillStyle = palette.core;
        ctx.globalAlpha = alpha;
        ctx.fill();
        ctx.restore();

        _drawTangentSparks(ctx, 0, 0, hArcR, hArcStart, hArcEnd, progress, 6, unit, palette, alpha);

      // 普攻默认 / 3A spin：单层弧 2 层（外发光 + 白芯）
      } else {
        var isUp = (type === 'slash_up');
        var arcStart = isUp ? -Math.PI * 0.15 : -Math.PI * 0.48;
        var arcEnd = isUp ? -Math.PI * 0.95 : Math.PI * 0.42;
        var sweepShift = progress * 0.22;
        arcStart += sweepShift;
        arcEnd += sweepShift;

        var arcR = Math.max(baseRadius, (this.w || 1.6 * unit) * 0.55) * 0.95;
        var maxThick = (isUp ? 0.44 : 0.28) * unit * lifeRatio;

        ctx.save();
        _traceCrescentArc(ctx, 0, 0, arcR, arcStart, arcEnd, maxThick * 1.85);
        ctx.fillStyle = 'rgba(' + palette.rgb + ', ' + (alpha * 0.38) + ')';
        ctx.shadowColor = palette.base;
        ctx.shadowBlur = _blur(0.42 * unit);
        ctx.fill();
        ctx.restore();

        ctx.save();
        _traceCrescentArc(ctx, 0, 0, arcR * 1.01, arcStart + 0.06, arcEnd - 0.06, maxThick * 0.44);
        ctx.fillStyle = palette.core;
        ctx.globalAlpha = alpha;
        ctx.fill();
        ctx.restore();

        _drawTangentSparks(ctx, 0, 0, arcR, arcStart, arcEnd, progress, 6, unit, palette, alpha);
      }

      ctx.restore();
    }

  }

  // 飘字提示（伤害、受身、技能名）——命中时弹出伤害数字
  class FloatingText {
    constructor(x, y, text, color, size, opts) {
      opts = opts || {};
      this.x = x;
      this.y = y;
      this.text = text;
      this.color = color || '#ffffff';
      this.baseSize = size || 0.5 * U;
      this.size = this.baseSize;
      this.isDamage = !!opts.isDamage || (typeof text === 'string' && text.charAt(0) === '-');
      this.life = this.isDamage ? 0.80 : 0.7;
      this.maxLife = this.life;
      this.vy = this.isDamage ? -2.0 * U : -1.4 * U;
      this.vx = (Math.random() * 0.6 - 0.3) * U;
      this.pop = this.isDamage ? 1.35 : 1.0;
    }

    update(dt) {
      this.x += this.vx * dt;
      this.y += this.vy * dt;
      this.vy *= 0.90;
      this.vx *= 0.92;
      this.life -= dt;
      // 开头放大再收回
      if (this.isDamage) {
        const t = 1 - this.life / this.maxLife;
        this.pop = t < 0.12 ? 1.35 - t * 1.5 : 1.0;
      }
    }

    // 0 次 shadowBlur：偏移 fillText 叠描边 + 主色 + 白芯(alpha .70)
    draw(ctx) {
      if (this.life <= 0) return;
      const ratio = Math.max(0, this.life / this.maxLife);
      const sz = this.baseSize * this.pop;
      ctx.save();
      ctx.globalAlpha = Math.min(1, ratio * 1.15);
      ctx.font = '700 ' + sz + 'px "PingFang SC","Noto Sans SC","Microsoft YaHei",sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowBlur = 0;
      const ow = Math.max(2, sz * 0.035);
      ctx.fillStyle = '#020617';
      ctx.fillText(this.text, this.x - ow, this.y);
      ctx.fillText(this.text, this.x + ow, this.y);
      ctx.fillText(this.text, this.x, this.y - ow);
      ctx.fillText(this.text, this.x, this.y + ow);
      ctx.fillStyle = this.color;
      ctx.fillText(this.text, this.x, this.y);
      ctx.globalAlpha = Math.max(0, ratio) * 0.70;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(this.text, this.x, this.y - sz * 0.02);
      ctx.restore();
    }
  }

  // 火柴人核心角色类
  class Stickman {
    constructor(opts) {
      this.id = opts.id || 'player';
      this.name = opts.name || '红方';
      this.isAI = !!opts.isAI;
      this.color = opts.color || TEAM_RED;
      this.weapon = opts.weapon || global.Weapons.Galewakizashi;

      this.maxHp = this.weapon.maxHp || 1000;
      this.hp = this.maxHp;

      // 坐标：x为水平，y为地面景深线(2.5D)，z为浮空高度(向上为正)
      this.x = opts.x || 200;
      this.y = opts.y || 320;
      this.z = 0;
      this.vx = 0;
      this.vy = 0;
      this.vz = 0;
      this.gravity = 0;

      this.facing = opts.facing || 1;
      this.moveSpeed = 4.6 * U; // 移动速度约 4.6U/s
      this.radius = 0.5 * U;

      // 状态机：idle | move | attack | skill | hitstun | grabbed | ukemi
      this.state = 'idle';
      this.subPhase = 'none'; // windup | active | recovery
      this.phaseTimer = 0;
      this.actionElapsed = 0;

      // 普攻连段与缓冲
      this.comboIndex = 0;
      this.comboResetTimer = 0;
      this.queuedNextAttack = false;
      this.currentAction = null;
      this.triggeredHitIndices = [];

      // 技能冷却
      this.cds = { s1: 0, s2: 0, s3: 0 };
      this.maxCds = {
        s1: this.weapon.skills.s1.cd,
        s2: this.weapon.skills.s2.cd,
        s3: this.weapon.skills.s3.cd
      };

      // 受击硬直、浮空统计与受身保护
      this.stunTimer = 0;
      this.invulnTimer = 0;
      this.comboTakenDmg = 0;
      this.airborneTime = 0;
      this.comboCountTaken = 0;
      this.grabbedBy = null;
      this.grabTarget = null;
    }

    isAirborne() {
      return this.z > 0.5 || this.vz > 0;
    }

    canCancelWithSkill() {
      if (this.state === 'attack' && this.subPhase === 'recovery' && this.currentAction) {
        return !!this.currentAction.canCancelSkill;
      }
      return false;
    }

    canAct() {
      return this.state === 'idle' || this.state === 'move';
    }

    // 触发受身脱离（无敌0.5s，后跳2.5U）
    triggerUkemi(attackerFacing, effectsList, textsList) {
      this.state = 'ukemi';
      this.stunTimer = 0;
      this.invulnTimer = 0.50;
      this.comboTakenDmg = 0;
      this.airborneTime = 0;
      this.comboCountTaken = 0;
      this.grabbedBy = null;

      // 朝远离攻击者或自身背后方向后跳 2.5U (持续约0.28s)
      const backDir = attackerFacing ? attackerFacing : -this.facing;
      this.vx = backDir * ((2.5 * U) / 0.28);
      this.vy = 0;
      this.z = Math.max(this.z, 12);
      this.vz = 140;
      this.gravity = 900;
      this.phaseTimer = 0.28;

      if (textsList) {
        textsList.push(new FloatingText(this.x, this.y - this.z - 2.0 * U, '受身脱离!', '#E2E8F0', 40));
      }
      if (effectsList) {
        effectsList.push(new SlashEffect({
          x: this.x,
          y: this.y,
          z: this.z,
          facing: this.facing,
          type: 'spin',
          color: '#E2E8F0',
          life: 0.25
        }));
      }
    }

    // 普攻输入请求
    requestAttack(inputDirX) {
      if (this.state === 'hitstun' || this.state === 'grabbed' || this.state === 'ukemi' || this.state === 'skill') {
        return false;
      }
      if (this.state === 'attack') {
        // 在 active 或 recovery 期间预输入下一段普攻
        if (this.comboIndex < this.weapon.combos.length - 1) {
          this.queuedNextAttack = true;
        }
        return true;
      }
      if (inputDirX !== 0) this.facing = inputDirX > 0 ? 1 : -1;
      const idx = this.comboResetTimer > 0 ? this.comboIndex : 0;
      this.startComboStep(idx);
      return true;
    }

    startComboStep(idx) {
      const cfg = this.weapon.combos[idx];
      if (!cfg) return;
      this.state = 'attack';
      this.comboIndex = idx;
      this.currentAction = cfg;
      this.subPhase = 'windup';
      this.phaseTimer = cfg.windup;
      this.actionElapsed = 0;
      this.triggeredHitIndices = [];
      this.queuedNextAttack = false;
      this.vx = 0;
      this.vy = 0;
    }

    // 技能输入请求（支持平地释放与 4A 后摇取消释放）
    requestSkill(skillKey, inputX, inputY, opponent, effectsList, textsList) {
      const sk = this.weapon.skills[skillKey];
      if (!sk || this.cds[skillKey] > 0) return false;
      if (!this.canAct() && !this.canCancelWithSkill()) return false;

      if (this.canCancelWithSkill() && textsList) {
        textsList.push(new FloatingText(this.x, this.y - this.z - 1.9 * U, '技能取消!', '#E2E8F0', 36));
      }

      if (inputX !== 0) {
        this.facing = inputX > 0 ? 1 : -1;
      } else if (opponent) {
        this.facing = opponent.x >= this.x ? 1 : -1;
      }

      this.cds[skillKey] = sk.cd;
      this.state = 'skill';
      this.currentAction = sk;
      this.subPhase = 'windup';
      this.phaseTimer = sk.windup;
      this.actionElapsed = 0;
      this.triggeredHitIndices = [];
      this.queuedNextAttack = false;
      this.comboResetTimer = 0;
      this.grabTarget = null;
      this.vx = 0;
      this.vy = 0;
      this.skillInputY = inputY || 0;

      // S3 影袭·燕返：起手索敌 3.5U
      if (skillKey === 's3' && opponent) {
        const dist = Math.abs(opponent.x - this.x);
        if (dist <= sk.seekRange) {
          this.s3LockTarget = opponent;
        } else {
          this.s3LockTarget = null;
        }
      }
      return true;
    }

    // 执行攻击或技能进入 Active 阶段时的位移与特效
    onEnterActive(opponent, effectsList, arenaBounds) {
      const act = this.currentAction;
      if (!act) return;

      if (this.state === 'attack') {
        // 普攻滑步
        const stepVel = (act.stepX || 0) / Math.max(0.05, act.active);
        this.vx = this.facing * stepVel;
      } else if (this.state === 'skill') {
        if (act.id === 's1') {
          // S1 瞬步·居合：直接向前瞬移 4.5U
          const startX = this.x;
          this.x = Math.max(arenaBounds.minX, Math.min(arenaBounds.maxX, this.x + this.facing * act.teleportX));
          this.vx = 0;
          if (effectsList) {
            effectsList.push(new SlashEffect({
              x: this.x,
              y: this.y,
              z: this.z,
              facing: this.facing,
              type: 'iai',
              color: this.color,
              w: Math.abs(this.x - startX),
              life: 0.28
            }));
          }
          return;
        } else if (act.id === 's2') {
          // S2 旋风升龙斩：向前位移 1.5U + Y轴可偏 0.8U + 自身跃起 2.0U
          this.vx = (this.facing * act.moveX) / act.active;
          this.vy = (this.skillInputY * act.allowYShift) / act.active;
          const jumpT = act.selfJumpTime || 0.55;
          const h = act.selfJumpZ;
          this.gravity = (8 * h) / (jumpT * jumpT);
          this.vz = (4 * h) / jumpT;
        } else if (act.id === 's3') {
          // S3 影袭·燕返：瞬移至目标贴身或向前突进
          if (this.s3LockTarget && Math.abs(this.s3LockTarget.x - this.x) <= act.seekRange * 1.15) {
            this.x = this.s3LockTarget.x - this.facing * 18;
            this.y = this.s3LockTarget.y;
          } else {
            this.x = Math.max(arenaBounds.minX, Math.min(arenaBounds.maxX, this.x + this.facing * (2.2 * U)));
          }
          const jumpT = act.grabDuration;
          const h = 2.6 * U;
          this.gravity = (8 * h) / (jumpT * jumpT);
          this.vz = (4 * h) / jumpT;
        }
      }

      if (effectsList) {
        effectsList.push(new SlashEffect({
          x: this.x + this.facing * 0.75 * U,
          y: this.y,
          z: this.z,
          facing: this.facing,
          type: act.vfx || 'slash_h',
          color: this.color,
          w: act.hitbox ? act.hitbox.w : 1.6 * U,
          life: Math.max(0.18, act.active + 0.08)
        }));
      }
    }

    // 处理判定框与对手受击
    checkActionHits(opponent, effectsList, textsList, arenaBounds) {
      const act = this.currentAction;
      if (!act || !act.hits || !opponent || opponent.hp <= 0) return;

      for (let i = 0; i < act.hits.length; i++) {
        if (this.triggeredHitIndices.indexOf(i) !== -1) continue;
        const hitCfg = act.hits[i];
        if (this.actionElapsed >= hitCfg.time) {
          this.triggeredHitIndices.push(i);

          // S3 第二段砸地：若已抓中对手则必中
          if (hitCfg.isSlam && this.grabTarget === opponent) {
            this.z = 0;
            this.vz = 0;
            opponent.z = 0;
            opponent.grabbedBy = null;
            this.grabTarget = null;
            this.applyHitToTarget(opponent, hitCfg, act, effectsList, textsList, arenaBounds);
            continue;
          }

          // 常规矩形判定框检测
          const hb = act.hitbox;
          const centerX = this.x + this.facing * hb.offsetX;
          const halfW = hb.w * 0.5;
          const dx = Math.abs(opponent.x - centerX);
          const dy = Math.abs(opponent.y - this.y);
          const dz = Math.abs(opponent.z - this.z);

          if (dx <= halfW + opponent.radius && dy <= hb.h * 0.65 && dz <= 2.8 * U) {
            this.applyHitToTarget(opponent, hitCfg, act, effectsList, textsList, arenaBounds);
          }
        }
      }
    }

    applyHitToTarget(target, hitCfg, act, effectsList, textsList, arenaBounds) {
      if (target.invulnTimer > 0) return;

      target.hp = Math.max(0, target.hp - hitCfg.dmg);
      target.comboTakenDmg += hitCfg.dmg;
      target.comboCountTaken += 1;
      target.stunTimer = Math.max(target.stunTimer, hitCfg.stun || 0.25);

      // 抓取控制处理 (S3第一段)
      if (hitCfg.isGrab) {
        this.grabTarget = target;
        target.grabbedBy = this;
        target.state = 'grabbed';
      } else {
        target.grabbedBy = null;
        target.state = 'hitstun';
      }

      // 水平击退
      const push = (hitCfg.pushX || 0) * this.facing;
      target.x = Math.max(arenaBounds.minX, Math.min(arenaBounds.maxX, target.x + push));
      target.vx = (push / 0.15) * 0.35;

      // 浮空抛物线物理：峰值高度 launchZ，总滞空 airTime
      if (hitCfg.launchZ && hitCfg.launchZ > 0 && hitCfg.airTime > 0) {
        const H = hitCfg.launchZ;
        const T = hitCfg.airTime;
        target.gravity = (8 * H) / (T * T);
        target.vz = (4 * H) / T;
        target.z = Math.max(target.z, 2);
      } else if (target.isAirborne()) {
        // 空中追击小幅托举
        target.vz = Math.max(target.vz, 95);
        target.gravity = target.gravity || 950;
      }

      if (textsList) {
        const big = hitCfg.dmg >= 80;
        const hitLabel = '-' + hitCfg.dmg +
          (target.comboCountTaken > 1 ? ' · ' + target.comboCountTaken + ' HIT' : '');
        textsList.push(new FloatingText(
          target.x + (Math.random() * 0.7 - 0.35) * U,
          target.y - target.z - 2.7 * U,
          hitLabel,
          big ? '#FF8A99' : '#F1F5F9',
          big ? 64 : 52,
          { isDamage: true }
        ));
      }

      if (effectsList && hitCfg.isSlam) {
        effectsList.push(new SlashEffect({
          x: target.x,
          y: target.y,
          z: 0,
          facing: this.facing,
          type: 'swallow_return',
          color: this.color,
          life: 0.32
        }));
      }
    }

    update(dt, inputState, opponent, effectsList, textsList, arenaBounds) {
      // 1. 冷却递减
      for (const k in this.cds) {
        if (this.cds[k] > 0) this.cds[k] = Math.max(0, this.cds[k] - dt);
      }
      if (this.invulnTimer > 0) this.invulnTimer = Math.max(0, this.invulnTimer - dt);
      if (this.comboResetTimer > 0) {
        this.comboResetTimer = Math.max(0, this.comboResetTimer - dt);
        if (this.comboResetTimer === 0 && this.state !== 'attack') {
          this.comboIndex = 0;
        }
      }

      // 2. 浮空时间与连段重置统计
      if (this.state === 'hitstun' || this.state === 'grabbed' || this.isAirborne()) {
        if (this.isAirborne() || this.state === 'grabbed') {
          this.airborneTime += dt;
        }
      } else {
        this.comboTakenDmg = 0;
        this.airborneTime = 0;
        this.comboCountTaken = 0;
      }

      // 3. 被抓取同步状态
      if (this.state === 'grabbed' && this.grabbedBy) {
        this.x = this.grabbedBy.x + this.grabbedBy.facing * 16;
        this.y = this.grabbedBy.y;
        this.z = Math.max(0, this.grabbedBy.z + 10);
        return;
      }

      // 4. 受身状态更新
      if (this.state === 'ukemi') {
        this.phaseTimer -= dt;
        if (this.phaseTimer <= 0 && !this.isAirborne()) {
          this.state = 'idle';
          this.vx = 0;
        }
      }

      // 5. 受击硬直状态更新
      if (this.state === 'hitstun') {
        this.stunTimer -= dt;
        this.vx *= 0.85;
        if (this.stunTimer <= 0 && !this.isAirborne()) {
          this.state = 'idle';
          this.vx = 0;
        }
      }

      // 6. 普攻与技能阶段推进
      if (this.state === 'attack' || this.state === 'skill') {
        this.phaseTimer -= dt;

        if (this.subPhase === 'windup') {
          if (this.phaseTimer <= 0) {
            this.subPhase = 'active';
            this.phaseTimer = this.currentAction.active;
            this.actionElapsed = 0;
            this.onEnterActive(opponent, effectsList, arenaBounds);
          }
        } else if (this.subPhase === 'active') {
          this.actionElapsed += dt;
          this.checkActionHits(opponent, effectsList, textsList, arenaBounds);
          if (this.phaseTimer <= 0) {
            this.subPhase = 'recovery';
            this.phaseTimer = this.currentAction.recovery;
            this.vx = 0;
            this.vy = 0;
          }
        } else if (this.subPhase === 'recovery') {
          // 普攻连按衔接下一段
          if (this.state === 'attack' && this.queuedNextAttack && this.phaseTimer <= this.currentAction.recovery * 0.65) {
            const nextIdx = this.comboIndex + 1;
            if (nextIdx < this.weapon.combos.length) {
              this.startComboStep(nextIdx);
              return;
            }
          }
          if (this.phaseTimer <= 0) {
            if (this.state === 'attack') {
              this.comboIndex = (this.comboIndex + 1) % this.weapon.combos.length;
              this.comboResetTimer = 0.45;
            }
            this.state = 'idle';
            this.subPhase = 'none';
            this.currentAction = null;
          }
        }
      }

      // 7. 自由移动状态
      if (this.canAct() && inputState) {
        const mx = inputState.moveX || 0;
        const my = inputState.moveY || 0;
        if (Math.abs(mx) > 0.08 || Math.abs(my) > 0.08) {
          this.state = 'move';
          this.vx = mx * this.moveSpeed;
          this.vy = my * (this.moveSpeed * 0.65);
          if (Math.abs(mx) > 0.08) this.facing = mx > 0 ? 1 : -1;
        } else {
          this.state = 'idle';
          this.vx = 0;
          this.vy = 0;
        }
      }

      // 8. 物理位置与 Z 轴重力积分
      this.x += this.vx * dt;
      this.y += this.vy * dt;

      if (this.z > 0 || this.vz !== 0) {
        this.z += this.vz * dt;
        this.vz -= (this.gravity || 980) * dt;
        if (this.z <= 0) {
          this.z = 0;
          this.vz = 0;
          // 落地弹地缓冲
          if (this.state === 'hitstun' && this.stunTimer <= 0.05) {
            this.state = 'idle';
          }
        }
      }

      // 场地边界限制
      if (arenaBounds) {
        this.x = Math.max(arenaBounds.minX, Math.min(arenaBounds.maxX, this.x));
        this.y = Math.max(arenaBounds.minY, Math.min(arenaBounds.maxY, this.y));
      }
    }

    draw(ctx) {
      var unit = U;
      var drawX = this.x || 0;
      // Screen draw height accounts for airborne z
      var groundY = this.y || 0;
      var drawY = groundY - (this.z || 0);
      var facing = (this.facing === -1) ? -1 : 1;
      var state = String(this.state || 'idle').toLowerCase();
      var team = this.isAI ? 'blue' : 'red';
      var palette = _getStickmanPalette(team);

      var rawTime = Date.now() * 0.006;

      var isAttacking = (state === 'attack' || state === 'skill');
      var slashProg = 0;
      if (isAttacking && this.currentAction) {
        var tot = (this.currentAction.windup || 0) + (this.currentAction.active || 0) + (this.currentAction.recovery || 0);
        if (tot > 0) slashProg = Math.max(0, Math.min(1, (this.actionElapsed || 0) / tot));
        else if (this.subPhase === 'active') slashProg = 0.55;
        else if (this.subPhase === 'windup') slashProg = 0.2;
        else slashProg = 0.85;
      }

      var isHurt = (state === 'hitstun' || state === 'grabbed');
      var isDead = (typeof this.hp === 'number' && this.hp <= 0);
      var isUkemi = (state === 'ukemi');
      var isRun = (state === 'move');

      var isHurtFlash = isHurt && (Math.floor(Date.now() / 45) % 2 === 0);
      // Keep invuln flicker from combat
      var flick = this.invulnTimer > 0 && Math.floor(this.invulnTimer * 25) % 2 === 0;
      var baseA = flick ? 0.55 : 1;

      ctx.save();
      ctx.globalAlpha = baseA;

      // 1. Ground puddle glow at feet（渐变按阵营缓存，每帧 0 次创建）
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      var puddleW = (isDead ? 1.15 : 0.78) * unit;
      var puddleH = 0.16 * unit;
      var shadowScale = Math.max(0.35, 1 - (this.z || 0) / (4 * unit));
      puddleW *= shadowScale;
      puddleH *= shadowScale;

      ctx.translate(drawX, groundY);
      ctx.scale(puddleW, puddleH);
      ctx.fillStyle = _getFloorGradient(ctx, team);
      ctx.beginPath();
      ctx.arc(0, 0, 1, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Soft dark shadow under puddle
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.ellipse(drawX, groundY, 0.55 * unit * shadowScale, 0.22 * unit * shadowScale, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 2. Local body transform
      ctx.save();
      ctx.translate(drawX, drawY);

      var scaleX = 1;
      var scaleY = 1;
      var bodyRot = 0;

      if (isHurt) {
        scaleX = 1.12;
        scaleY = 0.88;
        bodyRot = -facing * 0.16;
      } else if (isDead) {
        scaleX = 1.25;
        scaleY = 0.32;
      } else if (isUkemi) {
        bodyRot = facing * rawTime * 6.0;
      } else if (isAttacking) {
        var stretch = Math.sin(slashProg * Math.PI);
        scaleX = 1 + stretch * 0.12;
        scaleY = 1 - stretch * 0.06;
      }

      ctx.rotate(bodyRot);
      ctx.scale(facing * scaleX, scaleY);

      var headR = 0.32 * unit;
      var baseHeadY = -2.05 * unit;
      var baseNeckY = -1.65 * unit;
      var baseHipY = -0.85 * unit;
      var bladeLen = 1.05 * unit;
      var boneRadius = 0.068 * unit;

      var bobY = 0;
      var leanX = 0;
      if (state === 'idle') {
        bobY = Math.sin(rawTime * 2.5) * (0.035 * unit);
      } else if (isRun) {
        bobY = -Math.abs(Math.sin(rawTime * 8.0)) * (0.07 * unit);
        leanX = 0.18 * unit;
      } else if (isAttacking) {
        leanX = Math.sin(slashProg * Math.PI) * (0.22 * unit);
        bobY = Math.sin(slashProg * Math.PI) * (0.05 * unit);
      } else if (isHurt) {
        leanX = -0.15 * unit;
      }

      var hipX = -leanX * 0.25;
      var hipY = baseHipY + bobY * 0.6;
      var neckX = leanX * 0.65;
      var neckY = baseNeckY + bobY;
      var headX = leanX * 0.85;
      var headY = baseHeadY + bobY;

      var fKneeX, fKneeY, fFootX, fFootY;
      var bKneeX, bKneeY, bFootX, bFootY;
      var fElbowX, fElbowY, fHandX, fHandY;
      var bElbowX, bElbowY, bHandX, bHandY;

      if (isRun) {
        var cycle = rawTime * 8.0;
        var s1 = Math.sin(cycle);
        var c1 = Math.cos(cycle);

        fKneeX = hipX + s1 * 0.32 * unit + 0.12 * unit;
        fKneeY = hipY + 0.42 * unit - Math.max(0, c1) * 0.15 * unit;
        fFootX = hipX + s1 * 0.52 * unit;
        fFootY = Math.min(0, -Math.max(0, c1) * 0.22 * unit);

        bKneeX = hipX - s1 * 0.32 * unit + 0.08 * unit;
        bKneeY = hipY + 0.42 * unit - Math.max(0, -c1) * 0.15 * unit;
        bFootX = hipX - s1 * 0.52 * unit;
        bFootY = Math.min(0, -Math.max(0, -c1) * 0.22 * unit);

        fElbowX = neckX + 0.15 * unit;
        fElbowY = neckY + 0.34 * unit;
        fHandX = neckX + 0.46 * unit;
        fHandY = neckY + 0.26 * unit + Math.sin(cycle) * 0.05 * unit;

        bElbowX = neckX - 0.22 * unit - s1 * 0.15 * unit;
        bElbowY = neckY + 0.32 * unit;
        bHandX = bElbowX - 0.12 * unit;
        bHandY = bElbowY + 0.24 * unit;
      } else if (isAttacking) {
        var lunge = Math.sin(slashProg * Math.PI);
        fKneeX = hipX + (0.34 + lunge * 0.14) * unit;
        fKneeY = hipY + 0.42 * unit;
        fFootX = hipX + (0.48 + lunge * 0.18) * unit;
        fFootY = 0;

        bKneeX = hipX - (0.28 + lunge * 0.10) * unit;
        bKneeY = hipY + 0.44 * unit;
        bFootX = hipX - (0.48 + lunge * 0.14) * unit;
        bFootY = 0;

        var swingArc = -1.25 + slashProg * 2.35;
        fElbowX = neckX + Math.cos(swingArc * 0.6) * 0.34 * unit;
        fElbowY = neckY + Math.sin(swingArc * 0.6) * 0.34 * unit + 0.12 * unit;
        fHandX = fElbowX + Math.cos(swingArc) * 0.36 * unit;
        fHandY = fElbowY + Math.sin(swingArc) * 0.36 * unit;

        bElbowX = neckX - 0.24 * unit;
        bElbowY = neckY + 0.28 * unit;
        bHandX = bElbowX - 0.20 * unit;
        bHandY = bElbowY + 0.18 * unit;
      } else if (isHurt) {
        fKneeX = hipX + 0.22 * unit;
        fKneeY = hipY + 0.42 * unit;
        fFootX = hipX + 0.32 * unit;
        fFootY = 0;

        bKneeX = hipX - 0.25 * unit;
        bKneeY = hipY + 0.44 * unit;
        bFootX = hipX - 0.38 * unit;
        bFootY = 0;

        fElbowX = neckX + 0.15 * unit;
        fElbowY = neckY + 0.12 * unit;
        fHandX = fElbowX + 0.22 * unit;
        fHandY = fElbowY - 0.18 * unit;

        bElbowX = neckX - 0.28 * unit;
        bElbowY = neckY + 0.15 * unit;
        bHandX = bElbowX - 0.22 * unit;
        bHandY = bElbowY - 0.14 * unit;
      } else {
        var breath = Math.sin(rawTime * 2.5);
        fKneeX = hipX + 0.26 * unit;
        fKneeY = hipY + 0.42 * unit;
        fFootX = hipX + 0.34 * unit;
        fFootY = 0;

        bKneeX = hipX - 0.22 * unit;
        bKneeY = hipY + 0.42 * unit;
        bFootX = hipX - 0.32 * unit;
        bFootY = 0;

        fElbowX = neckX + 0.20 * unit;
        fElbowY = neckY + 0.32 * unit + breath * 0.02 * unit;
        fHandX = neckX + 0.50 * unit;
        fHandY = neckY + 0.24 * unit + breath * 0.03 * unit;

        bElbowX = neckX - 0.16 * unit;
        bElbowY = neckY + 0.30 * unit + breath * 0.02 * unit;
        bHandX = neckX + 0.16 * unit;
        bHandY = neckY + 0.34 * unit + breath * 0.03 * unit;
      }

      var localWeaponAngle;
      if (isAttacking) {
        localWeaponAngle = -1.65 + slashProg * 2.85;
      } else if (isRun) {
        localWeaponAngle = 0.22 + Math.sin(rawTime * 8.0) * 0.08;
      } else if (isHurt) {
        localWeaponAngle = -0.65;
      } else {
        localWeaponAngle = -0.12 + Math.sin(rawTime * 2.5) * 0.04;
      }

      // Back limbs（背侧不启用 blur，控制单角色 ≤10 次）
      ctx.save();
      ctx.globalAlpha = baseA * 0.78;
      _drawNeonBone(ctx, hipX, hipY, bKneeX, bKneeY, boneRadius * 0.92, palette, isHurtFlash, false);
      _drawNeonBone(ctx, bKneeX, bKneeY, bFootX, bFootY, boneRadius * 0.88, palette, isHurtFlash, false);
      _drawNeonBone(ctx, neckX, neckY, bElbowX, bElbowY, boneRadius * 0.88, palette, isHurtFlash, false);
      _drawNeonBone(ctx, bElbowX, bElbowY, bHandX, bHandY, boneRadius * 0.82, palette, isHurtFlash, false);
      ctx.restore();

      // Spine + head
      ctx.globalAlpha = baseA;
      _drawNeonBone(ctx, neckX, neckY, hipX, hipY, boneRadius * 1.08, palette, isHurtFlash, true);
      _drawNeonHead(ctx, headX, headY, headR, boneRadius * 0.95, palette, isHurtFlash);

      // Face visor：红方 1 条 / 蓝方 2 条（形状冗余编码，0 blur）
      ctx.save();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 0.038 * unit;
      ctx.beginPath();
      ctx.moveTo(headX + headR * 0.18, headY - headR * 0.08);
      ctx.lineTo(headX + headR * 0.82, headY - headR * 0.02);
      if (this.isAI) {
        ctx.moveTo(headX + headR * 0.18, headY + headR * 0.14);
        ctx.lineTo(headX + headR * 0.82, headY + headR * 0.20);
      }
      ctx.stroke();
      ctx.restore();

      // Headband ribbon：阵营中值色（0 blur）
      ctx.save();
      ctx.strokeStyle = palette.mid;
      ctx.lineWidth = Math.max(2.5, 0.07 * unit);
      var wave = Math.sin(rawTime * 2.5) * 0.1 * unit;
      ctx.beginPath();
      ctx.moveTo(headX - headR * 0.8, headY - headR * 0.2);
      ctx.quadraticCurveTo(
        headX - 0.8 * unit, headY - 0.1 * unit + wave,
        headX - 1.15 * unit, headY - 0.05 * unit - wave
      );
      ctx.stroke();
      ctx.restore();

      // Front legs
      _drawNeonBone(ctx, hipX, hipY, fKneeX, fKneeY, boneRadius, palette, isHurtFlash, true);
      _drawNeonBone(ctx, fKneeX, fKneeY, fFootX, fFootY, boneRadius * 0.95, palette, isHurtFlash, true);

      // Katana then front arm
      _drawNeonKatana(ctx, fHandX, fHandY, localWeaponAngle, bladeLen, unit, palette, slashProg, isAttacking);
      _drawNeonBone(ctx, neckX, neckY, fElbowX, fElbowY, boneRadius * 0.95, palette, isHurtFlash, true);
      _drawNeonBone(ctx, fElbowX, fElbowY, fHandX, fHandY, boneRadius * 0.90, palette, isHurtFlash, true);

      ctx.restore(); // local transform

      // Hurt sparks（0 blur，仅改 alpha）
      if (isHurt) {
        ctx.save();
        var sparkCenterY = drawY - 1.35 * unit;
        ctx.lineWidth = 0.03 * unit;
        for (var i = 0; i < 6; i++) {
          var sAngle = (i / 6) * Math.PI * 2 + rawTime * 10;
          var r1 = 0.18 * unit;
          var r2 = (0.45 + (i % 2) * 0.22) * unit;
          ctx.beginPath();
          ctx.moveTo(drawX + Math.cos(sAngle) * r1, sparkCenterY + Math.sin(sAngle) * r1);
          ctx.lineTo(drawX + Math.cos(sAngle) * r2, sparkCenterY + Math.sin(sAngle) * r2);
          ctx.strokeStyle = (i % 2 === 0) ? 'rgba(255,255,255,0.70)' : palette.mid;
          ctx.stroke();
        }
        ctx.restore();
      }

      ctx.restore();
    }

  }

  // 兼容旧引用保留占位类
  class Projectile {}

  global.Entities = {
    U: U,
    Stickman: Stickman,
    MeleeSwing: SlashEffect,
    SlashEffect: SlashEffect,
    FloatingText: FloatingText,
    Projectile: Projectile
  };
})(window);
