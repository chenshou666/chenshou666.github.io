/* ============================================================================
 * HT Lab · C 语言课程 · 模块 4 · 指针与内存
 * 关卡 id：33–42（本文件由模块作者维护）
 * 每关的示例代码与标准答案都用 TDM-GCC 4.9.2 以 -std=c11 -Wall -Wextra
 * 真实编译运行通过，example.output / expectedOutput 为真实输出、零警告。
 * 本模块刻意不打印任何地址值：地址每次运行都可能不同，无法逐字比对；
 * 需要谈地址时只打印「是否相等」这类 0/1 结果。
 * ==========================================================================*/
window.C_MODULES = window.C_MODULES || [];
window.C_MODULES.push({
  id: "c4",
  name: "模块 4 · 指针与内存",
  levels: [
    {
      id: 33,
      title: "指针基础：地址、& 与 *",
      minutes: 18,
      gist: "看懂变量的地址，用 & 取地址、用 * 解引用，理解指针的类型为什么必须写清楚。",
      lesson: "指针是 C 的灵魂，也是最容易学歪的地方。先把第一件事说清楚：程序里的每个变量都住在内存的某个位置上，这个位置有一个编号，叫做地址。地址就是一串数字，像酒店的房间号——号码本身没有意义，有意义的是它指向的那个房间。\n"
        + "& 是取地址运算符。如果 n 是 int 变量，&n 就是「n 所在的地址」，它的类型写作 int *，读作「指向 int 的指针」。\n"
        + "指针变量就是专门用来存地址的变量：int *p = &n; 的意思是「p 的类型是 int *，初始值是 n 的地址」。p 里不存 42，它存的是 42 住在哪里。\n"
        + "有了地址，* 就能顺着地址找回去，这个动作叫解引用。*p 不是「p 的值」，而是「p 指向的那个变量」——它就是 n 本人。所以 *p 可以读，也可以写：*p = 7; 等于把 n 改成 7，方向刚好和 &n 相反。\n"
        + "注意同一个 * 出现在两种位置时含义不同：声明 int *p; 里的 * 是类型的一部分，表示 p 是指针；语句 *p = 7; 里的 * 是解引用运算符。读别人代码时先分清它在声明里还是在语句里。\n"
        + "指针的类型很关键：int * 解引用时按 int 读 4 个字节，char * 只读 1 个字节，而且 p + 1 前进多少也由类型决定（下一关细讲）。这就是指针不能只写「一个指针」、必须写清指向什么类型的原因。\n"
        + "两个必须马上养成的习惯。第一，指针声明时就给明确初值，暂时没有目标就写 int *p = NULL;（NULL 是「不指向任何地方」的空指针）。第二，绝不解引用未初始化的指针：它里面是随机地址，解引用属于未定义行为，可能悄悄改坏别的变量，也可能当场崩溃。\n"
        + "想看地址本身可以用 printf(\"%p\", (void *)p)，但操作系统会随机化内存布局，地址每次运行都可能不同，所以它只能用来观察，不能写进判断条件，也不能作为作业输出。\n"
        + "最后一句提醒：初学阶段能放心解引用的指针只有两种——你刚用 & 取过地址的，和后面用 malloc 申请到的。除此之外，先假设它不能碰。",
      example: {
        code: "#include <stdio.h>\n\n"
          + "int main(void) {\n"
          + "    int n = 42;\n"
          + "    int *p = &n;              /* p 保存 n 的地址 */\n\n"
          + "    printf(\"n = %d\\n\", n);\n"
          + "    printf(\"*p = %d\\n\", *p);  /* 解引用：*p 就是 n */\n\n"
          + "    *p = 7;                   /* 通过指针修改 n 本身 */\n"
          + "    printf(\"after *p = 7, n = %d\\n\", n);\n\n"
          + "    printf(\"p == &n ? %d\\n\", p == &n);\n"
          + "    printf(\"sizeof(int) = %d, sizeof(int *) = %d\\n\",\n"
          + "           (int)sizeof(int), (int)sizeof(int *));\n"
          + "    return 0;\n"
          + "}",
        output: "n = 42\n*p = 42\nafter *p = 7, n = 7\np == &n ? 1\nsizeof(int) = 4, sizeof(int *) = 8",
        explain: "第 4 行 int n = 42; 在栈上开出一块能放 int 的空间。第 5 行 int *p = &n; 是整段的核心：p 的类型是 int *，值是 n 的地址，& 把「n 这个变量」换成了「n 在哪里」。"
          + "第 7、8 行用 %d 分别打印 n 和 *p，输出一样，说明 *p 就是 n 本人，只是一个用变量名访问、一个用地址访问。"
          + "第 10 行 *p = 7; 走的是同一条路、方向相反：从指针写回变量，所以第 11 行打印的 n 变成了 7——这就是「指针能让函数改到外面变量」的原理。"
          + "第 13 行只输出 p == &n 的比较结果 1，没有输出地址本身：地址每次运行都可能变化，拿它做输出无法比对。"
          + "最后一行用 sizeof 对比：int 是 4 字节，指针在本机是 8 字节。指针的大小只和平台有关，和它指向什么类型无关。"
      },
      pitfalls: [
        "`int *p = n;` 少写一个 & → 编译器会给出「integer to pointer」的警告或错误；就算强行运行，p 里是 42 这个假地址，一解引用就崩。",
        "解引用未初始化的野指针：`int *p; *p = 1;` 属于未定义行为。它可能什么异常都没有，也可能立刻崩溃——「这次没崩」不代表代码是对的。",
        "用 %d 打印指针：`printf(\"%d\", p);` 类型不匹配；要观察地址必须写 `printf(\"%p\", (void *)p)`，而且地址每次运行都可能不同，不能用来比对结果。",
        "`int *a, b;` 里只有 a 是指针，b 是普通 int——星号只贴着 a。要声明两个指针必须写 `int *a, *b;`。",
        "把 `*p = &n;` 当成「让 p 指向 n」：多写了一个 *，这行的意思是把 n 的值改成「n 的地址」，类型不匹配，编译器直接报错。"
      ],
      takeaways: [
        "&n 取到的是 n 的地址，类型是 int *",
        "int *p = &n; 让 p 保存 n 的地址，*p 就是 n 本人",
        "*p 既可读也可写，写 *p = 7; 等于改 n",
        "指针声明时必须初始化，没有目标就写 NULL"
      ],
      questions: [
        {
          q: "已知 `int n = 5; int *p = &n;`，下面哪句话是对的？",
          options: [
            "p 里存的是 5",
            "p 里存的是 n 的地址，*p 就是 n",
            "&p 取到的是 n 的地址",
            "*p 里存的是 n 的地址"
          ],
          answer: 1,
          explain: "p 的类型是 int *，存的就是 n 的地址，而 *p 解引用后得到 n 本人（值是 5），所以 B 对。A 错在 p 里不是值而是地址；C 的 &p 取到的是指针变量 p 自己的地址；D 把 *p 说成地址，正好说反了：*p 是「顺着地址找到的变量」。"
        },
        {
          q: "关于 `*` 这个符号，说法正确的是？",
          options: [
            "它在声明和表达式里完全一样，都表示乘法",
            "声明里的 * 是解引用，表达式里的 * 表示指针类型",
            "`int *p;` 里的 * 说明 p 是指针类型；`*p` 里的 * 是解引用，取出 p 指向的变量",
            "表达式里的 * 是取地址运算符"
          ],
          answer: 2,
          explain: "同一个符号在两种语境下承担两件事：声明 `int *p;` 中它属于类型说明；表达式 `*p` 中它是解引用运算符。A 忽略了语境；B 把两者说反了；D 把 * 和 & 弄混了，取地址是 &。"
        },
        {
          q: "对一个从未初始化的指针 p 执行 `*p = 1;` 会发生什么？",
          options: [
            "p 里是随机地址，这属于未定义行为，可能崩溃也可能改坏别的数据",
            "编译器会自动为它分配一块内存，所以是安全的",
            "运行时会自动把 p 变成空指针并打印错误",
            "只是把 1 写到栈顶，不会有任何影响"
          ],
          answer: 0,
          explain: "局部变量不初始化时内容是不确定的，指针里就是随机地址，往那里写是未定义行为，A 对。B、C 描述的「自动保护」在 C 里根本不存在——编译器不会替你兜底；D 错在你并不知道这块内存属于谁，可能正好是别的变量甚至程序的关键数据。"
        }
      ],
      passRatio: 0.8,
      mission: "写一个完整程序：在 main 里声明 `int n = 5;` 和 `int *p = &n;`；先打印一行 `*p = 5`；再执行 `*p = 20;`，打印一行 `n = 20` 验证变量真的被改到了；最后打印 `sizeof(int) = 4` 和 `sizeof(int *) = 8`。"
        + "整段用 4 条 printf，每行一个结果；sizeof 的结果是 size_t 类型，先写成 `(int)sizeof(int)` 再配 %d，避免格式符不匹配。",
      starter: "#include <stdio.h>\n\n"
        + "int main(void) {\n"
        + "    int n = 5;\n"
        + "    /* TODO: 声明指针 p，让它指向 n */\n\n"
        + "    /* TODO: 打印 *p */\n\n"
        + "    /* TODO: 通过 *p 把 n 改成 20，再打印 n */\n\n"
        + "    /* TODO: 打印 sizeof(int) 与 sizeof(int *) */\n\n"
        + "    return 0;\n"
        + "}",
      hint: "先把三行写出来：int n = 5; int *p = &n; printf(\"*p = %d\\n\", *p);，编译运行确认打印 5，再往下加。改值那一步不要写 n = 20;，要用 *p = 20;，这样才能验证「通过地址改到了变量」。sizeof 是 size_t 类型，直接配 %d 可能在别的编译器上告警，统一写成 (int)sizeof(...) 最稳。",
      check: {
        include: ["stdio.h"],
        return0: true,
        seq: [
          ["int", "*", "p", "=", "&", "n"],
          ["*", "p", "=", "20"],
          ["sizeof", "(", "int", "*", ")"]
        ],
        calls: [["printf", "%d"]],
        callCounts: [["printf", 4, 4]],
        require: { pointer: true },
        minStatements: 6,
        message: "需要 #include <stdio.h>、int main(void)、`int *p = &n;`、`*p = 20;`、sizeof(int *) 这处写法，以及恰好 4 条 printf 和 return 0; 。",
        ok: "取地址、解引用、通过指针改值、sizeof 对比都写对了，结构完全符合本关要求。"
      },
      solution: "#include <stdio.h>\n\n"
        + "int main(void) {\n"
        + "    int n = 5;\n"
        + "    int *p = &n;\n\n"
        + "    printf(\"*p = %d\\n\", *p);\n\n"
        + "    *p = 20;\n"
        + "    printf(\"n = %d\\n\", n);\n\n"
        + "    printf(\"sizeof(int) = %d\\n\", (int)sizeof(int));\n"
        + "    printf(\"sizeof(int *) = %d\\n\", (int)sizeof(int *));\n"
        + "    return 0;\n"
        + "}",
      mastery: [
        "能独立写出「声明变量 → & 取地址 → * 读写」的最小程序",
        "能说清 &、* 与指针类型各自的作用，区分声明位置和表达式位置",
        "遇到指针相关崩溃时，第一步先检查指针有没有初始化"
      ]
    },
    {
      id: 34,
      title: "指针与数组：数组名、指针算术、*(p+i)",
      minutes: 20,
      gist: "搞清数组名到底是什么、p + 1 一次走多远，以及 p[i] 与 *(p + i) 为什么是同一件事。",
      lesson: "先记住一个事实：数组的元素在内存里是连续摆放的。a[0] 后面紧跟着 a[1]，中间没有空隙。正因为连续，「首元素的地址 + 偏移量」就能算出每个元素的位置，指针和数组才被绑在一起。\n"
        + "数组名在大多数表达式里会自动转换成「指向首元素的指针」，也就是 &a[0]。所以 int *p = a; 和 int *p = &a[0]; 完全等价，模块 3 里学过的「数组名退化成指针」到这里终于有了具体含义。\n"
        + "但数组名本身不是一个指针变量：它没有自己的存储空间可以改写，所以 a++ 和 a = p 都是编译错误。这一点和普通指针差别很大，也是很多人的第一个跟头。\n"
        + "指针算术的单位不是字节，而是「它指向的类型」。p + 1 表示「下一个元素」，对 int * 就前进 4 个字节，对 char * 才前进 1 个字节，对 double * 前进 8 个字节。写 p + 1 时你不需要知道 int 是几个字节，编译器替你算——这正是指针必须带类型的原因。\n"
        + "下标运算其实只是语法糖：C 标准规定 p[i] 就等于 *(p + i)。所以 a[i]、*(a + i)、p[i]、*(p + i) 四种写法效果完全一样（a 和 p 都指向首元素时）。反过来 a[i] 也能写成 i[a]，语法上合法，但没人这么写。\n"
        + "两个便利：&a[0] == a 的结果是 1；同一个数组内的两个指针相减，得到的是它们之间相差多少个元素（不是字节数）。\n"
        + "最后是边界。指针算术只在同一个数组内才有意义：p + i 算出来的地址，只有落在这个数组里才能解引用。越界访问（比如对 5 个元素的数组解引用 *(p + 5)）是未定义行为，它可能读到别的变量、也可能崩溃，而且往往在下一次 free 或几行之后才炸，非常难查。",
      example: {
        code: "#include <stdio.h>\n\n"
          + "int main(void) {\n"
          + "    int a[5] = {10, 20, 30, 40, 50};\n"
          + "    int *p = a;                     /* 等价于 &a[0] */\n\n"
          + "    printf(\"a[2] = %d, *(a + 2) = %d\\n\", a[2], *(a + 2));\n"
          + "    printf(\"p[3] = %d, *(p + 3) = %d\\n\", p[3], *(p + 3));\n"
          + "    printf(\"p + 1 advances %d bytes\\n\", (int)((char *)(p + 1) - (char *)p));\n\n"
          + "    p++;                            /* p 现在指向 a[1] */\n"
          + "    printf(\"after p++: *p = %d\\n\", *p);\n\n"
          + "    printf(\"&a[0] == a ? %d\\n\", &a[0] == a);\n"
          + "    printf(\"sizeof(a) = %d, sizeof(p) = %d\\n\", (int)sizeof(a), (int)sizeof(p));\n"
          + "    return 0;\n"
          + "}",
        output: "a[2] = 30, *(a + 2) = 30\np[3] = 40, *(p + 3) = 40\np + 1 advances 4 bytes\nafter p++: *p = 20\n&a[0] == a ? 1\nsizeof(a) = 20, sizeof(p) = 8",
        explain: "第 4 行定义数组，5 个 int 连续摆放，一共 20 字节。第 5 行让 p 指向首元素，此后 p[i] 和 a[i] 是同一个元素。"
          + "第 7、8 行故意把 a[2] 与 *(a + 2)、p[3] 与 *(p + 3) 成对打印，输出相同，说明下标写法就是指针写法的简写。"
          + "第 9 行用 (char *) 强转后再相减，得到的是「字节数」4——这就是 p + 1 的真实步长：指针算术以元素为单位，int * 的 1 步等于 4 字节。"
          + "第 11 行 p++ 让 p 前进一个元素，所以第 12 行 *p 是 20。注意这里改的是指针变量 p，数组 a 一个字节都没动。"
          + "第 14 行 &a[0] == a 为 1，直观证明「数组名就是首元素地址」。"
          + "最后一行是提醒：sizeof(a) 是整个数组的字节数 20，sizeof(p) 只是一个指针的大小 8，两者不能混。"
      },
      pitfalls: [
        "写 `a++` 或 `a = p;` → 数组名不是可修改的变量，编译器报 lvalue required as increment operand 之类的错误；要移动就移动指针 p。",
        "以为 `p + 1` 是「地址加 1 个字节」：对 int * 实际前进 4 字节。用错类型（例如把 int 数组的地址交给 char *）会让 p + 1 落在元素中间，读出毫无意义的值。",
        "在函数里用 `sizeof(a) / sizeof(a[0])` 求元素个数：形参已经退化成指针，sizeof 得到 8，算出来的个数是错的——个数必须另外作为参数传进去。",
        "越界：`*(p + 5)` 对 5 个元素的数组属于越界访问，读到的是相邻变量的内容，属于未定义行为，出错位置往往不在这一行。",
        "把 `p[i]` 当成「p 这个数组的第 i 个元素」：p 只是指向某个元素的指针，p[0] 就是 *p，p[-1] 也是合法写法（指向前一个元素），前提是它确实在同一个数组里。"
      ],
      takeaways: [
        "数组元素连续存放，数组名在表达式里退化为首元素指针",
        "数组名不是指针变量，不能自增、不能赋值",
        "p + 1 按「指向的类型」前进，int * 一次走 4 字节",
        "p[i] 与 *(p + i) 完全等价，a[i] 与 *(a + i) 也一样"
      ],
      questions: [
        {
          q: "`int a[5] = {10, 20, 30, 40, 50}; int *p = a;` 执行 `p = p + 1;` 之后，`*p` 是多少？",
          options: [
            "11，因为地址加 1 后再按字节读",
            "仍然是 10",
            "程序崩溃",
            "20"
          ],
          answer: 3,
          explain: "指针算术以元素为单位：p + 1 跳过一整个 int，指向 a[1]，所以 *p 是 20，D 对。A 把「地址加 1」和「值加 1」混为一谈；B 是完全没有自增的结果；C 说错了——a[1] 是合法元素，这里并没有越界。"
        },
        {
          q: "当 p 指向数组首元素时，与 `a[i]` 完全等价的是？",
          options: [
            "&a[i]",
            "a[0] + i",
            "*(a + i)",
            "*(a) + i"
          ],
          answer: 2,
          explain: "C 标准把下标定义为 p[i] 等价于 *(p + i)，所以 *(a + i) 就是 a[i]，C 对。A 取到的是地址而不是元素；B、D 都是「首元素的值再加上 i」，是算术运算，不是第 i 个元素。"
        },
        {
          q: "关于数组名 a，说法正确的是？",
          options: [
            "a 是一个指针变量，可以写 a++ 让它往后走",
            "在大多数表达式里 a 会转换成指向首元素的指针，但 a 本身不是变量，sizeof(a) 是整个数组的字节数",
            "a 和 &a[0] 的类型不同，值也不同",
            "sizeof(a) 等于 sizeof(int *)，所以两者可以互换使用"
          ],
          answer: 1,
          explain: "数组名在表达式中退化为首元素指针，但它没有可写的存储空间，所以不能自增、不能赋值，B 对。A 是典型误解；C 错在 &a[0] 与 a 的值相同（类型在这一点上兼容）；D 更是把 20 和 8 混为一谈——数组名只在 sizeof、& 这类少数场合才不退化。"
        }
      ],
      passRatio: 0.8,
      mission: "写一个程序：在 main 里声明 `int a[6] = {1, 2, 3, 4, 5, 6};` 和 `int *p = a;`。用 for 循环配合指针写法 `*(p + i)` 求和，打印 `sum = 21`；再用 `sizeof(a) / sizeof(a[0])` 算出元素个数，打印 `count = 6`。"
        + "求和那一行不许用 a[i]，要真的走指针这条线。",
      starter: "#include <stdio.h>\n\n"
        + "int main(void) {\n"
        + "    int a[6] = {1, 2, 3, 4, 5, 6};\n"
        + "    int *p = a;\n"
        + "    int i, sum = 0;\n\n"
        + "    /* TODO: 用 for 和 *(p + i) 累加 */\n\n"
        + "    printf(\"sum = %d\\n\", sum);\n"
        + "    /* TODO: 打印 count = sizeof(a) / sizeof(a[0]) */\n\n"
        + "    return 0;\n"
        + "}",
      hint: "循环体只需要一句：sum += *(p + i);。写完后可以顺手把 *(p + i) 改成 *(a + i) 跑一次，结果相同就说明两种写法同源。元素个数那一行注意先算除法再转 int，写成 (int)(sizeof(a) / sizeof(a[0]))，这样不会触发类型告警。",
      check: {
        include: ["stdio.h"],
        return0: true,
        seq: [
          ["int", "a", "[", "6", "]"],
          ["int", "*", "p", "=", "a"],
          ["*", "(", "p", "+", "i", ")"]
        ],
        calls: [["printf", "sum = %d"], ["printf", "count = %d"]],
        require: { for: true, pointer: true, array: true },
        minStatements: 7,
        message: "需要 int a[6] = {...}; 、int *p = a; 、循环里的 *(p + i) 写法，以及两行格式为 sum = %d 和 count = %d 的打印。",
        ok: "数组名退化、指针算术、元素个数计算都用对了，结构符合本关要求。"
      },
      solution: "#include <stdio.h>\n\n"
        + "int main(void) {\n"
        + "    int a[6] = {1, 2, 3, 4, 5, 6};\n"
        + "    int *p = a;\n"
        + "    int i, sum = 0;\n\n"
        + "    for (i = 0; i < 6; i++) {\n"
        + "        sum += *(p + i);\n"
        + "    }\n"
        + "    printf(\"sum = %d\\n\", sum);\n"
        + "    printf(\"count = %d\\n\", (int)(sizeof(a) / sizeof(a[0])));\n"
        + "    return 0;\n"
        + "}",
      mastery: [
        "能解释数组名在表达式里为什么等于 &a[0]，又为什么不能自增",
        "能手算 int * 与 char * 的 p + 1 各前进多少字节",
        "能在下标写法和指针写法之间自由转换",
        "能说清越界访问为什么危险"
      ]
    },
    {
      id: 35,
      title: "指针作为函数参数：让函数真正改到实参",
      minutes: 18,
      gist: "看懂 C 的按值传递，用指针参数写出正确的 swap，并明白 scanf 为什么需要 &。",
      lesson: "C 只有一种参数传递方式：按值传递。调用函数时，实参的值被复制一份交给形参，函数里操作的始终是这份副本。所以 void add(int x) { x++; } 无论调用多少次，外面的变量都不会变——这不是 bug，是语言的规定。\n"
        + "那怎么让函数改到外面的变量？把变量的地址传进去。形参用指针接收，函数里用 *p 顺着地址找到原来那个变量再改。void f(int *p) { *p = 10; } 配合 f(&n) 就能把 n 改成 10：传进去的是地址的副本，但地址指向的地方还是同一个。\n"
        + "交换两个数是经典例子。按值版本 void swap_by_value(int x, int y) 里交换的只是两个副本，函数一返回，main 里的 m、n 原封不动。正确版本 void swap(int *a, int *b) 交换的是 *a 和 *b，也就是交换 m、n 本人，调用必须写成 swap(&m, &n)。\n"
        + "回头看前面学 scanf 时那个神秘的 &：scanf(\"%d\", &n) 要求传地址，正是因为它要往变量里写入，必须知道变量在哪里。所有「函数要修改调用者的东西」的场合，走的都是这条指针通道。\n"
        + "指针参数还有一个常用法：一次带回多个结果。比如写 void min_max(int *a, int n, int *mn, int *mx)，就能同时把最小值和最大值写回调用者的两个变量——C 的函数只有一个返回值，需要多个结果时就传地址。\n"
        + "只读的参数记得加 const：void print(const char *s) 向读代码的人声明「我不会通过 s 改你的数据」，同时也让编译器帮你拦住手滑的赋值。这是 C 代码里最常见的约定之一。\n"
        + "最后有一个容易忽略的点：指针参数本身也是按值传递的。函数里写 a = &other; 改的只是形参这个副本，调用者的指针变量纹丝不动。要修改调用者的指针本身，必须传 &p，形参写成二级指针 int **——这就是下一关的主题。",
      example: {
        code: "#include <stdio.h>\n\n"
          + "void swap_by_value(int x, int y) {\n"
          + "    int t = x;\n"
          + "    x = y;\n"
          + "    y = t;\n"
          + "    printf(\"inside swap_by_value: x = %d, y = %d\\n\", x, y);\n"
          + "}\n\n"
          + "void swap(int *a, int *b) {\n"
          + "    int t = *a;\n"
          + "    *a = *b;\n"
          + "    *b = t;\n"
          + "}\n\n"
          + "int main(void) {\n"
          + "    int m = 3, n = 8;\n\n"
          + "    swap_by_value(m, n);\n"
          + "    printf(\"after swap_by_value: m = %d, n = %d\\n\", m, n);\n\n"
          + "    swap(&m, &n);\n"
          + "    printf(\"after swap: m = %d, n = %d\\n\", m, n);\n"
          + "    return 0;\n"
          + "}",
        output: "inside swap_by_value: x = 8, y = 3\nafter swap_by_value: m = 3, n = 8\nafter swap: m = 8, n = 3",
        explain: "两个函数的差别只有参数类型。swap_by_value 的 x、y 是 m、n 的副本：里面确实换成功了（第 7 行打印 8 和 3），但函数返回后副本销毁，第 20 行打印的 m、n 还是 3 和 8——这就是按值传递。"
          + "swap 的参数 a、b 是「m、n 的地址」的副本。第 11 行 int t = *a; 把 m 的值取出来存好，第 12、13 行通过两个地址直接改写了 m 和 n 本人，所以第 23 行打印出 8 和 3。"
          + "注意调用形式的区别：按值版本传 swap_by_value(m, n)，指针版本必须传地址 swap(&m, &n)。漏掉 & 编译器会给出指针与整数不匹配的警告。"
          + "另外别把「*a = *b」写成「a = b」：后者只是让形参指针改指向，与交换数值毫无关系。"
      },
      pitfalls: [
        "写了正确的 `void swap(int *a, int *b)`，调用时却写成 `swap(m, n);` → 编译器给出「making pointer from integer」的警告或错误，运行时直接崩。",
        "在函数里交换指针本身：`t = a; a = b; b = t;` 只换了两个形参副本的指向，调用者的变量一点没动——必须交换 `*a` 和 `*b`。",
        "以为「数组能被函数修改」是特例：其实是数组名退化成首元素地址，传进去的是地址的副本，指向的仍是原数组，所以能改到。",
        "漏掉解引用的 *：`int t = a;` 想取 a 指向的值，实际拿到的是地址，类型不匹配；反过来 `*a = &m;` 是把地址写进 int 变量，同样报错。",
        "想通过 `void f(int *p)` 把调用者的指针改成指向别处：形参 p 是副本，改它没用，必须传 `&p` 并用 `int **` 接收。"
      ],
      takeaways: [
        "C 只有按值传递，形参永远是实参的副本",
        "要改调用者的变量，就传地址 &x，形参用指针接收，函数里写 *p",
        "swap(&m, &n) 交换的是 m 和 n 本人；swap_by_value(m, n) 什么也换不了",
        "scanf 需要 &，就是因为它要往变量里写入"
      ],
      questions: [
        {
          q: "C 语言里函数参数是怎么传递的？",
          options: [
            "按值传递：形参是实参的副本，改形参不影响实参",
            "按引用传递：形参就是实参本身",
            "基本类型按值传递，数组按引用传递",
            "由函数的返回类型决定"
          ],
          answer: 0,
          explain: "C 的参数一律按值传递，形参是实参的副本，A 对。B 是 C++ 的引用语法，在 C 里并不存在；C 看起来「数组能改」是因为数组名退化成地址，传进去的仍是地址的副本，指向的原数组没变；D 与传递方式毫无关系。"
        },
        {
          q: "要让 `void f(...)` 真正把 main 里的 int 变量 x 改成 10，应该怎么写？",
          options: [
            "定义 void f(int x)，函数里写 x = 10;，调用 f(x)",
            "定义 void f(int *p)，函数里写 *p = 10;，调用 f(&x)",
            "定义 void f(int x)，函数里写 *x = 10;，调用 f(x)",
            "把 x 声明成 const int，再传给 f"
          ],
          answer: 1,
          explain: "只有把地址传进去，函数里才能顺着地址改到原变量，B 对。A 改的是副本；C 对 int 变量用 * 解引用本身就是类型错误；D 加上 const 反而更不允许修改。"
        },
        {
          q: "为什么 `scanf(\"%d\", &n)` 必须写 &？",
          options: [
            "scanf 要求参数写成变量名的形式",
            "& 是 C 的引用传递语法，表示这个参数可以被修改",
            "不写 & 只是少一个警告，运行时其实没关系",
            "scanf 要往变量里写入，必须知道变量的地址；指针参数就是函数改动实参的唯一手段，C 里没有引用传递"
          ],
          answer: 3,
          explain: "scanf 要做的是「把读到的数写进 n」，所以它需要 n 的地址，D 对。C 语言没有引用传递，& 只是取地址运算符，B 说错了；A 是把语法和需求搞混；C 更是危险的误解——漏写 & 会把随机的整数当地址用，属于未定义行为。"
        }
      ],
      passRatio: 0.8,
      mission: "定义函数 `void swap(int *a, int *b)`：用三个语句交换 *a 与 *b（注意不是交换指针本身）。在 main 里声明 `int x = 1, y = 2;`，先打印 `before: x = 1, y = 2`，再调用 `swap(&x, &y);`，最后打印 `after: x = 2, y = 1`。"
        + "两行的格式必须分别是 `before: x = %d, y = %d` 和 `after: x = %d, y = %d`。",
      starter: "#include <stdio.h>\n\n"
        + "void swap(int *a, int *b) {\n"
        + "    /* TODO: 用 *a、*b 完成交换 */\n"
        + "}\n\n"
        + "int main(void) {\n"
        + "    int x = 1, y = 2;\n\n"
        + "    printf(\"before: x = %d, y = %d\\n\", x, y);\n"
        + "    /* TODO: 调用 swap，注意传地址 */\n"
        + "    printf(\"after: x = %d, y = %d\\n\", x, y);\n"
        + "    return 0;\n"
        + "}",
      hint: "函数体里先写 int t = *a;，然后 *a = *b;，最后 *b = t;——三步都带着 *，因为要动的是它们指向的变量。调用处写成 swap(&x, &y);，两个实参都要取地址；写 swap(x, y) 会得到类型不匹配的报错。",
      check: {
        include: ["stdio.h"],
        return0: true,
        seq: [["swap", "(", "&", "x", ",", "&", "y", ")"]],
        calls: [["printf", "before: x = %d, y = %d"], ["printf", "after: x = %d, y = %d"]],
        require: { funcs: ["swap"], pointer: true },
        minStatements: 6,
        message: "需要自己定义 void swap(int *a, int *b)、在 main 里用 swap(&x, &y) 传地址调用，以及两行指定格式的打印。",
        ok: "指针参数、取地址调用、两行打印都写对了，函数确实能改到实参。"
      },
      expectedOutput: "before: x = 1, y = 2\nafter: x = 2, y = 1",
      solution: "#include <stdio.h>\n\n"
        + "void swap(int *a, int *b) {\n"
        + "    int t = *a;\n"
        + "    *a = *b;\n"
        + "    *b = t;\n"
        + "}\n\n"
        + "int main(void) {\n"
        + "    int x = 1, y = 2;\n\n"
        + "    printf(\"before: x = %d, y = %d\\n\", x, y);\n"
        + "    swap(&x, &y);\n"
        + "    printf(\"after: x = %d, y = %d\\n\", x, y);\n"
        + "    return 0;\n"
        + "}",
      mastery: [
        "能说清按值传递与传地址的区别，并解释 swap 为什么必须收指针",
        "能自己写出带指针参数的函数，正确使用 & 与 *",
        "能解释 scanf 的 & 从何而来，并推广到「一次返回多个结果」的写法"
      ]
    },
    {
      id: 36,
      title: "字符串与指针：char[]、char * 与 const char *",
      minutes: 20,
      gist: "分清字符数组和字符指针：一个能改、一个指向只读字面量，并用 const 把「不改」写进类型。",
      lesson: "C 没有独立的字符串类型。所谓字符串，就是一段以 '\\0'（空字符）结尾的 char 数组。printf(\"%s\") 从你给的地址开始一个字节一个字节地打印，直到遇见 '\\0' 才停——所以结尾那个 '\\0' 不是可选项，它是字符串的句号。\n"
        + "char buf[] = \"hello\"; 是数组定义：编译器算出需要 6 个字节（5 个字母加 '\\0'），把字面量复制一份放进 buf。buf 是你可以随意改的普通数组，sizeof(buf) 是 6。\n"
        + "const char *lit = \"hello\"; 是另一种东西：lit 是一个指针，指向程序里那份字符串字面量。字面量存放在只读区域，标准明确规定修改它属于未定义行为——所以这里写 const，既是给自己立规矩，也是让编译器帮你拦住手滑。\n"
        + "两者的类型和用途完全不同：buf 是 char [6]，sizeof 是 6；lit 是 const char *，sizeof 是指针大小 8。它们都能配 %s 使用，也都能用下标访问，但只有 buf 能被写。\n"
        + "遍历字符串的标准写法是用指针一路走：const char *p = s; while (*p != '\\0') { ...; p++; }。每轮读一个字符再前进一格，直到读到 '\\0'。也可以写成 while (*p)，因为 '\\0' 的值就是 0，直接当条件用；初学阶段建议把 != '\\0' 写全，读起来更清楚。\n"
        + "函数参数一般写成 const char *s：表示「我只读不改」。这样传 char 数组和传字符串字面量都合法，而且函数里如果手滑写 s[0] = 'X'，编译器会直接报错。要写才不加 const。\n"
        + "最后三个高频错误：把字面量赋给 char * 后去改它（char *s = \"hi\"; s[0] = 'H'; 能编译，运行时可能直接崩溃）；想给数组整体赋值（buf = \"hi\"; 数组名不是变量，报错，要逐字符复制或 strcpy）；以及 printf(\"%s\") 一个没有 '\\0' 结尾的字符数组（会一直往后读，输出乱码甚至崩溃）。",
      example: {
        code: "#include <stdio.h>\n\n"
          + "int main(void) {\n"
          + "    char buf[] = \"hello\";        /* 数组：把字面量复制了一份，可以改 */\n"
          + "    const char *lit = \"hello\";   /* 指针：指向不可修改的字符串字面量 */\n"
          + "    const char *p = lit;\n"
          + "    int len = 0;\n\n"
          + "    buf[0] = 'H';                /* 合法：改的是数组里的副本 */\n"
          + "    printf(\"buf = %s\\n\", buf);\n"
          + "    printf(\"lit = %s\\n\", lit);\n\n"
          + "    while (*p != '\\0') {         /* 一直走到字符串结尾 */\n"
          + "        len++;\n"
          + "        p++;\n"
          + "    }\n"
          + "    printf(\"lit length = %d\\n\", len);\n\n"
          + "    printf(\"sizeof(buf) = %d, sizeof(lit) = %d\\n\",\n"
          + "           (int)sizeof(buf), (int)sizeof(lit));\n"
          + "    return 0;\n"
          + "}",
        output: "buf = Hello\nlit = hello\nlit length = 5\nsizeof(buf) = 6, sizeof(lit) = 8",
        explain: "第 4 行 char buf[] = \"hello\"; 得到的是一个 6 字节的数组，第 5 行 const char *lit 只得到 8 字节的指针，两者 sizeof 的差别正好说明「数组带着数据、指针只带地址」。"
          + "第 9 行 buf[0] = 'H'; 完全合法，因为改的是数组里那份副本，所以第 10 行打印 Hello，而第 11 行 lit 打印出来还是 hello——字面量一个字节都没动。"
          + "第 13 到 16 行是遍历字符串的标准姿势：p 从字符串开头出发，每轮判断 *p 是不是 '\\0'，不是就计数并前进一格。循环结束时 p 停在结尾的空字符上，len 正好是 5。注意这里 p 是 const char *：能改 p 自己的指向，不能改 *p 的内容。"
          + "最后一行提醒 sizeof 的陷阱：sizeof(buf) 是数组总长度 6（含 '\\0'），sizeof(lit) 只是指针大小 8，跟字符串多长毫无关系。想要长度就用刚才的循环，或者 strlen。"
      },
      pitfalls: [
        "`char *s = \"hi\"; s[0] = 'H';` → 能通过编译，但字符串字面量不可修改，属于未定义行为，本机常见现象是运行时崩溃。",
        "`char buf[10]; buf = \"hi\";` → 报 assignment to expression with array type：数组名不能整体赋值，要逐个字符复制或用 strcpy。",
        "`char *s; strcpy(s, \"hi\");` → s 是野指针，没有任何可写空间；要么用数组，要么先 malloc 足够大的空间。",
        "用 %s 打印一个没有 '\\0' 结尾的 char 数组 → printf 会越过数组继续读内存，输出乱码甚至崩溃；手工填字符时别忘了最后补 buf[n] = '\\0';。",
        "用 sizeof 求字符串长度 → sizeof(buf) 得到的是数组总字节数（含 '\\0'），sizeof(指针) 得到 8；求长度要用循环数或 strlen。"
      ],
      takeaways: [
        "字符串是以 '\\0' 结尾的 char 数组，没有专门的字符串类型",
        "char buf[] = \"...\" 复制了一份、可修改；char *s = \"...\" 指向只读字面量、不可修改",
        "const char * 表示「只读不改」，是最常用的字符串参数写法",
        "遍历字符串：while (*p != '\\0') { ...; p++; }"
      ],
      questions: [
        {
          q: "`char *s = \"hi\"; s[0] = 'H';` 会怎样？",
          options: [
            "s 指向的内容变成 Hi，程序正常输出 Hi",
            "编译一定失败，报错说字面量不能修改",
            "能通过编译，但这是未定义行为：字符串字面量不可修改，本机常见结果是运行时崩溃",
            "只改动了指针 s 自己，字面量不受影响"
          ],
          answer: 2,
          explain: "字面量存在只读区域，标准规定修改它属于未定义行为，而编译器通常不会拦你（在 C 里字面量类型是 char[]），所以要靠 const 自觉，C 对。A 把「能编译」当成了「能这么干」；B 说反了——多数编译器不会报错，这正是它危险的地方；D 混淆了 s[0] 与 s 本身。"
        },
        {
          q: "`char buf[] = \"hello\";` 中 sizeof(buf) 是多少？",
          options: [
            "6，5 个字母加上结尾的 '\\0'",
            "5，就是字母个数",
            "8，指针的大小",
            "不确定，由编译器决定"
          ],
          answer: 0,
          explain: "字符串字面量总带一个结尾的空字符，复制进数组后共 6 字节，A 对。B 漏掉了 '\\0'；C 是把指针的大小套到数组上（8 只有 char * 才是）；D 说错了——char buf[] 有明确类型 char[6]，sizeof 在编译期就能算出确定的值。"
        },
        {
          q: "函数参数写成 `const char *s`，含义是？",
          options: [
            "把传进来的字符串复制一份给函数，函数里改不到外面",
            "函数承诺不通过 s 修改内容；传 char 数组和字符串字面量都可以",
            "s 本身不能改变，函数里连 s++ 都不允许",
            "只接受字符串字面量，不接受 char 数组"
          ],
          answer: 1,
          explain: "const 修饰的是 s 指向的内容，不是 s 自己，所以既能接收数组也能接收字面量，B 对。A 描述的是按值传递整份数据，并非 const 的含义；C 说反了——const char *s 里 s 可以自增，写成 const char * const s 才禁止改 s；D 没有这个限制。"
        }
      ],
      passRatio: 0.8,
      mission: "自己写一个 `int my_strlen(const char *s)`：用指针从 s 出发，一直走到 '\\0'，返回字符个数（不许用 strlen）。在 main 里声明 `char buf[] = \"hello\";`，分别对 buf 和字符串字面量 `\"pointer\"` 调用 my_strlen，打印出 `buf length = 5` 和 `literal length = 7` 两行。",
      starter: "#include <stdio.h>\n\n"
        + "int my_strlen(const char *s) {\n"
        + "    int len = 0;\n"
        + "    /* TODO: while 循环，走到 '\\0' 为止 */\n"
        + "    return len;\n"
        + "}\n\n"
        + "int main(void) {\n"
        + "    char buf[] = \"hello\";\n\n"
        + "    /* TODO: 分别对 buf 和 \"pointer\" 调用 my_strlen 并打印 */\n\n"
        + "    return 0;\n"
        + "}",
      hint: "循环条件写 *s != '\\0'：只要当前字符不是结尾空字符，就 len++ 并让 s++。注意 s 是 const char *，自增改的是指针本身，完全允许；不能写 *s = ... 去改字符。求长度不要用 sizeof，那只对数组本身有效。",
      check: {
        include: ["stdio.h"],
        return0: true,
        calls: [["printf", "buf length = %d"], ["printf", "literal length = %d"], ["my_strlen"]],
        forbid: ["strlen"],
        require: { funcs: ["my_strlen"], pointer: true, loop: true },
        minStatements: 6,
        message: "需要自己定义 my_strlen(const char *s)（不能用 strlen）、在 main 里对 buf 与字面量各调用一次，并打印指定格式的两行。",
        ok: "字符数组、只读字面量与指针遍历都用对了，长度是自己数出来的。"
      },
      expectedOutput: "buf length = 5\nliteral length = 7",
      solution: "#include <stdio.h>\n\n"
        + "int my_strlen(const char *s) {\n"
        + "    int len = 0;\n"
        + "    while (*s != '\\0') {\n"
        + "        len++;\n"
        + "        s++;\n"
        + "    }\n"
        + "    return len;\n"
        + "}\n\n"
        + "int main(void) {\n"
        + "    char buf[] = \"hello\";\n\n"
        + "    printf(\"buf length = %d\\n\", my_strlen(buf));\n"
        + "    printf(\"literal length = %d\\n\", my_strlen(\"pointer\"));\n"
        + "    return 0;\n"
        + "}",
      mastery: [
        "能说清 char[] 与 char * 在存储、可修改性、sizeof 上的三点区别",
        "能用指针手写字符串遍历，而不是依赖 strlen",
        "看到字符串相关崩溃时，能先想到「是不是改了字面量」或「是不是少了 '\\0'」"
      ]
    },
    {
      id: 37,
      title: "二级指针与指针数组：char *argv[] 的模型",
      minutes: 20,
      gist: "搞清「指针的指针」，看懂 char *argv[] 这类声明，并知道什么时候必须用二级指针。",
      lesson: "先把两个容易混的声明分开。char *words[3]; 是「指针数组」：它是一个真正的数组，有 3 个元素，每个元素都是一个 char *。数组名 words 在表达式里退化成指向首元素的指针，而首元素本身就是 char *，所以退化的结果是 char **——指向「指针」的指针，这就是二级指针。\n"
        + "再看 int **pp;：它存的不是 int 的地址，而是「一个 int * 变量的地址」。对 pp 做一次解引用得到一级指针（*pp 是一个 int *），做两次解引用才拿到最终的 int（**pp 是那个 int）。每多一层 *，就多剥一层。\n"
        + "分清两件常被写混的事。执行 *pp = &y; 改的是「被指向的那个指针」，也就是让一级指针改指向 y；执行 **pp = 100; 改的是最终的那个变量，也就是把 x 改成 100。少了或多了星号，程序的行为完全不同：前者动指针，后者动数据。\n"
        + "那什么时候必须用二级指针？当函数要修改调用者的「指针本身」时。回想上一关的结论：指针参数也是按值传递的，函数里写 p = NULL; 只改了副本。要让函数真的把调用者的 p 改成新地址（典型场景是函数内部 malloc 再把地址带回去），就得把 &p 传进去，形参写成 int **p，函数里写 *p = malloc(...)。\n"
        + "命令行的 main 参数就是现成的例子：int main(int argc, char *argv[]) 里，argv 是「字符串指针的数组」，argv[0] 是程序名，argv[i] 是第 i 个参数；它等价于 char **argv。你有两个参数时，argv 元素各自指向一串字符——正好是「指针数组」这个模型。\n"
        + "最后提一句外形相似、含义完全不同的两个声明：char *a[3] 是 3 个 char *（sizeof 是 24，本机）；char (*a)[3] 是「指向 3 个 char 的数组的指针」（sizeof 是 8）。区别只在那对括号，读的时候从里往外读：先看 a 和谁结合。",
      example: {
        code: "#include <stdio.h>\n\n"
          + "int main(void) {\n"
          + "    char *words[3] = {\"Ann\", \"Bob\", \"Cid\"};   /* 指针数组：3 个 char * */\n"
          + "    char **p = words;                           /* 指向「指针」的指针 */\n"
          + "    int i;\n"
          + "    int x = 1, y = 2;\n"
          + "    int *px = &x;\n"
          + "    int **pp = &px;\n\n"
          + "    for (i = 0; i < 3; i++) {\n"
          + "        printf(\"[%s]\", *(p + i));\n"
          + "    }\n"
          + "    printf(\"\\n\");\n\n"
          + "    **pp = 100;                 /* 两次解引用：改的是 x */\n"
          + "    printf(\"x = %d, *px = %d\\n\", x, *px);\n\n"
          + "    *pp = &y;                   /* 一次解引用：改的是 px 自己 */\n"
          + "    printf(\"x = %d, y = %d, *px = %d\\n\", x, y, *px);\n\n"
          + "    printf(\"sizeof(words) = %d, sizeof(p) = %d\\n\",\n"
          + "           (int)sizeof(words), (int)sizeof(p));\n"
          + "    return 0;\n"
          + "}",
        output: "[Ann][Bob][Cid]\nx = 100, *px = 100\nx = 100, y = 2, *px = 2\nsizeof(words) = 24, sizeof(p) = 8",
        explain: "第 4 行的 words 是一个装着 3 个 char * 的数组，每个元素指向一个字符串字面量；第 5 行的 p 是 char **，它指向 words 的第一个元素。"
          + "第 11 到 13 行用 *(p + i) 依次取出「第 i 个指针」，再交给 %s 打印。注意这里多了一层：p + i 得到的是 char **，解引用一次才得到 char *。"
          + "第 16 行 **pp = 100; 连剥两层：pp → px → x，所以改的是 x，第 17 行打印出 x = 100，*px 也是 100。"
          + "第 19 行 *pp = &y; 只剥一层：改的是 px 这个指针本身，让它改指向 y。x 仍然是 100，y 还是 2，而 *px 跟着 px 变成了 2——这行没有动任何数据。"
          + "最后一行对比 sizeof：words 是数组，占 3 × 8 = 24 字节；p 只是一个指针，8 字节。"
      },
      pitfalls: [
        "把 `char *words[3]` 当成「能装 3 个字符的数组」：它是 3 个指针，sizeof 是 24；要装字符得写 char words[3]。",
        "用 `char **p` 去接二维字符数组 `char a[3][8]`：a 退化后是 char (*)[8]，类型不匹配，编译器会给出 incompatible pointer type 的警告，运行结果也不对。",
        "`*pp = 100;` 想让 x 变成 100：少了一层解引用，等于把地址设成 100，编译器会报整数与指针不匹配的错误；要改数据必须写 **pp = 100;。",
        "在函数里用 `void f(int *p)` 改调用者的指针本身：形参 p 是副本，函数里 p = malloc(...) 改不到外面，调用者的指针仍然是原来的值（还容易造成内存泄漏）——必须传 &p 并用 int ** 接收。",
        "以为指针数组的元素一定有内容：数组里的指针可以指向任何东西，也可以是 NULL，用之前要确保它指向有效数据。"
      ],
      takeaways: [
        "char *words[3] 是指针数组（3 个 char *），退化成 char **",
        "int **pp 存的是「指针的地址」；*pp 是一级指针，**pp 是最终的数据",
        "*pp = &y; 改指针的指向；**pp = 100; 改指向的数据",
        "函数要修改调用者的指针本身，必须传 &p、形参用二级指针"
      ],
      questions: [
        {
          q: "`char *words[3];` 声明的是什么？",
          options: [
            "一个能放 3 个字符的数组",
            "一个数组，里面是 3 个 char * 元素（指针数组）",
            "一个指向「3 个 char 的数组」的指针",
            "一个二级指针变量"
          ],
          answer: 1,
          explain: "从里往外读：words 先和 [3] 结合，所以它是数组；元素类型是 char *，所以是指针数组，B 对。A 把指针当成了字符；C 描述的是 char (*words)[3]，区别在那对括号；D 只说了退化后的类型，words 本身是数组而不是指针变量。"
        },
        {
          q: "`int x = 1; int *px = &x; int **pp = &px;` 执行 `**pp = 100;` 之后，谁变了？",
          options: [
            "px 变成 100",
            "pp 变成 100",
            "x 变成 100",
            "编译错误，二级指针不能这样写"
          ],
          answer: 2,
          explain: "**pp 连剥两层：pp 指向 px，px 指向 x，所以最终改的是 x，C 对。A 描述的是 *pp 的效果（改指针本身）；B 是把 pp 自己当成数据；D 说错了——两级解引用是完全合法的写法。"
        },
        {
          q: "要让函数把调用者的指针改成指向新申请的内存，形参应该怎么写？",
          options: [
            "int *p，函数里写 p = malloc(...)",
            "int p[]，函数里直接赋值",
            "const int *p，函数里写 *p = malloc(...)",
            "int **p，调用时传 &p，函数里写 *p = malloc(...)"
          ],
          answer: 3,
          explain: "要改「指针本身」，就得拿到指针变量的地址，因此形参是二级指针，D 对。A 改的是形参副本，调用者的指针纹丝不动，而且新申请的内存地址丢失、造成泄漏；B 的数组形参同样退化成指针，道理相同；C 加了 const 后连内容都不该改，而且它是指向 int 的指针，类型也不对。"
        }
      ],
      passRatio: 0.8,
      mission: "在 main 里写三段：① 定义指针数组 `char *words[3] = {\"Ann\", \"Bob\", \"Cid\"};`，用 `char **p = words;` 配合 for 循环打印成 `[Ann][Bob][Cid]`（打印语句用 printf(\"[%s]\", *(p + i)) 的风格）；② 定义 `int x = 1, y = 2;`、`int *px = &x;`、`int **pp = &px;`；③ 先用 `**pp = 100;` 改掉 x，再用 `*pp = &y;` 让 px 转向 y，最后打印 `x = 100, y = 2, *px = 2`。",
      starter: "#include <stdio.h>\n\n"
        + "int main(void) {\n"
        + "    /* TODO: 指针数组与 char **p */\n\n"
        + "    /* TODO: 用 *(p + i) 打印 [名字] */\n\n"
        + "    int x = 1, y = 2;\n"
        + "    /* TODO: px 与 pp，然后 **pp = 100; 与 *pp = &y; */\n\n"
        + "    printf(\"x = %d, y = %d, *px = %d\\n\", x, y, *px);\n"
        + "    return 0;\n"
        + "}",
      hint: "写声明时从里往外读：char *words[3] 先看到 [3]，是数组，元素是 char *；int **pp 里的两个 * 表示「指向指针的指针」。动手之前先把三行写在纸上：pp 指向谁、pp 解引用一次是谁、解引用两次是谁，写清楚再敲代码。",
      check: {
        include: ["stdio.h"],
        return0: true,
        seq: [
          ["char", "*", "words", "[", "3", "]"],
          ["char", "*", "*", "p", "=", "words"],
          ["int", "*", "*", "pp", "=", "&", "px"],
          ["*", "*", "pp", "=", "100"],
          ["*", "pp", "=", "&", "y"]
        ],
        calls: [["printf", "[%s]"], ["printf", "x = %d, y = %d, *px = %d"]],
        require: { array: true, pointer: true, for: true },
        minStatements: 8,
        message: "需要 char *words[3]、char **p = words、int **pp = &px、**pp = 100;、*pp = &y; 这几处写法，以及 for 循环和两行指定格式的打印。",
        ok: "指针数组、二级指针的两次解引用与改指向都写对了，模型已经建立起来。"
      },
      expectedOutput: "[Ann][Bob][Cid]\nx = 100, y = 2, *px = 2",
      solution: "#include <stdio.h>\n\n"
        + "int main(void) {\n"
        + "    char *words[3] = {\"Ann\", \"Bob\", \"Cid\"};\n"
        + "    char **p = words;\n"
        + "    int i;\n"
        + "    int x = 1, y = 2;\n"
        + "    int *px = &x;\n"
        + "    int **pp = &px;\n\n"
        + "    for (i = 0; i < 3; i++) {\n"
        + "        printf(\"[%s]\", *(p + i));\n"
        + "    }\n"
        + "    printf(\"\\n\");\n\n"
        + "    **pp = 100;\n"
        + "    *pp = &y;\n"
        + "    printf(\"x = %d, y = %d, *px = %d\\n\", x, y, *px);\n"
        + "    return 0;\n"
        + "}",
      mastery: [
        "能从声明里分辨指针数组与指向数组的指针",
        "能说清 *pp 与 **pp 分别在改什么",
        "知道函数要改调用者的指针时为什么必须用二级指针",
        "能看懂 int main(int argc, char *argv[]) 的参数模型"
      ]
    },
    {
      id: 38,
      title: "函数指针与回调：把函数当参数传",
      minutes: 22,
      gist: "读懂 int (*fp)(int, int) 这种声明，会用 qsort 的比较函数，理解「回调」到底回什么。",
      lesson: "函数也在内存里，也有地址；函数名在表达式里就代表这个函数的入口地址。既然有地址，就能把它存进一个变量——这就是函数指针。\n"
        + "声明语法是重点，括号不能省：int (*fp)(const void *, const void *); 读作「fp 是一个指针，指向『接收两个 const void *、返回 int』的函数」。去掉括号写成 int *fp(const void *, const void *); 意思完全变了：那是「一个函数，返回 int *」。读声明时从里往外读，先看 fp 和谁结合。\n"
        + "赋值和调用都很自然：fp = cmp; 之后用 fp(a, b) 调用，等价于 (*fp)(a, b)；写 fp = &cmp; 也可以，函数名本来就会转换成地址。\n"
        + "函数指针最大的价值是回调：把「怎么做」作为参数交给别人，让别人在合适的时机调用。标准库的 qsort 就是典型：qsort(数组, 元素个数, 每个元素大小, 比较函数)。排序算法是固定的，比较规则由你提供，于是同一份 qsort 能排整数、字符串、结构体。\n"
        + "比较函数的接口是固定的：int cmp(const void *a, const void *b)。返回负数表示 a 应排在 b 前面，0 表示相等，正数表示 a 应排在 b 后面。因为参数是 void *（不知道具体类型），函数里第一步必须转回真实类型再用：int x = *(const int *)a;。\n"
        + "写比较函数有个小技巧：别写 return x - y;。虽然大多数情况能对，但两个很大的数相减会溢出 int，那属于未定义行为。稳妥写法是 return (x > y) - (x < y);，只用比较的结果做减法，永远只有 -1、0、1 三种可能。\n"
        + "最后是常见的错法：比较函数只返回 0 和 1（漏掉相等的 0 或负数），qsort 会把「相等」误判成「大于」，排序结果错乱；传参时写成 qsort(..., cmp()) 加了括号，那是「先调用 cmp 再把返回值传进去」，类型不匹配；忘了把 const void * 转成真实类型就解引用，编译期直接报错，因为 void 没有大小。",
      example: {
        code: "#include <stdio.h>\n#include <stdlib.h>\n\n"
          + "int cmp_asc(const void *a, const void *b) {\n"
          + "    int x = *(const int *)a;\n"
          + "    int y = *(const int *)b;\n"
          + "    return (x > y) - (x < y);\n"
          + "}\n\n"
          + "int cmp_desc(const void *a, const void *b) {\n"
          + "    return cmp_asc(b, a);          /* 把两个参数调个位置就是降序 */\n"
          + "}\n\n"
          + "void print_all(const int *a, int n) {\n"
          + "    int i;\n"
          + "    for (i = 0; i < n; i++) {\n"
          + "        printf(\"%d\", a[i]);\n"
          + "        if (i < n - 1) {\n"
          + "            printf(\" \");\n"
          + "        }\n"
          + "    }\n"
          + "    printf(\"\\n\");\n"
          + "}\n\n"
          + "int main(void) {\n"
          + "    int a[6] = {5, 2, 9, 1, 7, 3};\n"
          + "    int (*fp)(const void *, const void *);   /* 函数指针：括号不能少 */\n\n"
          + "    fp = cmp_asc;                            /* 函数名就是函数地址 */\n"
          + "    qsort(a, 6, sizeof(int), fp);\n"
          + "    printf(\"asc : \");\n"
          + "    print_all(a, 6);\n\n"
          + "    qsort(a, 6, sizeof(int), cmp_desc);      /* 直接把函数名当参数传 */\n"
          + "    printf(\"desc: \");\n"
          + "    print_all(a, 6);\n\n"
          + "    printf(\"fp == cmp_asc ? %d\\n\", fp == cmp_asc);\n"
          + "    return 0;\n"
          + "}",
        output: "asc : 1 2 3 5 7 9\ndesc: 9 7 5 3 2 1\nfp == cmp_asc ? 1",
        explain: "第 4 行的参数类型 const void * 是 qsort 规定的接口：它不知道你要排什么，所以用「无类型指针」交接，函数里再用 (const int *) 转回来。"
          + "第 11 行的 cmp_desc 没有重写比较逻辑，只是把 a、b 换个位置调用 cmp_asc，就得到了相反的顺序——比较函数返回值的正负决定了谁排前面。"
          + "第 27 行 int (*fp)(const void *, const void *); 是函数指针声明：括号把 * 和 fp 绑在一起，表示 fp 是指针，后面那对括号才是它指向的函数的参数表。"
          + "第 29 行把 cmp_asc 赋给 fp（函数名自动转成地址），第 30 行用它排序；第 34 行干脆直接把函数名当实参传进去。两种写法效果一样，这就是回调：qsort 负责排序，比较规则由你注入。"
          + "第 38 行 fp == cmp_asc 输出 1，说明 fp 里存的确实就是这个函数的地址。整段代码没有打印任何地址数字，只打印比较结果，所以每次运行输出都一样。"
      },
      pitfalls: [
        "`int *fp(const void *, const void *);` 漏掉括号 → 意思变成「返回 int * 的函数声明」，和函数指针完全不是一回事，赋值时报 incompatible 类型错误。",
        "比较函数只返回 0 和 1（或只返回正数和 0）→ 丢掉了「相等」或「小于」的信息，qsort 会把相等当成大于，排序结果错乱，而且不一定每次都错，最难查。",
        "忘了把 `const void *` 转成真实类型就解引用：`int x = *a;` → 编译期就报错，因为 void 是不完整类型，没有大小。",
        "传参时写成 `qsort(a, 6, sizeof(int), cmp());` → 多了括号，变成「先调用 cmp 再把返回值传进去」，类型不匹配；要传函数本身，写 cmp。",
        "比较函数写成 `return x - y;` → 两个接近 int 极限的数相减会溢出，属于未定义行为；用 (x > y) - (x < y) 这类只比较、不做大数运算的写法。"
      ],
      takeaways: [
        "int (*fp)(参数表) 才是指向函数的指针，括号决定含义",
        "函数名就是函数地址，fp = cmp; 后可以写 fp(...) 调用",
        "qsort 通过回调把「比较规则」交给调用者，比较函数返回负数/0/正数",
        "比较函数里必须把 const void * 转回真实类型，避免用减法比较"
      ],
      questions: [
        {
          q: "下面哪个声明表示「指向函数的指针」？",
          options: [
            "int *fp(int, int);",
            "int fp(int, int);",
            "int (*fp)(int, int)();",
            "int (*fp)(int, int);"
          ],
          answer: 3,
          explain: "括号让 * 先和 fp 结合，说明 fp 是指针，后面的 (int, int) 是它指向的函数的参数表，D 对。A 是「返回 int * 的函数」；B 是普通函数声明；C 在参数表后又多了一对括号，语法上不成立。"
        },
        {
          q: "qsort 的比较函数应该返回什么？",
          options: [
            "只返回 1 或 0：1 表示第一个参数排前面",
            "负数（a 应排在 b 前）、0（相等）、正数（a 应排在 b 后）三种情况",
            "永远返回 a - b，这样最简洁也最安全",
            "只返回 1 和 -1 就够了，相等的情况用不到"
          ],
          answer: 1,
          explain: "比较函数必须给出三态信息，B 对。A、D 都丢掉了「相等」这一态，会让排序结果不稳定甚至错乱；C 的 a - b 在数值接近 int 极限时会溢出，属于未定义行为，不能算安全写法。"
        },
        {
          q: "把函数 `g` 作为参数传给另一个函数，让它在合适的时机被调用，这种机制叫？",
          options: [
            "回调（callback）：由调用者提供行为，被调用的函数在合适的时机回过头来调用它",
            "递归：函数自己调用自己",
            "宏替换：编译前做文本替换",
            "类型转换：把函数当成数据来用"
          ],
          answer: 0,
          explain: "这正是回调的定义，qsort 与比较函数就是标准例子，A 对。递归是函数调用自身，与传参无关；宏替换发生在预处理阶段，也不涉及函数指针；类型转换是把值换一种类型解释，与「在合适的时机被调用」无关。"
        }
      ],
      passRatio: 0.8,
      mission: "写一个程序：① 定义比较函数 `int cmp_desc(const void *a, const void *b)`，把 a、b 转成 const int * 取出 x、y，返回三态比较结果，让大的排在前面；② 在 main 里声明数组 `int a[6] = {5, 2, 9, 1, 7, 3};`；③ 声明函数指针 `int (*fp)(const void *, const void *);` 并赋值 `fp = cmp_desc;`；④ 用 `qsort(a, 6, sizeof(int), fp);` 排序；⑤ 用 for 循环打印成一行 `desc: 9 7 5 3 2 1`（冒号后每个数前留一个空格）。",
      starter: "#include <stdio.h>\n#include <stdlib.h>\n\n"
        + "int cmp_desc(const void *a, const void *b) {\n"
        + "    /* TODO: 转成 const int *，取出 x、y，返回三态比较结果 */\n"
        + "}\n\n"
        + "int main(void) {\n"
        + "    int a[6] = {5, 2, 9, 1, 7, 3};\n"
        + "    int i;\n"
        + "    /* TODO: 声明函数指针 fp 并赋值 fp = cmp_desc; */\n\n"
        + "    /* TODO: qsort(a, 6, sizeof(int), fp); */\n\n"
        + "    printf(\"desc:\");\n"
        + "    /* TODO: 用 for 打印 \" %d\" */\n\n"
        + "    return 0;\n"
        + "}",
      hint: "函数指针的声明照抄任务里给的三个部分：返回类型 int、括号里的 (*fp)、参数表 (const void *, const void *)。比较函数里先写 int x = *(const int *)a;，再写 int y = *(const int *)b;，最后 return (x < y) - (x > y); 就是降序。qsort 那一行四个参数依次是数组、个数、单个元素大小、比较函数。",
      check: {
        include: ["stdio.h", "stdlib.h"],
        return0: true,
        seq: [
          ["int", "a", "[", "6", "]"],
          ["int", "(", "*", "fp", ")"],
          ["fp", "=", "cmp_desc"],
          ["qsort", "("]
        ],
        calls: [["printf", "desc:"], ["printf", "%d"]],
        require: { funcs: ["cmp_desc"], pointer: true, for: true },
        minStatements: 8,
        message: "需要题目指定的数组、`int (*fp)(...)` 形式的函数指针、fp = cmp_desc; 、qsort 调用、自己定义的 cmp_desc，以及 desc: 开头的打印。",
        ok: "函数指针声明、回调传参与降序排序都对了，格式也符合要求。"
      },
      solution: "#include <stdio.h>\n#include <stdlib.h>\n\n"
        + "int cmp_desc(const void *a, const void *b) {\n"
        + "    int x = *(const int *)a;\n"
        + "    int y = *(const int *)b;\n"
        + "    return (x < y) - (x > y);\n"
        + "}\n\n"
        + "int main(void) {\n"
        + "    int a[6] = {5, 2, 9, 1, 7, 3};\n"
        + "    int (*fp)(const void *, const void *);\n"
        + "    int i;\n\n"
        + "    fp = cmp_desc;\n"
        + "    qsort(a, 6, sizeof(int), fp);\n\n"
        + "    printf(\"desc:\");\n"
        + "    for (i = 0; i < 6; i++) {\n"
        + "        printf(\" %d\", a[i]);\n"
        + "    }\n"
        + "    printf(\"\\n\");\n"
        + "    return 0;\n"
        + "}",
      mastery: [
        "能独立写出并读懂函数指针的声明，区分它与返回指针的函数",
        "能按 qsort 的约定写出正确的三态比较函数",
        "能说清回调机制为什么能让算法与比较规则解耦"
      ]
    },
    {
      id: 39,
      title: "动态内存：malloc / calloc / realloc / free",
      minutes: 25,
      gist: "在堆上按需申请内存：四个函数的正确用法、必须检查返回值、以及 free 的配对原则。",
      lesson: "前面用的数组，大小必须在写代码时就定下来，元素个数是编译期常量。可现实中经常是「运行时才知道要多少」——读进来 37 个分数、存 200 条记录。这时就要向堆（heap）申请内存，用完再还回去。\n"
        + "malloc(size) 申请 size 个字节，返回这块内存的首地址；申请失败返回 NULL。它要的是字节数，所以写 malloc(n * sizeof(int)) 而不是 malloc(n)——用 sizeof 让编译器替你算，元素类型一改也不会错。\n"
        + "calloc(n, size) 一次申请 n 个元素、每个 size 字节，并且把整块内存清零。要初始值为 0 的数组就用它；malloc 拿到的内存内容是未初始化的，里面是之前留下的垃圾数据，读到什么都不奇怪，别指望它是 0。\n"
        + "realloc(p, new_size) 把已申请的内存改成新大小：可能在原地扩展，也可能搬到别处（首地址变了），原内容会保留。它有两个必须记住的点。第一，失败时返回 NULL 而且原来的内存仍然有效；所以绝不能写 p = realloc(p, ...)——一旦失败，原地址就丢了，那块内存再也 free 不掉，直接造成内存泄漏。正确写法是用临时指针接：int *tmp = realloc(p, ...); if (tmp != NULL) p = tmp;。第二，扩容出来的新区域同样未初始化，需要自己填。\n"
        + "free(p) 把内存还给系统，必须和申请配对：申请一次、释放一次。free(NULL) 是安全的空操作，所以「忘写 if 判断就 free」通常没事；但重复释放同一块内存（double free）会破坏堆的管理结构，属于未定义行为。free 之后指针不会自动变成 NULL，它会变成悬空指针，所以释放后立刻 p = NULL; 是极有价值的习惯。\n"
        + "还有两条边界：只能 free 由 malloc/calloc/realloc 返回的地址，free 栈上数组的地址、或数组中间元素（p + 1）都是未定义行为；申请了却完全不释放就是内存泄漏，短命的小程序看不出来，长期运行的服务会一点点吃光内存。\n"
        + "最后是规模问题：malloc(n * sizeof(int)) 里的乘法在 n 极大时可能溢出 size_t，正规做法是先判断 n 是否合理。初学阶段至少要养成「申请后立刻检查 NULL」这一条。",
      example: {
        code: "#include <stdio.h>\n#include <stdlib.h>\n\n"
          + "int main(void) {\n"
          + "    int n = 5, i;\n"
          + "    int *a = malloc((size_t)n * sizeof(int));   /* 内容未初始化 */\n"
          + "    int *zeros = calloc(4, sizeof(int));        /* 申请并清零 */\n"
          + "    int *bigger;\n\n"
          + "    if (a == NULL || zeros == NULL) {           /* 申请失败会返回 NULL */\n"
          + "        printf(\"out of memory\\n\");\n"
          + "        free(a);                                /* free(NULL) 是安全的 */\n"
          + "        free(zeros);\n"
          + "        return 1;\n"
          + "    }\n\n"
          + "    for (i = 0; i < n; i++) {\n"
          + "        a[i] = (i + 1) * (i + 1);\n"
          + "    }\n"
          + "    printf(\"squares:\");\n"
          + "    for (i = 0; i < n; i++) {\n"
          + "        printf(\" %d\", a[i]);\n"
          + "    }\n"
          + "    printf(\"\\n\");\n"
          + "    printf(\"calloc: %d %d %d %d\\n\", zeros[0], zeros[1], zeros[2], zeros[3]);\n\n"
          + "    bigger = realloc(a, (size_t)8 * sizeof(int));  /* 扩容：可能搬到新地址 */\n"
          + "    if (bigger == NULL) {                          /* 失败时 a 仍然有效 */\n"
          + "        free(a);\n"
          + "        free(zeros);\n"
          + "        printf(\"realloc failed\\n\");\n"
          + "        return 1;\n"
          + "    }\n"
          + "    a = bigger;\n"
          + "    for (i = n; i < 8; i++) {\n"
          + "        a[i] = 0;                                  /* 新区域要自己填 */\n"
          + "    }\n"
          + "    printf(\"a[0] = %d, a[7] = %d\\n\", a[0], a[7]);\n\n"
          + "    free(a);\n"
          + "    a = NULL;                  /* 置空，避免悬空指针被误用 */\n"
          + "    free(zeros);\n"
          + "    zeros = NULL;\n"
          + "    printf(\"freed: a is %s\\n\", a == NULL ? \"NULL\" : \"not NULL\");\n"
          + "    return 0;\n"
          + "}",
        output: "squares: 1 4 9 16 25\ncalloc: 0 0 0 0\na[0] = 1, a[7] = 0\nfreed: a is NULL",
        explain: "第 6、7 行分别用 malloc 和 calloc 申请。malloc 拿到的是未初始化的内存，所以第 17 行马上把 5 个位置都填上平方数；calloc 直接给出 0，所以第 25 行打印出四个 0。"
          + "第 10 行把两个返回值一起检查：只要有一个是 NULL 就清理现场退出。这里 free(a) 和 free(zeros) 可能收到 NULL，这是安全的——free(NULL) 什么也不做。"
          + "第 27 行是 realloc 的关键用法：先用临时指针 bigger 接结果，确认不为 NULL 之后再赋回 a。如果写成 a = realloc(a, ...)，一旦失败原地址就丢了。"
          + "第 35 行只把新增的 3 个位置填 0；realloc 保留原有内容（所以 a[0] 还是 1），但新扩展出来的区域内容不确定，必须自己初始化。"
          + "第 40 到 43 行是收尾：按申请的反序释放每块内存，并立刻把指针置成 NULL。第 44 行打印的 a is NULL 就是在验证这个习惯——free 本身不会替你置空。"
      },
      pitfalls: [
        "`p = realloc(p, new_size);` 直接覆盖 → realloc 失败返回 NULL 时原地址丢失，那块内存永远无法释放，造成内存泄漏；要用临时指针接住再判断。",
        "不检查 malloc 的返回值 → 内存紧张或申请量过大时返回 NULL，往 NULL 写会立刻崩溃；每个申请后都要有 if (p == NULL) 的处理分支。",
        "`free(p);` 之后继续用 p（p[0] = 1; 或 printf(\"%d\", *p)）→ 悬空指针，内存已经还给系统，可能改坏别人的数据；free 不会自动把 p 变成 NULL。",
        "对同一块内存 free 两次（例如 if 分支和 else 分支各 free 一次）→ double free，堆的管理结构被破坏，属于未定义行为，常见现象是后面某次 malloc 或 free 时莫名崩溃。",
        "free 不是申请来的地址：free 一个栈数组、free 数组中间元素（p + 1）、free 一个没初始化的指针，都是未定义行为；只有 malloc/calloc/realloc 返回的地址能 free。",
        "以为 malloc 得到的内存是 0 → 里面是上次遗留的数据，需要清零就改用 calloc，或者自己 memset。"
      ],
      takeaways: [
        "malloc(n * sizeof(int)) 申请，返回值必须检查是否为 NULL",
        "calloc 申请并清零；realloc 扩容可能搬家，必须用临时指针接返回值",
        "free 与申请一一配对，释放后立刻把指针置为 NULL",
        "malloc 的内存未初始化，读到的是垃圾数据；free 的内存不能再用"
      ],
      questions: [
        {
          q: "执行 `int *p = malloc(n * sizeof(int));` 之后，最该做的一件事是什么？",
          options: [
            "检查 p 是否为 NULL，失败时妥善处理",
            "立刻 free(p) 释放内存",
            "用 %d 把 p 打印出来，确认地址有效",
            "把 p 声明成 const，防止被修改"
          ],
          answer: 0,
          explain: "申请可能失败，失败时返回 NULL，不检查就使用会在下一步崩溃，所以 A 是必须做的。B 相当于申请完立刻还回去，p 马上变成悬空指针；C 打印地址既不能证明内存可用，地址每次运行还可能不同；D 与内存是否申请成功毫无关系，反而会限制后续写入。"
        },
        {
          q: "为什么不能写 `p = realloc(p, bigger);`？",
          options: [
            "realloc 会把原有内容清零，所以必须先备份数据",
            "realloc 只能用来缩小内存，不能扩容",
            "realloc 失败时返回 NULL，直接赋给 p 就丢掉了原来的地址，那块内存再也无法释放",
            "可以这样写，只是代码风格不够好"
          ],
          answer: 2,
          explain: "realloc 失败时原内存仍然有效，但返回值是 NULL；一旦覆盖了 p，你就再也拿不到老地址去 free，造成泄漏，C 对。A 说错了——realloc 会保留原有内容；B 也不对，扩容缩容都支持；D 低估了后果，这是真实的内存泄漏来源。"
        },
        {
          q: "`free(p);` 之后紧接着执行 `p[0] = 1;` 会怎样？",
          options: [
            "p 会自动变成 NULL，赋值时程序报错退出",
            "完全安全：内存已经归还，写进去不会影响任何人",
            "编译器会拒绝编译这行代码",
            "这是悬空指针：内存已归还，再访问属于未定义行为，可能改坏别人的数据或崩溃"
          ],
          answer: 3,
          explain: "free 只是把内存还给分配器，指针里仍留着旧地址，继续使用就是悬空指针，D 对。A 说错了——free 不会修改你的指针变量，这正是要自己写 p = NULL; 的原因；B 错得最危险，那块内存随时可能被别人申请走；C 也不对，这类错误编译器通常发现不了。"
        }
      ],
      passRatio: 0.8,
      mission: "写一个程序：① 用 `malloc((size_t)n * sizeof(int))` 申请 `n = 6` 个 int 的空间，并检查返回值是否为 NULL；② 用 for 循环填入 1 到 6 的立方（i * i * i），打印一行 `cubes: 1 8 27 64 125 216`；③ 用 `realloc` 把空间扩到 10 个 int，把新增的位置填 0，打印 `last = 0`（最后一个元素）；④ 结束时 `free` 这块内存，并把指针置为 `NULL`。",
      starter: "#include <stdio.h>\n#include <stdlib.h>\n\n"
        + "int main(void) {\n"
        + "    int n = 6, i;\n"
        + "    /* TODO: 申请 n 个 int，并检查 NULL */\n\n"
        + "    /* TODO: 填入立方并打印 cubes: ... */\n\n"
        + "    /* TODO: realloc 到 10 个，新增位置填 0，打印 last = %d */\n\n"
        + "    /* TODO: free 并置 NULL */\n\n"
        + "    return 0;\n"
        + "}",
      hint: "申请写成 int *a = malloc((size_t)n * sizeof(int));，下一行立刻写 if (a == NULL) { printf(\"out of memory\\n\"); return 1; }。realloc 那一步一定要用 int *bigger 接返回值，判断不为 NULL 后再 a = bigger;，这样即使失败也不会丢地址。最后 free(a); a = NULL;。",
      check: {
        include: ["stdio.h", "stdlib.h"],
        return0: true,
        seq: [
          ["malloc", "("],
          ["realloc", "("],
          ["free", "("],
          ["=", "NULL"]
        ],
        calls: [["printf", "cubes:"], ["printf", "last = %d"]],
        require: { malloc: true, free: true, for: true, if: true, pointer: true },
        minStatements: 10,
        message: "需要 malloc 申请、realloc 扩容、free 释放、把指针置为 NULL，以及 cubes: 与 last = %d 两行打印。",
        ok: "申请、检查、扩容、释放四步齐全，指针也按规范置空了。"
      },
      solution: "#include <stdio.h>\n#include <stdlib.h>\n\n"
        + "int main(void) {\n"
        + "    int n = 6, i;\n"
        + "    int *a = malloc((size_t)n * sizeof(int));\n"
        + "    int *bigger;\n\n"
        + "    if (a == NULL) {\n"
        + "        printf(\"out of memory\\n\");\n"
        + "        return 1;\n"
        + "    }\n\n"
        + "    for (i = 0; i < n; i++) {\n"
        + "        a[i] = (i + 1) * (i + 1) * (i + 1);\n"
        + "    }\n\n"
        + "    printf(\"cubes:\");\n"
        + "    for (i = 0; i < n; i++) {\n"
        + "        printf(\" %d\", a[i]);\n"
        + "    }\n"
        + "    printf(\"\\n\");\n\n"
        + "    bigger = realloc(a, (size_t)10 * sizeof(int));\n"
        + "    if (bigger == NULL) {\n"
        + "        free(a);\n"
        + "        printf(\"realloc failed\\n\");\n"
        + "        return 1;\n"
        + "    }\n"
        + "    a = bigger;\n"
        + "    for (i = n; i < 10; i++) {\n"
        + "        a[i] = 0;\n"
        + "    }\n"
        + "    printf(\"last = %d\\n\", a[9]);\n\n"
        + "    free(a);\n"
        + "    a = NULL;\n"
        + "    return 0;\n"
        + "}",
      mastery: [
        "能按需申请一块运行时才知道大小的内存，并正确检查返回值",
        "能用 realloc 安全扩容，解释临时指针为什么不能省",
        "能让 malloc/calloc/realloc 与 free 一一配对，并在释放后置空指针",
        "能说清 malloc 与 calloc 在初始化上的区别"
      ]
    },
    {
      id: 40,
      title: "内存错误大全：泄漏、野指针、悬空指针、double free、越界",
      minutes: 22,
      gist: "认清五类内存错误的成因、现象与修法，学会用「配对」和「置空」两个习惯躲开它们。",
      lesson: "内存错误之所以可怕，是因为它们往往「不在这里出错」：越界写可能今天没事，明天在另一次 free 时崩溃；用了悬空指针可能一直正常，直到那块内存被别人申请走。所以与其背症状，不如记住每类错误的成因和修法。\n"
        + "第一类：野指针（未初始化的指针）。int *p; 里是随机地址，*p = 1; 会写到不知道谁的内存里。修法：声明即初始化，没有目标就写 NULL；使用前先判断。\n"
        + "第二类：悬空指针（用已经释放的内存）。free(p) 之后 p 仍保存着旧地址，再读或再写就是未定义行为。特别注意，free 不会把 p 变成 NULL——这是标准的规定，不是编译器的疏忽。修法：free 之后立刻 p = NULL;，之后所有使用前都判断非 NULL。\n"
        + "第三类：内存泄漏（申请了不释放）。循环里每轮 malloc 却不 free，程序越长越大；更隐蔽的是 p = malloc(...) 覆盖了上一个地址，那块内存永远找不回来。修法：让每个申请都有对应的释放路径，函数里申请的内存要明确「谁负责释放」，realloc 必须用临时指针接。\n"
        + "第四类：double free（重复释放）。同一块内存被 free 两次，堆的管理结构会被破坏，通常表现为之后某次 malloc/free 莫名崩溃。修法：释放后置 NULL，并在 free 前判断；函数之间约定好由谁释放，不要让两条分支各释放一次。\n"
        + "第五类：越界访问。数组下标超过范围、循环写成 i <= n、malloc 了 n 个却写第 n+1 个：读越界拿到垃圾值，写越界会覆盖相邻数据甚至堆的管理信息，崩溃点常常离错误行很远。修法：申请 n 个就只用 0..n-1，循环条件一律写 i < n。\n"
        + "还有一条容易被忽略的：返回局部变量的地址。函数里的 int buf[10]; 在栈上，函数一返回这块内存就失效，return buf; 得到的是悬空指针；要返回长期有效的数据，就在堆上申请，或者由调用者把数组传进来。\n"
        + "排查手段也要会用：编译时始终打开警告（-Wall -Wextra），对每个 malloc 立刻写检查分支，释放后置空，掌握这些就能避开绝大多数问题；更复杂的场景可以借助内存检查工具定位。",
      example: {
        code: "#include <stdio.h>\n#include <stdlib.h>\n\n"
          + "int *make_ints(int n) {\n"
          + "    int *p = malloc((size_t)n * sizeof(int));\n"
          + "    int i;\n\n"
          + "    if (p == NULL) {\n"
          + "        return NULL;                 /* 申请失败：返回 NULL，交给调用者决定 */\n"
          + "    }\n"
          + "    for (i = 0; i < n; i++) {\n"
          + "        p[i] = i + 1;\n"
          + "    }\n"
          + "    return p;                        /* 堆上的内存可以安全地返回 */\n"
          + "}\n\n"
          + "int main(void) {\n"
          + "    int *a = make_ints(4);           /* 先接住返回值，再判断 */\n"
          + "    int i, sum = 0;\n\n"
          + "    if (a == NULL) {\n"
          + "        printf(\"out of memory\\n\");\n"
          + "        return 1;\n"
          + "    }\n"
          + "    for (i = 0; i < 4; i++) {        /* 只在 0..3 范围内访问 */\n"
          + "        sum += a[i];\n"
          + "    }\n"
          + "    printf(\"sum = %d\\n\", sum);\n\n"
          + "    free(a);                         /* 谁申请谁释放，配成一对 */\n"
          + "    a = NULL;                        /* 置空，防止误用悬空指针 */\n"
          + "    printf(\"a is NULL ? %d\\n\", a == NULL);\n"
          + "    return 0;\n"
          + "}",
        output: "sum = 10\na is NULL ? 1",
        explain: "整段代码演示的是「正确的一生」：申请 → 检查 → 使用 → 释放 → 置空，五步一步不少。"
          + "第 5 行 make_ints 内部申请内存并返回地址，这是安全的——堆上的内存不会随函数返回而失效；对比之下，如果写成 int buf[4]; return buf; 就是返回栈上地址的严重错误。"
          + "第 18 行先接住返回值再判断：a 可能是 NULL，所以第 21 行的检查必须在任何解引用之前。"
          + "第 25 行的循环条件是 i < 4，正好覆盖 0..3 四个合法下标；如果写成 i <= 4，就会越界写第 5 个位置，破坏堆的管理信息，崩溃点常常出现在后面的 free 上，让人误以为是 free 有问题。"
          + "第 30、31 行是收尾的两个动作：free 归还内存，紧接着置 NULL。第 32 行的输出 1 就是在确认这一步——free 本身不会替你置空，必须自己写。"
      },
      pitfalls: [
        "函数里返回局部数组的地址：`int buf[10]; return buf;` → 函数一返回栈内存就失效，拿到的是悬空指针；要返回长期数据就用 malloc，或让调用者传数组进来。",
        "`free(p);` 之后继续读写 p → 悬空指针；free 不会把 p 变 NULL，必须自己写 `p = NULL;` 并在使用前判断。",
        "循环里反复 `p = malloc(...)` 却一次都不 free，或只 free 最后一块 → 内存泄漏，短程序看不出来，长时间运行的服务会持续吃内存。",
        "越界写：`for (i = 0; i <= n; i++) a[i] = 0;` → 多写一个元素就覆盖了相邻内存（可能是堆的管理信息），错误往往在后面某次 free 时才爆发，非常难查。",
        "double free：if 分支与 else 分支各 free 一次，或 free 后又走了一遍清理代码 → 堆结构被破坏，程序崩溃甚至被利用；及时置 NULL 可以拦住第二次释放。",
        "以为 malloc 出来的内存是 0 → 里面是未初始化的垃圾数据，要全 0 就用 calloc。"
      ],
      takeaways: [
        "野指针：指针声明时初始化，没目标就 NULL，用前先判断",
        "悬空指针：free 后立刻置 NULL，free 不会替你置空",
        "泄漏与 double free：申请与释放一一配对，不要让两条分支重复释放",
        "越界与返回局部地址：申请 n 个只用 0..n-1；栈上的地址不能带出函数"
      ],
      questions: [
        {
          q: "下面哪种写法一定会造成内存泄漏？",
          options: [
            "free(p) 之后把 p 置为 NULL",
            "malloc 之后立刻检查 p == NULL",
            "p = malloc(...) 之后又写 p = malloc(...)，两次都没有 free",
            "用 calloc 代替 malloc 来申请内存"
          ],
          answer: 2,
          explain: "第二次赋值把第一块内存的地址覆盖掉了，那块内存再也找不到、无法释放，这就是泄漏，C 对。A 是良好习惯，释放后置空不影响内存归还；B 是必须做的检查；D 只影响是否清零，与泄漏无关。"
        },
        {
          q: "函数里写 `int buf[10]; return buf;` 的问题是什么？",
          options: [
            "没有问题，返回时数组会自动复制一份交给调用者",
            "编译一定报错，C 不允许返回数组",
            "只是白占了 40 字节栈空间，没有实际危害",
            "返回的是局部数组的地址，函数返回后这块栈内存已经失效，使用它就是悬空指针（未定义行为）"
          ],
          answer: 3,
          explain: "局部数组随函数返回而失效，返回它的地址就是典型的悬空指针，D 对。A 是常见误解——C 不会自动复制数组，退化成指针后只传了地址；B 说错了，编译器通常只给一个警告（返回局部变量地址）；C 低估了后果，这块栈空间随时会被下一个函数调用覆盖。"
        },
        {
          q: "对同一块内存 free 两次，会发生什么？",
          options: [
            "第二次 free 会被自动忽略，是安全的",
            "重复释放会破坏堆的管理结构，属于未定义行为，通常导致程序崩溃",
            "第二次 free 只是把指针置成 NULL",
            "只有在多线程程序里才危险，单线程程序没问题"
          ],
          answer: 1,
          explain: "free 只应作用于仍然有效的、由申请得到的地址，重复释放会破坏分配器的内部结构，B 对。A、D 都以为存在「自动保护」，实际没有；C 说错了——free 从来不修改你的指针变量，置 NULL 得自己写。"
        }
      ],
      passRatio: 0.8,
      mission: "写一个程序：定义函数 `int *make_ints(int n)`，用 malloc 申请 n 个 int，检查返回值（失败返回 NULL），依次填入 1..n 后返回指针。在 main 里用 `int *a = make_ints(4);` 接住返回值，先判断是否为 NULL，再用 for 求和并打印 `sum = 10`，最后 free 并把 a 置为 NULL，打印 `a is NULL ? 1`。",
      starter: "#include <stdio.h>\n#include <stdlib.h>\n\n"
        + "int *make_ints(int n) {\n"
        + "    /* TODO: malloc + 检查 NULL + 填 1..n + return */\n"
        + "}\n\n"
        + "int main(void) {\n"
        + "    /* TODO: int *a = make_ints(4); 并判断 NULL */\n\n"
        + "    /* TODO: for 求和并打印 sum = %d */\n\n"
        + "    /* TODO: free 并置 NULL，打印 a is NULL ? %d */\n\n"
        + "    return 0;\n"
        + "}",
      hint: "把 make_ints 写成四步：malloc((size_t)n * sizeof(int))、if (p == NULL) return NULL;、for 循环 p[i] = i + 1;、return p;。main 里一定要先判断 a 再用，最后两行是 free(a); a = NULL;——顺序不能反，否则置空了就没法释放了。",
      check: {
        include: ["stdio.h", "stdlib.h"],
        return0: true,
        seq: [
          ["make_ints", "(", "4", ")"],
          ["free", "(", "a", ")"],
          ["=", "NULL"]
        ],
        calls: [["printf", "sum = %d"], ["printf", "a is NULL ? %d"]],
        require: { funcs: ["make_ints"], malloc: true, free: true, if: true, for: true, pointer: true },
        minStatements: 8,
        message: "需要自己定义 make_ints、在 main 里用 make_ints(4) 调用、free(a)、把指针置为 NULL，以及 sum = %d 与 a is NULL ? %d 两行打印。",
        ok: "申请、检查、使用、释放、置空五步齐全，这正是本关要养成的手感。"
      },
      solution: "#include <stdio.h>\n#include <stdlib.h>\n\n"
        + "int *make_ints(int n) {\n"
        + "    int *p = malloc((size_t)n * sizeof(int));\n"
        + "    int i;\n\n"
        + "    if (p == NULL) {\n"
        + "        return NULL;\n"
        + "    }\n"
        + "    for (i = 0; i < n; i++) {\n"
        + "        p[i] = i + 1;\n"
        + "    }\n"
        + "    return p;\n"
        + "}\n\n"
        + "int main(void) {\n"
        + "    int *a = make_ints(4);\n"
        + "    int i, sum = 0;\n\n"
        + "    if (a == NULL) {\n"
        + "        printf(\"out of memory\\n\");\n"
        + "        return 1;\n"
        + "    }\n"
        + "    for (i = 0; i < 4; i++) {\n"
        + "        sum += a[i];\n"
        + "    }\n"
        + "    printf(\"sum = %d\\n\", sum);\n\n"
        + "    free(a);\n"
        + "    a = NULL;\n"
        + "    printf(\"a is NULL ? %d\\n\", a == NULL);\n"
        + "    return 0;\n"
        + "}",
      mastery: [
        "能说出五类内存错误的成因，并在自己的代码里主动避开",
        "能解释 free 之后为什么必须自己置 NULL",
        "知道「返回堆内存」安全、「返回栈数组地址」危险",
        "写循环时能下意识检查边界是 < n 而不是 <= n"
      ]
    },
    {
      id: 41,
      title: "指针与 sizeof：数组、指针、传参退化",
      minutes: 18,
      gist: "分清 sizeof(数组) 与 sizeof(指针)，看懂函数参数里的 int arr[] 为什么骗人。",
      lesson: "sizeof 是编译期运算符（对可变长数组除外），它给出的是「这个类型或对象占多少字节」，返回类型是 size_t（无符号整数类型）。所以 printf 时通常先写成 (int)sizeof(...) 配 %d，或者直接用 %zu——把 size_t 丢给 %d 属于格式符不匹配，是常见的低级错误。\n"
        + "sizeof(数组) = 元素个数 × 单个元素大小。int a[6] 得到 24；char s[] = \"hello\" 得到 6（含结尾的 '\\0'）；数组作为 sizeof 的操作数时不会退化，这是「数组名会退化成指针」这条规则的重要例外。\n"
        + "sizeof(指针) 永远是一个地址的大小：在本机（64 位）是 8 字节，和它指向 int 还是 double 完全无关。所以 sizeof(p) 得到 8，sizeof(*p) 才等于它指向的类型大小。\n"
        + "关键在传参。函数参数写成 void f(int arr[])，看起来像数组，其实编译器把它当 int *arr——形参里的长度（哪怕写成 int arr[10]）会被完全忽略。所以函数内部 sizeof(arr) 是 8 而不是 40，元素个数必须另外传进来：void f(int arr[], int n)。\n"
        + "这就是为什么标准库函数总是要「指针 + 长度」成对出现，也是为什么在函数里用 sizeof(a) / sizeof(a[0]) 求元素个数会算错：在定义数组的那个作用域里它是 24/4 = 6，传进函数后就变成 8/4 = 2，结果毫无意义。\n"
        + "顺带记住三个数：sizeof(char) 永远是 1；sizeof 的结果是无符号的 size_t，做减法或比较时要小心符号问题；sizeof 不会真的执行它的操作数（可变长数组除外），写 sizeof(i++) 不会让 i 自增——不过没人会把有副作用的表达式放进 sizeof，知道即可。",
      example: {
        code: "#include <stdio.h>\n\n"
          + "void show(int arr[]) {          /* 形参里的 [] 等价于 int *arr，长度信息丢了 */\n"
          + "    printf(\"inside show: sizeof(arr) = %d\\n\", (int)sizeof(arr));\n"
          + "}\n\n"
          + "int main(void) {\n"
          + "    int a[6] = {1, 2, 3, 4, 5, 6};\n"
          + "    int *p = a;\n"
          + "    char s[] = \"hello\";\n"
          + "    char *q = s;\n\n"
          + "    printf(\"sizeof(a) = %d, elements = %d\\n\",\n"
          + "           (int)sizeof(a), (int)(sizeof(a) / sizeof(a[0])));\n"
          + "    printf(\"sizeof(p) = %d\\n\", (int)sizeof(p));\n"
          + "    show(a);\n"
          + "    printf(\"sizeof(s) = %d, sizeof(q) = %d\\n\", (int)sizeof(s), (int)sizeof(q));\n"
          + "    printf(\"sizeof(char) = %d, sizeof(int) = %d\\n\",\n"
          + "           (int)sizeof(char), (int)sizeof(int));\n"
          + "    return 0;\n"
          + "}",
        output: "sizeof(a) = 24, elements = 6\nsizeof(p) = 8\ninside show: sizeof(arr) = 8\nsizeof(s) = 6, sizeof(q) = 8\nsizeof(char) = 1, sizeof(int) = 4",
        explain: "第 13 行在 main 里算 sizeof(a)：a 是 int[6]，得到 24；除以 sizeof(a[0]) 得 6，这是元素个数。这里 a 没有退化，因为 sizeof 是那条规则的例外场合。"
          + "第 15 行 sizeof(p) 得 8：p 是指针，大小只和平台有关，和它指向什么无关。"
          + "第 16 行把数组传进 show，函数里的 arr 其实是指针，所以第 4 行打印出 8 而不是 24——同一个数组，换个位置 sizeof 就差了三倍。这也解释了为什么函数必须额外接收长度参数。"
          + "第 17 行对比 char s[] = \"hello\"（6 字节，含 '\\0'）与 char *q（8 字节指针）：一个带数据，一个只带地址。"
          + "最后一行给出两个基准值：sizeof(char) 永远是 1，本机 sizeof(int) 是 4。把这些数字记熟，读别人的代码时就能一眼看出 sizeof 用错没有。"
      },
      pitfalls: [
        "在函数里用 `sizeof(arr) / sizeof(arr[0])` 求元素个数 → 形参已退化成指针，算出 8 / 4 = 2 这种假答案；长度必须作为参数传进来。",
        "以为 `void f(int arr[10])` 里的 10 有意义 → 编译器完全忽略它，写成 int *arr 完全等价，函数里照样不知道长度。",
        "用 %d 打印 sizeof 的结果 → sizeof 返回 size_t（无符号），格式符不匹配可能告警或输出错误；先 (int) 转换，或用 %zu。",
        "把 sizeof(指针) 当成它指向数据的大小 → sizeof(p) 是 8（地址大小），sizeof(*p) 才是元素大小。",
        "以为 sizeof 里的表达式会被求值 → sizeof(i++) 不会让 i 自增（可变长数组例外），不要用 sizeof 去执行任何有副作用的代码。"
      ],
      takeaways: [
        "sizeof(数组) 是总字节数，sizeof(指针) 只是地址大小（本机 8）",
        "数组作为 sizeof 的操作数时不退化，这是「数组名退化」的例外",
        "数组一旦传参就退化成指针，元素个数必须另外传",
        "sizeof 返回 size_t，打印时用 (int) 转换或 %zu"
      ],
      questions: [
        {
          q: "在 main 里定义 `int a[10];`（本机 int 为 4 字节），sizeof(a) 是多少？",
          options: [
            "10，元素的个数",
            "40，10 个 int 的总字节数",
            "8，指针的大小",
            "4，一个 int 的大小"
          ],
          answer: 1,
          explain: "sizeof 给出的是对象占用的字节数：10 × 4 = 40，B 对。A 混淆了「个数」与「字节数」，个数要用 sizeof(a) / sizeof(a[0]) 算；C 是把数组当成指针（在这里 a 并没有退化）；D 是单个元素的大小。"
        },
        {
          q: "把同一个数组传给 `void f(int arr[])`，在函数里 sizeof(arr) 是多少？",
          options: [
            "8：形参里的 [] 等价于 int *，传进来的是指针，长度信息已经丢失",
            "40：和 main 里算出来的完全一样",
            "10：等于元素个数",
            "编译错误，函数里不允许对形参用 sizeof"
          ],
          answer: 0,
          explain: "数组作为实参传递时会退化成指向首元素的指针，形参 arr 就是 int *，所以 sizeof(arr) 得到指针大小 8，A 对。B 是把 main 里的结论直接搬了过来；C 把字节数和个数混在一起；D 说错了——sizeof 对形参完全合法，只是结果不是你想要的。"
        },
        {
          q: "为什么 `sizeof(a) / sizeof(a[0])` 在 main 里能算出元素个数，在函数里却算不对？",
          options: [
            "因为函数里的 sizeof 会被编译器优化掉",
            "因为数组传进函数时会被整体复制一份，大小变了",
            "因为数组作为实参传进去时会退化成指针，函数里 sizeof(形参) 得到的是指针大小，所以元素个数必须另外作为参数传进来",
            "因为函数里的 sizeof 一律返回 0"
          ],
          answer: 2,
          explain: "退化成指针之后，sizeof 拿到的是 8，用它去除以元素大小当然得不到个数，C 对。A、D 描述的「优化掉」「返回 0」都不存在；B 说错了——C 不会在传参时复制数组，只传地址。"
        }
      ],
      passRatio: 0.8,
      mission: "在 main 里定义 `int a[4] = {1, 2, 3, 4};` 与 `int *p = a;`：① 打印 `sizeof(a) = 16`；② 打印 `sizeof(a) / sizeof(a[0]) = 4`；③ 打印 `sizeof(p) = 8`。"
        + "再定义一个函数 `void report(int arr[], int n)`，在函数里用一条 printf 打印 `inside: sizeof(arr) = 8, n = 4`，并在 main 里调用 `report(a, 4);`。",
      starter: "#include <stdio.h>\n\n"
        + "void report(int arr[], int n) {\n"
        + "    /* TODO: 打印 inside: sizeof(arr) = %d, n = %d */\n"
        + "}\n\n"
        + "int main(void) {\n"
        + "    int a[4] = {1, 2, 3, 4};\n"
        + "    int *p = a;\n\n"
        + "    /* TODO: 三条 sizeof 的打印 */\n\n"
        + "    /* TODO: 调用 report(a, 4); */\n\n"
        + "    return 0;\n"
        + "}",
      hint: "sizeof 的结果是 size_t，一律先写成 (int)sizeof(...) 再配 %d。元素个数那行注意括号位置：(int)(sizeof(a) / sizeof(a[0]))。在 report 里你会看到 sizeof(arr) 变成 8——这不是 bug，而是数组形参退化成了指针，所以 n 必须单独传进来。",
      check: {
        include: ["stdio.h"],
        return0: true,
        seq: [
          ["int", "a", "[", "4", "]"],
          ["int", "*", "p", "=", "a"],
          ["sizeof", "(", "a", ")"],
          ["sizeof", "(", "p", ")"]
        ],
        calls: [
          ["printf", "sizeof(a) = %d"],
          ["printf", "sizeof(p) = %d"],
          ["report"]
        ],
        callCounts: [["printf", 3, 20]],
        require: { funcs: ["report"], pointer: true, array: true },
        minStatements: 8,
        message: "需要 int a[4]、int *p = a、sizeof(a) 与 sizeof(p) 的打印、自己定义的 report 函数、在 main 里调用 report(a, 4)，以及总共 4 条以上 printf（其中一条在 report 里打印 inside: sizeof(arr) = %d, n = %d）。",
        ok: "sizeof 的三种口径（数组、指针、形参退化）都验证到了，结构完全正确。"
      },
      solution: "#include <stdio.h>\n\n"
        + "void report(int arr[], int n) {\n"
        + "    printf(\"inside: sizeof(arr) = %d, n = %d\\n\", (int)sizeof(arr), n);\n"
        + "}\n\n"
        + "int main(void) {\n"
        + "    int a[4] = {1, 2, 3, 4};\n"
        + "    int *p = a;\n\n"
        + "    printf(\"sizeof(a) = %d\\n\", (int)sizeof(a));\n"
        + "    printf(\"sizeof(a) / sizeof(a[0]) = %d\\n\", (int)(sizeof(a) / sizeof(a[0])));\n"
        + "    printf(\"sizeof(p) = %d\\n\", (int)sizeof(p));\n"
        + "    report(a, 4);\n"
        + "    return 0;\n"
        + "}",
      mastery: [
        "能准确说出 sizeof(数组)、sizeof(指针)、sizeof(*指针) 各是多少",
        "能解释数组形参为什么会退化成指针，以及长度该怎么传",
        "知道 sizeof 返回 size_t，并能正确选择格式符"
      ]
    },
    {
      id: 42,
      title: "指针综合：手写动态数组与字符串复制",
      minutes: 30,
      gist: "把指针、realloc 扩容、指针参数与字符串复制合成一个能跑的小工具：动态数组 + my_strcpy。",
      lesson: "这一关把前面九关的东西拼成一个真实的小工具：一个能自动扩容的动态数组，加上一个自己实现的字符串复制函数。写完它，你对指针和内存的理解就成体系了。\n"
        + "动态数组的核心是「长度与容量分离」。count 表示当前存了几个元素，capacity 表示已经申请了几个位置。只有当 count == capacity（装满了）时才需要扩容：申请一块更大的内存，把数据搬过去。这样绝大多数 push 都不需要申请内存，效率很高。\n"
        + "扩容用 realloc(arr, new_cap * sizeof(int))。它可能原地扩展，也可能搬到新地址——所以函数必须把新的首地址返回给调用者，调用者必须用返回值更新自己的指针，否则就会拿着已经失效的旧地址继续用。\n"
        + "realloc 的失败处理是这一关的重点：失败时返回 NULL，而原来的内存仍然有效。所以函数里要写 int *tmp = realloc(...); if (tmp == NULL) return NULL;，绝不能写 arr = realloc(arr, ...)。调用者拿到 NULL 时，用原来的指针 free 掉再退出——「谁申请谁释放」的链条不能断。\n"
        + "为什么 push 的参数里有 int *count 和 int *capacity？因为函数要修改调用者的这两个变量、让调用者看到「现在存了几个」。这正是第 35 关的结论：C 按值传递，要改外面的变量就传地址，函数里写 (*count)++。注意括号——*count++ 的含义完全不同。\n"
        + "字符串复制 my_strcpy 用指针逐字符搬运：char *start = dest; 先记住起点，然后 while (*src != '\\0') { *dest = *src; dest++; src++; }，循环结束补上 *dest = '\\0';，最后 return start;。返回起点是为了对齐标准库 strcpy 的约定，也方便写成链式调用。\n"
        + "两个必须由调用者负责的地方：dest 必须有足够的空间（C 不会替你检查，写越界就是未定义行为）；src 必须以 '\\0' 结尾。把这两条写进函数文档或注释里，就是 C 代码里最常见的「契约」。",
      example: {
        code: "#include <stdio.h>\n#include <stdlib.h>\n\n"
          + "/* 往动态数组末尾追加一个值；容量不够就翻倍。返回新的首地址（可能变了） */\n"
          + "int *push(int *arr, int *count, int *capacity, int value) {\n"
          + "    if (*count == *capacity) {\n"
          + "        int new_cap = (*capacity == 0) ? 2 : *capacity * 2;\n"
          + "        int *tmp = realloc(arr, (size_t)new_cap * sizeof(int));\n"
          + "        if (tmp == NULL) {\n"
          + "            return NULL;             /* 失败时原数组仍然有效，交给调用者处理 */\n"
          + "        }\n"
          + "        arr = tmp;\n"
          + "        *capacity = new_cap;\n"
          + "    }\n"
          + "    arr[*count] = value;\n"
          + "    (*count)++;\n"
          + "    return arr;\n"
          + "}\n\n"
          + "int main(void) {\n"
          + "    int *data = NULL;                /* 空数组：还没有申请任何内存 */\n"
          + "    int count = 0, capacity = 0;\n"
          + "    int i;\n\n"
          + "    for (i = 1; i <= 5; i++) {\n"
          + "        int *next = push(data, &count, &capacity, i * 10);\n"
          + "        if (next == NULL) {\n"
          + "            printf(\"out of memory\\n\");\n"
          + "            free(data);\n"
          + "            return 1;\n"
          + "        }\n"
          + "        data = next;\n"
          + "    }\n\n"
          + "    printf(\"count = %d, capacity = %d\\n\", count, capacity);\n"
          + "    printf(\"values:\");\n"
          + "    for (i = 0; i < count; i++) {\n"
          + "        printf(\" %d\", data[i]);\n"
          + "    }\n"
          + "    printf(\"\\n\");\n\n"
          + "    free(data);\n"
          + "    data = NULL;\n"
          + "    return 0;\n"
          + "}",
        output: "count = 5, capacity = 8\nvalues: 10 20 30 40 50",
        explain: "第 6 行是扩容的触发条件：只有装满了（count == capacity）才申请更大的空间。第 7 行的策略是「空数组先给 2，之后每次翻倍」，翻倍能让均摊到每个元素上的搬运成本保持常数级。"
          + "第 8 到第 13 行是 realloc 的标准姿势：先用 tmp 接住返回值，判断不为 NULL 后再赋回 arr 并更新 capacity。这样即使失败，原来的 arr 依然可用。"
          + "第 15、16 行把新值放到末尾，并让调用者的 count 加一。参数是 int *count，所以必须写 (*count)++ ——括号不能省，否则含义会完全变掉。"
          + "main 里维护三个变量：数据指针 data、个数 count、容量 capacity。每轮 push 都用 next 接返回值再判断：这是「realloc 可能搬家」的必然要求，直接忽略返回值就会用上失效地址。"
          + "最后打印时 capacity 是 8 而 count 是 5：容量通常大于个数，这是动态数组的正常状态，多出来的空间留给下一次追加。释放仍然只有一次 free(data)。"
      },
      pitfalls: [
        "在 push 里写 `arr = realloc(arr, ...)` 并直接继续用 → 失败时原地址丢失，内存泄漏且无法回滚；必须用临时指针接住、判断后再赋回。",
        "调用者忽略返回值：`push(data, &count, &capacity, v);` → realloc 搬家后 data 仍是旧地址，继续访问就是悬空指针，属于未定义行为。",
        "把 `(*count)++` 写成 `*count++` → 由于优先级，这等价于 `*(count++)`，改的是指针而不是它指向的计数变量，编译器可能只给个警告，运行时计数全乱。",
        "忘了 `arr = NULL; count = 0; capacity = 0;` 这套初始状态 → 用未初始化的指针当空数组去 realloc，行为不可预测；空数组必须是「指针为 NULL、容量为 0」。",
        "my_strcpy 忘了在末尾补 `*dest = '\\0';` → 复制出来的字符数组不是字符串，用 %s 打印会一直往后读，输出乱码甚至崩溃。",
        "目标缓冲区不够大：C 不会检查 dest 的容量，越界写是未定义行为；调用者必须保证有 strlen(src) + 1 个字节。"
      ],
      takeaways: [
        "动态数组用 count 与 capacity 分离管理，满了才按翻倍策略扩容",
        "realloc 可能改变首地址：函数要返回新地址，调用者必须用返回值更新指针",
        "realloc 失败时原内存仍然有效，必须用临时指针接返回值",
        "my_strcpy 逐字符复制、末尾补 '\\0'、返回起点；缓冲区大小由调用者负责"
      ],
      questions: [
        {
          q: "push 函数里为什么必须写 `int *tmp = realloc(arr, ...);` 而不是直接 `arr = realloc(arr, ...);`？",
          options: [
            "因为 realloc 的返回值必须强转类型，所以要中转一次",
            "因为 realloc 会把原有数据清零，先存一份更安全",
            "因为 realloc 不能在函数内部调用",
            "因为 realloc 失败时返回 NULL 而原内存仍然有效，直接赋给 arr 会丢掉原来的地址，造成内存泄漏"
          ],
          answer: 3,
          explain: "这正是 realloc 的失败语义决定的，D 对。A 说错了——realloc 返回 void *，在 C 里赋给 int * 不需要强转；B 也不对，realloc 会保留原有内容（新扩展的区域才未初始化）；C 更是没有这个限制。"
        },
        {
          q: "`(*count)++` 与 `*count++` 的区别是？",
          options: [
            "两者完全等价，括号只是好看",
            "前者让 count 指向的变量加一，后者先解引用再自增，效果相同",
            "前者是把 count 指向的那个变量加一；后者因为优先级等价于 *(count++)，移动的是指针而不是计数变量的值",
            "后者是语法错误，编译不通过"
          ],
          answer: 2,
          explain: "后缀 ++ 的优先级高于解引用，所以 *count++ 是「先取 count++ 的值再解引用」，动的是指针；要改指针指向的变量必须写 (*count)++，C 对。A、B 都以为两者一样；D 说错了——它能编译，只是语义不是你要的，编译器往往不会报警。"
        },
        {
          q: "调用 push 时忽略返回值，写成 `push(data, &count, &capacity, v);`，可能出什么问题？",
          options: [
            "扩容时 realloc 可能把数据搬到新地址，data 仍指向已被释放的旧地址，继续使用就是悬空指针",
            "没有新问题：push 内部已经保证把新地址写回 data 了",
            "编译一定失败，因为 push 有返回值没有被使用",
            "count 和 capacity 不会被更新，程序会重复申请内存"
          ],
          answer: 0,
          explain: "C 是值传递：push 拿到的是 data 的一份副本，它没法修改调用者的 data，只能靠返回值把新地址交回来，A 对。B 是常见误解；C 说错了——忽略返回值通常只是编译警告，程序照样能编出来；D 也不对，count 与 capacity 是通过 int * 传地址改的，与是否使用返回值无关。"
        }
      ],
      passRatio: 0.8,
      mission: "本关把动态数组与字符串复制一次写完。① 定义 `int *push(int *arr, int *count, int *capacity, int value)`：装满时按「容量 0 取 2、否则翻倍」扩容，用临时指针接 `realloc` 的返回值（失败返回 NULL），成功后更新 `*capacity`，再写入 `arr[*count]` 并让 `*count` 加一，返回数组首地址。② 定义 `char *my_strcpy(char *dest, const char *src)`：用指针逐字符复制，末尾补 `'\\0'`，返回 dest 的起始地址，不许用 strcpy。"
        + "③ 在 main 里：用 `int *data = NULL; int count = 0, capacity = 0;` 作为空数组的初始状态；用 for 循环把 1 到 6 的平方依次 push 进去（每轮用 `int *next` 接返回值，NULL 就 free 后退出）；打印 `count = 6, capacity = 8` 和 `values: 1 4 9 16 25 36`；再用 `char buf[32];` 与 `my_strcpy(buf, \"pointers\")` 复制出字符串并打印 `buf = pointers`；最后 `free(data);` 并把指针置为 NULL。",
      starter: "#include <stdio.h>\n#include <stdlib.h>\n\n"
        + "char *my_strcpy(char *dest, const char *src) {\n"
        + "    /* TODO: 记住起点、逐字符复制、补 '\\0'、返回起点 */\n"
        + "}\n\n"
        + "int *push(int *arr, int *count, int *capacity, int value) {\n"
        + "    /* TODO: 满了就翻倍扩容（临时指针接 realloc），再追加 */\n"
        + "}\n\n"
        + "int main(void) {\n"
        + "    int *data = NULL;\n"
        + "    int count = 0, capacity = 0;\n"
        + "    char buf[32];\n"
        + "    int i;\n\n"
        + "    /* TODO: 循环 push 1..6 的平方，用 next 接返回值 */\n\n"
        + "    /* TODO: 打印 count/capacity 与 values */\n\n"
        + "    /* TODO: my_strcpy(buf, \"pointers\") 并打印 buf */\n\n"
        + "    /* TODO: free(data); data = NULL; */\n\n"
        + "    return 0;\n"
        + "}",
      hint: "push 里先判断 if (*count == *capacity)，再算 int new_cap = (*capacity == 0) ? 2 : *capacity * 2;，然后用 tmp 接 realloc；注意 (*count)++ 的括号。my_strcpy 先写 char *start = dest;，循环 while (*src != '\\0') 里 *dest++ = *src++;，循环后 *dest = '\\0';，最后 return start;。main 里每次 push 都要 data = next; 才不会丢地址。",
      check: {
        include: ["stdio.h", "stdlib.h"],
        return0: true,
        seq: [
          ["push", "(", "data", ",", "&", "count"],
          ["my_strcpy", "(", "buf"],
          ["free", "(", "data", ")"],
          ["=", "NULL"]
        ],
        calls: [
          ["printf", "count = %d, capacity = %d"],
          ["printf", "values:"],
          ["printf", "buf = %s"]
        ],
        forbid: ["strcpy"],
        require: { funcs: ["push", "my_strcpy"], malloc: true, free: true, pointer: true, for: true, if: true },
        minStatements: 12,
        message: "需要自己定义的 push 与 my_strcpy（不能用 strcpy）、main 里的 push(data, &count, ...) 调用、free(data) 与置 NULL，以及三行指定格式的打印。",
        ok: "动态数组的扩容、指针参数的写回、字符串复制与内存释放全部到位，指针这一章可以出师了。"
      },
      expectedOutput: "count = 6, capacity = 8\nvalues: 1 4 9 16 25 36\nbuf = pointers",
      solution: "#include <stdio.h>\n#include <stdlib.h>\n\n"
        + "char *my_strcpy(char *dest, const char *src) {\n"
        + "    char *start = dest;\n"
        + "    while (*src != '\\0') {\n"
        + "        *dest = *src;\n"
        + "        dest++;\n"
        + "        src++;\n"
        + "    }\n"
        + "    *dest = '\\0';\n"
        + "    return start;\n"
        + "}\n\n"
        + "int *push(int *arr, int *count, int *capacity, int value) {\n"
        + "    if (*count == *capacity) {\n"
        + "        int new_cap = (*capacity == 0) ? 2 : *capacity * 2;\n"
        + "        int *tmp = realloc(arr, (size_t)new_cap * sizeof(int));\n"
        + "        if (tmp == NULL) {\n"
        + "            return NULL;\n"
        + "        }\n"
        + "        arr = tmp;\n"
        + "        *capacity = new_cap;\n"
        + "    }\n"
        + "    arr[*count] = value;\n"
        + "    (*count)++;\n"
        + "    return arr;\n"
        + "}\n\n"
        + "int main(void) {\n"
        + "    int *data = NULL;\n"
        + "    int count = 0, capacity = 0;\n"
        + "    char buf[32];\n"
        + "    int i;\n\n"
        + "    for (i = 1; i <= 6; i++) {\n"
        + "        int *next = push(data, &count, &capacity, i * i);\n"
        + "        if (next == NULL) {\n"
        + "            printf(\"out of memory\\n\");\n"
        + "            free(data);\n"
        + "            return 1;\n"
        + "        }\n"
        + "        data = next;\n"
        + "    }\n\n"
        + "    printf(\"count = %d, capacity = %d\\n\", count, capacity);\n"
        + "    printf(\"values:\");\n"
        + "    for (i = 0; i < count; i++) {\n"
        + "        printf(\" %d\", data[i]);\n"
        + "    }\n"
        + "    printf(\"\\n\");\n\n"
        + "    my_strcpy(buf, \"pointers\");\n"
        + "    printf(\"buf = %s\\n\", buf);\n\n"
        + "    free(data);\n"
        + "    data = NULL;\n"
        + "    return 0;\n"
        + "}",
      mastery: [
        "能独立实现一个会翻倍扩容的动态数组，并解释 count 与 capacity 的分工",
        "能在 realloc 的两种结果（搬家、失败）下都写出正确的代码",
        "能手写字符串复制函数，说明为什么末尾要补 '\\0'、为什么要返回起点",
        "能说清「谁申请谁释放」和「缓冲区大小由调用者负责」这两条 C 的契约"
      ]
    }
  ]
});