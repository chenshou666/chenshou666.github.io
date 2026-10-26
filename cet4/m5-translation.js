/* =====================================================================
 * HT Lab · 英语四级课程 · 模块 5：翻译（8 关，id 601–608）
 * 关卡数据文件（每个模块一个文件，互不干扰）
 * 字段说明：
 *   id            关卡号（模块 5 → 6xx，与其它模块不冲突）
 *   type          translate：把 source 里的中文译成英文
 *   source        中文原文（自编仿真题，140–160 汉字为考试标准长度）
 *   minWords      译文最少词数（与 prompt 里的数字一致）
 *   points        必含要点：每组内任一表达命中即算命中，且与参考译文一致
 *   sample        参考译文（逐句检查过语法与搭配）
 *   questions     [{q,options,answer,explain}]  answer 为正确选项下标（从 0 起）
 *   timeLimit     限时关卡的倒计时（分钟），页面顶部显示剩余时间
 *   audio         [{file,label,voice,hint,transcript}]  音频放 ./audio/cet4/
 * ===================================================================== */
window.CET4_MODULES = window.CET4_MODULES || [];
window.CET4_MODULES.push({
  id: "m5",
  name: "模块 5 · 翻译",
  levels: [
    {
      id: 601,
      title: "翻译考什么、怎么给分：先躲开中式英语",
      minutes: 16,
      gist: "四级翻译是一段 140–160 汉字的汉译英，占 106.5 分。先弄懂评分逻辑，再躲开三个最常见的中式英语陷阱。",
      lesson: "① 考什么：给你一段 140–160 汉字的汉语短文（多为中国文化、历史、社会、科技类话题），把整段译成英文。翻译占全卷 15%，也就是 106.5 分，建议用时 30 分钟（阅读和翻译共用 70 分钟）。\n② 怎么给分：翻译是「整体印象打分」，不逐词扣分。阅卷时先读整篇，再把译文归入档次：13–15 分（意思完整、用词准确、行文通顺）、10–12 分（意思基本完整、有少量语言错误）、7–9 分（只译出大意、错误较多）、4–6 分（只译出一小部分）、1–3 分（支离破碎）。\n看清档次的描述，优先级就出来了：内容完整 > 语言准确 > 行文漂亮。漏译一整句，比一处小语法错误严重得多；用简单句把意思写全，也比用复杂句写错得分高。\n③ 中式英语三病（低分卷几乎都有）：\n· 逐字硬译：把「好好学习，天天向上」译成 Good good study, day day up。正确做法是先问「这句话在说什么事实」，再用英语里表达同一事实的说法。\n· 一句多个谓语：中文可以「我去学校学习英语」连着说几个动词，英语一个句子只能有一个谓语，其余要降级——I go to school to study English.\n· 名词堆叠：中文爱说「水平、情况、工作」，英语常常不需要。My English level is very high. 是典型的中式英语，地道说法是 My English is good. 或 I'm good at English.\n④ 落笔顺序（背下来）：定每句的主语和谓语 → 补时间、地点、原因 → 最后查单复数、时态、冠词、拼写。写对永远优先于写好。",
      usage: "把中文意思讲清楚的能力，写英文邮件、做英文汇报、给外国同事解释流程，用的都是同一套本事。",
      takeaways: [
        "四级翻译：140–160 汉字，占 15%（106.5 分），建议用时 30 分钟",
        "15 分制整体印象打分：内容完整 > 语言准确 > 行文通顺",
        "中式英语三病：逐字硬译、一句多个谓语、名词堆叠",
        "先写对再写好：简单句写全，胜过复杂句写错"
      ],
      type: "translate",
      taskTitle: "翻译入门",
      taskCopy: "先做上面的五道选择题，再把下面这段中文译成英文；检查器会逐条核对要点。",
      passRatio: 0.75,
      source: "我每天早上七点起床，先吃早饭，然后骑自行车去学校。从我家到学校大约要花二十分钟，骑车比坐公交车更方便，还能顺便锻炼一下身体。周末的时候，我常常和朋友一起去公园打球。",
      prompt: "把下面这段中文译成英文（不少于 49 词）。要求：① 每句先定主语和谓语；② 时间状语放在句首或句末；③ 写完检查单复数与拼写。",
      placeholder: "I get up at ... / It takes me ...",
      minWords: 49,
      points: [
        ["get up", "wake up"],
        ["have breakfast", "eat breakfast"],
        ["by bike", "by bicycle", "on my bike", "ride a bike", "ride my bike", "cycle to school"],
        ["it takes", "takes me", "i spend"],
        ["more convenient than", "more convenient"]
      ],
      sample: "I get up at seven every morning.\nI have breakfast first, and then I go to school by bike.\nIt takes me about twenty minutes to get from my home to school.\nI think going to school by bike is more convenient than taking a bus, and it is also a good way to get some exercise.\nOn weekends, I often play ball games with my friends in the park.",
      questions: [
        {
          q: "四级翻译部分考的是什么？",
          options: ["把一段英文译成中文", "根据中文提示写一篇 120–180 词的短文", "把一段 140–160 汉字的汉语短文译成英文", "听一段录音后复述大意"],
          answer: 2,
          explain: "四级翻译是「汉译英」：原文是 140–160 个汉字的汉语段落，译文写成英文。A 是英译汉，B 是四级写作的要求（120–180 词），D 属于听力与口语的考查方式。"
        },
        {
          q: "翻译部分在四级里占多少分？建议用时多久？",
          options: ["占 15%，约 106.5 分，建议 30 分钟", "占 35%，约 248.5 分，建议 40 分钟", "占 15%，约 106.5 分，建议 15 分钟", "占 10%，约 71 分，建议 20 分钟"],
          answer: 0,
          explain: "翻译占全卷 15%，710 × 15% = 106.5 分，建议用时 30 分钟（与阅读合起来 70 分钟）。B 里的 35%、248.5 分是听力和阅读各自的占比——四级的分值分布是听力 35%、阅读 35%、写作 15%、翻译 15%。"
        },
        {
          q: "下面哪一句是典型的中式英语，最好避免？",
          options: ["I'm good at English.", "I speak English well.", "I have a good command of English.", "My English level is very high."],
          answer: 3,
          explain: "「水平」直译成 level、「高」直译成 high，是中文名词的逐字搬运；英语里直接说 My English is good. 或 I'm good at English. 就够了。另外三句都是地道说法，have a good command of 表示「熟练掌握」。"
        },
        {
          q: "「我去学校学习英语。」最恰当的译文是？",
          options: ["I go to school study English.", "I go to school to study English.", "I go to school studying English.", "I go school to study English."],
          answer: 1,
          explain: "英语一个句子只能有一个谓语，第二个动作要降级：用不定式 to study 表示目的。A 少了 to；C 用 -ing 表示「同时进行」，与原意不符；D 的 go school 缺介词 to。"
        },
        {
          q: "按评分档次，下面哪种情况扣分最重？",
          options: ["句式简单，没有用高级句型", "有一处单词拼写错误", "漏译了整整一句话", "个别地方表达不够地道"],
          answer: 2,
          explain: "评分先看「内容是否完整」：漏译整句属于信息缺失，会直接掉档。句式简单不算错误（写对优先），拼写和个别表达只影响同一档次内的小幅调整。"
        }
      ]
    },
    {
      id: 602,
      title: "汉语流水句 → 英语树状句：找主干、定主谓",
      minutes: 20,
      gist: "中文一逗到底，英语不能照抄。四步把流水句改成一棵有主干的树。",
      lesson: "中文句子爱「流水」：几个小句用逗号一路串下去，主语时有时无。英语句子是「树」：先立一根主干（主语 + 谓语），其余信息挂在主干上——从句、分词、介词短语、并列结构。照抄中文的逗号串，就会写出英语里最典型的错误：逗号拼接（comma splice）。\n四步改造法：\n① 断意群：按意思把中文切成 2–4 块，每块一个完整意思。\n② 定主谓：每块找出「谁 + 做什么」。中文省略主语时，从上下文补回来（they、it、this 都可以）。\n③ 降级：多余的动词不要都当谓语，降级成 to do / doing / done / 介词短语 / 从句。\n   他站在门口，手里拿着一把伞。→ He stood at the door, holding an umbrella.\n   这所学校以前很小，教室都是平房。→ This school used to be very small, and the classrooms were all single-storey houses.\n④ 补连接：用 and / but / so / because / although / when，或 which、who 把几块连起来；也可以干脆断成两句。\n两条硬规则：\n· 两个完整句子不能只用一个逗号连接（He lives in the city, he works in the suburbs. ✗）——要么加 and / but / so，要么改用分号或句号。\n· 中文的「因为…所以…」「虽然…但是…」可以成对出现，英语只能留一个：Because it rained, we stayed at home.（不能写成 Because…, so…）\n两个附带提醒：\n· 「有」字句先定主语：「某处有某物」用 there be（There is a new school in our village.），「某人或某地拥有」用 have（Our village has a new school.），两者都对，但 there be 里不能再叠 have 或地点主语。\n· 时态跟着时间词走：「以前」用一般过去时或 used to，「后来」用一般过去时，「现在」用一般现在时——同一段里出现三种时态很正常，别一路用到底。\n自检标准很简单：读完一个句子，你能指出它的主语和谓语吗？能，主干就立住了。",
      usage: "写英文邮件、做英文汇报、准备留学文书时，中译英的「断句 + 主干」能力决定句子读不读得通。",
      takeaways: [
        "中文流水句靠逗号推进，英语句子靠主干支撑",
        "四步：断意群 → 定主谓 → 降级次要动词 → 补连接词",
        "两个完整句子不能只用逗号相连（comma splice）",
        "because 与 so、although 与 but 不能同时出现在一句里"
      ],
      type: "translate",
      taskTitle: "流水句改造",
      taskCopy: "先做上面的五道选择题，再把下面这段中文译成英文；检查器会核对主干、连接词与关键词。",
      audio: [
        {
          file: "602-1.mp3",
          label: "树状句示范朗读",
          voice: "女声",
          hint: "听主干在哪里，次要动作是怎么降级的",
          transcript: "He stood at the door, holding an umbrella.\nThe roads were muddy, so we walked slowly.\nOur school used to be very small.\nAs a result, many students had to share desks.\nA new library was built last year."
        }
      ],
      audioTip: "跟读一遍，重点听 holding / so / used to / As a result 这几处——它们就是「降级」和「连接」。",
      passRatio: 0.8,
      source: "我们村以前很穷，路都是土路，一到下雨天就没法走，孩子们上学要绕很远的路。后来政府修了一条柏油路，还在村口建了一所新学校。现在孩子们走十分钟就能到学校，家长们也不用再担心下雨天了。",
      prompt: "把下面这段中文译成英文（不少于 55 词）。要求：① 先定每句的主干；② 用 and / so / because 之类把意思连起来，不要只堆逗号；③ 检查时态与单复数。",
      placeholder: "Our village used to be ... / As a result, ...",
      minWords: 55,
      points: [
        ["used to be", "was once", "in the past", "was poor in the past"],
        ["dirt tracks", "dirt track", "dirt roads", "dirt road", "unpaved roads", "muddy roads"],
        ["rainy days", "rainy day", "when it rained", "on wet days"],
        ["detour", "long way", "longer route", "long distance"],
        ["paved road", "paved roads", "paved a road", "paved the road", "asphalt road", "tarmac road"],
        ["as a result", "so the children", "so they", "therefore", "that's why", "this meant"]
      ],
      sample: "Our village used to be very poor.\nThe roads were dirt tracks, and on rainy days they were too muddy to walk on.\nAs a result, the children had to take a long detour to school.\nLater, the government built a paved road and a new school at the entrance to the village.\nNow the children can get to school in ten minutes, and their parents no longer have to worry about rainy days.",
      questions: [
        {
          q: "下面哪一句在英语里是错的？",
          options: ["He lives in the city, he works in the suburbs.", "He lives in the city, but he works in the suburbs.", "He lives in the city, and he works in the suburbs.", "He lives in the city; he works in the suburbs."],
          answer: 0,
          explain: "两个完整句子之间只用一个逗号，是英语里的硬错误（逗号拼接）。要么加 and / but / so，要么改用分号或句号。B 用了转折连词、C 用了并列连词、D 用了分号，都成立。"
        },
        {
          q: "「因为下雨，所以我们待在家里。」的正确译法是？",
          options: ["Because it rained, so we stayed at home.", "Because it rained, we stayed at home.", "So it rained, because we stayed at home.", "Because of it rained, we stayed at home."],
          answer: 1,
          explain: "英语里 because 和 so 只能留一个：Because it rained, we stayed at home. 或 It rained, so we stayed at home. 都对，但不能同时出现。C 把因果说反了；D 的 because of 后面只能接名词或动名词，不能接句子。"
        },
        {
          q: "「他坐在窗边，看着外面的雨。」最自然的译文是？",
          options: ["He sat by the window and looking at the rain outside.", "He sat by the window, look at the rain outside.", "He sat by the window, he looked at the rain outside.", "He sat by the window, looking at the rain outside."],
          answer: 3,
          explain: "同一个主语的第二个动作可以用 -ing 分词降级成伴随状语。A 的 and 后面必须接谓语动词 looked；B 的 look 没有人称和时态变化；C 是逗号拼接两个完整的句子。"
        },
        {
          q: "「我们村有一所新学校。」下面哪种译法不正确？",
          options: ["Our village has a new school.", "There is a new school in our village.", "Our village there is a new school.", "A new school has been built in our village."],
          answer: 2,
          explain: "中文的「有」可以译成 have，也可以译成 there be；但 there be 本身就是「有」，不能再和地点主语叠加成一个句子。A、B、D 都成立，D 用被动强调「建起来」这个动作。"
        },
        {
          q: "「现在孩子们走十分钟就能到学校。」译文的时态应该是？",
          options: ["can get", "could get", "will get", "were able to get"],
          answer: 0,
          explain: "「现在」说明是当前的情况，用一般现在时 can get：Now the children can get to school in ten minutes.。could 和 were able to 是过去，will 是将来，都与「现在」冲突。"
        }
      ]
    },
    {
      id: 603,
      title: "无主句与被动语态：据说、人们认为、已经建成",
      minutes: 20,
      gist: "中文可以没有主语，英语不行。三种补主语的办法，加上被动语态的固定套路。",
      lesson: "中文里没有主语的句子很常见，英语句子却必须有主语（祈使句除外）。看到无主句，先判断它属于哪一类：\n① 泛指人（据说、人们认为、众所周知）→ 用 it 作形式主语，后面接 that 从句：\n   It is said that… 据说 / It is believed that… 人们认为 / It is reported that… 据报道 / It is well known that… 众所周知 / It is estimated that… 据估计\n② 存在（有、出现了）→ 用 there be：There are many old towns in the south. / There is a growing interest in tea culture.\n③ 被动含义（已经建成、得到保护、受到欢迎）→ 用被动语态 be + 过去分词，把原来的宾语提到主语位置：\n   The museum was built in 1958. / The old town has been well preserved. / The book is popular with young readers.\n被动语态的时态变化都落在 be 上：is built / was built / has been built / will be built / is being built。\n三个提醒：\n· 中文没说「被」，英文也常常要用被动：「这座博物馆建于 1958 年」→ The museum was built in 1958.\n· happen、take place、appear、belong to 没有被动语态：「会议将在周五举行」→ The meeting will take place on Friday.（不能说 will be taken place）\n· 「据说」还可以接不定式，句子更紧凑：He is said to be very rich. / The old town is said to have a history of 600 years.\n必背被动搭配：be located in（位于）、be named after（以……命名）、be divided into（被分成）、be made of / from（由……制成）、be covered with（被……覆盖）、be known for / be famous for（因……闻名）、be considered as（被认为是）、be used as（被用作）。",
      usage: "写英文简历、介绍公司或产品时，「成立于、位于、被评为、由……组成」这类句子全靠被动语态。",
      takeaways: [
        "英语句子必须有主语：it 形式主语 / there be / 被动语态三种补法",
        "据说、人们认为：It is said that… / It is believed that…",
        "中文没有「被」，英文常常也要用被动：was built / has been preserved",
        "happen、take place、appear、belong to 没有被动语态",
        "高频被动搭配：be located in / be named after / be known for"
      ],
      type: "translate",
      taskTitle: "被动与无主句",
      taskCopy: "先做上面的五道选择题，再把下面这段中文译成英文；检查器会核对形式主语与被动结构。",
      passRatio: 0.8,
      source: "据说这座桥建于五百多年前，是当时最长的石桥。人们认为它是由一位当地工匠设计的。虽然经历过多次洪水，它至今仍然坚固。每年都有成千上万的游客前来参观，桥上的石刻也得到了很好的保护。",
      prompt: "把下面这段中文译成英文（不少于 50 词）。要求：① 无主句用 It is said that… / It is believed that… 补出主语；② 「建于、得到保护」用被动语态；③ 注意 that 从句里的时态。",
      placeholder: "It is said that ... / It is believed that ...",
      minWords: 50,
      points: [
        ["it is said that", "it's said that", "is said to", "people say that", "they say that"],
        ["was built", "been built", "was constructed", "was completed", "dates back"],
        ["it is believed that", "people believe that", "is believed to", "was designed by", "designed by a local craftsman"],
        ["although it has survived", "although it survived", "despite many floods", "many floods", "several floods"],
        ["thousands of tourists", "thousands of visitors", "thousands of people"],
        ["have been well preserved", "has been well preserved", "are well preserved", "is well preserved", "have been protected", "are well protected"]
      ],
      sample: "It is said that this bridge was built more than five hundred years ago and that it was the longest stone bridge of its time.\nIt is believed that it was designed by a local craftsman.\nAlthough it has survived many floods, it still stands strong today.\nThousands of tourists visit it every year, and the stone carvings on the bridge have been well preserved.",
      questions: [
        {
          q: "「据说这座桥建于 500 年前。」哪个译文正确？",
          options: ["It is said that the bridge built 500 years ago.", "It says the bridge was built 500 years ago.", "It is said the bridge is built 500 years ago.", "It is said that the bridge was built 500 years ago."],
          answer: 3,
          explain: "「据说」用 It is said that…，that 从句里「建于」要用被动加过去时 was built。A 少了被动里的 was；B 的 It says 指「（文字上）写着」，不能表示「据说」；C 的 is built 与「500 年前」矛盾。"
        },
        {
          q: "「会议将在周五举行。」哪个译文正确？",
          options: ["The meeting will take place on Friday.", "The meeting will be taken place on Friday.", "The meeting will be held place on Friday.", "The meeting will be happened on Friday."],
          answer: 0,
          explain: "take place 是不及物动词短语，没有被动语态，所以 B、D 的 be + 过去分词都错（happen 也没有被动）；C 把 held 和 place 混在一起，搭配不成立。也可以说 The meeting will be held on Friday."
        },
        {
          q: "「这座博物馆位于市中心，因收藏瓷器而闻名。」哪个译文最恰当？",
          options: ["The museum locates in the city centre and is famous for its porcelain collection.", "The museum is located in the city centre and is famous for its porcelain collection.", "The museum is locating in the city centre and famous for its porcelain collection.", "The museum located in the city centre and is famous for its porcelain collection."],
          answer: 1,
          explain: "be located in 是固定搭配，表示「位于」。A 用 locate 的主动形式表示位置，不成立；C 用进行时表位置也不对；D 少了 is，located 单独不能作谓语。"
        },
        {
          q: "下面哪一句不能表达「人们认为它是明朝建造的」？",
          options: ["It is believed that it was built in the Ming Dynasty.", "People believe that it was built in the Ming Dynasty.", "It is believed to have been built in the Ming Dynasty.", "It is believing that it was built in the Ming Dynasty."],
          answer: 3,
          explain: "表示「人们认为」有三条路：It is believed that…、People believe that…、It is believed to have been built…。D 的 It is believing 不成立——believe 不能用在 It is + doing 这个结构里。"
        },
        {
          q: "关于被动语态，下面哪种说法是对的？",
          options: ["中文句子没有「被」字，译文就一定不能用被动语态。", "happen、take place、appear 这些动词也有被动语态。", "中文没有「被」字的句子，英文常常也要用被动语态。", "被动语态只能用于一般现在时。"],
          answer: 2,
          explain: "「这座博物馆建于 1958 年」中文没有「被」，英文必须写 The museum was built in 1958.。happen / take place / appear / belong to 是不及物动词，没有被动；被动语态的时态随 be 变化，可以是 is built / was built / has been built / will be built 等多种形式。"
        }
      ]
    },
    {
      id: 604,
      title: "文化类话题高频表达：传统节日、饮食、手工艺",
      minutes: 20,
      gist: "文化类是四级翻译的常客。背一批节日、饮食、手工艺的固定说法，再套三个万能句型。",
      lesson: "四级翻译最爱考中国文化：传统节日、饮食、手工艺、名胜古迹。这类题不难在语法，难在「那个词我不会说」。下面是可背清单。\n① 传统节日\n· traditional festival 传统节日；the Spring Festival 春节；the Mid-Autumn Festival 中秋节；the Dragon Boat Festival 端午节；the Lantern Festival 元宵节\n· lunar calendar 农历；family reunion 家人团聚；reunion dinner 团圆饭\n· set off fireworks 放烟花；hang red lanterns 挂红灯笼；put up couplets 贴对联\n· lucky money 压岁钱；red envelope / red packet 红包；mooncakes 月饼；zongzi (glutinous rice dumplings) 粽子；dragon boat racing 赛龙舟\n② 饮食\n· dumplings 饺子；noodles 面条；tea culture 茶文化；teahouse 茶馆；hot pot 火锅\n· be famous for 因……闻名；be a symbol of 是……的象征；a balanced diet 均衡饮食\n③ 手工艺\n· paper cutting 剪纸；silk 丝绸；porcelain / china 瓷器；embroidery 刺绣；be passed down from generation to generation 代代相传\n④ 三个万能句型（几乎每篇文化类翻译都能用上）\n· ……是中国最重要的传统节日之一：… is one of the most important traditional festivals in China.\n· 已有……年历史：It has a history of more than … years. / It dates back more than … years.\n· 越来越受欢迎：It is becoming increasingly popular. / It is gaining popularity around the world.\n⑤ 两个易错点：节日名前的 the 不要丢（the Spring Festival）；专有名词首字母大写。饺子、月饼这类词用常见拼法即可，不必纠结音译。",
      usage: "给外国朋友介绍中国节日、给产品写英文介绍、做跨文化交流，这些表达直接可用。",
      takeaways: [
        "节日名首字母大写，前面通常要加 the",
        "春节团圆、贴对联、红包、饺子、月饼的表达要成块背",
        "万能句型：one of the most important… / has a history of… / is becoming increasingly popular",
        "手工艺类重点词：paper cutting / silk / porcelain / embroidery"
      ],
      type: "translate",
      taskTitle: "文化类翻译",
      taskCopy: "先做上面的五道选择题，再把下面这段中文译成英文；检查器会核对节日、饮食类关键词。",
      audio: [
        {
          file: "604-1.mp3",
          label: "文化类表达朗读",
          voice: "女声",
          hint: "跟读一遍，把节日、饮食、手工艺的词读顺",
          transcript: "the Spring Festival\nthe Mid-Autumn Festival\nthe Dragon Boat Festival\nfamily reunion\nlucky money\nred envelopes\nmooncakes\ndumplings\npaper cutting\nsilk\nporcelain\nembroidery\nThe festival is a symbol of good luck.\nThese skills have been passed down from generation to generation."
        }
      ],
      audioTip: "先跟读两遍再动笔：couplets、porcelain、embroidery 这几个词读顺了，写的时候就不容易拼错。",
      passRatio: 0.8,
      source: "春节是中国最重要的传统节日之一。节日期间，人们赶回家与家人团聚，门上贴着红色的对联，孩子们会收到装着压岁钱的红包。年夜饭上通常有饺子，因为它象征着好运。如今，越来越多的外国人也选择在春节期间来中国旅游，体验这一传统。",
      prompt: "把下面这段中文译成英文（不少于 60 词）。要求：① 节日名称首字母大写、前面加 the；② 尽量用上 one of the most important… 和 a symbol of… 这两个句型；③ 注意单复数与冠词。",
      placeholder: "The Spring Festival is one of ... / Dumplings are a symbol of ...",
      minWords: 60,
      points: [
        ["the Spring Festival", "Spring Festival", "Chinese New Year"],
        ["one of the most important", "most important traditional festivals", "most important traditional festival"],
        ["reunite with their families", "family reunion", "reunite", "get together with their families", "get together"],
        ["red couplets", "couplets", "couplet", "spring couplets"],
        ["lucky money", "red envelopes", "red envelope", "red packets", "red packet"],
        ["a symbol of good luck", "symbol of good luck", "symbolize good luck", "symbolizes good luck", "stand for good luck", "symbol of luck"],
        ["more and more foreigners", "increasing number of foreigners", "an increasing number of foreigners", "growing number of foreigners", "a growing number of foreigners", "more and more foreign tourists", "an increasing number of foreign tourists"]
      ],
      sample: "The Spring Festival is one of the most important traditional festivals in China.\nDuring the festival, people go home to reunite with their families.\nRed couplets are put up on the doors, and children receive red envelopes containing lucky money.\nDumplings are usually served at the New Year's Eve dinner, because they are a symbol of good luck.\nToday, more and more foreigners choose to travel to China during the Spring Festival to experience this tradition.",
      questions: [
        {
          q: "「春节」的通用英文说法是？",
          options: ["the Spring Festival", "the Spring Holiday", "Chinese Spring Day", "the Spring Celebration"],
          answer: 0,
          explain: "春节的通用译法是 the Spring Festival，也可以说 Chinese New Year。节日名首字母大写，前面通常加 the；另外三个都是望文生义的说法。"
        },
        {
          q: "「中秋节」和「端午节」分别是？",
          options: ["the Middle Autumn Festival / the Dragon Festival", "the Mid-Autumn Festival / the Dragon Boat Festival", "the Mid-Autumn Festival / the Dragon Festival", "the Autumn Festival / the Dumpling Festival"],
          answer: 1,
          explain: "中秋节是 the Mid-Autumn Festival（也说 the Moon Festival），端午节是 the Dragon Boat Festival，赛龙舟 dragon boat racing 是它的标志。A、C 里的 the Dragon Festival 和 D 里的 the Dumpling Festival 都不是固定说法。"
        },
        {
          q: "「剪纸」「瓷器」「刺绣」分别是？",
          options: ["paper cut / china / embroider", "cutting paper / porcelain / sewing", "paper art / ceramic / knitting", "paper cutting / porcelain / embroidery"],
          answer: 3,
          explain: "剪纸 paper cutting、瓷器 porcelain（口语里也说 china）、刺绣 embroidery。A 里的 embroider 是动词，paper cut 不是这门手艺的名称；sewing 是缝纫，knitting 是编织。"
        },
        {
          q: "「这座桥有 800 多年的历史。」哪个译文正确？",
          options: ["This bridge has a history of more than 800 years.", "This bridge has more than 800 years history.", "This bridge is more than 800 years history.", "This bridge has history more than 800 years."],
          answer: 0,
          explain: "「有……年的历史」用 have a history of + 时间，也可以说 It dates back more than 800 years.。B 漏了 of 和冠词 a，C 缺 a history of，D 的语序不成立。"
        },
        {
          q: "下面哪一句译文正确？",
          options: ["People set off firework to celebrate the Spring Festival.", "People set off fireworks to celebrate the Spring Festival.", "People set off fireworks to celebrate the Spring Festivals.", "People set off fireworks celebrate the Spring Festival."],
          answer: 1,
          explain: "「放烟花」用复数 fireworks；celebrate 前面的目的用不定式 to celebrate；节日名不加 s。A 的 firework 单数不表示「放烟花」，C 把节日写成了复数，D 缺 to。"
        }
      ]
    },
    {
      id: 605,
      title: "社会热点类高频表达：环保、科技、教育",
      minutes: 20,
      gist: "共享单车、移动支付、在线课程——四级翻译的另一个高频题库。背话题词，再套五个万能开头。",
      lesson: "另一类常考题材是当代中国社会：环保、科技、教育、交通。这类文章语法不难，难在「话题词」和「趋势句」。\n① 环保\n· environmental protection 环境保护；protect the environment 保护环境；air pollution 空气污染；plastic waste 塑料垃圾；waste sorting 垃圾分类；recycle 回收；reusable bags 可重复使用的袋子；renewable energy 可再生能源；solar power 太阳能；low-carbon life 低碳生活；save energy 节约能源；pay attention to 关注、注意；take action 采取行动\n② 科技\n· the Internet 互联网；mobile payment 移动支付；online shopping 网上购物；shared bikes 共享单车；high-speed rail 高铁；artificial intelligence (AI) 人工智能；social media 社交媒体；scan a QR code 扫二维码；make life more convenient 让生活更方便\n③ 教育\n· online courses 在线课程；distance learning 远程学习；higher education 高等教育；study abroad 出国留学；lifelong learning 终身学习；improve the quality of education 提高教育质量\n④ 五个万能句型（写趋势、写作用，直接套）\n· In recent years, … 近年来……\n· More and more people … / An increasing number of people … 越来越多的人……\n· … plays an important role in … 在……中起着重要作用\n· … not only … but also … 不仅……而且……\n· … makes it easier for people to … 让人们更容易……\n⑤ 时态提醒：谈「近年来」的变化，用现在完成时（has become / have appeared）或一般现在时（is becoming）；不要通篇一般过去时。",
      usage: "聊环保、读科技新闻、向外国客户介绍中国的移动支付和高铁，这些句子就是现成的表达。",
      takeaways: [
        "环保、科技、教育三类话题词要成块背",
        "万能句型：In recent years… / More and more people… / play an important role in…",
        "not only … but also … 前后结构要一致",
        "谈近年变化用现在完成时或一般现在时，别通篇过去时"
      ],
      type: "translate",
      taskTitle: "社会热点翻译",
      taskCopy: "先做上面的五道选择题，再把下面这段中文译成英文；检查器会核对趋势句与连接词。",
      passRatio: 0.8,
      source: "近年来，越来越多的中国人选择骑共享单车出行。骑车人用手机扫一下二维码就能解锁一辆车，既方便又便宜。共享单车不仅减少了汽车尾气，也缓解了城市的交通拥堵。不过，随意停放也带来了新的问题。专家认为，只有大家一起努力，城市才能变得更绿色。",
      prompt: "把下面这段中文译成英文（不少于 55 词）。要求：① 用 In recent years 开头；② 用上 not only … but also …；③ 注意「近年来」该用什么时态。",
      placeholder: "In recent years, more and more ... / Shared bikes not only ...",
      minWords: 55,
      points: [
        ["in recent years", "in the past few years", "over the past few years"],
        ["more and more", "an increasing number of", "a growing number of"],
        ["shared bikes", "shared bike", "shared bicycles", "shared bicycle", "bike sharing"],
        ["scan a qr code", "scan the qr code", "scanning a qr code", "qr code", "scan the code"],
        ["not only", "not just", "not merely"],
        ["traffic congestion", "traffic jams", "traffic pressure", "the pressure on city traffic", "traffic problems"],
        ["only if", "as long as", "only when"]
      ],
      sample: "In recent years, more and more Chinese people have chosen to travel by shared bike.\nRiders scan a QR code with their phones to unlock a bike, which is both convenient and cheap.\nShared bikes not only reduce car exhaust but also ease traffic congestion in cities.\nHowever, parking them at random has created new problems.\nExperts believe that our cities can become greener only if everyone works together.",
      questions: [
        {
          q: "「近年来，越来越多的人选择网上购物。」哪个译文最好？",
          options: ["In recent years, more and more people chose to shop online.", "In recent years, more and more people are choose online shopping.", "In recent years, more and more people have chosen to shop online.", "In recent years, more and more people has chosen to shop online."],
          answer: 2,
          explain: "In recent years 常配现在完成时 have chosen，表示「从过去延续到现在」。A 用一般过去时，与「近年来」的延续性不符；B 的 are choose 语法错误；D 的主语 people 是复数，不能用 has。"
        },
        {
          q: "「共享单车不仅方便，而且环保。」哪个译文结构正确？",
          options: ["Shared bikes are not only convenient but also environment friendly.", "Shared bikes are not only convenient but also environmentally friendly.", "Shared bikes not only convenient but also environmentally friendly.", "Shared bikes are not only convenient and also environmentally friendly."],
          answer: 1,
          explain: "not only … but also … 必须成对出现，前后结构一致（这里两边都是形容词）。A 的 environment friendly 少了 -ally；C 少了系动词 are；D 把 but also 写成了 and also。"
        },
        {
          q: "「扫二维码」「移动支付」「高铁」分别是？",
          options: ["sweep a QR code / moving payment / fast rail", "scan a bar code / mobile pay / high rail", "scan a QR code / phone payment / express train", "scan a QR code / mobile payment / high-speed rail"],
          answer: 3,
          explain: "扫二维码 scan a QR code；移动支付 mobile payment；高铁 high-speed rail（也说 high-speed railway）。sweep 是「打扫」，bar code 是条形码，express train 指特快列车。"
        },
        {
          q: "「教育在人的一生中起着重要作用。」哪个译文正确？",
          options: ["Education plays important role in a person's life.", "Education plays an important role in a person's life.", "Education plays an important part of a person's life.", "Education is playing important role in a person's life."],
          answer: 1,
          explain: "play an important role in 是固定搭配：role 前要有冠词 an，介词用 in（play a part in 也可以，但不能说 play a part of）。A、D 漏了冠词，C 的介词用错。"
        },
        {
          q: "「越来越多的人开始关注环境保护。」哪个译文正确？",
          options: ["More and more people begin to pay attention to environmental protection.", "More and more people begin to pay attention on environmental protection.", "More and more people begin to pay attentions to environmental protection.", "More and more people begin to take attention to environmental protection."],
          answer: 0,
          explain: "pay attention to 是固定搭配，attention 不可数，不能加 s。B 的介词用 on 是错的，C 多了 s，D 把 pay 写成了 take。"
        }
      ]
    },
    {
      id: 606,
      title: "数字、成语与四字短语：会算还要会说",
      minutes: 22,
      gist: "中文的万、亿、人次，英语没有对应单位；四字短语更不能逐字译。这一关专治这两类。",
      lesson: "① 中文数字单位与英语不同，这是最典型的错误来源：\n· 万 = ten thousand；十万 = a hundred thousand；百万 = a million；千万 = ten million；亿 = a hundred million\n· 「三千万」是 thirty million，不是 three thousand ten thousand；「四万公里」是 40,000 kilometres / forty thousand kilometres\n· 大数字加逗号分节更好读：1,400,000,000 读作 1.4 billion\n② 常用数量表达\n· more than / over 超过；nearly / almost 接近；about / around 大约；up to 多达\n· 百分数：15% = fifteen percent；70 percent of the students（percent 不加 s）\n· 倍数：twice as many as 是……的两倍；three times the size of 是……的三倍大\n· 序数与最高级：the second largest economy 第二大经济体；the world's longest wall 世界上最长的城墙（注意 the world's 的位置）\n· 单位：metres 米；kilometres 公里；kilograms 公斤；square kilometres 平方公里\n· hundred / thousand / million 前面有具体数字时不加 s：three hundred students、five thousand years、ten million visitors\n· 「人次」表示人次数：more than ten million visits；写作时若不确定，用 visitors 更稳妥\n③ 成语和四字短语：只译意思，不译字面\n· 历史悠久 → has a long history；丰富多彩 → rich and colourful / a wide variety of\n· 众所周知 → as we all know / It is well known that…；四面八方 → from all over / from all directions\n· 日新月异 → change with each passing day / change rapidly；一举两得 → kill two birds with one stone\n· 越来越受欢迎 → is becoming increasingly popular；家喻户晓 → is a household name\n· 代代相传 → be passed down from generation to generation；各行各业 → all walks of life\n④ 处理原则：先问「这句话到底在说什么事实」，再用英语里表达同一事实的说法。四字短语只是修饰时（如「丰富多彩的文化」），直接落成形容词 + 名词（a rich and colourful culture）就好，不要硬凑四个词。",
      usage: "看英文数据报告、把中国数据讲给外国同事听、写英文简历里的数字，都躲不开这些说法。",
      takeaways: [
        "万 = ten thousand，亿 = a hundred million，千万别逐字拼",
        "百分数 percent 不加 s；大数字用逗号分节",
        "成语译意思不译字面：四面八方 → from all over",
        "四字短语只作修饰时，用形容词 + 名词即可"
      ],
      type: "translate",
      taskTitle: "数字与四字短语",
      taskCopy: "先做上面的五道选择题，再把下面这段中文译成英文；检查器会核对数字换算与四字短语。",
      audio: [
        {
          file: "606-1.mp3",
          label: "数字怎么读",
          voice: "女声",
          hint: "跟着读一遍，注意 thousand / million / billion 的区别",
          transcript: "More than five thousand years.\nTwenty-one thousand kilometres.\nMore than ten million visitors.\nForty thousand kilometres.\nFifteen percent of the students.\nTwice as many as last year.\nThe second largest economy in the world.\nOne point four billion."
        }
      ],
      audioTip: "数字听不清就跟着读：中文的「万」在英语里要换算成 ten thousand，「千万」是 ten million，读顺了才不会写错。",
      passRatio: 0.8,
      source: "中国有五千多年的悠久历史。万里长城全长约两万一千公里，是世界上最长的城墙，每年吸引来自四面八方的游客超过一千万人次。近年来，中国人的生活日新月异，越来越多的家庭选择在假期出门旅行。",
      prompt: "把下面这段中文译成英文（不少于 45 词）。要求：① 数字换算正确（万、千万）；② 四字短语只译意思，不逐字硬译；③ 检查序数与最高级的语序。",
      placeholder: "China has a long history of ... / The Great Wall is ...",
      minWords: 45,
      points: [
        ["a long history", "more than five thousand years", "over five thousand years", "5,000 years", "5000 years", "five thousand years"],
        ["21,000 kilometres", "21,000 km", "21000 kilometres", "21000 km", "21,000 kilometers", "21000 kilometers", "twenty-one thousand kilometres", "twenty-one thousand kilometers"],
        ["the longest wall in the world", "the world's longest wall", "longest wall in the world"],
        ["from all over", "from all directions", "from every corner", "from around the world"],
        ["ten million", "10 million"],
        ["rapid changes", "changing rapidly", "change rapidly", "changes rapidly", "changing fast", "with each passing day"]
      ],
      sample: "China has a long history of more than five thousand years.\nThe Great Wall, about 21,000 kilometres long, is the longest wall in the world.\nEvery year, it attracts more than ten million visitors from all over the world.\nIn recent years, China has seen rapid changes, and more and more families choose to travel during their holidays.",
      questions: [
        {
          q: "「三千万」用英语怎么表达？",
          options: ["three thousand ten thousand", "thirty million", "three million", "thirty thousands million"],
          answer: 1,
          explain: "中文的「万」= ten thousand，三千万 = 3000 万 = 30 × 1,000,000 = thirty million。A 是逐字拼出来的说法；D 里 thousand 加了 s 又和 million 混用，都不成立。"
        },
        {
          q: "「长城全长约两万一千公里。」哪个译文正确？",
          options: ["The Great Wall is about twenty-one thousands kilometres long.", "The Great Wall is about 21,000 kilometre long.", "The Great Wall about 21,000 kilometres long.", "The Great Wall is about 21,000 kilometres long."],
          answer: 3,
          explain: "thousand 前面有具体数字时不加 s；长度单位用复数 kilometres；句子必须有谓语 is。A 的 thousands 错，B 的 kilometre 该用复数，C 缺谓语。"
        },
        {
          q: "「四面八方」最恰当的英文表达是？",
          options: ["four sides and eight directions", "everywhere on the map", "from all directions", "eight big roads"],
          answer: 2,
          explain: "四字短语译意思、不译字面：四面八方 = 从各处、从各地，最直接的对应是 from all directions，也可以说 from all over / from all over the country。A、D 是逐字硬译（four sides and eight directions / eight big roads），B 是硬凑的说法。注意 from all over the world 是「来自世界各地」，范围比原意更大，考试时按上下文选范围合适的说法。"
        },
        {
          q: "「70% 的学生通过了考试。」哪个译文正确？",
          options: ["70 percents of the students passed the exam.", "70 percent of the students passed the exam.", "70 percent of the student passed the exam.", "70 percents of student passed the exam."],
          answer: 1,
          explain: "percent 永远不加 s；of 后面的名词要和比例一致——「学生」是一群人，用复数 the students。C 用单数 the student，与 70% 矛盾；A、D 的 percents 是错误形式。"
        },
        {
          q: "「众所周知，茶起源于中国。」哪个译文最恰当？",
          options: ["It is well known that tea originated in China.", "It is well known that tea is originated in China.", "Well known that tea originated in China.", "As well known, tea originated in China."],
          answer: 0,
          explain: "「众所周知」用 It is well known that…，也可以说 As is well known, …。B 多了 is——originate 是不及物动词，没有被动语态；C 缺形式主语 It is；D 的 as well known 结构不完整。"
        }
      ]
    },
    {
      id: 607,
      title: "实用翻译：标识、公告、自我介绍",
      minutes: 20,
      gist: "标识要短、公告要清楚、自我介绍要自然——三类实用文本各有固定套路。",
      lesson: "这一关练真实生活里最常用的三类文本。\n① 标识（signs）：越短越好，用名词短语或祈使句，不写完整句子\n· Exit 出口 / Emergency Exit 紧急出口 / Entrance 入口 / No Parking 禁止停车 / No Smoking 禁止吸烟\n· Staff Only 员工专用 / Out of Order 故障 / Push 推 / Pull 拉 / Sold Out 售罄 / Free Admission 免费入场\n· Caution: Wet Floor 小心地滑 / Keep Off the Grass 勿踏草坪 / Lost and Found 失物招领 / Please Queue Here 请在此排队\n中式标识最常见的错误是逐字直译：「小心地滑」不是 Careful Slip，而是 Caution: Wet Floor。\n② 公告 / 通知（notices）：信息优先，常用被动、there be 和时间地点前置\n· 开头：Notice: / Please note that… / We regret to inform you that…\n· 要求：All students are required to… / Students who… should… / Please bring your student card.\n· 时间地点：The lecture will be held in Room 302 at 3 p.m. on Friday.\n· 收尾：Thank you for your understanding. / We are sorry for any inconvenience.\n· 「暂停开放」用 be closed；「系统升级」system upgrade；「一楼」在英式英语里是 the ground floor（美式说 the first floor）\n③ 自我介绍（self-introduction）：短句为主，信息顺序 = 身份 → 专业 / 工作 → 兴趣 → 期待\n· I'm a second-year student at the School of Foreign Languages, majoring in English.（美式也说 sophomore 表示大二）\n· I come from… / I major in… / I'm good at… / In my free time, I enjoy…\n· I hope to… / I'm looking forward to…（to 是介词，后面接动名词）\n④ 一个通用提醒：公告里少用 You must / You should，读起来像命令；用 are required to / are expected to 更得体。",
      usage: "看懂公共场所的英文标识、写出国用的英文通知、在英语角做自我介绍，都用得上。",
      takeaways: [
        "标识用名词短语或祈使句，越短越好：小心地滑 = Caution: Wet Floor",
        "公告：信息优先，常用 be closed / are required to / system upgrade",
        "公告收尾套语：We are sorry for any inconvenience.",
        "自我介绍顺序：身份 → 专业 → 兴趣 → 期待"
      ],
      type: "translate",
      taskTitle: "实用文本翻译",
      taskCopy: "先做上面的五道选择题，再把下面两段中文译成英文；检查器会核对公告套语与自我介绍的关键表达。",
      passRatio: 0.8,
      source: "通知：因图书馆系统升级，本周六暂停对外开放一天。需要还书的同学请使用一楼的自助还书机。给您带来不便，敬请谅解。\n\n大家好，我是外语学院的大二学生，专业是英语。我平时喜欢打篮球和看英文电影，希望能在英语角认识更多朋友。",
      prompt: "把下面两段中文译成英文（合计不少于 60 词）。要求：① 公告用被动和固定套语；② 自我介绍用短句，按「身份 → 专业 → 兴趣 → 期待」的顺序；③ 注意单复数与冠词。",
      placeholder: "Notice: The library will be closed ... / I am a second-year student ...",
      minWords: 60,
      points: [
        ["the library will be closed", "will be closed", "will not be open", "will be shut"],
        ["system upgrade", "system update", "upgrading its system", "upgrade of the system"],
        ["self-service book return machine", "self-service", "self service", "book return machine", "machine for returning books"],
        ["sorry for any inconvenience", "apologize for any inconvenience", "apologise for any inconvenience", "sorry for the inconvenience", "inconvenience caused"],
        ["second-year student", "sophomore", "second year student", "second-year"],
        ["majoring in English", "major in English", "my major is English", "I major in English"],
        ["make more friends", "make new friends", "meet more friends", "get to know more friends"]
      ],
      sample: "Notice: The library will be closed this Saturday for a system upgrade.\nIf you need to return books, please use the self-service book return machine on the ground floor.\nWe are sorry for any inconvenience.\n\nHello, everyone. I am a second-year student at the School of Foreign Languages, majoring in English.\nIn my free time, I enjoy playing basketball and watching English movies.\nI hope to make more friends at the English Corner.",
      questions: [
        {
          q: "在英语国家的公共场所，「小心地滑」的警示牌通常写作？",
          options: ["Careful Slip", "Caution: Wet Floor", "Be careful, it is slippery", "You must not slip here"],
          answer: 1,
          explain: "标识讲究短：Caution: Wet Floor 是通用写法（也可以直接写 Wet Floor）。A 是逐字硬译；C、D 是句子，句子能表达同样的意思，但不是标识的写法。"
        },
        {
          q: "「禁止停车」「员工专用」「故障」分别是？",
          options: ["Don't Park / Only Staff / It Doesn't Work", "No Park / Staff Use / Broken", "Not Parking / Employee Only / Out of Work", "No Parking / Staff Only / Out of Order"],
          answer: 3,
          explain: "标识有固定说法：No Parking、Staff Only、Out of Order。A 是句子式的解释；B 的 No Park、Staff Use 不是通用标识；C 的 Not Parking 不成立，Out of Work 意思是「失业」，不是「故障」。"
        },
        {
          q: "「讲座将于周五下午三点在 302 教室举行。」哪个译文最恰当？",
          options: ["The lecture will hold in Room 302 at 3 p.m. on Friday.", "The lecture will be held in Room 302 at 3 p.m. on Friday.", "The lecture will be taken place in Room 302 at 3 p.m. on Friday.", "The lecture will be hold in Room 302 at 3 p.m. on Friday."],
          answer: 1,
          explain: "hold 是及物动词，表示「举行」时必须用被动 be held；take place 没有被动，C 错；D 的 be hold 分词形式错。时间地点顺序：英语习惯先说小地点 in Room 302，再说时间 at 3 p.m. on Friday。"
        },
        {
          q: "公告结尾「给您带来不便，敬请谅解。」最得体的译文是？",
          options: ["You must understand us.", "Please don't mind the trouble.", "We are sorry for any inconvenience.", "It is your problem, not ours."],
          answer: 2,
          explain: "这是公告收尾的固定套语：We are sorry for any inconvenience. / We apologize for any inconvenience caused. 都可以。A 太生硬，B 是中式直译，D 完全不得体。"
        },
        {
          q: "「我是外语学院的大二学生，专业是英语。」哪个译文正确？",
          options: ["I am a second-year student at the School of Foreign Languages, majoring in English.", "I am a student of second year in foreign language school, major in English.", "I am a second-year student in the School of Foreign Languages, and major English.", "I am second-year student at School of Foreign Languages, majoring English."],
          answer: 0,
          explain: "「大二学生」是 a second-year student（美式也说 sophomore）；「专业是英语」用 majoring in English 作伴随状语。B 的语序与搭配都不对，C 的 major 作动词时要接 in，D 少了冠词 a，majoring 后面也缺 in。"
        }
      ]
    },
    {
      id: 608,
      title: "限时实战：一段 140–160 汉字的汉译英",
      minutes: 35,
      timeLimit: 35,
      gist: "按真实考试要求，限时 35 分钟完成一段 150 字左右的翻译，再对照要点表逐条自检。",
      lesson: "这一关完全按考试来：一段 140–160 汉字的汉语短文，限时 35 分钟（考试建议用时 30 分钟，这里多留 5 分钟给你检查）。\n实战五步法：\n① 读两遍（2 分钟）：通读并判断话题（文化 / 社会 / 科技 / 地理），圈出所有数字、时间、专有名词。\n② 切句（3 分钟）：按句号把原文切成 5–8 个意群，在草稿上给每一块标出「主语 + 谓语」。\n③ 逐句译（20 分钟）：先写有把握的句子；不会的词用简单说法绕过去（「茶马古道」不会写，就写 the ancient road for tea trade），千万别空着。\n④ 补连接（3 分钟）：句与句之间加 In addition / However / As a result 之类，让段落有层次；同一段里不要通篇都是 and。\n⑤ 检查（5 分钟）：按四条查一遍——时态（讲历史用过去时、讲现状用一般现在时、讲「近年来」用现在完成时）、单复数与冠词、主谓一致、数字和时间有没有漏译。\n考前必背 20 个表达（四级翻译的高频骨架，配本关音频跟读）：\n① play an important role in 在……中起重要作用\n② more and more / an increasing number of 越来越多\n③ have a long history of 有……年的历史\n④ be located in 位于\n⑤ be famous for 因……闻名\n⑥ be a symbol of 是……的象征\n⑦ It is said that… 据说\n⑧ It is believed that… 人们认为\n⑨ be built in 建于\n⑩ not only … but also … 不仅……而且……\n⑪ make … more convenient 使……更方便\n⑫ contribute to 有助于、促成\n⑬ With the development of… 随着……的发展\n⑭ In recent years 近年来\n⑮ be popular with 受到……的欢迎\n⑯ be passed down from generation to generation 代代相传\n⑰ provide sb with sth 为……提供\n⑱ be regarded as 被认为是\n⑲ account for 占（比例）\n⑳ take measures to do 采取措施做\n用法只有一条：先搭主谓骨架，再把这些表达嵌进去——它们是零件，不是整句。",
      usage: "限时把一整段中文译成英文，是留学文书、工作汇报、跨境客服里最真实的能力要求。",
      takeaways: [
        "限时 35 分钟：读两遍 → 切句 → 逐句译 → 补连接 → 检查",
        "先写有把握的句子，不会的词用简单说法绕开，不要空着",
        "时态三原则：历史用过去时、现状用一般现在时、近年来用现在完成时",
        "最后 5 分钟专查单复数、冠词、主谓一致和漏译"
      ],
      type: "translate",
      taskTitle: "限时翻译实战",
      taskCopy: "限时 35 分钟。先做上面的五道选择题热身，再完成整段翻译；提交后对照要点表，看看漏了哪一块。",
      audio: [
        {
          file: "608-1.mp3",
          label: "考前必背表达朗读",
          voice: "女声",
          hint: "跟读一遍，把这 20 个表达读顺，考场上直接取用",
          transcript: "play an important role in\nmore and more people\nhave a long history of\nbe located in the city centre\nbe famous for its tea\nbe a symbol of good luck\nIt is said that\nIt is believed that\nbe built in 1400\nnot only convenient but also cheap\nmake our life more convenient\ncontribute to economic growth\nwith the development of technology\nin recent years\nbe popular with young people\nbe passed down from generation to generation\nprovide students with free courses\nbe regarded as a symbol of friendship\naccount for 15 percent\ntake measures to protect the environment"
        }
      ],
      audioTip: "动笔前跟读一遍，让这 20 个表达先「上口」；写作时它们会自动冒出来，省下大量思考时间。",
      passRatio: 0.8,
      source: "茶是中国的国饮，中国人饮茶的历史已有几千年。相传，茶最早是一位古代帝王偶然发现的。唐代以后，饮茶逐渐成为一种风尚，茶马古道把茶叶运往各地。如今，茶不仅是一种饮料，更是一种生活方式：朋友相聚时，人们常常一边喝茶一边聊天。在很多城市，茶馆仍然是人们聚会和谈事情的地方。中国的茶文化已经传播到世界各地，受到越来越多人的喜爱。",
      prompt: "限时 35 分钟。把下面这段中文译成英文（不少于 90 词）。要求：① 数字、朝代名要译准；② 时态跟着内容走（历史用过去时，现状用现在时）；③ 提交后对照要点表，逐条检查有没有漏译。",
      placeholder: "Tea is the national drink of China ... / It is said that ...",
      minWords: 90,
      points: [
        ["the national drink", "national drink", "national beverage"],
        ["for thousands of years", "thousands of years", "have been drinking"],
        ["it is said that", "it's said that", "legend has it that", "according to legend", "tea is said to have been"],
        ["was first discovered", "first discovered", "was discovered accidentally"],
        ["the Tea-Horse Road", "Tea-Horse Road", "tea horse road", "ancient tea road", "ancient road for tea trade"],
        ["not only a drink but also", "not only a drink, but also", "not only a beverage but also", "not only is it a drink", "more than a drink", "not just a drink"],
        ["has spread all over the world", "has spread around the world", "spread all over the world", "is popular all over the world"],
        ["more and more people", "an increasing number of people", "a growing number of people"]
      ],
      sample: "Tea is the national drink of China, and the Chinese have been drinking it for thousands of years.\nIt is said that tea was first discovered accidentally by an ancient emperor.\nAfter the Tang Dynasty, drinking tea gradually became a popular custom, and the Tea-Horse Road carried tea leaves to different parts of the country.\nToday, tea is not only a drink but also a way of life: when friends get together, they often chat over a cup of tea.\nIn many cities, teahouses are still places where people meet up and talk things over.\nChinese tea culture has spread all over the world and is enjoyed by more and more people.",
      questions: [
        {
          q: "「唐代以后，饮茶逐渐成为一种风尚。」哪个译文正确？",
          options: ["After the Tang Dynasty, drinking tea has gradually became a popular custom.", "After the Tang Dynasty, drink tea gradually became a popular custom.", "After the Tang Dynasty, drinking tea gradually became popular custom.", "After the Tang Dynasty, drinking tea gradually became a popular custom."],
          answer: 3,
          explain: "叙述历史用一般过去时 became；主语是「饮茶」这件事，要用动名词 drinking tea；custom 是可数名词，前面要有 a。A 的 has + became 形式错误，B 拿动词原形作主语，C 漏了冠词。"
        },
        {
          q: "「茶马古道」最合适的译法是？",
          options: ["the Tea and Horse Big Road", "the Tea-Horse Road", "the Road of Tea Horses", "the Horse Tea Street"],
          answer: 1,
          explain: "茶马古道是专有名词，通用译法是 the Tea-Horse Road（也常说 the ancient tea road）。其余三个都是逐字硬译，英语读者看不出这是一条古代商路。"
        },
        {
          q: "「中国的茶文化已经传播到世界各地。」哪个译文正确？",
          options: ["Chinese tea culture has spread all over world.", "Chinese tea culture spread all over the world since 2000.", "Chinese tea culture has spread all over the world.", "Chinese tea culture have spread all over the world."],
          answer: 2,
          explain: "「已经传播到」用现在完成时 has spread；主语 culture 是单数，用 has。A 漏了 the，B 的 since 要求现在完成时，D 的 have 与单数主语不一致。"
        },
        {
          q: "「相传，茶最早是被一位古代帝王偶然发现的。」哪个译文最恰当？",
          options: ["It is said that tea was first discovered accidentally by an ancient emperor.", "It says tea was first discovered by an ancient emperor.", "It is said tea first discovered by an ancient emperor.", "People say that tea first discovered accidentally by an ancient emperor."],
          answer: 0,
          explain: "「相传」用 It is said that…；从句里的「被发现」必须用被动 was discovered。B 的 It says 是「（文字上）写着」；C 的从句缺 was；D 里 first discovered 没有被动形式。"
        },
        {
          q: "「随着科技的发展，移动支付让生活更方便。」用本关背过的表达，哪个译文最恰当？",
          options: ["With the development of technology, mobile payment makes our life more convenience.", "With developing of technology, mobile payment makes our life more convenient.", "With the development of technology, mobile payment make our life more convenient.", "With the development of technology, mobile payment makes our life more convenient."],
          answer: 3,
          explain: "With the development of… 和 make … more convenient 都在本关的必背表达里。A 把 convenient 写成了名词 convenience；B 的 With developing of 结构错误（development 是名词）；C 的 payment 是单数，谓语要用 makes。"
        }
      ]
    }
  ]
});