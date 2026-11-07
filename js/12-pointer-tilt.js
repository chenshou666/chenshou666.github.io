/* ============================================================================
 * 12-pointer-tilt.js — 指针跟随倾斜：卡片随鼠标位置 3D 转动（触屏与 reduced-motion 自动关闭）
 * 加载顺序 12/13：按编号顺序加载
 * 注意：本站是经典 <script>（非 ES Module），所有 js/ 文件共享同一个全局作用域，
 *       编号即加载顺序；调整顺序或拆合并文件前请先读 docs/ARCHITECTURE.md。
 * ========================================================================== */
/* ==== 指针跟随倾斜（卡片随鼠标位置转动） ==== */
(function(){
 if(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
 var SEL=".level-card,.course-card,.stat,.course-entry,.side-card,.guide-card,.skill-row,.summary-hero";
 var MAX_X=7,MAX_Y=9;
 var active=null,frame=0,px=0,py=0;
 function paint(){
  frame=0;
  if(!active)return;
  var r=active.getBoundingClientRect();
  if(!r.width||!r.height)return;
  var nx=(px-r.left)/r.width, ny=(py-r.top)/r.height;
  if(nx<-.22||nx>1.22||ny<-.22||ny>1.22)return;
  active.style.setProperty("--ry",((nx-.5)*MAX_Y*2).toFixed(2)+"deg");
  active.style.setProperty("--rx",((.5-ny)*MAX_X*2).toFixed(2)+"deg");
  active.style.setProperty("--gx",(nx*100).toFixed(1)+"%");
  active.style.setProperty("--gy",(ny*100).toFixed(1)+"%");
 }
 function leave(){
  if(active){
   active.classList.remove("tilting");
   active.style.setProperty("--rx","0deg");
   active.style.setProperty("--ry","0deg");
   active=null;
  }
 }
 document.addEventListener("pointermove",function(e){
  if(e.pointerType&&e.pointerType!=="mouse")return;
  var card=e.target.closest?e.target.closest(SEL):null;
  if(card!==active){leave();active=card;if(active)active.classList.add("tilting")}
  if(!active)return;
  px=e.clientX;py=e.clientY;
  if(!frame)frame=requestAnimationFrame(paint);
 },{passive:true});
 document.addEventListener("pointerout",function(e){ if(!e.relatedTarget)leave(); },true);
 document.addEventListener("pointercancel",leave,true);
 window.addEventListener("blur",leave);
 document.addEventListener("scroll",function(){ if(active){var r=active.getBoundingClientRect();if(r.bottom<0||r.top>window.innerHeight)leave();} },{passive:true});
})();
