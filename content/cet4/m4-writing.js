/* =====================================================================
 * HT Lab · 英语四级课程 · 模块 4：写作（8 关，id 501–508）
 * 面向基础薄弱的学习者：先搭三段式骨架，再练开头/主体/结尾，最后限时实战。
 * 字段说明：
 *   id            关卡号（模块 4 = 5xx）
 *   type          write（写作关）
 *   questions     客观题 [{q,options,answer,explain}]，answer 为正确选项下标（从 0 起）
 *   prompt        写作任务（含话题与要求）
 *   minWords      本关最低词数（考试要求 120–180 词，前几关降低要求做脚手架）
 *   points        必含要点：["关键词",...]，同组内任一命中即算命中（大小写不敏感、按子串匹配）
 *   sample        参考范文（均为 120–180 词的达标作文，可逐句对照）
 *   audio         音频放在 ./audio/cet4/，清单见 outputs/audio/cet4/manifest-m4.json
 * ===================================================================== */
window.CET4_MODULES = window.CET4_MODULES || [];
window.CET4_MODULES.push({
  id: "m4",
  name: "模块 4 · 写作",
  levels: [
    {
      id: 501,
      title: "评分标准与三段式结构：阅卷老师在看什么",
      minutes: 20,
      gist: "先搞清阅卷看的三件事，再套一个不会出错的三段式骨架。",
      lesson: "四级写作占 15%（106.5 分），30 分钟写 120–180 词。阅卷主要看三件事：\n① 结构：有没有分段，每段有没有干自己的活；\n② 内容：有没有扣题，理由是否具体；\n③ 语言：语法、搭配、句式有没有变化。\n这三项里，结构是你最能自己控制的：阅卷时间很短，一篇分成三段、每段第一句就点明这段要说什么的文章，最容易被看懂，也最容易被给分。\n三段式的分工：\n· 第一段（2–3 句）：交代现象或背景 1 句 + 亮明观点 1 句；\n· 第二段（4–6 句）：主题句 + 理由一 + 一句具体说明 + 理由二 + 一句具体说明；\n· 第三段（2–3 句）：换个说法重申观点 + 一条建议或对未来的展望。\n四个最常见的失分点：\n· 通篇一大段，没有分段；\n· 开头就堆理由，读者不知道你要论证什么；\n· 字数低于 120 词（内容明显不足会扣分）；超过 180 词不额外加分，而且写多错多；\n· 全篇简单句，同一个词从头用到尾。\n一段可以直接照抄结构的骨架（里面的内容必须自己填）：\n第一段：Nowadays, …（现象）. In my opinion, …（观点）.\n第二段：First, …（理由一）. For example, …（说明）. Second, …（理由二）. What is more, …（说明）.\n第三段：In conclusion, …（重申观点）. I suggest that we should …（建议）.\n提醒：骨架可以套，句子必须按话题自己写。套得太死、任何题目都能用，阅卷老师一眼就能看出来。",
      usage: "这套「先交代背景、再给结论、最后给建议」的结构，写英文邮件、周报、申请材料时同样好用——对方三秒钟就能看懂你要说什么。",
      takeaways: [
        "四级写作 30 分钟、120–180 词，占 15%",
        "阅卷看三件事：结构、内容、语言；结构最容易自己控制",
        "三段式：现象 + 观点 / 理由 + 说明 / 重申 + 建议",
        "字数低于 120 词会吃亏，超过 180 词不加分且写多错多",
        "骨架可以套，内容必须按话题自己写"
      ],
      type: "write",
      taskTitle: "三段式写作",
      taskCopy: "先做五道选择题，再按三段式写一篇短文。检查器会核对结构要点和词数，写完可以对照参考范文。",
      passRatio: 0.8,
      questions: [
        {
          q: "四级写作的考试时间和字数要求是？",
          options: ["25 分钟，100–150 词", "30 分钟，120–180 词", "30 分钟，200–250 词", "40 分钟，140–160 个汉字"],
          answer: 1,
          explain: "四级写作 30 分钟、120–180 词，占 15%（106.5 分）。D 的 140–160 个汉字是翻译题的要求，别和写作混在一起；C 超出了上限，写多错多，也不额外加分。"
        },
        {
          q: "阅卷时，最能体现「结构」这一项的是？",
          options: ["有没有用高级词", "字数有没有超过 180", "有没有引用一句名言", "有没有分段，每段第一句有没有点明这段要说什么"],
          answer: 3,
          explain: "结构看的是「分段」和「主题句」——阅卷时间很短，分段清楚、每段第一句就交代内容的文章最容易被看懂。高级词、名言都不属于结构，硬塞还可能跑题。"
        },
        {
          q: "三段式中，第二段（主体段）最该做的是？",
          options: ["给出两到三条理由，每条理由后跟一句具体说明", "把第一段的观点换个说法再写一遍", "多列几个高级词汇，让阅卷老师看到词汇量", "写一个例子，并且把例子写得越长越好"],
          answer: 0,
          explain: "主体段的职责是「证明观点」：理由加具体说明才有说服力。B 是结尾段的活；C 是常见误区，词要放进句子里才有用；D 的例子再长也只是一个例子，撑不起整段。"
        },
        {
          q: "时间有限时，关于字数的哪种做法最稳？",
          options: ["写到 180 词以上更保险，多写总比少写好", "只要理由写得好，写 100 词也没关系", "控制在 120–180 词之间，写完数一遍", "先花 20 分钟写主体段，开头结尾能写多少写多少"],
          answer: 2,
          explain: "官方要求就是 120–180 词。低于 120 词会被认为内容不足；超过 180 词不额外加分，而且句子越多越容易出错。D 的问题在结构：没有开头和结尾，结构分先丢一半。"
        },
        {
          q: "下面哪个开头同时交代了现象和观点？",
          options: [
            "Nowadays, an increasing number of students take part-time jobs.",
            "Nowadays, an increasing number of students take part-time jobs. In my view, this trend is helpful if it does not affect their studies.",
            "In my view, part-time jobs are helpful if they do not affect students' studies.",
            "Part-time jobs are a hot topic today, and this essay will discuss them."
          ],
          answer: 1,
          explain: "「现象 + 观点」= 先用一句背景把话题引出来，再用一句表明立场。A 只有现象，C 只有观点，D 是典型的空话开头——this essay will discuss 不提供任何信息。"
        }
      ],
      prompt: "以 “The Importance of Time Management” 为题，按三段式写一篇短文。\n要求：\n① 第一段：先写一句现象（很多人觉得时间不够用），再写一句观点，用上 In my opinion / In my view 这类表达；\n② 第二段：用 First … / Second … 给出两条理由，每条理由后面跟一句具体说明；\n③ 第三段：用 In conclusion / To sum up 收尾，重申观点，再给一条建议。\n本关只练结构，写够 90 词就能过关（考试要求是 120–180 词）。",
      placeholder: "Nowadays, ... In my opinion, ...",
      minWords: 90,
      points: [
        ["time management", "manag"],
        ["important", "importance", "essential", "crucial", "vital", "significant", "necessary"],
        ["first", "firstly", "to begin with", "to start with", "for one thing", "one reason", "on the one hand"],
        ["second", "secondly", "in addition", "moreover", "besides", "what's more", "what’s more", "what is more", "furthermore", "on the other hand", "also", "another", "additionally"],
        ["in conclusion", "to sum up", "all in all", "in short", "in a word", "to conclude", "overall", "summar", "last but not least", "finally", "in the end"]
      ],
      sample: "The Importance of Time Management\n\nNowadays, many college students complain that they never have enough time. In my opinion, learning to manage time is one of the most important skills in university life.\n\nFirst, good time management makes study more efficient. When students arrange their tasks in order, they can finish their homework earlier and still have time to rest. Second, it helps reduce stress. A student who plans the week ahead will not stay up late before an exam, and this habit is much healthier than working under pressure.\n\nIn conclusion, time management is important for both our studies and our health. I suggest that every student should make a simple weekly plan and check it every Sunday evening. With a little practice, we can all use our time much better."
    },
    {
      id: 502,
      title: "开头段三招：现象法、观点法、图表法",
      minutes: 22,
      gist: "开头段只有 2–3 句，但要同时完成「引出话题」和「亮明观点」。",
      lesson: "开头段的任务是固定的：把话题引出来，再亮明你的观点。三种写法覆盖绝大多数题目。\n① 现象法（最通用）：Nowadays, an increasing number of … / In recent years, … has become increasingly common. 后面接一句观点。\n② 观点法（题目已经给了两种对立看法时）：When it comes to …, opinions vary. Some people believe that …, while others argue that …. As far as I'm concerned, …. 先把两方各说一句，再表态，显得客观。\n③ 图表法（题目给图表或数据时）：The chart shows that the number of … rose from … to … between 20XX and 20XX. 先给关键数字和趋势，再说这说明什么，最后表态。\n开头常用替换（换着用，不要每次都同一个）：\n· nowadays / in recent years / at present；\n· an increasing number of / a growing number of / more and more；\n· in my opinion / in my view / as far as I'm concerned / from my perspective。\n三个要避开的开头：\n· 把题目翻译一遍当开头（等于没写）；\n· I will talk about … / This essay will discuss …（空话，占字数不给分）；\n· With the development of society …（本身没错，但太空泛；要用就紧接着补一句具体的现象，例如 With the development of the Internet, an increasing number of students now take online courses）。\n写开头段的顺序建议：先写现象句（1 句），再写观点句（1 句），最后回读一遍——两句之间有没有关系，阅卷老师能不能一眼看出你要谈什么。",
      usage: "邮件的第一句、汇报的开场白都一样：先把背景一句话交代清楚，再给结论，对方才知道你要说什么。",
      takeaways: [
        "开头段 2–3 句：背景/现象 + 观点",
        "现象法最通用；对立观点题用 Some … while others … 再表态",
        "图表题开头必须给出关键数据和趋势，不要抄全部数字",
        "别写 I will talk about …，也别把题目翻译一遍"
      ],
      type: "write",
      taskTitle: "开头段 + 全篇写作",
      taskCopy: "先做四道选择题，再写一篇完整短文，重点盯开头段：第一句用现象法，第二句表态。",
      audio: [
        {
          file: "502-1.mp3",
          label: "三种开头示范朗读",
          voice: "女声",
          hint: "听三种开头各自用了什么信号词",
          transcript: "Nowadays, an increasing number of college students take part-time jobs. In my view, this trend is beneficial as long as students keep a balance between work and study.\nWhen it comes to part-time jobs, opinions vary. Some people believe that such jobs waste time, while others argue that they build useful experience. As far as I'm concerned, the benefits are greater than the problems.\nThe chart shows that the number of students with part-time jobs rose from 20 percent in 2015 to 45 percent in 2024. This change suggests that more students are trying to gain work experience before they graduate."
        }
      ],
      audioTip: "音频读的是三篇范文的开头段。先听一遍，注意每段第一句用的是什么信号词（Nowadays / When it comes to / The chart shows）。",
      passRatio: 0.75,
      questions: [
        {
          q: "图表类作文的开头段，最该出现的是？",
          options: ["先亮出自己的观点，图表数据留到结尾再说", "引用图表里的关键数据，并说明它反映的趋势", "把图表里的每一个数字都抄一遍，越全越好", "写一句 As we all know, the chart is very important. 作为过渡"],
          answer: 1,
          explain: "图表作文的开头要完成「读图」这一步：挑一到两个关键数据（时间、数字、变化方向）说明趋势，再表态。C 抄全部数字既占字数又看不出重点，D 是空话，A 把顺序颠倒了——开头没有数据，后面的观点就没有依据。"
        },
        {
          q: "With the development of society, … 这类开头最大的问题是什么？",
          options: ["语法错误，不能用", "用词太简单，显得水平低", "太空泛，和后面的具体话题接不上", "只能用在结尾段"],
          answer: 2,
          explain: "这句话本身没有语法问题，问题是它不含任何信息，读完不知道你要谈什么。要用也可以，后面必须立刻接一句具体的现象，别人才能看出话题。"
        },
        {
          q: "题目给出了两种对立看法（Some people think … Others think …），开头段最稳的写法是？",
          options: ["只写自己的观点，越快表态越好", "先写两个例子，最后才引出话题", "把两种看法各抄一遍，不表态", "先把两种看法各用一句话说清楚，再用 As far as I'm concerned 表明立场"],
          answer: 3,
          explain: "这类题目考的就是「你怎么看」，所以既要交代双方，也要表态。A 少了铺垫显得突兀；C 只是复述题目，等于没有回答题目；B 的例子应该放到主体段。"
        },
        {
          q: "Nowadays, an increasing number of students ______ part-time jobs to pay for their studies.",
          options: ["take", "takes", "is taking", "was taking"],
          answer: 0,
          explain: "an increasing number of + 复数名词，谓语用复数 take。容易混的是 the number of + 复数名词——那个短语的中心词是 number，谓语要用单数（The number of students is rising.）。D 还与 Nowadays 的时态不符。"
        }
      ],
      prompt: "以 “Should College Students Take Part-Time Jobs?” 为题写一篇短文。\n要求：\n① 开头段（2–3 句）用现象法：先用 Nowadays / In recent years 引出现象，再用 In my view / As far as I'm concerned 亮明观点；\n② 第二段用 First … / Second … 给两条理由，每条后跟一句说明（能用 For example 带一个例子更好）；\n③ 第三段用 To sum up / In conclusion 收尾，再给一条建议。\n写够 90 词即可（考试要求 120–180 词）。",
      placeholder: "Nowadays, ... In my view, ...",
      minWords: 90,
      points: [
        ["part-time", "part time"],
        ["nowadays", "in recent years", "at present", "these days", "today", "currently", "with the development"],
        ["in my opinion", "in my view", "as far as i am concerned", "as far as i'm concerned", "as far as i’m concerned", "from my perspective", "i believe", "i think", "personally"],
        ["first", "firstly", "to begin with", "to start with", "for one thing", "one reason", "on the one hand"],
        ["second", "secondly", "in addition", "moreover", "besides", "what's more", "what’s more", "what is more", "furthermore", "on the other hand", "also", "another", "additionally"],
        ["in conclusion", "to sum up", "all in all", "in short", "in a word", "to conclude", "overall", "summar", "last but not least", "finally", "in the end"]
      ],
      sample: "Should College Students Take Part-Time Jobs?\n\nNowadays, an increasing number of college students take part-time jobs while they are studying. In my view, this trend is beneficial as long as students keep a balance between work and study.\n\nFirst, part-time jobs give students real work experience. For example, a student who works in a coffee shop learns how to deal with customers and how to stay calm when the shop is busy. Second, such jobs help students understand the value of money. Many of them begin to plan their spending more carefully after they receive their first salary.\n\nTo sum up, part-time jobs can be a helpful part of college life. I suggest that students should choose jobs that are close to their campus and never let work take up the time they need for study."
    },
    {
      id: 503,
      title: "主体段：论点 + 论据 + 例证",
      minutes: 22,
      gist: "主体段只干一件事：把观点证明给阅卷老师看。",
      lesson: "主体段是全篇最长的一段，只干一件事：把你的观点证明给读者看。可以套的结构是「主题句 + 论据 + 例证」。\n① 主题句（第一句）：说明这段要证明什么。Regular exercise brings both physical and mental benefits.\n② 论据（理由）：给出理由，并用一句话解释它为什么成立。\n③ 例证（例子）：用 For example / For instance / such as 引出具体的人、事、数字或场景。\n对比一下空话和例证：\n· 空话：Exercise is good in many ways. / Many people like sports. / Everyone knows health is important.\n· 例证：My roommate runs for thirty minutes every morning, and he has lost five kilos this term.\n区别在于例证里有能被想象出来的细节：谁、多少、多久、结果如何。\n两个提醒：\n· 不要用五句话反复说同一个理由。四级作文写两条理由，每条各带一句说明，内容就饱满了；\n· 例子不需要惊天动地，身边的同学、自己的一次经历都可以，只要具体。编造数据反而容易出错。\n主体段最容易犯的三个错：只写理由不举例（显得空）、只举例不说理由（显得散）、例子与理由对不上（例如理由说「有助于健康」，例子却是「打球很开心」）。",
      usage: "汇报工作、向朋友推荐东西时都用同一套逻辑：先说结论，再给理由，最后给一个具体例子——这是最容易说服别人的顺序。",
      takeaways: [
        "主体段结构：主题句 + 理由 + 例证（两条理由更饱满）",
        "主题句放段首，一句话说明这段要证明什么",
        "例证要有具体细节：谁、多少、多久、结果如何",
        "别用五句话重复同一个理由，也别让例子和理由对不上"
      ],
      type: "write",
      taskTitle: "主体段写作",
      taskCopy: "先做五道选择题，再写完整短文，重点盯第二段：主题句 + 理由一 + 例证 + 理由二 + 例证。",
      passRatio: 0.8,
      questions: [
        {
          q: "下面哪一句最适合做主体段的主题句？",
          options: ["For example, my roommate runs every morning.", "Regular exercise brings both physical and mental benefits.", "In conclusion, exercise is good for us.", "What is exercise? Let me explain it in detail."],
          answer: 1,
          explain: "主题句要能统领整段：B 说清了这段要证明什么，后面接理由和例子都顺。A 是例证，位置和功能都不对；C 是结尾句；D 是空话，占字数不给分。"
        },
        {
          q: "Regular exercise can improve our mood. ______, students who run for twenty minutes before class often feel more focused.",
          options: ["For example", "In conclusion", "However", "Otherwise"],
          answer: 0,
          explain: "后一句是前一句的具体例子，所以用 For example。In conclusion 用于收尾；However 表转折，前后没有相反关系；Otherwise 表示「否则」，后面应该接「不这样做会怎样」。"
        },
        {
          q: "主体段里，「论据」和「例证」的关系是？",
          options: ["例证就是把论据换个说法再说一遍", "有例证就不需要论据，例子越多越好", "论据是理由，例证是支撑这条理由的具体事实或细节", "例证必须是名人故事，身边的小事不算"],
          answer: 2,
          explain: "论据回答「为什么」，例证回答「你怎么知道」，C 说的正是这个分工。A 只是重复，不加分；B 缺了理由，例子会散；D 是误区，身边的同学、自己的一次经历都可以，关键是具体。"
        },
        {
          q: "下面哪一句是「具体」的例证，而不是空话？",
          options: ["Exercise is good in many ways.", "Many people like sports.", "Everyone knows that health is important.", "My father walks 8,000 steps every day, and his blood pressure has returned to normal."],
          answer: 3,
          explain: "具体就是有能被想象出来的细节：谁、多少、多久、结果如何。D 里有具体的人、数字和结果。A、B、C 都是「换任何话题都成立」的空话，正因为太笼统，所以不加分。"
        },
        {
          q: "Regular exercise keeps us ______.",
          options: ["health", "healthy", "healthily", "healthiness"],
          answer: 1,
          explain: "keep + 宾语 + 形容词，表示「使……保持某种状态」，所以是 keep us healthy。health 和 healthiness 是名词，healthily 是副词，都不能作宾补。"
        }
      ],
      prompt: "以 “Why We Should Exercise Every Day” 为题写一篇短文，重点练主体段。\n要求：\n① 第二段必须是完整的「主题句 + 理由一 + 例证 + 理由二 + 例证」；\n② 例证用 For example / For instance / such as 引出，并写出具体细节（谁、多少、多久、结果如何）；\n③ 开头段 2–3 句（现象 + 观点），结尾段 2–3 句（To sum up / In conclusion + 建议）。\n写够 100 词（考试要求 120–180 词）。",
      placeholder: "Nowadays, ... First, ... For example, ...",
      minWords: 100,
      points: [
        ["exercise", "sports", "physical activity", "workout", "work out"],
        ["for example", "for instance", "such as", "to illustrate", "an example of"],
        ["health", "healthy", "fit", "fitness", "ill", "disease", "sick", "energy"],
        ["first", "firstly", "to begin with", "to start with", "for one thing", "one reason", "on the one hand"],
        ["second", "secondly", "in addition", "moreover", "besides", "what's more", "what’s more", "what is more", "furthermore", "on the other hand", "also", "another", "additionally"],
        ["in conclusion", "to sum up", "all in all", "in short", "in a word", "overall", "summar", "last but not least", "finally", "in the end"]
      ],
      sample: "Why We Should Exercise Every Day\n\nNowadays, many students spend most of their day sitting in classrooms or in front of a screen. In my opinion, taking regular exercise is one of the best habits we can build at college.\n\nFirst, exercise keeps us healthy. For example, a friend of mine used to catch a cold every month, but since he started running three times a week, he has hardly been ill. Second, exercise also improves our mood and our memory. Students who play basketball for an hour often find it easier to concentrate when they go back to their books.\n\nTo sum up, regular exercise benefits both our body and our mind. I suggest that we should set a fixed time for sports every week and treat it as part of our study plan."
    },
    {
      id: 504,
      title: "结尾段：总结与升华",
      minutes: 22,
      gist: "结尾段只有 2–3 句，写好了是「稳稳收住」，写砸了就是「跑题」。",
      lesson: "结尾段通常 2–3 句，做下面三件事中的两件就够：\n① 重申观点：用不同的话把第一段的观点再说一遍（不是原句照抄）；\n② 给出建议：I suggest that … / It is better to … / We should …；\n③ 适度升华：把个人话题联系到更大的意义或未来，但必须仍然扣住题目。\n看一个例子（读书的好处）：\n开头：In my opinion, reading is one of the most valuable habits a college student can keep.\n结尾：In conclusion, reading is still the cheapest way to broaden our knowledge and improve our language. I suggest that we should read a few pages every night.\n两句之间没有重复用词，但观点是一致的——这就是「换个说法重申」。\n常用收尾信号：In conclusion / To sum up / All in all / In short / In a word / To conclude。\n结尾段最常犯的三个错：\n· 引入一个全新的、前文没提过的话题；\n· 只写一句 In a word, it is good. 就交差——既没有重申观点，也没有建议；\n· 时间不够就空着不写。结尾段只有 2–3 句，性价比其实很高，先把它写完。\n「升华」不等于喊口号：If we keep this habit, we will benefit from it for the rest of our lives. 比只喊一句 Reading is great 有用得多，因为它把话题接到了未来。",
      usage: "邮件结尾写一句建议或下一步安排（I suggest we meet on Friday.），比只写 Best wishes 更能推动事情。",
      takeaways: [
        "结尾段 2–3 句：换个说法重申观点 + 一条建议或展望",
        "收尾信号：In conclusion / To sum up / All in all / In a word",
        "结尾段不引入新话题，也不原句照抄开头",
        "时间不够也要先把结尾写完，它只有两三句"
      ],
      type: "write",
      taskTitle: "结尾段写作",
      taskCopy: "先做四道选择题，再写完整短文，重点盯第三段：重申观点 + 建议 + 一句展望。",
      passRatio: 0.75,
      questions: [
        {
          q: "下面哪一句最适合放在「读书的好处」一文的结尾段？",
          options: ["For example, my sister reads two books a month.", "Nowadays, more and more people are aware of the importance of reading.", "In conclusion, reading not only broadens our knowledge but also makes us more thoughtful, so it is worth keeping as a daily habit.", "Reading is good. Reading is very good. I like reading very much."],
          answer: 2,
          explain: "结尾句要「收得住」：C 用 In conclusion 明确收尾，重申了观点（broadens knowledge / makes us thoughtful），还给出了态度（worth keeping）。A 是例证，属于主体段；B 是典型的开头句；D 只是重复，没有总结。"
        },
        {
          q: "结尾段的「升华」指的是？",
          options: ["把观点说得更绝对，多用一定、永远这类词", "把个人话题联系到更大的意义或未来，但仍然扣住题目", "加一句名人名言，越长越好", "换一个新话题继续讨论，显得内容多"],
          answer: 1,
          explain: "升华是「往上说一层」：从个人说到群体、从现在说到将来，但话题不能换。A 说得太满反而站不住脚；C 名言本身不错，但和题目无关就成了跑题；D 是结尾段最严重的错误。"
        },
        {
          q: "时间不够时，结尾段怎么写最划算？",
          options: ["用 2–3 句：一句换个说法重申观点，一句给建议或展望", "空着不写，把时间都留给主体段", "把主体段的例子再抄一遍凑字数", "写一句 Thank you for reading. 收尾"],
          answer: 0,
          explain: "结尾段只有 2–3 句，性价比很高，A 是最省时间的做法。B 会直接丢结构分；C 是重复，阅卷老师一眼能看出来；D 是中文习惯，英语作文里不需要向读者道谢。"
        },
        {
          q: "下面哪一句的搭配是对的？",
          options: ["We should pay attention on our health.", "We should pay attention for our health.", "We should take attention to our health.", "We should pay attention to our health."],
          answer: 3,
          explain: "pay attention to 是固定搭配，to 不能换成 on 或 for。attention 也不能和 take 搭配——可以说 take care of、take notice of，但没有 take attention to 这种说法。"
        }
      ],
      prompt: "以 “The Value of Teamwork” 为题写一篇短文，重点练结尾段。\n要求：\n① 开头段：现象 + 观点各一句；\n② 第二段：First … / Second … 两条理由，各跟一句说明；\n③ 结尾段（2–3 句）：用 In conclusion / To sum up 开头，先换个说法重申观点，再给一条建议（I suggest / We should …），最后可以顺带说一句未来的影响。\n写够 100 词（考试要求 120–180 词）。",
      placeholder: "In conclusion, ... I suggest that ...",
      minWords: 100,
      points: [
        ["teamwork", "team work", "group work", "work together", "cooperat"],
        ["important", "importance", "essential", "crucial", "vital", "valuable", "significant", "necessary", "worth"],
        ["first", "firstly", "to begin with", "to start with", "one reason", "second", "secondly", "in addition", "moreover", "besides", "what's more", "what’s more", "what is more", "also", "another"],
        ["in conclusion", "to sum up", "all in all", "in short", "in a word", "to conclude", "overall", "summar", "last but not least", "finally", "in the end"],
        ["suggest", "should", "advice", "advise", "recommend", "it is better to", "had better", "need to"],
        ["future", "will", "hope", "look forward", "coming years"]
      ],
      sample: "The Value of Teamwork\n\nNowadays, group work is common in almost every course at college. In my opinion, learning to work in a team is as important as what we learn from textbooks.\n\nFirst, teamwork lets us finish a large task in a shorter time. When four students share the work, each of them can focus on the part he or she does best. Second, teamwork teaches us how to listen. In a group discussion, we have to explain our ideas clearly and also accept better ideas from others.\n\nIn conclusion, teamwork is valuable for both our study and our future career. I suggest that every student should take at least one group project seriously and learn to cooperate with people who think differently. If we can do this at college, we will work more smoothly with our colleagues in the future."
    },
    {
      id: 505,
      title: "高级替换：词与句的升级（必须看语境）",
      minutes: 25,
      gist: "升级不是把词换难，而是换得更准确；搭配错了，难词反而是扣分项。",
      lesson: "升级的第一步不是背难词，而是看语境：同一个 good，语境不同要换成不同的词。\n· 说电影、成绩、表现好：remarkable / impressive\n· 说课程、经历有收获：rewarding / worthwhile\n· 说方法有效：an effective method / a practical approach\n· 说影响很大：a significant / a considerable influence\n· 说很重要：essential / crucial / vital（比 very important 更有力）\n· 说数量在涨：a growing number of（比 more and more 更书面）\n句子层面的升级更值钱（把短语和句型一起换）：\n· The Internet is very important to us. → The Internet plays a vital role in our daily life.\n· Many students think reading is good. → Many students regard reading as rewarding.\n· I think it is good. → In my view, it is beneficial to students.\n三条铁律：\n① 搭配优先：make progress（不是 do progress）、play a role in（介词是 in，不是 of）、gain knowledge（不是 learn knowledge）。搭配错的难词，比简单词更扣分。\n② 看语境：remarkable 可以形容电影、成绩、表现，但形容「有用」要用 useful / beneficial。一个词再好，放错地方就是错。\n③ 别硬套：一篇 120–180 词的作文，出现 3–5 处升级就足够亮眼；每句都塞难词，读起来生硬，也更容易出错。宁可全篇简单词都对，也不要一半难词都错。",
      usage: "写英文简历、邮件、产品文案时，措辞的准确度直接决定别人对你的印象——这正是「升级」在真实场景里的价值。",
      takeaways: [
        "升级 = 换得更准确，不是换得更难",
        "看语境选词：形容收获用 rewarding，形容重要用 essential",
        "句子升级比单词升级更值钱（play a vital role in）",
        "搭配永远优先；一篇作文 3–5 处升级就够，别硬套"
      ],
      type: "write",
      taskTitle: "升级表达写作",
      taskCopy: "先做五道选择题，再写一篇短文，全文至少用上 3 处本关替换表里的升级表达。",
      audio: [
        {
          file: "505-1.mp3",
          label: "替换前后对比朗读",
          voice: "女声",
          hint: "先听原句，再听升级后的句子",
          transcript: "The film was good. The film was remarkable. I still remember the ending.\nThe course was useful. The course was a rewarding experience.\nThe Internet is very important to us. The Internet plays a vital role in our daily life.\nMore and more students take part-time jobs. A growing number of students take part-time jobs."
        }
      ],
      audioTip: "音频先读原句、再读升级后的句子。听完把四个升级表达抄一遍，再各写一句自己的话——只背词不造句，考场上还是用不出来。",
      passRatio: 0.8,
      questions: [
        {
          q: "Volunteering at the community center was a ______ experience; I learned a lot and made new friends.",
          options: ["expensive", "rewarding", "similar", "likely"],
          answer: 1,
          explain: "语境里出现 learned a lot and made new friends，说明这次经历「有收获」，rewarding（有回报的、值得的）最贴切。另外三个都是真词，但放进来意思不通——升级词的第一步是放得进语境。"
        },
        {
          q: "下面哪一句的用词最适合四级作文的正式程度？",
          options: ["The plan is good and we can do it.", "The plan is quite good, and I like it.", "The plan is practical and worth trying.", "The plan is OK, not bad."],
          answer: 2,
          explain: "四级作文是书面语。C 用 practical 说明「可行」、worth trying 说明「值得一试」，信息量最大；A、B、D 都停在 good / OK 这种口语化评价上，显得单薄。注意：升级不是堆难词，而是换更准确的词。"
        },
        {
          q: "关于「高级替换」，下面哪种说法是对的？",
          options: ["先看语境和搭配，词放得进去才叫升级", "难词越多越好，只要用上就能加分", "同一个高级词反复用，阅卷老师印象更深", "把文章里所有 good 都换成 remarkable 就成功了"],
          answer: 0,
          explain: "替换的前提是搭配正确、语境合适：remarkable 形容电影、成绩、表现可以，形容「有用」要用 useful / beneficial。B 和 D 是典型误区，词用错比用简单词更扣分；C 反复用同一个词，反而显得词汇量有限。"
        },
        {
          q: "下面哪一组的搭配都正确？",
          options: ["make a progress / take an advice", "do progress / give an advice", "make progresses / take advices", "make progress / take my advice"],
          answer: 3,
          explain: "progress 和 advice 都是不可数名词：make progress、take / follow one's advice，前面不加 a，也没有复数形式。这类「不可数名词 + 固定搭配」是写作里最容易反复出错的地方。"
        },
        {
          q: "原句 The Internet is very important to us. 下面哪种改法最能提升表达？",
          options: ["The Internet is very, very important to us.", "The Internet is important, and it has great importance.", "The Internet plays a vital role in our daily life.", "The Internet is an important thing that everyone needs."],
          answer: 2,
          explain: "C 用 play a vital role in 这个固定搭配，把 important 升级成 vital，句子也更书面。A 只是重复 very；B 是同义反复（important 换成 has importance）；D 虽没错，但 an important thing 表达笼统，不如 C 准确。"
        }
      ],
      prompt: "以 “Volunteering: A Rewarding Experience” 为题写一篇短文，全文至少用 3 处升级表达。\n要求：\n① 升级词从本关替换表里挑（beneficial / rewarding / valuable / essential / significant / a growing number of 等），并且要放得进句子；\n② 第一段用现象 + 观点，观点句里至少出现一个升级词；\n③ 第二段用 First … / Second … 给两条理由，其中一条用句子升级（如 play a vital role in）；\n④ 第三段用 To sum up / In conclusion 收尾并给建议。\n写够 100 词（考试要求 120–180 词）。",
      placeholder: "Nowadays, ... rewarding ...",
      minWords: 100,
      points: [
        ["volunteer", "community service", "voluntary work", "help others", "helping others", "help"],
        ["beneficial", "rewarding", "valuable", "meaningful", "remarkable", "significant", "essential", "crucial", "outstanding", "impressive", "worthwhile", "invaluable", "a growing number of"],
        ["first", "firstly", "to begin with", "to start with", "for one thing", "one reason", "on the one hand"],
        ["second", "secondly", "in addition", "moreover", "besides", "what's more", "what’s more", "what is more", "furthermore", "on the other hand", "also", "another", "additionally"],
        ["in conclusion", "to sum up", "all in all", "in short", "in a word", "to conclude", "overall", "summar", "last but not least", "finally", "in the end"]
      ],
      sample: "Volunteering: A Rewarding Experience\n\nNowadays, an increasing number of college students spend their weekends on volunteer work. In my view, volunteering is a rewarding experience that is worth trying at least once during our college years.\n\nFirst, volunteering gives us valuable chances to use what we have learned in class. For example, students who help at a community library can practice their communication skills while they serve real readers. Second, it helps us understand the world outside the campus. When we work with elderly people or children, we begin to see problems that textbooks never mention.\n\nTo sum up, volunteering is beneficial to both the community and the students themselves. I strongly suggest that every student should spend a few hours each month on such work, because it makes us more thoughtful and more confident."
    },
    {
      id: 506,
      title: "连接词与逻辑衔接：转折、因果、递进、举例",
      minutes: 25,
      gist: "连接词是给阅卷老师的路标：四类够用，但标点别写错。",
      lesson: "连接词的作用是告诉阅卷老师：这两句是什么关系。四类就够用了。\n① 转折：however / nevertheless / on the other hand / in contrast（书面）；but / yet（口语一点）\n② 因果：because / since（原因）；therefore / as a result / consequently / thus（结果）\n③ 递进：moreover / furthermore / in addition / besides / what's more\n④ 举例：for example / for instance / such as / to illustrate\n标点规则（写作里最容易被扣分的一处）：however、therefore、moreover 都是副词，不能像 but 那样直接连接两个完整的句子。\n· 错：Online shopping is convenient, however it has problems.（逗号粘连）\n· 对：Online shopping is convenient; however, it has problems.\n· 也对：Online shopping is convenient. However, it has problems.\n一句话原则：先想逻辑，再选词。想写「转折」才用 however；如果两句其实是同一方向的补充，用 moreover 才对。逻辑错了，连接词越高级越显眼。\n别硬套：一段里塞四个连接词，文章会显得机械。通常每段用 1–2 个，其余靠句子的意思自然衔接。另外，and、but、so 不是不能用，只是用多了显得幼稚——把其中一半换成上面这些词，文章立刻成熟一个档次。",
      usage: "写邮件、做汇报、跟人解释一件事，都靠这些词交代前因后果；逻辑词用对了，别人才不会误解你的意思。",
      takeaways: [
        "四类连接词：转折 / 因果 / 递进 / 举例，每类记住 2 个就够",
        "however、therefore、moreover 是副词，不能直接连两个句子",
        "正确用法：分号 + however, 或句号断开另起一句",
        "先想逻辑再选词；每段 1–2 个就够，别硬塞"
      ],
      type: "write",
      taskTitle: "逻辑衔接写作",
      taskCopy: "先做五道选择题，再写一篇短文，四类连接词各至少用一次。",
      passRatio: 0.8,
      questions: [
        {
          q: "Online shopping is convenient. ______, it brings problems such as fake goods.",
          options: ["Therefore", "However", "For example", "Moreover"],
          answer: 1,
          explain: "前后是相反关系（方便 vs 有假货问题），用 However。Therefore 表结果；For example 要求后面是前一句的例子，而这一句是概括；Moreover 表递进，方向也反了。"
        },
        {
          q: "The road was closed for repairs. ______, we had to take a much longer route.",
          options: ["As a result", "For example", "In addition", "However"],
          answer: 0,
          explain: "「封路」导致「绕远路」，是因果关系。For example 后面要接例子；In addition 要求再加一条同类信息；However 表转折，都与句意不符。"
        },
        {
          q: "Reading broadens our knowledge. ______, it improves our writing.",
          options: ["Otherwise", "In contrast", "For instance", "Moreover"],
          answer: 3,
          explain: "两句都是读书的好处，方向一致，用递进的 Moreover。In contrast 表对比，Otherwise 表「否则」，For instance 后面要接具体例子，而这一句是另一条并列的好处。"
        },
        {
          q: "Some habits are hard to change. ______, many students check their phones the moment they wake up.",
          options: ["Therefore", "Nevertheless", "For instance", "As a result"],
          answer: 2,
          explain: "后一句是「习惯难改」的一个具体例子，用 For instance。Therefore 和 As a result 都表示结果，Nevertheless 表示让步转折，逻辑上都不通。"
        },
        {
          q: "下面哪一句的连接词和标点都正确？",
          options: ["Online shopping is convenient, however it also has problems.", "Online shopping is convenient; however, it also has problems.", "Online shopping is convenient, however, it also has problems.", "Online shopping is convenient however it also has problems."],
          answer: 1,
          explain: "however 是副词，不能像 but 那样用逗号连接两个完整句子。正确做法是用分号（B）或句号断开，并且 however 后面加逗号。A 和 C 都是逗号粘连（comma splice），D 连标点都没有。"
        }
      ],
      prompt: "以 “Online Shopping: Convenience and Problems” 为题写一篇短文，重点练逻辑衔接：四类连接词各至少用一次。\n要求：\n① 转折（however / although / on the other hand）至少 1 处，标点要正确；\n② 因果（because / as a result / therefore）至少 1 处；\n③ 递进（moreover / in addition / besides）至少 1 处；\n④ 举例（for example / such as）至少 1 处；\n⑤ 三段式：现象 + 观点 → 便利与问题 → In conclusion 收尾 + 建议。\n写够 110 词（考试要求 120–180 词）。",
      placeholder: "Nowadays, ... However, ... As a result, ...",
      minWords: 110,
      points: [
        ["online shopping", "shopping online", "online store", "the internet", "online"],
        ["however", "nevertheless", "yet", "although", "on the other hand", "in contrast", "while"],
        ["because", "therefore", "as a result", "consequently", "thus", "since", "for this reason", "result in", "lead to", "due to"],
        ["moreover", "furthermore", "in addition", "besides", "what's more", "what’s more", "what is more", "also", "not only", "as well as"],
        ["for example", "for instance", "such as", "to illustrate"],
        ["in conclusion", "to sum up", "all in all", "in short", "in a word", "to conclude", "overall", "summar", "last but not least", "finally", "in the end"]
      ],
      sample: "Online Shopping: Convenience and Problems\n\nNowadays, online shopping has become part of our daily life. In my opinion, it makes life much easier, although it also brings new problems that we should not ignore.\n\nOnline shopping is convenient because we can buy almost anything without leaving home. Moreover, the price is often lower than in a real shop, and the goods arrive within a few days. However, there are also real risks. For example, some sellers show beautiful pictures but send poor products, and returning them can take a long time. As a result, many students lose money simply because they trust the photos too much.\n\nIn conclusion, online shopping is worth using, but we should check the reviews and the return policy before we pay. If we stay careful, we can enjoy the convenience and avoid most of the trouble."
    },
    {
      id: 507,
      title: "中式英语排查：12 条最常见的错",
      minutes: 25,
      gist: "这些错几乎都来自「逐字翻译」；写完作文按清单扫一遍，能救回好几分。",
      lesson: "下面 12 条是最常见的中式英语，根源都是把中文逐字翻成英文。左边是错句，右边是改法。\n① There have many students in the library. → There are many students in the library.（there be 句型里，be 的单复数由后面的名词决定）\n② I learned a lot of knowledge from the course. → I learned a lot from the course. / I gained a lot of knowledge from the course.（knowledge 不与 learn 搭配）\n③ I very like this city. → I like this city very much.（very 不能直接修饰动词）\n④ I very interested in history. → I am very interested in history.（形容词前面要有 be 动词）\n⑤ Please open the light. → Please turn on the light.（开灯用 turn on）\n⑥ Although he was tired, but he kept working. → Although he was tired, he kept working. / He was tired, but he kept working.（although 和 but 二选一）\n⑦ Because it was raining, so we stayed at home. → Because it was raining, we stayed at home. / It was raining, so we stayed at home.（because 和 so 二选一）\n⑧ My English level has improved. → My English has improved.（英语里不常说 level）\n⑨ There are many people think reading is useless. → Many people think reading is useless. / There are many people who think reading is useless.（一个句子不能有两个谓语）\n⑩ I think it is not a good idea. → I don't think it is a good idea.（否定前移更地道；原句不算语法错误，但英语习惯把否定放到 think 前面）\n⑪ The price of the phone is very expensive. → The phone is very expensive. / The price of the phone is very high.（价格用 high / low，物品才用 expensive / cheap）\n⑫ Learn English is important. → Learning English is important.（动词原形不能直接作主语）\n怎么用这份清单：写完作文后从上到下扫一遍，重点看 there be 句型、knowledge 的搭配、because/so 与 although/but 有没有同时出现。这 12 条属于「一犯就被看见」的错，改掉它们比多背 20 个高级词更划算。",
      usage: "这些错在邮件和简历里杀伤力更大：母语者一眼就能看出是逐字翻译，改掉之后，你的英文会立刻显得可靠。",
      takeaways: [
        "there be 句型里，be 的单复数看后面的名词（There are many students.）",
        "knowledge 用 gain / acquire，不用 learn",
        "although 和 but、because 和 so 都不能同时出现",
        "动词原形不能作主语，要用动名词（Learning English is important.）"
      ],
      type: "write",
      taskTitle: "中式英语排查 + 写作",
      taskCopy: "先做五道纠错选择题，再写一篇短文，写完对照 12 条清单自查一遍。",
      passRatio: 0.8,
      questions: [
        {
          q: "下面哪一句是正确的？",
          options: ["There have many students in the library.", "There are many students in the library.", "There has many students in the library.", "There has been many students in the library."],
          answer: 1,
          explain: "there be 句型里，be 动词的单复数由后面的名词决定：many students 是复数，所以用 There are。There have 是把中文「有」逐字翻过来的结果；D 里 has been 与复数主语也不匹配（应为 have been）。"
        },
        {
          q: "I learned a lot of knowledge from the course. 这句怎么改最自然？",
          options: ["I learned a lot from the course.", "I learned many knowledges from the course.", "I learned knowledge a lot from the course.", "I have learned knowledge from the course."],
          answer: 0,
          explain: "英语里 knowledge 不与 learn 搭配，要说 gain / acquire knowledge，或者干脆说 learn a lot。knowledge 还是不可数名词，没有 knowledges 这种形式：B、C 在错误的基础上又加了一层错，D 只换了时态，搭配问题还在。"
        },
        {
          q: "I very like this city. 的正确说法是？",
          options: ["I am very like this city.", "I like very much this city.", "I very like this city very much.", "I like this city very much."],
          answer: 3,
          explain: "very 不能直接修饰动词，要表示「很喜欢」就用 like … very much，very much 放在宾语后面。A 把 like 当成了形容词；B 的语序错了；C 是重复。"
        },
        {
          q: "The price of the phone is very expensive. 问题出在哪？",
          options: ["expensive 拼写错了", "price 是可数名词，必须加 s", "price 要用 high / low 来修饰，expensive 只能形容物品本身", "very 不能修饰形容词"],
          answer: 2,
          explain: "英语里价格用 high / low，物品才用 expensive / cheap：The price of the phone is very high. 或 The phone is very expensive.。这正是中文「价格很贵」逐字翻译过来的典型错误。"
        },
        {
          q: "I think it is not a good idea. 更地道、更常用的说法是？",
          options: ["I don't think it is a good idea.", "I think not it is a good idea.", "I am not think it is a good idea.", "I think it not a good idea."],
          answer: 0,
          explain: "英语习惯把否定从从句移到主句，也就是「否定前移」：I don't think it is a good idea.。原句不算语法错误，但说起来不自然。B、C、D 都是语法错误：not 的位置不对，am not think 更是把 be 动词和动词原形混在一起。"
        }
      ],
      prompt: "以 “Why We Learn English” 为题写一篇短文，写完对照本关的 12 条清单自查一遍。\n要求：\n① 正文里不要出现这 12 条错误中的任何一条（特别留意 there be 句型、knowledge 的搭配、because/so 与 although/but 不同时用）；\n② 第一段用 Nowadays + In my opinion 引出话题和观点；\n③ 第二段用 First … / Second … 给两条理由，并用 For example 举一个例子；\n④ 第三段用 In conclusion 收尾，再给一条建议。\n写够 120 词（这就是考试要求的下限）。",
      placeholder: "Nowadays, ... In my opinion, ...",
      minWords: 120,
      points: [
        ["english"],
        ["important", "importance", "essential", "crucial", "necessary", "significant", "useful", "helpful", "worthwhile", "valuable"],
        ["first", "firstly", "to begin with", "to start with", "for one thing", "one reason", "on the one hand"],
        ["second", "secondly", "in addition", "moreover", "besides", "what's more", "what’s more", "what is more", "furthermore", "on the other hand", "also", "another", "additionally"],
        ["for example", "for instance", "such as", "to illustrate"],
        ["in conclusion", "to sum up", "all in all", "in short", "in a word", "to conclude", "overall", "summar", "last but not least", "finally", "in the end"]
      ],
      sample: "Why We Learn English\n\nNowadays, English is not just a subject in the classroom; it is a tool we use every day. In my opinion, learning English well is essential for college students.\n\nFirst, English opens the door to more knowledge. For example, most papers on science and technology are written in English, so students who read English well can gain new knowledge much faster than those who cannot. Second, English helps us make friends around the world. When I talk with a student from another country, I find that we share many interests, and my English improves each time we chat.\n\nIn conclusion, learning English is worthwhile for both our study and our social life. I suggest that we should read one short English article every day and write down three new words from it."
    },
    {
      id: 508,
      title: "限时实战：30 分钟写完 120–180 词",
      minutes: 35,
      gist: "把前面七关的东西合起来用一次：审题、写作、检查，全程限时。",
      lesson: "限时实战：30 分钟写 120–180 词。时间这样分：\n· 2–3 分钟审题：确定话题、写几段、要不要给观点；在草稿区写下三段的关键词（不用写完整句）。\n· 22–24 分钟写作：按第一段 2–3 句、第二段 5–6 句、第三段 2–3 句的节奏往下写。写不出来就先写简单句，别停下来纠结一个词。\n· 3–5 分钟检查：优先看硬伤——主谓一致、时态、单复数、拼写、连接词的标点。\n时间不够时的应急做法：\n· 还差字数：在主体段补一个具体例子（一句话就够），不要加空话；\n· 想不起高级词：用最简单的词把意思写清楚，比写错一个难词划算；\n· 结尾没时间写：写两句也算——In conclusion, … 加一句 I suggest that …。\n整篇的骨架（把七关的内容合起来）：\n第一段：Nowadays, … . In my opinion, … .\n第二段：First, … . For example, … . Second, … . Moreover, … .\n第三段：In conclusion, … . I suggest that we should … .\n考前一周最值得做的准备：\n① 背熟三类开头（现象 / 观点 / 图表）；\n② 四类连接词各记 2 个；\n③ 准备 8–10 个升级词，并且各写一句自己的话；\n④ 至少完整限时写过 3 篇。\n最后提醒：模板只借结构和连接词。整段照抄模板、内容全是空话，阅卷老师一眼就能看出来，反而更容易低分。",
      usage: "限时写作练的是「在压力下把话说清楚」的能力：考试、面试笔试、工作中的紧急邮件，都要求你在有限时间里交出结构完整的东西。",
      takeaways: [
        "30 分钟分三段用：2–3 分钟审题、22–24 分钟写作、3–5 分钟检查",
        "检查优先看主谓一致、时态、单复数、拼写这些硬伤",
        "字数不够就补一个具体例子，别加空话",
        "模板只借结构和连接词，内容必须自己写"
      ],
      type: "write",
      taskTitle: "限时写作挑战",
      taskCopy: "本关限时 35 分钟（写作 30 分钟 + 检查 5 分钟），右上角有倒计时。建议先在草稿区列三段关键词，再开始写。",
      timeLimit: 35,
      passRatio: 0.8,
      questions: [
        {
          q: "30 分钟的写作时间，下面哪种分配最合理？",
          options: ["边想边写，写到哪算哪", "先把每一句都在脑子里想好，最后 10 分钟一次写出来", "把 30 分钟平均分成三份，每段写 10 分钟，写完正好交卷", "2–3 分钟审题列关键词，22–24 分钟写作，最后 3–5 分钟检查"],
          answer: 3,
          explain: "限时写作最怕没留检查时间。D 把审题、写作、检查都留出来了；C 看着均匀，但审题和检查都没有时间，错字和时态错误就只能留在卷面上。"
        },
        {
          q: "最后的检查时间，最该优先看什么？",
          options: ["主谓一致、时态、单复数、拼写这类硬伤", "把每个 good 都换成 remarkable", "把段落顺序调换一下，看哪个更顺", "再补一个例子，把字数冲到 200 词以上"],
          answer: 0,
          explain: "检查的目标是「少丢分」，不是「多加分」。A 里的硬伤每一处都会被看到；B 临时换词最容易换错搭配；C 打乱结构风险很大；D 超过 180 词不额外加分，还容易写错。"
        },
        {
          q: "时间不够，还差 20 词，怎么做最稳？",
          options: ["在每段末尾加一句空洞的感慨", "把前面某一句原样再写一遍", "在主体段补一个具体细节或例子，一句话就够", "空着不写，宁可字数少也不要冒险"],
          answer: 2,
          explain: "补字数的正确方式是补内容：一个具体例子或一句细节，既够字数又让理由更实在。空话和重复句阅卷老师一眼能看出来；字数低于 120 词则会被认为内容不足。"
        },
        {
          q: "考前一周，下面哪种准备最有效？",
          options: ["把 100 篇范文读一遍，混个眼熟", "背熟三类开头 + 四类连接词各 2 个 + 8–10 个升级词，并且每个都自己写一句", "只背 5 个万能模板，考试时整段照抄", "多刷词汇选择题，写作到时候自然就会了"],
          answer: 1,
          explain: "写作是输出，必须自己动笔。B 的量很小，但每一项都能直接搬进考场；A 只读不写，考场上照样写不出来；C 整段照抄模板，内容全是空话；D 是另一种能力，不能互相替代。"
        },
        {
          q: "关于模板，下面哪种用法是对的？",
          options: ["整篇照抄模板，保证结构不出错", "模板越复杂越好，越长越显水平", "只借用模板的结构和连接词，内容全部用自己的话写", "用了模板就不用管字数了"],
          answer: 2,
          explain: "模板的价值在骨架：段落顺序、主题句位置、连接词。内容必须自己写，否则整篇文章换成任何题目都成立，阅卷老师一眼就能看出是套的。B、D 都是常见误解。"
        }
      ],
      prompt: "限时任务：30 分钟内写一篇 120–180 词的短文，题目 “The Benefits of Reading”。\n要求：\n① 三段式：现象 + 观点 → 两条理由（各带说明，其中一条要有 For example 的具体例子）→ In conclusion 收尾 + 一条建议；\n② 至少用 2 处连接词（however / moreover / as a result 等），标点要正确；\n③ 留 3–5 分钟检查主谓一致、时态、单复数、拼写。\n时间提示：右上角有 35 分钟倒计时（写作 30 分钟 + 检查 5 分钟）。写完后可以对照参考范文，看自己的结构差在哪里。",
      placeholder: "Nowadays, ... In my opinion, ...",
      minWords: 120,
      points: [
        ["reading", "read books", "read more", "book"],
        ["benefit", "advantage", "helpful", "helps", "useful", "valuable", "improve", "enrich", "broaden", "rewarding"],
        ["knowledge", "vocabulary", "horizon", "skill", "information", "experience", "wisdom", "language"],
        ["for example", "for instance", "such as", "to illustrate"],
        ["however", "moreover", "furthermore", "in addition", "besides", "therefore", "what's more", "what’s more", "what is more", "as a result", "on the other hand", "first", "second", "finally", "also"],
        ["in conclusion", "to sum up", "all in all", "in short", "in a word", "to conclude", "overall", "summar", "last but not least", "finally", "in the end"]
      ],
      sample: "The Benefits of Reading\n\nNowadays, many students spend their free time on short videos instead of books. In my opinion, reading is still one of the most valuable habits a college student can keep.\n\nFirst, reading broadens our knowledge. Through books, we can travel to places we have never visited and understand lives that are completely different from our own. Second, reading improves our language skills. For example, students who read English novels for twenty minutes a day often write better essays, because they meet useful expressions again and again in real contexts.\n\nIn conclusion, reading benefits us in both knowledge and language skills. I suggest that we should keep a book on the desk and read a few pages every night before we sleep. In this way, we can build the habit without taking up too much of our time."
    }
  ]
});