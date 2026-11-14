# HT Lab 架构说明

> 本文件是站点的完整架构地图。第一次接触代码，请先读根目录 `AGENTS.md`；写课程数据请看 [CONTENT-GUIDE.md](CONTENT-GUIDE.md)。
> 文中路径均相对于仓库根目录（= 站点根目录 = GitHub Pages 发布根目录）。

## 1. 项目概览

HT Lab 是一个**纯静态**的中文学习网站，包含 C 语言（86 关 / 11 个模块）与英语四级（62 关 / 7 个模块）两门课。

架构上的"物理定律"：

- **没有构建步骤**：仓库里的文件就是线上文件，浏览器直接加载，改完刷新即可。
- **没有依赖**：不引入 npm 包、框架、预处理器、打包器；全部是 vanilla HTML/CSS/JS。
- **没有后端**：不发起业务网络请求，不收集、不上传数据；学习进度、代码草稿、录音只存在访问者本机浏览器。
- **GitHub Pages 托管**：仓库 `chenshou666/chenshou666.github.io` 的 `main` 分支根目录即发布目录，`.nojekyll` 已就位。
- **必须支持 `file://` 双击打开**：所有资源引用都是相对路径；不能依赖 fetch 本地 JSON、Service Worker 等需要 HTTP 的能力。
- **经典 `<script>`（不是 ES Module）**：`js/` 下 14 个文件共享同一个全局作用域，靠加载顺序表达依赖；`content/` 下的数据文件也是经典脚本。
- **CSS 靠层叠顺序**：`css/` 下 3 个文件按 06 → 08 → 10 加载，10-ui.css 是全新界面层（最后加载、优先级最高）。

## 2. 目录树与职责

```
htlab-site/                        站点根目录（= GitHub Pages 发布根目录）
├─ index.html                      唯一页面：head 资源引用 + 页面 shell DOM（约 13 KB）
├─ .nojekyll                       关闭 GitHub Pages 的 Jekyll 处理（必须有，保留）
├─ LICENSE                         版权与使用许可（不要改）
├─ README.md                       面向访客/使用者的说明（课程表、本地使用、许可摘要、部署）
├─ AGENTS.md                       面向 AI 编码代理的维护须知（结构或规则变了要同步更新）
├─ .gitignore                      忽略 .verify/（验证报告/截图）与系统垃圾文件
├─ docs/
│  ├─ ARCHITECTURE.md              本文件：架构、加载顺序、子系统、全局符号、约束
│  └─ CONTENT-GUIDE.md             内容作者指南：C / 四级关卡数据 schema、加关卡、加音频
├─ tools/
│  └─ verify-site.mjs              本地验证脚本：Node 起本地服务 + 无头 Edge/Chrome 走交互矩阵并出报告
│                                  （开发辅助，不参与站点运行；用法见 AGENTS.md 或脚本 --help）
├─ css/                            3 个样式文件，按顺序加载（全新 UI 架构）
│  ├─ 06-fps.css                   星空 UI 骨架：FPS 监视器 + 双 UI 切换器/进站门户 + 星空宇宙/HUD/星轨卡 + 全息工作台
│  ├─ 08-liquid-glass.css          showcase 液态玻璃材质原样：深空极光画布、.liquid-glass / .liquid-pill / .glass-ripple
│  └─ 10-ui.css                    全新界面层（必须最后加载）：悬浮胶囊顶栏 + 底部 Dock + 玻璃组件 + 深色可读性 + 手机端
├─ js/                             14 个应用脚本，按编号顺序加载；共享全局作用域
│  ├─ 01-course-registry.js        课程注册表：汇总 content 数据 → courseLevels / COURSES / 进度存储键
│  ├─ 02-app-core.js               应用核心：stores/data 状态、localStorage、主题、编辑器工具、密码弹窗、统计
│  ├─ 03-lesson-format.js          讲义排版（fmtLesson / fmtInline）、switchPage、navTitle
│  ├─ 04-progress-backup.js        JSON 导出/导入、存档码/存档链接（#save=）
│  ├─ 05-views.js                  渲染路由 render() + 课程页/路线地图/关于页/继续页 + C 关卡页
│  ├─ 06-cet4-engine.js            英语四级任务引擎：听力/阅读/写作/翻译/口语/模考、录音、判分、音频渲染
│  ├─ 07-project-and-summary.js    7 天项目支线、我的总结页、openLevel()、答题奖励
│  ├─ 08-c-checker.js              C 语言检查器：词法/语法分析、结构检查、运行结果比对、通关判定、胜利动画
│  ├─ 09-events.js                 全局事件委托（data-action / data-page / data-level / data-pick）、编辑器快捷键；末尾首次 render()
│  ├─ 10-splash.js                 开屏动画：splash 落位、跳过、首屏元素 drop-in
│  ├─ 11-appearance.js             外观面板：天空预设 + 玻璃模糊/不透明度/圆角/噪点/边缘高光（动态生成 FAB 与面板）
│  ├─ 12-pointer-tilt.js           指针跟随倾斜（鼠标 3D 倾斜；触屏与 reduced-motion 自动关闭）
│  ├─ 13-dual-ui.js                双 UI 引擎：FPS 监控、星云/18000 粒子、3D 星轨卡片、UI 门户、与主应用的桥接（应用逻辑收尾）
│  └─ 14-liquid-glass.js           液态玻璃视觉引擎（极光画布 / 光标高光 / 点击涟漪；纯视觉，不改业务）
├─ content/                        课程数据（经典脚本，先于 js/ 加载；只放数据，不放逻辑）
│  ├─ c/                           C 语言，每个模块一个文件，按模块号命名
│  │  ├─ c0-getting-started.js     模块 0 · 起步上路（8 关，id 1–8）
│  │  ├─ c1-control-flow.js        模块 1 · 流程控制（8 关，id 9–16）
│  │  ├─ c2-functions.js           模块 2 · 函数与程序结构（8 关，id 17–24）
│  │  ├─ c3-arrays-strings.js      模块 3 · 数组与字符串（8 关，id 25–32）
│  │  ├─ c4-pointers-memory.js     模块 4 · 指针与内存（10 关，id 33–42）
│  │  ├─ c5-types-ds.js            模块 5 · 自定义类型与数据结构（8 关，id 43–50）
│  │  ├─ c6-file-io.js             模块 6 · 文件与输入输出（6 关，id 51–56）
│  │  ├─ c7-engineering.js         模块 7 · 预处理器与工程实践（8 关，id 57–64）
│  │  ├─ c8-algorithms.js          模块 8 · 数据结构与算法（10 关，id 65–74）
│  │  ├─ c9-systems.js             模块 9 · 系统与底层（6 关，id 75–80）
│  │  └─ c10-projects.js           模块 10 · 综合项目（6 关，id 81–86）
│  └─ cet4/                        英语四级，每个模块一个文件；index.html 中的加载顺序 = 课程路线顺序
│     ├─ m0-foundation.js          模块 0 · 地基（8 关，id 101–108）
│     ├─ m1-listening.js           模块 1 · 听力（12 关，id 201–212）
│     ├─ m3-reading.js             模块 3 · 阅读（14 关，id 401–414）
│     ├─ m4-writing.js             模块 4 · 写作（8 关，id 501–508）
│     ├─ m5-translation.js         模块 5 · 翻译（8 关，id 601–608）
│     ├─ m2-speaking.js            模块 2 · 口语（10 关，id 301–310）
│     └─ m6-mock.js                模块 6 · 全真模考（2 关，id 701–702）
├─ assets/
│  ├─ favicon.svg                  站点图标（SVG）
│  ├─ ht-lab.ico                   站点图标（ICO，Windows / 收藏夹用）
│  └─ audio/cet4/                  四级音频：46 个 mp3 + 10 个作者元数据 JSON（运行时只加载 mp3）
│     ├─ <关卡号>-<序号>.mp3       例如 102-1.mp3 是第 102 关的第 1 段音频
│     ├─ manifest*.json            单声道音频清单（file/text/voice/rate），仅作者校验用，页面不加载
│     └─ dialogue*.json            多角色对话清单（file/note/parts[]），仅作者校验用，页面不加载
└─ （无 node_modules、无构建产物、无运行时依赖）
```

