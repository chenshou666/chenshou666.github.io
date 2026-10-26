/* =====================================================================
 * HT Lab · 英语四级课程 · 模块 6：全真模考（2 关）
 * 关卡数据文件（每个模块一个文件，互不干扰）
 * 字段说明：
 *   id            关卡号（模块 6 = 7xx）
 *   type          listen | read | write | translate | speak | mock
 *   audio         [{file,label,voice,hint,transcript}]  音频放 ./audio/cet4/
 *   questions     [{q,options,answer,explain}]          answer 为正确选项下标（从 0 起）
 *   timeLimit     模考倒计时（分钟），页面会显示剩余时间
 *   passRatio     客观题通关线（0.6 = 答对 60%）
 *   points        写作/翻译的必含要点：["关键词",...]，同组内任一命中即可
 * ===================================================================== */
window.CET4_MODULES = window.CET4_MODULES || [];
window.CET4_MODULES.push({
  id: "m6",
  name: "模块 6 · 全真模考",
  levels: [
    {
      id: 701,
      title: "全真模考（一）：听力 + 阅读",
      minutes: 60,
      gist: "4 段听力 + 2 篇阅读，25 题一次做完，倒计时 70 分钟，按答对率判分。",
      lesson: "本关是一次完整的“听力 + 阅读”模考：25 题、倒计时 70 分钟，节奏与考场一致（听力约 25 分钟 + 阅读约 40 分钟 + 检查）。听力和阅读合计占四级 70% 的分值，这两块练顺了，425 分就拿到了一半以上。\n\n【考场时间分配表（70 分钟）】\n① 0–3 分钟：抢读四段听力的选项，圈出重复出现的词，预判场景（校园约定、课程申请、课堂讲座、城市新闻）。\n② 3–26 分钟：听力作答（15 题）。四级听力一共 25 题、只播一遍，每段之间不留答题时间，所以必须“边听边选”，不要等音频结束再回头找。\n③ 26–48 分钟：仔细阅读 6 题。先看题干划关键词，再回原文定位；答案一定是原文某一句的同义替换，不是照抄。\n④ 48–62 分钟：科普短文 4 题。先读首段和每段首句，抓住“它是什么、有什么用、代价是什么”三件事，再回原文找细节。\n⑤ 62–70 分钟：检查。只复查“拿不准”的题，不要重读全文——模考交卷后才给答案，检查时只复查「拿不准」的题，不要重读全文（时间不够）。\n\n【题型说明】自 2016 年 6 月考次起，四级听力不再有单独的「短对话」，现行结构是短篇新闻 3 段 7 题 + 长对话 2 篇 8 题 + 听力篇章 3 篇 10 题。本关把对话理解作为热身保留，重点仍在长对话、篇章与新闻。\n\n【三条考场铁律】\n① 听力：but / however / actually / in fact 之后几乎必出答案；数字题先听清题目问的是“全部”还是“部分”（六周的课程、只参加三周）。\n② 阅读：正确项很少照抄原文，而是换一种说法（output had not fallen at all → stayed the same）；照抄原文原词的选项反而常常是陷阱。\n③ 主旨题看首末段和反复出现的词；态度题抓住作者的让步词（careful not to promise too much、however、even so）——作者主动承认了限制，态度就是“认可，但谨慎”。\n\n本关的答案解析写得比平时短，只点“依据在哪、陷阱在哪”；考场上你没有时间读长解析，训练的是自己回原文找依据的习惯。",
      usage: "这套节奏直接对应真实场景：开会前先看议程再听人讲，面试前先读职位描述再去面谈，出国前先看机场指示牌再找登机口——先预判、再定位，永远比从头到尾硬听硬读省力。",
      takeaways: [
        "考场顺序：听力约 25 分钟 → 阅读约 40 分钟；四级听力 25 题只播一遍，必须边听边选",
        "听力答案多落在转折词之后；数字题先分清问的是全部还是部分",
        "阅读正确项多为同义替换，照抄原文的选项要警惕",
        "主旨看首末段，态度看让步词（careful not to promise too much / however / even so）",
        "本关 25 题答对 15 题（60%）通关；考场目标应定在 70% 以上"
      ],
      type: "mock",
      timeLimit: 70,
      audioTip: "音频可以重听（练耳用），但请按考场要求先裸听一遍就作答；做完再点「显示原文」逐句复盘，把没听出来的地方标出来跟读两遍。",
      taskTitle: "模考（一）· 听力 + 阅读",
      taskCopy: "按考场顺序排题：听力 15 题（对话理解 3 + 长对话 5 + 篇章 4 + 新闻 3）→ 阅读 10 题（仔细阅读 6 + 科普短文 4）。交卷前可以随时改答案，交卷后一次性给出对错与解析。答对 15 题（60%）即通关；想稳过 425 分，平时要按 70% 要求自己。",
      passRatio: 0.6,
      audio: [
        {
          file: "701-1.mp3",
          label: "听力 1 · 对话理解",
          voice: "女声 + 男声",
          hint: "预判：这是关于“去不去某个活动”的约定，注意原因和时间",
          transcript: "W: Hi Tom, are you coming to the career talk this afternoon?\nM: I was planning to, but I've got a lab report due tomorrow morning.\nW: Can you finish it tonight?\nM: I don't think so. I still have to run the last two experiments, and the lab closes at eight.\nW: Then why not go to the ten o'clock session on Thursday? It's the same speaker.\nM: Good idea. I'll check whether there are still seats, and I'll send you the sign-up link."
        },
        {
          file: "701-2.mp3",
          label: "听力 2 · 长对话",
          voice: "女声 + 男声",
          hint: "预判：学生向老师咨询暑期课程，重点听截止日期、时长、工作内容和要求",
          transcript: "W: Good morning, Dr Bennett. I'd like to ask about the summer field course in Scotland.\nM: Morning. Applications closed last Friday, I'm afraid, but we do keep a waiting list.\nW: I only saw the notice yesterday — I was away at my sister's wedding.\nM: That's all right. How many weeks would you like to join for? The course runs for six weeks, but you can come for the last three.\nW: Three weeks would suit me. I'm going home in August.\nM: Fine. One thing to remember: the last three weeks are spent at the coast, so you'll need waterproof clothing.\nW: Noted. What kind of work would I be doing?\nM: Mostly counting seabirds and recording what they eat. You'll work in pairs, and one of the pair has to be able to read a map, because we walk a long way from the road.\nW: I did a map-reading course last year, so that should be fine.\nM: Good. And you'll need to be up before six most mornings, because that is when the birds are active.\nW: Before six? That will take some getting used to.\nM: Everyone says that in the first week. The good news is that the afternoons are free, and the food and the equipment are all included in the course fee.\nW: That's helpful. Is there anything I should do now?\nM: Send me a short email saying why you'd like to join, and I'll put your name on the list. Two students usually drop out before the course starts.\nW: Great — I'll write it this evening. Thank you."
        },
        {
          file: "701-3.mp3",
          label: "听力 3 · 篇章",
          voice: "女声",
          hint: "预判：一段关于学习方法的讲座，先听结论，再听理由",
          transcript: "A recent study has looked at what happens when students take notes by hand and when they take notes on a laptop. The researchers asked students to watch the same short lecture, and then tested them on what they had understood.\nThe students who typed wrote far more words — in some cases almost everything the speaker said — while those who wrote by hand wrote about a third less. That did not matter when the test asked for simple facts: on those questions, the two groups did about the same. It mattered a great deal when the test asked students to explain ideas. There, the handwriting group did clearly better.\nThe researchers think the reason is not the pen itself. When you write by hand, you cannot keep up with the speaker, so you have to decide what matters and put it in your own words. Typing, by contrast, invites you to copy the lecture word for word without ever deciding what is important.\nOne detail is worth remembering. When the students with laptops were told, before the lecture, not to write everything down, the two groups performed almost the same. In other words, the machine is not the problem; the way we use it is. The researchers suggest that students who take a laptop to a lecture should treat it as a tool for thinking, not as a machine for recording."
        },
        {
          file: "701-4.mp3",
          label: "听力 4 · 新闻",
          voice: "女声",
          hint: "预判：一条城市新闻，听“决定了什么、钱从哪来、还提供什么服务”",
          transcript: "A city in the north of England is to keep its libraries open until nine in the evening from next month. The decision follows a six-month trial, during which evening visits by students and by people who work late rose sharply. The city council says the longer hours will be paid for by a small increase in parking charges, and that the money for new books will not be touched. Library staff will also run free classes in basic computer skills twice a week. A council spokesperson said the aim was to make the library “the warmest and quietest room in the neighbourhood”. The council expects more than twenty thousand extra visits over the coming year."
        }
      ],
      passageLabel: "阅读材料（听力之后再做）",
      passageTag: "模考阅读 · 两篇",
      passage: "【第一篇 · 仔细阅读】（6 题）\nA shorter week, the same pay\n\nWhen a software company in the south of England told its forty employees that they would move to a four-day week without any cut in pay, the managers expected output to fall. Six months later, it had not fallen at all: the company was completing the same amount of work, and its customers had not noticed any difference.\n\nThe company is one of more than sixty that have taken part in a six-month trial of the four-day week. The results, published last week, show that most of the firms decided to keep the shorter week after the trial ended. Only a handful gave it up, and in most of those cases the reason was not falling productivity but the difficulty of organising shifts in factories and hospitals, where someone must be on duty every hour of the day.\n\nSo where did the extra day come from? The report points to three changes. First, meetings became shorter and fewer: one firm cut its weekly management meeting from two hours to thirty minutes, and another banned meetings on Wednesdays altogether. Second, staff were given more freedom to work when they were most productive, instead of being expected to sit at a desk from nine to five. Third, and perhaps most important, managers began to ask a simple question before starting a new project: what should we stop doing instead?\n\nThe authors of the report are careful not to promise too much. Most of the firms in the trial were small, and almost all of them worked with information rather than with machines. A hospital cannot close a ward on Friday, and a supermarket cannot serve its customers with fewer people on the shop floor. For these workplaces, the report suggests, shorter shifts and more flexible hours may be a more realistic aim than a four-day week. Even so, the trial offers one clear lesson: before asking how to fit five days of work into four, it is worth asking which of those five days was not really needed.\n\n【第二篇 · 科普短文】（4 题）\nTrees as air conditioning\n\nOn a hot afternoon, the temperature on a street lined with trees can be five degrees lower than on a bare street a hundred metres away. Part of the difference is simple shade, but trees do more than block sunlight. Through their leaves they release water vapour, and this cools the air around them in the same way that sweating cools the human body.\n\nCity planners have begun to treat trees as a piece of infrastructure rather than as decoration. In Melbourne, researchers mapped every tree in the city centre and gave each one an email address so that residents could report problems; the project also produced the first detailed picture of which streets had almost no shade at all. The map showed what older residents already knew: the hottest streets were usually the poorest ones, where there was little space for planting.\n\nPlanting trees, however, is not a quick fix. A young tree may take fifteen years to provide the shade of a mature one, and in a dry city it needs water for years before it can survive on its own. Trees also need space: roots break pavements, and branches can block signs and street lights. Some cities have therefore started to plant smaller species along narrow streets, and to use light-coloured surfaces, which reflect sunlight instead of storing heat.\n\nNone of these measures works on its own. But together with shade and water, they can lower the temperature of a whole neighbourhood — not by changing the climate, but by making the hottest hours of a summer day easier to live through.",
      questions: [
        {
          q: "【听力 1 · 对话理解】Why can't the man go to the career talk this afternoon?",
          options: ["He has to give a talk himself.", "He has a lab report to finish.", "He will be away at a meeting.", "He could not get a seat."],
          answer: 1,
          explain: "依据是男士那句 “I was planning to, but I've got a lab report due tomorrow morning.” —— due tomorrow morning 就是“明早要交”，所以他今天下午去不了。D 是拿结尾的 seats（座位）设的陷阱，那说的是周四那一场；A、C 音频里完全没有依据。"
        },
        {
          q: "【听力 1 · 对话理解】What is stopping the man from finishing his report tonight?",
          options: ["His laptop has stopped working.", "He has to help a classmate with her report.", "He has not finished reading the course book.", "He has to run two more experiments."],
          answer: 3,
          explain: "女士问 “Can you finish it tonight?”，男士答 “I don't think so. I still have to run the last two experiments, and the lab closes at eight.” —— 做不完的原因就是还有两个实验要做，实验室八点关门。A、B、C 音频里都没有依据。"
        },
        {
          q: "【听力 1 · 对话理解】What does the woman suggest the man should do?",
          options: ["Go to the Thursday session instead.", "Ask the speaker for more time.", "Watch a recording of the talk.", "Ask his teacher to change the deadline."],
          answer: 0,
          explain: "女士用 “Then why not go to the ten o'clock session on Thursday? It's the same speaker.” 提出建议——why not … 是听力里最常见的建议句式。B、C、D 音频都没有提到；顺便记住：正确选项只说 “the Thursday session”，没有自己加 “morning” 这类原文没有的信息。"
        },
        {
          q: "【听力 2 · 长对话】What is the woman's problem at the beginning of the conversation?",
          options: ["She cannot afford the course fee.", "She has missed the first week of the course.", "She has missed the application deadline.", "She does not have the right clothing for the course."],
          answer: 2,
          explain: "男士开门见山：“Applications closed last Friday, I'm afraid.” —— 申请上周五就截止了，这正是女士的麻烦。D 是拿后文 “you'll need waterproof clothing” 设的陷阱：男士只是提醒课程后三周在海边、要带防雨衣物，并不是说她现在缺衣服。"
        },
        {
          q: "【听力 2 · 长对话】Why did the woman not apply before the deadline?",
          options: ["She was away at a family wedding.", "She was waiting for her exam results.", "She thought the course cost too much.", "She had been told to wait for a place on the list."],
          answer: 0,
          explain: "女士解释 “I only saw the notice yesterday — I was away at my sister's wedding.” —— sister's wedding（姐妹的婚礼）就是 family wedding 的同义替换，这是听力里最常见的换说法。B、C、D 音频都没有提到。"
        },
        {
          q: "【听力 2 · 长对话】How long does the whole course last?",
          options: ["Two weeks.", "Three weeks.", "Four weeks.", "Six weeks."],
          answer: 3,
          explain: "男士说 “The course runs for six weeks, but you can come for the last three.” —— 整个课程六周，女士可以只参加最后三周。题目问的是“整个课程”，所以是六周；三周是典型的“听到什么选什么”陷阱，数字题一定要先听清题目问的是全部还是部分。"
        },
        {
          q: "【听力 2 · 长对话】What does the man ask the woman to do?",
          options: ["Pay a deposit before Friday.", "Send him a short email about why she wants to join.", "Find the two students who are leaving the course.", "Take a test before the course begins."],
          answer: 1,
          explain: "男士说 “Send me a short email saying why you'd like to join, and I'll put your name on the list.” —— 写一封短信说明想参加的理由。C 是拿后文 “Two students usually drop out” 设的陷阱：那是男士说明候补名单通常能排上，并不是让她去找那两个学生。"
        },
        {
          q: "【听力 2 · 长对话】What does the man say will be difficult for the woman at first?",
          options: ["Working in pairs with someone she does not know.", "Reading a map on the coast.", "Cooking for the other students.", "Getting up early in the morning."],
          answer: 3,
          explain: "男士说 “you'll need to be up before six most mornings”，女士的反应是 “Before six? That will take some getting used to.”，男士又补了一句 “Everyone says that in the first week.” —— 三句合起来说明“早起”是她一开始会觉得难的事。B 正相反：女士说自己去年上过地图课，所以看地图对她是容易的；A、C 原文没有依据。"
        },
        {
          q: "【听力 3 · 篇章】What is the talk mainly about?",
          options: ["Why university lectures are getting shorter.", "How to choose a laptop for university study.", "How the way students take notes affects their learning.", "Why some students dislike writing by hand."],
          answer: 2,
          explain: "整段材料都在讲一项研究：手写笔记和用电脑记笔记对学习效果的不同影响，最后落到“机器不是问题，用法才是”。A、B、D 都是拿材料里的零散词（lecture / laptop / writing by hand）拼出来的干扰项，罩不住全文——主旨题要选覆盖面最大的那一项。"
        },
        {
          q: "【听力 3 · 篇章】What did the study find about the students who took notes by hand?",
          options: ["They remembered more simple facts.", "They wrote more words than the other group.", "They did worse on the questions about facts.", "They explained ideas better than the other group."],
          answer: 3,
          explain: "材料原句：“That did not matter when the test asked for simple facts: on those questions, the two groups did about the same. It mattered a great deal when the test asked students to explain ideas. There, the handwriting group did clearly better.” —— 事实题两组差不多，解释观点题手写组明显更好。A 和 C 都错在“事实题”上，B 与原文相反（手写的人少写了大约三分之一）。"
        },
        {
          q: "【听力 3 · 篇章】According to the researchers, why did the handwriting group do better on ideas?",
          options: ["Writing by hand forces students to decide what matters.", "Handwritten notes are easier to read again later.", "Handwriting is less tiring than typing for most students.", "Students who write by hand prepare better before a lecture."],
          answer: 0,
          explain: "原文给的是因果链：“When you write by hand, you cannot keep up with the speaker, so you have to decide what matters and put it in your own words.” —— 手写跟不上速度，所以必须自己判断哪些内容重要、并用自己的话记下来。B、C、D 听起来都合理，但材料里一句支持都没有，属于“常识型干扰项”。"
        },
        {
          q: "【听力 3 · 篇章】What happened when the laptop users were told not to write everything down?",
          options: ["They wrote fewer words but still did worse.", "They performed almost as well as the handwriting group.", "They asked to switch to writing by hand.", "They stopped taking notes altogether."],
          answer: 1,
          explain: "原文：“When the students with laptops were told, before the lecture, not to write everything down, the two groups performed almost the same.” —— 一旦不逐字照抄，两组成绩几乎一样。这句也是全段的结论：the machine is not the problem; the way we use it is."
        },
        {
          q: "【听力 4 · 新闻】What is the news mainly about?",
          options: ["A rise in parking charges in a northern city.", "Free computer classes for people looking for work.", "A new library building in the north of England.", "Longer opening hours at a city's libraries."],
          answer: 3,
          explain: "新闻第一句就是主旨：“A city in the north of England is to keep its libraries open until nine in the evening from next month.” —— 图书馆延长开放到晚上九点。停车费上涨、免费电脑课都是这条新闻里的细节；B 还把电脑课说成“为找工作的人开设”，新闻没有这个信息；C 的“新建图书馆”新闻根本没提。"
        },
        {
          q: "【听力 4 · 新闻】How will the longer opening hours be paid for?",
          options: ["By closing some smaller libraries.", "By cutting the money spent on new books.", "By a small increase in parking charges.", "By charging students for evening visits."],
          answer: 2,
          explain: "新闻原句：“The city council says the longer hours will be paid for by a small increase in parking charges, and that the money for new books will not be touched.” —— 靠小幅提高停车费，而且明确说不动买书的钱，所以 B 正好说反了。A、D 新闻都没有提。"
        },
        {
          q: "【听力 4 · 新闻】What else will library staff do in the evening?",
          options: ["Give free classes in basic computer skills.", "Read stories to children every evening.", "Keep a reading room open for exam students.", "Collect books that are returned late."],
          answer: 0,
          explain: "新闻原句：“Library staff will also run free classes in basic computer skills twice a week.” —— run classes 就是“开课”，与选项的 give classes 同义。其余三项都是拿图书馆的常见服务编出来的，新闻里没有依据。"
        },
        {
          q: "【阅读 · 第一篇】What is the passage mainly about?",
          options: ["Why factories and hospitals cannot shorten their working week.", "How employees spend the extra day they gain.", "What a trial of the four-day week found and where the saved time came from.", "Why small companies pay their staff more than large ones."],
          answer: 2,
          explain: "全文结构很清楚：第一、二段讲试验结果（产出没有下降、多数公司决定保留四天工作制），第三段讲省下来的时间从哪来，第四段讲适用范围。A 只是第四段的一个细节，B 全文没写，D 无中生有——主旨题要选能覆盖全文的一项。"
        },
        {
          q: "【阅读 · 第一篇】What happened to the company's output after it moved to a four-day week?",
          options: ["It rose sharply.", "It stayed the same.", "It fell slightly.", "It could not be measured."],
          answer: 1,
          explain: "原文：“the managers expected output to fall. Six months later, it had not fallen at all: the company was completing the same amount of work”。had not fallen at all（一点也没下降）与 completing the same amount of work 合起来就是“保持不变”。注意题干问的是实际发生了什么，管理者原本的预期（expected … to fall）是干扰信息。"
        },
        {
          q: "【阅读 · 第一篇】Why did a few firms give up the four-day week?",
          options: ["Their customers complained about the service.", "Their staff asked to return to a five-day week.", "They could not afford to pay the same salaries.", "Shifts were hard to organise in their kind of work."],
          answer: 3,
          explain: "原文：“in most of those cases the reason was not falling productivity but the difficulty of organising shifts in factories and hospitals”。not … but … 把原因明确锁定在“排班困难”——工厂、医院这类地方必须有人全天值班，所以改不了四天。C 的“付不起同样的工资”原文没有依据，A、B 也没有。"
        },
        {
          q: "【阅读 · 第一篇】According to the report, where did most of the saved time come from?",
          options: ["Fewer and shorter meetings, more control over working hours, and dropping unnecessary work.", "Longer working days on the four days that remained.", "Hiring more staff to share the same work.", "Asking customers to wait longer for orders."],
          answer: 0,
          explain: "第三段列了三处变化：“meetings became shorter and fewer”“staff were given more freedom to work when they were most productive”“what should we stop doing instead?” —— 正对应 A 的三点。B、C、D 是“把五天压进四天”最常见的猜测，而原文恰恰说不是这样。"
        },
        {
          q: "【阅读 · 第一篇】What is the authors' attitude towards the four-day week?",
          options: ["They are certain that every workplace can move to a four-day week.", "They doubt whether the trial results are reliable.", "They accept the results but point out how far they can be applied.", "They believe that pay should be reduced when working hours fall."],
          answer: 2,
          explain: "第四段开头就是态度信号：“The authors of the report are careful not to promise too much.” 接着说明试验里的公司大多规模不大、以信息工作为主，医院和超市不能照搬，并建议这类场所改用更短的班次和弹性工时——所以是“认可结果、同时划出适用范围”。A 与 careful not to promise too much 冲突，B、D 原文没有依据。"
        },
        {
          q: "【阅读 · 第一篇】What does the last sentence of the passage suggest?",
          options: ["Employees should be paid less when the week is shorter.", "Firms should first find out whether all their present work is really necessary.", "The four-day week will soon be introduced in every industry.", "Meetings should be banned on Wednesdays in all companies."],
          answer: 1,
          explain: "最后一句：“before asking how to fit five days of work into four, it is worth asking which of those five days was not really needed.” 主干是 it is worth asking …，意思是先别急着压缩时间，先问清楚五天里哪些工作其实没必要——正对应 B。D 是拿第三段某一家公司的做法（banned meetings on Wednesdays）来凑：原文只说“另一家公司”这么做，并不是对所有人的建议。"
        },
        {
          q: "【阅读 · 第二篇】Besides providing shade, how do trees cool the air?",
          options: ["They release water vapour through their leaves.", "They take in heat through their roots.", "They store sunlight in their branches and use it at night.", "They stop hot air from moving between streets."],
          answer: 0,
          explain: "原文：“Through their leaves they release water vapour, and this cools the air around them in the same way that sweating cools the human body.” —— 树叶释放水蒸气，和人体出汗降温是同一个道理。B、C、D 是把树的其他常识（根系、光合作用、挡风）套进来，材料里没有任何依据。"
        },
        {
          q: "【阅读 · 第二篇】What did the map of Melbourne's city centre show?",
          options: ["Older residents had planted most of the city's trees.", "The city centre had more shade than the suburbs.", "Trees with email addresses grew faster than other trees.", "The hottest streets were usually those with the least space for planting."],
          answer: 3,
          explain: "原文：“The map showed what older residents already knew: the hottest streets were usually the poorest ones, where there was little space for planting.” —— little space for planting 与选项里的 least space for planting 是同义替换。A 曲解了 older residents（老居民“早就知道”，不是“种了树”）；C 把“给树建邮箱”这个趣味细节当成了结论。"
        },
        {
          q: "【阅读 · 第二篇】Why does the author say that planting trees is “not a quick fix”?",
          options: ["Because young trees cost more than light-coloured surfaces.", "Because trees cannot survive in a city.", "Because a young tree needs many years before it gives full shade.", "Because residents do not want trees on their streets."],
          answer: 2,
          explain: "第三段紧接着解释：“A young tree may take fifteen years to provide the shade of a mature one” —— 小树要十五年才能提供大树那样的遮阴效果，所以不是立竿见影的办法。所以选 C：小树要十五年才能长到成熟树那样的遮阴效果，种树不是「立竿见影」的办法。A 项原文没有比较过成本；B 项太绝对，原文只说干旱城市的小树要浇好几年水才能自己存活，并不是活不下来；D 项与原文相反，居民是主动报告树木问题的一方。"
        },
        {
          q: "【阅读 · 第二篇】What is the main idea of the passage?",
          options: ["Trees are mainly useful as decoration in city centres.", "Trees can cool a city, but planting them needs long-term planning.", "City streets should be rebuilt without pavements.", "Email projects are the best way to protect city trees."],
          answer: 1,
          explain: "全篇先说树能降温（遮阴 + 蒸腾），再说城市已经把它当基础设施来规划，最后两段讲它的代价与配套措施，结论是“这些措施要合起来用，才能让夏天最热的几个小时好过一些”。A 与原文 “treat trees as a piece of infrastructure rather than as decoration” 相反；C、D 都是把文中的细节（pavements、email address）放大的干扰项。"
        }
      ]
    },
    {
      id: 702,
      title: "全真模考（二）：写作 + 翻译",
      minutes: 60,
      gist: "60 分钟内完成一篇 120–180 词作文和一段 140–160 汉字的翻译，按考场时间分配走。",
      lesson: "本关是模考的第二场：写作 + 翻译，倒计时 60 分钟——考场就是这个节奏，写作 30 分钟、翻译 30 分钟。写作占 15%、翻译占 15%，两题合计 30%，是四块里最容易“练一练就涨分”的部分，因为它们有确定的评分点：结构清楚、要点齐全、错误少。\n\n【考场时间分配表（60 分钟）】\n① 0–3 分钟（写作审题）：读题 + 列三行提纲——我的观点、两条理由、一句结论。\n② 3–25 分钟（写作成文）：按“引出观点 → 理由一（带例子）→ 理由二 → 结论”写四段，每段 3–4 句。\n③ 25–30 分钟（写作检查）：只改三类错误——时态、主谓一致、拼写。\n④ 30–35 分钟（翻译读题）：把中文读两遍，划出主干（谁 + 做什么 + 结果），长句拆成两句。\n⑤ 35–55 分钟（翻译成文）：先写主干，再补修饰；不会的词用简单词替换（“高铁”不会写 high-speed train，就写 fast train）。\n⑥ 55–60 分钟（翻译检查）：名词单复数、冠词、介词——中式英语最常丢分的三处。\n\n【写作四段骨架（背下来，考场上直接套）】\n① 引出：Nowadays, … plays an important part in … / In my view, …\n② 理由一：The first reason is … For example, …\n③ 理由二：The second reason is … What is more, …\n④ 结论：In short, … / Therefore, we should …\n注意：骨架只是架子，每段必须有自己的内容（具体的例子、具体的做法），否则会被判成“空话连篇”。\n\n【翻译三条铁律】\n① 先主干后修饰：中文一句话套三层，英文先写出“主语 + 谓语 + 宾语”，再挂时间、地点、原因。\n② 用有把握的词：翻译考的是准确和通顺，不是炫技；“票价仍然偏高”写 ticket prices are still too high 就够了。\n③ 警惕中式搭配：价格用 high 不用 expensive（The price is high. 但 The ticket is expensive.）；人 spend（花钱），物 cost（值多少钱）。",
      usage: "写作练的是把观点讲清楚，翻译练的是把中文说准确——写英文邮件、做产品介绍、给外国同事解释一段流程，用的都是这两件事：先说结论，再给理由，最后落到一句能执行的话。",
      takeaways: [
        "写作 120–180 词、建议 30 分钟；四段式：引出观点 → 两条理由 → 结论",
        "翻译 140–160 汉字、建议 30 分钟；先译主干，再补修饰",
        "价格用 high 不用 expensive；人 spend，物 cost",
        "交卷前只查四样：时态、主谓一致、名词单复数、冠词",
        "不写没把握的句子——把不会的词换成会写的词，比写错更划算"
      ],
      type: "write",
      timeLimit: 60,
      taskTitle: "模考（二）· 写作 + 翻译",
      taskCopy: "先做上面的 4 道翻译要点选择题（做完立刻给解析），再在下面的作答框里写作文（120–180 词），空一行后接译文（对应 140–160 汉字的中文段落）。检查器会核对结构与要点是否齐全、字数是否达标；建议 30 分钟写作 + 30 分钟翻译。",
      passRatio: 0.6,
      prompt: "【写作 · 建议 30 分钟，120–180 词】\nSome people say that the most important skill a university student can learn is the ability to work with others. Write an essay on the importance of teamwork for college students. Your essay should include: ① your view on the importance of teamwork; ② two reasons, with at least one example; ③ a short conclusion or suggestion.\n\n【翻译 · 建议 30 分钟，140–160 汉字】\n把下面的中文段落译成英文。译文接在作文后面，中间空一行；用词不限，准确、通顺即可。",
      placeholder: "① Essay (120–180 words): In my view, teamwork ... ② Translation: China's high-speed railway ...",
      source: "中国高铁在过去十几年里发展迅速。如今，坐高铁出行已成为许多人的首选：它比飞机便宜，比普通火车快得多，而且车站通常位于市中心。高铁不仅缩短了城市之间的距离，也改变了人们的生活方式——有人住在小城市，却在大城市工作，周末回家只要一个多小时。当然，建设高铁需要巨大的投入，票价对部分人来说仍然偏高。总体而言，它让出行变得更简单，也让更多地方有了发展的机会。",
      minWords: 200,
      points: [
        ["in my view", "in my opinion", "as far as i", "i believe", "from my perspective", "nowadays"],
        ["the first reason", "first of all", "firstly", "to begin with", "one reason", "the main reason"],
        ["for example", "for instance", "such as", "as an example", "my own experience", "last term"],
        ["in short", "in conclusion", "to sum up", "all in all", "in a word", "finally"],
        ["high-speed", "high speed", "bullet train", "railway", "rail"],
        ["price", "prices", "fare", "fares", "ticket"]
      ],
      sample: "【参考范文 · 作文（170 词）】\nTeamwork is a skill that university students will still be using long after they have forgotten the details of a lecture. In my view, learning to work with others matters at least as much as learning to work alone.\nThe first reason is practical. Most jobs are too large for one person: a hospital ward or a newsroom depends on people who can share a task, explain their part clearly and keep their promises. A student who has never worked in a group may finish a report alone, but will struggle on the first day at work.\nThe second reason is personal. Working with others shows us what we do not know. When I prepared a group presentation last term, my partner asked a question I could not answer, and that question taught me more than the reading I had done.\nIn short, teamwork is not a soft skill but a basic one. Students should look for chances to practise it, starting with the group tasks on their own campus.\n\n【参考译文】\nChina's high-speed railway has developed rapidly over the past decade or so. Today, travelling by high-speed train has become the first choice for many people: it is cheaper than flying, much faster than an ordinary train, and the stations are usually located in the city centre. High-speed rail has not only shortened the distance between cities but also changed the way people live — some people live in a small city but work in a big one, and going home at the weekend takes just over an hour. Of course, building high-speed lines requires huge investment, and ticket prices are still too high for some people. On the whole, it has made travel simpler and given more places a chance to develop.",
      questions: [
        {
          q: "「它比普通火车快得多」中的「快得多」，正确的译法是？",
          options: ["more fast than", "much faster than", "very faster than", "more faster than"],
          answer: 1,
          explain: "比较级前表示“得多”要用 much（也可用 far、a lot），不能用 very；faster 本身已经是比较级，前面不能再加 more（more faster 是典型的“双重比较级”错误），more fast 则连比较级都没构成。整句可译为：It is much faster than an ordinary train."
        },
        {
          q: "「车站通常位于市中心」中的「位于」，下面哪种译法正确？",
          options: ["The stations locate in the city centre.", "The stations are lain in the city centre.", "The stations lie on the city centre.", "The stations are located in the city centre."],
          answer: 3,
          explain: "be located in 是“位于”最常用的固定表达。locate 是及物动词，不能单独说 The station locates in…（要用被动 is located，或换成 lies in / stands in）；lain 是 lie（躺）的过去分词，用在这里既不是被动也不合逻辑；lie on 表示“位于（边界、河畔）”，市中心要用 lie in。"
        },
        {
          q: "「高铁不仅缩短了城市之间的距离，也改变了人们的生活方式。」下面哪一种译法语法正确？",
          options: ["High-speed rail has not only shortened the distance between cities but also changed the way people live.", "High-speed rail not only has shortened the distance between cities, and also changed the way people live.", "Not only high-speed rail shortened the distance between cities, but also changed the way people live.", "High-speed rail not only shortened the distance between cities but also has changed people's life way."],
          answer: 0,
          explain: "not only … but also … 必须保持结构与时态平行。A 里两个动词共用 has（has shortened / (has) changed），最平衡。B 用 and also 接在 not only 后面，搭配错误；C 把 Not only 放在句首却没有倒装，后半句还缺主语；D 有两处错：时态不平行（前面是一般过去 shortened，后面却是现在完成 has changed），而且“生活方式”不能直译成 life way，应说 the way people live 或 lifestyle。"
        },
        {
          q: "「票价对部分人来说仍然偏高」下面哪种译法最恰当？",
          options: ["The ticket price is still high to some people.", "The ticket price is still expensive for some people.", "Ticket prices are still too high for some people.", "The price of tickets still costs some people much."],
          answer: 2,
          explain: "中文的“（价格）高”对应英文的 high，不能说 The price is expensive——expensive 形容的是东西本身（The ticket is expensive.）。A 的介词错：对某人来说用 for some people，不用 to；D 有两处问题：cost 的主语应该是东西而不是价格（The ticket costs me 100 yuan.），而且 much 在肯定句里不自然，通常说 a lot。"
        }
      ]
    }
  ]
});