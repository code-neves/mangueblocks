/*
 * Koi ASCII Pond — Native Module 27541 Implementation (Fixed & Scaled)
 */
const koi = (() => {
  const $ = id => document.getElementById(id);
  const canvas = $('bg') || document.querySelector('canvas.pond-canvas') || document.querySelector('canvas');
  if (!canvas || !canvas.getContext) return { kick() {} };

  const TAU = 2 * Math.PI, STEP = 1 / 60;

  // Visual sizing controls (1 = original size). Tune independently.
  const KOI_SCALE = 1.0;
  const ROCK_SCALE = 1.85;

const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);
const rand = (lo, hi) => lo + Math.random() * (hi - lo);
const seededRandom = seed => {
  let a = seed >>> 0;
  return () => {
    a += 0x6D2B79F5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
const smoothstep = (e, t, r) => {
  let i = clamp((r - e) / (t - e), 0, 1);
  return i * i * (3 - 2 * i);
};

const angleDelta = (e, t) => {
  let r = (t - e) % TAU;
  return r > Math.PI ? r - TAU : r < -Math.PI ? r + TAU : r;
};

const hash = (e, t, r) => {
  let i = Math.imul(0 | e, 0x165667b1) ^ Math.imul(0 | t, 0x27d4eb2f) ^ Math.imul(0 | r, 0x55fdc781);
  i = Math.imul(i ^ (i >>> 13), 0x4bf19f61);
  return ((i ^= i >>> 16) >>> 0) / 0x100000000;
};

const VARIETIES = [['kohaku', 3], ['sanke', 2], ['tancho', 1], ['ogon', 1]];
const VARIETY_WEIGHT_SUM = VARIETIES.reduce((e, [, r]) => e + r, 0);
const pickVariety = () => {
  let e = Math.random() * VARIETY_WEIGHT_SUM;
  for (let [t, r] of VARIETIES) if ((e -= r) <= 0) return t;
  return 'kohaku';
};

const rippleDuration = r => 2.2 + 1.6 * r.strength;

function bodyRadiusProfile(e) {
  return e < 0.12
  ? 0.11 * Math.pow(Math.sin((e / 0.12) * Math.PI / 2), 0.55)
  : e < 0.3
  ? 0.11 + 0.025 * smoothstep(0.12, 0.3, e)
  : 0.033 + 0.102 * (1 - smoothstep(0.3, 0.74, e));
}

function checkFin(e, t, r, i, n, s, l) {
  let o = 0.85 * bodyRadiusProfile(r),
             a = Math.cos(i),
             h = Math.sin(i),
             c = e - r,
             u = t - o;
             if (((c * a + u * h - n) / n) ** 2 + ((-c * h + u * a) / s) ** 2 > 1) return false;
             l.flag = 2; l.du = c; l.da = u;
  return true;
}

const DARK_PALETTE = {
  bg: [18, 28, 47], white: [242, 237, 225], red: [255, 112, 87], black: [47, 61, 88],
  fin: [160, 178, 202], eye: [8, 15, 27], water: [126, 151, 244], shadow: [4, 10, 22],
  shadowAlpha: 0.42, pellet: [255, 197, 91], gold: [236, 184, 82],
  alpha: 0.92, depthFloor: 0.48, tile: [0.72, 0.98],
  hi: [[151, 47, 69], [195, 55, 73], [229, 75, 73], [248, 112, 77], [255, 157, 91], [255, 198, 125]],
  goldHi: [[154, 104, 44], [190, 128, 48], [220, 157, 59], [241, 184, 77], [255, 209, 105]],
  ink: 0.62
};

function cssRGB(variable, fallback) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  const hex = value.match(/^#([0-9a-f]{6})$/i);
  if (hex) {
    return [0, 2, 4].map(index => parseInt(hex[1].slice(index, index + 2), 16));
  }
  const rgb = value.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  return rgb ? [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])] : fallback.slice();
}

function createLightPalette() {
  const ink = cssRGB('--koi-navy', [52, 67, 95]);
  const coral = cssRGB('--koi-coral', [241, 111, 89]);
  const ivory = cssRGB('--koi-ivory', [255, 247, 233]);
  const fin = cssRGB('--koi-fin', [154, 170, 197]);
  const water = cssRGB('--koi-water', [146, 136, 238]);
  const gold = cssRGB('--koi-gold', [232, 184, 77]);
  const highContrast = document.documentElement.dataset.hc === '1';

  return {
    bg: cssRGB('--bg', [249, 249, 252]),
    white: ivory,
    red: coral,
    black: ink,
    fin,
    eye: [23, 36, 60],
    water,
    shadow: ink,
    shadowAlpha: highContrast ? 0.25 : 0.16,
    pellet: gold,
    gold,
    alpha: highContrast ? 1 : 0.96,
    depthFloor: highContrast ? 0.78 : 0.66,
    tile: [0.78, 0.99],
    hi: [
      lerpColor(coral, [132, 54, 83], 0.38),
      lerpColor(coral, [176, 54, 76], 0.24),
      coral,
      lerpColor(coral, [255, 157, 91], 0.34),
      lerpColor(coral, [255, 191, 116], 0.58),
      lerpColor(coral, [255, 222, 168], 0.76)
    ],
    goldHi: [
      lerpColor(gold, [145, 101, 45], 0.42),
      lerpColor(gold, [171, 119, 48], 0.25),
      gold,
      lerpColor(gold, [255, 211, 111], 0.48),
      lerpColor(gold, [255, 232, 164], 0.72)
    ],
    shadowColor: ink,
    ink: highContrast ? 0.76 : 0.64
  };
}

const GLYPH_CHARS = 't%SX8@#';
const SUBPIXEL_OFFSETS = [0.25, 0.25, 0.75, 0.25, 0.25, 0.75, 0.75, 0.75];

function edgeGlyph(e, t) {
  let r = Math.hypot(e, t) || 1;
  return Math.abs(t) < 0.38 * r ? '-' : Math.abs(e) < 0.38 * r ? '|' : e * t > 0 ? '\\' : '/';
}

function perlinNoise2D(e, t, r) {
  let i = Math.floor(e), n = Math.floor(t);
  let s = smoothstep(0, 1, e - i), l = smoothstep(0, 1, t - n);
  let o = hash(i, n, r), a = hash(i + 1, n, r), h = hash(i, n + 1, r);
  return o + (a - o) * s + (h - o) * l + (o - a - h + hash(i + 1, n + 1, r)) * s * l;
}

const packColor = e => (e[0] << 16) | (e[1] << 8) | e[2];
const lerpColor = (e, t, r) => [
  (e[0] + (t[0] - e[0]) * r) | 0,
             (e[1] + (t[1] - e[1]) * r) | 0,
             (e[2] + (t[2] - e[2]) * r) | 0
];
const scaleColor = (e, t) => [0 | Math.min(255, e[0] * t), 0 | Math.min(255, e[1] * t), 0 | Math.min(255, e[2] * t)];

class World {
  constructor() {
    this.width = this.height = this.time = 0;
    this.koi = []; this.pellets = []; this.bites = []; this.ripples = [];
    this.lastFeed = -Infinity;
    this.pointer = { x: 0, y: 0, speed: 0, active: false };
    this.avoid = [];
    this.rocks = [];
    this.rockSeed = (Math.random() * 0xffffffff) >>> 0;
  }

  resize(e, t) {
    let r = this.width === 0;
    this.width = e; this.height = t;
    if (r) this.seed();
  }

  seed() {
    let { width: e, height: t } = this;
    let r = clamp(0.5 * Math.min(e, t), 170, 420);
    let i = clamp(Math.round((e * t) / 240000), 3, 6);
    let n = 2 * (e >= 1024);
    this.koi = [];

    for (let l = 0; l < i + n; l++) {
      let isSmall = l >= i;
      let length = r * KOI_SCALE * (isSmall ? rand(0.32, 0.45) : rand(0.6, 1.0));
      let depthMax = isSmall ? 0.72 : 1.0;
      let heading = rand(0, TAU);
      let x = rand(0.1 * e, 0.9 * e), y = rand(0.1 * t, 0.9 * t);
      let nodes = new Float32Array(40);
      let spacing = length / 19;

      for (let seg = 0; seg < 20; seg++) {
        nodes[2 * seg] = x - Math.cos(heading) * spacing * seg;
        nodes[2 * seg + 1] = y - Math.sin(heading) * spacing * seg;
      }

      this.koi.push({
        id: l + 1, variety: pickVariety(), length, nodes, heading,
                    speed: 20, phase: rand(0, TAU), turn: 0, wander: 0, curiosity: rand(0.35, 1),
                    depth: rand(0.5, depthMax), depthTarget: rand(0.5, depthMax), depthMax,
                    nextDive: rand(6, 18), nextSurface: rand(3, 14), nextWake: rand(0, 2),
                    beat: 0, rush: 0, food: null, burstUntil: 0, nextBurst: rand(0, 3),
                    finPhase: rand(0, TAU), startle: 0, fleeX: 0, fleeY: 0, gulp: 0,
                    // Stable obstacle preference prevents left/right steering from alternating at rock contact.
                    rockSide: rand(0, 1) < 0.5 ? -1 : 1, rockContact: 0
      });
    }
  }

  placeRocks(avoid = this.avoid) {
    const { width, height } = this;
    if (width < 260 || height < 220) {
      this.rocks = [];
      return;
    }

    // New seed per page load; this geometry remains stable across resizes in the same tab.
    const random = seededRandom(this.rockSeed ^ Math.imul(width | 0, 0x45d9f3b) ^ Math.imul(height | 0, 0x119de1f3));
    const target = clamp(Math.round((width * height) / 360000), 2, 6);
    const margin = 30;
    const placed = [];
    const boxes = avoid || [];

    for (let attempt = 0; attempt < target * 150 && placed.length < target; attempt++) {
      const base = (17 + random() * 7) * ROCK_SCALE;
      // Five overlapping boulders form a broad, irregular cluster rather than a tiny pebble pile.
      const stones = [
        { dx: -0.72 * base, dy:  0.18 * base, rx: 0.69 * base, ry: 0.55 * base, tone: 0 },
        { dx: -0.24 * base, dy: -0.43 * base, rx: 0.64 * base, ry: 0.61 * base, tone: 1 },
        { dx:  0.38 * base, dy: -0.31 * base, rx: 0.73 * base, ry: 0.63 * base, tone: 2 },
        { dx:  0.81 * base, dy:  0.15 * base, rx: 0.56 * base, ry: 0.49 * base, tone: 0 },
        { dx:  0.08 * base, dy:  0.48 * base, rx: 0.68 * base, ry: 0.47 * base, tone: 2 }
      ];
      if (random() > 0.42) {
        stones.push({
          dx: -0.94 * base, dy: -0.22 * base,
          rx: 0.36 * base, ry: 0.32 * base, tone: 1
        });
      }
      if (random() > 0.68) {
        stones.push({
          dx: 0.48 * base, dy: 0.58 * base,
          rx: 0.35 * base, ry: 0.29 * base, tone: 0
        });
      }

      const radius = Math.max(...stones.map(stone =>
        Math.hypot(stone.dx, stone.dy) + Math.max(stone.rx, stone.ry)
      )) + 5;
      const spanX = Math.max(1, width - 2 * (margin + radius));
      const spanY = Math.max(1, height - 2 * (margin + radius));
      const x = margin + radius + random() * spanX;
      const y = margin + radius + random() * spanY;

      // Keep the full enlarged cluster outside the interface's quiet zones.
      const overlapsContent = boxes.some(box => {
        const dx = Math.max(box.left - x, 0, x - box.right);
        const dy = Math.max(box.top - y, 0, y - box.bottom);
        return Math.hypot(dx, dy) < radius + 18;
      });
      if (overlapsContent) continue;

      const overlapsRock = placed.some(rock =>
        Math.hypot(rock.x - x, rock.y - y) < rock.radius + radius + 26
      );
      if (overlapsRock) continue;

      const overlapsFishStart = this.koi.some(fish =>
        Math.hypot(fish.nodes[0] - x, fish.nodes[1] - y) < radius + 54
      );
      if (overlapsFishStart) continue;

      placed.push({
        id: placed.length + 1,
        x, y, radius, stones,
        nextRipple: 1.5 + random() * 5,
        rippleAngle: random() * TAU,
        lastBump: -Infinity,
        variation: random(),
        detailSeed: (random() * 0xffffffff) >>> 0
      });
    }

    this.rocks = placed;
  }

  feed(e, t) {
    const rock = this.rocks.find(item => Math.hypot(item.x - e, item.y - t) < item.radius);
    if (rock) {
      this.ripples.push({ x: e, y: t, born: this.time, strength: 0.28 });
      return;
    }
    this.lastFeed = this.time;
    this.ripples.push({ x: e, y: t, born: this.time, strength: 0.85 });
    let r = Math.min(5 + Math.floor(3 * Math.random()), 24 - this.pellets.length);
    for (let i = 0; i < r; i++) {
      let angle = rand(0, TAU), dist = 34 * Math.sqrt(Math.random()), speed = rand(2, 6);
      this.pellets.push({
        x: e + Math.cos(angle) * dist * 1.3, y: t + Math.sin(angle) * dist,
                        born: this.time, landAt: rand(0.15, 0.45), landed: false,
                        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed
      });
    }
  }

  step(e) {
    this.time += e;
    this.pointer.speed *= Math.exp(-8 * e);
    for (let fish of this.koi) this.stepKoi(fish, e);

    let t = this.time;
    this.pellets = this.pellets.filter(r => t - r.born < 14);
    for (let r of this.pellets) {
      if (!r.landed) {
        if (t - r.born < r.landAt) continue;
        r.landed = true;
        this.ripples.push({ x: r.x, y: r.y, born: t, strength: 0.1 });
        for (let fish of this.koi) {
          if (Math.hypot(fish.nodes[0] - r.x, fish.nodes[1] - r.y) < 650) fish.rush = 1;
        }
        continue;
      }
      let drag = Math.exp(-0.2 * e);
      r.vx *= drag; r.vy *= drag;
      r.x += r.vx * e; r.y += r.vy * e;
    }

    for (let rock of this.rocks) {
      if (t >= rock.nextRipple) {
        const angle = rock.rippleAngle;
        this.ripples.push({
          x: rock.x + Math.cos(angle) * (rock.radius + 5),
          y: rock.y + Math.sin(angle) * (rock.radius + 5),
          born: t,
          strength: 0.13 + rock.variation * 0.05
        });
        rock.rippleAngle += 1.7 + rand(-0.45, 0.45);
        rock.nextRipple = t + rand(7, 12);
      }
    }

    this.ripples = this.ripples.filter(r => t - r.born < rippleDuration(r));
    this.bites = this.bites.filter(b => t - b.born < 0.45);
  }

  stepKoi(e, t) {
    let { width: r, height: i, pointer: n, time: s } = this;
    let len = e.length, nodes = e.nodes;
    let headX = nodes[0], headY = nodes[1];
    let dirX = Math.cos(e.heading), dirY = Math.sin(e.heading);

    e.wander = clamp(e.wander + (Math.random() - 0.5) * t * 2.4, -0.9, 0.9);
    dirX += 0.6 * Math.cos(e.heading + e.wander);
    dirY += 0.6 * Math.sin(e.heading + e.wander);

    let food = this.pickFood(e, headX, headY, Math.max(1.6 * len + 220, 650 * (e.rush > 0)));
    let ptrDist = Math.hypot(n.x - headX, n.y - headY);
    let recentlyFed = s - this.lastFeed < 2;

    if (!food && !recentlyFed && n.active && n.speed > 1100 && ptrDist < 0.9 * len) {
      e.startle = 1; e.fleeX = n.x; e.fleeY = n.y;
    }
    e.startle = Math.max(0, e.startle - 0.6 * t);

    let isFleeing = e.startle > 0.3 && !food;
    let isChasingFood = false, isCurious = false, foodProximity = 0;

    if (isFleeing) {
      let fx = headX - e.fleeX, fy = headY - e.fleeY, d = Math.hypot(fx, fy) || 1;
      dirX += (fx / d) * 4 * e.startle; dirY += (fy / d) * 4 * e.startle;
    } else if (food) {
      let fx = food.x - headX, fy = food.y - headY, d = Math.hypot(fx, fy) || 1;
      dirX += (fx / d) * 3; dirY += (fy / d) * 3;
      isChasingFood = true; foodProximity = clamp(1 - d / (1.2 * len), 0, 1);
    } else if (n.active) {
      let px = n.x - headX, py = n.y - headY, d = Math.hypot(px, py) || 1;
      if (d < 300) {
        let str = e.curiosity * (1 - d / 300) * 2.2;
        let blend = clamp(d / (0.6 * len), 0, 1);
        dirX += ((px / d) * blend - (py / d) * (1 - blend)) * str;
        dirY += ((py / d) * blend + (px / d) * (1 - blend)) * str;
        isCurious = true;
      }
    }

    for (let other of this.koi) {
      if (other === e) continue;
      let ox = other.nodes[0], oy = other.nodes[1];
      if (Math.abs(ox - headX) > 2 * len || Math.abs(oy - headY) > 2 * len) continue;

      for (let seg = 0; seg < 20; seg += 3) {
        let dx = headX - other.nodes[2 * seg], dy = headY - other.nodes[2 * seg + 1];
        let d = Math.hypot(dx, dy), minDist = (len + other.length) * (food ? 0.12 : 0.28);
        if (d < minDist && d > 0.001) {
          let force = (1 - d / minDist) * 2.4;
          dirX += (dx / d) * force; dirY += (dy / d) * force;
        }
      }
      if (!isChasingFood && Math.hypot(ox - headX, oy - headY) < 1.6 * len) {
        dirX += 0.18 * Math.cos(other.heading);
        dirY += 0.18 * Math.sin(other.heading);
      }
    }

    let avoidVec = { x: 0, y: 0 };
    for (let box of this.avoid) {
      let ex = headX - clamp(headX, box.left, box.right);
      let ey = headY - clamp(headY, box.top, box.bottom);
      let dist = Math.hypot(ex, ey);
      let minDist = 0.4 * len;
      if (dist > minDist) continue;
      if (dist < 0.001) {
        let diffs = [box.left - headX, headX - box.right, box.top - headY, headY - box.bottom];
        let maxIdx = diffs.indexOf(Math.max(...diffs));
        ex = maxIdx === 0 ? -1 : maxIdx === 1 ? 1 : 0;
        ey = maxIdx === 2 ? -1 : maxIdx === 3 ? 1 : 0;
        dist = 0;
      }
      let h = Math.hypot(ex, ey) || 1;
      const strength = Number.isFinite(box.strength) ? box.strength : 1;
      avoidVec.x += (ex / h) * (1 - dist / minDist) * strength;
      avoidVec.y += (ey / h) * (1 - dist / minDist) * strength;
    }
    dirX += avoidVec.x * (isChasingFood || isCurious ? 0.5 : 1.8);
    dirY += avoidVec.y * (isChasingFood || isCurious ? 0.5 : 1.8);

    // Predictive rock avoidance: sample the fish's forward path, not just its current head.
    // A stable per-fish side preference makes it commit to one side of a boulder.
    const headingX = Math.cos(e.heading), headingY = Math.sin(e.heading);
    for (let rock of this.rocks) {
      const relX = rock.x - headX, relY = rock.y - headY;
      const ahead = relX * headingX + relY * headingY;
      const lookAhead = clamp(len * 0.82 + e.speed * 0.25, 52, 210);
      if (ahead < -rock.radius * 0.45 || ahead > lookAhead + rock.radius) continue;

      const closestX = headX + headingX * clamp(ahead, 0, lookAhead);
      const closestY = headY + headingY * clamp(ahead, 0, lookAhead);
      let awayX = closestX - rock.x;
      let awayY = closestY - rock.y;
      let clearance = Math.hypot(awayX, awayY);
      const headPad = 0.15 * len + 5;
      const safeRadius = rock.radius + headPad;
      const influence = Math.max(38, len * 0.78);
      const urgency = clamp((safeRadius + influence - clearance) / influence, 0, 1);
      if (urgency <= 0) continue;

      // If the projected path points straight through the rock centre, use a stable
      // lateral normal rather than a zero/unstable vector (a common source of flips).
      if (clearance < safeRadius * 0.22) {
        awayX = -headingY * e.rockSide;
        awayY = headingX * e.rockSide;
      } else {
        awayX /= clearance;
        awayY /= clearance;
      }

      const lateralX = -headingY * e.rockSide;
      const lateralY = headingX * e.rockSide;
      const push = 0.9 + urgency * 1.45;
      const guide = 0.28 + urgency * 0.72;
      dirX += awayX * push + lateralX * guide + headingX * 0.18;
      dirY += awayY * push + lateralY * guide + headingY * 0.18;
      e.rockContact = Math.max(e.rockContact, urgency);
    }
    e.rockContact = Math.max(0, e.rockContact - t * 1.8);

    let edgeDist = Math.max(-headX, headX - r, -headY, headY - i);
    if (edgeDist > -0.25 * len) {
      let force = 3.5 * clamp((edgeDist + 0.25 * len) / (0.5 * len), 0, 1);
      let cx = r / 2 - headX, cy = i / 2 - headY, d = Math.hypot(cx, cy) || 1;
      dirX += (cx / d) * force; dirY += (cy / d) * force;
    }

    // Keep a valid forward vector even when competing forces nearly cancel each other.
    if (Math.hypot(dirX, dirY) < 0.0001) {
      dirX = Math.cos(e.heading);
      dirY = Math.sin(e.heading);
    }
    let targetHeading = Math.atan2(dirY, dirX);
    const maxTurnRate = (1 + 0.6 * e.rush) * Math.min(
      isFleeing ? 3 : isChasingFood ? 1.9 + foodProximity : isCurious ? 1.2 : 0.78,
      Math.max(0.55, (e.speed / len) * 4)
    );
    const headingError = angleDelta(e.heading, targetHeading);
    const desiredTurnRate = clamp(headingError / Math.max(t, 0.0001), -maxTurnRate, maxTurnRate);
    // Angular acceleration gives the fish a visible, continuous turning arc instead of snapping.
    const turnAcceleration = isFleeing ? 6.0 : (e.rockContact > 0.05 ? 2.7 : 3.5);
    e.turn += clamp(desiredTurnRate - e.turn, -turnAcceleration * t, turnAcceleration * t);
    e.turn = clamp(e.turn, -maxTurnRate, maxTurnRate);
    let turnStep = clamp(e.turn * t, -maxTurnRate * t, maxTurnRate * t);
    e.heading += turnStep;

    if (s > e.nextBurst && s > e.burstUntil) {
      e.burstUntil = s + rand(0.7, 1.6);
      e.nextBurst = e.burstUntil + rand(1.2, 4);
    }

    let isAccelerating = isFleeing || isChasingFood || s < e.burstUntil;
    e.beat += (!!isAccelerating - e.beat) * Math.min(1, 3 * t);

    if (e.beat > 0.6 && e.depth > 0.65 && s > e.nextWake) {
      this.ripples.push({ x: nodes[34], y: nodes[35], born: s, strength: 0.25 + 0.2 * e.depth });
      e.nextWake = s + rand(0.8, 1.6) / e.beat;
    }

    e.rush = Math.max(0, e.rush - 0.7 * t);
    let baseSpeed = 12 + 0.05 * len;
    let targetSpeed = (1 + 0.8 * e.rush) * (isFleeing ? 3.2 * baseSpeed : isChasingFood ? baseSpeed * (1.9 + foodProximity) : isAccelerating ? baseSpeed * (isCurious ? 1.6 : 1.35) : 0.45 * baseSpeed);
    e.speed += (targetSpeed - e.speed) * Math.min(1, t * (isAccelerating ? 1.6 + 3 * e.rush : 0.35));

    e.phase += t * (0.6 + e.beat * (2.2 + e.speed / 11));
    e.finPhase += 2.4 * t;
    e.gulp += ((isChasingFood && foodProximity > 0.55 ? 1 : 0) - e.gulp) * Math.min(1, 6 * t);

    if (s > e.nextDive) {
      e.depthTarget = rand(0.5, e.depthMax);
      e.nextDive = s + rand(8, 20);
    }
    e.depth += ((isChasingFood ? 1 : e.depthTarget) - e.depth) * Math.min(1, t * (isChasingFood ? 0.8 : 0.15));

    nodes[0] += Math.cos(e.heading) * e.speed * t;
    nodes[1] += Math.sin(e.heading) * e.speed * t;

    for (let rock of this.rocks) {
      let dx = nodes[0] - rock.x, dy = nodes[1] - rock.y;
      let dist = Math.hypot(dx, dy);
      const headPad = 0.15 * len + 3;
      const safeRadius = rock.radius + headPad;
      if (dist >= safeRadius) continue;

      // Robust normal even if the head lands exactly at the rock centre.
      if (dist < 0.001) {
        dx = -Math.cos(e.heading);
        dy = -Math.sin(e.heading);
        dist = 1;
      }
      const nx = dx / dist, ny = dy / dist;
      nodes[0] = rock.x + nx * safeRadius;
      nodes[1] = rock.y + ny * safeRadius;

      // Never reflect the heading in one frame. Slide along the obstacle with a
      // bounded correction and let the normal steering complete the turn.
      const vx = Math.cos(e.heading), vy = Math.sin(e.heading);
      const toward = vx * nx + vy * ny;
      if (toward < -0.025) {
        const side = e.rockSide;
        const tangentX = -ny * side;
        const tangentY = nx * side;
        let slideX = tangentX * 0.82 + nx * 0.28;
        let slideY = tangentY * 0.82 + ny * 0.28;
        const slideLen = Math.hypot(slideX, slideY) || 1;
        slideX /= slideLen;
        slideY /= slideLen;
        const slideHeading = Math.atan2(slideY, slideX);
        const maxContactTurn = 1.65 * t;
        const contactDelta = clamp(angleDelta(e.heading, slideHeading), -maxContactTurn, maxContactTurn);
        e.heading += contactDelta;
        e.turn = clamp(e.turn * 0.72 + (contactDelta / Math.max(t, 0.0001)) * 0.28, -2.4, 2.4);
      }
      if (s - rock.lastBump > 0.9) {
        this.ripples.push({ x: rock.x + nx * (rock.radius + 5), y: rock.y + ny * (rock.radius + 5), born: s, strength: 0.3 });
        rock.lastBump = s;
      }
    }

    let segSpacing = len / 19;
    let prevAngle = e.heading + Math.PI;
    for (let seg = 1; seg < 20; seg++) {
      let prevX = nodes[(seg - 1) * 2], prevY = nodes[(seg - 1) * 2 + 1];
      let segAngle = Math.atan2(nodes[2 * seg + 1] - prevY, nodes[2 * seg] - prevX);
      segAngle = prevAngle + clamp(angleDelta(prevAngle, segAngle), -0.16, 0.16);
      nodes[2 * seg] = prevX + Math.cos(segAngle) * segSpacing;
      nodes[2 * seg + 1] = prevY + Math.sin(segAngle) * segSpacing;

      // A turning tail can sweep across an obstacle; project each body segment back outside it.
      const bodyPad = bodyRadiusProfile(seg / 19) * len + 1;
      for (let rock of this.rocks) {
        let dx = nodes[2 * seg] - rock.x, dy = nodes[2 * seg + 1] - rock.y;
        let dist = Math.hypot(dx, dy) || 0.001;
        let safeRadius = rock.radius + bodyPad;
        if (dist < safeRadius) {
          if (dist < 0.001) {
            // Use the fish's stable side when a tail sample coincides with a rock centre.
            dx = -Math.sin(e.heading) * e.rockSide;
            dy = Math.cos(e.heading) * e.rockSide;
            dist = Math.hypot(dx, dy) || 1;
          }
          nodes[2 * seg] = rock.x + (dx / dist) * safeRadius;
          nodes[2 * seg + 1] = rock.y + (dy / dist) * safeRadius;
        }
      }
      // Continue the spine from the corrected point, not from its pre-collision angle.
      prevAngle = Math.atan2(nodes[2 * seg + 1] - prevY, nodes[2 * seg] - prevX);
    }

    let mouthRadius = 0.08 * len + 6;
    let pelletCountBefore = this.pellets.length;
    this.pellets = this.pellets.filter(p => !p.landed || Math.pow(p.x - nodes[0], 2) + Math.pow(p.y - nodes[1], 2) > mouthRadius * mouthRadius);

    if (this.pellets.length < pelletCountBefore) {
      this.ripples.push({ x: nodes[0], y: nodes[1], born: s, strength: 0.6 });
      this.bites.push({ x: nodes[0], y: nodes[1], born: s });
      e.nextSurface = s + rand(6, 16);
    } else if (s > e.nextSurface) {
      this.ripples.push({ x: nodes[0], y: nodes[1], born: s, strength: 0.3 });
      e.nextSurface = s + rand(8, 20);
    }
  }

  pickFood(e, t, r, i) {
    if (e.food && !this.pellets.includes(e.food)) e.food = null;
    let nearest = this.nearestPellet(t, r, i);
    if (!e.food) return (e.food = nearest);
    let dCurr = Math.hypot(e.food.x - t, e.food.y - r);
    if (dCurr > 1.3 * i) return (e.food = nearest);
    if (nearest && Math.hypot(nearest.x - t, nearest.y - r) < 0.5 * dCurr) return (e.food = nearest);
    return e.food;
  }

  nearestPellet(e, t, r) {
    let best = null, bestSq = r * r;
    for (let p of this.pellets) {
      if (!p.landed) continue;
      let sq = Math.pow(p.x - e, 2) + Math.pow(p.y - t, 2);
      if (sq < bestSq) { bestSq = sq; best = p; }
    }
    return best;
  }
}

class Renderer {
  constructor(canvasEl) {
    let ctx = canvasEl.getContext('2d');
    if (!ctx) throw Error('2D canvas unavailable');
    this.ctx = ctx;
    this.dpr = 1; this.cw = 8; this.ch = 12; this.cols = this.rows = 0;
    this.palette = createLightPalette();
    this.styles = new Map();
    this.markingCache = new Map();
    this.fontFamily = '"Space Mono", ui-monospace, SFMono-Regular, Menlo, monospace';

    this.energy = new Float32Array(0); this.energyTmp = new Float32Array(0);
    this.cellGlyph = new Uint16Array(0); this.cellColor = new Uint32Array(0);
    this.cellAlpha = new Float32Array(0); this.cellTile = new Uint32Array(0);
    this.cellTileAlpha = new Float32Array(0); this.cellDim = new Float32Array(0);
    this.cellDimTarget = new Float32Array(0);
    this.cellCloud = new Float32Array(0); this.cellCloudTarget = new Float32Array(0);
    this.cellShadow = new Uint8Array(0);

    this.spine = new Float32Array(40); this.arc = new Float32Array(20);
    this.arcTotal = 1; this.flareLeft = this.flareRight = 1;
    this.hit = { flag: 0, across: 1, du: 1, da: 0 };
    this.hitS = this.hitV = this.hitDist = 0;
    this.hitTx = 1; this.hitTy = this.hitSeg = 0;
  }

  setTheme(isLight) { this.palette = isLight ? createLightPalette() : DARK_PALETTE; }

  resize(e, t, r) {
    this.dpr = r;
    this.cw = clamp(Math.round(e / 125), 8, 12);
    this.ch = this.cw + 2;
    this.cols = Math.ceil(e / this.cw); this.rows = Math.ceil(t / this.ch);
    this.ctx.canvas.width = Math.round(e * r);
    this.ctx.canvas.height = Math.round(t * r);

    let total = this.cols * this.rows;
    this.energy = new Float32Array(total); this.energyTmp = new Float32Array(total);
    this.cellGlyph = new Uint16Array(total); this.cellColor = new Uint32Array(total);
    this.cellAlpha = new Float32Array(total); this.cellTile = new Uint32Array(total);
    this.cellTileAlpha = new Float32Array(total); this.cellDim = new Float32Array(total).fill(1);
    this.cellDimTarget = new Float32Array(total).fill(1);
    this.cellCloud = new Float32Array(total); this.cellCloudTarget = new Float32Array(total);
    this.cellShadow = new Uint8Array(total);
  }

  setDimBoxes(e) {
    let { cols: t, rows: r, cw: i, ch: n, cellDimTarget: s } = this;
    s.fill(1);
    this.cellCloudTarget.fill(1);
    let pad = 4 * i;
    for (let box of e) {
      const visibility = clamp(Number.isFinite(box.visibility) ? box.visibility : 0.035, 0, 1);
      const cloudStrength = clamp((Number.isFinite(box.strength) ? box.strength : 1) * (1 - visibility), 0, 1);
      let x0 = Math.max(0, Math.floor((box.left - pad) / i));
      let x1 = Math.min(t - 1, Math.floor((box.right + pad) / i));
      let y0 = Math.max(0, Math.floor((box.top - pad) / n));
      let y1 = Math.min(r - 1, Math.floor((box.bottom + pad) / n));

      for (let row = y0; row <= y1; row++) {
        for (let col = x0; col <= x1; col++) {
          let cx = col * i + i / 2, cy = row * n + n / 2;
          let dist = Math.hypot(Math.max(box.left - cx, 0, cx - box.right), Math.max(box.top - cy, 0, cy - box.bottom));
          let idx = row * t + col;
          s[idx] = Math.min(s[idx], visibility + (1 - visibility) * smoothstep(0, pad, dist));
          const cloudDim = 1 - 0.78 * cloudStrength * (1 - smoothstep(0, pad, dist));
          this.cellCloudTarget[idx] = Math.min(this.cellCloudTarget[idx], cloudDim);
        }
      }
    }
  }

  drawCloudShadows(world, instant = false, dt = STEP) {
    const { ctx, cols, cw, ch, cellCloud, cellCloudTarget, palette } = this;
    const cloudStep = instant ? 1 : 1 - Math.exp(-Math.max(0, dt) * 2.4);
    for (let i = 0; i < cellCloud.length; i++) {
      cellCloud[i] += (cellCloudTarget[i] - cellCloud[i]) * cloudStep;
      if (cellCloud[i] < 0.008) continue;
      const col = i % cols;
      const row = (i / cols) | 0;
      const drift = col * 0.11 - world.time * 0.09 + Math.sin(row * 0.12) * 1.4;
      const mass = Math.sin(drift) * 0.55 + Math.cos(drift * 0.48 + row * 0.23) * 0.45;
      if (mass < 0.05) continue;
      ctx.globalAlpha = cellCloud[i] * (mass > 0.78 ? 0.16 : 0.1);
      ctx.fillStyle = this.style(packColor(palette.shadow));
      ctx.fillText(mass > 0.78 ? '▒' : '░', col * cw + cw / 2, row * ch + ch / 2);
    }
    ctx.globalAlpha = 1;
  }

  style(e) {
    let t = this.styles.get(e);
    if (!t) {
      t = `rgb(${e >>> 16},${(e >>> 8) & 255},${e & 255})`;
      this.styles.set(e, t);
    }
    return t;
  }

  glyphAt(e, t, r, i) {
    let { ctx: n, cw: s, ch: l, cols: o, cellDim } = this;
    n.globalAlpha = i * (cellDim[e] ?? 1);
    n.fillStyle = this.style(packColor(r));
    n.fillText(t, (e % o) * s + s / 2, ((e / o) | 0) * l + l / 2);
  }

  cellIndex(e, t) {
    let r = Math.floor(e / this.cw), i = Math.floor(t / this.ch);
    return r < 0 || i < 0 || r >= this.cols || i >= this.rows ? -1 : i * this.cols + r;
  }

  sample(e, t, r, i = 0, n = 18) {
    let { spine: s, arc: o } = this;
    let minSqDist = Infinity, sProg = 0, sideSign = 1;
    let tailDist = 0, headDist = 0, perpDist = 0;

    for (let seg = i; seg <= n; seg++) {
      let ax = s[2 * seg], ay = s[2 * seg + 1];
      let dx = s[(seg + 1) * 2] - ax, dy = s[(seg + 1) * 2 + 1] - ay;
      let segLenSq = dx * dx + dy * dy || 1;
      let proj = ((e - ax) * dx + (t - ay) * dy) / segLenSq;
      let clampProj = clamp(proj, 0, 1);
      let sqDist = Math.pow(e - ax - dx * clampProj, 2) + Math.pow(t - ay - dy * clampProj, 2);

      if (sqDist < minSqDist) {
        let segLen = Math.sqrt(segLenSq);
        minSqDist = sqDist;
        sProg = (o[seg] + clampProj * segLen) / this.arcTotal;
        sideSign = dx * (t - ay) - dy * (e - ax) >= 0 ? 1 : -1;
        tailDist = seg === 18 ? Math.max(0, proj - 1) * segLen : 0;
        headDist = seg === 0 ? Math.max(0, -proj) * segLen : 0;
        perpDist = Math.abs(dx * (t - ay) - dy * (e - ax)) / segLen;
        this.hitTx = dx / segLen; this.hitTy = dy / segLen;
        this.hitSeg = seg;
      }
    }

    let dist = Math.sqrt(minSqDist);
    this.hitDist = dist; this.hitS = sProg; this.hitV = dist * sideSign;

    let hit = this.hit;
    let relV = dist / r, relHead = headDist / r, relTail = tailDist / r, relPerp = perpDist / r;
    let flare = sideSign > 0 ? this.flareLeft : this.flareRight;

    hit.flag = 0; hit.across = 1; hit.du = 1; hit.da = 0;

    if (relHead > 0) {
      return !!(relHead < 0.05 && Math.abs(relPerp - (0.045 + 0.7 * relHead)) < 0.016) && ((hit.flag = 5), true);
    }

    let bodyR = bodyRadiusProfile(sProg);
    if (sProg <= 0.74 && relV <= bodyR) {
      let across = relV / bodyR;
      hit.across = across;
      if (sProg > 0.055 && sProg < 0.1 && across > 0.5 && across < 0.85) hit.flag = 3;
      else if (sProg > 0.28 && sProg < 0.6 && across < 0.14) hit.flag = 4;
      else hit.flag = 1;
      return true;
    }

    if (sProg > 0.68 && relTail <= 0) {
      let finW = (0.03 + 0.15 * Math.pow(smoothstep(0.7, 1, sProg), 0.8)) * flare;
      if (relV <= finW && sProg <= 0.86 + (relV / finW) * 0.14) {
        hit.flag = 2; hit.da = (relV / finW) * 0.8;
        return true;
      }
    }

    return checkFin(sProg, relV, 0.19, 0.85 + 0.5 * (flare - 1), 0.066 * flare, 0.04, hit) ||
    checkFin(sProg, relV, 0.47, 0.75, 0.036, 0.018, hit);
  }

  skin(e, t, r, i) {
    let n = this.palette, s = r / e.length;
    if (i > 0.9 || t > 0.74) return n.white;
    if (e.variety === 'ogon') return n.gold;
    let noise = (perlinNoise2D(14 * t + e.id, 30 * s, e.id + 3) - 0.5) * 0.6;
    let marks = this.markings(e);

    for (let spot of marks.black) {
      if (((t - spot.s) / spot.rs) ** 2 + ((s - spot.v) / spot.rv) ** 2 < 1 + noise) return n.black;
    }
    for (let spot of marks.red) {
      if (((t - spot.s) / spot.rs) ** 2 + ((s - spot.v) / spot.rv) ** 2 < 1 + noise) return n.red;
    }
    for (let spot of marks.gold || []) {
      if (((t - spot.s) / spot.rs) ** 2 + ((s - spot.v) / spot.rv) ** 2 < 1 + noise) return n.gold;
    }
    return n.white;
  }

  markings(e) {
    let t = this.markingCache.get(e.id);
    if (t) return t;

    let r = offset => hash(e.id, offset, 41);
    if (e.variety === 'tancho') {
      t = { red: [{ s: 0.11, v: 0, rs: 0.05, rv: 0.055 }], black: [], gold: [] };
    } else if (e.variety === 'ogon') {
      const goldSpots = [];
      const count = 3 + Math.floor(2 * r(88));
      for (let i = 0; i < count; i++) {
        const step = 0.62 / count;
        goldSpots.push({
          s: 0.16 + step * (i + 0.5) + (r(90 + i) - 0.5) * step * 0.28,
          v: (r(100 + i) - 0.5) * 0.07,
          rs: step * (0.38 + 0.13 * r(110 + i)),
          rv: 0.095 + 0.04 * r(120 + i)
        });
      }
      t = { red: [], black: [], gold: goldSpots };
    } else {
      let redSpots = [];
      if (r(0) < 0.75) redSpots.push({ s: 0.1, v: (r(1) - 0.5) * 0.03, rs: 0.055 + 0.03 * r(2), rv: 0.11 });
      let numRed = 2 + Math.floor(2 * r(3));
      for (let i = 0; i < numRed; i++) {
        let step = 0.42 / numRed;
        redSpots.push({
          s: 0.25 + step * (i + 0.5) + (r(10 + i) - 0.5) * step * 0.3,
                      v: (r(20 + i) - 0.5) * 0.05,
                      rs: step * (0.32 + 0.12 * r(30 + i)),
                      rv: 0.09 + 0.05 * r(40 + i)
        });
      }
      let blackSpots = [];
      if (e.variety === 'sanke') {
        let numBlack = 4 + Math.floor(3 * r(50));
        for (let i = 0; i < numBlack; i++) {
          blackSpots.push({ s: 0.24 + 0.44 * r(60 + i), v: (r(70 + i) - 0.5) * 0.16, rs: 0.022, rv: 0.026 });
        }
      }
      t = { red: redSpots, black: blackSpots, gold: [] };
    }
    this.markingCache.set(e.id, t);
    return t;
  }

  rasterizeKoi(e, t) {
    let { spine: r, arc: i, cw: n, ch: s, cols: o, rows: a, cellGlyph: h, cellColor: u, cellAlpha: d, cellTile: f, cellTileAlpha: p, palette: m } = this;
    let len = e.length, nodes = e.nodes, beatFactor = 0.2 + 1.1 * e.beat;

    for (let seg = 0; seg < 20; seg++) {
      let prog = seg / 19;
      let prevSeg = Math.max(0, seg - 1), nextSeg = Math.min(19, seg + 1);
      let dx = nodes[2 * prevSeg] - nodes[2 * nextSeg];
      let dy = nodes[2 * prevSeg + 1] - nodes[2 * nextSeg + 1];
      let dist = Math.hypot(dx, dy) || 1;
      dx /= dist; dy /= dist;
      let sway = 0.04 * len * (0.05 + 0.95 * Math.pow(prog, 2.2)) * beatFactor * Math.sin(e.phase - 4.6 * prog);
      r[2 * seg] = nodes[2 * seg] - dy * sway;
      r[2 * seg + 1] = nodes[2 * seg + 1] + dx * sway;
    }

    i[0] = 0;
    for (let seg = 1; seg < 20; seg++) {
      i[seg] = i[seg - 1] + Math.hypot(r[2 * seg] - r[(seg - 1) * 2], r[2 * seg + 1] - r[(seg - 1) * 2 + 1]);
    }
    this.arcTotal = i[19] || 1;

    let flareBase = 1 - 0.25 * e.beat;
    let finOsc = 0.18 * (1 - e.beat) * Math.sin(e.finPhase);
    let turnBias = clamp(0.6 * e.turn, -0.35, 0.35);
    this.flareLeft = flareBase + finOsc - turnBias;
    this.flareRight = flareBase - finOsc + turnBias;

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (let seg = 0; seg < 20; seg++) {
      minX = Math.min(minX, r[2 * seg]); maxX = Math.max(maxX, r[2 * seg]);
      minY = Math.min(minY, r[2 * seg + 1]); maxY = Math.max(maxY, r[2 * seg + 1]);
    }

    let pad = 0.26 * len;
    let gx0 = Math.max(0, Math.floor((minX - pad) / n));
    let gx1 = Math.min(o - 1, Math.floor((maxX + pad) / n));
    let gy0 = Math.max(0, Math.floor((minY - pad) / s));
    let gy1 = Math.min(a - 1, Math.floor((maxY + pad) / s));

    if (gx0 > gx1 || gy0 > gy1) return;

    let cellDiag = Math.hypot(n, s);
    let shadowOffX = Math.round((0.07 * len * e.depth) / n) + 1;
    let shadowOffY = Math.round((0.05 * len * e.depth) / s) + 1;
    let bodyAlpha = m.alpha * (m.depthFloor + (1 - m.depthFloor) * e.depth);
    let [tileMin, tileMax] = m.tile;
    let hit = this.hit;

    for (let row = gy0; row <= gy1; row++) {
      for (let col = gx0; col <= gx1; col++) {
        let cx = col * n, cy = row * s;
        let isCenterInside = this.sample(cx + n / 2, cy + s / 2, len);

        if (!isCenterInside && this.hitDist > len * (this.hitS > 0.4 && this.hitS < 0.62 ? 0.15 : 0.25) + cellDiag) {
          col += Math.max(0, Math.floor((this.hitDist - 0.25 * len - cellDiag) / n));
          continue;
        }

        let minSeg = Math.max(0, this.hitSeg - 2);
        let maxSeg = Math.min(18, this.hitSeg + 2);
        let flag = hit.flag, across = hit.across;
        let sProg = this.hitS, vDist = this.hitV;
        let hitTx = this.hitTx, hitTy = this.hitTy;

        let insideCount = +!!isCenterInside;
        let subOffX = 0, subOffY = 0;

        let isDeepInterior = isCenterInside && flag !== 2 && flag !== 5 && sProg > 0.04 && sProg < 0.72 && bodyRadiusProfile(sProg) * len - this.hitDist > 0.35 * cellDiag;
        if (isDeepInterior) insideCount = 5;

        for (let sp = 0; !isDeepInterior && sp < SUBPIXEL_OFFSETS.length; sp += 2) {
          if (this.sample(cx + SUBPIXEL_OFFSETS[sp] * n, cy + SUBPIXEL_OFFSETS[sp + 1] * s, len, minSeg, maxSeg)) {
            subOffX += (SUBPIXEL_OFFSETS[sp] - 0.5) * n;
            subOffY += (SUBPIXEL_OFFSETS[sp + 1] - 0.5) * s;
            if (insideCount === 0) {
              flag = hit.flag; across = hit.across;
              sProg = this.hitS; vDist = this.hitV;
              hitTx = this.hitTx; hitTy = this.hitTy;
            }
            insideCount++;
          }
        }

        if (insideCount === 0) continue;
        this.hitTx = hitTx; this.hitTy = hitTy;

        let coverageRatio = insideCount / 5;
        let sideSign = vDist >= 0 ? 1 : -1;
        let cellIdx = row * o + col;
        let hVal = (0xffffffff * hash(Math.round(90 * sProg), Math.round(vDist / (0.8 * n)), e.id)) >>> 0;
        let isSolid = isCenterInside && coverageRatio >= 0.6;

        let char = ' ', textColor = m.fin, tileA = bodyAlpha, textCol = null, shadowA = 0;

        if (flag === 5) {
          char = edgeGlyph(-hitTx - sideSign * hitTy * 0.7, -hitTy + sideSign * hitTx * 0.7);
          textColor = scaleColor(lerpColor(m.bg, m.fin, 0.9), m.ink + 0.3);
        } else if (flag === 3 && isSolid) {
          textCol = lerpColor(m.bg, m.eye, 0.85); shadowA = bodyAlpha; char = 'o'; textColor = lerpColor(m.bg, m.white, 0.9);
        } else if (flag === 2) {
          textCol = lerpColor(m.bg, m.fin, 0.55); shadowA = 0.45 * bodyAlpha * coverageRatio;
          if (hVal % 2 === 0) char = '.';
          tileA *= 0.6 * coverageRatio;
        } else {
          let skinColor = this.skin(e, sProg, vDist, across);
          let lightAngle = sideSign * (0.6 * hitTy - 0.8 * hitTx) * across;
          let shading = clamp(0.22 + 0.5 * Math.sqrt(1 - across * across) + 0.18 * lightAngle, 0, 1);

          if (skinColor === m.red || skinColor === m.gold) {
            const ramp = skinColor === m.gold ? m.goldHi : m.hi;
            let rShimmer = (hash(e.id, 5, 17) - 0.5) * 0.3;
            let nShimmer = (perlinNoise2D(9 * sProg + e.id, (vDist / len) * 18, e.id + 21) - 0.5) * 0.25;
            let sWave = Math.max(0, Math.sin(11 * sProg - 1.8 * t + e.id) - 0.7) / 0.3;
            let blendPos = clamp(shading + rShimmer + nShimmer + 0.35 * sWave, 0, 1) * (ramp.length - 1);
            let idx = Math.min(ramp.length - 2, Math.floor(blendPos));
            textCol = lerpColor(ramp[idx], ramp[idx + 1], blendPos - idx);
          } else {
            textCol = lerpColor(m.bg, skinColor, tileMin + (tileMax - tileMin) * shading);
          }

          if (insideCount === 5) {
            let sx = col + shadowOffX, sy = row + shadowOffY;
            if (sx < o && sy < a) this.cellShadow[sy * o + sx] = 1;
            shadowA = bodyAlpha;
            if (sProg < 0.035 && across < 0.6 && e.gulp > 0.5) { char = 'o'; textColor = m.eye; }
            else {
              char = GLYPH_CHARS[clamp(Math.round((1 - shading) * 4) + ((hVal >>> 4) % 3), 0, GLYPH_CHARS.length - 1)];
              textColor = scaleColor(textCol, m.ink);
              if (skinColor === m.white) tileA *= 0.6;
              let stepT = Math.floor(1.4 * t + (hVal % 997) / 97);
              if (0.03 > hash(hVal, stepT, 7)) textCol = lerpColor(textCol, m.bg, 0.45);
            }
          } else {
            shadowA = bodyAlpha * coverageRatio * 0.55;
            if (Math.hypot(subOffX, subOffY) > 0.2 * n && hVal % 3 === 0) { char = '.'; textColor = scaleColor(textCol, m.ink); }
          }
        }

        if (char !== ' ' || shadowA !== 0) {
          f[cellIdx] = textCol ? packColor(textCol) : 0;
          p[cellIdx] = shadowA;
          h[cellIdx] = char.charCodeAt(0);
          u[cellIdx] = packColor(textColor);
          d[cellIdx] = tileA;
        }
      }
    }
  }

  depositWake(world) {
    let { energy } = this;
    for (let fish of world.koi) {
      for (let seg = 16; seg < 20; seg++) {
        let idx = this.cellIndex(fish.nodes[2 * seg], fish.nodes[2 * seg + 1]);
        if (idx >= 0) energy[idx] = Math.min(1.5, energy[idx] + 0.035 + 0.0012 * fish.speed);
      }
    }
    if (world.pointer.active) {
      let idx = this.cellIndex(world.pointer.x, world.pointer.y);
      if (idx >= 0) energy[idx] = Math.min(1.5, energy[idx] + 0.12);
    }
  }

  diffuse(dt) {
    let { cols, rows, energy, energyTmp } = this;
    let decay = Math.exp(-1.1 * dt);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let idx = r * cols + c;
        let left = c > 0 ? energy[idx - 1] : energy[idx];
        let right = c < cols - 1 ? energy[idx + 1] : energy[idx];
        let up = r > 0 ? energy[idx - cols] : energy[idx];
        let down = r < rows - 1 ? energy[idx + cols] : energy[idx];
        energyTmp[idx] = (4 * energy[idx] + left + right + up + down) * 0.125 * decay;
      }
    }
    this.energy = energyTmp;
    this.energyTmp = energy;
  }

  drawShadows() {
    let { cellShadow, cellGlyph, cellDim, palette } = this;
    for (let i = 0; i < cellShadow.length; i++) {
      if (cellShadow[i] && !cellGlyph[i]) {
        this.glyphAt(i, ':', palette.shadow, palette.shadowAlpha);
      }
    }
  }

  drawWake() {
    let { energy, cellGlyph, cellShadow, palette } = this;
    for (let i = 0; i < energy.length; i++) {
      let e = energy[i];
      if (e < 0.22 || cellGlyph[i] || cellShadow[i]) continue;
      this.glyphAt(i, e > 0.5 ? '-' : '.', palette.water, 0.35 * Math.min(1, (e - 0.22) * 1.4));
    }
  }

  drawRipples(world) {
    let { cw, ch, cols, rows, cellGlyph, palette } = this;
    for (let ripple of world.ripples) {
      let age = world.time - ripple.born;
      let dur = rippleDuration(ripple);
      let strength = Math.pow(1 - age / dur, 1.5) * ripple.strength;

      for (let ring = 0; ring < 2; ring++) {
        let radius = 64 * Math.max(0, age - 0.2 * ring) * (0.7 + 0.5 * ripple.strength);
        if (radius < 2) continue;

        let band = 0.6 * cw;
        let x0 = Math.max(0, Math.floor((ripple.x - radius - cw) / cw));
        let x1 = Math.min(cols - 1, Math.floor((ripple.x + radius + cw) / cw));
        let y0 = Math.max(0, Math.floor((ripple.y - radius - ch) / ch));
        let y1 = Math.min(rows - 1, Math.floor((ripple.y + radius + ch) / ch));
        let alpha = Math.min(1, strength * (ring === 0 ? 0.95 : 0.65));

        for (let r = y0; r <= y1; r++) {
          for (let c = x0; c <= x1; c++) {
            let idx = r * cols + c;
            if (cellGlyph[idx]) continue;
            let dx = c * cw + cw / 2 - ripple.x, dy = r * ch + ch / 2 - ripple.y;
            if (Math.abs(Math.hypot(dx, dy) - radius) > band) continue;
            let char = ring === 1 ? '.' : edgeGlyph(-dy, dx);
            this.glyphAt(idx, char, palette.water, alpha);
          }
        }
      }
    }
  }

  drawRocks(world) {
    // A rock is a stationary "species" in the koi renderer: it occupies the same
    // character cells and tile/glyph buffers as a fish, but its body is a union
    // of irregular top-down stone lobes instead of a moving spine.
    const { cw, ch, cols, rows, cellGlyph, cellColor, cellAlpha,
      cellTile, cellTileAlpha, palette } = this;
    this.rockEdgeCells = [];
    if (!world.rocks.length) return;

    // Derive every rock shade from the koi's own black/fin/ivory colors.
    // The darkest exposed value is deliberately lifted away from pure black.
    const exposedRamp = [
      lerpColor(palette.black, palette.fin, 0.16),
      lerpColor(palette.black, palette.fin, 0.29),
      lerpColor(palette.black, palette.fin, 0.43),
      lerpColor(palette.black, palette.fin, 0.58),
      lerpColor(palette.black, palette.fin, 0.74)
    ];
    const submergedRamp = [
      lerpColor(palette.fin, palette.white, 0.08),
      lerpColor(palette.fin, palette.white, 0.18),
      lerpColor(palette.fin, palette.white, 0.30),
      lerpColor(palette.fin, palette.white, 0.42)
    ];
    const rampAt = (ramp, amount) => {
      const p = clamp(amount, 0, 0.999) * (ramp.length - 1);
      const index = Math.floor(p);
      return lerpColor(ramp[index], ramp[index + 1], p - index);
    };

    for (const rock of world.rocks) {
      const stones = [...rock.stones].sort((a, b) => a.dy - b.dy);
      const minX = Math.min(...stones.map(stone => rock.x + stone.dx - stone.rx));
      const maxX = Math.max(...stones.map(stone => rock.x + stone.dx + stone.rx));
      const minY = Math.min(...stones.map(stone => rock.y + stone.dy - stone.ry));
      const maxY = Math.max(...stones.map(stone => rock.y + stone.dy + stone.ry));
      const extentX = Math.max(1, ...stones.map(stone => Math.abs(stone.dx) + stone.rx));
      const extentY = Math.max(1, ...stones.map(stone => Math.abs(stone.dy) + stone.ry));
      const x0 = Math.max(0, Math.floor((minX - cw) / cw));
      const x1 = Math.min(cols - 1, Math.floor((maxX + cw) / cw));
      const y0 = Math.max(0, Math.floor((minY - ch) / ch));
      const y1 = Math.min(rows - 1, Math.floor((maxY + ch) / ch));
      const occupied = new Set();

      const sampleStone = (x, y) => {
        let best = null;
        for (let stoneIndex = 0; stoneIndex < stones.length; stoneIndex++) {
          const stone = stones[stoneIndex];
          const sx = rock.x + stone.dx;
          const sy = rock.y + stone.dy;
          const nx = (x - sx) / stone.rx;
          const ny = (y - sy) / stone.ry;
          const radial = Math.hypot(nx, ny);
          const angle = Math.atan2(ny, nx);
          const contour = 1
            + 0.040 * Math.sin(angle * 5 + stone.tone * 1.7 + rock.variation * 3)
            + 0.022 * Math.sin(angle * 9 - stone.tone * 1.2 + rock.variation * 5);
          const grit = (hash(stoneIndex + rock.detailSeed, Math.floor(angle * 19), 311) - 0.5) * 0.045;
          if (radial <= contour + grit && (!best || radial < best.radial)) {
            best = { stone, stoneIndex, nx, ny, radial, angle };
          }
        }
        return best;
      };

      // First pass: coverage and shaded pixel tiles, using the koi's 8-point
      // subpixel sampling approach for rounded, irregular silhouettes.
      for (let row = y0; row <= y1; row++) {
        for (let col = x0; col <= x1; col++) {
          const idx = row * cols + col;
          const px = col * cw;
          const py = row * ch;
          const cx = px + cw / 2;
          const cy = py + ch / 2;
          let coverage = 0;
          let nearest = null;
          for (let sp = 0; sp < SUBPIXEL_OFFSETS.length; sp += 2) {
            const hit = sampleStone(px + SUBPIXEL_OFFSETS[sp] * cw, py + SUBPIXEL_OFFSETS[sp + 1] * ch);
            if (hit) {
              coverage++;
              if (!nearest || hit.radial < nearest.radial) nearest = hit;
            }
          }
          const centerHit = sampleStone(cx, cy);
          if (!coverage && !centerHit) continue;
          const hit = centerHit || nearest;
          if (!hit) continue;

          occupied.add(idx);
          const clusterX = (cx - rock.x) / extentX;
          const clusterY = (cy - rock.y) / extentY;
          const clusterRadius = Math.hypot(clusterX, clusterY);
          // The inner Z-level is the exposed rock surface. Its edge gradually
          // descends under the water and takes on the lighter koi-fin palette.
          const waterlineNoise = (perlinNoise2D(col * 0.17 + rock.id, row * 0.19, rock.detailSeed) - 0.5) * 0.07;
          const submerged = smoothstep(0.48, 0.94, clusterRadius + waterlineNoise);
          const detail = perlinNoise2D(col * 0.31 + rock.detailSeed, row * 0.29 + hit.stoneIndex, rock.id + 73);
          const grain = hash(col + rock.detailSeed * 3, row + hit.stoneIndex * 41, 157);
          const ridge = Math.abs((hit.nx * 0.72 + hit.ny * 0.46) - (hit.stone.tone - 1) * 0.085);
          const cellCoverage = clamp(coverage / 8, 0.22, 1);

          // Uneven mineral facets: several gray-blue values rather than black fill.
          const faceLevel = clamp(0.15 + (detail + 0.5) * 0.42 + (1 - hit.radial) * 0.20 + grain * 0.12, 0, 1);
          const exposed = rampAt(exposedRamp, faceLevel);
          const submergedTone = rampAt(submergedRamp, clamp(0.16 + detail * 0.62 + grain * 0.18, 0, 1));
          let tileColor = lerpColor(exposed, submergedTone, submerged);
          if (ridge < 0.075 && grain > 0.62) {
            tileColor = lerpColor(tileColor, palette.black, 0.16 * (1 - submerged));
          }

          // Store in the same koi tile buffer; no separate rock shadow or bevel pass.
          cellTile[idx] = packColor(tileColor);
          cellTileAlpha[idx] = (0.70 + cellCoverage * 0.27) * (1 - submerged * 0.18);

          // Dense, graded ASCII mineral texture on the exposed plane; quieter,
          // water-softened glyphs on the submerged shelf.
          let glyph = ' ';
          let glyphColor = tileColor;
          let glyphAlpha = 0;
          if (submerged < 0.30) {
            if (ridge < 0.055 && grain > 0.24) {
              glyph = (hit.nx - hit.ny + hit.stone.tone) > 0 ? '\\' : '/';
              glyphColor = lerpColor(exposedRamp[0], exposedRamp[2], 0.48 + detail * 0.3);
              glyphAlpha = 0.72 + grain * 0.20;
            } else if (grain > 0.17) {
              const glyphIndex = clamp(Math.floor((detail * 0.60 + grain * 0.40) * GLYPH_CHARS.length), 0, GLYPH_CHARS.length - 1);
              glyph = GLYPH_CHARS[glyphIndex];
              glyphColor = lerpColor(exposed, grain > 0.64 ? exposedRamp[4] : exposedRamp[0], 0.44);
              glyphAlpha = 0.48 + faceLevel * 0.38;
            }
          } else if (submerged < 0.76) {
            if (grain > 0.40) {
              const glyphIndex = clamp(Math.floor((detail * 0.55 + grain * 0.45) * GLYPH_CHARS.length), 0, GLYPH_CHARS.length - 1);
              glyph = GLYPH_CHARS[glyphIndex];
              glyphColor = lerpColor(submergedTone, palette.fin, grain * 0.28);
              glyphAlpha = 0.30 + (1 - submerged) * 0.24;
            } else if (ridge < 0.065 && grain > 0.16) {
              glyph = '.';
              glyphColor = palette.fin;
              glyphAlpha = 0.28;
            }
          } else if (grain > 0.68) {
            glyph = grain > 0.91 ? ':' : '.';
            glyphColor = lerpColor(submergedTone, palette.white, 0.20);
            glyphAlpha = 0.16 + (1 - submerged) * 0.13;
          }

          // Partial edge cells use a lighter glyph/less opaque block, just like
          // the koi's subpixel coverage, rather than a hard oval outline.
          if (glyph !== ' ' && cellCoverage > 0.24) {
            cellGlyph[idx] = glyph.charCodeAt(0);
            cellColor[idx] = packColor(glyphColor);
            cellAlpha[idx] = glyphAlpha * (0.58 + cellCoverage * 0.42);
          } else {
            cellGlyph[idx] = 32; // tile-only pixel; drawCells still handles it
            cellColor[idx] = packColor(tileColor);
            cellAlpha[idx] = 0;
          }
        }
      }

      // Build two thin rings outside the irregular rock silhouette. Their
      // glyphs animate as a waterline ripple and are drawn by the same glyphAt.
      const ringOne = new Map();
      for (const idx of occupied) {
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        const cx = col * cw + cw / 2;
        const cy = row * ch + ch / 2;
        const angle = Math.atan2(cy - rock.y, cx - rock.x);
        for (let oy = -1; oy <= 1; oy++) {
          for (let ox = -1; ox <= 1; ox++) {
            if (!ox && !oy) continue;
            const nx = col + ox;
            const ny = row + oy;
            if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
            const neighbor = ny * cols + nx;
            if (!occupied.has(neighbor) && !ringOne.has(neighbor)) {
              ringOne.set(neighbor, { idx: neighbor, angle, ring: 1, id: rock.id });
            }
          }
        }
      }
      const ringTwo = new Map();
      for (const edge of ringOne.values()) {
        const col = edge.idx % cols;
        const row = Math.floor(edge.idx / cols);
        for (let oy = -1; oy <= 1; oy++) {
          for (let ox = -1; ox <= 1; ox++) {
            if (!ox && !oy) continue;
            const nx = col + ox;
            const ny = row + oy;
            if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
            const neighbor = ny * cols + nx;
            if (!occupied.has(neighbor) && !ringOne.has(neighbor) && !ringTwo.has(neighbor)) {
              ringTwo.set(neighbor, { idx: neighbor, angle: edge.angle, ring: 2, id: rock.id });
            }
          }
        }
      }
      this.rockEdgeCells.push(...ringOne.values(), ...ringTwo.values());
    }
  }

  drawRockEdgeRipples(world) {
    const { cellGlyph, palette } = this;
    const rippleInk = lerpColor(palette.water, palette.fin, 0.52);
    for (const edge of this.rockEdgeCells || []) {
      if (cellGlyph[edge.idx]) continue;
      const phase = world.time * 1.55 + edge.angle * 2.0 + edge.id * 1.37 - edge.ring * 1.05;
      const wave = (Math.sin(phase) + 1) * 0.5;
      const threshold = edge.ring === 1 ? 0.28 : 0.72;
      if (wave < threshold) continue;
      const glyph = edge.ring === 1 ? (wave > 0.78 ? '~' : '.') : '.';
      const alpha = (edge.ring === 1 ? 0.15 : 0.075) + wave * (edge.ring === 1 ? 0.16 : 0.085);
      this.glyphAt(edge.idx, glyph, rippleInk, alpha);
    }
  }

  drawBites(world) {
    let { palette } = this;
    for (let bite of world.bites) {
      let idx = this.cellIndex(bite.x, bite.y);
      if (idx < 0) continue;
      let prog = (world.time - bite.born) / 0.45;
      let char = prog < 0.35 ? '*' : prog < 0.7 ? '+' : '.';
      this.glyphAt(idx, char, palette.pellet, Math.min(1, 1.6 * palette.alpha) * (1 - prog * prog));
    }
  }

  drawPellets(world) {
    let { cellGlyph, palette, ch } = this;
    for (let p of world.pellets) {
      let age = world.time - p.born;
      if (!p.landed) {
        let prog = age / p.landAt;
        let idx = this.cellIndex(p.x, p.y - (1 - prog) * ch * 1.5);
        if (idx < 0 || cellGlyph[idx]) continue;
        this.glyphAt(idx, prog < 0.5 ? "'" : '.', palette.pellet, palette.alpha * (0.5 + 0.4 * prog));
        continue;
      }
      let idx = this.cellIndex(p.x, p.y);
      if (idx < 0 || cellGlyph[idx]) continue;
      let fade = smoothstep(9, 14, age);
      let pulse = 0.8 + 0.2 * Math.sin(3 * age + p.x);
      this.glyphAt(idx, fade > 0.55 ? '.' : 'o', palette.pellet, palette.alpha * pulse * (1 - 0.85 * fade));
    }
  }

  drawCells() {
    let { ctx, cw, ch, cols, cellGlyph, cellColor, cellAlpha, cellTile, cellTileAlpha, cellDim } = this;
    for (let i = 0; i < cellGlyph.length; i++) {
      let charCode = cellGlyph[i];
      if (!charCode) continue;
      let x = (i % cols) * cw, y = ((i / cols) | 0) * ch;

      if (cellTileAlpha[i] > 0) {
        ctx.globalAlpha = cellTileAlpha[i] * cellDim[i];
        ctx.fillStyle = this.style(cellTile[i]);
        ctx.fillRect(x + 1, y + 1, cw - 1, ch - 1);
      }

      if (charCode !== 32) {
        ctx.globalAlpha = cellAlpha[i] * cellDim[i];
        ctx.fillStyle = this.style(cellColor[i]);
        ctx.fillText(String.fromCharCode(charCode), x + cw / 2, y + ch / 2 + 1);
      }
    }
  }

  render(world, dt, instantDim = false) {
    let { ctx, dpr, cols } = this;
    if (cols === 0) return;

    const dimStep = instantDim ? 1 : 1 - Math.exp(-Math.max(0, dt) * 5);
    for (let i = 0; i < this.cellDim.length; i++) {
      this.cellDim[i] += (this.cellDimTarget[i] - this.cellDim[i]) * dimStep;
    }

    this.cellGlyph.fill(0); this.cellTileAlpha.fill(0); this.cellShadow.fill(0);

    let sortedKoi = [...world.koi].sort((a, b) => a.depth - b.depth);
    for (let fish of sortedKoi) this.rasterizeKoi(fish, world.time);
    this.drawRocks(world); // static rock "species" shares the koi tile/glyph buffers

    this.depositWake(world);
    this.diffuse(dt);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.font = `600 ${Math.round(0.72 * this.ch)}px ${this.fontFamily}`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

    this.drawCloudShadows(world, instantDim, dt);
    this.drawShadows();
    this.drawWake();
    this.drawRipples(world);
    this.drawPellets(world);
    this.drawCells();
    this.drawRockEdgeRipples(world);
    this.drawBites(world);
    ctx.globalAlpha = 1;
  }
}

