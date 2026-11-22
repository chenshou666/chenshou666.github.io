/* ============================================================================
 * 05-views.js — 页面渲染：render 路由、个人作品集（首页/作品详情/关于作者）、课程页、闯关地图、关于页、继续挑战页、C 语言关卡页
 * 加载顺序 5/13：按编号顺序加载
 * 注意：本站是经典 <script>（非 ES Module），所有 js/ 文件共享同一个全局作用域，
 *       编号即加载顺序；调整顺序或拆合并文件前请先读 docs/ARCHITECTURE.md。
 * ========================================================================== */

const PORTFOLIO_DATA={
 author:"尘狩",
 role:"贵州师范学院 · 电子信息科学与技术 · 学生",
 tagline:"用 AI 辅助把想法做成打开就能玩的作品：从学习工具到纯代码影像实验。",
 bio:"贵州师范学院电子信息科学与技术专业学生。日常借助 AI 工具协作完成前端与创意编程作品：把抽象的想法做成打开即用、可以交互、可以看完的东西——「学习工具」学习站和「代码影院」系列都是这样诞生的。",
 focus:"近期没有特别明确的目标，主要在继续打磨作品集和已有两个作品；如果你有想法、反馈或合作意向，欢迎通过下面的方式联系我。",
 githubUrl:"https://github.com/chenshou666/chenshou666.github.io",
 githubLabel:"github.com/chenshou666/chenshou666.github.io",
 skills:[
  {group:"前端与界面",items:["HTML5 / CSS3","Vanilla JavaScript","Canvas 2D 动画","响应式与移动端适配","液态玻璃视觉设计"]},
  {group:"编程与基础",items:["C 语言（C11）","数据结构与算法基础","静态语法与结构校验","离线数据与编码压缩"]},
  {group:"工程与交付",items:["零构建纯静态架构","file:// 本地离线运行","GitHub Pages 部署","文档与结构化维护"]}
 ],
 works:[
  {
   id:"ht-lab",
   mark:"学",
   kind:"互动学习站",
   name:"学习工具",
   subtitle:"纯前端闯关式交互学习站（C 语言 86 关 + 英语四级 62 关）",
   summary:"一款零后端、零构建、双击即可离线运行的静态学习应用。内置 C 语言与英语四级两门完整课程，提供讲义高亮、交互测验、浏览器端 C 代码结构检查、本机运行输出逐行比对、46 段本地听力与示范音频、跟读录音自评、学习点数与跨设备存档码迁移。",
   badge:"可离线使用",
   ctaLabel:"进入学习课程",
   ctaAction:"enter-lab",
   features:[
    {title:"148 关完整学习路线",desc:"C 语言 11 模块 86 关（起步到系统底层与综合项目）+ 英语四级 7 模块 62 关（地基、听力、阅读、写作、翻译、口语与全真模考），两门课进度独立。"},
    {title:"浏览器端 C 语法与结构检查",desc:"自研轻量词法/语法分析与规格校验引擎，配合带行号与语法着色的代码编辑器，以及本机运行输出逐行比对流程。"},
    {title:"四级听说读写全任务引擎",desc:"内置 46 段本地离线 mp3 音频、原文展开、写作/翻译要点词数判分、口语录音与跟读自评清单、模考倒计时自动交卷。"},
    {title:"7 天小作品支线",desc:"以控制台记账本为线索，把输入输出、数组、字符串、函数、指针与文件存储拆成 7 天可编译运行的阶段任务。"},
    {title:"免登录跨设备存档迁移",desc:"全部进度仅保存于本机 localStorage，支持 JSON 导出导入、Gzip 压缩 HT1 存档码与 #save= 分享链接恢复。"},
    {title:"液态玻璃单 UI 体验",desc:"深空极光 Canvas 2D 画布、玻璃质感组件、View Transitions 页面切换动画、自动收起底部 Dock 与移动端适配。"}
   ],
   stack:["Vanilla HTML/CSS/JS","Canvas 2D","Web Audio / MediaRecorder","View Transitions API","localStorage","CompressionStream (Gzip)","file:// 离线运行","GitHub Pages"]
  },
  {
   id:"code-cinema",
   mark:"影",
   kind:"代码生成影像",
   name:"代码影院 · Code Cinema",
   subtitle:"4 部纯代码实时生成的短片与视觉诗（WebGL / GLSL + Web Audio）",
   summary:"同一个创作思路的四个实验：不用任何图片、模型或音频素材，画面与配乐全部由代码实时生成。包括水墨微电影《墨韵山河》、生成式电影引擎 PURE CODE CINEMA、1080p60 光学视觉诗《万物同构》，以及实时生成影院《纯代码视界》。每部都是可离线运行的单文件演示，支持自定义片头与录制导出视频。",
   badge:"4 部作品",
   metrics:[
    {v:"4 部",l:"短片 / 视觉诗"},
    {v:"100% 实时",l:"代码生成画面"},
    {v:"0 素材",l:"无图片/音频文件"},
    {v:"WebGL",l:"GLSL + Web Audio"}
   ],
   demos:[
    {name:"墨韵山河 · INK & MIST",subtitle:"3D 写实水墨微电影（GLSL 光线步进）",desc:"40 秒水墨正片：山川、云雾与光影全部由 GLSL 光线步进实时计算，配合 Web Audio 合成配乐；可自定义开场提示词与结尾朱砂篆印，一键录制导出。",href:"works/player.html?w=ink-mist",tags:["水墨","GLSL 光线步进","40 秒","录屏导出"]},
    {name:"PURE CODE CINEMA",subtitle:"零依赖生成式电影引擎",desc:"36 秒五幕编舞（奇点 → 形变 → 超空间 → 超新星 → GEMINI），Web Audio 实时合成 128 BPM 配乐，0 字节外部素材，支持 1080p / 720p WebM 导出。",href:"works/player.html?w=pure-code-cinema",tags:["生成式电影","五幕","128 BPM","0 素材"]},
    {name:"万物同构 · ISOMORPHISM",subtitle:"1080p60 电影感视觉诗（WebGL2 多通道）",desc:"六章同构视觉诗：虹膜⇄星云、蛛网⇄神经、闪电⇄脉络⇄江河、飓风⇄鹦鹉螺⇄星系、玄武岩⇄蜂巢⇄石墨烯、水波⇄时空⇄归瞳；多通道光学渲染 + 电影原声。",href:"works/player.html?w=isomorphism",tags:["WebGL2 多通道","六章","1080p60"]},
    {name:"纯代码视界 · ZERO PIXELS",subtitle:"100% 实时代码生成影院",desc:"六大乐章（创世 / 四维 / 物理 / 律动 / 光追 …）全部实时生成，把傅里叶、四维、引力、声谱与光追等抽象主题变成可看可听的画面；支持停止并保存导出。",href:"works/player.html?w=zero-pixels",tags:["傅里叶","四维","光追","六乐章"]}
   ],
   features:[
    {title:"画面 100% 由代码生成",desc:"不加载任何图片、贴图、3D 模型或音频文件：山峦、云雾、光线、粒子与节奏全部是 GLSL/WebGL 的实时计算结果。"},
    {title:"声音也由代码合成",desc:"四部作品都用 Web Audio 在浏览器里实时合成配乐、音效与节拍，画面与声音同源，天然同步。"},
    {title:"单文件、离线可运行",desc:"每部都是一个独立 HTML 文件，双击即可播放，不依赖框架、构建工具或后端，方便分享与二次创作。"},
    {title:"可定制 + 录制导出",desc:"支持自定义片头提示词 / 落款、9:16 与 16:9 画幅、画质档位，并可用 MediaRecorder 一键导出视频。"}
   ],
   stack:["Vanilla JavaScript","WebGL2 / GLSL 光线步进","Web Audio 合成","MediaRecorder 录屏","requestAnimationFrame","零素材单文件"]
  },
  {
   id:"stickman-training",
   mark:"游",
   kind:"小游戏合集",
   name:"游戏",
   subtitle:"横屏小游戏合集 · 第一部《火柴人训练营 · 疾风忍刀》",
   summary:"这里收录我做的小游戏，可能不只有火柴人：第一部是零依赖的横屏格斗《火柴人训练营》，用 Canvas 2D 手绘火柴人骨架与刀光，击败蓝方机器人；包含普攻四连、瞬步·居合、旋风升龙、影袭·燕返四个技能，带冷却与连击判定、血条 HUD、手机虚拟摇杆与技能键，也支持键盘操作。",
   badge:"可游玩",
   metrics:[
    {v:"1 部",l:"当前小游戏"},
    {v:"4 个技能",l:"火柴人连招"},
    {v:"横屏",l:"手机 / 桌面均可"},
    {v:"0 依赖",l:"纯 Canvas 2D"}
   ],
   ctaLabel:"在线试玩 ↗",
   ctaHref:"works/stickman-training/index.html",
   external:true,
   features:[
    {title:"小游戏合集 · 从火柴人开始",desc:"目前是《火柴人训练营》一部，后续会继续加入新的小游戏；全部零依赖，打开即玩。"},
    {title:"四技能连招系统",desc:"普攻四连、瞬步·居合、旋风升龙、影袭·燕返，各自带冷却、位移与击飞判定，支持手机虚拟按键和键盘 1/2/3/4。"},
    {title:"横屏格斗 HUD",desc:"双方血条、武器名、回合提示与冷却圈实时刷新；手机竖屏时提示旋转，横屏后自动隐藏提示。"},
    {title:"零依赖单目录",desc:"HTML + CSS + 4 个经典脚本，双击 index.html 即可游玩，不需要构建、后端或任何外部资源。"}
   ],
   stack:["Vanilla JavaScript","Canvas 2D","requestAnimationFrame","Touch / Keyboard Input","零依赖单目录"]
  }
 ],
};

