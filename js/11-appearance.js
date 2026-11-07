/* ============================================================================
 * 11-appearance.js — 外观设置面板：天空预设、玻璃模糊/不透明度/圆角/噪点/边缘高光（localStorage: cquest.appearance.v1）
 * 加载顺序 11/13：按编号顺序加载
 * 注意：本站是经典 <script>（非 ES Module），所有 js/ 文件共享同一个全局作用域，
 *       编号即加载顺序；调整顺序或拆合并文件前请先读 docs/ARCHITECTURE.md。
 * ========================================================================== */
/* ==== 外观设置（可调节，保存在本机） ==== */
const AP_KEY="cquest.appearance.v1";
const AP_DEF={sky:"noon",blur:24,tint:54,radius:22,noise:3.0,edge:72};
const AP_SKY={dawn:{glyph:"☀",name:"晨曦"},noon:{glyph:"◐",name:"正午"},dusk:{glyph:"☾",name:"黄昏"},night:{glyph:"★",name:"夜空"}};
function apLoad(){try{return Object.assign({},AP_DEF,JSON.parse(localStorage.getItem(AP_KEY)||"{}"))}catch(e){return Object.assign({},AP_DEF)}}
function apSave(a){try{localStorage.setItem(AP_KEY,JSON.stringify(a))}catch(e){}}
function apApply(a){
 const h=document.documentElement;a=a||apLoad();
 h.setAttribute("data-sky",AP_SKY[a.sky]?a.sky:"noon");
 h.style.setProperty("--glass-blur",a.blur+"px");
 h.style.setProperty("--glass-alpha",(a.tint/100).toFixed(2));
 h.style.setProperty("--glass-alpha-n",Math.max(.06,(a.tint/100)*0.22).toFixed(2));
 h.style.setProperty("--r-xl",(Number(a.radius)+8)+"px");
 h.style.setProperty("--r-l",a.radius+"px");
 h.style.setProperty("--r-m",Math.max(9,Number(a.radius)-6)+"px");
 h.style.setProperty("--noise",(a.noise/100).toFixed(3));
 h.style.setProperty("--edge",(a.edge/100).toFixed(2));
 window.__ap=a;
}
function apPatch(patch){const a=Object.assign(apLoad(),patch);apSave(a);apApply(a);apRefresh();}
function apReset(){try{localStorage.removeItem(AP_KEY)}catch(e){}apApply(apLoad());apRefresh();toast("外观已恢复默认。")}
function apCycleSky(){const keys=["dawn","noon","dusk","night"];const cur=(window.__ap||apLoad()).sky;const next=keys[(keys.indexOf(cur)+1)%4];apPatch({sky:next});toast("天空：" + AP_SKY[next].name);}
function apToggleSheet(){const el=document.getElementById("apSheet");if(!el)return;el.classList.toggle("open");if(el.classList.contains("open"))apRefresh()}
function apRefresh(){
 const a=window.__ap||apLoad();
 const el=document.getElementById("apSheet");if(!el)return;
 const set=(sel,v)=>{const n=el.querySelector(sel);if(n)n.textContent=v};
 set("#apBlurV",a.blur+"px");set("#apTintV",a.tint+"%");set("#apRadV",a.radius+"px");set("#apNoiseV",a.noise+"%");set("#apEdgeV",a.edge+"%");
 ["dawn","noon","dusk","night"].forEach(function(k){const b=el.querySelector('[data-sky="'+k+'"]');if(b)b.classList.toggle("on",a.sky===k)});
}
function apBuild(){
 try{apApply(apLoad())}catch(e){}
 if(document.getElementById("apFab"))return;
 const fab=document.createElement("button");fab.id="apFab";fab.className="ap-fab";fab.type="button";
 fab.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="3.2"/><path d="M12 3.2v2.2M12 18.6v2.2M3.2 12h2.2M18.6 12h2.2M5.8 5.8l1.6 1.6M16.6 16.6l1.6 1.6M18.2 5.8l-1.6 1.6M7.4 16.6l-1.6 1.6"/></svg><span>外观</span>';
 fab.addEventListener("click",apToggleSheet);
 document.body.appendChild(fab);
 const sheet=document.createElement("div");sheet.id="apSheet";sheet.className="ap-sheet";
 sheet.innerHTML='<div class="ap-title">外观设置 · 可调</div>'
  +'<div class="ap-row"><div class="ap-label"><span>天空</span><b id="apSkyV"></b></div><div class="ap-sky">'
  +'<button class="ap-chip" data-sky="dawn" type="button">晨曦</button>'
  +'<button class="ap-chip" data-sky="noon" type="button">正午</button>'
  +'<button class="ap-chip" data-sky="dusk" type="button">黄昏</button>'
  +'<button class="ap-chip" data-sky="night" type="button">夜空</button></div></div>'
  +'<div class="ap-row"><div class="ap-label"><span>玻璃模糊</span><b id="apBlurV"></b></div><input class="ap-range" id="apBlur" type="range" min="0" max="40" step="1"></div>'
  +'<div class="ap-row"><div class="ap-label"><span>玻璃不透明度</span><b id="apTintV"></b></div><input class="ap-range" id="apTint" type="range" min="20" max="85" step="1"></div>'
  +'<div class="ap-row"><div class="ap-label"><span>圆角</span><b id="apRadV"></b></div><input class="ap-range" id="apRad" type="range" min="10" max="34" step="1"></div>'
  +'<div class="ap-row"><div class="ap-label"><span>噪点</span><b id="apNoiseV"></b></div><input class="ap-range" id="apNoise" type="range" min="0" max="8" step="0.5"></div>'
  +'<div class="ap-row"><div class="ap-label"><span>边缘高光</span><b id="apEdgeV"></b></div><input class="ap-range" id="apEdge" type="range" min="0" max="100" step="1"></div>'
  +'<div class="ap-actions"><button class="ap-btn" id="apReset" type="button">恢复默认</button><button class="ap-btn" id="apClose" type="button">收起</button></div>'
  +'<div class="ap-note">设置只保存在这台设备的浏览器里。天空预设同时决定深浅色。</div>';
 document.body.appendChild(sheet);
 const a=apLoad();
 /* 事件委托：面板内所有交互统一处理，避免逐元素绑定失效 */
 sheet.addEventListener("click",function(e){
  var chip=e.target.closest(".ap-chip");
  if(chip&&chip.dataset.sky){apPatch({sky:chip.dataset.sky});return}
  if(e.target.closest("#apReset")){apReset();return}
  if(e.target.closest("#apClose")){apToggleSheet();return}
 });
 sheet.addEventListener("input",function(e){
  var map={apBlur:"blur",apTint:"tint",apRad:"radius",apNoise:"noise",apEdge:"edge"};
  var key=map[e.target.id];if(!key)return;
  var o={};o[key]=Number(e.target.value);apPatch(o);
 });
 document.addEventListener("click",function(e){
  var sh=document.getElementById("apSheet");if(!sh||!sh.classList.contains("open"))return;
  var fabEl=document.getElementById("apFab");
  if(sh.contains(e.target)||(fabEl&&fabEl.contains(e.target)))return;
  sh.classList.remove("open");
 });
 apRefresh();
 apApply(apLoad());
}
/* 定义完成后再初始化外观面板 */
try{apBuild()}catch(e){console.error("外观面板初始化失败",e)}