class Controller {
  constructor(canvasEl, isLight, onStats) {
    this.canvas = canvasEl;
    this.onStats = onStats;
    this.world = new World();
    this.renderer = new Renderer(canvasEl);
    this.renderer.setTheme(isLight);

    this.raf = this.last = this.acc = this.frames = this.lastPointerTime = 0;
    this.reported = { koi: -1, pellets: -1 };
    this.visible = true; this.disposed = false;

    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.intersectionObserver = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting;
      this.schedule();
    });

    this.schedule = () => {
      cancelAnimationFrame(this.raf);
      if (!this.disposed && this.visible) {
        if (this.reducedMotion.matches) return this.drawStill();
        this.last = performance.now();
        this.raf = requestAnimationFrame(this.frame);
      }
    };

    this.frame = ts => {
      let dt = Math.min(0.1, (ts - this.last) / 1000);
      this.last = ts; this.acc += dt;

      let steps = 0;
      while (this.acc >= STEP && steps < 4) {
        this.world.step(STEP);
        this.acc -= STEP;
        steps++;
      }
      if (steps === 4) this.acc = 0;

      if (++this.frames % 30 === 0) this.measureContent();
      this.renderer.render(this.world, dt);
      this.report();
      this.raf = requestAnimationFrame(this.frame);
    };

    this.onPointerMove = e => {
      let { x, y, inside } = this.toLocal(e);
      let ptr = this.world.pointer;
      let dt = Math.max(1, e.timeStamp - this.lastPointerTime) / 1000;
      let speed = Math.hypot(x - ptr.x, y - ptr.y) / dt;

      ptr.speed += (Math.min(speed, 5000) - ptr.speed) * 0.5;
      this.lastPointerTime = e.timeStamp;
      ptr.x = x; ptr.y = y;
      ptr.active = inside && e.pointerType !== 'touch';
    };

    this.onClick = e => {
      if (this.reducedMotion.matches) return;
      let path = e.composedPath ? e.composedPath() : [];
      if (path.some(el => el instanceof Element && el.matches('a, button, input, textarea, select, label, [role="button"], [data-koi-ignore]'))) return;
      if (document.documentElement.dataset.transition || (window.getSelection && window.getSelection().toString())) return;

      let { x, y, inside } = this.toLocal(e);
      if (inside) {
        this.world.feed(x, y);
        this.report();
      }
    };

    this.onPointerLeave = () => {
      this.world.pointer.active = false;
      this.world.pointer.speed = 0;
    };

    this.resizeObserver.observe(canvasEl);
    this.intersectionObserver.observe(canvasEl);
    this.reducedMotion.addEventListener('change', this.schedule);

    window.addEventListener('pointermove', this.onPointerMove, { passive: true });
    window.addEventListener('click', this.onClick);
    document.documentElement.addEventListener('pointerleave', this.onPointerLeave);
    window.addEventListener('blur', this.onPointerLeave);

    this.resize();
    this.schedule();
  }

  toLocal(e) {
    let rect = this.canvas.getBoundingClientRect();
    let x = e.clientX - rect.left, y = e.clientY - rect.top;
    return { x, y, inside: x >= 0 && y >= 0 && x <= rect.width && y <= rect.height };
  }

  measureContent() {
    let rect = this.canvas.getBoundingClientRect();
    let elements = Array.from(document.querySelectorAll('[data-koi-avoid]'), el => {
      let r = el.getBoundingClientRect();
      const setting = (el.getAttribute('data-koi-avoid') || '').trim().toLowerCase();
      const numeric = setting !== '' && Number.isFinite(Number(setting)) ? Number(setting) : null;
      const visibility = setting === 'hide' || setting === 'hidden'
        ? 0
        : numeric !== null ? clamp(numeric, 0, 1) : 0.035;
      const strength = setting === 'light' ? 0.25 : 1;
      return {
        left: r.left - rect.left,
        top: r.top - rect.top,
        right: r.right - rect.left,
        bottom: r.bottom - rect.top,
        visibility,
        strength
      };
    });

    let merged = [];
    for (let item of elements.sort((a, b) => a.top - b.top)) {
      let existing = merged.find(m => item.top - m.bottom < 160 && item.left - m.right < 160 && m.left - item.right < 160);
      if (!existing) {
        merged.push({ ...item });
      } else {
        existing.left = Math.min(existing.left, item.left);
        existing.right = Math.max(existing.right, item.right);
        existing.bottom = Math.max(existing.bottom, item.bottom);
        existing.visibility = Math.min(existing.visibility ?? 0.035, item.visibility ?? 0.035);
        existing.strength = Math.min(existing.strength ?? 1, item.strength ?? 1);
      }
    }

    this.renderer.setDimBoxes(merged);
    this.world.avoid = merged;
  }

  drawStill() {
    if (this.world.time < 4) {
      for (let i = 0; i < 240; i++) this.world.step(STEP);
    }
    this.measureContent();
    this.renderer.render(this.world, STEP, true);
    this.report();
  }

  report() {
    let koiCount = this.world.koi.length;
    let pelletCount = this.world.pellets.length;
    if (koiCount !== this.reported.koi || pelletCount !== this.reported.pellets) {
      this.reported = { koi: koiCount, pellets: pelletCount };
      if (this.onStats) this.onStats(this.reported);
    }
  }

  destroy() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.resizeObserver.disconnect();
    this.intersectionObserver.disconnect();
    this.reducedMotion.removeEventListener('change', this.schedule);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('click', this.onClick);
    document.documentElement.removeEventListener('pointerleave', this.onPointerLeave);
    window.removeEventListener('blur', this.onPointerLeave);
  }

  resize() {
    let rect = this.canvas.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.renderer.resize(rect.width, rect.height, dpr);
    this.world.resize(rect.width, rect.height);
    this.measureContent();
    this.world.placeRocks(this.world.avoid);
    this.report();
    if (this.reducedMotion.matches) this.drawStill();
  }

  setTheme(isLight) {
    this.renderer.setTheme(isLight);
    if (this.reducedMotion.matches) this.drawStill();
  }
}

let instance = null;
function isLightMode() {
  const root = document.documentElement;
  const body = document.body;
  const dark = root.classList.contains('dark') || body.classList.contains('dark') ||
    root.dataset.theme === 'dark' || body.dataset.theme === 'dark' ||
    !!document.querySelector('.site-shell.dark, .dark-theme, [data-theme="dark"]');
  return !dark;
}

function kick() {
  if (instance) {
    instance.setTheme(isLightMode());
    instance.resize();
    return;
  }
  instance = new Controller(canvas, isLightMode());
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', kick);
} else {
  kick();
}

return { kick, instance };
})();