## 3. 加载顺序与页面生命周期

### 3.1 index.html 的加载顺序（顺序即语义）

```
<html>                                   ← <html data-sky="noon" lang="zh-CN">
  <head>
    css/06-fps.css → 08-liquid-glass.css → 10-ui.css
                                         ← 顺序 = 层叠顺序，不能随意调换
  <body class="splash-active">
    页面 shell（全部先存在，JS 只负责往 #view 里渲染）：
      #splash-screen（开屏） / .app（.sidebar + .main > .topbar + main#view） /
      #toast / #resetModal / #htFpsMonitor /
      #uiChooserModal（双 UI 门户） / #cosmos-stage（星空画布） /
      #cosmosHud / #cosmosInspectModal
    经典 <script>（顺序 = 依赖顺序）：
      content/c/c0..c10.js   ×11  → window.C_MODULES（模块顺序 = C 课程路线顺序）
      content/cet4/m0,m1,m3,m4,m5,m2,m6.js ×7 → window.CET4_MODULES（模块顺序 = 四级路线顺序）
      js/01-course-registry.js
      js/02-app-core.js
      ...
      js/12-pointer-tilt.js
      js/13-dual-ui.js         ← 应用逻辑收尾（enhance 前面的 DOM 与全局函数）
      js/14-liquid-glass.js    ← 可选皮肤视觉增强（必须在 13 之后；不改业务）
```

要点：

- **样式先于一切**：CSS 决定首屏骨架的显示，JS 只改 `#view` 与少量动态节点。
- **数据先于应用逻辑**：`content/*.js` 只把模块数组 push 进 `window.C_MODULES` / `window.CET4_MODULES`；`js/01` 才把它们展开成关卡列表。
- **`js/09-events.js` 的最后一行是首次 `render()`**：此时 body 末尾 DOM 已存在，所以页面首次可见内容由它绘制。
- **`js/13-dual-ui.js` 是收尾层**：它读取已有 DOM（`#htFpsMonitor`、`#uiChooserModal`、`#cosmos-stage` 等），包装 `window.render` / `window.save`，启动粒子循环，并在最后弹出双 UI 门户。

### 3.2 生命周期（从打开页面到渲染完成）

```
浏览器打开 index.html
  │
  ├─ 解析 <head>，并行请求 3 个 CSS 文件（06-fps 星空骨架 / 08-liquid-glass 液态玻璃材质 / 10-ui 全新界面层）
  ├─ 解析 <body> 骨架（页面壳已存在：splash、sidebar、topbar、#view 空容器、toast、modal、双 UI 节点）
  ├─ 同步执行 content/c/*.js ×11   → window.C_MODULES   （每关 level 数据）
  ├─ 同步执行 content/cet4/*.js ×7 → window.CET4_MODULES（每关 level 数据）
  ├─ 同步执行 js/01（注册表）
  │     cLevels/cet4Levels 聚合 → course="c"/"cet4"、module/stage 由模块名注入
  │     COURSES 复制文案、storage key、activeCourse 从 localStorage 读回
  ├─ 同步执行 js/02（核心）
  │     stores = 每门课一份状态（读 localStorage）→ data = stores[activeCourse]
  │     applyTheme()（浅色基调；天空由 data-sky 决定）
  │     定义编辑器/密码/统计/保存等函数
  ├─ 同步执行 js/03..08（定义函数，基本不执行副作用）
  ├─ 同步执行 js/09（绑定全局事件委托）→ 末尾 render() 首次渲染
  ├─ 同步执行 js/10（开屏动画 IIFE：1.4s 后揭示界面，可跳过/Esc）
  ├─ 同步执行 js/11（立即 apBuild()：注入外观 FAB + 面板）
  ├─ 同步执行 js/12（指针倾斜 IIFE）
  ├─ 同步执行 js/13（双 UI IIFE）
  │     包装 window.render / window.save → 渲染后同步顶栏/星环卡
  │     setUiMode(上次模式, false) → body.dataset.uiMode = "glass"|"cosmos"
  │     初始化粒子池 / 星轨卡片 / 主循环 requestAnimationFrame(tickCosmos)
  │     1.55s 后移除 #uiChooserModal 的 is-hidden（进站 UI 门户）
  ▼
页面可交互
```

### 3.3 CSS 层叠分层（从底到顶）

