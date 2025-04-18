import type { Vanillanote, VanillanoteConfig, VanillanoteElement } from "../types/vanillanote";
import type { Consts } from "../types/consts";
import type { Colors } from "../types/csses";
import type { LanguageSet } from "../types/language";
import type { Variables } from "../types/variables";
import type { Attributes } from "../types/attributes";
import type { Handler } from "../types/handler";
import { NoteModeByDevice } from "../types/enums";
import { mountVanillanote } from "./mountVanillanote";
import { unmountVanillanote } from "./unmountVanillanote";
import { setDocumentEvents } from "../events/setDocumentEvent";
import { setCssEvents } from "../events/setCssEvent";
import { setElementEvents } from "../events/setElementEvent";
import { setHandleCreateElement } from "../utils/createElement";
import { setHandleHandleActive } from "../utils/handleActive";
import { setHandleHandleElement } from "../utils/handleElement";
import { setHandleHandleSelection } from "../utils/handleSelection";

let singletonVanillanote: Vanillanote | null = null;
const handler = {
    setAttTempFileValid(note: VanillanoteElement) {},
    setAttFileUploadDiv(note: VanillanoteElement) {},
    setAttTempImageValid(note: VanillanoteElement) {},
    setAttImageUploadAndView(note: VanillanoteElement) {},
    createElement(elementTag: string, note: VanillanoteElement, id: string, className: string, appendNodeSetObject?: any) {},
    createElementBasic(elementTag: string, note: VanillanoteElement, id: string, className: string, appendNodeSetObject?: any) {},
    createElementButton(elementTag: string, note: VanillanoteElement, id: string, className: string, appendNodeSetObject?: any) {},
    createElementSelect(elementTag: string, note: VanillanoteElement, id: string, className: string, appendNodeSetObject?: any) {},
    createElementInput(note: VanillanoteElement, id: string, className: string,) {},
    createElementInputCheckbox(note: VanillanoteElement, id: string, className: string) {},
    createElementInputRadio(note: VanillanoteElement, id: string, className: string, name: string) {},
    createElementRadioLabel(note: VanillanoteElement, forId: string, iconName: string) {},
    createElementFontFamiliySelect(elementTag: string, note: VanillanoteElement, id: string, className: string, appendNodeSetObject?: any) {},
    addClickEvent(element: HTMLElement, id: string, note: VanillanoteElement,) {},
    addMouseoverEvent(element: any, note: VanillanoteElement) {},
    addMouseoutEvent(element: any, note: VanillanoteElement) {},
    addTouchstartEvent(element: any, note: VanillanoteElement) {},
    addTouchendEvent(element: any, note: VanillanoteElement) {},
    onEventDisable(vn: Vanillanote, type: string) {},
    replaceDifferentBetweenElements(vn: Vanillanote, oldEl: any, newEl: any) {},
    compareAttributesBetweenEl(el1: any, el2: any) {},
    compareStylesBetweenEl(el1: any, el2: any) {},
    getAttributesObjectFromElement(element: any) {},
    getSpecialTag(el: any, note: VanillanoteElement) {},
    getParentUnitTagElemnt(el: any, note: VanillanoteElement) {},
    getParentTagName(el: any, note: VanillanoteElement) {},
    getObjectEditElementAttributes(el: any, note: VanillanoteElement) {},
    getObjectEditElementCss(el: any, note: VanillanoteElement) {},
    getEditElementTag(note: VanillanoteElement) {},
    getPreviousElementsUntilNotTag(startEl: any, tag: string, consts: Consts) {},
    getNextElementsUntilNotTag(startEl: any, tag: string, consts: Consts) {},
    setTagToggle(note: VanillanoteElement, tag: string) {},
    initToggleButtonVariables(note: VanillanoteElement) {},
    isInNote(el: any) {},
    getElementReplaceTag(element: any, tag: string) {},
    removeDoubleTag(note: VanillanoteElement, element: any) {},
    getElement(text: string, tagName: string, cssText: string, attributes: Record<string, string>, note: VanillanoteElement) {},
    setEditNodeAndElement(note: VanillanoteElement, setElement: any, compareElement: any) {},
    removeEmptyElment(el: any, note: VanillanoteElement) {},
    editUnitCheck(note: VanillanoteElement) {},
    doEditUnitCheck(note: VanillanoteElement) {},
    connectObserver(vn: Vanillanote) {},
    isElementInParentBounds(parent: any, child: any) {},
    validCheckAttLink(note: VanillanoteElement) {},
    validCheckAttVideo(note: VanillanoteElement) {},
    initAttLink(note: VanillanoteElement) {},
    initAttFile(note: VanillanoteElement) {},
    initAttImage(note: VanillanoteElement) {},
    getObjectNoteCss(note: VanillanoteElement) {},
    showAlert(message: string, beforeAlert: ((message: string) => boolean)) {},
    recodeNote(note: VanillanoteElement) {},
    closeAllTooltip(note: VanillanoteElement) {},
    setVariableButtonTogle(note: VanillanoteElement, cssObject: Record<string, string>) {},
    button_onToggle(target: any, toggle: boolean) {},
    allButtonToggle(note: VanillanoteElement) {},
    selectToggle(target: any, _note?: VanillanoteElement) {},
    closeAllSelectBoxes(note: VanillanoteElement) {},
    fontFamilySelectList_onClick(e: any, _note?: VanillanoteElement) {},
    setEditStyleTag(note: VanillanoteElement) {},
    setElementScroll(parentElement: any, childElement: any, mobileKeyboardExceptHeight: number) {},
    getCheckSelectBoxesOpened(note: VanillanoteElement) {},
    closeAllModal(note: VanillanoteElement) {},
    openAttLinkModal(note: VanillanoteElement) {},
    openPlaceholder(note: VanillanoteElement) {},
    closePlaceholder(note: VanillanoteElement) {},
    setAllModalSize(note: VanillanoteElement) {},
    setPlaceholderSize(note: VanillanoteElement) {},
    setAllToolTipPosition(note: VanillanoteElement) {},
    appearAttLinkToolTip(note: VanillanoteElement) {},
    appearAttImageAndVideoTooltip(note: VanillanoteElement) {},
    setImageAndVideoWidth(el: any) {},
    setAllToolSize(note: VanillanoteElement) {},
    doDecreaseTextareaHeight(note: VanillanoteElement) {},
    doIncreaseTextareaHeight(vn: Vanillanote) {},
    modifyTextareaScroll(textarea: any, note: VanillanoteElement) {},
    initTextarea(textarea: HTMLTextAreaElement) {},
    setNewSelection(startNode: Node, startOffset: number, endNode: Node, endOffset: number) {},
    handleSpecialTagSelection(note: VanillanoteElement) {},
    setOriginEditSelection(note: VanillanoteElement) {},
    setEditSelection(note: VanillanoteElement, selection: Selection) {},
    isValidSelection(note: VanillanoteElement) {},
    modifySeletedElements(note: VanillanoteElement) {},
    modifySelectedUnitElementTag(target: any, _note?: VanillanoteElement) {},
    modifySelectedUnitElementStyle(target: any, _note?: VanillanoteElement) {},
    modifySelectedSingleElement(note: VanillanoteElement, csses: Record<string, string> | null, tagName?: string, attributes?: Record<string, string>) {},
    textarea_onBeforeinputSpelling(e: any) {},
    textarea_onKeydownEnter(target: any) {},
} as Handler;

