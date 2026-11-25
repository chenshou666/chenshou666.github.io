# 学习工具 / 尘狩作品集 · 架构说明

> 本文件是站点当前版本的完整架构地图（全部与仓库真实代码保持同步）。
> 第一次接触代码，请先读根目录 `AGENTS.md`；写课程数据请看 [CONTENT-GUIDE.md](CONTENT-GUIDE.md)；如需查阅或退回整理前的历史版本，见 [ROLLBACK.md](ROLLBACK.md)（`v1.0-legacy`）。

## 1. 项目概览

这是一个「尘狩」的**纯静态个人作品集网站**，以 iOS 液态玻璃（Liquid Glass）为唯一视觉体系，包含：
- 外层作品集：首页（作品展示）、作品详情页、关于作者页；
- 核心内置作品 **学习工具**：C 语言（86 关 / 11 模块）与英语四级（62 关 / 7 模块）闯关式交互学习站；
- 独立作品目录 `works/`：**代码影院**（4 部实时代码生成短片 + 统一播放器）与 **游戏**（火柴人训练营横屏格斗小游戏）。

架构上的“物理定律”：
- **没有构建步骤**：仓库里的文件就是线上文件，浏览器直接加载，改完刷新即可。
- **没有依赖**：主站不引入 npm 包、框架、预处理器、打包器或 CDN 外链；全部为 vanilla HTML/CSS/JS。
- **没有后端**：不发起业务网络请求，不收集、不上传数据；学习进度、草稿、外观与开屏偏好只存访问者本机浏览器。
- **GitHub Pages 托管**：仓库 `chenshou666/chenshou666.github.io` 的 `main` 分支根目录即发布根目录，`.nojekyll` 已就位。
- **必须支持 `file://` 双击打开**：全部资源使用相对路径；不使用 `type="module"`、`import()`、`fetch` 本地 JSON 或 Service Worker。
- **经典 `<script>` 共享全局作用域**：`js/` 下 12 个脚本与 `content/` 下 18 个数据脚本共享同一个全局作用域，靠加载顺序表达依赖。
- **CSS 靠层叠顺序**：`css/` 下 3 个文件严格按 `08 → 09 → 10` 加载，`10-ui.css` 必须最后。

## 2. 目录树与职责

