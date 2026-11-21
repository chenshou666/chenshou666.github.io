/* ============================================================================
 * 10-splash.js — 开场动画：开屏 splash 落位与跳过逻辑
 * 加载顺序 10/13：按编号顺序加载
 * 注意：本站是经典 <script>（非 ES Module），所有 js/ 文件共享同一个全局作用域，
 *       编号即加载顺序；调整顺序或拆合并文件前请先读 docs/ARCHITECTURE.md。
 * ========================================================================== */
(function(){
 const splash=document.getElementById("splash-screen"),skip=document.getElementById("splash-skip"),app=document.querySelector(".app");if(!splash||!app)return;
 let launched=false;const reduced=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 const targetSelector=".sidebar,.topbar,.brand,.nav-btn,.side-card,.streak,.page-header,.hero-main,.hero-progress,.stat,.course-card,.course-entry,.section-head,.course-route-heading,.track-head,.track,.level-card,.panel,.summary-hero,.footer-note,.lesson-layout,.exercise,.about-panel";

 function revealInterface(){
  if(launched)return;launched=true;window.clearTimeout(revealTimer);window.clearTimeout(skipTimer);
  const targets=Array.from(app.querySelectorAll(targetSelector)).filter(function(el){return !el.parentElement.closest(targetSelector)});
  targets.forEach(function(el,index){
   el.style.setProperty("--drop-delay",(index*72+(Math.random()*55|0))+"ms");
   if(el.classList.contains("sidebar")||el.classList.contains("topbar")){
    el.classList.add("slide-across");return;
   }
   el.classList.add("drop-in");
   el.style.setProperty("--drop-from",(-70-Math.random()*55).toFixed(0)+"vh");
   el.style.setProperty("--drop-rot",((Math.random()*2-1)*4).toFixed(1)+"deg");
  });
  app.classList.add("interface-reveal");document.body.classList.remove("splash-active");splash.classList.add("is-leaving");window.removeEventListener("keydown",onSplashKey);
  window.setTimeout(function(){splash.remove()},520);
  if(!reduced){window.setTimeout(dropFinalLogo,240);}
  window.setTimeout(function(){app.classList.remove("interface-reveal");targets.forEach(function(el){el.classList.remove("drop-in");el.classList.remove("slide-across");el.style.removeProperty("--drop-delay")})},4800);
 }
 function dropFinalLogo(){
  var el=document.createElement("div");el.className="final-logo";el.setAttribute("aria-hidden","true");el.textContent="HT";
  document.body.appendChild(el);
  window.setTimeout(function(){el.remove()},3300);
 }
 function onSplashKey(event){if(event.key==="Escape")revealInterface()}
 const skipTimer=window.setTimeout(function(){splash.classList.add("can-skip")},reduced?0:1100);
 const revealTimer=window.setTimeout(revealInterface,reduced?120:1400);

 if(skip)skip.addEventListener("click",revealInterface);window.addEventListener("keydown",onSplashKey);
})();

