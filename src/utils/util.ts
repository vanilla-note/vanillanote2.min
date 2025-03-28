import type { Colors } from "../types/csses";
import type { Vanillanote, VanillanoteElement } from "../types/vanillanote";

export const getParentNote = (targetElement: HTMLElement): VanillanoteElement => {
    return targetElement.closest('[data-vanillanote]')!
}

export const getId = (noteName: string, noteId: string, id: string) => {
    return noteName + "_" + noteId + "_" + id;
};

export const getClassName = (noteName: string, noteId: string, className: string) => {
    return noteName + "_" + noteId + "_" + className;
};

export const getEventChildrenClassName = (noteName: string) => {
    return noteName + "_eventChildren";
};

export const getOnOverCssEventElementClassName = (noteName: string) => {
    return noteName + "_eventOnOverCssElement";
};

export const getClickCssEventElementClassName = (noteName: string) => {
    return noteName + "_eventClickCssElement";
};

export const getCssClassText = (noteName: string, noteId: string, className: string, cssObject: Record<string, string>) => {
    return "." + getId(noteName, noteId, className) + " {" + getCssTextFromObject(cssObject) + "}";
};

/**
* getUUID
* @description Get a Universally Unique Identifier
* @returns {String} Universally Unique Identifier.
*/
export const getUUID = () => { // Public Domain/MIT
    var d = new Date().getTime();
    if (typeof performance !== "undefined" && typeof performance.now === "function"){
        d += performance.now();
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
    });
};

/**
* getNoteId
* @description Retrieves the note id by iterating from the current element to its parent until a note id is found (default is 0).
* @param {Element} el - The element from which to start iterating.
* @returns {string|null} noteId - The note id retrieved from the element's attributes or null if not found.
*/
export const getNoteId = (el: any) => {
    if(!el) return null;
    var noteId;
    var target = el instanceof Element ? el : (el as any).parentNode;
    while(!target.hasAttribute("data-note-id")) {
        target = target.parentNode;
        if(!target || !target.hasAttribute) break;
    }
    if(target && target.hasAttribute && target.hasAttribute("data-note-id")) {
        noteId = target.getAttribute("data-note-id");
    }
    return noteId;
};

/**
 * Checks if the current device is a mobile or tablet.
 *
 * - Prefers modern `navigator.userAgentData` if available.
 * - Falls back to `navigator.userAgent` for compatibility.
 * - Detects major mobile platforms (iOS, Android, etc.).
 *
 * @returns {boolean} `true` if the user's device is mobile or tablet, `false` otherwise.
 */
export const isMobileDevice = (): boolean => {
    const nav = navigator as Navigator & {
        userAgentData?: { mobile?: boolean };
    };

    if (nav.userAgentData?.mobile !== undefined) {
        return nav.userAgentData.mobile;
    }

    const ua = navigator.userAgent;
    return /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua);
};

/**
* getIsIOS
* @description Checks if the user's device is IOS.
* @returns {Boolean} If the user's device is IOS, return true.
*/
export const getIsIOS = () => {
    return typeof navigator !== 'undefined' ? /iPhone|iPad|iPod/i.test(navigator.userAgent) : false;
};
    
/**
* checkNumber
* @description Check if it is number.
* @returns {Boolean} number is true.
*/
export const checkNumber = (checkValue: any) => {
    var regExp = /^[0-9]+$/;
    return regExp.test(checkValue);
};

/**
* checkRealNumber
* @description Check if it is real number.
* @returns {Boolean} real number is true.
*/
export const checkRealNumber = (checkValue: any) => {
    if(checkValue !== "-" && isNaN(checkValue)) {
        return false;
    }
    return true;
};

/**
* checkAlphabetAndNumber
* @description Check if it is composed of only alphabet and number.
* @returns {Boolean} composed of only alphabet and number is true.
*/
export const checkAlphabetAndNumber = (checkValue: string) => {
    var regExp = /^[A-Za-z0-9]+$/;
    return regExp.test(checkValue);
};

/**
* checkHex
* @description Checks if it is a hexadecimal number
* @returns {Boolean} hexadecimal number is true.
*/
export const checkHex = (checkValue: string) => {
    var hexRegex = /^[0-9A-Fa-f]*$/;
    return hexRegex.test(checkValue);
};

