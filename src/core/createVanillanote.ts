//import { document_onSelectionchange, window_onResize, window_resizeViewport } from "../events/documentEvent";
//import { redoButton_onClick, undoButton_onClick } from "../events/elementEvent";
import type { Vanillanote, VanillanoteElement } from "../types/vanillanote";

export const createVanillanote = (vn: Vanillanote, element: HTMLElement) => {
    //The logic for using document, window and navigator to use getVanillanote in an SSR environment is declared below.
    vn.variables.lastScreenHeight =  typeof window !== 'undefined' && window.visualViewport ? window.visualViewport.height : null;
    vn.variables.isIOS = typeof navigator !== 'undefined' ? /iPhone|iPad|iPod/i.test(navigator.userAgent) : false;
    vn.get = function(noteId: string): VanillanoteElement | null {
        return vn.vanillanoteElements[noteId] ? vn.vanillanoteElements[noteId] : null;
    };

    //if there is no note, no create.
    const notes = element.querySelectorAll('[data-vanillanote]');
    if(notes.length <= 0) return;
    //id duplication check
    const idMap = new Map();
    notes.forEach(note => {
        const id = note.getAttribute('data-id');
        if (id) {
          if (idMap.has(id)) {
            throw new Error(`Duplicate vanillanote id detected: ${id}`);
          } else {
            idMap.set(id, true);
          }
        }
    });

    //document, window event
    /*
    vn.documentEvents.selectionchange = (event: any) => {
        document_onSelectionchange(event);
    };
    vn.documentEvents.keydown = (event: KeyboardEvent) => {
        if ((event.ctrlKey || event.metaKey) && (event.key === "z" || event.key === "Z")) {
            event.preventDefault();
            undoButton_onClick(event);
        }
        if ((event.ctrlKey || event.metaKey) && (event.key === "y" || event.key === "Y")) {
            event.preventDefault();
            redoButton_onClick(event);
        }
    };
    vn.documentEvents.resize = function(event: UIEvent) {
        window_onResize(event);
    };
    vn.documentEvents.resizeViewport = function(event: Event) {
        window_resizeViewport(event);
    };
    document.addEventListener("selectionchange", vn.documentEvents.selectionchange);
    document.addEventListener("keydown", vn.documentEvents.keydown);
    window.addEventListener("resize", vn.documentEvents.resize);
    if(window.visualViewport) window.visualViewport.addEventListener("resize", vn.documentEvents.resizeViewport);
    */

    //cssText ==> 최종 정리 후 마지막에 document에 추가
    let cssText = "";
    cssText = cssText + vn.keyframes["@keyframes vanillanote-modal-input"];
    cssText = cssText + vn.keyframes["@keyframes vanillanote-modal-small-input"];

    //vanillanote element methods
    var getNoteData = function() {
        /*
        var noteIndex = getNoteIndex(this);
        var textarea = vn.elements.textareas[noteIndex];
        
        var fileEls = textarea.querySelectorAll("[uuid]");
        
        var attFiles: any = {};
        for (var key in vn.variables.attFiles[noteIndex]) {
            if (vn.variables.attFiles[noteIndex].hasOwnProperty(key)) {
                attFiles[key] = vn.variables.attFiles[noteIndex][key];
            }
        }
        for (var key in vn.variables.attImages[noteIndex]) {
            if (vn.variables.attImages[noteIndex].hasOwnProperty(key)) {
                attFiles[key] = vn.variables.attImages[noteIndex][key];
            }
        }
        var attFileKeys = Object.keys(attFiles);
        var attFileKeysLength = attFileKeys.length;
        var returnAttFiles: any = {};
        var chkCnt;
        
        //Add only the files in the current note
        for(var i = 0; i < attFileKeysLength; i++) {
            chkCnt = 0;
            for(var j = 0; j < fileEls.length; j++) {
                if(attFileKeys[i] === fileEls[j].getAttribute("uuid")) chkCnt++;
            }
            if(chkCnt > 0) {
                returnAttFiles[attFileKeys[i]] =  attFiles[attFileKeys[i]];
            }
        }
        //Add only the images in the current note
        
        var noteData = {
                "noteIndex" : noteIndex,
                "textarea" : textarea,
                "files" : returnAttFiles,
            }
        
        return noteData;
        */
    };

    const setNoteData = () => {};

    //create note
    notes.forEach(note => {
        const noteId = note.getAttribute('data-id');
    });

    // Create google icons link cdn
    const googleIconHrefBase = "https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded";
    const iconLinkId = vn.variables.noteName + "_icons-link";
    
    const alreadyIncluded = Array.from(document.head.querySelectorAll('link[rel="stylesheet"]')).some(link => {
      const href = link.getAttribute('href');
      return href && href.startsWith(googleIconHrefBase);
    });
    
    if (!alreadyIncluded && !document.getElementById(iconLinkId)) {
      const linkElementGoogleIcons = document.createElement("link");
      linkElementGoogleIcons.setAttribute("id", iconLinkId);
      linkElementGoogleIcons.setAttribute("rel", "stylesheet");
      linkElementGoogleIcons.setAttribute("href", googleIconHrefBase + ":opsz,wght,FILL,GRAD@48,400,0,0");
      document.head.appendChild(linkElementGoogleIcons);
    }

    // To prevent the Google icon from initially displaying as text, it is shown after a delay of 0.1 seconds.
    /*
    setTimeout(function() {
        for(var i = 0; i < vn.elements.templates.length; i++) {
            vn.elements.templates[i].removeAttribute("style");
        }
        // Resize the size.
        elementsEvent["window_onResize"](event);
    }, vn.variables.loadInterval);
    */
    
    vn.variables.isCreated = true;
}

const createNote = () => {

}
