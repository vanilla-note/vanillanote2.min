import type { Vanillanote, VanillanoteElement } from "../types/vanillanote";
import type { NoteAttributes } from "../types/attributes";
import type { Colors, Csses } from "../types/csses";
import { NoteModeByDevice, ToolPosition } from "../types/enums";
import { addClickEvent, createElement, createElementBasic, createElementButton, createElementFontFamiliySelect, createElementInput, createElementInputCheckbox, createElementInputRadio, createElementRadioLabel, createElementSelect } from "../utils/createElement";
import {
    checkAlphabetAndNumber,
    checkNumber,
    checkRealNumber,
    getClassName,
    getColors,
    getCommaStrFromArr,
    getCssClassText,
    getExtractColorValue,
    getHexColorFromColorName,
    getId,
    getInvertColor,
    getIsIOS,
    getRGBAFromHex,
    isMobileDevice,
} from "../utils/util";
import { initTextarea } from "../utils/handleElement";
import { setDocumentEvents } from "../events/setDocumentEvent";
import { ElementEvents } from "../types/events";
import { setCssEvents } from "../events/setCssEvent";

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
    
    //create note
    notes.forEach((note) => {
        const noteId = note.getAttribute('data-id')!;
        const vanillanote: VanillanoteElement = note as VanillanoteElement;
        vanillanote.setAttribute('id', getId(vn.variables.noteName, noteId, 'note'));
        vanillanote.setAttribute('class', getClassName(vn.variables.noteName, noteId, 'note'));
        vanillanote.setAttribute("data-note-id", noteId);
        vanillanote._noteName = vn.variables.noteName;
        vanillanote._id = noteId;
        vanillanote._vn = vn;

        vn.vanillanoteElements[noteId] = createNote(vn, vanillanote);
    });
    
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

    // To prevent the Google icon from initially displaying as text, it is shown after a delay of 0.1 seconds.
    setTimeout(function() {
        Object.keys(vn.vanillanoteElements).forEach((id) => {
            vn.vanillanoteElements[id]._elements.template.removeAttribute("style");
        });
        // Resize the size.
        (vn.events.documentEvents as any)["resize"]();
    }, vn.variables.loadInterval);
    
}

