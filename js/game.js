/* Jogo: regras, simulação, desenho no canvas, sequência de blocos e som. */
const V = [[0, -1], [1, 0], [0, 1], [-1, 0]];

function sim(m, cmds) {
  const g = m.map, H = g.length, W = g[0].length;
  let s = { x: 0, y: 0, d: 1, got: [], done: [], switches: {}, visitIndex: 0 };

  g.forEach((r, y) => [...r].forEach((c, x) => {
    if (c === 'S') s = { x, y, d: 1, got: [], done: [], switches: {}, visitIndex: 0 };
  }));

  const t = (x, y) => y < 0 || y >= H || x < 0 || x >= W ? '#' : g[y][x] === 'S' ? '.' : g[y][x];
  const steps = [];
  const start = s;
  let bad = -1, msg = '';

  const program = [];
  for (let i = 0; i < cmds.length; i++) {
    const c = cmds[i];
    const repeat = c === 'repeat2' ? 2 : c === 'repeat3' ? 3 : 0;
    if (repeat) {
      const next = cmds[i + 1];
      if (!next || ['start', 'end', 'repeat2', 'repeat3', 'ifClear', 'ifWater'].includes(next)) {
        program.push({ c, sourceIndex: i });
      } else {
        for (let j = 0; j < repeat; j++) program.push({ c: next, sourceIndex: i });
        i++;
      }
    } else program.push({ c, sourceIndex: i });
  }

  for (let i = 0; i < program.length && bad < 0; i++) {
    const { c, sourceIndex } = program[i];
    const [dx, dy] = V[s.d];
    let n = { ...s, got: [...s.got], done: [...s.done], switches: { ...s.switches } }, ok = true, m2 = '';

    if (c === 'left') n.d = (s.d + 3) % 4;
    else if (c === 'right') n.d = (s.d + 1) % 4;
    else if (c === 'fwd') {
      const q = t(s.x + dx, s.y + dy);
      if (q === '#' || q === 'o') {
        ok = false;
        m2 = q === '#' ? 'Tem um obstáculo no caminho.' : 'Cuidado, tem água aí!';
      } else {
        n.x += dx; n.y += dy;
      }
    } else if (c === 'jump') {
      const a = t(s.x + dx, s.y + dy), b = t(s.x + 2 * dx, s.y + 2 * dy);
      if (a !== 'o') {
        ok = false; m2 = 'Só vale pular sobre a água.';
      } else if (b === '#' || b === 'o') {
        ok = false; m2 = 'O pulo precisa terminar em chão firme.';
      } else {
        n.x += 2 * dx; n.y += 2 * dy;
      }
    } else if (c === 'act') {
      if (t(s.x, s.y) === '*' && !s.got.includes(s.x + ',' + s.y)) {
        n.got.push(s.x + ',' + s.y);
      } else {
        ok = false; m2 = 'Não tem item para pegar aqui.';
      }
    } else if (c === 'toggle') {
      if (t(s.x, s.y) === '!') {
        const key = s.x + ',' + s.y;
        n.switches[key] = !s.switches[key];
      } else {
        ok = false; m2 = 'O bloco Alternar sinal só funciona em um interruptor.';
      }
    } else if (['paint', 'encode', 'connect', 'protect', 'build'].includes(c)) {
      const key = s.x + ',' + s.y;
      if (m.taskAction !== c || t(s.x, s.y) !== 'p') {
        ok = false; m2 = 'Esse bloco só funciona no ponto indicado para esta tarefa.';
      } else if (s.done.includes(key)) {
        ok = false; m2 = 'Este ponto já foi concluído.';
      } else n.done.push(key);
    } else if (c === 'ifClear') {
      const q = t(s.x + dx, s.y + dy);
      if (q !== '#' && q !== 'o') { n.x += dx; n.y += dy; }
    } else if (c === 'ifWater') {
      const ahead = t(s.x + dx, s.y + dy);
      if (ahead === 'o') {
        const landing = t(s.x + 2 * dx, s.y + 2 * dy);
        if (landing === '#' || landing === 'o') { ok = false; m2 = 'O pulo condicional precisa terminar em chão firme.'; }
        else { n.x += 2 * dx; n.y += 2 * dy; }
      } else if (ahead === '#' ) { ok = false; m2 = 'A condição não encontrou água nem um caminho livre.'; }
      else { n.x += dx; n.y += dy; }
    } else if (c === 'repeat2' || c === 'repeat3') {
      ok = false; m2 = 'Adicione um comando logo depois do bloco de repetição.';
    } else {
      ok = false; m2 = 'Esse bloco não é reconhecido pelo programa.';
    }

    if (ok && (n.x !== s.x || n.y !== s.y)) {
      if (t(n.x, n.y) === 'c') {
        const key = n.x + ',' + n.y;
        if (m.checkpoints?.[n.visitIndex] !== key) {
          ok = false; m2 = 'Passe pelos pontos de referência na ordem numerada.';
        } else n.visitIndex++;
      }
    }

    steps.push({ c, ok, from: s, to: n, sourceIndex });
    if (ok) s = n; else { bad = i; msg = m2; }
  }

  const total = g.join('').split('*').length - 1;
  const targetTotal = g.join('').split('p').length - 1;
  const switchTotal = g.join('').split('!').length - 1;
  const checkpointTotal = (m.checkpoints || []).length;
  let win = false;
  if (bad < 0) {
    const missingBlockGroups = (m.requiredBlockGroups || []).filter(group => !group.some(id => cmds.includes(id)));
    const objectiveDone = m.goalType === 'paint' || m.goalType === 'stations'
      ? s.done.length === targetTotal
      : m.goalType === 'switch'
        ? Object.values(s.switches).filter(Boolean).length === switchTotal
        : m.goalType === 'gather'
          ? s.got.length === total
          : m.goalType === 'visit'
            ? s.visitIndex === checkpointTotal
            : t(s.x, s.y) === 'G' && s.got.length === total;
    if (objectiveDone && missingBlockGroups.length === 0) {
      win = true;
    } else {
      if (m.goalType === 'paint' || m.goalType === 'stations') msg = `Faltam ${Math.max(0, targetTotal - s.done.length)} pontos de tarefa.`;
      else if (m.goalType === 'switch') msg = `Ainda há ${Math.max(0, switchTotal - Object.values(s.switches).filter(Boolean).length)} sinal(is) desligado(s).`;
      else if (m.goalType === 'gather' && s.got.length !== total) msg = `Faltam ${total - s.got.length} recurso(s) para recolher.`;
      else if (m.goalType === 'visit' && s.visitIndex !== checkpointTotal) msg = 'Ainda faltam pontos de referência na ordem correta.';
      else if (missingBlockGroups.length) {
        const labels = missingBlockGroups.map(group => group.map(id => BI[id]?.n || id).join(' ou '));
        msg = 'Para concluir esta etapa, use também: ' + labels.join('; ') + '.';
      } else if (m.goalType === 'route' || !m.goalType) msg = t(s.x, s.y) === 'G' ? 'Faltou pegar ' + m.item + '.' : 'Você parou antes da bandeira.';
    }
  }
  return { steps, start, bad, win, msg, state: s };
}

