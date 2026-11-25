/* ============================================================================
 * 07-project-and-summary.js — 7 天小作品支线（控制台记账本）、我的总结页、关卡入口 openLevel / 答题奖励
 * 加载顺序 7/12：按编号顺序加载
 * 注意：本站是经典 <script>（非 ES Module），所有 js/ 文件共享同一个全局作用域，
 *       编号即加载顺序；调整顺序或拆合并文件前请先读 docs/ARCHITECTURE.md。
 * ========================================================================== */
/* ==== 7 天小作品支线：控制台记账本 ==== */
var PROJECT_KEY="cquest.project.v1";
var PROJECT_DAYS=[
 {d:1,title:"跑起来：能输入、能输出",goal:"写一个程序：输出一行欢迎语，再读入一个金额并原样打印出来。",
  learn:"第 01、03 关（程序结构、输入输出）",code:'#include <stdio.h>\n\nint main(void) {\n    double n;\n    printf("记账本 v0.1\\n请输入一笔金额：");\n    if (scanf("%lf", &n) != 1) { printf("输入无效\\n"); return 1; }\n    printf("已记录：%.2f\\n", n);\n    return 0;\n}',why:"这一步把「程序能和我对话」跑通，后面所有功能都建立在这上面。"},
 {d:2,title:"存住数据：循环与数组",goal:"把 5 笔金额存进数组，最后统一打印并算总和。",
  learn:"第 12–13 关（循环）+ 第 25 关（一维数组）",code:'#include <stdio.h>\n\nint main(void) {\n    double a[5];\n    int i;\n    for (i = 0; i < 5; i++) scanf("%lf", &a[i]);\n    double sum = 0;\n    for (i = 0; i < 5; i++) { printf("%.2f\\n", a[i]); sum += a[i]; }\n    printf("合计：%.2f\\n", sum);\n    return 0;\n}',why:"从「一次一笔」升级到「一次一批」，这是记账功能的地基。"},
 {d:3,title:"加分类：字符串与分支",goal:"每笔记录带一个分类（food/transport/other），并按分类统计金额。",
  learn:"第 09 关（分支）+ 第 28–29 关（字符串与 string.h）",code:'#include <stdio.h>\n#include <string.h>\n\nint main(void) {\n    char cat[5][12] = {"food","transport","other","food","other"};\n    double amt[5] = {12.5, 3, 28, 9.9, 15};\n    double sum[3] = {0,0,0};\n    for (int i = 0; i < 5; i++) {\n        if (strcmp(cat[i], "food") == 0) sum[0] += amt[i];\n        else if (strcmp(cat[i], "transport") == 0) sum[1] += amt[i];\n        else sum[2] += amt[i];\n    }\n    printf("food %.2f  transport %.2f  other %.2f\\n", sum[0], sum[1], sum[2]);\n    return 0;\n}',why:"账本的价值不在「记」而在「分得清」——分类统计是记账的第一步洞察。"},
 {d:4,title:"抽成函数：让代码不重复",goal:"把「计算汇总」和「打印清单」拆成两个函数，主函数只负责调度。",
  learn:"第 17–24 关（函数与程序结构）",code:'#include <stdio.h>\n\ndouble total(const double *a, int n) {\n    double s = 0;\n    for (int i = 0; i < n; i++) s += a[i];\n    return s;\n}\nvoid show(const double *a, int n) {\n    for (int i = 0; i < n; i++) printf("%d: %.2f\\n", i + 1, a[i]);\n    printf("合计：%.2f\\n", total(a, n));\n}\nint main(void) {\n    double a[3] = {10, 20.5, 5};\n    show(a, 3);\n    return 0;\n}',why:"函数拆分是可维护的分水岭：以后加功能只改一个地方。"},
 {d:5,title:"用指针操作数据",goal:"用指针遍历数组，实现「查找最大一笔支出」。",
  learn:"第 33–42 关（指针与内存）",code:'#include <stdio.h>\n\ndouble max_of(const double *a, int n) {\n    const double *p = a, *best = a;\n    for (int i = 0; i < n; i++, p++)\n        if (*p > *best) best = p;\n    return *best;\n}\nint main(void) {\n    double a[4] = {8, 30.5, 12, 45.2};\n    printf("最大一笔：%.2f\\n", max_of(a, 4));\n    return 0;\n}',why:"指针看着吓人，但它的用途很朴素：让函数高效地访问同一份数据。"},
 {d:6,title:"存在文件里：下次还在",goal:"把账本存进 accounts.txt，重新运行时读出来，追加新记录。",
  learn:"第 51–56 关（文件与输入输出）",code:'#include <stdio.h>\n\nint main(void) {\n    double n;\n    FILE *fp = fopen("accounts.txt", "a");\n    if (!fp) { printf("打不开文件\\n"); return 1; }\n    while (scanf("%lf", &n) == 1) fprintf(fp, "%.2f\\n", n);\n    fclose(fp);\n\n    double sum = 0, x;\n    fp = fopen("accounts.txt", "r");\n    if (!fp) { printf("读取文件失败\\n"); return 1; }\n    while (fscanf(fp, "%lf", &x) == 1) sum += x;\n    fclose(fp);\n    printf("全部合计：%.2f\\n", sum);\n    return 0;\n}',why:"程序从「跑完就忘」变成「有记忆」，这是工具的起点。"},
 {d:7,title:"最后一公里：做出能用的记账本",goal:"组合前 6 天，做出一个能循环输入、能查总额、能按分类统计的完整记账本，并处理输入错误。",
  learn:"综合运用 + 第 57–64 关（工程实践）",code:'#include <stdio.h>\n#include <string.h>\n\n#define MAXN 100\n\nstatic void clear_line(void) {\n    int ch;\n    while ((ch = getchar()) != \'\\n\' && ch != EOF) {}\n}\n\nint main(void) {\n    char cats[MAXN][16];\n    double amt[MAXN];\n    int n = 0;\n    char op[16];\n    while (scanf("%15s", op) == 1) {\n        if (strcmp(op, "add") == 0 && n < MAXN) {\n            if (scanf("%lf %15s", &amt[n], cats[n]) != 2) {\n                printf("格式错误，示例：add 18.5 food\\n");\n                clear_line();\n                continue;\n            }\n            n++;\n            printf("已记录 %d 笔\\n", n);\n        } else if (strcmp(op, "list") == 0) {\n            for (int i = 0; i < n; i++) printf("%d) %.2f [%s]\\n", i + 1, amt[i], cats[i]);\n        } else if (strcmp(op, "total") == 0) {\n            double s = 0;\n            for (int i = 0; i < n; i++) s += amt[i];\n            printf("合计：%.2f\\n", s);\n        } else if (strcmp(op, "cat") == 0) {\n            char target[16];\n            double s = 0;\n            if (scanf("%15s", target) != 1) { clear_line(); continue; }\n            for (int i = 0; i < n; i++) if (strcmp(cats[i], target) == 0) s += amt[i];\n            printf("[%s] 合计：%.2f\\n", target, s);\n        } else if (strcmp(op, "quit") == 0) break;\n        else { printf("未知命令（支持 add / list / total / cat / quit）\\n"); clear_line(); }\n    }\n    return 0;\n}',why:"到这里你已拥有一个真正能用的程序：可以自己用，也可以给同学看。"}
];
function loadProject(){try{var o=JSON.parse(localStorage.getItem(PROJECT_KEY)||"{}");o.done=o.done||{};return o}catch(e){return {done:{}}}}
function saveProject(o){try{localStorage.setItem(PROJECT_KEY,JSON.stringify(o))}catch(e){}}
function projectProgress(){var o=loadProject(),n=0;PROJECT_DAYS.forEach(function(x){if(o.done[x.d])n++});return n}
function renderProject(){
 var o=loadProject(),fin=projectProgress();
 var cards=PROJECT_DAYS.map(function(p){
  var done=!!o.done[p.d];
  return '<article class="proj-card'+(done?" done":"")+'">'
   +'<div class="proj-head"><span class="proj-day">Day '+p.d+'</span><span class="proj-state">'+(done?"✓ 已完成":"待完成")+'</span></div>'
   +'<h3>'+esc(p.title)+'</h3>'
   +'<p class="proj-goal">'+esc(p.goal)+'</p>'
   +'<div class="proj-meta">对应课程：'+esc(p.learn)+'</div>'
   +'<details class="proj-detail"><summary>展开可运行示例与说明</summary>'
   +'<div class="proj-why">'+esc(p.why)+'</div>'
   +'<div class="codebox"><div class="codebar"><span class="dots"><i></i><i></i><i></i></span><span>day'+p.d+'.c</span></div><pre>'+highlightC(p.code)+'</pre></div>'
   +'</details>'
   +'<div class="exercise-actions"><button class="btn '+(done?"btn-ghost":"btn-primary")+' btn-small" data-action="proj-toggle" data-day="'+p.d+'">'+(done?"撤销完成":"标记今天完成")+'</button></div>'
   +'</article>';
 }).join("");
 document.getElementById("view").innerHTML='<div class="page-header"><div><div class="eyebrow">做点真东西</div><h1>7 天，做出一个能用的记账本</h1>'
  +'<p class="subhead">每天一个 20 分钟的小任务，第 7 天你会拿到一个可以自己用、也能给同学看的控制台程序。不需要学完 86 关也能开始。</p></div>'
  +'<span class="chip">'+fin+' / 7 天完成</span></div>'
  +'<div class="proj-progress"><div class="daily-bar"><i style="width:'+Math.round(fin/7*100)+'%"></i></div></div>'
  +'<div class="proj-grid">'+cards+'</div>'
  +'<div class="panel" style="margin-top:16px"><div class="challenge-label">提示</div><p class="challenge-copy">每段示例都能直接编译运行；建议先跑通示例，再按自己的需求改。卡住时到反馈面板的交流群里问。</p></div>';
}