/**
 * Creates or retrieves the singleton `Vanillanote` instance for the page.
 *
 * This function is responsible for initializing the core Vanillanote object, setting up constants, configurations,
 * language sets, variables, event placeholders, and default properties. It ensures that only a single instance
 * of Vanillanote exists across the application (Singleton Pattern).
 *
 * - If the Vanillanote instance already exists, the same instance will be returned without reinitialization.
 * - Otherwise, a new instance is created based on the provided configuration or the default configuration.
 * - Internal constants such as supported tags, editable units, and button mappings are deeply frozen to prevent accidental modification.
 *
 * ### Parameters
 * @param config - *(Optional)* A `VanillanoteConfig` object to customize the colors, languages, variables, and attributes of the editor.  
 * If omitted, `getVanillanoteConfig()` will be called internally to supply the default settings.
 *
 * ### Returns
 * - A `Vanillanote` object containing:
 *   - Constants (`consts`)
 *   - UI styles (`colors`)
 *   - Language packs (`languageSet`)
 *   - Runtime variables (`variables`)
 *   - Event handler placeholders
 *   - DOM element references
 *   - Utility methods: `init()`, `mountNote()`, `unmountNote()`, `destroy()`
 *
 * ### Usage
 * ```typescript
 * import { getVanillanote } from 'vanillanote2';
 * 
 * const vn = getVanillanote();
 * vn.init();
 * vn.mountNote(document.getElementById('my-editor-wrapper'));
 * ```
 *
 * ### Notes
 * - `init()` must be called exactly once to attach global document events and resources (e.g., Google Fonts).
 * - `mountNote()` attaches editors to the target DOM.
 * - `unmountNote()` detaches editors.
 * - `destroy()` removes all resources and clears the Vanillanote singleton.
 * - Designed to support both CSR (client-side rendering) and SSR (server-side rendering) environments.
 *
 * ### Internal Behavior
 * - `deepFreeze()` is used to recursively freeze critical constants like `consts` to ensure immutability.
 * - Event handlers and internal element states are initialized but left as `null` until activated during runtime.
 *
 * @example
 * // Quick Initialization
 * const vn = getVanillanote();
 * vn.init();
 * vn.mountNote();
 * ```
 */
