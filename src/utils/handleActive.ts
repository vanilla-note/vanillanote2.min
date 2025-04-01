import { Consts } from "../types/consts";
import type { Vanillanote, VanillanoteElement } from "../types/vanillanote";
import { button_onToggle } from "./handleElement";
import { checkNumber, checkRealNumber, getCssTextFromObject, getHexColorFromColorName, getRGBAFromHex, setAttributesObjectToElement } from "./util";
import { compareObject, getObjectFromCssText } from "./utils";

/**
* onEventDisable
* @description This function temporarily disables user interaction for a specific note when an event occurs.
* @param {Vanillanote} vn - vanillanote object
* @param {Number} noteIndex - The index of the note for which the interaction should be disabled.
*/
export const onEventDisable = (vn: Vanillanote, type: string) => {
    var interval
    if(type === "resize") {
        interval = vn.variables.resizeInterval;
    }
    else {
        interval = vn.variables.inputInterval;
    }
    // Temporarily block user input
    vn.variables.canEvents = false;
    
    // Allow user input again after 0.05 seconds
    setTimeout(function() {
        vn.variables.canEvents = true;
    }, interval);
};

/**
* replaceDifferentBetweenElements
* @description This function compares two given elements and replaces any differences between them. 
*              If differences are found, it replaces the old element with the new one. 
*              The function iterates recursively through all child elements. 
*              Also, it resets the selection after the changes.
* @param {Vanillanote} vn - vanillanote object
* @param {Element} oldEl - The old HTML element.
* @param {Element} newEl - The new HTML element.
*/
export const replaceDifferentBetweenElements = (vn: Vanillanote, oldEl: any, newEl: any) => {
    var newStartNode: any;
    var newEndNode: any;
    var tempEl;
    
    // Compares the two elements and modifies the different parts.
    const replaceElements = (vn: Vanillanote, el1: any, el2: any) => {
        if (el1.tagName !== (vn.variables.noteName+"-textarea").toUpperCase()
            && el2.tagName !== (vn.variables.noteName+"-textarea").toUpperCase()
            && vn.consts.NOT_SINGLE_TAG.indexOf(el1.tagName) >= 0
            && vn.consts.NOT_SINGLE_TAG.indexOf(el2.tagName) >= 0
            && (el1.nodeType !== el2.nodeType || 
            el1.tagName !== el2.tagName ||
            !compareAttributesBetweenEl(el1, el2) ||
            !compareStylesBetweenEl(el1, el2))
            ) {
            tempEl = el2.cloneNode(true);
            (el1 as any).parentNode.replaceChild(tempEl, el1);
            if(!newStartNode) newStartNode = tempEl;
            newEndNode = tempEl;
        }
        else if (el1.tagName !== (vn.variables.noteName+"-textarea").toUpperCase()
            && el2.tagName !== (vn.variables.noteName+"-textarea").toUpperCase()
            && vn.consts.NOT_SINGLE_TAG.indexOf(el1.tagName) < 0
            && vn.consts.NOT_SINGLE_TAG.indexOf(el2.tagName) < 0
            && (el1.nodeType !== el2.nodeType || 
                el1.tagName !== el2.tagName ||
                el1.textContent !== el2.textContent ||
                !compareAttributesBetweenEl(el1, el2) ||
                !compareStylesBetweenEl(el1, el2))
            ) {
            tempEl = el2.cloneNode(true);
            (el1 as any).parentNode.replaceChild(tempEl, el1);
            if(!newStartNode) newStartNode = tempEl;
            newEndNode = tempEl;
        }
        else {
            var children1 = Array.prototype.slice.call(el1.childNodes);
            var children2 = Array.prototype.slice.call(el2.childNodes);
            
            // Iterates based on the element with more child elements among the two.
            var maxChildrenLength = Math.max(children1.length, children2.length);
            for(var i = 0; i < maxChildrenLength; i++) {
                var child1 = children1[i];
                var child2 = children2[i];
                
                if(!child1 && child2) { // Adds a child element that exists in el2 but not in el1.
                    tempEl = child2.cloneNode(true);
                    el1.appendChild(tempEl);
                    if(!newStartNode) newStartNode = tempEl;
                    newEndNode = tempEl;
                }
                else if(child1 && !child2) { // Removes a child element that exists in el1 but not in el2.
                    el1.removeChild(child1);
                }
                else { // Compares and replaces child elements that exist in both elements.
                    replaceElements(vn, child1, child2);
                }
            }
        }
    };
    //==========
    replaceElements(vn, oldEl, newEl);
    
    // Sets the new selection range.
    if(!newStartNode) return
    if(!newEndNode) newEndNode = newStartNode;
    var newEndOffset: any;
    if(newEndNode instanceof Element) {
        newEndOffset = newEndNode.childNodes.length;
    }
    else if(newEndNode.nodeType === 3){
        newEndOffset = newEndNode.textContent.length;
    }
    else {
        newEndOffset = 0;
    }
    // Sets the new selection range.
    setNewSelection(
            newStartNode,
            0,
            newEndNode,
            newEndOffset
            );
};

