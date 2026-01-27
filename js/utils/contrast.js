import { hexToRgb } from './color-conversion.js';

/**
 * Calculates the relative luminance of a color.
 * @param {object} rgb - {r, g, b}
 * @returns {number} - Relative luminance (0-1).
 */
function getLuminance({ r, g, b }) {
    const a = [r, g, b].map((v) => {
        v /= 255;
        return v <= 0.03928
            ? v / 12.92
            : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

/**
 * Calculates the contrast ratio between two colors.
 * @param {object} rgb1 - {r, g, b}
 * @param {object} rgb2 - {r, g, b}
 * @returns {number} - Contrast ratio (1-21).
 */
export function getContrastRatio(rgb1, rgb2) {
    const lum1 = getLuminance(rgb1);
    const lum2 = getLuminance(rgb2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Returns 'black' or 'white' depending on which has better contrast against the background.
 * @param {object} bgRgb - Background color {r, g, b}.
 * @returns {string} - 'black' or 'white'.
 */
export function getAccessibleTextColor(bgRgb) {
    const white = { r: 255, g: 255, b: 255 };
    const black = { r: 0, g: 0, b: 0 };

    const whiteContrast = getContrastRatio(bgRgb, white);
    const blackContrast = getContrastRatio(bgRgb, black);

    return whiteContrast > blackContrast ? '#ffffff' : '#000000';
}

/**
 * Checks if a contrast ratio meets WCAG standards.
 * @param {number} ratio 
 * @returns {object} - { aa: boolean, aaa: boolean, aaLarge: boolean, aaaLarge: boolean }
 */
export function checkWcag(ratio) {
    return {
        aa: ratio >= 4.5,
        aaa: ratio >= 7,
        aaLarge: ratio >= 3,
        aaaLarge: ratio >= 4.5
    };
}
