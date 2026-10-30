/* Ícones SVG (traço, viewBox 24). svg() gera HTML; iconImg() gera imagem para o canvas. */
const ICON = {
    start: '<path d="M7 5l12 7-12 7z"/>',
    fwd: '<path d="M12 20V5M6 11l6-6 6 6"/>',
    left: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    right: '<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>',
    jump: '<path d="M4 18c2-9 14-9 16 0"/><path d="M20 18l-4.2-.8M20 18l.9-4.2"/>',
    act: '<path d="M18 11V6a2 2 0 0 0-4 0M14 10V4a2 2 0 0 0-4 0v2M10 10.5V6a2 2 0 0 0-4 0v8M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>',
    end: '<rect x="6" y="6" width="12" height="12" rx="2"/>',
    repeat2: '<path d="M4 8V4h4M4 4l4 4a8 8 0 1 1-1.2 10.8M9 12h6M12 9v6"/>',
    repeat3: '<path d="M4 8V4h4M4 4l4 4a8 8 0 1 1-1.2 10.8M9 10h5a2 2 0 0 1 0 4H9m3-4V8"/>',
    ifClear: '<path d="M4 5h16M4 12h7M4 19h16M14 9l3 3-3 3"/>',
    ifWater: '<path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11zM8 15q2-2 4 0t4 0"/>',
    paint: '<path d="M12 3H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h5M12 3h7a2 2 0 0 1 2 2v6M12 3v7h8M14 17l5-5 3 3-5 5-4 1z"/>',
    toggle: '<rect x="3" y="6" width="18" height="12" rx="6"/><circle cx="15" cy="12" r="3"/>',
    encode: '<path d="M4 5h4v4H4zM10 5h4v4h-4zM16 5h4v4h-4zM4 15h4v4H4zM10 15h4v4h-4zM16 15h4v4h-4z"/>',
    connect: '<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="12" cy="18" r="2.5"/><path d="M8 7l8 0M7.5 8L11 16M16.5 8L13 16"/>',
    protect: '<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z"/><path d="M8 12l3 3 5-6"/>',
    build: '<path d="M14 7l3-3 4 4-3 3M14 7l-9 9a2 2 0 0 0 3 3l9-9M4 21h16"/>',
    sprout: '<path d="M7 20h10M10 20c5.5-2.5.8-6.4 3-10M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8zM14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/>',
    wave: '<path d="M2 9q2.5-3 5 0t5 0t5 0t5 0"/><path d="M2 16q2.5-3 5 0t5 0t5 0t5 0"/>',
    rabbit: '<path d="M9 3c-1.5 0-2 2-2 5 0 1 .5 2 1.5 2.5M15 3c1.5 0 2 2 2 5 0 1-.5 2-1.5 2.5"/><circle cx="12" cy="15" r="6"/><path d="M10 14v.01M14 14v.01M11 17.5h2"/>',
    star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.5 2.9 1-6.1L3.1 9.5l6.1-.9z"/>',
    carrot: '<path d="M3 21c0-6 5-12 11-12l1 1c0 6-6 11-12 11z"/><path d="M15 9c1-4 3-6 6-6-1 3-2 5-6 6zM15 9c-4-1-6-3-6-6 3 1 5 2 6 6"/>',
    tree: '<path d="M12 22v-6M12 16c-4 0-6-2.5-6-5.5 0-2 1.5-3.5 3-4 .5-2 1.8-3 3-3s2.5 1 3 3c1.5.5 3 2 3 4 0 3-2 5.5-6 5.5z"/>',
    flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
    camera: '<path d="M3 8h4l2-3h6l2 3h4v11H3z"/><circle cx="12" cy="13" r="3.5"/>',
    cards: '<rect x="4" y="6" width="10" height="14" rx="2"/><path d="M8 3h10a2 2 0 0 1 2 2v12"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    list: '<path d="M9 6h12M9 12h12M9 18h12"/><rect x="3" y="4" width="2" height="4"/><rect x="3" y="10" width="2" height="4"/><rect x="3" y="16" width="2" height="4"/>',
    eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 21V5"/>',
    access: '<circle cx="12" cy="4.5" r="1.8"/><path d="M5 8.5l7 1.5 7-1.5M12 10v5l-3 5.5M12 15l3 5.5"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l5 5"/>',
    back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    logo: '<path d="M4 6l6 6-6 6M12 6l6 6-6 6"/>'
};
const svg = (n, s = 20) => `<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICON[n]}</svg>`;
const IMG = {};
let onIconLoad = () => {};

function iconImg(n, color, fill = 'none') {
    const k = n + color + fill;
    if (IMG[k]) return IMG[k];
    const i = new Image();
    i.onload = () => onIconLoad();
    i.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" fill="${fill}" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICON[n]}</svg>`);
    return IMG[k] = i
}
/* Preenche elementos marcados com data-i="nome" */
function fillIcons(root = document, s = 24) {
    root.querySelectorAll('[data-i]').forEach(e => {
        if (!e.firstChild) e.innerHTML = svg(e.dataset.i, s)
    })
}