var selectedWorkId="ht-lab";

function currentWork(){
 var list=PORTFOLIO_DATA.works||[];
 for(var i=0;i<list.length;i++){if(list[i].id===selectedWorkId)return list[i]}
 return list[0];
}

function portfolioStats(){
 var total=0,done=0,xp=0;
 COURSES.forEach(function(c){
  var ls=courseLevels[c.id]||[],st=stores[c.id]||{completed:{},xp:0};
  total+=ls.length;
  done+=Object.keys(st.completed||{}).length;
  xp+=Number(st.xp||0);
 });
 return {total:total,done:done,xp:xp,pct:total?Math.round(done/total*100):0};
}

function syncZoneChrome(){
 var inPortfolio=!activeLevel&&(page==="home"||page==="work"||page==="author");
 document.body.dataset.zone=inPortfolio?"portfolio":"lab";
 var backBtn=document.getElementById("backPortfolioBtn");
 if(backBtn)backBtn.hidden=inPortfolio;
}

function renderPortfolio(){
 var st=portfolioStats();
 var qq=typeof CONTACT_QQ_GROUP!=="undefined"?CONTACT_QQ_GROUP:"";
 var works=PORTFOLIO_DATA.works||[];
 var cards=works.map(function(w){
  var metrics;
  if(w.id==="ht-lab"){
   metrics=''
    +'<div class="pf-metric"><strong>'+st.total+' 关</strong><span>完整关卡</span></div>'
    +'<div class="pf-metric"><strong>'+COURSES.length+' 门课</strong><span>C 语言 · 四级</span></div>'
    +'<div class="pf-metric"><strong>纯前端</strong><span>无构建零依赖</span></div>'
    +'<div class="pf-metric"><strong>可离线</strong><span>双击即可运行</span></div>';
  }else{
   metrics=(w.metrics||[]).map(function(m){return '<div class="pf-metric"><strong>'+esc(m.v)+'</strong><span>'+esc(m.l)+'</span></div>'}).join("");
  }
  var extraActions='';
  if(w.ctaHref){
   extraActions+='<a class="btn btn-soft" href="'+esc(w.ctaHref)+'" target="_blank" rel="noopener">'+esc(w.ctaLabel)+'</a>';
  }else if(w.ctaAction){
   extraActions+='<button class="btn btn-ghost" type="button" data-action="'+esc(w.ctaAction)+'">'+esc(w.ctaLabel)+'</button>';
  }
  return ''
   +'<article class="panel pf-work-card">'
    +'<div class="pf-work-mark" aria-hidden="true">'+esc(w.mark)+'</div>'
    +'<div class="pf-work-main">'
     +'<div class="pf-work-head">'
      +'<div><div class="eyebrow">FEATURED WORK · '+esc(w.kind)+'</div><h3>'+esc(w.name)+'</h3></div>'
      +'<span class="chip">'+esc(w.badge)+'</span>'
     +'</div>'
     +'<p class="pf-work-desc">'+esc(w.summary)+'</p>'
     +'<div class="pf-work-metrics">'+metrics+'</div>'
     +(w.id==="ht-lab"
       ?'<div class="pf-work-progress"><div class="pf-progress-meta"><span>本设备累计学习进度</span><span>'+st.done+' / '+st.total+' 关（'+st.pct+'%） · '+st.xp+' 学习点</span></div><div class="progress-bar"><i style="width:'+st.pct+'%"></i></div></div>'
       :'')
     +'<div class="pf-work-actions">'
      +'<button class="btn btn-primary" type="button" data-action="open-work" data-work="'+esc(w.id)+'">查看作品 →</button>'
      +extraActions
     +'</div>'
    +'</div>'
   +'</article>';
 }).join("");
 document.getElementById("view").innerHTML=''
  +'<section class="panel pf-hero">'
   +'<div class="page-header pf-hero-head">'
    +'<div>'
     +'<div class="eyebrow">PERSONAL PORTFOLIO · '+esc(PORTFOLIO_DATA.role)+'</div>'
     +'<h1>'+esc(PORTFOLIO_DATA.author)+'</h1>'
     +'<p class="subhead pf-tagline">'+esc(PORTFOLIO_DATA.tagline)+'</p>'
    +'</div>'
    +'<span class="chip pf-badge">在线作品集</span>'
   +'</div>'
   +'<div class="pf-hero-actions">'
    +'<button class="btn btn-primary" type="button" data-action="open-work" data-work="ht-lab">查看代表作品 →</button>'
    +'<button class="btn btn-soft" type="button" data-action="enter-lab">直接进入学习工具</button>'
    +'<button class="btn btn-ghost" type="button" data-action="open-author">关于作者</button>'
   +'</div>'
  +'</section>'
  +'<div class="section-head"><div><h2>精选作品</h2><p>目前上线 '+works.length+' 个完整交互作品，点进即可查看详情或直接体验全部功能。</p></div><span class="chip">'+works.length+' 个作品</span></div>'
  +cards
  +'<section class="panel pf-about-strip">'
   +'<div>'
    +'<div class="challenge-label">关于与联系</div>'
    +'<p class="challenge-copy">查看作者「'+esc(PORTFOLIO_DATA.author)+'」的简介、技能栈，或通过 GitHub 与学习交流群联系与反馈。</p>'
   +'</div>'
   +'<div class="pf-work-actions">'
    +'<button class="btn btn-soft btn-small" type="button" data-action="open-author">关于作者 →</button>'
    +(qq?'<button class="btn btn-ghost btn-small" type="button" data-action="copy-qq-group">复制交流群号：'+esc(qq)+'</button>':'')
    +'<a class="btn btn-ghost btn-small" href="'+esc(PORTFOLIO_DATA.githubUrl)+'" target="_blank" rel="noopener">GitHub 仓库</a>'
   +'</div>'
  +'</section>'
  +'<div class="footer-note">Copyright © 2026 '+esc(PORTFOLIO_DATA.author)+' · 作品集内置「学习工具」完整学习功能，全部进度仅保存于本设备浏览器。</div>';
}

