# AI 交接说明（把网站交给其他 AI 修改时，先让它读这份）

> 适用：你想让 Gemini / ChatGPT / Claude / Cursor / Claude Code / Codex 等 AI 修改本站。
> 站点：https://chenshou666.github.io/ ｜ 仓库：`chenshou666/chenshou666.github.io`（`main` 分支 = 发布根目录）

---

## 一、先明确：要让 AI 改什么

| 想改的东西 | 该给 AI 的文件 | 不该动的文件 |
| --- | --- | --- |
| 视觉 / 布局 / 动画 / 颜色 | `index.html`、`css/08-liquid-glass.css`、`css/10-ui.css`、`js/14-liquid-glass.js`、`js/15-ui-motion.js` | `content/`、`js/01–10` |
| 课程内容 / 题目 / 音频对应 | `content/c/*.js`、`content/cet4/*.js`、`docs/CONTENT-GUIDE.md` | `css/`、`js/` |
| 业务逻辑（判题、进度、存档码） | 对应的 `js/0x-*.js` | `content/`（数据） |
| 新增页面 / 新功能 | 先让它说明方案，再只给相关渲染文件（`js/05-views.js` 等） | 全站结构 |

**一次只让 AI 改一类东西**。同时让它改 UI + 内容，几乎必然出事故。

---

## 二、三种交法（按 AI 类型选）

### 方式 A：聊天 AI（Gemini / ChatGPT / Claude 网页版）
AI 看不到你的仓库，只能看你贴/传的文件。

1. 上传对应文件（**一个个传，不要 zip**；多数聊天 AI 读不了压缩包或直接读错）。
2. 第一条消息贴「第三节的首条交接提示词」。
3. 要求它输出**完整文件**（"请输出修改后完整文件，不要省略"），你手工覆盖。
4. 一次只要一个文件的改动，不要让它同时改 5 个文件。

建议给的文件量：
- 只改颜色/圆角/间距 → 只给 `css/10-ui.css`（不够再给 08）
- 改页面结构/交互 → 给 `index.html` + `js/05-views.js` + `css/10-ui.css`
- 加页面切换/动效 → 给 `js/15-ui-motion.js` + `css/10-ui.css`
- 改课程内容 → 给 `docs/CONTENT-GUIDE.md` + 对应 `content/` 文件

### 方式 B：能读网页的 AI（有联网/代码浏览能力）
直接给它仓库链接，让它先读文档再动手：

```
先读这两个文件，再回答我的需求：
https://github.com/chenshou666/chenshou666.github.io/blob/main/AGENTS.md
https://github.com/chenshou666/chenshou666.github.io/blob/main/docs/AI-HANDOFF.md
读完先复述：网站的技术约束、UI 文件有哪些、哪些东西绝对不能加回来。
```

### 方式 C：编码代理（Cursor / Claude Code / Codex / DSH 等，能直接改本地仓库）
这是最稳的方式：

```bash
git clone https://github.com/chenshou666/chenshou666.github.io.git ht-lab
cd ht-lab
```

然后给它这段指令（替换成你的需求）：

```
仓库已克隆到本地，工作目录就是仓库根目录。
先通读 AGENTS.md 与 docs/AI-HANDOFF.md，严格遵守里面的硬性规则。
本次任务：<你的需求，例如「把主色调从青色改成橙色，只改 css/10-ui.css」>
要求：
1. 只改我指定的文件，不要重写 index.html，不要动 content/ 与 js/0x 业务逻辑。
2. 改完自己打开 index.html 检查：课程页 / 路线 / 关卡 / 总结 / 项目 / 关于 六页，控制台 0 报错。
3. 最后用 `git diff --stat` 汇报改了哪些文件，并列出你做了哪些验证。
4. 不要执行 git push，等我确认。
```

---

## 三、首条交接提示词（复制即用）

```
你要修改的是一个纯静态学习网站（HT Lab），有两个课程：C 语言 86 关 / 英语四级 62 关。

【绝对约束】
1. 纯静态：无构建、无 npm、无 CDN、无外部字体/图标库；必须是经典 <script>（不能用 ES Module / import / fetch 本地 JSON），双击 index.html（file://）必须能直接运行。
2. 只有一个 UI：iOS 液态玻璃界面。禁止增加或恢复「星空宇宙 / 双 UI 门户 / 外观面板 / FPS 浮层」——这些已被删除，不要再写回来。
3. 加载顺序固定，不可调整：
   CSS：css/08-liquid-glass.css → css/10-ui.css（10 必须最后）
   JS：js/01 … js/10 → js/14-liquid-glass.js → js/15-ui-motion.js
4. 不要改课程数据（content/）、localStorage 键（cquest.* / codesword.* / htlab.*）、XP 规则、通关判定。
5. 不要整体重写文件；只做最小改动。不要删除已有的 class（JS 依赖它们）。
6. 不要给带 backdrop-filter 的元素加 transform 动画（会闪烁）。

【文件职责】
- css/08-liquid-glass.css：液态玻璃材质（极光画布、玻璃材质、色散描边、涟漪）
- css/10-ui.css：唯一界面层（顶栏、底部 Dock、卡片、按钮、表单、弹窗、手机端、动画）
- js/14-liquid-glass.js：极光画布 + 光标高光 + 点击涟漪
- js/15-ui-motion.js：页面切换动画 + Dock 自动隐藏
- js/05-views.js：页面渲染（课程页 / 路线 / 关卡 / 关于）
- content/：课程数据（只读，除非任务就是改内容）

【输出要求】
- 只输出改动后的完整文件内容（或明确的 diff），不要省略。
- 改动结束后，列出「改了哪些文件 / 改了什么 / 怎么验证」。
```

