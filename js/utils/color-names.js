// Basic list of color names for mapping
const colorNames = {
    "#000000": "Black",
    "#000080": "Navy Blue",
    "#00008B": "Dark Blue",
    "#0000CD": "Medium Blue",
    "#0000FF": "Blue",
    "#006400": "Dark Green",
    "#008000": "Green",
    "#008080": "Teal",
    "#00BFFF": "Deep Sky Blue",
    "#00CED1": "Dark Turquoise",
    "#00FA9A": "Medium Spring Green",
    "#00FF00": "Lime",
    "#00FF7F": "Spring Green",
    "#00FFFF": "Aqua",
    "#191970": "Midnight Blue",
    "#1E90FF": "Dodger Blue",
    "#20B2AA": "Light Sea Green",
    "#228B22": "Forest Green",
    "#2E8B57": "Sea Green",
    "#2F4F4F": "Dark Slate Gray",
    "#32CD32": "Lime Green",
    "#3CB371": "Medium Sea Green",
    "#40E0D0": "Turquoise",
    "#4169E1": "Royal Blue",
    "#4682B4": "Steel Blue",
    "#483D8B": "Dark Slate Blue",
    "#4B0082": "Indigo",
    "#556B2F": "Dark Olive Green",
    "#5F9EA0": "Cadet Blue",
    "#6495ED": "Cornflower Blue",
    "#66CDAA": "Medium Aquamarine",
    "#696969": "Dim Gray",
    "#6A5ACD": "Slate Blue",
    "#708090": "Slate Gray",
    "#778899": "Light Slate Gray",
    "#7B68EE": "Medium Slate Blue",
    "#7CFC00": "Lawn Green",
    "#7FFF00": "Chartreuse",
    "#7FFFD4": "Aquamarine",
    "#800000": "Maroon",
    "#800080": "Purple",
    "#808000": "Olive",
    "#808080": "Gray",
    "#87CEEB": "Sky Blue",
    "#87CEFA": "Light Sky Blue",
    "#8A2BE2": "Blue Violet",
    "#8B0000": "Dark Red",
    "#8B008B": "Dark Magenta",
    "#8B4513": "Saddle Brown",
    "#8FBC8F": "Dark Sea Green",
    "#90EE90": "Light Green",
    "#9370DB": "Medium Purple",
    "#9400D3": "Dark Violet",
    "#98FB98": "Pale Green",
    "#9932CC": "Dark Orchid",
    "#9ACD32": "Yellow Green",
    "#A0522D": "Sienna",
    "#A52A2A": "Brown",
    "#A9A9A9": "Dark Gray",
    "#ADD8E6": "Light Blue",
    "#ADFF2F": "Green Yellow",
    "#B0C4DE": "Light Steel Blue",
    "#B0E0E6": "Powder Blue",
    "#B22222": "Firebrick",
    "#B8860B": "Dark Goldenrod",
    "#BA55D3": "Medium Orchid",
    "#BC8F8F": "Rosy Brown",
    "#BDB76B": "Dark Khaki",
    "#C0C0C0": "Silver",
    "#C71585": "Medium Violet Red",
    "#CD5C5C": "Indian Red",
    "#CD853F": "Peru",
    "#D2691E": "Chocolate",
    "#D2B48C": "Tan",
    "#D3D3D3": "Light Gray",
    "#D8BFD8": "Thistle",
    "#DA70D6": "Orchid",
    "#DAA520": "Goldenrod",
    "#DB7093": "Pale Violet Red",
    "#DC143C": "Crimson",
    "#DCDCDC": "Gainsboro",
    "#DDA0DD": "Plum",
    "#DEB887": "Burlywood",
    "#E0FFFF": "Light Cyan",
    "#E6E6FA": "Lavender",
    "#E9967A": "Dark Salmon",
    "#EE82EE": "Violet",
    "#EEE8AA": "Pale Goldenrod",
    "#F08080": "Light Coral",
    "#F0E68C": "Khaki",
    "#F0F8FF": "Alice Blue",
    "#F0FFF0": "Honeydew",
    "#F0FFFF": "Azure",
    "#F4A460": "Sandy Brown",
    "#F5DEB3": "Wheat",
    "#F5F5DC": "Beige",
    "#F5F5F5": "White Smoke",
    "#F5FFFA": "Mint Cream",
    "#F8F8FF": "Ghost White",
    "#FA8072": "Salmon",
    "#FAEBD7": "Antique White",
    "#FAF0E6": "Linen",
    "#FAFAD2": "Light Goldenrod Yellow",
    "#FDF5E6": "Old Lace",
    "#FF0000": "Red",
    "#FF00FF": "Magenta",
    "#FF1493": "Deep Pink",
    "#FF4500": "Orange Red",
    "#FF6347": "Tomato",
    "#FF69B4": "Hot Pink",
    "#FF7F50": "Coral",
    "#FF8C00": "Dark Orange",
    "#FFA07A": "Light Salmon",
    "#FFA500": "Orange",
    "#FFB6C1": "Light Pink",
    "#FFC0CB": "Pink",
    "#FFD700": "Gold",
    "#FFDAB9": "Peach Puff",
    "#FFDEAD": "Navajo White",
    "#FFE4B5": "Moccasin",
    "#FFE4C4": "Bisque",
    "#FFE4E1": "Misty Rose",
    "#FFEBCD": "Blanched Almond",
    "#FFEFD5": "Papaya Whip",
    "#FFF0F5": "Lavender Blush",
    "#FFF5EE": "Sea Shell",
    "#FFF8DC": "Cornsilk",
    "#FFFACD": "Lemon Chiffon",
    "#FFFAF0": "Floral White",
    "#FFFAFA": "Snow",
    "#FFFF00": "Yellow",
    "#FFFFE0": "Light Yellow",
    "#FFFFF0": "Ivory",
    "#FFFFFF": "White"
};

/**
 * Converts a hex string to RGB object.
 * (Duplicating simple logic here to avoid circular dependency hell or extra imports for a utility)
 */
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

/**
 * Calculates Euclidean distance between two RGB colors
 */
function colorDistance(c1, c2) {
    return Math.sqrt(
        Math.pow(c1.r - c2.r, 2) +
        Math.pow(c1.g - c2.g, 2) +
        Math.pow(c1.b - c2.b, 2)
    );
}

/**
 * Finds the nearest named color for a given hex value
 */
export function getColorName(hexInput) {
    const inputRgb = hexToRgb(hexInput);
    if (!inputRgb) return "Unknown";

    let closestColor = "Unknown";
    let minDistance = Infinity;

    for (const [hex, name] of Object.entries(colorNames)) {
        const currentRgb = hexToRgb(hex);
        const distance = colorDistance(inputRgb, currentRgb);

        if (distance < minDistance) {
            minDistance = distance;
            closestColor = name;
        }

        // Exact match optimization
        if (distance === 0) return name;
    }

    return closestColor;
}
