import type { Vanillanote } from "../types/vanillanote";
import { setAttFileUploadDiv, setAttImageUploadAndView, setAttTempFileValid, setAttTempImageValid } from "../utils/createElement";
import { connectObserver, doEditUnitCheck, getElement, getNextElementsUntilNotTag, getObjectNoteCss, getPreviousElementsUntilNotTag, initToggleButtonVariables, removeEmptyElment, replaceDifferentBetweenElements, validCheckAttLink, validCheckAttVideo } from "../utils/handleActive";
import { button_onToggle, closeAllModal, closeAllSelectBoxes, closePlaceholder, doIncreaseTextareaHeight, initTextarea, openAttLinkModal, openPlaceholder, selectToggle, setAllModalSize, setAllToolSize, setAllToolTipPosition, setImageAndVideoWidth } from "../utils/handleElement";
import { isValidSelection, modifySelectedSingleElement, modifySelectedUnitElementStyle, modifySelectedUnitElementTag, setEditSelection, setNewSelection, setOriginEditSelection, textarea_onBeforeinputSpelling, textarea_onKeydownEnter } from "../utils/handleSelection";
import { checkHex, checkNumber, checkRealNumber, getClassName, getCssTextFromObject, getEventChildrenClassName, getHexColorFromColorName, getId, getParentNote, getRGBAFromHex, getUUID, isMobileDevice } from "../utils/util";

