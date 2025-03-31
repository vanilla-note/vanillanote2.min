import { VanillanoteElement } from "../types/vanillanote";

export const target_onClick = function(e: any, noteName: string, noteId: string) {
    var target = e.target;
    // If a child element is selected, event is controlled
    if(target.classList.contains(noteName + "_eventChildren")) {
        target = target.parentNode;
    }
    // Add active CSS
    target.classList.add(noteName + "_" + noteId + "_" + "on_active");
    // Remove active CSS after 0.1 seconds
    setTimeout(function() {
        target.classList.remove(noteName + "_" + noteId + "_" + "on_active");
    }, 100);
};
export const target_onMouseover = function(e: any, noteName: string, noteId: string) {
    var target = e.target;
    // If a child element is selected, event is controlled
    if(target.classList.contains(noteName + "_eventChildren")) {
        target = target.parentNode;
    }
    target.classList.add(noteName + "_" + noteId + "_" + "on_mouseover");
}
export const target_onMouseout = function(e: any, noteName: string, noteId: string) {
    var target = e.target;
    // If a child element is selected, event is controlled
    if(target.classList.contains(noteName + "_eventChildren")) {
        target = target.parentNode;
    }
    target.classList.remove(noteName + "_" + noteId + "_" + "on_mouseover");
};
export const target_onTouchstart = function(e: any, noteName: string, noteId: string) {
    var target = e.target;
    // If a child element is selected, event is controlled
    if(target.classList.contains(noteName + "_eventChildren")) {
        target = target.parentNode;
    }
    target.classList.add(noteName + "_" + noteId + "_" + "on_mouseover");
    target.classList.remove(noteName + "_" + noteId + "_" + "on_mouseout");
};
export const target_onTouchend = function(e: any, noteName: string, noteId: string) {
    var target = e.target;
    // If a child element is selected, event is controlled
    if(target.classList.contains(noteName + "_eventChildren")) {
        target = target.parentNode;
    }
    target.classList.add(noteName + "_" + noteId + "_" + "on_mouseout");
    target.classList.remove(noteName + "_" + noteId + "_" + "on_mouseover");
};
export const doDecreaseTextareaHeight = function(textarea: HTMLDivElement, note: VanillanoteElement) {
    // Stop if not in auto-scroll mode.
    if(!note._noteStatus.isNoteByMobile) return;
    textarea.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
    });
    setTimeout(function() {
        decreaseTextareaHeight(textarea, noteIndex);
    }, 100);
};
export const doIncreaseTextareaHeight = function() {
    // Restore the note size.
    for(var i = 0; i < vn.elements.textareas.length; i++) {
        // Stop if not in auto-scroll mode.
        if(!vn.variables.useMobileActiveMode[i]) continue;
        increaseTextareaHeight(vn.elements.textareas[i]);
    }
};
export const modifyTextareaScroll = function(textarea: any, noteIndex: number) {
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
