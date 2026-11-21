/* ============================================================================
 * 14-liquid-glass.js — 套用 showcase 的液态玻璃引擎到学习工具
 * ---------------------------------------------------------------------------
 * 来源：ios_liquid_glass_ui_showcase.html 的内联 JS（截取可复用部分）
 *   · 第 1 节：MULTI-LAYER FLUID AURORA CANVAS ENGINE（原样保留配色与算法）
 *   · 第 2 节：SPECULAR GLARE TRACKING（--mouse-x / --mouse-y 高光跟随）
 *   · createGlassRipple：点击涟漪（原样保留）
 *
 * 站点适配（不碰任何业务逻辑）：
 *   · 注入 <canvas id="fluid-bg-canvas"> 与 <div class="optical-grain">
 *   · 把 .liquid-glass 类动态打到站点组件上（材质来自 08 css）
 *   · 每次页面重渲染后重新打标（包一层 window.render + MutationObserver）
 *
 * 加载顺序 14：在 10-splash.js 之后加载
 * 关闭皮肤（去掉 html[data-skin="liquid-glass"]）后本脚本自动不工作
 * ========================================================================== */
(function () {
  "use strict";

  var root = document.documentElement;
  if (!root || root.getAttribute("data-skin") !== "liquid-glass") return;

  var reduceMotion = !!(window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  /* ======================================================================
   * 第 0 步：注入 showcase 需要的画布与颗粒层
   * ====================================================================== */
  var canvas = document.getElementById("fluid-bg-canvas");
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = "fluid-bg-canvas";
    document.body.insertBefore(canvas, document.body.firstChild);
  }
  var grain = document.querySelector(".optical-grain");
  if (!grain) {
    grain = document.createElement("div");
    grain.className = "optical-grain";
    document.body.insertBefore(grain, canvas.nextSibling);
  }

  /* ======================================================================
   * 第 1 步：FLUID AURORA CANVAS ENGINE（取自 showcase，配色/算法不变）
   * ====================================================================== */
  var bgCanvas = canvas;
  var bgCtx = bgCanvas.getContext("2d");

  var THEME_PRESETS = {
    aurora: {
      name: "极光深海",
      base: "#050816",
      orbs: [
        { color: "#0ea5e9", radius: 0.45, x: 0.2, y: 0.25, vx: 0.0005, vy: 0.0004 },
        { color: "#6366f1", radius: 0.50, x: 0.78, y: 0.30, vx: -0.0004, vy: 0.0006 },
        { color: "#10b981", radius: 0.42, x: 0.32, y: 0.78, vx: 0.0006, vy: -0.0004 },
        { color: "#a855f7", radius: 0.46, x: 0.72, y: 0.72, vx: -0.0005, vy: -0.0005 },
        { color: "#38bdf8", radius: 0.32, x: 0.5, y: 0.5, vx: 0.0007, vy: 0.0003 }
      ]
    }
  };

  var currentPresetKey = "aurora";
  var coarsePointer = !!(window.matchMedia && window.matchMedia("(pointer: coarse)").matches);
  var baseSpeed = (coarsePointer || window.innerWidth <= 900) ? 2.6 : 1.0;
  var motionAmp = coarsePointer ? 0.09 : 0.05;
  var fluidSpeedMultiplier = baseSpeed;
  var bgAnimEnabled = true;
  var pointerNorm = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 };
  var timeTick = 0;

  function resizeBgCanvas() {
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeBgCanvas);
  resizeBgCanvas();

  function renderFluidBackground() {
    if (document.hidden || !bgAnimEnabled) {
      requestAnimationFrame(renderFluidBackground);
      return;
    }
    if (typeof window.__fluidSpeed === "number") fluidSpeedMultiplier = window.__fluidSpeed;
    if (typeof window.__bgAnim === "boolean") bgAnimEnabled = window.__bgAnim;
    var preset = THEME_PRESETS[currentPresetKey];
    var w = bgCanvas.width;
    var h = bgCanvas.height;
    var minDim = Math.max(w, h);

    bgCtx.fillStyle = preset.base;
    bgCtx.fillRect(0, 0, w, h);

    pointerNorm.x += (pointerNorm.targetX - pointerNorm.x) * 0.05;
    pointerNorm.y += (pointerNorm.targetY - pointerNorm.y) * 0.05;

    timeTick += 0.012 * fluidSpeedMultiplier;

    bgCtx.globalCompositeOperation = "screen";

    preset.orbs.forEach(function (orb, idx) {
      if (fluidSpeedMultiplier > 0) {
        orb.x += orb.vx * fluidSpeedMultiplier;
        orb.y += orb.vy * fluidSpeedMultiplier;
        if (orb.x < 0.08 || orb.x > 0.92) orb.vx *= -1;
        if (orb.y < 0.08 || orb.y > 0.92) orb.vy *= -1;
      }

      var ox = (orb.x + Math.sin(timeTick + idx * 1.4) * motionAmp) * w;
      var oy = (orb.y + Math.cos(timeTick * 0.9 + idx) * motionAmp) * h;
      var r = orb.radius * minDim * (0.92 + 0.08 * Math.sin(timeTick * 1.3 + idx));

      var grad = bgCtx.createRadialGradient(ox, oy, 0, ox, oy, r);
      grad.addColorStop(0, orb.color + "cc");
      grad.addColorStop(0.45, orb.color + "55");
      grad.addColorStop(1, "transparent");

      bgCtx.fillStyle = grad;
      bgCtx.beginPath();
      bgCtx.arc(ox, oy, r, 0, Math.PI * 2);
      bgCtx.fill();
    });

    var cursorGrad = bgCtx.createRadialGradient(
      pointerNorm.x * w, pointerNorm.y * h, 0,
      pointerNorm.x * w, pointerNorm.y * h, minDim * 0.32
    );
    cursorGrad.addColorStop(0, "rgba(255, 255, 255, 0.26)");
    cursorGrad.addColorStop(0.4, "rgba(103, 232, 249, 0.12)");
    cursorGrad.addColorStop(1, "transparent");

    bgCtx.fillStyle = cursorGrad;
    bgCtx.beginPath();
    bgCtx.arc(pointerNorm.x * w, pointerNorm.y * h, minDim * 0.32, 0, Math.PI * 2);
    bgCtx.fill();

    bgCtx.globalCompositeOperation = "source-over";
    requestAnimationFrame(renderFluidBackground);
  }

  requestAnimationFrame(renderFluidBackground);
  window.__bgAnim = bgAnimEnabled;

  /* ======================================================================
   * 第 2 步：把 showcase 的类打到站点组件上
   * ====================================================================== */
  var GLASS_SELECTORS = [
    ".sidebar", ".topbar", ".panel", ".stat", ".hero-main", ".hero-progress",
    ".course-card", ".level-card", ".track",
    ".challenge-card", ".exercise", ".summary-hero", ".side-card",
    ".guide-card", ".skill-row", ".save-box", ".quiz-item",
    ".feedback-panel", ".proj-card", ".reset-dialog", ".victory-card", ".progress-tools",
    ".beginner-guide", ".save-block"
  ];
  var GLASS_QUERY = GLASS_SELECTORS.join(",");

  function tag() {
    var i;
    var glassEls = document.querySelectorAll(GLASS_QUERY);
    for (i = 0; i < glassEls.length; i++) {
      if (!glassEls[i].classList.contains("liquid-glass")) {
        glassEls[i].classList.add("liquid-glass");
      }
    }
  }
  tag();

  /* 页面重渲染后重新打标：包一层 render，串联后续包装 */
  if (typeof window.render === "function" && !window.render.__liquidWrapped) {
    var origRender = window.render;
    window.render = function () {
      var r = origRender.apply(this, arguments);
      try { tag(); } catch (e) {}
      return r;
    };
    window.render.__liquidWrapped = true;
  }

  /* DOM 变化兜底（页面局部刷新、弹窗注入） */
  var moTimer = 0;
  try {
    var mo = new MutationObserver(function () {
      if (moTimer) return;
      moTimer = window.setTimeout(function () { moTimer = 0; tag(); }, 120);
    });
    mo.observe(document.getElementById("view") || document.body, {
      childList: true, subtree: true
    });
  } catch (e) {}

  /* ======================================================================
   * 第 3 步：SPECULAR GLARE TRACKING（--mouse-x / --mouse-y）
   *         原版一次性抓取 .liquid-glass 列表；这里用事件委托 + 实时定位，
   *         以便页面重渲染后仍然生效
   * ====================================================================== */
  if (!reduceMotion) {
    var glassRaf = 0;
    var gPending = null;

    function paintGlare() {
      glassRaf = 0;
      if (!gPending) return;
      var el = gPending.el;
      var rect = gPending.rect;
      if (!rect.width || !rect.height) return;
      el.style.setProperty("--mouse-x", (gPending.x - rect.left) + "px");
      el.style.setProperty("--mouse-y", (gPending.y - rect.top) + "px");
    }

    window.addEventListener("pointermove", function (e) {
      if (e.pointerType && e.pointerType !== "mouse") return;

      pointerNorm.targetX = e.clientX / window.innerWidth;
      pointerNorm.targetY = e.clientY / window.innerHeight;

      var el = e.target && e.target.closest ? e.target.closest(".liquid-glass") : null;
      if (!el) { gPending = null; return; }
      gPending = { el: el, rect: el.getBoundingClientRect(), x: e.clientX, y: e.clientY };
      if (!glassRaf) glassRaf = requestAnimationFrame(paintGlare);
    }, { passive: true });

    /* 鼠标离开卡片时立刻清掉高光坐标，避免「光停在卡片上」 */
    window.addEventListener("pointerout", function (e) {
      if (e.pointerType && e.pointerType !== "mouse") return;
      var el = e.target && e.target.closest ? e.target.closest(".liquid-glass") : null;
      if (!el) return;
      if (e.relatedTarget && el.contains(e.relatedTarget)) return;
      el.style.removeProperty("--mouse-x");
      el.style.removeProperty("--mouse-y");
    }, { passive: true });
  }

  /* ======================================================================
   * 第 4 步：createGlassRipple（取自 showcase，原样实现）
   * ====================================================================== */
  function createGlassRipple(e) {
    var RIPPLE_HOST = ".liquid-glass, .btn, .nav-btn, .option, .chip, .course-card, .level-card";
    var target = (e.currentTarget && e.currentTarget.closest)
      ? e.currentTarget.closest(RIPPLE_HOST)
      : (e.target && e.target.closest ? e.target.closest(RIPPLE_HOST) : null);
    if (!target) return;

    var rect = target.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    var ripple = document.createElement("span");
    var size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = ((e.clientX || rect.left + rect.width / 2) - rect.left - size / 2) + "px";
    ripple.style.top = ((e.clientY || rect.top + rect.height / 2) - rect.top - size / 2) + "px";
    ripple.className = "glass-ripple";

    if (getComputedStyle(target).position === "static") target.style.position = "relative";
    target.appendChild(ripple);
    window.setTimeout(function () {
      if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
    }, 750);
  }


  /* ======================================================================
   * 第 5 步：界面外观调节（玻璃模糊 / 饱和度 / 透明度 / 高光 / 背景动画）
   *          · 存 localStorage: cquest.appearance.v1
   *          · 通过 CSS 变量即时生效；背景动画速度/开关交给渲染循环读取
   * ====================================================================== */
  var STORE_KEY = "cquest.appearance.v1";
  var APPEARANCE_DEFAULTS = {
    blur: 28,
    saturate: 210,
    opacity: 11,
    glare: 38,
    bgSpeed: coarsePointer ? 2.2 : 1.0,
    bgBright: 55,
    bgAnim: true
  };
  var appearance = (function () {
    var a = {}, k;
    for (k in APPEARANCE_DEFAULTS) a[k] = APPEARANCE_DEFAULTS[k];
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        var o = JSON.parse(raw) || {};
        for (k in a) if (o[k] !== undefined && o[k] !== null) a[k] = o[k];
      }
    } catch (e) {}
    return a;
  })();

  var TUNE_FMT = {
    blur: function (v) { return v + "px"; },
    saturate: function (v) { return v + "%"; },
    opacity: function (v) { return (v / 100).toFixed(2); },
    glare: function (v) { return (v / 100).toFixed(2); },
    bgSpeed: function (v) { return "×" + Number(v).toFixed(1); },
    bgBright: function (v) { return v + "%"; },
    bgAnim: function (v) { return v ? "开" : "关"; }
  };

  function applyAppearance() {
    root.style.setProperty("--glass-blur", appearance.blur + "px");
    root.style.setProperty("--glass-saturate", appearance.saturate + "%");
    root.style.setProperty("--glass-opacity", (appearance.opacity / 100).toFixed(3));
    root.style.setProperty("--glare-opacity", (appearance.glare / 100).toFixed(3));
    root.style.setProperty("--bg-brightness", (appearance.bgBright / 100).toFixed(2));
    window.__fluidSpeed = Number(appearance.bgSpeed);
    window.__bgAnim = !!appearance.bgAnim;
  }

  function saveAppearance() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(appearance)); } catch (e) {}
  }

  var tunePanel = null;

  function buildTunePanel() {
    if (tunePanel) return tunePanel;
    tunePanel = document.createElement("section");
    tunePanel.id = "uiTunePanel";
    tunePanel.className = "ui-tune";
    tunePanel.hidden = true;
    tunePanel.setAttribute("role", "dialog");
    tunePanel.setAttribute("aria-label", "界面外观调节");
    tunePanel.innerHTML = ''
      + '<div class="ui-tune-head"><h3>界面外观调节</h3><button class="ui-tune-close" type="button" data-tune="close" aria-label="关闭">✕</button></div>'
      + '<label class="ui-tune-row"><span>玻璃模糊</span><input type="range" min="0" max="48" step="1" data-tune="blur"><output data-out="blur"></output></label>'
      + '<label class="ui-tune-row"><span>玻璃饱和</span><input type="range" min="60" max="260" step="5" data-tune="saturate"><output data-out="saturate"></output></label>'
      + '<label class="ui-tune-row"><span>玻璃透明</span><input type="range" min="0" max="30" step="1" data-tune="opacity"><output data-out="opacity"></output></label>'
      + '<label class="ui-tune-row"><span>镜面高光</span><input type="range" min="0" max="100" step="2" data-tune="glare"><output data-out="glare"></output></label>'
      + '<label class="ui-tune-row"><span>背景速度</span><input type="range" min="0.2" max="2.5" step="0.1" data-tune="bgSpeed"><output data-out="bgSpeed"></output></label>'
      + '<label class="ui-tune-row"><span>背景亮度</span><input type="range" min="20" max="100" step="5" data-tune="bgBright"><output data-out="bgBright"></output></label>'
      + '<label class="ui-tune-row ui-tune-check"><span>背景动画</span><input type="checkbox" data-tune="bgAnim"><output data-out="bgAnim"></output></label>'
      + '<div class="ui-tune-actions"><button class="btn btn-ghost btn-small" type="button" data-tune="reset">恢复默认</button><button class="btn btn-primary btn-small" type="button" data-tune="close">完成</button></div>';
    document.body.appendChild(tunePanel);
    return tunePanel;
  }

  function syncTunePanel() {
    var panel = buildTunePanel();
    var inputs = panel.querySelectorAll("[data-tune]");
    for (var i = 0; i < inputs.length; i++) {
      var k = inputs[i].getAttribute("data-tune");
      if (k === "reset" || k === "close") continue;
      if (inputs[i].type === "checkbox") {
        inputs[i].checked = !!appearance[k];
        var out = inputs[i].parentNode.querySelector('[data-out="' + k + '"]');
        if (out) out.textContent = TUNE_FMT[k](appearance[k]);
      } else {
        inputs[i].value = appearance[k];
        var out2 = inputs[i].parentNode.querySelector('[data-out="' + k + '"]');
        if (out2) out2.textContent = TUNE_FMT[k](Number(appearance[k]));
      }
    }
  }

  function openTunePanel(open) {
    var panel = buildTunePanel();
    var show = (open === undefined) ? panel.hidden : !!open;
    panel.hidden = !show;
    if (show) syncTunePanel();
  }

  var tuneBtn = document.getElementById("uiTuneBtn");
  if (tuneBtn) {
    tuneBtn.addEventListener("click", function (e) {
      e.preventDefault();
      openTunePanel();
    });
  }

  document.addEventListener("click", function (e) {
    var t = e.target;
    if (!t || !t.closest) return;
    var action = t.closest("[data-tune]");
    if (!action) return;
    var k = action.getAttribute("data-tune");
    if (k === "close") { openTunePanel(false); return; }
    if (k === "reset") {
      var kk;
      for (kk in APPEARANCE_DEFAULTS) appearance[kk] = APPEARANCE_DEFAULTS[kk];
      applyAppearance(); saveAppearance(); syncTunePanel();
      return;
    }
  });

  document.addEventListener("input", function (e) {
    var t = e.target;
    if (!t || !t.getAttribute) return;
    var k = t.getAttribute("data-tune");
    if (!k || !(k in APPEARANCE_DEFAULTS)) return;
    if (t.type === "checkbox") appearance[k] = t.checked;
    else appearance[k] = Number(t.value);
    applyAppearance();
    saveAppearance();
    var out = t.parentNode.querySelector('[data-out="' + k + '"]');
    if (out) out.textContent = TUNE_FMT[k](appearance[k]);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && tunePanel && !tunePanel.hidden) openTunePanel(false);
  });

  applyAppearance();

  if (!reduceMotion) {
    document.addEventListener("pointerdown", function (e) {
      if (e.pointerType && e.pointerType !== "mouse") return;
      createGlassRipple(e);
    }, { passive: true });
  }
})();