| 顺序 | 文件 | 职责 | 备注 |
| --- | --- | --- | --- |
| 1 | `css/01-base.css` | 旧版底层：变量、重置、布局、侧栏/顶栏/页头、课程卡、开屏 | 最早，最容易被覆盖 |
| 2 | `css/02-design-system.css` | Liquid Glass 设计系统、天空/云层变量、组件骨架、响应式 | 定义 `--glass-*`、`--r-*` 等变量 |
| 3 | `css/03-refinements.css` | 外观面板、玻璃质感、代码块、hover、四级组件、弹窗、胜利页 | 大量视觉细节与 `!important` |
| 4 | `css/04-effects.css` | 外观参数联动、关卡区玻璃层次、果冻弹簧 | 用变量驱动所有卡片 |
| 5 | `css/05-motion.css` | 指针倾斜、滑入、转场、通关条、备份面板 | 与 `12-pointer-tilt.js` 配合 |
| 6 | `css/06-fps.css` | FPS 监视器 + **双 UI 的全部样式**（切换器、门户、星空舞台、HUD、星轨卡、工作台、手机端玻璃修复） | 名字叫 fps，实际承载双 UI |
| 7 | `css/07-mobile-patch.css` | 手机端 FPS 防遮挡 + 星轨坞布局补丁 | **必须最后**，用 `!important` 覆盖前面 |

补充：

- `06-fps.css` 是"双 UI 第二套样式"的入口：`body[data-ui-mode="cosmos"]`、`body[data-cosmos-view=...]` 相关规则全部在这里；玻璃模式的手机端修复也在其中。
- 排在前面的文件被后面的文件覆盖是常态；改样式时优先在**最后出现该选择器的文件**里改，或新增文件并放到合适层级。
- 07 必须保持最后，否则手机端 FPS 与星轨坞的修正会被覆盖。

### 3.4 JS 加载顺序与依赖

所有文件共享同一个全局词法作用域（经典脚本）。顶层 `function` 声明会成为 `window` 属性；顶层 `const` / `let` 是全局词法绑定（**不在 window 上**），但后续文件可直接引用。

| # | 文件 | 依赖（调用时） | 主要提供 |
| --- | --- | --- | --- |
| 01 | course-registry | content 数据 | `COURSES`、`courseLevels`、`courseGroups`、`activeCourse`、`levels`、`groups`、`courseKey` |
| 02 | app-core | 01 | `stores`、`data`、`save()`、`setCourse()`、`applyTheme()`、编辑器工具、密码/重置、统计函数 |
| 03 | lesson-format | 02（`esc`） | `fmtLesson()`、`fmtInline()`、`switchPage()`、`navTitle()` |
| 04 | progress-backup | 02 | 导出/导入、存档码 `buildSaveCode()` / `applySaveCode()` |
| 05 | views | 01/02/03/06 | `render()` 路由、`renderCourses/Map/About/Practice/Lesson/CodeLesson` |
| 06 | cet4-engine | 02/03/05 | 任务状态、题目渲染、录音、判分、`renderEnglishLesson()`、`completeTask()` |
| 07 | project-and-summary | 02/03/05/06 | `PROJECT_DAYS`、`renderProject()`、`renderSummary()`、`openLevel()` |
| 08 | c-checker | 02/05/06 | `validateChallenge()`、`checkCode()`、`checkRunOutput()`、`maybeComplete()`、胜利动画 |
| 09 | events | 全部 | 事件委托；末尾首次 `render()` |
| 10 | splash | 无（独立 IIFE） | 开屏动画 |
| 11 | appearance | 02（`toast`） | 外观面板（立即执行 `apBuild()`） |
| 12 | pointer-tilt | 无（独立 IIFE） | 卡片 3D 倾斜 |
| 13 | dual-ui | 01–12 + 双 UI DOM | 双 UI、粒子、FPS、星轨卡；包装 `window.render/save` |

## 4. 运行时状态与本地存储

### 4.1 核心状态对象

`js/01` 建立课程骨架，`js/02` 建立状态：

```js
COURSES = [{ id:"c", name:"C 语言", store:"cquest.master.v1", … },
           { id:"cet4", name:"英语四级", store:"cquest.cet4.v1", … }]
courseLevels = { c: [...86 个 level], cet4: [...62 个 level] }
courseGroups = { c: ["模块 0 · 起步上路", ...], cet4: [...] }
stores = { c: {...状态}, cet4: {...状态} }   // 每门课一份
data   = stores[activeCourse]                // 当前课程状态（全局变量，被 render/save 直接读写）
levels = courseLevels[activeCourse]          // 当前课程关卡数组（顺序 = 路线顺序）
groups = courseGroups[activeCourse]          // 当前课程模块名数组
```

每门课的状态形如：

```js
{
  completed:   { "1": { at: 1730000000000 }, ... }, // 已通关：level id → 时间
  xp:          0,        // 学习点（每通一关 +30）
  attempts:    0,        // 答题次数
  correct:     0,        // 答对次数
  started:     1730000000000,
  drafts:      { "1": "代码草稿…" },  // 代码/作文草稿（按 level id）
  quizRewards: { "1": true },         // 旧版单题奖励标记（迁移兼容用）
  runOutputs:  { "3": "本机运行输出…" } // 仅 C 课程用到时出现
}
```

关卡对象的通用字段见 [CONTENT-GUIDE.md](CONTENT-GUIDE.md)。

### 4.2 localStorage 键（全部键名固定，改动会破坏老用户进度）

| 键 | 写入方 | 内容 | 是否参与导出/存档码 |
| --- | --- | --- | --- |
| `cquest.master.v1` | `js/02 save()` | C 课程状态 JSON | ✅ |
| `cquest.cet4.v1` | `js/02 save()` | 四级课程状态 JSON | ✅ |
| `cquest.course.v1` | `js/02 setCourse()`、`js/13 warpIntoCoursePlanet()` | 当前课程 `"c"` / `"cet4"` | ✅ |
| `cquest.appearance.v1` | `js/11 apSave()` | 外观 `{sky,blur,tint,radius,noise,edge}` | ✅ |
| `codesword.reset.password.v1` | `js/02` | 重置进度/看答案共用的密码哈希（`sha256:…` 或降级 `local:…`） | ✅ |
| `cquest.project.v1` | `js/07` | 7 天项目完成状态 `{done:{1:true,…}}` | ❌ |
| `codesword.theme.v1` | `js/02` | 旧的 `system/light/dark` 主题模式（兼容保留；当前渲染固定浅色基调） | ❌ |
| `htlab.uimode.v1` | `js/13` | 双 UI 模式 `"glass"` / `"cosmos"` | ❌ |

> 注意：`js/04` 的 `PROGRESS_KEYS` 只包含前 5 项；`cquest.project.v1`、`codesword.theme.v1`、`htlab.uimode.v1` **不会**被"导出进度文件/存档码"迁移（已知限制）。