function renderSummary(){
 const done=completedCount(), pct=progressPct(), rate=data.attempts?Math.round(data.correct/data.attempts*100):0, finished=done===levels.length;
 let skills=groups.filter(function(g){return levels.some(function(l){return l.stage===g})}).map(function(g){const ls=levels.filter(function(l){return l.stage===g}), n=ls.filter(isDone).length;return '<div class="skill-row"><span>'+esc(g)+' <span style="color:#9aa5b5">('+n+'/'+ls.length+')</span></span><span class="skill-state">'+(n===ls.length?"已掌握":n?"学习中":"待开始")+'</span></div>'}).join("");
 document.getElementById("view").innerHTML='<div class="page-header"><div><div class="eyebrow">学习档案</div><h1>我的学习总结</h1><p class="subhead">记录每一步进步，也看看下一步可以做什么。</p></div><button class="btn btn-ghost btn-small" data-page="project">7 天项目（'+projectProgress()+'/7）</button><button class="btn btn-ghost btn-small" data-page="map">← 返回学习地图</button></div>'+
 '<div class="summary-grid"><div class="summary-hero"><div class="eyebrow" style="color:#dbe2ff">'+(finished?"学习旅程":"持续成长中")+'</div><h2>'+(finished?"恭喜你，完成全部关卡！":"你的每一次练习都在累积")+'</h2><p>'+(finished?(activeCourse==="c"?"你从程序结构出发，练习了类型、流程、函数、数组、字符串、指针、内存管理、文件、工程实践、数据结构与算法，并完成了综合项目。现在你可以用真实项目继续巩固。":"你走完了地基、听力、阅读、写作、翻译、口语与全真模考，掌握了应试与实用两套能力。接下来保持每周一套模考的节奏，把错题按题型归类复盘。")+"" :"完成 "+done+" 个关卡，已经覆盖 "+pct+"% 的学习路线。继续按自己的节奏前进，已学内容会自动保存在这台设备。")+'</p><div class="hero-actions"><button class="btn btn-primary" data-action="continue">'+(finished?"回顾毕业项目":"继续学习")+' →</button></div><div class="summary-emoji">'+(finished?"🎓":"✦")+'</div></div><div class="panel"><div class="challenge-head"><div class="challenge-label">成长数据</div><span class="chip">'+pct+'%</span></div><div class="stat" style="margin-bottom:9px"><div class="stat-icon">⚑</div><div><div class="stat-num">'+done+' / '+levels.length+'</div><div class="stat-label">已通关关卡</div></div></div><div class="stat" style="margin-bottom:9px"><div class="stat-icon">✦</div><div><div class="stat-num">'+data.xp+'</div><div class="stat-label">累计学习点</div></div></div><div class="stat"><div class="stat-icon">✓</div><div><div class="stat-num">'+rate+'%</div><div class="stat-label">知识快问正确率 · '+data.correct+'/'+data.attempts+'</div></div></div></div></div>'+
 '<div class="summary-grid" style="margin-top:18px"><section class="panel"><div class="challenge-head"><div class="challenge-label">技能地图</div><span class="chip">按模块回顾</span></div><div class="skill-list">'+skills+'</div></section><section class="panel"><div class="challenge-head"><div class="challenge-label">'+(finished?"下一阶段建议":"给未来自己的话")+'</div><span class="chip">'+(finished?"继续实践":"保持节奏")+'</span></div><p class="lesson-copy">'+(finished?(activeCourse==="c"?"把学到的内容组合成一个小项目：例如通讯录、命令行记账本或简易文本分析器。为函数补充错误处理、拆分头文件，并用 -Wall -Wextra 检查代码。":"找一段英文材料先裸听、再读原文、复述一遍、写下三句话总结；每周一套模考，把错题按题型归类。"):(activeCourse==="c"?"学编程不是背完所有语法，而是能用合适的工具把问题拆开。先把当前关卡做完，再回头复习卡住的知识点。":"语言能力靠积累：每天 20 分钟精听加跟读，比周末突击三小时更有效。先把当前关卡做完，再回头复习卡住的题型。"))+'</p><div class="takeaway"><div class="takeaway-item"><span class="tick">✓</span><span>'+(activeCourse==="c"?"代码在本机浏览器做结构检查，并可在本机编译运行比对输出":"听力与口语音频来自本地文件，可反复重听")+'</span></div><div class="takeaway-item"><span class="tick">✓</span><span>学习进度自动保存</span></div><div class="takeaway-item"><span class="tick">✓</span><span>可以随时回看已完成课程</span></div></div></section></div>'+
 '<div class="footer-note">'+esc(currentCourse().footNote)+'</div>';
}
function openLevel(id){const l=levels.find(function(x){return x.id===id});if(!l)return;if(!unlocked(l)&&!isDone(l)){toast("先完成上一关，就能解锁这里。");return}activeLevel=l;page="lesson";const quizDone=isDone(l)||!!data.quizRewards[l.id];selectedOption=quizDone?l.answer:null;quizPassed=quizDone;codePassed=isDone(l);hintVisible=false;solutionVisible=false;window.quizAnswered=quizDone;window.codeFeedback="";window.codeDraft=data.drafts[l.id]||"";window.taskState=(window.taskState&&window.taskState.levelId===l.id)?window.taskState:null;render()}
function awardForQuiz(){if(quizPassed){toast("这道题的奖励已经领取，不会重复加分。");return}data.attempts++;if(selectedOption===activeLevel.answer){quizPassed=true;const firstCorrect=!data.quizRewards[activeLevel.id];if(firstCorrect){data.quizRewards[activeLevel.id]=true;data.correct++;data.xp+=10;toast("答对了，学习点 +10")}else{toast("答对了，这道题的学习点已领取。")}save();if(codePassed)maybeComplete();}else{save();}window.quizAnswered=true;render()}
