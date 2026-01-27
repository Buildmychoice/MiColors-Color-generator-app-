import { hexToRgb, rgbToHsl, hslToRgb, rgbToHex, isValidHex, rgbToHsb, rgbToCmyk } from './utils/color-conversion.js';
import { generateHarmony } from './utils/color-harmony.js';
import { generateScale } from './utils/color-scales.js';
import { getContrastRatio, checkWcag, getAccessibleTextColor } from './utils/contrast.js';
import { getColorName } from './utils/color-names.js';
import { initVisualizer, updateVisualizations } from './visualizer.js';

// State
const state = {
    baseColor: { h: 217, s: 91, l: 60 }, // #3b82f6
    harmonyType: 'random', // Default to random
    activeRandomHarmony: 'analogous', // The currently active rule for 'random' mode
    colorFormat: 'hex',
    lockedIndices: new Set(),
    lockedColors: {}, // Map index -> hsl object
    darkMode: false
};

// DOM Elements
const elements = {
    colorPicker: document.getElementById('color-picker'),
    colorInput: document.getElementById('color-input'),
    harmonySelect: document.getElementById('harmony-select'),
    formatSelect: document.getElementById('format-select'),
    randomizeBtn: document.getElementById('randomize-btn'),
    paletteContainer: document.getElementById('palette-container'), // Main container
    toast: document.getElementById('toast')
};

// Initialization
function init() {
    // Event Listeners
    elements.colorPicker.addEventListener('input', handleColorPickerInput);
    elements.colorInput.addEventListener('change', handleTextInput);
    elements.harmonySelect.addEventListener('change', handleHarmonyChange);
    elements.formatSelect.addEventListener('change', handleFormatChange);
    elements.randomizeBtn.addEventListener('click', randomize);

    // Initial Random Selection
    pickRandomHarmony();

    // Initialize sidebar
    initVisualizer();

    // Initial Render
    updateUI();
}

// Handlers
function handleColorPickerInput(e) {
    setColor(e.target.value);
}

function handleTextInput(e) {
    const val = e.target.value;
    if (isValidHex(val)) {
        setColor(val);
    } else {
        const rgb = hslToRgb(state.baseColor.h, state.baseColor.s, state.baseColor.l);
        elements.colorInput.value = rgbToHex(rgb.r, rgb.g, rgb.b);
    }
}

function handleHarmonyChange(e) {
    state.harmonyType = e.target.value;
    // If switching TO random, allow it to just stick with whatever the last random was, 
    // or we could pick a new one immediately. Let's pick new.
    if (state.harmonyType === 'random') {
        pickRandomHarmony();
    }
    updateUI();
}

function handleFormatChange(e) {
    state.colorFormat = e.target.value;
    updateUI();
}

function pickRandomHarmony() {
    const types = ['monochromatic', 'analogous', 'complementary', 'split-complementary', 'triadic'];
    state.activeRandomHarmony = types[Math.floor(Math.random() * types.length)];
}

function randomize() {
    // Button Animation
    const btnIcon = elements.randomizeBtn.querySelector('.icon');
    if (btnIcon) {
        btnIcon.classList.remove('spinning');
        void btnIcon.offsetWidth;
        btnIcon.classList.add('spinning');
        setTimeout(() => btnIcon.classList.remove('spinning'), 600);
    }

    // Logic: If 'random' mode, pick a NEW rule each time we generate
    if (state.harmonyType === 'random') {
        pickRandomHarmony();
    }

    // If index 0 is NOT locked, we generate a new base.
    if (!state.lockedIndices.has(0)) {
        const h = Math.floor(Math.random() * 360);
        const s = Math.floor(Math.random() * 40) + 60; // Vibrant
        const l = Math.floor(Math.random() * 40) + 40; // Visible
        state.baseColor = { h, s, l };
    }

    // Locks preserved!
    updateUI();
}

function setColor(hex) {
    const rgb = hexToRgb(hex);
    if (rgb) {
        state.baseColor = rgbToHsl(rgb.r, rgb.g, rgb.b);
        updateUI();
    }
}

// Logic & Rendering
function updateUI() {
    // 1. Update Inputs (Hidden sync)
    const baseRgb = hslToRgb(state.baseColor.h, state.baseColor.s, state.baseColor.l);
    const baseHex = rgbToHex(baseRgb.r, baseRgb.g, baseRgb.b);
    elements.colorPicker.value = baseHex;
    // We keep the input showing HEX for simplicity of editing, or could match format
    // But standard color inputs usually work best with Hex.
    elements.colorInput.value = baseHex;

    // 2. Generate Harmony
    // Use the active random harmony if mode is random
    const effectiveType = state.harmonyType === 'random' ? state.activeRandomHarmony : state.harmonyType;
    const harmonyColors = generateHarmony(state.baseColor, effectiveType);

    // 3. Merge with Locked Colors
    const finalColors = harmonyColors.map((color, index) => {
        if (state.lockedIndices.has(index)) {
            return state.lockedColors[index];
        }
        return color;
    });

    // 4. Render Columns
    // Pass effectiveType so we can verify visually what it is (optional)
    renderColumns(finalColors, effectiveType);

    // 5. Update Visualization Panel
    updateVisualizations(finalColors);
}