/**
* extractNumber
* @description Extracts the numerical part from a parameter composed of "real number + character".
* @param {String or Number} composed of "real number + character"
* @returns {Number} real number.
*/
export const extractNumber = (str: string) => {
    var match = str.match(/-?\d+\.?\d*/);
    return match ? Number(parseFloat(match[0])) : null;
};

/**
* extractUnit
* @description Extracts the string part from a parameter composed of "real number + character".
* @param {String or Number} composed of "real number + character"
* @returns {string} unit word.
*/
export const extractUnit = (str: string) => {
    var match = str.replace(/[-+]?[0-9]*\.?[0-9]+/g, "");
    return match ? match : null;
};

/**
* compareObject
* @description Performs a shallow comparison between two objects.
* @param {Object}
* @param {Object}
* @returns {Boolean} if it is same.
*/
export const compareObject = (obj1: any, obj2: any) => {
    var keys1 = Object.keys(obj1);
    var keys2 = Object.keys(obj2);
    
    if(keys1.length !== keys2.length) return false;
    for(var i = 0; i < keys1.length; i++) {
        if(keys2.includes(keys1[i])) {
            if(obj1[keys1[i]] !== obj2[keys1[i]]) return false;
        }
        else {
            return false;
        }
    }
    return true;
};

/**
* mergeObjects
* @description Merges two objects and returns a new object containing the properties of both.
* @param {Object} obj1 - The first object to be merged
* @param {Object} obj2 - The second object to be merged
* @returns {Object} A new object containing the merged properties of both input objects
*/
export const mergeObjects = (obj1: any, obj2: any) => {
    var mergedObj: any = {};
    for (var key in obj1) {
        if (obj1.hasOwnProperty(key)) {
            mergedObj[key] = obj1[key];
        }
    }
    for (var key in obj2) {
        if (obj2.hasOwnProperty(key)) {
            mergedObj[key] = obj2[key];
        }
    }
    return mergedObj;
}

/**
* getCommaStrFromArr
* @description This function receives an array and returns it as a string separated by commas.
* @param {Array} arr - The array to be converted into a string.
* @returns {String} Returns a string separated by commas, based on the input array.
*/
export const getCommaStrFromArr = (arr: any[]) => {
    var str = "";
    for(var i = 0; i < arr.length; i++) {
        if(arr[i]) {
            str = str + arr[i].trim();
            if(i !== arr.length - 1) {
                str = str + ", ";
            }
        }
    }
    return str;
};

/**
* getObjectFromCssText
* @description This function converts a CSS text format into an object format.
* @param {String} cssText - The CSS text to be converted into an object. 
* @returns {Object} Returns an object with key-value pairs based on the input CSS text.
* Example: "font-weight:bold;text-align:center;" > {"font-weight":"bold","text-align":"center"}
*/
export const getObjectFromCssText = (cssText: string) => {
    var cssObject = new Object();
    if(!cssText) return cssObject;
    var csses;
    var css;
    csses = cssText.trim().split(";");
    for(var i = 0; i < csses.length; i++) {
        if(!csses[i]) continue;
        css = csses[i].split(":");
        if(css.length < 2) continue;
        (cssObject as any)[css[0].trim()] = css[1].trim();
    }
    
    return cssObject;
};

/**
* getCssTextFromObject
* @description This function converts an object in CSS format into a text format.
* @param {Object} cssObject - The CSS object to be converted into a text. 
* @returns {String} Returns a string in CSS text format based on the input CSS object.
* Example: {"font-weight":"bold","text-align":"center"} > "font-weight:bold;text-align:center;"
*/
export const getCssTextFromObject = (cssObject: Record<string, string>) => {
    var cssText = "";
    if(!cssObject || cssObject.constructor !== Object || Object.keys(cssObject).length === 0) return cssText;
    
    var csses = Object.entries(cssObject);
    for(var i = 0; i < csses.length; i++) {
        if(csses[i].length < 2) continue;
        cssText += csses[i][0].trim() + ":" + csses[i][1].trim() + ";";
    }
    
    return cssText;
};

