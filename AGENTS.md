# AGENTS.md · 给 AI 编码代理的维护须知

> 这是进入本仓库**第一个要读的文件**。动手前先读完本页；需要细节再看 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)（架构）、[docs/CONTENT-GUIDE.md](docs/CONTENT-GUIDE.md)（课程内容）。

## 项目是什么

HT Lab 是一个**纯静态**的中文学习网站：C 语言 86 关 + 英语四级 62 关，闯关式学习，进度只存浏览器。技术栈是 vanilla HTML/CSS/JS——**没有构建步骤、没有依赖、没有后端**。仓库根目录就是 GitHub Pages 发布根目录（线上 https://chenshou666.github.io/ ，仓库 `chenshou666/chenshou666.github.io`，`main` 分支）。

## 硬性规则（不可协商）

1. **不引入构建步骤/依赖**：不加 npm、打包器、框架、预处理器、CDN 外链、字体外链。改完刷新浏览器就该生效。
2. **保持 GitHub Pages 兼容**：全部用相对路径（`./css/...`、`./assets/...`），文件名大小写要精确（Pages 是 Linux，大小写敏感）；保留 `.nojekyll`；不依赖服务端。
3. **必须能 `file://` 双击打开**：不能 fetch 本地 JSON、不能用 `type="module"` / `import()`、不能依赖 Service Worker；否则双击 `index.html` 会坏。
4. **不要随意改可见 UI 与课程内容**：样式/架构类任务不要顺手改文案、题目、版权声明；内容改动走 docs/CONTENT-GUIDE.md。
5. **保持 js/css 的数字编号与加载顺序**：`css/01→08` 是层叠顺序（`07-mobile-patch` 必须最后；`08-visionos.css` 是可选皮肤，加载在 07 之后，仅星空 UI 生效）；`js/01→13` 是依赖顺序（`13-dual-ui` 必须最后；`09-events` 末尾的首次 `render()` 不能挪）。
6. **js/ 是经典脚本，共享一个全局作用域**：不要转成 ES Module。顶层 `const/let` 跨文件重名会直接 SyntaxError（整页白屏）；同名 `function` 允许（后定义的覆盖前面的，这是经典脚本的坑）。新增顶层符号前先全仓搜重名。
7. **学习进度只写 localStorage**，键名固定：`cquest.master.v1`、`cquest.cet4.v1`、`cquest.course.v1`、`cquest.appearance.v1`、`codesword.reset.password.v1`、`cquest.project.v1`、`codesword.theme.v1`、`htlab.uimode.v1`。不新增后端/请求/cookie/IndexedDB 存进度。
8. **`index.html` 是唯一页面**：只作为资源引用 + 静态页面壳；不要往里塞大段内联 CSS/JS（这正是重构拆出去的原因）。
9. **不动 LICENSE 与版权/免责声明文案**（除非任务明确要求）。
10. **改完必须验证**（见"验证"一节）：零 console 报错、零 404、两门课/两种 UI 都能用。

## 目录速查（改什么去哪里）

```
index.html             唯一页面：CSS/JS 引用顺序 + 静态 DOM（#view、侧栏、顶栏、双 UI 节点）
css/                   7 个样式文件，编号即层叠顺序（07 必须最后）
js/                    13 个应用脚本，编号即依赖顺序（共享全局作用域；13 必须最后）
content/c/*.js         C 课程数据（11 模块 86 关；只放数据）
content/cet4/*.js      四级课程数据（7 模块 62 关；脚本加载顺序 = 路线顺序）
assets/                图标 + audio/cet4（46 个 mp3 + 作者元数据 JSON，元数据运行时不被加载）
docs/                  架构说明 + 内容编写指南
tools/verify-site.mjs  本地验证脚本（无头 Edge/Chrome，不属于站点运行时）
AGENTS.md / README.md  维护须知 / 使用者说明
```

一级目录职责速记：`css/` 表现，`js/` 行为，`content/` 数据，`assets/` 媒体，`docs/` 文档，`tools/` 开发工具。

## 常见任务 → 改哪些文件

