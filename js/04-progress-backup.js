/* ============================================================================
 * 04-progress-backup.js — 进度备份与迁移：JSON 导出/导入、存档码/存档链接（#save= 链接）
 * 加载顺序 4/12：按编号顺序加载
 * 注意：本站是经典 <script>（非 ES Module），所有 js/ 文件共享同一个全局作用域，
 *       编号即加载顺序；调整顺序或拆合并文件前请先读 docs/ARCHITECTURE.md。
 * ========================================================================== */
/* ==== 进度文件包：导出 / 导入（只含学习数据，不含个人信息） ==== */
var CONTACT_QQ_GROUP="1129793963";/* 交流群号：填这里（例："123456789"），留空显示「筹备中」 */
var PROGRESS_KEYS=["cquest.master.v1","cquest.cet4.v1","cquest.course.v1","cquest.appearance.v1","codesword.reset.password.v1"];
function ensureProgressTools(){
 var v=document.getElementById("view");if(!v)return;
 if(v.querySelector(".progress-tools"))return;
 var wrap=document.createElement("section");
 wrap.className="panel progress-tools";
 wrap.innerHTML='<div class="challenge-head"><div class="challenge-label">进度备份与迁移</div><span class="chip">JSON 文件</span></div>'
  +'<p class="challenge-copy">学习进度只保存在这台设备的浏览器里（不会上传）。换手机、换浏览器或清理缓存前，先「导出进度文件」；到新设备打开本站，再「导入进度文件」就能接着学。</p>'
  +'<div class="exercise-actions"><button class="btn btn-primary btn-small" data-action="export-progress">⬇ 导出进度文件</button>'
  +'<button class="btn btn-ghost btn-small" data-action="import-progress">⬆ 导入进度文件</button>'
  +'<input type="file" id="progressFile" accept="application/json,.json" hidden></div>'
  +'<div class="hint progress-hint" id="progressHint">文件包含：C 语言进度、英语四级进度、外观设置、当前课程与答案锁密码。<b>不含</b>任何个人信息。</div>'
  +'<div class="save-block">'
  +'<div class="challenge-label save-title">存档码 / 存档链接（任何设备都能用，不用登录）</div>'
  +'<p class="challenge-copy">点「生成」，复制得到的一串码或一条链接；到另一台设备打开本站，把码粘贴到下面「导入存档」即可接着学。</p>'
  +'<div class="exercise-actions"><button class="btn btn-primary btn-small" data-action="make-save-code">生成存档码</button>'
  +'<button class="btn btn-soft btn-small" data-action="make-save-link">生成存档链接</button></div>'
  +'<textarea class="task-input save-box" id="saveCodeBox" readonly placeholder="点上面的按钮生成，结果会显示在这里…"></textarea>'
  +'<div class="exercise-actions" id="saveCodeActions" hidden><button class="btn btn-ghost btn-small" data-action="copy-save-code">复制存档码</button>'
  +'<button class="btn btn-ghost btn-small" data-action="copy-save-link">复制存档链接</button></div>'
  +'<div class="challenge-label save-title">导入存档</div>'
  +'<textarea class="task-input save-box" id="saveCodeInput" placeholder="把存档码或存档链接粘贴到这里…"></textarea>'
  +'<div class="exercise-actions"><button class="btn btn-primary btn-small" data-action="import-save-code">导入存档并刷新</button></div>'
  +'<div class="hint save-hint">存档码是对学习进度做的压缩编码，只含进度数据，不含个人信息；链接是把存档码拼在网址后面，打开时会提示导入。</div>'
  +'</div>';
 v.appendChild(wrap);
}
function exportProgress(){
 var out={app:"学习工具",kind:"progress",version:1,exportedAt:new Date().toISOString(),data:{}};
 PROGRESS_KEYS.forEach(function(k){var cur=lsGet(k);if(cur!==null)out.data[k]=cur});
 try{
  var blob=new Blob([JSON.stringify(out,null,2)],{type:"application/json;charset=utf-8"});
  var url=URL.createObjectURL(blob);
  var a=document.createElement("a");
  var d=new Date(),pad=function(n){return String(n).padStart(2,"0")};
  a.href=url;a.download="study-tool-progress-"+d.getFullYear()+pad(d.getMonth()+1)+pad(d.getDate())+"-"+pad(d.getHours())+pad(d.getMinutes())+".json";
  a.style.display="none";document.body.appendChild(a);a.click();
  window.setTimeout(function(){URL.revokeObjectURL(url);if(a.parentNode)a.parentNode.removeChild(a)},600);
  toast("进度文件已导出，去「下载」里找它。");
 }catch(e){toast("导出失败："+(e.message||"浏览器不支持下载"));}
}
function importProgressFile(file){
 if(!file){return}
 if(file.size>2*1024*1024){toast("文件太大，可能不是进度文件。");return}
 var reader=new FileReader();
 reader.onload=function(){
  try{
   var obj=JSON.parse(String(reader.result||""));
   if(!obj||(obj.app!=="学习工具"&&obj.app!=="HT Lab")||!obj.data||typeof obj.data!=="object")throw new Error("不是「学习工具」的进度文件");
   var n=0,failed=0;
   PROGRESS_KEYS.forEach(function(k){
    var val=obj.data[k];
    if(typeof val==="string"&&val){if(lsSet(k,val))n++;else failed++}
   });
   if(!n&&!failed)throw new Error("文件里没有可导入的进度");
   if(!n)throw new Error("浏览器存储不可用，无法写入进度");
   toast("已导入 "+n+" 项进度，正在刷新…");
   window.setTimeout(function(){location.reload()},800);
  }catch(err){toast("导入失败："+(err.message||"文件格式不对"));}
 };
 reader.onerror=function(){toast("读取文件失败，请重试。")};
 reader.readAsText(file,"utf-8");
}
document.addEventListener("change",function(e){
 if(e.target&&e.target.id==="progressFile"){importProgressFile(e.target.files&&e.target.files[0]);e.target.value=""}
},false);


