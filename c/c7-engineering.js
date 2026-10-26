/* ============================================================================
 * HT Lab · C 语言课程 · 模块 7 · 预处理器与工程实践
 * 关卡 id：57–64
 * 每关的示例代码与标准答案都用 Dev-C++ 自带 gcc 4.9.2（-std=c11 -Wall -Wextra）
 * 真实编译并运行过，零警告；example.output 与 expectedOutput 是实际输出。
 * Makefile / gdb / valgrind / 多文件结构属于「非单文件」内容，写在 lesson 里用
 * 代码块讲清，并配可运行的单文件示例做对照。
 * ==========================================================================*/
window.C_MODULES = window.C_MODULES || [];
window.C_MODULES.push({
  id: "c7",
  name: "模块 7 · 预处理器与工程实践",
  levels: [
    {
      id: 57,
      title: "宏定义与带参宏：括号陷阱与副作用",
      minutes: 18,
      gist: "看懂 #define 的文本替换本质，写出不会被运算符优先级和副作用坑到的宏。",
      lesson: "C 程序的编译分好几步，第一步是预处理：编译器还没开始理解你的代码，先由预处理器把 # 开头的行处理掉。#define 就是给预处理器下命令——把某个名字替换成一段文本。\n"
        + "对象式宏最简单：#define PI 3.14159 之后，代码里每个 PI 都会被换成 3.14159。它不是变量：没有类型、没有地址、不占内存，调试器里也看不到它，因为它在调试开始之前就已经消失了。\n"
        + "带参宏看起来像函数：#define SQ(x) ((x) * (x))。但它只是文本替换，参数不是「先算好再传进去」，而是把实参原样塞进替换文本。所以括号是保命的：\n"
        + "#define BAD_SQ(x) x * x          /* 没有括号 */\n"
        + "BAD_SQ(1 + 2)  →  1 + 2 * 1 + 2  →  5      结果不是 9\n"
        + "#define SQ(x) ((x) * (x))        /* 参数和整体都加括号 */\n"
        + "SQ(1 + 2)      →  ((1 + 2) * (1 + 2))  →  9   正确\n"
        + "规则两条：每个参数外面加一层括号，整个替换文本外面再加一层括号。少任何一层都可能被优先级咬到。\n"
        + "第二个坑是副作用：宏参数在替换文本里出现几次，就会被求值几次。SQ(next_value()) 展开成 ((next_value()) * (next_value()))，函数被调用了两次，计数器加了 2——括号只解决优先级，解决不了重复求值。想要「只求值一次」并且有类型检查，就写成函数：int sq(int x) { return x * x; }。这也是现代 C 里带参宏越来越少的原因。\n"
        + "最后一个细节：#define 行末尾不要写分号。宏体是「一段文本」，不是一条语句。写成 #define MAX 100; 之后，if (n > MAX) 会展开成 if (n > 100;) ——编译器报 expected ')' before ';' token，并在提示里写 in expansion of macro 'MAX'。（如果只在 int a = MAX; 这种位置用，多出来的分号恰好是空语句，反而看不出问题，所以更危险。）\n"
        + "读别人的代码时：看到全大写的名字（MAX_SIZE、PASS_LINE）就想到「这可能是宏」，去文件顶部找定义；看到带参宏，第一件事是数一数参数在替换文本里出现了几次。",
      example: {
        code: "#include <stdio.h>\n"
          + "\n"
          + "/* 对象式宏：预处理阶段做纯文本替换 */\n"
          + "#define PI 3.14159\n"
          + "/* 带参宏：每个参数都加括号，整体再加一层括号 */\n"
          + "#define AREA(r) (PI * (r) * (r))\n"
          + "#define SQ(x) ((x) * (x))\n"
          + "/* 反面示例：没有括号的带参宏 */\n"
          + "#define BAD_SQ(x) x * x\n"
          + "\n"
          + "static int calls = 0;\n"
          + "\n"
          + "static int next_value(void) {\n"
          + "    calls++;\n"
          + "    return calls;\n"
          + "}\n"
          + "\n"
          + "/* 函数：参数只求值一次，还有类型检查 */\n"
          + "static int sq(int x) {\n"
          + "    return x * x;\n"
          + "}\n"
          + "\n"
          + "int main(void) {\n"
          + "    printf(\"PI = %.5f\\n\", PI);\n"
          + "    printf(\"AREA(2.0) = %.5f\\n\", AREA(2.0));\n"
          + "    printf(\"SQ(3 + 1) = %d\\n\", SQ(3 + 1));\n"
          + "    printf(\"BAD_SQ(3 + 1) = %d\\n\", BAD_SQ(3 + 1));\n"
          + "\n"
          + "    int from_macro = SQ(next_value());\n"
          + "    printf(\"SQ(next_value()) = %d, calls = %d\\n\", from_macro, calls);\n"
          + "\n"
          + "    calls = 0;\n"
          + "    int from_func = sq(next_value());\n"
          + "    printf(\"sq(next_value()) = %d, calls = %d\\n\", from_func, calls);\n"
          + "\n"
          + "    return 0;\n"
          + "}",
        output: "PI = 3.14159\n"
          + "AREA(2.0) = 12.56636\n"
          + "SQ(3 + 1) = 16\n"
          + "BAD_SQ(3 + 1) = 7\n"
          + "SQ(next_value()) = 2, calls = 2\n"
          + "sq(next_value()) = 1, calls = 1",
        explain: "这个例子里有四个宏：PI 是对象式宏，AREA 与 SQ 的参数和整体都加了括号，BAD_SQ 是故意不加括号的反面例子。\n"
          + "next_value() 每次调用都让计数器 calls 加一，专门用来暴露「参数被求值几次」；sq() 是函数版本，参数只求值一次，放在一起对照。\n"
          + "两行乘法输出把优先级问题讲清了：SQ(3 + 1) 展开成 ((3 + 1) * (3 + 1)) 得 16，BAD_SQ(3 + 1) 展开成 3 + 1 * 3 + 1 得 7——加不加括号差一倍。\n"
          + "最后两行是副作用：SQ(next_value()) 把参数替换了两次，函数被调用两次（calls = 2，结果是 1 × 2 = 2）；sq(next_value()) 只调用一次（calls = 1，结果是 1 × 1 = 1）。括号能修优先级，修不了重复求值。"
      },
      pitfalls: [
        "没加括号的带参宏：`#define BAD_SQ(x) x * x` 之后 `BAD_SQ(3 + 1)` 得到 7 而不是 16，因为展开成了 `3 + 1 * 3 + 1`。",
        "宏体末尾手滑加分号：`#define MAX 100;` 之后 `if (n > MAX)` 展开成 `if (n > 100;)`，gcc 报 `expected ')' before ';' token`，并在下面提示 `in expansion of macro 'MAX'`。",
        "把带副作用的表达式传给带参宏：`SQ(i++)` 展开后 i 被加了两次，这类写法属于未定义行为，必须改写成函数，或者先把值存进变量。",
        "以为宏有类型检查：`SQ` 传 double、char 甚至指针都能「编译通过」，只是结果可能毫无意义——编译器看不到宏这一层。"
      ],
      takeaways: [
        "#define 是预处理阶段的纯文本替换，没有类型、没有作用域、调试器看不到",
        "带参宏的每个参数都要加括号，整个替换文本外层再加一层",
        "参数在宏体里出现几次就会被求值几次，需要单次求值就用函数",
        "宏定义末尾不要写分号，否则会在表达式里变成语法错误"
      ],
      questions: [
        {
          q: "关于 `#define SQ(x) ((x) * (x))`，下面哪种说法正确？",
          options: [
            "它是文本替换：编译器看不到 SQ 这个名字，调试器里也看不到",
            "它和函数一样，会先把实参算好再代入",
            "它有类型检查，传 double 会编译报错",
            "它会为参数分配一块内存"
          ],
          answer: 0,
          explain: "带参宏在预处理阶段就完成替换，没有求值、没有类型检查、不分配内存，也不会出现在调试信息里。B 描述的是函数的行为；C、D 都是把宏当成了函数。"
        },
        {
          q: "执行 `#define BAD(x) x * x` 后，`printf(\"%d\", BAD(1 + 2));` 输出什么？",
          options: [
            "9",
            "5",
            "6",
            "编译报错"
          ],
          answer: 1,
          explain: "展开后是 `1 + 2 * 1 + 2`，乘法先算，得 1 + 2 + 2 = 5。要得到 9 必须写成 `((x) * (x))`：括号少了，优先级就会改写你的算式。"
        },
        {
          q: "写了 `#define MAX 100;`（末尾多一个分号），随后 `if (n > MAX) { ... }` 会怎样？",
          options: [
            "正常编译，等价于 n > 100",
            "编译通过，但运行时结果不确定",
            "编译报错，因为展开成 `if (n > 100;)`",
            "预处理阶段就报错，说宏定义不合法"
          ],
          answer: 2,
          explain: "宏体是纯文本，分号被一起塞进表达式，编译器看到的是 `if (n > 100;)`，报 `expected ')' before ';' token`。预处理本身不会报错（D 错），也轮不到运行时（B 错）。"
        }
      ],
      passRatio: 0.8,
      mission: "写一个单文件程序，用宏算出三个结果并按顺序输出三行：\n"
        + "1. SQ(3) = 9 —— 数字 3 直接传给带参宏 SQ；\n"
        + "2. SQ(1 + 2) = 9 —— 把 1 + 2 这个表达式直接传给 SQ，不要先算好再传，这正是检验括号的地方；\n"
        + "3. circle area = 12.56636 —— 用 %.5f 输出 CIRCLE_AREA(2.0)。\n"
        + "要求：顶部用 #define 定义对象式宏 PI（3.14159）、带参宏 SQ(x) 与 CIRCLE_AREA(r)，两个带参宏的参数和整体都要带括号；不要用 pow() 代替宏。写完在本机编译运行，把输出粘贴到「运行结果比对」。",
      starter: "#include <stdio.h>\n"
        + "\n"
        + "/* TODO: 在这里写 PI、SQ(x)、CIRCLE_AREA(r) 三个宏 */\n"
        + "\n"
        + "int main(void) {\n"
        + "    /* TODO: 三行输出 */\n"
        + "\n"
        + "    return 0;\n"
        + "}",
      hint: "两个带参宏都按 `#define SQ(x) ((x) * (x))` 的样式写：每个参数加一层括号，整个表达式再加一层。宏定义行末尾不要写分号。输出用 %.5f 才不会丢小数位；先在本机跑一遍，确认第二行是 9 而不是 5。",
      check: {
        include: ["stdio.h"],
        return0: true,
        seq: [["SQ","(","1","+","2",")"]],
        calls: [["printf","SQ(3) = "],["printf","SQ(1 + 2) = "],["printf","circle area = "]],
        callCounts: [["printf",2,6]],
        forbid: ["pow"],
        minStatements: 4,
        message: "需要 #include <stdio.h>、int main(void)、用宏 SQ 和 CIRCLE_AREA 输出那三行，以及 return 0;（第二行要把 1 + 2 直接传给 SQ）。",
        ok: "宏定义、括号写法与三行输出都到位了。"
      },
      expectedOutput: "SQ(3) = 9\n"
          + "SQ(1 + 2) = 9\n"
          + "circle area = 12.56636",
      solution: "#include <stdio.h>\n"
          + "\n"
          + "#define PI 3.14159\n"
          + "#define CIRCLE_AREA(r) (PI * (r) * (r))\n"
          + "#define SQ(x) ((x) * (x))\n"
          + "\n"
          + "int main(void) {\n"
          + "    printf(\"SQ(3) = %d\\n\", SQ(3));\n"
          + "    printf(\"SQ(1 + 2) = %d\\n\", SQ(1 + 2));\n"
          + "    printf(\"circle area = %.5f\\n\", CIRCLE_AREA(2.0));\n"
          + "    return 0;\n"
          + "}",
      mastery: [
        "能写出带括号的带参宏，并说清少一层括号会出现什么结果",
        "能解释为什么带参宏的参数会被求值多次，以及什么时候该改用函数",
        "看到 expected ')' before ';' 这类报错时，会去检查宏体是不是多写了分号"
      ]
    },
    {
      id: 58,
      title: "条件编译与头文件守卫：一份代码多种版本",
      minutes: 18,
      gist: "用 #if / #ifdef / #ifndef 做调试开关，用头文件守卫防止重复包含。",
      lesson: "以 # 开头的行都是给预处理器看的指令。上一关的 #define 负责替换文本，这一关的 #if / #ifdef / #ifndef 负责「决定哪些代码留下来」。\n"
        + "最常见的用途是调试开关：\n"
        + "#define DEBUG 1\n"
        + "#if DEBUG\n"
        + "    printf(\"[debug] i = %d\\n\", i);\n"
        + "#endif\n"
        + "DEBUG 是 1 就留下这段打印；把它注释掉或改成 0，重新编译后这段代码在编译之前就被删掉了——不是运行时跳过，而是根本不存在。这一点很关键：条件不成立的分支里即使写了语法错误，编译器也看不到。命令行定义同样有效：gcc -DDEBUG app.c 等价于在文件顶部写 #define DEBUG 1。\n"
        + "#ifdef X 和 #ifndef X 是简写形式：前者判断「X 定义过吗」，后者判断「X 没被定义吗」。配合 #else、#elif 可以给出分支；#if 0 … #endif 则是临时「注释掉」一大段代码的常用手段（比 /* */ 安全，因为里面还能再写注释）。\n"
        + "头文件守卫就是 #ifndef 最经典的用法。假设 stats.h 里放了函数声明与宏，而 main.c 既包含了 stats.h，又包含了另一个也 #include \"stats.h\" 的 grades.h——同一个头文件被展开两次，类型、宏、结构体就会重复定义，编译报 redefinition 或 conflicting types。守卫写法：\n"
        + "#ifndef HTLAB_STATS_H\n"
        + "#define HTLAB_STATS_H\n"
        + "/* 头文件内容：声明、宏、类型 */\n"
        + "#endif\n"
        + "第一次包含时 HTLAB_STATS_H 还不存在，内容被展开，同时把这个名字定义下来；第二次包含时名字已存在，整段直接跳过。宏名习惯用「文件名 + _H」，全大写并加项目前缀，避免和别人的头文件撞名。\n"
        + "另一种写法是文件第一行写 #pragma once。它不是 C 标准的一部分，但主流编译器都支持，效果一样、更短；代价是依赖编译器扩展。学会 #ifndef 写法更重要，因为你在别人的代码里一定会见到它。\n"
        + "最后提醒：守卫防的是「同一个头文件被重复包含」，防不了「同一个函数被定义在两个不同的 .c 里」——后者要靠声明与定义分开，也就是下一关的内容。",
      example: {
        code: "#include <stdio.h>\n"
          + "\n"
          + "/* 头文件守卫的写法：被重复包含时，第二次会因为宏已定义而整段跳过 */\n"
          + "#ifndef HTLAB_CONFIG_H\n"
          + "#define HTLAB_CONFIG_H\n"
          + "#define VERSION 2\n"
          + "#endif\n"
          + "\n"
          + "/* 调试开关：改成 0 重新编译，调试输出就会整段消失 */\n"
          + "#define DEBUG 1\n"
          + "\n"
          + "#if VERSION >= 2\n"
          + "#define MODE_NAME \"stable\"\n"
          + "#else\n"
          + "#define MODE_NAME \"legacy\"\n"
          + "#endif\n"
          + "\n"
          + "#ifndef NDEBUG\n"
          + "#define LOG(msg) printf(\"[log] %s\\n\", (msg))\n"
          + "#else\n"
          + "#define LOG(msg) ((void)0)\n"
          + "#endif\n"
          + "\n"
          + "int main(void) {\n"
          + "#if DEBUG\n"
          + "    printf(\"[debug] mode = %s, version = %d\\n\", MODE_NAME, VERSION);\n"
          + "#endif\n"
          + "    LOG(\"start\");\n"
          + "    printf(\"2 + 3 = %d\\n\", 2 + 3);\n"
          + "#if 0\n"
          + "    printf(\"this line is disabled\\n\");\n"
          + "#endif\n"
          + "    LOG(\"done\");\n"
          + "    return 0;\n"
          + "}",
        output: "[debug] mode = stable, version = 2\n"
          + "[log] start\n"
          + "2 + 3 = 5\n"
          + "[log] done",
        explain: "开头是头文件守卫的标准写法：宏 HTLAB_CONFIG_H 已定义时整段跳过。这里放在 .c 文件里只是演示结构，将来放进 .h 才真正发挥作用。\n"
          + "#define DEBUG 1 是调试开关；#if VERSION >= 2 在编译前从两个 MODE_NAME 里选一个；LOG 宏用 #ifndef NDEBUG 决定「真的打印」还是展开成空语句 ((void)0)。\n"
          + "main 里第一段输出被 #if DEBUG 包住，另一段被 #if 0 关掉——两段都在编译前被处理掉了，编译器根本看不到它们。\n"
          + "把 #define DEBUG 1 那一行注释掉再编译，输出会少掉 [debug] 那一行；把 VERSION 改成 1，MODE_NAME 就变成 legacy。"
      },
      pitfalls: [
        "在 #define DEBUG 0 之后仍用 `#ifdef DEBUG` 判断：0 也是「已定义」，调试代码照样编译进去，应该用 `#if DEBUG`。",
        "把 `#ifdef`、`#else`、`#endif` 写在同一行：每个预处理指令必须独占一行。",
        "守卫的宏名重复或写错（例如所有头文件都叫 `_H_`）：两个头文件互相把对方的守卫当成自己，结果其中一个被整个跳过，报找不到类型。",
        "以为被条件编译排除的代码会参与编译：`#if 0` 里的语法错误不会报错，所以「删掉一半代码再编译」并不能用来验证另一半。"
      ],
      takeaways: [
        "#if / #ifdef / #ifndef 在预处理阶段决定代码去留，不成立的分支编译器看不到",
        "调试开关的两种做法：#define DEBUG 1 或编译时 -DDEBUG",
        "头文件守卫用 #ifndef / #define / #endif，宏名习惯是文件名 + _H",
        "#pragma once 更短，但不是标准；#if 0 … #endif 是临时屏蔽代码的常用手段"
      ],
      questions: [
        {
          q: "头文件开头写 `#ifndef X_H` / `#define X_H` / … / `#endif`，主要作用是？",
          options: [
            "让头文件里的函数变成内联函数",
            "加快编译速度",
            "让头文件里的宏可以被多个 .c 文件使用",
            "防止同一个头文件在一次编译里被重复包含，避免重复定义"
          ],
          answer: 3,
          explain: "第二次包含时 X_H 已定义，整段被跳过，所以不会出现 redefinition。A、B 与守卫无关；C 说反了——宏本来就能跨文件使用，守卫解决的是「重复包含」。"
        },
        {
          q: "关于 `#if` / `#ifdef`，正确的说法是？",
          options: [
            "它们由预处理器判断，条件不成立时那段代码在编译前就被删掉，编译器完全看不到",
            "它们在程序运行时判断，和 if 语句一样",
            "条件里可以写运行时变量，例如 `#if (x > 0)` 判断 x 的当前值",
            "被排除掉的代码里如果有语法错误，编译一定会失败"
          ],
          answer: 0,
          explain: "条件编译发生在预处理阶段，不成立的分支直接被删掉，所以里面的错误也一起消失（D 错）。条件里只能是宏与常量表达式，不能是运行时变量（C 错）；运行时判断是普通 if 的行为（B 错）。"
        },
        {
          q: "想让调试输出「编译时一键关掉」，最合适的做法是？",
          options: [
            "每次手动把调试用的 printf 一行行注释掉，需要时再改回来",
            "用 `#ifdef DEBUG` 包住调试语句，发布时注释掉 `#define DEBUG 1` 或去掉 -DDEBUG 重新编译",
            "把调试 printf 改成 `if (0) printf(...)`",
            "用 `#if 0` 永久把调试输出关掉"
          ],
          answer: 1,
          explain: "开关式宏（或命令行 -DDEBUG）是标准做法：一处定义决定全部调试代码的去留。A 容易漏改；C 会留下永不执行的代码，意图也不清楚；D 是临时手段，没法一键切换。"
        }
      ],
      passRatio: 0.8,
      mission: "写一个单文件程序，练三件事：\n"
        + "1. 顶部用 #define VERSION 3 和 #if VERSION >= 3 把 MODE_NAME 定义成 \"v3\"，否则定义成 \"older\"；\n"
        + "2. 用 #define DEBUG 1 作为调试开关，在 main 里用 #ifdef DEBUG / #else / #endif 包住那行调试输出（#else 分支里可以输出发布版提示）；\n"
        + "3. 按顺序输出三行：mode = v3、[debug] checks passed、result = 9（9 用 3 * 3 算出来）。\n"
        + "另外按守卫的习惯，在文件顶部用 #ifndef HTLAB_STATS_H / #define HTLAB_STATS_H / #endif 把常量区包起来——将来这个文件当头文件用时就需要它。\n"
        + "写完编译运行，把输出粘贴到「运行结果比对」。",
      starter: "#include <stdio.h>\n"
        + "\n"
        + "/* TODO: 守卫 + VERSION + DEBUG + MODE_NAME */\n"
        + "\n"
        + "int main(void) {\n"
        + "    /* TODO: 三行输出，第二行用 #ifdef DEBUG 包起来 */\n"
        + "\n"
        + "    return 0;\n"
        + "}",
      hint: "每个预处理指令独占一行：#ifdef、#else、#endif 各写一行，别挤在一起。把 `#define DEBUG 1` 那一行注释掉再编译，第二行输出就消失了——这就是调试开关的用法（注意不能用 `#define DEBUG 0` 加 `#ifdef`，0 也算已定义）。",
      check: {
        include: ["stdio.h"],
        return0: true,
        seq: [["#","ifdef","DEBUG"],["#","else"],["#","endif"]],
        calls: [["printf","mode = "],["printf","[debug] "],["printf","result = "]],
        callCounts: [["printf",3,6]],
        minStatements: 4,
        message: "需要 #include <stdio.h>、main 里用 #ifdef DEBUG / #else / #endif 包住调试输出，并按顺序输出 mode、[debug]、result 三行。",
        ok: "条件编译写法与三行输出都符合要求。"
      },
      expectedOutput: "mode = v3\n"
          + "[debug] checks passed\n"
          + "result = 9",
      solution: "#include <stdio.h>\n"
          + "\n"
          + "/* 头文件守卫：将来把这个文件当接口用时，防止被重复包含 */\n"
          + "#ifndef HTLAB_STATS_H\n"
          + "#define HTLAB_STATS_H\n"
          + "#define VERSION 3\n"
          + "#endif\n"
          + "\n"
          + "/* 调试开关：定义了 DEBUG 就带调试输出，注释掉这行就变成发布版 */\n"
          + "#define DEBUG 1\n"
          + "\n"
          + "#if VERSION >= 3\n"
          + "#define MODE_NAME \"v3\"\n"
          + "#else\n"
          + "#define MODE_NAME \"older\"\n"
          + "#endif\n"
          + "\n"
          + "int main(void) {\n"
          + "    printf(\"mode = %s\\n\", MODE_NAME);\n"
          + "\n"
          + "#ifdef DEBUG\n"
          + "    printf(\"[debug] checks passed\\n\");\n"
          + "#else\n"
          + "    printf(\"[release] debug output disabled\\n\");\n"
          + "#endif\n"
          + "\n"
          + "    printf(\"result = %d\\n\", 3 * 3);\n"
          + "    return 0;\n"
          + "}",
      mastery: [
        "能用 #if / #ifdef / #ifndef 写出可切换的调试开关与版本分支",
        "能给头文件写出正确的守卫，并说清它防的是什么问题",
        "知道被条件编译排除的代码不会参与编译，也会用 -D 在命令行定义宏"
      ]
    },
    {
      id: 59,
      title: "多文件工程：声明放 .h，定义放 .c",
      minutes: 20,
      gist: "分清声明与定义，把程序拆成 .h / .c，学会 -c 编译与链接命令。",
      lesson: "程序一大，全塞在一个 .c 文件里就难维护：改一处要重编整个文件，两个人改同一个文件还会冲突。多文件工程按职责把代码切开，每个 .c 单独编译，最后链接成一个可执行文件。\n"
        + "先分清两个概念：\n"
        + "声明（declaration）告诉编译器「有这么个东西，它长这样」——函数名、返回类型、参数类型，末尾一个分号。\n"
        + "定义（definition）把它真正实现出来——带函数体的那一份，或分配了存储的那一份变量。\n"
        + "编译器是自上而下读一个 .c 文件的：遇到函数调用时，它必须已经见过这个函数的声明，否则只能猜（老标准给隐式声明警告，新标准直接报错）。所以调用之前要有声明——这就是头文件存在的理由。\n"
        + "典型三件套的分工：\n"
        + "stats.h —— 接口：函数声明、#define 常量、struct/enum 类型定义，外面配 #ifndef 守卫。\n"
        + "stats.c —— 实现：#include \"stats.h\"，把声明过的函数逐个写出来。\n"
        + "main.c —— 入口：#include \"stats.h\"，只调用接口，不关心实现细节。\n"
        + "#include \"stats.h\" 用双引号表示「先在我自己所在目录找」，#include <stdio.h> 用尖括号表示「去系统头文件目录找」。自己写的头文件一律用双引号。\n"
        + "编译与链接（以两个源文件为例）：\n"
        + "gcc -c stats.c -o stats.o     /* 只编译不链接，得到目标文件 */\n"
        + "gcc -c main.c -o main.o\n"
        + "gcc main.o stats.o -o app     /* 链接：把 .o 与库拼成可执行文件 */\n"
        + "./app                         /* Windows 下是 app.exe */\n"
        + "也可以一条命令搞定：gcc main.c stats.c -o app。分两步的好处是增量编译——只改了 main.c 时，stats.o 不必重新生成。\n"
        + "两个最常见的报错，认准它们能省很多时间：\n"
        + "undefined reference to 'average_score' —— 链接期错误：编译器见过声明，但没有任何 .o 提供实现。检查函数名拼写、检查是不是漏了一个 .o。\n"
        + "multiple definition of 'total_score' —— 同一个函数被定义了两遍。常见原因：把函数定义写进了头文件，而这个头文件被两个 .c 都包含了；或者直接 #include 了 .c 文件。\n"
        + "两条经验：只在本文件使用的辅助函数加 static，别的文件链接时看不到它，也不会重名；头文件里不要定义变量，要共享全局变量就写 extern int g_total;，在某个 .c 里定义一次。",
      example: {
        code: "#include <stdio.h>\n"
          + "\n"
          + "/* ===== 相当于 stats.h：只放声明与宏 ===== */\n"
          + "#define MAX_SCORES 8\n"
          + "\n"
          + "int total_score(const int *scores, int count);\n"
          + "double average_score(const int *scores, int count);\n"
          + "int max_score(const int *scores, int count);\n"
          + "\n"
          + "/* ===== 相当于 stats.c：放定义（实现） ===== */\n"
          + "int total_score(const int *scores, int count) {\n"
          + "    int total = 0;\n"
          + "    for (int i = 0; i < count; i++) {\n"
          + "        total += scores[i];\n"
          + "    }\n"
          + "    return total;\n"
          + "}\n"
          + "\n"
          + "double average_score(const int *scores, int count) {\n"
          + "    if (count <= 0) {\n"
          + "        return 0.0;\n"
          + "    }\n"
          + "    return (double)total_score(scores, count) / count;\n"
          + "}\n"
          + "\n"
          + "int max_score(const int *scores, int count) {\n"
          + "    int best = scores[0];\n"
          + "    for (int i = 1; i < count; i++) {\n"
          + "        if (scores[i] > best) {\n"
          + "            best = scores[i];\n"
          + "        }\n"
          + "    }\n"
          + "    return best;\n"
          + "}\n"
          + "\n"
          + "/* ===== 相当于 main.c：把三个函数用起来 ===== */\n"
          + "int main(void) {\n"
          + "    const int scores[MAX_SCORES] = {88, 59, 72, 45};\n"
          + "    int count = 4;\n"
          + "\n"
          + "    printf(\"total = %d\\n\", total_score(scores, count));\n"
          + "    printf(\"average = %.2f\\n\", average_score(scores, count));\n"
          + "    printf(\"max = %d\\n\", max_score(scores, count));\n"
          + "    return 0;\n"
          + "}",
        output: "total = 264\n"
          + "average = 66.00\n"
          + "max = 88",
        explain: "这个单文件程序把三件套「按顺序摆在一起」，方便对照：带 ===== 注释的三段分别是 stats.h（宏 MAX_SCORES 与三条函数声明）、stats.c（三个函数的定义）、main.c（只调用接口）。\n"
          + "关键点是顺序：声明出现在调用之前，编译器才能在 main 里顺利检查 total_score(scores, count) 的参数类型。把它们拆成三个文件后，靠 #include \"stats.h\" 把声明搬到每个 .c 的开头。\n"
          + "average_score 里用 (double)total_score(...) / count：先转 double 再除。这里 264 / 4 恰好是整数，看不出差别；换成 {88, 59, 72, 46} 这种除不尽的数据，整数除法就会把小数丢掉。"
      },
      pitfalls: [
        "把函数定义写进头文件：两个 .c 都包含它，链接时报 `multiple definition of 'xxx'`（头文件里只放声明）。",
        "直接 `#include \"stats.c\"`：看起来能用，实际会让函数被定义两次，也失去了分别编译的意义。",
        "调用了函数却没写声明：gcc 会警告 `implicit declaration of function`（较新的 gcc 直接报错），链接期还可能报 `undefined reference`。",
        "编译命令只写了 `gcc main.c -o app`：链接器找不到别的 .c 里的实现，报 `undefined reference to 'average_score'`——不是代码写错了，是文件没参与链接。"
      ],
      takeaways: [
        "声明说明「长什么样」（分号结尾），定义是「真的实现」，调用前必须见过声明",
        ".h 放接口（声明、宏、类型），.c 放实现，main.c 只调用接口",
        "gcc -c 只编译生成 .o，链接时把所有 .o 一起交给 gcc",
        "undefined reference 是缺实现（链接期），multiple definition 是重复定义"
      ],
      questions: [
        {
          q: "多文件工程里，头文件（.h）里应该放什么？",
          options: [
            "函数的完整定义",
            "只放 main 函数",
            "函数声明、宏、类型定义这些「接口」，实现在 .c 里",
            "编译生成的 .o 文件"
          ],
          answer: 2,
          explain: "头文件是接口清单：声明、宏、类型。A 错在函数定义被多个 .c 包含时会重复定义；B 错在 main 只存在于一个 .c 里；D 错在 .o 是编译产物，不是源码。"
        },
        {
          q: "要把 main.c 和 stats.c 编译成可执行文件，下面哪种做法正确？",
          options: [
            "`gcc main.c` 就够了，编译器会自动找到同目录的 stats.c",
            "在 main.c 里写 `#include \"stats.c\"` 再编译 main.c",
            "`gcc main.c stats.c` 只能生成两个 .o，不能生成可执行文件",
            "`gcc -c stats.c` 得到 stats.o，再 `gcc main.c stats.o -o app` 链接成可执行文件"
          ],
          answer: 3,
          explain: "D 是标准的「分别编译 + 链接」流程。A 错：编译器不会自动找源文件，会报 undefined reference；B 是错误做法，会重复定义、也失去分别编译的意义；C 错：一条命令同时编译并链接本来就是允许的。"
        },
        {
          q: "链接时报 `undefined reference to 'average_score'`，最可能的原因是？",
          options: [
            "提供 average_score 实现的目标文件没有参与链接，或函数名拼写不一致",
            "average_score 函数里的循环写错了",
            "头文件没有加 include 守卫",
            "main 里忘了写 return 0;"
          ],
          answer: 0,
          explain: "undefined reference 是链接期错误：声明见过，实现没找到——漏了 .o 或名字对不上。B 是运行期问题；C 会导致重复定义（redefinition），不是未定义引用；D 与链接无关。"
        }
      ],
      passRatio: 0.8,
      mission: "写一个单文件的「成绩统计」骨架，按多文件工程的顺序组织：\n"
        + "1. 先写声明（相当于 stats.h）：int total_score(const int *scores, int count); 和 double average_score(const int *scores, int count);\n"
        + "2. 再写定义（相当于 stats.c）：两个函数都要自己实现，average_score 里用 (double) 避免整数除法；\n"
        + "3. 最后写 main（相当于 main.c）：用数组 {90, 75, 84, 61} 和 count = 4，输出两行：total = 310、average = 77.50。\n"
        + "写完编译运行，把输出粘贴到「运行结果比对」。",
      starter: "#include <stdio.h>\n"
        + "\n"
        + "/* TODO: 先写两条函数声明 */\n"
        + "\n"
        + "/* TODO: 再写两个函数的定义 */\n"
        + "\n"
        + "int main(void) {\n"
        + "    const int scores[4] = {90, 75, 84, 61};\n"
        + "    int count = 4;\n"
        + "\n"
        + "    /* TODO: 两行输出 */\n"
        + "\n"
        + "    return 0;\n"
        + "}",
      hint: "声明就是「函数长什么样」：返回类型、名字、参数类型，末尾一个分号；定义是带函数体的那一份。写完声明，编译器就知道后面可以调用它们——这正是 .h 与 .c 分工的全部秘密。平均分用 `(double)total_score(scores, count) / count`。",
      check: {
        include: ["stdio.h"],
        return0: true,
        calls: [["printf","total = "],["printf","average = "]],
        callCounts: [["printf",2,6]],
        require: {"funcs":["total_score","average_score"]},
        minStatements: 8,
        message: "需要自己定义 total_score() 与 average_score()（不是只写声明），并在 main 里输出 total、average 两行，最后 return 0;。",
        ok: "声明、定义、调用三层分工清楚，输出也正确。"
      },
      expectedOutput: "total = 310\n"
          + "average = 77.50",
      solution: "#include <stdio.h>\n"
          + "\n"
          + "/* 相当于 stats.h：先声明，编译器才知道这些函数长什么样 */\n"
          + "int total_score(const int *scores, int count);\n"
          + "double average_score(const int *scores, int count);\n"
          + "\n"
          + "/* 相当于 stats.c：把声明过的函数实现出来 */\n"
          + "int total_score(const int *scores, int count) {\n"
          + "    int total = 0;\n"
          + "    for (int i = 0; i < count; i++) {\n"
          + "        total += scores[i];\n"
          + "    }\n"
          + "    return total;\n"
          + "}\n"
          + "\n"
          + "double average_score(const int *scores, int count) {\n"
          + "    return (double)total_score(scores, count) / count;\n"
          + "}\n"
          + "\n"
          + "/* 相当于 main.c：只调用接口，不关心实现细节 */\n"
          + "int main(void) {\n"
          + "    const int scores[4] = {90, 75, 84, 61};\n"
          + "    int count = 4;\n"
          + "\n"
          + "    printf(\"total = %d\\n\", total_score(scores, count));\n"
          + "    printf(\"average = %.2f\\n\", average_score(scores, count));\n"
          + "    return 0;\n"
          + "}",
      mastery: [
        "能说清声明与定义的区别，并把函数声明写进头文件、定义留在 .c",
        "能用 gcc -c 分别编译、再用一条 gcc 命令链接出可执行文件",
        "看到 undefined reference / multiple definition 时知道分别去查什么"
      ]
    },
    {
      id: 60,
      title: "Makefile 入门：让构建自动化",
      minutes: 20,
      gist: "读懂并写出「目标: 依赖 + 命令」的规则表，用变量、clean 与 .PHONY 管理构建。",
      lesson: "源文件多了以后，每次手敲一长串 gcc 命令容易出错也记不住。make 是一个「按规则表重新构建」的工具：你写一份 Makefile 描述「哪些文件由哪些文件生成、怎么生成」，make 负责判断谁过期了就重建谁。\n"
        + "Makefile 的核心是规则：\n"
        + "目标: 依赖1 依赖2\n"
        + "<Tab>命令\n"
        + "目标是产出物（app、main.o），依赖是生成它需要的输入（main.c、main.o），命令是生成动作。关键细节：命令行必须以制表符（Tab）开头，不能用空格；用空格会报 missing separator，这是新手第一大坑。\n"
        + "一个能用的多文件 Makefile（<Tab> 处必须真的敲一个制表符）：\n"
        + "CC = gcc\n"
        + "CFLAGS = -std=c11 -Wall -Wextra\n"
        + "OBJS = main.o stats.o\n"
        + "\n"
        + "app: $(OBJS)\n"
        + "<Tab>$(CC) $(OBJS) -o app\n"
        + "\n"
        + "main.o: main.c stats.h\n"
        + "<Tab>$(CC) $(CFLAGS) -c main.c -o main.o\n"
        + "\n"
        + "stats.o: stats.c stats.h\n"
        + "<Tab>$(CC) $(CFLAGS) -c stats.c -o stats.o\n"
        + "\n"
        + "clean:\n"
        + "<Tab>rm -f $(OBJS) app\n"
        + "\n"
        + ".PHONY: clean\n"
        + "怎么读这份文件：\n"
        + "第一条规则的目标是 app，它就是默认目标——直接敲 make，等价于 make app。\n"
        + "make 比较时间戳：只有当 app 比某个依赖旧、或依赖不存在时，才执行对应命令；否则打印 'app' is up to date. 什么都不做。这就是增量构建，也是 make 存在的意义。\n"
        + "make clean 执行清理。clean 不对应真实文件，所以要写 .PHONY: clean 声明它是伪目标；否则目录里恰好有个叫 clean 的文件时，make 会认为它已是最新而不执行命令。\n"
        + "变量用 $(名字) 引用。CC、CFLAGS 是约定俗成的名字，换编译器或加警告选项只改一行。删除命令注意平台差异：类 Unix 用 rm -f $(OBJS) app，Windows 命令行用 del /Q $(OBJS) app.exe。\n"
        + "规则多了嫌啰嗦，可以用模式规则一次覆盖所有 .o：\n"
        + "%.o: %.c\n"
        + "<Tab>$(CC) $(CFLAGS) -c $< -o $@\n"
        + "$@ 是目标名，$< 是第一个依赖名。\n"
        + "Windows 上的 make 常叫 mingw32-make（Dev-C++ 的安装目录里就带一份），先在终端试这个名字；如果你看到 missing separator，回头检查是不是编辑器把 Tab 换成了空格——这是 Makefile 最常见的事故。",
      example: {
        code: "#include <stdio.h>\n"
          + "\n"
          + "int factorial(int n) {\n"
          + "    int result = 1;\n"
          + "    for (int i = 2; i <= n; i++) {\n"
          + "        result *= i;\n"
          + "    }\n"
          + "    return result;\n"
          + "}\n"
          + "\n"
          + "int main(void) {\n"
          + "    for (int n = 1; n <= 5; n++) {\n"
          + "        printf(\"%d! = %d\\n\", n, factorial(n));\n"
          + "    }\n"
          + "    return 0;\n"
          + "}",
        output: "1! = 1\n"
          + "2! = 2\n"
          + "3! = 6\n"
          + "4! = 24\n"
          + "5! = 120",
        explain: "这个程序就是讲解里 Makefile 要构建的 main.c：factorial() 是一个独立函数，main 里循环调用并打印。\n"
          + "用 Makefile 构建它时，最简版本是 app: main.c 加一行 $(CC) $(CFLAGS) main.c -o app；写成 .o 规则则多一个中间产物 main.o，换来的是「只改一行注释也要重新链接，但不必重新编译整个项目」的增量构建能力。\n"
          + "注意程序本身和数据无关：它只依赖 n 从 1 到 5，输出完全确定，方便你对照 make 跑出来的结果。"
      },
      pitfalls: [
        "命令行用空格缩进：make 报 `missing separator`，这一行不会被当成命令（编辑器里把 Tab 显示出来最保险）。",
        "把 clean 写在第一条规则：它就成了默认目标，直接敲 make 变成删文件。",
        "clean 不写 `.PHONY`：目录里恰好存在名为 clean 的文件时，make 认为它是最新的，什么都不做。",
        "依赖列表漏了头文件（例如写成 `main.o: main.c`）：改了 stats.h 之后 main.o 不重新编译，链接出来的程序还是旧的——这是「幽灵 bug」的常见来源。"
      ],
      takeaways: [
        "规则结构：目标: 依赖，下一行以 Tab 开头写命令",
        "第一条规则是默认目标；make 用时间戳判断哪些目标过期需要重建",
        "变量用 $(名字) 引用，CC / CFLAGS / OBJS 是最常用的约定名",
        "clean 是伪目标，要配 .PHONY；模式规则 %.o: %.c 配 $@ / $< 少写重复"
      ],
      questions: [
        {
          q: "Makefile 规则里，命令行的开头必须是什么？",
          options: [
            "四个空格",
            "制表符（Tab）",
            "一个 > 符号",
            "不需要特殊字符，顶格写就行"
          ],
          answer: 1,
          explain: "make 靠 Tab 区分「某个目标的命令行」和普通行；用空格开头会报 missing separator（A 是最常见的错法）。C、D 都不符合 make 语法。"
        },
        {
          q: "规则 `app: main.o stats.o` 加一行 `gcc main.o stats.o -o app`，含义是？",
          options: [
            "只要 main.o 存在就重新生成 app",
            "app 是源文件，main.o 是它生成的目标",
            "app 依赖 main.o 和 stats.o：任一依赖比 app 新，或依赖不存在时，才执行下面的命令重新生成 app",
            "每次运行 make 都无条件执行这条 gcc 命令"
          ],
          answer: 2,
          explain: "冒号左边是目标、右边是依赖，make 比对时间戳决定是否重建。D 正好说反（无条件执行是 .PHONY 伪目标的行为）；A 漏了 stats.o 和「过期才重建」的判断；B 把目标与依赖说反了。"
        },
        {
          q: "关于 clean 目标，正确做法是？",
          options: [
            "写成 `clean: app`，让 make 先构建再删除",
            "不需要 clean，make 会自动清理过期的目标文件",
            "把 clean 放在第一条规则的位置，保证每次 make 都执行",
            "写成 `clean:` 加删除命令，并配 `.PHONY: clean`，用 `make clean` 手动调用"
          ],
          answer: 3,
          explain: "clean 不对应真实文件，声明 .PHONY 才能保证每次都被执行；由用户显式调用 `make clean`。A 会把清理和构建绑死；B 错，make 从不自动清理；C 会让 clean 变成默认目标，敲 make 就变成删文件。"
        }
      ],
      passRatio: 0.8,
      mission: "写一个程序（它就是你用 Makefile 构建的 main.c）：\n"
        + "1. 定义 int sum_to(int n)，用循环算出 1 + 2 + … + n 的和；\n"
        + "2. 在 main 里用循环输出四行：sum_to(1) = 1、sum_to(2) = 3、sum_to(3) = 6、sum_to(4) = 10（用循环加 printf 生成，不要写四行死结果）。\n"
        + "另外自己写一份 Makefile（参考讲解里的模板：CC / CFLAGS / OBJS 变量，app 规则，clean 加 .PHONY），用 make（Windows 上试 mingw32-make）编译并运行它——这部分请在本机动手验证，本地检查只看 C 代码。",
      starter: "#include <stdio.h>\n"
        + "\n"
        + "/* TODO: 定义 int sum_to(int n) */\n"
        + "\n"
        + "int main(void) {\n"
        + "    /* TODO: 用循环输出四行 sum_to(n) = 结果 */\n"
        + "\n"
        + "    return 0;\n"
        + "}",
      hint: "Makefile 的命令行必须用 Tab 开头（不是空格）；变量用 `$(CC)`、`$(CFLAGS)` 引用。clean 目标记得配 `.PHONY: clean`，删除命令在 Windows 上是 `del /Q ...`。C 代码这边注意循环变量 n 从 1 到 4。",
      check: {
        include: ["stdio.h"],
        return0: true,
        calls: [["printf","sum_to("]],
        require: {"funcs":["sum_to"],"for":true},
        minStatements: 6,
        message: "需要定义 sum_to() 函数（用循环求和），并在 main 里用循环输出四行 sum_to(n) = 结果。",
        ok: "函数、循环与四行输出都齐全。"
      },
      expectedOutput: "sum_to(1) = 1\n"
          + "sum_to(2) = 3\n"
          + "sum_to(3) = 6\n"
          + "sum_to(4) = 10",
      solution: "#include <stdio.h>\n"
          + "\n"
          + "int sum_to(int n) {\n"
          + "    int total = 0;\n"
          + "    for (int i = 1; i <= n; i++) {\n"
          + "        total += i;\n"
          + "    }\n"
          + "    return total;\n"
          + "}\n"
          + "\n"
          + "int main(void) {\n"
          + "    for (int n = 1; n <= 4; n++) {\n"
          + "        printf(\"sum_to(%d) = %d\\n\", n, sum_to(n));\n"
          + "    }\n"
          + "    return 0;\n"
          + "}",
      mastery: [
        "能读懂 Makefile 的规则结构，说出目标、依赖、命令各自的角色",
        "能写出一份带变量、模式规则、clean 与 .PHONY 的 Makefile",
        "遇到 missing separator 会先检查 Tab，遇到改头文件不生效会检查依赖列表"
      ]
    },
    {
      id: 61,
      title: "调试手段：printf、assert 与 gdb",
      minutes: 22,
      gist: "用 printf 缩小范围、用 assert 钉住前提、用 gdb 停下来看现场。",
      lesson: "程序不按要求输出时，先别猜。调试的通用套路是：稳定复现 → 缩小范围 → 确认原因。\n"
        + "最朴素也最常用的工具是 printf。在关键位置打印变量的值，看它从哪一步开始不对：\n"
        + "用统一前缀，方便搜索与清理，例如 printf(\"[debug] i = %d, total = %d\\n\", i, total);\n"
        + "用二分法缩小范围：先打印循环前后，再往中间插，几次就能锁定出错的语句；\n"
        + "调试输出在提交前删掉，或者用上一关的 #ifdef DEBUG 包住。\n"
        + "第二个工具是断言 assert（需要 #include <assert.h>）。它不是给用户看的错误处理，而是写给程序员的「这里必须成立」：\n"
        + "assert(n > 0);\n"
        + "assert(n == (int)(sizeof data / sizeof data[0]));   /* 条数必须与数组长度一致 */\n"
        + "断言失败时程序会打印 Assertion failed: n > 0, file app.c, line 12 然后中止——错误现场被完整保留，比自己翻输出快得多。可以用 #define NDEBUG 或编译时 -DNDEBUG 把断言整段关掉，所以断言里绝不能写有副作用的表达式：assert(p = malloc(10)) 在发布版里根本不会执行。也别用断言处理用户输入错误——那是 if 加提示信息该做的事。\n"
        + "第三个工具是调试器 GDB，能让你把程序停下来看现场。前提是编译时加 -g：\n"
        + "gcc -g -O0 app.c -o app     /* -g 生成行号与变量信息，-O0 关闭优化 */\n"
        + "gdb ./app                   /* Windows 上 Dev-C++ 安装目录里就带 gdb.exe */\n"
        + "常用命令：\n"
        + "break main / b main     在 main 入口下断点；break app.c:12 在第 12 行下断点\n"
        + "run / r                 开始运行，停在断点\n"
        + "next / n                单步执行，把函数调用当一步走完\n"
        + "step / s                单步执行，进入被调用的函数内部\n"
        + "print total / p total   查看变量当前的值；p scores[0]@5 看连续 5 个元素\n"
        + "continue / c            继续运行到下一个断点\n"
        + "backtrace / bt          查看调用栈，回答「我是从哪进来的」\n"
        + "quit / q                退出\n"
        + "典型流程：在可疑函数入口下断点 → run → 用 next 走几行 → print 检查变量是不是你以为的值 → 找到第一条不对的语句。整个过程比满屏 printf 更精确，因为你可以随时换断点、随时改变量的值再继续跑。\n"
        + "再补一条经验：先怀疑边界（下标 0 与 n-1、空数组、除数为 0），再怀疑类型（整数除法、有符号与无符号比较）；改完一个 bug 一定要重新跑一遍最小复现用例。",
      example: {
        code: "#include <stdio.h>\n"
          + "#include <assert.h>\n"
          + "\n"
          + "static int sum_array(const int *a, int n) {\n"
          + "    assert(a != NULL);\n"
          + "    assert(n > 0);\n"
          + "    int total = 0;\n"
          + "    for (int i = 0; i < n; i++) {\n"
          + "        total += a[i];\n"
          + "    }\n"
          + "    return total;\n"
          + "}\n"
          + "\n"
          + "/* 故意留着整数除法的坑：14 / 5 先算成 2，再转成 double */\n"
          + "static double average_buggy(const int *a, int n) {\n"
          + "    return sum_array(a, n) / n;\n"
          + "}\n"
          + "\n"
          + "/* 用 (double) 提升被除数，结果才是 2.80 */\n"
          + "static double average_fixed(const int *a, int n) {\n"
          + "    return (double)sum_array(a, n) / n;\n"
          + "}\n"
          + "\n"
          + "int main(void) {\n"
          + "    const int data[5] = {3, 1, 4, 1, 5};\n"
          + "    int n = 5;\n"
          + "\n"
          + "    printf(\"[debug] sum = %d, count = %d\\n\", sum_array(data, n), n);\n"
          + "    printf(\"buggy average = %.2f\\n\", average_buggy(data, n));\n"
          + "    printf(\"fixed average = %.2f\\n\", average_fixed(data, n));\n"
          + "\n"
          + "    assert(sum_array(data, n) == 14);\n"
          + "    printf(\"assert passed\\n\");\n"
          + "    return 0;\n"
          + "}",
        output: "[debug] sum = 14, count = 5\n"
          + "buggy average = 2.00\n"
          + "fixed average = 2.80\n"
          + "assert passed",
        explain: "sum_array 用两个 assert 钉住前提：数组指针非空、n 大于 0——这是「调用者必须遵守的约定」。\n"
          + "average_buggy 是故意留下的整数除法 bug：sum_array(a, n) / n 先做整数除法，14 / 5 得 2，再转成 double 就是 2.00；average_fixed 用 (double) 提升被除数，才是正确的 2.80。\n"
          + "main 里那行 [debug] 打印就是 printf 调试法：把 sum 和 count 摊开看，一眼就能发现「sum 是 14、除以 5 应该是 2.8，结果却打印 2.00」——问题定位到除法，而不是求和。\n"
          + "最后那句 assert(sum_array(data, 5) == 14) 把「和必须是 14」写成可执行的检查：结果一变，程序立刻停下并报出文件名与行号。"
      },
      pitfalls: [
        "断言里写有副作用的表达式：`assert(p = malloc(10))` 定义 NDEBUG 后整句消失，p 永远没被赋值。",
        "直接用 `gcc app.c -o app` 再进 gdb：没有 -g 就没有行号与变量信息，`break app.c:12` 会找不到位置。",
        "编译时加 -O2 再调试：变量可能被优化掉，print 显示 `<optimized out>`，断点也会跳到意想不到的行，调试请用 -O0。",
        "把调试 printf 留在正式代码里：既影响输出格式又拖慢程序，还容易泄露内部数据；调试输出统一加 [debug] 前缀并在提交前清理。"
      ],
      takeaways: [
        "printf 调试法：打印关键中间值、用二分法缩小范围、加统一前缀便于清理",
        "assert 写「必须成立」的约定，失败会打印文件和行号并中止；NDEBUG 下会被移除",
        "gdb 前先加 -g -O0；break / run / next / step / print / continue / bt 是最常用的七条命令",
        "先怀疑边界与类型，修完一个 bug 要重跑最小复现用例"
      ],
      questions: [
        {
          q: "在 gdb 里，`next` 和 `step` 的区别是？",
          options: [
            "next 把函数调用当一步走完，step 会进入被调用的函数内部",
            "next 会进入函数内部，step 跳过函数",
            "两个命令完全一样，只是简写不同",
            "next 只能用在 main 里，step 只能用在其他函数里"
          ],
          answer: 0,
          explain: "n/next 单步但跳过函数内部，s/step 会进入被调用函数——想看函数内部实现就用 step，想快速走过已知正确的调用就用 next。B 说反了，C、D 不符合 gdb 的行为。"
        },
        {
          q: "关于 assert 宏，正确的说法是？",
          options: [
            "assert 在发布版里也一定生效，无法关闭",
            "定义 NDEBUG 后 assert 会被去掉，所以断言里不要写有副作用的表达式",
            "assert 失败时会返回 1 并继续运行",
            "assert 只能用来比较两个整数是否相等"
          ],
          answer: 1,
          explain: "assert 失败会打印文件与行号并调用 abort 结束程序（C 错）；可以用 #define NDEBUG 或 -DNDEBUG 关掉（A 错）；它接受任意表达式（D 错）。正因为会被移除，断言里不能放有副作用的表达式。"
        },
        {
          q: "要让 gdb 能显示行号、能按变量名查看值，编译时需要？",
          options: [
            "加 -O2，让程序跑得更快",
            "加 -static，把库静态链接进来",
            "加 -g 生成调试信息，并避免使用高优化等级",
            "什么都不用加，gdb 会自动获得这些信息"
          ],
          answer: 2,
          explain: "调试信息来自 -g；-O2 反而可能把变量优化掉、把断点挪位，所以调试时用 -O0 -g。A、B 与调试信息无关，D 是常见误解。"
        }
      ],
      passRatio: 0.8,
      mission: "下面这段起始代码有两处问题，请读懂并写出修好的版本：\n"
        + "1. n 写成了 4，但数组里有 5 个元素——在 main 里用 assert(n == (int)(sizeof data / sizeof data[0])); 把这层「条数必须等于数组长度」的约定钉住（记得 #include <assert.h>）；\n"
        + "2. average 里是整数除法，14 / 5 会先算成 2——用 (double) 修正。\n"
        + "修好后按顺序输出两行：sum = 14、average = 2.80。\n"
        + "建议先把起始代码原样编译运行一次（会看到 sum = 9、average = 2.00），体验一下用 printf 与断言定位问题的过程。",
      starter: "#include <stdio.h>\n"
        + "\n"
        + "static int sum_array(const int *a, int n) {\n"
        + "    int total = 0;\n"
        + "    for (int i = 0; i < n; i++) {\n"
        + "        total += a[i];\n"
        + "    }\n"
        + "    return total;\n"
        + "}\n"
        + "\n"
        + "static double average(const int *a, int n) {\n"
        + "    return sum_array(a, n) / n;   /* TODO: 结果不对 */\n"
        + "}\n"
        + "\n"
        + "int main(void) {\n"
        + "    const int data[5] = {3, 1, 4, 1, 5};\n"
        + "    int n = 4;                    /* TODO: 和数组长度不一致 */\n"
        + "    /* TODO: 用 assert 守住 n 与数组长度一致 */\n"
        + "\n"
        + "    printf(\"sum = %d\\n\", sum_array(data, n));\n"
        + "    printf(\"average = %.2f\\n\", average(data, n));\n"
        + "    return 0;\n"
        + "}",
      hint: "断言写的是「这里必须成立」的约定：`assert(n == (int)(sizeof data / sizeof data[0]));`——sizeof 的结果是 size_t，转成 int 再比较可以避开有符号/无符号比较的警告。平均数先把被除数转成 double：`(double)sum_array(a, n) / n`。",
      check: {
        include: ["stdio.h","assert.h"],
        return0: true,
        calls: [["assert"],["printf","sum = "],["printf","average = "]],
        require: {"funcs":["average"],"for":true},
        minStatements: 6,
        message: "需要 #include <stdio.h> 与 <assert.h>、在 main 里用 assert 守住数组长度、定义 average()，并输出 sum 与 average 两行。",
        ok: "断言、函数与两行输出都对上了。"
      },
      expectedOutput: "sum = 14\n"
          + "average = 2.80",
      solution: "#include <stdio.h>\n"
          + "#include <assert.h>\n"
          + "\n"
          + "static int sum_array(const int *a, int n) {\n"
          + "    int total = 0;\n"
          + "    for (int i = 0; i < n; i++) {\n"
          + "        total += a[i];\n"
          + "    }\n"
          + "    return total;\n"
          + "}\n"
          + "\n"
          + "static double average(const int *a, int n) {\n"
          + "    return (double)sum_array(a, n) / n;\n"
          + "}\n"
          + "\n"
          + "int main(void) {\n"
          + "    const int data[5] = {3, 1, 4, 1, 5};\n"
          + "    int n = 5;\n"
          + "\n"
          + "    /* 用断言守住「条数必须和数组长度一致」这个前提 */\n"
          + "    assert(n == (int)(sizeof data / sizeof data[0]));\n"
          + "\n"
          + "    printf(\"sum = %d\\n\", sum_array(data, n));\n"
          + "    printf(\"average = %.2f\\n\", average(data, n));\n"
          + "    return 0;\n"
          + "}",
      mastery: [
        "能用 printf 调试法把问题范围一步步缩小，并在提交前清理调试输出",
        "知道 assert 的用途与 NDEBUG 的影响，不会在断言里写有副作用的表达式",
        "能用 gdb 的断点、单步与打印变量定位一条出错语句"
      ]
    },
    {
      id: 62,
      title: "内存检查：valgrind 与 AddressSanitizer",
      minutes: 20,
      gist: "认清五类内存错误，看懂 valgrind / ASan 报告的关键几行。",
      lesson: "指针和 malloc 的错误有个共同特点：程序可能照样跑完、照样打印结果，错误却悄悄破坏别处的内存——「自觉写对」不够，要用工具盯着。\n"
        + "常见的内存错误有五类：越界读写（申请 5 个 int 却写下标 5）、忘记释放、重复释放、使用已释放的内存、读未初始化的值。\n"
        + "valgrind 是 Linux / macOS 上最常用的内存检查器：它在一个虚拟 CPU 上跑你的程序，能发现越界、泄漏、未初始化读取等问题。\n"
        + "gcc -g app.c -o app\n"
        + "valgrind --leak-check=full ./app\n"
        + "报告怎么读（节选，地址与行号每次都不一样）：\n"
        + "==12345== Invalid write of size 4\n"
        + "==12345==    at 0x1091B7: main (app.c:7)\n"
        + "==12345==  Address 0x4a2b040 is 0 bytes after a block of size 20 alloc'd\n"
        + "第一行是错误类型（往不该写的地方写了 4 字节）；第二行是出错位置（app.c 第 7 行）；第三行说明这块内存只有 20 字节，而你写到了它的右边界之后——正是「申请 5 个 int 却写下标 5」的样子。\n"
        + "泄漏报告长这样：\n"
        + "==12345==     in use at exit: 20 bytes in 1 blocks\n"
        + "==12345==   total heap usage: 1 allocs, 0 frees, 20 bytes allocated\n"
        + "==12345==    definitely lost: 20 bytes in 1 blocks\n"
        + "in use at exit 是退出时还欠着的堆内存；allocs/frees 是申请与释放的次数；definitely lost 是「肯定泄漏」——指针已经丢了，再也 free 不掉。still reachable 一般不算错误（结束时仍握在手里的指针，比如全局缓存）。\n"
        + "AddressSanitizer（ASan）把检查编进程序里，速度比 valgrind 快得多：\n"
        + "gcc -fsanitize=address -g app.c -o app     /* Clang 同样支持 */\n"
        + "出错时终端直接输出：\n"
        + "==12345==ERROR: AddressSanitizer: heap-buffer-overflow on address 0x602000000014\n"
        + "WRITE of size 4 at 0x602000000014 thread T0\n"
        + "    #0 0x4f3a1b in main app.c:7\n"
        + "0x602000000014 is located 0 bytes to the right of 20-byte region\n"
        + "SUMMARY: AddressSanitizer: heap-buffer-overflow app.c:7 in main\n"
        + "读法和 valgrind 一样：错误类型 → 出错行 → 这块内存的来历。\n"
        + "本机现实：Dev-C++ 自带的 gcc 4.9 没有 libasan（加 -fsanitize=address 会报 cannot find -lasan），valgrind 也不在 Windows 上工作。想在本地用检查器，可以装较新的 MinGW-w64、用 MSVC 的 /fsanitize=address，或在 WSL / Linux 里跑一遍；都没有就靠「判 NULL + 配对 free + 打印下标边界 + 边界用例」——工具只是加速，思路才是根本。\n"
        + "最后一句经验：检查器只能发现程序真正执行到的路径，测试没覆盖到的分支工具同样看不见。",
      example: {
        code: "#include <stdio.h>\n"
          + "#include <stdlib.h>\n"
          + "\n"
          + "int main(void) {\n"
          + "    int count = 5;\n"
          + "    int *scores = malloc((size_t)count * sizeof(int));\n"
          + "    if (scores == NULL) {\n"
          + "        printf(\"out of memory\\n\");\n"
          + "        return 1;\n"
          + "    }\n"
          + "\n"
          + "    for (int i = 0; i < count; i++) {\n"
          + "        scores[i] = (i + 1) * 10;\n"
          + "    }\n"
          + "\n"
          + "    int total = 0;\n"
          + "    for (int i = 0; i < count; i++) {\n"
          + "        total += scores[i];\n"
          + "        printf(\"scores[%d] = %d\\n\", i, scores[i]);\n"
          + "    }\n"
          + "    printf(\"total = %d\\n\", total);\n"
          + "\n"
          + "    free(scores);\n"
          + "    scores = NULL;\n"
          + "    printf(\"memory released\\n\");\n"
          + "    return 0;\n"
          + "}",
        output: "scores[0] = 10\n"
          + "scores[1] = 20\n"
          + "scores[2] = 30\n"
          + "scores[3] = 40\n"
          + "scores[4] = 50\n"
          + "total = 150\n"
          + "memory released",
        explain: "这是「一份能让检查器闭嘴」的样板：malloc 之后立刻判断返回值，失败就打印提示并用非 0 返回码退出，绝不继续用空指针。\n"
          + "填值与统计的下标严格控制在 0 ~ count-1，没有越界；free 之后把指针置为 NULL，万一后面误用，程序会立刻崩在明确的位置，而不是悄悄读写已经还给系统的内存。\n"
          + "申请与释放配成对之后，valgrind 的 HEAP SUMMARY 会显示 allocs 与 frees 数量相等、definitely lost 为 0 字节；如果漏掉 free，这份输出照样打印，但报告里会出现 in use at exit 与 definitely lost。\n"
          + "注意打印的是元素值而不是指针地址——地址每次运行都可能不同，写进文档或测试里毫无意义。"
      },
      pitfalls: [
        "越界写：`int *p = malloc(5 * sizeof(int)); p[5] = 1;` 合法下标只有 0~4，valgrind 报 `Invalid write of size 4`，ASan 报 `heap-buffer-overflow`。",
        "忘记 free 或提前丢掉指针：报告里出现 `definitely lost`，指针再也找不回来。",
        "free 之后继续用：`free(p); p[0] = 1;` 属于使用已释放内存，工具会报 `Invalid write` 或 `use-after-free`。",
        "读到没检查的 malloc 返回值：内存不足时 malloc 返回 NULL，直接解引用立刻崩溃——所以申请后必须先判 NULL。"
      ],
      takeaways: [
        "五类内存错误：越界、忘记释放、重复释放、使用已释放内存、读未初始化值",
        "valgrind --leak-check=full ./app：看 Invalid write/read 与 LEAK SUMMARY 里的 definitely lost",
        "ASan 用 gcc -fsanitize=address -g 编译，报告同样是「错误类型 → 出错行 → 内存来历」",
        "malloc 必判 NULL、free 后置 NULL、每次申请配一次释放；工具只能发现执行到的路径"
      ],
      questions: [
        {
          q: "valgrind 报告 `definitely lost: 20 bytes in 1 blocks`，说明什么？",
          options: [
            "程序读到了 20 字节未初始化的内存",
            "程序写越界了 20 字节",
            "有 20 字节内存被释放了两次",
            "有 20 字节堆内存已经失去所有指针、再也无法释放（通常是忘记 free）"
          ],
          answer: 3,
          explain: "lost 系列是泄漏统计：definitely lost 表示肯定泄漏。A 会报 uninitialised value（未初始化值）；B 会报 Invalid write；C 会报 Invalid free / double free——三种现象在报告里的关键字完全不同。"
        },
        {
          q: "用 AddressSanitizer 编译程序，正确的命令是？",
          options: [
            "`gcc -fsanitize=address -g app.c -o app`",
            "`gcc -asan app.c -o app`",
            "`valgrind gcc app.c -o app`",
            "`gcc -fsanitize=memory app.c -o app`"
          ],
          answer: 0,
          explain: "ASan 通过 -fsanitize=address 打开，配合 -g 才能报出行号。B 不是合法选项；C 把两个工具混在一起了（valgrind 是运行程序的，不是编译选项）；D 的 -fsanitize=memory 是 Clang 的 MemorySanitizer，GCC 不支持。"
        },
        {
          q: "工具报 `Invalid write of size 4`，最可能是下面哪段代码？",
          options: [
            "`int *p = malloc(4 * sizeof(int)); free(p); free(p);`",
            "`int *p = malloc(4 * sizeof(int)); p[4] = 1;`",
            "`int x; printf(\"%d\", x);`",
            "`int *p = malloc(4 * sizeof(int)); p[0] = 1; free(p);`"
          ],
          answer: 1,
          explain: "只申请了 4 个元素（合法下标 0~3），却写下标 4，正是越界写。A 是重复释放（double free / Invalid free）；C 是读未初始化变量；D 是正确写法。"
        }
      ],
      passRatio: 0.8,
      mission: "写一个程序，用堆内存完成一次「平方表」统计：\n"
        + "1. int count = 6;，用 malloc 申请 count 个 int（写成 malloc((size_t)count * sizeof(int))），并检查返回值是否为 NULL；\n"
        + "2. 填入 1 到 6 的平方：1、4、9、16、25、36；\n"
        + "3. 循环输出六行 values[0] = 1 到 values[5] = 36，再输出 total = 91；\n"
        + "4. 最后 free 释放，把指针置为 NULL，输出 memory released。\n"
        + "写完后如果本机有 valgrind 或 AddressSanitizer，再跑一遍确认没有泄漏与越界。",
      starter: "#include <stdio.h>\n"
        + "#include <stdlib.h>\n"
        + "\n"
        + "int main(void) {\n"
        + "    int count = 6;\n"
        + "    /* TODO: malloc + 检查返回值是否为 NULL */\n"
        + "    /* TODO: 填值、求和、按 values[i] = 值 的格式打印 */\n"
        + "    /* TODO: 打印 total */\n"
        + "    /* TODO: free 并置 NULL，打印 memory released */\n"
        + "\n"
        + "    return 0;\n"
        + "}",
      hint: "malloc 的参数是「字节数」，所以写 `(size_t)count * sizeof(int)`；返回 NULL 就打印提示并用非 0 返回码退出。free 之后把指针置成 NULL，可以让你在调试时立刻发现「用了已经释放的内存」。",
      check: {
        include: ["stdio.h","stdlib.h"],
        return0: true,
        calls: [["printf","values[%d] = "],["printf","total = "],["printf","memory released"]],
        callCounts: [["free",1,2]],
        require: {"malloc":true,"free":true,"loop":true,"array":true},
        minStatements: 8,
        message: "需要 #include <stdlib.h>、用 malloc 申请 count 个 int 并检查返回值、循环打印 values[i] = 值、输出 total、最后 free 并打印 memory released。",
        ok: "申请、判空、使用与释放都做到了。"
      },
      expectedOutput: "values[0] = 1\n"
          + "values[1] = 4\n"
          + "values[2] = 9\n"
          + "values[3] = 16\n"
          + "values[4] = 25\n"
          + "values[5] = 36\n"
          + "total = 91\n"
          + "memory released",
      solution: "#include <stdio.h>\n"
          + "#include <stdlib.h>\n"
          + "\n"
          + "int main(void) {\n"
          + "    int count = 6;\n"
          + "    int *values = malloc((size_t)count * sizeof(int));\n"
          + "    if (values == NULL) {\n"
          + "        printf(\"out of memory\\n\");\n"
          + "        return 1;\n"
          + "    }\n"
          + "\n"
          + "    for (int i = 0; i < count; i++) {\n"
          + "        values[i] = (i + 1) * (i + 1);\n"
          + "    }\n"
          + "\n"
          + "    int total = 0;\n"
          + "    for (int i = 0; i < count; i++) {\n"
          + "        total += values[i];\n"
          + "        printf(\"values[%d] = %d\\n\", i, values[i]);\n"
          + "    }\n"
          + "    printf(\"total = %d\\n\", total);\n"
          + "\n"
          + "    free(values);\n"
          + "    values = NULL;\n"
          + "    printf(\"memory released\\n\");\n"
          + "    return 0;\n"
          + "}",
      mastery: [
        "能说出五类常见内存错误，并知道各自在报告里的关键字",
        "会读 valgrind 的 Invalid write 与 LEAK SUMMARY，会读 ASan 的 heap-buffer-overflow 报告",
        "写的每段堆内存代码都有「判 NULL + 配对 free + 置 NULL」，并用检查器或边界用例验证过"
      ]
    },
    {
      id: 63,
      title: "代码规范与可读性：让代码值钱",
      minutes: 18,
      gist: "命名、函数长度、注释写什么、魔法数字——四条最划算的规范。",
      lesson: "功能正确只是及格线。真实项目里的代码会被反复阅读和修改，所以「读起来省力」本身就是质量。这一关讲四条最划算的规范。\n"
        + "一、名字要说明用途。变量用名词短语（total_score、passed_count、max_value），函数用动词短语（count_passed、read_scores），宏与常量全大写（MAX_SCORES、PASS_LINE），布尔量常用 is_ / has_ 开头。单字母只留给循环下标 i、j 和公式里的 n、x。名字长一点没关系，含糊才要命：f、tmp2、data1 会让下一个读者必须读完整个函数才知道它是什么。\n"
        + "二、函数要短、只做一件事。经验值是一屏看完（约 30~50 行）。一个函数同时做「读数据 + 统计 + 打印」时，任何一处出问题都要通读全篇；拆成三段后，靠名字基本就能定位。判断标准很实用：能不能用一句话说清它做什么，并起一个不含「和」「然后」的名字。\n"
        + "三、注释写「为什么」，不写「是什么」。\n"
        + "i++;                    /* 差：复述代码 */\n"
        + "i++;                    /* 好：跳过分隔符（数据格式约定第 3 条） */\n"
        + "该写的是：为什么用这个算法、单位和取值范围、边界条件、从代码看不出的约束、已知的坑。改代码时同步改注释——过时的注释比没有注释更危险。\n"
        + "四、别让数字裸奔（魔法数字）。\n"
        + "if (scores[i] >= 60) ...          /* 60 是什么？ */\n"
        + "if (scores[i] >= PASS_LINE) ...   /* 及格线，改一次就够 */\n"
        + "同一个 60 出现在三处，将来改成 65 时漏改一处就是 bug。常量定义用 #define PASS_LINE 60（预处理替换、没有类型）或 const int pass_line = 60;（有类型、有作用域）。文件作用域的常量加 static 可以避免和其他文件重名。\n"
        + "再补几个小习惯：缩进与空格全项目统一；只读的参数加 const，让编译器帮你拦住误写；嵌套超过三层就考虑提前 return；if / while 后面即使只有一条语句也写花括号；把「能编译通过」当起点，把 -Wall -Wextra 零警告当成常态。这些看起来是小事，但它们决定了三个月后的你能不能看懂今天的代码。",
      example: {
        code: "#include <stdio.h>\n"
          + "\n"
          + "#define MAX_SCORES 40\n"
          + "#define PASS_LINE 60\n"
          + "\n"
          + "/* 反面示例：函数名没有含义，判断里直接写魔法数字 60 */\n"
          + "static int f(const int *a, int n) {\n"
          + "    int s = 0, i;\n"
          + "    for (i = 0; i < n; i++) {\n"
          + "        if (a[i] >= 60) {\n"
          + "            s++;\n"
          + "        }\n"
          + "    }\n"
          + "    return s;\n"
          + "}\n"
          + "\n"
          + "/* 正面写法：名字说明它在做什么，常量有名字，参数用 const 保护 */\n"
          + "static int count_passed(const int *scores, int count) {\n"
          + "    int passed = 0;\n"
          + "    for (int i = 0; i < count; i++) {\n"
          + "        if (scores[i] >= PASS_LINE) {\n"
          + "            passed++;\n"
          + "        }\n"
          + "    }\n"
          + "    return passed;\n"
          + "}\n"
          + "\n"
          + "int main(void) {\n"
          + "    const int scores[MAX_SCORES] = {88, 59, 72, 45, 90};\n"
          + "    int count = 5;\n"
          + "\n"
          + "    printf(\"f() = %d\\n\", f(scores, count));\n"
          + "    printf(\"count_passed() = %d\\n\", count_passed(scores, count));\n"
          + "    return 0;\n"
          + "}",
        output: "f() = 3\n"
          + "count_passed() = 3",
        explain: "f() 是反面教材：函数名 f 没有任何含义，参数 a、n 也一样，判断里直接写 60；读者必须逐行读完才知道它在数及格人数。\n"
          + "count_passed() 做同样的事，但名字说清了用途，参数叫 scores、count，及格线用 PASS_LINE，局部变量叫 passed——一眼就能看懂。\n"
          + "main 里对照打印两个结果，都是 3：说明可读性改造只改变维护成本，不改变行为。\n"
          + "另外注意数组声明成 MAX_SCORES 个元素却只初始化了 5 个，这是刻意的：容量由常量决定，将来改成 100 个学生只改一处。"
      },
      pitfalls: [
        "魔法数字散落各处：把 60 写进三个判断里，改成 65 时漏改一处，程序「有时对有时错」，还极难排查。",
        "注释与代码不同步：改了逻辑忘了改注释，下一个人按注释理解代码，比没有注释更危险。",
        "用无意义的短名字图省事：`f`、`tmp`、`a1` 让调试与改造寸步难行，尤其在多层循环里容易张冠李戴。",
        "函数越写越长：一个函数包办读入、统计、输出，出问题时只能通读全篇；拆小后错误位置通常能靠函数名直接定位。"
      ],
      takeaways: [
        "命名规则：变量用名词、函数用动词、宏与常量全大写；名字要说明用途而不是省字数",
        "函数保持一屏以内、只做一件事，拆分的依据是「能否用一句话说清」",
        "注释写为什么、单位、边界与约束；不要复述代码，也不要让注释过期",
        "魔法数字一律换成 #define 常量或 const 变量，只读参数加 const"
      ],
      questions: [
        {
          q: "要消灭代码里的魔法数字 60（及格线），最合适的做法是？",
          options: [
            "在用到的地方直接写 60，并在旁边加注释「60 表示及格线」",
            "定义一个全局变量 int pass_line = 60; 到处修改",
            "写 #define PASS_LINE 60（或 const int PASS_LINE = 60;），判断里统一用这个名字",
            "把 60 写进一个单独的 txt 文件，运行时读进来"
          ],
          answer: 2,
          explain: "把数字换成有名字的常量，改一处就够，也让读者立刻知道含义。A 的注释挡不住手滑漏改；B 用可修改的全局变量表达常量语义，容易被误改；D 把简单问题复杂化了。"
        },
        {
          q: "下面哪种注释最有价值？",
          options: [
            "`i++;  /* i 加一 */`——把代码再念一遍",
            "每个函数前面都写一段和实现无关的套话",
            "注释写完就不用维护，改代码时不必同步",
            "写清「为什么这样做」、单位与取值范围、边界条件，以及代码里看不出的约束"
          ],
          answer: 3,
          explain: "注释的价值在于补上代码表达不了的信息：意图、约束、单位、坑。复述代码的注释（A）和套话（B）只增加阅读量；C 会让注释变成谎言，比没有注释更危险。"
        },
        {
          q: "函数 `int f(int *a, int n)` 只读取数组内容并统计，最该做的改进是？",
          options: [
            "参数改成 const int *a，并把函数名改成能说明用途的名字（如 count_passed）",
            "把函数体写得更长，一次性把统计和输出都做完",
            "多用单字母变量名，让代码更短",
            "删掉所有注释，让代码更干净"
          ],
          answer: 0,
          explain: "const 让编译器帮你拦住误写，函数名是第一层文档——两处改动成本极低、收益最大。B 违反「只做一件事」，C、D 都在降低可读性。"
        }
      ],
      passRatio: 0.8,
      mission: "下面是一段能跑但难维护的代码，请把它整理成规范版本：\n"
        + "1. 常量有名字：及格线写成 #define PASS_LINE 60，判断里不要出现裸的 60；\n"
        + "2. 函数名说明用途：把 f 改名为 count_passed，参数写成 const int *scores, int count；\n"
        + "3. main 里保留 const int scores[MAX_SCORES] = {88, 59, 72, 45, 90};、int count = 5;，并输出一行 passed = 3。\n"
        + "整理完在本机编译运行，确认输出与「运行结果比对」一致。",
      starter: "#include <stdio.h>\n"
        + "\n"
        + "static int f(const int *a, int n) {\n"
        + "    int s = 0, i;\n"
        + "    for (i = 0; i < n; i++) {\n"
        + "        if (a[i] >= 60) {\n"
        + "            s++;\n"
        + "        }\n"
        + "    }\n"
        + "    return s;\n"
        + "}\n"
        + "\n"
        + "int main(void) {\n"
        + "    const int scores[5] = {88, 59, 72, 45, 90};\n"
        + "    int n = 5;\n"
        + "\n"
        + "    printf(\"f() = %d\\n\", f(scores, n));\n"
        + "    return 0;\n"
        + "}",
      hint: "本地检查会拒绝 f 这个名字，并要求 main 里调用 count_passed()、输出以 `passed = ` 开头。改名的同时顺手把 `int s = 0, i;` 拆成 `int passed = 0;` 与循环里的 `for (int i = 0; ...)`，作用域更清楚。",
      check: {
        include: ["stdio.h"],
        return0: true,
        calls: [["count_passed"],["printf","passed = "]],
        forbid: ["f"],
        require: {"funcs":["count_passed"]},
        minStatements: 6,
        message: "需要把函数改名为 count_passed()（本关不再使用 f 这个名字），在 main 里调用它并输出以 passed = 开头的一行。",
        ok: "命名、常量与输出都整理好了。"
      },
      expectedOutput: "passed = 3",
      solution: "#include <stdio.h>\n"
          + "\n"
          + "#define MAX_SCORES 40\n"
          + "#define PASS_LINE 60\n"
          + "\n"
          + "/* 只做一件事：数出及格的分数有几个 */\n"
          + "static int count_passed(const int *scores, int count) {\n"
          + "    int passed = 0;\n"
          + "    for (int i = 0; i < count; i++) {\n"
          + "        if (scores[i] >= PASS_LINE) {\n"
          + "            passed++;\n"
          + "        }\n"
          + "    }\n"
          + "    return passed;\n"
          + "}\n"
          + "\n"
          + "int main(void) {\n"
          + "    const int scores[MAX_SCORES] = {88, 59, 72, 45, 90};\n"
          + "    int count = 5;\n"
          + "\n"
          + "    printf(\"passed = %d\\n\", count_passed(scores, count));\n"
          + "    return 0;\n"
          + "}",
      mastery: [
        "能给变量、函数、常量起出说明用途的名字，并解释为什么 f 这类名字有害",
        "会把魔法数字改成 #define 常量或 const 变量，并说明两者的差别",
        "能写出解释「为什么」的注释，并主动用 const、早返回、括号提升可读性"
      ]
    },
    {
      id: 64,
      title: "综合实战：学生成绩统计（多文件工程）",
      minutes: 30,
      gist: "把成绩统计拆成 .h / .c / Makefile，先在本关写出可运行的单文件版。",
      lesson: "这一关把前面几关的东西合起来：把「学生成绩统计」写成一个真正的工程。\n"
        + "第一步：定接口。先写 grades.h，只写「外面能用什么」，不写实现：\n"
        + "#ifndef HTLAB_GRADES_H\n"
        + "#define HTLAB_GRADES_H\n"
        + "#define MAX_SCORES 32\n"
        + "#define PASS_LINE 60\n"
        + "int total_score(const int *scores, int count);\n"
        + "double average_score(const int *scores, int count);\n"
        + "int max_score(const int *scores, int count);\n"
        + "int min_score(const int *scores, int count);\n"
        + "int count_passed(const int *scores, int count);\n"
        + "#endif\n"
        + "接口设计三条原则：一个函数只做一件事；只暴露必要的名字（内部辅助函数放在 .c 里并加 static）；参数写成 const int *，明确「我不会改你的数组」。\n"
        + "第二步：写实现 grades.c。先 #include \"grades.h\"，再逐个实现。平均分必须用 (double) 提升，否则整数除法会丢掉小数；count 为 0 时给一个合理返回值，别让调用者踩到除零。\n"
        + "第三步：写入口 main.c。它只做三件事：准备数据、调用接口、组织输出——算法一行都不写。\n"
        + "第四步：写 Makefile。\n"
        + "CC = gcc\n"
        + "CFLAGS = -std=c11 -Wall -Wextra\n"
        + "OBJS = main.o grades.o\n"
        + "\n"
        + "app: $(OBJS)\n"
        + "<Tab>$(CC) $(OBJS) -o app\n"
        + "\n"
        + "%.o: %.c grades.h\n"
        + "<Tab>$(CC) $(CFLAGS) -c $< -o $@\n"
        + "\n"
        + "clean:\n"
        + "<Tab>rm -f $(OBJS) app\n"
        + "\n"
        + ".PHONY: clean\n"
        + "第五步：构建与自测。\n"
        + "gcc -c grades.c -o grades.o\n"
        + "gcc main.c grades.o -o app\n"
        + "./app\n"
        + "工程习惯（每一条都很小，合起来能省下大量时间）：\n"
        + "每写完一个函数就编译一次，不要攒到最后；\n"
        + "打开 -Wall -Wextra，把警告清零；\n"
        + "用 assert 守住「count 必须和数组长度一致」这类前提；\n"
        + "有 valgrind 或 AddressSanitizer 就跑一遍；\n"
        + "目录保持干净：简单项目平铺也可以，但源码、头文件、构建产物要有一致的放法。\n"
        + "本关的检查器只编译单文件，所以动手任务是把同一套逻辑写成单文件版。多文件版的完整拆法就在上面的五步里——强烈建议你照着在本机真的做一遍，用 make 构建、用 gdb 或断言验证一遍：那才是这一关真正要带走的能力。",
      example: {
        code: "#include <stdio.h>\n"
          + "\n"
          + "/* ===== 相当于 grades.h：接口（宏 + 函数声明） ===== */\n"
          + "#define MAX_SCORES 32\n"
          + "#define PASS_LINE 60\n"
          + "\n"
          + "int total_score(const int *scores, int count);\n"
          + "double average_score(const int *scores, int count);\n"
          + "int max_score(const int *scores, int count);\n"
          + "\n"
          + "/* ===== 相当于 grades.c：实现 ===== */\n"
          + "int total_score(const int *scores, int count) {\n"
          + "    int total = 0;\n"
          + "    for (int i = 0; i < count; i++) {\n"
          + "        total += scores[i];\n"
          + "    }\n"
          + "    return total;\n"
          + "}\n"
          + "\n"
          + "double average_score(const int *scores, int count) {\n"
          + "    if (count <= 0) {\n"
          + "        return 0.0;\n"
          + "    }\n"
          + "    return (double)total_score(scores, count) / count;\n"
          + "}\n"
          + "\n"
          + "int max_score(const int *scores, int count) {\n"
          + "    int best = scores[0];\n"
          + "    for (int i = 1; i < count; i++) {\n"
          + "        if (scores[i] > best) {\n"
          + "            best = scores[i];\n"
          + "        }\n"
          + "    }\n"
          + "    return best;\n"
          + "}\n"
          + "\n"
          + "/* ===== 相当于 main.c：把接口用起来 ===== */\n"
          + "int main(void) {\n"
          + "    const int scores[MAX_SCORES] = {88, 59, 72, 45};\n"
          + "    int count = 4;\n"
          + "\n"
          + "    printf(\"total = %d\\n\", total_score(scores, count));\n"
          + "    printf(\"average = %.2f\\n\", average_score(scores, count));\n"
          + "    printf(\"max = %d\\n\", max_score(scores, count));\n"
          + "    return 0;\n"
          + "}",
        output: "total = 264\n"
          + "average = 66.00\n"
          + "max = 88",
        explain: "这个单文件程序按多文件工程的顺序摆放：带 ===== 注释的三段分别是 grades.h（宏 MAX_SCORES / PASS_LINE 与函数声明）、grades.c（五个统计函数的定义）、main.c（准备数据并打印三行报告）。\n"
          + "average_score 里的 count <= 0 判断是接口对调用者的保护；main 里 count = 4 与数组长度一致（真实工程里可以用 assert 或 sizeof 表达式确认）。\n"
          + "把它拆成三个文件时，要做的只是：把声明搬进 grades.h 并加上守卫，把函数定义搬进 grades.c 并在开头 #include \"grades.h\"，main 留在 main.c。逻辑一行都不用改。"
      },
      pitfalls: [
        "头文件里写函数定义：被 main.c 和 grades.c 同时包含，链接报 `multiple definition of 'total_score'`。",
        "平均分用整数除法：`total_score(...) / count` 得到 71.00 这种被截断的结果，必须写 `(double)total_score(...) / count`。",
        "main 里塞进统计逻辑：入口文件越来越长，接口形同虚设，改一个统计规则要动两处。",
        "不检查边界：count 为 0 时求平均会除零，max_score 直接取 scores[0] 也失去了意义（数组里根本没有元素）——接口函数要先处理这些情况。"
      ],
      takeaways: [
        "顺序是「先定接口，再写实现，最后写入口」，每一步都可以单独编译验证",
        "一个函数只做一件事，只读参数用 const，内部函数加 static",
        "平均分用 (double) 提升被除数；count 为 0 等边界要在接口里处理",
        "Makefile 用 CC / CFLAGS / OBJS 变量与模式规则，clean 配 .PHONY"
      ],
      questions: [
        {
          q: "把单文件程序改造成多文件工程，第一步最该做的是？",
          options: [
            "先把 main 拆出来，其他照旧",
            "先定接口：在 .h 里写清函数声明、宏与类型，再写实现",
            "先把所有函数都改成 static",
            "先写 Makefile，接口最后再说"
          ],
          answer: 1,
          explain: "接口先行：main 与实现都依赖接口，先定下来后面才不会返工。C 会让函数无法被其他文件调用（static 是内部链接）；D 顺序颠倒，Makefile 写的正是「哪些文件需要一起编译」，接口没定清楚就得改。"
        },
        {
          q: "多文件工程里 main.c 想用 grades.c 中的 total_score，需要做什么？",
          options: [
            "在 main.c 里照着重新定义一份 total_score",
            "把 grades.c 里的函数改成全局变量",
            "在 main.c 里 `#include \"grades.h\"`（里面有声明），并把 grades.c 一起编译链接",
            "只要两个文件在同一个目录，编译器就会自动连接它们"
          ],
          answer: 2,
          explain: "声明让编译器认识这个函数，链接时把 grades.o 交给 gcc 才能找到实现。A 会重复定义；B 概念混乱；D 是常见误解——C 没有这种自动机制，必须显式把文件（或 .o）列进命令。"
        },
        {
          q: "编译多文件工程时，`gcc -c grades.c` 的作用是？",
          options: [
            "直接生成可执行文件 grades",
            "只做语法检查，不产生任何文件",
            "把 grades.c 转换成头文件",
            "只编译不链接，生成目标文件 grades.o"
          ],
          answer: 3,
          explain: "-c 的意思是「编译到目标文件为止」；可执行文件要等最后一步把所有 .o 链接起来。B 描述的是 -fsyntax-only 的行为；A 少了链接；C 完全不是这么回事。"
        }
      ],
      passRatio: 0.8,
      mission: "把「学生成绩统计」写成单文件版（检查器只编译单文件，多文件拆法见讲解，建议你额外在本机做一遍）：\n"
        + "1. 顶部写 #define MAX_SCORES 32 与 #define PASS_LINE 60；\n"
        + "2. 至少定义这五个函数：total_score、average_score、max_score、min_score、count_passed，参数都用 (const int *scores, int count)，average_score 用 (double) 避免整数除法；\n"
        + "3. main 里用 const int scores[8] = {88, 59, 72, 45, 90, 66, 100, 52}; 和 int count = 8;（数据直接写在代码里，不要用 scanf）；\n"
        + "4. 按顺序输出六行：\n"
        + "students: 8\n"
        + "total: 572\n"
        + "average: 71.50\n"
        + "max: 100\n"
        + "min: 45\n"
        + "passed (>=60): 5\n"
        + "写完编译运行，把输出粘贴到「运行结果比对」——本关会逐行比对。",
      starter: "#include <stdio.h>\n"
        + "\n"
        + "/* TODO: MAX_SCORES / PASS_LINE */\n"
        + "\n"
        + "/* TODO: 五个函数的声明（相当于 grades.h） */\n"
        + "\n"
        + "/* TODO: 五个函数的定义（相当于 grades.c） */\n"
        + "\n"
        + "int main(void) {\n"
        + "    const int scores[8] = {88, 59, 72, 45, 90, 66, 100, 52};\n"
        + "    int count = 8;\n"
        + "\n"
        + "    /* TODO: 六行报告（相当于 main.c） */\n"
        + "\n"
        + "    return 0;\n"
        + "}",
      hint: "先写声明再写定义，main 只负责组织输出——这就是第 59 关的接口与实现分工。每个函数只做一件事：求最大值的函数不要顺手把平均值也算了。平均分写 `(double)total_score(scores, count) / count`，否则会得到 71.00。",
      check: {
        include: ["stdio.h"],
        return0: true,
        calls: [["printf","students: "],["printf","total: "],["printf","average: "],["printf","max: "],["printf","min: "],["printf","passed"]],
        callCounts: [["printf",6,12]],
        forbid: ["scanf"],
        require: {"funcs":["total_score","average_score","max_score","min_score","count_passed"],"array":true,"loop":true},
        minStatements: 15,
        message: "需要五个统计函数（total_score / average_score / max_score / min_score / count_passed）、用数组保存 8 个分数，并按任务给出的六行格式输出。数据直接写在代码里，不要用 scanf。",
        ok: "接口、实现与报告输出都齐全，单文件版统计程序结构完整。"
      },
      expectedOutput: "students: 8\n"
          + "total: 572\n"
          + "average: 71.50\n"
          + "max: 100\n"
          + "min: 45\n"
          + "passed (>=60): 5",
      solution: "#include <stdio.h>\n"
          + "\n"
          + "/* ===== 相当于 grades.h：接口（宏 + 函数声明） ===== */\n"
          + "#ifndef HTLAB_GRADES_H\n"
          + "#define HTLAB_GRADES_H\n"
          + "\n"
          + "#define MAX_SCORES 32\n"
          + "#define PASS_LINE 60\n"
          + "\n"
          + "int total_score(const int *scores, int count);\n"
          + "double average_score(const int *scores, int count);\n"
          + "int max_score(const int *scores, int count);\n"
          + "int min_score(const int *scores, int count);\n"
          + "int count_passed(const int *scores, int count);\n"
          + "\n"
          + "#endif\n"
          + "\n"
          + "/* ===== 相当于 grades.c：实现 ===== */\n"
          + "int total_score(const int *scores, int count) {\n"
          + "    int total = 0;\n"
          + "    for (int i = 0; i < count; i++) {\n"
          + "        total += scores[i];\n"
          + "    }\n"
          + "    return total;\n"
          + "}\n"
          + "\n"
          + "double average_score(const int *scores, int count) {\n"
          + "    if (count <= 0) {\n"
          + "        return 0.0;\n"
          + "    }\n"
          + "    return (double)total_score(scores, count) / count;\n"
          + "}\n"
          + "\n"
          + "int max_score(const int *scores, int count) {\n"
          + "    int best = scores[0];\n"
          + "    for (int i = 1; i < count; i++) {\n"
          + "        if (scores[i] > best) {\n"
          + "            best = scores[i];\n"
          + "        }\n"
          + "    }\n"
          + "    return best;\n"
          + "}\n"
          + "\n"
          + "int min_score(const int *scores, int count) {\n"
          + "    int worst = scores[0];\n"
          + "    for (int i = 1; i < count; i++) {\n"
          + "        if (scores[i] < worst) {\n"
          + "            worst = scores[i];\n"
          + "        }\n"
          + "    }\n"
          + "    return worst;\n"
          + "}\n"
          + "\n"
          + "int count_passed(const int *scores, int count) {\n"
          + "    int passed = 0;\n"
          + "    for (int i = 0; i < count; i++) {\n"
          + "        if (scores[i] >= PASS_LINE) {\n"
          + "            passed++;\n"
          + "        }\n"
          + "    }\n"
          + "    return passed;\n"
          + "}\n"
          + "\n"
          + "/* ===== 相当于 main.c：输出统计报告 ===== */\n"
          + "int main(void) {\n"
          + "    const int scores[8] = {88, 59, 72, 45, 90, 66, 100, 52};\n"
          + "    int count = 8;\n"
          + "\n"
          + "    printf(\"students: %d\\n\", count);\n"
          + "    printf(\"total: %d\\n\", total_score(scores, count));\n"
          + "    printf(\"average: %.2f\\n\", average_score(scores, count));\n"
          + "    printf(\"max: %d\\n\", max_score(scores, count));\n"
          + "    printf(\"min: %d\\n\", min_score(scores, count));\n"
          + "    printf(\"passed (>=60): %d\\n\", count_passed(scores, count));\n"
          + "    return 0;\n"
          + "}",
      mastery: [
        "能独立把一段统计逻辑拆成「接口 + 实现 + 入口」，并说清每个文件放什么",
        "能写出包含变量、模式规则与 clean 的 Makefile，并用 make 构建多文件工程",
        "能用 -Wall -Wextra 零警告、断言与内存检查器验证自己的工程"
      ]
    }
  ]
});
