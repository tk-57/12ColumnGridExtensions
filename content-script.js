const ID = '__grid_overlay__';

function hexToRgb(hex) {
    const [, r, g, b] = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
        hex.padStart(7, '#')
    ) || [];
    return r ? `${parseInt(r, 16)}, ${parseInt(g, 16)}, ${parseInt(b, 16)}` : '0,0,0';
}

function createOverlay() {
    const grid = document.createElement('div');
    grid.id = ID;
    grid.style.cssText = `
    position: fixed; top: 0; left: 50%;
    transform: translateX(-50%);
    width: 100%; height: 100vh;
    pointer-events: none; z-index: 2147483647;
  `;
    document.documentElement.appendChild(grid);
    return grid;
}

function applyStyles(grid, s) {
    if (!s.enabled) { grid.style.display = 'none'; return; }
    grid.style.display = 'block';

    const rgb = hexToRgb(s.color);
    grid.style.setProperty('--col', `${s.columnWidth}px`);
    grid.style.setProperty('--gut', `${s.gutterWidth}px`);
    grid.style.setProperty(
        'background-image',
        `repeating-linear-gradient(
       to right,
       rgba(${rgb}, ${s.alpha}) 0,
       rgba(${rgb}, ${s.alpha}) var(--col),
       transparent var(--col),
       transparent calc(var(--col) + var(--gut))
     )`
    );
    const total = s.columns * s.columnWidth + (s.columns - 1) * s.gutterWidth;
    grid.style.maxWidth = `${total}px`;
}

function sync(settings) {
    const grid = document.getElementById(ID) || createOverlay();
    applyStyles(grid, settings);
}

chrome.storage.sync.get(null, sync);
chrome.runtime.onMessage.addListener((m) => m.type === 'APPLY_SETTINGS' && sync(m.payload));
