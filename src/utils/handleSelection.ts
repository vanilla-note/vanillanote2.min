import type { Vanillanote, VanillanoteElement } from "../types/vanillanote";
import { getElement, getObjectEditElementAttributes, getObjectEditElementCss, getParentTagName, getParentUnitTagElemnt, removeEmptyElment } from "./handleActive";
import { closeAllTooltip, getSpecialTag } from "./handleElement";
import { getCssTextFromObject, getObjectFromCssText } from "./util";

/**
* setNewSelection
* @description Sets the new selection range in the document.
* @param {Node} startNode - The starting node of the selection.
* @param {Number} startOffset - The offset within the starting node where the selection should begin.
* @param {Node} endNode - The ending node of the selection.
* @param {Number} endOffset - The offset within the ending node where the selection should end.
* @returns {Selection|null} newSelection - The newly created selection or null if nodes are not present in the document.
*/
var setNewSelection = function(startNode: Node, startOffset: number, endNode: Node, endOffset: number) {
    if(!document.contains(startNode) || !document.contains(endNode)) {
        return;
    }
    var newRange = document.createRange();
    var newSelection = window.getSelection();
    newRange.setStart(startNode, startOffset);
    newRange.setEnd(endNode, endOffset);
    newSelection!.removeAllRanges();
    newSelection!.addRange(newRange);
    
    return newSelection;
};

/**
* handleSpecialTagSelection
* @description This function Open tooltip according to the tag of the selected element.
* @param {Vanillanote} vn - vanillanote object
* @param {String or Number} noteIndex - The index of the note.
*/
export const handleSpecialTagSelection = (vn: Vanillanote, noteIndex: number) => {
    closeAllTooltip(noteIndex);
    if(!vn.variables.editRanges[noteIndex]!.collapsed) return;
    var tagName = getSpecialTag(vn.variables.editStartNode[noteIndex]);
    
    switch(tagName) {
        case "A":
            appearAttLinkToolTip(noteIndex);
            break;
        case "IMG":
            appearAttImageAndVideoTooltip(noteIndex);
            break;
        case "IFRAME":
            appearAttImageAndVideoTooltip(noteIndex);
            break;
        default :
            return;
            break;
    }
};

/**
* setOriginEditSelection
* @description Moves the selection back to the original edit point for a specific note.
* @param {Number} noteIndex - The index of the note to set the original edit selection for.
*/
export const setOriginEditSelection = (note: VanillanoteElement) => {
    if(note._selection.editRanges) {
        note._selection.setEditStyleTagToggle = 2;	// The 'selectiononchange' event usually occurs twice (once when removed and once when added back).
        var selection = window.getSelection();
        selection!.removeAllRanges();
        selection!.addRange(note._selection.editRanges);
    }
};

