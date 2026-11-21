(function (global) {
  'use strict';

  const U = 96; // 1U ≈ 火柴人身宽 96px

  const Galewakizashi = {
    id: 'gale_wakizashi',
    name: '疾风忍刀',
    maxHp: 1000,
    U: U,

    // 普攻4段连段配置
    combos: [
      {
        name: '1A·横斩',
        windup: 0.10,
        active: 0.05,
        recovery: 0.15,
        stepX: 0.3 * U,
        hitbox: { w: 1.5 * U, h: 0.8 * U, offsetX: 0.75 * U, offsetY: 0 },
        hits: [{ time: 0, dmg: 30, stun: 0.25, pushX: 0.25 * U, launchZ: 0, airTime: 0 }],
        canCancelSkill: false,
        vfx: 'slash_h'
      },
      {
        name: '2A·上挑',
        windup: 0.12,
        active: 0.05,
        recovery: 0.18,
        stepX: 0.3 * U,
        hitbox: { w: 1.6 * U, h: 0.8 * U, offsetX: 0.8 * U, offsetY: -4 },
        hits: [{ time: 0, dmg: 35, stun: 0.30, pushX: 0.25 * U, launchZ: 0, airTime: 0 }],
        canCancelSkill: false,
        vfx: 'slash_up'
      },
      {
        name: '3A·旋转斩',
        windup: 0.15,
        active: 0.12,
        recovery: 0.20,
        stepX: 0.5 * U,
        hitbox: { w: 1.8 * U, h: 1.0 * U, offsetX: 0.6 * U, offsetY: 0 },
        hits: [
          { time: 0.00, dmg: 25, stun: 0.40, pushX: 0.2 * U, launchZ: 0, airTime: 0 },
          { time: 0.06, dmg: 25, stun: 0.40, pushX: 0.3 * U, launchZ: 0, airTime: 0 }
        ],
        canCancelSkill: false,
        vfx: 'spin'
      },
      {
        name: '4A·下劈',
        windup: 0.20,
        active: 0.08,
        recovery: 0.45,
        stepX: 0.8 * U,
        hitbox: { w: 2.0 * U, h: 1.0 * U, offsetX: 0.9 * U, offsetY: 0 },
        hits: [
          { time: 0, dmg: 60, stun: 0.80, pushX: 0.4 * U, launchZ: 2.2 * U, airTime: 0.80 }
        ],
        canCancelSkill: true, // 4A后摇可被任意技能取消
        vfx: 'heavy_arc'
      }
    ],

    // 3个无消耗CD技能
    skills: {
      s1: {
        id: 's1',
        name: '瞬步·居合',
        cd: 6.0,
        windup: 0.12,
        active: 0.08,
        recovery: 0.25,
        teleportX: 4.5 * U,
        hitbox: { w: 4.5 * U, h: 1.0 * U, offsetX: -2.25 * U, offsetY: 0 }, // 覆盖瞬移路径
        hits: [
          { time: 0, dmg: 120, stun: 0.60, pushX: 0.8 * U, launchZ: 0, airTime: 0 }
        ],
        vfx: 'iai'
      },
      s2: {
        id: 's2',
        name: '旋风升龙斩',
        cd: 8.0,
        windup: 0.15,
        active: 0.30,
        recovery: 0.35,
        moveX: 1.5 * U,
        allowYShift: 0.8 * U,
        selfJumpZ: 2.0 * U,
        selfJumpTime: 0.55,
        hitbox: { w: 2.2 * U, h: 1.6 * U, offsetX: 0.7 * U, offsetY: 0 },
        hits: [
          { time: 0.00, dmg: 40, stun: 0.50, pushX: 0.15 * U, launchZ: 1.2 * U, airTime: 0.60 },
          { time: 0.10, dmg: 40, stun: 0.60, pushX: 0.15 * U, launchZ: 1.8 * U, airTime: 0.80 },
          { time: 0.20, dmg: 80, stun: 1.10, pushX: 0.30 * U, launchZ: 2.8 * U, airTime: 1.10 }
        ],
        vfx: 'rising_dragon'
      },
      s3: {
        id: 's3',
        name: '影袭·燕返',
        cd: 12.0,
        windup: 0.18,
        active: 0.45,
        recovery: 0.50,
        seekRange: 3.5 * U,
        grabDuration: 0.40,
        hitbox: { w: 2.4 * U, h: 1.2 * U, offsetX: 0, offsetY: 0 },
        hits: [
          { time: 0.02, dmg: 60, stun: 0.60, pushX: 0, launchZ: 2.6 * U, airTime: 0.65, isGrab: true },
          { time: 0.40, dmg: 180, stun: 0.90, pushX: 0.6 * U, launchZ: 1.4 * U, airTime: 0.65, isSlam: true }
        ],
        vfx: 'swallow_return'
      }
    }
  };

  global.Weapons = {
    U: U,
    Galewakizashi: Galewakizashi,
    current: Galewakizashi,
    getWeapon: function () {
      return Galewakizashi;
    }
  };
})(window);
