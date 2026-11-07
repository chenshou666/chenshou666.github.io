/* ============================================================================
 * HT Lab · C 语言课程 · 模块 5 · 自定义类型与数据结构
 * 关卡 id：43–50（本文件由模块作者维护）
 * 每关的 example 与 solution 都在本机真实编译运行过（gcc -std=c11 -Wall -Wextra，零警告），
 * example.output / expectedOutput 是照抄的真实输出。
 * ==========================================================================*/
window.C_MODULES = window.C_MODULES || [];
window.C_MODULES.push({
  id: "c5",
  name: "模块 5 · 自定义类型与数据结构",
  levels: [
    {
      id: 43,
      title: "struct：把相关的数据打包成一个整体",
      minutes: 15,
      gist: "学会定义结构体、创建并访问它的成员，并看懂 sizeof 为什么常常比字段之和更大。",
      lesson: "到目前为止，你见过的类型都是“单个值”：int 是一个整数，char 是一个字符，数组则要求所有元素同类型。可现实里的东西往往是“几个不同类型的数据凑在一起”：一个点有两个 int，一个学生有学号、姓名、分数。如果拆成好几个独立变量，函数一多就要传一长串参数，还很容易把顺序传错。\n"
        + "结构体（structure）就是为此发明的：把若干个字段打包成一个整体，给它起一个名字，从此它就是一个类型。\n"
        + "写法是这样的：\n"
        + "struct Point {\n"
        + "    int x;\n"
        + "    int y;\n"
        + "};\n"
        + "注意最后那个分号不能少——它和普通语句一样要结束。struct Point 才是类型名，struct 关键字不能省略（除非另起别名，那是下一关之后的 typedef 要解决的问题）。定义这个“图纸”本身不占内存，只有写下 struct Point p; 时才真正分配出一块内存放两个 int。\n"
        + "三种创建方式要分清：struct Point p = {3, 4}; 是初始化列表，按字段声明的顺序填值；struct Point p; p.x = 3; 是逐个赋值，用点号 . 访问成员；struct Point q = p; 是整体赋值，C 允许同类型结构体整体拷贝，语义是把每个字段都复制一份，之后两者互不影响。注意 C 不允许用 == 直接比较两个结构体是否相等，必须逐字段比较。\n"
        + "最后一个必须理解的点是内存对齐。结构体的字段按声明顺序依次摆放，但每个字段的起始地址要满足自己的对齐要求（x86-64 上 int 要求 4 字节对齐）。排在后面的字段如果对不齐，编译器就会在前面插入几个“填充字节”（padding）。所以 struct Mixed { char tag; int value; }; 的大小不是 1 + 4 = 5，而是 8：tag 在偏移 0，填充 3 个字节，value 在偏移 4。字段顺序会影响结构体大小：把大的字段放在前面通常更省空间。sizeof 的结果类型是 size_t（无符号整数），用 printf 的 %d 输出时要显式写成 (int)sizeof(...)，否则格式符和实参类型不匹配。",
      example: {
        code: "#include <stdio.h>\n"
          + "\n"
          + "struct Point {\n"
          + "    int x;\n"
          + "    int y;\n"
          + "};\n"
          + "\n"
          + "struct Mixed {\n"
          + "    char tag;\n"
          + "    int value;\n"
          + "};\n"
          + "\n"
          + "struct Packed {\n"
          + "    char a;\n"
          + "    char b;\n"
          + "    char c;\n"
          + "};\n"
          + "\n"
          + "int main(void) {\n"
          + "    struct Point p = {3, 4};\n"
          + "    struct Point q;\n"
          + "\n"
          + "    q.x = p.x + 1;\n"
          + "    q.y = p.y * 2;\n"
          + "\n"
          + "    printf(\"p = (%d, %d)\\n\", p.x, p.y);\n"
          + "    printf(\"q = (%d, %d)\\n\", q.x, q.y);\n"
          + "    printf(\"sizeof Point = %d\\n\", (int)sizeof(struct Point));\n"
          + "    printf(\"sizeof Mixed = %d\\n\", (int)sizeof(struct Mixed));\n"
          + "    printf(\"sizeof Packed = %d\\n\", (int)sizeof(struct Packed));\n"
          + "    return 0;\n"
          + "}",
        output: "p = (3, 4)\n"
          + "q = (4, 8)\n"
          + "sizeof Point = 8\n"
          + "sizeof Mixed = 8\n"
          + "sizeof Packed = 3",
        explain: "第 3～6 行定义 struct Point，两个 int 字段；第 8～11 行定义 struct Mixed，用一个 char 加一个 int 制造出对齐填充；第 13～17 行的 struct Packed 三个 char 正好紧挨着，没有填充。\n"
          + "main 里第 20 行用初始化列表创建 p = {3, 4}，第 21 行只声明 q（此时字段还是不确定的值）。第 23、24 行用点号逐个给 q 的字段赋值：q.x 取 p.x + 1，q.y 取 p.y * 2，这演示了成员可以像普通变量一样参与运算。\n"
          + "第 26、27 行打印两个点的坐标，可以看到 p 是 (3, 4)、q 是 (4, 8)。第 28～30 行是关键对比：sizeof(struct Point) 是 8（两个 int 正好 8 字节），sizeof(struct Mixed) 也是 8（1 字节 char 加 3 字节填充再加 4 字节 int），而 sizeof(struct Packed) 只有 3。也就是说结构体大小并不总等于字段大小之和，多出来的就是填充。"
      },
      pitfalls: [
        "结构体定义结尾漏分号：`struct Point { int x; int y; }` 后面不写 `;` → 编译器报 expected ';' 之类的错误，而且往往报在下一行，容易看错位置。",
        "创建变量时漏掉 struct 关键字：写 `Point p;` 而没写 `struct Point p;` → unknown type name 'Point'（想让 Point 当类型名，得先用 typedef 起别名）。",
        "以为 sizeof(struct X) 就是字段大小相加：`struct Mixed { char tag; int value; };` 是 8 而不是 5，多出来的是对齐填充；把字段按从大到小排列通常能少浪费几个字节。",
        "用 `if (p == q)` 比较两个结构体 → 编译错误，C 没有为结构体定义 ==；要写 `p.x == q.x && p.y == q.y`。",
        "用 %d 打印 sizeof：sizeof 的结果是 size_t，直接传给 %d 在 -Wall 下会警告，要写 (int)sizeof(...)。"
      ],
      takeaways: [
        "struct 把多个字段打包成一个类型，定义以分号结束，struct Point p; 才分配内存",
        "初始化列表按字段顺序填值，访问成员用点号，同类型结构体可以整体赋值但不能用 == 比较",
        "字段之间有对齐填充，sizeof 通常大于或等于字段大小之和",
        "sizeof 返回 size_t，printf 里要显式转换成 int 再用 %d"
      ],
      questions: [
        {
          q: "定义好 `struct Point { int x; int y; };` 之后，下面哪种写法能创建一个名为 p 的结构体变量？",
          options: ["Point p;","struct Point p;","struct p Point;","new Point p;"],
          answer: 1,
          explain: "C 里类型名是 struct Point，struct 关键字不能省。Point p; 会被当成一个没见过的类型名而报错；struct p Point; 把名字和类型写反了；new 是 C++ 一类语言的写法，C 里没有这个关键字。"
        },
        {
          q: "`struct Mixed { char tag; int value; };` 在 64 位 gcc 下 sizeof(struct Mixed) 等于多少？",
          options: ["5","6","8","12"],
          answer: 2,
          explain: "char 占 1 字节，int 要求 4 字节对齐，所以 tag 后面要插入 3 字节填充，value 落在偏移 4 处，总大小 8。5 是字段大小之和，忽略了填充；6 和 12 都不符合对齐规则。"
        },
        {
          q: "a、b 是同一个 struct 类型的变量，执行 `b = a;` 之后会怎样？",
          options: [
            "b 和 a 共享同一份数据，改 a 会影响 b",
            "编译错误，结构体不能整体赋值",
            "只复制第一个字段",
            "a 的每个字段被复制到 b，之后两者互不影响"
          ],
          answer: 3,
          explain: "C 允许同类型结构体整体赋值，语义是逐字段复制（值语义）。共享同一份数据是指针的行为；结构体整体赋值完全合法；复制的是全部字段，不止第一个。"
        }
      ],
      passRatio: 0.8,
      mission: "定义一个结构体 struct Rect（两个 int 字段：w 和 h），然后：\n"
        + "1) 用初始化列表创建 a = {3, 4}；\n"
        + "2) 再创建 b，用 b.w = 5; b.h = 2; 逐个赋值；\n"
        + "3) 依次输出四行（数值要和下面一致，格式也要一致）：\n"
        + "a = 3 x 4\n"
        + "b = 5 x 2\n"
        + "area a = 12, area b = 10\n"
        + "size = 8\n"
        + "其中两个面积要求用字段相乘算出来（不要把 12、10 直接写进字符串），最后一行打印 sizeof(struct Rect)。",
      starter: "#include <stdio.h>\n"
        + "\n"
        + "/* TODO: 在这里定义 struct Rect（字段：int w; int h;） */\n"
        + "\n"
        + "int main(void) {\n"
        + "    /* TODO: 用初始化列表创建 a = {3, 4} */\n"
        + "    /* TODO: 再创建 b，用 b.w = 5; b.h = 2; 逐个赋值 */\n"
        + "\n"
        + "    /* TODO: 依次打印 a、b、两个面积、sizeof(struct Rect) */\n"
        + "\n"
        + "    return 0;\n"
        + "}",
      hint: "先把结构体定义写在 #include 后面；a 用 {3, 4} 一次创建好，b 分两行赋字段。打印面积时把 a.w * a.h 作为 printf 的实参交给 %d 去算，最后一行写 (int)sizeof(struct Rect)。",
      check: {
        include: ["stdio.h"],
        return0: true,
        seq: [["=","{"]],
        require: {
          struct: "Rect"
        },
        calls: [["printf","area"],["printf","size"]],
        minStatements: 6,
        message: "需要 #include <stdio.h>、定义 struct Rect、用初始化列表 {…} 创建 a、打印含 area 与 size 的两行，并 return 0;。",
        ok: "结构体定义、初始化列表、成员访问和 sizeof 都用对了。"
      },
      solution: "#include <stdio.h>\n"
        + "\n"
        + "struct Rect {\n"
        + "    int w;\n"
        + "    int h;\n"
        + "};\n"
        + "\n"
        + "int main(void) {\n"
        + "    struct Rect a = {3, 4};\n"
        + "    struct Rect b;\n"
        + "\n"
        + "    b.w = 5;\n"
        + "    b.h = 2;\n"
        + "\n"
        + "    printf(\"a = %d x %d\\n\", a.w, a.h);\n"
        + "    printf(\"b = %d x %d\\n\", b.w, b.h);\n"
        + "    printf(\"area a = %d, area b = %d\\n\", a.w * a.h, b.w * b.h);\n"
        + "    printf(\"size = %d\\n\", (int)sizeof(struct Rect));\n"
        + "    return 0;\n"
        + "}",
      mastery: [
        "能独立定义结构体并用初始化列表或逐个赋值创建变量",
        "能用 sizeof 和字段顺序解释对齐填充带来的大小差异",
        "看到 sizeof 相关的格式警告时，知道要显式转换类型"
      ]
    },
    {
      id: 44,
      title: "struct 与指针：-> 运算符和两种传参方式",
      minutes: 18,
      gist: "掌握结构体指针、-> 运算符，彻底分清值传递与指针传递的区别。",
      lesson: "结构体一旦变大，“怎么把它交给函数”就成了必须想清楚的问题。C 只有一种传参方式——值传递：函数拿到的是实参的一份拷贝。结构体当然也一样，把一个 struct 传给函数，等于把整块内存复制一遍。\n"
        + "这就带来两个后果。第一是开销：字段多、结构体大时，每次调用都要复制一整份，而且如果结构体里有数组，复制量更大。第二是语义：函数里改的是副本，改完就随函数一起消失，调用者的对象毫发无损。所以函数如果要修改调用者的结构体，必须传地址。\n"
        + "指向结构体的指针写法是 struct Counter *p;，让它指向一个真实对象用 p = &a;。通过指针访问成员有两种写法：(*p).x 和 p->x，后者是前者的简写，也是日常写法。为什么不能写 *p.x？因为成员运算符 . 的优先级高于解引用 *，*p.x 会被解析成 *(p.x)，而 p 本身是指针，根本没有成员可以取，编译器会直接报错。记住一句话：变量用点，指针用箭头。\n"
        + "什么时候用哪种？只读地查看、或者结构体很小（比如两个 int）时，值传递简单直接；需要修改、或者结构体较大时传指针。如果传指针只是为了避免复制、并不想修改对象，就在参数上加 const，写成 const struct Counter *c，这样既能读，又能把“我不改它”这个约定写进类型里——读代码的人一眼就知道这个函数不会有副作用。\n"
        + "怎么读别人的代码：看到函数签名里出现 struct X *，先假设它可能会修改你传进去的对象，除非有 const；看到 struct X（没有星号）就知道这是一份拷贝，函数内部的修改不会传出来。这两条判断，能帮你省下大量调试时间。",
      example: {
        code: "#include <stdio.h>\n"
          + "\n"
          + "struct Counter {\n"
          + "    int value;\n"
          + "    int step;\n"
          + "};\n"
          + "\n"
          + "void add_by_value(struct Counter c) {\n"
          + "    c.value += c.step;\n"
          + "}\n"
          + "\n"
          + "void add_by_pointer(struct Counter *c) {\n"
          + "    c->value += c->step;\n"
          + "}\n"
          + "\n"
          + "int main(void) {\n"
          + "    struct Counter a = {0, 5};\n"
          + "    struct Counter *p = &a;\n"
          + "    struct Counter copy;\n"
          + "\n"
          + "    printf(\"start: %d\\n\", p->value);\n"
          + "\n"
          + "    add_by_value(a);\n"
          + "    printf(\"after value call: %d\\n\", a.value);\n"
          + "\n"
          + "    add_by_pointer(&a);\n"
          + "    printf(\"after pointer call: %d\\n\", a.value);\n"
          + "\n"
          + "    p->step = 10;\n"
          + "    add_by_pointer(p);\n"
          + "    printf(\"after step change: %d\\n\", a.value);\n"
          + "\n"
          + "    copy = a;\n"
          + "    copy.value = 999;\n"
          + "    printf(\"copy: %d, original: %d\\n\", copy.value, a.value);\n"
          + "    return 0;\n"
          + "}",
        output: "start: 0\n"
          + "after value call: 0\n"
          + "after pointer call: 5\n"
          + "after step change: 15\n"
          + "copy: 999, original: 15",
        explain: "第 3～6 行定义 struct Counter，两个 int 字段。第 8～10 行的 add_by_value 参数是结构体本身，函数里 c.value += c.step; 改的是副本；第 12～14 行的 add_by_pointer 参数是指针，用 c->value += c->step; 改的是调用者的对象。这两个函数放在一起对比，是本关的核心。\n"
          + "main 里第 17 行创建 a = {0, 5}，第 18 行让指针 p 指向 a。第 21 行用 p->value 打印起始值 0。第 23、24 行调用 add_by_value(a) 后再打印，值仍然是 0——因为在函数里加的 5 加在了副本上。第 26、27 行改成 add_by_pointer(&a)，这次打印出 5，本体被改到了。\n"
          + "第 29 行通过 p->step = 10; 用指针修改字段，再调用一次 add_by_pointer(p)，值从 5 变成 15。最后第 33～35 行演示结构体整体赋值：copy = a; 之后改 copy.value = 999，原来的 a.value 仍是 15，说明整体赋值是复制而不是共享。"
      },
      pitfalls: [
        "写成 `*p.x` 访问成员：因为 . 的优先级高于 *，它被解析成 *(p.x)，编译器报错；正确写法是 (*p).x 或更常见的 p->x。",
        "函数参数写成结构体本身却指望改到外面：`void f(struct Counter c)` 里的修改只影响副本，调用后原变量不变——要改就传 &a 并把参数写成指针。",
        "指针没有指向有效对象就解引用：`struct Counter *p; p->value = 1;` 是野指针，行为未定义，程序可能崩溃或数据错乱；必须先 p = &a; 或给它 malloc 出来的内存。",
        "把 `&a` 写成 `a`：调用 add_by_pointer(a) 时类型不匹配，-Wall 下会报 incompatible type，修的时候要连参数类型一起看。"
      ],
      takeaways: [
        "p->x 就是 (*p).x 的简写；变量用点、指针用箭头",
        "结构体传参是值传递，函数里改的是副本",
        "要修改调用者的结构体必须传地址，函数用 -> 访问成员",
        "只读的大结构体用 const 指针，既省拷贝又能表达“不修改”"
      ],
      questions: [
        {
          q: "结构体指针 p 指向一个 struct，`p->value` 等价于下面哪种写法？",
          options: ["*(p.value)","*p.value","(*p).value","&p.value"],
          answer: 2,
          explain: "-> 就是 (*p).value 的简写。写成 *p.value 会被解析成 *(p.value)，因为 . 的优先级高于 *，而 p 是指针、不能用点号取成员；&p.value 取的是成员地址而不是值；*(p.value) 同样先算了 p.value，不成立。"
        },
        {
          q: "函数 `void set(struct Counter c)` 里写了 `c.value = 1;`，调用之后外面那个变量的 value 没有变，原因是？",
          options: [
            "结构体传参是值传递，函数里改的是副本",
            "C 语言里结构体字段是只读的",
            "结构体字段必须声明为 int 才能修改",
            "函数名必须以 set 开头才会生效"
          ],
          answer: 0,
          explain: "值传递会把整个结构体复制一份给函数，函数改的是自己的副本，返回后就没了。想让函数改到调用者的对象，参数要写成 struct Counter *，函数里用 c->value = 1;。字段完全可写；能不能改与字段类型、函数名都无关。"
        },
        {
          q: "函数只需要只读地打印一个较大的结构体，最合适的参数写法是？",
          options: [
            "void show(struct Big b)",
            "void show(const struct Big *b)",
            "void show(struct Big *b) 并在函数里顺手修改它",
            "void show(void)，函数里重新造一个"
          ],
          answer: 1,
          explain: "传 const 指针只复制一个地址，又不允许函数修改对象，既省拷贝又表达清楚意图。值传递会复制整个结构体，大结构体开销明显；传非 const 指针再修改它违背了“只读”的要求；不接收参数就拿不到要打印的对象。"
        }
      ],
      passRatio: 0.8,
      mission: "定义 struct Account { int balance; int rate; };（余额和利率），然后写两个函数对比传参方式：\n"
        + "1) bonus_by_value(struct Account a)：在副本上把 balance 增加 rate（调用者不受影响）；\n"
        + "2) bonus_by_pointer(struct Account *a)：用 -> 把余额增加 rate（改到本体）；\n"
        + "main 里：struct Account acc = {100, 8};，struct Account *p = &acc;\n"
        + "依次输出（数值和格式都要一致）：\n"
        + "start 100\n"
        + "after value 100\n"
        + "after pointer 108\n"
        + "after rate 128\n"
        + "step 20\n"
        + "其中 after rate 那一行是执行 p->rate = 20; 之后再调用 bonus_by_pointer(p) 得到的，最后一行打印 p->rate。",
      starter: "#include <stdio.h>\n"
        + "\n"
        + "struct Account {\n"
        + "    int balance;\n"
        + "    int rate;\n"
        + "};\n"
        + "\n"
        + "/* TODO: bonus_by_value(struct Account a)：值传递，在副本上加 rate */\n"
        + "/* TODO: bonus_by_pointer(struct Account *a)：用 -> 在本体上加 rate */\n"
        + "\n"
        + "int main(void) {\n"
        + "    struct Account acc = {100, 8};\n"
        + "    struct Account *p = &acc;\n"
        + "\n"
        + "    /* TODO: 打印 start */\n"
        + "    /* TODO: 调用 bonus_by_value(acc)，打印 after value */\n"
        + "    /* TODO: 调用 bonus_by_pointer(&acc)，打印 after pointer */\n"
        + "    /* TODO: p->rate = 20; 再调用 bonus_by_pointer(p)，打印 after rate 和 step */\n"
        + "\n"
        + "    return 0;\n"
        + "}",
      hint: "两个函数体各只有一行：一个写 a.balance += a.rate;，另一个写 a->balance += a->rate;。main 里先调用值传递版本，再调用指针版本，两次打印对比；注意传指针时要写 &acc 或直接用 p。",
      check: {
        include: ["stdio.h"],
        return0: true,
        seq: [["->"],["&"]],
        require: {
          pointer: true,
          struct: "Account",
          funcs: ["bonus_by_pointer"]
        },
        calls: [["printf","after value"],["printf","after rate"]],
        minStatements: 6,
        message: "需要定义 struct Account、自己写 bonus_by_pointer 函数、在 main 里用到 -> 和 &，并打印 after value 与 after rate 两行。",
        ok: "值传递与指针传递的差别、-> 运算符、取地址都用对了。"
      },
      expectedOutput: "start 100\nafter value 100\nafter pointer 108\nafter rate 128\nstep 20",
      solution: "#include <stdio.h>\n"
        + "\n"
        + "struct Account {\n"
        + "    int balance;\n"
        + "    int rate;\n"
        + "};\n"
        + "\n"
        + "/* 值传递：改的是副本，调用者的账户不会变 */\n"
        + "void bonus_by_value(struct Account a) {\n"
        + "    a.balance += a.rate;\n"
        + "}\n"
        + "\n"
        + "/* 指针传递：通过地址改到本体 */\n"
        + "void bonus_by_pointer(struct Account *a) {\n"
        + "    a->balance += a->rate;\n"
        + "}\n"
        + "\n"
        + "int main(void) {\n"
        + "    struct Account acc = {100, 8};\n"
        + "    struct Account *p = &acc;\n"
        + "\n"
        + "    printf(\"start %d\\n\", acc.balance);\n"
        + "\n"
        + "    bonus_by_value(acc);\n"
        + "    printf(\"after value %d\\n\", acc.balance);\n"
        + "\n"
        + "    bonus_by_pointer(&acc);\n"
        + "    printf(\"after pointer %d\\n\", acc.balance);\n"
        + "\n"
        + "    p->rate = 20;\n"
        + "    bonus_by_pointer(p);\n"
        + "    printf(\"after rate %d\\n\", acc.balance);\n"
        + "    printf(\"step %d\\n\", p->rate);\n"
        + "    return 0;\n"
        + "}",
      mastery: [
        "能写出结构体指针并用 -> 访问成员，也能解释它和 (*p).x 的关系",
        "能判断一个函数会不会修改传进去的结构体",
        "遇到“函数里改了外面没变”的问题时，立刻想到值传递与副本"
      ]
    },
    {
      id: 45,
      title: "结构体数组与排序：按字段给记录排队",
      minutes: 20,
      gist: "把结构体放进数组，按某个字段排序（冒泡或 qsort），并学会交换整个元素。",
      lesson: "有了结构体，就可以把“一张表”装进数组：struct Student group[5]; 是 5 个学生的数组，每个元素都是完整的结构体。数组元素在内存里是连续排列的（元素内部可能有对齐填充），所以 group[2].name 表示“第 3 个元素的 name 字段”，下标依然从 0 开始。\n"
        + "访问字段的顺序是“先下标、再点号”：group[i].score。如果你有指向元素的指针，也可以写成 (p + i)->score 或 p[i].score，这三者在语义上是一致的。\n"
        + "给结构体数组排序有两种常见写法。第一种是自己在元素之间比较字段、交换整个元素，比如冒泡排序：\n"
        + "for (i = 0; i < n - 1; i++)\n"
        + "    for (j = 0; j < n - 1 - i; j++)\n"
        + "        if (a[j].score < a[j + 1].score) { 交换 a[j] 和 a[j+1] }\n"
        + "条件是“前一个比后一个小时就交换”，效果就是把分数大的往前搬，最终从高到低。交换时不要逐个字段搬——C 允许同类型结构体整体赋值，所以用三行搞定：struct Student t = a[j]; a[j] = a[j + 1]; a[j + 1] = t;。如果只交换了 score 却忘了 name，姓名和分数就会错位，这是初学者最常见的“排序后数据对不上”的原因。\n"
        + "第二种是调用标准库的 qsort（声明在 stdlib.h）。它需要一个比较函数：int cmp(const void *a, const void *b)。参数是 void * 是因为 qsort 要排任意类型，函数里必须先转回真实类型（const struct Student *x = a;）再比较字段；返回值用负数、0、正数分别表示“第一个小、相等、第一个大”。注意 qsort 是不稳定排序，成绩相同的记录相对顺序可能变。冒泡好懂、便于观察每一步；qsort 更通用、写熟了更快，两者都值得会。",
      example: {
        code: "#include <stdio.h>\n"
          + "\n"
          + "struct Student {\n"
          + "    char name[12];\n"
          + "    int score;\n"
          + "};\n"
          + "\n"
          + "void sort_by_score(struct Student a[], int n) {\n"
          + "    int i, j;\n"
          + "    for (i = 0; i < n - 1; i++) {\n"
          + "        for (j = 0; j < n - 1 - i; j++) {\n"
          + "            if (a[j].score < a[j + 1].score) {\n"
          + "                struct Student tmp = a[j];\n"
          + "                a[j] = a[j + 1];\n"
          + "                a[j + 1] = tmp;\n"
          + "            }\n"
          + "        }\n"
          + "    }\n"
          + "}\n"
          + "\n"
          + "void print_all(struct Student a[], int n) {\n"
          + "    int i;\n"
          + "    for (i = 0; i < n; i++) {\n"
          + "        printf(\"%s %d\\n\", a[i].name, a[i].score);\n"
          + "    }\n"
          + "}\n"
          + "\n"
          + "int main(void) {\n"
          + "    struct Student group[4] = {\n"
          + "        {\"Ann\", 91},\n"
          + "        {\"Bob\", 78},\n"
          + "        {\"Cid\", 85},\n"
          + "        {\"Dan\", 62}\n"
          + "    };\n"
          + "\n"
          + "    printf(\"before:\\n\");\n"
          + "    print_all(group, 4);\n"
          + "\n"
          + "    sort_by_score(group, 4);\n"
          + "\n"
          + "    printf(\"after:\\n\");\n"
          + "    print_all(group, 4);\n"
          + "    return 0;\n"
          + "}",
        output: "before:\n"
          + "Ann 91\n"
          + "Bob 78\n"
          + "Cid 85\n"
          + "Dan 62\n"
          + "after:\n"
          + "Ann 91\n"
          + "Cid 85\n"
          + "Bob 78\n"
          + "Dan 62",
        explain: "第 3～6 行定义 struct Student，name 是 12 个字符的数组，score 是 int。第 8～19 行的 sort_by_score 接收数组和长度：外层控制比较轮数，内层从头两两比较，条件 a[j].score < a[j + 1].score 成立时交换。注意交换用的是第 13～15 行那三句整体赋值，name 和 score 一起搬家，不会错位。\n"
          + "第 21～26 行的 print_all 只负责遍历打印，每个元素用 %s %d 输出。main 里第 29～34 行用初始化列表建好 4 个学生——结构体数组的初始化是“每个元素一个花括号”，多个元素再套一层花括号。\n"
          + "第 36 行先打印 before，第 39 行调用排序，第 41 行再打印 after。对比两次输出可以看到：排序前是 Ann 91、Bob 78、Cid 85、Dan 62，排序后按分数从高到低变成 Ann 91、Cid 85、Bob 78、Dan 62。"
      },
      pitfalls: [
        "交换元素时只交换了部分字段（例如只换 score）→ 排序后分数和姓名对不上，数据看起来像被“洗乱”了；要交换整个结构体。",
        "内层循环写成 `j < n - 1`（缺了 `- i`）→ 不会算错结果但会多做无用比较；写成 `j <= n - 1` 则访问 a[n]，是数组越界。",
        "初始化结构体数组时花括号少一层：`struct Student a[2] = {\"Ann\", 91, \"Bob\", 78};` 是错的，应该是 `{{\"Ann\", 91}, {\"Bob\", 78}}`。",
        "qsort 的比较函数里直接用 `a->score`：参数是 const void *，必须先转成 const struct Student *，否则报错。",
        "比较函数里用减法当返回值：`return x->score - y->score;` 对 int 一般能用，但极端值会溢出；更稳妥的是判断大小后返回 -1 / 0 / 1。",
        "以为排序会“返回”一个新数组：sort 函数通常直接改传入的数组（C 的数组参数就是原数组），排序后再打印原数组即可。"
      ],
      takeaways: [
        "结构体数组的下标和字段访问写成 a[i].field，初始化是每个元素一层花括号",
        "排序时比较字段、交换整个结构体，避免字段错位",
        "冒泡排序用双层循环；条件方向决定升序还是降序",
        "qsort 需要返回负/0/正的比较函数，参数是 const void *"
      ],
      questions: [
        {
          q: "按 score 从高到低排序时，`if (a[j].score < a[j + 1].score)` 这个条件的作用是？",
          options: [
            "分数小的留在后面不动，所以是从低到高",
            "分数小的与后面交换，高分被搬到前面，结果是从高到低",
            "条件写反了，必须用 >=",
            "结构体数组不能这样比较"
          ],
          answer: 1,
          explain: "当 a[j] 的分数比后一个更小时就交换，等价于把分数大的往前搬，最终从高到低。想从低到高把条件反过来写即可。按字段比较结构体数组完全合法，缺失的只是“整体比较两个结构体”这种写法。"
        },
        {
          q: "用 qsort 排序结构体数组时，比较函数的返回值应该表示什么？",
          options: [
            "返回 0 或 1：0 表示相等，1 表示不相等",
            "返回 1 表示交换、返回 0 表示不交换",
            "返回第一个参数指向元素的 score 值本身",
            "返回负数、0 或正数，分别表示第一个参数小于、等于、大于第二个"
          ],
          answer: 3,
          explain: "qsort 只看返回值的符号：负 = 前一个小，0 = 相等，正 = 前一个大。返回 0/1 或 1/0 都表达不出“谁更大”；返回 score 本身在分数相等时会返回非 0，顺序就乱了。"
        },
        {
          q: "`struct Student group[5];` 中，`group[2].name` 指的是什么？",
          options: ["第 2 个元素的 name","整个数组的名字","所有元素 name 拼起来的结果","第 3 个元素的 name"],
          answer: 3,
          explain: "数组下标从 0 开始，group[2] 是第 3 个元素，再取它的 name 字段。写成“第 2 个”是典型的差一错误；group 本身没有 name 字段；它也不会把所有元素的 name 拼起来。"
        }
      ],
      passRatio: 0.8,
      mission: "定义 struct Student { char name[12]; int score; };，用初始化列表建一个 5 人的数组（顺序：Ann 91、Bob 78、Cid 85、Dan 62、Eve 95），然后：\n"
        + "1) 写 void sort_by_score(struct Student a[], int n)，按 score 从高到低排序（内部用冒泡，交换整个结构体；如果你已经会 qsort，也可以在函数里改用 qsort）；\n"
        + "2) 写 void print_all(struct Student a[], int n)，用 \"%s %d\" 打印每个元素，元素之间输出 \", \"，最后换行；\n"
        + "3) main 里输出三行：\n"
        + "before: Ann 91, Bob 78, Cid 85, Dan 62, Eve 95\n"
        + "after: Eve 95, Ann 91, Cid 85, Bob 78, Dan 62\n"
        + "top = Eve",
      starter: "#include <stdio.h>\n"
        + "\n"
        + "struct Student {\n"
        + "    char name[12];\n"
        + "    int score;\n"
        + "};\n"
        + "\n"
        + "/* TODO: sort_by_score(struct Student a[], int n)：按 score 从高到低冒泡排序 */\n"
        + "/* TODO: print_all(struct Student a[], int n)：用 \"%s %d\" 打印，元素之间用 \", \" 分隔 */\n"
        + "\n"
        + "int main(void) {\n"
        + "    struct Student group[5] = {\n"
        + "        {\"Ann\", 91},\n"
        + "        {\"Bob\", 78},\n"
        + "        {\"Cid\", 85},\n"
        + "        {\"Dan\", 62},\n"
        + "        {\"Eve\", 95}\n"
        + "    };\n"
        + "\n"
        + "    /* TODO: 打印 before、排序、打印 after、打印 top = 第一名姓名 */\n"
        + "\n"
        + "    return 0;\n"
        + "}",
      hint: "排序函数是标准双层冒泡，交换用三句整体赋值；print_all 在循环里判断“不是最后一个”就补一个 \", \"。main 里先打印 before: 再调用 print_all，排序后再打印 after:，最后用 group[0].name 输出第一名。",
      check: {
        include: ["stdio.h"],
        return0: true,
        require: {
          struct: "Student",
          array: true,
          loop: true,
          funcs: ["sort_by_score","print_all"]
        },
        calls: [["printf","after"]],
        minStatements: 10,
        message: "需要定义 struct Student、用结构体数组、自己写 sort_by_score 与 print_all 两个函数、使用循环，并打印 after 那一行。",
        ok: "结构体数组、按字段排序和整体交换都做对了。"
      },
      expectedOutput: "before: Ann 91, Bob 78, Cid 85, Dan 62, Eve 95\nafter: Eve 95, Ann 91, Cid 85, Bob 78, Dan 62\ntop = Eve",
      solution: "#include <stdio.h>\n"
        + "\n"
        + "struct Student {\n"
        + "    char name[12];\n"
        + "    int score;\n"
        + "};\n"
        + "\n"
        + "void sort_by_score(struct Student a[], int n) {\n"
        + "    int i, j;\n"
        + "    for (i = 0; i < n - 1; i++) {\n"
        + "        for (j = 0; j < n - 1 - i; j++) {\n"
        + "            if (a[j].score < a[j + 1].score) {\n"
        + "                struct Student tmp = a[j];\n"
        + "                a[j] = a[j + 1];\n"
        + "                a[j + 1] = tmp;\n"
        + "            }\n"
        + "        }\n"
        + "    }\n"
        + "}\n"
        + "\n"
        + "void print_all(struct Student a[], int n) {\n"
        + "    int i;\n"
        + "    for (i = 0; i < n; i++) {\n"
        + "        printf(\"%s %d\", a[i].name, a[i].score);\n"
        + "        if (i + 1 < n) {\n"
        + "            printf(\", \");\n"
        + "        }\n"
        + "    }\n"
        + "    printf(\"\\n\");\n"
        + "}\n"
        + "\n"
        + "int main(void) {\n"
        + "    struct Student group[5] = {\n"
        + "        {\"Ann\", 91},\n"
        + "        {\"Bob\", 78},\n"
        + "        {\"Cid\", 85},\n"
        + "        {\"Dan\", 62},\n"
        + "        {\"Eve\", 95}\n"
        + "    };\n"
        + "\n"
        + "    printf(\"before: \");\n"
        + "    print_all(group, 5);\n"
        + "\n"
        + "    sort_by_score(group, 5);\n"
        + "\n"
        + "    printf(\"after: \");\n"
        + "    print_all(group, 5);\n"
        + "    printf(\"top = %s\\n\", group[0].name);\n"
        + "    return 0;\n"
        + "}",
      mastery: [
        "能声明并初始化结构体数组，正确访问 a[i].field",
        "能按指定字段写出升降序排序，并说明交换整个元素的原因",
        "能写出符合 qsort 要求的比较函数"
      ]
    },
    {
      id: 46,
      title: "enum、union、typedef：三种自定义类型的分工",
      minutes: 18,
      gist: "一次看清 enum（有名字的常量）、union（共用内存）和 typedef（起别名）各自解决什么问题。",
      lesson: "C 给了我们三种“自己造类型”的工具，它们解决的是三个不同的问题，混在一起很容易记乱，分开看就很清楚。\n"
        + "enum 解决“用数字表示状态太难看”。写 if (state == 2) 时，过两天你自己都不记得 2 是什么。enum State { STATE_IDLE, STATE_RUN, STATE_DONE }; 之后就能写 if (state == STATE_RUN)，代码自解释。规则很简单：第一个常量默认是 0，后面依次加一；想指定就显式写 = 5。枚举常量本质上是编译期的整数常量，枚举变量在内存里通常就是一个 int（本机 4 字节）。要注意 C 不做范围检查：给枚举变量赋一个不在列表里的整数是允许的，编译器不会拦你，出错要自己防。\n"
        + "union 解决“同一块内存，按不同方式解释”。union Payload { int code; unsigned char bytes[4]; }; 里所有成员共用同一块内存，大小取最大的那个成员（还要满足对齐），所以这里 sizeof 是 4，而不是 4 + 4 = 8。同一时刻只应该写入一个成员、再读同一个成员。写完 int 去读 bytes 这种“类型双关”在 C 里是允许的，但结果是把那块内存的字节按新类型重新解释，具体看到什么取决于字节序：本机是小端，所以 code = 1 时 bytes 是 1 0 0 0。这类代码不可移植，只在确实需要看原始字节时用。\n"
        + "typedef 解决“类型名太长、太啰嗦”。typedef unsigned long ulong; 之后 ulong 就是它的别名。最有用的场景是给结构体起别名：typedef struct Student { int id; int score; } Student; 之后就能直接写 Student s;，不必每次写 struct Student。要记住 typedef 不创建新类型，只是别名，类型兼容性和原来完全一样；而且别名写在最后——上面那行里，中间的 Student 是结构体的标签，末尾的 Student 才是新别名。如果结构体没有标签（typedef struct { ... } Node;），那就只有 Node 这个名字，写 struct Node 会报错。\n"
        + "怎么读别人的代码：看到 enum 立刻把常量换算成数字（第一个是 0）；看到 union 先找“当前有效的是哪个成员”；看到 typedef 认准末尾那个名字才是新名字。",
      example: {
        code: "#include <stdio.h>\n"
          + "\n"
          + "typedef enum {\n"
          + "    ROLE_GUEST = 0,\n"
          + "    ROLE_MEMBER = 1,\n"
          + "    ROLE_ADMIN = 2\n"
          + "} Role;\n"
          + "\n"
          + "typedef struct {\n"
          + "    char code;\n"
          + "    Role role;\n"
          + "} User;\n"
          + "\n"
          + "typedef union {\n"
          + "    unsigned int code;\n"
          + "    unsigned char bytes[4];\n"
          + "} Word;\n"
          + "\n"
          + "int main(void) {\n"
          + "    User u = {'A', ROLE_ADMIN};\n"
          + "    Word w;\n"
          + "\n"
          + "    printf(\"role = %d\\n\", (int)u.role);\n"
          + "    printf(\"sizeof User = %d\\n\", (int)sizeof(User));\n"
          + "    printf(\"sizeof Word = %d\\n\", (int)sizeof(Word));\n"
          + "\n"
          + "    w.code = 1u;\n"
          + "    printf(\"bytes = %d %d %d %d\\n\", (int)w.bytes[0], (int)w.bytes[1],\n"
          + "           (int)w.bytes[2], (int)w.bytes[3]);\n"
          + "    return 0;\n"
          + "}",
        output: "role = 2\n"
          + "sizeof User = 8\n"
          + "sizeof Word = 4\n"
          + "bytes = 1 0 0 0",
        explain: "第 3～7 行定义枚举 Role，三个常量显式写成 0、1、2，方便对照。第 9～12 行用 typedef 给一个匿名结构体起名 User，里面放一个 char 和一个 Role，这样可以直接写 User u;。第 14～17 行定义 union Word：一个 unsigned int 和一个 4 字节的 unsigned char 数组共用内存。\n"
          + "main 里第 20 行用初始化列表创建 u = {'A', ROLE_ADMIN}，第 23 行打印 u.role，强转成 int 后用 %d 得到 2。第 24、25 行打印两个类型的大小：User 是 8（char 占 1 字节 + 3 字节填充 + 枚举 4 字节），Word 是 4（取最大成员）。\n"
          + "第 27 行把 w.code 设为 1，第 28、29 行改用 w.bytes 读同一块内存，输出 bytes = 1 0 0 0——这正是小端机器上整数 1 的字节排列。这段演示说明 union 的成员确实重叠在一起，也提醒你这种读法依赖机器字节序。"
      },
      pitfalls: [
        "`typedef struct { int v; } Node;` 之后写 `struct Node n;` → 报错，因为这种结构体没有标签，只有别名 Node 可以用；要写 Node n;。",
        "以为 union 的大小是成员大小之和：union { int i; char bytes[4]; } 是 4 而不是 8，成员是重叠的。",
        "写完一个成员去读另一个成员却当成可移植写法：结果依赖字节序和实现，换平台可能就不一样。",
        "以为枚举会自动做范围检查：`Role r = 99;` 编译器不会报错，语义错误要自己防。",
        "忘记枚举常量从 0 开始：`enum Color { RED, GREEN, BLUE };` 里 BLUE 是 2，不是 3。"
      ],
      takeaways: [
        "enum 给一组整数常量起名字，默认从 0 递增，存储上通常是 int",
        "union 的成员共用一块内存，大小取最大成员，写一个读另一个依赖字节序",
        "typedef 只是类型别名，不创建新类型；别名是声明里最后那个名字",
        "typedef struct {...} X; 之后不能用 struct X，因为没有标签"
      ],
      questions: [
        {
          q: "`typedef struct { int v; } Node;` 之后，下面哪种写法是错误的？",
          options: ["Node n;","Node *p;","struct Node n;","sizeof(Node)"],
          answer: 2,
          explain: "这种写法里的 struct 是匿名的，没有标签 Node，typedef 只是给类型起了别名，所以不存在 struct Node 这个名字。Node 就是这个结构体类型的别名，Node n;、Node *p;、sizeof(Node) 都合法。"
        },
        {
          q: "`union U { int i; char bytes[4]; };` 在 64 位 gcc 下 sizeof(union U) 通常是多少？",
          options: ["1","8","5","4"],
          answer: 3,
          explain: "union 的成员共用同一块内存，大小取最大成员并满足对齐：int 和 char[4] 都是 4 字节，所以是 4。1 是单个 char；5 是把成员大小相加（错误）；8 常见于结构体的对齐结果，对 union 不适用。"
        },
        {
          q: "关于枚举常量的取值，正确的说法是？",
          options: ["从 1 开始，依次加一","从 0 开始依次加一，也可以给某个常量显式赋值","必须给每个常量都写值","取值由编译器随机决定"],
          answer: 1,
          explain: "第一个没写值的枚举常量是 0，后面的依次递增；需要指定就写 = 5 这种形式，而且可以只给其中几个写。不写值完全合法，取值在编译期就确定了，不存在随机。"
        }
      ],
      passRatio: 0.8,
      mission: "用 typedef 定义三种类型并各用一次：\n"
        + "1) typedef enum State { STATE_IDLE = 0, STATE_RUN = 1, STATE_DONE = 2 } State;\n"
        + "2) typedef struct Task { int id; State state; } Task;\n"
        + "3) typedef union Payload { int code; unsigned char bytes[4]; } Payload;\n"
        + "main 里：Task t = {7, STATE_RUN};，Payload p;\n"
        + "依次输出四行（数值和格式都要一致）：\n"
        + "task 7 state 1\n"
        + "bytes 1 0 0 0\n"
        + "sizeof Task = 8\n"
        + "sizeof Payload = 4\n"
        + "其中第二行是把 p.code 设为 1 之后用 %d 逐个打印 p.bytes 的四个元素得到的。",
      starter: "#include <stdio.h>\n"
        + "\n"
        + "/* TODO: typedef enum State { STATE_IDLE, STATE_RUN, STATE_DONE } State; */\n"
        + "/* TODO: typedef struct Task { int id; State state; } Task; */\n"
        + "/* TODO: typedef union Payload { int code; unsigned char bytes[4]; } Payload; */\n"
        + "\n"
        + "int main(void) {\n"
        + "    /* TODO: Task t = {7, STATE_RUN}; 打印 task 7 state 1 */\n"
        + "    /* TODO: Payload p; p.code = 1; 用 %d 打印四个字节 */\n"
        + "    /* TODO: 打印 sizeof Task 和 sizeof Payload */\n"
        + "\n"
        + "    return 0;\n"
        + "}",
      hint: "三个 typedef 都写在 main 之前，注意每个最后的分号；枚举写不写 = 0/1/2 都可以，显式写更容易对照。打印字节时把 unsigned char 强转成 int 再交给 %d，避免格式符不匹配的警告。",
      check: {
        include: ["stdio.h"],
        return0: true,
        require: {
          typedef: true,
          enum: "State",
          struct: "Task",
          union: true
        },
        calls: [["printf","state"],["printf","bytes"],["printf","sizeof"]],
        minStatements: 6,
        message: "需要用 typedef 定义 enum State、struct Task、union Payload，并打印含 state、bytes、sizeof 的行。",
        ok: "三种自定义类型都用对了：枚举命名常量、union 共用内存、typedef 起别名。"
      },
      solution: "#include <stdio.h>\n"
        + "\n"
        + "typedef enum State {\n"
        + "    STATE_IDLE = 0,\n"
        + "    STATE_RUN = 1,\n"
        + "    STATE_DONE = 2\n"
        + "} State;\n"
        + "\n"
        + "typedef struct Task {\n"
        + "    int id;\n"
        + "    State state;\n"
        + "} Task;\n"
        + "\n"
        + "typedef union Payload {\n"
        + "    int code;\n"
        + "    unsigned char bytes[4];\n"
        + "} Payload;\n"
        + "\n"
        + "int main(void) {\n"
        + "    Task t = {7, STATE_RUN};\n"
        + "    Payload p;\n"
        + "\n"
        + "    printf(\"task %d state %d\\n\", t.id, (int)t.state);\n"
        + "\n"
        + "    p.code = 1;\n"
        + "    printf(\"bytes %d %d %d %d\\n\", (int)p.bytes[0], (int)p.bytes[1],\n"
        + "           (int)p.bytes[2], (int)p.bytes[3]);\n"
        + "\n"
        + "    printf(\"sizeof Task = %d\\n\", (int)sizeof(Task));\n"
        + "    printf(\"sizeof Payload = %d\\n\", (int)sizeof(Payload));\n"
        + "    return 0;\n"
        + "}",
      mastery: [
        "能用 enum 代替裸数字表示状态，并说清默认取值规则",
        "能用 union 让多个成员共用内存，并知道大小怎么算",
        "能用 typedef 给结构体起别名，并区分标签名与别名"
      ]
    },
    {
      id: 47,
      title: "位运算与位域：一个 unsigned 装下多个开关",
      minutes: 16,
      gist: "用 1u << n 定义标志位，用 |、&、~ 实现置位、测试和清位，并认识位域。",
      lesson: "程序里经常要表示一组互相独立、只有开/关两种状态的属性：文件权限（读、写、执行）、任务标记（已完成、已归档、已加星）。最自然的做法是用一个整数的不同二进制位来分别表示它们——一个 unsigned 就有 32 个开关。\n"
        + "约定是这样的：每个标志是“只有一位是 1”的数，用移位写出来最清楚：1u << 0 是 001，1u << 1 是 010，1u << 2 是 100（这里只画了低三位）。把它们按位或起来，就得到“同时打开几个开关”的集合：READ | WRITE 是 011，也就是 3。\n"
        + "四个动作要背下来：置位用 perm = perm | FLAG;（或 perm |= FLAG;），清位用 perm = perm & ~FLAG;，测试用 (perm & FLAG) != 0，翻转用 perm = perm ^ FLAG;。这里的 ~ 是按位取反：~FLAG 除了 FLAG 那一位是 0，其余全是 1，所以与原值相与就只清掉这一位，别的位不受影响。\n"
        + "两个容易翻车的地方。第一是把“测试”写成相等比较：if (perm == FLAG_READ) 只有在“恰好只有读权限、其它位全是 0”时才成立，正确写法是 if ((perm & FLAG_READ) != 0)。第二是优先级：C 里 == 的优先级高于 &，所以 perm & FLAG == 0 实际会被解析成 perm & (FLAG == 0)，意思完全变了——写字运算时把每个子表达式都用括号括起来，是最省心的习惯。另外，&& 是逻辑与、& 是按位与，两者不可混用。\n"
        + "最后认识一下位域（bit-field）：可以直接在结构体里声明“这个字段只占几位”，例如 struct PermBits { unsigned read : 1; unsigned write : 1; unsigned exec : 1; };。语法上像普通成员，但布局由实现决定：本机上一个位域结构体仍占 4 字节（一个 unsigned 存储单元），而且不能对位域成员取地址（&s.read 不合法）。它适合和硬件寄存器、协议格式打交道；日常用 unsigned 加移位更直观。",
      example: {
        code: "#include <stdio.h>\n"
          + "\n"
          + "/* 每个标志占一个二进制位，互不干扰 */\n"
          + "enum {\n"
          + "    FLAG_READ = 1 << 0,   /* 001 */\n"
          + "    FLAG_WRITE = 1 << 1,  /* 010 */\n"
          + "    FLAG_EXEC = 1 << 2    /* 100 */\n"
          + "};\n"
          + "\n"
          + "/* 位域：把三个 1 位的字段放进一个 unsigned 里 */\n"
          + "struct PermBits {\n"
          + "    unsigned read : 1;\n"
          + "    unsigned write : 1;\n"
          + "    unsigned exec : 1;\n"
          + "};\n"
          + "\n"
          + "static void show(unsigned perm) {\n"
          + "    printf(\"%d %d %d\\n\",\n"
          + "           (perm & FLAG_READ) ? 1 : 0,\n"
          + "           (perm & FLAG_WRITE) ? 1 : 0,\n"
          + "           (perm & FLAG_EXEC) ? 1 : 0);\n"
          + "}\n"
          + "\n"
          + "int main(void) {\n"
          + "    unsigned perm = FLAG_READ | FLAG_WRITE;\n"
          + "\n"
          + "    show(perm);\n"
          + "\n"
          + "    perm = perm | FLAG_EXEC;      /* 打开执行位 */\n"
          + "    show(perm);\n"
          + "\n"
          + "    perm = perm & ~FLAG_WRITE;    /* 关掉写位 */\n"
          + "    show(perm);\n"
          + "\n"
          + "    printf(\"read on = %d\\n\", (perm & FLAG_READ) != 0);\n"
          + "    printf(\"sizeof PermBits = %d\\n\", (int)sizeof(struct PermBits));\n"
          + "    return 0;\n"
          + "}",
        output: "1 1 0\n"
          + "1 1 1\n"
          + "1 0 1\n"
          + "read on = 1\n"
          + "sizeof PermBits = 4",
        explain: "第 4～8 行用匿名 enum 定义三个标志，值分别是 1 << 0、1 << 1、1 << 2；注释里画出低三位，方便对照。第 11～15 行的 struct PermBits 用位域把三个 1 位字段放进一个 unsigned 存储单元。\n"
          + "第 17～22 行的 show 函数是本关的检查器：它用 (perm & FLAG) ? 1 : 0 把每个位的状态变成 0 或 1 打印出来，三个一组。main 里第 25 行用 READ | WRITE 组合出初始权限 011，第 27 行打印 1 1 0。\n"
          + "第 29 行 perm = perm | FLAG_EXEC 打开执行位，打印 1 1 1；第 32 行 perm = perm & ~FLAG_WRITE 清掉写位，打印 1 0 1。第 35 行演示“测试某一位”的标准写法：判断 (perm & FLAG_READ) != 0 得到 1。第 36 行打印位域结构体的大小，结果是 4——三个 1 位字段仍然占一个 unsigned 单元，说明位域并不意味着“一定只占 3 个二进制位”。"
      },
      pitfalls: [
        "用 `perm == FLAG_READ` 测试某位 → 只有当恰好只剩这一位时才成立，正确写法是 (perm & FLAG_READ) != 0。",
        "忽略优先级：`perm & FLAG == 0` 实际是 perm & (FLAG == 0)，结果几乎总是错的；把子表达式都加括号。",
        "把 `&&` 和 `&` 混用：前者是逻辑与（只判断真假），后者才是按位与。",
        "清位时写成 `perm & ~FLAG` 却忘了赋值回去：表达式算完没有副作用，perm 一点没变；要写 perm = perm & ~FLAG; 或 perm &= ~FLAG;。",
        "对位域成员取地址：`&s.read` 非法，位域不是独立可寻址的对象。",
        "以为位域结构体一定很小：本机上是 4 字节，布局由实现决定，不要用它做二进制格式的固定假设。"
      ],
      takeaways: [
        "每个标志用 1u << n 定义，用 | 组合，用 & 测试，用 & ~ 清位",
        "测试位要写 (perm & FLAG) != 0，不能和 == 混用",
        "位运算优先级低于 ==，写的时候一律加括号",
        "位域语法上像字段，但不能取地址，布局由实现决定"
      ],
      questions: [
        {
          q: "定义 READ = 1u << 0、WRITE = 1u << 1，执行 `unsigned perm = READ | WRITE;` 之后 perm 的值是多少？",
          options: ["1","2","3","4"],
          answer: 2,
          explain: "1u << 0 是二进制的 001，1u << 1 是 010，按位或得到 011，也就是 3。1 和 2 分别只是单个标志，4 是 1u << 2 的值。"
        },
        {
          q: "要判断 perm 里是否设置了 WRITE 位，正确的写法是？",
          options: [
            "if (perm == WRITE)",
            "if (perm & WRITE)",
            "if (perm && WRITE)",
            "if (perm ^ WRITE)"
          ],
          answer: 1,
          explain: "perm & WRITE 只有在该位为 1 时才得到非 0，正好当条件用。== 只在“恰好只有 WRITE 这一位”时才成立；&& 是逻辑与，两个非 0 就为真，判断不出具体是哪一位；^ 是异或：它把这一位「翻转」而不是「取出」，结果里还混着其它位（例如 perm=3、WRITE=2 时 3^2=1，结果非 0），当条件用根本分不清这一位到底是不是 1。"
        },
        {
          q: "想清掉 perm 里的 WRITE 位、其它位保持不变，应该写？",
          options: [
            "perm = perm & WRITE;",
            "perm = perm | ~WRITE;",
            "perm = perm ^ ~WRITE;",
            "perm = perm & ~WRITE;"
          ],
          answer: 3,
          explain: "~WRITE 只有 WRITE 那一位是 0，与 perm 相与正好清掉这一位、保留其它位。perm & WRITE 是只留下这一位（效果相反）；| ~WRITE 会把除了这一位以外的所有位置成 1；^ ~WRITE 不是标准的清位写法。"
        }
      ],
      passRatio: 0.8,
      mission: "在 main 里用一个 unsigned 管理三个权限位：\n"
        + "1) 用 1u << 0、1u << 1、1u << 2 定义 READ、WRITE、EXEC 三个标志；\n"
        + "2) unsigned perm = READ | WRITE;，然后按“读 写 执行”的顺序用 %d 打印三个位，得到 1 1 0；\n"
        + "3) 用 | 打开 EXEC 位，再打印一次，得到 1 1 1；\n"
        + "4) 用 & ~WRITE 关掉 WRITE 位，再打印一次，得到 1 0 1；\n"
        + "5) 用 if 判断 READ 位是否还在（(perm & READ) != 0），在成立时打印 read on。\n"
        + "四次输出依次是：\n"
        + "1 1 0\n"
        + "1 1 1\n"
        + "1 0 1\n"
        + "read on",
      starter: "#include <stdio.h>\n"
        + "\n"
        + "int main(void) {\n"
        + "    /* TODO: 用 1u << 0、1u << 1、1u << 2 定义 READ、WRITE、EXEC 三个标志 */\n"
        + "    /* TODO: unsigned perm = READ | WRITE; 打印三个位（0/1，空格分隔） */\n"
        + "    /* TODO: 用 | 打开 EXEC 位，再打印一次 */\n"
        + "    /* TODO: 用 & ~WRITE 关掉 WRITE 位，再打印一次 */\n"
        + "    /* TODO: 用 if 判断 READ 位是否还在，打印 read on */\n"
        + "\n"
        + "    return 0;\n"
        + "}",
      hint: "三个标志写在 main 里：const unsigned READ = 1u << 0; 依此类推。每个位用 (perm & READ) ? 1 : 0 打印，三个一起放进一条 printf 的 %d %d %d。清位那一句别忘了把结果赋回 perm。",
      check: {
        include: ["stdio.h"],
        return0: true,
        seq: [["<<","0"],["|"]],
        require: {
          if: true
        },
        calls: [["printf"]],
        minStatements: 8,
        message: "需要用 1u << n 定义标志、用 | 置位、用 & ~ 清位、用 if 判断某一位，并打印 %d %d %d 形式的位状态。",
        ok: "标志的定义、置位、清位和判断位都用对了。"
      },
      expectedOutput: "1 1 0\n1 1 1\n1 0 1\nread on",
      solution: "#include <stdio.h>\n"
        + "\n"
        + "int main(void) {\n"
        + "    const unsigned READ = 1u << 0;\n"
        + "    const unsigned WRITE = 1u << 1;\n"
        + "    const unsigned EXEC = 1u << 2;\n"
        + "    unsigned perm = READ | WRITE;\n"
        + "\n"
        + "    printf(\"%d %d %d\\n\", (perm & READ) ? 1 : 0, (perm & WRITE) ? 1 : 0,\n"
        + "           (perm & EXEC) ? 1 : 0);\n"
        + "\n"
        + "    perm = perm | EXEC;\n"
        + "    printf(\"%d %d %d\\n\", (perm & READ) ? 1 : 0, (perm & WRITE) ? 1 : 0,\n"
        + "           (perm & EXEC) ? 1 : 0);\n"
        + "\n"
        + "    perm = perm & ~WRITE;\n"
        + "    printf(\"%d %d %d\\n\", (perm & READ) ? 1 : 0, (perm & WRITE) ? 1 : 0,\n"
        + "           (perm & EXEC) ? 1 : 0);\n"
        + "\n"
        + "    if ((perm & READ) != 0) {\n"
        + "        printf(\"read on\\n\");\n"
        + "    }\n"
        + "    return 0;\n"
        + "}",
      mastery: [
        "能用移位定义标志位，并用 |、&、~ 完成置位、测试、清位",
        "能一眼看出 perm & FLAG == 0 这类优先级错误",
        "能说清位域和手动位运算各自的适用场景"
      ]
    },
    {
      id: 48,
      title: "单链表：用 malloc 把节点串起来",
      minutes: 30,
      gist: "从零实现单链表：头插、尾插、遍历、删除节点，并保证每一块内存都被释放。",
      lesson: "数组的短板在“插入和删除”：往中间塞一个元素，后面的全都要往后挪；而且容量写死在声明里。链表换了个思路：每个元素单独申请一小块内存（一个节点），节点里除了数据，再存一个指向下一个节点的指针。这样插入删除只改指针，容量也能按需增长。\n"
        + "节点的类型是“自引用结构体”：\n"
        + "struct Node {\n"
        + "    int value;\n"
        + "    struct Node *next;\n"
        + "};\n"
        + "注意 next 的类型必须写全 struct Node *，不能只写 Node *——因为这时结构体还没定义完，typedef 别名（如果有）也还没生效，编译器还不认识 Node 这个名字。\n"
        + "整条链表用“头指针”代表：struct Node *head = NULL; 里 NULL 表示空链表。遍历的固定写法是 for (p = head; p != NULL; p = p->next)，只要指针不为空就往下走。\n"
        + "两种插入要分清。头插最简单：新节点的 next 指向当前 head，再让 head 指向新节点，代价与链表长度无关（O(1)）。尾插要么从头走到最后一个节点（O(n)），要么额外维护一个 tail 指针（O(1)）。尾插时千万别忘了把新节点的 next 设为 NULL，否则遍历会一直走下去。\n"
        + "删除要小心“前驱”和顺序。找到目标节点后，把前驱的 next 改成当前节点的 next，然后 free 掉当前节点。如果删的是头节点，没有前驱，所以要更新 head——这也是为什么删除函数通常返回新的头指针（另一条路是传 struct Node **）。释放内存时的经典错误是先 free 再读 p->next：那块内存已经还回去了，不能再访问。正确顺序是先把 next = p->next 存下来，再 free(p)，最后 p = next。\n"
        + "最后是两条不可妥协的纪律：malloc 可能失败并返回 NULL，必须检查；所有申请过的节点最终都要 free，否则就是内存泄漏。",
      example: {
        code: "#include <stdio.h>\n"
          + "#include <stdlib.h>\n"
          + "\n"
          + "struct Node {\n"
          + "    int value;\n"
          + "    struct Node *next;\n"
          + "};\n"
          + "\n"
          + "/* 尾插：走到最后一个节点再接上新节点，返回头指针 */\n"
          + "struct Node *push_back(struct Node *head, int v) {\n"
          + "    struct Node *node = malloc(sizeof(struct Node));\n"
          + "    struct Node *p;\n"
          + "    if (node == NULL) {\n"
          + "        return head;\n"
          + "    }\n"
          + "    node->value = v;\n"
          + "    node->next = NULL;\n"
          + "    if (head == NULL) {\n"
          + "        return node;\n"
          + "    }\n"
          + "    for (p = head; p->next != NULL; p = p->next) {\n"
          + "        /* 一直走到最后一个节点 */\n"
          + "    }\n"
          + "    p->next = node;\n"
          + "    return head;\n"
          + "}\n"
          + "\n"
          + "/* 头插：新节点成为新的头，返回新头指针 */\n"
          + "struct Node *push_front(struct Node *head, int v) {\n"
          + "    struct Node *node = malloc(sizeof(struct Node));\n"
          + "    if (node == NULL) {\n"
          + "        return head;\n"
          + "    }\n"
          + "    node->value = v;\n"
          + "    node->next = head;\n"
          + "    return node;\n"
          + "}\n"
          + "\n"
          + "/* 删除第一个值为 v 的节点，释放它，返回新的头指针 */\n"
          + "struct Node *delete_value(struct Node *head, int v) {\n"
          + "    struct Node *cur = head;\n"
          + "    struct Node *prev = NULL;\n"
          + "    while (cur != NULL) {\n"
          + "        if (cur->value == v) {\n"
          + "            if (prev == NULL) {\n"
          + "                head = cur->next;\n"
          + "            } else {\n"
          + "                prev->next = cur->next;\n"
          + "            }\n"
          + "            free(cur);\n"
          + "            return head;\n"
          + "        }\n"
          + "        prev = cur;\n"
          + "        cur = cur->next;\n"
          + "    }\n"
          + "    return head;\n"
          + "}\n"
          + "\n"
          + "void print_list(struct Node *head) {\n"
          + "    struct Node *p;\n"
          + "    for (p = head; p != NULL; p = p->next) {\n"
          + "        printf(\"%d\", p->value);\n"
          + "        if (p->next != NULL) {\n"
          + "            printf(\" -> \");\n"
          + "        }\n"
          + "    }\n"
          + "    printf(\"\\n\");\n"
          + "}\n"
          + "\n"
          + "void free_list(struct Node *head) {\n"
          + "    while (head != NULL) {\n"
          + "        struct Node *next = head->next;\n"
          + "        free(head);\n"
          + "        head = next;\n"
          + "    }\n"
          + "}\n"
          + "\n"
          + "int main(void) {\n"
          + "    struct Node *head = NULL;\n"
          + "\n"
          + "    head = push_back(head, 1);\n"
          + "    head = push_back(head, 2);\n"
          + "    head = push_back(head, 3);\n"
          + "    printf(\"built: \");\n"
          + "    print_list(head);\n"
          + "\n"
          + "    head = delete_value(head, 2);\n"
          + "    printf(\"after delete 2: \");\n"
          + "    print_list(head);\n"
          + "\n"
          + "    head = push_front(head, 0);\n"
          + "    printf(\"after push_front 0: \");\n"
          + "    print_list(head);\n"
          + "\n"
          + "    free_list(head);\n"
          + "    return 0;\n"
          + "}",
        output: "built: 1 -> 2 -> 3\n"
          + "after delete 2: 1 -> 3\n"
          + "after push_front 0: 0 -> 1 -> 3",
        explain: "第 4～7 行定义 struct Node，next 用完整的 struct Node *。第 10～26 行是尾插 push_back：先 malloc 一个节点，失败就直接返回原来的头（不破坏链表），否则填好 value、把 next 置 NULL；如果原来链表为空，新节点就是头；否则用 for 循环走到最后一个节点，把它的 next 接上新节点。\n"
          + "第 29～37 行的头插 push_front 只有三行有效逻辑：新节点 next 指向旧头，返回新节点当新头。第 40～57 行的 delete_value 用 cur/prev 两个指针找目标：找到后分两种情况——删头就改 head，删中间就把 prev->next 指向 cur->next，然后 free(cur) 并返回新的头指针。\n"
          + "第 59～68 行的 print_list 用标准遍历打印，非末尾加 \" -> \"；第 70～76 行的 free_list 每次先取出 next 再 free 当前节点，避免使用已释放的内存。\n"
          + "main 里第 81～83 行用三次 push_back 建出 1 -> 2 -> 3；第 87 行删除值为 2 的节点，得到 1 -> 3；第 91 行头插 0，得到 0 -> 1 -> 3；最后第 95 行 free_list 把整条链表还回去。"
      },
      pitfalls: [
        "节点里的 next 写成 `Node *next;` → 报错，因为在结构体定义过程中还没有 Node 这个名字；要写 struct Node *next;。",
        "尾插时忘记把新节点的 next 设为 NULL → 遍历会读到不确定的地址，程序崩溃或输出乱码。",
        "先 free 再取 next：`free(p); p = p->next;` 是在用已释放的内存，行为未定义；要先把 next 存起来。",
        "删除头节点后没有更新 head → 链表看起来还在，但头已经指向被释放的内存。",
        "malloc 返回值不检查：内存不足时返回 NULL，直接 p->value = 1 会崩溃。",
        "整条链表用完不释放 → 内存泄漏；链表越长泄漏越多，长期运行的程序会被拖垮。",
        "打印链表时用 `while (p->next != NULL)` 而不是 `p != NULL` → 最后一个节点不会被打印。"
      ],
      takeaways: [
        "节点是自引用结构体，next 必须写成 struct Node *",
        "head 代表整条链表，NULL 表示空表；遍历用 p = head; p != NULL; p = p->next",
        "头插 O(1)，尾插 O(n)（除非维护尾指针）；插入时新节点的 next 要接对、尾节点要置 NULL",
        "删除要处理前驱和头节点两种情况；free 之前先保存 next；malloc 失败要处理"
      ],
      questions: [
        {
          q: "在 `struct Node { int value; struct Node *next; };` 里，next 为什么必须写成 `struct Node *`，不能只写 `Node *`？",
          options: [
            "因为结构体定义还没结束，此时还没有 Node 这个名字可用",
            "因为指针只能用 struct 关键字声明",
            "因为写成 Node * 会被当成 int 指针",
            "因为 struct Node * 占用的内存更少"
          ],
          answer: 0,
          explain: "结构体定义进行到一半，typedef 别名（如果以后加了）也还没生效，所以只能用 struct Node * 这种完整形式。指针用不用 struct 与内存占用无关；Node * 在 C 里会被当成未知类型名而报错。"
        },
        {
          q: "释放整条链表时，下面哪种循环写法是正确的？",
          options: [
            "free(p); p = p->next;",
            "先 next = p->next; 再 free(p); 最后 p = next;",
            "free(head) 之后整条链表会自动全部释放",
            "只 free 最后一个节点就够了"
          ],
          answer: 1,
          explain: "free(p) 之后那块内存不能再访问，p->next 也就读不得了，所以必须先保存 next。free 只释放你交给它的那一个内存块，不会级联释放整条链表；只释放尾节点会泄漏其余所有节点。"
        },
        {
          q: "在一个只有头指针的单链表头部插入一个节点，时间复杂度是多少？",
          options: ["O(1)","O(log n)","O(n)","O(n²)"],
          answer: 0,
          explain: "头插只需要新节点的 next 指向原来的 head，再更新 head，与链表长度无关。O(n) 是“只有头指针时做尾插”的代价（要先走到底）；O(log n) 和 O(n²) 都不符合链表插入的实际情况。"
        }
      ],
      passRatio: 0.8,
      mission: "自己实现一条单链表（数据结构 + 四个函数 + 用完释放）：\n"
        + "1) 定义 struct Node { int value; struct Node *next; };\n"
        + "2) struct Node *push_back(struct Node *head, int v); 尾插，返回新的头指针（malloc 失败要处理）；\n"
        + "3) void print_list(struct Node *head); 先打印 \"list:\"，再依次打印每个值（每个值前面一个空格），最后换行；\n"
        + "4) struct Node *delete_value(struct Node *head, int v); 删除第一个值为 v 的节点并 free 它，返回新的头指针；\n"
        + "5) void free_list(struct Node *head); 释放整条链表；\n"
        + "main 里：用 push_back 依次加入 3、1、4、1、5，然后 delete_value(head, 1) 删掉第一个 1，打印链表，再打印 count = 4，最后释放全部内存。\n"
        + "运行结果应有两行：\n"
        + "list: 3 4 1 5\n"
        + "count = 4",
      starter: "#include <stdio.h>\n"
        + "#include <stdlib.h>\n"
        + "\n"
        + "struct Node {\n"
        + "    int value;\n"
        + "    struct Node *next;\n"
        + "};\n"
        + "\n"
        + "/* TODO: push_back：尾插，返回新的头指针（malloc 失败要处理） */\n"
        + "/* TODO: print_list：打印 \"list:\" 加上每个值（空格分隔）后换行 */\n"
        + "/* TODO: delete_value：删除第一个值为 v 的节点并 free，返回新的头指针 */\n"
        + "/* TODO: free_list：释放整条链表 */\n"
        + "\n"
        + "int main(void) {\n"
        + "    struct Node *head = NULL;\n"
        + "\n"
        + "    /* TODO: 用 push_back 依次加入 3、1、4、1、5 */\n"
        + "    /* TODO: delete_value(head, 1)，打印链表和 count = 4 */\n"
        + "    /* TODO: free_list(head) */\n"
        + "\n"
        + "    return 0;\n"
        + "}",
      hint: "尾插分三步：申请节点、填值并把 next 置 NULL、接到尾部（空表时直接当头）。删除时用 cur 和 prev 两个指针走，删头要改 head，删中间改 prev->next；记得 free(cur)。释放循环里一定先把 next 存下来。",
      check: {
        include: ["stdio.h","stdlib.h"],
        return0: true,
        require: {
          struct: "Node",
          pointer: true,
          malloc: true,
          free: true,
          loop: true,
          funcs: ["push_back","print_list","delete_value","free_list"]
        },
        calls: [["printf","count"]],
        minStatements: 12,
        message: "需要定义 struct Node、自己写 push_back / print_list / delete_value / free_list 四个函数、用 malloc 申请节点并用 free 释放，并在 main 里打印 count 一行。",
        ok: "链表的建立、遍历、删除和内存释放都完整了。"
      },
      solution: "#include <stdio.h>\n"
        + "#include <stdlib.h>\n"
        + "\n"
        + "struct Node {\n"
        + "    int value;\n"
        + "    struct Node *next;\n"
        + "};\n"
        + "\n"
        + "struct Node *push_back(struct Node *head, int v) {\n"
        + "    struct Node *node = malloc(sizeof(struct Node));\n"
        + "    struct Node *p;\n"
        + "    if (node == NULL) {\n"
        + "        return head;\n"
        + "    }\n"
        + "    node->value = v;\n"
        + "    node->next = NULL;\n"
        + "    if (head == NULL) {\n"
        + "        return node;\n"
        + "    }\n"
        + "    for (p = head; p->next != NULL; p = p->next) {\n"
        + "        /* 走到最后一个节点 */\n"
        + "    }\n"
        + "    p->next = node;\n"
        + "    return head;\n"
        + "}\n"
        + "\n"
        + "struct Node *delete_value(struct Node *head, int v) {\n"
        + "    struct Node *cur = head;\n"
        + "    struct Node *prev = NULL;\n"
        + "    while (cur != NULL) {\n"
        + "        if (cur->value == v) {\n"
        + "            if (prev == NULL) {\n"
        + "                head = cur->next;\n"
        + "            } else {\n"
        + "                prev->next = cur->next;\n"
        + "            }\n"
        + "            free(cur);\n"
        + "            return head;\n"
        + "        }\n"
        + "        prev = cur;\n"
        + "        cur = cur->next;\n"
        + "    }\n"
        + "    return head;\n"
        + "}\n"
        + "\n"
        + "void print_list(struct Node *head) {\n"
        + "    struct Node *p;\n"
        + "    printf(\"list:\");\n"
        + "    for (p = head; p != NULL; p = p->next) {\n"
        + "        printf(\" %d\", p->value);\n"
        + "    }\n"
        + "    printf(\"\\n\");\n"
        + "}\n"
        + "\n"
        + "void free_list(struct Node *head) {\n"
        + "    while (head != NULL) {\n"
        + "        struct Node *next = head->next;\n"
        + "        free(head);\n"
        + "        head = next;\n"
        + "    }\n"
        + "}\n"
        + "\n"
        + "int main(void) {\n"
        + "    struct Node *head = NULL;\n"
        + "\n"
        + "    head = push_back(head, 3);\n"
        + "    head = push_back(head, 1);\n"
        + "    head = push_back(head, 4);\n"
        + "    head = push_back(head, 1);\n"
        + "    head = push_back(head, 5);\n"
        + "\n"
        + "    head = delete_value(head, 1);\n"
        + "    print_list(head);\n"
        + "    int count = 0;\n"
        + "    struct Node *q;\n"
        + "    for (q = head; q != NULL; q = q->next) {\n"
        + "        count++;\n"
        + "    }\n"
        + "    printf(\"count = %d\\n\", count);\n"
        + "\n"
        + "    free_list(head);\n"
        + "    return 0;\n"
        + "}",
      mastery: [
        "能独立写出自引用结构体并解释为什么必须写 struct Node *",
        "能实现头插、尾插、遍历和按值删除，并正确处理头节点与前驱",
        "能在释放链表时避免使用已释放的内存，不漏 free"
      ]
    },
    {
      id: 49,
      title: "栈与队列：数组实现和链表实现怎么选",
      minutes: 25,
      gist: "分别用数组实现栈、用链表实现队列，并学会按场景在两种实现之间做取舍。",
      lesson: "栈和队列是两种“受限的线性表”，限制在哪里，决定了它们适合解决什么问题。\n"
        + "栈是后进先出（LIFO）：只能在同一端进出，像一摞盘子。它的两个动作叫 push（压入）和 pop（弹出）。数组实现最省事：用一个 int data[N] 存数据，再用一个 int top 记住“下一个空位”。那么 push 就是 data[top] = v; top++;，pop 就是 top--; 再取 data[top]。判空是 top == 0，判满是 top >= N。注意顺序：push 必须先判满，pop 必须先判空——空栈时 top 是 0，先自减会变成 -1，data[-1] 是数组越界，属于未定义行为，可能读到垃圾值也可能直接崩溃。\n"
        + "队列是先进先出（FIFO）：从尾部入队，从头部出队，像排队买票。数组实现要对付“假溢出”：不断出队后头部会空出一片空间，但尾部已经到底。标准解法是把它做成循环队列，用 (head + 1) % N 和 (tail + 1) % N 让下标绕回来，代价是多写几行取模。链表实现则天然没有这个问题：入队在尾节点后面接一个 malloc 出来的节点，出队把 head 后移并 free 掉旧的头节点，不需要搬移任何数据。\n"
        + "到底怎么选？数组（或动态数组）的优势是内存连续、访问快、没有 malloc 失败的风险、行为可预测；缺点是容量要事先定好（或者自己写扩容逻辑）。链表的优势是容量按需增长、头尾插入删除都是 O(1)、不需要预估规模；代价是每个节点一次 malloc（慢且可能失败）、额外的指针开销、节点分散在堆上导致缓存命中率低、还要自己保证全部 free。\n"
        + "工程上的经验是：绝大多数场景先用数组，容量确实不可预测、或者频繁在两端插删时再上链表。写代码时也别追求“一步到位的最优结构”，先用最简单能跑通的实现，再根据真实瓶颈去换。\n"
        + "怎么读别人的代码：看到 struct Stack { int data[N]; int top; } 就知道容量是固定的、要判满；看到 head/tail 两个指针的节点结构就知道是链式队列，出队位置要 free。",
      example: {
        code: "#include <stdio.h>\n"
          + "#include <stdlib.h>\n"
          + "\n"
          + "#define STACK_MAX 8\n"
          + "\n"
          + "/* 数组栈：容量固定，top 是下一个空位 */\n"
          + "struct Stack {\n"
          + "    int data[STACK_MAX];\n"
          + "    int top;\n"
          + "};\n"
          + "\n"
          + "void stack_init(struct Stack *s) {\n"
          + "    s->top = 0;\n"
          + "}\n"
          + "\n"
          + "int stack_push(struct Stack *s, int v) {\n"
          + "    if (s->top >= STACK_MAX) {\n"
          + "        return 0;\n"
          + "    }\n"
          + "    s->data[s->top] = v;\n"
          + "    s->top++;\n"
          + "    return 1;\n"
          + "}\n"
          + "\n"
          + "int stack_pop(struct Stack *s, int *out) {\n"
          + "    if (s->top == 0) {\n"
          + "        return 0;\n"
          + "    }\n"
          + "    s->top--;\n"
          + "    *out = s->data[s->top];\n"
          + "    return 1;\n"
          + "}\n"
          + "\n"
          + "/* 链式队列：head 出队，tail 入队 */\n"
          + "struct QNode {\n"
          + "    int value;\n"
          + "    struct QNode *next;\n"
          + "};\n"
          + "\n"
          + "struct Queue {\n"
          + "    struct QNode *head;\n"
          + "    struct QNode *tail;\n"
          + "};\n"
          + "\n"
          + "void queue_init(struct Queue *q) {\n"
          + "    q->head = NULL;\n"
          + "    q->tail = NULL;\n"
          + "}\n"
          + "\n"
          + "int queue_push(struct Queue *q, int v) {\n"
          + "    struct QNode *node = malloc(sizeof(struct QNode));\n"
          + "    if (node == NULL) {\n"
          + "        return 0;\n"
          + "    }\n"
          + "    node->value = v;\n"
          + "    node->next = NULL;\n"
          + "    if (q->tail == NULL) {\n"
          + "        q->head = node;\n"
          + "    } else {\n"
          + "        q->tail->next = node;\n"
          + "    }\n"
          + "    q->tail = node;\n"
          + "    return 1;\n"
          + "}\n"
          + "\n"
          + "int queue_pop(struct Queue *q, int *out) {\n"
          + "    struct QNode *node = q->head;\n"
          + "    if (node == NULL) {\n"
          + "        return 0;\n"
          + "    }\n"
          + "    *out = node->value;\n"
          + "    q->head = node->next;\n"
          + "    if (q->head == NULL) {\n"
          + "        q->tail = NULL;\n"
          + "    }\n"
          + "    free(node);\n"
          + "    return 1;\n"
          + "}\n"
          + "\n"
          + "void queue_free(struct Queue *q) {\n"
          + "    int v;\n"
          + "    while (queue_pop(q, &v)) {\n"
          + "        /* 全部出队并释放 */\n"
          + "    }\n"
          + "}\n"
          + "\n"
          + "int main(void) {\n"
          + "    struct Stack s;\n"
          + "    struct Queue q;\n"
          + "    int v = 0;\n"
          + "    int i;\n"
          + "\n"
          + "    stack_init(&s);\n"
          + "    for (i = 1; i <= 4; i++) {\n"
          + "        stack_push(&s, i * 10);\n"
          + "    }\n"
          + "    printf(\"stack pop:\");\n"
          + "    while (stack_pop(&s, &v)) {\n"
          + "        printf(\" %d\", v);\n"
          + "    }\n"
          + "    printf(\"\\n\");\n"
          + "\n"
          + "    queue_init(&q);\n"
          + "    for (i = 1; i <= 4; i++) {\n"
          + "        queue_push(&q, i * 10);\n"
          + "    }\n"
          + "    printf(\"queue pop:\");\n"
          + "    while (queue_pop(&q, &v)) {\n"
          + "        printf(\" %d\", v);\n"
          + "    }\n"
          + "    printf(\"\\n\");\n"
          + "\n"
          + "    queue_free(&q);\n"
          + "    return 0;\n"
          + "}",
        output: "stack pop: 40 30 20 10\n"
          + "queue pop: 10 20 30 40",
        explain: "第 4 行用 #define 定下容量 8，第 7～10 行是数组栈：data 存元素、top 表示下一个空位。stack_init 把 top 置 0；stack_push 先判满（top >= STACK_MAX 返回 0），再存值并让 top 加一；stack_pop 先判空（top == 0 返回 0），再让 top 减一，把 data[top] 写到 *out。两个函数都用返回 1/0 表示成功与失败，这样调用者能知道操作是否有效。\n"
          + "第 35～43 行是链式队列的节点和结构体，Queue 里保存 head（出队端）和 tail（入队端）。queue_push 申请节点接到尾部并更新 tail；queue_pop 取出头节点的值、把 head 后移、必要时把 tail 也置空，然后 free 掉头节点——这正是队列“先进先出”的实现方式。queue_free 反复出队直到空，把所有节点都释放掉。\n"
          + "main 里第 93～96 行先给栈压入 10、20、30、40，第 97～101 行连续弹出，输出 40 30 20 10，这就是后进先出；第 103～111 行给队列依次入队 10、20、30、40，再一次次出队，输出 10 20 30 40，这是先进先出。两个结构用同一组数据，输出的顺序正好相反，这个对比最能说明栈与队列的差别。"
      },
      pitfalls: [
        "空栈直接 pop：写成 `*out = data[--top];` 会让 top 变成 -1，data[-1] 越界；必须先判断 top == 0。",
        "数组栈不判满：top 超过数组长度后继续写，越界写入会破坏别的变量（甚至崩溃）。",
        "把 top 的含义搞混：本关约定 top 是“下一个空位”，所以 push 先存后加、pop 先减后取；如果改成“栈顶下标”，空栈必须用 -1 表示，两套约定不能混用。",
        "链式队列出队时忘记 free 节点 → 每出队一次泄漏一个节点，长时间运行内存持续上涨。",
        "出队后没有维护 tail：队列空了 head 是 NULL 而 tail 还指着已释放的节点，下次入队就会接到野指针上。",
        "把普通数组队列当成循环队列用，出队后不搬移数据 → 头部空间浪费，很快出现“明明没满却放不进去”的假溢出。"
      ],
      takeaways: [
        "栈是后进先出，队列是先进先出；两者的差别只在“从哪一端进出”",
        "数组实现必须判满和判空，且判空要在自减之前",
        "链式实现按需申请节点，但要保证每次出队都 free，并维护好尾指针",
        "容量确定、追求速度用数组；容量不可预测、频繁两端插删用链表"
      ],
      questions: [
        {
          q: "为什么链表实现通常不需要“判满”？",
          options: [
            "因为链表不占用内存",
            "因为每个节点单独申请内存，容量随 malloc 成功与否增长，检查点是申请是否成功",
            "因为链表节点都分配在栈上，不受容量限制",
            "因为链表最多只能放 100 个元素"
          ],
          answer: 1,
          explain: "链表按需为每个节点 malloc，容量由可用内存决定，所以检查的是“申请是否成功（返回值是否为 NULL）”，而不是“数组是否满了”。链表当然要占内存，节点在堆上而不是栈上，长度也没有 100 这种硬上限。"
        },
        {
          q: "数组栈在空的时候执行 pop，为什么必须先判断 `top == 0`？",
          options: [
            "因为不判断会写到 data[-1]，造成数组越界",
            "因为 C 会自动抛出异常",
            "因为 top 是只读变量，不能自减",
            "因为 pop 函数规定必须返回 0"
          ],
          answer: 0,
          explain: "先自减再取值时，top 从 0 变成 -1，data[-1] 是数组越界访问，属于未定义行为（可能读到垃圾值，也可能崩溃）。C 没有异常机制；top 是普通变量，可以在函数里修改；返回 0 只是本课约定的失败表示，不是语言要求。"
        },
        {
          q: "同样存放 1000 个 int，链表实现相比数组实现的典型缺点是什么？",
          options: [
            "链表不能存放 int",
            "链表无法在头部插入",
            "每个节点都要单独 malloc，多出指针开销，内存不连续、缓存不友好",
            "链表的容量上限比数组小"
          ],
          answer: 2,
          explain: "链表的代价是每节点一次分配、额外的 next 指针、节点分散在堆上导致缓存命中差。它换来的是容量按需增长和 O(1) 的头插。链表当然能存 int，头插恰好是它的强项，容量上限取决于可用内存而不是某个固定值。"
        }
      ],
      passRatio: 0.8,
      mission: "用数组实现一个容量为 8 的栈：\n"
        + "1) 定义 struct Stack { int data[STACK_MAX]; int top; };（STACK_MAX 用 #define 定义为 8）；\n"
        + "2) void stack_init(struct Stack *s); 把 top 置 0；\n"
        + "3) int stack_push(struct Stack *s, int v); 满了返回 0，否则存值、top 加一、返回 1；\n"
        + "4) int stack_pop(struct Stack *s, int *out); 空了返回 0，否则 top 减一、把值写到 *out、返回 1；\n"
        + "main 里：初始化后用 for 把 1 到 5 依次压栈，然后打印 \"stack:\" 并连续弹出（每个值前面一个空格），弹空之后再弹一次（应当失败），打印 blocked = 1。\n"
        + "运行结果应有两行：\n"
        + "stack: 5 4 3 2 1\n"
        + "blocked = 1",
      starter: "#include <stdio.h>\n"
        + "\n"
        + "#define STACK_MAX 8\n"
        + "\n"
        + "struct Stack {\n"
        + "    int data[STACK_MAX];\n"
        + "    int top;\n"
        + "};\n"
        + "\n"
        + "/* TODO: stack_init：把 top 置 0 */\n"
        + "/* TODO: stack_push：满则返回 0，否则存值、top 加一、返回 1 */\n"
        + "/* TODO: stack_pop：空则返回 0，否则 top 减一、把值写到 *out、返回 1 */\n"
        + "\n"
        + "int main(void) {\n"
        + "    struct Stack s;\n"
        + "\n"
        + "    /* TODO: 初始化，用 for 压入 1..5 */\n"
        + "    /* TODO: 打印 \"stack:\" 后依次弹出并打印 */\n"
        + "    /* TODO: 再弹一次（应该失败），打印 blocked = 1 */\n"
        + "\n"
        + "    return 0;\n"
        + "}",
      hint: "push 和 pop 都要先做边界判断再动数据：push 判 s->top >= STACK_MAX，pop 判 s->top == 0。打印用 printf(\" %d\", v) 让格式自然带上空格；最后一次弹出用 stack_pop(&s, &v) == 0 得到 1/0 再打印。",
      check: {
        include: ["stdio.h"],
        return0: true,
        require: {
          struct: "Stack",
          array: true,
          pointer: true,
          loop: true,
          funcs: ["stack_push","stack_pop"]
        },
        calls: [["printf","stack:"]],
        minStatements: 10,
        message: "需要定义带数组的 struct Stack、用指针参数、自己写 stack_push 与 stack_pop、使用循环，并打印 stack: 那一行。",
        ok: "数组栈的容量管理、判空判满和指针出参都用对了。"
      },
      expectedOutput: "stack: 5 4 3 2 1\nblocked = 1",
      solution: "#include <stdio.h>\n"
        + "\n"
        + "#define STACK_MAX 8\n"
        + "\n"
        + "struct Stack {\n"
        + "    int data[STACK_MAX];\n"
        + "    int top;\n"
        + "};\n"
        + "\n"
        + "void stack_init(struct Stack *s) {\n"
        + "    s->top = 0;\n"
        + "}\n"
        + "\n"
        + "int stack_push(struct Stack *s, int v) {\n"
        + "    if (s->top >= STACK_MAX) {\n"
        + "        return 0;\n"
        + "    }\n"
        + "    s->data[s->top] = v;\n"
        + "    s->top++;\n"
        + "    return 1;\n"
        + "}\n"
        + "\n"
        + "int stack_pop(struct Stack *s, int *out) {\n"
        + "    if (s->top == 0) {\n"
        + "        return 0;\n"
        + "    }\n"
        + "    s->top--;\n"
        + "    *out = s->data[s->top];\n"
        + "    return 1;\n"
        + "}\n"
        + "\n"
        + "int main(void) {\n"
        + "    struct Stack s;\n"
        + "    int v = 0;\n"
        + "    int i;\n"
        + "\n"
        + "    stack_init(&s);\n"
        + "    for (i = 1; i <= 5; i++) {\n"
        + "        stack_push(&s, i);\n"
        + "    }\n"
        + "\n"
        + "    printf(\"stack:\");\n"
        + "    while (stack_pop(&s, &v)) {\n"
        + "        printf(\" %d\", v);\n"
        + "    }\n"
        + "    printf(\"\\n\");\n"
        + "\n"
        + "    printf(\"blocked = %d\\n\", stack_pop(&s, &v) == 0);\n"
        + "    return 0;\n"
        + "}",
      mastery: [
        "能用数组实现栈，并正确处理判空与判满",
        "能说清链式队列为什么不需要判满、出队时要注意什么",
        "能根据容量是否可预测、插删位置来选择合适的实现"
      ]
    },
    {
      id: 50,
      title: "综合项目：内存版学生管理系统",
      minutes: 35,
      gist: "把 struct、typedef、动态数组、查找、删除、统计和内存释放串成一个能跑的小系统。",
      lesson: "这一关把前面学的东西拼起来，做一个“内存版”的学生管理系统：数据只存在内存里，程序退出就没了，但录入、查找、删除、统计四件事齐全。它是后面文件模块的基础——把内存换成文件，就是一个能持久保存的版本。\n"
        + "核心设计有两个。第一是用 typedef 把一条记录变成一个类型：typedef struct Student { int id; char name[12]; int score; } Student;，名字用固定长度的字符数组，避免动态字符串的复杂度。第二是用“动态数组”装记录：typedef struct StudentList { Student *items; int count; int capacity; } StudentList;。count 是当前有多少条记录，capacity 是已经申请了多少个位置，两者分开是动态数组的关键——容量用完了才需要扩容。\n"
        + "扩容用 realloc：它把原来那块内存调整成新大小，可能原地扩大，也可能搬到新地址并把旧内容复制过去。因此有一条铁律：必须用临时指针接收返回值，成功后再赋给 items。如果直接写 items = realloc(items, ...)，一旦失败返回 NULL，原来的指针就丢了——内存泄漏，而且再也 free 不掉。容量通常按两倍增长，这样连续插入 n 条记录的平均代价是常数级。\n"
        + "查找就是遍历，逐个比较 id，找到返回指向该元素的指针（Student *），找不到返回 NULL——返回指针而不是下标，因为“没有”用下标 -1 表示不如 NULL 直观。删除是数组的经典操作：找到目标位置后，把后面所有元素往前覆盖一格，再让 count 减一，等于把最后一个位置“空出来”。注意这里的元素是数组里的连续内存，不能对单个元素 free——要 free 的是整个 items。\n"
        + "统计要在一次遍历里同时算出总数、总和、最大值、最小值。平均值想输出一位小数，可以用整数运算避免浮点误差：sum * 10 / count 得到“十分之一单位”的整数，再拆成整数部分和小数部分打印。\n"
        + "最后是纪律：程序结束前必须 free(list->items) 并把指针置 NULL；字符串字段用自己写的拷贝函数保证一定以 '\\0' 结尾，并且不超过数组长度减一。这两条做到，程序才算真正“干净”。",
      example: {
        code: "#include <stdio.h>\n"
          + "#include <stdlib.h>\n"
          + "\n"
          + "typedef struct Student {\n"
          + "    int id;\n"
          + "    char name[12];\n"
          + "    int score;\n"
          + "} Student;\n"
          + "\n"
          + "typedef struct StudentList {\n"
          + "    Student *items;\n"
          + "    int count;\n"
          + "    int capacity;\n"
          + "} StudentList;\n"
          + "\n"
          + "int list_init(StudentList *list, int capacity) {\n"
          + "    list->items = malloc(sizeof(Student) * (size_t)capacity);\n"
          + "    if (list->items == NULL) {\n"
          + "        list->count = 0;\n"
          + "        list->capacity = 0;\n"
          + "        return 0;\n"
          + "    }\n"
          + "    list->count = 0;\n"
          + "    list->capacity = capacity;\n"
          + "    return 1;\n"
          + "}\n"
          + "\n"
          + "void list_free(StudentList *list) {\n"
          + "    free(list->items);\n"
          + "    list->items = NULL;\n"
          + "    list->count = 0;\n"
          + "    list->capacity = 0;\n"
          + "}\n"
          + "\n"
          + "int list_add(StudentList *list, int id, int score) {\n"
          + "    if (list->count == list->capacity) {\n"
          + "        int new_cap = list->capacity * 2;\n"
          + "        Student *grown = realloc(list->items, sizeof(Student) * (size_t)new_cap);\n"
          + "        if (grown == NULL) {\n"
          + "            return 0;\n"
          + "        }\n"
          + "        list->items = grown;\n"
          + "        list->capacity = new_cap;\n"
          + "    }\n"
          + "    list->items[list->count].id = id;\n"
          + "    list->items[list->count].score = score;\n"
          + "    list->count++;\n"
          + "    return 1;\n"
          + "}\n"
          + "\n"
          + "int main(void) {\n"
          + "    StudentList list;\n"
          + "    int i;\n"
          + "\n"
          + "    if (!list_init(&list, 2)) {\n"
          + "        printf(\"init failed\\n\");\n"
          + "        return 1;\n"
          + "    }\n"
          + "\n"
          + "    for (i = 1; i <= 3; i++) {\n"
          + "        list_add(&list, 1000 + i, 60 + i * 10);\n"
          + "    }\n"
          + "\n"
          + "    printf(\"count = %d, capacity = %d\\n\", list.count, list.capacity);\n"
          + "    for (i = 0; i < list.count; i++) {\n"
          + "        printf(\"%d %d\\n\", list.items[i].id, list.items[i].score);\n"
          + "    }\n"
          + "\n"
          + "    list_free(&list);\n"
          + "    printf(\"freed\\n\");\n"
          + "    return 0;\n"
          + "}",
        output: "count = 3, capacity = 4\n"
          + "1001 70\n"
          + "1002 80\n"
          + "1003 90\n"
          + "freed",
        explain: "第 4～8 行定义 Student，第 10～14 行定义 StudentList——items 是动态数组的首地址，count 是记录数，capacity 是容量。第 16～25 行的 list_init 用 malloc 申请 capacity 个 Student 的空间；失败就把 count 和 capacity 都置 0 并返回 0。第 28～33 行的 list_free 释放 items 并把三个字段归零，避免留下悬空指针。\n"
          + "第 35～49 行的 list_add 展示扩容：当 count == capacity 时，先把容量翻倍，用临时指针 grown 接收 realloc 的返回值，只有非 NULL 才写回 items 并更新 capacity；然后依次写入 id、score 并让 count 加一。\n"
          + "main 里第 55 行用容量 2 初始化，第 60～62 行连续插入 3 条记录——第 3 条会触发一次扩容，所以第 64 行打印出的 count = 3, capacity = 4，正好能看到“容量翻倍”的效果。第 65～67 行遍历打印，第 69 行 list_free 释放，第 70 行打印 freed。"
      },
      pitfalls: [
        "直接把 realloc 的返回值赋给 items：失败时返回 NULL，原指针丢失，既泄漏又无法释放；要先存到临时指针。",
        "扩容后继续使用旧的元素指针：realloc 可能把数据搬到新地址，之前取到的 Student * 会失效（悬空）。",
        "把 count 和 capacity 混用：用 capacity 当记录数会打印出未初始化的垃圾数据，用 count 当容量会少申请空间、写越界。",
        "删除元素时对单个元素 free：items[i] 是数组内的一段内存，不是独立申请的块；只能 free(items) 一次。",
        "姓名用 strcpy 直接拷：容易越界写；本关自己写拷贝函数，最多拷 NAME_MAX - 1 个字符并补 '\\0'。",
        "统计前不判断 count == 0：空表时求平均会除以 0，程序崩溃。",
        "忘记 free：程序短时间看不出问题，但这是真实项目里最常见的内存问题。"
      ],
      takeaways: [
        "动态数组用 count（记录数）和 capacity（容量）两个计数器管理，容量用完才扩容",
        "realloc 必须用临时指针接收返回值，容量按倍数增长可以摊平开销",
        "删除元素用后面元素左移覆盖，再让 count 减一；要 free 的是整个 items",
        "统计要在一次遍历里算完，并先处理空表；字符串拷贝要保证 '\\0' 结尾"
      ],
      questions: [
        {
          q: "动态数组用 count（已有元素数）和 capacity（已申请容量）管理时，“需要扩容”的条件是？",
          options: ["count == capacity","count > capacity","capacity == 0","count == 0"],
          answer: 0,
          explain: "count 追上 capacity 时，下一个元素就会写到申请范围之外，所以要在这时扩容（常见做法是把容量翻倍）。count > capacity 说明早已越界写入过；capacity == 0 或 count == 0 只表示空表，不需要扩容。"
        },
        {
          q: "用 realloc 扩容时，下面哪种写法是正确的？",
          options: [
            "list->items = realloc(list->items, size); 然后判断 list->items 是否为 NULL",
            "先用临时指针接收返回值，非 NULL 再赋给 list->items，NULL 则按失败处理",
            "先 free(list->items)，再 malloc 一块更大的内存",
            "realloc 失败时会自动保留旧内存，所以返回值不用管"
          ],
          answer: 1,
          explain: "realloc 失败返回 NULL，而旧内存仍然有效；如果直接写回 items，失败时旧指针就丢了（泄漏且无法再释放），所以要先存临时变量。先 free 再 malloc 会丢掉已有数据；返回值不管会让你在失败后解引用 NULL。"
        },
        {
          q: "从动态数组中间删除一个元素，通常怎么做？",
          options: [
            "把该位置的元素置 0 即可",
            "free(list->items[i])",
            "把后面的元素依次左移一格，再让 count 减一",
            "把 capacity 减一"
          ],
          answer: 2,
          explain: "数组元素连续存放，删中间一个就让后面的元素往前覆盖，最后 count--。置 0 只是改了值、长度没变；items[i] 是数组里的一段内存，不是独立申请的块，free 它属于非法释放（要 free 的是整个 items）；capacity 是已申请容量，与记录数无关。"
        }
      ],
      passRatio: 0.8,
      mission: "完成内存版学生管理系统（在起始代码的 TODO 处补齐）：\n"
        + "1) int list_add(StudentList *list, int id, const char *name, int score); 容量不够时用 realloc 把 capacity 翻倍（先接临时指针），再写入记录；\n"
        + "2) Student *list_find(StudentList *list, int id); 找到返回指针，找不到返回 NULL；\n"
        + "3) int list_remove(StudentList *list, int id); 找到后把后面的元素左移覆盖、count 减一、返回 1；找不到返回 0；\n"
        + "4) void list_print(const StudentList *list); 每条记录一行 \"%d %s %d\"；\n"
        + "5) void list_stats(const StudentList *list); 打印 count、average（一位小数）、max 与 min；\n"
        + "main 里按顺序做：list_init(&list, INIT_CAP)；录入 1001 Ann 91、1002 Bob 78、1003 Cid 85、1004 Dan 62；打印 after add: 与全部记录；查找 1003 与 1099；删除 1002；打印 after remove:、全部记录、统计；最后 list_free 并打印 freed。\n"
        + "本关要求把本机运行结果粘贴到「运行结果比对」，完整输出见下方预期结果。",
      starter: "#include <stdio.h>\n"
        + "#include <stdlib.h>\n"
        + "\n"
        + "#define NAME_MAX 12\n"
        + "#define INIT_CAP 2\n"
        + "\n"
        + "typedef struct Student {\n"
        + "    int id;\n"
        + "    char name[NAME_MAX];\n"
        + "    int score;\n"
        + "} Student;\n"
        + "\n"
        + "typedef struct StudentList {\n"
        + "    Student *items;\n"
        + "    int count;\n"
        + "    int capacity;\n"
        + "} StudentList;\n"
        + "\n"
        + "static void copy_name(char *dst, const char *src) {\n"
        + "    int i = 0;\n"
        + "    while (src[i] != '\\0' && i < NAME_MAX - 1) {\n"
        + "        dst[i] = src[i];\n"
        + "        i++;\n"
        + "    }\n"
        + "    dst[i] = '\\0';\n"
        + "}\n"
        + "\n"
        + "int list_init(StudentList *list, int capacity) {\n"
        + "    list->items = malloc(sizeof(Student) * (size_t)capacity);\n"
        + "    if (list->items == NULL) {\n"
        + "        list->count = 0;\n"
        + "        list->capacity = 0;\n"
        + "        return 0;\n"
        + "    }\n"
        + "    list->count = 0;\n"
        + "    list->capacity = capacity;\n"
        + "    return 1;\n"
        + "}\n"
        + "\n"
        + "void list_free(StudentList *list) {\n"
        + "    free(list->items);\n"
        + "    list->items = NULL;\n"
        + "    list->count = 0;\n"
        + "    list->capacity = 0;\n"
        + "}\n"
        + "\n"
        + "/* TODO: list_add：容量不够时用 realloc 扩容（capacity * 2），再写入 id/name/score */\n"
        + "/* TODO: list_find：找到返回 Student *，找不到返回 NULL */\n"
        + "/* TODO: list_remove：找到后把后面的元素左移覆盖、count 减一、返回 1；找不到返回 0 */\n"
        + "/* TODO: list_print：每行 \"%d %s %d\" */\n"
        + "/* TODO: list_stats：打印 count、average（一位小数）、max = ? , min = ? */\n"
        + "\n"
        + "int main(void) {\n"
        + "    StudentList list;\n"
        + "    Student *found;\n"
        + "\n"
        + "    /* TODO: list_init(&list, INIT_CAP) */\n"
        + "    /* TODO: 录入 1001 Ann 91、1002 Bob 78、1003 Cid 85、1004 Dan 62 */\n"
        + "    /* TODO: 打印 after add 与全部记录 */\n"
        + "    /* TODO: 查找 1003（打印姓名和分数）与 1099（打印 not found） */\n"
        + "    /* TODO: 删除 1002，打印 after remove、全部记录、统计 */\n"
        + "    /* TODO: list_free(&list)，打印 freed */\n"
        + "\n"
        + "    return 0;\n"
        + "}",
      hint: "扩容时写 int new_cap = list->capacity * 2; Student *grown = realloc(...); 失败就返回 0。查找就是 for 循环比较 id。删除用一个内层循环把 j 位置的元素往前挪。统计先判 count == 0，再用一次遍历算 sum/best/worst，平均值用 sum * 10 / count 拆成整数和一位小数。",
      check: {
        include: ["stdio.h","stdlib.h"],
        return0: true,
        require: {
          struct: "Student",
          typedef: true,
          malloc: true,
          free: true,
          funcs: ["list_add","list_find","list_remove","list_stats"]
        },
        calls: [["printf","after add"]],
        minStatements: 25,
        message: "需要 typedef struct Student、用 malloc/free 管理动态数组、自己写 list_add / list_find / list_remove / list_stats 四个函数，并在 main 里打印 after add 一行。",
        ok: "录入、查找、删除、统计和内存释放都齐全，动态数组管理正确。"
      },
      expectedOutput: "after add:\n"
        + "1001 Ann 91\n"
        + "1002 Bob 78\n"
        + "1003 Cid 85\n"
        + "1004 Dan 62\n"
        + "find 1003: Cid 85\n"
        + "find 1099: not found\n"
        + "remove 1002 = 1\n"
        + "after remove:\n"
        + "1001 Ann 91\n"
        + "1003 Cid 85\n"
        + "1004 Dan 62\n"
        + "count = 3\n"
        + "average = 79.3\n"
        + "max = 91, min = 62\n"
        + "freed",
      solution: "#include <stdio.h>\n"
        + "#include <stdlib.h>\n"
        + "\n"
        + "#define NAME_MAX 12\n"
        + "#define INIT_CAP 2\n"
        + "\n"
        + "typedef struct Student {\n"
        + "    int id;\n"
        + "    char name[NAME_MAX];\n"
        + "    int score;\n"
        + "} Student;\n"
        + "\n"
        + "typedef struct StudentList {\n"
        + "    Student *items;\n"
        + "    int count;\n"
        + "    int capacity;\n"
        + "} StudentList;\n"
        + "\n"
        + "/* 自己的安全拷贝：最多放 NAME_MAX - 1 个字符，一定补 '\\0' */\n"
        + "static void copy_name(char *dst, const char *src) {\n"
        + "    int i = 0;\n"
        + "    while (src[i] != '\\0' && i < NAME_MAX - 1) {\n"
        + "        dst[i] = src[i];\n"
        + "        i++;\n"
        + "    }\n"
        + "    dst[i] = '\\0';\n"
        + "}\n"
        + "\n"
        + "int list_init(StudentList *list, int capacity) {\n"
        + "    list->items = malloc(sizeof(Student) * (size_t)capacity);\n"
        + "    if (list->items == NULL) {\n"
        + "        list->count = 0;\n"
        + "        list->capacity = 0;\n"
        + "        return 0;\n"
        + "    }\n"
        + "    list->count = 0;\n"
        + "    list->capacity = capacity;\n"
        + "    return 1;\n"
        + "}\n"
        + "\n"
        + "void list_free(StudentList *list) {\n"
        + "    free(list->items);\n"
        + "    list->items = NULL;\n"
        + "    list->count = 0;\n"
        + "    list->capacity = 0;\n"
        + "}\n"
        + "\n"
        + "static int list_grow(StudentList *list) {\n"
        + "    int new_cap = list->capacity * 2;\n"
        + "    Student *grown = realloc(list->items, sizeof(Student) * (size_t)new_cap);\n"
        + "    if (grown == NULL) {\n"
        + "        return 0;\n"
        + "    }\n"
        + "    list->items = grown;\n"
        + "    list->capacity = new_cap;\n"
        + "    return 1;\n"
        + "}\n"
        + "\n"
        + "int list_add(StudentList *list, int id, const char *name, int score) {\n"
        + "    if (list->count == list->capacity) {\n"
        + "        if (!list_grow(list)) {\n"
        + "            return 0;\n"
        + "        }\n"
        + "    }\n"
        + "    list->items[list->count].id = id;\n"
        + "    list->items[list->count].score = score;\n"
        + "    copy_name(list->items[list->count].name, name);\n"
        + "    list->count++;\n"
        + "    return 1;\n"
        + "}\n"
        + "\n"
        + "Student *list_find(StudentList *list, int id) {\n"
        + "    int i;\n"
        + "    for (i = 0; i < list->count; i++) {\n"
        + "        if (list->items[i].id == id) {\n"
        + "            return &list->items[i];\n"
        + "        }\n"
        + "    }\n"
        + "    return NULL;\n"
        + "}\n"
        + "\n"
        + "int list_remove(StudentList *list, int id) {\n"
        + "    int i, j;\n"
        + "    for (i = 0; i < list->count; i++) {\n"
        + "        if (list->items[i].id == id) {\n"
        + "            for (j = i; j < list->count - 1; j++) {\n"
        + "                list->items[j] = list->items[j + 1];\n"
        + "            }\n"
        + "            list->count--;\n"
        + "            return 1;\n"
        + "        }\n"
        + "    }\n"
        + "    return 0;\n"
        + "}\n"
        + "\n"
        + "void list_print(const StudentList *list) {\n"
        + "    int i;\n"
        + "    for (i = 0; i < list->count; i++) {\n"
        + "        printf(\"%d %s %d\\n\", list->items[i].id, list->items[i].name,\n"
        + "               list->items[i].score);\n"
        + "    }\n"
        + "}\n"
        + "\n"
        + "void list_stats(const StudentList *list) {\n"
        + "    int i;\n"
        + "    int sum = 0;\n"
        + "    int best, worst;\n"
        + "\n"
        + "    if (list->count == 0) {\n"
        + "        printf(\"count = 0\\n\");\n"
        + "        return;\n"
        + "    }\n"
        + "    best = list->items[0].score;\n"
        + "    worst = list->items[0].score;\n"
        + "    for (i = 0; i < list->count; i++) {\n"
        + "        int s = list->items[i].score;\n"
        + "        sum += s;\n"
        + "        if (s > best) {\n"
        + "            best = s;\n"
        + "        }\n"
        + "        if (s < worst) {\n"
        + "            worst = s;\n"
        + "        }\n"
        + "    }\n"
        + "    printf(\"count = %d\\n\", list->count);\n"
        + "    printf(\"average = %d.%d\\n\", sum * 10 / list->count / 10,\n"
        + "           sum * 10 / list->count % 10);\n"
        + "    printf(\"max = %d, min = %d\\n\", best, worst);\n"
        + "}\n"
        + "\n"
        + "int main(void) {\n"
        + "    StudentList list;\n"
        + "    Student *found;\n"
        + "\n"
        + "    if (!list_init(&list, INIT_CAP)) {\n"
        + "        printf(\"init failed\\n\");\n"
        + "        return 1;\n"
        + "    }\n"
        + "\n"
        + "    list_add(&list, 1001, \"Ann\", 91);\n"
        + "    list_add(&list, 1002, \"Bob\", 78);\n"
        + "    list_add(&list, 1003, \"Cid\", 85);\n"
        + "    list_add(&list, 1004, \"Dan\", 62);\n"
        + "\n"
        + "    printf(\"after add:\\n\");\n"
        + "    list_print(&list);\n"
        + "\n"
        + "    found = list_find(&list, 1003);\n"
        + "    printf(\"find 1003: %s %d\\n\", found ? found->name : \"none\",\n"
        + "           found ? found->score : 0);\n"
        + "\n"
        + "    found = list_find(&list, 1099);\n"
        + "    printf(\"find 1099: %s\\n\", found ? found->name : \"not found\");\n"
        + "\n"
        + "    printf(\"remove 1002 = %d\\n\", list_remove(&list, 1002));\n"
        + "    printf(\"after remove:\\n\");\n"
        + "    list_print(&list);\n"
        + "    list_stats(&list);\n"
        + "\n"
        + "    list_free(&list);\n"
        + "    printf(\"freed\\n\");\n"
        + "    return 0;\n"
        + "}",
      mastery: [
        "能设计一个“记录 + 动态数组”的小系统，并分清 count 与 capacity",
        "能用 realloc 安全扩容，并在删除、统计里正确处理边界（空表、找不到）",
        "能保证程序结束时释放全部动态内存，不留泄漏和悬空指针"
      ]
    }
  ]
});
