/* ============================================================================
 * HT Lab · C 语言课程 · 模块 3 · 数组与字符串
 * 关卡 id：25–32（本文件由模块作者维护）
 * 每关示例代码与标准答案都已用 gcc -std=c11 -Wall -Wextra 真实编译运行，
 * output 字段是程序在本机的真实输出（零警告）。
 * ==========================================================================*/
window.C_MODULES = window.C_MODULES || [];
window.C_MODULES.push({
  id: "c3",
  name: "模块 3 · 数组与字符串",
  levels: [
    {
      id: 25,
      title: "一维数组：一排同类型的格子",
      minutes: 18,
      gist: "用 int a[5] 一次声明一排元素，用下标和 for 循环访问它们，搞清下标为什么从 0 开始。",
      lesson: "数组解决的是一类很常见的问题：要处理的东西不止一个，但类型完全相同——10 个成绩、100 个温度、一行里的每个字符。如果一个一个声明变量，代码很快会变得没法维护；数组让你用「一个名字 + 一个下标」访问一整排元素。\n"
        + "声明 int a[5]; 的意思是：给我 5 个连续的 int 空间，整体叫 a。这 5 个元素在内存里紧挨着排列，第 1 个元素叫 a[0]，第 5 个叫 a[4]——下标从 0 开始，到「长度 - 1」结束。为什么从 0 开始？因为 a[i] 的准确含义是「从 a 的起始位置往后数 i 个元素」，数 0 个就是第一个元素本身。这个约定贯穿整个 C 语言，越早习惯越好。\n"
        + "声明时可以顺手初始化：int a[5] = {3, 1, 4, 1, 5}; 让花括号里的值依次填进去。如果给的值比长度少，比如 int a[5] = {1, 2};，剩下的元素会被自动填成 0——注意这只对「写了初始化列表」的情况成立；如果完全不初始化（int a[5];），里面是残留的垃圾值，不是 0。另外两个常用写法：int a[] = {1, 2, 3};（长度由初始化列表推断为 3）和 int a[5] = {0};（把全部元素清零）。\n"
        + "访问元素用 a[i]，其中 i 可以是变量，所以遍历数组总是配合 for 循环：for (i = 0; i < 5; i++) 让 i 从 0 走到 4。这里有个值得养成的习惯：循环条件写「i < 元素个数」，而不是「i <= 最后一个下标」，这样以后改长度不容易漏改。元素个数可以算出来：sizeof(a) / sizeof(a[0])，也就是整个数组的字节数除以一个元素的字节数。\n"
        + "读别人的代码时，看到 for (i = 0; i < n; i++) 就要意识到这是「把数组从头到尾过一遍」的标准骨架。另外要记住两件事：数组不能整体赋值（b = a; 是非法的，只能逐个元素复制）；C 也不会帮你检查下标——a[5] 这类越界访问编译器通常一声不吭，但结果完全不可预测。",
      example: {
        code: "#include <stdio.h>\n"
          + "\n"
          + "int main(void) {\n"
          + "    int a[5] = {3, 1, 4, 1, 5};\n"
          + "    int i;\n"
          + "    int sum = 0;\n"
          + "    int max = a[0];\n"
          + "\n"
          + "    for (i = 0; i < 5; i++) {\n"
          + "        printf(\"a[%d] = %d\\n\", i, a[i]);\n"
          + "        sum += a[i];\n"
          + "        if (a[i] > max) {\n"
          + "            max = a[i];\n"
          + "        }\n"
          + "    }\n"
          + "\n"
          + "    printf(\"sum = %d\\n\", sum);\n"
          + "    printf(\"max = %d\\n\", max);\n"
          + "    printf(\"average = %.2f\\n\", (double)sum / 5);\n"
          + "    return 0;\n"
          + "}",
        output: "a[0] = 3\n"
          + "a[1] = 1\n"
          + "a[2] = 4\n"
          + "a[3] = 1\n"
          + "a[4] = 5\n"
          + "sum = 14\n"
          + "max = 5\n"
          + "average = 2.80",
        explain: "第 4 行 int a[5] = {3, 1, 4, 1, 5}; 一次声明了 5 个 int 并依次填入初值。第 7 行 int max = a[0]; 拿第一个元素当比较的起点——不要写 0，否则输入全是负数时结果是错的。"
          + "第 9 行的循环是数组遍历的标准骨架：i 从 0 数到 4，正好覆盖 a[0]…a[4]；循环体里同时做了三件事——打印每个元素、累加进 sum、和当前最大值比较。"
          + "第 19 行的 (double)sum / 5 先把 sum 转成 double 再相除，否则整数除法会把 2.8 截成 2，%.2f 也就打不出 2.80 了。"
      },
      pitfalls: [
        "越界访问：int a[5]; 只有 a[0]…a[4]，写 a[5] 就是访问数组外面的内存。编译器通常不报错，但读到的是垃圾值，写入则可能让程序崩溃或悄悄改坏别的变量。",
        "以为没初始化的数组是 0：int a[5]; 里的元素是残留的垃圾值。要清零必须写 int a[5] = {0};。",
        "把「元素个数」和「最后一个下标」搞混：5 个元素的最大下标是 4，循环条件写成 i <= 5 就会越界。",
        "数组不能整体赋值：b = a; 编译不过，只能逐个元素复制（或用库函数）。",
        "用变量当数组长度：int n = 5; int a[n]; 是 C99 的变长数组，属于可选特性，工程上一般不用；初学阶段长度一律写常量表达式。"
      ],
      takeaways: [
        "int a[5] 声明 5 个连续的同类型元素，合法下标是 0…4",
        "部分初始化时剩下的元素自动为 0；完全不初始化则是垃圾值",
        "遍历写成 for (i = 0; i < 元素个数; i++)，元素个数可以用 sizeof(a)/sizeof(a[0]) 求",
        "C 不做数组边界检查，越界访问的后果要自己承担"
      ],
      questions: [
        {
          q: "声明 `int a[5];` 后，可以合法访问的下标范围是？",
          options: [
            "1 到 5",
            "0 到 4",
            "0 到 5",
            "1 到 4"
          ],
          answer: 1,
          explain: "下标从 0 开始，5 个元素的下标依次是 0、1、2、3、4。a[5] 不属于这个数组——C 不做边界检查，编译器一般也不会报错，但那是越界访问，结果不可预测。选项 A、D 从 1 开始数，是把它当成了「第几个」；选项 C 多算了最后一个。"
        },
        {
          q: "`int a[5] = {1, 2};` 之后，a[3] 的值是多少？",
          options: [
            "0",
            "一个不确定的随机值",
            "2",
            "编译错误"
          ],
          answer: 0,
          explain: "部分初始化时，没有写出来的元素会被自动初始化为 0，所以 a 是 {1, 2, 0, 0, 0}。选项 B 混淆了两种情况：只有「完全不初始化」的局部数组才是垃圾值，一旦写了初始化列表，剩下的部分就是 0。选项 D 也不对：初始化列表比数组短完全合法。"
        },
        {
          q: "遍历 `int a[5]` 时把循环写成 `for (i = 0; i <= 5; i++)`，问题是什么？",
          options: [
            "少访问了一个元素",
            "多访问了一次，i 等于 5 时越界",
            "没有问题，只是写法不同",
            "会造成死循环"
          ],
          answer: 1,
          explain: "i 取到 5 时会访问 a[5]，而这个数组只有 a[0]…a[4]，属于越界。正确写法是 i < 5（或 i <= 4）。选项 A 正好说反；选项 D 也不会发生：i 会一直加到 6 才停下，循环能正常结束。"
        }
      ],
      passRatio: 0.8,
      mission: "写一个程序：把 5 个整数读进 int a[5]（本机测试用这组数据：3 1 4 1 5），然后\n"
        + "1. 按输入顺序输出 5 行，格式为 a[0] = 3（下标和值都要有）；\n"
        + "2. 输出一行 reverse: 5 1 4 1 3——把这 5 个数倒着输出，数字之间用一个空格分隔，冒号后面也要有一个空格；\n"
        + "3. 最后输出 sum = 14，即这 5 个数的和。\n"
        + "读入请用 scanf(\"%d\", &a[i])，遍历请用 for 循环。",
      starter: "#include <stdio.h>\n\n"
        + "int main(void) {\n"
        + "    int a[5];\n"
        + "    int i;\n"
        + "    int sum = 0;\n\n"
        + "    /* TODO 1: 用 for + scanf 把 5 个整数读进 a */\n\n"
        + "    /* TODO 2: 按顺序输出 a[0] = 3 这样的 5 行，同时累加 sum */\n\n"
        + "    /* TODO 3: 倒序输出 reverse: ... 这一行 */\n\n"
        + "    printf(\"sum = %d\\n\", sum);\n"
        + "    return 0;\n"
        + "}",
      hint: "把「读入」「正序输出并累加」「倒序输出」写成三个独立的 for 循环，比全挤在一个循环里好检查。倒序循环写作 for (i = 4; i >= 0; i--)；注意 i 的类型——这里用 int 没问题，但如果用无符号类型，条件 i >= 0 永远成立，会变成死循环。",
      check: {
        include: ["stdio.h"],
        noInclude: ["conio.h"],
        return0: true,
        require: { array: true, for: true },
        calls: [["scanf", "%d"], ["printf", "a[%d]"]],
        forbid: ["gets"],
        minStatements: 6,
        message: "本关需要：#include <stdio.h>、int main(void)、一个数组（形如 int a[5];）、for 循环、在 main 里用 scanf 读入整数、用 a[0] = 3 这样的格式输出，最后 return 0; 。",
        ok: "数组、循环、读入、输出都齐全，结构完全正确。"
      },
      input: "3 1 4 1 5\n",
      expectedOutput: "a[0] = 3\na[1] = 1\na[2] = 4\na[3] = 1\na[4] = 5\nreverse: 5 1 4 1 3\nsum = 14",
      solution: "#include <stdio.h>\n"
        + "\n"
        + "int main(void) {\n"
        + "    int a[5];\n"
        + "    int i;\n"
        + "    int sum = 0;\n"
        + "\n"
        + "    for (i = 0; i < 5; i++) {\n"
        + "        scanf(\"%d\", &a[i]);\n"
        + "    }\n"
        + "\n"
        + "    for (i = 0; i < 5; i++) {\n"
        + "        printf(\"a[%d] = %d\\n\", i, a[i]);\n"
        + "        sum += a[i];\n"
        + "    }\n"
        + "\n"
        + "    printf(\"reverse:\");\n"
        + "    for (i = 4; i >= 0; i--) {\n"
        + "        printf(\" %d\", a[i]);\n"
        + "    }\n"
        + "    printf(\"\\n\");\n"
        + "    printf(\"sum = %d\\n\", sum);\n"
        + "    return 0;\n"
        + "}",
      mastery: [
        "能声明并初始化一维数组，说清部分初始化时剩下的元素是什么值",
        "能用 for 循环遍历数组完成求和、求最大值、倒序输出",
        "看到 a[5] 这样的下标能立刻判断出它有没有越界"
      ]
    },
    {
      id: 26,
      title: "数组与函数：为什么必须多传一个长度",
      minutes: 20,
      gist: "数组名传进函数会退化成指针，长度信息随之丢失——这是 C 里数组传参的核心规则。",
      lesson: "上一关我们在 main 里用 sizeof(a) / sizeof(a[0]) 求出了元素个数。现在把这个数组交给一个函数去处理，你会发现问题来了：函数里算不出这个长度。原因在于 C 传数组的方式——数组名出现在实参位置时会「退化」成指向首元素的指针，函数收到的是首元素的地址，而不是整份数组的拷贝。\n"
        + "为什么要这样设计？因为数组可能很大，每次调用都整体复制一遍代价太高。传地址既快，又允许函数直接修改原数组里的内容。代价是：「这是多少个元素的数组」这个信息在传参那一刻就丢了，函数只知道「从这里开始有一串 int」，但不知道什么时候到头。所以 C 程序员的惯例是：数组和长度成对传递，也就是 int sum_of(const int a[], int n)。\n"
        + "形参写成 int a[] 和写成 int *a 是完全等价的，编译器把两种写法都理解成「一个指针」。再在前面加上 const，表示函数承诺不修改元素内容——这是给调用者看的保证，也是好习惯：只读的函数都该写上 const。\n"
        + "有个经典 bug 就是从退化来的：在函数里写 sizeof(a) 想求数组大小。因为 a 已经是指针，sizeof(a) 得到的是指针本身的大小（64 位程序里是 8），和数组里有多少元素毫无关系。记住这条分界线：只有在数组还没退化的地方——也就是定义它的那个作用域里——sizeof 才能算出数组的真实大小；把这个数字当参数传下去，函数里才有长度可用。\n"
        + "调用时只写数组名，不要带方括号：sum_of(scores, n)。还有一点值得留意：函数通过形参修改元素（比如 a[0] = 100）会真的改掉调用者的数组，因为双方操作的是同一块内存；但如果函数里写 a = 别的数组，那只是改了这个局部指针的指向，调用者的数组不受影响。",
      example: {
        code: "#include <stdio.h>\n"
          + "\n"
          + "/* 数组名传进函数后会退化成指针，函数自己不知道数组有多长，所以要额外传 n */\n"
          + "int sum_of(const int a[], int n) {\n"
          + "    int i;\n"
          + "    int s = 0;\n"
          + "\n"
          + "    for (i = 0; i < n; i++) {\n"
          + "        s += a[i];\n"
          + "    }\n"
          + "    return s;\n"
          + "}\n"
          + "\n"
          + "double average_of(const int a[], int n) {\n"
          + "    return (double)sum_of(a, n) / n;\n"
          + "}\n"
          + "\n"
          + "int main(void) {\n"
          + "    int scores[6] = {88, 92, 79, 95, 70, 83};\n"
          + "    int n = (int)(sizeof(scores) / sizeof(scores[0]));\n"
          + "    int *p = scores; /* 数组名在这里退化成指向首元素的指针 */\n"
          + "\n"
          + "    printf(\"n = %d\\n\", n);\n"
          + "    printf(\"sizeof(scores) = %d\\n\", (int)sizeof(scores));\n"
          + "    printf(\"sizeof(scores[0]) = %d\\n\", (int)sizeof(scores[0]));\n"
          + "    printf(\"sizeof(p) = %d\\n\", (int)sizeof(p));\n"
          + "    printf(\"sum = %d\\n\", sum_of(scores, n));\n"
          + "    printf(\"average = %.2f\\n\", average_of(scores, n));\n"
          + "    return 0;\n"
          + "}",
        output: "n = 6\n"
          + "sizeof(scores) = 24\n"
          + "sizeof(scores[0]) = 4\n"
          + "sizeof(p) = 8\n"
          + "sum = 507\n"
          + "average = 84.50",
        explain: "第 4 行的形参写成 const int a[]，它和第 21 行 int *p = scores; 里的 p 本质上是同一种东西——都只是指针，const 表示函数不修改元素。"
          + "第 8 行 sum_of 里的 for 靠参数 n 决定循环几次，这正是长度必须单独传的原因。"
          + "第 20 行在 main 里用 sizeof(scores) / sizeof(scores[0]) = 24 / 4 = 6 算出元素个数——此时 scores 还是真正的数组，sizeof 才有意义。"
          + "第 26 行打印 sizeof(p) 得到 8：这就是指针的大小，也正是函数里 sizeof(a) 会得到的值。"
      },
      pitfalls: [
        "在函数里写 sizeof(a) / sizeof(a[0]) 求元素个数：a 已经退化成指针，sizeof(a) 是指针大小（本机 64 位程序为 8），除以 4 得 2，和真实元素个数毫无关系。",
        "调用时写成 sum_of(scores[], 6)：方括号只能出现在声明里，实参位置不能带。",
        "只传了数组忘了传长度，函数里只好硬编码一个数字，换一批数据就得改函数。",
        "以为函数改不到原数组：形参是指针，a[0] = 100 会真的改掉调用者的数组；但函数里写 a = 另一个数组只改了局部指针，调用者不受影响。"
      ],
      takeaways: [
        "数组名作为实参时退化为指向首元素的指针，形参 int a[] 等价于 int *a",
        "函数拿到数组的同时必须拿到长度，惯例是「数组 + 长度」成对传递",
        "只有数组还没退化的作用域里，sizeof 才能求出真实长度",
        "只读的数组参数写成 const，向调用者表明不会修改内容"
      ],
      questions: [
        {
          q: "把数组传给 `int sum_of(const int a[], int n)` 后，函数里的 a 实际是什么？",
          options: [
            "整个数组的一份拷贝",
            "一个记录数组长度的整数",
            "指向数组首元素的指针",
            "指向数组末元素的指针"
          ],
          answer: 2,
          explain: "数组名作为实参时退化为指向首元素的指针，形参 int a[] 和 int *a 完全等价。选项 A 错在「拷贝」：C 传数组不会自动整体复制（结构体才按值传），这正是为了效率；选项 B、D 也不对，长度和末元素的位置都不会自动带进函数。"
        },
        {
          q: "为什么函数里不能靠 `sizeof(a) / sizeof(a[0])` 求元素个数（a 是数组形参）？",
          options: [
            "因为 sizeof 不能用在形参名上",
            "因为 sizeof 得到的就是元素个数",
            "因为 sizeof 返回的是浮点数",
            "因为 a 已经是指针，sizeof(a) 得到的是指针本身的大小"
          ],
          answer: 3,
          explain: "退化之后「这是多少个元素的数组」这个信息就丢了，sizeof(a) 得到 8（64 位程序里指针的大小），除以 sizeof(int) 得 2，和真实元素个数没有关系。选项 A 错：语法上完全可以写，只是值没有意义；选项 C 错：sizeof 返回 size_t，是整数类型。"
        },
        {
          q: "调用上面那个函数时，正确的写法是？",
          options: [
            "sum_of(scores[], 6)",
            "sum_of(scores, 6)",
            "sum_of(sizeof scores, scores)",
            "sum_of(*scores, 6)"
          ],
          answer: 1,
          explain: "传数组只写数组名，长度作为第二个参数单独传。选项 A 是语法错误，方括号只出现在声明里；选项 C 把长度和数组传反了，而且 sizeof scores 是字节数 24，不是元素个数 6；选项 D 的 *scores 是第一个元素的值，不是数组。"
        }
      ],
      passRatio: 0.8,
      mission: "写一个程序：\n"
        + "1. 自己定义 int sum_of(const int a[], int n)（返回前 n 个元素之和）和 int find_max(const int a[], int n)（返回最大值）两个函数；\n"
        + "2. 在 main 里声明 int scores[8];，用 scanf(\"%d\", &scores[i]) 读入 8 个整数（本机测试用：88 92 79 95 70 83 91 77）；\n"
        + "3. 用 sizeof(scores) / sizeof(scores[0]) 算出元素个数存进 n，不要写死 8；\n"
        + "4. 依次输出 n = 8、sum = 675、max = 95、average = 84.38（平均值保留两位小数）。",
      starter: "#include <stdio.h>\n\n"
        + "/* TODO 1: 定义 sum_of(const int a[], int n) */\n\n"
        + "/* TODO 2: 定义 find_max(const int a[], int n) */\n\n"
        + "int main(void) {\n"
        + "    int scores[8];\n"
        + "    int i;\n"
        + "    int n = (int)(sizeof(scores) / sizeof(scores[0]));\n"
        + "    int sum;\n"
        + "    int max;\n\n"
        + "    /* TODO 3: 读入 n 个整数 */\n\n"
        + "    /* TODO 4: 调用自己写的两个函数 */\n\n"
        + "    /* TODO 5: 按格式输出 n / sum / max / average */\n"
        + "    return 0;\n"
        + "}",
      hint: "两个函数都要先想清楚边界：求和从 0 开始累加；求最大值不要从 0 开始比，而是拿 a[0] 当初始最大值、从 a[1] 开始比较——否则输入全是负数时会得到错误结果（顺便想想空数组会怎样）。平均值要写 (double)sum / n，不然整数除法会把小数部分截掉。",
      check: {
        include: ["stdio.h"],
        noInclude: ["conio.h"],
        return0: true,
        require: { funcs: ["sum_of", "find_max"], array: true, for: true },
        calls: [["scanf", "%d"], ["printf", "sum"]],
        seqAny: [["sizeof", "(", "scores", ")"], ["sizeof", "scores"]],
        forbid: ["gets"],
        minStatements: 8,
        message: "本关需要：#include <stdio.h>、int main(void)、int scores[8] 这样的数组、for 循环、自己定义 sum_of 与 find_max 两个函数、在 main 里用 scanf 读入、用 sizeof(scores)/sizeof(scores[0]) 求长度并打印结果，最后 return 0; 。",
        ok: "两个函数、数组、循环、读写都齐全，结构完全正确。"
      },
      input: "88 92 79 95 70 83 91 77\n",
      solution: "#include <stdio.h>\n"
        + "\n"
        + "int sum_of(const int a[], int n) {\n"
        + "    int i;\n"
        + "    int s = 0;\n"
        + "\n"
        + "    for (i = 0; i < n; i++) {\n"
        + "        s += a[i];\n"
        + "    }\n"
        + "    return s;\n"
        + "}\n"
        + "\n"
        + "int find_max(const int a[], int n) {\n"
        + "    int i;\n"
        + "    int m = a[0];\n"
        + "\n"
        + "    for (i = 1; i < n; i++) {\n"
        + "        if (a[i] > m) {\n"
        + "            m = a[i];\n"
        + "        }\n"
        + "    }\n"
        + "    return m;\n"
        + "}\n"
        + "\n"
        + "int main(void) {\n"
        + "    int scores[8];\n"
        + "    int i;\n"
        + "    int n = (int)(sizeof(scores) / sizeof(scores[0]));\n"
        + "    int sum;\n"
        + "    int max;\n"
        + "\n"
        + "    for (i = 0; i < n; i++) {\n"
        + "        scanf(\"%d\", &scores[i]);\n"
        + "    }\n"
        + "\n"
        + "    sum = sum_of(scores, n);\n"
        + "    max = find_max(scores, n);\n"
        + "\n"
        + "    printf(\"n = %d\\n\", n);\n"
        + "    printf(\"sum = %d\\n\", sum);\n"
        + "    printf(\"max = %d\\n\", max);\n"
        + "    printf(\"average = %.2f\\n\", (double)sum / n);\n"
        + "    return 0;\n"
        + "}",
      mastery: [
        "能写出接收「数组 + 长度」的函数并在函数里遍历元素",
        "能解释数组名退化为指针后，sizeof 为什么会给出指针大小",
        "能判断一个函数会不会改到调用者数组里的元素"
      ]
    },
{
      id: 27,
      title: "二维数组：表格、行列与矩阵转置",
      minutes: 20,
      gist: "用 int m[3][3] 表示表格，搞清行列遍历与行优先的内存布局，并独立完成矩阵转置。",
      lesson: "二维数组就是「数组的数组」。int m[3][3]; 要从里往外读：m 是一个有 3 个元素的数组，每个元素是 int[3]。所以它一共能放 3 × 3 = 9 个 int，访问方式是 m[行][列]。\n"
        + "虽然写法上有两个维度，它在内存里仍然是一条连续的直线，按「行优先」排列：m[0][0]、m[0][1]、m[0][2]、m[1][0]……先把第一行放完，再放第二行。理解这一点，等到学指针和数组的关系时会轻松很多。\n"
        + "初始化可以写成嵌套花括号，形状和逻辑结构一一对应：int m[2][3] = {{1, 2, 3}, {4, 5, 6}};。写成一整行也合法（int m[2][3] = {1, 2, 3, 4, 5, 6};），但嵌套写法更容易检查有没有填错位置。\n"
        + "遍历二维数组用双重循环，习惯上外层走行、内层走列：for (i = 0; i < 行数; i++) 里面再套 for (j = 0; j < 列数; j++)。行数和列数同样可以用 sizeof 推出来：rows = sizeof(m) / sizeof(m[0]);（总字节数除以一行的字节数），cols = sizeof(m[0]) / sizeof(m[0][0]);（一行的字节数除以一个元素的字节数）。把行列数算出来而不是写死 3，以后改维度就不会漏改。\n"
        + "最典型的练习是矩阵转置：把第 i 行第 j 列的元素搬到第 j 行第 i 列，写成一行就是 t[j][i] = m[i][j];。注意两个数组的形状是反的——2×3 的矩阵转置之后是 3×2，所以目标数组必须按转置后的形状声明，否则就会越界。\n"
        + "最后记一个例外：二维数组传给函数时，第二维的长度必须写出来（例如 void show(int a[][3], int rows)），不能像一维数组那样只留一对空方括号。这是它和一维数组不同的地方，原因涉及地址计算，第 4 模块讲指针时会揭开。",
      example: {
        code: "#include <stdio.h>\n"
          + "\n"
          + "int main(void) {\n"
          + "    int m[3][3] = {\n"
          + "        {1, 2, 3},\n"
          + "        {4, 5, 6},\n"
          + "        {7, 8, 9}\n"
          + "    };\n"
          + "    int t[3][3];\n"
          + "    int rows = (int)(sizeof(m) / sizeof(m[0]));\n"
          + "    int cols = (int)(sizeof(m[0]) / sizeof(m[0][0]));\n"
          + "    int i, j;\n"
          + "\n"
          + "    printf(\"rows = %d, cols = %d\\n\", rows, cols);\n"
          + "    printf(\"matrix:\\n\");\n"
          + "    for (i = 0; i < rows; i++) {\n"
          + "        for (j = 0; j < cols; j++) {\n"
          + "            printf(\"%4d\", m[i][j]);\n"
          + "        }\n"
          + "        printf(\"\\n\");\n"
          + "    }\n"
          + "\n"
          + "    /* 转置：把第 i 行第 j 列放到第 j 行第 i 列 */\n"
          + "    for (i = 0; i < rows; i++) {\n"
          + "        for (j = 0; j < cols; j++) {\n"
          + "            t[j][i] = m[i][j];\n"
          + "        }\n"
          + "    }\n"
          + "\n"
          + "    printf(\"transpose:\\n\");\n"
          + "    for (i = 0; i < rows; i++) {\n"
          + "        for (j = 0; j < cols; j++) {\n"
          + "            printf(\"%4d\", t[i][j]);\n"
          + "        }\n"
          + "        printf(\"\\n\");\n"
          + "    }\n"
          + "    return 0;\n"
          + "}",
        output: "rows = 3, cols = 3\n"
          + "matrix:\n"
          + "   1   2   3\n"
          + "   4   5   6\n"
          + "   7   8   9\n"
          + "transpose:\n"
          + "   1   4   7\n"
          + "   2   5   8\n"
          + "   3   6   9",
        explain: "第 4 行用嵌套花括号把 3×3 矩阵按行填进去，形状和逻辑结构一致，填错位置一眼就能看出来。"
          + "第 10、11 行用 sizeof 算出行列数：sizeof(m) 是整个矩阵的字节数 36，sizeof(m[0]) 是一行的字节数 12，sizeof(m[0][0]) 是一个元素的字节数 4，相除得到 3 和 3。"
          + "第 16、17 行的双重循环按行、列打印矩阵，第 18 行的 %4d 让每个数字占 4 个字符宽并右对齐，所以各列是对齐的。"
          + "第 26 行 t[j][i] = m[i][j]; 就是转置的全部逻辑：把第 i 行第 j 列的元素搬到第 j 行第 i 列。"
      },
      pitfalls: [
        "两个下标写反：m[i][j] 是第 i 行第 j 列。写反了程序照样能编译运行，但结果全错——这类错误编译器不会提醒你。",
        "转置时目标数组形状没跟着换：2×3 转置后是 3×2，目标必须声明成 int t[3][2];，照抄成 [2][3] 就会越界。",
        "以为二维数组是按列存的：C 是行优先，先放完一整行再放下一行。",
        "把二维数组传给函数时只写 int a[][]：第二维长度必须写出来（int a[][3]），这是一维数组没有的限制。",
        "行列数写死 3：用 sizeof(m)/sizeof(m[0]) 这类写法算出来，换维度时循环条件不用改。"
      ],
      takeaways: [
        "int m[3][3] 是「3 个元素的数组，每个元素是 int[3]」，一共 9 个 int",
        "C 的二维数组在内存里按行优先连续存放",
        "遍历用双重循环：外层走行、内层走列",
        "转置就是 t[j][i] = m[i][j]，目标数组的行列数要交换"
      ],
      questions: [
        {
          q: "`int m[2][3];` 一共能存放多少个 int？",
          options: [
            "6 个",
            "5 个",
            "2 个",
            "3 个"
          ],
          answer: 0,
          explain: "二维数组的元素个数是各维长度的乘积：2 × 3 = 6。可以理解成「2 个元素，每个元素是 int[3]」。选项 B 把 2 + 3 当成了个数；选项 C、D 只数了其中一维。"
        },
        {
          q: "要转置矩阵，把 m[i][j] 放到目标数组 t 的正确位置，应该写？",
          options: [
            "t[i][j] = m[i][j];",
            "t[j][j] = m[i][j];",
            "t[j][i] = m[i][j];",
            "t[i][i] = m[i][j];"
          ],
          answer: 2,
          explain: "转置就是把行列互换：原来第 i 行第 j 列的元素，搬到第 j 行第 i 列。选项 A 是原样复制，等于没有转置；选项 B、D 把两个下标写成同一个，只有对角线上的元素会被放对，其余全乱。"
        },
        {
          q: "`int m[2][3]` 在内存里的排列顺序是？",
          options: [
            "先放所有第 0 列，再放所有第 1 列",
            "顺序不确定，由编译器决定",
            "按数值大小排序",
            "一行接一行连续存放（行优先）"
          ],
          answer: 3,
          explain: "C 的二维数组就是「数组的数组」，顺序是 m[0][0]、m[0][1]、m[0][2]、m[1][0]……一行放完再放下一行。选项 A 说的是列优先，那是 Fortran 一类语言的布局；选项 B 也不对，C 标准明确规定了行优先。"
        }
      ],
      passRatio: 0.8,
      mission: "写一个程序：读入一个 2 行 3 列的整数矩阵（按行优先顺序共 6 个整数，本机测试用：第一行 1 2 3，第二行 4 5 6），把它转置成 3 行 2 列，然后\n"
        + "1. 每行输出两个整数，中间用一个空格分隔，共 3 行；\n"
        + "2. 结果应当是：第一行 1 4，第二行 2 5，第三行 3 6（每行末尾不要多余的空格）。\n"
        + "要求：用 int m[2][3]; 存原矩阵、int t[3][2]; 存转置结果，读入用 scanf(\"%d\", &m[i][j])，读入、转置、输出各用一个双重 for 循环。",
      starter: "#include <stdio.h>\n\n"
        + "int main(void) {\n"
        + "    int m[2][3];\n"
        + "    int t[3][2];\n"
        + "    int i, j;\n\n"
        + "    /* TODO 1: 双重循环读入 2×3 的矩阵 */\n\n"
        + "    /* TODO 2: 双重循环把 m 转置到 t */\n\n"
        + "    /* TODO 3: 双重循环按 3 行 2 列输出 */\n"
        + "    return 0;\n"
        + "}",
      hint: "读入和输出都用双重 for：外层 i 走行、内层 j 走列。转置只有一条赋值语句，关键是下标——原矩阵的 m[i][j] 应该落到 t 的哪一行、哪一列？先在本子上画一个 2×3 的表格，把每个数字转置后该去的位置标出来，再写代码。输出时不要每个数字后面都跟一个空格，用 if 判断是不是这一行的最后一个，只在数字之间打空格。",
      check: {
        include: ["stdio.h"],
        noInclude: ["conio.h"],
        return0: true,
        require: { array: true, for: true },
        calls: [["scanf", "%d"], ["printf"]],
        forbid: ["gets"],
        minStatements: 8,
        message: "本关需要：#include <stdio.h>、int main(void)、数组（int m[2][3] 与 int t[3][2]）、for 循环、在 main 里用 scanf 读入、用 printf 输出，最后 return 0; 。",
        ok: "二维数组、双重循环、读入输出都齐全，结构完全正确。"
      },
      input: "1 2 3\n4 5 6\n",
      expectedOutput: "1 4\n2 5\n3 6",
      solution: "#include <stdio.h>\n"
        + "\n"
        + "int main(void) {\n"
        + "    int m[2][3];\n"
        + "    int t[3][2];\n"
        + "    int i, j;\n"
        + "\n"
        + "    /* 按行优先顺序读入 2 行 3 列 */\n"
        + "    for (i = 0; i < 2; i++) {\n"
        + "        for (j = 0; j < 3; j++) {\n"
        + "            scanf(\"%d\", &m[i][j]);\n"
        + "        }\n"
        + "    }\n"
        + "\n"
        + "    for (i = 0; i < 2; i++) {\n"
        + "        for (j = 0; j < 3; j++) {\n"
        + "            t[j][i] = m[i][j];\n"
        + "        }\n"
        + "    }\n"
        + "\n"
        + "    for (i = 0; i < 3; i++) {\n"
        + "        for (j = 0; j < 2; j++) {\n"
        + "            printf(\"%d\", t[i][j]);\n"
        + "            if (j < 1) {\n"
        + "                printf(\" \");\n"
        + "            }\n"
        + "        }\n"
        + "        printf(\"\\n\");\n"
        + "    }\n"
        + "    return 0;\n"
        + "}",
      mastery: [
        "能声明并初始化二维数组，用双重循环按行列遍历",
        "能用 sizeof 算出二维数组的行数和列数",
        "能独立完成矩阵转置，并说清行优先的内存布局"
      ]
    },
    {
      id: 28,
      title: "字符数组与字符串：结尾那个 '\\0'",
      minutes: 18,
      gist: "字符串就是「以 '\\0' 结尾的字符数组」；分清 sizeof 与 strlen，并自己动手处理每个字符。",
      lesson: "C 语言里没有独立的「字符串类型」，字符串是用字符数组表示的，并且有一个约定：以 '\\0' 结尾。'\\0' 是一个字符，它的值是 0，用来标记「字符串到此结束」。注意别和字符 '0' 混淆：'0' 的 ASCII 码是 48，'\\0' 才是 0。\n"
        + "所以「字符数组」和「字符串」不是一回事：一个 char 数组，只要最后一个有效字符后面跟着 '\\0'，它就是字符串；没有 '\\0'，它就只是一个装着若干字符的数组，任何按字符串处理它的函数都会一路往后读，直到碰巧遇到一个 0——这就是越界读，行为不可预测。\n"
        + "用字面量初始化时，编译器会自动补上 '\\0'：char s[] = \"hello\"; 实际占 6 个字节——5 个字母加一个 '\\0'。这里就能看出 sizeof 和 strlen 的根本区别：sizeof 是「这个数组占多少字节」，编译期就定下来了，得到 6；strlen 是「从开头数到 '\\0' 之前有多少个字符」，运行期一个个数过去，得到 5。数组声明得比内容长时，比如 char s[10] = \"hi\";，sizeof 是 10（数组容量），strlen 是 2（实际内容），剩下没用到的字节会被初始化为 0——只要写了初始化列表，它们就不会是垃圾值。\n"
        + "逐字符遍历字符串的标准写法是让 '\\0' 当终止条件：for (i = 0; s[i] != '\\0'; i++)。也可以写 i < strlen(s)，但那样每一轮都要重新数一遍长度，效率低；真要用长度，就先算出来存进一个变量。\n"
        + "最后两条禁令：字符串字面量（\"hello\" 这种）本身不可修改，往里写是未定义行为；数组也不能整体赋值，s = \"world\"; 是非法的，想改内容只能逐个字符改，或者用下一关的复制函数。",
      example: {
        code: "#include <stdio.h>\n"
          + "#include <string.h>\n"
          + "\n"
          + "int main(void) {\n"
          + "    char s1[] = \"hello\";                     /* 6 个字节：5 个字符 + '\\0' */\n"
          + "    char s2[10] = \"hi\";                      /* 10 个字节，只用了前 3 个 */\n"
          + "    char s3[] = {'w', 'o', 'r', 'l', 'd', '\\0'};\n"
          + "    char copy[10];\n"
          + "    int i;\n"
          + "\n"
          + "    printf(\"s1 = %s\\n\", s1);\n"
          + "    printf(\"sizeof(s1) = %d, strlen(s1) = %d\\n\", (int)sizeof(s1), (int)strlen(s1));\n"
          + "    printf(\"s2 = %s\\n\", s2);\n"
          + "    printf(\"sizeof(s2) = %d, strlen(s2) = %d\\n\", (int)sizeof(s2), (int)strlen(s2));\n"
          + "    printf(\"s3 = %s\\n\", s3);\n"
          + "\n"
          + "    for (i = 0; i < 6; i++) {\n"
          + "        printf(\"s1[%d] = %d\\n\", i, s1[i]);\n"
          + "    }\n"
          + "\n"
          + "    /* 手动复制：循环只搬字符，最后必须自己补上 '\\0' */\n"
          + "    for (i = 0; i < 5; i++) {\n"
          + "        copy[i] = s1[i];\n"
          + "    }\n"
          + "    copy[5] = '\\0';\n"
          + "    printf(\"copy = %s\\n\", copy);\n"
          + "    return 0;\n"
          + "}",
        output: "s1 = hello\n"
          + "sizeof(s1) = 6, strlen(s1) = 5\n"
          + "s2 = hi\n"
          + "sizeof(s2) = 10, strlen(s2) = 2\n"
          + "s3 = world\n"
          + "s1[0] = 104\n"
          + "s1[1] = 101\n"
          + "s1[2] = 108\n"
          + "s1[3] = 108\n"
          + "s1[4] = 111\n"
          + "s1[5] = 0\n"
          + "copy = hello",
        explain: "第 5 行 char s1[] = \"hello\"; 看起来只有 5 个字符，但编译器会自动补一个 '\\0'，所以数组实际是 6 个字节——第 12 行打印出来的 sizeof(s1) = 6、strlen(s1) = 5 就是这么来的。"
          + "第 6 行 char s2[10] = \"hi\"; 声明了 10 个字节，只填了 'h'、'i'、'\\0' 三个，剩下 7 个字节被初始化为 0，所以 sizeof 是 10、strlen 是 2。"
          + "第 7 行用字符列表初始化 s3，'\\0' 必须自己写；第 17 行的循环把 s1 的每个字节打印成数字：前 5 个是字母的编码（104 就是 'h'），第 6 个是 0，也就是 '\\0'。"
          + "第 22 行的手动复制只搬了 5 个字符，所以第 25 行必须自己补 copy[5] = '\\0';，否则 copy 里没有结束符，用 %s 打印时会一路读下去。"
      },
      pitfalls: [
        "忘记 '\\0'：char s[3] = {'a', 'b', 'c'}; 不是字符串，用 %s 打印会继续读数组后面的内存，直到碰巧遇到一个 0——这是未定义行为，可能输出乱码甚至崩溃。",
        "把 sizeof 当成字符串长度：char s[100] = \"hi\"; 的 sizeof 是 100，strlen 才是 2。要分清「数组名代表整个数组」和「字符串内容」这两种视角。",
        "混淆 '\\0' 与 '0'：'\\0' 的值是 0，字符 '0' 的 ASCII 码是 48，两者完全不同。",
        "给数组整体赋值：s = \"world\"; 编译不过。只有声明的同时可以写 char s[] = \"world\";。",
        "修改字符串字面量：char *p = \"hi\"; p[0] = 'H'; 是未定义行为，字面量通常放在只读内存里。"
      ],
      takeaways: [
        "字符串 = 以 '\\0' 结尾的字符数组，'\\0' 标记「到此结束」",
        "sizeof 给的是数组占多少字节（容量），strlen 给的是 '\\0' 之前的字符个数",
        "char s[] = \"hello\"; 占 6 个字节；用字符列表初始化时要自己写 '\\0'",
        "逐字符遍历写成 for (i = 0; s[i] != '\\0'; i++)"
      ],
      questions: [
        {
          q: "`char s[] = \"hello\";` 中 sizeof(s) 和 strlen(s) 分别是多少？",
          options: [
            "5 和 5",
            "6 和 5",
            "5 和 6",
            "6 和 6"
          ],
          answer: 1,
          explain: "sizeof 数的是数组占多少字节：字符串字面量 \"hello\" 会额外带一个结尾的 '\\0'，所以是 6；strlen 数的是 '\\0' 之前的字符个数，所以是 5。选项 A 漏掉了结束符；选项 C 把两个概念对调了。"
        },
        {
          q: "下面哪个字符数组**不是**字符串？",
          options: [
            "char s[3] = {'a', 'b', 'c'};",
            "char s[4] = {'a', 'b', 'c', '\\0'};",
            "char s[] = \"abc\";",
            "char s[10] = \"abc\";"
          ],
          answer: 0,
          explain: "字符串的定义是「以 '\\0' 结尾的字符序列」。选项 A 的三个字节里没有 '\\0'，只是一个字符数组，用 %s 打印会一直往后读，属于越界读。选项 B 手动补了结束符；选项 C 由字面量自动补；选项 D 剩下没用到的字节被初始化为 0，同样是合法字符串。"
        },
        {
          q: "`char s[10] = \"hi\";` 之后 strlen(s) 是多少？",
          options: [
            "10",
            "3",
            "2",
            "不确定，因为剩下那些字节是垃圾值"
          ],
          answer: 2,
          explain: "strlen 从 s[0] 开始数，数到第一个 '\\0' 为止：'h'、'i' 后面就是 '\\0'，所以是 2。选项 A 那是 sizeof(s)；选项 D 错在「垃圾值」——只要写了初始化列表，数组里没用到的字节会被自动置 0。"
        }
      ],
      passRatio: 0.8,
      mission: "写一个程序，把一个字符串翻转过来（本关不允许用 strcpy、strcat 之类的库函数，只允许用 strlen 求长度）：\n"
        + "1. 声明 char s[] = \"stressed\";（它的字母顺序正好前后对称，翻转后是 desserts）；\n"
        + "2. 先输出两行：sizeof(s) = 9 和 strlen(s) = 8；\n"
        + "3. 用循环把 s 的字符倒着放进 char reversed[16];，最后自己补上结束符，然后输出 reversed = desserts；\n"
        + "4. 再输出一行 sizeof(reversed) = 16, strlen(reversed) = 8（两个值之间是逗号加空格）；\n"
        + "5. 最后逐行输出翻转后每个字符及其下标，格式为 reversed[0] = d。",
      starter: "#include <stdio.h>\n#include <string.h>\n\n"
        + "int main(void) {\n"
        + "    char s[] = \"stressed\";\n"
        + "    char reversed[16];\n"
        + "    int len = (int)strlen(s);\n"
        + "    int i;\n\n"
        + "    /* TODO 1: 输出 sizeof(s) 与 strlen(s) */\n\n"
        + "    /* TODO 2: 用循环把 s 倒着放进 reversed，并补 '\\0' */\n\n"
        + "    /* TODO 3: 输出 reversed 以及它的 sizeof / strlen */\n\n"
        + "    /* TODO 4: 逐行输出 reversed[0] = d 这样的信息 */\n"
        + "    return 0;\n"
        + "}",
      hint: "翻转的关键是下标对应关系：s 的第 i 个字符应该放到 reversed 的第 len - 1 - i 个位置。先在纸上把 \"stressed\" 和 \"desserts\" 上下对齐写一遍，标出每个字符的下标，再写循环。搬完字符后别忘了 reversed[len] = '\\0';——少了这一句，reversed 就不是字符串了。",
      check: {
        include: ["stdio.h", "string.h"],
        noInclude: ["conio.h"],
        return0: true,
        require: { array: true, loop: true },
        calls: [["printf"], ["strlen"]],
        forbid: ["gets", "strcpy", "strcat"],
        minStatements: 8,
        message: "本关需要：#include <stdio.h> 与 <string.h>、int main(void)、字符数组、循环、在 main 里调用 strlen 并打印结果，最后 return 0;；本关不要用 strcpy/strcat（自己写循环搬字符）。",
        ok: "字符数组、循环、sizeof 与 strlen 的对比都齐了，结构完全正确。"
      },
      solution: "#include <stdio.h>\n"
        + "#include <string.h>\n"
        + "\n"
        + "int main(void) {\n"
        + "    char s[] = \"stressed\";\n"
        + "    char reversed[16];\n"
        + "    int len = (int)strlen(s);\n"
        + "    int i;\n"
        + "\n"
        + "    printf(\"sizeof(s) = %d\\n\", (int)sizeof(s));\n"
        + "    printf(\"strlen(s) = %d\\n\", len);\n"
        + "\n"
        + "    /* 把 s 的第 i 个字符放到 reversed 的第 len - 1 - i 个位置 */\n"
        + "    for (i = 0; i < len; i++) {\n"
        + "        reversed[len - 1 - i] = s[i];\n"
        + "    }\n"
        + "    reversed[len] = '\\0';\n"
        + "\n"
        + "    printf(\"reversed = %s\\n\", reversed);\n"
        + "    printf(\"sizeof(reversed) = %d, strlen(reversed) = %d\\n\",\n"
        + "           (int)sizeof(reversed), (int)strlen(reversed));\n"
        + "\n"
        + "    for (i = 0; i < len; i++) {\n"
        + "        printf(\"reversed[%d] = %c\\n\", i, reversed[i]);\n"
        + "    }\n"
        + "    return 0;\n"
        + "}",
      mastery: [
        "能说清字符数组和字符串的区别，并指出一个数组为什么不是字符串",
        "能区分 sizeof 与 strlen，并预测任意字符数组的这两个值",
        "能手写字符复制、翻转、遍历的循环，并正确补上 '\\0'"
      ]
    },
{
      id: 29,
      title: "string.h 四件套：strlen / strcpy / strcat / strcmp",
      minutes: 20,
      gist: "掌握最常用的四个字符串函数，并记住 strcpy 那条生死线：目标容量 ≥ 内容长度 + 1。",
      lesson: "<string.h> 提供了处理字符串的标准函数，最常用的四个可以先记牢：strlen、strcpy、strcat、strcmp。它们的共同点是都以 '\\0' 为边界——处理到哪里结束，取决于字符串里那个结束符在哪儿，而不是数组有多长。\n"
        + "strlen(s) 返回 '\\0' 之前的字符个数（不含 '\\0'）。strcpy(dst, src) 把 src 连同结尾的 '\\0' 一起复制到 dst。strcat(dst, src) 从 dst 当前的 '\\0' 处开始把 src 接上去，并补上新的 '\\0'。strcmp(a, b) 按字符编码逐字符比较：返回负数表示 a 小于 b，0 表示完全相同，正数表示 a 大于 b——标准只保证符号，不保证具体数值，所以判断时永远写 strcmp(a, b) == 0 或 < 0 / > 0，不要写 == 1。\n"
        + "这里必须重点说清 strcpy 的风险：它完全不检查目标缓冲区有多大，只管一路写下去。如果 dst 装不下 src 的内容（包括结尾那个 '\\0'），多出来的字节就会写到数组外面——这叫缓冲区溢出，轻则破坏别的变量，重则让程序崩溃，也是很多安全漏洞的根源。使用规则只有一条：目标容量必须 ≥ strlen(src) + 1。strcat 同理，要保证 dst 的剩余空间装得下 strlen(src) + 1 个字节。\n"
        + "读别人的 C 代码时，看到 strcpy、strcat 就该本能地问一句：目标够大吗？源字符串的长度有没有可能超出预期？如果答案不确定，就应该换成带长度限制的写法（strncpy、snprintf 等，后面的模块会讲）。\n"
        + "另外几个细节：这几个函数都需要可写的目标数组，char *p; strcpy(p, \"hi\"); 这种写法是灾难——p 没有指向任何有效内存。字符串比较大小时也不能用 ==，那比较的是两个地址，而不是内容。",
      example: {
        code: "#include <stdio.h>\n"
          + "#include <string.h>\n"
          + "\n"
          + "int main(void) {\n"
          + "    char a[32] = \"Hello\";\n"
          + "    char b[32] = \"C\";\n"
          + "    char c[32];\n"
          + "    char small[8];\n"
          + "\n"
          + "    printf(\"strlen(a) = %d\\n\", (int)strlen(a));\n"
          + "    printf(\"sizeof(a) = %d\\n\", (int)sizeof(a));\n"
          + "\n"
          + "    strcpy(c, a);\n"
          + "    printf(\"c after strcpy = %s\\n\", c);\n"
          + "\n"
          + "    strcat(c, \", \");\n"
          + "    strcat(c, b);\n"
          + "    strcat(c, \"!\");\n"
          + "    printf(\"c after strcat = %s\\n\", c);\n"
          + "    printf(\"strlen(c) = %d\\n\", (int)strlen(c));\n"
          + "\n"
          + "    printf(\"strcmp(\\\"abc\\\", \\\"abd\\\") < 0 : %s\\n\", strcmp(\"abc\", \"abd\") < 0 ? \"yes\" : \"no\");\n"
          + "    printf(\"strcmp(\\\"abc\\\", \\\"abc\\\") == 0: %s\\n\", strcmp(\"abc\", \"abc\") == 0 ? \"yes\" : \"no\");\n"
          + "    printf(\"strcmp(\\\"abd\\\", \\\"abc\\\") > 0 : %s\\n\", strcmp(\"abd\", \"abc\") > 0 ? \"yes\" : \"no\");\n"
          + "\n"
          + "    /* small 是 8 字节：\"1234567\" 占 7 个字符 + '\\0' 刚好装满，一个字节都不多 */\n"
          + "    strcpy(small, \"1234567\");\n"
          + "    printf(\"small = %s (strlen %d, room %d)\\n\", small, (int)strlen(small), (int)sizeof(small));\n"
          + "    return 0;\n"
          + "}",
        output: "strlen(a) = 5\n"
          + "sizeof(a) = 32\n"
          + "c after strcpy = Hello\n"
          + "c after strcat = Hello, C!\n"
          + "strlen(c) = 9\n"
          + "strcmp(\"abc\", \"abd\") < 0 : yes\n"
          + "strcmp(\"abc\", \"abc\") == 0: yes\n"
          + "strcmp(\"abd\", \"abc\") > 0 : yes\n"
          + "small = 1234567 (strlen 7, room 8)",
        explain: "第 10 行 strlen(a) 得到 5，第 11 行 sizeof(a) 得到 32：一个是内容长度，一个是数组容量；这一关的所有函数都按前者工作。"
          + "第 13 行 strcpy(c, a) 把 \"Hello\" 连同结尾的 '\\0' 一起复制进 c；第 16 到 18 行连续三次 strcat，每一次都是从上一次的结尾处继续往后接。"
          + "第 22 到 24 行演示 strcmp 的三种结果——只判断返回值的符号，不关心它是 -1 还是别的数。"
          + "第 27 行是这一关的重点：small 是 8 个字节，\"1234567\" 是 7 个字符加 1 个 '\\0'，刚好装满；再多一个字符，strcpy 就会写到数组外面去。"
      },
      pitfalls: [
        "目标缓冲区装不下：strcpy(dst, src) 不做任何长度检查，dst 至少要能放 strlen(src) + 1 个字节，否则就是缓冲区溢出。",
        "以为 strcpy 会检查长度：它只认 '\\0'，不看数组有多大。",
        "strcat 忘了给自己留位置：目标的剩余空间要够 strlen(src) + 1，否则同样溢出。",
        "用 == 比较字符串：比较的是两个地址，结果几乎永远不是你想要的，必须用 strcmp。",
        "假设 strcmp 返回 -1/0/1：标准只保证符号，写成 strcmp(a, b) == 1 是不可靠的。",
        "把 strcpy 的目标写成未初始化的指针：char *p; strcpy(p, \"hi\"); 会往一个随机地址写数据。"
      ],
      takeaways: [
        "strlen 数到 '\\0' 为止且不含 '\\0'；sizeof 算的是数组容量",
        "strcpy 复制、strcat 追加，两者都会自动处理结尾的 '\\0'",
        "strcmp 返回负数 / 0 / 正数，判断时只看符号",
        "strcpy/strcat 的目标必须留够空间：内容长度 + 1"
      ],
      questions: [
        {
          q: "关于 `strcmp(\"abc\", \"abd\")` 的返回值，正确的说法是？",
          options: [
            "返回 1，因为两个字符串不相等",
            "返回 0，因为两个字符串长度相同",
            "返回值一定是 -1",
            "返回一个负数，具体数值由实现决定"
          ],
          answer: 3,
          explain: "strcmp 只保证「小于返回负数、相等返回 0、大于返回正数」这个符号约定。'c' 小于 'd'，所以是负数。选项 A 错：不相等不等于固定返回 1，而且这里比较的是第三个字符；选项 B 错：长度相同不代表内容相同；选项 C 错：不要假设一定是 -1，实际实现常常返回两个字符编码之差。"
        },
        {
          q: "用 `strcpy(dst, src)` 时，最关键的检查是什么？",
          options: [
            "dst 的容量至少要有 strlen(src) + 1 个字节",
            "src 必须比 dst 短",
            "dst 必须是字符串字面量",
            "两个数组必须一样长"
          ],
          answer: 0,
          explain: "strcpy 会连同结尾的 '\\0' 一起复制，而且完全不检查目标大小；dst 装不下就会写到数组外面（缓冲区溢出）。所以规则是「容量 ≥ 内容长度 + 1」。选项 B 少了那个结尾的 '\\0'，长度相等时正好差一个字节；选项 C 错：字面量通常不可写；选项 D 太严：dst 比 src 长完全没问题。"
        },
        {
          q: "`char c[32] = \"Hello\";` 之后执行 `strcat(c, \", C!\");`，c 里是什么？",
          options: [
            "\", C!\"",
            "\"Hello\"",
            "\"Hello, C!\"",
            "编译错误：strcat 不能作用于数组"
          ],
          answer: 2,
          explain: "strcat 从 c 当前的结尾 '\\0' 处开始，把第二个字符串接上去并补上新的 '\\0'。选项 A 是把它当成了 strcpy（覆盖）；选项 B 没看出 strcat 会修改 c；选项 D 错：strcat 的第一个参数必须是可写的字符数组，c 正好是。"
        }
      ],
      passRatio: 0.8,
      mission: "写一个程序：读入两个不含空白的单词（用 scanf(\"%31s\", w) 分别读进 char w[64];，宽度 31 是为了给结尾的 '\\0' 留位置。本机测试用：apple banana），然后\n"
        + "1. 输出 w1 = apple 和 w2 = banana 两行；\n"
        + "2. 用 strcpy 把 w1 备份到 char backup[64];；\n"
        + "3. 用 strcmp 比较两个单词，按结果输出 order: w1 < w2、order: w1 == w2、order: w1 > w2 三者之一；\n"
        + "4. 用 strcat 先给 w1 接一个空格、再接上 w2，输出 joined = apple banana；\n"
        + "5. 输出 len = 12（joined 的长度，用 strlen 求），再输出 first is still apple（用备份证明原来的 w1 没变）。",
      starter: "#include <stdio.h>\n#include <string.h>\n\n"
        + "int main(void) {\n"
        + "    char w1[64];\n"
        + "    char w2[64];\n"
        + "    char backup[64];\n"
        + "    int cmp;\n\n"
        + "    /* TODO 1: 用 scanf(\"%31s\", ...) 读入两个单词 */\n\n"
        + "    /* TODO 2: 输出 w1 与 w2 */\n\n"
        + "    /* TODO 3: strcpy 备份 w1；用 strcmp 判断顺序，输出 order: ... */\n\n"
        + "    /* TODO 4: strcat 拼接后输出 joined 与 len */\n\n"
        + "    /* TODO 5: 输出 first is still ... */\n"
        + "    return 0;\n"
        + "}",
      hint: "strcmp 的返回值不要直接打印，先存进一个 int 变量，再用 if / else if / else 分成三种情况输出。拼接顺序很重要：先接空格、再接第二个单词；如果反过来就变成 applebanana 了。最后一行故意用备份来输出，是为了让你亲眼看到 strcat 确实改掉了 w1。",
      check: {
        include: ["stdio.h", "string.h"],
        noInclude: ["conio.h"],
        return0: true,
        require: { array: true },
        calls: [["scanf", "%31s"], ["strcpy"], ["strcat"], ["strcmp"], ["strlen"], ["printf"]],
        forbid: ["gets"],
        minStatements: 8,
        message: "本关需要：#include <stdio.h> 与 <string.h>、int main(void)、字符数组、在 main 里按规定宽度 scanf、并调用 strcpy / strcat / strcmp / strlen 各至少一次，最后 return 0; 。",
        ok: "四个字符串函数都用上了，安全宽度也没漏，结构完全正确。"
      },
      input: "apple banana\n",
      expectedOutput: "w1 = apple\nw2 = banana\norder: w1 < w2\njoined = apple banana\nlen = 12\nfirst is still apple",
      solution: "#include <stdio.h>\n"
        + "#include <string.h>\n"
        + "\n"
        + "int main(void) {\n"
        + "    char w1[64];\n"
        + "    char w2[64];\n"
        + "    char backup[64];\n"
        + "    int cmp;\n"
        + "\n"
        + "    /* %31s：最多读 31 个字符，留一个字节给结尾的 '\\0' */\n"
        + "    if (scanf(\"%31s\", w1) != 1 || scanf(\"%31s\", w2) != 1) {\n"
        + "        return 1;\n"
        + "    }\n"
        + "\n"
        + "    printf(\"w1 = %s\\n\", w1);\n"
        + "    printf(\"w2 = %s\\n\", w2);\n"
        + "\n"
        + "    strcpy(backup, w1); /* w1 最多 31 个字符，backup 有 64 字节，装得下 */\n"
        + "    cmp = strcmp(w1, w2);\n"
        + "    if (cmp < 0) {\n"
        + "        printf(\"order: w1 < w2\\n\");\n"
        + "    } else if (cmp > 0) {\n"
        + "        printf(\"order: w1 > w2\\n\");\n"
        + "    } else {\n"
        + "        printf(\"order: w1 == w2\\n\");\n"
        + "    }\n"
        + "\n"
        + "    strcat(w1, \" \");\n"
        + "    strcat(w1, w2);\n"
        + "    printf(\"joined = %s\\n\", w1);\n"
        + "    printf(\"len = %d\\n\", (int)strlen(w1));\n"
        + "    printf(\"first is still %s\\n\", backup);\n"
        + "    return 0;\n"
        + "}",
      mastery: [
        "能用 strlen/strcpy/strcat/strcmp 完成长度、复制、拼接与比较",
        "能在写 strcpy/strcat 之前算出目标需要多少字节，判断会不会溢出",
        "知道字符串比较必须用 strcmp，并且只依赖返回值的符号"
      ]
    },
    {
      id: 30,
      title: "查找与分割：strchr / strstr / strtok",
      minutes: 20,
      gist: "在字符串里找字符、找子串、按分隔符切段，并避开 strtok 会改写原串、不可重入这些坑。",
      lesson: "这一关学三个「在字符串里找东西」的函数，它们的返回值都是指针，用法上有一个共同的坑：找不到时返回 NULL。\n"
        + "strchr(s, c) 找字符 c 第一次出现的位置，返回指向那个字符的指针。常见用法是拆「键=值」这种结构：找到 '=' 的位置 eq 之后，eq + 1 就是等号后面的内容，而 eq - s 正好是等号的下标（指针相减得到的是元素个数）。要打印等号前面那一段，可以用 printf 的精度参数：printf(\"%.*s\", (int)(eq - s), s);——星号表示精度由参数给出，这样不用往字符串里临时塞 '\\0' 就能只输出前半段。\n"
        + "strstr(s, sub) 找子串，返回子串第一次出现的位置，同样用 NULL 表示没找到。先判断 NULL 再使用，是这个函数家族铁打的规矩：对空指针解引用会让程序直接崩溃。\n"
        + "strtok(s, delim) 按分隔符切分字符串：第一次传入要切的字符串，之后每次传 NULL 表示「接着上次的位置继续」，每次返回一段的起始指针，切完返回 NULL。典型循环是：tok = strtok(buf, \",\"); while (tok != NULL) { 处理 tok; tok = strtok(NULL, \",\"); }。\n"
        + "strtok 有几个必须知道的坑。第一，它是「就地」切分——把找到的分隔符改写成 '\\0'，所以原始字符串会被破坏，切完之后再看 buf 只剩第一段。第二，正因为会改写，绝不能把字符串字面量交给它：char *p = \"a,b\"; strtok(p, \",\"); 会去写只读内存，程序可能当场崩溃，必须传可修改的字符数组（char buf[] = \"a,b\";）。第三，它内部用静态变量记住进度，所以不可重入：两个 strtok 循环嵌套着用会互相打乱。第四，连续的分隔符会被当成一个，中间的空字段会被直接跳过——处理「有空字段的数据」时要特别小心。",
      example: {
        code: "#include <stdio.h>\n"
          + "#include <string.h>\n"
          + "\n"
          + "int main(void) {\n"
          + "    const char *text = \"user@example.com\";\n"
          + "    char line[] = \"apple,banana,,cherry\"; /* 必须是可修改的字符数组 */\n"
          + "    char *at;\n"
          + "    char *sub;\n"
          + "    char *tok;\n"
          + "    int n = 0;\n"
          + "\n"
          + "    at = strchr(text, '@');\n"
          + "    if (at != NULL) {\n"
          + "        printf(\"user = %.*s\\n\", (int)(at - text), text);\n"
          + "        printf(\"domain = %s\\n\", at + 1);\n"
          + "    }\n"
          + "\n"
          + "    sub = strstr(text, \"example\");\n"
          + "    printf(\"found \\\"example\\\" at index %d\\n\", (int)(sub - text));\n"
          + "    printf(\"missing: %s\\n\", strstr(text, \"xyz\") == NULL ? \"not found\" : \"found\");\n"
          + "\n"
          + "    printf(\"tokens of \\\"%s\\\":\\n\", line);\n"
          + "    tok = strtok(line, \",\");\n"
          + "    while (tok != NULL) {\n"
          + "        n++;\n"
          + "        printf(\"  %d: %s\\n\", n, tok);\n"
          + "        tok = strtok(NULL, \",\");\n"
          + "    }\n"
          + "    printf(\"count = %d\\n\", n);\n"
          + "    printf(\"line after strtok = \\\"%s\\\"\\n\", line);\n"
          + "    return 0;\n"
          + "}",
        output: "user = user\n"
          + "domain = example.com\n"
          + "found \"example\" at index 5\n"
          + "missing: not found\n"
          + "tokens of \"apple,banana,,cherry\":\n"
          + "  1: apple\n"
          + "  2: banana\n"
          + "  3: cherry\n"
          + "count = 3\n"
          + "line after strtok = \"apple\"",
        explain: "第 12 行 strchr(text, '@') 找到 '@' 的位置；第 14 行用 %.*s 只打印前 (int)(at - text) 个字符——星号表示精度由参数给出，这样不改动原字符串也能只输出前半段。第 15 行的 at + 1 正好是 '@' 后面的全部内容。"
          + "第 18 行 strstr 找到 \"example\" 并返回它的位置，两个指针相减就得到下标 5；第 20 行演示找不到子串时返回 NULL。"
          + "第 23 行开始用 strtok：第一次传入字符数组 line 和分隔符 \",\"，之后第 27 行每次都传 NULL。结果里 count 是 3 而不是 4——因为 \"apple,banana,,cherry\" 中间有两个连续逗号，中间那一段是空的，被跳过了。"
          + "最后一行打印 line，只剩 \"apple\"：strtok 把遇到的分隔符都改写成了 '\\0'，原字符串确实被破坏了。"
      },
      pitfalls: [
        "对字符串字面量用 strtok：char *p = \"a,b\"; strtok(p, \",\"); 会去改只读内存，程序可能当场崩溃。必须传可修改的字符数组。",
        "strtok 之后还想用原字符串：分隔符已经被改写成 '\\0'，原串只剩第一段；需要原内容就提前备份一份。",
        "第二次调用又传了一遍原字符串：那样每次都从头开始，永远只能拿到第一段；正确做法是传 NULL。",
        "不判断 NULL 就直接使用 strchr/strstr 的返回值：找不到时它们返回 NULL，解引用会崩溃。",
        "两个 strtok 循环嵌套：它内部用静态变量记录进度，嵌套会互相打乱；需要同时切分两处时要用 strtok_r 或自己写切分。",
        "指望 strtok 保留空字段：连续的分隔符会被当成一个，\"a,,b\" 只会切出两段。"
      ],
      takeaways: [
        "strchr 找字符、strstr 找子串，找不到都返回 NULL，使用前先判断",
        "指针相减得到下标；at + 1 可以直接当作后半段字符串使用",
        "strtok 第一次传字符串、之后传 NULL，逐段返回，切完返回 NULL",
        "strtok 会就地改写原字符串且不可重入，连续分隔符之间的空字段会被跳过"
      ],
      questions: [
        {
          q: "对 `char *p = \"a,b,c\";` 调用 `strtok(p, \",\")` 会怎样？",
          options: [
            "正常得到 \"a\"、\"b\"、\"c\" 三段",
            "正常得到一整段 \"a,b,c\"",
            "不安全：strtok 会改写字符串，而字面量不可修改，属于未定义行为",
            "安全地返回 NULL，什么也不做"
          ],
          answer: 2,
          explain: "strtok 的切分办法是就地分隔符改写成 '\\0'，所以它要求传入**可修改**的字符数组，比如 char buf[] = \"a,b,c\";。往字符串字面量里写是未定义行为，程序可能直接崩溃。选项 A、B 都忽略了「会改写」这一点；选项 D 也不对：它不会好心返回 NULL，而是真的去写那块内存。"
        },
        {
          q: "用 strtok 切分时，第二次及以后的调用应该传什么？",
          options: [
            "每次都把原字符串再传一遍",
            "传上一次返回的那个指针",
            "传一个空字符串 \"\"",
            "传 NULL"
          ],
          answer: 3,
          explain: "strtok 用一个内部静态变量记住切到哪儿了：第一次传入字符串本身，之后每次都传 NULL 表示「接着上次继续」。选项 A 会从头重来，永远只能拿到第一段；选项 B 只是那一段的地址，不等于延续切分；选项 C 会被当成一个空字符串去切。"
        },
        {
          q: "strstr(s, sub) 找不到子串时返回什么？",
          options: [
            "NULL",
            "指向字符串末尾的指针",
            "空字符串 \"\"",
            "-1"
          ],
          answer: 0,
          explain: "strchr 和 strstr 都用 NULL 表示「没找到」，所以标准写法是先判断 if (p != NULL) 再使用 p，否则对空指针解引用会崩溃。选项 B 没有这种约定，末尾指针也不能当成「找到了」；选项 C 错在函数返回的是 char *，不是字符串内容；选项 D 是 strcmp 那类返回整数的函数的风格，指针函数不用它。"
        }
      ],
      passRatio: 0.8,
      mission: "写一个程序，把 char line[] = \"name=alice;age=30;city=paris\"; 当成一行配置文本来处理（必须是可修改的字符数组，不能写成 char *line = ...）：\n"
        + "1. 用 strchr 找到第一个 '='，输出 first key = name（等号之前的那一段，可以用 %.*s 按长度打印）；\n"
        + "2. 用 strstr 判断这一行里有没有 \"age=\"，输出 has age: yes 或 has age: no；\n"
        + "3. 用 strtok 以 ';' 为分隔符逐段输出，每段一行，格式为 field: name=alice，并统计段数；\n"
        + "4. 最后输出 fields = 3。\n"
        + "注意顺序：第 3 步会破坏 line，所以第 1、2 步必须在它之前完成。",
      starter: "#include <stdio.h>\n#include <string.h>\n\n"
        + "int main(void) {\n"
        + "    char line[] = \"name=alice;age=30;city=paris\";\n"
        + "    char *eq;\n"
        + "    char *tok;\n"
        + "    int n = 0;\n\n"
        + "    /* TODO 1: strchr 找第一个 '='，输出 first key = ... */\n\n"
        + "    /* TODO 2: strstr 判断是否含 \"age=\"，输出 has age: yes/no */\n\n"
        + "    /* TODO 3: strtok 逐段输出 field: ...，并统计段数 */\n\n"
        + "    printf(\"fields = %d\\n\", n);\n"
        + "    return 0;\n"
        + "}",
      hint: "打印等号左边那一段，用 printf(\"first key = %.*s\\n\", (int)(eq - line), line);——%.*s 的星号表示「精度由参数给出」，正好只打印前若干个字符，不用改动原字符串。段数用一个 int 计数器，每拿到一段就加一，循环条件是 tok != NULL。",
      check: {
        include: ["stdio.h", "string.h"],
        noInclude: ["conio.h"],
        return0: true,
        require: { array: true, loop: true },
        calls: [["strchr"], ["strstr"], ["strtok"], ["printf"]],
        forbid: ["gets"],
        minStatements: 6,
        message: "本关需要：#include <stdio.h> 与 <string.h>、int main(void)、一个可修改的字符数组、while 循环、在 main 里调用 strchr / strstr / strtok，最后 return 0; 。",
        ok: "三个查找与分割函数都用上了，结构完全正确。"
      },
      expectedOutput: "first key = name\nhas age: yes\nfield: name=alice\nfield: age=30\nfield: city=paris\nfields = 3",
      solution: "#include <stdio.h>\n"
        + "#include <string.h>\n"
        + "\n"
        + "int main(void) {\n"
        + "    char line[] = \"name=alice;age=30;city=paris\";\n"
        + "    char *eq;\n"
        + "    char *tok;\n"
        + "    int n = 0;\n"
        + "\n"
        + "    eq = strchr(line, '=');\n"
        + "    if (eq != NULL) {\n"
        + "        printf(\"first key = %.*s\\n\", (int)(eq - line), line);\n"
        + "    } else {\n"
        + "        printf(\"no '=' found\\n\");\n"
        + "    }\n"
        + "\n"
        + "    printf(\"has age: %s\\n\", strstr(line, \"age=\") != NULL ? \"yes\" : \"no\");\n"
        + "\n"
        + "    tok = strtok(line, \";\");\n"
        + "    while (tok != NULL) {\n"
        + "        printf(\"field: %s\\n\", tok);\n"
        + "        n++;\n"
        + "        tok = strtok(NULL, \";\");\n"
        + "    }\n"
        + "    printf(\"fields = %d\\n\", n);\n"
        + "    return 0;\n"
        + "}",
      mastery: [
        "能用 strchr/strstr 定位字符或子串，并用指针相减得到下标",
        "能用「第一次传字符串、之后传 NULL」的模式写出 strtok 循环",
        "能说出 strtok 会改写原串、不可重入这两个风险，并知道什么时候该换做法"
      ]
    },
{
      id: 31,
      title: "安全输入：fgets、缓冲区与越界",
      minutes: 22,
      gist: "用 fgets 安全读入一行，处理结尾换行与截断，搞懂缓冲区越界和 '\\0' 丢失是怎么回事。",
      lesson: "输入是 C 程序最容易出错的地方，因为这里有两件事同时发生：数据从外部进来，长度却不由你决定。\n"
        + "先说 scanf(\"%s\", buf)：它读到空白（空格、制表符、换行）就停，看起来方便，但它完全不知道 buf 有多大——输入比缓冲区长的部分会一直写下去，把后面的内存踩坏。要安全就得加宽度：scanf(\"%7s\", buf) 表示最多读 7 个字符。宽度必须比缓冲区小 1，因为还要给结尾的 '\\0' 留一个字节：char buf[8] 配 %7s。\n"
        + "更常用的安全读入是 fgets(buf, size, stdin)：它最多读 size - 1 个字符，读完一定在末尾补 '\\0'，所以永远不会写越界；读到文件结尾或出错时返回 NULL，因此标准写法是 if (fgets(buf, sizeof(buf), stdin) == NULL) { 处理结束 }。它和 scanf(\"%s\") 有两个行为差异：换行符会被读进缓冲区，以及它不会跳过开头的空白。想让字符串干净，就自己判断并去掉行尾的换行：len = strlen(buf); if (len > 0 && buf[len - 1] == '\\n') buf[len - 1] = '\\0';。\n"
        + "scanf 和 fgets 混用是新手最常踩的坑：scanf(\"%s\") 只吃掉了那个单词，这一行的换行符还留在输入缓冲区里。紧接着调用 fgets，它立刻读到那个换行就返回了——你会得到一个「空行」。解决办法是要么统一用 fgets 读整行再自己解析，要么在读之前把残留的字符读掉。\n"
        + "还有一种情况必须处理：一行比缓冲区长。这时 fgets 只读走前 size - 1 个字符，结尾没有 '\\n'，而剩下的字符还留在输入缓冲区里，会被下一次读入当成新的一行。所以「读完结尾没有 '\\n'」正是判断截断的信号；发现截断后要把这一行剩下的字符读干净：while ((ch = getchar()) != '\\n' && ch != EOF) { }。\n"
        + "最后是越界和「'\\0' 被吃掉」：数组下标只能到「长度 - 1」；当目标缓冲区装不下一个字符串（包括结尾的 '\\0'）时，那个 '\\0' 会被写到数组外面——数组里就没有结束符了，之后任何按字符串处理它的函数都会一路读下去，直到撞上一个碰巧为 0 的字节。所以做任何字符串操作之前，先确认一件事：目标空间 ≥ 内容长度 + 1。",
      example: {
        code: "#include <stdio.h>\n"
          + "#include <string.h>\n"
          + "\n"
          + "int main(void) {\n"
          + "    char word[16];\n"
          + "    char line[12];\n"
          + "    size_t len;\n"
          + "\n"
          + "    /* 1) 受控的 scanf：%15s 最多读 15 个字符，留一个字节给 '\\0' */\n"
          + "    printf(\"read a word with scanf: \");\n"
          + "    if (scanf(\"%15s\", word) != 1) {\n"
          + "        return 1;\n"
          + "    }\n"
          + "    printf(\"%s\\n\", word);\n"
          + "\n"
          + "    /* 2) scanf 只吃掉了那个单词，这一行的换行符还留在输入缓冲区里 */\n"
          + "    if (fgets(line, sizeof(line), stdin) == NULL) {\n"
          + "        return 1;\n"
          + "    }\n"
          + "    printf(\"fgets right after scanf got %d chars\\n\", (int)strlen(line));\n"
          + "\n"
          + "    /* 3) 正常读一行，并去掉行尾的换行符 */\n"
          + "    if (fgets(line, sizeof(line), stdin) == NULL) {\n"
          + "        return 1;\n"
          + "    }\n"
          + "    len = strlen(line);\n"
          + "    if (len > 0 && line[len - 1] == '\\n') {\n"
          + "        line[len - 1] = '\\0';\n"
          + "    }\n"
          + "    printf(\"line = %s (len %d, room %d)\\n\", line, (int)strlen(line), (int)sizeof(line));\n"
          + "\n"
          + "    /* 4) 这一行比缓冲区长：只读进 11 个字符，结尾没有 '\\n'，剩下的还在缓冲区里 */\n"
          + "    if (fgets(line, sizeof(line), stdin) == NULL) {\n"
          + "        return 1;\n"
          + "    }\n"
          + "    len = strlen(line);\n"
          + "    if (len > 0 && line[len - 1] == '\\n') {\n"
          + "        line[len - 1] = '\\0';\n"
          + "    }\n"
          + "    printf(\"long line part 1 = %s (len %d)\\n\", line, (int)strlen(line));\n"
          + "\n"
          + "    if (fgets(line, sizeof(line), stdin) == NULL) {\n"
          + "        return 1;\n"
          + "    }\n"
          + "    len = strlen(line);\n"
          + "    if (len > 0 && line[len - 1] == '\\n') {\n"
          + "        line[len - 1] = '\\0';\n"
          + "    }\n"
          + "    printf(\"long line part 2 = %s (len %d)\\n\", line, (int)strlen(line));\n"
          + "    return 0;\n"
          + "}",
        output: "read a word with scanf: hi\n"
          + "fgets right after scanf got 7 chars\n"
          + "line = cat (len 3, room 12)\n"
          + "long line part 1 = 0123456789A (len 11)\n"
          + "long line part 2 = BCDEF (len 5)",
        input: "hi there\ncat\n0123456789ABCDEF\n",
        explain: "第 11 行的 scanf(\"%15s\", word) 是「受控的 scanf」：宽度 15 表示最多读 15 个字符，给 word[16] 留出一个字节放 '\\0'。"
          + "第 17 行的 fgets 紧跟在 scanf 后面，它读到的并不是下一行，而是刚才那一行剩下的 \" there\\n\"，所以第 20 行打印出来是 7 个字符——这就是 scanf 与 fgets 混用最经典的坑。"
          + "第 23 行才开始读真正的下一行 \"cat\\n\"，第 27、28 行去掉换行后得到 cat，长度 3，缓冲区容量是 12。"
          + "第 33 行这次读到的行比 12 字节的缓冲区更长：fgets 只读走 11 个字符 0123456789A，结尾没有 '\\n'（所以第 37 行的判断不成立），剩下的 BCDEF 连同换行还留在输入缓冲区里，于是第 42 行的 fgets 把它当成新的一行读了进来——这就是「截断」的真实样子。"
      },
      pitfalls: [
        "scanf(\"%s\") 不限制长度：输入比缓冲区长就会写越界。一定要写宽度，且宽度 = 缓冲区大小 - 1。",
        "fgets 之后忘了处理 '\\n'：字符串结尾带着换行，比较、拼接、统计都会受影响。",
        "scanf 和 fgets 混用：scanf 留下的换行会被下一次 fgets 立刻读到，得到一个「空行」。",
        "行太长被截断后不清理：剩下的字符留在输入缓冲区里，会被后续读入当成新的一行；判断依据就是「结尾没有 '\\n'」。",
        "'\\0' 被挤掉：目标缓冲区装不下整个字符串（含结尾的 '\\0'）时，结束符会被写到数组外面，数组里就没有结束标记，之后按字符串处理会一路越界读下去。",
        "用 gets 读一行：gets 在 C11 中已从标准里删除，任何情况下都不要用，统一用 fgets。"
      ],
      takeaways: [
        "受控的 scanf 必须写宽度：%15s 配 char buf[16]",
        "fgets(buf, size, stdin) 最多读 size-1 个字符且一定补 '\\0'，不会溢出",
        "fgets 会把换行读进来，需要时自己去掉",
        "读到结尾没有 '\\n' 说明被截断了，要把这一行剩下的字符读干净"
      ],
      questions: [
        {
          q: "`char buf[8];` 要安全地读入一个不含空白的单词，下面哪种写法最合适？",
          options: [
            "scanf(\"%s\", buf);",
            "scanf(\"%7s\", buf);",
            "scanf(\"%8s\", buf);",
            "gets(buf);"
          ],
          answer: 1,
          explain: "scanf 里的宽度表示「最多读多少个字符」，必须比缓冲区小 1，留一个字节给结尾的 '\\0'，所以 8 字节的数组写 %7s。选项 A 完全不限长度，输入一长就溢出；选项 C 的 8 会让「8 个字符 + 一个 '\\0'」正好需要 9 字节，仍然越界；选项 D 的 gets 在 C11 里已经被删除，任何情况下都不要用。"
        },
        {
          q: "用 `fgets(buf, sizeof(buf), stdin)` 读入一行 `hello` 后，buf 里是什么？",
          options: [
            "\"hello\"",
            "\"hello\" 后面跟着未初始化的垃圾字节",
            "\"hello\\n\" —— 换行符也被读进来了",
            "只有 \"h\"，因为 fgets 一次读一个字符"
          ],
          answer: 2,
          explain: "fgets 读到换行就停，但会把换行**存进**缓冲区，然后再补 '\\0'。所以想得到干净的字符串，要自己判断并去掉结尾的 '\\n'。选项 A 是 scanf(\"%s\") 的行为，它把换行留在了输入缓冲区里；选项 B 错：fgets 一定会在读到的内容后面补 '\\0'；选项 D 说的是 getchar。"
        },
        {
          q: "fgets 读完之后，怎么判断这一行是不是因为太长被截断了？",
          options: [
            "检查返回值是不是 NULL",
            "检查 strlen(buf) 是不是等于 0",
            "检查 buf 里有没有空格",
            "检查读完的字符串结尾有没有 '\\n'"
          ],
          answer: 3,
          explain: "只要这一行完整读完了（缓冲区装得下），结尾一定带着 '\\n'；没读到 '\\n' 就说明缓冲区在读完整行之前就满了，剩下的字符还留在输入缓冲区里，要自己读掉。选项 A 错：返回 NULL 表示读到文件结尾或出错，和截断是两回事；选项 B、C 与长度无关。"
        }
      ],
      passRatio: 0.8,
      mission: "写一个程序：安全地读入一行文本并处理（本关不要用 scanf，也不要用 gets）：\n"
        + "1. 用 char buf[32]; 和 fgets(buf, sizeof(buf), stdin) 读入一行；如果返回 NULL（读不到内容）就输出 nothing to read 并结束；\n"
        + "2. 如果读到的字符串结尾是 '\\n'，把它改成 '\\0' 去掉；\n"
        + "3. 如果结尾没有 '\\n'（说明这一行比缓冲区长，被截断了），先输出 [truncated]，再用 while 循环把这一行剩下的字符读掉（读到 '\\n' 或 EOF 为止）；\n"
        + "4. 输出 text: <处理后的内容> 和 length: <长度>（长度用 strlen 求）。\n"
        + "本机测试时先用一行短文本跑一遍，再用一行超过 31 个字符的长文本跑一遍，对比两次输出的差别。",
      starter: "#include <stdio.h>\n#include <string.h>\n\n"
        + "int main(void) {\n"
        + "    char buf[32];\n"
        + "    int ch;\n"
        + "    size_t len;\n\n"
        + "    /* TODO 1: 用 fgets 读入一行，注意判断返回值 */\n\n"
        + "    /* TODO 2: 结尾是 '\\n' 就去掉；不是的话先输出 [truncated]，再清掉这一行剩下的字符 */\n\n"
        + "    /* TODO 3: 输出 text: ... 与 length: ... */\n"
        + "    return 0;\n"
        + "}",
      hint: "去掉换行的标准写法是：先 len = strlen(buf);，再判断 if (len > 0 && buf[len - 1] == '\\n')，成立就把那个位置改成 '\\0'。清理剩余字符用一个 while 循环配合 getchar()，读到 '\\n' 或者 EOF 就停——EOF 这个条件不能省，否则在文件结尾可能死循环。",
      check: {
        include: ["stdio.h", "string.h"],
        noInclude: ["conio.h"],
        return0: true,
        require: { array: true, while: true },
        calls: [["fgets"], ["printf"], ["getchar"], ["strlen"]],
        forbid: ["gets", "scanf"],
        minStatements: 8,
        message: "本关需要：#include <stdio.h> 与 <string.h>、int main(void)、char buf[32] 这样的数组、while 循环、在 main 里调用 fgets / strlen / getchar 并打印结果，最后 return 0;；本关不要使用 scanf 或 gets。",
        ok: "fgets、换行处理、截断清理都齐全，结构完全正确。"
      },
      input: "0123456789012345678901234567890123456789\n",
      solution: "#include <stdio.h>\n"
        + "#include <string.h>\n"
        + "\n"
        + "int main(void) {\n"
        + "    char buf[32];\n"
        + "    int ch;\n"
        + "    size_t len;\n"
        + "\n"
        + "    if (fgets(buf, sizeof(buf), stdin) == NULL) {\n"
        + "        printf(\"nothing to read\\n\");\n"
        + "        return 1;\n"
        + "    }\n"
        + "\n"
        + "    len = strlen(buf);\n"
        + "    if (len > 0 && buf[len - 1] == '\\n') {\n"
        + "        buf[len - 1] = '\\0'; /* 整行读完了，去掉行尾换行 */\n"
        + "    } else {\n"
        + "        /* 没读到换行，说明这一行比缓冲区长，被截断了 */\n"
        + "        printf(\"[truncated]\\n\");\n"
        + "        while ((ch = getchar()) != '\\n' && ch != EOF) {\n"
        + "            /* 丢掉这一行剩下的字符，别让它们影响下一次读入 */\n"
        + "        }\n"
        + "    }\n"
        + "\n"
        + "    printf(\"text: %s\\n\", buf);\n"
        + "    printf(\"length: %d\\n\", (int)strlen(buf));\n"
        + "    return 0;\n"
        + "}",
      mastery: [
        "能用 fgets 安全读入一行，并正确处理返回值与结尾换行",
        "能判断一行是否被截断，并把多余的字符读干净",
        "能说出 scanf(\"%s\") 的危险，并改成带宽度的写法"
      ]
    },
    {
      id: 32,
      title: "综合实战：单词统计",
      minutes: 25,
      gist: "读入一行，统计单词个数并找出最长单词——把 fgets、循环、数组与字符判断组合成一个完整程序。",
      lesson: "这一关把前面学的东西全用起来：读入一行、跳过空白、切出单词、统计个数，再找出最长的那个。它的价值不在难度，而在于「一行文本」这类输入在真实程序里到处都是。\n"
        + "整体思路是一次线性扫描：从行首往行尾走，遇到非空白字符说明进入了一个单词，遇到空白说明当前单词结束了。具体有两种同样常见的写法。示例用的是「记下标」：先跳过空白，记下单词的起点，再一直走到这个单词的末尾，两个下标一减就是它的长度；处理完继续往后找下一个。另一种是「用一个状态变量 in_word 记住我现在是不是在单词里面」：进入单词时置 1，结算完一个单词后清 0，这样连续多个空格、开头和结尾的空格都会被自然跳过，只有在「从不在单词里」变成「在单词里」的那一刻才开始计数，一个单词只算一次。本关的标准答案和起始代码用的是后一种，两种都值得会写。\n"
        + "最容易漏的是收尾：如果这一行以单词结尾、后面没有空白，最后一个单词就不会被任何空白「触发」结算。用状态标记的写法，必须在循环结束后再判断一次 in_word；示例那种「记下标」的写法因为在每个单词末尾就地结算，天然覆盖了这种情况。无论用哪种，要点都一样：末尾那个单词不能漏——漏掉它，「hello world」这种输入就会少算一个单词。\n"
        + "保存最长单词需要两份存储：一个 cur 攒当前单词，一个 longest 存目前找到的最长单词。比较用严格大于 if (w > longest_len)：只有更长的才顶替，长度相同时保留最先出现的那个，正好符合要求。如果把 > 写成 >=，长度相同时后面的会覆盖前面的，结果就反了。\n"
        + "边界处理不能忘：把字符搬进 cur 之前要检查下标没有超过缓冲区容量（w < sizeof(cur) - 1），否则一个超长的「单词」就能把数组写穿。这也是这一模块反复强调的那条规则：写进数组之前，先确认装得下。\n"
        + "另外两个小点：判断空白用 ' ' 和 '\\t' 就够了；标准库 <ctype.h> 里的 isspace 更全面（还包括 '\\n'、'\\r' 等），但用它要注意把参数转成 unsigned char，细节以后遇到再讲。整段扫描每个字符只看一次，时间复杂度是 O(n)，不需要为了找最长单词反复扫描整行。",
      example: {
        code: "#include <stdio.h>\n"
          + "#include <string.h>\n"
          + "\n"
          + "/* 判断一个字符是不是空白（空格或制表符） */\n"
          + "static int is_space(char c) {\n"
          + "    return c == ' ' || c == '\\t';\n"
          + "}\n"
          + "\n"
          + "int main(void) {\n"
          + "    char line[256];\n"
          + "    char word[64];\n"
          + "    char longest[64];\n"
          + "    int count = 0;\n"
          + "    int i = 0;\n"
          + "    int longest_len = 0;\n"
          + "    size_t len;\n"
          + "\n"
          + "    if (fgets(line, sizeof(line), stdin) == NULL) {\n"
          + "        return 1;\n"
          + "    }\n"
          + "    len = strlen(line);\n"
          + "    if (len > 0 && line[len - 1] == '\\n') {\n"
          + "        line[len - 1] = '\\0';\n"
          + "    }\n"
          + "    printf(\"input: %s\\n\", line);\n"
          + "\n"
          + "    while (line[i] != '\\0') {\n"
          + "        int start;\n"
          + "        int w;\n"
          + "        int k;\n"
          + "\n"
          + "        while (line[i] != '\\0' && is_space(line[i])) {\n"
          + "            i++; /* 跳过单词之间的空白 */\n"
          + "        }\n"
          + "        if (line[i] == '\\0') {\n"
          + "            break;\n"
          + "        }\n"
          + "\n"
          + "        start = i;\n"
          + "        while (line[i] != '\\0' && !is_space(line[i])) {\n"
          + "            i++; /* 走到这个单词的末尾 */\n"
          + "        }\n"
          + "        w = i - start; /* 这个单词的真实长度 */\n"
          + "        if (w > (int)sizeof(word) - 1) {\n"
          + "            w = (int)sizeof(word) - 1; /* 装不下就截断，保证不会越界 */\n"
          + "        }\n"
          + "        for (k = 0; k < w; k++) {\n"
          + "            word[k] = line[start + k];\n"
          + "        }\n"
          + "        word[w] = '\\0';\n"
          + "\n"
          + "        count++;\n"
          + "        printf(\"word %d: %s (len %d)\\n\", count, word, (int)strlen(word));\n"
          + "\n"
          + "        if ((int)strlen(word) > longest_len) {\n"
          + "            longest_len = (int)strlen(word);\n"
          + "            strcpy(longest, word); /* word 和 longest 都是 64 字节，安全 */\n"
          + "        }\n"
          + "    }\n"
          + "\n"
          + "    printf(\"words = %d\\n\", count);\n"
          + "    if (count > 0) {\n"
          + "        printf(\"longest = %s (len %d)\\n\", longest, longest_len);\n"
          + "    }\n"
          + "    return 0;\n"
          + "}",
        output: "input:   the quick   brown fox jumps \n"
          + "word 1: the (len 3)\n"
          + "word 2: quick (len 5)\n"
          + "word 3: brown (len 5)\n"
          + "word 4: fox (len 3)\n"
          + "word 5: jumps (len 5)\n"
          + "words = 5\n"
          + "longest = quick (len 5)",
        input: "  the quick   brown fox jumps \n",
        explain: "第 18 行 fgets 读入整行，第 22、23 行去掉结尾的换行——'\\n' 本身也算空白，不去掉通常不影响计数，但去掉之后这一行更「干净」。"
          + "第 27 行开始的 while 是主循环：第 32 行先跳过单词之间的空白，如果已经走到行尾就在第 35 行结束；否则第 39 行记下单词起点 start，第 40 行一直走到这个单词的末尾，此时 i - start（第 43 行）就是这个单词的长度。"
          + "第 44 到 46 行做边界保护：单词比 word 数组还长时截断到 sizeof(word) - 1 个字符，保证不会写越界。"
          + "第 55 行用严格大于比较，所以长度相同时保留先出现的那个——示例里 quick、brown、jumps 都是 5 个字母，最后留下的是最先出现的 quick。"
      },
      pitfalls: [
        "最后一个单词被漏掉：如果这一行以单词结尾、后面没有空白，「遇到空白才结算」的写法就会少算一个；循环结束后要再判断一次。",
        "把连续空格算成多个单词：必须用「从空白进入非空白才计数」的方式，否则 \"a  b\" 会被数成三个。",
        "往数组里搬字符时不检查边界：一个超长的「单词」能直接把数组写穿。",
        "更新最长单词时用了 >=：长度相同时后面的单词会顶掉先出现的，和「保留最先出现」的要求相反。",
        "空行没有单独处理：一个单词都没有时，不能去访问还没赋过值的最长单词数组。"
      ],
      takeaways: [
        "统计单词用「一次扫描 + in_word 状态」：进入单词时置位，结算后清零",
        "循环结束后要再结算一次，否则会漏掉末尾的单词",
        "保存最长单词用严格大于比较，长度相同时保留先出现的",
        "往数组里写字符之前先检查下标，容量不够就截断"
      ],
      questions: [
        {
          q: "统计一行里的单词数时，`in_word` 这个标记的作用是？",
          options: [
            "记住当前是否正处在一个单词内部，避免同一个单词被重复计数",
            "记录已经数了多少个单词",
            "记录目前找到的最长单词",
            "判断这一行有没有读完"
          ],
          answer: 0,
          explain: "扫描到非空白时把 in_word 置 1 并开始攒字符；再遇到空白时，只有 in_word 为 1 才「结算」一个单词，然后把它清 0。这样连续的多个空格就不会被当成多个单词。选项 B 那是 count 变量的职责；选项 C 是 longest；选项 D 由循环条件 line[i] != '\\0' 负责。"
        },
        {
          q: "输入行以最后一个单词结尾、后面没有空白时，容易漏掉什么？",
          options: [
            "什么都不会漏，循环会自动处理",
            "循环结束后还要再结算一次当前单词",
            "必须先把这一行末尾补一个空格",
            "必须改用 strtok 才能统计"
          ],
          answer: 1,
          explain: "在「遇到空白才结算」的写法里，最后一个单词后面没有空白来触发结算，所以循环结束后要判断 in_word 是否仍为 1，是就再结算一次。选项 A 太乐观；选项 C 能绕过去但不通用（缓冲区可能已经满了，补不进去）；选项 D 是另一种做法，不是必须。"
        },
        {
          q: "要在长度相同时保留**最先出现**的最长单词，比较应该怎么写？",
          options: [
            "if (len >= longest_len)",
            "if (len != longest_len)",
            "if (len == longest_len)",
            "if (len > longest_len)"
          ],
          answer: 3,
          explain: "用严格大于，只有更长的才顶替，长度相等时原来的（也就是先出现的）保持不变。选项 A 用了 >=，长度相等时后面的会覆盖先出现的，与要求相反；选项 B 在长度不同时才更新，可能把短单词当成最长；选项 C 只在相等时更新，反而会一直换掉最长的那个。"
        }
      ],
      passRatio: 0.8,
      mission: "写一个程序：读入一行文本（用 char line[256]; 和 fgets 读入），统计这一行里有多少个单词，并找出最长的单词。单词的定义是「由空格或制表符分隔开的连续非空白字符」；长度相同时保留最先出现的那个。\n"
        + "输出格式必须逐字一致：\n"
        + "1. 按出现顺序，每个单词输出一行：word 1: <单词>（编号从 1 开始，冒号后面有一个空格）；\n"
        + "2. 然后输出一行 words = <单词个数>；\n"
        + "3. 最后输出一行 longest = <最长单词> (len <长度>)——括号和中间的 len 都要有；\n"
        + "4. 如果这一行里一个单词都没有（空行），最后一行输出 longest = (none)。\n"
        + "本机测试请运行程序后输入这一行（含回车）：the quick brown fox jumps over the lazy dog\n"
        + "输出应当与「运行结果比对」里的内容逐行一致（提示：可以用 strlen 求长度、用 strcpy 保存最长单词）。",
      starter: "#include <stdio.h>\n#include <string.h>\n\n"
        + "/* TODO 1: 写一个判断空白字符的小函数（空格或制表符） */\n\n"
        + "int main(void) {\n"
        + "    char line[256];\n"
        + "    char cur[64];\n"
        + "    char longest[64];\n"
        + "    int count = 0;\n"
        + "    int w = 0;\n"
        + "    int in_word = 0;\n"
        + "    int longest_len = 0;\n"
        + "    int i;\n\n"
        + "    /* TODO 2: fgets 读入一行，去掉结尾换行 */\n\n"
        + "    /* TODO 3: 一次扫描：遇到非空白开始攒单词，遇到空白结算一个单词 */\n\n"
        + "    /* TODO 4: 循环结束后别忘了结算最后一个单词 */\n\n"
        + "    /* TODO 5: 按格式输出 word N / words / longest */\n"
        + "    return 0;\n"
        + "}",
      hint: "把「结算一个单词」的四件事写在一起：给 cur 补 '\\0'、count 加一、打印 word N: xx、用严格大于更新 longest。这样无论在哪里结算，逻辑都不会漏。另外记得：把字符搬进 cur 之前先判断 w < sizeof(cur) - 1，保证不会越界。",
      check: {
        include: ["stdio.h", "string.h"],
        noInclude: ["conio.h"],
        return0: true,
        require: { array: true, loop: true },
        calls: [["fgets"], ["printf"]],
        forbid: ["gets", "system"],
        minStatements: 10,
        message: "本关需要：#include <stdio.h> 与 <string.h>、int main(void)、char line[256] 这样的数组、循环、在 main 里用 fgets 读入并用 printf 输出，最后 return 0; 。",
        ok: "读入、扫描、统计与输出都齐全，结构完全正确。"
      },
      input: "the quick brown fox jumps over the lazy dog\n",
      expectedOutput: "word 1: the\n"
        + "word 2: quick\n"
        + "word 3: brown\n"
        + "word 4: fox\n"
        + "word 5: jumps\n"
        + "word 6: over\n"
        + "word 7: the\n"
        + "word 8: lazy\n"
        + "word 9: dog\n"
        + "words = 9\n"
        + "longest = quick (len 5)",
      solution: "#include <stdio.h>\n"
        + "#include <string.h>\n"
        + "\n"
        + "/* 单词之间的空白：空格或制表符 */\n"
        + "static int is_space(char c) {\n"
        + "    return c == ' ' || c == '\\t';\n"
        + "}\n"
        + "\n"
        + "int main(void) {\n"
        + "    char line[256];\n"
        + "    char cur[64];\n"
        + "    char longest[64];\n"
        + "    int count = 0;\n"
        + "    int w = 0;\n"
        + "    int in_word = 0;\n"
        + "    int longest_len = 0;\n"
        + "    int i;\n"
        + "    size_t len;\n"
        + "\n"
        + "    if (fgets(line, sizeof(line), stdin) == NULL) {\n"
        + "        return 1;\n"
        + "    }\n"
        + "    len = strlen(line);\n"
        + "    if (len > 0 && line[len - 1] == '\\n') {\n"
        + "        line[len - 1] = '\\0'; /* 去掉行尾换行，它不算一个单词 */\n"
        + "    }\n"
        + "\n"
        + "    for (i = 0; line[i] != '\\0'; i++) {\n"
        + "        if (is_space(line[i])) {\n"
        + "            if (in_word) {\n"
        + "                cur[w] = '\\0';\n"
        + "                count++;\n"
        + "                printf(\"word %d: %s\\n\", count, cur);\n"
        + "                if (w > longest_len) {\n"
        + "                    longest_len = w;\n"
        + "                    strcpy(longest, cur); /* 两个数组都是 64 字节，装得下 */\n"
        + "                }\n"
        + "                in_word = 0;\n"
        + "                w = 0;\n"
        + "            }\n"
        + "        } else {\n"
        + "            if (w < (int)sizeof(cur) - 1) {\n"
        + "                cur[w] = line[i];\n"
        + "                w++;\n"
        + "            }\n"
        + "            in_word = 1;\n"
        + "        }\n"
        + "    }\n"
        + "\n"
        + "    if (in_word) { /* 最后一行末尾没有空白，别忘了收尾 */\n"
        + "        cur[w] = '\\0';\n"
        + "        count++;\n"
        + "        printf(\"word %d: %s\\n\", count, cur);\n"
        + "        if (w > longest_len) {\n"
        + "            longest_len = w;\n"
        + "            strcpy(longest, cur);\n"
        + "        }\n"
        + "    }\n"
        + "\n"
        + "    printf(\"words = %d\\n\", count);\n"
        + "    if (count > 0) {\n"
        + "        printf(\"longest = %s (len %d)\\n\", longest, longest_len);\n"
        + "    } else {\n"
        + "        printf(\"longest = (none)\\n\");\n"
        + "    }\n"
        + "    return 0;\n"
        + "}",
      mastery: [
        "能独立完成「读一行、切单词、统计、找最长」的完整程序并处理边界情况",
        "能用状态变量区分「在单词内/外」，并解释为什么循环结束还要再结算一次",
        "能说出程序里每处缓冲区的大小是怎么确定的，为什么不会越界"
      ]
    }
  ]
});