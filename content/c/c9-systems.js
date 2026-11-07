/* ============================================================================
 * HT Lab · C 语言课程 · 模块 9 · 系统与底层
 * 关卡 id：75–80（本文件由模块作者维护）
 * 每关示例代码与标准答案都必须真实编译运行通过，output 字段为真实输出。
 * 输出刻意不含地址、时间、随机数与编译器版本，保证可复现。
 * ==========================================================================*/
window.C_MODULES = window.C_MODULES || [];
window.C_MODULES.push({
  id: "c9",
  name: "模块 9 · 系统与底层",
  levels: [
    {
      id: 75,
      title: "内存布局：栈、堆、全局/静态区、常量区",
      minutes: 18,
      gist: "同一个程序的变量住在四个不同的区域，生命周期各不相同；看懂它们，就明白为什么不能返回局部变量的地址。",
      lesson: "程序运行时，内存不是一大片没有区别的空间。操作系统和编译器把它分成用途不同的几块：栈（stack）、堆（heap）、全局/静态区、常量区，再加上存放机器指令的代码区。知道一个变量住在哪里，就能知道它什么时候生、什么时候死。\n"
        + "栈区存放函数里的普通局部变量和函数参数。每调用一次函数，就在栈顶压入一帧（返回地址、参数、局部变量），函数返回时整帧弹出。所以局部变量的生命周期只有「这次调用」这么长：下一次调用会重新创建，值不会保留。栈的容量有限（本机默认约 2 MB），在函数里定义巨大的数组就可能栈溢出。本机 x86-64 的栈向低地址方向生长——越往里调用，栈顶地址越小；这是 ABI 的约定，不要把它写进依赖优化的代码里。\n"
        + "堆区由 malloc / calloc / realloc 申请，用 free 释放。堆内存的生命周期由你决定：从申请成功那一刻起，到你 free 为止，不会因为函数返回而消失。所以想把数据「带出」函数，堆是最常用的办法；代价是要自己管理——忘记 free 就是内存泄漏，free 之后再用就是悬空指针。\n"
        + "全局区和静态区存放全局变量、文件作用域的 static 变量、函数里的 static 局部变量。它们的存储期（storage duration）是静态的：程序启动时就存在，程序结束时才消失。这个区又分两块：写了非零初值的放数据段，没写初值（或初值为 0）的放 BSS 段，由系统在启动时清零。这解释了一个常见现象：全局变量不写初值也是 0，而普通局部变量不写初值就是垃圾值。\n"
        + "常量区（通常和代码段一起被设为只读）存放字符串字面量，以及 const 修饰的静态对象。它同样有静态存储期，但内容只读：试图修改字面量是未定义行为。还要注意「指针住在哪」和「它指向的东西住在哪」是两件事——static const char *name = \"HT Lab\"; 里，指针 name 在全局区，字符数组 \"HT Lab\" 在只读区。\n"
        + "本关最重要的结论是：函数返回时它的局部变量已经被销毁，所以「返回局部变量地址」是错的。int *broken(void) { int local = 42; return &local; } 编译时通常只给一句 warning: function returns address of local variable，运行时那个地址也许还能读出 42，但它指向的对象已经不存在了，使用它就是未定义行为（第 77 关会系统讲）。正确的替代写法有三条：返回静态存储期对象的地址、让调用者传入缓冲区、或者用 malloc 申请堆内存（并约定谁来 free）。\n"
        + "这一关不打印地址，而是用比较结果的 0 或 1 来表达相对关系——地址本身每次运行都可能不同，不可复现；而「同一个数组里后面的元素地址更大」「两个不同的对象地址一定不同」这类关系是标准保证的，任何机器上都成立。\n"
        + "读别人的代码时：看到函数返回指针，先问「它指向的东西是谁分配的、能活多久」；看到 static 局部变量，就知道作者在利用它「跨调用保持」；看到函数里定义了大数组，就要留意栈溢出的风险。",
      example: {
        code: "#include <stdio.h>\n"
          + "#include <stdlib.h>\n\n"
          + "int g_total = 0;                       /* 全局区：整个程序运行期间都存在 */\n"
          + "static int s_total = 0;                /* 静态区：生命周期同样贯穿整个程序 */\n"
          + "static const char *g_name = \"HT Lab\";  /* 指针在全局区，字面量在只读常量区 */\n\n"
          + "struct Sample {                        /* 结构体成员按声明顺序排列 */\n"
          + "    char tag;\n"
          + "    int value;\n"
          + "};\n\n"
          + "static int g_kept = 42;\n\n"
          + "/* 安全做法：返回静态存储期对象的地址，它在程序结束前一直有效 */\n"
          + "static int *ok_address(void) {\n"
          + "    return &g_kept;\n"
          + "}\n\n"
          + "/* 错误做法（只作为反例，不要运行）：\n"
          + "   int *broken(void) { int local = 42; return &local; }\n"
          + "   函数返回时 local 的生命周期就结束了，这个地址成了悬空指针。 */\n\n"
          + "static void tick(void) {\n"
          + "    int local = 0;         /* 栈：每次进入函数都重新创建 */\n"
          + "    static int kept = 0;   /* 静态区：只初始化一次，跨调用保留值 */\n"
          + "    local++;\n"
          + "    kept++;\n"
          + "    g_total++;\n"
          + "    s_total++;\n"
          + "    printf(\"call%d: local = %d, kept = %d\\n\", g_total, local, kept);\n"
          + "}\n\n"
          + "int main(void) {\n"
          + "    int arr[4] = {10, 20, 30, 40};\n"
          + "    struct Sample s = {'A', 7};\n"
          + "    int i;\n"
          + "    int here = 0;\n"
          + "    int *heap_block = NULL;\n"
          + "    int *safe = ok_address();\n"
          + "    int *safe_again = ok_address();\n\n"
          + "    for (i = 0; i < 3; i++) {\n"
          + "        tick();\n"
          + "    }\n"
          + "    printf(\"g_total = %d, s_total = %d\\n\", g_total, s_total);\n"
          + "    printf(\"name (constant area) = %s\\n\", g_name);\n"
          + "    printf(\"*safe = %d, same address twice = %d\\n\", *safe, safe == safe_again);\n\n"
          + "    /* 同一个数组内部的地址关系是标准保证的，开优化也不会变 */\n"
          + "    printf(\"array step in bytes = %d\\n\",\n"
          + "           (int)((char *)&arr[1] - (char *)&arr[0]));\n"
          + "    printf(\"later element has larger address = %d\\n\", &arr[3] > &arr[0]);\n"
          + "    printf(\"members keep declaration order = %d\\n\",\n"
          + "           (const unsigned char *)&s.value > (const unsigned char *)&s.tag);\n\n"
          + "    heap_block = (int *)malloc(sizeof(int) * 4);\n"
          + "    if (heap_block == NULL) {\n"
          + "        printf(\"malloc failed\\n\");\n"
          + "        return 1;\n"
          + "    }\n"
          + "    heap_block[0] = 7;\n"
          + "    printf(\"heap[0] = %d\\n\", heap_block[0]);\n"
          + "    printf(\"heap object differs from stack object = %d\\n\", heap_block != &here);\n"
          + "    free(heap_block);\n"
          + "    return 0;\n"
          + "}",
        output: "call1: local = 1, kept = 1\ncall2: local = 1, kept = 2\ncall3: local = 1, kept = 3\ng_total = 3, s_total = 3\nname (constant area) = HT Lab\n*safe = 42, same address twice = 1\narray step in bytes = 4\nlater element has larger address = 1\nmembers keep declaration order = 1\nheap[0] = 7\nheap object differs from stack object = 1",
        explain: "第 4 到 6 行是三种不同存储期的对象：int g_total 在全局区，static int s_total 在静态区，两者都贯穿整个程序；static const char *g_name 这个指针住在全局区，而它指向的 \"HT Lab\" 放在只读常量区。"
          + "第 8 到 11 行的 struct 用来说明「成员按声明顺序排列」：tag 在前、value 在后，这也是后面比较的依据。"
          + "第 16 到 18 行的 ok_address 返回静态变量 g_kept 的地址——它活到程序结束，所以这样返回是安全的；注释里同时给出了错误写法 broken，那个函数的 local 在返回时就销毁了。"
          + "第 24 到 32 行的 tick 是本关的核心对照：local 是普通局部变量，每次进入函数都重新创建，所以三次调用打印的都是 local = 1；kept 前面加了 static，只初始化一次，于是依次变成 1、2、3。"
          + "第 46 行打印两个计数器：全局的 g_total 和静态的 s_total 都是 3，说明它们确实跨调用累加。"
          + "第 40、41 行连续调用两次 ok_address，第 48 行打印的两个指针相等（1），因为返回的始终是同一个静态对象的地址。"
          + "第 50 到 55 行用 0/1 表达地址关系：相邻 int 元素相差 4 字节（array step in bytes = 4），同一个数组里下标大的元素地址更大（1），结构体成员保持声明顺序（1）。其中「同一数组内下标越大地址越大」是标准保证的；而比较两个不同结构体成员的地址，严格说 C 标准并不保护结果（标准只对同一数组内的指针关系作保证），只是绝大多数编译器的实际布局会按声明顺序排列——所以了解它、但真实代码不要依赖这个比较。"
          + "第 57 到 65 行演示堆：malloc 申请 16 字节，检查返回值，写入并读出 7；堆上的对象和栈上的对象地址一定不同（打印 1），最后 free 掉，做到「申请了就要释放」。"
      },
      pitfalls: [
        "返回局部变量的地址：`int *broken(void) { int local = 42; return &local; }` —— 函数返回后 local 的存储已经回收，这个指针是悬空的；编译器通常只给一句 warning: function returns address of local variable，别把它当成「能用」。",
        "忘记 free：malloc 申请的内存不会随函数返回自动回收，每申请一次都要有对应的 free，否则就是内存泄漏。",
        "free 之后继续用（use after free）：`free(p); printf(\"%d\", *p);` 是未定义行为，此刻还能读到旧值只是运气。",
        "以为局部变量也会自动清零：只有全局变量和 static 变量由系统清零；`int sum; sum += 1;` 加的是内存里的垃圾值。",
        "把大数组定义在函数里：本机栈默认约 2 MB，`int buf[1000000];`（4 MB）一进函数就可能栈溢出；大缓冲区应该用 malloc。",
        "试图修改字符串字面量：`char *s = \"abc\"; s[0] = 'A';` 多数平台上直接崩溃（只读页）；要改就自己开数组 `char s[] = \"abc\";`。"
      ],
      takeaways: [
        "栈放局部变量，随函数返回销毁；堆由 malloc / free 管理，生命周期自己掌握",
        "全局变量和 static 变量在程序启动时就存在、结束时才消失，而且默认清零",
        "字符串字面量在只读区，修改它是未定义行为；指针本身和它指向的内容可以住在不同区",
        "不要返回局部变量的地址：可以返回 static 对象的地址、让调用者传缓冲区，或用 malloc",
        "地址本身不可复现，但「同一数组内后面的元素地址更大」「不同对象地址不同」是标准保证的"
      ],
      questions: [
        {
          q: "下面这个函数的问题是什么？\nint *broken(void) { int local = 42; return &local; }",
          options: [
            "没有问题，返回的指针指向 42",
            "local 的存储期在函数返回时结束，这个指针悬空，使用它是未定义行为",
            "编译一定失败，函数不能返回指针",
            "应该把 local 改成 double 才能返回"
          ],
          answer: 1,
          explain: "局部变量是自动存储期，函数返回时它所在的栈帧就被回收，指针指向的对象已经不存在（悬空指针），之后读写都是未定义行为，所以 B 对。A 描述的是危险的巧合：那块内存可能一时还没被覆盖，看起来「能跑」。C 错：编译器通常只给一句 warning: function returns address of local variable，仍然会生成可执行文件。D 与问题无关：换类型并不改变存储期。"
        },
        {
          q: "函数里写 static int kept = 0;，连续调用该函数三次，kept 会怎样变化？",
          options: [
            "每次都是 0，局部变量每次重新创建",
            "编译错误：static 不能写在函数内部",
            "第一次是 0，第二次被重新初始化成 0",
            "依次变成 1、2、3：static 局部变量只初始化一次，值跨调用保留"
          ],
          answer: 3,
          explain: "static 局部变量有静态存储期：声明时的初始化只做一次，之后每次调用都沿用上次的值，所以三次调用后 kept 是 1、2、3，D 对。A、C 描述的是普通自动局部变量的行为。B 错：static 用在函数内部完全合法，此时改变的是存储期而不是作用域——名字仍然只在这个函数里可见。"
        },
        {
          q: "关于本机程序各内存区域，说法正确的是？",
          options: [
            "malloc 得到的内存属于栈区，函数返回时会自动回收",
            "字符串字面量放在栈上，可以随意修改",
            "全局变量和 static 变量的存储期贯穿整个程序运行期间",
            "局部变量不占内存，编译器都把它们放在寄存器里"
          ],
          answer: 2,
          explain: "全局变量和 static 变量有静态存储期：程序启动时分配、结束时回收，所以 C 对。A 错：malloc 给的是堆内存，必须自己 free，函数返回不会回收它（这正是内存泄漏的来源）。B 错：字面量通常在只读区，改它是未定义行为，常见表现是程序崩溃。D 错：局部变量在栈上有存储空间，编译器有时会把值放进寄存器，但只要你取它的地址，就必须有真实内存。"
        }
      ],
      passRatio: 0.8,
      mission: "写一个完整的 C 程序，观察普通局部变量和 static 局部变量的寿命：\n"
        + "1) 在所有函数之外定义全局变量 int visits = 0;\n"
        + "2) 定义函数 void touch(void)：里面声明普通局部变量 int local = 0; 和静态局部变量 static int kept = 0;，三个变量各加 1，然后打印一行\n"
        + "touch: local = %d, kept = %d, visits = %d\n"
        + "3) 在 main 里用 for 循环调用 touch() 三次，输出必须是：\n"
        + "touch: local = 1, kept = 1, visits = 1\n"
        + "touch: local = 1, kept = 2, visits = 2\n"
        + "touch: local = 1, kept = 3, visits = 3\n"
        + "4) 在 main 里定义 int arr[3] = {5, 6, 7};，再打印两行地址关系（结果只能是 0 或 1）：\n"
        + "array step in bytes = 4\n"
        + "later element has larger address = 1\n"
        + "第一行用 printf 的参数 (int)((char *)&arr[1] - (char *)&arr[0]) 得到相邻元素之间的字节数；第二行用 &arr[2] > &arr[0] 比较同一个数组里两个元素的地址。\n"
        + "5) 最后 return 0;。\n"
        + "在本机编译运行，确认五行输出与上面一致。",
      starter: "#include <stdio.h>\n\n"
        + "int visits = 0;   /* 全局变量：所有函数都看得见 */\n\n"
        + "/* 在这里写 void touch(void)：普通局部变量 + static 局部变量 + 三个计数器各加 1 */\n\n"
        + "int main(void) {\n"
        + "    int arr[3] = {5, 6, 7};\n"
        + "    int i;\n\n"
        + "    /* 用 for 循环调用 touch() 三次 */\n\n"
        + "    /* 打印 array step in bytes = ... 和 later element has larger address = ... */\n\n"
        + "    return 0;\n"
        + "}",
      hint: "touch() 里只做三件事：三个变量各加 1，然后一次 printf。kept 前面加 static，它就从「每次重新创建」变成「只初始化一次、跨调用保留」；visits 是全局变量，函数里直接改就行。数组那两行不要打印地址本身：相邻元素的字节距离是 (char *)&arr[1] - (char *)&arr[0]，地址大小关系直接比较两个元素的地址。",
      check: {
        include: ["stdio.h"],
        return0: true,
        require: { for: true, funcs: ["touch"] },
        seq: [["touch", "(", ")"], ["&", "arr"]],
        calls: [["printf", "array step"], ["printf", "later element"]],
        minStatements: 8,
        message: "需要 #include <stdio.h>、全局变量 int visits、自己定义的 touch()（内含普通局部变量和 static 局部变量）、main 里用 for 调用 touch()，以及输出 array step in bytes / later element has larger address 两行，最后 return 0; 。",
        ok: "全局变量、static 局部变量和同一数组内的地址关系都写对了，结构完整。"
      },
      expectedOutput: "touch: local = 1, kept = 1, visits = 1\ntouch: local = 1, kept = 2, visits = 2\ntouch: local = 1, kept = 3, visits = 3\narray step in bytes = 4\nlater element has larger address = 1",
      solution: "#include <stdio.h>\n\n"
        + "int visits = 0;   /* 全局区：所有函数都能看到，生命周期贯穿整个程序 */\n\n"
        + "static void touch(void) {\n"
        + "    int local = 0;        /* 栈：每次调用都从 0 开始 */\n"
        + "    static int kept = 0;  /* 静态区：只初始化一次，值跨调用保留 */\n"
        + "    local++;\n"
        + "    kept++;\n"
        + "    visits++;\n"
        + "    printf(\"touch: local = %d, kept = %d, visits = %d\\n\", local, kept, visits);\n"
        + "}\n\n"
        + "int main(void) {\n"
        + "    int arr[3] = {5, 6, 7};\n"
        + "    int i;\n\n"
        + "    for (i = 0; i < 3; i++) {\n"
        + "        touch();\n"
        + "    }\n\n"
        + "    /* 同一个数组里元素是紧挨着的，而且下标越大地址越大 */\n"
        + "    printf(\"array step in bytes = %d\\n\",\n"
        + "           (int)((char *)&arr[1] - (char *)&arr[0]));\n"
        + "    printf(\"later element has larger address = %d\\n\", &arr[2] > &arr[0]);\n"
        + "    return 0;\n"
        + "}",
      mastery: [
        "能说出栈、堆、全局/静态区、常量区各存放什么，以及它们的生命周期",
        "能解释为什么返回局部变量的地址是错的，并给出三种正确的替代写法",
        "看到 static 局部变量能说出它「只初始化一次、跨调用保持」的效果",
        "能用 0/1 表达地址之间的相对关系，而不是打印不可复现的地址"
      ]
    },
    {
      id: 76,
      title: "位运算与掩码：从二进制位看数据",
      minutes: 20,
      gist: "用 & | ^ ~ << >> 精确控制每一个二进制位，再用 unsigned char * 亲手测出本机的字节序。",
      lesson: "位运算符有六个：&（按位与）、|（按位或）、^（按位异或）、~（按位取反）、<<（左移）、>>（右移）。它们对操作数的每一位独立运算，不产生进位，所以叫「按位运算」。\n"
        + "最常用的套路是掩码（mask）。取第 n 位用「右移再与 1」：(x >> n) & 1u。置位用或：x |= 1u << n。清位要先造一个「只有那一位是 0、其它位都是 1」的掩码，再按位与：x &= ~(1u << n)。翻位用异或：x ^= 1u << n。这四个动作——取位、置位、清位、翻位——是权限标志、协议解析、嵌入式寄存器操作里最常见的写法。\n"
        + "要取出连续的一段（一个字段），思路是「先右移到最低位，再与上这段的掩码」：例如 (x >> 8) & 0xFFu 取的是第二个字节。掩码的构造要小心符号：1u << 31 在 unsigned int 里合法，但写成 1 << 31 在有符号 int 上就是未定义行为。所以位运算一律用无符号类型并加 u 后缀，这是最简单也最有效的防御。\n"
        + "右移分两种：无符号数的 >> 是逻辑右移，空出的高位补 0；有符号负数的 >> 究竟是算术右移还是逻辑右移由实现决定，所以不要对有符号负数做右移。左移则要保证移出的位没有超出类型宽度——把 1 移出类型宽度（例如 1u << 32）是未定义行为。\n"
        + "几个实战技巧：x & 1 判断奇偶；x & (x - 1) 会清掉最低位的那个 1，所以 x != 0 && (x & (x - 1)) == 0 就是「x 是 2 的幂」；而 while (x) { x &= x - 1; count++; } 的循环次数正好等于 x 里 1 的个数。\n"
        + "接下来是大小端（endianness）。一个多字节整数在内存里按字节排列：小端（little-endian）把低位字节放在低地址，大端（big-endian）反过来。本机 x86-64 是小端，所以 unsigned short 的 0x0102 在内存里是 02 01。\n"
        + "怎么在代码里测？C 标准允许用字符类型（char、unsigned char、signed char）去查看任何对象的字节表示，这是被明确允许的「类型双关」。所以写 unsigned int one = 1u; unsigned char *p = (unsigned char *)&one;，如果 p[0] 等于 1，说明最低位字节放在最低地址，也就是小端。注意这条豁免只给字符类型：把 int 的地址强转成 float * 再解引用会破坏严格别名规则，是未定义行为（第 77 关细讲）。\n"
        + "什么时候要关心字节序？读二进制文件、解析网络协议、和硬件打交道的时候。跨机器的数据格式通常统一约定用网络字节序（大端）；如果双方约定不一致，就会出现「数字看起来被拆开重组了」的现象。\n"
        + "读别人的代码时，看到 1u << n 就知道作者在操作第 n 个标志位；看到 0xFF 这样的掩码就知道在切字节；看到把地址转成 unsigned char * 的写法，八成是在处理字节序或对象表示。",
      example: {
        code: "#include <stdio.h>\n\n"
          + "/* 数一数一个无符号整数里有几个二进制 1 */\n"
          + "static int popcount(unsigned int v) {\n"
          + "    int n = 0;\n"
          + "    while (v != 0u) {\n"
          + "        n += (int)(v & 1u);\n"
          + "        v >>= 1;\n"
          + "    }\n"
          + "    return n;\n"
          + "}\n\n"
          + "int main(void) {\n"
          + "    unsigned int flags = 0u;\n"
          + "    unsigned int packed = 0x1234ABCDu;\n"
          + "    unsigned int one = 1u;\n"
          + "    unsigned short s = 0x0102u;\n"
          + "    unsigned char *sp = (unsigned char *)&s;\n"
          + "    unsigned char first = *(unsigned char *)&one;\n\n"
          + "    flags |= 1u << 0;                  /* 打开 bit 0 */\n"
          + "    flags |= 1u << 4;                  /* 打开 bit 4 */\n"
          + "    printf(\"flags = %u (0x%X)\\n\", flags, flags);\n\n"
          + "    printf(\"bit 4 = %d\\n\", (int)((flags >> 4) & 1u));\n"
          + "    printf(\"bit 2 = %d\\n\", (int)((flags >> 2) & 1u));\n\n"
          + "    flags &= ~(1u << 0);               /* 清掉 bit 0，其它位不动 */\n"
          + "    printf(\"after clear bit 0: %u\\n\", flags);\n\n"
          + "    flags ^= 1u << 4;                  /* 翻转 bit 4 */\n"
          + "    printf(\"after toggle bit 4: %u\\n\", flags);\n\n"
          + "    printf(\"packed = 0x%08X\\n\", packed);\n"
          + "    printf(\"low byte = 0x%02X, second byte = 0x%02X\\n\",\n"
          + "           (unsigned)(packed & 0xFFu), (unsigned)((packed >> 8) & 0xFFu));\n\n"
          + "    printf(\"popcount(0xF0F0) = %d\\n\", popcount(0xF0F0u));\n"
          + "    printf(\"is power of two: 64 -> %d, 48 -> %d\\n\",\n"
          + "           (64u & (64u - 1u)) == 0u, (48u & (48u - 1u)) == 0u);\n\n"
          + "    printf(\"first byte of 1u = %u\\n\", (unsigned)first);\n"
          + "    printf(\"little endian = %d\\n\", (unsigned)first == 1u);\n\n"
          + "    printf(\"0x0102 stored as %02X %02X\\n\",\n"
          + "           (unsigned)sp[0], (unsigned)sp[1]);\n"
          + "    return 0;\n"
          + "}",
        output: "flags = 17 (0x11)\nbit 4 = 1\nbit 2 = 0\nafter clear bit 0: 16\nafter toggle bit 4: 0\npacked = 0x1234ABCD\nlow byte = 0xCD, second byte = 0xAB\npopcount(0xF0F0) = 8\nis power of two: 64 -> 1, 48 -> 0\nfirst byte of 1u = 1\nlittle endian = 1\n0x0102 stored as 02 01",
        explain: "第 4 到 10 行的 popcount 演示「取最低位 + 右移」的循环：每轮把 v & 1u 累加进 n，再把 v 右移一位，直到 v 变成 0。"
          + "第 21、22 行用 |= 打开 bit 0 和 bit 4，flags 变成二进制的 10001，也就是 17（十六进制 0x11）。"
          + "第 25、26 行取位：(flags >> 4) & 1u 得到 1，(flags >> 2) & 1u 得到 0。注意外层要有 (int) 转换，因为表达式目前是无符号类型，直接交给 %d 会有格式警告。"
          + "第 28 行清位：~(1u << 0) 造出「最低位是 0、其它位都是 1」的掩码，按位与之后只有 bit 0 被清掉，结果是 16。"
          + "第 31 行翻位：^= 把 bit 4 从 1 变成 0，结果是 0。"
          + "第 34 到 36 行演示字段提取：0x1234ABCD 的最低字节是 0xCD，第二个字节是 0xAB，用「右移 + 掩码」就能切出来。"
          + "第 38 行数出 0xF0F0 里有 8 个 1；第 39、40 行用 x & (x - 1) 判断 2 的幂：64 是（结果 1），48 不是（结果 0）。"
          + "第 42 到 46 行是本机的字节序实测：1u 的对象表示里只有最低位字节是 1，把地址转成 unsigned char * 读第一个字节得到 1，说明低位字节在低地址——小端；0x0102 这个 short 存成 02 01，进一步印证。"
      },
      pitfalls: [
        "用有符号的 1 << 31 造掩码：在有符号 int 上左移到符号位是未定义行为；位运算一律用无符号，写成 1u << 31。",
        "移位位数不小于类型宽度：1u << 32、或对 32 位值做 x >> 32，都是未定义行为。",
        "对有符号负数右移：>> 对负数是算术右移还是逻辑右移由实现决定，换编译器就可能不同，不要依赖。",
        "清位时漏掉取反：x &= (1u << n) 只保留了第 n 位、把其它位全清了；清位必须写 x &= ~(1u << n)。",
        "拿 int * 或 float * 去读别的类型的字节：破坏严格别名规则，是未定义行为；查看对象表示只能用 char / unsigned char。",
        "以为 char 一定是无符号：char 是否有符号由实现决定。做字节比较和打印时先转成 unsigned 或 unsigned char，避免出现负数。"
      ],
      takeaways: [
        "取位 (x >> n) & 1u，置位 x |= 1u << n，清位 x &= ~(1u << n)，翻位 x ^= 1u << n",
        "位运算用无符号类型加 u 后缀，移位位数必须小于类型宽度",
        "x & (x - 1) 清掉最低位的 1，可用来判断 2 的幂和统计 1 的个数",
        "字符类型可以查看任何对象的字节表示，这是标准允许的类型双关",
        "本机是小端：0x0102 存成 02 01；用 (unsigned char *)&one 读第一个字节即可判断"
      ],
      questions: [
        {
          q: "unsigned int x = 0u; x |= 1u << 3; 执行后 x 的值是？",
          options: [
            "3",
            "8",
            "1",
            "4"
          ],
          answer: 1,
          explain: "1u << 3 把 1 左移三位得到二进制的 1000，即 8；|= 把它并入 x，所以 x 是 8，B 对。A 的 3 是 1u << 0 与 1u << 1 相加的结果，D 的 4 是 1u << 2，都不是本题的移位位数。C 的 1 是移位前的原值。"
        },
        {
          q: "要清掉 x 的第 2 位、其它位保持不变，正确写法是？",
          options: [
            "x &= ~(1u << 2);",
            "x |= (1u << 2);",
            "x &= (1u << 2);",
            "x = ~(1u << 2);"
          ],
          answer: 0,
          explain: "先造一个「只有第 2 位是 0、其它位都是 1」的掩码 ~(1u << 2)，再按位与，只有第 2 位被清掉，所以 A 对。B 是置位（把第 2 位设成 1）。C 会把除第 2 位以外的所有位都清掉，结果只剩第 2 位。D 更彻底：它丢掉了 x 原来的值，直接覆盖成掩码。"
        },
        {
          q: "程序里有 unsigned int one = 1u; unsigned char *p = (unsigned char *)&one;，如果 *p 等于 1，说明？",
          options: [
            "本机是大端",
            "编译器把小端改成了大端",
            "unsigned char 不能用来查看对象的字节表示",
            "本机是小端：最低位字节存在最低地址"
          ],
          answer: 3,
          explain: "1u 的对象表示里只有最低位字节是 1；它出现在最低地址（p[0]），说明低位字节放在低地址，也就是小端，D 对。A 说反了。B 与编译器无关：字节序由 CPU 架构决定，编译选项不会改变它。C 错：char、unsigned char、signed char 可以查看任何对象的字节表示，这是标准明确允许的，也正是本关推荐的测法。"
        }
      ],
      passRatio: 0.8,
      mission: "写一个完整的 C 程序，用位运算操作一个标志变量，再测出本机字节序：\n"
        + "1) 声明 unsigned int flags = 0u;，用 |= 打开 bit 0 和 bit 4；\n"
        + "2) 打印一行：flags = 17（用 %u 打印 flags）；\n"
        + "3) 用 (int)((flags >> 4) & 1u) 取出 bit 4，打印：bit4 = 1；\n"
        + "4) 用 &= ~(1u << 0) 清掉 bit 0，打印：after clear = 16；\n"
        + "5) 声明 unsigned int one = 1u;，把它的地址转成 unsigned char *，读出第一个字节，打印：little endian = 1（小端机器上这个字节是 1）；\n"
        + "6) 自己写一个函数 int count_bits(unsigned int v)，用「取最低位，再右移一位」的循环数出 v 里有几个 1，打印：popcount(0x00FF) = 8；\n"
        + "7) 最后 return 0;。\n"
        + "在本机编译运行，确认五行输出与上面一致。",
      starter: "#include <stdio.h>\n\n"
        + "/* 在这里写 count_bits：循环取最低位 (v & 1u)，然后 v >>= 1 */\n\n"
        + "int main(void) {\n"
        + "    unsigned int flags = 0u;\n"
        + "    unsigned int one = 1u;\n"
        + "    unsigned char first = 0u;\n\n"
        + "    /* 打开 bit 0 和 bit 4，打印 flags = ... */\n\n"
        + "    /* 取 bit 4，打印 bit4 = ... */\n\n"
        + "    /* 清掉 bit 0，打印 after clear = ... */\n\n"
        + "    /* first = *(unsigned char *)&one; 打印 little endian = ... */\n\n"
        + "    /* 打印 popcount(0x00FF) = ... */\n\n"
        + "    return 0;\n"
        + "}",
      hint: "四个动作分别对应 |=、>> 加 &、&= 加 ~、以及把地址交给 unsigned char *。注意清位时括号别漏：flags &= ~(1u << 0);。判断字节序只要看 one 的第一个字节是不是 1：first = *(unsigned char *)&one;，打印比较结果即可（用 (unsigned)first == 1u 得到 0 或 1）。count_bits 里每一轮做两件事：n += (int)(v & 1u); 和 v >>= 1;。",
      check: {
        include: ["stdio.h"],
        return0: true,
        require: { funcs: ["count_bits"] },
        seq: [["|="], ["&="], ["~", "(", "1u", "<<", "0", ")"], ["unsigned", "char", "*"]],
        calls: [["printf", "flags ="], ["printf", "bit4 ="], ["printf", "after clear ="], ["printf", "little endian ="], ["printf", "popcount"]],
        minStatements: 8,
        message: "需要 #include <stdio.h>、自己定义的 count_bits()、用 |= 置位、&= ~(1u << 0) 清位、用 unsigned char * 查看字节序，以及输出 flags / bit4 / after clear / little endian / popcount 五行，最后 return 0; 。",
        ok: "置位、清位、取位和字节序判断都用对了，结构完整。"
      },
      expectedOutput: "flags = 17\nbit4 = 1\nafter clear = 16\nlittle endian = 1\npopcount(0x00FF) = 8",
      solution: "#include <stdio.h>\n\n"
        + "/* 逐位统计 1 的个数：每轮取最低位，然后整体右移一位 */\n"
        + "static int count_bits(unsigned int v) {\n"
        + "    int n = 0;\n"
        + "    while (v != 0u) {\n"
        + "        n += (int)(v & 1u);\n"
        + "        v >>= 1;\n"
        + "    }\n"
        + "    return n;\n"
        + "}\n\n"
        + "int main(void) {\n"
        + "    unsigned int flags = 0u;\n"
        + "    unsigned int one = 1u;\n"
        + "    unsigned char first = 0u;\n\n"
        + "    flags |= 1u << 0;            /* 打开 bit 0 */\n"
        + "    flags |= 1u << 4;            /* 打开 bit 4 */\n"
        + "    printf(\"flags = %u\\n\", flags);\n\n"
        + "    printf(\"bit4 = %d\\n\", (int)((flags >> 4) & 1u));\n\n"
        + "    flags &= ~(1u << 0);         /* 清掉 bit 0 */\n"
        + "    printf(\"after clear = %u\\n\", flags);\n\n"
        + "    first = *(unsigned char *)&one;\n"
        + "    printf(\"little endian = %d\\n\", (unsigned)first == 1u);\n"
        + "    printf(\"popcount(0x00FF) = %d\\n\", count_bits(0x00FFu));\n"
        + "    return 0;\n"
        + "}",
      mastery: [
        "能写出取位、置位、清位、翻位四种位操作的惯用写法",
        "能解释为什么位运算要用无符号类型，以及移位越界为什么是未定义行为",
        "能用字符指针读出对象的字节表示，并判断本机字节序",
        "能用 x & (x - 1) 判断 2 的幂或统计二进制里 1 的个数"
      ]
    },
    {
      id: 77,
      title: "未定义行为：编译器没答应过的事",
      minutes: 22,
      gist: "越界、有符号溢出、未初始化变量、求值顺序、严格别名——五类最常见的未定义行为，以及每一类的安全替代写法。",
      lesson: "标准把 C 程序的行为分成四类：有定义（结果必须确定）、实现定义（由编译器决定，但必须写进文档）、未指定（标准列了几种合法选择，编译器不必写进文档，比如参数求值顺序）、未定义行为（标准不规定任何结果）。最后一类最危险：编译器有权假设它永远不会发生，于是删掉代码、改变执行顺序、甚至让程序崩溃。同一个程序在 -O0 下「看起来正常」、在 -O2 下出错，往往就是这个原因。\n"
        + "第一类：数组越界。int a[4]; a[4] = 1; 读写的是数组之外的存储，是未定义行为。它不是「多写了一个值」这么简单：那块内存可能属于别的变量，你会悄悄改掉别人的数据；如果跨越了页边界，程序直接崩溃。安全做法永远是先检查下标：if (index >= 0 && index < (int)(sizeof(a) / sizeof(a[0])))。\n"
        + "第二类：有符号整数溢出。int 超过 INT_MAX 继续加是未定义行为；无符号整数的回绕才是良定义的，标准保证按 2 的位数次方取模。想利用「回绕」就换成 unsigned；确实需要判断会不会溢出，就在运算之前检查：if (x > INT_MAX - y) { /* 会溢出 */ }。\n"
        + "第三类：读未初始化的自动变量。int sum; sum += 1; 里 sum 的值不确定，读它就是未定义行为（某些类型的不确定值还可能是陷阱表示）。注意区别：全局变量和 static 变量由系统清零，只有自动变量不会。养成「声明时就给初值」的习惯，这一整类问题就消失了。\n"
        + "第四类：求值顺序。C 只规定了少数几个顺序点：像 f() + g() 谁先调用、printf(\"%d %d\", i++, i) 里的自增什么时候生效，都是未指定的；而 i = i++; 这种「对同一个对象在一段没有定序的区间里改了两次」是未定义行为。安全的写法是把带副作用的操作拆成独立语句：a[i] = i + 1; i++;。\n"
        + "第五类：严格别名（strict aliasing）。编译器假设不同类型的指针不会指向同一块内存，所以「用 float * 去访问一个 int 对象」是未定义行为，优化之后可能读到过期的值。唯一的例外是字符类型：char、unsigned char、signed char 可以查看任何对象的字节表示。需要按位重新解释时，用 memcpy 把字节搬进目标类型的变量（编译器通常会把它优化成一条移动指令），既标准又高效。\n"
        + "把这几条放在一起看，会发现一个共同点：未定义行为大多来自「我碰巧知道本机是这样」。可移植的写法是依赖标准保证的东西，而不是依赖观察到的现象。具体来说：不要依赖有符号溢出、不要依赖 char 有没有符号、不要假设 int 一定是 4 字节（用 sizeof 量）、不要依赖栈的生长方向、不要把指针强转成不相关的类型。\n"
        + "最后提醒一句：本关的示例程序故意只演示「安全版本」，不演示越界和溢出——因为未定义行为的输出本身不可复现，把它写进示例只会误导人。危险写法会出现在下面的坑里，用文字说明它们的下场。",
      example: {
        code: "#include <stdio.h>\n"
          + "#include <limits.h>\n"
          + "#include <string.h>\n\n"
          + "int main(void) {\n"
          + "    int a[4] = {10, 20, 30, 40};\n"
          + "    int index = 4;\n"
          + "    int in_range = 0;\n"
          + "    int sum = 0;                 /* 一定要先初始化，否则读的是垃圾值 */\n"
          + "    int i;\n"
          + "    unsigned int ux = (unsigned int)INT_MAX;\n"
          + "    unsigned int bits = 0x3F800000u;   /* 这就是 float 1.0f 的位模式 */\n"
          + "    float f = 0.0f;\n\n"
          + "    /* 1) 有符号溢出的安全替代：先用无符号运算，再按实现定义转回来 */\n"
          + "    ux = ux + 1u;                /* 无符号回绕，标准保证按 2^32 取模 */\n"
          + "    printf(\"INT_MAX + 1 through unsigned = %d\\n\", (int)ux);\n\n"
          + "    /* 2) 越界：由程序自己守住下标 */\n"
          + "    in_range = (index >= 0) && (index < (int)(sizeof(a) / sizeof(a[0])));\n"
          + "    printf(\"index %d in range: %d\\n\", index, in_range);\n"
          + "    if (in_range) {\n"
          + "        printf(\"a[%d] = %d\\n\", index, a[index]);\n"
          + "    } else {\n"
          + "        printf(\"refused to read a[%d]\\n\", index);\n"
          + "    }\n\n"
          + "    /* 3) 先初始化再累加，结果才有确定的含义 */\n"
          + "    for (i = 0; i < 4; i++) {\n"
          + "        sum += a[i];\n"
          + "    }\n"
          + "    printf(\"sum = %d\\n\", sum);\n\n"
          + "    /* 4) 类型双关用 memcpy，而不是把 int* 强转成 float* */\n"
          + "    memcpy(&f, &bits, sizeof f);\n"
          + "    printf(\"0x%08X as float = %.1f\\n\", bits, (double)f);\n"
          + "    return 0;\n"
          + "}",
        output: "INT_MAX + 1 through unsigned = -2147483648\nindex 4 in range: 0\nrefused to read a[4]\nsum = 100\n0x3F800000 as float = 1.0",
        explain: "第 11 行把 INT_MAX 存进一个 unsigned int。第 16 行做 ux + 1u：无符号运算按 2 的 32 次方取模，结果良定义地回绕到 2147483648。第 17 行再转回 int 打印出 -2147483648——注意这一步「转换越界的无符号值到有符号类型」是实现定义的行为（gcc 定义为按位解释），所以它可移植性有限，但至少不是未定义行为；直接写 INT_MAX + 1 才是未定义行为。"
          + "第 20 行是越界防护的样板：先用 sizeof(a) / sizeof(a[0]) 算出元素个数，再检查 0 <= index < 个数。index 是 4，正好越界，所以 in_range 是 0。"
          + "第 22 到 26 行根据检查结果分支：本关的 index 越界，于是走 else 分支打印 refused to read a[4]，而不是去读 a[4]。这就是「先检查、再访问」。"
          + "第 29 到 32 行的累加前先给 sum 赋 0：如果写成 int sum; 再累加，加进去的就是不确定的值，属于未定义行为。a 的内容是 10 + 20 + 30 + 40 = 100。"
          + "第 35、36 行是类型双关的正确做法：0x3F800000 是 float 1.0f 的位模式，用 memcpy 把 4 个字节搬进 float 变量，再用 %.1f 打印得到 1.0。如果写成 float f = *(float *)&bits; 就违反了严格别名规则。"
      },
      pitfalls: [
        "越界读写：a[4] 访问的是数组之外的存储（数组只有 4 个元素），可能改坏别的变量、也可能崩溃；下标一律先检查再使用。",
        "用 int 演示回绕：int m = INT_MAX; m = m + 1; 是未定义行为，开优化后结果完全不可依赖；要演示回绕请用 unsigned。",
        "读未初始化变量：int sum; 之后 sum += 1; 加的是垃圾值；只有全局变量和 static 变量会被自动清零。",
        "在一个表达式里对同一个变量改两次：i = i++; 与 a[i] = i++; 都是未定义行为，务必拆成两条语句。",
        "假设参数从左到右求值：printf(\"%d %d\", f(), g()) 的调用顺序是未指定的，不要依赖它。",
        "把 int 的地址强转成 float * 再解引用：破坏严格别名规则，是未定义行为；类型双关请用 memcpy 或 unsigned char *。",
        "以为「编译通过、运行正常」就说明没有未定义行为：UB 常常只在开优化或换平台之后才现形。"
      ],
      takeaways: [
        "未定义行为允许编译器做任意假设，最典型的表现是 -O0 正常、-O2 出错",
        "数组下标先检查；有符号溢出改用无符号运算或提前判断",
        "自动变量必须先初始化，只有全局/静态变量默认是 0",
        "求值顺序大多未指定，带副作用的操作要拆成独立语句",
        "类型双关用 memcpy 或字符指针，不要用不相关类型的指针"
      ],
      questions: [
        {
          q: "下面哪一个是未定义行为？",
          options: [
            "unsigned int u = UINT_MAX; u = u + 1u;",
            "int m = INT_MAX; m = m + 1;",
            "double d = 3;",
            "用 %.2f 打印一个 double 变量"
          ],
          answer: 1,
          explain: "有符号整数溢出是未定义行为，编译器可以假设它不会发生，所以 B 对。A 是无符号回绕：标准保证结果按 2 的位数次方取模，UINT_MAX + 1u 一定是 0，属于良定义。C 是合法的隐式类型转换，D 的格式符与类型也匹配，两者都没有问题。"
        },
        {
          q: "要从一个 unsigned int 变量取出它的字节表示，哪种做法是标准保证的？",
          options: [
            "union 双关是唯一正确的做法",
            "把它的地址转成 int * 再解引用",
            "把它的地址转成 unsigned char *，逐字节读",
            "把它的地址转成 float *，读前 4 个字节"
          ],
          answer: 2,
          explain: "char、unsigned char、signed char 可以查看任何对象的字节表示，这是标准明确允许的例外，所以 C 对。B 和 D 都是用不相关类型去访问对象，破坏严格别名规则，是未定义行为。A 的说法太绝对：union 的类型双关在 C 里被广泛支持，但它并不是「唯一正确」的做法，而字符指针法是标准直接保证的。"
        },
        {
          q: "关于求值顺序，说法正确的是？",
          options: [
            "i = i++; 对同一个变量在没有定序的区间里改了两次，是未定义行为",
            "函数参数的求值顺序一定是从左到右",
            "未初始化的局部变量会被自动设为 0",
            "只要编译不报错，代码里就不存在未定义行为"
          ],
          answer: 0,
          explain: "C 只规定了少数顺序点，i = i++ 中两次对 i 的修改之间没有定序，是未定义行为，所以 A 对。B 错：参数求值顺序是未指定的，实现可以自选（甚至交错）。C 错：只有静态存储期的对象才默认清零，自动变量的初值不确定，读它是未定义行为。D 错：编译器通常不会为未定义行为报错，这正是它危险的原因。"
        }
      ],
      passRatio: 0.8,
      mission: "写一个完整的 C 程序，把「不安全」的写法都换成标准保证的版本：\n"
        + "1) 定义 int a[5] = {3, 1, 4, 1, 5};，用 scanf(\"%d\", &index) 读一个整数（如果读不到就打印 bad input 并 return 1）；\n"
        + "2) 先检查 index 是否落在 [0, 5) 内，把结论存进 int in_range;，打印：index 2 in range: 1（以输入 2 为例）；\n"
        + "3) 只有在范围内才访问数组，打印：a[2] = 4；否则打印 refused to read a[%d]（不要真的去读越界元素）；\n"
        + "4) 用 unsigned int 演示回绕：ux 初始为 UINT_MAX，执行 ux = ux + 1u; 后打印：UINT_MAX + 1 = 0；\n"
        + "5) 用无符号运算做有符号溢出的替代：把 (int)((unsigned int)INT_MAX + 1u) 打印成：INT_MAX + 1 through unsigned = -2147483648；\n"
        + "6) 用 memcpy 做类型双关：unsigned int bits = 0x40490FDBu;（这是 float 圆周率的位模式），把它的字节搬进 float pi;，用 %.5f 打印：0x40490FDB as float = 3.14159；\n"
        + "7) 最后 return 0;。\n"
        + "在本机编译运行，输入 2，确认五行输出与上面一致。",
      starter: "#include <stdio.h>\n"
        + "#include <limits.h>\n"
        + "#include <string.h>\n\n"
        + "int main(void) {\n"
        + "    int a[5] = {3, 1, 4, 1, 5};\n"
        + "    int index = 0;\n"
        + "    int in_range = 0;\n"
        + "    unsigned int ux = (unsigned int)UINT_MAX;\n"
        + "    unsigned int bits = 0x40490FDBu;\n"
        + "    float pi = 0.0f;\n\n"
        + "    /* 读入 index，检查 scanf 返回值 */\n\n"
        + "    /* 先算 in_range，再决定是否访问 a[index] */\n\n"
        + "    /* 无符号回绕：ux = ux + 1u; 然后打印 */\n\n"
        + "    /* 有符号溢出的替代：(int)((unsigned int)INT_MAX + 1u) */\n\n"
        + "    /* memcpy(&pi, &bits, sizeof pi); 然后打印 */\n\n"
        + "    return 0;\n"
        + "}",
      hint: "下标检查写成 in_range = (index >= 0) && (index < (int)(sizeof(a) / sizeof(a[0])));，访问数组时用 if (in_range) 包起来。有符号溢出那行不要写 INT_MAX + 1，而是先转成 unsigned 再加，最后用 (int) 转换回来（这一步是实现定义的，本机会得到 -2147483648）。类型双关不要用指针强转，用 memcpy(&pi, &bits, sizeof pi);。",
      check: {
        include: ["stdio.h"],
        return0: true,
        require: { if: true, array: true },
        seq: [["scanf", "(", "%d", ",", "&", "index"], ["memcpy", "(", "&", "pi"]],
        calls: [["printf", "in range"], ["printf", "refused"], ["printf", "UINT_MAX + 1"], ["printf", "as float"]],
        minStatements: 8,
        message: "需要 #include <stdio.h>、int a[5] 与带 & 的 scanf、用 if 先判断下标是否在范围内、无符号回绕 UINT_MAX + 1、用 memcpy 做类型双关，以及 in range / refused / UINT_MAX + 1 / as float 这些输出，最后 return 0; 。",
        ok: "下标检查、回绕替代和类型双关都按标准写法完成，结构完整。"
      },
      input: "2",
      expectedOutput: "index 2 in range: 1\na[2] = 4\nUINT_MAX + 1 = 0\nINT_MAX + 1 through unsigned = -2147483648\n0x40490FDB as float = 3.14159",
      solution: "#include <stdio.h>\n"
        + "#include <limits.h>\n"
        + "#include <string.h>\n\n"
        + "int main(void) {\n"
        + "    int a[5] = {3, 1, 4, 1, 5};\n"
        + "    int index = 0;\n"
        + "    int in_range = 0;\n"
        + "    unsigned int ux = (unsigned int)UINT_MAX;\n"
        + "    unsigned int bits = 0x40490FDBu;   /* float 3.14159274f 的位模式 */\n"
        + "    float pi = 0.0f;\n\n"
        + "    if (scanf(\"%d\", &index) != 1) {\n"
        + "        printf(\"bad input\\n\");\n"
        + "        return 1;\n"
        + "    }\n\n"
        + "    /* 下标先检查，再访问 */\n"
        + "    in_range = (index >= 0) && (index < (int)(sizeof(a) / sizeof(a[0])));\n"
        + "    printf(\"index %d in range: %d\\n\", index, in_range);\n"
        + "    if (in_range) {\n"
        + "        printf(\"a[%d] = %d\\n\", index, a[index]);\n"
        + "    } else {\n"
        + "        printf(\"refused to read a[%d]\\n\", index);\n"
        + "    }\n\n"
        + "    /* 无符号回绕有定义：UINT_MAX + 1 回到 0 */\n"
        + "    ux = ux + 1u;\n"
        + "    printf(\"UINT_MAX + 1 = %u\\n\", ux);\n\n"
        + "    /* 有符号溢出的安全替代：走一遍无符号再转回 int */\n"
        + "    printf(\"INT_MAX + 1 through unsigned = %d\\n\",\n"
        + "           (int)((unsigned int)INT_MAX + 1u));\n\n"
        + "    /* 类型双关走 memcpy，不破坏严格别名 */\n"
        + "    memcpy(&pi, &bits, sizeof pi);\n"
        + "    printf(\"0x%08X as float = %.5f\\n\", bits, (double)pi);\n"
        + "    return 0;\n"
        + "}",
      mastery: [
        "能列举五类常见未定义行为，并说出它们的标准替代写法",
        "能解释为什么「-O0 正常、-O2 出错」通常意味着程序里有未定义行为",
        "能区分未定义行为、实现定义行为和未指定行为",
        "能手写数组下标检查，并说清它挡住了什么风险"
      ]
    },
    {
      id: 78,
      title: "限定符：const、volatile、static、restrict",
      minutes: 22,
      gist: "四个限定符分别在承诺什么：const 锁住写权限、volatile 禁止缓存、static 改变存储期或链接、restrict 承诺不重叠。",
      lesson: "限定符（qualifier）不改变数据本身，它改变的是「编译器被允许做哪些假设」。用对了，代码更清楚，编译器也更敢优化。\n"
        + "const 表示「不打算通过这个名字修改对象」。最常用的是函数参数：int sum(const int *data, int n) 等于告诉调用者「我只读你的数组」，既表达意图，也给优化留出空间。多层指针里的 const 要按「从名字往外读」来辨认：const int *p 里 const 在 * 左边，修饰的是所指的对象——不能通过 p 改内容，但 p 可以改指向；int * const p 里 const 在 * 右边，修饰的是指针本身——p 不能改指向，但 *p 可以改；const int * const p 两者都锁住。还有一个常见误区：typedef 不是文本替换，const int_pointer q 得到的是「常量指针」（等价于 int * const q），因为 const 修饰的是整个别名类型。\n"
        + "把 const 对象交给非 const 指针时，C 会给出「丢弃限定符」的诊断（gcc 默认是 warning），这是它在提醒你：那个函数可能会写。不要用强制转换把 const 去掉，那是在关掉编译器替你准备的安全网。\n"
        + "volatile 表示「这个对象的值可能被程序之外的东西改变，每次访问都必须真的读写内存」。真正需要它的场合只有两类：内存映射的硬件寄存器，以及异步信号处理函数里修改、主流程里读取的变量（类型通常是 volatile sig_atomic_t）。它最常见的误用是「多线程里加个 volatile 就安全了」——volatile 既不保证原子性，也不建立线程之间的同步（那需要原子操作或互斥量）。反过来，把普通局部变量都加上 volatile 只会让程序变慢，因为编译器再也不能把它的值留在寄存器里。\n"
        + "static 有三种语境，含义各不相同：文件作用域的 static（修饰变量或函数）表示内部链接——名字只在本文件可见，避免多个文件重名冲突；函数内部的 static 变量表示静态存储期——只初始化一次，值跨调用保留；出现在数组参数里的 static（例如 int a[static 10]）是一种长度承诺——告诉编译器「这个指针至少指向 10 个元素」，如果实际不够就是未定义行为。\n"
        + "restrict 只用在指针上，表示「在本次访问期间，只有这个指针能访问它指向的对象」。有了这个承诺，编译器才敢做向量化、提前加载和批量搬运；一旦违反（比如用它去处理重叠的两块内存），就是未定义行为。典型用法是形如 void copy(int *restrict dst, const int *restrict src, int n) 的函数——调用者必须先保证两块内存不重叠，重叠的场景要改用 memmove。\n"
        + "读别人代码时的快速判断：参数带 const 说明这个函数不会改你的数据；局部变量带 static 说明作者在跨调用记状态（注意它在多线程下并不是天然安全的）；看到 restrict 说明这个函数对性能有要求，调用时务必保证内存不重叠；看到 volatile 则要先问一句「这个变量真的会被程序之外的东西改吗」。",
      example: {
        code: "#include <stdio.h>\n\n"
          + "typedef int *int_pointer;   /* typedef 是给类型起别名，不是文本替换 */\n\n"
          + "static int call_count = 0;  /* 语境 1：文件作用域 static —— 这个名字只在本文件可见 */\n\n"
          + "static int next_id(void) {\n"
          + "    static int id = 100;    /* 语境 2：函数内 static —— 只初始化一次，跨调用保留 */\n"
          + "    id++;\n"
          + "    call_count++;\n"
          + "    return id;\n"
          + "}\n\n"
          + "/* 语境 3：参数里的 static —— 承诺\"至少能访问 4 个元素\" */\n"
          + "static int sum(const int data[static 4], int n) {\n"
          + "    int total = 0;\n"
          + "    int i;\n"
          + "    for (i = 0; i < n; i++) {\n"
          + "        total += data[i];\n"
          + "    }\n"
          + "    return total;\n"
          + "}\n\n"
          + "/* restrict：承诺 dst 和 src 指向的内存不重叠，编译器可以做批量优化 */\n"
          + "static void copy_ints(int *restrict dst, const int *restrict src, int n) {\n"
          + "    int i;\n"
          + "    for (i = 0; i < n; i++) {\n"
          + "        dst[i] = src[i];\n"
          + "    }\n"
          + "}\n\n"
          + "int main(void) {\n"
          + "    const int data[4] = {1, 2, 3, 4};\n"
          + "    int out[4] = {0, 0, 0, 0};\n"
          + "    const int *p = data;        /* 指向常量的指针：不能通过 p 改 data */\n"
          + "    const int_pointer q = out;  /* 等价于 int * const q：q 自己不能再指向别处 */\n"
          + "    int first;\n"
          + "    int second;\n"
          + "    int third;\n\n"
          + "    copy_ints(out, data, 4);\n"
          + "    printf(\"sum = %d\\n\", sum(data, 4));\n"
          + "    printf(\"out = %d %d %d %d\\n\", out[0], out[1], out[2], out[3]);\n"
          + "    printf(\"p[0] = %d, q[0] = %d\\n\", p[0], q[0]);\n\n"
          + "    first = next_id();\n"
          + "    second = next_id();\n"
          + "    third = next_id();\n"
          + "    printf(\"ids = %d %d %d, calls = %d\\n\", first, second, third, call_count);\n"
          + "    return 0;\n"
          + "}",
        output: "sum = 10\nout = 1 2 3 4\np[0] = 1, q[0] = 1\nids = 101 102 103, calls = 3",
        explain: "第 3 行的 typedef 是理解 const 的关键铺垫：int_pointer 就是 int *，但 const int_pointer 不是「指向 const int 的指针」，而是「常量指针」。"
          + "第 5 行的 static int call_count 是文件作用域的 static，只在本文件里看见；第 7 到 12 行的 next_id 里还有第二层 static：id 只初始化一次，所以三次调用依次返回 101、102、103。"
          + "第 15 行的 sum 展示第三种 static：参数写成 const int data[static 4]，意思是「我保证至少能访问 4 个元素」，同时 const 承诺只读。"
          + "第 25 到 30 行的 copy_ints 用 restrict 声明两个指针指向的内存互不重叠，编译器因此可以把逐元素复制优化成批量搬运。"
          + "第 33 到 36 行是 const 形式的对照：data 本身是 const 数组；p 是「指向常量的指针」，可以改指向但不能改内容；q 借助 typedef 写成常量指针，可以改内容（q[0] 是 int）但不能改指向。"
          + "第 46 到 49 行注意一个细节：三次 next_id() 的返回值先分别存进 first、second、third，再一起打印。如果写成 printf(\"%d %d %d\", next_id(), next_id(), next_id())，函数参数的求值顺序是未指定的（第 77 关讲过），输出可能是 103 102 101。"
      },
      pitfalls: [
        "把 const int *p 和 int * const p 搞混：前者不能改内容（*p 只读），后者不能改指向（p 只读）；按「从名字往外读」辨认 const 修饰谁。",
        "用强制转换去掉 const：把 const 指针转成非 const 交给会写的函数，等于关掉编译器唯一的检查。",
        "以为 volatile 能替代原子操作或互斥量：它不保证原子性，也不建立线程之间的同步。",
        "把 volatile 当成「优化开关」到处加：它强制每次访问都真的读写内存，通常只会更慢；普通局部变量不需要它。",
        "混淆 static 的三种含义：文件作用域的 static 是「只在本文件可见」，函数内的 static 是「跨调用保持」，数组参数里的 static 是「长度至少这么多」。",
        "违反 restrict 的承诺：两块内存真的重叠却写成 restrict，编译器优化后结果就会出错（本机通常表现为复制错位）。"
      ],
      takeaways: [
        "const 在 * 左边修饰所指对象、在 * 右边修饰指针本身；typedef 加 const 得到的是常量指针",
        "volatile 用于硬件寄存器和信号处理函数共享的变量，它不提供原子性和线程同步",
        "static 的三种语境：内部链接、静态存储期、数组参数的长度承诺",
        "restrict 是「只有这个指针访问这块内存」的承诺，违反它是未定义行为",
        "把 const 用在函数参数上，是表达「我只读」最直接的方式"
      ],
      questions: [
        {
          q: "const int *p; 和 int * const p; 的区别是？",
          options: [
            "前者表示 p 不能改指向，后者表示不能通过 p 改内容",
            "两者完全等价，只是写法不同",
            "前者是语法错误，必须写成 int const *p",
            "前者不能通过 p 修改它指向的 int；后者 p 自己不能再指向别处"
          ],
          answer: 3,
          explain: "按「从名字往外读」：const int *p 里 const 修饰的是 *p（所指对象），所以内容只读、指针可改；int * const p 里 const 修饰的是 p（指针本身），所以指向不能改、内容可改，D 对。A 正好说反。B 错：两者的限制不同，而且 int * const p 声明时必须初始化。C 错：const int *p 完全合法，const int 和 int const 是等价的写法。"
        },
        {
          q: "什么时候真的需要 volatile？",
          options: [
            "多线程里用它保护共享变量就够了",
            "变量的值可能被程序之外的东西改变时，例如内存映射的硬件寄存器，或信号处理函数里改动的标志",
            "想让变量的访问更快时",
            "任何局部变量都该加，防止被编译器优化掉"
          ],
          answer: 1,
          explain: "volatile 的语义是「每次访问都必须真的读写内存」，适用于硬件寄存器、信号处理器修改的对象，所以 B 对。A 错：volatile 不保证原子性，也不能建立线程之间的同步，共享数据的同步要靠原子操作或互斥量。C 错：volatile 通常让程序更慢，因为值不能留在寄存器里。D 错：可观察行为编译器不能随意删除，普通局部变量不需要 volatile。"
        },
        {
          q: "关于 static，哪种说法是对的？",
          options: [
            "函数内的 static 变量每次调用都会重新初始化",
            "文件作用域的 static 函数可以在其它文件里调用",
            "函数内的 static 变量只初始化一次，并且在程序运行期间一直存在",
            "static 只能修饰变量，不能修饰函数"
          ],
          answer: 2,
          explain: "函数内的 static 变量有静态存储期，初始化只做一次，值跨调用保留，所以 C 对。A 描述的正是它要区别于普通局部变量的地方，说反了。B 错：文件作用域的 static 表示内部链接，只能在本文件内使用。D 错：static 可以修饰函数（内部链接），还能出现在数组参数里表示长度承诺。"
        }
      ],
      passRatio: 0.8,
      mission: "写一个完整的 C 程序，把四个限定符的典型用法各用上一次：\n"
        + "1) 定义文件作用域的 static int call_count = 0;，再写函数 static int next_id(void)：内部有 static int id = 100;，每次调用 id++、call_count++，返回 id；\n"
        + "2) 写 static int sum(const int *data, int n)：用 const 承诺只读，返回元素之和；\n"
        + "3) 写 static void copy_ints(int *restrict dst, const int *restrict src, int n)：用 restrict 承诺两块内存不重叠；\n"
        + "4) 在 main 里准备 const int data[5] = {2, 4, 6, 8, 10};、int out[5] = {0, 0, 0, 0, 0}; 和 const int *p = data;，先调用 copy_ints(out, data, 5)，再依次打印三行：\n"
        + "sum = 30\n"
        + "out = 2 4 6 8 10\n"
        + "ids = 101 102, calls = 2\n"
        + "最后一行要求先把 next_id() 的两次返回值分别存进变量，再放进 printf——函数参数的求值顺序是未指定的，写成 printf(\"%d %d\", next_id(), next_id()) 可能打印成 102 101。\n"
        + "5) 最后 return 0;。\n"
        + "在本机编译运行，确认三行输出与上面一致。",
      starter: "#include <stdio.h>\n\n"
        + "static int call_count = 0;   /* 文件作用域 static */\n\n"
        + "/* next_id()：函数内 static 的 id，每次 +1，并累加 call_count */\n\n"
        + "/* sum()：const int * 参数，返回元素之和 */\n\n"
        + "/* copy_ints()：int *restrict 与 const int *restrict 参数 */\n\n"
        + "int main(void) {\n"
        + "    const int data[5] = {2, 4, 6, 8, 10};\n"
        + "    int out[5] = {0, 0, 0, 0, 0};\n"
        + "    const int *p = data;\n"
        + "    int a;\n"
        + "    int b;\n\n"
        + "    /* copy_ints(out, data, 5); 然后打印 sum、out 两行 */\n\n"
        + "    /* a = next_id(); b = next_id(); 再打印 ids 与 calls */\n\n"
        + "    return 0;\n"
        + "}",
      hint: "next_id 里的 id 写成 static int id = 100;，它就会跨调用累加；call_count 是文件作用域的 static 变量，函数里直接加一。sum 的参数写 const int *data，表示只读。copy_ints 的两个指针都加 restrict，循环里逐元素复制即可。注意 ids 那一行必须先把两次返回值存进变量再打印，否则求值顺序不确定。",
      check: {
        include: ["stdio.h"],
        return0: true,
        require: { funcs: ["next_id", "sum", "copy_ints"] },
        seq: [["const", "int", "*", "p"], ["copy_ints", "(", "out"]],
        calls: [["printf", "sum ="], ["printf", "out ="], ["printf", "ids ="]],
        minStatements: 8,
        message: "需要 #include <stdio.h>、自己定义的 next_id() / sum() / copy_ints()、main 里的 const int *p、调用 copy_ints(out, ...)，以及输出 sum = / out = / ids = 三行，最后 return 0; 。",
        ok: "const 参数、restrict 函数、static 的两种语境都用上了，结构完整。"
      },
      expectedOutput: "sum = 30\nout = 2 4 6 8 10\nids = 101 102, calls = 2",
      solution: "#include <stdio.h>\n\n"
        + "static int call_count = 0;   /* 文件作用域 static：只在本文件可见，生命周期是整个程序 */\n\n"
        + "static int next_id(void) {\n"
        + "    static int id = 100;     /* 函数内 static：初始化只做一次 */\n"
        + "    id++;\n"
        + "    call_count++;\n"
        + "    return id;\n"
        + "}\n\n"
        + "/* const 参数：函数承诺不改调用者的数组 */\n"
        + "static int sum(const int *data, int n) {\n"
        + "    int total = 0;\n"
        + "    int i;\n"
        + "    for (i = 0; i < n; i++) {\n"
        + "        total += data[i];\n"
        + "    }\n"
        + "    return total;\n"
        + "}\n\n"
        + "/* restrict：两块内存不重叠的承诺 */\n"
        + "static void copy_ints(int *restrict dst, const int *restrict src, int n) {\n"
        + "    int i;\n"
        + "    for (i = 0; i < n; i++) {\n"
        + "        dst[i] = src[i];\n"
        + "    }\n"
        + "}\n\n"
        + "int main(void) {\n"
        + "    const int data[5] = {2, 4, 6, 8, 10};\n"
        + "    int out[5] = {0, 0, 0, 0, 0};\n"
        + "    const int *p = data;\n"
        + "    int a;\n"
        + "    int b;\n\n"
        + "    copy_ints(out, data, 5);\n"
        + "    printf(\"sum = %d\\n\", sum(p, 5));\n"
        + "    printf(\"out = %d %d %d %d %d\\n\", out[0], out[1], out[2], out[3], out[4]);\n\n"
        + "    a = next_id();\n"
        + "    b = next_id();\n"
        + "    printf(\"ids = %d %d, calls = %d\\n\", a, b, call_count);\n"
        + "    return 0;\n"
        + "}",
      mastery: [
        "能读出多层指针声明里 const 到底修饰谁，并写出对应的三种形式",
        "能说出 volatile 真正适用的两种场合，以及它不能替代什么",
        "能区分 static 的三种语境并各举一个例子",
        "能说清 restrict 承诺了什么，以及违反承诺的后果"
      ]
    },
    {
      id: 79,
      title: "性能意识：拷贝、缓存与结构体对齐",
      minutes: 20,
      gist: "三件最容易见效的事：少拷贝（传指针）、顺着内存遍历（缓存友好）、安排成员顺序（减少填充），并用 sizeof 与 offsetof 把结果量出来。",
      lesson: "性能不是「写得更聪明」，而是「不要做无谓的工作」。这一关讲三件最常见效的事，每一件都能用标准工具量出结果。\n"
        + "第一件：减少拷贝。C 的参数传递是按值传递，把结构体按值传进函数，就要复制整个对象。一个 4096 字节的结构体调用 1000 次，就是 4 MB 的字节搬运；改成传 const 指针，每次只复制一个地址（本机 8 字节）。同理，返回大结构体、在循环里反复把字符串复制到临时数组，都是隐形的拷贝开销。判断方法很直接：用 sizeof 量一量你传递的东西有多大。\n"
        + "第二件：按内存顺序访问。C 的二维数组 int m[4][4] 按行连续存放：m[i][j] 与 m[i][j+1] 相邻，而 m[i][j] 与 m[i+1][j] 相差一整行。CPU 取数据时不是取一个字节，而是把一整条缓存行（本机通常 64 字节）搬进缓存：顺着内存走，同一行里的数据会被反复用到；按列走，每走一步就跳到下一行，缓存行里其余的数据全被浪费。数据量越大差距越明显。链表也是同理：节点分散在堆上，遍历时几乎每次都要等内存，所以性能敏感的场景里「数组 + 下标」常常胜过链表。\n"
        + "第三件：结构体对齐与填充。CPU 访问内存有对齐要求：4 字节的 int 最好落在 4 的倍数地址上。编译器会自动插入填充字节（padding）来满足对齐，于是 typedef struct { char tag; int value; char flag; } Wide; 在本机占 12 字节而不是 6：tag 在偏移 0，value 必须从偏移 4 开始（中间 3 个字节是填充），flag 在偏移 8，整个结构体还要按最大成员的对齐要求补齐到 12。把成员按「大的在前、小的在后」重排，就只需要 8 字节。sizeof 告诉你总大小，offsetof（定义在 <stddef.h> 的宏）告诉你每个成员的偏移，这两个工具能让你把布局看清楚，而不是靠猜。\n"
        + "那优化器在做什么？开 -O2 之后，编译器会做内联、循环优化、把 memcpy 换成寄存器搬运、删掉没有可观察效果的代码。你不需要手写这些「优化」，反而要注意两点：一是不要用未定义行为挡住优化器（第 77 关），二是优化不会改变程序的可观察结果——本关的示例在 -O0 和 -O2 下输出完全一致；如果输出变了，那多半是程序里藏着未定义行为。想看编译器究竟做了什么，可以加 -S 生成汇编观察，这是学习手段，不是必修课。\n"
        + "还有一个容易忽略的点：本关示例里的「同一块」统计只是一个简化模型（真实的缓存还有多路组相联、预取等机制），但它足以说明访问模式为什么重要：同样是求 16 个元素的和，按行遍历有 12 次访问落在刚取回的那一块里，按列遍历一次都没有。\n"
        + "读别人的代码时，看到结构体就能猜到作者有没有考虑过填充；看到「按列遍历大数组」就该警觉；看到按值传递大结构体，通常是一个可以立刻改掉的浪费。",
      example: {
        code: "#include <stdio.h>\n"
          + "#include <stddef.h>\n\n"
          + "#define N 4\n"
          + "#define BLOCK 16   /* 用 16 字节当作\"一个块\"，只是为了把访问模式数出来 */\n\n"
          + "typedef struct {\n"
          + "    char tag;\n"
          + "    int value;\n"
          + "    char flag;\n"
          + "} Wide;\n\n"
          + "typedef struct {\n"
          + "    int value;\n"
          + "    char tag;\n"
          + "    char flag;\n"
          + "} Tight;\n\n"
          + "typedef struct {\n"
          + "    int data[1024];   /* 4 * 1024 = 4096 字节 */\n"
          + "} Big;\n\n"
          + "static int sum_row_major(int m[N][N]) {\n"
          + "    int i, j, total = 0;\n"
          + "    for (i = 0; i < N; i++) {\n"
          + "        for (j = 0; j < N; j++) {\n"
          + "            total += m[i][j];\n"
          + "        }\n"
          + "    }\n"
          + "    return total;\n"
          + "}\n\n"
          + "static int sum_col_major(int m[N][N]) {\n"
          + "    int i, j, total = 0;\n"
          + "    for (j = 0; j < N; j++) {\n"
          + "        for (i = 0; i < N; i++) {\n"
          + "            total += m[i][j];\n"
          + "        }\n"
          + "    }\n"
          + "    return total;\n"
          + "}\n\n"
          + "/* 数一数相邻两次访问是否落在同一个 16 字节块里 */\n"
          + "static int same_block_hits(int m[N][N], int row_major) {\n"
          + "    const unsigned char *base = (const unsigned char *)&m[0][0];\n"
          + "    long prev = -1;\n"
          + "    int hits = 0;\n"
          + "    int step;\n"
          + "    for (step = 0; step < N * N; step++) {\n"
          + "        int r = row_major ? step / N : step % N;\n"
          + "        int c = row_major ? step % N : step / N;\n"
          + "        long block = (long)((const unsigned char *)&m[r][c] - base) / BLOCK;\n"
          + "        if (prev >= 0 && block == prev) {\n"
          + "            hits++;\n"
          + "        }\n"
          + "        prev = block;\n"
          + "    }\n"
          + "    return hits;\n"
          + "}\n\n"
          + "int main(void) {\n"
          + "    int m[N][N];\n"
          + "    int i, j;\n\n"
          + "    for (i = 0; i < N; i++) {\n"
          + "        for (j = 0; j < N; j++) {\n"
          + "            m[i][j] = i * N + j;\n"
          + "        }\n"
          + "    }\n"
          + "    printf(\"row-major sum = %d\\n\", sum_row_major(m));\n"
          + "    printf(\"col-major sum = %d\\n\", sum_col_major(m));\n"
          + "    printf(\"same-block hits: row = %d, col = %d (of %d steps)\\n\",\n"
          + "           same_block_hits(m, 1), same_block_hits(m, 0), N * N - 1);\n\n"
          + "    printf(\"Wide: size = %d, offset(value) = %d, offset(flag) = %d\\n\",\n"
          + "           (int)sizeof(Wide), (int)offsetof(Wide, value),\n"
          + "           (int)offsetof(Wide, flag));\n"
          + "    printf(\"Tight: size = %d\\n\", (int)sizeof(Tight));\n"
          + "    printf(\"reordering saved %d bytes\\n\", (int)(sizeof(Wide) - sizeof(Tight)));\n\n"
          + "    printf(\"Big bytes = %d\\n\", (int)sizeof(Big));\n"
          + "    printf(\"1000 calls by value copy %d bytes\\n\", (int)sizeof(Big) * 1000);\n"
          + "    printf(\"1000 calls by pointer copy %d bytes\\n\", (int)sizeof(int *) * 1000);\n"
          + "    return 0;\n"
          + "}",
        output: "row-major sum = 120\ncol-major sum = 120\nsame-block hits: row = 12, col = 0 (of 15 steps)\nWide: size = 12, offset(value) = 4, offset(flag) = 8\nTight: size = 8\nreordering saved 4 bytes\nBig bytes = 4096\n1000 calls by value copy 4096000 bytes\n1000 calls by pointer copy 8000 bytes",
        explain: "第 7 到 21 行定义三个结构体：Wide 和 Tight 成员完全相同、顺序不同，Big 用来演示大对象的拷贝成本。"
          + "第 23 到 41 行的两个求和函数访问的是同一个数组、算的是同一个和（都是 120），区别只在遍历顺序：sum_row_major 外层走行、内层走列，sum_col_major 反过来。"
          + "第 44 到 59 行的 same_block_hits 把访问顺序「数」出来：以数组首元素为基准，算出每次访问的字节偏移，除以 BLOCK（16 字节）得到块号，再统计相邻两次访问块号相同的次数。注意它用的是同一个数组内部的指针相减，这是标准保证有定义的操作。"
          + "第 70、71 行两个求和结果都是 120——顺序不影响正确性，只影响效率。"
          + "第 72、73 行的统计给出差距：按行遍历 15 次相邻访问里有 12 次落在同一块内（每行 4 个元素共享一块，只有跨行时会换块）；按列遍历则是 0 次，每一步都换块。"
          + "第 75 到 79 行用 sizeof 和 offsetof 看结构体布局：Wide 占 12 字节，value 的偏移是 4（前面 3 个字节是填充），flag 在偏移 8；Tight 只占 8 字节，重排成员省下 4 字节。填充不是浪费，它是为了让 int 成员落在对齐的地址上。"
          + "第 81 到 83 行把拷贝成本换算成字节数：Big 有 4096 字节，按值传递调用 1000 次就要搬 4096000 字节；改成传指针，每次只搬一个地址（本机 8 字节），1000 次共 8000 字节。"
      },
      pitfalls: [
        "按值传递大结构体：4096 字节的结构体每次调用都要复制 4096 字节；改成 const 指针，每次只复制一个地址。",
        "按列遍历二维数组：m[j][i] 这种写法每步都跳到下一行，缓存行里其它数据全被浪费；把循环顺序改成「外层行、内层列」。",
        "以为结构体的 sizeof 等于成员大小之和：对齐会插入填充字节，成员顺序不同，大小可能差很多。",
        "用 sizeof 数元素个数时忘了除以元素大小：sizeof(a) 是总字节数，元素个数是 sizeof(a) / sizeof(a[0])。",
        "凭感觉做「优化」而不做测量：先写清楚的代码，需要时再用 sizeof、计数或编译器报告评估，不要把代码写复杂。",
        "以为开 -O2 会改变结果：优化只改变速度；如果 -O2 下输出变了，先怀疑程序里有未定义行为。"
      ],
      takeaways: [
        "传参默认是拷贝：大对象传 const 指针，不要传值",
        "二维数组按行连续存放，按行遍历能反复用到刚取回的缓存行",
        "对齐要求会在成员之间插入填充，重排成员（大的在前）能减小 sizeof",
        "sizeof 看总大小，offsetof 看成员偏移，两者都在标准头文件里",
        "-O2 只改变速度，不改变可观察结果；结果变了通常意味着未定义行为"
      ],
      questions: [
        {
          q: "遍历 int m[100][100] 求和，通常哪种顺序更快，为什么？",
          options: [
            "外层 i、内层 j（按行），因为相邻访问落在同一缓存行里，能复用已经取回的数据",
            "外层 j、内层 i（按列），因为跳跃访问能触发硬件预取",
            "两种一样快，缓存与访问顺序无关",
            "按列更快，因为 m[j][i] 的下标和更小"
          ],
          answer: 0,
          explain: "C 的二维数组按行连续存放，m[i][j] 与 m[i][j+1] 相邻，按行遍历能反复命中同一条缓存行，所以 A 对。B 说反了：按列遍历每步都跳到下一行，相差一整行，缓存行里其余数据全被浪费。C 错：缓存命中率高度依赖访问模式，数据量大时差距很明显。D 错：两种写法访问的元素完全相同，下标怎么写都不改变元素的地址。"
        },
        {
          q: "typedef struct { char c; int i; char d; } A; 在本机占 12 字节，改成 typedef struct { int i; char c; char d; } B; 只占 8 字节，原因是？",
          options: [
            "编译器对第二种写法做了压缩存储",
            "第一种写法里的 char 被扩展成了 int",
            "sizeof 的结果不确定，不能依赖",
            "对齐要求会在成员之间插入填充字节，重排成员可以减少填充"
          ],
          answer: 3,
          explain: "int 需要 4 字节对齐，所以第一种写法里 c 之后要空出 3 个填充字节，总大小被补到 12；把 int 放前面、两个 char 挤在尾部，就只需要 8 字节，D 对。A 错：编译器不会随意改变成员的布局，那会破坏 ABI，成员偏移是确定的。B 错：char 始终是 1 字节，多出来的是填充而不是扩展。C 错：同一个平台上布局是确定的，offsetof 可以逐个验证。"
        },
        {
          q: "把一个 4096 字节的结构体传进函数，哪种做法更省？",
          options: [
            "按值传递，编译器会自动去掉这次拷贝",
            "按值传递，参数在栈上访问更快",
            "传 const 指针，只复制一个地址（本机 8 字节）",
            "改成全局变量，让函数直接改它"
          ],
          answer: 2,
          explain: "按值传参在语义上必须产生一份拷贝，传指针只复制地址，所以 C 对。A 错：编译器只能在不改变可观察行为的前提下省略拷贝，函数里一旦读取成员就必须有真实对象。B 错：把 4096 字节搬到栈上反而更慢。D 错：全局变量会让数据流向难以追踪，还带来重入和线程安全问题，是设计上的倒退。"
        }
      ],
      passRatio: 0.8,
      mission: "写一个完整的 C 程序，亲手量出「顺序」和「对齐」的影响：\n"
        + "1) 用 typedef 定义两个成员相同、顺序不同的结构体：typedef struct { char tag; int value; char flag; } Wide; 和 typedef struct { int value; char tag; char flag; } Tight;；\n"
        + "2) 打印一行：Wide: size = 12, offset(value) = 4, offset(flag) = 8（大小用 sizeof(Wide)，成员偏移用 offsetof(Wide, value) 和 offsetof(Wide, flag)，需要 #include <stddef.h>）；\n"
        + "3) 打印一行：Tight: size = 8；\n"
        + "4) 定义 int m[4][4]，用双层循环填成 m[i][j] = i * 4 + j；写两个函数 sum_row_major 与 sum_col_major，分别按行、按列求和，各打印一行（结果都是 120）；\n"
        + "5) 写函数 same_block_hits(int m[N][N], int row_major)：按给定顺序遍历，统计相邻两次访问是否落在同一个 16 字节块里（用数组内部的字节偏移除以 16 得到块号），打印：same-block hits: row = 12, col = 0；\n"
        + "6) 最后 return 0;。\n"
        + "在本机编译运行，确认五行输出与上面一致。",
      starter: "#include <stdio.h>\n"
        + "#include <stddef.h>\n\n"
        + "#define N 4\n"
        + "#define BLOCK 16\n\n"
        + "/* 1) 定义 Wide 和 Tight 两个 typedef 结构体 */\n\n"
        + "/* 4) sum_row_major / sum_col_major */\n\n"
        + "/* 5) same_block_hits：按 row_major 决定先走行还是先走列 */\n\n"
        + "int main(void) {\n"
        + "    int m[N][N];\n"
        + "    int i, j;\n\n"
        + "    /* 填 m[i][j] = i * N + j */\n\n"
        + "    /* 打印 row-major sum、col-major sum、same-block hits */\n\n"
        + "    /* 打印 Wide 的 size 与两个 offsetof，再打印 Tight 的 size */\n\n"
        + "    return 0;\n"
        + "}",
      hint: "同一个数组内部的地址关系是有定义的：用 (const unsigned char *)&m[r][c] 减去首元素地址，就得到字节偏移，再除以 BLOCK 得到块号。两种顺序的区别只在「第 step 次访问的是哪一行哪一列」：按行时 r = step / N、c = step % N，按列时两者互换。打印偏移直接用 offsetof(Wide, value)，它来自 <stddef.h>。",
      check: {
        include: ["stdio.h", "stddef.h"],
        return0: true,
        require: { typedef: true, array: true, loop: true, funcs: ["same_block_hits", "sum_row_major", "sum_col_major"] },
        seq: [["offsetof", "(", "Wide"], ["same_block_hits", "(", "m"]],
        calls: [["printf", "row-major sum"], ["printf", "col-major sum"], ["printf", "same-block hits"], ["printf", "Wide: size"], ["printf", "Tight: size"]],
        minStatements: 12,
        message: "需要 #include <stdio.h> 与 <stddef.h>、用 typedef 定义 Wide 和 Tight、int m[N][N] 与双层循环、自己定义的 sum_row_major / sum_col_major / same_block_hits，以及 row-major sum / col-major sum / same-block hits / Wide: size / Tight: size 五行输出，最后 return 0; 。",
        ok: "结构体布局与两种遍历顺序都量出来了，结构完整。"
      },
      expectedOutput: "row-major sum = 120\ncol-major sum = 120\nsame-block hits: row = 12, col = 0\nWide: size = 12, offset(value) = 4, offset(flag) = 8\nTight: size = 8",
      solution: "#include <stdio.h>\n"
        + "#include <stddef.h>\n\n"
        + "#define N 4\n"
        + "#define BLOCK 16\n\n"
        + "typedef struct {\n"
        + "    char tag;\n"
        + "    int value;\n"
        + "    char flag;\n"
        + "} Wide;\n\n"
        + "typedef struct {\n"
        + "    int value;\n"
        + "    char tag;\n"
        + "    char flag;\n"
        + "} Tight;\n\n"
        + "static int sum_row_major(int m[N][N]) {\n"
        + "    int i, j, total = 0;\n"
        + "    for (i = 0; i < N; i++) {\n"
        + "        for (j = 0; j < N; j++) {\n"
        + "            total += m[i][j];\n"
        + "        }\n"
        + "    }\n"
        + "    return total;\n"
        + "}\n\n"
        + "static int sum_col_major(int m[N][N]) {\n"
        + "    int i, j, total = 0;\n"
        + "    for (j = 0; j < N; j++) {\n"
        + "        for (i = 0; i < N; i++) {\n"
        + "            total += m[i][j];\n"
        + "        }\n"
        + "    }\n"
        + "    return total;\n"
        + "}\n\n"
        + "/* 数一数相邻两次访问是否落在同一个 16 字节块里 */\n"
        + "static int same_block_hits(int m[N][N], int row_major) {\n"
        + "    const unsigned char *base = (const unsigned char *)&m[0][0];\n"
        + "    long prev = -1;\n"
        + "    int hits = 0;\n"
        + "    int step;\n"
        + "    for (step = 0; step < N * N; step++) {\n"
        + "        int r = row_major ? step / N : step % N;\n"
        + "        int c = row_major ? step % N : step / N;\n"
        + "        long block = (long)((const unsigned char *)&m[r][c] - base) / BLOCK;\n"
        + "        if (prev >= 0 && block == prev) {\n"
        + "            hits++;\n"
        + "        }\n"
        + "        prev = block;\n"
        + "    }\n"
        + "    return hits;\n"
        + "}\n\n"
        + "int main(void) {\n"
        + "    int m[N][N];\n"
        + "    int i, j;\n\n"
        + "    for (i = 0; i < N; i++) {\n"
        + "        for (j = 0; j < N; j++) {\n"
        + "            m[i][j] = i * N + j;\n"
        + "        }\n"
        + "    }\n\n"
        + "    printf(\"row-major sum = %d\\n\", sum_row_major(m));\n"
        + "    printf(\"col-major sum = %d\\n\", sum_col_major(m));\n"
        + "    printf(\"same-block hits: row = %d, col = %d\\n\",\n"
        + "           same_block_hits(m, 1), same_block_hits(m, 0));\n\n"
        + "    printf(\"Wide: size = %d, offset(value) = %d, offset(flag) = %d\\n\",\n"
        + "           (int)sizeof(Wide), (int)offsetof(Wide, value),\n"
        + "           (int)offsetof(Wide, flag));\n"
        + "    printf(\"Tight: size = %d\\n\", (int)sizeof(Tight));\n"
        + "    return 0;\n"
        + "}",
      mastery: [
        "能用 sizeof 估算按值传参的拷贝成本，并改成传 const 指针",
        "能解释二维数组按行遍历为什么更缓存友好，并说出链表在这方面的劣势",
        "能用 sizeof 和 offsetof 量出结构体的填充，并通过重排成员减小它",
        "能说清 -O2 改变的只是速度，以及什么情况下输出会发生变化"
      ]
    },
    {
      id: 80,
      title: "综合实战：手写 strlen、memcpy 与字符串反转",
      minutes: 25,
      gist: "把整门课的知识收拢成三个自己实现的函数，再和标准库比结果、比量级——不看时间，只看正确性与复杂度。",
      lesson: "这一关不引入新概念，而是把前面学过的东西合成三个函数，并和标准库对照。\n"
        + "第一个是自己的 strlen。字符串在内存里就是一串字符加上结尾的 '\\0'，所谓长度就是「从首字符走到结尾符需要几步」。只读遍历用 const char *，用一个游标 p 一直走到 *p == '\\0'，再 return (size_t)(p - s)。指针相减得到的是两个地址之间的元素个数，对 char 来说就是字节数；p 停下的位置正好是结尾符，所以差就是不含结尾符的长度。长度类型用 size_t（无符号），不要用 int 存长度，也不要在循环条件里让 int 和 size_t 比较——那会带来符号比较的麻烦。\n"
        + "第二个是自己的 memcpy。它按字节复制 n 个字节，所以形参用 void * 接收任意类型，函数内部再转成 unsigned char * 逐字节走。用 unsigned char 而不是 char，是因为字节运算不该受「char 是否有符号」影响。返回值按标准约定返回目标指针，这样可以链式使用。要注意：memcpy 要求两块内存不能重叠，重叠必须用 memmove——这不是标准库的脾气，而是重叠时的复制结果在逻辑上无法定义：从前向后复制会把还没读到的源数据提前覆盖掉。\n"
        + "第三个是字符串反转。用两个下标 i 和 j 从两端向中间走，交换 s[i] 与 s[j]，走到相遇为止，循环次数是 len / 2，整体是线性复杂度。这里最容易踩的坑是 size_t 下溢：如果写 size_t j = len - 1; 而 len 恰好是 0，j 就变成 SIZE_MAX，循环直接越界。所以要么先判断 len < 2 直接返回，要么用 len - 1 - i 这种不会下溢的形式。\n"
        + "最后是「和标准库比」。比什么？比结果：同样的输入，两边的输出必须逐字节一致——用 memcmp 比较整个缓冲区，而不是只比较字符串（只比较字符串会漏掉结尾符的问题）。比量级：两个 strlen 都是 O(n)，两个 memcpy 都是 O(n)，反转是 O(n) 且只做 n/2 次交换；复杂度量级相同，差别只在常数因子——标准库通常用更宽的传输宽度和 SIMD 指令，一次搬 16 或 32 字节，所以更快，但它不会改变复杂度。\n"
        + "为什么本关不打印时间？因为运行时间取决于机器负载、编译选项和操作系统调度，在你机器上量出的毫秒数换台机器就失去意义，还很容易得出错误结论。用「操作次数」和「复杂度量级」描述性能，才是可复现、可讨论的方式。自己实现这些函数的意义也不在于「比标准库快」（通常做不到），而在于理解字符串和内存到底是什么，以及标准库函数背后那些边界条件。\n"
        + "读别人的代码时，看到手写的字符串循环，先看三点：结尾符有没有被正确终止（漏掉就是越界读）、长度有没有用 size_t、内存重叠的场景有没有改用 memmove。",
      example: {
        code: "#include <stdio.h>\n"
          + "#include <string.h>\n\n"
          + "/* 自己数长度：一路走到结尾符 '\\0' */\n"
          + "static size_t my_strlen(const char *s) {\n"
          + "    const char *p = s;\n"
          + "    while (*p != '\\0') {\n"
          + "        p++;\n"
          + "    }\n"
          + "    return (size_t)(p - s);\n"
          + "}\n\n"
          + "/* 自己按字节复制 n 个字节 */\n"
          + "static void *my_memcpy(void *dst, const void *src, size_t n) {\n"
          + "    unsigned char *d = (unsigned char *)dst;\n"
          + "    const unsigned char *s = (const unsigned char *)src;\n"
          + "    size_t i;\n"
          + "    for (i = 0; i < n; i++) {\n"
          + "        d[i] = s[i];\n"
          + "    }\n"
          + "    return dst;\n"
          + "}\n\n"
          + "int main(void) {\n"
          + "    const char *text = \"systems\";\n"
          + "    char buf[16] = {0};\n"
          + "    size_t mine;\n"
          + "    size_t theirs;\n"
          + "    size_t i;\n\n"
          + "    mine = my_strlen(text);\n"
          + "    theirs = strlen(text);\n"
          + "    printf(\"text = %s\\n\", text);\n"
          + "    printf(\"my_strlen = %u, strlen = %u, agree = %d\\n\",\n"
          + "           (unsigned)mine, (unsigned)theirs, mine == theirs);\n\n"
          + "    my_memcpy(buf, text, mine + 1);\n"
          + "    printf(\"copy = %s, memcmp agrees = %d\\n\",\n"
          + "           buf, memcmp(buf, text, mine + 1) == 0);\n\n"
          + "    for (i = 0; i < mine / 2; i++) {\n"
          + "        char t = buf[i];\n"
          + "        buf[i] = buf[mine - 1 - i];\n"
          + "        buf[mine - 1 - i] = t;\n"
          + "    }\n"
          + "    printf(\"reversed = %s, length unchanged = %d\\n\",\n"
          + "           buf, my_strlen(buf) == mine);\n"
          + "    return 0;\n"
          + "}",
        output: "text = systems\nmy_strlen = 7, strlen = 7, agree = 1\ncopy = systems, memcmp agrees = 1\nreversed = smetsys, length unchanged = 1",
        explain: "第 5 到 11 行的 my_strlen 用一个只读游标走到结尾符，最后返回 (size_t)(p - s)：p 停在 '\\0' 上，s 指向首字符，差值正好是不含结尾符的长度。"
          + "第 14 到 22 行的 my_memcpy 按字节复制：形参用 void * 接收任意类型，函数内部转成 unsigned char * 逐字节走，返回目标指针以符合标准库的约定。"
          + "第 31、32 行把两个长度都算出来：我们自己实现的得到 7，标准库 strlen 也是 7，第 34 行的 mine == theirs 打印 1，说明结果一致。"
          + "第 37 行复制的是 mine + 1 个字节，多出来的那个 1 就是把结尾符一起搬过去——这样 buf 才是一个完整的字符串，第 38 行用 memcmp 比较整个缓冲区也得到 1。"
          + "第 41 到 45 行做原地反转：i 从前往后、mine - 1 - i 从后往前，交换 len / 2 次。用 mine - 1 - i 而不是先算 j = mine - 1 再 j--，可以避开 size_t 在 len 为 0 时的下溢。"
          + "第 46、47 行验证反转结果：systems 变成 smetsys，长度仍然是 7——反转只改顺序，不改长度。"
      },
      pitfalls: [
        "目标缓冲区不够大：复制 strlen(src) + 1 个字节，少一个字节就会漏掉结尾的 '\\0'，之后用 %s 打印就会越界读。",
        "忘记复制结尾符：只复制 strlen(src) 个字节，目标缓冲区里就没有终止符，printf 会一直读到内存里碰巧出现的 0。",
        "size_t 下溢：size_t len = 0; 再写 len - 1，得到的是 SIZE_MAX，循环会一路越界；先判断 len < 2，或者用 len - 1 - i。",
        "用 int 存长度：size_t 是无符号类型，和 int 混用会带来符号比较警告和潜在逻辑错误。",
        "用 memcpy 处理重叠内存：重叠必须用 memmove，memcpy 对重叠内存的行为是未定义的。",
        "用 scanf(\"%s\", buf) 读字符串却不限制长度：输入过长就会写越界；本课统一写 scanf(\"%63s\", buf)（64 字节的缓冲区，留一个位置给结尾符）。"
      ],
      takeaways: [
        "strlen 的本质是走到 '\\0' 的步数；指针相减得到元素个数，长度类型是 size_t",
        "memcpy 按字节复制 n 个字节，内部用 unsigned char *；复制字符串要带结尾符（n = strlen + 1）",
        "反转用两端向中间交换，循环 len / 2 次，注意 size_t 不能下溢",
        "重叠内存必须用 memmove，memcpy 对重叠内存是未定义行为",
        "和标准库比性能，比的是结果与复杂度量级，而不是本机的运行时间"
      ],
      questions: [
        {
          q: "size_t my_strlen(const char *s) 里 return (size_t)(p - s); 得到的是什么？",
          options: [
            "字符串长度（不含结尾符 '\\0'）：p 停在 '\\0' 上，s 指向首字符",
            "字符串里所有字符编码值的总和",
            "指针 p 本身占多少字节",
            "长度还要再减 1，因为要把 '\\0' 排除掉"
          ],
          answer: 0,
          explain: "指针相减得到两个地址之间的元素个数，对 char 就是字节数。p 停下的位置是结尾符，s 是首字符，所以差值正好是不含结尾符的长度，A 对。B 描述的是「把字符值累加」，和指针相减无关。C 错：指针大小用 sizeof(p) 得到，与两指针之差无关。D 错：结尾符本身没有被计入——循环在它之前就停止了。"
        },
        {
          q: "my_memcpy(dst, src, n) 要复制一个以 '\\0' 结尾的字符串，n 应该取多少？",
          options: [
            "strlen(src)，结尾符不用复制",
            "strlen(src) + 1，把结尾的 '\\0' 一起复制过去",
            "sizeof(src)（src 是指针，结果是 8）",
            "任意值，memcpy 会自动补上 '\\0'"
          ],
          answer: 1,
          explain: "字符串的有效内容包含结尾符，要得到一个完整可用的副本就必须连它一起复制，所以 n 取 strlen(src) + 1，B 对。A 会让目标缓冲区缺少终止符，之后用 %s 打印就是越界读。C 错：src 是 const char *，sizeof 得到的是指针大小，不是字符串长度。D 错：memcpy 只按 n 复制字节，它不看内容，更不会替你补 '\\0'。"
        },
        {
          q: "自己实现的 memcpy 和标准库 memcpy 相比，说法正确的是？",
          options: [
            "标准库的复杂度一定比自己的低",
            "自己实现的更快，因为标准库有额外的检查",
            "两者都是 O(n)，结果必须逐字节相同，差别只在常数因子",
            "自己实现的不能用于重叠内存，标准库可以"
          ],
          answer: 2,
          explain: "两者都按字节线性搬运，复杂度同为 O(n)，只是标准库通常用更宽的传输宽度和 SIMD 指令，常数更小，所以 C 对。A 错：复杂度量级相同。B 错：通常标准库更快，它并不是靠「检查」变慢。D 错：memcpy 本身对重叠内存的行为就是未定义的，标准库也不例外——需要处理重叠时必须用 memmove，自己实现也应当遵守同样的约定。"
        }
      ],
      passRatio: 0.8,
      mission: "写一个完整的 C 程序，自己实现三个函数并与标准库对照：\n"
        + "1) 自己写 size_t my_strlen(const char *s)：用游标走到结尾符，再用指针相减得到长度；\n"
        + "2) 自己写 void *my_memcpy(void *dst, const void *src, size_t n)：内部转成 unsigned char * 逐字节复制，返回 dst；\n"
        + "3) 自己写 int reverse(char *s)：从两端向中间交换，返回交换了多少对（循环 len / 2 次，注意 size_t 不能下溢）；\n"
        + "4) main 里定义 char word[64] = {0}; 和 char copy[64] = {0};，用 scanf(\"%63s\", word) 读一个单词（读不到就打印 no input 并 return 1）；复制请用你自己写的 my_memcpy，不要用 strcpy；\n"
        + "5) 依次打印下面五行（以输入 hello 为例）：\n"
        + "word = hello\n"
        + "my_strlen = 5, strlen = 5, agree = 1\n"
        + "copy = hello, memcmp agrees = 1\n"
        + "my_memcpy moved 6 bytes\n"
        + "reversed = olleh, swaps = 2\n"
        + "其中第四行的 6 是 strlen + 1（结尾符也复制过去了），第五行的 2 是 len / 2；\n"
        + "6) 最后 return 0;。\n"
        + "在本机编译运行，输入 hello，确认五行输出与上面一致。",
      starter: "#include <stdio.h>\n"
        + "#include <string.h>\n\n"
        + "#define CAP 64\n\n"
        + "/* my_strlen：只读游标走到 '\\0'，返回指针之差 */\n\n"
        + "/* my_memcpy：unsigned char * 逐字节复制，返回 dst */\n\n"
        + "/* reverse：两端向中间交换，返回交换次数 */\n\n"
        + "int main(void) {\n"
        + "    char word[CAP] = {0};\n"
        + "    char copy[CAP] = {0};\n\n"
        + "    /* scanf(\"%63s\", word)，检查返回值 */\n\n"
        + "    /* 打印 word、两个长度与 agree */\n\n"
        + "    /* my_memcpy(copy, word, my_strlen(word) + 1) 后打印 copy 与 memcmp 结果 */\n\n"
        + "    /* 反转 copy，打印 reversed 与 swaps */\n\n"
        + "    return 0;\n"
        + "}",
      hint: "my_strlen 里先保存首地址 s，再用另一个游标 p 走到结尾符，最后 return (size_t)(p - s)。my_memcpy 的循环是 d[i] = s[i];，循环变量用 size_t。reverse 用 i 和 len - 1 - i 两端交换，循环条件 i < len / 2，交换一次就给计数器加一。复制时长度要写 mine + 1，把结尾符带上，否则后面用 %s 打印会越界。",
      check: {
        include: ["stdio.h", "string.h"],
        return0: true,
        require: { funcs: ["my_strlen", "my_memcpy", "reverse"] },
        seq: [["my_memcpy", "(", "copy"], ["reverse", "(", "copy"]],
        calls: [["scanf", "%63s"], ["printf", "my_strlen"], ["printf", "memcmp agrees"], ["printf", "reversed"]],
        forbid: ["strcpy"],
        minStatements: 12,
        message: "需要 #include <stdio.h> 与 <string.h>、自己定义的 my_strlen / my_memcpy / reverse、用 scanf(\"%63s\") 读入、在 main 里调用 my_memcpy(copy, ...) 和 reverse(copy)，以及 my_strlen / memcmp agrees / reversed 这几行输出，最后 return 0; 。",
        ok: "三个函数都自己实现并和标准库对上了，结构完整。"
      },
      input: "hello",
      expectedOutput: "word = hello\nmy_strlen = 5, strlen = 5, agree = 1\ncopy = hello, memcmp agrees = 1\nmy_memcpy moved 6 bytes\nreversed = olleh, swaps = 2",
      solution: "#include <stdio.h>\n"
        + "#include <string.h>\n\n"
        + "#define CAP 64\n\n"
        + "static size_t my_strlen(const char *s) {\n"
        + "    const char *p = s;\n"
        + "    while (*p != '\\0') {\n"
        + "        p++;\n"
        + "    }\n"
        + "    return (size_t)(p - s);\n"
        + "}\n\n"
        + "static void *my_memcpy(void *dst, const void *src, size_t n) {\n"
        + "    unsigned char *d = (unsigned char *)dst;\n"
        + "    const unsigned char *s = (const unsigned char *)src;\n"
        + "    size_t i;\n"
        + "    for (i = 0; i < n; i++) {\n"
        + "        d[i] = s[i];\n"
        + "    }\n"
        + "    return dst;\n"
        + "}\n\n"
        + "/* 原地反转，返回交换了多少对 */\n"
        + "static int reverse(char *s) {\n"
        + "    size_t len = my_strlen(s);\n"
        + "    size_t i;\n"
        + "    int swaps = 0;\n"
        + "    for (i = 0; i < len / 2; i++) {\n"
        + "        char t = s[i];\n"
        + "        s[i] = s[len - 1 - i];\n"
        + "        s[len - 1 - i] = t;\n"
        + "        swaps++;\n"
        + "    }\n"
        + "    return swaps;\n"
        + "}\n\n"
        + "int main(void) {\n"
        + "    char word[CAP] = {0};\n"
        + "    char copy[CAP] = {0};\n"
        + "    size_t mine;\n"
        + "    size_t theirs;\n"
        + "    int swaps;\n\n"
        + "    if (scanf(\"%63s\", word) != 1) {\n"
        + "        printf(\"no input\\n\");\n"
        + "        return 1;\n"
        + "    }\n\n"
        + "    mine = my_strlen(word);\n"
        + "    theirs = strlen(word);\n"
        + "    printf(\"word = %s\\n\", word);\n"
        + "    printf(\"my_strlen = %u, strlen = %u, agree = %d\\n\",\n"
        + "           (unsigned)mine, (unsigned)theirs, mine == theirs);\n\n"
        + "    my_memcpy(copy, word, mine + 1);\n"
        + "    printf(\"copy = %s, memcmp agrees = %d\\n\",\n"
        + "           copy, memcmp(copy, word, mine + 1) == 0);\n"
        + "    printf(\"my_memcpy moved %u bytes\\n\", (unsigned)(mine + 1));\n\n"
        + "    swaps = reverse(copy);\n"
        + "    printf(\"reversed = %s, swaps = %d\\n\", copy, swaps);\n"
        + "    return 0;\n"
        + "}",
      mastery: [
        "能不看库函数手写 strlen、memcpy 和字符串反转，并正确处理结尾符",
        "能说清指针相减为什么等于长度，以及长度为什么用 size_t",
        "能解释 memcpy 与 memmove 的区别，并在重叠场景选对函数",
        "能用「结果一致 + 复杂度量级」而不是运行时间来和标准库做对比"
      ]
    }
  ]
});