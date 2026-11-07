/* ============================================================================
 * 13-dual-ui.js — 双 UI 终极合并引擎（FPS 监控 + 星云银河 + 18,000 粒子跟随 + 星轨卡片）
 * 来源：原 index.html 最后一个内联 <script>，原样迁移（一个 IIFE；与上方 app 逻辑共享全局函数）
 * 依赖：DOM 中 #htFpsMonitor / #uiChooserModal / #cosmos-stage 等节点，以及 js/01~12 的函数
 * ========================================================================== */

(function(){
  /* ===== 0. 实时帧数显示器 (FPS Monitor) 独立采样循环 ===== */
  (function initFpsMonitor(){
    const mon = document.getElementById("htFpsMonitor");
    const valEl = document.getElementById("htFpsVal");
    const msEl = document.getElementById("htFpsMs");
    const cvs = document.getElementById("htFpsCanvas");
    if (!mon || !valEl || !msEl || !cvs) return;
    const fctx = cvs.getContext("2d");
    const history = new Array(24).fill(60);
    let frames = 0;
    let lastTime = performance.now();
    let lastFrameTime = lastTime;
    let smoothMs = 16.7;

    mon.addEventListener("click", function() {
      mon.classList.toggle("compact");
    });

    function fpsLoop(now) {
      frames++;
      const dt = now - lastFrameTime;
      lastFrameTime = now;
      smoothMs = smoothMs * 0.85 + dt * 0.15;

      if (now - lastTime >= 350) {
        const fps = Math.min(240, Math.round((frames * 1000) / (now - lastTime)));
        frames = 0;
        lastTime = now;

        valEl.textContent = fps + " FPS";
        msEl.textContent = smoothMs.toFixed(1) + " ms";
        mon.classList.toggle("warn", fps < 50 && fps >= 30);
        mon.classList.toggle("low", fps < 30);

        history.push(fps);
        if (history.length > 24) history.shift();

        fctx.clearRect(0, 0, 48, 16);
        for (let i = 0; i < history.length; i++) {
          const v = history[i];
          const h = Math.max(2, Math.min(15, Math.round((v / 75) * 15)));
          fctx.fillStyle = v >= 50 ? "#34d399" : (v >= 30 ? "#fbbf24" : "#f87171");
          fctx.fillRect(i * 2, 16 - h, 1.5, h);
        }
      }
      requestAnimationFrame(fpsLoop);
    }
    requestAnimationFrame(fpsLoop);
  })();

  /* ===== 1. 内置兜底题库（当脱离 ./content/c/ 与 ./content/cet4/ 外部脚本单独打开 HTML 时自动启用） ===== */
  if (!cLevels.length) {
    const fallbackC = [
      {id:1,course:"c",stage:"起步上路",module:"起步上路",type:"code",minutes:8,title:"第一个 C 程序：Hello, World",gist:"认识 #include <stdio.h>、main 函数与 printf 输出。",lesson:"每个 C 程序都从「main」函数开始执行。想在屏幕上打印文字，需要引入标准输入输出头文件 #include <stdio.h>，再调用 printf(\"Hello, World!\\n\"); 并在结尾 return 0;。",takeaways:["C 程序入口是 int main(void)","printf 用于格式化输出，\\n 表示换行","每条语句以英文分号 ; 结尾"],quiz:"C 语言程序从哪个函数开始执行？",options:["start()","main()","printf()","init()"],answer:1,explain:"main 是 C 语言标准规定的程序入口函数。",mission:"编写一个完整的 C 程序，使用 printf 输出 Hello, HT Lab! 并换行，最后返回 0。",starter:"#include <stdio.h>\n\nint main(void) {\n    \n    return 0;\n}",hint:"在 main 里写 printf(\"Hello, HT Lab!\\n\");",solution:"#include <stdio.h>\n\nint main(void) {\n    printf(\"Hello, HT Lab!\\n\");\n    return 0;\n}",expectedOutput:"Hello, HT Lab!",check:{include:"stdio.h",return0:true,calls:[["printf","Hello, HT Lab!"]]}},
      {id:2,course:"c",stage:"流程控制",module:"流程控制",type:"code",minutes:10,title:"变量与条件判断 if-else",gist:"用 int 声明整型变量，并用 if 判断大小关系。",lesson:"声明变量如 int score = 85;。使用 if (score >= 60) 可以根据条件真假执行不同分支。注意判断相等用双等号 ==，赋值用单等号 =。",takeaways:["int 用于存储整数","if 括号内写条件表达式","== 判断相等，= 表示赋值"],quiz:"在 C 语言中，判断变量 x 是否等于 10 应该写？",options:["x = 10","x == 10","x === 10","x := 10"],answer:1,explain:"双等号 == 才是相等比较运算符。",mission:"定义整型变量 n = 12，用 if 判断若 n > 10 则 printf 输出 Pass\\n。",starter:"#include <stdio.h>\n\nint main(void) {\n    int n = 12;\n    \n    return 0;\n}",hint:"使用 if (n > 10) printf(\"Pass\\n\");",solution:"#include <stdio.h>\n\nint main(void) {\n    int n = 12;\n    if (n > 10) {\n        printf(\"Pass\\n\");\n    }\n    return 0;\n}",expectedOutput:"Pass",check:{include:"stdio.h",return0:true,require:{if:true},calls:[["printf","Pass"]]}},
      {id:3,course:"c",stage:"函数与程序结构",module:"函数与程序结构",type:"code",minutes:12,title:"for 循环与累加求和",gist:"用 for 循环计算 1 到 5 的整数累加和。",lesson:"for (int i = 1; i <= 5; i++) 包含初始化、循环条件与步进三部分，非常适合已知次数的循环累加。",takeaways:["for 循环三要素用两个分号隔开","sum += i 等价于 sum = sum + i","累加变量使用前必须初始化为 0"],quiz:"int sum = 0; for(int i=1;i<=3;i++) sum += i; 执行后 sum 的值是？",options:["3","5","6","10"],answer:2,explain:"1 + 2 + 3 = 6。",mission:"用 for 循环计算 1 到 5 的累加和并调用 printf(\"%d\\n\", sum) 输出。",starter:"#include <stdio.h>\n\nint main(void) {\n    int sum = 0;\n    \n    return 0;\n}",hint:"for (int i = 1; i <= 5; i++) sum += i;",solution:"#include <stdio.h>\n\nint main(void) {\n    int sum = 0;\n    for (int i = 1; i <= 5; i++) {\n        sum += i;\n    }\n    printf(\"%d\\n\", sum);\n    return 0;\n}",expectedOutput:"15",check:{include:"stdio.h",return0:true,require:{for:true},calls:["printf"]}},
      {id:4,course:"c",stage:"指针与内存",module:"指针与内存",type:"code",minutes:15,title:"指针基础：取址 & 与解引用 *",gist:"理解内存地址，用指针指向变量并修改它的值。",lesson:"&a 取得变量 a 的内存地址；int *p = &a; 定义指针 p 保存该地址；*p = 20; 通过解引用直接读写 a 所在的内存。",takeaways:["& 是取地址运算符","int *p 声明指向 int 的指针","*p 访问指针所指向的目标变量"],quiz:"若 int a = 5; int *p = &a; *p = 9; 则此时 a 的值为？",options:["5","9","地址值","编译错误"],answer:1,explain:"*p 就是变量 a 本身，修改 *p 即修改 a。",mission:"定义 int a = 10; 和指针 int *p = &a; 通过 *p = 42; 修改后用 printf(\"%d\\n\", a) 输出。",starter:"#include <stdio.h>\n\nint main(void) {\n    int a = 10;\n    \n    return 0;\n}",hint:"int *p = &a; *p = 42; printf(\"%d\\n\", a);",solution:"#include <stdio.h>\n\nint main(void) {\n    int a = 10;\n    int *p = &a;\n    *p = 42;\n    printf(\"%d\\n\", a);\n    return 0;\n}",expectedOutput:"42",check:{include:"stdio.h",return0:true,require:{pointer:true},calls:["printf"]}}
    ];
    fallbackC.forEach(l => { cLevels.push(l); if (!cGroups.includes(l.stage)) cGroups.push(l.stage); });
  }
  if (!cet4Levels.length) {
    const fallbackCet = [
      {id:1,course:"cet4",stage:"核心地基",module:"核心地基",type:"read",minutes:10,title:"四级主谓一致与核心句架",gist:"三步抓出长难句主干：先找谓语动词，再定主语核心词。",lesson:"四级阅读长难句常夹杂介词短语（of/in/with...）与定语从句。先把修饰成分括起来，找到真正的谓语动词，句意立刻清晰。",takeaways:["介词短语不能做主语","找到谓语动词即可切分主干","连接词决定从句边界"],passage:"The rapid growth of online learning platforms over the past decade has transformed how university students acquire programming and language skills.",questions:[{q:"本句真正的主语核心词是哪一个？",options:["platforms","decade","growth","students"],answer:2,explain:"of online learning platforms 与 over the past decade 都是后置修饰语，核心主语是 The rapid growth。"},{q:"句中的谓语动词部分是？",options:["acquire","has transformed","learning","rapid"],answer:1,explain:"has transformed 是现在完成时谓语动词。"}]},
      {id:2,course:"cet4",stage:"阅读精练",module:"阅读精练",type:"read",minutes:12,title:"细节定位与同义替换",gist:"题干关键词定位原文，识别四级高频同义改写。",lesson:"四级仔细阅读正确选项极少照抄原文，90% 采用同义词或词性转换替换原文表达。",takeaways:["题干实词（名词/动词）定位句群","警惕原词照搬的干扰项","同义替换是正确选项核心特征"],passage:"Artificial intelligence tools can assist beginners in debugging code, yet independent problem-solving remains essential for deep comprehension.",questions:[{q:"What does the author emphasize about learning to code?",options:["AI can replace all human programmers","Independent problem-solving is still vital","Debugging is no longer necessary","Beginners should avoid AI completely"],answer:1,explain:"vital 同义替换原文的 essential。"}]},
      {id:3,course:"cet4",stage:"写作与翻译",module:"写作与翻译",type:"write",minutes:15,title:"四级议论文首段：现象引入与观点亮明",gist:"用 3 句话稳稳写出高分首段。",lesson:"首段黄金结构：背景句（Nowadays, it is widely observed that...）+ 转折或聚焦 + 核心论点（From my perspective...）。",takeaways:["首段控制在 35-45 词","避免空洞套话，直接切入主题","善用连接词提升连贯度"],prompt:"请围绕 digital learning（数字化学习）写一段包含 digital、essential、learning 等关键词的短文（不少于 12 词）。",minWords:12,points:[["digital","online"],["essential","important","vital"],["learning","study"]],sample:"Nowadays, digital learning has become an essential part of higher education, offering flexible resources for every student."}
    ];
    fallbackCet.forEach(l => { cet4Levels.push(l); if (!cet4Groups.includes(l.stage)) cet4Groups.push(l.stage); });
  }
  levels = courseLevels[activeCourse];
  groups = courseGroups[activeCourse];

  /* ===== 2. 顶栏注入双 UI 切换与返回 3D 星球按钮 ===== */
  const topRight = document.querySelector(".topbar .top-right");
  if (topRight && !document.getElementById("topUiSwitchBtn")) {
    const backCosmosBtn = document.createElement("button");
    backCosmosBtn.type = "button";
    backCosmosBtn.id = "workspaceBackCosmosBtn";
    backCosmosBtn.className = "ui-switch-pill";
    backCosmosBtn.style.display = "none";
    backCosmosBtn.innerHTML = "🪐 返回 3D 星球";
    backCosmosBtn.addEventListener("click", function() {
      enterCosmosUniverseView();
    });
    topRight.insertBefore(backCosmosBtn, topRight.firstChild);

    const switchBtn = document.createElement("button");
    switchBtn.type = "button";
    switchBtn.id = "topUiSwitchBtn";
    switchBtn.className = "ui-switch-pill";
    switchBtn.innerHTML = "🌌 切换星空 UI";
    switchBtn.addEventListener("click", function() {
      const cur = document.body.dataset.uiMode || "glass";
      setUiMode(cur === "cosmos" ? "glass" : "cosmos", true);
    });
    topRight.insertBefore(switchBtn, topRight.firstChild);
  }

  /* ===== 3. 双 UI 状态同步与关卡无障碍进入 ===== */
  const UI_MODE_KEY = "htlab.uimode.v1";
  let currentUiMode = localStorage.getItem(UI_MODE_KEY) || "cosmos";

  function syncSharedDataToBothUIs() {
    data = stores[activeCourse];
    levels = courseLevels[activeCourse];
    groups = courseGroups[activeCourse];
    const xpEl = document.getElementById("xpTop");
    if (xpEl) xpEl.textContent = data.xp;
    const cosmosXp = document.getElementById("cosmosXpBadge");
    if (cosmosXp) cosmosXp.textContent = "✦ " + data.xp + " 学习点 · 已通关 " + completedCount() + "/" + levels.length;
    if (currentUiMode === "cosmos") {
      buildCosmosOrbitCards();
      updateCosmosHeaderCopy();
    }
  }

  const origRender = window.render;
  window.render = function() {
    origRender();
    syncSharedDataToBothUIs();
    updateWorkspaceBackBtn();
  };
  const origSave = window.save;
  window.save = function() {
    origSave();
    syncSharedDataToBothUIs();
  };

  function updateWorkspaceBackBtn() {
    const btn = document.getElementById("workspaceBackCosmosBtn");
    const switchBtn = document.getElementById("topUiSwitchBtn");
    if (btn) {
      btn.style.display = (currentUiMode === "cosmos" && document.body.dataset.cosmosView === "workspace") ? "inline-flex" : "none";
    }
    if (switchBtn) {
      switchBtn.innerHTML = currentUiMode === "cosmos" ? "🪟 切换玻璃 UI" : "🌌 切换星空 UI";
    }
  }

  function setUiMode(mode, showToastMsg) {
    currentUiMode = (mode === "cosmos") ? "cosmos" : "glass";
    localStorage.setItem(UI_MODE_KEY, currentUiMode);
    document.body.dataset.uiMode = currentUiMode;
    if (currentUiMode === "cosmos") {
      document.body.dataset.cosmosView = activeLevel ? "workspace" : "universe";
      resizeCosmosCanvas();
      syncSharedDataToBothUIs();
    } else {
      delete document.body.dataset.cosmosView;
      origRender();
    }
    updateWorkspaceBackBtn();
    if (showToastMsg) {
      toast(currentUiMode === "cosmos" ? "已切换至「3D 星尘粒子宇宙 UI」" : "已切换至「悬浮透明液态玻璃 UI」");
    }
  }

  function enterCosmosUniverseView() {
    document.body.dataset.uiMode = "cosmos";
    document.body.dataset.cosmosView = "universe";
    activeLevel = null;
    updateWorkspaceBackBtn();
    syncSharedDataToBothUIs();
  }

  // 直接进入关卡实训工作台（即使用户点击了后续模块的代表卡，也允许直接打开学习，不再卡死没反应）
  function forceOpenLevelInWorkspace(lv) {
    if (!lv) return;
    document.body.dataset.uiMode = "cosmos";
    document.body.dataset.cosmosView = "workspace";
    activeLevel = lv;
    page = "lesson";
    const quizDone = isDone(lv) || !!data.quizRewards[lv.id];
    selectedOption = quizDone ? lv.answer : null;
    quizPassed = quizDone;
    codePassed = isDone(lv);
    hintVisible = false;
    solutionVisible = false;
    window.quizAnswered = quizDone;
    window.codeFeedback = "";
    window.codeDraft = data.drafts[lv.id] || "";
    window.taskState = (window.taskState && window.taskState.levelId === lv.id) ? window.taskState : null;
    origRender();
    ensureNextBar();
    updateWorkspaceBackBtn();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openCosmosWorkspace(targetPage, levelId) {
    document.body.dataset.uiMode = "cosmos";
    document.body.dataset.cosmosView = "workspace";
    if (levelId !== undefined && levelId !== null) {
      const targetLv = levels.find(x => x.id === levelId) || nextLevel();
      forceOpenLevelInWorkspace(targetLv);
      return;
    } else if (targetPage) {
      switchPage(targetPage);
    }
    updateWorkspaceBackBtn();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ===== 4. 绚丽深空星云 + 银河光带 + 动态流星 + 18,000 粒子引擎 ===== */
  const bgCanvas = document.getElementById("stardust-canvas");
  const fgCanvas = document.getElementById("stardust-fg-canvas");
  const ctx = bgCanvas.getContext("2d");
  const fgCtx = fgCanvas.getContext("2d");
  const cardsLayer = document.getElementById("orbit-cards-layer");

  let W = window.innerWidth, H = window.innerHeight;
  let PARTICLE_COUNT = W <= 768 ? 10000 : 18000;
  let SWARM_COUNT = W <= 768 ? 2200 : 4200;
  const MAX_POOL = 26000;
  const particles = [];
  const bgStars = [];
  const nebulaClouds = [];
  const meteors = [];
  const fireworks = [];
  let orbitCardItems = [];

  // 多套绚丽星云配色方案
  const NEBULA_THEMES = [
    { name: "极光深空", hues: [205, 268, 175, 315], coreA: "rgba(29, 78, 216, 0.34)", coreB: "rgba(147, 51, 234, 0.28)", milky: "rgba(56, 189, 248, 0.12)" },
    { name: "紫微星冕", hues: [275, 320, 230, 40], coreA: "rgba(126, 34, 206, 0.36)", coreB: "rgba(219, 39, 119, 0.28)", milky: "rgba(192, 132, 252, 0.14)" },
    { name: "翡翠星河", hues: [165, 195, 225, 145], coreA: "rgba(5, 150, 105, 0.32)", coreB: "rgba(14, 165, 233, 0.28)", milky: "rgba(52, 211, 153, 0.13)" },
    { name: "超新星烈焰", hues: [18, 42, 340, 205], coreA: "rgba(225, 29, 72, 0.32)", coreB: "rgba(217, 119, 6, 0.28)", milky: "rgba(251, 146, 60, 0.13)" }
  ];
  let nebulaIdx = 0;

  let sceneMode = "binary";
  let rotX = 0.28, rotY = 0, targetRotX = 0.28, targetRotY = 0;
  let camZ = 0, targetCamZ = 0;
  let isDragging = false, dragStartX = 0, dragStartY = 0;

  const pointer = { x: W * 0.5, y: H * 0.5, active: false, lastMove: 0 };
  let magnetMode = "attract";
  let magnetStrength = 0.85;

  function initParticlePool() {
    particles.length = 0;
    const th = NEBULA_THEMES[nebulaIdx];
    for (let i = 0; i < MAX_POOL; i++) {
      const isSwarm = i < SWARM_COUNT;
      particles.push({
        x: (Math.random() - 0.5) * 1200,
        y: (Math.random() - 0.5) * 800,
        z: (Math.random() - 0.5) * 800,
        tx: 0, ty: 0, tz: 0,
        vx: 0, vy: 0, vz: 0,
        sx: Math.random() * W,
        sy: Math.random() * H,
        svx: 0, svy: 0,
        ease: isSwarm ? (0.045 + Math.random() * 0.14) : (0.035 + Math.random() * 0.055),
        size: isSwarm ? (0.6 + Math.random() * 1.4) : (0.45 + Math.random() * 1.2),
        hue: th.hues[i % th.hues.length] + (Math.random() - 0.5) * 24,
        sat: 92,
        light: isSwarm ? (70 + Math.random() * 26) : (62 + Math.random() * 30),
        alpha: 0.3 + Math.random() * 0.7,
        phase: Math.random() * Math.PI * 2,
        orbitAng: Math.random() * Math.PI * 2,
        orbitRad: 6 + Math.random() * 120,
        isSwarm: isSwarm
      });
    }

    // 远景多彩闪烁星辰（包含十字星芒亮星）
    bgStars.length = 0;
    for (let i = 0; i < 560; i++) {
      bgStars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: i < 36 ? (1.4 + Math.random() * 1.2) : (0.45 + Math.random() * 1.1),
        a: 0.25 + Math.random() * 0.7,
        p: Math.random() * Math.PI * 2,
        sp: 0.012 + Math.random() * 0.035,
        hue: [200, 220, 275, 45, 180][i % 5],
        isFlare: i < 24
      });
    }

    // 5 团缓慢漂移的深空星云气团
    nebulaClouds.length = 0;
    const cloudDefs = [
      { rx: 0.22, ry: 0.26, rad: 0.42, hue: 210, alpha: 0.18, spd: 0.0004 },
      { rx: 0.78, ry: 0.28, rad: 0.40, hue: 278, alpha: 0.17, spd: -0.00035 },
      { rx: 0.50, ry: 0.76, rad: 0.46, hue: 185, alpha: 0.15, spd: 0.0003 },
      { rx: 0.32, ry: 0.62, rad: 0.34, hue: 320, alpha: 0.11, spd: -0.00045 },
      { rx: 0.68, ry: 0.55, rad: 0.36, hue: 245, alpha: 0.14, spd: 0.00038 }
    ];
    cloudDefs.forEach((c, idx) => {
      nebulaClouds.push({
        ang: idx * 1.2,
        baseX: c.rx, baseY: c.ry,
        rad: c.rad, hue: c.hue, alpha: c.alpha, spd: c.spd
      });
    });
  }

  function spawnMeteor() {
    if (meteors.length > 3) return;
    const startX = Math.random() * W * 0.85 + W * 0.1;
    const startY = Math.random() * H * 0.35;
    const angle = Math.PI * (0.68 + Math.random() * 0.12);
    const speed = 9 + Math.random() * 7;
    meteors.push({
      x: startX, y: startY,
      vx: Math.cos(angle) * speed,
      vy: -Math.sin(angle) * speed * -1,
      len: 75 + Math.random() * 65,
      alpha: 1,
      hue: Math.random() > 0.5 ? 195 : 275
    });
  }

  function resizeCosmosCanvas() {
    W = window.innerWidth;
    H = window.innerHeight;
    bgCanvas.width = W;
    bgCanvas.height = H;
    fgCanvas.width = W;
    fgCanvas.height = H;
    cardsLayer.classList.toggle("mobile-dock-mode", W <= 768);
  }
  window.addEventListener("resize", resizeCosmosCanvas);

  function shapeBinaryPlanets() {
    const sep = W <= 768 ? 145 : 250;
    const th = NEBULA_THEMES[nebulaIdx];
    for (let i = 0; i < MAX_POOL; i++) {
      const p = particles[i];
      const leftPlanet = (i % 2 === 0);
      const cx = leftPlanet ? -sep : sep;
      const rad = (W <= 768 ? 84 : 132) * Math.cbrt(0.22 + 0.78 * Math.random());
      const u = Math.random(), v = Math.random();
      const theta = u * 2 * Math.PI, phi = Math.acos(2 * v - 1);
      if (i % 4 === 0) {
        const rRing = (W <= 768 ? 108 : 172) + Math.random() * 52;
        const ang = Math.random() * Math.PI * 2;
        p.tx = cx + Math.cos(ang) * rRing;
        p.ty = Math.sin(ang) * rRing * 0.28;
        p.tz = Math.sin(ang) * rRing;
      } else {
        p.tx = cx + rad * Math.sin(phi) * Math.cos(theta);
        p.ty = rad * Math.sin(phi) * Math.sin(theta);
        p.tz = rad * Math.cos(phi);
      }
      p.hue = leftPlanet ? (th.hues[0] + (Math.random() - 0.5) * 32) : (th.hues[1] + (Math.random() - 0.5) * 38);
      p.sat = 90;
    }
  }

  function shapeGalaxyOrbit() {
    const th = NEBULA_THEMES[nebulaIdx];
    const baseHue = (activeCourse === "c") ? th.hues[0] : th.hues[1];
    for (let i = 0; i < MAX_POOL; i++) {
      const p = particles[i];
      if (i < MAX_POOL * 0.28) {
        const rad = 102 * Math.cbrt(Math.random());
        const u = Math.random(), v = Math.random();
        const thAng = u * Math.PI * 2, ph = Math.acos(2 * v - 1);
        p.tx = rad * Math.sin(ph) * Math.cos(thAng);
        p.ty = rad * Math.sin(ph) * Math.sin(thAng);
        p.tz = rad * Math.cos(ph);
        p.hue = baseHue + (Math.random() - 0.5) * 30;
      } else {
        const band = i % 4;
        const r = 148 + band * 72 + (Math.random() - 0.5) * 34;
        const a = Math.random() * Math.PI * 2;
        p.tx = Math.cos(a) * r;
        p.ty = (Math.random() - 0.5) * 20 + Math.sin(a * 2) * 10;
        p.tz = Math.sin(a) * r;
        p.hue = baseHue + band * 18 + (Math.random() - 0.5) * 22;
      }
    }
  }

  function shapeStardustTower() {
    const th = NEBULA_THEMES[nebulaIdx];
    const baseHue = (activeCourse === "c") ? th.hues[0] : th.hues[1];
    for (let i = 0; i < MAX_POOL; i++) {
      const p = particles[i];
      if (i < 600) {
        const a = Math.random() * Math.PI * 2;
        const r = Math.random() * 15;
        p.tx = Math.cos(a) * r;
        p.ty = -175 - Math.random() * 58;
        p.tz = Math.sin(a) * r;
        p.hue = 38 + Math.random() * 22;
        p.light = 80;
      } else {
        const tier = i % 3;
        const radii = [212, 152, 98];
        const yTops = [95, 15, -65];
        const r = radii[tier] * (0.86 + Math.random() * 0.14);
        const a = Math.random() * Math.PI * 2;
        p.tx = Math.cos(a) * r;
        p.ty = yTops[tier] + (Math.random() - 0.5) * 58;
        p.tz = Math.sin(a) * r;
        p.hue = baseHue + tier * 24;
      }
    }
  }

  function shapeTextSample(textStr, fontSize) {
    const off = document.createElement("canvas");
    const ow = 720, oh = 360;
    off.width = ow; off.height = oh;
    const octx = off.getContext("2d");
    octx.fillStyle = "#fff";
    octx.font = "900 " + fontSize + "px 'Inter','Microsoft YaHei UI',sans-serif";
    octx.textAlign = "center";
    octx.textBaseline = "middle";
    octx.fillText(textStr, ow / 2, oh / 2);
    const img = octx.getImageData(0, 0, ow, oh).data;
    const pts = [];
    const step = textStr.length > 2 ? 2 : 3;
    for (let y = 0; y < oh; y += step) {
      for (let x = 0; x < ow; x += step) {
        if (img[(y * ow + x) * 4 + 3] > 128) {
          pts.push({ x: (x - ow / 2) * 1.35, y: (y - oh / 2) * 1.35 });
        }
      }
    }
    if (!pts.length) return;
    for (let i = 0; i < MAX_POOL; i++) {
      const p = particles[i];
      if (i < MAX_POOL * 0.78) {
        const pt = pts[i % pts.length];
        p.tx = pt.x + (Math.random() - 0.5) * 3.5;
        p.ty = pt.y + (Math.random() - 0.5) * 3.5;
        p.tz = (Math.random() - 0.5) * 28;
        p.hue = 190 + (pt.x / 400) * 85;
        p.light = 84;
      } else {
        const a = Math.random() * Math.PI * 2, r = 240 + Math.random() * 260;
        p.tx = Math.cos(a) * r;
        p.ty = (Math.random() - 0.5) * 360;
        p.tz = Math.sin(a) * r;
      }
    }
  }

  function spawnFireworkBurst(cx, cy, shapeType) {
    const baseHue = Math.floor(Math.random() * 360);
    const count = 95;
    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 2;
      let vx, vy;
      if (shapeType === "heart") {
        vx = 16 * Math.pow(Math.sin(t), 3) * 0.22;
        vy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * 0.22;
      } else {
        const sp = (i % 2 === 0 ? 5.2 : 2.8) * (0.8 + Math.random() * 0.4);
        vx = Math.cos(t) * sp;
        vy = Math.sin(t) * sp;
      }
      fireworks.push({
        x: cx, y: cy, vx: vx, vy: vy,
        gravity: 0.04, alpha: 1, decay: 0.012 + Math.random() * 0.01,
        hue: (baseHue + i * 2) % 360, light: 78, size: 1.5 + Math.random() * 1.4
      });
    }
  }

  function warpIntoCoursePlanet(courseId) {
    if (courseId && courseId !== activeCourse) {
      activeCourse = courseId;
      localStorage.setItem(courseKey, courseId);
      levels = courseLevels[courseId];
      groups = courseGroups[courseId];
      data = stores[courseId];
    }
    targetCamZ = -420;
    spawnFireworkBurst(W * 0.5, H * 0.5, "star");
    toast("正在穿云跃迁至「" + currentCourse().name + "」星球…");
    setTimeout(function() {
      camZ = 340;
      targetCamZ = 0;
      setCosmosChapter("orbit");
    }, 320);
  }

  let countdownTimer = null;
  function setCosmosChapter(ch) {
    if (countdownTimer) { clearInterval(countdownTimer); countdownTimer = null; }
    sceneMode = ch;
    document.querySelectorAll(".chapter-orb[data-chapter]").forEach(b => {
      b.classList.toggle("active", b.dataset.chapter === ch);
    });
    const backBtn = document.getElementById("cosmosBackBinaryBtn");
    if (backBtn) backBtn.style.display = (ch === "binary") ? "none" : "inline-flex";

    if (ch === "binary") {
      shapeBinaryPlanets();
    } else if (ch === "orbit") {
      shapeGalaxyOrbit();
    } else if (ch === "tower") {
      shapeStardustTower();
    } else if (ch === "countdown") {
      let n = 5;
      shapeTextSample(String(n), 210);
      countdownTimer = setInterval(function() {
        n--;
        if (n >= 1) {
          shapeTextSample(String(n), 210);
          spawnFireworkBurst(W * (0.25 + Math.random() * 0.5), H * (0.25 + Math.random() * 0.4), "star");
        } else {
          clearInterval(countdownTimer);
          countdownTimer = null;
          setCosmosChapter("calligraphy");
        }
      }, 950);
    } else if (ch === "calligraphy") {
      shapeTextSample("新的一阶", 118);
      spawnFireworkBurst(W * 0.28, H * 0.32, "heart");
      spawnFireworkBurst(W * 0.72, H * 0.32, "star");
    }
    buildCosmosOrbitCards();
    updateCosmosHeaderCopy();
  }

  function updateCosmosHeaderCopy() {
    const k = document.getElementById("cosmosKicker");
    const t = document.getElementById("cosmosTitle");
    const s = document.getElementById("cosmosSub");
    const cc = currentCourse();
    const done = completedCount();
    if (!k || !t || !s) return;
    if (sceneMode === "binary") {
      k.textContent = "BINARY UNIVERSE · 双星宇宙门户";
      t.textContent = "HT Lab · 选择你的知识星球";
      s.textContent = "移动鼠标或手指，成千上万颗星尘将随你汇聚。点击下方 C 语言或英语四级星球卡直接进入。";
    } else {
      k.textContent = "PLANET CORE · " + cc.name.toUpperCase() + " (" + done + "/" + levels.length + " 关已通关)";
      t.textContent = cc.name + " · 星环全息实训场";
      s.textContent = "拖拽背景可旋转星系；单击任意卡片直接进入该关卡实训舱。";
    }
  }

  /* ===== 5. 构建可 100% 灵敏点击的 3D 星轨卡片 ===== */
  function attachReliableCardClick(el, callback) {
    let downX = 0, downY = 0;
    el.addEventListener("pointerdown", function(e) {
      e.stopPropagation(); // 阻止触发底层画布拖拽，保证卡片点击稳准狠
      downX = e.clientX;
      downY = e.clientY;
    });
    el.addEventListener("click", function(e) {
      e.stopPropagation();
      if (Math.hypot(e.clientX - downX, e.clientY - downY) > 25) return;
      callback(e);
    });
  }

  function buildCosmosOrbitCards() {
    cardsLayer.innerHTML = "";
    orbitCardItems = [];
    if (sceneMode === "countdown" || sceneMode === "calligraphy") return;

    if (sceneMode === "binary") {
      const sep = W <= 768 ? 140 : 250;
      COURSES.forEach((c, idx) => {
        const ls = courseLevels[c.id] || [];
        const st = stores[c.id] || { completed: {}, xp: 0 };
        const dn = Object.keys(st.completed).length;
        const pct = ls.length ? Math.round(dn / ls.length * 100) : 0;
        const el = document.createElement("article");
        el.className = "orbit-card portal-card" + (c.id === "cet4" ? " cet4-tone" : "");
        el.innerHTML =
          '<div class="orbit-card-top"><span class="orbit-card-tag">PLANET 0' + (idx + 1) + ' · ' + esc(c.chip) + '</span><span class="nova-dot' + (dn > 0 ? ' done' : '') + '"></span></div>' +
          '<div class="orbit-card-title">' + esc(c.name) + ' 星球</div>' +
          '<div class="orbit-card-desc">' + esc(c.sub) + '</div>' +
          '<div class="orbit-card-foot"><span>已完成 ' + dn + '/' + ls.length + ' 关 (' + pct + '%)</span><span class="orbit-card-action">点击进入星球 →</span></div>';
        attachReliableCardClick(el, function() {
          warpIntoCoursePlanet(c.id);
        });
        cardsLayer.appendChild(el);
        orbitCardItems.push({
          el: el,
          x: idx === 0 ? -sep : sep,
          y: 120,
          z: -35,
          isPortal: true,
          data: c
        });
      });
      return;
    }

    const displayList = [];
    const nextLv = nextLevel();
    if (nextLv) {
      displayList.push({ level: nextLv, badge: "⚡ 当前推荐挑战" });
    }
    groups.forEach(g => {
      const modLevels = levels.filter(l => l.stage === g);
      if (!modLevels.length) return;
      const firstUnfinished = modLevels.find(l => !isDone(l)) || modLevels[0];
      if (!displayList.some(d => d.level.id === firstUnfinished.id)) {
        const fin = modLevels.filter(isDone).length;
        displayList.push({ level: firstUnfinished, badge: g + " (" + fin + "/" + modLevels.length + ")" });
      }
    });

    const total = Math.min(8, displayList.length);
    for (let i = 0; i < total; i++) {
      const item = displayList[i];
      const lv = item.level;
      const done = isDone(lv);
      const ang = (i / total) * Math.PI * 2;
      const rad = sceneMode === "tower" ? 215 : 275;
      const el = document.createElement("article");
      el.className = "orbit-card" + (activeCourse === "cet4" ? " cet4-tone" : "");
      el.innerHTML =
        '<div class="orbit-card-top"><span class="orbit-card-tag">' + esc(item.badge) + '</span><span class="nova-dot' + (done ? ' done' : '') + '"></span></div>' +
        '<div class="orbit-card-title">第 ' + String(lv.id).padStart(2, "0") + ' 关 · ' + esc(lv.title) + '</div>' +
        '<div class="orbit-card-desc">' + esc(lv.gist) + '</div>' +
        '<div class="orbit-card-foot"><span>约 ' + lv.minutes + ' 分钟 · ' + (done ? '✓ 已通关' : '点击直接挑战') + '</span><span class="orbit-card-action">进入实训 →</span></div>';
      attachReliableCardClick(el, function() {
        // 单击卡片直接进入该关卡实训舱！
        forceOpenLevelInWorkspace(lv);
      });
      cardsLayer.appendChild(el);
      orbitCardItems.push({
        el: el,
        x: Math.cos(ang) * rad,
        y: sceneMode === "tower" ? ((i % 3 - 1) * 75) : (Math.sin(ang * 2) * 38),
        z: Math.sin(ang) * rad,
        isPortal: false,
        data: lv
      });
    }
  }

  function project3D(x, y, z, cx, cy) {
    const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
    const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
    const x1 = x * cosY - z * sinY;
    const z1 = z * cosY + x * sinY;
    const y2 = y * cosX - z1 * sinX;
    const z2 = z1 * cosX + y * sinX;
    const fov = W <= 768 ? 520 : 720;
    const depth = Math.max(140, fov + z2 + camZ);
    const scale = (fov / depth) * (W <= 768 ? Math.min(1, W / 640) : 1);
    return { x: cx + x1 * scale, y: cy + y2 * scale, s: scale, z: z2 };
  }

  function updateOrbitCardsLayout(cx, cy) {
    const isMobile = W <= 768;
    cardsLayer.classList.toggle("mobile-dock-mode", isMobile);
    if (isMobile) return;

    const dpr = window.devicePixelRatio || 1;
    const centerProj = project3D(0, 0, 0, cx, cy);
    const coreRadius = (sceneMode === "orbit" ? 112 : sceneMode === "tower" ? 150 : 0) * centerProj.s;

    orbitCardItems.forEach(item => {
      const el = item.el;
      const p = project3D(item.x, item.y, item.z, cx, cy);
      const rawSc = Math.max(0.62, Math.min(1.06, p.s * 0.95));
      const sc = Math.round(rawSc * 50) / 50;
      const w = item.isPortal ? 278 : 224;
      const h = item.isPortal ? 166 : 124;

      const clampedX = Math.max(w * 0.5 + 16, Math.min(W - w * 0.5 - 16, p.x));
      const clampedY = Math.max(h * 0.5 + 90, Math.min(H - h * 0.5 - 66, p.y));
      const tx = Math.round((clampedX - w * 0.5) * dpr) / dpr;
      const ty = Math.round((clampedY - h * 0.5) * dpr) / dpr;

      el.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${sc})`;

      const isBehind = !item.isPortal && p.z > 20;
      el.classList.toggle("is-behind", isBehind);
      el.classList.toggle("is-front", !isBehind);

      if (isBehind && coreRadius > 10) {
        const localCoreX = ((cx - clampedX) / sc) + w * 0.5;
        const localCoreY = ((cy - clampedY) / sc) + h * 0.5;
        const localCoreR = coreRadius / sc;
        const maskGrad = `radial-gradient(circle ${localCoreR.toFixed(0)}px at ${localCoreX.toFixed(0)}px ${localCoreY.toFixed(0)}px, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.28) 58%, rgba(0,0,0,1) 100%)`;
        el.style.webkitMaskImage = maskGrad;
        el.style.maskImage = maskGrad;
        const depthFade = Math.max(0.32, Math.min(0.82, (p.s - 0.35) * 1.2));
        el.style.opacity = depthFade.toFixed(2);
        el.style.filter = "brightness(0.75) saturate(0.9)";
        el.style.pointerEvents = "auto"; // 即使在背面露出边缘也可点击
      } else {
        el.style.webkitMaskImage = "none";
        el.style.maskImage = "none";
        el.style.opacity = "1";
        el.style.filter = "none";
        el.style.pointerEvents = "auto";
      }
    });
  }

  /* ===== 6. 主渲染循环：五彩星云 + 银河光带 + 流星 + 18,000 强磁星尘 ===== */
  function tickCosmos() {
    if (currentUiMode === "cosmos") {
      ctx.clearRect(0, 0, W, H);
      fgCtx.clearRect(0, 0, W, H);

      if (!isDragging && (sceneMode === "binary" || sceneMode === "orbit" || sceneMode === "tower")) {
        targetRotY += 0.0008;
      }
      rotX += (targetRotX - rotX) * 0.06;
      rotY += (targetRotY - rotY) * 0.06;
      camZ += (targetCamZ - camZ) * 0.07;

      const isMobile = W <= 768;
      const cx = W * 0.5;
      const cy = isMobile ? H * 0.35 : H * 0.5;
      const th = NEBULA_THEMES[nebulaIdx];

      // 1) 绘制斜贯天际的银河星带 (Milky Way Diagonal Band)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-0.38);
      const mwGrad = ctx.createLinearGradient(0, -H * 0.32, 0, H * 0.32);
      mwGrad.addColorStop(0, "rgba(0,0,0,0)");
      mwGrad.addColorStop(0.35, th.milky);
      mwGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.07)");
      mwGrad.addColorStop(0.65, th.milky);
      mwGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = mwGrad;
      ctx.fillRect(-W, -H * 0.32, W * 2, H * 0.64);
      ctx.restore();

      // 2) 绘制 5 团动态呼吸的深空星云气团 (Nebula Clouds)
      for (let i = 0; i < nebulaClouds.length; i++) {
        const nc = nebulaClouds[i];
        nc.ang += nc.spd;
        const nx = W * nc.baseX + Math.cos(nc.ang) * 55;
        const ny = H * nc.baseY + Math.sin(nc.ang * 1.3) * 40;
        const nr = Math.max(W, H) * nc.rad;
        const ng = ctx.createRadialGradient(nx, ny, 10, nx, ny, nr);
        const hVal = th.hues[i % th.hues.length];
        ng.addColorStop(0, `hsla(${hVal}, 90%, 56%, ${nc.alpha})`);
        ng.addColorStop(0.5, `hsla(${(hVal + 28) % 360}, 85%, 42%, ${nc.alpha * 0.45})`);
        ng.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = ng;
        ctx.fillRect(0, 0, W, H);
      }

      // 3) 远景多彩闪烁恒星与十字星芒
      for (let i = 0; i < bgStars.length; i++) {
        const s = bgStars[i];
        s.p += s.sp;
        const a = s.a * (0.5 + 0.5 * Math.sin(s.p));
        ctx.fillStyle = `hsla(${s.hue}, 85%, 88%, ${a.toFixed(2)})`;
        ctx.fillRect(s.x, s.y, s.r, s.r);
        if (s.isFlare && a > 0.65) {
          ctx.fillStyle = `hsla(${s.hue}, 95%, 95%, ${(a * 0.45).toFixed(2)})`;
          ctx.fillRect(s.x - s.r * 3, s.y, s.r * 7, 0.8);
          ctx.fillRect(s.x, s.y - s.r * 3, 0.8, s.r * 7);
        }
      }

      // 4) 随机划过天际的流星 (Shooting Stars)
      if (Math.random() < 0.018) spawnMeteor();
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.x += m.vx;
        m.y += m.vy;
        m.alpha -= 0.016;
        if (m.alpha <= 0 || m.x < -100 || m.y > H + 100) {
          meteors.splice(i, 1);
          continue;
        }
        const tailX = m.x - (m.vx / 12) * m.len;
        const tailY = m.y - (m.vy / 12) * m.len;
        const mg = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
        mg.addColorStop(0, `hsla(${m.hue}, 100%, 95%, ${m.alpha})`);
        mg.addColorStop(1, "rgba(255,255,255,0)");
        ctx.strokeStyle = mg;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
      }

      // 5) 星球核心多层星冕辉光
      if (sceneMode === "binary") {
        const sep = isMobile ? 145 : 250;
        [-sep, sep].forEach((ox, idx) => {
          const pCore = project3D(ox, 0, 0, cx, cy);
          const rCore = (isMobile ? 110 : 175) * pCore.s;
          const cg = ctx.createRadialGradient(pCore.x, pCore.y, 4, pCore.x, pCore.y, rCore);
          cg.addColorStop(0, idx === 0 ? "rgba(56, 189, 248, 0.42)" : "rgba(192, 132, 252, 0.42)");
          cg.addColorStop(0.5, idx === 0 ? "rgba(29, 78, 216, 0.16)" : "rgba(126, 34, 206, 0.16)");
          cg.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = cg;
          ctx.beginPath();
          ctx.arc(pCore.x, pCore.y, rCore, 0, Math.PI * 2);
          ctx.fill();
        });
      } else if (sceneMode === "orbit" || sceneMode === "tower") {
        const cProj = project3D(0, 0, 0, cx, cy);
        const coreR = (sceneMode === "orbit" ? 118 : 152) * cProj.s;
        const g = fgCtx.createRadialGradient(cx, cy, 2, cx, cy, coreR);
        g.addColorStop(0, th.coreA);
        g.addColorStop(0.55, th.coreB);
        g.addColorStop(1, "rgba(3, 5, 13, 0)");
        fgCtx.fillStyle = g;
        fgCtx.beginPath();
        fgCtx.arc(cx, cy, coreR, 0, Math.PI * 2);
        fgCtx.fill();
      }

      // 6) 鼠标/手指引力光环
      const pointerRecent = pointer.active && (Date.now() - pointer.lastMove < 12000);
      if (pointerRecent && magnetStrength > 0) {
        const mg = fgCtx.createRadialGradient(pointer.x, pointer.y, 2, pointer.x, pointer.y, 150);
        mg.addColorStop(0, "rgba(56, 189, 248, 0.28)");
        mg.addColorStop(0.45, "rgba(192, 132, 252, 0.11)");
        mg.addColorStop(1, "rgba(0, 0, 0, 0)");
        fgCtx.fillStyle = mg;
        fgCtx.beginPath();
        fgCtx.arc(pointer.x, pointer.y, 150, 0, Math.PI * 2);
        fgCtx.fill();
      }

      // 7) 18,000+ 粒子物理与鼠标指哪跟哪更新
      const use3D = (sceneMode === "binary" || sceneMode === "orbit" || sceneMode === "tower");
      const activeSwarmLimit = Math.min(SWARM_COUNT, Math.floor(PARTICLE_COUNT * 0.25));

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = particles[i];
        p.phase += 0.04;

        if (i < activeSwarmLimit && pointerRecent && magnetStrength > 0) {
          p.orbitAng += 0.045 + (i % 7) * 0.008;
          const ringR = p.orbitRad * (0.25 + 0.75 * Math.sin(p.phase * 0.5 + i));
          const targetX = pointer.x + Math.cos(p.orbitAng) * ringR * (1.1 - magnetStrength * 0.35);
          const targetY = pointer.y + Math.sin(p.orbitAng) * ringR * (1.1 - magnetStrength * 0.35);
          p.svx = (p.svx + (targetX - p.sx) * p.ease * 1.45) * 0.78;
          p.svy = (p.svy + (targetY - p.sy) * p.ease * 1.45) * 0.78;
          p.sx += p.svx;
          p.sy += p.svy;

          const al = Math.min(1, (0.58 + 0.42 * Math.sin(p.phase)) * 0.95);
          fgCtx.fillStyle = `hsla(${p.hue}, 96%, 78%, ${al.toFixed(2)})`;
          fgCtx.fillRect(p.sx, p.sy, p.size * 1.45, p.size * 1.45);
          continue;
        }

        p.vx = (p.vx + (p.tx - p.x) * p.ease) * 0.76;
        p.vy = (p.vy + (p.ty - p.y) * p.ease) * 0.76;
        p.vz = (p.vz + (p.tz - p.z) * p.ease) * 0.76;
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        const proj = use3D ? project3D(p.x, p.y, p.z, cx, cy) : {
          x: cx + p.x * (isMobile ? 0.55 : 1),
          y: cy + p.y * (isMobile ? 0.55 : 1),
          s: 720 / Math.max(140, 720 + p.z),
          z: p.z
        };

        let drawX = proj.x;
        let drawY = proj.y;
        let extraLight = 0;

        if (pointerRecent && magnetStrength > 0) {
          const dx = pointer.x - drawX;
          const dy = pointer.y - drawY;
          const distSq = dx * dx + dy * dy;
          const maxR = isMobile ? 195 : 285;
          if (distSq < maxR * maxR && distSq > 1) {
            const dist = Math.sqrt(distSq);
            const factor = (1 - dist / maxR) * magnetStrength;
            if (magnetMode === "attract") {
              drawX += dx * factor * 0.74;
              drawY += dy * factor * 0.74;
            } else if (magnetMode === "vortex") {
              drawX += dx * factor * 0.45 - dy * factor * 0.58;
              drawY += dy * factor * 0.45 + dx * factor * 0.58;
            } else {
              drawX -= (dx / dist) * factor * 95;
              drawY -= (dy / dist) * factor * 95;
            }
            extraLight = factor * 28;
          }
        }

        p.sx = drawX;
        p.sy = drawY;

        if (drawX < -10 || drawX > W + 10 || drawY < -10 || drawY > H + 10) continue;

        const twinkle = 0.68 + 0.32 * Math.sin(p.phase);
        const alpha = Math.min(1, p.alpha * twinkle * Math.min(1.2, proj.s));
        const rad = Math.max(0.42, p.size * proj.s);
        const targetCtx = (use3D && proj.z < 0) ? fgCtx : ctx;

        targetCtx.fillStyle = `hsla(${p.hue}, ${p.sat}%, ${Math.min(96, p.light + extraLight).toFixed(0)}%, ${alpha.toFixed(2)})`;
        if (rad < 1.35) {
          targetCtx.fillRect(drawX, drawY, rad * 1.35, rad * 1.35);
        } else {
          targetCtx.beginPath();
          targetCtx.arc(drawX, drawY, rad, 0, Math.PI * 2);
          targetCtx.fill();
        }
      }

      // 8) 礼花粒子
      for (let i = fireworks.length - 1; i >= 0; i--) {
        const f = fireworks[i];
        f.x += f.vx; f.y += f.vy; f.vy += f.gravity;
        f.vx *= 0.985; f.vy *= 0.985; f.alpha -= f.decay;
        if (f.alpha <= 0.02) { fireworks.splice(i, 1); continue; }
        fgCtx.fillStyle = `hsla(${f.hue}, 95%, ${f.light}%, ${f.alpha.toFixed(2)})`;
        fgCtx.beginPath();
        fgCtx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
        fgCtx.fill();
      }

      if (orbitCardItems.length > 0 && document.body.dataset.cosmosView !== "workspace") {
        updateOrbitCardsLayout(cx, cy);
      }
    }
    requestAnimationFrame(tickCosmos);
  }

  /* ===== 7. 鼠标与触摸事件绑定 ===== */
  window.addEventListener("pointermove", function(e) {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.active = true;
    pointer.lastMove = Date.now();
    if (isDragging) {
      const dx = e.clientX - dragStartX;
      const dy = e.clientY - dragStartY;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      targetRotY += dx * 0.0055;
      targetRotX = Math.max(-0.65, Math.min(0.85, targetRotX + dy * 0.0045));
    }
  }, { passive: true });

  bgCanvas.addEventListener("pointerdown", function(e) {
    isDragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.active = true;
    pointer.lastMove = Date.now();
  });
  window.addEventListener("pointerup", function() { isDragging = false; });

  bgCanvas.addEventListener("wheel", function(e) {
    targetCamZ = Math.max(-260, Math.min(360, targetCamZ + e.deltaY * 0.35));
  }, { passive: true });

  document.querySelectorAll(".chapter-orb[data-chapter]").forEach(btn => {
    btn.addEventListener("click", function() {
      setCosmosChapter(btn.dataset.chapter);
    });
  });
  document.getElementById("cosmosBackBinaryBtn").addEventListener("click", function() {
    setCosmosChapter("binary");
  });
  document.querySelectorAll("[data-cosmos-open]").forEach(btn => {
    btn.addEventListener("click", function() {
      openCosmosWorkspace(btn.dataset.cosmosOpen);
    });
  });
  document.getElementById("cosmosToGlassBtn").addEventListener("click", function() {
    setUiMode("glass", true);
  });
  document.getElementById("cosmosChooserBtn").addEventListener("click", function() {
    document.getElementById("uiChooserModal").classList.remove("is-hidden");
  });
  document.querySelectorAll("[data-choose-ui]").forEach(card => {
    card.addEventListener("click", function() {
      document.getElementById("uiChooserModal").classList.add("is-hidden");
      setUiMode(card.dataset.chooseUi, true);
    });
  });

  const magnetBtn = document.getElementById("magnetModeBtn");
  magnetBtn.addEventListener("click", function() {
    const order = ["attract", "vortex", "repel"];
    const labels = {
      attract: "🧲 指哪跟哪：强磁聚拢",
      vortex: "🌀 指哪跟哪：星璇环绕",
      repel: "✨ 指哪跟哪：斥力拨云"
    };
    magnetMode = order[(order.indexOf(magnetMode) + 1) % order.length];
    magnetBtn.textContent = labels[magnetMode];
  });

  const nebulaBtn = document.getElementById("nebulaThemeBtn");
  nebulaBtn.addEventListener("click", function() {
    nebulaIdx = (nebulaIdx + 1) % NEBULA_THEMES.length;
    const th = NEBULA_THEMES[nebulaIdx];
    nebulaBtn.textContent = "🌌 星云：" + th.name;
    setCosmosChapter(sceneMode);
    spawnFireworkBurst(W * 0.5, H * 0.5, "star");
  });

  const pRange = document.getElementById("particleCountRange");
  const pVal = document.getElementById("particleCountVal");
  pRange.addEventListener("input", function() {
    PARTICLE_COUNT = Number(pRange.value);
    SWARM_COUNT = Math.floor(PARTICLE_COUNT * 0.24);
    pVal.textContent = Math.round(PARTICLE_COUNT / 1000) + "k";
  });
  const fRange = document.getElementById("magnetForceRange");
  fRange.addEventListener("input", function() {
    magnetStrength = Number(fRange.value) / 100;
  });

  /* ===== 8. 启动初始化 ===== */
  resizeCosmosCanvas();
  initParticlePool();
  shapeBinaryPlanets();
  buildCosmosOrbitCards();
  setUiMode(currentUiMode, false);
  requestAnimationFrame(tickCosmos);

  setTimeout(function() {
    document.getElementById("uiChooserModal").classList.remove("is-hidden");
  }, 1550);
})();