/* ---------- Canvas do Jogo ---------- */
let cur, seq = [], flowSeq = [], tries = 0, run = null, parts = [], T, W, H, dpr, stat, raf = 0, ilr = 0;
let activeProgramMode = 'guided';
const gc = $('stage');
const g = gc ? gc.getContext('2d') : null;
let v = { x: 0, y: 0, a: 0, lift: 0, got: [], done: [], switches: {}, visitIndex: 0 };

const rr = (c, x, y, w, h, r) => {
  c.beginPath();
  c.roundRect ? c.roundRect(x, y, w, h, r) : c.rect(x, y, w, h);
};

const pixelIcons = {};
const ic = (c, n, col, fill, x, y, k, dy = 0) => {
  const im = iconImg(n, col, fill);
  if (!im.complete || !im.naturalWidth) return;
  const s = T * k;
  const key = n + col + fill;
  if (!pixelIcons[key]) {
    const sprite = document.createElement('canvas');
    sprite.width = 32;
    sprite.height = 32;
    const px = sprite.getContext('2d');
    px.imageSmoothingEnabled = false;
    px.drawImage(im, 0, 0, 32, 32);
    pixelIcons[key] = sprite;
  }
  c.imageSmoothingEnabled = false;
  c.drawImage(pixelIcons[key], (x + 0.5) * T - s / 2, (y + 0.5) * T - s / 2 + dy, s, s);
  c.imageSmoothingEnabled = true;
};

const loadGameArt = (src) => {
  const image = new Image();
  image.onload = () => {
    cancelAnimationFrame(ilr);
    ilr = requestAnimationFrame(layout);
  };
  image.src = src;
  return image;
};
const heroSheet = loadGameArt('assets/sprout-lands/character-spritesheet.png');
const grassTileset = loadGameArt('assets/sprout-lands/grass-tileset.png');
const hillsTileset = loadGameArt('assets/sprout-lands/hills-tileset.png');
const dirtTileset = loadGameArt('assets/sprout-lands/tilled-dirt-tileset.png');
const fenceTileset = loadGameArt('assets/sprout-lands/fence-tileset.png');
const waterTileset = loadGameArt('assets/sprout-lands/water-tileset.png');
const biomeObjects = loadGameArt('assets/sprout-lands/grass-biome-objects.png');

const carrotArt = document.createElement('canvas');
carrotArt.width = carrotArt.height = 16;
const carrotContext = carrotArt.getContext('2d');
carrotContext.imageSmoothingEnabled = false;
[
  [5, 9, 12], [6, 8, 12], [7, 7, 12], [8, 6, 11], [9, 5, 10],
  [10, 4, 9], [11, 3, 8], [12, 3, 7], [13, 4, 6]
].forEach(([y, left, right]) => {
  carrotContext.fillStyle = '#b84816';
  carrotContext.fillRect(left, y, right - left, 1);
  if (right - left > 2) {
    carrotContext.fillStyle = '#ed7626';
    carrotContext.fillRect(left + 1, y, right - left - 1, 1);
  }
});
carrotContext.fillStyle = '#ffd36a';
[[8, 7], [6, 9], [4, 11]].forEach(([x, y]) => carrotContext.fillRect(x, y, 2, 1));
carrotContext.fillStyle = '#287a4c';
[[11, 4, 2, 2], [12, 2, 2, 3], [13, 1, 2, 3], [14, 2, 1, 3], [10, 3, 2, 2]].forEach(([x, y, w, h]) => carrotContext.fillRect(x, y, w, h));
carrotContext.fillStyle = '#54a85c';
[[12, 2], [14, 1], [11, 4]].forEach(([x, y]) => carrotContext.fillRect(x, y, 1, 2));

onIconLoad = () => {
  cancelAnimationFrame(ilr);
  ilr = requestAnimationFrame(layout);
};