/* ==== 存档码 / 存档链接（全站可用，无需账号） ==== */
var SAVE_PREFIX="HT1";
function b64urlFromBytes(bytes){var bin="",i;for(i=0;i<bytes.length;i++)bin+=String.fromCharCode(bytes[i]);return btoa(bin).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}
function bytesFromB64url(str){var sN=str.replace(/-/g,"+").replace(/_/g,"/");while(sN.length%4)sN+="=";var bin=atob(sN),out=new Uint8Array(bin.length),i;for(i=0;i<bin.length;i++)out[i]=bin.charCodeAt(i);return out}
function saveProgressPayload(){
 var out={app:"学习工具",kind:"progress",version:1,exportedAt:new Date().toISOString(),data:{}};
 PROGRESS_KEYS.forEach(function(k){var v=lsGet(k);if(v!==null)out.data[k]=v});
 return out;
}
async function compressSaveText(text){
 if(window.CompressionStream){
  var cs=new CompressionStream("gzip");
  var buf=await new Response(new Blob([text]).stream().pipeThrough(cs)).arrayBuffer();
  return "G"+b64urlFromBytes(new Uint8Array(buf));
 }
 return "B"+b64urlFromBytes(new TextEncoder().encode(text));
}
async function decompressSaveText(code){
 var kind=code.charAt(0),payload=code.slice(1),bytes=bytesFromB64url(payload);
 if(kind==="G"){
  if(!window.DecompressionStream)throw new Error("这个浏览器不支持解压存档，请换新版浏览器");
  var ds=new DecompressionStream("gzip");
  return await new Response(new Blob([bytes]).stream().pipeThrough(ds)).text();
 }
 return new TextDecoder().decode(bytes);
}
async function buildSaveCode(){
 var json=JSON.stringify(saveProgressPayload());
 return SAVE_PREFIX+await compressSaveText(json);
}
function saveLinkFrom(code){
 var base=location.href.split("#")[0];
 return base+"#save="+encodeURIComponent(code);
}
async function applySaveCode(raw){
 var code=String(raw||"").trim();
 if(!code)throw new Error("请先粘贴存档码");
 if(code.indexOf("#save=")>=0){code=decodeURIComponent(code.split("#save=")[1]||"")}
 if(code.indexOf("save=")>=0&&code.indexOf(SAVE_PREFIX)!==0){code=code.slice(code.indexOf("save=")+5)}
 if(code.indexOf(SAVE_PREFIX)!==0)throw new Error("存档码格式不对（应以 "+SAVE_PREFIX+" 开头）");
 var json=await decompressSaveText(code.slice(SAVE_PREFIX.length));
 var obj=JSON.parse(json);
 if(!obj||(obj.app!=="学习工具"&&obj.app!=="HT Lab")||!obj.data||typeof obj.data!=="object")throw new Error("存档内容无法识别");
 var n=0,failed=0;
 PROGRESS_KEYS.forEach(function(k){var val=obj.data[k];if(typeof val==="string"&&val){if(lsSet(k,val))n++;else failed++}});
 if(!n&&!failed)throw new Error("存档里没有可用进度");
 if(!n)throw new Error("浏览器存储不可用，无法写入进度");
 return n;
}
function copyTextSmart(text){
 if(!text){toast("还没有内容可复制");return}
 var done=function(){toast("已复制，去另一台设备粘贴即可。")};
 if(navigator.clipboard&&navigator.clipboard.writeText){
  navigator.clipboard.writeText(text).then(done,function(){copyTextFallback(text,done)});
 }else copyTextFallback(text,done);
}
function copyTextFallback(text,done){
 var ta=document.createElement("textarea");ta.value=text;ta.style.position="fixed";ta.style.left="-9999px";
 document.body.appendChild(ta);ta.select();
 var okCopy=false;try{okCopy=document.execCommand("copy")}catch(e){}
 ta.remove();
 if(okCopy)done();else toast("浏览器不允许自动复制，请手动全选复制。");
}
function makeSaveCode(asLink){
 var box=document.getElementById("saveCodeBox");
 var actions=document.getElementById("saveCodeActions");
 if(box)box.value="正在生成…";
 buildSaveCode().then(function(code){
  var text=code;
  if(asLink)text=saveLinkFrom(code);
  if(box){box.value=text;box.focus();box.select&&box.select()}
  if(actions)actions.hidden=false;
  copyTextSmart(text);
 }).catch(function(e){
  if(box)box.value="";
  toast("生成失败："+(e&&e.message||"未知错误"));
 });
}
function importSaveFromBox(){
 var box=document.getElementById("saveCodeInput");
 var code=box?box.value:"";
 if(!String(code).trim()){toast("请先把存档码粘贴到输入框。");return}
 toast("正在导入存档…");
 applySaveCode(code).then(function(n){
  toast("已导入 "+n+" 项进度，正在刷新…");
  window.setTimeout(function(){location.reload()},800);
 }).catch(function(e){
  toast("导入失败："+(e&&e.message||"格式不对"));
 });
}
/* 打开带 #save= 的链接时提示导入 */
window.addEventListener("load",function(){
 var hash=location.hash||"";
 if(hash.indexOf("save=")<0)return;
 try{
  var code=decodeURIComponent(hash.split("save=")[1]||"");
  if(code.indexOf(SAVE_PREFIX)!==0)return;
  if(!window.confirm("检测到一条存档链接，导入进度后页面会刷新。现在导入吗？"))return;
  applySaveCode(code).then(function(n){
   try{history.replaceState(null,"",location.pathname+location.search)}catch(e){}
   toast("已导入 "+n+" 项进度，正在刷新…");
   window.setTimeout(function(){location.reload()},600);
  }).catch(function(e){toast("存档导入失败："+(e&&e.message||"格式不对"))});
 }catch(e){}
});
