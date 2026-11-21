# 学习工具 内容编写指南

> 面向课程内容作者。改数据前请先读 [ARCHITECTURE.md](ARCHITECTURE.md) 与根目录 `AGENTS.md`。
> 本文件里的字段与写法全部对照仓库现有 86 个 C 关卡、62 个四级关卡的实际数据整理；新增内容请保持同样的结构与文风。

## 1. 内容放在哪里

```
content/
├─ c/            C 语言课程：每个模块一个 .js 文件，11 个文件共 86 关
│   c0-getting-started.js   模块 0 · 起步上路（id 1–8）
│   c1-control-flow.js      模块 1 · 流程控制（id 9–16）
│   c2-functions.js         模块 2 · 函数与程序结构（id 17–24）
│   c3-arrays-strings.js    模块 3 · 数组与字符串（id 25–32）
│   c4-pointers-memory.js   模块 4 · 指针与内存（id 33–42）
│   c5-types-ds.js          模块 5 · 自定义类型与数据结构（id 43–50）
│   c6-file-io.js           模块 6 · 文件与输入输出（id 51–56）
│   c7-engineering.js       模块 7 · 预处理器与工程实践（id 57–64）
│   c8-algorithms.js        模块 8 · 数据结构与算法（id 65–74）
│   c9-systems.js           模块 9 · 系统与底层（id 75–80）
│   c10-projects.js         模块 10 · 综合项目（id 81–86）
└─ cet4/         英语四级：每个模块一个 .js 文件，7 个文件共 62 关
    m0-foundation.js        模块 0 · 地基（id 101–108）
    m1-listening.js         模块 1 · 听力（id 201–212）
    m3-reading.js           模块 3 · 阅读（id 401–414）
    m4-writing.js           模块 4 · 写作（id 501–508）
    m5-translation.js       模块 5 · 翻译（id 601–608）
    m2-speaking.js          模块 2 · 口语（id 301–310）
    m6-mock.js              模块 6 · 全真模考（id 701–702）
```

**关键规则：** `index.html` 里这些文件的 `<script>` 标签顺序 = 学习路线顺序。

- C：c0 → c1 → … → c10（与 id 升序一致）。
- 四级：**m0 → m1 → m3 → m4 → m5 → m2 → m6**（即 地基 → 听力 → 阅读 → 写作 → 翻译 → 口语 → 模考），**不是** id 升序（301 的口语排在 401 阅读之后）。
- 新增模块时，必须把 `<script src="./content/...">` 插到路线中正确的位置，而不是文件名的字母顺序。

## 2. 数据文件的写法

每个内容文件都是**经典脚本**（不是 JSON、不是 ES Module），固定结构：

```js
/* 头部注释：模块名、关卡 id 范围、字段说明（照抄同类文件再改） */
window.C_MODULES = window.C_MODULES || [];   // C 语言用；四级用 window.CET4_MODULES
window.C_MODULES.push({
  id: "c0",                       // 模块 id，与文件名对应
  name: "模块 0 · 起步上路",       // 模块名 = 页面上的"阶段/模块"标题
  levels: [
    { id: 1, title: "…", /* 关卡字段，见下 */ },
    // …
  ]
});
```

- `id` / `name` / `levels` 是模块级字段；关卡级字段见第 3、4 节。
- 文案字符串统一用双引号，换行写真实转义 `\n`；长段落用 `+` 拼接（现有风格）。
- 文件必须能被浏览器当普通脚本执行：不能有 `import/export`、不能有 JSON 式尾逗号问题（数组/对象尾逗号在 JS 里合法，但保持与现有文件一致即可）。
- 关卡字段 `stage / module / course`（C 课的 `type="code"`）**不要手写**：`js/01-course-registry.js` 会用模块名/课程 id 统一注入（写了也会被覆盖）。
- 修改后建议先 `node --check content/c/xxx.js` 做语法检查（文件里引用 `window` 不影响语法解析）。

## 3. C 语言关卡 schema

