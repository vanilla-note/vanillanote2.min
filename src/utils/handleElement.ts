import { VanillanoteElement } from "../types/vanillanote";
import { extractNumber, extractUnit, getEventChildrenClassName, getId, getObjectFromCssText, getParentNote, isCloserToRight } from "./util";

/**
* closeAllTooltip
* @description Closes all the tooltips associated with the specified note.
* @param {number} noteIndex - The index of the note for which to close all tooltips.
*/
export const closeAllTooltip = (noteIndex: number) => {
    vn.elements.attLinkTooltips[noteIndex].style.opacity = "0";
    vn.elements.attLinkTooltips[noteIndex].style.height  = "0";
    vn.elements.attImageAndVideoTooltips[noteIndex].style.opacity = "0";
    vn.elements.attImageAndVideoTooltips[noteIndex].style.height  = "0";
};

/**
* setVariableButtonTogle
* @description Changes the note's style variables based on the provided CSS object.
* @param {Number} noteIndex - The index of the note.
* @param {Object} cssObject - The CSS object containing style properties.
*/
var setVariableButtonTogle = function(noteIndex: number, cssObject: Record<string, string>) {
    //bold
    if(cssObject["font-weight"] === "bold") {
        vn.variables.boldToggles[noteIndex] = true;
    }
    else {
        vn.variables.boldToggles[noteIndex] = false;
    }
    //underline
    if(cssObject["text-decoration"] === "underline" || cssObject["text-decoration-line"] === "underline") {
        vn.variables.underlineToggles[noteIndex] = true;
    }
    else {
        vn.variables.underlineToggles[noteIndex] = false;
    }
    //italic
    if(cssObject["font-style"] === "italic") {
        vn.variables.italicToggles[noteIndex] = true;
    }
    else {
        vn.variables.italicToggles[noteIndex] = false;
    }
    //color
    if(cssObject["color"]) {
        vn.variables.colorTextRGBs[noteIndex] = getHexFromRGBA(cssObject["color"])!;
        vn.variables.colorTextOpacitys[noteIndex] = getOpacityFromRGBA(cssObject["color"])!;
        // If color is not in rgba format, use the default color and opacity
        if(!vn.variables.colorTextRGBs[noteIndex]) {
            vn.variables.colorTextRGBs[noteIndex] = getHexColorFromColorName(vn.colors.color12[noteIndex]);
            vn.variables.colorTextOpacitys[noteIndex] = "1";
        }
        else {
            // If opacity is not present in rgba format, use 1 as default opacity
            if(!vn.variables.colorTextOpacitys[noteIndex]) {
                if(cssObject["opacity"]) {
                    vn.variables.colorTextOpacitys[noteIndex] = cssObject["opacity"];
                }
                else {
                    vn.variables.colorTextOpacitys[noteIndex] = "1";
                }
            }
        }
        
    }
    else {
        vn.variables.colorTextRGBs[noteIndex] = getHexColorFromColorName(vn.colors.color12[noteIndex]);
        vn.variables.colorTextOpacitys[noteIndex] = "1";
    }
    //background color
    if(cssObject["background-color"]) {
        vn.variables.colorBackRGBs[noteIndex] = getHexFromRGBA(cssObject["background-color"])!;
        vn.variables.colorBackOpacitys[noteIndex] = getOpacityFromRGBA(cssObject["background-color"])!;
        // If background-color is not in rgba format, use the default color and opacity
        if(!vn.variables.colorTextRGBs[noteIndex]) {
            vn.variables.colorTextRGBs[noteIndex] = getHexColorFromColorName(vn.colors.color12[noteIndex]);
            vn.variables.colorTextOpacitys[noteIndex] = "1";
        }
        else {
            // If opacity is not present in rgba format, use 0 as default opacity
            if(!vn.variables.colorBackOpacitys[noteIndex]) {
                if(cssObject["opacity"]) {
                    vn.variables.colorBackOpacitys[noteIndex] = cssObject["opacity"];
                }
                else {
                    vn.variables.colorBackOpacitys[noteIndex] = "0";
                }
            }
        }
    }
    else {
        vn.variables.colorBackRGBs[noteIndex] = getHexColorFromColorName(vn.colors.color13[noteIndex]);
        vn.variables.colorBackOpacitys[noteIndex] = "0";
    }
    /* Do not toggle font family and font size, etc.
    //font family
    if(cssObject["font-family"]) {
        vn.variables.fontFamilies[noteIndex] = cssObject["font-family"];
    }
    else {
        vn.variables.fontFamilies[noteIndex] = vn.variables.defaultStyles[noteIndex]["font-family"];
    }
    //font size
    if(cssObject["font-size"]) {
        vn.variables.fontSizes[noteIndex] = extractNumber(cssObject["font-size"]);
    }
    else {
        vn.variables.fontSizes[noteIndex] = extractNumber(vn.variables.defaultStyles[noteIndex]["font-size"]);
    }
    //letter spacing
    if(cssObject["letter-spacing"]) {
        vn.variables.letterSpacings[noteIndex] = extractNumber(cssObject["letter-spacing"]);
    }
    else {
        vn.variables.letterSpacings[noteIndex] = 0;
    }
    //line height
    if(cssObject["line-height"]) {
        vn.variables.lineHeights[noteIndex] = extractNumber(cssObject["line-height"]);
    }
    else {
        vn.variables.lineHeights[noteIndex] = extractNumber(vn.variables.defaultStyles[noteIndex]["line-height"]);
    }
    */
};

