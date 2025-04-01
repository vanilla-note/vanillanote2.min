import { Vanillanote } from "../types/vanillanote";
import { getNoteId } from "../utils/util";

export const setCssEvents = (vn: Vanillanote) => {
    vn.events.cssEvents.target_onClick = function(e: any) {
        let target = e.target;
        // If a child element is selected, event is controlled
        if(target.classList.contains(vn.variables.noteName + "_eventChildren")) {
            target = target.parentNode;
        }
        const noteId = getNoteId(target);
        // Add active CSS
        target.classList.add(vn.variables.noteName + "_" + noteId + "_" + "on_active");
        // Remove active CSS after 0.1 seconds
        setTimeout(function() {
            target.classList.remove(vn.variables.noteName + "_" + noteId + "_" + "on_active");
        }, 100);
    };
    vn.events.cssEvents.target_onMouseover = function(e: any) {
        let target = e.target;
        // If a child element is selected, event is controlled
        if(target.classList.contains(vn.variables.noteName + "_eventChildren")) {
            target = target.parentNode;
        }
        const noteId = getNoteId(target);
        target.classList.add(vn.variables.noteName + "_" + noteId + "_" + "on_mouseover");
    }
    vn.events.cssEvents.target_onMouseout = function(e: any) {
        let target = e.target;
        // If a child element is selected, event is controlled
        if(target.classList.contains(vn.variables.noteName + "_eventChildren")) {
            target = target.parentNode;
        }
        const noteId = getNoteId(target);
        target.classList.remove(vn.variables.noteName + "_" + noteId + "_" + "on_mouseover");
    };
    vn.events.cssEvents.target_onTouchstart = function(e: any) {
        let target = e.target;
        // If a child element is selected, event is controlled
        if(target.classList.contains(vn.variables.noteName + "_eventChildren")) {
            target = target.parentNode;
        }
        const noteId = getNoteId(target);
        target.classList.add(vn.variables.noteName + "_" + noteId + "_" + "on_mouseover");
        target.classList.remove(vn.variables.noteName + "_" + noteId + "_" + "on_mouseout");
    };
    vn.events.cssEvents.target_onTouchend = function(e: any) {
        let target = e.target;
        // If a child element is selected, event is controlled
        if(target.classList.contains(vn.variables.noteName + "_eventChildren")) {
            target = target.parentNode;
        }
        const noteId = getNoteId(target);
        target.classList.add(vn.variables.noteName + "_" + noteId + "_" + "on_mouseout");
        target.classList.remove(vn.variables.noteName + "_" + noteId + "_" + "on_mouseover");
    };
}