function layout() {
  if (!cur || !gc || $('play').hidden) return;
  H = cur.map.length; W = cur.map[0].length;
  dpr = Math.min(devicePixelRatio || 1, 3);

  const cw = gc.clientWidth, ch = (cw * H) / W;
  gc.style.height = ch + 'px';
  gc.width = Math.round(cw * dpr);
  gc.height = Math.round(ch * dpr);
  T = gc.width / W;

  stat = document.createElement('canvas');
  stat.width = gc.width; stat.height = gc.height;
  const c = stat.getContext('2d');

  cur.map.forEach((r, y) => [...r].forEach((t, x) => {
    const gardenCell = gardenTileAt(x, y);
    const hillTile = hillTileAt(x, y, t);
    if (grassTileset.complete && grassTileset.naturalWidth) {
      const grassPatches = [[16, 80], [0, 80], [32, 80], [16, 96]];
      const [sx, sy] = grassPatches[(x * 3 + y * 5) % grassPatches.length];
      c.imageSmoothingEnabled = false;
      c.drawImage(grassTileset, sx, sy, 16, 16, x * T, y * T, T + 1, T + 1);
    } else {
      c.fillStyle = (x + y) % 2 ? '#e3f0d3' : '#ebf5de';
      c.fillRect(x * T, y * T, T + 1, T + 1);
    }

    if (gardenCell && dirtTileset.complete && dirtTileset.naturalWidth) {
      const dirtFrame = gardenCell === 'crop' ? [16, 0] : [0, 16];
      c.imageSmoothingEnabled = false;
      c.drawImage(dirtTileset, dirtFrame[0], dirtFrame[1], 16, 16, x * T, y * T, T + 1, T + 1);
    } else if (hillTile && hillsTileset.complete && hillsTileset.naturalWidth) {
      c.imageSmoothingEnabled = false;
      c.drawImage(hillsTileset, hillTile[0] * 16, hillTile[1] * 16, 16, 16, x * T, y * T, T + 1, T + 1);
    }
  }));

  cur.map.forEach((r, y) => [...r].forEach((t, x) => {
    if (t === '#') drawTree(c, x, y);
    if (t === 'G') {
      c.fillStyle = '#f4c64e';
      c.fillRect(x * T + T * 0.08, y * T + T * 0.08, T * 0.84, T * 0.84);
      c.fillStyle = '#ffdc75';
      c.fillRect(x * T + T * 0.16, y * T + T * 0.16, T * 0.68, T * 0.12);
      const p = T / 16, ox = x * T, oy = y * T;
      c.fillStyle = '#25354b';
      c.fillRect(ox + 5 * p, oy + 3 * p, 1.5 * p, 10 * p);
      c.fillRect(ox + 6 * p, oy + 3 * p, 6 * p, p);
      c.fillRect(ox + 11 * p, oy + 4 * p, 2 * p, 3 * p);
      c.fillRect(ox + 7 * p, oy + 7 * p, 5 * p, p);
      c.fillStyle = '#f7b72f';
      c.fillRect(ox + 7 * p, oy + 4 * p, 4 * p, 3 * p);
      c.fillRect(ox + 8 * p, oy + 8 * p, 3 * p, p);
    }
    if (t === 'S') {
      c.strokeStyle = '#277C4888';
      c.setLineDash([T * 0.1, T * 0.1]);
      c.lineWidth = T * 0.05;
      rr(c, x * T + T * 0.08, y * T + T * 0.08, T * 0.84, T * 0.84, T * 0.2);
      c.stroke();
      c.setLineDash([]);
    }
    if (cur.id === 'horta' && y === cur.map.findIndex(row => row.includes('*')) && (x === cur.map[y].indexOf('*') - 1 || x === cur.map[y].indexOf('*')) && fenceTileset.complete && fenceTileset.naturalWidth) {
      const fenceFrame = x < cur.map[y].indexOf('*') ? 16 : 48;
      c.imageSmoothingEnabled = false;
      c.drawImage(fenceTileset, fenceFrame, 0, 16, 16, x * T, y * T + T * 0.03, T, T * 0.22);
    }
  }));
}

function hillTileAt(x, y, tile) {
  if (!['.', 'o'].includes(tile)) return null;
  if (y === 0) return [x === 0 ? 0 : x === W - 1 ? 2 : 1, 0];
  if (y === H - 1) return [x === 0 ? 0 : x === W - 1 ? 2 : 1, 2];
  if (x === 0) return [0, 1];
  if (x === W - 1) return [2, 1];
  return null;
}

function drawWaterShore(c, x, y) {
  if (!grassTileset.complete || !grassTileset.naturalWidth) return;
  const land = (cx, cy) => cy >= 0 && cy < H && cx >= 0 && cx < W && cur.map[cy][cx] !== 'o' && cur.map[cy][cx] !== '#';
  const px = T / 16;
  const edges = [
    { dx: 0, dy: -1, sx: 0, sy: 13, sw: 16, sh: 3, tx: x * T, ty: (y - 1) * T + T - 3 * px, tw: T, th: 3 * px },
    { dx: 1, dy: 0, sx: 0, sy: 0, sw: 3, sh: 16, tx: (x + 1) * T, ty: y * T, tw: 3 * px, th: T },
    { dx: 0, dy: 1, sx: 0, sy: 0, sw: 16, sh: 3, tx: x * T, ty: (y + 1) * T, tw: T, th: 3 * px },
    { dx: -1, dy: 0, sx: 13, sy: 0, sw: 3, sh: 16, tx: (x - 1) * T + T - 3 * px, ty: y * T, tw: 3 * px, th: T },
  ];
  edges.forEach(edge => {
    if (land(x + edge.dx, y + edge.dy)) {
      c.drawImage(grassTileset, edge.sx, edge.sy, edge.sw, edge.sh, edge.tx, edge.ty, edge.tw, edge.th);
    }
  });
}

function gardenTileAt(x, y) {
  if (cur?.id !== 'horta') return null;
  const seedY = cur.map.findIndex(row => row.includes('*'));
  const seedX = seedY < 0 ? -1 : cur.map[seedY].indexOf('*');
  if (x < seedX - 1 || x > seedX || y < seedY || y > seedY + 1) return null;
  return x === seedX && y === seedY ? 'crop' : 'soil';
}

