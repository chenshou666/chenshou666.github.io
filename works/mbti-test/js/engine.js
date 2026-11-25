/* ============================================================================
 * engine.js — MBTI 专业级心理测量引擎（V2 零偏向高精度版）
 * 核心能力：
 *   1. 三档模式（pro: 90题 / standard: 60题 / quick: 30题），正反权重严格 0.00 对称
 *   2. 自适应边界决胜加试（Tie-breaker）：极近 50% 维度动态追加无中立 A/B 校准题
 *   3. 荣格八维认知功能双源融合（4 字母功能栈 + 题目直测功能信号）
 *   4. 相邻第二候选人格对照（边界型自动计算最接近替代类型与差异解析）
 *   5. 正反逻辑一致性信度体检 + 256 对双人契合度 + 1080p Canvas 高清海报
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

  var AXIS_DIFF_TIPS = {
    EI: {
      name: "能量流向（E / I）",
      tip: "两者核心差别在于「高压或疲惫后的回血方式」：E 型常在互动与表达中提神，I 型更需要彻底独处的静默时段来恢复满电。"
    },
    SN: {
      name: "认知透镜（S / N）",
      tip: "两者核心差别在于「信息第一落点」：S 型优先抓牢眼前具体事实、质感与成熟经验，N 型优先捕捉抽象规律、隐喻与未来可能。"
    },
    TF: {
      name: "决策天平（T / F）",
      tip: "两者核心差别在于「冲突时的第一标尺」：T 型倾向先对齐客观逻辑与统一标准，F 型倾向先照顾价值认同与相关人的真实感受。"
    },
    JP: {
      name: "生活节拍（J / P）",
      tip: "两者核心差别在于「对未定状态的感受」：J 型在尽早定案与清晰节点中感到安心，P 型在保留选择弹性与随境调整中更有活力。"
    }
  };

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function normalizeMode(mode) {
    if (mode === "quick") return "quick";
    if (mode === "pro") return "pro";
    return "standard"; // 兼容旧 "full" -> 60 题标准版
  }

  function getQuestionsForMode(mode, allQuestions) {
    var src = allQuestions || global.MBTI_QUESTIONS || [];
    var m = normalizeMode(mode);
    var maxTier = m === "quick" ? 1 : (m === "standard" ? 2 : 3);
    return src.filter(function (q) { return (q.tier || 1) <= maxTier; });
  }

  function strengthLabel(dominantPct) {
    if (dominantPct >= 80) return "极鲜明";
    if (dominantPct >= 66) return "鲜明";
    if (dominantPct >= 56) return "温和";
    return "边界融合";
  }

  // 根据 4 字母类型 + 实测 5 维百分比 + 题目直测功能信号，融合计算荣格八维（0-100）
  function computeCognitiveFunctions(typeCode, dims, typesMap, fnSignals) {
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

    var baseScores = {};
    var primaryWeights = [84, 71, 56, 40];
    var shadowWeights = [52, 46, 35, 30];
    for (var i = 0; i < 4; i++) {
      baseScores[stack[i]] = primaryWeights[i];
      baseScores[shadow[i]] = shadowWeights[i];
    }

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
    var hasDirect = !!(fnSignals && fnSignals.hasData);

    for (var j = 0; j < allOrder.length; j++) {
      var code = allOrder[j];
      var structural = clamp((baseScores[code] || 45) + (mod[code] || 0), 18, 96);
      if (hasDirect && fnSignals.max[code] > 0) {
        // 直测信号映射到 20~95 区间，按 35% 权重融入，保留实测个体差异
        var normSig = clamp(50 + (fnSignals.raw[code] / fnSignals.max[code]) * 45, 18, 96);
        scores[code] = Math.round(clamp(structural * 0.65 + normSig * 0.35, 18, 98));
      } else {
        scores[code] = Math.round(structural);
      }
    }

    // 确保主导功能视觉位序不低于劣势功能
    if (scores[stack[0]] < scores[stack[3]] + 6) {
      scores[stack[0]] = Math.min(98, scores[stack[3]] + 6);
    }

    return {
      stack: stack,
      shadow: shadow,
      scores: scores,
      hasDirectSignals: hasDirect
    };
  }

  // 检测需要边界自适应校准（Tie-breaker）的维度，返回待追加的高区分度双面题
  function getTiebreakQuestions(answers, questions, tiebreakersPool) {
    var qs = questions || [];
    var pool = tiebreakersPool || global.MBTI_TIEBREAKERS || [];
    var rawMap = { EI: 0, SN: 0, TF: 0, JP: 0, AT: 0 };
    var maxMap = { EI: 0, SN: 0, TF: 0, JP: 0, AT: 0 };
    var hashSeed = 0;

    for (var i = 0; i < qs.length; i++) {
      var q = qs[i];
      if (!Object.prototype.hasOwnProperty.call(answers, q.id)) continue;
      var v = clamp(Math.round(Number(answers[q.id]) || 0), -3, 3);
      var w = q.weight || 1;
      rawMap[q.dim] += v * q.pole * w;
      maxMap[q.dim] += 3 * w;
      hashSeed += (i + 1) * (v + 4);
    }

    var selected = [];
    for (var d = 0; d < DIM_ORDER.length; d++) {
      var dimId = DIM_ORDER[d];
      var ratio = maxMap[dimId] > 0 ? rawMap[dimId] / maxMap[dimId] : 0;
      // |ratio| < 0.055 相当于原始百分比落在 47.25% ~ 52.75%（极近 50/50 边界）
      if (Math.abs(ratio) < 0.055) {
        var candidates = pool.filter(function (tb) { return tb.dim === dimId; });
        if (candidates.length > 0) {
          // 按作答哈希交替选取 +1 / -1 题，消除左/右位置偏差
          var pick = candidates[(Math.abs(hashSeed) + d) % candidates.length];
          selected.push(pick);
        }
      }
    }
    return selected;
  }

  // 计算相邻第二候选人格（当四核心维度存在接近中线的维度时展示对照）
  function computeRunnerUps(type4, identity, dims, typesMap) {
    var types = typesMap || global.MBTI_TYPES || {};
    var coreDims = ["EI", "SN", "TF", "JP"];
    var ranked = coreDims.map(function (id, idx) {
      return { id: id, idx: idx, dom: dims[id].dominantPct, dimObj: dims[id] };
    }).sort(function (a, b) {
      return a.dom - b.dom;
    });

    var list = [];
    for (var i = 0; i < ranked.length; i++) {
      var item = ranked[i];
      // 所有 <=58% 的边界维都会生成候选；若都不 <=58% 但最接近的一维 <=64%，也给出 1 个最接近参照
      if (item.dom <= 58 || (i === 0 && item.dom <= 64)) {
        var chars = type4.split("");
        var poles = POLE_MAP[item.id];
        var flipped = chars[item.idx] === poles[0] ? poles[1] : poles[0];
        chars[item.idx] = flipped;
        var altCode = chars.join("");
        var altProf = types[altCode];
        var mainProf = types[type4];
        if (!altProf || !mainProf) continue;

        var margin = item.dom - (100 - item.dom); // 2% ~ 28%
        var similarity = Math.round(clamp(97 - margin * 1.05, 68, 96));
        var axisInfo = AXIS_DIFF_TIPS[item.id];
        list.push({
          code: altCode,
          fullCode: altCode + "-" + identity,
          name: altProf.name,
          en: altProf.en,
          dimId: item.id,
          axisName: axisInfo ? axisInfo.name : item.id,
          fromPole: item.dimObj.winner,
          toPole: flipped,
          marginPct: margin,
          similarity: similarity,
          mainStack: mainProf.stack.slice(0, 2).join(" → "),
          altStack: altProf.stack.slice(0, 2).join(" → "),
          tip: axisInfo ? axisInfo.tip : ""
        });
      }
      if (list.length >= 2) break;
    }
    return list;
  }

  // 主计分函数（支持主测题库 + 可选边界决胜加试题）
  function calculateResult(answers, questions, meta) {
    var mainQs = questions || global.MBTI_QUESTIONS || [];
    var extraQs = (meta && meta.tiebreakQuestions) ? meta.tiebreakQuestions : [];
    var allQs = mainQs.concat(extraQs);
    var typesMap = global.MBTI_TYPES || {};

    var buckets = {};
    for (var d = 0; d < DIM_ORDER.length; d++) {
      buckets[DIM_ORDER[d]] = {
        raw: 0,
        maxAbs: 0,
        answered: 0,
        posVals: [],
        negVals: [],
        coreRaw: 0, // 仅统计最高权重题（>=1.20）与决胜题，作为极端平局二次破平
        tiebroken: false
      };
    }

    var fnRaw = { Ni: 0, Ne: 0, Si: 0, Se: 0, Ti: 0, Te: 0, Fi: 0, Fe: 0 };
    var fnMax = { Ni: 0, Ne: 0, Si: 0, Se: 0, Ti: 0, Te: 0, Fi: 0, Fe: 0 };
    var hasFnData = false;

    var answeredCount = 0;
    var neutralCount = 0;
    var extremeCount = 0;
    var leftPressCount = 0;
    var rightPressCount = 0;
    var tiebreakAnswered = 0;

    for (var i = 0; i < allQs.length; i++) {
      var q = allQs[i];
      if (!Object.prototype.hasOwnProperty.call(answers, q.id)) continue;
      var val = Number(answers[q.id]);
      if (isNaN(val)) continue;
      val = clamp(Math.round(val), -3, 3);
      var w = q.weight || 1;
      var b = buckets[q.dim];
      if (!b) continue;

      var isTiebreak = i >= mainQs.length;
      if (isTiebreak) {
        tiebreakAnswered++;
        b.tiebroken = true;
      }

      answeredCount++;
      if (!isTiebreak) {
        if (val === 0) neutralCount++;
        if (Math.abs(val) === 3) extremeCount++;
        if (val > 0) leftPressCount++;
        if (val < 0) rightPressCount++;
      }

      var contrib = val * q.pole * w;
      b.raw += contrib;
      b.maxAbs += 3 * w;
      b.answered += 1;
      if (w >= 1.20 || isTiebreak) b.coreRaw += contrib;

      if (!isTiebreak) {
        if (q.pole > 0) b.posVals.push(val);
        else b.negVals.push(-val);
      }

      // 采集荣格认知功能直测信号
      if (q.fnPos && q.fnNeg) {
        hasFnData = true;
        var absW = 3 * w;
        fnMax[q.fnPos] += absW;
        fnMax[q.fnNeg] += absW;
        fnRaw[q.fnPos] += contrib;
        fnRaw[q.fnNeg] -= contrib;
      }
    }

    var dims = {};
    var consistencySum = 0;
    var consistencyDimCount = 0;

    for (var k = 0; k < DIM_ORDER.length; k++) {
      var dimId = DIM_ORDER[k];
      var bk = buckets[dimId];
      var ratio = bk.maxAbs > 0 ? bk.raw / bk.maxAbs : 0;
      var leftPct = Math.round(clamp(50 + ratio * 50, 1, 99));
      var rightPct = 100 - leftPct;
      var poles = POLE_MAP[dimId];

      // 破平：先看总 raw，若完全为 0 看核心高权重题 coreRaw
      var effectiveRaw = Math.abs(bk.raw) > 1e-6 ? bk.raw : bk.coreRaw;
      var isLeft = effectiveRaw >= 0;
      if (leftPct === 50) {
        leftPct = isLeft ? 51 : 49;
        rightPct = 100 - leftPct;
      }
      var winner = isLeft ? poles[0] : poles[1];
      var dominantPct = isLeft ? leftPct : rightPct;
      var borderline = dominantPct <= 55;

      // 计算单维正反逻辑一致性（Cronbach 方向检验）
      var dimConsistency = 0.85;
      if (bk.posVals.length > 0 && bk.negVals.length > 0) {
        var meanP = bk.posVals.reduce(function (a, c) { return a + c; }, 0) / bk.posVals.length;
        var meanN = bk.negVals.reduce(function (a, c) { return a + c; }, 0) / bk.negVals.length;
        var diff = Math.abs(meanP - meanN); // 0 ~ 6
        dimConsistency = clamp(1 - diff / 4.2, 0.15, 1);
        consistencySum += dimConsistency;
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
        tiebroken: bk.tiebroken,
        consistencyPct: Math.round(dimConsistency * 100),
        answered: bk.answered
      };
    }

    var type4 = dims.EI.winner + dims.SN.winner + dims.TF.winner + dims.JP.winner;
    var identity = dims.AT.winner;
    var fullCode = type4 + "-" + identity;

    // 专业信度评估
    var mainAnswered = Math.max(1, answeredCount - tiebreakAnswered);
    var neutralRatio = neutralCount / mainAnswered;
    var oneSideBias = Math.abs(leftPressCount - rightPressCount) / mainAnswered;
    var internalConsistency = consistencyDimCount ? consistencySum / consistencyDimCount : 0.82;
    var elapsedSec = meta && meta.elapsedSec ? meta.elapsedSec : 0;
    var avgSec = elapsedSec ? elapsedSec / answeredCount : 4;

    var modeResolved = normalizeMode(meta && meta.mode ? meta.mode : (mainQs.length >= 80 ? "pro" : (mainQs.length <= 35 ? "quick" : "standard")));
    // 90 题拥有更高的统计抽样稳定性微幅加分
    var lengthBonus = modeResolved === "pro" ? 3 : (modeResolved === "quick" ? -3 : 0);

    var reliabilityScore = Math.round(
      clamp(
        internalConsistency * 72 +
        (1 - clamp(neutralRatio * 1.4, 0, 1)) * 18 +
        (1 - clamp(Math.max(0, oneSideBias - 0.35) * 1.5, 0, 1)) * 10 +
        lengthBonus -
        (elapsedSec > 0 && avgSec < 1.1 ? 12 : 0),
        38,
        99
      )
    );

    var warnings = [];
    if (neutralRatio >= 0.38) {
      warnings.push("超过 38% 的题目选择了中立项，建议查看下方「相邻候选人格对照」综合参考。");
    }
    if (oneSideBias >= 0.72 && mainAnswered >= 20) {
      warnings.push("答题点选屏幕同一侧的比例较高（由于题库正反严格交替，这会拉低区分锐度）。");
    }
    if (internalConsistency < 0.62 && mainAnswered >= 20) {
      warnings.push("部分同维度的正反向题目作答存在拉扯，说明你处于跨场景灵活切换状态，可重点看各维百分比。");
    }
    if (elapsedSec > 0 && avgSec < 1.2 && mainAnswered >= 20) {
      warnings.push("本次答题速度极快，若有空可以放慢节奏按第一直觉复测验证。");
    }

    var reliabilityGrade = reliabilityScore >= 86 ? "专业级高信度" : (reliabilityScore >= 74 ? "良好" : (reliabilityScore >= 60 ? "中等" : "偏低"));
    var functions = computeCognitiveFunctions(type4, dims, typesMap, {
      hasData: hasFnData,
      raw: fnRaw,
      max: fnMax
    });
    var borderlineDims = DIM_ORDER.filter(function (id) { return dims[id].borderline; });
    var runnerUps = computeRunnerUps(type4, identity, dims, typesMap);

    return {
      code: type4,
      identity: identity,
      fullCode: fullCode,
      dims: dims,
      functions: functions,
      runnerUps: runnerUps,
      mode: modeResolved,
      answeredCount: answeredCount,
      totalCount: allQs.length,
      tiebreakCount: tiebreakAnswered,
      elapsedSec: elapsedSec,
      reliability: {
        score: reliabilityScore,
        grade: reliabilityGrade,
        consistencyPct: Math.round(internalConsistency * 100),
        neutralPct: Math.round(neutralRatio * 100),
        extremePct: Math.round((extremeCount / mainAnswered) * 100),
        warnings: warnings
      },
      borderlineDims: borderlineDims,
      isShared: !!(meta && meta.isShared)
    };
  }

  // 零方向剧透的盲测幕间里程碑（杜绝锚定效应，仅反馈进度、节奏与心理测量冷知识）
  function buildChapterMilestone(chapterIndex, answers, questions) {
    var qs = questions || [];
    var count = 0;
    var strongCount = 0;
    var neutralCount = 0;
    for (var i = 0; i < qs.length; i++) {
      var q = qs[i];
      if (Object.prototype.hasOwnProperty.call(answers, q.id)) {
        var v = Number(answers[q.id]);
        count++;
        if (Math.abs(v) >= 2) strongCount++;
        if (v === 0) neutralCount++;
      }
    }
    var strongPct = count ? Math.round((strongCount / count) * 100) : 50;
    var neutralPct = count ? Math.round((neutralCount / count) * 100) : 0;

    var paceNote;
    if (strongPct >= 62) {
      paceNote = "目前作答风格：态度鲜明果断（深度档位占比 " + strongPct + "%），光谱轮廓正在高速显影。";
    } else if (neutralPct >= 35) {
      paceNote = "目前作答风格：审慎保留灰度（中立档占比 " + neutralPct + "%），后续遇到略微倾向的题可放心轻偏一档。";
    } else {
      paceNote = "目前作答风格：直觉流畅、分寸细腻，正反向一致度正在后台静默校验中。";
    }

    return {
      answered: count,
      paceNote: paceNote
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

    var mindScore = sameN ? 91 : 64;
    if (a.group === b.group) mindScore = Math.min(97, mindScore + 5);
    if (isSoulmate) mindScore = Math.min(98, mindScore + 6);

    var commScore = clamp(66 + (sameN ? 16 : 0) + (sameT ? 11 : 6) + (isSoulmate ? 5 : 0), 58, 97);

    var rhythmScore = (sameJ ? 88 : 72) + (sameE ? 4 : 7);
    if (isSoulmate && !sameJ) rhythmScore += 7;
    rhythmScore = clamp(rhythmScore, 60, 96);

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

  // URL Hash 编解码
  function encodeResultHash(res) {
    if (!res || !res.dims) return "";
    return "#r=" + encodeURIComponent(res.fullCode) +
      "&e=" + res.dims.EI.leftPct +
      "&s=" + res.dims.SN.leftPct +
      "&t=" + res.dims.TF.leftPct +
      "&j=" + res.dims.JP.leftPct +
      "&a=" + res.dims.AT.leftPct +
      "&m=" + encodeURIComponent(res.mode || "standard");
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
        tiebroken: false,
        consistencyPct: 92,
        answered: 12
      };
    }

    return {
      code: code4,
      identity: idt,
      fullCode: code4 + "-" + idt,
      dims: dims,
      functions: computeCognitiveFunctions(code4, dims, types, null),
      runnerUps: computeRunnerUps(code4, idt, dims, types),
      mode: "shared",
      answeredCount: 90,
      totalCount: 90,
      tiebreakCount: 0,
      elapsedSec: 0,
      reliability: { score: 92, grade: "分享档案", consistencyPct: 92, neutralPct: 0, extremePct: 0, warnings: [] },
      borderlineDims: borderlineDims,
      isShared: true
    };
  }

  // Canvas 2D 高清人格分享海报（1080 × 1560）
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

    for (var s = 0; s < 55; s++) {
      var sx = ((s * 197) % W);
      var sy = ((s * 313) % H);
      var sr = (s % 3) * 0.8 + 0.9;
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255," + (0.15 + (s % 5) * 0.08) + ")";
      ctx.fill();
    }

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

    ctx.fillStyle = "rgba(226,236,255,0.72)";
    ctx.font = "600 24px " + fontStack;
    var modeBadge = result.mode === "pro" ? "90 题专业版" : (result.mode === "quick" ? "30 题精测版" : "60 题标准版");
    ctx.fillText("MBTI 人格光谱档案 · " + modeBadge, 108, 134);

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

    var codeGrad = ctx.createLinearGradient(108, 180, 560, 290);
    codeGrad.addColorStop(0, "#ffffff");
    codeGrad.addColorStop(0.55, profile.accent);
    codeGrad.addColorStop(1, profile.accent2);
    ctx.fillStyle = codeGrad;
    ctx.font = "800 124px " + fontStack;
    ctx.fillText(result.fullCode, 104, 298);

    ctx.fillStyle = "#ffffff";
    ctx.font = "700 44px " + fontStack;
    ctx.fillText(profile.name + " · " + profile.en, 108, 368);

    var idtLabel = result.identity === "A" ? "果断稳态型（Assertive）" : "谨慎精进型（Turbulent）";
    ctx.fillStyle = "rgba(226,236,255,0.76)";
    ctx.font = "500 26px " + fontStack;
    ctx.fillText(idtLabel + " · 信度 " + (result.reliability ? result.reliability.score : 92) + "/100", 108, 414);

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

      var trackX = 108;
      var trackY = yPos + 16;
      var trackW = W - 216;
      var trackH = 18;
      roundRectPath(ctx, trackX, trackY, trackW, trackH, 9);
      ctx.fillStyle = "rgba(255,255,255,0.1)";
      ctx.fill();

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
    normalizeMode: normalizeMode,
    getQuestionsForMode: getQuestionsForMode,
    getTiebreakQuestions: getTiebreakQuestions,
    calculateResult: calculateResult,
    computeCognitiveFunctions: computeCognitiveFunctions,
    computeRunnerUps: computeRunnerUps,
    buildChapterMilestone: buildChapterMilestone,
    computeCompatibility: computeCompatibility,
    encodeResultHash: encodeResultHash,
    decodeResultHash: decodeResultHash,
    renderPosterToDataURL: renderPosterToDataURL
  };
})(window);