/**
* button_onToggle
* @description Toggles the button on or off based on the 'toggle' parameter.
* @param {HTMLElement} target - The target button to be toggled.
* @param {Boolean} toggle - If true, the button is toggled on, otherwise it is toggled off.
*/
var button_onToggle = function(target: any, toggle: boolean) {
    // If a child element is selected, event is controlled
    if(target.classList.contains(getEventChildrenClassName())) {
        target = target.parentNode;
    }
    if(toggle) {
        var noteId = getNoteId(target);
        if(!noteIndex) return;
        target.classList.add(getId(noteIndex, "on_button_on"));
    } else {
        var noteId = getNoteId(target);
        if(!noteIndex) return;
        target.classList.remove(getId(noteIndex, "on_button_on"));
    }
};

/**
* allButtonToggle
* @description Toggles all buttons of a specific note.
* @param {number} noteIndex - The index of the note whose buttons need to be toggled.
*/
var allButtonToggle = function(noteIndex: number) {
    //format
    button_onToggle(vn.elements.boldButtons[noteIndex], vn.variables.boldToggles[noteIndex]);
    button_onToggle(vn.elements.underlineButtons[noteIndex], vn.variables.underlineToggles[noteIndex]);
    button_onToggle(vn.elements.italicButtons[noteIndex], vn.variables.italicToggles[noteIndex]);
    button_onToggle(vn.elements.ulButtons[noteIndex], vn.variables.ulToggles[noteIndex]);
    button_onToggle(vn.elements.olButtons[noteIndex], vn.variables.olToggles[noteIndex]);
    //color
    (vn.elements.colorTextSelects[noteIndex] as any).querySelector("."+getEventChildrenClassName()).style.color
    = getRGBAFromHex(vn.variables.colorTextRGBs[noteIndex], vn.variables.colorTextOpacitys[noteIndex] === "0" ? "1" : vn.variables.colorTextOpacitys[noteIndex]);
    (vn.elements.colorBackSelects[noteIndex] as any).querySelector("."+getEventChildrenClassName()).style.color
        = getRGBAFromHex(vn.variables.colorBackRGBs[noteIndex], vn.variables.colorBackOpacitys[noteIndex] === "0" ? "1" : vn.variables.colorBackOpacitys[noteIndex]);
    /*Do not toggle font family and font size, etc.
    //font family
    vn.elements.fontFamilySelects[noteIndex].firstChild.textContent = vn.variables.fontFamilies[noteIndex].length > 12 ? vn.variables.fontFamilies[noteIndex].substr(0,12) + "..." : vn.variables.fontFamilies[noteIndex];
    vn.elements.fontFamilySelects[noteIndex].style.fontFamily = vn.variables.fontFamilies[noteIndex];
    //size
    vn.elements.fontSizeInputs[noteIndex].value = vn.variables.fontSizes[noteIndex];
    vn.elements.letterSpacingInputs[noteIndex].value = vn.variables.letterSpacings[noteIndex];
    vn.elements.lineHeightInputs[noteIndex].value = vn.variables.lineHeights[noteIndex];
    */
};

