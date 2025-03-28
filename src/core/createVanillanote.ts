//import { document_onSelectionchange, window_onResize, window_resizeViewport } from "../events/documentEvent";
//import { redoButton_onClick, undoButton_onClick } from "../events/elementEvent";
import { note_observer } from "../events/documentEvent";
import { elementsEvent } from "../events/elementEvent";
import { NoteAttributes } from "../types/attributes";
import { Colors, Csses } from "../types/csses";
import { NoteModesByDevice, ToolPositions } from "../types/enums";
import type { Vanillanote, VanillanoteElement } from "../types/vanillanote";
import { addClickEvent, createElement, createElementBasic, createElementButton, createElementInput, createElementSelect } from "../utils/createElement";
import { initTextarea } from "../utils/handleSelection";
import {
    checkAlphabetAndNumber,
    checkNumber,
    checkRealNumber,
    getClassName,
    getColors,
    getHexColorFromColorName,
    getId,
    getInvertColor,
    getIsIOS,
    getRGBAFromHex,
    isMobileDevice,
} from "../utils/util";

export const createVanillanote = (vn: Vanillanote, element?: HTMLElement) => {
    //The logic for using document, window and navigator to use getVanillanote in an SSR environment is declared below.
    vn.variables.lastScreenHeight =  typeof window !== 'undefined' && window.visualViewport ? window.visualViewport.height : null;
    vn.get = function(noteId: string): VanillanoteElement | null {
        return vn.vanillanoteElements[noteId] ? vn.vanillanoteElements[noteId] : null;
    };
    const targetElement = element ? element : document;

    //if there is no note, no create.
    const notes = targetElement.querySelectorAll('[data-vanillanote]');
    if(notes.length <= 0) return;
    //id duplication check
    const idMap = new Map();
    notes.forEach(note => {
        const id = note.getAttribute('data-id');
        if (!id) throw new Error(`The data-id attribute of vanillanote is required.`);
        if (id) {
          if (idMap.has(id)) {
            throw new Error(`Duplicate vanillanote id detected: ${id}`);
          } else {
            idMap.set(id, true);
          }
        }
    });
    
    //cssText ==> 최종 정리 후 마지막에 document에 추가
    let cssText = "";
    cssText = cssText + "@keyframes vanillanote-modal-input {0%{width: 30%;}100%{width: 80%;}}\n";
    cssText = cssText + "@keyframes vanillanote-modal-small-input {0%{width: 0%;}100%{width: 20%;}}\n";
    
    //create note
    notes.forEach((note) => {
        const noteId = note.getAttribute('data-id')!;
        console.log(noteId);
        const vanillanote: VanillanoteElement = note as VanillanoteElement;
        vanillanote.setAttribute('id', getId(vn.variables.noteName, noteId, 'note'));
        vanillanote.setAttribute('class', getClassName(vn.variables.noteName, noteId, 'note'));
        vanillanote._noteName = vn.variables.noteName;
        vanillanote._id = noteId;
        vanillanote._vn = vn;


        vn.vanillanoteElements[noteId] = createNote(vn, vanillanote, noteId);
    });

    //document, window event 등록
    /*
    vn.documentEvents.selectionchange = (event: Event) => {
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
    
}

const createNote = (vn: Vanillanote, note: VanillanoteElement, noteId: string): VanillanoteElement => {
    //변수 정의
    const isIOS = getIsIOS();

    //속성 정의
    const noteAttributes = getNoteAttribute(vn, note);
    
    //색상 정의
    const noteColors = getNoteColors(vn, noteAttributes);

    //CSS 최종 정의
    const csses: Csses = getCsses(noteAttributes, noteColors);

    //event 정의
    setNoteEvent(note);

    //element 생성
    //export const createElement = function(element: any, elementTag: string, id: string, className: string, idx: number, appendNodeSetObject?: any) {
    //export const createElement = function(elementTag: string, noteName: string, noteId: string, id: string, className: string, appendNodeSetObject?: any) {
    const noteName = vn.variables.noteName;

    //template
    const template = createElement("div", noteName, noteId, vn.consts.CLASS_NAMES.template.id, vn.consts.CLASS_NAMES.template.className);
    template.style.display = "none";

    //textarea
    const textarea = createElementBasic(
        vn.variables.noteName+"-textarea",
        noteName,
        noteId,
        vn.consts.CLASS_NAMES.textarea.id,
        vn.consts.CLASS_NAMES.textarea.className,
        note._elementsEvents,
        note._cssEvents
    );
    textarea.setAttribute("contenteditable",true);
    textarea.setAttribute("role","textbox");
    textarea.setAttribute("aria-multiline",true);
    textarea.setAttribute("spellcheck",true);
    textarea.setAttribute("autocorrect",true);
    textarea.setAttribute("name",getId(noteName, noteId, vn.consts.CLASS_NAMES.textarea.id));
    textarea.setAttribute("title", vn.languageSet[noteAttributes.language].textareaTooltip);
    textarea.addEventListener("focus", function(event: any) {
        if(!note._elementsEvents.textarea_onBeforeFocus(event)) return;
        elementsEvent["textarea_onFocus"](event);
        note._elementsEvents.textarea_onAfterFocus(event);
        event.stopImmediatePropagation();
    });
    textarea.addEventListener(isIOS ? "mouseout" : "blur", function(event: any) {
        if(!note._elementsEvents.textarea_onBeforeBlur(event)) return;
        elementsEvent["textarea_onBlur"](event);
        note._elementsEvents.textarea_onAfterBlur(event);
        event.stopImmediatePropagation();
    });
    textarea.addEventListener("keydown", function(event: any) {
        elementsEvent["textarea_onKeydown"](event);
        event.stopImmediatePropagation();
    });
    textarea.addEventListener("keyup", function(event: any) {
        elementsEvent["textarea_onKeyup"](event);
        event.stopImmediatePropagation();
    });
    textarea.addEventListener("beforeinput", function(event: any) {
        elementsEvent["textarea_onBeforeinput"](event);
        event.stopImmediatePropagation();
    });
    note_observer.observe(textarea, vn.variables.observerOptions);
    initTextarea(textarea);

    //tool
    const tool = createElement("div",  noteName, noteId, vn.consts.CLASS_NAMES.tool.id, vn.consts.CLASS_NAMES.tool.className);
    //tool toggle
    const toolToggleButton = createElementButton(
        "span",
        noteName,
        noteId,
        vn.consts.CLASS_NAMES.toolToggleButton.id,
        vn.consts.CLASS_NAMES.toolToggleButton.className,
        note._elementsEvents,
        note._cssEvents,
        {"isIcon":true, "text":"arrow_drop_down"}
    );

    //paragraph style
    const paragraphStyleSelect = createElementSelect(
        "span",
        noteName,
        noteId,
        vn.consts.CLASS_NAMES.paragraphStyleSelect.id,
        vn.consts.CLASS_NAMES.paragraphStyleSelect.className,
        note._elementsEvents,
        note._cssEvents,
        {"isIcon":true, "text":"auto_fix_high"}
    );
    paragraphStyleSelect.setAttribute("title", vn.languageSet[noteAttributes.language].styleTooltip);
    const paragraphStyleSelectBox = createElement(
        "div",
        noteName,
        noteId,
        vn.consts.CLASS_NAMES.paragraphStyleSelectBox.id,
        vn.consts.CLASS_NAMES.paragraphStyleSelectBox.className,
    );
    paragraphStyleSelect.appendChild(paragraphStyleSelectBox);
    const paragraphStyleNormalButton = createElementButton(
        "div",
        noteName,
        noteId,
        vn.consts.CLASS_NAMES.styleNomal.id,
        vn.consts.CLASS_NAMES.styleNomal.className,
        note._elementsEvents,
        note._cssEvents,
        {"isIcon":false, "text":"Normal"}
    );
    paragraphStyleNormalButton.setAttribute("data-tag-name","p");
    paragraphStyleSelectBox.appendChild(paragraphStyleNormalButton);
    const paragraphStyleHeader1Button = createElementButton(
        "h1",
        noteName,
        noteId,
        vn.consts.CLASS_NAMES.styleHeader1.id,
        vn.consts.CLASS_NAMES.styleHeader1.className,
        note._elementsEvents,
        note._cssEvents,
        {"isIcon":false, "text":"Header1"}
    );
    paragraphStyleHeader1Button.setAttribute("data-tag-name","H1");
    paragraphStyleSelectBox.appendChild(paragraphStyleHeader1Button);
    const paragraphStyleHeader2Button = createElementButton(
        "h2",
        noteName,
        noteId,
        vn.consts.CLASS_NAMES.styleHeader2.id,
        vn.consts.CLASS_NAMES.styleHeader2.className,
        note._elementsEvents,
        note._cssEvents,
        {"isIcon":false, "text":"Header2"}
    );
    paragraphStyleHeader2Button.setAttribute("data-tag-name","H2");
    paragraphStyleSelectBox.appendChild(paragraphStyleHeader2Button);
    const paragraphStyleHeader3Button = createElementButton(
        "h3",
        noteName,
        noteId,
        vn.consts.CLASS_NAMES.styleHeader3.id,
        vn.consts.CLASS_NAMES.styleHeader3.className,
        note._elementsEvents,
        note._cssEvents,
        {"isIcon":false, "text":"Header3"}
    );
    paragraphStyleHeader3Button.setAttribute("data-tag-name","H3");
    paragraphStyleSelectBox.appendChild(paragraphStyleHeader3Button);
    const paragraphStyleHeader4Button = createElementButton(
        "h4",
        noteName,
        noteId,
        vn.consts.CLASS_NAMES.styleHeader4.id,
        vn.consts.CLASS_NAMES.styleHeader4.className,
        note._elementsEvents,
        note._cssEvents,
        {"isIcon":false, "text":"Header4"}
    );
    paragraphStyleHeader4Button.setAttribute("data-tag-name","H4");
    paragraphStyleSelectBox.appendChild(paragraphStyleHeader4Button);
    const paragraphStyleHeader5Button = createElementButton(
        "h5",
        noteName,
        noteId,
        vn.consts.CLASS_NAMES.styleHeader5.id,
        vn.consts.CLASS_NAMES.styleHeader5.className,
        note._elementsEvents,
        note._cssEvents,
        {"isIcon":false, "text":"Header5"}
    );
    paragraphStyleHeader5Button.setAttribute("data-tag-name","H5");
    paragraphStyleSelectBox.appendChild(paragraphStyleHeader5Button);
    const paragraphStyleHeader6Button = createElementButton(
        "h6",
        noteName,
        noteId,
        vn.consts.CLASS_NAMES.styleHeader6.id,
        vn.consts.CLASS_NAMES.styleHeader6.className,
        note._elementsEvents,
        note._cssEvents,
        {"isIcon":false, "text":"Header6"}
    );
    paragraphStyleHeader6Button.setAttribute("data-tag-name","H6");
    paragraphStyleSelectBox.appendChild(paragraphStyleHeader6Button);

    //bold
    const boldButton = createElementButton(
        "span",
        noteName,
        noteId,
        vn.consts.CLASS_NAMES.boldButton.id,
        vn.consts.CLASS_NAMES.boldButton.className,
        note._elementsEvents,
        note._cssEvents,
        {"isIcon":true, "text":"format_bold"}
    );
    boldButton.setAttribute("title", vn.languageSet[noteAttributes.language].boldTooltip);
    //under-line
    const underlineButton = createElementButton(
        "span",
        noteName,
        noteId,
        vn.consts.CLASS_NAMES.underlineButton.id,
        vn.consts.CLASS_NAMES.underlineButton.className,
        note._elementsEvents,
        note._cssEvents,
        {"isIcon":true, "text":"format_underlined"}
    );
    underlineButton.setAttribute("title", vn.languageSet[noteAttributes.language].underlineTooltip);
    //italic
    const italicButton = createElementButton(
        "span",
        noteName,
        noteId,
        vn.consts.CLASS_NAMES.italicButton.id,
        vn.consts.CLASS_NAMES.italicButton.className,
        note._elementsEvents,
        note._cssEvents,
        {"isIcon":true, "text":"format_italic"}
    );
    italicButton.setAttribute("title", vn.languageSet[noteAttributes.language].italicTooltip);
    //ul
    const ulButton = createElementButton(
        "span",
        noteName,
        noteId,
        vn.consts.CLASS_NAMES.ulButton.id,
        vn.consts.CLASS_NAMES.ulButton.className,
        note._elementsEvents,
        note._cssEvents,
        {"isIcon":true, "text":"format_list_bulleted"}
    );
    ulButton.setAttribute("title", vn.languageSet[noteAttributes.language].ulTooltip);
    ulButton.setAttribute("data-tag-name","UL");
    //ol
    const olButton = createElementButton(
        "span",
        noteName,
        noteId,
        vn.consts.CLASS_NAMES.olButton.id,
        vn.consts.CLASS_NAMES.olButton.className,
        note._elementsEvents,
        note._cssEvents,
        {"isIcon":true, "text":"format_list_numbered"}
    );
    olButton.setAttribute("title", vn.languageSet[noteAttributes.language].olTooltip);
    olButton.setAttribute("data-tag-name","OL");

    //text-align
    const textAlignSelect = createElementSelect(
        "span",
        noteName,
        noteId,
        vn.consts.CLASS_NAMES.textAlignSelect.id,
        vn.consts.CLASS_NAMES.textAlignSelect.className,
        note._elementsEvents,
        note._cssEvents,
        {"isIcon":true, "text":"notes"}
    );
    textAlignSelect.setAttribute("title", vn.languageSet[noteAttributes.language].textAlignTooltip);
    const textAlignSelectBox = createElement(
        "div",
        noteName,
        noteId,
        vn.consts.CLASS_NAMES.textAlignSelectBox.id,
        vn.consts.CLASS_NAMES.textAlignSelectBox.className,
    );
    textAlignSelect.appendChild(textAlignSelectBox);
    const textAlignLeftButton = createElementButton(
        "span",
        noteName,
        noteId,
        vn.consts.CLASS_NAMES.textAlignLeft.id,
        vn.consts.CLASS_NAMES.textAlignLeft.className,
        note._elementsEvents,
        note._cssEvents,
        {"isIcon":true, "text":"format_align_left"}
    );
    textAlignLeftButton.setAttribute("data-tag-style","text-align:left;");
    textAlignSelectBox.appendChild(textAlignLeftButton);
    const textAlignCenterButton = createElementButton(
        "span",
        noteName,
        noteId,
        vn.consts.CLASS_NAMES.textAlignCenter.id,
        vn.consts.CLASS_NAMES.textAlignCenter.className,
        note._elementsEvents,
        note._cssEvents,
        {"isIcon":true, "text":"format_align_center"}
    );
    textAlignCenterButton.setAttribute("data-tag-style","text-align:center;");
    textAlignSelectBox.appendChild(textAlignCenterButton);
    const textAlignRightButton = createElementButton(
        "span",
        noteName,
        noteId,
        vn.consts.CLASS_NAMES.textAlignRight.id,
        vn.consts.CLASS_NAMES.textAlignRight.className,
        note._elementsEvents,
        note._cssEvents,
        {"isIcon":true, "text":"format_align_right"}
    );
    textAlignRightButton.setAttribute("data-tag-style","text-align:right;");
    textAlignSelectBox.appendChild(textAlignRightButton);

    //att link
    const attLinkButton = createElementButton(
        "span",
        noteName,
        noteId,
        vn.consts.CLASS_NAMES.attLinkButton.id,
        vn.consts.CLASS_NAMES.attLinkButton.className,
        note._elementsEvents,
        note._cssEvents,
        {"isIcon":true, "text":"link"}
    );
    attLinkButton.setAttribute("title", vn.languageSet[noteAttributes.language].attLinkTooltip);
    //att file
    const attFileButton = createElementButton(
        "span",
        noteName,
        noteId,
        vn.consts.CLASS_NAMES.attFileButton.id,
        vn.consts.CLASS_NAMES.attFileButton.className,
        note._elementsEvents,
        note._cssEvents,
        {"isIcon":true, "text":"attach_file"}
    );
    attFileButton.setAttribute("title", vn.languageSet[noteAttributes.language].attFileTooltip);
    //att image
    const attImageButton = createElementButton(
        "span",
        noteName,
        noteId,
        vn.consts.CLASS_NAMES.attImageButton.id,
        vn.consts.CLASS_NAMES.attImageButton.className,
        note._elementsEvents,
        note._cssEvents,
        {"isIcon":true, "text":"image"}
    );
    attImageButton.setAttribute("title", vn.languageSet[noteAttributes.language].attImageTooltip);
    //att video
    const attVideoButton = createElementButton(
        "span",
        noteName,
        noteId,
        vn.consts.CLASS_NAMES.attVideoButton.id,
        vn.consts.CLASS_NAMES.attVideoButton.className,
        note._elementsEvents,
        note._cssEvents,
        {"isIcon":true, "text":"videocam"}
    );
    attVideoButton.setAttribute("title", vn.languageSet[noteAttributes.language].attVideoTooltip);
    
    //font size
    const fontSizeInputBox = createElementButton(
        "span",
        noteName,
        noteId,
        vn.consts.CLASS_NAMES.fontSizeInputBox.id,
        vn.consts.CLASS_NAMES.fontSizeInputBox.className,
        note._elementsEvents,
        note._cssEvents,
        {"isIcon":true, "text":"format_size"}
    );
    const fontSizeInput = createElementInput(
        noteName,
        noteId,
        vn.consts.CLASS_NAMES.fontSizeInput.id,
        vn.consts.CLASS_NAMES.fontSizeInput.className,
        note._elementsEvents,
    );
    fontSizeInput.setAttribute("type","number");
    fontSizeInput.setAttribute("title", vn.languageSet[noteAttributes.language].fontSizeTooltip);
    addClickEvent(
        fontSizeInput,
        vn.consts.CLASS_NAMES.fontSizeInput.id,
        noteName,
        note._elementsEvents,
        note._cssEvents,
    );
    fontSizeInputBox.appendChild(fontSizeInput);
    //letter spacing
    const letterSpacingInputBox = createElementButton(
        "span",
        noteName,
        noteId,
        vn.consts.CLASS_NAMES.letterSpacingInputBox.id,
        vn.consts.CLASS_NAMES.letterSpacingInputBox.className,
        note._elementsEvents,
        note._cssEvents,
        {"isIcon":true, "text":"swap_horiz"}
    );
    const letterSpacingInput = createElementInput(
        noteName,
        noteId,
        vn.consts.CLASS_NAMES.letterSpacingInput.id,
        vn.consts.CLASS_NAMES.letterSpacingInput.className,
        note._elementsEvents,
    );
    letterSpacingInput.setAttribute("type","number");
    letterSpacingInput.setAttribute("title", vn.languageSet[noteAttributes.language].letterSpacingTooltip);
    addClickEvent(
        letterSpacingInput,
        vn.consts.CLASS_NAMES.letterSpacingInput.id,
        noteName,
        note._elementsEvents,
        note._cssEvents,
    );
    letterSpacingInputBox.appendChild(letterSpacingInput);
    //line height
    const lineHeightInputBox = createElementButton(
        "span",
        noteName,
        noteId,
        vn.consts.CLASS_NAMES.lineHeightInputBox.id,
        vn.consts.CLASS_NAMES.lineHeightInputBox.className,
        note._elementsEvents,
        note._cssEvents,
        {"isIcon":true, "text":"height"}
    );
    const lineHeightInput = createElementInput(
        noteName,
        noteId,
        vn.consts.CLASS_NAMES.lineHeightInput.id,
        vn.consts.CLASS_NAMES.lineHeightInput.className,
        note._elementsEvents,
    );
    lineHeightInput.setAttribute("type","number");
    lineHeightInput.setAttribute("title", vn.languageSet[noteAttributes.language].lineHeightTooltip);
    addClickEvent(
        lineHeightInput,
        vn.consts.CLASS_NAMES.lineHeightInput.id,
        noteName,
        note._elementsEvents,
        note._cssEvents,
    );
    lineHeightInputBox.appendChild(lineHeightInput);
    
    //font style(font family)
    const fontFamilySelect = createElementSelect(
        "span",
        noteName,
        noteId,
        vn.consts.CLASS_NAMES.fontFamilySelect.id,
        vn.consts.CLASS_NAMES.fontFamilySelect.className,
        note._elementsEvents,
        note._cssEvents,
        {
            "isIcon" : false,
            "text" : noteAttributes.defaultTextareaFontFamily.length > 12 
                    ? noteAttributes.defaultTextareaFontFamily.substr(0,12) + "..." : noteAttributes.defaultTextareaFontFamily
        }
    );
    fontFamilySelect.setAttribute("style","font-family:" + noteAttributes.defaultTextareaFontFamily + ";");
    fontFamilySelect.setAttribute("title", vn.languageSet[noteAttributes.language].fontFamilyTooltip);
    const fontFamilySelectBox = createElement(
        "div",
        noteName,
        noteId,
        vn.consts.CLASS_NAMES.fontFamilySelectBox.id,
        vn.consts.CLASS_NAMES.fontFamilySelectBox.className,
    );
    fontFamilySelect.appendChild(fontFamilySelectBox);
    
    for(var fontIdx = 0; fontIdx < noteAttributes.defaultFontFamilies.length; fontIdx++) {
        const tempElement = createElementFontFamiliySelect(
            "div",
            noteName,
            noteId,
            vn.consts.CLASS_NAMES.fontFamily.id + fontIdx,
            vn.consts.CLASS_NAMES.fontFamily.className,
            {"isIcon":false, "text":defaultFontFamilies[fontIdx]}
        );
        tempElement.setAttribute("data-font-family",defaultFontFamilies[fontIdx]);
        tempElement.setAttribute("style", "font-family:" + defaultFontFamilies[fontIdx] + ";");
        fontFamilySelectBox.appendChild(tempElement);
    }

    //element 정의
    note._elements = {
        template : template,
        textarea : textarea,
        tool : tool,
        toolToggleButton : toolToggleButton,
        paragraphStyleSelect : paragraphStyleSelect,
        paragraphStyleSelectBox : paragraphStyleSelectBox,
        paragraphStyleNormalButton : paragraphStyleNormalButton,
        paragraphStyleHeader2Button : paragraphStyleHeader2Button,
        paragraphStyleHeader3Button : paragraphStyleHeader3Button,
        paragraphStyleHeader4Button : paragraphStyleHeader4Button,
        paragraphStyleHeader5Button : paragraphStyleHeader5Button,
        paragraphStyleHeader6Button : paragraphStyleHeader6Button,
        boldButton : boldButton,
        underlineButton : underlineButton,
        italicButton : italicButton,
        ulButton : ulButton,
        olButton : olButton,
        textAlignSelect : textAlignSelect,
        textAlignSelectBox : textAlignSelectBox,
        textAlignLeftButton : textAlignLeftButton,
        textAlignCenterButton : textAlignCenterButton,
        textAlignRightButton : textAlignRightButton,
        attLinkButton : attLinkButton,
        attFileButton : attFileButton,
        attImageButton : attImageButton,
        attVideoButton : attVideoButton,

    }

    note._selection = {
        editSelection : null,
        editRange : null,
        startOffset : null,
        endOffset : null,
        editStartNode : null,
        editEndNode : null,
        editStartElement : null,
        editEndElement : null,
        editStartUnitElement : null,
        editEndUnitElement : null,
        editDragUnitElement : [],
        setEditStyleTagToggle : 0,
    };
    note._noteStatus = {
        toolPosition : ToolPositions.top,
        toolDefaultLine : 1,
        toolToggle : false,
        boldToggle : false,
        underlineToggle : false,
        italicToggle : false,
        ulToggle : false,
        olToggle : false,
        fontSize : "",
        letterSpacing : "",
        lineHeight : "",
        fontFamilie : "",
        colorTextR : "",
        colorTextG : "",
        colorTextB : "",
        colorTextO : "",
        colorTextRGB : "",
        colorTextOpacity : "",
        colorBackR : "",
        colorBackG : "",
        colorBackB : "",
        colorBackO : "",
        colorBackRGB : "",
        colorBackOpacity : "",
    };
    note._attFiles = {};
    note._attImages = {};
    note._records = {
        recodeNotes : [],
        recodeConting : 0,
        recodeLimit : 100,
    };

    note._getNoteData = () => {
        return {
            //임시
            textarea: document.createElement('textarea'),
            files: note._attFiles
        }
    };
    note._setNoteData = (data: HTMLTextAreaElement) => {};

    return note;
}

const getNoteAttribute = (vn: Vanillanote, note: VanillanoteElement): NoteAttributes => {
    //속성 정리
    //note mode by device
    let noteModeByDevice = note.getAttribute("note-mode-by-device") && ["ADAPTIVE", "MOBILE", "DESKTOP"].indexOf(note.getAttribute("note-mode-by-device")!)
     ? note.getAttribute("note-mode-by-device")!.toUpperCase() as NoteModesByDevice : vn.attributes.noteModeByDevice;
    //현재 디바이스가 모바일인지 한번 더 체크
    const isNoteByMobile = noteModeByDevice === "MOBILE" ? true
         : noteModeByDevice === "DESKTOP" ? false
         : isMobileDevice();
    let toolPositions = note.getAttribute("tool-position") && ["BOTTOM", "TOP"].indexOf(note.getAttribute("tool-position")!) >= 0
     ? note.getAttribute("tool-position") as ToolPositions : (isNoteByMobile ? ToolPositions.bottom : ToolPositions.top);
    let toolDefaultLines = checkNumber(note.getAttribute("tool-default-line")) ? Number(note.getAttribute("tool-default-line")) : (isNoteByMobile ? 2 : 1);
    let toolToggles = note.getAttribute("tool-toggle") ? note.getAttribute("tool-toggle")!.toUpperCase() === "true" : (isNoteByMobile ? true : false);

    //text area size
    let textareaOriginWidths = note.getAttribute("textarea-width") ? note.getAttribute("textarea-width")! : vn.attributes.textareaOriginWidths;
    let textareaOriginHeights = note.getAttribute("textarea-height") ? note.getAttribute("textarea-height")! : vn.attributes.textareaOriginHeights;
    let textareaMaxWidth = note.getAttribute("textarea-max-width") ? note.getAttribute("textarea-max-width")! : vn.attributes.textareaMaxWidth;
    let textareaMaxHeight = note.getAttribute("textarea-max-height") ? note.getAttribute("textarea-max-height")! : vn.attributes.textareaMaxHeight;
    let textareaHeightIsModify =note.getAttribute("textarea-height-isModify") ? note.getAttribute("textarea-height-isModify")!.toUpperCase() === "true" : vn.attributes.textareaHeightIsModify;

    //placeholder
    let placeholderIsVisible = note.getAttribute("placeholder-is-visible") ? note.getAttribute("placeholder-is-visible")!.toUpperCase() === "true" : vn.attributes.placeholderIsVisible;
    let placeholderAddTop = checkRealNumber(note.getAttribute("placeholder-add-top")) ? Number(note.getAttribute("placeholder-add-top")) : vn.attributes.placeholderAddTop;
    let placeholderAddLeft = checkRealNumber(note.getAttribute("placeholder-add-left")) ? Number(note.getAttribute("placeholder-add-left")) : vn.attributes.placeholderAddLeft;
    let placeholderWidth = note.getAttribute("placeholder-width") ? note.getAttribute("placeholder-width")! : vn.attributes.placeholderWidth;
    let placeholderColor = note.getAttribute("placeholder-color") ? note.getAttribute("placeholder-color")! : vn.attributes.placeholderColor;
    let placeholderBackgroundColor = note.getAttribute("placeholder-background-color") ? note.getAttribute("placeholder-background-color")! : vn.attributes.placeholderBackgroundColor;
    let placeholderTitle = note.getAttribute("placeholder-title") ? note.getAttribute("placeholder-title")! : vn.attributes.placeholderTitle;
    let placeholderTextContent = note.getAttribute("placeholder-text-content") ? note.getAttribute("placeholder-text-content")! : vn.attributes.placeholderTextContent;

    //attFile
    let attFilePreventTypes = note.getAttribute("att-file-prevent-types") ? note.getAttribute("att-file-prevent-types")!.split(",") : vn.attributes.attFilePreventTypes;
    let attFileAcceptTypes = note.getAttribute("att-file-accept-types") ? note.getAttribute("att-file-accept-types")!.split(",") : vn.attributes.attFileAcceptTypes;
    let attFileMaxSizes = checkNumber(note.getAttribute("att-file-max-size")) ? Number(note.getAttribute("att-file-max-size")) : vn.attributes.attFileMaxSizes;
    let attImagePreventTypes = note.getAttribute("att-image-prevent-types") ? note.getAttribute("att-image-prevent-types")!.split(",") : vn.attributes.attImagePreventTypes;
    let attImageAcceptTypes = note.getAttribute("att-image-accept-types") ? note.getAttribute("att-image-accept-types")!.split(",") :  vn.attributes.attImageAcceptTypes;
    let attImageMaxSizes = checkNumber(note.getAttribute("att-image-max-size")) ? Number(note.getAttribute("att-image-max-size")) : vn.attributes.attImageMaxSizes;

    //font style(font family)
    let defaultFontFamilies = vn.attributes.defaultFontFamilies;
    let addFontFamilies = note.getAttribute("add-font-family") ? note.getAttribute("add-font-family")!.split(",") : [];
    let removeFontFamilies = note.getAttribute("remove-font-family") ? note.getAttribute("remove-font-family")!.split(",") : [];
    //add font
    for(var addFontIdx = 0; addFontIdx < addFontFamilies.length; addFontIdx++) {
        const tempFontFamiliy = addFontFamilies[addFontIdx];
        if(!addFontFamilies[addFontIdx]) continue;
        
        if(!defaultFontFamilies.includes(addFontFamilies[addFontIdx])) {
            // If the comment is already in English, add the translation in italics after the English version.
            if(checkAlphabetAndNumber(addFontFamilies[addFontIdx])) {
                defaultFontFamilies.splice(7 + addFontIdx, 0, addFontFamilies[addFontIdx]);
            }
            else {	// For other comments, add the translation at the end.
                defaultFontFamilies.push(addFontFamilies[addFontIdx]);
            }
        }
    }
    //remove font
    for(var removeFontIdx = 0; removeFontIdx < removeFontFamilies.length; removeFontIdx++) {
        if(!removeFontFamilies[removeFontIdx]) continue;
        defaultFontFamilies = defaultFontFamilies.filter(function(fontFamily: string) {
            return fontFamily !== removeFontFamilies[removeFontIdx];
        })
    }

    let defaultTextareaFontFamily = note.getAttribute("default-font-family") ? note.getAttribute("default-font-family")! : vn.attributes.defaultTextareaFontFamily;
    // If the default font-family is not set, insert it.
    if(!defaultFontFamilies.includes(defaultTextareaFontFamily)) {
        defaultFontFamilies.splice(0,0,defaultTextareaFontFamily);
    }
    let defaultToolFontFamily = note.getAttribute("default-tool-font-family") ? note.getAttribute("default-tool-font-family")! : vn.attributes.defaultToolFontFamily;
    let defaultTextareaFontSize = note.getAttribute("default-font-size") ? note.getAttribute("default-font-size")! : vn.attributes.defaultTextareaFontSize;
    let defaultTextareaLineHeight = note.getAttribute("default-line-height") ? note.getAttribute("default-line-height")! : vn.attributes.defaultTextareaLineHeight;

    //size
    let sizeLevelDesktop = checkNumber(note.getAttribute("size-level-desktop")) ? Number(note.getAttribute("size-level-desktop")) : 3;
    let sizeLevelMobile = checkNumber(note.getAttribute("size-level-mobile")) ? Number(note.getAttribute("size-level-mobile")) : 7;
    // 디바이스에 따라 변경
    let sizeLevel = isNoteByMobile ? sizeLevelMobile : sizeLevelDesktop;
    //min, max
    if(sizeLevel < 1) sizeLevel = 1;
    if(sizeLevel > 9) sizeLevel = 9;
    const sizeRate = (sizeLevel + 11) / 20;

    //Color
    let mainColor = note.getAttribute("main-color") ? getHexColorFromColorName(note.getAttribute("main-color")!) : vn.attributes.mainColor;
    let colorSet = note.getAttribute("color-set") ? note.getAttribute("color-set")!.toLowerCase() : vn.attributes.colorSet;
    let invertColor = note.getAttribute("invert-color") ?  note.getAttribute("invert-color") === "true" : vn.attributes.invertColor;

    //using tool function
    let usingParagraphStyle = note.getAttribute("using-paragraph-style") === "false" ? false : vn.attributes.usingParagraphStyle;
    let usingBold = note.getAttribute("using-bold") === "false" ? false : vn.attributes.usingBold;
    let usingUnderline = note.getAttribute("using-underline") === "false" ? false : vn.attributes.usingUnderline;
    let usingItalic = note.getAttribute("using-italic") === "false" ? false : vn.attributes.usingItalic;
    let usingUl = note.getAttribute("using-ul") === "false" ? false : vn.attributes.usingUl;
    let usingOl = note.getAttribute("using-ol") === "false" ? false : vn.attributes.usingOl;
    let usingTextAlign = note.getAttribute("using-text-align") === "false" ? false : vn.attributes.usingTextAlign;
    let usingAttLink = note.getAttribute("using-att-link") === "false" ? false : vn.attributes.usingAttLink;
    let usingAttFile = note.getAttribute("using-att-file") === "false" ? false : vn.attributes.usingAttFile;
    let usingAttImage = note.getAttribute("using-att-image") === "false" ? false : vn.attributes.usingAttImage;
    let usingAttVideo = note.getAttribute("using-att-video") === "false" ? false : vn.attributes.usingAttVideo;
    let usingFontSize = note.getAttribute("using-font-size") === "false" ? false : vn.attributes.usingFontSize;
    let usingLetterSpacing = note.getAttribute("using-letter-spacing") === "false" ? false : vn.attributes.usingLetterSpacing;
    let usingLineHeight = note.getAttribute("using-line-height") === "false" ? false : vn.attributes.usingLineHeight;
    let usingFontFamily = note.getAttribute("using-font-family") === "false" ? false : vn.attributes.usingFontFamily;
    let usingColorText = note.getAttribute("using-color-text") === "false" ? false : vn.attributes.usingColorText;
    let usingColorBack = note.getAttribute("using-color-back") === "false" ? false : vn.attributes.usingColorBack;
    let usingFormatClear = note.getAttribute("using-format-clear") === "false" ? false : vn.attributes.usingFormatClear;
    let usingUndo = note.getAttribute("using-undo") === "false" ? false : vn.attributes.usingUndo;
    let usingRedo = note.getAttribute("using-redo") === "false" ? false : vn.attributes.usingRedo;
    let usingHelp = note.getAttribute("using-help") === "false" ? false : vn.attributes.usingHelp;
    if(note.getAttribute("using-paragraph-all-style") === "false") {
        usingParagraphStyle = false;
        usingUl = false;
        usingOl = false;
        usingTextAlign = false;
    }
    if(note.getAttribute("using-character-style") === "false") {
        usingBold = false;
        usingUnderline = false;
        usingItalic = false;
        usingFontFamily = false;
        usingColorText = false;
        usingColorBack = false;
        usingFormatClear = false;
    }
    if(note.getAttribute("using-character-size") === "false") {
        usingFontSize = false;
        usingLetterSpacing = false;
        usingLineHeight = false;
    }
    if(note.getAttribute("using-attach-file") === "false") {
        usingAttLink = false;
        usingAttFile = false;
        usingAttImage = false;
        usingAttVideo = false;
    }
    if(note.getAttribute("using-do") === "false") {
        usingUndo = false;
        usingRedo = false;
    }

    //language
    let language = note.getAttribute("language") && vn.languageSet.hasOwnProperty(note.getAttribute("language")!) ? note.getAttribute("language")! : vn.attributes.language;

    //recode
    let recodeLimit = checkNumber(note.getAttribute("recode-limit")) ? Number(note.getAttribute("recode-limit")) : vn.attributes.recodeLimit;

    return {
        isNoteByMobile : isNoteByMobile,
        toolPositions :toolPositions,
        toolDefaultLines : toolDefaultLines,
        toolToggles : toolToggles,
        sizeRate : sizeRate,

        noteModeByDevice : noteModeByDevice,
        textareaOriginWidths : textareaOriginWidths,
        textareaOriginHeights : textareaOriginHeights,
        textareaMaxWidth : textareaMaxWidth,
        textareaMaxHeight : textareaMaxHeight,
        textareaHeightIsModify : textareaHeightIsModify,

        placeholderIsVisible : placeholderIsVisible,
        placeholderAddTop : placeholderAddTop,
        placeholderAddLeft : placeholderAddLeft,
        placeholderWidth : placeholderWidth,
        placeholderColor : placeholderColor,
        placeholderBackgroundColor : placeholderBackgroundColor,
        placeholderTitle : placeholderTitle,
        placeholderTextContent : placeholderTextContent,

        attFilePreventTypes : attFilePreventTypes,
        attFileAcceptTypes : attFileAcceptTypes,
        attFileMaxSizes : attFileMaxSizes,
        attImagePreventTypes : attImagePreventTypes,
        attImageAcceptTypes : attImageAcceptTypes,
        attImageMaxSizes : attImageMaxSizes,

        defaultFontFamilies : defaultFontFamilies,
        defaultTextareaFontFamily : defaultTextareaFontFamily,
        defaultToolFontFamily : defaultToolFontFamily,
        defaultTextareaFontSize : defaultTextareaFontSize,
        defaultTextareaLineHeight : defaultTextareaLineHeight,

        sizeLevelDesktop : sizeLevelDesktop,
        sizeLevelMobile : sizeLevelMobile,

        mainColor : mainColor,
        colorSet : colorSet,
        invertColor : invertColor,

        usingParagraphStyle : usingParagraphStyle,
        usingBold : usingBold,
        usingUnderline : usingUnderline,
        usingItalic : usingItalic,
        usingUl : usingUl,
        usingOl : usingOl,
        usingTextAlign : usingTextAlign,
        usingAttLink : usingAttLink,
        usingAttFile : usingAttFile,
        usingAttImage : usingAttImage,
        usingAttVideo : usingAttVideo,
        usingFontSize : usingFontSize,
        usingLetterSpacing : usingLetterSpacing,
        usingLineHeight : usingLineHeight,
        usingFontFamily : usingFontFamily,
        usingColorText : usingColorText,
        usingColorBack : usingColorBack,
        usingFormatClear : usingFormatClear,
        usingUndo : usingUndo,
        usingRedo : usingRedo,
        usingHelp : usingHelp,

        language : language,
        recodeLimit : recodeLimit,
    }
};

const getNoteColors = (vn: Vanillanote, noteAttributes: NoteAttributes): Colors => {
    let noteColors: Colors = {
        color1 : vn.colors.color1,
        color2 : vn.colors.color2,
        color3 : vn.colors.color3,
        color4 : vn.colors.color4,
        color5 : vn.colors.color5,
        color6 : vn.colors.color6,
        color7 : vn.colors.color7,
        color8 : vn.colors.color8,
        color9 : vn.colors.color9,
        color10 : vn.colors.color10,
        color11 : vn.colors.color11,
        color12 : vn.colors.color12,
        color13 : vn.colors.color13,
        color14 : vn.colors.color14,
        color15 : vn.colors.color15,
        color16 : vn.colors.color16,
        color17 : vn.colors.color17,
        color18 : vn.colors.color18,
        color19 : vn.colors.color19,
        color20 : vn.colors.color20,
    }
    if(noteAttributes.mainColor) {
        noteColors = getColors(noteAttributes.mainColor);
    }
    else {
        switch(noteAttributes.colorSet) {
            case "skyblue":
                noteColors = getColors("#91c8e4");
                break;
            case "blue":
                noteColors = getColors("#4682a9");
                break;
            case "light-red" :
                noteColors = getColors("#fdd2bf");
                break;
            case "red" :
                noteColors = getColors("#b61919");
                break;
            case "light-green" :
                noteColors = getColors("#a4be7b");
                break;
            case "green" :
                noteColors = getColors("#285430");
                break;
            case "orange" :
                noteColors = getColors("#f79327");
                break;
            case "yellow" :
                noteColors = getColors("#ffe569");
                break;
            case "purple" :
                noteColors = getColors("#804674");
                break;
            case "brown" :
                noteColors = getColors("#675d50");
                break;
            case "black" :
                noteColors = getColors("#272829");
                break;
            default :
                break;
        }
    }
    if(noteAttributes.invertColor) {
        noteColors.color1 = getInvertColor(noteColors.color1);
        noteColors.color2 = getInvertColor(noteColors.color2);
        noteColors.color3 = getInvertColor(noteColors.color3);
        noteColors.color4 = getInvertColor(noteColors.color4);
        noteColors.color5 = getInvertColor(noteColors.color5);
        noteColors.color6 = getInvertColor(noteColors.color6);
        noteColors.color7 = getInvertColor(noteColors.color7);
        noteColors.color10 = getInvertColor(noteColors.color10);
        noteColors.color11 = getInvertColor(noteColors.color11);
        noteColors.color12 = getInvertColor(noteColors.color12);
        noteColors.color13 = getInvertColor(noteColors.color13);
    }
    return noteColors;
}

const getCsses =(noteAttributes: NoteAttributes, noteColors: Colors): Csses => {
    if(!noteAttributes) throw new Error("Please insert variables object in VanillanoteConfig.");
    if(!noteColors) throw new Error("Please insert colors object in VanillanoteConfig.");
    const sizeRates = (noteAttributes.sizeLevelDesktop + 11) / 20;
    
    const csses: Csses = {
        "template h1" : {
            "display" : "block",
            "font-size" : "2em",
            "line-height" : "1.2em",
            "font-weight" : "bold",
            "margin" : "1em 0",
            "padding" : "0 10px",
        },
        "template h2" : {
            "display" : "block",
            "font-size" : "1.8em",
            "line-height" : "1.2em",
            "font-weight" : "bold",
            "margin" : "1em 0",
            "padding" : "0 10px",
        },
        "template h3" : {
            "display" : "block",
            "font-size" : "1.6em",
            "line-height" : "1.2em",
            "font-weight" : "bold",
            "margin-top" : "1em",
            "margin-bottom" : "1em",
            "padding" : "0 10px",
        },
        "template h4" : {
            "display" : "block",
            "font-size" : "1.4em",
            "line-height" : "1.2em",
            "font-weight" : "bold",
            "margin" : "1em 0",
            "padding" : "0 10px",
        },
        "template h5" : {
            "display" : "block",
            "font-size" : "1.2em",
            "line-height" : "1.2em",
            "font-weight" : "bold",
            "margin" : "1em 0",
            "padding" : "0 10px",
        },
        "template h6" : {
            "display" : "block",
            "font-size" : "1em",
            "line-height" : "1.2em",
            "font-weight" : "bold",
            "margin" : "1em 0",
            "padding" : "0 10px",
        },
        "textarea ul" : {
            "display" : "block",
            "list-style-type" : "disc",
            "padding-left" : "40px",
            "margin" : "1em 0",
        },
        "textarea ol" : {
            "display" : "block",
            "list-style-type" : "decimal",
            "padding-left" : "40px",
            "margin" : "1em 0",
        },
        "textarea li" : {
            "display" : "list-item",
            "margin-top" : "0.5em",
            "margin-bottom" : "0.5em",
            "padding" : "0 10px",
        },
        "textarea p" : {
            "display" : "block",
            "margin-top" : "1em",
            "margin-bottom" : "1em",
            "padding" : "0 10px",
        },
        "textarea div" : {
            "display" : "block",
            "margin-top" : "1em",
            "margin-bottom" : "1em",
            "padding" : "0 10px",
        },
        "textarea span" : {
            "display" : "inline",
        },
        "textarea a" : {
            "display" : "inline",
            "color" : noteColors.color11,
            "text-decoration" : "underline",
        },
        "template" : {
            "width" : "100%",
            "height" : "100%",
            "position" : "relative",
        },
        "textarea" : {
            "width" : noteAttributes.textareaOriginWidths,
            "height" : noteAttributes.textareaOriginHeights,
            "display" : "block",
            "margin" : "0 auto",
            "outline" : "none",
            "cursor" : "text",
            "text-align" : "left",
            "overflow" : "auto",
            "word-wrap" : "break-word",
            "resize": noteAttributes.textareaHeightIsModify === true ? "vertical" : "none",
            "max-width" : noteAttributes.textareaMaxWidth,
            "max-height" : noteAttributes.textareaMaxHeight,
            "box-shadow" : "0 0.5px 1px 0.5px " + noteColors.color7,
            "background-color" : noteColors.color2,
            "font-size" : noteAttributes.defaultTextareaFontSize,
            "line-height" : noteAttributes.defaultTextareaLineHeight,
            "font-family" : noteAttributes.defaultTextareaFontFamily,
            "color" : noteColors.color12,
            "transition": "height 0.5s",
        },
        "tool" : {
            "width" : noteAttributes.textareaOriginWidths,
            "height" : (noteAttributes.toolDefaultLines * (sizeRates * 50)) + "px",
            "padding" : "2px 0",
            "max-width" : noteAttributes.textareaMaxWidth,
            "display" : "block",
            "line-height" : (sizeRates * 50) + "px",
            "margin" : "0 auto",
            "text-align" : "left",
            "vertical-align" : "middle",
            "box-shadow" : "0.25px 0.25px 1px 0.5px " + noteColors.color7,
            "font-size" : (sizeRates * 16) + "px",
            "background-color" : noteColors.color3,
            "font-family" : noteAttributes.defaultToolFontFamily,
        },
        "icon" : {
            "font-size" : "1.3em",
            "-webkit-user-select" : "none",
            "-moz-user-select" : "none",
            "-ms-user-select" : "none",
            "user-select" : "none",
            "color" : noteColors.color1,
        },
        "button" : {
            "width" : (sizeRates * 50) + "px",
            "height" : (sizeRates * 45) + "px",
            "float" : "left",
            "display" : "inline-block",
            "cursor" : "pointer",
            "text-align" : "center",
            "margin" : "2px 2px",
            "border-radius" : "5px",
            "box-shadow" : "0.25px 0.25px 2px 0.25px " + noteColors.color7,
            "background-color" : noteColors.color4,
            "font-family" : noteAttributes.defaultToolFontFamily,
            "position" : "relative",
        },
        "select" : {
            "width" : (sizeRates * 150) + "px",
            "height" : (sizeRates * 45) + "px",
            "background-color" : noteColors.color4,
            "float" : "left",
            "display" : "inline-block",
            "cursor" : "pointer",
            "text-align" : "center",
            "margin" : "2px 2px",
            "border-radius" : "5px",
            "box-shadow" : "0.25px 0.25px 2px 0.25px " + noteColors.color7,
            "color" : noteColors.color1,
            "position" : "relative",
        },
        "select_box_a" : {
            "min-width" : (sizeRates * 150) + "px",
            "background-color" : noteColors.color4,
            "display" : "none",
            "float" : "left",
            "position" : "absolute",
            "cursor" : "pointer",
            "border-radius" : "5px",
            "box-shadow" : "0.25px 0.25px 0.1em " + noteColors.color7, 
            "opacity" : "0.85",
            "z-index" : "200",
        },
        "select_box_b" : {
            "width" : (sizeRates * 50) + "px",
            "display" : " none",
            "float" : "left",
            "position" : "absolute",
            "cursor" : "pointer",
            "border-radius" : "5px",
            "z-index" : "200",
        },
        "select_box_c" : {
            "width" : (sizeRates * 220 + 30) + "px",
            "display" : "none",
            "padding" : "0 " + (sizeRates * 10) + "px",
            "float" : "left",
            "position" : "absolute",
            "border-radius" : "5px",
            "box-shadow" : "0.25px 0.25px 0.1em " + noteColors.color7,
            "background-color" : noteColors.color4,
            "opacity" : "0.95",
            "cursor" : "text",
            "text-align" : "left",
            "z-index" : "200",
        },
        "select_list" : {
            "display" : "block",
            "height" : (sizeRates * 45) + "px",
            "margin" : "0 !important",
            "line-height" : (sizeRates * 45) + "px !important",
            "padding" : "3px 5px", 
            "cursor" : "pointer",
            "text-align" : "left",
            "overflow" : "hidden",
        },
        "select_list_button" : {
            "width" : (sizeRates * 50) + "px",
            "height" : (sizeRates * 45) + "px",
            "background-color" : noteColors.color4,
            "display" : "inline-block",
            "cursor" : "pointer",
            "border-radius" : "5px",
            "box-shadow" : "0px 0.25px 0.1em " + noteColors.color7,
        },
        "small_input_box" : {
            "width" : (sizeRates * 120) + "px",
            "height" : (sizeRates * 45) + "px",
            "background-color" : noteColors.color4,
            "float" : "left",
            "overflow" : "hidden",
            "cursor" : "pointer",
            "display" : "inline-block",
            "text-align" : "center",
            "margin" : "2px 2px",
            "border-radius" : "5px",
            "box-shadow" : "0.25px 0.25px 2px 0.25px " + noteColors.color7,
        },
        "small_input" : {
            "width" : "30%",
            "background-color" : "rgba(0,0,0,0)",
            "color" : noteColors.color1,
            "border" : "none",
            "border-radius" : "0",
            "text-align" : "right",
            "display" : "inline-block",
            "position" : "relative",
            "top" : "-4px",
            "margin-left" : "5px",
            "font-family" : noteAttributes.defaultToolFontFamily,
            "cursor" : "text",
            "font-size" : "0.8em!important",
        },
        "small_input:focus" : {
            "outline" : "none",
        },
        "small_input::-webkit-inner-spin-button" : {
            "-webkit-appearance" : "none",
            "margin" : "0",
        },
        "small_input::-webkit-outer-spin-button" : {
            "-webkit-appearance" : "none",
            "margin" : "0",
        },
        "small_input[type=number]" : {
            "-moz-appearance" : "textfield",
        },
        "normal_button" : {
            "min-width" : (sizeRates * 50) + "px",
            "height" : (sizeRates * 45) + "px",
            "font-size" : "0.8em",
            "padding" : "0 15px",
            "display" : "inline-block",
            "cursor" : "pointer",
            "text-align" : "center",
            "border-radius" : "5px",
            "border" : "none",
            "box-shadow" : "0.25px 0.25px 2px 0.25px " + noteColors.color7,
            "color" : noteColors.color1,
            "font-family" : noteAttributes.defaultToolFontFamily,
            "background-color" : noteColors.color4,
        },
        "opacity_button" : {
            "min-width" : (sizeRates * 40) + "px",
            "height" : (sizeRates * 40) + "px",
            "font-size" : "0.7em",
            "display" : "inline-block",
            "cursor" : "pointer",
            "text-align" : "center",
            "border-radius" : "5px",
            "border" : "none",
            "color" : noteColors.color1,
            "font-family" : noteAttributes.defaultToolFontFamily,
            "background-color" : getRGBAFromHex(noteColors.color4, 0.5),
        },
        "small_text_box" : {
            "display" : "inline-block",
            "padding" : "0 10px",
            "font-size" : "0.8em",
            "color" : noteColors.color1,
        },
        "modal_back" : {
            "background-color" : "rgba(0,0,0,0.5)",
            "display" : "none",
            "position" : "absolute",
            "z-index" : "300",
            "font-family" : noteAttributes.defaultToolFontFamily,
            "color" : noteColors.color1,
            "font-size" : (sizeRates * 16) + "px",
        },
        "modal_body" : {
            "width" : "80%",
            "margin" : "0 auto",
            "display" : "none",
            "text-align" : "left",
            "border" : "solid 1px " + noteColors.color6,
            "border-radius" : "20px",
            "background-color" : noteColors.color2,
        },
        "modal_header" : {
            "text-align" : "left",
            "padding-top" : (sizeRates * 20) + "px",
            "padding-right" : (sizeRates * 10) + "px",
            "padding-bottom" : (sizeRates * 20) + "px",
            "padding-left" : (sizeRates * 20) + "px",
            "margin-bottom" : (sizeRates * 10) + "px",
            "background-color" : noteColors.color4,
            "border-radius" : "20px 20px 0 0",
            "font-weight" : "bold",
            "font-size" : "1.05em",
        },
        "modal_footer" : {
            "text-align" : "right",
            "margin-top" : (sizeRates * 10) + "px",
            "padding-top" : (sizeRates * 10) + "px",
            "padding-right" : (sizeRates * 10) + "px",
            "padding-bottom" : (sizeRates * 10) + "px",
            "padding-left" : (sizeRates * 10) + "px",
            "border-top" : "1px solid " + noteColors.color6,
        },
        "modal_explain" : {
            "font-size" : "0.95em",
            "text-align" : "left",
            "padding-top" : (sizeRates * 20) + "px",
            "padding-bottom" : (sizeRates * 10) + "px",
            "padding-left" : (sizeRates * 20) + "px",
            "display" : "inline-block",
            "color": noteColors.color10,
            "font-family" : noteAttributes.defaultToolFontFamily,
        },
        "modal_input" : {
            "display" : "block",
            "width" : "80%",
            "background-color" : "rgba(0,0,0,0)",
            "font-family" : noteAttributes.defaultToolFontFamily,
            "color": noteColors.color10,
            "border" : "none",
            "border-radius" : "0",
            "border-bottom" : "1px solid " + noteColors.color6,
            "margin-bottom" : (sizeRates * 10) + "px",
            "margin-left" : (sizeRates * 20) + "px",
            "font-size" : "1.05em",
            "animation" : "vanillanote-modal-input 0.7s forwards"
        },
        "modal_input:focus" : {
            "outline" : "none",
        },
        "modal_input[readonly]" : {
            "background-color": "rgba(0,0,0,0.1)",
        },
        "modal_small_input" : {
            "display" : "inline-block",
            "width" : "20%",
            "background-color" : "rgba(0,0,0,0)",
            "font-family" : noteAttributes.defaultToolFontFamily,
            "color": noteColors.color10,
            "border" : "none",
            "border-radius" : "0",
            "border-bottom" : "1px solid " + noteColors.color6,
            "margin-bottom" : (sizeRates * 10) + "px",
            "margin-left" : (sizeRates * 20) + "px",
            "font-size" : "1.05em",
            "animation" : "vanillanote-modal-small-input 1s forwards"
        },
        "modal_small_input:focus" : {
            "outline" : "none",
        },
        "modal_small_input::-webkit-inner-spin-button" : {
            "appearance" : "none",
            "-moz-appearance" : "none",
            "-webkit-appearance" : "none",
        },
        "modal_small_input::-webkit-outer-spin-button" : {
            "-webkit-appearance" : "none",
            "margin" : "0",
        },
        "modal_small_input[type=number]" : {
            "-moz-appearance" : "textfield",
        },
        "modal_small_input[readonly]" : {
            "background-color": noteColors.color4,
        },
        "modal_input_file" : {
            "display" : "none!important",
        },
        "att_valid_checktext" : {
            "padding-right" : "10px",
            "font-size" : "0.7em",
        },
        "att_link_is_blank_label" : {
            "font-size" : "0.95em",
            "text-align" : "left",
            "display" : "inline-block",
            "height" : "25px",
            "cursor" : "pointer",
            "margin-top" : (sizeRates * 10) + "px",
            "margin-bottom" : (sizeRates * 10) + "px",
            "margin-left" : (sizeRates * 15) + "px",
            "color": noteColors.color10,
        },
        "input_checkbox" : {
            "cursor" : "pointer",
            "display": "inline-block",
            "width" : "12px",
            "height" : "12px",
            "border-radius" : "3px",
            "border" : "solid "+noteColors.color6,
            "border-width" : "1px 2px 2px 1px",
            "transform" : "rotate(0deg)",
            "transition": "transform 0.3s",
        },
        "input_checkbox:focus" : {
            "outline" : "none!important",
        },
        "input_checkbox[disabled]" : {
            "background-color": noteColors.color4,
        },
        "smallpx_input" : {
            "width" : "40px",
            "background-color" : "rgba(0,0,0,0)",
            "color" : noteColors.color1,
            "border" : "none",
            "border-radius" : "5px",
            "text-align" : "right",
            "font-size" : "0.9em!important",
            "display" : "inline-block",
            "margin-left" : "5px",
            "font-family" : noteAttributes.defaultToolFontFamily,
        },
        "smallpx_input:focus" : {
            "outline" : "none",
        },
        "smallpx_input::-webkit-inner-spin-button" : {
            "appearance" : "none",
            "-moz-appearance" : "none",
            "-webkit-appearance" : "none",
        },
        "input_radio" : {
            "cursor" : "pointer",
            "display": "inline-block",
            "width" : "12px",
            "height" : "12px",
            "border-radius" : "50%",
            "border" : "solid 1px "+noteColors.color6,
            "transition": "transform 0.4s, background-color 0.6s;",
        },
        "input_radio:focus" : {
            "outline" : "none!important",
        },
        "input_radio:checked" : {
            "background-color": noteColors.color5,
            "transform": "rotateY( 180deg )",
            "transition": "transform 0.3s, background-color 0.5s;",
        },
        "input_radio[disabled]" : {
            "background-color": noteColors.color4,
        },
        "drag_drop_div" : {
            "width" : "100%",
            "height" : sizeRates * 120 + "px",
            "display" : "inline-block",
            "margin-top" : "10px",
            "border-radius" : "5px",
            "background-color" : noteColors.color4,
            "border" : "solid 1px"+noteColors.color6,
            "line-height" : sizeRates * 130 + "px",
            "font-size" : "0.8em",
            "color" : getRGBAFromHex(noteColors.color1, 0.8),
            "overflow-y" : "scroll",
            "cursor" : "pointer",
        },
        "image_view_div" : {
            "width" : "80%",
            "height" : sizeRates * 120 + "px",
            "display" : "inline-block",
            "margin-top" : "10px",
            "border-radius" : "5px",
            "background-color" : noteColors.color4,
            "border" : "solid 1px"+noteColors.color6,
            "line-height" : sizeRates * 130 + "px",
            "font-size" : "0.8em",
            "color" : getRGBAFromHex(noteColors.color1, 0.8),
            "cursor" : "pointer",
            "overflow" : "hidden",
            "white-space" : "nowrap",
            "scroll-behavior" : "smooth",
        },
        "color_button" : {
            "width" : (sizeRates * 50) * 0.5 + "px",
            "height" : (sizeRates * 45) * 0.5 + "px",
            "float" : "left",
            "display" : "inline-block",
            "cursor" : "pointer",
            "text-align" : "center",
            "border-radius" : "5px",
            "margin-right" : "3px",
            "margin-bottom" : "5%",
            "border" : "1px solid " + noteColors.color1,
            "box-shadow" : "0.25px 0.25px 2px 0.25px " + noteColors.color7,
            "position" : "relative",
        },
        "color_input" : {
            "display" : "inline-block",
            "background-color" : "rgba(0,0,0,0)",
            "width" : (sizeRates * 25) + "px",
            "height" : (sizeRates * 40) + "px",
            "font-size" : "0.7em!important",
            "color": noteColors.color1,
            "border" : "none",
            "border-radius" : "5px",
            "text-align" : "right",
            "margin-right" : (sizeRates * 8) + "px",
            "margin-left" : (sizeRates * 2) + "px",
            "font-family" : noteAttributes.defaultToolFontFamily,
        },
        "color_input:focus" : {
            "outline" : "none",
        },
        "color_input::-webkit-inner-spin-button" : {
            "appearance" : "none",
            "-moz-appearance" : "none",
            "-webkit-appearance" : "none",
        },
        "color_explain" : {
            "display" : "inline-block",
            "height" : (sizeRates * 25) + "px",
            "color": noteColors.color1,
            "font-family" : noteAttributes.defaultToolFontFamily,
            "font-size" : "0.7em",
        },
        "tooltip" : {
            "width" : noteAttributes.textareaOriginWidths,
            "max-width" : noteAttributes.textareaMaxWidth,
            "margin" : "0 auto",
            "padding" : "2px 0",
            "background-color" : noteColors.color3,
            "border" : "solid 1px " + noteColors.color5,
            "height": "0",
            "overflow" : "hidden",
            "opacity" : "0",
            "transition": "opacity 0.6s, height 0.6s",
            "position" : "absolute",
            "left": "50%",
            "transform": "translateX(-50%)",
            "z-index" : "100",
            "text-align" : "left",
            "font-family" : noteAttributes.defaultToolFontFamily,
            "font-size" : "0.9em",
        },
        "tooltip_button" : {
            "width" : (sizeRates * 50) * 0.7 + "px",
            "height" : (sizeRates * 45) * 0.7 + "px",
            "float" : "left",
            "display" : "inline-block",
            "cursor" : "pointer",
            "text-align" : "center",
            "margin" : "2px 2px",
            "border-radius" : "5px",
            "box-shadow" : "0.25px 0.25px 2px 0.25px " + noteColors.color7,
            "background-color" : noteColors.color4,
            "position" : "relative",
        },
        "att_link_tooltip_href" : {
            "cursor" : "pointer",
            "float" : "left",
            "padding" : "0 10px",
            "color" : noteColors.color11,
            "text-decoration" : "underline",
            "font-size" : "0.9em",
            "line-height" : (sizeRates * 45) * 0.8 + "px",
        },
        "help_main" : {
            "max-height" : noteAttributes.textareaOriginHeights,
            "color" : noteColors.color10,
            "overflow-y" : "auto",
        },
        "placeholder" : {
            "width" : noteAttributes.textareaOriginWidths,
            "padding" : "10px",
            "background-color" : getRGBAFromHex(noteColors.color3, 0.8),
            "color" : noteColors.color1,
            "display" : "none",
            "position" : "absolute",
            "z-index" : "100",
            "font-family" : noteAttributes.defaultToolFontFamily,
        },
        "on_button_on" : {
            "background-color" : noteColors.color5 + "!important",
            "box-shadow" : "0.25px 0.25px 0.25px 0.25px " + noteColors.color7,
        },
        "on_active" : {
            "background-color" : noteColors.color5 + "!important",
            "box-shadow" : "0.25px 0.25px 0.25px 0.25px " + noteColors.color7,
        },
        "on_mouseover" : {
            "background-color" : noteColors.color5 + "!important",
        },
        "on_mouseout" : {
            "background-color" : noteColors.color4 + "!important",
        },
        "on_display_inline" : {
            "display":"inline"
        },
        "on_display_inline_block" : {
            "display":"inline-block"
        },
        "on_display_block" : {
            "display":"block"
        },
        "on_display_none" : {
            "display":"none"
        },
    };
    return csses
};

const setNoteEvent = (note: VanillanoteElement): void => {
    note._cssEvents = {
        target_onBeforeClick : function(e: any) {return true;},
        target_onAfterClick : function(e: any) {},
        target_onBeforeMouseover : function(e: any) {return true;},
        target_onAfterMouseover : function(e: any) {},
        target_onBeforeMouseout : function(e: any) {return true;},
        target_onAfterMouseout : function(e: any) {},
        target_onBeforeTouchstart : function(e: any) {return true;},
        target_onAfterTouchstart : function(e: any) {},
        target_onBeforeTouchend : function(e: any) {return true;},
        target_onAfterTouchend : function(e: any) {},
    }
    note._elementsEvents = {
        //textarea event
        textarea_onBeforeClick : function(e: any) {return true;},
        textarea_onAfterClick : function(e: any) {},
        textarea_onBeforeFocus : function(e: any) {return true;},
        textarea_onAfterFocus : function(e: any) {},
        textarea_onBeforeBlur : function(e: any) {return true;},
        textarea_onAfterBlur : function(e: any) {},
        
        //paragraphStyleSelect event
        paragraphStyleSelect_onBeforeClick : function(e: any) {return true;},
        paragraphStyleSelect_onAfterClick : function(e: any) {},
        
        //==================================================================================
        //toolToggleButton event
        toolToggleButton_onBeforeClick : function(e: any) {return true;},
        toolToggleButton_onAfterClick : function(e: any) {},
        
        //==================================================================================
        //styleNomal event
        styleNomal_onBeforeClick : function(e: any) {return true;},
        styleNomal_onAfterClick : function(e: any) {},
        
        //==================================================================================
        //styleHeader1 event
        styleHeader1_onBeforeClick : function(e: any) {return true;},
        styleHeader1_onAfterClick : function(e: any) {},
        
        //==================================================================================
        //styleHeader2 event
        styleHeader2_onBeforeClick : function(e: any) {return true;},
        styleHeader2_onAfterClick : function(e: any) {},
        
        //==================================================================================
        //styleHeader3 event
        styleHeader3_onBeforeClick : function(e: any) {return true;},
        styleHeader3_onAfterClick : function(e: any) {},
        
        //==================================================================================
        //styleHeader4 event
        styleHeader4_onBeforeClick : function(e: any) {return true;},
        styleHeader4_onAfterClick : function(e: any) {},
        
        //==================================================================================
        //styleHeader5 event
        styleHeader5_onBeforeClick : function(e: any) {return true;},
        styleHeader5_onAfterClick : function(e: any) {},
        
        //==================================================================================
        //styleHeader6 event
        styleHeader6_onBeforeClick : function(e: any) {return true;},
        styleHeader6_onAfterClick : function(e: any) {},
        
        //==================================================================================
        //boldButton event
        boldButton_onBeforeClick : function(e: any) {return true;},
        boldButton_onAfterClick : function(e: any) {},
        
        //==================================================================================
        //underlineButton event
        underlineButton_onBeforeClick : function(e: any) {return true;},
        underlineButton_onAfterClick : function(e: any) {},
        
        //==================================================================================
        //italicButton event
        italicButton_onBeforeClick : function(e: any) {return true;},
        italicButton_onAfterClick : function(e: any) {},
        
        //==================================================================================
        //ulButton event
        ulButton_onBeforeClick : function(e: any) {return true;},
        ulButton_onAfterClick : function(e: any) {},
        
        //==================================================================================
        //olButton event
        olButton_onBeforeClick : function(e: any) {return true;},
        olButton_onAfterClick : function(e: any) {},
        
        //==================================================================================
        //textAlignSelect event
        textAlignSelect_onBeforeClick : function(e: any) {return true;},
        textAlignSelect_onAfterClick : function(e: any) {},
        
        //==================================================================================
        //textAlignLeft event
        textAlignLeft_onBeforeClick : function(e: any) {return true;},
        textAlignLeft_onAfterClick : function(e: any) {},
        
        //==================================================================================
        //textAlignCenter event
        textAlignCenter_onBeforeClick : function(e: any) {return true;},
        textAlignCenter_onAfterClick : function(e: any) {},
        
        //==================================================================================
        //textAlignRight event
        textAlignRight_onBeforeClick : function(e: any) {return true;},
        textAlignRight_onAfterClick : function(e: any) {},
        
        //==================================================================================
        //attLinkButton event
        attLinkButton_onBeforeClick : function(e: any) {return true;},
        attLinkButton_onAfterClick : function(e: any) {},
        
        //==================================================================================
        //attFileButton event
        attFileButton_onBeforeClick : function(e: any) {return true;},
        attFileButton_onAfterClick : function(e: any) {},
        
        //==================================================================================
        //attImageButton event
        attImageButton_onBeforeClick : function(e: any) {return true;},
        attImageButton_onAfterClick : function(e: any) {},
        
        //==================================================================================
        //attVideoButton event
        attVideoButton_onBeforeClick : function(e: any) {return true;},
        attVideoButton_onAfterClick : function(e: any) {},
        
        //==================================================================================
        //fontSizeInputBox event
        fontSizeInputBox_onBeforeClick : function(e: any) {return true;},
        fontSizeInputBox_onAfterClick : function(e: any) {},
        
        //==================================================================================
        //fontSizeInput event
        fontSizeInput_onBeforeClick : function(e: any) {return true;},
        fontSizeInput_onAfterClick : function(e: any) {},
        fontSizeInput_onBeforeInput : function(e: any) {return true;},
        fontSizeInput_onAfterInput : function(e: any) {},
        fontSizeInput_onBeforeBlur : function(e: any) {return true;},
        fontSizeInput_onAfterBlur : function(e: any) {},
        
        //==================================================================================
        //letterSpacingInputBox event
        letterSpacingInputBox_onBeforeClick : function(e: any) {return true;},
        letterSpacingInputBox_onAfterClick : function(e: any) {},
        
        //==================================================================================
        //letterSpacingInput event
        letterSpacingInput_onBeforeClick : function(e: any) {return true;},
        letterSpacingInput_onAfterClick : function(e: any) {},
        letterSpacingInput_onBeforeInput : function(e: any) {return true;},
        letterSpacingInput_onAfterInput : function(e: any) {},
        letterSpacingInput_onBeforeBlur : function(e: any) {return true;},
        letterSpacingInput_onAfterBlur : function(e: any) {},
        
        //==================================================================================
        //lineHeightInputBox event
        lineHeightInputBox_onBeforeClick : function(e: any) {return true;},
        lineHeightInputBox_onAfterClick : function(e: any) {},
        
        //==================================================================================
        //lineHeightInput event
        lineHeightInput_onBeforeClick : function(e: any) {return true;},
        lineHeightInput_onAfterClick : function(e: any) {},
        lineHeightInput_onBeforeInput : function(e: any) {return true;},
        lineHeightInput_onAfterInput : function(e: any) {},
        lineHeightInput_onBeforeBlur : function(e: any) {return true;},
        lineHeightInput_onAfterBlur : function(e: any) {},
        
        //==================================================================================
        //fontFamilySelect event
        fontFamilySelect_onBeforeClick : function(e: any) {return true;},
        fontFamilySelect_onAfterClick : function(e: any) {},
        
        //==================================================================================
        //color text select
        colorTextSelect_onBeforeClick : function(e: any) {return true;},
        colorTextSelect_onAfterClick : function(e: any) {},
        //color text select box
        colorTextSelectBox_onBeforeClick : function(e: any) {return true;},
        colorTextSelectBox_onAfterClick : function(e: any) {},
        //colorText0 button
        colorText0_onBeforeClick : function(e: any) {return true;},
        colorText0_onAfterClick : function(e: any) {},
        //colorText1 button
        colorText1_onBeforeClick : function(e: any) {return true;},
        colorText1_onAfterClick : function(e: any) {},
        //colorText2 button
        colorText2_onBeforeClick : function(e: any) {return true;},
        colorText2_onAfterClick : function(e: any) {},
        //colorText3 button
        colorText3_onBeforeClick : function(e: any) {return true;},
        colorText3_onAfterClick : function(e: any) {},
        //colorText4 button
        colorText4_onBeforeClick : function(e: any) {return true;},
        colorText4_onAfterClick : function(e: any) {},
        //colorText5 button
        colorText5_onBeforeClick : function(e: any) {return true;},
        colorText5_onAfterClick : function(e: any) {},
        //colorText6 button
        colorText6_onBeforeClick : function(e: any) {return true;},
        colorText6_onAfterClick : function(e: any) {},
        //colorText7 button
        colorText7_onBeforeClick : function(e: any) {return true;},
        colorText7_onAfterClick : function(e: any) {},
        //colorText R Input event
        colorTextRInput_onBeforeClick : function(e: any) {return true;},
        colorTextRInput_onAfterClick : function(e: any) {},
        colorTextRInput_onBeforeInput : function(e: any) {return true;},
        colorTextRInput_onAfterInput : function(e: any) {},
        colorTextRInput_onBeforeBlur : function(e: any) {return true;},
        colorTextRInput_onAfterBlur : function(e: any) {},
        //colorText G Input event
        colorTextGInput_onBeforeClick : function(e: any) {return true;},
        colorTextGInput_onAfterClick : function(e: any) {},
        colorTextGInput_onBeforeInput : function(e: any) {return true;},
        colorTextGInput_onAfterInput : function(e: any) {},
        colorTextGInput_onBeforeBlur : function(e: any) {return true;},
        colorTextGInput_onAfterBlur : function(e: any) {},
        //colorText B Input event
        colorTextBInput_onBeforeClick : function(e: any) {return true;},
        colorTextBInput_onAfterClick : function(e: any) {},
        colorTextBInput_onBeforeInput : function(e: any) {return true;},
        colorTextBInput_onAfterInput : function(e: any) {},
        colorTextBInput_onBeforeBlur : function(e: any) {return true;},
        colorTextBInput_onAfterBlur : function(e: any) {},
        //colorText Opacity Input event
        colorTextOpacityInput_onBeforeClick : function(e: any) {return true;},
        colorTextOpacityInput_onAfterClick : function(e: any) {},
        colorTextOpacityInput_onBeforeInput : function(e: any) {return true;},
        colorTextOpacityInput_onAfterInput : function(e: any) {},
        colorTextOpacityInput_onBeforeBlur : function(e: any) {return true;},
        colorTextOpacityInput_onAfterBlur : function(e: any) {},
        
        //==================================================================================
        //color background select
        colorBackSelect_onBeforeClick : function(e: any) {return true;},
        colorBackSelect_onAfterClick : function(e: any) {},
        //color back select box
        colorBackSelectBox_onBeforeClick : function(e: any) {return true;},
        colorBackSelectBox_onAfterClick : function(e: any) {},
        //colorBack0 button
        colorBack0_onBeforeClick : function(e: any) {return true;},
        colorBack0_onAfterClick : function(e: any) {},
        //colorBack1 button
        colorBack1_onBeforeClick : function(e: any) {return true;},
        colorBack1_onAfterClick : function(e: any) {},
        //colorBack2 button
        colorBack2_onBeforeClick : function(e: any) {return true;},
        colorBack2_onAfterClick : function(e: any) {},
        //colorBack3 button
        colorBack3_onBeforeClick : function(e: any) {return true;},
        colorBack3_onAfterClick : function(e: any) {},
        //colorBack4 button
        colorBack4_onBeforeClick : function(e: any) {return true;},
        colorBack4_onAfterClick : function(e: any) {},
        //colorBack5 button
        colorBack5_onBeforeClick : function(e: any) {return true;},
        colorBack5_onAfterClick : function(e: any) {},
        //colorBack6 button
        colorBack6_onBeforeClick : function(e: any) {return true;},
        colorBack6_onAfterClick : function(e: any) {},
        //colorBack7 button
        colorBack7_onBeforeClick : function(e: any) {return true;},
        colorBack7_onAfterClick : function(e: any) {},
        //colorBack R Input event
        colorBackRInput_onBeforeClick : function(e: any) {return true;},
        colorBackRInput_onAfterClick : function(e: any) {},
        colorBackRInput_onBeforeInput : function(e: any) {return true;},
        colorBackRInput_onAfterInput : function(e: any) {},
        colorBackRInput_onBeforeBlur : function(e: any) {return true;},
        colorBackRInput_onAfterBlur : function(e: any) {},
        //colorBack G Input event
        colorBackGInput_onBeforeClick : function(e: any) {return true;},
        colorBackGInput_onAfterClick : function(e: any) {},
        colorBackGInput_onBeforeInput : function(e: any) {return true;},
        colorBackGInput_onAfterInput : function(e: any) {},
        colorBackGInput_onBeforeBlur : function(e: any) {return true;},
        colorBackGInput_onAfterBlur : function(e: any) {},
        //colorBack B Input event
        colorBackBInput_onBeforeClick : function(e: any) {return true;},
        colorBackBInput_onAfterClick : function(e: any) {},
        colorBackBInput_onBeforeInput : function(e: any) {return true;},
        colorBackBInput_onAfterInput : function(e: any) {},
        colorBackBInput_onBeforeBlur : function(e: any) {return true;},
        colorBackBInput_onAfterBlur : function(e: any) {},
        //colorBack Opacity Input event
        colorBackOpacityInput_onBeforeClick : function(e: any) {return true;},
        colorBackOpacityInput_onAfterClick : function(e: any) {},
        colorBackOpacityInput_onBeforeInput : function(e: any) {return true;},
        colorBackOpacityInput_onAfterInput : function(e: any) {},
        colorBackOpacityInput_onBeforeBlur : function(e: any) {return true;},
        colorBackOpacityInput_onAfterBlur : function(e: any) {},
        
        //==================================================================================
        //formatClearButton event
        formatClearButton_onBeforeClick : function(e: any) {return true;},
        formatClearButton_onAfterClick : function(e: any) {},
        
        //==================================================================================
        //undo event
        undoButton_onBeforeClick : function(e: any) {return true;},
        undoButton_onAfterClick : function(e: any) {},
        
        //==================================================================================
        //redo event
        redoButton_onBeforeClick : function(e: any) {return true;},
        redoButton_onAfterClick : function(e: any) {},
        
        //==================================================================================
        //help event
        helpButton_onBeforeClick : function(e: any) {return true;},
        helpButton_onAfterClick : function(e: any) {},
        
        //==================================================================================
        //modal back event
        modalBack_onBeforeClick : function(e: any) {return true;},
        modalBack_onAfterClick : function(e: any) {},
        
        //==================================================================================
        //modal att link event
        attLinkModal_onBeforeClick : function(e: any) {return true;},
        attLinkModal_onAfterClick : function(e: any) {},
        
        //==================================================================================
        //modal att link text input event
        attLinkText_onBeforeInput : function(e: any) {return true;},
        attLinkText_onAfterInput : function(e: any) {},
        attLinkText_onBeforeBlur : function(e: any) {return true;},
        attLinkText_onAfterBlur : function(e: any) {},
        
        //==================================================================================
        //modal att link href input event
        attLinkHref_onBeforeInput : function(e: any) {return true;},
        attLinkHref_onAfterInput : function(e: any) {},
        attLinkHref_onBeforeBlur : function(e: any) {return true;},
        attLinkHref_onAfterBlur : function(e: any) {},
        
        //==================================================================================
        //modal att link insert button event
        attLinkInsertButton_onBeforeClick : function(e: any) {return true;},
        attLinkInsertButton_onAfterClick : function(e: any) {},
        
        //==================================================================================
        //modal att file event
        attFileModal_onBeforeClick : function(e: any) {return true;},
        attFileModal_onAfterClick : function(e: any) {},
        
        //==================================================================================
        //modal att file upload button event
        attFileUploadButton_onBeforeClick : function(e: any) {return true;},
        attFileUploadButton_onAfterClick : function(e: any) {},
        
        //==================================================================================
        //modal att file upload div event
        attFileUploadDiv_onBeforeDragover : function(e: any) {return true;},
        attFileUploadDiv_onAfterDragover : function(e: any) {},
        attFileUploadDiv_onBeforeDrop : function(e: any) {return true;},
        attFileUploadDiv_onAfterDrop : function(e: any) {},
        attFileUploadDiv_onBeforeClick : function(e: any) {return true;},
        attFileUploadDiv_onAfterClick : function(e: any) {},
        
        //==================================================================================
        //modal att file upload input event
        attFileUpload_onBeforeInput : function(e: any) {return true;},
        attFileUpload_onAfterInput : function(e: any) {},
        attFileUpload_onBeforeBlur : function(e: any) {return true;},
        attFileUpload_onAfterBlur : function(e: any) {},
        
        //==================================================================================
        //modal att file insert button event
        attFileInsertButton_onBeforeClick : function(e: any) {return true;},
        attFileInsertButton_onAfterClick : function(e: any) {},
        
        //==================================================================================
        //att link tooltip edit button event
        attLinkTooltipEditButton_onBeforeClick : function(e: any) {return true;},
        attLinkTooltipEditButton_onAfterClick : function(e: any) {},
        
        //==================================================================================
        //att link tooltip unlink button event
        attLinkTooltipUnlinkButton_onBeforeClick : function(e: any) {return true;},
        attLinkTooltipUnlinkButton_onAfterClick : function(e: any) {},
        
        //==================================================================================
        //modal att image event
        attImageModal_onBeforeClick : function(e: any) {return true;},
        attImageModal_onAfterClick : function(e: any) {},
        
        //==================================================================================
        //modal att image upload button and view event
        attImageUploadButtonAndView_onBeforeDragover : function(e: any) {return true;},
        attImageUploadButtonAndView_onAfterDragover : function(e: any) {},
        attImageUploadButtonAndView_onBeforeDrop : function(e: any) {return true;},
        attImageUploadButtonAndView_onAfterDrop : function(e: any) {},
        attImageUploadButtonAndView_onBeforeClick : function(e: any) {return true;},
        attImageUploadButtonAndView_onAfterClick : function(e: any) {},
        
        //==================================================================================
        //modal att image view pre button event
        attImageViewPreButtion_onBeforeClick : function(e: any) {return true;},
        attImageViewPreButtion_onAfterClick : function(e: any) {},
        
        //==================================================================================
        //modal att image view next button event
        attImageViewNextButtion_onBeforeClick : function(e: any) {return true;},
        attImageViewNextButtion_onAfterClick : function(e: any) {},
        
        //==================================================================================
        //modal att image upload input event
        attImageUpload_onBeforeInput : function(e: any) {return true;},
        attImageUpload_onAfterInput : function(e: any) {},
        attImageUpload_onBeforeBlur : function(e: any) {return true;},
        attImageUpload_onAfterBlur : function(e: any) {},
        
        //==================================================================================
        //modal att image url input event
        attImageURL_onBeforeInput : function(e: any) {return true;},
        attImageURL_onAfterInput : function(e: any) {},
        attImageURL_onBeforeBlur : function(e: any) {return true;},
        attImageURL_onAfterBlur : function(e: any) {},
        
        //==================================================================================
        //modal att image insert button event
        attImageInsertButton_onBeforeClick : function(e: any) {return true;},
        attImageInsertButton_onAfterClick : function(e: any) {},
        
        //==================================================================================
        //modal att video event
        attVideoModal_onBeforeClick : function(e: any) {return true;},
        attVideoModal_onAfterClick : function(e: any) {},
        
        //==================================================================================
        //modal att video embed id input event
        attVideoEmbedId_onBeforeInput : function(e: any) {return true;},
        attVideoEmbedId_onAfterInput : function(e: any) {},
        attVideoEmbedId_onBeforeBlur : function(e: any) {return true;},
        attVideoEmbedId_onAfterBlur : function(e: any) {},
        
        //==================================================================================
        //modal att video width input event
        attVideoWidth_onBeforeInput : function(e: any) {return true;},
        attVideoWidth_onAfterInput : function(e: any) {},
        attVideoWidth_onBeforeBlur : function(e: any) {return true;},
        attVideoWidth_onAfterBlur : function(e: any) {},
        
        //==================================================================================
        //modal att video height input event
        attVideoHeight_onBeforeInput : function(e: any) {return true;},
        attVideoHeight_onAfterInput : function(e: any) {},
        attVideoHeight_onBeforeBlur : function(e: any) {return true;},
        attVideoHeight_onAfterBlur : function(e: any) {},
        
        //==================================================================================
        //modal att video insert button event
        attVideoInsertButton_onBeforeClick : function(e: any) {return true;},
        attVideoInsertButton_onAfterClick : function(e: any) {},
        
        //==================================================================================
        //att image tooltip width input event
        attImageAndVideoTooltipWidthInput_onBeforeInput : function(e: any) {return true;},
        attImageAndVideoTooltipWidthInput_onAfterInput : function(e: any) {},
        attImageAndVideoTooltipWidthInput_onBeforeBlur : function(e: any) {return true;},
        attImageAndVideoTooltipWidthInput_onAfterBlur : function(e: any) {},
        attImageAndVideoTooltipWidthInput_onBeforeKeyup : function(e: any) {return true;},
        attImageAndVideoTooltipWidthInput_onAfterKeyup : function(e: any) {},
        
        //==================================================================================
        //att image tooltip float none radio input event
        attImageAndVideoTooltipFloatRadioNone_onBeforeClick : function(e: any) {return true;},
        attImageAndVideoTooltipFloatRadioNone_onAfterClick : function(e: any) {},
        
        //==================================================================================
        //att image tooltip float left radio input event
        attImageAndVideoTooltipFloatRadioLeft_onBeforeClick : function(e: any) {return true;},
        attImageAndVideoTooltipFloatRadioLeft_onAfterClick : function(e: any) {},
        
        //==================================================================================
        //att image tooltip float right radio input event
        attImageAndVideoTooltipFloatRadioRight_onBeforeClick : function(e: any) {return true;},
        attImageAndVideoTooltipFloatRadioRight_onAfterClick : function(e: any) {},
        
        //==================================================================================
        //att image tooltip shape square radio input event
        attImageAndVideoTooltipShapeRadioSquare_onBeforeClick : function(e: any) {return true;},
        attImageAndVideoTooltipShapeRadioSquare_onAfterClick : function(e: any) {},
        
        //==================================================================================
        //att image tooltip shape radius radio input event
        attImageAndVideoTooltipShapeRadioRadius_onBeforeClick : function(e: any) {return true;},
        attImageAndVideoTooltipShapeRadioRadius_onAfterClick : function(e: any) {},
        
        //==================================================================================
        //att image tooltip shape circle radio input event
        attImageAndVideoTooltipShapeRadioCircle_onBeforeClick : function(e: any) {return true;},
        attImageAndVideoTooltipShapeRadioCircle_onAfterClick : function(e: any) {},
        
        //==================================================================================
        //modal help event
        helpModal_onBeforeClick : function(e: any) {return true;},
        helpModal_onAfterClick : function(e: any) {},
        
        //==================================================================================
        //placeholder event
        placeholder_onBeforeClick : function(e: any) {return true;},
        placeholder_onAfterClick : function(e: any) {},
    }
}