/**
* setAttributesObjectToElement
* @description This function takes an object of attributes and inserts them into an element.
* @param {HTMLElement} element - The element into which the attributes will be inserted.
* @param {Object} attributes - The object containing the attributes to be inserted.
* @returns {HTMLElement} Returns the element after the attributes have been inserted.
*/
export const setAttributesObjectToElement = (element: any, attributes: Record<string, string>) => {
    if(!attributes || attributes.constructor !== Object) return element;
    var keys = Object.keys(attributes);
    for(var i = 0; i < keys.length; i++) {
        element.setAttribute(keys[i], attributes[keys[i]]);
    }
    return element;
};

/**
* getExtractColorValue
* @description This function takes a hexadecimal color and a channel (R, G, or B) and returns the corresponding hexadecimal color value.
* @param {String} hexColor - The hexadecimal color to extract from.
* @param {String} channel - The color channel to extract (either "R", "G", or "B").
* @returns {String} Returns a two-character string representing the hexadecimal color value. Returns "33" if hexColor or channel is invalid.
*/
export const getExtractColorValue = (hexColor: string, channel: string) => {
    if(!hexColor || !channel) {
        return "33";
    }
    channel = channel.toUpperCase();
    // Check if the hexColor starts with a "#" and add it if not
    if (hexColor[0] !== "#") {
        hexColor = "#" + hexColor;
    }
    // Check if the hexColor is a valid hex color code
    var hexColorRegex = /^#([0-9A-Fa-f]{6})$/;
    if (!hexColorRegex.test(hexColor)) {
        return "33";
    }
    // Get the start index based on the channel
    var startIndex = channel === "R" ? 1 : channel === "G" ? 3 : 5;
    // Extract the relevant 2-digit hex number
    var colorValue = hexColor.substring(startIndex, startIndex + 2);
    return colorValue;
};

/**
* getRGBAFromHex
* @description This function takes a hexadecimal color and an opacity value and returns the corresponding RGBA color value.
* @param {String} hexColor - The hexadecimal color to convert to RGBA.
* @param {Number} opacity - The opacity value for the RGBA color.
* @returns {String} Returns a string representing the RGBA color value.
*/
export const getRGBAFromHex = (hexColor: string, opacity: number | string) => {
    var red = parseInt(getExtractColorValue(hexColor,"R"), 16);		// Converts to decimal
    var green = parseInt(getExtractColorValue(hexColor,"G"), 16);	// Converts to decimal
    var blue = parseInt(getExtractColorValue(hexColor,"B"), 16);	// Converts to decimal
    var opacity = opacity;
    return "rgba("+red+","+green+","+blue+","+opacity+")";
};

/**
* getHexFromRGBA
* @description This function converts an RGBA color expression to a hexadecimal color expression. e.g. rgba(255,255,255,1) > #ffffff
* @param {String} color - The RGBA color to convert.
* @returns {String} Returns the hexadecimal color string, if color was in RGBA format. Otherwise, returns null.
*/
export const getHexFromRGBA = (color: string) => {
    if (color.startsWith("#")) {
        return color; // If color is already in hex format, return as is
    }
    
    // Verify that the color is in rgba format
    if (!color.startsWith("rgba")) {
        return null;
    }

    // Extract the RGB values from the rgba color string
    var rgba = (color as any).match(/\d+/g).map(Number); 

    var r = rgba[0].toString(16),
        g = rgba[1].toString(16),
        b = rgba[2].toString(16);

    if (r.length == 1)
        r = "0" + r;
    if (g.length == 1)
        g = "0" + g;
    if (b.length == 1)
        b = "0" + b;

    return "#" + r + g + b; 
};

/**
* getOpacityFromRGBA
* @description This function extracts the opacity value from a color string in rgba format.
* @param {string} color - The color string in rgba format. 
* @returns {string|null} The opacity value as a string, or null if the color string is not in rgba format or does not include an opacity value.
*/
export const getOpacityFromRGBA = (color: string) => {
    if (!color) return null; 
    if (color.startsWith("#")) {
        return null; // If color is already in hex format, return null
    }

    // Extract the opacity from the rgba color string
    var matches = color.match(/\d+/g);

    if (!matches) {
        return null; // If there are no numeric sequences in the color string, return null
    }
    var rgba = matches.map(Number);
    if(rgba.length < 4) return "1";
    
    return rgba[3].toString();
};