function renderWorkDetail(){
 var st=portfolioStats();
 var w=currentWork();
 var isLab=(w.id==="ht-lab");
 var courseSummary=isLab?COURSES.map(function(c){
  var ls=courseLevels[c.id]||[],gs=courseGroups[c.id]||[],cs=stores[c.id]||{completed:{}},dn=Object.keys(cs.completed||{}).length,pc=ls.length?Math.round(dn/ls.length*100):0;
  return '<div class="pf-course-row">'
   +'<div class="pf-course-row-top"><strong>'+esc(c.name)+'</strong><span>'+gs.length+' 模块 · '+ls.length+' 关 · 已通 '+dn+' 关（'+pc+'%）</span></div>'
   +'<div class="progress-bar"><i style="width:'+pc+'%"></i></div>'
  +'</div>';
 }).join(""):"";
 var metrics=isLab
  ?'<div class="pf-metric"><strong>'+st.total+' 关</strong><span>总课程关卡</span></div>'
    +'<div class="pf-metric"><strong>'+COURSES.length+' 门课</strong><span>作品内含课程</span></div>'
    +'<div class="pf-metric"><strong>46 段</strong><span>本地离线音频</span></div>'
    +'<div class="pf-metric"><strong>'+st.pct+'%</strong><span>当前设备总进度</span></div>'
  :(w.metrics||[]).map(function(m){return '<div class="pf-metric"><strong>'+esc(m.v)+'</strong><span>'+esc(m.l)+'</span></div>'}).join("");
 var featuresHtml=(w.features||[]).map(function(f){
  return '<div class="pf-feature-item"><h3>'+esc(f.title)+'</h3><p>'+esc(f.desc)+'</p></div>';
 }).join("");
 var tagsHtml=(w.stack||[]).map(function(t){
  return '<span class="pf-tag">'+esc(t)+'</span>';
 }).join("");
 var demosHtml=(w.demos||[]).map(function(d,i){
  return '<article class="pf-demo-item">'
   +'<div class="pf-demo-index">'+String(i+1).padStart(2,"0")+'</div>'
   +'<div class="pf-demo-body">'
    +'<div class="pf-demo-head"><h3>'+esc(d.name)+'</h3><span class="pf-demo-sub">'+esc(d.subtitle)+'</span></div>'
    +'<p class="pf-demo-desc">'+esc(d.desc)+'</p>'
    +'<div class="pf-demo-foot">'
     +'<div class="pf-tags">'+(d.tags||[]).map(function(t){return '<span class="pf-tag">'+esc(t)+'</span>'}).join("")+'</div>'
     +'<a class="btn btn-primary btn-small" href="'+esc(d.href)+'" target="_blank" rel="noopener">在线体验 ↗</a>'
    +'</div>'
   +'</div>'
  +'</article>';
 }).join("");
 var actions=isLab
  ?'<button class="btn btn-primary" type="button" data-action="enter-lab">进入作品开始学习 →</button><button class="btn btn-ghost" type="button" data-page="about">查看许可与免责</button>'
  :(w.ctaHref? '<a class="btn btn-primary" href="'+esc(w.ctaHref)+'" target="_blank" rel="noopener">'+esc(w.ctaLabel)+'</a>':'')
   +'<button class="btn btn-ghost" type="button" data-page="home">← 返回作品集</button>';
 document.getElementById("view").innerHTML=''
  +'<div class="page-header">'
   +'<div><div class="eyebrow">WORK DETAIL · 作品详情</div><h1>'+esc(w.name)+'</h1><p class="subhead">'+esc(w.subtitle)+'</p></div>'
   +'<button class="btn btn-ghost btn-small" type="button" data-page="home">← 返回作品集</button>'
  +'</div>'
  +'<section class="panel pf-detail-hero">'
   +'<div class="challenge-head"><div class="challenge-label">项目介绍</div><span class="chip">'+esc(w.badge||"作品")+'</span></div>'
   +'<p class="lesson-copy">'+esc(w.summary)+'</p>'
   +'<div class="pf-work-metrics">'+metrics+'</div>'
   +(courseSummary?'<div class="pf-course-summary">'+courseSummary+'</div>':'')
   +'<div class="pf-work-actions">'+actions+'</div>'
  +'</section>'
  +'<section class="panel">'
   +'<div class="challenge-head"><div class="challenge-label">做了什么</div><span class="chip">核心能力</span></div>'
   +'<div class="pf-feature-grid">'+featuresHtml+'</div>'
  +'</section>'
  +(demosHtml?'<section class="panel">'
   +'<div class="challenge-head"><div class="challenge-label">系列作品 · 逐部体验</div><span class="chip">'+w.demos.length+' 部</span></div>'
   +'<div class="pf-demo-list">'+demosHtml+'</div>'
  +'</section>':'')
  +'<section class="panel">'
   +'<div class="challenge-head"><div class="challenge-label">技术栈与约束</div><span class="chip">'+(isLab?"Zero Build":"Single File")+'</span></div>'
   +'<div class="pf-tags">'+tagsHtml+'</div>'
   +'<p class="challenge-copy" style="margin-top:14px">'+(isLab
     ?'全站不依赖任何打包工具、框架或 CDN，采用固定顺序加载的经典脚本与样式层，在 GitHub Pages 与本地 file:// 协议下均可完整运行。'
     :'四部短片均为独立单文件演示（works/*.html），点开即在新标签页播放，可离线运行；主站本身保持零外部依赖。')+'</p>'
  +'</section>'
  +'<div class="footer-note">'+(isLab?'进入「学习工具」后，顶栏左侧随时可点「← 作品集」回到这里。':'「墨韵山河」在新标签页打开独立演示，关闭标签页即可回到作品集。')+'</div>';
}