/**
* compareAttributesBetweenEl
* @description This function checks if the attributes of two HTML elements are the same.
* @param {HTMLElement} el1 - The first HTML element to compare.
* @param {HTMLElement} el2 - The second HTML element to compare.
* @returns {Boolean} Returns true if the attributes of both elements are the same, false otherwise.
*/
export const compareAttributesBetweenEl = (el1: any, el2: any) => {
    var attrs1 = getAttributesObjectFromElement(el1);
    var attrs2 = getAttributesObjectFromElement(el2);

    return compareObject(attrs1, attrs2);
};

/**
* compareStylesBetweenEl
* @description This function checks if the styles of two HTML elements are the same.
* @param {HTMLElement} el1 - The first HTML element to compare.
* @param {HTMLElement} el2 - The second HTML element to compare.
* @returns {Boolean} Returns true if the styles of both elements are the same, false otherwise.
*/
export const compareStylesBetweenEl = (el1: any, el2: any) => {
    var style1 = (el1 as any).cssText;
    var style2 = (el2 as any).cssText;
    
    return compareObject(getObjectFromCssText(style1), getObjectFromCssText(style2));
};

/**
* getAttributesObjectFromElement
* @description This function converts an element's attributes into an object.
* @param {HTMLElement} element - The HTML element whose attributes are to be converted.
* @returns {Object} Returns an object where each key-value pair represents an attribute of the element and its corresponding value.
*/
export const getAttributesObjectFromElement = (element: any) => {
    var attriesObject = new Object();
    if(!element.attributes) return attriesObject;
    
    for(var i = 0; i < element.attributes.length; i++) {
        (attriesObject as any)[element.attributes[i].nodeName] = element.attributes[i].nodeValue
    }
    return attriesObject;
};

export const getSpecialTag = (el: any, note: VanillanoteElement) => {
    var element = el;
    var tagName = element.tagName;
    while(element && note._vn.consts.UNIT_TAG.indexOf(tagName) < 0) {
        if(note._vn.consts.SPECIAL_TAG.indexOf(tagName) >= 0) return tagName;
        element = element.parentNode;
        if(!element) break;
        tagName = element.tagName;
    }
    return "SPAN";
};

export const getParentUnitTagElemnt = function(el: any, note: VanillanoteElement) {
    var element = el;
    while(element) {
        //p, h1, h2, h3, h4, h5, h6, li
        if(note._vn.consts.UNIT_TAG.indexOf(element.tagName) >= 0) {
            break;	
        }
        // If the element's tag name is  'ul' or 'ol'
        if(note._vn.consts.DOUBLE_TAG.indexOf(element.tagName) >= 0) {
            element = element.lastElementChild!;
            break;	
        }
        if(element.tagName === (note._noteName+"-textarea").toUpperCase()) {
            return null;
        }
        element = element.parentNode!;
    }
    return element;
};

export const getParentTagName = (el: any, note: VanillanoteElement) => {
    var tagName = "span";
    if(!el) return tagName;
    if(!el.parentNode) return tagName;
    if(!el.parentNode.tagName) return tagName;
    if(note._vn.consts.UNIT_TAG.indexOf(el.parentNode.tagName) >= 0) return tagName;
    if(note._vn.consts.AUTO_MODIFY_TAG.indexOf(el.parentNode.tagName) >= 0) return tagName;
    return el.parentNode.tagName;
};

