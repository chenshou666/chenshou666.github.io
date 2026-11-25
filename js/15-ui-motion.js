/* ============================================================================
 * 15-ui-motion.js — 高级页面切换动画（纯视觉，不改业务逻辑）
 * ---------------------------------------------------------------------------
 * 能力：
 *   1. View Transitions API 页面切换：旧页面上滑淡出 + 模糊，新页面弹入
 *      （Chromium/Edge 支持；不支持时自动降级为 CSS 动画）
 *   2. 页面内元素错峰入场（stagger）
 *   3. 底部 Dock 图标点击弹跳 + 方向感知（前进/后退不同动效）
 *   4. 仅在「页面/关卡真的切换」时播放，答题重渲染不打扰
 *
 * 加载顺序 12/12（文件名 15）：必须在 14-liquid-glass.js 之后（14 负责高光/涟漪）
 * 关闭：移除本文件引用即可，站点逻辑完全不受影响
 * ========================================================================== */
(function () {
  "use strict";

  var view = document.getElementById("view");
  if (!view || !(window.CSS && CSS.supports && CSS.supports("view-transition-name: none"))) {
    /* 老浏览器：CSS 降级动画仍可用，这里不需要额外逻辑 */
  }

  var reduceMotion = !!(window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  /* 统一关闭 View Transitions：它的快照层在顶层，会盖住固定的顶部栏 / 底部 Dock，
     造成「导航键被挡、点了没反应」。页面切换改用下面的 ui-page-in 入场动画。 */
  var supportsVT = false;

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

  function afterRender(prevKey) {
    var nextKey = pageKey();
    var changed = nextKey !== prevKey;
    var dir = directionOf(prevKey, nextKey);
    document.documentElement.setAttribute("data-anim-dir", dir);
    if (!changed) {
      clearStagger();
      lastKey = nextKey;
      return;
    }
    bounceDock();
    if (!supportsVT) {
      /* 降级：整页淡入 + 子元素错峰 */
      view.classList.remove("ui-page-in");
      void view.offsetWidth;
      view.classList.add("ui-page-in");
      stagger(view);
      window.setTimeout(function () {
        view.classList.remove("ui-page-in");
        clearStagger();
      }, 900);
    }
    lastKey = nextKey;
  }

  /* 包装 window.render：页面切换用 View Transitions，其余渲染保持同步 */
  if (typeof window.render === "function" && !window.render.__motionWrapped) {
    var origRender = window.render;
    window.render = function () {
      if (inRender) return origRender.apply(this, arguments);

      var prevKey = lastKey;
      var args = arguments;

      if (!supportsVT) {
        inRender = true;
        var result;
        try {
          result = origRender.apply(this, args);
        } finally {
          inRender = false;
        }
        afterRender(prevKey);
        return result;
      }

      /* View Transitions：只快照 #view，避免整页（含极光画布）重绘 */
      inRender = true;
      var transition;
      try {
        transition = document.startViewTransition(function () {
          return origRender.apply(window, args);
        });
      } catch (e) {
        inRender = false;
        var r = origRender.apply(this, args);
        afterRender(prevKey);
        return r;
      }
      inRender = false;

      var done = false;
      function finish() {
        if (done) return;
        done = true;
        afterRender(prevKey);
      }
      if (transition && transition.finished && transition.finished.then) {
        transition.finished.then(finish, finish);
      } else {
        finish();
      }
      return transition;
    };
    window.render.__motionWrapped = true;
  }

  /* 首屏：进入后播放一次错峰入场 */
  window.addEventListener("load", function () {
    if (supportsVT) return;
    view.classList.add("ui-page-in");
    stagger(view);
    window.setTimeout(function () {
      view.classList.remove("ui-page-in");
      clearStagger();
    }, 1200);
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
    if (y < 90) {
      setHidden(false);
    } else if (dy > 8) {
      setHidden(true);
    } else if (dy < -8) {
      setHidden(false);
    }
    lastY = y;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(evaluate);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("scroll", onScroll, { passive: true, capture: true });

  /* 鼠标移到屏幕底部：Dock 立即滑出（避免“找不到导航”） */
  window.addEventListener("mousemove", function (e) {
    if (e.clientY > window.innerHeight - 96) setHidden(false);
  }, { passive: true });

  /* 触屏：手指在底部区域滑动时显示 */
  window.addEventListener("touchstart", function (e) {
    var t = e.touches && e.touches[0];
    if (t && t.clientY > window.innerHeight - 140) setHidden(false);
  }, { passive: true });
})();
