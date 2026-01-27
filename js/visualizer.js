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
    });

    // Also set a background variant
    vizPanel.style.setProperty('--viz-bg', `hsl(${colors[0].h}, 20%, 95%)`);
}
