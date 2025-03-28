import { elementsEvent } from "../events/elementEvent";
import { fontFamilySelectList_onClick, selectToggle } from "./handleElement";
import { setOriginEditSelection } from "./handleSelection";
import { getClassName, getClickCssEventElementClassName, getEventChildrenClassName, getId, getOnOverCssEventElementClassName, getParentNote } from "./util";

/**
* setAttTempFileValid
* @description Filters and keeps only valid files in the attTempFiles object of the specified note.
* @param {number} noteIndex - The index of the note where the attTempFiles object needs to be filtered.
*/
var setAttTempFileValid = function(noteIndex: number) {
    var newAttTempFiles: any = new Object;
    var keys = Object.keys(vn.variables.attTempFiles[noteIndex]);
    for(var i = 0; i < keys.length; i++) {
        if(vn.variables.attFileAcceptTypes[noteIndex].length > 0) {
            if(vn.variables.attFileAcceptTypes[noteIndex].includes(vn.variables.attTempFiles[noteIndex][keys[i]].type)) {
                newAttTempFiles[keys[i]] = vn.variables.attTempFiles[noteIndex][keys[i]];
            }
        }
        else {
            newAttTempFiles[keys[i]] = vn.variables.attTempFiles[noteIndex][keys[i]];
        }
        
        if(!newAttTempFiles[keys[i]]) continue;
        
        if(vn.variables.attFilePreventTypes[noteIndex].includes(newAttTempFiles[keys[i]].type)) {
            showAlert("[" + newAttTempFiles[keys[i]].name + "] " + vn.languageSet[vn.variables.languages[noteIndex]].attPreventType);
            delete newAttTempFiles[keys[i]];
        }
        else if(newAttTempFiles[keys[i]].size >= vn.variables.attFileMaxSizes[noteIndex]) {
            showAlert("[" + newAttTempFiles[keys[i]].name + "] " + vn.languageSet[vn.variables.languages[noteIndex]].attOverSize);
            delete newAttTempFiles[keys[i]];
        }
    }
    vn.variables.attTempFiles[noteIndex] = newAttTempFiles;
};

/**
* setAttFileUploadDiv
* @description Sets up the attFileUploadDiv for the specified note.
* @param {number} noteIndex - The index of the note for which the attFileUploadDiv needs to be set up.
*/
var setAttFileUploadDiv = function(noteIndex: number) {
    if((vn.variables.attTempFiles[noteIndex] as any).length <= 0) {
        vn.elements.attFileUploadDivs[noteIndex].style.removeProperty("line-height");
        vn.elements.attFileUploadDivs[noteIndex].textContent = vn.languageSet[vn.variables.languages[noteIndex]].attFileUploadDiv;
        return;
    } else {
        vn.elements.attFileUploadDivs[noteIndex].style.lineHeight = "unset";
    }
    vn.elements.attFileUploadDivs[noteIndex].replaceChildren();
    
    var keys = Object.keys(vn.variables.attTempFiles[noteIndex]);
    var tempEl;
    for(var i = 0; i < keys.length; i++) {
        tempEl = getElement(
            vn.variables.attTempFiles[noteIndex][keys[i]].name,
            "P",
            "display:block;padding:0.5em 0;",
            {
                "title":vn.languageSet[vn.variables.languages[noteIndex]].attFileListTooltip,
                "uuid":keys[i]
            }
        );
        vn.elements.attFileUploadDivs[noteIndex].appendChild(tempEl);
    }
};