/**
* getHexColorFromColorName
* @description Converts a named CSS color into its corresponding hexadecimal value.
* @param {string} colorName - The name of the color (e.g. "red").
* @returns {string} The hexadecimal value of the color (e.g. "#ff0000").
*/
export const getHexColorFromColorName = (colorName: string) => {
    // If the input is already in hexadecimal format, return it as is
    if (/^#[0-9a-fA-F]{6}$/.test(colorName)) {
        return colorName;
    }
    
    var dummyDiv = document.createElement("div");
    dummyDiv.style.color = colorName;
    document.body.appendChild(dummyDiv);
    
    // Get the computed style
    var color = window.getComputedStyle(dummyDiv).color;
    document.body.removeChild(dummyDiv);
    
    // Convert the color from RGB format to hexadecimal
    var rgb: any = color.match(/\d+/g); 
    var hex = "#" + ((1 << 24) + (+rgb[0] << 16) + (+rgb[1] << 8) + +rgb[2]).toString(16).slice(1);
    
    return hex;
};

/**
* getColorShade
* @description Determines whether a hexadecimal color is of a light or dark shade.
* @param {string} hexColor - The hexadecimal color code (e.g. "#ff0000").
* @returns {string} "light" if the color is of a light shade, "dark" otherwise.
*/
export const getColorShade = (hexColor: string) => {
        var r = parseInt(hexColor.slice(1, 3), 16);
        var g = parseInt(hexColor.slice(3, 5), 16);
        var b = parseInt(hexColor.slice(5, 7), 16);

        // Count how many of the R, G, B values are greater than or equal to 160 (0xa0)
        var lightCount = 0;
        if (r >= 0xa0) lightCount++;
        if (g >= 0xa0) lightCount++;
        if (b >= 0xa0) lightCount++;

        // If at least two out of three values are considered "light", the color is categorized as "light"
        return lightCount >= 2 ? "light" : "dark";
};

/**
* getAdjustHexColor
* @description Adjusts the given hex color by the specified 16-bit difference.
* @param {string} color - The hex color code to adjust (e.g. "#ffffff").
* @param {string} diff - The 16-bit difference to add or subtract to each RGB component (from "-f" to "f").
* @returns {string} The adjusted hex color code.
*/
export const getAdjustHexColor = (color: string, diff: string) => {
    if (color.startsWith("#")) {
        color = color.slice(1);
    }
    
    var diffValue = parseInt(diff, 16);
    if (diff.startsWith("-")) {
        diffValue = -parseInt(diff.slice(1), 16);
    }
    
    var r: any = parseInt(color.slice(0, 2), 16) + diffValue;
    var g: any = parseInt(color.slice(2, 4), 16) + diffValue;
    var b: any = parseInt(color.slice(4, 6), 16) + diffValue;
    
    r = (r < 0 ? 0 : r > 255 ? 255 : r).toString(16).padStart(2, "0");
    g = (g < 0 ? 0 : g > 255 ? 255 : g).toString(16).padStart(2, "0");
    b = (b < 0 ? 0 : b > 255 ? 255 : b).toString(16).padStart(2, "0");
    
    return "#" + r + g + b;
};

/**
* getInvertColor
* @description Inverts the given hexadecimal color.
* @param {string} hex - The hexadecimal color to invert.
* @returns {string} The inverted hexadecimal color.
*/
export const getInvertColor = (hex: string) => {
    if (hex.startsWith("#")) {
        hex = hex.slice(1);
    }
    
    var r: any = 255 - parseInt(hex.slice(0, 2), 16);
    var g: any = 255 - parseInt(hex.slice(2, 4), 16);
    var b: any = 255 - parseInt(hex.slice(4, 6), 16);
    
    r = r < 127.5 ? r + 16 : r - 16;
    g = g < 127.5 ? g + 16 : g - 16;
    b = b < 127.5 ? b + 16 : b - 16;
    
    r = (r < 0 ? 0 : r > 255 ? 255 : r).toString(16).padStart(2, "0");
    g = (g < 0 ? 0 : g > 255 ? 255 : g).toString(16).padStart(2, "0");
    b = (b < 0 ? 0 : b > 255 ? 255 : b).toString(16).padStart(2, "0");
    
    return "#" + r + g + b;
};