function formatColor(hsl) {
    const rgb = hslToRgb(hsl.h, hsl.s, hsl.l);

    switch (state.colorFormat) {
        case 'rgb':
            return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        case 'hsl':
            return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
        case 'hsb':
            const hsb = rgbToHsb(rgb.r, rgb.g, rgb.b);
            return `hsb(${hsb.h}, ${hsb.s}%, ${hsb.b}%)`;
        case 'cmyk':
            const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
            return `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;
        case 'hex':
        default:
            return rgbToHex(rgb.r, rgb.g, rgb.b);
    }
}

function renderColumns(colors, currentHarmonyType) {
    elements.paletteContainer.innerHTML = '';

    colors.forEach((color, index) => {
        const rgb = hslToRgb(color.h, color.s, color.l);
        const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
        const textColor = getAccessibleTextColor(rgb);
        const isLocked = state.lockedIndices.has(index);
        const colorName = getColorName(hex);

        // Formatted string for display
        const displayValue = formatColor(color);

        const col = document.createElement('div');
        col.className = 'palette-column';
        col.style.backgroundColor = hex;
        col.style.color = textColor;

        // Show harmony type if random, or generic type logic?
        // Let's show the color name as primary, but maybe show harmony type on hover?
        // User asked for color name replacing harmony type. 
        // We will stick to Color Name.

        col.innerHTML = `
            <div class="column-info">
                <div class="column-text">
                    <span class="column-hex">${displayValue}</span>
                    <span class="column-name">${colorName}</span>
                </div>
                <button class="lock-btn ${isLocked ? 'locked' : ''}" title="Lock Color">
                    ${isLocked || '' ?
                '<svg class="icon" viewBox="0 0 24 24" width="24" height="24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-9-2c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/></svg>'
                :
                '<svg class="icon" viewBox="0 0 24 24" width="24" height="24"><path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h1.9c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10z"/></svg>'
            }
                </button>
            </div>
            
            <div class="column-actions">
                <button class="action-btn view-shades-btn">
                    <span>View Shades</span>
                </button>
                <button class="action-btn copy-btn">
                     <span>Copy ${state.colorFormat.toUpperCase()}</span>
                </button>
            </div>
        `;

        // Interaction: Lock
        const lockBtn = col.querySelector('.lock-btn');
        lockBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleLock(index, color);
        });

        // Interaction: Copy uses properly formatted value
        const copyBtn = col.querySelector('.copy-btn');
        copyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            copyToClipboard(displayValue);
        });

        // Interaction: View Shades
        const shadesBtn = col.querySelector('.view-shades-btn');
        shadesBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showShadesForColumn(col, color, textColor);
        });

        // --- Mobile-Only Interaction: Toggle buttons on click ---
        col.addEventListener('click', (e) => {
            // Only fire if we are on mobile (CSS media query threshold)
            if (window.innerWidth <= 768) {
                // If the click happened on a button/input, don't toggle (already handled)
                if (e.target.closest('button') || e.target.closest('input')) return;

                // Toggle this card
                const isActive = col.classList.contains('mobile-active');

                // Close other cards first for clarity
                document.querySelectorAll('.palette-column').forEach(p => {
                    p.classList.remove('mobile-active');
                });

                if (!isActive) {
                    col.classList.add('mobile-active');
                }
            }
        });

        elements.paletteContainer.appendChild(col);
    });
}

function showShadesForColumn(columnEl, colorHsl, textColor) {
    // Generate scale
    const scale = generateScale(colorHsl);

    // Create stack container
    const stack = document.createElement('div');
    stack.className = 'shades-stack';

    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-shades';
    closeBtn.innerHTML = '×';
    closeBtn.onclick = (e) => {
        e.stopPropagation();
        stack.remove();
        columnEl.classList.remove('show-shades');
    };
    stack.appendChild(closeBtn);

    // Render items
    scale.forEach(step => {
        const rgb = hslToRgb(step.h, step.s, step.l);
        const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
        // Calculate contrast for this specific shade
        const shadeTextColor = getAccessibleTextColor(rgb);

        // For shades, we might stick to HEX for display simplicity or match format
        // Let's stick to HEX on hover for now to avoid massive text strings, or use format
        // The user asked for format selection. Let's try to honor it for the Label.
        const displayValue = formatColor({ h: step.h, s: step.s, l: step.l });

        const item = document.createElement('div');
        item.className = 'shade-item';
        item.style.backgroundColor = hex;
        item.style.color = shadeTextColor;

        // Add dot if this is the base index (500)
        if (step.key === 500) {
            const dot = document.createElement('span');
            dot.className = 'shade-base-dot';
            item.appendChild(dot);
        }

        // Hex visible on hover
        const label = document.createElement('span');
        label.className = 'shade-label';
        label.textContent = displayValue;
        item.appendChild(label);

        item.addEventListener('click', () => copyToClipboard(displayValue));
        stack.appendChild(item);
    });

    columnEl.appendChild(stack);
    columnEl.classList.add('show-shades');
}

function toggleLock(index, color) {
    if (state.lockedIndices.has(index)) {
        state.lockedIndices.delete(index);
        delete state.lockedColors[index];
    } else {
        state.lockedIndices.add(index);
        state.lockedColors[index] = color;
    }
    updateUI();
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast(`Copied ${text}`);
    });
}

function showToast(msg) {
    elements.toast.textContent = msg;
    elements.toast.classList.remove('hidden');
    elements.toast.classList.remove('toast-hidden');

    setTimeout(() => {
        elements.toast.classList.add('toast-hidden');
    }, 2000);
}

// Run
init();
