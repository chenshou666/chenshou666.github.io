/* =====================================================================
 * HT Lab · 英语四级课程 · 模块 1：听力
 * 关卡数据文件（每个模块一个文件，互不干扰）
 * 字段说明：
 *   id            关卡号（四级课程从 101 起，与 C 语言课程的 1-20 不冲突）
 *   type          listen | read | write | translate | speak | mock
 *   audio         [{file,label,voice,hint,transcript}]  音频放 ./audio/cet4/
 *   questions     [{q,options,answer,explain}]          answer 为正确选项下标（从 0 起）
 *   passRatio     客观题通关线（0.8 = 答对 80%）
 *   points        写作/翻译的必含要点：["关键词",...]，同组内任一命中即可
 * ===================================================================== */
window.CET4_MODULES = window.CET4_MODULES || [];
window.CET4_MODULES.push({
  id: "m1",
  name: "模块 1 · 听力",
  levels: [
    {
      id: 201,
      title: "听力怎么听：先抓场景，再抓细节",
      minutes: 15,
      gist: "四级听力只播一遍 —— 学会用场景词预判，再用转折词锁定答案。",
      lesson: "四级听力一共 25 题、占 248.5 分，和阅读并列，是四大板块里分值最高的两块之一；而且每段只播一遍。它分三类：短篇新闻 3 段（7 题）、长对话 2 篇（8 题）、听力篇章 3 篇（10 题）。\n好消息是：听力不要求你听懂每个词，考的是抓关键信息。做法只有三步。\n第一步，播放前抢读选项：把选项里重复出现的词圈出来，预判场景（校园、机场、餐厅、办公室），场景一旦定下来，很多词会自动“跳”出来。\n第二步，播放时盯住疑问词：问时间就抓数字，问原因就抓 because / so / the reason is，问建议就抓 why not / you'd better / should。\n第三步，听到转折词立刻警觉：but、however、actually、instead 后面往往就是答案；选项里的原词既可能是答案，也可能是陷阱——判断标准是「这句话有没有回答问题」，而不是「有没有听到原词」。本关第 5、6 题的正确项恰好保留了原词，第 1 题则是同义替换（go ahead ≈ 请便、坐吧）。\n练法：第一遍绝不看原文，做完题再点「显示原文」逐句对照，把没听出来的地方标出来，跟着示范音频读两遍 —— 这一步最能涨分。",
      usage: "这套方法在日常里同样管用：机场广播、餐厅点单、课堂通知、同事交代事情，靠的都是“抓关键信息”而不是逐词听懂。",
      takeaways: [
        "四级听力 25 题、只播一遍，与阅读并列分值最高",
        "听前抢读选项，用场景词预判内容",
        "but / however / actually 之后常常就是答案",
        "选项和音频原词一致时先怀疑，正确答案多为同义替换",
        "第一遍裸听，第二遍再对照原文跟读"
      ],
      type: "listen",
      audioTip: "先裸听一遍做题，再点「显示原文」逐句核对；对不上来的句子，跟着音频读两遍。",
      taskTitle: "听力理解",
      taskCopy: "共 6 题，答对 5 题（80%）即可通关。每答完一题立刻给解析，可以随时重听。",
      passRatio: 0.8,
      audio: [
        {
          file: "201-1.mp3",
          label: "短对话",
          voice: "女声 + 男声",
          hint: "先裸听一遍",
          transcript: "W: Excuse me, is this seat taken?\nM: No, go ahead. Are you here for Professor Lee's lecture too?\nW: Yes. The poster says nine o'clock, but the notice on the door says half past nine.\nM: Right — they changed the room, so the lecture was pushed back by thirty minutes.\nW: Good thing I checked. Otherwise I would have waited outside for half an hour."
        },
        {
          file: "201-2.mp3",
          label: "校园通知",
          voice: "女声",
          hint: "注意数字与地点",
          transcript: "Attention, students. The library will close at six this Friday for maintenance. If you need a quiet place to study, the reading room on the second floor of the teaching building stays open until ten. Please remember to bring your student card."
        }
      ],
      questions: [
        {
          q: "What does the man do when the woman asks about the seat?",
          options: ["He asks her to find another seat.", "He asks whether she is the professor.", "He tells her to go ahead and sit down.", "He says the lecture is cancelled."],
          answer: 2,
          explain: "女士问 “is this seat taken?”（这座位有人吗），男士答 “No, go ahead.” —— go ahead 在这里就是“请便、坐吧”，是听力高频口语表达。"
        },
        {
          q: "When was the lecture originally supposed to start?",
          options: ["At nine o'clock.", "At eight thirty.", "At half past nine.", "At ten o'clock."],
          answer: 0,
          explain: "女士说海报（poster）写的是 nine o'clock，门上的通知（notice）写的是 half past nine。题目问的是“原定时间”，所以是九点；九点半是改过之后的时间，属于典型的数字干扰。"
        },
        {
          q: "Why was the lecture put off?",
          options: ["The professor was late.", "The students asked for a later time.", "The poster had a printing mistake.", "The room was changed."],
          answer: 3,
          explain: "男士说 “they changed the room, so the lecture was pushed back by thirty minutes”。pushed back = 推迟，原因就是换了教室。海报印错只是干扰项，音频并没有这么说。"
        },
        {
          q: "How does the woman feel at the end?",
          options: ["Angry about the change.", "She thinks the lecture is unimportant.", "Relieved that she checked the notice.", "Worried that she cannot find the room."],
          answer: 2,
          explain: "最后一句 “Good thing I checked. Otherwise I would have waited outside for half an hour.” —— Good thing = 幸好，表示庆幸，所以选“庆幸自己看了通知”。"
        },
        {
          q: "Why will the library close early this Friday?",
          options: ["It is being redecorated.", "It needs maintenance.", "A school activity will be held there.", "The books are being counted."],
          answer: 1,
          explain: "通知原句 “The library will close at six this Friday for maintenance.” maintenance = 维修保养。原文用的是 for maintenance，选项 B 直接保留了 maintenance，属于「听到什么选什么」；另外三个选项分别改成 redecorated（重新装修）、activity（活动）、counted（清点）来干扰。"
        },
        {
          q: "Where can students study until ten in the evening?",
          options: ["On the first floor of the library.", "In the reading room on the second floor of the teaching building.", "In the student activity centre.", "In the dormitory study room."],
          answer: 1,
          explain: "通知原句 “the reading room on the second floor of the teaching building stays open until ten”，地点题要听清楼层 building 与 room 的修饰关系，别被 library / dormitory 这些同类地点词带跑。"
        }
      ]
    },
    {
      id: 202,
      title: "短对话：数字与时间",
      minutes: 15,
      gist: "数字题的难点不是听不懂数字，而是听到好几个数字之后不知道该选哪一个。",
      lesson: "数字题有三个台阶：听懂数字 → 听懂数字修饰的是什么 → 判断题目问的是哪一个。绝大多数人卡在第三步，本关就练第三步。\n① 抢读选项时先分类：选项全是钱（dollar）、全是时刻（nine forty / ten five）、还是全是数量（two / three days）。分好类之后，播放时只盯这一类，其他数字自动降级成背景音。\n② 边听边在选项旁做小记号：听到 twelve 就在 twelve 旁边点一下；听到 half price 就写「÷2」；听到 on the house 就写「0」。数字题几乎都要算一步，不记就一定会算错。\n③ 三个高频价格表达：half price 半价；on the house 店家请客、免费；for free 免费。听到它们，价格就要变。\n④ 时间题的固定套路是「先给一个旧时间，再给一个新时间」：delayed by an hour、pushed back、brought forward。题目问「原定」还是「现在」，答案完全不同，所以疑问词一定要听清。\n⑤ 数字前面的词决定它算不算数：each 是「每个」，要乘数量；in total、altogether 是「已经算好的总数」，不用再算。",
      usage: "价格、时刻、数量是日常里最需要一次就听懂的信息：点单、赶车、约时间，听错一个数字的代价最大。",
      takeaways: [
        "数字题先按「钱 / 时刻 / 数量」给选项分类，只听一类",
        "听到 half price / on the house 就要立刻动笔算",
        "先旧时间、后新时间是固定套路，看清题目问的是哪一个",
        "each 要乘数量，in total 是已经算好的总数"
      ],
      type: "listen",
      audioTip: "先裸听一遍做题，第二遍再点「显示原文」核对数字：把每个数字和它修饰的对象一起抄下来。",
      taskTitle: "听力理解",
      taskCopy: "共 5 题，答对 4 题（80%）即可通关。数字题建议边听边在纸上写记号，别靠脑子记。",
      passRatio: 0.8,
      audio: [
        {
          file: "202-1.mp3",
          label: "短对话",
          voice: "女声 + 男声",
          hint: "注意 each、half price 与 on the house",
          transcript: "W: Hi, I'd like two tickets for Saturday evening, please.\nM: Sure. They're twelve dollars each, but students pay half price.\nW: Perfect — I have my student card. And I'll take a large popcorn, too.\nM: That's four dollars, but today it's on the house, so you only pay for the tickets.\nW: Then here's twenty dollars.\nM: Thank you. And here's your change: eight dollars."
        },
        {
          file: "202-2.mp3",
          label: "短对话",
          voice: "女声 + 男声",
          hint: "先给一个时间，再改口 —— 听清题目问哪一个",
          transcript: "W: Excuse me, what time is the next train to the airport?\nM: The nine fifteen has just left. The next one is at nine forty.\nW: How long does it take?\nM: The nine forty is a slow train — it takes about fifty minutes. The ten five express takes half an hour.\nW: My flight is at eleven, so the express would get me there at ten thirty-five. I'll take that one.\nM: Good choice. Platform six."
        }
      ],
      questions: [
        {
          q: "How much does the woman pay for the popcorn?",
          options: ["Nothing.", "Four dollars.", "Eight dollars.", "Twelve dollars."],
          answer: 0,
          explain: "男士说 “That's four dollars, but today it's on the house, so you only pay for the tickets.” —— on the house 是「店家请客、免费」，所以爆米花一分钱不用付。四美元是它的原价，正是「听到数字就选」的陷阱；十二美元是单张票的全价（原文 They're twelve dollars each），和爆米花的价钱无关，属于拿别处的数字来凑数。"
        },
        {
          q: "How much would one ticket cost without the student discount?",
          options: ["Six dollars.", "Twelve dollars.", "Eighteen dollars.", "Twenty-four dollars."],
          answer: 1,
          explain: "男士说 “They're twelve dollars each, but students pay half price.” —— 十二美元是全价，学生半价才是六美元。题目问的是「没有学生折扣」的价格，所以是十二美元；六美元恰恰是打过折的价钱，是本题最强的干扰项。"
        },
        {
          q: "How much change does the woman get?",
          options: ["Four dollars.", "Six dollars.", "Eight dollars.", "Ten dollars."],
          answer: 2,
          explain: "女士给了二十美元，两张学生票一共十二美元，爆米花免费，所以找零是二十减十二，等于八美元，男士最后也念出了 eight dollars。算账要先确定「一共付多少」，再拿付出去的钱去减；六美元只是单张学生票的价钱，不是找零。"
        },
        {
          q: "Which train does the woman decide to take?",
          options: ["The nine fifteen train.", "The nine forty train.", "The ten thirty-five train.", "The ten five train."],
          answer: 3,
          explain: "她说 “the express would get me there at ten thirty-five. I'll take that one.” —— 她选的是十点零五发的快车。十点三十五不是一个发车时间，而是快车到达机场的时间，把它当成「一班车」就是本题最像样的干扰项；九点十五已经开走，九点四十是慢车。"
        },
        {
          q: "How long does the slow train take?",
          options: ["Half an hour.", "Fifty minutes.", "An hour.", "Forty minutes."],
          answer: 1,
          explain: "男士说 “The nine forty is a slow train — it takes about fifty minutes. The ten five express takes half an hour.” 两句话里各有一个时长，慢车是五十分钟，快车才是半小时。听到两个数字时，一定要把「谁用多久」对上号。"
        }
      ]
    },
    {
      id: 203,
      title: "短对话：地点与场景词",
      minutes: 15,
      gist: "一个场景词就能点亮整个画面。先定场景，再听人去哪儿，最后听准方位。",
      lesson: "地点题不需要听懂每个词：抓住「场景词」，一个词就能点亮整个场景，剩下的内容大脑会自动补全。\n四组必背场景词：\n① 校园：dormitory 宿舍、lecture hall 讲堂、seminar 研讨课、tutor 导师、department office 系办公室、reading room 阅览室、canteen 食堂。\n② 机场：check in 办理登机、boarding 登机、gate 登机口、delayed 延误、passport 护照、luggage 行李。\n③ 餐厅：menu 菜单、order 点菜、bill 账单、reservation 预订、takeaway 外卖。\n④ 医院与药店：appointment 预约、prescription 处方、pharmacy 药店、medicine 药、cold 感冒。\n听地点题按这个顺序走：先抓一个场景词定下场景，再听「人最后往哪儿去了」——moved to、ended up in、went over to 后面跟的地点往往才是答案，前面提到的地点常常是「本来打算去」的干扰项。\n还要记住一组方位词：next to / beside 挨着，opposite 在……对面，on the second floor 在二楼，just past 过了……就是。地点题考的是精确位置，不是大致方向，所以这一组词不能听个大概。",
      usage: "问路、找登机口、在陌生商场里找药店，靠的都是抓场景词和方位词的能力。",
      takeaways: [
        "一个场景词就能定下整段对话的背景，先定场景再听细节",
        "校园 / 机场 / 餐厅 / 医院四组场景词要练到条件反射",
        "moved to / ended up in 后面的地点才是答案，前面提到的多是干扰",
        "方位词要听精确：next to、opposite、on the second floor"
      ],
      type: "listen",
      audioTip: "第一遍听到场景词就先在心里定场景；第二遍再核对「最后去的是哪儿」和方位词。",
      taskTitle: "听力理解",
      taskCopy: "共 5 题，答对 4 题（80%）即可通关。做题时先问自己：这段对话发生在哪儿？",
      passRatio: 0.8,
      audio: [
        {
          file: "203-1.mp3",
          label: "短对话",
          voice: "女声 + 男声",
          hint: "他换了几个地方？最后在哪儿？",
          transcript: "W: Hi Tom, have you finished the reading for tomorrow's seminar?\nM: Not yet. I was going to work in my dorm, but my roommate had friends over, so I moved to the reading room on the second floor.\nW: Isn't that closed on Wednesday afternoons?\nM: It is, so I ended up in the café next to the department office. It's not ideal, but at least it's quiet in the morning.\nW: Well, at least you found somewhere in the end."
        },
        {
          file: "203-2.mp3",
          label: "短对话",
          voice: "女声 + 男声",
          hint: "抓机场场景词，再听药房在哪儿",
          transcript: "W: Good morning. I'd like to check in for the flight to Seattle.\nM: Certainly. May I see your passport and your booking number, please? Thank you. Your flight has been delayed by an hour, so boarding will start at four fifteen at gate twelve.\nW: An hour — that gives me time for a coffee. Is there a pharmacy near the gate? I need some medicine for my cold.\nM: Yes, there's one right beside the newsagent's, on the same level as the gate.\nW: Good. I'll go there first, then."
        }
      ],
      questions: [
        {
          q: "Where did the man finally do his reading?",
          options: ["In his dormitory.", "In the reading room on the second floor.", "In the café next to the department office.", "In the department office."],
          answer: 2,
          explain: "男士说 “I was going to work in my dorm… so I moved to the reading room… It is [closed], so I ended up in the café next to the department office.” —— 宿舍和阅览室都是他先后放弃的地方，ended up in 后面跟的咖啡馆才是最终地点。地点题一定要听到最后一句。"
        },
        {
          q: "Why did the man leave his dormitory?",
          options: ["His roommate had visitors.", "The dormitory was closed for cleaning.", "He wanted to buy a coffee.", "His roommate was ill."],
          answer: 0,
          explain: "原句 “my roommate had friends over” —— have friends over 就是「有朋友过来」，也就是室友有客人。宿舍并没有关门；买咖啡是他到了咖啡馆之后顺带提到的事，不是他离开宿舍的原因。"
        },
        {
          q: "Where does the second conversation most probably take place?",
          options: ["At a hospital reception desk.", "At a hotel front desk.", "At a railway ticket office.", "At an airport check-in desk."],
          answer: 3,
          explain: "check in for the flight、passport、boarding、gate 都是机场专属的场景词，所以这里是机场值机柜台。医院、酒店、火车站虽然也都有「柜台」，但不会同时出现护照和登机口，这就是场景词的鉴别作用。"
        },
        {
          q: "Where is the pharmacy?",
          options: ["Opposite the boarding gate.", "Beside the newsagent's.", "Next to the check-in desk.", "On the floor above the gate."],
          answer: 1,
          explain: "男士说 “there's one right beside the newsagent's, on the same level as the gate” —— beside 是挨着，same level 是同一层。opposite（对面）和 above（楼上）这两个方位词音频里都没有出现，属于用同类词编出来的干扰项。"
        },
        {
          q: "Why does the woman want to go to the pharmacy?",
          options: ["She has a cold.", "She needs to fill a prescription for her father.", "She wants to buy a newspaper.", "The airline has lost her luggage."],
          answer: 0,
          explain: "她说 “I need some medicine for my cold.” —— 感冒了要买药。prescription（处方）、luggage（行李）都是医院和机场场景里高频出现的词，但音频并没有提到，这正是「用场景词编选项」的套路。"
        }
      ]
    },
    {
      id: 204,
      title: "短对话：建议与请求",
      minutes: 15,
      gist: "Why not / You'd better / How about 一听就知道是建议；Would you mind 后面才是请求。",
      lesson: "建议和请求是短对话里出现频率最高的一类，句式非常固定，听到开头就能预判后面。\n一、建议（让对方去做某事）：\n· Why not + 动词原形？／ Why don't you…？「为什么不……呢」，语气最轻。\n· You'd better + 动词原形「你最好……」，语气较强，后面常跟一个不好的后果。\n· How about / What about + 名词或动名词？「……怎么样」，用来推出另一个选项。\n· Shall we…？／ Let's…「我们一起……吧」。\n· If I were you, I'd…「换成我就……」，用虚拟语气提建议。\n二、请求（想从对方那里得到东西）：\n· Would you mind if I…？「你介意我……吗」，注意回答 No 才是同意。\n· Could you possibly…？／ I was wondering if you could… 是最委婉的请求。\n· Would you mind doing…？后面接动名词，不接 to do。\n三、考场套路：一个人常常一口气提好几条建议，题目问 first suggestion 时答案就是第一条；接着被建议的人会明确表态（That would save me. / That works.），表态指向的那一条才是「最后决定」。所以 first、also、or 这些顺序词必须听见。\n四、还有一个经典陷阱：题目问「他同意了吗」，而回答里出现 I'm afraid…、Actually…，多半是委婉拒绝，正确答案往往是「对方改成了另一件事」。",
      usage: "同事、老师、客服之间的每一次沟通几乎都在提建议和提请求；听懂 Why not 和 Would you mind，回应才不会答反。",
      takeaways: [
        "Why not / You'd better / How about 都是建议，只是语气强弱不同",
        "Would you mind if I…？回答 No 才是同意，别说反",
        "一段对话里常有两三条建议，题目问 first 就选第一条",
        "委婉拒绝的信号是 I'm afraid… / Actually…，后面往往跟着替代方案"
      ],
      type: "listen",
      audioTip: "第一遍只做一件事：判断哪句是建议、哪句是请求；第二遍再确认被建议的人到底接受了哪一条。",
      taskTitle: "听力理解",
      taskCopy: "共 5 题，答对 4 题（80%）即可通关。听到 Why not / You'd better / Would you mind 就立刻竖耳朵。",
      passRatio: 0.8,
      audio: [
        {
          file: "204-1.mp3",
          label: "短对话",
          voice: "女声 + 男声",
          hint: "他给了几条建议？她接受了哪一条？",
          transcript: "W: I can't get my laptop to connect to the library Wi-Fi.\nM: Why not ask the staff at the front desk? They usually have a sheet with the new password.\nW: I tried that. They said the whole system is down until Monday.\nM: Then you'd better use the computers in the reading room. Or how about borrowing my hotspot for tonight?\nW: That would save me. Thanks a lot."
        },
        {
          file: "204-2.mp3",
          label: "短对话",
          voice: "女声 + 男声",
          hint: "注意 Would you mind if I… 和后面的转折",
          transcript: "M: Professor Hart, would you mind if I handed in my essay on Friday instead of tomorrow?\nW: I'm afraid that's too late — the marks have to reach the department on Thursday. But you can email it to me by Wednesday evening.\nM: That works, thank you. Could you also recommend another book? The one on the reading list is out on loan.\nW: Of course. Come to my office at two tomorrow and I'll lend you my copy."
        }
      ],
      questions: [
        {
          q: "What does the man suggest first?",
          options: ["Asking the staff at the front desk.", "Using the computers in the reading room.", "Borrowing his hotspot.", "Waiting until Monday."],
          answer: 0,
          explain: "男士的第一条建议是 “Why not ask the staff at the front desk?” —— 去前台问。阅览室的电脑和热点是他后面才提的第二、第三条建议。题目问 first，就必须把顺序听清，不能挑一个自己觉得最合理的。"
        },
        {
          q: "What is the problem with the library Wi-Fi?",
          options: ["The password has been changed.", "It only works in the reading room.", "The whole system is down until Monday.", "Too many students are using it."],
          answer: 2,
          explain: "女士说 “They said the whole system is down until Monday.” —— down 在这里是「系统瘫痪、坏了」。换密码只是男士的猜测（他猜前台有张写着新密码的单子），不是事实，这正是利用「听到 password 就选」设下的陷阱。"
        },
        {
          q: "What will the woman probably do tonight?",
          options: ["Wait until Monday.", "Use the man's hotspot.", "Go to the front desk again.", "Buy a new laptop."],
          answer: 1,
          explain: "男士最后提的是 “how about borrowing my hotspot for tonight?”，女士回答 “That would save me.” —— 明确接受，说明她今晚打算借用男士的热点。用阅览室电脑只是男士给过的另一条建议，她并没有表态接受。"
        },
        {
          q: "What does the student want to do with his essay?",
          options: ["Ask for a longer topic.", "Hand it in next month.", "Write it again after the marks are sent.", "Hand it in on Friday instead of tomorrow."],
          answer: 3,
          explain: "他问 “would you mind if I handed in my essay on Friday instead of tomorrow?” —— 想把交论文的时间从明天推到周五。Would you mind if I… 后面用过去式（handed）是虚拟语气，表示客气，不是说这件事已经发生过了。"
        },
        {
          q: "What does the professor tell him to do about the essay?",
          options: ["Come to her office on Thursday.", "Send the essay by email on Wednesday evening.", "Hand the essay to the department himself.", "Ask another professor for a book."],
          answer: 1,
          explain: "教授先委婉拒绝（I'm afraid that's too late），再给出可行方案：“you can email it to me by Wednesday evening”。周四是成绩送到系里的时间，不是交论文的时间；去办公室是后面为借书约定的，也不是交论文的方式。"
        }
      ]
    },
    {
      id: 205,
      title: "长对话（一）：校园场景",
      minutes: 18,
      gist: "长对话每篇 4 题，答案按对话顺序出现 —— 用「顺序听」代替「听懂每一句」。",
      lesson: "长对话是四级听力的第二块，2 篇共 8 题，每篇 4 题，长度在 10 轮以上。它比短对话好拿分，因为话题更完整，但必须换一套听法。\n一、听前十几秒做一张「地图」：如果选项里反复出现 course、form、library、textbook，就在草稿纸上写下这几个词，它们就是四个路标，听到哪个词就抬头。\n二、长对话的信息是严格按顺序出现的：第 1 题的答案几乎总在前两三句，第 4 题的答案几乎总在最后几句。一旦发现已经听到第 3 题的内容，说明第 1 题漏了——果断放弃，跟上新的，绝不回头。\n三、长对话最爱考三类信息：\n· 问题与原因：学生说 “It's timetabled at eight… I keep missing the first ten minutes.”，问的就是「为什么要换课」。听到 I keep、because、so 就要留心。\n· 规则与建议：“the rule is that you can change courses during the first two weeks only”“Shall I move you there instead of dropping the course?”——这类句子本身往往就是题目。\n· 条件与时间点：“if you have overdue books…”“before Friday”，听力里的条件和截止时间几乎必考。\n四、校园场景高频词：timetable 课表、seminar 研讨课、tutor 导师、signature 签名、register for a course 选课注册、overdue 逾期的、renew（图书）续借、student card 学生证。",
      usage: "在办公室办手续、跟导师沟通、处理选课和借书，信息量大又只讲一遍，靠的就是「按顺序听」和「抓条件句」。",
      takeaways: [
        "长对话每篇 4 题，答案按对话顺序出现，漏了就放手",
        "选项里重复出现的词就是路标词，听到就抬头",
        "规则句（the rule is…）和建议句（Shall I…）往往就是题目本身",
        "条件与时间点几乎必考：overdue / before Friday"
      ],
      type: "listen",
      audioTip: "第一遍边听边在纸上写「她在办什么手续」；第二遍再核对条件句和截止时间。",
      taskTitle: "听力理解",
      taskCopy: "共 4 题，答对 3 题（75%）即可通关。先听一遍再做题，做完可以重听。",
      passRatio: 0.75,
      audio: [
        {
          file: "205-1.mp3",
          label: "长对话",
          voice: "女声 + 男声",
          hint: "听清三个信息：为什么换、换成什么、还要办什么",
          transcript: "W: Excuse me, is this the right office for course changes? I'm a first-year student and I'd like to drop my statistics course.\nM: You've come to the right place. Can I ask why?\nW: It's timetabled at eight on Monday morning, and my dorm is a twenty-minute walk from the science building. I keep missing the first ten minutes.\nM: I see. Well, the rule is that you can change courses during the first two weeks of term only.\nW: It's the second week now, so I'm just in time.\nM: Right. There's another statistics class on Thursday afternoon. Shall I move you there instead of dropping the course?\nW: That would be much better. Do I need to fill in a form?\nM: Yes, one form — and you'll need your tutor's signature as well. Her office is on the second floor of this building, room two fourteen.\nW: OK. And if I move to the Thursday class, will I need a different textbook?\nM: No, it's the same textbook. But you also have to clear your library record, because the library won't let you register for a new class if you have overdue books.\nW: They're not overdue — I renewed them online last night.\nM: Good. Then bring the form and your student card to this office before Friday."
        }
      ],
      questions: [
        {
          q: "Why does the woman want to change her statistics course?",
          options: ["She finds the course too difficult.", "The course is not part of her programme.", "She does not get on with the teacher.", "The class starts too early for her."],
          answer: 3,
          explain: "她给的理由是 “It's timetabled at eight on Monday morning, and my dorm is a twenty-minute walk from the science building. I keep missing the first ten minutes.” —— 课排在早上八点、宿舍又远，所以她总错过开头，也就是「上得太早」。觉得难、专业不符、与老师不和，音频里都没有依据。"
        },
        {
          q: "What does the man suggest she do?",
          options: ["Move to the Thursday afternoon class.", "Drop the course and take it next year.", "Take the course online.", "Change to a different tutor."],
          answer: 0,
          explain: "男士说 “There's another statistics class on Thursday afternoon. Shall I move you there instead of dropping the course?” —— instead of dropping 说明他的建议是换班，而不是退课。退课只是学生最初的想法，也是本题最容易误选的干扰项。"
        },
        {
          q: "What does the woman need to get from her tutor?",
          options: ["A new textbook.", "A signature.", "A library card.", "A timetable."],
          answer: 1,
          explain: "男士说 “you'll need your tutor's signature as well”，还给了办公室位置（room two fourteen）。填表之外还要导师签名。教材不用换——紧挨着的一句是 “No, it's the same textbook.”，听到 No 一定要立刻记下来，它常常就是下一题的答案。"
        },
        {
          q: "What does the woman say about her library books?",
          options: ["She has already returned them.", "They are overdue.", "She has renewed them online.", "She has not borrowed any books yet."],
          answer: 2,
          explain: "男士提醒逾期图书会挡住注册；女士回答 “They're not overdue — I renewed them online last night.” —— renew 是「续借」，说明她已经在网上办好续借、书没有逾期。逾期和已经归还是两个都没出现过的说法。"
        }
      ]
    },
    {
      id: 206,
      title: "长对话（二）：职场与面试",
      minutes: 18,
      gist: "面试对话有固定结构：身份 → 经历 → 动机 → 条件 → 确认，对着结构听就不慌。",
      lesson: "面试类长对话的结构非常稳定，听的时候按这个结构对号入座，比逐句硬听省力得多：\n① 开场：问候 + 确认身份（I see you're in your second year…）。\n② 岗位与经历：What did you do before? / Have you done any work of this kind before? 这一段几乎必出一道题，答案就是那段经历，重点听动词：helped、planned、answered。\n③ 动机：Why did you apply to us rather than…? 问「为什么选我们」。答案通常有两点，音频会用 two reasons 明确提示，两点都要记住，题目很可能只问其中一点。\n④ 条件与安排：时长（ten weeks）、开始时间（the first of July）、报酬（twelve dollars an hour）、通知方式（email by the end of next week）。这一段是数字最密集的地方。\n⑤ 结尾确认：Are you free to start on…? 应聘者的回答里常常藏着「另一个时间」（my last exam is on the twenty-eighth of June），它是最常见的干扰数字。\n职场高频词：internship 实习、apply for 申请、campaign（推广）活动、social media 社交媒体、work from home 远程办公、by the end of next week 下周末之前、an hour（计时工资）每小时。",
      usage: "面试和被面试时，对方真正在问的就是「你做过什么」「为什么选我们」「什么时候能来」；听懂这三句，回答就不会跑偏。",
      takeaways: [
        "面试长对话按「身份 → 经历 → 动机 → 条件 → 确认」五步走",
        "经历题听到动词就等于听到答案：helped / planned / answered",
        "two reasons 是明确信号词，两点都要记住",
        "时间题要分清「通知时间」「考试结束时间」「入职时间」"
      ],
      type: "listen",
      audioTip: "第一遍只记结构（走到第几步了）；第二遍把四类数字抄下来：时长、工资、通知时间、入职时间。",
      taskTitle: "听力理解",
      taskCopy: "共 4 题，答对 3 题（75%）即可通关。听到数字先别急着选，确认它修饰的是哪件事。",
      passRatio: 0.75,
      audio: [
        {
          file: "206-1.mp3",
          label: "长对话",
          voice: "女声 + 男声",
          hint: "面试官问了什么？她答了什么？结尾又确认了什么？",
          transcript: "M: Good morning, Ms. Chen. Thanks for coming in. I see you're in your second year of business studies.\nW: That's right. I'm looking for a summer internship in marketing.\nM: Have you done any work of this kind before?\nW: Yes — last summer I helped a small bakery with its social media. I planned the posts and answered customers' messages, and their sales went up by about a third in two months.\nM: That's useful experience. Can I ask why you applied to us rather than to a bigger company?\nW: Two reasons. Your team is small, so I'd get to work on real campaigns, and I read that you let interns work from home two days a week, which fits my class timetable.\nM: That's true. The internship runs for ten weeks, starting on the first of July. It's paid — twelve dollars an hour — and you'd sit with the social media team.\nW: And when will I hear whether I've got the place?\nM: We'll email everyone by the end of next week. One more thing: are you free to start on the first of July?\nW: My last exam is on the twenty-eighth of June, so yes, that's fine."
        }
      ],
      questions: [
        {
          q: "What is the woman applying for?",
          options: ["A full-time job in a bakery.", "A summer internship in marketing.", "A place on a business course.", "A part-time job in a bookshop."],
          answer: 1,
          explain: "她说 “I'm looking for a summer internship in marketing.” —— internship 是实习，和全职、兼职都不同。面包店是她去年帮过忙的地方，不是她现在申请的岗位，这是利用同一个场景里的旧信息设的干扰。"
        },
        {
          q: "What did the woman do last summer?",
          options: ["She worked in a large marketing company.", "She managed a bakery on her own.", "She helped a small bakery with its social media.", "She taught business studies online."],
          answer: 2,
          explain: "原句 “last summer I helped a small bakery with its social media. I planned the posts and answered customers' messages…” —— helped 是关键动词：她是去帮忙做社交媒体，既不是「自己经营面包店」，也不是在大公司上班。"
        },
        {
          q: "Why does the woman want to work for this company?",
          options: ["It pays more than other companies.", "It is close to her university.", "A friend of hers already works there.", "The team is small and interns can work from home."],
          answer: 3,
          explain: "她说 “Two reasons. Your team is small, so I'd get to work on real campaigns, and I read that you let interns work from home two days a week, which fits my class timetable.” —— 团队小、可以远程办公。工资（twelve dollars an hour）是面试官后来说的事实，她并没有说这是自己挑这家公司的理由，这是「音频里有这个词，但不是这道题的答案」的典型陷阱。"
        },
        {
          q: "What starting date do the two speakers agree on?",
          options: ["On the first of July.", "On the twenty-eighth of June.", "At the end of next week.", "Ten weeks from now."],
          answer: 0,
          explain: "面试官问 “are you free to start on the first of July?”，女士答 “My last exam is on the twenty-eighth of June, so yes, that's fine.” —— 六月二十八日是考试结束的日子，七月一日才是入职时间，下周末之前是通知结果的时间。三件事混在一起，正是本题的考点。"
        }
      ]
    },
    {
      id: 207,
      title: "长对话（三）：态度与观点",
      minutes: 18,
      gist: "态度题不考细节，考「这个人到底怎么想」；重点永远在 I agree that…, but… 的 but 之后。",
      lesson: "态度题不考细节，考的是「这个人到底怎么想」。它有两个特点：选项多是形容词或立场句，而音频里很少直接出现这些词。\n一、先把选项读成三类：支持（positive）、反对（negative）、犹豫（not sure / maybe）。听的时候只要判断说话人落在哪一类，就能先排掉一半选项。\n二、抓态度信号词：\n· 支持：I think it's great. / That's a fair point. / Exactly.\n· 反对：I'm not sure that's a good idea. / I'm afraid… / My worry is… / The problem is…\n· 部分同意：I agree that…, but… / Maybe, still… / Not completely.\n三、注意「先同意、后转折」这个最常见的话术：I agree that we need more study space. My worry is the noise. —— 前半句是让步，but / my worry is 后面才是真实立场。听到 I agree that 先别急着选「支持」。\n四、分清是谁在说话。本题里男士支持、女士有顾虑；一旦把人称听混，两个选项都会看起来像对的，这是态度题最常见的失分方式。\n五、态度题的答案常常在最后两轮：题干里出现 at the end、finally，就一定听到最后再选，因为对话中间人可能改变主意。",
      usage: "开会、谈合作、和朋友商量事情时，听懂「他是同意还是在委婉反对」，比听懂每一个词都重要。",
      takeaways: [
        "态度题先把选项分成「支持 / 反对 / 犹豫」三类",
        "I agree that…, but… 的重心永远在 but 后面",
        "先分清是谁在说话，态度题最容易张冠李戴",
        "题干出现 at the end，答案就在最后两轮"
      ],
      type: "listen",
      audioTip: "第一遍每听完一轮就在纸上写「男：支持 / 女：顾虑」；第二遍再核对最后两轮的结论。",
      taskTitle: "听力理解",
      taskCopy: "共 4 题，答对 3 题（75%）即可通关。边听边记「谁是什么态度」，两栏就够。",
      passRatio: 0.75,
      audio: [
        {
          file: "207-1.mp3",
          label: "长对话",
          voice: "女声 + 男声",
          hint: "两个人都同意吗？最后谁让步了？",
          transcript: "M: Did you see the email about the old canteen?\nW: You mean the plan to turn it into a twenty-four-hour study room? I'm not sure that's a good idea.\nM: Really? I think it's great. The library closes at ten, and in December I never get a seat.\nW: I agree that we need more study space. My worry is the noise. If it's open all night, people will talk and eat there, and the building is right under the dormitories.\nM: That's a fair point. But they could put the quiet zone on the ground floor.\nW: Maybe. Still, I'd rather they opened a small café until midnight — most of us just want somewhere to sit with a coffee.\nM: So you're not against the plan completely?\nW: Not completely. I just don't think twenty-four hours is necessary. Ten until midnight would be enough."
        }
      ],
      questions: [
        {
          q: "What is the university planning to do with the old canteen?",
          options: ["Close it and build a new library.", "Move the dormitories next to it.", "Turn it into a twenty-four-hour study room.", "Open a café inside the library."],
          answer: 2,
          explain: "女士一开口就复述了计划：“the plan to turn it into a twenty-four-hour study room” —— 把旧食堂改成二十四小时自习室。改成咖啡馆是女士自己后来的建议（I'd rather they opened a small café），不是学校的计划，这是本题最需要分清的一处。"
        },
        {
          q: "What does the man think of the plan?",
          options: ["He thinks it will cost too much.", "He is in favour of it.", "He believes the canteen should stay open.", "He has not read the email."],
          answer: 1,
          explain: "男士说 “Really? I think it's great. The library closes at ten, and in December I never get a seat.” —— 他觉得这个计划很好。他后面只说女士的顾虑是 fair（有道理），并没有改变自己的立场，所以答案仍是「支持」。"
        },
        {
          q: "What is the woman's main worry about the plan?",
          options: ["There will not be enough seats.", "The library will close earlier.", "The plan will cost too much.", "The noise will disturb the dormitories."],
          answer: 3,
          explain: "她说 “My worry is the noise… people will talk and eat there, and the building is right under the dormitories.” —— 她先承认需要更多学习空间，真正的顾虑是噪音会影响楼上的宿舍。座位不够是男士的困难，不是她的顾虑。"
        },
        {
          q: "What is the woman's attitude at the end of the conversation?",
          options: ["She agrees with the idea but not with the opening hours.", "She is completely against the plan.", "She wants the canteen to stay exactly as it is.", "She has lost interest in the discussion."],
          answer: 0,
          explain: "最后两轮说得很清楚：“So you're not against the plan completely?” “Not completely. I just don't think twenty-four hours is necessary. Ten until midnight would be enough.” —— 她赞成增加学习空间，只是认为不必开满二十四小时。Not completely 这种「半否定」正是态度题最爱考的说法。"
        }
      ]
    },
    {
      id: 208,
      title: "听力篇章（一）：主旨题",
      minutes: 18,
      gist: "主旨句固定在开头和结尾；中间的细节再生动，也撑不起「全文在说什么」。",
      lesson: "听力篇章是四级听力的第三块，3 篇共 10 题，材料最长、语速最稳，也是最容易「听懂了却选错」的地方。主旨题的做法和细节题完全不同。\n一、先认题干：出现 mainly about、main idea、best title、purpose，问的就是「整篇在说什么」，答案必须能盖住全文。\n二、答案位置是固定的：第一句 + 最后一句。英语篇章习惯「开门见山 + 结尾重申」。本关音频的第一句就点出「很多人以为熬夜复习最好」，中间是研究数据，最后用研究者的一句话收尾。听的时候第一句和最后一句必须完整听懂。\n三、三个干扰项的固定套路，读完选项就能先排掉：\n· 太窄：只概括了中间某一个例子（比如只剩下「小睡二十分钟」）。\n· 太宽：跑到文章主题之外（比如去谈「考试这种方式好不好」）。\n· 太绝对：出现 always、never、only、must，而原文只是说 usually、often、about。\n四、笔记法：篇章不要记句子，只记三个词——谁、做了什么、结论是什么。主旨题的答案，就是把这三个词连起来的那句话。",
      usage: "听讲座、听英文播客、听同事汇报，第一句和最后一句永远是重点，中间的例子可以放过。",
      takeaways: [
        "主旨题看 mainly about / best title 这类题干",
        "主旨句固定在开头和结尾，中间都是支撑细节",
        "干扰项三种：太窄、太宽、太绝对",
        "篇章笔记只记「谁 + 做了什么 + 结论」"
      ],
      type: "listen",
      audioTip: "第一遍只记三个词（谁 / 做了什么 / 结论）；第二遍对照原文，看自己记的三个词对不对。",
      taskTitle: "听力理解",
      taskCopy: "共 5 题，答对 4 题（80%）即可通关。语速是 -8%，适合跟读，听不懂就多听两遍。",
      passRatio: 0.8,
      audio: [
        {
          file: "208-1.mp3",
          label: "听力篇章",
          voice: "女声",
          hint: "第一句和最后一句是关键",
          transcript: "Many students believe that the best way to prepare for an exam is to stay up late at night. A study of two thousand university students suggests the opposite. Those who went to bed before midnight and slept for at least seven hours did better in their exams than those who stayed up. The researchers say the reason is simple: while we sleep, the brain sorts out what we learned during the day and moves it into long-term memory, so a student who sleeps well remembers more of what he or she has read. The team also found that short naps of about twenty minutes helped students who studied in the afternoon. They suggest that students should plan their sleep as carefully as their revision. 'If you have to choose between one more hour of reading and one more hour of sleep,' one researcher said, 'the sleep is usually the better investment.'"
        }
      ],
      questions: [
        {
          q: "What is the best title for this passage?",
          options: ["Sleep Well, Do Better.", "How to Take a Short Nap.", "Why Exams Are Getting Harder.", "The History of Memory Research."],
          answer: 0,
          explain: "全文从「熬夜复习是不是最好」讲起，用一项两千人的研究说明睡够的学生考得更好，最后落到研究者的建议上，所以标题应该是「睡得好、考得好」。小睡只是中间的一个细节，拿细节当标题就是「太窄」这一类干扰项。"
        },
        {
          q: "How many students took part in the study?",
          options: ["Two hundred.", "Two thousand.", "Twenty thousand.", "Two million."],
          answer: 1,
          explain: "原文 “A study of two thousand university students” —— 两千名大学生。听力里的数字要特别注意 thousand 和 hundred 的区别；同一段里还有 twenty minutes（小睡时长），那是另一个数字，不要拿错。"
        },
        {
          q: "According to the researchers, why does sleep help students?",
          options: ["It gives the body time to rest.", "It helps students feel less nervous before exams.", "The brain sorts out and stores what was learned.", "It makes reading speed faster."],
          answer: 2,
          explain: "原文 “while we sleep, the brain sorts out what we learned during the day and moves it into long-term memory” —— 睡觉时大脑会整理当天学到的东西，把它存进长期记忆。休息、缓解紧张、提高阅读速度都是听起来合理的常识，但音频给出的唯一原因是「整理与储存」。"
        },
        {
          q: "What did the team find about short naps?",
          options: ["They were more useful than a full night's sleep.", "They were only useful for first-year students.", "They made students sleep badly at night.", "Twenty-minute naps helped students who studied in the afternoon."],
          answer: 3,
          explain: "原文 “short naps of about twenty minutes helped students who studied in the afternoon” —— 二十分钟左右的小睡对下午学习的学生有帮助。原文并没有说小睡能代替整晚睡眠，也没说只对某一类学生有用，这两个都是「听起来合理但没说过」。"
        },
        {
          q: "What does the researcher mean by saying that sleep is usually the better investment?",
          options: ["Sleep costs less money than books.", "An extra hour of sleep is likely to bring better results than an extra hour of reading.", "Students should buy a better bed.", "Reading in the evening is a waste of time."],
          answer: 1,
          explain: "这句话的上文是 “If you have to choose between one more hour of reading and one more hour of sleep” —— 在多读一小时和多睡一小时之间，睡眠通常是更划算的「投资」，也就是更可能换来好成绩。investment 在这里是比喻，不是真花钱；说「晚上读书是浪费时间」则推得太绝对了。"
        }
      ]
    },
    {
      id: 209,
      title: "听力篇章（二）：细节题",
      minutes: 18,
      gist: "细节题考的是数字、钱、条件和否定；记数字时必须连「它修饰什么」一起记。",
      lesson: "细节题是听力篇章里数量最多的题型，答案是原文里的某一句话，问 when、how many、how much、why、where 这些具体信息。\n一、听前圈「不同点」：四个选项都是钱数，这题就考钱；都是时间，就考时间。听的时候只盯那一类词，其余内容放心放掉。\n二、答案位置和题号有关：第 1 题的信息一般在开头两句，最后一题的信息一般在结尾两句。听到后面的内容就说明前面漏了，立刻放手。\n三、三种必须动笔记的信息：\n· 数字与单位：twelve lockers、three days、one dollar。数字一定要连单位记下来——本关第一题就用「十二个柜子里的三个」来干扰「一共三个」。\n· 收费与条件：free for the first year、if you do not collect it in time。「服务免费」和「逾期要收费」是两件事，听力最爱把它们放在同一段里。\n· 否定与例外：however、but、only、if 后面的内容往往是出题点。\n四、只做一件事就够了：听到数字、时间、钱和条件句，立刻在选项旁写一个词，不要指望靠记忆。",
      usage: "看公告、听通知、查规定时，真正决定你能不能办成事的就是这些细节：几天内取、要不要钱、几点关门。",
      takeaways: [
        "细节题先圈选项里的不同点，只听那一类词",
        "数字要连单位一起记，「三个 / 十二个」是常见干扰",
        "「免费」与「逾期收费」这类对比信息最爱出题",
        "however、but、only、if 后面几乎必是考点"
      ],
      type: "listen",
      audioTip: "第一遍听到数字就在纸上写「数字 + 它修饰的东西」；第二遍核对收费条件和最后的计划。",
      taskTitle: "听力理解",
      taskCopy: "共 5 题，答对 4 题（80%）即可通关。听的时候手不要停，数字和条件都要写下来。",
      passRatio: 0.8,
      audio: [
        {
          file: "209-1.mp3",
          label: "听力篇章",
          voice: "女声",
          hint: "数字很多，注意每个数字修饰什么",
          transcript: "The city library has started a service called Books on the Move. From this month, readers can order books online and collect them from one of twelve lockers placed around the city, including three at underground stations. Each locker opens with a code sent to your phone, and you have three days to collect your book. If you do not collect it in time, the book goes back to the library and you pay a small fee of one dollar.\nThe service itself is free for the first year, and the library says it is aimed at people who work long hours and cannot reach a branch before it closes at five. In the first two weeks, more than three hundred people used the lockers, and most of them ordered novels. The library plans to add six more lockers near schools next spring if the trial is successful."
        }
      ],
      questions: [
        {
          q: "How many lockers has the library placed around the city?",
          options: ["Three.", "Six.", "Twelve.", "Three hundred."],
          answer: 2,
          explain: "原文 “one of twelve lockers placed around the city, including three at underground stations” —— 全城一共十二个，其中三个在地铁站。three 是十二个里面的三个，不是总数；three hundred 是前两周的使用人数，属于「同一个数字、不同的对象」的干扰。"
        },
        {
          q: "How long do readers have to collect a book?",
          options: ["One day.", "Three days.", "A week.", "Until the library closes."],
          answer: 1,
          explain: "原文 “you have three days to collect your book” —— 三天之内取书。同段里还有 one dollar（逾期费）和 five（图书馆关门时间），都是别的数字，听到就必须分清它们各自修饰什么。"
        },
        {
          q: "How much do readers pay if they do not collect a book in time?",
          options: ["One dollar.", "Nothing, because the service is free.", "Three dollars.", "The price of the book."],
          answer: 0,
          explain: "原文 “If you do not collect it in time… you pay a small fee of one dollar.” —— 逾期取书要付一美元。这里要分清两件事：服务本身第一年免费（The service itself is free for the first year），但逾期费照收。把「服务免费」理解成「什么都免费」，正是本题设下的陷阱。"
        },
        {
          q: "Why did the library start the service?",
          options: ["To sell more books.", "To reduce traffic in the city.", "To give students a place to study.", "To help people who cannot get to a branch before it closes."],
          answer: 3,
          explain: "原文 “it is aimed at people who work long hours and cannot reach a branch before it closes at five” —— 服务对象是「工作时间长、赶不上五点关门前到馆」的人。减少交通是新闻里常见的话题，但这段没有提；图书馆也不是卖书的地方。"
        },
        {
          q: "What will the library do if the trial is successful?",
          options: ["Close some of its branches.", "Open more lockers at underground stations.", "Add six more lockers near schools.", "Start charging readers for the service."],
          answer: 2,
          explain: "原文 “The library plans to add six more lockers near schools next spring if the trial is successful.” —— 如果试行成功，明年春天在学校附近再加六个柜子。地铁站的柜子已经有了，不是「接下来要做的事」；收费则与原文的 free for the first year 相反。"
        }
      ]
    },
    {
      id: 210,
      title: "听力篇章（三）：推断题",
      minutes: 20,
      gist: "推断题只推一步：身份、下一步动作、态度。多推一步，答案必错。",
      lesson: "推断题的答案不会直接出现在音频里，需要你往前走一步。题干通常是 What can we learn about…?、What will the speaker do next?、Who is the speaker?、What is the speaker's attitude…?。\n一、推断题只有三种「合理的一步」，超出这三种就一定是错的：\n· 从身份和场景推：听到 this office、our working hours、your team leader、sick days，就能推出「说话人是管理者，听众是员工」。\n· 从时间和计划推：Next week I will send round… 推出「下周会收到材料」。\n· 从用词和语气推态度：results were better than we expected、Nobody asked to go back、we will find a way to make it work，推出说话人对新安排有信心。\n二、推断题的两个禁区：\n· 不要把常识当答案。「早高峰很堵」听起来很有道理，但音频没提，就不能选。\n· 不要推得太远。原文说「下周发意见表」，选项说「下周开始执行新工时」，多走一步就是错的。\n三、做题顺序：先看选项。如果四个选项讲的都是「谁在说 / 接下来做什么 / 说话人怎么看」，这一段就一定会考推断，听的时候重点记「结论句」和「将来的动作」（next week、from June）。",
      usage: "听别人汇报时，真正要判断的往往是「他是赞成还是反对」「这事下一步怎么走」，说出来那句话只是线索。",
      takeaways: [
        "推断题只推一步：身份、下一步动作、态度",
        "不要拿常识当答案，音频没提的不能选",
        "推得太远的选项一定错，注意时态和程度",
        "选项集中在「谁 / 下一步 / 态度」，就说明考推断"
      ],
      type: "listen",
      audioTip: "第一遍只记「谁在对谁说话、接下来要做什么」；第二遍核对语气词，判断说话人的态度。",
      taskTitle: "听力理解",
      taskCopy: "共 5 题，答对 4 题（80%）即可通关。选项里如果没有原词，别慌 —— 那正是推断题。",
      passRatio: 0.8,
      audio: [
        {
          file: "210-1.mp3",
          label: "听力篇章",
          voice: "女声",
          hint: "先判断：谁在说？说给谁听？",
          transcript: "Good morning, everyone. Thank you for coming to the meeting at such short notice. Before I go through the figures, I want to talk about the change to our working hours. From June, everyone in this office will start at nine thirty instead of nine, and finish at six. We tested the idea in the design team for three months, and the results were better than we expected: they were late far less often, and the number of sick days fell by half. Nobody asked to go back to the old hours.\nI know some of you are worried about the traffic in the morning. That is exactly why we chose nine thirty — the worst of the rush hour is over by then. If you have to collect a child from school at five, speak to your team leader, and we will find a way to make it work. Next week I will send round the full figures and a short form where you can tell us what you think."
        }
      ],
      questions: [
        {
          q: "Who is the speaker most probably talking to?",
          options: ["Students at a university.", "Members of a sports club.", "Customers of a bank.", "Employees of a company."],
          answer: 3,
          explain: "音频里有 this office、our working hours、your team leader、sick days，再加上「开会」「改上班时间」这些信息，可以推出说话人是在对公司员工讲话。这题不能靠某一个单词，要靠几个词合起来推断场景，这正是推断题的基本做法。"
        },
        {
          q: "What can we learn about the three-month trial in the design team?",
          options: ["Staff were late less often and took fewer sick days.", "Most staff wanted to return to the old hours.", "It was stopped after two weeks.", "It made no difference to the team."],
          answer: 0,
          explain: "原文 “the results were better than we expected: they were late far less often, and the number of sick days fell by half. Nobody asked to go back to the old hours.” —— 迟到少了、病假减半。B 说的「多数人想改回旧时间」与 Nobody asked to go back 正好相反。"
        },
        {
          q: "Why did the company choose nine thirty as the new starting time?",
          options: ["To give staff more time for breakfast.", "To avoid the worst of the morning rush hour.", "Because the building opens late.", "Because the design team asked for it."],
          answer: 1,
          explain: "原文 “That is exactly why we chose nine thirty — the worst of the rush hour is over by then.” —— 九点半时早高峰最堵的一段已经过去。exactly why 是听力里非常明确的因果信号，听到它，答案就在后面。"
        },
        {
          q: "What will happen next week?",
          options: ["The new working hours will start.", "Staff will be paid more.", "The speaker will send out figures and a feedback form.", "The design team will move to another office."],
          answer: 2,
          explain: "原文 “Next week I will send round the full figures and a short form where you can tell us what you think.” —— 下周发数据和意见表。新工时是「从六月起」执行，不是下周，这就是「推得太远」的干扰项。"
        },
        {
          q: "What is the speaker's attitude towards the new working hours?",
          options: ["Doubtful about the change.", "Confident that it will work well.", "Angry about the complaints.", "Uninterested in the results."],
          answer: 1,
          explain: "从 “the results were better than we expected”“Nobody asked to go back” 到主动解释为什么选九点半、还说 “we will find a way to make it work”，说话人一直在为新安排做正面说明，态度是「有信心」。抱怨、怀疑、不关心，都与这些用词相反。"
        }
      ]
    },
    {
      id: 211,
      title: "短篇新闻：导语抓取法",
      minutes: 20,
      gist: "新闻是倒金字塔：第一句就是摘要，抓住它，一分钟的音频就变成十秒钟的信息。",
      lesson: "短篇新闻是四级听力最前面的一块，3 篇共 7 题，语速偏快、信息密度大，但它有一条非常好用的规律：导语（第一句）里几乎包含全部要点。\n一、新闻的写法是「倒金字塔」：最重要的事实在第一句，后面依次补充细节和背景。第一句通常同时回答四个问题：\nwho（谁）+ what happened（发生了什么）+ where（在哪儿）+ when（什么时候）。\n例：A fire broke out in a clothing factory on the edge of the city late last night.\n谁：一家服装厂｜什么：起火｜哪儿：城边｜何时：昨晚深夜。\n二、所以新闻题的做法是：第一句必须完整听懂。哪怕后面跟不上，主旨题的分数也已经拿到了。\n三、听到第一句之后，立刻在心里问「接下来会补什么」，通常只补这三样：\n· 伤亡与损失：nobody was injured、the damage is expected to cost…\n· 原因与调查：the fire had started in a store room、an investigation will begin…\n· 各方反应：officials say…、Some parents, however, say…\n四、新闻高频词：break out（火灾、战争）爆发、be under control 得到控制、injured 受伤的、investigation 调查、officials 官员、be expected to 预计。",
      usage: "刷英文新闻、听英文广播时，第一句就是整条新闻的摘要；抓住导语，你就能在几秒钟内判断这条新闻要不要继续听。",
      takeaways: [
        "新闻用倒金字塔结构，第一句就是全文摘要",
        "导语抓四要素：谁、发生了什么、在哪儿、什么时候",
        "第一句之后补的无非三类：伤亡损失、原因调查、各方反应",
        "第一句必须听懂，后面跟不上也能拿到主旨分"
      ],
      type: "listen",
      audioTip: "第一遍只抓每条新闻的第一句，用「谁 + 发生了什么」记两个词；第二遍再补细节。",
      taskTitle: "听力理解",
      taskCopy: "共 5 题，答对 4 题（80%）即可通关。两条新闻各听一遍，重点在第一句。",
      passRatio: 0.8,
      audio: [
        {
          file: "211-1.mp3",
          label: "短篇新闻",
          voice: "女声",
          hint: "第一句交代了谁、什么事、什么时候",
          transcript: "A fire broke out in a clothing factory on the edge of the city late last night. Nobody was injured, and firefighters brought the fire under control within two hours. The manager of the factory said the fire had started in a store room, and that the damage is expected to cost about two hundred thousand dollars. An investigation into the cause will begin this morning."
        },
        {
          file: "211-2.mp3",
          label: "短篇新闻",
          voice: "女声",
          hint: "导语之后，注意 however 引出的反面意见",
          transcript: "A city in the north has decided to give free bus travel to all school students from September. The plan will cost about four million dollars a year and is expected to help around sixty thousand students. City officials say the aim is to reduce the number of cars outside schools in the morning. Some parents, however, say the buses are already full at that time, and that more buses will be needed before the plan can work."
        }
      ],
      questions: [
        {
          q: "What is the first news item mainly about?",
          options: ["A traffic accident.", "A missing worker.", "A rise in clothing prices.", "A factory fire."],
          answer: 3,
          explain: "导语 “A fire broke out in a clothing factory on the edge of the city late last night.” 一句就交代了「服装厂起火」，这就是全文的摘要。交通事故、工人失踪、服装涨价都不在导语里，后面也没有提到，属于用同类话题编出来的干扰项。"
        },
        {
          q: "How long did it take the firefighters to control the fire?",
          options: ["About half an hour.", "About two hours.", "About six hours.", "About two days."],
          answer: 1,
          explain: "原文 “firefighters brought the fire under control within two hours” —— 两小时之内控制住火势。这条新闻里还有 two hundred thousand dollars（损失金额）和 late last night（时间），都是带着 two 的信息，必须听清数字修饰的对象。"
        },
        {
          q: "What will begin this morning?",
          options: ["The factory will reopen.", "The workers will be paid.", "An investigation into the cause of the fire.", "A meeting with the manager."],
          answer: 2,
          explain: "最后一句 “An investigation into the cause will begin this morning.” —— 今天上午开始调查起火原因。新闻的最后一句常常交代「下一步」，这一句经常出题，所以导语之后也别急着放松。"
        },
        {
          q: "What is the second news item mainly about?",
          options: ["Higher prices for city buses.", "Free bus travel for school students.", "A new railway line.", "A new school in the north."],
          answer: 1,
          explain: "导语 “A city in the north has decided to give free bus travel to all school students from September.” —— 北方某城市决定从九月起让所有学生免费坐公交。这道主旨题的答案同样在第一句，把导语听懂就够了。"
        },
        {
          q: "What do some parents say about the plan?",
          options: ["The buses are already full at that time.", "The plan costs too much money.", "Students live too far from school.", "The buses should be free for everyone."],
          answer: 0,
          explain: "原文 “Some parents, however, say the buses are already full at that time, and that more buses will be needed before the plan can work.” —— however 之后是家长的反面意见：那时候公交车已经满了。四百万美元的成本是官方给出的数字（The plan will cost about four million dollars a year），不是家长的抱怨，这是「张冠李戴」的干扰。"
        }
      ]
    },
    {
      id: 212,
      title: "同义替换与干扰项套路：限时冲刺",
      minutes: 25,
      gist: "正确答案多是同义替换，照抄原词的多半是陷阱；再加 15 分钟倒计时练纪律。",
      lesson: "四级听力的正确答案很少是「你听到的那个词」。出题人会把音频里的说法换成另一种说法，这就是同义替换；而把原词原句直接搬进选项的，往往是陷阱。这一关把最常见的套路一次讲完。\n一、同义替换的四种常见形式（例子散在前面几关的音频里，本关负责归类）：\n· 短语换短语：No such luck → 没抢到票；on the house → 免费。\n· 数字换说法：half the price → 便宜一半；quarter past five 与 closes at six → 中间还剩四十五分钟。\n· 具体换概括：sold out → 买不到；renew online → 书没逾期、不用还。\n· 句子换态度：results were better than we expected → 说话人有信心。\n二、干扰项的五个套路，做完题一定要回头认一遍：\n① 原词陷阱：选项照抄音频里的词，但答的不是题目问的那件事（听到某个数字，就跳到含这个数字却答非所问的选项）。\n② 数字干扰：一段话里出现好几个数字，分别修饰不同的东西。\n③ 部分正确：前半句对、后半句错（座位差 + 半价是一组，改成「座位更好」就全错了）。\n④ 张冠李戴：把 A 的说法安到 B 头上，把官方的数字当成市民的抱怨。\n⑤ 答非所问：选项内容音频里确实出现过，但它回答不了题干问的那个问题。\n三、限时冲刺的做法：本关有 15 分钟倒计时。考场上 25 题总共只有约 25 分钟，平均每题不到一分钟。听到不确认的题，先选一个、做个小记号，绝不回头纠结——把时间留给下一题，这是听力拿分最重要的一条纪律。",
      usage: "真实对话里没人会重复你的用词；同义替换听得懂，才算是真的听懂了英语，而不是听懂了那几个单词。",
      takeaways: [
        "正确答案多为同义替换，照抄原词的选项要警惕",
        "干扰项五套路：原词、数字、部分正确、张冠李戴、答非所问",
        "数字要连对象一起记：二十分钟、四十五分钟、一半价钱",
        "限时模式下不回头纠结，先选一个做记号"
      ],
      type: "listen",
      audioTip: "限时模式下先按考场节奏做一遍；复盘时再逐题问自己「这一题的同义替换是什么、干扰项属于哪一套路」。",
      taskTitle: "限时冲刺",
      taskCopy: "共 6 题，限时 15 分钟，答对 5 题（80%）即可通关。倒计时结束前请把答案都选上。",
      passRatio: 0.8,
      timeLimit: 15,
      audio: [
        {
          file: "212-1.mp3",
          label: "短对话",
          voice: "女声 + 男声",
          hint: "注意 No such luck、half the price 这类替换说法",
          transcript: "W: Did you manage to get a ticket for Friday's concert?\nM: No such luck. They sold out in twenty minutes. Still, I'm not too upset — I have a lot of reading to do anyway.\nW: Well, they've added a second show on Sunday afternoon. The seats aren't as good, but they're half the price.\nM: Half price? Then I'll take two. My sister has been asking me to go with her for weeks.\nW: You'd better hurry, though. The box office closes at six, and it's already quarter past five.\nM: Right. I'll book online on my way home."
        },
        {
          file: "212-2.mp3",
          label: "听力篇章",
          voice: "女声",
          hint: "把「谁最满意」和「谁最不满意」听成两件事",
          transcript: "A new report says that people who walk to work are happier with their daily journey than those who drive. Researchers asked five thousand workers in eight cities about their journeys. Those who walked gave the highest marks, followed by cyclists, while bus and underground passengers were the least satisfied, mainly because of crowding and delays. The report suggests that companies could help by paying for bicycles or by allowing staff to start work at different times."
        }
      ],
      questions: [
        {
          q: "What does the man mean by saying he had no such luck?",
          options: ["He was lucky enough to get a ticket.", "He failed to get a ticket.", "He did not want a ticket at all.", "He got a ticket at half price."],
          answer: 1,
          explain: "No such luck 是口语里的固定说法，意思是「没这个运气」——他接着说 “They sold out in twenty minutes.”（二十分钟就卖光了），所以是没买到票。twenty minutes 在这句话里是「售罄所用的时间」，所以答案要落在「没买到票」这个结果上，而不是照抄 twenty minutes 这个数字。"
        },
        {
          q: "What does the woman say about the Sunday show?",
          options: ["It has been cancelled.", "The seats are better and the tickets cost more.", "The tickets are half price but the seats are not as good.", "It will be held on Friday evening instead."],
          answer: 2,
          explain: "她说 “they've added a second show on Sunday afternoon. The seats aren't as good, but they're half the price.” —— 便宜一半，但座位差一些。B 把两个信息都反过来说了，属于「部分正确」的典型改法：只要有一个信息被改动，整个选项就作废。"
        },
        {
          q: "Why does the man decide to buy two tickets?",
          options: ["His sister has been asking him to go with her for weeks.", "His sister is singing in the show.", "He wants to invite a classmate instead.", "The second ticket is free."],
          answer: 0,
          explain: "原句 “My sister has been asking me to go with her for weeks.” —— 妹妹已经问了他好几周。买两张票的原因是妹妹想去；音频只说了 half the price（半价），并没有说第二张免费，这是把「半价」偷换成「免费」的干扰。"
        },
        {
          q: "How much time is left before the box office closes?",
          options: ["Fifteen minutes.", "Forty-five minutes.", "Half an hour.", "One hour."],
          answer: 1,
          explain: "女士说 “The box office closes at six, and it's already quarter past five.” —— 现在五点十五，六点关门，中间还有四十五分钟。十五分钟是「五点十五」这个数字本身，一小时是五点到六点，都是拿音频里的数字直接当答案的干扰项，必须自己减一次。"
        },
        {
          q: "What is the main finding of the report?",
          options: ["Drivers are the happiest with their daily journey.", "Cyclists are the least satisfied with their journey.", "People who walk to work are the most satisfied with their journey.", "The length of the journey makes no difference at all."],
          answer: 2,
          explain: "原文 “people who walk to work are happier with their daily journey than those who drive… Those who walked gave the highest marks, followed by cyclists, while bus and underground passengers were the least satisfied.” —— 走路通勤的人最满意；最不满意的是坐公交和地铁的人，不是骑车的（骑车排第二），这就是「张冠李戴」；开车的人则排在走路的人后面。"
        },
        {
          q: "What does the report suggest companies do?",
          options: ["Give staff free bus passes.", "Move their offices closer to where staff live.", "Ask all staff to walk to work.", "Pay for bicycles or allow flexible starting times."],
          answer: 3,
          explain: "原文 “companies could help by paying for bicycles or by allowing staff to start work at different times” —— 出钱买自行车，或者允许错开上班时间。让所有人都走路上班，是把「建议」说成了「强制」，属于推得太远；公交月票和搬家，原文都没有提。"
        }
      ]
    }
  ]
});