---

## 四、常用任务提示词模板

### 1) 改视觉（颜色 / 圆角 / 间距 / 玻璃效果）
```
只修改 css/10-ui.css。目标：<具体描述，例如「主色从 #38bdf8 青色改为 #f59e0b 琥珀色，按钮/进度条/高亮同步」>。
要求：
- 颜色改动要通过 :root 里的 --ui-* 变量统一改，不要到处写死色值。
- 同时检查深色可读性：讲义正文 .lesson-copy、选项 .option、输入 .task-input、代码区 .codebox、提示 .hint、反馈 .feedback 的对比度不能下降。
- 不要改布局结构、不要动 08 材质文件。
- 输出完整 css/10-ui.css。
```

### 2) 改布局（顶栏 / Dock / 卡片排列）
```
只修改 css/10-ui.css 中对应的章节（顶栏 / Dock / 卡片 / 页面布局）。
目标：<描述>。要求：
- 保留现有 class 名；不要改 HTML 结构；不要删 JS 依赖的节点。
- 手机端（≤620px）必须重新检查：不横向溢出、Dock 不挡内容、按钮可点。
- 输出完整 css/10-ui.css。
```

### 3) 改动画
```
只修改 css/10-ui.css 的动画章节 和/或 js/15-ui-motion.js。
目标：<描述>。要求：
- 不要给 backdrop-filter 元素做 transform 位移动画（会重采样闪烁）。
- 保留 prefers-reduced-motion 关闭逻辑。
- 只输出改动后的完整文件。
```

### 4) 加/改课程内容
```
只修改 content/ 下的对应数据文件，格式必须严格遵循 docs/CONTENT-GUIDE.md。
要求：不改 id（会破坏老用户进度）；不改 css/js；新增关卡说明是否需要同步文案/关卡数。
输出改动后的完整数据文件。
```

---

## 五、AI 常见事故（提前警告它）

| 事故 | 后果 | 预防提示词 |
| --- | --- | --- |
| 重写整个 `index.html` / 全站"重构" | 内容、脚本加载全丢 | "只做最小改动，不要重写文件" |
| 用 `type="module"` / `import` / `fetch` 读 JSON | 双击 `index.html` 直接白屏 | "经典 script，file:// 必须可用" |
| 把星空 UI / 外观面板 / FPS 加回来 | 出现第二套界面 | "只有一个 UI，禁止加回" |
| 改 `content/` 数据或关卡 id | 课程缺失、老进度失效 | "只改 UI，不碰 content" |
| 用 CDN 引入 Tailwind / 图标库 | 离线/国内环境加载失败 | "零外部依赖" |
| 删掉旧 class 名再写新结构 | JS 事件失效、页面按钮失灵 | "保留 class 名" |
| 大量 `!important` 互相覆盖 | 后续无法维护、手机端错乱 | "改动集中在 :root 变量" |
| 直接 push / 删文件 | 线上事故 | "不要执行 git push" |

---

## 六、验收清单（拿到 AI 产物后）

1. 双击 `index.html`：能打开、样式正常、控制台 0 报错。
2. 六页走一遍：课程页 → C 语言路线（86 关）→ 任意关卡 → 总结 → 7 天项目 → 关于。
3. 英语四级路线（62 关）能进、音频能播。
4. 做一题 → 答题反馈正常；通关 → 下一关能开。
5. 窗口缩到 390px：不横向溢出、Dock 不挡按钮。
6. 刷新后进度还在（localStorage 未坏）。
7. `git status` 只出现预期文件，没有临时脚本/截图/zip。

---

## 七、改动怎么落地

```bash
# 1) 覆盖 AI 给你的文件（先备份）
cp css/10-ui.css css/10-ui.css.bak

# 2) 本地打开 index.html 按第六节验收

# 3) 只提交预期文件
git status
git add index.html css/10-ui.css
git commit -m "ui: <一句话说明>"

# 4) 发布（GitHub Pages 自动构建）
git push origin HEAD:main
```

发布后打开 https://chenshou666.github.io/ 强刷（Ctrl+Shift+R）确认。

---

## 八、给 AI 的文件包（按任务）

| 任务 | 上传 / 指向的文件 |
| --- | --- |
| 只换配色 | `css/10-ui.css` |
| 换玻璃材质 | `css/08-liquid-glass.css` + `css/10-ui.css` |
| 顶部栏 / 底部 Dock 改造 | `index.html` + `css/10-ui.css` |
| 卡片 / 列表 / 页面布局 | `js/05-views.js` + `css/10-ui.css` |
| 页面切换动画 | `js/15-ui-motion.js` + `css/10-ui.css` |
| 关卡页 / 答题界面 | `js/05-views.js`、`js/06-cet4-engine.js`、`css/10-ui.css` |
| 课程内容 / 加关卡 | `content/<模块>.js` + `docs/CONTENT-GUIDE.md` |
| 判题 / 进度 / 存档码 | 对应 `js/0x-*.js` + `docs/ARCHITECTURE.md` |

> 不建议把整个 `content/`（1.5 MB）一起传给聊天 AI；按模块传即可。