function drawTree(c, x, y) {
  const width = T * 0.58, height = T * 0.94;
  if (biomeObjects.complete && biomeObjects.naturalWidth) {
    c.imageSmoothingEnabled = false;
    c.drawImage(biomeObjects, 0, 0, 16, 32, (x + 0.5) * T - width / 2, (y + 0.5) * T - height / 2, width, height);
    c.imageSmoothingEnabled = true;
    return;
  }
  const p = T / 16, ox = x * T, oy = y * T;
  c.fillStyle = '#185d43';
  [[6, 1, 4, 2], [4, 3, 8, 2], [2, 5, 12, 4], [4, 9, 8, 2], [6, 11, 4, 1]].forEach(([a, b, w, h]) => c.fillRect(ox + a * p, oy + b * p, w * p, h * p));
  c.fillStyle = '#278552';
  [[6, 2, 4, 2], [4, 4, 8, 2], [3, 6, 10, 3], [5, 9, 6, 2]].forEach(([a, b, w, h]) => c.fillRect(ox + a * p, oy + b * p, w * p, h * p));
  c.fillStyle = '#795543';
  c.fillRect(ox + 7 * p, oy + 11 * p, 2 * p, 4 * p);
}

if (gc) new ResizeObserver(layout).observe(gc);

function resetV() {
  if (!cur) return;
  const s = sim(cur, []).start;
  v = { x: s.x, y: s.y, a: (s.d * Math.PI) / 2, lift: 0, got: [], done: [], switches: {}, visitIndex: 0 };
}

const dur = (s) => ({ fwd: 420, ifClear: 420, jump: 650, ifWater: 650, left: 280, right: 280, act: 380, toggle: 340, paint: 360, encode: 360, connect: 360, protect: 360, build: 360 }[s.c] || 180) * slowF() * (s.ok ? 1 : 1.1);

function tick(ts) {
  raf = requestAnimationFrame(tick);
  if (!stat || !g || !cur) return;

  if (run) {
    const s = run.steps[run.i];
    if (!run.t0) run.t0 = ts;
    const p = Math.min(1, (ts - run.t0) / dur(s));
    const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    const f = s.from, t = s.ok ? s.to : s.from, [dx, dy] = V[f.d];

    v.lift = 0;
    v.x = f.x + (t.x - f.x) * e;
    v.y = f.y + (t.y - f.y) * e;

    const df = (t.d - f.d + 4) % 4;
    v.a = (f.d * Math.PI) / 2 + ((df === 3 ? -1 : df) * Math.PI) / 2 * e;

    if ((s.c === 'jump' || s.c === 'ifWater') && s.ok && Math.abs(t.x - f.x) + Math.abs(t.y - f.y) > 1) v.lift = Math.sin(Math.PI * p) * 0.8;
    if (!s.ok) {
      if (s.c === 'fwd' || s.c === 'ifClear' || s.c === 'jump' || s.c === 'ifWater') {
        v.x = f.x + dx * 0.18 * Math.sin(Math.PI * p);
        v.y = f.y + dy * 0.18 * Math.sin(Math.PI * p);
      } else v.x = f.x + 0.06 * Math.sin(p * 24);
    }
    if (s.c === 'act' && s.ok) v.lift = Math.sin(Math.PI * p) * 0.3;

    v.got = p > 0.5 ? s.to.got : s.from.got;
    v.done = p > 0.5 ? s.to.done : s.from.done;
    v.switches = p > 0.5 ? s.to.switches : s.from.switches;
    v.visitIndex = p > 0.5 ? s.to.visitIndex : s.from.visitIndex;
    mark(s.sourceIndex ?? run.i);

    if (p >= 1) {
      run.i++;
      run.t0 = 0;
      if (run.i >= run.steps.length) end();
    }
  }

  g.clearRect(0, 0, gc.width, gc.height);
  g.drawImage(stat, 0, 0);

  if (waterTileset.complete && waterTileset.naturalWidth) {
    const waterFrame = Math.floor(ts / 320) % 4;
    g.imageSmoothingEnabled = false;
    cur.map.forEach((row, y) => [...row].forEach((tile, x) => {
      if (tile === 'o') {
        g.drawImage(waterTileset, waterFrame * 16, 0, 16, 16, x * T, y * T, T + 1, T + 1);
        drawWaterShore(g, x, y);
      }
    }));
    g.imageSmoothingEnabled = true;
  }

  cur.map.forEach((r, y) => [...r].forEach((t, x) => {
    if (t === '*' && !v.got.includes(x + ',' + y)) {
      const dy = Math.sin(ts / 300 + x) * T * 0.03;
      if (cur.ico === 'carrot') {
        g.imageSmoothingEnabled = false;
        g.drawImage(carrotArt, (x + 0.5) * T - T * 0.31, (y + 0.5) * T - T * 0.31 + dy, T * 0.62, T * 0.62);
      } else ic(g, cur.ico, cur.ic, cur.if, x, y, 0.62, dy);
    }
  }));

  drawTaskMarkers(g);

  hero();

  parts = parts.filter((q) => q.l > 0);
  parts.forEach((q) => {
    q.x += q.vx; q.y += q.vy; q.vy += 0.35; q.l--;
    g.globalAlpha = Math.min(1, q.l / 20);
    g.fillStyle = q.c;
    g.fillRect(q.x, q.y, T * 0.1, T * 0.1);
  });
  g.globalAlpha = 1;
}

function hero() {
  const cx = (v.x + 0.5) * T, cy = (v.y + 0.5) * T - v.lift * T;
  const dir = ((Math.round(v.a / (Math.PI / 2)) % 4) + 4) % 4;
  const spriteRow = [1, 3, 0, 2][dir];
  const step = run && run.steps[run.i];
  const walking = step && step.ok && (step.c === 'fwd' || step.c === 'ifClear' || step.c === 'jump' || step.c === 'ifWater') && run.t0;
  const frame = walking ? Math.floor(performance.now() / 145) % 4 : 0;
  const spriteX = frame * 48 + 16;
  const spriteY = spriteRow * 48 + 16;
  const size = T * 0.72;
  if (heroSheet.complete && heroSheet.naturalWidth) {
    g.imageSmoothingEnabled = false;
    g.drawImage(heroSheet, spriteX, spriteY, 16, 16, Math.round(cx - size / 2), Math.round(cy - size / 2), Math.round(size), Math.round(size));
  }
  g.imageSmoothingEnabled = true;
}