以 `content/c/c0-getting-started.js`（第 1 关是格式与文风基准）和后续模块为准，字段全集：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | number | ✅ | 关卡号，全课程唯一；**数组位置 = 路线位置**，id 递增排列（1–86） |
| `title` | string | ✅ | 关卡标题（卡片、页头） |
| `minutes` | number | ✅ | 建议用时（分钟），显示在卡片/页头 |
| `gist` | string | ✅ | 一句话简介（路线卡片、页头副标题） |
| `lesson` | string | ✅ | 讲义正文：原理讲解，`\n` 分段；支持富文本标记（见 3.4） |
| `example` | object | ✅ | 可编译运行的示例，见 3.1 |
| `pitfalls` | string[] | ✅ | 常见陷阱（每条一段，支持 `fmtInline` 标记） |
| `takeaways` | string[] | ✅ | 核心要点（页面右侧速览 + 正文底部） |
| `questions` | object[] | ✅ | 知识快问，见 3.2（当前 86 关全部使用；共 257 题，每题 4 个选项） |
| `passRatio` | number | ✅ | 快问达标率；C 课全部 `0.8`，需要 `Math.ceil(0.8 × 题数)` 题答对 |
| `mission` | string | ✅ | 代码挑战的任务描述（要写清输入/输出/约束） |
| `starter` | string | ✅ | 编辑器初始代码（骨架 + 注释引导） |
| `hint` | string | ✅ | "查看提示"内容 |
| `solution` | string | ✅ | 标准答案（通关或输入密码后可见，可复制） |
| `mastery` | string[] | ✅ | 掌握标准（"学完你应该能做到…"） |
| `check` | object | ✅ | 结构检查规格，见 3.3 |
| `expectedOutput` | string | 可选 | 本机运行后的预期输出；有则出现"运行结果比对"，没有则只做结构检查（当前 86 关中 68 关有） |
| `input` | string | 可选 | 作者记录的运行输入（如 `"6 7"`），**页面不显示**，仅用于复现示例 |
| `example.input` | string | 可选 | 同上，示例代码的运行输入，**页面不显示** |

> 不要使用旧字段 `quiz / options / answer / explain`（单题旧格式）：`js/05` 里仍保留兼容分支，但现有数据已全部改为 `questions`，新增内容请只用 `questions`。
> `beginner` 字段（`renderBeginnerGuide` 支持）当前没有任何关卡使用；若要启用，结构是 `{idea:string, read:string[], steps:string[], pitfall:string}`，但请先确认它符合课程文风。

### 3.1 `example`

```js
example: {
  code:    "#include <stdio.h>\n\nint main(void) {\n    printf(\"Hello, C!\\n\");\n    return 0;\n}",
  output:  "Hello, C!",                  // 真实运行输出（不是手写想象）
  explain: "第 1 行引入标准输入输出头文件……",  // 逐段讲解，可较长
  input:   "",                          // 可选：运行时输入，页面不显示
}
```

要求（来自内容文件头部约定）：

- `code` 必须**真实编译运行通过**（TDM-GCC 4.9.2 / Dev-C++ 自带，`-std=c11 -Wall -Wextra`，本仓库内容零警告）。
- `output` 必须是真实输出；涉及 `sizeof`、地址等平台相关数值的示例要避免或说明。
- `explain` 面向零基础：讲清"这段为什么这样写"，不要只罗列结论。

### 3.2 `questions`（知识快问）

```js
{
  q: "一个 C 程序开始运行时，第一条被执行的语句在哪里？",
  options: ["在源文件的第一行", "在 main 函数里", "在最后定义的那个函数里", "在 #include 那一行"],
  answer: 1,               // 正确选项下标，从 0 开始
  explain: "程序的入口是 main 函数，和函数写在文件里的位置无关。……",
}
```

- `answer` 从 `0` 起，必须小于选项数；现有数据全是 4 个选项（新增也建议 4 个）。
- 答对率 ≥ `passRatio` 才算快问达标；答错后不能改（C 关可以"重做本关题目"）。
- 讲解 `explain` 要说明错误选项为什么错（现有文风的特色）。