### 4.3 关卡解锁与学习点

- 解锁规则：`unlocked(level)` = 第一关，或前一关已 `completed`（顺序按 `levels` 数组，即路线顺序）。
- 通关成绩：每关第一次完成时 `data.completed[id]={at}`，`data.xp += 30`（C 与四级一致，由 `completeTask()` / `maybeComplete()` 增加）。
- C 关卡额外历史逻辑：若某关使用旧式单题 `quiz` 字段（当前数据已全部改成 `questions`，无关卡使用），答对会走 `awardForQuiz()` 给 +10 点。
- 学习统计：答题次数/正确数在每次作答时累加；总结页据此算正确率。

## 5. 渲染与路由

### 5.1 路由（`js/05`）

`render()` 是唯一重绘入口：

```text
render()
 ├─ navTitle()：更新 #topTitle（按 page + 当前课程）
 ├─ 更新 #xpTop（学习点）与 .nav-btn.active
 ├─ 若 activeLevel 存在 → renderLesson()（C 或英语）→ ensureNextBar() → return
 └─ 否则按 page 分发：
      "courses"  → renderCourses()      // 两门课卡片
      "map"      → renderMap()          // 课程路线 + 模块/关卡网格
      "practice" → renderPractice()     // 继续下一关
      "about"    → renderAbout()        // 关于 / 免责 / 版权
      "project"  → renderProject()      // 7 天项目
      其它(默认) → renderSummary() + ensureProgressTools()  // 总结页 + 进度备份面板
```

- `switchPage(p)`（`js/03`）：`page=p; activeLevel=null; render()`。
- `openLevel(id)`（`js/07`）：校验解锁 → 设 `activeLevel`、`page="lesson"`、恢复草稿/答题状态 → `render()`。
- `render()` 会整体替换 `#view` 的 `innerHTML`，所以**不要**给渲染出来的元素绑定一次性事件；统一用 `js/09` 的事件委托（`data-action` / `data-page` / `data-level` / `data-pick` / `data-option`）。

### 5.2 页面壳与关键 DOM

`index.html` 里的静态节点（JS 只用不建）：

| 节点 | 作用 |
| --- | --- |
| `#splash-screen` / `#splash-skip` | 开屏动画与跳过按钮 |
| `.sidebar` / `.nav-btn[data-page]` | 左侧导航（学习课程 / 继续挑战 / 我的总结 / 7 天项目 / 关于许可） |
| `.topbar` / `#topTitle` / `#themeButton` / `#xpTop` | 顶栏：标题、切换天空外观、学习点 |
| `main#view` | 所有页面内容的容器（渲染目标） |
| `#toast` | 全局轻提示 |
| `#resetModal` / `#resetModalContent` | 通用弹窗（重置密码 / 查看答案） |
| `#htFpsMonitor` + `#htFpsVal/Ms/Canvas` | 实时帧率监视器（双 UI 期间常驻） |
| `#uiChooserModal` / `[data-choose-ui]` | 进站双 UI 选择门户 |
| `#cosmos-stage` / `#stardust-canvas` / `#stardust-fg-canvas` | 星空背景/前景双层画布 |
| `#orbit-cards-layer` | 3D 星轨卡片层（JS 动态生成卡片） |
| `#cosmosHud` + 章节按钮 / `#cosmosXpBadge` / 粒子滑杆 | 星空 UI 的 HUD 与控件 |
| `#cosmosInspectModal` / `#cosmosInspectCard` | 历史遗留 DOM，当前 JS 未引用（可忽略） |

JS 动态生成、不在 HTML 里的节点：`#apFab`、`#apSheet`（`js/11`）、`#topUiSwitchBtn`、`#workspaceBackCosmosBtn`（`js/13`）、`.victory-overlay`（`js/08`）、星轨卡 `.orbit-card`（`js/13`）。

### 5.3 C 关卡页渲染管线（`renderCodeLesson`）

1. 取 `l.example.code`（缺省用旧字段 `l.sample`）、`l.example.output`、`l.example.explain`。
2. 知识快问：有 `l.questions` 时走 `ensureTaskState()` + `questionBlock()`（复用 `js/06` 的任务状态机）；否则走旧式单题 `l.quiz/options/answer`（当前数据无此形态）。
3. 示例代码块（`highlightC` 语法着色）＋运行结果＋逐段解释。
4. 常见陷阱 `pitfalls[]`、掌握标准 `mastery[]`、核心要点 `takeaways[]`。
5. 代码挑战：`editorMarkup()`（行号 + 高亮 + textarea + 状态栏）→ 草稿存 `data.drafts[id]`。
6. 运行结果比对（有 `expectedOutput` 的关卡）：`textarea#runOutput` → `checkRunOutput()` → 结果存 `data.runOutputs[id]`。
7. 通关条件（侧栏展示）：知识快问达标 + 代码结构检查通过 + （若有）运行结果与预期一致。

### 5.4 英语关卡页渲染管线（`renderEnglishLesson`，`js/06`）

按 `l.type` 组合以下区块：

| type | 材料区 | 任务区 | 通关条件 |
| --- | --- | --- | --- |
| `listen` | `audio[]` 音频播放器（可显示原文） | 选择题 `questions[]` | 答对率 ≥ `passRatio` |
| `read` | `passage` 阅读材料（可带音频） | 选择题 | 答对率 ≥ `passRatio` |
| `quiz` | 无 | 选择题 | 答对率 ≥ `passRatio` |
| `write` | 可选音频/材料 | `prompt` 写作 + 字数统计 | 要点齐全 + 字数达标 + 客观题达标 |
| `translate` | 可选 `source` 中文段落 | `prompt` 翻译 + 字数统计 | 同上 |
| `speak` | `model` 示范音频 | 录音/跟读自评 + `checklist[]` + 客观题 | 录音(或跳过) + 清单全勾 + 客观题达标 |
| `mock` | 听力 + 阅读混合材料 | 25 题 + 倒计时 + 交卷判分 | 答对率 ≥ `passRatio`（模考 0.6） |

- 音频地址由 `audioRow()` 拼成 `./assets/audio/cet4/<file>`；多角色对话的原文由 `transcript` 字段提供。
- 录音用 `MediaRecorder`，只存在内存（Blob URL），刷新即丢；不支持麦克风时可点"用跟读自评代替"。
- 限时关卡：`startTaskTimer()` 每秒刷新，倒计时结束模考自动交卷，其它类型提示"时间到"。

