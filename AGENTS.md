# AGENTS.md · 给 AI 编码代理的维护须知

> 这是进入本仓库**第一个要读的文件**。动手前先读完本页；需要细节再看
> [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)（架构）、[docs/CONTENT-GUIDE.md](docs/CONTENT-GUIDE.md)（课程内容）、
> [docs/AI-HANDOFF.md](docs/AI-HANDOFF.md)（把项目交给其他 AI 时的交接说明与提示词模板）。

## 项目是什么

HT Lab 是一个**纯静态**的中文学习网站：C 语言 86 关 + 英语四级 62 关，闯关式学习，进度只存浏览器。
技术栈是 vanilla HTML/CSS/JS——**没有构建步骤、没有依赖、没有后端**。
仓库根目录就是 GitHub Pages 发布根目录（线上 https://chenshou666.github.io/ ，仓库 `chenshou666/chenshou666.github.io`，`main` 分支）。

## 硬性规则（不可协商）

1. **不引入构建步骤/依赖**：不加 npm、打包器、框架、预处理器、CDN 外链、字体外链。改完刷新浏览器就该生效。
2. **保持 GitHub Pages 兼容**：全部用相对路径（`./css/...`、`./assets/...`），文件名大小写要精确（Pages 是 Linux，大小写敏感）；保留 `.nojekyll`；不依赖服务端。
3. **必须能 `file://` 双击打开**：不能 fetch 本地 JSON、不能用 `type="module"` / `import()`、不能依赖 Service Worker；否则双击 `index.html` 会坏。
4. **不要随意改可见 UI 与课程内容**：样式/架构类任务不要顺手改文案、题目、版权声明；内容改动走 docs/CONTENT-GUIDE.md。
5. **只有一个 UI**：iOS 液态玻璃界面。旧星空宇宙、双 UI 门户、FPS 浮层、旧外观面板已**整体删除**，不要再加回第二套界面或“切换 UI”按钮。
6. **保持加载顺序**：`css/08-liquid-glass.css → css/10-ui.css`（10 必须最后）；`js/01 … js/10 → js/14-liquid-glass.js → js/15-ui-motion.js`。
7. **js/ 是经典脚本，共享一个全局作用域**：不要转成 ES Module。顶层 `const/let` 跨文件重名会直接 SyntaxError（整页白屏）；同名 `function` 允许（后定义的覆盖前面的）。新增顶层符号前先全仓搜重名。
8. **学习进度只写 localStorage**，键名固定：`cquest.master.v1`、`cquest.cet4.v1`、`cquest.course.v1`、`cquest.appearance.v1`、`codesword.reset.password.v1`、`cquest.project.v1`、`codesword.theme.v1`、`htlab.uimode.v1`。不新增后端/请求/cookie/IndexedDB 存进度。
9. **`index.html` 是唯一页面**：只作为资源引用 + 静态页面壳；不要往里塞大段内联 CSS/JS。
10. **不动 LICENSE 与版权/免责声明文案**（除非任务明确要求）。
11. **改完必须验证**（见“验证”一节）：零 console 报错、零 404、六页可用、手机宽度不重叠。

## 目录速查（改什么去哪里）

```
index.html             唯一页面：CSS/JS 引用顺序 + 静态 DOM（#view、侧栏、顶栏、Toast、弹窗）
css/                   2 个样式文件，08 材质 → 10 界面层（10 必须最后）
js/                    12 个应用脚本，编号即依赖顺序（共享全局作用域）
content/c/*.js         C 课程数据（11 模块 86 关；只放数据）
content/cet4/*.js      四级课程数据（7 模块 62 关；脚本加载顺序 = 路线顺序）
assets/                图标 + audio/cet4（46 个 mp3 + 作者元数据 JSON，元数据运行时不被加载）
docs/                  架构说明 / 内容指南 / AI 交接说明
AGENTS.md / README.md  维护须知 / 使用者说明
```

一级目录职责速记：`css/` 表现，`js/` 行为，`content/` 数据，`assets/` 媒体，`docs/` 文档。

## 常见任务 → 改哪些文件