### 3.3 `check` 结构检查规格

`check` 是 `js/08-c-checker.js` 的声明式规格，按以下字段组合（不是所有字段都必须写）：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `include` | string 或 string[] | 必须 `#include <…>` 的头文件，如 `"stdio.h"` |
| `noInclude` | string[] | 禁止包含的头文件 |
| `main` | `false` | 允许没有 `int main(void)`（默认必须有完整 main） |
| `return0` | `true` | main 内必须有 `return 0;` |
| `seq` | string[][] | main 内必须出现的 token 序列，例：`[["int","itemCount","="]]` |
| `seqAny` | string[][][] | 至少命中其中一种序列 |
| `calls` | (string \| [string, needle])[] | 必须调用的函数；带 needle 时首个实参需包含该子串，例：`[["printf","itemCount"]]` |
| `callsAnywhere` | `true` | `calls` 在全代码范围查找（默认只看 main 内） |
| `callCounts` | [name, min?, max?][] | 函数调用次数上下限，例：`[["printf",4,4]]` |
| `forbid` | string[] | 禁止出现的标识符/关键字，例：`["strcpy"]` |
| `require` | object | 见下表 |
| `minStatements` | number | 至少几条语句（按 `;` 粗算） |
| `message` | string | 检查失败时的自定义提示（讲清本关要求） |
| `ok` | string | 检查通过时的自定义提示 |

`require` 可用键：

| 键 | 说明 |
| --- | --- |
| `if` / `switch` / `for` / `while` / `doWhile` | 必须使用对应控制流 |
| `loop` | 必须使用循环（for/while/do 任一） |
| `array` | 必须有数组（形如 `int a[5];`） |
| `pointer` | 必须有指针变量（形如 `int *p;`） |
| `malloc` / `free` | 必须申请动态内存 / 必须释放 |
| `struct` `enum` `union` `typedef` | 必须定义/使用对应构造（`struct`/`enum` 的值为类型名） |
| `file` | 必须用 `fopen` 打开文件 |
| `recursion` | 必须用递归：`true`（任意自递归）或函数名数组（指定函数递归） |
| `funcs` | 必须自己定义这些函数（不是只写声明） |

示例（真实关卡）：

```js
check: {
  include: ["stdio.h"],
  return0: true,
  seq: [["int","itemCount","="], ["double","unitPrice","="], ["char","currency","="]],
  calls: [["printf","itemCount"], ["printf","unitPrice"], ["printf","currency"], ["printf","sizes:"]],
  minStatements: 6,
  message: "需要 #include <stdio.h>、三个变量（int itemCount、double unitPrice、char currency）、4 次 printf……",
  ok: "变量声明、三种格式符和 sizeof 都用对了，结构完整。",
}
```

注意：

- 检查是**轻量结构检查，不等同于编译器**：它只核对本关要求的写法；真正正确性靠作者把示例/答案真编译真运行，以及页面上的"运行结果比对"。
- 基于正则的检查（`include`/`forbid`/`require` 等）会先遮蔽注释和字符串，所以注释掉的关键词不会误判；`seq`/`calls` 走词法 token，注释被丢弃。
- 不要用 `check` 做"输出值必须等于 X"这类运行期检查：运行输出请放 `expectedOutput`。

### 3.4 讲义富文本标记（`fmtLesson` / `fmtInline`）

`lesson`、`pitfalls`、`takeaways`、`mastery`、`explain` 等文案会被统一转义后套用下列标记：

| 写法 | 效果 | 说明 |
| --- | --- | --- |
| `**重点**` | 加粗高亮 | 不要写 HTML 标签（会被转义显示） |
| `==高亮==` | 黄底高亮 | 短句、关键结论 |
| `!!注意!!` | 警告色文字 | 易错点 |
| `「术语」` | 术语样式 | 中文引号包住的术语 |
| 行首为 `注意/易错/常见错误/坑/不要/必须/一定要/记住/核心/关键/重点` | 整行警告样式 | 用于讲义里的重点行 |
| 代码样式（自动） | 行内代码 | `#include`、`printf`、`int`、`sizeof`、`%d`、`0x1F`、`\n`、`文件名.c` 等会被自动标记 |

