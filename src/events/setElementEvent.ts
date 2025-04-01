import { Vanillanote } from "../types/vanillanote";
import { getNextElementsUntilNotTag, getObjectNoteCss, getPreviousElementsUntilNotTag, validCheckAttLink } from "../utils/handleActive";
import { button_onToggle, closeAllModal, closeAllSelectBoxes, doIncreaseTextareaHeight, openAttLinkModal, selectToggle, setAllModalSize, setAllToolSize, setAllToolTipPosition } from "../utils/handleElement";
import { isValidSelection, modifySelectedSingleElement, modifySelectedUnitElementStyle, modifySelectedUnitElementTag, setEditSelection, setNewSelection, setOriginEditSelection } from "../utils/handleSelection";
import { getClassName, getCssTextFromObject, getEventChildrenClassName, getId, getParentNote, getUUID, isMobileDevice } from "../utils/util";

export const setElementEvents = (vn: Vanillanote) => {
    //toolToggleButton event
    vn.events.elementEvents.toolToggleButton_onClick = function(e: any) {
        const note = getParentNote(e.target);
        if(!note) return;
        var icon: any = note._elements.toolToggleButton.firstChild;
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
    vn.events.elementEvents.paragraphStyleSelect_onClick = function(e: any) {
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
    vn.events.elementEvents.styleNomal_onClick = function(e: any) {
        const note = getParentNote(e.target);
        // If a child element is selected, event is controlled
        var target = e.target;
        if(target.classList.contains(getEventChildrenClassName(note._noteName))) {
            target = target.parentNode;
        }
        // Changing the tag
        modifySelectedUnitElementTag(target, note);
        selectToggle(target, note);
    };

    //==================================================================================
    //styleHeader1 event
    vn.events.elementEvents.styleHeader1_onClick = function(e: any) {
        const note = getParentNote(e.target);
        // If a child element is selected, event is controlled
        var target = e.target;
        if(target.classList.contains(getEventChildrenClassName(note._noteName))) {
            target = target.parentNode;
        }
        // Changing the tag
        modifySelectedUnitElementTag(target, note);
        selectToggle(target, note);
    };
    //==================================================================================
    //styleHeader2 event
    vn.events.elementEvents.styleHeader2_onClick = function(e: any) {
        const note = getParentNote(e.target);
        // If a child element is selected, event is controlled
        var target = e.target;
        if(target.classList.contains(getEventChildrenClassName(note._noteName))) {
            target = target.parentNode;
        }
        // Changing the tag
        modifySelectedUnitElementTag(target, note);
        selectToggle(target, note);
    };
    //==================================================================================
    //styleHeader3 event
    vn.events.elementEvents.styleHeader3_onClick = function(e: any) {
        const note = getParentNote(e.target);
        // If a child element is selected, event is controlled
        var target = e.target;
        if(target.classList.contains(getEventChildrenClassName(note._noteName))) {
            target = target.parentNode;
        }
        // Changing the tag
        modifySelectedUnitElementTag(target, note);
        selectToggle(target, note);
    };
    //==================================================================================
    //styleHeader4 event
    vn.events.elementEvents.styleHeader4_onClick = function(e: any) {
        const note = getParentNote(e.target);
        // If a child element is selected, event is controlled
        var target = e.target;
        if(target.classList.contains(getEventChildrenClassName(note._noteName))) {
            target = target.parentNode;
        }
        // Changing the tag
        modifySelectedUnitElementTag(target, note);
        selectToggle(target, note);
    };
    //==================================================================================
    //styleHeader5 event
    vn.events.elementEvents.styleHeader5_onClick = function(e: any) {
        const note = getParentNote(e.target);
        // If a child element is selected, event is controlled
        var target = e.target;
        if(target.classList.contains(getEventChildrenClassName(note._noteName))) {
            target = target.parentNode;
        }
        // Changing the tag
        modifySelectedUnitElementTag(target, note);
        selectToggle(target, note);
    };
    //==================================================================================
    //styleHeader6 event
    vn.events.elementEvents.styleHeader6_onClick = function(e: any) {
        const note = getParentNote(e.target);
        // If a child element is selected, event is controlled
        var target = e.target;
        if(target.classList.contains(getEventChildrenClassName(note._noteName))) {
            target = target.parentNode;
        }
        // Changing the tag
        modifySelectedUnitElementTag(target, note);
        selectToggle(target, note);
    };

    //==================================================================================
    //boldButton event
    vn.events.elementEvents.boldButton_onClick = function(e: any) {
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
    vn.events.elementEvents.underlineButton_onClick = function(e: any) {
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
    vn.events.elementEvents.italicButton_onClick = function(e: any) {
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
    vn.events.elementEvents.ulButton_onClick = function(e: any) {
        const note = getParentNote(e.target);
        // If a child element is selected, event is controlled
        var target = e.target;
        if(target.classList.contains(getEventChildrenClassName(note._noteName))) {
            target = target.parentNode;
        }
        // Changing the tag
        modifySelectedUnitElementTag(target, note);
    };


    //==================================================================================
    //ol
    vn.events.elementEvents.olButton_onClick = function(e: any) {
        const note = getParentNote(e.target);
        // If a child element is selected, event is controlled
        var target = e.target;
        if(target.classList.contains(getEventChildrenClassName(note._noteName))) {
            target = target.parentNode;
        }
        // Changing the tag
        modifySelectedUnitElementTag(target, note);
    };

    //==================================================================================
    //text-align
    vn.events.elementEvents.textAlignSelect_onClick = function(e: any) {
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
    vn.events.elementEvents.textAlignLeft_onClick = function(e: any) {
        const note = getParentNote(e.target);
        // If a child element is selected, event is controlled
        var target = e.target;
        if(target.classList.contains(getEventChildrenClassName(note._noteName))) {
            target = target.parentNode;
        }
        // Changing the text-align
        modifySelectedUnitElementStyle(target, note);
        selectToggle(target, note);
    };

    //==================================================================================
    //text-align-center
    vn.events.elementEvents.textAlignCenter_onClick = function(e: any) {
        const note = getParentNote(e.target);
        // If a child element is selected, event is controlled
        var target = e.target;
        if(target.classList.contains(getEventChildrenClassName(note._noteName))) {
            target = target.parentNode;
        }
        // Changing the text-align
        modifySelectedUnitElementStyle(target, note);
        selectToggle(target, note);
    };

    //==================================================================================
    //text-align-right
    vn.events.elementEvents.textAlignRight_onClick = function(e: any) {
        const note = getParentNote(e.target);
        // If a child element is selected, event is controlled
        var target = e.target;
        if(target.classList.contains(getEventChildrenClassName(note._noteName))) {
            target = target.parentNode;
        }
        // Changing the text-align
        modifySelectedUnitElementStyle(target, note);
        selectToggle(target, note);
    };

    //==================================================================================
    //att link
    vn.events.elementEvents.attLinkButton_onClick = function(e: any) {
        const note = getParentNote(e.target);
        if(!note) return;
        //att madal open
        openAttLinkModal(note);
    };

    //==================================================================================
    //modal att link
    vn.events.elementEvents.attLinkModal_onClick = function(e: any) {
    };
    //modal att link text
    vn.events.elementEvents.attLinkText_onInput = function(e: any) {
        const note = getParentNote(e.target);
        if(!note) return;
        validCheckAttLink(note);
    };
    vn.events.elementEvents.attLinkText_onBlur = function(e: any) {
        const note = getParentNote(e.target);
        if(!note) return;
        validCheckAttLink(note);
    };
    //modal att link href
    vn.events.elementEvents.attLinkHref_onInput = function(e: any) {
        const note = getParentNote(e.target);
        if(!note) return;
        validCheckAttLink(note);
    };
    vn.events.elementEvents.attLinkHref_onBlur = function(e: any) {
        const note = getParentNote(e.target);
        if(!note) return;
        validCheckAttLink(note);
    };
    //modal att link insert
    vn.events.elementEvents.attLinkInsertButton_onClick = function(e: any) {
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
    vn.events.elementEvents.attLinkTooltipEditButton_onClick = function(e: any) {
        const note = getParentNote(e.target);
        if(!note) return;
        var previousElements = getPreviousElementsUntilNotTag(note._selection.editStartElement, "A", note._vn.consts);
        var nextElements = getNextElementsUntilNotTag(note._selection.editStartElement, "A", note._vn.consts);
        var startEl = previousElements[previousElements.length - 1];
        var endEl = nextElements[nextElements.length - 1];
        
        // Sets the new selection range.
        var newSelection = setNewSelection(
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
    vn.events.elementEvents.attLinkTooltipUnlinkButton_onClick = function(e: any) {
        const note = getParentNote(e.target);
        if(!note) return;
        var previousElements = getPreviousElementsUntilNotTag(note._selection.editStartElement, "A", note._vn.consts);
        var nextElements = getNextElementsUntilNotTag(note._selection.editStartElement, "A", note._vn.consts);
        var startEl = previousElements[previousElements.length - 1];
        var endEl = nextElements[nextElements.length - 1];
        
        // Sets the new selection range.
        var newSelection = setNewSelection(
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
    vn.events.elementEvents.attFileButton_onClick = function(e: any) {
        const note = getParentNote(e.target);
        if(!note) return;
        
        // Restore the note size.
        doIncreaseTextareaHeight(note._vn);
        // Close all modals
        closeAllModal(note);
        // Close all selects
        closeAllSelectBoxes(note);
        // Adjust modal size
        setAllModalSize(note);
        // Open modal background
        var displayBlock = getId(note._noteName, note._id, "on_display_block");
        var displayNone = getId(note._noteName, note._id, "on_display_none");
        note._elements.modalBack.classList.remove(displayNone);
        note._elements.modalBack.classList.add(displayBlock);
        note._elements.attFileModal.classList.remove(displayNone);
        note._elements.attFileModal.classList.add(displayBlock);
    };
    //==================================================================================
    //modal att file
    vn.events.elementEvents.attFileModal_onClick = function(e: any) {
    };
    //modal att file upload button
    vn.events.elementEvents.attFileUploadButton_onClick = function(e: any) {
        const note = getParentNote(e.target);
        if(!note) return;
        note._elements.attFileUpload.click();
    };
    //modal att file upload div
    vn.events.elementEvents.attFileUploadDiv_onDragover = function(e: any) {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
    };
    vn.events.elementEvents.attFileUploadDiv_onDrop = function(e: any) {
        e.preventDefault();
        const note = getParentNote(e.target);
        if(!note) return;
        var files = Array.from(e.dataTransfer.files);
        files.sort(function(a: any, b: any) {
            if (a.name < b.name) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }
            return 0;
        });
        for(var i = 0; i < files.length; i++){
            (note._attTempFiles as any)[getUUID()] = files[i];
        }
        // Leave attTempFiles with only valid files.
        setAttTempFileValid(noteIndex);
        // Set attFileUploadDiv.
        setAttFileUploadDiv(noteIndex);
    };
    vn.events.elementEvents.attFileUploadDiv_onClick = function(e: any) {
        var uuid = e.target.getAttribute("uuid");
        if(!uuid) return;
        const note = getParentNote(e.target);
        if(!note) return;
        delete vn.variables.attTempFiles[uuid]
        e.target.remove();
        
        if(note._elements.attFileUploadDivs.childNodes.length <= 0) {
            note._elements.attFileUploadDivs.textContent = vn.languageSet[vn.variables.languages].attFileUploadDiv;
            note._elements.attFileUploadDivs.style.lineHeight = vn.variables.sizeRates * 130 + "px";
        }
    };
    //modal att file upload
    vn.events.elementEvents.attFileUpload_onInput = function(e: any) {
        const note = getParentNote(e.target);
        if(!note) return;
        var files = Array.from(e.target.files);
        files.sort(function(a: any, b: any) {
            if (a.name < b.name) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }
            return 0;
        });
        for(var i = 0; i < files.length; i++){
            (vn.variables.attTempFiles as any)[getUUID()] = files[i];
        }
        // Leave attTempFiles with only valid files.
        setAttTempFileValid(noteIndex);
        // Set attFileUploadDiv.
        setAttFileUploadDiv(noteIndex);
    };
    vn.events.elementEvents.attFileUpload_onBlur = function(e: any) {
        const note = getParentNote(e.target);
        if(!note) return;
    };
    //modal att file insert
    vn.events.elementEvents.attFileInsertButton_onClick = function(e: any) {
        /*
        If there's a range
            Insert <p><input file></p> at startElement
            Clear attTempFiles, attFileUploadDiv and then close the modal
        If there's no range
            Clear attTempFiles, attFileUploadDiv and then close the modal
        */
        const note = getParentNote(e.target);
        if(!note) return;
        if(!isValidSelection(noteIndex)) {
            closeAllModal(note);
            return;
note }
        if(!vn.variables.editStartUnitElements) {
            closeAllModal(note);
            return;
note }
        var keys = Object.keys(vn.variables.attTempFiles);
        if(keys.length <= 0) {
            closeAllModal(note);
            return;
note }
        var editStartUnitElements: any = vn.variables.editStartUnitElements;
        var tempEl1;
        var tempEl2;
        var selectEl;
        
        for(var i = keys.length - 1; i >= 0; i--) {
            tempEl1 = document.createElement(editStartUnitElements.tagName);
            tempEl2 = getElement(
                    "",
                    "a",
                    "",
                    {
                        "class" : getClassName(note._noteName, note._id, "downloader"),
                        "uuid" : keys[i],
                        "data-note-id" : noteIndex,
                        "href" : URL.createObjectURL(vn.variables.attTempFiles[keys[i]]),
                        "download" : vn.variables.attTempFiles[keys[i]].name,
                        "style" : getCssTextFromObject(getObjectNoteCss(noteIndex)),
                    }
                );
            tempEl2.innerText = "download : "+vn.variables.attTempFiles[keys[i]].name;
            tempEl1.appendChild(tempEl2)
            editStartUnitElements.parentNode.insertBefore(tempEl1, editStartUnitElements.nextSibling);
            
            // Save attach file object
            vn.variables.attFiles[keys[i]] = vn.variables.attTempFiles[keys[i]];
            if(i === keys.length - 1) selectEl = tempEl1;
        }
        closeAllModal(note);
        // Sets the new selection range.
        noten(
            selectEl,
            1,
            selectEl,
            1
            );
    };
    //==================================================================================
    //att image
    vn.events.elementEvents.attImageButton_onClick = function(e: any) {
        const note = getParentNote(e.target);
        if(!note) return;
        
        // Restore the note size.
        doIncreaseTextareaHeight(note._vn);
        // Close all modals
        closeAllModal(note);
        // Close all selects
        closeAllSelectBoxes(note);
        // Adjust modal size
        setAllModalSize(note);
        // Open modal background
        var displayBlock = getId(note._noteName, note._id, "on_display_block");
        var displayNone = getId(note._noteName, note._id, "on_display_none");
        note._elements.modalBacks.classList.remove(displayNone);
        note._elements.modalBacks.classList.add(displayBlock);
        note._elements.attImageModals.classList.remove(displayNone);
        note._elements.attImageModals.classList.add(displayBlock);
    };
    //==================================================================================
    //modal att image
    vn.events.elementEvents.attImageModal_onClick = function(e: any) {
    };
    //modalatt image uplaod button and view
    vn.events.elementEvents.attImageUploadButtonAndView_onDragover = function(e: any) {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
    };
    vn.events.elementEvents.attImageUploadButtonAndView_onDrop = function(e: any) {
        e.preventDefault();
        const note = getParentNote(e.target);
        if(!note) return;
        var files = Array.from(e.dataTransfer.files);
        for(var i = 0; i < files.length; i++){
            (vn.variables.attTempImages as any)[getUUID()] = files[i];
        }
        // Leave attTempImages with only valid files.
        setAttTempImageValid(noteIndex);
        // Set attImageUploadAndView.
        setAttImageUploadAndView(noteIndex);
    };
    vn.events.elementEvents.attImageUploadButtonAndView_onClick = function(e: any) {
        const note = getParentNote(e.target);
        if(!note) return;
        note._elements.attImageUploads.click();
    };
    //modal att image view pre button
    vn.events.elementEvents.attImageViewPreButtion_onClick = function(e: any) {
        const note = getParentNote(e.target);
        if(!note) return;
        var scrollAmount = note._elements.attImageUploadButtonAndViews.offsetWidth / 1.5 + 10;
        note._elements.attImageUploadButtonAndViews.scrollLeft -= scrollAmount;
    };
    //modal att image view next button
    vn.events.elementEvents.attImageViewNextButtion_onClick = function(e: any) {
        const note = getParentNote(e.target);
        if(!note) return;
        var scrollAmount = note._elements.attImageUploadButtonAndViews.offsetWidth / 1.5 + 10;
        note._elements.attImageUploadButtonAndViews.scrollLeft += scrollAmount;
    };
    //modal att image upload
    vn.events.elementEvents.attImageUpload_onInput = function(e: any) {
        const note = getParentNote(e.target);
        if(!note) return;
        var files = Array.from(e.target.files);
        for(var i = 0; i < files.length; i++){
            (vn.variables.attTempImages as any)[getUUID()] = files[i];
        }
        // Leave attTempImages with only valid files.
        setAttTempImageValid(noteIndex);
        // Set attImageUploadAndView.
        setAttImageUploadAndView(noteIndex);
    };
    vn.events.elementEvents.attImageUpload_onBlur = function(e: any) {
        const note = getParentNote(e.target);
        if(!note) return;
    };
    //modal att image url
    vn.events.elementEvents.attImageURL_onInput = function(e: any) {
        const note = getParentNote(e.target);
        if(!note) return;
        var url = e.target.value;
        if(url) {
            note._elements.attImageUploadButtonAndViews.replaceChildren();
            const tempEl = document.createElement("img");
            tempEl.src = url;
            tempEl.style.width = "auto";
            tempEl.style.height = "100%";
            tempEl.style.display = "inline-block";
            tempEl.style.margin = "0 5px"
            note._elements.attImageUploadButtonAndViews.appendChild(tempEl);
        }
        else {
            note._elements.attImageUploadButtonAndViews.textContent = vn.languageSet[vn.variables.languages].attImageUploadButtonAndView;
        }
    };
    vn.events.elementEvents.attImageURL_onBlur = function(e: any) {
        const note = getParentNote(e.target);
        if(!note) return;
    };
    //modal att image insert
    vn.events.elementEvents.attImageInsertButton_onClick = function(e: any) {
        /*
        In case of having a range:
            Sequentially insert <img url/> into startElement
            Reset attTempImages, attImageUploadButtonAndView, attImageURL and close modal
            If it's uload method:
                Store files in vn.variables.attImages
        If there is no range:
            Reset attTempImages, attImageUploadButtonAndView, attImageURL and close modal
        */
        const note = getParentNote(e.target);
        if(!note) return;
        if(!isValidSelection(noteIndex)) {
            closeAllModal(note);
            return;
note }
        if(!vn.variables.editStartUnitElements) {
            closeAllModal(note);
            return;
note }
        
        if((note._elements.attImageURLs as any).value) {
            var url = (note._elements.attImageURLs as any).value;
            var editStartUnitElements: any = vn.variables.editStartUnitElements;
            var tempEl1;
            var tempEl2;
            var viewerStyle = "width: 100%; overflow:hidden;"
        
            tempEl1 = document.createElement(editStartUnitElements.tagName);
            tempEl2 = getElement(
                    "",
                    "img",
                    "",
                    {
                        "class" : getClassName(note._noteName, note._id, "image_viewer"),
                        "data-note-id" : noteIndex,
                        "src" : url,
                        "style" : viewerStyle,
                        "title" : "",
                    }
                );
            tempEl1.appendChild(tempEl2)
            editStartUnitElements.parentNode.insertBefore(tempEl1, editStartUnitElements.nextSibling);
            
            closeAllModal(note);
            // Sets the new selection range.
            noten(
                tempEl1,
                0,
                tempEl1,
                0
                );
            return;
        }
        
        var keys = Object.keys(vn.variables.attTempImages);
        if(keys.length > 0) {
            var editStartUnitElements: any = vn.variables.editStartUnitElements;
            var tempEl1;
            var tempEl2;
            var tempFile;
            var viewerStyle = "width: 100%; overflow:hidden;"
            var selectEl;
            
            for(var i = keys.length - 1; i >= 0; i--) {
                // Save image file object
                vn.variables.attImages[keys[i]] = vn.variables.attTempImages[keys[i]];
                
                tempEl1 = document.createElement(editStartUnitElements.tagName);
                tempEl2 = getElement(
                        "",
                        "img",
                        "",
                        {
                            "class" : getClassName(note._noteName, note._id, "image_viewer"),
                            "uuid" : keys[i],
                            "data-note-id" : noteIndex,
                            "src" : URL.createObjectURL(vn.variables.attImages[keys[i]]),
                            "style" : viewerStyle,
                            "title" : "",
                        }
                    );
                tempEl1.appendChild(tempEl2)
                editStartUnitElements.parentNode.insertBefore(tempEl1, editStartUnitElements.nextSibling);
                
                if(i === 0) selectEl = tempEl1;
            }
                
            closeAllModal(note);
            // Sets the new selection range.
            noten(
                selectEl,
                0,
                selectEl,
                0
                );
            return;
        }
        
        closeAllModal(note);
        return;
note};

    //==================================================================================
    //att video
    vn.events.elementEvents.attVideoButton_onClick = function(e: any) {
        const note = getParentNote(e.target);
        if(!note) return;
        
        // Restore the note size.
        doIncreaseTextareaHeight(note._vn);
        
        closeAllModal(note);
        
        var displayBlock = getId(note._noteName, note._id, "on_display_blocknote);
        var displayNone = getId(note._noteName, note._id, "on_display_none");
        note._elements.modalBacks.classList.remove(displayNone);
        note._elements.modalBacks.classList.add(displayBlock);
        note._elements.attVideoModals.classList.remove(displayNone);
        note._elements.attVideoModals.classList.add(displayBlock);

        //modal setting
        (note._elements.attVideoEmbedIds as any).value = "";
        (note._elements.attVideoWidthes as any).value = 100;
        (note._elements.attVideoHeights as any).value = 500;

        validCheckAttVideo(noteIndex);
    };
    //==================================================================================
    //modal att video
    vn.events.elementEvents.attVideoModal_onClick = function(e: any) {
    };
    //modal att video embed id
    vn.events.elementEvents.attVideoEmbedId_onInput = function(e: any) {
        const note = getParentNote(e.target);
        if(!note) return;
        validCheckAttVideo(noteIndex);
    };
    vn.events.elementEvents.attVideoEmbedId_onBlur = function(e: any) {
        const note = getParentNote(e.target);
        if(!note) return;
        validCheckAttVideo(noteIndex);
    };
    //modal att video width
    vn.events.elementEvents.attVideoWidth_onInput = function(e: any) {
        if(!e.target.value) return;
        var inputValue = e.target.value;
        if(!checkNumber(inputValue)) {
            e.target.value = "";
            return;
        }
    };
    vn.events.elementEvents.attVideoWidth_onBlur = function(e: any) {
        if(!e.target.value) e.target.value = 100;
        var widthPer = e.target.value;
        if(widthPer < 10) widthPer = 10;
        if(widthPer > 100) widthPer = 100;
        e.target.value = widthPer;
    };
    //modal att video height
    vn.events.elementEvents.attVideoHeight_onInput = function(e: any) {
        if(!e.target.value) return;
        var inputValue = e.target.value;
        if(!checkNumber(inputValue)) {
            e.target.value = "";
            return;
        }
    };
    vn.events.elementEvents.attVideoHeight_onBlur = function(e: any) {
        if(!e.target.value) e.target.value = 500;
        var height = e.target.value;
        if(height < 50) height = 50;
        if(height > 1000) height = 1000;
        e.target.value = height;
    };
    //modal att video insert
    vn.events.elementEvents.attVideoInsertButton_onClick = function(e: any) {
        const note = getParentNote(e.target);
        if(!note) return;
        if(!isValidSelection(noteIndex)) {
            closeAllModal(note);
            return;
note }
        var attVideoValidCheckbox: any = note._elements.attVideoValidCheckboxes;
        if(!attVideoValidCheckbox.checked) {
            return;
        }

        if(!vn.variables.editStartUnitElements) {
            closeAllModal(note);
            return;
note }

        if((note._elements.attVideoEmbedIds as any).value) {
            var src = "https://www.youtube.com/embed/" + (note._elements.attVideoEmbedIds as any).value;
            var editStartUnitElements: any = vn.variables.editStartUnitElements;
            var tempEl1;
            var tempEl2;
            var viewerStyle = "overflow:hidden;"
                                + "width:" + (note._elements.attVideoWidthes as any).value + "%;"
                                + "height:" + (note._elements.attVideoHeights as any).value + "px;";
        
            tempEl1 = document.createElement(editStartUnitElements.tagName);
            tempEl2 = getElement(
                    "",
                    "iframe",
                    "",
                    {
                        "class" : getClassName(note._noteName, note._id, "video_viewer"),
                        "data-note-id" : noteIndex,
                        "src" : src,
                        "title" : "YouTube video player",
                        "frameborder" : "0",
                        "allow" : "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
                        "allowfullscreen" : "",
                        "style" : viewerStyle,
                    }
                );
            tempEl1.appendChild(tempEl2)
            editStartUnitElements.parentNode.insertBefore(tempEl1, editStartUnitElements.nextSibling);
            
            closeAllModal(note);
            // Sets the new selection range.
            noten(
                tempEl1,
                0,
                tempEl1,
                0
                );
            return;
        }

        closeAllModal(note);
    note

    //==================================================================================
    //att image tooltip width input event
    vn.events.elementEvents.attImageAndVideoTooltipWidthInput_onInput = function(e: any) {
        if(!e.target.value) return;
        var inputValue = e.target.value;
        if(!checkNumber(inputValue)) {
            e.target.value = "";
            return;
        }
    };
    vn.events.elementEvents.attImageAndVideoTooltipWidthInput_onBlur = function(e: any) {
        setImageAndVideoWidth(e.target);
    };
    vn.events.elementEvents.attImageAndVideoTooltipWidthInput_onKeyup = function(e: any) {
        if(e.key === "Enter") {
            setImageAndVideoWidth(e.target);
        }
    };
    //att image tooltip float radio none input event
    vn.events.elementEvents.attImageAndVideoTooltipFloatRadioNone_onClick = function(e: any) {
        const note = getParentNote(e.target);
        if(!note) return;
        var imgNode: any = (vn.variables.editStartNodes as any).cloneNode(true);
        if(imgNode.tagName !== "IMG" && imgNode.tagName !== "IFRAME") return;
        imgNode.style.float = "none";
        (vn.variables.editStartNodes as any).parentNode.replaceChild(imgNode, (vn.variables.editStartNodes as any));
        vn.variables.editStartNodes = imgNode;
    };
    //att image tooltip float radio left input event
    vn.events.elementEvents.attImageAndVideoTooltipFloatRadioLeft_onClick = function(e: any) {
        const note = getParentNote(e.target);
        if(!note) return;
        var imgNode: any = (vn.variables.editStartNodes as any).cloneNode(true);
        if(imgNode.tagName !== "IMG" && imgNode.tagName !== "IFRAME") return;
        imgNode.style.float = "left";
        (vn.variables.editStartNodes as any).parentNode.replaceChild(imgNode, (vn.variables.editStartNodes as any));
        vn.variables.editStartNodes = imgNode;
    };
    //att image tooltip float radio right input event
    vn.events.elementEvents.attImageAndVideoTooltipFloatRadioRight_onClick = function(e: any) {
        const note = getParentNote(e.target);
        if(!note) return;
        var imgNode: any = (vn.variables.editStartNodes as any).cloneNode(true);
        if(imgNode.tagName !== "IMG" && imgNode.tagName !== "IFRAME") return;
        imgNode.style.float = "right";
        (vn.variables.editStartNodes as any).parentNode.replaceChild(imgNode, (vn.variables.editStartNodes as any));
        vn.variables.editStartNodes = imgNode;
    };
    //att image tooltip shape square radio input event
    vn.events.elementEvents.attImageAndVideoTooltipShapeRadioSquare_onClick = function(e: any) {
        const note = getParentNote(e.target);
        if(!note) return;
        var imgNode: any = vn.variables.editStartNodes;
        if(imgNode.tagName !== "IMG" && imgNode.tagName !== "IFRAME") return;
        imgNode.style.removeProperty("border-radius");
        (vn.variables.editStartNodes as any).parentNode.replaceChild(imgNode, (vn.variables.editStartNodes as any));
        vn.variables.editStartNodes = imgNode;
    };
    //att image tooltip shape radius radio input event
    vn.events.elementEvents.attImageAndVideoTooltipShapeRadioRadius_onClick = function(e: any) {
        const note = getParentNote(e.target);
        if(!note) return;
        var imgNode: any = vn.variables.editStartNodes;
        if(imgNode.tagName !== "IMG" && imgNode.tagName !== "IFRAME") return;
        imgNode.style.borderRadius = "5%";
        (vn.variables.editStartNodes as any).parentNode.replaceChild(imgNode, (vn.variables.editStartNodes as any));
        vn.variables.editStartNodes = imgNode;
    };
    //att image tooltip shape circle radio input event
    vn.events.elementEvents.attImageAndVideoTooltipShapeRadioCircle_onClick = function(e: any) {
        const note = getParentNote(e.target);
        if(!note) return;
        var imgNode: any = vn.variables.editStartNodes;
        if(imgNode.tagName !== "IMG" && imgNode.tagName !== "IFRAME") return;
        imgNode.style.borderRadius = "50%";
        (vn.variables.editStartNodes as any).parentNode.replaceChild(imgNode, (vn.variables.editStartNodes as any));
        vn.variables.editStartNodes = imgNode;
    };

    //==================================================================================
    //fontSizeInputBox event
    vn.events.elementEvents.fontSizeInputBox_onClick = function(e: any) {
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
    vn.events.elementEvents.fontSizeInput_onClick = function(e: any) {
    };
    vn.events.elementEvents.fontSizeInput_onInput = function(e: any) {
        if(!e.target.value) return;
        var inputValue = e.target.value;
        const note = getParentNote(e.target);
        if(!note) return;
        if(!checkNumber(inputValue)) {
            e.target.value = "";
            return;
        }
        vn.variables.fontSizes = inputValue;
    };
    vn.events.elementEvents.fontSizeInput_onBlur = function(e: any) {
        const note = getParentNote(e.target);
        if(!note) return;
        if(!e.target.value) {
            e.target.value = vn.variables.fontSizes;
        }
        var inputValueNum = Number(e.target.value);
        if(inputValueNum > 120) {
            e.target.value = "120";
            vn.variables.fontSizes = e.target.value;
            return;
        }
        if(inputValueNum < 6) {
            e.target.value = "6";
            vn.variables.fontSizes = e.target.value;
            return;
        }
        vn.variables.fontSizes = e.target.value;
    };

    //==================================================================================
    //letterSpacingInputBox event
    vn.events.elementEvents.letterSpacingInputBox_onClick = function(e: any) {
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
    vn.events.elementEvents.letterSpacingInput_onClick = function(e: any) {
    };
    vn.events.elementEvents.letterSpacingInput_onInput = function(e: any) {
        if(!e.target.value) return;
        var inputValue = e.target.value;
        const note = getParentNote(e.target);
        if(!note) return;
        if(!checkRealNumber(inputValue)) {
            e.target.value = "";
            return;
        }
        vn.variables.letterSpacings = inputValue;
    };
    vn.events.elementEvents.letterSpacingInput_onBlur = function(e: any) {
        const note = getParentNote(e.target);
        if(!note) return;
        if(!e.target.value) {
            e.target.value = "0";
            vn.variables.letterSpacings = e.target.value;
            return;
        }
        var inputValueNum = Number(e.target.value);
        if(inputValueNum > 30) {
            e.target.value = "30";
            vn.variables.letterSpacings = e.target.value;
            return;
        }
        if(inputValueNum < -5) {
            e.target.value = "-5";
            vn.variables.letterSpacings = e.target.value;
            return;
        }
        vn.variables.letterSpacings = e.target.value;
    };

    //==================================================================================
    //lineHeightInputBox event
    vn.events.elementEvents.lineHeightInputBox_onClick = function(e: any) {
    };
    vn.events.elementEvents.lineHeightInputBox_onInput = function(e: any) {
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
    vn.events.elementEvents.lineHeightInput_onClick = function(e: any) {
    };
    vn.events.elementEvents.lineHeightInput_onInput = function(e: any) {
        if(!e.target.value) return;
        var inputValue = e.target.value;
        const note = getParentNote(e.target);
        if(!note) return;
        if(!checkNumber(inputValue)) {
            e.target.value = "";
            return;
        }
        vn.variables.lineHeights = e.target.value;
    };
    vn.events.elementEvents.lineHeightInput_onBlur = function(e: any) {
        const note = getParentNote(e.target);
        if(!note) return;
        if(!e.target.value) {
            e.target.value = vn.variables.lineHeights;
        }
        var inputValueNum = Number(e.target.value);
        if(inputValueNum > 150) {
            e.target.value = "150";
            vn.variables.lineHeights = e.target.value;
            return;
        }
        if(inputValueNum < 6) {
            e.target.value = "6";
            vn.variables.lineHeights = e.target.value;
            return;
        }
        vn.variables.lineHeights = e.target.value;
    };

    //==================================================================================
    //fontFamilySelect event
    vn.events.elementEvents.fontFamilySelect_onClick = function(e: any) {
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
    vn.events.elementEvents.colorTextSelect_onClick = function(e: any) {
        const note = getParentNote(e.target);
        if(!note) return;
        selectToggle(e.target);
        // It's too inconvenient if the cursor is caught again on mobile..
        if(!isMobileDevice()) {
            setOriginEditSelection(note);
        }
    };
    //color text select box
    vn.events.elementEvents.colorTextSelectBox_onClick = function(e: any) {
    };
    //colorText R Input event
    vn.events.elementEvents.colorTextRInput_onClick = function(e: any) {
    };
    vn.events.elementEvents.colorTextRInput_onInput = function(e: any) {
        if(!e.target.value) return;
        var inputValue = e.target.value;
        const note = getParentNote(e.target);
        if(!note) return;
        if(!checkHex(inputValue)) {
            inputValue = vn.variables.colorTextRs;
            e.target.value = inputValue;
            return;
        }
        if(inputValue.length !== 2) return;
        vn.variables.colorTextRs = inputValue;
        note._elements.colorText0s.style.backgroundColor = "#" + vn.variables.colorTextRs +  vn.variables.colorTextGs +  vn.variables.colorTextBs;
    };
    vn.events.elementEvents.colorTextRInput_onBlur = function(e: any) {
        var value = e.target.value;
        const note = getParentNote(e.target);
        if(!note) return;
        if(!checkHex(value)) {
            e.target.value = vn.variables.colorTextRs;
            return;
        }
        if(value.length !== 2) {
            e.target.value = vn.variables.colorTextRs;
        }
    };
    //colorText G Input event
    vn.events.elementEvents.colorTextGInput_onClick = function(e: any) {
    };
    vn.events.elementEvents.colorTextGInput_onInput = function(e: any) {
        if(!e.target.value) return;
        var inputValue = e.target.value;
        const note = getParentNote(e.target);
        if(!note) return;
        if(!checkHex(inputValue)) {
            inputValue = vn.variables.colorTextGs;
            e.target.value = inputValue;
            return;
        }
        if(inputValue.length !== 2) return;
        vn.variables.colorTextGs = inputValue;
        note._elements.colorText0s.style.backgroundColor = "#" + vn.variables.colorTextRs +  vn.variables.colorTextGs +  vn.variables.colorTextBs;
    };
    vn.events.elementEvents.colorTextGInput_onBlur = function(e: any) {
        var value = e.target.value;
        const note = getParentNote(e.target);
        if(!note) return;
        if(!checkHex(value)) {
            e.target.value = vn.variables.colorTextGs;
            return;
        }
        if(value.length !== 2) {
            e.target.value = vn.variables.colorTextGs;
        }
    };
    //colorText B Input event
    vn.events.elementEvents.colorTextBInput_onClick = function(e: any) {
    };
    vn.events.elementEvents.colorTextBInput_onInput = function(e: any) {
        if(!e.target.value) return;
        var inputValue = e.target.value;
        const note = getParentNote(e.target);
        if(!note) return;
        if(!checkHex(inputValue)) {
            inputValue = vn.variables.colorTextBs;
            e.target.value = inputValue;
            return;
        }
        if(inputValue.length !== 2) return;
        vn.variables.colorTextBs = inputValue;
        note._elements.colorText0s.style.backgroundColor = "#" + vn.variables.colorTextRs +  vn.variables.colorTextGs +  vn.variables.colorTextBs;
    };
    vn.events.elementEvents.colorTextBInput_onBlur = function(e: any) {
        var value = e.target.value;
        const note = getParentNote(e.target);
        if(!note) return;
        if(!checkHex(value)) {
            e.target.value = vn.variables.colorTextBs;
            return;
        }
        if(value.length !== 2) {
            e.target.value = vn.variables.colorTextBs;
        }
    };
    //colorText Opacity Input event
    vn.events.elementEvents.colorTextOpacityInput_onClick = function(e: any) {
    };
    vn.events.elementEvents.colorTextOpacityInput_onInput = function(e: any) {
        if(e.target.value === "01" || e.target.value === "10") {
            e.target.value = e.data;
        } 
        if(!e.target.value) return;
        var inputValue = e.target.value;
        const note = getParentNote(e.target);
        if(!note) return;
        if(!checkRealNumber(inputValue)) {
            inputValue = vn.variables.colorTextOs;
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
        
        vn.variables.colorTextOs = inputValue;
        note._elements.colorText0s.style.opacity = vn.variables.colorTextOs;
    };
    vn.events.elementEvents.colorTextOpacityInput_onBlur = function(e: any) {
        var value = e.target.value;
        const note = getParentNote(e.target);
        if(!note) return;
        if(!checkRealNumber(value)) {
            e.target.value = vn.variables.colorTextOs;
        }
    };
    //colorText0 event
    vn.events.elementEvents.colorText0_onClick = function(e: any) {
        const note = getParentNote(e.target);
        if(!note) return;
        vn.variables.colorTextRGBs = "#" + vn.variables.colorTextRs +  vn.variables.colorTextGs +  vn.variables.colorTextBs;
        vn.variables.colorTextOpacitys = vn.variables.colorTextOs;
        if(!isMobileDevice()) {
            (note._elements.colorTextSelects as any).querySelector("."+getEventChildrenClassName(note._noteName)).style.color
                = getRGBAFromHex(vn.variables.colorTextRGBs, vn.variables.colorTextOpacitys === "0" ? 1 : vn.variables.colorTextOpacitys);
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
    vn.events.elementEvents.colorText1_onClick = function(e: any) {
        const note = getParentNote(e.target);
        if(!note) return;
        vn.variables.colorTextRGBs = getHexColorFromColorName(vn.colors.color14);
        vn.variables.colorTextOpacitys = "1";
        if(!isMobileDevice()) {
            (note._elements.colorTextSelects as any).querySelector("."+getEventChildrenClassName(note._noteName)).style.color
                = getRGBAFromHex(vn.variables.colorTextRGBs, vn.variables.colorTextOpacitys);
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
    vn.events.elementEvents.colorText2_onClick = function(e: any) {
        const note = getParentNote(e.target);
        if(!note) return;
        vn.variables.colorTextRGBs = getHexColorFromColorName(vn.colors.color15);
        vn.variables.colorTextOpacitys = "1";
        if(!isMobileDevice()) {
            (note._elements.colorTextSelects as any).querySelector("."+getEventChildrenClassName(note._noteName)).style.color
                = getRGBAFromHex(vn.variables.colorTextRGBs, vn.variables.colorTextOpacitys);
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
    vn.events.elementEvents.colorText3_onClick = function(e: any) {
        const note = getParentNote(e.target);
        if(!note) return;
        vn.variables.colorTextRGBs = getHexColorFromColorName(vn.colors.color16);
        vn.variables.colorTextOpacitys = "1";
        if(!isMobileDevice()) {
            (note._elements.colorTextSelects as any).querySelector("."+getEventChildrenClassName(note._noteName)).style.color
                = getRGBAFromHex(vn.variables.colorTextRGBs, vn.variables.colorTextOpacitys);
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
    vn.events.elementEvents.colorText4_onClick = function(e: any) {
        const note = getParentNote(e.target);
        if(!note) return;
        vn.variables.colorTextRGBs = getHexColorFromColorName(vn.colors.color17);
        vn.variables.colorTextOpacitys = "1";
        if(!isMobileDevice()) {
            (note._elements.colorTextSelects as any).querySelector("."+getEventChildrenClassName(note._noteName)).style.color
                = getRGBAFromHex(vn.variables.colorTextRGBs, vn.variables.colorTextOpacitys);
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
    vn.events.elementEvents.colorText5_onClick = function(e: any) {
        const note = getParentNote(e.target);
        if(!note) return;
        vn.variables.colorTextRGBs = getHexColorFromColorName(vn.colors.color18);
        vn.variables.colorTextOpacitys = "1";
        if(!isMobileDevice()) {
            (note._elements.colorTextSelects as any).querySelector("."+getEventChildrenClassName(note._noteName)).style.color
                = getRGBAFromHex(vn.variables.colorTextRGBs, vn.variables.colorTextOpacitys);
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
    vn.events.elementEvents.colorText6_onClick = function(e: any) {
        const note = getParentNote(e.target);
        if(!note) return;
        vn.variables.colorTextRGBs = getHexColorFromColorName(vn.colors.color19);
        vn.variables.colorTextOpacitys = "1";
        if(!isMobileDevice()) {
            (note._elements.colorTextSelects as any).querySelector("."+getEventChildrenClassName(note._noteName)).style.color
                = getRGBAFromHex(vn.variables.colorTextRGBs, vn.variables.colorTextOpacitys);
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
    vn.events.elementEvents.colorText7_onClick = function(e: any) {
        const note = getParentNote(e.target);
        if(!note) return;
        vn.variables.colorTextRGBs = getHexColorFromColorName(vn.colors.color20);
        vn.variables.colorTextOpacitys = "1";
        if(!isMobileDevice()) {
            (note._elements.colorTextSelects as any).querySelector("."+getEventChildrenClassName(note._noteName)).style.color
                = getRGBAFromHex(vn.variables.colorTextRGBs, vn.variables.colorTextOpacitys);
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
    vn.events.elementEvents.colorBackSelect_onClick = function(e: any) {
        const note = getParentNote(e.target);
        if(!note) return;
        selectToggle(e.target);
        // It's too inconvenient if the cursor is caught again on mobile..
        if(!isMobileDevice()) {
            setOriginEditSelection(note);
        }
    };
    //color background select box
    vn.events.elementEvents.colorBackSelectBox_onClick = function(e: any) {
    };
    //colorBack R Input event
    vn.events.elementEvents.colorBackRInput_onClick = function(e: any) {
    };
    vn.events.elementEvents.colorBackRInput_onInput = function(e: any) {
        if(!e.target.value) return;
        var inputValue = e.target.value;
        const note = getParentNote(e.target);
        if(!note) return;
        if(!checkHex(inputValue)) {
            inputValue = vn.variables.colorBackRs;
            e.target.value = inputValue;
            return;
        }
        if(inputValue.length !== 2) return;
        vn.variables.colorBackRs = inputValue;
        note._elements.colorBack0s.style.backgroundColor = "#" + vn.variables.colorBackRs +  vn.variables.colorBackGs +  vn.variables.colorBackBs;
    };
    vn.events.elementEvents.colorBackRInput_onBlur = function(e: any) {
        var value = e.target.value;
        const note = getParentNote(e.target);
        if(!note) return;
        if(!checkHex(value)) {
            e.target.value = vn.variables.colorBackRs;
            return;
        }
        if(value.length !== 2) {
            e.target.value = vn.variables.colorBackRs;
        }
    };
    //colorBack G Input event
    vn.events.elementEvents.colorBackGInput_onClick = function(e: any) {
    };
    vn.events.elementEvents.colorBackGInput_onInput = function(e: any) {
        if(!e.target.value) return;
        var inputValue = e.target.value;
        const note = getParentNote(e.target);
        if(!note) return;
        if(!checkHex(inputValue)) {
            inputValue = vn.variables.colorBackGs;
            e.target.value = inputValue;
            return;
        }
        if(inputValue.length !== 2) return;
        vn.variables.colorBackGs = inputValue;
        note._elements.colorBack0s.style.backgroundColor = "#" + vn.variables.colorBackRs +  vn.variables.colorBackGs +  vn.variables.colorBackBs;
    };
    vn.events.elementEvents.colorBackGInput_onBlur = function(e: any) {
        var value = e.target.value;
        const note = getParentNote(e.target);
        if(!note) return;
        if(!checkHex(value)) {
            e.target.value = vn.variables.colorBackGs;
            return;
        }
        if(value.length !== 2) {
            e.target.value = vn.variables.colorBackGs;
        }
    };
    //colorBack B Input event
    vn.events.elementEvents.colorBackBInput_onClick = function(e: any) {
    };
    vn.events.elementEvents.colorBackBInput_onInput = function(e: any) {
        if(!e.target.value) return;
        var inputValue = e.target.value;
        const note = getParentNote(e.target);
        if(!note) return;
        if(!checkHex(inputValue)) {
            inputValue = vn.variables.colorBackBs;
            e.target.value = inputValue;
            return;
        }
        if(inputValue.length !== 2) return;
        vn.variables.colorBackBs = inputValue;
        note._elements.colorBack0s.style.backgroundColor = "#" + vn.variables.colorBackRs +  vn.variables.colorBackGs +  vn.variables.colorBackBs;
    };
    vn.events.elementEvents.colorBackBInput_onBlur = function(e: any) {
        var value = e.target.value;
        const note = getParentNote(e.target);
        if(!note) return;
        if(!checkHex(value)) {
            e.target.value = vn.variables.colorBackBs;
            return;
        }
        if(value.length !== 2) {
            e.target.value = vn.variables.colorBackBs;
        }
    };
    //colorBack Opacity Input event
    vn.events.elementEvents.colorBackOpacityInput_onClick = function(e: any) {
    };
    vn.events.elementEvents.colorBackOpacityInput_onInput = function(e: any) {
        if(e.target.value === "01" || e.target.value === "10") {
            e.target.value = e.data;
        } 
        if(!e.target.value) return;
        var inputValue = e.target.value;
        const note = getParentNote(e.target);
        if(!note) return;
        if(!checkRealNumber(inputValue)) {
            inputValue = vn.variables.colorBackOs;
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
        
        vn.variables.colorBackOs = inputValue;
        note._elements.colorBack0s.style.opacity = vn.variables.colorBackOs;
    };
    vn.events.elementEvents.colorBackOpacityInput_onBlur = function(e: any) {
        var value = e.target.value;
        const note = getParentNote(e.target);
        if(!note) return;
        if(!checkRealNumber(value)) {
            e.target.value = vn.variables.colorBackOs;
        }
    };
    //colorBack0 event
    vn.events.elementEvents.colorBack0_onClick = function(e: any) {
        const note = getParentNote(e.target);
        if(!note) return;
        vn.variables.colorBackRGBs = "#" + vn.variables.colorBackRs +  vn.variables.colorBackGs +  vn.variables.colorBackBs;
        vn.variables.colorBackOpacitys = vn.variables.colorBackOs;
        if(!isMobileDevice()) {
            (note._elements.colorBackSelects as any).querySelector("."+getEventChildrenClassName(note._noteName)).style.color
                = getRGBAFromHex(vn.variables.colorBackRGBs, vn.variables.colorBackOpacitys === "0" ? 1 : vn.variables.colorBackOpacitys);
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
    vn.events.elementEvents.colorBack1_onClick = function(e: any) {
        const note = getParentNote(e.target);
        if(!note) return;
        vn.variables.colorBackRGBs = getHexColorFromColorName(vn.colors.color14);
        vn.variables.colorBackOpacitys = "1";
        if(!isMobileDevice()) {
            (note._elements.colorBackSelects as any).querySelector("."+getEventChildrenClassName(note._noteName)).style.color
                = getRGBAFromHex(vn.variables.colorBackRGBs, vn.variables.colorBackOpacitys);
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
    vn.events.elementEvents.colorBack2_onClick = function(e: any) {
        const note = getParentNote(e.target);
        if(!note) return;
        vn.variables.colorBackRGBs = getHexColorFromColorName(vn.colors.color15);
        vn.variables.colorBackOpacitys = "1";
        if(!isMobileDevice()) {
            (note._elements.colorBackSelects as any).querySelector("."+getEventChildrenClassName(note._noteName)).style.color
                = getRGBAFromHex(vn.variables.colorBackRGBs, vn.variables.colorBackOpacitys);
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
    vn.events.elementEvents.colorBack3_onClick = function(e: any) {
        const note = getParentNote(e.target);
        if(!note) return;
        vn.variables.colorBackRGBs = getHexColorFromColorName(vn.colors.color16);
        vn.variables.colorBackOpacitys = "1";
        if(!isMobileDevice()) {
            (note._elements.colorBackSelects as any).querySelector("."+getEventChildrenClassName(note._noteName)).style.color
                = getRGBAFromHex(vn.variables.colorBackRGBs, vn.variables.colorBackOpacitys);
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
    vn.events.elementEvents.colorBack4_onClick = function(e: any) {
        const note = getParentNote(e.target);
        if(!note) return;
        vn.variables.colorBackRGBs = getHexColorFromColorName(vn.colors.color17);
        vn.variables.colorBackOpacitys = "1";
        if(!isMobileDevice()) {
            (note._elements.colorBackSelects as any).querySelector("."+getEventChildrenClassName(note._noteName)).style.color
                = getRGBAFromHex(vn.variables.colorBackRGBs, vn.variables.colorBackOpacitys);
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
    vn.events.elementEvents.colorBack5_onClick = function(e: any) {
        const note = getParentNote(e.target);
        if(!note) return;
        vn.variables.colorBackRGBs = getHexColorFromColorName(vn.colors.color18);
        vn.variables.colorBackOpacitys = "1";
        if(!isMobileDevice()) {
            (note._elements.colorBackSelects as any).querySelector("."+getEventChildrenClassName(note._noteName)).style.color
                = getRGBAFromHex(vn.variables.colorBackRGBs, vn.variables.colorBackOpacitys);
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
    vn.events.elementEvents.colorBack6_onClick = function(e: any) {
        const note = getParentNote(e.target);
        if(!note) return;
        vn.variables.colorBackRGBs = getHexColorFromColorName(vn.colors.color19);
        vn.variables.colorBackOpacitys = "1";
        if(!isMobileDevice()) {
            (note._elements.colorBackSelects as any).querySelector("."+getEventChildrenClassName(note._noteName)).style.color
                = getRGBAFromHex(vn.variables.colorBackRGBs, vn.variables.colorBackOpacitys);
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
    vn.events.elementEvents.colorBack7_onClick = function(e: any) {
        const note = getParentNote(e.target);
        if(!note) return;
        vn.variables.colorBackRGBs = getHexColorFromColorName(vn.colors.color20);
        vn.variables.colorBackOpacitys = "1";
        if(!isMobileDevice()) {
            (note._elements.colorBackSelects as any).querySelector("."+getEventChildrenClassName(note._noteName)).style.color
                = getRGBAFromHex(vn.variables.colorBackRGBs, vn.variables.colorBackOpacitys);
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
    vn.events.elementEvents.formatClearButton_onClick = function(e: any) {
        const note = getParentNote(e.target);
        if(!note) return;
        // If the selection is a single point
        if (note._selection.editRange && (note._selection.editRange as any).collapsed) {
            // Reset all styles and reposition to the original selection point.
            initToggleButtonVariables(noteIndex);
            setOriginEditSelection(note);
        }
        else {	// Dragging
            // Specify style for dragged characters
            modifySelectedSingleElement(noteIndex, vn.variables.defaultStyles);
        }
    };

    //==================================================================================
    //undo
    vn.events.elementEvents.undoButton_onClick = function(e: any) {
        const note = getParentNote(e.target);
        if(!noteIndex) noteIndex = vn.variables.lastActiveNote;
        // Disconnect the observer.
        elementsEvent["note_observer"].disconnect();
        if(vn.variables.recodeContings <= 0) return;
        vn.variables.recodeContings = vn.variables.recodeContings - 1;
        replaceDifferentBetweenElements(note._elements.textareas, vn.variables.recodeNotes[vn.variables.recodeContings]);
        
        // Reconnect the observer.
        connectObserver();
    };

    //==================================================================================
    //redo
    vn.events.elementEvents.redoButton_onClick = function(e: any) {
        const note = getParentNote(e.target);
        if(!noteIndex) noteIndex = vn.variables.lastActiveNote;
        // Disconnect the observer.
        elementsEvent["note_observer"].disconnect();
        if(vn.variables.recodeContings >= vn.variables.recodeNotes.length - 1) return;
        vn.variables.recodeContings = vn.variables.recodeContings + 1;
        replaceDifferentBetweenElements(note._elements.textareas, vn.variables.recodeNotes[vn.variables.recodeContings]);
        
        // Reconnect the observer.
        connectObserver();
    };

    //==================================================================================
    //help
    vn.events.elementEvents.helpButton_onClick = function(e: any) {
        const note = getParentNote(e.target);
        if(!note) return;
        
        // Restore the note size.
        doIncreaseTextareaHeight(note._vn);
        
        // Close all modals
        closeAllModal(note);
        // Close all selects
        closeAllSelectBoxes(note);
        // Adjust modal size
        setAllModalSize(note);
        // Open modal background
        var displayBlock = getId(note._noteName, note._id, "on_display_block");
        var displayNone = getId(note._noteName, note._id, "on_display_none");
        note._elements.modalBacks.classList.remove(displayNone);
        note._elements.modalBacks.classList.add(displayBlock);
        note._elements.helpModals.classList.remove(displayNone);
        note._elements.helpModals.classList.add(displayBlock);
    };
    vn.events.elementEvents.helpModal_onClick = function(e: any) {};

    //==================================================================================
    //modal back
    vn.events.elementEvents.modalBack_onClick = function(e: any) {
        const note = getParentNote(e.target);
        if(!note) return;
        closeAllModal(note);
    note

    //==================================================================================
    //placeholder
    vn.events.elementEvents.placeholder_onClick = function(e: any) {
        const note = getParentNote(e.target);
        if(!note) return;
        closePlaceholder(noteIndex);
        note._elements.textareas.focus();
    };

    //==================================================================================
    //textarea
    //==================================================================================
    vn.events.elementEvents.textarea_onClick = function(e: any) {
        const note = getParentNote(e.target);
        closeAllSelectBoxes(noteIndex);
    };
    vn.events.elementEvents.textarea_onFocus = function(e: any) {
        const note = getParentNote(e.target);
        if(!note) return;
        // Close placeholder.
        closePlaceholder(noteIndex);
        // In the editor, elements not surrounded by unit tags are recreated, wrapped with unit tags.
        doEditUnitCheck(noteIndex)
    };
    vn.events.elementEvents.textarea_onBlur = function(e: any) {
        const note = getParentNote(e.target);
        if(!note) return;
        // Open placeholder.
        openPlaceholder(noteIndex);
        // Disconnect the observer.
        elementsEvent["note_observer"].disconnect();
        // Clean up the target element.
        removeEmptyElment(e.target);
        // Reconnect the observer.
        connectObserver();
    };
    vn.events.elementEvents.textarea_onKeydown = function(e: any) {
        var textarea = e.target;
        if(e.key === "Enter") {
            if(!e.shiftKey) {
                textarea_onKeydownEnter(textarea);
            }
        }
        if((e.ctrlKey || e.metaKey) && (e.key === "z" || e.key === "Z")) {
            e.preventDefault();
            elementsEvent["undoButton_onClick"](e)
        }
        if((e.ctrlKey || e.metaKey) && (e.key === "y" || e.key === "Y")) {
            e.preventDefault();
            elementsEvent["redoButton_onClick"](e)
        }
    };
    vn.events.elementEvents.textarea_onKeyup = function(e: any) {
        var textarea = e.target;
        var noteIndex = getNoteIndex(textarea);
        // Open placeholder.
        closePlaceholder(noteIndex);
        // Disconnect the observer.
        elementsEvent["note_observer"].disconnect();
        // If all rows are deleted, insert one p tag and br tag.
        if(!textarea.firstChild) {
            initTextarea(textarea);
            return;
        }
        // In the editor, elements not surrounded by unit tags are recreated, wrapped with unit tags.
        if((e.ctrlKey || e.metaKey) && (e.key === "v" || e.key === "V")) {
            e.preventDefault();
            // In the editor, elements not surrounded by unit tags are recreated, wrapped with unit tags.
            doEditUnitCheck(noteIndex)
        }
        // Reconnect the observer.
        connectObserver();
    };
    vn.events.elementEvents.textarea_onBeforeinput = function(e: any) {
        // Only proceeds for non-mobile devices && when inputting possible characters
        if (!isMobileDevice() && e.data) {
            // Disconnect the observer.
            elementsEvent["note_observer"].disconnect();
            textarea_onBeforeinputSpelling(e);
            // Reconnect the observer.
            connectObserver();
        }
    };
}
