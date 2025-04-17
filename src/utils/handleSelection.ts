import type { Vanillanote, VanillanoteElement } from "../types/vanillanote";
import type { Handler } from "../types/handler";
import { compareObject, getCssTextFromObject, getObjectFromCssText, getParentNote, mergeObjects, setAttributesObjectToElement } from "./util";

export const setHandleHandleSelection = (vn: Vanillanote, handler: Handler) => {
    handler.setNewSelection = (startNode: Node, startOffset: number, endNode: Node, endOffset: number) => {
        if(!document.contains(startNode) || !document.contains(endNode)) {
            return;
        }
        const newRange = document.createRange();
        const newSelection = window.getSelection();
        newRange.setStart(startNode, startOffset);
        newRange.setEnd(endNode, endOffset);
        newSelection!.removeAllRanges();
        newSelection!.addRange(newRange);
        
        return newSelection;
    };
    
    handler.handleSpecialTagSelection = (note: VanillanoteElement) => {
        handler.closeAllTooltip(note);
        if(!note._selection.editRange!.collapsed) return;
        const tagName = handler.getSpecialTag(note._selection.editStartNode, note);
        
        switch(tagName) {
            case "A":
                handler.appearAttLinkToolTip(note);
                break;
            case "IMG":
                handler.appearAttImageAndVideoTooltip(note);
                break;
            case "IFRAME":
                handler.appearAttImageAndVideoTooltip(note);
                break;
            default :
                return;
                break;
        }
    };
    
    handler.setOriginEditSelection = (note: VanillanoteElement) => {
        if(note._selection.editRange) {
            note._selection.setEditStyleTagToggle = 2;	// The 'selectiononchange' event usually occurs twice (once when removed and once when added back).
            const selection = window.getSelection();
            selection!.removeAllRanges();
            selection!.addRange(note._selection.editRange);
        }
    };
    
    handler.setEditSelection = (note: VanillanoteElement, selection: Selection) => {
        const isInTextarea = (noteName: string) => {
            const selection = window.getSelection();
            if (!selection || selection.rangeCount < 1) return false;
            
            const range = selection.getRangeAt(0);
            let textarea: any = range.startContainer.parentNode;
            let isTextarea = false;
            
            while(textarea) {
                if(textarea.tagName === (noteName+"-textarea").toUpperCase()) {
                    isTextarea = true;
                    break;
                }
                else {
                    textarea = textarea.parentNode;
                }
            }
            return isTextarea;
        };
    
        // If the selection range count is less than 1 or not within a textarea, return false.
        if(selection.rangeCount < 1) return false;
        if(!isInTextarea(note._noteName)) return false;
        
        note._selection.editSelection = selection;
        note._selection.editRange = note._selection.editSelection.getRangeAt(0);
        
        note._selection.startOffset = note._selection.editRange.startOffset;
        note._selection.endOffset = note._selection.editRange.endOffset;
        
        note._selection.editStartNode = note._selection.editRange.startContainer;
        note._selection.editEndNode = note._selection.editRange.endContainer;
        
        // If the start node is an element, find the first text node within the element.
        if(note._selection.editStartNode instanceof Element) {
            while(note._selection.editStartNode instanceof Element) {
                if(!note._selection.editStartNode.firstChild) break;
                if((note._selection.editStartNode as any).firstChild.tagName === "BR") break;	//no br
                note._selection.editStartNode = note._selection.editStartNode.firstChild;
                if(note._selection.editStartNode.nodeType === 3) break;
            }
            note._selection.startOffset = 0;
        }
        // If the end node is an element, find the first text node within the element.
        if(note._selection.editEndNode instanceof Element) {
            while(note._selection.editEndNode instanceof Element) {
                if(!note._selection.editEndNode.firstChild) break;
                if((note._selection.editEndNode as any).firstChild.tagName === "BR") break;	//no br
                note._selection.editEndNode = note._selection.editEndNode.firstChild;
                if(note._selection.editEndNode.nodeType === 3) break;
            }
            note._selection.endOffset = 0;
        }
        
        note._selection.editStartElement = note._selection.editRange.startContainer instanceof Element ?
                                                    note._selection.editRange.startContainer : note._selection.editRange.startContainer.parentNode;
        note._selection.editEndElement = note._selection.editRange.endContainer instanceof Element ?
                                                    note._selection.editRange.endContainer : note._selection.editRange.endContainer.parentNode;
        
        // If the start element is a unit element, find the deepest child unit element.
        if(vn.consts.UNIT_TAG.indexOf((note._selection.editStartElement as any).tagName) > 0) {
            while(vn.consts.UNIT_TAG.indexOf((note._selection.editStartElement as any).tagName) > 0) {
                note._selection.editStartElement = (note._selection.editStartElement as any).firstChild;
            }
        }
        // If the end element is a unit element, find the deepest child unit element.
        if(vn.consts.UNIT_TAG.indexOf((note._selection.editEndElement as any).tagName) > 0) {
            while(vn.consts.UNIT_TAG.indexOf((note._selection.editEndElement as any).tagName) > 0) {
                note._selection.editEndElement = (note._selection.editEndElement as any).lastChild;
            }
        }
        // If the start element is a <br> tag, update it to the parent node.
        if(note._selection.editStartElement instanceof Element &&
                note._selection.editStartElement.tagName === "BR") {
            note._selection.editStartElement = note._selection.editStartElement.parentNode;
        }
        // If the end element is a <br> tag, update it to the parent node.
        if(note._selection.editEndElement instanceof Element &&
                note._selection.editEndElement.tagName === "BR") {
            note._selection.editEndElement = note._selection.editEndElement.parentNode;
        }
        //If the start element is textarea, be start element to null
        if((note._selection.editStartElement as any).tagName === (note._noteName+"-textarea").toUpperCase()) {
            note._selection.editStartElement = null;
        }
        //If the end element is textarea, be end element to null
        if((note._selection.editEndElement as any).tagName === (note._noteName+"-textarea").toUpperCase()) {
            note._selection.editEndElement = null;
        }
        // Get the parent unit elements of the start and end elements.
        note._selection.editStartUnitElement = handler.getParentUnitTagElemnt(note._selection.editStartElement, note);
        note._selection.editEndUnitElement = handler.getParentUnitTagElemnt(note._selection.editEndElement, note);
        // Clear and populate the array with all unit elements within the selection.
        note._selection.editDragUnitElement.splice(0, note._selection.editDragUnitElement.length); //initial array
        
        const dragElements = handler.modifySeletedElements(note);
        let unitElement
        for(let i = 0; i < dragElements.length; i++) {
            unitElement = handler.getParentUnitTagElemnt(dragElements[i], note);
            if(note._selection.editDragUnitElement.includes(unitElement)) continue;
            note._selection.editDragUnitElement.push(unitElement);
        }
        // Set style and tag based on the selected elements.
        handler.setEditStyleTag(note);
        
        // Perform additional actions based on the selected element's tag.
        handler.handleSpecialTagSelection(note);
        
        return true;
    };
    
    handler.isValidSelection = (note: VanillanoteElement) => {
        if(!note._selection.editRange) return false;
        if(!note._selection.editStartElement) return false;
        if(!note._selection.editStartUnitElement) return false;
        return true;
    };
    
    handler.modifySeletedElements = (note: VanillanoteElement) => {
        let isEnd = false;
        let element = note._selection.editStartNode;
        const selectedNodes: any[] = [];
        if(!note._selection.editStartUnitElement || !note._selection.editEndUnitElement) return selectedNodes;
        
        let lastNode = note._selection.editEndUnitElement.lastChild;
        while(lastNode) {
            if(!lastNode.lastChild) break;
            lastNode = lastNode.lastChild;
        }
        
        // Recursive function to get all child nodes
        const getChildNodes = (node: any) => {
            if(node === lastNode) {
                selectedNodes.push(node);
                isEnd = true;
            }
            if(isEnd) return;
            if(vn.consts.UNIT_TAG.indexOf(node.tagName) >= 0
                || vn.consts.EMPTY_ABLE_TAG.indexOf(node.tagName) >= 0
                || node.nodeType === 3) {
                selectedNodes.push(node);
            }
            
            if(node && node.childNodes && node.childNodes.length) {
                for (let i = 0; i < node.childNodes.length; i++) {
                    getChildNodes(node.childNodes[i]);	// Recursive call
                }
            }
        }
        // Get all sibling nodes
        while(element) {
            if(isEnd) break;
            getChildNodes(element);
            if(element.nextSibling) {
                element = element.nextSibling;
            }
            else {
                while(element && !element.nextSibling) {
                    element = element.parentNode;
                }
                if(element) element = element.nextSibling;
            }
        }
        return selectedNodes;
    };
    
    handler.modifySelectedUnitElementTag = (target: any, _note?: VanillanoteElement) => {
        const note = _note ? _note : getParentNote(target);
        if(!note) return;
        if(!handler.isValidSelection(note)) return;
        const tag = target.getAttribute("data-tag-name")
        let tempEl;
        
        if(vn.consts.DOUBLE_TAG.indexOf(tag) >= 0) { // ul or ol
            const tempDoubleElement = document.createElement(tag);
            for(let i = 0; i < note._selection.editDragUnitElement.length; i++) {
                if((note._selection.editDragUnitElement as any)[i].tagName === "LI") {
                    // Remove ul or ol tag
                    handler.removeDoubleTag(note, (note._selection.editDragUnitElement as any)[i].parentNode);
                }
                if(tag === "UL" && note._status.ulToggle) {
                    break;
                }
                if(tag === "OL" && note._status.olToggle) {
                    break;
                }
                // Recreate ul or ol tag
                if(i === 0) {
                    (note._selection.editDragUnitElement as any)[0].insertAdjacentElement("beforebegin", tempDoubleElement);
                }
                tempEl = handler.getElementReplaceTag(note._selection.editDragUnitElement[i], "LI");
                // Prevents the edit Node from being replaced with a unit tag when there's an empty edit unit tag (p, h1, h2, li, etc.).
                handler.setEditNodeAndElement(note, tempEl, note._selection.editDragUnitElement[i]);
                
                (note._selection.editDragUnitElement as any)[i].remove();
                note._selection.editDragUnitElement[i] = tempEl;
                tempDoubleElement.append(tempEl);
            }
        } else {
            for(let i = 0; i < note._selection.editDragUnitElement.length; i++) {
                if((note._selection.editDragUnitElement as any)[i].tagName === "LI") {
                    // Remove ul or ol tag
                    handler.removeDoubleTag(note, (note._selection.editDragUnitElement as any)[i].parentNode);
                }
                // Create new tag
                tempEl = handler.getElementReplaceTag(note._selection.editDragUnitElement[i], tag);
                
                // Prevents the edit Node from being replaced with a unit tag when there's an empty edit unit tag (p, h1, h2, li, etc.).
                handler.setEditNodeAndElement(note, tempEl, note._selection.editDragUnitElement[i]);
                
                (note._selection.editDragUnitElement as any)[i].replaceWith(tempEl);
                note._selection.editDragUnitElement[i] = tempEl;
            }
        }
        
        // Sets the new selection range.
        let newStartOffset = 0
        const newEndOffset = note._selection.editEndElement ? (note._selection.editEndElement as any).textContent.length : 0
        if(note._selection.editStartElement === note._selection.editEndElement) {
            newStartOffset = newEndOffset;
        }
        // Sets the new selection range.
        handler.setNewSelection(
                note._selection.editStartNode!,
                newStartOffset,
                note._selection.editEndNode!,
                newEndOffset
                );
    };
    
    handler.modifySelectedUnitElementStyle = (target: any, _note?: VanillanoteElement) => {
        const note = _note ? _note : getParentNote(target);
        if(!note) return;
        if(!handler.isValidSelection(note)) return;
        
        const tagCssText = target.getAttribute("data-tag-style");
        let nowCssText;
        let newCssText;
        const tagCssObject = getObjectFromCssText(tagCssText);
        let nowCssObject;
        let tempEl
        
        for(let i = 0; i < note._selection.editDragUnitElement.length; i++) {
            nowCssText = (note._selection.editDragUnitElement as any)[i].getAttribute("style");
            // Convert style text to an object
            nowCssObject = getObjectFromCssText(nowCssText);
            
            // Merge the style objects and than Convert the style object back to text
            newCssText = getCssTextFromObject(mergeObjects(nowCssObject, tagCssObject));
            
            // Perform mutation to trigger the changes by removing and recreating the element
            tempEl = (note._selection.editDragUnitElement as any)[i].cloneNode(true);
            tempEl.setAttribute("style",newCssText);
            (note._selection.editDragUnitElement as any)[i].parentNode.replaceChild(tempEl, (note._selection.editDragUnitElement as any)[i]);
            note._selection.editDragUnitElement[i] = tempEl;
        }
        
        // Sets the new selection range.
        const newStartOffset = 0
        const newEndOffset = (note._selection.editEndElement as any).childNodes ? (note._selection.editEndElement as any).childNodes.length : 0
        // Sets the new selection range.
        handler.setNewSelection(
                (note._selection.editDragUnitElement as any)[0],
                0,
                (note._selection.editDragUnitElement as any)[note._selection.editDragUnitElement.length - 1],
                1
                );
    };
    
    handler.modifySelectedSingleElement = (note: VanillanoteElement, csses: Record<string, string> | null, tagName?: string, attributes?: Record<string, string>) => {
        if(!handler.isValidSelection(note)) return;
        let tempEl, tempUnitEl;
        let newTagName, newCssText, newAttributes;
        let selectedNodes, newStartNode, newEndNode, newEndOffset;
        
        if(!csses) {
            newCssText = "";
        }
        else {
            newCssText = getCssTextFromObject(csses);
        }
        if(!tagName) {
            newTagName = "";
        }
        else {
            newTagName = tagName;
        }
        if(!attributes) {
            newAttributes = null;
        }
        else {
            newAttributes = attributes;
        }
        // SelectedNodes is an array containing all the selected elements and text nodes.
        selectedNodes = handler.modifySeletedElements(note);
        
        // Text content before the starting node of the selection.
        const sS =(note._selection.editStartNode as any).textContent.slice(0,note._selection.startOffset);
        // Text content after the starting node of the selection.
        let sE =(note._selection.editStartNode as any).textContent.slice(note._selection.startOffset,note._selection.editStartNode!.textContent!.length);
        // Text content before the ending node of the selection.
        const eS = (note._selection.editEndNode as any).textContent.slice(0,note._selection.endOffset);
        // Text content after the ending node of the selection.
        const eE = (note._selection.editEndNode as any).textContent.slice(note._selection.endOffset,note._selection.editEndNode!.textContent!.length);
        
        // An internal function used for inserting nodes.
        const insertSelectedNode = (tempEl: any, tempUnitEl: any) => {
            if(!tempEl) return;
            if(tempUnitEl) {
                tempUnitEl.insertBefore(tempEl, null);
            }
            else {
                (note._selection.editStartUnitElement as any).insertBefore(tempEl, null);
            }
        }
        // A condition indicating that the end node of the selection has been reached.
        let isEnd = false;
        // A check to determine if the starting node and ending node of the selection are the same.
        const isStartNodeEqualEndNode = note._selection.editStartNode === note._selection.editEndNode;
        for(let i = 0; i < selectedNodes.length; i++) {
            if(selectedNodes[i].nodeType === 3) {	// A comment indicating that the subsequent code handles text nodes in the selection.
                if(!attributes) newAttributes = handler.getObjectEditElementAttributes(selectedNodes[i], note);	// If no attributes are provided for the new element, use the existing attributes of the node being replaced.
                if(!tagName) newTagName = handler.getSpecialTag(selectedNodes[i], note);	// If no tag name is provided for the new element, use the existing tag name of the node being replaced.
                if(!csses) newCssText = getCssTextFromObject(handler.getObjectEditElementCss(selectedNodes[i], note));	// If no style is provided for the new element, use the existing style of the node being replaced.
                
                // An exception for headers where the font size should be ignored.
                tempEl = handler.getParentUnitTagElemnt(selectedNodes[i], note);
                if (tempEl && tempEl.tagName.substring(0, 1) === "H") {
                    csses = (getObjectFromCssText(newCssText) as Record<string, string>);
                    delete csses["font-size"];
                    delete csses["letter-spacing"];
                    delete csses["line-height"];
                    newCssText = getCssTextFromObject(csses);
                }
    
                if(selectedNodes[i] === note._selection.editStartNode) { // Indicates the starting node of the selection.
                    if(isStartNodeEqualEndNode) {	// If the starting node and ending node are the same, remove the text before the starting point up to the ending point.
                        sE = sE.slice(0, sE.length - eE.length);
                    }
                    // Insert text before the starting node.
                    tempEl = handler.getElement(sS,
                            handler.getParentTagName(note._selection.editStartNode, note),
                            getCssTextFromObject(handler.getObjectEditElementCss(note._selection.editStartNode, note)),
                            handler.getObjectEditElementAttributes(note._selection.editStartNode, note),
                            note
                        );
                    insertSelectedNode(tempEl, tempUnitEl);
                    // Insert text after the starting node.
                    tempEl = handler.getElement(sE, newTagName, newCssText, newAttributes, note);
                    insertSelectedNode(tempEl, tempUnitEl);
                    // Reset the starting node.
                    newStartNode = tempEl.firstChild;
                    
                    if(isStartNodeEqualEndNode) {	//If the starting and ending nodes are the same, insert text after the ending point and finish.
                        // Reset the ending node (same as the starting point).
                        newEndNode = tempEl.firstChild;
                        tempEl = handler.getElement(eE,
                                handler.getParentTagName(note._selection.editEndNode, note),
                                getCssTextFromObject(handler.getObjectEditElementCss(note._selection.editEndNode, note)),
                                handler.getObjectEditElementAttributes(note._selection.editEndNode, note),
                                note
                            );
                        insertSelectedNode(tempEl, tempUnitEl);
                        // Set the "isEnd" boolean variable to true.
                        isEnd = true;
                    }
                    // Remove the starting node.
                    selectedNodes[i].remove();
                }
                else if(!isStartNodeEqualEndNode && selectedNodes[i] === note._selection.editEndNode) {	// For the case where the starting and ending nodes are different, and the current node is the ending node.
                    // Insert text before the ending node.
                    tempEl = handler.getElement(eS, newTagName, newCssText, newAttributes, note);
                    insertSelectedNode(tempEl, tempUnitEl);
                    // Reset the ending node.
                    newEndNode = tempEl.firstChild;
                    // Insert text after the ending node.
                    tempEl = handler.getElement(eE,
                            handler.getParentTagName(note._selection.editEndNode, note),
                            getCssTextFromObject(handler.getObjectEditElementCss(note._selection.editEndNode, note)),
                            handler.getObjectEditElementAttributes(note._selection.editEndNode, note),
                            note
                        );
                    insertSelectedNode(tempEl, tempUnitEl);
                    // Set the "isEnd" boolean variable to true.
                    isEnd = true;
                    selectedNodes[i].remove();
                }
                else {	// For the rest of the selected nodes that are not starting or ending nodes.
                    if(isEnd) {	// If "isEnd" is true, apply the existing attributes and styles to nodes until the end of the edit unit.
                        tempEl = handler.getElement(selectedNodes[i].textContent,
                                handler.getParentTagName(selectedNodes[i], note),
                                getCssTextFromObject(handler.getObjectEditElementCss(selectedNodes[i], note)),
                                handler.getObjectEditElementAttributes(selectedNodes[i], note),
                                note
                            );
                    }
                    else {	// If "isEnd" is false, apply new attributes and styles to selected nodes.
                        tempEl = handler.getElement(selectedNodes[i].textContent, newTagName, newCssText, newAttributes, note);
                    }
                    insertSelectedNode(tempEl, tempUnitEl);
                    selectedNodes[i].remove();
                }
            }
            else if(vn.consts.EMPTY_ABLE_TAG.indexOf(selectedNodes[i].tagName) >= 0) {	// For empty able tags, copy them as they are.
                tempEl = selectedNodes[i].cloneNode();
                insertSelectedNode(tempEl, tempUnitEl);
                selectedNodes[i].remove();
            }
            else if(vn.consts.UNIT_TAG.indexOf(selectedNodes[i].tagName) >= 0) {	// For unit tags, set the insert position.
                tempUnitEl = selectedNodes[i];
            }
        }
        
        // Clean up the target elements for editing.
        for(let i = 0; i < note._selection.editDragUnitElement.length; i++) {
            handler.removeEmptyElment(note._selection.editDragUnitElement[i], note);
        }
        
        if(!newStartNode) {
            newStartNode = note._selection.editStartUnitElement;	
        }
        
        if(!newEndNode) {
            newEndNode = note._selection.editEndUnitElement;
            newEndOffset = 0;
        }
        else {
            newEndOffset = newEndNode!.textContent!.length;
        }
        
        // Sets the new selection range.
        handler.setNewSelection(
                newStartNode!,
                0,
                newEndNode!,
                newEndOffset
                );
    };
    
    handler.textarea_onBeforeinputSpelling = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        // A delay of 0.05 seconds is applied for textarea_onBeforeinputSpelling event to avoid errors when inputting a large number of characters at once.
        if(!vn.variables.canEvent) return;
        handler.onEventDisable(vn, "input");
        
        // If no specific range is selected, return.
        if(!handler.isValidSelection(note)) return;
        
        // Get the current set style.
        let cssText = "";
        const cssObject = handler.getObjectNoteCss(note);
        // Style check is only required for the starting element when inputting.
        let cssObjectEl = handler.getObjectEditElementCss(note._selection.editStartElement, note);
        
        // Ignore font size when inputting in a header.
        if ((note._selection.editStartUnitElement as any).tagName.substring(0, 1) === "H") {
            delete cssObject["font-size"];
            delete cssObject["letter-spacing"];
            delete cssObject["line-height"];
        }
        else {	// If it is not a header, if there are any child elements with missing font-size and line-height, put them back.
            if(note._selection.editStartElement instanceof Element
                && vn.consts.UNIT_TAG.indexOf((note._selection.editStartElement as any).tagName) < 0
                && (!cssObjectEl["font-size"] || !cssObjectEl["line-height"])) {
                cssObjectEl = cssObject;
                setAttributesObjectToElement(note._selection.editStartElement, {"style" : getCssTextFromObject(cssObjectEl)});
            }
        }
        
        // If the style is the same, exit.
        if(compareObject(cssObject,cssObjectEl)) {
            return;
        }
        else {
            cssText = getCssTextFromObject(cssObject);
        }
        
        // Create the edit point.
        const selectElement = document.createElement("span");
        selectElement.setAttribute("class",note._noteName + "-point");
        selectElement.appendChild(document.createTextNode("!"));
        // Execute only when the starting point is a single point.
        if((note._selection.editRange as any).collapsed) {
            (note._selection.editRange as any).insertNode(selectElement);
            // Modify the style of the selected element.
            try {
                handler.modifySelectedSingleElement(note, handler.getObjectNoteCss(note));
            }
            catch (err){}
            
            // Retrieve the edit point.
            const newSelectElements = document.getElementsByClassName(note._noteName + "-point");
            const newSelectElement = newSelectElements[0];
            
            if(cssText) {
                newSelectElement.setAttribute("style",cssText);	
            } else {
                newSelectElement.removeAttribute("style");
            }
            // Remove the class of all edit points.
            for(let i = 0; i < newSelectElements.length; i++) {
                newSelectElements[i].removeAttribute("class");	
            }
            // Sets the new selection range.
            handler.setNewSelection((newSelectElement.firstChild as any), 0, (newSelectElement.firstChild as any), (newSelectElement.firstChild as any).length);
        }
        else {
            // Modify the style of the selected element.
            handler.modifySelectedSingleElement(note, handler.getObjectNoteCss(note));
        }
    };
    
    handler.textarea_onKeydownEnter = (target: any) => {
        const note = getParentNote(target);
        if(!note) return;
        if(!handler.isValidSelection(note)) return;
        if(note._selection.editStartUnitElement && (note._selection.editStartUnitElement as any).textContent) {
            return;
        }
        // Ignore if it is an empty-able tag (except BR, img, input).
        if(note._selection.editStartNode instanceof Element
            && vn.consts.EMPTY_ABLE_TAG.indexOf((note._selection.editStartNode as any).tagName) >= 0
            && (note._selection.editStartNode as any).tagName !== "BR") {
            return;
        }
        let tempEl1;
        let tempEl2;
        const tagName = (note._selection.editStartUnitElement as any).tagName;
        tempEl1 = document.createElement(tagName);
        tempEl2 = document.createElement("BR");
        tempEl1.appendChild(tempEl2);
        tempEl1 = setAttributesObjectToElement(tempEl1, (handler.getAttributesObjectFromElement((note._selection.editStartUnitElement as any)) as any));
        
        (note._selection.editStartUnitElement as any).replaceWith(tempEl1);
        
        // Sets the new selection range.
        handler.setNewSelection(tempEl1, 0, tempEl1, 0);
    };
}
