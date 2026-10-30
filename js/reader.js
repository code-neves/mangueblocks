/* Leitura dos cartões: câmera ou foto -> cores -> sequência. */
let wm = null;
(async () => {
    try {
        const bin = Uint8Array.from(atob(WASM_B64), c => c.charCodeAt(0));
        const {
            instance
        } = await WebAssembly.instantiate(bin);
        wm = instance.exports;
        if (B.length > 7) wm = null;
        else new Int32Array(wm.m.buffer, 0, 7).set(B.map(b => b.h))
    } catch (e) {
        wm = null
    }
})();
const A = document.createElement('canvas'),
ax = A.getContext('2d', {
    willReadFrequently: true
}),
view = $('view'),
vx = view.getContext('2d');

function labels(w, h) {
    const n = w * h,
    px = ax.getImageData(0, 0, w, h).data;
    if (wm) {
        new Uint8ClampedArray(wm.m.buffer, 1024, n * 4).set(px);
        wm.classify(n, 22);
        return new Uint8Array(wm.m.buffer, 1024 + n * 4, n)
    }
    const L = new Uint8Array(n);
    for (let i = 0; i < n; i++) {
        const r = px[4 * i],
        g = px[4 * i + 1],
        b = px[4 * i + 2],
        mx = Math.max(r, g, b),
        d = mx - Math.min(r, g, b);
        if (mx < 46 || d * 10 < mx * 3) continue;
        let q = mx == r ? 60 * (g - b) / d : mx == g ? 120 + 60 * (b - r) / d : 240 + 60 * (r - g) / d;
        q = (q + 360) % 360;
        let bd = 999;
        B.forEach((k, j) => {
            let x = Math.abs(q - k.h);
            x = Math.min(x, 360 - x);
            if (x < bd) {
                bd = x;
                if (x <= 22) L[i] = j + 1
            }
        })
    }
    return L
}

function blobs(L, w, h) {
    const N = w * h,
    seen = new Uint8Array(N),
    st = new Int32Array(N),
    out = [],
    min = N * .004;
    for (let s = 0; s < N; s++) {
        const k = L[s];
        if (!k || seen[s]) continue;
        let sp = 0,
        a = 0,
        x0 = w,
        y0 = h,
        x1 = 0,
        y1 = 0;
        st[sp++] = s;
        seen[s] = 1;
        while (sp) {
            const p = st[--sp],
            x = p % w,
            y = (p / w) | 0;
            a++;
            x < x0 && (x0 = x);
            x > x1 && (x1 = x);
            y < y0 && (y0 = y);
            y > y1 && (y1 = y);
            for (const q of [x > 0 ? p - 1 : -1, x < w - 1 ? p + 1 : -1, p - w, p + w]) {
                if (q < 0 || q >= N || seen[q] || L[q] !== k) continue;
                seen[q] = 1;
                st[sp++] = q
            }
        }
        const bw = x1 - x0 + 1,
        bh = y1 - y0 + 1;
        if (a >= min && a / (bw * bh) > .45) out.push({
            k,
            x: x0,
            y: y0,
            w: bw,
            h: bh,
            cx: x0 + bw / 2,
            cy: y0 + bh / 2
        })
    }
    return out
}

function order(bl) {
    if (!bl.length) return bl;
    const mh = bl.map(b => b.h).sort((a, b) => a - b)[bl.length >> 1],
    rows = [];
    bl.sort((a, b) => a.cy - b.cy);
    for (const b of bl) {
        const r = rows[rows.length - 1];
        if (r && b.cy - r.y < mh * .6) r.b.push(b);
        else rows.push({
            y: b.cy,
            b: [b]
        })
    }
    return rows.flatMap(r => r.b.sort((a, b) => a.cx - b.cx))
}

function scan(src, sw, sh) {
    const s = Math.min(1, 480 / sw),
    w = Math.round(sw * s),
    h = Math.round(sh * s);
    A.width = view.width = w;
    A.height = view.height = h;
    ax.drawImage(src, 0, 0, w, h);
    vx.drawImage(A, 0, 0);
    const bl = order(blobs(labels(w, h), w, h));
    bl.forEach((b, i) => {
        const k = B[b.k - 1];
        vx.lineWidth = 4;
        vx.strokeStyle = k.c;
        vx.strokeRect(b.x, b.y, b.w, b.h);
        vx.fillStyle = k.c;
        vx.fillRect(b.x, b.y, 26, 22);
        vx.fillStyle = k.k;
        vx.font = '900 15px sans-serif';
        vx.textAlign = 'center';
        vx.fillText(i + 1, b.x + 13, b.y + 17)
    });
    return bl.map(b => B[b.k - 1].id)
}
let stream = null,
live = [];
const say = t => $('sm').textContent = t;
async function camOn() {
    try {
        $('use').hidden = false;
        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'environment'
            }
        });
        const v = $('vid');
        v.srcObject = stream;
        await v.play();
        $('scan').hidden = false;
        say('Enquadre os cartões em ordem, da esquerda para a direita.');
        loop()
    } catch (e) {
        stream = null;
        say('Não consegui abrir a câmera. Envie uma foto ou monte tocando nos blocos.')
    }
}

function loop() {
    if (!stream) return;
    const v = $('vid');
    if (v.videoWidth) {
        live = scan(v, v.videoWidth, v.videoHeight);
        $('use').disabled = !live.length
    }
    setTimeout(loop, 220)
}

function camOff() {
    stream && stream.getTracks().forEach(t => t.stop());
    stream = null;
    $('scan').hidden = true
}
$('cam').onclick = camOn;
$('stop').onclick = camOff;
$('use').onclick = () => {
    setSeq(live);
    pip();
    camOff();
    say(live.length + ' cartões lidos. Confira a sequência abaixo.')
};
$('file').onchange = e => {
    const f = e.target.files[0];
    if (!f) return;
    const im = new Image();
    im.onload = () => {
        const r = scan(im, im.naturalWidth, im.naturalHeight);
        $('scan').hidden = false;
        $('use').hidden = true;
        if (r.length) {
            setSeq(r);
            pip();
            say(r.length + ' cartões lidos. Confira a sequência abaixo.')
        } else say('Não encontrei cartões. Tente com mais luz e fundo claro.');
        URL.revokeObjectURL(im.src)
    };
    im.src = URL.createObjectURL(f);
    e.target.value = ''
};
