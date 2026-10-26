/* ============================================================================
 * HT Lab · C 语言课程 · 模块 0 · 起步上路
 * 关卡 id：1–8（本文件由模块作者维护；第 1 关是格式与文风基准）
 * 每关示例代码与标准答案都必须真实编译运行通过，output 字段为真实输出。
 * ==========================================================================*/
window.C_MODULES = window.C_MODULES || [];
window.C_MODULES.push({
  id: "c0",
  name: "模块 0 · 起步上路",
  levels: [
    {
      id: 1,
      title: "认识 C 程序：从源码到可执行文件",
      minutes: 12,
      gist: "看懂一个程序从源代码变成可执行文件的全过程，写出第一个能跑的程序。",
      lesson: "写 C 程序，本质上是让计算机按你写的步骤做事。你写的 .c 文件叫人能读的「源代码」，它不能直接运行；要先经过编译器翻译成机器能执行的程序，再运行。\n"
        + "这条链路是：源代码 → 预处理（展开 #include 和宏）→ 编译（翻译成汇编）→ 汇编（变成机器码目标文件）→ 链接（把用到的库函数拼进来）→ 可执行文件。Dev-C++ 按一次 F11，命令行敲一行 gcc，背后走的都是这五步。\n"
        + "程序的执行从一个固定的入口开始：main 函数。不管你把别的函数写在 main 前面还是后面，运行时第一句总是 main 里的第一句。\n"
        + "main 里每一行是一条语句，语句必须以分号 ; 结束——分号不是「分隔符」而是「结束符」，漏掉它编译器会直接报错。\n"
        + "#include <stdio.h> 的作用是把「标准输入输出」的声明拿过来用，printf 就是其中之一。stdio 是 standard input/output 的缩写。\n"
        + "printf 的第一个参数是格式字符串，里面 %d 这样的占位符会被后面的参数依次替换：printf(\"%d\\n\", 1 + 2) 会先算出 1+2 得 3，再把 3 填进 %d 的位置。\\n 是换行符，它是「一个字符」，不是斜杠加字母 n。\n"
        + "最后 return 0 表示 main 正常结束。操作系统看得到这个返回值：返回 0 通常代表「一切正常」，非 0 代表出错，脚本和自动化工具会靠它判断你的程序是否成功。\n"
        + "关于 C 标准版本：本课程按 C99/C11 写示例（例如后面会用 for (int i = 0; …) 这种 C99 写法，以及 stdbool.h、stdint.h 这些 C99 头文件）。如果你用 Dev-C++ 的默认设置编译，可能会遇到 \"'for' loop initial declarations are only allowed in C99 or C11 mode\" —— 这不是代码错，而是编译器还停在旧标准模式。打开「工具 → 编译选项 → 设置 → 代码生成/优化 → 语言标准」选 C11（或者勾选「编译时加入以下命令」填 -std=c11）；用命令行就写 gcc -std=c11 源文件.c -o 程序名。\n新手最常见的困惑是「为什么我写的多行代码只输出一行」：因为 printf 不会自动换行，你不写 \\n 它就接着往下拼。所以想让输出分行，就在每行末尾自己加 \\n。",
      example: {
        code: "#include <stdio.h>\n\n"
          + "int main(void) {\n"
          + "    printf(\"Hello, C!\\n\");\n"
          + "    printf(\"1 + 2 = %d\\n\", 1 + 2);\n"
          + "    return 0;\n"
          + "}",
        output: "Hello, C!\n1 + 2 = 3",
        explain: "第 1 行引入标准输入输出头文件，printf 的声明来自这里。第 3 行的 int main(void) 是入口：int 表示它返回一个整数，void 表示它不接收参数。"
          + "第 4、5 行是两条输出语句：第一条原样输出 Hello, C! 并换行；第二条里 %d 被 1 + 2 的结果 3 替换。"
          + "第 6 行 return 0; 把 0 交还给操作系统，表示程序正常结束。"
          + "注意每一行末尾的分号——这是初学者第一个、也是最常犯的错误。"
      },
      pitfalls: [
        "漏分号：`printf(\"hi\")` 后面不写 ; → 报 expected ';' before '}' token。",
        "把 \\n 写成 /n 或 \\N：那就只是普通字符，输出不会换行。",
        "写成 void main()：能骗过一些编译器，但不符合标准，返回值状态无法判断，正规写法一律 int main(void)。",
        "中文字符串在 Windows 控制台可能显示为乱码——这是控制台编码问题，不是程序错了；练习时先用英文输出。",
        "编译器版本太旧：看到 \"only allowed in C99 or C11 mode\" 时，不是代码错，按讲解里的方法把语言标准调到 C11（-std=c11）。"
      ],
      takeaways: [
        "C 程序从 main 开始执行，语句以分号结束",
        "#include <stdio.h> 才能使用 printf",
        "printf 的 %d 会被后面的整数替换，\\n 表示换行",
        "return 0 表示程序正常结束"
      ],
      questions: [
        {
          q: "一个 C 程序开始运行时，第一条被执行的语句在哪里？",
          options: [
            "在源文件的第一行",
            "在 main 函数里",
            "在最后定义的那个函数里",
            "在 #include 那一行"
          ],
          answer: 1,
          explain: "程序的入口是 main 函数，和函数写在文件里的位置无关。#include 只是编译前的准备工作，不是运行时的语句。"
        },
        {
          q: "语句 `printf(\"3 + 4\");` 会输出什么？",
          options: [
            "3 + 4 = 7",
            "7",
            "3 + 4",
            "什么都不输出"
          ],
          answer: 2,
          explain: "格式字符串里没有 %d 这样的占位符，括号里写什么就原样输出什么。要让程序算 3+4，必须写成 printf(\"%d\", 3 + 4)。"
        },
        {
          q: "关于语句末尾的分号，正确的说法是？",
          options: [
            "可写可不写，编译器会自动补",
            "只有 printf 这类语句需要写",
            "每条语句都必须以分号结束",
            "分号写在下一行的开头"
          ],
          answer: 2,
          explain: "分号是语句的结束符，漏写会直接编译失败。它必须紧跟在语句后面（同一行），写在下一行开头一样是语法错误。"
        }
      ],
      passRatio: 0.8,
      mission: "写一个完整的 C 程序：包含 stdio.h，定义 int main(void)，按顺序输出下面三行，然后正常结束。\n"
        + "第一行：Hello, HT Lab!\n"
        + "第二行：1 + 2 = 3（要求用 %d 让程序自己算出 3，不要直接把 3 写死在字符串里）\n"
        + "第三行：Ready to code.\n"
        + "写完在本机编译运行一次，确认输出与「运行结果比对」里的三行完全一致。",
      starter: "#include <stdio.h>\n\nint main(void) {\n    /* 在这里写三条 printf，注意每行末尾的 ; 和 \\n */\n\n    return 0;\n}",
      hint: "三条 printf 分别负责一行；第二行要写成 printf(\"1 + 2 = %d\\n\", 1 + 2); 让 %d 去接计算结果。写完先自己数一数：三个分号、三个 \\n，缺一个输出就会挤在一起。",
      check: {
        include: ["stdio.h"],
        return0: true,
        calls: [["printf", "Hello, HT Lab!"]],
        callCounts: [["printf", 3, 3]],
        forbid: ["puts", "fputs"],
        minStatements: 4,
        message: "需要有 #include <stdio.h>、int main(void)、恰好 3 次 printf（第一行必须是 Hello, HT Lab!）、以及 return 0;。",
        ok: "入口、三次输出、正常返回都齐全，结构完全正确。"
      },
      expectedOutput: "Hello, HT Lab!\n1 + 2 = 3\nReady to code.",
      solution: "#include <stdio.h>\n\n"
        + "int main(void) {\n"
        + "    printf(\"Hello, HT Lab!\\n\");\n"
        + "    printf(\"1 + 2 = %d\\n\", 1 + 2);\n"
        + "    printf(\"Ready to code.\\n\");\n"
        + "    return 0;\n"
        + "}",
      mastery: [
        "能独立写出一个包含 #include、main、printf、return 0 的最小可运行程序",
        "能说清源代码到可执行文件要经过哪几步",
        "看到编译报错 expected ';' 时，知道去补哪一行"
      ]
    },
    {
      id: 2,
      title: "变量与基本类型：int、double、char",
      minutes: 15,
      gist: "用变量把数据存起来：认识 int、double、char 三种常用类型，学会用 sizeof 量大小、看取值范围。",
      lesson: "变量就是一块有名字的内存。写下 int age = 20; 时，编译器做了三件事：按类型分配空间、把 20 存进去、以后用 age 这个名字访问它。类型决定了这块空间有多大、里面的二进制该怎么解释。\n"
        + "int 用来存整数，本机占 4 个字节，能表示 -2147483648 到 2147483647。这两个边界在 <limits.h> 里分别叫 INT_MIN 和 INT_MAX。\n"
        + "double 用来存小数，占 8 个字节，能表示很大和很小的数，但只有大约 15 到 17 位有效十进制数字的精度——这一点第 5 关会专门讲。\n"
        + "char 占 1 个字节，用来存单个字符，比如 'A'。字符在内存里其实就是一个小整数（'A' 是 65），所以用 %c 打印看到的是字符本身，用 %d 打印看到的是它的编码值。\n"
        + "sizeof 是编译期运算符，用来量一个类型或变量占多少字节：sizeof(int) 是 4、sizeof(double) 是 8，而 sizeof(char) 恒为 1——这是 C 标准的规定，char 就是「一个字节」的定义。sizeof 的结果类型是 size_t，一种无符号整数类型；直接用 %d 打印，在 64 位平台上类型不匹配（编译器会警告），本课的写法是先转成 int：(int)sizeof(int)。\n"
        + "每种类型都有自己的取值范围，超出边界就是溢出，但要分清两种情况：无符号整数的溢出是有定义的——按 2 的位数次方取模回绕，所以 UINT_MAX + 1 一定等于 0；有符号整数（int）的溢出则是未定义行为，编译器可以假设它不会发生，运行结果不可依赖，绝不要拿它做文章。\n"
        + "最后，printf 的格式符必须和类型对上：%d 对应 int，%f（或带精度的 %.2f）对应 double，%c 对应 char。局部变量最好在声明时给初值，否则它里面是内存中的垃圾值。\n"
        + "读别人的代码时，看到一组变量声明就能立刻知道作者打算存什么：计数器用 int，金额和比例用 double，单个字母或符号用 char。",
      example: {
        code: "#include <stdio.h>\n"
          + "#include <limits.h>\n\n"
          + "int main(void) {\n"
          + "    int age = 20;\n"
          + "    double price = 3.5;\n"
          + "    char grade = 'A';\n"
          + "    unsigned int cap = UINT_MAX;\n\n"
          + "    printf(\"age = %d\\n\", age);\n"
          + "    printf(\"price = %.2f\\n\", price);\n"
          + "    printf(\"grade = %c, code = %d\\n\", grade, grade);\n"
          + "    printf(\"sizes: int=%d double=%d char=%d\\n\",\n"
          + "           (int)sizeof(int), (int)sizeof(double), (int)sizeof(char));\n"
          + "    printf(\"INT_MAX = %d, INT_MIN = %d\\n\", INT_MAX, INT_MIN);\n"
          + "    printf(\"UINT_MAX = %u, UINT_MAX + 1 = %u\\n\", cap, cap + 1u);\n"
          + "    return 0;\n"
          + "}",
        output: "age = 20\nprice = 3.50\ngrade = A, code = 65\nsizes: int=4 double=8 char=1\nINT_MAX = 2147483647, INT_MIN = -2147483648\nUINT_MAX = 4294967295, UINT_MAX + 1 = 0",
        explain: "第 1、2 行引入两个头文件：stdio.h 给 printf 用，limits.h 提供 INT_MAX、INT_MIN、UINT_MAX 这些边界常量。"
          + "第 5 到 8 行声明了四个变量，每个都在声明时就给了初值：int 存整数、double 存小数、char 存一个字符、unsigned int 存无符号整数。"
          + "注意第 8 行把 UINT_MAX 存进 cap，这样这个「最大值」是运行时从变量里读出来的。"
          + "第 10 行用 %d 打印 int，第 11 行用 %.2f 打印 double——精度 .2 表示固定保留两位小数，所以 3.5 打印成 3.50。"
          + "第 12 行同一个 char 变量打印了两次：%c 给出字符 A，%d 给出它的编码值 65，这正说明 char 本质是个小整数。"
          + "第 13、14 行用 sizeof 量出三种类型的大小，并统一转换成 int 再用 %d 输出——直接写 sizeof(int) 交给 %d 会触发格式警告。"
          + "第 15 行打印 int 的取值范围，第 16 行演示无符号回绕：cap 是 4294967295，加 1 之后按模回绕成 0，这是标准保证的行为。"
      },
      pitfalls: [
        "用 %d 打印 double：printf(\"%d\", 3.5) 的类型和格式符不匹配，输出是乱七八糟的整数（%d 会按整数去解释那 8 个字节的一部分）。",
        "声明了变量却不初始化就打印：int x; printf(\"%d\", x); 输出的是内存里的垃圾值，每次运行都可能不一样。",
        "以为 int 一定是 4 字节：C 标准只保证它至少能装下 -32767 到 32767；本机是 4 字节，换平台要用 sizeof 量，而不是凭印象写。",
        "依赖有符号溢出的结果：int m = INT_MAX; m = m + 1; 是未定义行为，开优化后结果可能完全不同；要演示回绕请用 unsigned。",
        "把 'A' 和 \"A\" 混为一谈：'A' 是字符常量（值是 65 的 int），\"A\" 是字符串（占 2 个字节，末尾还有 \\0），用 %c 打印字符串会出错。"
      ],
      takeaways: [
        "int 存整数、double 存小数、char 存单个字符，分别用 %d、%.2f、%c 打印",
        "sizeof 量出类型占多少字节，结果是 size_t，本课用 (int) 转换后交给 %d",
        "sizeof(char) 恒为 1，本机 sizeof(int) 是 4、sizeof(double) 是 8",
        "无符号溢出按模回绕（UINT_MAX + 1 == 0），有符号溢出是未定义行为",
        "局部变量声明时就给初值，避免垃圾值"
      ],
      questions: [
        {
          q: "下面这行代码的问题是什么？`printf(\"%d\", sizeof(int));`",
          options: [
            "没有问题：sizeof 的返回类型就是 int，%d 正好匹配",
            "sizeof 的结果类型是 size_t，与 %d 要求的 int 不匹配，应先转换",
            "sizeof 不能写在 printf 的参数里",
            "sizeof 只能用于变量，不能用于类型名"
          ],
          answer: 1,
          explain: "sizeof 的结果类型是 size_t（一种无符号整数类型），直接交给 %d 属于类型不匹配，编译器会给出格式警告；本课的写法是 (int)sizeof(int)。C 错：sizeof 是运算符，它的结果当然可以当参数传给 printf。补充一点：在 64 位 gcc 上这段代码常常真的打印出 4，但那是「类型不匹配却碰巧能跑」的未定义行为，不能当正确写法，换编译器或加 -Wformat 就会暴露。D 错：sizeof(int) 这种带类型名的写法完全合法，而且很常用。"
        },
        {
          q: "在本机（64 位 Windows 上的 gcc）上，sizeof(char) 的值是多少？",
          options: [
            "2",
            "4",
            "一定是 1",
            "取决于 char 是 signed 还是 unsigned"
          ],
          answer: 2,
          explain: "C 标准规定 sizeof(char) 恒为 1——char 就是「一个字节」的定义，所以它没有第二种可能。char 一个字节有多少位由 CHAR_BIT 决定（通常是 8），但字节数永远是 1。带不带符号只影响能表示的范围，不影响大小，所以 D 错。int 在本机是 4 字节，但那是实现相关的，别和 char 混淆。"
        },
        {
          q: "`unsigned int u = UINT_MAX; u = u + 1;` 执行后 u 的值是？",
          options: [
            "0，无符号运算按 2 的位数次方取模回绕",
            "程序立刻崩溃",
            "这是未定义行为，结果无法预测",
            "4294967296"
          ],
          answer: 0,
          explain: "无符号整数的运算是良定义的：结果按 2^N 取模（N 是该类型的位数），UINT_MAX 是 2^32 - 1，加 1 正好回绕到 0。C 说的「未定义行为」指的是有符号整数溢出，不要混淆这两种情况，所以 C 错。D 错：unsigned int 装不下 4294967296，多出来的那一位被丢掉，剩下的就是 0。"
        }
      ],
      passRatio: 0.8,
      mission: "写一个完整的 C 程序，按顺序完成四件事：\n"
        + "1) 声明并初始化三个变量：int itemCount = 12; double unitPrice = 2.5; char currency = '$';\n"
        + "2) 用 printf 依次输出三行（值必须来自变量，不能写死在格式串里）：\n"
        + "itemCount: 12\n"
        + "unitPrice: 2.50\n"
        + "currency: $\n"
        + "3) 用 sizeof 量出 int、double、char 三种类型各占多少字节，输出第四行（把 sizeof 的结果转成 int 再用 %d 打印）：\n"
        + "sizes: int=4 double=8 char=1\n"
        + "4) 最后 return 0; 正常结束。\n"
        + "本机编译运行一次，确认四行输出与上面一致。",
      starter: "#include <stdio.h>\n\n"
        + "int main(void) {\n"
        + "    int itemCount = 12;\n"
        + "    double unitPrice = 2.5;\n"
        + "    char currency = '$';\n\n"
        + "    /* 前三行各用一次 printf，格式符分别用 %d、%.2f、%c */\n\n"
        + "    /* 第四行：printf(\"sizes: int=%d double=%d char=%d\\n\", (int)sizeof(...), ...); */\n\n"
        + "    return 0;\n"
        + "}",
      hint: "前三行各一次 printf：%d 接 int、%.2f 接 double、%c 接 char。第四行要在一行里放三个 (int)sizeof(...)，顺序是 int、double、char，别漏了转换——直接写 sizeof(int) 交给 %d 会有类型警告。",
      check: {
        include: ["stdio.h"],
        return0: true,
        seq: [["int", "itemCount", "="], ["double", "unitPrice", "="], ["char", "currency", "="]],
        calls: [["printf", "itemCount"], ["printf", "unitPrice"], ["printf", "currency"], ["printf", "sizes:"]],
        minStatements: 6,
        message: "需要 #include <stdio.h>、三个变量（int itemCount、double unitPrice、char currency）、4 次 printf（分别输出 itemCount、unitPrice、currency、sizes: 这四行）、以及 return 0;。",
        ok: "变量声明、三种格式符和 sizeof 都用对了，结构完整。"
      },
      solution: "#include <stdio.h>\n\n"
        + "int main(void) {\n"
        + "    int itemCount = 12;\n"
        + "    double unitPrice = 2.5;\n"
        + "    char currency = '$';\n\n"
        + "    printf(\"itemCount: %d\\n\", itemCount);\n"
        + "    printf(\"unitPrice: %.2f\\n\", unitPrice);\n"
        + "    printf(\"currency: %c\\n\", currency);\n"
        + "    printf(\"sizes: int=%d double=%d char=%d\\n\",\n"
        + "           (int)sizeof(int), (int)sizeof(double), (int)sizeof(char));\n"
        + "    return 0;\n"
        + "}",
      mastery: [
        "能根据数据性质选 int / double / char，并写出匹配的 printf 格式符",
        "能用 sizeof 量出类型大小，并说清结果是 size_t 为什么要转换",
        "能说出 int 的取值范围，并区分无符号回绕与有符号溢出的不同后果"
      ]
    },
    {
      id: 3,
      title: "输入与输出：printf 与 scanf",
      minutes: 15,
      gist: "让程序会对话：用 scanf 把键盘输入读进变量，搞懂取地址符 & 和格式说明符的配对规则。",
      lesson: "到上一关为止，程序只知道你写在代码里的数字。要让程序处理任意数据，就得从标准输入读进来，scanf 就是干这个的。\n"
        + "scanf 的工作方式是：照着格式串从左往右解析输入流，跳过空白字符，把读到的文本按格式符转换成对应的值，然后写回你指定的变量。所谓「写回」，意味着它必须知道变量在哪里——所以参数要传地址，也就是在变量前加取地址符 &。&n 读作「n 的地址」。这是 C 的传值语义决定的：函数拿到的只是值的一份拷贝，想改动原来的变量，只能把地址交出去。\n"
        + "格式符必须和变量类型严格配对。printf 和 scanf 在这里有一处重要差别：打印 double 时 printf 用 %f（float 会先被提升成 double），而读取 double 时 scanf 必须用 %lf，因为 scanf 收到的是指针，%f 对应的是 float*、%lf 才是 double*。读 int 两边都是 %d，读单个字符两边都是 %c。\n"
        + "格式串里的空格有特殊含义：它表示「跳过任意多个空白字符」，而不是「这里必须有一个空格」。所以 scanf(\"%d %d\", ...) 既能读 6 7，也能读跨行、跨多个空格的输入。反过来说，如果你的格式串里写了逗号，输入时就必须打逗号。\n"
        + "scanf 的返回值是「成功转换并赋值的项数」。输入 7 2.5 时返回 2；如果第一个字符就是字母，它匹配不上 %d，会立刻返回 0，变量保持原样，而那些字符仍留在输入缓冲区里。所以读入前把变量初始化、读入后检查返回值，是让程序更可靠的两个好习惯。EOF（通常是 -1）表示已经读不到任何数据了。\n"
        + "还有一点工程习惯：用 scanf 读字符串（%s）时如果不限制长度，输入过长就会写越界，这个问题等学过数组和字符串再处理，现阶段先把数字读明白。",
      example: {
        code: "#include <stdio.h>\n\n"
          + "int main(void) {\n"
          + "    int width = 0;\n"
          + "    int height = 0;\n\n"
          + "    scanf(\"%d %d\", &width, &height);\n"
          + "    printf(\"width = %d\\n\", width);\n"
          + "    printf(\"height = %d\\n\", height);\n"
          + "    printf(\"area = %d\\n\", width * height);\n"
          + "    return 0;\n"
          + "}",
        output: "width = 6\nheight = 7\narea = 42",
        explain: "程序运行后停在 scanf 那一行等你输入，这里输入的是 6 和 7（两个整数，中间用空格分隔），后面的输出就是这次运行的真实结果。"
          + "第 4、5 行先把两个变量初始化成 0；第 7 行一条 scanf 同时读两个整数：格式串 \"%d %d\" 表示读两个十进制整数，中间的空白表示跳过任意多个空白字符，&width、&height 把两个变量的地址交给 scanf，它才能把读到的值写回去。"
          + "第 8、9 行原样回显读到的值，第 10 行用 width * height 算出面积 42。"
          + "把输入换成别的数字，输出会跟着变——这就是程序开始「对外界有反应」了。",
        input: "6 7"
      },
      pitfalls: [
        "漏写 &：scanf(\"%d\", n); 默认只给一句警告就能编译通过，但运行时程序会把 n 的当前值当成地址去写，行为未定义，常见表现是直接崩溃。",
        "读 double 时用了 %f：scanf 的 %f 对应 float*，会把 4 个字节写进一个 8 字节的 double 空间，内存被写坏；scanf 读 double 必须写成 %lf。",
        "用 %d 读小数：输入 3.5 时 %d 只会拿走整数部分 3，小数点和 5 留在缓冲区里，后面再读就会错位。",
        "输入格式和格式串不一致：格式串里是 \"%d,%d\" 却输入了 6 7，或者格式串里写了逗号而输入用的是空格，scanf 会匹配失败，返回 0 或 1 而不是 2。",
        "不检查 scanf 的返回值：输入 \"abc\" 时它返回 0，变量保持原值，后面所有计算都建立在错误数据上。",
        "用 %s 读字符串却不限制长度：输入一长就会写越界（这个坑等学过数组再回来填）。"
      ],
      takeaways: [
        "scanf 要把读到的值写回变量，所以参数必须是地址：普通变量前加 &",
        "scanf 读 double 用 %lf、读 int 用 %d、读单个字符用 %c",
        "printf 打印 double 用 %f 或 %.2f，和 scanf 的 %lf 不是一回事",
        "格式串里的空白表示「跳过任意多个空白字符」，不是「必须有一个空格」",
        "scanf 返回成功赋值的项数；先初始化变量，再检查返回值"
      ],
      questions: [
        {
          q: "把 `scanf(\"%d\", n);`（n 是 int 变量）编译运行会怎样？",
          options: [
            "编译直接报错，提示必须写 &",
            "scanf 会自动补上 &，正常读入",
            "编译能过，但读不到任何数据，n 保持原值",
            "编译未必报错（gcc 默认可能连警告都没有）；运行时把 n 的值当成地址去写，行为未定义"
          ],
          answer: 3,
          explain: "scanf 需要 int*，这里传的是 int，属于类型不匹配。gcc 默认未必给诊断（开了 -Wall 才会提示格式不匹配），仍然会生成可执行文件，所以 A 错；运行时程序会把 n 里那个数字当地址使用，行为未定义（常见是崩溃），并不存在自动补 & 这回事，所以 B 错；C 描述的「读不到数据」太温和了，实际问题严重得多。"
        },
        {
          q: "要从键盘读入一个 double 变量 x，正确的写法是？",
          options: [
            "scanf(\"%d\", &x);",
            "scanf(\"%f\", &x);",
            "scanf(\"%lf\", &x);",
            "scanf(\"%c\", &x);"
          ],
          answer: 2,
          explain: "scanf 里 %f 对应 float*，%lf 才对应 double*，读 double 必须用 %lf，所以 B 错而 C 对。A 的 %d 对应 int*，会把 4 字节按整数解释，类型完全不对。D 的 %c 读的是单个字符，不是浮点数。注意这和 printf 不同：printf 里 float 会先提升成 double，所以打印 double 时 %f 和 %lf 都可以。"
        },
        {
          q: "程序里有 `int n = 5; scanf(\"%d\", &n);`，运行时输入的是 `abc`，结果是？",
          options: [
            "scanf 返回 0，n 仍然等于 5，这些字符还留在输入缓冲区里",
            "n 被自动设为 0",
            "scanf 会一直读到能转换成数字的字符为止",
            "程序立刻崩溃"
          ],
          answer: 0,
          explain: "scanf 返回的是成功转换并赋值的项数。遇到不能转换的字符，它立即停止并返回 0，既不会修改 n，也不会「消费」掉那个字符（除非格式串里有空白或 %c 之类），所以 A 对。B 错：scanf 从不主动给变量赋值成 0。C 错：scanf 不会替你跳过非法字符重试。D 错：读入失败不会让程序崩溃，但如果你不检查返回值，后面的计算就会用到旧数据。"
        }
      ],
      passRatio: 0.8,
      mission: "写一个完整的 C 程序，读入一行数据：一个整数和一个浮点数，用空格分隔（例如运行后输入 7 2.5），然后输出两行：\n"
        + "n = 7\n"
        + "p = 2.50\n"
        + "要求：\n"
        + "1) 变量声明时初始化：int n = 0; 与 double p = 0.0;\n"
        + "2) 用一条 scanf 读入：整数用 %d 配 int，浮点数用 %lf 配 double，两个参数都要加 &；\n"
        + "3) 用 printf 输出：n 用 %d，p 用 %.2f；\n"
        + "4) 最后 return 0;。\n"
        + "在本机编译运行，输入 7 2.5，确认输出与上面两行完全一致。",
      starter: "#include <stdio.h>\n\n"
        + "int main(void) {\n"
        + "    int n = 0;\n"
        + "    double p = 0.0;\n\n"
        + "    /* 一条 scanf 读入整数和浮点数：%d 配 int，%lf 配 double，两个都要加 & */\n\n"
        + "    /* 输出：n = ... 和 p = ...（p 保留两位小数） */\n\n"
        + "    return 0;\n"
        + "}",
      hint: "一条 scanf 就能读两个值：scanf(\"%d %lf\", &n, &p);。格式串里的空格表示「跳过空白」，输入 7 2.5 正好对上。输出两行分别是 printf(\"n = %d\\n\", n); 和 printf(\"p = %.2f\\n\", p);。写完记得在本机跑一次，输入 7 2.5 看结果。",
      check: {
        include: ["stdio.h"],
        return0: true,
        seq: [["&", "n"], ["&", "p"], ["double", "p", "="]],
        calls: [["scanf", "%d"], ["scanf", "%lf"], ["printf", "n ="], ["printf", "p ="]],
        minStatements: 6,
        message: "需要 #include <stdio.h>、int n 和 double p 两个变量、一次带 %d 和 %lf 的 scanf（参数要加 &）、输出 n = 与 p = 两行的 printf、以及 return 0;。",
        ok: "读入、格式符配对和输出都正确，结构完整。"
      },
      expectedOutput: "n = 7\np = 2.50",
      solution: "#include <stdio.h>\n\n"
        + "int main(void) {\n"
        + "    int n = 0;\n"
        + "    double p = 0.0;\n\n"
        + "    scanf(\"%d %lf\", &n, &p);\n"
        + "    printf(\"n = %d\\n\", n);\n"
        + "    printf(\"p = %.2f\\n\", p);\n"
        + "    return 0;\n"
        + "}",
      input: "7 2.5",
      mastery: [
        "能写出「读入 → 计算 → 输出」的完整程序，格式符与变量类型一一对应",
        "能解释 scanf 为什么需要 &，以及漏掉它的后果",
        "能区分 scanf 的 %lf 与 printf 的 %f，并说出 scanf 返回值的含义"
      ]
    },
    {
      id: 4,
      title: "运算符与表达式：算术、关系、逻辑与优先级",
      minutes: 18,
      gist: "把运算符组合成表达式：算得对、比得对、连得对，还要看懂短路求值为什么能救命。",
      lesson: "表达式是 C 程序的「计算单元」，由操作数和运算符组成。常用的运算符分四类：算术（+ - * / %）、关系（< <= > >= == !=）、逻辑（&& || !）、赋值（= 以及 += -= *= /= %= 这些复合形式）。\n"
        + "算术运算符里有两个必须记住的点：/ 在两个整数之间做的是整数除法，结果会丢掉小数部分；% 是取余，只能用于整数，写成 10.0 % 3 会直接编译报错。\n"
        + "关系运算和逻辑运算的结果都是 int 类型的 1（真）或 0（假），可以直接用 %d 打印出来。这一点和很多语言不同：C 里没有内建的布尔类型（C99 的 _Bool 和 <stdbool.h> 是后面才加的语言设施），条件判断看的是「这个整数是不是 0」，0 为假，非 0 为真。\n"
        + "&& 和 || 有一个非常重要的性质：短路求值。计算 a && b 时，先算 a；如果 a 是假，整个表达式必然是假，b 根本不会被计算。计算 a || b 时，如果 a 是真，b 也不会被计算。这让 `p != NULL && p->count > 0` 这类写法变得安全——左边不成立时，右边的解引用压根不会发生。\n"
        + "短路也有反面：如果右边带副作用，它可能「该执行却没执行」。比如 (i > 0) && (i--) 在 i 等于 0 时不会让 i 变成 -1，把自增自减写进逻辑表达式是很容易出错的习惯。\n"
        + "优先级方面，记住这条从高到低的链条就够了：一元运算符（!、++、--、强制类型转换）> 算术（* / % 高于 + -）> 关系（< 等）> 相等（== !=）> && > || > 赋值。同一优先级从左到右结合。真正写代码时不要靠背：拿不准就加括号，括号既能让编译器按你的意思算，也能让读代码的人一眼看懂。\n"
        + "最后提醒一个高频手误：= 是赋值，== 才是比较。if (a = 0) 会把 0 赋给 a，条件永远为假（而且编译器可能只给一句警告）。",
      example: {
        code: "#include <stdio.h>\n\n"
          + "int main(void) {\n"
          + "    int a = 7;\n"
          + "    int b = 3;\n"
          + "    int x = 5;\n"
          + "    int calls = 0;\n\n"
          + "    printf(\"a + b = %d\\n\", a + b);\n"
          + "    printf(\"a / b = %d\\n\", a / b);\n"
          + "    printf(\"a %% b = %d\\n\", a % b);\n"
          + "    printf(\"a > b : %d\\n\", a > b);\n"
          + "    printf(\"a == b : %d\\n\", a == b);\n"
          + "    printf(\"0 < x < 10 : %d\\n\", (x > 0) && (x < 10));\n\n"
          + "    int r1 = (x > 10) && (++calls > 0);\n"
          + "    int r2 = (x > 0) || (++calls > 0);\n"
          + "    printf(\"r1 = %d, r2 = %d, calls = %d\\n\", r1, r2, calls);\n"
          + "    return 0;\n"
          + "}",
        output: "a + b = 10\na / b = 2\na % b = 1\na > b : 1\na == b : 0\n0 < x < 10 : 1\nr1 = 0, r2 = 1, calls = 0",
        explain: "第 4 到 7 行准备四个变量：a、b 用来做算术，x 用来看判断，calls 专门用来「计数」——只要 ++calls 被执行，它的值就会变，这样短路的副作用就看得见了。"
          + "第 9、10 行是最普通的加法和整数除法：7 / 3 得 2（小数被丢掉），第 11 行用 %% 在格式串里输出一个百分号，真实计算的是 7 % 3 = 1。"
          + "第 12、13 行说明关系运算的结果是 1 或 0，而不是「真」「假」这样的文字。"
          + "第 14 行是组合条件：x > 0 和 x < 10 各自算出 1，再用 && 连起来得到 1——注意 C 里不能写 0 < x < 10 表示数学上的区间（那会变成先算 0 < x 再拿结果和 10 比）。"
          + "第 16、17 行是短路实验：x 是 5，r1 的左边 x > 10 为假，&& 右边不再计算，所以 calls 还是 0；r2 的左边 x > 0 为真，|| 右边同样被跳过，calls 依然是 0。两次 ++calls 都没执行，这就是短路求值最直接的证据。",
      },
      pitfalls: [
        "把 == 写成 =：if (a = 0) 会把 0 赋给 a，条件恒为假；这类手误编译器有时只给一句警告，读代码时要格外小心。",
        "对小数取余：10.0 % 3 编译直接报错（% 的操作数必须是整数），浮点取余要用 fmod。",
        "以为 7 / 2 会得到 3.5：两个整数相除就是整数除法，结果是 3，第 5 关会专门讲这个坑。",
        "把 && 写成 &、|| 写成 |：& 和 | 是按位运算，对 1 和 0 之外的值结果完全不同，例如 2 & 1 得 0 而 2 && 1 得 1。",
        "在逻辑表达式右边写副作用：(i > 0) && (i--) 里，i 等于 0 时 i-- 不会执行，程序看起来「少减了一次」。",
        "靠记忆判断优先级：x & 1 == 0 实际是 x & (1 == 0)，a + b >> 2 也不是 (a + b) >> 2 之外的其他含义——含义容易看错，加括号最省事。"
      ],
      takeaways: [
        "算术运算符 + - * / %，其中 % 只能用于整数",
        "关系运算和逻辑运算的结果都是 int 的 1（真）或 0（假）",
        "&& 和 || 会短路：左边能定结果时，右边不会计算",
        "优先级：一元 > 算术 > 关系 > 相等 > && > || > 赋值，拿不准就加括号",
        "= 是赋值，== 才是比较"
      ],
      questions: [
        {
          q: "a 和 b 都是 int，`a = 7; b = 2;` 之后表达式 `a / b * 2` 的值是多少？",
          options: [
            "7",
            "6",
            "7.0",
            "3"
          ],
          answer: 1,
          explain: "/ 和 * 优先级相同、从左到右结合：先算 7 / 2，两个整数相除得 3（小数被丢掉），再乘 2 得 6，所以 B 对。要得到 7 应该调整顺序写成 a * 2 / b，或者把其中一个操作数变成浮点。C 错：整个表达式全是 int，结果不可能是浮点。D 错：3 只是中间结果。"
        },
        {
          q: "a 是 -1 时，表达式 `(a > 0) && (b > 0)` 中的 `b > 0` 会怎样？",
          options: [
            "仍然会被求值一次",
            "会被求值两次",
            "不会被求值，这就是短路求值",
            "编译报错，逻辑与两边都必须是常量"
          ],
          answer: 2,
          explain: "&& 从左往右算，左边 a > 0 为假时整个表达式必然是假，右边没有必要再算，这就是短路求值，所以 C 对而 A、B 错。短路也是 `p != NULL && p->count > 0` 能安全的原因。D 错：&& 的操作数可以是任意表达式，没有「必须是常量」这种限制。"
        },
        {
          q: "`int x = 3; printf(\"%d\", x > 2);` 会输出什么？",
          options: [
            "0",
            "3",
            "true",
            "1"
          ],
          answer: 3,
          explain: "关系表达式 x > 2 成立，它的值是 int 类型的 1，所以 %d 输出 1，D 对。B 错：x > 2 的结果是「比较的结论」，不是 x 本身。C 错：C 没有内建的布尔类型，更没有 true 这个关键字（<stdbool.h> 里的 true 是后来用宏实现的，而且它本质也是 1）。A 是条件不成立时才会出现的值。"
        }
      ],
      passRatio: 0.8,
      mission: "写一个完整的 C 程序：用一条 scanf 读入两个整数 a 和 b（用空格分隔，例如输入 20 6），然后依次输出下面 6 行（以输入 20 6 为例）：\n"
        + "a + b = 26\n"
        + "a - b = 14\n"
        + "a * b = 120\n"
        + "a / b = 3\n"
        + "a % b = 2\n"
        + "0 < a < 100 : 1\n"
        + "要求：\n"
        + "1) 前 5 行用 %d 输出表达式的计算结果，不要自己心算后把数字写死；\n"
        + "2) 第 5 行要显示一个百分号：格式串里写成 printf(\"a %% b = %d\\n\", a % b);（%% 才会输出一个 %）；\n"
        + "3) 第 6 行判断 a 是否同时大于 0 且小于 100，必须用逻辑与 && 连接两个关系表达式 (a > 0) 和 (a < 100)，输出 1 或 0；\n"
        + "4) 最后 return 0;。",
      starter: "#include <stdio.h>\n\n"
        + "int main(void) {\n"
        + "    int a = 0;\n"
        + "    int b = 0;\n\n"
        + "    /* 一条 scanf 读入 a、b（记得加 &） */\n\n"
        + "    /* 输出 6 行：+ - * / % 和 0 < a < 100 的判断 */\n\n"
        + "    return 0;\n"
        + "}",
      hint: "前五行都是「格式串 + 表达式」的形式，例如 printf(\"a + b = %d\\n\", a + b);。第五行注意格式串里要写 %% 才能显示一个百分号。第六行把两个关系表达式用 && 连起来：printf(\"0 < a < 100 : %d\\n\", (a > 0) && (a < 100)); ——这里只是打印文字，不要真的写 0 < a < 100 这个表达式。",
      check: {
        include: ["stdio.h"],
        return0: true,
        seq: [["&", "a"], ["&", "b"], ["&&"], ["a", "%", "b"]],
        calls: [
          ["scanf", "%d"],
          ["printf", "a + b ="],
          ["printf", "a - b ="],
          ["printf", "a * b ="],
          ["printf", "a / b ="],
          ["printf", "%%"],
          ["printf", "0 < a < 100"]
        ],
        minStatements: 8,
        message: "需要 #include <stdio.h>、int a 与 int b、带 & 的 scanf、五行算术输出（+ - * / %，其中百分号要用 %% 输出）、用 && 连接 (a > 0) 和 (a < 100) 的第六行，以及 return 0;。",
        ok: "算术、取余、短路逻辑与和百分号转义都写对了，结构完整。"
      },
      expectedOutput: "a + b = 26\na - b = 14\na * b = 120\na / b = 3\na % b = 2\n0 < a < 100 : 1",
      solution: "#include <stdio.h>\n\n"
        + "int main(void) {\n"
        + "    int a = 0;\n"
        + "    int b = 0;\n\n"
        + "    scanf(\"%d %d\", &a, &b);\n"
        + "    printf(\"a + b = %d\\n\", a + b);\n"
        + "    printf(\"a - b = %d\\n\", a - b);\n"
        + "    printf(\"a * b = %d\\n\", a * b);\n"
        + "    printf(\"a / b = %d\\n\", a / b);\n"
        + "    printf(\"a %% b = %d\\n\", a % b);\n"
        + "    printf(\"0 < a < 100 : %d\\n\", (a > 0) && (a < 100));\n"
        + "    return 0;\n"
        + "}",
      input: "20 6",
      mastery: [
        "能写出包含算术、关系、逻辑运算的表达式，并正确使用 % 与 %%",
        "能按优先级读懂复杂表达式，并用括号把意图写清楚",
        "能解释短路求值的规则，并说出它在空指针判断中的作用"
      ]
    },
    {
      id: 5,
      title: "整数与浮点的陷阱：截断、溢出与精度",
      minutes: 18,
      gist: "为什么 7 / 2 得 3？为什么 0.1 + 0.2 不等于 0.3？这一关把整数除法、隐式转换和浮点精度一次讲清。",
      lesson: "第一个陷阱是整数除法。C 的规则很直接：两个整数相除，结果还是整数，小数部分被丢掉（向零截断）。7 / 2 得 3，-7 / 2 得 -3。请注意这是「丢掉」而不是「四舍五入」，3.99 也不会变成 4。\n"
        + "想得到真实的小数结果，必须让参与运算的操作数里至少有一个是浮点：写 7 / 2.0，或者写 (double)7 / 2。强制类型转换只影响它作用的那一个操作数，但已经足够把整个除法「升级」成浮点除法。反过来，(double)(7 / 2) 是先做整数除法再转换，得到的是 3.0，这两者差别很大，写代码时一定看清括号的位置。\n"
        + "第二个陷阱是类型混用时的隐式转换。在 a + b 这样的表达式中，如果一边是 int 一边是 double，int 会先自动转换成 double，再按 double 计算；而把结果存进变量时，又会按目标类型转换一次。所以 double half = 7 / 2; 得到的不是 3.5 而是 3.0——先算整数除法得 3，再把 3 转成 double。同样，int cut = 3.99; 得到的是 3，小数部分被直接丢弃。\n"
        + "第三个陷阱是溢出。有符号整数（int）的溢出是未定义行为：标准没有规定结果，编译器甚至可以假设「它不会发生」从而做出让人意外的优化。无符号整数则是良定义的模运算，超过最大值就回绕到 0。这两者的区别必须记牢，不要依赖有符号溢出的结果。\n"
        + "第四个陷阱是浮点精度。double 用二进制分数表示数字，像 0.1、0.2 这样的十进制小数在二进制里是无限循环小数，只能存一个近似值。它们相加的结果是 0.30000000000000004，所以 0.1 + 0.2 == 0.3 是假。用 %.17g 可以看到全部有效数字；而 double 大约只有 15 到 17 位十进制有效数字，超出部分不可信。\n"
        + "因此浮点数不能用 == 比较。判断两个浮点数是否相等，要看它们的差是否小于一个足够小的容差（例如 1e-9），这部分等学到数学库再展开。另外，% 取余只能用于整数，对浮点取余要使用 fmod。",
      example: {
        code: "#include <stdio.h>\n\n"
          + "int main(void) {\n"
          + "    int a = 7;\n"
          + "    int b = 2;\n"
          + "    double half = 7 / 2;\n"
          + "    double exact = 7 / 2.0;\n\n"
          + "    printf(\"a / b = %d\\n\", a / b);\n"
          + "    printf(\"7 / 2.0 = %.2f\\n\", exact);\n"
          + "    printf(\"double half = 7 / 2 gives %.2f\\n\", half);\n"
          + "    printf(\"0.1 + 0.2 = %.17g\\n\", 0.1 + 0.2);\n"
          + "    printf(\"0.1 + 0.2 == 0.3 : %d\\n\", 0.1 + 0.2 == 0.3);\n"
          + "    printf(\"(int)3.99 = %d\\n\", (int)3.99);\n"
          + "    printf(\"1 / 3 = %d, 1.0 / 3 = %.4f\\n\", 1 / 3, 1.0 / 3);\n"
          + "    return 0;\n"
          + "}",
        output: "a / b = 3\n7 / 2.0 = 3.50\ndouble half = 7 / 2 gives 3.00\n0.1 + 0.2 = 0.30000000000000004\n0.1 + 0.2 == 0.3 : 0\n(int)3.99 = 3\n1 / 3 = 0, 1.0 / 3 = 0.3333",
        explain: "第 6 行故意把 7 / 2 的结果存进 double 变量 half，它看起来「应该是 3.5」，但实际是 3.00——因为赋值发生在计算之后，右边早就按整数除法算完了。"
          + "第 7 行把操作数写成 2.0，除法立刻变成浮点除法，exact 拿到的是真正的 3.5。这两行放在一起，就是这个陷阱最好的对照。"
          + "第 9 行用 %d 输出 a / b 得 3；第 10 行输出精确除法结果 3.50。"
          + "第 12 行用 %.17g 打印 0.1 + 0.2 的全部有效数字，看到结尾多出来的 4——这就是二进制浮点的表示误差。第 13 行用 == 比较，结果是 0（假）。"
          + "第 14 行演示 (int)3.99 得到 3，转换是截断而不是四舍五入。"
          + "第 15 行对比 1 / 3 和 1.0 / 3：前者是整数除法得 0，后者是浮点除法得 0.3333——只要有一个操作数是浮点，整条表达式就按浮点算。",
      },
      pitfalls: [
        "求平均写成 (a + b) / 2：a、b 是 int 时先做整数除法，小数全丢；要写成 (a + b) / 2.0。",
        "用 == 比较两个浮点数：0.1 + 0.2 == 0.3 是假，正确做法是判断差值是否小于容差。",
        "把 double half = 7 / 2; 当成 3.5：计算在赋值之前完成，右边已经是 3，再转成 3.00。",
        "以为 int 溢出会「变成负数」：有符号溢出是未定义行为，换编译器或开优化后结果可能完全不同。",
        "对浮点数用 % 取余：编译直接报错，浮点取余要用 fmod 函数。",
        "以为 double 能精确表示任意小数：0.1、0.2、0.3 在二进制里都存不下，只有像 0.5、0.25 这类 2 的负幂才是精确的。"
      ],
      takeaways: [
        "两个整数相除，结果还是整数，小数被向零截断（7 / 2 得 3）",
        "要小数就让一个操作数变成浮点：(double)a / b 或 / 2.0",
        "把浮点结果存进 int 会截断小数，不是四舍五入",
        "有符号整数溢出是未定义行为，无符号整数溢出是模回绕",
        "浮点数只能近似表示十进制小数，不要用 == 比较"
      ],
      questions: [
        {
          q: "`double half = 7 / 2;` 执行后 half 的值是多少？",
          options: [
            "3.5",
            "3.0，因为先按整数除法算出 3，再转换成 double",
            "4.0，整数除法会四舍五入",
            "编译错误：不能把 int 赋给 double"
          ],
          answer: 1,
          explain: "赋值发生在计算之后：7 / 2 两个操作数都是 int，先按整数除法得到 3，再把 3 转换成 double 存进 half，所以是 3.0，B 对。想得到 3.5 要写 7 / 2.0 或 (double)7 / 2。C 错：整数除法是向零截断，不四舍五入。D 错：int 可以自动转换成 double，这是合法的隐式转换。"
        },
        {
          q: "在 double 上用 `printf(\"%d\", 0.1 + 0.2 == 0.3);` 会输出什么？",
          options: [
            "0，因为二进制浮点无法精确表示 0.1 和 0.2，相加后有极小误差",
            "1，数学上 0.1 + 0.2 等于 0.3",
            "编译错误：浮点数不能比较",
            "0.3"
          ],
          answer: 0,
          explain: "double 用二进制分数存储数字，0.1 和 0.2 都是无限循环的二进制小数，只能存近似值，相加得到 0.30000000000000004，所以比较结果是 0（假），A 对。B 是数学直觉，但计算机里的浮点不是数学实数。C 错：浮点数可以比较，只是 == 的结果常常不符合直觉。D 错：这行输出的是比较结果（1 或 0），不是数值本身。"
        },
        {
          q: "`int m = INT_MAX; m = m + 1;` 之后 m 的值？",
          options: [
            "一定是 INT_MIN",
            "不确定：有符号整数溢出是未定义行为，结果不可依赖",
            "自动提升成 long，保存 2147483648",
            "编译报错：整数溢出"
          ],
          answer: 1,
          explain: "C 标准规定有符号整数溢出是未定义行为，编译器可以做任何假设（例如认为这行代码不可能被执行），所以结果不可依赖，B 对。A 是很多平台上「碰巧」出现的现象，正是最危险的误解。C 错：表达式 m + 1 的类型仍是 int，不会自动变成 long。D 错：这类溢出在编译期通常不会报错。要演示回绕请用 unsigned 类型，那是标准保证的。"
        }
      ],
      passRatio: 0.8,
      mission: "写一个完整的 C 程序：用一条 scanf 读入两个整数 a 和 b（例如输入 7 2），然后输出 5 行（以输入 7 2 为例）：\n"
        + "7 / 2 (int) = 3\n"
        + "7 / 2 (double) = 3.5000\n"
        + "7 % 2 = 1\n"
        + "0.1 + 0.2 = 0.30000000000000004\n"
        + "0.1 + 0.2 == 0.3 : 0\n"
        + "要求：\n"
        + "1) 第 1 行格式串写成 \"%d / %d (int) = %d\\n\"，参数依次是 a、b、a / b；\n"
        + "2) 第 2 行必须先转换再除：用 (double)a / b 得到真实除法结果，格式串写成 \"%d / %d (double) = %.4f\\n\"；\n"
        + "3) 第 3 行计算 a % b，格式串里的百分号要写成 %%；\n"
        + "4) 第 4 行用 %.17g 打印 0.1 + 0.2；\n"
        + "5) 第 5 行用 == 比较 0.1 + 0.2 与 0.3，用 %d 输出比较结果（应为 0）；\n"
        + "6) 最后 return 0;。",
      starter: "#include <stdio.h>\n\n"
        + "int main(void) {\n"
        + "    int a = 0;\n"
        + "    int b = 0;\n\n"
        + "    /* 一条 scanf 读入 a、b */\n\n"
        + "    /* 1) 整数除法  2) (double)a / b 的真实除法  3) 取余 */\n\n"
        + "    /* 4) 用 %.17g 打印 0.1 + 0.2   5) 用 == 比较 0.1 + 0.2 与 0.3 */\n\n"
        + "    return 0;\n"
        + "}",
      hint: "第 2 行的关键是「先转换再除」：(double)a / b 把 a 变成 double，整个除法就按浮点算；写成 (double)(a / b) 则是先做整数除法再转换，结果还是整数。第 4、5 行把常量表达式直接写在 printf 的参数里即可，例如 printf(\"0.1 + 0.2 = %.17g\\n\", 0.1 + 0.2);。",
      check: {
        include: ["stdio.h"],
        return0: true,
        seq: [["&", "a"], ["&", "b"], ["(", "double", ")", "a"], ["a", "%", "b"]],
        calls: [
          ["scanf", "%d"],
          ["printf", "(int) ="],
          ["printf", "(double) ="],
          ["printf", "%.17g"],
          ["printf", "== 0.3"]
        ],
        minStatements: 8,
        message: "需要 #include <stdio.h>、int a 与 int b、带 & 的 scanf、用 (double)a / b 的真实除法、五行输出（整数除法、浮点除法、取余、%.17g 精度、== 比较）以及 return 0;。",
        ok: "整除截断、强制转换、取余和浮点精度都处理对了，结构完整。"
      },
      expectedOutput: "7 / 2 (int) = 3\n7 / 2 (double) = 3.5000\n7 % 2 = 1\n0.1 + 0.2 = 0.30000000000000004\n0.1 + 0.2 == 0.3 : 0",
      solution: "#include <stdio.h>\n\n"
        + "int main(void) {\n"
        + "    int a = 0;\n"
        + "    int b = 0;\n\n"
        + "    scanf(\"%d %d\", &a, &b);\n"
        + "    printf(\"%d / %d (int) = %d\\n\", a, b, a / b);\n"
        + "    printf(\"%d / %d (double) = %.4f\\n\", a, b, (double)a / b);\n"
        + "    printf(\"%d %% %d = %d\\n\", a, b, a % b);\n"
        + "    printf(\"0.1 + 0.2 = %.17g\\n\", 0.1 + 0.2);\n"
        + "    printf(\"0.1 + 0.2 == 0.3 : %d\\n\", 0.1 + 0.2 == 0.3);\n"
        + "    return 0;\n"
        + "}",
      input: "7 2",
      mastery: [
        "能一眼看出表达式会不会发生整数截断，并写出正确的修正写法",
        "能说清 0.1 + 0.2 != 0.3 的原因，并用 %.17g 观察浮点误差",
        "能区分有符号溢出（未定义行为）与无符号回绕（有定义），并避开依赖溢出的写法"
      ]
    },
    {
      id: 6,
      title: "常量与 const：给不会变的值起个名字",
      minutes: 15,
      gist: "字面量有类型、宏是文本替换、const 是只读变量、enum 是一组有名字的整数——一次分清四种常量。",
      lesson: "先看字面量——你直接写在代码里的数值也带类型。100 是 int，100L 是 long，100u 是 unsigned int；3.14 是 double，3.14f 才是 float；'A' 是字符常量，它的类型其实是 int；\"A\" 是字符串字面量，占两个字节（字符加结尾的 \\0）。类型不同，sizeof 的结果就不同，这一点在上一关已经见过。\n"
        + "为什么不能到处直接写数字？因为「魔法数字」有三宗罪：读代码的人不知道 3.14159 是什么，想改的时候容易漏掉某处，写错了编译器也不会提醒你。给它起个名字，这三个问题一起解决。\n"
        + "#define 是最古老的办法，它由预处理器处理，做的是纯文本替换——在编译之前，代码里所有 PI 都会被替换成 3.14159。所以宏没有类型、不占内存、也不参与语法检查；惯例是写成全大写，行尾绝对不要加分号（分号会被一起替换进去）。另外，因为替换是纯文本，宏的值如果是表达式就要加括号：#define N (5 + 5)，否则 N * 2 会展开成 5 + 5 * 2，等于 15 而不是 20。\n"
        + "const 是给变量加一把锁：const double radius = 2.0; 之后 radius 有类型、有作用域，只是不能被赋值修改。它参与类型检查，调试器里也能看到值。要留意的是，const 变量并不因此变成「编译期常量」：const int n = 5; 不能用作 switch 的 case 标签（那里需要整型常量表达式）。\n"
        + "enum 用来把一组相关的整数常量打包命名：enum Level { LOW = 1, MID = 2, HIGH = 3 }; 之后 LOW、MID、HIGH 就是三个可以直接使用的常量。不写 = 值时默认从 0 开始、依次加 1；只给第一个赋值，后面的会接着递增。枚举最适合表示状态、等级、选项这类「取值有限」的量，代码里出现 HIGH 比出现 3 好读得多。\n"
        + "三者的选择并不复杂：编译期就要确定、只是给数字起名字，用 #define 或 enum；需要有类型、参与检查的只读值，用 const。读别人的代码时，全大写的标识符通常意味着宏或者约定俗成的常量。",
      example: {
        code: "#include <stdio.h>\n\n"
          + "#define PI 3.14159\n"
          + "#define MAX_SCORE 100\n\n"
          + "enum Level { LOW = 1, MID = 2, HIGH = 3 };\n\n"
          + "int main(void) {\n"
          + "    const double radius = 2.0;\n"
          + "    enum Level lv = HIGH;\n\n"
          + "    printf(\"PI = %.5f\\n\", PI);\n"
          + "    printf(\"area = %.4f\\n\", PI * radius * radius);\n"
          + "    printf(\"MAX_SCORE = %d\\n\", MAX_SCORE);\n"
          + "    printf(\"level = %d, MID = %d\\n\", (int)lv, MID);\n"
          + "    printf(\"sizes: 100 -> %d, 3.14 -> %d, 3.14f -> %d\\n\",\n"
          + "           (int)sizeof(100), (int)sizeof(3.14), (int)sizeof(3.14f));\n"
          + "    return 0;\n"
          + "}",
        output: "PI = 3.14159\narea = 12.5664\nMAX_SCORE = 100\nlevel = 3, MID = 2\nsizes: 100 -> 4, 3.14 -> 8, 3.14f -> 4",
        explain: "第 3、4 行是两个宏常量：写的时候没有分号，靠换行结束。第 6 行定义枚举类型 Level，三个成员分别被显式赋成 1、2、3。"
          + "第 9 行的 const double radius 是一个只读变量：它有类型，参与编译检查，只是不能被再次赋值。"
          + "第 10 行声明枚举变量 lv 并初始化成 HIGH，这里用的是枚举成员的名字而不是数字。"
          + "第 12、13 行直接用宏名参与计算：area 那一行展开后是 3.14159 * radius * radius，得 12.5664。"
          + "第 15 行同时打印枚举变量和枚举成员：lv 用 (int) 显式转换后交给 %d，MID 直接交给 %d，输出的是它们在枚举里的值 3 和 2。"
          + "第 16、17 行用 sizeof 对比三种字面量：100 是 int（4 字节）、3.14 是 double（8 字节）、3.14f 是 float（4 字节）。字面量的类型由写法决定，不看它「看起来像什么」。",
      },
      pitfalls: [
        "#define MAX 100; 行尾多写分号：后面写 int a[MAX]; 会被替换成 int a[100;];，编译直接报错。",
        "宏的值不加括号：#define N 5 + 5 之后 N * 2 展开成 5 + 5 * 2 = 15，不是 20；应该写成 #define N (5 + 5)。",
        "以为宏有类型或能取地址：#define MAX 100 只是文本替换，&MAX 会编译失败，也没有 int 或 long 之说。",
        "宏名和变量重名：一旦 #define x 2，后面所有叫 x 的标识符都会被换成 2，报错信息会变得非常难懂。",
        "以为 const 变量就是编译期常量：const int n = 5; 不能用作 switch 的 case 标签，那里要求的是整型常量表达式。",
        "以为枚举变量只能装枚举里列出的值：C 的 enum 底层就是整数类型，lv = 99; 编译器通常不会拦你，取值是否合法要靠自己的代码保证。"
      ],
      takeaways: [
        "字面量也有类型：100 是 int、3.14 是 double、3.14f 是 float、'A' 是字符常量",
        "#define 是预处理阶段的文本替换：没有类型、不占内存，惯例全大写、行尾不加分号",
        "const 是有类型的只读变量，参与编译检查，但不能当编译期常量表达式用",
        "enum 定义一组有名字的整型常量，不写值时默认从 0 开始依次加 1",
        "用有名字的常量代替魔法数字，代码更好读、更好改"
      ],
      questions: [
        {
          q: "关于 `#define MAX 100` 和 `const int max = 100;`，正确的说法是？",
          options: [
            "宏在预处理阶段做文本替换、没有类型；const 变量有类型，参与编译检查",
            "两者完全一样，只是写法不同",
            "const 变量在预处理阶段被替换成常量",
            "宏有类型，const 变量没有类型"
          ],
          answer: 0,
          explain: "宏由预处理器处理，本质是纯文本替换，替换完成后编译器看到的就是 100，所以宏没有类型、不占内存；const 修饰的是真正的变量，有类型、有作用域，只是不允许被赋值，A 对。B 错：这正是一般建议「需要类型检查就用 const」的原因。C 错：预处理器只认识 #define，不认识 const。D 错：说反了。"
        },
        {
          q: "字面量 `3.14f` 的类型是什么？",
          options: [
            "double",
            "int",
            "float",
            "long double"
          ],
          answer: 2,
          explain: "浮点字面量默认是 double，加后缀 f（或 F）才是 float，所以 3.14 是 double、3.14f 是 float，C 对。A 是没有后缀的 3.14 的类型。B 错：带小数点的字面量不可能是整型。D 错：long double 要加后缀 L。这个区别在 printf 里体现得很直接：float 传给 printf 时会先提升成 double，所以打印两种字面量都用 %f，但 sizeof 会告诉你它们本来不一样（4 和 8）。"
        },
        {
          q: "`enum Level { LOW = 1, MID, HIGH };` 中 HIGH 的值是多少？",
          options: [
            "1",
            "2",
            "3",
            "编译错误，每个成员都必须显式赋值"
          ],
          answer: 2,
          explain: "枚举成员按顺序取值：LOW 被显式赋成 1，MID 没有写值，取前一个成员的值加 1 得 2，HIGH 再递增得 3，所以 C 对。如果只写 enum Level { LOW, MID, HIGH }; 那么 LOW 从 0 开始，三个成员分别是 0、1、2。D 错：只有第一个成员需要赋值，后面的允许省略。"
        }
      ],
      passRatio: 0.8,
      mission: "写一个完整的 C 程序，用三种方式定义常量并使用它们：\n"
        + "1) 在 #include 之后、main 之前，用 #define 定义宏常量 PI 为 3.14159（行尾不要加分号）；\n"
        + "2) 同样用 #define 定义宏常量 MAX_SCORE 为 100；\n"
        + "3) 在 main 之前定义枚举：enum Level { LOW = 1, MID = 2, HIGH = 3 };\n"
        + "4) 在 main 里用 const double 声明只读变量 radius = 2.0，并声明 enum Level lv = HIGH;\n"
        + "5) 输出四行：\n"
        + "PI = 3.14159\n"
        + "area = 12.5664\n"
        + "MAX_SCORE = 100\n"
        + "level = 3\n"
        + "其中 area 用 PI * radius * radius 计算后以 %.4f 输出，level 用 (int)lv 转换后以 %d 输出，PI 用 %.5f 输出。",
      starter: "#include <stdio.h>\n\n"
        + "/* 1) 在这里用 #define 定义 PI 和 MAX_SCORE（行尾不要分号） */\n\n"
        + "/* 2) 在这里定义 enum Level { LOW = 1, MID = 2, HIGH = 3 }; */\n\n"
        + "int main(void) {\n"
        + "    const double radius = 2.0;\n"
        + "    enum Level lv = HIGH;\n\n"
        + "    /* 输出四行：PI = ... / area = ... / MAX_SCORE = ... / level = ... */\n\n"
        + "    return 0;\n"
        + "}",
      hint: "#define 的写法是 #define PI 3.14159，注意行尾不加分号，宏名习惯全大写。area 那行直接用宏名参与计算：printf(\"area = %.4f\\n\", PI * radius * radius);。level 用 printf(\"level = %d\\n\", (int)lv); 打印，显式转换能让意图更清楚。",
      check: {
        include: ["stdio.h"],
        return0: true,
        require: { enum: "Level" },
        seq: [["const", "double", "radius", "="], ["enum", "Level", "lv", "="], ["(", "int", ")", "lv"]],
        calls: [["printf", "PI ="], ["printf", "area ="], ["printf", "MAX_SCORE"], ["printf", "level ="]],
        minStatements: 7,
        message: "需要 #include <stdio.h>、enum Level 的定义、const double radius、enum Level lv、四次 printf（PI、area、MAX_SCORE、level 四行）以及 return 0;。",
        ok: "宏常量、const 只读变量和枚举都用上了，结构完整。"
      },
      expectedOutput: "PI = 3.14159\narea = 12.5664\nMAX_SCORE = 100\nlevel = 3",
      solution: "#include <stdio.h>\n\n"
        + "#define PI 3.14159\n"
        + "#define MAX_SCORE 100\n\n"
        + "enum Level { LOW = 1, MID = 2, HIGH = 3 };\n\n"
        + "int main(void) {\n"
        + "    const double radius = 2.0;\n"
        + "    enum Level lv = HIGH;\n\n"
        + "    printf(\"PI = %.5f\\n\", PI);\n"
        + "    printf(\"area = %.4f\\n\", PI * radius * radius);\n"
        + "    printf(\"MAX_SCORE = %d\\n\", MAX_SCORE);\n"
        + "    printf(\"level = %d\\n\", (int)lv);\n"
        + "    return 0;\n"
        + "}",
      mastery: [
        "能用 #define、const、enum 三种方式定义常量，并说出它们的区别",
        "能读懂带后缀的字面量（100L、3.14f）并说出它们各自的类型",
        "能把代码里的魔法数字替换成有名字的常量"
      ]
    },
    {
      id: 7,
      title: "格式化输出精讲：宽度、精度与对齐",
      minutes: 15,
      gist: "掌握 %5d、%-8s、%8.2f、%05d 这些写法，让输出对齐、好看，能直接当表格看。",
      lesson: "printf 的格式说明符有完整的结构：%[标志][宽度][.精度]转换字符。把这几段拆开看，就不再是背符号了。\n"
        + "宽度是「最少占多少个字符位置」。数据本身比宽度短，就用空格补足；默认靠右对齐，因为数字右对齐才好比较大小。在宽度前加一个减号就变成左对齐（%-8s），用 0 开头则表示补零而不是补空格（%05d）。注意宽度是「最小」宽度：%3d 打印 12345 时不会截断，仍然完整输出 5 个数字。\n"
        + "精度是小数点后面那个数。对浮点数，%.2f 表示保留两位小数，并且会四舍五入：3.14159 变成 3.14，3.5 变成 3.50（%.2f 还保证一定输出两位，哪怕末尾是 0）。对字符串，精度表示「最多输出几个字符」，%.3s 打印 HELLOWORLD 只会得到 HEL。对整数，精度表示「最少输出几位数字」，不够就在前面补零，所以 %.2d 打印 7 得到 07。\n"
        + "把宽度和精度连起来就是排版利器：%-8s 用来放左对齐的名称列，%10.2f 用来放右对齐的金额列，两列一拼就是一张整齐的小票或报表。这也是为什么工程代码里的日志、报表几乎都带着这些格式——对齐不是好看而已，是让人能一眼扫出哪一列对不上。\n"
        + "转义字符是格式串里的另一半知识。\\n 是换行，\\t 是制表符（跳到下一个制表位，适合做简易对齐），\\\\ 输出一个反斜杠，\\\" 在字符串里输出双引号，%% 输出一个百分号。要特别注意 %%：格式串里的 % 是格式说明符的开始，想显示字面的百分号必须写两个，否则 % 后面的字符会被当作格式符去解释。\n"
        + "顺带记住：printf 的返回值是实际输出的字符个数，写文件或做进度条时会用到，现阶段知道有这回事就行。",
      example: {
        code: "#include <stdio.h>\n\n"
          + "int main(void) {\n"
          + "    printf(\"[%5d]\\n\", 42);\n"
          + "    printf(\"[%-5d]\\n\", 42);\n"
          + "    printf(\"[%05d]\\n\", 42);\n"
          + "    printf(\"[%8.2f]\\n\", 3.14159);\n"
          + "    printf(\"[%-8.2f]\\n\", 3.14159);\n"
          + "    printf(\"[%.3s]\\n\", \"HELLOWORLD\");\n"
          + "    printf(\"Item\\t%8s\\n\", \"Price\");\n"
          + "    printf(\"He said \\\"hi\\\", 100%% ready.\\n\");\n"
          + "    return 0;\n"
          + "}",
        output: "[   42]\n[42   ]\n[00042]\n[    3.14]\n[3.14    ]\n[HEL]\nItem\t   Price\nHe said \"hi\", 100% ready.",
        explain: "前五行故意在输出两边加上方括号，这样补出来的空格就看得见了。"
          + "第 4 行 %5d 让 42 占 5 个位置、右对齐，前面补 3 个空格；第 5 行加上减号变成左对齐，空格补在右边；第 6 行用 0 填充，得到 00042。"
          + "第 7、8 行对比 %8.2f 与 %-8.2f：同样是 3.14159，前者先按精度取两位小数得 3.14，再右对齐补 4 个空格；后者把空格补在右边。"
          + "第 9 行演示字符串精度：%.3s 只输出前 3 个字符 HEL，精度在这里是「最多几个字符」的意思。"
          + "第 10 行用 \\t 把 Price 推到下一个制表位。"
          + "第 11 行是转义组合：\\\" 输出双引号，%% 输出一个百分号——去掉那个多余的 %，编译器就会拿 % 后面的空格当格式符，输出完全变样。",
      },
      pitfalls: [
        "在格式串里直接写一个 %：printf(\"100% done\") 里的 % 会被当成格式说明符的开始，输出错乱，编译器也会警告；要写 printf(\"100%% done\")。",
        "想左对齐却忘了减号：%8s 是右对齐，%-8s 才是左对齐，做表头时最容易在这里错位。",
        "用 %.2d 想保留两位小数：整数的精度表示最少数字位数，%.2d 打印 7 得到 07；小数要用 %.2f。",
        "以为宽度会截断数据：%3d 打印 12345 依然完整输出 12345，宽度只是最小值，超出就撑开。",
        "格式符和参数类型不匹配：printf(\"%d\", 3.5) 或 printf(\"%f\", 5) 都是错的，编译器会给出格式警告，运行结果也不可信。",
        "把转义写成 /n 或 \\N：那只是两个普通字符，不会换行，屏幕上会直接显示 /n。"
      ],
      takeaways: [
        "格式说明符的结构：%[标志][宽度][.精度]转换字符",
        "宽度是最小字段宽度：默认右对齐，- 表示左对齐，0 表示补零",
        "浮点精度 .2 表示保留两位小数（四舍五入），字符串精度表示最多输出几个字符",
        "宽度不够只会撑开，不会截断数据",
        "常用转义：\\n 换行、\\t 制表、\\\\ 反斜杠、\\\" 双引号、%% 百分号"
      ],
      questions: [
        {
          q: "`printf(\"[%5d]\", 42);` 会输出什么？",
          options: [
            "[42   ]",
            "[   42]",
            "[42]",
            "[00042]"
          ],
          answer: 1,
          explain: "%5d 表示至少占 5 个字符位置，整数默认右对齐，所以左边补 3 个空格，输出 [   42]，B 对。A 是 %-5d（左对齐）的结果。C 是 %d 不加宽度的结果。D 需要 %05d 才会出现，那是用 0 而不是空格填充。"
        },
        {
          q: "`printf(\"%.2f\", 3.14159);` 会输出什么？",
          options: [
            "3.15",
            "3.14159",
            "3",
            "3.14"
          ],
          answer: 3,
          explain: ".2 是精度，对浮点表示小数点后保留两位，并做四舍五入：3.14159 的第三位小数是 1，舍去后得到 3.14，所以 D 对。A 错：这里第三位小数是 1，进位不到 5。B 是完全没有精度限制时 %f 的默认输出（默认 6 位小数，其实是 3.141590）。C 错：精度不会把结果变成整数（那需要转换或 %d）。另外注意 %.2f 连 3.5 也会输出成 3.50，末尾的 0 不会被省掉。"
        },
        {
          q: "想在输出里显示一个百分号（例如 `100%`），格式串应该怎么写？",
          options: [
            "直接写一个 %，如 printf(\"100% done\")",
            "连写两个 %%，如 printf(\"100%% done\")",
            "写 \\%，如 printf(\"100\\% done\")",
            "写 &%，如 printf(\"100&% done\")"
          ],
          answer: 1,
          explain: "格式串里的 % 是格式说明符的开始，要显示字面上的百分号必须写成 %%，所以 B 对。A 错：% 后面的字符会被当成格式符去解释（这里是空格加 d，输出完全不是你要的，编译器还会警告）。C 错：C 的字符串转义里没有 \\% 这种写法，反斜杠后面跟 % 不是合法的转义序列。D 错：& 会原样输出，得到 100&%。同样道理的还有 \\t、\\\\ 和 \\\"。"
        }
      ],
      passRatio: 0.8,
      mission: "写一个完整的 C 程序，用固定数据输出一张对齐的小票（不要读输入），一共 5 行（下面用 · 表示空格，仅仅是为了看清对齐）：\n"
        + "Item·········Price\n"
        + "Apple·········3.50\n"
        + "Banana·······12.00\n"
        + "Total········15.50\n"
        + "Note:（制表符）100% fresh\n"
        + "要求：\n"
        + "1) 第 1 行表头写成 printf(\"%-8s%10s\\n\", \"Item\", \"Price\");：名称列左对齐占 8 个字符，价格列右对齐占 10 个字符；\n"
        + "2) 第 2、3 行：名称 \"Apple\" 与 \"Banana\" 用 %-8s，价格 3.5 与 12.0 用 %10.2f；\n"
        + "3) 第 4 行：名称 \"Total\"，价格必须写成表达式 3.5 + 12.0（不要直接写 15.50），同样用 %10.2f；\n"
        + "4) 第 5 行用制表符和百分号转义：printf(\"Note:\\t100%% fresh\\n\");（\\t 是制表符，%% 才输出一个百分号）；\n"
        + "5) 最后 return 0;。",
      starter: "#include <stdio.h>\n\n"
        + "int main(void) {\n"
        + "    /* 第 1 行表头：%-8s 左对齐的名称列 + %10s 右对齐的价格标题 */\n\n"
        + "    /* 第 2、3 行：%-8s + %10.2f，写 Apple/3.5 和 Banana/12.0 */\n\n"
        + "    /* 第 4 行：Total，价格写成 3.5 + 12.0 */\n\n"
        + "    /* 第 5 行：Note: + \\t + 100%% fresh */\n\n"
        + "    return 0;\n"
        + "}",
      hint: "五行就是五次 printf，格式串分别是 \"%-8s%10s\\n\"、两个 \"%-8s%10.2f\\n\"、再来一个 \"%-8s%10.2f\\n\"，最后是 \"Note:\\t100%% fresh\\n\"。写完在本机跑一遍，看看两列是不是对齐了——如果价格列没对齐，先检查宽度数字有没有写错。",
      check: {
        include: ["stdio.h"],
        return0: true,
        seq: [["3.5", "+", "12.0"]],
        calls: [["printf", "%-8s"], ["printf", "%10.2f"], ["printf", "Note:"]],
        callCounts: [["printf", 5, 8]],
        minStatements: 6,
        message: "需要 #include <stdio.h>、五次 printf（表头用 %-8s 与 %10s，两行商品和 Total 行用 %-8s 与 %10.2f，最后一行的格式串以 Note: 开头并用 %% 输出百分号）、Total 行的价格写成 3.5 + 12.0，以及 return 0;。",
        ok: "宽度、精度、对齐和转义都用对了，输出应该能排成一张整齐的小票。"
      },
      expectedOutput: "Item         Price\nApple         3.50\nBanana       12.00\nTotal        15.50\nNote:\t100% fresh",
      solution: "#include <stdio.h>\n\n"
        + "int main(void) {\n"
        + "    printf(\"%-8s%10s\\n\", \"Item\", \"Price\");\n"
        + "    printf(\"%-8s%10.2f\\n\", \"Apple\", 3.5);\n"
        + "    printf(\"%-8s%10.2f\\n\", \"Banana\", 12.0);\n"
        + "    printf(\"%-8s%10.2f\\n\", \"Total\", 3.5 + 12.0);\n"
        + "    printf(\"Note:\\t100%% fresh\\n\");\n"
        + "    return 0;\n"
        + "}",
      mastery: [
        "能用宽度和精度写出对齐的表格、金额和编号输出",
        "能说清 %5d、%-5d、%05d、%.2f、%.3s 各自的含义",
        "能正确使用 \\n、\\t、\\\\、\\\" 和 %% 这些转义"
      ]
    },
    {
      id: 8,
      title: "起步综合：英寸换算小工具",
      minutes: 20,
      gist: "把变量、输入、运算和格式化输出串起来，做一个能读数据、会计算、排版整齐的小工具。",
      lesson: "这一关把模块 0 学的东西连成一条线。任何一个「小工具」都是同一个骨架：先把数据读进来（变量 + scanf），再用表达式算出结果，最后用 printf 把结果排好版输出。\n"
        + "第一步是读入。要读一个浮点数就用 double 保存，scanf 里配 %lf，并且一定要加取地址符 &。变量声明时就初始化，这样即使读入失败，程序也不会拿垃圾值去算。\n"
        + "第二步是计算。单位换算的关键是「把结果算出来」而不是「把结果抄下来」：cm 要用 inch * 2.54 得到，feet 要用 inch / 12.0 得到。这样换一个输入值，程序给出的所有结果都会同步更新——这正是写程序而不是用计算器的意义。换算系数最好用有名字的常量写清楚，读代码的人一眼就知道 2.54 是什么。\n"
        + "第三步是输出。让一组数据排成整齐的一列，靠的是固定的格式串：标签列用 %-6s 左对齐，数值列用 %8.2f 右对齐并保留两位小数。同一套格式串重复用在每一行上，列自然就对得齐。\n"
        + "工程习惯上还可以再加一步：检查 scanf 的返回值。scanf 返回成功读入的项数，读一个 double 时如果返回值不是 1，说明输入有问题，这时报一句提示比默默算出错误结果要好得多。\n"
        + "最后，写完程序要会自检：先在本机编译运行，用几个不同的输入试一试（例如 15.5、1、100），看看结果合不合理，再和本关给出的预期输出逐行比对。能自己发现偏差，才算是真正掌握了这一关。",
      example: {
        code: "#include <stdio.h>\n\n"
          + "int main(void) {\n"
          + "    double celsius = 0.0;\n\n"
          + "    scanf(\"%lf\", &celsius);\n"
          + "    printf(\"%-8s = %7.2f\\n\", \"C\", celsius);\n"
          + "    printf(\"%-8s = %7.2f\\n\", \"F\", celsius * 9.0 / 5.0 + 32.0);\n"
          + "    return 0;\n"
          + "}",
        output: "C        =   25.00\nF        =   77.00",
        explain: "这是一个「摄氏转华氏」的小工具，结构和本关任务完全一样：读入、计算、格式化输出。"
          + "第 4 行声明 double 并初始化，第 6 行用 %lf 配合 &celsius 读入一个浮点数——运行后输入 25，后面的输出就是这次运行的真实结果。"
          + "第 7、8 行用同一套格式串打印两行：%-8s 让标签左对齐占 8 个字符，%7.2f 让数值右对齐占 7 个字符并保留两位小数，所以两行的等号能对齐。"
          + "第 8 行的华氏温度是现场算出来的：celsius * 9.0 / 5.0 + 32.0。注意 9.0 和 5.0 写成浮点，避免整数除法把结果截断——如果写成 9 / 5，公式会变成 celsius * 1 + 32，结果就错了。"
          + "试着把输入换成 0 或 100，看看输出怎么变；这就是「数据驱动」的程序。",
        input: "25"
      },
      pitfalls: [
        "把换算结果写死：printf(\"%-6s = %8.2f\\n\", \"cm\", 39.37); 这类写法在换一个输入值以后立刻失效，一定要用表达式计算。",
        "读入 double 时用 %f 或漏掉 &：scanf 会把 4 个字节写进 8 字节的 double 空间，或者把变量值当地址使用，两种都是未定义行为。",
        "用 int 保存读入值和换算结果：输入 15.5 时 %d 只会读走 15，后续的 cm、mm 全部跟着失真。",
        "整数除法悄悄截断：公式里出现 9 / 5 或 1 / 12 这种两个整数相除的写法，结果会变成 1 和 0，整条换算就废了。",
        "每行各写一套格式串：宽度数字不一致时列就对不齐，最好复制同一套格式串，只改标签和数值。",
        "写完不试第二个输入：只用一个输入验证，很容易漏掉写死的数字或整数除法这类问题。"
      ],
      takeaways: [
        "小工具的骨架：读入 → 计算 → 输出，三段各司其职",
        "读 double 用 scanf(\"%lf\", &x)，输出用 %.2f",
        "换算要用表达式算出来，绝不把结果写死",
        "用同一套 %-6s + %8.2f 的格式串排版，标签左对齐、数值右对齐",
        "写完在本机多试几个输入，再和预期输出逐行比对"
      ],
      questions: [
        {
          q: "要从键盘读入一个整数到变量 n，正确的写法是？",
          options: [
            "int n; scanf(\"%d\", &n);",
            "int n; scanf(\"%d\", n);",
            "int n; scanf(\"%lf\", &n);",
            "int n; scanf(\"%f\", &n);"
          ],
          answer: 0,
          explain: "读 int 用 %d，并且必须把变量地址交给 scanf，所以 A 对。B 漏了 &，运行时会把 n 的值当地址去写，属于未定义行为。C 的 %lf 对应 double*，会被当成 8 字节的浮点数写入，把 n 周围的内存一起破坏。D 的 %f 对应 float*，同样与 int 不匹配。记住一条：格式符决定「怎么解释输入」，& 决定「写到哪里」，两者都不能错。"
        },
        {
          q: "要让 3.5 输出成 `··3.50`（宽度 6、保留两位小数、右对齐），格式串应该怎么写？",
          options: [
            "%-6.2f",
            "%2.6f",
            "%6.2f",
            "%.6f"
          ],
          answer: 2,
          explain: "%6.2f 表示总宽度 6、小数点后两位，默认右对齐，正好得到「两个空格 + 3.50」，C 对。A 的减号是左对齐，会输出 3.50 后跟两个空格。B 的宽度 2 小于实际长度（不起作用），精度 6 表示 6 位小数，输出 3.500000。D 只给了精度没给宽度，同样是 3.500000。宽度和精度是两回事：宽度管「占多少格」，精度管「小数点后几位」。"
        },
        {
          q: "已知 1 英寸 = 2.54 厘米，变量 inch 是 double，要算出厘米数应该写？",
          options: [
            "inch / 2.54",
            "inch + 2.54",
            "2.54 / inch",
            "inch * 2.54"
          ],
          answer: 3,
          explain: "1 英寸等于 2.54 厘米，所以英寸数乘以 2.54 就是厘米数，D 对。A 和 C 都是除法，得到的是「一厘米等于多少英寸」或者别的量，单位反了。B 是加法，量纲上根本不成立。换算题的通用方法是先写出「1 个单位等于多少目标单位」，然后乘以数量——这一关的 cm、mm、feet 三行都是同一个套路。"
        }
      ],
      passRatio: 0.8,
      mission: "做一个「英寸换算」小工具：读入一个浮点数 inch（英寸），然后按下面的格式输出 4 行（以输入 15.5 为例，下面用 · 表示空格，只是为了看清对齐）：\n"
        + "inch···=····15.50\n"
        + "cm·····=····39.37\n"
        + "feet···=·····1.29\n"
        + "mm·····=···393.70\n"
        + "要求：\n"
        + "1) 用 double inch = 0.0; 保存读入的值，用 scanf(\"%lf\", &inch); 读入（%lf 和 & 都不能少）；\n"
        + "2) 换算关系：1 inch = 2.54 cm，1 foot = 12 inch，1 inch = 25.4 mm；\n"
        + "3) 四行都用同一套格式串 printf(\"%-6s = %8.2f\\n\", 标签, 数值);：标签依次是 \"inch\"、\"cm\"、\"feet\"、\"mm\"，其中 inch 行输出读到的原始值，另外三行都要用表达式算出来（cm 写成 inch * 2.54，feet 写成 inch / 12.0，mm 写成 inch * 25.4），不要把结果写死；\n"
        + "4) 最后 return 0;。\n"
        + "写完在本机编译运行，输入 15.5，把看到的输出原样粘贴到下面的「运行结果比对」里。",
      starter: "#include <stdio.h>\n\n"
        + "int main(void) {\n"
        + "    double inch = 0.0;\n\n"
        + "    /* 用 scanf(\"%lf\", &inch); 读入一个浮点数 */\n\n"
        + "    /* 四行都用 printf(\"%-6s = %8.2f\\n\", 标签, 数值); */\n"
        + "    /* 标签依次是 \"inch\"、\"cm\"、\"feet\"、\"mm\"，后三行的数值要现场算 */\n\n"
        + "    return 0;\n"
        + "}",
      hint: "四行是同一个模板套四次：printf(\"%-6s = %8.2f\\n\", \"cm\", inch * 2.54);。第一行的数值直接写变量 inch；feet 用 inch / 12.0（写 12.0 而不是 12，虽然这里 inch 是 double 不会有问题，但养成「换算就写浮点」的习惯更稳）；mm 用 inch * 25.4。写完输入 15.5 跑一遍，cm 应该接近 39.37，feet 应该接近 1.29。",
      check: {
        include: ["stdio.h"],
        return0: true,
        seq: [["&", "inch"], ["2.54"], ["25.4"]],
        seqAny: [["inch", "/", "12"], ["inch", "/", "12.0"]],
        calls: [["scanf", "%lf"], ["printf", "%-6s"], ["printf", "%8.2f"]],
        minStatements: 6,
        message: "需要 #include <stdio.h>、用 %lf 和 &inch 读入、四行都使用 %-6s 与 %8.2f 的格式串、用到 2.54、25.4 和 inch / 12 这三个换算，以及 return 0;。",
        ok: "读入、换算表达式和对齐格式都正确，小工具的结构完整。"
      },
      expectedOutput: "inch   =    15.50\ncm     =    39.37\nfeet   =     1.29\nmm     =   393.70",
      solution: "#include <stdio.h>\n\n"
        + "int main(void) {\n"
        + "    double inch = 0.0;\n\n"
        + "    scanf(\"%lf\", &inch);\n\n"
        + "    printf(\"%-6s = %8.2f\\n\", \"inch\", inch);\n"
        + "    printf(\"%-6s = %8.2f\\n\", \"cm\", inch * 2.54);\n"
        + "    printf(\"%-6s = %8.2f\\n\", \"feet\", inch / 12.0);\n"
        + "    printf(\"%-6s = %8.2f\\n\", \"mm\", inch * 25.4);\n"
        + "    return 0;\n"
        + "}",
      input: "15.5",
      mastery: [
        "能独立完成「读入数值 → 换算 → 格式化输出」的完整小程序",
        "能设计一套对齐的格式串并在多行之间复用",
        "能通过多组输入和预期输出比对，定位自己程序里的偏差"
      ]
    }
  ]
});