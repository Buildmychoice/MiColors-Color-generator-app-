/**
 * Generates color harmonies based on a base HSL color.
 * @param {object} baseHsl - {h, s, l}
 * @param {string} type - 'monochromatic', 'analogous', 'complementary', 'split-complementary', 'triadic'
 * @returns {Array} - Array of HSL objects including the base color.
 */
export function generateHarmony(baseHsl, type) {
    const { h, s, l } = baseHsl;
    let colors = [];

    // Helper to normalize hue
    const normalizeHue = (hue) => (hue % 360 + 360) % 360;

    switch (type) {
        case 'monochromatic':
            // Variations in lightness and saturation
            colors.push(
                baseHsl,
                { h, s, l: Math.max(0, Math.min(100, l + 30)) }, // Lighter
                { h, s, l: Math.max(0, Math.min(100, l - 30)) }, // Darker
                { h, s: Math.max(0, Math.min(100, s - 20)), l: Math.min(95, l + 40) }, // Desaturated Light
                { h, s: Math.min(100, s + 20), l: Math.max(10, l - 30) }  // Saturated Dark
            );
            break;

        case 'analogous':
            // +30 deg, -30 deg, +60, -60
            colors.push(
                baseHsl,
                { h: normalizeHue(h + 30), s, l },
                { h: normalizeHue(h - 30), s, l },
                { h: normalizeHue(h + 60), s, l },
                { h: normalizeHue(h - 60), s, l }
            );
            break;

        case 'complementary':
            // Base + 180 (and variations of complementary)
            colors.push(
                baseHsl,
                { h: normalizeHue(h + 180), s, l },
                { h: normalizeHue(h + 180), s, l: Math.min(90, l + 20) }, // Lighter Comp
                { h: normalizeHue(h + 180), s, l: Math.max(10, l - 20) }, // Darker Comp
                { h, s, l: Math.max(10, l - 30) } // Darker Base
            );
            break;

        case 'split-complementary':
            // Base, +150, +210
            colors.push(
                baseHsl,
                { h: normalizeHue(h + 150), s, l },
                { h: normalizeHue(h + 210), s, l },
                { h: normalizeHue(h + 150), s, l: Math.max(10, l - 20) }, // Darker Var 1
                { h: normalizeHue(h + 210), s, l: Math.max(10, l - 20) }  // Darker Var 2
            );
            break;

        case 'triadic':
            // Base, +120, +240
            colors.push(
                baseHsl,
                { h: normalizeHue(h + 120), s, l },
                { h: normalizeHue(h + 240), s, l },
                { h: normalizeHue(h + 120), s, l: Math.max(10, l - 20) }, // Darker Var 1
                { h: normalizeHue(h + 240), s, l: Math.max(10, l - 20) }  // Darker Var 2
            );
            break;

        default:
            colors.push(baseHsl);
    }

    return colors;
}
