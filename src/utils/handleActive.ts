import type { Vanillanote, VanillanoteElement } from "../types/vanillanote";
import { setAttributesObjectToElement } from "./util";
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

export const getSpecialTag = (el: any) => {
    var element = el;
    var tagName = element.tagName;
    while(element && vn.consts.UNIT_TAG.indexOf(tagName) < 0) {
        if(vn.consts.SPECIAL_TAG.indexOf(tagName) >= 0) return tagName;
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

/**
* getEditElementTag
* @description Retrieves the tag name of the editing unit element.
* @param {Number} noteIndex - The index of the note.
* @returns {String} rtnTagName - The tag name of the editing unit element. If there are multiple different tag names, an empty string is returned.
*/
var getEditElementTag = function(noteIndex: number) {
    var rtnTagName = "";
    var tempTagName = "";
    for(var i = 0; i < vn.variables.editDragUnitElements[noteIndex].length; i++) {
        if((vn.variables.editDragUnitElements as any)[noteIndex][i].tagName === "LI") {
            tempTagName = (vn.variables.editDragUnitElements as any)[noteIndex][i].parentNode.tagName;
        }
        else {
            tempTagName = (vn.variables.editDragUnitElements as any)[noteIndex][i].tagName;
        }
        
        if(rtnTagName && rtnTagName !== tempTagName) {
            return "";
        }
        rtnTagName = tempTagName;
    }
    return rtnTagName;
};

/**
* getSpecialTag
* @description Checks if there are any parent elements of the editing element (up to the unit element) that contain a special tag (e.g., <a>, <img>, etc.).
* @param {Element} el - The element whose parent elements will be checked.
* @returns {String} tagName - The tag name of the first encountered special tag, or "SPAN" if none is found.
*/
var getSpecialTag = function(el: any) {
    var element = el;
    var tagName = element.tagName;
    while(element && vn.consts.UNIT_TAG.indexOf(tagName) < 0) {
        if(vn.consts.SPECIAL_TAG.indexOf(tagName) >= 0) return tagName;
        element = element.parentNode;
        if(!element) break;
        tagName = element.tagName;
    }
    return "SPAN";
};

/**
* getPreviousElementsUntilNotTag
* @description Retrieves the elements preceding the start element until an element with a different tag and attributes is encountered.
* @param {Element} startEl - The element from which to start retrieving the previous elements.
* @param {String} tag - The tag name to compare against while retrieving the previous elements.
* @returns {Array} previouses - An array containing the elements preceding the start element until a different tag and attributes are encountered.
*/
var getPreviousElementsUntilNotTag = function(startEl: any, tag: string) {
    var previouses = [];
    var previous = startEl;
    var attributes = getAttributesObjectFromElement(startEl);
    previouses.push(previous);
    
    while (previous) {
        while (previous.previousSibling) {
            previous = previous.previousSibling;
            if (previous.tagName && vn.consts.DOUBLE_TAG.indexOf(previous.tagName) > 0) {
                while(previous.lastChild) {
                    previous = previous.lastChild
                }
            }
            else if (previous.tagName && vn.consts.UNIT_TAG.indexOf(previous.tagName) > 0) {
                while(previous.lastChild) {
                    previous = previous.lastChild
                }
            }
            if(previous.nodeType === 3) previous = previous.parentNode;
            if (vn.consts.UNIT_TAG.indexOf(previous.tagName) > 0
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

/**
* getNextElementsUntilNotTag
* @description Retrieves the elements following the start element until an element with a different tag and attributes is encountered.
* @param {Element} startEl - The element from which to start retrieving the following elements.
* @param {String} tag - The tag name to compare against while retrieving the following elements.
* @returns {Array} nexts - An array containing the elements following the start element until a different tag and attributes are encountered.
*/
var getNextElementsUntilNotTag = function(startEl: any, tag: string) {
    var nexts = [];
    var next = startEl;
    var attributes = getAttributesObjectFromElement(startEl);
    nexts.push(next);
    
    while (next) {
        while (next.nextSibling) {
            next = next.nextSibling;
            if (next.tagName && vn.consts.DOUBLE_TAG.indexOf(next.tagName) > 0) {
                while(next.firstChild) {
                    next = next.firstChild
                }
            }
            else if (next.tagName && vn.consts.UNIT_TAG.indexOf(next.tagName) > 0) {
                while(next.firstChild) {
                    next = next.firstChild
                }
            }
            if(next.nodeType === 3) next = next.parentNode;
            if (vn.consts.UNIT_TAG.indexOf(next.tagName) > 0
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

/**
* setTagToggle
* @description Changes the note's tag variables based on the provided tag.
* @param {Number} noteIndex - The index of the note.
* @param {String} tag - The tag to set for the note.
*/
var setTagToggle = function(noteIndex: number, tag: string) {
    if(tag === "UL") {
        vn.variables.ulToggles[noteIndex] = true;
    }
    else {
        vn.variables.ulToggles[noteIndex] = false;
    }
    
    if(tag === "OL") {
        vn.variables.olToggles[noteIndex] = true;
    }
    else {
        vn.variables.olToggles[noteIndex] = false;
    }
};

/**
* initToggleButtonVariables
* @description Initializes the toggle button variables (Bold, Underline, Italic, Unordered List, Ordered List) for the note editor to false. Then, triggers the `button_onToggle` function for each of them to update their state.
* @param {number} noteIndex - The index of the note editor where the toggle buttons will be initialized.
*/
var initToggleButtonVariables = function(noteIndex: number) {
    vn.variables.boldToggles[noteIndex] = false;
    vn.variables.underlineToggles[noteIndex] = false;
    vn.variables.italicToggles[noteIndex] = false;
    vn.variables.ulToggles[noteIndex] = false;
    vn.variables.olToggles[noteIndex] = false;
    //format
    button_onToggle(vn.elements.boldButtons[noteIndex], vn.variables.boldToggles[noteIndex]);
    button_onToggle(vn.elements.underlineButtons[noteIndex], vn.variables.underlineToggles[noteIndex]);
    button_onToggle(vn.elements.italicButtons[noteIndex], vn.variables.italicToggles[noteIndex]);
    button_onToggle(vn.elements.ulButtons[noteIndex], vn.variables.ulToggles[noteIndex]);
    button_onToggle(vn.elements.olButtons[noteIndex], vn.variables.olToggles[noteIndex]);
    /*Do not toggle color, font family and font size, etc.
    //color
    vn.elements.colorTextSelects[noteIndex].querySelector("."+getEventChildrenClassName()).style.color = vn.colors.color12[noteIndex];
    vn.elements.colorBackSelects[noteIndex].querySelector("."+getEventChildrenClassName()).style.color = vn.colors.color13[noteIndex];
    //font family
    vn.elements.fontFamilySelects[noteIndex].firstChild.textContent = vn.variables.defaultStyles[noteIndex]["font-family"].length > 12 ? vn.variables.defaultStyles[noteIndex]["font-family"].substr(0,12) + "..." : vn.variables.defaultStyles[noteIndex]["font-family"];
    vn.elements.fontFamilySelects[noteIndex].style.fontFamily = vn.variables.defaultStyles[noteIndex]["font-family"];
    //size
    vn.elements.fontSizeInputs[noteIndex].value = vn.variables.defaultStyles[noteIndex]["font-size"];
    vn.elements.letterSpacingInputs[noteIndex].value = vn.variables.defaultStyles[noteIndex]["letter-spacing"];
    vn.elements.lineHeightInputs[noteIndex].value = vn.variables.defaultStyles[noteIndex]["line-height"];
    */
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

/**
* isInTextarea
* @description Checks if the current selection is within the textarea of the note.
* @returns {boolean} Returns true if the selection is within the textarea of the note, otherwise false.
*/
var isInTextarea = function() {
    var selection = window.getSelection();
    if (!selection || selection.rangeCount < 1) return false;
    
    var range = selection.getRangeAt(0);
    var textarea: any = range.startContainer.parentNode;
    var isTextarea = false;
    
    while(textarea) {
        if(textarea.tagName === (vn.variables.noteName+"-textarea").toUpperCase()) {
            isTextarea = true;
            break;
        }
        else {
            textarea = textarea.parentNode;
        }
    }
    return isTextarea;
};

/**
* getElementReplaceTag
* @description Replaces the tag of the given element and returns the new element.
* @param {Element} element - The element whose tag needs to be replaced.
* @param {string} tag - The new tag to be assigned to the element.
* @returns {Element} Returns the new element with the replaced tag.
*/
var getElementReplaceTag = function(element: any, tag: string) {
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

/**
* removeDoubleTag
* @description Removes the <ul> or <ol> tag and replaces it with <p> tags for each list item.
* @param {number} noteIndex - The index of the note.
* @param {Element} element - The element containing the <ul> or <ol> tag.
*/
var removeDoubleTag = function(noteIndex: number, element: any) {
    if(vn.consts.DOUBLE_TAG.indexOf(element.tagName) < 0) return;
    var tempEl;
    var childNodes = element.childNodes;
    for(var i = 0; i < childNodes.length; i++) {
        tempEl = getElementReplaceTag(childNodes[i], "P");
        element.insertAdjacentElement("beforebegin", tempEl);
        for(var j = 0; j < vn.variables.editDragUnitElements[noteIndex].length; j++) {
            if(vn.variables.editDragUnitElements[noteIndex][j] === childNodes[i]) {
                vn.variables.editDragUnitElements[noteIndex][j] = tempEl;
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

/**
* setEditNodeAndElement
* @description Prevents empty edit unit tags (p, h1, h2, li, etc.) from being replaced by the edit node when setElement is one of them. Compares setElement with the current edit elements saved in the noteIndex to update them if necessary.
* @param {number} noteIndex - The index of the note to be updated.
* @param {Element} setElement - The element to be set.
* @param {Element} compareElement - The element to compare with the current edit elements.
* @returns {boolean} - Returns true if at least one of the edit elements has changed; otherwise, returns false.
*/
var setEditNodeAndElement = function(noteIndex: number, setElement: any, compareElement: any) {
    var isChange = false;
    if(vn.variables.editStartNodes[noteIndex] === compareElement) {
        vn.variables.editStartNodes[noteIndex] = setElement;
        isChange = true;
    }
    if(vn.variables.editEndNodes[noteIndex] === compareElement) {
        vn.variables.editEndNodes[noteIndex] = setElement;
        isChange = true;
    }
    if(vn.variables.editStartElements[noteIndex] === compareElement) {
        vn.variables.editStartElements[noteIndex] = setElement;
        isChange = true;
    }
    if(vn.variables.editEndElements[noteIndex] === compareElement) {
        vn.variables.editEndElements[noteIndex] = setElement;
        isChange = true;
    }
    if(vn.variables.editStartUnitElements[noteIndex] === compareElement) {
        vn.variables.editStartUnitElements[noteIndex] = setElement;
        isChange = true;
    }
    if(vn.variables.editEndUnitElements[noteIndex] === compareElement) {
        vn.variables.editEndUnitElements[noteIndex] = setElement;
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
    editUnitCheck(vn.elements.textareas[noteIndex]);
    // Reconnect the observer.
    connectObserver();
}

/**
* connectObserver
* @description Connects the observer to all note textareas.
*/
var connectObserver = function() {
    for(var i = 0; i < vn.elements.textareas.length; i++) {
        elementsEvent["note_observer"].observe(vn.elements.textareas[i], vn.variables.observerOptions);
    }
};

/**
* isElementInParentBounds
* @description Checks whether a child element is fully contained within the bounds of its parent element.
* @param {HTMLElement} parent - The parent element.
* @param {HTMLElement} child - The child element to check.
* @returns {boolean} Returns true if the child element is fully contained within the bounds of its parent, otherwise false.
*/
var isElementInParentBounds = function(parent: any, child: any) {
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

/**
* validCheckAttLink
* @description Validates the link attachment in the specified note.
* @param {number} noteIndex - The index of the note where the link attachment needs to be validated.
*/
var validCheckAttLink = function(noteIndex: number) {
    if(!(vn.elements.attLinkTexts[noteIndex] as any).value) {
        (vn.elements.attLinkValidCheckboxes[noteIndex] as any).checked = false;
        vn.elements.attLinkValidCheckTexts[noteIndex].style.color = getHexColorFromColorName(vn.colors.color9[noteIndex]);
        vn.elements.attLinkValidCheckTexts[noteIndex].textContent = vn.languageSet[vn.variables.languages[noteIndex]].attLinkInTextTooltip;	//COMMENT
        return;
    }
    
    if(!(vn.elements.attLinkHrefs[noteIndex] as any).value) {
        (vn.elements.attLinkValidCheckboxes[noteIndex] as any).checked = false;
        vn.elements.attLinkValidCheckTexts[noteIndex].style.color = getHexColorFromColorName(vn.colors.color9[noteIndex]);
        vn.elements.attLinkValidCheckTexts[noteIndex].textContent = vn.languageSet[vn.variables.languages[noteIndex]].attLinkInLinkTooltip;	//COMMENT
        return;
    }
    
    (vn.elements.attLinkValidCheckboxes[noteIndex] as any).checked = true;
    vn.elements.attLinkValidCheckTexts[noteIndex].style.color = getHexColorFromColorName(vn.colors.color8[noteIndex]);
    vn.elements.attLinkValidCheckTexts[noteIndex].textContent = vn.languageSet[vn.variables.languages[noteIndex]].thanks;	//COMMENT
};

/**
* validCheckAttVideo
* @description Validates the video attachment in the specified note.
* @param {number} noteIndex - The index of the note where the video attachment needs to be validated.
*/
var validCheckAttVideo = function(noteIndex: number) {
    if(!(vn.elements.attVideoEmbedIds[noteIndex] as any).value) {
        (vn.elements.attVideoValidCheckboxes[noteIndex] as any).checked = false;
        vn.elements.attVideoValidCheckTexts[noteIndex].style.color = getHexColorFromColorName(vn.colors.color9[noteIndex]);
        vn.elements.attVideoValidCheckTexts[noteIndex].textContent = vn.languageSet[vn.variables.languages[noteIndex]].attVideoEmbedIdTooltip;	//COMMENT
        return;
    }
    
    (vn.elements.attVideoValidCheckboxes[noteIndex] as any).checked = true;
    vn.elements.attVideoValidCheckTexts[noteIndex].style.color = getHexColorFromColorName(vn.colors.color8[noteIndex]);
    vn.elements.attVideoValidCheckTexts[noteIndex].textContent = vn.languageSet[vn.variables.languages[noteIndex]].thanks;	//COMMENT
};

/**
* initAttFile
* @description Initializes the attTempFiles and attFileUploadDiv for the specified note.
* @param {number} noteIndex - The index of the note for which the attTempFiles and attFileUploadDiv need to be initialized.
*/
var initAttFile = function(noteIndex: number) {
    delete vn.variables.attTempFiles[noteIndex];
    (vn.variables.attTempFiles[noteIndex] as any) = new Object;
    vn.elements.attFileUploadDivs[noteIndex].replaceChildren();
    vn.elements.attFileUploadDivs[noteIndex].textContent = vn.languageSet[vn.variables.languages[noteIndex]].attFileUploadDiv;
    vn.elements.attFileUploadDivs[noteIndex].style.lineHeight = vn.variables.sizeRates[noteIndex] * 130 + "px";
    (vn.elements.attFileUploads[noteIndex] as any).value = "";
};

/**
* initAttImage
* @description Initializes the attTempImages, attImageUploadButtonAndViews, and attImageURLs for the specified note.
* @param {number} noteIndex - The index of the note for which the attTempImages, attImageUploadButtonAndViews, and attImageURLs need to be initialized.
*/
var initAttImage = function(noteIndex: number) {
    delete vn.variables.attTempImages[noteIndex];
    (vn.variables.attTempImages[noteIndex] as any) = new Object;
    vn.elements.attImageUploadButtonAndViews[noteIndex].replaceChildren();
    vn.elements.attImageUploadButtonAndViews[noteIndex].textContent = vn.languageSet[vn.variables.languages[noteIndex]].attImageUploadButtonAndView;
    (vn.elements.attImageUploads[noteIndex] as any).value = "";
    (vn.elements.attImageURLs[noteIndex] as any).value = "";
    vn.elements.attImageURLs[noteIndex].removeAttribute("readonly");
};

/**
* getObjectNoteCss
* @description Creates and returns a style object based on the note's style toggles.
* @param {Number} noteIndex - The index of the note.
* @returns {Object} cssObject - The style object representing the note's styles.
*/
var getObjectNoteCss = function(noteIndex: number) {
    var cssObject: any = new Object();
    
    if(vn.variables.boldToggles[noteIndex]) {
        cssObject["font-weight"] = "bold";
    }
    if(vn.variables.underlineToggles[noteIndex]){
        cssObject["text-decoration"] = "underline";
    }
    if(vn.variables.italicToggles[noteIndex]){
        cssObject["font-style"] = "italic";
    }
    cssObject["font-size"] = vn.variables.fontSizes[noteIndex] + "px";
    cssObject["line-height"] = vn.variables.lineHeights[noteIndex] + "px";
    // Add letter-spacing to the style object only if it's not 0
    if(vn.variables.letterSpacings[noteIndex] !== "0"){
        cssObject["letter-spacing"] = vn.variables.letterSpacings[noteIndex] + "px";
    }
    if(vn.variables.fontFamilies[noteIndex]){
        cssObject["font-family"] = vn.variables.fontFamilies[noteIndex];
    }
    // Add text color to the style object if it's different from the default color and opacity
    if(getHexColorFromColorName(vn.colors.color12[noteIndex]) !== vn.variables.colorTextRGBs[noteIndex]
        || vn.variables.colorTextOpacitys[noteIndex] !== "1") {
        cssObject["color"] = getRGBAFromHex(vn.variables.colorTextRGBs[noteIndex], vn.variables.colorTextOpacitys[noteIndex]);
    }
    // Add background color to the style object if it's different from the default color and opacity
    if(getHexColorFromColorName(vn.colors.color13[noteIndex]) !== vn.variables.colorBackRGBs[noteIndex]
        || vn.variables.colorBackOpacitys[noteIndex] !== "0") {
        cssObject["background-color"] = getRGBAFromHex(vn.variables.colorBackRGBs[noteIndex], vn.variables.colorBackOpacitys[noteIndex]);
    }
    
    return cssObject;
};
