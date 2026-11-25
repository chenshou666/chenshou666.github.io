/* ============================================================================
 * audio-fx.js — 治愈系 Web Audio 合成音效 + Canvas 2D 动态极光星图引擎
 * 纯代码实时合成，零音频/图片文件，遵循 prefers-reduced-motion
 * ========================================================================== */
(function (global) {
  "use strict";

  var audioCtx = null;
  var soundEnabled = true;

  function ensureAudio() {
    if (!soundEnabled) return null;
    var AC = global.AudioContext || global.webkitAudioContext;
    if (!AC) return null;
    if (!audioCtx) {
      try {
        audioCtx = new AC();
      } catch (e) {
        return null;
      }
    }
    if (audioCtx.state === "suspended") {
      try { audioCtx.resume(); } catch (e) {}
    }
    return audioCtx;
  }

  function playTone(freq, duration, volume, type, delay) {
    var ctx = ensureAudio();
    if (!ctx) return;
    var now = ctx.currentTime + (delay || 0);
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = type || "sine";
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume || 0.06, now + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + (duration || 0.24));
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + (duration || 0.24) + 0.02);
  }

  // 五声音阶频率：val 从 +3 到 -3 依次对应清亮柔和的玻璃风铃音高
  var SCALE_MAP = {
    "3": 659.25,   // E5
    "2": 587.33,   // D5
    "1": 523.25,   // C5
    "0": 440.00,   // A4
    "-1": 392.00,  // G4
    "-2": 349.23,  // F4
    "-3": 329.63   // E4
  };

  var AudioFX = {
    isEnabled: function () { return soundEnabled; },
    setEnabled: function (on) { soundEnabled = !!on; },
    toggle: function () {
      soundEnabled = !soundEnabled;
      if (soundEnabled) this.playTap();
      return soundEnabled;
    },
    playTap: function () {
      playTone(523.25, 0.14, 0.045, "sine", 0);
      playTone(783.99, 0.16, 0.022, "triangle", 0.03);
    },
    playChoice: function (val) {
      var base = SCALE_MAP[String(val)] || 440;
      playTone(base, 0.28, 0.055, "sine", 0);
      playTone(base * 1.5, 0.22, 0.018, "triangle", 0.025);
    },
    playChapterClear: function () {
      var notes = [392.0, 493.88, 587.33, 783.99];
      for (var i = 0; i < notes.length; i++) {
        playTone(notes[i], 0.45, 0.048, "sine", i * 0.075);
      }
    },
    playReveal: function () {
      var notes = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99];
      for (var i = 0; i < notes.length; i++) {
        playTone(notes[i], 0.72, 0.046, "sine", i * 0.09);
      }
    }
  };

  // ==================== Canvas 2D 动态极光星图背景 ====================
  function hexToRgb(hex) {
    var h = (hex || "#38bdf8").replace("#", "");
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var num = parseInt(h, 16);
    if (isNaN(num)) return [56, 189, 248];
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  }

  var AuroraCanvas = (function () {
    var canvas = null;
    var ctx = null;
    var width = 0;
    var height = 0;
    var dpr = 1;
    var stars = [];
    var bursts = [];
    var targetC1 = [56, 189, 248];
    var targetC2 = [168, 85, 247];
    var curC1 = [56, 189, 248];
    var curC2 = [168, 85, 247];
    var reducedMotion = false;
    var rafId = 0;
    var t = 0;

    function resize() {
      if (!canvas) return;
      dpr = Math.min(global.devicePixelRatio || 1, 2);
      width = global.innerWidth;
      height = global.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!stars.length) {
        var count = Math.min(72, Math.max(36, Math.floor((width * height) / 22000)));
        for (var i = 0; i < count; i++) {
          stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            r: 0.6 + Math.random() * 1.5,
            a: 0.15 + Math.random() * 0.55,
            sp: 0.004 + Math.random() * 0.012,
            ph: Math.random() * Math.PI * 2
          });
        }
      }
    }

    function lerpColor(cur, tgt, k) {
      cur[0] += (tgt[0] - cur[0]) * k;
      cur[1] += (tgt[1] - cur[1]) * k;
      cur[2] += (tgt[2] - cur[2]) * k;
    }

    function drawFrame() {
      if (!ctx) return;
      t += reducedMotion ? 0.001 : 0.0065;
      lerpColor(curC1, targetC1, 0.045);
      lerpColor(curC2, targetC2, 0.045);

      ctx.clearRect(0, 0, width, height);

      // 三团柔和极光云
      var blobs = [
        {
          x: width * (0.24 + Math.sin(t * 0.9) * 0.1),
          y: height * (0.2 + Math.cos(t * 0.7) * 0.08),
          r: Math.max(width, height) * 0.44,
          rgb: curC1,
          alpha: 0.19
        },
        {
          x: width * (0.78 + Math.cos(t * 0.8) * 0.09),
          y: height * (0.28 + Math.sin(t * 0.6) * 0.1),
          r: Math.max(width, height) * 0.42,
          rgb: curC2,
          alpha: 0.17
        },
        {
          x: width * (0.5 + Math.sin(t * 0.5 + 1.4) * 0.12),
          y: height * (0.85 + Math.cos(t * 0.6) * 0.07),
          r: Math.max(width, height) * 0.4,
          rgb: [
            (curC1[0] + curC2[0]) * 0.5,
            (curC1[1] + curC2[1]) * 0.5,
            (curC1[2] + curC2[2]) * 0.5
          ],
          alpha: 0.12
        }
      ];

      for (var i = 0; i < blobs.length; i++) {
        var b = blobs[i];
        var g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        g.addColorStop(0, "rgba(" + Math.round(b.rgb[0]) + "," + Math.round(b.rgb[1]) + "," + Math.round(b.rgb[2]) + "," + b.alpha + ")");
        g.addColorStop(1, "rgba(5,7,15,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, width, height);
      }

      // 细碎星尘
      for (var s = 0; s < stars.length; s++) {
        var st = stars[s];
        var tw = 0.5 + 0.5 * Math.sin(t * 2.4 + st.ph);
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(226, 238, 255, " + (st.a * (0.45 + 0.55 * tw)).toFixed(3) + ")";
        ctx.fill();
      }

      // 选项点击绽放的微星粒子
      for (var p = bursts.length - 1; p >= 0; p--) {
        var pt = bursts[p];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.vx *= 0.96;
        pt.vy *= 0.96;
        pt.life -= 0.028;
        if (pt.life <= 0) {
          bursts.splice(p, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r * pt.life, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + pt.rgb[0] + "," + pt.rgb[1] + "," + pt.rgb[2] + "," + (pt.life * 0.85).toFixed(3) + ")";
        ctx.fill();
      }

      if (!reducedMotion) {
        rafId = global.requestAnimationFrame(drawFrame);
      }
    }

    return {
      init: function (el) {
        canvas = el;
        if (!canvas) return;
        ctx = canvas.getContext("2d");
        var mq = global.matchMedia && global.matchMedia("(prefers-reduced-motion: reduce)");
        reducedMotion = !!(mq && mq.matches);
        resize();
        global.addEventListener("resize", resize);
        if (reducedMotion) {
          drawFrame();
        } else {
          rafId = global.requestAnimationFrame(drawFrame);
        }
      },
      setPalette: function (hex1, hex2) {
        targetC1 = hexToRgb(hex1);
        targetC2 = hexToRgb(hex2);
        if (reducedMotion) {
          curC1 = targetC1.slice();
          curC2 = targetC2.slice();
          drawFrame();
        }
      },
      burstAt: function (x, y, hex) {
        if (reducedMotion || !ctx) return;
        var rgb = hexToRgb(hex || "#38bdf8");
        for (var i = 0; i < 14; i++) {
          var ang = (Math.PI * 2 * i) / 14 + Math.random() * 0.35;
          var spd = 1.6 + Math.random() * 3.4;
          bursts.push({
            x: x,
            y: y,
            vx: Math.cos(ang) * spd,
            vy: Math.sin(ang) * spd,
            r: 1.8 + Math.random() * 2.2,
            rgb: rgb,
            life: 1
          });
        }
      }
    };
  })();

  global.MBTI_AUDIO = AudioFX;
  global.MBTI_AURORA = AuroraCanvas;
})(window);
