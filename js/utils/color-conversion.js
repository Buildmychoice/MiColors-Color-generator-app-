/**
 * Converts a HEX string to an RGB object.
 * @param {string} hex - The hex color string (e.g., "#ffffff" or "fff").
 * @returns {object|null} - {r, g, b} or null if invalid.
 */
export function hexToRgb(hex) {
    if (!hex) return null;
    // Remove hash
    hex = hex.replace(/^#/, '');

    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
    }

    if (hex.length !== 6) return null;

    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return { r, g, b };
}

/**
 * Converts RGB values to HSL.
 * @param {number} r - Red (0-255).
 * @param {number} g - Green (0-255).
 * @param {number} b - Blue (0-255).
 * @returns {object} - {h, s, l} where h is 0-360, s is 0-100, l is 0-100.
 */
export function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

/**
 * Converts HSL values to RGB.
 * @param {number} h - Hue (0-360).
 * @param {number} s - Saturation (0-100).
 * @param {number} l - Lightness (0-100).
 * @returns {object} - {r, g, b} (0-255).
 */
export function hslToRgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;

    let r, g, b;

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

/**
 * Converts RGB values to HEX string.
 * @param {number} r 
 * @param {number} g 
 * @param {number} b 
 * @returns {string} - HEX string (e.g., "#ffffff").
 */
export function rgbToHex(r, g, b) {
    const toHex = (c) => {
        const hex = Math.max(0, Math.min(255, c)).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    return '#' + toHex(r) + toHex(g) + toHex(b);
}

/**
 * Validates if a string is a valid HEX color.
 * @param {string} hex 
 * @returns {boolean}
 */
export function isValidHex(hex) {
    return /^#?([0-9A-Fa-f]{3}){1,2}$/i.test(hex);
}

/**
 * Converts RGB to HSB (HSV).
 * @param {number} r 0-255
 * @param {number} g 0-255
 * @param {number} b 0-255
 * @returns {object} {h:0-360, s:0-100, b:0-100}
 */
export function rgbToHsb(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, v = max;

    const d = max - min;
    s = max === 0 ? 0 : d / max;

    if (max === min) {
        h = 0; // achromatic
    } else {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        b: Math.round(v * 100)
    };
}

/**
 * Converts RGB to CMYK.
 * @param {number} r 0-255
 * @param {number} g 0-255
 * @param {number} b 0-255
 * @returns {object} {c:0-100, m:0-100, y:0-100, k:0-100}
 */
export function rgbToCmyk(r, g, b) {
    let c = 1 - (r / 255);
    let m = 1 - (g / 255);
    let y = 1 - (b / 255);
    let k = Math.min(c, Math.min(m, y));

    c = (c - k) / (1 - k) || 0;
    m = (m - k) / (1 - k) || 0;
    y = (y - k) / (1 - k) || 0;

    return {
        c: Math.round(c * 100),
        m: Math.round(m * 100),
        y: Math.round(y * 100),
        k: Math.round(k * 100)
    };
}

