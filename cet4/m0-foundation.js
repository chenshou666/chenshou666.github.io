/* =====================================================================
 * HT Lab · 英语四级课程 · 模块 0：地基（8 关）
 * 面向基础薄弱的学习者：先把骨架搭起来，再进题型。
 * id 规则：模块 0 = 1xx，模块 1 = 2xx，以此类推（与 C 语言课程 1-20 不冲突）
 * type：quiz（客观题）| read（材料+题）| write | translate | speak | listen | mock
 * points：写作/翻译的必含要点，同组内任一命中即算命中
 * ===================================================================== */
window.CET4_MODULES = window.CET4_MODULES || [];
window.CET4_MODULES.push({
  id: "m0",
  name: "模块 0 · 地基",
  levels: [
    {
      id: 101,
      title: "四级是什么：把它学成「能用」的英语",
      minutes: 12,
      gist: "先搞清 710 分怎么分布，再规划一条从零补起的路线。",
      lesson: "四级（CET-4）总分 710 分。官方不设及格线，成绩采用常模参照；425 分是大家常用的参考线，也是报考六级与口语的常见门槛（以中国教育考试网 cet.neea.edu.cn 的说明为准，本站核对时间 2026-10）。它考四块：写作 15%、听力 35%、阅读 35%、翻译 15%，一共 125 分钟。听力 25 题只播一遍；阅读由选词填空、长篇匹配、仔细阅读组成；写作要求 120–180 词；翻译是把 140–160 个汉字的中文段落译成英文。\n为什么基础薄弱也来得及：四级要求约 4500 词，其中大部分是中学已经学过、只是换了用法和搭配的词，真正全新的不到 1500 个；而听力和阅读合起来占 70%，靠方法和熟练度就能明显提分，不像写作那样吃长期功底。\n更重要的是，四级的话题——校园、求职、交通、环保、科技、文化——和真实生活几乎完全重合。所以本课程每一关都会写清「这个能力能用在哪里」：练听力是为了听懂机场广播和会议，练写作是为了写邮件，练翻译是为了看懂说明书和公告。",
      usage: "把考试目标翻译成生活目标：能听懂广播、能开口问路、能写一封像样的英文邮件——四级只是顺手拿下的结果。",
      takeaways: [
        "710 分制，425 分为常见参考线；听力 + 阅读合计占 70%",
        "四级约 4500 词，大部分是高中词汇的延伸用法",
        "听力 25 题只播一遍，方法比词汇量更能快速提分",
        "四级话题与日常、校园、职场高度重合，学完就能用"
      ],
      type: "quiz",
      taskTitle: "入门检测",
      taskCopy: "四道题，确认你已经清楚这场考试的结构和目标。",
      passRatio: 0.75,
      questions: [
        {
          q: "四级总分和通过分数线分别是多少？",
          options: ["710 分，425 分是常见参考线", "750 分，500 分通过", "100 分，60 分通过", "990 分，600 分通过"],
          answer: 0,
          explain: "四级满分 710 分。官方不设及格线、成绩采用常模参照；425 分是常用参考线，也是报考六级与口语的常见门槛。以中国教育考试网 cet.neea.edu.cn 的说明为准（本站核对时间 2026-10）。"
        },
        {
          q: "四个板块里，合起来占比最高的是？",
          options: ["写作和翻译", "听力和阅读", "听力和写作", "阅读和翻译"],
          answer: 1,
          explain: "听力 35% + 阅读 35% = 70%。这两块是提分主战场，也是本课程投入最多的部分。"
        },
        {
          q: "关于四级的词汇量要求，下面哪种说法是对的？",
          options: ["要求 8000 词以上", "约 4500 词，且大部分是高中词汇的延伸", "只需掌握 1000 个核心词", "不考词汇，只考语法"],
          answer: 1,
          explain: "大纲约 4500 词，其中多数在高中已经见过，四级考的是新搭配、新词义和快速反应，所以复习比从零学起省力得多。"
        },
        {
          q: "四级的答题时间合计是多少？（写作 + 听力 + 阅读 + 翻译）",
          options: ["100 分钟", "110 分钟", "125 分钟", "150 分钟"],
          answer: 2,
          explain: "四部分答题时间合计 125 分钟：写作 30 分钟、听力约 25 分钟，剩下约 70 分钟给阅读和翻译。考务上整个考试时段约 140 分钟，多出来的是发卷、收答题卡等流程时间，不用自己记住。"
        }
      ]
    },
    {
      id: 102,
      title: "五大基本句型 + 三大时态",
      minutes: 18,
      gist: "先会认骨架、会造句子，再谈长难句。",
      lesson: "英语句子再长，骨架也只有五种：\n① 主 + 谓：The bus stopped.\n② 主 + 谓 + 宾：I like coffee.\n③ 主 + 系 + 表：She is happy.\n④ 主 + 谓 + 双宾：He gave me a book.\n⑤ 主 + 谓 + 宾 + 宾补：They made him captain.\n能认出骨架，你既能自己造句，也能拆开阅读里的长句。\n先掌握三个时态就足够开口：\n· 一般现在（习惯与事实）：I work here.\n· 一般过去（过去发生的事）：I worked there last year.\n· 现在完成（过去发生、影响到现在）：I have worked here for three years.\n最容易混淆的是后两个。判断关键是「这段时间有没有延续到现在」：I have worked here for three years.（现在还在）／ I worked in a bank for three years.（已经离开，用一般过去）。句中有明确过去时间（yesterday / last year / in 2020）就用一般过去；since、so far、already 通常配现在完成。",
      usage: "自我介绍、写邮件、描述经历几乎全靠这三个时态。说错了对方也能懂，但会显得不专业。",
      takeaways: [
        "五大句型：主谓 / 主谓宾 / 主系表 / 主谓双宾 / 主谓宾宾补",
        "一般现在讲习惯，一般过去讲过去，现在完成讲「到现在为止」",
        "判断时态看这段时间是否延续到现在；since / so far / already 通常配现在完成",
        "造句先定骨架，再往里加时间、地点、原因"
      ],
      type: "translate",
      taskTitle: "造句与翻译",
      taskCopy: "先做上面的选择题，再把两个中文句子译成英文；检查器会核对时态和关键表达。",
      audio: [
        {
          file: "102-1.mp3",
          label: "三种时态对比朗读",
          voice: "女声",
          hint: "听 work / worked / have worked 的区别",
          transcript: "I work in a small office every day.\nI worked in a bank two years ago.\nI have worked here for three years."
        }
      ],
      audioTip: "先听一遍，再跟着读一遍，感受「一般现在 / 一般过去 / 现在完成」在口中的差别。",
      passageLabel: "五种句型示例",
      passageTag: "对照讲解",
      passage: "① 主 + 谓：The bus stopped.\n② 主 + 谓 + 宾：I like coffee.\n③ 主 + 系 + 表：She is happy.\n④ 主 + 谓 + 双宾：He gave me a book.\n⑤ 主 + 谓 + 宾 + 宾补：They made him captain.\n\n对照练习：先说出每句属于哪种句型；前两句改写成「昨天发生」的版本（谓语改为过去式），后三句本身已是过去式，试着说出它们对应的「一般现在」版本。",
      passRatio: 0.75,
      questions: [
        {
          q: "“She is a doctor.” 属于哪种句型？",
          options: ["主 + 谓", "主 + 系 + 表", "主 + 谓 + 宾", "主 + 谓 + 双宾"],
          answer: 1,
          explain: "is 是系动词，a doctor 说明主语的身份，作表语，所以是「主 + 系 + 表」。"
        },
        {
          q: "“He gave me a book.” 属于哪种句型？",
          options: ["主 + 谓 + 宾", "主 + 系 + 表", "主 + 谓 + 宾 + 宾补", "主 + 谓 + 双宾"],
          answer: 3,
          explain: "me 是间接宾语（给谁），a book 是直接宾语（给什么），这是典型的双宾结构。"
        },
        {
          q: "I ______ in this company since 2021.",
          options: ["work", "worked", "have worked", "am working"],
          answer: 2,
          explain: "since 2021 表示「从 2021 年一直到现在」，必须用现在完成时 have worked。"
        },
        {
          q: "We ______ to the museum last Sunday.",
          options: ["have gone", "went", "go", "have been going"],
          answer: 1,
          explain: "last Sunday 是明确的过去时间，只能用一般过去时 went；这类「时态与时间状语是否匹配」是四级写作与翻译里最常见的失分点。"
        },
        {
          q: "下面哪一句是正确的？",
          options: ["I have seen him yesterday.", "I have saw him yesterday.", "I saw him yesterday.", "I see him yesterday."],
          answer: 2,
          explain: "有 yesterday 就不能用现在完成，且 have 后面必须接过去分词 seen 而不是 saw。"
        }
      ],
      prompt: "把下面两句译成英文：\n① 我在这家公司工作了三年。\n② 我昨天给他发了一封邮件。",
      placeholder: "I have ... / I sent ...",
      minWords: 12,
      points: [
        ["have worked", "have been working", "'ve worked"],
        ["for three years", "three years"],
        ["sent", "wrote"],
        ["yesterday"],
        ["email", "e-mail"]
      ],
      sample: "I have worked in this company for three years.\nI sent him an email yesterday."
    },
    {
      id: 103,
      title: "从句入门：定语、状语、名词性",
      minutes: 18,
      gist: "长句之所以长，多半是因为从句。学会把它们「括起来」。",
      lesson: "三大从句，先认识长相：\n① 定语从句——修饰名词，紧跟在名词后面：the book that I bought yesterday（我昨天买的那本书）。\n② 状语从句——交代时间、原因、条件：When it rains, I take the bus. / I stayed home because I was ill. / If you need help, call me.\n③ 名词性从句——整个句子当主语或宾语：What he said surprised me. / I don't know why he was late.\n读长句的诀窍：先找主句的谓语动词，再把从句用括号括起来，当「一个词」看。比如 I don't know (why he was late) —— 括号里整体就是 know 的宾语。句子一下就短了。",
      usage: "写邮件时用定语从句补充说明，用状语从句交代条件；口语里 If you need help, call me 这种句子每天都能用上。",
      takeaways: [
        "定语从句修饰名词，紧跟在名词后",
        "状语从句交代时间 / 原因 / 条件",
        "名词性从句整句充当主语或宾语",
        "拆长句第一步：找主句谓语，再把从句括起来"
      ],
      type: "translate",
      taskTitle: "从句识别 + 翻译",
      taskCopy: "先做选择题，再把两句中文译成英文。",
      audio: [
        {
          file: "103-1.mp3",
          label: "三类从句朗读",
          voice: "女声",
          hint: "注意从句在句中的位置",
          transcript: "The book that I bought yesterday is really useful.\nI don't know why he was late.\nWhat he said surprised everyone.\nIf you need help, call me."
        }
      ],
      passRatio: 0.75,
      questions: [
        {
          q: "The man who lives next door is a teacher. 其中修饰 the man 的从句是？",
          options: ["is a teacher", "The man", "who lives next door", "next door"],
          answer: 2,
          explain: "who lives next door 紧跟在 the man 后面，用来说明「哪个男人」，是定语从句。"
        },
        {
          q: "I stayed home ______ I was ill.",
          options: ["because", "so", "that", "which"],
          answer: 0,
          explain: "前后是因果关系（因为生病所以待在家），用 because 引导原因状语从句。"
        },
        {
          q: "______ he said surprised everyone.",
          options: ["What", "Which", "That", "Who"],
          answer: 0,
          explain: "这里需要一个既能作 said 的宾语、又能作整个句子主语的词，用 what（= the thing that）。这是名词性从句的典型考法。"
        },
        {
          q: "I don't know why he was late. 用「括号法」拆解，应该把哪部分括起来？",
          options: ["(why he was late)", "(I don't know)", "(why he)", "(was late)"],
          answer: 0,
          explain: "why he was late 整体是 know 的宾语（名词性从句），括起来当一个词看，主干就是 I don't know + 宾语。括号法的目的就是先把从句整体摘出去，露出主干。"
        }
      ],
      prompt: "把下面两句译成英文：\n① 我不知道他为什么迟到。\n② 如果你需要帮助，给我打电话。",
      placeholder: "I don't know ... / If you ...",
      minWords: 12,
      points: [
        ["don't know", "do not know"],
        ["why he was late", "why he is late", "why he had been late"],
        ["if you need help", "if you need any help", "if you need a hand"],
        ["call me", "give me a call", "phone me", "ring me"]
      ],
      sample: "I don't know why he was late.\nIf you need help, call me."
    },
    {
      id: 104,
      title: "高频词 300（一）：动词与固定搭配",
      minutes: 16,
      gist: "动词不单独背，要整块背。四级最爱考这些搭配。",
      lesson: "四级词汇题真正的考点不是「认不认识」，而是「搭不搭得上」。下面是最高频的一批，请整块记：\n· make a decision 做决定 / make progress 取得进步 / make an effort 努力\n· take a break 休息一下 / take part in 参加 / take care of 照顾\n· get in touch 联系 / get used to 习惯于 / get rid of 摆脱\n· have a look 看一看 / have trouble (in) doing 做……有困难\n· do research 做研究 / do sb a favour 帮某人一个忙\n· pay attention to 注意 / keep in touch 保持联系\n· come up with 想出 / look forward to 期待\n两个高频陷阱：look forward to 和 get used to 里的 to 都是介词，后面要接动名词（looking forward to hearing from you）；take part in 是参加活动，take place 是「发生」，主语通常是事件。",
      usage: "这些搭配在邮件和口语里天天出现：I'm looking forward to hearing from you. / Let's keep in touch. 直接抄进你的邮件模板就能用。",
      takeaways: [
        "背动词要背整块搭配，不背孤立单词",
        "look forward to / get used to 后面接动名词",
        "take part in 参加活动，take place 表示发生",
        "make / take / get / have / do 的辨析题，本质是搭配题"
      ],
      type: "quiz",
      taskTitle: "搭配速测",
      taskCopy: "五道题全部来自上面的搭配表，做完再看解析。",
      passRatio: 0.8,
      questions: [
        {
          q: "We need to ______ a decision before Friday.",
          options: ["do", "take", "make", "get"],
          answer: 2,
          explain: "固定搭配 make a decision（做决定），不能用 do。"
        },
        {
          q: "Please ______ care of my dog while I'm away.",
          options: ["make", "do", "have", "take"],
          answer: 3,
          explain: "take care of 是「照顾、照看」的固定搭配。"
        },
        {
          q: "I'm looking forward to ______ from you soon.",
          options: ["hear", "hearing", "heard", "be heard"],
          answer: 1,
          explain: "look forward to 中的 to 是介词，后面必须接动名词 hearing；写邮件时这句最常用，也最容易写错。"
        },
        {
          q: "More than 300 students ______ the volunteer programme last term and worked at the local library every weekend.",
          options: ["took part in", "took a break from", "took place in", "took after"],
          answer: 0,
          explain: "take part in 表示「参加（活动）」。后半句「每个周末都在图书馆服务」说明他们确实参加了，所以不是 took a break from（暂停参加）；take place 表示「发生」，主语通常是事件而不是人；took after 意思是「长得像（某人）」，与句意无关。"
        },
        {
          q: "He finally ______ up with a good idea.",
          options: ["came", "took", "made", "got"],
          answer: 0,
          explain: "come up with 是「想出（主意、办法）」，四级写作里可以直接用：We need to come up with a better plan."
        }
      ]
    },
    {
      id: 105,
      title: "高频词 300（二）：名词、形容词与副词",
      minutes: 16,
      gist: "阅读里的「题眼」多是这些词，尤其是 however 和 therefore。",
      lesson: "名词高频：issue 议题 / situation 情况 / benefit 好处 / measure 措施 / attitude 态度 / opportunity 机会 / pressure 压力 / progress 进步。\n形容词高频：available 可获得的 / likely 可能的 / aware 意识到的 / similar 相似的 / effective 有效的 / willing 愿意的 / responsible 负责的。\n副词与连接词：however 然而 / therefore 因此 / otherwise 否则 / instead 反而、代替 / actually 实际上 / especially 尤其。\n固定用法要连介词一起记：be aware of、be responsible for、be willing to do、be likely to do、be similar to。\n为什么这些词重要：阅读题的答案常常就藏在转折和因果词后面——however 之后往往是作者真正的观点，therefore 前面是原因、后面是结论。看到它们，笔就要停一下。",
      usage: "写作文时用 however 转折、therefore 总结、be willing to 表达态度，比反复用 but 和 so 显得成熟得多。",
      takeaways: [
        "名词、形容词要连介词一起记（aware of / responsible for）",
        "however 后面常是作者真正的观点",
        "therefore 前因后果，是阅读定位的好抓手",
        "写作里用 however / therefore 替代 but / so"
      ],
      type: "quiz",
      taskTitle: "词义与用法速测",
      taskCopy: "五道题，考查搭配与语境，不是单纯背词义。",
      passRatio: 0.8,
      questions: [
        {
          q: "Tickets are still ______ at the box office.",
          options: ["aware", "willing", "similar", "available"],
          answer: 3,
          explain: "available 表示「可以买到、可以获得的」，是四级阅读里出现频率极高的形容词。"
        },
        {
          q: "She is responsible ______ the whole team.",
          options: ["of", "to", "for", "with"],
          answer: 2,
          explain: "be responsible for 是固定搭配，表示「对……负责」。"
        },
        {
          q: "The weather was terrible; ______, we decided to stay at home.",
          options: ["however", "therefore", "instead", "otherwise"],
          answer: 1,
          explain: "前面是原因、后面是结果，用 therefore（因此）。however 表示转折，otherwise 表示「否则」。"
        },
        {
          q: "哪个词表示「意识到的」？",
          options: ["available", "aware", "effective", "likely"],
          answer: 1,
          explain: "aware 表示「意识到的」，常用搭配是 be aware of / be aware that…。"
        },
        {
          q: "I'm not ______ to lend him money again.",
          options: ["willing", "aware", "similar", "effective"],
          answer: 0,
          explain: "be willing to do 表示「愿意做某事」，这里是否定形式：不愿意再借钱给他。"
        }
      ]
    },
    {
      id: 106,
      title: "词根词缀猜词：生词也能读下去",
      minutes: 15,
      gist: "阅读最怕停下来查词。学会拆词，先猜大意再验证。",
      lesson: "高频词根（记住它们，等于一次记住一串词）：\n· spect 看：inspect 检查、respect 尊重\n· port 搬运：transport 运输、export 出口\n· dict 说：predict 预测、dictate 口述\n· struct 建造：construct 建造、structure 结构\n· vis / vid 看：visible 可见的、video 视频\n· form 形状：reform 改革、uniform 制服\n· ject 扔：project 项目/投射、reject 拒绝\n· cred 相信：credit 信用、incredible 难以置信的\n常用前缀：re- 再/回、pre- 预先、sub- 下面、inter- 之间、un- / in- / im- 表否定。\n常用后缀：-tion 名词、-ment 名词、-able / -ible 可……的、-less 无……的、-ly 副词。\n实战顺序：先拆词根词缀猜大意 → 再放回句子看是否通顺 → 最后才决定要不要查。保持阅读节奏比查清每个词更重要。",
      usage: "看英文说明书、产品页面、技术文档时，靠词根词缀就能猜出大概意思，不必每个词都查。",
      takeaways: [
        "词根决定核心意思，前后缀改变方向和词性",
        "-less 是「无」，-able / -ible 是「可……的」",
        "un- / in- / im- 都是否定前缀",
        "先猜后验证，别为生词打断阅读节奏"
      ],
      type: "quiz",
      taskTitle: "拆词练习",
      taskCopy: "五道题，全部可以靠词根词缀推出来。",
      passRatio: 0.8,
      questions: [
        {
          q: "predict 中的词根 dict 表示什么？",
          options: ["看", "建造", "说", "扔"],
          answer: 2,
          explain: "dict = 说。pre-（预先）+ dict（说）= 预先说出来，也就是「预测」。"
        },
        {
          q: "invisible 的意思最接近？",
          options: ["看不见的", "听不见的", "不可信的", "不能运输的"],
          answer: 0,
          explain: "in-（否定）+ vis（看）+ -ible（可……的）= 看不见的。"
        },
        {
          q: "transport 中的 port 表示什么？",
          options: ["港口", "搬运", "说", "形状"],
          answer: 1,
          explain: "port 作词根是「搬运、运送」（trans- 表示「跨越」）。它单独作单词时才是「港口」，这正是词根与单词意思不同的典型例子。"
        },
        {
          q: "reject 最可能的意思是？",
          options: ["再次接受", "建造", "预测", "拒绝"],
          answer: 3,
          explain: "re-（回）+ ject（扔）= 扔回去，也就是「拒绝」。"
        },
        {
          q: "后缀 -less 表示什么？",
          options: ["充满……的", "无……的", "可……的", "使……"],
          answer: 1,
          explain: "-less 表示「没有」：hopeless 没希望的、careless 粗心的、endless 无尽的。"
        }
      ]
    },
    {
      id: 107,
      title: "长难句三步法：主干先读懂",
      minutes: 20,
      gist: "一句话看懂四五十词的长句，靠的是固定三步，不是天赋。",
      lesson: "三步拆句：\n① 数谓语：一句话里有几个谓语动词，就有几个分句。先排除非谓语形式（to do / doing / done 都不算谓语），剩下的才是分句数。\n② 括从句：遇到 that / which / who / when / if / because 这类连词或关系词，把后面的从句用括号括起来，整体当成「一个词」。\n③ 抓主干：把括号里的内容全部拿掉，剩下的就是主干（主语 + 谓语 + 宾语或表语）。先读懂主干，再回头补修饰。\n为什么有用：主干决定「这句话在说什么」，修饰决定「细节是什么」，而四级题目偏偏爱考细节。先主干后细节，做题时你不会被长句吓住。",
      usage: "读英文新闻、论文摘要、合同条款时同样适用：先抓主干，再决定哪句需要细看。",
      takeaways: [
        "谓语数量 = 分句数量",
        "把从句括起来，当成一个词看",
        "先去修饰抓主干，再回头看细节",
        "题目多考细节，而细节一定挂在主干上"
      ],
      type: "read",
      taskTitle: "长难句实战",
      taskCopy: "先自己读一遍下面的长句（也可以点音频听一遍），再答题。",
      passageTag: "精读长句",
      passage: "The researchers, who had been studying the effects of sleep on memory for more than ten years, found that students who slept for at least seven hours before an exam performed significantly better than those who stayed up late, although the difference became smaller when the test was taken in the afternoon.",
      audio: [
        {
          file: "107-1.mp3",
          label: "长句朗读",
          voice: "女声",
          hint: "听的时候先抓 The researchers … found that …",
          transcript: "The researchers, who had been studying the effects of sleep on memory for more than ten years, found that students who slept for at least seven hours before an exam performed significantly better than those who stayed up late, although the difference became smaller when the test was taken in the afternoon."
        }
      ],
      passRatio: 0.8,
      questions: [
        {
          q: "这个长句的主干是？",
          options: ["The researchers had been studying…", "students performed better", "the difference became smaller", "The researchers found that…"],
          answer: 3,
          explain: "把 who 从句、that 从句、although 从句都括起来后，剩下的主干就是 The researchers found that…。"
        },
        {
          q: "who had been studying the effects of sleep on memory 这部分修饰的是？",
          options: ["students", "The researchers", "memory", "an exam"],
          answer: 1,
          explain: "它紧跟在 The researchers 后面，说明是哪一批研究者，属于非限制性定语从句。"
        },
        {
          q: "研究的主要发现是什么？",
          options: ["睡眠与考试成绩没有关系", "考前睡够七小时的学生成绩明显更好", "下午考试的学生成绩更好", "熬夜的学生记忆力更强"],
          answer: 1,
          explain: "原文 performed significantly better 指的就是「睡够至少七小时」的学生，比熬夜的学生明显更好。"
        },
        {
          q: "although 引出的内容说明了什么？",
          options: ["研究结论被推翻了", "下午考试时这种差距会变小", "学生不应该午睡", "研究人员不同意这个结论"],
          answer: 1,
          explain: "although 表示让步：即便如此，当考试安排在下午时，差距会变小。这是典型的「让步+条件」附加信息，考试常在这里出细节题。"
        },
        {
          q: "按照三步法，第一步应该做什么？",
          options: ["先查每个生词", "先找出所有谓语动词", "先把整句翻译成中文", "先看标点符号"],
          answer: 1,
          explain: "先数谓语动词，才知道这句话有几个分句、主干在哪里。"
        }
      ]
    },
    {
      id: 108,
      title: "日常高频句型 40 句：开口就能用",
      minutes: 20,
      gist: "8 类场景共 40 句万能句型，背下来日常、校园、职场都能开口。",
      lesson: "八类场景，每类 5 句，共 40 句。先跟读示范音频，再自己说一遍：\n① 寒暄：How's it going? / Long time no see. / What have you been up to? / How was your weekend? / Nice to meet you.\n② 请求：Could you do me a favour? / Would you mind closing the window? / I was wondering if you could help me. / Could you give me a hand? / Do you have a minute?\n③ 致谢与回应：Thanks a lot. / I really appreciate it. / You're welcome. / No worries. / My pleasure.\n④ 道歉：Sorry, my mistake. / I do apologize for the delay. / It won't happen again. / Sorry to keep you waiting. / Excuse me for interrupting.\n⑤ 建议：Why don't we…? / How about…? / You'd better… / It might be a good idea to… / Shall we…?\n⑥ 表达观点：As far as I'm concerned… / I'd say… / That's a good point, but… / In my opinion… / I'm afraid I disagree.\n⑦ 没听懂时的救命句：Sorry, could you say that again? / Could you speak a little slower? / Do you mean…? / Sorry, I didn't catch that. / Could you spell that for me?\n⑧ 结束对话：Anyway, I'd better get going. / Let's keep in touch. / It was nice talking to you. / See you around. / Take care.\n第 ⑦ 类最值得先背：听不懂时不要沉默或硬撑，用这几句把对话拉回来，比装作听懂得体得多。",
      usage: "这 40 句覆盖日常、校园、职场绝大多数开口场景；尤其在外企会议、留学课堂、出国旅行时，第 ⑦ 类是真正救场的话。",
      takeaways: [
        "八类场景各 5 句，覆盖大部分日常开口需求",
        "请求用 Could you / Would you mind / I was wondering if…",
        "没听懂时用 Could you say that again? 把对话拉回来",
        "结束对话用 Anyway, I'd better get going."
      ],
      type: "speak",
      taskTitle: "跟读与自评",
      taskCopy: "先听示范，再跟着读；录一段自己的声音回放对比，最后勾完自评清单。",
      prompt: "跟着示范音频逐句跟读，重点练第 ⑦ 类「没听懂时」的三句；读完录一段自己的声音，回放对比示范音。",
      model: {
        file: "108-1.mp3",
        voice: "女声",
        text: "How's it going?\nLong time no see.\nCould you do me a favour?\nI was wondering if you could help me.\nThanks a lot. I really appreciate it.\nSorry, my mistake.\nIt might be a good idea to take a break.\nAs far as I'm concerned, the plan works.\nSorry, could you say that again?\nAnyway, I'd better get going."
      },
      checklist: [
        "我跟着示范音频读了一遍（示范里每类抽了 1–2 句）",
        "我把 8 类共 40 句都念过一遍",
        "我能不看文本说出至少 5 句",
        "我把「没听懂时」的三句背下来了",
        "我录了音并回放对比过自己的发音"
      ],
      passRatio: 0.8,
      questions: [
        {
          q: "没听清对方说什么，最得体的说法是？",
          options: ["What?", "Sorry, could you say that again?", "I don't understand anything.", "Speak clearly, please."],
          answer: 1,
          explain: "Could you say that again? 既礼貌又明确；What? 太生硬，Speak clearly, please. 带有指责意味。"
        },
        {
          q: "想请对方帮忙，最礼貌的开头是？",
          options: ["I was wondering if you could help me.", "Help me.", "You must help me.", "Give me a hand now."],
          answer: 0,
          explain: "I was wondering if… 是英语里最常用的委婉请求句式，职场邮件里也常用。"
        },
        {
          q: "“Long time no see.” 用在什么场合？",
          options: ["道歉", "寒暄", "道谢", "告别"],
          answer: 1,
          explain: "这是见面时的寒暄语，表示「好久不见」。"
        },
        {
          q: "结束一段对话，可以说？",
          options: ["Anyway, I'd better get going.", "What have you been up to?", "Would you mind…?", "I do apologize."],
          answer: 0,
          explain: "Anyway, I'd better get going. 是自然的收尾说法；What have you been up to? 是寒暄提问，不是告别。"
        },
        {
          q: "别人向你道谢，最自然的回应是？",
          options: ["No worries.", "Never mind.", "It doesn't matter.", "You'd better not."],
          answer: 0,
          explain: "回应感谢用 No worries. / You're welcome. / My pleasure.。Never mind 和 It doesn't matter. 都是「没关系」，但用于回应道歉、安慰对方或表示「这不重要」，不用于回应感谢——这是中英习惯的常见差异。"
        }
      ]
    }
  ]
});