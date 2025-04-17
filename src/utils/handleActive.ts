import type { Vanillanote, VanillanoteElement } from "../types/vanillanote";
import type { Consts } from "../types/consts";
import type { Handler } from "../types/handler";
import { checkRealNumber, compareObject, getCssTextFromObject, getHexColorFromColorName, getObjectFromCssText, getRGBAFromHex, setAttributesObjectToElement } from "./util";

export const setHandleHandleActive = (vn: Vanillanote, handler: Handler) => {
    handler.onEventDisable = (vn: Vanillanote, type: string) => {
        let interval
        if(type === "resize") {
            interval = vn.variables.resizeInterval;
        }
        else {
            interval = vn.variables.inputInterval;
        }
        // Temporarily block user input
        vn.variables.canEvent = false;
        
        // Allow user input again after 0.05 seconds
        setTimeout(() => {
            vn.variables.canEvent = true;
        }, interval);
    };
    
    handler.replaceDifferentBetweenElements = (vn: Vanillanote, oldEl: any, newEl: any) => {
        let newStartNode: any;
        let newEndNode: any;
        let tempEl;
        
        // Compares the two elements and modifies the different parts.
        const replaceElements = (vn: Vanillanote, el1: any, el2: any) => {
            if (el1.tagName !== (vn.variables.noteName+"-textarea").toUpperCase()
                && el2.tagName !== (vn.variables.noteName+"-textarea").toUpperCase()
                && vn.consts.NOT_SINGLE_TAG.indexOf(el1.tagName) >= 0
                && vn.consts.NOT_SINGLE_TAG.indexOf(el2.tagName) >= 0
                && (el1.nodeType !== el2.nodeType || 
                el1.tagName !== el2.tagName ||
                !handler.compareAttributesBetweenEl(el1, el2) ||
                !handler.compareStylesBetweenEl(el1, el2))
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
                    !handler.compareAttributesBetweenEl(el1, el2) ||
                    !handler.compareStylesBetweenEl(el1, el2))
                ) {
                tempEl = el2.cloneNode(true);
                (el1 as any).parentNode.replaceChild(tempEl, el1);
                if(!newStartNode) newStartNode = tempEl;
                newEndNode = tempEl;
            }
            else {
                const children1 = Array.prototype.slice.call(el1.childNodes);
                const children2 = Array.prototype.slice.call(el2.childNodes);
                
                // Iterates based on the element with more child elements among the two.
                const maxChildrenLength = Math.max(children1.length, children2.length);
                for(let i = 0; i < maxChildrenLength; i++) {
                    const child1 = children1[i];
                    const child2 = children2[i];
                    
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
        let newEndOffset: any;
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
        handler.setNewSelection(
                newStartNode,
                0,
                newEndNode,
                newEndOffset
                );
    };
    
    handler.compareAttributesBetweenEl = (el1: any, el2: any) => {
        const attrs1 = handler.getAttributesObjectFromElement(el1);
        const attrs2 = handler.getAttributesObjectFromElement(el2);
    
        return compareObject(attrs1, attrs2);
    };
    
    handler.compareStylesBetweenEl = (el1: any, el2: any) => {
        const style1 = (el1 as any).cssText;
        const style2 = (el2 as any).cssText;
        
        return compareObject(getObjectFromCssText(style1), getObjectFromCssText(style2));
    };
    
    handler.getAttributesObjectFromElement = (element: any) => {
        const attriesObject = new Object();
        if(!element.attributes) return attriesObject;
        
        for(let i = 0; i < element.attributes.length; i++) {
            (attriesObject as any)[element.attributes[i].nodeName] = element.attributes[i].nodeValue
        }
        return attriesObject;
    };
    
    handler.getSpecialTag = (el: any, note: VanillanoteElement) => {
        let element = el;
        let tagName = element.tagName;
        while(element && vn.consts.UNIT_TAG.indexOf(tagName) < 0) {
            if(vn.consts.SPECIAL_TAG.indexOf(tagName) >= 0) return tagName;
            element = element.parentNode;
            if(!element) break;
            tagName = element.tagName;
        }
        return "SPAN";
    };
    
    handler.getParentUnitTagElemnt = (el: any, note: VanillanoteElement) => {
        let element = el;
        while(element) {
            //p, h1, h2, h3, h4, h5, h6, li
            if(vn.consts.UNIT_TAG.indexOf(element.tagName) >= 0) {
                break;	
            }
            // If the element's tag name is  'ul' or 'ol'
            if(vn.consts.DOUBLE_TAG.indexOf(element.tagName) >= 0) {
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
    
    handler.getParentTagName = (el: any, note: VanillanoteElement) => {
        const tagName = "span";
        if(!el) return tagName;
        if(!el.parentNode) return tagName;
        if(!el.parentNode.tagName) return tagName;
        if(vn.consts.UNIT_TAG.indexOf(el.parentNode.tagName) >= 0) return tagName;
        if(vn.consts.AUTO_MODIFY_TAG.indexOf(el.parentNode.tagName) >= 0) return tagName;
        return el.parentNode.tagName;
    };
    
    handler.getObjectEditElementAttributes = (el: any, note: VanillanoteElement) => {
        const attributesObject: any = handler.getAttributesObjectFromElement(el); 
        // Helper function to check and add attributes from the element.
        const chkElementAttributes = (element: any) => {
            if(element.getAttribute) {
                const cssTempObject: any = handler.getAttributesObjectFromElement(element);
                const cssTempObjectKeys = Object.keys(cssTempObject);
                for(let i = 0; i < cssTempObjectKeys.length; i++) {
                    if(cssTempObject[cssTempObjectKeys[i]] && cssTempObjectKeys[i] !== "style" && !attributesObject[cssTempObjectKeys[i]]) { //Empty value property, style is not imported!, Existing inserted properties are not imported!
                        attributesObject[cssTempObjectKeys[i]] = cssTempObject[cssTempObjectKeys[i]];
                    }
                }
            }
        }
        
        // Iterate up to the unit element (e.g., <p>, <h1>, <h2>, <h3>, <h4>, <h5>, <h6>, <li>) to retrieve its attributes and those of its ancestors.
        while(el) {
            //p, h1, h2, h3, h4, h5, h6, li
            if(vn.consts.UNIT_TAG.indexOf(el.tagName) >= 0) {
                break;
            }
            chkElementAttributes(el);
            el = el.parentNode;
        }
        return attributesObject;
    };
    
    handler.getObjectEditElementCss = (el: any, note: VanillanoteElement) => {
        const cssObject: any = getObjectFromCssText(document.contains(el) && el.getAttribute ? el.getAttribute("style") : ""); 
        
        const chkElementStyle = (element: any) => {
            if(element.getAttribute) {
                const cssTempObject: any = getObjectFromCssText(element.getAttribute("style"));
                const cssTempObjectKeys = Object.keys(cssTempObject);
                for(let i = 0; i < cssTempObjectKeys.length; i++) {
                    if(!cssObject[cssTempObjectKeys[i]]) cssObject[cssTempObjectKeys[i]] = cssTempObject[cssTempObjectKeys[i]];
                }
            }
        }
        
        // Iterate up to the unit element (e.g., <p>, <h1>, <h2>, <h3>, <h4>, <h5>, <h6>, <li>) to retrieve its attributes and those of its ancestors.
        while(el) {
            //p, h1, h2, h3, h4, h5, h6, li
            if(vn.consts.UNIT_TAG.indexOf(el.tagName) >= 0) {
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
    
    handler.getEditElementTag = (note: VanillanoteElement) => {
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
    
    handler.getPreviousElementsUntilNotTag = (startEl: any, tag: string, consts: Consts) => {
        const previouses = [];
        let previous = startEl;
        const attributes = handler.getAttributesObjectFromElement(startEl);
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
                    || !compareObject(attributes, handler.getAttributesObjectFromElement(previous))) {
                    return previouses;
                }
                previouses.push(previous);
            }
            previous = previous.parentNode;
        }
        return previouses;
    };
    
    handler.getNextElementsUntilNotTag = (startEl: any, tag: string, consts: Consts) => {
        const nexts = [];
        let next = startEl;
        const attributes = handler.getAttributesObjectFromElement(startEl);
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
                    || !compareObject(attributes, handler.getAttributesObjectFromElement(next))) {
                    return nexts;
                }
                nexts.push(next);
            }
            next = next.parentNode;
        }
        return nexts;
    };
    
    handler.setTagToggle = (note: VanillanoteElement, tag: string) => {
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
    
    handler.initToggleButtonVariables = (note: VanillanoteElement) => {
        note._status.boldToggle = false;
        note._status.underlineToggle = false;
        note._status.italicToggle = false;
        note._status.ulToggle = false;
        note._status.olToggle = false;
        //format
        handler.button_onToggle(note._elements.boldButton, note._status.boldToggle);
        handler.button_onToggle(note._elements.underlineButton, note._status.underlineToggle);
        handler.button_onToggle(note._elements.italicButton, note._status.italicToggle);
        handler.button_onToggle(note._elements.ulButton, note._status.ulToggle);
        handler.button_onToggle(note._elements.olButton, note._status.olToggle);
    };
    
    handler.isInNote = (el: any) => {
        while(el) {
            if(el && el instanceof Element && el.hasAttribute("data-vanillanote")) return true;
            el = el.parentNode;
        }
        return false;
    };
    
    handler.getElementReplaceTag = (element: any, tag: string) => {
        let tempEl = document.createElement(tag);
        const childNodes = element.childNodes;
        let csses: any;
        let newCssText;
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
        tempEl = setAttributesObjectToElement(tempEl, (handler.getAttributesObjectFromElement(element) as any));
        return tempEl;
    };
    
    handler.removeDoubleTag = (note: VanillanoteElement, element: any) => {
        if(vn.consts.DOUBLE_TAG.indexOf(element.tagName) < 0) return;
        let tempEl;
        const childNodes = element.childNodes;
        for(let i = 0; i < childNodes.length; i++) {
            tempEl = handler.getElementReplaceTag(childNodes[i], "P");
            element.insertAdjacentElement("beforebegin", tempEl);
            for(let j = 0; j < note._selection.editDragUnitElement.length; j++) {
                if(note._selection.editDragUnitElement[j] === childNodes[i]) {
                    note._selection.editDragUnitElement[j] = tempEl;
                    break;
                }
            }
        }
        element.remove();
    };
    
    handler.getElement = (text: string, tagName: string, cssText: string, attributes: Record<string, string>, note: VanillanoteElement) => {
        text = text.replace(/<br\s*\/?>/gm, "\n");
        if(!tagName || vn.consts.UNIT_TAG.indexOf(tagName) >= 0 || vn.consts.AUTO_MODIFY_TAG.indexOf(tagName) >= 0) {
            tagName = "span"
        }
        let tempEl = document.createElement(tagName);
        tempEl.innerText = text;
        if(attributes) {
            tempEl = setAttributesObjectToElement(tempEl, attributes);
        }
        if(cssText) {
            tempEl.setAttribute("style",cssText);
        }
        
        return tempEl;
    };
    
    handler.setEditNodeAndElement = (note: VanillanoteElement, setElement: any, compareElement: any) => {
        let isChange = false;
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
    
    handler.removeEmptyElment = (el: any, note: VanillanoteElement) => {
        const childrens = el.querySelectorAll("*");
        for(let i = childrens.length - 1; i >= 0; i--) {
            if(!(childrens[i].hasChildNodes()) && vn.consts.EMPTY_ABLE_TAG.indexOf(childrens[i].tagName) < 0) {
                childrens[i].remove();
            }
        }
    };
    
    const editUnitCheck = (note: VanillanoteElement) => {
        const textarea = note._elements.textarea;
        const childrens: any = textarea.childNodes;
        let tempNewUnitElement = document.createElement("P");
        const removeElements = [];
        let isFirstToggle = true;
        for(let i = 0; i < childrens.length; i++) {
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
        for(let i = 0; i < removeElements.length; i++) {
            removeElements[i].remove();
        }
    };
    
    handler.doEditUnitCheck = (note: VanillanoteElement) => {
        //Disconnect the observer.
        vn.events.documentEvents.noteObserver!.disconnect();
        // In the editor, elements not surrounded by unit tags are recreated, wrapped with unit tags.
        editUnitCheck(note);
        // Reconnect the observer.
        handler.connectObserver(vn);
    };
    
    handler.connectObserver = (vn: Vanillanote) => {
        Object.keys(vn.vanillanoteElements).forEach((id) => {
            vn.events.documentEvents.noteObserver!.observe(vn.vanillanoteElements[id]._elements.textarea, vn.variables.observerOptions);
        });
    };
    
    handler.isElementInParentBounds = (parent: any, child: any) => {
        if(parent.offsetParent === null) return false;
        const parentRect = parent.getBoundingClientRect();
        
        if(child.offsetParent === null) return false;
        const childRect = child.getBoundingClientRect();
    
        const childAbsoluteTop = childRect.top + window.pageYOffset;
        const childAbsoluteBottom = childRect.bottom + window.pageYOffset;
    
        const parentAbsoluteTop = parentRect.top + window.pageYOffset;
        const parentAbsoluteBottom = parentRect.bottom + window.pageYOffset;
    
        return (
            childAbsoluteTop >= parentAbsoluteTop &&
            childAbsoluteBottom <= parentAbsoluteBottom
        );
    };
    
    handler.validCheckAttLink = (note: VanillanoteElement) => {
        if(!(note._elements.attLinkText as any).value) {
            (note._elements.attLinkValidCheckbox as any).checked = false;
            note._elements.attLinkValidCheckText.style.color = getHexColorFromColorName(note._colors.color9);
            note._elements.attLinkValidCheckText.textContent = vn.languageSet[note._attributes.language].attLinkInTextTooltip;
            return;
        }
        
        if(!(note._elements.attLinkHref as any).value) {
            (note._elements.attLinkValidCheckbox as any).checked = false;
            note._elements.attLinkValidCheckText.style.color = getHexColorFromColorName(note._colors.color9);
            note._elements.attLinkValidCheckText.textContent = vn.languageSet[note._attributes.language].attLinkInLinkTooltip;
            return;
        }
        
        (note._elements.attLinkValidCheckbox as any).checked = true;
        note._elements.attLinkValidCheckText.style.color = getHexColorFromColorName(note._colors.color8);
        note._elements.attLinkValidCheckText.textContent = vn.languageSet[note._attributes.language].thanks;
    };
    
    handler.validCheckAttVideo = (note: VanillanoteElement) => {
        if(!(note._elements.attVideoEmbedId as any).value) {
            (note._elements.attVideoValidCheckbox as any).checked = false;
            note._elements.attVideoValidCheckText.style.color = getHexColorFromColorName(note._colors.color9);
            note._elements.attVideoValidCheckText.textContent = vn.languageSet[note._attributes.language].attVideoEmbedIdTooltip;
            return;
        }
        
        (note._elements.attVideoValidCheckbox as any).checked = true;
        note._elements.attVideoValidCheckText.style.color = getHexColorFromColorName(note._colors.color8);
        note._elements.attVideoValidCheckText.textContent = vn.languageSet[note._attributes.language].thanks;
    };
    
    handler.initAttLink = (note: VanillanoteElement) => {
        note._elements.attLinkText.value = "";
        note._elements.attLinkHref.value = "";
        note._elements.attLinkIsBlankCheckbox.checked = false;
    };
    
    handler.initAttFile = (note: VanillanoteElement) => {
        delete note._attTempFiles;
        note._attTempFiles = {};
        note._elements.attFileUploadDiv.replaceChildren();
        note._elements.attFileUploadDiv.textContent = vn.languageSet[note._attributes.language].attFileUploadDiv;
        note._elements.attFileUploadDiv.style.lineHeight = note._attributes.sizeRate * 130 + "px";
        note._elements.attFileUpload.value = "";
    };
    
    handler.initAttImage = (note: VanillanoteElement) => {
        delete note._attTempImages;
        note._attTempImages = {};
        note._elements.attImageUploadButtonAndView.replaceChildren();
        note._elements.attImageUploadButtonAndView.textContent = vn.languageSet[note._attributes.language].attImageUploadButtonAndView;
        note._elements.attImageUpload.value = "";
        note._elements.attImageURL.value = "";
        note._elements.attImageURL.removeAttribute("readonly");
    };
    
    handler.getObjectNoteCss = (note: VanillanoteElement) => {
        const cssObject: any = new Object();
        
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
        if(note._status.fontFamily){
            cssObject["font-family"] = note._status.fontFamily;
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
    
    handler.showAlert = (message: string, beforeAlert: ((message: string) => boolean)) => {
        if(!beforeAlert(message)) return;
        alert(message);
    };
    
    handler.recodeNote = (note: VanillanoteElement) => {
        // Does not record more than the recodeLimit number.
        if(note._recodes.recodeNotes.length >= note._recodes.recodeLimit) {
            note._recodes.recodeNotes.shift();
            note._recodes.recodeNotes.push(note._elements.textarea.cloneNode(true));
        }
        else {
            note._recodes.recodeCount = note._recodes.recodeCount + 1;
            // If a new change occurs in the middle of undoing, subsequent recodes are deleted.
            if(note._recodes.recodeCount < note._recodes.recodeNotes.length) {
                note._recodes.recodeNotes.splice(note._recodes.recodeCount);
            }
            note._recodes.recodeNotes.push(note._elements.textarea.cloneNode(true));
        }
    };
}
