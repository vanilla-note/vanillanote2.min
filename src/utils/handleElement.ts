import { ToolPosition } from "../types/enums";
import { Vanillanote, VanillanoteConfig, VanillanoteElement } from "../types/vanillanote";
import { getEditElementTag, getObjectEditElementCss, initAttFile, initAttImage, initAttLink, initToggleButtonVariables, isElementInParentBounds, setTagToggle, validCheckAttLink } from "./handleActive";
import { isValidSelection } from "./handleSelection";
import { checkNumber, compareObject, extractNumber, extractUnit, getEventChildrenClassName, getHexColorFromColorName, getHexFromRGBA, getId, getObjectFromCssText, getOpacityFromRGBA, getParentNote, getRGBAFromHex, isCloserToRight } from "./util";

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

export const setVariableButtonTogle = (note: VanillanoteElement, cssObject: Record<string, string>) => {
    //bold
    if(cssObject["font-weight"] === "bold") {
        note._status.boldToggle = true;
    }
    else {
        note._status.boldToggle = false;
    }
    //underline
    if(cssObject["text-decoration"] === "underline" || cssObject["text-decoration-line"] === "underline") {
        note._status.underlineToggle = true;
    }
    else {
        note._status.underlineToggle = false;
    }
    //italic
    if(cssObject["font-style"] === "italic") {
        note._status.italicToggle = true;
    }
    else {
        note._status.italicToggle = false;
    }
    //color
    if(cssObject["color"]) {
        note._status.colorTextRGB = getHexFromRGBA(cssObject["color"])!;
        note._status.colorTextOpacity = getOpacityFromRGBA(cssObject["color"])!;
        // If color is not in rgba format, use the default color and opacity
        if(!note._status.colorTextRGB) {
            note._status.colorTextRGB = getHexColorFromColorName(note._colors.color12);
            note._status.colorTextOpacity = "1";
        }
        else {
            // If opacity is not present in rgba format, use 1 as default opacity
            if(!note._status.colorTextOpacity) {
                if(cssObject["opacity"]) {
                    note._status.colorTextOpacity = cssObject["opacity"];
                }
                else {
                    note._status.colorTextOpacity = "1";
                }
            }
        }
        
    }
    else {
        note._status.colorTextRGB = getHexColorFromColorName(note._colors.color12);
        note._status.colorTextOpacity = "1";
    }
    //background color
    if(cssObject["background-color"]) {
        note._status.colorBackRGB = getHexFromRGBA(cssObject["background-color"])!;
        note._status.colorBackOpacity = getOpacityFromRGBA(cssObject["background-color"])!;
        // If background-color is not in rgba format, use the default color and opacity
        if(!note._status.colorTextRGB) {
            note._status.colorTextRGB = getHexColorFromColorName(note._colors.color12);
            note._status.colorTextOpacity = "1";
        }
        else {
            // If opacity is not present in rgba format, use 0 as default opacity
            if(!note._status.colorBackOpacity) {
                if(cssObject["opacity"]) {
                    note._status.colorBackOpacity = cssObject["opacity"];
                }
                else {
                    note._status.colorBackOpacity = "0";
                }
            }
        }
    }
    else {
        note._status.colorBackRGB = getHexColorFromColorName(note._colors.color13);
        note._status.colorBackOpacity = "0";
    }
};

export const button_onToggle = function(target: any, toggle: boolean) {
    const note = getParentNote(target);
    if(!note) return;
    // If a child element is selected, event is controlled
    if(target.classList.contains(getEventChildrenClassName(note._noteName))) {
        target = target.parentNode;
    }
    if(toggle) {
        target.classList.add(getId(note._noteName, note._id, "on_button_on"));
    } else {
        target.classList.remove(getId(note._noteName, note._id, "on_button_on"));
    }
};