/**
* setAttTempImageValid
* @description Filters the attTempImages to keep only valid image files.
* @param {number} noteIndex - The index of the note for which the attTempImages need to be filtered.
*/
var setAttTempImageValid = function(noteIndex: number) {
    var newAttTempImages: any = new Object;
    var keys = Object.keys(vn.variables.attTempImages[noteIndex]);
    for(var i = 0; i < keys.length; i++) {
        if(vn.variables.attImageAcceptTypes[noteIndex].length > 0) {
            if(vn.variables.attImageAcceptTypes[noteIndex].includes(vn.variables.attTempImages[noteIndex][keys[i]].type)) {
                newAttTempImages[keys[i]] = vn.variables.attTempImages[noteIndex][keys[i]];
            }
        }
        else {
            newAttTempImages[keys[i]] = vn.variables.attTempImages[noteIndex][keys[i]];
        }
        
        if(!newAttTempImages[keys[i]]) continue;
        
        if(vn.variables.attImagePreventTypes[noteIndex].includes(newAttTempImages[keys[i]].type)) {
            showAlert("[" + newAttTempImages[keys[i]].name + "] " + vn.languageSet[vn.variables.languages[noteIndex]].attPreventType);
            delete newAttTempImages[keys[i]];
        }
        else if(newAttTempImages[keys[i]].size >= vn.variables.attImageMaxSizes[noteIndex]) {
            showAlert("[" + newAttTempImages[keys[i]].name + "] " + vn.languageSet[vn.variables.languages[noteIndex]].attOverSize);
            delete newAttTempImages[keys[i]];
        }
    }
    vn.variables.attTempImages[noteIndex] = newAttTempImages;
};

/**
* setAttImageUploadAndView
* @description Sets up the attImageUploadAndView for the specified note.
* @param {number} noteIndex - The index of the note for which the attImageUploadAndView needs to be set up.
*/
var setAttImageUploadAndView = function(noteIndex: number) {
    var keys = Object.keys(vn.variables.attTempImages[noteIndex]);
    if(keys.length <= 0) return;
    var file;
    var tempEl;
    
    vn.elements.attImageUploadButtonAndViews[noteIndex].replaceChildren();
    for(var i = 0; i < keys.length; i++) {
        file = vn.variables.attTempImages[noteIndex][keys[i]];
        tempEl = document.createElement("img");
        tempEl.src = URL.createObjectURL(file);
        tempEl.style.width = "auto";
        tempEl.style.height = "100%";
        tempEl.style.display = "inline-block";
        tempEl.style.margin = "0 5px"
        
        vn.elements.attImageUploadButtonAndViews[noteIndex].appendChild(tempEl);
    }
    
    (vn.elements.attImageURLs[noteIndex] as any).value = "";
    vn.elements.attImageURLs[noteIndex].setAttribute("readonly","true");
};

export const createElement = function(elementTag: string, noteName: string, noteId: string, id: string, className: string, appendNodeSetObject?: any) {
    const element: any = document.createElement(elementTag);
    if(id !== "") {
        element.setAttribute("id", getId(noteName, noteId, id));
    }
    element.setAttribute("class", getClassName(noteName, noteId, className));
    if(appendNodeSetObject && typeof appendNodeSetObject === "object" && Object.keys(appendNodeSetObject).length !== 0) {
        var textNode;
        if(appendNodeSetObject["isIcon"]) {	//google icon
            var iconNode = document.createElement("span");
            iconNode.setAttribute("class","material-symbols-rounded " + getEventChildrenClassName(noteName) + " " + getClickCssEventElementClassName(noteName) + " " + getOnOverCssEventElementClassName(noteName) + " " + getId(noteName, noteId, "icon"));
            textNode = document.createTextNode(appendNodeSetObject["text"]);
            iconNode.appendChild(textNode);
            if(appendNodeSetObject["iconStyle"]) {
                iconNode.setAttribute("style",appendNodeSetObject["iconStyle"]);
            }
            iconNode.setAttribute("data-note-index",(idx as any));
            element.appendChild(iconNode);
        }
        else {	//just text node
            textNode = document.createTextNode(appendNodeSetObject["text"]);
            element.appendChild(textNode);
        }
    }
    return element;
};

export const createElementBasic = function(
    elementTag: string,
    noteName: string,
    noteId: string,
    id: string,
    className: string,
    noteElementEvent: Record<string, Function>,
    noteCssEvents: Record<string, Function>,
    appendNodeSetObject?: any) {
    const element = createElement(elementTag, noteName, noteId, id, className, appendNodeSetObject);
    addClickEvent(element, id, noteName, noteElementEvent, noteCssEvents);
    return element;
};

