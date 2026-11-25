# AI 交接说明（把网站交给其他 AI 修改时，先让它读这份）

> 适用：你想让 Gemini / ChatGPT / Claude / Cursor / Claude Code / Codex 等 AI 修改本站。
> 站点：https://chenshou666.github.io/ ｜ 仓库：`chenshou666/chenshou666.github.io`（`main` 分支 = 发布根目录）

---

## 一、先明确：要让 AI 改什么

| 想改的东西 | 该给 AI 的文件 | 不该动的文件 |
| --- | --- | --- |
| 开屏动画 | `index.html`、`css/09-splash.css`、`js/10-splash.js` | `content/`、`js/01–09` |
| 视觉 / 布局 / 动画 / 颜色 | `index.html`、`css/08-liquid-glass.css`、`css/10-ui.css`、`js/14-liquid-glass.js`、`js/15-ui-motion.js` | `content/`、`js/01–09` |
| 作品集信息 / 新增作品 | `js/05-views.js`（顶部 `PORTFOLIO_DATA`）、`works/` | `content/`、学习站引擎 |
| 课程内容 / 题目 / 音频对应 | `content/c/*.js`、`content/cet4/*.js`、`docs/CONTENT-GUIDE.md` | `css/`、`js/` |
| 业务逻辑（判题、进度、存档码） | 对应的 `js/0x-*.js` | `content/`（数据） |

**一次只让 AI 改一类东西**。同时让它改 UI + 内容，几乎必然出事故。

---

## 二、三种交法（按 AI 类型选）

### 方式 A：聊天 AI（Gemini / ChatGPT / Claude 网页版）
AI 看不到你的仓库，只能看你贴/传的文件。

1. 上传对应文件（**一个个传，不要 zip**；多数聊天 AI 读不了压缩包或直接读错）。
2. 第一条消息贴「第三节的首条交接提示词」。
3. 要求它输出**完整文件**（“请输出修改后完整文件，不要省略”），你手工覆盖。
4. 一次只要一个文件的改动，不要让它同时改 5 个文件。

建议给的文件量：
- 只改开屏动画 → `css/09-splash.css` + `js/10-splash.js`（如需改结构再给 `index.html`）
- 只改颜色/圆角/间距 → 只给 `css/10-ui.css`（不够再给 08）
- 改页面结构/交互 → 给 `index.html` + `js/05-views.js` + `css/10-ui.css`
- 加页面切换/动效 → 给 `js/15-ui-motion.js` + `css/10-ui.css`
- 改课程内容 → 给 `docs/CONTENT-GUIDE.md` + 对应 `content/` 文件

### 方式 B：能读网页的 AI（有联网/代码浏览能力）
直接给它仓库链接，让它先读文档再动手：

```text
先读这两个文件，再回答我的需求：
https://github.com/chenshou666/chenshou666.github.io/blob/main/AGENTS.md
https://github.com/chenshou666/chenshou666.github.io/blob/main/docs/AI-HANDOFF.md
读完先复述：网站的技术约束、UI 文件有哪些、哪些东西绝对不能加回来。
```

### 方式 C：编码代理（Antigravity / Cursor / Claude Code / Codex，能直接改本地仓库）
这是最稳的方式：

```bash
git clone https://github.com/chenshou666/chenshou666.github.io.git chenshou666.github.io
cd chenshou666.github.io
```

然后给它这段指令（替换成你的需求）：

```text
仓库已克隆到本地，工作目录就是仓库根目录。
先通读 AGENTS.md 与 docs/AI-HANDOFF.md，严格遵守里面的硬性规则。
本次任务：<你的需求，例如「把主色调从青色改成橙色，只改 css/10-ui.css」>
要求：
1. 只改我指定的文件，不要重写 index.html，不要动 content/ 与 js/01–09 业务逻辑。
2. 改完打开 index.html 检查：开屏动画、作品集、课程页 / 路线 / 关卡 / 总结 / 7 天项目 / 关于，控制台 0 报错。
3. 最后用 `git diff --stat` 汇报改了哪些文件，并列出你做了哪些验证。
4. 不要直接覆盖或删除历史备份分支/标签（如 backup/legacy-v1、v1.0-legacy）。
```

---

## 三、首条交接提示词（复制即用）

```text
你要修改的是一个纯静态个人作品集与学习网站（尘狩 · 作品集 / 学习工具），内置 C 语言 86 关 + 英语四级 62 关、代码影院 4 部短片与火柴人训练营小游戏。

【绝对约束】
1. 纯静态：主站无构建、无 npm、无 CDN、无外部字体/图标库；必须是经典 <script>（不能用 ES Module / import / fetch 本地 JSON），双击 index.html（file://）必须能直接运行。
2. 只有一个 UI：iOS 液态玻璃界面。禁止恢复已删除的「星空宇宙 / 双 UI 门户 / FPS 浮层 / 旧版天空预设面板」；不要删除现存的顶栏「⚙ 外观」调节面板（js/14）。
3. 加载顺序固定，不可调整：
   CSS：css/08-liquid-glass.css → css/09-splash.css → css/10-ui.css（10 必须最后）
   JS：js/01 … js/10 → js/14-liquid-glass.js → js/15-ui-motion.js
4. 不要改课程数据（content/）、localStorage 键名（cquest.* / codesword.*）、XP 规则、通关判定与 LICENSE / 版权免责声明。
5. 不要整体重写文件；只做最小改动。不要删除已有的 id/class（JS 依赖它们）。
6. 不要给带 backdrop-filter 的元素加 transform 位移动画（会重采样闪烁）。

【文件职责】
- css/08-liquid-glass.css：液态玻璃材质（极光画布、玻璃材质、色散描边、涟漪）
- css/09-splash.css：独立开屏动画层（极光棱镜新版 + 经典简洁旧版）
- css/10-ui.css：唯一界面层（顶栏、底部 Dock、作品集、学习站、外观面板、手机端、动画）
- js/10-splash.js：开屏动画控制器、粒子画布与重播接口 window.HTSplash
- js/14-liquid-glass.js：极光画布 + 光标高光 + 点击涟漪 + 顶栏「⚙ 外观」调节面板
- js/15-ui-motion.js：页面切换动画 + Dock 自动隐藏
- js/05-views.js：作品集与学习站页面渲染
- works/：代码影院 4 部短片 + player.html + stickman-training/ 小游戏
- content/：课程数据（只读，除非任务就是改内容）

【输出要求】
- 只输出改动后的完整文件内容（或明确的 diff），不要省略。
- 改动结束后，列出「改了哪些文件 / 改了什么 / 怎么验证」。
```