/**
* setEditSelection
* @description Records the selection for a specific note and performs additional operations based on the selected elements.
* @param {Number} noteIndex - The index of the note for which the selection is being recorded.
* @param {Selection} selection - The selection object to be recorded.
* @returns {Boolean} - Returns true if the selection was recorded and additional operations were performed, otherwise returns false.
*/
var setEditSelection = function(noteIndex: number, selection: Selection) {
    // If the selection range count is less than 1 or not within a textarea, return false.
    if(selection.rangeCount < 1) return false;
    if(!isInTextarea()) return false;
    
    vn.variables.editSelections[noteIndex] = selection;
    vn.variables.editRanges[noteIndex] = vn.variables.editSelections[noteIndex].getRangeAt(0);
    
    vn.variables.startOffset[noteIndex] = vn.variables.editRanges[noteIndex].startOffset;
    vn.variables.endOffset[noteIndex] = vn.variables.editRanges[noteIndex].endOffset;
    
    vn.variables.editStartNode[noteIndex] = vn.variables.editRanges[noteIndex].startContainer;
    vn.variables.editEndNode[noteIndex] = vn.variables.editRanges[noteIndex].endContainer;
    
    // If the start node is an element, find the first text node within the element.
    if(vn.variables.editStartNode[noteIndex] instanceof Element) {
        while(vn.variables.editStartNode[noteIndex] instanceof Element) {
            if(!vn.variables.editStartNode[noteIndex].firstChild) break;
            if((vn.variables.editStartNode[noteIndex] as any).firstChild.tagName === "BR") break;	//no br
            vn.variables.editStartNode[noteIndex] = vn.variables.editStartNode[noteIndex].firstChild;
            if(vn.variables.editStartNode[noteIndex].nodeType === 3) break;
        }
        vn.variables.startOffset[noteIndex] = 0;
    }
    // If the end node is an element, find the first text node within the element.
    if(vn.variables.editEndNode[noteIndex] instanceof Element) {
        while(vn.variables.editEndNode[noteIndex] instanceof Element) {
            if(!vn.variables.editEndNode[noteIndex].firstChild) break;
            if((vn.variables.editEndNode[noteIndex] as any).firstChild.tagName === "BR") break;	//no br
            vn.variables.editEndNode[noteIndex] = vn.variables.editEndNode[noteIndex].firstChild;
            if(vn.variables.editEndNode[noteIndex].nodeType === 3) break;
        }
        vn.variables.endOffset[noteIndex] = 0;
    }
    
    vn.variables.editStartElements[noteIndex] = vn.variables.editRanges[noteIndex].startContainer instanceof Element ?
                                                vn.variables.editRanges[noteIndex].startContainer : vn.variables.editRanges[noteIndex].startContainer.parentNode;
    vn.variables.editEndElements[noteIndex] = vn.variables.editRanges[noteIndex].endContainer instanceof Element ?
                                                vn.variables.editRanges[noteIndex].endContainer : vn.variables.editRanges[noteIndex].endContainer.parentNode;
    
    // If the start element is a unit element, find the deepest child unit element.
    if(vn.consts.UNIT_TAG.indexOf((vn.variables.editStartElements[noteIndex] as any).tagName) > 0) {
        while(vn.consts.UNIT_TAG.indexOf((vn.variables.editStartElements[noteIndex] as any).tagName) > 0) {
            vn.variables.editStartElements[noteIndex] = (vn.variables.editStartElements[noteIndex] as any).firstChild;
        }
    }
    // If the end element is a unit element, find the deepest child unit element.
    if(vn.consts.UNIT_TAG.indexOf((vn.variables.editEndElements[noteIndex] as any).tagName) > 0) {
        while(vn.consts.UNIT_TAG.indexOf((vn.variables.editEndElements[noteIndex] as any).tagName) > 0) {
            vn.variables.editEndElements[noteIndex] = (vn.variables.editEndElements[noteIndex] as any).lastChild;
        }
    }
    // If the start element is a <br> tag, update it to the parent node.
    if(vn.variables.editStartElements[noteIndex] instanceof Element &&
            vn.variables.editStartElements[noteIndex].tagName === "BR") {
        vn.variables.editStartElements[noteIndex] = vn.variables.editStartElements[noteIndex].parentNode;
    }
    // If the end element is a <br> tag, update it to the parent node.
    if(vn.variables.editEndElements[noteIndex] instanceof Element &&
            vn.variables.editEndElements[noteIndex].tagName === "BR") {
        vn.variables.editEndElements[noteIndex] = vn.variables.editEndElements[noteIndex].parentNode;
    }
    //If the start element is textarea, be start element to null
    if((vn.variables.editStartElements[noteIndex] as any).tagName === (vn.variables.noteName+"-textarea").toUpperCase()) {
        vn.variables.editStartElements[noteIndex] = null;
    }
    //If the end element is textarea, be end element to null
    if((vn.variables.editEndElements[noteIndex] as any).tagName === (vn.variables.noteName+"-textarea").toUpperCase()) {
        vn.variables.editEndElements[noteIndex] = null;
    }
    // Get the parent unit elements of the start and end elements.
    vn.variables.editStartUnitElement[noteIndex] = getParentUnitTagElemnt(vn.variables.editStartElements[noteIndex]);
    vn.variables.editEndUnitElements[noteIndex] = getParentUnitTagElemnt(vn.variables.editEndElements[noteIndex]);
    // Clear and populate the array with all unit elements within the selection.
    vn.variables.editDragUnitElements[noteIndex].splice(0, vn.variables.editDragUnitElements[noteIndex].length); //initial array
    
    var dragElements = modifySeletedElements(noteIndex);
    var unitElement
    for(var i = 0; i < dragElements.length; i++) {
        unitElement = getParentUnitTagElemnt(dragElements[i]);
        if(vn.variables.editDragUnitElements[noteIndex].includes(unitElement)) continue;
        vn.variables.editDragUnitElements[noteIndex].push(unitElement);
    }
    // Set style and tag based on the selected elements.
    setEditStyleTag(noteIndex);
    
    // Perform additional actions based on the selected element's tag.
    handleSpecialTagSelection(noteIndex);
    
    return true;
};