```text
chenshou666.github.io/              仓库根目录（= GitHub Pages 发布根目录）
├─ index.html                       唯一主站页面：资源引用顺序 + 静态页面壳
├─ .nojekyll                        关闭 GitHub Pages 的 Jekyll 处理（保留）
├─ LICENSE                          版权与使用许可（不要改）
├─ README.md                        面向访客/使用者的作品总览、课程表、本地运行与许可
├─ AGENTS.md                        面向 AI 编码代理的硬规则与维护速查
├─ .gitignore                       忽略 .verify/ 与系统垃圾文件
├─ docs/
│  ├─ ARCHITECTURE.md               本文件：架构、加载顺序、子系统、全局符号、约束
│  ├─ CONTENT-GUIDE.md              内容作者指南：C / 四级关卡 schema、加关卡与音频
│  ├─ AI-HANDOFF.md                 把项目交给其他 AI 时的交接提示词与验收清单
│  └─ ROLLBACK.md                   版本基线（v1.0-legacy / backup/legacy-v1）与回退指南
├─ css/                             3 个样式文件，按顺序加载
│  ├─ 08-liquid-glass.css           液态玻璃材质层：深空极光画布、.liquid-glass、色散描边、涟漪
│  ├─ 09-splash.css                 独立开屏动画层：极光棱镜新版 / 经典简洁旧版 / 移动端与无障碍
│  └─ 10-ui.css                     唯一界面层（必须最后）：胶囊顶栏 / 底部 Dock / 作品集 / 学习站 / 外观面板
├─ js/                              12 个应用脚本，按编号顺序加载（共享全局作用域）
│  ├─ 01-course-registry.js         课程注册表：汇总 content 数据 → courseLevels / COURSES / 进度存储键
│  ├─ 02-app-core.js                应用核心：stores/data 状态、localStorage 兜底读写、编辑器、密码弹窗、统计
│  ├─ 03-lesson-format.js           讲义富文本排版（fmtLesson/fmtInline）、switchPage、navTitle
│  ├─ 04-progress-backup.js         JSON 导出/导入、HT1 存档码与 #save= 分享链接
│  ├─ 05-views.js                   PORTFOLIO_DATA + render() 路由 + 作品集/课程/路线/关于/C 关卡页
│  ├─ 06-cet4-engine.js             英语四级任务引擎：听力/阅读/写作/翻译/口语/模考、录音、判分
│  ├─ 07-project-and-summary.js     7 天项目支线、我的总结页、openLevel()、答题奖励
│  ├─ 08-c-checker.js               C 语言检查器：词法/语法分析、结构检查、运行输出比对、通关与胜利动画
│  ├─ 09-events.js                  全局事件委托（data-action/page/level/pick/option）、编辑器快捷键、首次 render()
│  ├─ 10-splash.js                  开屏动画引擎（Canvas 2D 极光粒子 + 模式切换 + window.HTSplash.replay）
│  ├─ 14-liquid-glass.js            液态玻璃视觉引擎（极光背景、光标高光、涟漪、「⚙ 外观」调节面板）
│  └─ 15-ui-motion.js               页面切页动画、错峰入场、Dock 弹跳与滚动自动收起
├─ content/                         课程数据（经典脚本，先于 js/ 加载；只放数据）
│  ├─ c/                            C 语言 11 个模块（c0–c10，id 1–86，共 86 关）
│  └─ cet4/                         英语四级 7 个模块（m0,m1,m3,m4,m5,m2,m6，共 62 关）
├─ works/                           独立作品目录
│  ├─ player.html                   「代码影院」统一播放器（返回作品集 + 4 部切换 + 影院横屏模式）
│  ├─ ink-mist-3d.html              墨韵山河 · INK & MIST
│  ├─ pure-code-cinema.html         PURE CODE CINEMA
│  ├─ isomorphism.html              万物同构 · ISOMORPHISM
│  ├─ zero-pixels.html              纯代码视界 · ZERO PIXELS
│  └─ stickman-training/            作品「游戏」第一部：火柴人训练营（HTML + CSS + 4 个经典 JS）
└─ assets/
   ├─ favicon.svg                   站点图标（SVG）
   ├─ ht-lab.ico                    站点图标（ICO）
   └─ audio/cet4/                   四级音频：46 个 mp3 + 10 个作者维护元数据 JSON（运行时不加载 JSON）
```

## 3. 加载顺序与页面生命周期

### 3.1 `index.html` 加载顺序（顺序即依赖）

```text
<html data-sky="noon" lang="zh-CN" data-skin="liquid-glass">
  <head>
    css/08-liquid-glass.css → css/09-splash.css → css/10-ui.css
  <body class="splash-active" data-zone="portfolio">
    静态页面壳：
      #splash-screen（开屏舞台 + 画布 + SVG 星环 + HT 徽章 + 跳过按钮）
      .app（.sidebar 底部 Dock + .main > .topbar 胶囊顶栏 + main#view）
      #toast / #resetModal
    经典 <script>：
      content/c/c0..c10.js ×11            → window.C_MODULES
      content/cet4/m0,m1,m3,m4,m5,m2,m6 ×7 → window.CET4_MODULES
      js/01-course-registry.js … js/09-events.js（末尾首次 render()）
      js/10-splash.js                     ← 立即启动或关闭开屏动画，暴露 window.HTSplash
      js/14-liquid-glass.js               ← 注入极光背景画布、打 .liquid-glass 标记、挂载「⚙ 外观」面板
      js/15-ui-motion.js                  ← 包装 window.render 实现切页动画，绑定 Dock 自动收起
```