export const selectToggle = (target: any, _note?: VanillanoteElement) => {
    const note = _note ? _note : getParentNote(target);
    // If a child element is selected, event is controlled
    if(target.classList.contains(getEventChildrenClassName(note._noteName))) {
        target = target.parentNode!;
    }
    var select = target;
    var isClickBox = false;
    // If select box is selected
    while(select && select.getAttribute("type") !== "select") {
        isClickBox = true;
        select = select.parentNode;
    }
    if(!select.getAttribute("data-note-id")) return;
    var selectId = select.getAttribute("id");
    var selectBox: any;
    
    if(selectId.includes("paragraphStyleSelect")) {
        selectBox = note._elements.paragraphStyleSelectBox;
    }
    else if(selectId.includes("textAlignSelect")) {
        selectBox = note._elements.textAlignSelectBox;
    }
    else if(selectId.includes("fontFamilySelect")) {
        selectBox = note._elements.fontFamilySelectBox;
    }
    else if(selectId.includes("colorTextSelect")) {
        if(isClickBox) return; // Checks if the select box is currently visible
        selectBox = note._elements.colorTextSelectBox;
    }
    else if(selectId.includes("colorBackSelect")) {
        if(isClickBox) return; // Checks if the select box is currently visible
        selectBox = note._elements.colorBackSelectBox;
    }
    
    var displayBlock = getId(note._noteName, note._id, "on_display_block");
    var displayNone = getId(note._noteName, note._id, "on_display_none");
    var isOpened = selectBox.classList.contains(displayBlock);
    
    closeAllSelectBoxes(note);	//Close all other select boxes
    
    if(isOpened) {
        selectBox.classList.remove(displayBlock);
        selectBox.classList.add(displayNone);
    }
    else {
        selectBox.classList.remove(displayNone);
        selectBox.classList.add(displayBlock);
    }
    
    //If the select box is already opened, it closes. If it's closed, it opens.
    if(isCloserToRight(select)) {
        //closer right
        selectBox.style.removeProperty("left");
        selectBox.style.right = "0%";
        
        if(selectBox.offsetParent === null) return;
        var selectBoxRect = selectBox.getBoundingClientRect();
        if(selectBoxRect.top === 0) return
        
        if(note._elements.tools.offsetParent === null) return;
        var toolRect = note._elements.tools.getBoundingClientRect();
        
        if(toolRect.left > selectBoxRect.left) {
            selectBox.style.right = selectBoxRect.left - 1 + "px";
        }
    }
    else {
        //closer left
        selectBox.style.removeProperty("right");
        selectBox.style.left = "0%";
        
        if(selectBox.offsetParent === null) return;
        var selectBoxRect = selectBox.getBoundingClientRect();
        if(selectBoxRect.top === 0) return
        
        if(note._elements.tools.offsetParent === null) return;
        var toolRect = note._elements.tools.getBoundingClientRect();
        
        if(toolRect.right < selectBoxRect.right) {
            selectBox.style.left = toolRect.right - (selectBoxRect.right + 1) + "px";
        }
    }
};

export const closeAllSelectBoxes = (note: VanillanoteElement) => {
    var displayBlock = getId(note._noteName, note._id, "on_display_block");
    var displayNone = getId(note._noteName, note._id, "on_display_none");
    
    note._elements.paragraphStyleSelectBoxes.classList.remove(displayBlock);
    note._elements.paragraphStyleSelectBoxes.classList.add(displayNone);
    note._elements.textAlignSelectBoxes.classList.remove(displayBlock);
    note._elements.textAlignSelectBoxes.classList.add(displayNone);
    note._elements.fontFamilySelectBoxes.classList.remove(displayBlock);
    note._elements.fontFamilySelectBoxes.classList.add(displayNone);
    note._elements.colorTextSelectBoxes.classList.remove(displayBlock);
    note._elements.colorTextSelectBoxes.classList.add(displayNone);
    note._elements.colorBackSelectBoxes.classList.remove(displayBlock);
    note._elements.colorBackSelectBoxes.classList.add(displayNone);
};

export const fontFamilySelectList_onClick = (e: any, _note?: VanillanoteElement) => {
    if(!e.target) return;
    const selectLsit = e.target;
    const note = _note ? _note : getParentNote(e.target);
    const fontFamily = selectLsit.getAttribute("data-font-family");
    var oldStyleObject: any = getObjectFromCssText(note._elements.fontFamilySelect.getAttribute("style")!);
    oldStyleObject["font-family"] = fontFamily;
    // Change the font family in the variables and the displayed select list option.
    note._noteStatus.fontFamilies = fontFamily;
    (note._elements.fontFamilySelects as any).firstChild.textContent = fontFamily.length > 12 ? fontFamily.substr(0,12) + "..." : fontFamily;
    (note._elements.fontFamilySelects as any).style.fontFamily = fontFamily;
};