---

## 四、常用任务提示词模板

### 1) 改开屏动画
```text
只修改 css/09-splash.css 和/或 js/10-splash.js（如改结构同步 index.html）。目标：<描述>。
要求：
- 保留新版与旧版（classic）切换能力及 window.HTSplash.replay 接口。
- 零外部依赖，file:// 可运行，支持点击/ESC 跳过，尊重 prefers-reduced-motion。
- 退出后清理 rAF 与 DOM，不留后台开销。
```

### 2) 改视觉（颜色 / 圆角 / 间距 / 玻璃效果）
```text
只修改 css/10-ui.css。目标：<具体描述，例如「主色从 #38bdf8 青色改为 #f59e0b 琥珀色，按钮/进度条/高亮同步」>。
要求：
- 颜色改动要通过 :root 里的 --ui-* 变量统一改，不要到处写死色值。
- 同时检查深色可读性：讲义正文 .lesson-copy、选项 .option、输入 .task-input、代码区 .codebox、提示 .hint、反馈 .feedback 的对比度不能下降。
- 不要改布局结构、不要动 08 材质文件。
```

### 3) 改布局（顶栏 / Dock / 卡片排列）
```text
只修改 css/10-ui.css 中对应的章节（顶栏 / Dock / 卡片 / 页面布局）。
目标：<描述>。要求：
- 保留现有 class 名；不要改 HTML 结构；不要删 JS 依赖的节点。
- 手机端（≤620px）必须重新检查：不横向溢出、Dock 不挡内容、按钮可点。
```

### 4) 加/改课程内容
```text
只修改 content/ 下的对应数据文件，格式必须严格遵循 docs/CONTENT-GUIDE.md。
要求：不改 id（会破坏老用户进度）；不改 css/js；新增关卡说明是否需要同步文案/关卡数。
```

---

## 五、AI 常见事故（提前警告它）

| 事故 | 后果 | 预防提示词 |
| --- | --- | --- |
| 重写整个 `index.html` / 全站“重构” | 内容、脚本加载顺序全丢 | “只做最小改动，不要重写文件” |
| 用 `type="module"` / `import` / `fetch` 读 JSON | 双击 `index.html` 直接白屏 | “经典 script，file:// 必须可用” |
| 把旧星空 UI / 双 UI 门户 / FPS 加回来 | 出现第二套界面 | “只有一个 UI，禁止加回双 UI” |
| 改 `content/` 数据或关卡 id | 课程缺失、老进度失效 | “只改 UI，不碰 content” |
| 用 CDN 引入 Tailwind / 图标库 | 离线/国内环境加载失败 | “零外部依赖” |
| 删掉旧 class/id 再写新结构 | JS 事件失效、页面按钮失灵 | “保留已有 id/class 名” |
| 大量 `!important` 互相覆盖 | 后续无法维护、手机端错乱 | “改动集中在 :root 变量” |
| 直接删备份分支或强制推 `main` | 失去旧版本回退基线 | “保留 backup/legacy-v1 与 v1.0-legacy” |

---

## 六、验收清单（拿到 AI 产物后）

1. 双击 `index.html`：开屏动画正常播放且可跳过，样式正常、控制台 0 报错。
2. 作品集三页（首页 / 作品详情 / 关于作者）与学习站六页（课程 / 路线 / 关卡 / 总结 / 7 天项目 / 关于）全部正常。
3. 顶栏「⚙ 外观」可调节材质、切换新/旧开屏并重播。
4. 英语四级路线（62 关）能进、音频能播；C 语言做一题与检查代码正常。
5. 窗口缩到 390px：不横向溢出、Dock 不挡按钮、开屏居中无截断。
6. 刷新后进度与外观偏好还在（`localStorage` 未坏）。
7. `git status` 只出现预期文件，没有临时脚本/截图/zip。

---

## 七、改动落地与回退

```bash
# 1) 本地打开 index.html 按第六节验收
# 2) 只提交预期文件
git status
git add <改动文件>
git commit -m "ui: <一句话说明>"

# 3) 发布（GitHub Pages 自动构建）
git push origin main
```

发布后打开 https://chenshou666.github.io/ 强刷（`Ctrl+Shift+R`）确认。若需要退回旧版本，按 **[docs/ROLLBACK.md](ROLLBACK.md)** 执行即可。
