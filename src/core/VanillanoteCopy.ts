import {
    Vanillanote,
    VanillanoteConstructor,
    VanillanoteElement
} from './index'

//==================================================================================
//create vanilla note
//==================================================================================
function createVanillanote(vn: Vanillanote) {

    var getNote = function() {return vn;};
    
}

function destroyVanillanote(vn: Vanillanote) {
    //Only created Vanillanote works
    if(!vn.variables.isCreated) return;
    
    //styles sheet remove
    var stylesSheet = document.getElementById(vn.variables.noteName + "_styles-sheet");
    stylesSheet!.remove();
    
    //google icons link remove
    var iconsLink = document.getElementById(vn.variables.noteName + "_icons-link");
    iconsLink!.remove();
    
    //document, window evnet remove
    document.removeEventListener("selectionchange", (vn.eventStore as any).selectionchange);
    document.removeEventListener("keydown", (vn.eventStore as any).keydown);
    window.removeEventListener("resize", (vn.eventStore as any).resize);
    if(window.visualViewport) window.visualViewport.removeEventListener("resize", (vn.eventStore as any).resizeViewport);
    
    //html elements remove
    var removeAllChildNodes = function(parent: any) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }
    var notes = document.querySelectorAll('[data-vanillanote]');
    for(var i = 0; i < notes.length; i++) {
        removeAllChildNodes(notes[i]);
    }
    
    //object remove
    (vn as any) = null;
}

export { getVanillanote, createVanillanote, destroyVanillanote };
