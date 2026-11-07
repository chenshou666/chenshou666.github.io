/* ============================================================================
 * 01-course-registry.js — 课程注册表：把 content/c、content/cet4 的数据汇总成关卡列表，定义 COURSES 与进度存储键
 * 加载顺序 1/13：依赖：所有 content/*.js 已先加载，提供 window.C_MODULES / window.CET4_MODULES
 * 注意：本站是经典 <script>（非 ES Module），所有 js/ 文件共享同一个全局作用域，
 *       编号即加载顺序；调整顺序或拆合并文件前请先读 docs/ARCHITECTURE.md。
 * ========================================================================== */

const cModules=Array.isArray(window.C_MODULES)?window.C_MODULES:[];
const cLevels=[];
cModules.forEach(function(m){(m.levels||[]).forEach(function(l){l.course="c";l.module=m.name;l.stage=m.name;cLevels.push(l)})});
const cGroups=cModules.map(function(m){return m.name});;
cLevels.forEach(function(l){l.course="c";l.type="code"});
/* ===== 课程注册表：C 语言 + 英语四级（进度各自独立存储） ===== */
const COURSES=[
 {id:"c",name:"C 语言",glyph:"C",sub:"86 关吃透 C：语法 → 指针与内存 → 数据结构 → 工程实践 → 综合项目",store:"cquest.master.v1",chip:"核心课程",
  heroTitle:"动手实践，<br>写出你自己的程序。",
  heroCopy:"86 关，把 C 语言从第一行代码讲到能独立写项目：起步上路 8 关 + 流程控制 8 + 函数与程序结构 8 + 数组与字符串 8 + 指针与内存 10 + 自定义类型与数据结构 8 + 文件与输入输出 6 + 预处理器与工程实践 8 + 数据结构与算法 10 + 系统与底层 6 + 综合项目 6。每一关先讲透原理，再给可编译运行的示例，最后自己动手写：先过结构检查，再在本机编译运行、把真实输出粘回来做逐行比对（涉及 sizeof、地址等平台相关数值的关卡以结构检查为主）。",
  routeNote:"起步 → 流程控制 → 函数 → 数组与字符串 → 指针与内存 → 自定义类型 → 文件 → 工程实践 → 算法 → 系统底层 → 综合项目",
  mapNote:"每关：读讲解 → 看示例（可直接编译运行）→ 躲开常见陷阱 → 答知识快问 → 写代码并通过结构检查与运行结果比对。",
  footNote:"示例与标准答案均在 TDM-GCC 4.9（Dev-C++ 自带）下用 -std=c11 -Wall 编译验证；代码挑战在本机浏览器做结构检查，正式提交前请用编译器实际运行确认。｜内容仅供学习参考，详见「关于 / 许可」。Copyright © 2026 HT Lab，免费供个人学习使用，禁止商用与修改后分发。"},
 {id:"cet4",name:"英语四级",glyph:"英",sub:"听说读写 62 关 · 通关即具备上考场能力",store:"cquest.cet4.v1",chip:"四级全程",
  heroTitle:"听懂、说出口，<br>再把它写下来。",
  heroCopy:"从基础起步，62 关把听力、阅读、写作、翻译、口语一关一关练过去：地基 8 关 + 听力 12 + 阅读 14 + 写作 8 + 翻译 8 + 口语 10 + 全真模考 2。通关即具备上考场的能力，也能直接用在日常、校园、职场与出国场景。",
  routeNote:"地基 → 听力 → 阅读 → 写作 → 翻译 → 口语 → 全真模考",
  mapNote:"每关先学要点，再做听力/阅读题或写作/口语任务；通关后解锁下一站。",
  footNote:"题目为按四级大纲自编的仿真题；音频由语音合成生成，最终请以真题材料为准。｜通过课程不等于通过考试，详见「关于 / 许可」。Copyright © 2026 HT Lab，免费供个人学习使用，禁止商用与修改后分发。"}
];
const courseKey="cquest.course.v1";
const resetPasswordKey="codesword.reset.password.v1";
const themeKey="codesword.theme.v1";
const cet4Modules=Array.isArray(window.CET4_MODULES)?window.CET4_MODULES:[];
const cet4Levels=[];
cet4Modules.forEach(function(m){(m.levels||[]).forEach(function(l){l.course="cet4";l.module=m.name;l.stage=m.name;cet4Levels.push(l)})});
const cet4Groups=cet4Modules.map(function(m){return m.name});
const courseLevels={c:cLevels,cet4:cet4Levels};
const courseGroups={c:cGroups,cet4:cet4Groups};
function hasCourse(id){return !!(courseLevels[id]&&courseLevels[id].length)}
let activeCourse=localStorage.getItem(courseKey)||"c";
if(!hasCourse(activeCourse))activeCourse="c";
let levels=courseLevels[activeCourse],groups=courseGroups[activeCourse];
function courseById(id){return COURSES.filter(function(c){return c.id===id})[0]}
function currentCourse(){return courseById(activeCourse)||COURSES[0]}
