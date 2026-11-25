/* ============================================================================
 * engine.js — MBTI 心理测量计分引擎 · 八维推算 · 信度评估 · 双人契合度 · 海报生成
 * 零外部依赖，纯函数可被 Node 直接校验测试
 * ========================================================================== */
(function (global) {
  "use strict";

  var DIM_ORDER = ["EI", "SN", "TF", "JP", "AT"];
  var POLE_MAP = {
    EI: ["E", "I"],
    SN: ["S", "N"],
    TF: ["T", "F"],
    JP: ["J", "P"],
    AT: ["A", "T"]
  };

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function getQuestionsForMode(mode, allQuestions) {
    var src = allQuestions || global.MBTI_QUESTIONS || [];
    if (mode === "quick") {
      return src.filter(function (q) { return !!q.quick; });
    }
    return src.slice();
  }

  function strengthLabel(dominantPct) {
    if (dominantPct >= 80) return "极鲜明";
    if (dominantPct >= 66) return "鲜明";
    if (dominantPct >= 56) return "温和";
    return "边界融合";
  }

  // 根据 4 字母类型 + 实测 5 维百分比推算荣格八维认知功能能量（0-100）
  function computeCognitiveFunctions(typeCode, dims, typesMap) {
    var types = typesMap || global.MBTI_TYPES || {};
    var profile = types[typeCode];
    var stack = profile ? profile.stack : ["Ni", "Te", "Fi", "Se"];
    var oppMap = {
      Ni: "Ne", Ne: "Ni",
      Si: "Se", Se: "Si",
      Ti: "Te", Te: "Ti",
      Fi: "Fe", Fe: "Fi"
    };
    var shadow = stack.map(function (fn) { return oppMap[fn]; });

    // 基础位阶权重（主导 → 辅助 → 第三 → 劣势 + 4 个阴影功能）
    var baseScores = {};
    var primaryWeights = [84, 71, 56, 40];
    var shadowWeights = [52, 46, 35, 30];
    for (var i = 0; i < 4; i++) {
      baseScores[stack[i]] = primaryWeights[i];
      baseScores[shadow[i]] = shadowWeights[i];
    }

    // 用实测维度倾向强度对对应功能做细腻调制
    var ePct = dims.EI ? dims.EI.leftPct : 50;
    var iPct = 100 - ePct;
    var sPct = dims.SN ? dims.SN.leftPct : 50;
    var nPct = 100 - sPct;
    var tPct = dims.TF ? dims.TF.leftPct : 50;
    var fPct = 100 - tPct;

    var mod = {
      Ne: (nPct - 50) * 0.22 + (ePct - 50) * 0.14,
      Ni: (nPct - 50) * 0.22 + (iPct - 50) * 0.14,
      Se: (sPct - 50) * 0.22 + (ePct - 50) * 0.14,
      Si: (sPct - 50) * 0.22 + (iPct - 50) * 0.14,
      Te: (tPct - 50) * 0.22 + (ePct - 50) * 0.12,
      Ti: (tPct - 50) * 0.22 + (iPct - 50) * 0.12,
      Fe: (fPct - 50) * 0.22 + (ePct - 50) * 0.12,
      Fi: (fPct - 50) * 0.22 + (iPct - 50) * 0.12
    };

    var allOrder = ["Ni", "Ne", "Si", "Se", "Ti", "Te", "Fi", "Fe"];
    var scores = {};
    for (var j = 0; j < allOrder.length; j++) {
      var code = allOrder[j];
      scores[code] = Math.round(clamp((baseScores[code] || 45) + (mod[code] || 0), 18, 98));
    }

    // 确保主导功能视觉上不低于劣势功能
    if (scores[stack[0]] < scores[stack[1]]) scores[stack[0]] = Math.min(98, scores[stack[1]] + 4);

    return {
      stack: stack,
      shadow: shadow,
      scores: scores
    };
  }

  // 主计分函数
  function calculateResult(answers, questions, meta) {
    var qs = questions || global.MBTI_QUESTIONS || [];
    var typesMap = global.MBTI_TYPES || {};
    var buckets = {};
    for (var d = 0; d < DIM_ORDER.length; d++) {
      buckets[DIM_ORDER[d]] = {
        raw: 0,
        maxAbs: 0,
        answered: 0,
        posVals: [],
        negVals: []
      };
    }

    var answeredCount = 0;
    var neutralCount = 0;
    var extremeCount = 0;
    var leftPressCount = 0;
    var rightPressCount = 0;

    for (var i = 0; i < qs.length; i++) {
      var q = qs[i];
      if (!Object.prototype.hasOwnProperty.call(answers, q.id)) continue;
      var val = Number(answers[q.id]);
      if (isNaN(val)) continue;
      val = clamp(Math.round(val), -3, 3);
      var w = q.weight || 1;
      var b = buckets[q.dim];
      if (!b) continue;

      answeredCount++;
      if (val === 0) neutralCount++;
      if (Math.abs(val) === 3) extremeCount++;
      if (val > 0) leftPressCount++;
      if (val < 0) rightPressCount++;

      var contrib = val * q.pole * w;
      b.raw += contrib;
      b.maxAbs += 3 * w;
      b.answered += 1;
      if (q.pole > 0) b.posVals.push(val);
      else b.negVals.push(-val); // 反向题取负后与正向题同向，便于测内部一致性
    }

    var dims = {};
    var consistencySum = 0;
    var consistencyDimCount = 0;

    for (var k = 0; k < DIM_ORDER.length; k++) {
      var dimId = DIM_ORDER[k];
      var bk = buckets[dimId];
      // ratio ∈ [-1, +1]；>0 偏向首极，<0 偏向次极
      var ratio = bk.maxAbs > 0 ? bk.raw / bk.maxAbs : 0;
      var leftPct = Math.round(clamp(50 + ratio * 50, 1, 99));
      var rightPct = 100 - leftPct;
      var poles = POLE_MAP[dimId];
      // 恰好 50/50 时用微小正负 raw 决定（默认首极仅在 raw >= 0）
      var isLeft = bk.raw >= 0;
      if (leftPct === 50 && !isLeft) {
        leftPct = 49;
        rightPct = 51;
      } else if (leftPct === 50 && isLeft) {
        leftPct = 51;
        rightPct = 49;
      }
      var winner = isLeft ? poles[0] : poles[1];
      var dominantPct = isLeft ? leftPct : rightPct;
      var borderline = dominantPct <= 55;

      // 计算同维度内部一致性（正向题均值 vs 反向题取反均值之接近度）
      if (bk.posVals.length > 0 && bk.negVals.length > 0) {
        var meanP = bk.posVals.reduce(function (a, c) { return a + c; }, 0) / bk.posVals.length;
        var meanN = bk.negVals.reduce(function (a, c) { return a + c; }, 0) / bk.negVals.length;
        var diff = Math.abs(meanP - meanN); // 0 ~ 6
        consistencySum += clamp(1 - diff / 4.2, 0.15, 1);
        consistencyDimCount++;
      }

      dims[dimId] = {
        id: dimId,
        leftCode: poles[0],
        rightCode: poles[1],
        leftPct: leftPct,
        rightPct: rightPct,
        winner: winner,
        dominantPct: dominantPct,
        strength: strengthLabel(dominantPct),
        borderline: borderline,
        answered: bk.answered
      };
    }

    var type4 = dims.EI.winner + dims.SN.winner + dims.TF.winner + dims.JP.winner;
    var identity = dims.AT.winner; // "A" 或 "T"
    var fullCode = type4 + "-" + identity;

    // 评估作答信度
    var neutralRatio = answeredCount ? neutralCount / answeredCount : 0;
    var oneSideBias = answeredCount ? Math.abs(leftPressCount - rightPressCount) / answeredCount : 0;
    var internalConsistency = consistencyDimCount ? consistencySum / consistencyDimCount : 0.8;
    var elapsedSec = meta && meta.elapsedSec ? meta.elapsedSec : 0;
    var avgSec = answeredCount && elapsedSec ? elapsedSec / answeredCount : 4;

    var reliabilityScore = Math.round(
      clamp(
        internalConsistency * 72 +
        (1 - clamp(neutralRatio * 1.4, 0, 1)) * 18 +
        (1 - clamp(Math.max(0, oneSideBias - 0.35) * 1.5, 0, 1)) * 10 -
        (elapsedSec > 0 && avgSec < 1.1 ? 12 : 0),
        38,
        99
      )
    );

    var warnings = [];
    if (neutralRatio >= 0.4) {
      warnings.push("你在超过 40% 的题目选择了中立项，部分维度可能更接近边界态。");
    }
    if (oneSideBias >= 0.72 && answeredCount >= 20) {
      warnings.push("答题偏向屏幕同一侧的比例较高（由于题库正反交替，这可能降低部分维度的锐度）。");
    }
    if (elapsedSec > 0 && avgSec < 1.2 && answeredCount >= 20) {
      warnings.push("本次答题节奏飞快，若有兴趣可以放慢脚步按第一直觉复测对比。");
    }

    var reliabilityGrade = reliabilityScore >= 85 ? "极高" : (reliabilityScore >= 72 ? "良好" : (reliabilityScore >= 58 ? "中等" : "偏低"));
    var functions = computeCognitiveFunctions(type4, dims, typesMap);

    // 找出所有边界维度
    var borderlineDims = DIM_ORDER.filter(function (id) { return dims[id].borderline; });

    return {
      code: type4,
      identity: identity,
      fullCode: fullCode,
      dims: dims,
      functions: functions,
      mode: (meta && meta.mode) || (qs.length <= 35 ? "quick" : "full"),
      answeredCount: answeredCount,
      totalCount: qs.length,
      elapsedSec: elapsedSec,
      reliability: {
        score: reliabilityScore,
        grade: reliabilityGrade,
        neutralPct: Math.round(neutralRatio * 100),
        extremePct: answeredCount ? Math.round((extremeCount / answeredCount) * 100) : 0,
        warnings: warnings
      },
      borderlineDims: borderlineDims,
      isShared: !!(meta && meta.isShared)
    };
  }

  // 每幕完成后的趣味阶段洞察（不剧透 4 字母，仅提供氛围线索）
  function buildChapterInsight(chapterIndex, answers, questions) {
    var qs = questions || [];
    var sub = {};
    var count = 0;
    var dec = 0;
    for (var i = 0; i < qs.length; i++) {
      var q = qs[i];
      if (Object.prototype.hasOwnProperty.call(answers, q.id)) {
        var v = Number(answers[q.id]);
        count++;
        if (Math.abs(v) >= 2) dec++;
        sub[q.dim] = (sub[q.dim] || 0) + v * q.pole * (q.weight || 1);
      }
    }
    var decPct = count ? Math.round((dec / count) * 100) : 50;
    var lines = [];

    if (chapterIndex === 1) {
      lines.push((sub.EI || 0) >= 0
        ? "你的能量星图闪烁出「向外辐射」的活跃电弧，世界和人群似乎是你不小的灵感源泉。"
        : "你的能量磁场呈现出沉静的「内聚深海」质感，独处和深度对话更能让你电力满格。");
    } else if (chapterIndex === 2) {
      lines.push((sub.SN || 0) >= 0
        ? "你对现实质地、可靠细节和此时此地的真实触感拥有敏锐雷达。"
        : "你的感知透镜正不断捕捉抽象规律与隐藏连线，思维自带「跳跃望远镜」属性。");
    } else if (chapterIndex === 3) {
      lines.push((sub.TF || 0) >= 0
        ? "面对两难岔路口，你的第一把标尺偏向清澈利落的因果逻辑与客观公平。"
        : "你的决策罗盘带着细腻温热的共情磁场，人与人的真实感受在你心里分量极重。");
    } else if (chapterIndex === 4) {
      lines.push((sub.JP || 0) >= 0
        ? "你欣赏清晰可控的航线与落袋为安的秩序感，事情有交代才会让心彻底踏实。"
        : "你的生活节拍偏爱风的自由度——保留弹性与随时拐进惊喜小巷的权力让你如鱼得水。");
    } else {
      lines.push("全部 5 幕心理切面已采集完毕！你的独特人格光谱正准备点亮星盘。");
    }

    var paceNote = decPct >= 65
      ? "目前你的立场果断度高达 " + decPct + "%，轮廓相当鲜明！"
      : (decPct <= 30
        ? "目前你展现出极高的辩证与灰度视角，性格底色细腻多面。"
        : "目前果断与留白兼具，信号采集非常稳定。");

    return {
      clue: lines[0],
      paceNote: paceNote,
      answered: count
    };
  }

  // 双人 MBTI 契合度实验室算法
  function computeCompatibility(codeA, codeB, typesMap) {
    var types = typesMap || global.MBTI_TYPES || {};
    var a = types[codeA];
    var b = types[codeB];
    if (!a || !b) return null;

    var sameE = codeA[0] === codeB[0];
    var sameN = codeA[1] === codeB[1];
    var sameT = codeA[2] === codeB[2];
    var sameJ = codeA[3] === codeB[3];

    var isSoulmate = (a.relationships.soulmates.indexOf(codeB) >= 0) || (b.relationships.soulmates.indexOf(codeA) >= 0);
    var isAlly = (a.relationships.allies.indexOf(codeB) >= 0) || (b.relationships.allies.indexOf(codeA) >= 0);
    var isMirror = codeA === codeB;

    // 4 个细分子分数（0 - 100）
    // 1. 思维共振（N/S 一致权重最高）
    var mindScore = sameN ? 91 : 64;
    if (a.group === b.group) mindScore = Math.min(97, mindScore + 5);
    if (isSoulmate) mindScore = Math.min(98, mindScore + 6);

    // 2. 沟通顺畅度（N/S + T/F）
    var commScore = 66 + (sameN ? 16 : 0) + (sameT ? 11 : 6) + (isSoulmate ? 5 : 0);
    commScore = clamp(commScore, 58, 97);

    // 3. 生活节拍（J/P 与 E/I 平衡）
    var rhythmScore = (sameJ ? 88 : 72) + (sameE ? 4 : 7);
    if (isSoulmate && !sameJ) rhythmScore += 7;
    rhythmScore = clamp(rhythmScore, 60, 96);

    // 4. 互补张力与新鲜感
    var diffCount = (sameE ? 0 : 1) + (sameN ? 0 : 1) + (sameT ? 0 : 1) + (sameJ ? 0 : 1);
    var sparkScore = diffCount === 2 ? 93 : (diffCount === 3 ? 89 : (diffCount === 1 ? 82 : (diffCount === 4 ? 86 : 78)));
    if (isSoulmate) sparkScore = Math.max(sparkScore, 95);

    var overall = Math.round(mindScore * 0.30 + commScore * 0.28 + rhythmScore * 0.20 + sparkScore * 0.22);
    if (isSoulmate) overall = clamp(Math.max(overall, 92), 92, 98);
    else if (isMirror) overall = clamp(Math.max(overall, 86), 84, 91);
    else if (isAlly) overall = clamp(Math.max(overall, 84), 83, 92);

    var tier, badge, summary;
    if (isMirror) {
      tier = "同频镜像双子";
      badge = "默契满分";
      summary = "你们像彼此世界里的另一面镜子，不用过多解释就能秒懂对方的脑回路与小坚持；唯一要注意的是别把彼此同样的盲区一起放大。";
    } else if (isSoulmate) {
      tier = "黄金灵魂拍档";
      badge = "高能天作";
      summary = "经典的「内核共振 + 外在互补」高能组合！你们在看待世界的底色上自然投契，又能用彼此擅长的认知功能替对方补齐短板，越相处越上头。";
    } else if (isAlly) {
      tier = "默契同盟伙伴";
      badge = "自在合拍";
      summary = "沟通成本很低、彼此欣赏度极高的舒适关系。你们拥有足够多的共同语言，又保留恰到好处的个性差异，无论做挚友、搭档还是伴侣都很舒展。";
    } else if (diffCount === 4) {
      tier = "引力反差冒险";
      badge = "极致互补";
      summary = "四维全异的「平行宇宙碰撞」！初期最容易互相惊讶「你怎么会这么想」，但只要多一份好奇少一份评判，彼此能为对方打开一整扇从未见过的世界大门。";
    } else {
      tier = "磨合共进搭档";
      badge = "差异成长";
      summary = "你们带着不同的视角与节奏相遇。虽然在某些决策和生活习惯上需要磨合，但正是这份差异让团队或关系拥有更全面的抗风险能力。";
    }

    var highlights = [];
    if (sameN) {
      highlights.push(codeA[1] === "N"
        ? "同为直觉派（N）：聊天极易跳出琐碎日常，从灵感脑洞一路畅谈到未来构想。"
        : "同为实感派（S）：务实落地、审美与生活细节高度合拍，相处踏实不飘。");
    } else {
      highlights.push("实感（S）× 直觉（N）组合：一个负责仰望星空看趋势，一个负责把脚踩稳做落地。");
    }

    if (!sameE) {
      highlights.push("外向（E）× 内向（I）平衡：一个带动活力与破冰，一个沉淀深度与倾听，刚好互补。");
    } else {
      highlights.push(codeA[0] === "E"
        ? "双外向（E）：见面永远不缺话题与笑声，一起探索新鲜事物能量加倍！"
        : "双内向（I）：舒适的安静陪伴者，哪怕各做各的事不说话也完全不会尴尬。");
    }

    var tips = [];
    if (!sameT) {
      tips.push("决策视角不同（T vs F）：理性方先给一句温柔共情再提方案，感性方理解对方的直白是真心想帮你解决难题。");
    } else {
      tips.push(codeA[2] === "T"
        ? "双方都偏理性（T）：讨论高效不拐弯，记得偶尔刻意表达一下赞美和情感温度。"
        : "双方都重情感（F）：彼此共情细腻温暖，面对现实难题时不妨一起列一张客观清单。");
    }
    if (!sameJ) {
      tips.push("生活节奏不同（J vs P）：提前约定「哪些大事必须定死时间，哪些小事可以自由随兴」，立刻少掉 80% 摩擦。");
    } else {
      tips.push(codeA[3] === "J"
        ? "双判断（J）：规划感与执行力拉满，偶发变动时一起深呼吸放松一点会更快乐。"
        : "双感知（P）：好玩自由无压力，但重要约定或账单最好设一个共享提醒兜底。");
    }

    return {
      codeA: codeA,
      codeB: codeB,
      overall: overall,
      tier: tier,
      badge: badge,
      summary: summary,
      metrics: [
        { label: "思维共振", value: mindScore },
        { label: "沟通顺畅", value: commScore },
        { label: "生活节拍", value: rhythmScore },
        { label: "互补火花", value: sparkScore }
      ],
      highlights: highlights,
      tips: tips
    };
  }

  // URL Hash 编解码（支持纯静态分享结果，无需后端）
  function encodeResultHash(res) {
    if (!res || !res.dims) return "";
    return "#r=" + encodeURIComponent(res.fullCode) +
      "&e=" + res.dims.EI.leftPct +
      "&s=" + res.dims.SN.leftPct +
      "&t=" + res.dims.TF.leftPct +
      "&j=" + res.dims.JP.leftPct +
      "&a=" + res.dims.AT.leftPct;
  }

  function decodeResultHash(hashStr, typesMap) {
    var types = typesMap || global.MBTI_TYPES || {};
    if (!hashStr || hashStr.indexOf("#r=") !== 0) return null;
    var query = hashStr.slice(1).split("&");
    var map = {};
    for (var i = 0; i < query.length; i++) {
      var kv = query[i].split("=");
      if (kv.length === 2) map[kv[0]] = decodeURIComponent(kv[1]);
    }
    var rawCode = (map.r || "").toUpperCase();
    var m = rawCode.match(/^([EI][SN][TF][JP])-([AT])$/);
    if (!m || !types[m[1]]) return null;

    var code4 = m[1];
    var idt = m[2];
    function parsePct(v, fallback) {
      var n = parseInt(v, 10);
      return isNaN(n) ? fallback : clamp(n, 1, 99);
    }

    var specs = [
      ["EI", parsePct(map.e, code4[0] === "E" ? 68 : 32), code4[0]],
      ["SN", parsePct(map.s, code4[1] === "S" ? 68 : 32), code4[1]],
      ["TF", parsePct(map.t, code4[2] === "T" ? 68 : 32), code4[2]],
      ["JP", parsePct(map.j, code4[3] === "J" ? 68 : 32), code4[3]],
      ["AT", parsePct(map.a, idt === "A" ? 66 : 34), idt]
    ];

    var dims = {};
    var borderlineDims = [];
    for (var j = 0; j < specs.length; j++) {
      var dimId = specs[j][0];
      var leftPct = specs[j][1];
      var winner = specs[j][2];
      var poles = POLE_MAP[dimId];
      // 保障 winner 与 pct 方向一致
      if (winner === poles[0] && leftPct < 51) leftPct = 51;
      if (winner === poles[1] && leftPct > 49) leftPct = 49;
      var rightPct = 100 - leftPct;
      var dom = winner === poles[0] ? leftPct : rightPct;
      var bl = dom <= 55;
      if (bl) borderlineDims.push(dimId);
      dims[dimId] = {
        id: dimId,
        leftCode: poles[0],
        rightCode: poles[1],
        leftPct: leftPct,
        rightPct: rightPct,
        winner: winner,
        dominantPct: dom,
        strength: strengthLabel(dom),
        borderline: bl,
        answered: 12
      };
    }

    return {
      code: code4,
      identity: idt,
      fullCode: code4 + "-" + idt,
      dims: dims,
      functions: computeCognitiveFunctions(code4, dims, types),
      mode: "shared",
      answeredCount: 60,
      totalCount: 60,
      elapsedSec: 0,
      reliability: { score: 92, grade: "分享档案", neutralPct: 0, extremePct: 0, warnings: [] },
      borderlineDims: borderlineDims,
      isShared: true
    };
  }

  // 纯 Canvas 2D 绘制高清人格分享海报（1080 × 1560，零外部依赖）
  function roundRectPath(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function wrapLines(ctx, text, maxWidth) {
    var chars = String(text || "").split("");
    var lines = [];
    var cur = "";
    for (var i = 0; i < chars.length; i++) {
      var test = cur + chars[i];
      if (ctx.measureText(test).width > maxWidth && cur) {
        lines.push(cur);
        cur = chars[i];
      } else {
        cur = test;
      }
    }
    if (cur) lines.push(cur);
    return lines;
  }

  function renderPosterToDataURL(result) {
    var types = global.MBTI_TYPES || {};
    var groups = global.MBTI_GROUPS || {};
    var dimMeta = global.MBTI_DIMENSIONS || {};
    var fnMeta = global.MBTI_FUNCTIONS || {};
    var profile = types[result.code];
    if (!profile) return "";
    var group = groups[profile.group];

    var W = 1080;
    var H = 1560;
    var canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    var ctx = canvas.getContext("2d");

    // 1. 深空底色 + 极光渐变光晕
    ctx.fillStyle = "#060913";
    ctx.fillRect(0, 0, W, H);

    var g1 = ctx.createRadialGradient(220, 240, 20, 220, 240, 620);
    g1.addColorStop(0, profile.accent + "55");
    g1.addColorStop(1, "rgba(6,9,19,0)");
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, W, H);

    var g2 = ctx.createRadialGradient(880, 1240, 20, 880, 1240, 620);
    g2.addColorStop(0, profile.accent2 + "44");
    g2.addColorStop(1, "rgba(6,9,19,0)");
    ctx.fillStyle = g2;
    ctx.fillRect(0, 0, W, H);

    // 细微星点装饰
    for (var s = 0; s < 55; s++) {
      var sx = ((s * 197) % W);
      var sy = ((s * 313) % H);
      var sr = (s % 3) * 0.8 + 0.9;
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255," + (0.15 + (s % 5) * 0.08) + ")";
      ctx.fill();
    }

    // 2. 主玻璃卡片容器
    roundRectPath(ctx, 56, 56, W - 112, H - 112, 42);
    var cardGrad = ctx.createLinearGradient(56, 56, W - 56, H - 56);
    cardGrad.addColorStop(0, "rgba(255,255,255,0.11)");
    cardGrad.addColorStop(0.5, "rgba(18,26,48,0.68)");
    cardGrad.addColorStop(1, "rgba(255,255,255,0.08)");
    ctx.fillStyle = cardGrad;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(255,255,255,0.22)";
    ctx.stroke();

    var fontStack = '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif';

    // 顶栏标签
    ctx.fillStyle = "rgba(226,236,255,0.72)";
    ctx.font = "600 24px " + fontStack;
    ctx.fillText("MBTI 人格光谱档案 · SPECTRUM REPORT", 108, 134);

    // 阵营胶囊
    var grpText = (group ? group.name : profile.group) + " · 稀有度 " + profile.rarity;
    ctx.font = "600 22px " + fontStack;
    var grpW = ctx.measureText(grpText).width + 44;
    roundRectPath(ctx, W - 108 - grpW, 102, grpW, 46, 23);
    ctx.fillStyle = profile.accent + "2b";
    ctx.fill();
    ctx.strokeStyle = profile.accent + "88";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = "#ffffff";
    ctx.fillText(grpText, W - 108 - grpW + 22, 133);

    // 超大渐变 MBTI 代码
    var codeGrad = ctx.createLinearGradient(108, 180, 560, 290);
    codeGrad.addColorStop(0, "#ffffff");
    codeGrad.addColorStop(0.55, profile.accent);
    codeGrad.addColorStop(1, profile.accent2);
    ctx.fillStyle = codeGrad;
    ctx.font = "800 124px " + fontStack;
    ctx.fillText(result.fullCode, 104, 298);

    // 称号 + 英文
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 44px " + fontStack;
    ctx.fillText(profile.name + " · " + profile.en, 108, 368);

    // 变体副标
    var idtLabel = result.identity === "A" ? "果断稳态型（Assertive）" : "谨慎精进型（Turbulent）";
    ctx.fillStyle = "rgba(226,236,255,0.76)";
    ctx.font = "500 26px " + fontStack;
    ctx.fillText(idtLabel, 108, 414);

    // 座右铭卡片
    roundRectPath(ctx, 104, 452, W - 208, 120, 24);
    ctx.fillStyle = "rgba(255,255,255,0.065)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.14)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = "#f1f5ff";
    ctx.font = "500 27px " + fontStack;
    var mottoLines = wrapLines(ctx, "「" + profile.motto + "」", W - 272);
    for (var ml = 0; ml < mottoLines.length && ml < 2; ml++) {
      ctx.fillText(mottoLines[ml], 136, 502 + ml * 42);
    }

    // 关键词胶囊
    var kx = 104;
    var ky = 608;
    ctx.font = "600 23px " + fontStack;
    for (var kw = 0; kw < profile.keywords.length; kw++) {
      var tag = "# " + profile.keywords[kw];
      var tw = ctx.measureText(tag).width + 36;
      if (kx + tw > W - 104) {
        kx = 104;
        ky += 56;
      }
      roundRectPath(ctx, kx, ky, tw, 44, 22);
      ctx.fillStyle = "rgba(255,255,255,0.085)";
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.16)";
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.fillStyle = "#e2ecff";
      ctx.fillText(tag, kx + 18, ky + 30);
      kx += tw + 14;
    }

    // 5 大维度光谱条
    var barStartY = ky + 96;
    ctx.fillStyle = "rgba(226,236,255,0.78)";
    ctx.font = "700 26px " + fontStack;
    ctx.fillText("五维性格光谱", 108, barStartY);

    var yPos = barStartY + 42;
    for (var di = 0; di < DIM_ORDER.length; di++) {
      var dimId = DIM_ORDER[di];
      var dObj = result.dims[dimId];
      var dm = dimMeta[dimId];
      var isLeft = dObj.winner === dObj.leftCode;
      var winLabel = isLeft ? (dm.left.label + " " + dObj.leftCode) : (dm.right.label + " " + dObj.rightCode);

      ctx.font = "600 23px " + fontStack;
      ctx.fillStyle = "#ffffff";
      ctx.fillText(dm.name + " · " + winLabel + " " + dObj.dominantPct + "%", 108, yPos);

      ctx.fillStyle = "rgba(190,205,230,0.72)";
      ctx.font = "500 21px " + fontStack;
      var rightInfo = dm.left.code + " " + dObj.leftPct + "%  /  " + dObj.rightPct + "% " + dm.right.code;
      var riW = ctx.measureText(rightInfo).width;
      ctx.fillText(rightInfo, W - 108 - riW, yPos);

      // 轨道
      var trackX = 108;
      var trackY = yPos + 16;
      var trackW = W - 216;
      var trackH = 18;
      roundRectPath(ctx, trackX, trackY, trackW, trackH, 9);
      ctx.fillStyle = "rgba(255,255,255,0.1)";
      ctx.fill();

      // 填充条（从获胜端亮起）
      var fillW = Math.max(24, Math.round((trackW * dObj.dominantPct) / 100));
      var fillX = isLeft ? trackX : (trackX + trackW - fillW);
      var bGrad = ctx.createLinearGradient(fillX, trackY, fillX + fillW, trackY);
      bGrad.addColorStop(0, isLeft ? dm.colorLeft : dm.colorRight);
      bGrad.addColorStop(1, profile.accent);
      roundRectPath(ctx, fillX, trackY, fillW, trackH, 9);
      ctx.fillStyle = bGrad;
      ctx.fill();

      yPos += 78;
    }

    // 荣格四核心认知功能栈
    var fnY = yPos + 22;
    ctx.fillStyle = "rgba(226,236,255,0.78)";
    ctx.font = "700 26px " + fontStack;
    ctx.fillText("荣格核心认知功能栈", 108, fnY);

    var stack = result.functions.stack;
    var roleNames = ["主导", "辅助", "第三", "劣势"];
    var boxGap = 18;
    var boxW = Math.floor((W - 216 - boxGap * 3) / 4);
    for (var fi = 0; fi < 4; fi++) {
      var fCode = stack[fi];
      var fm = fnMeta[fCode] || { name: fCode, tag: "" };
      var bx = 108 + fi * (boxW + boxGap);
      var by = fnY + 24;
      roundRectPath(ctx, bx, by, boxW, 126, 20);
      ctx.fillStyle = fi === 0 ? (profile.accent + "2a") : "rgba(255,255,255,0.065)";
      ctx.fill();
      ctx.strokeStyle = fi === 0 ? (profile.accent + "88") : "rgba(255,255,255,0.14)";
      ctx.lineWidth = 1.4;
      ctx.stroke();

      ctx.fillStyle = "rgba(190,205,230,0.78)";
      ctx.font = "600 19px " + fontStack;
      ctx.fillText(roleNames[fi], bx + 20, by + 34);

      ctx.fillStyle = "#ffffff";
      ctx.font = "800 34px " + fontStack;
      ctx.fillText(fCode, bx + 20, by + 78);

      ctx.fillStyle = "rgba(226,236,255,0.85)";
      ctx.font = "500 20px " + fontStack;
      ctx.fillText(fm.name, bx + 20, by + 110);
    }

    // 底部落款
    ctx.strokeStyle = "rgba(255,255,255,0.14)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(108, H - 156);
    ctx.lineTo(W - 108, H - 156);
    ctx.stroke();

    ctx.fillStyle = "rgba(226,236,255,0.72)";
    ctx.font = "600 23px " + fontStack;
    ctx.fillText("尘狩 · MBTI 人格光谱测试", 108, H - 106);

    ctx.fillStyle = "rgba(190,205,230,0.58)";
    ctx.font = "500 22px " + fontStack;
    var urlStr = "chenshou666.github.io";
    var uW = ctx.measureText(urlStr).width;
    ctx.fillText(urlStr, W - 108 - uW, H - 106);

    return canvas.toDataURL("image/png");
  }

  global.MBTI_ENGINE = {
    DIM_ORDER: DIM_ORDER,
    getQuestionsForMode: getQuestionsForMode,
    calculateResult: calculateResult,
    computeCognitiveFunctions: computeCognitiveFunctions,
    buildChapterInsight: buildChapterInsight,
    computeCompatibility: computeCompatibility,
    encodeResultHash: encodeResultHash,
    decodeResultHash: decodeResultHash,
    renderPosterToDataURL: renderPosterToDataURL
  };
})(window);