/**
* allButtonToggle
* @description Toggles all buttons of a specific note.
* @param {number} noteIndex - The index of the note whose buttons need to be toggled.
*/
var allButtonToggle = function(note: VanillanoteElement) {
    //format
    button_onToggle(note._elements.boldButton, note._status.boldToggle);
    button_onToggle(note._elements.underlineButton, note._status.underlineToggle);
    button_onToggle(note._elements.italicButton, note._status.italicToggle);
    button_onToggle(note._elements.ulButton, note._status.ulToggle);
    button_onToggle(note._elements.olButton, note._status.olToggle);
    //color
    (note._elements.colorTextSelect as any).querySelector("."+getEventChildrenClassName(note._noteName)).style.color
    = getRGBAFromHex(note._status.colorTextRGB, note._status.colorTextOpacity === "0" ? "1" : note._status.colorTextOpacity);
    (note._elements.colorBackSelect as any).querySelector("."+getEventChildrenClassName(note._noteName)).style.color
    = getRGBAFromHex(note._status.colorBackRGB, note._status.colorBackOpacity === "0" ? "1" : note._status.colorBackOpacity);
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
        
        if(note._elements.tool.offsetParent === null) return;
        var toolRect = note._elements.tool.getBoundingClientRect();
        
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
        
        if(note._elements.tool.offsetParent === null) return;
        var toolRect = note._elements.tool.getBoundingClientRect();
        
        if(toolRect.right < selectBoxRect.right) {
            selectBox.style.left = toolRect.right - (selectBoxRect.right + 1) + "px";
        }
    }
};

export const closeAllSelectBoxes = (note: VanillanoteElement) => {
    var displayBlock = getId(note._noteName, note._id, "on_display_block");
    var displayNone = getId(note._noteName, note._id, "on_display_none");
    
    note._elements.paragraphStyleSelectBox.classList.remove(displayBlock);
    note._elements.paragraphStyleSelectBox.classList.add(displayNone);
    note._elements.textAlignSelectBox.classList.remove(displayBlock);
    note._elements.textAlignSelectBox.classList.add(displayNone);
    note._elements.fontFamilySelectBox.classList.remove(displayBlock);
    note._elements.fontFamilySelectBox.classList.add(displayNone);
    note._elements.colorTextSelectBox.classList.remove(displayBlock);
    note._elements.colorTextSelectBox.classList.add(displayNone);
    note._elements.colorBackSelectBox.classList.remove(displayBlock);
    note._elements.colorBackSelectBox.classList.add(displayNone);
};

export const fontFamilySelectList_onClick = (e: any, _note?: VanillanoteElement) => {
    if(!e.target) return;
    const selectLsit = e.target;
    const note = _note ? _note : getParentNote(e.target);
    const fontFamily = selectLsit.getAttribute("data-font-family");
    var oldStyleObject: any = getObjectFromCssText(note._elements.fontFamilySelect.getAttribute("style")!);
    oldStyleObject["font-family"] = fontFamily;
    // Change the font family in the variables and the displayed select list option.
    note._status.fontFamilies = fontFamily;
    (note._elements.fontFamilySelect as any).firstChild.textContent = fontFamily.length > 12 ? fontFamily.substr(0,12) + "..." : fontFamily;
    (note._elements.fontFamilySelect as any).style.fontFamily = fontFamily;
};

export const setEditStyleTag = (note: VanillanoteElement) => {
    if(note._selection.setEditStyleTagToggle > 0) {
        note._selection.setEditStyleTagToggle--;
        return;
    }
    var tempEl: any = note._selection.editStartUnitElement;
    var textarea = tempEl;
    while(tempEl) {
        if(tempEl.tagName === (note._noteName+"-textarea").toUpperCase()) {
            textarea = tempEl;
            break;
        }
        tempEl = tempEl.parentNode;
    }
    if(!textarea) {
        Object.keys(note._vn.vanillanoteElements).forEach((id) => {
            initToggleButtonVariables(note._vn.vanillanoteElements[id]);
        });
        return;
    }
    
    // Get styles of the selected element
    var cssObjectEl = getObjectEditElementCss(note._selection.editStartElement, note);
    // If multiple elements are selected, check if all tags have the same styles
    // If not, clear the cssObjectEl
    if(note._selection.editStartNode !== note._selection.editEndNode) {
        var tempCssObjectEl = cssObjectEl;
        var isCheck = false;
        var isEnd = false;
        var getCheckAllStyle = function(element: any) {
            for(var i = 0; i < element.childNodes.length; i++) {
                if(isEnd) break;
                if(note._selection.editStartNode === element.childNodes[i]) {
                    isCheck = true;
                }
                if(isCheck && element.childNodes[i].nodeType === 3 && element.childNodes[i].textContent) {
                    tempCssObjectEl = getObjectEditElementCss(element.childNodes[i], note);
                }
                if(!compareObject(cssObjectEl, tempCssObjectEl)) {
                    cssObjectEl = {};
                    isEnd = true;
                }
                if(note._selection.editEndNode === element.childNodes[i]) {
                    isEnd = true;
                }
                if(element.childNodes[i].childNodes) {
                    getCheckAllStyle(element.childNodes[i]);
                }
            }
        };
        for(let i = 0; i < note._selection.editDragUnitElement.length; i++) {
            getCheckAllStyle(note._selection.editDragUnitElement[i]);
        }
    }
    // Change the note's style variables
    setVariableButtonTogle(note, cssObjectEl);
    // Get the current selected tag
    const nowTag = getEditElementTag(note);
    // Change the note's tag variables (toggle)
    setTagToggle(note, nowTag);
    // Toggle buttons for the note
    allButtonToggle(note);
};

