/* ============================================================================
 * 02-app-core.js — 应用核心：全局状态、localStorage 读写、主题、文本工具、代码编辑器工具、密码弹窗、进度统计
 * 加载顺序 2/13：被所有后续模块使用；包含顶层初始化（applyTheme 等）
 * 注意：本站是经典 <script>（非 ES Module），所有 js/ 文件共享同一个全局作用域，
 *       编号即加载顺序；调整顺序或拆合并文件前请先读 docs/ARCHITECTURE.md。
 * ========================================================================== */
function loadStateFor(key){try{return JSON.parse(localStorage.getItem(key))||{completed:{},xp:0,attempts:0,correct:0,started:Date.now()}}catch(e){return {completed:{},xp:0,attempts:0,correct:0,started:Date.now()}}}
/* localStorage 安全读写：隐私模式/配额满时浏览器会抛异常，不能让它打断答题与通关 */
function lsGet(key){try{return localStorage.getItem(key)}catch(e){return null}}
function lsSet(key,value){try{localStorage.setItem(key,value);return true}catch(e){if(!window.__lsWarned){window.__lsWarned=true;try{toast("浏览器存储不可用（隐私模式或空间已满），这次的改动不会被保存。")}catch(_){}}return false}}
const stores={};
COURSES.forEach(function(c){const s=loadStateFor(c.store);s.drafts=s.drafts||{};s.quizRewards=s.quizRewards||{};Object.keys(s.completed).forEach(function(id){s.quizRewards[id]=true});stores[c.id]=s});
let data=stores[activeCourse];
let page = "home";
let activeLevel = null;
let selectedOption = null;
let quizPassed = false;
let codePassed = false;
let hintVisible = false;
let solutionVisible = false;
let answerUnlocked = false;
function save(){lsSet(currentCourse().store,JSON.stringify(data));}
function setCourse(id){
 const c=courseById(id);if(!c)return;
 if(!hasCourse(id)){toast(c.name+" 的内容还在制作中。");return}
 if(id===activeCourse){page="map";activeLevel=null;render();window.scrollTo({top:0,behavior:"smooth"});return}
 activeCourse=id;lsSet(courseKey,id);
 levels=courseLevels[id];groups=courseGroups[id];data=stores[id];
 activeLevel=null;page="map";selectedOption=null;quizPassed=false;codePassed=false;
 hintVisible=false;solutionVisible=false;window.quizAnswered=false;window.codeFeedback="";window.codeDraft="";
 window.taskState=null;
 if(typeof stopRecorder==="function")stopRecorder();
 render();window.scrollTo({top:0,behavior:"smooth"});toast("已切换到「"+c.name+"」");
}
let themeMode=lsGet(themeKey)||"system";
function applyTheme(mode,persist){
 if(!["system","light","dark"].includes(mode))mode="system";
 themeMode=mode;const resolved="light";/* 外观只由「天空预设」控制，不跟随手机系统深色模式 */
 document.body.dataset.theme=resolved;document.body.dataset.themeMode=mode;document.documentElement.style.colorScheme=resolved;
 const names={system:"跟随系统",light:"浅色模式",dark:"深色模式"};
 const button=document.getElementById("themeButton"),icon=resolved==="dark"?'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.8 15.2A8.7 8.7 0 0 1 8.8 3.2 8.7 8.7 0 1 0 20.8 15.2Z"/></svg>':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg>';
 if(button){button.innerHTML=icon;button.title="外观模式："+names[mode]+"（当前"+(resolved==="dark"?"深色":"浅色")+"），点击切换";button.setAttribute("aria-label","外观模式："+names[mode]+"，当前"+(resolved==="dark"?"深色":"浅色")+"，点击切换")}
 const themeColor=document.querySelector('meta[name="theme-color"]');if(themeColor)themeColor.content=resolved==="dark"?"#111a2d":"#e9f1fd";
 if(persist)lsSet(themeKey,mode);
}
applyTheme(themeMode,false);
const systemThemeQuery=window.matchMedia?window.matchMedia("(prefers-color-scheme: dark)"):null;
if(systemThemeQuery){const syncSystemTheme=function(){};if(systemThemeQuery.addEventListener)systemThemeQuery.addEventListener("change",syncSystemTheme);else if(systemThemeQuery.addListener)systemThemeQuery.addListener(syncSystemTheme)}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function highlightC(source){
 const pattern=/^[ \t]*#[^\n]*|\/\*[\s\S]*?\*\/|\/\/[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:break|case|continue|default|do|else|for|goto|if|return|switch|while|auto|const|extern|inline|register|restrict|static|typedef|volatile|_Alignas|_Alignof|_Atomic|_Generic|_Noreturn|_Static_assert|_Thread_local)\b|\b(?:char|double|enum|float|int|long|short|signed|struct|union|unsigned|void|_Bool|_Complex|_Imaginary|size_t|FILE)\b|\b(?:0[xX][0-9a-fA-F]+|0[bB][01]+|\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)[uUlLfF]*\b|[A-Za-z_]\w*|[\s\S]/gm;
 let out="",match;
 while((match=pattern.exec(source))!==null){
  const token=match[0];let kind="";
  if(/^[ \t]*#/.test(token))kind="directive";
  else if(token.slice(0,2)==="//"||token.slice(0,2)==="/*")kind="comment";
  else if(token[0]==='"'||token[0]==="'")kind="string";
  else if(/^(?:break|case|continue|default|do|else|for|goto|if|return|switch|while|auto|const|extern|inline|register|restrict|static|typedef|volatile|_Alignas|_Alignof|_Atomic|_Generic|_Noreturn|_Static_assert|_Thread_local)$/.test(token))kind="keyword";
  else if(/^(?:char|double|enum|float|int|long|short|signed|struct|union|unsigned|void|_Bool|_Complex|_Imaginary|size_t|FILE)$/.test(token))kind="type";
  else if(/^(?:0[xX]|0[bB]|\d)/.test(token))kind="number";
  else if(/^[A-Za-z_]\w*$/.test(token)&&/^\s*\(/.test(source.slice(pattern.lastIndex)))kind="function";
  out+=kind?'<span class="syntax-'+kind+'">'+esc(token)+'</span>':esc(token);
 }
 return out;
}
function editorMarkup(value){
 const lineCount=Math.max(1,value.split("\n").length);
 const lineNums=Array.from({length:lineCount},function(_,i){return String(i+1)}).join("\n");
 return '<div class="ide-frame"><div class="ide-toolbar"><div class="ide-toolbar-left"><span class="ide-dots"><i></i><i></i><i></i></span><span class="ide-file">challenge.c</span></div><div class="ide-toolbar-right"><span class="ide-standard">C99+</span><span>本地编辑</span></div></div><div class="ide-body"><pre class="ide-gutter" id="editorLineNumbers" aria-hidden="true">'+lineNums+'</pre><div class="ide-workspace"><pre class="ide-highlight" id="codeHighlight" aria-hidden="true">'+highlightC(value)+'</pre><textarea class="code-input" id="codeAnswer" wrap="off" spellcheck="false" autocomplete="off" autocapitalize="off" aria-label="代码编辑器" placeholder="// 在这里写下你的代码">'+esc(value)+'</textarea></div></div><div class="ide-status"><span id="editorPosition">行 1 · 列 1</span><span>自动保存到此设备</span></div></div><div class="ide-help">Tab 缩进 · Enter 自动缩进 · 括号补全 · Ctrl + / 注释 · Ctrl + Enter 检查</div>';
}
function updateEditor(){
 const input=document.getElementById("codeAnswer");
 if(!input)return;
 const highlight=document.getElementById("codeHighlight"),gutter=document.getElementById("editorLineNumbers"),position=document.getElementById("editorPosition"),value=input.value;
 highlight.innerHTML=highlightC(value);
 gutter.textContent=Array.from({length:Math.max(1,value.split("\n").length)},function(_,i){return String(i+1)}).join("\n");
 highlight.style.transform="translate("+(-input.scrollLeft)+"px,"+(-input.scrollTop)+"px)";gutter.style.transform="translateY("+(-input.scrollTop)+"px)";
 const before=value.slice(0,input.selectionStart),line=before.split("\n").length,column=before.length-before.lastIndexOf("\n");
 position.textContent="行 "+line+" · 列 "+column;
}
function saveEditorValue(input){window.codeDraft=input.value;if(activeLevel){data.drafts[activeLevel.id]=input.value;save()}updateEditor()}
function replaceEditorRange(input,text,start,end,caret){
 input.setRangeText(text,start,end,"end");
 if(caret!==undefined)input.setSelectionRange(caret,caret);
 input.dispatchEvent(new Event("input",{bubbles:true}));
}
let modalPurpose="reset";
let resetMode="verify";
async function hashResetPassword(password){
 if(window.crypto&&window.crypto.subtle&&window.TextEncoder){const digest=await window.crypto.subtle.digest("SHA-256",new TextEncoder().encode(password));return "sha256:"+Array.from(new Uint8Array(digest),function(b){return b.toString(16).padStart(2,"0")}).join("")}
 return "local:"+password;
}
function openResetDialog(){
 modalPurpose="reset";
 const modal=document.getElementById("resetModal"),content=document.getElementById("resetModalContent");
 resetMode=lsGet(resetPasswordKey)?"verify":"setup";
 content.innerHTML=resetMode==="setup"?'<h2 id="resetTitle">设置重置密码</h2><p>首次重头开始前，请先设置一个密码并确认。以后每次清空进度都需要输入它。密码保存在这台设备的浏览器中。</p><form class="reset-form" id="resetForm"><label>设置密码<input id="resetPassword" type="password" minlength="4" autocomplete="new-password" required placeholder="至少 4 个字符"></label><label>再次输入<input id="resetPasswordConfirm" type="password" minlength="4" autocomplete="new-password" required placeholder="确认密码"></label><div class="reset-error" id="resetError" role="status"></div><div class="reset-actions"><button class="btn btn-ghost btn-small" type="button" data-action="reset-cancel">取消</button><button class="btn btn-primary btn-small" type="submit">设置并重头开始</button></div></form>':'<h2 id="resetTitle">输入密码以重头开始</h2><p>这会清除本设备保存的关卡进度、学习点、答题统计和代码草稿。此操作不能撤销。</p><form class="reset-form" id="resetForm"><label>重置密码<input id="resetPassword" type="password" autocomplete="current-password" required placeholder="输入你设置的密码"></label><div class="reset-error" id="resetError" role="status"></div><div class="reset-actions"><button class="btn btn-ghost btn-small" type="button" data-action="reset-cancel">取消</button><button class="btn btn-primary btn-small" type="submit">验证并重头开始</button></div></form>';
 modal.hidden=false;const field=document.getElementById("resetPassword");if(field)field.focus();
}
function openAnswerDialog(){
 const modal=document.getElementById("resetModal"),content=document.getElementById("resetModalContent");
 modalPurpose="answer";
 resetMode=lsGet(resetPasswordKey)?"verify":"setup";
 content.innerHTML=resetMode==="setup"?'<h2 id="resetTitle">设置密码</h2><p>查看标准答案需要密码，它与“重头开始”共用同一个密码。首次使用请先设置并确认，密码保存在这台设备的浏览器中。</p><form class="reset-form" id="resetForm"><label>设置密码<input id="resetPassword" type="password" minlength="4" autocomplete="new-password" required placeholder="至少 4 个字符"></label><label>再次输入<input id="resetPasswordConfirm" type="password" minlength="4" autocomplete="new-password" required placeholder="确认密码"></label><div class="reset-error" id="resetError" role="status"></div><div class="reset-actions"><button class="btn btn-ghost btn-small" type="button" data-action="reset-cancel">取消</button><button class="btn btn-primary btn-small" type="submit">设置并查看答案</button></div></form>':'<h2 id="resetTitle">输入密码查看标准答案</h2><p>标准答案与“重头开始”共用同一个密码。输入正确后即可查看本关答案。</p><form class="reset-form" id="resetForm"><label>密码<input id="resetPassword" type="password" autocomplete="current-password" required placeholder="输入你设置的密码"></label><div class="reset-error" id="resetError" role="status"></div><div class="reset-actions"><button class="btn btn-ghost btn-small" type="button" data-action="reset-cancel">取消</button><button class="btn btn-primary btn-small" type="submit">验证并查看答案</button></div></form>';
 modal.hidden=false;const field=document.getElementById("resetPassword");if(field)field.focus();
}
function answerVerified(){closeResetDialog();answerUnlocked=true;solutionVisible=true;render();toast("密码正确，已显示本关标准答案。");}
function closeResetDialog(){document.getElementById("resetModal").hidden=true}
function resetProgress(){
 data={completed:{},xp:0,attempts:0,correct:0,started:Date.now(),drafts:{},quizRewards:{}};
 stores[activeCourse]=data;
 page="map";activeLevel=null;selectedOption=null;quizPassed=false;codePassed=false;hintVisible=false;solutionVisible=false;window.quizAnswered=false;window.codeFeedback="";window.codeDraft="";window.taskState=null;
 if(typeof stopRecorder==="function")stopRecorder();
 save();closeResetDialog();render();toast("已清空「"+currentCourse().name+"」的学习进度。");
}
document.addEventListener("submit",async function(e){
 if(e.target.id!=="resetForm")return;e.preventDefault();
 const password=document.getElementById("resetPassword").value,error=document.getElementById("resetError");
 if(resetMode==="setup"){
  const confirmPassword=document.getElementById("resetPasswordConfirm").value;
  if(password.length<4){error.textContent="密码至少需要 4 个字符。";return}
  if(password!==confirmPassword){error.textContent="两次输入的密码不一致。";return}
  lsSet(resetPasswordKey,await hashResetPassword(password));
  if(modalPurpose==="answer"){answerVerified();return}
  resetProgress();return;
 }
 const saved=lsGet(resetPasswordKey);
 if(!saved||await hashResetPassword(password)!==saved){error.textContent="密码不正确。"+(modalPurpose==="answer"?"答案没有显示。":"进度没有变化。");return}
 if(modalPurpose==="answer"){answerVerified();return}
 resetProgress();
});
document.getElementById("resetModal").addEventListener("click",function(e){if(e.target===e.currentTarget)closeResetDialog()});
document.addEventListener("keydown",function(e){if(e.key==="Escape"&&!document.getElementById("resetModal").hidden)closeResetDialog()});
function completedCount(){return Object.keys(data.completed).length}
function unlocked(level){const i=levels.indexOf(level);return i<=0||!!data.completed[levels[i-1].id]}
function isDone(level){return !!data.completed[level.id]}
function progressPct(){return Math.round(completedCount()/levels.length*100)}
function nextLevel(){return levels.find(function(l){return !isDone(l)})||levels[levels.length-1]}
function toast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");setTimeout(function(){t.classList.remove("show")},2300)}
function copyText(text){const done=function(){toast("标准答案已复制到剪贴板。")};const fb=function(){const ta=document.createElement("textarea");ta.value=text;ta.setAttribute("readonly","");ta.style.position="fixed";ta.style.left="-9999px";document.body.appendChild(ta);ta.select();try{document.execCommand("copy")}catch(e){}document.body.removeChild(ta);done()};if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(text).then(done,fb)}else{fb()}}
/* 注：内容统一用真实换行（JS 的 \n 转义），不再需要旧的字面量 \\n 还原逻辑 */