export const getObjectEditElementAttributes = (el: any, note: VanillanoteElement) => {
    var attributesObject: any = getAttributesObjectFromElement(el); 
    // Helper function to check and add attributes from the element.
    var chkElementAttributes = function(element: any) {
        if(element.getAttribute) {
            var cssTempObject: any = getAttributesObjectFromElement(element);
            var cssTempObjectKeys = Object.keys(cssTempObject);
            for(var i = 0; i < cssTempObjectKeys.length; i++) {
                if(cssTempObject[cssTempObjectKeys[i]] && cssTempObjectKeys[i] !== "style" && !attributesObject[cssTempObjectKeys[i]]) { //Empty value property, style is not imported!, Existing inserted properties are not imported!
                    attributesObject[cssTempObjectKeys[i]] = cssTempObject[cssTempObjectKeys[i]];
                }
            }
        }
    }
    
    // Iterate up to the unit element (e.g., <p>, <h1>, <h2>, <h3>, <h4>, <h5>, <h6>, <li>) to retrieve its attributes and those of its ancestors.
    while(el) {
        //p, h1, h2, h3, h4, h5, h6, li
        if(note._vn.consts.UNIT_TAG.indexOf(el.tagName) >= 0) {
            break;
        }
        chkElementAttributes(el);
        el = el.parentNode;
    }
    return attributesObject;
};

export const getObjectEditElementCss = (el: any, note: VanillanoteElement) => {
    var cssObject: any = getObjectFromCssText(document.contains(el) && el.getAttribute ? el.getAttribute("style") : ""); 
    
    var chkElementStyle = function(element: any) {
        if(element.getAttribute) {
            var cssTempObject: any = getObjectFromCssText(element.getAttribute("style"));
            var cssTempObjectKeys = Object.keys(cssTempObject);
            for(var i = 0; i < cssTempObjectKeys.length; i++) {
                if(!cssObject[cssTempObjectKeys[i]]) cssObject[cssTempObjectKeys[i]] = cssTempObject[cssTempObjectKeys[i]];
            }
        }
    }
    
    // Iterate up to the unit element (e.g., <p>, <h1>, <h2>, <h3>, <h4>, <h5>, <h6>, <li>) to retrieve its attributes and those of its ancestors.
    while(el) {
        //p, h1, h2, h3, h4, h5, h6, li
        if(note._vn.consts.UNIT_TAG.indexOf(el.tagName) >= 0) {
            break;
        }
        switch(el.tagName) {
            case "B" :
                cssObject["font-weight"] = "bold";
                break;
            case "STRONG" :
                cssObject["font-weight"] = "bold";
                break;
            case "U" :
                cssObject["text-decoration"] = "underline";
                break;
            case "I" :
                cssObject["font-style"] = "italic";
                break;
            default :
                break;
        }
        chkElementStyle(el);
        el = el.parentNode;
    }
    return cssObject;
};

export const getEditElementTag = function(note: VanillanoteElement) {
    let rtnTagName = "";
    let tempTagName = "";
    for(let i = 0; i < note._selection.editDragUnitElement.length; i++) {
        if((note._selection.editDragUnitElement as any)[i].tagName === "LI") {
            tempTagName = (note._selection.editDragUnitElement as any)[i].parentNode.tagName;
        }
        else {
            tempTagName = (note._selection.editDragUnitElement as any)[i].tagName;
        }
        
        if(rtnTagName && rtnTagName !== tempTagName) {
            return "";
        }
        rtnTagName = tempTagName;
    }
    return rtnTagName;
};

export const getPreviousElementsUntilNotTag = (startEl: any, tag: string, consts: Consts) => {
    var previouses = [];
    var previous = startEl;
    var attributes = getAttributesObjectFromElement(startEl);
    previouses.push(previous);
    
    while (previous) {
        while (previous.previousSibling) {
            previous = previous.previousSibling;
            if (previous.tagName && consts.DOUBLE_TAG.indexOf(previous.tagName) > 0) {
                while(previous.lastChild) {
                    previous = previous.lastChild
                }
            }
            else if (previous.tagName && consts.UNIT_TAG.indexOf(previous.tagName) > 0) {
                while(previous.lastChild) {
                    previous = previous.lastChild
                }
            }
            if(previous.nodeType === 3) previous = previous.parentNode;
            if (consts.UNIT_TAG.indexOf(previous.tagName) > 0
                || !previous.tagName || previous.tagName !== tag.toUpperCase()
                || !compareObject(attributes, getAttributesObjectFromElement(previous))) {
                return previouses;
            }
            previouses.push(previous);
        }
        previous = previous.parentNode;
    }
    return previouses;
};