function drawTaskMarkers(c) {
  if (!cur?.goalType || cur.goalType === 'route' || !T) return;
  cur.map.forEach((row, y) => [...row].forEach((tile, x) => {
    if (!['p', '!', 'c'].includes(tile)) return;
    const key = x + ',' + y;
    const done = v.done.includes(key);
    const on = !!v.switches[key];
    const inset = T * .16;
    const taskColors = {
      paint: ['#f4edc9', '#acd79a'], encode: ['#d9edf1', '#8cc8d0'],
      connect: ['#e4e9f5', '#aab7e2'], protect: ['#f4e7d9', '#acd7a2'],
      build: ['#eee6d9', '#d7b47d'],
    }[cur.taskAction] || ['#f4edc9', '#acd79a'];
    c.fillStyle = tile === '!' ? (on ? '#d6f4ad' : '#f4df83') : tile === 'c' ? '#d5e9ed' : done ? taskColors[1] : taskColors[0];
    c.fillRect(x * T + inset, y * T + inset, T - inset * 2, T - inset * 2);
    c.strokeStyle = tile === '!' ? '#477747' : tile === 'c' ? '#416b83' : '#916a2d';
    c.lineWidth = Math.max(1, T * .045);
    c.strokeRect(x * T + inset, y * T + inset, T - inset * 2, T - inset * 2);
    c.fillStyle = '#28413b';
    c.font = `700 ${Math.max(10, T * .36)}px monospace`;
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    const targetGlyph = { paint: '+', encode: '0', connect: 'o', protect: '!', build: '□' }[cur.taskAction] || '+';
    const doneGlyph = { paint: '#', encode: '1', connect: '×', protect: '✓', build: '■' }[cur.taskAction] || '■';
    const label = tile === '!' ? (on ? '1' : '0') : tile === 'c' ? String((cur.checkpoints || []).indexOf(key) + 1) : done ? doneGlyph : targetGlyph;
    c.fillText(label, (x + .5) * T, (y + .51) * T);
  }));
}

/* ---------- Sequência com Início e Fim Fixos + Som ---------- */
const cardEl = (b, extra = '') => {
  const e = document.createElement('button');
  e.className = 'card ' + extra;
  e.dataset.blockId = b.id;
  e.style.background = b.c;
  e.style.color = b.k;
  e.innerHTML = svg(b.id, 18) + b.n;
  return e;
};

function placeScanButton(mode) {
  const slot = $(mode === 'freeflow' ? 'scanFreeflowSlot' : 'scanGuidedSlot');
  const button = $('toggleCamBtn');
  if (slot && button && button.parentElement !== slot) slot.append(button);
}

function setProgramMode(mode) {
  if (run) return;
  activeProgramMode = mode;
  const workspace = document.querySelector('.scratch-grid');
  workspace?.classList.toggle('flow-mode', mode === 'freeflow');
  workspace?.classList.toggle('guided-mode', mode === 'guided');
  placeScanButton(mode);
  $('guidedEditor').hidden = mode !== 'guided';
  $('freeflowEditor').hidden = mode !== 'freeflow';
  $('guidedModeBtn').classList.toggle('active', mode === 'guided');
  $('freeflowModeBtn').classList.toggle('active', mode === 'freeflow');
  $('guidedModeBtn').setAttribute('aria-pressed', String(mode === 'guided'));
  $('freeflowModeBtn').setAttribute('aria-pressed', String(mode === 'freeflow'));
  syncMissionActions();
  requestAnimationFrame(layout);
}

function flowIsValid() {
  return flowSeq.length >= 3 && flowSeq[0] === 'start' && flowSeq.at(-1) === 'end' &&
    flowSeq.filter(id => id === 'start').length === 1 &&
    flowSeq.filter(id => id === 'end').length === 1;
}

function flowStatusText() {
  if (!flowSeq.length) return '';
  if (!flowSeq.includes('start')) return 'Arraste o bloco Início para a sequência.';
  if (flowSeq[0] !== 'start') return 'Mova Início para o topo da sequência.';
  if (!flowSeq.includes('end')) return 'Arraste o bloco Fim para a sequência.';
  if (flowSeq.at(-1) !== 'end') return 'Mova Fim para o final da sequência.';
  if (flowSeq.length < 3) return 'Adicione pelo menos um comando entre Início e Fim.';
  return 'Sequência pronta. Você já pode executar!';
}

function flowCard(id, index = -1) {
  const b = BI[id];
  const e = document.createElement('div');
  e.className = 'flow-block' + (id === 'start' || id === 'end' ? ' flow-terminal' : '');
  e.draggable = true;
  e.tabIndex = index >= 0 ? 0 : -1;
  e.dataset.flowId = id;
  e.dataset.flowIndex = index;
  e.style.background = b.c;
  e.style.color = b.k;
  e.innerHTML = `<span class="flow-block-label">${svg(b.id, 20)}<span>${b.n}</span></span>`;
  if (index >= 0) {
    e.setAttribute('aria-label', `${b.n}, posição ${index + 1}. Arraste para reordenar. Pressione Delete para remover.`);
    e.addEventListener('keydown', (event) => {
      if ((event.key === 'Delete' || event.key === 'Backspace') && !run) {
        event.preventDefault();
        removeFlowBlock(index);
      }
    });
  }
  return e;
}

function removeFlowBlock(index) {
  if (run || index < 0 || index >= flowSeq.length) return;
  flowSeq.splice(index, 1);
  refreshFlow();
  $('flowStatus').textContent = 'Bloco removido. Arraste outros blocos para reorganizar a sequência.';
  $('flowStatus').hidden = false;
}

