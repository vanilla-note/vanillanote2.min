export const elementsEvent = {
    //toolToggleButton event
    toolToggleButton_onClick : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        var icon: any = vn.elements.toolToggleButtons[noteIndex].firstChild;
        //toggle
        vn.variables.toolToggles[noteIndex] = !vn.variables.toolToggles[noteIndex];
        if(!vn.variables.toolToggles[noteIndex]) { //in case of open
            icon.textContent = "arrow_drop_up";
            // Adjust toolbar size.
            setAllToolSize(noteIndex);
            // Adjust the position of the tooltip.
            setAllToolTipPosition(noteIndex);
        }
        else {	// In case of closing
            icon.textContent = "arrow_drop_down";
            // Adjust toolbar size.
            setAllToolSize(noteIndex);
            // Adjust the position of the tooltip.
            setAllToolTipPosition(noteIndex);
        }
        vn.variables.preventChangeScroll = 2;
        // It's too inconvenient if the cursor is caught again on mobile..
        if(!isMobileDevice()) {
            setOriginEditSelection(noteIndex);
        }
    },

    //==================================================================================
    //paragraphStyleSelect event
    paragraphStyleSelect_onClick : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        selectToggle(e.target);
        // It's too inconvenient if the cursor is caught again on mobile..
        if(!isMobileDevice()) {
            setOriginEditSelection(noteIndex);
        }
    },

    //==================================================================================
    //styleNomal event
    styleNomal_onClick : function(e: any) {
        // If a child element is selected, event is controlled
        var target = e.target;
        if(target.classList.contains(getEventChildrenClassName())) {
            target = target.parentNode;
        }
        // Changing the tag
        modifySelectedUnitElementTag(target);
        selectToggle(target);
    },

    //==================================================================================
    //styleHeader1 event
    styleHeader1_onClick : function(e: any) {
        // If a child element is selected, event is controlled
        var target = e.target;
        if(target.classList.contains(getEventChildrenClassName())) {
            target = target.parentNode;
        }
        // Changing the tag
        modifySelectedUnitElementTag(target);
        selectToggle(target);
    },
    //==================================================================================
    //styleHeader2 event
    styleHeader2_onClick : function(e: any) {
        // If a child element is selected, event is controlled
        var target = e.target;
        if(target.classList.contains(getEventChildrenClassName())) {
            target = target.parentNode;
        }
        // Changing the tag
        modifySelectedUnitElementTag(target);
        selectToggle(target);
    },
    //==================================================================================
    //styleHeader3 event
    styleHeader3_onClick : function(e: any) {
        // If a child element is selected, event is controlled
        var target = e.target;
        if(target.classList.contains(getEventChildrenClassName())) {
            target = target.parentNode;
        }
        // Changing the tag
        modifySelectedUnitElementTag(target);
        selectToggle(target);
    },
    //==================================================================================
    //styleHeader4 event
    styleHeader4_onClick : function(e: any) {
        // If a child element is selected, event is controlled
        var target = e.target;
        if(target.classList.contains(getEventChildrenClassName())) {
            target = target.parentNode;
        }
        // Changing the tag
        modifySelectedUnitElementTag(target);
        selectToggle(target);
    },
    //==================================================================================
    //styleHeader5 event
    styleHeader5_onClick : function(e: any) {
        // If a child element is selected, event is controlled
        var target = e.target;
        if(target.classList.contains(getEventChildrenClassName())) {
            target = target.parentNode;
        }
        // Changing the tag
        modifySelectedUnitElementTag(target);
        selectToggle(target);
    },
    //==================================================================================
    //styleHeader6 event
    styleHeader6_onClick : function(e: any) {
        // If a child element is selected, event is controlled
        var target = e.target;
        if(target.classList.contains(getEventChildrenClassName())) {
            target = target.parentNode;
        }
        // Changing the tag
        modifySelectedUnitElementTag(target);
        selectToggle(target);
    },

    //==================================================================================
    //boldButton event
    boldButton_onClick : function(e: any) {
        // Toggle the button
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        vn.variables.boldToggles[noteIndex] = !vn.variables.boldToggles[noteIndex];
        if(!isMobileDevice()) {
            button_onToggle(vn.elements.boldButtons[noteIndex], vn.variables.boldToggles[noteIndex]);
        }
        
        // If the selection is a single point
        if(vn.variables.editRanges[noteIndex] && (vn.variables.editRanges[noteIndex] as any).collapsed) {
            // Re-move to the original selection point
            setOriginEditSelection(noteIndex);
        }
        else {	// Dragging
            // Specify style for dragged characters
            modifySelectedSingleElement(noteIndex, getObjectNoteCss(noteIndex));
        }
    },

    //==================================================================================
    //underlineButton event
    underlineButton_onClick : function(e: any) {
        // Toggle the button
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        vn.variables.underlineToggles[noteIndex] = !vn.variables.underlineToggles[noteIndex];
        if(!isMobileDevice()) {
            button_onToggle(vn.elements.underlineButtons[noteIndex], vn.variables.underlineToggles[noteIndex]);
        }
        
        // If the selection is a single point
        if(vn.variables.editRanges[noteIndex] && (vn.variables.editRanges[noteIndex] as any).collapsed) {
            // Re-move to the original selection point
            setOriginEditSelection(noteIndex);
        }
        else {	// Dragging
            // Specify style for dragged characters
            modifySelectedSingleElement(noteIndex, getObjectNoteCss(noteIndex));
        }
    },

    //==================================================================================
    //italic
    italicButton_onClick : function(e: any) {
        // Toggle the button
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        vn.variables.italicToggles[noteIndex] = !vn.variables.italicToggles[noteIndex];
        if(!isMobileDevice()) {
            button_onToggle(vn.elements.italicButtons[noteIndex], vn.variables.italicToggles[noteIndex]);
        }
        
        // If the selection is a single point
        if(vn.variables.editRanges[noteIndex] && (vn.variables.editRanges[noteIndex] as any).collapsed) {
            // Re-move to the original selection point
            setOriginEditSelection(noteIndex);
        }
        else {	// Dragging
            // Specify style for dragged characters
            modifySelectedSingleElement(noteIndex, getObjectNoteCss(noteIndex));
        }
    },

    //==================================================================================
    //ul
    ulButton_onClick : function(e: any) {
        // If a child element is selected, event is controlled
        var target = e.target;
        if(target.classList.contains(getEventChildrenClassName())) {
            target = target.parentNode;
        }
        // Changing the tag
        modifySelectedUnitElementTag(target);
    },


    //==================================================================================
    //ol
    olButton_onClick : function(e: any) {
        // If a child element is selected, event is controlled
        var target = e.target;
        if(target.classList.contains(getEventChildrenClassName())) {
            target = target.parentNode;
        }
        // Changing the tag
        modifySelectedUnitElementTag(target);
    },

    //==================================================================================
    //text-align
    textAlignSelect_onClick : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        selectToggle(e.target);
        // It's too inconvenient if the cursor is caught again on mobile..
        if(!isMobileDevice()) {
            setOriginEditSelection(noteIndex);
        }
    },

    //==================================================================================
    //text-align-left
    textAlignLeft_onClick : function(e: any) {
        // If a child element is selected, event is controlled
        var target = e.target;
        if(target.classList.contains(getEventChildrenClassName())) {
            target = target.parentNode;
        }
        // Changing the text-align
        modifySelectedUnitElementStyle(target);
        selectToggle(target);
    },

    //==================================================================================
    //text-align-center
    textAlignCenter_onClick : function(e: any) {
        // If a child element is selected, event is controlled
        var target = e.target;
        if(target.classList.contains(getEventChildrenClassName())) {
            target = target.parentNode;
        }
        // Changing the text-align
        modifySelectedUnitElementStyle(target);
        selectToggle(target);
    },

    //==================================================================================
    //text-align-right
    textAlignRight_onClick : function(e: any) {
        // If a child element is selected, event is controlled
        var target = e.target;
        if(target.classList.contains(getEventChildrenClassName())) {
            target = target.parentNode;
        }
        // Changing the text-align
        modifySelectedUnitElementStyle(target);
        selectToggle(target);
    },

    //==================================================================================
    //att link
    attLinkButton_onClick : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        //att madal open
        openAttLinkModal(noteIndex);
    },

    //==================================================================================
    //modal att link
    attLinkModal_onClick : function(e: any) {
    },
    //modal att link text
    attLinkText_onInput : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        validCheckAttLink(noteIndex);
    },
    attLinkText_onBlur : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        validCheckAttLink(noteIndex);
    },
    //modal att link href
    attLinkHref_onInput : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        validCheckAttLink(noteIndex);
    },
    attLinkHref_onBlur : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        validCheckAttLink(noteIndex);
    },
    //modal att link insert
    attLinkInsertButton_onClick : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        if(!isValidSelection(noteIndex)) {
            closeAllModal(noteIndex);
            return;
        }
        var attLinkValidCheckbox: any = vn.elements.attLinkValidCheckboxes[noteIndex];
        if(!attLinkValidCheckbox.checked) {
            return;
        }
        var attLinkText: any = vn.elements.attLinkTexts[noteIndex];
        var attLinkHref: any = vn.elements.attLinkHrefs[noteIndex];
        var attIsblank: any = vn.elements.attLinkIsBlankCheckboxes[noteIndex];
        
        //No dragging > insert, dragging > modify
        if((vn.variables.editRanges as any)[noteIndex].collapsed) {
            var tempEl = document.createElement("A");
            var tempNode = document.createTextNode(attLinkText.value);
            tempEl.append(tempNode);
            tempEl.setAttribute("href", attLinkHref.value);
            tempEl.setAttribute("class", getClassName(noteIndex, "linker"));
            tempEl.setAttribute("style", getCssTextFromObject(getObjectNoteCss(noteIndex)));
            if(attIsblank.checked) tempEl.setAttribute("target","_blank");
            (vn.variables.editRanges as any)[noteIndex].insertNode(tempEl);
            setNewSelection(
                tempEl,
                1,
                tempEl,
                1
                );
        }
        else {
            var attributes: any = new Object();
            attributes["href"] = attLinkHref.value;
            attributes["class"] = getClassName(noteIndex, "linker");
            if(attIsblank.checked) attributes["target"] = "_blank";
            modifySelectedSingleElement(noteIndex, null, "a", attributes);
        }
        
        closeAllModal(noteIndex);
    },

    //==================================================================================
    //att link tooltip
    //edit button
    attLinkTooltipEditButton_onClick : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        var previousElements = getPreviousElementsUntilNotTag(vn.variables.editStartElements[noteIndex], "A");
        var nextElements = getNextElementsUntilNotTag(vn.variables.editStartElements[noteIndex], "A");
        var startEl = previousElements[previousElements.length - 1];
        var endEl = nextElements[nextElements.length - 1];
        
        // Sets the new selection range.
        var newSelection = setNewSelection(
                startEl.firstChild,
                0,
                endEl.firstChild,
                endEl.firstChild.length,
                );
        
        setEditSelection(noteIndex, newSelection!);
        //att madal open
        openAttLinkModal(noteIndex);
    },

    //unlink button
    attLinkTooltipUnlinkButton_onClick : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        var previousElements = getPreviousElementsUntilNotTag(vn.variables.editStartElements[noteIndex], "A");
        var nextElements = getNextElementsUntilNotTag(vn.variables.editStartElements[noteIndex], "A");
        var startEl = previousElements[previousElements.length - 1];
        var endEl = nextElements[nextElements.length - 1];
        
        // Sets the new selection range.
        var newSelection = setNewSelection(
                startEl.firstChild,
                0,
                endEl.firstChild,
                endEl.firstChild.length,
                );
        
        setEditSelection(noteIndex, newSelection!);
        
        modifySelectedSingleElement(noteIndex, null, "SPAN", {});
    },

    //==================================================================================
    //att file
    attFileButton_onClick : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        
        // Restore the note size.
        doIncreaseTextareaHeight();
        // Close all modals
        closeAllModal(noteIndex);
        // Close all selects
        closeAllSelectBoxes(noteIndex);
        // Adjust modal size
        setAllModalSize(noteIndex);
        // Open modal background
        var displayBlock = getId(noteIndex, "on_display_block");
        var displayNone = getId(noteIndex, "on_display_none");
        vn.elements.backModals[noteIndex].classList.remove(displayNone);
        vn.elements.backModals[noteIndex].classList.add(displayBlock);
        vn.elements.attFileModals[noteIndex].classList.remove(displayNone);
        vn.elements.attFileModals[noteIndex].classList.add(displayBlock);
    },
    //==================================================================================
    //modal att file
    attFileModal_onClick : function(e: any) {
    },
    //modal att file upload button
    attFileUploadButton_onClick : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        vn.elements.attFileUploads[noteIndex].click();
    },
    //modal att file upload div
    attFileUploadDiv_onDragover : function(e: any) {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
    },
    attFileUploadDiv_onDrop : function(e: any) {
        e.preventDefault();
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
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
            (vn.variables.attTempFiles as any)[noteIndex][getUUID()] = files[i];
        }
        // Leave attTempFiles with only valid files.
        setAttTempFileValid(noteIndex);
        // Set attFileUploadDiv.
        setAttFileUploadDiv(noteIndex);
    },
    attFileUploadDiv_onClick : function(e: any) {
        var uuid = e.target.getAttribute("uuid");
        if(!uuid) return;
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        delete vn.variables.attTempFiles[noteIndex][uuid]
        e.target.remove();
        
        if(vn.elements.attFileUploadDivs[noteIndex].childNodes.length <= 0) {
            vn.elements.attFileUploadDivs[noteIndex].textContent = vn.languageSet[vn.variables.languages[noteIndex]].attFileUploadDiv;
            vn.elements.attFileUploadDivs[noteIndex].style.lineHeight = vn.variables.sizeRates[noteIndex] * 130 + "px";
        }
    },
    //modal att file upload
    attFileUpload_onInput : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
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
            (vn.variables.attTempFiles as any)[noteIndex][getUUID()] = files[i];
        }
        // Leave attTempFiles with only valid files.
        setAttTempFileValid(noteIndex);
        // Set attFileUploadDiv.
        setAttFileUploadDiv(noteIndex);
    },
    attFileUpload_onBlur : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
    },
    //modal att file insert
    attFileInsertButton_onClick : function(e: any) {
        /*
        If there's a range
            Insert <p><input file></p> at startElement
            Clear attTempFiles, attFileUploadDiv and then close the modal
        If there's no range
            Clear attTempFiles, attFileUploadDiv and then close the modal
        */
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        if(!isValidSelection(noteIndex)) {
            closeAllModal(noteIndex);
            return;
        }
        if(!vn.variables.editStartUnitElements[noteIndex]) {
            closeAllModal(noteIndex);
            return;
        }
        var keys = Object.keys(vn.variables.attTempFiles[noteIndex]);
        if(keys.length <= 0) {
            closeAllModal(noteIndex);
            return;
        }
        var editStartUnitElements: any = vn.variables.editStartUnitElements[noteIndex];
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
                        "class" : getClassName(noteIndex, "downloader"),
                        "uuid" : keys[i],
                        "data-note-id" : noteIndex,
                        "href" : URL.createObjectURL(vn.variables.attTempFiles[noteIndex][keys[i]]),
                        "download" : vn.variables.attTempFiles[noteIndex][keys[i]].name,
                        "style" : getCssTextFromObject(getObjectNoteCss(noteIndex)),
                    }
                );
            tempEl2.innerText = "download : "+vn.variables.attTempFiles[noteIndex][keys[i]].name;
            tempEl1.appendChild(tempEl2)
            editStartUnitElements.parentNode.insertBefore(tempEl1, editStartUnitElements.nextSibling);
            
            // Save attach file object
            vn.variables.attFiles[noteIndex][keys[i]] = vn.variables.attTempFiles[noteIndex][keys[i]];
            if(i === keys.length - 1) selectEl = tempEl1;
        }
        closeAllModal(noteIndex);
        // Sets the new selection range.
        setNewSelection(
            selectEl,
            1,
            selectEl,
            1
            );
    },
    //==================================================================================
    //att image
    attImageButton_onClick : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        
        // Restore the note size.
        doIncreaseTextareaHeight();
        // Close all modals
        closeAllModal(noteIndex);
        // Close all selects
        closeAllSelectBoxes(noteIndex);
        // Adjust modal size
        setAllModalSize(noteIndex);
        // Open modal background
        var displayBlock = getId(noteIndex, "on_display_block");
        var displayNone = getId(noteIndex, "on_display_none");
        vn.elements.backModals[noteIndex].classList.remove(displayNone);
        vn.elements.backModals[noteIndex].classList.add(displayBlock);
        vn.elements.attImageModals[noteIndex].classList.remove(displayNone);
        vn.elements.attImageModals[noteIndex].classList.add(displayBlock);
    },
    //==================================================================================
    //modal att image
    attImageModal_onClick : function(e: any) {
    },
    //modalatt image uplaod button and view
    attImageUploadButtonAndView_onDragover : function(e: any) {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
    },
    attImageUploadButtonAndView_onDrop : function(e: any) {
        e.preventDefault();
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        var files = Array.from(e.dataTransfer.files);
        for(var i = 0; i < files.length; i++){
            (vn.variables.attTempImages as any)[noteIndex][getUUID()] = files[i];
        }
        // Leave attTempImages with only valid files.
        setAttTempImageValid(noteIndex);
        // Set attImageUploadAndView.
        setAttImageUploadAndView(noteIndex);
    },
    attImageUploadButtonAndView_onClick : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        vn.elements.attImageUploads[noteIndex].click();
    },
    //modal att image view pre button
    attImageViewPreButtion_onClick : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        var scrollAmount = vn.elements.attImageUploadButtonAndViews[noteIndex].offsetWidth / 1.5 + 10;
        vn.elements.attImageUploadButtonAndViews[noteIndex].scrollLeft -= scrollAmount;
    },
    //modal att image view next button
    attImageViewNextButtion_onClick : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        var scrollAmount = vn.elements.attImageUploadButtonAndViews[noteIndex].offsetWidth / 1.5 + 10;
        vn.elements.attImageUploadButtonAndViews[noteIndex].scrollLeft += scrollAmount;
    },
    //modal att image upload
    attImageUpload_onInput : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        var files = Array.from(e.target.files);
        for(var i = 0; i < files.length; i++){
            (vn.variables.attTempImages as any)[noteIndex][getUUID()] = files[i];
        }
        // Leave attTempImages with only valid files.
        setAttTempImageValid(noteIndex);
        // Set attImageUploadAndView.
        setAttImageUploadAndView(noteIndex);
    },
    attImageUpload_onBlur : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
    },
    //modal att image url
    attImageURL_onInput : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        var url = e.target.value;
        if(url) {
            vn.elements.attImageUploadButtonAndViews[noteIndex].replaceChildren();
            const tempEl = document.createElement("img");
            tempEl.src = url;
            tempEl.style.width = "auto";
            tempEl.style.height = "100%";
            tempEl.style.display = "inline-block";
            tempEl.style.margin = "0 5px"
            vn.elements.attImageUploadButtonAndViews[noteIndex].appendChild(tempEl);
        }
        else {
            vn.elements.attImageUploadButtonAndViews[noteIndex].textContent = vn.languageSet[vn.variables.languages[noteIndex]].attImageUploadButtonAndView;
        }
    },
    attImageURL_onBlur : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
    },
    //modal att image insert
    attImageInsertButton_onClick : function(e: any) {
        /*
        In case of having a range:
            Sequentially insert <img url/> into startElement
            Reset attTempImages, attImageUploadButtonAndView, attImageURL and close modal
            If it's uload method:
                Store files in vn.variables.attImages
        If there is no range:
            Reset attTempImages, attImageUploadButtonAndView, attImageURL and close modal
        */
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        if(!isValidSelection(noteIndex)) {
            closeAllModal(noteIndex);
            return;
        }
        if(!vn.variables.editStartUnitElements[noteIndex]) {
            closeAllModal(noteIndex);
            return;
        }
        
        if((vn.elements.attImageURLs[noteIndex] as any).value) {
            var url = (vn.elements.attImageURLs[noteIndex] as any).value;
            var editStartUnitElements: any = vn.variables.editStartUnitElements[noteIndex];
            var tempEl1;
            var tempEl2;
            var viewerStyle = "width: 100%; overflow:hidden;"
        
            tempEl1 = document.createElement(editStartUnitElements.tagName);
            tempEl2 = getElement(
                    "",
                    "img",
                    "",
                    {
                        "class" : getClassName(noteIndex, "image_viewer"),
                        "data-note-id" : noteIndex,
                        "src" : url,
                        "style" : viewerStyle,
                        "title" : "",
                    }
                );
            tempEl1.appendChild(tempEl2)
            editStartUnitElements.parentNode.insertBefore(tempEl1, editStartUnitElements.nextSibling);
            
            closeAllModal(noteIndex);
            // Sets the new selection range.
            setNewSelection(
                tempEl1,
                0,
                tempEl1,
                0
                );
            return;
        }
        
        var keys = Object.keys(vn.variables.attTempImages[noteIndex]);
        if(keys.length > 0) {
            var editStartUnitElements: any = vn.variables.editStartUnitElements[noteIndex];
            var tempEl1;
            var tempEl2;
            var tempFile;
            var viewerStyle = "width: 100%; overflow:hidden;"
            var selectEl;
            
            for(var i = keys.length - 1; i >= 0; i--) {
                // Save image file object
                vn.variables.attImages[noteIndex][keys[i]] = vn.variables.attTempImages[noteIndex][keys[i]];
                
                tempEl1 = document.createElement(editStartUnitElements.tagName);
                tempEl2 = getElement(
                        "",
                        "img",
                        "",
                        {
                            "class" : getClassName(noteIndex, "image_viewer"),
                            "uuid" : keys[i],
                            "data-note-id" : noteIndex,
                            "src" : URL.createObjectURL(vn.variables.attImages[noteIndex][keys[i]]),
                            "style" : viewerStyle,
                            "title" : "",
                        }
                    );
                tempEl1.appendChild(tempEl2)
                editStartUnitElements.parentNode.insertBefore(tempEl1, editStartUnitElements.nextSibling);
                
                if(i === 0) selectEl = tempEl1;
            }
                
            closeAllModal(noteIndex);
            // Sets the new selection range.
            setNewSelection(
                selectEl,
                0,
                selectEl,
                0
                );
            return;
        }
        
        closeAllModal(noteIndex);
        return;
    },

    //==================================================================================
    //att video
    attVideoButton_onClick : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        
        // Restore the note size.
        doIncreaseTextareaHeight();
        
        closeAllModal(noteIndex);
        
        var displayBlock = getId(noteIndex, "on_display_block");
        var displayNone = getId(noteIndex, "on_display_none");
        vn.elements.backModals[noteIndex].classList.remove(displayNone);
        vn.elements.backModals[noteIndex].classList.add(displayBlock);
        vn.elements.attVideoModals[noteIndex].classList.remove(displayNone);
        vn.elements.attVideoModals[noteIndex].classList.add(displayBlock);

        //modal setting
        (vn.elements.attVideoEmbedIds[noteIndex] as any).value = "";
        (vn.elements.attVideoWidthes[noteIndex] as any).value = 100;
        (vn.elements.attVideoHeights[noteIndex] as any).value = 500;

        validCheckAttVideo(noteIndex);
    },
    //==================================================================================
    //modal att video
    attVideoModal_onClick : function(e: any) {
    },
    //modal att video embed id
    attVideoEmbedId_onInput : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        validCheckAttVideo(noteIndex);
    },
    attVideoEmbedId_onBlur : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        validCheckAttVideo(noteIndex);
    },
    //modal att video width
    attVideoWidth_onInput : function(e: any) {
        if(!e.target.value) return;
        var inputValue = e.target.value;
        if(!checkNumber(inputValue)) {
            e.target.value = "";
            return;
        }
    },
    attVideoWidth_onBlur : function(e: any) {
        if(!e.target.value) e.target.value = 100;
        var widthPer = e.target.value;
        if(widthPer < 10) widthPer = 10;
        if(widthPer > 100) widthPer = 100;
        e.target.value = widthPer;
    },
    //modal att video height
    attVideoHeight_onInput : function(e: any) {
        if(!e.target.value) return;
        var inputValue = e.target.value;
        if(!checkNumber(inputValue)) {
            e.target.value = "";
            return;
        }
    },
    attVideoHeight_onBlur : function(e: any) {
        if(!e.target.value) e.target.value = 500;
        var height = e.target.value;
        if(height < 50) height = 50;
        if(height > 1000) height = 1000;
        e.target.value = height;
    },
    //modal att video insert
    attVideoInsertButton_onClick : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        if(!isValidSelection(noteIndex)) {
            closeAllModal(noteIndex);
            return;
        }
        var attVideoValidCheckbox: any = vn.elements.attVideoValidCheckboxes[noteIndex];
        if(!attVideoValidCheckbox.checked) {
            return;
        }

        if(!vn.variables.editStartUnitElements[noteIndex]) {
            closeAllModal(noteIndex);
            return;
        }

        if((vn.elements.attVideoEmbedIds[noteIndex] as any).value) {
            var src = "https://www.youtube.com/embed/" + (vn.elements.attVideoEmbedIds[noteIndex] as any).value;
            var editStartUnitElements: any = vn.variables.editStartUnitElements[noteIndex];
            var tempEl1;
            var tempEl2;
            var viewerStyle = "overflow:hidden;"
                                + "width:" + (vn.elements.attVideoWidthes[noteIndex] as any).value + "%;"
                                + "height:" + (vn.elements.attVideoHeights[noteIndex] as any).value + "px;";
        
            tempEl1 = document.createElement(editStartUnitElements.tagName);
            tempEl2 = getElement(
                    "",
                    "iframe",
                    "",
                    {
                        "class" : getClassName(noteIndex, "video_viewer"),
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
            
            closeAllModal(noteIndex);
            // Sets the new selection range.
            setNewSelection(
                tempEl1,
                0,
                tempEl1,
                0
                );
            return;
        }

        closeAllModal(noteIndex);
    },

    //==================================================================================
    //att image tooltip width input event
    attImageAndVideoTooltipWidthInput_onInput : function(e: any) {
        if(!e.target.value) return;
        var inputValue = e.target.value;
        if(!checkNumber(inputValue)) {
            e.target.value = "";
            return;
        }
    },
    attImageAndVideoTooltipWidthInput_onBlur : function(e: any) {
        setImageAndVideoWidth(e.target);
    },
    attImageAndVideoTooltipWidthInput_onKeyup : function(e: any) {
        if(e.key === "Enter") {
            setImageAndVideoWidth(e.target);
        }
    },
    //att image tooltip float radio none input event
    attImageAndVideoTooltipFloatRadioNone_onClick : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        var imgNode: any = (vn.variables.editStartNodes[noteIndex] as any).cloneNode(true);
        if(imgNode.tagName !== "IMG" && imgNode.tagName !== "IFRAME") return;
        imgNode.style.float = "none";
        (vn.variables.editStartNodes[noteIndex] as any).parentNode.replaceChild(imgNode, (vn.variables.editStartNodes[noteIndex] as any));
        vn.variables.editStartNodes[noteIndex] = imgNode;
    },
    //att image tooltip float radio left input event
    attImageAndVideoTooltipFloatRadioLeft_onClick : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        var imgNode: any = (vn.variables.editStartNodes[noteIndex] as any).cloneNode(true);
        if(imgNode.tagName !== "IMG" && imgNode.tagName !== "IFRAME") return;
        imgNode.style.float = "left";
        (vn.variables.editStartNodes[noteIndex] as any).parentNode.replaceChild(imgNode, (vn.variables.editStartNodes[noteIndex] as any));
        vn.variables.editStartNodes[noteIndex] = imgNode;
    },
    //att image tooltip float radio right input event
    attImageAndVideoTooltipFloatRadioRight_onClick : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        var imgNode: any = (vn.variables.editStartNodes[noteIndex] as any).cloneNode(true);
        if(imgNode.tagName !== "IMG" && imgNode.tagName !== "IFRAME") return;
        imgNode.style.float = "right";
        (vn.variables.editStartNodes[noteIndex] as any).parentNode.replaceChild(imgNode, (vn.variables.editStartNodes[noteIndex] as any));
        vn.variables.editStartNodes[noteIndex] = imgNode;
    },
    //att image tooltip shape square radio input event
    attImageAndVideoTooltipShapeRadioSquare_onClick : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        var imgNode: any = vn.variables.editStartNodes[noteIndex];
        if(imgNode.tagName !== "IMG" && imgNode.tagName !== "IFRAME") return;
        imgNode.style.removeProperty("border-radius");
        (vn.variables.editStartNodes[noteIndex] as any).parentNode.replaceChild(imgNode, (vn.variables.editStartNodes[noteIndex] as any));
        vn.variables.editStartNodes[noteIndex] = imgNode;
    },
    //att image tooltip shape radius radio input event
    attImageAndVideoTooltipShapeRadioRadius_onClick : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        var imgNode: any = vn.variables.editStartNodes[noteIndex];
        if(imgNode.tagName !== "IMG" && imgNode.tagName !== "IFRAME") return;
        imgNode.style.borderRadius = "5%";
        (vn.variables.editStartNodes[noteIndex] as any).parentNode.replaceChild(imgNode, (vn.variables.editStartNodes[noteIndex] as any));
        vn.variables.editStartNodes[noteIndex] = imgNode;
    },
    //att image tooltip shape circle radio input event
    attImageAndVideoTooltipShapeRadioCircle_onClick : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        var imgNode: any = vn.variables.editStartNodes[noteIndex];
        if(imgNode.tagName !== "IMG" && imgNode.tagName !== "IFRAME") return;
        imgNode.style.borderRadius = "50%";
        (vn.variables.editStartNodes[noteIndex] as any).parentNode.replaceChild(imgNode, (vn.variables.editStartNodes[noteIndex] as any));
        vn.variables.editStartNodes[noteIndex] = imgNode;
    },

    //==================================================================================
    //fontSizeInputBox event
    fontSizeInputBox_onClick : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        // If the selection is a single point
        if(vn.variables.editRanges[noteIndex] && (vn.variables.editRanges[noteIndex] as any).collapsed) {
            // Re-move to the original selection point
            setOriginEditSelection(noteIndex);
        }
        else {	// Dragging
            // Specify style for dragged characters
            modifySelectedSingleElement(noteIndex, getObjectNoteCss(noteIndex));
        }
    },
    //fontSizeInput event
    fontSizeInput_onClick : function(e: any) {
    },
    fontSizeInput_onInput : function(e: any) {
        if(!e.target.value) return;
        var inputValue = e.target.value;
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        if(!checkNumber(inputValue)) {
            e.target.value = "";
            return;
        }
        vn.variables.fontSizes[noteIndex] = inputValue;
    },
    fontSizeInput_onBlur : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        if(!e.target.value) {
            e.target.value = vn.variables.fontSizes[noteIndex];
        }
        var inputValueNum = Number(e.target.value);
        if(inputValueNum > 120) {
            e.target.value = "120";
            vn.variables.fontSizes[noteIndex] = e.target.value;
            return;
        }
        if(inputValueNum < 6) {
            e.target.value = "6";
            vn.variables.fontSizes[noteIndex] = e.target.value;
            return;
        }
        vn.variables.fontSizes[noteIndex] = e.target.value;
    },

    //==================================================================================
    //letterSpacingInputBox event
    letterSpacingInputBox_onClick : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        // If the selection is a single point
        if(vn.variables.editRanges[noteIndex] && (vn.variables.editRanges[noteIndex] as any).collapsed) {
            // Re-move to the original selection point
            setOriginEditSelection(noteIndex);
        }
        else {	// Dragging
            // Specify style for dragged characters
            modifySelectedSingleElement(noteIndex, getObjectNoteCss(noteIndex));
        }
    },
    //letterSpacingInput event
    letterSpacingInput_onClick : function(e: any) {
    },
    letterSpacingInput_onInput : function(e: any) {
        if(!e.target.value) return;
        var inputValue = e.target.value;
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        if(!checkRealNumber(inputValue)) {
            e.target.value = "";
            return;
        }
        vn.variables.letterSpacings[noteIndex] = inputValue;
    },
    letterSpacingInput_onBlur : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        if(!e.target.value) {
            e.target.value = "0";
            vn.variables.letterSpacings[noteIndex] = e.target.value;
            return;
        }
        var inputValueNum = Number(e.target.value);
        if(inputValueNum > 30) {
            e.target.value = "30";
            vn.variables.letterSpacings[noteIndex] = e.target.value;
            return;
        }
        if(inputValueNum < -5) {
            e.target.value = "-5";
            vn.variables.letterSpacings[noteIndex] = e.target.value;
            return;
        }
        vn.variables.letterSpacings[noteIndex] = e.target.value;
    },

    //==================================================================================
    //lineHeightInputBox event
    lineHeightInputBox_onClick : function(e: any) {
    },
    lineHeightInputBox_onInput : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        // If the selection is a single point
        if(vn.variables.editRanges[noteIndex] && (vn.variables.editRanges[noteIndex] as any).collapsed) {
            // Re-move to the original selection point
            setOriginEditSelection(noteIndex);
        }
        else {	// Dragging
            // Specify style for dragged characters
            modifySelectedSingleElement(noteIndex, getObjectNoteCss(noteIndex));
        }
    },
    //lineHeightInput event
    lineHeightInput_onClick : function(e: any) {
    },
    lineHeightInput_onInput : function(e: any) {
        if(!e.target.value) return;
        var inputValue = e.target.value;
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        if(!checkNumber(inputValue)) {
            e.target.value = "";
            return;
        }
        vn.variables.lineHeights[noteIndex] = e.target.value;
    },
    lineHeightInput_onBlur : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        if(!e.target.value) {
            e.target.value = vn.variables.lineHeights[noteIndex];
        }
        var inputValueNum = Number(e.target.value);
        if(inputValueNum > 150) {
            e.target.value = "150";
            vn.variables.lineHeights[noteIndex] = e.target.value;
            return;
        }
        if(inputValueNum < 6) {
            e.target.value = "6";
            vn.variables.lineHeights[noteIndex] = e.target.value;
            return;
        }
        vn.variables.lineHeights[noteIndex] = e.target.value;
    },

    //==================================================================================
    //fontFamilySelect event
    fontFamilySelect_onClick : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        selectToggle(e.target);
        // It's too inconvenient if the cursor is caught again on mobile..
        if(!isMobileDevice()) {
            setOriginEditSelection(noteIndex);
        }
    },
    //==================================================================================
    //color text select
    colorTextSelect_onClick : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        selectToggle(e.target);
        // It's too inconvenient if the cursor is caught again on mobile..
        if(!isMobileDevice()) {
            setOriginEditSelection(noteIndex);
        }
    },
    //color text select box
    colorTextSelectBox_onClick : function(e: any) {
    },
    //colorText R Input event
    colorTextRInput_onClick : function(e: any) {
    },
    colorTextRInput_onInput : function(e: any) {
        if(!e.target.value) return;
        var inputValue = e.target.value;
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        if(!checkHex(inputValue)) {
            inputValue = vn.variables.colorTextRs[noteIndex];
            e.target.value = inputValue;
            return;
        }
        if(inputValue.length !== 2) return;
        vn.variables.colorTextRs[noteIndex] = inputValue;
        vn.elements.colorText0s[noteIndex].style.backgroundColor = "#" + vn.variables.colorTextRs[noteIndex] +  vn.variables.colorTextGs[noteIndex] +  vn.variables.colorTextBs[noteIndex];
    },
    colorTextRInput_onBlur : function(e: any) {
        var value = e.target.value;
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        if(!checkHex(value)) {
            e.target.value = vn.variables.colorTextRs[noteIndex];
            return;
        }
        if(value.length !== 2) {
            e.target.value = vn.variables.colorTextRs[noteIndex];
        }
    },
    //colorText G Input event
    colorTextGInput_onClick : function(e: any) {
    },
    colorTextGInput_onInput : function(e: any) {
        if(!e.target.value) return;
        var inputValue = e.target.value;
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        if(!checkHex(inputValue)) {
            inputValue = vn.variables.colorTextGs[noteIndex];
            e.target.value = inputValue;
            return;
        }
        if(inputValue.length !== 2) return;
        vn.variables.colorTextGs[noteIndex] = inputValue;
        vn.elements.colorText0s[noteIndex].style.backgroundColor = "#" + vn.variables.colorTextRs[noteIndex] +  vn.variables.colorTextGs[noteIndex] +  vn.variables.colorTextBs[noteIndex];
    },
    colorTextGInput_onBlur : function(e: any) {
        var value = e.target.value;
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        if(!checkHex(value)) {
            e.target.value = vn.variables.colorTextGs[noteIndex];
            return;
        }
        if(value.length !== 2) {
            e.target.value = vn.variables.colorTextGs[noteIndex];
        }
    },
    //colorText B Input event
    colorTextBInput_onClick : function(e: any) {
    },
    colorTextBInput_onInput : function(e: any) {
        if(!e.target.value) return;
        var inputValue = e.target.value;
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        if(!checkHex(inputValue)) {
            inputValue = vn.variables.colorTextBs[noteIndex];
            e.target.value = inputValue;
            return;
        }
        if(inputValue.length !== 2) return;
        vn.variables.colorTextBs[noteIndex] = inputValue;
        vn.elements.colorText0s[noteIndex].style.backgroundColor = "#" + vn.variables.colorTextRs[noteIndex] +  vn.variables.colorTextGs[noteIndex] +  vn.variables.colorTextBs[noteIndex];
    },
    colorTextBInput_onBlur : function(e: any) {
        var value = e.target.value;
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        if(!checkHex(value)) {
            e.target.value = vn.variables.colorTextBs[noteIndex];
            return;
        }
        if(value.length !== 2) {
            e.target.value = vn.variables.colorTextBs[noteIndex];
        }
    },
    //colorText Opacity Input event
    colorTextOpacityInput_onClick : function(e: any) {
    },
    colorTextOpacityInput_onInput : function(e: any) {
        if(e.target.value === "01" || e.target.value === "10") {
            e.target.value = e.data;
        } 
        if(!e.target.value) return;
        var inputValue = e.target.value;
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        if(!checkRealNumber(inputValue)) {
            inputValue = vn.variables.colorTextOs[noteIndex];
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
        
        vn.variables.colorTextOs[noteIndex] = inputValue;
        vn.elements.colorText0s[noteIndex].style.opacity = vn.variables.colorTextOs[noteIndex];
    },
    colorTextOpacityInput_onBlur : function(e: any) {
        var value = e.target.value;
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        if(!checkRealNumber(value)) {
            e.target.value = vn.variables.colorTextOs[noteIndex];
        }
    },
    //colorText0 event
    colorText0_onClick : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        vn.variables.colorTextRGBs[noteIndex] = "#" + vn.variables.colorTextRs[noteIndex] +  vn.variables.colorTextGs[noteIndex] +  vn.variables.colorTextBs[noteIndex];
        vn.variables.colorTextOpacitys[noteIndex] = vn.variables.colorTextOs[noteIndex];
        if(!isMobileDevice()) {
            (vn.elements.colorTextSelects[noteIndex] as any).querySelector("."+getEventChildrenClassName()).style.color
                = getRGBAFromHex(vn.variables.colorTextRGBs[noteIndex], vn.variables.colorTextOpacitys[noteIndex] === "0" ? 1 : vn.variables.colorTextOpacitys[noteIndex]);
        }
        
        // If the selection is a single point
        if(vn.variables.editRanges[noteIndex] && (vn.variables.editRanges[noteIndex] as any).collapsed) {
            // Re-move to the original selection point
            setOriginEditSelection(noteIndex);
        }
        else {	// Dragging
            // Specify style for dragged characters
            modifySelectedSingleElement(noteIndex, getObjectNoteCss(noteIndex));
        }
    },
    //colorText1 event
    colorText1_onClick : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        vn.variables.colorTextRGBs[noteIndex] = getHexColorFromColorName(vn.colors.color14[noteIndex]);
        vn.variables.colorTextOpacitys[noteIndex] = "1";
        if(!isMobileDevice()) {
            (vn.elements.colorTextSelects[noteIndex] as any).querySelector("."+getEventChildrenClassName()).style.color
                = getRGBAFromHex(vn.variables.colorTextRGBs[noteIndex], vn.variables.colorTextOpacitys[noteIndex]);
        }
        
        // If the selection is a single point
        if(vn.variables.editRanges[noteIndex] && (vn.variables.editRanges[noteIndex] as any).collapsed) {
            // Re-move to the original selection point
            setOriginEditSelection(noteIndex);
        }
        else {	// Dragging
            // Specify style for dragged characters
            modifySelectedSingleElement(noteIndex, getObjectNoteCss(noteIndex));
        }
    },
    //colorText2 event
    colorText2_onClick : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        vn.variables.colorTextRGBs[noteIndex] = getHexColorFromColorName(vn.colors.color15[noteIndex]);
        vn.variables.colorTextOpacitys[noteIndex] = "1";
        if(!isMobileDevice()) {
            (vn.elements.colorTextSelects[noteIndex] as any).querySelector("."+getEventChildrenClassName()).style.color
                = getRGBAFromHex(vn.variables.colorTextRGBs[noteIndex], vn.variables.colorTextOpacitys[noteIndex]);
        }
        
        // If the selection is a single point
        if(vn.variables.editRanges[noteIndex] && (vn.variables.editRanges[noteIndex] as any).collapsed) {
            // Re-move to the original selection point
            setOriginEditSelection(noteIndex);
        }
        else {	// Dragging
            // Specify style for dragged characters
            modifySelectedSingleElement(noteIndex, getObjectNoteCss(noteIndex));
        }
    },
    //colorText3 event
    colorText3_onClick : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        vn.variables.colorTextRGBs[noteIndex] = getHexColorFromColorName(vn.colors.color16[noteIndex]);
        vn.variables.colorTextOpacitys[noteIndex] = "1";
        if(!isMobileDevice()) {
            (vn.elements.colorTextSelects[noteIndex] as any).querySelector("."+getEventChildrenClassName()).style.color
                = getRGBAFromHex(vn.variables.colorTextRGBs[noteIndex], vn.variables.colorTextOpacitys[noteIndex]);
        }
        
        // If the selection is a single point
        if(vn.variables.editRanges[noteIndex] && (vn.variables.editRanges[noteIndex] as any).collapsed) {
            // Re-move to the original selection point
            setOriginEditSelection(noteIndex);
        }
        else {	// Dragging
            // Specify style for dragged characters
            modifySelectedSingleElement(noteIndex, getObjectNoteCss(noteIndex));
        }
    },
    //colorText4 event
    colorText4_onClick : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        vn.variables.colorTextRGBs[noteIndex] = getHexColorFromColorName(vn.colors.color17[noteIndex]);
        vn.variables.colorTextOpacitys[noteIndex] = "1";
        if(!isMobileDevice()) {
            (vn.elements.colorTextSelects[noteIndex] as any).querySelector("."+getEventChildrenClassName()).style.color
                = getRGBAFromHex(vn.variables.colorTextRGBs[noteIndex], vn.variables.colorTextOpacitys[noteIndex]);
        }
        
        // If the selection is a single point
        if(vn.variables.editRanges[noteIndex] && (vn.variables.editRanges[noteIndex] as any).collapsed) {
            // Re-move to the original selection point
            setOriginEditSelection(noteIndex);
        }
        else {	// Dragging
            // Specify style for dragged characters
            modifySelectedSingleElement(noteIndex, getObjectNoteCss(noteIndex));
        }
    },
    //colorText5 event
    colorText5_onClick : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        vn.variables.colorTextRGBs[noteIndex] = getHexColorFromColorName(vn.colors.color18[noteIndex]);
        vn.variables.colorTextOpacitys[noteIndex] = "1";
        if(!isMobileDevice()) {
            (vn.elements.colorTextSelects[noteIndex] as any).querySelector("."+getEventChildrenClassName()).style.color
                = getRGBAFromHex(vn.variables.colorTextRGBs[noteIndex], vn.variables.colorTextOpacitys[noteIndex]);
        }
        
        // If the selection is a single point
        if(vn.variables.editRanges[noteIndex] && (vn.variables.editRanges[noteIndex] as any).collapsed) {
            // Re-move to the original selection point
            setOriginEditSelection(noteIndex);
        }
        else {	// Dragging
            // Specify style for dragged characters
            modifySelectedSingleElement(noteIndex, getObjectNoteCss(noteIndex));
        }
    },
    //colorText6 event
    colorText6_onClick : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        vn.variables.colorTextRGBs[noteIndex] = getHexColorFromColorName(vn.colors.color19[noteIndex]);
        vn.variables.colorTextOpacitys[noteIndex] = "1";
        if(!isMobileDevice()) {
            (vn.elements.colorTextSelects[noteIndex] as any).querySelector("."+getEventChildrenClassName()).style.color
                = getRGBAFromHex(vn.variables.colorTextRGBs[noteIndex], vn.variables.colorTextOpacitys[noteIndex]);
        }
        
        // If the selection is a single point
        if(vn.variables.editRanges[noteIndex] && (vn.variables.editRanges[noteIndex] as any).collapsed) {
            // Re-move to the original selection point
            setOriginEditSelection(noteIndex);
        }
        else {	// Dragging
            // Specify style for dragged characters
            modifySelectedSingleElement(noteIndex, getObjectNoteCss(noteIndex));
        }
    },
    //colorText7 event
    colorText7_onClick : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        vn.variables.colorTextRGBs[noteIndex] = getHexColorFromColorName(vn.colors.color20[noteIndex]);
        vn.variables.colorTextOpacitys[noteIndex] = "1";
        if(!isMobileDevice()) {
            (vn.elements.colorTextSelects[noteIndex] as any).querySelector("."+getEventChildrenClassName()).style.color
                = getRGBAFromHex(vn.variables.colorTextRGBs[noteIndex], vn.variables.colorTextOpacitys[noteIndex]);
        }
        
        // If the selection is a single point
        if(vn.variables.editRanges[noteIndex] && (vn.variables.editRanges[noteIndex] as any).collapsed) {
            // Re-move to the original selection point
            setOriginEditSelection(noteIndex);
        }
        else {	// Dragging
            // Specify style for dragged characters
            modifySelectedSingleElement(noteIndex, getObjectNoteCss(noteIndex));
        }
    },

    //==================================================================================
    //color background select
    colorBackSelect_onClick : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        selectToggle(e.target);
        // It's too inconvenient if the cursor is caught again on mobile..
        if(!isMobileDevice()) {
            setOriginEditSelection(noteIndex);
        }
    },
    //color background select box
    colorBackSelectBox_onClick : function(e: any) {
    },
    //colorBack R Input event
    colorBackRInput_onClick : function(e: any) {
    },
    colorBackRInput_onInput : function(e: any) {
        if(!e.target.value) return;
        var inputValue = e.target.value;
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        if(!checkHex(inputValue)) {
            inputValue = vn.variables.colorBackRs[noteIndex];
            e.target.value = inputValue;
            return;
        }
        if(inputValue.length !== 2) return;
        vn.variables.colorBackRs[noteIndex] = inputValue;
        vn.elements.colorBack0s[noteIndex].style.backgroundColor = "#" + vn.variables.colorBackRs[noteIndex] +  vn.variables.colorBackGs[noteIndex] +  vn.variables.colorBackBs[noteIndex];
    },
    colorBackRInput_onBlur : function(e: any) {
        var value = e.target.value;
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        if(!checkHex(value)) {
            e.target.value = vn.variables.colorBackRs[noteIndex];
            return;
        }
        if(value.length !== 2) {
            e.target.value = vn.variables.colorBackRs[noteIndex];
        }
    },
    //colorBack G Input event
    colorBackGInput_onClick : function(e: any) {
    },
    colorBackGInput_onInput : function(e: any) {
        if(!e.target.value) return;
        var inputValue = e.target.value;
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        if(!checkHex(inputValue)) {
            inputValue = vn.variables.colorBackGs[noteIndex];
            e.target.value = inputValue;
            return;
        }
        if(inputValue.length !== 2) return;
        vn.variables.colorBackGs[noteIndex] = inputValue;
        vn.elements.colorBack0s[noteIndex].style.backgroundColor = "#" + vn.variables.colorBackRs[noteIndex] +  vn.variables.colorBackGs[noteIndex] +  vn.variables.colorBackBs[noteIndex];
    },
    colorBackGInput_onBlur : function(e: any) {
        var value = e.target.value;
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        if(!checkHex(value)) {
            e.target.value = vn.variables.colorBackGs[noteIndex];
            return;
        }
        if(value.length !== 2) {
            e.target.value = vn.variables.colorBackGs[noteIndex];
        }
    },
    //colorBack B Input event
    colorBackBInput_onClick : function(e: any) {
    },
    colorBackBInput_onInput : function(e: any) {
        if(!e.target.value) return;
        var inputValue = e.target.value;
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        if(!checkHex(inputValue)) {
            inputValue = vn.variables.colorBackBs[noteIndex];
            e.target.value = inputValue;
            return;
        }
        if(inputValue.length !== 2) return;
        vn.variables.colorBackBs[noteIndex] = inputValue;
        vn.elements.colorBack0s[noteIndex].style.backgroundColor = "#" + vn.variables.colorBackRs[noteIndex] +  vn.variables.colorBackGs[noteIndex] +  vn.variables.colorBackBs[noteIndex];
    },
    colorBackBInput_onBlur : function(e: any) {
        var value = e.target.value;
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        if(!checkHex(value)) {
            e.target.value = vn.variables.colorBackBs[noteIndex];
            return;
        }
        if(value.length !== 2) {
            e.target.value = vn.variables.colorBackBs[noteIndex];
        }
    },
    //colorBack Opacity Input event
    colorBackOpacityInput_onClick : function(e: any) {
    },
    colorBackOpacityInput_onInput : function(e: any) {
        if(e.target.value === "01" || e.target.value === "10") {
            e.target.value = e.data;
        } 
        if(!e.target.value) return;
        var inputValue = e.target.value;
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        if(!checkRealNumber(inputValue)) {
            inputValue = vn.variables.colorBackOs[noteIndex];
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
        
        vn.variables.colorBackOs[noteIndex] = inputValue;
        vn.elements.colorBack0s[noteIndex].style.opacity = vn.variables.colorBackOs[noteIndex];
    },
    colorBackOpacityInput_onBlur : function(e: any) {
        var value = e.target.value;
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        if(!checkRealNumber(value)) {
            e.target.value = vn.variables.colorBackOs[noteIndex];
        }
    },
    //colorBack0 event
    colorBack0_onClick : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        vn.variables.colorBackRGBs[noteIndex] = "#" + vn.variables.colorBackRs[noteIndex] +  vn.variables.colorBackGs[noteIndex] +  vn.variables.colorBackBs[noteIndex];
        vn.variables.colorBackOpacitys[noteIndex] = vn.variables.colorBackOs[noteIndex];
        if(!isMobileDevice()) {
            (vn.elements.colorBackSelects[noteIndex] as any).querySelector("."+getEventChildrenClassName()).style.color
                = getRGBAFromHex(vn.variables.colorBackRGBs[noteIndex], vn.variables.colorBackOpacitys[noteIndex] === "0" ? 1 : vn.variables.colorBackOpacitys[noteIndex]);
        }
        
        // If the selection is a single point
        if(vn.variables.editRanges[noteIndex] && (vn.variables.editRanges[noteIndex] as any).collapsed) {
            // Re-move to the original selection point
            setOriginEditSelection(noteIndex);
        }
        else {	// Dragging
            // Specify style for dragged characters
            modifySelectedSingleElement(noteIndex, getObjectNoteCss(noteIndex));
        }
    },
    //colorBack1 event
    colorBack1_onClick : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        vn.variables.colorBackRGBs[noteIndex] = getHexColorFromColorName(vn.colors.color14[noteIndex]);
        vn.variables.colorBackOpacitys[noteIndex] = "1";
        if(!isMobileDevice()) {
            (vn.elements.colorBackSelects[noteIndex] as any).querySelector("."+getEventChildrenClassName()).style.color
                = getRGBAFromHex(vn.variables.colorBackRGBs[noteIndex], vn.variables.colorBackOpacitys[noteIndex]);
        }
        
        // If the selection is a single point
        if(vn.variables.editRanges[noteIndex] && (vn.variables.editRanges[noteIndex] as any).collapsed) {
            // Re-move to the original selection point
            setOriginEditSelection(noteIndex);
        }
        else {	// Dragging
            // Specify style for dragged characters
            modifySelectedSingleElement(noteIndex, getObjectNoteCss(noteIndex));
        }
    },
    //colorBack2 event
    colorBack2_onClick : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        vn.variables.colorBackRGBs[noteIndex] = getHexColorFromColorName(vn.colors.color15[noteIndex]);
        vn.variables.colorBackOpacitys[noteIndex] = "1";
        if(!isMobileDevice()) {
            (vn.elements.colorBackSelects[noteIndex] as any).querySelector("."+getEventChildrenClassName()).style.color
                = getRGBAFromHex(vn.variables.colorBackRGBs[noteIndex], vn.variables.colorBackOpacitys[noteIndex]);
        }
        
        // If the selection is a single point
        if(vn.variables.editRanges[noteIndex] && (vn.variables.editRanges[noteIndex] as any).collapsed) {
            // Re-move to the original selection point
            setOriginEditSelection(noteIndex);
        }
        else {	// Dragging
            // Specify style for dragged characters
            modifySelectedSingleElement(noteIndex, getObjectNoteCss(noteIndex));
        }
    },
    //colorBack3 event
    colorBack3_onClick : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        vn.variables.colorBackRGBs[noteIndex] = getHexColorFromColorName(vn.colors.color16[noteIndex]);
        vn.variables.colorBackOpacitys[noteIndex] = "1";
        if(!isMobileDevice()) {
            (vn.elements.colorBackSelects[noteIndex] as any).querySelector("."+getEventChildrenClassName()).style.color
                = getRGBAFromHex(vn.variables.colorBackRGBs[noteIndex], vn.variables.colorBackOpacitys[noteIndex]);
        }
        
        // If the selection is a single point
        if(vn.variables.editRanges[noteIndex] && (vn.variables.editRanges[noteIndex] as any).collapsed) {
            // Re-move to the original selection point
            setOriginEditSelection(noteIndex);
        }
        else {	// Dragging
            // Specify style for dragged characters
            modifySelectedSingleElement(noteIndex, getObjectNoteCss(noteIndex));
        }
    },
    //colorBack4 event
    colorBack4_onClick : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        vn.variables.colorBackRGBs[noteIndex] = getHexColorFromColorName(vn.colors.color17[noteIndex]);
        vn.variables.colorBackOpacitys[noteIndex] = "1";
        if(!isMobileDevice()) {
            (vn.elements.colorBackSelects[noteIndex] as any).querySelector("."+getEventChildrenClassName()).style.color
                = getRGBAFromHex(vn.variables.colorBackRGBs[noteIndex], vn.variables.colorBackOpacitys[noteIndex]);
        }
        
        // If the selection is a single point
        if(vn.variables.editRanges[noteIndex] && (vn.variables.editRanges[noteIndex] as any).collapsed) {
            // Re-move to the original selection point
            setOriginEditSelection(noteIndex);
        }
        else {	// Dragging
            // Specify style for dragged characters
            modifySelectedSingleElement(noteIndex, getObjectNoteCss(noteIndex));
        }
    },
    //colorBack5 event
    colorBack5_onClick : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        vn.variables.colorBackRGBs[noteIndex] = getHexColorFromColorName(vn.colors.color18[noteIndex]);
        vn.variables.colorBackOpacitys[noteIndex] = "1";
        if(!isMobileDevice()) {
            (vn.elements.colorBackSelects[noteIndex] as any).querySelector("."+getEventChildrenClassName()).style.color
                = getRGBAFromHex(vn.variables.colorBackRGBs[noteIndex], vn.variables.colorBackOpacitys[noteIndex]);
        }
        
        // If the selection is a single point
        if(vn.variables.editRanges[noteIndex] && (vn.variables.editRanges[noteIndex] as any).collapsed) {
            // Re-move to the original selection point
            setOriginEditSelection(noteIndex);
        }
        else {	// Dragging
            // Specify style for dragged characters
            modifySelectedSingleElement(noteIndex, getObjectNoteCss(noteIndex));
        }
    },
    //colorBack6 event
    colorBack6_onClick : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        vn.variables.colorBackRGBs[noteIndex] = getHexColorFromColorName(vn.colors.color19[noteIndex]);
        vn.variables.colorBackOpacitys[noteIndex] = "1";
        if(!isMobileDevice()) {
            (vn.elements.colorBackSelects[noteIndex] as any).querySelector("."+getEventChildrenClassName()).style.color
                = getRGBAFromHex(vn.variables.colorBackRGBs[noteIndex], vn.variables.colorBackOpacitys[noteIndex]);
        }
        
        // If the selection is a single point
        if(vn.variables.editRanges[noteIndex] && (vn.variables.editRanges[noteIndex] as any).collapsed) {
            // Re-move to the original selection point
            setOriginEditSelection(noteIndex);
        }
        else {	// Dragging
            // Specify style for dragged characters
            modifySelectedSingleElement(noteIndex, getObjectNoteCss(noteIndex));
        }
    },
    //colorBack7 event
    colorBack7_onClick : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        vn.variables.colorBackRGBs[noteIndex] = getHexColorFromColorName(vn.colors.color20[noteIndex]);
        vn.variables.colorBackOpacitys[noteIndex] = "1";
        if(!isMobileDevice()) {
            (vn.elements.colorBackSelects[noteIndex] as any).querySelector("."+getEventChildrenClassName()).style.color
                = getRGBAFromHex(vn.variables.colorBackRGBs[noteIndex], vn.variables.colorBackOpacitys[noteIndex]);
        }
        
        // If the selection is a single point
        if(vn.variables.editRanges[noteIndex] && (vn.variables.editRanges[noteIndex] as any).collapsed) {
            // Re-move to the original selection point
            setOriginEditSelection(noteIndex);
        }
        else {	// Dragging
            // Specify style for dragged characters
            modifySelectedSingleElement(noteIndex, getObjectNoteCss(noteIndex));
        }
    },

    //==================================================================================
    //formatClearButton
    formatClearButton_onClick : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        // If the selection is a single point
        if (vn.variables.editRanges[noteIndex] && (vn.variables.editRanges[noteIndex] as any).collapsed) {
            // Reset all styles and reposition to the original selection point.
            initToggleButtonVariables(noteIndex);
            setOriginEditSelection(noteIndex);
        }
        else {	// Dragging
            // Specify style for dragged characters
            modifySelectedSingleElement(noteIndex, vn.variables.defaultStyles[noteIndex]);
        }
    },

    //==================================================================================
    //undo
    undoButton_onClick : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) noteIndex = vn.variables.lastActiveNote;
        // Disconnect the observer.
        elementsEvent["note_observer"].disconnect();
        if(vn.variables.recodeContings[noteIndex] <= 0) return;
        vn.variables.recodeContings[noteIndex] = vn.variables.recodeContings[noteIndex] - 1;
        replaceDifferentBetweenElements(vn.elements.textareas[noteIndex], vn.variables.recodeNotes[noteIndex][vn.variables.recodeContings[noteIndex]]);
        
        // Reconnect the observer.
        connectObserver();
    },

    //==================================================================================
    //redo
    redoButton_onClick : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) noteIndex = vn.variables.lastActiveNote;
        // Disconnect the observer.
        elementsEvent["note_observer"].disconnect();
        if(vn.variables.recodeContings[noteIndex] >= vn.variables.recodeNotes[noteIndex].length - 1) return;
        vn.variables.recodeContings[noteIndex] = vn.variables.recodeContings[noteIndex] + 1;
        replaceDifferentBetweenElements(vn.elements.textareas[noteIndex], vn.variables.recodeNotes[noteIndex][vn.variables.recodeContings[noteIndex]]);
        
        // Reconnect the observer.
        connectObserver();
    },

    //==================================================================================
    //help
    helpButton_onClick : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        
        // Restore the note size.
        doIncreaseTextareaHeight();
        
        // Close all modals
        closeAllModal(noteIndex);
        // Close all selects
        closeAllSelectBoxes(noteIndex);
        // Adjust modal size
        setAllModalSize(noteIndex);
        // Open modal background
        var displayBlock = getId(noteIndex, "on_display_block");
        var displayNone = getId(noteIndex, "on_display_none");
        vn.elements.backModals[noteIndex].classList.remove(displayNone);
        vn.elements.backModals[noteIndex].classList.add(displayBlock);
        vn.elements.helpModals[noteIndex].classList.remove(displayNone);
        vn.elements.helpModals[noteIndex].classList.add(displayBlock);
    },
    helpModal_onClick : function(e: any) {},

    //==================================================================================
    //modal back
    modalBack_onClick : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        closeAllModal(noteIndex);
    },

    //==================================================================================
    //placeholder
    placeholder_onClick : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        closePlaceholder(noteIndex);
        vn.elements.textareas[noteIndex].focus();
    },

    //==================================================================================
    //textarea
    //==================================================================================
    textarea_onClick : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        closeAllSelectBoxes(noteIndex);
    },
    textarea_onFocus : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        // Close placeholder.
        closePlaceholder(noteIndex);
        // In the editor, elements not surrounded by unit tags are recreated, wrapped with unit tags.
        doEditUnitCheck(noteIndex)
    },
    textarea_onBlur : function(e: any) {
        var noteIndex = getNoteIndex(e.target);
        if(!noteIndex) return;
        // Open placeholder.
        openPlaceholder(noteIndex);
        // Disconnect the observer.
        elementsEvent["note_observer"].disconnect();
        // Clean up the target element.
        removeEmptyElment(e.target);
        // Reconnect the observer.
        connectObserver();
    },
    textarea_onKeydown : function(e: any) {
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
    },
    textarea_onKeyup : function(e: any) {
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
    },
    textarea_onBeforeinput: function(e: any) {
        // Only proceeds for non-mobile devices && when inputting possible characters
        if (!isMobileDevice() && e.data) {
            // Disconnect the observer.
            elementsEvent["note_observer"].disconnect();
            textarea_onBeforeinputSpelling(e);
            // Reconnect the observer.
            connectObserver();
        }
    },
}