export const getNextElementsUntilNotTag = (startEl: any, tag: string, consts: Consts) => {
    var nexts = [];
    var next = startEl;
    var attributes = getAttributesObjectFromElement(startEl);
    nexts.push(next);
    
    while (next) {
        while (next.nextSibling) {
            next = next.nextSibling;
            if (next.tagName && consts.DOUBLE_TAG.indexOf(next.tagName) > 0) {
                while(next.firstChild) {
                    next = next.firstChild
                }
            }
            else if (next.tagName && consts.UNIT_TAG.indexOf(next.tagName) > 0) {
                while(next.firstChild) {
                    next = next.firstChild
                }
            }
            if(next.nodeType === 3) next = next.parentNode;
            if (consts.UNIT_TAG.indexOf(next.tagName) > 0
                || !next.tagName || next.tagName !== tag.toUpperCase()
                || !compareObject(attributes, getAttributesObjectFromElement(next))) {
                return nexts;
            }
            nexts.push(next);
        }
        next = next.parentNode;
    }
    return nexts;
};

export const setTagToggle = (note: VanillanoteElement, tag: string) => {
    if(tag === "UL") {
        note._status.ulToggle = true;
    }
    else {
        note._status.ulToggle = false;
    }
    
    if(tag === "OL") {
        note._status.olToggle = true;
    }
    else {
        note._status.olToggle = false;
    }
};

export const initToggleButtonVariables = (note: VanillanoteElement) => {
    note._status.boldToggle = false;
    note._status.underlineToggle = false;
    note._status.italicToggle = false;
    note._status.ulToggle = false;
    note._status.olToggle = false;
    //format
    button_onToggle(note._elements.boldButton, note._status.boldToggle);
    button_onToggle(note._elements.underlineButton, note._status.underlineToggle);
    button_onToggle(note._elements.italicButton, note._status.italicToggle);
    button_onToggle(note._elements.ulButton, note._status.ulToggle);
    button_onToggle(note._elements.olButton, note._status.olToggle);
};

/**
* isInNote
* @description Checks if the given element is a child of the note.
* @param {Element} el - The element to check.
* @returns {boolean} Returns true if the element is a child of the note, otherwise false.
*/
var isInNote = function(el: any) {
    while(el) {
        if(el && el instanceof Element && el.hasAttribute("data-vanillanote")) return true;
        el = el.parentNode;
    }
    return false;
};

export const getElementReplaceTag = (element: any, tag: string) => {
    var tempEl = document.createElement(tag);
    var childNodes = element.childNodes;
    var csses: any;
    var newCssText;
    while(childNodes[0]) {
        if(childNodes[0].getAttribute) {
            csses = getObjectFromCssText(childNodes[0].getAttribute("style"));
            if (tempEl && tempEl.tagName.substring(0, 1) === "H") {
                delete csses["font-size"];
                delete csses["letter-spacing"];
                delete csses["line-height"];
            }
            newCssText = getCssTextFromObject(csses);
        }
        if(newCssText && childNodes[0].setAttribute) {
            childNodes[0].setAttribute("style", newCssText);
        }
        tempEl.append(childNodes[0]);
    }
    // Copy element's attributes to the new element.
    tempEl = setAttributesObjectToElement(tempEl, (getAttributesObjectFromElement(element) as any));
    return tempEl;
};

export const removeDoubleTag = (note: VanillanoteElement, element: any) => {
    if(note._vn.consts.DOUBLE_TAG.indexOf(element.tagName) < 0) return;
    var tempEl;
    var childNodes = element.childNodes;
    for(var i = 0; i < childNodes.length; i++) {
        tempEl = getElementReplaceTag(childNodes[i], "P");
        element.insertAdjacentElement("beforebegin", tempEl);
        for(var j = 0; j < note._selection.editDragUnitElement.length; j++) {
            if(note._selection.editDragUnitElement[j] === childNodes[i]) {
                note._selection.editDragUnitElement[j] = tempEl;
                break;
            }
        }
    }
    element.remove();
};

export const getElement = (text: string, tagName: string, cssText: string, attributes: Record<string, string>, note: VanillanoteElement) => {
    text = text.replace(/<br\s*\/?>/gm, "\n");
    if(!tagName || note._vn.consts.UNIT_TAG.indexOf(tagName) >= 0 || note._vn.consts.AUTO_MODIFY_TAG.indexOf(tagName) >= 0) {
        tagName = "span"
    }
    var tempEl = document.createElement(tagName);
    tempEl.innerText = text;
    if(attributes) {
        tempEl = setAttributesObjectToElement(tempEl, attributes);
    }
    if(cssText) {
        tempEl.setAttribute("style",cssText);
    }
    
    return tempEl;
};

