/* ============================================================================
 * 03-lesson-format.js — 知识点排版：讲义富文本增强（重点高亮 / 术语 / 代码标记）
 * 加载顺序 3/12：按编号顺序加载
 * 注意：本站是经典 <script>（非 ES Module），所有 js/ 文件共享同一个全局作用域，
 *       编号即加载顺序；调整顺序或拆合并文件前请先读 docs/ARCHITECTURE.md。
 * ========================================================================== */
/* ==== 知识点重点标记 ==== */
var LESSON_CODE_RE=/#include\s*&lt;[^&]{1,40}&gt;|#define\b|-std=c\d+|\b(?:printf|scanf|fgets|fputs|fopen|fclose|malloc|free|sizeof|typedef|struct|union|enum|return|while|for|switch|break|continue|goto|strlen|strcpy|strcmp) \b|\b(?:stdio|stdbool|stdint|stdlib|string|math|ctype|time)\.h\b|\b(?:int|char|float|double|long|short|void|unsigned|signed|const|static|extern|volatile)\b|\b(?:main|argc|argv)\b|\b(?:gcc|F11|F9|Dev-C\+\+)\b|%(?:d|s|f|lf|ld|c|u|x|p)|\b[A-Za-z0-9_]+\.(?:c|h|exe)\b|\b0x[0-9a-fA-F]+\b|\\n/g;
function fmtLesson(raw){
 if(raw===undefined||raw===null)return "";
 var out=esc(String(raw));
 out=out.replace(/\*\*([^*\n]{1,60})\*\*/g,'<mark class="kp-strong">$1</mark>');
 out=out.replace(/==([^=\n]{1,60})==/g,'<mark class="kp-hl">$1</mark>');
 out=out.replace(/!!([^!\n]{1,60})!!/g,'<span class="kp-warn">$1</span>');
 out=out.replace(/「([^」\n]{1,50})」/g,'<span class="kp-term">「$1」</span>');
 out=out.replace(LESSON_CODE_RE,function(m){return '<code class="kp-code">'+m+'</code>'});
 return out.split("\n").map(function(line){
  var plain=line.replace(/<[^>]*>/g,"");
  if(/^\s*(注意|易错|常见错误|坑|不要|必须|一定要|记住|核心|关键|重点)/.test(plain))return '<span class="kp-warn-line">'+line+'</span>';
  return line;
 }).join("\n");
}
function fmtInline(raw){
 if(raw===undefined||raw===null)return "";
 var out=esc(String(raw));
 out=out.replace(/\*\*([^*\n]{1,60})\*\*/g,'<mark class="kp-strong">$1</mark>');
 out=out.replace(/「([^」\n]{1,50})」/g,'<span class="kp-term">「$1」</span>');
 out=out.replace(LESSON_CODE_RE,function(m){return '<code class="kp-code">'+m+'</code>'});
 return out;
}

function renderBeginnerGuide(l){
 const g=l.beginner;if(!g)return "";
 function list(title,items){return '<section class="guide-card"><h3>'+title+'</h3><ol class="guide-list">'+items.map(function(item){return '<li>'+esc(item)+'</li>'}).join("")+'</ol></section>'}
 return '<div class="beginner-guide"><div class="guide-heading">零基础拆解 · 不用急着背</div><div class="guide-idea"><div class="challenge-label">先抓住这一件事</div><p>'+esc(g.idea)+'</p></div><div class="guide-columns">'+list("示例逐步读",g.read)+list("挑战按这几步写",g.steps)+'</div><div class="guide-pitfall"><strong>新手易错点</strong><span>'+esc(g.pitfall)+'</span></div></div>';
}
function switchPage(p){
 page=p||"home";
 activeLevel=null;
 render();
 var small=!!(window.matchMedia&&window.matchMedia("(max-width: 900px)").matches);
 window.scrollTo({top:0,behavior:small?"auto":"smooth"});
}
function navTitle(){
 const n="学习工具 · "+currentCourse().name;
 const labels={
  home:"尘狩  /  个人作品集",
  work:"尘狩  /  作品 · "+((typeof currentWork==="function"&&currentWork())?currentWork().name:"学习工具"),
  author:"尘狩  /  关于作者",
  courses:"学习工具  /  学习课程",
  map:n+"  /  学习路线",
  practice:n+"  /  继续挑战",
  summary:n+"  /  我的总结",
  lesson:n+"  /  当前关卡",
  project:"学习工具  /  7 天项目",
  about:"学习工具  /  关于 / 许可"
 };
 document.getElementById("topTitle").textContent=labels[page]||labels.home;
}
