import type { Vanillanote, VanillanoteElement } from "../types/vanillanote";
import type { Handler } from "../types/handler";
import { ToolPosition } from "../types/enums";
import { checkNumber, compareObject, extractNumber, extractUnit, getEventChildrenClassName, getHexColorFromColorName, getHexFromRGBA, getId, getNoteId, getObjectFromCssText, getOpacityFromRGBA, getParentNote, getRGBAFromHex, isCloserToRight } from "./util";

export const setHandleHandleElement = (vn: Vanillanote, handler: Handler) => {
    handler.closeAllTooltip = (note: VanillanoteElement) => {
        note._elements.attLinkTooltip.style.opacity = "0";
        note._elements.attLinkTooltip.style.height  = "0";
        note._elements.attImageAndVideoTooltip.style.opacity = "0";
        note._elements.attImageAndVideoTooltip.style.height  = "0";
    };
    
    handler.setVariableButtonTogle = (note: VanillanoteElement, cssObject: Record<string, string>) => {
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
    
    handler.button_onToggle = (target: any, toggle: boolean) => {
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
    
    handler.allButtonToggle = (note: VanillanoteElement) => {
        //format
        handler.button_onToggle(note._elements.boldButton, note._status.boldToggle);
        handler.button_onToggle(note._elements.underlineButton, note._status.underlineToggle);
        handler.button_onToggle(note._elements.italicButton, note._status.italicToggle);
        handler.button_onToggle(note._elements.ulButton, note._status.ulToggle);
        handler.button_onToggle(note._elements.olButton, note._status.olToggle);
        //color
        (note._elements.colorTextSelect as any).querySelector("."+getEventChildrenClassName(note._noteName)).style.color
        = getRGBAFromHex(note._status.colorTextRGB, note._status.colorTextOpacity === "0" ? "1" : note._status.colorTextOpacity);
        (note._elements.colorBackSelect as any).querySelector("."+getEventChildrenClassName(note._noteName)).style.color
        = getRGBAFromHex(note._status.colorBackRGB, note._status.colorBackOpacity === "0" ? "1" : note._status.colorBackOpacity);
    };
    
    handler.selectToggle = (target: any, _note?: VanillanoteElement) => {
        const note = _note ? _note : getParentNote(target);
        if(!note) return;
        // If a child element is selected, event is controlled
        if(target.classList.contains(getEventChildrenClassName(note._noteName))) {
            target = target.parentNode!;
        }
        let select = target;
        let isClickBox = false;
        // If select box is selected
        while(select && select.getAttribute("type") !== "select") {
            isClickBox = true;
            select = select.parentNode;
        }
        if(!select.getAttribute("data-note-id")) return;
        const selectId = select.getAttribute("id");
        let selectBox: any;
        
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
        
        const displayBlock = getId(note._noteName, note._id, "on_display_block");
        const displayNone = getId(note._noteName, note._id, "on_display_none");
        const isOpened = selectBox.classList.contains(displayBlock);
        
        handler.closeAllSelectBoxes(note);	//Close all other select boxes
        
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
            const selectBoxRect = selectBox.getBoundingClientRect();
            if(selectBoxRect.top === 0) return
            
            if(note._elements.tool.offsetParent === null) return;
            const toolRect = note._elements.tool.getBoundingClientRect();
            
            if(toolRect.left > selectBoxRect.left) {
                selectBox.style.right = selectBoxRect.left - 1 + "px";
            }
        }
        else {
            //closer left
            selectBox.style.removeProperty("right");
            selectBox.style.left = "0%";
            
            if(selectBox.offsetParent === null) return;
            const selectBoxRect = selectBox.getBoundingClientRect();
            if(selectBoxRect.top === 0) return
            
            if(note._elements.tool.offsetParent === null) return;
            const toolRect = note._elements.tool.getBoundingClientRect();
            
            if(toolRect.right < selectBoxRect.right) {
                selectBox.style.left = toolRect.right - (selectBoxRect.right + 1) + "px";
            }
        }
    };
    
    handler.closeAllSelectBoxes = (note: VanillanoteElement) => {
        const displayBlock = getId(note._noteName, note._id, "on_display_block");
        const displayNone = getId(note._noteName, note._id, "on_display_none");
        
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
    
    handler.fontFamilySelectList_onClick = (e: any, _note?: VanillanoteElement) => {
        if(!e.target) return;
        const selectLsit = e.target;
        const note = _note ? _note : getParentNote(e.target);
        if(!note) return;
        const fontFamily = selectLsit.getAttribute("data-font-family");
        const oldStyleObject: any = getObjectFromCssText(note._elements.fontFamilySelect.getAttribute("style")!);
        oldStyleObject["font-family"] = fontFamily;
        // Change the font family in the variables and the displayed select list option.
        note._status.fontFamily = fontFamily;
        (note._elements.fontFamilySelect as any).firstChild.textContent = fontFamily.length > 12 ? fontFamily.substr(0,12) + "..." : fontFamily;
        (note._elements.fontFamilySelect as any).style.fontFamily = fontFamily;
    };
    
    handler.setEditStyleTag = (note: VanillanoteElement) => {
        if(note._selection.setEditStyleTagToggle > 0) {
            note._selection.setEditStyleTagToggle--;
            return;
        }
        let tempEl: any = note._selection.editStartUnitElement;
        let textarea = tempEl;
        while(tempEl) {
            if(tempEl.tagName === (note._noteName+"-textarea").toUpperCase()) {
                textarea = tempEl;
                break;
            }
            tempEl = tempEl.parentNode;
        }
        if(!textarea) {
            Object.keys(vn.vanillanoteElements).forEach((id) => {
                handler.initToggleButtonVariables(vn.vanillanoteElements[id]);
            });
            return;
        }
        
        // Get styles of the selected element
        let cssObjectEl = handler.getObjectEditElementCss(note._selection.editStartElement, note);
        // If multiple elements are selected, check if all tags have the same styles
        // If not, clear the cssObjectEl
        if(note._selection.editStartNode !== note._selection.editEndNode) {
            let tempCssObjectEl = cssObjectEl;
            let isCheck = false;
            let isEnd = false;
            const getCheckAllStyle = (element: any) => {
                for(let i = 0; i < element.childNodes.length; i++) {
                    if(isEnd) break;
                    if(note._selection.editStartNode === element.childNodes[i]) {
                        isCheck = true;
                    }
                    if(isCheck && element.childNodes[i].nodeType === 3 && element.childNodes[i].textContent) {
                        tempCssObjectEl = handler.getObjectEditElementCss(element.childNodes[i], note);
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
        handler.setVariableButtonTogle(note, cssObjectEl);
        // Get the current selected tag
        const nowTag = handler.getEditElementTag(note);
        // Change the note's tag variables (toggle)
        handler.setTagToggle(note, nowTag);
        // Toggle buttons for the note
        handler.allButtonToggle(note);
    };
    
    handler.setElementScroll = (parentElement: any, childElement: any, mobileKeyboardExceptHeight: number) => {
        if(!parentElement || !childElement) return;
        if(childElement.nodeType === 3) childElement = childElement.parentNode;
        let start: any = null;
        const target = childElement.offsetTop - Math.round(mobileKeyboardExceptHeight / 2) + Math.round(childElement.offsetHeight / 2);
        const firstPosition = parentElement.scrollTop;
        const difference = target - firstPosition;
        const duration = 500; // Animation duration in milliseconds
        
        function step(timestamp: any) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const percent = Math.min(progress / duration, 1);
            parentElement.scrollTop = firstPosition + difference * percent;
    
            // Continue the animation as long as it's not finished
            if (progress < duration) {
                window.requestAnimationFrame(step);
            }
        }
        
        window.requestAnimationFrame(step);
    };
    
    handler.getCheckSelectBoxesOpened = (note: VanillanoteElement) => {
        const displayBlock = getId(note._noteName, note._id, "on_display_block");
        
        if(note._elements.paragraphStyleSelectBox.classList.contains(displayBlock)) return true;
        if(note._elements.textAlignSelectBox.classList.contains(displayBlock)) return true;
        if(note._elements.fontFamilySelectBox.classList.contains(displayBlock)) return true;
        if(note._elements.colorTextSelectBox.classList.contains(displayBlock)) return true;
        if(note._elements.colorBackSelectBox.classList.contains(displayBlock)) return true;
        
        return false;
    };
    
    handler.closeAllModal = (note: VanillanoteElement) => {
        const displayBlock = getId(note._noteName, note._id, "on_display_block");
        const displayNone = getId(note._noteName, note._id, "on_display_none");
        
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
        handler.initAttLink(note);
        //Initialize attachment file modal
        handler.initAttFile(note);
        //Initialize attachment image modal
        handler.initAttImage(note);
    };
    
    handler.openAttLinkModal = (note: VanillanoteElement) => {
        // Restore the note size.
        handler.doIncreaseTextareaHeight(vn);
        
        // Close all modals
        handler.closeAllModal(note);
        // Close all selects
        handler.closeAllSelectBoxes(note);
        // Adjust modal size
        handler.setAllModalSize(note);
        // Open modal background
        const displayBlock = getId(note._noteName, note._id, "on_display_block");
        const displayNone = getId(note._noteName, note._id, "on_display_none");
        note._elements.modalBack.classList.remove(displayNone);
        note._elements.modalBack.classList.add(displayBlock);
        note._elements.attLinkModal.classList.remove(displayNone);
        note._elements.attLinkModal.classList.add(displayBlock);
        
        if(!handler.isValidSelection(note)) {
            handler.validCheckAttLink(note);
            return;	
        }
        
        const attLinkText: any = note._elements.attLinkText;
        const attLinkHref: any = note._elements.attLinkHref;
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
        
        handler.validCheckAttLink(note);
    };
    
    handler.openPlaceholder = (note: VanillanoteElement) => {
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
    
    handler.closePlaceholder = (note: VanillanoteElement) => {
        if(note._attributes.placeholderIsVisible) {
            note._elements.placeholder.classList.remove(getId(note._noteName, note._id, "on_display_block"));
            note._elements.placeholder.classList.add(getId(note._noteName, note._id, "on_display_none"));
        }
    };
    
    handler.setAllModalSize = (note: VanillanoteElement) => {
        if(note._elements.template.offsetParent === null) return
        // Use setTimeout to adjust size according to the dynamic change in textarea's size.
        setTimeout(() => {
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
    
    handler.setPlaceholderSize = (note: VanillanoteElement) => {
        // Use setTimeout to adjust size according to the dynamic change in textarea's size.
        setTimeout(() => {
            if(!note._attributes.placeholderIsVisible) return;
            handler.closePlaceholder(note);
            if(note._elements.textarea.offsetParent === null) return
            note._elements.placeholder.style.top = (note._elements.textarea.offsetTop + note._attributes.placeholderAddTop) + "px";
            note._elements.placeholder.style.left = (note._elements.textarea.offsetLeft + note._attributes.placeholderAddLeft) + "px";
            note._elements.placeholder.style.width = note._attributes.placeholderWidth ? note._attributes.placeholderWidth : note._elements.textarea.clientWidth + "px";
            handler.openPlaceholder(note);
        },100);
    };
    
    handler.setAllToolTipPosition = (note: VanillanoteElement) => {
        if(note._attributes.toolPosition === ToolPosition.bottom) {
            note._elements.attLinkTooltip.style.bottom = note._elements.tool.style.height;
            note._elements.attImageAndVideoTooltip.style.bottom = note._elements.tool.style.height;
        }
    };
    
    handler.appearAttLinkToolTip = (note: VanillanoteElement) => {
        const a: any = note._selection.editStartNode!.parentElement;
    
        const href = a.getAttribute("href");
        const download = a.getAttribute("download");
    
        const displayInlineBlock = getId(note._noteName, note._id, "on_display_inline_block");
        const displayNone = getId(note._noteName, note._id, "on_display_none");
    
        note._elements.attLinkTooltipEditButton.classList.remove(displayNone);
        note._elements.attLinkTooltipUnlinkButton.classList.remove(displayNone);
        note._elements.attLinkTooltipEditButton.classList.add(displayInlineBlock);
        note._elements.attLinkTooltipUnlinkButton.classList.add(displayInlineBlock);
    
        if(href) {
            note._elements.attLinkTooltipHref.setAttribute("href",href);
            note._elements.attLinkTooltipHref.textContent = href.length > 25 ? href.substr(0,25) + "..." : href;
        }
        if(download) {
            note._elements.attLinkTooltipHref.setAttribute("download",download);
            note._elements.attLinkTooltipHref.textContent = "download : " + download;
    
            note._elements.attLinkTooltipEditButton.classList.remove(displayInlineBlock);
            note._elements.attLinkTooltipUnlinkButton.classList.remove(displayInlineBlock);
            note._elements.attLinkTooltipEditButton.classList.add(displayNone);
            note._elements.attLinkTooltipUnlinkButton.classList.add(displayNone);
        }
    
        note._elements.attLinkTooltip.style.opacity = "0.95";
        note._elements.attLinkTooltip.style.height  = note._attributes.sizeRate * 54 * 0.8 + "px";
        note._elements.attLinkTooltip.style.lineHeight  = note._attributes.sizeRate * 54 * 0.8 + "px";
    };
    
    handler.appearAttImageAndVideoTooltip = (note: VanillanoteElement) => {
        const img = note._selection.editStartNode;
        const cssObj: any = getObjectFromCssText((handler.getAttributesObjectFromElement(img) as any)["style"]);
        //width
        if(cssObj["width"]) {
            (note._elements.attImageAndVideoTooltipWidthInput as any).value = extractNumber(cssObj["width"]);
        }
        //float
        switch(cssObj["float"]) {
        case "left":
            (note._elements.attImageAndVideoTooltipFloatRadioLeft as any).checked = true;
            break;
        case "right":
            (note._elements.attImageAndVideoTooltipFloatRadioRight as any).checked = true;
            break;
        default :
            (note._elements.attImageAndVideoTooltipFloatRadioNone as any).checked = true;
            break;
        }
        //shape
        (note._elements.attImageAndVideoTooltipShapeRadioSquare as any).checked = true;
        if(cssObj["border-radius"]) {
            const borderRadius: any = extractNumber(cssObj["border-radius"]);
            if(borderRadius > 0) {
                (note._elements.attImageAndVideoTooltipShapeRadioRadius as any).checked = true;
            }
            else if(borderRadius >= 50) {
                (note._elements.attImageAndVideoTooltipShapeRadioCircle as any).checked = true;
            }
        }
        
        note._elements.attImageAndVideoTooltip.style.opacity = "0.9";
        note._elements.attImageAndVideoTooltip.style.height  = note._attributes.sizeRate * 54 * 0.8 * 2 + "px";
        note._elements.attImageAndVideoTooltip.style.lineHeight  = note._attributes.sizeRate * 54 * 0.7 + "px";
    };
    
    handler.setImageAndVideoWidth = (el: any) => {
        if(!el.value) el.value = 100;
        let widthPer = el.value;
        const note = getParentNote(el);
        if(!note) return;
        const imgNode: any = note._selection.editStartNode;
        if(imgNode.tagName !== "IMG" && imgNode.tagName !== "IFRAME") return;
        
        if(widthPer < 10) widthPer = 10;
        if(widthPer > 100) widthPer = 100;
        el.value = widthPer;
        imgNode.style.width = widthPer + "%";
        (note._selection.editStartNode as any).parentNode.replaceChild(imgNode, (note._selection.editStartNode as any));
        note._selection.editStartNode = imgNode;
    };
    
    handler.setAllToolSize = (note: VanillanoteElement) => {
        const toolButtons: any =  note._elements.tool.childNodes;
        
        const displayInlineBlock = getId(note._noteName, note._id, "on_display_inline_block");
        const displayNone = getId(note._noteName, note._id, "on_display_none");
        
        // Display all buttons (reset their display style)
        for(let i = toolButtons.length - 1; i >= 0; i--) {
            toolButtons[i].classList.add(displayInlineBlock);
            toolButtons[i].classList.remove(displayNone);
        }
        
        if(note._elements.tool.offsetParent === null) return;
        
        // Control toolbar size based on toggle state
        if(!note._status.toolToggle) {	// Toggle false state: Resize the toolbar based on the last visible button.
            let toolAbsoluteTop;
            let lastButton;
            let lastButtonAbsoluteTop;
            let differ;
            
            for(let i = toolButtons.length - 1; i >= 0; i--) {
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
            for(let i = toolButtons.length - 1; i >= 0; i--) {
                if(!handler.isElementInParentBounds(note._elements.tool,toolButtons[i])) {
                    toolButtons[i].classList.remove(displayInlineBlock);
                    toolButtons[i].classList.add(displayNone);
                }
            }
        }
    };
    
    handler.doDecreaseTextareaHeight = (note: VanillanoteElement) => {
        // Stop if not in auto-scroll mode.
        if(!note._attributes.isNoteByMobile) return;
        note._elements.textarea.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
        setTimeout(() => {
            if(extractUnit(note._attributes.textareaOriginHeight) !== 'px') return;
            if(vn.variables.mobileKeyboardExceptHeight! < extractNumber(note._attributes.textareaOriginHeight)!
                && vn.variables.mobileKeyboardExceptHeight! < note._elements.textarea.offsetHeight) {
                note._elements.textarea.style.height = vn.variables.mobileKeyboardExceptHeight + "px";
            }
        }, 100);
    };
    
    handler.doIncreaseTextareaHeight = (vn: Vanillanote) => {
        const noteIds = Object.keys(vn.vanillanoteElements);
        // Restore the note size.
        for(let i = 0; i < noteIds.length; i++) {
            const note = vn.vanillanoteElements[noteIds[i]]
            if(!note._attributes.isNoteByMobile) continue;
            note._elements.textarea.style.height = note._attributes.textareaOriginHeight;
        }
    };
    
    handler.modifyTextareaScroll = (textarea: any, note: VanillanoteElement) => {
        // Stop if not in auto-scroll mode.
        if(!note._attributes.isNoteByMobile) return;
        
        if(vn.variables.preventChangeScroll > 0) {
            vn.variables.preventChangeScroll--;
            return;	
        }
        if(vn.variables.isSelectionProgress) return;
        vn.variables.isSelectionProgress = true;
        // 0.05 seconds time out.
        setTimeout(() => {
            vn.variables.isSelectionProgress = false;
            
            //If there is unvalid selection, return.
            if(!handler.isValidSelection(note)) return;
            
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
            if(handler.getCheckSelectBoxesOpened(note)) return;
            if((note._selection.editRange as any).collapsed) {
                handler.setElementScroll(textarea, note._selection.editStartElement, vn.variables.mobileKeyboardExceptHeight!);
            }
            else {
                handler.setElementScroll(textarea, note._selection.editDragUnitElement[indexMiddleUnit], vn.variables.mobileKeyboardExceptHeight!);
            }
                    
        }, 50);
    };
    
    handler.initTextarea = (textarea: HTMLElement) =>  {
        // Remove all existing child elements of the textarea.
        while(textarea.firstChild) {
            textarea.removeChild(textarea.firstChild);
        }
        const tempEl1 = document.createElement("P");
        const tempEl2 = document.createElement("BR");
        tempEl1.appendChild(tempEl2);
        textarea.appendChild(tempEl1);
        // Sets the new selection range.
        handler.setNewSelection(tempEl1, 0, tempEl1, 0);
    };
}