## 6. 关卡引擎细节

### 6.1 C 语言检查器（`js/08-c-checker.js`）

`validateChallenge(level, source)` 的判定流水线：

```text
source 文本
  → tokenizeChallengeC()   词法：注释/字符串/字符/数字/标识符/运算符 → token 数组（注释与字符串内容被跳过）
  → 括号配对检查            ( ) { } [ ] 必须按顺序成对
  → parseProgram()         轻量 C 语法解析：顶层声明/函数定义、语句、if/for/while/do/switch、return…
  → runCheckSpec(ts,source,level.check)  按关卡 check 规格核对具体写法
  → { ok, message }
```

`runCheckSpec` 支持的 `check` 规格（正则类检查（include/noInclude/forbid/require 等）会先用 `cMask` 遮蔽注释与字符串；`seq`/`calls`/`callCounts` 走词法 token，注释会被丢弃）：

| 字段 | 类型 | 含义 |
| --- | --- | --- |
| `include` | string / string[] | 必须 `#include <…>` 这些头文件 |
| `noInclude` | string[] | 禁止包含这些头文件 |
| `main` | false | 允许没有 `int main(void)`（默认必须有完整 main） |
| `return0` | true | main 内必须有 `return 0;` |
| `seq` | string[][] | main 内必须出现这些 token 序列 |
| `seqAny` | string[][][] | 至少命中其中一种序列 |
| `calls` | (string \| [string, needle])[] | 必须调用这些函数；带 needle 时首个实参需包含该子串 |
| `callsAnywhere` | true | `calls` 改为全代码范围（默认只在 main 内） |
| `callCounts` | [name, min?, max?][] | 函数调用次数上下限 |
| `forbid` | string[] | 禁止出现的标识符/关键字 |
| `require` | object | 见下 |
| `minStatements` | number | 源码至少几句（按分号数粗略计） |
| `message` / `ok` | string | 自定义失败/成功提示 |

`require` 支持的键：`if`、`switch`、`for`、`while`、`doWhile`、`loop`、`array`、`pointer`、`malloc`、`free`、`struct`、`enum`、`union`、`typedef`、`file`、`recursion`（`true` 或函数名数组）、`funcs`（必须自己定义这些函数）。

运行结果比对：`checkRunOutput()` → `compareOutput(expected, got)`：

- 统一换行、逐行去首尾空白、合并行内多空白、去掉首尾空行；行尾空格差异忽略。
- 完全一致 → 通过；否则给出第一处不一致的行号与两边的值。

通关判定（`maybeComplete()`）：

```text
cQuizOk(level) && codePassed && cOutputOk(level)
  cQuizOk   : questions 全部作答且答对率 ≥ passRatio（0.8，即 3 题需全对、2 题需全对）
  codePassed: 最近一次"检查代码"的结构检查结果
  cOutputOk : 没有 expectedOutput → 直接 true；有 → 粘贴输出与预期一致
→ data.completed[id]={at}; data.xp+=30; save(); 胜利动画; 全部通关 → 1s 后跳总结页
```

> 历史遗留（重构前就存在，不是重构引入）：`js/06` 的 `pickAnswer()` 在客观题全部答对且答对率达标时会直接调用 `completeTask()`（C 关卡也会走这条路径），因此理论上 C 关卡可以只靠答对快问就标记通关。排查通关逻辑时留意这条旁路。

### 6.2 英语任务引擎（`js/06-cet4-engine.js`）

- `ensureTaskState(level)`：为当前关卡建立内存任务状态（答题、得分、自评、录音、交卷标记）；切关卡时重建。
- `pickAnswer(qi,pi)`：非模考立即判对错并锁定选项；模考可改答案，交卷时统一判分。
- `submitMock(auto)`：统计答对率 → 写入 `data.attempts/correct` → 达标则 `completeTask()`。
- `gradeText(level,text)`：词数统计 + `points` 要点组匹配（组内任一关键词命中即算命中，大小写不敏感、子串匹配）。
- `checkWrittenTask()`：写作/翻译"检查并提交"；需要要点齐全 + 字数达标 + 客观题达标。
- `toggleSelfCheck(key)` / `startRecorder()` / `stopRecorder()`：口语关的自评、录音、跳过录音。
- `completeTask(level)`：统一发奖（`completed` + 30 点 + 胜利动画 + 全部通关跳总结）。
- `retryTask()`：重置本关作答（模考重做、错题重刷），不动已通关状态。

## 7. 进度备份、存档码与导入导出（`js/04`）

三种迁移方式，数据来源相同（`PROGRESS_KEYS` 里的 5 个 localStorage 键的原始字符串）：

1. **导出/导入 JSON 文件**：`exportProgress()` 生成 `{app:"HT Lab",kind:"progress",version:1,exportedAt,data:{key:raw}}` 并下载；`importProgressFile()` 校验 `app` 与 `data` 后逐键写回并刷新。
2. **存档码**：`buildSaveCode()` → 前缀 `HT1` + `G<base64url(gzip(json))>`（浏览器支持 `CompressionStream` 时），否则 `B<base64url(json)>`。
3. **存档链接**：`<当前页面 URL>#save=<encodeURIComponent(存档码)>`；页面加载时由 `js/04` 的 `load` 监听器检测 `#save=`，确认后导入并刷新。

存档码/链接只包含学习进度数据，不含个人信息；导入后自动刷新页面。

## 8. 外观系统（`js/11-appearance.js` + CSS 变量）

- 数据：`cquest.appearance.v1`，默认 `{sky:"noon", blur:24, tint:54, radius:22, noise:3.0, edge:72}`。
- 天空预设：`dawn / noon / dusk / night` → `<html data-sky="…">`；天空同时决定深浅色基调（CSS 里大量 `html[data-sky="night"]` 规则）。
- `apApply()` 把参数写成 CSS 变量（`--glass-blur`、`--glass-alpha`、`--glass-alpha-n`、`--r-xl/--r-l/--r-m`、`--noise`、`--edge`），卡片、面板、代码块在 `css/04` 里消费这些变量。
- UI：`apBuild()` 在页面右下角动态生成"外观"按钮 `#apFab` 与面板 `#apSheet`（不是 index.html 里的静态 DOM）；面板按钮/滑杆用事件委托，改完立即生效并持久化。
- 顶栏 `#themeButton`（`data-action="cycle-theme"`）实际调用 `apCycleSky()` 循环切换天空预设；旧主题键 `codesword.theme.v1` 仍会读写，但当前渲染固定浅色基调、由天空预设控制观感。