### 3.2 CSS 三层分工

| 顺序 | 文件 | 职责 |
| --- | --- | --- |
| 1 | `css/08-liquid-glass.css` | 液态玻璃基础材质、`:root` 材质令牌、`#fluid-bg-canvas`、`.optical-grain`、`.liquid-glass`、`.glass-ripple` |
| 2 | `css/09-splash.css` | 独立开屏动画层（`cinema` 极光棱镜新版 / `classic` 经典简洁旧版 / 移动端与 `prefers-reduced-motion`） |
| 3 | `css/10-ui.css` | 唯一界面层（必须最后）：胶囊顶栏、底部 Dock、作品集、学习站全页面、外观面板、响应式收口 |

### 3.3 JS 12 脚本依赖表

> 注：`js/14`、`js/15` 保留历史编号以避免破坏已有文档与习惯，实际顺序为 11/12 与 12/12。

| 顺序 | 文件 | 依赖 | 主要提供 |
| --- | --- | --- | --- |
| 1/12 | `01-course-registry.js` | `content/*.js` | `COURSES`、`courseLevels`、`courseGroups`、`activeCourse`、`levels`、`groups` |
| 2/12 | `02-app-core.js` | 01 | `stores`、`data`、`lsGet/lsSet/save()`、`setCourse()`、编辑器工具、密码弹窗、进度统计 |
| 3/12 | `03-lesson-format.js` | 02 | `fmtLesson()`、`fmtInline()`、`switchPage()`、`navTitle()` |
| 4/12 | `04-progress-backup.js` | 02 | 导出/导入 JSON、HT1 存档码 `buildSaveCode()` / `applySaveCode()`、`#save=` 链接 |
| 5/12 | `05-views.js` | 01/02/03/06 | `PORTFOLIO_DATA`、`render()` 路由、作品集/详情/作者/课程/路线/关于/继续/C 关卡页 |
| 6/12 | `06-cet4-engine.js` | 02/03/05 | 英语四级任务状态、题组渲染、录音、判分、`renderEnglishLesson()`、`completeTask()` |
| 7/12 | `07-project-and-summary.js` | 02/03/05/06 | `PROJECT_DAYS`、`renderProject()`、`renderSummary()`、`openLevel()` |
| 8/12 | `08-c-checker.js` | 02/05/06 | `validateChallenge()`、`checkCode()`、`checkRunOutput()`、`maybeComplete()`、胜利动画 |
| 9/12 | `09-events.js` | 01–08 | 全局事件委托、代码编辑器键盘交互；末尾首次调用 `render()` |
| 10/12 | `10-splash.js` | 独立 IIFE | 开屏动画控制器、Canvas 粒子引擎、`window.HTSplash` |
| 11/12 | `14-liquid-glass.js` | 10（可选）+ `window.render` | 极光画布、`.liquid-glass` 打标、光标高光、点击涟漪、「⚙ 外观」面板 |
| 12/12 | `15-ui-motion.js` | `window.render` | 切页动画、错峰入场、Dock 弹跳、滚动自动收起 Dock |

## 4. 运行时状态与本地存储

### 4.1 核心状态对象

`js/01` 聚合课程数据，`js/02` 建立运行时状态：
- `COURSES`：课程元数据数组（`c` / `cet4`）
- `courseLevels` / `courseGroups`：按课程 id 索引的关卡数组与模块名数组
- `stores` / `data`：每门课独立状态（`completed`、`xp`、`attempts`、`correct`、`started`、`drafts`、`quizRewards`、`runOutputs`）
- `page` / `activeLevel` / `selectedWorkId`：当前路由、打开的关卡与当前浏览的作品 id

### 4.2 `localStorage` 键名（键名固定，改动会破坏老用户数据）

