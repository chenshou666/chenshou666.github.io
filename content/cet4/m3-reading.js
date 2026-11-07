/* =====================================================================
 * HT Lab · 英语四级课程 · 模块 3：阅读（14 关，id 401–414）
 * 关卡数据文件（每个模块一个文件，互不干扰）
 * 字段说明：
 *   id            关卡号（模块 3 = 401–414）
 *   type          read（材料 + 题）| quiz | listen | write | translate | speak | mock
 *   passage       自编英文材料（150–350 词）；passageLabel / passageTag 为页面标签
 *   questions     [{q,options,answer,explain}]   answer 为正确选项下标（从 0 起）
 *   passRatio     客观题通关线（0.75 = 答对 75%）
 *   audio         [{file,label,voice,hint,transcript}]  音频放 ./audio/cet4/
 *   timeLimit     倒计时（分钟），页面会显示
 * 约定：材料全部自编，不取自历年真题；英文拼写统一用英式。
 * ===================================================================== */
window.CET4_MODULES = window.CET4_MODULES || [];
window.CET4_MODULES.push({
  id: "m3",
  name: "模块 3 · 阅读",
  levels: [
    {
      id: 401,
      title: "阅读题型与时间分配",
      minutes: 12,
      gist: "阅读占 35%、共 40 分钟，但三部分的分量差四倍——先把时间分对，再谈技巧。",
      lesson: "四级阅读占 35%（248.5 分），和听力并列最高。阅读和翻译合起来有 70 分钟，其中阅读一般给自己 40 分钟，翻译留 30 分钟。阅读由三部分组成，但三部分的分量完全不同：\n① 选词填空（Section A）：一篇 200 词左右的短文挖 10 个空，从 15 个备选词里选 10 个填进去。10 题，占 5%，每题 3.55 分，是性价比最低的一块。\n② 长篇阅读匹配（Section B）：一篇约 1000 词的长文，分成 A–O 共 15 段；后面 10 个句子，每句对应一个段落。10 题，占 10%，每题 7.1 分。\n③ 仔细阅读（Section C）：2 篇，每篇 300–400 词，各带 5 道选择题。10 题，占 20%，每题 14.2 分——一道仔细阅读等于四道选词填空。\n时间怎么分：8 分钟给选词填空，12 分钟给长篇匹配，20 分钟给仔细阅读（每篇 8–10 分钟）。也可以把顺序换成「仔细阅读 → 长篇匹配 → 选词填空」，先把最值钱的分拿到手；关键是在开考前就定好顺序，不要做到一半随意换。\n不会做时的止损原则：四级答错不倒扣分，所以任何一题都不要空着；长篇匹配来不及，就抓人名、数字、大写词快速定位，不要逐段精读；选词填空放到最后做，按词性猜一个也比留空强。",
      usage: "读英文说明书、报告或长文时，先判断「哪一部分值得花时间」，用的是同一套本事。",
      takeaways: [
        "阅读占 35%（248.5 分），一般给自己 40 分钟",
        "三部分分值：选词填空 5%、长篇匹配 10%、仔细阅读 20%",
        "仔细阅读每题 14.2 分，是选词填空（3.55 分）的四倍",
        "时间分配 8 / 12 / 20 分钟，顺序要在开考前定好",
        "答错不倒扣分，任何一题都不要空着"
      ],
      type: "read",
      taskTitle: "题型与时间实测",
      taskCopy: "先读这篇备考指南，再回答 6 道题；做完对照解析，把三部分的分值和时间分配记牢。答对 5 题（75%）即可通关。",
      passageLabel: "阅读材料",
      passageTag: "备考指南",
      passage: "A Guide to the Reading Paper\n\nReading makes up 35% of your CET-4 score, the same share as listening, and you have forty minutes to finish it. The paper has three sections, and they are not worth the same.\n\nSection A, word selection, gives you a short text of about 200 words with ten blanks. Fifteen words are listed, and you choose ten of them. It carries 5% of the total, so each blank is worth only 3.55 points.\n\nSection B, long matching, is a text of about 1,000 words divided into fifteen paragraphs, marked A to O. Ten statements follow, and you match each statement to the paragraph that contains the information. It carries 10%, or 7.1 points per statement.\n\nSection C, careful reading, has two passages of about 300 to 400 words, with five questions on each. It carries 20%, which is 14.2 points per question — four times the value of a blank in Section A.\n\nA sensible plan is eight minutes for Section A, twelve for Section B and twenty for Section C. Many teachers advise starting with Section C, because its questions are worth the most and the answers are easy to find once the passage has been read carefully. Whichever order you choose, decide it before the test begins.\n\nIf you run short of time, remember two things: never leave a question unanswered, because there is no penalty for a wrong answer; and when you are guessing in Section B, look for names, numbers and capital letters first, as they are the quickest way back to the right paragraph.",
      passRatio: 0.75,
      questions: [
        {
          q: "Which section of the reading paper carries the largest share of the total score?",
          options: ["Section A", "Section B", "Section C", "They all carry the same share"],
          answer: 2,
          explain: "原文写得清楚：Section C, careful reading … It carries 20%，而 Section A 是 5%、Section B 是 10%。三部分加起来正好 35%（阅读总分 248.5 分）。这道题只需区分三个百分数。"
        },
        {
          q: "How many words are offered for the ten blanks in Section A?",
          options: ["Fifteen", "Ten", "Twenty", "Five"],
          answer: 0,
          explain: "原文：Fifteen words are listed, and you choose ten of them.（列出 15 个词，选 10 个。）题目问「提供了多少个词」，所以是 15，不是 10——把题干的 how many words are offered 读成「要用几个词」就会掉进陷阱。"
        },
        {
          q: "Why do many teachers advise students to start with Section C?",
          options: [
            "Because it is printed first in the paper",
            "Because it has the shortest passage",
            "Because it needs no careful reading",
            "Because its questions are worth the most points"
          ],
          answer: 3,
          explain: "原文：Many teachers advise starting with Section C, because its questions are worth the most. 理由就是分值最高（每题 14.2 分）。试卷顺序其实是 A→B→C，所以「最先印」是错的；Section C 恰恰最需要仔细读，最后一项也是无中生有。"
        },
        {
          q: "What does the guide advise if you run short of time?",
          options: [
            "Leave the hardest questions blank.",
            "Never leave a question unanswered.",
            "Start again from Section A.",
            "Read Section B more slowly."
          ],
          answer: 1,
          explain: "原文：never leave a question unanswered, because there is no penalty for a wrong answer（答错不倒扣分，所以绝不要留空）。留空、回头重做、慢慢读长篇，都只会浪费时间。"
        },
        {
          q: "When you are guessing in Section B, what should you look for first?",
          options: [
            "The longest paragraph",
            "Words that also appear in Section A",
            "Names, numbers and capital letters",
            "The first sentence of every paragraph"
          ],
          answer: 2,
          explain: "原文最后一句：look for names, numbers and capital letters first, as they are the quickest way back to the right paragraph。理由是人名、数字、大写词最容易被眼睛扫到、也最不容易被改写。逐段读首句是「读懂」的做法，不是猜题时最快的做法。"
        },
        {
          q: "How much time does the guide suggest for Section B?",
          options: ["Twelve minutes", "Eight minutes", "Twenty minutes", "Forty minutes"],
          answer: 0,
          explain: "原文：eight minutes for Section A, twelve for Section B and twenty for Section C。注意三个数字要和三个部分对上：8 分钟是 A，20 分钟是 C，40 分钟是阅读总时间。"
        }
      ]
    },
    {
      id: 402,
      title: "选词填空（一）：先判词性再看语境",
      minutes: 15,
      gist: "每个空需要的词性是固定的——把词性对上，10 个空能先拿下六七个。",
      lesson: "选词填空（Section A）看着最难，其实最讲套路：15 个备选词里，名词、动词、形容词、副词各有几个，而每个空需要的词性几乎是确定的。\n① 先判词性，再看词义：看空格缺什么。以 -tion / -ment / -ness / -ity 结尾的多是名词；以 -ly 结尾的多是副词；以 -able / -ful / -ive / -ous 结尾的多是形容词。\n② 记牢四个语法位置：冠词（a / the）、形容词、介词后面，多半是名词；情态动词（can / will / must）、助动词、不定式 to 后面，是动词原形；系动词（be / seem / become）后面、名词前面，是形容词；修饰动词或形容词、或单独放句首作状语的，是副词。\n③ 最后才看语境：同一词性里可能有两三个词都「像」，这时才用上下文（褒贬、搭配、单复数、时态）排除。\n两个容易丢分的细节：词库里给的是原形，填进句子后要注意主谓一致和时态；名词要注意单复数（前面有 two hundred 这类词时通常用复数）。\n做题顺序：先做词性最明确、语境最清楚的空，用掉的词划掉，难空留到最后用排除法。真题里常有 2–3 个空是「送分」，别在难空上卡住整段时间。",
      usage: "填英文表格、改简历、写邮件时判断「这里该放名词还是动词」，靠的就是同一套语法位置感。",
      takeaways: [
        "先判词性，再看词义，最后才用语境排除",
        "冠词 / 形容词 / 介词后面是名词；to、情态动词后面是动词原形",
        "系动词后、名词前是形容词；修饰动词的是副词",
        "填回去以后注意单复数、主谓一致和时态"
      ],
      type: "read",
      taskTitle: "判词性填空",
      taskCopy: "短文里有 5 个空，每题给出 4 个词，选出最合适的一个。真实考试的 Section A 是从 15 个词里选 10 个，本关先把「判词性」这一步练熟。答对 4 题（75%）即可通关。",
      passageLabel: "选词填空短文",
      passageTag: "含 5 个空",
      passage: "The university has announced plans to ① ______ a new study centre beside the main library. The building will ② ______ about two hundred desks, a quiet reading room and four small rooms for group discussion. A survey last year found that the library was always full before examinations, and the vice-chancellor calls the project a ③ ______ response to that problem.\n\nThe centre will not be a silent place: students may talk in the group rooms, although they must keep their voices ④ ______. Staff will manage the booking system online, so that nobody has to queue at the door.\n\nThe work is expected to take fourteen months. During that period the car park behind the library will close, and students who drive to campus will be asked to park at the sports centre instead. The university says that the new building will ⑤ ______ the pressure on the library rather than replace it, and that the reading room will stay open until midnight during the exam weeks.",
      passRatio: 0.75,
      questions: [
        {
          q: "Blank ① — 'The university has announced plans to ______ a new study centre beside the main library.' Which word fits best?",
          options: ["building", "build", "helpful", "decision"],
          answer: 1,
          explain: "decided / plans to do sth 里的 to 是不定式符号，后面必须接动词原形，所以选 build。building 是名词兼动名词，helpful 是形容词，decision 是名词，都不能跟在不定式 to 后面——这一步只靠词性就能定，不需要读懂整句。"
        },
        {
          q: "Blank ② — 'The building will ______ about two hundred desks, a quiet reading room and four small rooms for group discussion.' Which word fits best?",
          options: ["contain", "contained", "capacity", "spacious"],
          answer: 0,
          explain: "will 是情态动词，后面接动词原形 contain（容纳）。contained 是过去分词，capacity 是名词，spacious 是形容词，都不能作 will 后面的谓语。看到 will / can / must，先在选项里找「原形动词」，这是最快的排除法。"
        },
        {
          q: "Blank ③ — 'the vice-chancellor calls the project a ______ response to that problem.' Which word fits best?",
          options: ["directly", "direction", "director", "direct"],
          answer: 3,
          explain: "a ______ response 里，冠词 a 和名词 response 之间只能放形容词，所以选 direct。directly 是副词，direction 和 director 是名词，都填不进这个位置。注意 direct 本身还能作动词（direct a film）和副词（fly direct），做题时看的是它在句中的位置，而不是它「平时是什么意思」。"
        },
        {
          q: "Blank ④ — 'students may talk in the group rooms, although they must keep their voices ______.' Which word fits best?",
          options: ["low", "softly", "silence", "loud"],
          answer: 0,
          explain: "keep + 宾语 + 形容词（keep their voices low）是固定结构，low 在这里作宾语补足语。softly 是副词，不能作宾补；silence 是名词，前面要加 in 才行；loud 虽然也是形容词，但和 although 的让步关系冲突——既然允许学生说话，就不可能是「把声音放大」，这一步靠语境排除。"
        },
        {
          q: "Blank ⑤ — 'the new building will ______ the pressure on the library rather than replace it.' Which word fits best?",
          options: ["reduction", "less", "reduce", "fewer"],
          answer: 2,
          explain: "will 后面需要动词原形，reduce the pressure（减轻压力）搭配也通顺。reduction 是名词，less 和 fewer 是限定词（fewer 只能修饰可数名词复数），都不能作谓语。这道题的四个选项是同根词，考的就是「位置决定词性」，不是词义辨析。"
        }
      ]
    },
    {
      id: 403,
      title: "选词填空（二）：固定搭配与语法位置",
      minutes: 15,
      gist: "四个选项词性相同时，胜负手就是搭配和语法位置：介词后接动名词，搭配要连介词一起背。",
      lesson: "上一关靠词性就能排掉大部分选项；这一关的空，四个选项往往是同一个词性，只能靠搭配和语法位置来分。\n① 固定搭配（最高频的失分点）：make a decision、take part in、play a part in、in charge of、be aware of、depend on、keen on doing、look forward to doing、have an effect on、be responsible for。看到空格前后有介词，先想搭配，不要先想词义。\n② 语法位置：介词后面接动名词（keen on working，不是 keen on work）；形容词后面接不定式（easy to use）；情态动词和 to 后面接动词原形；主语是第三人称单数时，谓语要加 -s。\n③ 时态信号词：by the time / before + 过去的动作，主句常用过去完成（had done）；since / so far / already 常用现在完成；主句是过去时，宾语从句一般也退到过去。\n④ 填完必读一遍：把选好的词填回原句默读，语法和意思是否都通顺，很多错误一读就露出来了。\n搭配题的本质是「这个动词或形容词长期和哪个介词一起出现」，所以背单词时请把介词一起背进去。",
      usage: "写英文邮件时，apply for、in charge of、have an effect on 这些搭配用对了，对方才会觉得你的英语是「顺」的。",
      takeaways: [
        "搭配要连介词一起背：take part in / in charge of / keen on doing",
        "介词后面必须接动名词",
        "比例 1:1 记忆：play a part in 有冠词，take part in 没有",
        "by the time + 过去动作，主句用过去完成"
      ],
      type: "read",
      taskTitle: "搭配与语法填空",
      taskCopy: "短文里有 5 个空，每题 4 个选项词性相同，靠搭配和语法位置来定。答对 4 题（75%）即可通关。",
      passageLabel: "选词填空短文",
      passageTag: "含 5 个空",
      passage: "Last September, our department was asked to ① ______ part in a city-wide reading programme. Nobody in the team had organised an event of this size before, so the manager put one of the younger staff ② ______ charge of the schedule.\n\nThe first week was difficult. By the time permission to use the town hall arrived, we ③ ______ already lost ten days, and the posters had not been printed.\n\nWhat saved us was the volunteers. Most of them were students who were keen ④ ______ working with children, and several had experience of running reading clubs at school. They took over the afternoon sessions, which freed the rest of us to deal with the paperwork.\n\nThe programme ended in December, and the manager says it had a real ⑤ ______ on the way the department works with local schools. Only thirty people came to the first session; by the final week, we were turning families away, and she wants to run the programme again next year.",
      passRatio: 0.75,
      questions: [
        {
          q: "Blank ① — 'our department was asked to ______ part in a city-wide reading programme.' Which word fits best?",
          options: ["make", "take", "get", "play"],
          answer: 1,
          explain: "take part in 是「参加（活动）」的固定搭配，中间没有冠词。play 的搭配是 play a part in，必须有冠词 a，句子里的 ______ part in 没有 a，所以 play 不成立；make part in、get part in 都不是英语搭配。这个空只靠搭配就能定，不需要整句翻译。"
        },
        {
          q: "Blank ② — 'the manager put one of the younger staff ______ charge of the schedule.' Which word fits best?",
          options: ["on", "at", "for", "in"],
          answer: 3,
          explain: "in charge of 是「负责、主管」的固定搭配：put sb in charge of sth。on charge of、at charge of、for charge of 都不存在。答题时先在脑子里过一遍「charge 能和哪个介词连用」，比逐个代入更快。"
        },
        {
          q: "Blank ③ — 'By the time permission to use the town hall arrived, we ______ already lost ten days.' Which word fits best?",
          options: ["had", "have", "has", "having"],
          answer: 0,
          explain: "By the time + 过去的动作（arrived）表示「到那时为止已经……」，主句要用过去完成 had lost。have / has 是现在完成，和 arrived 的过去时间不匹配；having 是非谓语形式，不能单独作谓语。时态题先找时间状语，再定形式。"
        },
        {
          q: "Blank ④ — 'Most of them were students who were keen ______ working with children.' Which word fits best?",
          options: ["to", "for", "on", "with"],
          answer: 2,
          explain: "keen on doing sth 里的 on 是介词，后面接动名词 working，所以选 on。这里有个经典陷阱：keen to do sth 本身也是对的，但那需要接动词原形 work，而句中给的是 working，因此 to 反而不能选。for、with 都不能和 keen 搭配。"
        },
        {
          q: "Blank ⑤ — 'the manager says it had a real ______ on the way the department works with local schools.' Which word fits best?",
          options: ["affect", "effect", "effort", "effective"],
          answer: 1,
          explain: "have an effect on sth 是「对……有影响」的固定搭配，effect 是名词，能放在冠词 a 和形容词 real 后面。affect 是动词（读音重音也不同），不能跟在 a real 后面；effort 意思是「努力」，和 on 搭配不通；effective 是形容词，不能被冠词 a 直接修饰。effect / affect 只差一个字母，是四级最高频的一对形近词。"
        }
      ]
    },
    {
      id: 404,
      title: "长篇阅读匹配（一）：关键词定位",
      minutes: 18,
      gist: "长篇匹配考的不是读懂，而是找到：先读题干圈关键词，再回原文扫读定位。",
      lesson: "长篇匹配（Section B）考的不是读懂，而是「找到」。10 个句子各对应一个段落，段落用 A 到 O 标好，你要做的是拿着句子去文章里找位置。\n① 先读题干，不读文章：通读一篇 1000 词的长文要七八分钟，而读完 10 个句子只要两分钟。读题干时圈 2–3 个关键词，优先圈不会被改写的词——人名、地名、机构名、数字、年份、百分比，以及专业名词。\n② 回原文扫读（scanning）：眼睛只找关键词的形状，不要逐句翻译。找到那一段后，再把整句读一遍确认意思真的对得上——同一段里出现同一个词、但讲的是另一件事，是这类题最常见的陷阱。\n③ 顺序不固定，先易后难：先把有数字、有专名的题做掉，会很顺。多数情况下一个段落只对应一个句子，做完可以做个记号缩小范围；但官方指令写明 You may choose a paragraph more than once（同一段可以被选多次），所以做过记号的段落不要彻底排除。\n④ 别用做仔细阅读的方式做长篇匹配：仔细阅读要读懂，长篇匹配要快找。用逐句翻译的方式做匹配题，一定做不完。",
      usage: "在英文报告、合同、产品手册里快速找到某一项条款或参数，用的就是同一套扫读定位能力。",
      takeaways: [
        "先读题干圈关键词（数字、专名、术语），再回原文扫读",
        "找到后要核对整句意思，别被同一个词骗了",
        "先做有数字和专名的题，做完一段做个记号（同一段可能被选两次）",
        "长篇匹配要「快找」，不要逐句翻译"
      ],
      type: "read",
      taskTitle: "段落信息匹配",
      taskCopy: "下面这篇材料分成 A–E 段。读 5 个句子，判断每句的信息出自哪一段。答对 4 题（75%）即可通关。",
      passageLabel: "长篇阅读材料",
      passageTag: "段落 A–E",
      passage: "A. Fairford is a small town on the River Ash. Until three years ago, its riverbank was one of the worst places in the region for plastic waste: volunteers once filled more than two hundred bags with bottles, wrappers and plastic in a single morning. Most of that rubbish, the council found, came from shops in the town centre, which handed out plastic bags free of charge with every purchase.\n\nB. In March 2023 the council passed a rule that no shop in the town may give away a plastic bag. Customers who want a bag must pay five pence for a paper one, and the money goes into a fund for cleaning the river. Shops that break the rule are fined fifty pounds. The council admits that the rule is unusual for a town of this size, but says it had no choice after two years of failed campaigns.\n\nC. The change was not as painful as shopkeepers had feared. The baker on Market Street said that most of her customers now bring their own bags, and that she spends less on packaging than she did before. Two hardware shops complained that paper bags are three times as expensive as plastic ones, but both agreed that customers had stopped arguing about the five pence after the first month.\n\nD. The results have been easy to measure. In the first year, the amount of plastic in the town's bins fell by 40%, and the river fund collected more than twelve thousand pounds, which paid for three new clean-up boats. The council's environment officer says the riverbank is now clean enough for the primary school to use it for science lessons.\n\nE. Not everyone is satisfied. The owner of a small grocery said the rule had cost him about two hundred pounds a year in extra packaging, and that the council had offered him no help at all. The council has promised to look at the problem, but it has also announced that from next spring the rule will cover plastic forks, cups and straws as well.",
      passRatio: 0.75,
      questions: [
        {
          q: "In which paragraph does a shopkeeper say that customers now bring their own bags?",
          options: ["Paragraph A", "Paragraph B", "Paragraph C", "Paragraph D", "Paragraph E"],
          answer: 2,
          explain: "C 段：The baker on Market Street said that most of her customers now bring their own bags。抓 shopkeeper（店主）和 bring their own bags 两个关键词就能定位。A 段提到商店发塑料袋，B 段讲规定，都不是「顾客自带袋子」这件事——关键词相同、事情不同，是这类题最典型的陷阱。"
        },
        {
          q: "In which paragraph is a complaint about receiving no help from the council reported?",
          options: ["Paragraph A", "Paragraph B", "Paragraph C", "Paragraph D", "Paragraph E"],
          answer: 4,
          explain: "E 段：The owner of a small grocery said … the council had offered him no help at all。C 段虽然也有店主抱怨（纸袋贵三倍），但没有提到「没有得到帮助」，所以不能选 C。匹配题的关键是核对整句意思，而不是看到 shopkeeper / complained 就下笔。"
        },
        {
          q: "In which paragraph do we learn how much rubbish volunteers collected in a single morning?",
          options: ["Paragraph A", "Paragraph B", "Paragraph C", "Paragraph D", "Paragraph E"],
          answer: 0,
          explain: "A 段：volunteers once filled more than two hundred bags … in a single morning。题干里的 a single morning 是最好用的定位词，因为它是具体场景，不会被随意改写；D 段讲的是新规定实施后的变化，时间对不上。"
        },
        {
          q: "In which paragraph is the number of clean-up boats paid for by the river fund given?",
          options: ["Paragraph A", "Paragraph B", "Paragraph C", "Paragraph D", "Paragraph E"],
          answer: 3,
          explain: "D 段：the river fund collected more than twelve thousand pounds, which paid for three new clean-up boats。题干问的是「几条船」，答案藏在 which 引导的定语从句里——从句里常有匹配题要的细节，定位到段落之后一定要读到句尾。"
        },
        {
          q: "In which paragraph is the amount of the fine for breaking the rule stated?",
          options: ["Paragraph A", "Paragraph B", "Paragraph C", "Paragraph D", "Paragraph E"],
          answer: 1,
          explain: "B 段：Shops that break the rule are fined fifty pounds。题干的关键词是 fine（罚款）和金额，B 段两个都有。E 段出现过 two hundred pounds，但那是店主多花的包装费，不是罚款——数字题的陷阱就是「数字对上了，事情没对上」。"
        }
      ]
    },
    {
      id: 405,
      title: "长篇阅读匹配（二）：同义替换与段落主旨",
      minutes: 18,
      gist: "题干往往不说原词：先靠数字和专名定位，再用同义替换核对，最后看段落主旨句。",
      lesson: "长篇匹配真正的难点是「题干不用原词」。原文说 prices fell，题干可能写成 costs went down；原文说 staff are unhappy，题干可能写成 employees are dissatisfied。做法分三步：\n① 先找不变的部分：数字、人名、机构名、专业术语通常原样保留，先用它们定位。\n② 再核对变形的部分：把题干里的词换成你认识的同义词，确认意思一致，而不是只对一个词。常考替换：rise / go up / increase；cut / reduce / lower；important / essential；problem / difficulty / obstacle；help / assist / benefit；buy / purchase；cheap / affordable；former / previous；want / intend / aim to；need / require；fewer / a fall in。\n③ 找不到原词时，用段落主旨句：多数段落的第一句或最后一句就是它的中心，题干如果是一句概括，答案往往就在那两句上。\n时间不够时的做法：先把数字和专名的题做完，划掉确定的段落，剩下的段落变少，猜也更容易猜对。",
      usage: "读英文新闻、行业报告时，同一件事换个说法反复出现；能认出同义替换，就不会觉得「每个词都认识，就是不知道在说什么」。",
      takeaways: [
        "先用数字、专名定位，再用同义替换核对意思",
        "常考替换：rise↑=go up，cut=reduce，problem=obstacle",
        "找不到原词时看段落首句或尾句（主旨句）",
        "做完一题做个记号即可（同一段可能被选两次），剩下的靠排除法"
      ],
      type: "read",
      taskTitle: "同义替换匹配",
      taskCopy: "题干不会照抄原文，请用同义替换来判断。5 道题，答对 4 题（75%）即可通关。",
      passageLabel: "长篇阅读材料",
      passageTag: "段落 A–E",
      passage: "A. Northgate Design, a small company that produces websites for hotels, began a four-day week in January. Its forty-two members of staff now work thirty-two hours instead of forty, and they keep the same pay. The managing director says the idea came from a book she read on holiday, and that few companies in the same industry have tried anything similar.\n\nB. Six months later, the figures look good. The amount of work completed has risen by twelve per cent, and every project has been finished on time. Managers say the gain came from cutting meetings: the company now holds two short meetings a week instead of a long one every morning.\n\nC. Running costs have also gone down. Because the office is closed on Fridays, the company uses less electricity, and printing has almost stopped. The money saved, about nine thousand pounds a year, is being put into a training fund for junior designers.\n\nD. The staff are the clearest winners. In a survey, most said they sleep better and spend more time with their families; none said they wanted to return to five days. Days lost to illness fell by a third, which the managing director describes as the most surprising result of the year.\n\nE. Not everybody is happy. Two hotel clients complained that they could not reach anyone at Northgate on Fridays, and one moved to another company. Northgate has since kept a telephone line open on Fridays, with two designers on duty, and it has announced that the trial will continue for another year.",
      passRatio: 0.75,
      questions: [
        {
          q: "Which paragraph reports that workers took fewer days off because of illness?",
          options: ["Paragraph A", "Paragraph B", "Paragraph C", "Paragraph D", "Paragraph E"],
          answer: 3,
          explain: "D 段：Days lost to illness fell by a third。题干用 took fewer days off because of illness 替换原文的 Days lost to illness，用 reports … fewer 替换 fell。B 段的 risen by twelve per cent 是工作量上升，方向相反，是典型的「看起来都是数字」的干扰。"
        },
        {
          q: "Which paragraph explains how many hours a week the staff now work?",
          options: ["Paragraph A", "Paragraph B", "Paragraph C", "Paragraph D", "Paragraph E"],
          answer: 0,
          explain: "A 段：Its forty-two members of staff now work thirty-two hours instead of forty。题干里的 how many hours 是数字提示词，回原文只需找两个数字：32（现在）和 40（原来）。读题时先圈数字类提示，是匹配题最省时间的习惯。"
        },
        {
          q: "Which paragraph mentions that a customer has taken its business elsewhere?",
          options: ["Paragraph A", "Paragraph B", "Paragraph C", "Paragraph D", "Paragraph E"],
          answer: 4,
          explain: "E 段：Two hotel clients complained … and one moved to another company。题干用 a customer has taken its business elsewhere 替换 clients … moved to another company（客户把生意给了别人）。C 段虽然讲钱，但讲的是公司自己省下的成本，与客户流失无关。"
        },
        {
          q: "Which paragraph says that the company's running costs have fallen?",
          options: ["Paragraph A", "Paragraph B", "Paragraph C", "Paragraph D", "Paragraph E"],
          answer: 2,
          explain: "C 段首句：Running costs have also gone down。题干几乎照抄了首句，只是把 gone down 换成 fallen——段落首句常常就是主旨句，题干如果是概括性表述，先看首句最有效率。"
        },
        {
          q: "Which paragraph reports that more work is being completed?",
          options: ["Paragraph A", "Paragraph B", "Paragraph C", "Paragraph D", "Paragraph E"],
          answer: 1,
          explain: "B 段：The amount of work completed has risen by twelve per cent。题干用 more work is being completed 替换 has risen，用 reports 替换原文的数字陈述。注意 B 段的 gain came from cutting meetings 只是原因，题目问的是「工作量增加」这件事本身。"
        }
      ]
    },
    {
      id: 406,
      title: "仔细阅读（一）：细节题",
      minutes: 16,
      gist: "仔细阅读每题 14.2 分：先看题干不看选项，按题文同序回原文定位，再拆掉三类偷换。",
      lesson: "仔细阅读（Section C）每题 14.2 分，是阅读里最值钱的部分，而其中占比最高的是细节题。做法只有五步：\n① 先看题干，不看选项：选项会把你带偏。用题干里的关键词（人名、数字、术语、动词短语）回原文定位。\n② 利用题文同序：第一题一般在文章开头，最后一题在结尾，题目的顺序基本等于文章的顺序。定位到一题，下一题从它后面找起，不要每次从头扫。\n③ 定位到句子后，读它的上一句和下一句：答案常常藏在前一句的原因或后一句的结果里，只看那一句容易漏。\n④ 对比选项与原文，专门盯三类偷换：换主体（把 A 做的事说成 B 做的）、换程度（把 some 说成 all、把 may 说成 must）、换范围或时间（把 in cities 说成 in the countryside）。\n⑤ 用信号词决定「哪一句值得细看」：however / but / yet 后面是转折重点，therefore / so / as a result 后面是结论，and / also / in addition 后面是补充。四级阅读的答案大多落在转折句和结论句上——定位到段落后，先扫一眼有没有这些词，有就优先精读那一句（本关第 5 题问「运输主管说了什么」，依据就在 however 之后）。\n两个反直觉但很管用的判断：照抄原文词的选项不一定是答案，改写过的往往是答案；找不到原文依据的选项，再顺眼也不能选。",
      usage: "看英文合同、产品参数、租房广告时，靠的就是「找到那一句、再核对细节」的能力，凭印象签合同最容易吃亏。",
      takeaways: [
        "先看题干不看选项，用关键词回原文定位",
        "题文同序：题目顺序≈文章顺序，找到一题就往下走",
        "定位后连读上下一句，答案常在前因后果里",
        "however 后面是转折重点，therefore 后面是结论",
        "三类偷换：换主体、换程度、换范围或时间"
      ],
      type: "read",
      taskTitle: "细节题实战",
      taskCopy: "先自己读一遍材料，再作答。6 道题全部是细节题，答案都能在原文里逐句验证。答对 5 题（80%）即可通关。",
      passageLabel: "阅读材料",
      passageTag: "仔细阅读",
      passage: "Two years ago, the old railway line between Harrow and Beckton carried its last freight train. The track had been unused for a decade, and the council had to decide whether to sell the land or turn it into something useful. After a public meeting that lasted four hours, it chose a cycle path.\n\nThe work cost £2.3 million, most of which came from a national fund for green transport rather than from local taxes. Builders kept the original stone bridges and planted wild flowers along the edges; the path is twelve kilometres long and three metres wide, wide enough for two cyclists to pass each other comfortably.\n\nSince it opened in April, the path has been busier than anyone expected. A counter fixed to a lamp post near the Beckton end recorded 120,000 journeys in the first six months — more than double the council's estimate. On weekdays most users are commuters cycling to the station; at weekends, families arrive with children and picnics.\n\nShopkeepers in Beckton say the path has changed their trade. The café next to the old station now opens at seven in the morning instead of nine, and a bicycle repair shop opened in a former ticket office in June. Both owners say that weekend customers spend more than the commuters they used to serve.\n\nThe council is already planning a second path, this time along the canal to the north. Its transport officer warns, however, that the money is harder to find now, and that the next project will have to be built in stages. She also points out that the first path has not reduced car traffic in the town centre as much as the council had hoped: most of the new cyclists, surveys suggest, used to walk or take the bus.",
      passRatio: 0.8,
      questions: [
        {
          q: "What did the council decide to do with the old railway line?",
          options: ["Sell the land to builders", "Reopen it for freight trains", "Turn it into a cycle path", "Plant wild flowers along it"],
          answer: 2,
          explain: "第一段末句：it chose a cycle path（它选择了自行车道）。定位句是 the council had to decide whether to sell the land or turn it into something useful。D 项是陷阱：种野花确有其事，但那是修路时的做法，不是「对这条老铁路的决定」——把文章里出现过的细节安到错误的问题上，是细节题最常见的干扰方式。"
        },
        {
          q: "Where did most of the money for the path come from?",
          options: ["A national fund for green transport", "Local taxes", "Shopkeepers in Beckton", "Ticket sales"],
          answer: 0,
          explain: "第二段首句：most of which came from a national fund for green transport rather than from local taxes。rather than 明确排除本地税收，所以 B 正好说反；C、D 在原文里都没有出现过。看到 rather than / instead of，一定把被排除的那一项圈出来，命题人极爱在那里设干扰。"
        },
        {
          q: "How long is the cycle path?",
          options: ["Three kilometres", "Six kilometres", "Nine kilometres", "Twelve kilometres"],
          answer: 3,
          explain: "第二段：the path is twelve kilometres long and three metres wide。句子里有两个数字，十二是长度（long），三是宽度（wide）。数字题要盯住数字后面的单位词，把 long 和 wide 看反就选成了 A。"
        },
        {
          q: "What does the passage say about the people who use the path on weekdays?",
          options: [
            "They are mostly families with children.",
            "They are mostly commuters cycling to the station.",
            "They are mostly tourists visiting the stone bridges.",
            "They are mostly students from the university."
          ],
          answer: 1,
          explain: "第三段：On weekdays most users are commuters cycling to the station; at weekends, families arrive with children and picnics。A 项本身没错，但对应的是 at weekends（周末），属于「换时间」的偷换；C、D 原文没有依据。读题干时先圈时间词（on weekdays），能挡掉一半干扰项。"
        },
        {
          q: "What did the council's transport officer say about the first path?",
          options: [
            "It cost more than the council could afford.",
            "It has attracted fewer cyclists than expected.",
            "It should have kept more of the old bridges.",
            "It has not reduced town-centre traffic as much as the council had hoped."
          ],
          answer: 3,
          explain: "最后一段：the first path has not reduced car traffic in the town centre as much as the council had hoped。B 项与原文相反——第三段说 the path has been busier than anyone expected（比任何人预料的都热闹）；A、C 都属于无中生有。"
        },
        {
          q: "What happened in June?",
          options: [
            "The first freight train left the station.",
            "A bicycle repair shop opened in a former ticket office.",
            "The café next to the station closed.",
            "A second cycle path was approved."
          ],
          answer: 1,
          explain: "第四段：a bicycle repair shop opened in a former ticket office in June。这道题的关键词是月份 June，回原文扫数字和月份最快。D 项要注意：第二条道路只是「计划中」（The council is already planning a second path），并没有批准，属于把「计划」说成「已批准」的程度偷换。"
        }
      ]
    },
    {
      id: 407,
      title: "仔细阅读（二）：推理题",
      minutes: 18,
      gist: "推理题的答案仍然是原文的合理延伸：能找到依据才选，找不到依据的一律排除。",
      lesson: "推理题的标志词：infer、imply、suggest、learn from the passage、the author suggests。做法和细节题不同，但底线一样——答案必须有原文依据。\n① 推理 = 原文一两句话的直接延伸，不是你的想象。判断标准：能不能用原文说出「因为原文说 X，所以选 Y」。做不到，就是过度推断。\n② 找转折词和评价词：however、but、yet、although、only、rarely、surprisingly、too…to。作者的言外之意几乎都藏在这些词后面。\n③ 三种最常见陷阱：① 选项本身正确，但原文没从这个角度说；② 过度推断（把 may 推成 will、把 some 推成 all）；③ 常识正确但原文没提——用自己的知识代替原文，是推理题失分最多的一种。\n④ 实操：把四个选项逐一带回原文找出处，找不到出处的先划掉，剩下的那个能从原文推出来的就是答案。\n记住：推理题不需要你「想得更深」，只需要你「读得更准」。",
      usage: "读英文新闻评论、客户反馈、同事邮件时，理解「话外之音」靠的就是这套推理，而不是逐字直译。",
      takeaways: [
        "推理题的答案必须是原文的直接延伸",
        "however / but / surprisingly 之后常是作者的真实态度",
        "三类陷阱：答非所问、过度推断、用常识代替原文",
        "逐选项回原文找出处，找不到就排除"
      ],
      type: "read",
      taskTitle: "推理题实战",
      taskCopy: "5 道题都需要「推一步」，但每一步都能在原文找到依据。答对 4 题（80%）即可通关。",
      passageLabel: "阅读材料",
      passageTag: "仔细阅读",
      passage: "When the Westbrook Public Library stopped charging fines for late books last year, the head librarian expected to lose money and to wait longer for returns. Neither happened.\n\nIn the first twelve months, the number of overdue books hardly changed: about 92% came back within three weeks, exactly as before. What did change was who came through the door. Families with young children, who used to stay away because a forgotten picture book could cost them several pounds, now borrow far more books than they used to. Older readers have come back too: visits by people over seventy rose by a quarter.\n\nThe librarian admits that the old system was never really about money. Fines brought in less than one per cent of the library's income, but they gave a small number of staff a great deal of work — sending letters, taking payments, and, worst of all, arguing with readers at the desk. 'A library should not make people feel guilty for being late,' she says. 'It should make them want to come back.'\n\nNot every librarian agrees. In a professional magazine, one manager from a large city library argued that fines are a useful reminder, and that without them a few borrowers simply keep books for months. Her own library, she notes, has 40,000 items and loses about 300 a year; Westbrook, with a smaller collection, has lost more since the change, although the librarian there says the figure is still 'well under one per cent of stock'.\n\nWestbrook is now trying something further: books may be returned to any library in the county, not just to the one that lent them. The head librarian calls it 'the same idea, one step on'.",
      passRatio: 0.8,
      questions: [
        {
          q: "What did the head librarian expect would happen after fines were dropped?",
          options: [
            "Books would come back later than before.",
            "Fewer people would join the library.",
            "Staff would have less work to do.",
            "Readers would lose their books more often."
          ],
          answer: 0,
          explain: "第一段：expected to lose money and to wait longer for returns（预计会少收钱、要等更久才收回书）。wait longer for returns 就是 A 的依据。C 项与第三段相反——取消罚款后员工反而少了寄信、收款、争吵这些活；B、D 原文没有依据。"
        },
        {
          q: "What can be learned about families with young children?",
          options: [
            "They were the library's biggest borrowers before the change.",
            "They rarely return books on time.",
            "They used to stay away because of the fines.",
            "They borrow picture books for older readers."
          ],
          answer: 2,
          explain: "第二段：Families with young children, who used to stay away because a forgotten picture book could cost them several pounds…（以前因为怕罚钱而不来）。A 项偷换时间：原文说他们现在借得比以前多得多（now borrow far more books than they used to），不是「以前就借得最多」；B、D 无依据。"
        },
        {
          q: "What does the head librarian suggest about the old fine system?",
          options: [
            "It raised a large part of the library's income.",
            "It created work and arguments without raising much money.",
            "It was popular with the library staff.",
            "It was the main reason books came back on time."
          ],
          answer: 1,
          explain: "第三段：Fines brought in less than one per cent of the library's income, but they gave a small number of staff a great deal of work … arguing with readers at the desk。收入不到 1%（排除 A），员工多了一堆活还要吵架（B 正确）。D 项被第二段的 92% … exactly as before 间接否定：取消罚款后按时还书的比例没变，说明罚款不是按时归还的主要原因。"
        },
        {
          q: "What does the manager from the large city library believe?",
          options: [
            "Libraries should charge higher fines.",
            "Westbrook should buy more books.",
            "Readers should be allowed to keep books longer.",
            "Fines serve a useful purpose as a reminder."
          ],
          answer: 3,
          explain: "第四段：one manager … argued that fines are a useful reminder（罚款是有用的提醒）。注意区分态度归属：题干问的是「这位馆长认为什么」，就不能拿上一段 Westbrook 馆长的观点来答——态度题最常见的失分就是把两个人的态度换着用。"
        },
        {
          q: "What does the head librarian's last remark suggest about the new scheme?",
          options: [
            "It is a completely new idea.",
            "It is a further step built on the same principle.",
            "It will cost the library a great deal of money.",
            "It was forced on the library by the county."
          ],
          answer: 1,
          explain: "最后一段：The head librarian calls it 'the same idea, one step on'。same idea 说明原则没变，taken a step further 说明是往前走了一步，所以 B 正确。A 项与 same idea 矛盾；C、D 原文完全没有提到，属于无依据选项，再合理也不能选。"
        }
      ]
    },
    {
      id: 408,
      title: "仔细阅读（三）：主旨题",
      minutes: 18,
      gist: "主旨题只在首段、尾段和每段首句里找答案：串起段首句，文章骨架就出来了。",
      lesson: "主旨题的问法：main idea / best title / the passage mainly discusses / the author's purpose。做法：\n① 主旨只藏在三个地方：首段（尤其是最后一句）、尾段（尤其是第一句）、以及每一段的第一句。\n② 把每段首句串起来读一遍，那就是文章的骨架。某段首句看不懂，就看它的最后一句——段落的主旨句常在这两个位置。\n③ 正确选项的特征：覆盖全文、措辞概括。错误选项只有三类：太窄（只说某一段的细节）、太宽（超出文章话题）、偷换重点（把次要信息当成主题）。\n④ 标题题（best title）除了覆盖全文，还要「点出话题」，但本质仍是同一道题，不要被文采骗了。\n⑤ 一个反直觉的提醒：反复出现的高频词不一定是主题。作者围绕这个词讲了什么，才是主题——比如一篇文章反复出现 tree，主题却是「城市种树需要长期维护」，而不是「树」。\n做题顺序建议：主旨题放在最后做。读完前面几道细节题，文章大意已经清楚了，这时再选主旨，正确率会明显提高。",
      usage: "读英文报道、行业分析时，能一句话说出「这篇到底在讲什么」，才知道这份材料值不值得细读。",
      takeaways: [
        "主旨看首段末句、尾段首句、各段首句",
        "正确选项覆盖全文；错项太窄、太宽或偷换重点",
        "高频词不等于主题，要看作者围绕它讲了什么",
        "主旨题放到最后做，正确率更高"
      ],
      type: "read",
      taskTitle: "主旨题实战",
      taskCopy: "先通读材料，再做 6 道题；其中第 1、2 题是主旨与标题题，建议留到最后再选。答对 5 题（80%）即可通关。",
      passageLabel: "阅读材料",
      passageTag: "仔细阅读",
      passage: "Planting trees has become the favourite answer to almost every problem a city faces. Trees cool the streets, clean the air, slow rainwater and, according to a growing number of studies, make people happier. In the past five years, more than forty cities in Europe have promised to plant a million trees or more.\n\nThe promises are easier to make than to keep. A young tree in a city street needs water for at least three years, and roughly one in four planted in pavements dies within five years. Some cities have planted quickly to meet a political deadline and then had no budget left for watering. Others chose cheap, fast-growing species that need cutting back every year and offer little shade.\n\nThere is also a question of where the trees go. Trees planted in rich neighbourhoods are three times more likely to survive than those planted in poorer ones, mainly because residents there have more time and money to look after them. If a city simply plants wherever there is space, it may widen the gap it was trying to close.\n\nNone of this means that planting trees is a bad idea. It means that a tree is not a decoration but a piece of public equipment with a thirty-year maintenance bill. Cities that have done well — Sheffield is one — treat planting as the beginning of a long relationship: they map every tree, water it by contract for five years, and let residents choose the species on their street.\n\nThe lesson from these cities is simple. A city does not need a million trees; it needs a plan that lasts longer than the mayor who announced it.",
      passRatio: 0.8,
      questions: [
        {
          q: "What is the main idea of the passage?",
          options: [
            "Cities should stop planting trees until they have more money.",
            "Fast-growing trees are the best choice for city streets.",
            "Rich neighbourhoods have more trees than poor ones.",
            "Planting trees works only when cities plan for their long-term care."
          ],
          answer: 3,
          explain: "全文的骨架是：城市爱承诺种树（首段）→ 承诺容易守住难，缺的是浇水和养护的钱（第二段）→ 种在哪里也有讲究（第三段）→ 做得好的城市把种树当成三十年的事（第四段）→ 需要的不是一百万棵树，而是比市长任期更长的计划（尾段）。所以 D 覆盖全文。A 太极端（原文说 None of this means that planting trees is a bad idea）；B、C 都只是文中一个细节。"
        },
        {
          q: "Which of the following would be the best title for the passage?",
          options: [
            "A Million Trees, and Then What?",
            "How to Choose a Tree for Your Street",
            "Why Cities Are Getting Hotter",
            "The Cost of Watering Young Trees"
          ],
          answer: 0,
          explain: "标题题本质上还是主旨题。A 项「一百万棵树，然后呢？」既点出城市爱做大承诺（首段），又点出真正的问题是承诺之后怎么办（全文重点）。B、D 都只是某一两段的细节（太窄）；C 项文章根本没讨论城市变热的原因（太宽、偏题）。"
        },
        {
          q: "Why does the author mention Sheffield?",
          options: [
            "To prove that British cities spend the most on trees",
            "To warn that mapping every tree is too expensive",
            "To show that some cities manage the work well",
            "To explain how to choose species for a street"
          ],
          answer: 2,
          explain: "第四段先说 Cities that have done well，紧接着用破折号补出 Sheffield is one，后面列举的正是它们做对了什么（给每棵树建档、按合同浇水五年、让居民选树种）。所以举这个例子是为了说明「有城市做得好」，属于举例支撑观点的常规写法。"
        },
        {
          q: "According to the passage, why do trees survive better in richer neighbourhoods?",
          options: [
            "The soil there is better for young trees.",
            "Residents there have more time and money to look after them.",
            "The trees planted there are older and stronger.",
            "There is less traffic in those streets."
          ],
          answer: 1,
          explain: "第三段：Trees planted in rich neighbourhoods are three times more likely to survive … mainly because residents there have more time and money to look after them。mainly because 就是原因标志词，答案紧跟其后。A、C、D 都是「听起来合理但原文没说」的常识型干扰项。"
        },
        {
          q: "What does the author mean by the last sentence of the passage?",
          options: [
            "Mayors should not announce tree-planting plans.",
            "Cities should plant fewer trees than they promise.",
            "Tree-planting plans should be made by residents.",
            "A lasting plan matters more than a large number of trees."
          ],
          answer: 3,
          explain: "尾句：A city does not need a million trees; it needs a plan that lasts longer than the mayor who announced it。前半句否掉「数量」，后半句立起「长期计划」，D 正是这个对比。B 项偷换了重点：作者不反对多种树，反对的是只讲数字不讲养护；A、C 都是对尾句的过度解读。"
        },
        {
          q: "What does the passage say about trees planted to meet a political deadline?",
          options: [
            "They are usually the cheapest species.",
            "They often receive no money for watering.",
            "They survive better than other trees.",
            "They are chosen by local residents."
          ],
          answer: 1,
          explain: "第二段：Some cities have planted quickly to meet a political deadline and then had no budget left for watering。no budget left for watering 与 B 对应。A 项把两件事混在一起了——选便宜的速生树种是「另一些城市」的问题（Others chose cheap, fast-growing species），不是为赶工期种树的那些。"
        }
      ]
    },
    {
      id: 409,
      title: "仔细阅读（四）：态度题",
      minutes: 18,
      gist: "态度看三处：转折词后的评价句、形容词副词、以及作者引用谁的话；indifferent 几乎永远是错的。",
      lesson: "态度题问「作者（或文中某人）对某事是什么态度」，选项是一小撮形容词。先把这批词背熟：\npositive 支持 / negative 反对 / objective 客观 / neutral 中立 / critical 批评 / doubtful 怀疑 / indifferent 漠不关心 / optimistic 乐观 / cautious 谨慎 / sympathetic 同情 / approving 赞成 / disapproving 不赞成。\n三条铁律：\n① 新闻、科普、说明类文章的作者态度多数是 objective（客观陈述）或 cautious（谨慎），极少是 indifferent——作者花整篇写它，不可能不关心，所以 indifferent 几乎永远是错的。\n② 找态度看三处：转折词后面的评价句（however、but、yet）、带感情色彩的形容词副词（surprisingly、disappointingly、only、merely）、以及作者引用谁的话、放在什么位置——引用常用来暗示立场。\n③ 分清「作者的态度」和「文中某人的态度」：题干问谁，就只看谁的话，别把两个人的观点换着用。\n答题技巧：先判断正负方向（支持 / 反对 / 中立），再在方向内挑程度，正确率会高很多。",
      usage: "读英文产品评论、客户邮件、行业分析时，分清「客观陈述」和「委婉批评」，能帮你判断对方真实的意思。",
      takeaways: [
        "态度词要成组背：objective / cautious / critical / doubtful",
        "indifferent 几乎永远是错的",
        "转折词后、评价性形容词、作者引用的话是三个抓手",
        "先定方向（正 / 负 / 中立），再定程度"
      ],
      type: "read",
      taskTitle: "态度题实战",
      taskCopy: "6 道题，其中第 1、4 题考作者态度。答对 5 题（80%）即可通关。",
      passageLabel: "阅读材料",
      passageTag: "仔细阅读",
      passage: "Last term, a large state university began using software to mark the short essays written by first-year students. The system does not give the final mark; it suggests a grade and lists its reasons, and the tutor decides whether to accept it. The university says the aim is not to replace teachers but to save them from reading the same weak paragraph two hundred times.\n\nThe first results are mixed, and the university has published them without much comment. Tutors who used the system reported that they spent about a third less time on marking, and that their comments became longer and more specific because the software had already dealt with grammar. Students, surprisingly, were less enthusiastic: in a survey, two thirds said they would rather wait an extra week for a human being to read their work.\n\nThere is a more serious worry. The software was trained on essays that had already been marked, and those marks reflected the habits of the tutors who gave them. If the system learns that short sentences and long words earn higher grades, it will reward exactly those habits, whether or not they make the writing better. One professor put the problem neatly: 'It has learned our weaknesses as well as our standards.'\n\nThe university has been careful in its public statements. It has promised that no final grade will be produced by software alone, that every student may ask for a human re-mark, and that the system's advice will be published each year. These are sensible promises. Whether they will survive the next round of budget cuts is another matter, and the university has said nothing about that.",
      passRatio: 0.8,
      questions: [
        {
          q: "What is the author's attitude towards the use of the marking software?",
          options: ["Strongly opposed", "Fully supportive", "Cautiously accepting", "Completely indifferent"],
          answer: 2,
          explain: "作者既指出好处（导师批改少花三分之一时间、评语更长更具体），也点出真问题（软件会学走导师的坏习惯），最后说这些承诺 sensible（合理）却又追问它们能否挺过下一轮预算削减——这是典型的「谨慎接受」。indifferent 是态度题的常设错误项：作者通篇在写它，不可能漠不关心。"
        },
        {
          q: "What does the author suggest by reporting the students' survey?",
          options: [
            "Students value human marking more than the university expected.",
            "Students find the software too slow to use.",
            "Students want more grammar feedback.",
            "Students do not read the comments they receive."
          ],
          answer: 0,
          explain: "第二段：Students, surprisingly, were less enthusiastic: … two thirds said they would rather wait an extra week for a human being to read their work。surprisingly 说明结果出乎校方预料，「宁愿多等一周也要人来读」说明学生看重的正是人工批改，所以选 A。B、C、D 原文均无依据。"
        },
        {
          q: "What is the professor's comment mainly about?",
          options: [
            "The software is too expensive to train.",
            "The software may copy the tutors' bad habits.",
            "The software marks too few essays each term.",
            "The software should be tested on more students."
          ],
          answer: 1,
          explain: "教授的话：'It has learned our weaknesses as well as our standards.'（它把我们的弱点和标准一起学走了。）上文还说明软件是用「已经批过的作文」训练的，那些分数本身就带着导师的习惯，所以 B 正确。A、C、D 都是原文没提到的角度。"
        },
        {
          q: "What does the phrase 'These are sensible promises' suggest about the author's view?",
          options: [
            "The promises are unlikely to be kept at all.",
            "The promises are unnecessary and should be dropped.",
            "The promises were made too late to matter.",
            "The promises are reasonable but may not last."
          ],
          answer: 3,
          explain: "sensible 表示认可（承诺本身合理），紧跟的 Whether they will survive the next round of budget cuts is another matter 表示担心（能不能保住是另一回事），两句合起来就是「合理，但未必能长久」。A 说得太绝对（作者并没有说一定做不到），B、C 与 sensible 直接冲突。"
        },
        {
          q: "How has the university presented the first results?",
          options: [
            "It has claimed a great success.",
            "It has published them without much comment.",
            "It has refused to publish them.",
            "It has asked tutors to keep them secret."
          ],
          answer: 1,
          explain: "第二段首句：The first results are mixed, and the university has published them without much comment（结果好坏参半，学校公布时也没怎么评论）。A 项与 mixed（喜忧参半）矛盾；C、D 与 published 直接相反。这道题考的是「作者叙述的事实」，定位到那一句即可。"
        },
        {
          q: "What is the university's stated aim in using the software?",
          options: [
            "To replace tutors in marking essays",
            "To raise students' final grades",
            "To save tutors from repeated routine reading",
            "To reduce the number of essays set"
          ],
          answer: 2,
          explain: "第一段：The university says the aim is not to replace teachers but to save them from reading the same weak paragraph two hundred times。not … but … 结构里，but 后面才是真正的目的。A 项正好落在了被否定的那一半上——看到 not … but …，答案在 but 后面。"
        }
      ]
    },
    {
      id: 410,
      title: "长难句实战（一）",
      minutes: 20,
      gist: "把三步法用到三种最常见的「长」上：从句套从句、插入语、并列结构。",
      lesson: "这一关把第 107 关的三步法（数谓语 → 括从句 → 抓主干）用到三种最常见的「长」上：\n① 定语从句套定语从句：从句里的名词后面又跟一个从句。做法是从最近的名词开始往外读。many of which / some of whom 这类「代词 + 介词 + 关系词」结构，指的是前面刚提到的那个复数名词。\n② 插入语：两个逗号或两个破折号之间的部分可以先遮住不看，句子立刻变短。常见插入语有 however、for example、in fact、as a result，以及 when given … 这样的分词短语。\n③ 并列结构：and / but / or 连接的两部分地位平等。读到第一部分时记住它的结构（是动词短语还是名词短语），第二部分照同样的结构读。\n动手顺序：数谓语动词 → 在谓语处断开 → 每段找主语 → 再把修饰加回去。做题时先回答「主干在说什么」，再回答「修饰补充了什么」。\n训练方法：每读一篇文章，挑出最长的一句话抄下来，用括号把所有从句括起来。坚持一个月，你会发现自己不再回读同一个句子。",
      usage: "读英文论文摘要、产品条款、新闻长句时，这套拆句法让你先抓住句子在说什么，再决定要不要看细节。",
      takeaways: [
        "many of which / some of whom 指前面刚提到的复数名词",
        "两个逗号之间的插入语可以整块遮住",
        "并列结构前后同级，照第一部分的结构读第二部分",
        "先找主干（主谓宾），再把修饰加回去"
      ],
      type: "read",
      taskTitle: "长难句拆解",
      taskCopy: "先自己读一遍这四句长句（也可以点音频听一遍），再回答 6 道题。答对 5 题（80%）即可通关。",
      passageLabel: "长难句材料",
      passageTag: "精读长句",
      passage: "Although the device was designed for use in hospitals, where it has already helped surgeons to see the smallest blood vessels during operations, its makers believe that it will soon be cheap enough for ordinary clinics in the countryside, many of which have no equipment of this kind at all.\n\nThe team, which had spent four years testing the material on mice before anyone would agree to pay for a trial on humans, reported last month that the treatment, when given within six hours of the injury, reduced the damage by more than half.\n\nWhat surprised the researchers was not the size of the effect but the fact that it appeared in older patients as well as younger ones, which suggests that the repair process, long thought to be lost with age, may in fact only be dormant.\n\nThe company has not yet said how much the device will cost, and the first machines, which were made by hand, are expected to remain in the two teaching hospitals where they are being tested.",
      audio: [
        {
          file: "410-1.mp3",
          label: "长难句朗读",
          voice: "女声",
          hint: "第一遍只听主干：its makers believe… / The team reported… / What surprised the researchers was…",
          transcript: "Although the device was designed for use in hospitals, where it has already helped surgeons to see the smallest blood vessels during operations, its makers believe that it will soon be cheap enough for ordinary clinics in the countryside, many of which have no equipment of this kind at all.\nThe team, which had spent four years testing the material on mice before anyone would agree to pay for a trial on humans, reported last month that the treatment, when given within six hours of the injury, reduced the damage by more than half.\nWhat surprised the researchers was not the size of the effect but the fact that it appeared in older patients as well as younger ones, which suggests that the repair process, long thought to be lost with age, may in fact only be dormant.\nThe company has not yet said how much the device will cost, and the first machines, which were made by hand, are expected to remain in the two teaching hospitals where they are being tested."
        }
      ],
      audioTip: "先听一遍抓主干，再逐句对照文本，把每句的从句用括号括起来。",
      passRatio: 0.8,
      questions: [
        {
          q: "In sentence 1, what does 'many of which' refer to?",
          options: ["hospitals", "surgeons", "the makers", "ordinary clinics in the countryside"],
          answer: 3,
          explain: "many of which 紧跟在 ordinary clinics in the countryside 后面，which 指代的是离它最近的那个复数名词短语——乡下的小诊所（很多诊所根本没有这类设备）。这是「代词 + 介词 + 关系词」结构的铁律：往左找最近的那个复数名词，再看意思是否讲得通。"
        },
        {
          q: "In sentence 1, who believes the device will soon be cheap enough for ordinary clinics?",
          options: ["Its makers", "The surgeons", "Hospital managers", "Country doctors"],
          answer: 0,
          explain: "把 Although 从句和 where 从句括起来后，主干是 its makers believe that it will soon be cheap enough for ordinary clinics…，所以「相信」的主语是 its makers（制造商）。surgeons 只出现在 where 从句里，是「已经用上它的外科医生」，不是判断价格的人。"
        },
        {
          q: "In sentence 2, how long had the team been testing the material on mice before a human trial was paid for?",
          options: ["Six months", "Four years", "Two years", "Six hours"],
          answer: 1,
          explain: "which 从句：which had spent four years testing the material on mice before anyone would agree to pay for a trial on humans。four years 是花了四年的意思。D 项的 six hours 在句子里确实出现过，但那是「受伤后六小时内给药」，和「在老鼠身上试验多久」不是一回事——数字题必须看清数字修饰的是什么。"
        },
        {
          q: "In sentence 2, when did the treatment reduce the damage by more than half?",
          options: [
            "When given to mice before the trial",
            "When given a month after the injury",
            "When given within six hours of the injury",
            "When given only to older patients"
          ],
          answer: 2,
          explain: "主干是 The team reported that the treatment … reduced the damage by more than half，中间的 when given within six hours of the injury 是插入语，交代条件：受伤六小时内给药。把插入语遮住，主干反而更好懂——这就是「先看主干、再看修饰」的用处。"
        },
        {
          q: "In sentence 3, what did the researchers find surprising?",
          options: [
            "The size of the effect on younger patients",
            "The fact that the repair process is lost with age",
            "The number of patients in the trial",
            "The fact that the effect appeared in older patients too"
          ],
          answer: 3,
          explain: "sentence 3 的结构是 What surprised the researchers was not A but B：不是效果的大小（A 被否定），而是 it appeared in older patients as well as younger ones（年长病人身上也有效果）。B 项与原文相反：原文说的是修复过程 long thought to be lost with age（过去被认为随年龄消失），而现在看来可能只是休眠（only be dormant）。"
        },
        {
          q: "In sentence 3, the phrase 'long thought to be lost with age' describes ______.",
          options: ["the repair process", "older patients", "the researchers", "the size of the effect"],
          answer: 0,
          explain: "该短语夹在两个逗号之间，紧跟 the repair process：the repair process, long thought to be lost with age, may in fact only be dormant。两个逗号之间的分词短语修饰前面最近的名词，这是插入语的常规位置。判断修饰关系时先看逗号，再看最近的名词。"
        }
      ]
    },
    {
      id: 411,
      title: "长难句实战（二）",
      minutes: 20,
      gist: "四种更「绕」的结构：倒装、强调句、名词性从句、比较与省略——拆法还是那三步。",
      lesson: "这一关练四种更「绕」的结构，拆法仍然是「找谓语 → 找主语 → 找宾语」：\n① 倒装：Not only… but also…、Only when… did…、Never have I…。句首出现否定词，主语就跑到助动词后面去了，读的时候先把语序还原成正常语序。\n② 强调句：It is / was … that …。把 It is 和 that 一起拿掉，剩下的就是被强调的部分，句子立刻变短；判断标志是把 It is 和 that 去掉后，剩下的部分能独立成句。\n③ 名词性从句作主语或表语：What matters is…（主语从句）、The fact is that…、that 引导的表语从句。看到 What 开头的句子，先在心里把它当成「一件事」来看。\n④ 比较结构与省略：as … as、more … than、the more … the more。than 后面常省略与前面重复的部分，读的时候把省掉的词补回来。\n⑤ 指代题的做法：看到 it / this / that / they，先在同一句里往左找最近的名词，意思不通再往上找一句。指代题的答案通常在「最近」与「讲得通」这两个条件的交集里。",
      usage: "读英文合同条款、公司制度、政策说明时，倒装和强调句最容易读错重点，拆句法能帮你找准「到底谁必须做什么」。",
      takeaways: [
        "句首否定词引起倒装，先还原正常语序",
        "It is … that … 去掉框架，剩下的就是被强调的内容",
        "What 从句当「一件事」看，作主语或表语",
        "指代往左找最近的、讲得通的名词"
      ],
      type: "read",
      taskTitle: "长难句拆解（进阶）",
      taskCopy: "先自己读一遍这四句（也可以点音频听一遍），再回答 6 道题。答对 5 题（80%）即可通关。",
      passageLabel: "长难句材料",
      passageTag: "精读长句",
      passage: "Not only did the new working-from-home rule fail to reduce the number of hours that staff spent in meetings, but it also made those meetings longer, because anyone who joined online, however briefly, expected to be given the chance to speak.\n\nIt is the way the scheme was introduced, rather than the scheme itself, that explains why so many employees, who had asked for the change in the first place, now say they would rather go back to the office.\n\nWhat managers often forget is that a rule which is welcomed on Monday may be resented on Friday, and that the more freedom a system appears to offer, the harder it becomes to ask for the help that it does not provide.\n\nNone of this means that flexible working is a bad idea; it means that a rule which looks generous on paper can still fail when nobody has thought about how it will feel in practice.",
      audio: [
        {
          file: "411-1.mp3",
          label: "长难句朗读",
          voice: "女声",
          hint: "第一遍只听主干：the rule failed to reduce… but made… / It is the way… that explains…",
          transcript: "Not only did the new working-from-home rule fail to reduce the number of hours that staff spent in meetings, but it also made those meetings longer, because anyone who joined online, however briefly, expected to be given the chance to speak.\nIt is the way the scheme was introduced, rather than the scheme itself, that explains why so many employees, who had asked for the change in the first place, now say they would rather go back to the office.\nWhat managers often forget is that a rule which is welcomed on Monday may be resented on Friday, and that the more freedom a system appears to offer, the harder it becomes to ask for the help that it does not provide.\nNone of this means that flexible working is a bad idea; it means that a rule which looks generous on paper can still fail when nobody has thought about how it will feel in practice."
        }
      ],
      audioTip: "听第一遍时先还原倒装句的语序（the rule did not reduce…），再听强调句里的 the way。",
      passRatio: 0.8,
      questions: [
        {
          q: "What does the writer say about the effect of the working-from-home rule on meetings?",
          options: [
            "It reduced their number but not their length.",
            "It made them shorter but more frequent.",
            "It made them longer rather than fewer or shorter.",
            "It had no effect on them at all."
          ],
          answer: 2,
          explain: "sentence 1 的 Not only … but also … 结构：fail to reduce the number of hours（没能减少开会花掉的时间）＋ made those meetings longer（还把会开得更长了）。两句合起来就是「没有变少、也没有变短，反而更长」，所以选 C。A 说「减少了次数」，与 fail to reduce 相反；B、D 都没有依据。"
        },
        {
          q: "In sentence 1, who expected to be given the chance to speak?",
          options: [
            "Staff who worked in the office",
            "Anyone who joined online",
            "The managers who wrote the rule",
            "The employees who had asked for the change"
          ],
          answer: 1,
          explain: "because 从句的主语是 anyone who joined online，中间的 however briefly（无论时间多短）是插入语，可以先遮住：because anyone who joined online expected to be given the chance to speak。找到 because 从句的主语，答案就出来了。"
        },
        {
          q: "In sentence 2, what explains why employees want to go back to the office?",
          options: [
            "The scheme itself",
            "The length of the working day",
            "The cost of travelling to the office",
            "The way the scheme was introduced"
          ],
          answer: 3,
          explain: "sentence 2 是强调句：It is the way the scheme was introduced, rather than the scheme itself, that explains…。把 It is 和 that 拿掉，剩下 the way the scheme was introduced, rather than the scheme itself explains…——被强调的是「制度推行的方式」，而不是制度本身，所以选 D。A 恰好是被 rather than 排除的那一项。"
        },
        {
          q: "In sentence 2, what had the employees done before the scheme was introduced?",
          options: [
            "They had asked for the change.",
            "They had refused to work from home.",
            "They had moved closer to the office.",
            "They had complained about their managers."
          ],
          answer: 0,
          explain: "who 从句：who had asked for the change in the first place（当初正是他们提出的这个改变）。in the first place 是「一开始、当初」的意思，这个时间状语把动作推到了制度推行之前。B、C、D 都是原文没有的内容。"
        },
        {
          q: "What does the writer mean by 'the more freedom a system appears to offer, the harder it becomes to ask for the help that it does not provide'?",
          options: [
            "More freedom always reduces the help a system offers.",
            "A system that looks free can make it harder to ask for support it does not provide.",
            "Employees should not ask their managers for help.",
            "Freedom and help mean the same thing in a company."
          ],
          answer: 1,
          explain: "这是 the more … the more … 比较结构：表面上给的自由越多，就越难开口要它其实没提供的那种帮助。appears to offer（看起来提供）和 does not provide（实际没提供）之间的落差是关键，所以选 B。A 把 appears（看起来）说成了事实；C、D 都不是句子的意思。"
        },
        {
          q: "What does the writer say managers often forget?",
          options: [
            "That rules are always popular when they are first announced",
            "That employees dislike being given any freedom",
            "That help is never needed on Fridays",
            "That opinions about a rule can change quickly and that apparent freedom can hide missing help"
          ],
          answer: 3,
          explain: "sentence 3 的主干是 What managers often forget is that …, and that …，两个 that 从句都是「被忘记的内容」：一是周一受欢迎的规矩周五可能就被抱怨（态度会变），二是看起来自由却难开口求助。D 把两点都概括到了。A 与 welcomed on Monday … resented on Friday 相反；B、C 属于无依据选项。"
        }
      ]
    },
    {
      id: 412,
      title: "阅读高频词与熟词僻义",
      minutes: 16,
      gist: "address 不是「地址」，novel 不一定是「小说」——熟悉的词换了意思，才是阅读里最容易读错的地方。",
      lesson: "熟词僻义指的是「认识的词，在阅读里换了意思」。四级最常考的一批：\n· address 处理、解决（address the problem），不只是「地址」\n· appreciate 意识到、理解（I appreciate why…），不只是「感激」\n· observe 遵守、庆祝（observe the rules），不只是「观察」\n· subject 使遭受；be subject to 易受……影响\n· capital 资本、首都、大写字母\n· figure 数字、人物、认为（figure out 弄明白）\n· matter 要紧（It doesn't matter.）\n· last 持续（The meeting lasted two hours.）\n· fine 细小的；罚款（a fine line / a parking fine）\n· novel 新颖的（a novel idea）\n· company 陪伴（keep sb company）\n· object 反对（object to）\n· content 满足的（be content with）\n· present 呈现、提出（present a plan）\n· practice 惯例、做法（common practice）\n· issue 议题、发行（不只有「问题」）\n遇到这些词时不要凭第一反应翻译，而要看它：① 在句子里作什么成分（动词？形容词？）；② 和谁搭配（后面跟 to？跟 on？）；③ 换回常用义之后整句通不通。三个问题问完，词义自然就出来了。\n建议单独准备一页「熟词僻义」笔记。它比背新词更划算：词你本来就认识，只是需要多记一个意思。",
      usage: "读英文邮件和合同条款时，address the issue、be subject to、common practice 全是熟词僻义，按常用义理解会直接读反意思。",
      takeaways: [
        "address = 处理，appreciate = 意识到、理解",
        "fine = 细小的，novel = 新颖的，last = 持续",
        "content = 满足的，company = 陪伴，practice = 惯例",
        "看不懂时先看成分和搭配，再换一个义项回读整句"
      ],
      type: "read",
      taskTitle: "熟词僻义实战",
      taskCopy: "6 道词义题，考的都是「你认识的词在句子里的另一个意思」。答对 5 题（80%）即可通关。",
      passageLabel: "阅读材料",
      passageTag: "词义辨析",
      passage: "When the Marlow Museum reopened last spring, its director had to address a problem that had been ignored for years: the building was beautiful, but almost nobody under thirty came through its doors.\n\nThe first idea was a novel one. Instead of presenting the collection in the usual order, the museum invited six local people — a nurse, a bus driver, a student, a chef, a gardener and a twelve-year-old — to choose the objects they found interesting. Each object is now shown with a short note explaining the choice. The practice has divided the staff: some think it is the most honest exhibition the museum has ever held; others fear it turns a serious collection into a game.\n\nVisitor numbers suggest the doubters are wrong. Attendance has risen by half in a year, and the average age of visitors has fallen by eleven years. The museum has also noticed something unexpected: people stay far longer in the rooms where the notes are personal, and many of them read every line.\n\nThere is a fine line between making a collection friendly and making it silly, and the museum does not always stay on the right side of it. One room now has a smell machine. A local critic wrote: 'I appreciate why the museum has changed, but a smell machine is a step too far.'\n\nBut the director is content with the result, and the museum is not alone: three others in the region have asked to copy the idea. Whether the method lasts when the novelty goes is another question.",
      passRatio: 0.8,
      questions: [
        {
          q: "The word 'address' in paragraph 1 is closest in meaning to ______.",
          options: ["write down", "deal with", "speak to", "put off"],
          answer: 1,
          explain: "address a problem that had been ignored for years（处理一个被忽视多年的问题）——这里的 address 是「着手处理、解决」，不是「地址」，也不是「对……讲话」。「对……讲话」要用 address a meeting / address the audience，宾语是人或会议，而这里宾语是 problem。判断熟词僻义的第一招：看宾语是什么。"
        },
        {
          q: "The word 'novel' in paragraph 2 is closest in meaning to ______.",
          options: ["based on a story", "well known", "expensive", "new and unusual"],
          answer: 3,
          explain: "The first idea was a novel one. 这里的 novel 是形容词，作表语，意思是「新颖的、不寻常的」；如果是「小说」，它就该作名词，而且这句话也讲不通。文章最后一段的 the novelty goes（新鲜感过去）也印证了这层意思。看词性，是区分 novel（小说 / 新颖的）最快的方法。"
        },
        {
          q: "'The practice has divided the staff' — the word 'practice' here means ______.",
          options: ["a usual way of doing things", "a training session", "a legal document", "a medical office"],
          answer: 0,
          explain: "practice 在这里指前面描述的那种做法：让普通人来挑选展品、给每件展品配一段个人说明。它是「惯例、做法」的意思，作不可数或可数名词均可。B 项是「练习、训练」，C 项是「（律师）业务」，D 项是「诊所」——三个都是 practice 的常见义项，但都套不进上下文。"
        },
        {
          q: "'There is a fine line between making a collection friendly and making it silly' — the word 'fine' here means ______.",
          options: ["punishment", "of good quality", "very thin", "in good health"],
          answer: 2,
          explain: "a fine line between A and B 是固定说法，意思是「A 和 B 之间只有一线之隔」，fine 在这里是「细的、细微的」。A 项是名词「罚款」，B 项「优质的」，D 项「身体好的」，三者都不能修饰 line 来表达「界限微妙」这层意思。"
        },
        {
          q: "In the critic's sentence 'I appreciate why the museum has changed', the word 'appreciate' means ______.",
          options: ["be grateful for", "understand", "increase in value", "enjoy the taste of"],
          answer: 1,
          explain: "appreciate 后面接 why 从句时，意思是「理解、明白（原因）」，全句是「我明白博物馆为什么要改变，但一台气味机就过头了」。若按「感激」理解，就要有「感激的对象」，而 why 从句交代的是原因，不是恩惠；C 项「升值」是它作不及物动词时的意思，与这里无关。"
        },
        {
          q: "'Whether the method lasts when the novelty goes is another question' — the word 'lasts' means ______.",
          options: ["is placed at the end", "is delayed", "is the most recent", "continues to work over time"],
          answer: 3,
          explain: "last 在这里是动词，意思是「持续、维持下去」，全句是「等新鲜感过去之后，这种方法还能不能维持下去，是另一个问题」。A、C 都是 last 作形容词或副词时的意思（最后的、最近的），B 项「被推迟」是 delay 的意思。判断熟词僻义时，先看它在句中作谓语还是修饰语。"
        }
      ]
    },
    {
      id: 413,
      title: "真实材料：英文邮件与通知",
      minutes: 15,
      gist: "邮件和通知不考修辞，只考四个关键点：时间、地点、人物、要做什么。",
      lesson: "真实材料（邮件、通知、公告）的读法，和考试阅读不太一样：它们不考修辞，只考「谁要做什么、什么时候、在哪里、带什么」。做法：\n① 先扫结构，不逐字读：邮件先看 From / To / Subject 三行，通知先看标题和第一句——主题往往就在这里。\n② 抓四类信息：时间（日期、截止时间）、地点、人物（谁负责、回复给谁）、动作（要带什么、要做什么）。用笔一次圈完，再答题。\n③ 特别留意两类句子：祈使句（Please bring… / Reply before…）和条件句（If you can no longer attend…）——任务型材料里，这两类句子几乎一句对应一道题。\n④ 数字陷阱：一封邮件里常有好几个日期（活动日期、回复截止日期、材料截止日期），答题时先看清题干问的是哪一个。\n这套读法在职场上天天用：收到英文会议邀请、供应商通知、学校公告，两分钟抓到四个关键点，比逐字翻译快得多，也不容易漏事。",
      usage: "收到英文会议邀请、客户通知、学校公告时，两分钟内抓到时间、地点、人物、动作，直接照着安排自己的日程。",
      takeaways: [
        "先看 From / To / Subject 或标题，快速定主题",
        "只抓四类信息：时间、地点、人物、动作",
        "祈使句和条件句几乎句句是考点",
        "一封邮件里多个日期，先看清题干问哪一个"
      ],
      type: "read",
      taskTitle: "邮件与通知阅读",
      taskCopy: "下面是一封会议邮件和一份图书馆通知（可点音频听朗读）。6 道题，答对 5 题（80%）即可通关。",
      passageLabel: "邮件与通知",
      passageTag: "真实材料",
      passage: "From: Anna Whitfield, Conference Office\nTo: All registered participants\nSubject: Change of venue and what to bring on the day\n\nDear participant,\n\nThank you for registering for the Northfield Teaching Conference on Saturday 14 November. I am writing to confirm two changes.\n\nFirst, the venue has moved. The conference will now be held in Harrow Hall on the west campus, not in the Business School as we said in September. Harrow Hall is a ten-minute walk from the main gate, and a map is attached.\n\nSecond, please bring your own laptop. The workshop on classroom technology runs from 11:30 am to 1:00 pm and involves building a short online quiz. Computers will not be provided, and the wi-fi password will be given to you at the registration desk.\n\nRegistration opens at 9:00 am and the first talk begins at 9:30 am. Coffee and lunch are included, but please tell us before 10 November if you have any special dietary needs.\n\nIf you can no longer attend, reply to this email before Friday so that we can offer your place to someone on the waiting list. Places are limited, and the waiting list is long this year.\n\nI look forward to seeing you on the 14th.\n\nKind regards,\nAnna Whitfield\nConference Office\n\n----------------\n\nLIBRARY NOTICE\nWeekend opening hours in November\n\nBecause of building work on the second floor, the library will open at 10:00 am on Saturdays and Sundays during November instead of 8:30 am. The ground-floor reading room and the self-service machines are not affected, and they will stay open until 10:00 pm as usual.\n\nBooks borrowed before 1 November may be kept for six weeks. Please use the returns box outside the main door when the library is closed.\n\nWe apologise for the noise and thank you for your patience.\nLibrary Services",
      audio: [
        {
          file: "413-1.mp3",
          label: "会议邮件朗读",
          voice: "女声",
          hint: "听的时候抓两个 change 和一个 deadline",
          transcript: "Dear participant,\n\nThank you for registering for the Northfield Teaching Conference on Saturday 14 November. I am writing to confirm two changes.\n\nFirst, the venue has moved. The conference will now be held in Harrow Hall on the west campus, not in the Business School as we said in September. Harrow Hall is a ten-minute walk from the main gate, and a map is attached.\n\nSecond, please bring your own laptop. The workshop on classroom technology runs from 11:30 am to 1:00 pm and involves building a short online quiz. Computers will not be provided, and the wi-fi password will be given to you at the registration desk.\n\nRegistration opens at 9:00 am and the first talk begins at 9:30 am. Coffee and lunch are included, but please tell us before 10 November if you have any special dietary needs.\n\nIf you can no longer attend, reply to this email before Friday so that we can offer your place to someone on the waiting list. Places are limited, and the waiting list is long this year.\n\nI look forward to seeing you on the 14th.\n\nKind regards,\nAnna Whitfield\nConference Office"
        },
        {
          file: "413-2.mp3",
          label: "图书馆通知朗读",
          voice: "女声",
          hint: "注意两个时间：几点开门、几点关门",
          transcript: "LIBRARY NOTICE\nWeekend opening hours in November\n\nBecause of building work on the second floor, the library will open at 10:00 am on Saturdays and Sundays during November instead of 8:30 am. The ground-floor reading room and the self-service machines are not affected, and they will stay open until 10:00 pm as usual.\n\nBooks borrowed before 1 November may be kept for six weeks. Please use the returns box outside the main door when the library is closed.\n\nWe apologise for the noise and thank you for your patience.\nLibrary Services"
        }
      ],
      audioTip: "先裸听一遍做题，再点「显示原文」核对自己漏掉了哪个关键点（时间 / 地点 / 人物 / 动作）。",
      passRatio: 0.8,
      questions: [
        {
          q: "Why is Anna Whitfield writing this email?",
          options: [
            "To confirm two changes to the conference arrangements",
            "To cancel the conference",
            "To invite people to join the waiting list",
            "To ask participants to pay for lunch"
          ],
          answer: 0,
          explain: "邮件第三句：I am writing to confirm two changes.（我来确认两处变更。）后面两段正好是 First… Second… 两处变更（地点、自带电脑）。英文邮件的写作目的通常就在开头一两句，先读这一段，能省下大量时间。B、C、D 原文都没有依据。"
        },
        {
          q: "Where will the conference now be held?",
          options: ["In the Business School", "In Harrow Hall on the west campus", "At the main gate", "In the town library"],
          answer: 1,
          explain: "邮件：The conference will now be held in Harrow Hall on the west campus, not in the Business School as we said in September。B 正确，A 是被 not 否定的旧地点——变更类邮件里，旧信息几乎一定会被用来做干扰项，看到 not / instead of 就把旧信息划掉。"
        },
        {
          q: "What should participants bring to the technology workshop?",
          options: ["A printed map", "A conference ticket", "Their own laptop", "A wi-fi password"],
          answer: 2,
          explain: "邮件：Second, please bring your own laptop … Computers will not be provided。祈使句 please bring… 直接给出动作要求，题目问「带什么」，答案就是 laptop。D 项要小心：wi-fi 密码是在签到台领取的（will be given to you at the registration desk），不是要自己带的。"
        },
        {
          q: "Why does the office ask people who cannot attend to reply before Friday?",
          options: [
            "So that lunch can be cancelled",
            "So that the venue can be changed",
            "So that their laptop can be lent out",
            "So that their place can be offered to someone else"
          ],
          answer: 3,
          explain: "邮件：reply to this email before Friday so that we can offer your place to someone on the waiting list。so that 引出目的，答案紧跟其后。A、B、C 三项都是邮件里出现过的其他信息（午餐、场地、电脑），但都不是「提前回复」的目的——任务型阅读的干扰项，常常就是从原文别处搬来的真信息。"
        },
        {
          q: "According to the notice, why will the library open later at weekends in November?",
          options: [
            "Because of building work on the second floor",
            "Because of a shortage of staff",
            "Because the reading room is closed",
            "Because the self-service machines are being repaired"
          ],
          answer: 0,
          explain: "通知第一句：Because of building work on the second floor, the library will open at 10:00 am … instead of 8:30 am。原因就是二楼施工。C、D 与原文相反——通知明确说阅览室和自助设备不受影响（are not affected）；B 是无依据选项。"
        },
        {
          q: "Where should books be returned when the library is closed?",
          options: [
            "At the registration desk",
            "On the second floor",
            "In the returns box outside the main door",
            "At the self-service machines"
          ],
          answer: 2,
          explain: "通知：Please use the returns box outside the main door when the library is closed。when 从句交代的正是「闭馆时」这个条件，与题干完全对应。A、B、D 都是通知或邮件里出现过的地点词，属于把别处信息搬来当干扰项。"
        }
      ]
    },
    {
      id: 414,
      title: "限时训练：一篇仔细阅读 8 分钟",
      minutes: 15,
      timeLimit: 12,
      gist: "按真题强度限时做一篇：读题干 1.5 分钟、读文章 3 分钟、做题 3.5 分钟，单题超过 90 秒就猜一个往前走。",
      lesson: "这一关按真题强度来：一篇 300 词左右的仔细阅读加 5–6 道题，给自己 8 分钟。时间这样切：\n· 0:00–1:30 读题干（不看选项），圈关键词，预判文章讲什么；\n· 1:30–4:30 读文章：首段和每段第一句慢读，细节快读，遇到 however / therefore / in fact 停下来；\n· 4:30–8:00 做题：一题一题回原文定位，找不到依据的选项直接排除；不确定的题先标记，最后再回来。\n三条止损规则：\n① 单题超过 90 秒，就猜一个并标记，不要卡住后面四道题；\n② 两题之间不要反复改答案，除非你回原文找到了明确依据；\n③ 留 30 秒检查有没有漏答——四级不倒扣分，空着一题就是白丢 14.2 分。\n做完这一关，用同样的流程再限时做一篇。能稳定在 8 分钟内完成，阅读部分就不会崩盘。\n做完之后请对照解析，把每道题的「答案依据句」在原文里划出来——复盘定位过程，比多做一篇更涨分。",
      usage: "在限时压力下保持定位准确，和职场上「半小时内读完一份英文材料并回答问题」是同一项能力。",
      takeaways: [
        "先读题干 1.5 分钟，再读文章 3 分钟，做题 3.5 分钟",
        "单题超过 90 秒就猜一个并标记，继续往前走",
        "找到依据才改答案，凭感觉改通常改错",
        "复盘时把每道题的答案依据句划出来"
      ],
      type: "read",
      taskTitle: "8 分钟限时仔细阅读",
      taskCopy: "本关有 12 分钟倒计时（答题 + 看解析），请把读材料和做题控制在 8 分钟内；对照解析时，把每题的依据句在原文里划出来。答对 5 题（80%）即可通关。",
      passageLabel: "阅读材料",
      passageTag: "限时 · 真题强度",
      passage: "On the first Saturday of every month, the church hall in the small town of Ashby fills with broken things: bicycles with loose wheels, lamps that will not switch on, a food mixer that has been silent for two years. Along the tables sit volunteers with toolboxes — a retired electrician, two bicycle mechanics, a woman who has repaired sewing machines since she was sixteen. Nothing is sold here, and the volunteers are not allowed to accept money.\n\nThe first repair café opened in Amsterdam in 2009. There are now more than three thousand of them worldwide, and the idea has spread fastest in countries where people move house often and throw away rather than carry. The rules are the same everywhere: you must stay with your object while it is repaired, and you must watch what the volunteer does. The point is not only to save a lamp; it is to show that a lamp can be saved.\n\nThe numbers are modest but telling. An average café repairs around seventy per cent of what is brought in, and each repair keeps roughly two kilograms of material out of the bin. Supporters argue that this is a small answer to a large problem: the United Kingdom alone throws away about a million tonnes of electrical goods a year, and much of it could be repaired.\n\nNot everything can be fixed. Modern phones and laptops are glued together, and parts for them may cost more than a new machine. Some manufacturers have made repair deliberately difficult, and campaigners have begun to push for laws that would require them to publish repair instructions and sell spare parts for ten years after a product is last sold. The volunteers in Ashby are not waiting for those laws. Their advice to visitors is simple: bring it in, and we will see.",
      passRatio: 0.8,
      questions: [
        {
          q: "What is one of the rules of a repair café?",
          options: [
            "Visitors must pay a small fee.",
            "Visitors must stay and watch the repair.",
            "Visitors must bring their own tools.",
            "Only electrical goods are accepted."
          ],
          answer: 1,
          explain: "第二段：you must stay with your object while it is repaired, and you must watch what the volunteer does。B 正确。A 与第一段 Nothing is sold here, and the volunteers are not allowed to accept money 相反；C 与 the volunteers with toolboxes 矛盾（工具是志愿者带的）；D 原文没有限制范围（自行车、台灯、搅拌机都在修）。"
        },
        {
          q: "Where did the first repair café open?",
          options: ["In Amsterdam", "In Ashby", "In London", "In the United Kingdom"],
          answer: 0,
          explain: "第二段首句：The first repair café opened in Amsterdam in 2009。题干问的是第一家在哪里，答案是阿姆斯特丹。Ashby 是文中这座小镇，是故事发生地，不是发源地；United Kingdom 只在第三段讲电子垃圾时出现——地点题的干扰项常常是「文中出现过的另一个地名」。"
        },
        {
          q: "What do the figures in paragraph 3 suggest?",
          options: [
            "Most objects brought in cannot be repaired.",
            "Electrical waste has fallen by a million tonnes.",
            "Each visitor saves two kilograms of material.",
            "Repair cafés make a small but meaningful contribution."
          ],
          answer: 3,
          explain: "第三段先说 The numbers are modest but telling（数字不大，却很说明问题），接着说这是一次 a small answer to a large problem：英国一年扔掉约一百万吨电器，其中大部分本可以修。所以这些数字说明的是「贡献虽小但有意义」。A 与 seventy per cent 相反；B 把「扔掉一百万吨」说成「减少了一百万吨」；C 偷换了主语——是每次维修省下约两公斤，不是每位访客。"
        },
        {
          q: "Why are some modern phones and laptops difficult to repair, according to the passage?",
          options: [
            "Their owners do not bring them in.",
            "They are glued together and parts are expensive.",
            "Volunteers refuse to work on them.",
            "They are too old to be repaired."
          ],
          answer: 1,
          explain: "第四段：Modern phones and laptops are glued together, and parts for them may cost more than a new machine。B 是原句的概括。下一句 Some manufacturers have made repair deliberately difficult 说明还有厂商刻意为之的因素，但 A、C、D 都不是文中给出的原因（志愿者并没有拒绝，也不存在「太旧」这个理由）。"
        },
        {
          q: "What are campaigners asking manufacturers to do?",
          options: [
            "To sell spare parts for ten years and publish repair instructions",
            "To stop making phones and laptops",
            "To open their own repair cafés",
            "To give old machines to volunteers"
          ],
          answer: 0,
          explain: "第四段：campaigners have begun to push for laws that would require them to publish repair instructions and sell spare parts for ten years after a product is last sold。them 指 manufacturers，两项要求与 A 完全对应。B、C、D 都是无依据选项，属于「听起来像是环保做法，但文章没提」。"
        },
        {
          q: "Which of the following best describes the passage?",
          options: [
            "An argument that repair cafés can replace shops",
            "A guide to repairing a bicycle at home",
            "A report on a growing movement and the limits it faces",
            "A history of electrical waste in the United Kingdom"
          ],
          answer: 2,
          explain: "全文先说维修咖啡馆的场景与规则，再给规模与数据，最后落到「不是所有东西都修得了」和正在推动的立法——既有「运动在壮大」，也有「它面临的限制」，所以 C 概括得最全。A 太绝对（文章没有说它能取代商店）；B 太窄（自行车只是开头的一个例子）；D 只覆盖第三段的一个数据。"
        }
      ]
    }
  ]
});