export const setEditNodeAndElement = (note: VanillanoteElement, setElement: any, compareElement: any) => {
    var isChange = false;
    if(note._selection.editStartNode === compareElement) {
        note._selection.editStartNode = setElement;
        isChange = true;
    }
    if(note._selection.editEndNode === compareElement) {
        note._selection.editEndNode = setElement;
        isChange = true;
    }
    if(note._selection.editStartElement === compareElement) {
        note._selection.editStartElement = setElement;
        isChange = true;
    }
    if(note._selection.editEndElement === compareElement) {
        note._selection.editEndElement = setElement;
        isChange = true;
    }
    if(note._selection.editStartUnitElement === compareElement) {
        note._selection.editStartUnitElement = setElement;
        isChange = true;
    }
    if(note._selection.editEndUnitElement === compareElement) {
        note._selection.editEndUnitElement = setElement;
        isChange = true;
    }
    return isChange;
};

export const removeEmptyElment = (el: any, note: VanillanoteElement) => {
    var childrens = el.querySelectorAll("*");
    for(var i = childrens.length - 1; i >= 0; i--) {
        if(!(childrens[i].hasChildNodes()) && note._vn.consts.EMPTY_ABLE_TAG.indexOf(childrens[i].tagName) < 0) {
            childrens[i].remove();
        }
    }
};

/**
* editUnitCheck
* @description Checks and surrounds elements that are not already within unit tags with a new unit tag in the editor.
* @param {Element} textarea - The textarea element representing the editor.
*/
var editUnitCheck = function(textarea: any) {
    var childrens = textarea.childNodes;
    var tempNewUnitElement = document.createElement("P");
    var removeElements = [];
    var isFirstToggle = true;
    for(var i = 0; i < childrens.length; i++) {
        // If the parent is not a unit tag or a double tag
        if(vn.consts.UNIT_TAG.indexOf(childrens[i].tagName) < 0 && vn.consts.DOUBLE_TAG.indexOf(childrens[i].tagName) < 0) {
            if(isFirstToggle) {
                textarea.insertBefore(tempNewUnitElement, childrens[i]);
                isFirstToggle = false;
            }
            else {
                tempNewUnitElement.append(childrens[i].cloneNode(true));
                removeElements.push(childrens[i]);
            }
        }
        else {
            tempNewUnitElement = document.createElement("P"); //init
            isFirstToggle = true;
        }
    }
    for(var i = 0; i < removeElements.length; i++) {
        removeElements[i].remove();
    }
};

/**
* doEditUnitCheck
* @description do editUnitCheck.
* @param {Element} textarea - The textarea element representing the editor.
*/
var doEditUnitCheck = function(noteIndex: number) {
    //Disconnect the observer.
    elementsEvent["note_observer"].disconnect();
    // In the editor, elements not surrounded by unit tags are recreated, wrapped with unit tags.
    editUnitCheck(note._elements.textareas[noteIndex]);
    // Reconnect the observer.
    connectObserver();
}

/**
* connectObserver
* @description Connects the observer to all note textareas.
*/
var connectObserver = function() {
    for(var i = 0; i < note._elements.textareas.length; i++) {
        elementsEvent["note_observer"].observe(note._elements.textareas[i], vn.variables.observerOptions);
    }
};

export const isElementInParentBounds = (parent: any, child: any) => {
    if(parent.offsetParent === null) return false;
    var parentRect = parent.getBoundingClientRect();
    
    if(child.offsetParent === null) return false;
    var childRect = child.getBoundingClientRect();

    var childAbsoluteTop = childRect.top + window.pageYOffset;
    var childAbsoluteBottom = childRect.bottom + window.pageYOffset;

    var parentAbsoluteTop = parentRect.top + window.pageYOffset;
    var parentAbsoluteBottom = parentRect.bottom + window.pageYOffset;

    return (
        childAbsoluteTop >= parentAbsoluteTop &&
        childAbsoluteBottom <= parentAbsoluteBottom
    );
};