export const getVanillanote = (config?: VanillanoteConfig): Vanillanote => {
    if (singletonVanillanote) return singletonVanillanote;

    const deepFreeze = <T>(obj: T): T => {
        Object.freeze(obj);
        
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
        events : {
            documentEvents : {
                noteObserver: null,
                selectionchange: null,
                keydown: null,
                resize: null,
                resizeViewport: null
            },
            cssEvents : {
                target_onClick : null,
                target_onMouseover : null,
                target_onMouseout : null,
                target_onTouchstart : null,
                target_onTouchend : null,
            },
            elementEvents : {
                toolToggleButton_onClick : null,
                paragraphStyleSelect_onClick : null,
                styleNomal_onClick : null,
                styleHeader1_onClick : null,
                styleHeader2_onClick : null,
                styleHeader3_onClick : null,
                styleHeader4_onClick : null,
                styleHeader5_onClick : null,
                styleHeader6_onClick : null,
                boldButton_onClick : null,
                underlineButton_onClick : null,
                italicButton_onClick : null,
                ulButton_onClick : null,
                olButton_onClick : null,
                textAlignSelect_onClick : null,
                textAlignLeft_onClick : null,
                textAlignCenter_onClick : null,
                textAlignRight_onClick : null,
                attLinkButton_onClick : null,
                attLinkModal_onClick : null,
                attLinkText_onInput : null,
                attLinkText_onBlur : null,
                attLinkHref_onInput : null,
                attLinkHref_onBlur : null,
                attLinkInsertButton_onClick : null,
                attLinkTooltipEditButton_onClick : null,
                attLinkTooltipUnlinkButton_onClick : null,
                attFileButton_onClick : null,
                attFileModal_onClick : null,
                attFileUploadButton_onClick : null,
                attFileUploadDiv_onDragover : null,
                attFileUploadDiv_onDrop : null,
                attFileUploadDiv_onClick : null,
                attFileUpload_onInput : null,
                attFileUpload_onBlur : null,
                attFileInsertButton_onClick : null,
                attImageButton_onClick : null,
                attImageModal_onClick : null,
                attImageUploadButtonAndView_onDragover : null,
                attImageUploadButtonAndView_onDrop : null,
                attImageUploadButtonAndView_onClick : null,
                attImageViewPreButtion_onClick : null,
                attImageViewNextButtion_onClick : null,
                attImageUpload_onInput : null,
                attImageUpload_onBlur : null,
                attImageURL_onInput : null,
                attImageURL_onBlur : null,
                attImageInsertButton_onClick : null,
                attVideoButton_onClick : null,
                attVideoModal_onClick : null,
                attVideoEmbedId_onInput : null,
                attVideoEmbedId_onBlur : null,
                attVideoWidth_onInput : null,
                attVideoWidth_onBlur : null,
                attVideoHeight_onInput : null,
                attVideoHeight_onBlur : null,
                attVideoInsertButton_onClick : null,
                attImageAndVideoTooltipWidthInput_onInput : null,
                attImageAndVideoTooltipWidthInput_onBlur : null,
                attImageAndVideoTooltipWidthInput_onKeyup : null,
                attImageAndVideoTooltipFloatRadioNone_onClick : null,
                attImageAndVideoTooltipFloatRadioLeft_onClick : null,
                attImageAndVideoTooltipFloatRadioRight_onClick : null,
                attImageAndVideoTooltipShapeRadioSquare_onClick : null,
                attImageAndVideoTooltipShapeRadioRadius_onClick : null,
                attImageAndVideoTooltipShapeRadioCircle_onClick : null,
                fontSizeInputBox_onClick : null,
                fontSizeInput_onClick : null,
                fontSizeInput_onInput : null,
                fontSizeInput_onBlur : null,
                letterSpacingInputBox_onClick : null,
                letterSpacingInput_onClick : null,
                letterSpacingInput_onInput : null,
                letterSpacingInput_onBlur : null,
                lineHeightInputBox_onClick : null,
                lineHeightInputBox_onInput : null,
                lineHeightInput_onClick : null,
                lineHeightInput_onInput : null,
                lineHeightInput_onBlur : null,
                fontFamilySelect_onClick : null,
                colorTextSelect_onClick : null,
                colorTextSelectBox_onClick : null,
                colorTextRInput_onClick : null,
                colorTextRInput_onInput : null,
                colorTextRInput_onBlur : null,
                colorTextGInput_onClick : null,
                colorTextGInput_onInput : null,
                colorTextGInput_onBlur : null,
                colorTextBInput_onClick : null,
                colorTextBInput_onInput : null,
                colorTextBInput_onBlur : null,
                colorTextOpacityInput_onClick : null,
                colorTextOpacityInput_onInput : null,
                colorTextOpacityInput_onBlur : null,
                colorText0_onClick : null,
                colorText1_onClick : null,
                colorText2_onClick : null,
                colorText3_onClick : null,
                colorText4_onClick : null,
                colorText5_onClick : null,
                colorText6_onClick : null,
                colorText7_onClick : null,
                colorBackSelect_onClick : null,
                colorBackSelectBox_onClick : null,
                colorBackRInput_onClick : null,
                colorBackRInput_onInput : null,
                colorBackRInput_onBlur : null,
                colorBackGInput_onClick : null,
                colorBackGInput_onInput : null,
                colorBackGInput_onBlur : null,
                colorBackBInput_onClick : null,
                colorBackBInput_onInput : null,
                colorBackBInput_onBlur : null,
                colorBackOpacityInput_onClick : null,
                colorBackOpacityInput_onInput : null,
                colorBackOpacityInput_onBlur : null,
                colorBack0_onClick : null,
                colorBack1_onClick : null,
                colorBack2_onClick : null,
                colorBack3_onClick : null,
                colorBack4_onClick : null,
                colorBack5_onClick : null,
                colorBack6_onClick : null,
                colorBack7_onClick : null,
                formatClearButton_onClick : null,
                undoButton_onClick : null,
                redoButton_onClick : null,
                helpButton_onClick : null,
                helpModal_onClick : null,
                modalBack_onClick : null,
                placeholder_onClick : null,
                textarea_onClick : null,
                textarea_onFocus : null,
                textarea_onBlur : null,
                textarea_onKeydown : null,
                textarea_onKeyup : null,
                textarea_onBeforeinput : null,
            }
        },
        vanillanoteElements : {},
        getNote(noteId: string) {return null},
        beforeAlert(message: string) {return true},
        init() {initVanillanote();},
        mountNote(element?: HTMLElement) {},
        destroy() {destroyVanillanote();},
        unmountNote(element?: HTMLElement) {},
        _initialized: false,
    };
    singletonVanillanote.mountNote = (element?: HTMLElement) => {
        mountVanillanote(singletonVanillanote as Vanillanote, handler, element);
    };
    singletonVanillanote.unmountNote = (element?: HTMLElement) => {
        unmountVanillanote(singletonVanillanote as Vanillanote, element);
    };

    return singletonVanillanote;
}

