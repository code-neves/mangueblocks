/* Sons simples (Web Audio). Só tocam se o ajuste "Sons" estiver ligado. */
let AC = null;
const NT = {
    start: 262,
    fwd: 294,
    left: 330,
    right: 392,
    jump: 440,
    act: 523,
    end: 587
};

function tone(f, d = .18, ty = 'sine', t0 = 0, v = .12) {
    if (!ST.snd) return;
    try {
        AC = AC || new(window.AudioContext || window.webkitAudioContext)();
        const o = AC.createOscillator(),
        g = AC.createGain(),
        t = AC.currentTime + t0;
        o.type = ty;
        o.frequency.value = f;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(v, t + .02);
        g.gain.exponentialRampToValueAtTime(.001, t + d);
        o.connect(g).connect(AC.destination);
        o.start(t);
        o.stop(t + d + .02)
    } catch (e) {}
}
const note = id => tone(NT[id] || 330),
pip = () => tone(880, .08, 'triangle'),
jingle = w => w ? [523, 659, 784, 1047].forEach((f, i) => tone(f, .25, 'triangle', i * .11)) : tone(196, .3, 'triangle');
