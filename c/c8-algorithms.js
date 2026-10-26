/* ============================================================================
 * HT Lab · C 语言课程 · 模块 8 · 数据结构与算法
 * 关卡 id：65–74
 * 每关的示例代码与标准答案都用 Dev-C++ 自带 gcc 4.9.2（-std=c11 -Wall -Wextra）
 * 真实编译并运行过，零警告；example.output / expectedOutput 是实际输出，
 * 读入数据的关卡把喂给程序的 stdin 写在 example.input 与 input 字段里。
 * 涉及动态内存的关卡都成对使用 malloc / free，结构检查用 require 里的
 * struct / recursion / malloc / free 约束。
 * ==========================================================================*/
window.C_MODULES = window.C_MODULES || [];
window.C_MODULES.push({
  id: "c8",
  name: "模块 8 · 数据结构与算法",
  levels: [
    {
      id: 65,
      title: "算法复杂度：大 O 记号与循环代价估算",
      minutes: 18,
      gist: "看懂 O(1)、O(log n)、O(n)、O(n²) 的由来，能对一段循环估算它的量级。",
      lesson: "同一道题，两种写法都能算对，但数据一大，一个瞬间出结果，另一个跑到天亮。算法复杂度就是比较「代价随着数据规模怎么涨」的语言。\n"
        + "大 O 记号描述的是增长量级，不是精确次数。O(n) 表示操作次数大约和 n 成正比；O(n²) 表示 n 翻倍、代价大约翻四倍；O(log n) 表示每走一步待处理的数据就少一半。写 O 的时候要丢掉常数和低阶项：3n + 5 写成 O(n)，n²/2 + 100n 写成 O(n²)，因为 n 变大之后系数和低阶项都不再重要。\n"
        + "常见量级从快到慢：O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2^n)。按下标取值是 O(1)；二分查找是 O(log n)；一次遍历是 O(n)；归并、快速排序平均是 O(n log n)；两层嵌套循环通常是 O(n²)；枚举所有子集是 O(2^n)。\n"
        + "怎么估一个循环的代价？数循环体执行了多少次。单层 for (i = 0; i < n; i++) 跑 n 次，是 O(n)；两层各跑 n 次就是 n × n，是 O(n²)；如果每轮写 i = i / 2，次数是「n 能连续除以几次 2」，约等于 log₂n，是 O(log n)。多个循环并列时要相加再取最大项：一个 O(n) 循环加一个 O(n²) 循环，整体还是 O(n²)；循环嵌套则是相乘。\n"
        + "估算时抓住执行次数最多的那一句就够了，其余都是配角。但常数不是永远不重要：n 很小时，简单的 O(n²) 写法常常比复杂的 O(n log n) 写法更快——这正是快排在小数组上改用插入排序的原因。\n"
        + "另外要说清是哪种情况：同一算法的最坏、平均、最好情况可能不同。快速排序平均 O(n log n)，最坏会退化到 O(n²)。\n"
        + "读别人的代码时，先看循环嵌套了几层，再看每层的范围随谁变化，量级基本就定下来了。",
      example: {
        code: "#include <stdio.h>\n"
          + "\n"
          + "/* 把「量级」变成看得见的数字：同一个操作数一遍，数数循环体执行了多少次 */\n"
          + "static int count_log(int n) {\n"
          + "    int i, steps = 0;\n"
          + "    for (i = n; i > 0; i = i / 2) {\n"
          + "        steps++;\n"
          + "    }\n"
          + "    return steps;\n"
          + "}\n"
          + "\n"
          + "static int count_linear(int n) {\n"
          + "    int i, steps = 0;\n"
          + "    for (i = 0; i < n; i++) {\n"
          + "        steps++;\n"
          + "    }\n"
          + "    return steps;\n"
          + "}\n"
          + "\n"
          + "static int count_quadratic(int n) {\n"
          + "    int i, j, steps = 0;\n"
          + "    for (i = 0; i < n; i++) {\n"
          + "        for (j = 0; j < n; j++) {\n"
          + "            steps++;\n"
          + "        }\n"
          + "    }\n"
          + "    return steps;\n"
          + "}\n"
          + "\n"
          + "int main(void) {\n"
          + "    int n = 0;\n"
          + "    int sizes[3] = {8, 16, 64};\n"
          + "    int k;\n"
          + "\n"
          + "    scanf(\"%d\", &n);\n"
          + "\n"
          + "    printf(\"n = %d\\n\", n);\n"
          + "    printf(\"O(1)     : %d step\\n\", 1);\n"
          + "    printf(\"O(log n) : %d steps\\n\", count_log(n));\n"
          + "    printf(\"O(n)     : %d steps\\n\", count_linear(n));\n"
          + "    printf(\"O(n^2)   : %d steps\\n\", count_quadratic(n));\n"
          + "\n"
          + "    /* 同一份代码换几个 n，看看代价涨得多快 */\n"
          + "    printf(\"growth table:\\n\");\n"
          + "    printf(\"%8s %8s %8s %8s\\n\", \"n\", \"log n\", \"n\", \"n^2\");\n"
          + "    for (k = 0; k < 3; k++) {\n"
          + "        printf(\"%8d %8d %8d %8d\\n\",\n"
          + "               sizes[k], count_log(sizes[k]), count_linear(sizes[k]), count_quadratic(sizes[k]));\n"
          + "    }\n"
          + "    return 0;\n"
          + "}",
        input: "8",
        output: "n = 8\n"
          + "O(1) : 1 step\n"
          + "O(log n) : 4 steps\n"
          + "O(n) : 8 steps\n"
          + "O(n^2) : 64 steps\n"
          + "growth table:\n"
          + "n log n n n^2\n"
          + "8 4 8 64\n"
          + "16 5 16 256\n"
          + "64 7 64 4096",
        explain: "说明：这个示例是「完整版」——除了三种量级的计数，还多打印了一张增长表，行文格式也和任务要求不同；本关任务只要按任务说明输出那 5 行（n、O(1)、O(n)、O(n^2)、O(log n)），格式以任务说明为准。示例把三种写法的「基本操作次数」真的数了出来：count_log 每轮把 i 折半，count_linear 老老实实跑 n 次，count_quadratic 用两层循环跑 n × n 次。\n"
          + "main 先读入 n，再分别调用三个计数函数，把同一批 n 下三种量级的差距直接印出来——n = 8 时是 4、8、64。\n"
          + "下面那张 growth table 是这一关的重点：同一个函数，n 从 8 到 16 再到 64 时，O(log n) 只从 4 涨到 7，O(n) 从 8 涨到 64，O(n²) 从 64 涨到 4096。数据规模翻 8 倍，平方量级的代价涨了 64 倍，这就是量级的含义。\n"
          + "把这张表和「丢掉常数」的规则放在一起看就明白了：O(n²) 在 n = 8 时并没有比 O(n) 慢多少，但 n 一大就完全不是一个数量级。"
      },
      pitfalls: [
        "把 O(2n) 当成比 O(n) 更高一档：系数被丢掉，两者是同一量级。",
        "看到两层循环就写 O(n²)：若内层固定跑 10 次（`for (j = 0; j < 10; j++)`），总次数是 10n，量级仍是 O(n)。",
        "把 O(log n) 和 O(n) 搞混：`i = i / 2` 才是每轮减半；写成 `i--` 每轮只减 1，那就是 O(n)。",
        "并列的循环相加后忘记取最大项：一个 O(n) 循环加一个 O(n²) 循环，整体是 O(n²) 而不是 O(n³)。",
        "只谈一个 O 就下结论：快排平均 O(n log n)、最坏 O(n²)，说复杂度时必须带上「哪种情况」。"
      ],
      takeaways: [
        "大 O 描述增长量级，要丢掉常数和低阶项（3n + 5 是 O(n)）",
        "常见量级：O(1) < O(log n) < O(n) < O(n log n) < O(n²)",
        "循环嵌套相乘、循环并列相加取最大项",
        "每轮折半是 O(log n)，每轮减一是 O(n)",
        "n 很小时常数会占主导，量级优势要到数据变大才体现"
      ],
      questions: [
        {
          q: "下面这段代码的时间复杂度是多少？\n"
          + "for (i = 0; i < n; i++) {\n"
          + "    for (j = 0; j < 10; j++) {\n"
          + "        sum++;\n"
          + "    }\n"
          + "}",
          options: [
            "O(n^2)，因为有两层循环",
            "O(n)，总次数是 10n，常数 10 被丢掉",
            "O(log n)，因为内层范围很小",
            "O(1)，因为 10 是常数"
          ],
          answer: 1,
          explain: "嵌套循环的次数相乘：外层 n 次、内层固定 10 次，总共 10n 次，常数 10 在量级记号里被丢掉，所以是 O(n)。A 错：内层次数不随 n 变化，相乘也只有 10n，没有 n² 项。C 错：折半才是 log n，这里没有折半。D 错：总次数随 n 线性增长，不是常数。"
        },
        {
          q: "用大 O 表示 3n² + 100n + 500，正确的是？",
          options: [
            "O(3n²)",
            "O(n² + n)",
            "O(n²)",
            "O(100n)"
          ],
          answer: 2,
          explain: "量级记号只看最高阶项、丢掉系数：3n² + 100n + 500 是 O(n²)。A 错：系数 3 要丢掉，O(3n²) 不是标准写法。B 错：低阶项 n 在 n 变大后可以忽略。D 错：100n 只是第二项，n 很大时 n² 才是主导。"
        },
        {
          q: "`for (i = n; i > 0; i = i / 2) { count++; }` 的执行次数属于哪个量级？",
          options: [
            "O(1)",
            "O(n)",
            "O(n / 2)",
            "O(log n)"
          ],
          answer: 3,
          explain: "每轮 i 折半，n = 8 时 i 依次是 8、4、2、1，共 4 次；n 每翻一倍只多一次，所以是 O(log n)，D 对。B 错：那是每轮减 1 的写法。C 错：O(n/2) 就是 O(n)，而且这里根本不是线性次数。A 错：次数随 n 变化。"
        }
      ],
      passRatio: 0.8,
      mission: "写一个单文件程序，读入一个正整数 n（例如输入 8），用循环真的数出下面三种写法的执行次数，按顺序输出 5 行：\n"
        + "n = 8\n"
        + "O(1) = 1\n"
        + "O(n) = 8\n"
        + "O(n^2) = 64\n"
        + "O(log n) = 4\n"
        + "要求：\n"
        + "1) 第一行输出读到的 n；\n"
        + "2) O(1) 那一行输出常数 1，表示与 n 无关；\n"
        + "3) O(n) 用单层 for 循环数出来（计数器在循环体里加一）；\n"
        + "4) O(n^2) 用两层嵌套 for 循环数出来；\n"
        + "5) O(log n) 用 for (i = n; i > 0; i = i / 2) 的思路数出来；\n"
        + "   注意：这三个循环要写在 main 里，计数器作为 main 的局部变量；\n"
        + "6) 最后 return 0;。\n"
        + "在本机编译运行，输入 8，确认 5 行输出与上面完全一致。",
      starter: "#include <stdio.h>\n"
        + "\n"
        + "int main(void) {\n"
        + "    int n = 0;\n"
        + "    int i, j;\n"
        + "    int constant_steps = 1;\n"
        + "    int linear_steps = 0;\n"
        + "    int quadratic_steps = 0;\n"
        + "    int log_steps = 0;\n"
        + "\n"
        + "    scanf(\"%d\", &n);\n"
        + "\n"
        + "    /* TODO: 单层循环，数出 O(n) 的次数 */\n"
        + "\n"
        + "    /* TODO: 两层嵌套循环，数出 O(n^2) 的次数 */\n"
        + "\n"
        + "    /* TODO: 每轮折半，数出 O(log n) 的次数 */\n"
        + "\n"
        + "    /* TODO: 按 n、O(1)、O(n)、O(n^2)、O(log n) 的顺序输出 5 行 */\n"
        + "\n"
        + "    return 0;\n"
        + "}",
      hint: "三个计数器分别在各自的循环体里 ++ 就够了。折半那一个写成 for (i = n; i > 0; i = i / 2)：n = 8 时 i 会依次取 8、4、2、1，所以是 4 次。输出顺序别弄反：n、O(1)、O(n)、O(n^2)、O(log n)。",
      check: {
        include: ["stdio.h"],
        return0: true,
        calls: [["scanf","%d"],["printf","n ="],["printf","O(1)"],["printf","O(n)"],["printf","O(n^2)"],["printf","O(log n)"]],
        callCounts: [["printf",5,9]],
        require: {"for":true,"loop":true},
        minStatements: 12,
        message: "需要 #include <stdio.h>、读入 n、三个统计循环（单层 for、两层嵌套 for、以及每轮折半的 for），再按 n、O(1)、O(n)、O(n^2)、O(log n) 五行输出并 return 0;（五行输出都是 %d，数值必须由循环真的数出来）。",
        ok: "三种量级的循环与五行输出都到位了。"
      },
      expectedOutput: "n = 8\n"
          + "O(1) = 1\n"
          + "O(n) = 8\n"
          + "O(n^2) = 64\n"
          + "O(log n) = 4",
      input: "8",
      solution: "#include <stdio.h>\n"
          + "\n"
          + "int main(void) {\n"
          + "    int n = 0;\n"
          + "    int i, j;\n"
          + "    int constant_steps = 1;\n"
          + "    int linear_steps = 0;\n"
          + "    int quadratic_steps = 0;\n"
          + "    int log_steps = 0;\n"
          + "\n"
          + "    scanf(\"%d\", &n);\n"
          + "\n"
          + "    for (i = 0; i < n; i++) {\n"
          + "        linear_steps++;\n"
          + "    }\n"
          + "    for (i = 0; i < n; i++) {\n"
          + "        for (j = 0; j < n; j++) {\n"
          + "            quadratic_steps++;\n"
          + "        }\n"
          + "    }\n"
          + "    for (i = n; i > 0; i = i / 2) {\n"
          + "        log_steps++;\n"
          + "    }\n"
          + "\n"
          + "    printf(\"n = %d\\n\", n);\n"
          + "    printf(\"O(1) = %d\\n\", constant_steps);\n"
          + "    printf(\"O(n) = %d\\n\", linear_steps);\n"
          + "    printf(\"O(n^2) = %d\\n\", quadratic_steps);\n"
          + "    printf(\"O(log n) = %d\\n\", log_steps);\n"
          + "    return 0;\n"
          + "}",
      mastery: [
        "能对一段循环代码说出它的时间量级，并解释为什么丢掉常数",
        "能区分「每轮折半」与「每轮减一」这两种循环的次数差异",
        "能说明为什么小数据上简单的 O(n²) 写法不一定比 O(n log n) 慢"
      ]
    },
    {
      id: 66,
      title: "排序（一）：冒泡、选择、插入与稳定性",
      minutes: 20,
      gist: "手写三种 O(n²) 排序，看清它们的过程差别，并搞懂「稳定」到底指什么。",
      lesson: "排序是把一堆数据按某个关键字排成顺序。先看三种最容易手写出来的算法：冒泡、选择、插入。它们的平均与最坏时间都是 O(n²)，但过程、交换次数和稳定性都不一样。\n"
        + "冒泡排序：从左到右比较相邻两个元素，前面比后面大就交换。跑完一轮，最大的元素一定被换到了末尾，所以下一轮只需要管前面 n-1 个。如果加一个「本轮有没有交换过」的标记，数据已经有序时可以提前结束。\n"
        + "选择排序：每一轮在未排序区间里找出最小的元素，和区间第一个元素交换。它的比较次数固定是 n(n-1)/2，与数据原本的顺序无关；交换最多 n-1 次，这是它唯一的优势。缺点是不管数据多有序都要跑满。\n"
        + "插入排序：把数组看成「左边已排好、右边待处理」，每次取出右边第一个元素，在左边从后往前找位置插入（边找边把比它大的元素往后挪一格）。数据接近有序时内层几乎不动，整体接近 O(n)，所以小数组和基本有序的数据上它非常快。\n"
        + "稳定性说的是：两个元素的关键字相等时，排序后它们的相对先后顺序保持不变，这个算法就稳定。冒泡（只在严格大于时交换）和插入（只在严格大于时后移）是稳定的；选择排序一次交换可能跨过好几个相同关键字，通常不稳定。归并排序稳定，快速排序不稳定。\n"
        + "稳定有什么用？按分数给学生排名时，同分的人保持原来的顺序才符合预期。要稳定就选归并或插入；不在乎同关键字顺序时可以用快排。\n"
        + "还有一个容易混淆的概念是原地排序：冒泡、选择、插入、快排只用常数级额外空间；归并需要一块和原数组一样大的临时数组。\n"
        + "读别人的排序代码时，先看它按哪个关键字比较，再看交换条件是 > 还是 >=（这决定稳定性），最后检查循环边界——排序的 bug 几乎都出在边界上。",
      example: {
        code: "#include <stdio.h>\n"
          + "\n"
          + "#define N 5\n"
          + "\n"
          + "/* key 是要排序的关键字，id 是它原来的位置：\n"
          + "   排完之后只要看相同 key 的 id 是不是还按从小到大排，就知道这种排序稳不稳定 */\n"
          + "struct Item {\n"
          + "    int key;\n"
          + "    int id;\n"
          + "};\n"
          + "\n"
          + "static void print_items(const char *label, const struct Item *a, int n) {\n"
          + "    int i;\n"
          + "    printf(\"%s\", label);\n"
          + "    for (i = 0; i < n; i++) {\n"
          + "        printf(\" %d(id%d)\", a[i].key, a[i].id);\n"
          + "    }\n"
          + "    printf(\"\\n\");\n"
          + "}\n"
          + "\n"
          + "/* 冒泡：相邻两个比较，大的往后冒。只在「严格大于」时交换，所以稳定 */\n"
          + "static void bubble_sort(struct Item *a, int n) {\n"
          + "    int i, j;\n"
          + "    struct Item t;\n"
          + "    for (i = 0; i < n - 1; i++) {\n"
          + "        for (j = 0; j < n - 1 - i; j++) {\n"
          + "            if (a[j].key > a[j + 1].key) {\n"
          + "                t = a[j];\n"
          + "                a[j] = a[j + 1];\n"
          + "                a[j + 1] = t;\n"
          + "            }\n"
          + "        }\n"
          + "    }\n"
          + "}\n"
          + "\n"
          + "/* 选择：每轮挑出最小的和当前位置交换。一次交换可能跨过相同的关键字，所以不稳定 */\n"
          + "static void selection_sort(struct Item *a, int n) {\n"
          + "    int i, j, min;\n"
          + "    struct Item t;\n"
          + "    for (i = 0; i < n - 1; i++) {\n"
          + "        min = i;\n"
          + "        for (j = i + 1; j < n; j++) {\n"
          + "            if (a[j].key < a[min].key) {\n"
          + "                min = j;\n"
          + "            }\n"
          + "        }\n"
          + "        if (min != i) {\n"
          + "            t = a[i];\n"
          + "            a[i] = a[min];\n"
          + "            a[min] = t;\n"
          + "        }\n"
          + "    }\n"
          + "}\n"
          + "\n"
          + "/* 插入：把当前元素往左挪到合适位置。只在「严格大于」时后移，所以稳定 */\n"
          + "static void insertion_sort(struct Item *a, int n) {\n"
          + "    int i, j;\n"
          + "    struct Item key;\n"
          + "    for (i = 1; i < n; i++) {\n"
          + "        key = a[i];\n"
          + "        j = i - 1;\n"
          + "        while (j >= 0 && a[j].key > key.key) {\n"
          + "            a[j + 1] = a[j];\n"
          + "            j--;\n"
          + "        }\n"
          + "        a[j + 1] = key;\n"
          + "    }\n"
          + "}\n"
          + "\n"
          + "int main(void) {\n"
          + "    struct Item data[N] = {\n"
          + "        {3, 1}, {1, 2}, {3, 3}, {2, 4}, {1, 5}\n"
          + "    };\n"
          + "    struct Item a[N];\n"
          + "    int i;\n"
          + "\n"
          + "    print_items(\"original :\", data, N);\n"
          + "\n"
          + "    for (i = 0; i < N; i++) a[i] = data[i];\n"
          + "    bubble_sort(a, N);\n"
          + "    print_items(\"bubble   :\", a, N);\n"
          + "\n"
          + "    for (i = 0; i < N; i++) a[i] = data[i];\n"
          + "    selection_sort(a, N);\n"
          + "    print_items(\"selection:\", a, N);\n"
          + "\n"
          + "    for (i = 0; i < N; i++) a[i] = data[i];\n"
          + "    insertion_sort(a, N);\n"
          + "    print_items(\"insertion:\", a, N);\n"
          + "    return 0;\n"
          + "}",
        output: "original : 3(id1) 1(id2) 3(id3) 2(id4) 1(id5)\n"
          + "bubble : 1(id2) 1(id5) 2(id4) 3(id1) 3(id3)\n"
          + "selection: 1(id2) 1(id5) 2(id4) 3(id3) 3(id1)\n"
          + "insertion: 1(id2) 1(id5) 2(id4) 3(id1) 3(id3)",
        explain: "这个例子要解决一个用整数数组看不出来的问题：稳定性。struct Item 里除了 key 还存了 id（原始位置），排完之后只要看相同 key 的 id 是否还按从小到大排列，就能判断这次排序稳不稳定。\n"
          + "数据是 {3(id1), 1(id2), 3(id3), 2(id4), 1(id5)}：有两组相等关键字（两个 3、两个 1），正好用来做实验。\n"
          + "bubble_sort 只在 a[j].key > a[j+1].key 时交换，insertion_sort 只在 a[j].key > key.key 时后移，两者都只在「严格大于」时动手，所以相等元素不会被跨过去，输出里 id 保持 1 → 3、2 → 5。\n"
          + "selection_sort 每轮把最小值换到前面，一次交换可能跨过好几个元素：两个 3 的 id 从 1、3 变成了 3、1，相对顺序被破坏。这就是「选择排序不稳定」最直观的样子。\n"
          + "注意 main 里三次排序前都写了 for (i = 0; i < N; i++) a[i] = data[i];——每次都要拿原始数据重新排，否则第二次排序的对象是上一次的结果，实验就没意义了。\n"
          + "这个示例的数据是写死在代码里的，方便把注意力集中在「稳定性」这一件事上；任务里要改成从键盘读入任意一组整数。"
      },
      pitfalls: [
        "冒泡内层写成 `j < n - 1`：每轮没有排除已经排好的尾巴，结果能对但要白跑很多次；正确是 `j < n - 1 - i`。",
        "选择排序的 min 忘记在外层循环里重置为 i，一轮跑完 min 一直是上次的位置，结果错得很隐蔽。",
        "插入排序后移条件写成 `a[j] >= key`：相等元素也被挪动，稳定性被破坏（输出里同关键字的顺序会颠倒）。",
        "以为插入排序一定比冒泡慢：数据基本有序时插入是接近 O(n) 的，冒泡再优化也只是 O(n)。",
        "把「稳定」和「原地」混为一谈：归并稳定但要临时数组，快排原地但不稳定。"
      ],
      takeaways: [
        "冒泡、选择、插入都是 O(n²)，但过程、交换次数与稳定性不同",
        "插入排序在接近有序的数据上接近 O(n)，小数组上很实用",
        "稳定 = 关键字相等的元素在排序后保持原有先后顺序",
        "只在「严格大于」时交换或后移，才能保住稳定性",
        "比较次数固定（选择）与随数据变化（插入）是两种不同代价"
      ],
      questions: [
        {
          q: "关于选择排序，下面说法正确的是？",
          options: [
            "它的比较次数固定是 n(n-1)/2，与数据初始顺序无关",
            "它的交换次数一定比冒泡排序多",
            "它是稳定排序",
            "它的时间复杂度是 O(n log n)"
          ],
          answer: 0,
          explain: "选择排序每轮都要把未排序区间扫一遍找最小值，比较次数固定为 n(n-1)/2，跟数据原本乱不乱没关系，A 对。B 错：它的交换最多 n-1 次，比冒泡少得多。C 错：一次交换可能跨过相同关键字，通常不稳定。D 错：它是 O(n²) 量级。"
        },
        {
          q: "冒泡排序里加一个「本轮是否交换过」的标记，作用是？",
          options: [
            "把复杂度降到 O(n log n)",
            "保证排序稳定",
            "某一轮没有发生交换就提前结束（说明已经有序）",
            "减少交换次数但比较次数不变"
          ],
          answer: 2,
          explain: "一整轮都没交换，说明相邻元素处处有序，整个数组已经排好，可以直接跳出循环，C 对。A 错：这只在「已经有序」时把代价降到 O(n)，量级不变。B 错：稳定性来自「只在严格大于时交换」，跟标记无关。D 错：提前结束后比较次数也一起减少了。"
        },
        {
          q: "对 {3, 1, 3, 2} 使用稳定排序，两个 3 的相对顺序会怎样？",
          options: [
            "保持不变，这是稳定排序的定义",
            "一定会被交换",
            "取决于数组长度是不是偶数",
            "数组里不能有相等元素，否则无法排序"
          ],
          answer: 0,
          explain: "稳定的定义就是关键字相等时保持原来的先后顺序，所以排完后原来的第一个 3 仍在第二个 3 前面，A 对。B 描述的是不稳定排序可能出现的结果（比如选择排序）。C、D 都不是排序规则：相等元素完全可以排序，只是谁在前的问题。"
        }
      ],
      passRatio: 0.8,
      mission: "写一个单文件程序，读入 n 和 n 个整数（例如：\n"
        + "6\n"
        + "5 2 9 1 6 3\n"
        + "），用一个自己写的函数把数组升序排序，输出 3 行：\n"
        + "sorted: 1 2 3 5 6 9\n"
        + "min = 1, max = 9\n"
        + "sum = 26\n"
        + "要求：\n"
        + "1) 定义函数 void sort_array(int *a, int n)，在函数里用插入排序（换成冒泡、选择也可以，结果一样）把 a 升序排列；\n"
        + "2) main 里读入数据后调用 sort_array(data, n)；\n"
        + "3) 第一行输出 \"sorted:\" 后跟每个数前加一个空格；\n"
        + "4) 第二行输出最小值和最大值（数组已有序，就是第一个和最后一个元素）；\n"
        + "5) 第三行输出所有元素之和；\n"
        + "6) 最后 return 0;。",
      starter: "#include <stdio.h>\n"
        + "\n"
        + "#define MAXN 100\n"
        + "\n"
        + "/* TODO: 在这里写 sort_array：用插入排序把 a 升序排列 */\n"
        + "\n"
        + "int main(void) {\n"
        + "    int n = 0;\n"
        + "    int data[MAXN];\n"
        + "    int i, sum = 0;\n"
        + "\n"
        + "    scanf(\"%d\", &n);\n"
        + "    for (i = 0; i < n; i++) {\n"
        + "        scanf(\"%d\", &data[i]);\n"
        + "    }\n"
        + "\n"
        + "    /* TODO: 调用 sort_array(data, n) */\n"
        + "\n"
        + "    /* TODO: 输出 sorted / min 与 max / sum 三行 */\n"
        + "\n"
        + "    return 0;\n"
        + "}",
      hint: "插入排序的核心是三步：把 a[i] 暂存到 key；用 while (j >= 0 && a[j] > key) 把比它大的元素逐个右移；循环结束后写 a[j + 1] = key。排序完最小值是 data[0]、最大值是 data[n - 1]，求和可以在输出循环里顺手累加。",
      check: {
        include: ["stdio.h"],
        return0: true,
        seq: [["sort_array","(","data",",","n",")"]],
        calls: [["scanf","%d"],["printf","sorted:"],["printf","min ="],["printf","sum ="]],
        require: {"funcs":["sort_array"],"array":true,"loop":true},
        minStatements: 12,
        message: "需要自己定义 sort_array 函数、用数组保存读入的数据、在 main 里调用 sort_array(data, n)，并输出 sorted: / min = ... max = ... / sum = ... 三行以及 return 0;。",
        ok: "函数划分、数组读取与三行输出都正确。"
      },
      expectedOutput: "sorted: 1 2 3 5 6 9\n"
          + "min = 1, max = 9\n"
          + "sum = 26",
      input: "6\n"
          + "5 2 9 1 6 3",
      solution: "#include <stdio.h>\n"
          + "\n"
          + "#define MAXN 100\n"
          + "\n"
          + "/* 插入排序：把 a[i] 往左挪到它该在的位置 */\n"
          + "static void sort_array(int *a, int n) {\n"
          + "    int i, j, key;\n"
          + "    for (i = 1; i < n; i++) {\n"
          + "        key = a[i];\n"
          + "        j = i - 1;\n"
          + "        while (j >= 0 && a[j] > key) {\n"
          + "            a[j + 1] = a[j];\n"
          + "            j--;\n"
          + "        }\n"
          + "        a[j + 1] = key;\n"
          + "    }\n"
          + "}\n"
          + "\n"
          + "int main(void) {\n"
          + "    int n = 0;\n"
          + "    int data[MAXN];\n"
          + "    int i, sum = 0;\n"
          + "\n"
          + "    scanf(\"%d\", &n);\n"
          + "    for (i = 0; i < n; i++) {\n"
          + "        scanf(\"%d\", &data[i]);\n"
          + "    }\n"
          + "\n"
          + "    sort_array(data, n);\n"
          + "\n"
          + "    printf(\"sorted:\");\n"
          + "    for (i = 0; i < n; i++) {\n"
          + "        printf(\" %d\", data[i]);\n"
          + "        sum += data[i];\n"
          + "    }\n"
          + "    printf(\"\\n\");\n"
          + "    printf(\"min = %d, max = %d\\n\", data[0], data[n - 1]);\n"
          + "    printf(\"sum = %d\\n\", sum);\n"
          + "    return 0;\n"
          + "}",
      mastery: [
        "能手写冒泡、选择、插入三种排序，并说清各自的比较与交换特点",
        "能判断一个排序算法是否稳定，并说明交换条件怎么写才稳定",
        "能把排序逻辑抽成一个函数，在 main 里组织输入输出"
      ]
    },
    {
      id: 67,
      title: "排序（二）：快速排序与归并排序",
      minutes: 25,
      gist: "用分治把排序降到 O(n log n)：快排的划分、归并的合并，以及递归边界。",
      lesson: "上一关的三种排序都是 O(n²)，这一关用分治把它们降到 O(n log n)。分治的套路是三句话：把大问题分成两个小问题、分别解决、再把结果合起来。排序里的分法有两种：按位置对半分（归并），按大小分成两堆（快排）。\n"
        + "快速排序：从区间里挑一个基准值 pivot，把比它小的都挪到左边、比它大的留在右边。这一步做完，基准值的位置就永久确定了；再对左右两个区间重复同样的过程。它的「分」本身就是「治」——不需要合并，因为分完就已经有序。快排平均 O(n log n)、原地排序，是实践中最快的通用排序之一。\n"
        + "快排的软肋是基准选得不好：如果每次都选到最大或最小值（例如对已经有序的数组固定取端点当基准），分出来的两个区间一个是空、一个是 n-1，递归深度变成 n，总代价退化成 O(n²)。改进办法是随机选基准或三数取中。这也是递归函数必须先判断区间长度小于 2 就返回的原因，否则会无限递归下去。\n"
        + "归并排序：把区间从中间切成两半，分别递归排好，再把两个有序段合并成一个有序段。合并用双指针：两个指针各指一段的开头，每次取较小的那个放进临时数组，最后整段拷回来。归并的代价很稳定——任何数据都是 O(n log n)；而且只要在相等时优先取左边（用 <=），它就是稳定的。\n"
        + "归并的代价是需要一块和原数组同样大的临时数组：用 malloc 申请、用完 free。通常只在包装函数里申请一次，通过参数传给递归函数复用，而不是每次合并都申请——否则一次排序会申请释放几十次。\n"
        + "写递归函数时先写终止条件，再写递归调用，最后检查「每一步是不是真的让问题变小」。这两个排序的终止条件都是区间里少于两个元素（low >= high）。\n"
        + "读别人的快排/归并代码：快排看划分后的分界点落在哪、递归区间是不是 (low, i-1) 和 (i+1, high)；归并看两个收尾 while 有没有漏掉残留元素。",
      example: {
        code: "#include <stdio.h>\n"
          + "#include <stdlib.h>\n"
          + "\n"
          + "#define MAXN 100\n"
          + "\n"
          + "static int quick_cmp = 0;\n"
          + "static int quick_swaps = 0;\n"
          + "static int merge_cmp = 0;\n"
          + "\n"
          + "static void swap_int(int *a, int *b) {\n"
          + "    int t = *a;\n"
          + "    *a = *b;\n"
          + "    *b = t;\n"
          + "}\n"
          + "\n"
          + "/* 快速排序：拿区间的最后一个元素当基准，比它小的都换到左边，再对左右两半递归 */\n"
          + "static void quick_sort(int *a, int low, int high) {\n"
          + "    int i, j, pivot;\n"
          + "    if (low >= high) {\n"
          + "        return;\n"
          + "    }\n"
          + "    pivot = a[high];\n"
          + "    i = low;\n"
          + "    for (j = low; j < high; j++) {\n"
          + "        quick_cmp++;\n"
          + "        if (a[j] < pivot) {\n"
          + "            swap_int(&a[i], &a[j]);\n"
          + "            quick_swaps++;\n"
          + "            i++;\n"
          + "        }\n"
          + "    }\n"
          + "    swap_int(&a[i], &a[high]);\n"
          + "    quick_swaps++;\n"
          + "    quick_sort(a, low, i - 1);\n"
          + "    quick_sort(a, i + 1, high);\n"
          + "}\n"
          + "\n"
          + "/* 归并排序：先把左右两半各自排好，再把两个有序段合并进 temp */\n"
          + "static void merge_sort_rec(int *a, int *temp, int low, int high) {\n"
          + "    int mid, i, j, k;\n"
          + "    if (low >= high) {\n"
          + "        return;\n"
          + "    }\n"
          + "    mid = low + (high - low) / 2;\n"
          + "    merge_sort_rec(a, temp, low, mid);\n"
          + "    merge_sort_rec(a, temp, mid + 1, high);\n"
          + "\n"
          + "    i = low;\n"
          + "    j = mid + 1;\n"
          + "    k = low;\n"
          + "    while (i <= mid && j <= high) {\n"
          + "        merge_cmp++;\n"
          + "        if (a[i] <= a[j]) {          /* 用 <= 才能保持稳定 */\n"
          + "            temp[k++] = a[i++];\n"
          + "        } else {\n"
          + "            temp[k++] = a[j++];\n"
          + "        }\n"
          + "    }\n"
          + "    while (i <= mid) {\n"
          + "        temp[k++] = a[i++];\n"
          + "    }\n"
          + "    while (j <= high) {\n"
          + "        temp[k++] = a[j++];\n"
          + "    }\n"
          + "    for (i = low; i <= high; i++) {\n"
          + "        a[i] = temp[i];\n"
          + "    }\n"
          + "}\n"
          + "\n"
          + "/* 临时数组只申请一次，递归函数共用它 */\n"
          + "static int merge_sort(int *a, int n) {\n"
          + "    int *temp = malloc(sizeof(int) * (size_t)n);\n"
          + "    if (temp == NULL) {\n"
          + "        return -1;\n"
          + "    }\n"
          + "    merge_sort_rec(a, temp, 0, n - 1);\n"
          + "    free(temp);\n"
          + "    return 0;\n"
          + "}\n"
          + "\n"
          + "int main(void) {\n"
          + "    int n = 0, i;\n"
          + "    int data[MAXN], a[MAXN];\n"
          + "\n"
          + "    scanf(\"%d\", &n);\n"
          + "    for (i = 0; i < n; i++) {\n"
          + "        scanf(\"%d\", &data[i]);\n"
          + "    }\n"
          + "\n"
          + "    printf(\"original:\");\n"
          + "    for (i = 0; i < n; i++) {\n"
          + "        printf(\" %d\", data[i]);\n"
          + "    }\n"
          + "    printf(\"\\n\");\n"
          + "\n"
          + "    for (i = 0; i < n; i++) a[i] = data[i];\n"
          + "    quick_sort(a, 0, n - 1);\n"
          + "    printf(\"quick   :\");\n"
          + "    for (i = 0; i < n; i++) {\n"
          + "        printf(\" %d\", a[i]);\n"
          + "    }\n"
          + "    printf(\"\\n\");\n"
          + "    printf(\"quick comparisons = %d, swaps = %d\\n\", quick_cmp, quick_swaps);\n"
          + "\n"
          + "    for (i = 0; i < n; i++) a[i] = data[i];\n"
          + "    if (merge_sort(a, n) == 0) {\n"
          + "        printf(\"merge   :\");\n"
          + "        for (i = 0; i < n; i++) {\n"
          + "            printf(\" %d\", a[i]);\n"
          + "        }\n"
          + "        printf(\"\\n\");\n"
          + "        printf(\"merge comparisons = %d\\n\", merge_cmp);\n"
          + "    }\n"
          + "    return 0;\n"
          + "}",
        input: "7\n"
          + "9 3 7 1 8 2 6",
        output: "original: 9 3 7 1 8 2 6\n"
          + "quick : 1 2 3 6 7 8 9\n"
          + "quick comparisons = 11, swaps = 10\n"
          + "merge : 1 2 3 6 7 8 9\n"
          + "merge comparisons = 14",
        explain: "这个例子把两个 O(n log n) 排序放在一起跑同一份数据，并数出各自的比较次数。\n"
          + "quick_sort 是「选最后一个元素当基准」的经典写法：i 记录「下一个比基准小的元素该放的位置」，j 扫过整个区间，遇到比基准小的就把它换到 i 并把 i 前移；循环结束后把基准换到 i 上，i 就是基准的最终位置，于是递归区间正好是 [low, i-1] 和 [i+1, high]。quick_cmp 数比较、quick_swaps 数交换。\n"
          + "merge_sort_rec 先把区间对半切开递归排好，再用双指针合并进 temp：谁小取谁，剩下的两段各自用 while 收尾，最后整段拷回 a。为了保证稳定，相等时取左边（a[i] <= a[j]）。\n"
          + "临时数组在包装函数 merge_sort 里只 malloc 一次，递归全程共用，排完立刻 free——这样既避免了每次合并都申请释放，也不会泄漏。malloc 之后必须判 NULL，这是上一模块留下的习惯。\n"
          + "输出里 quick 和 merge 的排序结果当然一样，但比较次数不同：这份数据下快排比较了 11 次、归并比较了 14 次——同一量级、不同常数，这就是最直观的感受。"
      },
      pitfalls: [
        "递归忘记写终止条件（`if (low >= high) return;`）→ 区间不会变小，栈溢出。",
        "划分后递归写成 (low, i) 和 (i+1, high)：i 上的元素已经是最终位置，再包进区间可能原地打转。",
        "归并合并后漏掉 `while (i <= mid)` 或 `while (j <= high)` 收尾，结果里会少几个元素。",
        "在递归函数里 malloc、忘了 free（或在最深层才 free）→ 频繁申请释放甚至内存泄漏；正确做法是申请一次、传进去共用。",
        "归并合并时写成 `a[i] < a[j]` 取左边：相等时先取右边，稳定性被破坏。",
        "以为快排任何情况都是 O(n log n)：对有序数据固定取端点做基准会退化到 O(n²)。"
      ],
      takeaways: [
        "分治三步：分、治、合；快排重在「分」，归并重在「合」",
        "快排平均 O(n log n)、原地、不稳定；基准选不好会退化到 O(n²)",
        "归并稳定且任何情况都是 O(n log n)，代价是需要临时数组",
        "临时数组申请一次、递归共用，结束后 free 并判 NULL",
        "递归函数第一件事是写终止条件"
      ],
      questions: [
        {
          q: "对已经有序的数组做快速排序，每次都取最后一个元素当基准，时间复杂度会变成？",
          options: [
            "O(n log n)，快排总是这个量级",
            "O(n)",
            "O(log n)",
            "O(n²)，每次划分都极不平衡，递归深度变成 n"
          ],
          answer: 3,
          explain: "取端点当基准时，有序数组每次划分都会把区间分成「空」和「n-1」两部分，递归深度变成 n，总代价退化成 O(n²)，D 对。A 错：O(n log n) 是平均情况，前提是划分大致均衡。B、C 都比真实代价乐观，快排不会因为数据有序而变快。"
        },
        {
          q: "归并排序需要额外的临时数组，原因是？",
          options: [
            "递归调用本身需要额外内存",
            "两个有序段合并时需要一个同样大的缓冲区来暂存结果",
            "需要给每个元素建一个链表节点",
            "不需要额外空间，归并也是原地排序"
          ],
          answer: 1,
          explain: "合并两个有序段时必须把结果写到另一块空间再拷回来，否则会覆盖还没比较的元素，B 对。A 错：递归栈的开销是 O(log n)，和临时数组不是一回事。C 错：归并不需要链表。D 错：归并不是原地排序，这正是它相对快排的代价。"
        },
        {
          q: "归并合并两个有序段时，写成 `if (a[i] <= a[j])` 优先取左边，这个 <= 的作用是？",
          options: [
            "保证排序稳定：相等时保持左右两段的原有先后顺序",
            "让比较次数变少",
            "防止数组下标越界",
            "没有作用，写成 < 结果一样"
          ],
          answer: 0,
          explain: "左段的元素原本就在右段前面，相等时先取左边才能保持它们的相对顺序，也就是稳定性，A 对。B 错：<= 和 < 的比较次数一样。C 错：越界由收尾 while 和边界判断保证。D 错：改成 < 之后相等元素会先取右段，稳定性被破坏。"
        }
      ],
      passRatio: 0.8,
      mission: "写一个单文件程序，读入 n 和 n 个整数（例如：\n"
        + "7\n"
        + "9 3 7 1 8 2 6\n"
        + "），分别用快速排序和归并排序各排一遍，输出 2 行：\n"
        + "quick: 1 2 3 6 7 8 9\n"
        + "merge: 1 2 3 6 7 8 9\n"
        + "要求：\n"
        + "1) 定义递归函数 void quick_sort(int *a, int low, int high)：区间里少于两个元素就直接返回；取 a[high] 作基准，把比它小的换到左边，再递归处理左右两个区间；\n"
        + "2) 定义递归函数 void merge_sort_rec(int *a, int *temp, int low, int high)：从中间切成两半分别递归排好，再用双指针合并进 temp，最后整段拷回 a；\n"
        + "3) 临时数组在包装函数 int merge_sort(int *a, int n) 里用 malloc 申请、排完 free，返回值用来表示是否成功；递归函数共用这一块内存；\n"
        + "4) 第二行输出前要把原数组重新拷回去，两行都要输出；\n"
        + "5) 每行格式为 \"quick:\" / \"merge:\" 后跟每个数前加一个空格；\n"
        + "6) 最后 return 0;。",
      starter: "#include <stdio.h>\n"
        + "#include <stdlib.h>\n"
        + "\n"
        + "#define MAXN 100\n"
        + "\n"
        + "/* TODO: quick_sort：区间少于两个元素就返回，然后划分 + 递归 */\n"
        + "\n"
        + "/* TODO: merge_sort_rec：切两半 → 递归 → 双指针合并进 temp → 拷回 a */\n"
        + "\n"
        + "/* TODO: merge_sort：malloc 临时数组、调用 merge_sort_rec、free */\n"
        + "\n"
        + "int main(void) {\n"
        + "    int n = 0, i;\n"
        + "    int data[MAXN], a[MAXN];\n"
        + "\n"
        + "    scanf(\"%d\", &n);\n"
        + "    for (i = 0; i < n; i++) {\n"
        + "        scanf(\"%d\", &data[i]);\n"
        + "    }\n"
        + "\n"
        + "    /* TODO: 拷一份用 quick_sort 排，输出 quick: 这一行 */\n"
        + "\n"
        + "    /* TODO: 重新拷一份用 merge_sort 排，输出 merge: 这一行 */\n"
        + "\n"
        + "    return 0;\n"
        + "}",
      hint: "快排的划分：i 从 low 出发，j 从 low 扫到 high-1，遇到 a[j] < pivot 就交换 a[i] 与 a[j] 并让 i 前移；循环结束后交换 a[i] 与 a[high]，i 就是基准的最终位置，于是递归范围是 [low, i-1] 和 [i+1, high]。归并的合并：i 指左段开头、j 指右段开头，谁小取谁；两段里剩下的元素要各自用 while 收尾，最后把 temp 整段拷回 a。",
      check: {
        include: ["stdio.h","stdlib.h"],
        return0: true,
        calls: [["scanf","%d"],["printf","quick:"],["printf","merge:"]],
        require: {"recursion":["merge_sort_rec"],"funcs":["quick_sort","merge_sort"],"malloc":true,"free":true,"array":true,"loop":true,"if":true},
        minStatements: 14,
        message: "需要 stdlib.h、自己定义的 quick_sort 与 merge_sort、递归的 merge_sort_rec、用 malloc 申请并 free 的临时数组，以及 quick: / merge: 两行输出和 return 0;。",
        ok: "两种分治排序、递归边界与临时数组管理都齐全。"
      },
      expectedOutput: "quick: 1 2 3 6 7 8 9\n"
          + "merge: 1 2 3 6 7 8 9",
      input: "7\n"
          + "9 3 7 1 8 2 6",
      solution: "#include <stdio.h>\n"
          + "#include <stdlib.h>\n"
          + "\n"
          + "#define MAXN 100\n"
          + "\n"
          + "static void swap_int(int *a, int *b) {\n"
          + "    int t = *a;\n"
          + "    *a = *b;\n"
          + "    *b = t;\n"
          + "}\n"
          + "\n"
          + "/* 快速排序：选最后一个元素当基准，小的换左边、大的留右边，再递归处理两半 */\n"
          + "static void quick_sort(int *a, int low, int high) {\n"
          + "    int i, j, pivot;\n"
          + "    if (low >= high) {\n"
          + "        return;\n"
          + "    }\n"
          + "    pivot = a[high];\n"
          + "    i = low;\n"
          + "    for (j = low; j < high; j++) {\n"
          + "        if (a[j] < pivot) {\n"
          + "            swap_int(&a[i], &a[j]);\n"
          + "            i++;\n"
          + "        }\n"
          + "    }\n"
          + "    swap_int(&a[i], &a[high]);\n"
          + "    quick_sort(a, low, i - 1);\n"
          + "    quick_sort(a, i + 1, high);\n"
          + "}\n"
          + "\n"
          + "/* 归并排序的递归部分：左右两半排好后，合并进 temp */\n"
          + "static void merge_sort_rec(int *a, int *temp, int low, int high) {\n"
          + "    int mid, i, j, k;\n"
          + "    if (low >= high) {\n"
          + "        return;\n"
          + "    }\n"
          + "    mid = low + (high - low) / 2;\n"
          + "    merge_sort_rec(a, temp, low, mid);\n"
          + "    merge_sort_rec(a, temp, mid + 1, high);\n"
          + "\n"
          + "    i = low;\n"
          + "    j = mid + 1;\n"
          + "    k = low;\n"
          + "    while (i <= mid && j <= high) {\n"
          + "        if (a[i] <= a[j]) {\n"
          + "            temp[k++] = a[i++];\n"
          + "        } else {\n"
          + "            temp[k++] = a[j++];\n"
          + "        }\n"
          + "    }\n"
          + "    while (i <= mid) {\n"
          + "        temp[k++] = a[i++];\n"
          + "    }\n"
          + "    while (j <= high) {\n"
          + "        temp[k++] = a[j++];\n"
          + "    }\n"
          + "    for (i = low; i <= high; i++) {\n"
          + "        a[i] = temp[i];\n"
          + "    }\n"
          + "}\n"
          + "\n"
          + "/* 临时数组用 malloc 申请，整个排序结束后 free 掉 */\n"
          + "static int merge_sort(int *a, int n) {\n"
          + "    int *temp = malloc(sizeof(int) * (size_t)n);\n"
          + "    if (temp == NULL) {\n"
          + "        return -1;\n"
          + "    }\n"
          + "    merge_sort_rec(a, temp, 0, n - 1);\n"
          + "    free(temp);\n"
          + "    return 0;\n"
          + "}\n"
          + "\n"
          + "int main(void) {\n"
          + "    int n = 0, i;\n"
          + "    int data[MAXN], a[MAXN];\n"
          + "\n"
          + "    scanf(\"%d\", &n);\n"
          + "    for (i = 0; i < n; i++) {\n"
          + "        scanf(\"%d\", &data[i]);\n"
          + "    }\n"
          + "\n"
          + "    for (i = 0; i < n; i++) a[i] = data[i];\n"
          + "    quick_sort(a, 0, n - 1);\n"
          + "    printf(\"quick:\");\n"
          + "    for (i = 0; i < n; i++) {\n"
          + "        printf(\" %d\", a[i]);\n"
          + "    }\n"
          + "    printf(\"\\n\");\n"
          + "\n"
          + "    for (i = 0; i < n; i++) a[i] = data[i];\n"
          + "    if (merge_sort(a, n) == 0) {\n"
          + "        printf(\"merge:\");\n"
          + "        for (i = 0; i < n; i++) {\n"
          + "            printf(\" %d\", a[i]);\n"
          + "        }\n"
          + "        printf(\"\\n\");\n"
          + "    }\n"
          + "    return 0;\n"
          + "}",
      mastery: [
        "能独立写出快排的划分和归并的合并，并说清递归区间怎么取",
        "能解释快排最坏 O(n²) 的成因，以及归并为什么稳定",
        "能在递归场景下正确申请、共用与释放动态内存"
      ]
    },
    {
      id: 68,
      title: "查找：线性查找与二分查找的边界写法",
      minutes: 18,
      gist: "从 O(n) 的线性查找走到 O(log n) 的二分查找，把闭区间的三件套写对。",
      lesson: "查找是在一个数据集合里找某个值。最直接的是线性查找：从头到尾一个个比，找到就返回下标，找完没有就是不存在。它简单、对数据没有任何要求，代价是 O(n)——数据量翻倍，最坏就要多花一倍时间。\n"
        + "数据有序时可以用二分查找：每次拿中间元素和目标比较，比目标小就扔掉左半边，比目标大就扔掉右半边。每轮范围减半，所以最多比较 log₂n 次：一百万条数据也只要 20 次左右。\n"
        + "二分的前提是数据已经有序，这一点没有例外。对无序数组做二分，结果没有任何保证——它可能碰巧找到，也可能漏掉确实存在的元素。\n"
        + "二分最容易写错的是边界。先用一句话定义清楚你维护的区间是什么。如果维护的是「闭区间 [low, high]，目标可能还在里面」，那么三件套是：循环条件 low <= high（区间里还有元素）、中间下标 (low + high) / 2、缩小范围时 low = mid + 1 或 high = mid - 1（mid 已经比过了，不再包含）。如果维护的是左闭右开区间 [low, high)，那循环条件变成 low < high，high 的初值是 n，更新写成 high = mid。两种写法都对，但不能混用——混用正是死循环和漏查的根源。\n"
        + "中间下标建议写成 mid = low + (high - low) / 2，而不是 (low + high) / 2。两者在低地址上结果一样，但当下标接近 int 上限时相加会溢出成负数，导致越界访问；减法写法没有这个问题。\n"
        + "还有一点：C 的整数除法向零取整（正数就是向下取整），所以 mid 永远偏向左边。当区间只剩两个元素时 mid 等于 low，如果更新写成 low = mid 而不是 low = mid + 1，区间不会缩小，程序就死循环了。\n"
        + "最后是返回值约定：用 -1 表示找不到。如果你用 0 表示找不到，就无法区分「没找到」和「下标正好是 0」。\n"
        + "读别人的二分代码时，先确认三件事：区间定义、循环条件、mid 的更新方式，三者必须自洽。",
      example: {
        code: "#include <stdio.h>\n"
          + "\n"
          + "#define MAXN 100\n"
          + "\n"
          + "/* 线性查找：从头一个个比。返回下标，找不到返回 -1，比较次数写回 steps */\n"
          + "static int linear_search(const int *a, int n, int target, int *steps) {\n"
          + "    int i;\n"
          + "    *steps = 0;\n"
          + "    for (i = 0; i < n; i++) {\n"
          + "        (*steps)++;\n"
          + "        if (a[i] == target) {\n"
          + "            return i;\n"
          + "        }\n"
          + "    }\n"
          + "    return -1;\n"
          + "}\n"
          + "\n"
          + "/* 二分查找：low 和 high 是「还有可能存在」的闭区间，每轮砍掉一半 */\n"
          + "static int binary_search(const int *a, int n, int target, int *steps) {\n"
          + "    int low = 0, high = n - 1, mid;\n"
          + "    *steps = 0;\n"
          + "    while (low <= high) {\n"
          + "        mid = low + (high - low) / 2;   /* 不用 (low + high) / 2，避免下标相加溢出 */\n"
          + "        (*steps)++;\n"
          + "        if (a[mid] == target) {\n"
          + "            return mid;\n"
          + "        }\n"
          + "        if (a[mid] < target) {\n"
          + "            low = mid + 1;\n"
          + "        } else {\n"
          + "            high = mid - 1;\n"
          + "        }\n"
          + "    }\n"
          + "    return -1;\n"
          + "}\n"
          + "\n"
          + "static void report(const char *name, int target, int idx, int steps) {\n"
          + "    if (idx >= 0) {\n"
          + "        printf(\"%s: %d found at index %d (%d comparisons)\\n\", name, target, idx, steps);\n"
          + "    } else {\n"
          + "        printf(\"%s: %d not found (%d comparisons)\\n\", name, target, steps);\n"
          + "    }\n"
          + "}\n"
          + "\n"
          + "int main(void) {\n"
          + "    int n = 0, i;\n"
          + "    int a[MAXN];\n"
          + "    int first = 0, second = 0;\n"
          + "    int steps, idx;\n"
          + "\n"
          + "    scanf(\"%d\", &n);\n"
          + "    for (i = 0; i < n; i++) {\n"
          + "        scanf(\"%d\", &a[i]);\n"
          + "    }\n"
          + "    scanf(\"%d %d\", &first, &second);   /* 一个存在的、一个不存在的 */\n"
          + "\n"
          + "    idx = linear_search(a, n, first, &steps);\n"
          + "    report(\"linear\", first, idx, steps);\n"
          + "    idx = binary_search(a, n, first, &steps);\n"
          + "    report(\"binary\", first, idx, steps);\n"
          + "\n"
          + "    idx = linear_search(a, n, second, &steps);\n"
          + "    report(\"linear\", second, idx, steps);\n"
          + "    idx = binary_search(a, n, second, &steps);\n"
          + "    report(\"binary\", second, idx, steps);\n"
          + "    return 0;\n"
          + "}",
        input: "10\n"
          + "1 3 5 7 9 11 13 15 17 19\n"
          + "13 8",
        output: "linear: 13 found at index 6 (7 comparisons)\n"
          + "binary: 13 found at index 6 (4 comparisons)\n"
          + "linear: 8 not found (10 comparisons)\n"
          + "binary: 8 not found (4 comparisons)",
        explain: "这个例子让线性查找和二分查找在同一份数据上各跑两次：一次找一个存在的值（13），一次找一个不存在的值（8），并把比较次数打印出来，好让两种量级的差距看得见。\n"
          + "linear_search 从头一个个比，用一个 int *steps 把比较次数带回给调用方——这是「函数想返回两个值」时常用的办法：返回值给下标记，次数通过指针写回。\n"
          + "binary_search 用的是闭区间写法：low = 0、high = n - 1，while (low <= high) 表示区间里还有元素可比；mid 用 low + (high - low) / 2 算；比完以后 mid 已经被排除，所以是 low = mid + 1 或 high = mid - 1。\n"
          + "report 函数把「找到」和「没找到」两种输出统一起来：找到时打印下标和比较次数，没找到时只打印比较次数。\n"
          + "数据只有 10 个，线性查找最坏要 10 次，二分最多 4 次；数据量越大，这个差距越夸张——一百万条数据是 1000000 次对 20 次。"
      },
      pitfalls: [
        "对无序数组使用二分查找：结果没有任何保证，可能漏掉存在的元素。",
        "闭区间却写 `while (low < high)`：区间只剩一个元素时就退出了，会漏查最后一个元素。",
        "更新写成 `low = mid`（漏了 +1）：区间不缩小，程序死循环——这是二分最常见的 bug。",
        "mid 写成 `(low + high) / 2` 且下标很大时整数溢出，得到负数下标并越界访问。",
        "用 0 表示「没找到」：无法区分「下标 0」和「不存在」，正确做法是返回 -1。"
      ],
      takeaways: [
        "线性查找 O(n)，对数据没有任何要求",
        "二分查找 O(log n)，前提是数据已经有序",
        "闭区间三件套：while (low <= high)、mid = low + (high - low) / 2、low = mid + 1 / high = mid - 1",
        "用 -1 表示没找到，避免和下标 0 混淆",
        "区间定义、循环条件、mid 更新三者必须自洽"
      ],
      questions: [
        {
          q: "二分查找对数据的要求是？",
          options: [
            "数据量必须大于 100",
            "数据必须已经有序",
            "数据必须是整数",
            "必须用链表存储"
          ],
          answer: 1,
          explain: "二分靠「比中间元素就能扔掉一半」这个判断，前提只能是数据有序，B 对。A 错：数据量小也可以用二分，只是优势不明显。C 错：只要能用 < 比较就可以二分，字符串、浮点都行。D 错：链表没法 O(1) 取中间元素，二分在链表上并不划算。"
        },
        {
          q: "闭区间二分里把循环写成 `while (low < high)` 会怎样？",
          options: [
            "结果完全正确，只是略快一点",
            "查找退化成 O(n)",
            "可能漏掉区间里剩下的那个元素，导致存在的数据被判为找不到",
            "编译报错"
          ],
          answer: 2,
          explain: "闭区间里 low == high 时还有一个元素没比较，用 low < high 会直接退出循环，那个元素就被漏掉了，C 对。A 错：这不是「略快」，是结果错误。B 错：循环次数还是 O(log n)，只是漏元素。D 错：这是合法的 C 代码，编译不会报错。"
        },
        {
          q: "在 1000000 条有序数据中做二分查找，最坏大约要比较多少次？",
          options: [
            "1000000 次",
            "500000 次",
            "1000 次",
            "20 次"
          ],
          answer: 3,
          explain: "每比较一次范围减半，2 的 20 次方约等于 100 万，所以最多 20 次左右，D 对。A、B 都是线性查找的量级。C 错：1000 次对应 2 的 1000 次方那么大的数据量，远远超过这里。"
        }
      ],
      passRatio: 0.8,
      mission: "写一个单文件程序，读入 n、n 个已经排好序的整数、以及一个要查找的目标值（例如：\n"
        + "10\n"
        + "1 3 5 7 9 11 13 15 17 19\n"
        + "13\n"
        + "），用二分查找找出目标值的下标，输出 2 行：\n"
        + "target = 13\n"
        + "index = 6\n"
        + "如果目标不存在，第二行改成 not found。\n"
        + "要求：\n"
        + "1) 定义函数 int binary_search(const int *a, int n, int target)：用闭区间写法，循环条件是 low <= high，范围更新用 low = mid + 1 或 high = mid - 1，找不到返回 -1；\n"
        + "2) 中间下标写成 mid = low + (high - low) / 2；\n"
        + "3) main 里用 if (idx >= 0) 区分找到与没找到，分别输出 \"index = 下标\" 和 \"not found\"；\n"
        + "4) 第一行固定输出 \"target = 目标值\"；\n"
        + "5) 最后 return 0;。",
      starter: "#include <stdio.h>\n"
        + "\n"
        + "#define MAXN 100\n"
        + "\n"
        + "/* TODO: 写 binary_search：闭区间写法，找不到返回 -1 */\n"
        + "\n"
        + "int main(void) {\n"
        + "    int n = 0, i;\n"
        + "    int a[MAXN];\n"
        + "    int target = 0;\n"
        + "    int idx;\n"
        + "\n"
        + "    scanf(\"%d\", &n);\n"
        + "    for (i = 0; i < n; i++) {\n"
        + "        scanf(\"%d\", &a[i]);\n"
        + "    }\n"
        + "    scanf(\"%d\", &target);\n"
        + "\n"
        + "    /* TODO: 调用 binary_search 并按结果输出两行 */\n"
        + "\n"
        + "    return 0;\n"
        + "}",
      hint: "闭区间三件套：low 从 0、high 从 n - 1 开始；循环条件 low <= high；缩小范围时 mid 已经比过了，所以是 low = mid + 1 或 high = mid - 1。返回 -1 表示没找到，main 里用 if (idx >= 0) 判断，别用 if (idx) ——那样下标 0 会被当成没找到。",
      check: {
        include: ["stdio.h"],
        return0: true,
        calls: [["scanf","%d"],["printf","target ="],["printf","index ="],["printf","not found"]],
        require: {"funcs":["binary_search"],"while":true,"if":true,"array":true,"loop":true},
        minStatements: 12,
        message: "需要自己定义 binary_search（用 while (low <= high) 的循环）、用数组保存读入的有序数据，并输出 target = 与 index = / not found 两行以及 return 0;。",
        ok: "二分查找的闭区间写法与两种结果输出都正确。"
      },
      expectedOutput: "target = 13\n"
          + "index = 6",
      input: "10\n"
          + "1 3 5 7 9 11 13 15 17 19\n"
          + "13",
      solution: "#include <stdio.h>\n"
          + "\n"
          + "#define MAXN 100\n"
          + "\n"
          + "/* 二分查找：数组必须已经有序。返回下标，找不到返回 -1 */\n"
          + "static int binary_search(const int *a, int n, int target) {\n"
          + "    int low = 0, high = n - 1, mid;\n"
          + "    while (low <= high) {\n"
          + "        mid = low + (high - low) / 2;\n"
          + "        if (a[mid] == target) {\n"
          + "            return mid;\n"
          + "        }\n"
          + "        if (a[mid] < target) {\n"
          + "            low = mid + 1;      /* 目标只可能在右半边 */\n"
          + "        } else {\n"
          + "            high = mid - 1;     /* 目标只可能在左半边 */\n"
          + "        }\n"
          + "    }\n"
          + "    return -1;\n"
          + "}\n"
          + "\n"
          + "int main(void) {\n"
          + "    int n = 0, i;\n"
          + "    int a[MAXN];\n"
          + "    int target = 0;\n"
          + "    int idx;\n"
          + "\n"
          + "    scanf(\"%d\", &n);\n"
          + "    for (i = 0; i < n; i++) {\n"
          + "        scanf(\"%d\", &a[i]);\n"
          + "    }\n"
          + "    scanf(\"%d\", &target);\n"
          + "\n"
          + "    printf(\"target = %d\\n\", target);\n"
          + "    idx = binary_search(a, n, target);\n"
          + "    if (idx >= 0) {\n"
          + "        printf(\"index = %d\\n\", idx);\n"
          + "    } else {\n"
          + "        printf(\"not found\\n\");\n"
          + "    }\n"
          + "    return 0;\n"
          + "}",
      mastery: [
        "能写出闭区间版二分查找，并说清 mid 与边界的更新规则",
        "能解释对无序数组二分为什么会出错",
        "能用返回值约定区分「找到下标 0」与「没找到」"
      ]
    },
    {
      id: 69,
      title: "链表进阶：双向链表与快慢指针判环",
      minutes: 22,
      gist: "给节点加上 prev 指针换来双向遍历，再用快慢指针 O(1) 空间判断链表有没有环。",
      lesson: "单链表的每个节点只知道下一个节点在哪。需要「往回走」的时候（删除一个已知节点、从尾到头遍历），单链表就无能为力，于是有了双向链表：每个节点多一个 prev 指针，指向前一个节点。\n"
        + "struct Node { int value; struct Node *prev; struct Node *next; };\n"
        + "有了 prev，从任意节点都能朝两个方向走；代价是每个节点多一个指针的空间，而且每次改链都要维护两条边。尾插时两条边都要接上：原来的尾节点 tail->next = p，新节点的 p->prev = tail。头插同理。别忘了头节点的 prev 要置成 NULL——「链表的尽头」永远是 NULL，这句话对两个方向都成立。\n"
        + "快慢指针是链表上最好用的技巧：两个指针都从头出发，慢指针每次走一步，快指针每次走两步。没有环时快指针会先撞上 NULL；有环时快指针进环之后每轮比慢指针多走一步，最终一定追上慢指针（判断的是「相等」）。于是「链表有没有环」这件事可以在 O(n) 时间和 O(1) 额外空间内解决。\n"
        + "同样的套路还能找中间节点：快指针走到末尾时，慢指针正好在中间。也可以用「快指针先走 k 步」来找倒数第 k 个节点。\n"
        + "释放带环的链表要特别小心：沿着 next 走会永远走不完，必须先拆环（把造成环的那条边改回 NULL），再 free。所以安全流程是「先判环 → 再拆环 → 最后释放」。\n"
        + "循环条件建议写成 while (fast != NULL && fast->next != NULL)：先检查 fast 本身，再检查 fast->next，因为循环体里要读 fast->next->next。两个条件顺序反过来，fast 已经是 NULL 时读 fast->next 就是空指针解引用。\n"
        + "读别人的链表代码时，注意三件事：改链时两条边是否都维护了、循环条件有没有先判空、释放前有没有处理环和 prev。",
      example: {
        code: "#include <stdio.h>\n"
          + "#include <stdlib.h>\n"
          + "\n"
          + "struct Node {\n"
          + "    int value;\n"
          + "    struct Node *prev;\n"
          + "    struct Node *next;\n"
          + "};\n"
          + "\n"
          + "static struct Node *create_node(int value) {\n"
          + "    struct Node *p = malloc(sizeof(struct Node));\n"
          + "    if (p == NULL) {\n"
          + "        return NULL;\n"
          + "    }\n"
          + "    p->value = value;\n"
          + "    p->prev = NULL;\n"
          + "    p->next = NULL;\n"
          + "    return p;\n"
          + "}\n"
          + "\n"
          + "/* 尾插：链表为空时，返回的新节点就是头节点 */\n"
          + "static struct Node *append(struct Node *tail, int value) {\n"
          + "    struct Node *p = create_node(value);\n"
          + "    if (p == NULL) {\n"
          + "        return tail;\n"
          + "    }\n"
          + "    if (tail != NULL) {\n"
          + "        tail->next = p;\n"
          + "        p->prev = tail;\n"
          + "    }\n"
          + "    return p;\n"
          + "}\n"
          + "\n"
          + "static void print_forward(const struct Node *head) {\n"
          + "    const struct Node *p;\n"
          + "    printf(\"forward :\");\n"
          + "    for (p = head; p != NULL; p = p->next) {\n"
          + "        printf(\" %d\", p->value);\n"
          + "    }\n"
          + "    printf(\"\\n\");\n"
          + "}\n"
          + "\n"
          + "static void print_backward(const struct Node *tail) {\n"
          + "    const struct Node *p;\n"
          + "    printf(\"backward:\");\n"
          + "    for (p = tail; p != NULL; p = p->prev) {\n"
          + "        printf(\" %d\", p->value);\n"
          + "    }\n"
          + "    printf(\"\\n\");\n"
          + "}\n"
          + "\n"
          + "/* 快慢指针：快的每次走两步、慢的每次走一步；有环时快的必定在环里追上慢的 */\n"
          + "static int has_cycle(const struct Node *head) {\n"
          + "    const struct Node *slow = head;\n"
          + "    const struct Node *fast = head;\n"
          + "    while (fast != NULL && fast->next != NULL) {\n"
          + "        slow = slow->next;\n"
          + "        fast = fast->next->next;\n"
          + "        if (slow == fast) {\n"
          + "            return 1;\n"
          + "        }\n"
          + "    }\n"
          + "    return 0;\n"
          + "}\n"
          + "\n"
          + "static int free_list(struct Node *head) {\n"
          + "    int count = 0;\n"
          + "    struct Node *p = head;\n"
          + "    while (p != NULL) {\n"
          + "        struct Node *next = p->next;\n"
          + "        free(p);\n"
          + "        p = next;\n"
          + "        count++;\n"
          + "    }\n"
          + "    return count;\n"
          + "}\n"
          + "\n"
          + "int main(void) {\n"
          + "    struct Node *head = NULL;\n"
          + "    struct Node *tail = NULL;\n"
          + "    struct Node *p;\n"
          + "\n"
          + "    tail = append(tail, 10);\n"
          + "    head = tail;\n"
          + "    tail = append(tail, 20);\n"
          + "    tail = append(tail, 30);\n"
          + "\n"
          + "    print_forward(head);\n"
          + "    print_backward(tail);\n"
          + "    printf(\"has_cycle before: %d\\n\", has_cycle(head));\n"
          + "\n"
          + "    /* 人为造一个环：尾节点的 next 指回第二个节点 */\n"
          + "    p = head->next;\n"
          + "    tail->next = p;\n"
          + "    p->prev = tail;\n"
          + "    printf(\"has_cycle after : %d\\n\", has_cycle(head));\n"
          + "\n"
          + "    /* 必须先拆环，否则 free 会沿着环一直转下去 */\n"
          + "    tail->next = NULL;\n"
          + "    head->next->prev = head;\n"
          + "\n"
          + "    printf(\"nodes = %d\\n\", free_list(head));\n"
          + "    return 0;\n"
          + "}",
        output: "forward : 10 20 30\n"
          + "backward: 30 20 10\n"
          + "has_cycle before: 0\n"
          + "has_cycle after : 1\n"
          + "nodes = 3",
        explain: "这个例子手工建了一条 10 → 20 → 30 的双向链表，把双向链表的两个方向都走了一遍。\n"
          + "append 是尾插：create_node 建好节点后，把 tail->next 指向新节点、新节点的 prev 指回 tail，然后返回新的尾节点。main 里第一次调用后把 head = tail，头节点就定下来了。\n"
          + "print_forward 沿着 next 走，print_backward 沿着 prev 从尾走到头，两条路线输出的顺序正好相反。\n"
          + "has_cycle 是快慢指针：slow 每次一步、fast 每次两步。造环之前 fast 会先撞到 NULL，返回 0；执行 tail->next = p（p 是第二个节点）之后链表成了环，fast 会在环里追上 slow，返回 1。\n"
          + "最后两行是关键习惯：先 tail->next = NULL 和 head->next->prev = head 把环拆掉、把 prev 恢复，再调用 free_list——如果带着环直接释放，while (p != NULL) 会绕着环一直转下去。free_list 顺便数出释放了几个节点。\n"
          + "示例只用 3 个写死的节点，是为了让指针的改动一眼能看清；任务里要把这段流程写成「读入 n 个数 → 建表 → 造环判环 → 拆环释放」。"
      },
      pitfalls: [
        "尾插只接了一条边（忘了 p->prev = tail）→ 反向遍历到这一节点就断了。",
        "头节点的 prev 没有置 NULL → 反向遍历时读到未初始化的指针，程序崩溃。",
        "循环条件写成 `while (fast->next != NULL && fast != NULL)`：顺序反了，fast 为 NULL 时先解引用 fast->next，空指针崩溃。",
        "带着环直接 free → 释放循环永远走不完，程序卡死。",
        "删除节点时先 free 再改前驱后继的指针 → 用到了已经释放的内存，行为未定义。"
      ],
      takeaways: [
        "双向链表每个节点多一个 prev，换来两个方向的遍历能力",
        "改链要同时维护 prev 和 next 两条边，尽头永远是 NULL",
        "快慢指针判环：O(n) 时间、O(1) 额外空间",
        "释放带环链表必须先拆环，再 free",
        "循环条件先判 fast 再判 fast->next，避免空指针解引用"
      ],
      questions: [
        {
          q: "用快慢指针判断链表是否有环，慢指针一次一步、快指针一次两步，结论是？",
          options: [
            "有环时快指针一定会在环里追上慢指针（两者相等）",
            "有环时快指针会一次次跳过慢指针，永远追不上",
            "有环时慢指针会先走到 NULL",
            "必须再用一个数组记录访问过的节点才能判断"
          ],
          answer: 0,
          explain: "快指针进环后每轮比慢指针多走一步，两者距离每轮缩小 1，最终一定相等，A 对。B 错：「追上」判断的是指针相等，速度差 1 不会跳过。C 错：有环时两个指针都不会走到 NULL，这正是判环的依据。D 错：那需要 O(n) 额外空间，快慢指针不需要。"
        },
        {
          q: "释放一条带环的链表之前，必须先做什么？",
          options: [
            "先拆环：把形成环的那条边改回 NULL",
            "把每个节点的 value 清零",
            "把所有 prev 指针置成 NULL",
            "什么都不用做，free 会自动处理环"
          ],
          answer: 0,
          explain: "释放循环靠「下一个是 NULL」结束，带着环走就永远停不下来，所以必须先断开形成环的那条边，A 对。B、C 都改变不了「沿着 next 走不完」这个事实。D 错：free 只释放你交给它的那一个节点，不会替你分析链表结构。"
        },
        {
          q: "`while (fast->next != NULL && fast != NULL)` 这种写法的问题是什么？",
          options: [
            "语法错误，编译不过",
            "会多走一步，结果偏一位",
            "左边先读 fast->next，当 fast 已经是 NULL 时会解引用空指针",
            "没有环时会提前退出"
          ],
          answer: 2,
          explain: "&& 从左往右求值，第一个条件就访问 fast->next，而 fast 可能已经是 NULL，这就是空指针解引用，C 对。正确写法是先判 fast：while (fast != NULL && fast->next != NULL)。A 错：语法完全合法，编译器不会报错，问题在运行期。B、D 都不是这种写法会产生的结果。"
        }
      ],
      passRatio: 0.8,
      mission: "写一个单文件程序，读入 n 和 n 个整数，用 malloc 建一条双向链表，输出 4 行（以输入 4 与 1 2 3 4 为例）：\n"
        + "forward : 1 2 3 4\n"
        + "backward: 4 3 2 1\n"
        + "cycle: yes\n"
        + "freed: 4\n"
        + "要求：\n"
        + "1) 定义 struct Node { int value; struct Node *prev; struct Node *next; }，尾插时同时维护 prev 和 next 两条边；\n"
        + "2) 写函数 void print_forward(const struct Node *head) 与 void print_backward(const struct Node *tail) 分别正序、逆序输出，格式为 \"forward :\" / \"backward:\" 后跟每个数前加一个空格；\n"
        + "3) 定义函数 int has_cycle(const struct Node *head)：快慢指针，有环返回 1，无环返回 0；\n"
        + "4) 造环：如果节点数不小于 2，把尾节点的 next 指向第二个节点、第二个节点的 prev 指向尾节点，然后输出 \"cycle: yes\"（没造环就输出 \"cycle: no\"）；\n"
        + "5) 拆环：把上面那两条边改回 NULL 与原来的值，再 free 所有节点并数出个数，输出 \"freed: 个数\"；\n"
        + "6) 最后 return 0;。",
      starter: "#include <stdio.h>\n"
        + "#include <stdlib.h>\n"
        + "\n"
        + "struct Node {\n"
        + "    int value;\n"
        + "    struct Node *prev;\n"
        + "    struct Node *next;\n"
        + "};\n"
        + "\n"
        + "/* TODO: create_node：malloc 一个节点，prev / next 置 NULL */\n"
        + "\n"
        + "/* TODO: append：尾插，两条边都要接上 */\n"
        + "\n"
        + "/* TODO: print_forward / print_backward */\n"
        + "\n"
        + "/* TODO: has_cycle：快慢指针 */\n"
        + "\n"
        + "/* TODO: free_list：释放并返回节点个数 */\n"
        + "\n"
        + "int main(void) {\n"
        + "    struct Node *head = NULL;\n"
        + "    struct Node *tail = NULL;\n"
        + "    int n = 0, i, value = 0;\n"
        + "\n"
        + "    scanf(\"%d\", &n);\n"
        + "    for (i = 0; i < n; i++) {\n"
        + "        scanf(\"%d\", &value);\n"
        + "        /* TODO: 尾插，第一个节点要同时记为 head */\n"
        + "    }\n"
        + "\n"
        + "    /* TODO: 正序、逆序输出 */\n"
        + "\n"
        + "    /* TODO: 造环 → 输出 cycle: yes/no → 拆环 → 释放并输出 freed: 个数 */\n"
        + "\n"
        + "    return 0;\n"
        + "}",
      hint: "快慢指针的循环条件写成 while (fast != NULL && fast->next != NULL)，循环体里先让 slow = slow->next、再让 fast = fast->next->next，然后比较两者是否相等。释放前一定先把 tail->next = NULL 和 head->next->prev = head 做掉，否则 while (p != NULL) 会绕着环转不停。",
      check: {
        include: ["stdio.h","stdlib.h"],
        return0: true,
        seq: [["print_forward","("],["print_backward","("]],
        calls: [["scanf","%d"],["printf","cycle"],["printf","freed"]],
        require: {"struct":"Node","malloc":true,"free":true,"pointer":true,"loop":true,"funcs":["print_forward","print_backward","has_cycle"]},
        minStatements: 14,
        message: "需要 stdlib.h、struct Node（含 prev 与 next）、malloc/free、自己定义的 print_forward / print_backward / has_cycle，在 main 里调用这两个打印函数，并输出 cycle 与 freed 两行以及 return 0;。",
        ok: "双向链表、快慢指针判环与安全释放都做到位了。"
      },
      expectedOutput: "forward : 1 2 3 4\n"
          + "backward: 4 3 2 1\n"
          + "cycle: yes\n"
          + "freed: 4",
      input: "4\n"
          + "1 2 3 4",
      solution: "#include <stdio.h>\n"
          + "#include <stdlib.h>\n"
          + "\n"
          + "struct Node {\n"
          + "    int value;\n"
          + "    struct Node *prev;\n"
          + "    struct Node *next;\n"
          + "};\n"
          + "\n"
          + "static struct Node *create_node(int value) {\n"
          + "    struct Node *p = malloc(sizeof(struct Node));\n"
          + "    if (p == NULL) {\n"
          + "        return NULL;\n"
          + "    }\n"
          + "    p->value = value;\n"
          + "    p->prev = NULL;\n"
          + "    p->next = NULL;\n"
          + "    return p;\n"
          + "}\n"
          + "\n"
          + "/* 尾插：p->prev 指向原来的尾节点，原来的尾节点 next 指向 p */\n"
          + "static struct Node *append(struct Node *tail, int value) {\n"
          + "    struct Node *p = create_node(value);\n"
          + "    if (p == NULL) {\n"
          + "        return tail;\n"
          + "    }\n"
          + "    if (tail != NULL) {\n"
          + "        tail->next = p;\n"
          + "        p->prev = tail;\n"
          + "    }\n"
          + "    return p;\n"
          + "}\n"
          + "\n"
          + "static void print_forward(const struct Node *head) {\n"
          + "    const struct Node *p;\n"
          + "    printf(\"forward :\");\n"
          + "    for (p = head; p != NULL; p = p->next) {\n"
          + "        printf(\" %d\", p->value);\n"
          + "    }\n"
          + "    printf(\"\\n\");\n"
          + "}\n"
          + "\n"
          + "static void print_backward(const struct Node *tail) {\n"
          + "    const struct Node *p;\n"
          + "    printf(\"backward:\");\n"
          + "    for (p = tail; p != NULL; p = p->prev) {\n"
          + "        printf(\" %d\", p->value);\n"
          + "    }\n"
          + "    printf(\"\\n\");\n"
          + "}\n"
          + "\n"
          + "/* 快慢指针判环：两个指针都从头出发，快的走两步、慢的走一步 */\n"
          + "static int has_cycle(const struct Node *head) {\n"
          + "    const struct Node *slow = head;\n"
          + "    const struct Node *fast = head;\n"
          + "    while (fast != NULL && fast->next != NULL) {\n"
          + "        slow = slow->next;\n"
          + "        fast = fast->next->next;\n"
          + "        if (slow == fast) {\n"
          + "            return 1;\n"
          + "        }\n"
          + "    }\n"
          + "    return 0;\n"
          + "}\n"
          + "\n"
          + "/* 释放并数一数一共放了几个节点 */\n"
          + "static int free_list(struct Node *head) {\n"
          + "    int count = 0;\n"
          + "    struct Node *p = head;\n"
          + "    while (p != NULL) {\n"
          + "        struct Node *next = p->next;\n"
          + "        free(p);\n"
          + "        p = next;\n"
          + "        count++;\n"
          + "    }\n"
          + "    return count;\n"
          + "}\n"
          + "\n"
          + "int main(void) {\n"
          + "    struct Node *head = NULL;\n"
          + "    struct Node *tail = NULL;\n"
          + "    struct Node *p;\n"
          + "    int n = 0, i, value = 0;\n"
          + "\n"
          + "    scanf(\"%d\", &n);\n"
          + "    for (i = 0; i < n; i++) {\n"
          + "        scanf(\"%d\", &value);\n"
          + "        tail = append(tail, value);\n"
          + "        if (head == NULL) {\n"
          + "            head = tail;\n"
          + "        }\n"
          + "    }\n"
          + "\n"
          + "    print_forward(head);\n"
          + "    print_backward(tail);\n"
          + "\n"
          + "    /* 造环：尾节点的 next 指回第二个节点 */\n"
          + "    if (head != NULL && head->next != NULL) {\n"
          + "        p = head->next;\n"
          + "        tail->next = p;\n"
          + "        p->prev = tail;\n"
          + "    }\n"
          + "    printf(\"cycle: %s\\n\", has_cycle(head) ? \"yes\" : \"no\");\n"
          + "\n"
          + "    /* 拆环之后才能安全释放，否则会绕着环转不停 */\n"
          + "    if (head != NULL && head->next != NULL) {\n"
          + "        tail->next = NULL;\n"
          + "        head->next->prev = head;\n"
          + "    }\n"
          + "    printf(\"freed: %d\\n\", free_list(head));\n"
          + "    return 0;\n"
          + "}",
      mastery: [
        "能写出双向链表的尾插与两个方向的遍历，并说清两条边怎么维护",
        "能用快慢指针判断环，并解释为什么快指针一定会追上慢指针",
        "能按「判环 → 拆环 → 释放」的顺序安全销毁带环链表"
      ]
    },
    {
      id: 70,
      title: "二叉树与遍历：前序、中序、后序与层序",
      minutes: 22,
      gist: "用递归写三种深度优先遍历，用队列写层序遍历，并看懂完全二叉树的下标关系。",
      lesson: "树是一层一层分叉的结构，每个节点最多有两个孩子的叫二叉树。几个术语先记住：最上面那个没有父节点的叫根；没有孩子的叫叶子；树的高度按「根的高度是 1、空树高度是 0」来算。\n"
        + "存储上，每个节点存三样东西：值、左孩子指针、右孩子指针，没有孩子就存 NULL。树是递归定义的——每个节点的左孩子、右孩子本身又是一棵树，所以「用递归处理树」是最自然的写法：函数处理根，再把左右子树交给同一个函数。\n"
        + "遍历就是按某个约定访问每个节点一次。三种深度优先遍历的区别只在「根什么时候被访问」：\n"
        + "前序：根 → 左 → 右\n"
        + "中序：左 → 根 → 右\n"
        + "后序：左 → 右 → 根\n"
        + "三种写法的骨架完全一样，只是打印那一行的位置不同。记忆方法是看「根」在哪：名字里的前、中、后就是根的位置。后序遍历常用来释放整棵树，因为必须先释放完两个孩子，才能释放父节点。\n"
        + "层序遍历（广度优先）要一层一层从左到右访问，必须借助队列：根入队，然后反复「取出队头、访问它、把它的左右孩子依次入队」。用一个数组加两个下标 front、rear 就能当队列用，不需要额外申请内存。递归在这里帮不上忙，因为递归天然是「一条路走到黑」。\n"
        + "完全二叉树有一个非常有用的性质：如果按下标从 0 开始一层一层编号，那么下标 i 的左孩子是 2i+1、右孩子是 2i+2，父节点是 (i-1)/2。所以完全二叉树可以直接用数组建，不必用指针——这也是「堆」这种结构的基础。\n"
        + "读别人的遍历代码时，先找出「访问节点」那一步在哪，就能立刻判断是哪种遍历。",
      example: {
        code: "#include <stdio.h>\n"
          + "#include <stdlib.h>\n"
          + "\n"
          + "#define MAXN 64\n"
          + "\n"
          + "struct Node {\n"
          + "    int value;\n"
          + "    struct Node *left;\n"
          + "    struct Node *right;\n"
          + "};\n"
          + "\n"
          + "static struct Node *create_node(int value) {\n"
          + "    struct Node *p = malloc(sizeof(struct Node));\n"
          + "    if (p == NULL) {\n"
          + "        return NULL;\n"
          + "    }\n"
          + "    p->value = value;\n"
          + "    p->left = NULL;\n"
          + "    p->right = NULL;\n"
          + "    return p;\n"
          + "}\n"
          + "\n"
          + "/* 按下标建完全二叉树：下标 i 的左孩子是 2i+1，右孩子是 2i+2 */\n"
          + "static struct Node *build_complete(const int *values, int n, int index) {\n"
          + "    struct Node *p;\n"
          + "    if (index >= n) {\n"
          + "        return NULL;\n"
          + "    }\n"
          + "    p = create_node(values[index]);\n"
          + "    if (p == NULL) {\n"
          + "        return NULL;\n"
          + "    }\n"
          + "    p->left = build_complete(values, n, 2 * index + 1);\n"
          + "    p->right = build_complete(values, n, 2 * index + 2);\n"
          + "    return p;\n"
          + "}\n"
          + "\n"
          + "/* 前序：根 → 左 → 右 */\n"
          + "static void preorder(const struct Node *root) {\n"
          + "    if (root == NULL) {\n"
          + "        return;\n"
          + "    }\n"
          + "    printf(\" %d\", root->value);\n"
          + "    preorder(root->left);\n"
          + "    preorder(root->right);\n"
          + "}\n"
          + "\n"
          + "/* 中序：左 → 根 → 右 */\n"
          + "static void inorder(const struct Node *root) {\n"
          + "    if (root == NULL) {\n"
          + "        return;\n"
          + "    }\n"
          + "    inorder(root->left);\n"
          + "    printf(\" %d\", root->value);\n"
          + "    inorder(root->right);\n"
          + "}\n"
          + "\n"
          + "/* 后序：左 → 右 → 根 */\n"
          + "static void postorder(const struct Node *root) {\n"
          + "    if (root == NULL) {\n"
          + "        return;\n"
          + "    }\n"
          + "    postorder(root->left);\n"
          + "    postorder(root->right);\n"
          + "    printf(\" %d\", root->value);\n"
          + "}\n"
          + "\n"
          + "/* 层序：用数组当队列，front 是队头、rear 是下一个空位 */\n"
          + "static void level_order(const struct Node *root) {\n"
          + "    const struct Node *queue[MAXN];\n"
          + "    int front = 0, rear = 0;\n"
          + "    if (root == NULL) {\n"
          + "        return;\n"
          + "    }\n"
          + "    queue[rear++] = root;\n"
          + "    while (front < rear) {\n"
          + "        const struct Node *p = queue[front++];\n"
          + "        printf(\" %d\", p->value);\n"
          + "        if (p->left != NULL) {\n"
          + "            queue[rear++] = p->left;\n"
          + "        }\n"
          + "        if (p->right != NULL) {\n"
          + "            queue[rear++] = p->right;\n"
          + "        }\n"
          + "    }\n"
          + "}\n"
          + "\n"
          + "static int count_nodes(const struct Node *root) {\n"
          + "    if (root == NULL) {\n"
          + "        return 0;\n"
          + "    }\n"
          + "    return 1 + count_nodes(root->left) + count_nodes(root->right);\n"
          + "}\n"
          + "\n"
          + "static int height(const struct Node *root) {\n"
          + "    int left_h, right_h;\n"
          + "    if (root == NULL) {\n"
          + "        return 0;\n"
          + "    }\n"
          + "    left_h = height(root->left);\n"
          + "    right_h = height(root->right);\n"
          + "    return (left_h > right_h ? left_h : right_h) + 1;\n"
          + "}\n"
          + "\n"
          + "static void free_tree(struct Node *root) {\n"
          + "    if (root == NULL) {\n"
          + "        return;\n"
          + "    }\n"
          + "    free_tree(root->left);\n"
          + "    free_tree(root->right);\n"
          + "    free(root);\n"
          + "}\n"
          + "\n"
          + "int main(void) {\n"
          + "    int n = 0, i;\n"
          + "    int values[MAXN];\n"
          + "    struct Node *root;\n"
          + "\n"
          + "    scanf(\"%d\", &n);\n"
          + "    for (i = 0; i < n; i++) {\n"
          + "        scanf(\"%d\", &values[i]);\n"
          + "    }\n"
          + "\n"
          + "    root = build_complete(values, n, 0);\n"
          + "\n"
          + "    printf(\"preorder :\");\n"
          + "    preorder(root);\n"
          + "    printf(\"\\n\");\n"
          + "\n"
          + "    printf(\"inorder  :\");\n"
          + "    inorder(root);\n"
          + "    printf(\"\\n\");\n"
          + "\n"
          + "    printf(\"postorder:\");\n"
          + "    postorder(root);\n"
          + "    printf(\"\\n\");\n"
          + "\n"
          + "    printf(\"level    :\");\n"
          + "    level_order(root);\n"
          + "    printf(\"\\n\");\n"
          + "\n"
          + "    printf(\"nodes = %d, height = %d\\n\", count_nodes(root), height(root));\n"
          + "\n"
          + "    free_tree(root);\n"
          + "    return 0;\n"
          + "}",
        input: "6\n"
          + "1 2 3 4 5 6",
        output: "preorder : 1 2 4 5 3 6\n"
          + "inorder : 4 2 5 1 6 3\n"
          + "postorder: 4 5 2 6 3 1\n"
          + "level : 1 2 3 4 5 6\n"
          + "nodes = 6, height = 3",
        explain: "这个例子用 6 个值 {1,2,3,4,5,6} 建了一棵完全二叉树：build_complete 按「下标 i 的左孩子是 2i+1、右孩子是 2i+2」递归建树，index 越界就返回 NULL，这个判断就是递归的终止条件。\n"
          + "建出来的树是：根 1，左孩子 2（它的孩子是 4、5），右孩子 3（它的孩子是 6）。\n"
          + "preorder / inorder / postorder 三个函数的代码几乎一样，区别只有 printf 的位置：前序先打印根再递归左右，中序先递归左子树再打印根，后序先递归左右最后打印根。对照输出可以验证：\n"
          + "- 前序 1 2 4 5 3 6（根最先）\n"
          + "- 中序 4 2 5 1 6 3（根在中间：左子树 4 2 5，然后根 1，再右子树 6 3）\n"
          + "- 后序 4 5 2 6 3 1（根在最后）\n"
          + "level_order 用数组当队列：根先入队，然后循环「队头出队并打印，左右孩子依次入队」，于是输出正好是 1 2 3 4 5 6，一层一层往下。\n"
          + "最后两行是树的两个统计量：count_nodes 数节点总数，height 取左右子树高度的较大值加一。free_tree 用的是后序思路——先释放左右子树，再释放自己。"
      },
      pitfalls: [
        "把中序和前序弄混：只记「根在前 / 中 / 后」这句话，不要靠背代码顺序。",
        "层序遍历不用队列，写成递归 → 访问顺序变成了深度优先。",
        "释放整棵树用前序（先 free 根）→ 之后还要读孩子的指针，用到了已释放的内存；正确做法是后序。",
        "建树递归忘了写 `index >= n` 的终止条件 → 数组越界访问。",
        "以为树的高度等于节点个数：6 个节点的完全二叉树高度是 3。"
      ],
      takeaways: [
        "遍历名字由「根被访问的时机」决定：前序、中序、后序",
        "三种递归遍历骨架相同，只有访问根的位置不同",
        "层序遍历要队列：出队一个，把左右孩子依次入队",
        "完全二叉树用下标 2i+1 / 2i+2 找孩子，可以不用指针",
        "释放整棵树用后序：先孩子后父节点"
      ],
      questions: [
        {
          q: "中序遍历的访问顺序是？",
          options: [
            "根 → 左 → 右",
            "左 → 根 → 右",
            "左 → 右 → 根",
            "一层一层从左到右"
          ],
          answer: 1,
          explain: "中序的「中」指根在中间：先递归左子树，再访问根，最后递归右子树，B 对。A 是前序、C 是后序、D 是层序。记法就是看名字里根的位置。"
        },
        {
          q: "层序遍历需要借助什么？",
          options: [
            "栈",
            "递归调用",
            "队列（先进先出）",
            "什么都不用，按数组顺序打印即可"
          ],
          answer: 2,
          explain: "层序要求先访问到的节点先展开它的孩子，正好是先进先出，用队列实现，C 对。A 错：栈是后进先出，那是深度优先。B 错：递归天然深度优先，做不到一层一层。D 错：数组顺序不等于树的层序，节点的孩子位置取决于建树方式。"
        },
        {
          q: "完全二叉树按从 0 开始的下标编号，下标 i 的左孩子下标是？",
          options: [
            "2i",
            "i + 1",
            "2i + 2",
            "2i + 1"
          ],
          answer: 3,
          explain: "0 号是根，1、2 号是它的左右孩子，所以左孩子是 2i+1、右孩子是 2i+2，D 对。A 在 i = 0 时会得到 0，指向自己，明显不对。C 是右孩子的公式。B 是「下一个节点」，和父子关系无关。"
        }
      ],
      passRatio: 0.8,
      mission: "写一个单文件程序，读入 n 和 n 个整数，按层序顺序建一棵完全二叉树（下标 i 的左孩子是 2i+1、右孩子是 2i+2），输出 4 行（以输入 6 与 1 2 3 4 5 6 为例）：\n"
        + "preorder : 1 2 4 5 3 6\n"
        + "inorder  : 4 2 5 1 6 3\n"
        + "postorder: 4 5 2 6 3 1\n"
        + "level    : 1 2 3 4 5 6\n"
        + "要求：\n"
        + "1) 定义 struct Node { int value; struct Node *left; struct Node *right; }，节点用 malloc 申请，malloc 要判 NULL；\n"
        + "2) 写递归函数 preorder / inorder / postorder（函数内部调用自己），分别按根左右、左根右、左右根输出；\n"
        + "3) 层序用数组当队列：根入队，然后反复「取出队头输出、把左右孩子依次入队」；\n"
        + "4) 每行的格式是标签后跟每个数前加一个空格（标签依次为 \"preorder :\"、\"inorder  :\"、\"postorder:\"、\"level    :\"）；\n"
        + "5) 结束前按后序思路 free 掉整棵树（先释放孩子再释放父节点）；\n"
        + "6) 最后 return 0;。",
      starter: "#include <stdio.h>\n"
        + "#include <stdlib.h>\n"
        + "\n"
        + "#define MAXN 64\n"
        + "\n"
        + "struct Node {\n"
        + "    int value;\n"
        + "    struct Node *left;\n"
        + "    struct Node *right;\n"
        + "};\n"
        + "\n"
        + "/* TODO: create_node：malloc + 判 NULL */\n"
        + "\n"
        + "/* TODO: build_complete(values, n, index)：下标越界返回 NULL */\n"
        + "\n"
        + "/* TODO: preorder / inorder / postorder */\n"
        + "\n"
        + "/* TODO: level_order：数组当队列 */\n"
        + "\n"
        + "/* TODO: free_tree：后序释放 */\n"
        + "\n"
        + "int main(void) {\n"
        + "    int n = 0, i;\n"
        + "    int values[MAXN];\n"
        + "    struct Node *root;\n"
        + "\n"
        + "    scanf(\"%d\", &n);\n"
        + "    for (i = 0; i < n; i++) {\n"
        + "        scanf(\"%d\", &values[i]);\n"
        + "    }\n"
        + "\n"
        + "    /* TODO: 建树并输出四行遍历结果 */\n"
        + "\n"
        + "    return 0;\n"
        + "}",
      hint: "三个递归遍历只有 printf 的位置不同：前序在两次递归前打印，中序在两次递归中间打印，后序在两次递归后打印。层序用一个 const struct Node *queue[MAXN] 加 front、rear 两个下标：根入队后 while (front < rear) 不断出队，出队时把左右孩子（非 NULL 的）入队。free_tree 要先 free_tree(root->left) 再 free_tree(root->right)，最后才 free(root)。",
      check: {
        include: ["stdio.h","stdlib.h"],
        return0: true,
        calls: [["scanf","%d"],["printf","preorder"],["printf","inorder"],["printf","postorder"],["printf","level"]],
        require: {"struct":"Node","malloc":true,"free":true,"recursion":["preorder"],"array":true,"loop":true,"if":true},
        minStatements: 14,
        message: "需要 stdlib.h、struct Node、malloc/free、递归的 preorder（inorder / postorder 同理）、数组队列实现的层序遍历，以及四行遍历输出和 return 0;。",
        ok: "三种递归遍历与队列层序遍历都齐全，建树与释放也正确。"
      },
      expectedOutput: "preorder : 1 2 4 5 3 6\n"
          + "inorder : 4 2 5 1 6 3\n"
          + "postorder: 4 5 2 6 3 1\n"
          + "level : 1 2 3 4 5 6",
      input: "6\n"
          + "1 2 3 4 5 6",
      solution: "#include <stdio.h>\n"
          + "#include <stdlib.h>\n"
          + "\n"
          + "#define MAXN 64\n"
          + "\n"
          + "struct Node {\n"
          + "    int value;\n"
          + "    struct Node *left;\n"
          + "    struct Node *right;\n"
          + "};\n"
          + "\n"
          + "static struct Node *create_node(int value) {\n"
          + "    struct Node *p = malloc(sizeof(struct Node));\n"
          + "    if (p == NULL) {\n"
          + "        return NULL;\n"
          + "    }\n"
          + "    p->value = value;\n"
          + "    p->left = NULL;\n"
          + "    p->right = NULL;\n"
          + "    return p;\n"
          + "}\n"
          + "\n"
          + "/* 按下标建完全二叉树：下标 i 的左孩子是 2i+1，右孩子是 2i+2 */\n"
          + "static struct Node *build_complete(const int *values, int n, int index) {\n"
          + "    struct Node *p;\n"
          + "    if (index >= n) {\n"
          + "        return NULL;\n"
          + "    }\n"
          + "    p = create_node(values[index]);\n"
          + "    if (p == NULL) {\n"
          + "        return NULL;\n"
          + "    }\n"
          + "    p->left = build_complete(values, n, 2 * index + 1);\n"
          + "    p->right = build_complete(values, n, 2 * index + 2);\n"
          + "    return p;\n"
          + "}\n"
          + "\n"
          + "/* 前序：根 → 左 → 右 */\n"
          + "static void preorder(const struct Node *root) {\n"
          + "    if (root == NULL) {\n"
          + "        return;\n"
          + "    }\n"
          + "    printf(\" %d\", root->value);\n"
          + "    preorder(root->left);\n"
          + "    preorder(root->right);\n"
          + "}\n"
          + "\n"
          + "/* 中序：左 → 根 → 右 */\n"
          + "static void inorder(const struct Node *root) {\n"
          + "    if (root == NULL) {\n"
          + "        return;\n"
          + "    }\n"
          + "    inorder(root->left);\n"
          + "    printf(\" %d\", root->value);\n"
          + "    inorder(root->right);\n"
          + "}\n"
          + "\n"
          + "/* 后序：左 → 右 → 根 */\n"
          + "static void postorder(const struct Node *root) {\n"
          + "    if (root == NULL) {\n"
          + "        return;\n"
          + "    }\n"
          + "    postorder(root->left);\n"
          + "    postorder(root->right);\n"
          + "    printf(\" %d\", root->value);\n"
          + "}\n"
          + "\n"
          + "/* 层序：用数组当队列，一层一层往外取 */\n"
          + "static void level_order(const struct Node *root) {\n"
          + "    const struct Node *queue[MAXN];\n"
          + "    int front = 0, rear = 0;\n"
          + "    if (root == NULL) {\n"
          + "        return;\n"
          + "    }\n"
          + "    queue[rear++] = root;\n"
          + "    while (front < rear) {\n"
          + "        const struct Node *p = queue[front++];\n"
          + "        printf(\" %d\", p->value);\n"
          + "        if (p->left != NULL) {\n"
          + "            queue[rear++] = p->left;\n"
          + "        }\n"
          + "        if (p->right != NULL) {\n"
          + "            queue[rear++] = p->right;\n"
          + "        }\n"
          + "    }\n"
          + "}\n"
          + "\n"
          + "static void free_tree(struct Node *root) {\n"
          + "    if (root == NULL) {\n"
          + "        return;\n"
          + "    }\n"
          + "    free_tree(root->left);\n"
          + "    free_tree(root->right);\n"
          + "    free(root);\n"
          + "}\n"
          + "\n"
          + "int main(void) {\n"
          + "    int n = 0, i;\n"
          + "    int values[MAXN];\n"
          + "    struct Node *root;\n"
          + "\n"
          + "    scanf(\"%d\", &n);\n"
          + "    for (i = 0; i < n; i++) {\n"
          + "        scanf(\"%d\", &values[i]);\n"
          + "    }\n"
          + "\n"
          + "    root = build_complete(values, n, 0);\n"
          + "\n"
          + "    printf(\"preorder :\");\n"
          + "    preorder(root);\n"
          + "    printf(\"\\n\");\n"
          + "\n"
          + "    printf(\"inorder  :\");\n"
          + "    inorder(root);\n"
          + "    printf(\"\\n\");\n"
          + "\n"
          + "    printf(\"postorder:\");\n"
          + "    postorder(root);\n"
          + "    printf(\"\\n\");\n"
          + "\n"
          + "    printf(\"level    :\");\n"
          + "    level_order(root);\n"
          + "    printf(\"\\n\");\n"
          + "\n"
          + "    free_tree(root);\n"
          + "    return 0;\n"
          + "}",
      mastery: [
        "能用递归写出前序、中序、后序遍历，并说清三者区别",
        "能用数组队列实现层序遍历",
        "能用下标公式建立完全二叉树，并按后序安全释放整棵树"
      ]
    },
    {
      id: 71,
      title: "二叉搜索树：插入、查找与三种删除情况",
      minutes: 25,
      gist: "掌握 BST 的「左小右大」与中序有序，写对包含两个孩子节点的删除操作。",
      lesson: "二叉搜索树（BST）给二叉树加了一条规矩：对任意节点，左子树里所有值都小于它，右子树里所有值都大于它。这条规矩让查找变成一次定向行走：比当前节点小就往左走，大就往右走，一路走到 NULL 说明不存在。\n"
        + "由此得到 BST 最重要的性质：中序遍历的结果一定是从小到大排好序的。看到「中序有序」就能确认这是一棵 BST。\n"
        + "代价方面，查找、插入、删除都只走一条从根到叶的路径，所以是 O(h)，h 是树高。数据比较随机时树高约为 log n，很快；但如果依次插入已经有序的数据（1、2、3、4、5），树会退化成一条链，h 变成 n，所有操作都退化成 O(n)。这正是后来出现平衡树（AVL、红黑树）的原因。\n"
        + "插入：从根开始比较，比当前节点小就往左子树插，大就往右子树插，遇到空位就挂上新节点。递归写法最简洁：root->left = bst_insert(root->left, value)。相等时通常什么也不做（不允许重复值）。\n"
        + "删除是最难的一块，分三种情况：\n"
        + "1. 没有孩子（叶子）：直接释放，返回 NULL。\n"
        + "2. 只有一个孩子：让孩子顶上来，释放自己。\n"
        + "3. 有两个孩子：不能简单删掉，否则树会断开。标准做法是找「中序后继」——右子树里最小的那个节点（从右孩子出发一直往左走到底），把它的值复制到当前节点，然后到右子树里把那个后继节点删掉。后继节点最多只有右孩子，所以问题退化成情况 1 或 2。\n"
        + "查找失败返回 NULL，调用方必须先判断再取 value，否则就是空指针解引用。\n"
        + "读别人的 BST 代码时，先看 insert/delete 有没有把返回值接回 root->left / root->right——递归写法里漏掉这一步，树会「看着没问题但节点丢了」。",
      example: {
        code: "#include <stdio.h>\n"
          + "#include <stdlib.h>\n"
          + "\n"
          + "struct Node {\n"
          + "    int value;\n"
          + "    struct Node *left;\n"
          + "    struct Node *right;\n"
          + "};\n"
          + "\n"
          + "static struct Node *create_node(int value) {\n"
          + "    struct Node *p = malloc(sizeof(struct Node));\n"
          + "    if (p == NULL) {\n"
          + "        return NULL;\n"
          + "    }\n"
          + "    p->value = value;\n"
          + "    p->left = NULL;\n"
          + "    p->right = NULL;\n"
          + "    return p;\n"
          + "}\n"
          + "\n"
          + "/* 插入：小的往左走、大的往右走，递归到空位就挂上新节点 */\n"
          + "static struct Node *bst_insert(struct Node *root, int value) {\n"
          + "    if (root == NULL) {\n"
          + "        return create_node(value);\n"
          + "    }\n"
          + "    if (value < root->value) {\n"
          + "        root->left = bst_insert(root->left, value);\n"
          + "    } else if (value > root->value) {\n"
          + "        root->right = bst_insert(root->right, value);\n"
          + "    }\n"
          + "    /* 相等就什么也不做：这棵树不放重复值 */\n"
          + "    return root;\n"
          + "}\n"
          + "\n"
          + "/* 查找：从根开始一路比较，最多走一条从根到叶的路径 */\n"
          + "static struct Node *bst_find(struct Node *root, int value) {\n"
          + "    while (root != NULL) {\n"
          + "        if (value == root->value) {\n"
          + "            return root;\n"
          + "        }\n"
          + "        if (value < root->value) {\n"
          + "            root = root->left;\n"
          + "        } else {\n"
          + "            root = root->right;\n"
          + "        }\n"
          + "    }\n"
          + "    return NULL;\n"
          + "}\n"
          + "\n"
          + "/* 删除分三种情况：没有孩子、只有一个孩子、有两个孩子 */\n"
          + "static struct Node *bst_delete(struct Node *root, int value) {\n"
          + "    struct Node *successor;\n"
          + "    if (root == NULL) {\n"
          + "        return NULL;\n"
          + "    }\n"
          + "    if (value < root->value) {\n"
          + "        root->left = bst_delete(root->left, value);\n"
          + "        return root;\n"
          + "    }\n"
          + "    if (value > root->value) {\n"
          + "        root->right = bst_delete(root->right, value);\n"
          + "        return root;\n"
          + "    }\n"
          + "    /* 情况一：左孩子为空，右孩子直接顶上来（右孩子也可能是 NULL） */\n"
          + "    if (root->left == NULL) {\n"
          + "        struct Node *right = root->right;\n"
          + "        free(root);\n"
          + "        return right;\n"
          + "    }\n"
          + "    /* 情况二：右孩子为空，左孩子顶上来 */\n"
          + "    if (root->right == NULL) {\n"
          + "        struct Node *left = root->left;\n"
          + "        free(root);\n"
          + "        return left;\n"
          + "    }\n"
          + "    /* 情况三：两个孩子都在——找右子树里最小的节点（中序后继）接班 */\n"
          + "    successor = root->right;\n"
          + "    while (successor->left != NULL) {\n"
          + "        successor = successor->left;\n"
          + "    }\n"
          + "    root->value = successor->value;\n"
          + "    root->right = bst_delete(root->right, successor->value);\n"
          + "    return root;\n"
          + "}\n"
          + "\n"
          + "static void inorder(const struct Node *root) {\n"
          + "    if (root == NULL) {\n"
          + "        return;\n"
          + "    }\n"
          + "    inorder(root->left);\n"
          + "    printf(\" %d\", root->value);\n"
          + "    inorder(root->right);\n"
          + "}\n"
          + "\n"
          + "static const struct Node *find_min(const struct Node *root) {\n"
          + "    if (root == NULL) {\n"
          + "        return NULL;\n"
          + "    }\n"
          + "    while (root->left != NULL) {\n"
          + "        root = root->left;\n"
          + "    }\n"
          + "    return root;\n"
          + "}\n"
          + "\n"
          + "static const struct Node *find_max(const struct Node *root) {\n"
          + "    if (root == NULL) {\n"
          + "        return NULL;\n"
          + "    }\n"
          + "    while (root->right != NULL) {\n"
          + "        root = root->right;\n"
          + "    }\n"
          + "    return root;\n"
          + "}\n"
          + "\n"
          + "static void free_tree(struct Node *root) {\n"
          + "    if (root == NULL) {\n"
          + "        return;\n"
          + "    }\n"
          + "    free_tree(root->left);\n"
          + "    free_tree(root->right);\n"
          + "    free(root);\n"
          + "}\n"
          + "\n"
          + "int main(void) {\n"
          + "    int n = 0, i, value = 0;\n"
          + "    int target = 0, to_delete = 0;\n"
          + "    struct Node *root = NULL;\n"
          + "    const struct Node *smallest, *largest;\n"
          + "\n"
          + "    scanf(\"%d\", &n);\n"
          + "    for (i = 0; i < n; i++) {\n"
          + "        scanf(\"%d\", &value);\n"
          + "        root = bst_insert(root, value);\n"
          + "    }\n"
          + "    scanf(\"%d\", &target);\n"
          + "    scanf(\"%d\", &to_delete);\n"
          + "\n"
          + "    printf(\"inorder:\");\n"
          + "    inorder(root);\n"
          + "    printf(\"\\n\");\n"
          + "\n"
          + "    smallest = find_min(root);\n"
          + "    largest = find_max(root);\n"
          + "    printf(\"min = %d, max = %d\\n\", smallest->value, largest->value);\n"
          + "\n"
          + "    printf(\"find %d: %s\\n\", target, bst_find(root, target) != NULL ? \"yes\" : \"no\");\n"
          + "\n"
          + "    root = bst_delete(root, to_delete);\n"
          + "    printf(\"after delete %d:\", to_delete);\n"
          + "    inorder(root);\n"
          + "    printf(\"\\n\");\n"
          + "\n"
          + "    free_tree(root);\n"
          + "    return 0;\n"
          + "}",
        input: "7\n"
          + "50 30 70 20 40 60 80\n"
          + "40\n"
          + "50",
        output: "inorder: 20 30 40 50 60 70 80\n"
          + "min = 20, max = 80\n"
          + "find 40: yes\n"
          + "after delete 50: 20 30 40 60 70 80",
        explain: "这个例子依次插入 50、30、70、20、40、60、80，建出一棵比较平衡的 BST：根 50 的左子树是 30（带 20、40）、右子树是 70（带 60、80）。\n"
          + "inorder 打印 20 30 40 50 60 70 80——中序有序，这是 BST 最直接的验证方式。\n"
          + "find_min / find_max 沿着左指针、右指针一路走到底，分别拿到最小值和最大值（20 和 80），不需要遍历整棵树。\n"
          + "bst_find 是从根开始的一次定向行走：找 40 时 40 < 50 往左、40 > 30 往右，两步就命中；找 45 时最后走到 NULL，返回 NULL，打印 no。\n"
          + "bst_delete(root, 50) 是这一关的重点：50 有两个孩子，属于第三种情况。代码先在右子树里找中序后继——70 → 60，60 就是后继。把 60 复制到根节点，然后到右子树里删掉原来的 60（它只有一个右孩子，属于第二种情况）。所以删除后的中序是 20 30 40 60 70 80，根变成了 60。\n"
          + "最后 free_tree 按后序释放所有节点。"
      },
      pitfalls: [
        "递归插入写成 `bst_insert(root->left, value);`（丢掉返回值）→ 新节点没有挂到树上，看起来「插了但查不到」。",
        "删除有两个孩子的节点时直接 free → 两棵子树全部丢失，而且内存泄漏。",
        "找中序后继时写成 `successor = root->right; while (successor->right != NULL)`（方向反了）→ 拿到的是右子树最大值，删除后中序不再有序。",
        "bst_find 返回 NULL 却直接取 ->value → 空指针崩溃；必须先判断再解引用。",
        "依次插入有序数据导致树退化成链，还按 O(log n) 估计性能。"
      ],
      takeaways: [
        "BST 性质：左子树全小、右子树全大，所以中序遍历一定有序",
        "查找 / 插入 / 删除都是 O(h)，h 是树高，最坏会退化到 O(n)",
        "删除有两个孩子的节点：用右子树最小节点（中序后继）接班",
        "递归写法要把返回值接回孩子指针，否则节点会「丢掉」",
        "查找失败返回 NULL，调用方必须先判空"
      ],
      questions: [
        {
          q: "对一棵二叉搜索树做中序遍历，得到的序列是？",
          options: [
            "随机顺序",
            "从大到小",
            "按插入的先后顺序",
            "从小到大"
          ],
          answer: 3,
          explain: "左子树全比根小、右子树全比根大，中序又是「左 → 根 → 右」，所以结果一定从小到大，D 对。A、C 错：中序结果与插入顺序无关，只由树的结构决定。B 是「右 → 根 → 左」的镜像写法才会得到的结果。"
        },
        {
          q: "删除一个有两个孩子的 BST 节点，标准做法是？",
          options: [
            "直接 free 掉它，两棵子树都不要了",
            "用右子树里最小的节点（中序后继）的值替换它，再到右子树里删掉那个后继",
            "把左子树整个接到右子树下面",
            "直接拒绝删除，BST 不允许删除有两个孩子的节点"
          ],
          answer: 1,
          explain: "中序后继是右子树里最小的值，用它替换后仍然满足「左小右大」，而且后继最多只有右孩子，删除它退化成简单情况，B 对。A 错：会丢掉整棵子树并造成内存泄漏。C 错：那样会破坏 BST 的有序性。D 错：删除是 BST 的基本操作，只是要分三种情况处理。"
        },
        {
          q: "依次把 1、2、3、4、5 插入一棵空 BST，这时查找的时间复杂度是？",
          options: [
            "O(1)",
            "O(log n)",
            "O(n log n)",
            "O(n)，树已经退化成一条链"
          ],
          answer: 3,
          explain: "有序数据只会往同一个方向长，树变成 1-2-3-4-5 这样一条链，高度等于节点数，查找要从头走到尾，是 O(n)，D 对。B 是随机数据下的平均情况，这里不成立。A 错：树没有任何「一步定位」的能力。C 错：查找不需要排序代价。"
        }
      ],
      passRatio: 0.8,
      mission: "写一个单文件程序，依次读入 n、n 个整数、一个要查找的值、一个要删除的值（例如：\n"
        + "7\n"
        + "50 30 70 20 40 60 80\n"
        + "40\n"
        + "50\n"
        + "），建一棵二叉搜索树，输出 3 行：\n"
        + "inorder: 20 30 40 50 60 70 80\n"
        + "find 40: yes\n"
        + "after delete 50: 20 30 40 60 70 80\n"
        + "要求：\n"
        + "1) 定义 struct Node { int value; struct Node *left; struct Node *right; }，节点用 malloc 申请并判 NULL；\n"
        + "2) 写递归函数 struct Node *bst_insert(struct Node *root, int value)：小的往左、大的往右，遇到空位创建新节点，并把返回值接回 root->left / root->right；\n"
        + "3) 写 struct Node *bst_delete(struct Node *root, int value)：三种情况都要处理——没有孩子、只有一个孩子、有两个孩子（用右子树里最小的节点接班）；\n"
        + "4) 查找结果输出 \"find 值: yes\" 或 \"find 值: no\"（用 != NULL 判断）；\n"
        + "5) 两行中序输出格式为 \"inorder:\" 与 \"after delete 值:\" 后跟每个数前加一个空格；\n"
        + "6) 结束前 free 掉整棵树；最后 return 0;。",
      starter: "#include <stdio.h>\n"
        + "#include <stdlib.h>\n"
        + "\n"
        + "struct Node {\n"
        + "    int value;\n"
        + "    struct Node *left;\n"
        + "    struct Node *right;\n"
        + "};\n"
        + "\n"
        + "/* TODO: create_node */\n"
        + "\n"
        + "/* TODO: bst_insert（递归，返回值要接回孩子指针） */\n"
        + "\n"
        + "/* TODO: bst_find（循环，找不到返回 NULL） */\n"
        + "\n"
        + "/* TODO: bst_delete（三种情况） */\n"
        + "\n"
        + "/* TODO: inorder（中序打印） */\n"
        + "\n"
        + "/* TODO: free_tree（后序释放） */\n"
        + "\n"
        + "int main(void) {\n"
        + "    int n = 0, i, value = 0;\n"
        + "    int target = 0, to_delete = 0;\n"
        + "    struct Node *root = NULL;\n"
        + "\n"
        + "    scanf(\"%d\", &n);\n"
        + "    for (i = 0; i < n; i++) {\n"
        + "        scanf(\"%d\", &value);\n"
        + "        /* TODO: 插入 */\n"
        + "    }\n"
        + "    scanf(\"%d\", &target);\n"
        + "    scanf(\"%d\", &to_delete);\n"
        + "\n"
        + "    /* TODO: 中序 → find → 删除 → 再中序 → 释放 */\n"
        + "\n"
        + "    return 0;\n"
        + "}",
      hint: "删除的三个分支按「左孩子为空」「右孩子为空」「都有」的顺序写：前两种让孩子直接顶上来（记得先保存再 free）；第三种先 successor = root->right，再 while (successor->left != NULL) successor = successor->left 找到中序后继，把它的值复制到当前节点，最后 root->right = bst_delete(root->right, successor->value)。递归里每个分支都不要忘了 return root。",
      check: {
        include: ["stdio.h","stdlib.h"],
        return0: true,
        calls: [["scanf","%d"],["printf","inorder"],["printf","find"],["printf","after delete"]],
        require: {"struct":"Node","malloc":true,"free":true,"recursion":["bst_insert"],"funcs":["bst_insert","bst_delete"],"if":true,"loop":true},
        minStatements: 16,
        message: "需要 stdlib.h、struct Node、malloc/free、递归的 bst_insert、自己定义的 bst_delete（三种情况都要处理），以及 inorder / find / after delete 三行输出和 return 0;。",
        ok: "插入、查找与三种删除情况都写对了，中序输出验证了 BST 性质。"
      },
      expectedOutput: "inorder: 20 30 40 50 60 70 80\n"
          + "find 40: yes\n"
          + "after delete 50: 20 30 40 60 70 80",
      input: "7\n"
          + "50 30 70 20 40 60 80\n"
          + "40\n"
          + "50",
      solution: "#include <stdio.h>\n"
          + "#include <stdlib.h>\n"
          + "\n"
          + "struct Node {\n"
          + "    int value;\n"
          + "    struct Node *left;\n"
          + "    struct Node *right;\n"
          + "};\n"
          + "\n"
          + "static struct Node *create_node(int value) {\n"
          + "    struct Node *p = malloc(sizeof(struct Node));\n"
          + "    if (p == NULL) {\n"
          + "        return NULL;\n"
          + "    }\n"
          + "    p->value = value;\n"
          + "    p->left = NULL;\n"
          + "    p->right = NULL;\n"
          + "    return p;\n"
          + "}\n"
          + "\n"
          + "/* 插入：小的往左、大的往右，递归到空位挂上新节点 */\n"
          + "static struct Node *bst_insert(struct Node *root, int value) {\n"
          + "    if (root == NULL) {\n"
          + "        return create_node(value);\n"
          + "    }\n"
          + "    if (value < root->value) {\n"
          + "        root->left = bst_insert(root->left, value);\n"
          + "    } else if (value > root->value) {\n"
          + "        root->right = bst_insert(root->right, value);\n"
          + "    }\n"
          + "    return root;\n"
          + "}\n"
          + "\n"
          + "static struct Node *bst_find(struct Node *root, int value) {\n"
          + "    while (root != NULL) {\n"
          + "        if (value == root->value) {\n"
          + "            return root;\n"
          + "        }\n"
          + "        if (value < root->value) {\n"
          + "            root = root->left;\n"
          + "        } else {\n"
          + "            root = root->right;\n"
          + "        }\n"
          + "    }\n"
          + "    return NULL;\n"
          + "}\n"
          + "\n"
          + "/* 删除三种情况：叶子直接删；只有一个孩子让孩子顶上；有两个孩子用中序后继接班 */\n"
          + "static struct Node *bst_delete(struct Node *root, int value) {\n"
          + "    struct Node *successor;\n"
          + "    if (root == NULL) {\n"
          + "        return NULL;\n"
          + "    }\n"
          + "    if (value < root->value) {\n"
          + "        root->left = bst_delete(root->left, value);\n"
          + "        return root;\n"
          + "    }\n"
          + "    if (value > root->value) {\n"
          + "        root->right = bst_delete(root->right, value);\n"
          + "        return root;\n"
          + "    }\n"
          + "    if (root->left == NULL) {\n"
          + "        struct Node *right = root->right;\n"
          + "        free(root);\n"
          + "        return right;\n"
          + "    }\n"
          + "    if (root->right == NULL) {\n"
          + "        struct Node *left = root->left;\n"
          + "        free(root);\n"
          + "        return left;\n"
          + "    }\n"
          + "    successor = root->right;\n"
          + "    while (successor->left != NULL) {\n"
          + "        successor = successor->left;\n"
          + "    }\n"
          + "    root->value = successor->value;\n"
          + "    root->right = bst_delete(root->right, successor->value);\n"
          + "    return root;\n"
          + "}\n"
          + "\n"
          + "/* 中序遍历：先左子树，再根，最后右子树——二叉搜索树的中序结果一定是从小到大 */\n"
          + "static void inorder(const struct Node *root) {\n"
          + "    if (root == NULL) {\n"
          + "        return;\n"
          + "    }\n"
          + "    inorder(root->left);\n"
          + "    printf(\" %d\", root->value);\n"
          + "    inorder(root->right);\n"
          + "}\n"
          + "\n"
          + "static void free_tree(struct Node *root) {\n"
          + "    if (root == NULL) {\n"
          + "        return;\n"
          + "    }\n"
          + "    free_tree(root->left);\n"
          + "    free_tree(root->right);\n"
          + "    free(root);\n"
          + "}\n"
          + "\n"
          + "int main(void) {\n"
          + "    int n = 0, i, value = 0;\n"
          + "    int target = 0, to_delete = 0;\n"
          + "    struct Node *root = NULL;\n"
          + "\n"
          + "    scanf(\"%d\", &n);\n"
          + "    for (i = 0; i < n; i++) {\n"
          + "        scanf(\"%d\", &value);\n"
          + "        root = bst_insert(root, value);\n"
          + "    }\n"
          + "    scanf(\"%d\", &target);\n"
          + "    scanf(\"%d\", &to_delete);\n"
          + "\n"
          + "    printf(\"inorder:\");\n"
          + "    inorder(root);\n"
          + "    printf(\"\\n\");\n"
          + "\n"
          + "    printf(\"find %d: %s\\n\", target, bst_find(root, target) != NULL ? \"yes\" : \"no\");\n"
          + "\n"
          + "    root = bst_delete(root, to_delete);\n"
          + "    printf(\"after delete %d:\", to_delete);\n"
          + "    inorder(root);\n"
          + "    printf(\"\\n\");\n"
          + "\n"
          + "    free_tree(root);\n"
          + "    return 0;\n"
          + "}",
      mastery: [
        "能写出 BST 的递归插入与迭代查找，并说清中序有序的原因",
        "能正确处理删除的三种情况，尤其是有两个孩子时用中序后继接班",
        "能解释有序数据为什么会让 BST 退化成链表"
      ]
    },
    {
      id: 72,
      title: "哈希表：哈希函数与链地址法",
      minutes: 25,
      gist: "用「数组 + 链表」实现一张哈希表，理解冲突处理与平均 O(1) 的来由。",
      lesson: "哈希表（散列表）追求平均 O(1) 的插入和查找：用一个哈希函数把关键字直接换算成数组下标，一步到位，不需要像二分那样一次次比较。\n"
        + "哈希函数有三条要求：同一关键字每次算出的下标必须相同；结果必须落在 [0, 桶数) 范围内；尽量把关键字均匀地撒开。最简单的做法是除法散列 h(key) = key % m，m 常取质数，分布更均匀。要注意 C 的 % 对负数取余结果可能是负数：(-8) % 7 得 -1，所以哈希函数里要补一句 if (h < 0) h += m。\n"
        + "冲突是躲不掉的：桶只有 m 个，关键字却可能有无穷多个。设计哈希表时不是「避免冲突」，而是「冲突了怎么办」。两种主流做法：\n"
        + "链地址法（本关实现）：每个桶挂一条链表，冲突的关键字都放进同一条链。查找时先算下标，再沿着链找。这就是「数组 + 链表」的结构，许多语言的字典类型都是这个思路。\n"
        + "开放寻址法：冲突时按某个探测序列往后找空槽（线性探测、二次探测），表本身就是普通数组，但删除要打标记，否则会断开探测链。\n"
        + "链地址法的性能取决于链有多长，用负载因子衡量：负载因子 = 元素个数 / 桶数。它在 1 附近时平均链长是常数，查找仍然很快；超过阈值（常见 0.75）就该扩容——建一个更大的桶数组（通常翻倍），把所有元素重新散列过去。\n"
        + "「平均 O(1)」里的「平均」不是废话。哈希函数写得差（例如所有 key 都落到同一个桶），元素全挤在一条链上，查找就退化成 O(n)，这时的哈希表没有任何优势。所以哈希函数质量和扩容时机决定了实际性能。\n"
        + "删除时要先在链上摘掉节点、再 free，别只 free 不改指针——那会在链表里留下悬空指针。释放整张表要遍历每个桶的链。\n"
        + "读别人的哈希表代码时，先看三件事：哈希函数怎么算、冲突怎么处理、删除时链表指针有没有正确接回去。",
      example: {
        code: "#include <stdio.h>\n"
          + "#include <stdlib.h>\n"
          + "\n"
          + "#define BUCKETS 7\n"
          + "\n"
          + "struct Node {\n"
          + "    int key;\n"
          + "    struct Node *next;\n"
          + "};\n"
          + "\n"
          + "/* 哈希函数：把关键字压进 0 .. BUCKETS-1 */\n"
          + "static int hash_index(int key) {\n"
          + "    int h = key % BUCKETS;\n"
          + "    if (h < 0) {\n"
          + "        h += BUCKETS;      /* 负数取模可能得负数，加回一圈 */\n"
          + "    }\n"
          + "    return h;\n"
          + "}\n"
          + "\n"
          + "/* 头插法：新节点挂到桶链表的头部 */\n"
          + "static int table_insert(struct Node **table, int key) {\n"
          + "    int idx = hash_index(key);\n"
          + "    struct Node *p = malloc(sizeof(struct Node));\n"
          + "    if (p == NULL) {\n"
          + "        return -1;\n"
          + "    }\n"
          + "    p->key = key;\n"
          + "    p->next = table[idx];\n"
          + "    table[idx] = p;\n"
          + "    return idx;\n"
          + "}\n"
          + "\n"
          + "static int table_find(struct Node **table, int key) {\n"
          + "    int idx = hash_index(key);\n"
          + "    struct Node *p;\n"
          + "    for (p = table[idx]; p != NULL; p = p->next) {\n"
          + "        if (p->key == key) {\n"
          + "            return 1;\n"
          + "        }\n"
          + "    }\n"
          + "    return 0;\n"
          + "}\n"
          + "\n"
          + "static int table_free(struct Node **table) {\n"
          + "    int i, count = 0;\n"
          + "    for (i = 0; i < BUCKETS; i++) {\n"
          + "        struct Node *p = table[i];\n"
          + "        while (p != NULL) {\n"
          + "            struct Node *next = p->next;\n"
          + "            free(p);\n"
          + "            p = next;\n"
          + "            count++;\n"
          + "        }\n"
          + "        table[i] = NULL;\n"
          + "    }\n"
          + "    return count;\n"
          + "}\n"
          + "\n"
          + "int main(void) {\n"
          + "    int n = 0, i, key = 0, target = 0;\n"
          + "    struct Node *table[BUCKETS];\n"
          + "\n"
          + "    for (i = 0; i < BUCKETS; i++) {\n"
          + "        table[i] = NULL;\n"
          + "    }\n"
          + "\n"
          + "    scanf(\"%d\", &n);\n"
          + "    for (i = 0; i < n; i++) {\n"
          + "        scanf(\"%d\", &key);\n"
          + "        printf(\"insert %d -> bucket %d\\n\", key, table_insert(table, key));\n"
          + "    }\n"
          + "\n"
          + "    for (i = 0; i < BUCKETS; i++) {\n"
          + "        struct Node *p;\n"
          + "        printf(\"bucket %d:\", i);\n"
          + "        for (p = table[i]; p != NULL; p = p->next) {\n"
          + "            printf(\" %d\", p->key);\n"
          + "        }\n"
          + "        printf(\"\\n\");\n"
          + "    }\n"
          + "\n"
          + "    scanf(\"%d\", &target);\n"
          + "    printf(\"find %d: %s\\n\", target, table_find(table, target) ? \"yes\" : \"no\");\n"
          + "    printf(\"freed: %d\\n\", table_free(table));\n"
          + "    return 0;\n"
          + "}",
        input: "7\n"
          + "15 8 22 1 12 3 20\n"
          + "22",
        output: "insert 15 -> bucket 1\n"
          + "insert 8 -> bucket 1\n"
          + "insert 22 -> bucket 1\n"
          + "insert 1 -> bucket 1\n"
          + "insert 12 -> bucket 5\n"
          + "insert 3 -> bucket 3\n"
          + "insert 20 -> bucket 6\n"
          + "bucket 0:\n"
          + "bucket 1: 1 22 8 15\n"
          + "bucket 2:\n"
          + "bucket 3: 3\n"
          + "bucket 4:\n"
          + "bucket 5: 12\n"
          + "bucket 6: 20\n"
          + "find 22: yes\n"
          + "freed: 7",
        explain: "这个例子用 7 个桶和 h(key) = key % 7 的哈希函数，把 15、8、22、1、12、3、20 依次插进去。\n"
          + "hash_index 先算 key % 7，再用 if (h < 0) h += BUCKETS 把负数修正到 [0, 7)。这一步在只看正数的例子里看不出作用，但它是必须的。\n"
          + "table_insert 是头插法：先把新节点的 next 指向原来的桶头 table[idx]，再让 table[idx] 指向新节点。两行的顺序不能反，反了链就断了。函数返回算出来的下标，所以 main 里能打印「insert 15 -> bucket 1」。\n"
          + "15、8、22、1 的 key % 7 都等于 1，它们挤在同一个桶里；因为是头插，链表顺序是插入顺序的倒序：1 → 22 → 8 → 15。这就是链地址法处理冲突的样子。\n"
          + "12 落在 5 号桶、3 落在 3 号桶、20 落在 6 号桶，其余桶是空的——遍历七个桶就能看出哈希函数把关键字撒得均不均匀。\n"
          + "table_find 先算下标，再沿着那条链比较，只要链不长就是常数级。\n"
          + "table_free 逐个桶释放整条链，顺便数出一共释放了多少个节点；释放时先把 next 存下来，再 free 当前节点，顺序反了就会读到已释放的内存。"
      },
      pitfalls: [
        "哈希函数对负数取模没修正：`(-8) % 7` 得 -1，直接拿去当下标会越界。",
        "头插法两行写反：先 `table[idx] = p` 再 `p->next = table[idx]` → 链断了，等于每次只留一个节点。",
        "删除节点只 free 不摘链 → 链表里留下悬空指针，下一次查找就崩溃。",
        "桶数取偶数而关键字都是偶数 → 只用得上一半的桶，链变长、性能下降。",
        "以为哈希表查找一定是 O(1)：哈希函数差或负载因子过高时会退化成 O(n)。"
      ],
      takeaways: [
        "哈希表用哈希函数把关键字映射成下标，平均 O(1)",
        "冲突必然存在，链地址法用「数组 + 链表」解决",
        "哈希函数要处理负数取模，桶数常取质数",
        "负载因子 = 元素个数 / 桶数，过高就要扩容重散列",
        "删除节点要先摘链再 free"
      ],
      questions: [
        {
          q: "哈希函数是 h(key) = key % 7 时，关键字 15 落在哪个桶？",
          options: [
            "1 号桶",
            "0 号桶",
            "2 号桶",
            "7 号桶"
          ],
          answer: 0,
          explain: "15 = 7 × 2 + 1，余数是 1，所以落在 1 号桶，A 对。D 错：下标范围只能是 0 到 6，7 号桶不存在（这也是取模的意义）。B、C 都不是 15 % 7 的结果。"
        },
        {
          q: "在 C 语言里 `(-8) % 7` 的值是多少？",
          options: [
            "1",
            "6",
            "-1",
            "0"
          ],
          answer: 2,
          explain: "C 的取余结果符号跟随被除数：-8 = 7 × (-1) + (-1)，余数是 -1，C 对。A、B 是「把结果修正到非负」之后的值，正是哈希函数里 if (h < 0) h += 7 要做的事。D 错：-8 不能被 7 整除。"
        },
        {
          q: "链地址法实现的哈希表，负载因子过高会带来什么后果？",
          options: [
            "平均链长变长，查找从 O(1) 退化到接近 O(n)",
            "编译报错",
            "哈希函数会失效，算出的下标不再稳定",
            "表会自动变成二叉树"
          ],
          answer: 0,
          explain: "元素比桶多得多时，每个桶的链都会变长，查找要从链头走到链尾，退化成线性查找，A 对。这正是要扩容重散列的原因。B 错：这是运行期的性能问题，不是编译问题。C 错：哈希函数本身没变。D 错：链地址法的桶挂的是链表，不会自动变成树。"
        }
      ],
      passRatio: 0.8,
      mission: "写一个单文件程序，读入 n、n 个整数（作为关键字）和一个要查找的值（例如：\n"
        + "7\n"
        + "15 8 22 1 12 3 20\n"
        + "22\n"
        + "），用链地址法把它们放进 7 个桶的哈希表，输出 9 行：\n"
        + "bucket 0:\n"
        + "bucket 1: 1 22 8 15\n"
        + "bucket 2:\n"
        + "bucket 3: 3\n"
        + "bucket 4:\n"
        + "bucket 5: 12\n"
        + "bucket 6: 20\n"
        + "find 22: yes\n"
        + "freed: 7\n"
        + "要求：\n"
        + "1) 定义 struct Node { int key; struct Node *next; }，节点用 malloc 申请并判 NULL；\n"
        + "2) 写函数 int hash_index(int key)：返回 key % 7，负数要加回 7 变成非负；\n"
        + "3) 写函数 int table_insert(struct Node **table, int key)：头插法（先让新节点的 next 指向原来的桶头，再让桶头指向新节点），返回算出的下标；\n"
        + "4) 七个桶按 \"bucket 下标:\" 输出，链上的关键字前加一个空格，空桶只输出标签；\n"
        + "5) 查找输出 \"find 值: yes\" 或 \"find 值: no\"；\n"
        + "6) 释放整张表（每个桶的链都要走完），输出 \"freed: 关键字个数\"；\n"
        + "7) 最后 return 0;。",
      starter: "#include <stdio.h>\n"
        + "#include <stdlib.h>\n"
        + "\n"
        + "#define BUCKETS 7\n"
        + "\n"
        + "struct Node {\n"
        + "    int key;\n"
        + "    struct Node *next;\n"
        + "};\n"
        + "\n"
        + "/* TODO: hash_index：key % BUCKETS，负数要修正 */\n"
        + "\n"
        + "/* TODO: table_insert：头插法，返回下标 */\n"
        + "\n"
        + "/* TODO: table_find：先算下标，再沿链找 */\n"
        + "\n"
        + "/* TODO: table_free：释放每个桶的链并返回节点个数 */\n"
        + "\n"
        + "int main(void) {\n"
        + "    int n = 0, i, key = 0, target = 0;\n"
        + "    struct Node *table[BUCKETS];\n"
        + "\n"
        + "    for (i = 0; i < BUCKETS; i++) {\n"
        + "        table[i] = NULL;\n"
        + "    }\n"
        + "\n"
        + "    scanf(\"%d\", &n);\n"
        + "    for (i = 0; i < n; i++) {\n"
        + "        scanf(\"%d\", &key);\n"
        + "        /* TODO: 插入 */\n"
        + "    }\n"
        + "\n"
        + "    /* TODO: 输出七个桶 → find → freed */\n"
        + "\n"
        + "    return 0;\n"
        + "}",
      hint: "头插法的两行顺序是：p->next = table[idx]; 然后 table[idx] = p;。遍历一个桶用 for (p = table[i]; p != NULL; p = p->next)。释放时先把 next = p->next 存下来，再 free(p)，最后 p = next —— 顺序反了就会读已释放的内存。",
      check: {
        include: ["stdio.h","stdlib.h"],
        return0: true,
        calls: [["scanf","%d"],["printf","bucket"],["printf","find"],["printf","freed"]],
        require: {"struct":"Node","malloc":true,"free":true,"funcs":["hash_index","table_insert"],"array":true,"loop":true,"if":true},
        minStatements: 16,
        message: "需要 stdlib.h、struct Node、malloc/free、自己定义的 hash_index 与 table_insert、用一个指针数组当桶，并输出 bucket / find / freed 三类内容以及 return 0;。",
        ok: "哈希函数、头插冲突处理与整表释放都正确。"
      },
      expectedOutput: "bucket 0:\n"
          + "bucket 1: 1 22 8 15\n"
          + "bucket 2:\n"
          + "bucket 3: 3\n"
          + "bucket 4:\n"
          + "bucket 5: 12\n"
          + "bucket 6: 20\n"
          + "find 22: yes\n"
          + "freed: 7",
      input: "7\n"
          + "15 8 22 1 12 3 20\n"
          + "22",
      solution: "#include <stdio.h>\n"
          + "#include <stdlib.h>\n"
          + "\n"
          + "#define BUCKETS 7\n"
          + "\n"
          + "struct Node {\n"
          + "    int key;\n"
          + "    struct Node *next;\n"
          + "};\n"
          + "\n"
          + "/* 哈希函数：把关键字压进 0 .. BUCKETS-1 */\n"
          + "static int hash_index(int key) {\n"
          + "    int h = key % BUCKETS;\n"
          + "    if (h < 0) {\n"
          + "        h += BUCKETS;\n"
          + "    }\n"
          + "    return h;\n"
          + "}\n"
          + "\n"
          + "/* 头插法：同一个桶里的新节点挂在链表最前面 */\n"
          + "static int table_insert(struct Node **table, int key) {\n"
          + "    int idx = hash_index(key);\n"
          + "    struct Node *p = malloc(sizeof(struct Node));\n"
          + "    if (p == NULL) {\n"
          + "        return -1;\n"
          + "    }\n"
          + "    p->key = key;\n"
          + "    p->next = table[idx];\n"
          + "    table[idx] = p;\n"
          + "    return idx;\n"
          + "}\n"
          + "\n"
          + "static int table_find(struct Node **table, int key) {\n"
          + "    int idx = hash_index(key);\n"
          + "    struct Node *p;\n"
          + "    for (p = table[idx]; p != NULL; p = p->next) {\n"
          + "        if (p->key == key) {\n"
          + "            return 1;\n"
          + "        }\n"
          + "    }\n"
          + "    return 0;\n"
          + "}\n"
          + "\n"
          + "/* 释放每个桶的链表，顺手数一数一共存了多少个关键字 */\n"
          + "static int table_free(struct Node **table) {\n"
          + "    int i, count = 0;\n"
          + "    for (i = 0; i < BUCKETS; i++) {\n"
          + "        struct Node *p = table[i];\n"
          + "        while (p != NULL) {\n"
          + "            struct Node *next = p->next;\n"
          + "            free(p);\n"
          + "            p = next;\n"
          + "            count++;\n"
          + "        }\n"
          + "        table[i] = NULL;\n"
          + "    }\n"
          + "    return count;\n"
          + "}\n"
          + "\n"
          + "int main(void) {\n"
          + "    int n = 0, i, key = 0, target = 0;\n"
          + "    struct Node *table[BUCKETS];\n"
          + "\n"
          + "    for (i = 0; i < BUCKETS; i++) {\n"
          + "        table[i] = NULL;\n"
          + "    }\n"
          + "\n"
          + "    scanf(\"%d\", &n);\n"
          + "    for (i = 0; i < n; i++) {\n"
          + "        scanf(\"%d\", &key);\n"
          + "        table_insert(table, key);\n"
          + "    }\n"
          + "\n"
          + "    for (i = 0; i < BUCKETS; i++) {\n"
          + "        struct Node *p;\n"
          + "        printf(\"bucket %d:\", i);\n"
          + "        for (p = table[i]; p != NULL; p = p->next) {\n"
          + "            printf(\" %d\", p->key);\n"
          + "        }\n"
          + "        printf(\"\\n\");\n"
          + "    }\n"
          + "\n"
          + "    scanf(\"%d\", &target);\n"
          + "    printf(\"find %d: %s\\n\", target, table_find(table, target) ? \"yes\" : \"no\");\n"
          + "    printf(\"freed: %d\\n\", table_free(table));\n"
          + "    return 0;\n"
          + "}",
      mastery: [
        "能写出带负数修正的哈希函数，并说明桶数取质数的原因",
        "能用头插法实现链地址法哈希表，说清两行指针操作的顺序",
        "能安全释放整张哈希表，并解释负载因子与性能的关系"
      ]
    },
    {
      id: 73,
      title: "递归与回溯：全排列与八皇后",
      minutes: 25,
      gist: "掌握「选择 → 递归 → 撤销」的回溯模板，用它解决全排列与八皇后。",
      lesson: "回溯是「带撤销的穷举」：一步一步做选择，走不通就退回来换一个选择。它的代码骨架非常固定：\n"
        + "void backtrack(状态, 深度) {\n"
        + "    if (深度 == 目标) { 记录一个解; return; }\n"
        + "    for (每个可选的分支) {\n"
        + "        if (这个分支不合法) continue;\n"
        + "        做出选择;                 /* 修改状态 */\n"
        + "        backtrack(状态, 深度 + 1);\n"
        + "        撤销选择;                 /* 恢复状态，这一步就是「回溯」 */\n"
        + "    }\n"
        + "}\n"
        + "全排列是最好懂的例子：要生成 1..n 的所有排列，可以一位一位地填。填第 depth 位时，从 1..n 里挑一个「还没用过」的数字放进去，然后递归填下一位；回来之后把这个数字标记为未使用，好让别的分支也能用它。used[i] = 1 → 递归 → used[i] = 0 这三行就是完整的「选择—递归—撤销」，缺了最后一步，后面的分支全都会算错。\n"
        + "八皇后是回溯的经典题：在 n×n 棋盘上放 n 个皇后，任意两个不能在同一行、同一列、同一条对角线。按行放置可以保证行不冲突，于是只需要检查列和两条对角线。用三个标记数组能把冲突检查降到 O(1)：\n"
        + "col_used[col]：这一列有没有皇后；\n"
        + "diag_down[row + col]：右下方向的对角线，row + col 相同的格子在同一条线上；\n"
        + "diag_up[row - col + n]：左下方向的对角线，加偏移量是为了让下标非负。\n"
        + "放置时把三个标记置 1，递归下一行，返回时全部置 0——同样是「选择、递归、撤销」。\n"
        + "剪枝是回溯的效率关键：不合法就 continue，整棵子树都不用展开。八皇后在 8×8 棋盘上要试的分支远多于 92 个解，剪枝之后搜索规模才可接受。\n"
        + "写回溯最容易错的两个地方：忘记撤销（状态被上一个分支污染），以及终止条件的「深度」和「下标」对不上（多一层或少一层）。调试时可以在递归入口打印当前状态，看清每一步的状态变化。\n"
        + "读别人的回溯代码时，先找「撤销」那几行，它们一定和「做出选择」那几行一一对应。",
      example: {
        code: "#include <stdio.h>\n"
          + "\n"
          + "#define MAXN 16\n"
          + "\n"
          + "static int chosen[MAXN];\n"
          + "static int used[MAXN];\n"
          + "static int perm_count = 0;\n"
          + "\n"
          + "static void print_perm(int n) {\n"
          + "    int i;\n"
          + "    for (i = 0; i < n; i++) {\n"
          + "        if (i > 0) {\n"
          + "            printf(\" \");\n"
          + "        }\n"
          + "        printf(\"%d\", chosen[i]);\n"
          + "    }\n"
          + "    printf(\"\\n\");\n"
          + "}\n"
          + "\n"
          + "/* 全排列：一位一位地试，试完一位递归下一位，回来时把状态还原——这就是回溯 */\n"
          + "static void permute(int n, int depth) {\n"
          + "    int i;\n"
          + "    if (depth == n) {\n"
          + "        print_perm(n);\n"
          + "        perm_count++;\n"
          + "        return;\n"
          + "    }\n"
          + "    for (i = 1; i <= n; i++) {\n"
          + "        if (!used[i]) {\n"
          + "            used[i] = 1;\n"
          + "            chosen[depth] = i;\n"
          + "            permute(n, depth + 1);\n"
          + "            used[i] = 0;      /* 撤销选择，换下一个数字再试 */\n"
          + "        }\n"
          + "    }\n"
          + "}\n"
          + "\n"
          + "static int col_used[MAXN];\n"
          + "static int diag_down[MAXN * 2];    /* row + col 相同的格子在同一条对角线上 */\n"
          + "static int diag_up[MAXN * 2];      /* row - col + n 相同的格子也在同一条对角线上 */\n"
          + "static int queen_count = 0;\n"
          + "\n"
          + "/* 八皇后：一行一行放，每行只检查列和两条对角线有没有冲突 */\n"
          + "static void queens(int row, int n) {\n"
          + "    int col;\n"
          + "    if (row == n) {\n"
          + "        queen_count++;\n"
          + "        return;\n"
          + "    }\n"
          + "    for (col = 0; col < n; col++) {\n"
          + "        if (!col_used[col] && !diag_down[row + col] && !diag_up[row - col + n]) {\n"
          + "            col_used[col] = 1;\n"
          + "            diag_down[row + col] = 1;\n"
          + "            diag_up[row - col + n] = 1;\n"
          + "            queens(row + 1, n);\n"
          + "            col_used[col] = 0;\n"
          + "            diag_down[row + col] = 0;\n"
          + "            diag_up[row - col + n] = 0;\n"
          + "        }\n"
          + "    }\n"
          + "}\n"
          + "\n"
          + "int main(void) {\n"
          + "    int n = 0;\n"
          + "    int i;\n"
          + "\n"
          + "    scanf(\"%d\", &n);\n"
          + "    if (n > 8) {\n"
          + "        n = 8;\n"
          + "    }\n"
          + "\n"
          + "    permute(n, 0);\n"
          + "    printf(\"permutations = %d\\n\", perm_count);\n"
          + "\n"
          + "    queens(0, n);\n"
          + "    printf(\"queens(%d) = %d\\n\", n, queen_count);\n"
          + "\n"
          + "    /* 换一个规模再算一次：回溯结束时棋盘已经全部还原，可以直接复用 */\n"
          + "    queen_count = 0;\n"
          + "    queens(0, 8);\n"
          + "    printf(\"queens(8) = %d\\n\", queen_count);\n"
          + "\n"
          + "    for (i = 0; i < MAXN; i++) {\n"
          + "        used[i] = 0;\n"
          + "    }\n"
          + "    return 0;\n"
          + "}",
        input: "3",
        output: "1 2 3\n"
          + "1 3 2\n"
          + "2 1 3\n"
          + "2 3 1\n"
          + "3 1 2\n"
          + "3 2 1\n"
          + "permutations = 6\n"
          + "queens(3) = 0\n"
          + "queens(8) = 92",
        explain: "说明：示例为了对照，额外打印了一行 queens(3)（=0，3×3 棋盘无解）；本关任务只要求输出全排列结果、permutations 计数和 queens(8) = 92，不要求 queens(3)。这个例子先读入 n，再分别用回溯算出 1..n 的全排列和 n 皇后、8 皇后的解数。\n"
          + "permute 用的是「选择 + 撤销」模板：depth 表示正在填第几位；for 循环从 1 到 n 挑数字，used[i] 为 0 才能用；选好之后 used[i] = 1、chosen[depth] = i，递归填下一位，回来再写 used[i] = 0 把状态还原。因为数字是从小到大尝试的，输出正好是字典序。\n"
          + "depth == n 是终止条件：填满 n 位就打印这一组排列，并把 perm_count 加一。\n"
          + "queens 按行放置：row 表示正在放第几行，for 循环试每一列，三个标记数组分别检查列、row + col 这条对角线、以及 row - col + n 这条对角线。三个标记置 1 后递归下一行，返回时全部置 0。row == n 表示 n 个皇后都放好了，queen_count 加一。\n"
          + "八皇后在 8×8 棋盘上有 92 个解——这个数字可以用自己的程序验证。\n"
          + "注意 queen_count = 0 那一行：回溯结束后棋盘状态已经完全还原，所以可以直接换个规模重算；但计数器必须手动清零，否则会累加。"
      },
      pitfalls: [
        "忘记撤销 `used[i] = 0`：第一个分支的结果污染后面所有分支，输出的排列会缺很多。",
        "八皇后只检查列，忘了两条对角线 → 结果数量远大于正确答案。",
        "diag_up 的下标不加偏移量：row - col 为负时数组越界，程序崩溃或输出乱码。",
        "终止条件写成 `depth == n - 1`：少填一位，每组输出都少一个数字。",
        "全局计数器在多次求解之间没有清零 → 计数累加，答案翻倍。"
      ],
      takeaways: [
        "回溯 = 穷举 + 撤销，模板是「选择 → 递归 → 撤销」",
        "全排列用 used 数组标记已用数字，撤销后才能换下一个分支",
        "八皇后按行放置，用三个标记数组 O(1) 判冲突",
        "剪枝决定回溯能不能在可接受的时间内跑完",
        "全局计数与状态在两次求解之间必须复位"
      ],
      questions: [
        {
          q: "回溯里「撤销选择」这一步的作用是什么？",
          options: [
            "提高程序运行速度",
            "把状态恢复到做选择之前，让其他分支得到正确结果",
            "释放动态申请的内存",
            "可以省略，不影响结果"
          ],
          answer: 1,
          explain: "回溯本质是深度优先的穷举，回到上一层时要像「什么都没发生过」一样继续试下一个分支，所以必须撤销，B 对。A 错：撤销是正确性要求，不是优化。C 错：这里没有动态内存。D 错：省掉撤销会得到错误结果——这正是回溯最经典的 bug。"
        },
        {
          q: "八皇后里 row - col 相同的两个格子，位置关系是？",
          options: [
            "同一行",
            "同一列",
            "同一条「左下—右上」方向的对角线",
            "没有任何关系"
          ],
          answer: 2,
          explain: "沿一个方向走一步是 row+1、col+1（row - col 不变），沿另一个方向走一步是 row+1、col-1（row + col 不变），所以 row - col 相同就是同一条对角线，C 对。A 错：同一行的 row 相同。B 错：同一列的 col 相同。D 错：这正是判断对角线冲突的依据。"
        },
        {
          q: "八皇后里 col_used、diag_down、diag_up 这三个数组的作用是？",
          options: [
            "记录每一行放了几个皇后",
            "保存每个皇后的编号",
            "画出棋盘图形",
            "用 O(1) 的时间判断某一列、两条对角线是否已经有皇后"
          ],
          answer: 3,
          explain: "每放一个皇后就把对应的列标记、两条对角线标记置 1，下一行只需查三个数组就能判断这个位置合不合法，把冲突检查从「遍历所有已放皇后」降到 O(1)，D 对。A、B、C 都不是标记数组的用途——棋盘状态是靠 row 和三个标记数组共同隐含表示的。"
        }
      ],
      passRatio: 0.8,
      mission: "写一个单文件程序，读入一个整数 n（1 ≤ n ≤ 8，例如输入 3），先用回溯输出 1..n 的全部排列（每行一个，数字之间一个空格，按字典序），再输出两行：\n"
        + "1 2 3\n"
        + "1 3 2\n"
        + "2 1 3\n"
        + "2 3 1\n"
        + "3 1 2\n"
        + "3 2 1\n"
        + "permutations = 6\n"
        + "queens(8) = 92\n"
        + "要求：\n"
        + "1) 写递归函数 void permute(int n, int depth)：用 used[i] 标记数字是否已被选、chosen[depth] 记录当前位，递归返回后必须撤销（used[i] = 0）；\n"
        + "2) 写递归函数 void queens(int row, int n)：一行放一个皇后，用列标记数组和两条对角线的标记数组判断冲突，放满 n 行就把计数加一；本关要输出的是 queens(8) 的解数；\n"
        + "3) 输出格式：排列每行一个（数字间一个空格），然后 \"permutations = 总数\"、\"queens(8) = 解数\"；\n"
        + "4) 最后 return 0;。",
      starter: "#include <stdio.h>\n"
        + "\n"
        + "#define MAXN 16\n"
        + "\n"
        + "static int chosen[MAXN];\n"
        + "static int used[MAXN];\n"
        + "static int perm_count = 0;\n"
        + "\n"
        + "/* TODO: print_perm：把 chosen[0..n-1] 用空格连起来打印 */\n"
        + "\n"
        + "/* TODO: permute(n, depth)：填满就打印并计数，否则 for 1..n 选一个没用过的，递归后撤销 */\n"
        + "\n"
        + "static int col_used[MAXN];\n"
        + "static int diag_down[MAXN * 2];\n"
        + "static int diag_up[MAXN * 2];\n"
        + "static int queen_count = 0;\n"
        + "\n"
        + "/* TODO: queens(row, n)：row == n 时计数；否则 for 每一列，检查三个标记后递归并撤销 */\n"
        + "\n"
        + "int main(void) {\n"
        + "    int n = 0;\n"
        + "\n"
        + "    scanf(\"%d\", &n);\n"
        + "    if (n > 8) {\n"
        + "        n = 8;\n"
        + "    }\n"
        + "\n"
        + "    /* TODO: 输出全排列与总数 */\n"
        + "\n"
        + "    /* TODO: 算出并输出 queens(8) */\n"
        + "\n"
        + "    return 0;\n"
        + "}",
      hint: "permute 的三行核心是：used[i] = 1; chosen[depth] = i; permute(n, depth + 1); 紧接着写 used[i] = 0;。queens 里放皇后时三个标记一起置 1，递归后一起置 0；row == n 就是找到一个解。判断冲突的条件写成 !col_used[col] && !diag_down[row + col] && !diag_up[row - col + n]。",
      check: {
        include: ["stdio.h"],
        return0: true,
        calls: [["scanf","%d"],["printf","permutations"],["printf","queens"]],
        require: {"recursion":["permute","queens"],"array":true,"loop":true,"if":true},
        minStatements: 14,
        message: "需要递归的 permute（含 used 撤销）与 queens（含三个标记数组），输出全排列、permutations = 与 queens(8) = 三部分内容，以及 return 0;。",
        ok: "回溯模板、撤销与剪枝都用对了，排列与八皇后结果正确。"
      },
      expectedOutput: "1 2 3\n"
          + "1 3 2\n"
          + "2 1 3\n"
          + "2 3 1\n"
          + "3 1 2\n"
          + "3 2 1\n"
          + "permutations = 6\n"
          + "queens(8) = 92",
      input: "3",
      solution: "#include <stdio.h>\n"
          + "\n"
          + "#define MAXN 16\n"
          + "\n"
          + "static int chosen[MAXN];\n"
          + "static int used[MAXN];\n"
          + "static int perm_count = 0;\n"
          + "\n"
          + "static void print_perm(int n) {\n"
          + "    int i;\n"
          + "    for (i = 0; i < n; i++) {\n"
          + "        if (i > 0) {\n"
          + "            printf(\" \");\n"
          + "        }\n"
          + "        printf(\"%d\", chosen[i]);\n"
          + "    }\n"
          + "    printf(\"\\n\");\n"
          + "}\n"
          + "\n"
          + "/* 全排列：每一位从 1..n 里挑一个没用过的数，递归下一位，返回时撤销（回溯） */\n"
          + "static void permute(int n, int depth) {\n"
          + "    int i;\n"
          + "    if (depth == n) {\n"
          + "        print_perm(n);\n"
          + "        perm_count++;\n"
          + "        return;\n"
          + "    }\n"
          + "    for (i = 1; i <= n; i++) {\n"
          + "        if (!used[i]) {\n"
          + "            used[i] = 1;\n"
          + "            chosen[depth] = i;\n"
          + "            permute(n, depth + 1);\n"
          + "            used[i] = 0;\n"
          + "        }\n"
          + "    }\n"
          + "}\n"
          + "\n"
          + "static int col_used[MAXN];\n"
          + "static int diag_down[MAXN * 2];\n"
          + "static int diag_up[MAXN * 2];\n"
          + "static int queen_count = 0;\n"
          + "\n"
          + "/* 八皇后：一行放一个皇后，列与两条对角线各用一个标记数组查冲突 */\n"
          + "static void queens(int row, int n) {\n"
          + "    int col;\n"
          + "    if (row == n) {\n"
          + "        queen_count++;\n"
          + "        return;\n"
          + "    }\n"
          + "    for (col = 0; col < n; col++) {\n"
          + "        if (!col_used[col] && !diag_down[row + col] && !diag_up[row - col + n]) {\n"
          + "            col_used[col] = 1;\n"
          + "            diag_down[row + col] = 1;\n"
          + "            diag_up[row - col + n] = 1;\n"
          + "            queens(row + 1, n);\n"
          + "            col_used[col] = 0;\n"
          + "            diag_down[row + col] = 0;\n"
          + "            diag_up[row - col + n] = 0;\n"
          + "        }\n"
          + "    }\n"
          + "}\n"
          + "\n"
          + "int main(void) {\n"
          + "    int n = 0;\n"
          + "\n"
          + "    scanf(\"%d\", &n);\n"
          + "    if (n > 8) {\n"
          + "        n = 8;\n"
          + "    }\n"
          + "\n"
          + "    permute(n, 0);\n"
          + "    printf(\"permutations = %d\\n\", perm_count);\n"
          + "\n"
          + "    queens(0, 8);\n"
          + "    printf(\"queens(8) = %d\\n\", queen_count);\n"
          + "    return 0;\n"
          + "}",
      mastery: [
        "能写出「选择 → 递归 → 撤销」的回溯模板，并说明撤销为什么不能省",
        "能独立实现全排列，并解释输出为什么是字典序",
        "能用三个标记数组实现八皇后，并说清剪枝在其中的作用"
      ]
    },
    {
      id: 74,
      title: "动态规划入门：记忆化、0-1 背包与最长公共子序列",
      minutes: 28,
      gist: "用记忆化消除重复计算，用一维数组解 0-1 背包，用二维表解 LCS。",
      lesson: "动态规划（DP）解决的是「有重叠子问题的最优化问题」。先用斐波那契感受一下：按 fib(n) = fib(n-1) + fib(n-2) 直接递归，fib(3) 会被重复计算无数次——n = 20 时函数被调用两万多次，n = 40 就上亿。这些重复计算就是「重叠子问题」。\n"
        + "记忆化（自顶向下）是最容易上手的改造：把算过的结果记在数组里，下次先查表。\n"
        + "static int memo[N];\n"
        + "int fib(int n) {\n"
        + "    if (n < 2) return n;\n"
        + "    if (memo[n] != 0) return memo[n];\n"
        + "    memo[n] = fib(n - 1) + fib(n - 2);\n"
        + "    return memo[n];\n"
        + "}\n"
        + "改完之后每个 n ≥ 2 只真正计算一次（n < 2 由提前返回处理，不再往下展开），整体 O(n) 时间、O(n) 空间，fib(40) 瞬间出结果。\n"
        + "把它倒过来写就是递推（自底向上）：从小到大依次算 fib[i] = fib[i-1] + fib[i-2]。两者结果一样，递推没有递归调用开销，还能把数组压缩成两个变量。\n"
        + "DP 的两个前提是：重叠子问题（同一个子问题被反复用到）和最优子结构（大问题的最优解能由子问题的最优解拼出来）。写 DP 的核心工作就两件事：定义状态、写转移方程。\n"
        + "0-1 背包：n 件物品，每件有重量 w 和价值 v，背包容量 W，每件最多拿一次，求能装下的最大价值。定义 dp[j] 为「容量 j 能装下的最大价值」，转移就是「要么不拿第 i 件，要么拿它」：\n"
        + "dp[j] = max(dp[j], dp[j - w[i]] + v[i])\n"
        + "关键是容量 j 必须从大到小遍历。因为 dp[j - w[i]] 必须是「还没考虑第 i 件物品」时的旧值；从小到大更新会让第 i 件被重复拿进去，那算出来的就不是 0-1 背包而是完全背包。\n"
        + "最长公共子序列（LCS）：给两个字符串，求它们最长的公共子序列长度（子序列不要求连续）。定义 dp[i][j] 为「a 的前 i 个字符与 b 的前 j 个字符的 LCS 长度」，转移分两种情况：\n"
        + "a[i-1] == b[j-1] 时，这两个字符可以配对，dp[i][j] = dp[i-1][j-1] + 1；\n"
        + "否则这两个字符不可能同时出现在答案里，dp[i][j] = max(dp[i-1][j], dp[i][j-1])。\n"
        + "边界是 dp[0][j] = dp[i][0] = 0（有一边是空串时公共子序列长度是 0），最后答案是 dp[la][lb]。\n"
        + "写 DP 时一定要把表格行列的含义写在注释里，否则过两天自己都看不懂。读别人的 DP 代码时，先找状态定义，再看转移方程，最后核对遍历顺序——尤其是背包的从大到小。",
      example: {
        code: "#include <stdio.h>\n"
          + "#include <string.h>\n"
          + "\n"
          + "#define MAXN 64\n"
          + "#define MAXW 64\n"
          + "#define MAXL 64\n"
          + "\n"
          + "static int memo[MAXN];\n"
          + "static int memo_calls = 0;\n"
          + "static int naive_calls = 0;\n"
          + "\n"
          + "/* 记忆化：算过的结果存进 memo，下次直接取出来用 */\n"
          + "static int fib(int n) {\n"
          + "    memo_calls++;\n"
          + "    if (n < 2) {\n"
          + "        return n;\n"
          + "    }\n"
          + "    if (memo[n] != 0) {\n"
          + "        return memo[n];\n"
          + "    }\n"
          + "    memo[n] = fib(n - 1) + fib(n - 2);\n"
          + "    return memo[n];\n"
          + "}\n"
          + "\n"
          + "/* 不做记忆化的版本：同一个 n 会被反复展开计算 */\n"
          + "static int fib_naive(int n) {\n"
          + "    naive_calls++;\n"
          + "    if (n < 2) {\n"
          + "        return n;\n"
          + "    }\n"
          + "    return fib_naive(n - 1) + fib_naive(n - 2);\n"
          + "}\n"
          + "\n"
          + "/* 0-1 背包：dp[j] 是容量 j 能装下的最大价值。\n"
          + "   容量从大到小更新，保证每件物品最多被算进去一次 */\n"
          + "static int knapsack(const int *weight, const int *value, int count, int capacity, int *dp) {\n"
          + "    int i, j;\n"
          + "    for (j = 0; j <= capacity; j++) {\n"
          + "        dp[j] = 0;\n"
          + "    }\n"
          + "    for (i = 0; i < count; i++) {\n"
          + "        for (j = capacity; j >= weight[i]; j--) {\n"
          + "            int take = dp[j - weight[i]] + value[i];\n"
          + "            if (take > dp[j]) {\n"
          + "                dp[j] = take;\n"
          + "            }\n"
          + "        }\n"
          + "    }\n"
          + "    return dp[capacity];\n"
          + "}\n"
          + "\n"
          + "/* 最长公共子序列：dp[i][j] 是 a 的前 i 个字符与 b 的前 j 个字符的 LCS 长度 */\n"
          + "static int lcs_length(const char *a, const char *b, int dp[][MAXL]) {\n"
          + "    int i, j;\n"
          + "    int la = (int)strlen(a);\n"
          + "    int lb = (int)strlen(b);\n"
          + "\n"
          + "    for (i = 0; i <= la; i++) {\n"
          + "        dp[i][0] = 0;\n"
          + "    }\n"
          + "    for (j = 0; j <= lb; j++) {\n"
          + "        dp[0][j] = 0;\n"
          + "    }\n"
          + "    for (i = 1; i <= la; i++) {\n"
          + "        for (j = 1; j <= lb; j++) {\n"
          + "            if (a[i - 1] == b[j - 1]) {\n"
          + "                dp[i][j] = dp[i - 1][j - 1] + 1;\n"
          + "            } else if (dp[i - 1][j] > dp[i][j - 1]) {\n"
          + "                dp[i][j] = dp[i - 1][j];\n"
          + "            } else {\n"
          + "                dp[i][j] = dp[i][j - 1];\n"
          + "            }\n"
          + "        }\n"
          + "    }\n"
          + "    return dp[la][lb];\n"
          + "}\n"
          + "\n"
          + "int main(void) {\n"
          + "    int weight[4] = {1, 3, 4, 5};\n"
          + "    int value[4] = {1, 4, 5, 7};\n"
          + "    int dp[MAXW];\n"
          + "    int table[MAXL][MAXL];\n"
          + "    int n = 0, i, result;\n"
          + "\n"
          + "    scanf(\"%d\", &n);\n"
          + "\n"
          + "    /* 先算小的，让 memo 里已经有一部分结果 */\n"
          + "    memo_calls = 0;\n"
          + "    result = fib(n);\n"
          + "    printf(\"fib(%d) = %d, memo calls = %d\\n\", n, result, memo_calls);\n"
          + "\n"
          + "    memo_calls = 0;\n"
          + "    result = fib(20);\n"
          + "    printf(\"fib(20) = %d, memo calls = %d\\n\", result, memo_calls);\n"
          + "\n"
          + "    result = fib(40);\n"
          + "    printf(\"fib(40) = %d\\n\", result);\n"
          + "\n"
          + "    naive_calls = 0;\n"
          + "    result = fib_naive(20);\n"
          + "    printf(\"fib_naive(20) = %d, naive calls = %d\\n\", result, naive_calls);\n"
          + "\n"
          + "    result = knapsack(weight, value, 4, 7, dp);\n"
          + "    printf(\"knapsack(7) = %d\\n\", result);\n"
          + "    printf(\"dp row:\");\n"
          + "    for (i = 0; i <= 7; i++) {\n"
          + "        printf(\" %d\", dp[i]);\n"
          + "    }\n"
          + "    printf(\"\\n\");\n"
          + "\n"
          + "    printf(\"lcs = %d\\n\", lcs_length(\"ABCBDAB\", \"BDCABA\", table));\n"
          + "    return 0;\n"
          + "}",
        input: "10",
        output: "fib(10) = 55, memo calls = 19\n"
          + "fib(20) = 6765, memo calls = 21\n"
          + "fib(40) = 102334155\n"
          + "fib_naive(20) = 6765, naive calls = 21891\n"
          + "knapsack(7) = 9\n"
          + "dp row: 0 1 1 4 5 7 8 9\n"
          + "lcs = 4",
        explain: "这个例子把三个 DP 入门题放在一个程序里，并且用调用次数把「重复计算」暴露出来。\n"
          + "fib 是记忆化版本：memo_calls 在函数入口加一，先查 memo[n]，没有就算完存回去。fib_naive 是纯递归版本，只有 naive_calls 计数。先算 fib(n)、再算 fib(20)、最后 fib(40)，打印出的调用次数对比非常直观：记忆化下 fib(10) 一共 19 次调用、fib(20) 是 21 次，都在 2n 附近，每个状态只展开一次；纯递归的 fib(20) 却被调用了 21891 次，而且这个数字随 n 指数增长（n 每加 1 大约乘 1.6）。\n"
          + "knapsack 用一维数组：外层遍历物品，内层容量从 capacity 递减到 weight[i]。每轮用 take = dp[j - weight[i]] + value[i] 表示「拿这件物品」的收益，比 dp[j] 大就更新。函数结束后顺便把整行 dp 打印出来（0 1 1 4 5 7 8 9），可以看到每一格都是「容量不超过 j 时的最大价值」。\n"
          + "lcs_length 用 int dp[MAXL][MAXL] 这张表：第 0 行和第 0 列是边界（空串），其余格子按「字符相等取左上角加一，否则取左、上较大者」填。表填完，dp[la][lb] 就是答案 4。\n"
          + "注意 printf 之前先把结果和计数分别存进变量再输出——如果把 fib(n) 和 memo_calls 写在同一个 printf 的参数里，参数求值顺序是未指定的，打印出来的计数可能不对。"
      },
      pitfalls: [
        "记忆化忘了查表或忘了存表 → 退化成普通递归，n 稍大就慢得跑不动。",
        "用 0 当「没算过」的标记，而答案本身可能就是 0（fib(0) = 0）→ 需要额外用 -1 表示未计算，或像本关一样让 n < 2 直接返回。",
        "0-1 背包的容量 j 从小到大遍历 → 同一件物品被拿多次，变成完全背包，答案偏大。",
        "LCS 不判断字符是否相等，直接写 dp[i][j] = max(dp[i-1][j], dp[i][j-1]) + 1 → 答案偏大。",
        "状态定义里「前 i 个」和「第 i 个」混用 → 下标差一，答案差一。",
        "把带计数副作用的函数调用和计数变量写在同一个 printf 的参数列表里 → 参数求值顺序未指定，打印结果可能反了。"
      ],
      takeaways: [
        "DP 的两个前提：重叠子问题 + 最优子结构",
        "记忆化 = 递归 + 备忘录；递推 = 从小到大的表格",
        "0-1 背包：dp[j] = max(dp[j], dp[j-w] + v)，容量必须从大到小更新",
        "LCS：字符相等取左上角加一，否则取左、上中的较大者",
        "先定义状态，再写转移方程，最后核对遍历顺序"
      ],
      questions: [
        {
          q: "给斐波那契加上记忆化之后，时间复杂度从 O(2^n) 降到了？",
          options: [
            "O(1)",
            "O(n)",
            "O(n²)",
            "O(log n)"
          ],
          answer: 1,
          explain: "加备忘录后每个 n 只计算一次，总共 n 个状态，所以是 O(n)（空间也是 O(n)），B 对。A 错：还是要从 0 算到 n。C 错：没有两两组合的表格。D 错：斐波那契没有「每轮减半」的结构。"
        },
        {
          q: "0-1 背包用一维数组时，容量 j 为什么必须从大到小遍历？",
          options: [
            "为了少用内存",
            "为了让下标从 0 开始",
            "因为 dp[j - w] 必须是还没考虑当前物品时的旧值，从小到大更新会让同一件物品被重复拿",
            "为了保持排序稳定性"
          ],
          answer: 2,
          explain: "从大到小更新时，dp[j - w] 还没被本轮修改过，代表「不拿当前物品」的旧状态，正好对应每件物品只拿一次，C 对。A 错：一维数组本身就省内存，和遍历方向无关。B 错：遍历方向不影响下标起点。D 错：背包问题和排序稳定性没有关系。"
        },
        {
          q: "LCS 的转移中，当 a[i-1] != b[j-1] 时 dp[i][j] 等于？",
          options: [
            "dp[i-1][j-1]",
            "dp[i-1][j-1] + 1",
            "0",
            "max(dp[i-1][j], dp[i][j-1])"
          ],
          answer: 3,
          explain: "两个字符不相等，就不可能同时出现在公共子序列里，只能舍弃其中一个，所以取「不要 a 的第 i 个」和「不要 b 的第 j 个」两种情况的较大值，D 对。A、B 都用在字符相等时（相等才取左上角加一）。C 错：某两个字符不等，不代表前面没有公共子序列。"
        }
      ],
      passRatio: 0.8,
      mission: "写一个单文件程序，读入一个整数 n（0 ≤ n ≤ 40，例如输入 10），把三道动态规划题放进同一个程序，输出 3 行：\n"
        + "fib(10) = 55\n"
        + "knapsack = 9\n"
        + "lcs = 4\n"
        + "要求：\n"
        + "1) 写记忆化斐波那契 int fib(int n)：用全局数组 memo 存已经算过的结果，n < 2 直接返回 n，否则先查 memo 再计算并存回去；\n"
        + "2) 0-1 背包：物品重量 {1, 3, 4, 5}、价值 {1, 4, 5, 7}，背包容量 7。写函数 int knapsack(const int *weight, const int *value, int count, int capacity, int *dp)，用一维数组 dp[j] 表示容量 j 的最大价值，容量 j 从大到小遍历；\n"
        + "3) 最长公共子序列：写函数 int lcs_length(const char *a, const char *b, int dp[][64])，对 \"ABCBDAB\" 与 \"BDCABA\" 求 LCS 长度，dp 表要把第 0 行和第 0 列初始化为 0；\n"
        + "4) 第一行用 \"fib(%d) = %d\" 输出输入的 n 与 fib(n)；第二行 \"knapsack = %d\"；第三行 \"lcs = %d\"；\n"
        + "5) 最后 return 0;。",
      starter: "#include <stdio.h>\n"
        + "#include <string.h>\n"
        + "\n"
        + "#define MAXW 64\n"
        + "#define MAXL 64\n"
        + "\n"
        + "static int memo[64];\n"
        + "\n"
        + "/* TODO: fib：记忆化 */\n"
        + "\n"
        + "/* TODO: knapsack：一维 dp，容量从大到小 */\n"
        + "\n"
        + "/* TODO: lcs_length：二维 dp 表 */\n"
        + "\n"
        + "int main(void) {\n"
        + "    int weight[4] = {1, 3, 4, 5};\n"
        + "    int value[4] = {1, 4, 5, 7};\n"
        + "    int dp[MAXW];\n"
        + "    int table[MAXL][MAXL];\n"
        + "    int n = 0;\n"
        + "\n"
        + "    scanf(\"%d\", &n);\n"
        + "\n"
        + "    /* TODO: 三行输出 */\n"
        + "\n"
        + "    return 0;\n"
        + "}",
      hint: "记忆化就三行：先 if (memo[n] != 0) return memo[n];，再 memo[n] = fib(n - 1) + fib(n - 2);，最后 return memo[n];（n < 2 的情况放在最前面）。背包的内层写成 for (j = capacity; j >= weight[i]; j--)，每一步比较 dp[j] 和 dp[j - weight[i]] + value[i]。LCS 先初始化第 0 行第 0 列，再用两重循环按「相等取左上角加一，否则取左、上较大者」填表。",
      check: {
        include: ["stdio.h"],
        return0: true,
        calls: [["scanf","%d"],["printf","fib("],["printf","knapsack"],["printf","lcs"]],
        require: {"recursion":["fib"],"array":true,"loop":true,"if":true},
        minStatements: 16,
        message: "需要记忆化的递归 fib（含 memo 数组）、一维数组实现的 knapsack、二维表实现的 lcs_length，以及 fib( / knapsack / lcs 三行输出和 return 0;。",
        ok: "记忆化、0-1 背包与 LCS 的状态定义和转移都写对了。"
      },
      expectedOutput: "fib(10) = 55\n"
          + "knapsack = 9\n"
          + "lcs = 4",
      input: "10",
      solution: "#include <stdio.h>\n"
          + "#include <string.h>\n"
          + "\n"
          + "#define MAXW 64\n"
          + "#define MAXL 64\n"
          + "\n"
          + "static int memo[64];\n"
          + "\n"
          + "/* 记忆化斐波那契：算过的结果存下来，下次直接取，避免重复展开 */\n"
          + "static int fib(int n) {\n"
          + "    if (n < 2) {\n"
          + "        return n;\n"
          + "    }\n"
          + "    if (memo[n] != 0) {\n"
          + "        return memo[n];\n"
          + "    }\n"
          + "    memo[n] = fib(n - 1) + fib(n - 2);\n"
          + "    return memo[n];\n"
          + "}\n"
          + "\n"
          + "/* 0-1 背包：dp[j] 是容量 j 的最大价值；容量从大到小更新，每件物品只用一次 */\n"
          + "static int knapsack(const int *weight, const int *value, int count, int capacity, int *dp) {\n"
          + "    int i, j;\n"
          + "    for (j = 0; j <= capacity; j++) {\n"
          + "        dp[j] = 0;\n"
          + "    }\n"
          + "    for (i = 0; i < count; i++) {\n"
          + "        for (j = capacity; j >= weight[i]; j--) {\n"
          + "            int take = dp[j - weight[i]] + value[i];\n"
          + "            if (take > dp[j]) {\n"
          + "                dp[j] = take;\n"
          + "            }\n"
          + "        }\n"
          + "    }\n"
          + "    return dp[capacity];\n"
          + "}\n"
          + "\n"
          + "/* 最长公共子序列：dp[i][j] 是 a 前 i 个字符与 b 前 j 个字符的 LCS 长度 */\n"
          + "static int lcs_length(const char *a, const char *b, int dp[][MAXL]) {\n"
          + "    int i, j;\n"
          + "    int la = (int)strlen(a);\n"
          + "    int lb = (int)strlen(b);\n"
          + "\n"
          + "    for (i = 0; i <= la; i++) {\n"
          + "        dp[i][0] = 0;\n"
          + "    }\n"
          + "    for (j = 0; j <= lb; j++) {\n"
          + "        dp[0][j] = 0;\n"
          + "    }\n"
          + "    for (i = 1; i <= la; i++) {\n"
          + "        for (j = 1; j <= lb; j++) {\n"
          + "            if (a[i - 1] == b[j - 1]) {\n"
          + "                dp[i][j] = dp[i - 1][j - 1] + 1;\n"
          + "            } else if (dp[i - 1][j] > dp[i][j - 1]) {\n"
          + "                dp[i][j] = dp[i - 1][j];\n"
          + "            } else {\n"
          + "                dp[i][j] = dp[i][j - 1];\n"
          + "            }\n"
          + "        }\n"
          + "    }\n"
          + "    return dp[la][lb];\n"
          + "}\n"
          + "\n"
          + "int main(void) {\n"
          + "    int weight[4] = {1, 3, 4, 5};\n"
          + "    int value[4] = {1, 4, 5, 7};\n"
          + "    int dp[MAXW];\n"
          + "    int table[MAXL][MAXL];\n"
          + "    int n = 0;\n"
          + "\n"
          + "    scanf(\"%d\", &n);\n"
          + "\n"
          + "    printf(\"fib(%d) = %d\\n\", n, fib(n));\n"
          + "    printf(\"knapsack = %d\\n\", knapsack(weight, value, 4, 7, dp));\n"
          + "    printf(\"lcs = %d\\n\", lcs_length(\"ABCBDAB\", \"BDCABA\", table));\n"
          + "    return 0;\n"
          + "}",
      mastery: [
        "能把重复递归改造成记忆化，并说明它为什么是 O(n)",
        "能写出 0-1 背包的一维转移，并解释容量为什么要从大到小",
        "能定义 LCS 的二维状态、写出转移方程并填表求值"
      ]
    }
  ]
});
