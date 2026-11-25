/* ============================================================================
 * questions.js — MBTI 人格光谱测试 · 专业级零偏向 90 题库 + 10 道边界决胜题
 *
 * 心理测量学严格对称设计（3 档模式全满足正反权重差 0.00 & A/B 位置 50/50）：
 *   - 闪电精测版（tier <= 1）：30 题 = 5 维 × 6 题（3+, 3-；权重各 3.45；A/B 各 1）
 *   - 标准探索版（tier <= 2）：60 题 = 5 维 × 12 题（6+, 6-；权重各 6.90；A/B 各 2）
 *   - 专业深度版（tier <= 3）：90 题 = 5 维 × 18 题（9+, 9-；权重各 10.35；A/B 各 3）
 *
 * 零偏向规范：
 *   1. 正反两极文案同等体面中性，避免社会期许偏差与绝对化副词。
 *   2. 题卡仅展示中性场景名，不暴露维度或带评价色彩的心理学子面标签。
 *   3. 幕间卡仅展示零方向剧透的进度、节奏与趣味心理冷知识，杜绝锚定效应。
 *   4. 额外提供 10 道高区分度 A/B 边界决胜题（每维 2 道），在极近 50% 时按需追加校准。
 * ========================================================================== */
(function (global) {
  "use strict";

  var MBTI_CHAPTERS = [
    {
      id: "ch1",
      index: 1,
      title: "第一幕 · 日常起手式",
      subtitle: "从放松时刻到意外来敲门，看看你最自然的本能反应",
      accent: "#38bdf8",
      accent2: "#818cf8",
      badge: "ACT I",
      interludeTitle: "第一幕完成 · 盲测信号稳定入库",
      interludeHint: "为了防止心理暗示影响后续判断，系统暂不剧透任何维度偏向，继续保持第一直觉即可。",
      trivia: "心理测量小知识：同一维度被拆散并正反交替出题，是为了消除「顺手连选同一侧」的习惯偏差。"
    },
    {
      id: "ch2",
      index: 2,
      title: "第二幕 · 观察与共振",
      subtitle: "同一幅画面与同一段谈话，不同的人会先对焦在何处",
      accent: "#a855f7",
      accent2: "#38bdf8",
      badge: "ACT II",
      interludeTitle: "第二幕完成 · 多维切面持续校准",
      interludeHint: "进度已过三分之一！目前所有选项都在静默记录中，放心按当下最真实的自己作答。",
      trivia: "心理测量小知识：7 级连续量表比传统二选一携带超过两倍的信息量，能精准识别温和型与边界型。"
    },
    {
      id: "ch3",
      index: 3,
      title: "第三幕 · 岔路与权衡",
      subtitle: "当规则、体验与人心交汇，你最顺手的那把标尺是什么",
      accent: "#fb7185",
      accent2: "#fbbf24",
      badge: "ACT III",
      interludeTitle: "第三幕完成 · 探索旅程过半",
      interludeHint: "你已跨越中线！系统正在后台同步校验正反向题目的一致性，以确保结果真实可靠。",
      trivia: "心理测量小知识：MBTI 四组字母不是非黑即白的标签，而是连续光谱——接近 50% 往往代表你拥有双栖弹性。"
    },
    {
      id: "ch4",
      index: 4,
      title: "第四幕 · 节奏与秩序",
      subtitle: "在清晰的航线与灵活的风向之间，哪种步调让你最舒展",
      accent: "#34d399",
      accent2: "#38bdf8",
      badge: "ACT IV",
      interludeTitle: "第四幕完成 · 只剩最后一幕",
      interludeHint: "即将抵达终点！最后一幕将补全你最细微的内在感受与决策偏好。",
      trivia: "心理测量小知识：荣格认知功能分为信息获取（S/N）与判断决策（T/F）两大轴线，各自又分内倾与外倾两种姿态。"
    },
    {
      id: "ch5",
      index: 5,
      title: "第五幕 · 终章星图",
      subtitle: "穿过忙碌与安静的缝隙，拼上你人格光谱的最后几块拼图",
      accent: "#60a5fa",
      accent2: "#c084fc",
      badge: "ACT V",
      interludeTitle: "全部主测完成 · 准备校准与揭晓",
      interludeHint: "主测题库已全部采集完毕，正在校验边界维度并生成你的专属档案。",
      trivia: "心理测量小知识：若某维度落在极近中线的区间，系统会自动触发精准二选一边界校准题，告别硬判默认项。"
    }
  ];

  // 纯中性、零诱导的即时微反馈（仅反馈交互质感与节奏，绝不评价或暗示选项对错/偏向）
  var MBTI_MICRO_REACTIONS = {
    strong: [
      "清晰落点，第一直觉已记录 ✨",
      "果断的坐标信号已入库。",
      "这一题态度非常明确，继续下一幕风景。",
      "精准捕获，星图又清晰了一分。"
    ],
    mid: [
      "温和的倾向信号已记录，细节很有价值。",
      "自然的偏好落点，继续按感觉走就好。",
      "很真实的分寸感，已同步写入光谱。",
      "稳健推进中，保持这份轻松的第一直觉。"
    ],
    neutral: [
      "中线信号已记录——留白与弹性本身也是真实特征。",
      "两头都沾一点很正常，系统会结合后续题目综合定位。",
      "已记录你的平衡视角，继续下一题。",
      "不勉强站队同样有助于保持测验信度。"
    ]
  };

  /* ==========================================================================
   * 90 道核心题库（按 ch1 → ch5 排列；每幕含 tier1×6 + tier2×6 + tier3×6 = 18 题）
   * 字段说明：
   *   tier: 1(30题精测) / 2(60题标准) / 3(90题专业深度)
   *   dim:  EI | SN | TF | JP | AT
   *   pole: +1(首极 E/S/T/J/A) | -1(次极 I/N/F/P/T-谨慎)
   *   weight: 1.20 | 1.15 | 1.10（每 tier 每 dim 正反各 1 个，和值严格 3.45 vs 3.45）
   *   type: "statement" | "dilemma"（每 tier 每 dim 正反各 1 道 dilemma，严格 50/50）
   *   fnPos / fnNeg: 可选，标注偏向首极(+1)或次极(-1)时关联的荣格认知功能，用于实测调制八维
   * ========================================================================== */
  var MBTI_QUESTIONS = [
    // =========================================================================
    // 第一幕 · ch1（18 题：tier1 6题 + tier2 6题 + tier3 6题）
    // =========================================================================
    // --- ch1 · tier 1 ---
    {
      id: "q01", chapter: "ch1", tier: 1, dim: "EI", pole: 1, weight: 1.20, type: "statement",
      scene: "周五晚间邀约", icon: "🌃", fnPos: "Fe", fnNeg: "Fi",
      text: "忙碌一周后的周五晚上，朋友临时约去热闹的聚餐或桌游局，和一群人说笑互动往往比一个人待在家里更容易让你放松下来。"
    },
    {
      id: "q02", chapter: "ch1", tier: 1, dim: "SN", pole: -1, weight: 1.15, type: "dilemma",
      scene: "初次上手新工具", icon: "🧭", fnPos: "Si", fnNeg: "Ne",
      prompt: "第一次拿到一款功能丰富的陌生软件或设备，你更自然的探索起手式是？",
      leftText: "凭直觉先猜它的设计逻辑，边自由尝试边发散它还能衍生出哪些创意玩法",
      rightText: "先顺着界面分区、基础说明和常规步骤走一遍，把确定可用的功能掌握扎实"
    },
    {
      id: "q03", chapter: "ch1", tier: 1, dim: "EI", pole: -1, weight: 1.20, type: "statement",
      scene: "散场后的安静时段", icon: "🎧", fnPos: "Se", fnNeg: "Ni",
      text: "即使刚刚经历了一场非常愉快的聚会，回到家关上门后，你仍然需要一段不被打扰的独处时光来把精力恢复到满格。"
    },
    {
      id: "q04", chapter: "ch1", tier: 1, dim: "JP", pole: 1, weight: 1.20, type: "statement",
      scene: "出行前的路线图", icon: "🗺️", fnPos: "Te", fnNeg: "Ne",
      text: "准备一次跨城出行时，提前定好交通班次、落脚点和每日大致行程，会让你对这趟旅程更有期待感。"
    },
    {
      id: "q05", chapter: "ch1", tier: 1, dim: "TF", pole: 1, weight: 1.15, type: "dilemma",
      scene: "好友的深夜倾诉", icon: "☕", fnPos: "Ti", fnNeg: "Fe",
      prompt: "朋友因为一次棘手选择来找你倾诉烦恼，你心底最先涌出的回应方式偏向哪一边？",
      leftText: "帮对方梳理前因后果、找出症结和几种可行的解决路径",
      rightText: "先陪对方把委屈和情绪完整说出来，让对方感受到被理解与支持"
    },
    {
      id: "q06", chapter: "ch1", tier: 1, dim: "AT", pole: 1, weight: 1.20, type: "statement",
      scene: "意外小插曲", icon: "⚓",
      text: "日常安排突然出现一个小插曲时，你的心情大多维持在原本的基线上，较少跟着这件事上下起伏太久。"
    },

    // --- ch1 · tier 2 ---
    {
      id: "q07", chapter: "ch1", tier: 2, dim: "EI", pole: 1, weight: 1.20, type: "statement",
      scene: "多线并行交流", icon: "💬", fnPos: "Ne", fnNeg: "Ti",
      text: "在多人畅聊的场合里，大家的观点此起彼伏、节奏很快，这种热烈的来回碰撞通常会让你思路越聊越活跃。"
    },
    {
      id: "q08", chapter: "ch1", tier: 2, dim: "SN", pole: -1, weight: 1.15, type: "dilemma",
      scene: "听一段新奇企划", icon: "💡", fnPos: "Si", fnNeg: "Ni",
      prompt: "朋友兴奋地向你描绘一个尚未成型的新项目构想，你脑中最先亮起的是？",
      leftText: "它背后的想象空间、未来演变方向，以及还能跨界延展出的可能性",
      rightText: "它的具体操作环节、现实资源条件，以及第一步怎样落地才稳妥"
    },
    {
      id: "q09", chapter: "ch1", tier: 2, dim: "EI", pole: -1, weight: 1.20, type: "statement",
      scene: "发言前的内在推演", icon: "🫧", fnPos: "Te", fnNeg: "Ti",
      text: "参与小组讨论时，你更偏好先在心里把观点整理成形再开口，而不是边说话边把想法梳理出来。"
    },
    {
      id: "q10", chapter: "ch1", tier: 2, dim: "JP", pole: 1, weight: 1.20, type: "statement",
      scene: "先收尾再放松", icon: "📌", fnPos: "Te", fnNeg: "Se",
      text: "如果手头还有一项待办事项没收尾，哪怕此刻允许休息，你往往也更想先把这件事处理妥当，再去安心娱乐。"
    },
    {
      id: "q11", chapter: "ch1", tier: 2, dim: "TF", pole: 1, weight: 1.15, type: "dilemma",
      scene: "规则与特例", icon: "⚖️", fnPos: "Ti", fnNeg: "Fi",
      prompt: "团队里有人因为个人特殊状况未达到约定标准，如果需要你做裁定，你更看重？",
      leftText: "保持统一标准的公平与可预期性，以免规则失去公信力",
      rightText: "结合当事人的真实处境与过往付出，给予合乎人情的弹性处理"
    },
    {
      id: "q12", chapter: "ch1", tier: 2, dim: "AT", pole: 1, weight: 1.20, type: "statement",
      scene: "交稿后的心态", icon: "📮",
      text: "把一份重要的作业或工作提交出去后，你通常很快就把它放下转去忙下一件事，不太会反复回头琢磨还有没有疏漏。"
    },

    // --- ch1 · tier 3 ---
    {
      id: "q13", chapter: "ch1", tier: 3, dim: "EI", pole: 1, weight: 1.20, type: "statement",
      scene: "新环境适应", icon: "🚪", fnPos: "Se", fnNeg: "Si",
      text: "来到一个全新的社团、部门或城市时，主动认识身边的新朋友、尽快融入当地圈子会让你感到自然且有劲头。"
    },
    {
      id: "q14", chapter: "ch1", tier: 3, dim: "SN", pole: -1, weight: 1.15, type: "dilemma",
      scene: "回忆一次旧旅行", icon: "🎞️", fnPos: "Si", fnNeg: "Ni",
      prompt: "时隔一年回想起一次难忘的旅行，脑海里最清晰浮现的往往是？",
      leftText: "那趟旅程带给你的某种整体意境、人生启发或抽象的情绪色彩",
      rightText: "具体的街道画面、食物味道、天气触感和当时发生过的真实小插曲"
    },
    {
      id: "q15", chapter: "ch1", tier: 3, dim: "EI", pole: -1, weight: 1.20, type: "statement",
      scene: "信息过载信号", icon: "🔋", fnPos: "Se", fnNeg: "Si",
      text: "在人声鼎沸的展会或高密度社交活动里待上大半天后，你往往会感到精神耗电明显，只想找个安静角落待一会儿。"
    },
    {
      id: "q16", chapter: "ch1", tier: 3, dim: "JP", pole: 1, weight: 1.20, type: "statement",
      scene: "阶段清单习惯", icon: "📋", fnPos: "Si", fnNeg: "Ne",
      text: "开启一个持续几周的个人目标时，把步骤拆成明确节点并按表推进，会让你保持最顺手的工作节奏。"
    },
    {
      id: "q17", chapter: "ch1", tier: 3, dim: "TF", pole: 1, weight: 1.15, type: "dilemma",
      scene: "评价一部作品", icon: "🎬", fnPos: "Ti", fnNeg: "Fi",
      prompt: "看完一部讨论度很高的电影或书，你更容易因为哪一点给它打高分？",
      leftText: "结构严密、人物动机合乎逻辑、世界观设定前后自洽",
      rightText: "情感刻画真挚动人、价值表达能击中内心深处的共鸣"
    },
    {
      id: "q18", chapter: "ch1", tier: 3, dim: "AT", pole: 1, weight: 1.20, type: "statement",
      scene: "面对不同声音", icon: "🌤️",
      text: "当他人对你的做法提出异议时，你的情绪波动一般比较小，不太容易把分歧带入到对自我的怀疑里。"
    },

    // =========================================================================
    // 第二幕 · ch2（18 题：tier1 6题 + tier2 6题 + tier3 6题）
    // =========================================================================
    // --- ch2 · tier 1 ---
    {
      id: "q19", chapter: "ch2", tier: 1, dim: "SN", pole: 1, weight: 1.20, type: "statement",
      scene: "方案落地评估", icon: "📐", fnPos: "Si", fnNeg: "Ne",
      text: "讨论一项合作方案时，你更习惯优先核对可验证的数据、过往实操经验和具体执行步骤，再去谈远景蓝图。"
    },
    {
      id: "q20", chapter: "ch2", tier: 1, dim: "SN", pole: -1, weight: 1.20, type: "statement",
      scene: "漫游联想时刻", icon: "🌌", fnPos: "Se", fnNeg: "Ne",
      text: "通勤或散步放空时，你的思绪很容易从眼前的某件小事跳到抽象概念、隐喻关联或「如果换一种机制会怎样」的设想上。"
    },
    {
      id: "q21", chapter: "ch2", tier: 1, dim: "EI", pole: 1, weight: 1.15, type: "dilemma",
      scene: "破冰茶歇现场", icon: "🥂", fnPos: "Fe", fnNeg: "Fi",
      prompt: "走进一个多数人还不太熟的交流会或工作坊，你通常更自在的状态是？",
      leftText: "主动找身边人聊上几句，在轻松互动中迅速熟悉现场氛围",
      rightText: "先安静观察一会儿现场节奏，等遇到特别投缘的话题再展开深聊"
    },
    {
      id: "q22", chapter: "ch2", tier: 1, dim: "TF", pole: -1, weight: 1.20, type: "statement",
      scene: "抉择里的温度", icon: "🌱", fnPos: "Te", fnNeg: "Fi",
      text: "挑选长期投入的方向时，「这件事是否契合我内心的信念、能否真正滋养到人」往往比「它的效率与回报是否最优」更具决定性。"
    },
    {
      id: "q23", chapter: "ch2", tier: 1, dim: "AT", pole: -1, weight: 1.15, type: "dilemma",
      scene: "内心气压计", icon: "🌦️",
      prompt: "回顾近一两个月的日常心境变化，哪种描述更贴近你真实的体验？",
      leftText: "内心感知比较敏锐，外界风吹草动或自我期待容易牵动心绪起伏，但也常因此保持警觉与精进",
      rightText: "心境像平稳巡航的曲线，外部起伏不太容易打乱内在节奏，整体比较松弛淡定"
    },
    {
      id: "q24", chapter: "ch2", tier: 1, dim: "JP", pole: -1, weight: 1.20, type: "statement",
      scene: "留白的假日", icon: "🍃", fnPos: "Si", fnNeg: "Se",
      text: "哪怕假日里安排的都是你喜欢的活动，如果时间表卡得太满，你还是更偏爱留出大片空白、醒来随心境临时决定去哪。"
    },

    // --- ch2 · tier 2 ---
    {
      id: "q25", chapter: "ch2", tier: 2, dim: "SN", pole: 1, weight: 1.20, type: "statement",
      scene: "当下的五感质感", icon: "🌿", fnPos: "Se", fnNeg: "Ni",
      text: "风吹过皮肤的温度、食物入口的层次、物件的手感与工艺细节——你很容易把注意力聚焦在眼前真实可触的感官体验里。"
    },
    {
      id: "q26", chapter: "ch2", tier: 2, dim: "SN", pole: -1, weight: 1.20, type: "statement",
      scene: "套路之外的探索", icon: "🔭", fnPos: "Si", fnNeg: "Ne",
      text: "一旦把某件事的常规流程摸透之后，比起继续按成熟方法稳步精雕，你往往更想尝试打破套路、探索一种全新思路。"
    },
    {
      id: "q27", chapter: "ch2", tier: 2, dim: "EI", pole: 1, weight: 1.15, type: "dilemma",
      scene: "遇到卡壳难题", icon: "⚡", fnPos: "Ne", fnNeg: "Ti",
      prompt: "做一件需要动脑的事突然卡住了，哪种做法更容易帮你打开局面？",
      leftText: "拉一个聊得来的伙伴直接把想法说出来，在对话碰撞中理清方向",
      rightText: "独自安静待一会儿，在脑海里或纸上不受干扰地把线索慢慢想透"
    },
    {
      id: "q28", chapter: "ch2", tier: 2, dim: "TF", pole: -1, weight: 1.20, type: "statement",
      scene: "拒绝他人的分寸", icon: "💌", fnPos: "Te", fnNeg: "Fe",
      text: "当必须婉拒一个朋友满怀期待的请求时，即便理由非常充分，你还是会花不少心思顾及对方的感受，生怕让对方心里难受。"
    },
    {
      id: "q29", chapter: "ch2", tier: 2, dim: "AT", pole: -1, weight: 1.15, type: "dilemma",
      scene: "重要登场之前", icon: "🎙️",
      prompt: "距离一场重要发言、面试或展示还有十分钟，你通常处于哪种状态？",
      leftText: "神经微微绷紧，会在脑中反复预演各种可能出岔子的细节以便提前防备",
      rightText: "相对放松，觉得准备到这一步就顺其自然，上场临机发挥即可"
    },
    {
      id: "q30", chapter: "ch2", tier: 2, dim: "JP", pole: -1, weight: 1.20, type: "statement",
      scene: "计划外的拐弯", icon: "🎲", fnPos: "Si", fnNeg: "Se",
      text: "逛街或旅行时临时放弃原定攻略、随手拐进一条陌生小巷或换一家没查过的店，往往会给你带来额外的兴奋感。"
    },

    // --- ch2 · tier 3 ---
    {
      id: "q31", chapter: "ch2", tier: 3, dim: "SN", pole: 1, weight: 1.20, type: "statement",
      scene: "讲故事的习惯", icon: "📖", fnPos: "Si", fnNeg: "Ni",
      text: "和朋友分享一次亲身经历时，你习惯把具体的时间线索、人物对话和现场画面如实还原出来，而不是只提炼一个抽象寓意。"
    },
    {
      id: "q32", chapter: "ch2", tier: 3, dim: "SN", pole: -1, weight: 1.20, type: "statement",
      scene: "隐喻与弦外音", icon: "✨", fnPos: "Si", fnNeg: "Ni",
      text: "读一篇文章或听一段演讲时，比起逐条记住里面的具体事例，你更自然地去捕捉字里行间的象征隐喻和背后趋势。"
    },
    {
      id: "q33", chapter: "ch2", tier: 3, dim: "EI", pole: 1, weight: 1.15, type: "dilemma",
      scene: "表达喜悦的方式", icon: "📣", fnPos: "Fe", fnNeg: "Fi",
      prompt: "遇到一件让你打心底里开心的好消息，你更习惯怎么消化这份快乐？",
      leftText: "第一时间分享给身边的朋友或家人，在热闹的回应里让开心加倍",
      rightText: "先自己细细品味这份喜悦，只挑一两位最亲近的人安静地提一嘴"
    },
    {
      id: "q34", chapter: "ch2", tier: 3, dim: "TF", pole: -1, weight: 1.20, type: "statement",
      scene: "团队氛围优先度", icon: "🕊️", fnPos: "Te", fnNeg: "Fe",
      text: "在小组合作里，如果为了追求极致效率而让成员彼此关系变得紧张疏离，你往往宁愿稍微放慢节奏，先维护大家的信任与融洽。"
    },
    {
      id: "q35", chapter: "ch2", tier: 3, dim: "AT", pole: -1, weight: 1.15, type: "dilemma",
      scene: "收到好评之后", icon: "🔍",
      prompt: "交出一份大家普遍称赞的成果后，你的注意力通常更容易停留在哪一边？",
      leftText: "很快就盯上里面那 5% 自己觉得还能打磨得更好的细小瑕疵",
      rightText: "坦然接住这份肯定，觉得整体已经达标就无需再吹毛求疵"
    },
    {
      id: "q36", chapter: "ch2", tier: 3, dim: "JP", pole: -1, weight: 1.20, type: "statement",
      scene: "并行兴趣模式", icon: "🎨", fnPos: "Te", fnNeg: "Ne",
      text: "面对多个吸引你的点子时，同时展开两三件小事、按当天兴致轮流推进，比死守单一清单做完一项再开下一项更让你有活力。"
    },

    // =========================================================================
    // 第三幕 · ch3（18 题：tier1 6题 + tier2 6题 + tier3 6题）
    // =========================================================================
    // --- ch3 · tier 1 ---
    {
      id: "q37", chapter: "ch3", tier: 1, dim: "TF", pole: 1, weight: 1.20, type: "statement",
      scene: "方案讨论风格", icon: "♟️", fnPos: "Te", fnNeg: "Fe",
      text: "在共同打磨一个方案时，比起先照顾彼此情绪委婉铺垫，你更习惯直截了当地指出逻辑漏洞或可行性风险，因为你认为坦诚高效是对事负责。"
    },
    {
      id: "q38", chapter: "ch3", tier: 1, dim: "TF", pole: -1, weight: 1.15, type: "dilemma",
      scene: "人选两难决定", icon: "🤝", fnPos: "Te", fnNeg: "Fe",
      prompt: "你是负责人，要在两位各有所长的候选人中留一位，内心天平会更倾向？",
      leftText: "侧重考量成员的成长处境、价值观契合度与团队整体的温暖凝聚力",
      rightText: "侧重依据客观产出数据、岗位硬指标与可量化的能力匹配度打分"
    },
    {
      id: "q39", chapter: "ch3", tier: 1, dim: "JP", pole: -1, weight: 1.15, type: "dilemma",
      scene: "两周期限任务", icon: "⏳", fnPos: "Te", fnNeg: "Ne",
      prompt: "面对一项两周后截止的任务，哪种真实节奏更贴近你平时的状态？",
      leftText: "前期保持开放地收集灵感、边走边调，临近截止时往往能爆发高专注度冲刺",
      rightText: "尽早拆分成几个清晰阶段稳步推进，最好提前一两天收尾留出检查余地"
    },
    {
      id: "q40", chapter: "ch3", tier: 1, dim: "AT", pole: 1, weight: 1.15, type: "dilemma",
      scene: "做完重大选择后", icon: "🧭",
      prompt: "经过权衡做出了一个重要决定并付诸行动后，你后续的常见心态是？",
      leftText: "落子无悔，很快把精力全放到走好眼前这条路上，较少回头假设另一条路",
      rightText: "哪怕进展不错，偶尔仍会反复评估「如果当初选另一个方案会不会更稳妥」"
    },
    {
      id: "q41", chapter: "ch3", tier: 1, dim: "AT", pole: -1, weight: 1.20, type: "statement",
      scene: "夜深复盘时刻", icon: "🌙",
      text: "安静独处或准备入睡时，大脑常常会自动回放白天某段对话的细枝末节，仔细思量自己当时的措辞和反应是否妥当。"
    },
    {
      id: "q42", chapter: "ch3", tier: 1, dim: "SN", pole: 1, weight: 1.15, type: "dilemma",
      scene: "逛一场展览", icon: "🖼️", fnPos: "Se", fnNeg: "Ni",
      prompt: "站在精致的画作、建筑或手工器物前，最先抓住你目光的往往是？",
      leftText: "扎实的笔触、材质肌理、光影比例与创作者清晰可见的工艺细节",
      rightText: "作品背后隐含的象征隐喻、留白意境，以及它触发的个人哲学遐想"
    },

    // --- ch3 · tier 2 ---
    {
      id: "q43", chapter: "ch3", tier: 2, dim: "TF", pole: 1, weight: 1.20, type: "statement",
      scene: "事实与立场之间", icon: "🔎", fnPos: "Ti", fnNeg: "Fi",
      text: "哪怕争论的一方是关系很好的朋友，只要客观证据和推演指向另一侧，你也很难为了维护情面而违背事实去附和。"
    },
    {
      id: "q44", chapter: "ch3", tier: 2, dim: "TF", pole: -1, weight: 1.15, type: "dilemma",
      scene: "最入心的认可", icon: "🏆", fnPos: "Ti", fnNeg: "Fe",
      prompt: "以下两句真诚的评价，哪一句更容易让你从心里感到被真正看见？",
      leftText: "「和你相处特别舒服安心，你很懂得体察别人真实的心情和不易。」",
      rightText: "「你的思路特别清晰犀利，这么复杂的局面一眼就被你看透了关键。」"
    },
    {
      id: "q45", chapter: "ch3", tier: 2, dim: "JP", pole: -1, weight: 1.15, type: "dilemma",
      scene: "雨夜餐厅停业", icon: "☔", fnPos: "Si", fnNeg: "Se",
      prompt: "原本约好的餐厅临时休息、外面又下起小雨，你当下的第一反应更像？",
      leftText: "挺有意思，顺着这条街随便逛逛，说不定能撞见一家意料之外的小店",
      rightText: "立刻打开评分软件对比周边备选，尽快确定一家靠谱的店把节奏稳住"
    },
    {
      id: "q46", chapter: "ch3", tier: 2, dim: "AT", pole: 1, weight: 1.15, type: "dilemma",
      scene: "同辈节奏对比", icon: "🏃",
      prompt: "看到身边年龄相仿的朋友突然取得亮眼突破，你内心最真实的波动通常是？",
      leftText: "真诚替对方高兴，同时依然按自己原本笃定的步调往前走，较少产生紧迫感",
      rightText: "由衷祝福的同时，心里也会升起一股「我也要再加把劲」的自我督促感"
    },
    {
      id: "q47", chapter: "ch3", tier: 2, dim: "AT", pole: -1, weight: 1.20, type: "statement",
      scene: "细微语气雷达", icon: "📡",
      text: "在乎的人回复消息比平时简短了几分时，你很容易敏锐地察觉到这种变化，并忍不住多琢磨一下对方是不是心情不好或有所顾虑。"
    },
    {
      id: "q48", chapter: "ch3", tier: 2, dim: "SN", pole: 1, weight: 1.15, type: "dilemma",
      scene: "学习全新领域", icon: "📚", fnPos: "Si", fnNeg: "Ni",
      prompt: "接触一门完全陌生的新技能或学科，哪种入门讲法最能让你快速掌握？",
      leftText: "先看真实具体的示范案例，照着清晰步骤亲手练一遍马上就能懂",
      rightText: "先听整体框架、底层隐喻和核心原理，看清全貌后再去填具体细节"
    },

    // --- ch3 · tier 3 ---
    {
      id: "q49", chapter: "ch3", tier: 3, dim: "TF", pole: 1, weight: 1.20, type: "statement",
      scene: "冷静抽离视角", icon: "🧊", fnPos: "Ti", fnNeg: "Fi",
      text: "面对情绪张力很强的棘手局面，你能够先把个人好恶和同情暂放一旁，从全局利弊和长期后果出发做理性权衡。"
    },
    {
      id: "q50", chapter: "ch3", tier: 3, dim: "TF", pole: -1, weight: 1.15, type: "dilemma",
      scene: "挑选一份礼物", icon: "🎁", fnPos: "Te", fnNeg: "Fi",
      prompt: "为重要的人挑一份生日礼物，你花最多心思斟酌的往往是？",
      leftText: "这份礼物是否藏着你们专属的回忆、寓意，以及拆开那一刻的情感惊喜",
      rightText: "这件物品的做工品质、实用频率，以及是否正好解决对方眼下的实际需求"
    },
    {
      id: "q51", chapter: "ch3", tier: 3, dim: "JP", pole: -1, weight: 1.15, type: "dilemma",
      scene: "工作与娱乐边界", icon: "🌊", fnPos: "Te", fnNeg: "Se",
      prompt: "在自由支配的一整天里，哪种状态更能让你感到舒畅高效？",
      leftText: "工作与放松的界限是流动的：状态不对就先换换脑子，灵感来了随时投入冲刺",
      rightText: "工作时段与休闲时段分明：规定时间专心做事，收工后彻底切换到放松模式"
    },
    {
      id: "q52", chapter: "ch3", tier: 3, dim: "AT", pole: 1, weight: 1.15, type: "dilemma",
      scene: "面对突发状况", icon: "🧭",
      prompt: "周围人因一件突如其来的变故显得有点慌乱时，你内在的真实状态往往是？",
      leftText: "肾上腺素反而让你沉静下来，较少被周围人的紧张情绪传染",
      rightText: "会立刻感受到现场紧绷的气压，脑中高速运转排查所有潜在隐患"
    },
    {
      id: "q53", chapter: "ch3", tier: 3, dim: "AT", pole: -1, weight: 1.20, type: "statement",
      scene: "高标准自我校准", icon: "🎯",
      text: "即使外界已经对你的表现给出了不错的反馈，你内心依然常带着一股持续精进的自我要求，总觉得还能再进一步。"
    },
    {
      id: "q54", chapter: "ch3", tier: 3, dim: "SN", pole: 1, weight: 1.15, type: "dilemma",
      scene: "看待经典与革新", icon: "🏛️", fnPos: "Si", fnNeg: "Ne",
      prompt: "改进一套已经运行多年的常规做法，你本能上更信赖哪条路径？",
      leftText: "在经过实践检验的成熟基础上逐项微调优化，稳步把细节做到极致",
      rightText: "跳出原有前提重新发问，先构想一套完全不同以往的颠覆性方案"
    },

    // =========================================================================
    // 第四幕 · ch4（18 题：tier1 6题 + tier2 6题 + tier3 6题）
    // =========================================================================
    // --- ch4 · tier 1 ---
    {
      id: "q55", chapter: "ch4", tier: 1, dim: "JP", pole: 1, weight: 1.15, type: "dilemma",
      scene: "半途冒出新点子", icon: "🧩", fnPos: "Te", fnNeg: "Ne",
      prompt: "手头一件有趣的事做到一半，脑海里又冒出一个同样诱人的新想法，你更常会？",
      leftText: "先把新点子记进备忘录，坚持把眼前这件收尾闭环后再开启下一件",
      rightText: "先切过去试玩探索一番，觉得多条线保持新鲜感反而更有创造力"
    },
    {
      id: "q56", chapter: "ch4", tier: 1, dim: "JP", pole: -1, weight: 1.10, type: "statement",
      scene: "保留选择弹性", icon: "🪁", fnPos: "Ni", fnNeg: "Ne",
      text: "面对一项尚有变数的决定，你倾向把各种选项多敞开一会儿，以免太早定案而错过后面浮现的更好契机。"
    },
    {
      id: "q57", chapter: "ch4", tier: 1, dim: "EI", pole: -1, weight: 1.15, type: "dilemma",
      scene: "人际圈层偏好", icon: "🕯️", fnPos: "Fe", fnNeg: "Fi",
      prompt: "如果按个人最舒服的节奏经营人际关系，你更偏爱哪一种状态？",
      leftText: "把主要精力投入到两三位能深度交心的挚友身上，圈子精简而纯粹",
      rightText: "结识不同领域、不同性格的新朋友，多元圈子总能带来新鲜活力"
    },
    {
      id: "q58", chapter: "ch4", tier: 1, dim: "SN", pole: -1, weight: 1.10, type: "statement",
      scene: "跨界模式直觉", icon: "🔗", fnPos: "Si", fnNeg: "Ni",
      text: "学习或思考时，比起逐条记忆零散事实，你更享受在不同领域之间寻找「一脉相通」的底层规律与抽象结构。"
    },
    {
      id: "q59", chapter: "ch4", tier: 1, dim: "TF", pole: -1, weight: 1.10, type: "statement",
      scene: "沟通里的顾及", icon: "🫧", fnPos: "Te", fnNeg: "Fe",
      text: "当需要向他人提出改进意见时，你会很自然地先琢磨怎么措辞才能保住对方的积极性与尊严，而不是只求把问题讲透。"
    },
    {
      id: "q60", chapter: "ch4", tier: 1, dim: "EI", pole: 1, weight: 1.10, type: "statement",
      scene: "独处太久的信号", icon: "🔥", fnPos: "Se", fnNeg: "Ni",
      text: "如果连续两三天独自待在房间里没怎么和人面对面说话，你会明显感到有些发闷，很想出门找人聊聊天换换气。"
    },

    // --- ch4 · tier 2 ---
    {
      id: "q61", chapter: "ch4", tier: 2, dim: "JP", pole: 1, weight: 1.15, type: "dilemma",
      scene: "日常桌面与文件", icon: "🗂️", fnPos: "Si", fnNeg: "Ne",
      prompt: "看看你常用的电脑文件、备忘录或随身物品，哪种管理风格更符合你？",
      leftText: "按清晰分类归档命名，一切各归其位会让你工作起来格外顺手",
      rightText: "按当下使用频率随手放置，靠脑海里的空间记忆与搜索就能轻松找到"
    },
    {
      id: "q62", chapter: "ch4", tier: 2, dim: "JP", pole: -1, weight: 1.10, type: "statement",
      scene: "临时改约反应", icon: "🌬️", fnPos: "Te", fnNeg: "Se",
      text: "周末原本随口约好的安排临时需要改时间或改地点，你通常觉得无所谓，顺着新变化调整反而挺轻松。"
    },
    {
      id: "q63", chapter: "ch4", tier: 2, dim: "EI", pole: -1, weight: 1.15, type: "dilemma",
      scene: "文字与电话选择", icon: "⌨️", fnPos: "Te", fnNeg: "Ti",
      prompt: "非紧急事情需要与人沟通敲定细节时，你默认更喜欢哪种联络方式？",
      leftText: "发文字消息，能给自己留出从容组织措辞与安静思考的缓冲空间",
      rightText: "直接拨语音或当面说，一来一回实时互动更有温度也更快讲清"
    },
    {
      id: "q64", chapter: "ch4", tier: 2, dim: "SN", pole: -1, weight: 1.10, type: "statement",
      scene: "未来推演偏好", icon: "🚀", fnPos: "Si", fnNeg: "Ni",
      text: "闲聊时，比起分享最近发生的日常琐事与吃喝攻略，你更容易被关于未来趋势、社会演变或思想实验的话题点燃兴趣。"
    },
    {
      id: "q65", chapter: "ch4", tier: 2, dim: "TF", pole: -1, weight: 1.10, type: "statement",
      scene: "共情决策权重", icon: "💗", fnPos: "Ti", fnNeg: "Fi",
      text: "遇到重要抉择时，哪怕某个方案在纸面账目上占优，如果它让你在情感或良心层面隐隐别扭，你也很难说服自己去选它。"
    },
    {
      id: "q66", chapter: "ch4", tier: 2, dim: "EI", pole: 1, weight: 1.10, type: "statement",
      scene: "人群里的自在感", icon: "🎪", fnPos: "Se", fnNeg: "Si",
      text: "在热闹的市集、音乐现场或大型团队活动里，成为氛围中的活跃一员往往比退到外围旁观更让你享受。"
    },

    // --- ch4 · tier 3 ---
    {
      id: "q67", chapter: "ch4", tier: 3, dim: "JP", pole: 1, weight: 1.15, type: "dilemma",
      scene: "逛街购物模式", icon: "🛍️", fnPos: "Te", fnNeg: "Se",
      prompt: "走进一家大型商场或浏览线上商店，哪种节奏更接近你的日常习惯？",
      leftText: "提前想好要买什么、看好预算和型号，直奔目标速战速决",
      rightText: "不预设具体清单，边逛边看眼缘，享受随机发现心仪好物的过程"
    },
    {
      id: "q68", chapter: "ch4", tier: 3, dim: "JP", pole: -1, weight: 1.10, type: "statement",
      scene: "边做边改的弹性", icon: "🎛️", fnPos: "Si", fnNeg: "Ne",
      text: "推进一件创意或学习任务时，你更偏好先动手边试边改，而不是在开始前就把每一步细则都写死。"
    },
    {
      id: "q69", chapter: "ch4", tier: 3, dim: "EI", pole: -1, weight: 1.15, type: "dilemma",
      scene: "聚光灯时刻", icon: "🌘", fnPos: "Fe", fnNeg: "Fi",
      prompt: "在一次轻松的团建或聚会里，大家起哄想推一个人上台带节奏，你的本能是？",
      leftText: "更乐意坐在台下鼓掌欣赏，把高光舞台留给更享受表现的朋友",
      rightText: "大方接过话筒热场互动，成为全场注意力焦点并不会让你觉得拘束"
    },
    {
      id: "q70", chapter: "ch4", tier: 3, dim: "SN", pole: -1, weight: 1.10, type: "statement",
      scene: "假设性脑洞", icon: "🪐", fnPos: "Se", fnNeg: "Ne",
      text: "哪怕一个设想在现实中短期内未必用得上，单单推演「如果前提变了，整个系统会如何演化」本身就足以让你津津有味。"
    },
    {
      id: "q71", chapter: "ch4", tier: 3, dim: "TF", pole: -1, weight: 1.10, type: "statement",
      scene: "冲突里的修复心", icon: "🌈", fnPos: "Ti", fnNeg: "Fe",
      text: "和亲近的人发生意见分歧时，你最挂念的往往不是「到底谁的论据更无懈可击」，而是「我们彼此之间的情感连接有没有受损」。"
    },
    {
      id: "q72", chapter: "ch4", tier: 3, dim: "EI", pole: 1, weight: 1.10, type: "statement",
      scene: "边说边想的习惯", icon: "🗣️", fnPos: "Ne", fnNeg: "Ni",
      text: "有时候你自己都没意识到想法已经成型，往往是在和别人畅快聊天的过程中，思路才自然而然地拼接完整。"
    },

    // =========================================================================
    // 第五幕 · ch5（18 题：tier1 6题 + tier2 6题 + tier3 6题）
    // =========================================================================
    // --- ch5 · tier 1 ---
    {
      id: "q73", chapter: "ch5", tier: 1, dim: "AT", pole: 1, weight: 1.10, type: "statement",
      scene: "失误后的翻篇节奏", icon: "🌅",
      text: "经历一次小失误并记下教训之后，你通常睡一觉就能轻松翻篇，不太会让懊恼延续到接下来的好几天。"
    },
    {
      id: "q74", chapter: "ch5", tier: 1, dim: "AT", pole: -1, weight: 1.10, type: "statement",
      scene: "未雨绸缪的习惯", icon: "🛡️",
      text: "在做重要准备时，你常常会多想几层可能出错的边角情况，只有把各种隐患都反复确认过心里才更踏实。"
    },
    {
      id: "q75", chapter: "ch5", tier: 1, dim: "SN", pole: 1, weight: 1.10, type: "statement",
      scene: "务实选品视角", icon: "🛠️", fnPos: "Se", fnNeg: "Ne",
      text: "选购日常器物或体验服务时，你最看重看得见摸得着的材质、实用性能和真实口碑，而较少为抽象概念买单。"
    },
    {
      id: "q76", chapter: "ch5", tier: 1, dim: "TF", pole: 1, weight: 1.10, type: "statement",
      scene: "面对尖锐建议", icon: "🧪", fnPos: "Ti", fnNeg: "Fi",
      text: "收到语气比较直接甚至有点冲的建议时，你通常能较快把「说话态度」与「内容有没有道理」分开处理，合理的部分会直接采纳。"
    },
    {
      id: "q77", chapter: "ch5", tier: 1, dim: "JP", pole: 1, weight: 1.10, type: "statement",
      scene: "悬而未决的状态", icon: "📍", fnPos: "Te", fnNeg: "Ne",
      text: "一件重要的事如果长时间停留在「到时候再看」的模糊状态，会让你心里总觉得欠着一个交代，更希望能尽早拍板定下来。"
    },
    {
      id: "q78", chapter: "ch5", tier: 1, dim: "EI", pole: -1, weight: 1.10, type: "statement",
      scene: "安静充电偏好", icon: "🌙", fnPos: "Se", fnNeg: "Ni",
      text: "如果周末有一整天完全属于自己，读一本书、沉浸于个人爱好或安静散步，往往比约满社交日程更能让你恢复元气。"
    },

    // --- ch5 · tier 2 ---
    {
      id: "q79", chapter: "ch5", tier: 2, dim: "AT", pole: 1, weight: 1.10, type: "statement",
      scene: "对现状的笃定感", icon: "☀️",
      text: "总体而言，你对当下的自己有着较稳定的接纳感，面对尚未到来的未知挑战，内心大多偏向「到时候总有办法」的从容。"
    },
    {
      id: "q80", chapter: "ch5", tier: 2, dim: "AT", pole: -1, weight: 1.10, type: "statement",
      scene: "细节情绪余波", icon: "💧",
      text: "即便事情在旁人眼里已经顺利解决，如果过程中出现过一点让自己不太满意的小插曲，那份微小的情绪余波往往还会停留一阵子。"
    },
    {
      id: "q81", chapter: "ch5", tier: 2, dim: "SN", pole: 1, weight: 1.10, type: "statement",
      scene: "眼见为实的信赖", icon: "🧱", fnPos: "Si", fnNeg: "Ni",
      text: "面对一项重大选择，比起押注一个尚未验证但听起来很迷人的新理念，你更倾向信任已被现实反复验证过的稳健路径。"
    },
    {
      id: "q82", chapter: "ch5", tier: 2, dim: "TF", pole: 1, weight: 1.10, type: "statement",
      scene: "分析优先的习惯", icon: "🧮", fnPos: "Te", fnNeg: "Fe",
      text: "遇到分歧或复杂抉择时，拿出一张纸把各方案的利弊、成本与因果关系逐条列出来，比凭内心直觉和感觉拍板更让你踏实。"
    },
    {
      id: "q83", chapter: "ch5", tier: 2, dim: "JP", pole: 1, weight: 1.10, type: "statement",
      scene: "可预期的日常节奏", icon: "🕰️", fnPos: "Si", fnNeg: "Se",
      text: "知道接下来几天的大致安排与时间节点，能让你把精力更稳地放在当下要做的事上，而不是临时起意再决定。"
    },
    {
      id: "q84", chapter: "ch5", tier: 2, dim: "EI", pole: -1, weight: 1.10, type: "statement",
      scene: "慢热型连接", icon: "🍵", fnPos: "Fe", fnNeg: "Fi",
      text: "和刚认识的人相处时，你通常需要一点时间慢慢观察熟悉，一旦真正建立信任，才会展现出健谈、风趣和热烈的一面。"
    },

    // --- ch5 · tier 3 ---
    {
      id: "q85", chapter: "ch5", tier: 3, dim: "AT", pole: 1, weight: 1.10, type: "statement",
      scene: "外界评价边界", icon: "🪨",
      text: "听到别人的夸奖或批评时，你会把有用的信息留下来，但自己的心情底盘很少因为外界一时的风评而剧烈摇摆。"
    },
    {
      id: "q86", chapter: "ch5", tier: 3, dim: "AT", pole: -1, weight: 1.10, type: "statement",
      scene: "敏锐的自我省察", icon: "🪞",
      text: "你习惯经常在心里给自己做复盘和体检，虽然偶尔会觉得思虑偏多，但这种高度自觉也确实帮你避开过不少弯路。"
    },
    {
      id: "q87", chapter: "ch5", tier: 3, dim: "SN", pole: 1, weight: 1.10, type: "statement",
      scene: "务实细节观察", icon: "🔎", fnPos: "Se", fnNeg: "Ni",
      text: "走进一个房间或翻看一份资料时，你很容易第一时间注意到排版错位、光线变化或物件摆放等具体而真实的细节。"
    },
    {
      id: "q88", chapter: "ch5", tier: 3, dim: "TF", pole: 1, weight: 1.10, type: "statement",
      scene: "逻辑自洽洁癖", icon: "⚙️", fnPos: "Ti", fnNeg: "Fi",
      text: "听一段观点论述时，即使发言者的初衷非常善意动人，如果推论过程存在明显的逻辑断层，你依然很难全盘认同。"
    },
    {
      id: "q89", chapter: "ch5", tier: 3, dim: "JP", pole: 1, weight: 1.10, type: "statement",
      scene: "收束带来的满足", icon: "✅", fnPos: "Te", fnNeg: "Ne",
      text: "比起保持多种可能性持续开放的刺激感，把一件悬着的事彻底画上句号、从待办清单里划掉，更能带给你由衷的畅快。"
    },
    {
      id: "q90", chapter: "ch5", tier: 3, dim: "EI", pole: -1, weight: 1.10, type: "statement",
      scene: "内心剧场时间", icon: "📖", fnPos: "Se", fnNeg: "Ti",
      text: "你很享受自己与自己对话的精神空间——有时哪怕身边没人说话，在脑海里安静琢磨感兴趣的事也能度过非常充实的半天。"
    }
  ];

  /* ==========================================================================
   * 10 道边界自适应决胜加试题（每维 2 道：1 道 +1，1 道 -1，均为纯中性 A/B 对决）
   * 仅当某维度落在 48%–52% 极近中线区时按需触发，采用 6 档无中立轻偏向选择彻底消除平局默认偏向
   * ========================================================================== */
  var MBTI_TIEBREAKERS = [
    {
      id: "tb_EI_1", dim: "EI", pole: 1, weight: 1.35, type: "dilemma",
      scene: "边界校准 · 能量补给", icon: "⚡",
      prompt: "连续高强度忙碌了一周，明天彻底放空，哪种度过方式更能让你满血复活？",
      leftText: "约上三五好友热热闹闹吃顿饭、聊个痛快，或去有烟火气的地方走走",
      rightText: "彻底免打扰地待在自己的安静空间里，按自己步调看片、放空或做喜欢的事"
    },
    {
      id: "tb_EI_2", dim: "EI", pole: -1, weight: 1.35, type: "dilemma",
      scene: "边界校准 · 思维节奏", icon: "💬",
      prompt: "当一个新想法刚刚萌芽时，你内心更自然的第一步通常是？",
      leftText: "先自己在心里反复推敲打磨，成型之后再分享给少数信任的人",
      rightText: "趁着热乎直接找人聊出来，借着来回讨论把点子一步步聊清楚"
    },
    {
      id: "tb_SN_1", dim: "SN", pole: 1, weight: 1.35, type: "dilemma",
      scene: "边界校准 · 注意力焦点", icon: "🔭",
      prompt: "面对一件新事物，哪一种理解角度更能让你真正觉得「心里有底」？",
      leftText: "看到它真实具体的细节、现实案例和一步步验证过的实际效果",
      rightText: "看透它背后的抽象模式、象征意义以及未来可能演变出的新空间"
    },
    {
      id: "tb_SN_2", dim: "SN", pole: -1, weight: 1.35, type: "dilemma",
      scene: "边界校准 · 灵感来源", icon: "✨",
      prompt: "在日常创作、学习或解决问题时，你的好点子更多来自哪一边？",
      leftText: "跳出眼下局限的天马行空联想、隐喻嫁接与「假设换种世界观」的脑洞",
      rightText: "扎根现实的敏锐观察、过往一手经验积累与亲手实操中发现的巧思"
    },
    {
      id: "tb_TF_1", dim: "TF", pole: 1, weight: 1.35, type: "dilemma",
      scene: "边界校准 · 关键拍板", icon: "⚖️",
      prompt: "做一个会对自己和身边人都产生影响的重要决定时，最终一锤定音的往往是？",
      leftText: "客观权衡利弊、因果逻辑与长远合理性后的清醒判断",
      rightText: "内心深处的价值共鸣，以及这个决定对相关人情感与关系的温度"
    },
    {
      id: "tb_TF_2", dim: "TF", pole: -1, weight: 1.35, type: "dilemma",
      scene: "边界校准 · 沟通优先项", icon: "🕊️",
      prompt: "当「把话说透讲准确」和「照顾对方当下感受」发生轻微冲突时，你更常先保住？",
      leftText: "先顾全对方的心意与对话温度，用更柔和的方式慢慢传达看法",
      rightText: "先确保核心观点与事实准确无误，相信坦诚本身就是最大的尊重"
    },
    {
      id: "tb_JP_1", dim: "JP", pole: 1, weight: 1.35, type: "dilemma",
      scene: "边界校准 · 生活掌控感", icon: "🧭",
      prompt: "面对接下来一个月的个人生活与项目，哪种状态让你睡得最安稳？",
      leftText: "主要节点和安排都已清晰落定，每天照着稳妥的路线推进",
      rightText: "只留几个大致方向，保留充足的弹性空间随时顺应新灵感调整"
    },
    {
      id: "tb_JP_2", dim: "JP", pole: -1, weight: 1.35, type: "dilemma",
      scene: "边界校准 · 决策时机", icon: "⏳",
      prompt: "挑选一个选项很多的目标（如目的地、课程或方案）时，你更像哪一边？",
      leftText: "喜欢多留点探索余地，临近不得不决定时再结合最新信息拍板",
      rightText: "希望尽快筛选出最优解并敲定下来，好把心思集中到下一步执行"
    },
    {
      id: "tb_AT_1", dim: "AT", pole: 1, weight: 1.35, type: "dilemma",
      scene: "边界校准 · 内在基调", icon: "🌤️",
      prompt: "如果用一种自然意象形容你绝大多数时候的内在情绪底色，更接近？",
      leftText: "平稳宽阔的湖面：风起时有涟漪，但很快恢复原本的从容与笃定",
      rightText: "灵敏细腻的风铃：对环境与自我的细微变化感知清晰，常在反思中自我打磨"
    },
    {
      id: "tb_AT_2", dim: "AT", pole: -1, weight: 1.35, type: "dilemma",
      scene: "边界校准 · 面对评价与进步", icon: "🪞",
      prompt: "完成一件事并收获肯定后，内心最自然浮现的余音更接近哪一句？",
      leftText: "「不错，但好像还有几处细节下次可以打磨得更到位。」",
      rightText: "「已经完成得挺扎实了，开心收官，准备迎接下一件事！」"
    }
  ];

  global.MBTI_CHAPTERS = MBTI_CHAPTERS;
  global.MBTI_MICRO_REACTIONS = MBTI_MICRO_REACTIONS;
  global.MBTI_QUESTIONS = MBTI_QUESTIONS;
  global.MBTI_TIEBREAKERS = MBTI_TIEBREAKERS;
})(window);
