import type { Colors } from "../types/csses";
import type { VanillanoteElement } from "../types/vanillanote";

export const getParentNote = (targetElement: HTMLElement): VanillanoteElement | null => {
    let target: any = targetElement;
    while(!(target instanceof Element)) {
        target = target.parentNode;
    }
    if(!target.closest) return null;
    return target.closest('[data-vanillanote]')!
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

export const getUUID = () => {
    let d = new Date().getTime();
    if (typeof performance !== "undefined" && typeof performance.now === "function"){
        d += performance.now();
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
    });
};

export const getNoteId = (el: any) => {
    if(!el) return null;
    let noteId;
    let target = el instanceof Element ? el : (el as any).parentNode;
    while(!target.hasAttribute("data-note-id")) {
        target = target.parentNode;
        if(!target || !target.hasAttribute) break;
    }
    if(target && target.hasAttribute && target.hasAttribute("data-note-id")) {
        noteId = target.getAttribute("data-note-id");
    }
    return noteId;
};

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

export const getIsIOS = () => {
    return typeof navigator !== 'undefined' ? /iPhone|iPad|iPod/i.test(navigator.userAgent) : false;
};
    
export const checkNumber = (checkValue: any) => {
    const regExp = /^[0-9]+$/;
    return regExp.test(checkValue);
};

export const checkRealNumber = (checkValue: any) => {
    if(checkValue !== "-" && isNaN(checkValue)) {
        return false;
    }
    return true;
};

export const checkAlphabetAndNumber = (checkValue: string) => {
    const regExp = /^[A-Za-z0-9]+$/;
    return regExp.test(checkValue);
};

export const checkHex = (checkValue: string) => {
    const hexRegex = /^[0-9A-Fa-f]*$/;
    return hexRegex.test(checkValue);
};

export const extractNumber = (str: string) => {
    const match = str.match(/-?\d+\.?\d*/);
    return match ? Number(parseFloat(match[0])) : null;
};

export const extractUnit = (str: string) => {
    const match = str.replace(/[-+]?[0-9]*\.?[0-9]+/g, "");
    return match ? match : null;
};

export const compareObject = (obj1: any, obj2: any) => {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    
    if(keys1.length !== keys2.length) return false;
    for(let i = 0; i < keys1.length; i++) {
        if(keys2.includes(keys1[i])) {
            if(obj1[keys1[i]] !== obj2[keys1[i]]) return false;
        }
        else {
            return false;
        }
    }
    return true;
};

export const mergeObjects = (obj1: any, obj2: any) => {
    const mergedObj: any = {};
    for (const key in obj1) {
        if (obj1.hasOwnProperty(key)) {
            mergedObj[key] = obj1[key];
        }
    }
    for (const key in obj2) {
        if (obj2.hasOwnProperty(key)) {
            mergedObj[key] = obj2[key];
        }
    }
    return mergedObj;
}

export const getCommaStrFromArr = (arr: any[]) => {
    let str = "";
    for(let i = 0; i < arr.length; i++) {
        if(arr[i]) {
            str = str + arr[i].trim();
            if(i !== arr.length - 1) {
                str = str + ", ";
            }
        }
    }
    return str;
};

export const getObjectFromCssText = (cssText: string) => {
    const cssObject = new Object();
    if(!cssText) return cssObject;
    let csses;
    let css;
    csses = cssText.trim().split(";");
    for(let i = 0; i < csses.length; i++) {
        if(!csses[i]) continue;
        css = csses[i].split(":");
        if(css.length < 2) continue;
        (cssObject as any)[css[0].trim()] = css[1].trim();
    }
    
    return cssObject;
};

export const getCssTextFromObject = (cssObject: Record<string, string>) => {
    let cssText = "";
    if(!cssObject || cssObject.constructor !== Object || Object.keys(cssObject).length === 0) return cssText;
    
    const csses = Object.entries(cssObject);
    for(let i = 0; i < csses.length; i++) {
        if(csses[i].length < 2) continue;
        cssText += csses[i][0].trim() + ":" + csses[i][1].trim() + ";";
    }
    
    return cssText;
};

export const setAttributesObjectToElement = (element: any, attributes: Record<string, string>) => {
    if(!attributes || attributes.constructor !== Object) return element;
    const keys = Object.keys(attributes);
    for(let i = 0; i < keys.length; i++) {
        element.setAttribute(keys[i], attributes[keys[i]]);
    }
    return element;
};

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
    const hexColorRegex = /^#([0-9A-Fa-f]{6})$/;
    if (!hexColorRegex.test(hexColor)) {
        return "33";
    }
    // Get the start index based on the channel
    const startIndex = channel === "R" ? 1 : channel === "G" ? 3 : 5;
    // Extract the relevant 2-digit hex number
    const colorValue = hexColor.substring(startIndex, startIndex + 2);
    return colorValue;
};