- 文案里**不要**手写 `<b>` 之类的 HTML（先转义，会原样显示）。
- 想换行就写真实换行（`\n`）；空行分段即可。
- 像 `Dev-C++ 按 F11 编译运行`、`gcc 文件名.c -o 程序名` 这类命令会自动变代码样式。

## 4. 英语四级关卡 schema

四级关卡共用一套字段，再按 `type` 取用：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | number | ✅ | 关卡号；模块号 × 100 + 序号（m0=1xx，m1=2xx，…，m6=7xx）；全局唯一 |
| `title` / `minutes` / `gist` | string/number/string | ✅ | 同 C 课程 |
| `lesson` | string | ✅ | 本关要点讲解（富文本标记同 C） |
| `usage` | string | ✅ | "能用在哪儿"（现实场景说明） |
| `takeaways` | string[] | ✅ | 核心要点 |
| `type` | string | ✅ | `quiz` / `listen` / `read` / `write` / `translate` / `speak` / `mock` |
| `taskTitle` / `taskCopy` | string | ✅ | 任务卡标题与说明（页面会显示） |
| `passRatio` | number | ✅ | 客观题达标率：0.8（多数）、0.75（部分听力/阅读）、0.6（模考/模考写作） |
| `questions` | object[] | ✅ | 客观题（结构同 C：`q/options/answer/explain`，answer 从 0 起；现有 62 关全部有） |
| `audio` | object[] | 听力/口语/模考常用 | 音频条目，见 4.1 |
| `audioTip` | string | 可选 | 音频区提示（如"先裸听一遍"） |
| `passage` | string | 阅读/模考常用 | 阅读材料原文 |
| `passageLabel` / `passageTag` | string | 可选 | 材料区小标题 / 标签（默认"阅读材料"/"精读"） |
| `prompt` | string | 写作/翻译/口语 | 任务题干 |
| `placeholder` | string | 可选 | 作答框占位提示 |
| `source` | string | 翻译常用 | 待翻译的中文段落 |
| `minWords` | number | 写作/翻译 | 最低词数（考试要求 120–180 词，前几关可降低做脚手架） |
| `points` | array | 写作/翻译 | 必含要点组，见 4.2 |
| `sample` | string | 写作/翻译 | 参考范文 / 参考译文（通关或密码后可见） |
| `model` | object | 口语 | 示范朗读 `{file, voice, text}` |
| `checklist` | string[] | 口语 | 跟读自评清单（全部打勾 + 录音/跳过录音才算通关） |
| `timeLimit` | number | 模考/部分关卡 | 限时（分钟）；倒计时结束模考自动交卷 |

### 4.1 `audio` 与音频文件

```js
audio: [
  {
    file: "102-1.mp3",             // 只是文件名，页面会拼成 ./assets/audio/cet4/<file>
    label: "三种时态对比朗读",
    voice: "女声",                  // 显示用的音色说明（可选）
    hint: "听 work / worked / have worked 的区别",
    transcript: "I work in a small office every day.\nI worked in a bank two years ago.\n…",
  },
]
```

- 音频文件放 `assets/audio/cet4/`，命名 `<关卡号>-<序号>.mp3`（例如第 102 关第 1 段 → `102-1.mp3`；示范朗读同样规则）。
- `transcript` 是可选的"显示原文"内容；没有它就没有原文按钮。
- `audioTip` 放在关卡级（不是 audio 条目里），用于整段听力提示。
- 当前库存：**46 个 mp3**；每个 mp3 都被 content 里的 `audio` 或 `model` 引用，且被 manifest/dialogue JSON 覆盖（改音频时两者都要更新，见第 6 节）。

### 4.2 `points`（写作/翻译要点匹配）

```js
points: [
  ["in my view", "in my opinion", "as far as i", "i believe"],  // 第 1 组：任一命中即算这组通过
  ["the first reason", "first of all", "firstly", "to begin with"],
  ["for example", "for instance", "such as"],
  ["in short", "in conclusion", "to sum up"],
]
```

