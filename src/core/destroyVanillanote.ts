import type { Vanillanote } from "../types/vanillanote";

export const destroyVanillanote = (vn: Vanillanote) => {
    //animation styles sheet remove
    var stylesSheet = document.getElementById(`${vn.variables.noteName}_animation_styles-sheet`);
    stylesSheet!.remove();
    
    //google icons link remove
    var iconsLink = document.getElementById(`${vn.variables.noteName}_icons-link`);
    iconsLink!.remove();
    
    //document, window evnet remove
    document.removeEventListener("selectionchange", (vn.events.documentEvents as any).selectionchange);
    document.removeEventListener("keydown", (vn.events.documentEvents as any).keydown);
    window.removeEventListener("resize", (vn.events.documentEvents as any).resize);
    if(window.visualViewport) window.visualViewport.removeEventListener("resize", (vn.events.documentEvents as any).resizeViewport);

    //object remove
    (vn as any) = null;
}
