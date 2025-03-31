import { target_onClick, target_onMouseout, target_onMouseover, target_onTouchend, target_onTouchstart } from "../events/cssEvent";
import { elementsEvent } from "../events/elementEvent";
import { Vanillanote, VanillanoteElement } from "../types/vanillanote";
import { getObjectNoteCss } from "./handleActive";
import { fontFamilySelectList_onClick, selectToggle } from "./handleElement";
import { modifySelectedSingleElement, setOriginEditSelection } from "./handleSelection";
import { getClassName, getClickCssEventElementClassName, getEventChildrenClassName, getHexColorFromColorName, getId, getOnOverCssEventElementClassName, getParentNote } from "./util";

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

export const createElement = function(elementTag: string, note: VanillanoteElement, id: string, className: string, appendNodeSetObject?: any) {
    const element: any = document.createElement(elementTag);
    if(id !== "") {
        element.setAttribute("id", getId(note._noteName, note._id, id));
    }
    element.setAttribute("class", getClassName(note._noteName, note._id, className));
    if(appendNodeSetObject && typeof appendNodeSetObject === "object" && Object.keys(appendNodeSetObject).length !== 0) {
        var textNode;
        if(appendNodeSetObject["isIcon"]) {	//google icon
            var iconNode = document.createElement("span");
            iconNode.setAttribute("class","material-symbols-rounded " + getEventChildrenClassName(note._noteName) + " " + getClickCssEventElementClassName(note._noteName) + " " + getOnOverCssEventElementClassName(note._noteName) + " " + getId(note._noteName, note._id, "icon"));
            textNode = document.createTextNode(appendNodeSetObject["text"]);
            iconNode.appendChild(textNode);
            if(appendNodeSetObject["iconStyle"]) {
                iconNode.setAttribute("style",appendNodeSetObject["iconStyle"]);
            }
            iconNode.setAttribute("data-note-id", note._id);
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
    note: VanillanoteElement,
    id: string,
    className: string,
    appendNodeSetObject?: any) {
    const element = createElement(elementTag, note, id, className, appendNodeSetObject);
    addClickEvent(element, id, note);
    return element;
};

export const createElementButton = (
    elementTag: string,
    note: VanillanoteElement,
    id: string,
    className: string,
    appendNodeSetObject?: any
) => {
    const element = createElement(elementTag, note, id, className, appendNodeSetObject);
    element.classList.add(getClickCssEventElementClassName(note._noteName));
    element.classList.add(getOnOverCssEventElementClassName(note._noteName));
    addClickEvent(element, id, note);
    addMouseoverEvent(element, note);
    addMouseoutEvent(element, note);
    addTouchstartEvent(element, note);
    addTouchendEvent(element, note);
    return element;
};

export const createElementSelect = (
    elementTag: string,
    note: VanillanoteElement,
    id: string,
    className: string,
    appendNodeSetObject?: any
) => {
    const element = createElement(elementTag, note, id, className, appendNodeSetObject);
    element.classList.add(getClickCssEventElementClassName(note._noteName));
    element.classList.add(getOnOverCssEventElementClassName(note._noteName));
    element.setAttribute("type","select");
    addClickEvent(element, id, note);
    addMouseoverEvent(element, note);
    addMouseoutEvent(element, note);
    addTouchstartEvent(element, note);
    addTouchendEvent(element, note);
    return element;
};

export const createElementInput = (
    note: VanillanoteElement,
    id: string,
    className: string,
) => {
    const element = createElement("input", note, id, className);
    element.setAttribute("name", getId(note._noteName, note._id, id));
    element.setAttribute("autocapitalize", "none");
    element.setAttribute("placeholder","");
    
    element.addEventListener("input", function(event: any) {
        if(!(note._elementEvents as any)[id+"_onBeforeInput"](event)) return;
        (elementsEvent as any)[id+"_onInput"](event);
        (note._elementEvents as any)[id+"_onAfterInput"](event);
        
        event.stopImmediatePropagation();
    });
    element.addEventListener("blur", function(event: any) {
        if(!(note._elementEvents as any)[id+"_onBeforeBlur"](event)) return;
        (elementsEvent as any)[id+"_onBlur"](event);
        (note._elementEvents as any)[id+"_onAfterBlur"](event);
        
        event.stopImmediatePropagation();
    });
    return element;
};

export const createElementInputCheckbox = (note: VanillanoteElement, id: string, className: string) => {
    const element = createElement("input", note, id, className);
    element.setAttribute("name", getId(note._noteName, note._id, id));
    element.setAttribute("placeholder","");
    element.setAttribute("type","checkbox");
    return element;
};

export const createElementInputRadio = (note: VanillanoteElement, id: string, className: string, name: string) => {
    const element = createElement("input", note, id, className);
    element.setAttribute("name", name);
    element.setAttribute("placeholder","");
    element.setAttribute("type","radio");
    addClickEvent(element, id, note);
    return element;
};

export const createElementRadioLabel = (note: VanillanoteElement, forId: string, iconName: string) => {
    const tempEl1 = document.createElement("label");
    tempEl1.setAttribute("for", forId);
    tempEl1.setAttribute("style", "display:inline-block;width:30px;position:relative;margin-left:3px;;margin-left:3px;");
    const tempEl2 = document.createElement("span");
    tempEl2.setAttribute("class","material-symbols-rounded");
    tempEl2.setAttribute("style","font-size:1.3em;position:absolute;bottom:-6px;cursor:pointer;color:" + getHexColorFromColorName(note._colors.color1));
    tempEl2.textContent = iconName;
    tempEl1.appendChild(tempEl2);
    return tempEl1;
};

export const createElementFontFamiliySelect = (
    elementTag: string,
    note: VanillanoteElement,
    id: string,
    className: string,
    appendNodeSetObject?: any
) => {
    const element = createElement(elementTag, note, id, className, appendNodeSetObject);
    // The font event is dynamically generated
    (note._elementEvents as any)[id+"_onBeforeClick"] = function(event: any) {return true;};
    (elementsEvent as any)[id+"_onClick"] = function(event: any) {
        fontFamilySelectList_onClick(event, note);
        selectToggle(event.target, note);
        // If the selection is a single point
        if(note._selection.editRange && note._selection.editRange.collapsed) {
            // Re-move to the original selection point
            setOriginEditSelection(note);
        }
        else {	// Dragging
            // Specify style for dragged characters
            modifySelectedSingleElement(note, getObjectNoteCss(note));
        }
    };
    (note._elementEvents as any)[id+"_onAfterClick"] = function(event: any) {};
    element.classList.add(getClickCssEventElementClassName(note._noteName));
    element.classList.add(getOnOverCssEventElementClassName(note._noteName));
    addClickEvent(element, id, note);
    addMouseoverEvent(element, note);
    addMouseoutEvent(element, note);
    addTouchstartEvent(element, note);
    addTouchendEvent(element, note);
    
    return element;
};

export const addClickEvent = (
    element: HTMLElement,
    id: string,
    note: VanillanoteElement,
) => {
    element.addEventListener("click", function(event: any) {
        if(note._cssEvents.target_onBeforeClick(event) && event.target.classList.contains(getClickCssEventElementClassName(note._noteName))) {
            target_onClick(event, note._noteName, note._id);
            note._cssEvents.target_onAfterClick(event);
        }
        
        if(!(note._elementEvents as any)[id+"_onBeforeClick"](event)) return;
        (elementsEvent as any)[id+"_onClick"](event);
        (note._elementEvents as any)[id+"_onAfterClick"](event);
        
        event.stopImmediatePropagation();
    });
}

export const  addMouseoverEvent = (element: any, note: VanillanoteElement) => {
    element.addEventListener("mouseover", function(event: any) {
        if(!note._cssEvents.target_onBeforeMouseover(event)) return;
        if(!event.target.classList.contains(getOnOverCssEventElementClassName(note._noteName))) return;
        
        target_onMouseover(event, note._noteName, note._id);
        
        note._cssEvents.target_onAfterMouseover(event);
        
        event.stopImmediatePropagation();
    });
}

export const  addMouseoutEvent = (element: any, note: VanillanoteElement) => {
    element.addEventListener("mouseout", function(event: any) {
        if(!note._cssEvents.target_onBeforeMouseout(event)) return;
        if(!event.target.classList.contains(getOnOverCssEventElementClassName(note._noteName))) return;
        
        target_onMouseout(event, note._noteName, note._id);
        
        note._cssEvents.target_onAfterMouseout(event);
        
        event.stopImmediatePropagation();
    });
}

export const  addTouchstartEvent = (element: any, note: VanillanoteElement) => {
    element.addEventListener("touchstart", function(event: any) {
        if(!note._cssEvents.target_onBeforeTouchstart(event)) return;
        if(!event.target.classList.contains(getOnOverCssEventElementClassName(note._noteName))) return;
        
        target_onTouchstart(event, note._noteName, note._id);
        
        note._cssEvents.target_onAfterTouchstart(event);
        
        event.stopImmediatePropagation();
    });
}

export const  addTouchendEvent = (element: any, note: VanillanoteElement) => {
    element.addEventListener("touchend", function(event: any) {
        if(!note._cssEvents.target_onBeforeTouchend(event)) return;
        if(!event.target.classList.contains(getOnOverCssEventElementClassName(note._noteName))) return;
        
        target_onTouchend(event, note._noteName, note._id);
        
        note._cssEvents.target_onAfterTouchend(event);
        
        event.stopImmediatePropagation();
    });
}
