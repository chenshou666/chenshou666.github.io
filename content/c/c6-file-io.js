/* ============================================================================
 * HT Lab · C 语言课程 · 模块 6 · 文件与输入输出
 * 关卡 id：51–56
 * 每关示例代码与标准答案都必须真实编译运行通过，output 字段为真实输出。
 * 文件类示例统一用相对文件名、结束时 remove() 清理，输出只含统计结果。
 * ==========================================================================*/
window.C_MODULES = window.C_MODULES || [];
window.C_MODULES.push({
  id: "c6",
  name: "模块 6 · 文件与输入输出",
  levels: [
    {
      id: 51,
      title: "文件基础：FILE*、fopen 模式与 fclose",
      minutes: 14,
      gist: "用 fopen 打开文件、用 fclose 关掉它，分清 r / w / a 三种模式，并养成检查 fopen 返回值的习惯。",
      lesson: "程序里的变量都住在内存里，程序一结束就没了。要把数据留住，就得写进文件：文件是磁盘上一段有名字、断电也还在的数据。\n"
        + "C 标准库不让你直接碰磁盘，而是给你一个中间人——文件流（stream）。你拿到的是 FILE *（文件指针），它代表「一个已经打开、可以读写的文件」。你在代码里只跟这个指针打交道，具体的缓冲区、扇区、编码都由标准库和操作系统负责。\n"
        + "打开用 fopen(文件名, 模式)。文件名写成相对路径时，指的是「程序运行时的当前工作目录」，不是你的 .c 文件所在目录——这是新手第一个大坑：在 IDE 里点运行能打开文件，直接双击 exe 就失败，因为两者的工作目录不同。\n"
        + "三种最常用的模式：\"r\" 只读，文件必须已经存在，否则失败；\"w\" 只写，文件不存在就新建，存在就先把内容清空（不是接着写！）；\"a\" 追加，文件不存在就新建，存在就把新内容写到末尾，原有内容保留。另外还有带 + 的读写模式（\"r+\"、\"w+\"、\"a+\"）和带 b 的二进制模式（\"rb\"、\"wb\"），后面的关卡会用到。\n"
        + "fopen 失败时返回 NULL：用 \"r\" 打开一个不存在的文件、目录不存在、没有权限、文件被别的程序独占……都会失败。所以每个 fopen 后面都必须紧跟一次检查：if (fp == NULL) { … }。不检查就直接拿 fp 去用，程序往往当场崩溃（访问了空指针），而且崩溃现场离真正的原因很远，非常难查。\n"
        + "用完要 fclose(fp)。它做两件事：把缓冲区里还没落盘的数据刷到磁盘；把这个流占用的资源还给系统。程序正常结束时系统会替你关闭所有流，但中途崩溃或断电就不会——没 fclose 的数据可能丢。同时打开的文件数也有上限，在循环里忘记关闭会很快耗尽句柄。\n"
        + "删除文件用 remove(\"文件名\")，成功返回 0、失败返回非 0。本关的示例和练习都用它来清理运行时产生的临时文件，这样程序反复运行也不会在目录里留下垃圾。\n"
        + "读别人的代码时，看到 fopen 就顺着问三个问题：模式选对了吗？返回值检查了吗？每条路径都 fclose 了吗？这三问能筛掉文件代码里绝大多数的低级问题。",
      example: {
        code: "#include <stdio.h>\n\n"
          + "int main(void) {\n"
          + "    FILE *fp;\n"
          + "    int ch;\n"
          + "    int lines = 0;\n"
          + "\n"
          + "    /* 第一步：用 \"w\" 打开，写入两行 */\n"
          + "    fp = fopen(\"notes.txt\", \"w\");\n"
          + "    if (fp == NULL) {\n"
          + "        printf(\"cannot open notes.txt for writing\\n\");\n"
          + "        return 1;\n"
          + "    }\n"
          + "    fprintf(fp, \"alpha\\n\");\n"
          + "    fprintf(fp, \"beta\\n\");\n"
          + "    fclose(fp);\n"
          + "\n"
          + "    /* 第二步：用 \"a\" 打开，在末尾追加一行 */\n"
          + "    fp = fopen(\"notes.txt\", \"a\");\n"
          + "    if (fp == NULL) {\n"
          + "        printf(\"cannot open notes.txt for appending\\n\");\n"
          + "        return 1;\n"
          + "    }\n"
          + "    fprintf(fp, \"gamma\\n\");\n"
          + "    fclose(fp);\n"
          + "\n"
          + "    /* 第三步：用 \"r\" 打开，一个字符一个字符读到文件尾 */\n"
          + "    fp = fopen(\"notes.txt\", \"r\");\n"
          + "    if (fp == NULL) {\n"
          + "        printf(\"cannot open notes.txt for reading\\n\");\n"
          + "        return 1;\n"
          + "    }\n"
          + "    while ((ch = fgetc(fp)) != EOF) {\n"
          + "        if (ch == '\\n') {\n"
          + "            lines++;\n"
          + "        }\n"
          + "    }\n"
          + "    fclose(fp);\n"
          + "\n"
          + "    printf(\"lines after w + a = %d\\n\", lines);\n"
          + "\n"
          + "    remove(\"notes.txt\");\n"
          + "    return 0;\n"
          + "}",
        output: "lines after w + a = 3",
        explain: "这段程序把「打开—写—关闭」走了三遍，结构完全一样：fopen → 检查 NULL → 读写 → fclose。第一遍用 \"w\"，notes.txt 不存在就新建，fprintf 把 alpha、beta 两行写进去，fclose 把它们真正落到磁盘。第二遍用 \"a\"，gamma 被追加到已有两行的后面，原来的内容没有丢——把 \"a\" 换成 \"w\" 再运行一次，你就会看到文件只剩一行，这正是本关最要紧的区别。"
          + "第三遍用 \"r\" 读回来：fgetc 一次读一个字符，读到文件尾返回 EOF。注意 ch 声明成了 int 而不是 char：EOF 是负整数（-1），只有 int 才装得下它，用 char 接会让循环永远不结束。每读到一个 '\\n' 说明读完了一行，最后数出 3 行。"
          + "末尾的 remove(\"notes.txt\") 把示例产生的临时文件删掉，这样反复运行不会在目录里堆垃圾。"
      },
      pitfalls: [
        "用 \"w\" 打开一个已有内容的文件，以为是在后面接着写——旧内容会被全部清空。想追加必须用 \"a\"。",
        "不检查 fopen 的返回值：文件不存在时 fp 是 NULL，紧接着的 fprintf(fp, …) 会直接崩溃（访问冲突），而错误现场离真正的原因很远。",
        "路径想当然：fopen(\"data.txt\", \"r\") 找的是「当前工作目录」下的 data.txt。IDE 里的工作目录常常是项目目录，直接双击 exe 时却是 exe 所在目录，于是同一个程序表现不一致。",
        "忘记 fclose：短程序看不出问题，一旦在循环里反复打开文件，很快会因为句柄耗尽而失败；程序崩溃退出时，缓冲区里的数据也会丢。",
        "用 char 变量接 fgetc 的返回值：EOF（-1）装不下，循环条件永远成立，程序卡死或无限输出。必须写成 int ch; while ((ch = fgetc(fp)) != EOF)。"
      ],
      takeaways: [
        "fopen 返回 FILE *，失败返回 NULL，每次打开都要检查",
        "\"r\" 只读且文件必须存在，\"w\" 会清空已有内容，\"a\" 追加到末尾",
        "fclose 把缓冲数据刷到磁盘，并释放文件流",
        "相对路径是相对「当前工作目录」，不是源码目录",
        "读到 EOF 要用 int 变量接 fgetc 的返回值"
      ],
      questions: [
        {
          q: "关于 fopen 的模式，下面说法正确的是？",
          options: [
            "用 \"w\" 打开已有文件时，原内容会保留，新内容写在最后",
            "用 \"a\" 打开已有文件时，原内容会保留，新内容写在最后",
            "用 \"r\" 打开不存在的文件时，会自动创建它",
            "\"w\" 只能用于新建文件，已存在的文件打不开"
          ],
          answer: 1,
          explain: "a 是 append，打开时把位置放到末尾，原内容保留，所以 B 对。A 描述的是 a 的行为，w 会先把文件清空。C 错：r 是只读，文件不存在时 fopen 返回 NULL，不会创建。D 也错：w 既能新建也能打开已存在的文件，只是会清空它。"
        },
        {
          q: "执行 fp = fopen(\"data.txt\", \"r\"); 时 data.txt 不存在，fp 的值是？",
          options: [
            "NULL",
            "EOF",
            "一个指向空文件的 FILE 指针",
            "保持上一次 fopen 留下的值"
          ],
          answer: 0,
          explain: "fopen 失败统一返回空指针 NULL，这正是必须写 if (fp == NULL) 的原因。EOF 是读取函数在文件尾返回的整数 -1，不是指针（B 错）；标准库不会给你一个「空文件」的流（C 错）；每次调用都会把结果赋给 fp，与上一次无关（D 错）。"
        },
        {
          q: "程序里写 fopen(\"data.txt\", \"r\")，它会去找哪个 data.txt？",
          options: [
            "源代码 .c 文件所在目录下的 data.txt",
            "一定是 C:\\ 根目录下的 data.txt",
            "由 PATH 环境变量决定的目录下的 data.txt",
            "程序运行时「当前工作目录」下的 data.txt"
          ],
          answer: 3,
          explain: "相对路径一律相对于进程的当前工作目录，而不是源码目录——这正是「IDE 里能跑、双击 exe 就失败」的常见原因。PATH 只决定去哪里找可执行程序，不参与普通文件路径的解析（C 错）；C:\\ 根目录只在你写绝对路径时才会用到（B 错）。"
        }
      ],
      passRatio: 0.8,
      mission: "写一个程序，在 main 里完成下面四步，文件名用 log.txt：\n"
        + "1) 用 fopen(\"log.txt\", \"w\") 打开并检查返回值：为 NULL 就输出 open failed 并 return 1；否则用 fprintf 写入两行 boot 和 ready（每行以 \\n 结尾），再 fclose；\n"
        + "2) 用 \"a\" 再打开一次，追加一行 done，fclose；\n"
        + "3) 用 \"r\" 打开，声明 int ch，用 while ((ch = fgetc(fp)) != EOF) 一个字符一个字符读完：每读到一个字符 chars 加一，每读到一个 '\\n' 则 lines 加一，然后 fclose；\n"
        + "4) 依次输出 lines = 3 和 chars = 16，最后用 remove(\"log.txt\") 删除文件。",
      starter: "#include <stdio.h>\n\n"
        + "int main(void) {\n"
        + "    FILE *fp;\n"
        + "    int ch;\n"
        + "    int lines = 0;\n"
        + "    int chars = 0;\n"
        + "\n"
        + "    /* 1. 用 \"w\" 写入 boot、ready 两行（每步都别忘 if (fp == NULL)） */\n"
        + "\n"
        + "    /* 2. 用 \"a\" 追加 done */\n"
        + "\n"
        + "    /* 3. 用 \"r\" 读回来，统计 lines 和 chars */\n"
        + "\n"
        + "    printf(\"lines = %d\\n\", lines);\n"
        + "    printf(\"chars = %d\\n\", chars);\n"
        + "    remove(\"log.txt\");\n"
        + "    return 0;\n"
        + "}",
      hint: "三段的结构完全一样：fopen → 检查 NULL → 写或读 → fclose。第三段要注意两点：用 int ch 接 fgetc 的返回值（EOF 是 -1），以及 chars 统计的是全部字符数，包括每行末尾的换行符——三个单词 4+5+4 个字母，加上 3 个换行正好 16。",
      check: {
        include: ["stdio.h"],
        return0: true,
        require: { file: true, if: true, while: true },
        calls: [["fopen"], ["fclose"], ["fprintf"], ["fgetc"], ["remove"], ["printf", "lines = "], ["printf", "chars = "]],
        minStatements: 8,
        message: "需要 #include <stdio.h>、int main(void) 和 return 0;，并且在 main 里用上 fopen、fclose、fprintf、fgetc、remove，还要用 while 读完整个文件，最后 printf 输出 lines = … 和 chars = …。",
        ok: "打开、写入、追加、读回、清理五件事都做到了，结构完整。"
      },
      solution: "#include <stdio.h>\n\n"
        + "int main(void) {\n"
        + "    FILE *fp;\n"
        + "    int ch;\n"
        + "    int lines = 0;\n"
        + "    int chars = 0;\n"
        + "\n"
        + "    /* 1. 用 \"w\" 打开，写入两行 */\n"
        + "    fp = fopen(\"log.txt\", \"w\");\n"
        + "    if (fp == NULL) {\n"
        + "        printf(\"open for writing failed\\n\");\n"
        + "        return 1;\n"
        + "    }\n"
        + "    fprintf(fp, \"boot\\n\");\n"
        + "    fprintf(fp, \"ready\\n\");\n"
        + "    fclose(fp);\n"
        + "\n"
        + "    /* 2. 用 \"a\" 打开，追加一行 */\n"
        + "    fp = fopen(\"log.txt\", \"a\");\n"
        + "    if (fp == NULL) {\n"
        + "        printf(\"open for appending failed\\n\");\n"
        + "        return 1;\n"
        + "    }\n"
        + "    fprintf(fp, \"done\\n\");\n"
        + "    fclose(fp);\n"
        + "\n"
        + "    /* 3. 用 \"r\" 打开，一个字符一个字符读到文件尾 */\n"
        + "    fp = fopen(\"log.txt\", \"r\");\n"
        + "    if (fp == NULL) {\n"
        + "        printf(\"open for reading failed\\n\");\n"
        + "        return 1;\n"
        + "    }\n"
        + "    while ((ch = fgetc(fp)) != EOF) {\n"
        + "        chars++;\n"
        + "        if (ch == '\\n') {\n"
        + "            lines++;\n"
        + "        }\n"
        + "    }\n"
        + "    fclose(fp);\n"
        + "\n"
        + "    printf(\"lines = %d\\n\", lines);\n"
        + "    printf(\"chars = %d\\n\", chars);\n"
        + "\n"
        + "    remove(\"log.txt\");\n"
        + "    return 0;\n"
        + "}",
      mastery: [
        "能独立写出「打开—检查—读写—关闭」的文件操作骨架",
        "能说清 \"r\"、\"w\"、\"a\" 三种模式的差别，并选对模式",
        "看到别人代码里的 fopen 会主动检查返回值与 fclose"
      ]
    },
    {
      id: 52,
      title: "文本文件读写：fprintf、fscanf 与 fgets",
      minutes: 16,
      gist: "用 fprintf 把数据写成一行一条的文本，用 fscanf 按字段读、用 fgets 按行读，并分清两者的适用场景。",
      lesson: "文本文件就是人能直接读懂的字符序列：你写进去的 \"Ada 91\\n\" 就是 7 个字节，记事本能打开、能改、能发给别人。它的代价是占空间、读的时候还要做一次格式解析。\n"
        + "写文本用 fprintf(fp, 格式串, …)：格式串和 printf 完全一样，只是第一个参数是文件流。\n"
        + "读文本有两件武器，先分清它们按什么单位读。\n"
        + "fscanf(fp, \"%31s %d\", name, &score) 按「字段」读：它会先跳过空白（空格、制表、换行都算），再按格式符转换。返回值是成功赋值的个数，所以最可靠的循环条件是 while (fscanf(fp, \"%31s %d\", name, &score) == 2)。注意 %s 必须写宽度，%31s 表示最多读 31 个字符，给结尾的 '\\0' 留一个位置；不写宽度遇到超长输入就会写爆缓冲区，这一点 scanf 和 fscanf 一样。\n"
        + "fgets(line, sizeof line, fp) 按「行」读：最多读 size-1 个字符，遇到换行或文件尾就停；行尾的 '\\n' 会被保留在缓冲区里，后面自动补一个 '\\0'。读到文件尾或出错返回 NULL。它是 gets 的正规替代品（gets 无法限制长度，已经在 C11 里被删除）。\n"
        + "怎么选：数据是固定字段排列的（数字表、配置项），fscanf 更省事；要按行处理、要保留原始行文本（日志、CSV），用 fgets 读整行、必要时再用 sscanf 拆字段。\n"
        + "一个高频陷阱：不要在同一次读取里混用 fscanf 和 fgets。fscanf(\"%d\") 读走数字后，那一行末尾的换行符还留在流里，紧接着的 fgets 只会读到这个换行符，得到一个空行。要么统一用 fscanf，要么统一用 fgets。\n"
        + "最后，判断「读完了没有」永远看读取函数的返回值，不要写 while (!feof(fp))——feof 只在读到文件尾之后才变真，用它当条件会让循环多跑一圈，下一关我们会把这一圈多出来的东西打印出来看。",
      example: {
        code: "#include <stdio.h>\n"
          + "#include <string.h>\n"
          + "\n"
          + "int main(void) {\n"
          + "    FILE *fp;\n"
          + "    char name[32];\n"
          + "    char line[80];\n"
          + "    int score;\n"
          + "    int count = 0;\n"
          + "    int sum = 0;\n"
          + "    int longest = 0;\n"
          + "\n"
          + "    /* 用 fprintf 写三条记录，每行一条：名字 分数 */\n"
          + "    fp = fopen(\"scores.txt\", \"w\");\n"
          + "    if (fp == NULL) {\n"
          + "        printf(\"cannot create scores.txt\\n\");\n"
          + "        return 1;\n"
          + "    }\n"
          + "    fprintf(fp, \"Ada 91\\n\");\n"
          + "    fprintf(fp, \"Bob 78\\n\");\n"
          + "    fprintf(fp, \"Cy 85\\n\");\n"
          + "    fclose(fp);\n"
          + "\n"
          + "    /* 用 fscanf 按字段读：返回值是成功赋值的个数，等于 2 才算一条完整记录 */\n"
          + "    fp = fopen(\"scores.txt\", \"r\");\n"
          + "    if (fp == NULL) {\n"
          + "        printf(\"cannot read scores.txt\\n\");\n"
          + "        return 1;\n"
          + "    }\n"
          + "    while (fscanf(fp, \"%31s %d\", name, &score) == 2) {\n"
          + "        count++;\n"
          + "        sum += score;\n"
          + "    }\n"
          + "    fclose(fp);\n"
          + "    printf(\"fields read = %d\\n\", count);\n"
          + "    printf(\"score total = %d\\n\", sum);\n"
          + "\n"
          + "    /* 用 fgets 按行读：一次一行，行尾的换行符也会读进来 */\n"
          + "    fp = fopen(\"scores.txt\", \"r\");\n"
          + "    if (fp == NULL) {\n"
          + "        printf(\"cannot read scores.txt\\n\");\n"
          + "        return 1;\n"
          + "    }\n"
          + "    count = 0;\n"
          + "    while (fgets(line, sizeof line, fp) != NULL) {\n"
          + "        int len = (int)strlen(line);\n"
          + "        count++;\n"
          + "        if (len > longest) {\n"
          + "            longest = len;\n"
          + "        }\n"
          + "    }\n"
          + "    fclose(fp);\n"
          + "    printf(\"lines read = %d\\n\", count);\n"
          + "    printf(\"longest line = %d\\n\", longest);\n"
          + "\n"
          + "    remove(\"scores.txt\");\n"
          + "    return 0;\n"
          + "}",
        output: "fields read = 3\nscore total = 254\nlines read = 3\nlongest line = 7",
        explain: "前半段用 fprintf 写文件：每条记录一行，字段之间用空格分开，行尾写 \\n，这样记事本能看、程序也好解析。"
          + "中间用 fscanf 读回来：%31s 读名字（显式限长 31，缓冲区 32 刚好装得下结尾的 '\\0'），%d 读分数，循环条件是返回值 == 2——两个字段都拿到才继续，读完时 fscanf 返回 EOF 或 1，循环自然结束，累计出 3 条记录、总分 254。"
          + "后半段换 fgets 按行读：sizeof line 保证了不会写越界，读不到就返回 NULL。因为 fgets 保留行尾的 '\\n'，strlen(\"Ada 91\\n\") 得到的是 7 而不是 6——这就是输出里 longest line = 7 的来历，也提醒你按行比较字符串时常常要自己去掉换行符。"
          + "最后 remove 删除临时文件，保证反复运行的结果一致。"
      },
      pitfalls: [
        "fscanf 的 %s 不写宽度：输入里出现超过缓冲区的名字就会越界写内存，程序可能不报错，但数据已经被破坏。",
        "用 while (!feof(fp)) 控制循环：循环体会多执行一次，最后一条数据被处理两遍（下一关会亲眼看到这个现象）。",
        "混用 fscanf 和 fgets：fscanf(\"%d\") 之后流里还留着换行符，紧接着的 fgets 读到一个只含 '\\n' 的空行。",
        "以为 fgets 会自动去掉换行：它保留 '\\n'，所以按行比较或拼接字符串时经常要多处理一个字符。",
        "把 fopen 的 \"w\" 用在只需要读的地方：一次误用就会把原来的数据清空。"
      ],
      takeaways: [
        "fprintf 的用法与 printf 相同，只是多了文件流参数",
        "fscanf 按字段读，返回成功赋值的个数；%s 一定要写宽度",
        "fgets 按行读，保留行尾的 '\\n'，读不到返回 NULL，是 gets 的替代品",
        "不要在同一次读取里混用 fscanf 和 fgets"
      ],
      questions: [
        {
          q: "用 fscanf 从文件里读数据时，怎么判断「数据读完了」？",
          options: [
            "用 while (!feof(fp)) 作为循环条件",
            "检查 ftell(fp) 是否等于文件大小",
            "看 fscanf 的返回值是否等于本次要读的字段个数",
            "看 fscanf 有没有返回 EOF 以外的值"
          ],
          answer: 2,
          explain: "fscanf 返回成功赋值的字段个数：要读 2 个字段就写 == 2，读 1 个就写 == 1，这是最可靠的判断。A 是著名的错误写法：feof 是「上一次读撞到文件尾」的事后报告，循环会多跑一圈。B 在读到一半时位置本来就在变，文本模式下更对不上。D 不够：只读到了 1 个字段时它并不返回 EOF，你仍会当成成功。"
        },
        {
          q: "fgets(line, sizeof line, fp) 读入一行之后，line 里的内容有什么特点？",
          options: [
            "一定不含换行符，fgets 会把它去掉",
            "保留行尾的换行符 '\\n'，并在末尾自动补 '\\0'",
            "不含结尾的 '\\0'，需要自己补上",
            "会连下一行的开头一起读进来"
          ],
          answer: 1,
          explain: "fgets 把 '\\n' 一起读进缓冲区并保留，然后在后面补 '\\0'；只有一行字符数超过 size-1 时才会读不到 '\\n'（被截断）。A 错，它不去换行；C 错，补 '\\0' 正是 fgets 的职责；D 错，它遇到换行就停，不会多读下一行。"
        },
        {
          q: "在同一个文件流上先执行 fscanf(fp, \"%d\", &n)，紧接着执行 fgets(line, sizeof line, fp)，fgets 会读到什么？",
          options: [
            "一个只含换行符的空行——数字后面的那个换行还留在流里",
            "出错，fscanf 和 fgets 不能在同一个流上混用",
            "下一行的完整内容，fscanf 会自动跳到下一行开头",
            "文件末尾的内容，因为 fscanf 已经把文件读完了"
          ],
          answer: 0,
          explain: "fscanf 的数字转换会跳过前导空白，但把数字后面的换行符留在流里，所以紧接着的 fgets 只读到 '\\n'，得到一个「空行」。语法上两者可以混用（B 错），但必须自己处理残留的换行；更省事的做法是统一用 fgets 读行、再用 sscanf 拆字段。"
        }
      ],
      passRatio: 0.8,
      mission: "写一个程序，把三条学生成绩记录写进 students.txt 再读回来统计：\n"
        + "1) 数据是 Ada 91、Bob 78、Cy 85；用 fopen(\"students.txt\", \"w\") 打开（检查 NULL），用 fprintf 以 \"%s %d\\n\" 一行写一条，然后 fclose；\n"
        + "2) 重新用 \"r\" 打开，用 while (fscanf(fp, \"%31s %d\", name, &score) == 2) 读回：记录条数 records、总分 total、最高分 max，然后 fclose；\n"
        + "3) 再用 \"r\" 打开一次，用 while (fgets(line, sizeof line, fp) != NULL) 数出行数 lines，然后 fclose；\n"
        + "4) 按顺序输出四行：records = 3、total = 254、max = 91、lines = 3；最后 remove(\"students.txt\")。\n"
        + "注意：%s 必须限长写成 %31s；不要用 while (!feof(fp))。",
      starter: "#include <stdio.h>\n\n"
        + "int main(void) {\n"
        + "    FILE *fp;\n"
        + "    char name[32];\n"
        + "    char line[80];\n"
        + "    int score;\n"
        + "    int records = 0;\n"
        + "    int total = 0;\n"
        + "    int max = 0;\n"
        + "    int lines = 0;\n"
        + "\n"
        + "    /* 1. 写文件：fprintf(fp, \"%s %d\\n\", ...) 三行 */\n"
        + "\n"
        + "    /* 2. fscanf 读回：while (fscanf(fp, \"%31s %d\", name, &score) == 2) */\n"
        + "\n"
        + "    /* 3. fgets 按行读回：while (fgets(line, sizeof line, fp) != NULL) */\n"
        + "\n"
        + "    printf(\"records = %d\\n\", records);\n"
        + "    printf(\"total = %d\\n\", total);\n"
        + "    printf(\"max = %d\\n\", max);\n"
        + "    printf(\"lines = %d\\n\", lines);\n"
        + "    remove(\"students.txt\");\n"
        + "    return 0;\n"
        + "}",
      hint: "三段各自独立：写、按字段读、按行读，每段都要走完 fopen → 检查 → 读/写 → fclose。统计总分和最高分放在按字段读的那一段里做；数行数只用来看「按行读到的行数」和「按字段读到的记录数」是否一致，不需要再做别的计算。max 的初值可以用 0，因为分数不会是负数（如果数据可能为负，就得用第一条数据初始化）。",
      check: {
        include: ["stdio.h"],
        return0: true,
        require: { file: true, if: true, while: true },
        calls: [["fopen"], ["fclose"], ["fprintf"], ["fscanf"], ["fgets"], ["remove"], ["printf", "records = "], ["printf", "total = "], ["printf", "max = "], ["printf", "lines = "]],
        forbid: ["gets"],
        minStatements: 10,
        message: "需要在 main 里用上 fopen、fclose、fprintf（写文件）、fscanf（按字段读）、fgets（按行读）和 remove，并用 while 循环读文件，最后 printf 输出 records = …、total = …、max = …、lines = … 四行。",
        ok: "文本文件的写、按字段读、按行读都到位了。"
      },
      solution: "#include <stdio.h>\n\n"
        + "int main(void) {\n"
        + "    FILE *fp;\n"
        + "    char name[32];\n"
        + "    char line[80];\n"
        + "    int score;\n"
        + "    int records = 0;\n"
        + "    int total = 0;\n"
        + "    int max = 0;\n"
        + "    int lines = 0;\n"
        + "\n"
        + "    /* 1. 用 fprintf 写入三条记录 */\n"
        + "    fp = fopen(\"students.txt\", \"w\");\n"
        + "    if (fp == NULL) {\n"
        + "        printf(\"cannot create students.txt\\n\");\n"
        + "        return 1;\n"
        + "    }\n"
        + "    fprintf(fp, \"Ada 91\\n\");\n"
        + "    fprintf(fp, \"Bob 78\\n\");\n"
        + "    fprintf(fp, \"Cy 85\\n\");\n"
        + "    fclose(fp);\n"
        + "\n"
        + "    /* 2. 用 fscanf 按字段读回，顺带求总分与最高分 */\n"
        + "    fp = fopen(\"students.txt\", \"r\");\n"
        + "    if (fp == NULL) {\n"
        + "        printf(\"cannot read students.txt\\n\");\n"
        + "        return 1;\n"
        + "    }\n"
        + "    while (fscanf(fp, \"%31s %d\", name, &score) == 2) {\n"
        + "        records++;\n"
        + "        total += score;\n"
        + "        if (score > max) {\n"
        + "            max = score;\n"
        + "        }\n"
        + "    }\n"
        + "    fclose(fp);\n"
        + "\n"
        + "    /* 3. 用 fgets 按行读回，行数应当与记录数一致 */\n"
        + "    fp = fopen(\"students.txt\", \"r\");\n"
        + "    if (fp == NULL) {\n"
        + "        printf(\"cannot read students.txt\\n\");\n"
        + "        return 1;\n"
        + "    }\n"
        + "    while (fgets(line, sizeof line, fp) != NULL) {\n"
        + "        lines++;\n"
        + "    }\n"
        + "    fclose(fp);\n"
        + "\n"
        + "    printf(\"records = %d\\n\", records);\n"
        + "    printf(\"total = %d\\n\", total);\n"
        + "    printf(\"max = %d\\n\", max);\n"
        + "    printf(\"lines = %d\\n\", lines);\n"
        + "\n"
        + "    remove(\"students.txt\");\n"
        + "    return 0;\n"
        + "}",
      mastery: [
        "能用 fprintf 写出「一行一条记录」的文本文件",
        "能用 fscanf 的返回值正确控制读取循环，并给 %s 加上宽度",
        "能用 fgets 按行读取并说清它与 fscanf 的区别"
      ]
    },
    {
      id: 53,
      title: "二进制文件：fwrite 与 fread 整块读写",
      minutes: 16,
      gist: "用 fwrite/fread 把结构体数组整块写进二进制文件再整块读回来，并搞清这种写法的三个可移植性坑。",
      lesson: "文本文件用肉眼看得懂，但存数字既费空间又难保精度（一个 double 要写成十几个字符）。二进制文件把内存里的字节原样倒进磁盘：一个 int 就是 4 个字节，不多不少。\n"
        + "在 Windows 上打开二进制文件必须用 \"rb\" / \"wb\"。不加 b 就是文本模式，写 '\\n' 时会被翻译成 \"\\r\\n\" 两个字节、读的时候再翻译回来——字节数和你以为的对不上，后面按偏移定位就全乱了。类 Unix 系统上两者没有区别，所以跨平台代码一律写 b 最省心。\n"
        + "fwrite(ptr, size, count, fp) 从 ptr 开始，写出 count 个「每个 size 字节」的元素；fread 反过来读。要特别记住：返回值是成功读写的元素个数，不是字节数。fwrite(arr, sizeof arr[0], 5, fp) 返回 5 表示五个元素都写成功了；想按字节数写就传 fwrite(buf, 1, n, fp)，那时两者相等。\n"
        + "整块读写结构体就靠这两个函数：fwrite(&p, sizeof p, 1, fp) 一次把整个结构体的字节写下去，fread(&p, sizeof p, 1, fp) 再把它还原成一个结构体。数组同理，把指针换成数组名、count 换成元素个数即可，简单又快。\n"
        + "但这种「把内存布局直接当文件格式」的做法有三个可移植性坑。第一是填充字节：为了对齐，编译器会在成员之间插入空隙，struct { char c; int n; } 在常见平台上占 8 字节而不是 5，多出来的 3 个字节内容不确定，会原样写进文件。第二是字节序：同一个 int，小端机器低位字节在前，大端机器反过来。第三是类型宽度：long 在 Windows 上是 4 字节，在 64 位 Linux 上是 8 字节。\n"
        + "结论：结构体直接写文件，适合「同一台机器、同一个程序」的内部数据（缓存、索引、存档）；要给别人读、要跨平台交换，就写成文本，或者按固定宽度类型（<stdint.h> 里的 int32_t 等）逐字段序列化。真实的文件格式还会在开头写一个魔数（magic）和版本号，方便以后判断「这个文件是不是我能读的」。",
      example: {
        code: "#include <stdio.h>\n"
          + "#include <string.h>\n"
          + "\n"
          + "/* 库存条目：id + 名字 + 数量 */\n"
          + "struct Item {\n"
          + "    int id;\n"
          + "    char name[12];\n"
          + "    int qty;\n"
          + "};\n"
          + "\n"
          + "/* 故意用来观察填充字节的结构体：1 个 char + 1 个 int */\n"
          + "struct Flagged {\n"
          + "    char code;\n"
          + "    int value;\n"
          + "};\n"
          + "\n"
          + "int main(void) {\n"
          + "    struct Item out[3];\n"
          + "    struct Item in[3];\n"
          + "    FILE *fp;\n"
          + "    int i;\n"
          + "    int n;\n"
          + "    int total = 0;\n"
          + "\n"
          + "    out[0].id = 1;\n"
          + "    strcpy(out[0].name, \"bolt\");\n"
          + "    out[0].qty = 10;\n"
          + "\n"
          + "    out[1].id = 2;\n"
          + "    strcpy(out[1].name, \"nut\");\n"
          + "    out[1].qty = 20;\n"
          + "\n"
          + "    out[2].id = 3;\n"
          + "    strcpy(out[2].name, \"washer\");\n"
          + "    out[2].qty = 3;\n"
          + "\n"
          + "    /* 二进制写：把整个数组的字节原样倒进文件 */\n"
          + "    fp = fopen(\"items.bin\", \"wb\");\n"
          + "    if (fp == NULL) {\n"
          + "        printf(\"cannot create items.bin\\n\");\n"
          + "        return 1;\n"
          + "    }\n"
          + "    n = (int)fwrite(out, sizeof(struct Item), 3, fp);\n"
          + "    fclose(fp);\n"
          + "    printf(\"written = %d\\n\", n);\n"
          + "\n"
          + "    /* 二进制读：返回值是真正读到的元素个数 */\n"
          + "    fp = fopen(\"items.bin\", \"rb\");\n"
          + "    if (fp == NULL) {\n"
          + "        printf(\"cannot read items.bin\\n\");\n"
          + "        return 1;\n"
          + "    }\n"
          + "    n = (int)fread(in, sizeof(struct Item), 3, fp);\n"
          + "    fclose(fp);\n"
          + "    printf(\"read = %d\\n\", n);\n"
          + "\n"
          + "    for (i = 0; i < n; i++) {\n"
          + "        total += in[i].qty;\n"
          + "    }\n"
          + "    printf(\"item size = %d\\n\", (int)sizeof(struct Item));\n"
          + "    printf(\"char+int size = %d\\n\", (int)sizeof(struct Flagged));\n"
          + "    printf(\"total qty = %d\\n\", total);\n"
          + "    printf(\"first name = %s\\n\", in[0].name);\n"
          + "\n"
          + "    remove(\"items.bin\");\n"
          + "    return 0;\n"
          + "}",
        output: "written = 3\nread = 3\nitem size = 20\nchar+int size = 8\ntotal qty = 33\nfirst name = bolt",
        explain: "Item 是 int + char[12] + int，成员自然对齐，正好 20 字节，中间没有空隙；Flagged 是 char + int，char 后面必须垫 3 个字节让 int 对齐到 4 的倍数，于是 1+3+4 = 8 字节——多出来的 3 字节就是填充，它的内容是不确定的。"
          + "程序先用 \"wb\" 打开，fwrite(out, sizeof(Item), 3, fp) 把整个数组的字节原样写出去，返回值 3 表示三个元素都写成功；再用 \"rb\" 打开、fread 读回同样的 3 个元素。"
          + "读回来之后直接按 in[i].qty 累加得到 33，in[0].name 也完好无损地打印出 bolt——说明这一趟「内存 → 文件 → 内存」完全没有损失。注意名字数组是用 strcpy 赋值的：char[12] 是数组，不能用 = \"bolt\" 直接赋值。"
          + "最后 remove(\"items.bin\")：二进制文件用记事本打开是乱码，这类临时产物用完就删。"
      },
      pitfalls: [
        "用 \"w\"/\"r\" 而不是 \"wb\"/\"rb\"：Windows 上会发生 \\n ↔ \\r\\n 的转换，每个换行多一个字节，按 fseek/ftell 算出来的位置和实际内容不符。",
        "把 fwrite 的返回值当成字节数：它返回的是元素个数；fwrite(buf, 1, 100, fp) 才正好等于字节数。",
        "读写用的元素大小不一致：写的时候是 fwrite(arr, sizeof(Item), 3, fp)，读的时候若写成 fread(arr, 1, 3, fp)，只会读到 3 个字节。",
        "以为 struct { char c; int n; } 占 5 字节：实际是 8 字节，多出来的填充字节也会被原样写进文件。",
        "把这种二进制文件拿到别的平台或别的编译器上读：对齐规则、字节序、类型宽度一变就全乱了；跨平台交换数据要用文本或固定宽度类型。"
      ],
      takeaways: [
        "二进制模式 \"rb\"/\"wb\" 不做换行转换，Windows 上必须写 b",
        "fwrite/fread 的返回值是元素个数，不是字节数",
        "结构体可以用 fwrite/fread 整块读写，文件里存的就是本机的内存布局",
        "填充字节、字节序、类型宽度让结构体文件不可跨平台"
      ],
      questions: [
        {
          q: "在 Windows 上用 fopen(\"data.bin\", \"wb\")，模式里的 b 表示什么？",
          options: [
            "让文件按块对齐，方便以后随机访问",
            "让数据按大端字节序写入",
            "对内容做简单加密，读的时候也要加 b 才能解开",
            "二进制模式：不做换行符转换，字节原样读写"
          ],
          answer: 3,
          explain: "b 就是 binary。不加 b 是文本模式，Windows 会把 '\\n' 写成 \"\\r\\n\"、读的时候再转回来，字节数就和你写的不一样了，偏移计算随之失效。b 与对齐（A 错）、字节序（B 错）、加密（C 错）都没有关系。类 Unix 上两者没有区别，但跨平台代码一律写 b 最稳妥。"
        },
        {
          q: "fwrite(arr, sizeof(struct Item), 5, fp) 的返回值表示什么？",
          options: [
            "写出的字节数，等于 sizeof(struct Item) * 5",
            "文件写完之后的当前大小",
            "成功写出的元素个数，最多是 5",
            "成功与否的标志：成功返回 0，失败返回 -1"
          ],
          answer: 2,
          explain: "fwrite/fread 的返回值单位是「元素个数」：这里每个元素 sizeof(struct Item) 字节，所以最多返回 5。想直接拿到字节数可以写 fwrite(buf, 1, n, fp)，那时返回值与字节数相等；也可以把返回值乘上 size，但别默认它本来就是字节数。"
        },
        {
          q: "关于「把结构体整块写进文件」的可移植性，下面说法正确的是？",
          options: [
            "完全可移植，任何平台读出来都一样",
            "成员之间可能有填充字节，加上字节序和类型宽度的差异，换平台或换编译器就可能读错",
            "只要写的时候用 fwrite、读的时候用 fread 就可移植",
            "只有含 double 的结构体有问题，全是 int 的结构体一定安全"
          ],
          answer: 1,
          explain: "文件里存的是本机的内存布局：填充字节内容不确定，字节序由 CPU 决定，long 之类的宽度各平台不同，所以它只适合「同一台机器、同一个程序」的内部数据文件。要跨平台交换就写文本，或按固定宽度类型逐字段序列化。A 错。C 错，fwrite/fread 只是读写手段，不改变布局差异。D 也错：全是 int 的结构体虽然没有填充，但字节序一变照样读错。"
        }
      ],
      passRatio: 0.8,
      mission: "写一个程序，用一个名为 Book 的结构体把三本书写进二进制文件再读回来：\n"
        + "1) 定义 struct Book { int id; char title[16]; int pages; };（tag 名必须是 Book）；\n"
        + "2) 用初始值列表准备三条数据：{1, \"C Primer\", 600}、{2, \"K&R\", 288}、{3, \"Modern C\", 400}；\n"
        + "3) 用 fopen(\"books.bin\", \"wb\") 打开（检查 NULL），用 fwrite(shelf, sizeof(struct Book), 3, fp) 整块写出，把返回值存下来并用它输出 books = 3，然后 fclose；\n"
        + "4) 用 \"rb\" 重新打开，用 fread 读回到另一个 struct Book 数组，并检查 fread 的返回值是不是 3；\n"
        + "5) 累加所有 pages 输出 total pages = 1288，再输出 first = C Primer（用读回来第一条的 title）；\n"
        + "6) 最后 remove(\"books.bin\") 删除文件。",
      starter: "#include <stdio.h>\n\n"
        + "struct Book {\n"
        + "    int id;\n"
        + "    char title[16];\n"
        + "    int pages;\n"
        + "};\n"
        + "\n"
        + "int main(void) {\n"
        + "    struct Book shelf[3] = {\n"
        + "        {1, \"C Primer\", 600},\n"
        + "        {2, \"K&R\", 288},\n"
        + "        {3, \"Modern C\", 400}\n"
        + "    };\n"
        + "    struct Book back[3];\n"
        + "    FILE *fp;\n"
        + "    int i;\n"
        + "    int written = 0;\n"
        + "    int got = 0;\n"
        + "    int total = 0;\n"
        + "\n"
        + "    /* 1. \"wb\" 打开 books.bin，整块写出：written = (int)fwrite(...) */\n"
        + "\n"
        + "    /* 2. \"rb\" 打开，整块读回：got = (int)fread(...)，并检查 got 是不是 3 */\n"
        + "\n"
        + "    /* 3. 累加 pages（用 for 循环遍历 back 数组） */\n"
        + "\n"
        + "    printf(\"books = %d\\n\", written);\n"
        + "    printf(\"total pages = %d\\n\", total);\n"
        + "    printf(\"first = %s\\n\", back[0].title);\n"
        + "    remove(\"books.bin\");\n"
        + "    return 0;\n"
        + "}",
      hint: "写和读用的是同一对参数：(数组名, sizeof(struct Book), 3, fp)。写得返回值 3 表示三条都写成功，读的返回值同样是元素个数。注意 \"wb\"/\"rb\" 里的 b，以及 back[0].title 是数组名，可以直接交给 %s（它会自动从首地址开始打印到 '\\0'）。",
      check: {
        include: ["stdio.h"],
        return0: true,
        require: { file: true, if: true, struct: "Book" },
        calls: [["fopen"], ["fclose"], ["fwrite"], ["fread"], ["remove"], ["printf", "books = "], ["printf", "total pages = "], ["printf", "first = "]],
        minStatements: 10,
        message: "需要定义 struct Book（tag 名必须是 Book），并在 main 里用上 fopen、fwrite（整块写）、fread（整块读）、fclose、remove，还要有 if 判断，最后 printf 输出 books = …、total pages = …、first = … 三行。",
        ok: "结构体的整块读写、返回值检查和统计都完成了。"
      },
      solution: "#include <stdio.h>\n\n"
        + "struct Book {\n"
        + "    int id;\n"
        + "    char title[16];\n"
        + "    int pages;\n"
        + "};\n"
        + "\n"
        + "int main(void) {\n"
        + "    struct Book shelf[3] = {\n"
        + "        {1, \"C Primer\", 600},\n"
        + "        {2, \"K&R\", 288},\n"
        + "        {3, \"Modern C\", 400}\n"
        + "    };\n"
        + "    struct Book back[3];\n"
        + "    FILE *fp;\n"
        + "    int i;\n"
        + "    int n;\n"
        + "    int total = 0;\n"
        + "\n"
        + "    /* 1. 整块写入二进制文件 */\n"
        + "    fp = fopen(\"books.bin\", \"wb\");\n"
        + "    if (fp == NULL) {\n"
        + "        printf(\"cannot create books.bin\\n\");\n"
        + "        return 1;\n"
        + "    }\n"
        + "    n = (int)fwrite(shelf, sizeof(struct Book), 3, fp);\n"
        + "    fclose(fp);\n"
        + "    printf(\"books = %d\\n\", n);\n"
        + "\n"
        + "    /* 2. 整块读回来，并检查 fread 的返回值 */\n"
        + "    fp = fopen(\"books.bin\", \"rb\");\n"
        + "    if (fp == NULL) {\n"
        + "        printf(\"cannot read books.bin\\n\");\n"
        + "        return 1;\n"
        + "    }\n"
        + "    n = (int)fread(back, sizeof(struct Book), 3, fp);\n"
        + "    fclose(fp);\n"
        + "    if (n != 3) {\n"
        + "        printf(\"read only %d books\\n\", n);\n"
        + "        remove(\"books.bin\");\n"
        + "        return 1;\n"
        + "    }\n"
        + "\n"
        + "    /* 3. 统计页数 */\n"
        + "    for (i = 0; i < n; i++) {\n"
        + "        total += back[i].pages;\n"
        + "    }\n"
        + "    printf(\"total pages = %d\\n\", total);\n"
        + "    printf(\"first = %s\\n\", back[0].title);\n"
        + "\n"
        + "    remove(\"books.bin\");\n"
        + "    return 0;\n"
        + "}",
      mastery: [
        "能用 fwrite/fread 整块读写结构体数组，并正确理解返回值的含义",
        "能说清二进制模式 b 的作用，以及结构体文件的三个可移植性问题",
        "能判断什么时候该用二进制文件、什么时候必须用文本"
      ]
    },
    {
      id: 54,
      title: "文件定位：fseek、ftell 与 rewind",
      minutes: 15,
      gist: "用 fseek/ftell 求出文件大小、跳过前面的记录直接读取指定位置的数据，理解「读写位置」这个概念。",
      lesson: "每个文件流内部都有一个「读写位置」（position indicator）：你可以把它想成编辑器里的光标，每次读或写之后它自动往后走。fopen 之后它在开头，读完整个文件后它停在末尾。\n"
        + "ftell(fp) 返回当前位置距离文件开头的字节偏移，类型是 long；出错时返回 -1L。\n"
        + "fseek(fp, offset, whence) 把位置挪到指定处。whence 有三个取值：SEEK_SET 从文件开头算起，SEEK_CUR 从当前位置算起，SEEK_END 从文件末尾算起（这时 offset 通常是负数）。成功返回 0，失败返回非 0——它也会失败（比如对管道、对不支持定位的设备），所以正式代码要检查返回值。\n"
        + "rewind(fp) 等价于 fseek(fp, 0, SEEK_SET)，另外还会清掉流的错误标志；它没有返回值。\n"
        + "第一个经典用法是求文件大小：fseek(fp, 0, SEEK_END); 然后再 size = ftell(fp);。注意顺序不能反，先移动位置、再问位置，得到的才是长度。\n"
        + "第二个经典用法是随机访问定长记录。如果每条记录长度固定，第 i 条记录（从 0 开始数）的起始偏移就是 i 乘上记录长度：fseek(fp, (long)i * sizeof(struct Rec), SEEK_SET); 然后 fread(&r, sizeof r, 1, fp);——不用从头读一遍就能直接跳到想要的那条。数据库的索引、游戏存档的分块读取，思路都来自这里。\n"
        + "两个注意点。第一，偏移的类型是 long：Windows 上 long 是 32 位，文件超过 2GB 就要换用编译器提供的 64 位版本（如 _fseeki64/_ftelli64），知道有这回事即可。第二，C 标准只保证二进制模式下可以按任意字节偏移定位；文本模式下 fseek 的 offset 只应该是 0 或之前 ftell 返回过的值，因为换行转换会让「字符数」和「字节数」对不上。",
      example: {
        code: "#include <stdio.h>\n"
          + "\n"
          + "/* 定长记录：一共 8 字节，正好可以按序号算偏移 */\n"
          + "struct Rec {\n"
          + "    int id;\n"
          + "    int score;\n"
          + "};\n"
          + "\n"
          + "int main(void) {\n"
          + "    struct Rec r;\n"
          + "    FILE *fp;\n"
          + "    long size;\n"
          + "    int i;\n"
          + "    int count;\n"
          + "\n"
          + "    fp = fopen(\"nums.bin\", \"wb\");\n"
          + "    if (fp == NULL) {\n"
          + "        printf(\"cannot create nums.bin\\n\");\n"
          + "        return 1;\n"
          + "    }\n"
          + "    for (i = 0; i < 5; i++) {\n"
          + "        r.id = i;\n"
          + "        r.score = (i + 1) * 10;\n"
          + "        fwrite(&r, sizeof r, 1, fp);\n"
          + "    }\n"
          + "    fclose(fp);\n"
          + "\n"
          + "    fp = fopen(\"nums.bin\", \"rb\");\n"
          + "    if (fp == NULL) {\n"
          + "        printf(\"cannot read nums.bin\\n\");\n"
          + "        return 1;\n"
          + "    }\n"
          + "\n"
          + "    /* 求文件大小：先跳到末尾，再问当前位置 */\n"
          + "    if (fseek(fp, 0, SEEK_END) != 0) {\n"
          + "        printf(\"seek to end failed\\n\");\n"
          + "        fclose(fp);\n"
          + "        return 1;\n"
          + "    }\n"
          + "    size = ftell(fp);\n"
          + "    count = (int)(size / (long)sizeof r);\n"
          + "    printf(\"file size = %ld bytes\\n\", size);\n"
          + "    printf(\"records = %d\\n\", count);\n"
          + "\n"
          + "    /* 随机访问：直接跳到第 4 条（下标 3） */\n"
          + "    if (fseek(fp, 3 * (long)sizeof r, SEEK_SET) != 0) {\n"
          + "        printf(\"seek failed\\n\");\n"
          + "        fclose(fp);\n"
          + "        return 1;\n"
          + "    }\n"
          + "    if (fread(&r, sizeof r, 1, fp) == 1) {\n"
          + "        printf(\"record 3: id = %d, score = %d\\n\", r.id, r.score);\n"
          + "    }\n"
          + "\n"
          + "    /* rewind 等于 fseek(fp, 0, SEEK_SET) */\n"
          + "    rewind(fp);\n"
          + "    if (fread(&r, sizeof r, 1, fp) == 1) {\n"
          + "        printf(\"after rewind: id = %d\\n\", r.id);\n"
          + "    }\n"
          + "    printf(\"end offset = %ld\\n\", ftell(fp));\n"
          + "\n"
          + "    fclose(fp);\n"
          + "    remove(\"nums.bin\");\n"
          + "    return 0;\n"
          + "}",
        output: "file size = 40 bytes\nrecords = 5\nrecord 3: id = 3, score = 40\nafter rewind: id = 0\nend offset = 8",
        explain: "程序先写 5 条定长记录（id 0 到 4，score 10 到 50），每条 sizeof(struct Rec) = 8 字节，文件一共 40 字节。"
          + "求大小时先 fseek(fp, 0, SEEK_END) 把位置移到末尾，再用 ftell 问出位置就是 40；把它除以 sizeof r 得到记录条数 5。"
          + "接着是随机访问的关键：fseek(fp, 3 * (long)sizeof r, SEEK_SET) 直接把位置定到偏移 24，fread 读出来的就是下标 3 的那条记录（id = 3、score = 40），前面三条根本没读。"
          + "rewind(fp) 把位置送回开头，读到的又是第一条 id = 0；此时 ftell 报告 end offset = 8，正好说明「读了一条 8 字节的记录，位置就自动前进了 8 字节」——位置是 fread 自己在推进，你只是在需要的时候手动挪它。",
      },
      pitfalls: [
        "fseek 之后不检查返回值：定位失败时后面的 fread 会从错误的位置读数据，输出看着「有点不对」却很难定位。",
        "把 fseek 的偏移写成记录序号：忘了乘 sizeof(记录)，跳到的位置永远在文件开头附近。",
        "求文件大小忘了先 fseek 到末尾，或者把 ftell 失败时的返回值 -1L 当成了文件大小。",
        "在文本模式下用自己算出来的偏移定位：换行转换让字节数和字符数不一致，标准不保证结果；精确按字节定位请用二进制模式。",
        "用 int 存 ftell 的返回值（应该是 long）；或者用 long 去装超过 2GB 文件的偏移。"
      ],
      takeaways: [
        "ftell 给出当前位置的字节偏移，fseek 把位置移到指定处",
        "SEEK_SET / SEEK_CUR / SEEK_END 分别从开头、当前位置、末尾起算",
        "文件大小 = 先 fseek 到 SEEK_END，再 ftell",
        "定长记录可以直接算出偏移，实现随机访问；rewind 回到开头"
      ],
      questions: [
        {
          q: "要得到文件的字节数，下面哪种写法是对的？",
          options: [
            "fseek(fp, 0, SEEK_END); 然后 size = ftell(fp);",
            "size = ftell(fp); 然后 fseek(fp, 0, SEEK_END);",
            "size = fseek(fp, 0, SEEK_END);",
            "size = fread(buf, 1, sizeof buf, fp);"
          ],
          answer: 0,
          explain: "先移到末尾、再问当前位置，得到的才是文件长度，所以 A 对。B 顺序反了，得到的是移动前的位置（通常是 0）。C 错：fseek 的返回值是成功与否的标志（0 或非 0），不是位置。D 错：fread 的返回值是读到的元素个数，受缓冲区大小限制，不是文件大小。"
        },
        {
          q: "记录长度固定为 sizeof(struct Rec)，要直接读取下标为 2 的那条记录，fseek 的偏移应该写多少？",
          options: [
            "2",
            "3",
            "sizeof(struct Rec)",
            "2 * (long)sizeof(struct Rec)"
          ],
          answer: 3,
          explain: "第 i 条记录的起始偏移是 i 乘记录长度，下标 2 就是 2 * sizeof(struct Rec)，所以 D 对。写 2 会定位到第 3 个字节而不是第 3 条记录（A 错）；写 sizeof(struct Rec) 是下标 1 的那条（C 错）；下标 2 和 3 不是一回事（B 错）。"
        },
        {
          q: "rewind(fp) 的作用是什么？",
          options: [
            "关闭文件再重新打开，相当于重新 fopen 一次",
            "清空文件内容，相当于用 \"w\" 重新打开",
            "把读写位置移回文件开头，相当于 fseek(fp, 0, SEEK_SET)",
            "让读写位置跳过当前这一行，指向下一行开头"
          ],
          answer: 2,
          explain: "rewind 只移动读写位置（并且清掉流的错误标志），不关闭文件也不清空内容，所以 A、B 都错。它不解析行，做不到「跳到下一行」——那要自己读到换行符为止（D 错）。"
        }
      ],
      passRatio: 0.8,
      mission: "写一个程序，用文件定位实现随机读取：\n"
        + "1) 定义 struct Rec { int id; int score; };（tag 名必须是 Rec）；\n"
        + "2) 用 \"wb\" 打开 data.bin（检查 NULL），用 for 循环写 4 条记录：id 从 0 到 3，score = (i + 1) * 7，每条用 fwrite(&r, sizeof r, 1, fp)，然后 fclose；\n"
        + "3) 用 \"rb\" 重新打开，先 fseek(fp, 0, SEEK_END) 再用 ftell 求出字节数，输出 size = 32；\n"
        + "4) 用 fseek(fp, 2 * (long)sizeof r, SEEK_SET) 跳到下标 2 的记录，fread 读出来，输出 record 2 score = 21；\n"
        + "5) 用 rewind(fp) 回到开头读第一条，输出 first id = 0；\n"
        + "6) fclose 之后用 remove(\"data.bin\") 删除文件。",
      starter: "#include <stdio.h>\n\n"
        + "struct Rec {\n"
        + "    int id;\n"
        + "    int score;\n"
        + "};\n"
        + "\n"
        + "int main(void) {\n"
        + "    struct Rec r;\n"
        + "    FILE *fp;\n"
        + "    long size = 0;\n"
        + "    int i;\n"
        + "\n"
        + "    /* 1. \"wb\" 打开 data.bin，写 4 条记录（score = (id + 1) * 7） */\n"
        + "\n"
        + "    /* 2. \"rb\" 打开，用 fseek(fp, 0, SEEK_END) + ftell 求出 size */\n"
        + "\n"
        + "    /* 3. fseek 到下标 2 读出来：printf(\"record 2 score = %d\\n\", r.score); */\n"
        + "\n"
        + "    /* 4. rewind 后读第一条：printf(\"first id = %d\\n\", r.id); */\n"
        + "\n"
        + "    printf(\"size = %ld\\n\", size);\n"
        + "    remove(\"data.bin\");\n"
        + "    return 0;\n"
        + "}",
      hint: "第 3 步的偏移一定是「下标 × 每条记录的字节数」，用 sizeof r 算，不要手写 8 或 16。写完记得按顺序输出三行：size 用 %ld（ftell 返回 long），两条记录的值用 %d。",
      check: {
        include: ["stdio.h"],
        return0: true,
        require: { file: true, if: true, struct: "Rec" },
        calls: [["fopen"], ["fclose"], ["fwrite"], ["fread"], ["fseek"], ["ftell"], ["rewind"], ["remove"], ["printf", "size = "], ["printf", "record 2 score = "], ["printf", "first id = "]],
        minStatements: 10,
        message: "需要定义 struct Rec（tag 名必须是 Rec），并在 main 里用上 fopen、fwrite、fread、fseek、ftell、rewind、fclose、remove，还要有 if 判断，最后 printf 输出 size = …、record 2 score = …、first id = … 三行。",
        ok: "文件的写入、按偏移定位和随机读取都做对了。"
      },
      solution: "#include <stdio.h>\n\n"
        + "struct Rec {\n"
        + "    int id;\n"
        + "    int score;\n"
        + "};\n"
        + "\n"
        + "int main(void) {\n"
        + "    struct Rec r;\n"
        + "    FILE *fp;\n"
        + "    long size;\n"
        + "    int i;\n"
        + "\n"
        + "    /* 1. 写入四条定长记录 */\n"
        + "    fp = fopen(\"data.bin\", \"wb\");\n"
        + "    if (fp == NULL) {\n"
        + "        printf(\"cannot create data.bin\\n\");\n"
        + "        return 1;\n"
        + "    }\n"
        + "    for (i = 0; i < 4; i++) {\n"
        + "        r.id = i;\n"
        + "        r.score = (i + 1) * 7;\n"
        + "        fwrite(&r, sizeof r, 1, fp);\n"
        + "    }\n"
        + "    fclose(fp);\n"
        + "\n"
        + "    /* 2. 求文件字节数 */\n"
        + "    fp = fopen(\"data.bin\", \"rb\");\n"
        + "    if (fp == NULL) {\n"
        + "        printf(\"cannot read data.bin\\n\");\n"
        + "        return 1;\n"
        + "    }\n"
        + "    if (fseek(fp, 0, SEEK_END) != 0) {\n"
        + "        printf(\"seek to end failed\\n\");\n"
        + "        fclose(fp);\n"
        + "        return 1;\n"
        + "    }\n"
        + "    size = ftell(fp);\n"
        + "    printf(\"size = %ld\\n\", size);\n"
        + "\n"
        + "    /* 3. 直接跳到第 3 条记录（下标 2） */\n"
        + "    if (fseek(fp, 2 * (long)sizeof r, SEEK_SET) != 0) {\n"
        + "        printf(\"seek failed\\n\");\n"
        + "        fclose(fp);\n"
        + "        return 1;\n"
        + "    }\n"
        + "    if (fread(&r, sizeof r, 1, fp) == 1) {\n"
        + "        printf(\"record 2 score = %d\\n\", r.score);\n"
        + "    }\n"
        + "\n"
        + "    /* 4. 回到开头读第一条 */\n"
        + "    rewind(fp);\n"
        + "    if (fread(&r, sizeof r, 1, fp) == 1) {\n"
        + "        printf(\"first id = %d\\n\", r.id);\n"
        + "    }\n"
        + "\n"
        + "    fclose(fp);\n"
        + "    remove(\"data.bin\");\n"
        + "    return 0;\n"
        + "}",
      mastery: [
        "能用 fseek + ftell 求出文件字节数",
        "能算出定长记录的偏移，用 fseek 直接定位到指定记录",
        "能说清 SEEK_SET / SEEK_CUR / SEEK_END 的区别，并知道文本模式定位的限制"
      ]
    },
    {
      id: 55,
      title: "错误处理：errno、perror 与 feof 的正确用法",
      minutes: 16,
      gist: "看返回值、看 errno、用 perror 说清失败原因，并用读取函数的返回值（而不是 feof）控制读取循环。",
      lesson: "文件操作是最容易失败的一类代码：路径写错、权限不够、磁盘满、文件被别的程序占用…… 这些都不是你程序的语法错误，而是运行环境的问题。程序必须能发现失败、说清原因、优雅退出。\n"
        + "C 标准库报错靠两套信号。第一套是返回值：fopen 失败返回 NULL，fclose 失败返回 EOF，fread/fwrite 的返回值小于请求的个数就说明没读完或没写完，fscanf 返回成功赋值的个数。第二套是全局变量 errno（要 #include <errno.h>）：函数失败时它记录一个错误码，比如 ENOENT（没有这个文件或目录）、EACCES（权限不足）、EEXIST（已经存在）。\n"
        + "errno 的关键细节：它只在失败时有意义，而且函数成功时不会替你清零。所以正确用法是先 errno = 0，再调用，然后看它是否变成非 0。\n"
        + "errno 只是个整数。想看清它，用 strerror(errno) 把它翻译成一句说明；或者直接用 perror(\"前缀\")，它会打印「前缀: 说明」。注意 perror 输出到标准错误流 stderr，不是 stdout——这样即使程序的标准输出被重定向到文件或管道，错误信息仍然能出现在控制台上。反过来说，只收集 stdout 的判题系统和脚本收不到它，这是设计如此，不是程序出错。\n"
        + "第二件事是循环怎么结束。feof(fp) 的含义是「上一次读操作撞到了文件尾」，它是事后报告，不是预告。所以下面这种写法是错的：while (!feof(fp)) { fgets(line, sizeof line, fp); 处理(line); }。文件读完时 feof 还是假，循环会再转一圈：fgets 返回 NULL、line 保持上一次的内容，而循环体照样「处理」了一遍——要么把最后一条数据重复处理，要么处理一份垃圾数据。\n"
        + "正确写法是拿读取函数的返回值当条件：while (fgets(line, sizeof line, fp) != NULL) 或 while (fscanf(fp, \"%d\", &n) == 1)。循环结束后仍然可以用 feof/ferror 区分「正常读到结尾」还是「读取出错」：feof 为真说明是正常读完，ferror 为真说明出错了，两者都不是则可能是被 break 打断。要清掉这些标志用 clearerr(fp)。",
      example: {
        code: "#include <stdio.h>\n"
          + "#include <errno.h>\n"
          + "#include <string.h>\n"
          + "\n"
          + "int main(void) {\n"
          + "    FILE *fp;\n"
          + "    char line[64];\n"
          + "    int lines = 0;\n"
          + "    int naive = 0;\n"
          + "\n"
          + "    /* 先准备一个三行的文件 */\n"
          + "    fp = fopen(\"config.txt\", \"w\");\n"
          + "    if (fp == NULL) {\n"
          + "        perror(\"config.txt\");\n"
          + "        return 1;\n"
          + "    }\n"
          + "    fprintf(fp, \"mode=fast\\n\");\n"
          + "    fprintf(fp, \"retry=3\\n\");\n"
          + "    fprintf(fp, \"log=on\\n\");\n"
          + "    fclose(fp);\n"
          + "\n"
          + "    /* 打开一个不存在的文件：返回值与 errno 两个信号 */\n"
          + "    errno = 0;\n"
          + "    fp = fopen(\"no_such_file.txt\", \"r\");\n"
          + "    if (fp == NULL) {\n"
          + "        printf(\"errno after failed open = %d\\n\", errno);\n"
          + "        printf(\"strerror(errno) = %s\\n\", strerror(errno));\n"
          + "        perror(\"no_such_file.txt\");\n"
          + "    } else {\n"
          + "        fclose(fp);\n"
          + "    }\n"
          + "\n"
          + "    /* 正确写法：拿读取函数的返回值当循环条件 */\n"
          + "    fp = fopen(\"config.txt\", \"r\");\n"
          + "    if (fp == NULL) {\n"
          + "        perror(\"config.txt\");\n"
          + "        return 1;\n"
          + "    }\n"
          + "    while (fgets(line, sizeof line, fp) != NULL) {\n"
          + "        lines++;\n"
          + "    }\n"
          + "    printf(\"correct loop = %d lines\\n\", lines);\n"
          + "    printf(\"feof after correct loop = %d\\n\", feof(fp) != 0);\n"
          + "    printf(\"ferror after correct loop = %d\\n\", ferror(fp) != 0);\n"
          + "    fclose(fp);\n"
          + "\n"
          + "    /* 错误写法（只作对照）：先问 feof 再读，一定会多转一圈 */\n"
          + "    fp = fopen(\"config.txt\", \"r\");\n"
          + "    if (fp == NULL) {\n"
          + "        perror(\"config.txt\");\n"
          + "        return 1;\n"
          + "    }\n"
          + "    while (!feof(fp)) {\n"
          + "        fgets(line, sizeof line, fp);\n"
          + "        naive++;\n"
          + "    }\n"
          + "    printf(\"feof-first loop counted %d times for %d lines\\n\", naive, lines);\n"
          + "    fclose(fp);\n"
          + "\n"
          + "    remove(\"config.txt\");\n"
          + "    return 0;\n"
          + "}",
        output: "errno after failed open = 2\nstrerror(errno) = No such file or directory\ncorrect loop = 3 lines\nfeof after correct loop = 1\nferror after correct loop = 0\nfeof-first loop counted 4 times for 3 lines",
        explain: "第一段把三行配置写进 config.txt，每一处失败都用 perror 报告原因。"
          + "第二段演示 errno：先把 errno 清零，再 fopen 一个不存在的文件；失败时打印 errno（本机上是 2，也就是 ENOENT），然后用 strerror 把它翻译成一句说明。紧接着的 perror(\"no_such_file.txt\") 也会打印「no_such_file.txt: No such file or directory」，但它是写到标准错误流 stderr 的，所以上面的运行结果里看不到它——在控制台运行你能看到那一行，这正是 perror 与 printf 的区别。"
          + "第三段是正反对照。正确写法用 fgets 的返回值当循环条件，数出 3 行，循环结束后 feof 变成真（打印 1），ferror 仍是假（打印 0），说明是正常读完，不是出错。"
          + "第四段故意用 while (!feof(fp)) 再数一遍：fgets 的返回值没人看，读失败的那一次也被计入，于是 3 行的文件被数成 4 次。多出来的这一圈就是所有「最后一条数据被处理两遍」bug 的来源。"
      },
      pitfalls: [
        "用 while (!feof(fp)) 当循环条件：多转一圈，最后一条数据被重复处理（本关示例实测 3 行的文件被数成 4 次）。",
        "用了 errno 却忘了先清零：之前某个失败调用留下的旧值会让你误判这次也失败了。",
        "把 perror 的输出当成标准输出：它写到 stderr，重定向到文件或交给只收 stdout 的判题系统时收不到。",
        "只检查 fopen，不检查 fread/fwrite/fscanf 的返回值：读了一半的数据被当成完整数据使用。",
        "fopen 失败后继续用这个流：必须先 return 或走 else 分支，任何对 NULL 流的读写都是未定义行为。"
      ],
      takeaways: [
        "fopen 失败返回 NULL；fread/fwrite/fscanf 的返回值告诉你实际处理了多少",
        "errno 要先清零再调用；strerror/perror 能把错误码变成人话",
        "perror 输出到 stderr，不是 stdout",
        "绝不用 while (!feof(fp))，要用读取函数的返回值控制循环",
        "feof 判断是否正常读完，ferror 判断是否出错，clearerr 复位标志"
      ],
      questions: [
        {
          q: "关于 errno 的用法，下面说法正确的是？",
          options: [
            "只要函数失败，errno 一定是这次失败的错误码，不需要清零",
            "应该在调用前把 errno 置 0，失败后再看它是否被设置；函数成功时不会替你清零",
            "errno 属于某个文件流，每个 fopen 都有自己的一份",
            "errno 是字符串，可以直接用 printf(\"%s\", errno) 打印"
          ],
          answer: 1,
          explain: "errno 是全局的错误码变量：函数失败时设置它，成功时不动它，所以旧值会残留（A 错），用之前先 errno = 0 最稳妥。它是 int（D 错），要打印说明得用 strerror(errno) 或 perror；它也不是每个文件流一份，而是整个进程共享（C 错）。"
        },
        {
          q: "为什么要写成 while (fgets(line, sizeof line, fp) != NULL)，而不是 while (!feof(fp))？",
          options: [
            "feof 只有在一次读操作撞到文件尾之后才为真，用它当条件会让循环多执行一次，把最后一条数据重复处理",
            "feof 返回 void，不能写在循环条件里",
            "feof 只能用于二进制文件，文本文件必须用 ferror",
            "两者完全等价，只是写法风格不同"
          ],
          answer: 0,
          explain: "feof 是事后报告：读完最后一行时它还是假，循环再转一圈，fgets 返回 NULL、缓冲区内容不变，循环体却照样执行了一次。用读取函数的返回值当条件，读不到就退出，不多不少。feof 返回 int（B 错），文本和二进制文件都能用（C 错），两种写法绝不等价（D 错）。"
        },
        {
          q: "perror(\"data.txt\") 打印出来的内容会出现在哪里？",
          options: [
            "标准输出 stdout，和 printf 的输出混在一起",
            "作为返回值返回，需要你自己打印",
            "写进 data.txt 这个文件里",
            "标准错误流 stderr"
          ],
          answer: 3,
          explain: "perror 把「前缀: 错误说明」写到 stderr，这样即使标准输出被重定向到文件或管道，错误信息也仍然能出现在控制台上。参数只是打印出来的前缀，不会去动那个文件（C 错）；perror 没有可用的返回值（B 错）；它也不走 stdout（A 错）。"
        }
      ],
      passRatio: 0.8,
      mission: "写一个程序，把「错误处理」的三件事都做一遍：\n"
        + "1) 用 \"w\" 建立 data.txt 并写入三行 one、two、three（每行以 \\n 结尾），检查 NULL 后 fclose；\n"
        + "2) 先 errno = 0，再 fopen(\"missing.txt\", \"r\")：如果返回 NULL，依次输出 open failed = 1 和 errno changed = 1（用 errno != 0 判断），再用 perror(\"missing.txt\") 打印原因；如果居然成功，则输出 open failed = 0 并 fclose（别忘 #include <errno.h>）；\n"
        + "3) 用 \"r\" 打开 data.txt，用 while (fgets(line, sizeof line, fp) != NULL) 数出行数，输出 lines = 3；\n"
        + "4) 循环结束后用 feof(fp) != 0 确认真的是读到结尾，输出 feof = 1；\n"
        + "5) fclose 之后用 remove(\"data.txt\") 删除文件。\n"
        + "要求：全程不要写 while (!feof(fp))。perror 打印到 stderr，不会出现在标准输出里，这是正常的。",
      starter: "#include <stdio.h>\n"
        + "#include <errno.h>\n"
        + "\n"
        + "int main(void) {\n"
        + "    FILE *fp;\n"
        + "    char line[64];\n"
        + "    int lines = 0;\n"
        + "\n"
        + "    /* 1. \"w\" 建立 data.txt，写入 one / two / three 三行 */\n"
        + "\n"
        + "    /* 2. errno = 0; fopen(\"missing.txt\", \"r\"); 失败时输出 open failed = 1\n"
        + "          和 errno changed = 1，再用 perror(\"missing.txt\") 说明原因 */\n"
        + "\n"
        + "    /* 3. \"r\" 打开 data.txt，用 while (fgets(...) != NULL) 数行数 */\n"
        + "\n"
        + "    /* 4. 循环之后用 feof(fp) != 0 输出 feof = 1 */\n"
        + "\n"
        + "    printf(\"lines = %d\\n\", lines);\n"
        + "    remove(\"data.txt\");\n"
        + "    return 0;\n"
        + "}",
      hint: "两处输出要用同一个分支控制：fopen 成功和失败各走一条路，别在失败之后还继续用 fp。第 3 步的循环条件必须是 fgets 的返回值；feof 只在循环结束之后用来解释「为什么停下来」，不要拿它当条件。",
      check: {
        include: ["stdio.h", "errno.h"],
        return0: true,
        require: { file: true, if: true, while: true },
        calls: [["fopen"], ["fclose"], ["fprintf"], ["perror"], ["fgets"], ["feof"], ["remove"], ["printf", "open failed = "], ["printf", "errno changed = "], ["printf", "lines = "], ["printf", "feof = "]],
        minStatements: 10,
        message: "需要 #include <stdio.h> 和 <errno.h>，并在 main 里用上 fopen、fprintf、fgets、perror、feof、fclose、remove，还要有 if 与 while，最后 printf 输出 open failed = …、errno changed = …、lines = …、feof = … 四行。",
        ok: "返回值检查、errno、perror 和正确的 EOF 判断都到位了。"
      },
      solution: "#include <stdio.h>\n"
        + "#include <errno.h>\n"
        + "\n"
        + "int main(void) {\n"
        + "    FILE *fp;\n"
        + "    char line[64];\n"
        + "    int lines = 0;\n"
        + "\n"
        + "    /* 1. 先准备一个三行的文件 */\n"
        + "    fp = fopen(\"data.txt\", \"w\");\n"
        + "    if (fp == NULL) {\n"
        + "        perror(\"data.txt\");\n"
        + "        return 1;\n"
        + "    }\n"
        + "    fprintf(fp, \"one\\n\");\n"
        + "    fprintf(fp, \"two\\n\");\n"
        + "    fprintf(fp, \"three\\n\");\n"
        + "    fclose(fp);\n"
        + "\n"
        + "    /* 2. 打开不存在的文件：检查返回值，再看 errno */\n"
        + "    errno = 0;\n"
        + "    fp = fopen(\"missing.txt\", \"r\");\n"
        + "    if (fp == NULL) {\n"
        + "        printf(\"open failed = 1\\n\");\n"
        + "        printf(\"errno changed = %d\\n\", errno != 0);\n"
        + "        perror(\"missing.txt\");\n"
        + "    } else {\n"
        + "        printf(\"open failed = 0\\n\");\n"
        + "        printf(\"errno changed = %d\\n\", errno != 0);\n"
        + "        fclose(fp);\n"
        + "    }\n"
        + "\n"
        + "    /* 3. 用读取函数的返回值当循环条件 */\n"
        + "    fp = fopen(\"data.txt\", \"r\");\n"
        + "    if (fp == NULL) {\n"
        + "        perror(\"data.txt\");\n"
        + "        return 1;\n"
        + "    }\n"
        + "    while (fgets(line, sizeof line, fp) != NULL) {\n"
        + "        lines++;\n"
        + "    }\n"
        + "    printf(\"lines = %d\\n\", lines);\n"
        + "\n"
        + "    /* 4. 循环结束后确认是正常读到结尾 */\n"
        + "    printf(\"feof = %d\\n\", feof(fp) != 0);\n"
        + "    fclose(fp);\n"
        + "\n"
        + "    remove(\"data.txt\");\n"
        + "    return 0;\n"
        + "}",
      mastery: [
        "能对每个可能失败的调用检查返回值，并用 errno/perror 说清失败原因",
        "能用读取函数的返回值正确控制读取循环，不再写 while (!feof(fp))",
        "能区分「正常读到结尾」和「读取出错」，并知道 perror 走 stderr"
      ]
    },
    {
      id: 56,
      title: "综合实战：写入—读回—统计的完整流程",
      minutes: 20,
      gist: "把一组数据写进文件再读回来做统计（条数、总分、平均、最大、最小），完整走一遍「落盘 → 重新读取 → 分析」的流程。",
      lesson: "真实程序几乎都是这个形状：产生数据、落到文件、再从文件里读出来做别的事。这一关把前面五关串起来，写一个迷你「数据报表」程序。\n"
        + "流程分三步。第一步产生数据并写文件：用 fprintf 一行一条（格式串写成 \"%d %d\\n\"）。这种「一行一条、字段用空格分开」的格式最省事：记事本能看，Excel 和脚本也能处理，把空格换成逗号就是 CSV。第二步重新打开同一个文件读回来：用 while (fscanf(fp, \"%d %d\", &id, &score) == 2) 按字段读，返回值等于 2 才说明两个字段都拿到了。第三步统计并输出。\n"
        + "有几个容易出错的地方，全都是「小数据看不出、真实数据要出事」的类型。第一，统计变量必须初始化：int total = 0; 不初始化就累加，结果是一堆随机垃圾。第二，最大值/最小值的初值不能想当然地写 0——如果数据全是负数，最大值永远是那个假的 0；稳妥的做法是用第一条记录来初始化（借助一个 count == 0 的分支），或者取一个数据范围之外的初值。第三，平均值注意整数除法：total / count 两边都是 int 时小数被丢掉，必须写成 (double)total / count。第四，再小的报表也要处理打开失败：fopen 返回 NULL 时立刻报告并退出，别硬着头皮往下读。\n"
        + "写文件时还要考虑格式的稳定性：字段顺序、分隔符定好之后不要随便改，否则下次读回来就错位；如果要存字符串，注意它不能包含分隔符（空格），否则读的时候会被拆成两段。\n"
        + "最后一个实用建议：调试文件程序时，先用记事本把文件打开看一眼内容对不对，再去怀疑代码。写文件的代码十有八九是「确实写进去了，但和你以为的不一样」。",
      example: {
        code: "#include <stdio.h>\n"
          + "\n"
          + "int main(void) {\n"
          + "    FILE *fp;\n"
          + "    int scores[4] = {72, 88, 95, 61};\n"
          + "    int id;\n"
          + "    int score;\n"
          + "    int i;\n"
          + "    int count = 0;\n"
          + "    int total = 0;\n"
          + "\n"
          + "    /* 第一步：把数据写成文本文件，每行一条 \"编号 分数\" */\n"
          + "    fp = fopen(\"report.txt\", \"w\");\n"
          + "    if (fp == NULL) {\n"
          + "        perror(\"report.txt\");\n"
          + "        return 1;\n"
          + "    }\n"
          + "    for (i = 0; i < 4; i++) {\n"
          + "        fprintf(fp, \"%d %d\\n\", i + 1, scores[i]);\n"
          + "    }\n"
          + "    fclose(fp);\n"
          + "\n"
          + "    /* 第二步：读回来做统计 */\n"
          + "    fp = fopen(\"report.txt\", \"r\");\n"
          + "    if (fp == NULL) {\n"
          + "        perror(\"report.txt\");\n"
          + "        return 1;\n"
          + "    }\n"
          + "    while (fscanf(fp, \"%d %d\", &id, &score) == 2) {\n"
          + "        count++;\n"
          + "        total += score;\n"
          + "    }\n"
          + "    fclose(fp);\n"
          + "\n"
          + "    /* 第三步：输出统计结果 */\n"
          + "    printf(\"records = %d\\n\", count);\n"
          + "    printf(\"total = %d\\n\", total);\n"
          + "    printf(\"average = %.2f\\n\", count > 0 ? (double)total / count : 0.0);\n"
          + "\n"
          + "    remove(\"report.txt\");\n"
          + "    return 0;\n"
          + "}",
        output: "records = 4\ntotal = 316\naverage = 79.00",
        explain: "第一步用 fprintf 把 4 个分数写成 4 行「编号 分数」，写完立刻 fclose，让数据真正落盘。"
          + "第二步重新 fopen 读回来：fscanf 的返回值等于 2 才计数，count 与 total 都是前面初始化过的累加器，一边读一边算，所以不需要把数据全部存进数组——数据量大时这一点很重要。"
          + "第三步输出统计。注意 average 那一行：total 和 count 都是 int，如果直接写 total / count 会做整数除法，316 / 4 得到 79 而不是 79.00；必须先把 total 转成 double 再除。另外这里还顺手处理了 count 为 0 的情况（文件为空时不会除以 0）。",
      },
      pitfalls: [
        "累加变量不初始化（写 int total; 然后 total += score）：结果是随机垃圾，而且每次运行还不一样。",
        "求最大值时把初值写成 0：数据全是负数时会输出一个假的 0，掩盖了真实的最大值。",
        "平均值用整数除法：total / count 得到整数，小数部分被丢掉；要写 (double)total / count。",
        "写完没有 fclose 就换一个 FILE * 去读：数据可能还压在缓冲区里，读到的文件是空的或不完整的。",
        "统计完不核对条数：格式写错时 fscanf 会提前停下，程序照样输出一份「看起来正常」的报表，错误被掩盖。"
      ],
      takeaways: [
        "「写入 → 读回 → 统计」是文件程序的基本骨架",
        "fscanf 的返回值是判断「读到几条」的依据",
        "累加器要初始化；最大值/最小值用第一条数据或范围外的初值",
        "整数除法会丢小数，平均值要先把 total 转成 double",
        "写完立刻 fclose，再重新 fopen 读取"
      ],
      questions: [
        {
          q: "统计一组分数（可能有负数）的最大值时，初值应该怎么给？",
          options: [
            "0",
            "1",
            "用第一条数据的值初始化（例如借助一个 count == 0 的分支）",
            "不用给，局部变量会自动得到合适的默认值"
          ],
          answer: 2,
          explain: "把最大值初值写成 0，遇到全为负数的数据就会输出一个假的 0，所以 A 不对；1 更是凭空捏造的值（B 错）；C 才是稳妥做法——用第一条记录初始化，或者取一个数据范围之外的初值。D 错：局部变量不会自动初始化，未初始化的值是随机的。"
        },
        {
          q: "total 是 161、count 是 2，要输出平均分 80.50，应该怎么写？",
          options: [
            "printf(\"%.2f\", total / count);",
            "printf(\"%.2f\", (double)total / count);",
            "printf(\"%d\", total / count);",
            "printf(\"%.2f\", (int)(total / count));"
          ],
          answer: 1,
          explain: "两个 int 相除先做整数除法：161 / 2 得到 80，再交给 %.2f 也只能打印 80.00，小数已经丢了（A 错）。必须先把操作数转成 double 再除，得到 80.50（B 对）。C 输出的是整数 80；D 更糟，先把结果截断成整数再转成浮点，还是 80.00。"
        },
        {
          q: "关于「写进文件再读回来」这个流程，下面哪一句是对的？",
          options: [
            "写完应该 fclose（或 fflush）把数据真正落到文件里，再重新打开读取",
            "写完不关文件也能立刻读到，标准库会自动同步",
            "读回时必须用同一个 FILE * 指针，换一个就读不到",
            "读完不用 fclose，操作系统在程序结束时会自动处理，所以不关更省事"
          ],
          answer: 0,
          explain: "数据先写进用户态的缓冲区，只有 fclose/fflush 才会把它交给操作系统，所以 A 对、B 错。读回时重新 fopen（或在同一流上 rewind 后再读）都能工作，用不用同一个指针不是关键，C 错。D 很危险：程序崩溃或被强制结束时没有机会刷新缓冲区，数据会丢，而且文件句柄也会泄漏。"
        }
      ],
      passRatio: 0.8,
      mission: "写一个完整的「写入—读回—统计」程序：\n"
        + "1) 准备 6 条数据（编号 1 到 6，分数依次是 72、88、95、61、79、85），用 fopen(\"report.txt\", \"w\") 打开（检查 NULL），用 for 循环和 fprintf(fp, \"%d %d\\n\", …) 写进文件，然后 fclose；\n"
        + "2) 用 \"r\" 重新打开，用 while (fscanf(fp, \"%d %d\", &id, &score) == 2) 读回来，一边读一边统计：条数 records、总分 total、最大值及其编号、最小值及其编号，然后 fclose；\n"
        + "3) 按下面五行输出，最后 remove(\"report.txt\")：\n"
        + "records = 6\n"
        + "total = 480\n"
        + "average = 80.00\n"
        + "max = 95 (id 3)\n"
        + "min = 61 (id 4)\n"
        + "注意：累加变量要初始化；最大值/最小值用第一条数据初始化（先出现的那个为准）；平均值必须写成 (double)total / count 才会保留两位小数。\n"
        + "写完在本机编译运行，把输出粘贴到下面「运行结果比对」里逐行核对。",
      starter: "#include <stdio.h>\n\n"
        + "int main(void) {\n"
        + "    FILE *fp;\n"
        + "    int ids[6] = {1, 2, 3, 4, 5, 6};\n"
        + "    int scores[6] = {72, 88, 95, 61, 79, 85};\n"
        + "    int i;\n"
        + "    int id;\n"
        + "    int score;\n"
        + "    int count = 0;\n"
        + "    int total = 0;\n"
        + "    int maxScore = 0;\n"
        + "    int minScore = 0;\n"
        + "    int maxId = 0;\n"
        + "    int minId = 0;\n"
        + "\n"
        + "    /* 1. \"w\" 打开 report.txt，用 fprintf(fp, \"%d %d\\n\", ...) 写 6 行 */\n"
        + "\n"
        + "    /* 2. \"r\" 打开，while (fscanf(fp, \"%d %d\", &id, &score) == 2) 一边读一边统计 */\n"
        + "\n"
        + "    /* 3. 输出五行统计结果（average 用 (double)total / count） */\n"
        + "\n"
        + "    remove(\"report.txt\");\n"
        + "    return 0;\n"
        + "}",
      hint: "最大值/最小值不要用 0 当门槛，而是在 count == 0 时直接用第一条数据初始化四个变量（maxScore、maxId、minScore、minId），之后才做比较。输出格式要和预期逐字一致：max 和 min 后面都要带 (id n)，中间一个空格。",
      check: {
        include: ["stdio.h"],
        return0: true,
        require: { file: true, if: true, for: true, while: true },
        calls: [["fopen"], ["fclose"], ["fprintf"], ["fscanf"], ["remove"], ["printf", "records = "], ["printf", "total = "], ["printf", "average = "], ["printf", "max = "], ["printf", "min = "]],
        minStatements: 12,
        message: "需要在 main 里用上 fopen、fprintf（写文件）、fscanf（读回）、fclose、remove，还要有 for 与 while、if 判断，最后 printf 输出 records = …、total = …、average = …、max = …、min = … 五行。",
        ok: "写入、读回、统计、输出四步齐全，结构完全正确。"
      },
      expectedOutput: "records = 6\ntotal = 480\naverage = 80.00\nmax = 95 (id 3)\nmin = 61 (id 4)",
      solution: "#include <stdio.h>\n\n"
        + "int main(void) {\n"
        + "    FILE *fp;\n"
        + "    int ids[6] = {1, 2, 3, 4, 5, 6};\n"
        + "    int scores[6] = {72, 88, 95, 61, 79, 85};\n"
        + "    int n = 6;\n"
        + "    int i;\n"
        + "    int id;\n"
        + "    int score;\n"
        + "    int count = 0;\n"
        + "    int total = 0;\n"
        + "    int maxScore = 0;\n"
        + "    int minScore = 0;\n"
        + "    int maxId = 0;\n"
        + "    int minId = 0;\n"
        + "\n"
        + "    /* 第一步：把一组数据写进文本文件 */\n"
        + "    fp = fopen(\"report.txt\", \"w\");\n"
        + "    if (fp == NULL) {\n"
        + "        perror(\"report.txt\");\n"
        + "        return 1;\n"
        + "    }\n"
        + "    for (i = 0; i < n; i++) {\n"
        + "        fprintf(fp, \"%d %d\\n\", ids[i], scores[i]);\n"
        + "    }\n"
        + "    fclose(fp);\n"
        + "\n"
        + "    /* 第二步：读回来做统计 */\n"
        + "    fp = fopen(\"report.txt\", \"r\");\n"
        + "    if (fp == NULL) {\n"
        + "        perror(\"report.txt\");\n"
        + "        return 1;\n"
        + "    }\n"
        + "    while (fscanf(fp, \"%d %d\", &id, &score) == 2) {\n"
        + "        if (count == 0) {\n"
        + "            maxScore = score;\n"
        + "            maxId = id;\n"
        + "            minScore = score;\n"
        + "            minId = id;\n"
        + "        } else {\n"
        + "            if (score > maxScore) {\n"
        + "                maxScore = score;\n"
        + "                maxId = id;\n"
        + "            }\n"
        + "            if (score < minScore) {\n"
        + "                minScore = score;\n"
        + "                minId = id;\n"
        + "            }\n"
        + "        }\n"
        + "        count++;\n"
        + "        total += score;\n"
        + "    }\n"
        + "    fclose(fp);\n"
        + "\n"
        + "    /* 第三步：输出统计结果 */\n"
        + "    printf(\"records = %d\\n\", count);\n"
        + "    printf(\"total = %d\\n\", total);\n"
        + "    printf(\"average = %.2f\\n\", count > 0 ? (double)total / count : 0.0);\n"
        + "    printf(\"max = %d (id %d)\\n\", maxScore, maxId);\n"
        + "    printf(\"min = %d (id %d)\\n\", minScore, minId);\n"
        + "\n"
        + "    remove(\"report.txt\");\n"
        + "    return 0;\n"
        + "}",
      mastery: [
        "能独立完成「写文件 → 读回来 → 统计输出」的完整小程序",
        "能避开初始化、整数除法、最大值初值这几个统计陷阱",
        "能按固定格式输出可逐行核对的结果"
      ]
    }
  ]
});