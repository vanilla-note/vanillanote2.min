import type { Vanillanote, VanillanoteElement } from "../types/vanillanote";

export const unmountVanillanote = (vn: Vanillanote, element?: HTMLElement) => {
    const targetElement = element ? element : document;

    const notes: NodeListOf<VanillanoteElement> = targetElement.querySelectorAll('[data-vanillanote]');

    //html elements remove
    const removeAllChildNodes = function(parent: any) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    notes.forEach((note: VanillanoteElement) => {
        //styles sheet remove
        const stylesSheet = document.getElementById(`${note._noteName}_${note._id}_styles-sheet`);
        stylesSheet?.parentElement?.removeChild(stylesSheet);
        //remove vanillanoteElements in vanillanote object
        delete vn.vanillanoteElements[note._id];
        //remove element
        removeAllChildNodes(note);
    });
}
