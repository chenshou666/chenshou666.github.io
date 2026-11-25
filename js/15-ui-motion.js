/* ============================================================================
 * 15-ui-motion.js — 页面切换入场动画与底部 Dock 自动收起（纯视觉，不改业务逻辑）
 * ---------------------------------------------------------------------------
 * 能力：
 *   1. 页面/关卡真正切换时播放淡入与子元素错峰入场（答题重渲染不打扰）
 *   2. 底部 Dock 图标点击弹跳 + 方向感知（前进/后退）
 *   3. 底部 Dock 向下滚动自动收起，向上滚动或靠近屏幕底部立即滑出
 *
 * 加载顺序 12/12（文件名 15）：必须在 14-liquid-glass.js 之后
 * 关闭：移除本文件引用即可，站点逻辑完全不受影响
 * ========================================================================== */
(function () {
  "use strict";

  var view = document.getElementById("view");
  if (!view) return;

  var reduceMotion = !!(window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  var PAGE_ORDER = { home: -3, work: -2, author: -1, courses: 0, map: 1, practice: 2, summary: 3, project: 4, about: 5 };
  var lastKey = null;
  var inRender = false;

  function pageKey() {
    var nav = document.querySelector(".nav-btn.active");
    var page = nav && nav.dataset ? (nav.dataset.page || "") : "";
    var h = document.querySelector("#view .page-header h1");
    var title = h ? h.textContent.trim() : "";
    var lv = document.querySelector("#view .lesson-badge");
    return page + "|" + title + "|" + (lv ? lv.textContent.trim() : "");
  }

  function directionOf(prevKey, nextKey) {
    var prevPage = (prevKey || "").split("|")[0];
    var nextPage = (nextKey || "").split("|")[0];
    var a = PAGE_ORDER[prevPage];
    var b = PAGE_ORDER[nextPage];
    if (a === undefined || b === undefined) return "forward";
    return b >= a ? "forward" : "back";
  }

  function stagger(root) {
    if (reduceMotion) return;
    var kids = root.children;
    var max = Math.min(kids.length, 14);
    for (var i = 0; i < max; i++) {
      kids[i].style.setProperty("--i", i);
      kids[i].classList.add("ui-stagger");
    }
  }

  function clearStagger() {
    var kids = view.children;
    for (var i = 0; i < kids.length; i++) kids[i].classList.remove("ui-stagger");
  }

  function bounceDock() {
    if (reduceMotion) return;
    var nav = document.querySelector(".nav-btn.active");
    if (!nav) return;
    nav.classList.remove("dock-bounce");
    void nav.offsetWidth;
    nav.classList.add("dock-bounce");
    window.setTimeout(function () { nav.classList.remove("dock-bounce"); }, 700);
  }

  function playEnter() {
    if (reduceMotion) return;
    view.classList.remove("ui-page-in");
    void view.offsetWidth;
    view.classList.add("ui-page-in");
    stagger(view);
    window.setTimeout(function () {
      view.classList.remove("ui-page-in");
      clearStagger();
    }, 900);
  }

  function afterRender(prevKey) {
    var nextKey = pageKey();
    var changed = nextKey !== prevKey;
    document.documentElement.setAttribute("data-anim-dir", directionOf(prevKey, nextKey));
    if (!changed) {
      clearStagger();
      lastKey = nextKey;
      return;
    }
    bounceDock();
    playEnter();
    lastKey = nextKey;
  }

  if (typeof window.render === "function" && !window.render.__motionWrapped) {
    var origRender = window.render;
    window.render = function () {
      if (inRender) return origRender.apply(this, arguments);
      var prevKey = lastKey;
      inRender = true;
      var result;
      try {
        result = origRender.apply(this, arguments);
      } finally {
        inRender = false;
      }
      afterRender(prevKey);
      return result;
    };
    window.render.__motionWrapped = true;
  }

  window.addEventListener("load", function () {
    lastKey = pageKey();
    playEnter();
  });
})();

/* ==========================================================================
 * Dock 自动隐藏：向下滚动收起，向上滚动 / 靠近屏幕底部 / 回到顶部时滑出
 * ========================================================================== */
(function () {
  var dock = document.querySelector(".sidebar");
  if (!dock) return;

  function scrollY() {
    var el = document.scrollingElement || document.documentElement;
    return (window.scrollY || 0) || (el && el.scrollTop) || 0;
  }

  var lastY = scrollY();
  var hidden = false;
  var ticking = false;

  function setHidden(v) {
    if (hidden === v) return;
    hidden = v;
    dock.classList.toggle("dock-hidden", v);
  }

  function evaluate() {
    ticking = false;
    var y = scrollY();
    var dy = y - lastY;
    if (y < 90) setHidden(false);
    else if (dy > 8) setHidden(true);
    else if (dy < -8) setHidden(false);
    lastY = y;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(evaluate);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("scroll", onScroll, { passive: true, capture: true });

  window.addEventListener("mousemove", function (e) {
    if (e.clientY > window.innerHeight - 96) setHidden(false);
  }, { passive: true });

  window.addEventListener("touchstart", function (e) {
    var t = e.touches && e.touches[0];
    if (t && t.clientY > window.innerHeight - 140) setHidden(false);
  }, { passive: true });
})();