/**
* setEditStyleTag
* @description Sets buttons and variables based on the selected element's styles and tags.
* @param {Number} noteIndex - The index of the note.
*/
var setEditStyleTag = function(noteIndex: number) {
    if(vn.variables.setEditStyleTagToggle > 0) {
        vn.variables.setEditStyleTagToggle--;
        return;
    }
    var tempEl: any = vn.variables.editStartUnitElements[noteIndex];
    var textarea = tempEl;
    while(tempEl) {
        if(tempEl.tagName === (vn.variables.noteName+"-textarea").toUpperCase()) {
            textarea = tempEl;
            break;
        }
        tempEl = tempEl.parentNode;
    }
    if(!textarea) {
        for(var i = 0; i < vn.elements.notes.length; i++) {
            initToggleButtonVariables(i);
        }
        return;
    }
    
    // Get styles of the selected element
    var cssObjectEl = getObjectEditElementCss(vn.variables.editStartElements[noteIndex]);
    // If multiple elements are selected, check if all tags have the same styles
    // If not, clear the cssObjectEl
    if(vn.variables.editStartNodes[noteIndex] !== vn.variables.editEndNodes[noteIndex]) {
        var tempCssObjectEl = cssObjectEl;
        var isCheck = false;
        var isEnd = false;
        var getCheckAllStyle = function(element: any) {
            for(var i = 0; i < element.childNodes.length; i++) {
                if(isEnd) break;
                if(vn.variables.editStartNodes[noteIndex] === element.childNodes[i]) {
                    isCheck = true;
                }
                if(isCheck && element.childNodes[i].nodeType === 3 && element.childNodes[i].textContent) {
                    tempCssObjectEl = getObjectEditElementCss(element.childNodes[i]);
                }
                if(!compareObject(cssObjectEl, tempCssObjectEl)) {
                    cssObjectEl = {};
                    isEnd = true;
                }
                if(vn.variables.editEndNodes[noteIndex] === element.childNodes[i]) {
                    isEnd = true;
                }
                if(element.childNodes[i].childNodes) {
                    getCheckAllStyle(element.childNodes[i]);
                }
            }
        };
        for(var i = 0; i < vn.variables.editDragUnitElements[noteIndex].length; i++) {
            getCheckAllStyle(vn.variables.editDragUnitElements[noteIndex][i]);
        }
    }
    // Change the note's style variables
    setVariableButtonTogle(noteIndex, cssObjectEl);
    // Get the current selected tag
    var nowTag = getEditElementTag(noteIndex);
    // Change the note's tag variables (toggle)
    setTagToggle(noteIndex, nowTag);
    // Toggle buttons for the note
    allButtonToggle(noteIndex);
};

/**
* setElementScroll
* @description Animates the scrolling of the parent element to bring the child element into view.
* @param {Element} parentElement - The parent element to be scrolled.
* @param {Element} childElement - The child element to bring into view.
*/
var setElementScroll = function(parentElement: any, childElement: any) {
    if(!parentElement || !childElement) return;
    if(childElement.nodeType === 3) childElement = childElement.parentNode;
    var start: any = null;
    var target = childElement.offsetTop - Math.round(vn.variables.mobileKeyboardExceptHeight! / 2) + Math.round(childElement.offsetHeight / 2);
    var firstPosition = parentElement.scrollTop;
    var difference = target - firstPosition;
    var duration = 500; // Animation duration in milliseconds
    
    function step(timestamp: any) {
        if (!start) start = timestamp;
        var progress = timestamp - start;
        var percent = Math.min(progress / duration, 1);
        parentElement.scrollTop = firstPosition + difference * percent;

        // Continue the animation as long as it's not finished
        if (progress < duration) {
            window.requestAnimationFrame(step);
        }
    }
    
    window.requestAnimationFrame(step);
};

export const decreaseTextareaHeight = function(textarea: HTMLDivElement, noteIndex: number) {
    if(extractUnit(vn.variables.textareaOriginHeights[noteIndex]) !== 'px') return;
    if(vn.variables.mobileKeyboardExceptHeight! < extractNumber(vn.variables.textareaOriginHeights[noteIndex])!
        && vn.variables.mobileKeyboardExceptHeight! < textarea.offsetHeight) {
        textarea.style.height = vn.variables.mobileKeyboardExceptHeight + "px";
    }
};

/**
* increaseTextareaHeight
* @description Increases the height of the textarea to its original height.
* @param {HTMLTextAreaElement} textarea - The textarea element to be resized.
*/
var increaseTextareaHeight = function(textarea: any) {
    var noteId = textarea.getAttribute("data-note-id");
    textarea.style.height = vn.variables.textareaOriginHeights[noteIndex];
};