export const setElementEvents = (vn: Vanillanote) => {
    //toolToggleButton event
    vn.events.elementEvents.toolToggleButton_onClick = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        const icon: any = note._elements.toolToggleButton.firstChild;
        //toggle
        note._status.toolToggle = !note._status.toolToggle;
        if(!note._status.toolToggle) { //in case of open
            icon.textContent = "arrow_drop_up";
            // Adjust toolbar size.
            setAllToolSize(note);
            // Adjust the position of the tooltip.
            setAllToolTipPosition(note);
        }
        else {	// In case of closing
            icon.textContent = "arrow_drop_down";
            // Adjust toolbar size.
            setAllToolSize(note);
            // Adjust the position of the tooltip.
            setAllToolTipPosition(note);
        }
        vn.variables.preventChangeScroll = 2;
        // It's too inconvenient if the cursor is caught again on mobile..
        if(!isMobileDevice()) {
            setOriginEditSelection(note);
        }
    };

    //==================================================================================
    //paragraphStyleSelect event
    vn.events.elementEvents.paragraphStyleSelect_onClick = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        selectToggle(e.target, note);
        // It's too inconvenient if the cursor is caught again on mobile..
        if(!isMobileDevice()) {
            setOriginEditSelection(note);
        }
    };

    //==================================================================================
    //styleNomal event
    vn.events.elementEvents.styleNomal_onClick = (e: any) => {
        const note = getParentNote(e.target);
        // If a child element is selected, event is controlled
        let target = e.target;
        if(target.classList.contains(getEventChildrenClassName(note._noteName))) {
            target = target.parentNode;
        }
        // Changing the tag
        modifySelectedUnitElementTag(target, note);
        selectToggle(target, note);
    };

    //==================================================================================
    //styleHeader1 event
    vn.events.elementEvents.styleHeader1_onClick = (e: any) => {
        const note = getParentNote(e.target);
        // If a child element is selected, event is controlled
        let target = e.target;
        if(target.classList.contains(getEventChildrenClassName(note._noteName))) {
            target = target.parentNode;
        }
        // Changing the tag
        modifySelectedUnitElementTag(target, note);
        selectToggle(target, note);
    };
    //==================================================================================
    //styleHeader2 event
    vn.events.elementEvents.styleHeader2_onClick = (e: any) => {
        const note = getParentNote(e.target);
        // If a child element is selected, event is controlled
        let target = e.target;
        if(target.classList.contains(getEventChildrenClassName(note._noteName))) {
            target = target.parentNode;
        }
        // Changing the tag
        modifySelectedUnitElementTag(target, note);
        selectToggle(target, note);
    };
    //==================================================================================
    //styleHeader3 event
    vn.events.elementEvents.styleHeader3_onClick = (e: any) => {
        const note = getParentNote(e.target);
        // If a child element is selected, event is controlled
        let target = e.target;
        if(target.classList.contains(getEventChildrenClassName(note._noteName))) {
            target = target.parentNode;
        }
        // Changing the tag
        modifySelectedUnitElementTag(target, note);
        selectToggle(target, note);
    };
    //==================================================================================
    //styleHeader4 event
    vn.events.elementEvents.styleHeader4_onClick = (e: any) => {
        const note = getParentNote(e.target);
        // If a child element is selected, event is controlled
        let target = e.target;
        if(target.classList.contains(getEventChildrenClassName(note._noteName))) {
            target = target.parentNode;
        }
        // Changing the tag
        modifySelectedUnitElementTag(target, note);
        selectToggle(target, note);
    };
    //==================================================================================
    //styleHeader5 event
    vn.events.elementEvents.styleHeader5_onClick = (e: any) => {
        const note = getParentNote(e.target);
        // If a child element is selected, event is controlled
        let target = e.target;
        if(target.classList.contains(getEventChildrenClassName(note._noteName))) {
            target = target.parentNode;
        }
        // Changing the tag
        modifySelectedUnitElementTag(target, note);
        selectToggle(target, note);
    };
    //==================================================================================
    //styleHeader6 event
    vn.events.elementEvents.styleHeader6_onClick = (e: any) => {
        const note = getParentNote(e.target);
        // If a child element is selected, event is controlled
        let target = e.target;
        if(target.classList.contains(getEventChildrenClassName(note._noteName))) {
            target = target.parentNode;
        }
        // Changing the tag
        modifySelectedUnitElementTag(target, note);
        selectToggle(target, note);
    };

    //==================================================================================
    //boldButton event
    vn.events.elementEvents.boldButton_onClick = (e: any) => {
        // Toggle the button
        const note = getParentNote(e.target);
        if(!note) return;
        note._status.boldToggle = !note._status.boldToggle;
        if(!isMobileDevice()) {
            button_onToggle(note._elements.boldButton, note._status.boldToggle);
        }
        
        // If the selection is a single point
        if(note._selection.editRange && (note._selection.editRange as any).collapsed) {
            // Re-move to the original selection point
            setOriginEditSelection(note);
        }
        else {	// Dragging
            // Specify style for dragged characters
            modifySelectedSingleElement(note, getObjectNoteCss(note));
        }
    };

    //==================================================================================
    //underlineButton event
    vn.events.elementEvents.underlineButton_onClick = (e: any) => {
        // Toggle the button
        const note = getParentNote(e.target);
        if(!note) return;
        note._status.underlineToggle = !note._status.underlineToggle;
        if(!isMobileDevice()) {
            button_onToggle(note._elements.underlineButton, note._status.underlineToggle);
        }
        
        // If the selection is a single point
        if(note._selection.editRange && (note._selection.editRange as any).collapsed) {
            // Re-move to the original selection point
            setOriginEditSelection(note);
        }
        else {	// Dragging
            // Specify style for dragged characters
            modifySelectedSingleElement(note, getObjectNoteCss(note));
        }
    };

    //==================================================================================
    //italic
    vn.events.elementEvents.italicButton_onClick = (e: any) => {
        // Toggle the button
        const note = getParentNote(e.target);
        if(!note) return;
        note._status.italicToggle = !note._status.italicToggle;
        if(!isMobileDevice()) {
            button_onToggle(note._elements.italicButton, note._status.italicToggle);
        }
        
        // If the selection is a single point
        if(note._selection.editRange && (note._selection.editRange as any).collapsed) {
            // Re-move to the original selection point
            setOriginEditSelection(note);
        }
        else {	// Dragging
            // Specify style for dragged characters
            modifySelectedSingleElement(note, getObjectNoteCss(note));
        }
    };

    //==================================================================================
    //ul
    vn.events.elementEvents.ulButton_onClick = (e: any) => {
        const note = getParentNote(e.target);
        // If a child element is selected, event is controlled
        let target = e.target;
        if(target.classList.contains(getEventChildrenClassName(note._noteName))) {
            target = target.parentNode;
        }
        // Changing the tag
        modifySelectedUnitElementTag(target, note);
    };


    //==================================================================================
    //ol
    vn.events.elementEvents.olButton_onClick = (e: any) => {
        const note = getParentNote(e.target);
        // If a child element is selected, event is controlled
        let target = e.target;
        if(target.classList.contains(getEventChildrenClassName(note._noteName))) {
            target = target.parentNode;
        }
        // Changing the tag
        modifySelectedUnitElementTag(target, note);
    };

    //==================================================================================
    //text-align
    vn.events.elementEvents.textAlignSelect_onClick = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        selectToggle(e.target);
        // It's too inconvenient if the cursor is caught again on mobile..
        if(!isMobileDevice()) {
            setOriginEditSelection(note);
        }
    };

    //==================================================================================
    //text-align-left
    vn.events.elementEvents.textAlignLeft_onClick = (e: any) => {
        const note = getParentNote(e.target);
        // If a child element is selected, event is controlled
        let target = e.target;
        if(target.classList.contains(getEventChildrenClassName(note._noteName))) {
            target = target.parentNode;
        }
        // Changing the text-align
        modifySelectedUnitElementStyle(target, note);
        selectToggle(target, note);
    };

    //==================================================================================
    //text-align-center
    vn.events.elementEvents.textAlignCenter_onClick = (e: any) => {
        const note = getParentNote(e.target);
        // If a child element is selected, event is controlled
        let target = e.target;
        if(target.classList.contains(getEventChildrenClassName(note._noteName))) {
            target = target.parentNode;
        }
        // Changing the text-align
        modifySelectedUnitElementStyle(target, note);
        selectToggle(target, note);
    };

    //==================================================================================
    //text-align-right
    vn.events.elementEvents.textAlignRight_onClick = (e: any) => {
        const note = getParentNote(e.target);
        // If a child element is selected, event is controlled
        let target = e.target;
        if(target.classList.contains(getEventChildrenClassName(note._noteName))) {
            target = target.parentNode;
        }
        // Changing the text-align
        modifySelectedUnitElementStyle(target, note);
        selectToggle(target, note);
    };

    //==================================================================================
    //att link
    vn.events.elementEvents.attLinkButton_onClick = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        //att madal open
        openAttLinkModal(note);
    };

    //==================================================================================
    //modal att link
    vn.events.elementEvents.attLinkModal_onClick = (e: any) => {
    };
    //modal att link text
    vn.events.elementEvents.attLinkText_onInput = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        validCheckAttLink(note);
    };
    vn.events.elementEvents.attLinkText_onBlur = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        validCheckAttLink(note);
    };
    //modal att link href
    vn.events.elementEvents.attLinkHref_onInput = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        validCheckAttLink(note);
    };
    vn.events.elementEvents.attLinkHref_onBlur = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        validCheckAttLink(note);
    };
    //modal att link insert
    vn.events.elementEvents.attLinkInsertButton_onClick = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        if(!isValidSelection(note)) {
            closeAllModal(note);
            return;
        }
        const attLinkValidCheckbox = note._elements.attLinkValidCheckbox;
        if(!attLinkValidCheckbox.checked) {
            return;
        }
        const attLinkText = note._elements.attLinkText;
        const attLinkHref = note._elements.attLinkHref;
        const attIsblank = note._elements.attLinkIsBlankCheckbox;
        
        //No dragging > insert, dragging > modify
        if((note._selection.editRange as any).collapsed) {
            const tempEl = document.createElement("A");
            const tempNode = document.createTextNode(attLinkText.value);
            tempEl.append(tempNode);
            tempEl.setAttribute("href", attLinkHref.value);
            tempEl.setAttribute("class", getClassName(note._noteName, note._id, "linker"));
            tempEl.setAttribute("style", getCssTextFromObject(getObjectNoteCss(note)));
            if(attIsblank.checked) tempEl.setAttribute("target","_blank");
            (note._selection.editRange as any).insertNode(tempEl);
            setNewSelection(
                tempEl,
                1,
                tempEl,
                1
                );
        }
        else {
            const attributes: any = new Object();
            attributes["href"] = attLinkHref.value;
            attributes["class"] = getClassName(note._noteName, note._id, "linker");
            if(attIsblank.checked) attributes["target"] = "_blank";
            modifySelectedSingleElement(note, null, "a", attributes);
        }
        
        closeAllModal(note);
    };

    //==================================================================================
    //att link tooltip
    //edit button
    vn.events.elementEvents.attLinkTooltipEditButton_onClick = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        const previousElements = getPreviousElementsUntilNotTag(note._selection.editStartElement, "A", vn.consts);
        const nextElements = getNextElementsUntilNotTag(note._selection.editStartElement, "A", vn.consts);
        const startEl = previousElements[previousElements.length - 1];
        const endEl = nextElements[nextElements.length - 1];
        
        // Sets the new selection range.
        const newSelection = setNewSelection(
                startEl.firstChild,
                0,
                endEl.firstChild,
                endEl.firstChild.length,
                );
        
        setEditSelection(note, newSelection!);
        //att madal open
        openAttLinkModal(note);
    };

    //unlink button
    vn.events.elementEvents.attLinkTooltipUnlinkButton_onClick = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        const previousElements = getPreviousElementsUntilNotTag(note._selection.editStartElement, "A", vn.consts);
        const nextElements = getNextElementsUntilNotTag(note._selection.editStartElement, "A", vn.consts);
        const startEl = previousElements[previousElements.length - 1];
        const endEl = nextElements[nextElements.length - 1];
        
        // Sets the new selection range.
        const newSelection = setNewSelection(
                startEl.firstChild,
                0,
                endEl.firstChild,
                endEl.firstChild.length,
                );
        
        setEditSelection(note, newSelection!);
        
        modifySelectedSingleElement(note, null, "SPAN", {});
    };

    //==================================================================================
    //att file
    vn.events.elementEvents.attFileButton_onClick = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        
        // Restore the note size.
        doIncreaseTextareaHeight(vn);
        // Close all modals
        closeAllModal(note);
        // Close all selects
        closeAllSelectBoxes(note);
        // Adjust modal size
        setAllModalSize(note);
        // Open modal background
        const displayBlock = getId(note._noteName, note._id, "on_display_block");
        const displayNone = getId(note._noteName, note._id, "on_display_none");
        note._elements.modalBack.classList.remove(displayNone);
        note._elements.modalBack.classList.add(displayBlock);
        note._elements.attFileModal.classList.remove(displayNone);
        note._elements.attFileModal.classList.add(displayBlock);
    };
    //==================================================================================
    //modal att file
    vn.events.elementEvents.attFileModal_onClick = (e: any) => {
    };
    //modal att file upload button
    vn.events.elementEvents.attFileUploadButton_onClick = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        note._elements.attFileUpload.click();
    };
    //modal att file upload div
    vn.events.elementEvents.attFileUploadDiv_onDragover = (e: any) => {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
    };
    vn.events.elementEvents.attFileUploadDiv_onDrop = (e: any) => {
        e.preventDefault();
        const note = getParentNote(e.target);
        if(!note) return;
        const files = Array.from(e.dataTransfer.files);
        files.sort((a: any, b: any) => {
            if (a.name < b.name) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }
            return 0;
        });
        for(let i = 0; i < files.length; i++){
            (note._attTempFiles as any)[getUUID()] = files[i];
        }
        // Leave attTempFiles with only valid files.
        setAttTempFileValid(note);
        // Set attFileUploadDiv.
        setAttFileUploadDiv(note);
    };
    vn.events.elementEvents.attFileUploadDiv_onClick = (e: any) => {
        const uuid = e.target.getAttribute("uuid");
        if(!uuid) return;
        const note = getParentNote(e.target);
        if(!note) return;
        delete note._attTempFiles![uuid]
        e.target.remove();
        
        if(note._elements.attFileUploadDiv.childNodes.length <= 0) {
            note._elements.attFileUploadDiv.textContent = vn.languageSet[note._attributes.language].attFileUploadDiv;
            note._elements.attFileUploadDiv.style.lineHeight = note._attributes.sizeRate * 130 + "px";
        }
    };
    //modal att file upload
    vn.events.elementEvents.attFileUpload_onInput = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        const files = Array.from(e.target.files);
        files.sort((a: any, b: any) => {
            if (a.name < b.name) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }
            return 0;
        });
        for(let i = 0; i < files.length; i++){
            (note._attTempFiles! as any)[getUUID()] = files[i];
        }
        // Leave attTempFiles with only valid files.
        setAttTempFileValid(note);
        // Set attFileUploadDiv.
        setAttFileUploadDiv(note);
    };
    vn.events.elementEvents.attFileUpload_onBlur = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
    };
    //modal att file insert
    vn.events.elementEvents.attFileInsertButton_onClick = (e: any) => {
        /*
        If there's a range
            Insert <p><input file></p> at startElement
            Clear attTempFiles, attFileUploadDiv and then close the modal
        If there's no range
            Clear attTempFiles, attFileUploadDiv and then close the modal
        */
        const note = getParentNote(e.target);
        if(!note) return;
        if(!isValidSelection(note)) {
            closeAllModal(note);
            return;
            note
        }
        if(!note._selection.editStartUnitElement) {
            closeAllModal(note);
            return;
            note
        }
        const keys = Object.keys(note._attTempFiles!);
        if(keys.length <= 0) {
            closeAllModal(note);
            return;
            note
        }
        const editStartUnitElements: any = note._selection.editStartUnitElement;
        let tempEl1;
        let tempEl2;
        let selectEl;
        
        for(let i = keys.length - 1; i >= 0; i--) {
            tempEl1 = document.createElement(editStartUnitElements.tagName);
            tempEl2 = getElement(
                    "",
                    "a",
                    "",
                    {
                        "class" : getClassName(note._noteName, note._id, "downloader"),
                        "uuid" : keys[i],
                        "data-note-id" : note._id,
                        "href" : URL.createObjectURL(note._attTempFiles![keys[i]]),
                        "download" : note._attTempFiles![keys[i]].name,
                        "style" : getCssTextFromObject(getObjectNoteCss(note)),
                    },
                    note
                );
            tempEl2.innerText = "download : "+note._attTempFiles![keys[i]].name;
            tempEl1.appendChild(tempEl2)
            editStartUnitElements.parentNode.insertBefore(tempEl1, editStartUnitElements.nextSibling);
            
            // Save attach file object
            note._attFiles[keys[i]] = note._attTempFiles![keys[i]];
            if(i === keys.length - 1) selectEl = tempEl1;
        }
        closeAllModal(note);
        // Sets the new selection range.
        setNewSelection(
            selectEl,
            1,
            selectEl,
            1
            );
    };
    //==================================================================================
    //att image
    vn.events.elementEvents.attImageButton_onClick = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        
        // Restore the note size.
        doIncreaseTextareaHeight(vn);
        // Close all modals
        closeAllModal(note);
        // Close all selects
        closeAllSelectBoxes(note);
        // Adjust modal size
        setAllModalSize(note);
        // Open modal background
        const displayBlock = getId(note._noteName, note._id, "on_display_block");
        const displayNone = getId(note._noteName, note._id, "on_display_none");
        note._elements.modalBack.classList.remove(displayNone);
        note._elements.modalBack.classList.add(displayBlock);
        note._elements.attImageModal.classList.remove(displayNone);
        note._elements.attImageModal.classList.add(displayBlock);
    };
    //==================================================================================
    //modal att image
    vn.events.elementEvents.attImageModal_onClick = (e: any) => {
    };
    //modalatt image uplaod button and view
    vn.events.elementEvents.attImageUploadButtonAndView_onDragover = (e: any) => {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
    };
    vn.events.elementEvents.attImageUploadButtonAndView_onDrop = (e: any) => {
        e.preventDefault();
        const note = getParentNote(e.target);
        if(!note) return;
        const files = Array.from(e.dataTransfer.files);
        for(let i = 0; i < files.length; i++){
            (note._attTempImages as any)[getUUID()] = files[i];
        }
        // Leave attTempImages with only valid files.
        setAttTempImageValid(note);
        // Set attImageUploadAndView.
        setAttImageUploadAndView(note);
    };
    vn.events.elementEvents.attImageUploadButtonAndView_onClick = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        note._elements.attImageUpload.click();
    };
    //modal att image view pre button
    vn.events.elementEvents.attImageViewPreButtion_onClick = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        const scrollAmount = note._elements.attImageUploadButtonAndView.offsetWidth / 1.5 + 10;
        note._elements.attImageUploadButtonAndView.scrollLeft -= scrollAmount;
    };
    //modal att image view next button
    vn.events.elementEvents.attImageViewNextButtion_onClick = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        const scrollAmount = note._elements.attImageUploadButtonAndView.offsetWidth / 1.5 + 10;
        note._elements.attImageUploadButtonAndView.scrollLeft += scrollAmount;
    };
    //modal att image upload
    vn.events.elementEvents.attImageUpload_onInput = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        const files = Array.from(e.target.files);
        for(let i = 0; i < files.length; i++){
            (note._attTempImages as any)[getUUID()] = files[i];
        }
        // Leave attTempImages with only valid files.
        setAttTempImageValid(note);
        // Set attImageUploadAndView.
        setAttImageUploadAndView(note);
    };
    vn.events.elementEvents.attImageUpload_onBlur = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
    };
    //modal att image url
    vn.events.elementEvents.attImageURL_onInput = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        const url = e.target.value;
        if(url) {
            note._elements.attImageUploadButtonAndView.replaceChildren();
            const tempEl = document.createElement("img");
            tempEl.src = url;
            tempEl.style.width = "auto";
            tempEl.style.height = "100%";
            tempEl.style.display = "inline-block";
            tempEl.style.margin = "0 5px"
            note._elements.attImageUploadButtonAndView.appendChild(tempEl);
        }
        else {
            note._elements.attImageUploadButtonAndView.textContent = vn.languageSet[note._attributes.language].attImageUploadButtonAndView;
        }
    };
    vn.events.elementEvents.attImageURL_onBlur = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
    };
    //modal att image insert
    vn.events.elementEvents.attImageInsertButton_onClick = (e: any) => {
        /*
        In case of having a range:
            Sequentially insert <img url/> into startElement
            Reset attTempImages, attImageUploadButtonAndView, attImageURL and close modal
            If it's uload method:
                Store files in note._attImages
        If there is no range:
            Reset attTempImages, attImageUploadButtonAndView, attImageURL and close modal
        */
        const note = getParentNote(e.target);
        if(!note) return;
        if(!isValidSelection(note)) {
            closeAllModal(note);
            return;
            note
        }
        if(!note._selection.editStartUnitElement) {
            closeAllModal(note);
            return;
            note
        }
        if((note._elements.attImageURL as any).value) {
            const url = (note._elements.attImageURL as any).value;
            const editStartUnitElements: any = note._selection.editStartUnitElement;
            const viewerStyle = "width: 100%; overflow:hidden;"
        
            const tempEl1 = document.createElement(editStartUnitElements.tagName);
            const tempEl2 = getElement(
                    "",
                    "img",
                    "",
                    {
                        "class" : getClassName(note._noteName, note._id, "image_viewer"),
                        "data-note-id" : note._id,
                        "src" : url,
                        "style" : viewerStyle,
                        "title" : "",
                    },
                    note
                );
            tempEl1.appendChild(tempEl2)
            editStartUnitElements.parentNode.insertBefore(tempEl1, editStartUnitElements.nextSibling);
            
            closeAllModal(note);
            // Sets the new selection range.
            setNewSelection(
                tempEl1,
                0,
                tempEl1,
                0
                );
            return;
        }
        
        const keys = Object.keys(note._attTempImages!);
        if(keys.length > 0) {
            const editStartUnitElements: any = note._selection.editStartUnitElement;
            let tempEl1;
            let tempEl2;
            const viewerStyle = "width: 100%; overflow:hidden;"
            let selectEl;
            
            for(let i = keys.length - 1; i >= 0; i--) {
                // Save image file object
                note._attImages[keys[i]] = note._attTempImages![keys[i]];
                
                tempEl1 = document.createElement(editStartUnitElements.tagName);
                tempEl2 = getElement(
                        "",
                        "img",
                        "",
                        {
                            "class" : getClassName(note._noteName, note._id, "image_viewer"),
                            "uuid" : keys[i],
                            "data-note-id" : note._id,
                            "src" : URL.createObjectURL(note._attImages[keys[i]]),
                            "style" : viewerStyle,
                            "title" : "",
                        },
                        note
                    );
                tempEl1.appendChild(tempEl2)
                editStartUnitElements.parentNode.insertBefore(tempEl1, editStartUnitElements.nextSibling);
                
                if(i === 0) selectEl = tempEl1;
            }
                
            closeAllModal(note);
            // Sets the new selection range.
            setNewSelection(
                selectEl,
                0,
                selectEl,
                0
                );
            return;
        }
        
        closeAllModal(note);
        return;
    };

    //==================================================================================
    //att video
    vn.events.elementEvents.attVideoButton_onClick = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        
        // Restore the note size.
        doIncreaseTextareaHeight(vn);
        
        closeAllModal(note);
        
        const displayBlock = getId(note._noteName, note._id, "on_display_blocknote");
        const displayNone = getId(note._noteName, note._id, "on_display_none");
        note._elements.modalBack.classList.remove(displayNone);
        note._elements.modalBack.classList.add(displayBlock);
        note._elements.attVideoModal.classList.remove(displayNone);
        note._elements.attVideoModal.classList.add(displayBlock);

        //modal setting
        (note._elements.attVideoEmbedId as any).value = "";
        (note._elements.attVideoWidth as any).value = 100;
        (note._elements.attVideoHeight as any).value = 500;

        validCheckAttVideo(note);
    };
    //==================================================================================
    //modal att video
    vn.events.elementEvents.attVideoModal_onClick = (e: any) => {
    };
    //modal att video embed id
    vn.events.elementEvents.attVideoEmbedId_onInput = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        validCheckAttVideo(note);
    };
    vn.events.elementEvents.attVideoEmbedId_onBlur = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        validCheckAttVideo(note);
    };
    //modal att video width
    vn.events.elementEvents.attVideoWidth_onInput = (e: any) => {
        if(!e.target.value) return;
        const inputValue = e.target.value;
        if(!checkNumber(inputValue)) {
            e.target.value = "";
            return;
        }
    };
    vn.events.elementEvents.attVideoWidth_onBlur = (e: any) => {
        if(!e.target.value) e.target.value = 100;
        let widthPer = e.target.value;
        if(widthPer < 10) widthPer = 10;
        if(widthPer > 100) widthPer = 100;
        e.target.value = widthPer;
    };
    //modal att video height
    vn.events.elementEvents.attVideoHeight_onInput = (e: any) => {
        if(!e.target.value) return;
        const inputValue = e.target.value;
        if(!checkNumber(inputValue)) {
            e.target.value = "";
            return;
        }
    };
    vn.events.elementEvents.attVideoHeight_onBlur = (e: any) => {
        if(!e.target.value) e.target.value = 500;
        let height = e.target.value;
        if(height < 50) height = 50;
        if(height > 1000) height = 1000;
        e.target.value = height;
    };
    //modal att video insert
    vn.events.elementEvents.attVideoInsertButton_onClick = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        if(!isValidSelection(note)) {
            closeAllModal(note);
            return;
            note
        }
        const attVideoValidCheckbox: any = note._elements.attVideoValidCheckbox;
        if(!attVideoValidCheckbox.checked) {
            return;
        }

        if(!note._selection.editStartUnitElement) {
            closeAllModal(note);
            return;
            note
        }

        if((note._elements.attVideoEmbedId as any).value) {
            const src = "https://www.youtube.com/embed/" + (note._elements.attVideoEmbedId as any).value;
            const editStartUnitElements: any = note._selection.editStartUnitElement;
            let tempEl1;
            let tempEl2;
            const viewerStyle = "overflow:hidden;"
                                + "width:" + (note._elements.attVideoWidth as any).value + "%;"
                                + "height:" + (note._elements.attVideoHeight as any).value + "px;";
        
            tempEl1 = document.createElement(editStartUnitElements.tagName);
            tempEl2 = getElement(
                    "",
                    "iframe",
                    "",
                    {
                        "class" : getClassName(note._noteName, note._id, "video_viewer"),
                        "data-note-id" : note._id,
                        "src" : src,
                        "title" : "YouTube video player",
                        "frameborder" : "0",
                        "allow" : "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
                        "allowfullscreen" : "",
                        "style" : viewerStyle,
                    },
                    note
                );
            tempEl1.appendChild(tempEl2)
            editStartUnitElements.parentNode.insertBefore(tempEl1, editStartUnitElements.nextSibling);
            
            closeAllModal(note);
            // Sets the new selection range.
            setNewSelection(
                tempEl1,
                0,
                tempEl1,
                0
                );
            return;
        }

        closeAllModal(note);
    };

    //==================================================================================
    //att image tooltip width input event
    vn.events.elementEvents.attImageAndVideoTooltipWidthInput_onInput = (e: any) => {
        if(!e.target.value) return;
        const inputValue = e.target.value;
        if(!checkNumber(inputValue)) {
            e.target.value = "";
            return;
        }
    };
    vn.events.elementEvents.attImageAndVideoTooltipWidthInput_onBlur = (e: any) => {
        setImageAndVideoWidth(e.target);
    };
    vn.events.elementEvents.attImageAndVideoTooltipWidthInput_onKeyup = (e: any) => {
        if(e.key === "Enter") {
            setImageAndVideoWidth(e.target);
        }
    };
    //att image tooltip float radio none input event
    vn.events.elementEvents.attImageAndVideoTooltipFloatRadioNone_onClick = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        const imgNode: any = (note._selection.editStartNode as any).cloneNode(true);
        if(imgNode.tagName !== "IMG" && imgNode.tagName !== "IFRAME") return;
        imgNode.style.float = "none";
        (note._selection.editStartNode as any).parentNode.replaceChild(imgNode, (note._selection.editStartNode as any));
        note._selection.editStartNode = imgNode;
    };
    //att image tooltip float radio left input event
    vn.events.elementEvents.attImageAndVideoTooltipFloatRadioLeft_onClick = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        const imgNode: any = (note._selection.editStartNode as any).cloneNode(true);
        if(imgNode.tagName !== "IMG" && imgNode.tagName !== "IFRAME") return;
        imgNode.style.float = "left";
        (note._selection.editStartNode as any).parentNode.replaceChild(imgNode, (note._selection.editStartNode as any));
        note._selection.editStartNode = imgNode;
    };
    //att image tooltip float radio right input event
    vn.events.elementEvents.attImageAndVideoTooltipFloatRadioRight_onClick = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        const imgNode: any = (note._selection.editStartNode as any).cloneNode(true);
        if(imgNode.tagName !== "IMG" && imgNode.tagName !== "IFRAME") return;
        imgNode.style.float = "right";
        (note._selection.editStartNode as any).parentNode.replaceChild(imgNode, (note._selection.editStartNode as any));
        note._selection.editStartNode = imgNode;
    };
    //att image tooltip shape square radio input event
    vn.events.elementEvents.attImageAndVideoTooltipShapeRadioSquare_onClick = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        const imgNode: any = note._selection.editStartNode;
        if(imgNode.tagName !== "IMG" && imgNode.tagName !== "IFRAME") return;
        imgNode.style.removeProperty("border-radius");
        (note._selection.editStartNode as any).parentNode.replaceChild(imgNode, (note._selection.editStartNode as any));
        note._selection.editStartNode = imgNode;
    };
    //att image tooltip shape radius radio input event
    vn.events.elementEvents.attImageAndVideoTooltipShapeRadioRadius_onClick = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        const imgNode: any = note._selection.editStartNode;
        if(imgNode.tagName !== "IMG" && imgNode.tagName !== "IFRAME") return;
        imgNode.style.borderRadius = "5%";
        (note._selection.editStartNode as any).parentNode.replaceChild(imgNode, (note._selection.editStartNode as any));
        note._selection.editStartNode = imgNode;
    };
    //att image tooltip shape circle radio input event
    vn.events.elementEvents.attImageAndVideoTooltipShapeRadioCircle_onClick = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        const imgNode: any = note._selection.editStartNode;
        if(imgNode.tagName !== "IMG" && imgNode.tagName !== "IFRAME") return;
        imgNode.style.borderRadius = "50%";
        (note._selection.editStartNode as any).parentNode.replaceChild(imgNode, (note._selection.editStartNode as any));
        note._selection.editStartNode = imgNode;
    };

    //==================================================================================
    //fontSizeInputBox event
    vn.events.elementEvents.fontSizeInputBox_onClick = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        // If the selection is a single point
        if(note._selection.editRange && (note._selection.editRange as any).collapsed) {
            // Re-move to the original selection point
            setOriginEditSelection(note);
        }
        else {	// Dragging
            // Specify style for dragged characters
            modifySelectedSingleElement(note, getObjectNoteCss(note));
        }
    };
    //fontSizeInput event
    vn.events.elementEvents.fontSizeInput_onClick = (e: any) => {
    };
    vn.events.elementEvents.fontSizeInput_onInput = (e: any) => {
        if(!e.target.value) return;
        const inputValue = e.target.value;
        const note = getParentNote(e.target);
        if(!note) return;
        if(!checkNumber(inputValue)) {
            e.target.value = "";
            return;
        }
        note._status.fontSize = inputValue;
    };
    vn.events.elementEvents.fontSizeInput_onBlur = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        if(!e.target.value) {
            e.target.value = note._status.fontSize;
        }
        const inputValueNum = Number(e.target.value);
        if(inputValueNum > 120) {
            e.target.value = "120";
            note._status.fontSize = e.target.value;
            return;
        }
        if(inputValueNum < 6) {
            e.target.value = "6";
            note._status.fontSize = e.target.value;
            return;
        }
        note._status.fontSize = e.target.value;
    };

    //==================================================================================
    //letterSpacingInputBox event
    vn.events.elementEvents.letterSpacingInputBox_onClick = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        // If the selection is a single point
        if(note._selection.editRange && (note._selection.editRange as any).collapsed) {
            // Re-move to the original selection point
            setOriginEditSelection(note);
        }
        else {	// Dragging
            // Specify style for dragged characters
            modifySelectedSingleElement(note, getObjectNoteCss(note));
        }
    };
    //letterSpacingInput event
    vn.events.elementEvents.letterSpacingInput_onClick = (e: any) => {
    };
    vn.events.elementEvents.letterSpacingInput_onInput = (e: any) => {
        if(!e.target.value) return;
        const inputValue = e.target.value;
        const note = getParentNote(e.target);
        if(!note) return;
        if(!checkRealNumber(inputValue)) {
            e.target.value = "";
            return;
        }
        note._status.letterSpacing = inputValue;
    };
    vn.events.elementEvents.letterSpacingInput_onBlur = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        if(!e.target.value) {
            e.target.value = "0";
            note._status.letterSpacing = e.target.value;
            return;
        }
        const inputValueNum = Number(e.target.value);
        if(inputValueNum > 30) {
            e.target.value = "30";
            note._status.letterSpacing = e.target.value;
            return;
        }
        if(inputValueNum < -5) {
            e.target.value = "-5";
            note._status.letterSpacing = e.target.value;
            return;
        }
        note._status.letterSpacing = e.target.value;
    };

    //==================================================================================
    //lineHeightInputBox event
    vn.events.elementEvents.lineHeightInputBox_onClick = (e: any) => {
    };
    vn.events.elementEvents.lineHeightInputBox_onInput = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        // If the selection is a single point
        if(note._selection.editRange && (note._selection.editRange as any).collapsed) {
            // Re-move to the original selection point
            setOriginEditSelection(note);
        }
        else {	// Dragging
            // Specify style for dragged characters
            modifySelectedSingleElement(note, getObjectNoteCss(note));
        }
    };
    //lineHeightInput event
    vn.events.elementEvents.lineHeightInput_onClick = (e: any) => {
    };
    vn.events.elementEvents.lineHeightInput_onInput = (e: any) => {
        if(!e.target.value) return;
        const inputValue = e.target.value;
        const note = getParentNote(e.target);
        if(!note) return;
        if(!checkNumber(inputValue)) {
            e.target.value = "";
            return;
        }
        note._status.lineHeight = e.target.value;
    };
    vn.events.elementEvents.lineHeightInput_onBlur = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        if(!e.target.value) {
            e.target.value = note._status.lineHeight;
        }
        const inputValueNum = Number(e.target.value);
        if(inputValueNum > 150) {
            e.target.value = "150";
            note._status.lineHeight = e.target.value;
            return;
        }
        if(inputValueNum < 6) {
            e.target.value = "6";
            note._status.lineHeight = e.target.value;
            return;
        }
        note._status.lineHeight = e.target.value;
    };

    //==================================================================================
    //fontFamilySelect event
    vn.events.elementEvents.fontFamilySelect_onClick = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        selectToggle(e.target);
        // It's too inconvenient if the cursor is caught again on mobile..
        if(!isMobileDevice()) {
            setOriginEditSelection(note);
        }
    };
    //==================================================================================
    //color text select
    vn.events.elementEvents.colorTextSelect_onClick = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        selectToggle(e.target);
        // It's too inconvenient if the cursor is caught again on mobile..
        if(!isMobileDevice()) {
            setOriginEditSelection(note);
        }
    };
    //color text select box
    vn.events.elementEvents.colorTextSelectBox_onClick = (e: any) => {
    };
    //colorText R Input event
    vn.events.elementEvents.colorTextRInput_onClick = (e: any) => {
    };
    vn.events.elementEvents.colorTextRInput_onInput = (e: any) => {
        if(!e.target.value) return;
        let inputValue = e.target.value;
        const note = getParentNote(e.target);
        if(!note) return;
        if(!checkHex(inputValue)) {
            inputValue = note._status.colorTextR;
            e.target.value = inputValue;
            return;
        }
        if(inputValue.length !== 2) return;
        note._status.colorTextR = inputValue;
        note._elements.colorText0.style.backgroundColor = "#" + note._status.colorTextR +  note._status.colorTextG +  note._status.colorTextB;
    };
    vn.events.elementEvents.colorTextRInput_onBlur = (e: any) => {
        const value = e.target.value;
        const note = getParentNote(e.target);
        if(!note) return;
        if(!checkHex(value)) {
            e.target.value = note._status.colorTextR;
            return;
        }
        if(value.length !== 2) {
            e.target.value = note._status.colorTextR;
        }
    };
    //colorText G Input event
    vn.events.elementEvents.colorTextGInput_onClick = (e: any) => {
    };
    vn.events.elementEvents.colorTextGInput_onInput = (e: any) => {
        if(!e.target.value) return;
        let inputValue = e.target.value;
        const note = getParentNote(e.target);
        if(!note) return;
        if(!checkHex(inputValue)) {
            inputValue = note._status.colorTextG;
            e.target.value = inputValue;
            return;
        }
        if(inputValue.length !== 2) return;
        note._status.colorTextG = inputValue;
        note._elements.colorText0.style.backgroundColor = "#" + note._status.colorTextR +  note._status.colorTextG +  note._status.colorTextB;
    };
    vn.events.elementEvents.colorTextGInput_onBlur = (e: any) => {
        const value = e.target.value;
        const note = getParentNote(e.target);
        if(!note) return;
        if(!checkHex(value)) {
            e.target.value = note._status.colorTextG;
            return;
        }
        if(value.length !== 2) {
            e.target.value = note._status.colorTextG;
        }
    };
    //colorText B Input event
    vn.events.elementEvents.colorTextBInput_onClick = (e: any) => {
    };
    vn.events.elementEvents.colorTextBInput_onInput = (e: any) => {
        if(!e.target.value) return;
        let inputValue = e.target.value;
        const note = getParentNote(e.target);
        if(!note) return;
        if(!checkHex(inputValue)) {
            inputValue = note._status.colorTextB;
            e.target.value = inputValue;
            return;
        }
        if(inputValue.length !== 2) return;
        note._status.colorTextB = inputValue;
        note._elements.colorText0.style.backgroundColor = "#" + note._status.colorTextR +  note._status.colorTextG +  note._status.colorTextB;
    };
    vn.events.elementEvents.colorTextBInput_onBlur = (e: any) => {
        const value = e.target.value;
        const note = getParentNote(e.target);
        if(!note) return;
        if(!checkHex(value)) {
            e.target.value = note._status.colorTextB;
            return;
        }
        if(value.length !== 2) {
            e.target.value = note._status.colorTextB;
        }
    };
    //colorText Opacity Input event
    vn.events.elementEvents.colorTextOpacityInput_onClick = (e: any) => {
    };
    vn.events.elementEvents.colorTextOpacityInput_onInput = (e: any) => {
        if(e.target.value === "01" || e.target.value === "10") {
            e.target.value = e.data;
        } 
        if(!e.target.value) return;
        let inputValue = e.target.value;
        const note = getParentNote(e.target);
        if(!note) return;
        if(!checkRealNumber(inputValue)) {
            inputValue = note._status.colorTextO;
            e.target.value = inputValue;
            return;
        }
        if(inputValue.length >= 3 && inputValue < 0.1) {
            inputValue = 0.1;
        }
        if (inputValue > 1) {
            inputValue = 1;
        }
        if(inputValue >= 0.1 && inputValue <= 1) {
            // Round to the nearest tenth.
            e.target.value = Math.round(inputValue * 10) / 10;
        }
        
        note._status.colorTextO = inputValue;
        note._elements.colorText0.style.opacity = note._status.colorTextO;
    };
    vn.events.elementEvents.colorTextOpacityInput_onBlur = (e: any) => {
        const value = e.target.value;
        const note = getParentNote(e.target);
        if(!note) return;
        if(!checkRealNumber(value)) {
            e.target.value = note._status.colorTextO;
        }
    };
    //colorText0 event
    vn.events.elementEvents.colorText0_onClick = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        note._status.colorTextRGB = "#" + note._status.colorTextR +  note._status.colorTextG +  note._status.colorTextB;
        note._status.colorTextOpacity = note._status.colorTextO;
        if(!isMobileDevice()) {
            (note._elements.colorTextSelect as any).querySelector("."+getEventChildrenClassName(note._noteName)).style.color
                = getRGBAFromHex(note._status.colorTextRGB, note._status.colorTextOpacity === "0" ? 1 : note._status.colorTextOpacity);
        }
        
        // If the selection is a single point
        if(note._selection.editRange && (note._selection.editRange as any).collapsed) {
            // Re-move to the original selection point
            setOriginEditSelection(note);
        }
        else {	// Dragging
            // Specify style for dragged characters
            modifySelectedSingleElement(note, getObjectNoteCss(note));
        }
    };
    //colorText1 event
    vn.events.elementEvents.colorText1_onClick = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        note._status.colorTextRGB = getHexColorFromColorName(vn.colors.color14);
        note._status.colorTextOpacity = "1";
        if(!isMobileDevice()) {
            (note._elements.colorTextSelect as any).querySelector("."+getEventChildrenClassName(note._noteName)).style.color
                = getRGBAFromHex(note._status.colorTextRGB, note._status.colorTextOpacity);
        }
        
        // If the selection is a single point
        if(note._selection.editRange && (note._selection.editRange as any).collapsed) {
            // Re-move to the original selection point
            setOriginEditSelection(note);
        }
        else {	// Dragging
            // Specify style for dragged characters
            modifySelectedSingleElement(note, getObjectNoteCss(note));
        }
    };
    //colorText2 event
    vn.events.elementEvents.colorText2_onClick = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        note._status.colorTextRGB = getHexColorFromColorName(vn.colors.color15);
        note._status.colorTextOpacity = "1";
        if(!isMobileDevice()) {
            (note._elements.colorTextSelect as any).querySelector("."+getEventChildrenClassName(note._noteName)).style.color
                = getRGBAFromHex(note._status.colorTextRGB, note._status.colorTextOpacity);
        }
        
        // If the selection is a single point
        if(note._selection.editRange && (note._selection.editRange as any).collapsed) {
            // Re-move to the original selection point
            setOriginEditSelection(note);
        }
        else {	// Dragging
            // Specify style for dragged characters
            modifySelectedSingleElement(note, getObjectNoteCss(note));
        }
    };
    //colorText3 event
    vn.events.elementEvents.colorText3_onClick = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        note._status.colorTextRGB = getHexColorFromColorName(vn.colors.color16);
        note._status.colorTextOpacity = "1";
        if(!isMobileDevice()) {
            (note._elements.colorTextSelect as any).querySelector("."+getEventChildrenClassName(note._noteName)).style.color
                = getRGBAFromHex(note._status.colorTextRGB, note._status.colorTextOpacity);
        }
        
        // If the selection is a single point
        if(note._selection.editRange && (note._selection.editRange as any).collapsed) {
            // Re-move to the original selection point
            setOriginEditSelection(note);
        }
        else {	// Dragging
            // Specify style for dragged characters
            modifySelectedSingleElement(note, getObjectNoteCss(note));
        }
    };
    //colorText4 event
    vn.events.elementEvents.colorText4_onClick = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        note._status.colorTextRGB = getHexColorFromColorName(vn.colors.color17);
        note._status.colorTextOpacity = "1";
        if(!isMobileDevice()) {
            (note._elements.colorTextSelect as any).querySelector("."+getEventChildrenClassName(note._noteName)).style.color
                = getRGBAFromHex(note._status.colorTextRGB, note._status.colorTextOpacity);
        }
        
        // If the selection is a single point
        if(note._selection.editRange && (note._selection.editRange as any).collapsed) {
            // Re-move to the original selection point
            setOriginEditSelection(note);
        }
        else {	// Dragging
            // Specify style for dragged characters
            modifySelectedSingleElement(note, getObjectNoteCss(note));
        }
    };
    //colorText5 event
    vn.events.elementEvents.colorText5_onClick = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        note._status.colorTextRGB = getHexColorFromColorName(vn.colors.color18);
        note._status.colorTextOpacity = "1";
        if(!isMobileDevice()) {
            (note._elements.colorTextSelect as any).querySelector("."+getEventChildrenClassName(note._noteName)).style.color
                = getRGBAFromHex(note._status.colorTextRGB, note._status.colorTextOpacity);
        }
        
        // If the selection is a single point
        if(note._selection.editRange && (note._selection.editRange as any).collapsed) {
            // Re-move to the original selection point
            setOriginEditSelection(note);
        }
        else {	// Dragging
            // Specify style for dragged characters
            modifySelectedSingleElement(note, getObjectNoteCss(note));
        }
    };
    //colorText6 event
    vn.events.elementEvents.colorText6_onClick = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        note._status.colorTextRGB = getHexColorFromColorName(vn.colors.color19);
        note._status.colorTextOpacity = "1";
        if(!isMobileDevice()) {
            (note._elements.colorTextSelect as any).querySelector("."+getEventChildrenClassName(note._noteName)).style.color
                = getRGBAFromHex(note._status.colorTextRGB, note._status.colorTextOpacity);
        }
        
        // If the selection is a single point
        if(note._selection.editRange && (note._selection.editRange as any).collapsed) {
            // Re-move to the original selection point
            setOriginEditSelection(note);
        }
        else {	// Dragging
            // Specify style for dragged characters
            modifySelectedSingleElement(note, getObjectNoteCss(note));
        }
    };
    //colorText7 event
    vn.events.elementEvents.colorText7_onClick = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        note._status.colorTextRGB = getHexColorFromColorName(vn.colors.color20);
        note._status.colorTextOpacity = "1";
        if(!isMobileDevice()) {
            (note._elements.colorTextSelect as any).querySelector("."+getEventChildrenClassName(note._noteName)).style.color
                = getRGBAFromHex(note._status.colorTextRGB, note._status.colorTextOpacity);
        }
        
        // If the selection is a single point
        if(note._selection.editRange && (note._selection.editRange as any).collapsed) {
            // Re-move to the original selection point
            setOriginEditSelection(note);
        }
        else {	// Dragging
            // Specify style for dragged characters
            modifySelectedSingleElement(note, getObjectNoteCss(note));
        }
    };

    //==================================================================================
    //color background select
    vn.events.elementEvents.colorBackSelect_onClick = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        selectToggle(e.target);
        // It's too inconvenient if the cursor is caught again on mobile..
        if(!isMobileDevice()) {
            setOriginEditSelection(note);
        }
    };
    //color background select box
    vn.events.elementEvents.colorBackSelectBox_onClick = (e: any) => {
    };
    //colorBack R Input event
    vn.events.elementEvents.colorBackRInput_onClick = (e: any) => {
    };
    vn.events.elementEvents.colorBackRInput_onInput = (e: any) => {
        if(!e.target.value) return;
        let inputValue = e.target.value;
        const note = getParentNote(e.target);
        if(!note) return;
        if(!checkHex(inputValue)) {
            inputValue = note._status.colorBackR;
            e.target.value = inputValue;
            return;
        }
        if(inputValue.length !== 2) return;
        note._status.colorBackR = inputValue;
        note._elements.colorBack0.style.backgroundColor = "#" + note._status.colorBackR +  note._status.colorBackG +  note._status.colorBackB;
    };
    vn.events.elementEvents.colorBackRInput_onBlur = (e: any) => {
        const value = e.target.value;
        const note = getParentNote(e.target);
        if(!note) return;
        if(!checkHex(value)) {
            e.target.value = note._status.colorBackR;
            return;
        }
        if(value.length !== 2) {
            e.target.value = note._status.colorBackR;
        }
    };
    //colorBack G Input event
    vn.events.elementEvents.colorBackGInput_onClick = (e: any) => {
    };
    vn.events.elementEvents.colorBackGInput_onInput = (e: any) => {
        if(!e.target.value) return;
        let inputValue = e.target.value;
        const note = getParentNote(e.target);
        if(!note) return;
        if(!checkHex(inputValue)) {
            inputValue = note._status.colorBackG;
            e.target.value = inputValue;
            return;
        }
        if(inputValue.length !== 2) return;
        note._status.colorBackG = inputValue;
        note._elements.colorBack0.style.backgroundColor = "#" + note._status.colorBackR +  note._status.colorBackG +  note._status.colorBackB;
    };
    vn.events.elementEvents.colorBackGInput_onBlur = (e: any) => {
        const value = e.target.value;
        const note = getParentNote(e.target);
        if(!note) return;
        if(!checkHex(value)) {
            e.target.value = note._status.colorBackG;
            return;
        }
        if(value.length !== 2) {
            e.target.value = note._status.colorBackG;
        }
    };
    //colorBack B Input event
    vn.events.elementEvents.colorBackBInput_onClick = (e: any) => {
    };
    vn.events.elementEvents.colorBackBInput_onInput = (e: any) => {
        if(!e.target.value) return;
        let inputValue = e.target.value;
        const note = getParentNote(e.target);
        if(!note) return;
        if(!checkHex(inputValue)) {
            inputValue = note._status.colorBackB;
            e.target.value = inputValue;
            return;
        }
        if(inputValue.length !== 2) return;
        note._status.colorBackB = inputValue;
        note._elements.colorBack0.style.backgroundColor = "#" + note._status.colorBackR +  note._status.colorBackG +  note._status.colorBackB;
    };
    vn.events.elementEvents.colorBackBInput_onBlur = (e: any) => {
        const value = e.target.value;
        const note = getParentNote(e.target);
        if(!note) return;
        if(!checkHex(value)) {
            e.target.value = note._status.colorBackB;
            return;
        }
        if(value.length !== 2) {
            e.target.value = note._status.colorBackB;
        }
    };
    //colorBack Opacity Input event
    vn.events.elementEvents.colorBackOpacityInput_onClick = (e: any) => {
    };
    vn.events.elementEvents.colorBackOpacityInput_onInput = (e: any) => {
        if(e.target.value === "01" || e.target.value === "10") {
            e.target.value = e.data;
        } 
        if(!e.target.value) return;
        let inputValue = e.target.value;
        const note = getParentNote(e.target);
        if(!note) return;
        if(!checkRealNumber(inputValue)) {
            inputValue = note._status.colorBackO;
            e.target.value = inputValue;
            return;
        }
        if(inputValue.length >= 3 && inputValue < 0.1) {
            inputValue = 0.1;
        }
        if (inputValue > 1) {
            inputValue = 1;
        }
        if(inputValue >= 0.1 && inputValue <= 1) {
            // Round to the nearest tenth.
            e.target.value = Math.round(inputValue * 10) / 10;
        }
        
        note._status.colorBackO = inputValue;
        note._elements.colorBack0.style.opacity = note._status.colorBackO;
    };
    vn.events.elementEvents.colorBackOpacityInput_onBlur = (e: any) => {
        const value = e.target.value;
        const note = getParentNote(e.target);
        if(!note) return;
        if(!checkRealNumber(value)) {
            e.target.value = note._status.colorBackO;
        }
    };
    //colorBack0 event
    vn.events.elementEvents.colorBack0_onClick = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        note._status.colorBackRGB = "#" + note._status.colorBackR +  note._status.colorBackG +  note._status.colorBackB;
        note._status.colorBackOpacity = note._status.colorBackO;
        if(!isMobileDevice()) {
            (note._elements.colorBackSelect as any).querySelector("."+getEventChildrenClassName(note._noteName)).style.color
                = getRGBAFromHex(note._status.colorBackRGB, note._status.colorBackOpacity === "0" ? 1 : note._status.colorBackOpacity);
        }
        
        // If the selection is a single point
        if(note._selection.editRange && (note._selection.editRange as any).collapsed) {
            // Re-move to the original selection point
            setOriginEditSelection(note);
        }
        else {	// Dragging
            // Specify style for dragged characters
            modifySelectedSingleElement(note, getObjectNoteCss(note));
        }
    };
    //colorBack1 event
    vn.events.elementEvents.colorBack1_onClick = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        note._status.colorBackRGB = getHexColorFromColorName(vn.colors.color14);
        note._status.colorBackOpacity = "1";
        if(!isMobileDevice()) {
            (note._elements.colorBackSelect as any).querySelector("."+getEventChildrenClassName(note._noteName)).style.color
                = getRGBAFromHex(note._status.colorBackRGB, note._status.colorBackOpacity);
        }
        
        // If the selection is a single point
        if(note._selection.editRange && (note._selection.editRange as any).collapsed) {
            // Re-move to the original selection point
            setOriginEditSelection(note);
        }
        else {	// Dragging
            // Specify style for dragged characters
            modifySelectedSingleElement(note, getObjectNoteCss(note));
        }
    };
    //colorBack2 event
    vn.events.elementEvents.colorBack2_onClick = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        note._status.colorBackRGB = getHexColorFromColorName(vn.colors.color15);
        note._status.colorBackOpacity = "1";
        if(!isMobileDevice()) {
            (note._elements.colorBackSelect as any).querySelector("."+getEventChildrenClassName(note._noteName)).style.color
                = getRGBAFromHex(note._status.colorBackRGB, note._status.colorBackOpacity);
        }
        
        // If the selection is a single point
        if(note._selection.editRange && (note._selection.editRange as any).collapsed) {
            // Re-move to the original selection point
            setOriginEditSelection(note);
        }
        else {	// Dragging
            // Specify style for dragged characters
            modifySelectedSingleElement(note, getObjectNoteCss(note));
        }
    };
    //colorBack3 event
    vn.events.elementEvents.colorBack3_onClick = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        note._status.colorBackRGB = getHexColorFromColorName(vn.colors.color16);
        note._status.colorBackOpacity = "1";
        if(!isMobileDevice()) {
            (note._elements.colorBackSelect as any).querySelector("."+getEventChildrenClassName(note._noteName)).style.color
                = getRGBAFromHex(note._status.colorBackRGB, note._status.colorBackOpacity);
        }
        
        // If the selection is a single point
        if(note._selection.editRange && (note._selection.editRange as any).collapsed) {
            // Re-move to the original selection point
            setOriginEditSelection(note);
        }
        else {	// Dragging
            // Specify style for dragged characters
            modifySelectedSingleElement(note, getObjectNoteCss(note));
        }
    };
    //colorBack4 event
    vn.events.elementEvents.colorBack4_onClick = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        note._status.colorBackRGB = getHexColorFromColorName(vn.colors.color17);
        note._status.colorBackOpacity = "1";
        if(!isMobileDevice()) {
            (note._elements.colorBackSelect as any).querySelector("."+getEventChildrenClassName(note._noteName)).style.color
                = getRGBAFromHex(note._status.colorBackRGB, note._status.colorBackOpacity);
        }
        
        // If the selection is a single point
        if(note._selection.editRange && (note._selection.editRange as any).collapsed) {
            // Re-move to the original selection point
            setOriginEditSelection(note);
        }
        else {	// Dragging
            // Specify style for dragged characters
            modifySelectedSingleElement(note, getObjectNoteCss(note));
        }
    };
    //colorBack5 event
    vn.events.elementEvents.colorBack5_onClick = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        note._status.colorBackRGB = getHexColorFromColorName(vn.colors.color18);
        note._status.colorBackOpacity = "1";
        if(!isMobileDevice()) {
            (note._elements.colorBackSelect as any).querySelector("."+getEventChildrenClassName(note._noteName)).style.color
                = getRGBAFromHex(note._status.colorBackRGB, note._status.colorBackOpacity);
        }
        
        // If the selection is a single point
        if(note._selection.editRange && (note._selection.editRange as any).collapsed) {
            // Re-move to the original selection point
            setOriginEditSelection(note);
        }
        else {	// Dragging
            // Specify style for dragged characters
            modifySelectedSingleElement(note, getObjectNoteCss(note));
        }
    };
    //colorBack6 event
    vn.events.elementEvents.colorBack6_onClick = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        note._status.colorBackRGB = getHexColorFromColorName(vn.colors.color19);
        note._status.colorBackOpacity = "1";
        if(!isMobileDevice()) {
            (note._elements.colorBackSelect as any).querySelector("."+getEventChildrenClassName(note._noteName)).style.color
                = getRGBAFromHex(note._status.colorBackRGB, note._status.colorBackOpacity);
        }
        
        // If the selection is a single point
        if(note._selection.editRange && (note._selection.editRange as any).collapsed) {
            // Re-move to the original selection point
            setOriginEditSelection(note);
        }
        else {	// Dragging
            // Specify style for dragged characters
            modifySelectedSingleElement(note, getObjectNoteCss(note));
        }
    };
    //colorBack7 event
    vn.events.elementEvents.colorBack7_onClick = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        note._status.colorBackRGB = getHexColorFromColorName(vn.colors.color20);
        note._status.colorBackOpacity = "1";
        if(!isMobileDevice()) {
            (note._elements.colorBackSelect as any).querySelector("."+getEventChildrenClassName(note._noteName)).style.color
                = getRGBAFromHex(note._status.colorBackRGB, note._status.colorBackOpacity);
        }
        
        // If the selection is a single point
        if(note._selection.editRange && (note._selection.editRange as any).collapsed) {
            // Re-move to the original selection point
            setOriginEditSelection(note);
        }
        else {	// Dragging
            // Specify style for dragged characters
            modifySelectedSingleElement(note, getObjectNoteCss(note));
        }
    };

    //==================================================================================
    //formatClearButton
    vn.events.elementEvents.formatClearButton_onClick = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        // If the selection is a single point
        if (note._selection.editRange && (note._selection.editRange as any).collapsed) {
            // Reset all styles and reposition to the original selection point.
            initToggleButtonVariables(note);
            setOriginEditSelection(note);
        }
        else {	// Dragging
            // Specify style for dragged characters
            modifySelectedSingleElement(note, {
                "font-size" : note._attributes.defaultTextareaFontSize + "px",
                "line-height" : note._attributes.defaultTextareaLineHeight + "px",
                "font-family" : note._attributes.defaultTextareaFontFamily,
            });
        }
    };

    //==================================================================================
    //undo
    vn.events.elementEvents.undoButton_onClick = (e: any) => {
        let note = getParentNote(e.target);
        if(!note && vn) note = vn.vanillanoteElements[vn.variables.lastActiveNoteId];
        if(!note) return;
        // Disconnect the observer.
        vn.events.documentEvents.noteObserver!.disconnect();
        if(note._recodes.recodeConting <= 0) return;
        note._recodes.recodeConting = note._recodes.recodeConting - 1;
        replaceDifferentBetweenElements(vn, note._elements.textarea, note._recodes.recodeNotes[note._recodes.recodeConting]);
        
        // Reconnect the observer.
        connectObserver(vn);
    };

    //==================================================================================
    //redo
    vn.events.elementEvents.redoButton_onClick = (e: any) => {
        let note = getParentNote(e.target);
        if(!note && vn) note = vn.vanillanoteElements[vn.variables.lastActiveNoteId];
        if(!note) return;
        // Disconnect the observer.
        vn.events.documentEvents.noteObserver!.disconnect();
        if(note._recodes.recodeConting >= note._recodes.recodeNotes.length - 1) return;
        note._recodes.recodeConting = note._recodes.recodeConting + 1;
        replaceDifferentBetweenElements(vn, note._elements.textarea, note._recodes.recodeNotes[note._recodes.recodeConting]);
        
        // Reconnect the observer.
        connectObserver(vn);
    };

    //==================================================================================
    //help
    vn.events.elementEvents.helpButton_onClick = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        
        // Restore the note size.
        doIncreaseTextareaHeight(vn);
        
        // Close all modals
        closeAllModal(note);
        // Close all selects
        closeAllSelectBoxes(note);
        // Adjust modal size
        setAllModalSize(note);
        // Open modal background
        const displayBlock = getId(note._noteName, note._id, "on_display_block");
        const displayNone = getId(note._noteName, note._id, "on_display_none");
        note._elements.modalBack.classList.remove(displayNone);
        note._elements.modalBack.classList.add(displayBlock);
        note._elements.helpModal.classList.remove(displayNone);
        note._elements.helpModal.classList.add(displayBlock);
    };
    vn.events.elementEvents.helpModal_onClick = (e: any) => {};

    //==================================================================================
    //modal back
    vn.events.elementEvents.modalBack_onClick = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        closeAllModal(note);
    }

    //==================================================================================
    //placeholder
    vn.events.elementEvents.placeholder_onClick = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        closePlaceholder(note);
        note._elements.textarea.focus();
    };

    //==================================================================================
    //textarea
    //==================================================================================
    vn.events.elementEvents.textarea_onClick = (e: any) => {
        const note = getParentNote(e.target);
        closeAllSelectBoxes(note);
    };
    vn.events.elementEvents.textarea_onFocus = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        // Close placeholder.
        closePlaceholder(note);
        // In the editor, elements not surrounded by unit tags are recreated, wrapped with unit tags.
        doEditUnitCheck(note);
    };
    vn.events.elementEvents.textarea_onBlur = (e: any) => {
        const note = getParentNote(e.target);
        if(!note) return;
        // Open placeholder.
        openPlaceholder(note);
        // Disconnect the observer.
        vn.events.documentEvents.noteObserver!.disconnect();
        // Clean up the target element.
        removeEmptyElment(e.target, note);
        // Reconnect the observer.
        connectObserver(vn);
    };
    vn.events.elementEvents.textarea_onKeydown = (e: any) => {
        const textarea = e.target;
        if(e.key === "Enter") {
            if(!e.shiftKey) {
                textarea_onKeydownEnter(textarea);
            }
        }
        if((e.ctrlKey || e.metaKey) && (e.key === "z" || e.key === "Z")) {
            e.preventDefault();
            vn.events.elementEvents.undoButton_onClick!(e)
        }
        if((e.ctrlKey || e.metaKey) && (e.key === "y" || e.key === "Y")) {
            e.preventDefault();
            vn.events.elementEvents.redoButton_onClick!(e)
        }
    };
    vn.events.elementEvents.textarea_onKeyup = (e: any) => {
        const textarea = e.target;
        const note = getParentNote(textarea);
        // Open placeholder.
        closePlaceholder(note);
        // Disconnect the observer.
        vn.events.documentEvents.noteObserver!.disconnect();
        // If all rows are deleted, insert one p tag and br tag.
        if(!textarea.firstChild) {
            initTextarea(textarea);
            return;
        }
        // In the editor, elements not surrounded by unit tags are recreated, wrapped with unit tags.
        if((e.ctrlKey || e.metaKey) && (e.key === "v" || e.key === "V")) {
            e.preventDefault();
            // In the editor, elements not surrounded by unit tags are recreated, wrapped with unit tags.
            doEditUnitCheck(note)
        }
        // Reconnect the observer.
        connectObserver(vn);
    };
    vn.events.elementEvents.textarea_onBeforeinput = (e: any) => {
        // Only proceeds for non-mobile devices && when inputting possible characters
        if (!isMobileDevice() && e.data) {
            // Disconnect the observer.
            vn.events.documentEvents.noteObserver!.disconnect();
            textarea_onBeforeinputSpelling(e);
            // Reconnect the observer.
            connectObserver(vn);
        }
    };
}
