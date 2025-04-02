import type { Vanillanote } from "../types/vanillanote";
import { getNoteId } from "../utils/util";

export const setCssEvents = (vn: Vanillanote) => {
    vn.events.cssEvents.target_onClick = (e: any) => {
        let target = e.target;
        // If a child element is selected, event is controlled
        if(target.classList.contains(vn.variables.noteName + "_eventChildren")) {
            target = target.parentNode;
        }
        const noteId = getNoteId(target);
        // Add active CSS
        target.classList.add(vn.variables.noteName + "_" + noteId + "_" + "on_active");
        // Remove active CSS after 0.1 seconds
        setTimeout(() => {
            target.classList.remove(vn.variables.noteName + "_" + noteId + "_" + "on_active");
        }, 100);
    };
    vn.events.cssEvents.target_onMouseover = (e: any) => {
        let target = e.target;
        // If a child element is selected, event is controlled
        if(target.classList.contains(vn.variables.noteName + "_eventChildren")) {
            target = target.parentNode;
        }
        const noteId = getNoteId(target);
        target.classList.add(vn.variables.noteName + "_" + noteId + "_" + "on_mouseover");
    }
    vn.events.cssEvents.target_onMouseout = (e: any) => {
        let target = e.target;
        // If a child element is selected, event is controlled
        if(target.classList.contains(vn.variables.noteName + "_eventChildren")) {
            target = target.parentNode;
        }
        const noteId = getNoteId(target);
        target.classList.remove(vn.variables.noteName + "_" + noteId + "_" + "on_mouseover");
    };
    vn.events.cssEvents.target_onTouchstart = (e: any) => {
        let target = e.target;
        // If a child element is selected, event is controlled
        if(target.classList.contains(vn.variables.noteName + "_eventChildren")) {
            target = target.parentNode;
        }
        const noteId = getNoteId(target);
        target.classList.add(vn.variables.noteName + "_" + noteId + "_" + "on_mouseover");
        target.classList.remove(vn.variables.noteName + "_" + noteId + "_" + "on_mouseout");
    };
    vn.events.cssEvents.target_onTouchend = (e: any) => {
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