function refreshFlow() {
  const lane = $('flowLane');
  if (!lane) return;
  lane.innerHTML = '';
  if (!flowSeq.length) {
    const empty = document.createElement('p');
    empty.className = 'flow-empty';
    empty.textContent = 'Solte os blocos aqui. Eles se encaixam em uma sequência vertical.';
    lane.append(empty);
  }
  flowSeq.forEach((id, index) => lane.append(flowCard(id, index)));
  $('flowStatus').textContent = flowStatusText();
  $('flowStatus').hidden = !$('flowStatus').textContent;
  $('flowGo').disabled = !flowIsValid() || !!run;
  if (!run) {
    $('flowGo').textContent = '▶ Executar';
    $('flowGo').onclick = runFreeflow;
  }
}

function flowPayload(event, id, origin, index = -1) {
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', id);
  event.dataTransfer.setData('application/x-mangueblock-origin', origin);
  event.dataTransfer.setData('application/x-mangueblock-index', String(index));
  if (origin === 'lane') event.dataTransfer.setData('application/x-mangueblock-existing', 'true');
}

const flowPalette = $('flowPalette');
B.forEach((b) => {
  const source = flowCard(b.id);
  source.classList.add('flow-source');
  source.addEventListener('dragstart', (event) => flowPayload(event, b.id, 'palette'));
  flowPalette.append(source);
});

let flowDiscardHandled = false;

$('flowLane').addEventListener('dragstart', (event) => {
  const block = event.target.closest('.flow-block[data-flow-index]');
  if (block) {
    flowDiscardHandled = false;
    flowPayload(event, block.dataset.flowId, 'lane', Number(block.dataset.flowIndex));
  }
});

$('flowLane').addEventListener('dragover', (event) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
  $('flowLane').classList.add('is-drag-over');
  $('flowLane').querySelectorAll('.drop-before, .drop-after').forEach((node) => node.classList.remove('drop-before', 'drop-after'));
  const block = event.target.closest('.flow-block[data-flow-index]');
  if (block) block.classList.add(event.clientY < block.getBoundingClientRect().top + block.offsetHeight / 2 ? 'drop-before' : 'drop-after');
});

$('flowLane').addEventListener('dragleave', (event) => {
  if (!event.currentTarget.contains(event.relatedTarget)) $('flowLane').classList.remove('is-drag-over');
});

$('freeflowEditor').addEventListener('dragover', (event) => {
  const fromLane = [...event.dataTransfer.types].includes('application/x-mangueblock-existing');
  const onCanvas = $('flowCanvas').contains(event.target);
  if (!fromLane || onCanvas || run) return;
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
  $('freeflowEditor').classList.add('is-discard-target');
  const overSidebar = $('flowSidebar').contains(event.target);
  $('flowSidebar').classList.toggle('is-discard-target', overSidebar);
  $('flowSidebarAction').textContent = overSidebar ? 'Solte para remover' : 'Blocos';
});

$('freeflowEditor').addEventListener('dragleave', (event) => {
  if (!event.currentTarget.contains(event.relatedTarget)) {
    $('freeflowEditor').classList.remove('is-discard-target');
    $('flowSidebar').classList.remove('is-discard-target');
    $('flowSidebarAction').textContent = 'Blocos';
  }
});

$('freeflowEditor').addEventListener('drop', (event) => {
  const onCanvas = $('flowCanvas').contains(event.target);
  const origin = event.dataTransfer.getData('application/x-mangueblock-origin');
  if (onCanvas || origin !== 'lane' || run) return;
  event.preventDefault();
  flowDiscardHandled = true;
  $('freeflowEditor').classList.remove('is-discard-target');
  $('flowSidebar').classList.remove('is-discard-target');
  $('flowSidebarAction').textContent = 'Blocos';
  removeFlowBlock(Number(event.dataTransfer.getData('application/x-mangueblock-index')));
});

$('flowLane').addEventListener('drop', (event) => {
  event.preventDefault();
  const lane = $('flowLane');
  lane.classList.remove('is-drag-over');
  lane.querySelectorAll('.drop-before, .drop-after').forEach((node) => node.classList.remove('drop-before', 'drop-after'));
  if (run) return;

  const id = event.dataTransfer.getData('text/plain');
  const origin = event.dataTransfer.getData('application/x-mangueblock-origin');
  const oldIndex = origin === 'lane' ? Number(event.dataTransfer.getData('application/x-mangueblock-index')) : -1;
  if (!BI[id]) return;

  const target = event.target.closest('.flow-block[data-flow-index]');
  let insertAt = flowSeq.length;
  if (target) {
    const targetIndex = Number(target.dataset.flowIndex);
    insertAt = targetIndex + (event.clientY >= target.getBoundingClientRect().top + target.offsetHeight / 2 ? 1 : 0);
  }
  if (oldIndex >= 0) {
    flowSeq.splice(oldIndex, 1);
    if (oldIndex < insertAt) insertAt--;
  } else if ((id === 'start' || id === 'end') && flowSeq.includes(id)) {
    $('flowStatus').textContent = `A sequência já tem o bloco ${BI[id].n}.`;
    $('flowStatus').hidden = false;
    return;
  }
  flowSeq.splice(Math.max(0, Math.min(insertAt, flowSeq.length)), 0, id);
  refreshFlow();
});

$('flowLane').addEventListener('dragend', (event) => {
  const block = event.target.closest('.flow-block[data-flow-index]');
  if (block && !flowDiscardHandled && !run) {
    const rect = $('flowCanvas').getBoundingClientRect();
    const outsideCanvas = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
    if (outsideCanvas) removeFlowBlock(Number(block.dataset.flowIndex));
  }
  flowDiscardHandled = false;
  $('flowLane').classList.remove('is-drag-over');
  $('flowLane').querySelectorAll('.drop-before, .drop-after').forEach((node) => node.classList.remove('drop-before', 'drop-after'));
  $('freeflowEditor').classList.remove('is-discard-target');
  $('flowSidebar').classList.remove('is-discard-target');
  $('flowSidebarAction').textContent = 'Blocos';
});