- 每个内层数组是一"组"：组内任一关键词命中即该组通过；所有组都命中才算要点齐全。
- 匹配规则：大小写不敏感、子串匹配；纯字母关键词走单词边界（`keyHit`）。
- 每组第一个字符串同时作为页面上的要点标签显示。
- 判分还要求词数 ≥ `minWords`；`write/translate` 关卡的客观题也要达标。

### 4.3 各 type 的必填/常用字段速查

| type | 主要字段 | 通关条件 |
| --- | --- | --- |
| `listen` | `audio[]`、`questions[]`、`audioTip?`、`timeLimit?` | 客观题答对率 ≥ `passRatio` |
| `read` | `passage`、`questions[]`、`audio?`、`timeLimit?` | 同上 |
| `quiz` | `questions[]` | 同上 |
| `write` | `prompt`、`minWords`、`points[]`、`sample`、`placeholder?`、`source?`、`questions[]` | 要点全中 + 词数达标 + 客观题达标 |
| `translate` | 同上（`source` 通常必填） | 同上 |
| `speak` | `prompt`、`model{file,voice,text}`、`checklist[]`、`questions[]` | 录音（或"跟读自评代替"）+ 清单全勾 + 客观题达标 |
| `mock` | `questions[]`（25 题）、`timeLimit`、`audio[]`、`passage?`、`passRatio` | 交卷后答对率 ≥ `passRatio`（0.6） |

### 4.4 一个最小四级关卡示例（听力）

```js
{
  id: 213,
  title: "听力：机场广播（新增示例）",
  minutes: 12,
  gist: "在机场广播场景里抓时间、登机口和变更信息。",
  lesson: "机场广播的固定套路是：航班号 → 时间 → 登机口 → 变更。**先听数字和时间**，再听动词……",
  usage: "出国旅行、转机、听车站广播都用得上。",
  takeaways: ["先抓航班号与时间", "注意 gate / delay / boarding 这些词", "数字题先分清全部还是部分"],
  type: "listen",
  taskTitle: "听两段机场广播",
  taskCopy: "先裸听一遍作答，再逐句复盘。",
  passRatio: 0.8,
  audio: [{
    file: "213-1.mp3",
    label: "机场广播 1",
    voice: "女声",
    hint: "注意登机口和时间变化",
    transcript: "Flight CA123 to Shanghai is now boarding at gate 18. …",
  }],
  questions: [{
    q: "本次航班的登机口在哪里？",
    options: ["Gate 8", "Gate 18", "Gate 28", "Gate 80"],
    answer: 1,
    explain: "广播里说 boarding at gate 18，18 和 80 是典型干扰项。",
  }],
}
```

## 5. 操作流程

### 5.1 修改现有 C 关卡

1. 打开对应 `content/c/cN-*.js`，定位 `id`（不要改已有 `id`，否则老用户进度会对不上）。
2. 改文案/示例/答案/`check`；保持字段完整（参考同模块其他关卡）。
3. 同步更新：`example.output` 与 `expectedOutput` 必须是真跑出来的结果；`solution` 与 `starter` 要一致。
4. `node --check` 该文件 → 本地打开页面 → 找到该关 → 走一遍"快问 → 代码检查 → 运行比对"。

### 5.2 新增一个 C 关卡

1. 在**对应模块文件的 `levels` 数组末尾**插入新关卡对象（位置 = 路线位置；id 要大于该模块最后一关）。
2. 新 id 若跨模块，注意它必须落在该模块的 id 区间内，并同步后续模块 id（**不推荐**在中间插号；插号需要改所有后续 id，会破坏老用户进度）。
3. 填全所有必填字段；`expectedOutput` 建议提供（没有就只能做结构检查）。
4. 作者自测：真编译真运行示例与标准答案；确认 `check` 能拦住错误写法、放行正确写法。
5. 同步计数与文案（见第 7 节）：`js/01-course-registry.js` 的 `COURSES` 文案、`README.md` 的课程表与目录树、该内容文件头部注释里的关卡数。
6. 手动打开页面逐页验证（见第 8 节）。