| 任务 | 主要文件 | 注意 |
| --- | --- | --- |
| 新增/调整 C 关卡、题目、答案、检查规则 | `content/c/cN-*.js` 对应关卡；`check` 语法见 CONTENT-GUIDE 3.3 | 不改已有 `id`；顺序 = 数组位置 |
| 新增 C 模块 | 新建 `content/c/c11-*.js` + `index.html` 加 `<script>` + `js/01-course-registry.js` 的 `COURSES` 文案 | 同步 README、文件头注释里的关卡数 |
| 调整样式/视觉 | 按"最后出现该选择器"的原则选 `css/01–07` 中最靠后的文件；局部修正优先 `03/04/05` | 手机端看 `07` 与 `06`；外观参数走 `css/04` 的变量 |
| 改顶栏/导航/页面壳 | `index.html` 的 static DOM + `css/01/02` | 顶栏双 UI 按钮由 `js/13` 动态注入 |
| 改外观面板（天空/模糊/圆角等） | `js/11-appearance.js`（`AP_DEF` / `AP_SKY`）+ `css/03` 的面板样式 | 参数写成 CSS 变量，卡片侧在 `css/04` 消费 |
| 修 C 代码检查器 | `js/08-c-checker.js`（`tokenizeChallengeC` / `parseProgram` / `runCheckSpec`） | 改后要回归各模块关卡（每题 `check` 规格都不同） |
| 修运行结果比对 | `js/08` 的 `compareOutput` / `checkRunOutput` | 比对会忽略行尾空格与首尾空行 |
| 改学习进度/导出/存档码 | `js/02-app-core.js`（`save`/`loadStateFor`）、`js/04-progress-backup.js`（`PROGRESS_KEYS`） | 键名与字段格式不能随便改 |
| 修英语四级任务（听力/写作/口语/模考） | `js/06-cet4-engine.js` + `content/cet4/*.js` | 音频路径统一 `./assets/audio/cet4/` |
| 加四级音频 | `assets/audio/cet4/` + content 的 `audio`/`model` + manifest/dialogue JSON | 见 CONTENT-GUIDE 第 6 节 |
| 改双 UI / 粒子 / FPS / 星轨卡 | `js/13-dual-ui.js` + `css/06-fps.css` + `index.html` 的双 UI 节点 | 玻璃 UI 与星空 UI 共用同一份状态，改桥接要两边都测 |
| 改 7 天项目 / 总结页 | `js/07-project-and-summary.js` | 项目数据键 `cquest.project.v1` |
| 改路由/页面渲染 | `js/05-views.js` + `js/09-events.js`（`data-action` 分发） | `render()` 会重建 `#view`，交互必须用事件委托 |

## 加载顺序（最容易改坏的地方）

- `index.html` 里顺序固定：**7 个 CSS → content/c 11 个 → content/cet4 7 个 → js/01..13**。
- `content/` 数据必须先于 `js/`；`js/13-dual-ui.js` 必须在所有应用脚本之后（它包装 `window.render/save` 并增强双 UI DOM）。
- `js/09-events.js` 最后一行 `render()` 是首次渲染；不要删/挪，否则首屏空白。
- 新增 js 文件：编号接在合适位置、在 `index.html` 对应位置加 `<script>`，并检查依赖（新函数能否拿到它需要的全局符号）。
- 四级模块的 `<script>` 顺序 = 课程路线顺序，**不是**文件名/id 顺序（m0→m1→m3→m4→m5→m2→m6）。

## 内容修改

课程数据是 `content/*.js` 里的经典脚本数组；完整字段 schema、写作规范、加关卡/模块/音频的步骤、需要同步的数量文案，全部见 **[docs/CONTENT-GUIDE.md](docs/CONTENT-GUIDE.md)**。改完数据后至少做：

- `node --check` 语法检查；
- 首页课程卡与路线页关卡数一致；
- 新关卡可解锁、可答题、可通关；
- 老用户进度不受影响（不要改已有 `id`）。

## 验证

### 自动验证（优先）

仓库带一个不依赖 npm 的验证脚本（在仓库根目录运行）：

