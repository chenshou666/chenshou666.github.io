/* ============================================================================
 * 05-views.js — 页面渲染：render 路由、课程页、闯关地图、关于页、继续挑战页、C 语言关卡页
 * 加载顺序 5/13：按编号顺序加载
 * 注意：本站是经典 <script>（非 ES Module），所有 js/ 文件共享同一个全局作用域，
 *       编号即加载顺序；调整顺序或拆合并文件前请先读 docs/ARCHITECTURE.md。
 * ========================================================================== */

function ensureNextBar(){
 var v=document.getElementById("view");if(!v)return;
 if(!(page==="lesson"&&activeLevel&&isDone(activeLevel)))return;
 var bar=document.createElement("div");bar.className="next-bar";
 bar.innerHTML='<span class="nb-ok">✓ 本关已通关</span><div class="nb-actions"><button class="btn btn-primary btn-small" data-action="continue">下一关&nbsp; →</button><button class="btn btn-ghost btn-small" data-page="map">返回路线</button></div>';
 v.appendChild(bar);
}
var __lastViewKey="";
function render(){
 var __v=document.getElementById("view");
 var __k=page+"|"+activeCourse+"|"+(activeLevel?activeLevel.id:"");
 var __changed=__k!==__lastViewKey;__lastViewKey=__k;
 if(__v&&__changed){__v.classList.remove("view-enter");void __v.offsetWidth;__v.classList.add("view-enter");
  var __tb=document.querySelector(".topbar");if(__tb){__tb.classList.remove("title-enter");void __tb.offsetWidth;__tb.classList.add("title-enter")}}
 navTitle();document.getElementById("xpTop").textContent=data.xp;document.querySelectorAll(".nav-btn").forEach(function(b){b.classList.toggle("active",b.dataset.page===page)});if(activeLevel){renderLesson();ensureNextBar();return}if(page==="courses")renderCourses();else if(page==="map")renderMap();else if(page==="practice")renderPractice();else if(page==="about")renderAbout();else if(page==="project")renderProject();else{renderSummary();ensureProgressTools()}}
