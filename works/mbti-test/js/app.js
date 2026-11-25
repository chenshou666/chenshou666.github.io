/* ============================================================================
 * app.js — MBTI 人格光谱测试 · 主交互控制器（V2 零偏向专业版）
 * 视图路由：home / quiz / interlude / tiebreak / reveal / report / atlas / match
 * ========================================================================== */
(function (global) {
  "use strict";

  var DRAFT_KEY = "mbti.session.draft.v2";
  var QUESTIONS = global.MBTI_QUESTIONS || [];
  var TIEBREAKERS = global.MBTI_TIEBREAKERS || [];
  var CHAPTERS = global.MBTI_CHAPTERS || [];
  var REACTIONS = global.MBTI_MICRO_REACTIONS || {};
  var TYPES = global.MBTI_TYPES || {};
  var GROUPS = global.MBTI_GROUPS || {};
  var FUNCTIONS = global.MBTI_FUNCTIONS || {};
  var DIMENSIONS = global.MBTI_DIMENSIONS || {};
  var IDENTITY = global.MBTI_IDENTITY || {};
  var SIGILS = global.MBTI_SIGILS || {};
  var ENGINE = global.MBTI_ENGINE;
  var AUDIO = global.MBTI_AUDIO;
  var AURORA = global.MBTI_AURORA;

  var ALL_CODES = [
    "INTJ", "INTP", "ENTJ", "ENTP",
    "INFJ", "INFP", "ENFJ", "ENFP",
    "ISTJ", "ISFJ", "ESTJ", "ESFJ",
    "ISTP", "ISFP", "ESTP", "ESFP"
  ];

  var MODE_META = {
    pro: { label: "专业深度版（90 题）", short: "90 题专业版", count: 90 },
    standard: { label: "标准探索版（60 题）", short: "60 题标准版", count: 60 },
    quick: { label: "闪电精测版（30 题）", short: "30 题精测版", count: 30 }
  };

  var state = {
    view: "home",            // home | quiz | interlude | tiebreak | reveal | report | atlas | match
    mode: "pro",             // pro (90) | standard (60) | quick (30)
    questions: [],
    index: 0,
    answers: {},
    tiebreakQuestions: [],
    tiebreakIndex: 0,
    startedAt: 0,
    lastReaction: "",
    interludeChapter: 1,
    result: null,
    profileViewCode: null,
    profileIdentity: "A",
    atlasGroup: "ALL",
    matchA: "INTJ",
    matchB: "ENFP",
    advancing: false,
    orbCycleTimer: 0,
    revealTimers: []
  };

  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  var toastTimer = 0;
  function showToast(msg) {
    var el = document.getElementById("toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("is-show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      el.classList.remove("is-show");
    }, 2500);
  }

  function setThemeColors(c1, c2) {
    var root = document.documentElement;
    root.style.setProperty("--accent", c1 || "#38bdf8");
    root.style.setProperty("--accent-2", c2 || "#a855f7");
    if (AURORA) AURORA.setPalette(c1 || "#38bdf8", c2 || "#a855f7");
  }

  function saveDraft() {
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify({
        mode: state.mode,
        index: state.index,
        answers: state.answers,
        startedAt: state.startedAt
      }));
    } catch (e) {}
  }

  function loadDraft() {
    try {
      var raw = sessionStorage.getItem(DRAFT_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || !parsed.answers) return null;
      if (Object.keys(parsed.answers).length <= 0) return null;
      return parsed;
    } catch (e) {
      return null;
    }
  }

  function clearDraft() {
    try { sessionStorage.removeItem(DRAFT_KEY); } catch (e) {}
  }

  function clearTimers() {
    if (state.orbCycleTimer) {
      clearInterval(state.orbCycleTimer);
      state.orbCycleTimer = 0;
    }
    for (var i = 0; i < state.revealTimers.length; i++) {
      clearTimeout(state.revealTimers[i]);
    }
    state.revealTimers = [];
  }

  function syncNav() {
    var btns = document.querySelectorAll(".nav-pill[data-nav]");
    var activeNav = state.view;
    if (activeNav === "quiz" || activeNav === "interlude" || activeNav === "tiebreak" || activeNav === "reveal") activeNav = "home";
    if (activeNav === "report") activeNav = state.profileViewCode ? "atlas" : "home";
    for (var i = 0; i < btns.length; i++) {
      btns[i].classList.toggle("is-active", btns[i].getAttribute("data-nav") === activeNav);
    }
  }

  function chapterById(id) {
    for (var i = 0; i < CHAPTERS.length; i++) {
      if (CHAPTERS[i].id === id) return CHAPTERS[i];
    }
    return CHAPTERS[0];
  }

  function pickReaction(val) {
    var abs = Math.abs(val);
    var key = abs >= 2 ? "strong" : (abs === 1 ? "mid" : "neutral");
    var pool = REACTIONS[key] || ["信号已记录 ✨"];
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function startQuiz(mode, resumeData) {
    clearTimers();
    state.mode = ENGINE.normalizeMode(mode);
    state.questions = ENGINE.getQuestionsForMode(state.mode, QUESTIONS);
    state.answers = resumeData ? Object.assign({}, resumeData.answers) : {};
    state.tiebreakQuestions = [];
    state.tiebreakIndex = 0;
    state.startedAt = (resumeData && resumeData.startedAt) || Date.now();
    state.index = resumeData ? Math.min(resumeData.index || 0, state.questions.length - 1) : 0;
    state.lastReaction = "";
    state.profileViewCode = null;
    state.advancing = false;
    state.view = "quiz";
    if (global.location.hash && global.location.hash.indexOf("#r=") === 0) {
      try { global.history.replaceState(null, "", global.location.pathname + global.location.search); } catch (e) {}
    }
    saveDraft();
    render();
    global.scrollTo({ top: 0, behavior: "smooth" });
  }

  // 主测完成后，检测是否触发边界自适应决胜加试
  function checkAndFinishMainQuiz() {
    var tbQs = ENGINE.getTiebreakQuestions(state.answers, state.questions, TIEBREAKERS);
    if (tbQs.length > 0) {
      state.tiebreakQuestions = tbQs;
      state.tiebreakIndex = 0;
      state.lastReaction = "";
      state.view = "tiebreak";
      if (AUDIO) AUDIO.playChapterClear();
      render();
      global.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    finalizeQuiz();
  }

  function finalizeQuiz() {
    var elapsedSec = state.startedAt ? Math.max(1, Math.round((Date.now() - state.startedAt) / 1000)) : 0;
    var res = ENGINE.calculateResult(state.answers, state.questions, {
      mode: state.mode,
      elapsedSec: elapsedSec,
      tiebreakQuestions: state.tiebreakQuestions
    });
    state.result = res;
    state.profileViewCode = null;
    state.matchA = res.code;
    var prof = TYPES[res.code];
    if (prof && prof.relationships && prof.relationships.soulmates.length) {
      state.matchB = prof.relationships.soulmates[0];
    }
    clearDraft();
    try {
      var h = ENGINE.encodeResultHash(res);
      global.history.replaceState(null, "", h);
    } catch (e) {}
    openReveal(res);
  }

  function openReveal(res) {
    clearTimers();
    state.view = "reveal";
    var prof = TYPES[res.code];
    setThemeColors(prof.accent, prof.accent2);
    render();
    if (AUDIO) AUDIO.playReveal();

    var chars = res.code.split("").concat([res.identity]);
    for (var i = 0; i < chars.length; i++) {
      (function (idx) {
        var tid = setTimeout(function () {
          var box = document.getElementById("revChar" + idx);
          if (box) {
            box.textContent = chars[idx];
            box.classList.add("is-lit");
          }
        }, 280 + idx * 240);
        state.revealTimers.push(tid);
      })(i);
    }
    var doneTid = setTimeout(function () {
      state.view = "report";
      render();
      global.scrollTo({ top: 0, behavior: "smooth" });
    }, 1850);
    state.revealTimers.push(doneTid);
  }

  function answerQuestion(val, clickX, clickY) {
    if (state.advancing || state.view !== "quiz") return;
    var q = state.questions[state.index];
    if (!q) return;

    state.answers[q.id] = val;
    state.lastReaction = pickReaction(val);
    saveDraft();

    if (AUDIO) AUDIO.playChoice(val);
    if (AURORA && typeof clickX === "number") {
      var ch = chapterById(q.chapter);
      AURORA.burstAt(clickX, clickY, val >= 0 ? ch.accent : ch.accent2);
    }

    var orbs = document.querySelectorAll(".choice-orb");
    for (var i = 0; i < orbs.length; i++) {
      orbs[i].classList.toggle("is-selected", Number(orbs[i].getAttribute("data-val")) === val);
    }
    var hintEl = document.getElementById("scaleHint");
    if (hintEl) hintEl.textContent = state.lastReaction;

    var sideA = document.querySelector(".dilemma-side.side-a");
    var sideB = document.querySelector(".dilemma-side.side-b");
    if (sideA && sideB) {
      sideA.classList.toggle("is-lit", val > 0);
      sideB.classList.toggle("is-lit", val < 0);
    }

    state.advancing = true;
    setTimeout(function () {
      state.advancing = false;
      var curIndex = state.index;
      var curQ = state.questions[curIndex];
      var nextIndex = curIndex + 1;

      if (nextIndex >= state.questions.length) {
        var firstMissing = -1;
        for (var m = 0; m < state.questions.length; m++) {
          if (!Object.prototype.hasOwnProperty.call(state.answers, state.questions[m].id)) {
            firstMissing = m;
            break;
          }
        }
        if (firstMissing >= 0) {
          state.index = firstMissing;
          showToast("还有未作答题目，已为你自动跳转");
          render();
        } else {
          checkAndFinishMainQuiz();
        }
        return;
      }

      var nextQ = state.questions[nextIndex];
      state.index = nextIndex;
      saveDraft();

      if (curQ && nextQ && curQ.chapter !== nextQ.chapter) {
        var chObj = chapterById(curQ.chapter);
        state.interludeChapter = chObj.index;
        state.view = "interlude";
        if (AUDIO) AUDIO.playChapterClear();
        render();
        return;
      }

      render();
    }, 320);
  }

  function answerTiebreak(val, clickX, clickY) {
    if (state.advancing || state.view !== "tiebreak") return;
    var q = state.tiebreakQuestions[state.tiebreakIndex];
    if (!q || val === 0) return;

    state.answers[q.id] = val;
    if (AUDIO) AUDIO.playChoice(val);
    if (AURORA && typeof clickX === "number") {
      AURORA.burstAt(clickX, clickY, val > 0 ? "#38bdf8" : "#a855f7");
    }

    var orbs = document.querySelectorAll(".choice-orb");
    for (var i = 0; i < orbs.length; i++) {
      orbs[i].classList.toggle("is-selected", Number(orbs[i].getAttribute("data-val")) === val);
    }
    var sideA = document.querySelector(".dilemma-side.side-a");
    var sideB = document.querySelector(".dilemma-side.side-b");
    if (sideA && sideB) {
      sideA.classList.toggle("is-lit", val > 0);
      sideB.classList.toggle("is-lit", val < 0);
    }

    state.advancing = true;
    setTimeout(function () {
      state.advancing = false;
      if (state.tiebreakIndex + 1 < state.tiebreakQuestions.length) {
        state.tiebreakIndex++;
        render();
      } else {
        finalizeQuiz();
      }
    }, 320);
  }

  // ==================== 视图 1：首页 Landing ====================
  function renderHome() {
    setThemeColors("#38bdf8", "#a855f7");
    var draft = loadDraft();
    var draftCount = draft ? Object.keys(draft.answers).length : 0;
    var draftMeta = draft ? (MODE_META[ENGINE.normalizeMode(draft.mode)] || MODE_META.standard) : null;

    var resumeHtml = draft ? (
      '<div class="resume-banner">'
      + '<p>✨ 检测到你进行中的<strong>' + esc(draftMeta.label) + '</strong>（已答 ' + draftCount + ' / ' + draftMeta.count + ' 题）</p>'
      + '<div style="display:flex;gap:8px;flex-wrap:wrap">'
      + '<button class="btn btn-primary btn-sm" type="button" data-action="resume-quiz">继续上次进度 →</button>'
      + '<button class="btn btn-ghost btn-sm" type="button" data-action="discard-draft">清空重来</button>'
      + '</div></div>'
    ) : "";

    var lastResultHtml = (state.result && !state.result.isShared) ? (
      '<div class="resume-banner" style="background:rgba(56,189,248,0.12);border-color:rgba(56,189,248,0.35)">'
      + '<p>🧭 本次已测出人格档案：<strong>' + esc(state.result.fullCode) + ' · ' + esc(TYPES[state.result.code].name) + '</strong></p>'
      + '<button class="btn btn-soft btn-sm" type="button" data-action="view-my-report">查看我的完整报告 →</button>'
      + '</div>'
    ) : "";

    var groupCards = ["NT", "NF", "SJ", "SP"].map(function (gid) {
      var g = GROUPS[gid];
      return ''
        + '<div class="group-mini" style="--grp-color:' + g.color + '" data-action="open-atlas-group" data-group="' + gid + '">'
        + '<div class="group-mini-top"><h3>' + esc(g.name) + '</h3><span class="group-dot"></span></div>'
        + '<p>' + esc(g.tagline) + '</p>'
        + '<div class="group-type-pills">'
        + g.types.map(function (c) { return '<span class="mini-code">' + c + '</span>'; }).join("")
        + '</div></div>';
    }).join("");

    return ''
      + '<section class="panel hero-panel view-enter">'
      + '<div class="hero-grid">'
      + '<div>'
      + '<div class="eyebrow">MBTI SPECTRUM LAB · V2 零偏向专业测评</div>'
      + '<h1 class="hero-title">专业级精准测评，<br>也能像一场好玩剧场</h1>'
      + '<p class="hero-sub">严格零偏向盲测设计：正反权重绝对 0.00 对称、A/B 位置 50/50 平衡、无中途方向剧透；结合 5 幕生活剧场、边界自适应决胜校准与荣格八维直测融合，绘出真正贴合你的 32 型人格档案。</p>'
      + '<div class="hero-badges">'
      + '<span class="chip">正反权重 0.00 对称</span>'
      + '<span class="chip">零偏向盲测防锚定</span>'
      + '<span class="chip">边界自适应决胜校准</span>'
      + '<span class="chip">相邻候选人格对照</span>'
      + '</div>'
      + '</div>'
      + '<div class="hero-orb-stage">'
      + '<div class="orb-ring"><div class="orb-core"><strong id="heroOrbCode">INFJ</strong><span id="heroOrbName">提倡者</span></div></div>'
      + '<p class="orb-caption">16 型经典原型 × A/T 双稳态变体<br>纯前端离线计算 · 不上传任何隐私</p>'
      + '</div>'
      + '</div>'
      + resumeHtml
      + lastResultHtml
      + '<div class="mode-grid mode-grid-3">'
      + '<button class="mode-card recommended" type="button" data-action="start-pro">'
      + '<div class="mode-head"><h3>专业深度版 · 90 题</h3><span class="mode-tag">最高准度</span></div>'
      + '<p class="mode-desc">5 维 × 18 题全量盲测，含 30 道 A/B 双面剧场与荣格认知功能直测信号，误差带最窄，精准拿捏细微性格切面。</p>'
      + '<div class="mode-meta"><span>⏱ 约 9–12 分钟</span><span>✦ 正反权重 0.00</span><span>✦ 边界决胜校准</span></div>'
      + '<div class="mode-cta">开启 90 题专业深测 →</div>'
      + '</button>'
      + '<button class="mode-card" type="button" data-action="start-standard">'
      + '<div class="mode-head"><h3>标准探索版 · 60 题</h3><span class="mode-tag soft">经典均衡</span></div>'
      + '<p class="mode-desc">5 维 × 12 题（对标主流专业量表长度），兼顾高信度与轻快节奏，完整覆盖边界融合检测与相邻候选对照。</p>'
      + '<div class="mode-meta"><span>⏱ 约 6–8 分钟</span><span>✦ 正反权重 0.00</span><span>✦ 边界决胜校准</span></div>'
      + '<div class="mode-cta">开始 60 题标准测评 →</div>'
      + '</button>'
      + '<button class="mode-card" type="button" data-action="start-quick">'
      + '<div class="mode-head"><h3>闪电精测版 · 30 题</h3><span class="mode-tag soft">快速上手</span></div>'
      + '<p class="mode-desc">5 维 × 6 道高区分度核心题，3 分钟快速出图；若遇边界维度同样自动触发决胜加试，快而不糙。</p>'
      + '<div class="mode-meta"><span>⏱ 约 3 分钟</span><span>✦ 正反权重 0.00</span><span>✦ 完整报告海报</span></div>'
      + '<div class="mode-cta">开始 30 题闪电精测 →</div>'
      + '</button>'
      + '</div>'
      + '<div class="feature-strip">'
      + '<div class="feat-box"><div class="feat-icon">⚖️</div><h4>全量零偏向去诱导</h4><p>重写高社会期许题、隐藏心理学标签、幕间不剧透方向，从文案到算法杜绝引导与锚定。</p></div>'
      + '<div class="feat-box"><div class="feat-icon">🎯</div><h4>边界自适应校准</h4><p>某维落在 48%–52% 极近中线时自动追加无中立 A/B 决胜题，彻底告别平局默认偏向。</p></div>'
      + '<div class="feat-box"><div class="feat-icon">🧠</div><h4>荣格八维 & 候选对照</h4><p>融合题目直测信号计算八维能量，并为边界用户提供最接近的第二候选人格并排对比。</p></div>'
      + '<div class="feat-box"><div class="feat-icon">🎭</div><h4>五幕剧场沉浸不枯燥</h4><p>情境共鸣 + 双面剧场交错、五声风铃音效、星尘绽放、高清 1080p 海报与双人契合实验室。</p></div>'
      + '</div>'
      + '</section>'
      + '<section class="section-block view-enter">'
      + '<div class="section-head"><div><h2>四大阵营 · 16 型人格图鉴</h2><p>点击任意阵营，直接浏览 16 种人格的完整百科档案</p></div>'
      + '<button class="btn btn-ghost btn-sm" type="button" data-nav="atlas">查看全部 16 型 →</button></div>'
      + '<div class="group-preview-grid">' + groupCards + '</div>'
      + '</section>'
      + '<div class="page-foot">免责提示：MBTI 人格测评用于自我觉察与性格探索参考，并非临床心理诊断。所有作答均在浏览器本地计算，不上传任何个人隐私。</div>';
  }

  function startHeroOrbCycle() {
    var idx = 0;
    state.orbCycleTimer = setInterval(function () {
      var codeEl = document.getElementById("heroOrbCode");
      var nameEl = document.getElementById("heroOrbName");
      if (!codeEl || !nameEl) return;
      idx = (idx + 1) % ALL_CODES.length;
      var c = ALL_CODES[idx];
      codeEl.textContent = c;
      nameEl.textContent = TYPES[c] ? TYPES[c].name : "";
    }, 1800);
  }

  // ==================== 视图 2：沉浸式盲测答题舞台 ====================
  function renderQuiz() {
    var total = state.questions.length;
    var q = state.questions[state.index];
    if (!q) return "";
    var ch = chapterById(q.chapter);
    setThemeColors(ch.accent, ch.accent2);

    var answeredVal = Object.prototype.hasOwnProperty.call(state.answers, q.id) ? state.answers[q.id] : null;
    var answeredCount = 0;
    for (var k = 0; k < state.questions.length; k++) {
      if (Object.prototype.hasOwnProperty.call(state.answers, state.questions[k].id)) answeredCount++;
    }
    var pctAll = Math.round((answeredCount / total) * 100);

    var segHtml = CHAPTERS.map(function (c) {
      var chQs = state.questions.filter(function (item) { return item.chapter === c.id; });
      var done = chQs.filter(function (item) { return Object.prototype.hasOwnProperty.call(state.answers, item.id); }).length;
      var w = chQs.length ? Math.round((done / chQs.length) * 100) : 0;
      return '<div class="act-seg" title="' + esc(c.title) + '"><i style="width:' + w + '%"></i></div>';
    }).join("");

    var bodyHtml = "";
    var leftPoleLabel = "非常符合";
    var midPoleLabel = "看情况";
    var rightPoleLabel = "完全不符";

    if (q.type === "dilemma") {
      leftPoleLabel = "更像 A";
      midPoleLabel = "两头相当";
      rightPoleLabel = "更像 B";
      bodyHtml = ''
        + '<div class="dilemma-prompt">' + esc(q.prompt) + '</div>'
        + '<div class="dilemma-grid">'
        + '<div class="dilemma-side side-a ' + (answeredVal !== null && answeredVal > 0 ? "is-lit" : "") + '"><span class="side-badge">A</span><p>' + esc(q.leftText) + '</p></div>'
        + '<div class="dilemma-vs">VS</div>'
        + '<div class="dilemma-side side-b ' + (answeredVal !== null && answeredVal < 0 ? "is-lit" : "") + '"><span class="side-badge">B</span><p>' + esc(q.rightText) + '</p></div>'
        + '</div>';
    } else {
      bodyHtml = '<div class="q-statement">' + esc(q.text) + '</div>';
    }

    var orbSpecs = [
      { val: 3, size: "lg", cls: "left", key: "1", tip: leftPoleLabel },
      { val: 2, size: "md", cls: "left", key: "2", tip: "比较偏向左侧" },
      { val: 1, size: "sm", cls: "left", key: "3", tip: "略微偏向左侧" },
      { val: 0, size: "xs", cls: "mid", key: "4", tip: midPoleLabel },
      { val: -1, size: "sm", cls: "right", key: "5", tip: "略微偏向右侧" },
      { val: -2, size: "md", cls: "right", key: "6", tip: "比较偏向右侧" },
      { val: -3, size: "lg", cls: "right", key: "7", tip: rightPoleLabel }
    ];

    var orbsHtml = orbSpecs.map(function (o) {
      var sel = answeredVal === o.val ? " is-selected" : "";
      return '<button class="choice-orb ' + o.cls + sel + '" type="button" data-action="choose" data-val="' + o.val + '" data-size="' + o.size + '" aria-label="选择 ' + o.key + ' 档（' + esc(o.tip) + '）" title="快捷键 ' + o.key + '">'
        + '<span class="orb-key">' + o.key + '</span></button>';
    }).join("");

    var dotsHtml = state.questions.map(function (item, idx) {
      var cls = "q-dot";
      if (Object.prototype.hasOwnProperty.call(state.answers, item.id)) cls += " is-answered";
      if (idx === state.index) cls += " is-current";
      return '<button class="' + cls + '" type="button" data-action="jump-q" data-idx="' + idx + '" title="第 ' + (idx + 1) + ' 题：' + esc(item.scene) + '" aria-label="跳至第 ' + (idx + 1) + ' 题"></button>';
    }).join("");

    var allDone = answeredCount === total;

    return ''
      + '<div class="quiz-wrap">'
      + '<div class="quiz-header">'
      + '<div class="act-pill"><span class="act-badge">' + esc(ch.badge) + '</span><span>' + esc(ch.title) + '</span></div>'
      + '<div class="quiz-counter">第 <strong>' + (state.index + 1) + '</strong> / ' + total + ' 题 · 总完成 ' + pctAll + '%</div>'
      + '</div>'
      + '<div class="act-progress">' + segHtml + '</div>'
      + '<section class="panel q-card anim-next">'
      + '<div class="q-meta-row">'
      + '<span class="scene-tag"><span aria-hidden="true">' + esc(q.icon) + '</span><span>场景 · ' + esc(q.scene) + '</span></span>'
      + '<span class="q-kind-badge">' + (q.type === "dilemma" ? "双面剧场" : "情境共鸣") + ' · 盲测模式</span>'
      + '</div>'
      + bodyHtml
      + '<div class="scale-box">'
      + '<div class="scale-poles"><span class="pole-left">' + leftPoleLabel + '</span><span class="pole-mid">' + midPoleLabel + '</span><span class="pole-right">' + rightPoleLabel + '</span></div>'
      + '<div class="orb-row">' + orbsHtml + '</div>'
      + '<div class="scale-hint-line" id="scaleHint">' + esc(state.lastReaction || "凭第一直觉点选最贴近真实日常的圆球，无任何好坏对错之分") + '</div>'
      + '</div>'
      + '<div class="quiz-footer">'
      + '<div style="display:flex;gap:8px">'
      + '<button class="btn btn-ghost btn-sm" type="button" data-action="prev-q" ' + (state.index === 0 ? 'disabled style="opacity:.45;cursor:not-allowed"' : "") + '>← 上一题</button>'
      + (answeredVal !== null && state.index < total - 1 ? '<button class="btn btn-soft btn-sm" type="button" data-action="next-q">下一题 →</button>' : "")
      + (allDone ? '<button class="btn btn-primary btn-sm" type="button" data-action="submit-quiz">进入校准与揭晓 ✨</button>' : "")
      + '</div>'
      + '<span class="kbd-tip hide-sm">键盘快捷：1–7 秒选 · ← 返回</span>'
      + '</div>'
      + '</section>'
      + '<div class="q-map-bar">'
      + '<div class="q-map-head"><span>答题星图（点击圆点可随时回看修改）</span><span>' + answeredCount + ' / ' + total + '</span></div>'
      + '<div class="q-dots">' + dotsHtml + '</div>'
      + '</div>'
      + '</div>';
  }

  // ==================== 视图 3：零剧透盲测幕间里程碑 ====================
  function renderInterlude() {
    var ch = CHAPTERS[state.interludeChapter - 1] || CHAPTERS[0];
    var nextCh = CHAPTERS[state.interludeChapter] || CHAPTERS[CHAPTERS.length - 1];
    setThemeColors(nextCh.accent, nextCh.accent2);

    var ms = ENGINE.buildChapterMilestone(ch.index, state.answers, state.questions);
    var total = state.questions.length;
    var pct = Math.round((ms.answered / total) * 100);

    return ''
      + '<section class="panel interlude-card view-enter">'
      + '<div class="interlude-halo" aria-hidden="true">✦</div>'
      + '<div class="eyebrow">BLIND CHECKPOINT · 已完成 ' + pct + '%（' + ms.answered + '/' + total + ' 题）</div>'
      + '<h2 style="font-size:25px;font-weight:800">' + esc(ch.interludeTitle) + '</h2>'
      + '<p style="margin-top:10px;color:var(--ink-2);font-size:14.5px;line-height:1.68">' + esc(ch.interludeHint) + '</p>'
      + '<div class="interlude-clue">' + esc(ch.trivia) + '</div>'
      + '<div class="interlude-pace">' + esc(ms.paceNote) + '</div>'
      + '<div style="display:flex;justify-content:center;gap:12px;flex-wrap:wrap">'
      + '<button class="btn btn-primary" type="button" data-action="continue-next-act">进入「' + esc(nextCh.title) + '」 →</button>'
      + '</div>'
      + '</section>';
  }

  // ==================== 视图 3.5：边界自适应决胜校准舞台 ====================
  function renderTiebreak() {
    setThemeColors("#fbbf24", "#38bdf8");
    var totalTb = state.tiebreakQuestions.length;
    var q = state.tiebreakQuestions[state.tiebreakIndex];
    if (!q) return "";
    var answeredVal = Object.prototype.hasOwnProperty.call(state.answers, q.id) ? state.answers[q.id] : null;

    var orbSpecs = [
      { val: 3, size: "lg", cls: "left", key: "1", tip: "明显更像 A" },
      { val: 2, size: "md", cls: "left", key: "2", tip: "比较像 A" },
      { val: 1, size: "sm", cls: "left", key: "3", tip: "略微偏向 A" },
      { val: -1, size: "sm", cls: "right", key: "4", tip: "略微偏向 B" },
      { val: -2, size: "md", cls: "right", key: "5", tip: "比较像 B" },
      { val: -3, size: "lg", cls: "right", key: "6", tip: "明显更像 B" }
    ];

    var orbsHtml = orbSpecs.map(function (o) {
      var sel = answeredVal === o.val ? " is-selected" : "";
      return '<button class="choice-orb ' + o.cls + sel + '" type="button" data-action="choose-tb" data-val="' + o.val + '" data-size="' + o.size + '" aria-label="选择 ' + o.key + ' 档（' + esc(o.tip) + '）" title="快捷键 ' + o.key + '">'
        + '<span class="orb-key">' + o.key + '</span></button>';
    }).join("");

    return ''
      + '<div class="quiz-wrap view-enter">'
      + '<div class="tb-banner">'
      + '<div><strong>🎯 精准边界校准（加试 ' + (state.tiebreakIndex + 1) + ' / ' + totalTb + '）</strong>'
      + '<p>系统检测到你在部分维度非常接近 50% 中线，自动追加高区分度双面题以消除平局默认偏向（本步不设中立项，请凭第一直觉选出略微贴近的一侧）。</p></div>'
      + '</div>'
      + '<section class="panel q-card anim-next">'
      + '<div class="q-meta-row">'
      + '<span class="scene-tag"><span aria-hidden="true">' + esc(q.icon) + '</span><span>' + esc(q.scene) + '</span></span>'
      + '<span class="q-kind-badge">边界决胜 · 6 档无中立</span>'
      + '</div>'
      + '<div class="dilemma-prompt">' + esc(q.prompt) + '</div>'
      + '<div class="dilemma-grid">'
      + '<div class="dilemma-side side-a ' + (answeredVal !== null && answeredVal > 0 ? "is-lit" : "") + '"><span class="side-badge">A</span><p>' + esc(q.leftText) + '</p></div>'
      + '<div class="dilemma-vs">VS</div>'
      + '<div class="dilemma-side side-b ' + (answeredVal !== null && answeredVal < 0 ? "is-lit" : "") + '"><span class="side-badge">B</span><p>' + esc(q.rightText) + '</p></div>'
      + '</div>'
      + '<div class="scale-box">'
      + '<div class="scale-poles"><span class="pole-left">更像 A</span><span class="pole-mid">哪怕只偏 1% 也请轻选一侧</span><span class="pole-right">更像 B</span></div>'
      + '<div class="orb-row orb-row-6">' + orbsHtml + '</div>'
      + '<div class="scale-hint-line">快捷键 1–3 偏向 A · 4–6 偏向 B</div>'
      + '</div>'
      + '</section>'
      + '</div>';
  }

  // ==================== 视图 4：星盘揭晓仪式 ====================
  function renderReveal() {
    return ''
      + '<section class="panel reveal-card view-enter">'
      + '<div class="eyebrow">SPECTRUM SYNTHESIS · 正在聚合你的人格星盘</div>'
      + '<h2 style="font-size:24px;font-weight:800">五维光谱与八维信号解析完成，正在点亮原型铭文…</h2>'
      + '<div class="reveal-letters">'
      + '<div class="reveal-char" id="revChar0">?</div>'
      + '<div class="reveal-char" id="revChar1">?</div>'
      + '<div class="reveal-char" id="revChar2">?</div>'
      + '<div class="reveal-char" id="revChar3">?</div>'
      + '<div class="reveal-char" id="revChar4" style="font-size:24px">?</div>'
      + '</div>'
      + '<button class="btn btn-ghost btn-sm" type="button" data-action="skip-reveal">直接展开完整报告 →</button>'
      + '</section>';
  }

  // ==================== 视图 5：完整人格档案报告 ====================
  function renderReport() {
    var isAtlasMode = !!state.profileViewCode;
    var code = isAtlasMode ? state.profileViewCode : (state.result ? state.result.code : "INTJ");
    var prof = TYPES[code] || TYPES.INTJ;
    var grp = GROUPS[prof.group];
    var identityCode = isAtlasMode ? state.profileIdentity : (state.result ? state.result.identity : "A");
    var fullCode = code + "-" + identityCode;
    var idtMeta = IDENTITY[identityCode] || IDENTITY.A;

    setThemeColors(prof.accent, prof.accent2);

    var fnData = (!isAtlasMode && state.result)
      ? state.result.functions
      : ENGINE.computeCognitiveFunctions(code, {
          EI: { leftPct: code[0] === "E" ? 72 : 28 },
          SN: { leftPct: code[1] === "S" ? 72 : 28 },
          TF: { leftPct: code[2] === "T" ? 72 : 28 },
          JP: { leftPct: code[3] === "J" ? 72 : 28 }
        }, TYPES, null);

    var sharedBanner = (!isAtlasMode && state.result && state.result.isShared) ? (
      '<div class="shared-banner">'
      + '<span>🔗 你正在查看一份通过链接分享的 <strong>' + esc(fullCode) + '</strong> 人格光谱档案</span>'
      + '<button class="btn btn-primary btn-sm" type="button" data-action="start-pro">我也来专业测一次 →</button>'
      + '</div>'
    ) : "";

    var atlasBanner = isAtlasMode ? (
      '<div class="shared-banner" style="background:rgba(56,189,248,0.12);border-color:rgba(56,189,248,0.34)">'
      + '<span>📖 正在浏览 16 型人格百科档案 · 预览变体：'
      + '<button class="btn btn-sm ' + (identityCode === "A" ? "btn-primary" : "btn-ghost") + '" type="button" data-action="preview-idt" data-idt="A" style="margin-left:6px">-A 果断型</button>'
      + '<button class="btn btn-sm ' + (identityCode === "T" ? "btn-primary" : "btn-ghost") + '" type="button" data-action="preview-idt" data-idt="T" style="margin-left:6px">-T 谨慎型</button>'
      + '</span>'
      + '<button class="btn btn-ghost btn-sm" type="button" data-nav="atlas">← 返回 16 型图鉴</button>'
      + '</div>'
    ) : "";

    var actionBtns = isAtlasMode
      ? '<button class="btn btn-primary" type="button" data-action="match-with" data-code="' + code + '">测测我和 ' + code + ' 的契合度 💞</button>'
        + '<button class="btn btn-soft" type="button" data-action="start-pro">测试我的真实人格 →</button>'
      : '<button class="btn btn-primary" type="button" data-action="download-poster">🖼️ 保存高清人格海报</button>'
        + '<button class="btn btn-soft" type="button" data-action="copy-share-link">🔗 复制分享链接</button>'
        + '<button class="btn btn-ghost" type="button" data-action="copy-summary">📋 复制报告摘要</button>'
        + '<button class="btn btn-ghost" type="button" data-action="open-match-self">💞 双人契合度</button>'
        + '<button class="btn btn-ghost" type="button" data-action="retake">↻ 重新测试</button>';

    // 五维光谱 + 专业信度体检 + 相邻第二候选人格对照
    var spectrumSection = "";
    var runnerUpSection = "";
    if (!isAtlasMode && state.result) {
      var res = state.result;
      var specRows = ENGINE.DIM_ORDER.map(function (dimId) {
        var d = res.dims[dimId];
        var dm = DIMENSIONS[dimId];
        var isLeft = d.winner === d.leftCode;
        var winInfo = isLeft ? dm.left : dm.right;
        var fillStyle = isLeft
          ? "left:0;width:" + d.dominantPct + "%;background:linear-gradient(90deg," + dm.colorLeft + "," + prof.accent + ")"
          : "right:0;width:" + d.dominantPct + "%;background:linear-gradient(90deg," + prof.accent + "," + dm.colorRight + ")";
        var tagCls = d.borderline ? "spec-tag borderline" : "spec-tag";
        var extraDesc = d.borderline
          ? "处于 45%–55% 的「边界融合区」：你在 " + dm.left.label + " 与 " + dm.right.label + " 之间具备双栖切换弹性，整体略偏向 " + winInfo.label + "。"
          : winInfo.desc;

        return ''
          + '<div class="spec-row">'
          + '<div class="spec-head">'
          + '<span class="spec-title">' + esc(dm.name) + ' · <strong>' + esc(winInfo.label) + '（' + d.winner + '）' + d.dominantPct + '%</strong></span>'
          + '<div style="display:flex;gap:6px;flex-wrap:wrap">'
          + (d.tiebroken ? '<span class="spec-tag" style="background:rgba(56,189,248,0.18);color:#bae6fd">已边界校准</span>' : "")
          + '<span class="' + tagCls + '">' + esc(d.strength) + '</span>'
          + '</div>'
          + '</div>'
          + '<div class="spec-track-wrap">'
          + '<span class="spec-pole ' + (isLeft ? "is-win" : "") + '">' + dm.left.label + ' ' + d.leftPct + '%</span>'
          + '<div class="spec-track"><div class="spec-fill" style="' + fillStyle + '"></div></div>'
          + '<span class="spec-pole right ' + (!isLeft ? "is-win" : "") + '">' + d.rightPct + '% ' + dm.right.label + '</span>'
          + '</div>'
          + '<div class="spec-desc">' + esc(extraDesc) + '</div>'
          + '</div>';
      }).join("");

      var rel = res.reliability;
      var warnHtml = (rel.warnings && rel.warnings.length)
        ? '<div class="warn-list">💡 测验提示：' + rel.warnings.map(esc).join("；") + '</div>'
        : "";
      var mInfo = MODE_META[res.mode];
      var modeStr = mInfo ? mInfo.label : "分享档案";
      var timeStr = res.elapsedSec ? (" · 用时 " + Math.floor(res.elapsedSec / 60) + " 分 " + (res.elapsedSec % 60) + " 秒") : "";

      spectrumSection = ''
        + '<section class="panel section-block">'
        + '<div class="section-head"><div><h2>五维性格光谱与专业信度体检</h2><p>正反权重严格 0.00 对称计算，透明呈现每维倾向强度与正反逻辑自洽度</p></div>'
        + '<span class="chip">' + esc(modeStr) + '</span></div>'
        + '<div class="spectrum-list">' + specRows + '</div>'
        + '<div class="reliability-bar">'
        + '<span>📊 综合信度：<strong>' + rel.score + ' / 100（' + esc(rel.grade) + '）</strong>' + esc(timeStr) + '</span>'
        + '<span>🧭 正反一致性：<strong>' + (rel.consistencyPct || 90) + '%</strong>' + (res.tiebreakCount ? (' · 触发边界校准 ' + res.tiebreakCount + ' 题') : '') + '</span>'
        + warnHtml
        + '</div>'
        + '</section>';

      if (res.runnerUps && res.runnerUps.length > 0) {
        var ruCards = res.runnerUps.map(function (ru) {
          return ''
            + '<div class="runner-card">'
            + '<div class="runner-head">'
            + '<div><span class="runner-code">' + ru.code + '</span> <strong style="font-size:16px">' + esc(ru.name) + '</strong> <span style="font-size:12px;color:var(--ink-3)">' + esc(ru.en) + '</span></div>'
            + '<span class="chip" style="border-color:var(--amber);color:#fde68a">匹配度约 ' + ru.similarity + '%</span>'
            + '</div>'
            + '<p class="runner-meta">仅在 <strong>' + esc(ru.axisName) + '</strong> 上相差 ' + ru.marginPct + '%（' + ru.fromPole + ' → ' + ru.toPole + '） · 主导功能对比：<code>' + ru.mainStack + '</code> vs <code>' + ru.altStack + '</code></p>'
            + '<p class="runner-tip">' + esc(ru.tip) + '</p>'
            + '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">'
            + '<button class="btn btn-soft btn-sm" type="button" data-action="open-type-profile" data-code="' + ru.code + '">查看 ' + ru.code + ' 完整档案 →</button>'
            + '<button class="btn btn-ghost btn-sm" type="button" data-action="match-pair" data-a="' + code + '" data-b="' + ru.code + '">对比两者契合度</button>'
            + '</div>'
            + '</div>';
        }).join("");

        runnerUpSection = ''
          + '<section class="panel section-block">'
          + '<div class="section-head"><div><h2>🔍 相邻候选人格对照（边界精细核验）</h2><p>当某个维度较接近中线时，你往往同时兼具相邻类型的部分特质，可一键对照哪一份更击中你</p></div>'
          + '<span class="chip">边界友好</span></div>'
          + '<div class="runner-grid">' + ruCards + '</div>'
          + '</section>';
      }
    }

    var roleLabels = ["主导功能 · 核心引擎", "辅助功能 · 平衡之翼", "第三功能 · 成长潜能", "劣势功能 · 隐藏软肋"];
    var stackCards = fnData.stack.map(function (fCode, idx) {
      var fm = FUNCTIONS[fCode];
      return ''
        + '<div class="fn-card ' + (idx === 0 ? "primary" : "") + '">'
        + '<div class="fn-top"><span class="fn-code">' + fCode + ' · ' + esc(fm.name) + '</span><span class="fn-role">' + roleLabels[idx] + '</span></div>'
        + '<div style="font-size:12px;color:var(--cyan)">' + esc(fm.tag) + ' · ' + esc(fm.en) + '</div>'
        + '<p>' + esc(prof.stackNotes[idx] || fm.desc) + '</p>'
        + '</div>';
    }).join("");

    var allFnCodes = ["Ni", "Ne", "Si", "Se", "Ti", "Te", "Fi", "Fe"];
    var fn8Html = allFnCodes.map(function (fc) {
      var val = fnData.scores[fc] || 40;
      var inStack = fnData.stack.indexOf(fc) >= 0;
      return ''
        + '<div class="fn-mini" style="' + (inStack ? "border-color:color-mix(in srgb,var(--accent) 45%,transparent)" : "") + '">'
        + '<div class="fn-mini-top"><span>' + fc + ' ' + esc(FUNCTIONS[fc].name) + '</span><span>' + val + '</span></div>'
        + '<div class="fn-mini-bar"><i style="width:' + val + '%"></i></div>'
        + '</div>';
    }).join("");

    function renderPairChips(list) {
      return list.map(function (c) {
        var name = TYPES[c] ? TYPES[c].name : "";
        return '<button class="pair-btn" type="button" data-action="match-pair" data-a="' + code + '" data-b="' + c + '">' + c + ' · ' + esc(name) + ' ↗</button>';
      }).join("");
    }

    return ''
      + '<div class="view-enter">'
      + sharedBanner
      + atlasBanner
      + '<section class="panel report-hero">'
      + '<div class="report-hero-grid">'
      + '<div class="sigil-box" aria-hidden="true">' + (SIGILS[code] || "") + '</div>'
      + '<div>'
      + '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:8px">'
      + '<span class="chip" style="border-color:' + grp.color + ';color:#fff">' + esc(grp.name) + ' · ' + esc(grp.en) + '</span>'
      + '<span class="chip">人群参考占比 ' + esc(prof.rarity) + '</span>'
      + '<span class="chip">' + esc(idtMeta.name) + '</span>'
      + '</div>'
      + '<div class="report-code">' + esc(fullCode) + '</div>'
      + '<div class="report-name-row"><h1>' + esc(prof.name) + '</h1><span class="report-en">' + esc(prof.en) + ' · ' + esc(idtMeta.badge) + '</span></div>'
      + '<p class="report-motto">「' + esc(prof.motto) + '」</p>'
      + '<div class="kw-list">' + prof.keywords.map(function (k) { return '<span class="kw-pill"># ' + esc(k) + '</span>'; }).join("") + '</div>'
      + '</div>'
      + '</div>'
      + '<div class="report-actions">' + actionBtns + '</div>'
      + '</section>'
      + spectrumSection
      + runnerUpSection
      + '<div class="report-grid-2">'
      + '<section class="panel sub-panel">'
      + '<h3>🌌 深度人格画像</h3>'
      + '<p class="body-copy">' + esc(prof.overview) + '</p>'
      + '<div style="margin-top:16px;padding:14px 16px;border-radius:14px;background:rgba(255,255,255,0.055);border:1px solid rgba(255,255,255,0.12)">'
      + '<div style="font-size:13px;font-weight:700;color:var(--cyan);margin-bottom:6px">变体聚焦 · ' + esc(idtMeta.name) + '</div>'
      + '<p style="font-size:13.5px;line-height:1.68;color:var(--ink-2)">' + esc(idtMeta.summary) + '</p>'
      + '<p style="font-size:12.5px;line-height:1.6;color:var(--ink-3);margin-top:8px"><strong>加分优势：</strong>' + esc(idtMeta.edge) + '<br><strong>温柔提醒：</strong>' + esc(idtMeta.watch) + '</p>'
      + '</div>'
      + '</section>'
      + '<section class="panel sub-panel">'
      + '<h3>🔋 压力触发与回血指南</h3>'
      + '<p class="body-copy"><strong>最易耗电的场景：</strong>' + esc(prof.stress.trigger) + '</p>'
      + '<p class="body-copy" style="margin-top:12px"><strong>专属充电方式：</strong>' + esc(prof.stress.recovery) + '</p>'
      + '<h3 style="margin-top:20px">✨ 给你的 3 条落地微建议</h3>'
      + '<ul class="bullet-list" style="--dot-color:var(--green)">' + prof.tips.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join("") + '</ul>'
      + '</section>'
      + '</div>'
      + '<section class="panel section-block">'
      + '<div class="section-head"><div><h2>荣格八维认知功能栈</h2><p>MBTI 的底层核心：你如何优先获取信息与做出决策的思维回路' + (fnData.hasDirectSignals ? '（已融合你本次作答的直测认知功能信号）' : '') + '</p></div>'
      + '<span class="chip">' + fnData.stack.join(" → ") + '</span></div>'
      + '<div class="fn-stack-grid">' + stackCards + '</div>'
      + '<div style="margin-top:18px;font-size:13px;font-weight:700;color:var(--ink-2)">八维功能能量分布（高亮框为核心功能栈）</div>'
      + '<div class="fn-8-bars">' + fn8Html + '</div>'
      + '</section>'
      + '<div class="report-grid-2">'
      + '<section class="panel sub-panel">'
      + '<h3>💎 闪光天赋与优势</h3>'
      + '<ul class="bullet-list" style="--dot-color:var(--cyan)">' + prof.strengths.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join("") + '</ul>'
      + '</section>'
      + '<section class="panel sub-panel">'
      + '<h3>🪞 潜在盲区与成长功课</h3>'
      + '<ul class="bullet-list" style="--dot-color:var(--amber)">' + prof.blindspots.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join("") + '</ul>'
      + '</section>'
      + '</div>'
      + '<div class="report-grid-2">'
      + '<section class="panel sub-panel">'
      + '<h3>🚀 职场天赋与适配方向</h3>'
      + '<p class="body-copy">' + esc(prof.career.style) + '</p>'
      + '<div class="kw-list" style="margin-top:14px">' + prof.career.roles.map(function (r) { return '<span class="kw-pill">' + esc(r) + '</span>'; }).join("") + '</div>'
      + '<div style="margin-top:18px;font-size:13px;font-weight:700;color:var(--ink-3)">同原型历史与文化参考</div>'
      + '<div class="kw-list" style="margin-top:8px">' + prof.archetypes.map(function (a) { return '<span class="kw-pill" style="background:rgba(255,255,255,0.05)">' + esc(a) + '</span>'; }).join("") + '</div>'
      + '</section>'
      + '<section class="panel sub-panel">'
      + '<h3>💞 亲密关系与人际模式</h3>'
      + '<p class="body-copy">' + esc(prof.relationships.style) + '</p>'
      + '<div class="pair-group"><div class="pair-label">黄金灵魂拍档（点击直接测双人契合度）</div><div class="pair-chips">' + renderPairChips(prof.relationships.soulmates) + '</div></div>'
      + '<div class="pair-group"><div class="pair-label">默契同盟伙伴</div><div class="pair-chips">' + renderPairChips(prof.relationships.allies) + '</div></div>'
      + '<div class="pair-group"><div class="pair-label">反差成长磨合型</div><div class="pair-chips">' + renderPairChips(prof.relationships.growth) + '</div></div>'
      + '</section>'
      + '</div>'
      + '<div class="page-foot">人格标签是理解自己的起点，而不是限制成长的边框 · MBTI 人格光谱测试 V2</div>'
      + '</div>';
  }

  // ==================== 视图 6：16 型人格图鉴百科 ====================
  function renderAtlas() {
    setThemeColors("#818cf8", "#38bdf8");
    var filters = [
      { id: "ALL", label: "全部 16 型" },
      { id: "NT", label: "分析家 · NT" },
      { id: "NF", label: "外交家 · NF" },
      { id: "SJ", label: "守护者 · SJ" },
      { id: "SP", label: "探险家 · SP" }
    ];

    var filterHtml = filters.map(function (f) {
      return '<button class="filter-pill ' + (state.atlasGroup === f.id ? "is-active" : "") + '" type="button" data-action="filter-atlas" data-group="' + f.id + '">' + esc(f.label) + '</button>';
    }).join("");

    var list = ALL_CODES.filter(function (c) {
      return state.atlasGroup === "ALL" || TYPES[c].group === state.atlasGroup;
    });

    var cards = list.map(function (c) {
      var p = TYPES[c];
      return ''
        + '<button class="type-card" type="button" style="--t-accent:' + p.accent + '" data-action="open-type-profile" data-code="' + c + '">'
        + '<div class="type-card-top">'
        + '<div><div class="type-card-code">' + c + '</div><div class="type-card-name">' + esc(p.name) + ' · ' + esc(p.en) + '</div></div>'
        + '<div class="type-sigil-sm" aria-hidden="true">' + (SIGILS[c] || "") + '</div>'
        + '</div>'
        + '<p class="type-card-motto">' + esc(p.motto) + '</p>'
        + '<div style="margin-top:auto;display:flex;justify-content:space-between;align-items:center;font-size:11.5px;color:var(--ink-3)">'
        + '<span>' + p.stack.slice(0, 2).join(" · ") + '</span><span>占比 ' + esc(p.rarity) + '</span>'
        + '</div></button>';
    }).join("");

    return ''
      + '<section class="panel view-enter">'
      + '<div class="section-head"><div><div class="eyebrow">PERSONALITY ATLAS · 16 型全量百科</div>'
      + '<h2>16 型人格图鉴</h2><p>点开任意一张卡片，即可阅览完整深度画像、荣格八维栈、职场与关系解析</p></div>'
      + '<button class="btn btn-primary btn-sm" type="button" data-nav="home">去测我的类型 →</button></div>'
      + '<div class="filter-row">' + filterHtml + '</div>'
      + '<div class="atlas-grid">' + cards + '</div>'
      + '</section>';
  }

  // ==================== 视图 7：双人契合度实验室 ====================
  function renderMatch() {
    var pA = TYPES[state.matchA] || TYPES.INTJ;
    var pB = TYPES[state.matchB] || TYPES.ENFP;
    setThemeColors(pA.accent, pB.accent);

    var comp = ENGINE.computeCompatibility(state.matchA, state.matchB, TYPES);

    function optionsHtml(selected) {
      return ALL_CODES.map(function (c) {
        var t = TYPES[c];
        return '<option value="' + c + '"' + (c === selected ? " selected" : "") + '>' + c + ' · ' + esc(t.name) + '（' + esc(GROUPS[t.group].name) + '）</option>';
      }).join("");
    }

    var metricsHtml = comp.metrics.map(function (m) {
      return ''
        + '<div class="m-metric">'
        + '<div class="m-metric-top"><span>' + esc(m.label) + '</span><strong>' + m.value + '%</strong></div>'
        + '<div class="m-metric-bar"><i style="width:' + m.value + '%"></i></div>'
        + '</div>';
    }).join("");

    return ''
      + '<section class="panel view-enter">'
      + '<div class="section-head"><div><div class="eyebrow">CHEMISTRY LAB · 双人关系透视仪</div>'
      + '<h2>双人 MBTI 契合度实验室</h2><p>选择任意两种人格类型（伴侣、挚友或共事拍档），即刻剖析思维共振与相处指南</p></div>'
      + '<button class="btn btn-ghost btn-sm" type="button" data-action="random-match">🎲 随机组合</button></div>'
      + '<div class="match-picker">'
      + '<div class="select-box"><label for="selectTypeA">人格 A（比如你）</label><select id="selectTypeA" class="glass-select">' + optionsHtml(state.matchA) + '</select></div>'
      + '<button class="match-heart" type="button" data-action="swap-match" title="交换左右类型" aria-label="交换左右类型">⇄</button>'
      + '<div class="select-box"><label for="selectTypeB">人格 B（比如 TA）</label><select id="selectTypeB" class="glass-select">' + optionsHtml(state.matchB) + '</select></div>'
      + '</div>'
      + '<div class="match-score-hero">'
      + '<div class="score-ring" style="--pct:' + comp.overall + '"><strong>' + comp.overall + '</strong><span>综合契合</span></div>'
      + '<div style="flex:1;min-width:220px">'
      + '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">'
      + '<h3 style="font-size:22px;font-weight:800">' + esc(state.matchA) + ' × ' + esc(state.matchB) + ' · ' + esc(comp.tier) + '</h3>'
      + '<span class="chip" style="border-color:var(--cyan);color:#fff">' + esc(comp.badge) + '</span>'
      + '</div>'
      + '<p class="body-copy" style="margin-top:10px">' + esc(comp.summary) + '</p>'
      + '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px">'
      + '<button class="btn btn-ghost btn-sm" type="button" data-action="open-type-profile" data-code="' + state.matchA + '">查看 ' + state.matchA + ' 档案</button>'
      + '<button class="btn btn-ghost btn-sm" type="button" data-action="open-type-profile" data-code="' + state.matchB + '">查看 ' + state.matchB + ' 档案</button>'
      + '</div>'
      + '</div>'
      + '</div>'
      + '<div class="match-metrics">' + metricsHtml + '</div>'
      + '<div class="report-grid-2">'
      + '<div class="panel sub-panel" style="background:rgba(255,255,255,0.04)"><h3>✨ 相处高光点</h3><ul class="bullet-list" style="--dot-color:var(--green)">' + comp.highlights.map(function (h) { return '<li>' + esc(h) + '</li>'; }).join("") + '</ul></div>'
      + '<div class="panel sub-panel" style="background:rgba(255,255,255,0.04)"><h3>🧭 磨合与沟通秘籍</h3><ul class="bullet-list" style="--dot-color:var(--amber)">' + comp.tips.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join("") + '</ul></div>'
      + '</div>'
      + '</section>';
  }

  function render() {
    clearTimers();
    syncNav();
    var app = document.getElementById("app");
    if (!app) return;

    if (state.view === "home") {
      app.innerHTML = renderHome();
      startHeroOrbCycle();
    } else if (state.view === "quiz") {
      app.innerHTML = renderQuiz();
    } else if (state.view === "interlude") {
      app.innerHTML = renderInterlude();
    } else if (state.view === "tiebreak") {
      app.innerHTML = renderTiebreak();
    } else if (state.view === "reveal") {
      app.innerHTML = renderReveal();
    } else if (state.view === "report") {
      app.innerHTML = renderReport();
    } else if (state.view === "atlas") {
      app.innerHTML = renderAtlas();
    } else if (state.view === "match") {
      app.innerHTML = renderMatch();
    }
  }

  function copyText(text, okMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        showToast(okMsg);
      }, function () {
        fallbackCopy(text, okMsg);
      });
    } else {
      fallbackCopy(text, okMsg);
    }
  }

  function fallbackCopy(text, okMsg) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      showToast(okMsg);
    } catch (e) {
      showToast("复制失败，请手动复制地址栏链接");
    }
    document.body.removeChild(ta);
  }

  function buildTextSummary(res) {
    var p = TYPES[res.code];
    var lines = [
      "【MBTI 人格光谱测试档案 · 专业版】",
      "我的人格类型：" + res.fullCode + " · " + p.name + "（" + p.en + "）",
      "核心金句：「" + p.motto + "」",
      "五维光谱："
        + "E/I " + res.dims.EI.winner + " " + res.dims.EI.dominantPct + "% · "
        + "S/N " + res.dims.SN.winner + " " + res.dims.SN.dominantPct + "% · "
        + "T/F " + res.dims.TF.winner + " " + res.dims.TF.dominantPct + "% · "
        + "J/P " + res.dims.JP.winner + " " + res.dims.JP.dominantPct + "% · "
        + "A/T " + res.dims.AT.winner + " " + res.dims.AT.dominantPct + "%",
      "荣格功能栈：" + res.functions.stack.join(" → ") + " · 信度：" + res.reliability.score + "/100",
      "关键词：" + p.keywords.join(" / "),
      "在线测试：https://chenshou666.github.io/works/mbti-test/index.html" + ENGINE.encodeResultHash(res)
    ];
    return lines.join("\n");
  }

  document.addEventListener("click", function (ev) {
    var navBtn = ev.target.closest("[data-nav]");
    if (navBtn) {
      var targetNav = navBtn.getAttribute("data-nav");
      if (AUDIO) AUDIO.playTap();
      state.profileViewCode = null;
      state.view = targetNav;
      render();
      global.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    var actBtn = ev.target.closest("[data-action]");
    if (!actBtn) return;
    var act = actBtn.getAttribute("data-action");

    if (act === "start-pro") {
      if (AUDIO) AUDIO.playTap();
      startQuiz("pro", null);
    } else if (act === "start-standard" || act === "start-full") {
      if (AUDIO) AUDIO.playTap();
      startQuiz("standard", null);
    } else if (act === "start-quick") {
      if (AUDIO) AUDIO.playTap();
      startQuiz("quick", null);
    } else if (act === "resume-quiz") {
      if (AUDIO) AUDIO.playTap();
      var d = loadDraft();
      if (d) startQuiz(d.mode, d);
    } else if (act === "discard-draft") {
      clearDraft();
      showToast("已清空上次未完成进度");
      render();
    } else if (act === "view-my-report") {
      if (AUDIO) AUDIO.playTap();
      state.profileViewCode = null;
      state.view = "report";
      render();
    } else if (act === "choose") {
      var val = Number(actBtn.getAttribute("data-val"));
      var rect = actBtn.getBoundingClientRect();
      answerQuestion(val, rect.left + rect.width / 2, rect.top + rect.height / 2);
    } else if (act === "choose-tb") {
      var tbVal = Number(actBtn.getAttribute("data-val"));
      var tbRect = actBtn.getBoundingClientRect();
      answerTiebreak(tbVal, tbRect.left + tbRect.width / 2, tbRect.top + tbRect.height / 2);
    } else if (act === "prev-q") {
      if (state.index > 0) {
        if (AUDIO) AUDIO.playTap();
        state.index--;
        saveDraft();
        render();
      }
    } else if (act === "next-q") {
      if (state.index < state.questions.length - 1) {
        if (AUDIO) AUDIO.playTap();
        state.index++;
        saveDraft();
        render();
      }
    } else if (act === "jump-q") {
      var idx = parseInt(actBtn.getAttribute("data-idx"), 10);
      if (!isNaN(idx) && idx >= 0 && idx < state.questions.length) {
        if (AUDIO) AUDIO.playTap();
        state.index = idx;
        saveDraft();
        render();
      }
    } else if (act === "submit-quiz") {
      checkAndFinishMainQuiz();
    } else if (act === "continue-next-act") {
      if (AUDIO) AUDIO.playTap();
      state.view = "quiz";
      render();
      global.scrollTo({ top: 0, behavior: "smooth" });
    } else if (act === "skip-reveal") {
      clearTimers();
      state.view = "report";
      render();
    } else if (act === "download-poster") {
      if (!state.result) return;
      if (AUDIO) AUDIO.playTap();
      try {
        var url = ENGINE.renderPosterToDataURL(state.result);
        var a = document.createElement("a");
        a.href = url;
        a.download = "MBTI-" + state.result.fullCode + "-poster.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showToast("🎉 高清人格海报已生成并开始下载");
      } catch (e) {
        showToast("海报导出失败，请稍后重试");
      }
    } else if (act === "copy-share-link") {
      if (!state.result) return;
      var shareUrl = global.location.href.split("#")[0] + ENGINE.encodeResultHash(state.result);
      copyText(shareUrl, "🔗 分享链接已复制！好友打开即可查看你的档案");
    } else if (act === "copy-summary") {
      if (!state.result) return;
      copyText(buildTextSummary(state.result), "📋 人格报告摘要已复制到剪贴板");
    } else if (act === "retake") {
      if (AUDIO) AUDIO.playTap();
      state.view = "home";
      state.profileViewCode = null;
      render();
      global.scrollTo({ top: 0, behavior: "smooth" });
    } else if (act === "open-match-self") {
      if (AUDIO) AUDIO.playTap();
      if (state.result) state.matchA = state.result.code;
      state.view = "match";
      render();
      global.scrollTo({ top: 0, behavior: "smooth" });
    } else if (act === "open-atlas-group") {
      if (AUDIO) AUDIO.playTap();
      state.atlasGroup = actBtn.getAttribute("data-group") || "ALL";
      state.view = "atlas";
      render();
      global.scrollTo({ top: 0, behavior: "smooth" });
    } else if (act === "filter-atlas") {
      if (AUDIO) AUDIO.playTap();
      state.atlasGroup = actBtn.getAttribute("data-group") || "ALL";
      render();
    } else if (act === "open-type-profile") {
      if (AUDIO) AUDIO.playTap();
      state.profileViewCode = actBtn.getAttribute("data-code");
      state.view = "report";
      render();
      global.scrollTo({ top: 0, behavior: "smooth" });
    } else if (act === "preview-idt") {
      if (AUDIO) AUDIO.playTap();
      state.profileIdentity = actBtn.getAttribute("data-idt") === "T" ? "T" : "A";
      render();
    } else if (act === "match-with") {
      if (AUDIO) AUDIO.playTap();
      var targetCode = actBtn.getAttribute("data-code");
      if (state.result) {
        state.matchA = state.result.code;
        state.matchB = targetCode;
      } else {
        state.matchB = targetCode;
      }
      state.view = "match";
      render();
      global.scrollTo({ top: 0, behavior: "smooth" });
    } else if (act === "match-pair") {
      if (AUDIO) AUDIO.playTap();
      state.matchA = actBtn.getAttribute("data-a") || state.matchA;
      state.matchB = actBtn.getAttribute("data-b") || state.matchB;
      state.view = "match";
      render();
      global.scrollTo({ top: 0, behavior: "smooth" });
    } else if (act === "swap-match") {
      if (AUDIO) AUDIO.playTap();
      var tmp = state.matchA;
      state.matchA = state.matchB;
      state.matchB = tmp;
      render();
    } else if (act === "random-match") {
      if (AUDIO) AUDIO.playTap();
      state.matchA = ALL_CODES[Math.floor(Math.random() * ALL_CODES.length)];
      state.matchB = ALL_CODES[Math.floor(Math.random() * ALL_CODES.length)];
      render();
    }
  });

  document.addEventListener("change", function (ev) {
    if (ev.target && ev.target.id === "selectTypeA") {
      state.matchA = ev.target.value;
      if (AUDIO) AUDIO.playTap();
      render();
    } else if (ev.target && ev.target.id === "selectTypeB") {
      state.matchB = ev.target.value;
      if (AUDIO) AUDIO.playTap();
      render();
    }
  });

  document.addEventListener("keydown", function (ev) {
    if (ev.target && (ev.target.tagName === "INPUT" || ev.target.tagName === "SELECT" || ev.target.tagName === "TEXTAREA")) {
      return;
    }
    if (state.view === "quiz") {
      var keyMap = { "1": 3, "2": 2, "3": 1, "4": 0, "5": -1, "6": -2, "7": -3 };
      if (Object.prototype.hasOwnProperty.call(keyMap, ev.key)) {
        ev.preventDefault();
        var v = keyMap[ev.key];
        var orb = document.querySelector('.choice-orb[data-val="' + v + '"]');
        var cx = global.innerWidth / 2;
        var cy = global.innerHeight / 2;
        if (orb) {
          var rc = orb.getBoundingClientRect();
          cx = rc.left + rc.width / 2;
          cy = rc.top + rc.height / 2;
        }
        answerQuestion(v, cx, cy);
      } else if (ev.key === "ArrowLeft" || ev.key === "Backspace") {
        if (state.index > 0) {
          ev.preventDefault();
          state.index--;
          saveDraft();
          render();
        }
      } else if (ev.key === "ArrowRight") {
        var q = state.questions[state.index];
        if (q && Object.prototype.hasOwnProperty.call(state.answers, q.id) && state.index < state.questions.length - 1) {
          ev.preventDefault();
          state.index++;
          saveDraft();
          render();
        }
      }
    } else if (state.view === "tiebreak") {
      var tbMap = { "1": 3, "2": 2, "3": 1, "4": -1, "5": -2, "6": -3 };
      if (Object.prototype.hasOwnProperty.call(tbMap, ev.key)) {
        ev.preventDefault();
        var tv = tbMap[ev.key];
        var tOrb = document.querySelector('.choice-orb[data-val="' + tv + '"]');
        var tcx = global.innerWidth / 2;
        var tcy = global.innerHeight / 2;
        if (tOrb) {
          var trc = tOrb.getBoundingClientRect();
          tcx = trc.left + trc.width / 2;
          tcy = trc.top + trc.height / 2;
        }
        answerTiebreak(tv, tcx, tcy);
      }
    } else if (state.view === "interlude" && ev.key === "Enter") {
      ev.preventDefault();
      state.view = "quiz";
      render();
    }
  });

  function init() {
    if (AURORA) AURORA.init(document.getElementById("auroraCanvas"));

    var brandBtn = document.getElementById("brandHomeBtn");
    if (brandBtn) {
      brandBtn.addEventListener("click", function () {
        if (AUDIO) AUDIO.playTap();
        state.profileViewCode = null;
        state.view = "home";
        render();
      });
    }

    var soundBtn = document.getElementById("soundToggleBtn");
    var soundIcon = document.getElementById("soundIcon");
    if (soundBtn) {
      soundBtn.addEventListener("click", function () {
        var on = AUDIO ? AUDIO.toggle() : false;
        soundBtn.setAttribute("aria-pressed", on ? "true" : "false");
        if (soundIcon) soundIcon.textContent = on ? "🔊" : "🔇";
        showToast(on ? "互动风铃音效已开启" : "已静音");
      });
    }

    if (global.location.hash && global.location.hash.indexOf("#r=") === 0) {
      var shared = ENGINE.decodeResultHash(global.location.hash, TYPES);
      if (shared) {
        state.result = shared;
        state.matchA = shared.code;
        state.view = "report";
      }
    }

    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(window);