| 键 | 写入方 | 内容 | 参与导出/存档码 |
| --- | --- | --- | --- |
| `cquest.master.v1` | `js/02 save()` | C 课程进度状态 JSON | ✅ |
| `cquest.cet4.v1` | `js/02 save()` | 四级课程进度状态 JSON | ✅ |
| `cquest.course.v1` | `js/02 setCourse()` | 当前课程 `"c"` / `"cet4"` | ✅ |
| `cquest.appearance.v1` | `js/14 saveAppearance()` | 外观与开屏设置 `{blur, saturate, opacity, glare, bgSpeed, bgBright, bgAnim, splashMode}` | ✅ |
| `codesword.reset.password.v1` | `js/02` | 重置进度/看答案密码哈希 | ✅ |
| `cquest.project.v1` | `js/07` | 7 天项目完成状态 `{done:{1:true,…}}` | ❌ |
| `codesword.theme.v1` | `js/02` | 旧主题模式（兼容保留） | ❌ |

> 所有读写均经过 `lsGet()` / `lsSet()` 或 `try/catch` 兜底，浏览器禁用 `localStorage`（隐私模式/配额满）时不会抛错中断。

## 5. 渲染路由与页面分区

`render()`（`js/05-views.js`）是唯一页面重绘入口，并被 `js/14` 与 `js/15` 依次包装（打玻璃标 + 切页动画）：

```text
render()
 ├─ syncZoneChrome()：设置 body[data-zone="portfolio"|"lab"] 与 #backPortfolioBtn 显示状态
 ├─ navTitle()：同步 #topTitle 与 #xpTop、.nav-btn.active
 ├─ 若 activeLevel 存在 → renderLesson()（C 或英语四级）→ ensureNextBar()
 └─ 否则按 page 分发：
      "home"     → renderPortfolio()   // 作品集首页（3 个精选作品卡）
      "work"     → renderWorkDetail()  // 作品详情页（按 selectedWorkId）
      "author"   → renderAuthor()      // 关于作者页
      "courses"  → renderCourses()     // 学习工具 · 课程选择页
      "map"      → renderMap()         // 当前课程学习路线与关卡网格
      "practice" → renderPractice()    // 继续挑战下一关
      "about"    → renderAbout()       // 关于 / 免责 / 版权与许可
      "project"  → renderProject()     // 7 天项目支线
      其它(默认) → renderSummary() + ensureProgressTools() // 我的总结 + 进度迁移工具
```

- 导航分区规则（`css/10-ui.css`）：
  - `body[data-zone="portfolio"]`：底部 Dock 只展示「作品集」「关于作者」，隐藏学习站专用按钮与「重头开始」。
  - `body[data-zone="lab"]`：顶栏左侧显示「← 作品集」返回按钮，底部 Dock 展示完整学习站导航。
- `render()` 会重建 `#view.innerHTML`，页面内交互一律走 `js/09-events.js` 的全局事件委托。

## 6. 关卡引擎细节

### 6.1 C 语言检查器（`js/08-c-checker.js`）

`validateChallenge(level, source)` 流程：
`tokenizeChallengeC()`（词法，剥离注释与字符串）→ 括号配对检查 → `parseProgram()`（轻量 C 语法解析）→ `runCheckSpec(ts, source, level.check)` → `{ ok, message }`。

通关判定 `maybeComplete()`：`cQuizOk(level) && codePassed && cOutputOk(level)` → 首次完成时 `data.completed[id] = { at }`、`data.xp += 30`、`save()`、播放胜利动画。

### 6.2 英语四级任务引擎（`js/06-cet4-engine.js`）

支持 7 类关卡：`listen`、`read`、`quiz`、`write`、`translate`、`speak`、`mock`。
- 音频路径统一 `./assets/audio/cet4/<file>`；
- 口语录音使用 `MediaRecorder`（仅存内存 Blob URL），无麦克风时可切换「用跟读自评代替」；
- 限时任务通过 `startTaskTimer()` 倒计时，模考到时自动交卷。

