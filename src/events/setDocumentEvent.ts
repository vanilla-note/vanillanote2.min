import type { Vanillanote } from "../types/vanillanote";
import { initToggleButtonVariables, onEventDisable, recodeNote } from "../utils/handleActive";
import { doDecreaseTextareaHeight, doIncreaseTextareaHeight, modifyTextareaScroll, setAllModalSize, setAllToolSize, setAllToolTipPosition, setPlaceholderSize } from "../utils/handleElement";
import { setEditSelection } from "../utils/handleSelection";
import { extractNumber, getParentNote } from "../utils/util";

export const setDocumentEvents = (vn: Vanillanote) => {
    //document, window event 생성
    vn.events.documentEvents.noteObserver = new MutationObserver((mutations) => {
        let mutationEl;
        mutations.forEach((mutation) => {
            mutationEl = mutation.target;
        });
        if(!mutationEl) return;
        const note = getParentNote(mutationEl);
        if(!note) return;
        vn.variables.lastActiveNoteId = note._id;

        recodeNote(note);
    });
    
    // Adjust note size according to window change.
    const window_onResize = () => {
        // A delay of 0.05 second
        if(!vn.variables.canEvent) return;
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
            if(!note) return;
            const toolHeight = extractNumber(note._elements.tool.style.height) ? extractNumber(note._elements.tool.style.height) : 93.6;
            vn.variables.mobileKeyboardExceptHeight = window.visualViewport.height - (toolHeight! / 2);
            doDecreaseTextareaHeight(note);
        }
        if(vn.variables.lastScreenHeight! < window.visualViewport.height) {
            doIncreaseTextareaHeight(vn);
        }
        
        vn.variables.lastScreenHeight = window.visualViewport.height;
    };
    
    const document_onSelectionchange = (e: Event) => {
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
            for(let i = 0; i < noteIds.length; i++) {
                initToggleButtonVariables(vn.vanillanoteElements[noteIds[i]]);
            }
            return;
        }
        
        // Execute only when inside the textarea.
        if(!isTextarea) {
            return;
        }
        // Save the current selection.
        if(!setEditSelection(note, selection)) return;	// Exit if the save was unsuccessful
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
            (vn.events.elementEvents as any).undoButton_onClick(event, vn);
        }
        if ((event.ctrlKey || event.metaKey) && (event.key === "y" || event.key === "Y")) {
            event.preventDefault();
            (vn.events.elementEvents as any).redoButton_onClick(event, vn);
        }
    };
    vn.events.documentEvents.resize = (event: UIEvent) => {
        window_onResize();
    };
    vn.events.documentEvents.resizeViewport = (event: Event) => {
        window_resizeViewport(event);
    };
    document.addEventListener("selectionchange", vn.events.documentEvents.selectionchange);
    document.addEventListener("keydown", vn.events.documentEvents.keydown);
    window.addEventListener("resize", vn.events.documentEvents.resize);
    if(window.visualViewport) window.visualViewport.addEventListener("resize", vn.events.documentEvents.resizeViewport);
}