/**
 * isValidSelection
 * @description check that now selection is valid
 * @returns {Boolean} - if vaild, return true
 */
export const isValidSelection = (note: VanillanoteElement) => {
    if(!note._selection.editRanges) return false;
    if(!note._selection.editStartElements) return false;
    if(!note._selection.editStartUnitElement) return false;
    return true;
};

export const modifySeletedElements = (note: VanillanoteElement) => {
    var isEnd = false;
    var element = note._selection.editStartNode;
    var selectedNodes: any[] = [];
    if(!note._selection.editStartUnitElement || !note._selection.editEndUnitElements) return selectedNodes;
    
    var lastNode = note._selection.editEndUnitElements.lastChild;
    while(lastNode) {
        if(!lastNode.lastChild) break;
        lastNode = lastNode.lastChild;
    }
    
    // Recursive function to get all child nodes
    var getChildNodes = function(node: any){
        if(node === lastNode) {
            selectedNodes.push(node);
            isEnd = true;
        }
        if(isEnd) return;
        if(note._vn.consts.UNIT_TAG.indexOf(node.tagName) >= 0
            || note._vn.consts.EMPTY_ABLE_TAG.indexOf(node.tagName) >= 0
            || node.nodeType === 3) {
            selectedNodes.push(node);
        }
        
        if(node && node.childNodes && node.childNodes.length) {
            for (var i = 0; i < node.childNodes.length; i++) {
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

/**
* modifySelectedUnitElementTag
* @description Changes the tag of the selected unit element.
* @param {Element} target - The target element whose tag needs to be changed.
*/
var modifySelectedUnitElementTag = function(target: any) {
    var noteId = getNoteId(target);
    if(!noteIndex) return;
    if(!isValidSelection(noteIndex)) return;
    var tag = target.getAttribute("data-tag-name")
    var tempEl;
    
    if(vn.consts.DOUBLE_TAG.indexOf(tag) >= 0) { // ul or ol
        var tempDoubleElement = document.createElement(tag);
        for(var i = 0; i < vn.variables.editDragUnitElements[noteIndex].length; i++) {
            if((vn.variables.editDragUnitElements[noteIndex] as any)[i].tagName === "LI") {
                // Remove ul or ol tag
                removeDoubleTag(noteIndex, (vn.variables.editDragUnitElements[noteIndex] as any)[i].parentNode);
            }
            if(tag === "UL" && vn.variables.ulToggles[noteIndex]) {
                break;
            }
            if(tag === "OL" && vn.variables.olToggles[noteIndex]) {
                break;
            }
            // Recreate ul or ol tag
            if(i === 0) {
                (vn.variables.editDragUnitElements[noteIndex] as any)[0].insertAdjacentElement("beforebegin", tempDoubleElement);
            }
            tempEl = getElementReplaceTag(vn.variables.editDragUnitElements[noteIndex][i], "LI");
            // Prevents the edit Node from being replaced with a unit tag when there's an empty edit unit tag (p, h1, h2, li, etc.).
            setEditNodeAndElement(noteIndex, tempEl, vn.variables.editDragUnitElements[noteIndex][i]);
            
            (vn.variables.editDragUnitElements[noteIndex] as any)[i].remove();
            vn.variables.editDragUnitElements[noteIndex][i] = tempEl;
            tempDoubleElement.append(tempEl);
        }
    } else {
        for(var i = 0; i < vn.variables.editDragUnitElements[noteIndex].length; i++) {
            if((vn.variables.editDragUnitElements[noteIndex] as any)[i].tagName === "LI") {
                // Remove ul or ol tag
                removeDoubleTag(noteIndex, (vn.variables.editDragUnitElements[noteIndex] as any)[i].parentNode);
            }
            // Create new tag
            tempEl = getElementReplaceTag(vn.variables.editDragUnitElements[noteIndex][i], tag);
            
            // Prevents the edit Node from being replaced with a unit tag when there's an empty edit unit tag (p, h1, h2, li, etc.).
            setEditNodeAndElement(noteIndex, tempEl, vn.variables.editDragUnitElements[noteIndex][i]);
            
            (vn.variables.editDragUnitElements[noteIndex] as any)[i].replaceWith(tempEl);
            vn.variables.editDragUnitElements[noteIndex][i] = tempEl;
        }
    }
    
    // Sets the new selection range.
    var newStartOffset = 0
    var newEndOffset = vn.variables.editEndElements[noteIndex] ? (vn.variables.editEndElements[noteIndex] as any).textContent.length : 0
    if(vn.variables.editStartElements[noteIndex] === vn.variables.editEndElements[noteIndex]) {
        newStartOffset = newEndOffset;
    }
    // Sets the new selection range.
    setNewSelection(
            vn.variables.editStartNode[noteIndex]!,
            newStartOffset,
            vn.variables.editEndNode[noteIndex]!,
            newEndOffset
            );
};

/**
* modifySelectedUnitElementStyle
* @description Changes the style of the selected unit element.
* @param {Element} target - The target element whose style needs to be changed.
*/
var modifySelectedUnitElementStyle = function(target: any) {
    var noteId = getNoteId(target);
    if(!noteIndex) return;
    if(!isValidSelection(noteIndex)) return;
    
    var tagCssText = target.getAttribute("data-tag-style");
    var nowCssText;
    var newCssText;
    var tagCssObject = getObjectFromCssText(tagCssText);
    var nowCssObject;
    var tempEl
    
    for(var i = 0; i < vn.variables.editDragUnitElements[noteIndex].length; i++) {
        nowCssText = (vn.variables.editDragUnitElements[noteIndex] as any)[i].getAttribute("style");
        // Convert style text to an object
        nowCssObject = getObjectFromCssText(nowCssText);
        
        // Merge the style objects and than Convert the style object back to text
        newCssText = getCssTextFromObject(mergeObjects(nowCssObject, tagCssObject));
        
        // Perform mutation to trigger the changes by removing and recreating the element
        tempEl = (vn.variables.editDragUnitElements[noteIndex] as any)[i].cloneNode(true);
        tempEl.setAttribute("style",newCssText);
        (vn.variables.editDragUnitElements[noteIndex] as any)[i].parentNode.replaceChild(tempEl, (vn.variables.editDragUnitElements[noteIndex] as any)[i]);
        vn.variables.editDragUnitElements[noteIndex][i] = tempEl;
    }
    
    // Sets the new selection range.
    var newStartOffset = 0
    var newEndOffset = (vn.variables.editEndElements[noteIndex] as any).childNodes ? (vn.variables.editEndElements[noteIndex] as any).childNodes.length : 0
    // Sets the new selection range.
    setNewSelection(
            (vn.variables.editDragUnitElements[noteIndex] as any)[0],
            0,
            (vn.variables.editDragUnitElements[noteIndex] as any)[vn.variables.editDragUnitElements[noteIndex].length - 1],
            1
            );
};

/**
 * modifySelectedSingleElement
 * @description Changes the selected individual element by modifying its style, tag, or attributes.
 * @param {number} noteIndex - The index of the note where modifications are applied.
 * @param {object} csses - An object representing the style properties to be applied to the selected element.
 * @param {string} tagName - A string representing the new tag name to be used for the selected element.
 * @param {object} attributes - An object representing the attributes to be applied to the selected element.
 */
export const modifySelectedSingleElement = (note: VanillanoteElement, csses: Record<string, string> | null, tagName?: string, attributes?: Record<string, string>) => {
    if(!isValidSelection(note)) return;
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
    selectedNodes = modifySeletedElements(note);
    
    // Text content before the starting node of the selection.
    var sS =(note._selection.editStartNode as any).textContent.slice(0,note._selection.startOffset);
    // Text content after the starting node of the selection.
    var sE =(note._selection.editStartNode as any).textContent.slice(note._selection.startOffset,note._selection.editStartNode!.textContent!.length);
    // Text content before the ending node of the selection.
    var eS = (note._selection.editEndNode as any).textContent.slice(0,note._selection.endOffset);
    // Text content after the ending node of the selection.
    var eE = (note._selection.editEndNode as any).textContent.slice(note._selection.endOffset,note._selection.editEndNode!.textContent!.length);
    
    // An internal function used for inserting nodes.
    var insertSelectedNode = function(tempEl: any, tempUnitEl: any) {
        if(!tempEl) return;
        if(tempUnitEl) {
            tempUnitEl.insertBefore(tempEl, null);
        }
        else {
            (note._selection.editStartUnitElement as any).insertBefore(tempEl, null);
        }
    }
    // A condition indicating that the end node of the selection has been reached.
    var isEnd = false;
    // A check to determine if the starting node and ending node of the selection are the same.
    var isStartNodeEqualEndNode = note._selection.editStartNode === note._selection.editEndNode;
    for(var i = 0; i < selectedNodes.length; i++) {
        if(selectedNodes[i].nodeType === 3) {	// A comment indicating that the subsequent code handles text nodes in the selection.
            if(!attributes) newAttributes = getObjectEditElementAttributes(selectedNodes[i], note);	// If no attributes are provided for the new element, use the existing attributes of the node being replaced.
            if(!tagName) newTagName = getSpecialTag(selectedNodes[i]);	// If no tag name is provided for the new element, use the existing tag name of the node being replaced.
            if(!csses) newCssText = getCssTextFromObject(getObjectEditElementCss(selectedNodes[i], note));	// If no style is provided for the new element, use the existing style of the node being replaced.
            
            // An exception for headers where the font size should be ignored.
            tempEl = getParentUnitTagElemnt(selectedNodes[i], note);
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
                tempEl = getElement(sS,
                        getParentTagName(note._selection.editStartNode, note),
                        getCssTextFromObject(getObjectEditElementCss(note._selection.editStartNode, note)),
                        getObjectEditElementAttributes(note._selection.editStartNode, note),
                        note
                    );
                insertSelectedNode(tempEl, tempUnitEl);
                // Insert text after the starting node.
                tempEl = getElement(sE, newTagName, newCssText, newAttributes, note);
                insertSelectedNode(tempEl, tempUnitEl);
                // Reset the starting node.
                newStartNode = tempEl.firstChild;
                
                if(isStartNodeEqualEndNode) {	//If the starting and ending nodes are the same, insert text after the ending point and finish.
                    // Reset the ending node (same as the starting point).
                    newEndNode = tempEl.firstChild;
                    tempEl = getElement(eE,
                            getParentTagName(note._selection.editEndNode, note),
                            getCssTextFromObject(getObjectEditElementCss(note._selection.editEndNode, note)),
                            getObjectEditElementAttributes(note._selection.editEndNode, note),
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
                tempEl = getElement(eS, newTagName, newCssText, newAttributes, note);
                insertSelectedNode(tempEl, tempUnitEl);
                // Reset the ending node.
                newEndNode = tempEl.firstChild;
                // Insert text after the ending node.
                tempEl = getElement(eE,
                        getParentTagName(note._selection.editEndNode, note),
                        getCssTextFromObject(getObjectEditElementCss(note._selection.editEndNode, note)),
                        getObjectEditElementAttributes(note._selection.editEndNode, note),
                        note
                    );
                insertSelectedNode(tempEl, tempUnitEl);
                // Set the "isEnd" boolean variable to true.
                isEnd = true;
                selectedNodes[i].remove();
            }
            else {	// For the rest of the selected nodes that are not starting or ending nodes.
                if(isEnd) {	// If "isEnd" is true, apply the existing attributes and styles to nodes until the end of the edit unit.
                    tempEl = getElement(selectedNodes[i].textContent,
                            getParentTagName(selectedNodes[i], note),
                            getCssTextFromObject(getObjectEditElementCss(selectedNodes[i], note)),
                            getObjectEditElementAttributes(selectedNodes[i], note),
                            note
                        );
                }
                else {	// If "isEnd" is false, apply new attributes and styles to selected nodes.
                    tempEl = getElement(selectedNodes[i].textContent, newTagName, newCssText, newAttributes, note);
                }
                insertSelectedNode(tempEl, tempUnitEl);
                selectedNodes[i].remove();
            }
        }
        else if(note._vn.consts.EMPTY_ABLE_TAG.indexOf(selectedNodes[i].tagName) >= 0) {	// For empty able tags, copy them as they are.
            tempEl = selectedNodes[i].cloneNode();
            insertSelectedNode(tempEl, tempUnitEl);
            selectedNodes[i].remove();
        }
        else if(note._vn.consts.UNIT_TAG.indexOf(selectedNodes[i].tagName) >= 0) {	// For unit tags, set the insert position.
            tempUnitEl = selectedNodes[i];
        }
    }
    
    // Clean up the target elements for editing.
    for(var i = 0; i < note._selection.editDragUnitElement.length; i++) {
        removeEmptyElment(note._selection.editDragUnitElement[i], note);
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
    setNewSelection(
            newStartNode!,
            0,
            newEndNode!,
            newEndOffset
            );
};

/**
* textarea_onBeforeinputSpelling
* @description Handles the event when text is input in the editNote.
* @param {Event} e - The input event.
*/
var textarea_onBeforeinputSpelling = function(e: any) {
    var noteId = getNoteId(e.target);
    if(!noteIndex) return;
    // A delay of 0.05 seconds is applied for textarea_onBeforeinputSpelling event to avoid errors when inputting a large number of characters at once.
    if(!vn.variables.canEvents) return;
    onEventDisable("input");
    
    // If no specific range is selected, return.
    if(!isValidSelection(noteIndex)) return;
    
    // Get the current set style.
    var cssText = "";
    var cssObject = getObjectNoteCss(noteIndex);
    // Style check is only required for the starting element when inputting.
    var cssObjectEl = getObjectEditElementCss(vn.variables.editStartElements[noteIndex]);
    
    // Ignore font size when inputting in a header.
    if ((vn.variables.editStartUnitElement[noteIndex] as any).tagName.substring(0, 1) === "H") {
        delete cssObject["font-size"];
        delete cssObject["letter-spacing"];
        delete cssObject["line-height"];
    }
    else {	// If it is not a header, if there are any child elements with missing font-size and line-height, put them back.
        if(vn.variables.editStartElements[noteIndex] instanceof Element
            && vn.consts.UNIT_TAG.indexOf((vn.variables.editStartElements[noteIndex] as any).tagName) < 0
            && (!cssObjectEl["font-size"] || !cssObjectEl["line-height"])) {
            cssObjectEl = cssObject;
            setAttributesObjectToElement(vn.variables.editStartElements[noteIndex], {"style" : getCssTextFromObject(cssObjectEl)});
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
    var selectElement = document.createElement("span");
    selectElement.setAttribute("class",vn.variables.noteName + "-point");
    selectElement.appendChild(document.createTextNode("!"));
    // Execute only when the starting point is a single point.
    if((vn.variables.editRanges[noteIndex] as any).collapsed) {
        (vn.variables.editRanges[noteIndex] as any).insertNode(selectElement);
        // Modify the style of the selected element.
        try {
            modifySelectedSingleElement(noteIndex, getObjectNoteCss(noteIndex));
        }
        catch (err){}
        
        // Retrieve the edit point.
        var newSelectElements = document.getElementsByClassName(vn.variables.noteName + "-point");
        var newSelectElement = newSelectElements[0];
        
        if(cssText) {
            newSelectElement.setAttribute("style",cssText);	
        } else {
            newSelectElement.removeAttribute("style");
        }
        // Remove the class of all edit points.
        for(var i = 0; i < newSelectElements.length; i++) {
            newSelectElements[i].removeAttribute("class");	
        }
        // Sets the new selection range.
        setNewSelection((newSelectElement.firstChild as any), 0, (newSelectElement.firstChild as any), (newSelectElement.firstChild as any).length);
    }
    else {
        // Modify the style of the selected element.
        modifySelectedSingleElement(noteIndex, getObjectNoteCss(noteIndex));
    }
};

/**
* textarea_onKeydownEnter
* @description Handles the event when the enter key is pressed in the editNote.
* @param {Element} target - The target element where the enter key was pressed.
*/
var textarea_onKeydownEnter = function(target: any) {
    var noteId = getNoteId(target);
    if(!noteIndex) return;
    if(!isValidSelection(noteIndex)) return;
    if(vn.variables.editStartUnitElement[noteIndex] && (vn.variables.editStartUnitElement[noteIndex] as any).textContent) {
        return;
    }
    // Ignore if it is an empty-able tag (except BR, img, input).
    if(vn.variables.editStartNode[noteIndex] instanceof Element
        && vn.consts.EMPTY_ABLE_TAG.indexOf((vn.variables.editStartNode[noteIndex] as any).tagName) >= 0
        && (vn.variables.editStartNode[noteIndex] as any).tagName !== "BR") {
        return;
    }
    var tempEl1;
    var tempEl2;
    var tagName = (vn.variables.editStartUnitElement[noteIndex] as any).tagName;
    tempEl1 = document.createElement(tagName);
    tempEl2 = document.createElement("BR");
    tempEl1.appendChild(tempEl2);
    tempEl1 = setAttributesObjectToElement(tempEl1, (getAttributesObjectFromElement((vn.variables.editStartUnitElement[noteIndex] as any)) as any));
    
    (vn.variables.editStartUnitElement[noteIndex] as any).replaceWith(tempEl1);
    
    // Sets the new selection range.
    setNewSelection(tempEl1, 0, tempEl1, 0);
};

/**
* initTextarea
* @description Initializes the edit note by setting its content to a default state (<p><br></p>).
* @param {HTMLTextAreaElement} textarea - The textarea element representing the edit note.
*/
export const initTextarea = function(textarea: HTMLTextAreaElement) {
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