## 9. 开屏动画（`js/10-splash.js`）

- `body.splash-active` 起始；IIFE 在 1.4s（reduced-motion 时 0.12s）后 `revealInterface()`。
- 可点"跳过动画"（1.1s 后出现）或按 Esc 提前进入。
- 揭示时给首屏目标元素加 `drop-in` / `slide-across` 与随机延迟，`4.8s` 后移除内联样式；reduced-motion 时不播放。
- `#splash-screen` 元素在动画结束后被 `remove()`。

## 10. 指针倾斜（`js/12-pointer-tilt.js`）

- 仅在鼠标（`pointerType === "mouse"`）且未开启 reduced-motion 时生效。
- 选择器：`.level-card, .course-card, .stat, .course-entry, .side-card, .guide-card, .skill-row, .summary-hero`。
- 用 rAF 写入 CSS 变量 `--rx` / `--ry` / `--gx` / `--gy`，CSS（`05-motion`）负责 transform/光泽；离开、滚动出屏、`pointercancel`、窗口 blur 时归零。

## 11. 双 UI 引擎（`js/13-dual-ui.js`，尾大不掉但功能完整）

> **当前状态（2026-11）**：站点已改为**单一新 UI**（`css/10-ui.css`）。星空宇宙、双 UI 选择门户、FPS 监视器、旧「外观」面板全部由 `10-ui.css` 永久隐藏；`13-dual-ui.js` 仍加载（它包装 `render/save`，保持逻辑兼容），但不再显示任何星空界面。如要恢复星空 UI，需先明确需求再改 `10-ui.css` 第 19 节的隐藏规则。

### 11.1 结构（IIFE 内的 8 个小节）

| 小节 | 内容 |
| --- | --- |
| 0 FPS Monitor | 独立 rAF 采样：350ms 更新 FPS/ms/24 柱波形；点击折叠；<50 warn、<30 low 配色 |
| 1 兜底题库 | 若 content 脚本没加载（如单独拷走 index.html），注入 4 个 C 关 + 3 个四级关的迷你题库（正常部署不会触发） |
| 2 顶栏注入 | 向 `.topbar .top-right` 注入 `#workspaceBackCosmosBtn`（返回星球）与 `#topUiSwitchBtn`（切换双 UI） |
| 3 双 UI 状态同步 | `UI_MODE_KEY="htlab.uimode.v1"`；包装 `window.render` / `window.save`；`setUiMode()`、`syncSharedDataToBothUIs()`、`forceOpenLevelInWorkspace()` 等 |
| 4 粒子引擎 | 星空画布、26000 粒子池、星云/银河/流星/烟花、3D 投影、四种场景形态（双星/星环/星尘塔/文字） |
| 5 3D 星轨卡 | 动态生成可点击卡片：双星门户卡（选课程）或关卡卡（最多 8 张），带 3D 排布与手机端 dock 模式 |
| 6 主渲染循环 | `tickCosmos()`：银河 → 星云 → 背景星 → 流星 → 行星核心 → 粒子/星轨卡布局（仅 `uiMode==="cosmos"` 时绘制） |
| 7 事件绑定 | 指针移动/拖拽旋转/滚轮缩放、章节按钮、HUD 按钮、磁力/星云主题、粒子数与引力滑杆 |
| 8 启动初始化 | resize → 粒子池 → 双星形态 → 星轨卡 → `setUiMode(currentUiMode,false)` → 启动循环 → 1.55s 后弹 UI 门户 |

### 11.2 两套 UI 如何共享状态

**结论：它们是同一个应用的两层皮，共用同一份 DOM 与全局状态。**

- 全局状态只有一份：`activeCourse / data / stores / levels / groups / page / activeLevel` 等都在 `js/01–12` 的全局作用域里；两套 UI 不各自保存进度。
- DOM 也共用：玻璃 UI 用 `.app` 里的普通页面；星空 UI 复用同一个 `.app` 渲染"工作台"（workspace），只是用 CSS（`06-fps`）切换显示：`body[data-ui-mode="cosmos"] .app` 只在工作台视图出现，宇宙视图显示 `#cosmos-stage` 与 `#cosmosHud`。
- 桥接方式：`js/13` 在加载时保存 `origRender = window.render` / `origSave = window.save`，再用包装函数替换：
  - 包装后的 `render()`：先跑原渲染，再 `syncSharedDataToBothUIs()`（重读 `data`，刷新 `#xpTop`、`#cosmosXpBadge`，重建星轨卡与 HUD 文案），最后 `updateWorkspaceBackBtn()`。
  - 包装后的 `save()`：先落盘，再同步两套 UI 的显示。
- 模式切换：`setUiMode("glass"|"cosmos")`（**内部函数，不在 window 上**，通过顶栏按钮、门户卡片、HUD 按钮触发）→ 写 `body.dataset.uiMode` 与 localStorage，切到 cosmos 时还需 `body.dataset.cosmosView = "universe"|"workspace"`。
- 从星空卡进关卡：`forceOpenLevelInWorkspace(lv)` 设置 `activeLevel` 与 `page="lesson"`，再调用原 `render()`，因此 C 关卡页/英语关卡页的代码路径两套 UI 完全一致。

### 11.3 星空场景与交互

- 场景（章节）`sceneMode`：`binary`（双星门户：C / 四级两颗星球）、`orbit`（星系环：当前课程关卡）、`tower`（星尘塔）、`countdown`（5 秒倒计时文字）、`calligraphy`（"新的一阶"文字烟花）。
- 星云主题：4 套（极光深空 / 紫微星冕 / 翡翠星河 / 超新星烈焰），HUD 按钮循环切换。
- 粒子：桌面 18000（手机 10000），其中约 24% 是跟随鼠标的"星尘群"；滑杆可调 8000–26000。磁力模式：强磁聚拢 / 星璇环绕 / 斥力拨云。
- 交互：拖背景旋转视角、滚轮缩放、点击星球卡进课程/关卡、星轨卡单击直接进实训课；手机竖屏下卡片进入底部 dock 模式。
- 进站门户：每次加载 1.55s 后弹出 `#uiChooserModal`（不记住"已选择"标记，用于每轮选择）；点卡片后持久化模式并关闭。

## 12. 全局符号表（修改前先查这里）