### 5.3 新增一个 C 模块

1. 复制一个现有模块文件命名 `c11-xxx.js`（模块号连续）。
2. 头部注释写模块名、id 范围、字段说明；模块对象 `{id:"c11", name:"模块 11 · …", levels:[…]}`。
3. **`index.html` 中在 `c10-projects.js` 之后加一行**：`<script src="./content/c/c11-xxx.js"></script>`。
4. 更新 `js/01-course-registry.js` 中 `COURSES[0]`（C 语言）的文案：`sub`（模块数/关卡数概览）、`heroCopy`（各模块关卡数）、`routeNote`（路线顺序）、`mapNote` / `footNote`（如涉及）。
5. 更新 `README.md` 课程表、目录树与关卡数。
6. 验证：路线页出现新模块、关卡数正确、最后一关通关后能进下一关。

### 5.4 新增一个四级关卡

1. 打开对应模块文件，在 `levels` 末尾插入关卡对象；id 落在该模块号区间（如 m1 = 2xx）。
2. 按 `type` 填必填字段（第 4.3 节）；写作/翻译别忘了 `points` / `minWords` / `sample`，口语别忘了 `model` / `checklist`。
3. 若带音频：按第 6 节生成并登记音频。
4. 更新计数与文案（第 7 节）。

### 5.5 新增一个四级模块

1. 复制现有模块文件命名 `mN-xxx.js`（模块号连续；N 与 id 段对应）。
2. 模块对象 `{id:"mN", name:"模块 N · …", levels:[…]}`。
3. **`index.html` 中按路线顺序插入**对应 `<script>`（注意：文件名的字母顺序 ≠ 路线顺序；新增模块要放在路线中合适的位置）。
4. 更新 `js/01-course-registry.js` 的 `COURSES[1]`（英语四级）文案：`sub`、`heroCopy`、`routeNote`、`mapNote`、`footNote`。
5. 更新 `README.md` 课程表/目录树/关卡数。
6. 验证：切换课程后路线顺序正确、关卡解锁链正确、"第 N 关"显示正常。

### 5.6 新增四级音频

1. 用 edge-tts（或等价 TTS）生成 mp3，放到 `assets/audio/cet4/`，命名 `<关卡号>-<序号>.mp3`。
2. 在关卡对象里加 `audio` 条目（`file` 只写文件名、`label`、`voice`、`hint`、`transcript`），或口语关加 `model`。
3. 更新作者元数据：
   - 单声道：`manifest.json`（模块 0）或 `manifest-mN.json`，数组元素 `{file, text, voice, rate}`（`rate` 形如 `"-8%"`）；
   - 多角色对话：`dialogue.json` / `dialogue-mN.json`，元素 `{file, note, parts:[{voice,text}]}`；对话由分段合成后用 ffmpeg 拼接（轮次间约 0.35s 静音）。
   - 这些 JSON **不在页面运行时加载**，但它们是音频与文本一致性的作者校验清单；改音频务必同步。
4. 若总音频数变化，更新 `README.md` 里的"共 46 段"与目录树说明。
5. 验证：页面音频可播放；`transcript` 与音频/清单一致；手机与桌面都能播放。

## 6. 音频清单现状（2026-11 重构后）

```
assets/audio/cet4/
├─ 46 个 mp3：102-1 … 701-4
├─ manifest.json      5 条（模块 0）
├─ manifest-m1.json   6 条
├─ manifest-m2.json  10 条
├─ manifest-m3.json   4 条
├─ manifest-m4.json   2 条
├─ manifest-m5.json   4 条
├─ manifest-m6.json   2 条
├─ dialogue.json      1 条（201-1 短对话）
├─ dialogue-m1.json  10 条
└─ dialogue-m6.json   2 条（701-1 短对话、701-2 长对话）
```