function renderAuthor(){
 var qq=typeof CONTACT_QQ_GROUP!=="undefined"?CONTACT_QQ_GROUP:"";
 var skillsHtml=PORTFOLIO_DATA.skills.map(function(s){
  return '<div class="pf-skill-group">'
   +'<div class="pf-skill-title">'+esc(s.group)+'</div>'
   +'<div class="pf-tags">'+s.items.map(function(i){return '<span class="pf-tag">'+esc(i)+'</span>'}).join("")+'</div>'
  +'</div>';
 }).join("");
 document.getElementById("view").innerHTML=''
  +'<div class="page-header">'
   +'<div><div class="eyebrow">ABOUT AUTHOR · 关于作者</div><h1>'+esc(PORTFOLIO_DATA.author)+'</h1><p class="subhead">'+esc(PORTFOLIO_DATA.tagline)+'</p></div>'
   +'<button class="btn btn-ghost btn-small" type="button" data-page="home">← 返回作品集</button>'
  +'</div>'
  +'<div class="pf-author-grid">'
   +'<section class="panel">'
    +'<div class="challenge-head"><div class="challenge-label">作者简介</div><span class="chip">在校学生</span></div>'
    +'<p class="lesson-copy">'+esc(PORTFOLIO_DATA.bio||PORTFOLIO_DATA.bioTodo||"")+'</p>'
    +'<p class="lesson-copy" style="margin-top:10px">'+esc(PORTFOLIO_DATA.focus||PORTFOLIO_DATA.focusTodo||"")+'</p>'
    +'<div class="pf-work-actions" style="margin-top:16px">'
     +'<button class="btn btn-primary btn-small" type="button" data-action="open-work" data-work="ht-lab">查看作品 学习工具 →</button>'
     +'<button class="btn btn-soft btn-small" type="button" data-action="open-work" data-work="code-cinema">查看作品 代码影院 →</button>'
    +'</div>'
   +'</section>'
   +'<section class="panel">'
    +'<div class="challenge-head"><div class="challenge-label">技能与方向</div><span class="chip">Stack</span></div>'
    +'<div class="pf-skill-list">'+skillsHtml+'</div>'
   +'</section>'
  +'</div>'
  +'<section class="panel">'
   +'<div class="challenge-head"><div class="challenge-label">联系方式与交流</div><span class="chip">Contact</span></div>'
   +'<p class="challenge-copy">作品反馈、内容纠错或交流合作，优先加入学习交流 QQ 群，也可以在 GitHub 仓库提交 Issue。</p>'
   +'<div class="pf-contact-list">'
    +'<a class="btn btn-soft btn-small" href="'+esc(PORTFOLIO_DATA.githubUrl)+'" target="_blank" rel="noopener">GitHub：'+esc(PORTFOLIO_DATA.githubLabel)+'</a>'
    +(qq?'<button class="btn btn-primary btn-small" type="button" data-action="copy-qq-group">复制学习交流 QQ 群号：'+esc(qq)+'</button>':'<span class="feedback-soon">交流群筹备中</span>')
    +'<button class="btn btn-ghost btn-small" type="button" data-page="about">版权与许可说明</button>'
   +'</div>'
  +'</section>'
  +'<div class="footer-note">Copyright © 2026 '+esc(PORTFOLIO_DATA.author)+' · 个人作品集与「学习工具」</div>';
}

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
 syncZoneChrome();navTitle();document.getElementById("xpTop").textContent=data.xp;var __navPage=(page==="work")?"home":(page==="author"?"author":page);document.querySelectorAll(".nav-btn").forEach(function(b){b.classList.toggle("active",b.dataset.page===__navPage)});if(activeLevel){renderLesson();ensureNextBar();return}if(page==="home")renderPortfolio();else if(page==="work")renderWorkDetail();else if(page==="author")renderAuthor();else if(page==="courses")renderCourses();else if(page==="map")renderMap();else if(page==="practice")renderPractice();else if(page==="about")renderAbout();else if(page==="project")renderProject();else{renderSummary();ensureProgressTools()}}
