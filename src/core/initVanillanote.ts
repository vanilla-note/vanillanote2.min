import type { Vanillanote, VanillanoteElement } from "../types/vanillanote";
import { setDocumentEvents } from "../events/setDocumentEvent";
import { setCssEvents } from "../events/setCssEvent";
import { setElementEvents } from "../events/setElementEvent";

export const initVanillanote = (vn: Vanillanote) => {
    //The logic for using document, window and navigator to use getVanillanote in an SSR environment is declared below.
    vn.variables.lastScreenHeight =  typeof window !== 'undefined' && window.visualViewport ? window.visualViewport.height : null;
    vn.getNote = (noteId: string): VanillanoteElement | null => {
        return vn.vanillanoteElements[noteId] ? vn.vanillanoteElements[noteId] : null;
    };
    
    //animation 등록
    const animationStyleId = `${vn.variables.noteName}_animation_styles-sheet`;
    if (!document.getElementById(animationStyleId)) {
        const cssText = `
          @keyframes ${vn.variables.noteName}-modal-input {
            0% { width: 30%; }
            100% { width: 80%; }
          }
          @keyframes ${vn.variables.noteName}-modal-small-input {
            0% { width: 0%; }
            100% { width: 20%; }
          }
        `;
        const styleElement = document.createElement("style");
        styleElement.id = animationStyleId;
        styleElement.textContent = cssText.trim();
        document.head.appendChild(styleElement);
    }

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

    //event 등록
    setDocumentEvents(vn);
    setCssEvents(vn);
    setElementEvents(vn);
}