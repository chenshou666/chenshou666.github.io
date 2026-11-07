/* =====================================================================
 * HT Lab · 英语四级课程 · 模块 2：口语（10 关）
 * 关卡数据文件（每个模块一个文件，互不干扰）
 * 字段说明：
 *   id            关卡号（模块 2 → 3xx，与 C 语言课程 1-20 不冲突）
 *   type          quiz | listen | read | write | translate | speak | mock
 *   prompt        跟读 / 口语任务说明
 *   model         {file,text,voice}  示范朗读，音频放 ./audio/cet4/
 *   checklist     自评清单（全部打勾且录过音才算通关）
 *   questions     [{q,options,answer,explain}]  answer 为正确选项下标（从 0 起）
 *   passRatio     客观题通关线（0.8 = 答对 80%）
 * ===================================================================== */
window.CET4_MODULES = window.CET4_MODULES || [];
window.CET4_MODULES.push({
  id: "m2",
  name: "模块 2 · 口语",
  levels: [
    {
      id: 301,
      title: "说得让人听懂：句子重音与停顿",
      minutes: 15,
      gist: "不做音标，只解决三件事：重音放哪儿、在哪儿停顿、语调是升还是降。",
      lesson: "同一个句子，说得让人听懂靠三件事：重音、停顿、语调。这一关不碰音标，只讲「怎么读才不费解」。\n① 重音落在信息词上。名词、动词、形容词、副词、疑问词要读得重一点、长一点；冠词、介词、代词、be 动词、助动词一带而过。比如 I'd like to BOOK a TABLE for TWO. —— 如果每个词都用同样的力气读，对方反而抓不到重点。\n② 停顿按「意群」切，不按单词切。意群就是一口气能说完、意思完整的一小块：I'd like to book a table / for two / at seven o'clock. 斜线处停半拍，听众才跟得上。中国学生最常见的毛病是在每个词后面加一个「额」，把停顿变成了噪音——停顿要真的静音。\n③ 句末降调表示「我说完了」，升调表示「还没说完」或疑问。同样一句 Sorry，升调 Sorry? 是「没听清，请再说一遍」，降调 Sorry. 才是道歉。\n两个立刻见效的技巧：一是把语速降到平时的七成，重音和停顿才做得出来；二是数字、人名、地名单独放慢——fifteen 重音在第二个音节（fif-TEEN），fifty 重音在第一个音节（FIF-ty），说反了对方会记错。\n没听清时不要硬撑，用 Sorry, I didn't catch that. / Could you say it again, a little slower? 把节奏要回来，比装作听懂体面得多。",
      usage: "课堂回答、面试自我介绍、跟外国同事讲话，清楚永远比快重要；没听懂时用这几句把节奏要回来，对话才不会断。",
      takeaways: [
        "重音落在名词、动词、形容词、疑问词等信息词上，虚词一带而过",
        "停顿按意群切，不按单词切；停顿要静音，不要用「额」填空",
        "句末降调表示说完了，升调表示没说完或疑问；Sorry? 升调是请对方再说一遍",
        "数字先放慢：fifteen 重音在后，fifty 重音在前",
        "没听清就用 Sorry, I didn't catch that. 把节奏要回来"
      ],
      type: "speak",
      taskTitle: "跟读与自评",
      taskCopy: "先听示范，注意重音和停顿的位置；再跟着读两遍，录一段自己的声音回放对比，最后勾完自评清单。",
      prompt: "跟着示范音频逐句跟读，重点做两件事：把 fifteen 与 fifty 的重音差别读出来；在每句的意群处停半拍，不要在每个词后面加「额」。读完录一段自己的声音回放对比。",
      model: {
        file: "301-1.mp3",
        voice: "女声",
        text: "I said fifteen, not fifty.\nWould you like coffee or tea?\nSorry, I didn't catch that.\nCould you say it again, a little slower?"
      },
      checklist: [
        "我跟着示范音频读了两遍，并读出了 fifteen（重音在后）与 fifty（重音在前）的差别",
        "我在意群处停顿，没有在每个词后面加「额」",
        "我录了一段自己的朗读，回放时能听出至少 3 个重读的词",
        "示范里的 Sorry, I didn't catch that. 和 Could you say it again, a little slower? 我能不看文本说出来"
      ],
      passRatio: 0.8,
      questions: [
        {
          q: "想让对方听清你说的是「十五」而不是「五十」，最有效的做法是？",
          options: [
            "把整句话每个词都读得很重、很大声",
            "把 fifteen 说得又快又轻，一带而过",
            "把重音放在 fifteen 的第二个音节，并和 fifty 对比着说出来",
            "只用手势比划数字，不用管重音"
          ],
          answer: 2,
          explain: "英语靠重音位置区分信息：fifteen 重音在 -teen，fifty 重音在 fif-，两者元音也不同。整句都重读反而听不出重点，所以 A 无效；B 会把十五说得更像五十；D 在打电话、报数字的场合根本用不上。"
        },
        {
          q: "I'd like to book a table for two at seven o'clock. 最自然的停顿时机是？",
          options: [
            "I'd / like / to / book / a / table / for / two",
            "I'd like to book a table / for two / at seven o'clock.",
            "I'd like to / book a table for / two at seven o'clock.",
            "一口气不停，越快越好"
          ],
          answer: 1,
          explain: "停顿要按意群切：B 的三段各自是一个完整的意思块（订什么 / 几个人 / 几点）。A 是逐词停，听起来像机器人；C 把 a table for 和 two at 拆开了，意思块被切断；D 说得越快，重音和停顿越做不出来。"
        },
        {
          q: "对方报了一串数字，你没记下来。下面哪句既礼貌又能解决问题？",
          options: [
            "What?",
            "You speak too fast.",
            "I don't know English numbers.",
            "Sorry, I didn't catch that. Could you say it again, a little slower?"
          ],
          answer: 3,
          explain: "D 先说明「我没听清」，再提出具体请求（慢一点、再说一遍），对方知道该怎么做。A 太生硬；B 听起来像指责对方；C 既不真实，也没有把问题解决掉。"
        },
        {
          q: "关于「哪些词要重读」，下面哪种说法对？",
          options: [
            "名词、动词、形容词、疑问词等信息词要重读，冠词、介词、代词一带而过",
            "每个词都要重读才显得清楚",
            "只重读介词和冠词",
            "重音放在哪里对理解没有影响"
          ],
          answer: 0,
          explain: "信息词承载意思，所以要重读；虚词只起连接作用，弱读即可。B 会让听者抓不到重点；C 恰好读反了；D 与事实相反——重音位置一变，意思甚至可能跟着变。"
        },
        {
          q: "把 Sorry? 用升调说出来，通常表示什么？",
          options: [
            "道歉，我错了",
            "生气，不想再听",
            "没听清，请对方再说一遍",
            "结束这段对话"
          ],
          answer: 2,
          explain: "升调的 Sorry? 是「请再说一遍」，降调的 Sorry. 才是道歉。同一句话、不同语调，功能完全不同，这是英语口语里最容易吃亏的细节之一。"
        }
      ]
    },
    {
      id: 302,
      title: "寒暄与自我介绍（含 30 秒自我介绍模板）",
      minutes: 18,
      gist: "寒暄走完三步，自我介绍说满四句——第一次见面也不冷场。",
      lesson: "寒暄不是背句子，是走完三步：打招呼 → 一句客套问题 → 回应并反问。\n① 打招呼：初次见面用 Nice to meet you.；见过面了用 Nice to see you again.（用 meet 会被理解成「第一次见」）。熟人之间可以说 How's it going? / How have you been?。How do you do? 是极正式的问候，回答也是 How do you do?，日常几乎用不到。What's up? 只能对很熟的朋友说，回答 Not much.；对老师、面试官说会显得随便。\n② 客套问题：How was your weekend? / How's your project going? / Are you busy these days?\n③ 回应并反问：Pretty good, thanks. How about you? —— 只回答不反问，对话就断了。\n30 秒自我介绍模板（四句，按「名字 → 身份 → 一个细节 → 收尾」）：\n1) Hi, I'm Li Ming. Nice to meet you.\n2) I'm a second-year student in the English Department.（已经工作了就说 I work as a designer at a small company.）\n3) In my free time I like playing badminton and watching documentaries.（说具体的事，别只说 I like sports.）\n4) Anyway, it was nice talking to you. / I'm looking forward to working with you.（同学之间用 See you around.）\n两个常见的坑：一是自我介绍别用 Myself Li Ming, come from Nanjing. 这种中式说法，说 I'm Li Ming, from Nanjing. 就够；二是收尾别说 That's all, thank you.——那是应试腔，真实交流里显得突兀。",
      usage: "新生见面会、社团招新、面试开场、行业活动上认识新朋友，都靠这三步加四句撑住前 30 秒。",
      takeaways: [
        "寒暄三步：打招呼 → 客套问题 → 回应并反问",
        "初次见面用 Nice to meet you.，再次见面用 Nice to see you again.",
        "What's up? 只对熟朋友说；对老师、面试官要用正式问候",
        "30 秒自我介绍四句：名字 → 身份 → 一个细节 → 收尾",
        "收尾用 nice talking to you / See you around.，别说 That's all, thank you."
      ],
      type: "speak",
      taskTitle: "跟读与自评",
      taskCopy: "先听示范，再按四句模板说一遍自己的版本；录音回放，最后勾完自评清单。",
      prompt: "先跟读示范音频（示范里读了寒暄开场、自我介绍主干句和收尾句），再把里面的信息换成你自己的：名字、身份、一个具体爱好、一句收尾，录一段 20–30 秒的完整自我介绍。",
      model: {
        file: "302-1.mp3",
        voice: "女声",
        text: "Hi, I'm Li Ming. Nice to meet you.\nI'm a second-year student in the English Department.\nIn my free time I like playing badminton and watching documentaries.\nAnyway, it was nice talking to you. See you around."
      },
      checklist: [
        "我跟着示范音频读了一遍，注意了 Nice to meet you. 用的是 meet（初次见面）",
        "我照着四句模板，录了一段 20–30 秒的自我介绍：名字 / 身份 / 一个具体细节 / 收尾",
        "我能不看文本说出至少 3 句寒暄开场，并说清 Nice to meet you. 和 Nice to see you again. 的区别",
        "我练了一次「打招呼 → 客套问题 → 回应并反问」的完整三步"
      ],
      passRatio: 0.8,
      questions: [
        {
          q: "第一次见到某个人，握手时最得体的说法是？",
          options: [
            "Nice to see you again.",
            "Nice to meet you.",
            "What's up?",
            "Long time no see."
          ],
          answer: 1,
          explain: "初次见面用 Nice to meet you.。A 里的 again 说明以前见过；C 是熟人之间的随意问候；D 是「好久不见」，同样以「以前见过」为前提，三句都和「第一次见面」矛盾。"
        },
        {
          q: "第一次见面的对象是你的任课老师，下面哪句最得体？",
          options: [
            "What's up?",
            "Hey, man!",
            "How's it going?",
            "Good morning, Professor Smith. Nice to meet you."
          ],
          answer: 3,
          explain: "对老师要用正式问候加称呼（Professor / Dr. + 姓）。A、B 是朋友之间的说法；C 偏随意，同学之间没问题，但用在第一次见面的老师身上不如 D 稳妥。"
        },
        {
          q: "自我介绍里，下面哪一句最地道？",
          options: [
            "I'm a second-year student in the English Department.",
            "I am a student who study in English Department.",
            "Myself Li Ming, come from Nanjing.",
            "I am Li Ming, my hometown is Nanjing, I study English, I like sports, that's all thank you."
          ],
          answer: 0,
          explain: "A 语法正确、信息清楚。B 的定语从句里 study 应为 studies，而且还缺冠词 the；C 是典型的中式英语（Myself… come from…）；D 把信息堆在一起，也没有可用的收尾。"
        },
        {
          q: "上周在活动上认识的同学，今天又碰到了，最合适的开场是？",
          options: [
            "Nice to meet you.",
            "How do you do?",
            "Nice to see you again.",
            "Excuse me, who are you?"
          ],
          answer: 2,
          explain: "再次见面用 see，用 meet 会让对方以为你忘了他是谁。B 是极正式的初次问候语，日常基本不用；D 既失礼又否定了上一次见面。"
        },
        {
          q: "在一次真实的交流活动里（不是考试），自我介绍结束时说哪句最自然？",
          options: [
            "That's all, thank you.",
            "Anyway, it was nice talking to you.",
            "OK, finished.",
            "You can ask me now."
          ],
          answer: 1,
          explain: "B 既收住话头，又表达了善意。A 是应试腔，在真实对话里像在等考官打分；C、D 都太生硬，D 更像在下命令。"
        }
      ]
    },
    {
      id: 303,
      title: "日常场景：点餐、购物、问路",
      minutes: 20,
      gist: "三个场景三套话，重点是句式和语气：同一件事，加不加 please 差别很大。",
      lesson: "三个场景，三套话。\n① 点餐：进门要位子说 A table for two, please. / Do you have a table by the window?；点单说 I'll have the chicken salad, please. 或 Could I get a coffee, no sugar?；问推荐说 What do you recommend?；结账说 Could we have the bill, please?（美式用 check），要分开付说 Can we split the bill?。\n语气值得单独说：Give me a coffee. 语法没错，但像命令；加上 please 或换成 Could I get…? 立刻变礼貌。I want… 也偏直接，I'd like… 更稳。\n② 购物：问尺码 Do you have this in a medium?；想试穿说 Can I try it on?（宾语是代词时必须放在 on 前面，不能说 try on it）；问折扣 Is there any discount on this?；退换 Can I get a refund?（退款）/ Could I exchange it for a larger size?（换货）。\n③ 问路：开头用 Excuse me——它是「打扰一下」；Sorry 主要用于道歉，或者真的撞到、挤到别人时。口语里偶尔也听得到有人用 Sorry 起头问路，但标准、最稳的说法是 Excuse me。完整句式是 Excuse me, could you tell me how to get to the train station?；想确认远近问 Is it within walking distance?；听完指路要复述确认：So, straight ahead and then left at the second set of traffic lights? Thank you. 这一步能立刻纠正听错的方向。",
      usage: "出国旅行、在外地吃饭买东西、城市里向路人问路，靠的就是这一关的句式；把 please 和 Could I…? 用顺手，别人对你的态度都会不一样。",
      takeaways: [
        "点餐用 I'll have… / Could I get…，不用 Give me…",
        "结账说 Could we have the bill, please?，分开付说 Can we split the bill?",
        "试穿是 try it on；问尺码 Do you have this in a medium?",
        "问路用 Excuse me 开头，不用 Sorry",
        "听完指路要复述确认，防止走错方向"
      ],
      type: "speak",
      taskTitle: "跟读与自评",
      taskCopy: "先听示范（点餐 + 问路），再分别练一次购物对话；录音回放，最后勾完自评清单。",
      prompt: "跟着示范音频跟读点餐和问路的句子，注意 please 的位置和 Excuse me 的开头；再用讲解里的三句购物用语（Do you have this in a medium? / Can I try it on? / Is there any discount on this?）自己说一遍，录音回放。",
      model: {
        file: "303-1.mp3",
        voice: "女声",
        text: "Good evening. A table for two, please.\nI'll have the chicken salad, please.\nExcuse me, could you tell me how to get to the train station?\nIs it within walking distance? Thank you."
      },
      checklist: [
        "我跟着示范音频读了一遍点餐和问路的句子，注意了 please 的位置",
        "我用 I'll have… 和 Could I get… 各造了一句点餐的话，并说了一遍",
        "我按讲解里的三句购物用语（问尺码 / 试穿 / 问折扣）自己演了一遍",
        "我能说出问路为什么用 Excuse me 而不是 Sorry，并用复述确认的方式收尾一次"
      ],
      passRatio: 0.8,
      questions: [
        {
          q: "走进餐厅，对服务员说哪句最得体？",
          options: [
            "Give me a table for two.",
            "I want a table.",
            "Table two, please.",
            "A table for two, please."
          ],
          answer: 3,
          explain: "D 句式自然又带 please。A 是命令句，很生硬；B 意思能懂但缺少礼貌；C 的意思是「要二号桌」，和「两个人的桌子」完全是两回事。"
        },
        {
          q: "在服装店想试穿一件衣服，应该说？",
          options: [
            "Can I try it on?",
            "Can I try on it?",
            "I want to test it.",
            "Let me wear it."
          ],
          answer: 0,
          explain: "try on 是「试穿（衣物）」的固定搭配，宾语是代词时必须放在 on 前面：try it on。B 把代词放到了 on 后面，是中国学生最常见的词序错误；C 的 test 用于测试产品性能，不是试穿；D 既不合语法，也不礼貌。"
        },
        {
          q: "在街上向陌生人问路，最合适的开头是？",
          options: [
            "Sorry, where is the station?",
            "Hey, station?",
            "Excuse me, could you tell me how to get to the station?",
            "You, tell me the way to the station."
          ],
          answer: 2,
          explain: "问路最稳的开头是 Excuse me（打扰一下）；Sorry 主要用于道歉，或者真的妨碍到别人时。C 既礼貌，又有完整的请求句式；A 只丢出一个直接问句，缺少请求句式，语气也不如 C 缓和；B、D 都太唐突。"
        },
        {
          q: "吃完饭想请服务员结账，说哪句最自然？",
          options: [
            "I want to pay now.",
            "Could we have the bill, please?",
            "Give me the money list.",
            "Where is the money?"
          ],
          answer: 1,
          explain: "B 是英语里的标准说法（美式可说 check）。A 语法没错，但语气生硬，像在催账；C、D 是中式直译，对方听不懂你要什么。"
        },
        {
          q: "对方指路说 Go straight ahead and turn left at the second set of traffic lights. 为了确认没听错，最好的回应是？",
          options: [
            "I don't know.",
            "You say again, please.",
            "What did you say?",
            "So, straight ahead and then left at the second set of traffic lights? Thank you."
          ],
          answer: 3,
          explain: "D 用 So,…? 复述一遍，既能确认，也给了对方纠正的机会，是问路时最稳的一步。B 不是地道英语（repeat 本身已含「再说一次」）；C 过于直接；A 会让对方重新解释一遍，白白浪费时间。"
        }
      ]
    },
    {
      id: 304,
      title: "出行：交通、机场、酒店入住",
      minutes: 20,
      gist: "把时间、地点、座位、行李四件事说明白，出行就不慌。",
      lesson: "出行场景的关键是「说清楚时间、地点、座位和行李」。\n① 交通：买票说 I'd like a return ticket to Bath, please.（英式 return 是往返票，美式说 round trip，单程英式是 single、美式是 one way）。问站台和换乘：Which platform does the train leave from? / Do I need to change trains? / How many stops is it? 打车说 Could you take me to the airport, please? / Please drop me at Terminal 2.\n② 机场：值机说 I'd like to check in for the flight to Boston.；要座位说 Could I have an aisle seat, please?（aisle 是靠过道，window 是靠窗）；行李说 I have one suitcase to check in. Is it within the weight limit?；问登机口 Which gate is it?；问延误 Is the flight delayed? / How long is the delay?\n③ 酒店：入住说 I have a reservation under the name Li. / I booked a double room for two nights.；问早餐 Is breakfast included?；问 Wi-Fi Could you tell me the Wi-Fi password?；退房说 I'd like to check out.，想寄存行李说 Could I leave my luggage here until this afternoon?\n两个高频错误：一是 check in 是办理登机或入住，check out 是退房结账，别混用；二是「住酒店」是 stay at a hotel，不是 live in a hotel——live 指的是长期居住。另外 I want a window seat. 不算错，但在柜台前说 Could I have a window seat, please? 会顺耳得多。",
      usage: "自助旅行、出差、接送朋友，从买票、值机到入住退房，这一关的句子几乎能一路用下来。",
      takeaways: [
        "往返票英式 return ticket、美式 round trip；单程 single / one way",
        "要座位说 Could I have an aisle seat, please?（aisle 过道，window 靠窗）",
        "酒店报预订：I have a reservation under the name Li.",
        "check in 是登机 / 入住，check out 是退房结账，别混用",
        "住酒店是 stay at a hotel，不是 live in a hotel"
      ],
      type: "speak",
      taskTitle: "跟读与自评",
      taskCopy: "先听示范（值机 + 酒店入住），再按「订票 → 值机 → 入住 → 退房」串一遍；录音回放，最后勾完自评清单。",
      prompt: "跟着示范音频跟读值机和酒店入住的句子，注意 I'd like to… 和 Could I have…, please? 的礼貌句式；再按订票、值机、入住、退房四个环节各说两句，录一段自己的出行对话。",
      model: {
        file: "304-1.mp3",
        voice: "女声",
        text: "Good morning. I'd like to check in for the flight to Boston.\nCould I have an aisle seat, please?\nI have one suitcase. Also, I have a reservation under the name Li, for two nights."
      },
      checklist: [
        "我跟着示范音频读了一遍值机和酒店入住的句子",
        "我用 I'd like to check in for… 和 Could I have…, please? 各造了一句，并说了出来",
        "我能说清 check in 与 check out 的区别，并各造一句",
        "我按「订票 → 值机 → 入住 → 退房」的顺序自己串了一遍，每个环节至少 2 句"
      ],
      passRatio: 0.8,
      questions: [
        {
          q: "在机场办理登机手续（值机），最地道的说法是？",
          options: [
            "I'd like to check in for the flight to Boston.",
            "I want to live in the plane.",
            "I need to sit on the plane.",
            "Check my ticket now."
          ],
          answer: 0,
          explain: "check in 是「办理登机手续」的固定说法，办完拿到的是 boarding pass（登机牌）。B、C 表达错误；D 是命令句，也不是值机的说法。"
        },
        {
          q: "想坐靠过道的座位，应该说？",
          options: [
            "I want a seat near the door.",
            "Give me the aisle.",
            "Could I have an aisle seat, please?",
            "I like to walk in the plane."
          ],
          answer: 2,
          explain: "aisle seat 是「靠过道座位」，靠窗是 window seat。C 用了 Could I have…, please?，在柜台前最得体。A 意思不准确（近门不等于靠过道）；B 生硬且不完整；D 表达错误。"
        },
        {
          q: "到酒店前台，下面哪句能最快让对方查到你的预订？",
          options: [
            "I want a room now.",
            "I have a reservation under the name Li.",
            "Give me the best room.",
            "Where can I sleep?"
          ],
          answer: 1,
          explain: "报预订讲 reservation under the name + 姓，前台立刻就能查到。A、C、D 都没有提供任何预订信息，前台只能重新问一遍。"
        },
        {
          q: "退房后想把行李寄存在前台、下午再来取，最合适的说法是？",
          options: [
            "Keep my bag.",
            "I want to put my bag here.",
            "Can I leave my bag in the room?",
            "Could I leave my luggage here until this afternoon?"
          ],
          answer: 3,
          explain: "D 把两个关键信息都说了：「寄存在这里」和「到下午」，前台马上能安排。C 是「留在房间里」，退房后房间要清出来，前台没法照做；A 是命令句；B 表达含糊，对方不知道你是要寄存，还是只是暂时放下。"
        },
        {
          q: "在英国想买一张「往返票」，应该说？",
          options: [
            "A return ticket, please.",
            "A back ticket, please.",
            "Two tickets, please.",
            "A ticket to go and back."
          ],
          answer: 0,
          explain: "英式往返票是 return ticket（美式 round trip）；单程英式是 single、美式 one way。C 的意思是「两张票」，和往返无关；B、D 都不是英语里的说法。"
        }
      ]
    },
    {
      id: 305,
      title: "打电话与预约（改约、留言）",
      minutes: 20,
      gist: "电话里先自报家门，再学会改约和留言；顺便弄清 Never mind 到底用在哪。",
      lesson: "英语打电话有一条硬规则：先自报家门，再找人。\n① 开场：Hello, this is Li Ming speaking. / Hi, this is Li Ming from the English Department.；找人说 Could I speak to Mr. Brown, please?；接电话的如果就是本人，会回答 Speaking.；需要对方等一下说 Could you hold on a moment, please?；要找的人不在，说 I'm afraid he's in a meeting. Can I take a message?\n② 留言三件套：谁打的、什么事、怎么回电。Could you tell him Li Ming called? Could you ask him to call me back? My number is 5550 1234. 没听清号码时说 Could you repeat that? Let me read it back to you.——复述一遍能避免记错数字。\n③ 预约与改约：预约 I'd like to make an appointment with Dr. Green. / Would tomorrow morning be possible?；改约 I'm afraid I have to reschedule our appointment. Something has come up. Could we move it to Thursday?；取消 I'm sorry, but I need to cancel tomorrow's appointment.\n礼貌差异是这一关的重点：I'm afraid 在这里不是「害怕」，而是礼貌地引出坏消息；问对方身份要说 May I ask who's calling?，Who are you? 像在质问；让人稍等说 Could you hold on a moment, please?，比 Wait a moment. 客气得多。\n还有一个常被误用的词：Never mind 用来回应道歉（对方说 Sorry，你回答 Never mind. 就是「没关系」），或者表示「算了，不用了」；它不能用来回应感谢——别人说 Thank you，要回答 You're welcome. / No worries. / My pleasure.。",
      usage: "给公司打电话咨询、跟医生或导师改约、给同事留口信，都靠这一关的三件套；礼貌用语用对了，事情办起来会顺很多。",
      takeaways: [
        "电话开场先自报家门：Hello, this is Li Ming speaking.",
        "找人说 Could I speak to…, please?；对方就是本人会回答 Speaking.",
        "留言三件套：谁打的、什么事、怎么回电；号码要复述确认",
        "改约用 I'm afraid I have to reschedule… + 具体新时间",
        "Never mind 回应道歉，不回应感谢；回应感谢用 You're welcome. / No worries."
      ],
      type: "speak",
      taskTitle: "跟读与自评",
      taskCopy: "先听示范（电话开场 + 改约 + 请对方回电），再自己说一遍留言三件套；录音回放，最后勾完自评清单。",
      prompt: "跟着示范音频跟读电话开场、改约和请求回电的句子，注意 I'm afraid 的语气；再用留言三件套（谁打的 / 什么事 / 怎么回电）完整说一遍，录音回放对比。",
      model: {
        file: "305-1.mp3",
        voice: "女声",
        text: "Hello, this is Li Ming speaking.\nCould I speak to Mr. Brown, please?\nI'm afraid I have to reschedule our appointment.\nWould Thursday morning be possible?\nCould you ask him to call me back?"
      },
      checklist: [
        "我跟着示范音频读了一遍电话开场和改约的句子",
        "我用 This is… speaking. 和 Could I speak to…, please? 各说了一遍",
        "我练了一次完整的留言：谁打的、什么事、怎么回电，三样都说到了",
        "我能说清 Never mind 用在回应道歉、不用于回应感谢，并各举一例"
      ],
      passRatio: 0.8,
      questions: [
        {
          q: "电话接通，你要找的人正好就是接电话的人，对方最可能说哪句？",
          options: [
            "Who are you?",
            "Wait!",
            "Speaking.",
            "You are wrong."
          ],
          answer: 2,
          explain: "Speaking. 是英语电话里的固定说法，意思是「我就是（你要找的人）」。A 像在质问；B 是命令；D 与语境无关。"
        },
        {
          q: "接电话时想确认对方身份，最礼貌的问法是？",
          options: [
            "Who are you?",
            "May I ask who's calling?",
            "What's your name?",
            "Tell me your name."
          ],
          answer: 1,
          explain: "May I ask who's calling? 是英语电话里的标准礼貌问法。A、C、D 都像在盘问对方，尤其在职场电话里很失礼。"
        },
        {
          q: "需要把明天的约见改到下周，最得体的说法是？",
          options: [
            "I want to change my appointment.",
            "I can't come. Change it.",
            "Sorry, I'm busy tomorrow, you know.",
            "I'm afraid I need to reschedule tomorrow's appointment. Could we move it to next week?"
          ],
          answer: 3,
          explain: "D 先用 I'm afraid 缓和语气，再提出具体的新时间，对方可以直接安排。A 直接但欠客气；B 是命令；C 只说了原因，没有替代方案，对方没法接。"
        },
        {
          q: "打电话的人想留话让同事回电，哪句最完整？",
          options: [
            "Could you ask him to call me back? My number is 5550 1234.",
            "Tell him I called.",
            "He knows.",
            "I will call later maybe."
          ],
          answer: 0,
          explain: "留言必须交代「回电」和「联系方式」，A 两样都有。B 缺号码，对方可能联系不上你；C、D 没有传递任何可用的信息。"
        },
        {
          q: "你给老师打电话，接电话的是他的同事，你想留个口信，下面哪句最合适？",
          options: [
            "Tell him to call me.",
            "He must call me back today.",
            "Could you pass on a message? I'd like him to call me back when he's free.",
            "I'll wait until he comes back."
          ],
          answer: 2,
          explain: "C 用 Could you pass on a message? 提出请求，并说明「方便时回电」，对方能照做也不为难。A、B 是命令句，对老师的同事说很不合适；D 没有留下任何信息，事情办不成。"
        }
      ]
    },
    {
      id: 306,
      title: "校园：课堂提问、小组讨论、跟老师沟通",
      minutes: 20,
      gist: "先给信号再提问，先承认对方再补充——校园英语的两条基本礼貌。",
      lesson: "校园英语的三条主线：课堂提问、小组讨论、跟老师沟通。\n① 课堂提问：先给信号，再问具体问题。Excuse me, Professor. Could I ask a question about the reading? / I didn't quite follow the part about the second experiment. Would you mind going over it again? 没听懂时可以说 Sorry, I'm not sure I understand. Do you mean that…?\n最重要的一条：teacher 在英语里不是称呼语，不能叫 Teacher, I have a question.。称呼老师用 Professor / Dr. + 姓，或者干脆用 Excuse me 开头。\n② 小组讨论：开场 Shall we start with the first question? / Who'd like to take notes?；插话 Can I jump in here? / That's a good point. I'd like to add something.；时间不够 Sorry to interrupt, but we're running out of time. Maybe we should move on.；收尾 Let's sum up. So we agree that…。不同意别人时说 I see it a bit differently. 或 That's a good point, but…，不要只说 You're wrong.。\n③ 跟老师沟通：问作业 Could you clarify when we need to hand in the report? / Is the deadline this Friday or next Monday?；约时间 I was wondering if I could come by during your office hours. Would Tuesday afternoon work for you?；请假或延期 I'm afraid I can't make it to class tomorrow. Would it be possible to get an extension?\n最后一句提醒：请别人重复或放慢，用 Would you mind going over that part again? / Could you speak a little more slowly?，不要说 Say it again. / Speak slowly. 这种命令句。",
      usage: "留学课堂、外教课、小组作业、跟导师约见面，这一关的句子直接决定老师愿不愿意多帮你一把。",
      takeaways: [
        "英语里 teacher 不作称呼语，称呼老师用 Professor / Dr. + 姓",
        "提问先给信号：Excuse me, Professor. Could I ask a question about…?",
        "讨论插话用 Can I jump in here?；不同意说 I see it a bit differently.",
        "请老师重复用 Would you mind going over that part again?",
        "约时间用 I was wondering if I could come by during your office hours."
      ],
      type: "speak",
      taskTitle: "跟读与自评",
      taskCopy: "先听示范（课堂提问 + 请求再讲一遍 + 讨论接话），再自己录一段 30 秒模拟；最后勾完自评清单。",
      prompt: "跟着示范音频跟读课堂提问和讨论接话的句子；再录一段约 30 秒的模拟：先向老师提一个具体问题，再说一遍没听懂、请老师再讲一次。",
      model: {
        file: "306-1.mp3",
        voice: "女声",
        text: "Excuse me, Professor. Could I ask a question about the reading?\nSorry, I didn't quite follow. Would you mind going over it again?\nThat's a good point, but I see it a bit differently."
      },
      checklist: [
        "我跟着示范音频读了一遍课堂提问和讨论接话的句子",
        "我用 Could I ask a question about…? 向老师提了一个具体问题，并说了出来",
        "我练了一句「先承认对方再补充」的话：That's a good point, but…",
        "我录了一段约 30 秒的模拟：提问 + 请老师再讲一遍，并且没有用 Teacher 当称呼"
      ],
      passRatio: 0.8,
      questions: [
        {
          q: "课上想向老师提问，最地道的开头是？",
          options: [
            "Teacher, I have a question.",
            "Excuse me, Professor. Could I ask a question?",
            "I want to ask.",
            "Question!"
          ],
          answer: 1,
          explain: "英语里 teacher 不是称呼语，称呼老师要用 Professor / Dr. + 姓，或直接用 Excuse me 起头。C 太直白、缺少礼貌句式；D 是把课堂当成了抢答现场。"
        },
        {
          q: "没听懂老师讲的那部分，想请她再讲一遍，说哪句最合适？",
          options: [
            "Would you mind going over that part again?",
            "Say it again.",
            "I don't understand anything.",
            "You speak too fast."
          ],
          answer: 0,
          explain: "Would you mind + 动名词 是英语里最委婉的请求之一。B 是命令句；C 说得太绝对，也把问题全推给老师；D 听起来像抱怨，老师会觉得你在挑她的毛病。"
        },
        {
          q: "小组讨论中你想插一句补充，最合适的是？",
          options: [
            "Stop, listen to me.",
            "I talk now.",
            "Can I jump in here?",
            "You are wrong."
          ],
          answer: 2,
          explain: "Can I jump in here? 是英语讨论里常用的「我插一句」。A、D 冲突性太强，会打断小组的合作气氛；B 语法和礼貌都不合适。"
        },
        {
          q: "期末报告的截止时间你没听清，想请老师说明，哪句最合适？",
          options: [
            "When we hand in the report?",
            "Tell me the deadline.",
            "Repeat the deadline.",
            "Could you clarify when we need to hand in the report?"
          ],
          answer: 3,
          explain: "D 用 Could you clarify… 礼貌地把要求说清楚，信息也完整。A 缺谓语，是残句；B、C 都是命令句，对老师说不合适。"
        },
        {
          q: "想在老师的 office hours 去问问题，最得体的说法是？",
          options: [
            "You must meet me Tuesday.",
            "I was wondering if I could come by during your office hours.",
            "I will come to your office.",
            "When are you free? I need you."
          ],
          answer: 1,
          explain: "I was wondering if… 是最常用的委婉请求句式，给对方留了拒绝的余地。A、D 语气太强；C 只是通知对方，没有征求意见。"
        }
      ]
    },
    {
      id: 307,
      title: "职场：会议发言、汇报进度、同事寒暄",
      minutes: 20,
      gist: "汇报用三句结构：进展、问题、下一步；寒暄则要守住隐私边界。",
      lesson: "职场英语只有两个关键词：清楚、留余地。\n① 会议发言：插话说 Could I add something here? / Do you mind if I add a quick point?；表明自己的角度 From my side, … / On the marketing side, we've seen…；提建议 I'd suggest we… / Have we considered…?；收尾 That's all from me. Thanks. / I'll follow up by email.\n② 汇报进度，用三句结构：进展 → 问题 → 下一步。\n· 进展：We've finished the first draft of the report. / The testing is about 80% done.\n· 问题：We're running a bit behind schedule. / We're still waiting for the client's feedback.\n· 下一步：We plan to send it out by Friday. / I'll need two more days to finish it.\n承诺时间要留余地：有把握才说 I'll send it out by Friday.；没把握就说 I'll try to get it to you by Friday.\n③ 同事寒暄：How was your weekend? / How's the new project going? / Are you busy these days?；结束用 Anyway, I'd better get back to work. / Let's catch up later.\n两个边界：一是隐私，薪水、年龄、婚姻、宗教、政治都不要主动问，How much do you earn? 在英语职场里非常失礼；二是催进度，别用 You are late.，换成 How are we doing on the report? Do you need anything from me?——既问到了进度，又给了支持。要拒绝请求时，记得给替代方案：I'm afraid I can't take that on this week. Would next Monday work?",
      usage: "周会发言、给客户或主管同步进度、茶水间跟同事聊两句，这三件事几乎每天都会遇到。",
      takeaways: [
        "会议插话说 Could I add something here?",
        "汇报用三句结构：进展 → 问题 → 下一步",
        "承诺时间要留余地：I'll try to get it to you by Friday.",
        "寒暄避开薪水、年龄、婚姻这类隐私话题",
        "催进度别用 You are late.，用 How are we doing on…? 更专业"
      ],
      type: "speak",
      taskTitle: "跟读与自评",
      taskCopy: "先听示范（进度汇报 + 会议插话），再按三句结构汇报一件自己的事；录音回放，最后勾完自评清单。",
      prompt: "跟着示范音频跟读进度汇报和会议插话的句子，注意 we 的使用（汇报用 we 比 I 更专业）；再用「进展 → 问题 → 下一步」三句结构，录一段自己工作的口头汇报。",
      model: {
        file: "307-1.mp3",
        voice: "女声",
        text: "Good morning, everyone. Just a quick update on the report.\nWe've finished the first draft, but we're still waiting for the client's feedback.\nI'll send it out by Friday.\nCould I add one more thing?"
      },
      checklist: [
        "我跟着示范音频读了一遍进度汇报的句子",
        "我按「进展 → 问题 → 下一步」三句结构汇报了一件自己的事",
        "我用 Could I add something here? 练了一次会议插话",
        "我准备了 3 句同事寒暄，并确认里面没有薪水、年龄这类隐私话题"
      ],
      passRatio: 0.8,
      questions: [
        {
          q: "会议上你想补充一句，最合适的是？",
          options: [
            "Listen to me.",
            "I want to say something.",
            "Wait, I talk.",
            "Could I add something here?"
          ],
          answer: 3,
          explain: "D 是开会时标准的「我补充一句」，既礼貌又明确。B 太直白，像在抢话；A、C 是命令句，语法也不对。"
        },
        {
          q: "汇报进度时，下面哪句既说明困难又不显得推卸责任？",
          options: [
            "It's not my fault that we're late.",
            "We're a bit behind schedule, and we're still waiting for the client's feedback.",
            "The report is finished.",
            "I don't know when it will be ready."
          ],
          answer: 1,
          explain: "B 先讲事实（进度落后），再讲原因（在等客户反馈），客观又给了对方判断依据。A 一开口就撇清自己，反而显得不专业；C 与「进度落后」的语境矛盾；D 没有提供任何有用信息。"
        },
        {
          q: "你想说明测试大约完成了 80%，哪句最自然？",
          options: [
            "The testing is about 80% done.",
            "We do the testing eighty.",
            "Testing finished eighty percent.",
            "I finish 80 testing."
          ],
          answer: 0,
          explain: "A 用 is about 80% done 表示「大约完成了八成」，是职场里的常见说法。B、D 语法不通；C 缺冠词、时态也不合适。"
        },
        {
          q: "同事问你 How was your weekend?，哪种回应最自然？",
          options: [
            "It's none of your business.",
            "Pretty good, thanks. I went hiking with a friend. How about you?",
            "Why do you ask?",
            "I don't want to talk about it."
          ],
          answer: 1,
          explain: "B 是英语寒暄的标准结构：简短回答 + 一个具体细节 + 反问对方。A、D 直接拒绝交流；C 反问得像在质问，会让对方尴尬。"
        },
        {
          q: "在英语职场里，下面哪个问题最好别主动问同事？",
          options: [
            "How's the new project going?",
            "Did you do anything nice at the weekend?",
            "Would you like a coffee?",
            "How much do you earn?"
          ],
          answer: 3,
          explain: "薪水在英语职场属于隐私，主动问会让人很不舒服。A、B、C 分别是聊工作、聊周末和递一杯咖啡，都是安全的日常寒暄。"
        }
      ]
    },
    {
      id: 308,
      title: "表达观点与礼貌反驳（That's a good point, but…）",
      minutes: 20,
      gist: "先承认对方，再提出不同，最后给替代方案——反驳也可以不得罪人。",
      lesson: "表达观点的最小结构是三句：引出 → 支撑 → 收束。\n· 引出：In my opinion, … / As far as I'm concerned, … / I'd say that…\n· 支撑：The main reason is that… / For example, …\n· 收束：So I think we should…\n礼貌反驳分四步：先承认对方 → 再提出不同 → 给出理由 → 给替代方案。\n· That's a good point, but have we considered the cost?\n· I see what you mean, but I'm not sure it would work in practice.\n· I agree with you up to a point, but the timeline worries me.\n· I'm afraid I disagree. Maybe we could look at the numbers together.\n语气可以从软到硬排一队：That's true, although…（最软）→ I suppose so, but… → I'm not sure I agree. → I'm afraid I have to disagree. → I completely disagree.（最硬，除非是辩论场合或者关系很熟，否则少用。）\n三条要注意的：一是别直接否定人，You're wrong. / That's wrong. 会让对方下不来台，换成 I'm not sure that's right. / I see it differently.；二是赞同也不必连说 Yes, yes, yes，用 Exactly. / I couldn't agree more. / That makes sense. 更自然；三是僵持不下时可以收尾：Let's agree to disagree. And maybe we can look at the numbers together.",
      usage: "小组作业、会议讨论、跟朋友商量行程，既要说出自己的看法，又要把关系维持住，靠的就是这套说法。",
      takeaways: [
        "表达观点三句：引出 → 支撑 → 收束",
        "礼貌反驳四步：承认对方 → 提出不同 → 给理由 → 给替代方案",
        "别直接否定人：用 I'm not sure that's right. 代替 You're wrong.",
        "强赞同说 Exactly. / I couldn't agree more.",
        "僵持不下时收尾：Let's agree to disagree."
      ],
      type: "speak",
      taskTitle: "跟读与自评",
      taskCopy: "先听示范的四句礼貌反驳，再自己录一段 30 秒模拟：先亮观点，再礼貌反驳一个相反观点。",
      prompt: "跟着示范音频跟读四句礼貌反驳，注意 but 前面的「先承认」部分；再录一段约 30 秒的模拟：先说出自己的观点（In my opinion…），再对相反观点做一次礼貌反驳。",
      model: {
        file: "308-1.mp3",
        voice: "女声",
        text: "That's a good point, but have we considered the cost?\nI see what you mean, but I'm not sure it would work in practice.\nI'm afraid I disagree.\nMaybe we could look at the numbers together."
      },
      checklist: [
        "我跟着示范音频读了一遍四句礼貌反驳",
        "我用 That's a good point, but… 句式造了两句不同话题的反驳，并说了出来",
        "我把「同意 / 部分同意 / 反对」的说法按语气从软到硬各读了一句",
        "我录了一段约 30 秒的模拟：先说自己的观点，再礼貌地反驳一个相反观点"
      ],
      passRatio: 0.8,
      questions: [
        {
          q: "不同意同学的观点，下面哪句最得体？",
          options: [
            "That's a good point, but have we considered the cost?",
            "You're wrong.",
            "No, no, no.",
            "That's a stupid idea."
          ],
          answer: 0,
          explain: "A 先承认对方说得有道理，再提出一个具体疑问，是英语里最常用的礼貌反驳。B、D 直接否定人或想法；C 生硬，而且没有给出任何理由。"
        },
        {
          q: "对同事的方案只同意一部分，哪句表达得最准确？",
          options: [
            "I agree with everything.",
            "You are totally wrong.",
            "Whatever you say.",
            "I agree with you up to a point, but the timeline worries me."
          ],
          answer: 3,
          explain: "up to a point 就是「部分同意」，后面再补一个具体顾虑，立场很清楚。A 是全盘同意；B 过于强硬；C 是敷衍，实际上并没有表态。"
        },
        {
          q: "想表达「我不太确定这样可行」，最委婉的说法是？",
          options: [
            "It won't work.",
            "I'm not sure that would work in practice.",
            "That's impossible.",
            "You don't know what you're doing."
          ],
          answer: 1,
          explain: "I'm not sure… 把判断留了余地，是英语里最常见的委婉反对。A、C 是断言，容易让对方下不来台；D 是人身攻击。"
        },
        {
          q: "对方说得很有道理，你想表示强烈赞同，哪句最自然？",
          options: [
            "Yes, yes, yes.",
            "OK OK.",
            "Exactly. I couldn't agree more.",
            "Maybe."
          ],
          answer: 2,
          explain: "Exactly. / I couldn't agree more. 是地道的强赞同。A 连说三个 yes 更像不耐烦；B 是敷衍；D 表示不确定，和「强烈赞同」正好相反。"
        },
        {
          q: "讨论卡在分歧上，想先搁置争议继续往下推进，最合适的是？",
          options: [
            "Let's agree to disagree and move on to the budget.",
            "You are hopeless.",
            "Let's stop talking.",
            "I don't want to discuss it."
          ],
          answer: 0,
          explain: "agree to disagree 是「各自保留看法」，后面接下一个议题，既结束僵局又不伤和气。B 是攻击对方；C、D 直接终止讨论，问题还是没解决。"
        }
      ]
    },
    {
      id: 309,
      title: "四级口语选考题型（自我介绍 / 朗读 / 问答 / 陈述）",
      minutes: 25,
      gist: "五个部分、约 10 分钟：先弄清流程和每部分的时间，再按时间准备内容。",
      lesson: "四级口语（CET-SET4）是自愿报名的选考项目，不参加不影响笔试成绩；成绩自 2023 年 5 月考次起报告为「优秀 / 良好 / 合格」三个级别，不显示分数，不合格不在成绩报告单上显示；口试不单独发成绩报告单，等级和笔试成绩在同一张成绩报告单上分栏显示。\n考试是机考，一般两人一组，一共五个部分，各部分时间合计约 10 分钟：\n· Part 1 自我介绍：按考官指令作简短的自我介绍，每位考生发言 20 秒。\n· Part 2 短文朗读：准备 45 秒后，朗读一篇 120 词左右的短文，朗读时间 1 分钟。\n· Part 3 简短回答：回答 2 个与朗读短文有关的问题，每位考生发言 40 秒（两题合计）。\n· Part 4 个人陈述：准备 45 秒后，根据所给提示作陈述，每位考生发言 1 分钟。\n· Part 5 两人互动：准备 1 分钟后，根据设定的情景和任务和另一位考生交谈 3 分钟。\n各部分的应对要点：\n① 自我介绍 20 秒大约能说 30–40 词，四句话就够：名字 → 学校或专业 → 一个具体细节 → 一句收尾。\n② 朗读考的是流利和意群停顿，不是速度；读错了不要回头重读，接着往下读，回头重读会打乱整段的节奏。\n③ 简短回答要先给结论、再补一句原因，两题合计 40 秒，一句话答完太单薄。\n④ 个人陈述 1 分钟大约 100–130 词，用「观点 + 两个理由 + 一个例子」的结构最稳。\n⑤ 两人互动是两个人一起完成 3 分钟，不是各说各的：多问 What do you think? / Shall we…?，把话递过去。全程沉默超过几秒，或者一个人说满 3 分钟，是最常见的失分点。",
      usage: "打算报口语考试的同学可以直接照这个流程准备；不打算考的同学，这一关的四项练习（短介绍、朗读、快问快答、1 分钟陈述）也是任何面试和课堂展示的基本功。",
      takeaways: [
        "CET-SET4 是选考，成绩分 A、B、C、D 四等，不显示分数",
        "五个部分：自我介绍 20 秒 / 短文朗读（准备 45 秒 + 朗读 1 分钟）/ 简短回答 40 秒 / 个人陈述（准备 45 秒 + 陈述 1 分钟）/ 两人互动 3 分钟",
        "自我介绍 20 秒约 30–40 词，四句话结构最稳",
        "朗读读错不要回头重读，保持流利和意群停顿",
        "两人互动要一问一答，别一个人说满 3 分钟"
      ],
      type: "speak",
      taskTitle: "跟读与自评",
      taskCopy: "先听示范的 20 秒自我介绍模板，再按各部分的时间要求各练一次；录音回放，最后勾完自评清单。",
      prompt: "先跟着示范音频跟读 20 秒自我介绍模板，再计时录一段自己的版本（控制在 20 秒左右）；然后按考试的节奏，各练一次 1 分钟朗读和 1 分钟个人陈述。",
      model: {
        file: "309-1.mp3",
        voice: "女声",
        text: "Good morning. My name is Li Ming, and I'm a second-year student at Nanjing University, majoring in Business English.\nIn my free time I enjoy playing badminton.\nI'm glad to be here today."
      },
      checklist: [
        "我跟着示范音频读了一遍 20 秒自我介绍模板（约 30–40 词的量）",
        "我计时录了一段自我介绍，时长控制在 20 秒左右",
        "我找了一段 120 词左右的英文短文，按「准备 45 秒 + 朗读 1 分钟」的节奏试了一次",
        "我按 1 分钟个人陈述的要求，用「观点 + 两个理由」说了一段并计时"
      ],
      passRatio: 0.8,
      questions: [
        {
          q: "四级口语考试（CET-SET4）一共分几个部分，各部分时间合计大约多少？",
          options: [
            "3 个部分，约 5 分钟",
            "4 个部分，约 8 分钟",
            "5 个部分，约 10 分钟",
            "6 个部分，约 20 分钟"
          ],
          answer: 2,
          explain: "官方流程是 5 个部分：自我介绍（20 秒）、短文朗读（准备 45 秒 + 朗读 1 分钟）、简短回答（40 秒）、个人陈述（准备 45 秒 + 陈述 1 分钟）、两人互动（3 分钟）。各部分纯答题时间合计约 8 分半，加上指令播报与设备调试，全程约 10 分钟，所以按「5 个部分、全程约 10 分钟」记最稳妥。"
        },
        {
          q: "短文朗读部分，考生的准备时间和朗读时间分别是？",
          options: [
            "准备 45 秒，朗读 1 分钟",
            "准备 20 秒，朗读 3 分钟",
            "准备 1 分钟，朗读 2 分钟",
            "没有准备时间，直接朗读"
          ],
          answer: 0,
          explain: "官方流程是先给 45 秒准备，再朗读一篇 120 词左右的短文，朗读时间 1 分钟。准备时间里应该做的事是默读一遍、把意群切分点定下来。"
        },
        {
          q: "关于四级口语考试，下面哪种说法是对的？",
          options: [
            "必须参加，不考口语就没有笔试成绩",
            "口语成绩以分数形式公布，例如 85 分",
            "口试和笔试必须在同一天、同一个考场完成",
            "口试是自愿报名的选考项目，成绩报告为优秀 / 良好 / 合格三个级别"
          ],
          answer: 3,
          explain: "口试是选考，不参加不影响笔试；成绩报告为优秀 / 良好 / 合格三个级别（2023 年 5 月考次起），不显示分数，不合格不在成绩报告单上显示；口试不单独发成绩报告单，级别和笔试成绩在同一张成绩报告单上分栏显示。"
        },
        {
          q: "两人互动部分共 3 分钟，下面哪种做法最容易得分？",
          options: [
            "一个人把 3 分钟全部说完",
            "先问搭档 What do you think?，再一起把话题说完",
            "全程只说 Yes 和 No",
            "一直沉默，等搭档开口"
          ],
          answer: 1,
          explain: "两人互动考的是「有来有往」：把话递给搭档、回应搭档的观点，比一个人说满更容易得分。A 会让搭档没有表现机会；C 信息量太少；D 直接放弃了这个部分。"
        },
        {
          q: "自我介绍部分每位考生发言 20 秒，下面哪种准备最合适？",
          options: [
            "准备一篇 200 词的自我介绍背熟",
            "只说 My name is Li Ming. Thank you.",
            "准备 45–55 词的四句话：名字、身份、一个具体细节、收尾",
            "背一段课文当作自我介绍"
          ],
          answer: 2,
          explain: "20 秒大约能说 45–55 词，四句话的结构最稳，内容也够。A 太长，考场上一定说不完；B 信息太少，考官无从了解你的表达能力；D 与题目要求无关。"
        }
      ]
    },
    {
      id: 310,
      title: "实战：3 分钟话题陈述 + 追问应对",
      minutes: 30,
      gist: "用五段骨架撑起一段长陈述，再用四招接住追问，不冷场也不硬撑。",
      lesson: "这一关把前面的东西合起来用：先做一段 3 分钟的话题陈述，再练追问应对。\n先说清一个事实：四级 Part 4 的个人陈述只有 1 分钟，Part 5 两人互动是 3 分钟。这里刻意练 3 分钟，是为了让你在 1 分钟里也能说出有结构、有内容的一段话；上场时按 1 分钟裁剪即可（保留立场、一个理由和总结）。\n3 分钟陈述的五段骨架，每段约 30–40 秒：\n① 点题：Today I'd like to talk about whether students should take part-time jobs.\n② 立场：In my opinion, a part-time job is helpful, as long as it doesn't affect our study.\n③ 理由 + 例子：First, it teaches time management. Second, it gives us real work experience. For example, a friend of mine learned to deal with customers in a café.\n④ 让步：Of course, there is a risk that students spend too much time at work. Some people argue that study should come first.\n⑤ 总结：So, on balance, I think a part-time job is worth trying if the hours are limited.\n追问应对四招：\n· 争取时间：That's a good question. Let me think for a second. / Well, that's an interesting question.\n· 确认理解：Do you mean whether it affects their grades? / If I understand you correctly, you're asking about…\n· 诚实作答：I'm not sure about the exact number, but from what I've read, it's around 30 percent.\n· 把话接回去：Does that answer your question? / Would you like an example?\n两个提醒：一是卡壳时不要沉默，用 Well, … 或 That's a good question. 争取两三秒——沉默会被记成「无法表达」；二是语速，1 分钟大约 100–130 词，3 分钟约 300–400 词，为了说满而加速，反而会丢掉重音和停顿，得不偿失。",
      usage: "课堂展示、面试里的开放问题、会议上的方案说明，本质都是「有限时间里说清一个观点」，这套骨架可以直接套用。",
      takeaways: [
        "3 分钟陈述用五段骨架：点题 → 立场 → 理由加例子 → 让步 → 总结",
        "四级 Part 4 个人陈述是 1 分钟，练 3 分钟是为了上场时更从容",
        "卡壳时用 That's a good question. Let me think for a second. 争取时间",
        "追问听不懂就用 Do you mean…? 复述确认",
        "不确定的数字要诚实：I'm not sure about the exact number, but…"
      ],
      type: "speak",
      taskTitle: "跟读与自评",
      taskCopy: "先听示范（点题 + 立场 + 争取时间），再录一段 2–3 分钟的完整陈述，最后勾完自评清单。",
      prompt: "跟着示范音频跟读点题、立场和争取时间的句子；再用五段骨架录一段 2–3 分钟的话题陈述（话题自选），然后用追问四招中的两招，自己接两个追问。",
      model: {
        file: "310-1.mp3",
        voice: "女声",
        text: "Today I'd like to talk about part-time jobs for students.\nIn my opinion, a part-time job is helpful, as long as it doesn't affect our study.\nThat's a good question. Let me think for a second."
      },
      checklist: [
        "我跟着示范音频读了一遍点题、立场和争取时间的句子",
        "我用五段骨架录了一段 2–3 分钟的话题陈述",
        "我练了三种追问应对：争取时间、确认理解（Do you mean…?）、诚实说明不确定",
        "我把同一段陈述压缩到 1 分钟（保留立场 + 一个理由 + 总结），并计时确认过"
      ],
      passRatio: 0.8,
      questions: [
        {
          q: "3 分钟话题陈述的开场，哪句最合适？",
          options: [
            "I will talk many things now.",
            "Today I'd like to talk about whether students should take part-time jobs.",
            "My topic is very interesting, listen to me.",
            "OK, start."
          ],
          answer: 1,
          explain: "B 用 Today I'd like to talk about… 点明话题，还用 whether 从句给出了讨论角度，听的人立刻知道你要说什么。A 语法不通；C 是在自夸，不是点题；D 过于随意，等于没有开场。"
        },
        {
          q: "被追问后需要几秒钟组织语言，哪句最自然？",
          options: [
            "Wait!",
            "Stop asking.",
            "That's a good question. Let me think for a second.",
            "I don't know anything."
          ],
          answer: 2,
          explain: "C 先肯定问题，再自然地争取几秒钟，考官和听众都会等你说下去。A 是命令；B、D 会让对话直接中断。"
        },
        {
          q: "你没听清追问到底问的是哪一点，最稳妥的回应是？",
          options: [
            "Do you mean whether it affects their grades?",
            "What?",
            "You ask wrong question.",
            "I can't hear you."
          ],
          answer: 0,
          explain: "A 用 Do you mean…? 把自己的理解说出来请对方确认，是应对追问最稳的一步。B 太生硬；C 把问题归到对方身上；D 像在推脱。"
        },
        {
          q: "追问涉及一个你不确定的具体数字，最得体的回答是？",
          options: [
            "I have no idea.",
            "Why do you ask?",
            "That's none of my business.",
            "I'm not sure about the exact number, but from what I've read, it's around 30 percent."
          ],
          answer: 3,
          explain: "D 先承认不确定，再给出有依据的近似信息，还留了余地，既诚实又没让对话停下来。A 直接放弃；B、C 把话题推开，显得回避。"
        },
        {
          q: "四级口语的个人陈述只有 1 分钟，而本关练的是 3 分钟版本。上场时应该怎么做？",
          options: [
            "把 3 分钟的内容加快语速全部说完",
            "保留「立场 + 一个理由 + 总结」三段，把例子压缩成一句",
            "只说完开场句，然后停下",
            "背一段课文顶上"
          ],
          answer: 1,
          explain: "时间不够时先保结构：观点、一个理由、总结必须留下，例子压缩成一句话。A 加快语速会让重音和停顿全丢，反而扣分；C 内容太少；D 与题目无关。"
        }
      ]
    }
  ]
});