/**
* getCheckSelectBoxesOpened
* @description Checks if any select box is in open state. Returns true if at least one select box is open.
* @param {Number} noteIndex - The index of the note where the select boxes are located.
* @returns {Boolean} - Returns true if any select box is open, false otherwise.
*/
var getCheckSelectBoxesOpened = function(noteIndex: number) {
    var displayBlock = getId(noteIndex, "on_display_block");
    
    if(vn.elements.paragraphStyleSelectBoxes[noteIndex].classList.contains(displayBlock)) return true;
    if(vn.elements.textAlignSelectBoxes[noteIndex].classList.contains(displayBlock)) return true;
    if(vn.elements.fontFamilySelectBoxes[noteIndex].classList.contains(displayBlock)) return true;
    if(vn.elements.colorTextSelectBoxes[noteIndex].classList.contains(displayBlock)) return true;
    if(vn.elements.colorBackSelectBoxes[noteIndex].classList.contains(displayBlock)) return true;
    
    return false;
};

/**
* closeAllModal
* @description Closes all modals and initializes attachment link, file, and image modals.
* @param {Number} noteIndex - The index of the note where the modals are located.
*/
var closeAllModal = function(noteIndex: number) {
    var displayBlock = getId(noteIndex, "on_display_block");
    var displayNone = getId(noteIndex, "on_display_none");
    
    vn.elements.backModals[noteIndex].classList.remove(displayBlock);
    vn.elements.backModals[noteIndex].classList.add(displayNone);
    vn.elements.attLinkModals[noteIndex].classList.remove(displayBlock);
    vn.elements.attLinkModals[noteIndex].classList.add(displayNone);
    vn.elements.attFileModals[noteIndex].classList.remove(displayBlock);
    vn.elements.attFileModals[noteIndex].classList.add(displayNone);
    vn.elements.attImageModals[noteIndex].classList.remove(displayBlock);
    vn.elements.attImageModals[noteIndex].classList.add(displayNone);
    vn.elements.attVideoModals[noteIndex].classList.remove(displayBlock);
    vn.elements.attVideoModals[noteIndex].classList.add(displayNone);
    vn.elements.helpModals[noteIndex].classList.remove(displayBlock);
    vn.elements.helpModals[noteIndex].classList.add(displayNone);
    
    //Initialize attachment link modal
    initAttLink(noteIndex);
    //Initialize attachment file modal
    initAttFile(noteIndex);
    //Initialize attachment image modal
    initAttImage(noteIndex);
};

/**
* openAttLinkModal
* @description Opens the attachment link modal for a specific note. It also handles closing all other modals,
* adjusting modal size, and setting focus based on whether the range is collapsed or not.
* @param {String or Number} noteIndex - The index of the note for which the attachment link modal should be opened.
*/
var openAttLinkModal = function(noteIndex: number) {
    // Restore the note size.
    doIncreaseTextareaHeight();
    
    // Close all modals
    closeAllModal(noteIndex);
    // Close all selects
    closeAllSelectBoxes(noteIndex);
    // Adjust modal size
    setAllModalSize(noteIndex);
    // Open modal background
    var displayBlock = getId(noteIndex, "on_display_block");
    var displayNone = getId(noteIndex, "on_display_none");
    vn.elements.backModals[noteIndex].classList.remove(displayNone);
    vn.elements.backModals[noteIndex].classList.add(displayBlock);
    vn.elements.attLinkModals[noteIndex].classList.remove(displayNone);
    vn.elements.attLinkModals[noteIndex].classList.add(displayBlock);
    
    if(!isValidSelection(noteIndex)) {
        validCheckAttLink(noteIndex);
        return;	
    }
    
    var attLinkText: any = vn.elements.attLinkTexts[noteIndex];
    var attLinkHref: any = vn.elements.attLinkHrefs[noteIndex];
    attLinkText.value = vn.variables.editRanges[noteIndex]!.toString();
    attLinkHref.value = "";
    
    if(!vn.variables.editRanges[noteIndex]!.collapsed) {
        attLinkText.setAttribute("readonly","true");
        attLinkHref.focus();
    }
    else {
        attLinkText.removeAttribute("readonly");
        attLinkText.focus();
    }
    
    validCheckAttLink(noteIndex);
};