function renderCourses(){
 const cards=COURSES.map(function(c){
  const ls=courseLevels[c.id]||[],st=stores[c.id],dn=Object.keys(st.completed).length,pc=ls.length?Math.round(dn/ls.length*100):0,ready=ls.length>0;
  const groups2=courseGroups[c.id]||[];
  return '<button class="course-card'+(ready?"":" is-soon")+'" type="button" data-action="switch-course" data-course="'+c.id+'"><span class="course-card-icon">'+c.glyph+'</span><span class="course-card-body"><strong>'+esc(c.name)+'</strong><small>'+esc(c.sub)+'</small><span class="course-card-meta">'+(ready?(groups2.length+" 个模块 · "+ls.length+" 关 · 已完成 "+dn+" 关（"+pc+"%）"):"即将上线")+'</span><span class="course-card-bar"><i style="width:'+pc+'%"></i></span></span><span class="course-card-go">进入 →</span></button>';
 }).join("");
 document.getElementById("view").innerHTML='<div class="page-header"><div><div class="eyebrow">HT LAB</div><h1>学习课程</h1><p class="subhead">选一门课开始闯关。每门课的进度、学习点与总结各自独立保存，互不影响。</p></div></div><div class="course-cards">'+cards+'</div><div class="footer-note">所有学习数据只保存在这台设备的浏览器里，不上传、不跨设备同步。</div>';
}
function renderMap(){
 const pct=progressPct(), done=completedCount(), next=nextLevel();
 let groupsHtml="";
 groups.forEach(function(g){const ls=levels.filter(function(l){return l.stage===g});const finished=ls.filter(isDone).length;groupsHtml+='<section class="track"><div class="track-head"><span class="track-dot"></span><span class="track-title">'+esc(g)+'</span><span class="track-note">'+finished+'/'+ls.length+' 关完成</span></div><div class="level-grid">';
 ls.forEach(function(l){const lockedNow=!unlocked(l)&&!isDone(l),number=String(levels.indexOf(l)+1).padStart(2,"0");const state=isDone(l)?"✓":lockedNow?"🔒":"→";groupsHtml+='<article class="level-card '+(isDone(l)?"completed ":"")+(lockedNow?"locked":"")+'" data-level="'+l.id+'"><div class="level-top"><span class="level-num">'+number+'</span><span class="level-state">'+state+'</span></div><h3>'+esc(l.title)+'</h3><p>'+esc(l.gist)+'</p><div class="level-meta">第 '+number+' 关 · 约 '+l.minutes+' 分钟 · '+(isDone(l)?"已通关":lockedNow?"完成前一关后解锁":"可开始")+'</div></article>'});
 groupsHtml+='</div></section>'});
 const cc=currentCourse();
 document.getElementById("view").innerHTML='<div class="page-header"><div><div class="eyebrow">'+esc(cc.name)+'</div><h1>'+esc(cc.name)+'学习路线</h1><p class="subhead">'+esc(cc.sub)+'</p></div><button class="btn btn-ghost btn-small" data-page="courses">← 返回课程选择</button></div>'+'<section class="hero"><div class="hero-main"><div class="eyebrow">HT LAB&nbsp; · &nbsp;'+esc(cc.name)+'</div><h1>'+cc.heroTitle+'</h1><p>'+esc(cc.heroCopy)+'</p><div class="hero-actions"><button class="btn btn-primary" data-action="continue">'+(done?"继续第 "+(next.id)+" 关":"开始第一关")+' <span>→</span></button><span class="hero-link">学一点，过一关，积累成就感</span></div></div><div class="hero-progress"><div class="progress-top"><div><div class="progress-kicker">'+esc(cc.name)+'进度</div><div class="progress-number">'+done+' <span style="font-size:14px;color:#8d99ab;font-weight:600">/ '+levels.length+' 关</span></div></div><div class="progress-ring" style="--pct:'+pct+'%"><span>'+pct+'%</span></div></div><div><div class="progress-bar"><i style="width:'+pct+'%"></i></div><div class="progress-foot"><span>已完成 '+done+' 关</span><span>'+Math.max(0,levels.length-done)+' 关待挑战</span></div></div></div></section>'+
 '<section class="stats"><div class="stat"><div class="stat-icon">✦</div><div><div class="stat-num">'+data.xp+'</div><div class="stat-label">学习点数</div></div></div><div class="stat"><div class="stat-icon">⚑</div><div><div class="stat-num">'+done+'</div><div class="stat-label">完成关卡</div></div></div><div class="stat"><div class="stat-icon">✓</div><div><div class="stat-num">'+data.correct+'</div><div class="stat-label">正确答题</div></div></div><div class="stat"><div class="stat-icon">⌁</div><div><div class="stat-num">'+(data.attempts?Math.round(data.correct/data.attempts*100):0)+'%</div><div class="stat-label">答题正确率</div></div></div></section>'+
 '<div class="section-head"><div><h2>'+esc(cc.name)+' · 通关地图</h2><p>'+esc(cc.mapNote)+'</p></div><button class="btn btn-ghost btn-small" data-page="summary">查看学习总结&nbsp; →</button></div>'+'<section class="course-route" id="course-route"><div class="course-route-heading"><div class="course-route-heading-main"><span class="course-route-icon">'+cc.glyph+'</span><div><h2>'+esc(cc.name)+'学习路线</h2><p>'+esc(cc.routeNote)+' · '+levels.length+' 个知识关卡</p></div></div><span class="chip">'+esc(cc.chip)+'</span></div>'+groupsHtml+'</section><div class="footer-note">'+esc(cc.footNote)+'</div>';
}
function renderAbout(){
 const items=[
  ["用途","本网站是个人自学与教学演示项目。站内的讲解、题目、示例代码与音频都是自编的学习材料，不是官方教材，也不是历年真题。你可以自由用来学习。"],
  ["考试相关","英语四级部分的题目与音频是按大纲自编的仿真材料，题型与难度不等同于真实考试；通过本站关卡不代表能通过相应考试，也不构成任何考试、升学或就业承诺。"],
  ["代码与运行","C 课程的示例与标准答案在 TDM-GCC 4.9.2（Dev-C++ 自带）下以 -std=c11 -Wall -Wextra 验证过。站内的代码检查是轻量结构检查，不等同于编译器，最终请以你本机编译器的结果为准；涉及 sizeof、地址等平台相关数值的关卡，换平台结果可能不同。"],
  ["数据与隐私","本站不收集、不上传任何数据，也不联网同步。学习进度、代码草稿与录音只保存在本机浏览器（localStorage / 内存）。清除浏览器数据、更换浏览器或设备会导致进度丢失，本站不为此承担责任。"],
  ["内容准确性","内容经过脚本校验、真编译真运行与多轮独立复核，但仍可能存在错误、过时或表述不严谨之处；发现后欢迎反馈修正。"],
  ["责任","本站按「现状」提供，不提供任何明示或暗示的担保（包括但不限于适销性与特定用途适用性）。因使用或无法使用本站内容而造成的任何直接或间接损失，作者不承担责任。"],
  ["版权与名称","Copyright © 2026 HT Lab. 保留所有权利。\u300cHT Lab\u300d名称、HT 字标、站点图标（ht-lab.ico / favicon.svg）与整体视觉设计是作者的标识性资产，不属于免费使用范围；未经事先书面许可，不得把它们用于任何其他项目、产品或服务，也不得以「HT Lab」名义发布或宣传任何内容（包括修改版）。"],
  ["免费使用的范围","本站免费供**个人学习**使用：你可以访问、在本机运行、按课程练习，也可以把链接分享给他人；在笔记、作业、博客里引用少量内容并注明「HT Lab」出处也可以。除此之外的权利均予保留。"],
  ["禁止的事项","未经作者事先书面许可，不得：① 复制、修改、演绎本站内容后发布或分发（包括改一改再发布、换个名字再发布）；② 将本站内容用于任何商业目的（售卖、付费课程、付费社群、培训收费、广告变现、随产品捆绑、企业内部培训、印刷出版）；③ 去除或隐藏版权、免责声明、名称与图标后使用；④ 使用「HT Lab」名称/字标/图标或高度相似的视觉设计；⑤ 以「HT Lab」名义发布任何内容；⑥ 将本站内容用于训练机器学习模型或构建面向公众的商业数据集。"],
  ["需要单独授权","商业使用、机构或课堂教学、二次开发与再分发、全文转载、贴牌定制、商业合作——请先联系作者取得书面许可。"],
  ["联系方式与授权","授权、合作或内容反馈：优先加文末「反馈与建议」里的交流群；技术用户也可以在 GitHub 仓库提 Issue（github.com/chenshou666/chenshou666.github.io/issues，国内访问可能不稳定）。本站会持续更新，最新许可文本以仓库中的 LICENSE 文件为准。"]
 ];
 const body=items.map(function(x){return '<section class="panel" style="margin-bottom:14px"><div class="challenge-head"><div class="challenge-label">'+esc(x[0])+'</div></div><p class="lesson-copy">'+esc(x[1])+'</p></section>'}).join("");
 document.getElementById("view").innerHTML='<div class="page-header"><div><div class="eyebrow">HT LAB</div><h1>关于 / 免责 / 版权与许可</h1><p class="subhead">本站免费供个人学习使用；名称、图标与内容版权归作者所有，禁止商用与修改后分发。</p></div><button class="btn btn-ghost btn-small" data-page="courses">← 返回学习课程</button></div>'+body+'<section class="panel feedback-panel"><div class="challenge-head"><div class="challenge-label">反馈与建议</div><span class="chip">欢迎</span></div>'+'<p class="lesson-copy">内容会按大家的建议继续增加；使用中觉得哪里不好用、哪里有错、想加什么内容，都可以直接告诉作者。</p>'+'<div class="feedback-actions">'+(CONTACT_QQ_GROUP?'<button class="btn btn-primary btn-small" data-action="copy-qq-group">复制交流群号：'+esc(CONTACT_QQ_GROUP)+'</button>':''+'<span class="feedback-soon">交流群正在筹备中，稍后在本页公布</span>')+'<a class="btn btn-ghost btn-small" href="https://github.com/chenshou666/chenshou666.github.io/issues" target="_blank" rel="noopener">在 GitHub 提 Issue（国内可能打不开）</a>'+'</div>'+'<div class="hint feedback-hint">在 QQ 里搜索群号即可加入；加群请说明来意（学习 / 反馈问题）。遇到内容错误，说清楚是哪一关、哪一段，方便快速修正。</div></section>'+'<div class="footer-note">最后更新：2026-10-26 · Copyright © 2026 HT Lab · 免费供个人学习使用，禁止商用与修改后分发 · 完整条款见仓库 LICENSE 文件</div>';
}
function renderPractice(){
 const l=nextLevel();
 if(completedCount()===levels.length){page="summary";renderSummary();navTitle();return}
 document.getElementById("view").innerHTML='<div class="page-header"><div><div class="eyebrow">实战训练</div><h1>继续你的下一关</h1><p class="subhead">'+esc(activeCourse==="c"?"专注一件小事，写出一段自己的 C 代码。":"专注一个场景，练一段听说读写。")+'</p></div><span class="chip">当前 '+completedCount()+' / '+levels.length+' 关</span></div><div class="panel"><div class="lesson-title-row"><div class="lesson-badge">'+String(l.id).padStart(2,"0")+'</div><div><h2>'+esc(l.title)+'</h2><div class="meta-line">'+esc(l.stage)+' · 约 '+l.minutes+' 分钟</div></div></div><p class="lesson-copy" style="margin-top:19px">'+fmtInline(l.gist)+'</p><p class="lesson-copy">'+fmtLesson(l.lesson)+'</p><button class="btn btn-primary" data-level="'+l.id+'">进入本关 <span>→</span></button></div>';
}
function renderLesson(){
 const l=activeLevel,done=isDone(l);
 if(l.type&&l.type!=="code"){renderEnglishLesson(l);return}
 renderCodeLesson(l,done);
}
function renderCodeLesson(l,done){
 const qs=l.questions||[];
 const st=qs.length?ensureTaskState(l):null;
 const quizOk=cQuizOk(l),outOk=cOutputOk(l);
 const code=l.example&&l.example.code?l.example.code:(l.sample||"");
 const out=l.example&&l.example.output?l.example.output:"";
 const exExplain=l.example&&l.example.explain?l.example.explain:"";
 const need=qs.length?Math.ceil((l.passRatio||0.8)*qs.length):0;
 let quizHtml="";
 if(qs.length){
  quizHtml='<section class="panel challenge-card"><div class="challenge-head"><div class="challenge-label"><span style="color:#6176ed">✦</span>知识快问</div><span class="chip">答对 '+need+' / '+qs.length+' 题</span></div>'+(l.quizCopy?'<p class="challenge-copy">'+esc(l.quizCopy)+'</p>':"")+qs.map(function(q,i){return questionBlock(q,i,l,st)}).join("")+(st.score?'<div class="feedback '+(quizOk?"ok":"no")+'">本次答对 '+st.score.right+' / '+st.score.total+'（需答对 '+need+' 题）</div>':"")+(st.score&&!quizOk?'<div class="exercise-actions"><button class="btn btn-soft btn-small" data-action="retry-task">重做本关题目</button></div>':"")+'</section>';
 }else if(l.quiz){
  const opts=(l.options||[]).map(function(o,i){let cl="option";if(selectedOption===i){cl+=" selected";if(quizPassed)cl+=" correct";else if(window.quizAnswered)cl+=" wrong"}return '<button class="'+cl+'" data-option="'+i+'">'+String.fromCharCode(65+i)+'. '+esc(o)+'</button>'}).join("");
  quizHtml='<section class="panel challenge-card"><div class="challenge-head"><div class="challenge-label"><span style="color:#6176ed">✦</span>知识快问</div><span class="chip">答对 +10 点</span></div><div class="quiz-question">'+esc(l.quiz)+'</div><div class="option-list">'+opts+'</div>'+(window.quizAnswered?'<div class="feedback '+(quizPassed?"ok":"no")+'">'+(quizPassed?"回答正确！":"再想一想。 ")+esc(l.explain||"")+'</div>':"")+'</section>';
 }
 const exampleHtml=code?'<section class="panel"><div class="challenge-head"><div class="challenge-label"><span style="color:#6176ed">▤</span>示例代码</div><span class="chip">建议自己敲一遍</span></div><div class="codebox"><div class="codebar"><span class="dots"><i></i><i></i><i></i></span><span>example.c</span></div><pre>'+highlightC(code)+'</pre></div>'+(out?'<div class="challenge-label" style="margin:14px 0 6px">这段代码的运行结果</div><div class="codebox"><div class="codebar"><span class="dots"><i></i><i></i><i></i></span><span>运行输出</span></div><pre>'+esc(out)+'</pre></div>':"")+(exExplain?'<p class="lesson-copy" style="margin-top:13px">'+fmtLesson(exExplain)+'</p>':"")+'</section>':"";
 const pitHtml=(l.pitfalls&&l.pitfalls.length)?'<section class="panel"><div class="challenge-head"><div class="challenge-label"><span style="color:#e2725b">⚠</span>常见陷阱</div><span class="chip">先躲开这些</span></div>'+l.pitfalls.map(function(p){return '<div class="takeaway-item" style="margin:9px 0"><span style="color:#e2725b;font-weight:800">!</span><span>'+fmtInline(p)+'</span></div>'}).join("")+'</section>':"";
 const masteryHtml=(l.mastery&&l.mastery.length)?'<section class="panel"><div class="challenge-head"><div class="challenge-label">掌握标准</div><span class="chip">学完你应该能做到</span></div>'+l.mastery.map(function(m){return '<div class="takeaway-item" style="margin:9px 0"><span class="tick">✓</span><span>'+fmtInline(m)+'</span></div>'}).join("")+'</section>':"";
 const runHtml=l.expectedOutput?'<section class="panel challenge-card exercise"><div class="challenge-head"><div class="challenge-label"><span style="color:#6176ed">▶</span>运行结果比对</div><span class="chip">'+(outOk?"已一致":"待比对")+'</span></div><p class="challenge-copy">把上面这段程序（或你自己写的版本）在本机编译运行——Dev-C++ 按 F11 编译运行，命令行用 gcc 文件名.c -o 程序名 再运行——然后把程序输出的内容<strong>原样</strong>粘贴到下面。逐行对比一致才算通过，行尾空格可以忽略。</p><div class="challenge-label" style="margin:10px 0 6px">预期输出</div><div class="codebox"><div class="codebar"><span class="dots"><i></i><i></i><i></i></span><span>expected output</span></div><pre>'+esc(l.expectedOutput)+'</pre></div><textarea class="task-input" id="runOutput" spellcheck="false" style="min-height:110px" placeholder="在这里粘贴你运行时看到的输出…">'+esc((data.runOutputs&&data.runOutputs[l.id])||"")+'</textarea><div class="exercise-actions"><button class="btn btn-primary btn-small" data-action="check-output">比对运行结果</button></div>'+((data.runOutputs&&data.runOutputs[l.id])?'<div class="feedback '+(outOk?"ok":"no")+'">'+(outOk?"✓ ":"✗ ")+esc(compareOutput(l.expectedOutput,data.runOutputs[l.id]).message)+'</div>':"")+'</section>':"";
 const gate=(ok,label)=>'<div class="takeaway-item"><span class="'+(ok?"tick":"")+'">'+(ok?"✓":"○")+'</span><span>'+label+'</span></div>';
 const sidebar='<aside class="lesson-main"><section class="panel"><div class="challenge-head"><div class="challenge-label">本关通关条件</div><span class="chip">'+(done?"已完成":"待完成")+'</span></div><div class="takeaway">'+gate(done||quizOk,qs.length?("知识快问答对 "+need+" 题以上"):"答对知识快问")+gate(done||codePassed,"代码通过结构检查")+(l.expectedOutput?gate(done||outOk,"运行结果与预期一致"):"")+gate(done,"获得学习点并解锁下一关")+'</div><div class="progress-bar" style="margin-top:18px"><i style="width:'+((Number(done||quizOk)+Number(done||codePassed)+Number(!l.expectedOutput||done||outOk))/(l.expectedOutput?3:2)*100)+'%"></i></div></section>'+masteryHtml+'<section class="panel"><div class="challenge-head"><div class="challenge-label">核心要点</div><span class="chip">速览</span></div>'+l.takeaways.map(function(t){return '<div class="takeaway-item" style="margin:10px 0"><span class="tick">✓</span><span>'+fmtInline(t)+'</span></div>'}).join("")+'</section><section class="panel"><div class="challenge-label" style="margin-bottom:10px">学习路线</div><div style="font-size:12px;color:#8490a2">'+completedCount()+' / '+levels.length+' 关完成</div><div class="progress-bar"><i style="width:'+progressPct()+'%"></i></div><button class="btn btn-ghost btn-small" data-page="map">查看全部关卡</button></section></aside>';
 const challengeFeedback=window.codeFeedback?'<div class="feedback '+(codePassed?"ok":"no")+'">'+esc(window.codeFeedback)+'</div>':"";
 const lockMsg=done?'<div class="feedback ok">本关已通关。可以回看内容，也可以继续下一关。</div>':"";
 document.getElementById("view").innerHTML='<div class="page-header"><div><div class="eyebrow">'+esc(l.stage||l.module||"")+' · 第 '+String(l.id).padStart(2,"0")+' 关</div><h1>'+esc(l.title)+'</h1><p class="subhead">'+esc(l.gist)+'</p></div><button class="btn btn-ghost btn-small" data-action="back">← 返回路线</button></div>'+
 '<div class="lesson-layout"><div class="lesson-main"><section class="panel"><div class="lesson-title-row"><div class="lesson-badge">学</div><div><h2>本关知识点</h2><div class="meta-line">建议用时 '+l.minutes+' 分钟 · 读透原理再动手写</div></div></div><p class="lesson-copy" style="margin:18px 0">'+fmtLesson(l.lesson)+'</p>'+renderBeginnerGuide(l)+'<div class="takeaway" style="margin-top:16px">'+l.takeaways.map(function(t){return '<div class="takeaway-item"><span class="tick">✓</span><span>'+fmtInline(t)+'</span></div>'}).join("")+'</div></section>'+
 exampleHtml+pitHtml+quizHtml+
 '<section class="panel challenge-card exercise"><div class="challenge-head"><div class="challenge-label"><span style="color:#6176ed">⌘</span>代码挑战</div><span class="chip">完成 +30 点</span></div><p class="challenge-copy">'+esc(l.mission)+'</p>'+editorMarkup(window.codeDraft||l.starter||"")+'<div class="exercise-actions"><button class="btn btn-soft btn-small" data-action="insert-template">插入 main 框架</button><button class="btn btn-primary btn-small" data-action="check-code">检查代码</button><button class="btn btn-ghost btn-small" data-action="hint">'+(hintVisible?"收起提示":"查看提示")+'</button><button class="btn btn-ghost btn-small" data-action="toggle-solution">'+(solutionVisible?"收起标准答案":((done||answerUnlocked)?"查看标准答案":"🔒 查看标准答案"))+'</button>'+(done?'<button class="btn btn-primary btn-small" data-action="continue">下一关 →</button>':"")+'</div>'+(hintVisible?'<div class="hint">提示：'+esc(l.hint)+'<br><span style="color:#a0a9b7">本地检查会按真实 C 语法核对括号、分号、语句结构，再核对本关要求的写法；注释和字符串里的关键词不算通过。它不等同于编译器，写完请务必在本机编译运行一次。</span></div>':"")+(solutionVisible?'<div class="codebox" style="margin-top:13px"><div class="codebar"><span class="dots"><i></i><i></i><i></i></span><span>answer.c · 标准答案</span><button class="btn btn-soft btn-small" style="padding:4px 9px;font-size:10px" type="button" data-action="copy-solution">复制答案</button></div><pre>'+highlightC(l.solution||"")+'</pre><div class="hint">标准答案仅供参考——建议先自己写完并通过检查，再看答案对照。</div></div>':"")+challengeFeedback+lockMsg+'</section>'+runHtml+'</div>'+sidebar+'</div><div class="footer-note">'+esc(currentCourse().footNote)+'</div>';
 startTaskTimer(l);
}
