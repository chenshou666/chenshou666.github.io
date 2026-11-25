/* ============================================================================
 * 06-cet4-engine.js — 英语四级任务引擎：听力/阅读/写作/翻译/口语/模考；录音、判分、音频渲染
 * 加载顺序 6/12：按编号顺序加载
 * 注意：本站是经典 <script>（非 ES Module），所有 js/ 文件共享同一个全局作用域，
 *       编号即加载顺序；调整顺序或拆合并文件前请先读 docs/ARCHITECTURE.md。
 * ========================================================================== */
/* ==================== 英语四级任务引擎（听力/阅读/写作/翻译/口语） ==================== */
let recUrl=null,recorder=null,recChunks=[],recMime="audio/webm",taskTimer=null;
function stopTaskTimer(){if(taskTimer){clearInterval(taskTimer);taskTimer=null}}
function startTaskTimer(l){
 if(!l||!l.timeLimit)return;
 if(window.taskTimerLevel!==l.id){window.taskDeadline=Date.now()+l.timeLimit*60000;window.taskTimerLevel=l.id}
 if(taskTimer)return;
 taskTimer=setInterval(function(){
  const els=document.querySelectorAll(".task-timer-badge");
  if(!els.length){stopTaskTimer();return}
  const left=Math.max(0,window.taskDeadline-Date.now());
  const m=Math.floor(left/60000),s=Math.floor(left%60000/1000);
  const label=(left>0?"剩余 ":"时间到 ")+m+":"+String(s).padStart(2,"0");
  els.forEach(function(el){el.textContent=label});
  if(left<=0){stopTaskTimer();if(window.taskState)window.taskState.timeUp=true;if(activeLevel&&activeLevel.type==="mock"&&window.taskState&&!window.taskState.submitted){submitMock(true);return}render()}
 },1000);
}
function ensureTaskState(l){
 if(!window.taskState||window.taskState.levelId!==l.id){
  window.taskState={levelId:l.id,answers:(l.questions||[]).map(function(){return null}),score:null,passed:false,recordUrl:null,recordSkipped:false,checks:{},checkResult:null,submitted:false};
 }
 return window.taskState;
}
function completeTask(l){
 if(isDone(l))return false;
 data.completed[l.id]={at:Date.now()};data.xp+=30;save();
 playVictoryAnimation(l);
 if(completedCount()===levels.length){setTimeout(function(){activeLevel=null;page="summary";render()},950)}else{render()}
 return true;
}
function audioRow(a,idx,lid){
 const id="tr-"+lid+"-"+idx;
 return '<div class="audio-row"><div class="audio-head"><span class="audio-label">'+esc(a.label||"音频")+'</span>'+(a.voice?'<span class="chip chip-mini">'+esc(a.voice)+'</span>':"")+'<span class="audio-hint">'+esc(a.hint||"可反复重听")+'</span>'+(a.transcript?'<button class="btn btn-ghost btn-small" type="button" data-action="toggle-transcript" data-target="'+id+'">显示原文</button>':"")+'</div><audio controls preload="metadata" src="./assets/audio/cet4/'+esc(a.file)+'"></audio>'+(a.transcript?'<div class="transcript" id="'+id+'" hidden>'+esc(a.transcript)+'</div>':"")+'</div>';
}
function questionBlock(q,qi,l,st){
 const picked=st.answers[qi],answered=picked!==null&&picked!==undefined;
 const exam=l.type==="mock"&&!st.submitted;
 const opts=q.options.map(function(o,i){
  let cl="option";
  if(answered){
   if(exam){if(picked===i)cl+=" selected"}
   else{if(i===q.answer)cl+=" correct";else if(picked===i)cl+=" wrong"}
  }
  return '<button type="button" class="'+cl+'" data-q="'+qi+'" data-pick="'+i+'"'+((answered&&!exam)?" disabled":"")+'>'+String.fromCharCode(65+i)+'. '+esc(o)+'</button>';
 }).join("");
 const fb=(answered&&!exam)?'<div class="feedback '+(picked===q.answer?"ok":"no")+'">'+(picked===q.answer?"✓ 答对了":"✗ 正确答案是 "+String.fromCharCode(65+q.answer))+(q.explain?'　'+esc(q.explain):"")+'</div>':"";
 return '<div class="quiz-item"><div class="quiz-question">第 '+(qi+1)+' 题　'+esc(q.q)+'</div><div class="option-list">'+opts+'</div>'+fb+'</div>';
}
function submitMock(auto){
 const l=activeLevel;if(!l||!l.questions)return;
 const st=ensureTaskState(l);
 const answered=st.answers.filter(function(a){return a!==null&&a!==undefined}).length;
 if(!auto&&answered<l.questions.length&&!window.confirm("还有 "+(l.questions.length-answered)+" 题未作答，确定交卷？"))return;
 const right=st.answers.filter(function(a,i){return a===l.questions[i].answer}).length;
 st.score={right:right,total:l.questions.length};st.submitted=true;
 data.attempts+=l.questions.length;data.correct+=right;save();
 stopTaskTimer();
 if(right/l.questions.length>=(l.passRatio||0.8)){st.passed=true;completeTask(l);return}
 render();
}
function pickAnswer(qi,pi){
 const l=activeLevel;if(!l||!l.questions)return;
 const st=ensureTaskState(l);
 const exam=l.type==="mock"&&!st.submitted;
 if(exam){
  if(st.answers[qi]===pi)return;
  st.answers[qi]=pi;render();return;
 }
 if(st.answers[qi]!==null&&st.answers[qi]!==undefined)return;
 st.answers[qi]=pi;
 data.attempts++;if(pi===l.questions[qi].answer)data.correct++;save();
 const answered=st.answers.filter(function(a){return a!==null&&a!==undefined}).length;
 const needsTask=(l.type==="write"||l.type==="translate"||l.type==="speak"||l.type==="code");
 if(answered===l.questions.length){
  const right=st.answers.filter(function(a,i){return a===l.questions[i].answer}).length;
  st.score={right:right,total:l.questions.length};
  const ratioOk=right/l.questions.length>=(l.passRatio||0.8);
  if(!needsTask&&ratioOk){st.passed=true;completeTask(l);return}
  if(l.type==="code"&&ratioOk&&typeof cReady==="function"&&cReady(l)){maybeComplete();return}
  if((l.type==="write"||l.type==="translate")&&ratioOk&&st.checkResult&&st.checkResult.ok){st.passed=true;completeTask(l);return}
  if(l.type==="speak"&&ratioOk){
   const list=l.checklist||[];
   const allChecked=list.length&&list.every(function(_,i){return st.checks["c"+i]});
   if(allChecked&&(st.recordUrl||st.recordSkipped)){st.passed=true;completeTask(l);return}
  }
 }
 render();
}
function toggleSelfCheck(key){
 const l=activeLevel;if(!l)return;
 const st=ensureTaskState(l);st.checks[key]=!st.checks[key];
 const list=l.checklist||[];
 const allChecked=list.length&&list.every(function(_,i){return st.checks["c"+i]});
 const qs=l.questions||[];
 const qsDone=!qs.length||questionsRatioOk(l,st);
 const rec=(st.recordUrl||st.recordSkipped);
 if(allChecked&&rec&&qsDone){st.passed=true;completeTask(l);return}
 if(allChecked&&rec&&!qsDone){render();toast("跟读与自评完成了，客观题还没达标，先把上面的题目做对。");return}
 render();
}
function normQuotes(s){
 return String(s||"").replace(/[’‘]/g,"'").replace(/[“”]/g,'"');
}
function keyHit(low,k){
 const kk=normQuotes(k).toLowerCase();
 if(/^[a-z][a-z'-]*\*$/.test(kk)){
  const stem=kk.slice(0,-1).replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
  return new RegExp("\\b"+stem+"[a-z'-]*\\b").test(low);
 }
 if(/^[a-z][a-z'-]*$/.test(kk)){
  return new RegExp("\\b"+kk.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"\\b").test(low);
 }
 return low.indexOf(kk)>=0;
}
function gradeText(l,text){
 const t=(text||"").trim();
 const words=t?(t.match(/[A-Za-z][A-Za-z'’-]*/g)||[]).length:0;
 const low=normQuotes(t).toLowerCase();
 const pts=(l.points||[]).map(function(g){
  const keys=Array.isArray(g)?g:[g];
  return {label:keys[0].replace(/\*$/,""),hit:keys.some(function(k){return keyHit(low,k)})};
 });
 const min=l.minWords||0;
 const max=l.maxWords||0;
 return {words:words,pts:pts,min:min,max:max,overMax:!!(max&&words>max),ok:words>=min&&pts.every(function(p){return p.hit})};
}
function questionsRatioOk(l,st){
 const qs=l.questions||[];if(!qs.length)return true;
 const done=st.answers.filter(function(a){return a!==null&&a!==undefined}).length;
 if(done<qs.length)return false;
 const right=st.answers.filter(function(a,i){return a===l.questions[i].answer}).length;
 st.score={right:right,total:qs.length};
 return right/qs.length>=(l.passRatio||0.8);
}
function retryTask(){
 const l=activeLevel;if(!l)return;
 const st=ensureTaskState(l);
 st.answers=(l.questions||[]).map(function(){return null});
 st.score=null;st.checkResult=null;st.submitted=false;st.checks={};st.timeUp=false;
 window.taskDeadline=null;window.taskTimerLevel=null;stopTaskTimer();
 render();toast("已重置本关作答，可以重新做一遍。");
}
function checkWrittenTask(){
 const l=activeLevel;if(!l)return;
 const ta=document.getElementById("taskAnswer");if(!ta)return;
 data.drafts[l.id]=ta.value;save();
 const st=ensureTaskState(l);st.checkResult=gradeText(l,ta.value);
 if(st.checkResult.ok&&questionsRatioOk(l,st)){st.passed=true;completeTask(l);return}
 render();
 if(st.checkResult.ok)toast("实操部分通过了，但客观题还没达标，先把上面的题目做对。");
 else toast("还差一点，按下方提示补齐要点再来。");
}
function startRecorder(){
 const l=activeLevel;if(!l)return;
 if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){toast("当前浏览器不支持录音，可直接跟读自评。");return}
 navigator.mediaDevices.getUserMedia({audio:true}).then(function(stream){
  var recLevel=activeLevel;
  recChunks=[];recorder=new MediaRecorder(stream);recMime=recorder.mimeType||"audio/webm";
  recorder.ondataavailable=function(e){if(e.data&&e.data.size)recChunks.push(e.data)};
  recorder.onstop=function(){
   stream.getTracks().forEach(function(t){t.stop()});
   window.recording=false;
   /* 停止录音是异步回调：此时可能已切课程/退出关卡，activeLevel 为空或已换关，不能再写入 */
   if(!recLevel||activeLevel!==recLevel){render();return}
   if(recUrl)URL.revokeObjectURL(recUrl);
   recUrl=URL.createObjectURL(new Blob(recChunks,{type:recMime}));
   ensureTaskState(recLevel).recordUrl=recUrl;
   render();
  };
  recorder.start();window.recording=true;render();toast("正在录音，跟读完成后点「停止录音」。");
 }).catch(function(err){window.recording=false;render();toast("麦克风不可用："+((err&&err.name)||"未知错误"))});
}
function stopRecorder(){
 if(recorder&&recorder.state!=="inactive"){try{recorder.stop()}catch(e){}}
 recorder=null;window.recording=false;
}
function renderEnglishLesson(l){
 const done=isDone(l),st=ensureTaskState(l),t=l.type;
 let material="";
 if(l.audio&&l.audio.length){
  material+='<section class="panel"><div class="challenge-head"><div class="challenge-label"><span style="color:#6176ed">♪</span>听力材料</div><span class="chip">可重听</span></div>'+l.audio.map(function(a,i){return audioRow(a,i,l.id)}).join("")+(l.audioTip?'<div class="hint">'+esc(l.audioTip)+'</div>':"")+'</section>';
 }
 if(l.passage){
  material+='<section class="panel"><div class="challenge-head"><div class="challenge-label"><span style="color:#6176ed">▤</span>'+esc(l.passageLabel||"阅读材料")+'</div><span class="chip">'+esc(l.passageTag||"精读")+'</span></div><div class="passage">'+esc(l.passage)+'</div></section>';
 }
 let task="";
 if(l.questions&&l.questions.length){
  const need=Math.ceil((l.passRatio||0.8)*l.questions.length);
  const scoreLine=st.score?'<div class="feedback '+(st.passed?"ok":"no")+'">本次答对 '+st.score.right+' / '+st.score.total+'　（需答对 '+need+' 题）</div>':"";
  task+='<section class="panel challenge-card exercise"><div class="challenge-head"><div class="challenge-label"><span style="color:#6176ed">✦</span>'+esc(l.taskTitle||"理解题")+'</div><span class="chip">答对 '+need+' / '+l.questions.length+' 题通关</span>'+(l.timeLimit?'<span class="chip task-timer-badge">剩余 '+l.timeLimit+':00</span>':"")+'</div>'+(l.taskCopy?'<p class="challenge-copy">'+esc(l.taskCopy)+'</p>':"")+l.questions.map(function(q,i){return questionBlock(q,i,l,st)}).join("")+(l.type==="mock"&&!st.submitted?'<div class="exercise-actions"><button class="btn btn-primary btn-small" data-action="submit-mock">交卷并判分</button><span class="audio-hint">交卷前可以随时改答案</span></div>':"")+scoreLine+(st.score&&!st.passed&&!done?'<div class="exercise-actions"><button class="btn btn-soft btn-small" data-action="retry-task">重做本关题目</button><span class="audio-hint">答错的题不能改，重做一遍可以重新拿分</span></div>':"")+(done?'<div class="feedback ok">本关已通关，可以回看或继续下一关。</div>':"")+'</section>';
 }
 if(t==="write"||t==="translate"){
  const res=st.checkResult;
  const pts=res?'<div class="point-list">'+res.pts.map(function(p){return '<div class="point-item"><span class="'+(p.hit?"point-ok":"point-no")+'">'+(p.hit?"✓":"✗")+'</span><span>要点：'+esc(p.label)+'</span></div>'}).join("")+'</div>':"";
  const wc='<div class="wordcount">当前 <b id="liveWords">'+((data.drafts[l.id]||"").match(/[A-Za-z][A-Za-z'’-]*/g)||[]).length+'</b> 词'+(l.minWords?'，要求 ≥ '+l.minWords+' 词':"")+(l.maxWords?'（建议 ≤ '+l.maxWords+' 词）':"")+'</div>';
  task+='<section class="panel challenge-card exercise"><div class="challenge-head"><div class="challenge-label"><span style="color:#6176ed">✎</span>'+esc(l.taskTitle||(t==="write"?"写作任务":"翻译任务"))+'</div><span class="chip">完成 +30 点</span>'+(l.timeLimit?'<span class="chip task-timer-badge">剩余 '+l.timeLimit+':00</span>':"")+'</div><p class="challenge-copy">'+esc(l.prompt)+'</p>'+(l.source?'<div class="passage">'+esc(l.source)+'</div>':"")+'<textarea class="task-input" id="taskAnswer" spellcheck="false" placeholder="'+esc(l.placeholder||"在这里作答…")+'">'+esc(data.drafts[l.id]||"")+'</textarea>'+wc+'<div class="exercise-actions"><button class="btn btn-primary btn-small" data-action="check-task">检查并提交</button><button class="btn btn-ghost btn-small" data-action="toggle-solution">'+(solutionVisible?"收起参考范文":((done||answerUnlocked)?"查看参考范文":"🔒 查看参考范文"))+'</button>'+(done?'<button class="btn btn-soft btn-small" data-action="next-level">下一关 →</button>':"")+'</div>'+pts+(res&&res.overMax?'<div class="hint">字数偏长（已超过建议上限 '+res.max+' 词），考场建议精炼控篇幅以减少低级错误。</div>':"")+(res&&!res.ok?'<div class="feedback no">还没通过：把上面标 ✗ 的要点补进去，再检查一次。</div>':"")+(solutionVisible?'<div class="codebox" style="margin-top:13px"><div class="codebar"><span class="dots"><i></i><i></i><i></i></span><span>参考范文 / 参考译文</span></div><pre>'+esc(l.sample||"")+'</pre><div class="hint">参考范文只用于对照结构与表达，考试时请用自己的话写。</div></div>':"")+(done?'<div class="feedback ok">本关已通关。</div>':"")+'</section>';
 }
 if(t==="speak"){
  const list=l.checklist||[];
  const checks=list.map(function(c,i){const k="c"+i;return '<button type="button" class="takeaway-item self-check'+(st.checks[k]?" on":"")+'" data-action="self-check" data-key="'+k+'"><span class="'+(st.checks[k]?"tick":"")+'">'+(st.checks[k]?"✓":"○")+'</span><span>'+esc(c)+'</span></button>'}).join("");
  task+='<section class="panel challenge-card exercise"><div class="challenge-head"><div class="challenge-label"><span style="color:#6176ed">◍</span>跟读与口语任务</div><span class="chip">录音 + 自评</span></div><p class="challenge-copy">'+esc(l.prompt||l.taskCopy||"")+'</p>'+(l.model?'<div class="audio-row"><div class="audio-head"><span class="audio-label">示范朗读</span>'+(l.model.voice?'<span class="chip chip-mini">'+esc(l.model.voice)+'</span>':"")+'<button class="btn btn-ghost btn-small" type="button" data-action="toggle-transcript" data-target="tr-'+l.id+'-m">显示原文</button></div><audio controls preload="metadata" src="./assets/audio/cet4/'+esc(l.model.file)+'"></audio><div class="transcript" id="tr-'+l.id+'-m" hidden>'+esc(l.model.text||"")+'</div></div>':"")+'<div class="recorder-row">'+(window.recording?'<span class="rec-dot"></span><span class="audio-hint">正在录音…</span><button class="btn btn-soft btn-small" data-action="rec-stop">停止录音</button>':'<button class="btn btn-primary btn-small" data-action="rec-start">'+(st.recordUrl?"重新录音":"开始录音跟读")+'</button>')+(st.recordUrl?'<audio controls preload="metadata" src="'+st.recordUrl+'"></audio>':"")+'</div><div class="hint">录音只保存在这台设备的浏览器内存里，刷新页面即消失，不会上传；没有麦克风或浏览器不支持录音时，可点下方按钮用「跟读自评」代替，同样计入通关。</div><div class="exercise-actions" style="margin:10px 0 0"><button class="btn btn-ghost btn-small" data-action="skip-rec">'+(st.recordSkipped?"已选择用跟读自评代替":"没有麦克风？用跟读自评代替")+'</button></div><div class="challenge-label" style="margin:14px 0 6px">自评清单（全部打勾且录过音才算通关）</div><div class="takeaway">'+checks+'</div>'+(done?'<div class="feedback ok">本关已通关。</div>':"")+'</section>';
 }
 const quizDoneNow=done||st.passed||questionsRatioOk(l,st);
 const writtenDoneNow=done||st.passed||!!(st.checkResult&&st.checkResult.ok);
 const speakChecksDoneNow=done||st.passed||!!((l.checklist||[]).length&&(l.checklist||[]).every(function(_,i){return st.checks["c"+i]}));
 const condition='<section class="panel"><div class="challenge-head"><div class="challenge-label">本关通关条件</div><span class="chip">'+(done?"已完成":"待完成")+'</span></div><div class="takeaway">'+
  ((l.questions&&l.questions.length)?'<div class="takeaway-item"><span class="'+(quizDoneNow?"tick":"")+'">'+(quizDoneNow?"✓":"○")+'</span><span>客观题答对率 ≥ '+Math.round((l.passRatio||0.8)*100)+'%</span></div>':"")+
  ((t==="write"||t==="translate")?'<div class="takeaway-item"><span class="'+(writtenDoneNow?"tick":"")+'">'+(writtenDoneNow?"✓":"○")+'</span><span>要点齐全且字数达标</span></div>':"")+
  ((t==="speak")?'<div class="takeaway-item"><span class="'+((done||st.recordUrl||st.recordSkipped)?"tick":"")+'">'+((done||st.recordUrl||st.recordSkipped)?"✓":"○")+'</span><span>完成跟读录音（没有麦克风时可选择「用跟读自评代替」）</span></div><div class="takeaway-item"><span class="'+(speakChecksDoneNow?"tick":"")+'">'+(speakChecksDoneNow?"✓":"○")+'</span><span>自评清单全部确认</span></div>':"")+
  '<div class="takeaway-item"><span class="'+(done?"tick":"")+'">'+(done?"✓":"○")+'</span><span>获得本关学习点并解锁后续</span></div></div></section>';
 const side='<aside class="lesson-main">'+condition+'<section class="panel"><div class="challenge-head"><div class="challenge-label">核心要点</div><span class="chip">速览</span></div>'+l.takeaways.map(function(x){return '<div class="takeaway-item" style="margin:10px 0"><span class="tick">✓</span><span>'+esc(x)+'</span></div>'}).join("")+'</section><section class="panel"><div class="challenge-label" style="margin-bottom:10px">学习路线</div><div style="font-size:12px;color:#8490a2">'+completedCount()+' / '+levels.length+' 关完成</div><div class="progress-bar"><i style="width:'+progressPct()+'%"></i></div><button class="btn btn-ghost btn-small" data-page="map">查看全部关卡</button></section></aside>';
 document.getElementById("view").innerHTML='<div class="page-header"><div><div class="eyebrow">'+esc(l.module||l.stage)+' · 第 '+(levels.indexOf(l)+1)+' 关</div><h1>'+esc(l.title)+'</h1><p class="subhead">'+esc(l.gist)+'</p></div><button class="btn btn-ghost btn-small" data-action="back">← 返回路线</button></div>'+
 '<div class="lesson-layout"><div class="lesson-main"><section class="panel"><div class="lesson-title-row"><div class="lesson-badge">学</div><div><h2>本关要点</h2><div class="meta-line">建议用时 '+l.minutes+' 分钟 · 看完要点后完成任务</div></div></div><p class="lesson-copy" style="margin:18px 0">'+fmtLesson(l.lesson)+'</p>'+(l.usage?'<div class="hint" style="margin-bottom:12px"><b>能用在哪儿：</b>'+esc(l.usage)+'</div>':"")+'<div class="takeaway" style="margin-top:16px">'+l.takeaways.map(function(x){return '<div class="takeaway-item"><span class="tick">✓</span><span>'+esc(x)+'</span></div>'}).join("")+'</div></section>'+material+task+'</div>'+side+'</div><div class="footer-note">'+esc(currentCourse().footNote)+'</div>';
 startTaskTimer(l);
}
