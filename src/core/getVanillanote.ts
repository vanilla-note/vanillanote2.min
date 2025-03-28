import type { Consts } from "../types/consts";
import type { Colors } from "../types/csses";
import type { LanguageSet } from "../types/language";
import type { Vanillanote, VanillanoteConfig } from "../types/vanillanote";
import type { Variables } from "../types/variables";
import type { Attributes } from "../types/attributes";
import { NoteModesByDevice } from "../types/enums";
import { createVanillanote } from "./createVanillanote";
import { destroyVanillanote } from "./destroyVanillanote";

let singletonVanillanote: Vanillanote | null = null;
export const getVanillanote = (config?: VanillanoteConfig): Vanillanote => {
    if (singletonVanillanote) return singletonVanillanote;

    const deepFreeze = <T>(obj: T): T => {
        // 먼저 자신을 freeze
        Object.freeze(obj);
        
        // 프로퍼티를 순회하며 객체인 경우 재귀적으로 freeze
        Object.getOwnPropertyNames(obj).forEach((prop) => {
            const value = (obj as any)[prop];
            if (
            value &&
            typeof value === 'object' &&
            !Object.isFrozen(value)
            ) {
            deepFreeze(value);
            }
        });
        
        return obj;
    }

    const consts: Consts = deepFreeze({
        // Start possible tags
        START_POSSIBLE_TAG : ["P","H1","H2","H3","H4","H5","H6","OL","UL","BR","DIV","PRE","BLOCKQUOTE","TABLE"],
        // Unit tags for edit
        UNIT_TAG : ["P","H1","H2","H3","H4","H5","H6","LI","DIV","PRE","BLOCKQUOTE","TH","TD"],
        // Tags with a double structure
        DOUBLE_TAG : ["UL","OL"],
        // Tags that are not single
        NOT_SINGLE_TAG : ["P","H1","H2","H3","H4","H5","H6","OL","UL","LI","DIV","PRE","BLOCKQUOTE"],
        // Specially managed tags
        SPECIAL_TAG: ["A","IMG","IFRAME"],
        // Tags that are automatically converted by the browser during style conversion
        AUTO_MODIFY_TAG : ["B","U"],
        // Tags that allow text whitespace (regularly delete the tag if the text is whitespace)
        EMPTY_ABLE_TAG : ["BR","IMG","IFRAME","INPUT","I"],
        // Keys (id, className) of elements
        CLASS_NAMES : {
            template : { id : "template", className : "template", },
            textarea : { id : "textarea", className : "textarea", },
            tool : { id : "tool", className : "tool", },
            toolToggleButton : { id : "toolToggleButton", className : "button", },
            paragraphStyleSelect : { id : "paragraphStyleSelect", className : "select", },
            paragraphStyleSelectBox : { id : "paragraphStyleSelectBox", className : "select_box_a", },
            styleNomal : { id : "styleNomal", className : "select_list", },
            styleHeader1 : { id : "styleHeader1", className : "select_list", },
            styleHeader2 : { id : "styleHeader2", className : "select_list", },
            styleHeader3 : { id : "styleHeader3", className : "select_list", },
            styleHeader4 : { id : "styleHeader4", className : "select_list", },
            styleHeader5 : { id : "styleHeader5", className : "select_list", },
            styleHeader6 : { id : "styleHeader6", className : "select_list", },
            boldButton : { id : "boldButton", className : "button", },
            underlineButton : { id : "underlineButton", className : "button", },
            italicButton : { id : "italicButton", className : "button", },
            ulButton : { id : "ulButton", className : "button", },
            olButton : { id : "olButton", className : "button", },
            textAlignSelect : { id : "textAlignSelect", className : "button", },
            textAlignSelectBox : { id : "textAlignSelectBox", className : "select_box_b", },
            textAlignLeft : { id : "textAlignLeft", className : "select_list_button", },
            textAlignCenter : { id : "textAlignCenter", className : "select_list_button", },
            textAlignRight : { id : "textAlignRight", className : "select_list_button", },
            attLinkButton : { id : "attLinkButton", className : "button", },
            attFileButton : { id : "attFileButton", className : "button", },
            attImageButton : { id : "attImageButton", className : "button", },
            attVideoButton : { id : "attVideoButton", className : "button", },
            fontSizeInputBox : { id : "fontSizeInputBox", className : "small_input_box", },
            fontSizeInput : { id : "fontSizeInput", className : "small_input", },
            letterSpacingInputBox : { id : "letterSpacingInputBox", className : "small_input_box", },
            letterSpacingInput : { id : "letterSpacingInput", className : "small_input", },
            lineHeightInputBox : { id : "lineHeightInputBox", className : "small_input_box", },
            lineHeightInput : { id : "lineHeightInput", className : "small_input", },
            fontFamilySelect : { id : "fontFamilySelect", className : "select", },
            fontFamilySelectBox : { id : "fontFamilySelectBox", className : "select_box_a", },
            fontFamily : { id : "fontFamily_", className : "select_list", },
            colorTextSelect : { id : "colorTextSelect", className : "button", },
            colorTextSelectBox : { id : "colorTextSelectBox", className : "select_box_c", },
            colorText0 : { id : "colorText0", className : "color_button", },
            colorText1 : { id : "colorText1", className : "color_button", },
            colorText2 : { id : "colorText2", className : "color_button", },
            colorText3 : { id : "colorText3", className : "color_button", },
            colorText4 : { id : "colorText4", className : "color_button", },
            colorText5 : { id : "colorText5", className : "color_button", },
            colorText6 : { id : "colorText6", className : "color_button", },
            colorText7 : { id : "colorText7", className : "color_button", },
            colorTextRInput : { id : "colorTextRInput", className : "color_input", },
            colorTextRExplain : { id : "colorTextRExplain", className : "color_explain", },
            colorTextGInput : { id : "colorTextGInput", className : "color_input", },
            colorTextGExplain : { id : "colorTextGExplain", className : "color_explain", },
            colorTextBInput : { id : "colorTextBInput", className : "color_input", },
            colorTextBExplain : { id : "colorTextBExplain", className : "color_explain", },
            colorTextOpacityInput : { id : "colorTextOpacityInput", className : "color_input", },
            colorTextOpacityExplain : { id : "colorTextOpacityExplain", className : "color_explain", },
            colorBackSelect : { id : "colorBackSelect", className : "button", },
            colorBackSelectBox : { id : "colorTextSelectBox", className : "select_box_c", },
            colorBack0 : { id : "colorBack0", className : "color_button", },
            colorBack1 : { id : "colorBack1", className : "color_button", },
            colorBack2 : { id : "colorBack2", className : "color_button", },
            colorBack3 : { id : "colorBack3", className : "color_button", },
            colorBack4 : { id : "colorBack4", className : "color_button", },
            colorBack5 : { id : "colorBack5", className : "color_button", },
            colorBack6 : { id : "colorBack6", className : "color_button", },
            colorBack7 : { id : "colorBack7", className : "color_button", },
            colorBackRInput : { id : "colorBackRInput", className : "color_input", },
            colorBackRExplain : { id : "colorBackRExplain", className : "color_explain", },
            colorBackGInput : { id : "colorBackGInput", className : "color_input", },
            colorBackGExplain : { id : "colorBackGExplain", className : "color_explain", },
            colorBackBInput : { id : "colorBackBInput", className : "color_input", },
            colorBackBExplain : { id : "colorBackBExplain", className : "color_explain", },
            colorBackOpacityInput : { id : "colorBackOpacityInput", className : "color_input", },
            colorBackOpacityExplain : { id : "colorBackOpacityExplain", className : "color_explain", },
            formatClearButton : { id : "formatClearButton", className : "button", },
            undoButton : { id : "undoButton", className : "button", },
            redoButton : { id : "redoButton", className : "button", },
            helpButton : { id : "helpButton", className : "button", },
            modalBack : { id : "modalBack", className : "modal_back", },
            attLinkModal : { id : "attLinkModal", className : "modal_body", },
            attLinkHeader : { id : "attLinkHeader", className : "modal_header", },
            attLinkFooter : { id : "attLinkFooter", className : "modal_footer", },
            attLinkExplain1 : { id : "attLinkExplain1", className : "modal_explain", },
            attLinkText : { id : "attLinkText", className : "modal_input", },
            attLinkExplain2 : { id : "attLinkExplain2", className : "modal_explain", },
            attLinkHref : { id : "attLinkHref", className : "modal_input", },
            attLinkIsBlankLabel : { id : "attLinkIsBlankLabel", className : "att_link_is_blank_label", },
            attLinkIsBlankCheckbox : { id : "attLinkIsBlankCheckbox", className : "input_checkbox", },
            attLinkValidCheckText : { id : "attLinkValidChecktext", className : "att_valid_checktext", },
            attLinkValidCheckbox : { id : "attLinkValidCheckbox", className : "input_checkbox", },
            attLinkInsertButton : { id : "attLinkInsertButton", className : "normal_button", },
            attLinkTooltip : { id : "attLinkTooltip", className : "tooltip", },
            attLinkTooltipHref : { id : "attLinkTooltipHref", className : "att_link_tooltip_href", },
            attLinkTooltipEditButton : { id : "attLinkTooltipEditButton", className : "tooltip_button", },
            attLinkTooltipUnlinkButton : { id : "attLinkTooltipUnlinkButton", className : "tooltip_button", },
            attFileModal : { id : "attFileModal", className : "modal_body", },
            attFileHeader : { id : "attFileHeader", className : "modal_header", },
            attFilelayout : { id : "attFilelayout", className : "modal_layout", },
            attFileExplain1 : { id : "attFileExplain1", className : "modal_explain", },
            attFileUploadButton : { id : "attFileUploadButton", className : "normal_button", },
            attFileUploadDiv : { id : "attFileUploadDiv", className : "drag_drop_div", },
            attFileUpload : { id : "attFileUpload", className : "modal_input_file", },
            attFileInsertButton : { id : "attFileInsertButton", className : "normal_button", },
            attFileFooter : { id : "attFileFooter", className : "modal_footer", },
            attImageModal : { id : "attImageModal", className : "modal_body", },
            attImageHeader : { id : "attImageHeader", className : "modal_header", },
            attImageExplain1 : { id : "attImageExplain1", className : "modal_explain", },
            attImageExplain2 : { id : "attImageExplain2", className : "modal_explain", },
            attImageUploadButtonAndView : { id : "attImageUploadButtonAndView", className : "image_view_div", },
            attImageViewPreButtion : { id : "attImageViewPreButtion", className : "opacity_button", },
            attImageViewNextButtion : { id : "attImageViewNextButtion", className : "opacity_button", },
            attImageUpload : { id : "attImageUpload", className : "modal_input_file", },
            attImageURL : { id : "attImageURL", className : "modal_input", },
            attImageInsertButton : { id : "attImageInsertButton", className : "normal_button", },
            attImageFooter : { id : "attImageFooter", className : "modal_footer", },
            attVideoModal : { id : "attVideoModal", className : "modal_body", },
            attVideoHeader : { id : "attVideoHeader", className : "modal_header", },
            attVideoExplain1 : { id : "attVideoExplain1",className : "modal_explain", },
            attVideoEmbedId : { id : "attVideoEmbedId", className : "modal_input", },
            attVideoExplain2 : { id : "attVideoExplain2", className : "modal_explain", },
            attVideoWidth : { id : "attVideoWidth", className : "modal_small_input", },
            attVideoHeight : { id : "attVideoHeight", className : "modal_small_input", },
            attVideoValidCheckText : { id : "attVideoValidCheckText", className : "att_valid_checktext", },
            attVideoValidCheckbox : { id : "attVideoValidCheckbox", className : "input_checkbox", },
            attVideoInsertButton : { id : "attVideoInsertButton", className : "normal_button", },
            attVideoFooter : { id : "attVideoFooter", className : "modal_footer", },
            attImageAndVideoTooltip : { id : "attImageAndVideoTooltip", className : "tooltip", },
            attImageAndVideoTooltipWidthInput : { id : "attImageAndVideoTooltipWidthInput", className : "smallpx_input", },
            attImageAndVideoTooltipFloatRadioNone : { id : "attImageAndVideoTooltipFloatRadioNone", className : "input_radio", },
            attImageAndVideoTooltipFloatRadioLeft : { id : "attImageAndVideoTooltipFloatRadioLeft", className : "input_radio", },
            attImageAndVideoTooltipFloatRadioRight : { id : "attImageAndVideoTooltipFloatRadioRight", className : "input_radio", },
            attImageAndVideoTooltipShapeRadioSquare : { id : "attImageAndVideoTooltipShapeRadioSquare", className : "input_radio", },
            attImageAndVideoTooltipShapeRadioRadius : { id : "attImageAndVideoTooltipShapeRadioRadius", className : "input_radio", },
            attImageAndVideoTooltipShapeRadioCircle : { id : "attImageAndVideoTooltipShapeRadioCircle", className : "input_radio", },
            helpModal : { id : "helpModal", className : "modal_body", },
            helpMain : { id : "helpMain", className : "help_main", },
            helpHeader : { id : "helpHeader", className : "modal_header", },
            helpFooter : { id : "helpFooter", className : "modal_footer", },
            placeholder : { id : "placeholder", className : "placeholder", },
        },
    });

    if(!config) config = getVanillanoteConfig();
    const colors: Colors = config.colors;
    const attributes: Attributes = config.attributes;
    const variables: Variables = config.variables;
    const languageSet: LanguageSet = config.languageSet;
    
    singletonVanillanote = {
        consts : consts,
        colors : colors,
        attributes : attributes,
        variables : variables,
        languageSet : languageSet,
        documentEvents : { selectionchange: null, keydown: null, resize: null, resizeViewport: null },
        vanillanoteElements : {},
        get(noteId: string) {return null},
        beforeAlert(message: string) {return true},
        create(element?: HTMLElement) {
            createVanillanote(singletonVanillanote!, element);
        },
        destroy(element?: HTMLElement) {
            destroyVanillanote(singletonVanillanote!, element);
        },
    };

    return singletonVanillanote;
}