| 任务 | 主要文件 | 注意 |
| --- | --- | --- |
| 改配色 / 圆角 / 间距 / 阴影 | `css/10-ui.css` 的 `:root` 令牌与对应章节 | 用 `--ui-*` 变量统一改，禁止到处写死色值 |
| 改顶栏 / 底部 Dock / 页面壳 | `index.html` 静态 DOM + `css/10-ui.css` 第 3 节 | 保留 `#view`、`#topTitle`、`#xpTop` 等 JS 依赖节点 |
| 改玻璃材质 / 极光背景 | `css/08-liquid-glass.css` + `js/14-liquid-glass.js` | 材质参数在 08 的 `:root`；10 只做组件映射 |
| 改页面切换 / 入场动画 | `js/15-ui-motion.js` + `css/10-ui.css` 动画章节 | 不要给 `backdrop-filter` 元素加 transform 位移动画（会闪烁） |
| 改课程页 / 路线 / 关卡页布局 | `js/05-views.js` + `css/10-ui.css` 对应章节 | `render()` 会重建 `#view`，交互必须事件委托 |
| 改英语四级任务界面（听力/写作/口语/模考） | `js/06-cet4-engine.js` + `css/10-ui.css` 表单章节 | 音频路径统一 `./assets/audio/cet4/` |
| 新增/调整 C 关卡、题目、答案、检查规则 | `content/c/cN-*.js` 对应关卡；`check` 语法见 CONTENT-GUIDE 3.3 | 不改已有 `id`；顺序 = 数组位置 |
| 新增 C 模块 | 新建 `content/c/c11-*.js` + `index.html` 加 `<script>` + `js/01-course-registry.js` 的 `COURSES` 文案 | 同步 README、文件头注释里的关卡数 |
| 修 C 代码检查器 | `js/08-c-checker.js`（`tokenizeChallengeC` / `parseProgram` / `runCheckSpec`） | 改后要回归各模块关卡（每题 `check` 规格都不同） |
| 修运行结果比对 | `js/08` 的 `compareOutput` / `checkRunOutput` | 比对会忽略行尾空格与首尾空行 |
| 改学习进度/导出/存档码 | `js/02-app-core.js`（`save`/`loadStateFor`）、`js/04-progress-backup.js`（`PROGRESS_KEYS`） | 键名与字段格式不能随便改 |
| 加四级音频 | `assets/audio/cet4/` + content 的 `audio`/`model` + manifest/dialogue JSON | 见 CONTENT-GUIDE 第 6 节 |
| 改 7 天项目 / 总结页 | `js/07-project-and-summary.js` + `css/10-ui.css` | 项目数据键 `cquest.project.v1` |
| 改路由/页面分发 | `js/05-views.js` + `js/09-events.js`（`data-action` / `data-page` 分发） | 不要改已有 `data-*` 属性值 |

## 加载顺序（最容易改坏的地方）

- `index.html` 里顺序固定：**2 个 CSS（08 → 10）→ content/c 11 个 → content/cet4 7 个 → js/01..10 + js/14 + js/15**。
- `content/` 数据必须先于 `js/`；`js/09-events.js` 末尾的首次 `render()` 是首屏渲染，不要删/挪，否则首屏空白。
- `js/14-liquid-glass.js` 负责打 `.liquid-glass` 标记与涟漪，必须在业务脚本之后；`js/15-ui-motion.js` 包装 `window.render`，必须最后。
- 新增 js 文件：编号接在合适位置、在 `index.html` 对应位置加 `<script>`，并检查依赖（新函数能否拿到它需要的全局符号）。
- 四级模块的 `<script>` 顺序 = 课程路线顺序，**不是**文件名/id 顺序（m0→m1→m3→m4→m5→m2→m6）。

## 内容修改

课程数据是 `content/*.js` 里的经典脚本数组；完整字段 schema、写作规范、加关卡/模块/音频的步骤、需要同步的数量文案，全部见 **[docs/CONTENT-GUIDE.md](docs/CONTENT-GUIDE.md)**。改完数据后至少做：

- `node --check` 语法检查；
- 首页课程卡与路线页关卡数一致；
- 新关卡可解锁、可答题、可通关；
- 老用户进度不受影响（不要改已有 `id`）。

## 验证

### 手动验证（每次改动都做）

1. 直接双击 `index.html`（`file://`）——页面能打开、样式正常、控制台无报错。
2. 走一遍六页：学习课程 → 进入 C 语言路线（86 关）→ 打开任意一关 → 我的总结 → 7 天项目 → 关于 / 许可。
3. 英语四级路线（62 关）能进；任意听力关能播放音频。
4. 关卡内：答一题看反馈；做代码题看检查结果；通关后「下一关」可点。
5. 窗口缩到手机宽度（≈390–492px）：无横向溢出、Dock 不遮挡按钮、顶栏不压标题。
6. 检查 Network 面板：无 404（尤其 `content/`、`css/`、`js/`、`assets/audio/cet4/`）。
7. 若改了 `localStorage` 相关逻辑：刷新、导出/导入进度、存档码各测一次。

### 视觉改动额外验证

- 桌面宽屏（≥1280px）与手机宽度各截一张图对比；重点看：讲义正文、选项、输入框、代码区、提示/反馈的对比度。
- 页面切换、Dock 收起/滑出、点击涟漪、弹窗入场是否正常，且 `prefers-reduced-motion` 下不会乱动。

## 提交与部署

- 本仓库就是发布仓库：提交并 push 到 `main` 后，GitHub Pages 自动构建发布（无需额外命令；`.nojekyll` 已关闭 Jekyll）。
- 提交前：`git status` 只包含预期文件；不要提交 `.verify/` 报告、截图、浏览器 profile、临时脚本、`.bak` 备份。
- 提交信息用中文、一句话说明改动范围（现有历史风格：`ui: …`、`fix: …`、`上线…`）。
- 部署后线上验证：打开 https://chenshou666.github.io/ 强刷，检查六页与手机宽度。

## 文档索引

| 文件 | 内容 |
| --- | --- |
| `AGENTS.md`（本文件） | 硬规则、目录速查、常见任务、加载顺序、验证、部署 |
| `docs/AI-HANDOFF.md` | **把项目交给其他 AI 时先给它**：三种交接方式、可复制提示词、常见事故、验收清单 |
| `docs/ARCHITECTURE.md` | 加载顺序、页面生命周期、各子系统、全局符号表、存储键、数据流、约束与坑 |
| `docs/CONTENT-GUIDE.md` | C/四级关卡 schema、`check` 规格、富文本标记、加关卡/模块/音频、数量同步、提交清单 |
| `README.md` | 面向使用者的课程表、本地使用、许可与免责声明 |
