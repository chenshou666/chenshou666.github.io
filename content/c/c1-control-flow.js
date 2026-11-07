/* ============================================================================
 * HT Lab · C 语言课程 · 模块 1 · 流程控制
 * 关卡 id：9–16（本文件由模块作者维护；格式与文风对齐 c0-getting-started.js）
 * 每关示例代码与标准答案都已在 TDM-GCC 4.9.2（-std=c11 -Wall -Wextra，零警告）
 * 下真实编译运行，example.output / expectedOutput 均为实际输出。
 * example.input 与 input 是校验器喂给程序的输入，学生看不到，因此示例讲解里
 * 会写明“本例输入的是……”。
 * ==========================================================================*/
window.C_MODULES = window.C_MODULES || [];
window.C_MODULES.push({
  id: "c1",
  name: "模块 1 · 流程控制",
  levels: [
    {
      id: 9,
      title: "if / else if / else：让程序会分岔",
      minutes: 15,
      gist: "用 if、else if、else 让程序按条件走不同的路，并把判断嵌套起来处理更细的情况。",
      lesson: "程序默认从上往下一句句执行，但真实问题几乎都带条件：成绩及格没有？这个数是正数吗？用户按了哪个键？if 的作用就是让某段代码只在条件成立时才执行。\n"
        + "写法是 if (条件) { 语句 }。括号里可以放任何表达式：C 没有强制的布尔类型，判断规则只有一条——0 是假，非 0 是真。所以 if (1)、if (-7)、if (n)（n 不为 0 时）都算成立。（C99 起可以 #include <stdbool.h> 用 bool/true/false，但那只是更好看的写法，底层仍然是 0 和 1。）\n"
        + "只有两条路时用 if … else；路多于两条就用 else if 串起来：if (score >= 90) { … } else if (score >= 80) { … } else { … }。这些分支是互斥的：从上往下检查，第一个成立的分支被执行，其余分支连条件都不会再算。因此顺序直接决定结果——把 score >= 80 写在 score >= 90 前面，90 分也会被判成 B。\n"
        + "花括号 {} 包住的是「条件成立时执行的一整块」。单条语句可以省略花括号，但建议永远写上：以后想往分支里加第二句，忘了补花括号就变成「条件只控制第一句」，第二句无条件执行，而编译器不会提醒你。\n"
        + "嵌套：一个分支内部可以再写完整的 if 结构，用来「先粗分、再细分」。比如先判断正数、负数、零，再在非零的分支里判断奇偶。嵌套层数一多代码就难读了，通常超过两三层就该考虑拆成函数，或者用逻辑运算符把条件合并（下一关的主题）。\n"
        + "读别人的分支代码时不要一行行猜：先找最外层的 if，顺着缩进和花括号配对往下看，确认每个 else 到底属于哪个 if，再代入具体数值在心里走一遍。",
      example: {
        code: "#include <stdio.h>\n\n"
          + "int main(void) {\n"
          + "    int n;\n"
          + "    scanf(\"%d\", &n);\n"
          + "\n"
          + "    if (n > 0) {\n"
          + "        printf(\"positive\\n\");\n"
          + "    } else if (n < 0) {\n"
          + "        printf(\"negative\\n\");\n"
          + "    } else {\n"
          + "        printf(\"zero\\n\");\n"
          + "    }\n"
          + "\n"
          + "    /* 嵌套：先判断是不是 0，再在分支内部判断奇偶 */\n"
          + "    if (n != 0) {\n"
          + "        if (n % 2 == 0) {\n"
          + "            printf(\"even\\n\");\n"
          + "        } else {\n"
          + "            printf(\"odd\\n\");\n"
          + "        }\n"
          + "    }\n"
          + "    return 0;\n"
          + "}",
        input: "-7",
        output: "negative\nodd",
        explain: "程序先读一个整数（本例输入的是 -7）。第一个 if … else if … else 是三分支互斥结构：-7 > 0 为假，-7 < 0 为真，所以走第二个分支打印 negative，最后的 else 根本不会被求值。"
          + "下面那段是嵌套：外层 if (n != 0) 先排除 0，成立之后才进入内层 if (n % 2 == 0) 判断奇偶。-7 % 2 在 C 里是 -1（不等于 0），所以走 else 打印 odd。"
          + "注意花括号的配对关系：内层的 if … else 整个都在外层 if 的花括号里面，缩进就是对这种包含关系的可视化。"
          + "把输入换成 0，第一段会打印 zero，而嵌套那段因为 n != 0 为假，一行都不会输出——同一段代码，路径完全不同。"
      },
      pitfalls: [
        "把判断相等写成赋值：`if (n = 0)` 会把 0 赋给 n，再拿这个 0 当条件（恒为假），本意是 `n == 0`；gcc 会给出 suggest parentheses around assignment 的警告。",
        "else if 的顺序写反：先写 `score >= 80` 再写 `score >= 90`，90 分会被判成 B——分支从上往下第一个成立的就执行。",
        "省略花括号后往里加语句：`if (n > 0) printf(\"a\"); printf(\"b\");` 里第二句是无条件执行的，编译不报错，结果却错。",
        "在 if 的条件后面多写分号：`if (n > 0);` 是「条件成立时执行一条空语句」，紧跟的花括号块反而变成无条件执行。"
      ],
      takeaways: [
        "if 按「0 为假、非 0 为真」判断，C 没有强制的布尔类型",
        "else if 分支互斥，从上往下第一个成立的执行，顺序决定结果",
        "分支里可以嵌套完整的 if 结构，实现先分类再细分",
        "== 是比较，= 是赋值，写混了条件就永远不成立"
      ],
      questions: [
        {
          q: "关于 `if (n > 0) { … } else if (n < 0) { … } else { … }`，正确的说法是？",
          options: [
            "三个分支会依次全部执行一遍",
            "else 分支在任何输入下都会执行",
            "else if 只有在 if 分支里出错时才执行",
            "每次运行只会执行其中一个分支"
          ],
          answer: 3,
          explain: "三个分支互斥：从上往下第一个条件成立的被执行，其余的连条件都不再算。三个分支依次执行、else 必然执行都是错的；else if 也不是「出错时才走」，它和 if 是并列的条件判断。"
        },
        {
          q: "下面两行代码会输出什么？\nint x = 5;\nif (x > 3) printf(\"A\");\nif (x > 4) printf(\"B\");",
          options: [
            "只输出 A",
            "只输出 B",
            "输出 AB",
            "什么都不输出"
          ],
          answer: 2,
          explain: "这是两个互相独立的 if，各自判断、各自执行，5 > 3 和 5 > 4 都成立，所以 A、B 都打印。只有写成 else if 才是互斥的，这一点最容易看错。"
        },
        {
          q: "把 `if (n == 0)` 写成 `if (n = 0)`，会发生什么？",
          options: [
            "编译直接报错，无法通过",
            "n 被赋值为 0，条件恒为假，本意却是比较 n 和 0",
            "n 会被自增 1",
            "没有任何影响，是推荐的简写"
          ],
          answer: 1,
          explain: "赋值表达式的值就是被赋的那个值，0 当条件即为假，于是分支永远不执行；gcc 只会警告而不会报错，所以很容易被忽略。n 自增、报错、无影响三种说法都不成立。"
        }
      ],
      passRatio: 0.8,
      mission: "读入一个整数 score，用 if / else if / else 输出等级：score 小于 0 或大于 100 输出 Invalid score（这两条用单独的条件分别判断，本关先别用 ||）；score >= 90 输出 Grade A；score >= 80 输出 Grade B；score >= 60 输出 Grade C；其余（0 到 59）输出 Grade F。另外，在 Grade A 这个分支内部再嵌套一个 if：score 正好等于 100 时，额外输出一行 Perfect score!。示例：输入 100，输出 Grade A 和 Perfect score! 两行。",
      starter: "#include <stdio.h>\n\n"
        + "int main(void) {\n"
        + "    int score;\n"
        + "    scanf(\"%d\", &score);\n"
        + "\n"
        + "    /* TODO: 用 if / else if / else 输出等级，并在 A 分支里嵌套判断满分 */\n"
        + "\n"
        + "    return 0;\n"
        + "}",
      hint: "先搭最外层的 if … else if 链：把 score < 0 和 score > 100 两条单独的条件放在最前面，等级判断从高分往低分写。最后回到 Grade A 的花括号里，再嵌一个 if (score == 100)。写完用 100、95、85、60、59、-1 各跑一遍，确认每个分支都能走到。",
      check: {
        include: ["stdio.h"],
        return0: true,
        require: { "if": true },
        calls: [["scanf", "%d"], ["printf", "Grade A"], ["printf", "Perfect score!"]],
        minStatements: 6,
        forbid: ["gets", "goto"],
        message: "需要有 #include <stdio.h>、int main(void)、scanf 读入、if / else if / else 分支链，并且能输出 Grade A 与 Perfect score!，最后 return 0;。",
        ok: "分支链、嵌套判断和两行输出都齐全，结构符合本关要求。"
      },
      input: "100",
      expectedOutput: "Grade A\nPerfect score!",
      solution: "#include <stdio.h>\n\n"
        + "int main(void) {\n"
        + "    int score;\n"
        + "    scanf(\"%d\", &score);\n"
        + "\n"
        + "    if (score < 0) {\n"
        + "        printf(\"Invalid score\\n\");\n"
        + "    } else if (score > 100) {\n"
        + "        printf(\"Invalid score\\n\");\n"
        + "    } else if (score >= 90) {\n"
        + "        printf(\"Grade A\\n\");\n"
        + "        if (score == 100) {\n"
        + "            printf(\"Perfect score!\\n\");\n"
        + "        }\n"
        + "    } else if (score >= 80) {\n"
        + "        printf(\"Grade B\\n\");\n"
        + "    } else if (score >= 60) {\n"
        + "        printf(\"Grade C\\n\");\n"
        + "    } else {\n"
        + "        printf(\"Grade F\\n\");\n"
        + "    }\n"
        + "    return 0;\n"
        + "}",
      mastery: [
        "能独立写出 if / else if / else 分支链，并说清哪一条会被执行、为什么",
        "能在分支内部嵌套判断，处理「先分类、再细分」的问题",
        "看到判级错误时，能立刻想到检查 else if 的条件顺序"
      ]
    },
    {
      id: 10,
      title: "&& || !：把多个条件合成一个",
      minutes: 15,
      gist: "用逻辑运算符把几个简单条件拼成一个条件，并搞懂短路求值为什么能保护程序。",
      lesson: "很多判断一个条件说不清：闰年要「能被 4 整除且不能被 100 整除，或者能被 400 整除」。这时用逻辑运算符把简单条件拼起来。\n"
        + "&& 是「并且」：两边都真，整体才真。|| 是「或者」：只要有一边真，整体就真。! 是「取反」：真变假、假变真。它们的结果仍然是 0 或 1，可以直接放进 if 的条件里。\n"
        + "优先级：! 最高，然后 &&，最后 ||。也就是说 a || b && c 会被理解成 a || (b && c)。这个顺序难记，所以写复合条件时请主动加括号，别人（包括三天后的你）读起来才不吃力。\n"
        + "短路求值：&& 左边已经为假时，右边根本不计算；|| 左边已经为真时，右边也不计算。这不是编译器优化，而是语言规定。它有两个用处：一是省计算（右边可能是很贵的函数调用），二是安全——if (d != 0 && 100 / d > 5) 里 d 为 0 时右边的除法不会执行，程序不会崩。反过来写成 if (100 / d > 5 && d != 0) 就完全失去保护：先除再判断，d = 0 时已经出事了。\n"
        + "还有一个反直觉的地方：0 < x < 10 在 C 里不是数学上的区间判断。它先算 0 < x 得到 0 或 1，再拿这个结果和 10 比，结果永远为真。正确写法是 x > 0 && x < 10。\n"
        + "! 的常见用法：if (!isLeap) 等价于 if (isLeap == 0)；!(a > 0) 等价于 a <= 0，而不是 a < 0（a 等于 0 时也成立，这一点最容易错）。",
      example: {
        code: "#include <stdio.h>\n\n"
          + "int main(void) {\n"
          + "    int year, d, isLeap;\n"
          + "    scanf(\"%d %d\", &year, &d);\n"
          + "\n"
          + "    isLeap = (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;\n"
          + "    if (!isLeap) {\n"
          + "        printf(\"%d is not a leap year\\n\", year);\n"
          + "    } else {\n"
          + "        printf(\"%d is a leap year\\n\", year);\n"
          + "    }\n"
          + "\n"
          + "    /* 短路求值：d 为 0 时 && 右边不再计算，所以不会除以 0 */\n"
          + "    if (d != 0 && 100 / d > 5) {\n"
          + "        printf(\"100 / %d > 5\\n\", d);\n"
          + "    } else {\n"
          + "        printf(\"100 / %d <= 5 or d is 0\\n\", d);\n"
          + "    }\n"
          + "    return 0;\n"
          + "}",
        input: "2024 10",
        output: "2024 is a leap year\n100 / 10 > 5",
        explain: "本例输入的是 2024 和 10。第二行的赋值把闰年规则写成一行：2024 % 4 == 0 为真、2024 % 100 != 0 也为真，所以 && 整体为真，整个 || 表达式直接为真（右边根本不会再算，这正是短路）。"
          + "isLeap 拿到 1，于是 if (!isLeap) 为假，走 else 打印 2024 is a leap year。! 在这里比写 isLeap == 0 更贴近「不是闰年」的语义。"
          + "下面那段专门演示短路的价值：100 / 10 = 10 > 5 成立，输出第二行。"
          + "如果把第二个输入换成 0，d != 0 为假，&& 的右边（含除法的那一半）不会被求值，程序打印 100 / 0 <= 5 or d is 0 而不会崩溃——换成 || 或不写保护条件，这里就是除以 0。"
      },
      pitfalls: [
        "把区间写成 `0 < x < 10`：先算 `0 < x` 得到 0/1，再和 10 比，永远为真；要写 `x > 0 && x < 10`。",
        "把 `||` 写成 `|`（或 `&&` 写成 `&`）：位运算不做短路，两边都会计算，还可能得到完全不同的结果。",
        "把保护条件写在右边：`if (100 / d > 5 && d != 0)` 在 d = 0 时已经先除了，短路救不了它。",
        "把 `!(a > 0)` 当成 `a < 0`：a 等于 0 时 `!(a > 0)` 也是真，正确的等价写法是 `a <= 0`。"
      ],
      takeaways: [
        "&& 全真才真，|| 一真即真，! 取反，结果仍是 0 或 1",
        "! 优先级高于 &&，&& 高于 ||，复合条件请加括号",
        "&& 左边为假、|| 左边为真时，右边不计算（短路求值）",
        "区间判断写 x > 0 && x < 10，不要写 0 < x < 10"
      ],
      questions: [
        {
          q: "在 `if (d != 0 && 100 / d > 5)` 中，当 d 等于 0 时会发生什么？",
          options: [
            "程序因为除以 0 而崩溃",
            "`100 / d` 仍会被计算，得到不确定的结果",
            "`&&` 左边为假，右边不再计算，条件为假",
            "整个 if 连同 else 一起被跳过"
          ],
          answer: 2,
          explain: "&& 是短路求值：左边 d != 0 为假，整个表达式已确定为假，右边不计算，所以不会除以 0。崩溃或算出不确定结果的说法都忽略了短路；else 分支仍然会执行，并没有被跳过。"
        },
        {
          q: "`!(a > 0)` 等价于下面哪个表达式？",
          options: [
            "`a > 0`",
            "`a <= 0`",
            "`a < 0`",
            "`a != 0`"
          ],
          answer: 1,
          explain: "取反把整个比较的真假翻转：a 不大于 0，就是 a <= 0（a 等于 0 时也成立）。选 a < 0 是最常见的错——漏掉了 a 等于 0 的情况；a > 0 和 a != 0 与它真假并不同步。"
        },
        {
          q: "执行 `int a = 3; if (a > 0 || a++ > 0) { }` 之后，a 的值是多少？",
          options: [
            "3",
            "4",
            "5",
            "无法确定"
          ],
          answer: 0,
          explain: "a > 0 已经为真，|| 右边不再计算，a++ 根本没有执行，所以 a 还是 3。若换成 &&，右边必须计算，a 就会变成 4——这正是短路带来的可观察差异。"
        }
      ],
      passRatio: 0.8,
      mission: "读入三个整数 a、b、c（代表三条边），完成两行输出。第一行：用 || 把 a <= 0、b <= 0、c <= 0 连起来判断有没有非法边，三条边都大于 0 输出 Sides ok，否则输出 Invalid side。第二行：用 && 把构成三角形的三个条件连起来（a + b > c、a + c > b、b + c > a），能构成输出 Valid triangle，否则输出 Invalid triangle。提示：可以先把两个判断的结果存进 int 变量（真为 1、假为 0），再分别判断，代码会更清楚。示例：输入 3 4 5，输出 Sides ok 和 Valid triangle 两行。",
      starter: "#include <stdio.h>\n\n"
        + "int main(void) {\n"
        + "    int a, b, c;\n"
        + "    scanf(\"%d %d %d\", &a, &b, &c);\n"
        + "\n"
        + "    /* TODO: 用 || 判断有没有非法边，用 && 判断能不能构成三角形 */\n"
        + "\n"
        + "    return 0;\n"
        + "}",
      hint: "复合条件先算成变量再判断最清楚：badSide = (a <= 0 || b <= 0 || c <= 0); 三角形判定要把三个不等式都用 && 串起来，只写两个条件会漏掉一种退化情形。先在本机用 3 4 5、3 4 8、0 4 5 各跑一遍。",
      check: {
        include: ["stdio.h"],
        return0: true,
        require: { "if": true },
        seq: [["&&"], ["||"]],
        calls: [["scanf", "%d"], ["printf", "Sides ok"], ["printf", "Valid triangle"]],
        minStatements: 5,
        forbid: ["gets", "goto"],
        message: "需要 #include <stdio.h>、int main(void)、scanf 读三个数，条件里同时用到 && 和 ||，并且能输出 Sides ok 与 Valid triangle，最后 return 0;。",
        ok: "复合条件用对了：&& 与 || 都在，两行输出也齐全。"
      },
      input: "3 4 5",
      expectedOutput: "Sides ok\nValid triangle",
      solution: "#include <stdio.h>\n\n"
        + "int main(void) {\n"
        + "    int a, b, c, badSide, isTriangle;\n"
        + "    scanf(\"%d %d %d\", &a, &b, &c);\n"
        + "\n"
        + "    badSide = (a <= 0 || b <= 0 || c <= 0);\n"
        + "    isTriangle = (a + b > c && a + c > b && b + c > a);\n"
        + "\n"
        + "    if (badSide) {\n"
        + "        printf(\"Invalid side\\n\");\n"
        + "    } else {\n"
        + "        printf(\"Sides ok\\n\");\n"
        + "    }\n"
        + "\n"
        + "    if (badSide || !isTriangle) {\n"
        + "        printf(\"Invalid triangle\\n\");\n"
        + "    } else {\n"
        + "        printf(\"Valid triangle\\n\");\n"
        + "    }\n"
        + "    return 0;\n"
        + "}",
      mastery: [
        "能用 &&、||、! 把多个简单条件合成一个复合条件，并主动加括号",
        "能解释短路求值，并用它写出 d != 0 && 100 / d > 5 这类安全的判断",
        "看到 0 < x < 10 这类写法时，能立刻指出它恒为真并改正"
      ]
    },
    {
      id: 11,
      title: "switch：多路分支与 case 穿透",
      minutes: 15,
      gist: "用 switch 把「一个值对应多种情况」写清楚，并看穿没有 break 时的穿透陷阱。",
      lesson: "当判断的依据是「同一个表达式的若干种取值」时，一长串 if / else if 会显得啰嗦：每次都要重写 month == 1、month == 2……switch 就是为这种场景准备的。\n"
        + "写法：switch (表达式) { case 常量1: 语句; break; case 常量2: 语句; break; default: 语句; break; }。表达式的值必须是整型（int、char、long 都可以，float、double 和字符串不行），每个 case 后面必须跟整型常量，不能写变量，也不能写区间。\n"
        + "执行过程：先算出表达式的值，然后直接跳到匹配的 case 标签处，从那里开始一直往下执行——除非遇到 break。这个「继续往下执行」就叫穿透（fall through）。所以每个 case 结尾一般都要写 break，忘了就会把下面 case 的语句也执行掉。经典现象：case 1 里漏了 break，输入 1 却把 case 1 和 case 2 的内容都打印了出来。\n"
        + "穿透不总是坏事：故意把多个取值叠在一起，就能让它们共用一段代码，例如 case 1: case 2: case 3: printf(\"…\"); break;。注意这些「空的 case」后面不能有语句，一旦有语句就会真的穿下去，所以叠加时只写标签不写代码。\n"
        + "default 是「所有 case 都不匹配」时跳转的标签，位置可以放在中间或最后（习惯放最后）。它本身不会结束 switch：如果它前面某个 case 忘了 break，程序照样会穿进 default。放最后时，default 的 break 可以省略，但写上更整齐。\n"
        + "和 if 的分工：switch 只判断「相等」，不能做范围判断（case score >= 60: 是错的）；多个等值分支用 switch 更整齐，范围的、复合条件的判断还是用 if。",
      example: {
        code: "#include <stdio.h>\n\n"
          + "int main(void) {\n"
          + "    int day;\n"
          + "    scanf(\"%d\", &day);\n"
          + "\n"
          + "    switch (day) {\n"
          + "        case 1:\n"
          + "        case 2:\n"
          + "        case 3:\n"
          + "        case 4:\n"
          + "        case 5:\n"
          + "            printf(\"weekday\\n\");\n"
          + "            break;\n"
          + "        case 6:\n"
          + "        case 7:\n"
          + "            printf(\"weekend\\n\");\n"
          + "            break;\n"
          + "        default:\n"
          + "            printf(\"invalid day\\n\");\n"
          + "            break;\n"
          + "    }\n"
          + "    return 0;\n"
          + "}",
        input: "6",
        output: "weekend",
        explain: "本例输入的是 6。switch 拿到 6，从上往下找匹配的标签，落到 case 6；因为 case 6 后面没有语句，执行会继续往下「穿透」到 case 7，然后打印 weekend 并遇到 break，switch 结束。"
          + "case 1 到 case 5 是另一种穿透写法：它们都是空标签，1 到 5 任意一个匹配都会一路穿到那唯一的 printf(\"weekday\")。所以「空 case 叠加」是刻意利用穿透，而「写了语句却不写 break」才是 bug。"
          + "default 负责 0、8、-3 这类不匹配的值，打印 invalid day。若把输入改成 8，由于前面没有匹配，程序直接跳到 default。"
          + "注意每个分支最后的 break：把 case 6 那个 break 删掉，输入 6 就会先打印 weekend、再穿进 default 打印 invalid day，这就是穿透最典型的事故现场。"
      },
      pitfalls: [
        "忘记 break：`case 1: printf(\"one\\n\"); case 2: printf(\"two\\n\");` 输入 1 会把 one 和 two 都打印出来。",
        "case 后面写变量或范围：`case n:`、`case 1..5:` 都不是合法的 case 标号，C 要求整型常量表达式，编译直接报错。",
        "用浮点数或字符串做 switch 的表达式：`switch (price)`（price 是 double）编译不过，这种多路判断要用 if 链。",
        "以为 default 会自动结束：它只是一个「都不匹配」的标签；前面的 case 忘了 break 时，程序会穿进 default，多打印一行。"
      ],
      takeaways: [
        "switch 只做等值比较，表达式必须是整型，case 必须是整型常量",
        "匹配后从该 case 一直往下执行，直到遇到 break",
        "多个取值共用一段代码，就把它们的 case 空标签叠在一起",
        "default 处理「都不匹配」，位置随意，通常放最后"
      ],
      questions: [
        {
          q: "关于 switch 的 case 穿透（fall through），正确的说法是？",
          options: [
            "每个 case 执行完都会自动跳出 switch，break 只是装饰",
            "没有 break 会导致编译错误",
            "只有 default 之后才会发生穿透",
            "没有 break 时会继续执行下一个 case 的语句"
          ],
          answer: 3,
          explain: "C 的规定是：进入某个 case 后一直往下执行，break 才跳出。所以漏写 break 会把后面的语句也执行掉。它不会编译报错（所以更危险），也不会自动跳出；default 同样可能被穿透进来。"
        },
        {
          q: "switch 的表达式和 case 标号，类型上有什么要求？",
          options: [
            "表达式只能是 int，case 可以是任意常量",
            "表达式只能是 char，case 必须是整数",
            "表达式必须是整型，case 必须是整型常量表达式",
            "表达式可以是任意类型，包括 double 和字符串"
          ],
          answer: 2,
          explain: "switch 做的是整型等值比较，int、char、long 都可以，case 后面必须是编译期就确定的整型常量。double 和字符串不能作为 switch 的表达式，也因此不能做 case 标号，所以「任意类型」和「只能是 int/char」都不对。"
        },
        {
          q: "关于 switch 里的 default，正确的说法是？",
          options: [
            "所有 case 都不匹配时执行的标签，位置可以不在最后",
            "必须写在最后一个 case 之后，否则语法错误",
            "每个 case 都要配一个 default",
            "它会让程序立刻结束 switch，不需要 break"
          ],
          answer: 0,
          explain: "default 只是一个「都不匹配」时跳转的标签，写在中间或最后都合法（放最后可读性最好）。它不会自动结束 switch，前面忘了 break 照样会穿进来；也不要求每个 case 配一个 default。"
        }
      ],
      passRatio: 0.8,
      mission: "读入一个整数 month（1 到 12），用 switch 输出该月的天数（不考虑闰年）：1、3、5、7、8、10、12 月输出 31 days；4、6、9、11 月输出 30 days；2 月输出 28 days；其它值（小于 1 或大于 12）输出 Invalid month。要求用「多个 case 空标签叠在一起共用一段代码」的写法，不要每个 case 各写一遍 printf。示例：输入 12，输出 31 days。",
      starter: "#include <stdio.h>\n\n"
        + "int main(void) {\n"
        + "    int month;\n"
        + "    scanf(\"%d\", &month);\n"
        + "\n"
        + "    /* TODO: 用 switch 判断月份天数；31 天的月份要把 case 叠在一起共用一段代码 */\n"
        + "\n"
        + "    return 0;\n"
        + "}",
      hint: "先把 7 个 31 天的 case 一个挨一个写成空标签（每个后面只有冒号，不写语句），最后统一写一次 printf(\"31 days\\n\"); break;。再叠 30 天的四个 case，单独处理 case 2，最后用 default 兜住非法月份。数一数：一共只有 4 个 printf。",
      check: {
        include: ["stdio.h"],
        return0: true,
        require: { "switch": true },
        calls: [["scanf", "%d"], ["printf", "31 days"], ["printf", "28 days"]],
        minStatements: 6,
        forbid: ["gets", "goto"],
        message: "需要 #include <stdio.h>、int main(void)、用 switch(month) 做多路分支、scanf 读入，并且能输出 31 days 与 28 days，最后 return 0;。",
        ok: "switch 的多路分支、case 叠加和输出都符合要求。"
      },
      input: "12",
      expectedOutput: "31 days",
      solution: "#include <stdio.h>\n\n"
        + "int main(void) {\n"
        + "    int month;\n"
        + "    scanf(\"%d\", &month);\n"
        + "\n"
        + "    switch (month) {\n"
        + "        case 1:\n"
        + "        case 3:\n"
        + "        case 5:\n"
        + "        case 7:\n"
        + "        case 8:\n"
        + "        case 10:\n"
        + "        case 12:\n"
        + "            printf(\"31 days\\n\");\n"
        + "            break;\n"
        + "        case 4:\n"
        + "        case 6:\n"
        + "        case 9:\n"
        + "        case 11:\n"
        + "            printf(\"30 days\\n\");\n"
        + "            break;\n"
        + "        case 2:\n"
        + "            printf(\"28 days\\n\");\n"
        + "            break;\n"
        + "        default:\n"
        + "            printf(\"Invalid month\\n\");\n"
        + "            break;\n"
        + "    }\n"
        + "    return 0;\n"
        + "}",
      mastery: [
        "能把等值多路分支改写成 switch，并正确叠加空 case",
        "能解释 case 穿透，并一眼看出漏写 break 会多输出什么",
        "能判断什么场景不该用 switch（范围、浮点、复合条件）"
      ]
    },
    {
      id: 12,
      title: "while 与 do…while：先判断还是先执行",
      minutes: 18,
      gist: "分清 while（先判断条件）和 do…while（先执行一次），知道什么时候必须用后者。",
      lesson: "循环让程序重复做一件事，直到条件不再成立。C 里最基础的循环是 while：while (条件) { 循环体 }，执行顺序是「先判断、后执行」——条件一开始就为假时，循环体一次都不执行。所以写 while 之前先想清楚三件事：初值是什么、条件什么时候为假、循环体里哪一句会让状态朝结束走。第三件事漏了就是死循环，程序卡住不返回。\n"
        + "do…while 把顺序反过来：do { 循环体 } while (条件); 先无条件执行一次循环体，再判断条件，为真就再来一轮。注意结尾那个分号，它是 do…while 独有的。两者的差别就集中在「至少执行一次」这一点上：n = 0 时，while (n > 0) 什么都不做，do…while 一定会执行一次。\n"
        + "什么时候必须用 do…while？当「先做一次才有东西可判断」的时候。典型例子是统计一个非负整数的位数：0 也有 1 位。如果写 while (n > 0)，n = 0 时循环体一次都不进，位数就统计成 0，错；用 do…while 先数一位、再除以 10，0 和 123 都能算对。同理，菜单至少显示一次、先读一个数再决定要不要继续，都属于这类场景。\n"
        + "另外一个常用模式是把输入放进循环条件：while (scanf(\"%d\", &x) == 1) { … }，scanf 返回成功读入的项数，读到文件结束返回 EOF，循环自然结束（Windows 控制台用 Ctrl+Z 再回车模拟文件结束）。\n"
        + "读别人的循环代码时，先找循环变量的初值和更新语句，再看条件——三者放在一起，才能判断这个循环会不会结束。",
      example: {
        code: "#include <stdio.h>\n\n"
          + "int main(void) {\n"
          + "    int n, i, step;\n"
          + "    scanf(\"%d\", &n);\n"
          + "\n"
          + "    printf(\"while loop:\\n\");\n"
          + "    i = n;\n"
          + "    while (i > 0) {\n"
          + "        printf(\"%d\\n\", i);\n"
          + "        i = i - 1;\n"
          + "    }\n"
          + "\n"
          + "    printf(\"do-while loop:\\n\");\n"
          + "    step = 0;\n"
          + "    do {\n"
          + "        printf(\"%d\\n\", step);\n"
          + "        step = step + 1;\n"
          + "    } while (step < n);\n"
          + "    return 0;\n"
          + "}",
        input: "0",
        output: "while loop:\ndo-while loop:\n0",
        explain: "本例输入的是 0，选这个输入就是为了把两种循环的差别顶到眼前。"
          + "while 那段：i 被赋成 0，条件 i > 0 一开始就是假，循环体一次都不执行，所以 while loop: 后面一行输出都没有。"
          + "do…while 那段：先无条件打印 0、再把 step 加成 1，然后才判断 step < n（1 < 0 为假），循环结束。所以它至少留下了一行 0。"
          + "把输入换成 3 再看一次：while 打印 3、2、1；do…while 打印 0、1、2。两个循环的「跑几轮」在这里完全一致，区别只会在条件一开始就不成立时暴露出来——这就是本关的核心。"
          + "写 do…while 时别忘了结尾的分号：} while (step < n); 少了它就是语法错误。"
      },
      pitfalls: [
        "忘记更新循环变量：`int i = 0; while (i < 3) { printf(\"%d\", i); }` 里 i 永远是 0，条件永远成立 → 死循环，程序不返回。",
        "do…while 结尾漏分号：`} while (n > 0)` 后面必须跟 `;`，漏了直接编译报错。",
        "该用 do…while 的地方写成 while：统计位数、菜单至少显示一次这类「先做一次」的场景，while 会把第一次整个漏掉。",
        "循环条件里写成赋值：`while (n = 0)` 把 n 清成 0、条件恒假，循环一次都不执行（本意多半是 `n != 0`）。"
      ],
      takeaways: [
        "while 先判断后执行，条件一开始为假就一次都不执行",
        "do…while 先执行后判断，至少执行一次，结尾别忘了分号",
        "写循环先定三件事：初值、条件、让条件走向假的那个更新",
        "「先做一次才有东西判断」的场景用 do…while"
      ],
      questions: [
        {
          q: "关于 `while (条件) { 循环体 }` 和 `do { 循环体 } while (条件);`，正确的说法是？",
          options: [
            "两者都会先执行一次循环体再判断",
            "while 先判断条件再执行，do…while 先执行一次再判断",
            "do…while 在条件一开始为假时，循环体一次都不执行",
            "while 的条件括号后面必须写分号"
          ],
          answer: 1,
          explain: "两者的差别正是判断与执行的先后顺序：while 可能零次执行，do…while 至少一次。条件为假时 do…while 也会执行一次，所以选项三说反了；while 的条件后面直接跟循环体，不需要分号（那是 do…while 的规则）。"
        },
        {
          q: "`int i = 0; while (i < 3) { printf(\"%d\", i); }` 这段代码的问题是什么？",
          options: [
            "i 一直是 0，条件永远成立，程序不会结束",
            "输出 012 后正常结束",
            "编译错误：while 里不能调用 printf",
            "只输出一个 0 就停下来"
          ],
          answer: 0,
          explain: "循环体里没有改变 i 的语句，i < 3 永远为真，这就是死循环，只能强行中断程序。它不会正常结束、也不会打印 012；循环里调用 printf 完全合法。补一句 i = i + 1;（或写成 i++）就好了。"
        },
        {
          q: "输入 n 等于 0 时，`do { printf(\"run\"); } while (n > 0);` 会输出什么？",
          options: [
            "什么都不输出",
            "编译错误，n 为 0 时不允许进入循环",
            "输出一次 run，然后条件为假退出",
            "无限次输出 run"
          ],
          answer: 2,
          explain: "do…while 先执行循环体，打印完 run 才判断 n > 0；0 > 0 为假，循环结束，所以恰好输出一次。选项一混淆了 while；这里不会编译错误，也不会死循环（n 没有再变大）。"
        }
      ],
      passRatio: 0.8,
      mission: "读入一个非负整数 n，用 do…while 循环统计它的位数，输出一行 Digits: X。要求：每次循环先把位数加 1，再把 n 除以 10（整数除法会丢掉最后一位），直到 n 变成 0；n 等于 0 时结果必须是 1，这正是必须用 do…while 而不是 while 的原因。示例：输入 100，输出 Digits: 3。",
      starter: "#include <stdio.h>\n\n"
        + "int main(void) {\n"
        + "    int n, digits = 0;\n"
        + "    scanf(\"%d\", &n);\n"
        + "\n"
        + "    /* TODO: 用 do…while 数位数：先数一次，再判断 n 是否还大于 0 */\n"
        + "\n"
        + "    printf(\"Digits: %d\\n\", digits);\n"
        + "    return 0;\n"
        + "}",
      hint: "先给 digits 赋 0，然后写 do { digits = digits + 1; n = n / 10; } while (n > 0); 心里跑一遍 n = 0 和 n = 100：前者循环体执行一次（答案 1 位），后者执行三次。写完再想一遍，如果换成 while (n > 0) 开头的循环，n = 0 会输出几。",
      check: {
        include: ["stdio.h"],
        return0: true,
        require: { "doWhile": true, "loop": true },
        calls: [["scanf", "%d"], ["printf", "Digits:"]],
        minStatements: 4,
        forbid: ["gets", "goto"],
        message: "需要 #include <stdio.h>、int main(void)、scanf 读入、do { … } while ( … ); 形式的循环，以及 printf(\"Digits: %d\\n\", …) 和 return 0;。",
        ok: "do…while 的写法、位数统计和输出都符合要求。"
      },
      input: "100",
      expectedOutput: "Digits: 3",
      solution: "#include <stdio.h>\n\n"
        + "int main(void) {\n"
        + "    int n, digits;\n"
        + "    scanf(\"%d\", &n);\n"
        + "\n"
        + "    digits = 0;\n"
        + "    do {\n"
        + "        digits = digits + 1;\n"
        + "        n = n / 10;\n"
        + "    } while (n > 0);\n"
        + "\n"
        + "    printf(\"Digits: %d\\n\", digits);\n"
        + "    return 0;\n"
        + "}",
      mastery: [
        "能说清 while 与 do…while 的执行顺序差别，并各举一个合适的使用场景",
        "能独立写出 do { … } while ( … ); 并记住结尾分号",
        "写循环前先确定初值、条件、更新三件事，能判断循环会不会结束"
      ]
    },
    {
      id: 13,
      title: "for 循环：三要素写在一行",
      minutes: 18,
      gist: "把初始化、条件、更新集中到 for 的三个部分里，并搞清循环变量的作用域。",
      lesson: "while 的循环变量通常要在外面声明、在循环体里更新，三件事散落在三处。for 把它们收进一行：for (初始化; 条件; 更新) { 循环体 }。执行顺序是固定的：先做一次初始化，然后判断条件——为真就执行循环体，再执行更新部分，回到条件判断；为假就结束循环。\n"
        + "三个部分都可以省略（for (;;) 是合法的死循环写法），但省略前要清楚自己在写什么。常见形态：for (int i = 0; i < n; i++)、for (int i = n; i >= 1; i--)、for (int i = 0; i < n; i += 2)。更新部分不一定每次加一，步长由你决定。\n"
        + "循环次数怎么数？数一数「条件成立的 i 有几个」。for (int i = 0; i < 5; i++) 里 i 取 0、1、2、3、4，循环体执行 5 次；写成 i <= 5 就是 6 次。差一个的 off-by-one 大多出在这里：想输出 1 到 n 就用 i <= n，想遍历下标 0 到 n-1 就用 i < n。\n"
        + "作用域：C99 起允许在 for 的第一个部分声明变量（for (int i = 0; …)），这个 i 只在循环内部可见，循环结束后再用它会编译失败（未声明的标识符）。好处是不同循环可以各自用 i、互不干扰，也不会出现「忘了初始化」。如果循环结束后还要用这个值（例如记住最大值出现的位置），就在循环外面先写 int i;，然后写成 for (i = 0; …)；两种写法都合法，看需求选。\n"
        + "循环体里再改循环变量要小心：在 for (int i = 0; i < n; i++) 的循环体里又写一句 i++，等于每轮加 2，循环次数直接少一半，而且很难一眼看出来。\n"
        + "读别人写的 for 时，先在心里跑前两轮、把 i 的值写出来，比盯着代码猜快得多；实在拿不准就把 n 改小（2 或 3）在本机打印一下。",
      example: {
        code: "#include <stdio.h>\n\n"
          + "int main(void) {\n"
          + "    int i, sum;\n"
          + "\n"
          + "    sum = 0;\n"
          + "    for (i = 1; i <= 5; i++) {\n"
          + "        sum = sum + i;\n"
          + "    }\n"
          + "    printf(\"sum 1..5 = %d\\n\", sum);\n"
          + "\n"
          + "    /* C99：循环变量可以直接在 for 里声明，作用域只在这个循环内 */\n"
          + "    for (int k = 10; k > 0; k = k - 3) {\n"
          + "        printf(\"k = %d\\n\", k);\n"
          + "    }\n"
          + "    return 0;\n"
          + "}",
        output: "sum 1..5 = 15\nk = 10\nk = 7\nk = 4\nk = 1",
        explain: "这段程序不需要输入。第一个 for 演示标准形态：i 在循环外面声明（因为循环结束后我们不打算再用它，这里只是为了展示另一种写法），初始化 i = 1、条件 i <= 5、更新 i++，五轮分别加上 1、2、3、4、5，得到 15。"
          + "第二个 for 演示 C99 的写法：k 直接声明在 for 里，作用域只在这个循环内；更新部分写成 k = k - 3，是「每次减 3」而不是加 1。"
          + "执行顺序要背下来：初始化只做一次 → 判断条件 → 循环体 → 更新 → 再判断。所以 k 取到 10、7、4、1 时循环体执行；k 变成 -2 时条件 k > 0 不成立，-2 不会进入循环体，也不会被打印。"
          + "如果这里把条件写成 k >= 0，输出就会多一行 k = -2——差一个的边界错误，改完条件记得把边界值代进去验算。"
      },
      pitfalls: [
        "off-by-one：想输出 1 到 n 却写成 `i < n`，最后一个数永远不出现；要写 `i <= n`。",
        "在循环体里又改循环变量：`for (int i = 0; i < n; i++)` 里再写一句 `i++`，每轮实际加 2，循环少跑一半。",
        "把 for 里声明的变量拿到循环外使用：`for (int i = 0; …)` 之后再写 i 会报未声明的标识符，需要在循环外先声明。",
        "for 后面误加分号：`for (int i = 0; i < n; i++);` 表示循环体是一条空语句，后面的花括号块只执行一次。"
      ],
      takeaways: [
        "for (初始化; 条件; 更新) 的顺序：初始化一次 → 判断 → 循环体 → 更新 → 再判断",
        "循环次数由条件决定，< 还是 <= 差一次，边界要代值验算",
        "C99 允许 for (int i = …)，i 的作用域只在这个循环内",
        "循环结束后还要用循环变量，就在循环外先声明"
      ],
      questions: [
        {
          q: "`for (int i = 0; i < 5; i++)` 的循环体一共执行几次？",
          options: [
            "4 次",
            "6 次",
            "5 次",
            "无限次"
          ],
          answer: 2,
          explain: "i 依次取 0、1、2、3、4，共 5 个值满足 i < 5，所以循环体执行 5 次；i 变成 5 时条件为假，循环结束。答 4 是把「最后一个值的下标」当成了次数，答 6 是误按 i <= 5 计算。"
        },
        {
          q: "在 C99 里用 `for (int i = 1; i <= n; i++)` 声明 i，它的作用域是？",
          options: [
            "整个 main 函数，循环结束后还能继续用",
            "整个源文件",
            "从声明处开始直到程序结束",
            "只在这个 for 循环内部"
          ],
          answer: 3,
          explain: "在 for 的第一个部分声明的变量，作用域被限制在这个循环（含条件、更新和循环体）内。循环结束后再用 i 会报「未声明的标识符」；想在循环外继续用，就在外面先写 int i;。前三个选项都把它当成了函数级或文件级的变量。"
        },
        {
          q: "`for (int i = 10; i > 0; i -= 3)` 会让 i 依次取到哪些值？",
          options: [
            "10、7、4、1",
            "10、7、4、1、-2",
            "10、9、8、…、1",
            "只有 10"
          ],
          answer: 0,
          explain: "每轮更新是减 3：10 → 7 → 4 → 1，都能满足 i > 0。i 变成 -2 时条件为假，-2 不会进入循环体，所以不会出现在取值序列里；每次减 1 的说法看错了更新部分。"
        }
      ],
      passRatio: 0.8,
      mission: "读入一个整数 n（n >= 1），用 for 循环完成两行输出。第一行：Sum of squares: 1 到 n 的平方和（即 1*1 + 2*2 + … + n*n）。第二行：Countdown: 从 n 递减到 1，每个数字前加一个空格（同一行，行尾不要多出空格）。要求循环变量写在 for 里面，用 for (int i = …) 的写法。示例：输入 4，第一行是 Sum of squares: 30，第二行是 Countdown: 4 3 2 1。",
      starter: "#include <stdio.h>\n\n"
        + "int main(void) {\n"
        + "    int n, sum = 0;\n"
        + "    scanf(\"%d\", &n);\n"
        + "\n"
        + "    /* TODO: 第一个 for 累加平方和 */\n"
        + "\n"
        + "    printf(\"Sum of squares: %d\\n\", sum);\n"
        + "\n"
        + "    /* TODO: 第二个 for 从 n 递减到 1，用 printf(\" %d\", i) 控制空格 */\n"
        + "\n"
        + "    printf(\"\\n\");\n"
        + "    return 0;\n"
        + "}",
      hint: "平方和就在循环体里写 sum = sum + i * i;，循环变量从 1 开始、条件 i <= n。倒序那段把循环变量从 n 开始、条件 i >= 1、更新写成 i--，循环体里用 printf(\" %d\", i)（空格在前），这样行尾不会多出空格，最后再单独 printf(\"\\n\") 换行。",
      check: {
        include: ["stdio.h"],
        return0: true,
        require: { "for": true },
        seq: [["for", "(", "int"]],
        calls: [["scanf", "%d"], ["printf", "Sum of squares"]],
        minStatements: 6,
        forbid: ["gets", "goto"],
        message: "需要 #include <stdio.h>、int main(void)、for 循环，循环变量写在 for 里（for (int i = …)），并输出 Sum of squares 与 Countdown 两行，最后 return 0;。",
        ok: "for 的三要素、循环变量声明和作用域用法都对。"
      },
      input: "4",
      expectedOutput: "Sum of squares: 30\nCountdown: 4 3 2 1",
      solution: "#include <stdio.h>\n\n"
        + "int main(void) {\n"
        + "    int n, sum;\n"
        + "    scanf(\"%d\", &n);\n"
        + "\n"
        + "    sum = 0;\n"
        + "    for (int i = 1; i <= n; i++) {\n"
        + "        sum = sum + i * i;\n"
        + "    }\n"
        + "    printf(\"Sum of squares: %d\\n\", sum);\n"
        + "\n"
        + "    printf(\"Countdown:\");\n"
        + "    for (int i = n; i >= 1; i--) {\n"
        + "        printf(\" %d\", i);\n"
        + "    }\n"
        + "    printf(\"\\n\");\n"
        + "    return 0;\n"
        + "}",
      mastery: [
        "能写出三种常见形态的 for（递增、递减、变步长），并说清执行顺序",
        "能根据「要输出哪些值」决定用 < 还是 <=，不再靠试",
        "知道 for 里声明的循环变量只在循环内有效，需要时改成外面声明"
      ]
    },
    {
      id: 14,
      title: "break 与 continue：提前结束和跳过一轮",
      minutes: 20,
      gist: "用 break 提前跳出循环、用 continue 跳过本轮，并认清死循环、off-by-one、浮点比较这三个经典坑。",
      lesson: "有些时候循环不必走完：找到目标就可以收工，或者某一轮的数据根本不该处理。break 和 continue 就是为这两种需求准备的。\n"
        + "break 立即结束当前这一层循环，程序接着执行循环后面的语句。continue 只结束本轮：跳过循环体里剩下的语句，直接进入下一轮（对 for 来说，会先执行更新部分再判断条件）。一句话记忆：break 是「不干了」，continue 是「这一轮不算」。\n"
        + "两个高频用法。查找：for (int i = 2; i * i <= n; i++) { if (n % i == 0) { isPrime = 0; break; } } 找到因子就停，后面的候选不必再试。过滤：求和时用 if (i % 2 == 0) continue; 把偶数整轮跳过。\n"
        + "两条限制要记牢：break 只跳出最内层循环，嵌套循环里它不会一次跳出两层（switch 里的 break 同理，结束的是 switch）；continue 用在 while 里要格外小心——如果「更新循环变量」的语句排在 continue 后面，它会被跳过，循环可能永远不结束。\n"
        + "接下来是三个必须认识的循环错误。第一，死循环：循环变量没更新、条件写反（比如 while (i != n) 而 i 从 n + 1 出发）都会让程序卡住；运行时可以按 Ctrl+C 中断程序。第二，off-by-one（差一错误）：< 和 <= 用错，循环少一次或多一次，输出永远差一个值；改完把边界值（0、1、最大值）代进去验算最快。第三，浮点比较：浮点数在计算机里是近似存储的，0.1 + 0.2 并不等于 0.3，所以判断两个浮点数是否相等要用「差的绝对值小于一个很小的数」：fabs(a - b) < 1e-9（需要 #include <math.h>），直接写 a == b 往往不成立。",
      example: {
        code: "#include <stdio.h>\n\n"
          + "int main(void) {\n"
          + "    int limit;\n"
          + "    scanf(\"%d\", &limit);\n"
          + "\n"
          + "    for (int i = 1; i <= 10; i++) {\n"
          + "        if (i % 3 == 0) {\n"
          + "            continue;              /* 3 的倍数：跳过本轮剩下的语句 */\n"
          + "        }\n"
          + "        if (i > limit) {\n"
          + "            break;                 /* 超过上限：整个循环立即结束 */\n"
          + "        }\n"
          + "        printf(\"%d\\n\", i);\n"
          + "    }\n"
          + "    return 0;\n"
          + "}",
        input: "7",
        output: "1\n2\n4\n5\n7",
        explain: "本例输入的是 7。循环计划从 1 数到 10，但两种中断方式各拦下了一部分。"
          + "i 等于 3、6、9 时，i % 3 == 0 成立，continue 跳过本轮剩下的语句，所以这三个数不会被打印，也不会执行到下面的判断。"
          + "i 等于 8 时，前面的 continue 不成立，但 8 > limit（7）成立，break 让整个循环当场结束——9、10 连条件都不会再判断。"
          + "最后打印出 1、2、4、5、7。注意 continue 的判断写在 break 前面：顺序换了，遇到 9 时会先被 break 拦下还是先被 continue 跳过，结果虽然一样，但读代码时顺序仍然要看清。"
          + "试着把 limit 设成 100：这次不会 break，循环完整走完 10 轮，输出就是 1、2、4、5、7、8、10（3、6、9 被 continue 跳过）。"
      },
      pitfalls: [
        "在 while 里用 continue 时把更新语句写在它后面：`while (i < n) { if (…) continue; i++; }` 会死循环，因为 i++ 被跳过了。",
        "以为 break 能跳出两层循环：嵌套循环里它只结束内层，外层照常继续下一轮。",
        "`i < n` 与 `i <= n` 混用造成 off-by-one：输出总差最后一个（或多一个）值，用 n = 1 或最大值验算最快。",
        "用 == 比较两个浮点数：0.1 + 0.2 == 0.3 是假；要写成 `fabs(a - b) < 1e-9`，并 #include <math.h>。"
      ],
      takeaways: [
        "break 结束当前这一层循环，continue 只跳过本轮剩下的语句",
        "continue 用在 while 里，必须确认循环变量的更新不会被跳过",
        "off-by-one 用边界值（0、1、最大值）代进去验算最有效",
        "浮点数不能用 == 比较，要用误差范围 fabs(a - b) < 1e-9"
      ],
      questions: [
        {
          q: "循环中的 `continue` 作用是什么？",
          options: [
            "结束整个循环，跳到循环后面的语句",
            "跳过本轮剩下的语句，直接进入下一轮",
            "重新启动程序",
            "一次跳出所有嵌套层"
          ],
          answer: 1,
          explain: "continue 只影响本轮：剩下的语句不执行，直接进入下一轮判断（for 会先执行更新部分）。结束整个循环、跳出所有层是 break 的语义（而且 break 也只跳一层），重启程序更是无关。"
        },
        {
          q: "想输出 0 到 5，循环却写成 `for (int i = 0; i < 5; i++)`，这属于哪类错误？",
          options: [
            "死循环",
            "数组越界",
            "off-by-one（差一错误），漏掉了最后一个值",
            "浮点比较误差"
          ],
          answer: 2,
          explain: "i < 5 只让 i 取 0 到 4，5 被漏掉，这就是典型的差一错误，把条件改成 i <= 5 即可。这里循环会正常结束，不是死循环；没有访问数组，也谈不上越界；循环变量是整数，与浮点误差无关。"
        },
        {
          q: "判断两个浮点数 a、b 是否相等，推荐的做法是？",
          options: [
            "`if (a == b)`",
            "`if (a - b == 0)`",
            "`if (a - b < 0.000001)`",
            "`if (fabs(a - b) < 1e-9)`"
          ],
          answer: 3,
          explain: "浮点数只能近似表示十进制小数，0.1 + 0.2 并不等于 0.3，直接用 == 常常为假；正确做法是比较差的绝对值是否小于一个很小的误差限，fabs 来自 math.h。第三项只判断了一个方向，b 比 a 大时会漏判，仍然不是「相等」。"
        }
      ],
      passRatio: 0.8,
      mission: "读入一个整数 n，用 for 循环完成两行输出。第一行：Odd sum: 1 到 n 之间所有奇数的和（用 continue 跳过偶数）。第二行：First multiple of 7: 1 到 n 之间第一个能被 7 整除的数，找到后用 break 立刻停止查找；如果没有（比如 n 小于 7），输出 Not found。示例：输入 10，第一行是 Odd sum: 25，第二行是 First multiple of 7: 7。",
      starter: "#include <stdio.h>\n\n"
        + "int main(void) {\n"
        + "    int n, oddSum = 0, found = 0;\n"
        + "    scanf(\"%d\", &n);\n"
        + "\n"
        + "    /* TODO: 第一个循环用 continue 跳过偶数，把奇数累加进 oddSum */\n"
        + "\n"
        + "    printf(\"Odd sum: %d\\n\", oddSum);\n"
        + "\n"
        + "    /* TODO: 第二个循环找第一个 7 的倍数，用 break 提前结束 */\n"
        + "\n"
        + "    if (found == 0) {\n"
        + "        printf(\"Not found\\n\");\n"
        + "    } else {\n"
        + "        printf(\"First multiple of 7: %d\\n\", found);\n"
        + "    }\n"
        + "    return 0;\n"
        + "}",
      hint: "奇数判断用 if (i % 2 == 0) continue; 写在循环体开头。第二个循环里一旦 i % 7 == 0，就把 i 记进 found 再 break；found 初值为 0 表示没找到，循环结束后用它决定打印哪一行。用 n = 10 和 n = 5 各跑一次，确认 Not found 那条路也能走到。",
      check: {
        include: ["stdio.h"],
        return0: true,
        require: { "for": true, "loop": true },
        seq: [["continue", ";"], ["break", ";"]],
        calls: [["scanf", "%d"], ["printf", "Odd sum"]],
        minStatements: 8,
        forbid: ["gets", "goto"],
        message: "需要 #include <stdio.h>、int main(void)、for 循环、一句 continue; 和一句 break;，并输出 Odd sum 与 First multiple of 7（或 Not found），最后 return 0;。",
        ok: "break 与 continue 都用上了，两行输出和循环结构都完整。"
      },
      input: "10",
      expectedOutput: "Odd sum: 25\nFirst multiple of 7: 7",
      solution: "#include <stdio.h>\n\n"
        + "int main(void) {\n"
        + "    int n, oddSum, found;\n"
        + "    scanf(\"%d\", &n);\n"
        + "\n"
        + "    oddSum = 0;\n"
        + "    for (int i = 1; i <= n; i++) {\n"
        + "        if (i % 2 == 0) {\n"
        + "            continue;              /* 偶数不要，直接进入下一轮 */\n"
        + "        }\n"
        + "        oddSum = oddSum + i;\n"
        + "    }\n"
        + "    printf(\"Odd sum: %d\\n\", oddSum);\n"
        + "\n"
        + "    found = 0;\n"
        + "    for (int i = 1; i <= n; i++) {\n"
        + "        if (i % 7 == 0) {\n"
        + "            found = i;\n"
        + "            break;                 /* 第一个就够了，不必再找 */\n"
        + "        }\n"
        + "    }\n"
        + "\n"
        + "    if (found == 0) {\n"
        + "        printf(\"Not found\\n\");\n"
        + "    } else {\n"
        + "        printf(\"First multiple of 7: %d\\n\", found);\n"
        + "    }\n"
        + "    return 0;\n"
        + "}",
      mastery: [
        "能根据需要选择 break 或 continue，并说清它对本轮和整个循环的影响",
        "能在查找类问题里用 break 提前结束，用标记变量在循环后统一判断",
        "遇到死循环、off-by-one、浮点比较三类问题时能快速定位并改对"
      ]
    },
    {
      id: 15,
      title: "嵌套循环：打印三角形与乘法表",
      minutes: 20,
      gist: "用两层循环分别控制行和列，把二维的图案和表格打印出来。",
      lesson: "一层循环只能处理一条线上的重复。要打印 n 行、每行又有若干内容，就需要嵌套：外层循环控制「第几行」，内层循环控制「这一行做什么」。执行节奏是：外层走一步，内层完整跑一圈；所以内层循环体执行的总次数是「外层次数 × 内层次数」。\n"
        + "用乘法表验证这个结构：for (int i = 1; i <= 3; i++) { for (int j = 1; j <= 3; j++) printf(\"%5d\", i * j); printf(\"\\n\"); }。i = 1 时 j 从 1 到 3 打印三个数，然后换行。换行语句的位置最关键：它要写在内层循环之外、外层循环之内，放进内层就变成每打印一个数就换一行，表格会歪成一列。\n"
        + "让图案变成三角形，诀窍是让内层的范围依赖外层变量：for (int row = 1; row <= n; row++) { for (int col = 1; col <= row; col++) printf(\"#\"); printf(\"\\n\"); }。row 变大，内层就多打一个井号。想要倒三角，把外层写成 for (int row = n; row >= 1; row--)。想做每行前面带空格的金字塔，就在打印井号之前再加一个专门打印空格的循环——三层嵌套就是这样自然长出来的。\n"
        + "对齐靠格式符：printf(\"%5d\", x) 表示至少占 5 个字符宽、右对齐（宽度不够会自动变宽，不会截断）。\\n 只负责换行，行内的对齐全靠宽度控制，否则乘法表的列会参差不齐。\n"
        + "调试嵌套循环有个好办法：先把 n 改成 2 或 3 跑一遍，并在纸上记下每一轮 i、j 的值。打印结果不对时，先判断是「行数错了」还是「每行的个数错了」——前者说明外层边界有问题，后者说明内层边界或换行位置有问题，比逐行读代码快得多。",
      example: {
        code: "#include <stdio.h>\n\n"
          + "int main(void) {\n"
          + "    int n;\n"
          + "    scanf(\"%d\", &n);\n"
          + "\n"
          + "    /* 外层控制行，内层控制这一行打印几个井号 */\n"
          + "    for (int row = 1; row <= n; row++) {\n"
          + "        for (int col = 1; col <= row; col++) {\n"
          + "            printf(\"#\");\n"
          + "        }\n"
          + "        printf(\"\\n\");\n"
          + "    }\n"
          + "\n"
          + "    /* 乘法表：第 i 行是 i*1 … i*n，每个乘积占 5 个字符宽 */\n"
          + "    for (int i = 1; i <= n; i++) {\n"
          + "        for (int j = 1; j <= n; j++) {\n"
          + "            printf(\"%5d\", i * j);\n"
          + "        }\n"
          + "        printf(\"\\n\");\n"
          + "    }\n"
          + "    return 0;\n"
          + "}",
        input: "4",
        output: "#\n##\n###\n####\n    1    2    3    4\n    2    4    6    8\n    3    6    9   12\n    4    8   12   16",
        explain: "本例输入的是 4。第一段是三角形：row = 1 时内层只跑 1 次，打印 1 个井号；row = 4 时内层跑 4 次，打印 4 个。两个循环之间的 printf(\"\\n\") 负责换行，它必须在内层循环外面，否则每个井号都会独占一行。"
          + "第二段的两个循环都是 1 到 n：外层 i 决定第几行，内层 j 决定这一行有哪几个乘积，printf(\"%5d\", i * j) 把每个结果按 5 个字符宽右对齐，所以 1 和 12 也能对齐成整齐的列（12 占 3 位时会自动站满 5 格的宽度）。"
          + "留意第 4 行：4×3 = 12、4×4 = 16，都是两位数，但因为宽度固定为 5，列没有错位。"
          + "把输入改成 2 再跑一遍，两个循环各走两轮，图案和表格都缩小——用小输入验证嵌套逻辑是最省事的调试手段。"
      },
      pitfalls: [
        "换行语句放错位置：把 `printf(\"\\n\")` 写进内层循环，每个数字都换一行，表格变成一列。",
        "内外层用了同一个循环变量（两层都叫 i）：内层会把外层的 i 改掉，行数完全乱套；两层用不同名字（i/j 或 row/col）。",
        "内层边界写错：想让第 row 行打印 row 个井号，内层却写 `col <= n`，每行都一样长，三角形变成矩形。",
        "在嵌套循环里用 break 想一次跳出两层：它只结束内层；要跳出两层得用标志变量，或者把逻辑写进函数直接 return。"
      ],
      takeaways: [
        "外层控制行、内层控制列，内层跑完一圈外层才走一步",
        "内层循环的范围可以依赖外层变量，图案的变化就是这么来的",
        "换行写在内层循环之外、外层循环之内",
        "printf(\"%5d\", x) 用宽度控制对齐，表格才不会歪"
      ],
      questions: [
        {
          q: "外层循环执行 3 次、内层循环每次执行 4 次，内层循环体一共执行多少次？",
          options: [
            "7 次",
            "3 次",
            "12 次",
            "4 次"
          ],
          answer: 2,
          explain: "嵌套循环的节奏是「外层走一步、内层跑一圈」，所以总数是两层次数的乘积：3 × 4 = 12。答 7 是把次数相加了；答 3 和 4 只看到其中一层。"
        },
        {
          q: "要打印 n 行直角三角形，第 row 行有 row 个字符，内层循环的条件应该写成？",
          options: [
            "`for (int col = 1; col <= row; col++)`",
            "`for (int col = 1; col <= n; col++)`",
            "`for (int col = 1; col <= 1; col++)`",
            "`for (int row = 1; row <= col; row++)`"
          ],
          answer: 0,
          explain: "内层的上界要跟着外层变量 row 走，这样每一行才逐渐变长。写成 col <= n 每行都一样长，变成矩形；col <= 1 每行只有 1 个字符；把 row 当内层变量还会把外层的 row 覆盖掉。"
        },
        {
          q: "在嵌套循环的内层使用 `break`，结果是？",
          options: [
            "同时跳出内外两层循环",
            "只跳出内层循环，外层继续下一轮",
            "结束整个程序",
            "编译错误：嵌套循环里不允许 break"
          ],
          answer: 1,
          explain: "break 的作用范围是「当前这一层循环」，所以只结束内层，外层照常进入下一轮。想一次跳出两层，要用标志变量在外层再加判断，或者把嵌套逻辑放进函数里直接 return。它不会结束程序，也完全合法。"
        }
      ],
      passRatio: 0.8,
      mission: "读入一个整数 n（1 到 9），用嵌套的 for 循环打印两段图案。第一段：n 行倒直角三角形，每行由井号 # 组成，第 1 行 n 个，第 2 行 n-1 个，最后一行 1 个。第二段：n 行 n 列的乘法表，第 i 行依次是 i×1、i×2、…、i×n，每个乘积用 %4d 输出（占 4 个字符宽、右对齐）。示例：输入 3，第一段三行分别是 ###、##、#，第二段三行分别是 1 2 3、2 4 6、3 6 9（每个数字占 4 格宽）。",
      starter: "#include <stdio.h>\n\n"
        + "int main(void) {\n"
        + "    int n;\n"
        + "    scanf(\"%d\", &n);\n"
        + "\n"
        + "    /* TODO: 倒三角：外层 row 从 n 递减到 1，内层打印 row 个井号 # */\n"
        + "\n"
        + "    /* TODO: 乘法表：外层 i、内层 j，每行结束换行 */\n"
        + "\n"
        + "    return 0;\n"
        + "}",
      hint: "倒三角的外层写 for (int row = n; row >= 1; row--)，内层写 col <= row 打印井号，printf(\"\\n\") 放在内层循环之后。乘法表用 printf(\"%4d\", i * j)，同样把换行留在内层外面。两个循环的变量名不要重复，先用 n = 2 验证行数和每行个数再跑 n = 9。",
      check: {
        include: ["stdio.h"],
        return0: true,
        require: { "for": true },
        seq: [["for", "(", "int"]],
        calls: [["scanf", "%d"], ["printf", "#"], ["printf", "%4d"]],
        minStatements: 8,
        forbid: ["gets", "goto"],
        message: "需要 #include <stdio.h>、int main(void)、嵌套的 for 循环（用 for (int …) 写法）、打印星号以及用 %4d 打印乘法表，最后 return 0;。",
        ok: "嵌套循环、倒三角和乘法表的输出都符合要求。"
      },
      input: "3",
      expectedOutput: "###\n##\n#\n   1   2   3\n   2   4   6\n   3   6   9",
      solution: "#include <stdio.h>\n\n"
        + "int main(void) {\n"
        + "    int n;\n"
        + "    scanf(\"%d\", &n);\n"
        + "\n"
        + "    /* 倒三角：第 row 行打印 row 个井号，从 n 开始递减 */\n"
        + "    for (int row = n; row >= 1; row--) {\n"
        + "        for (int col = 1; col <= row; col++) {\n"
        + "            printf(\"#\");\n"
        + "        }\n"
        + "        printf(\"\\n\");\n"
        + "    }\n"
        + "\n"
        + "    /* 乘法表：每个乘积占 4 个字符宽 */\n"
        + "    for (int i = 1; i <= n; i++) {\n"
        + "        for (int j = 1; j <= n; j++) {\n"
        + "            printf(\"%4d\", i * j);\n"
        + "        }\n"
        + "        printf(\"\\n\");\n"
        + "    }\n"
        + "    return 0;\n"
        + "}",
      mastery: [
        "能独立用两层循环打印三角形、矩形和乘法表，并解释外层与内层的分工",
        "能通过让内层边界依赖外层变量来控制每行的内容",
        "图案不对时，能区分是行数问题还是每行个数问题，快速定位到哪一层"
      ]
    },
    {
      id: 16,
      title: "综合实战：素数判断 + 猜数字",
      minutes: 25,
      gist: "把分支、循环、break 组合起来，写出素数判断和一个带循环的猜数字小游戏。",
      lesson: "这一关不引入新语法，而是把前面几关的东西拼成两个能用的程序：判断素数、猜数字。\n"
        + "素数判断的思路：n 小于 2 时不是素数；否则从 2 开始试除，只要找到一个能整除 n 的因子，就确定它不是素数。有两个优化值得记住：一是试到根号 n 就够了——如果 n = a × b 且 a <= b，那么 a 一定不超过根号 n，所以循环条件写成 d * d <= n，既避开浮点开方又少算很多；二是找到因子立刻 break，不用把剩下的候选全部试完。判断「没找到因子」常用的做法是设一个 int isPrime = 1; 标记，找到就置 0，循环结束后统一判断——这样循环里不用写 return，逻辑更集中。\n"
        + "猜数字游戏要解决的是「不知道用户会猜几次」，所以用 while 循环。这里有个非常实用的写法：while (scanf(\"%d\", &guess) == 1) { … }。scanf 的返回值是成功读入的项数，读到文件结束返回 EOF，把它写进循环条件，输入结束循环自然停止，既不用事先知道猜几次，也不会因为读失败而在旧值上打转（Windows 控制台按 Ctrl+Z 再回车表示输入结束）。猜中时用 break 结束循环，循环后面的「统计猜了几次」照样执行——这正是 break 与 return 的区别：break 只结束循环，return 会结束整个函数。\n"
        + "把两部分拼在一起时，注意变量职责分开：isPrime 管素数结论，tries 管次数，guess 管当前输入，互不干扰，读起来才清楚。\n"
        + "调试建议：先用固定输入在本机多跑几组（比如 2、9、97 各试一次），确认每条分支都走到；写完再把 secret 改成 1 试试，验证「1 不是素数」这个边界也处理对了。",
      example: {
        code: "#include <stdio.h>\n\n"
          + "int main(void) {\n"
          + "    int n, isPrime = 1;\n"
          + "    scanf(\"%d\", &n);\n"
          + "\n"
          + "    if (n < 2) {\n"
          + "        isPrime = 0;                      /* 0 和 1 都不是素数 */\n"
          + "    }\n"
          + "    for (int d = 2; d * d <= n; d++) {\n"
          + "        if (n % d == 0) {\n"
          + "            isPrime = 0;\n"
          + "            break;                        /* 找到一个因子就够了 */\n"
          + "        }\n"
          + "    }\n"
          + "\n"
          + "    if (isPrime) {\n"
          + "        printf(\"%d is prime\\n\", n);\n"
          + "    } else {\n"
          + "        printf(\"%d is not prime\\n\", n);\n"
          + "    }\n"
          + "    return 0;\n"
          + "}",
        input: "97",
        output: "97 is prime",
        explain: "本例输入的是 97。第三个语句先把 isPrime 预设为 1（「暂时认为它是素数」），这就是标记变量的用法：循环只负责在发现反例时把它改成 0。"
          + "97 >= 2，所以第一个 if 不成立。接着 for 从 d = 2 开始试除，条件是 d * d <= 97，也就是 d 最大取到 9（10 × 10 = 100 已经超过 97）。2…9 都不能整除 97，循环自然结束，isPrime 保持 1，最后打印 97 is prime。"
          + "如果输入 91（7 × 13），d 走到 7 时 91 % 7 == 0，isPrime 被置 0 并 break，后面的 8、9 不再试——这就是 break 在查找类问题里的价值。"
          + "把输入换成 1：n < 2 成立，isPrime 直接置 0，输出 1 is not prime。边界情况单独处理，是这类判断能不能写对的关键。"
      },
      pitfalls: [
        "循环条件写成 `d <= n`：结果虽然对，但 n 稍大就要跑很久；写成 `d * d <= n` 效率高得多，也不用引入 sqrt 和浮点误差。",
        "忘了 n < 2 的情况：0 和 1 按试除法走完循环会被判成素数，必须单独排除。",
        "读输入却不判断 scanf 的返回值：`while (1) { scanf(…) }` 在读到文件结束或输入不是数字时，guess 保持旧值，循环可能永远不结束。",
        "把 `break` 写成 `return`：猜中时直接退出整个 main，循环后面的 Tries: 统计就不会执行了。"
      ],
      takeaways: [
        "素数判断：n < 2 先排除，试除到 d * d <= n，找到因子就 break",
        "用 isPrime 这类标记变量，把「循环里发现异常、循环后统一判断」写清楚",
        "scanf 返回成功读入的项数，写进 while 条件就能处理数量不定的输入",
        "break 只结束循环，循环后面的语句继续执行；return 结束整个函数"
      ],
      questions: [
        {
          q: "判断素数时把循环条件写成 `for (int d = 2; d * d <= n; d++)`，主要好处是？",
          options: [
            "少试很多候选因子，n 很大时明显更快",
            "能自动跳过所有偶数因子",
            "能保证 n 一定是素数",
            "这样写是错的，必须写 d <= n"
          ],
          answer: 0,
          explain: "如果 n 有因子，必有一个不超过根号 n，所以试到 d * d <= n 就够了，后面的候选不必再试。它不会自动跳过偶数（那要在循环里另做判断），也不保证 n 是素数（结论仍由是否找到因子决定）；条件本身完全合法，不是错的。"
        },
        {
          q: "`while (scanf(\"%d\", &guess) == 1)` 里 `== 1` 的含义是？",
          options: [
            "guess 的值必须等于 1",
            "成功读入 1 个整数才进入循环；读到文件结束或输入不匹配（返回 EOF 或 0）都会退出",
            "最多只能猜 1 次",
            "scanf 在任何情况下都返回 1"
          ],
          answer: 1,
          explain: "scanf 的返回值是成功读入的项数，格式串里只有一个 %d，所以读成功返回 1；读到文件结束返回 EOF，循环条件为假，循环自然结束。它与 guess 的值无关，也不限制猜的次数。"
        },
        {
          q: "猜数字程序里，猜中时用 `break` 退出循环；这样写的好处是？",
          options: [
            "结束整个程序，后面的语句都不执行",
            "跳过本轮剩余语句，继续读下一个 guess",
            "立即结束当前 while 循环，接着执行循环后面的 Tries 统计",
            "只能用在 switch 里，循环里用会编译报错"
          ],
          answer: 2,
          explain: "break 只结束当前这一层循环，循环后面的 printf(\"Tries: …\") 照常执行，这正是我们要的。结束整个程序是 return；「跳过本轮」是 continue；break 在循环里完全合法，是标准用法。"
        }
      ],
      passRatio: 0.8,
      mission: "写一个「先报素数、再猜数字」的完整程序。输入格式固定：第一行是一个整数 secret（1 到 100），它就是答案；之后每一行是一个整数 guess，直到猜中或输入结束。程序要求：1) 先用 for 循环加 break 判断 secret 是不是素数，输出 Secret is prime 或 Secret is not prime（注意 1 不是素数）；2) 再用 while (scanf(\"%d\", &guess) == 1) 反复读入猜测，每读一个就计一次数：比 secret 大输出 Too large，比 secret 小输出 Too small，猜中输出 Correct! 并用 break 结束循环；3) 循环结束后输出 Tries: N，N 是猜的总次数（猜中那次也算）。示例：依次输入 37、50、30、37，程序输出 Secret is prime、Too large、Too small、Correct!、Tries: 3 五行。",
      starter: "#include <stdio.h>\n\n"
        + "int main(void) {\n"
        + "    int secret, guess, isPrime = 1, tries = 0;\n"
        + "    scanf(\"%d\", &secret);\n"
        + "\n"
        + "    /* TODO: 判断 secret 是否为素数（secret < 2 要单独处理），找到因子就 break */\n"
        + "\n"
        + "    /* TODO: while (scanf(\"%d\", &guess) == 1) 里比较 guess 与 secret，猜中 break */\n"
        + "\n"
        + "    printf(\"Tries: %d\\n\", tries);\n"
        + "    return 0;\n"
        + "}",
      hint: "素数部分：secret < 2 时把 isPrime 置 0，否则用 for (int d = 2; d * d <= secret; d++) 试除，能整除就置 0 并 break，循环结束后用一次 if 输出结论。猜数字部分：把 tries = tries + 1; 放在循环体最前面，然后 if / else if / else 三路比较，猜中那一路先 printf(\"Correct!\\n\") 再 break。Tries 的 printf 要留在 while 外面。",
      check: {
        include: ["stdio.h"],
        return0: true,
        require: { "if": true, "for": true, "while": true, "loop": true },
        seq: [["break", ";"]],
        calls: [["scanf", "%d"], ["printf", "Correct!"], ["printf", "Tries:"]],
        minStatements: 10,
        forbid: ["gets", "goto", "system"],
        message: "需要 #include <stdio.h>、int main(void)、if 判断、for 找因子、while 读猜测、猜中时 break，并输出 Secret is prime / Correct! / Tries: ，最后 return 0;。",
        ok: "分支、循环、break 和全部输出都齐全，综合结构正确。"
      },
      input: "37\n50\n30\n37\n",
      expectedOutput: "Secret is prime\nToo large\nToo small\nCorrect!\nTries: 3",
      solution: "#include <stdio.h>\n\n"
        + "int main(void) {\n"
        + "    int secret, guess, isPrime, tries;\n"
        + "    scanf(\"%d\", &secret);\n"
        + "\n"
        + "    /* 第一步：先判断答案是不是素数 */\n"
        + "    isPrime = 1;\n"
        + "    if (secret < 2) {\n"
        + "        isPrime = 0;\n"
        + "    }\n"
        + "    for (int d = 2; d * d <= secret; d++) {\n"
        + "        if (secret % d == 0) {\n"
        + "            isPrime = 0;\n"
        + "            break;\n"
        + "        }\n"
        + "    }\n"
        + "    if (isPrime) {\n"
        + "        printf(\"Secret is prime\\n\");\n"
        + "    } else {\n"
        + "        printf(\"Secret is not prime\\n\");\n"
        + "    }\n"
        + "\n"
        + "    /* 第二步：反复读入猜测，直到猜中或输入结束 */\n"
        + "    tries = 0;\n"
        + "    while (scanf(\"%d\", &guess) == 1) {\n"
        + "        tries = tries + 1;\n"
        + "        if (guess == secret) {\n"
        + "            printf(\"Correct!\\n\");\n"
        + "            break;\n"
        + "        } else if (guess < secret) {\n"
        + "            printf(\"Too small\\n\");\n"
        + "        } else {\n"
        + "            printf(\"Too large\\n\");\n"
        + "        }\n"
        + "    }\n"
        + "    printf(\"Tries: %d\\n\", tries);\n"
        + "    return 0;\n"
        + "}",
      mastery: [
        "能独立写出素数判断：处理 n < 2 的边界、试除到 d * d <= n、用标记变量给出结论",
        "能用 while (scanf(…) == 1) 处理数量不定的输入，并用 break 在猜中时结束循环",
        "能把分支、循环、break 组合成一个完整的小程序，并说清每个变量的职责"
      ]
    }
  ]
});