function renderCourses(){
 const cards=COURSES.map(function(c){
  const ls=courseLevels[c.id]||[],st=stores[c.id],dn=Object.keys(st.completed).length,pc=ls.length?Math.round(dn/ls.length*100):0,ready=ls.length>0;
  const groups2=courseGroups[c.id]||[];
  return '<button class="course-card'+(ready?"":" is-soon")+'" type="button" data-action="switch-course" data-course="'+c.id+'"><span class="course-card-icon">'+c.glyph+'</span><span class="course-card-body"><strong>'+esc(c.name)+'</strong><small>'+esc(c.sub)+'</small><span class="course-card-meta">'+(ready?(groups2.length+" 个模块 · "+ls.length+" 关 · 已完成 "+dn+" 关（"+pc+"%）"):"即将上线")+'</span><span class="course-card-bar"><i style="width:'+pc+'%"></i></span></span><span class="course-card-go">进入 →</span></button>';
 }).join("");
 document.getElementById("view").innerHTML='<div class="page-header"><div><div class="eyebrow">学习工具</div><h1>学习课程</h1><p class="subhead">选一门课开始闯关。每门课的进度、学习点与总结各自独立保存，互不影响。</p></div></div><div class="course-cards">'+cards+'</div><div class="footer-note">所有学习数据只保存在这台设备的浏览器里，不上传、不跨设备同步。</div>';
}
function renderMap(){
 const pct=progressPct(), done=completedCount(), next=nextLevel();
 let groupsHtml="";
 groups.forEach(function(g){const ls=levels.filter(function(l){return l.stage===g});const finished=ls.filter(isDone).length;groupsHtml+='<section class="track"><div class="track-head"><span class="track-dot"></span><span class="track-title">'+esc(g)+'</span><span class="track-note">'+finished+'/'+ls.length+' 关完成</span></div><div class="level-grid">';
 ls.forEach(function(l){const lockedNow=!unlocked(l)&&!isDone(l),number=String(levels.indexOf(l)+1).padStart(2,"0");const state=isDone(l)?"✓":lockedNow?"🔒":"→";groupsHtml+='<article class="level-card '+(isDone(l)?"completed ":"")+(lockedNow?"locked":"")+'" data-level="'+l.id+'"><div class="level-top"><span class="level-num">'+number+'</span><span class="level-state">'+state+'</span></div><h3>'+esc(l.title)+'</h3><p>'+esc(l.gist)+'</p><div class="level-meta">第 '+number+' 关 · 约 '+l.minutes+' 分钟 · '+(isDone(l)?"已通关":lockedNow?"完成前一关后解锁":"可开始")+'</div></article>'});
 groupsHtml+='</div></section>'});
 const cc=currentCourse();
 document.getElementById("view").innerHTML='<div class="page-header"><div><div class="eyebrow">'+esc(cc.name)+'</div><h1>'+esc(cc.name)+'学习路线</h1><p class="subhead">'+esc(cc.sub)+'</p></div><button class="btn btn-ghost btn-small" data-page="courses">← 返回课程选择</button></div>'+'<section class="hero"><div class="hero-main"><div class="eyebrow">学习工具&nbsp; · &nbsp;'+esc(cc.name)+'</div><h1>'+cc.heroTitle+'</h1><p>'+esc(cc.heroCopy)+'</p><div class="hero-actions"><button class="btn btn-primary" data-action="continue">'+(done?"继续第 "+(next.id)+" 关":"开始第一关")+' <span>→</span></button><span class="hero-link">学一点，过一关，积累成就感</span></div></div><div class="hero-progress"><div class="progress-top"><div><div class="progress-kicker">'+esc(cc.name)+'进度</div><div class="progress-number">'+done+' <span style="font-size:14px;color:#8d99ab;font-weight:600">/ '+levels.length+' 关</span></div></div><div class="progress-ring" style="--pct:'+pct+'%"><span>'+pct+'%</span></div></div><div><div class="progress-bar"><i style="width:'+pct+'%"></i></div><div class="progress-foot"><span>已完成 '+done+' 关</span><span>'+Math.max(0,levels.length-done)+' 关待挑战</span></div></div></div></section>'+
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
  ["版权与名称","Copyright © 2026 学习工具. 保留所有权利。\u300c学习工具\u300d名称、站内标识、站点图标（ht-lab.ico / favicon.svg）与整体视觉设计是作者的标识性资产，不属于免费使用范围；未经事先书面许可，不得把它们用于任何其他项目、产品或服务，也不得以「学习工具」名义发布或宣传任何内容（包括修改版）。"],
  ["免费使用的范围","本站免费供**个人学习**使用：你可以访问、在本机运行、按课程练习，也可以把链接分享给他人；在笔记、作业、博客里引用少量内容并注明「学习工具」出处也可以。除此之外的权利均予保留。"],
  ["禁止的事项","未经作者事先书面许可，不得：① 复制、修改、演绎本站内容后发布或分发（包括改一改再发布、换个名字再发布）；② 将本站内容用于任何商业目的（售卖、付费课程、付费社群、培训收费、广告变现、随产品捆绑、企业内部培训、印刷出版）；③ 去除或隐藏版权、免责声明、名称与图标后使用；④ 使用「学习工具」名称/标识/图标或高度相似的视觉设计；⑤ 以「学习工具」名义发布任何内容；⑥ 将本站内容用于训练机器学习模型或构建面向公众的商业数据集。"],
  ["需要单独授权","商业使用、机构或课堂教学、二次开发与再分发、全文转载、贴牌定制、商业合作——请先联系作者取得书面许可。"],
  ["联系方式与授权","授权、合作或内容反馈：优先加文末「反馈与建议」里的交流群；技术用户也可以在 GitHub 仓库提 Issue（github.com/chenshou666/chenshou666.github.io/issues，国内访问可能不稳定）。本站会持续更新，最新许可文本以仓库中的 LICENSE 文件为准。"]
 ];
 const body=items.map(function(x){return '<section class="panel" style="margin-bottom:14px"><div class="challenge-head"><div class="challenge-label">'+esc(x[0])+'</div></div><p class="lesson-copy">'+esc(x[1])+'</p></section>'}).join("");
 document.getElementById("view").innerHTML='<div class="page-header"><div><div class="eyebrow">学习工具</div><h1>关于 / 免责 / 版权与许可</h1><p class="subhead">本站免费供个人学习使用；名称、图标与内容版权归作者所有，禁止商用与修改后分发。</p></div><button class="btn btn-ghost btn-small" data-page="courses">← 返回学习课程</button></div>'+body+'<section class="panel feedback-panel"><div class="challenge-head"><div class="challenge-label">反馈与建议</div><span class="chip">欢迎</span></div>'+'<p class="lesson-copy">内容会按大家的建议继续增加；使用中觉得哪里不好用、哪里有错、想加什么内容，都可以直接告诉作者。</p>'+'<div class="feedback-actions">'+(CONTACT_QQ_GROUP?'<button class="btn btn-primary btn-small" data-action="copy-qq-group">复制交流群号：'+esc(CONTACT_QQ_GROUP)+'</button>':''+'<span class="feedback-soon">交流群正在筹备中，稍后在本页公布</span>')+'<a class="btn btn-ghost btn-small" href="https://github.com/chenshou666/chenshou666.github.io/issues" target="_blank" rel="noopener">在 GitHub 提 Issue（国内可能打不开）</a>'+'</div>'+'<div class="hint feedback-hint">在 QQ 里搜索群号即可加入；加群请说明来意（学习 / 反馈问题）。遇到内容错误，说清楚是哪一关、哪一段，方便快速修正。</div></section>'+'<div class="footer-note">最后更新：2026-10-26 · Copyright © 2026 学习工具 · 免费供个人学习使用，禁止商用与修改后分发 · 完整条款见仓库 LICENSE 文件</div>';
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
