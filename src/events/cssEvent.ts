var target_onClick = function(e: any) {
    var target = e.target;
    // If a child element is selected, event is controlled
    if(target.classList.contains(vn.variables.noteName + "_eventChildren")) {
        target = target.parentNode;
    }
    var noteIndex = target.getAttribute("data-note-index");
    if(!noteIndex) return;
    // Add active CSS
    target.classList.add(vn.variables.noteName + "_" + noteIndex + "_" + "on_active");
    // Remove active CSS after 0.1 seconds
    setTimeout(function() {
        target.classList.remove(vn.variables.noteName + "_" + noteIndex + "_" + "on_active");
    }, 100);
};
var target_onMouseover = function(e: any) {
    var target = e.target;
    // If a child element is selected, event is controlled
    if(target.classList.contains(vn.variables.noteName + "_eventChildren")) {
        target = target.parentNode;
    }
    var noteIndex = target.getAttribute("data-note-index");
    if(!noteIndex) return;
    target.classList.add(vn.variables.noteName + "_" + noteIndex + "_" + "on_mouseover");
}
var target_onMouseout = function(e: any) {
    var target = e.target;
    // If a child element is selected, event is controlled
    if(target.classList.contains(vn.variables.noteName + "_eventChildren")) {
        target = target.parentNode;
    }
    var noteIndex = target.getAttribute("data-note-index");
    if(!noteIndex) return;
    target.classList.remove(vn.variables.noteName + "_" + noteIndex + "_" + "on_mouseover");
};
var target_onTouchstart = function(e: any) {
    var target = e.target;
    // If a child element is selected, event is controlled
    if(target.classList.contains(vn.variables.noteName + "_eventChildren")) {
        target = target.parentNode;
    }
    var noteIndex = target.getAttribute("data-note-index");
    if(!noteIndex) return;
    target.classList.add(vn.variables.noteName + "_" + noteIndex + "_" + "on_mouseover");
    target.classList.remove(vn.variables.noteName + "_" + noteIndex + "_" + "on_mouseout");
};
var target_onTouchend = function(e: any) {
    var target = e.target;
    // If a child element is selected, event is controlled
    if(target.classList.contains(vn.variables.noteName + "_eventChildren")) {
        target = target.parentNode;
    }
    var noteIndex = target.getAttribute("data-note-index");
    if(!noteIndex) return;
    target.classList.add(vn.variables.noteName + "_" + noteIndex + "_" + "on_mouseout");
    target.classList.remove(vn.variables.noteName + "_" + noteIndex + "_" + "on_mouseover");
};
var doDecreaseTextareaHeight = function(textarea: any, noteIndex: number) {
    // Stop if not in auto-scroll mode.
    if(!vn.variables.useMobileActiveMode[noteIndex]) return;
    textarea.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
    });
    setTimeout(function() {
        decreaseTextareaHeight(textarea, noteIndex);
    }, 100);
};
var doIncreaseTextareaHeight = function() {
    // Restore the note size.
    for(var i = 0; i < vn.elements.textareas.length; i++) {
        // Stop if not in auto-scroll mode.
        if(!vn.variables.useMobileActiveMode[i]) continue;
        increaseTextareaHeight(vn.elements.textareas[i]);
    }
};
var modifyTextareaScroll = function(textarea: any, noteIndex: number) {
    // Stop if not in auto-scroll mode.
    if(!vn.variables.useMobileActiveMode[noteIndex]) return;
    
    if(vn.variables.preventChangeScroll > 0) {
        vn.variables.preventChangeScroll--;
        return;	
    }
    if(vn.variables.isSelectionProgress) return;
    vn.variables.isSelectionProgress = true;
    // 0.05 seconds time out.
    setTimeout(function() {
        vn.variables.isSelectionProgress = false;
        
        //If there is unvalid selection, return.
        if(!isValidSelection(noteIndex)) return;
        
        // The number of the middle element from the currently dragged elements.
        var indexMiddleUnit = checkNumber(vn.variables.editDragUnitElements[noteIndex].length / 2) ?
        vn.variables.editDragUnitElements[noteIndex].length / 2 - 1 : Math.floor(vn.variables.editDragUnitElements[noteIndex].length / 2);
        // The total height of the currently dragged elements.
        var heightSumDragUnitElements = (vn.variables.editDragUnitElements[noteIndex] as any)[(vn.variables.editDragUnitElements[noteIndex] as any).length - 1].offsetTop
        - (vn.variables.editDragUnitElements[noteIndex] as any)[0].offsetTop
        + (vn.variables.editDragUnitElements[noteIndex] as any)[(vn.variables.editDragUnitElements[noteIndex] as any).length - 1].offsetHeight;
        // If the total height of the currently dragged elements is larger than the current textarea's height, do not scroll. (With a margin of about 30px).
        if(heightSumDragUnitElements > textarea.offsetHeight - 30) return;
        // If any select box is open, do not scroll.
        if(getCheckSelectBoxesOpened(noteIndex)) return;
        if((vn.variables.editRanges[noteIndex] as any).collapsed) {
            setElementScroll(textarea, vn.variables.editStartElements[noteIndex]);
        }
        else {
            setElementScroll(textarea, vn.variables.editDragUnitElements[noteIndex][indexMiddleUnit]);
        }
                
    }, 50);
}