const initVanillanote = () => {
    if(!singletonVanillanote || singletonVanillanote._initialized) return;
    singletonVanillanote._initialized = true;

    setHandleCreateElement(singletonVanillanote, handler);
    setHandleHandleActive(singletonVanillanote, handler);
    setHandleHandleElement(singletonVanillanote, handler);
    setHandleHandleSelection(singletonVanillanote, handler);

    //The logic for using document, window and navigator to use getVanillanote in an SSR environment is declared below.
    singletonVanillanote.variables.lastScreenHeight =  typeof window !== 'undefined' && window.visualViewport ? window.visualViewport.height : null;
    singletonVanillanote.getNote = (noteId: string): VanillanoteElement | null => {
        return singletonVanillanote!.vanillanoteElements[noteId] ? singletonVanillanote!.vanillanoteElements[noteId] : null;
    };
    
    //animation 등록
    const animationStyleId = `${singletonVanillanote.variables.noteName}_animation_styles-sheet`;
    if (!document.getElementById(animationStyleId)) {
        const cssText = `
          @keyframes ${singletonVanillanote.variables.noteName}-modal-input {
            0% { width: 30%; }
            100% { width: 80%; }
          }
          @keyframes ${singletonVanillanote.variables.noteName}-modal-small-input {
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
    const iconLinkId = singletonVanillanote.variables.noteName + "_icons-link";
    
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
    setDocumentEvents(singletonVanillanote, handler);
    setCssEvents(singletonVanillanote);
    setElementEvents(singletonVanillanote, handler);
}

const destroyVanillanote = () => {
    if(!singletonVanillanote) return;
    const noteName = singletonVanillanote.variables.noteName;

    // 1. Remove animation styles
    const animationStyle = document.getElementById(`${noteName}_animation_styles-sheet`);
    if (animationStyle) animationStyle.remove();

    // 2. Remove Google Icons Link
    const iconLink = document.getElementById(`${noteName}_icons-link`);
    if (iconLink) iconLink.remove();

    // 3. Remove document-level event listeners
    const docEvents = singletonVanillanote.events.documentEvents;
    if (docEvents.selectionchange)
        document.removeEventListener("selectionchange", docEvents.selectionchange);
    if (docEvents.keydown)
        document.removeEventListener("keydown", docEvents.keydown);
    if (docEvents.resize)
        window.removeEventListener("resize", docEvents.resize);
    if (docEvents.resizeViewport && window.visualViewport)
        window.visualViewport.removeEventListener("resize", docEvents.resizeViewport);

    // 4. Clear reference objects and events
    Object.keys(singletonVanillanote.vanillanoteElements).forEach((noteId) => {
        const note = singletonVanillanote!.vanillanoteElements[noteId];
        unmountVanillanote(singletonVanillanote as Vanillanote);
        delete singletonVanillanote!.vanillanoteElements[noteId];
    });

    // 5. Nullify all references in Vanillanote object
    singletonVanillanote.colors = {} as any;
    singletonVanillanote.languageSet = {} as any;
    singletonVanillanote.attributes = {} as any;
    singletonVanillanote.variables = {} as any;
    singletonVanillanote.vanillanoteElements = {};
    singletonVanillanote.events.documentEvents = {
        noteObserver: null,
        selectionchange: null,
        keydown: null,
        resize: null,
        resizeViewport: null,
    };
    singletonVanillanote.events.cssEvents = {
        target_onClick: null,
        target_onMouseover: null,
        target_onMouseout: null,
        target_onTouchstart: null,
        target_onTouchend: null,
    };
    // Clear element events
    Object.keys(singletonVanillanote.events.elementEvents).forEach((key) => {
        (singletonVanillanote!.events.elementEvents as any)[key] = null;
    });

    // 6. Replace method with empty versions
    singletonVanillanote.getNote = () => null;
    singletonVanillanote.init = () => {};
    singletonVanillanote.mountNote = () => {};
    singletonVanillanote.unmountNote = () => {};
    singletonVanillanote.destroy = () => {};

    singletonVanillanote = null;
};

/**
 * Creates and returns the default configuration object (`VanillanoteConfig`) for initializing a Vanillanote editor.
 *
 * This function prepares all configurable options related to colors, languages, runtime variables, and attributes
 * necessary for setting up the Vanillanote editor environment.  
 * It provides a fully populated default configuration, but users can modify or extend it
 * to customize the editor’s appearance, behavior, and language settings before initializing Vanillanote.
 *
 * - If no custom configuration is provided to `getVanillanote()`, the result of this function is automatically used.
 * - Developers can call this function first, modify specific fields (such as colors or default language), and then
 * pass the customized config object to `getVanillanote(config)`.
 *
 * ### Parameters
 * - None.
 *
 * ### Returns
 * - A fully initialized `VanillanoteConfig` object including:
 *   - `colors`: Predefined color themes for editor UI elements.
 *   - `languageSet`: Language packs (default: English and Korean).
 *   - `attributes`: Detailed control over behavior, upload types, tool usage, default text styling, and more.
 *   - `variables`: Internal runtime variables such as observer options and resize/input intervals.
 *   - `beforeAlert`: A hook function to customize or intercept alert dialogs (default: always returns `true`).
 *
 * ### Usage
 * ```typescript
 * import { getVanillanote, getVanillanoteConfig } from 'vanillanote2';
 * 
 * const config = getVanillanoteConfig();
 * config.colors.color1 = "#000000"; // Customize main filled color
 * config.attributes.language = "KOR"; // Switch to Korean by default
 *
 * const vn = getVanillanote(config);
 * vn.init();
 * vn.mountNote();
 * ```
 *
 * ### Notes
 * - `attributes.attFileAcceptTypes` and `attributes.attImageAcceptTypes` define allowed file types.
 * - `languageSet` supports multi-language UI customization; new languages can be added manually.
 * - `variables` such as `resizeInterval` and `inputInterval` allow tuning performance-sensitive settings.
 * - `beforeAlert` can be overridden to replace `window.alert()` with custom UI like modals or toasts.
 * - Supports easy cloning, extension, or override by users.
 *
 * ### Internal Behavior
 * - Sets default text area size (`500px` height, 100% width).
 * - Default language is English ("ENG").
 * - Accepts most common image and video formats.
 * - Default maximum file size for uploads is `50MB`.
 * - Default UI colors are lightweight and professional (e.g., grays, greens, blues).
 *
 * @example
 * // Modifying default configuration before use
 * const config = getVanillanoteConfig();
 * config.colors.color5 = "#ff0000"; // Change active color to red
 * config.attributes.defaultTextareaFontFamily = "Arial";
 * const vn = getVanillanote(config);
 * ```
 */
export const getVanillanoteConfig =(): VanillanoteConfig => {
    const attribute: Attributes = {
        noteModeByDevice: NoteModeByDevice.adaptive,
        textareaOriginWidth : "100%",
        textareaOriginHeight : "500px",
        textareaMaxWidth : "100%",
        textareaMaxHeight : "900px",
        textareaHeightIsModify: false,
        placeholderIsVisible : false,
        placeholderAddTop : 0,
        placeholderAddLeft : 0,
        placeholderWidth : "",
        attFilePreventTypes : [],
        attFileAcceptTypes : [],
        attFileMaxSize : 50 * 1024 * 1024,
        attImagePreventTypes : [],
        attImageAcceptTypes : [
            "image/png", "image/jpeg", "image/bmp", "image/gif", "image/svg+xml",
            "image/tiff", "image/x-icon", "image/vnd.microsoft.icon", "image/webp","image/heif",
            "image/heic", "image/jp2", "image/avif", "video/mp4", "video/webm",
            "video/ogg", "video/avi", "video/mpeg", "video/quicktime", "video/x-ms-wmv",
            "video/x-flv", "video/3gpp", "video/3gpp2", "video/x-matroska"
        ],
        attImageMaxSize : 50 * 1024 * 1024,
        defaultTextareaFontSize: 16,
        defaultTextareaLineHeight: 16,
        defaultTextareaFontFamily: "Georgia",
        defaultToolFontFamily: "Georgia",
        language : "ENG",
        placeholderColor: "",
        placeholderBackgroundColor: "",
        placeholderTitle: "",
        placeholderTextContent: "",
        defaultFontFamilies: ["Arial","Arial Black","Arial Narrow","Comic Sans MS","Courier","Georgia","Impact"],
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
        lastActiveNoteId : "",
        lastScreenHeight : null,
        mobileKeyboardExceptHeight : null,
        isSelectionProgress : false,
        preventChangeScroll : 0,
        resizeInterval : 50,
        inputInterval : 50,
        loadInterval : 100,
        canEvent : true,
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
        beforeAlert: (message: string) => {return true;},
    };
    return vanillanoteConfig;
}
