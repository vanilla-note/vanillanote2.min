import type { Vanillanote, VanillanoteElement } from "../types/vanillanote";
import type { Handler } from "../types/handler";
import { getClassName, getClickCssEventElementClassName, getEventChildrenClassName, getHexColorFromColorName, getId, getOnOverCssEventElementClassName } from "./util";

export const setHandleCreateElement = (vn: Vanillanote, handler: Handler) => {
    handler.setAttTempFileValid = (note: VanillanoteElement) => {
        const newAttTempFiles: any = new Object;
        const keys = Object.keys(note._attTempFiles!);
        for(let i = 0; i < keys.length; i++) {
            if(note._attributes.attFileAcceptTypes.length > 0) {
                if(note._attributes.attFileAcceptTypes.includes(note._attTempFiles![keys[i]].type)) {
                    newAttTempFiles[keys[i]] = note._attTempFiles![keys[i]];
                }
            }
            else {
                newAttTempFiles[keys[i]] = note._attTempFiles![keys[i]];
            }
            
            if(!newAttTempFiles[keys[i]]) continue;
            
            if(note._attributes.attFilePreventTypes.includes(newAttTempFiles[keys[i]].type)) {
                handler.showAlert("[" + newAttTempFiles[keys[i]].name + "] " + vn.languageSet[note._attributes.language].attPreventType, vn.beforeAlert);
                delete newAttTempFiles[keys[i]];
            }
            else if(newAttTempFiles[keys[i]].size >= note._attributes.attFileMaxSize) {
                handler.showAlert("[" + newAttTempFiles[keys[i]].name + "] " + vn.languageSet[note._attributes.language].attOverSize, vn.beforeAlert);
                delete newAttTempFiles[keys[i]];
            }
        }
        note._attTempFiles = newAttTempFiles;
    };
    
    handler.setAttFileUploadDiv = (note: VanillanoteElement) => {
        if((note._attTempFiles as any).length <= 0) {
            note._elements.attFileUploadDiv.style.removeProperty("line-height");
            note._elements.attFileUploadDiv.textContent = vn.languageSet[note._attributes.language].attFileUploadDiv;
            return;
        } else {
            note._elements.attFileUploadDiv.style.lineHeight = "unset";
        }
        note._elements.attFileUploadDiv.replaceChildren();
        
        const keys = Object.keys(note._attTempFiles!);
        let tempEl;
        for(let i = 0; i < keys.length; i++) {
            tempEl = handler.getElement(
                note._attTempFiles![keys[i]].name,
                "P",
                "display:block;padding:0.5em 0;",
                {
                    "title":vn.languageSet[note._attributes.language].attFileListTooltip,
                    "uuid":keys[i]
                },
                note
            );
            note._elements.attFileUploadDiv.appendChild(tempEl);
        }
    };
    
    handler.setAttTempImageValid = (note: VanillanoteElement) => {
        const newAttTempImages: any = new Object;
        const keys = Object.keys(note._attTempImages!);
        for(let i = 0; i < keys.length; i++) {
            if(note._attributes.attImageAcceptTypes.length > 0) {
                if(note._attributes.attImageAcceptTypes.includes(note._attTempImages![keys[i]].type)) {
                    newAttTempImages[keys[i]] = note._attTempImages![keys[i]];
                }
            }
            else {
                newAttTempImages[keys[i]] = note._attTempImages![keys[i]];
            }
            
            if(!newAttTempImages[keys[i]]) continue;
            
            if(note._attributes.attImagePreventTypes.includes(newAttTempImages[keys[i]].type)) {
                handler.showAlert("[" + newAttTempImages[keys[i]].name + "] " + vn.languageSet[note._attributes.language].attPreventType, vn.beforeAlert);
                delete newAttTempImages[keys[i]];
            }
            else if(newAttTempImages[keys[i]].size >= note._attributes.attImageMaxSize) {
                handler.showAlert("[" + newAttTempImages[keys[i]].name + "] " + vn.languageSet[note._attributes.language].attOverSize, vn.beforeAlert);
                delete newAttTempImages[keys[i]];
            }
        }
        note._attTempImages = newAttTempImages;
    };
    
    handler.setAttImageUploadAndView = (note: VanillanoteElement) => {
        const keys = Object.keys(note._attTempImages!);
        if(keys.length <= 0) return;
        let file;
        let tempEl;
        
        note._elements.attImageUploadButtonAndView.replaceChildren();
        for(let i = 0; i < keys.length; i++) {
            file = note._attTempImages![keys[i]];
            tempEl = document.createElement("img");
            tempEl.src = URL.createObjectURL(file);
            tempEl.style.width = "auto";
            tempEl.style.height = "100%";
            tempEl.style.display = "inline-block";
            tempEl.style.margin = "0 5px"
            
            note._elements.attImageUploadButtonAndView.appendChild(tempEl);
        }
        
        (note._elements.attImageURL as any).value = "";
        note._elements.attImageURL.setAttribute("readonly","true");
    };
    
    handler.createElement = (elementTag: string, note: VanillanoteElement, id: string, className: string, appendNodeSetObject?: any) => {
        const element: HTMLElement = document.createElement(elementTag);
        if(id !== "") {
            element.setAttribute("id", getId(note._noteName, note._id, id));
        }
        element.setAttribute("data-note-id",note._id);
        element.setAttribute("class", getClassName(note._noteName, note._id, className));
        if(appendNodeSetObject && typeof appendNodeSetObject === "object" && Object.keys(appendNodeSetObject).length !== 0) {
            let textNode;
            if(appendNodeSetObject["isIcon"]) {	//google icon
                const iconNode = document.createElement("span");
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
    
    handler.createElementBasic = (
        elementTag: string,
        note: VanillanoteElement,
        id: string,
        className: string,
        appendNodeSetObject?: any
    ) => {
        const element = handler.createElement(elementTag, note, id, className, appendNodeSetObject);
        handler.addClickEvent(element, id, note);
        return element;
    };
    
    handler.createElementButton = (
        elementTag: string,
        note: VanillanoteElement,
        id: string,
        className: string,
        appendNodeSetObject?: any
    ) => {
        const element = handler.createElement(elementTag, note, id, className, appendNodeSetObject);
        element.classList.add(getClickCssEventElementClassName(note._noteName));
        element.classList.add(getOnOverCssEventElementClassName(note._noteName));
        handler.addClickEvent(element, id, note);
        handler.addMouseoverEvent(element, note);
        handler.addMouseoutEvent(element, note);
        handler.addTouchstartEvent(element, note);
        handler.addTouchendEvent(element, note);
        return element;
    };
    
    handler.createElementSelect = (
        elementTag: string,
        note: VanillanoteElement,
        id: string,
        className: string,
        appendNodeSetObject?: any
    ) => {
        const element = handler.createElement(elementTag, note, id, className, appendNodeSetObject);
        element.classList.add(getClickCssEventElementClassName(note._noteName));
        element.classList.add(getOnOverCssEventElementClassName(note._noteName));
        element.setAttribute("type","select");
        handler.addClickEvent(element, id, note);
        handler.addMouseoverEvent(element, note);
        handler.addMouseoutEvent(element, note);
        handler.addTouchstartEvent(element, note);
        handler.addTouchendEvent(element, note);
        return element;
    };
    
    handler.createElementInput = (
        note: VanillanoteElement,
        id: string,
        className: string,
    ) => {
        const element = handler.createElement("input", note, id, className) as HTMLInputElement;
        element.setAttribute("name", getId(note._noteName, note._id, id));
        element.setAttribute("autocapitalize", "none");
        element.setAttribute("placeholder","");
        
        element.addEventListener("input", (event: any) => {
            if(!(note._elementEvents as any)[id+"_onBeforeInput"](event)) return;
            (vn.events.elementEvents as any)[id+"_onInput"](event);
            (note._elementEvents as any)[id+"_onAfterInput"](event);
            
            event.stopImmediatePropagation();
        });
        element.addEventListener("blur", (event: any) => {
            if(!(note._elementEvents as any)[id+"_onBeforeBlur"](event)) return;
            (vn.events.elementEvents as any)[id+"_onBlur"](event);
            (note._elementEvents as any)[id+"_onAfterBlur"](event);
            
            event.stopImmediatePropagation();
        });
        return element;
    };
    
    handler.createElementInputCheckbox = (note: VanillanoteElement, id: string, className: string) => {
        const element = handler.createElement("input", note, id, className) as HTMLInputElement;
        element.setAttribute("name", getId(note._noteName, note._id, id));
        element.setAttribute("placeholder","");
        element.setAttribute("type","checkbox");
        return element;
    };
    
    handler.createElementInputRadio = (note: VanillanoteElement, id: string, className: string, name: string) => {
        const element = handler.createElement("input", note, id, className) as HTMLInputElement;
        element.setAttribute("name", name);
        element.setAttribute("placeholder","");
        element.setAttribute("type","radio");
        handler.addClickEvent(element, id, note);
        return element;
    };
    
    handler.createElementRadioLabel = (note: VanillanoteElement, forId: string, iconName: string) => {
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
    
    handler.createElementFontFamiliySelect = (
        elementTag: string,
        note: VanillanoteElement,
        id: string,
        className: string,
        appendNodeSetObject?: any
    ) => {
        const element = handler.createElement(elementTag, note, id, className, appendNodeSetObject);
        // The font event is dynamically generated
        //!!!!!!!!!!!!!!!!!!!!!!
        (note._elementEvents as any)[id+"_onBeforeClick"] = (event: any) => {return true;};
        (vn.events.elementEvents as any)[id+"_onClick"] = (event: any) => {
            handler.fontFamilySelectList_onClick(event, note);
            handler.selectToggle(event.target, note);
            // If the selection is a single point
            if(note._selection.editRange && note._selection.editRange.collapsed) {
                // Re-move to the original selection point
                handler.setOriginEditSelection(note);
            }
            else {	// Dragging
                // Specify style for dragged characters
                handler.modifySelectedSingleElement(note, handler.getObjectNoteCss(note));
            }
        };
        (note._elementEvents as any)[id+"_onAfterClick"] = (event: any) => {};
        element.classList.add(getClickCssEventElementClassName(note._noteName));
        element.classList.add(getOnOverCssEventElementClassName(note._noteName));
        handler.addClickEvent(element, id, note);
        handler.addMouseoverEvent(element, note);
        handler.addMouseoutEvent(element, note);
        handler.addTouchstartEvent(element, note);
        handler.addTouchendEvent(element, note);
        
        return element;
    };
    
    handler.addClickEvent = (
        element: HTMLElement,
        id: string,
        note: VanillanoteElement,
    ) => {
        element.addEventListener("click", (event: any) => {
            if(note._cssEvents.target_onBeforeClick(event) && event.target.classList.contains(getClickCssEventElementClassName(note._noteName))) {
                vn.events.cssEvents.target_onClick!(event);
                note._cssEvents.target_onAfterClick(event);
            }
            if(!(note._elementEvents as any)[id+"_onBeforeClick"](event)) return;
            (vn.events.elementEvents as any)[id+"_onClick"](event);
            (note._elementEvents as any)[id+"_onAfterClick"](event);
            
            event.stopImmediatePropagation();
        });
    };
    
    handler. addMouseoverEvent = (element: any, note: VanillanoteElement) => {
        element.addEventListener("mouseover", (event: any) => {
            if(!note._cssEvents.target_onBeforeMouseover(event)) return;
            if(!event.target.classList.contains(getOnOverCssEventElementClassName(note._noteName))) return;
            
            vn.events.cssEvents.target_onMouseover!(event);
            
            note._cssEvents.target_onAfterMouseover(event);
            
            event.stopImmediatePropagation();
        });
    };
    
    handler. addMouseoutEvent = (element: any, note: VanillanoteElement) => {
        element.addEventListener("mouseout", (event: any) => {
            if(!note._cssEvents.target_onBeforeMouseout(event)) return;
            if(!event.target.classList.contains(getOnOverCssEventElementClassName(note._noteName))) return;
            
            vn.events.cssEvents.target_onMouseout!(event);
            
            note._cssEvents.target_onAfterMouseout(event);
            
            event.stopImmediatePropagation();
        });
    };
    
    handler. addTouchstartEvent = (element: any, note: VanillanoteElement) => {
        element.addEventListener("touchstart", (event: any) => {
            if(!note._cssEvents.target_onBeforeTouchstart(event)) return;
            if(!event.target.classList.contains(getOnOverCssEventElementClassName(note._noteName))) return;
            
            vn.events.cssEvents.target_onTouchstart!(event);
            
            note._cssEvents.target_onAfterTouchstart(event);
            
            event.stopImmediatePropagation();
        });
    };
    
    handler. addTouchendEvent = (element: any, note: VanillanoteElement) => {
        element.addEventListener("touchend", (event: any) => {
            if(!note._cssEvents.target_onBeforeTouchend(event)) return;
            if(!event.target.classList.contains(getOnOverCssEventElementClassName(note._noteName))) return;
            
            vn.events.cssEvents.target_onTouchend!(event);
            
            note._cssEvents.target_onAfterTouchend(event);
            
            event.stopImmediatePropagation();
        });
    };
};