/**
* openPlaceholder
* @description Opens the placeholder if it is visible and the associated textarea contains no text or a single character.
* @param {Number} noteIndex - The index of the note where the placeholder is located.
*/
var openPlaceholder = function(noteIndex: number) {
    if(vn.variables.placeholderIsVisible[noteIndex]
        && vn.elements.textareas[noteIndex].innerText.length <= 1
        && vn.elements.textareas[noteIndex].textContent!.length < 1
        && vn.elements.textareas[noteIndex].childNodes.length <= 1
        && vn.elements.textareas[noteIndex].childNodes[0]
        && vn.elements.textareas[noteIndex].childNodes[0].childNodes.length <= 1
        && vn.elements.textareas[noteIndex].childNodes[0].childNodes[0]
        && (vn.elements.textareas[noteIndex].childNodes[0].childNodes[0] as any).tagName === "BR"
    ) {
        vn.elements.placeholders[noteIndex].classList.remove(getId(noteIndex, "on_display_none"));
        vn.elements.placeholders[noteIndex].classList.add(getId(noteIndex, "on_display_block"));
    }
};

/**
* closePlaceholder
* @description Closes the placeholder if it is visible and the associated textarea contains no text or a single character.
* @param {Number} noteIndex - The index of the note where the placeholder is located.
*/
var closePlaceholder = function(noteIndex: number) {
    if(vn.variables.placeholderIsVisible[noteIndex]) {
        vn.elements.placeholders[noteIndex].classList.remove(getId(noteIndex, "on_display_block"));
        vn.elements.placeholders[noteIndex].classList.add(getId(noteIndex, "on_display_none"));
    }
};

/**
* setAllModalSize
* @description Controls the size of all modals. It adjusts the size of modals to match the height of the textarea. 
*              It uses setTimeout to adjust the height according to the textarea's dynamic size change.
* @param {Number} noteIndex - The index of the note where the modals are located.
*/
var setAllModalSize = function(noteIndex: number) {
    if(vn.elements.templates[noteIndex].offsetParent === null) return
    // Use setTimeout to adjust size according to the dynamic change in textarea's size.
    setTimeout(function() {
        vn.elements.backModals[noteIndex].style.width = vn.elements.templates[noteIndex].clientWidth + "px";
        vn.elements.backModals[noteIndex].style.height = vn.elements.templates[noteIndex].clientHeight + "px";
        vn.elements.attLinkModals[noteIndex].style.width = vn.elements.textareas[noteIndex].clientWidth*0.8 + "px"
        vn.elements.attLinkModals[noteIndex].style.marginTop = vn.elements.templates[noteIndex].clientHeight*0.1 + "px"
        vn.elements.attFileModals[noteIndex].style.width = vn.elements.textareas[noteIndex].clientWidth*0.8 + "px"
        vn.elements.attFileModals[noteIndex].style.marginTop = vn.elements.templates[noteIndex].clientHeight*0.1 + "px"
        vn.elements.attImageModals[noteIndex].style.width = vn.elements.textareas[noteIndex].clientWidth*0.8 + "px"
        vn.elements.attImageModals[noteIndex].style.marginTop = vn.elements.templates[noteIndex].clientHeight*0.1 + "px"
        vn.elements.attVideoModals[noteIndex].style.width = vn.elements.textareas[noteIndex].clientWidth*0.8 + "px"
        vn.elements.attVideoModals[noteIndex].style.marginTop = vn.elements.templates[noteIndex].clientHeight*0.1 + "px"
        vn.elements.helpModals[noteIndex].style.width = vn.elements.textareas[noteIndex].clientWidth*0.8 + "px"
        vn.elements.helpModals[noteIndex].style.marginTop = vn.elements.templates[noteIndex].clientHeight*0.1 + "px"
    },500);
};

/**
* setPlaceholderSize
* @description Controls the size and position of the placeholder for the specified note.
* @param {number} noteIndex - The index of the note for which to set the placeholder size.
*/
var setPlaceholderSize = function(noteIndex: number) {
    // Use setTimeout to adjust size according to the dynamic change in textarea's size.
    setTimeout(function() {
        if(!vn.variables.placeholderIsVisible[noteIndex]) return;
        closePlaceholder(noteIndex);
        if(vn.elements.textareas[noteIndex].offsetParent === null) return
        vn.elements.placeholders[noteIndex].style.top = (vn.elements.textareas[noteIndex].offsetTop + vn.variables.placeholderAddTop[noteIndex]) + "px";
        vn.elements.placeholders[noteIndex].style.left = (vn.elements.textareas[noteIndex].offsetLeft + vn.variables.placeholderAddLeft[noteIndex]) + "px";
        vn.elements.placeholders[noteIndex].style.width = vn.variables.placeholderWidth[noteIndex] ? vn.variables.placeholderWidth[noteIndex] : vn.elements.textareas[noteIndex].clientWidth + "px";
        openPlaceholder(noteIndex);
    },100);
};

