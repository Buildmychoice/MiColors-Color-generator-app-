/**
 * Visualization Logic
 * Updates CSS variables in the visualizer panel to reflect current palette
 */

export function initVisualizer() {
    const vizBtn = document.getElementById('viz-btn');
    const vizBtnMobile = document.getElementById('viz-btn-mobile');
    const vizPanel = document.getElementById('viz-panel');
    const vizOverlay = document.getElementById('viz-overlay');
    const vizClose = document.getElementById('viz-close');

    if (!vizPanel) return;

    function openViz() {
        vizPanel.classList.add('active');
        document.body.classList.add('viz-open');
        if (vizOverlay) vizOverlay.classList.add('active');
    }

    function closeViz() {
        vizPanel.classList.remove('active');
        document.body.classList.remove('viz-open');
        if (vizOverlay) vizOverlay.classList.remove('active');
    }

    function toggleViz() {
        if (vizPanel.classList.contains('active')) {
            closeViz();
        } else {
            openViz();
        }
    }

    if (vizBtn) vizBtn.addEventListener('click', toggleViz);
    if (vizBtnMobile) vizBtnMobile.addEventListener('click', toggleViz);
    if (vizClose) vizClose.addEventListener('click', closeViz);
    if (vizOverlay) vizOverlay.addEventListener('click', closeViz);
}

export function updateVisualizations(colors) {
    const vizPanel = document.getElementById('viz-panel');
    if (!vizPanel) return;

    // We assume colors is an array of HSL objects
    // We convert them to CSS usable strings (hex or hsl)
    // We map them to generic visualization variables: --viz-c1 to --viz-c5

    // Helper to get hex from hsl object (duplication from utils, but passing formatted string ok)
    // Better: reuse the hex string if available, or just use HSL css string

    colors.forEach((color, index) => {
        // color is {h, s, l}
        const colorString = `hsl(${color.h}, ${color.s}%, ${color.l}%)`;
        vizPanel.style.setProperty(`--viz-c${index + 1}`, colorString);

        // Also set RGB components for background opacities
        const rgb = hslToRgb(color.h / 360, color.s / 100, color.l / 100);
        vizPanel.style.setProperty(`--viz-c${index + 1}-rgb`, `${rgb[0]}, ${rgb[1]}, ${rgb[2]}`);
    });

    // Also set a background variant
    vizPanel.style.setProperty('--viz-bg', `hsl(${colors[0].h}, 20%, 95%)`);
}

/**
 * Helper: HSL to RGB conversion
 */
function hslToRgb(h, s, l) {
    let r, g, b;
    if (s === 0) {
        r = g = b = l;
    } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function hue2rgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
}
