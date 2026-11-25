/* ============================================================================
 * 10-splash.js — 开屏动画引擎（极光棱镜新版 / 经典简洁旧版 / 关闭，支持重播）
 * 加载顺序 10/12：按编号顺序加载
 * 注意：本站是经典 <script>（非 ES Module），所有 js/ 文件共享同一个全局作用域，
 *       编号即加载顺序；调整顺序或拆合并文件前请先读 docs/ARCHITECTURE.md。
 *
 * 模式读取优先级：
 *   1. URL 参数 ?splash=cinema|classic|off（兼容别名 new → cinema, legacy → classic）
 *   2. localStorage["cquest.appearance.v1"].splashMode
 *   3. 默认 "cinema"（新版极光棱镜开屏）
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

  /* 供「重播开屏」动态重建 DOM，结构与 index.html 静态壳保持一致 */
  function createSplashElement() {
    var div = document.createElement("div");
    div.className = "splash-screen";
    div.id = "splash-screen";
    div.setAttribute("role", "status");
    div.setAttribute("aria-label", "尘狩作品集与学习工具 正在启动");
    div.innerHTML = ''
      + '<canvas class="splash-canvas" aria-hidden="true"></canvas>'
      + '<div class="splash-grain" aria-hidden="true"></div>'
      + '<button class="splash-skip" id="splash-skip" type="button">跳过动画 <span class="splash-skip-key" aria-hidden="true">ESC</span><span aria-hidden="true">↗</span></button>'
      + '<div class="splash-content">'
        + '<div class="splash-logo-stage" aria-hidden="true">'
          + '<div class="splash-aura"></div>'
          + '<svg class="splash-rings" viewBox="0 0 220 220">'
            + '<defs>'
              + '<linearGradient id="splashRingGradA" x1="0%" y1="0%" x2="100%" y2="100%">'
                + '<stop offset="0%" stop-color="#38bdf8" stop-opacity="0.95"/>'
                + '<stop offset="50%" stop-color="#818cf8" stop-opacity="0.5"/>'
                + '<stop offset="100%" stop-color="#c084fc" stop-opacity="0.9"/>'
              + '</linearGradient>'
              + '<linearGradient id="splashRingGradB" x1="100%" y1="0%" x2="0%" y2="100%">'
                + '<stop offset="0%" stop-color="#bae6fd" stop-opacity="0.9"/>'
                + '<stop offset="55%" stop-color="#34d399" stop-opacity="0.45"/>'
                + '<stop offset="100%" stop-color="#a855f7" stop-opacity="0.85"/>'
              + '</linearGradient>'
            + '</defs>'
            + '<circle class="splash-ring-outer" cx="110" cy="110" r="98"/>'
            + '<circle class="splash-ring-inner" cx="110" cy="110" r="76"/>'
            + '<g class="splash-orbit-beacon"><circle cx="110" cy="12" r="3.4" fill="#bae6fd"/><circle cx="110" cy="12" r="8" fill="#38bdf8" fill-opacity="0.28"/></g>'
          + '</svg>'
          + '<div class="splash-pulse"></div>'
          + '<div class="splash-mark"><span class="splash-mark-arc"></span><span class="splash-sheen"></span><span class="splash-code">HT</span></div>'
        + '</div>'
        + '<div class="splash-brand-block">'
          + '<div class="splash-eyebrow">CHENSHOU · PORTFOLIO</div>'
          + '<div class="splash-title"><span>尘狩</span><span class="splash-title-sep" aria-hidden="true"></span><span class="splash-title-sub">学习工具</span></div>'
        + '</div>'
        + '<div class="splash-bar" aria-hidden="true"><span class="splash-bar-fill"></span></div>'
      + '</div>';
    return div;
  }

  /* ------------------------------------------------------------------------
   * 粒子极光 Canvas 引擎（仅在 cinema 且非 reduced-motion 下启动）
   * ---------------------------------------------------------------------- */
  function startAuroraCanvas(canvas) {
    if (!canvas || !canvas.getContext) return function () {};
    var ctx = canvas.getContext("2d");
    if (!ctx) return function () {};

    var rafId = 0;
    var stopped = false;
    var w = 0, h = 0, dpr = 1;
    var startTs = performance.now();
    var PALETTE = ["#38bdf8", "#818cf8", "#a855f7", "#34d399", "#bae6fd"];
    var isSmall = window.innerWidth <= 620;
    var count = isSmall ? 38 : 74;
    var particles = [];

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function initParticles() {
      particles = [];
      var maxR = Math.hypot(w, h) * 0.56;
      for (var i = 0; i < count; i++) {
        var angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.45;
        var dist = 95 + Math.random() * maxR;
        particles.push({
          angle: angle,
          startDist: dist,
          orbitDist: 78 + Math.random() * (Math.min(w, h) * 0.36),
          spin: (Math.random() > 0.5 ? 1 : -1) * (0.18 + Math.random() * 0.42),
          size: 1 + Math.random() * 2.1,
          color: PALETTE[i % PALETTE.length],
          alpha: 0.32 + Math.random() * 0.58,
          phase: Math.random() * Math.PI * 2,
          x: 0,
          y: 0
        });
      }
    }

    resize();
    initParticles();
    window.addEventListener("resize", resize);

    function draw(now) {
      if (stopped) return;
      var t = (now - startTs) / 1000;
      var cx = w * 0.5;
      var cy = h * 0.5;

      ctx.clearRect(0, 0, w, h);

      /* 中心极光呼吸光井 */
      ctx.globalCompositeOperation = "screen";
      var bloom = Math.min(1, t / 0.95);
      var baseR = Math.min(w, h) * (0.34 + 0.08 * Math.sin(t * 2.1));
      var g1 = ctx.createRadialGradient(
        cx - Math.cos(t * 0.9) * 46, cy - Math.sin(t * 0.8) * 32, 0,
        cx, cy, baseR * 1.15
      );
      g1.addColorStop(0, "rgba(56, 189, 248, " + (0.24 * bloom).toFixed(3) + ")");
      g1.addColorStop(0.5, "rgba(129, 140, 248, " + (0.11 * bloom).toFixed(3) + ")");
      g1.addColorStop(1, "transparent");
      ctx.fillStyle = g1;
      ctx.beginPath();
      ctx.arc(cx, cy, baseR * 1.15, 0, Math.PI * 2);
      ctx.fill();

      var g2 = ctx.createRadialGradient(
        cx + Math.cos(t * 0.75) * 52, cy + Math.sin(t * 0.95) * 36, 0,
        cx, cy, baseR
      );
      g2.addColorStop(0, "rgba(168, 85, 247, " + (0.2 * bloom).toFixed(3) + ")");
      g2.addColorStop(0.55, "rgba(52, 211, 153, " + (0.07 * bloom).toFixed(3) + ")");
      g2.addColorStop(1, "transparent");
      ctx.fillStyle = g2;
      ctx.beginPath();
      ctx.arc(cx, cy, baseR, 0, Math.PI * 2);
      ctx.fill();

      /* 徽章锁定瞬间的扩散折射波 */
      if (t >= 0.62 && t <= 1.75) {
        var wp = (t - 0.62) / 1.13;
        var easeW = 1 - Math.pow(1 - wp, 3);
        var wr = 54 + easeW * Math.min(w, h) * 0.36;
        ctx.strokeStyle = "rgba(186, 230, 253, " + ((1 - wp) * 0.34).toFixed(3) + ")";
        ctx.lineWidth = 1.4 * (1 - wp * 0.5);
        ctx.beginPath();
        ctx.arc(cx, cy, wr, 0, Math.PI * 2);
        ctx.stroke();
      }

      /* 粒子两段运动：0→0.9s 旋流汇聚，0.9s+ 轻盈星轨漂移 */
      var gather = Math.min(1, t / 0.92);
      var easeGather = 1 - Math.pow(1 - gather, 3);

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        var curAngle = p.angle + t * p.spin + (1 - easeGather) * 1.05;
        var curDist = p.startDist + (p.orbitDist - p.startDist) * easeGather;
        if (t > 0.85) {
          curDist += Math.sin(t * 1.6 + p.phase) * 10 + (t - 0.85) * 14;
        }
        p.x = cx + Math.cos(curAngle) * curDist;
        p.y = cy + Math.sin(curAngle) * curDist;

        var twinkle = 0.62 + 0.38 * Math.sin(t * 3.4 + p.phase);
        var a = p.alpha * twinkle * Math.min(1, t * 2.4);

        ctx.globalAlpha = a;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      /* 轻量星链连线（控制步长保持 60fps） */
      if (!isSmall && t > 0.35) {
        var linkAlpha = Math.min(1, (t - 0.35) / 0.6) * 0.14;
        ctx.lineWidth = 0.7;
        ctx.strokeStyle = "rgba(186, 230, 253, " + linkAlpha.toFixed(3) + ")";
        ctx.globalAlpha = 1;
        for (var j = 0; j < particles.length; j += 2) {
          var a1 = particles[j];
          for (var k = j + 1; k < Math.min(j + 7, particles.length); k++) {
            var a2 = particles[k];
            var dx = a1.x - a2.x;
            var dy = a1.y - a2.y;
            if (dx * dx + dy * dy < 8800) {
              ctx.beginPath();
              ctx.moveTo(a1.x, a1.y);
              ctx.lineTo(a2.x, a2.y);
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

    /* 强制回流后再加 is-ready，确保动画从第 0 帧精准同步起播 */
    void splash.offsetWidth;
    splash.classList.add("is-ready");

    if (resolved !== "classic" && !reduced && canvas) {
      stopCanvas = startAuroraCanvas(canvas);
    }

    var skipDelay = reduced ? 0 : (resolved === "classic" ? 650 : 320);
    var totalDuration = reduced ? 220 : (resolved === "classic" ? 1400 : 2380);
    var leaveMs = reduced ? 160 : 580;

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
      if (Date.now() - openedAt < 350) return;
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