### 12.1 数据与注册（`01`）

| 符号 | 类型 | 说明 |
| --- | --- | --- |
| `COURSES` | const[] | 课程元数据（id/name/glyph/sub/store/heroTitle/heroCopy/routeNote/mapNote/footNote） |
| `courseLevels` / `courseGroups` | const{} | `{c:[...],cet4:[...]}` 关卡与模块名 |
| `activeCourse` / `levels` / `groups` | let | 当前课程 id、关卡数组、模块数组 |
| `courseById()` / `currentCourse()` / `hasCourse()` | fn | 课程查询 |
| `courseKey` / `resetPasswordKey` / `themeKey` | const | 存储键字符串 |

### 12.2 状态与工具（`02`）

| 符号 | 说明 |
| --- | --- |
| `stores` / `data` / `save()` | 两门课状态、当前状态、落盘 |
| `setCourse(id)` | 切换课程（改 `activeCourse/levels/groups/data` 并重绘） |
| `page` / `activeLevel` / `selectedOption` / `quizPassed` / `codePassed` / `hintVisible` / `solutionVisible` / `answerUnlocked` | 界面状态（全局 let） |
| `loadStateFor(key)` | 读 localStorage 并补默认字段（含 `drafts/quizRewards`） |
| `applyTheme(mode,persist)` / `themeMode` | 主题/颜色基调（当前固定浅色，天空预设控制观感） |
| `esc()` / `highlightC()` / `editorMarkup()` / `updateEditor()` / `saveEditorValue()` / `replaceEditorRange()` | 转义、C 高亮、编辑器渲染/更新/草稿保存 |
| `openResetDialog()` / `openAnswerDialog()` / `answerVerified()` / `closeResetDialog()` / `resetProgress()` / `hashResetPassword()` | 重置密码与"查看标准答案"共用密码流程 |
| `completedCount()` / `unlocked()` / `isDone()` / `progressPct()` / `nextLevel()` | 进度统计 |
| `toast()` / `copyText()` | 轻提示、复制到剪贴板 |

### 12.3 渲染与讲义（`03/05/07`）