/**
* isCloserToRight
* @description This function checks whether an HTML element is closer to the right or left side of the screen.
* @param {HTMLElement} element - The HTML element to check.
* @returns {Boolean} Returns true if the element is closer to the right side of the screen, and false if it's closer to the left.
*/
export const isCloserToRight = (element: HTMLElement) => {
    if(element.offsetParent === null) return false;
    var rect = element.getBoundingClientRect();
    var windowWidth = window.innerWidth;
    var distanceToLeft = rect.left;
    if (windowWidth/2 < distanceToLeft) {
        return true; // Element is closer to the left
    } else {
        return false; // Element is closer to the right
    }
};

/**
* isFontAvailable	(no use)
* @description Checks if a specific font is available in the current browser.
* @param {string} fontName - The name of the font to check.
* @returns {boolean} Returns true if the font is available, false otherwise.
*/
export const isFontAvailable = (fontName: string) => {
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");

    var text = "abcdefghijklmnopqrstuvwxyz0123456789" + 
                "あいうえおアイウエオ" + 
                "안녕하세요" + 
                "你好" + 
                "Привет" + 
                "שָׁלוֹם" + 
                "مرحبا" + 
                "Χαίρετε" + 
                "नमस्ते";

    if(!context) return false;
    context.font = "72px monospace";
    var size = context.measureText(text).width;
    context.font = "72px '" + fontName + "', monospace";
    var newSize = context.measureText(text).width;

    // If the sizes are almost the same, the font is probably not available and the browser is using the fallback font
    return size !== newSize;
};


export const getColors = (mainColor: string): Colors => {
    mainColor = getHexColorFromColorName(mainColor);
    const type = getColorShade(mainColor);
    const colors: Colors = {
        color1 : "",
        color2 : "",
        color3 : "",
        color4 : "",
        color5 : "",
        color6 : "",
        color7 : "",
        color8 : "",
        color9 : "",
        color10 : "",
        color11 : "",
        color12 : "",
        color13 : "",
        color14 : "",
        color15 : "",
        color16 : "",
        color17 : "",
        color18 : "",
        color19 : "",
        color20 : "",
    }
    
    if(type === "light") {
        colors.color1 = "#333333";	//filled
        colors.color2 = "#ffffff";	//empty
        colors.color3 = getAdjustHexColor(mainColor,"18");	//toolbar
        colors.color4 = mainColor;	//button
        colors.color5 = getAdjustHexColor(mainColor,"-18");	//active
        colors.color6 = getAdjustHexColor(mainColor,"-1f");	//border
        colors.color7 = getAdjustHexColor(mainColor,"-2f");	//box-shadow
        colors.color8 = "#609966";	//correct
        colors.color9 = "#df2e38";	//notice
        colors.color10 = "#333333";	//modal text
        colors.color11 = "#666666";	//a tag color
        colors.color12 = "#333333";	//color 0 text color
        colors.color13 = "#ffffff";	//color 0 text background color
        colors.color14 = "#ff7f7f";	//color 1
        colors.color15 = "#ffad66";	//color 2
        colors.color16 = "#ffff66";	//color 3
        colors.color17 = "#99ff99";	//color 4
        colors.color18 = "#99ccff";	//color 5
        colors.color19 = "#6699cc";	//color 6
        colors.color20 = "#cc99cc";	//color 7
    }
    else {
        colors.color1 = "#ffffff";	//filled
        colors.color2 = "#ffffff";	//empty
        colors.color3 = getAdjustHexColor(mainColor,"18");	//toolbar
        colors.color4 = mainColor;	//button
        colors.color5 = getAdjustHexColor(mainColor,"-18");	//active
        colors.color6 = getAdjustHexColor(mainColor,"-1f");	//border
        colors.color7 = getAdjustHexColor(mainColor,"-2f");	//box-shadow
        colors.color8 = "#609966";	//correct
        colors.color9 = "#df2e38";	//notice
        colors.color10 = "#333333";	//modal text
        colors.color11 = "#666666";	//a tag color
        colors.color12 = "#333333";	//color 0 text color
        colors.color13 = "#ffffff";	//color 0 text background color
        colors.color14 = "#b70404";	//color 1
        colors.color15 = "#e55807";	//color 2
        colors.color16 = "#f1c93b";	//color 3
        colors.color17 = "#1a5d1a";	//color 4
        colors.color18 = "#068fff";	//color 5
        colors.color19 = "#0c134f";	//color 6
        colors.color20 = "#5c469c";	//color 7
    }

    return colors;
}