export const createElementButton = (
    elementTag: string,
    noteName: string,
    noteId: string,
    id: string,
    className: string,
    noteElementEvent: Record<string, Function>,
    noteCssEvents: Record<string, Function>,
    appendNodeSetObject?: any
) => {
    const element = createElement(elementTag, noteName, noteId, id, className, appendNodeSetObject);
    element.classList.add(getClickCssEventElementClassName(noteName));
    element.classList.add(getOnOverCssEventElementClassName(noteName));
    addClickEvent(element, id, noteName, noteElementEvent, noteCssEvents);
    addMouseoverEvent(element, id, noteName, noteCssEvents);
    addMouseoutEvent(element, id, noteName, noteCssEvents);
    addTouchstartEvent(element, id, noteName, noteCssEvents);
    addTouchendEvent(element, id, noteName, noteCssEvents);
    return element;
};

export const createElementSelect = (
    elementTag: string,
    noteName: string,
    noteId: string,
    id: string,
    className: string,
    noteElementEvent: Record<string, Function>,
    noteCssEvents: Record<string, Function>,
    appendNodeSetObject?: any
) => {
    const element = createElement(elementTag, noteName, noteId, id, className, appendNodeSetObject);
    element.classList.add(getClickCssEventElementClassName(noteName));
    element.classList.add(getOnOverCssEventElementClassName(noteName));
    element.setAttribute("type","select");
    addClickEvent(element, id, noteName, noteElementEvent, noteCssEvents);
    addMouseoverEvent(element, id, noteName, noteCssEvents);
    addMouseoutEvent(element, id, noteName, noteCssEvents);
    addTouchstartEvent(element, id, noteName, noteCssEvents);
    addTouchendEvent(element, id, noteName, noteCssEvents);
    return element;
};

export const createElementInput = (
    noteName: string,
    noteId: string,
    id: string,
    className: string,
    noteElementEvent: Record<string, Function>,
) => {
    const element = createElement("input", noteName, noteId, id, className);
    element.setAttribute("name", getId(noteName, noteId, id));
    element.setAttribute("autocapitalize", "none");
    element.setAttribute("placeholder","");
    
    element.addEventListener("input", function(event: any) {
        if(!(noteElementEvent as any)[id+"_onBeforeInput"](event)) return;
        (elementsEvent as any)[id+"_onInput"](event);
        (noteElementEvent as any)[id+"_onAfterInput"](event);
        
        event.stopImmediatePropagation();
    });
    element.addEventListener("blur", function(event: any) {
        if(!(noteElementEvent as any)[id+"_onBeforeBlur"](event)) return;
        (elementsEvent as any)[id+"_onBlur"](event);
        (noteElementEvent as any)[id+"_onAfterBlur"](event);
        
        event.stopImmediatePropagation();
    });
    return element;
};

var createElementInputCheckbox = function(element: any, id: string, className: string, idx: number) {
    element = createElement(element, "input", id, className, idx);
    element.setAttribute("name", getId(idx, id));
    element.setAttribute("placeholder","");
    element.setAttribute("type","checkbox");
    return element;
};

var createElementInputRadio = function(element: any, id: string, className: string, name: string, idx: number) {
    element = createElement(element, "input", id, className, idx);
    element.setAttribute("name", name);
    element.setAttribute("placeholder","");
    element.setAttribute("type","radio");
    addClickEvent(element, id);
    return element;
};

var createElementRadioLabel = function(forId: string, iconName: string) {
    var tempEl1;
    var tempEl2;
    tempEl1 = document.createElement("label");
    tempEl1.setAttribute("for", forId);
    tempEl1.setAttribute("style", "display:inline-block;width:30px;position:relative;margin-left:3px;;margin-left:3px;");
    tempEl2 = document.createElement("span");
    tempEl2.setAttribute("class","material-symbols-rounded");
    tempEl2.setAttribute("style","font-size:1.3em;position:absolute;bottom:-6px;cursor:pointer;color:" + getHexColorFromColorName(vn.colors.color1[i]));
    tempEl2.textContent = iconName;
    tempEl1.appendChild(tempEl2);
    return tempEl1;
};