| 符号 | 说明 |
| --- | --- |
| `fmtLesson()` / `fmtInline()` | 讲义富文本（`**粗**`、`==高亮==`、`!!警告!!`、`「术语」`、自动代码标记） |
| `renderBeginnerGuide()` | 零基础拆解（读取 `level.beginner`；当前数据未使用该字段，渲染为空） |
| `switchPage(p)` / `navTitle()` | 切页 / 顶栏标题 |
| `render()` | 唯一重绘入口（`13` 会包装它） |
| `renderCourses/Map/About/Practice/Lesson/CodeLesson()` | 各页面渲染 |
| `ensureNextBar()` | 通关后页底"下一关"条 |
| `openLevel(id)` / `awardForQuiz()` | 进入关卡 / 旧式单题奖励 |
| `PROJECT_KEY` / `PROJECT_DAYS` / `loadProject() / `saveProject() / `projectProgress() / `renderProject()` | 7 天项目 |
| `renderSummary()` | 总结页 |

### 12.4 英语引擎（`06`）

| 符号 | 说明 |
| --- | --- |
| `ensureTaskState(l)` / `completeTask(l)` / `retryTask()` | 任务状态、统一通关发奖、重做 |
| `questionBlock()` / `audioRow()` / `renderEnglishLesson()` | 题目/音频/整页渲染 |
| `pickAnswer()` / `submitMock()` / `checkWrittenTask()` | 选择题、交卷、写作/翻译提交 |
| `gradeText()` / `keyHit()` / `questionsRatioOk()` | 要点判分、关键词命中、客观题达标 |
| `toggleSelfCheck()` / `startRecorder()` / `stopRecorder()` | 口语自评与录音 |
| `startTaskTimer()` / `stopTaskTimer()` | 限时任务倒计时 |

### 12.5 C 检查器（`08`）

| 符号 | 说明 |
| --- | --- |
| `tokenizeChallengeC()` / `cMask()` | 词法分析 / 注释字符串遮蔽 |
| `parseProgram()` 及其 helper | 轻量 C 语法解析（顶层、声明、语句、表达式、控制流） |
| `runCheckSpec()` / `challengeResult()` / `validateChallenge()` | 按 `level.check` 规格检查 |
| `checkCode()` | "检查代码"按钮入口：保存草稿 → `validateChallenge` → 记录 `codePassed`/`codeFeedback` → `maybeComplete()` |
| `compareOutput()` / `normOut()` / `checkRunOutput()` | 运行输出比对 |
| `cQuizOk()` / `cOutputOk()` / `cReady()` / `maybeComplete()` | 通关判定 |
| `playVictoryAnimation()` | 通关撒花动画 |

### 12.6 事件、外观、双 UI

| 符号 | 说明 |
| --- | --- |
| `handleClick(e)` + document 级监听（`09`） | `data-page` / `data-level` / `data-action` / `data-pick` / `data-option` 总入口 |
| `AP_KEY` / `AP_DEF` / `AP_SKY` / `apLoad/apSave/apApply/apPatch/apReset/apCycleSky/apToggleSheet/apRefresh/apBuild`（`11`） | 外观系统 |
| `window.__ap` | 当前外观参数（`apApply` 写入） |
| `UI_MODE_KEY` / `currentUiMode` / `setUiMode()`（`13` 内部） | 双 UI 模式 |
| `syncSharedDataToBothUIs()` / `forceOpenLevelInWorkspace()` / `openCosmosWorkspace()` / `enterCosmosUniverseView()` | 双 UI 桥接 |
| `buildCosmosOrbitCards()` / `setCosmosChapter()` / `warpIntoCoursePlanet()` / `tickCosmos()` | 星空渲染与场景切换 |
| `window.render` / `window.save` | 被 `13` 包装后的版本（原函数在 `13` 内部以 `origRender/origSave` 保存） |
| `window.codeDraft / codeFeedback / quizAnswered / taskState` | 跨函数传递的临时界面状态（不是持久数据） |

## 13. 数据流

### 13.1 读取（内容 → 页面）

```text
content/*.js  push → window.C_MODULES / window.CET4_MODULES
        │
js/01 展开：courseLevels{c,cet4}、courseGroups、COURSES
        │
js/02 stores = {c: state, cet4: state} ← localStorage[cquest.master.v1 / cquest.cet4.v1]
        │ data = stores[activeCourse]
js/05 render() → #view.innerHTML = ...（纯字符串模板，esc() 转义）
        │
用户点击（09 事件委托）→ 改 page/activeLevel/data → render()
```

### 13.2 写入（用户操作 → 本地存储）

```text
答题 / 写代码 / 写作文 / 勾自评 / 通关
   → 改 data（completed/xp/attempts/correct/drafts/runOutputs）
   → save()  →  localStorage[当前课程 store key]
       └─ js/13 的包装 save() 额外刷新 #xpTop、#cosmosXpBadge、星环卡
```

### 13.3 迁移（备份 → 新设备）

```text
导出 JSON / 生成存档码 / 生成存档链接
   ← 读 PROGRESS_KEYS 的 5 个 localStorage 原始字符串
   → 下载文件 / HT1 编码 / #save= 链接
新设备 → 导入文件 / 粘贴存档码 / 打开链接并确认
   → 逐键写回 localStorage → location.reload()
```

### 13.4 双 UI 同步

```text
玻璃 UI 或星空 UI 中的任何操作
   → 同一套全局 data/stores/activeCourse/levels
   → 同一套 render()/save()（只是外层包了同步逻辑）
   → 两套 UI 的可见状态始终一致；切换模式不改变学习进度
```

## 14. 约束、坑与已知遗留

### 14.1 必须遵守的约束

1. **CSS 顺序**：01→07 的顺序就是层叠顺序；07 必须最后；`06` 承载双 UI 样式。不要按"文件大小/主题"随意重排。
2. **JS 顺序**：编号即依赖顺序；`13` 必须最后；`09` 末尾的首次 `render()` 不能挪走；content 数据必须早于 `js/`。
3. **一个全局作用域**：不要用 `import/export`、`type="module"`、动态 `import()`。顶层 `const/let` 重名会直接抛 SyntaxError，整页白屏。新增顶层符号前先全局搜重名。
4. **函数重复定义是允许的**（经典脚本里后定义的覆盖前面的），但这常是 bug 温床：新增顶层函数前全仓搜重名，避免意外覆盖。
5. **路径**：全部相对路径（`./css/...`、`./assets/...`），大小写敏感（GitHub Pages 是 Linux）。改文件名必须同步改 `index.html` / JS / CSS 中的引用。
6. **file:// 必须可用**：不要 fetch 本地 JSON、不要用 `type="module"`（`file://` 下模块会因 CORS 失败）、不要依赖 Service Worker。音频用 `<audio src>`，录音用 `getUserMedia`（不可用时页面提供跟读自评）。
7. **数据位置**：进度只写 localStorage，且键名固定；不要新增后端、不要发请求、不要用 cookie/IndexedDB 存学习进度。
8. **内容与 UI**：不要在重构/样式任务中顺手改可见文案、课程数据、版权声明；改内容请走 docs/CONTENT-GUIDE.md 的流程。
9. **`render()` 会重建 `#view`**：页面内交互一律走全局事件委托；不要给渲染出的节点绑持久监听（会随 innerHTML 丢失）。
10. **验证后再提交**：`tools/verify-site.mjs` + 手动双击，确保零 console 报错、零失败请求。

### 14.2 容易踩的坑 / 历史遗留

- **`js/13` 有内置兜底题库**（4 个 C 关 + 3 个四级关）。正常部署下 content 脚本总在，不会触发；若修改 `cLevels/cet4Levels` 的初始化逻辑，注意别让兜底数据覆盖真实题库。
- **C 关卡可跳过代码检查直接通关**：见 `6.1` 末尾的历史遗留说明（`pickAnswer → completeTask`）。
- **当前 content 数据没用到 `beginner` 字段**：`renderBeginnerGuide()` 有实现，但 86 关都没有 `level.beginner`，渲染结果为空。
- **`level.input` / `level.example.input` 不在页面显示**：它们是作者记录的真实运行输入（用于复现示例），只有 `example.code/output/explain`、`expectedOutput` 会渲染。18 个 C 关没有 `expectedOutput`（只做结构检查，不比对输出）。
- **旧式单题字段 `level.quiz/options/answer/explain` 已无数据使用**：只在 `renderCodeLesson` 里保留兼容分支；`awardForQuiz()` 的 +10 点逻辑同样属遗留。
- **导出/存档码不含 `7 天项目`、`双 UI 模式`、旧主题键**：见 `4.2` 表格。
- **顶栏"切换外观"按钮实际是切天空预设**（`apCycleSky`），不是 old `applyTheme` 的深浅色切换；`codesword.theme.v1` 仅兼容保留。
- **UI 门户每次加载都会出现**：1.55s 后弹出，选一次后写入 `htlab.uimode.v1`，但没有"已选过就跳过"的判断。
- **`#cosmosInspectModal` / `#cosmosInspectCard` 是死 DOM**：HTML 里有、JS 中无引用（旧版 3D 卡片检视残留）。
- **`06-fps.css` 里也有手机端玻璃 UI 修复**，手机问题别只看 `07`，先确认规则落在哪个文件。
- **音频作者元数据（manifest/dialogue JSON）不在运行时加载**：改内容文案不会自动改元数据，两者要一起维护（见 CONTENT-GUIDE）。
- **`js/02 save()` 没有 try/catch**：浏览器禁用 localStorage（极端隐私模式/配额满）时会抛错；读取侧 `loadStateFor` 有兜底。
- **`index.html` 里的静态节点很多是给 `13` 用的**：删除/改名 `#uiChooserModal`、`#cosmos-stage`、`#htFpsMonitor` 等会让双 UI 初始化直接报错。

## 15. 相关文档

- 根目录 `AGENTS.md`：AI 编码代理的第一入口（硬规则、常见任务、验证、部署）。
- `docs/CONTENT-GUIDE.md`：C / 四级关卡数据 schema、加关卡/模块/音频、数量同步清单。
- `README.md`：面向使用者的课程表、本地使用与许可摘要。
- `tools/verify-site.mjs`：本地验证脚本（已冻结），`--help` 查看参数；20 个状态 / 25 个交互的矩阵覆盖玻璃与星空两种 UI、两门课、关卡页、外观/重置弹窗、手机视口与 `file://`；报告写到 `--out` 下（`report.md` + `report.json` + `screenshots/`）。`--compare <label>` 需要先有 `<out>/<label>/report.json`，比对文本/DOM/布局（±2px）/计算样式/计数，请求数量与资源路径不参与、截图不参与像素比对；基线已知问题不会让对比失败。