/**
* setAllToolTipPosition
* @description Adjusts the position of tooltips based on the ToolPosition value for the specified note.
* @param {number} noteIndex - The index of the note for which to adjust tooltip positions.
*/
var setAllToolTipPosition = function(noteIndex: number) {
    if(vn.variables.ToolPosition[noteIndex] === "BOTTOM") {
        vn.elements.attLinkTooltips[noteIndex].style.bottom = vn.elements.tools[noteIndex].style.height;
        vn.elements.attImageAndVideoTooltips[noteIndex].style.bottom = vn.elements.tools[noteIndex].style.height;
    }
};


/**
* appearAttLinkToolTip
* @description Displays the tooltip for the selected <a> tag in the editor.
* @param {number} noteIndex - The index of the note in which the tooltip should appear.
*/
var appearAttLinkToolTip = function(noteIndex: number) {
    var a: any = vn.variables.editStartNodes[noteIndex]!.parentElement;

    var href = a.getAttribute("href");
    var download = a.getAttribute("download");

    var displayInlineBlock = getId(noteIndex, "on_display_inline_block");
    var displayNone = getId(noteIndex, "on_display_none");

    vn.elements.attLinkTooltipEditButtons[noteIndex].classList.remove(displayNone);
    vn.elements.attLinkTooltipUnlinkButtons[noteIndex].classList.remove(displayNone);
    vn.elements.attLinkTooltipEditButtons[noteIndex].classList.add(displayInlineBlock);
    vn.elements.attLinkTooltipUnlinkButtons[noteIndex].classList.add(displayInlineBlock);

    if(href) {
        vn.elements.attLinkTooltipHrefs[noteIndex].setAttribute("href",href);
        vn.elements.attLinkTooltipHrefs[noteIndex].textContent = href.length > 25 ? href.substr(0,25) + "..." : href;
    }
    if(download) {
        vn.elements.attLinkTooltipHrefs[noteIndex].setAttribute("download",download);
        vn.elements.attLinkTooltipHrefs[noteIndex].textContent = "download : " + download;

        vn.elements.attLinkTooltipEditButtons[noteIndex].classList.remove(displayInlineBlock);
        vn.elements.attLinkTooltipUnlinkButtons[noteIndex].classList.remove(displayInlineBlock);
        vn.elements.attLinkTooltipEditButtons[noteIndex].classList.add(displayNone);
        vn.elements.attLinkTooltipUnlinkButtons[noteIndex].classList.add(displayNone);
    }

    vn.elements.attLinkTooltips[noteIndex].style.opacity = "0.95";
    vn.elements.attLinkTooltips[noteIndex].style.height  = vn.variables.sizeRates[noteIndex] * 54 * 0.8 + "px";
    vn.elements.attLinkTooltips[noteIndex].style.lineHeight  = vn.variables.sizeRates[noteIndex] * 54 * 0.8 + "px";
};

/**
* appearAttImageAndVideoTooltip
* @description Displays the tooltip for the selected <img> or <iframe> tag in the editor.
* @param {number} noteIndex - The index of the note in which the tooltip should appear.
*/
var appearAttImageAndVideoTooltip = function(noteIndex: number) {
    var img = vn.variables.editStartNodes[noteIndex];
    var cssObj: any = getObjectFromCssText((getAttributesObjectFromElement(img) as any)["style"]);
    //width
    if(cssObj["width"]) {
        (vn.elements.attImageAndVideoTooltipWidthInputs[noteIndex] as any).value = extractNumber(cssObj["width"]);
    }
    //float
    switch(cssObj["float"]) {
    case "left":
        (vn.elements.attImageAndVideoTooltipFloatRadioLefts[noteIndex] as any).checked = true;
        break;
    case "right":
        (vn.elements.attImageAndVideoTooltipFloatRadioRights[noteIndex] as any).checked = true;
        break;
    default :
        (vn.elements.attImageAndVideoTooltipFloatRadioNones[noteIndex] as any).checked = true;
        break;
    }
    //shape
    (vn.elements.attImageAndVideoTooltipShapeRadioSquares[noteIndex] as any).checked = true;
    if(cssObj["border-radius"]) {
        var borderRadius: any = extractNumber(cssObj["border-radius"]);
        if(borderRadius > 0) {
            (vn.elements.attImageAndVideoTooltipShapeRadioRadiuses[noteIndex] as any).checked = true;
        }
        else if(borderRadius >= 50) {
            (vn.elements.attImageAndVideoTooltipShapeRadioCircles[noteIndex] as any).checked = true;
        }
    }
    
    vn.elements.attImageAndVideoTooltips[noteIndex].style.opacity = "0.9";
    vn.elements.attImageAndVideoTooltips[noteIndex].style.height  = vn.variables.sizeRates[noteIndex] * 54 * 0.8 * 2 + "px";
    vn.elements.attImageAndVideoTooltips[noteIndex].style.lineHeight  = vn.variables.sizeRates[noteIndex] * 54 * 0.7 + "px";
};