export const setElementScroll = (parentElement: any, childElement: any) => {
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

export const getCheckSelectBoxesOpened = (note: VanillanoteElement) => {
    var displayBlock = getId(note._noteName, note._id, "on_display_block");
    
    if(note._elements.paragraphStyleSelectBox.classList.contains(displayBlock)) return true;
    if(note._elements.textAlignSelectBox.classList.contains(displayBlock)) return true;
    if(note._elements.fontFamilySelectBox.classList.contains(displayBlock)) return true;
    if(note._elements.colorTextSelectBox.classList.contains(displayBlock)) return true;
    if(note._elements.colorBackSelectBox.classList.contains(displayBlock)) return true;
    
    return false;
};

export const closeAllModal = (note: VanillanoteElement) => {
    var displayBlock = getId(note._noteName, note._id, "on_display_block");
    var displayNone = getId(note._noteName, note._id, "on_display_none");
    
    note._elements.modalBack.classList.remove(displayBlock);
    note._elements.modalBack.classList.add(displayNone);
    note._elements.attLinkModal.classList.remove(displayBlock);
    note._elements.attLinkModal.classList.add(displayNone);
    note._elements.attFileModal.classList.remove(displayBlock);
    note._elements.attFileModal.classList.add(displayNone);
    note._elements.attImageModal.classList.remove(displayBlock);
    note._elements.attImageModal.classList.add(displayNone);
    note._elements.attVideoModal.classList.remove(displayBlock);
    note._elements.attVideoModal.classList.add(displayNone);
    note._elements.helpModal.classList.remove(displayBlock);
    note._elements.helpModal.classList.add(displayNone);
    
    //Initialize attachment link modal
    initAttLink(note);
    //Initialize attachment file modal
    initAttFile(note);
    //Initialize attachment image modal
    initAttImage(note);
};

export const openAttLinkModal = (note: VanillanoteElement) => {
    // Restore the note size.
    doIncreaseTextareaHeight(note._vn);
    
    // Close all modals
    closeAllModal(note);
    // Close all selects
    closeAllSelectBoxes(note);
    // Adjust modal size
    setAllModalSize(note);
    // Open modal background
    var displayBlock = getId(note._noteName, note._id, "on_display_block");
    var displayNone = getId(note._noteName, note._id, "on_display_none");
    note._elements.modalBack.classList.remove(displayNone);
    note._elements.modalBack.classList.add(displayBlock);
    note._elements.attLinkModal.classList.remove(displayNone);
    note._elements.attLinkModal.classList.add(displayBlock);
    
    if(!isValidSelection(note)) {
        validCheckAttLink(note);
        return;	
    }
    
    var attLinkText: any = note._elements.attLinkText;
    var attLinkHref: any = note._elements.attLinkHref;
    attLinkText.value = note._selection.editRange!.toString();
    attLinkHref.value = "";
    
    if(!note._selection.editRange!.collapsed) {
        attLinkText.setAttribute("readonly","true");
        attLinkHref.focus();
    }
    else {
        attLinkText.removeAttribute("readonly");
        attLinkText.focus();
    }
    
    validCheckAttLink(note);
};

var openPlaceholder = function(note: VanillanoteElement) {
    if(note._attributes.placeholderIsVisible
        && note._elements.textarea.innerText.length <= 1
        && note._elements.textarea.textContent!.length < 1
        && note._elements.textarea.childNodes.length <= 1
        && note._elements.textarea.childNodes[0]
        && note._elements.textarea.childNodes[0].childNodes.length <= 1
        && note._elements.textarea.childNodes[0].childNodes[0]
        && (note._elements.textarea.childNodes[0].childNodes[0] as any).tagName === "BR"
    ) {
        note._elements.placeholder.classList.remove(getId(note._noteName, note._id, "on_display_none"));
        note._elements.placeholder.classList.add(getId(note._noteName, note._id, "on_display_block"));
    }
};

export const closePlaceholder = (note: VanillanoteElement) => {
    if(note._attributes.placeholderIsVisible) {
        note._elements.placeholder.classList.remove(getId(note._noteName, note._id, "on_display_block"));
        note._elements.placeholder.classList.add(getId(note._noteName, note._id, "on_display_none"));
    }
};

export const setAllModalSize = (note: VanillanoteElement) => {
    if(note._elements.template.offsetParent === null) return
    // Use setTimeout to adjust size according to the dynamic change in textarea's size.
    setTimeout(function() {
        note._elements.modalBack.style.width = note._elements.template.clientWidth + "px";
        note._elements.modalBack.style.height = note._elements.template.clientHeight + "px";
        note._elements.attLinkModal.style.width = note._elements.textarea.clientWidth*0.8 + "px"
        note._elements.attLinkModal.style.marginTop = note._elements.template.clientHeight*0.1 + "px"
        note._elements.attFileModal.style.width = note._elements.textarea.clientWidth*0.8 + "px"
        note._elements.attFileModal.style.marginTop = note._elements.template.clientHeight*0.1 + "px"
        note._elements.attImageModal.style.width = note._elements.textarea.clientWidth*0.8 + "px"
        note._elements.attImageModal.style.marginTop = note._elements.template.clientHeight*0.1 + "px"
        note._elements.attVideoModal.style.width = note._elements.textarea.clientWidth*0.8 + "px"
        note._elements.attVideoModal.style.marginTop = note._elements.template.clientHeight*0.1 + "px"
        note._elements.helpModal.style.width = note._elements.textarea.clientWidth*0.8 + "px"
        note._elements.helpModal.style.marginTop = note._elements.template.clientHeight*0.1 + "px"
    },500);
};

export const setPlaceholderSize = (note: VanillanoteElement) => {
    // Use setTimeout to adjust size according to the dynamic change in textarea's size.
    setTimeout(function() {
        if(!note._attributes.placeholderIsVisible) return;
        closePlaceholder(note);
        if(note._elements.textarea.offsetParent === null) return
        note._elements.placeholder.style.top = (note._elements.textarea.offsetTop + note._attributes.placeholderAddTop) + "px";
        note._elements.placeholder.style.left = (note._elements.textarea.offsetLeft + note._attributes.placeholderAddLeft) + "px";
        note._elements.placeholder.style.width = note._attributes.placeholderWidth ? note._attributes.placeholderWidth : note._elements.textarea.clientWidth + "px";
        openPlaceholder(note);
    },100);
};

export const setAllToolTipPosition = (note: VanillanoteElement) => {
    if(note._attributes.toolPosition === ToolPosition.bottom) {
        note._elements.attLinkTooltip.style.bottom = note._elements.tool.style.height;
        note._elements.attImageAndVideoTooltip.style.bottom = note._elements.tool.style.height;
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

export const setAllToolSize = (note: VanillanoteElement) => {
    var toolButtons: any =  note._elements.tool.childNodes;
    
    var displayInlineBlock = getId(note._noteName, note.id, "on_display_inline_block");
    var displayNone = getId(note._noteName, note.id, "on_display_none");
    
    // Display all buttons (reset their display style)
    for(var i = toolButtons.length - 1; i >= 0; i--) {
        toolButtons[i].classList.add(displayInlineBlock);
        toolButtons[i].classList.remove(displayNone);
    }
    
    if(note._elements.tool.offsetParent === null) return;
    
    // Control toolbar size based on toggle state
    if(!note._status.toolToggle) {	// Toggle false state: Resize the toolbar based on the last visible button.
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
        
        if(note._elements.tool.offsetParent === null) return;
        toolAbsoluteTop = window.pageYOffset + note._elements.tool.getBoundingClientRect().top;
        lastButtonAbsoluteTop = window.pageYOffset + lastButton.getBoundingClientRect().top;
        differ = lastButtonAbsoluteTop - toolAbsoluteTop + (note._attributes.sizeRate * 52);
        
        note._elements.tool.style.height = (differ) + "px";	// Set the height of the toolbar accordingly.
    }
    else {// Toggle true state: Keep the size to default lines and hide overflowing buttons.
        note._elements.tool.style.height = (note._attributes.toolDefaultLine * (note._attributes.sizeRate * 52)) + "px";
        // Hide buttons that are not within the bounds of the toolbar.
        for(var i = toolButtons.length - 1; i >= 0; i--) {
            if(!isElementInParentBounds(note._elements.tool,toolButtons[i])) {
                toolButtons[i].classList.remove(displayInlineBlock);
                toolButtons[i].classList.add(displayNone);
            }
        }
    }
};

export const doDecreaseTextareaHeight = (note: VanillanoteElement) => {
    // Stop if not in auto-scroll mode.
    if(!note._attributes.isNoteByMobile) return;
    note._elements.textarea.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
    });
    setTimeout(function() {
        if(extractUnit(note._attributes.textareaOriginHeight) !== 'px') return;
        if(note._vn.variables.mobileKeyboardExceptHeight! < extractNumber(note._attributes.textareaOriginHeight)!
            && note._vn.variables.mobileKeyboardExceptHeight! < note._elements.textarea.offsetHeight) {
            note._elements.textarea.style.height = note._vn.variables.mobileKeyboardExceptHeight + "px";
        }
    }, 100);
};

export const doIncreaseTextareaHeight = (vn: Vanillanote) => {
    const noteIds = Object.keys(vn.vanillanoteElements);
    // Restore the note size.
    for(var i = 0; i < noteIds.length; i++) {
        const note = vn.vanillanoteElements[noteIds[i]]
        if(!note._attributes.isNoteByMobile) continue;
        note._elements.textarea.style.height = note._attributes.textareaOriginHeight;
    }
};

export const modifyTextareaScroll = function(textarea: any, note: VanillanoteElement) {
    // Stop if not in auto-scroll mode.
    if(!note._attributes.isNoteByMobile) return;
    
    if(note._vn.variables.preventChangeScroll > 0) {
        note._vn.variables.preventChangeScroll--;
        return;	
    }
    if(note._vn.variables.isSelectionProgress) return;
    note._vn.variables.isSelectionProgress = true;
    // 0.05 seconds time out.
    setTimeout(function() {
        note._vn.variables.isSelectionProgress = false;
        
        //If there is unvalid selection, return.
        if(!isValidSelection(note)) return;
        
        // The number of the middle element from the currently dragged elements.
        const indexMiddleUnit = checkNumber(note._selection.editDragUnitElement.length / 2) ?
        note._selection.editDragUnitElement.length / 2 - 1 : Math.floor(note._selection.editDragUnitElement.length / 2);
        // The total height of the currently dragged elements.
        const heightSumDragUnitElements = (note._selection.editDragUnitElement as any)[(note._selection.editDragUnitElement as any).length - 1].offsetTop
        - (note._selection.editDragUnitElement as any)[0].offsetTop
        + (note._selection.editDragUnitElement as any)[(note._selection.editDragUnitElement as any).length - 1].offsetHeight;
        // If the total height of the currently dragged elements is larger than the current textarea's height, do not scroll. (With a margin of about 30px).
        if(heightSumDragUnitElements > textarea.offsetHeight - 30) return;
        // If any select box is open, do not scroll.
        if(getCheckSelectBoxesOpened(note)) return;
        if((note._selection.editRange as any).collapsed) {
            setElementScroll(textarea, note._selection.editStartElement);
        }
        else {
            setElementScroll(textarea, note._selection.editDragUnitElement[indexMiddleUnit]);
        }
                
    }, 50);
}

export const initTextarea = (textarea: HTMLTextAreaElement) =>  {
    // Remove all existing child elements of the textarea.
    while(textarea.firstChild) {
        textarea.removeChild(textarea.firstChild);
    }
    var tempEl1 = document.createElement("P");
    var tempEl2 = document.createElement("BR");
    tempEl1.appendChild(tempEl2);
    textarea.appendChild(tempEl1);
    // Sets the new selection range.
    setNewSelection(tempEl1, 0, tempEl1, 0);
};
