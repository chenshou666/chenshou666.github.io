/* ============================================================================
 * 09-events.js — 全局事件委托：data-action 点击分发、代码编辑器键盘交互、输入/滚动同步，末尾执行首次 render()
 * 加载顺序 9/13：按编号顺序加载
 * 注意：本站是经典 <script>（非 ES Module），所有 js/ 文件共享同一个全局作用域，
 *       编号即加载顺序；调整顺序或拆合并文件前请先读 docs/ARCHITECTURE.md。
 * ========================================================================== */
function handleClick(e){
 const pageBtn=e.target.closest("[data-page]");if(pageBtn){switchPage(pageBtn.dataset.page);return}
 const levelBtn=e.target.closest("[data-level]");if(levelBtn){openLevel(Number(levelBtn.dataset.level));return}
 const action=e.target.closest("[data-action]");if(!action)return;
 const a=action.dataset.action;
 if(a==="cycle-theme"){apCycleSky();return}
 if(a==="open-work"){switchPage("work");return}
 if(a==="enter-lab"){switchPage("courses");return}
 if(a==="open-author"){switchPage("author");return}
 if(a==="switch-course"){setCourse(action.dataset.course);return}
 if(a==="toggle-transcript"){const el=document.getElementById(action.dataset.target);if(el){el.hidden=!el.hidden;action.textContent=el.hidden?"显示原文":"隐藏原文"}return}
 if(a==="check-task"){checkWrittenTask();return}
 if(a==="submit-mock"){submitMock();return}
 if(a==="retry-task"){retryTask();return}
 if(a==="rec-start"){startRecorder();return}
 if(a==="skip-rec"){
  const l0=activeLevel;if(!l0)return;
  const st0=ensureTaskState(l0);st0.recordSkipped=!st0.recordSkipped;
  render();toast(st0.recordSkipped?"已选择用跟读自评代替录音。":"已取消「跟读自评代替」，请完成录音。");
  return}
 if(a==="rec-stop"){stopRecorder();render();return}
 if(a==="self-check"){toggleSelfCheck(action.dataset.key);return}
 if(a==="next-level"){const ni=levels.indexOf(activeLevel),nx=levels[ni+1];if(nx){openLevel(nx.id)}else{page="summary";activeLevel=null;render()}return}
 if(a==="continue"){if(activeLevel&&isDone(activeLevel)){const i=levels.indexOf(activeLevel),next=levels[i+1];if(next){openLevel(next.id);return}page="summary";activeLevel=null;render();return}const n=nextLevel();openLevel(n.id)}
 if(a==="back"){activeLevel=null;page="map";render()}
 if(a==="hint"){hintVisible=!hintVisible;render()}
 if(a==="toggle-solution"){if(!activeLevel)return;if(!isDone(activeLevel)&&!answerUnlocked){openAnswerDialog();return}solutionVisible=!solutionVisible;render();return}
 if(a==="copy-solution"){if(!activeLevel)return;if(!isDone(activeLevel)&&!answerUnlocked){openAnswerDialog();return}copyText(activeLevel.solution||"");return}
 if(a==="check-code")checkCode()
 if(a==="check-output"){checkRunOutput();return}
 if(a==="insert-template"){const ta=document.getElementById("codeAnswer");if(!ta)return;if(ta.value.trim()){toast("编辑器已有内容，模板不会覆盖。");ta.focus();return}const template="#include <stdio.h>\n\nint main(void) {\n    \n    return 0;\n}";ta.value=template;ta.dispatchEvent(new Event("input",{bubbles:true}));ta.focus();const caret=template.indexOf("    \n")+4;ta.setSelectionRange(caret,caret);updateEditor();return}
 if(a==="make-save-code"){makeSaveCode(false);return}
 if(a==="make-save-link"){makeSaveCode(true);return}
 if(a==="copy-save-code"){var __c1=document.getElementById("saveCodeBox");if(__c1)copyTextSmart(__c1.value||"");return}
 if(a==="copy-save-link"){var __c2=document.getElementById("saveCodeBox");if(__c2)copyTextSmart(saveLinkFrom(__c2.value||""));return}
 if(a==="import-save-code"){importSaveFromBox();return}
 if(a==="proj-toggle"){var pj=loadProject();var d=Number(action.dataset.day);pj.done[d]=!pj.done[d];saveProject(pj);render();toast(pj.done[d]?"Day "+d+" 完成，继续保持。":"已撤销 Day "+d+"。");return}
 if(a==="copy-qq-group"){copyTextSmart(CONTACT_QQ_GROUP);return}
 if(a==="export-progress"){exportProgress();return}
 if(a==="import-progress"){var __pf=document.getElementById("progressFile");if(__pf)__pf.click();else toast("找不到文件选择控件，请刷新页面。");return}
 if(a==="reset-progress"){openResetDialog();return}
 if(a==="reset-cancel"){closeResetDialog();return}
}
document.addEventListener("click",function(e){
 const pick=e.target.closest("[data-pick]");if(pick){pickAnswer(Number(pick.dataset.q),Number(pick.dataset.pick));return}
 const opt=e.target.closest("[data-option]");if(opt){selectedOption=Number(opt.dataset.option);awardForQuiz();return}
 handleClick(e)
});
document.addEventListener("keydown",function(e){
 const input=e.target;if(!input||input.id!=="codeAnswer")return;
 const value=input.value,start=input.selectionStart,end=input.selectionEnd;
 if((e.ctrlKey||e.metaKey)&&e.key==="Enter"){e.preventDefault();checkCode();return}
 if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="s"){e.preventDefault();saveEditorValue(input);toast("代码草稿已保存。");return}
 if((e.ctrlKey||e.metaKey)&&e.key==="/"){
  e.preventDefault();const lineStart=value.lastIndexOf("\n",start-1)+1,nextBreak=value.indexOf("\n",Math.max(start,end-1)),lineEnd=nextBreak<0?value.length:nextBreak,block=value.slice(lineStart,lineEnd),lines=block.split("\n"),allCommented=lines.every(function(line){return !line.trim()||/^\s*\/\//.test(line)}),changed=lines.map(function(line){if(!line.trim())return line;if(allCommented)return line.replace(/^(\s*)\/\/ ?/,"$1");return line.replace(/^(\s*)/,"$1// ")}).join("\n");replaceEditorRange(input,changed,lineStart,lineEnd,lineStart+changed.length);input.setSelectionRange(lineStart,lineStart+changed.length);updateEditor();return;
 }
 if(e.key==="Tab"){
  e.preventDefault();
  if(start===end){
   if(e.shiftKey){const lineStart=value.lastIndexOf("\n",start-1)+1,leading=(value.slice(lineStart,start).match(/^ */)||[""])[0],remove=Math.min(4,leading.length);if(remove)replaceEditorRange(input,"",lineStart,lineStart+remove,start-remove)}
   else replaceEditorRange(input,"    ",start,end,start+4);
   return;
  }
  const lineStart=value.lastIndexOf("\n",start-1)+1,nextBreak=value.indexOf("\n",Math.max(start,end-1)),lineEnd=nextBreak<0?value.length:nextBreak,block=value.slice(lineStart,lineEnd),lines=block.split("\n");
  const changed=lines.map(function(line){if(!e.shiftKey)return "    "+line;return line.replace(/^ {1,4}/,"")}).join("\n");
  replaceEditorRange(input,changed,lineStart,lineEnd,lineStart+changed.length);input.setSelectionRange(lineStart,lineStart+changed.length);updateEditor();return;
 }
 if(e.key==="Enter"){
  e.preventDefault();const lineStart=value.lastIndexOf("\n",start-1)+1,prefix=value.slice(lineStart,start),base=(prefix.match(/^[ \t]*/)||[""])[0],inner=/\{\s*$/.test(prefix)?base+"    ":base,after=value.slice(end);
  if(after.startsWith("}")&&/\{\s*$/.test(prefix)){const insert="\n"+inner+"\n"+base;replaceEditorRange(input,insert,start,end,start+1+inner.length)}
  else replaceEditorRange(input,"\n"+inner,start,end,start+1+inner.length);
  return;
 }
 if(e.key==="}"&&start===end){const lineStart=value.lastIndexOf("\n",start-1)+1,prefix=value.slice(lineStart,start);if(/^[ \t]*$/.test(prefix)){const remove=Math.min(4,(prefix.match(/ *$/)||[""])[0].length);if(remove){e.preventDefault();replaceEditorRange(input,"}",start-remove,end,start-remove+1);return}}}
 if(e.key==="Backspace"&&start===end&&start>0){const pairs={"(":")","[":"]","{":"}","\"":"\"","'":"'"};if(pairs[value[start-1]]===value[start]){e.preventDefault();replaceEditorRange(input,"",start-1,start+1,start-1);return}}
 const pairs={"(":")","[":"]","{":"}","\"":"\"","'":"'"}; 
 if(Object.prototype.hasOwnProperty.call(pairs,e.key)){
  e.preventDefault();if(start!==end){const selected=value.slice(start,end);replaceEditorRange(input,e.key+selected+pairs[e.key],start,end,start+1);input.setSelectionRange(start+1,start+1+selected.length)}else{replaceEditorRange(input,e.key+pairs[e.key],start,end,start+1)}return;
 }
 if([")","]","}"].includes(e.key)&&start===end&&value[start]===e.key){e.preventDefault();input.setSelectionRange(start+1,start+1);updateEditor()}
});
document.addEventListener("input",function(e){if(e.target.id==="codeAnswer"){saveEditorValue(e.target);return}if(e.target.id==="taskAnswer"&&activeLevel){data.drafts[activeLevel.id]=e.target.value;save();const el=document.getElementById("liveWords");if(el)el.textContent=(e.target.value.match(/[A-Za-z][A-Za-z'’-]*/g)||[]).length}});
document.addEventListener("keyup",function(e){if(e.target.id==="codeAnswer")updateEditor()});
document.addEventListener("click",function(e){if(e.target.id==="codeAnswer")updateEditor()});
document.addEventListener("selectionchange",function(){if(document.activeElement&&document.activeElement.id==="codeAnswer")updateEditor()});
document.addEventListener("scroll",function(e){if(e.target&&e.target.id==="codeAnswer"){const h=document.getElementById("codeHighlight"),g=document.getElementById("editorLineNumbers");if(h)h.style.transform="translate("+(-e.target.scrollLeft)+"px,"+(-e.target.scrollTop)+"px)";if(g)g.style.transform="translateY("+(-e.target.scrollTop)+"px)"}},true);
document.addEventListener("pointermove",function(e){const card=e.target.closest(".level-card");if(!card)return;const r=card.getBoundingClientRect();card.style.setProperty("--shine-x",((e.clientX-r.left)/r.width*100)+"%");card.style.setProperty("--shine-y",((e.clientY-r.top)/r.height*100)+"%")},{passive:true});
/* 指针靠近自动抬起效果已移除（用户要求关闭） */

render();