export const createElementFontFamiliySelect = (
    elementTag: string,
    noteName: string,
    noteId: string,
    id: string,
    className: string,
    noteElementEvent: Record<string, Function>,
    noteCssEvents: Record<string, Function>,
    appendNodeSetObject?: any
) => {
    const element = createElement(elementTag, noteName, noteId, id, className, appendNodeSetObject);
    // The font event is dynamically generated
    (noteElementEvent as any)[id+"_onBeforeClick"] = function(event: any) {return true;};
    (elementsEvent as any)[id+"_onClick"] = function(event: any) {
        const note = getParentNote(event.target);
        fontFamilySelectList_onClick(event, note);
        selectToggle(event.target, note);
        // If the selection is a single point
        if(note._selection.editRange && note._selection.editRange.collapsed) {
            // Re-move to the original selection point
            setOriginEditSelection(note);
        }
        else {	// Dragging
            // Specify style for dragged characters
            modifySelectedSingleElement(noteIndex, getObjectNoteCss(noteIndex));
        }
    };
    (noteElementEvent as any)[id+"_onAfterClick"] = function(event: any) {};
    element.classList.add(getClickCssEventElementClassName(noteName));
    element.classList.add(getOnOverCssEventElementClassName(noteName));
    addClickEvent(element, id, noteName, noteElementEvent, noteCssEvents);
    addMouseoverEvent(element, id, noteName, noteCssEvents);
    addMouseoutEvent(element, id, noteName, noteCssEvents);
    addTouchstartEvent(element, id, noteName, noteCssEvents);
    addTouchendEvent(element, id, noteName, noteCssEvents);
    
    return element;
};

export const addClickEvent = (
    element: HTMLElement,
    id: string,
    noteName: string,
    noteElementEvent: Record<string, Function>,
    noteCssEvents: Record<string, Function>
) => {
    element.addEventListener("click", function(event: any) {
        if(noteCssEvents.target_onBeforeClick(event) && event.target.classList.contains(getClickCssEventElementClassName(noteName))) {
            target_onClick(event);
            noteCssEvents.target_onAfterClick(event);
        }
        
        if(!(noteElementEvent as any)[id+"_onBeforeClick"](event)) return;
        (elementsEvent as any)[id+"_onClick"](event);
        (noteElementEvent as any)[id+"_onAfterClick"](event);
        
        event.stopImmediatePropagation();
    });
}

export const  addMouseoverEvent = (element: any, id: string, noteName: string, noteCssEvents: Record<string, Function>) => {
    element.addEventListener("mouseover", function(event: any) {
        if(!noteCssEvents.target_onBeforeMouseover(event)) return;
        if(!event.target.classList.contains(getOnOverCssEventElementClassName(noteName))) return;
        
        target_onMouseover(event);
        
        noteCssEvents.target_onAfterMouseover(event);
        
        event.stopImmediatePropagation();
    });
}

export const  addMouseoutEvent = (element: any, id: string, noteName: string, noteCssEvents: Record<string, Function>) => {
    element.addEventListener("mouseout", function(event: any) {
        if(!noteCssEvents.target_onBeforeMouseout(event)) return;
        if(!event.target.classList.contains(getOnOverCssEventElementClassName(noteName))) return;
        
        target_onMouseout(event);
        
        noteCssEvents.target_onAfterMouseout(event);
        
        event.stopImmediatePropagation();
    });
}

export const  addTouchstartEvent = (element: any, id: string, noteName: string, noteCssEvents: Record<string, Function>) => {
    element.addEventListener("touchstart", function(event: any) {
        if(!noteCssEvents.target_onBeforeTouchstart(event)) return;
        if(!event.target.classList.contains(getOnOverCssEventElementClassName(noteName))) return;
        
        target_onTouchstart(event);
        
        noteCssEvents.target_onAfterTouchstart(event);
        
        event.stopImmediatePropagation();
    });
}

export const  addTouchendEvent = (element: any, id: string, noteName: string, noteCssEvents: Record<string, Function>) => {
    element.addEventListener("touchend", function(event: any) {
        if(!noteCssEvents.target_onBeforeTouchend(event)) return;
        if(!event.target.classList.contains(getOnOverCssEventElementClassName(noteName))) return;
        
        target_onTouchend(event);
        
        noteCssEvents.target_onAfterTouchend(event);
        
        event.stopImmediatePropagation();
    });
}