- manifest + dialogue 合计覆盖全部 46 个 mp3，没有遗漏/孤立文件；content 里的 `audio/model` 引用与文件一一对应。
- 音频生成/拼接脚本（edge-tts、ffmpeg 流程）**不包含在本仓库**，由作者另行维护；仓库只发布成品音频与上述元数据。

## 7. 哪些数量与文案需要手动同步

页面上的**数字**大多由数据自动计算（课程卡"x 个模块 · y 关"、路线页模块计数、总结页统计都来自 `courseLevels / courseGroups`），但**写死在文案里的数字**必须手动改：

| 位置 | 需要检查的内容 |
| --- | --- |
| `js/01-course-registry.js` 的 `COURSES` | `sub`、`heroCopy`、`routeNote`、`mapNote`、`footNote` 里的模块数/关卡数/模块名 |
| `README.md` | "现有课程"表的关卡数、目录树的模块说明、"共 46 段"音频数 |
| 内容文件头部注释 | 模块名、id 范围、关卡数（如 "模块 0 · 起步上路（8 关）"） |
| `index.html` | 新增/删除模块时的 `<script>` 顺序与数量 |
| `content/cet4/mN-*.js` 头部 | 四级模块的 id 段说明（如 "模块 4 = 5xx"） |

## 8. 提交前检查清单

**内容正确性**

- [ ] `node --check` 通过（每个改过的 `content/*.js`）。
- [ ] `example.code` 真编译、真运行通过，`example.output` / `expectedOutput` 是真实输出。
- [ ] `solution` 能通过本关 `check`（最好用页面"检查代码"实测一遍）。
- [ ] `check` 能区分"正确写法"和"常见错误写法"（故意写错，确认会被拦下）。
- [ ] `questions` 的 `answer` 下标正确、`explain` 解释完整。
- [ ] 新 id 唯一、在所属模块 id 段内、数组位置 = 学习路线位置。
- [ ] 四级：`type` 与字段匹配；音频文件存在、`transcript` 与音频一致；`points` 分组合理。

**站点不回归**

- [ ] 双击 `index.html` 能打开；控制台无报错、无 404。
- [ ] 首页课程卡数量/关卡数与路线页一致；两门课切换正常。
- [ ] 新关卡可解锁、可答题、可通关；通关后学习点/进度条/总结页数字正确。
- [ ] 玻璃 UI 与星空 UI 两种模式都能正常显示/进入关卡。
- [ ] 手机宽度（约 390×844）下不重叠、不遮挡。


**收尾**

- [ ] 没有改动与本次内容无关的代码/样式/版权文本。
- [ ] 数量文案已同步（第 7 节）。
- [ ] 不提交 `.verify/` 报告目录、截图、临时文件。

## 9. 常见错误速查

| 现象 | 可能原因 |
| --- | --- |
| 页面白屏 / 控制台 SyntaxError | 内容文件语法错误（少逗号/引号不配对，或误用 `import/export`） |
| 新关卡不出现 | 忘了在 `index.html` 加 `<script>`；或模块对象没 `push` 进 `window.C_MODULES / CET4_MODULES` |
| 关卡顺序不对 | 四级模块的 `<script>` 顺序放错（路线顺序 ≠ 文件名顺序） |
| 老用户进度错乱 | 改了已有 `id` 或在中部插入关卡导致后续 id 偏移 |
| "检查代码"总是不过 | `check` 规格过严/写错 token 序列；先对照 `example.code` 的 token 顺序 |
| "运行结果比对"总是不一致 | `expectedOutput` 有行尾空格/空行差异（比对会忽略行尾空格与首尾空行，但中间行必须一致）；或作者输出不是真实运行结果 |
| 音频不响 / 404 | `file` 写错、文件没放 `assets/audio/cet4/`、大小写不一致 |
| 四级写作/翻译永远不过 | `points` 组内关键词写得太窄 / `minWords` 太高 / 客观题没达标 |
| 手机端元素重叠 | 样式改动没考虑 `css/07-mobile-patch.css` 与 `06-fps.css` 的手机端规则 |
| 页面在 `file://` 下不可用 | 引入了 fetch / ES Module / 绝对路径（必须以 `./` 相对路径引用） |
