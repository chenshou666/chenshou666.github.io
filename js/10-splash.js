/* ============================================================================
 * 10-splash.js — 开屏动画引擎（极光跃迁纯动画新版 / 经典简洁旧版 / 关闭，支持重播）
 * 加载顺序 10/12：按编号顺序加载
 * 注意：本站是经典 <script>（非 ES Module），所有 js/ 文件共享同一个全局作用域，
 *       编号即加载顺序；调整顺序或拆合并文件前请先读 docs/ARCHITECTURE.md。
 *
 * 模式读取优先级：
 *   1. URL 参数 ?splash=cinema|classic|off（兼容别名 new → cinema, legacy → classic）
 *   2. localStorage["cquest.appearance.v1"].splashMode
 *   3. 默认 "cinema"（极光跃迁纯动画）
 *
 * 对外接口：window.HTSplash = { replay(mode), getMode(), normalizeMode(v) }
 * ========================================================================== */
(function () {
  "use strict";

  var STORE_KEY = "cquest.appearance.v1";
  var VALID_MODES = { cinema: "cinema", classic: "classic", off: "off" };
  var ALIAS_MODES = { new: "cinema", legacy: "classic", old: "classic", none: "off" };

  function normalizeMode(v) {
    if (!v) return "cinema";
    var key = String(v).trim().toLowerCase();
    if (VALID_MODES[key]) return VALID_MODES[key];
    if (ALIAS_MODES[key]) return ALIAS_MODES[key];
    return "cinema";
  }

  function querySplashMode() {
    try {
      var m = /[?&]splash=([^&]+)/i.exec(window.location.search || "");
      return m ? normalizeMode(decodeURIComponent(m[1])) : "";
    } catch (e) {
      return "";
    }
  }

  function savedSplashMode() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (!raw) return "cinema";
      var obj = JSON.parse(raw);
      if (obj && obj.splashMode) return normalizeMode(obj.splashMode);
    } catch (e) {}
    return "cinema";
  }

  function getActiveMode() {
    return querySplashMode() || savedSplashMode();
  }

  var activeController = null;

  /* 供「重播开屏」动态重建 DOM，与 index.html 静态壳完全一致 */
  function createSplashElement() {
    var div = document.createElement("div");
    div.className = "splash-screen";
    div.id = "splash-screen";
    div.setAttribute("role", "status");
    div.setAttribute("aria-label", "正在启动");
    div.innerHTML = ''
      + '<canvas class="splash-canvas" aria-hidden="true"></canvas>'
      + '<div class="splash-grain" aria-hidden="true"></div>'
      + '<button class="splash-skip" id="splash-skip" type="button">跳过 <span aria-hidden="true">↗</span></button>'
      + '<div class="splash-content">'
        + '<div class="splash-logo-stage" aria-hidden="true">'
          + '<div class="splash-aura"></div>'
          + '<div class="splash-flare"></div>'
          + '<svg class="splash-rings" viewBox="0 0 280 280">'
            + '<defs>'
              + '<linearGradient id="splashRingGradA" x1="0%" y1="0%" x2="100%" y2="100%">'
                + '<stop offset="0%" stop-color="#38bdf8" stop-opacity="0.98"/>'
                + '<stop offset="50%" stop-color="#818cf8" stop-opacity="0.55"/>'
                + '<stop offset="100%" stop-color="#c084fc" stop-opacity="0.95"/>'
              + '</linearGradient>'
              + '<linearGradient id="splashRingGradB" x1="100%" y1="0%" x2="0%" y2="100%">'
                + '<stop offset="0%" stop-color="#e0f2fe" stop-opacity="0.95"/>'
                + '<stop offset="55%" stop-color="#34d399" stop-opacity="0.5"/>'
                + '<stop offset="100%" stop-color="#a855f7" stop-opacity="0.9"/>'
              + '</linearGradient>'
            + '</defs>'
            + '<circle class="splash-ring-outer" cx="140" cy="140" r="124"/>'
            + '<circle class="splash-ring-ticks" cx="140" cy="140" r="106"/>'
            + '<circle class="splash-ring-inner" cx="140" cy="140" r="90"/>'
            + '<g class="splash-orbit-beacon"><circle cx="140" cy="16" r="3.6" fill="#e0f2fe"/><circle cx="140" cy="16" r="10" fill="#38bdf8" fill-opacity="0.32"/></g>'
          + '</svg>'
          + '<div class="splash-pulse"></div>'
          + '<div class="splash-pulse-alt"></div>'
          + '<div class="splash-mark"><span class="splash-mark-arc"></span><span class="splash-sheen"></span><span class="splash-code">HT</span></div>'
        + '</div>'
      + '</div>'
      + '<div class="splash-bar" aria-hidden="true"><span class="splash-bar-fill"></span></div>';
    return div;
  }

  /* ------------------------------------------------------------------------
   * 极光跃迁 Canvas 2D 光流引擎（纯视觉、零依赖、60fps）
   *   0.00–0.65s：超空间径向星流旋入奇点
   *   0.55–1.55s：核心点亮，双色冲击波扩散 + 轨道双彗星光弧 + 爆发微尘漂移
   *   1.55–2.20s：能量余晖加速扩散，衔接主页极光画布
   * ---------------------------------------------------------------------- */
  function startWarpCanvas(canvas) {
    if (!canvas || !canvas.getContext) return function () {};
    var ctx = canvas.getContext("2d");
    if (!ctx) return function () {};

    var rafId = 0;
    var stopped = false;
    var w = 0, h = 0, dpr = 1;
    var startTs = performance.now();
    var COLORS = ["#38bdf8", "#818cf8", "#a855f7", "#34d399", "#e0f2fe"];
    var isSmall = window.innerWidth <= 620;
    var streakCount = isSmall ? 46 : 92;
    var streaks = [];
    var sparks = [];

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function init() {
      streaks = [];
      sparks = [];
      var maxR = Math.hypot(w, h) * 0.62;
      for (var i = 0; i < streakCount; i++) {
        streaks.push({
          angle: (Math.PI * 2 * i) / streakCount + (Math.random() - 0.5) * 0.35,
          r0: maxR * (0.45 + Math.random() * 0.72),
          speed: 0.75 + Math.random() * 0.55,
          twist: (Math.random() > 0.5 ? 1 : -1) * (0.45 + Math.random() * 0.55),
          width: 0.9 + Math.random() * 1.4,
          color: COLORS[i % COLORS.length],
          alpha: 0.42 + Math.random() * 0.52
        });
      }
      var sparkCount = isSmall ? 32 : 64;
      for (var j = 0; j < sparkCount; j++) {
        sparks.push({
          angle: Math.random() * Math.PI * 2,
          v: 70 + Math.random() * (Math.min(w, h) * 0.38),
          spin: (Math.random() > 0.5 ? 1 : -1) * (0.3 + Math.random() * 0.6),
          size: 1 + Math.random() * 2.2,
          color: COLORS[j % COLORS.length],
          phase: Math.random() * Math.PI * 2
        });
      }
    }

    resize();
    init();
    window.addEventListener("resize", resize);

    function draw(now) {
      if (stopped) return;
      var t = (now - startTs) / 1000;
      var cx = w * 0.5;
      var cy = h * 0.5;
      var minDim = Math.min(w, h);

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "screen";

      /* 1) 深空极光中心呼吸光井 */
      var glowPower = Math.min(1, t / 0.65);
      var coreR = minDim * (0.34 + 0.06 * Math.sin(t * 2.8));
      var g1 = ctx.createRadialGradient(
        cx - Math.cos(t * 1.4) * 38, cy - Math.sin(t * 1.2) * 28, 0,
        cx, cy, coreR * 1.15
      );
      g1.addColorStop(0, "rgba(56, 189, 248, " + (0.28 * glowPower).toFixed(3) + ")");
      g1.addColorStop(0.45, "rgba(129, 140, 248, " + (0.13 * glowPower).toFixed(3) + ")");
      g1.addColorStop(1, "transparent");
      ctx.fillStyle = g1;
      ctx.beginPath();
      ctx.arc(cx, cy, coreR * 1.15, 0, Math.PI * 2);
      ctx.fill();

      var g2 = ctx.createRadialGradient(
        cx + Math.cos(t * 1.1) * 44, cy + Math.sin(t * 1.5) * 32, 0,
        cx, cy, coreR
      );
      g2.addColorStop(0, "rgba(168, 85, 247, " + (0.24 * glowPower).toFixed(3) + ")");
      g2.addColorStop(0.5, "rgba(52, 211, 153, " + (0.08 * glowPower).toFixed(3) + ")");
      g2.addColorStop(1, "transparent");
      ctx.fillStyle = g2;
      ctx.beginPath();
      ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
      ctx.fill();

      /* 2) Phase 1 (0–0.85s)：超空间光丝旋入中心奇点 */
      if (t < 0.92) {
        for (var i = 0; i < streaks.length; i++) {
          var s = streaks[i];
          var prog = Math.min(1, (t * s.speed) / 0.68);
          var ease = prog * prog * prog;
          var headR = s.r0 * (1 - ease);
          var tailR = Math.min(s.r0, headR + 28 + (1 - prog) * 110);
          var ang = s.angle + ease * s.twist;
          var fade = Math.sin(Math.min(1, prog) * Math.PI);
          if (fade <= 0.01) continue;

          var x1 = cx + Math.cos(ang) * headR;
          var y1 = cy + Math.sin(ang) * headR;
          var x2 = cx + Math.cos(ang - 0.06 * s.twist) * tailR;
          var y2 = cy + Math.sin(ang - 0.06 * s.twist) * tailR;

          ctx.globalAlpha = s.alpha * fade;
          ctx.strokeStyle = s.color;
          ctx.lineWidth = s.width;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      }

      /* 3) 核心点亮闪光（0.42–0.92s） */
      if (t >= 0.38 && t <= 0.95) {
        var fp = (t - 0.38) / 0.57;
        var flash = Math.sin(fp * Math.PI);
        var fg = ctx.createRadialGradient(cx, cy, 0, cx, cy, minDim * 0.28);
        fg.addColorStop(0, "rgba(255, 255, 255, " + (0.68 * flash).toFixed(3) + ")");
        fg.addColorStop(0.35, "rgba(125, 211, 252, " + (0.34 * flash).toFixed(3) + ")");
        fg.addColorStop(1, "transparent");
        ctx.globalAlpha = 1;
        ctx.fillStyle = fg;
        ctx.beginPath();
        ctx.arc(cx, cy, minDim * 0.28, 0, Math.PI * 2);
        ctx.fill();
      }

      /* 4) Phase 2+ (0.55s+)：脉冲扩散微尘 + 双轨道彗星拖尾 */
      if (t >= 0.52) {
        var bt = t - 0.52;
        var burstEase = 1 - Math.pow(1 - Math.min(1, bt / 1.15), 3);

        for (var j = 0; j < sparks.length; j++) {
          var p = sparks[j];
          var dist = 48 + p.v * burstEase + bt * 18;
          var ang2 = p.angle + bt * p.spin;
          var px = cx + Math.cos(ang2) * dist;
          var py = cy + Math.sin(ang2) * dist;
          var tw = 0.55 + 0.45 * Math.sin(t * 5.2 + p.phase);
          var fadeOut = Math.max(0, 1 - bt / 2.1);

          ctx.globalAlpha = tw * fadeOut * 0.85;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(px, py, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        /* 双反向轨道彗星拖尾 */
        var orbitR = isSmall ? 100 : 124;
        var cometAlpha = Math.min(1, bt / 0.25) * Math.max(0, 1 - Math.max(0, bt - 1.15) / 0.65);
        if (cometAlpha > 0.01) {
          for (var c = 0; c < 2; c++) {
            var dir = c === 0 ? 1 : -1;
            var baseA = (c === 0 ? -Math.PI * 0.5 : Math.PI * 0.5) + bt * 2.75 * dir;
            var segs = 14;
            for (var k = 0; k < segs; k++) {
              var a0 = baseA - dir * (k * 0.052);
              var a1 = baseA - dir * ((k + 1) * 0.052);
              var ratio = 1 - k / segs;
              ctx.globalAlpha = cometAlpha * ratio * ratio * 0.85;
              ctx.strokeStyle = c === 0 ? "#7dd3fc" : "#d8b4fe";
              ctx.lineWidth = 2.6 * ratio;
              ctx.lineCap = "round";
              ctx.beginPath();
              ctx.arc(cx, cy, orbitR + (c === 0 ? 0 : -18), a0, a1, dir > 0);
              ctx.stroke();
            }
          }
        }
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      rafId = requestAnimationFrame(draw);
    }

    rafId = requestAnimationFrame(draw);

    return function stop() {
      stopped = true;
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }

  /* ------------------------------------------------------------------------
   * 播放控制器（支持首屏与随时重播）
   * ---------------------------------------------------------------------- */
  function runSplash(mode, isReplay) {
    if (activeController && activeController.cancel) {
      activeController.cancel();
    }

    var resolved = normalizeMode(mode);
    var existing = document.getElementById("splash-screen");
    var reduced = !!(window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    if (resolved === "off" && !isReplay) {
      document.body.classList.remove("splash-active");
      if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
      return;
    }

    if (isReplay) {
      if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
      existing = createSplashElement();
      existing.classList.add("is-replaying");
      document.body.appendChild(existing);
    }

    var splash = existing;
    if (!splash) {
      document.body.classList.remove("splash-active");
      return;
    }

    var skip = splash.querySelector("#splash-skip") || splash.querySelector(".splash-skip");
    var canvas = splash.querySelector(".splash-canvas");
    var launched = false;
    var openedAt = Date.now();
    var stopCanvas = function () {};

    splash.setAttribute("data-splash-mode", resolved === "classic" ? "classic" : "cinema");
    document.body.classList.add("splash-active");

    void splash.offsetWidth;
    splash.classList.add("is-ready");

    if (resolved !== "classic" && !reduced && canvas) {
      stopCanvas = startWarpCanvas(canvas);
    }

    var skipDelay = reduced ? 0 : (resolved === "classic" ? 600 : 280);
    var totalDuration = reduced ? 200 : (resolved === "classic" ? 1350 : 2150);
    var leaveMs = reduced ? 160 : 540;

    function finish(immediate) {
      if (launched) return;
      launched = true;
      window.clearTimeout(skipTimer);
      window.clearTimeout(revealTimer);
      window.removeEventListener("keydown", onKey);
      if (skip) skip.removeEventListener("click", onSkipClick);
      splash.removeEventListener("click", onBackdropClick);
      stopCanvas();

      document.body.classList.remove("splash-active");
      splash.classList.add("is-leaving");
      splash.classList.remove("is-replaying");

      if (immediate) {
        if (splash.parentNode) splash.parentNode.removeChild(splash);
        if (activeController && activeController.el === splash) activeController = null;
        return;
      }

      window.setTimeout(function () {
        if (splash.parentNode) splash.parentNode.removeChild(splash);
        if (activeController && activeController.el === splash) activeController = null;
      }, leaveMs);
    }

    function onSkipClick(e) {
      e.stopPropagation();
      finish(false);
    }

    function onBackdropClick(e) {
      if (Date.now() - openedAt < 320) return;
      if (e.target && e.target.closest && e.target.closest("#splash-skip")) return;
      finish(false);
    }

    function onKey(e) {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        if (e.key === " ") e.preventDefault();
        finish(false);
      }
    }

    var skipTimer = window.setTimeout(function () {
      if (!launched) splash.classList.add("can-skip");
    }, skipDelay);

    var revealTimer = window.setTimeout(function () {
      finish(false);
    }, totalDuration);

    if (skip) skip.addEventListener("click", onSkipClick);
    splash.addEventListener("click", onBackdropClick);
    window.addEventListener("keydown", onKey);

    activeController = {
      el: splash,
      cancel: function () { finish(true); }
    };
  }

  window.HTSplash = {
    normalizeMode: normalizeMode,
    getMode: getActiveMode,
    replay: function (mode) {
      var target = mode ? normalizeMode(mode) : getActiveMode();
      if (target === "off") target = "cinema";
      runSplash(target, true);
    }
  };

  runSplash(getActiveMode(), false);
})();
