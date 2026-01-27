/**
 * Generates a color scale (50-900) based on a base HSL color.
 * @param {object} baseHsl - {h, s, l}
 * @returns {Array} - Array of objects { key: number, h, s, l }
 */
export function generateScale(baseHsl) {
    const { h, s, l } = baseHsl;
    const scale = [];

    // We want 500 to be close to the base, but we must populate 50-900.
    // Simple approach: Linear interpolation of Lightness.
    // 50: ~95% L
    // 900: ~10% L
    // We will adjust saturation slightly for better perception (darker = more saturated)

    const levels = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

    levels.forEach(level => {
        let newL;
        let newS = s;

        if (level === 500) {
            newL = l;
        } else if (level < 500) {
            // Lighter
            // Interpolate between L and 100
            // 50 is close to 98
            // 400 is close to L (but lighter)
            const factor = (500 - level) / 500; // 0 to 1
            newL = l + (100 - l) * factor * 0.9; // 0.9 to keep it from being pure white
        } else {
            // Darker
            // Interpolate between L and 0
            const factor = (level - 500) / 400; // 0 to 1
            newL = l - (l * factor * 0.9);

            // Boost saturation slightly for darker shades to prevent wash out
            newS = Math.min(100, s + 5);
        }

        scale.push({
            key: level,
            h,
            s: Math.round(newS),
            l: Math.round(newL)
        });
    });

    return scale;
}