export const validCheckAttLink = (note: VanillanoteElement) => {
    if(!(note._elements.attLinkText as any).value) {
        (note._elements.attLinkValidCheckbox as any).checked = false;
        note._elements.attLinkValidCheckText.style.color = getHexColorFromColorName(note._colors.color9);
        note._elements.attLinkValidCheckText.textContent = note._vn.languageSet[note._attributes.language].attLinkInTextTooltip;	//COMMENT
        return;
    }
    
    if(!(note._elements.attLinkHref as any).value) {
        (note._elements.attLinkValidCheckbox as any).checked = false;
        note._elements.attLinkValidCheckText.style.color = getHexColorFromColorName(note._colors.color9);
        note._elements.attLinkValidCheckText.textContent = note._vn.languageSet[note._attributes.language].attLinkInLinkTooltip;	//COMMENT
        return;
    }
    
    (note._elements.attLinkValidCheckbox as any).checked = true;
    note._elements.attLinkValidCheckText.style.color = getHexColorFromColorName(note._colors.color8);
    note._elements.attLinkValidCheckText.textContent = note._vn.languageSet[note._attributes.language].thanks;	//COMMENT
};

/**
* validCheckAttVideo
* @description Validates the video attachment in the specified note.
* @param {number} noteIndex - The index of the note where the video attachment needs to be validated.
*/
var validCheckAttVideo = function(noteIndex: number) {
    if(!(note._elements.attVideoEmbedIds[noteIndex] as any).value) {
        (note._elements.attVideoValidCheckboxes[noteIndex] as any).checked = false;
        note._elements.attVideoValidCheckTexts[noteIndex].style.color = getHexColorFromColorName(vn.colors.color9[noteIndex]);
        note._elements.attVideoValidCheckTexts[noteIndex].textContent = vn.languageSet[note._attributes.language].attVideoEmbedIdTooltip;	//COMMENT
        return;
    }
    
    (note._elements.attVideoValidCheckboxes[noteIndex] as any).checked = true;
    note._elements.attVideoValidCheckTexts[noteIndex].style.color = getHexColorFromColorName(vn.colors.color8[noteIndex]);
    note._elements.attVideoValidCheckTexts[noteIndex].textContent = vn.languageSet[note._attributes.language].thanks;	//COMMENT
};

export const initAttLink = (note: VanillanoteElement) => {
    note._elements.attLinkText.value = "";
    note._elements.attLinkHref.value = "";
    note._elements.attLinkIsBlankCheckbox.checked = false;
};

export const initAttFile = function(note: VanillanoteElement) {
    delete note._attTempFiles;
    note._attTempFiles = {};
    note._elements.attFileUploadDiv.replaceChildren();
    note._elements.attFileUploadDiv.textContent = note._vn.languageSet[note._attributes.language].attFileUploadDiv;
    note._elements.attFileUploadDiv.style.lineHeight = note._attributes.sizeRate * 130 + "px";
    note._elements.attFileUpload.value = "";
};

export const initAttImage = function(note: VanillanoteElement) {
    delete note._attTempImages;
    note._attTempImages = {};
    note._elements.attImageUploadButtonAndView.replaceChildren();
    note._elements.attImageUploadButtonAndView.textContent = note._vn.languageSet[note._attributes.language].attImageUploadButtonAndView;
    note._elements.attImageUpload.value = "";
    note._elements.attImageURL.value = "";
    note._elements.attImageURL.removeAttribute("readonly");
};

export const getObjectNoteCss = function(note: VanillanoteElement) {
    var cssObject: any = new Object();
    
    if(note._status.boldToggle) {
        cssObject["font-weight"] = "bold";
    }
    if(note._status.underlineToggle){
        cssObject["text-decoration"] = "underline";
    }
    if(note._status.italicToggle){
        cssObject["font-style"] = "italic";
    }
    cssObject["font-size"] = note._status.fontSize + "px";
    cssObject["line-height"] = note._status.lineHeight + "px";
    // Add letter-spacing to the style object only if it's not 0
    if(note._status.letterSpacing && checkRealNumber(note._status.letterSpacing)){
        cssObject["letter-spacing"] = note._status.letterSpacing + "px";
    }
    if(note._status.fontFamilie){
        cssObject["font-family"] = note._status.fontFamilie;
    }
    // Add text color to the style object if it's different from the default color and opacity
    if(getHexColorFromColorName(note._colors.color12) !== note._status.colorTextRGB
        || note._status.colorTextOpacity !== "1") {
        cssObject["color"] = getRGBAFromHex(note._status.colorTextRGB, note._status.colorTextOpacity);
    }
    // Add background color to the style object if it's different from the default color and opacity
    if(getHexColorFromColorName(note._colors.color13) !== note._status.colorBackRGB
        || note._status.colorBackOpacity !== "0") {
        cssObject["background-color"] = getRGBAFromHex(note._status.colorBackRGB, note._status.colorBackOpacity);
    }
    
    return cssObject;
};