export const getVanillanoteConfig =(): VanillanoteConfig => {
    const attribute: Attributes = {
        noteModeByDevice: NoteModesByDevice.adaptive,
        textareaOriginWidths : "100%",
        textareaOriginHeights : "500px",
        textareaMaxWidth : "100%",
        textareaMaxHeight : "900px",
        textareaHeightIsModify: false,
        placeholderIsVisible : false,
        placeholderAddTop : 0,
        placeholderAddLeft : 0,
        placeholderWidth : "",
        attFilePreventTypes : [],
        attFileAcceptTypes : [],
        attFileMaxSizes : 50 * 1024 * 1024,
        attImagePreventTypes : [],
        attImageAcceptTypes : [
            "image/png", "image/jpeg", "image/bmp", "image/gif", "image/svg+xml",
            "image/tiff", "image/x-icon", "image/vnd.microsoft.icon", "image/webp","image/heif",
            "image/heic", "image/jp2", "image/avif", "video/mp4", "video/webm",
            "video/ogg", "video/avi", "video/mpeg", "video/quicktime", "video/x-ms-wmv",
            "video/x-flv", "video/3gpp", "video/3gpp2", "video/x-matroska"
        ],
        attImageMaxSizes : 50 * 1024 * 1024,
        defaultTextareaFontSize: "16px",
        defaultTextareaLineHeight: "16px",
        defaultTextareaFontFamily: "Georgia",
        defaultToolFontFamily: "Georgia",
        language : "ENG",

        placeholderColor: "",
        placeholderBackgroundColor: "",
        placeholderTitle: "",
        placeholderTextContent: "",

        defaultFontFamilies: ["Arial","Arial Black","Arial Narrow","Comic Sans MS","Courier","Georgia","Impact"],

        sizeLevelDesktop: 3,
        sizeLevelMobile: 7,
        recodeLimit: 100,
        mainColor: "",
        colorSet: "",
        invertColor: false,
        usingParagraphStyle: true,
        usingBold: true,
        usingUnderline: true,
        usingItalic: true,
        usingUl: true,
        usingOl: true,
        usingTextAlign: true,
        usingAttLink: true,
        usingAttFile: true,
        usingAttImage: true,
        usingAttVideo: true,
        usingFontSize: true,
        usingLetterSpacing: true,
        usingLineHeight: true,
        usingFontFamily: true,
        usingColorText: true,
        usingColorBack: true,
        usingFormatClear: true,
        usingUndo: true,
        usingRedo: true,
        usingHelp: true,
    }
    const variables: Variables = {
        noteName : "vanillanote",
        observerOptions : {characterData: true, childList: true, subtree: true},
        useMobileActiveMode : true,
        // lastActiveNote : 0,
        lastScreenHeight : null,
        mobileKeyboardExceptHeight : null,
        isSelectionProgress : false,
        preventChangeScroll : 0,
        resizeInterval : 50,
        inputInterval : 50,
        loadInterval : 100,
        canEvents : true,
    };
    const colors: Colors = {
        color1 : "#333333", //filled
        color2 : "#ffffff", //empty
        color3 : "#f8f8f8", //toolbar
        color4 : "#f4f4f4", //button
        color5 : "#cbcbcb", //active
        color6 : "#cfcfcf", //border
        color7 : "#6f6f6f", //box-shadow
        color8 : "#609966", //correct
        color9 : "#ea5455", //notice
        color10 : "#333333", //modal text
        color11 : "#666666", //a tag color
        color12 : "#333333", //color 0 text 
        color13 : "#ffffff", //color 0 text 
        color14 : "#ff7f7f", //color 1
        color15 : "#ffad66", //color 2
        color16 : "#ffff66", //color 3
        color17 : "#99ff99", //color 4
        color18 : "#99ccff", //color 5
        color19 : "#6699cc", //color 6
        color20 : "#cc99cc", //color 7
    };
    const languageSet: LanguageSet = {
        ENG : {
            textareaTooltip : "HELLO VANILLANOTE!",
            thanks : "Thank you!",
            styleTooltip : "Please let me know your style.",
            boldTooltip : "This is a bold button.",
            underlineTooltip : "This is a under line button.",
            italicTooltip : "This is a italic button.",
            ulTooltip : "This is a ul button.",
            olTooltip : "This is a ol button.",
            textAlignTooltip : "Select your text align.",
            attLinkTooltip : "This is a attach link button.",
            attFileTooltip : "This is a attach file button.",
            attImageTooltip : "This is a attach image button.",
            attVideoTooltip : "This is a attach video button.",
            fontSizeTooltip : "Please let me know the font size.",
            letterSpacingTooltip : "Please let me know the letter spacing.",
            lineHeightTooltip : "Please let me know the line height.",
            fontFamilyTooltip : "Please let me know your font family.",
            colorTextTooltip : "This is a text color button.",
            colorBackTooltip : "This is a background color button.",
            formatClearButtonTooltip : "clear your format.",
            undoTooltip : "undo",
            redoTooltip : "redo",
            helpTooltip : "What can i help you.",
            attLinkModalTitle : "INSERT LINK",
            attLinkInTextExplain : "Text to display",
            attLinkInLinkExplain : "To what URL should this link go?",
            attLinkIsOpenExplain : "   Open in new window",
            attLinkInTextTooltip : "Please let me know the text.",
            attLinkInLinkTooltip : "Please let me know the link.",
            attLinkIsOpenTooltip : "Does it open in a new window?",
            attFileModalTitle : "INSERT FILE",
            attFileExplain1 : "Please upload your file",
            attFileUploadButton : "file upload",
            attFileUploadDiv : "drop your files!",
            attFileListTooltip : "remove",
            attImageModalTitle : "INSERT IMAGE",
            attImageUploadButtonAndView : "Image upload",
            attImageExplain1 : "Please upload your image",
            attImageExplain2 : "URL",
            attImageURLTooltip : "Please let me know the URL.",
            attOverSize : "The file exceeds the allowed size.",
            attPreventType : "The file is not of an allowed type.",
            attVideoModalTitle : "INSERT YOUTUBE",
            attVideoExplain1 : "Youtube Embed Id",
            attVideoExplain2 : "Check your size",
            attVideoEmbedIdTooltip : "Please let me know the embed id.",
            attVideoWidthTooltip : "Please let me know the width percent.",
            attVideoHeightTooltip : "Please let me know the height pixel.",
            attImageAndVideoTooltipWidthInput : "width",
            attImageAndVideoTooltipFloatRadio : "float",
            attImageAndVideoTooltipShapeRadio : "Shape",
            helpModalTitle : "Help",
            helpContent : [
                {"ctrl + z" : "Undo the last command"},
                {"ctrl + y" : "Redo the last command"},
                {"ctrl + b" : "Set a bold style"},
                {"ctrl + u" : "Set a underline style"},
                {"ctrl + i" : "Set a italic style"},
                {"enter" : "Add new line as new block"},
                {"shift + enter" : "Add new line in now block"},
                {"etc1" : "On mobile, you can only change the style after dragging."},
                {"etc2" : "Uploading a video requires using the YouTube embed id."},
            ],
        },
        KOR : {
            textareaTooltip : "",
            thanks : "감사합니다!",
            styleTooltip : "문단 스타일",
            boldTooltip : "굵게",
            underlineTooltip : "밑줄",
            italicTooltip : "기울게",
            ulTooltip : "목록",
            olTooltip : "번호 목록",
            textAlignTooltip : "수평 정렬",
            attLinkTooltip : "링크 첨부",
            attFileTooltip : "파일 첨부",
            attImageTooltip : "이미지 첨부",
            attVideoTooltip : "동영상 첨부",
            fontSizeTooltip : "글자 크기",
            letterSpacingTooltip : "자간",
            lineHeightTooltip : "수직 넓기",
            fontFamilyTooltip : "글씨체",
            colorTextTooltip : "글자 색상",
            colorBackTooltip : "배경 색상",
            formatClearButtonTooltip : "효과 제거",
            undoTooltip : "실행 취소",
            redoTooltip : "다시 실행",
            helpTooltip : "도움말",
            attLinkModalTitle : "링크 삽입",
            attLinkInTextExplain : "보여질 문장을 넣어주세요.",
            attLinkInLinkExplain : "이동할 링크를 넣어주세요.",
            attLinkIsOpenExplain : "   새창열기?",
            attLinkInTextTooltip : "문장을 넣어주세요.",
            attLinkInLinkTooltip : "링크를 넣어주세요.",
            attLinkIsOpenTooltip : "클릭 시 새로운 창에서 열립니다.",
            attFileModalTitle : "파일 삽입",
            attFileExplain1 : "파일을 업로드 해주세요.",
            attFileUploadButton : "파일 선택",
            attFileUploadDiv : "파일을 떨궈 주세요.",
            attFileListTooltip : "삭제",
            attImageModalTitle : "이미지 삽입",
            attImageUploadButtonAndView : "이미지 선택",
            attImageExplain1 : "이미지를 업로드 해주세요.",
            attImageExplain2 : "URL",
            attImageURLTooltip : "URL을 지정 해주세요.",
            attOverSize : "파일은 허용 용량을 초과했습니다.",
            attPreventType : "파일은 허용된 유형이 아닙니다.",
            attVideoModalTitle : "유튜브 삽입",
            attVideoExplain1 : "Youtube Embed Id",
            attVideoExplain2 : "프레임 크기",
            attVideoEmbedIdTooltip : "유튜브 embed id를 알려주세요.",
            attVideoWidthTooltip : "%",
            attVideoHeightTooltip : "PX",
            attImageAndVideoTooltipWidthInput : "가로",
            attImageAndVideoTooltipFloatRadio : "띄우기",
            attImageAndVideoTooltipShapeRadio : "모양",
            helpModalTitle : "질문",
            helpContent : [
                {"ctrl + z" : "실행취소"},
                {"ctrl + y" : "다시실행"},
                {"ctrl + b" : "굵게"},
                {"ctrl + u" : "밑줄"},
                {"ctrl + i" : "기울게"},
                {"enter" : "새로운 블럭에 새로운 라인은 추가합니다."},
                {"shift + enter" : "기존 블럭에 새로운 라인을 추가합니다."},
                {"etc1" : "모바일에서는 드래그 후 스타일 적용만 가능합니다."},
                {"etc2" : "동영상 업로드는 YouTube embed id를 활용해야 합니다."},
            ],
        },
    };
    const vanillanoteConfig: VanillanoteConfig = {
        colors: colors,
        languageSet: languageSet,
        attributes: attribute,
        variables: variables,
        beforeAlert: (message: string) => {return true;}
    };
    return vanillanoteConfig;
}