$('flowSidebar').classList.add('is-expanded');
$('flowSidebarToggle').setAttribute('aria-expanded', 'true');
$('flowSidebarToggle').onclick = () => {
  const expanded = $('flowSidebar').classList.toggle('is-expanded');
  $('flowSidebarToggle').setAttribute('aria-expanded', String(expanded));
};
$('guidedModeBtn').onclick = () => setProgramMode('guided');
$('freeflowModeBtn').onclick = () => setProgramMode('freeflow');
$('flowClear').onclick = () => {
  if (!run) {
    flowSeq = [];
    resetV();
    refreshFlow();
  }
};

/* Desenha a bandeja de sequência contendo Início e Fim fixos (cinzas) */
function drawTray(bad = -1) {
  const t = $('tray');
  if (!t) return;
  t.innerHTML = '';

  // 1. Bloco de Início Fixo Desativado
  if (typeof BI !== 'undefined' && BI.start) {
    const startCard = cardEl(BI.start, 'fixed-card');
    startCard.title = 'Início do Programa';
    t.append(startCard);
  }

  // 2. Blocos de Ação do Usuário
  seq.forEach((id, i) => {
    const e = cardEl(BI[id], `removable-card${i === bad ? ' err' : ''}`);
    e.dataset.i = i;
    e.insertAdjacentHTML('afterbegin', `<small>${i + 1}</small>`);
    e.title = `Remover ${BI[id].n} da sequência`;
    e.setAttribute('aria-label', e.title);
    e.onclick = () => {
      if (run) return;
      seq.splice(i, 1);
      if (typeof pip === 'function') pip(400, 0.05); // Som ao remover
      drawTray();
      clearFb();
    };
    t.append(e);
  });

  // 3. Bloco de Fim Fixo Desativado
  if (typeof BI !== 'undefined' && BI.end) {
    const endCard = cardEl(BI.end, 'fixed-card');
    endCard.title = 'Fim do Programa';
    t.append(endCard);
  }

  if ($('go')) $('go').disabled = !seq.length || !!run;
}

let lastI = -1;
function mark(i) {
  if (i !== lastI) {
    lastI = i;
    const commands = activeProgramMode === 'freeflow' ? flowSeq.filter(id => id !== 'start' && id !== 'end') : seq;
    if (i >= 0 && typeof note === 'function') note(commands[i]);
  }
  if (activeProgramMode === 'freeflow') return;
  const tray = $('tray');
  if (tray) {
    tray.classList.toggle('is-running', i >= 0);
    tray.querySelectorAll('.removable-card').forEach((card) => {
      const current = Number(card.dataset.i) === i;
      card.classList.toggle('on', current);
      card.classList.toggle('is-executing', current);
      card.classList.toggle('is-muted', i >= 0 && !current);
    });
  }
}

function syncMissionActions() {
  if (!$('missionActions')) return;
  $('go').hidden = activeProgramMode !== 'guided' || !$('fb').hidden;
  $('fbtn').hidden = activeProgramMode !== 'guided' || $('fb').hidden;
  $('flowGo').hidden = activeProgramMode !== 'freeflow';
}

function clearFb() {
  if ($('fb')) $('fb').hidden = true;
  syncMissionActions();
}

/* Paleta de Blocos Digitais (Filtrando Início e Fim para não duplicar) */
if ($('pal')) {
  $('pal').innerHTML = '';
  $('pal').className = 'pal pal-large';

  // Omitir 'start' e 'end' da paleta para manter a tela limpa
  const actionBlocks = B.filter((b) => b.id !== 'start' && b.id !== 'end');

  actionBlocks.forEach((b) => {
    const e = cardEl(b);
    e.onclick = () => {
      if (!run && seq.length < 30) {
        seq.push(b.id);
        if (typeof note === 'function') note(b.id); // Toca o som do bloco inserido!
        clearFb();
        drawTray();
      }
    };
    $('pal').append(e);
  });
}

if ($('clear')) {
  $('clear').onclick = () => {
    if (!run) {
      seq = [];
      if (typeof pip === 'function') pip(300, 0.08);
      clearFb();
      drawTray();
      resetV();
    }
  };
}

if ($('toggleCamBtn')) {
  $('toggleCamBtn').onclick = () => {
    const open = $('phys').hidden;
    $('phys').hidden = !open;
    $('toggleCamBtn').setAttribute('aria-expanded', String(open));
    $('toggleCamBtn').innerHTML = (open ? svg('camera', 18) + ' Fechar leitor' : svg('camera', 18) + ' Ler cartões');
    if (open) $('phys').scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    else if (typeof camOff === 'function') camOff();
  };
}

if ($('hint')) {
  $('hint').onclick = () => {
    const h = $('hx');
    if (h && cur) {
      h.textContent = cur.hint;
      h.hidden = !h.hidden;
    }
  };
}

if ($('go')) {
  $('go').onclick = () => {
    if (!seq.length || run || !cur) return;
    startProgram(seq, 'guided');
  };
}

function startProgram(commands, mode) {
  if (!commands.length || run || !cur) return;
  activeProgramMode = mode;
  lastI = -1;
  tries++;
  const r = sim(cur, commands);
  resetV();
  if (mode === 'guided') clearFb();
  $('go').disabled = true;
  $('flowGo').disabled = true;
  run = {
    steps: r.steps.length ? r.steps : [{ c: 'start', ok: true, from: r.start, to: r.start }],
    i: 0,
    t0: 0,
    r,
  };
}

function runFreeflow() {
  if (!flowIsValid() || run || !cur) return;
  const commands = flowSeq.filter(id => id !== 'start' && id !== 'end');
  $('flowStatus').textContent = 'Executando sua sequência…';
  $('flowStatus').hidden = false;
  startProgram(commands, 'freeflow');
}