export const getRGBAFromHex = (hexColor: string, opacity: number | string) => {
    const red = parseInt(getExtractColorValue(hexColor,"R"), 16);		// Converts to decimal
    const green = parseInt(getExtractColorValue(hexColor,"G"), 16);	// Converts to decimal
    const blue = parseInt(getExtractColorValue(hexColor,"B"), 16);	// Converts to decimal
    return "rgba("+red+","+green+","+blue+","+opacity+")";
};

export const getHexFromRGBA = (color: string) => {
    if (color.startsWith("#")) {
        return color; // If color is already in hex format, return as is
    }
    
    // Verify that the color is in rgba format
    if (!color.startsWith("rgba")) {
        return null;
    }

    // Extract the RGB values from the rgba color string
    const rgba = (color as any).match(/\d+/g).map(Number); 

    let r = rgba[0].toString(16),
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

export const getOpacityFromRGBA = (color: string) => {
    if (!color) return null; 
    if (color.startsWith("#")) {
        return null; // If color is already in hex format, return null
    }

    // Extract the opacity from the rgba color string
    const matches = color.match(/\d+/g);

    if (!matches) {
        return null; // If there are no numeric sequences in the color string, return null
    }
    const rgba = matches.map(Number);
    if(rgba.length < 4) return "1";
    
    return rgba[3].toString();
};

export const getHexColorFromColorName = (colorName: string) => {
    // If the input is already in hexadecimal format, return it as is
    if (/^#[0-9a-fA-F]{6}$/.test(colorName)) {
        return colorName;
    }
    
    const dummyDiv = document.createElement("div");
    dummyDiv.style.color = colorName;
    document.body.appendChild(dummyDiv);
    
    // Get the computed style
    const color = window.getComputedStyle(dummyDiv).color;
    document.body.removeChild(dummyDiv);
    
    // Convert the color from RGB format to hexadecimal
    const rgb: any = color.match(/\d+/g); 
    const hex = "#" + ((1 << 24) + (+rgb[0] << 16) + (+rgb[1] << 8) + +rgb[2]).toString(16).slice(1);
    
    return hex;
};

export const getColorShade = (hexColor: string) => {
        const r = parseInt(hexColor.slice(1, 3), 16);
        const g = parseInt(hexColor.slice(3, 5), 16);
        const b = parseInt(hexColor.slice(5, 7), 16);

        // Count how many of the R, G, B values are greater than or equal to 160 (0xa0)
        let lightCount = 0;
        if (r >= 0xa0) lightCount++;
        if (g >= 0xa0) lightCount++;
        if (b >= 0xa0) lightCount++;

        // If at least two out of three values are considered "light", the color is categorized as "light"
        return lightCount >= 2 ? "light" : "dark";
};

export const getAdjustHexColor = (color: string, diff: string) => {
    if (color.startsWith("#")) {
        color = color.slice(1);
    }
    
    let diffValue = parseInt(diff, 16);
    if (diff.startsWith("-")) {
        diffValue = -parseInt(diff.slice(1), 16);
    }
    
    let r: any = parseInt(color.slice(0, 2), 16) + diffValue;
    let g: any = parseInt(color.slice(2, 4), 16) + diffValue;
    let b: any = parseInt(color.slice(4, 6), 16) + diffValue;
    
    r = (r < 0 ? 0 : r > 255 ? 255 : r).toString(16).padStart(2, "0");
    g = (g < 0 ? 0 : g > 255 ? 255 : g).toString(16).padStart(2, "0");
    b = (b < 0 ? 0 : b > 255 ? 255 : b).toString(16).padStart(2, "0");
    
    return "#" + r + g + b;
};

export const getInvertColor = (hex: string) => {
    if (hex.startsWith("#")) {
        hex = hex.slice(1);
    }
    
    let r: any = 255 - parseInt(hex.slice(0, 2), 16);
    let g: any = 255 - parseInt(hex.slice(2, 4), 16);
    let b: any = 255 - parseInt(hex.slice(4, 6), 16);
    
    r = r < 127.5 ? r + 16 : r - 16;
    g = g < 127.5 ? g + 16 : g - 16;
    b = b < 127.5 ? b + 16 : b - 16;
    
    r = (r < 0 ? 0 : r > 255 ? 255 : r).toString(16).padStart(2, "0");
    g = (g < 0 ? 0 : g > 255 ? 255 : g).toString(16).padStart(2, "0");
    b = (b < 0 ? 0 : b > 255 ? 255 : b).toString(16).padStart(2, "0");
    
    return "#" + r + g + b;
};

export const isCloserToRight = (element: HTMLElement) => {
    if(element.offsetParent === null) return false;
    const rect = element.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const distanceToLeft = rect.left;
    if (windowWidth/2 < distanceToLeft) {
        return true; // Element is closer to the left
    } else {
        return false; // Element is closer to the right
    }
};

export const isFontAvailable = (fontName: string) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    const text = "abcdefghijklmnopqrstuvwxyz0123456789" + 
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
    const size = context.measureText(text).width;
    context.font = "72px '" + fontName + "', monospace";
    const newSize = context.measureText(text).width;

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