const createNote = (vn: Vanillanote, note: VanillanoteElement): VanillanoteElement => {
    //속성 정의
    const noteAttributes = getNoteAttribute(vn, note);
    //색상 정의
    note._colors = getNoteColors(vn, noteAttributes);
    //CSS 최종 정의
    const csses: Csses = getCsses(note._noteName, noteAttributes, note._colors);
    //CSS 추가
    const noteStyleId = `${note._noteName}_${note._id}_styles-sheet`;
    if (!document.getElementById(noteStyleId)) {
        let cssText = "";
        Object.keys(csses).forEach((className) => {
            cssText = cssText + getCssClassText(note._noteName, note._id, className, csses[(className as keyof Csses)]) + "\n";
        });
        const styleElement = document.createElement("style");
        styleElement.id = noteStyleId;
        styleElement.textContent = cssText.trim();
        document.head.appendChild(styleElement);
    }

    //note 정의
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
    note._attributes = {
        isNoteByMobile : noteAttributes.isNoteByMobile,
        language: noteAttributes.language,
        sizeRate : noteAttributes.sizeRate,
        toolPosition : noteAttributes.toolPosition,
		toolToggleUsing: noteAttributes.toolToggleUsing,
        toolDefaultLine : noteAttributes.toolDefaultLine,
        textareaOriginHeight : noteAttributes.textareaOriginHeight,
		defaultTextareaFontFamily: noteAttributes.defaultTextareaFontFamily,
		defaultFontFamilies: noteAttributes.defaultFontFamilies,
		attFilePreventTypes: noteAttributes.attFilePreventTypes,
		attFileAcceptTypes: noteAttributes.attFileAcceptTypes,
		attFileMaxSizes: noteAttributes.attFileMaxSizes,
		attImagePreventTypes: noteAttributes.attImagePreventTypes,
		attImageAcceptTypes: noteAttributes.attImageAcceptTypes,
		attImageMaxSizes: noteAttributes.attImageMaxSizes,
        placeholderIsVisible : noteAttributes.placeholderIsVisible,
		placeholderWidth: noteAttributes.placeholderWidth,
		placeholderAddTop: noteAttributes.placeholderAddTop,
		placeholderAddLeft: noteAttributes.placeholderAddLeft,
		placeholderTitle: noteAttributes.placeholderTitle,
		placeholderTextContent: noteAttributes.placeholderTextContent,
    }
    note._status = {
        toolToggle : false,
        boldToggle : false,
        underlineToggle : false,
        italicToggle : false,
        ulToggle : false,
        olToggle : false,
        fontSize : noteAttributes.defaultTextareaFontSize,
        letterSpacing : 0,
        lineHeight : noteAttributes.defaultTextareaLineHeight,
        fontFamily : noteAttributes.defaultTextareaFontFamily,
        colorTextR : getExtractColorValue(note._colors.color12,"R"),
        colorTextG : getExtractColorValue(note._colors.color12,"G"),
        colorTextB : getExtractColorValue(note._colors.color12,"B"),
        colorTextO : "1",
        colorTextRGB : note._colors.color12,
        colorTextOpacity : "1",
        colorBackR : getExtractColorValue(note._colors.color13,"R"),
        colorBackG : getExtractColorValue(note._colors.color13,"G"),
        colorBackB : getExtractColorValue(note._colors.color13,"B"),
        colorBackO : "0",
        colorBackRGB : note._colors.color13,
        colorBackOpacity : "0",
    };
    note._records = {
        recodeNotes : [],
        recodeConting : -1,
        recodeLimit : noteAttributes.recodeLimit,
    };
    note._attTempFiles = {};
    note._attFiles = {};
    note._attTempImages = {};
    note._attImages = {};
    //event 정의
    setNoteEvent(note);
    //element 생성
    setNoteElement(vn, note, noteAttributes);

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

const setNoteElement = (vn: Vanillanote, note: VanillanoteElement, noteAttributes: NoteAttributes) => {
    let tempElement: HTMLBRElement | null = null;

    //template
    const template = createElement(
        "div",
        note,
        vn.consts.CLASS_NAMES.template.id,
        vn.consts.CLASS_NAMES.template.className
    );
    template.style.display = "none";

    //textarea
    const textarea = createElementBasic(
        note._noteName + "-textarea",
        note,
        vn.consts.CLASS_NAMES.textarea.id,
        vn.consts.CLASS_NAMES.textarea.className,
    );
    textarea.setAttribute("contenteditable",true);
    textarea.setAttribute("role","textbox");
    textarea.setAttribute("aria-multiline",true);
    textarea.setAttribute("spellcheck",true);
    textarea.setAttribute("autocorrect",true);
    textarea.setAttribute("name",getId(note._noteName, note._id, vn.consts.CLASS_NAMES.textarea.id));
    textarea.setAttribute("title", vn.languageSet[note._attributes.language].textareaTooltip);
    textarea.addEventListener("focus", function(event: any) {
        if(!note._elementEvents.textarea_onBeforeFocus(event)) return;
        (vn.events.elementEvents as any)["textarea_onFocus"](event);
        note._elementEvents.textarea_onAfterFocus(event);
        event.stopImmediatePropagation();
    });
    textarea.addEventListener(getIsIOS() ? "mouseout" : "blur", function(event: any) {
        if(!note._elementEvents.textarea_onBeforeBlur(event)) return;
        (vn.events.elementEvents as any)["textarea_onBlur"](event);
        note._elementEvents.textarea_onAfterBlur(event);
        event.stopImmediatePropagation();
    });
    textarea.addEventListener("keydown", function(event: any) {
        (vn.events.elementEvents as any)["textarea_onKeydown"](event);
        event.stopImmediatePropagation();
    });
    textarea.addEventListener("keyup", function(event: any) {
        (vn.events.elementEvents as any)["textarea_onKeyup"](event);
        event.stopImmediatePropagation();
    });
    textarea.addEventListener("beforeinput", function(event: any) {
        (vn.events.elementEvents as any)["textarea_onBeforeinput"](event);
        event.stopImmediatePropagation();
    });
    vn.events.documentEvents.noteObserver!.observe(textarea, vn.variables.observerOptions);
    initTextarea(textarea);

    //tool
    const tool = createElement("div", note, vn.consts.CLASS_NAMES.tool.id, vn.consts.CLASS_NAMES.tool.className);
    //tool toggle
    const toolToggleButton = createElementButton(
        "span",
        note,
        vn.consts.CLASS_NAMES.toolToggleButton.id,
        vn.consts.CLASS_NAMES.toolToggleButton.className,
        {"isIcon":true, "text":"arrow_drop_down"}
    );

    //paragraph style
    const paragraphStyleSelect = createElementSelect(
        "span",
        note,
        vn.consts.CLASS_NAMES.paragraphStyleSelect.id,
        vn.consts.CLASS_NAMES.paragraphStyleSelect.className,
        {"isIcon":true, "text":"auto_fix_high"}
    );
    paragraphStyleSelect.setAttribute("title", vn.languageSet[note._attributes.language].styleTooltip);
    const paragraphStyleSelectBox = createElement(
        "div",
        note,
        vn.consts.CLASS_NAMES.paragraphStyleSelectBox.id,
        vn.consts.CLASS_NAMES.paragraphStyleSelectBox.className,
    );
    paragraphStyleSelect.appendChild(paragraphStyleSelectBox);
    const paragraphStyleNormalButton = createElementButton(
        "div",
        note,
        vn.consts.CLASS_NAMES.styleNomal.id,
        vn.consts.CLASS_NAMES.styleNomal.className,
        {"isIcon":false, "text":"Normal"}
    );
    paragraphStyleNormalButton.setAttribute("data-tag-name","p");
    paragraphStyleSelectBox.appendChild(paragraphStyleNormalButton);
    const paragraphStyleHeader1Button = createElementButton(
        "h1",
        note,
        vn.consts.CLASS_NAMES.styleHeader1.id,
        vn.consts.CLASS_NAMES.styleHeader1.className,
        {"isIcon":false, "text":"Header1"}
    );
    paragraphStyleHeader1Button.setAttribute("data-tag-name","H1");
    paragraphStyleSelectBox.appendChild(paragraphStyleHeader1Button);
    const paragraphStyleHeader2Button = createElementButton(
        "h2",
        note,
        vn.consts.CLASS_NAMES.styleHeader2.id,
        vn.consts.CLASS_NAMES.styleHeader2.className,
        {"isIcon":false, "text":"Header2"}
    );
    paragraphStyleHeader2Button.setAttribute("data-tag-name","H2");
    paragraphStyleSelectBox.appendChild(paragraphStyleHeader2Button);
    const paragraphStyleHeader3Button = createElementButton(
        "h3",
        note,
        vn.consts.CLASS_NAMES.styleHeader3.id,
        vn.consts.CLASS_NAMES.styleHeader3.className,
        {"isIcon":false, "text":"Header3"}
    );
    paragraphStyleHeader3Button.setAttribute("data-tag-name","H3");
    paragraphStyleSelectBox.appendChild(paragraphStyleHeader3Button);
    const paragraphStyleHeader4Button = createElementButton(
        "h4",
        note,
        vn.consts.CLASS_NAMES.styleHeader4.id,
        vn.consts.CLASS_NAMES.styleHeader4.className,
        {"isIcon":false, "text":"Header4"}
    );
    paragraphStyleHeader4Button.setAttribute("data-tag-name","H4");
    paragraphStyleSelectBox.appendChild(paragraphStyleHeader4Button);
    const paragraphStyleHeader5Button = createElementButton(
        "h5",
        note,
        vn.consts.CLASS_NAMES.styleHeader5.id,
        vn.consts.CLASS_NAMES.styleHeader5.className,
        {"isIcon":false, "text":"Header5"}
    );
    paragraphStyleHeader5Button.setAttribute("data-tag-name","H5");
    paragraphStyleSelectBox.appendChild(paragraphStyleHeader5Button);
    const paragraphStyleHeader6Button = createElementButton(
        "h6",
        note,
        vn.consts.CLASS_NAMES.styleHeader6.id,
        vn.consts.CLASS_NAMES.styleHeader6.className,
        {"isIcon":false, "text":"Header6"}
    );
    paragraphStyleHeader6Button.setAttribute("data-tag-name","H6");
    paragraphStyleSelectBox.appendChild(paragraphStyleHeader6Button);

    //bold
    const boldButton = createElementButton(
        "span",
        note,
        vn.consts.CLASS_NAMES.boldButton.id,
        vn.consts.CLASS_NAMES.boldButton.className,
        {"isIcon":true, "text":"format_bold"}
    );
    boldButton.setAttribute("title", vn.languageSet[note._attributes.language].boldTooltip);
    //under-line
    const underlineButton = createElementButton(
        "span",
        note,
        vn.consts.CLASS_NAMES.underlineButton.id,
        vn.consts.CLASS_NAMES.underlineButton.className,
        {"isIcon":true, "text":"format_underlined"}
    );
    underlineButton.setAttribute("title", vn.languageSet[note._attributes.language].underlineTooltip);
    //italic
    const italicButton = createElementButton(
        "span",
        note,
        vn.consts.CLASS_NAMES.italicButton.id,
        vn.consts.CLASS_NAMES.italicButton.className,
        {"isIcon":true, "text":"format_italic"}
    );
    italicButton.setAttribute("title", vn.languageSet[note._attributes.language].italicTooltip);
    //ul
    const ulButton = createElementButton(
        "span",
        note,
        vn.consts.CLASS_NAMES.ulButton.id,
        vn.consts.CLASS_NAMES.ulButton.className,
        {"isIcon":true, "text":"format_list_bulleted"}
    );
    ulButton.setAttribute("title", vn.languageSet[note._attributes.language].ulTooltip);
    ulButton.setAttribute("data-tag-name","UL");
    //ol
    const olButton = createElementButton(
        "span",
        note,
        vn.consts.CLASS_NAMES.olButton.id,
        vn.consts.CLASS_NAMES.olButton.className,
        {"isIcon":true, "text":"format_list_numbered"}
    );
    olButton.setAttribute("title", vn.languageSet[note._attributes.language].olTooltip);
    olButton.setAttribute("data-tag-name","OL");

    //text-align
    const textAlignSelect = createElementSelect(
        "span",
        note,
        vn.consts.CLASS_NAMES.textAlignSelect.id,
        vn.consts.CLASS_NAMES.textAlignSelect.className,
        {"isIcon":true, "text":"notes"}
    );
    textAlignSelect.setAttribute("title", vn.languageSet[note._attributes.language].textAlignTooltip);
    const textAlignSelectBox = createElement(
        "div",
        note,
        vn.consts.CLASS_NAMES.textAlignSelectBox.id,
        vn.consts.CLASS_NAMES.textAlignSelectBox.className,
    );
    textAlignSelect.appendChild(textAlignSelectBox);
    const textAlignLeftButton = createElementButton(
        "span",
        note,
        vn.consts.CLASS_NAMES.textAlignLeft.id,
        vn.consts.CLASS_NAMES.textAlignLeft.className,
        {"isIcon":true, "text":"format_align_left"}
    );
    textAlignLeftButton.setAttribute("data-tag-style","text-align:left;");
    textAlignSelectBox.appendChild(textAlignLeftButton);
    const textAlignCenterButton = createElementButton(
        "span",
        note,
        vn.consts.CLASS_NAMES.textAlignCenter.id,
        vn.consts.CLASS_NAMES.textAlignCenter.className,
        {"isIcon":true, "text":"format_align_center"}
    );
    textAlignCenterButton.setAttribute("data-tag-style","text-align:center;");
    textAlignSelectBox.appendChild(textAlignCenterButton);
    const textAlignRightButton = createElementButton(
        "span",
        note,
        vn.consts.CLASS_NAMES.textAlignRight.id,
        vn.consts.CLASS_NAMES.textAlignRight.className,
        {"isIcon":true, "text":"format_align_right"}
    );
    textAlignRightButton.setAttribute("data-tag-style","text-align:right;");
    textAlignSelectBox.appendChild(textAlignRightButton);

    //att link
    const attLinkButton = createElementButton(
        "span",
        note,
        vn.consts.CLASS_NAMES.attLinkButton.id,
        vn.consts.CLASS_NAMES.attLinkButton.className,
        {"isIcon":true, "text":"link"}
    );
    attLinkButton.setAttribute("title", vn.languageSet[note._attributes.language].attLinkTooltip);
    //att file
    const attFileButton = createElementButton(
        "span",
        note,
        vn.consts.CLASS_NAMES.attFileButton.id,
        vn.consts.CLASS_NAMES.attFileButton.className,
        {"isIcon":true, "text":"attach_file"}
    );
    attFileButton.setAttribute("title", vn.languageSet[note._attributes.language].attFileTooltip);
    //att image
    const attImageButton = createElementButton(
        "span",
        note,
        vn.consts.CLASS_NAMES.attImageButton.id,
        vn.consts.CLASS_NAMES.attImageButton.className,
        {"isIcon":true, "text":"image"}
    );
    attImageButton.setAttribute("title", vn.languageSet[note._attributes.language].attImageTooltip);
    //att video
    const attVideoButton = createElementButton(
        "span",
        note,
        vn.consts.CLASS_NAMES.attVideoButton.id,
        vn.consts.CLASS_NAMES.attVideoButton.className,
        {"isIcon":true, "text":"videocam"}
    );
    attVideoButton.setAttribute("title", vn.languageSet[note._attributes.language].attVideoTooltip);
    
    //font size
    const fontSizeInputBox = createElementButton(
        "span",
        note,
        vn.consts.CLASS_NAMES.fontSizeInputBox.id,
        vn.consts.CLASS_NAMES.fontSizeInputBox.className,
        {"isIcon":true, "text":"format_size"}
    );
    const fontSizeInput = createElementInput(
        note,
        vn.consts.CLASS_NAMES.fontSizeInput.id,
        vn.consts.CLASS_NAMES.fontSizeInput.className,
    );
    fontSizeInput.setAttribute("type","number");
    fontSizeInput.setAttribute("title", vn.languageSet[note._attributes.language].fontSizeTooltip);
    addClickEvent(
        fontSizeInput,
        vn.consts.CLASS_NAMES.fontSizeInput.id,
        note,
    );
    fontSizeInputBox.appendChild(fontSizeInput);
    //letter spacing
    const letterSpacingInputBox = createElementButton(
        "span",
        note,
        vn.consts.CLASS_NAMES.letterSpacingInputBox.id,
        vn.consts.CLASS_NAMES.letterSpacingInputBox.className,
        {"isIcon":true, "text":"swap_horiz"}
    );
    const letterSpacingInput = createElementInput(
        note,
        vn.consts.CLASS_NAMES.letterSpacingInput.id,
        vn.consts.CLASS_NAMES.letterSpacingInput.className,
    );
    letterSpacingInput.setAttribute("type","number");
    letterSpacingInput.setAttribute("title", vn.languageSet[note._attributes.language].letterSpacingTooltip);
    addClickEvent(
        letterSpacingInput,
        vn.consts.CLASS_NAMES.letterSpacingInput.id,
        note,
    );
    letterSpacingInputBox.appendChild(letterSpacingInput);
    //line height
    const lineHeightInputBox = createElementButton(
        "span",
        note,
        vn.consts.CLASS_NAMES.lineHeightInputBox.id,
        vn.consts.CLASS_NAMES.lineHeightInputBox.className,
        {"isIcon":true, "text":"height"}
    );
    const lineHeightInput = createElementInput(
        note,
        vn.consts.CLASS_NAMES.lineHeightInput.id,
        vn.consts.CLASS_NAMES.lineHeightInput.className,
    );
    lineHeightInput.setAttribute("type","number");
    lineHeightInput.setAttribute("title", vn.languageSet[note._attributes.language].lineHeightTooltip);
    addClickEvent(
        lineHeightInput,
        vn.consts.CLASS_NAMES.lineHeightInput.id,
        note,
    );
    lineHeightInputBox.appendChild(lineHeightInput);
    
    //font style(font family)
    const fontFamilySelect = createElementSelect(
        "span",
        note,
        vn.consts.CLASS_NAMES.fontFamilySelect.id,
        vn.consts.CLASS_NAMES.fontFamilySelect.className,
        {
            "isIcon" : false,
            "text" : note._attributes.defaultTextareaFontFamily.length > 12 
                    ? note._attributes.defaultTextareaFontFamily.substr(0,12) + "..." : note._attributes.defaultTextareaFontFamily
        }
    );
    fontFamilySelect.setAttribute("style","font-family:" + note._attributes.defaultTextareaFontFamily + ";");
    fontFamilySelect.setAttribute("title", vn.languageSet[note._attributes.language].fontFamilyTooltip);
    const fontFamilySelectBox = createElement(
        "div",
        note,
        vn.consts.CLASS_NAMES.fontFamilySelectBox.id,
        vn.consts.CLASS_NAMES.fontFamilySelectBox.className,
    );
    fontFamilySelect.appendChild(fontFamilySelectBox);
    for(var fontIdx = 0; fontIdx < note._attributes.defaultFontFamilies.length; fontIdx++) {
        const tempElement = createElementFontFamiliySelect(
            "div",
            note,
            vn.consts.CLASS_NAMES.fontFamily.id + fontIdx,
            vn.consts.CLASS_NAMES.fontFamily.className,
            {"isIcon" : false, "text" : note._attributes.defaultFontFamilies[fontIdx]}
        );
        tempElement.setAttribute("data-font-family", note._attributes.defaultFontFamilies[fontIdx]);
        tempElement.setAttribute("style", "font-family:" + note._attributes.defaultFontFamilies[fontIdx] + ";");
        fontFamilySelectBox.appendChild(tempElement);
    }

    //color text select
    const colorTextSelect = createElementSelect(
        "span",
        note,
        vn.consts.CLASS_NAMES.colorTextSelect.id,
        vn.consts.CLASS_NAMES.colorTextSelect.className,
        {"isIcon":true, "text":"format_color_text", "iconStyle" : "-webkit-text-stroke: 0.5px black; font-size: 1.1em"}
    );
    colorTextSelect.setAttribute("title",vn.languageSet[note._attributes.language].colorTextTooltip);
    const colorTextSelectBox = createElement(
        "div",
        note,
        vn.consts.CLASS_NAMES.colorTextSelectBox.id,
        vn.consts.CLASS_NAMES.colorTextSelectBox.className,
    );
    colorTextSelect.appendChild(colorTextSelectBox);
    const colorTextRIcon = createElement(
        "span",
        note,
        vn.consts.CLASS_NAMES.colorTextRExplain.id,
        vn.consts.CLASS_NAMES.colorTextRExplain.className,
        {"isIcon":false, "text":"R"}
    );
    colorTextRIcon.style.paddingLeft = (note._attributes.sizeRate * 8) + "px";
    colorTextSelectBox.appendChild(colorTextRIcon);
    const colorTextRInput = createElementInput(
        note,
        vn.consts.CLASS_NAMES.colorTextRInput.id,
        vn.consts.CLASS_NAMES.colorTextRInput.className
    );
    colorTextRInput.setAttribute("maxlength", "2");
    addClickEvent(colorTextRInput, vn.consts.CLASS_NAMES.colorTextRInput.id, note);
    colorTextSelectBox.appendChild(colorTextRInput);
    const colorTextGIcon = createElement(
        "span",
        note,
        vn.consts.CLASS_NAMES.colorTextGExplain.id,
        vn.consts.CLASS_NAMES.colorTextGExplain.className,
        {"isIcon":false, "text":"G"}
    );
    colorTextSelectBox.appendChild(colorTextGIcon);
    const colorTextGInput = createElementInput(
        note,
        vn.consts.CLASS_NAMES.colorTextGInput.id,
        vn.consts.CLASS_NAMES.colorTextGInput.className
    );
    colorTextGInput.setAttribute("maxlength", "2");
    addClickEvent(colorTextGInput, vn.consts.CLASS_NAMES.colorTextGInput.id, note);
    colorTextSelectBox.appendChild(colorTextGInput);
    const colorTextBIcon = createElement(
        "span",
        note,
        vn.consts.CLASS_NAMES.colorTextBExplain.id,
        vn.consts.CLASS_NAMES.colorTextBExplain.className,
        {"isIcon":false, "text":"B"}
    );
    colorTextSelectBox.appendChild(colorTextBIcon);
    const colorTextBInput = createElementInput(
        note,
        vn.consts.CLASS_NAMES.colorTextBInput.id,
        vn.consts.CLASS_NAMES.colorTextBInput.className
    );
    colorTextBInput.setAttribute("maxlength", "2");
    addClickEvent(colorTextBInput, vn.consts.CLASS_NAMES.colorTextBInput.id, note);
    colorTextSelectBox.appendChild(colorTextBInput);
    const colorTextOpacityIcon = createElement(
        "span",
        note,
        vn.consts.CLASS_NAMES.colorTextOpacityExplain.id,
        vn.consts.CLASS_NAMES.colorTextOpacityExplain.className,
        {"isIcon":false, "text":"Opacity"}
    );
    colorTextSelectBox.appendChild(colorTextOpacityIcon);
    const colorTextOpacityInput = createElementInput(
        note,
        vn.consts.CLASS_NAMES.colorTextOpacityInput.id,
        vn.consts.CLASS_NAMES.colorTextOpacityInput.className
    );
    colorTextOpacityInput.setAttribute("type","number");
    colorTextOpacityInput.setAttribute("maxlength", "3");
    addClickEvent(colorTextOpacityInput, vn.consts.CLASS_NAMES.colorTextOpacityInput.id, note);
    colorTextSelectBox.appendChild(colorTextOpacityInput);
    tempElement = document.createElement("br");
    colorTextSelectBox.appendChild(tempElement);
    const colorText0 = createElementBasic("div", note, vn.consts.CLASS_NAMES.colorText0.id, vn.consts.CLASS_NAMES.colorText0.className);
    colorText0.style.backgroundColor = note._colors.color12;
    colorTextSelectBox.appendChild(colorText0);
    const colorText1 = createElementBasic("div", note, vn.consts.CLASS_NAMES.colorText1.id, vn.consts.CLASS_NAMES.colorText1.className);
    colorText1.style.backgroundColor = note._colors.color14;
    colorTextSelectBox.appendChild(colorText1);
    const colorText2 = createElementBasic("div", note, vn.consts.CLASS_NAMES.colorText2.id, vn.consts.CLASS_NAMES.colorText2.className);
    colorText2.style.backgroundColor = note._colors.color15;
    colorTextSelectBox.appendChild(colorText2);
    const colorText3 = createElementBasic("div", note, vn.consts.CLASS_NAMES.colorText3.id, vn.consts.CLASS_NAMES.colorText3.className);
    colorText3.style.backgroundColor = note._colors.color16;
    colorTextSelectBox.appendChild(colorText3);
    const colorText4 = createElementBasic("div", note, vn.consts.CLASS_NAMES.colorText4.id, vn.consts.CLASS_NAMES.colorText4.className);
    colorText4.style.backgroundColor = note._colors.color17;
    colorTextSelectBox.appendChild(colorText4);
    const colorText5 = createElementBasic("div", note, vn.consts.CLASS_NAMES.colorText5.id, vn.consts.CLASS_NAMES.colorText5.className);
    colorText5.style.backgroundColor = note._colors.color18;
    colorTextSelectBox.appendChild(colorText5);
    const colorText6 = createElementBasic("div", note, vn.consts.CLASS_NAMES.colorText6.id, vn.consts.CLASS_NAMES.colorText6.className);
    colorText6.style.backgroundColor = note._colors.color19;
    colorTextSelectBox.appendChild(colorText6);
    const colorText7 = createElementBasic("div", note, vn.consts.CLASS_NAMES.colorText7.id, vn.consts.CLASS_NAMES.colorText7.className);
    colorText7.style.backgroundColor = note._colors.color20;
    colorTextSelectBox.appendChild(colorText7);

    //color background select
    const colorBackSelect = createElementSelect(
        "span",
        note,
        vn.consts.CLASS_NAMES.colorBackSelect.id,
        vn.consts.CLASS_NAMES.colorBackSelect.className,
        {"isIcon":true, "text":"format_color_fill", "iconStyle" : "font-size: 1.1em; -webkit-text-stroke: 0.5px " + note._colors.color1 + ";"}
    );
    colorBackSelect.setAttribute("title",vn.languageSet[note._attributes.language].colorBackTooltip);
    const colorBackSelectBox = createElement(
        "div",
        note,
        vn.consts.CLASS_NAMES.colorBackSelectBox.id,
        vn.consts.CLASS_NAMES.colorBackSelectBox.className
    );
    colorBackSelect.appendChild(colorBackSelectBox);
    const colorBackRIcon = createElement("span",
        note,
        vn.consts.CLASS_NAMES.colorBackRExplain.id,
        vn.consts.CLASS_NAMES.colorBackRExplain.className,
        {"isIcon":false, "text":"R"}
    );
    colorBackRIcon.style.paddingLeft = (note._attributes.sizeRate * 8) + "px";
    colorBackSelectBox.appendChild(colorBackRIcon);
    const colorBackRInput = createElementInput(
        note,
        vn.consts.CLASS_NAMES.colorBackRInput.id,
        vn.consts.CLASS_NAMES.colorBackRInput.className,
    );
    colorBackRInput.setAttribute("maxlength", "2");
    addClickEvent(colorBackRInput, vn.consts.CLASS_NAMES.colorBackRInput.id, note);
    colorBackSelectBox.appendChild(colorBackRInput);
    const colorBackGIcon = createElement(
        "span",
        note,
        vn.consts.CLASS_NAMES.colorBackGExplain.id,
        vn.consts.CLASS_NAMES.colorBackGExplain.className,
        {"isIcon":false, "text":"G"}
    );
    colorBackSelectBox.appendChild(colorBackGIcon);
    const colorBackGInput = createElementInput(
        note,
        vn.consts.CLASS_NAMES.colorBackGInput.id,
        vn.consts.CLASS_NAMES.colorBackGInput.className,
    );
    colorBackGInput.setAttribute("maxlength", "2");
    addClickEvent(colorBackGInput, vn.consts.CLASS_NAMES.colorBackGInput.id, note);
    colorBackSelectBox.appendChild(colorBackGInput);
    const colorBackBIcon = createElement(
        "span",
        note,
        vn.consts.CLASS_NAMES.colorBackBExplain.id,
        vn.consts.CLASS_NAMES.colorBackBExplain.className,
        {"isIcon":false, "text":"B"}
    );
    colorBackSelectBox.appendChild(colorBackBIcon);
    const colorBackBInput = createElementInput(
        note,
        vn.consts.CLASS_NAMES.colorBackBInput.id,
        vn.consts.CLASS_NAMES.colorBackBInput.className
    );
    colorBackBInput.setAttribute("maxlength", "2");
    addClickEvent(colorBackBInput, vn.consts.CLASS_NAMES.colorBackBInput.id, note);
    colorBackSelectBox.appendChild(colorBackBInput);
    const colorBackOpacityIcon = createElement(
        "span",
        note,
        vn.consts.CLASS_NAMES.colorBackOpacityExplain.id,
        vn.consts.CLASS_NAMES.colorBackOpacityExplain.className,
        {"isIcon":false, "text":"Opacity"}
    );
    colorBackSelectBox.appendChild(colorBackOpacityIcon);
    const colorBackOpacityInput = createElementInput(
        note,
        vn.consts.CLASS_NAMES.colorBackOpacityInput.id,
        vn.consts.CLASS_NAMES.colorBackOpacityInput.className
    );
    colorBackOpacityInput.setAttribute("type","number");
    colorBackOpacityInput.setAttribute("maxlength", "3");
    addClickEvent(colorBackOpacityInput, vn.consts.CLASS_NAMES.colorBackOpacityInput.id, note);
    colorBackSelectBox.appendChild(colorBackOpacityInput);
    tempElement = document.createElement("br");
    colorBackSelectBox.appendChild(tempElement);
    const colorBack0 = createElementBasic("div", note, vn.consts.CLASS_NAMES.colorBack0.id, vn.consts.CLASS_NAMES.colorBack0.className);
    colorBack0.style.backgroundColor = note._colors.color13;
    colorBackSelectBox.appendChild(colorBack0);
    const colorBack1 = createElementBasic("div", note, vn.consts.CLASS_NAMES.colorBack1.id, vn.consts.CLASS_NAMES.colorBack1.className);
    colorBack1.style.backgroundColor = note._colors.color14;
    colorBackSelectBox.appendChild(colorBack1);
    const colorBack2 = createElementBasic("div", note, vn.consts.CLASS_NAMES.colorBack2.id, vn.consts.CLASS_NAMES.colorBack2.className);
    colorBack2.style.backgroundColor = note._colors.color15;
    colorBackSelectBox.appendChild(colorBack2);
    const colorBack3 = createElementBasic("div", note, vn.consts.CLASS_NAMES.colorBack3.id, vn.consts.CLASS_NAMES.colorBack3.className);
    colorBack3.style.backgroundColor = note._colors.color16;
    colorBackSelectBox.appendChild(colorBack3);
    const colorBack4 = createElementBasic("div", note, vn.consts.CLASS_NAMES.colorBack4.id, vn.consts.CLASS_NAMES.colorBack4.className);
    colorBack4.style.backgroundColor = note._colors.color17;
    colorBackSelectBox.appendChild(colorBack4);
    const colorBack5 = createElementBasic("div", note, vn.consts.CLASS_NAMES.colorBack5.id, vn.consts.CLASS_NAMES.colorBack5.className);
    colorBack5.style.backgroundColor = note._colors.color18;
    colorBackSelectBox.appendChild(colorBack5);
    const colorBack6 = createElementBasic("div", note, vn.consts.CLASS_NAMES.colorBack6.id, vn.consts.CLASS_NAMES.colorBack6.className);
    colorBack6.style.backgroundColor = note._colors.color19;
    colorBackSelectBox.appendChild(colorBack6);
    const colorBack7 = createElementBasic("div", note, vn.consts.CLASS_NAMES.colorBack7.id, vn.consts.CLASS_NAMES.colorBack7.className);
    colorBack7.style.backgroundColor = note._colors.color20;
    colorBackSelectBox.appendChild(colorBack7);

    //formatClearButton
    const formatClearButton = createElementButton(
        "span",
        note,
        vn.consts.CLASS_NAMES.formatClearButton.id,
        vn.consts.CLASS_NAMES.formatClearButton.className,
        {"isIcon":true, "text":"format_clear"}
    );
    formatClearButton.setAttribute("title",vn.languageSet[note._attributes.language].formatClearButtonTooltip);
    //undo
    const undoButton = createElementButton(
        "span",
        note,
        vn.consts.CLASS_NAMES.undoButton.id,
        vn.consts.CLASS_NAMES.undoButton.className,
        {"isIcon":true, "text":"undo"}
    );
    undoButton.setAttribute("title",vn.languageSet[note._attributes.language].undoTooltip);
    //redo
    const redoButton = createElementButton(
        "span",
        note,
        vn.consts.CLASS_NAMES.redoButton.id,
        vn.consts.CLASS_NAMES.redoButton.className,
        {"isIcon":true, "text":"redo"}
    );
    redoButton.setAttribute("title",vn.languageSet[note._attributes.language].redoTooltip);
    //help
    const helpButton = createElementButton(
        "span",
        note,
        vn.consts.CLASS_NAMES.helpButton.id,
        vn.consts.CLASS_NAMES.helpButton.className,
        {"isIcon":true, "text":"help"}
    );
    helpButton.setAttribute("title",vn.languageSet[note._attributes.language].helpTooltip);

    //modal
    const modalBack = createElementBasic(
        "div",
        note,
        vn.consts.CLASS_NAMES.modalBack.id,
        vn.consts.CLASS_NAMES.modalBack.className
    );

    //modal att link
    const attLinkModal = createElementBasic(
        "div",
        note,
        vn.consts.CLASS_NAMES.attLinkModal.id,
        vn.consts.CLASS_NAMES.attLinkModal.className
    );
    const attLinkModalTitle = createElement(
        "div",
        note,
        vn.consts.CLASS_NAMES.attLinkHeader.id,
        vn.consts.CLASS_NAMES.attLinkHeader.className,
        {"isIcon":false, "text":vn.languageSet[note._attributes.language].attLinkModalTitle}
    );
    attLinkModal.appendChild(attLinkModalTitle);
    const attLinkInTextExplain = createElement(
        "div",
        note,
        vn.consts.CLASS_NAMES.attLinkExplain1.id,
        vn.consts.CLASS_NAMES.attLinkExplain1.className,
        {"isIcon":false, "text":vn.languageSet[note._attributes.language].attLinkInTextExplain}
    );
    attLinkModal.appendChild(attLinkInTextExplain);
    const attLinkText = createElementInput(
        note,
        vn.consts.CLASS_NAMES.attLinkText.id,
        vn.consts.CLASS_NAMES.attLinkText.className
    );
    attLinkText.setAttribute("title",vn.languageSet[note._attributes.language].attLinkInTextTooltip);
    attLinkModal.appendChild(attLinkText);
    const attLinkInLinkExplain = createElement(
        "div",
        note,
        vn.consts.CLASS_NAMES.attLinkExplain2.id,
        vn.consts.CLASS_NAMES.attLinkExplain2.className,
        {"isIcon":false, "text":vn.languageSet[note._attributes.language].attLinkInLinkExplain}
    );
    attLinkModal.appendChild(attLinkInLinkExplain);
    const attLinkHref = createElementInput(
        note,
        vn.consts.CLASS_NAMES.attLinkHref.id,
        vn.consts.CLASS_NAMES.attLinkHref.className
    );
    attLinkHref.setAttribute("title",vn.languageSet[note._attributes.language].attLinkInLinkTooltip);
    attLinkModal.appendChild(attLinkHref);
    const attLinkIsBlankCheckbox = createElementInputCheckbox(
        note,
        vn.consts.CLASS_NAMES.attLinkIsBlankCheckbox.id,
        vn.consts.CLASS_NAMES.attLinkIsBlankCheckbox.className
    );
    attLinkIsBlankCheckbox.setAttribute("title",vn.languageSet[note._attributes.language].attLinkIsOpenTooltip);
    const attLinkIsOpenExplain = createElement(
        "label",
        note,
        vn.consts.CLASS_NAMES.attLinkIsBlankLabel.id,
        vn.consts.CLASS_NAMES.attLinkIsBlankLabel.className,
        {"isIcon":false, "text":vn.languageSet[note._attributes.language].attLinkIsOpenExplain}
    );
    attLinkIsOpenExplain.insertBefore(attLinkIsBlankCheckbox, attLinkIsOpenExplain.firstChild);
    attLinkModal.appendChild(attLinkIsOpenExplain);
    const attLinkValidCheckText = createElement(
        "span",
        note,
        vn.consts.CLASS_NAMES.attLinkValidCheckText.id,
        vn.consts.CLASS_NAMES.attLinkValidCheckText.className
    );
    const attLinkValidCheckbox = createElementInputCheckbox(
        note,
        vn.consts.CLASS_NAMES.attLinkValidCheckbox.id,
        vn.consts.CLASS_NAMES.attLinkValidCheckbox.className,
    );
    attLinkValidCheckbox.style.display = "none";
    const attModalBox = createElement(
        "div",
        note,
        vn.consts.CLASS_NAMES.attLinkFooter.id,
        vn.consts.CLASS_NAMES.attLinkFooter.className
    );
    const attLinkInsertButton = createElementButton(
        "button",
        note,
        vn.consts.CLASS_NAMES.attLinkInsertButton.id,
        vn.consts.CLASS_NAMES.attLinkInsertButton.className,
        {"isIcon":true, "text":"add_link"}
    );
    attModalBox.appendChild(attLinkValidCheckText);
    attModalBox.appendChild(attLinkValidCheckbox);
    attModalBox.appendChild(attLinkInsertButton);
    attLinkModal.appendChild(attModalBox);

    //modal att file
    const attFileModal = createElementBasic(
        "div",
        note,
        vn.consts.CLASS_NAMES.attFileModal.id,
        vn.consts.CLASS_NAMES.attFileModal.className
    );
    const attFileModalTitle = createElement(
        "div",
        note,
        vn.consts.CLASS_NAMES.attFileHeader.id,
        vn.consts.CLASS_NAMES.attFileHeader.className,
        {"isIcon":false, "text":vn.languageSet[note._attributes.language].attFileModalTitle}
    );
    attFileModal.appendChild(attFileModalTitle);
    //layout : upload file
    const attFilelayout = createElement(
        "div",
        note,
        vn.consts.CLASS_NAMES.attFilelayout.id,
        vn.consts.CLASS_NAMES.attFilelayout.className
    );
    const attFileExplain1 = createElement(
        "div",
        note,
        vn.consts.CLASS_NAMES.attFileExplain1.id,
        vn.consts.CLASS_NAMES.attFileExplain1.className,
        {"isIcon":false, "text":vn.languageSet[note._attributes.language].attFileExplain1}
    );
    attFilelayout.appendChild(attFileExplain1);
    tempElement = document.createElement("br");
    attFilelayout.appendChild(tempElement);
    const attFileUploadDivBox = document.createElement("div");
    attFileUploadDivBox.setAttribute("style","width:90%;text-align:center;margin:0 auto;");
    const attFileUploadDiv = createElementButton(
        "div",
        note,
        vn.consts.CLASS_NAMES.attFileUploadDiv.id,
        vn.consts.CLASS_NAMES.attFileUploadDiv.className,
        {"isIcon":false, "text":vn.languageSet[note._attributes.language].attFileUploadDiv}
    );
    attFileUploadDiv.addEventListener("dragover", function(event: any) {
        if(!note._elementEvents.attFileUploadDiv_onBeforeDragover(event)) return;
        (vn.events.elementEvents as any)["attFileUploadDiv_onDragover"](event);
        note._elementEvents.attFileUploadDiv_onAfterDragover(event);
        event.stopImmediatePropagation();
    });
    attFileUploadDiv.addEventListener("drop", function(event: any) {
        if(!note._elementEvents.attFileUploadDiv_onBeforeDrop(event)) return;
        (vn.events.elementEvents as any)["attFileUploadDiv_onDrop"](event);
        note._elementEvents.attFileUploadDiv_onAfterDrop(event);
        event.stopImmediatePropagation();
    });
    attFileUploadDivBox.appendChild(attFileUploadDiv);
    attFilelayout.appendChild(attFileUploadDivBox);
    const attFileUploadButtonBox = document.createElement("div");
    attFileUploadButtonBox.setAttribute("style","width:90%;text-align:right;margin:5px auto 20px auto;");
    const attFileUploadButton = createElementButton(
        "button",
        note,
        vn.consts.CLASS_NAMES.attFileUploadButton.id,
        vn.consts.CLASS_NAMES.attFileUploadButton.className,
        {"isIcon":false, "text":vn.languageSet[note._attributes.language].attFileUploadButton}
    );
    attFileUploadButtonBox.appendChild(attFileUploadButton);
    attFilelayout.appendChild(attFileUploadButtonBox);
    const attFileUpload = createElementInput(
        note,
        vn.consts.CLASS_NAMES.attFileUpload.id,
        vn.consts.CLASS_NAMES.attFileUpload.className
    );
    attFileUpload.setAttribute("type","file");
    attFileUpload.setAttribute("multiple","");
    //attFilelayout.appendChild(attFileUploadButtonBox);
    attFilelayout.appendChild(attFileUpload);
    attFileModal.appendChild(attFilelayout);
    const attFileInsertButtonBox = createElement(
        "div",
        note,
        vn.consts.CLASS_NAMES.attFileFooter.id,
        vn.consts.CLASS_NAMES.attFileFooter.className
    );
    const attFileInsertButton = createElementButton(
        "button",
        note,
        vn.consts.CLASS_NAMES.attFileInsertButton.id,
        vn.consts.CLASS_NAMES.attFileInsertButton.className,
        {"isIcon":true, "text":"attach_file"}
    );
    attFileInsertButtonBox.appendChild(attFileInsertButton);
    attFileModal.appendChild(attFileInsertButtonBox);

    //modal att image
    const attImageModal = createElementBasic(
        "div",
        note,
        vn.consts.CLASS_NAMES.attImageModal.id,
        vn.consts.CLASS_NAMES.attImageModal.className
    );
    const attImageModalTitle = createElement(
        "div",
        note,
        vn.consts.CLASS_NAMES.attImageHeader.id,
        vn.consts.CLASS_NAMES.attImageHeader.className,
        {"isIcon":false, "text":vn.languageSet[note._attributes.language].attImageModalTitle}
    );
    attImageModal.appendChild(attImageModalTitle);
    const attImageExplain1 = createElement(
        "div",
        note,
        vn.consts.CLASS_NAMES.attImageExplain1.id,
        vn.consts.CLASS_NAMES.attImageExplain1.className,
        {"isIcon":false, "text":vn.languageSet[note._attributes.language].attImageExplain1}
    );
    attImageModal.appendChild(attImageExplain1);
    tempElement = document.createElement("br");
    attImageModal.appendChild(tempElement);
    const attImageUploadButtonAndViewBox = document.createElement("div");
    attImageUploadButtonAndViewBox.setAttribute("style","width:90%;text-align:center;margin:0 auto;position:relative;");
    const attImageViewPreButtion = createElementButton(
        "button",
        note,
        vn.consts.CLASS_NAMES.attImageViewPreButtion.id,
        vn.consts.CLASS_NAMES.attImageViewPreButtion.className,
        {"isIcon":true, "text":"navigate_before"}
    );
    attImageViewPreButtion.setAttribute("style","position:absolute;top:50%;transform:translateY(-50%) translateX(1%);");
    attImageUploadButtonAndViewBox.appendChild(attImageViewPreButtion);
    const attImageUploadButtonAndView = createElementBasic(
        "div",
        note,
        vn.consts.CLASS_NAMES.attImageUploadButtonAndView.id,
        vn.consts.CLASS_NAMES.attImageUploadButtonAndView.className,
        {"isIcon":false, "text":vn.languageSet[note._attributes.language].attImageUploadButtonAndView}
    );
    attImageUploadButtonAndView.addEventListener("dragover", function(event: any) {
        if(!note._elementEvents.attImageUploadButtonAndView_onBeforeDragover(event)) return;
        (vn.events.elementEvents as any)["attImageUploadButtonAndView_onDragover"](event);
        note._elementEvents.attImageUploadButtonAndView_onAfterDragover(event);
        event.stopImmediatePropagation();
    });
    attImageUploadButtonAndView.addEventListener("drop", function(event: any) {
        if(!note._elementEvents.attImageUploadButtonAndView_onBeforeDrop(event)) return;
        (vn.events.elementEvents as any)["attImageUploadButtonAndView_onDrop"](event);
        note._elementEvents.attImageUploadButtonAndView_onAfterDrop(event);
        event.stopImmediatePropagation();
    });
    attImageUploadButtonAndViewBox.appendChild(attImageUploadButtonAndView);
    const attImageViewNextButtion = createElementButton(
        "button",
        note,
        vn.consts.CLASS_NAMES.attImageViewNextButtion.id,
        vn.consts.CLASS_NAMES.attImageViewNextButtion.className,
        {"isIcon":true, "text":"navigate_next"}
    );
    attImageViewNextButtion.setAttribute("style","position:absolute;top:50%;transform:translateY(-50%) translateX(-101%);");
    attImageUploadButtonAndViewBox.appendChild(attImageViewNextButtion);
    attImageModal.appendChild(attImageUploadButtonAndViewBox);
    const attImageUpload = createElementInput(
        note,
        vn.consts.CLASS_NAMES.attImageUpload.id,
        vn.consts.CLASS_NAMES.attImageUpload.className
    );
    attImageUpload.setAttribute("type","file");
    attImageUpload.setAttribute("multiple","");
    const attImageAcceptTypes = getCommaStrFromArr(note._attributes.attImageAcceptTypes)
    attImageUpload.setAttribute("accept", attImageAcceptTypes);	    
    attImageModal.appendChild(attImageUpload);
    const attImageExplain2 = createElement(
        "div",
        note,
        vn.consts.CLASS_NAMES.attImageExplain2.id,
        vn.consts.CLASS_NAMES.attImageExplain2.className,
        {"isIcon":false, "text":vn.languageSet[note._attributes.language].attImageExplain2}
    );
    attImageModal.appendChild(attImageExplain2);
    tempElement = document.createElement("br");
    attImageModal.appendChild(tempElement);
    const attImageURL = createElementInput(
        note,
        vn.consts.CLASS_NAMES.attImageURL.id,
        vn.consts.CLASS_NAMES.attImageURL.className
    );
    attImageURL.setAttribute("title",vn.languageSet[note._attributes.language].attImageURLTooltip);
    attImageModal.appendChild(attImageURL);
    const attImageInsertButtonBox = createElement(
        "div",
        note,
        vn.consts.CLASS_NAMES.attImageFooter.id,
        vn.consts.CLASS_NAMES.attImageFooter.className
    );
    const attImageInsertButton = createElementButton(
        "button",
        note,
        vn.consts.CLASS_NAMES.attImageInsertButton.id,
        vn.consts.CLASS_NAMES.attImageInsertButton.className,
        {"isIcon":true, "text":"image"}
    );
    attImageInsertButtonBox.appendChild(attImageInsertButton);
    attImageModal.appendChild(attImageInsertButtonBox);

    //modal att video
    const attVideoModal = createElementBasic(
        "div",
        note,
        vn.consts.CLASS_NAMES.attVideoModal.id,
        vn.consts.CLASS_NAMES.attVideoModal.className
    );
    const attVideoModalTitle = createElement(
        "div",
        note,
        vn.consts.CLASS_NAMES.attVideoHeader.id,
        vn.consts.CLASS_NAMES.attVideoHeader.className,
        {"isIcon":false, "text":vn.languageSet[note._attributes.language].attVideoModalTitle}
    );
    attVideoModal.appendChild(attVideoModalTitle);
    const attVideoExplain1 = createElement(
        "div",
        note,
        vn.consts.CLASS_NAMES.attVideoExplain1.id,
        vn.consts.CLASS_NAMES.attVideoExplain1.className,
        {"isIcon":false, "text":vn.languageSet[note._attributes.language].attVideoExplain1}
    );
    attVideoModal.appendChild(attVideoExplain1);
    const attVideoEmbedId = createElementInput(
        note,
        vn.consts.CLASS_NAMES.attVideoEmbedId.id,
        vn.consts.CLASS_NAMES.attVideoEmbedId.className
    );
    attVideoEmbedId.setAttribute("title",vn.languageSet[note._attributes.language].attVideoEmbedIdTooltip);
    attVideoModal.appendChild(attVideoEmbedId);
    const attVideoExplain2 = createElement(
        "div",
        note,
        vn.consts.CLASS_NAMES.attVideoExplain2.id,
        vn.consts.CLASS_NAMES.attVideoExplain2.className,
        {"isIcon":false, "text":vn.languageSet[note._attributes.language].attVideoExplain2}
    );
    attVideoModal.appendChild(attVideoExplain2);
    const attVideoWidthTextBox = document.createElement("div");
    attVideoWidthTextBox.setAttribute("style","padding-left:20px;color:" + note._colors.color10);
    const attVideoWidthText = createElement(
        "span",
        note,
        "",
        "modal_att_video_icon",
        {"isIcon":true, "text":"width", "iconStyle":"color:" + note._colors.color10}
    );
    attVideoWidthTextBox.appendChild(attVideoWidthText);
    const attVideoWidth  = createElementInput(
        note,
        vn.consts.CLASS_NAMES.attVideoWidth.id,
        vn.consts.CLASS_NAMES.attVideoWidth.className
    );
    attVideoWidth.setAttribute("title",vn.languageSet[note._attributes.language].attVideoWidthTooltip);
    attVideoWidth.setAttribute("type", "number");
    attVideoWidth.setAttribute("style","text-align:right;");
    attVideoWidthTextBox.appendChild(attVideoWidth);
    const attVideoWidthUnit = createElement(
        "span",
        note,
        "",
        "modal_att_video_icon",
        {"isIcon":false, "text":"%"}
    );
    attVideoWidthUnit.setAttribute("style","padding-left:10px;font-size:0.8em");
    attVideoWidthTextBox.appendChild(attVideoWidthUnit);
    attVideoModal.appendChild(attVideoWidthTextBox);
    const attVideoHeightTextBox = document.createElement("div");
    attVideoHeightTextBox.setAttribute("style","padding-left:20px;color:" + note._colors.color10);
    const attVideoHeightText = createElement(
        "span",
        note,
        "",
        "modal_att_video_icon",
        {"isIcon":true, "text":"height", "iconStyle":"color:" + note._colors.color10}
    );
    attVideoHeightTextBox.appendChild(attVideoHeightText);
    const attVideoHeight = createElementInput(
        note,
        vn.consts.CLASS_NAMES.attVideoHeight.id,
        vn.consts.CLASS_NAMES.attVideoHeight.className
    );
    attVideoHeight.setAttribute("title",vn.languageSet[note._attributes.language].attVideoHeightTooltip);
    attVideoHeight.setAttribute("type", "number");
    attVideoHeight.setAttribute("style","text-align:right;");
    attVideoHeightTextBox.appendChild(attVideoHeight);
    const attVideoHeightUnit = createElement(
        "span",
        note,
        "",
        "modal_att_video_icon",
        {"isIcon":false, "text":"px"}
    );
    attVideoHeightUnit.setAttribute("style","padding-left:10px;font-size:0.8em");
    attVideoHeightTextBox.appendChild(attVideoHeightUnit);
    attVideoModal.appendChild(attVideoHeightTextBox);
    const attVideoValidCheckText = createElement(
        "span",
        note,
        vn.consts.CLASS_NAMES.attVideoValidCheckText.id,
        vn.consts.CLASS_NAMES.attVideoValidCheckText.className
    );
    const attVideoValidCheckbox = createElementInputCheckbox(
        note,
        vn.consts.CLASS_NAMES.attVideoValidCheckbox.id,
        vn.consts.CLASS_NAMES.attVideoValidCheckbox.className
    );
    attVideoValidCheckbox.style.display = "none";
    const attVideoInsertButton = createElementButton(
        "button",
        note,
        vn.consts.CLASS_NAMES.attVideoInsertButton.id,
        vn.consts.CLASS_NAMES.attVideoInsertButton.className,
        {"isIcon":true, "text":"videocam"}
    );
    const attVideoFooter = createElement(
        "div",
        note,
        vn.consts.CLASS_NAMES.attVideoFooter.id,
        vn.consts.CLASS_NAMES.attVideoFooter.className
    );
    attVideoFooter.appendChild(attVideoValidCheckText);
    attVideoFooter.appendChild(attVideoValidCheckbox);
    attVideoFooter.appendChild(attVideoInsertButton);
    attVideoModal.appendChild(attVideoFooter);

    //att link tooltip
    const attLinkTooltip = createElement(
        "div",
        note,
        vn.consts.CLASS_NAMES.attLinkTooltip.id,
        vn.consts.CLASS_NAMES.attLinkTooltip.className
    );
    const attLinkTooltipHref = createElement(
        "a",
        note,
        vn.consts.CLASS_NAMES.attLinkTooltipHref.id,
        vn.consts.CLASS_NAMES.attLinkTooltipHref.className
    );
    attLinkTooltipHref.setAttribute("target","_blank");
    const attLinkTooltipEditButton = createElementButton(
        "span",
        note,
        vn.consts.CLASS_NAMES.attLinkTooltipEditButton.id,
        vn.consts.CLASS_NAMES.attLinkTooltipEditButton.className,
        {"isIcon":true, "text":"add_link", "iconStyle":"font-size:0.9em"}
    );
    const attLinkTooltipUnlinkButton = createElementButton(
        "span",
        note,
        vn.consts.CLASS_NAMES.attLinkTooltipUnlinkButton.id,
        vn.consts.CLASS_NAMES.attLinkTooltipUnlinkButton.className,
        {"isIcon":true, "text":"link_off", "iconStyle":"font-size:0.9em"}
    );
    attLinkTooltip.appendChild(attLinkTooltipEditButton);
    attLinkTooltip.appendChild(attLinkTooltipUnlinkButton);
    attLinkTooltip.appendChild(attLinkTooltipHref);

    //att image tooltip
    const attImageAndVideoTooltip = createElement(
        "div",
        note,
        vn.consts.CLASS_NAMES.attImageAndVideoTooltip.id,
        vn.consts.CLASS_NAMES.attImageAndVideoTooltip.className
    );
    const attImageAndVideoTooltipWidthAndFloatBox = document.createElement("div");
    const attImageAndVideoTooltipWidthText = document.createElement("span");
    attImageAndVideoTooltipWidthText.setAttribute("class",getClassName(note._noteName, note.id, "small_text_box"));
    attImageAndVideoTooltipWidthText.setAttribute("style","padding: 0 0 0 10px;");
    attImageAndVideoTooltipWidthText.textContent = vn.languageSet[note._attributes.language].attImageAndVideoTooltipWidthInput;
    attImageAndVideoTooltipWidthAndFloatBox.appendChild(attImageAndVideoTooltipWidthText);
    const attImageAndVideoTooltipWidthInput = createElementInput(
        note,
        vn.consts.CLASS_NAMES.attImageAndVideoTooltipWidthInput.id,
        vn.consts.CLASS_NAMES.attImageAndVideoTooltipWidthInput.className
    );
    attImageAndVideoTooltipWidthInput.addEventListener("keyup", function(event: any) {
        if(!note._elementEvents.attImageAndVideoTooltipWidthInput_onBeforeKeyup(event)) return;
        (vn.events.elementEvents as any)["attImageAndVideoTooltipWidthInput_onKeyup"](event);
        note._elementEvents.attImageAndVideoTooltipWidthInput_onAfterKeyup(event);
        event.stopImmediatePropagation();
    });
    attImageAndVideoTooltipWidthInput.setAttribute("type","number");
    attImageAndVideoTooltipWidthAndFloatBox.appendChild(attImageAndVideoTooltipWidthInput);
    const attImageAndVideoTooltipWidthUnit = document.createElement("span");
    attImageAndVideoTooltipWidthUnit.setAttribute("class",getClassName(note._noteName, note.id, "small_text_box"));
    attImageAndVideoTooltipWidthUnit.setAttribute("style","padding: 0;");
    attImageAndVideoTooltipWidthUnit.textContent = "%";
    attImageAndVideoTooltipWidthAndFloatBox.appendChild(attImageAndVideoTooltipWidthUnit);
    const attImageAndVideoTooltipFloatRadioBox = document.createElement("span");
    attImageAndVideoTooltipFloatRadioBox.setAttribute("class",getClassName(note._noteName, note.id, "small_text_box"));
    attImageAndVideoTooltipFloatRadioBox.textContent = vn.languageSet[note._attributes.language].attImageAndVideoTooltipFloatRadio;
    attImageAndVideoTooltipWidthAndFloatBox.appendChild(attImageAndVideoTooltipFloatRadioBox);
    const attImageAndVideoTooltipFloatRadioNone = createElementInputRadio(
        note,
        vn.consts.CLASS_NAMES.attImageAndVideoTooltipFloatRadioNone.id,
        vn.consts.CLASS_NAMES.attImageAndVideoTooltipFloatRadioNone.className,
        getId(note._noteName, note.id, "attImageAndVideoTooltipFloatRadio")
    );
    attImageAndVideoTooltipWidthAndFloatBox.appendChild(attImageAndVideoTooltipFloatRadioNone);
    const attImageAndVideoTooltipFloatRadioNoneLabel = createElementRadioLabel(
        note,
        getId(note._noteName, note.id, vn.consts.CLASS_NAMES.attImageAndVideoTooltipFloatRadioNone.id),
        "close"
    );
    attImageAndVideoTooltipWidthAndFloatBox.appendChild(attImageAndVideoTooltipFloatRadioNoneLabel);
    const attImageAndVideoTooltipFloatRadioLeft = createElementInputRadio(
        note,
        vn.consts.CLASS_NAMES.attImageAndVideoTooltipFloatRadioLeft.id,
        vn.consts.CLASS_NAMES.attImageAndVideoTooltipFloatRadioLeft.className,
        getId(note._noteName, note.id, "attImageAndVideoTooltipFloatRadio")
    );
    attImageAndVideoTooltipWidthAndFloatBox.appendChild(attImageAndVideoTooltipFloatRadioLeft);
    const attImageAndVideoTooltipFloatRadioLeftLabel = createElementRadioLabel(
        note,
        getId(note._noteName, note.id, vn.consts.CLASS_NAMES.attImageAndVideoTooltipFloatRadioLeft.id),
        "art_track"
    );
    attImageAndVideoTooltipWidthAndFloatBox.appendChild(attImageAndVideoTooltipFloatRadioLeftLabel);
    const attImageAndVideoTooltipFloatRadioRight = createElementInputRadio(
        note,
        vn.consts.CLASS_NAMES.attImageAndVideoTooltipFloatRadioRight.id,
        vn.consts.CLASS_NAMES.attImageAndVideoTooltipFloatRadioRight.className,
        getId(note._noteName, note.id, "attImageAndVideoTooltipFloatRadio")
    );
    attImageAndVideoTooltipWidthAndFloatBox.appendChild(attImageAndVideoTooltipFloatRadioRight);
    const attImageAndVideoTooltipFloatRadioRightLabel = createElementRadioLabel(
        note,
        getId(note._noteName, note.id, vn.consts.CLASS_NAMES.attImageAndVideoTooltipFloatRadioRight.id),
        "burst_mode"
    );
    attImageAndVideoTooltipWidthAndFloatBox.appendChild(attImageAndVideoTooltipFloatRadioRightLabel);
    attImageAndVideoTooltip.appendChild(attImageAndVideoTooltipWidthAndFloatBox);
    const attImageAndVideoTooltipShapeBox = document.createElement("div");
    const attImageAndVideoTooltipShapeRadioBox = document.createElement("span");
    attImageAndVideoTooltipShapeRadioBox.setAttribute("class",getClassName(note._noteName, note.id, "small_text_box"));
    attImageAndVideoTooltipShapeRadioBox.textContent = vn.languageSet[note._attributes.language].attImageAndVideoTooltipShapeRadio;
    attImageAndVideoTooltipShapeBox.appendChild(attImageAndVideoTooltipShapeRadioBox);
    const attImageAndVideoTooltipShapeRadioSquare = createElementInputRadio(
        note,
        vn.consts.CLASS_NAMES.attImageAndVideoTooltipShapeRadioSquare.id,
        vn.consts.CLASS_NAMES.attImageAndVideoTooltipShapeRadioSquare.className,
        getId(note._noteName, note.id, "attImageAndVideoTooltipShapeRadio")
    );
    attImageAndVideoTooltipShapeBox.appendChild(attImageAndVideoTooltipShapeRadioSquare);
    const attImageAndVideoTooltipShapeRadioSquareLabel = createElementRadioLabel(
        note,
        getId(note._noteName, note.id, vn.consts.CLASS_NAMES.attImageAndVideoTooltipShapeRadioSquare.id),
        "crop_5_4"
    );
    attImageAndVideoTooltipShapeBox.appendChild(attImageAndVideoTooltipShapeRadioSquareLabel);
    const attImageAndVideoTooltipShapeRadioRadius = createElementInputRadio(
        note,
        vn.consts.CLASS_NAMES.attImageAndVideoTooltipShapeRadioRadius.id,
        vn.consts.CLASS_NAMES.attImageAndVideoTooltipShapeRadioRadius.className,
        getId(note._noteName, note.id, "attImageAndVideoTooltipShapeRadio")
    );
    attImageAndVideoTooltipShapeBox.appendChild(attImageAndVideoTooltipShapeRadioRadius);
    const attImageAndVideoTooltipShapeRadioRadiusLabel = createElementRadioLabel(
        note,
        getId(note._noteName, note.id, vn.consts.CLASS_NAMES.attImageAndVideoTooltipShapeRadioRadius.id),
        "aspect_ratio"
    );
    attImageAndVideoTooltipShapeBox.appendChild(attImageAndVideoTooltipShapeRadioRadiusLabel);
    const attImageAndVideoTooltipShapeRadioCircle = createElementInputRadio(
        note,
        vn.consts.CLASS_NAMES.attImageAndVideoTooltipShapeRadioCircle.id,
        vn.consts.CLASS_NAMES.attImageAndVideoTooltipShapeRadioCircle.className,
        getId(note._noteName, note.id, "attImageAndVideoTooltipShapeRadio")
    );
    attImageAndVideoTooltipShapeBox.appendChild(attImageAndVideoTooltipShapeRadioCircle);
    const attImageAndVideoTooltipShapeRadioCircleLabel = createElementRadioLabel(
        note,
        getId(note._noteName, note.id, vn.consts.CLASS_NAMES.attImageAndVideoTooltipShapeRadioCircle.id),
        "circle"
    );
    attImageAndVideoTooltipShapeBox.appendChild(attImageAndVideoTooltipShapeRadioCircleLabel);
    attImageAndVideoTooltip.appendChild(attImageAndVideoTooltipShapeBox);

    //modal help
    const helpModal = createElementBasic(
        "div",
        note,
        vn.consts.CLASS_NAMES.helpModal.id,
        vn.consts.CLASS_NAMES.helpModal.className
    );
    const helpHeader = createElement(
        "div",
        note,
        vn.consts.CLASS_NAMES.helpHeader.id,
        vn.consts.CLASS_NAMES.helpHeader.className,
        {"isIcon":false, "text":vn.languageSet[note._attributes.language].helpModalTitle}
    );
    helpModal.appendChild(helpHeader);
    const helpMain = createElement(
        "div",
        note,
        vn.consts.CLASS_NAMES.helpMain.id,
        vn.consts.CLASS_NAMES.helpMain.className
    );
    const helpMainTable = document.createElement("table");
    vn.languageSet[note._attributes.language].helpContent.forEach((h) => {
        const tr = document.createElement("tr");
        Object.keys(h).forEach((k) => {
            const td1 = document.createElement("td");
            td1.textContent = k;
            td1.setAttribute("style","width:30%;padding:0 0 6px 12px;border:none;");
            tr.appendChild(td1);
            const td2 = document.createElement("td");
            td2.setAttribute("style","width:70%;padding:0 12px 6px 12px;border:none;");
            td2.textContent = h[k];
            tr.appendChild(td2);
        })
        helpMainTable.appendChild(tr);
    });
    helpMain.appendChild(helpMainTable);
    helpModal.appendChild(helpMain);
    const helpFooter = createElement(
        "div",
        note,
        vn.consts.CLASS_NAMES.helpFooter.id,
        vn.consts.CLASS_NAMES.helpFooter.className,
    );
    helpFooter.setAttribute("style","height:25px;");
    helpModal.appendChild(helpFooter);

    //placeholder
    const placeholder = createElementBasic(
        "div",
        note,
        vn.consts.CLASS_NAMES.placeholder.id,
        vn.consts.CLASS_NAMES.placeholder.className
    );
    if(note._attributes.placeholderTitle) {
        const placeholderTitle = document.createElement("h5");
        placeholderTitle.innerText = note._attributes.placeholderTitle;
        placeholder.appendChild(placeholderTitle);
    }
    if(note._attributes.placeholderTextContent) {
        const placeholderTextContent = document.createElement("p");
        placeholderTextContent.innerText = note._attributes.placeholderTextContent;
        placeholder.appendChild(placeholderTextContent);
    }

    //append child
    modalBack.appendChild(attLinkModal);
    modalBack.appendChild(attFileModal);
    modalBack.appendChild(attImageModal);
    modalBack.appendChild(attVideoModal);
    modalBack.appendChild(helpModal);
    template.appendChild(modalBack);
    template.appendChild(placeholder);
    if(note._attributes.toolToggleUsing) {
        tool.appendChild(toolToggleButton);
    }
    tool.appendChild(paragraphStyleSelect);
    tool.appendChild(boldButton);
    tool.appendChild(underlineButton);
    tool.appendChild(italicButton);
    tool.appendChild(ulButton);
    tool.appendChild(olButton);
    tool.appendChild(textAlignSelect);
    tool.appendChild(attLinkButton);
    tool.appendChild(attFileButton);
    tool.appendChild(attImageButton);
    tool.appendChild(attVideoButton);
    tool.appendChild(fontSizeInputBox);
    tool.appendChild(letterSpacingInputBox);
    tool.appendChild(lineHeightInputBox);
    tool.appendChild(fontFamilySelect);
    tool.appendChild(colorTextSelect);
    tool.appendChild(colorBackSelect);
    tool.appendChild(formatClearButton);
    tool.appendChild(undoButton);
    tool.appendChild(redoButton);
    tool.appendChild(helpButton);
    if(note._attributes.toolPosition === ToolPosition.bottom) {
        template.appendChild(textarea);
        template.appendChild(attLinkTooltip);
        template.appendChild(attImageAndVideoTooltip);
        template.appendChild(tool);
    }
    else {
        template.appendChild(tool);
        template.appendChild(attLinkTooltip);
        template.appendChild(attImageAndVideoTooltip);
        template.appendChild(textarea);
    }
    note.appendChild(template);

    //set value
    fontSizeInput.value = note._status.fontSize;
    letterSpacingInput.value = note._status.letterSpacing;
    lineHeightInput.value = note._status.lineHeight;

    colorTextRInput.value = note._status.colorTextR;
    colorTextGInput.value = note._status.colorTextG;
    colorTextBInput.value = note._status.colorTextB;
    colorTextOpacityInput.value = note._status.colorTextO;

    colorBackRInput.value = note._status.colorBackR;
    colorBackGInput.value = note._status.colorBackG;
    colorBackBInput.value = note._status.colorBackB;
    colorBackOpacityInput.value = note._status.colorBackO;

    //버튼 숨김 처리
    if(!noteAttributes.usingParagraphStyle) paragraphStyleSelect.style.display = "none";
    if(!noteAttributes.usingBold) boldButton.style.display = "none";
    if(!noteAttributes.usingUnderline) underlineButton.style.display = "none";
    if(!noteAttributes.usingItalic) italicButton.style.display = "none";
    if(!noteAttributes.usingUl) ulButton.style.display = "none";
    if(!noteAttributes.usingOl) olButton.style.display = "none";
    if(!noteAttributes.usingTextAlign) textAlignSelect.style.display = "none";
    if(!noteAttributes.usingAttLink) attLinkButton.style.display = "none";
    if(!noteAttributes.usingAttFile) attFileButton.style.display = "none";
    if(!noteAttributes.usingAttImage) attImageButton.style.display = "none";
    if(!noteAttributes.usingAttVideo) attVideoButton.style.display = "none";
    if(!noteAttributes.usingFontSize) fontSizeInputBox.style.display = "none";
    if(!noteAttributes.usingLetterSpacing) letterSpacingInputBox.style.display = "none";
    if(!noteAttributes.usingLineHeight) lineHeightInputBox.style.display = "none";
    if(!noteAttributes.usingFontFamily) fontFamilySelect.style.display = "none";
    if(!noteAttributes.usingColorText) colorTextSelect.style.display = "none";
    if(!noteAttributes.usingColorBack) colorBackSelect.style.display = "none";
    if(!noteAttributes.usingFormatClear) formatClearButton.style.display = "none";
    if(!noteAttributes.usingUndo) undoButton.style.display = "none";
    if(!noteAttributes.usingRedo) redoButton.style.display = "none";
    if(!noteAttributes.usingHelp) helpButton.style.display = "none";

    //element 정의
    note._elements = {
        template : template,
        textarea : textarea,
        tool : tool,
        toolToggleButton : toolToggleButton,
        paragraphStyleSelect : paragraphStyleSelect,
        paragraphStyleSelectBox : paragraphStyleSelectBox,
        paragraphStyleNormalButton : paragraphStyleNormalButton,
        paragraphStyleHeader1Button : paragraphStyleHeader1Button,
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
        fontSizeInputBox : fontSizeInputBox,
        fontSizeInput : fontSizeInput,
        letterSpacingInputBox : letterSpacingInputBox,
        letterSpacingInput : letterSpacingInput,
        lineHeightInputBox : lineHeightInputBox,
        lineHeightInput : lineHeightInput,
        fontFamilySelect : fontFamilySelect,
        fontFamilySelectBox : fontFamilySelectBox,
        colorTextSelect : colorTextSelect,
        colorTextSelectBox : colorTextSelectBox,
        colorTextRIcon : colorTextRIcon,
        colorTextRInput : colorTextRInput,
        colorTextGIcon : colorTextGIcon,
        colorTextGInput : colorTextGInput,
        colorTextBIcon : colorTextBIcon,
        colorTextBInput : colorTextBInput,
        colorTextOpacityIcon : colorTextOpacityIcon,
        colorTextOpacityInput : colorTextOpacityInput,
        colorText0 : colorText0,
        colorText1 : colorText1,
        colorText2 : colorText2,
        colorText3 : colorText3,
        colorText4 : colorText4,
        colorText5 : colorText5,
        colorText6 : colorText6,
        colorText7 : colorText7,
        colorBackSelect : colorBackSelect,
        colorBackSelectBox : colorBackSelectBox,
        colorBackRIcon : colorBackRIcon,
        colorBackRInput : colorBackRInput,
        colorBackGIcon : colorBackGIcon,
        colorBackGInput : colorBackGInput,
        colorBackBIcon : colorBackBIcon,
        colorBackBInput : colorBackBInput,
        colorBackOpacityIcon : colorBackOpacityIcon,
        colorBackOpacityInput : colorBackOpacityInput,
        colorBack0 : colorBack0,
        colorBack1 : colorBack1,
        colorBack2 : colorBack2,
        colorBack3 : colorBack3,
        colorBack4 : colorBack4,
        colorBack5 : colorBack5,
        colorBack6 : colorBack6,
        colorBack7 : colorBack7,
        formatClearButton : formatClearButton,
        undoButton : undoButton,
        redoButton : redoButton,
        helpButton : helpButton,
        modalBack : modalBack,
        attLinkModal : attLinkModal,
        attLinkModalTitle : attLinkModalTitle,
        attLinkInTextExplain : attLinkInTextExplain,
        attLinkText : attLinkText,
        attLinkInLinkExplain : attLinkInLinkExplain,
        attLinkHref : attLinkHref,
        attLinkIsBlankCheckbox : attLinkIsBlankCheckbox,
        attLinkIsOpenExplain : attLinkIsOpenExplain,
        attLinkValidCheckText : attLinkValidCheckText,
        attLinkValidCheckbox : attLinkValidCheckbox,
        attModalBox : attModalBox,
        attLinkInsertButton : attLinkInsertButton,
        attFileModal : attFileModal,
        attFileModalTitle : attFileModalTitle,
        attFilelayout : attFilelayout,
        attFileExplain1 : attFileExplain1,
        attFileUploadDivBox : attFileUploadDivBox,
        attFileUploadDiv : attFileUploadDiv,
        attFileUploadButtonBox : attFileUploadButtonBox,
        attFileUploadButton : attFileUploadButton,
        attFileUpload : attFileUpload,
        attFileInsertButtonBox : attFileInsertButtonBox,
        attFileInsertButton : attFileInsertButton,
        attImageModal : attImageModal,
        attImageModalTitle : attImageModalTitle,
        attImageExplain1 : attImageExplain1,
        attImageUploadButtonAndViewBox : attImageUploadButtonAndViewBox,
        attImageViewPreButtion : attImageViewPreButtion,
        attImageUploadButtonAndView : attImageUploadButtonAndView,
        attImageViewNextButtion : attImageViewNextButtion,
        attImageUpload : attImageUpload,
        attImageExplain2 : attImageExplain2,
        attImageURL : attImageURL,
        attImageInsertButtonBox : attImageInsertButtonBox,
        attImageInsertButton : attImageInsertButton,
        attVideoModal : attVideoModal,
        attVideoModalTitle : attVideoModalTitle,
        attVideoExplain1 : attVideoExplain1,
        attVideoEmbedId : attVideoEmbedId,
        attVideoExplain2 : attVideoExplain2,
        attVideoWidthTextBox : attVideoWidthTextBox,
        attVideoWidthText : attVideoWidthText,
        attVideoWidth : attVideoWidth,
        attVideoWidthUnit : attVideoWidthUnit,
        attVideoHeightTextBox : attVideoHeightTextBox,
        attVideoHeightText : attVideoHeightText,
        attVideoHeight : attVideoHeight,
        attVideoHeightUnit : attVideoHeightUnit,
        attVideoFooter : attVideoFooter,
        attVideoValidCheckText : attVideoValidCheckText,
        attVideoValidCheckbox : attVideoValidCheckbox,
        attVideoInsertButton : attVideoInsertButton,
        attLinkTooltip : attLinkTooltip,
        attLinkTooltipHref : attLinkTooltipHref,
        attLinkTooltipEditButton : attLinkTooltipEditButton,
        attLinkTooltipUnlinkButton : attLinkTooltipUnlinkButton,
        attImageAndVideoTooltip : attImageAndVideoTooltip,
        attImageAndVideoTooltipWidthAndFloatBox : attImageAndVideoTooltipWidthAndFloatBox,
        attImageAndVideoTooltipWidthText : attImageAndVideoTooltipWidthText,
        attImageAndVideoTooltipWidthInput : attImageAndVideoTooltipWidthInput,
        attImageAndVideoTooltipWidthUnit : attImageAndVideoTooltipWidthUnit,
        attImageAndVideoTooltipFloatRadioBox : attImageAndVideoTooltipFloatRadioBox,
        attImageAndVideoTooltipFloatRadioNone : attImageAndVideoTooltipFloatRadioNone,
        attImageAndVideoTooltipFloatRadioNoneLabel : attImageAndVideoTooltipFloatRadioNoneLabel,
        attImageAndVideoTooltipFloatRadioLeft : attImageAndVideoTooltipFloatRadioLeft,
        attImageAndVideoTooltipFloatRadioLeftLabel : attImageAndVideoTooltipFloatRadioLeftLabel,
        attImageAndVideoTooltipFloatRadioRight : attImageAndVideoTooltipFloatRadioRight,
        attImageAndVideoTooltipFloatRadioRightLabel : attImageAndVideoTooltipFloatRadioRightLabel,
        attImageAndVideoTooltipShapeBox : attImageAndVideoTooltipShapeBox,
        attImageAndVideoTooltipShapeRadioBox : attImageAndVideoTooltipShapeRadioBox,
        attImageAndVideoTooltipShapeRadioSquare : attImageAndVideoTooltipShapeRadioSquare,
        attImageAndVideoTooltipShapeRadioSquareLabel : attImageAndVideoTooltipShapeRadioSquareLabel,
        attImageAndVideoTooltipShapeRadioRadius : attImageAndVideoTooltipShapeRadioRadius,
        attImageAndVideoTooltipShapeRadioRadiusLabel : attImageAndVideoTooltipShapeRadioRadiusLabel,
        attImageAndVideoTooltipShapeRadioCircle : attImageAndVideoTooltipShapeRadioCircle,
        attImageAndVideoTooltipShapeRadioCircleLabel : attImageAndVideoTooltipShapeRadioCircleLabel,
        helpModal : helpModal,
        helpHeader : helpHeader,
        helpMain : helpMain,
        helpMainTable : helpMainTable,
        helpFooter : helpFooter,
        placeholder : placeholder,
    }
}

const getNoteAttribute = (vn: Vanillanote, note: VanillanoteElement): NoteAttributes => {
    //속성 정리
    //note mode by device
    let noteModeByDevice = note.getAttribute("note-mode-by-device") && ["ADAPTIVE", "MOBILE", "DESKTOP"].indexOf(note.getAttribute("note-mode-by-device")!)
     ? note.getAttribute("note-mode-by-device")!.toUpperCase() as NoteModeByDevice : vn.attributes.noteModeByDevice;
    //현재 디바이스가 모바일인지 한번 더 체크
    const isNoteByMobile = noteModeByDevice === "MOBILE" ? true
         : noteModeByDevice === "DESKTOP" ? false
         : isMobileDevice();
    let toolPosition = note.getAttribute("tool-position") && ["BOTTOM", "TOP"].indexOf(note.getAttribute("tool-position")!) >= 0
     ? note.getAttribute("tool-position") as ToolPosition : (isNoteByMobile ? ToolPosition.bottom : ToolPosition.top);
    let toolDefaultLine = checkNumber(note.getAttribute("tool-default-line")) ? Number(note.getAttribute("tool-default-line")) : (isNoteByMobile ? 2 : 1);
    let toolToggleUsing = note.getAttribute("tool-toggle") ? note.getAttribute("tool-toggle")!.toUpperCase() === "true" : (isNoteByMobile ? true : false);

    //text area size
    let textareaOriginWidth = note.getAttribute("textarea-width") ? note.getAttribute("textarea-width")! : vn.attributes.textareaOriginWidth;
    let textareaOriginHeight = note.getAttribute("textarea-height") ? note.getAttribute("textarea-height")! : vn.attributes.textareaOriginHeight;
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
    let defaultTextareaFontSize = checkNumber(note.getAttribute("default-font-size")) ? Number(note.getAttribute("default-font-size"))! : vn.attributes.defaultTextareaFontSize;
    let defaultTextareaLineHeight = checkNumber(note.getAttribute("default-line-height")) ? Number(note.getAttribute("default-line-height"))! : vn.attributes.defaultTextareaLineHeight;

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
        toolPosition :toolPosition,
        toolDefaultLine : toolDefaultLine,
        toolToggleUsing : toolToggleUsing,
        sizeRate : sizeRate,

        noteModeByDevice : noteModeByDevice,
        textareaOriginWidth : textareaOriginWidth,
        textareaOriginHeight : textareaOriginHeight,
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

const getCsses =(noteName: string, noteAttributes: NoteAttributes, noteColors: Colors): Csses => {
    if(!noteAttributes) throw new Error("Please insert variables object in VanillanoteConfig.");
    if(!noteColors) throw new Error("Please insert colors object in VanillanoteConfig.");
    
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
            "width" : noteAttributes.textareaOriginWidth,
            "height" : noteAttributes.textareaOriginHeight,
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
            "font-size" : noteAttributes.defaultTextareaFontSize + "px",
            "line-height" : noteAttributes.defaultTextareaLineHeight + "px",
            "font-family" : noteAttributes.defaultTextareaFontFamily,
            "color" : noteColors.color12,
            "transition": "height 0.5s",
        },
        "tool" : {
            "width" : noteAttributes.textareaOriginWidth,
            "height" : (noteAttributes.toolDefaultLine * (noteAttributes.sizeRate * 50)) + "px",
            "padding" : "2px 0",
            "max-width" : noteAttributes.textareaMaxWidth,
            "display" : "block",
            "line-height" : (noteAttributes.sizeRate * 50) + "px",
            "margin" : "0 auto",
            "text-align" : "left",
            "vertical-align" : "middle",
            "box-shadow" : "0.25px 0.25px 1px 0.5px " + noteColors.color7,
            "font-size" : (noteAttributes.sizeRate * 16) + "px",
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
            "width" : (noteAttributes.sizeRate * 50) + "px",
            "height" : (noteAttributes.sizeRate * 45) + "px",
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
            "width" : (noteAttributes.sizeRate * 150) + "px",
            "height" : (noteAttributes.sizeRate * 45) + "px",
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
            "min-width" : (noteAttributes.sizeRate * 150) + "px",
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
            "width" : (noteAttributes.sizeRate * 50) + "px",
            "display" : " none",
            "float" : "left",
            "position" : "absolute",
            "cursor" : "pointer",
            "border-radius" : "5px",
            "z-index" : "200",
        },
        "select_box_c" : {
            "width" : (noteAttributes.sizeRate * 220 + 30) + "px",
            "display" : "none",
            "padding" : "0 " + (noteAttributes.sizeRate * 10) + "px",
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
            "height" : (noteAttributes.sizeRate * 45) + "px",
            "margin" : "0 !important",
            "line-height" : (noteAttributes.sizeRate * 45) + "px !important",
            "padding" : "3px 5px", 
            "cursor" : "pointer",
            "text-align" : "left",
            "overflow" : "hidden",
        },
        "select_list_button" : {
            "width" : (noteAttributes.sizeRate * 50) + "px",
            "height" : (noteAttributes.sizeRate * 45) + "px",
            "background-color" : noteColors.color4,
            "display" : "inline-block",
            "cursor" : "pointer",
            "border-radius" : "5px",
            "box-shadow" : "0px 0.25px 0.1em " + noteColors.color7,
        },
        "small_input_box" : {
            "width" : (noteAttributes.sizeRate * 120) + "px",
            "height" : (noteAttributes.sizeRate * 45) + "px",
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
            "min-width" : (noteAttributes.sizeRate * 50) + "px",
            "height" : (noteAttributes.sizeRate * 45) + "px",
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
            "min-width" : (noteAttributes.sizeRate * 40) + "px",
            "height" : (noteAttributes.sizeRate * 40) + "px",
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
            "font-size" : (noteAttributes.sizeRate * 16) + "px",
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
            "padding-top" : (noteAttributes.sizeRate * 20) + "px",
            "padding-right" : (noteAttributes.sizeRate * 10) + "px",
            "padding-bottom" : (noteAttributes.sizeRate * 20) + "px",
            "padding-left" : (noteAttributes.sizeRate * 20) + "px",
            "margin-bottom" : (noteAttributes.sizeRate * 10) + "px",
            "background-color" : noteColors.color4,
            "border-radius" : "20px 20px 0 0",
            "font-weight" : "bold",
            "font-size" : "1.05em",
        },
        "modal_footer" : {
            "text-align" : "right",
            "margin-top" : (noteAttributes.sizeRate * 10) + "px",
            "padding-top" : (noteAttributes.sizeRate * 10) + "px",
            "padding-right" : (noteAttributes.sizeRate * 10) + "px",
            "padding-bottom" : (noteAttributes.sizeRate * 10) + "px",
            "padding-left" : (noteAttributes.sizeRate * 10) + "px",
            "border-top" : "1px solid " + noteColors.color6,
        },
        "modal_explain" : {
            "font-size" : "0.95em",
            "text-align" : "left",
            "padding-top" : (noteAttributes.sizeRate * 20) + "px",
            "padding-bottom" : (noteAttributes.sizeRate * 10) + "px",
            "padding-left" : (noteAttributes.sizeRate * 20) + "px",
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
            "margin-bottom" : (noteAttributes.sizeRate * 10) + "px",
            "margin-left" : (noteAttributes.sizeRate * 20) + "px",
            "font-size" : "1.05em",
            "animation" : noteName + "-modal-input 0.7s forwards"
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
            "margin-bottom" : (noteAttributes.sizeRate * 10) + "px",
            "margin-left" : (noteAttributes.sizeRate * 20) + "px",
            "font-size" : "1.05em",
            "animation" : noteName + "-modal-small-input 1s forwards"
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
            "margin-top" : (noteAttributes.sizeRate * 10) + "px",
            "margin-bottom" : (noteAttributes.sizeRate * 10) + "px",
            "margin-left" : (noteAttributes.sizeRate * 15) + "px",
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
            "height" : noteAttributes.sizeRate * 120 + "px",
            "display" : "inline-block",
            "margin-top" : "10px",
            "border-radius" : "5px",
            "background-color" : noteColors.color4,
            "border" : "solid 1px"+noteColors.color6,
            "line-height" : noteAttributes.sizeRate * 130 + "px",
            "font-size" : "0.8em",
            "color" : getRGBAFromHex(noteColors.color1, 0.8),
            "overflow-y" : "scroll",
            "cursor" : "pointer",
        },
        "image_view_div" : {
            "width" : "80%",
            "height" : noteAttributes.sizeRate * 120 + "px",
            "display" : "inline-block",
            "margin-top" : "10px",
            "border-radius" : "5px",
            "background-color" : noteColors.color4,
            "border" : "solid 1px"+noteColors.color6,
            "line-height" : noteAttributes.sizeRate * 130 + "px",
            "font-size" : "0.8em",
            "color" : getRGBAFromHex(noteColors.color1, 0.8),
            "cursor" : "pointer",
            "overflow" : "hidden",
            "white-space" : "nowrap",
            "scroll-behavior" : "smooth",
        },
        "color_button" : {
            "width" : (noteAttributes.sizeRate * 50) * 0.5 + "px",
            "height" : (noteAttributes.sizeRate * 45) * 0.5 + "px",
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
            "width" : (noteAttributes.sizeRate * 25) + "px",
            "height" : (noteAttributes.sizeRate * 40) + "px",
            "font-size" : "0.7em!important",
            "color": noteColors.color1,
            "border" : "none",
            "border-radius" : "5px",
            "text-align" : "right",
            "margin-right" : (noteAttributes.sizeRate * 8) + "px",
            "margin-left" : (noteAttributes.sizeRate * 2) + "px",
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
            "height" : (noteAttributes.sizeRate * 25) + "px",
            "color": noteColors.color1,
            "font-family" : noteAttributes.defaultToolFontFamily,
            "font-size" : "0.7em",
        },
        "tooltip" : {
            "width" : noteAttributes.textareaOriginWidth,
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
            "width" : (noteAttributes.sizeRate * 50) * 0.7 + "px",
            "height" : (noteAttributes.sizeRate * 45) * 0.7 + "px",
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
            "line-height" : (noteAttributes.sizeRate * 45) * 0.8 + "px",
        },
        "help_main" : {
            "max-height" : noteAttributes.textareaOriginHeight,
            "color" : noteColors.color10,
            "overflow-y" : "auto",
        },
        "placeholder" : {
            "width" : noteAttributes.textareaOriginWidth,
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
    note._elementEvents = {
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
        
        //toolToggleButton event
        toolToggleButton_onBeforeClick : function(e: any) {return true;},
        toolToggleButton_onAfterClick : function(e: any) {},
        
        //styleNomal event
        styleNomal_onBeforeClick : function(e: any) {return true;},
        styleNomal_onAfterClick : function(e: any) {},
        
        //styleHeader1 event
        styleHeader1_onBeforeClick : function(e: any) {return true;},
        styleHeader1_onAfterClick : function(e: any) {},
        
        //styleHeader2 event
        styleHeader2_onBeforeClick : function(e: any) {return true;},
        styleHeader2_onAfterClick : function(e: any) {},
        
        //styleHeader3 event
        styleHeader3_onBeforeClick : function(e: any) {return true;},
        styleHeader3_onAfterClick : function(e: any) {},
        
        //styleHeader4 event
        styleHeader4_onBeforeClick : function(e: any) {return true;},
        styleHeader4_onAfterClick : function(e: any) {},
        
        //styleHeader5 event
        styleHeader5_onBeforeClick : function(e: any) {return true;},
        styleHeader5_onAfterClick : function(e: any) {},
        
        //styleHeader6 event
        styleHeader6_onBeforeClick : function(e: any) {return true;},
        styleHeader6_onAfterClick : function(e: any) {},
        
        //boldButton event
        boldButton_onBeforeClick : function(e: any) {return true;},
        boldButton_onAfterClick : function(e: any) {},
        
        //underlineButton event
        underlineButton_onBeforeClick : function(e: any) {return true;},
        underlineButton_onAfterClick : function(e: any) {},
        
        //italicButton event
        italicButton_onBeforeClick : function(e: any) {return true;},
        italicButton_onAfterClick : function(e: any) {},
        
        //ulButton event
        ulButton_onBeforeClick : function(e: any) {return true;},
        ulButton_onAfterClick : function(e: any) {},
        
        //olButton event
        olButton_onBeforeClick : function(e: any) {return true;},
        olButton_onAfterClick : function(e: any) {},
        
        //textAlignSelect event
        textAlignSelect_onBeforeClick : function(e: any) {return true;},
        textAlignSelect_onAfterClick : function(e: any) {},
        
        //textAlignLeft event
        textAlignLeft_onBeforeClick : function(e: any) {return true;},
        textAlignLeft_onAfterClick : function(e: any) {},
        
        //textAlignCenter event
        textAlignCenter_onBeforeClick : function(e: any) {return true;},
        textAlignCenter_onAfterClick : function(e: any) {},
        
        //textAlignRight event
        textAlignRight_onBeforeClick : function(e: any) {return true;},
        textAlignRight_onAfterClick : function(e: any) {},
        
        //attLinkButton event
        attLinkButton_onBeforeClick : function(e: any) {return true;},
        attLinkButton_onAfterClick : function(e: any) {},
        
        //attFileButton event
        attFileButton_onBeforeClick : function(e: any) {return true;},
        attFileButton_onAfterClick : function(e: any) {},
        
        //attImageButton event
        attImageButton_onBeforeClick : function(e: any) {return true;},
        attImageButton_onAfterClick : function(e: any) {},
        
        //attVideoButton event
        attVideoButton_onBeforeClick : function(e: any) {return true;},
        attVideoButton_onAfterClick : function(e: any) {},
        
        //fontSizeInputBox event
        fontSizeInputBox_onBeforeClick : function(e: any) {return true;},
        fontSizeInputBox_onAfterClick : function(e: any) {},
        
        //fontSizeInput event
        fontSizeInput_onBeforeClick : function(e: any) {return true;},
        fontSizeInput_onAfterClick : function(e: any) {},
        fontSizeInput_onBeforeInput : function(e: any) {return true;},
        fontSizeInput_onAfterInput : function(e: any) {},
        fontSizeInput_onBeforeBlur : function(e: any) {return true;},
        fontSizeInput_onAfterBlur : function(e: any) {},
        
        //letterSpacingInputBox event
        letterSpacingInputBox_onBeforeClick : function(e: any) {return true;},
        letterSpacingInputBox_onAfterClick : function(e: any) {},
        
        //letterSpacingInput event
        letterSpacingInput_onBeforeClick : function(e: any) {return true;},
        letterSpacingInput_onAfterClick : function(e: any) {},
        letterSpacingInput_onBeforeInput : function(e: any) {return true;},
        letterSpacingInput_onAfterInput : function(e: any) {},
        letterSpacingInput_onBeforeBlur : function(e: any) {return true;},
        letterSpacingInput_onAfterBlur : function(e: any) {},
        
        //lineHeightInputBox event
        lineHeightInputBox_onBeforeClick : function(e: any) {return true;},
        lineHeightInputBox_onAfterClick : function(e: any) {},
        
        //lineHeightInput event
        lineHeightInput_onBeforeClick : function(e: any) {return true;},
        lineHeightInput_onAfterClick : function(e: any) {},
        lineHeightInput_onBeforeInput : function(e: any) {return true;},
        lineHeightInput_onAfterInput : function(e: any) {},
        lineHeightInput_onBeforeBlur : function(e: any) {return true;},
        lineHeightInput_onAfterBlur : function(e: any) {},
        
        //fontFamilySelect event
        fontFamilySelect_onBeforeClick : function(e: any) {return true;},
        fontFamilySelect_onAfterClick : function(e: any) {},
        
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
        
        //formatClearButton event
        formatClearButton_onBeforeClick : function(e: any) {return true;},
        formatClearButton_onAfterClick : function(e: any) {},
        
        //undo event
        undoButton_onBeforeClick : function(e: any) {return true;},
        undoButton_onAfterClick : function(e: any) {},
        
        //redo event
        redoButton_onBeforeClick : function(e: any) {return true;},
        redoButton_onAfterClick : function(e: any) {},
        
        //help event
        helpButton_onBeforeClick : function(e: any) {return true;},
        helpButton_onAfterClick : function(e: any) {},
        
        //modal back event
        modalBack_onBeforeClick : function(e: any) {return true;},
        modalBack_onAfterClick : function(e: any) {},
        
        //modal att link event
        attLinkModal_onBeforeClick : function(e: any) {return true;},
        attLinkModal_onAfterClick : function(e: any) {},
        
        //modal att link text input event
        attLinkText_onBeforeInput : function(e: any) {return true;},
        attLinkText_onAfterInput : function(e: any) {},
        attLinkText_onBeforeBlur : function(e: any) {return true;},
        attLinkText_onAfterBlur : function(e: any) {},
        
        //modal att link href input event
        attLinkHref_onBeforeInput : function(e: any) {return true;},
        attLinkHref_onAfterInput : function(e: any) {},
        attLinkHref_onBeforeBlur : function(e: any) {return true;},
        attLinkHref_onAfterBlur : function(e: any) {},
        
        //modal att link insert button event
        attLinkInsertButton_onBeforeClick : function(e: any) {return true;},
        attLinkInsertButton_onAfterClick : function(e: any) {},
        
        //modal att file event
        attFileModal_onBeforeClick : function(e: any) {return true;},
        attFileModal_onAfterClick : function(e: any) {},
        
        //modal att file upload button event
        attFileUploadButton_onBeforeClick : function(e: any) {return true;},
        attFileUploadButton_onAfterClick : function(e: any) {},
        
        //modal att file upload div event
        attFileUploadDiv_onBeforeDragover : function(e: any) {return true;},
        attFileUploadDiv_onAfterDragover : function(e: any) {},
        attFileUploadDiv_onBeforeDrop : function(e: any) {return true;},
        attFileUploadDiv_onAfterDrop : function(e: any) {},
        attFileUploadDiv_onBeforeClick : function(e: any) {return true;},
        attFileUploadDiv_onAfterClick : function(e: any) {},
        
        //modal att file upload input event
        attFileUpload_onBeforeInput : function(e: any) {return true;},
        attFileUpload_onAfterInput : function(e: any) {},
        attFileUpload_onBeforeBlur : function(e: any) {return true;},
        attFileUpload_onAfterBlur : function(e: any) {},
        
        //modal att file insert button event
        attFileInsertButton_onBeforeClick : function(e: any) {return true;},
        attFileInsertButton_onAfterClick : function(e: any) {},
        
        //att link tooltip edit button event
        attLinkTooltipEditButton_onBeforeClick : function(e: any) {return true;},
        attLinkTooltipEditButton_onAfterClick : function(e: any) {},
        
        //att link tooltip unlink button event
        attLinkTooltipUnlinkButton_onBeforeClick : function(e: any) {return true;},
        attLinkTooltipUnlinkButton_onAfterClick : function(e: any) {},
        
        //modal att image event
        attImageModal_onBeforeClick : function(e: any) {return true;},
        attImageModal_onAfterClick : function(e: any) {},
        
        //modal att image upload button and view event
        attImageUploadButtonAndView_onBeforeDragover : function(e: any) {return true;},
        attImageUploadButtonAndView_onAfterDragover : function(e: any) {},
        attImageUploadButtonAndView_onBeforeDrop : function(e: any) {return true;},
        attImageUploadButtonAndView_onAfterDrop : function(e: any) {},
        attImageUploadButtonAndView_onBeforeClick : function(e: any) {return true;},
        attImageUploadButtonAndView_onAfterClick : function(e: any) {},
        
        //modal att image view pre button event
        attImageViewPreButtion_onBeforeClick : function(e: any) {return true;},
        attImageViewPreButtion_onAfterClick : function(e: any) {},
        
        //modal att image view next button event
        attImageViewNextButtion_onBeforeClick : function(e: any) {return true;},
        attImageViewNextButtion_onAfterClick : function(e: any) {},
        
        //modal att image upload input event
        attImageUpload_onBeforeInput : function(e: any) {return true;},
        attImageUpload_onAfterInput : function(e: any) {},
        attImageUpload_onBeforeBlur : function(e: any) {return true;},
        attImageUpload_onAfterBlur : function(e: any) {},
        
        //modal att image url input event
        attImageURL_onBeforeInput : function(e: any) {return true;},
        attImageURL_onAfterInput : function(e: any) {},
        attImageURL_onBeforeBlur : function(e: any) {return true;},
        attImageURL_onAfterBlur : function(e: any) {},
        
        //modal att image insert button event
        attImageInsertButton_onBeforeClick : function(e: any) {return true;},
        attImageInsertButton_onAfterClick : function(e: any) {},
        
        //modal att video event
        attVideoModal_onBeforeClick : function(e: any) {return true;},
        attVideoModal_onAfterClick : function(e: any) {},
        
        //modal att video embed id input event
        attVideoEmbedId_onBeforeInput : function(e: any) {return true;},
        attVideoEmbedId_onAfterInput : function(e: any) {},
        attVideoEmbedId_onBeforeBlur : function(e: any) {return true;},
        attVideoEmbedId_onAfterBlur : function(e: any) {},
        
        //modal att video width input event
        attVideoWidth_onBeforeInput : function(e: any) {return true;},
        attVideoWidth_onAfterInput : function(e: any) {},
        attVideoWidth_onBeforeBlur : function(e: any) {return true;},
        attVideoWidth_onAfterBlur : function(e: any) {},
        
        //modal att video height input event
        attVideoHeight_onBeforeInput : function(e: any) {return true;},
        attVideoHeight_onAfterInput : function(e: any) {},
        attVideoHeight_onBeforeBlur : function(e: any) {return true;},
        attVideoHeight_onAfterBlur : function(e: any) {},
        
        //modal att video insert button event
        attVideoInsertButton_onBeforeClick : function(e: any) {return true;},
        attVideoInsertButton_onAfterClick : function(e: any) {},
        
        //att image tooltip width input event
        attImageAndVideoTooltipWidthInput_onBeforeInput : function(e: any) {return true;},
        attImageAndVideoTooltipWidthInput_onAfterInput : function(e: any) {},
        attImageAndVideoTooltipWidthInput_onBeforeBlur : function(e: any) {return true;},
        attImageAndVideoTooltipWidthInput_onAfterBlur : function(e: any) {},
        attImageAndVideoTooltipWidthInput_onBeforeKeyup : function(e: any) {return true;},
        attImageAndVideoTooltipWidthInput_onAfterKeyup : function(e: any) {},
        
        //att image tooltip float none radio input event
        attImageAndVideoTooltipFloatRadioNone_onBeforeClick : function(e: any) {return true;},
        attImageAndVideoTooltipFloatRadioNone_onAfterClick : function(e: any) {},
        
        //att image tooltip float left radio input event
        attImageAndVideoTooltipFloatRadioLeft_onBeforeClick : function(e: any) {return true;},
        attImageAndVideoTooltipFloatRadioLeft_onAfterClick : function(e: any) {},
        
        //att image tooltip float right radio input event
        attImageAndVideoTooltipFloatRadioRight_onBeforeClick : function(e: any) {return true;},
        attImageAndVideoTooltipFloatRadioRight_onAfterClick : function(e: any) {},
        
        //att image tooltip shape square radio input event
        attImageAndVideoTooltipShapeRadioSquare_onBeforeClick : function(e: any) {return true;},
        attImageAndVideoTooltipShapeRadioSquare_onAfterClick : function(e: any) {},
        
        //att image tooltip shape radius radio input event
        attImageAndVideoTooltipShapeRadioRadius_onBeforeClick : function(e: any) {return true;},
        attImageAndVideoTooltipShapeRadioRadius_onAfterClick : function(e: any) {},
        
        //att image tooltip shape circle radio input event
        attImageAndVideoTooltipShapeRadioCircle_onBeforeClick : function(e: any) {return true;},
        attImageAndVideoTooltipShapeRadioCircle_onAfterClick : function(e: any) {},
        
        //modal help event
        helpModal_onBeforeClick : function(e: any) {return true;},
        helpModal_onAfterClick : function(e: any) {},
        
        //placeholder event
        placeholder_onBeforeClick : function(e: any) {return true;},
        placeholder_onAfterClick : function(e: any) {},
    }
}