function end() {
  const r = run.r;
  run = null;
  mark(-1);
  if (typeof jingle === 'function') jingle(r.win);
  const isFreeflow = activeProgramMode === 'freeflow';
  if (!isFreeflow && $('go')) $('go').hidden = true;

  const f = $('fb');
  if (!isFreeflow && f) {
    f.hidden = false;
    f.className = 'fb' + (r.win ? '' : ' bad');
  }
  if (!isFreeflow && $('ft')) $('ft').textContent = r.win ? 'Muito bem!' : 'Quase lá!';
  if (!isFreeflow && $('fm')) $('fm').textContent = r.win ? (cur.goalText || 'Você cumpriu o objetivo da etapa.') : r.msg;
  if (!isFreeflow && $('fbtn')) $('fbtn').textContent = r.win ? (nextMissionInWorld(cur) ? 'Próxima etapa' : 'Concluir mundo') : 'Tentar de novo';
  if (isFreeflow) {
    $('flowStatus').textContent = r.win ? (cur.goalText || 'Muito bem! Objetivo concluído.') : r.msg;
    $('flowStatus').hidden = false;
    $('flowGo').disabled = false;
  }
  if (r.win) {
    const c = ['#27ae60', '#f39c12', '#2980b9', '#ef8661'];
    for (let i = 0; i < 70; i++) {
      parts.push({
        x: gc.width / 2, y: gc.height / 2,
        vx: (Math.random() - 0.5) * T * 0.35,
                 vy: -Math.random() * T * 0.3,
                 l: 60 + Math.random() * 30,
                 c: c[i % 4],
      });
    }
    const st = tries <= 1 ? 3 : tries === 2 ? 2 : 1;
    save.done[cur.id] = Math.max(save.done[cur.id] || 0, st);
    save.xp += st * 5;
    persist();
    if (typeof updateXP === 'function') updateXP();
    if (isFreeflow) {
      $('flowGo').textContent = nextMissionInWorld(cur) ? 'Próxima etapa' : 'Concluir mundo';
      $('flowGo').onclick = advanceMission;
    } else if ($('fbtn')) $('fbtn').onclick = advanceMission;
  } else {
    if (!isFreeflow) drawTray(r.bad);
    if (isFreeflow) {
      $('flowGo').textContent = '↻ Tentar de novo';
      $('flowGo').onclick = runFreeflow;
    } else if ($('fbtn')) $('fbtn').onclick = () => {
      clearFb();
      drawTray();
      resetV();
      if ($('go')) $('go').disabled = !seq.length;
    };
  }
  if (!isFreeflow && $('go')) $('go').disabled = false;
  syncMissionActions();
}

/* ---------- Abrir e Sair de Missões ---------- */
function missionWorldPosition(mission) {
  if (!mission || !Array.isArray(THEMES)) return null;
  for (const theme of THEMES) {
    const index = theme.stages?.findIndex(stage => stage.missionId === mission.id) ?? -1;
    if (index >= 0) return { theme, index, stages: theme.stages };
  }
  return null;
}

function nextMissionInWorld(mission) {
  const position = missionWorldPosition(mission);
  if (!position) return null;
  const nextStage = position.stages[position.index + 1];
  return nextStage ? M.find(item => item.id === nextStage.missionId) || null : null;
}

function updateWorldStepProgress(mission) {
  const container = $('worldStepProgress');
  const bar = container?.querySelector('[role="progressbar"]');
  const fill = $('worldStepFill');
  const label = $('worldStepLabel');
  const position = missionWorldPosition(mission);
  if (!container || !bar || !fill || !label) return;
  if (!position) {
    container.hidden = true;
    return;
  }
  const total = position.stages.length;
  const current = position.index + 1;
  const percent = Math.round((current / total) * 100);
  container.hidden = false;
  fill.style.width = `${percent}%`;
  bar.setAttribute('aria-valuenow', String(percent));
  label.textContent = `${current} / ${total}`;
}

function advanceMission() {
  const next = nextMissionInWorld(cur);
  if (next) openMission(next);
  else leaveMission();
}

function openMission(m) {
  cur = m;
  seq = [];
  flowSeq = [];
  tries = 0;
  run = null;
  setProgramMode('guided');
  show('play');

  if ($('mt')) $('mt').textContent = m.t;
  if ($('md')) $('md').textContent = m.d;
  if ($('mgoal')) $('mgoal').textContent = m.goalText || ('Objetivo: pegue ' + m.item + ' e chegue ao destino.');
  updateWorldStepProgress(m);
  const allowed = new Set(m.allowedBlocks || B.map(block => block.id));
  $('pal')?.querySelectorAll('[data-block-id]').forEach(block => { block.style.display = allowed.has(block.dataset.blockId) ? '' : 'none'; });
  flowPalette?.querySelectorAll('[data-flow-id]').forEach(block => {
    const keep = block.dataset.flowId === 'start' || block.dataset.flowId === 'end' || allowed.has(block.dataset.flowId);
    block.style.display = keep ? '' : 'none';
  });
  if ($('hx')) $('hx').hidden = true;

  // Auto-iniciar em Modo Digital sem telas de bloqueio
  if ($('phys')) $('phys').hidden = true;
  if ($('dig')) $('dig').hidden = false;
  if ($('toggleCamBtn')) {
    $('toggleCamBtn').setAttribute('aria-expanded', 'false');
    $('toggleCamBtn').innerHTML = svg('camera', 18) + ' Ler cartões';
  }

  if (typeof say === 'function') say('');
  clearFb();
  drawTray();
  refreshFlow();

  if (cur) {
    const n = {};
    cur.sol.forEach((id) => (n[id] = (n[id] || 0) + 1));
    if ($('kit')) {
      $('kit').innerHTML = '';
      B.filter((b) => n[b.id]).forEach((b) => {
        const e = cardEl(b);
        e.insertAdjacentText('beforeend', ' ×' + n[b.id]);
        $('kit').append(e);
      });
    }
  }

  requestAnimationFrame(() => {
    layout();
    resetV();
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(tick);
  });
}

function leaveMission() {
  if (typeof camOff === 'function') camOff();
  run = null;
  cancelAnimationFrame(raf);
  show('catalog');
}

if ($('back')) $('back').onclick = leaveMission;
