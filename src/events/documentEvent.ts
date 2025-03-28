export const note_observer = new MutationObserver(function(mutations) {
    var mutationEl;
    mutations.forEach(function(mutation) {
        mutationEl = mutation.target;
    });
    var noteIndex = getNoteIndex(mutationEl);
    if(!noteIndex) return;
    vn.variables.lastActiveNote = Number(noteIndex);
    
    // Does not record more than the recodeLimit number.
    if(vn.variables.recodeNotes[noteIndex].length >= vn.variables.recodeLimit[noteIndex]) {
        vn.variables.recodeNotes[noteIndex].shift();
        vn.variables.recodeNotes[noteIndex].push((vn.elements.textareas[noteIndex] as any).cloneNode(true));
    }
    else {
        vn.variables.recodeContings[noteIndex] = vn.variables.recodeContings[noteIndex] + 1;
        // If a new change occurs in the middle of undoing, subsequent records are deleted.
        if(vn.variables.recodeContings[noteIndex] < vn.variables.recodeNotes[noteIndex].length) {
            vn.variables.recodeNotes[noteIndex].splice(vn.variables.recodeContings[noteIndex]);
        }
        vn.variables.recodeNotes[noteIndex].push((vn.elements.textareas[noteIndex] as any).cloneNode(true));
    }
});

// Adjust note size according to window change.
export const window_onResize = (e: UIEvent) => {
    // A delay of 0.05 second
    if(!vn.variables.canEvents) return;
    onEventDisable("resize");
    
    for(var i = 0; i < vn.elements.tools.length; i++) {
        // Adjust toolbar size.
        setAllToolSize(i);
        // Adjust the position of the tooltip.
        setAllToolTipPosition(i);
        // Control modal size.
        setAllModalSize(i);
        // Control placeholder size.
        setPlaceholderSize(i);
    }
};
export const window_resizeViewport = (e: Event) => {
    if(!window.visualViewport) return;
    //only height
    if(vn.variables.lastScreenHeight === window.visualViewport.height) return;
    //useMobileActive
    var useMobileActiveConunt = 0;
    for(var i = 0; i < vn.variables.useMobileActiveMode.length; i++) {
        // Stop if not in auto-scroll mode.
        if(vn.variables.useMobileActiveMode[i]) useMobileActiveConunt++;
    }
    if(useMobileActiveConunt === 0) return;
    
    var textarea: any = document.activeElement;
    var isTextarea = false;
    
    while(textarea) {
        if(textarea.tagName === (vn.variables.noteName+"-textarea").toUpperCase()) {
            isTextarea = true;
            break;
        }
        else {
            textarea = textarea.parentNode;
        }
    }
    
    if(isTextarea && vn.variables.lastScreenHeight! > window.visualViewport.height) {
        var noteIndex = getNoteIndex(textarea);
        var toolHeight = extractNumber(vn.elements.tools[noteIndex].style.height) ? extractNumber(vn.elements.tools[noteIndex].style.height) : 93.6;
        vn.variables.mobileKeyboardExceptHeight = window.visualViewport.height - (toolHeight! / 2);
        doDecreaseTextareaHeight(textarea, noteIndex);
    }
    if(vn.variables.lastScreenHeight! < window.visualViewport.height) {
        doIncreaseTextareaHeight();
    }
    
    vn.variables.lastScreenHeight = window.visualViewport.height;
};

export const document_onSelectionchange = function(e: Event) {
    var selection = window.getSelection();
    if (!selection || selection.rangeCount < 1) return;
    var range = selection.getRangeAt(0);
    
    // Check if it's inside the note.
    var textarea: any = range.startContainer;
    var note: any = range.startContainer;
    var isTextarea = false;
    var isVanillanote = false;
    
    while(note) {
        if(textarea.tagName === (vn.variables.noteName+"-textarea").toUpperCase()) {
            isTextarea = true;
        }
        else {
            textarea = textarea.parentNode;
        }
        
        if(note instanceof Element && note.hasAttribute("data-vanillanote")) {
            isVanillanote = true;
            break;
        }
        else {
            note = note.parentNode;
        }
    }
    
    // In case it's not inside the note.
    if(!isVanillanote) {
        for(var i = 0; i < vn.elements.notes.length; i++) {
            initToggleButtonVariables(i);
        }
        return;
    }
    
    // Execute only when inside the textarea.
    if(!isTextarea) {
        return;
    }
    var noteIndex = textarea.getAttribute("data-note-index");
    // Save the current selection.
    if(!setEditSelection(noteIndex, selection)) return;	// Exit if the save was unsuccessful
//			setEditSelection(noteIndex, selection);
    //textarea scrolling
    modifyTextareaScroll(textarea, noteIndex);
};
