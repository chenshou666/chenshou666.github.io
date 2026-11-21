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

  function setupKeyboard() {
    const map = {
      KeyA: "left",
      KeyD: "right",
      KeyW: "up",
      KeyS: "down",
      ArrowLeft: "left",
      ArrowRight: "right",
      ArrowUp: "up",
      ArrowDown: "down",
      KeyJ: "attack",
      KeyK: "s1",
      KeyL: "s2",
      KeyU: "s3",
      Digit1: "s1",
      Digit2: "s2",
      Digit3: "s3",
      Space: "attack",
    };

    window.addEventListener("keydown", (e) => {
      const k = map[e.code];
      if (!k) return;
      e.preventDefault();
      Input._keys[k] = true;
      if (k === "attack") Input.attackPressed = true;
      if (k === "s1") Input.s1Pressed = true;
      if (k === "s2") Input.s2Pressed = true;
      if (k === "s3") Input.s3Pressed = true;
    });

    window.addEventListener("keyup", (e) => {
      const k = map[e.code];
      if (!k) return;
      Input._keys[k] = false;
    });
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
  };

  global.GameInput = Input;
})(window);
