/**
 * 触摸 + 鼠标兼容：左摇杆 + 右侧技能键
 */
(function (global) {
  const Input = {
    moveX: 0,
    moveY: 0,
    attackPressed: false,
    s1Pressed: false,
    s2Pressed: false,
    s3Pressed: false,
    _keys: Object.create(null),
    capturing: false,
  };

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function setupJoystick() {
    const zone = document.getElementById("joystick-zone");
    const base = document.getElementById("joystick-base");
    const knob = document.getElementById("joystick-knob");
    if (!zone || !base || !knob) return;

    const maxRadius = 40;
    let activeId = null;
    let origin = { x: 0, y: 0 };

    function setKnob(dx, dy) {
      const len = Math.hypot(dx, dy) || 1;
      const scale = Math.min(1, maxRadius / len);
      const x = dx * scale;
      const y = dy * scale;
      knob.style.transform = `translate(${x}px, ${y}px)`;
      Input.moveX = x / maxRadius;
      Input.moveY = y / maxRadius;
    }

    function resetKnob() {
      knob.style.transform = "translate(0px, 0px)";
      Input.moveX = 0;
      Input.moveY = 0;
      activeId = null;
    }

    function getPoint(e, id) {
      if (e.changedTouches) {
        for (let i = 0; i < e.changedTouches.length; i++) {
          const t = e.changedTouches[i];
          if (id == null || t.identifier === id) return t;
        }
        return null;
      }
      return e;
    }

    function onStart(e) {
      if (document.body.classList.contains("layout-editing")) return;
      e.preventDefault();
      const p = getPoint(e);
      if (!p) return;
      if (e.changedTouches) activeId = p.identifier;
      else activeId = "mouse";
      const rect = base.getBoundingClientRect();
      origin.x = rect.left + rect.width / 2;
      origin.y = rect.top + rect.height / 2;
      setKnob(p.clientX - origin.x, p.clientY - origin.y);
    }

    function onMove(e) {
      if (activeId == null) return;
      const p = getPoint(e, activeId === "mouse" ? null : activeId);
      if (!p) return;
      e.preventDefault();
      setKnob(p.clientX - origin.x, p.clientY - origin.y);
    }

    function onEnd(e) {
      if (activeId == null) return;
      if (e.changedTouches) {
        let found = false;
        for (let i = 0; i < e.changedTouches.length; i++) {
          if (e.changedTouches[i].identifier === activeId) found = true;
        }
        if (!found) return;
      } else if (activeId !== "mouse") {
        return;
      }
      resetKnob();
    }

    zone.addEventListener("touchstart", onStart, { passive: false });
    zone.addEventListener("touchmove", onMove, { passive: false });
    zone.addEventListener("touchend", onEnd, { passive: false });
    zone.addEventListener("touchcancel", onEnd, { passive: false });

    zone.addEventListener("mousedown", onStart);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onEnd);
  }

  function bindSkillButton(id, flag) {
    const el = document.getElementById(id);
    if (!el) return;

    const press = (e) => {
      if (document.body.classList.contains("layout-editing")) return;
      e.preventDefault();
      e.stopPropagation();
      Input[flag] = true;
      el.classList.add("pressed");
    };
    const release = () => {
      el.classList.remove("pressed");
    };

    el.addEventListener("touchstart", press, { passive: false });
    el.addEventListener("touchend", release, { passive: false });
    el.addEventListener("touchcancel", release, { passive: false });
    el.addEventListener("mousedown", press);
    el.addEventListener("mouseup", release);
    el.addEventListener("mouseleave", release);
  }

  function setupButtons() {
    bindSkillButton("btn-attack", "attackPressed");
    bindSkillButton("btn-s1", "s1Pressed");
    bindSkillButton("btn-s2", "s2Pressed");
    bindSkillButton("btn-s3", "s3Pressed");
  }

  /* ------------------------------------------------
   * 键位绑定（可调节 + localStorage 持久化）
   * ------------------------------------------------ */
  const BIND_STORE = "stickman.keys.v1";
  const ACTION_LABELS = {
    left: "左移", right: "右移", up: "上移", down: "下移",
    attack: "普攻", s1: "瞬步·居合", s2: "旋风升龙", s3: "影袭·燕返"
  };
  const ACTIONS = ["left", "right", "up", "down", "attack", "s1", "s2", "s3"];
  const DEFAULT_BINDINGS = {
    left: ["KeyA", "ArrowLeft"],
    right: ["KeyD", "ArrowRight"],
    up: ["KeyW", "ArrowUp"],
    down: ["KeyS", "ArrowDown"],
    attack: ["KeyJ", "Space"],
    s1: ["KeyK", "Digit1"],
    s2: ["KeyL", "Digit2"],
    s3: ["KeyU", "Digit3"]
  };

  function cloneBindings(src) {
    const out = {};
    ACTIONS.forEach((a) => { out[a] = (src[a] || []).slice(); });
    return out;
  }

  let bindings = (function loadBindings() {
    const out = cloneBindings(DEFAULT_BINDINGS);
    try {
      const raw = localStorage.getItem(BIND_STORE);
      if (raw) {
        const o = JSON.parse(raw) || {};
        ACTIONS.forEach((a) => {
          if (Array.isArray(o[a]) && o[a].length) out[a] = o[a].map(String).slice(0, 3);
        });
      }
    } catch (e) {}
    return out;
  })();

  function saveBindings() {
    try { localStorage.setItem(BIND_STORE, JSON.stringify(bindings)); } catch (e) {}
  }

  function codeToAction(code) {
    for (let i = 0; i < ACTIONS.length; i++) {
      if (bindings[ACTIONS[i]].indexOf(code) >= 0) return ACTIONS[i];
    }
    return null;
  }

  function codeLabel(code) {
    if (!code) return "";
    if (code === "Space") return "空格";
    if (code === "ArrowLeft") return "←";
    if (code === "ArrowRight") return "→";
    if (code === "ArrowUp") return "↑";
    if (code === "ArrowDown") return "↓";
    if (/^Shift/.test(code)) return "Shift";
    if (/^Control/.test(code)) return "Ctrl";
    if (/^Alt/.test(code)) return "Alt";
    if (/^Digit/.test(code)) return code.slice(5);
    if (/^Key/.test(code)) return code.slice(3);
    if (/^Numpad/.test(code)) return "小键盘" + code.slice(6);
    return code;
  }

  Input.getBindings = function () { return cloneBindings(bindings); };
  Input.getBindingLabels = function () { return ACTION_LABELS; };
  Input.codeLabel = codeLabel;

  Input.setBinding = function (action, code) {
    if (ACTIONS.indexOf(action) < 0 || !code) return false;
    for (let i = 0; i < ACTIONS.length; i++) {
      const other = ACTIONS[i];
      if (other !== action && bindings[other].indexOf(code) >= 0) return false;
    }
    const prev = bindings[action][0];
    bindings[action] = [code];
    if (prev && prev !== code) {
      /* 保留旧键作为备用（不重复、最多 3 个） */
      if (bindings[action].indexOf(prev) < 0) bindings[action].push(prev);
    }
    saveBindings();
    return true;
  };

  Input.resetBindings = function () {
    bindings = cloneBindings(DEFAULT_BINDINGS);
    saveBindings();
  };

  function setupKeyboard() {
    window.addEventListener("keydown", (e) => {
      if (Input.capturing) return;
      const k = codeToAction(e.code);
      if (!k) return;
      e.preventDefault();
      Input._keys[k] = true;
      if (k === "attack") Input.attackPressed = true;
      if (k === "s1") Input.s1Pressed = true;
      if (k === "s2") Input.s2Pressed = true;
      if (k === "s3") Input.s3Pressed = true;
    });

    window.addEventListener("keyup", (e) => {
      if (Input.capturing) return;
      const k = codeToAction(e.code);
      if (!k) return;
      Input._keys[k] = false;
    });
  }

  /* ------------------------------------------------
   * 键位设置界面（开始页 / 游戏内都能打开）
   * ------------------------------------------------ */
  let pendingAction = null;

  const KEY_CHOICES = (function () {
    const list = [];
    for (let i = 0; i < 26; i++) list.push("Key" + String.fromCharCode(65 + i));
    for (let i = 0; i <= 9; i++) list.push("Digit" + i);
    return list.concat(["Space", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "ShiftLeft", "ControlLeft", "AltLeft", "Enter"]);
  })();

  function keyOptionsHtml(action) {
    const used = {};
    ACTIONS.forEach((a) => {
      if (a !== action) bindings[a].forEach((c) => { used[c] = true; });
    });
    return KEY_CHOICES.map((code) => {
      const disabled = used[code] ? " disabled" : "";
      const selected = bindings[action][0] === code ? " selected" : "";
      return '<option value="' + code + '"' + disabled + selected + '>' + codeLabel(code) + "</option>";
    }).join("");
  }

  function syncSkillHints() {
    const map = { attack: "btn-attack", s1: "btn-s1", s2: "btn-s2", s3: "btn-s3" };
    Object.keys(map).forEach((action) => {
      const el = document.querySelector("#" + map[action] + " .key");
      if (el) el.textContent = bindings[action].map((c) => codeLabel(c)).join("/");
    });
  }

  function renderKeysList() {
    const list = document.getElementById("keysList");
    if (!list) return;
    list.innerHTML = ACTIONS.map((a) => {
      const chips = bindings[a].map((c) => '<span class="key-chip">' + codeLabel(c) + "</span>").join("");
      return (
        '<div class="keys-row" data-action="' + a + '">' +
        '<span class="keys-name">' + ACTION_LABELS[a] + "</span>" +
        '<span class="keys-codes">' + chips + "</span>" +
        '<select class="keys-select" data-bind="' + a + '" aria-label="修改' + ACTION_LABELS[a] + '键位">' +
        keyOptionsHtml(a) +
        "</select>" +
        "</div>"
      );
    }).join("");
    syncSkillHints();
  }

  function setCapturing(action) {
    const list = document.getElementById("keysList");
    if (!list) return;
    list.querySelectorAll(".keys-row").forEach((row) => {
      row.classList.toggle("capturing", row.getAttribute("data-action") === action);
      const btn = row.querySelector(".keys-edit");
      if (btn) btn.textContent = row.getAttribute("data-action") === action ? "按键…" : "修改";
    });
  }

  function cancelCapture() {
    pendingAction = null;
    Input.capturing = false;
    setCapturing(null);
  }

  function openKeysPanel() {
    const panel = document.getElementById("keys-panel");
    if (!panel) return;
    renderKeysList();
    panel.classList.remove("hidden");
    if (global.Game && global.Game.setPaused) global.Game.setPaused(true);
  }

  function closeKeysPanel() {
    const panel = document.getElementById("keys-panel");
    if (!panel) return;
    cancelCapture();
    panel.classList.add("hidden");
    if (global.Game && global.Game.setPaused) global.Game.setPaused(false);
  }


  /* ------------------------------------------------
   * 按钮位置调整（摇杆 / 技能区，可拖动 + 持久化）
   * ------------------------------------------------ */
  const LAYOUT_STORE = "stickman.layout.v1";
  let layout = { joyX: 0, joyY: 0, padX: 0, padY: 0 };

  function loadLayout() {
    try {
      const raw = localStorage.getItem(LAYOUT_STORE);
      if (raw) {
        const o = JSON.parse(raw) || {};
        ["joyX", "joyY", "padX", "padY"].forEach((k) => {
          if (typeof o[k] === "number" && isFinite(o[k])) layout[k] = o[k];
        });
      }
    } catch (e) {}
  }

  function applyLayout() {
    const zone = document.getElementById("joystick-zone");
    const pad = document.getElementById("skill-pad");
    if (zone) zone.style.transform = "translate(" + layout.joyX + "px," + layout.joyY + "px)";
    if (pad) pad.style.transform = "translate(" + layout.padX + "px," + layout.padY + "px)";
  }

  function saveLayout() {
    try { localStorage.setItem(LAYOUT_STORE, JSON.stringify(layout)); } catch (e) {}
  }

  function clampLayout() {
    const zone = document.getElementById("joystick-zone");
    const pad = document.getElementById("skill-pad");
    const maxX = Math.max(0, window.innerWidth - 80);
    const maxY = Math.max(0, window.innerHeight - 80);
    layout.joyX = Math.max(-maxX, Math.min(maxX, layout.joyX));
    layout.joyY = Math.max(-maxY, Math.min(maxY, layout.joyY));
    layout.padX = Math.max(-maxX, Math.min(maxX, layout.padX));
    layout.padY = Math.max(-maxY, Math.min(maxY, layout.padY));
    if (zone) zone.style.transform = "translate(" + layout.joyX + "px," + layout.joyY + "px)";
    if (pad) pad.style.transform = "translate(" + layout.padX + "px," + layout.padY + "px)";
  }

  let editingLayout = false;

  function setLayoutEditing(on) {
    editingLayout = !!on;
    document.body.classList.toggle("layout-editing", editingLayout);
    const bar = document.getElementById("layout-bar");
    if (bar) bar.classList.toggle("hidden", !editingLayout);
    if (editingLayout) {
      clampLayout();
      if (global.Game && global.Game.setPaused) global.Game.setPaused(true);
    }
  }

  function setupLayoutEditor() {
    loadLayout();
    applyLayout();

    const zone = document.getElementById("joystick-zone");
    const pad = document.getElementById("skill-pad");
    const targets = [
      { el: zone, keys: ["joyX", "joyY"] },
      { el: pad, keys: ["padX", "padY"] }
    ];

    targets.forEach((t) => {
      if (!t.el) return;
      let drag = null;
      t.el.addEventListener("pointerdown", (e) => {
        if (!editingLayout) return;
        e.preventDefault();
        try { if (t.el.setPointerCapture) t.el.setPointerCapture(e.pointerId); } catch (err) {}
        drag = {
          id: e.pointerId,
          startX: e.clientX,
          startY: e.clientY,
          baseX: layout[t.keys[0]],
          baseY: layout[t.keys[1]]
        };
      });
      t.el.addEventListener("pointermove", (e) => {
        if (!drag || e.pointerId !== drag.id) return;
        e.preventDefault();
        layout[t.keys[0]] = drag.baseX + (e.clientX - drag.startX);
        layout[t.keys[1]] = drag.baseY + (e.clientY - drag.startY);
        clampLayout();
      });
      const end = (e) => {
        if (!drag || e.pointerId !== drag.id) return;
        drag = null;
        saveLayout();
      };
      t.el.addEventListener("pointerup", end);
      t.el.addEventListener("pointercancel", end);
    });

    const editBtn = document.getElementById("btn-layout-edit");
    if (editBtn) editBtn.addEventListener("click", () => {
      closeKeysPanel();
      setLayoutEditing(true);
    });
    const saveBtn = document.getElementById("btn-layout-save");
    if (saveBtn) saveBtn.addEventListener("click", () => {
      saveLayout();
      setLayoutEditing(false);
      if (global.Game && global.Game.setPaused) global.Game.setPaused(false);
    });
    const resetBtn = document.getElementById("btn-layout-reset");
    if (resetBtn) resetBtn.addEventListener("click", () => {
      layout = { joyX: 0, joyY: 0, padX: 0, padY: 0 };
      saveLayout();
      applyLayout();
    });

    window.addEventListener("resize", () => { if (editingLayout) clampLayout(); });
  }

  function setupKeysUI() {
    const openBtns = [document.getElementById("btn-keys"), document.getElementById("btn-hud-keys")];
    openBtns.forEach((b) => { if (b) b.addEventListener("click", openKeysPanel); });
    const done = document.getElementById("btn-keys-done");
    const close = document.getElementById("btn-keys-close");
    if (done) done.addEventListener("click", closeKeysPanel);
    if (close) close.addEventListener("click", closeKeysPanel);
    const reset = document.getElementById("btn-keys-reset");
    if (reset) reset.addEventListener("click", () => {
      Input.resetBindings();
      renderKeysList();
    });
    const exit = document.getElementById("btn-keys-exit");
    if (exit) exit.addEventListener("click", () => {
      closeKeysPanel();
      if (global.Game && global.Game.backToStart) global.Game.backToStart();
    });

    document.addEventListener("change", (e) => {
      const sel = e.target && e.target.closest ? e.target.closest("[data-bind]") : null;
      if (!sel) return;
      const action = sel.getAttribute("data-bind");
      const ok = Input.setBinding(action, sel.value);
      renderKeysList();
      if (!ok) {
        const row = document.querySelector('.keys-row[data-action="' + action + '"]');
        if (row) {
          row.classList.add("conflict");
          window.setTimeout(() => row.classList.remove("conflict"), 900);
        }
      }
    });

    syncSkillHints();
  }

  Input.consume = function consume(flag) {
    if (Input[flag]) {
      Input[flag] = false;
      return true;
    }
    return false;
  };

  Input.getMove = function getMove() {
    let x = Input.moveX;
    let y = Input.moveY;
    if (Input._keys.left) x -= 1;
    if (Input._keys.right) x += 1;
    if (Input._keys.up) y -= 1;
    if (Input._keys.down) y += 1;
    const len = Math.hypot(x, y);
    if (len > 1) {
      x /= len;
      y /= len;
    }
    return { x: clamp(x, -1, 1), y: clamp(y, -1, 1) };
  };

  Input.init = function init() {
    setupJoystick();
    setupButtons();
    setupKeyboard();
    setupKeysUI();
    setupLayoutEditor();
  };

  global.GameInput = Input;
})(window);
