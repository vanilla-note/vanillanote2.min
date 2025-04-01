import { Vanillanote } from "../types/vanillanote";
import { initToggleButtonVariables, onEventDisable } from "../utils/handleActive";
import { doDecreaseTextareaHeight, doIncreaseTextareaHeight, modifyTextareaScroll, setAllModalSize, setAllToolSize, setAllToolTipPosition, setPlaceholderSize } from "../utils/handleElement";
import { setEditSelection } from "../utils/handleSelection";
import { extractNumber, getParentNote } from "../utils/util";

export const setDocumentEvents = (vn: Vanillanote) => {
    //document, window event 생성
    vn.events.documentEvents.noteObserver = new MutationObserver(function(mutations) {
        let mutationEl;
        mutations.forEach(function(mutation) {
            mutationEl = mutation.target;
        });
        if(!mutationEl) return;
        const note = getParentNote(mutationEl);
        if(!note) return;
        vn.variables.lastActiveNoteId = note._id;
        
        // Does not record more than the recodeLimit number.
        if(note._records.recodeNotes.length >= note._records.recodeLimit) {
            note._records.recodeNotes.shift();
            note._records.recodeNotes.push(note._elements.textarea.cloneNode(true));
        }
        else {
            note._records.recodeConting = note._records.recodeConting + 1;
            // If a new change occurs in the middle of undoing, subsequent records are deleted.
            if(note._records.recodeConting < note._records.recodeNotes.length) {
                note._records.recodeNotes.splice(note._records.recodeConting);
            }
            note._records.recodeNotes.push(note._elements.textarea.cloneNode(true));
        }
    });
    
    // Adjust note size according to window change.
    const window_onResize = () => {
        // A delay of 0.05 second
        if(!vn.variables.canEvents) return;
        onEventDisable(vn, "resize");
        
        Object.keys(vn.vanillanoteElements).forEach((id) => {
            // Adjust toolbar size.
            setAllToolSize(vn.vanillanoteElements[id]);
            // Adjust the position of the tooltip.
            setAllToolTipPosition(vn.vanillanoteElements[id]);
            // Control modal size.
            setAllModalSize(vn.vanillanoteElements[id]);
            // Control placeholder size.
            setPlaceholderSize(vn.vanillanoteElements[id]);
        })
    };

    const window_resizeViewport = (e: Event) => {
        if(!window.visualViewport) return;
        //only height
        if(vn.variables.lastScreenHeight === window.visualViewport.height) return;
        
        let textarea: any = document.activeElement;
        let isTextarea = false;
        
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
            const note = getParentNote(textarea);
            const toolHeight = extractNumber(note._elements.tool.style.height) ? extractNumber(note._elements.tool.style.height) : 93.6;
            vn.variables.mobileKeyboardExceptHeight = window.visualViewport.height - (toolHeight! / 2);
            doDecreaseTextareaHeight(note);
        }
        if(vn.variables.lastScreenHeight! < window.visualViewport.height) {
            doIncreaseTextareaHeight(vn);
        }
        
        vn.variables.lastScreenHeight = window.visualViewport.height;
    };
    
    const document_onSelectionchange = function(e: Event) {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount < 1) return;
        const range = selection.getRangeAt(0);
        
        // Check if it's inside the note.
        let textarea: any = range.startContainer;
        let note: any = range.startContainer;
        let isTextarea = false;
        let isVanillanote = false;
        
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
            const noteIds = Object.keys(vn.vanillanoteElements);
            for(var i = 0; i < noteIds.length; i++) {
                initToggleButtonVariables(vn.vanillanoteElements[noteIds[i]]);
            }
            return;
        }
        
        // Execute only when inside the textarea.
        if(!isTextarea) {
            return;
        }
        var noteIndex = textarea.getAttribute("data-note-id");
        // Save the current selection.
        if(!setEditSelection(note, selection)) return;	// Exit if the save was unsuccessful
    //			setEditSelection(noteIndex, selection);
        //textarea scrolling
        modifyTextareaScroll(textarea, note);
    };

    //document, window event 등록
    vn.events.documentEvents.selectionchange = (event: Event) => {
        document_onSelectionchange(event);
    };
    vn.events.documentEvents.keydown = (event: KeyboardEvent) => {
        if ((event.ctrlKey || event.metaKey) && (event.key === "z" || event.key === "Z")) {
            event.preventDefault();
            (vn.events.elementEvents as any).undoButton_onClick(event);
        }
        if ((event.ctrlKey || event.metaKey) && (event.key === "y" || event.key === "Y")) {
            event.preventDefault();
            (vn.events.elementEvents as any).redoButton_onClick(event);
        }
    };
    vn.events.documentEvents.resize = function(event: UIEvent) {
        window_onResize();
    };
    vn.events.documentEvents.resizeViewport = function(event: Event) {
        window_resizeViewport(event);
    };
    document.addEventListener("selectionchange", vn.events.documentEvents.selectionchange);
    document.addEventListener("keydown", vn.events.documentEvents.keydown);
    window.addEventListener("resize", vn.events.documentEvents.resize);
    if(window.visualViewport) window.visualViewport.addEventListener("resize", vn.events.documentEvents.resizeViewport);
}