```bash
node tools/verify-site.mjs --root . --label after --out ../.verify
# 与上一次（例如重构前）的基线对比：
node tools/verify-site.mjs --root . --label after --compare baseline --out ../.verify
```

- 环境：**Node.js ≥ 20**（脚本头部声明；使用全局 fetch/WebSocket），本机需装 Edge 或 Chrome（自动探测；也可 `--browser <path>` 或环境变量 `BROWSER_PATH`）。
- 行为：脚本自己起本地 HTTP 服务（默认端口 `8123`，被占用时顺延），用 DevTools 协议驱动**无头浏览器**走一遍交互矩阵（首页/门户、玻璃 UI、四个侧栏页面、两门课切换、C 关卡页、四级关卡页与音频、星空 UI、外观面板、重置弹窗、390×844 手机视口、`file://` 加载），采集 console 报错、异常、失败请求、DOM/文本/布局/样式快照与截图。
- 产物：默认写到 `--out` 下的 `<label>/`：`report.md`、`report.json`、`screenshots/*.png`；加 `--compare` 时还有 `compare.md` / `compare.json`。报告目录不应提交进仓库。
- 退出码：**0** = clean / 对比通过；**1** = 有失败或与基线差异；**2** = 脚本自身错误。
- 已按重构前基线跑通：**20 个状态、25/25 交互通过、0 console 报错/异常/失败请求**，单次运行约 50 秒；`file://` 加载是矩阵第 18 个状态，基线通过。
- 对比模式：先要有 `<out>/<baselineLabel>/report.json` 基线报告；比对文本、DOM 结构、布局盒（容差 ±2px）、计算样式、元素/关卡计数、标志位，URL 会被归一化，**请求数量与资源路径不参与比对**；截图只供人工查看，不做像素比对；基线里的已知问题不会导致对比失败。
- 已知限制：如果同时还有另一个无头 Edge/Chrome 在运行，Edge 可能立刻退出并报 `browser did not expose DevTools port`（退出码 2）——关闭其他浏览器会话（或执行 `taskkill msedge`）后重跑。
- 参数以脚本 `--help` 与文件头注释为准（该脚本已冻结；改动它不属于站点内容维护）；脚本内部的「已知问题基线」（`KNOWN_ISSUES`）默认为空，即默认不豁免任何报错。

### 手动验证（每次改动都做）

1. 直接双击 `index.html`（`file://`）——页面能打开、样式正常、控制台无报错。
2. 选一种 UI（或关闭门户），走：学习课程 → 进入 C 课 → 打开一关 → 做题/检查代码 → 返回；再切换到四级课。
3. 顶栏切换另一种 UI（玻璃 ⇄ 星空），确认进度与页面内容一致、星空卡能直接进关卡。
4. 缩小窗口到手机宽度（≈390px）：侧栏/顶栏不重叠、FPS 不遮挡内容。
5. 检查 Network 面板：无 404（尤其 `content/`、`css/`、`js/`、`assets/audio/cet4/`）。
6. 若改了 `localStorage` 相关逻辑：刷新、导出/导入进度、存档码各测一次。

## 提交与部署

- 本仓库就是发布仓库：提交并 push 到 `main` 后，GitHub Pages 自动构建发布（无需额外命令；`.nojekyll` 已关闭 Jekyll）。
- 提交前：`git status` 只包含预期文件；不要提交 `.verify/` 报告、截图、浏览器 profile、临时脚本。
- 提交信息用中文、一句话说明改动范围（现有历史风格：`refactor: …`、`fix: …`、`上线…`）。
- 部署后线上验证：打开 https://chenshou666.github.io/ 检查首页、两门课、两种 UI。

## 文档索引

| 文件 | 内容 |
| --- | --- |
| `AGENTS.md`（本文件） | 硬规则、目录速查、常见任务、验证、部署 |
| `docs/ARCHITECTURE.md` | 加载顺序、页面生命周期、各子系统、全局符号表、存储键、数据流、约束与坑 |
| `docs/CONTENT-GUIDE.md` | C/四级关卡 schema、`check` 规格、富文本标记、加关卡/模块/音频、数量同步、提交清单 |
| `README.md` | 面向使用者的课程表、本地使用、许可与免责声明 |