/**
* setImageAndVideoWidth
* @description Sets the width of an image or video (iframe) element based on the percentage value provided in the input element.
* @param {HTMLInputElement} el - The input element containing the width percentage value.
*/
var setImageAndVideoWidth = function(el: any) {
    if(!el.value) el.value = 100;
    var widthPer = el.value;
    var noteId = getNoteId(el);
    if(!noteIndex) return;
    var imgNode: any = vn.variables.editStartNodes[noteIndex];
    if(imgNode.tagName !== "IMG" && imgNode.tagName !== "IFRAME") return;
    
    if(widthPer < 10) widthPer = 10;
    if(widthPer > 100) widthPer = 100;
    el.value = widthPer;
    imgNode.style.width = widthPer + "%";
    (vn.variables.editStartNodes[noteIndex] as any).parentNode.replaceChild(imgNode, (vn.variables.editStartNodes[noteIndex] as any));
    vn.variables.editStartNodes[noteIndex] = imgNode;
};

/**
* setAllToolSize
* @description Adjusts the size of the toolbar based on certain conditions and element positions.
* @param {number} noteIndex - The index of the note (assumed to be a unique identifier).
*/
var setAllToolSize = function(noteIndex: number) {
    var toolButtons: any =  vn.elements.tools[noteIndex].childNodes;
    
    var displayInlineBlock = getId(noteIndex, "on_display_inline_block");
    var displayNone = getId(noteIndex, "on_display_none");
    
    // Display all buttons (reset their display style)
    for(var i = toolButtons.length - 1; i >= 0; i--) {
        toolButtons[i].classList.add(displayInlineBlock);
        toolButtons[i].classList.remove(displayNone);
    }
    
    if(vn.elements.tools[noteIndex].offsetParent === null) return;
    
    // Control toolbar size based on toggle state
    if(!vn.variables.toolToggles[noteIndex]) {	// Toggle false state: Resize the toolbar based on the last visible button.
        var toolAbsoluteTop;
        var lastButton;
        var lastButtonAbsoluteTop;
        var differ;
        
        for(var i = toolButtons.length - 1; i >= 0; i--) {
            if(toolButtons[i].offsetParent !== null) {	// Find the last visible button on the screen.
                lastButton = toolButtons[i];
                break;
            }
        }
        
        if(vn.elements.tools[noteIndex].offsetParent === null) return;
        toolAbsoluteTop = window.pageYOffset + vn.elements.tools[noteIndex].getBoundingClientRect().top;
        lastButtonAbsoluteTop = window.pageYOffset + lastButton.getBoundingClientRect().top;
        differ = lastButtonAbsoluteTop - toolAbsoluteTop + (vn.variables.sizeRates[noteIndex] * 52);
        
        vn.elements.tools[noteIndex].style.height = (differ) + "px";	// Set the height of the toolbar accordingly.
    }
    else {// Toggle true state: Keep the size to default lines and hide overflowing buttons.
        vn.elements.tools[noteIndex].style.height = (vn.variables.toolDefaultLines[noteIndex] * (vn.variables.sizeRates[noteIndex] * 52)) + "px";
        // Hide buttons that are not within the bounds of the toolbar.
        for(var i = toolButtons.length - 1; i >= 0; i--) {
            if(!isElementInParentBounds(vn.elements.tools[noteIndex],toolButtons[i])) {
                toolButtons[i].classList.remove(displayInlineBlock);
                toolButtons[i].classList.add(displayNone);
            }
        }
    }
};

/**
* initAttLink
* @description Initializes attLinkText, attLinkHref, and attLinkCheckbox in the specified note.
* @param {number} noteIndex - The index of the note where the elements need to be initialized.
*/
var initAttLink = function(noteIndex: number) {
    (vn.elements.attLinkTexts[noteIndex] as any).value = "";
    (vn.elements.attLinkHrefs[noteIndex] as any).value = "";
    (vn.elements.attLinkIsBlankCheckboxes[noteIndex] as any).checked = false;
};