## 7. 进度备份与存档迁移（`js/04-progress-backup.js`）

三种迁移方式共享 `PROGRESS_KEYS`（前 5 个 `localStorage` 键）：
1. **JSON 文件导出/导入**：下载与恢复 `.json` 备份文件；
2. **HT1 存档码**：支持 `CompressionStream` 时采用 `HT1G<base64url(gzip)>`，否则回退 `HT1B<base64url>`；
3. **存档分享链接**：`<URL>#save=<存档码>`，页面 `load` 时自动识别并弹窗确认恢复。

## 8. 液态玻璃引擎与外观面板（`js/14-liquid-glass.js`）

- 注入 `#fluid-bg-canvas`（深空极光 5 光球 Canvas 2D 动画）与 `.optical-grain`；
- 动态给卡片/面板节点添加 `.liquid-glass` 类，并实现桌面端光标高光追踪（移出即淡出）与点击涟漪；
- 顶栏 `#uiTuneBtn`（「⚙ 外观」）打开 `#uiTunePanel` 调节面板，支持实时调整：
  - 玻璃模糊 / 玻璃饱和 / 玻璃透明 / 镜面高光 / 背景速度 / 背景亮度 / 背景动画开关；
  - **开屏动画模式**（`极光棱镜（新版）` / `经典简洁（旧版）` / `关闭开屏`）与 **「▶ 重播开屏」** 按钮；
  - 全部设置持久化至 `cquest.appearance.v1`。

## 9. 开屏动画引擎（`css/09-splash.css` + `js/10-splash.js`）

- **模式优先级**：URL 参数 `?splash=cinema|classic|off`（别名 `new`→`cinema`、`legacy`→`classic`） > `localStorage["cquest.appearance.v1"].splashMode` > 默认 `cinema`。
- **新版（`cinema` · 极光棱镜）**：Canvas 2D 粒子汇流与极光呼吸光井 + 双轨 SVG 折射星环 + 液态玻璃 `HT` 徽章斜向扫光 + 品牌文字浮现 + 极光进度条，约 2.38s 后光学溶解退出并彻底释放 rAF 与 DOM，零后台开销。
- **旧版（`classic` · 经典简洁）**：还原原有极简 `HT` 玻璃卡片开屏（约 1.4s），并修复了早期的 `.final-logo` 残留问题。
- **交互与无障碍**：支持按钮跳过、`ESC` / `Enter` / `Space` 与点击背景跳过；`prefers-reduced-motion: reduce` 下自动关闭粒子与复杂动画并快速淡出；`<noscript>` 下自动隐藏开屏防阻塞。
- **重播接口**：`window.HTSplash.replay(mode)` 可随时重建舞台重播指定模式。

## 10. 关键约束与已知注意事项

1. **严格维持加载顺序**：`css/08 → 09 → 10`；`content/` 先于 `js/`；`js/09` 末尾首次 `render()` 不可删除；`js/15` 必须最后。
2. **禁止 ES Module 与本地 fetch**：保证 `file://` 双击即用。
3. **单一全局作用域**：新增顶层 `const`/`let` 前全仓排查重名，防止 `SyntaxError` 导致整页白屏。
4. **避免给 `backdrop-filter` 元素做 `transform` 动画**：防止浏览器重采样闪烁。
5. **`works/ink-mist-3d.html` 例外说明**：该独立作品为单文件演示，内部带外部字体/Tailwind 链接，不影响主站零依赖约束；其余三部代码影院与火柴人训练营均为零依赖离线运行。
6. **已知历史行为**：`js/06` 的 `pickAnswer()` 在客观题全对达标时会调用 `completeTask()`，排查 C 关卡直通逻辑时需注意该分支；`renderBeginnerGuide()` 为保留扩展钩子，当前关卡数据未启用 `beginner` 字段。
