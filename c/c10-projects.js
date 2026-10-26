/* ============================================================================
 * HT Lab · C 语言课程 · 模块 10 · 综合项目
 * 关卡 id：81–86（课程收官模块，6 个由易到难的综合项目）
 * 每关的示例代码与标准答案都在本机用 gcc 4.9.2 真编译（-std=c11 -Wall -Wextra，零警告）
 * 真运行过，example.output / expectedOutput 是实际输出；输入见 example.input / input。
 * ==========================================================================*/
window.C_MODULES = window.C_MODULES || [];
window.C_MODULES.push({
  id: "c10",
  name: "模块 10 · 综合项目",
  levels: [
    {
      id: 81,
      title: "项目一：命令行计算器",
      minutes: 25,
      gist: "第一个完整小工具：读入 `7 * 6` 形式的表达式，用 switch 分发运算符，把除零与非法运算符都说清楚。",
      lesson: "命令行计算器是最小的「输入 → 处理 → 输出」闭环：读入一行表达式，算出结果，把答案按统一格式打印出来。它小到一次就能看懂，却已经包含后面每个项目都要用的四步：读入、校验、分发、报告结果。\n"
      + "先说读入。表达式写成 7 * 6，中间用空格分开，一条 scanf(\"%d %c %d\", &a, &op, &b) 就能一次读完三段。这里有个细节：%d 会自动跳过前面的空白字符，而 %c 不会——所以格式串里 %c 前面那个空格必须写，它负责跳过 7 和 * 之间的空白；少了它，op 读到的就是空格本身。第 3 关讲过这件事，这里是它第一次变成「必须记住」的工程细节。\n"
      + "再说循环条件。scanf 的返回值是「成功转换并赋值的项数」：三项都读到才返回 3。所以 while (scanf(...) == 3) 的意思是「只要还能读到一条合法表达式就继续算」。写成 != EOF 看起来也能跑，但它把 abc 这类读不出数字的输入（返回 0）当成正常数据，程序会拿着上一轮的旧值继续算，输出一串看着合理其实错误的结果——这是最难查的一类 bug。读到文件结束（EOF）时循环自然结束，不需要额外判断。\n"
      + "计算部分为什么要单独写成函数？因为「算」和「怎么报告错误」是两件事。calc 用返回值表示状态：0 成功、-1 除数为零、-2 运算符不认识；真正的结果通过最后一个参数 int *result 带出来。C 的函数只能返回一个值，这种「返回状态码 + 输出参数」是最常见的解法，你在标准库里会反复看到它（scanf 返回项数、fread 返回读到的元素个数，都是这个套路）。\n"
      + "除零必须提前拦住：整数除以 0 在 C 里是未定义行为——不是「得到 0」，也不是「报个错」，程序可能直接崩溃，也可能算出任意结果。写法只有一种：在 a / b 之前判断 b == 0，成立就走错误分支，绝不让除法真的执行。另外记住整数除法是向零截断的（9 / 4 得 2），要小数就得把操作数转成浮点，本关按整数算。\n"
      + "怎么读别人的代码：看到一个函数签名 int calc(int a, char op, int b, int *result)，先看返回值表达了哪些状态，再看哪个参数是指针——指针参数往往就是「输出参数」。这套约定让调用者能明确区分「算出来就是 0」和「根本没算出来」，这正是项目代码比练习代码可靠的地方。",
      example: {
        code: "#include <stdio.h>\n"
        + "\n"
        + "/* 计算 a op b：成功返回 0，除数为 0 返回 -1，运算符不认识返回 -2 */\n"
        + "static int calc(int a, char op, int b, int *result) {\n"
        + "    switch (op) {\n"
        + "    case '+':\n"
        + "        *result = a + b;\n"
        + "        return 0;\n"
        + "    case '-':\n"
        + "        *result = a - b;\n"
        + "        return 0;\n"
        + "    case '*':\n"
        + "        *result = a * b;\n"
        + "        return 0;\n"
        + "    case '/':\n"
        + "        if (b == 0) {\n"
        + "            return -1;\n"
        + "        }\n"
        + "        *result = a / b;\n"
        + "        return 0;\n"
        + "    default:\n"
        + "        return -2;\n"
        + "    }\n"
        + "}\n"
        + "\n"
        + "int main(void) {\n"
        + "    int a = 0;\n"
        + "    int b = 0;\n"
        + "    int result = 0;\n"
        + "    char op = '?';\n"
        + "\n"
        + "    /* 一行一条表达式，算到输入结束为止；scanf 返回 3 表示三项都读到了 */\n"
        + "    while (scanf(\"%d %c %d\", &a, &op, &b) == 3) {\n"
        + "        int status = calc(a, op, b, &result);\n"
        + "\n"
        + "        if (status == 0) {\n"
        + "            printf(\"%d %c %d = %d\\n\", a, op, b, result);\n"
        + "        } else if (status == -1) {\n"
        + "            printf(\"%d %c %d = error: division by zero\\n\", a, op, b);\n"
        + "        } else {\n"
        + "            printf(\"%d %c %d = error: unknown operator '%c'\\n\", a, op, b, op);\n"
        + "        }\n"
        + "    }\n"
        + "    return 0;\n"
        + "}",
        input: "7 * 6\n"
        + "9 / 0\n"
        + "5 ^ 3",
        output: "7 * 6 = 42\n"
        + "9 / 0 = error: division by zero\n"
        + "5 ^ 3 = error: unknown operator '^'",
        explain: "程序分两层：calc 负责一条表达式的计算与错误分类，main 负责「读—算—打印」的循环。\n"
        + "calc 用 switch 分发四个运算符，default 分支接住其他字符；除法的 case 里第一件事就是判断 b == 0，成立就直接返回 -1，绝不执行 a / b。\n"
        + "main 里 while (scanf(\"%d %c %d\", &a, &op, &b) == 3) 要求三条数据都读到才算一条合法输入；拿到 status 后用 if / else if / else 三路打印：成功输出 %d %c %d = %d，除零输出固定文案，未知运算符把那个字符用 %c 一起回显出来。\n"
        + "示例输入是 7 * 6、9 / 0、5 ^ 3 三行，一次跑完就同时看到了成功、除零、非法运算符三种结果。"
      },
      pitfalls: [
        "格式串里漏掉 %c 前的空格：写成 scanf(\"%d%c%d\", …) 会把 7 和 * 之间的空格读进 op，后面全部错位。",
        "循环条件写成 != EOF（或 != 0）：输入 abc 时 scanf 返回 0，程序会拿着上一轮的 a、b 继续算，输出看着正常但全是错的。",
        "除零不判断或只判断一次：b 为 0 时 a / b 是未定义行为，常见表现是程序直接崩溃。",
        "把状态码和结果混在一起：用返回值既表示结果又表示错误，于是「-1 到底是算出来的还是出错」分不清——状态与结果必须分开传。",
        "把本关的除法写成浮点（%.2f 或 (double)）：任务要求整数除法（9 / 4 得 2），格式符和输出都要用 %d。",
        "忘了 return 0;：main 的返回值是给操作系统和脚本看的，正常结束一律返回 0。"
      ],
      takeaways: [
        "表达式用一条 scanf(\"%d %c %d\", …) 读入，%c 前的空格负责跳过空白",
        "循环条件写 == 3：三项都读到才算合法输入，读不动了就结束",
        "计算逻辑放进 calc()：返回值给状态（0 / -1 / -2），结果用 int *result 带出",
        "做除法前必须拦住 b == 0；整数除法向零截断（9 / 4 得 2）",
        "错误信息的格式要统一，人和脚本都好核对"
      ],
      questions: [
        {
          q: "读入表达式的循环写成 `while (scanf(\"%d %c %d\", &a, &op, &b) == 3)`，为什么用 `== 3` 而不是 `!= EOF`？",
          options: [
            "因为 3 是成功转换并赋值的项数：三项都读到才返回 3；用 != EOF 会把读不出数字的输入也当成合法数据",
            "因为 scanf 遇到文件结束时会返回 3",
            "因为写成 != EOF 编译器会报错",
            "因为 scanf 只可能返回 3 或 EOF"
          ],
          answer: 0,
          explain: "scanf 的返回值是「成功赋值的项数」，合法表达式恰好返回 3，所以 A 对。B 错：文件结束且一项都没读到时返回 EOF（通常是 -1）。C 错：!= EOF 完全合法，只是判断不严——输入 abc 时 scanf 返回 0，循环会继续，程序用旧值接着算。D 错：它还可能返回 0、1、2，这些情况都说明输入不合法。"
        },
        {
          q: "计算器的除法分支里，除零应该怎么处理？",
          options: [
            "先算 a / b，再看结果是不是 0",
            "直接算 a / b，C 语言会自动处理除零",
            "在除法发生之前判断 b == 0，成立就打印错误、不做除法",
            "在程序开头判断一次 b 是否为 0 就够了"
          ],
          answer: 2,
          explain: "整数除以 0 是未定义行为，唯一安全的做法是「除之前拦住」，所以 C 对。A 错：除法已经执行了，崩溃或错误结果都可能发生。B 错：C 不会替你检查，这正是它比很多语言更危险的地方。D 错：b 是每一条表达式重新读进来的，必须在每条表达式的除法前判断。"
        },
        {
          q: "把计算逻辑写成 `int calc(int a, char op, int b, int *result)`，这样的设计好在哪里？",
          options: [
            "返回值给状态（成功 / 除零 / 未知运算符），结果通过指针参数带出，调用者能区分「结果是 0」和「没算出来」",
            "C 语言规定函数只能有一个返回值，所以必须这么写才能同时返回两样东西",
            "指针参数没必要，把 result 定义成全局变量更好",
            "状态码必须以 0 表示失败，这样写才符合标准"
          ],
          answer: 0,
          explain: "「返回状态码 + 输出参数」是 C 里处理「一个函数要交代两件事」的标准套路，A 对。B 错：一个函数确实只能有一个返回值，但这不是唯一解法，也可以用全局变量或结构体，只是指针输出参数最直接。C 错：全局变量会引入隐式依赖，函数不再自包含，调用两次还可能互相干扰。D 错：状态码的含义由你自己定义，本关约定 0 表示成功反而更常见。"
        }
      ],
      passRatio: 0.8,
      mission: "写一个命令行计算器：从标准输入连续读入表达式，每行一条、形如 `7 * 6`（两个整数中间夹一个运算符），一直算到输入结束，逐条打印结果。\n"
      + "要求：\n"
      + "1) 读入用 scanf(\"%d %c %d\", &a, &op, &b)（%c 前的空格不能省），循环条件写 == 3；\n"
      + "2) 自己定义函数 int calc(int a, char op, int b, int *result)：返回 0 表示算好了、-1 表示除数为 0、-2 表示运算符不认识，结果通过 *result 带出来；\n"
      + "3) 三种输出格式照抄下面这三条 printf：\n"
      + "　　正常：printf(\"%d %c %d = %d\\n\", a, op, b, result);　→ 例如 7 * 6 = 42\n"
      + "　　除零：printf(\"%d %c %d = error: division by zero\\n\", a, op, b);\n"
      + "　　未知：printf(\"%d %c %d = error: unknown operator '%c'\\n\", a, op, b, op);\n"
      + "4) 除法按整数规则（向零截断），不要引入 double；\n"
      + "5) 最后 return 0;。\n"
      + "本关会喂给程序 5 行输入（就是「运行结果比对」里的真实输入）：\n"
      + "12 + 30\n"
      + "100 - 45\n"
      + "6 * 7\n"
      + "9 / 4\n"
      + "8 / 0\n"
      + "也就是：12 + 30 → 42、100 - 45 → 55、6 * 7 → 42、9 / 4 → 2（整数除法）、8 / 0 → error: division by zero。编译运行后把输出原样粘贴到比对区。",
      starter: "#include <stdio.h>\n"
      + "\n"
      + "/* TODO: 写 int calc(int a, char op, int b, int *result)\n"
      + "   返回 0 = 成功，-1 = 除数为 0，-2 = 运算符不认识 */\n"
      + "\n"
      + "int main(void) {\n"
      + "    int a = 0;\n"
      + "    int b = 0;\n"
      + "    int result = 0;\n"
      + "    char op = '?';\n"
      + "\n"
      + "    /* TODO: while (scanf(\"%d %c %d\", &a, &op, &b) == 3) { … 三路打印 } */\n"
      + "\n"
      + "    return 0;\n"
      + "}",
      hint: "先写 calc：switch 分发四个运算符，除法的 case 里第一件事就是 if (b == 0) { return -1; }。再写 main 的循环：条件写 scanf 的返回值 == 3，循环体里先 status = calc(a, op, b, &result);，再按 0 / -1 / 其他三路打印。写完在本机跑一次，输入就用任务里给的那 5 行。",
      check: {
        include: ["stdio.h"],
        return0: true,
        calls: [["scanf", "%c"], ["printf", "="]],
        forbid: ["gets"],
        require: { if: true, loop: true, funcs: ["calc"] },
        minStatements: 8,
        message: "需要 #include <stdio.h>、自己定义的 calc() 函数、用 scanf(\"%d %c %d\", …) 的读入循环、三路 printf（正常 / 除零 / 未知运算符）以及 return 0;。",
        ok: "读入、switch 分发、除零保护与状态码都写对了，结构完整。",
      },
      expectedOutput: "12 + 30 = 42\n"
      + "100 - 45 = 55\n"
      + "6 * 7 = 42\n"
      + "9 / 4 = 2\n"
      + "8 / 0 = error: division by zero",
      input: "12 + 30\n"
      + "100 - 45\n"
      + "6 * 7\n"
      + "9 / 4\n"
      + "8 / 0",
      solution: "#include <stdio.h>\n"
      + "\n"
      + "/* 计算 a op b：成功返回 0，除数为 0 返回 -1，运算符不认识返回 -2 */\n"
      + "static int calc(int a, char op, int b, int *result) {\n"
      + "    switch (op) {\n"
      + "    case '+':\n"
      + "        *result = a + b;\n"
      + "        return 0;\n"
      + "    case '-':\n"
      + "        *result = a - b;\n"
      + "        return 0;\n"
      + "    case '*':\n"
      + "        *result = a * b;\n"
      + "        return 0;\n"
      + "    case '/':\n"
      + "        if (b == 0) {\n"
      + "            return -1;\n"
      + "        }\n"
      + "        *result = a / b;\n"
      + "        return 0;\n"
      + "    default:\n"
      + "        return -2;\n"
      + "    }\n"
      + "}\n"
      + "\n"
      + "int main(void) {\n"
      + "    int a = 0;\n"
      + "    int b = 0;\n"
      + "    int result = 0;\n"
      + "    char op = '?';\n"
      + "\n"
      + "    while (scanf(\"%d %c %d\", &a, &op, &b) == 3) {\n"
      + "        int status = calc(a, op, b, &result);\n"
      + "\n"
      + "        if (status == 0) {\n"
      + "            printf(\"%d %c %d = %d\\n\", a, op, b, result);\n"
      + "        } else if (status == -1) {\n"
      + "            printf(\"%d %c %d = error: division by zero\\n\", a, op, b);\n"
      + "        } else {\n"
      + "            printf(\"%d %c %d = error: unknown operator '%c'\\n\", a, op, b, op);\n"
      + "        }\n"
      + "    }\n"
      + "    return 0;\n"
      + "}",
      mastery: [
        "能独立写出「读入—分发—计算—报错」的完整小工具，并为每类错误定义状态码",
        "能解释循环条件为什么写 == 3，而不是 != EOF",
        "能在做除法前拦住除零，并说出整数除零为什么危险",
        "能读懂「返回状态 + 指针输出参数」的函数签名"
      ]
    },
    {
      id: 82,
      title: "项目二：通讯录（结构体数组 + 菜单 + 文件持久化）",
      minutes: 35,
      gist: "把结构体数组、命令菜单和文件读写合起来：做一个能存盘、能读回的通讯录，输出完全可复现。",
      lesson: "通讯录要解决的是「一组结构相同的数据怎么存、怎么改、怎么留在磁盘上」。C 里表示这种列表的标准做法是两件套：一个结构体数组装数据，一个整数记录「当前有多少条」。数组名作为实参会退化成指针，所以函数签名统一写成 (struct Contact *book, int count)——长度跟数据一起传，你一定在标准库里见过同样的形状（fread(ptr, size, count, fp) 就是「指针 + 长度」）。\n"
      + "为什么不用「空字符串表示结束」？因为计数变量让遍历、追加、保存都变成简单的 for 循环；而数组里未使用的位置本来就装着垃圾值，靠内容判断「到哪结束」不可靠。记住一条：在 C 里，数组和它的长度必须一起传递，谁也不能单独代表这个列表。\n"
      + "菜单循环用 while (scanf(\"%d\", &command) == 1 && command != 0)：读到一个整数就处理一条命令，读到输入结束或 0 就退出。每个分支只做一件事：1 追加、2 打印、3 存盘、4 读回。命令后面的数据由分支自己再读：scanf(\"%15s %15s\", name, phone)。注意 %15s 里的 15——它是「最多写 15 个字符再加一个 '\\0'」的上限，正好配 char name[16]。不写宽度，输入一个超长字符串就会写越界，这是 C 里最经典的缓冲区溢出。\n"
      + "存文件要读写配对。写用 fprintf(fp, \"%s %s\\n\", …) 一条记录一行；读用 fscanf(fp, \"%15s %15s\", …) == 2 判断这一行是不是两条都读到了。格式串必须一一对应，宽度也必须限制，否则读回时长字段同样会写越界。\n"
      + "错误处理不能省：fopen 失败会返回 NULL，此时若继续 fprintf，程序会解引用空指针直接崩溃；所以每个 fopen 后面都要紧跟 if (fp == NULL) 分支，打印原因并返回。fclose 也必须调用——不关文件，缓冲区里的数据可能还没落盘，别人读到的就是半截文件。\n"
      + "最后是「可复现」这个工程习惯：示例在开头和结尾都调用 remove(\"contacts.txt\")，清掉上一次运行留下的文件，这样同一个输入脚本每次跑出来的输出都一样。凡是会写文件的演示，都要先想清楚「上一次的残留会不会影响这一次」。\n"
      + "怎么读别人的代码：先找 struct 定义（数据长什么样），再找函数清单（能对它做什么），最后看 main 里的命令循环（人怎么用它）。这三步能把一个陌生项目在几分钟内看出轮廓。",
      example: {
        code: "#include <stdio.h>\n"
        + "\n"
        + "#define MAX_CONTACTS 50\n"
        + "#define NAME_LEN 16\n"
        + "#define PHONE_LEN 16\n"
        + "#define FILE_NAME \"contacts.txt\"\n"
        + "\n"
        + "struct Contact {\n"
        + "    char name[NAME_LEN];\n"
        + "    char phone[PHONE_LEN];\n"
        + "};\n"
        + "\n"
        + "/* 有界拷贝：最多写 size-1 个字符再补 '\\0'，不会越界 */\n"
        + "static void copy_text(char *dst, int size, const char *src) {\n"
        + "    int i = 0;\n"
        + "\n"
        + "    while (i < size - 1 && src[i] != '\\0') {\n"
        + "        dst[i] = src[i];\n"
        + "        i++;\n"
        + "    }\n"
        + "    dst[i] = '\\0';\n"
        + "}\n"
        + "\n"
        + "/* 追加一条记录，返回追加后的条数 */\n"
        + "static int add_contact(struct Contact *book, int count, const char *name, const char *phone) {\n"
        + "    if (count >= MAX_CONTACTS) {\n"
        + "        printf(\"Address book is full.\\n\");\n"
        + "        return count;\n"
        + "    }\n"
        + "    copy_text(book[count].name, NAME_LEN, name);\n"
        + "    copy_text(book[count].phone, PHONE_LEN, phone);\n"
        + "    printf(\"Added: %s %s\\n\", book[count].name, book[count].phone);\n"
        + "    return count + 1;\n"
        + "}\n"
        + "\n"
        + "static void list_contacts(const struct Contact *book, int count) {\n"
        + "    int i;\n"
        + "\n"
        + "    printf(\"-- %d contact(s) --\\n\", count);\n"
        + "    for (i = 0; i < count; i++) {\n"
        + "        printf(\"%d. %s %s\\n\", i + 1, book[i].name, book[i].phone);\n"
        + "    }\n"
        + "}\n"
        + "\n"
        + "static void save_contacts(const struct Contact *book, int count) {\n"
        + "    FILE *fp = fopen(FILE_NAME, \"w\");\n"
        + "    int i;\n"
        + "\n"
        + "    if (fp == NULL) {\n"
        + "        printf(\"Cannot write %s\\n\", FILE_NAME);\n"
        + "        return;\n"
        + "    }\n"
        + "    for (i = 0; i < count; i++) {\n"
        + "        fprintf(fp, \"%s %s\\n\", book[i].name, book[i].phone);\n"
        + "    }\n"
        + "    fclose(fp);\n"
        + "    printf(\"Saved %d contact(s) to %s\\n\", count, FILE_NAME);\n"
        + "}\n"
        + "\n"
        + "static int load_contacts(struct Contact *book, int max) {\n"
        + "    FILE *fp = fopen(FILE_NAME, \"r\");\n"
        + "    int count = 0;\n"
        + "\n"
        + "    if (fp == NULL) {\n"
        + "        printf(\"Cannot read %s\\n\", FILE_NAME);\n"
        + "        return 0;\n"
        + "    }\n"
        + "    while (count < max && fscanf(fp, \"%15s %15s\", book[count].name, book[count].phone) == 2) {\n"
        + "        count++;\n"
        + "    }\n"
        + "    fclose(fp);\n"
        + "    printf(\"Loaded %d contact(s) from %s\\n\", count, FILE_NAME);\n"
        + "    return count;\n"
        + "}\n"
        + "\n"
        + "int main(void) {\n"
        + "    struct Contact book[MAX_CONTACTS];\n"
        + "    int count = 0;\n"
        + "    int command = -1;\n"
        + "\n"
        + "    remove(FILE_NAME); /* 清掉上次运行留下的文件，让演示每次都可复现 */\n"
        + "\n"
        + "    printf(\"Commands: 1=add 2=list 3=save 4=load 0=quit\\n\");\n"
        + "    while (scanf(\"%d\", &command) == 1 && command != 0) {\n"
        + "        if (command == 1) {\n"
        + "            char name[NAME_LEN] = {0};\n"
        + "            char phone[PHONE_LEN] = {0};\n"
        + "\n"
        + "            if (scanf(\"%15s %15s\", name, phone) != 2) {\n"
        + "                printf(\"Bad input: expected <name> <phone>\\n\");\n"
        + "                break;\n"
        + "            }\n"
        + "            count = add_contact(book, count, name, phone);\n"
        + "        } else if (command == 2) {\n"
        + "            list_contacts(book, count);\n"
        + "        } else if (command == 3) {\n"
        + "            save_contacts(book, count);\n"
        + "        } else if (command == 4) {\n"
        + "            count = load_contacts(book, MAX_CONTACTS);\n"
        + "        } else {\n"
        + "            printf(\"Unknown command: %d\\n\", command);\n"
        + "        }\n"
        + "    }\n"
        + "    remove(FILE_NAME); /* 演示结束，删掉临时文件 */\n"
        + "    printf(\"Bye.\\n\");\n"
        + "    return 0;\n"
        + "}",
        input: "1 Alice 13800000001\n"
        + "1 Bob 13900000002\n"
        + "2\n"
        + "3\n"
        + "4\n"
        + "2\n"
        + "0",
        output: "Commands: 1=add 2=list 3=save 4=load 0=quit\n"
        + "Added: Alice 13800000001\n"
        + "Added: Bob 13900000002\n"
        + "-- 2 contact(s) --\n"
        + "1. Alice 13800000001\n"
        + "2. Bob 13900000002\n"
        + "Saved 2 contact(s) to contacts.txt\n"
        + "Loaded 2 contact(s) from contacts.txt\n"
        + "-- 2 contact(s) --\n"
        + "1. Alice 13800000001\n"
        + "2. Bob 13900000002\n"
        + "Bye.",
        explain: "程序按「数据结构 → 操作函数 → 命令循环」三层组织。顶部定义 struct Contact 与四个宏：MAX_CONTACTS 是容量上限，NAME_LEN / PHONE_LEN 是字段长度，FILE_NAME 是存档文件名。\n"
        + "copy_text 是有界拷贝：最多写 size-1 个字符再补 '\\0'。用它代替 strcpy，是因为 strcpy 不检查目标空间大小，源字符串一长就写越界。\n"
        + "add_contact 负责容量检查、拷贝、打印 Added 行，并把新的条数返回给调用者——注意 main 里写的是 count = add_contact(book, count, name, phone);，条数始终由函数返回，只有一处维护。\n"
        + "list_contacts 用 for 遍历 0..count-1；save_contacts 用 fopen(\"w\") + fprintf 逐行写 + fclose；load_contacts 用 fopen(\"r\") + fscanf(fp, \"%15s %15s\", …) == 2 循环读，读到读不动为止。\n"
        + "main 先 remove 清场、打印一次菜单，再用 while (scanf(\"%d\", &command) == 1 && command != 0) 分发命令；退出前再 remove 一次并打印 Bye.。\n"
        + "示例喂进去的脚本是 1 Alice 13800000001 / 1 Bob 13900000002 / 2 / 3 / 4 / 2 / 0 共七行（每行一条命令），所以能完整看到「录两条 → 列表 → 存盘 → 读回 → 再列表」的来回，两次列表内容一模一样，说明读回成功。"
      },
      pitfalls: [
        "只传数组不传长度：函数里用 sizeof(book) / sizeof(book[0]) 算条数——数组参数已经退化成指针，sizeof 得到的是指针大小（本机 8），不是数组长度。",
        "用 strcpy 拷贝输入的姓名：不检查目标空间，超长输入直接写越界；本关统一用有界拷贝或带宽度的 %15s。",
        "fopen 之后不检查 NULL：路径不可写时 fopen 返回 NULL，继续 fprintf 就是解引用空指针。",
        "忘记 fclose：数据可能还在缓冲区里没落盘，程序一退出文件就是半截的。",
        "fscanf 的格式串不限制宽度：读回时 %s 一样会溢出，必须和写入时对称地写 %15s。",
        "保存和读回的格式不一致：写入用 %s %s\\n，读回却按逗号分隔，字段就全乱了。",
        "把「容量」和「条数」混用：容量是 MAX_CONTACTS，当前条数是 count；混用会让容量检查失效，最终写越界。"
      ],
      takeaways: [
        "列表 = 结构体数组 + 条数，两件必须一起传递",
        "菜单用 while (scanf(...) == 1 && cmd != 0) 驱动，每个分支只做一件事",
        "字符串读写都要限制宽度（%15s 或有界拷贝），不要用 strcpy",
        "fopen 必须检查 NULL，用完必须 fclose；写和读的格式要对称",
        "会写文件的演示要清场（remove），输出才能复现"
      ],
      questions: [
        {
          q: "结构体数组 `struct Contact book[50];` 中，表达式 `book[i].name` 的类型是？",
          options: [
            "char（一个字符）",
            "char *（一个指针变量）",
            "char[16]（数组；作为函数实参时会退化成指向首字符的 char *）",
            "struct Contact"
          ],
          answer: 2,
          explain: "name 是 char[16] 数组，sizeof(book[i].name) 是 16，所以 C 对。A 错：char 只存一个字符，那是 name 里元素的类型。B 错：name 本身是数组不是指针变量，只是在传给函数时退化成 char *。D 错：book[i] 才是 struct Contact。"
        },
        {
          q: "用 `fscanf(fp, \"%15s %15s\", …)` 读回联系人时，为什么要写 15 而不是直接写 %s？",
          options: [
            "写 15 能加快读取速度",
            "15 表示一次读 15 行",
            "%s 在 fscanf 的格式串里非法，必须带宽度",
            "限制最多写 15 个字符（再加 '\\0'），防止超长字段写越界"
          ],
          answer: 3,
          explain: "宽度是「最多读入多少个字符」的上限，配 char name[16] 正好给 '\\0' 留出位置，所以 D 对。C 错：%s 完全合法，只是没有上限，这是最常见的溢出源。A、B 都是编造的语义——宽度不加快速读，也不是行数。"
        },
        {
          q: "`FILE *fp = fopen(\"contacts.txt\", \"w\");` 之后紧跟 `if (fp == NULL) { … }`，这一步的意义是？",
          options: [
            "fopen 失败（路径不可写、磁盘满等）会返回 NULL，不检查就 fprintf 会解引用空指针",
            "文件不存在时 fopen 会自动创建，所以这个分支永远不会成立",
            "NULL 表示文件是空的，检查它是为了提示用户文件里没内容",
            "这个判断应该放在 fclose 之后才有意义"
          ],
          answer: 0,
          explain: "fopen 打开失败时返回 NULL，这是 C 表示「打开失败」的唯一方式，必须在第一次使用 fp 之前检查，所以 A 对、D 错。B 错：\"w\" 确实会创建文件，但创建失败（目录不存在、只读、磁盘满）时照样返回 NULL。C 错：空文件是「打开成功但读到 0 条记录」，和 NULL 完全是两回事。"
        }
      ],
      passRatio: 0.8,
      mission: "写一个通讯录程序：结构体数组 + 数字菜单 + 文件持久化。\n"
      + "【数据结构与函数】\n"
      + "结构体必须叫 struct Contact（tag 名就是 Contact），建议字段 char name[16]; char phone[16];；用 struct Contact book[50]; 存记录，另用 int count 记当前条数。必须自己定义这四个函数：add_contact、list_contacts、save_contacts、load_contacts。\n"
      + "【命令循环】\n"
      + "每轮读一个整数命令（scanf(\"%d\", &command)），0 退出；程序开始时先打印一行菜单：\n"
      + "printf(\"Commands: 1=add 2=list 3=save 4=load 0=quit\\n\");\n"
      + "1 = add：紧接着读一行 <name> <phone>（用 scanf(\"%15s %15s\", …)，宽度必须限制）\n"
      + "2 = list　3 = save　4 = load　0 = quit\n"
      + "【输出格式】照抄下面这几行（%s / %d 处填实际数据）：\n"
      + "Added: <name> <phone>\n"
      + "-- <n> contact(s) --\n"
      + "<编号>. <name> <phone>　　（列表里每条一行，编号从 1 开始）\n"
      + "Saved <n> contact(s) to contacts.txt\n"
      + "Loaded <n> contact(s) from contacts.txt\n"
      + "Bye.　　（退出前打印）\n"
      + "【必须处理的错误】fopen 的返回值要检查（为 NULL 就打印原因并返回）；fscanf 读回要用 == 2 判断；不许用 strcpy（用自己写的长度受限拷贝，或直接靠 %15s 读进来）。\n"
      + "【可复现】程序开始时先 remove(\"contacts.txt\") 清掉残留，结束前再 remove 一次删掉文件。\n"
      + "本关喂给程序的输入脚本：\n"
      + "1 Cara 13700000003\n"
      + "1 Dan 13600000004\n"
      + "1 Eve 13500000005\n"
      + "2\n"
      + "3\n"
      + "4\n"
      + "2\n"
      + "0\n"
      + "也就是：录三个人 → 列表（3 条）→ 存盘 → 读回 → 再列表（还是 3 条）→ 退出。预期输出见「运行结果比对」。",
      starter: "#include <stdio.h>\n"
      + "\n"
      + "#define MAX_CONTACTS 50\n"
      + "#define NAME_LEN 16\n"
      + "#define PHONE_LEN 16\n"
      + "#define FILE_NAME \"contacts.txt\"\n"
      + "\n"
      + "struct Contact {\n"
      + "    char name[NAME_LEN];\n"
      + "    char phone[PHONE_LEN];\n"
      + "};\n"
      + "\n"
      + "/* TODO: add_contact / list_contacts / save_contacts / load_contacts 四个函数 */\n"
      + "\n"
      + "int main(void) {\n"
      + "    struct Contact book[MAX_CONTACTS];\n"
      + "    int count = 0;\n"
      + "    int command = -1;\n"
      + "\n"
      + "    remove(FILE_NAME);\n"
      + "    printf(\"Commands: 1=add 2=list 3=save 4=load 0=quit\\n\");\n"
      + "\n"
      + "    /* TODO: while (scanf(\"%d\", &command) == 1 && command != 0) { 分发 1/2/3/4 } */\n"
      + "\n"
      + "    remove(FILE_NAME);\n"
      + "    printf(\"Bye.\\n\");\n"
      + "    return 0;\n"
      + "}",
      hint: "顺序建议：struct → add/list → save/load → main 的命令循环。add_contact 里用「函数返回新条数」的写法（count = add_contact(book, count, name, phone);），条数只有一处维护。读回写成 while (count < MAX_CONTACTS && fscanf(fp, \"%15s %15s\", book[count].name, book[count].phone) == 2) { count++; }。",
      check: {
        include: ["stdio.h"],
        return0: true,
        calls: [["printf", "Commands"], ["scanf", "%d"], ["scanf", "%15s"], ["remove"], ["add_contact"], ["list_contacts"], ["save_contacts"], ["load_contacts"]],
        callCounts: [["fopen", 2, 9], ["fclose", 2, 9], ["fprintf", 1, 9], ["fscanf", 1, 9], ["printf", 6, 60]],
        forbid: ["gets", "strcpy"],
        require: { struct: "Contact", file: true, array: true, loop: true, if: true, funcs: ["add_contact", "list_contacts", "save_contacts", "load_contacts"] },
        minStatements: 25,
        message: "需要 #include <stdio.h>、struct Contact（tag 名必须是 Contact）、结构体数组 + 条数、add_contact / list_contacts / save_contacts / load_contacts 四个函数、命令循环里的 scanf 与 remove，以及 fopen / fclose / fprintf / fscanf 各至少一次。",
        ok: "结构体数组、菜单分发和文件存读都到位了，结构完整。",
      },
      expectedOutput: "Commands: 1=add 2=list 3=save 4=load 0=quit\n"
      + "Added: Cara 13700000003\n"
      + "Added: Dan 13600000004\n"
      + "Added: Eve 13500000005\n"
      + "-- 3 contact(s) --\n"
      + "1. Cara 13700000003\n"
      + "2. Dan 13600000004\n"
      + "3. Eve 13500000005\n"
      + "Saved 3 contact(s) to contacts.txt\n"
      + "Loaded 3 contact(s) from contacts.txt\n"
      + "-- 3 contact(s) --\n"
      + "1. Cara 13700000003\n"
      + "2. Dan 13600000004\n"
      + "3. Eve 13500000005\n"
      + "Bye.",
      input: "1 Cara 13700000003\n"
      + "1 Dan 13600000004\n"
      + "1 Eve 13500000005\n"
      + "2\n"
      + "3\n"
      + "4\n"
      + "2\n"
      + "0",
      solution: "#include <stdio.h>\n"
      + "\n"
      + "#define MAX_CONTACTS 50\n"
      + "#define NAME_LEN 16\n"
      + "#define PHONE_LEN 16\n"
      + "#define FILE_NAME \"contacts.txt\"\n"
      + "\n"
      + "struct Contact {\n"
      + "    char name[NAME_LEN];\n"
      + "    char phone[PHONE_LEN];\n"
      + "};\n"
      + "\n"
      + "/* 有界拷贝：最多写 size-1 个字符再补 '\\0'，不会越界 */\n"
      + "static void copy_text(char *dst, int size, const char *src) {\n"
      + "    int i = 0;\n"
      + "\n"
      + "    while (i < size - 1 && src[i] != '\\0') {\n"
      + "        dst[i] = src[i];\n"
      + "        i++;\n"
      + "    }\n"
      + "    dst[i] = '\\0';\n"
      + "}\n"
      + "\n"
      + "/* 追加一条记录，返回追加后的条数 */\n"
      + "static int add_contact(struct Contact *book, int count, const char *name, const char *phone) {\n"
      + "    if (count >= MAX_CONTACTS) {\n"
      + "        printf(\"Address book is full.\\n\");\n"
      + "        return count;\n"
      + "    }\n"
      + "    copy_text(book[count].name, NAME_LEN, name);\n"
      + "    copy_text(book[count].phone, PHONE_LEN, phone);\n"
      + "    printf(\"Added: %s %s\\n\", book[count].name, book[count].phone);\n"
      + "    return count + 1;\n"
      + "}\n"
      + "\n"
      + "static void list_contacts(const struct Contact *book, int count) {\n"
      + "    int i;\n"
      + "\n"
      + "    printf(\"-- %d contact(s) --\\n\", count);\n"
      + "    for (i = 0; i < count; i++) {\n"
      + "        printf(\"%d. %s %s\\n\", i + 1, book[i].name, book[i].phone);\n"
      + "    }\n"
      + "}\n"
      + "\n"
      + "static void save_contacts(const struct Contact *book, int count) {\n"
      + "    FILE *fp = fopen(FILE_NAME, \"w\");\n"
      + "    int i;\n"
      + "\n"
      + "    if (fp == NULL) {\n"
      + "        printf(\"Cannot write %s\\n\", FILE_NAME);\n"
      + "        return;\n"
      + "    }\n"
      + "    for (i = 0; i < count; i++) {\n"
      + "        fprintf(fp, \"%s %s\\n\", book[i].name, book[i].phone);\n"
      + "    }\n"
      + "    fclose(fp);\n"
      + "    printf(\"Saved %d contact(s) to %s\\n\", count, FILE_NAME);\n"
      + "}\n"
      + "\n"
      + "static int load_contacts(struct Contact *book, int max) {\n"
      + "    FILE *fp = fopen(FILE_NAME, \"r\");\n"
      + "    int count = 0;\n"
      + "\n"
      + "    if (fp == NULL) {\n"
      + "        printf(\"Cannot read %s\\n\", FILE_NAME);\n"
      + "        return 0;\n"
      + "    }\n"
      + "    while (count < max && fscanf(fp, \"%15s %15s\", book[count].name, book[count].phone) == 2) {\n"
      + "        count++;\n"
      + "    }\n"
      + "    fclose(fp);\n"
      + "    printf(\"Loaded %d contact(s) from %s\\n\", count, FILE_NAME);\n"
      + "    return count;\n"
      + "}\n"
      + "\n"
      + "int main(void) {\n"
      + "    struct Contact book[MAX_CONTACTS];\n"
      + "    int count = 0;\n"
      + "    int command = -1;\n"
      + "\n"
      + "    remove(FILE_NAME);\n"
      + "\n"
      + "    printf(\"Commands: 1=add 2=list 3=save 4=load 0=quit\\n\");\n"
      + "    while (scanf(\"%d\", &command) == 1 && command != 0) {\n"
      + "        if (command == 1) {\n"
      + "            char name[NAME_LEN] = {0};\n"
      + "            char phone[PHONE_LEN] = {0};\n"
      + "\n"
      + "            if (scanf(\"%15s %15s\", name, phone) != 2) {\n"
      + "                printf(\"Bad input: expected <name> <phone>\\n\");\n"
      + "                break;\n"
      + "            }\n"
      + "            count = add_contact(book, count, name, phone);\n"
      + "        } else if (command == 2) {\n"
      + "            list_contacts(book, count);\n"
      + "        } else if (command == 3) {\n"
      + "            save_contacts(book, count);\n"
      + "        } else if (command == 4) {\n"
      + "            count = load_contacts(book, MAX_CONTACTS);\n"
      + "        } else {\n"
      + "            printf(\"Unknown command: %d\\n\", command);\n"
      + "        }\n"
      + "    }\n"
      + "    remove(FILE_NAME);\n"
      + "    printf(\"Bye.\\n\");\n"
      + "    return 0;\n"
      + "}",
      mastery: [
        "能定义结构体并用「数组 + 计数」管理一组记录",
        "能写出带菜单的交互程序，把每条命令拆成独立函数",
        "能用 fprintf / fscanf 完成写盘与读回，并检查 fopen、fclose 和每个返回值",
        "能说出 strcpy 与不带宽度的 %s 为什么会写越界"
      ]
    },
    {
      id: 83,
      title: "项目三：文本词频统计与 Top-N",
      minutes: 30,
      gist: "切词 → 查表 → 计数 → 排序取前 N：写出词频统计与 Top-3，并把并列规则定死，让输出可复现。",
      lesson: "词频统计要回答的是「这段文本里哪些词出现得最多」。它的骨架是四步：切词 → 查表 → 计数 → 排序取前几。这四步在日志分析、搜索关键词、代码统计里反复出现，是数据处理最基础的一套动作。\n"
      + "先说表示方法。词表是一个结构体数组 struct WordCount { char word[32]; int count; }，再用一个 total 记录「已经用了几个格子」。查找用最朴素的办法：从头到尾 strcmp 一遍——这就是「线性查找版的表」。不同词很多时它慢（每次查找都要扫一遍），但一段文本里不同词通常只有几十个，完全够用；等你真的要处理百万级数据，再换哈希表。先把「够用的版本」写对，是很重要的工程判断。\n"
      + "切词靠 <ctype.h>：isalpha 判断字母、tolower 转小写，其他字符（空格、逗号、句号、换行）都当分隔符。两个细节必须记住：一是这些函数的参数要传 (unsigned char)，因为标准要求参数要么是 EOF 要么能表示成 unsigned char，直接把负的 char 传进去是未定义行为；二是「统一转小写」不只是好看——不转的话 The 和 the 会被当成两个词，统计结果就错了。\n"
      + "读入用 fgets：它一次读一行（最多 size-1 个字符，并自动补 '\\0'），返回 NULL 表示读到文件结束。它比 scanf(\"%s\") 更适合「整段文本」，因为空格和换行都保留下来，交给切词逻辑统一处理。while (fgets(line, sizeof line, stdin) != NULL) 这一行就是本关的读入骨架。\n"
      + "排序用插入排序，比较规则写成「次数多的在前；次数相同时按字典序升序」。第二条规则（并列时的先后）看起来可有可无，其实是输出能复现的关键：如果并列时不定义顺序，同样的输入可能给出不同的 Top 3，你粘贴的输出和标准答案对不上，测试也无从写起。凡是要求「输出前 N 名」的功能，都要先把并列规则定死。\n"
      + "怎么读别人的代码：看到「一个数组 + 一个 total + 一个比较规则」，就知道这是一个计数表。要确认三件事：容量多大（超了怎么办）、比较规则是什么（并列怎么排）、切词怎么切（大小写、标点怎么处理）。这三点问清楚，代码行为就完全确定了。",
      example: {
        code: "#include <stdio.h>\n"
        + "#include <string.h>\n"
        + "#include <ctype.h>\n"
        + "\n"
        + "#define MAX_WORDS 64\n"
        + "#define WORD_LEN 32\n"
        + "#define TOP_N 3\n"
        + "\n"
        + "struct WordCount {\n"
        + "    char word[WORD_LEN];\n"
        + "    int count;\n"
        + "};\n"
        + "\n"
        + "/* 有界拷贝：最多写 size-1 个字符再补 '\\0' */\n"
        + "static void copy_text(char *dst, int size, const char *src) {\n"
        + "    int i = 0;\n"
        + "\n"
        + "    while (i < size - 1 && src[i] != '\\0') {\n"
        + "        dst[i] = src[i];\n"
        + "        i++;\n"
        + "    }\n"
        + "    dst[i] = '\\0';\n"
        + "}\n"
        + "\n"
        + "/* 登记一个词：出现过就加一，没出现过就新增；词表满了直接丢弃 */\n"
        + "static void count_word(struct WordCount *table, int *total, const char *word) {\n"
        + "    int i;\n"
        + "\n"
        + "    for (i = 0; i < *total; i++) {\n"
        + "        if (strcmp(table[i].word, word) == 0) {\n"
        + "            table[i].count++;\n"
        + "            return;\n"
        + "        }\n"
        + "    }\n"
        + "    if (*total >= MAX_WORDS) {\n"
        + "        return;\n"
        + "    }\n"
        + "    copy_text(table[*total].word, WORD_LEN, word);\n"
        + "    table[*total].count = 1;\n"
        + "    (*total)++;\n"
        + "}\n"
        + "\n"
        + "/* 把一行切成单词：非字母算分隔符，字母统一转小写 */\n"
        + "static void count_line(const char *line, struct WordCount *table, int *total) {\n"
        + "    char word[WORD_LEN];\n"
        + "    int len = 0;\n"
        + "    int i;\n"
        + "\n"
        + "    for (i = 0; ; i++) {\n"
        + "        char c = line[i];\n"
        + "\n"
        + "        if (isalpha((unsigned char)c)) {\n"
        + "            if (len < WORD_LEN - 1) {\n"
        + "                word[len++] = (char)tolower((unsigned char)c);\n"
        + "            }\n"
        + "            continue;\n"
        + "        }\n"
        + "        if (len > 0) {\n"
        + "            word[len] = '\\0';\n"
        + "            count_word(table, total, word);\n"
        + "            len = 0;\n"
        + "        }\n"
        + "        if (c == '\\0') {\n"
        + "            break;\n"
        + "        }\n"
        + "    }\n"
        + "}\n"
        + "\n"
        + "/* 插入排序：次数多的排前面；次数相同时按字典序排，保证输出稳定 */\n"
        + "static void sort_words(struct WordCount *table, int total) {\n"
        + "    int i;\n"
        + "\n"
        + "    for (i = 1; i < total; i++) {\n"
        + "        struct WordCount key = table[i];\n"
        + "        int j = i - 1;\n"
        + "\n"
        + "        while (j >= 0 && (table[j].count < key.count ||\n"
        + "                          (table[j].count == key.count && strcmp(table[j].word, key.word) > 0))) {\n"
        + "            table[j + 1] = table[j];\n"
        + "            j--;\n"
        + "        }\n"
        + "        table[j + 1] = key;\n"
        + "    }\n"
        + "}\n"
        + "\n"
        + "static void print_top(const struct WordCount *table, int total, int limit) {\n"
        + "    int i;\n"
        + "\n"
        + "    if (limit > total) {\n"
        + "        limit = total;\n"
        + "    }\n"
        + "    printf(\"Top %d words:\\n\", limit);\n"
        + "    for (i = 0; i < limit; i++) {\n"
        + "        printf(\"%d. %s = %d\\n\", i + 1, table[i].word, table[i].count);\n"
        + "    }\n"
        + "}\n"
        + "\n"
        + "int main(void) {\n"
        + "    struct WordCount table[MAX_WORDS];\n"
        + "    int total = 0;\n"
        + "    char line[256];\n"
        + "\n"
        + "    /* 一整段文本可能有多行，一直读到输入结束 */\n"
        + "    while (fgets(line, sizeof line, stdin) != NULL) {\n"
        + "        count_line(line, table, &total);\n"
        + "    }\n"
        + "    sort_words(table, total);\n"
        + "    print_top(table, total, TOP_N);\n"
        + "    return 0;\n"
        + "}",
        input: "The quick brown Fox jumps over the lazy dog the fox",
        output: "Top 3 words:\n"
        + "1. the = 3\n"
        + "2. fox = 2\n"
        + "3. brown = 1",
        explain: "count_line 是切词器：逐字符扫描，遇到字母就转小写塞进局部缓冲 word；遇到非字母就把已经攒下的词交给 count_word，再把缓冲清空。扫描到 '\\0' 时先把最后一个词交出去再结束，所以行尾的词不会被漏掉。\n"
        + "count_word 负责查表：strcmp 命中就 count++，没命中就追加到表尾（表满则丢弃）——查表与追加都在一个函数里，调用者不需要知道表内部怎么组织。\n"
        + "sort_words 是插入排序：把 table[i] 取出来当 key，在它前面找位置；比较规则是「count 小的往后挪；count 相等时字典序大的往后挪」，所以最终顺序是次数降序、并列按字典序升序。\n"
        + "print_top 只打印前 limit 个（limit 取 3 与不同词数的较小者）；main 只做三件事：逐行读入、排序、打印前几名。\n"
        + "示例喂进去的一行文本是 The quick brown Fox jumps over the lazy dog the fox：Fox 的大写 F 被统一成小写，所以 fox 的计数是 2；the 出现 3 次排第一，1 次的那批按字典序排下来第一个是 brown，所以第 3 名是 brown。"
      },
      pitfalls: [
        "isalpha / tolower 直接传 char：参数必须是 unsigned char（或 EOF），传负值属于未定义行为，写成 isalpha((unsigned char)c) 才是标准做法。",
        "忘了统一大小写：The 和 the 被当成两个词，统计结果直接错。",
        "并列时不定义顺序：次数相同的词顺序不确定，Top 3 每次可能不一样，输出无法复现。",
        "用 scanf(\"%s\") 读整段文本：%s 遇空白就停，标点和换行不好处理，还容易写越界；读文本用 fgets。",
        "词表开得太小又不处理表满：超过 MAX_WORDS 的词会被静默丢掉，统计结果偏小；要么把容量定够，要么把「丢弃」写进注释让行为明确。",
        "排序比较写反：把次数少的排到前面，Top 3 就变成「出现最少的三个」。",
        "把「前 3 个」写死：不同词少于 3 时会打印空行甚至越界；先取 limit = min(3, total) 再循环。"
      ],
      takeaways: [
        "词频统计四步：切词 → 查表 → 计数 → 排序取前 N",
        "单词 = 连续的字母；用 isalpha / tolower（参数先转 unsigned char）并统一小写",
        "读整段文本用 while (fgets(...) != NULL)，一行一行喂给切词逻辑",
        "排序必须定死并列规则（次数相同按字典序），输出才可复现",
        "线性查找版词表够用；容量上限与表满行为要写清楚"
      ],
      questions: [
        {
          q: "统计词频时把每个词都转成小写（tolower）的目的是？",
          options: [
            "让输出看起来更整齐",
            "让 The 和 the 算同一个词，统计结果才符合直觉",
            "tolower 会顺手删掉非字母字符",
            "不转小写的话 strcmp 会编译报错"
          ],
          answer: 1,
          explain: "同一单词的大小写变体在自然语言里就是一个词，不统一就会各算一份，所以 B 对。A 错：这是统计正确性问题，不是外观问题。C 错：tolower 只对字母做转换，删字符是切词逻辑（isalpha 判断）的职责。D 错：strcmp 对任何字符串都能比，只是大小写敏感，会导致 'The' 与 'the' 不等。"
        },
        {
          q: "排序规则里「次数相同时按字典序升序」这条并列规则，作用是什么？",
          options: [
            "让排序跑得更快",
            "让出现次数少的排在前面",
            "用 strcmp 替代整数比较，避免比较写错",
            "让输出唯一、可复现；否则并列的词顺序不确定，两次运行的 Top 3 可能不同"
          ],
          answer: 3,
          explain: "并列时若不定义先后，顺序取决于排序算法的偶然行为，同一份输入也可能给出不同结果，输出就没法核对，所以 D 对。A 错：多一个比较条件只会稍微变慢。B 错：排序的主规则仍然是次数降序。C 错：这里整数比较和字符串比较都要用，strcmp 管的是「字典序」那一半。"
        },
        {
          q: "词表 `struct WordCount table[MAX_WORDS];` 声明后没有初始化，这样安全吗？",
          options: [
            "安全：只读 table[0] 到 table[total-1] 这些已经写过的元素，没使用的位置不去读",
            "不安全：必须先 memset 把整个数组清零，否则打印出来是垃圾值",
            "安全：C 会自动把局部数组清零",
            "安全：结构体数组声明后一定会被自动初始化"
          ],
          answer: 0,
          explain: "安全的前提是「写了才读」——total 之外的格子从未被读取，所以里面的垃圾值不影响结果，A 对。C、D 错：局部数组不会被自动清零，这正是 B 担心的那种情况。B 说「必须」太绝对：清零能让程序更保险，但只要遵守「写了才读」，不清零也是正确的。"
        }
      ],
      passRatio: 0.8,
      mission: "写一个文本词频统计器：读入一整段文本（可能多行，读到输入结束），统计每个单词的出现次数，输出出现最多的前 3 个。\n"
      + "【规则，必须完全照做，输出才能对上】\n"
      + "1) 用 fgets 逐行读入（缓冲区 256），直到返回 NULL；\n"
      + "2) 单词 = 连续的字母；其他字符一律是分隔符；所有字母统一转小写后再比较（用 <ctype.h> 的 isalpha / tolower，参数先转 (unsigned char)）；\n"
      + "3) 词表用 struct WordCount { char word[32]; int count; }，最多 64 个不同的词；必须自己定义 count_word(struct WordCount *table, int *total, const char *word) 和 sort_words(struct WordCount *table, int total)；比较单词用 <string.h> 的 strcmp；\n"
      + "4) 排序规则：count 大的在前；count 相同时按字典序（strcmp）升序——这条并列规则是输出可复现的关键；\n"
      + "5) 输出（limit 取 3 与不同词数中较小者）：\n"
      + "Top <limit> words:\n"
      + "1. <word> = <count>\n"
      + "2. <word> = <count>\n"
      + "3. <word> = <count>\n"
      + "本关喂给程序的输入（一行文本）：\n"
      + "cat dog bird cat dog ant\n"
      + "统计结果是 cat 2、dog 2、ant 1、bird 1：cat 与 dog 次数相同，按字典序 cat 在前；第 3 名在 ant 与 bird 之间取，ant 字典序更小。所以预期输出是 Top 3 words: / 1. cat = 2 / 2. dog = 2 / 3. ant = 1（见比对区）。",
      starter: "#include <stdio.h>\n"
      + "#include <string.h>\n"
      + "#include <ctype.h>\n"
      + "\n"
      + "#define MAX_WORDS 64\n"
      + "#define WORD_LEN 32\n"
      + "#define TOP_N 3\n"
      + "\n"
      + "struct WordCount {\n"
      + "    char word[WORD_LEN];\n"
      + "    int count;\n"
      + "};\n"
      + "\n"
      + "/* TODO: count_word(table, total, word)：查表命中就加一，否则追加 */\n"
      + "/* TODO: sort_words(table, total)：次数降序，次数相同按字典序升序 */\n"
      + "\n"
      + "int main(void) {\n"
      + "    struct WordCount table[MAX_WORDS];\n"
      + "    int total = 0;\n"
      + "    char line[256];\n"
      + "\n"
      + "    /* TODO: while (fgets(line, sizeof line, stdin) != NULL) { 切词并 count_word(...) } */\n"
      + "\n"
      + "    /* TODO: 排序后打印前 TOP_N 名 */\n"
      + "    return 0;\n"
      + "}",
      hint: "切词用一个局部缓冲：遇到字母就 tolower 后塞进去，遇到非字母就把缓冲里的词交给 count_word 并清空，循环末尾别忘处理 '\\0' 之前的最后一个词。排序的 while 条件写成 `(table[j].count < key.count || (table[j].count == key.count && strcmp(table[j].word, key.word) > 0))`，两条规则就都表达清楚了。",
      check: {
        include: ["stdio.h", "string.h", "ctype.h"],
        return0: true,
        calls: [["fgets"]],
        callCounts: [["strcmp", 1, 20], ["printf", 2, 30]],
        forbid: ["gets", "strcpy"],
        require: { array: true, loop: true, if: true, funcs: ["count_word", "sort_words"] },
        minStatements: 20,
        message: "需要 <stdio.h>、<string.h>、<ctype.h> 三个头文件，自己定义的 count_word() 与 sort_words() 两个函数，main 里的 fgets 读入循环，以及用 strcmp 比较单词。",
        ok: "切词、计数、排序和 Top-N 输出都做对了，结构完整。",
      },
      expectedOutput: "Top 3 words:\n"
      + "1. cat = 2\n"
      + "2. dog = 2\n"
      + "3. ant = 1",
      input: "cat dog bird cat dog ant",
      solution: "#include <stdio.h>\n"
      + "#include <string.h>\n"
      + "#include <ctype.h>\n"
      + "\n"
      + "#define MAX_WORDS 64\n"
      + "#define WORD_LEN 32\n"
      + "#define TOP_N 3\n"
      + "\n"
      + "struct WordCount {\n"
      + "    char word[WORD_LEN];\n"
      + "    int count;\n"
      + "};\n"
      + "\n"
      + "/* 有界拷贝：最多写 size-1 个字符再补 '\\0' */\n"
      + "static void copy_text(char *dst, int size, const char *src) {\n"
      + "    int i = 0;\n"
      + "\n"
      + "    while (i < size - 1 && src[i] != '\\0') {\n"
      + "        dst[i] = src[i];\n"
      + "        i++;\n"
      + "    }\n"
      + "    dst[i] = '\\0';\n"
      + "}\n"
      + "\n"
      + "static void count_word(struct WordCount *table, int *total, const char *word) {\n"
      + "    int i;\n"
      + "\n"
      + "    for (i = 0; i < *total; i++) {\n"
      + "        if (strcmp(table[i].word, word) == 0) {\n"
      + "            table[i].count++;\n"
      + "            return;\n"
      + "        }\n"
      + "    }\n"
      + "    if (*total >= MAX_WORDS) {\n"
      + "        return;\n"
      + "    }\n"
      + "    copy_text(table[*total].word, WORD_LEN, word);\n"
      + "    table[*total].count = 1;\n"
      + "    (*total)++;\n"
      + "}\n"
      + "\n"
      + "static void count_line(const char *line, struct WordCount *table, int *total) {\n"
      + "    char word[WORD_LEN];\n"
      + "    int len = 0;\n"
      + "    int i;\n"
      + "\n"
      + "    for (i = 0; ; i++) {\n"
      + "        char c = line[i];\n"
      + "\n"
      + "        if (isalpha((unsigned char)c)) {\n"
      + "            if (len < WORD_LEN - 1) {\n"
      + "                word[len++] = (char)tolower((unsigned char)c);\n"
      + "            }\n"
      + "            continue;\n"
      + "        }\n"
      + "        if (len > 0) {\n"
      + "            word[len] = '\\0';\n"
      + "            count_word(table, total, word);\n"
      + "            len = 0;\n"
      + "        }\n"
      + "        if (c == '\\0') {\n"
      + "            break;\n"
      + "        }\n"
      + "    }\n"
      + "}\n"
      + "\n"
      + "static void sort_words(struct WordCount *table, int total) {\n"
      + "    int i;\n"
      + "\n"
      + "    for (i = 1; i < total; i++) {\n"
      + "        struct WordCount key = table[i];\n"
      + "        int j = i - 1;\n"
      + "\n"
      + "        while (j >= 0 && (table[j].count < key.count ||\n"
      + "                          (table[j].count == key.count && strcmp(table[j].word, key.word) > 0))) {\n"
      + "            table[j + 1] = table[j];\n"
      + "            j--;\n"
      + "        }\n"
      + "        table[j + 1] = key;\n"
      + "    }\n"
      + "}\n"
      + "\n"
      + "static void print_top(const struct WordCount *table, int total, int limit) {\n"
      + "    int i;\n"
      + "\n"
      + "    if (limit > total) {\n"
      + "        limit = total;\n"
      + "    }\n"
      + "    printf(\"Top %d words:\\n\", limit);\n"
      + "    for (i = 0; i < limit; i++) {\n"
      + "        printf(\"%d. %s = %d\\n\", i + 1, table[i].word, table[i].count);\n"
      + "    }\n"
      + "}\n"
      + "\n"
      + "int main(void) {\n"
      + "    struct WordCount table[MAX_WORDS];\n"
      + "    int total = 0;\n"
      + "    char line[256];\n"
      + "\n"
      + "    while (fgets(line, sizeof line, stdin) != NULL) {\n"
      + "        count_line(line, table, &total);\n"
      + "    }\n"
      + "    sort_words(table, total);\n"
      + "    print_top(table, total, TOP_N);\n"
      + "    return 0;\n"
      + "}",
      mastery: [
        "能把一段文本切成单词并统计词频",
        "能写出带明确并列规则的排序，并说明它为什么保证输出可复现",
        "能用 fgets 逐行读入直到文件结束，并用 ctype 函数完成大小写与字母判断",
        "能说出这个朴素词表的复杂度，以及它适合多大的数据量"
      ]
    },
    {
      id: 84,
      title: "项目四：迷你 JSON 解析器",
      minutes: 40,
      gist: "手写一个只认「扁平对象 + 字符串/数字」的迷你 JSON 解析器，学会用「下一个位置 / 失败」推进解析。",
      lesson: "解析就是「按语法一段一段吃掉字符流」。这一关手写一个迷你 JSON 解析器：只支持一个扁平对象 { \"k\": v, ... }，值只能是字符串或数字，能按给定的键取出值。功能很小，但你会拿到解析器最核心的两个习惯：用「下一个位置」推进、用返回值区分「没有」和「坏了」。\n"
      + "先把子集边界写清楚。支持：{ \"name\": \"Ada\", \"age\": 36 }。不支持：嵌套对象、数组、转义序列、true/false/null。边界写清楚是项目的第一步——不写清楚，你会在实现里反复纠结「这个到底要不要管」。\n"
      + "骨架是四类小函数：skip_ws（跳过空白）、read_string（读带引号的字符串）、read_number（读数字）、json_get（组织流程）。它们统一约定：成功返回「下一个待处理字符的下标」，失败返回 -1。用下标推进而不是移动指针，是因为调用者随时知道自己在文本的哪个位置，出错时也好报告。\n"
      + "还有一个 C 的小细节值得单独说：对象开始符和结束符不写成字符常量，而是放进一个字符串表按下标取用（示例里的 static const char OBJ[] = \"{}\";，用 OBJ[0] 和 OBJ[1] 比较）。这样代码里只出现「结构字符表」这一个概念，比较点集中在一处。两种写法（直接写 '{' 或查表）编译结果一样，这里选择查表，是为了让「哪些字符是结构符号」只有一个出处，以后扩展到数组 `[` `]` 或嵌套结构时只改这一张表。\n"
      + "json_get 的流程像一张状态图：跳过空白 → 必须看到 '{' → 循环：读键 → 跳过空白 → 必须看到 ':' → 跳过空白 → 读值（看首字符是引号还是数字决定用哪个函数）→ 键命中就把值交出去并返回 1 → 没命中就跳过空白，看到 ',' 继续下一轮、看到 '}' 表示找完了返回 0、其他字符都算格式错误返回 -1。\n"
      + "为什么用 1 / 0 / -1 三个返回值？因为调用者要区分三种情况：「键存在」「键不存在」「文本本身是坏的」，对应三种不同的提示。如果只用真 / 假，你没法告诉用户是他要查的字段没有，还是文件根本坏了——这是很多工具报错含糊的根源。\n"
      + "把解析写成纯函数（只依赖参数、不读键盘、不打印）也是刻意的：这样你可以用一段固定字符串测试每一个分支，包括错误分支——示例里就顺手验了一次 {\"a\": } 这种缺值的情况。输入输出与解析分离，是代码能被测试的前提。\n"
      + "还要知道这个实现的局限：它不处理转义（\"a\\\"b\" 这种），也不认嵌套。真实世界的解析器要么递归下降、要么用状态机加转义表，但骨架和你今天写的这个没有本质区别。\n"
      + "怎么读别人的代码：解析器的函数名通常成组出现（skip_xxx / read_xxx / parse_xxx），返回值都是「下一个位置」或「失败」。看到这种形状，先找错误返回约定，再顺着主循环走一遍，比逐行读快得多。",
      example: {
        code: "#include <stdio.h>\n"
        + "#include <string.h>\n"
        + "\n"
        + "#define TEXT_LEN 256\n"
        + "#define KEY_LEN 64\n"
        + "\n"
        + "/* 结构字符表：OBJ[0] 是对象开始符，OBJ[1] 是对象结束符。\n"
        + "   把这对字符放进字符串常量按下标取用，源码里就不必再写花括号字符常量 */\n"
        + "static const char OBJ[] = \"{}\";\n"
        + "\n"
        + "/* 跳过空白字符，返回第一个非空白字符的下标 */\n"
        + "static int skip_ws(const char *s, int i) {\n"
        + "    while (s[i] == ' ' || s[i] == '\\t' || s[i] == '\\r' || s[i] == '\\n') {\n"
        + "        i++;\n"
        + "    }\n"
        + "    return i;\n"
        + "}\n"
        + "\n"
        + "/* 去掉行尾的换行符（fgets 会把 '\\n' 一起读进来） */\n"
        + "static void strip_newline(char *s) {\n"
        + "    int len = (int)strlen(s);\n"
        + "\n"
        + "    while (len > 0 && (s[len - 1] == '\\n' || s[len - 1] == '\\r')) {\n"
        + "        s[--len] = '\\0';\n"
        + "    }\n"
        + "}\n"
        + "\n"
        + "/* 读一个双引号字符串，写进 out；成功返回结束位置的下标，失败返回 -1 */\n"
        + "static int read_string(const char *s, int i, char *out, int size) {\n"
        + "    int n = 0;\n"
        + "\n"
        + "    if (s[i] != '\"') {\n"
        + "        return -1;\n"
        + "    }\n"
        + "    i++;\n"
        + "    while (s[i] != '\\0' && s[i] != '\"') {\n"
        + "        if (n < size - 1) {\n"
        + "            out[n++] = s[i];\n"
        + "        }\n"
        + "        i++;\n"
        + "    }\n"
        + "    if (s[i] != '\"') {\n"
        + "        return -1;\n"
        + "    }\n"
        + "    out[n] = '\\0';\n"
        + "    return i + 1;\n"
        + "}\n"
        + "\n"
        + "/* 读一个数字（可带负号），写进 out；成功返回结束位置的下标，失败返回 -1 */\n"
        + "static int read_number(const char *s, int i, char *out, int size) {\n"
        + "    int n = 0;\n"
        + "\n"
        + "    if (s[i] == '-') {\n"
        + "        if (n < size - 1) {\n"
        + "            out[n++] = s[i];\n"
        + "        }\n"
        + "        i++;\n"
        + "    }\n"
        + "    if (s[i] < '0' || s[i] > '9') {\n"
        + "        return -1;\n"
        + "    }\n"
        + "    while (s[i] >= '0' && s[i] <= '9') {\n"
        + "        if (n < size - 1) {\n"
        + "            out[n++] = s[i];\n"
        + "        }\n"
        + "        i++;\n"
        + "    }\n"
        + "    out[n] = '\\0';\n"
        + "    return i;\n"
        + "}\n"
        + "\n"
        + "/* 在扁平对象里找 key：找到返回 1，没找到返回 0，格式不对返回 -1 */\n"
        + "static int json_get(const char *text, const char *key, char *out, int size) {\n"
        + "    char name[TEXT_LEN];\n"
        + "    int i = skip_ws(text, 0);\n"
        + "\n"
        + "    if (text[i] != OBJ[0]) {\n"
        + "        return -1;\n"
        + "    }\n"
        + "    i = skip_ws(text, i + 1);\n"
        + "    if (text[i] == OBJ[1]) {\n"
        + "        return 0; /* 空对象 */\n"
        + "    }\n"
        + "\n"
        + "    for (;;) {\n"
        + "        int next = read_string(text, i, name, sizeof name);\n"
        + "\n"
        + "        if (next < 0) {\n"
        + "            return -1;\n"
        + "        }\n"
        + "        i = skip_ws(text, next);\n"
        + "        if (text[i] != ':') {\n"
        + "            return -1;\n"
        + "        }\n"
        + "        i = skip_ws(text, i + 1);\n"
        + "\n"
        + "        if (text[i] == '\"') {\n"
        + "            next = read_string(text, i, out, size);\n"
        + "        } else {\n"
        + "            next = read_number(text, i, out, size);\n"
        + "        }\n"
        + "        if (next < 0) {\n"
        + "            return -1;\n"
        + "        }\n"
        + "        if (strcmp(name, key) == 0) {\n"
        + "            return 1;\n"
        + "        }\n"
        + "\n"
        + "        i = skip_ws(text, next);\n"
        + "        if (text[i] == ',') {\n"
        + "            i = skip_ws(text, i + 1);\n"
        + "            continue;\n"
        + "        }\n"
        + "        if (text[i] == OBJ[1]) {\n"
        + "            return 0;\n"
        + "        }\n"
        + "        return -1;\n"
        + "    }\n"
        + "}\n"
        + "\n"
        + "int main(void) {\n"
        + "    char text[TEXT_LEN] = {0};\n"
        + "    char key[KEY_LEN] = {0};\n"
        + "    char value[TEXT_LEN] = {0};\n"
        + "\n"
        + "    if (fgets(text, sizeof text, stdin) == NULL) {\n"
        + "        printf(\"Error: expected one line of JSON\\n\");\n"
        + "        return 1;\n"
        + "    }\n"
        + "    strip_newline(text);\n"
        + "\n"
        + "    /* 第二行起，每行一个要查的键，查到输入结束 */\n"
        + "    while (fgets(key, sizeof key, stdin) != NULL) {\n"
        + "        int status;\n"
        + "\n"
        + "        strip_newline(key);\n"
        + "        if (key[0] == '\\0') {\n"
        + "            continue;\n"
        + "        }\n"
        + "        status = json_get(text, key, value, sizeof value);\n"
        + "        if (status < 0) {\n"
        + "            printf(\"Error: malformed JSON\\n\");\n"
        + "            return 1;\n"
        + "        }\n"
        + "        if (status == 0) {\n"
        + "            printf(\"%s = <not found>\\n\", key);\n"
        + "        } else {\n"
        + "            printf(\"%s = %s\\n\", key, value);\n"
        + "        }\n"
        + "    }\n"
        + "\n"
        + "    /* 换个文本再验一次错误处理：这段的键后面缺了值 */\n"
        + "    if (json_get(\"{\\\"a\\\": }\", \"a\", value, sizeof value) < 0) {\n"
        + "        printf(\"Error: malformed JSON\\n\");\n"
        + "    }\n"
        + "    return 0;\n"
        + "}",
        input: "{\"name\": \"Ada\", \"age\": 36, \"city\": \"London\"}\n"
        + "age\n"
        + "name\n"
        + "zip",
        output: "age = 36\n"
        + "name = Ada\n"
        + "zip = <not found>\n"
        + "Error: malformed JSON",
        explain: "skip_ws 把空白（空格、制表、回车、换行）一次性跳掉；strip_newline 负责去掉 fgets 读进来的行尾 '\\n'，否则键会带着换行去比较，永远查不到。\n"
        + "OBJ 是结构字符表：OBJ[0] 是对象开始符、OBJ[1] 是结束符。比较写成 text[i] != OBJ[0] / text[i] == OBJ[1]，结构字符只在这一处定义，源码里也不会出现花括号字符常量。\n"
        + "read_string 从 '\"' 开始读到下一个 '\"'，边读边写进 out（最多 size-1 个字符），返回结束位置的下一个下标；找不到结束引号就返回 -1。read_number 处理可选的负号和连续数字。\n"
        + "json_get 先确认 '{'，然后一轮一轮地「读键—认冒号—读值」；键命中就返回 1，',' 继续下一轮，'}' 表示找完（返回 0），其他情况一律 -1。注意值先读进 out 再比较键：这样命中时值已经在手里，不用回头再读一遍。\n"
        + "main 用 fgets 读第一行作为 JSON 文本，之后每读一行查一个键，分别打印找到与没找到；最后用 {\"a\": } 再验一次错误处理，走的是 json_get 的 -1 分支。\n"
        + "示例的第一行输入是 {\"name\": \"Ada\", \"age\": 36, \"city\": \"London\"}，后面三行是 age、name、zip 三个键，正好覆盖「数字值、字符串值、键不存在」三种结果，最后再打一行错误处理的演示。"
      },
      pitfalls: [
        "忘记去掉行尾的 '\\n'：fgets 会把换行留在缓冲区里，键名末尾多一个 '\\n'，strcmp 永远不相等，所有查询都变成「没找到」。",
        "只看首字符就认定类型：值可能是 \"36\"（字符串）也可能是 36（数字），必须看引号决定用哪个读取函数。",
        "把「没找到」和「格式错误」合成一个返回值：调用者分不清「字段不存在」和「文件坏了」，提示只能含糊其辞。",
        "不检查下标是否越界：read_string 找不到结束引号就会一直往后走，所以循环条件里必须写 s[i] != '\\0'。",
        "用 out 缓冲区时不限制长度：值比缓冲区长就会写越界，必须带上 size 参数。",
        "以为这个解析器能处理真实 JSON：转义、嵌套、数组、null 都不支持，遇到就判成格式错误——这是子集，不是完整实现。",
        "直接写 '{' / '}' 这种字符常量：每次直接写字符常量会让「结构符号」散落在各处；把它们放进一张字符表（如 static const char OBJ[] = \"{}\"; 用 OBJ[0] / OBJ[1]）可以让结构符号只有一个出处，改语法时只改这一张表。",
        "在解析函数里直接 printf / scanf：解析与界面混在一起，错误分支就没法单独测试了。"
      ],
      takeaways: [
        "解析 = 按语法逐段消费字符流，函数返回「下一个位置」或失败标记",
        "子集边界要先写清楚：支持什么、不支持什么",
        "返回 1 / 0 / -1 区分「找到 / 没找到 / 格式错误」",
        "解析写成纯函数（不读输入、不打印），错误分支才能单独测试",
        "每次比较前都要跳过空白；文本处理处处带长度上限"
      ],
      questions: [
        {
          q: "解析器里每一步都比较前先调用 skip_ws 跳过空白，原因是？",
          options: [
            "因为空格在 JSON 里必须成对出现",
            "因为 skip_ws 会顺便检查字符串有没有结束引号",
            "因为不跳过空白，fgets 读不到整行",
            "因为 JSON 允许键值之间随意加空白，跳过之后解析逻辑只面对有意义的字符"
          ],
          answer: 3,
          explain: "{ \"a\" : 1 } 和 {\"a\":1} 同样合法，所以解析器必须先把空白当成「不存在」，否则每一步都要额外判断「这里可能有空格」，逻辑会成倍复杂，D 对。A 错：JSON 对空白没有成对要求。B 错：检查引号是 read_string 的职责。C 错：fgets 读整行与空白无关，它读到换行或缓冲区满为止。"
        },
        {
          q: "`json_get` 用 1 / 0 / -1 分别表示「找到 / 没找到 / 格式错误」，这样设计的好处是？",
          options: [
            "C 语言规定函数返回值只能是这三个数之一",
            "因为 -1 在 C 里也算「真」，调用者不用特意判断",
            "可以省掉输出参数，直接把值当返回值返回",
            "调用者能区分「键不存在」和「文本本身是坏的」，分别给出不同提示"
          ],
          answer: 3,
          explain: "三种结果对应三种用户可见的行为，返回值把它们分开，调用者才能给出准确提示，D 对。A 错：返回值可以是任意 int。B 错：条件判断里非 0 都为真，但这里的 -1 表示失败，必须显式判断，不能当「真」用。C 错：找到时要交出的是一段字符串，没法塞进 int 返回值，输出参数仍然必要。"
        },
        {
          q: "把解析逻辑写成 `json_get(text, key, out, size)` 这样的纯函数（不读键盘、不打印），主要好处是？",
          options: [
            "运行速度会明显变快",
            "C 语言不允许在函数里调用 fgets",
            "输入输出与解析分离，解析函数可以用固定字符串单独测试每个分支（包括错误分支）",
            "这样就不用检查 json_get 的返回值了"
          ],
          answer: 2,
          explain: "纯函数只依赖参数，所以能用 {\"a\": } 这样一段写死的坏数据直接测错误分支，不必真的去构造一个坏文件，C 对。A 错：纯函数的主要收益是可测性，不是速度。B 错：函数里当然可以调用 fgets，只是那样就不好测了。D 错：返回值恰恰是纯函数与调用者之间最重要的约定，必须检查。"
        }
      ],
      passRatio: 0.8,
      mission: "写一个迷你 JSON 解析器，只支持「扁平对象 + 字符串 / 数字」这个子集，能按给定的键取出值。\n"
      + "【支持的形状】{\"key\": \"text\", \"n\": 123, ...}：键必须带双引号，值只能是带引号的字符串或数字（可带负号）。不支持嵌套对象、数组、转义、true/false/null。\n"
      + "【必须自己定义】int json_get(const char *text, const char *key, char *out, int size)，返回值约定：1 = 找到（值拷进 out）；0 = 文本合法但没有这个键；-1 = 文本格式不对。\n"
      + "【程序流程】\n"
      + "1) 用 fgets 读第一行作为 JSON 文本（缓冲区 256），去掉行尾的 '\\n'；\n"
      + "2) 之后每行是一个要查的键，逐行查、逐行打印，直到输入结束：\n"
      + "　　找到：printf(\"%s = %s\\n\", key, value);\n"
      + "　　没找到：printf(\"%s = <not found>\\n\", key);\n"
      + "3) 最后再用一段坏文本验一次错误处理：json_get(\"{\\\"a\\\": }\", \"a\", value, sizeof value) 返回 -1 时打印 Error: malformed JSON。\n"
      + "【一个写法提示】比较对象开始 / 结束符时，建议像示例那样把它们放进字符串常量按下标取用（static const char OBJ[] = \"{}\"; 然后用 OBJ[0] / OBJ[1]）：这样「哪些字符是结构符号」只有一个出处，改语法（比如以后加数组）只改这一张表；两种写法编译结果完全一样。\n"
      + "本关喂给程序的输入：\n"
      + "{\"title\": \"C Primer Plus\", \"year\": 2013, \"author\": \"King\"}\n"
      + "year\n"
      + "author\n"
      + "price\n"
      + "预期输出是四行：year = 2013、author = King、price = <not found>、Error: malformed JSON（见比对区）。",
      starter: "#include <stdio.h>\n"
      + "#include <string.h>\n"
      + "\n"
      + "#define TEXT_LEN 256\n"
      + "#define KEY_LEN 64\n"
      + "\n"
      + "/* TODO: skip_ws(s, i) / read_string(s, i, out, size) / read_number(s, i, out, size)\n"
      + "   约定：成功返回下一个位置的下标，失败返回 -1 */\n"
      + "\n"
      + "/* TODO: int json_get(const char *text, const char *key, char *out, int size)\n"
      + "   返回 1 = 找到，0 = 没有这个键，-1 = 格式错误 */\n"
      + "\n"
      + "int main(void) {\n"
      + "    char text[TEXT_LEN] = {0};\n"
      + "    char key[KEY_LEN] = {0};\n"
      + "    char value[TEXT_LEN] = {0};\n"
      + "\n"
      + "    /* TODO: fgets 读第一行当 JSON，去掉行尾换行 */\n"
      + "    /* TODO: while (fgets(key, sizeof key, stdin) != NULL) { 查键并打印 } */\n"
      + "    /* TODO: 再用 {\"a\": } 验一次 -1 分支，打印 Error: malformed JSON */\n"
      + "\n"
      + "    return 0;\n"
      + "}",
      hint: "先写四个小函数，它们统一约定「成功返回下一个位置、失败返回 -1」。json_get 里用一个 for (;;) 循环：读键、认冒号、读值、比键；没命中就看下一个非空白字符是 ',' 还是对象结束符。别忘了先把 JSON 行和键行的行尾 '\\n' 都去掉，否则 strcmp 永远不相等。对象开始 / 结束符建议放进字符串常量按下标取用（OBJ[0] / OBJ[1]），这样结构符号只有一个出处。",
      check: {
        include: ["stdio.h", "string.h"],
        return0: true,
        calls: [["fgets"], ["json_get"], ["printf", "="]],
        callCounts: [["printf", 3, 30], ["strcmp", 1, 10]],
        forbid: ["gets", "strcpy"],
        require: { if: true, loop: true, funcs: ["json_get"] },
        minStatements: 25,
        message: "需要 <stdio.h>、<string.h>、自己定义的 json_get()、main 里的 fgets 读入与 printf 输出，以及用 strcmp 比较键名。",
        ok: "迷你 JSON 解析器结构完整：跳过空白、读键读值、三种返回值都齐全。",
      },
      expectedOutput: "year = 2013\n"
      + "author = King\n"
      + "price = <not found>\n"
      + "Error: malformed JSON",
      input: "{\"title\": \"C Primer Plus\", \"year\": 2013, \"author\": \"King\"}\n"
      + "year\n"
      + "author\n"
      + "price",
      solution: "#include <stdio.h>\n"
      + "#include <string.h>\n"
      + "\n"
      + "#define TEXT_LEN 256\n"
      + "#define KEY_LEN 64\n"
      + "\n"
      + "/* 结构字符表：OBJ[0] 是对象开始符，OBJ[1] 是对象结束符。\n"
      + "   把这对字符放进字符串常量按下标取用，源码里就不必再写花括号字符常量 */\n"
      + "static const char OBJ[] = \"{}\";\n"
      + "\n"
      + "/* 跳过空白字符，返回第一个非空白字符的下标 */\n"
      + "static int skip_ws(const char *s, int i) {\n"
      + "    while (s[i] == ' ' || s[i] == '\\t' || s[i] == '\\r' || s[i] == '\\n') {\n"
      + "        i++;\n"
      + "    }\n"
      + "    return i;\n"
      + "}\n"
      + "\n"
      + "/* 去掉行尾的换行符（fgets 会把 '\\n' 一起读进来） */\n"
      + "static void strip_newline(char *s) {\n"
      + "    int len = (int)strlen(s);\n"
      + "\n"
      + "    while (len > 0 && (s[len - 1] == '\\n' || s[len - 1] == '\\r')) {\n"
      + "        s[--len] = '\\0';\n"
      + "    }\n"
      + "}\n"
      + "\n"
      + "/* 读一个双引号字符串，写进 out；成功返回结束位置的下标，失败返回 -1 */\n"
      + "static int read_string(const char *s, int i, char *out, int size) {\n"
      + "    int n = 0;\n"
      + "\n"
      + "    if (s[i] != '\"') {\n"
      + "        return -1;\n"
      + "    }\n"
      + "    i++;\n"
      + "    while (s[i] != '\\0' && s[i] != '\"') {\n"
      + "        if (n < size - 1) {\n"
      + "            out[n++] = s[i];\n"
      + "        }\n"
      + "        i++;\n"
      + "    }\n"
      + "    if (s[i] != '\"') {\n"
      + "        return -1;\n"
      + "    }\n"
      + "    out[n] = '\\0';\n"
      + "    return i + 1;\n"
      + "}\n"
      + "\n"
      + "/* 读一个数字（可带负号），写进 out；成功返回结束位置的下标，失败返回 -1 */\n"
      + "static int read_number(const char *s, int i, char *out, int size) {\n"
      + "    int n = 0;\n"
      + "\n"
      + "    if (s[i] == '-') {\n"
      + "        if (n < size - 1) {\n"
      + "            out[n++] = s[i];\n"
      + "        }\n"
      + "        i++;\n"
      + "    }\n"
      + "    if (s[i] < '0' || s[i] > '9') {\n"
      + "        return -1;\n"
      + "    }\n"
      + "    while (s[i] >= '0' && s[i] <= '9') {\n"
      + "        if (n < size - 1) {\n"
      + "            out[n++] = s[i];\n"
      + "        }\n"
      + "        i++;\n"
      + "    }\n"
      + "    out[n] = '\\0';\n"
      + "    return i;\n"
      + "}\n"
      + "\n"
      + "/* 在扁平对象里找 key：找到返回 1，没找到返回 0，格式不对返回 -1 */\n"
      + "static int json_get(const char *text, const char *key, char *out, int size) {\n"
      + "    char name[TEXT_LEN];\n"
      + "    int i = skip_ws(text, 0);\n"
      + "\n"
      + "    if (text[i] != OBJ[0]) {\n"
      + "        return -1;\n"
      + "    }\n"
      + "    i = skip_ws(text, i + 1);\n"
      + "    if (text[i] == OBJ[1]) {\n"
      + "        return 0; /* 空对象 */\n"
      + "    }\n"
      + "\n"
      + "    for (;;) {\n"
      + "        int next = read_string(text, i, name, sizeof name);\n"
      + "\n"
      + "        if (next < 0) {\n"
      + "            return -1;\n"
      + "        }\n"
      + "        i = skip_ws(text, next);\n"
      + "        if (text[i] != ':') {\n"
      + "            return -1;\n"
      + "        }\n"
      + "        i = skip_ws(text, i + 1);\n"
      + "\n"
      + "        if (text[i] == '\"') {\n"
      + "            next = read_string(text, i, out, size);\n"
      + "        } else {\n"
      + "            next = read_number(text, i, out, size);\n"
      + "        }\n"
      + "        if (next < 0) {\n"
      + "            return -1;\n"
      + "        }\n"
      + "        if (strcmp(name, key) == 0) {\n"
      + "            return 1;\n"
      + "        }\n"
      + "\n"
      + "        i = skip_ws(text, next);\n"
      + "        if (text[i] == ',') {\n"
      + "            i = skip_ws(text, i + 1);\n"
      + "            continue;\n"
      + "        }\n"
      + "        if (text[i] == OBJ[1]) {\n"
      + "            return 0;\n"
      + "        }\n"
      + "        return -1;\n"
      + "    }\n"
      + "}\n"
      + "\n"
      + "int main(void) {\n"
      + "    char text[TEXT_LEN] = {0};\n"
      + "    char key[KEY_LEN] = {0};\n"
      + "    char value[TEXT_LEN] = {0};\n"
      + "\n"
      + "    if (fgets(text, sizeof text, stdin) == NULL) {\n"
      + "        printf(\"Error: expected one line of JSON\\n\");\n"
      + "        return 1;\n"
      + "    }\n"
      + "    strip_newline(text);\n"
      + "\n"
      + "    /* 第二行起，每行一个要查的键，查到输入结束 */\n"
      + "    while (fgets(key, sizeof key, stdin) != NULL) {\n"
      + "        int status;\n"
      + "\n"
      + "        strip_newline(key);\n"
      + "        if (key[0] == '\\0') {\n"
      + "            continue;\n"
      + "        }\n"
      + "        status = json_get(text, key, value, sizeof value);\n"
      + "        if (status < 0) {\n"
      + "            printf(\"Error: malformed JSON\\n\");\n"
      + "            return 1;\n"
      + "        }\n"
      + "        if (status == 0) {\n"
      + "            printf(\"%s = <not found>\\n\", key);\n"
      + "        } else {\n"
      + "            printf(\"%s = %s\\n\", key, value);\n"
      + "        }\n"
      + "    }\n"
      + "\n"
      + "    /* 换个文本再验一次错误处理：这段的键后面缺了值 */\n"
      + "    if (json_get(\"{\\\"a\\\": }\", \"a\", value, sizeof value) < 0) {\n"
      + "        printf(\"Error: malformed JSON\\n\");\n"
      + "    }\n"
      + "    return 0;\n"
      + "}",
      mastery: [
        "能照着语法拆出 skip / read / parse 三层小函数，并统一「下一个位置 / 失败」的返回约定",
        "能说出「没找到」与「格式错误」为什么必须用不同返回值",
        "能用固定字符串测试解析函数的每个分支，包括错误分支",
        "能明确说出这个迷你解析器不支持哪些 JSON 特性"
      ]
    },
    {
      id: 85,
      title: "项目五：自己的断言 / 测试小框架",
      minutes: 30,
      gist: "用宏 + 计数器写一个自己的测试框架：跑一组用例，打印通过几条、失败几条。",
      lesson: "这一关写一个自己的测试小框架：几个宏加三个计数器，跑一组用例，最后打印「通过几条、失败几条」。为什么要自己写？因为 assert 只能告诉你「这一条挂了」然后直接终止程序，你看不到「一共跑了几条、还有哪些通过」。一个能继续跑完、最后给出统计的框架，才是写代码时真正会用的东西。\n"
      + "框架由两部分组成：宏和函数。宏的职责是「把实参的源码文本抓下来」，函数的职责是「比较、计数、打印」。CHECK(cond) 展开后判断条件，失败时把条件源码交给 report_fail；CHECK_EQ_INT(expected, actual) 把两个值连同它们的源码交给 check_eq_int；CHECK_SUMMARY() 只负责把三个计数器打印成一行。宏保持单行、越薄越好——宏体越长，出错时越难看懂。\n"
      + "关键工具是 # 运算符：在带参宏里写 #cond，预处理器会把它替换成实参的源码字符串。CHECK(is_even(10)) 里的 #cond 得到 \"is_even(10)\"；CHECK_EQ_INT(1, max_of(6, 1)) 里的 #expected、#actual 分别得到 \"1\" 和 \"max_of(6, 1)\"。这就是为什么宏能打印「出错的那行代码」而函数做不到——函数拿到的只是值，源码在调用时就已经消失了。\n"
      + "带多条语句的宏要用 do { … } while (0) 包起来。原因是宏是纯文本替换：如果写成 { … }，那么 if (x) CHECK(y); else … 展开后会变成 if (x) { … } ; else …，多出来的那个分号把 else 悬空了，编译直接报错。do { … } while (0) 在语法上等价于一条语句，后面照常写分号，放在任何位置都安全。\n"
      + "还有一个经典陷阱：宏的参数在宏体里出现几次就会被求值几次。CHECK_EQ_INT 的做法是把两个值交给函数（函数参数只求值一次，天生安全）；如果宏体里自己写 if ((expected) == (actual)) 之后再打印 (expected)，那么 CHECK_EQ_INT(i++, 5) 会让 i 自增两次。写带参宏时，凡是参数出现两次以上，都要先想一想副作用——第 57 关讲过这个坑，这里又遇到一次。\n"
      + "计数器用文件作用域的 static 变量（static int checks_run;）：作用域只在本文件，不会和库或其他文件里的同名变量冲突。这也是 C 里表示「模块私有状态」的常见写法。\n"
      + "最后：故意留一条会失败的用例是有意的。一个从没失败过的测试框架不值得信任——你需要亲眼看到它把失败打得清清楚楚（表达式、期望值、实际值），才敢在真正的项目里依赖它。看到 failed = 1，然后顺着那行 FAIL 去查，这就是「回归测试」的日常。\n"
      + "怎么读别人的代码：测试代码通常比产品代码更好读——每一行 CHECK 就是一条需求说明。看到 CHECK_EQ_INT(期望, 实际) 要留意参数顺序：习惯上期望在前、实际在后，写反了会把排查方向带偏。",
      example: {
        code: "#include <stdio.h>\n"
        + "\n"
        + "/* ---- 迷你测试框架：三个计数器 + 三个单行宏 ---- */\n"
        + "static int checks_run = 0;\n"
        + "static int checks_passed = 0;\n"
        + "static int checks_failed = 0;\n"
        + "\n"
        + "/* 宏只负责「比较 + 把实参原样变成字符串」，报告格式统一放进函数，宏体越薄越好 */\n"
        + "static void report_fail(const char *what) {\n"
        + "    checks_failed++;\n"
        + "    printf(\"FAIL: %s\\n\", what);\n"
        + "}\n"
        + "\n"
        + "static void check_eq_int(int expected, int actual, const char *e_src, const char *a_src) {\n"
        + "    checks_run++;\n"
        + "    if (expected == actual) {\n"
        + "        checks_passed++;\n"
        + "    } else {\n"
        + "        checks_failed++;\n"
        + "        printf(\"FAIL: CHECK_EQ_INT(%s, %s) : expected %d, actual %d\\n\", e_src, a_src, expected, actual);\n"
        + "    }\n"
        + "}\n"
        + "\n"
        + "#define CHECK(cond) do { checks_run++; if (cond) { checks_passed++; } else { report_fail(#cond); } } while (0)\n"
        + "#define CHECK_EQ_INT(expected, actual) check_eq_int((expected), (actual), #expected, #actual)\n"
        + "#define CHECK_SUMMARY() printf(\"passed = %d, failed = %d, total = %d\\n\", checks_passed, checks_failed, checks_run)\n"
        + "\n"
        + "/* ---- 被测函数 ---- */\n"
        + "static int add(int a, int b) {\n"
        + "    return a + b;\n"
        + "}\n"
        + "\n"
        + "static int is_even(int n) {\n"
        + "    return n % 2 == 0;\n"
        + "}\n"
        + "\n"
        + "int main(void) {\n"
        + "    CHECK_EQ_INT(5, add(2, 3));\n"
        + "    CHECK_EQ_INT(-1, add(-4, 3));\n"
        + "    CHECK_EQ_INT(0, add(0, 0));\n"
        + "    CHECK(is_even(10));\n"
        + "    CHECK(!is_even(7));\n"
        + "    CHECK_EQ_INT(10, add(4, 5)); /* 故意写错一条，用来看框架怎么报失败 */\n"
        + "\n"
        + "    CHECK_SUMMARY();\n"
        + "    return 0;\n"
        + "}",
        output: "FAIL: CHECK_EQ_INT(10, add(4, 5)) : expected 10, actual 9\n"
        + "passed = 5, failed = 1, total = 6",
        explain: "三个 static 计数器放在文件开头，宏和函数共用；作用域只在本文件内，不会污染别处。\n"
        + "report_fail 与 check_eq_int 是「干活」的函数：前者打印失败条件，后者比较两个整数并打印期望与实际。把格式固定在这里，宏里就只剩比较和传参。\n"
        + "CHECK 用 do { … } while (0) 包住多步操作，在语法上等价于一条语句；#cond 把实参源码变成字符串，所以失败时打印的正是你写的那段条件。\n"
        + "CHECK_EQ_INT 展开成一次函数调用：实参只求值一次，源码文本由 #expected / #actual 捕获；CHECK_SUMMARY 直接把三个计数器打印成一行。\n"
        + "main 里六条用例，前五条通过，第六条 CHECK_EQ_INT(10, add(4, 5)) 故意写错，于是输出一行 FAIL（带表达式、期望值、实际值）和一行统计——这正是框架该有的表现。"
      },
      pitfalls: [
        "多语句宏不用 do { … } while (0) 包起来：if (x) CHECK(y); else … 展开后分号会把 else 悬空，编译报 'else' without a previous 'if'。",
        "宏参数重复求值：同一个参数在宏体里写两次，CHECK_EQ_INT(i++, 5) 会让 i 自增两次；参数只该求值一次。",
        "忘记给参数加括号：#define DOUBLE(x) x * 2 遇到 DOUBLE(1 + 2) 会算成 1 + 2 * 2 = 5，必须写成 ((x) * 2)。",
        "把宏体写成多行：C 允许用反斜杠续行，但续行处的空白、注释和漏写的反斜杠都是常见 bug 来源，测试框架的宏建议保持单行，读起来也更快。",
        "只打印失败、不统计总数：看到一堆 FAIL 却不知道一共跑了几条，回归时没法比较。",
        "FAIL 信息只写「失败」不写期望与实际：排查时还得回头翻代码；带上表达式和两个数值才省时间。",
        "计数器用普通全局变量：多个文件里同名会冲突，测试框架的内部状态应当用 static 限制在本文件。"
      ],
      takeaways: [
        "测试框架 = 宏（抓源码）+ 函数（比较与打印）+ 计数器（统计）",
        "# 运算符把宏实参变成源码字符串，FAIL 信息才能打印出出错的那段代码",
        "多语句宏用 do { … } while (0) 包住，才能在 if / else 里安全使用",
        "宏参数只求值一次；宏体越薄越好，复杂逻辑放进函数",
        "最后的统计行（passed / failed / total）是回归测试的锚点"
      ],
      questions: [
        {
          q: "多语句的宏为什么要写成 `do { … } while (0)`？",
          options: [
            "do…while(0) 会让宏体重复执行直到条件为假，宏体因此更可靠",
            "让宏体在语法上等价于一条语句，if (cond) CHECK(x); else … 不会被那个分号拆坏",
            "因为宏展开后必须以分号结尾，否则编译报错",
            "这样宏内的局部变量就不会和其他变量重名"
          ],
          answer: 1,
          explain: "宏是纯文本替换：如果宏体是 { … }，那么 if (x) CHECK(y); else … 里的分号会变成独立的空语句，else 就找不到配对的 if，所以 B 对。A 错：do…while(0) 的条件恒为假，循环体只执行一次，它的作用在语法而不在循环。C 错：宏不写 do…while(0) 也能编译，问题只出现在 if / else 这类上下文里。D 错：变量重名要靠命名和 static / 局部作用域解决，与 do…while 无关。"
        },
        {
          q: "`#define CHECK_EQ_INT(expected, actual)` 里把两个值交给函数处理，而不是在宏体里反复使用参数，主要避免了什么？",
          options: [
            "让带副作用的实参只求值一次（例如 i++ 只自增一次），并保证比较与打印用的是同一个值",
            "让宏展开后的代码更短",
            "因为宏的参数不能直接写进 printf",
            "因为 C 语言不允许在宏里比较两个表达式"
          ],
          answer: 0,
          explain: "宏参数会被替换到宏体里每一次出现的位置，出现两次就求值两次，所以带副作用的实参必须只求值一次，A 对。B 错：长度不是重点，正确性才是。C 错：宏参数当然能写进 printf，那正是 # 运算符最常见的用法。D 错：宏体里比较表达式完全合法，只是要自己注意副作用和括号。"
        },
        {
          q: "测试框架最后打印「passed / failed / total」三个数字，最主要的价值是？",
          options: [
            "让程序运行得更快",
            "有了计数就不需要逐条看用例的具体结果了",
            "计数器是 C 语言对测试程序的语法要求",
            "一眼看出跑了几条、错了几条；改动之后再跑一次，数字变化就是「有没有弄坏原来通过的东西」的信号"
          ],
          answer: 3,
          explain: "统计行是回归测试的锚点：改动前后对比数字，就能判断有没有引入新的失败，D 对。B 错：数字告诉你「有没有问题」，具体是哪条、错在哪，仍然要看 FAIL 行。A 错：计数不影响执行速度。C 错：C 语言对测试程序没有任何特殊要求，这完全是自己的约定。"
        }
      ],
      passRatio: 0.8,
      mission: "写一个自己的迷你测试框架，并用它测两个函数。\n"
      + "【必须定义的三个宏（名字照抄）】\n"
      + "#define CHECK(cond)：条件不成立时打印 FAIL: <cond 的源码>；\n"
      + "#define CHECK_EQ_INT(expected, actual)：不相等时打印 FAIL: CHECK_EQ_INT(<期望源码>, <实际源码>) : expected %d, actual %d；\n"
      + "#define CHECK_SUMMARY()：打印 passed = %d, failed = %d, total = %d。\n"
      + "【写法要求】\n"
      + "1) 三个计数器用文件作用域的 static int（例如 checks_run / checks_passed / checks_failed）；\n"
      + "2) 打印格式集中在函数里（例如 report_fail、check_eq_int），宏保持单行、越薄越好；宏体若有多条语句，用 do { … } while (0) 包住；\n"
      + "3) 用 # 运算符把实参打印成源码；\n"
      + "4) 自己定义 int add(int a, int b) 与 int max_of(int a, int b)；不要使用 <assert.h>。\n"
      + "【main 里按顺序跑这 5 条用例】\n"
      + "CHECK_EQ_INT(7, add(3, 4));\n"
      + "CHECK_EQ_INT(0, add(-5, 5));\n"
      + "CHECK_EQ_INT(9, max_of(2, 9));\n"
      + "CHECK(max_of(-3, -8) == -3);\n"
      + "CHECK_EQ_INT(1, max_of(6, 1));　　/* 这条故意写错：max_of(6, 1) 是 6 */\n"
      + "最后调用 CHECK_SUMMARY(); 再 return 0;\n"
      + "【预期输出】两行：\n"
      + "FAIL: CHECK_EQ_INT(1, max_of(6, 1)) : expected 1, actual 6\n"
      + "passed = 4, failed = 1, total = 5\n"
      + "注意：宏建议写成单行——多行宏要靠反斜杠续行，续行处多一个空格或漏一个反斜杠都会出错，测试框架里没必要冒这个险。",
      starter: "#include <stdio.h>\n"
      + "\n"
      + "static int checks_run = 0;\n"
      + "static int checks_passed = 0;\n"
      + "static int checks_failed = 0;\n"
      + "\n"
      + "/* TODO: report_fail / check_eq_int 两个报告函数（打印格式集中在这里） */\n"
      + "\n"
      + "/* TODO: 三个单行宏\n"
      + "   #define CHECK(cond) …\n"
      + "   #define CHECK_EQ_INT(expected, actual) …\n"
      + "   #define CHECK_SUMMARY() … */\n"
      + "\n"
      + "/* TODO: int add(int a, int b) 与 int max_of(int a, int b) */\n"
      + "\n"
      + "int main(void) {\n"
      + "    /* TODO: 按任务顺序写 5 条用例，最后 CHECK_SUMMARY(); */\n"
      + "\n"
      + "    return 0;\n"
      + "}",
      hint: "把「打印」放进函数，宏里只留比较和计数：CHECK 用 do { … } while (0) 包住，CHECK_EQ_INT 直接把 (expected)、(actual) 和 #expected、#actual 交给 check_eq_int。三个宏都写单行。跑起来后你会看到一条 FAIL 和一行统计——FAIL 里的表达式、期望值、实际值就是你排查问题的全部线索。",
      check: {
        include: ["stdio.h"],
        return0: true,
        callCounts: [["CHECK", 2, 40], ["CHECK_EQ_INT", 5, 40], ["printf", 2, 20]],
        forbid: ["assert"],
        require: { funcs: ["add", "max_of"] },
        minStatements: 18,
        message: "需要 #include <stdio.h>、add() 与 max_of() 两个函数、CHECK / CHECK_EQ_INT / CHECK_SUMMARY 三个宏（CHECK_EQ_INT 至少出现 5 次，含宏定义那一行，即实际使用至少 4 次），并且不要使用 assert。",
        ok: "迷你测试框架成型：宏抓源码、函数干活、计数器给出统计。",
      },
      expectedOutput: "FAIL: CHECK_EQ_INT(1, max_of(6, 1)) : expected 1, actual 6\n"
      + "passed = 4, failed = 1, total = 5",
      solution: "#include <stdio.h>\n"
      + "\n"
      + "/* ---- 迷你测试框架：三个计数器 + 三个单行宏 ---- */\n"
      + "static int checks_run = 0;\n"
      + "static int checks_passed = 0;\n"
      + "static int checks_failed = 0;\n"
      + "\n"
      + "/* 宏只负责「比较 + 把实参原样变成字符串」，报告格式统一放进函数，宏体越薄越好 */\n"
      + "static void report_fail(const char *what) {\n"
      + "    checks_failed++;\n"
      + "    printf(\"FAIL: %s\\n\", what);\n"
      + "}\n"
      + "\n"
      + "static void check_eq_int(int expected, int actual, const char *e_src, const char *a_src) {\n"
      + "    checks_run++;\n"
      + "    if (expected == actual) {\n"
      + "        checks_passed++;\n"
      + "    } else {\n"
      + "        checks_failed++;\n"
      + "        printf(\"FAIL: CHECK_EQ_INT(%s, %s) : expected %d, actual %d\\n\", e_src, a_src, expected, actual);\n"
      + "    }\n"
      + "}\n"
      + "\n"
      + "#define CHECK(cond) do { checks_run++; if (cond) { checks_passed++; } else { report_fail(#cond); } } while (0)\n"
      + "#define CHECK_EQ_INT(expected, actual) check_eq_int((expected), (actual), #expected, #actual)\n"
      + "#define CHECK_SUMMARY() printf(\"passed = %d, failed = %d, total = %d\\n\", checks_passed, checks_failed, checks_run)\n"
      + "\n"
      + "/* ---- 被测函数 ---- */\n"
      + "static int add(int a, int b) {\n"
      + "    return a + b;\n"
      + "}\n"
      + "\n"
      + "static int max_of(int a, int b) {\n"
      + "    return (a > b) ? a : b;\n"
      + "}\n"
      + "\n"
      + "int main(void) {\n"
      + "    CHECK_EQ_INT(7, add(3, 4));\n"
      + "    CHECK_EQ_INT(0, add(-5, 5));\n"
      + "    CHECK_EQ_INT(9, max_of(2, 9));\n"
      + "    CHECK(max_of(-3, -8) == -3);\n"
      + "    CHECK_EQ_INT(1, max_of(6, 1)); /* 故意写错一条，用来看框架怎么报失败 */\n"
      + "\n"
      + "    CHECK_SUMMARY();\n"
      + "    return 0;\n"
      + "}",
      mastery: [
        "能写出 CHECK / CHECK_EQ_INT / CHECK_SUMMARY 三个宏，并用 # 运算符打印实参源码",
        "能解释 do { … } while (0) 解决的是什么问题、不加会怎样",
        "能说出带参宏的副作用陷阱，并写出只求值一次的宏",
        "能用统计行判断「这次改动有没有弄坏原来通过的东西」"
      ]
    },
    {
      id: 86,
      title: "毕业关：学生成绩管理系统",
      minutes: 50,
      gist: "综合大作业：把结构体、分层函数、稳定排序与文件持久化合成一个可交付的成绩管理系统。",
      lesson: "这一关把整门课串成一个能交付的小系统：学生成绩管理系统。它同时用到——结构体（数据类型）、数组 + 计数（容器）、函数拆分（工程结构）、循环与分支（控制流）、fprintf / fscanf（持久化）、返回值与错误分支（可靠性）。写完它，你就完整走了一遍「从数据到界面」的链路。\n"
      + "第一层是数据。struct Student { char name[16]; int score; } 定义「一名学生长什么样」；struct Student list[50] 加 int count 定义「一组学生怎么存」。这一层的关键决定是容量上限：最多 50 名、姓名最多 15 个字符。上限要写死在宏里（MAX_STUDENTS、NAME_LEN），因为 C 的数组大小是编译期决定的。\n"
      + "第二层是操作。每个函数只做一件事：add_student 负责校验和追加，print_students 负责按存储顺序打印，print_stats 负责统计，sort_by_score 负责排序，save_students / load_students 负责持久化。这样拆分的好处很实在：统计函数不需要知道菜单长什么样，排序函数不需要知道数据是键盘敲的还是文件读的——它们只依赖「数组 + 条数」。\n"
      + "第三层是界面。main 里只有一个命令循环：读命令、分发、打印反馈。它不实现任何业务逻辑，所以读代码的人两分钟就能看懂「这个程序能做什么」。这就是分层：界面薄、逻辑厚，谁都不越界。\n"
      + "几个必须处理的边界：count 为 0 时统计不能做除法，也不能把 list[0] 当最大值；分数必须在 0..100 之间，越界要拒绝并提示；数组满了要明确说「满了」，而不是悄悄写越界；文件打不开要报错，而不是继续用 NULL。这份清单就是「工程感」的具体样子——功能之外，把每种异常都想一遍。\n"
      + "排序要求「分数相同时保持原来的先后」，这叫稳定排序。插入排序天然稳定，前提是比较写成 while (j >= 0 && list[j].score < key.score)：只有严格小于才后移，遇到相等就停下，相等元素不会互换。写成 <= 就会把相等的元素也往后换，稳定性就没了。\n"
      + "持久化要读写对称：存的时候 fprintf(fp, \"%s %d\\n\", …) 一条一行；读的时候 fscanf(fp, \"%15s %d\", …) == 2 判断这一行是不是两条都读到了。读字符串一定要限制宽度，否则超长姓名会把相邻字段覆盖掉。存完记得 fclose，读之前确认 fopen 成功。\n"
      + "怎么读别人的代码：先看 struct（有哪些数据）、再看函数清单（能做什么），最后看 main 的命令循环（人怎么操作）。三层看完，一个陌生项目的轮廓就清楚了——这门课教的所有语法，最终都是为了让这三层各自干净。\n"
      + "从第 1 关的 printf(\"Hello, C!\") 到这里，你已经能独立写出带文件持久化和错误处理的完整程序。接下来该做的，是找一个自己真的想写的小工具，用同样的三层结构把它写出来——那才是这门课真正的毕业作品。",
      example: {
        code: "#include <stdio.h>\n"
        + "\n"
        + "#define MAX_STUDENTS 50\n"
        + "#define NAME_LEN 16\n"
        + "#define FILE_NAME \"grades.txt\"\n"
        + "\n"
        + "struct Student {\n"
        + "    char name[NAME_LEN];\n"
        + "    int score;\n"
        + "};\n"
        + "\n"
        + "/* 有界拷贝：最多写 size-1 个字符再补 '\\0' */\n"
        + "static void copy_text(char *dst, int size, const char *src) {\n"
        + "    int i = 0;\n"
        + "\n"
        + "    while (i < size - 1 && src[i] != '\\0') {\n"
        + "        dst[i] = src[i];\n"
        + "        i++;\n"
        + "    }\n"
        + "    dst[i] = '\\0';\n"
        + "}\n"
        + "\n"
        + "/* 追加一名学生，返回追加后的条数；分数越界或表满时不追加 */\n"
        + "static int add_student(struct Student *list, int count, const char *name, int score) {\n"
        + "    if (count >= MAX_STUDENTS) {\n"
        + "        printf(\"List is full.\\n\");\n"
        + "        return count;\n"
        + "    }\n"
        + "    if (score < 0 || score > 100) {\n"
        + "        printf(\"Bad score: %d\\n\", score);\n"
        + "        return count;\n"
        + "    }\n"
        + "    copy_text(list[count].name, NAME_LEN, name);\n"
        + "    list[count].score = score;\n"
        + "    printf(\"Added: %s (%d)\\n\", list[count].name, list[count].score);\n"
        + "    return count + 1;\n"
        + "}\n"
        + "\n"
        + "static void print_students(const struct Student *list, int count) {\n"
        + "    int i;\n"
        + "\n"
        + "    printf(\"-- students (%d) --\\n\", count);\n"
        + "    for (i = 0; i < count; i++) {\n"
        + "        printf(\"%s %d\\n\", list[i].name, list[i].score);\n"
        + "    }\n"
        + "}\n"
        + "\n"
        + "/* 统计：总分、平均分、最高分与最低分（并列时取先出现的那位） */\n"
        + "static void print_stats(const struct Student *list, int count) {\n"
        + "    int sum = 0;\n"
        + "    int best = 0;\n"
        + "    int worst = 0;\n"
        + "    int i;\n"
        + "\n"
        + "    if (count == 0) {\n"
        + "        printf(\"No students yet.\\n\");\n"
        + "        return;\n"
        + "    }\n"
        + "    for (i = 0; i < count; i++) {\n"
        + "        sum += list[i].score;\n"
        + "        if (list[i].score > list[best].score) {\n"
        + "            best = i;\n"
        + "        }\n"
        + "        if (list[i].score < list[worst].score) {\n"
        + "            worst = i;\n"
        + "        }\n"
        + "    }\n"
        + "    printf(\"count = %d, average = %.1f, max = %d (%s), min = %d (%s)\\n\",\n"
        + "           count, (double)sum / count,\n"
        + "           list[best].score, list[best].name,\n"
        + "           list[worst].score, list[worst].name);\n"
        + "}\n"
        + "\n"
        + "/* 插入排序：分数高的在前；分数相同时保持原来的先后（稳定） */\n"
        + "static void sort_by_score(struct Student *list, int count) {\n"
        + "    int i;\n"
        + "\n"
        + "    for (i = 1; i < count; i++) {\n"
        + "        struct Student key = list[i];\n"
        + "        int j = i - 1;\n"
        + "\n"
        + "        while (j >= 0 && list[j].score < key.score) {\n"
        + "            list[j + 1] = list[j];\n"
        + "            j--;\n"
        + "        }\n"
        + "        list[j + 1] = key;\n"
        + "    }\n"
        + "    printf(\"-- sorted by score (desc) --\\n\");\n"
        + "    for (i = 0; i < count; i++) {\n"
        + "        printf(\"%s %d\\n\", list[i].name, list[i].score);\n"
        + "    }\n"
        + "}\n"
        + "\n"
        + "static void save_students(const struct Student *list, int count) {\n"
        + "    FILE *fp = fopen(FILE_NAME, \"w\");\n"
        + "    int i;\n"
        + "\n"
        + "    if (fp == NULL) {\n"
        + "        printf(\"Cannot write %s\\n\", FILE_NAME);\n"
        + "        return;\n"
        + "    }\n"
        + "    for (i = 0; i < count; i++) {\n"
        + "        fprintf(fp, \"%s %d\\n\", list[i].name, list[i].score);\n"
        + "    }\n"
        + "    fclose(fp);\n"
        + "    printf(\"Saved %d student(s) to %s\\n\", count, FILE_NAME);\n"
        + "}\n"
        + "\n"
        + "static int load_students(struct Student *list, int max) {\n"
        + "    FILE *fp = fopen(FILE_NAME, \"r\");\n"
        + "    int count = 0;\n"
        + "\n"
        + "    if (fp == NULL) {\n"
        + "        printf(\"Cannot read %s\\n\", FILE_NAME);\n"
        + "        return 0;\n"
        + "    }\n"
        + "    while (count < max && fscanf(fp, \"%15s %d\", list[count].name, &list[count].score) == 2) {\n"
        + "        count++;\n"
        + "    }\n"
        + "    fclose(fp);\n"
        + "    printf(\"Loaded %d student(s) from %s\\n\", count, FILE_NAME);\n"
        + "    return count;\n"
        + "}\n"
        + "\n"
        + "int main(void) {\n"
        + "    struct Student list[MAX_STUDENTS];\n"
        + "    int count = 0;\n"
        + "    int command = -1;\n"
        + "\n"
        + "    remove(FILE_NAME); /* 清掉上次运行留下的文件，保证演示可复现 */\n"
        + "\n"
        + "    printf(\"Commands: 1=add 2=list 3=stats 4=sort 5=save 6=load 0=quit\\n\");\n"
        + "    while (scanf(\"%d\", &command) == 1 && command != 0) {\n"
        + "        if (command == 1) {\n"
        + "            char name[NAME_LEN] = {0};\n"
        + "            int score = 0;\n"
        + "\n"
        + "            if (scanf(\"%15s %d\", name, &score) != 2) {\n"
        + "                printf(\"Bad input: expected <name> <score>\\n\");\n"
        + "                break;\n"
        + "            }\n"
        + "            count = add_student(list, count, name, score);\n"
        + "        } else if (command == 2) {\n"
        + "            print_students(list, count);\n"
        + "        } else if (command == 3) {\n"
        + "            print_stats(list, count);\n"
        + "        } else if (command == 4) {\n"
        + "            sort_by_score(list, count);\n"
        + "        } else if (command == 5) {\n"
        + "            save_students(list, count);\n"
        + "        } else if (command == 6) {\n"
        + "            count = load_students(list, MAX_STUDENTS);\n"
        + "        } else {\n"
        + "            printf(\"Unknown command: %d\\n\", command);\n"
        + "        }\n"
        + "    }\n"
        + "    remove(FILE_NAME); /* 演示结束，删掉临时文件 */\n"
        + "    printf(\"Bye.\\n\");\n"
        + "    return 0;\n"
        + "}",
        input: "1 Alice 92\n"
        + "1 Bob 78\n"
        + "1 Cara 88\n"
        + "2\n"
        + "3\n"
        + "4\n"
        + "5\n"
        + "6\n"
        + "0",
        output: "Commands: 1=add 2=list 3=stats 4=sort 5=save 6=load 0=quit\n"
        + "Added: Alice (92)\n"
        + "Added: Bob (78)\n"
        + "Added: Cara (88)\n"
        + "-- students (3) --\n"
        + "Alice 92\n"
        + "Bob 78\n"
        + "Cara 88\n"
        + "count = 3, average = 86.0, max = 92 (Alice), min = 78 (Bob)\n"
        + "-- sorted by score (desc) --\n"
        + "Alice 92\n"
        + "Cara 88\n"
        + "Bob 78\n"
        + "Saved 3 student(s) to grades.txt\n"
        + "Loaded 3 student(s) from grades.txt\n"
        + "Bye.",
        explain: "文件按三层排列：宏与 struct Student（数据层），六个 static 函数（操作层），main 里的命令循环（界面层）。\n"
        + "add_student 里有两个错误分支：分数不在 0..100 就打印 Bad score: 并原样返回条数；表满就打印 List is full.。正常路径拷贝姓名、存分数、打印 Added 行，并返回 count + 1。\n"
        + "print_stats 先处理 count == 0（打印 No students yet.），再用一趟循环同时算总分、最高分下标和最低分下标；平均分写 (double)sum / count，避免整数除法；并列时因为用的是严格大于 / 小于，取到的是先出现的那位。\n"
        + "sort_by_score 是插入排序，比较只写 list[j].score < key.score，所以相等的元素保持原序（稳定）；排完立刻按新顺序打印一遍。\n"
        + "save_students / load_students 用 fprintf 与 fscanf(\"%15s %d\", …) == 2 配对读写 grades.txt；main 开头与结尾各 remove 一次，保证演示可复现。\n"
        + "示例喂进去的脚本是 1 Alice 92 / 1 Bob 78 / 1 Cara 88 / 2 / 3 / 4 / 5 / 6 / 0 共九行（每行一条命令），跑完能看到列表（3 人）、统计（平均 86.0、最高 92 是 Alice、最低 78 是 Bob）、按分数降序排序、存盘与读回的完整流程。"
      },
      pitfalls: [
        "count 为 0 时求平均：sum / count 整除零，程序直接崩溃；统计函数开头先判断 count == 0。",
        "排序比较写成 <=：相等的元素也被交换，稳定性丢失，分数相同的学生顺序会变来变去。",
        "读回时不限制字符串宽度：fscanf(fp, \"%s %d\") 遇到超长姓名会覆盖相邻字段、甚至写坏内存。",
        "忘记 remove 旧文件：上一次运行留下的 grades.txt 被 load 直接读回来，输出和预期不符——凡演示写文件，先清场。",
        "把命令和数据读混：1 后面紧跟的姓名、分数必须由同一个分支连续读，读到一半回到外层循环就会错位。",
        "所有逻辑都堆在 main 里：命令循环一长，任何改动都要读完整段代码；分层拆函数就是为了避免这一点。",
        "只测顺利路径：分数越界、表满、文件打不开这些分支不测，交出去的程序碰到真实数据就崩。"
      ],
      takeaways: [
        "系统分三层：数据结构（struct + 数组 + count）、操作函数（每个只做一件事）、界面（main 只调度命令）",
        "边界要逐个想清楚：count 为 0、分数越界、数组满、文件打不开",
        "稳定排序靠严格比较：只有 < 才后移，相等的元素保持原序",
        "存读必须对称：格式一一对应，读字符串限制宽度，fopen / fclose 的检查不能省",
        "会写文件的演示先清场（remove），输出才可复现"
      ],
      questions: [
        {
          q: "成绩管理系统把「录入 / 打印 / 统计 / 排序 / 存盘 / 读回」拆成六个函数，主要好处是？",
          options: [
            "main 函数最多只能写 20 行，写多了编译不过",
            "函数越多程序运行越快",
            "一个函数只做一件事：main 只负责调度命令，各段逻辑能单独测试、单独修改",
            "不拆成函数就没法把数据保存到文件"
          ],
          answer: 2,
          explain: "拆分的收益在于「可单独测试、可局部修改」，C 对。A 错：C 标准对 main 的长度没有任何限制。B 错：函数调用只增加极少的开销，性能与函数个数无关，可读性和可维护性才是重点。D 错：文件读写靠 fopen / fprintf，跟拆不拆函数没有关系。"
        },
        {
          q: "把结构体数组用 `fprintf(fp, \"%s %d\\n\", …)` 存成文本，再用 `fscanf(fp, \"%15s %d\", …)` 读回，这种「存读配对」的关键是？",
          options: [
            "写入格式与读回格式必须一一对应，读字符串还要限制宽度（%15s）避免越界",
            "文本文件必须用二进制模式 \"rb\" 打开才能读回",
            "fscanf 的返回值可以忽略，读不到就当空记录处理",
            "读回之前必须把整个数组清零，否则数据不完整"
          ],
          answer: 0,
          explain: "读回时是照着格式串重新解析文本，格式对不上字段就会错位；宽度限制则防止超长字段写越界，所以 A 对。B 错：文本用 \"r\" / \"w\"，二进制模式是 fwrite / fread 那一套。C 错：fscanf 的返回值正是判断「这一行读全了没有」的依据，忽略它会把半条记录当完整记录。D 错：读回时每个读到的位置都会被覆盖写，清零不是正确性的前提。"
        },
        {
          q: "排序要求「分数相同时保持原来的先后」，用插入排序实现时靠的是？",
          options: [
            "比较时用 <=，让相等的元素也交换位置",
            "只在 list[j].score < key.score 时才后移，遇到相等就停下——这正是稳定排序的关键",
            "排完之后再按姓名排一次",
            "把数组改成链表再排序"
          ],
          answer: 1,
          explain: "插入排序的稳定性来自「严格小于才后移」：相等元素不会被跨过，原序自然保留，B 对。A 错：用 <= 会让相等元素也后移，稳定性被破坏，顺序变得不确定。C 错：按姓名再排一次会覆盖掉分数顺序，结果完全不同。D 错：稳定性取决于比较与移动规则，跟用数组还是链表无关。"
        }
      ],
      passRatio: 0.8,
      mission: "毕业大作业：学生成绩管理系统（单文件，约 150 行）。要求把整门课的能力用一遍：结构体、数组 + 计数、函数拆分、循环与分支、文件读写、错误处理。\n"
      + "【数据结构】struct Student { char name[16]; int score; };　用 struct Student list[50]; 加 int count。\n"
      + "【必须自己定义的函数】add_student、print_students、print_stats、sort_by_score、save_students、load_students。\n"
      + "【命令循环】开始时打印一行：Commands: 1=add 2=list 3=stats 4=sort 5=save 6=load 0=quit\n"
      + "1 = add：紧接着读一行 <name> <score>（scanf(\"%15s %d\", …)，宽度必须限制）；分数不在 0..100 → 打印 Bad score: <score> 且不记录；数组满 → 打印 List is full.；正常 → 打印 Added: <name> (<score>)\n"
      + "2 = list：先打印 -- students (<count>) --，再每行打印 <name> <score>\n"
      + "3 = stats：打印 count = <n>, average = %.1f, max = <score> (<name>), min = <score> (<name>)；平均分用 (double)sum / count；并列最高 / 最低取先出现的那位；count 为 0 时打印 No students yet.\n"
      + "4 = sort：按分数从高到低排序（插入排序，分数相同时保持原来的先后），先打印 -- sorted by score (desc) -- 再逐行打印\n"
      + "5 = save：写入 grades.txt（fprintf(fp, \"%s %d\\n\", …)），打印 Saved <n> student(s) to grades.txt\n"
      + "6 = load：读回（fscanf(fp, \"%15s %d\", …) == 2），打印 Loaded <n> student(s) from grades.txt\n"
      + "0 = quit：先 remove(\"grades.txt\")，再打印 Bye.\n"
      + "fopen 必须检查 NULL，fclose 不能漏；程序开头也 remove 一次做清场。\n"
      + "本关喂给程序的输入（12 行）：\n"
      + "1 Ivy 90\n"
      + "1 Jack 90\n"
      + "1 Kate 75\n"
      + "1 Leo 65\n"
      + "2\n"
      + "3\n"
      + "4\n"
      + "5\n"
      + "6\n"
      + "0\n"
      + "Ivy 和 Jack 都是 90：统计里 max 取先出现的 Ivy；排序后两人保持 Ivy、Jack 的原序（稳定排序）。预期输出见「运行结果比对」。",
      starter: "#include <stdio.h>\n"
      + "\n"
      + "#define MAX_STUDENTS 50\n"
      + "#define NAME_LEN 16\n"
      + "#define FILE_NAME \"grades.txt\"\n"
      + "\n"
      + "struct Student {\n"
      + "    char name[NAME_LEN];\n"
      + "    int score;\n"
      + "};\n"
      + "\n"
      + "/* TODO: add_student / print_students / print_stats\n"
      + "   TODO: sort_by_score / save_students / load_students */\n"
      + "\n"
      + "int main(void) {\n"
      + "    struct Student list[MAX_STUDENTS];\n"
      + "    int count = 0;\n"
      + "    int command = -1;\n"
      + "\n"
      + "    remove(FILE_NAME);\n"
      + "    printf(\"Commands: 1=add 2=list 3=stats 4=sort 5=save 6=load 0=quit\\n\");\n"
      + "\n"
      + "    /* TODO: while (scanf(\"%d\", &command) == 1 && command != 0) { 分发六条命令 } */\n"
      + "\n"
      + "    remove(FILE_NAME);\n"
      + "    printf(\"Bye.\\n\");\n"
      + "    return 0;\n"
      + "}",
      hint: "按三层写：struct + 数组 + count（数据），六个函数（操作），main 里的命令循环（界面）。每个函数只依赖「数组 + 条数」，不要在函数里读键盘。统计函数开头先处理 count == 0；排序的 while 条件只写 `list[j].score < key.score`，相等时停下才有稳定性。",
      check: {
        include: ["stdio.h"],
        return0: true,
        calls: [["printf", "Commands"], ["scanf", "%d"], ["scanf", "%15s"], ["remove"], ["add_student"], ["print_students"], ["print_stats"], ["sort_by_score"], ["save_students"], ["load_students"]],
        callCounts: [["fopen", 2, 9], ["fclose", 2, 9], ["fprintf", 1, 9], ["fscanf", 1, 9], ["printf", 8, 70]],
        forbid: ["gets", "strcpy"],
        require: { struct: "Student", file: true, array: true, loop: true, if: true, funcs: ["add_student", "print_students", "print_stats", "sort_by_score", "save_students", "load_students"] },
        minStatements: 35,
        message: "需要 #include <stdio.h>、struct Student（tag 名必须是 Student）、数组 + 条数、六个函数（add_student / print_students / print_stats / sort_by_score / save_students / load_students）、命令循环里的 scanf 与 remove，以及 fopen / fclose / fprintf / fscanf。",
        ok: "成绩管理系统的数据层、操作层和命令界面都齐全了，这是合格的大作业结构。",
      },
      expectedOutput: "Commands: 1=add 2=list 3=stats 4=sort 5=save 6=load 0=quit\n"
      + "Added: Ivy (90)\n"
      + "Added: Jack (90)\n"
      + "Added: Kate (75)\n"
      + "Added: Leo (65)\n"
      + "-- students (4) --\n"
      + "Ivy 90\n"
      + "Jack 90\n"
      + "Kate 75\n"
      + "Leo 65\n"
      + "count = 4, average = 80.0, max = 90 (Ivy), min = 65 (Leo)\n"
      + "-- sorted by score (desc) --\n"
      + "Ivy 90\n"
      + "Jack 90\n"
      + "Kate 75\n"
      + "Leo 65\n"
      + "Saved 4 student(s) to grades.txt\n"
      + "Loaded 4 student(s) from grades.txt\n"
      + "Bye.",
      input: "1 Ivy 90\n"
      + "1 Jack 90\n"
      + "1 Kate 75\n"
      + "1 Leo 65\n"
      + "2\n"
      + "3\n"
      + "4\n"
      + "5\n"
      + "6\n"
      + "0",
      solution: "#include <stdio.h>\n"
      + "\n"
      + "#define MAX_STUDENTS 50\n"
      + "#define NAME_LEN 16\n"
      + "#define FILE_NAME \"grades.txt\"\n"
      + "\n"
      + "struct Student {\n"
      + "    char name[NAME_LEN];\n"
      + "    int score;\n"
      + "};\n"
      + "\n"
      + "/* 有界拷贝：最多写 size-1 个字符再补 '\\0' */\n"
      + "static void copy_text(char *dst, int size, const char *src) {\n"
      + "    int i = 0;\n"
      + "\n"
      + "    while (i < size - 1 && src[i] != '\\0') {\n"
      + "        dst[i] = src[i];\n"
      + "        i++;\n"
      + "    }\n"
      + "    dst[i] = '\\0';\n"
      + "}\n"
      + "\n"
      + "/* 追加一名学生，返回追加后的条数；分数越界或表满时不追加 */\n"
      + "static int add_student(struct Student *list, int count, const char *name, int score) {\n"
      + "    if (count >= MAX_STUDENTS) {\n"
      + "        printf(\"List is full.\\n\");\n"
      + "        return count;\n"
      + "    }\n"
      + "    if (score < 0 || score > 100) {\n"
      + "        printf(\"Bad score: %d\\n\", score);\n"
      + "        return count;\n"
      + "    }\n"
      + "    copy_text(list[count].name, NAME_LEN, name);\n"
      + "    list[count].score = score;\n"
      + "    printf(\"Added: %s (%d)\\n\", list[count].name, list[count].score);\n"
      + "    return count + 1;\n"
      + "}\n"
      + "\n"
      + "static void print_students(const struct Student *list, int count) {\n"
      + "    int i;\n"
      + "\n"
      + "    printf(\"-- students (%d) --\\n\", count);\n"
      + "    for (i = 0; i < count; i++) {\n"
      + "        printf(\"%s %d\\n\", list[i].name, list[i].score);\n"
      + "    }\n"
      + "}\n"
      + "\n"
      + "/* 统计：总分、平均分、最高分与最低分（并列时取先出现的那位） */\n"
      + "static void print_stats(const struct Student *list, int count) {\n"
      + "    int sum = 0;\n"
      + "    int best = 0;\n"
      + "    int worst = 0;\n"
      + "    int i;\n"
      + "\n"
      + "    if (count == 0) {\n"
      + "        printf(\"No students yet.\\n\");\n"
      + "        return;\n"
      + "    }\n"
      + "    for (i = 0; i < count; i++) {\n"
      + "        sum += list[i].score;\n"
      + "        if (list[i].score > list[best].score) {\n"
      + "            best = i;\n"
      + "        }\n"
      + "        if (list[i].score < list[worst].score) {\n"
      + "            worst = i;\n"
      + "        }\n"
      + "    }\n"
      + "    printf(\"count = %d, average = %.1f, max = %d (%s), min = %d (%s)\\n\",\n"
      + "           count, (double)sum / count,\n"
      + "           list[best].score, list[best].name,\n"
      + "           list[worst].score, list[worst].name);\n"
      + "}\n"
      + "\n"
      + "/* 插入排序：分数高的在前；分数相同时保持原来的先后（稳定） */\n"
      + "static void sort_by_score(struct Student *list, int count) {\n"
      + "    int i;\n"
      + "\n"
      + "    for (i = 1; i < count; i++) {\n"
      + "        struct Student key = list[i];\n"
      + "        int j = i - 1;\n"
      + "\n"
      + "        while (j >= 0 && list[j].score < key.score) {\n"
      + "            list[j + 1] = list[j];\n"
      + "            j--;\n"
      + "        }\n"
      + "        list[j + 1] = key;\n"
      + "    }\n"
      + "    printf(\"-- sorted by score (desc) --\\n\");\n"
      + "    for (i = 0; i < count; i++) {\n"
      + "        printf(\"%s %d\\n\", list[i].name, list[i].score);\n"
      + "    }\n"
      + "}\n"
      + "\n"
      + "static void save_students(const struct Student *list, int count) {\n"
      + "    FILE *fp = fopen(FILE_NAME, \"w\");\n"
      + "    int i;\n"
      + "\n"
      + "    if (fp == NULL) {\n"
      + "        printf(\"Cannot write %s\\n\", FILE_NAME);\n"
      + "        return;\n"
      + "    }\n"
      + "    for (i = 0; i < count; i++) {\n"
      + "        fprintf(fp, \"%s %d\\n\", list[i].name, list[i].score);\n"
      + "    }\n"
      + "    fclose(fp);\n"
      + "    printf(\"Saved %d student(s) to %s\\n\", count, FILE_NAME);\n"
      + "}\n"
      + "\n"
      + "static int load_students(struct Student *list, int max) {\n"
      + "    FILE *fp = fopen(FILE_NAME, \"r\");\n"
      + "    int count = 0;\n"
      + "\n"
      + "    if (fp == NULL) {\n"
      + "        printf(\"Cannot read %s\\n\", FILE_NAME);\n"
      + "        return 0;\n"
      + "    }\n"
      + "    while (count < max && fscanf(fp, \"%15s %d\", list[count].name, &list[count].score) == 2) {\n"
      + "        count++;\n"
      + "    }\n"
      + "    fclose(fp);\n"
      + "    printf(\"Loaded %d student(s) from %s\\n\", count, FILE_NAME);\n"
      + "    return count;\n"
      + "}\n"
      + "\n"
      + "int main(void) {\n"
      + "    struct Student list[MAX_STUDENTS];\n"
      + "    int count = 0;\n"
      + "    int command = -1;\n"
      + "\n"
      + "    remove(FILE_NAME); /* 清掉上次运行留下的文件，保证演示可复现 */\n"
      + "\n"
      + "    printf(\"Commands: 1=add 2=list 3=stats 4=sort 5=save 6=load 0=quit\\n\");\n"
      + "    while (scanf(\"%d\", &command) == 1 && command != 0) {\n"
      + "        if (command == 1) {\n"
      + "            char name[NAME_LEN] = {0};\n"
      + "            int score = 0;\n"
      + "\n"
      + "            if (scanf(\"%15s %d\", name, &score) != 2) {\n"
      + "                printf(\"Bad input: expected <name> <score>\\n\");\n"
      + "                break;\n"
      + "            }\n"
      + "            count = add_student(list, count, name, score);\n"
      + "        } else if (command == 2) {\n"
      + "            print_students(list, count);\n"
      + "        } else if (command == 3) {\n"
      + "            print_stats(list, count);\n"
      + "        } else if (command == 4) {\n"
      + "            sort_by_score(list, count);\n"
      + "        } else if (command == 5) {\n"
      + "            save_students(list, count);\n"
      + "        } else if (command == 6) {\n"
      + "            count = load_students(list, MAX_STUDENTS);\n"
      + "        } else {\n"
      + "            printf(\"Unknown command: %d\\n\", command);\n"
      + "        }\n"
      + "    }\n"
      + "    remove(FILE_NAME); /* 演示结束，删掉临时文件 */\n"
      + "    printf(\"Bye.\\n\");\n"
      + "    return 0;\n"
      + "}",
      mastery: [
        "能独立设计并实现一个多函数、带持久化的完整 C 程序（录入、统计、排序、存盘、读回）",
        "能为每条异常路径定义明确行为：空数据、越界输入、容量上限、文件打开失败",
        "能写出稳定排序，并说明「相等时保持原序」是怎么做到的",
        "能用「结构体数组 + 条数」表达一组记录，并把数组与长度成对传递",
        "能让文本文件的读写格式保持对称，且每个缓冲区都有限长保护",
        "能读懂陌生项目的三层结构：数据定义、操作函数、命令界面"
      ]
    }
  ]
});
