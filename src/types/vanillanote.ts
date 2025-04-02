import type { Attributes } from './attributes';
import type { Consts } from './consts';
import type { Colors } from './csses'
import type { CssEvents, DocumentEvents, ElementEvents } from './events';
import type { LanguageSet } from './language'
import type { Variables } from './variables';
import { ToolPosition } from './enums';

/**
 * The core object of the Vanillanote editor project.
 *
 * - This object contains all configuration, styles, elements, and runtime data necessary for the creation and management of Vanillanote editors.
 * - Created via the `getVanillanote()` function and passed to `createVanillanote(vn)` to render editors on the page.
 * - All Vanillanote instances on a single page share this single object instance.
 * - Editors can be destroyed using `destroyVanillanote(vn)`.
 *
 * The `Vanillanote` object is composed of constants, CSS definitions, color schemes, language settings, references to DOM elements, event hooks, runtime variables, and utility methods.
 */
export interface VanillanoteConfig {
	/**
	 * Color schemes for the editor's UI components.
	 * - 20 predefined color sets, each defined as an array for multi-editor customization.
	 * - Used for styling icons, backgrounds, text colors, borders, and modals.
	 * - Can be customized per editor instance for unique appearances.
	 */
	colors: Colors;
	/**
	 * Language set definitions for editor internationalization.
	 * - Allows setting tooltip texts, button labels, modal messages, and other UI strings.
	 * - New languages can be added and assigned using either the `language` attribute or by modifying `variables.languages[index]`.
	 * 
	 * @example
	 * vn.languageSet.JPN = {
	 *   Thanks: 'ありがとうございます！',
	 *   boldTooltip: '太字',
	 *   // ... other keys
	 * };
	 */
	languageSet: LanguageSet;
	/**
	 * Runtime variables and settings that manage editor creation and behavior.
	 * - Includes per-instance configurations and global values.
	 * - Properties with `[index]` support allow individual editor customization.
	 */
	variables: Variables;
	/**
	 * 
	 */
	attributes: Attributes;
    /**
     * A hook function called before displaying alert dialogs in the editor.
     * - Receives the alert message as a parameter.
     * - If this function returns `false`, the default `window.alert()` call will be prevented.
     * - Useful for customizing alert dialogs (e.g., replacing with custom modals or toast notifications).
     *
     * @param message - The alert message.
     * @returns `false` to suppress the default alert; `true` or undefined to allow it.
     *
     * @example
     * vn.beforeAlert = (message) => {
     *   // Custom alert logic here
     *   showCustomPopup(message);
     *   return false; // Prevent default alert
     * };
     */
	beforeAlert(message: string): boolean;
}

export interface Vanillanote extends VanillanoteConfig{
	/**
     * Critical constants required for the editor’s internal logic.
     * Modifying these values may cause severe errors and is not recommended.
     */
	consts: Consts;

	events: {
		/**
		 * Events applied to document
		 */
		documentEvents: DocumentEvents;
		/**
		 * Events applied to target css
		 */
		cssEvents: CssEvents;
		/**
		 * Events applied to elements
		 */
		elementEvents: ElementEvents;

	}
	/**
	 * List of vanillanote elements generated
	 */
	vanillanoteElements: Record<string, VanillanoteElement>;
	/**
	 * Retrieves a `VanillanoteElement` from the DOM by either its auto-assigned index or a custom `data-id` attribute.
	 *
	 * - When creating multiple editors on a single page, Vanillanote assigns each editor a sequential index based on DOM order.
	 * - Each editor element is automatically given:
	 *   - An `id` in the format: `${Vanillanote.variables.noteName}_[index]`
	 *   - A `data-index` attribute, which matches its creation index.
	 * - Alternatively, developers can specify a custom `data-id` attribute on the editor element in their HTML for more semantic selection.
	 *
	 * This utility function allows developers to easily retrieve a specific `VanillanoteElement` in two ways:
	 * 
	 * 1. **By `number` (auto-assigned index):**
	 *    - Pass an index number (starting from 0) to select the editor in DOM order.
	 *    - Internally uses `document.querySelectorAll('[data-vanillanote]')` and selects by the provided index.
	 *
	 * 2. **By `string` (custom ID):**
	 *    - Pass a `string` that represents the `data-id` attribute of the desired editor.
	 *    - This allows more explicit and meaningful references, especially useful in large applications with many editors.
	 *    - Example: `<div data-vanillanote data-id="my-editor"></div>`
	 *
	 * ### Why this function is useful:
	 * - It abstracts away the need for verbose DOM queries.
	 * - Ensures type safety by always returning a `VanillanoteElement`.
	 * - Allows convenient access to the editor’s programmatic API (`getNoteData()`, `getNoteIndex()`, `getNote()`) without manual casting.
	 *
	 * ### Example usage:
	 * ```ts
	 * // Using index (0-based):
	 * const vnEditorByIndex = Vanillanote.getVanillanoteElement(0);
	 * const editorData = vnEditorByIndex.getNoteData();
	 *
	 * // Using custom ID:
	 * const vnEditorById = Vanillanote.getVanillanoteElement('my-editor-id');
	 * console.log(vnEditorById.getNoteIndex());
	 * ```
	 *
	 * @param noteId - Either a numeric index representing the editor’s a string representing the `data-id` value.
	 * @returns The corresponding `VanillanoteElement` or null.
	 *
	 * @remarks
	 * - If a string is provided, the function will search for `[data-id='your-id']`.
	 * - If a number is provided, it will return the editor at that index from `document.querySelectorAll('[data-vanillanote]')`.
	 * - Ensure that the DOM contains an editor with the matching index or ID; otherwise, `undefined` may be returned.
	 */
	getNote(noteId: string): VanillanoteElement | null;

	init():void;
	mountNote(element?: HTMLElement): void;
	destroy(): void;
	unmountNote(element?: HTMLElement): void;
}

/**
 * Represents a DOM element rendered by Vanillanote.
 * 
 * - Multiple editors can be created on a single page, and each will be assigned an index automatically in the order they appear in the DOM.
 * - Each editor element will have an automatically assigned `id` following the pattern: `vanillanote_[index]`.
 * - You can retrieve editor elements by custom attributes like `data-id`.
 * - This interface extends `HTMLElement` and adds three utility methods that allow you to retrieve the editor's internal data and reference objects.
 */
export interface VanillanoteElement extends HTMLDivElement {
	_noteName: string;
	_id: string;
	_colors: Colors;
	_selection: {
		editSelection: (Selection | null);
		editRange: (Range | null);
		startOffset: (number | null);
		endOffset: (number | null);
		editStartNode: (Node | null);
		editEndNode: (Node | null);
		editStartElement: (Element | Node | null);
		editEndElement: (Element | Node | null);
		editStartUnitElement: (Element | Node | null);
		editEndUnitElement: (Element | Node | null);
		editDragUnitElement: (Element | Node | null)[];
		setEditStyleTagToggle: number;
	};
	_attributes: {
		isNoteByMobile: boolean;
		language: string;
		sizeRate: number;
		toolPosition: ToolPosition.bottom | ToolPosition.top;
		toolToggleUsing: boolean;
		toolDefaultLine: number;
		textareaOriginHeight: string;
		defaultTextareaFontSize: number;
		defaultTextareaLineHeight: number;
		defaultTextareaFontFamily: string;
		defaultFontFamilies: string[];

		attFilePreventTypes: string[];
		attFileAcceptTypes: string[];
		attFileMaxSize: number;
		attImagePreventTypes: string[];
		attImageAcceptTypes: string[];
		attImageMaxSize: number;

		placeholderIsVisible: boolean,
		placeholderWidth: string;
		placeholderAddTop: number;
		placeholderAddLeft: number;
		placeholderTitle: string;
		placeholderTextContent: string;
	}
	_status: {
		toolToggle: boolean;
		boldToggle: boolean;
		underlineToggle: boolean;
		italicToggle: boolean;
		ulToggle: boolean;
		olToggle: boolean;
		fontSize: number;
		letterSpacing: number;
		lineHeight: number;
		fontFamily: string;
		colorTextR: string;
		colorTextG: string;
		colorTextB: string;
		colorTextO: string;
		colorTextRGB: string;
		colorTextOpacity: string;
		colorBackR: string;
		colorBackG: string;
		colorBackB: string;
		colorBackO: string;
		colorBackRGB: string;
		colorBackOpacity: string;
	};
	_attTempFiles?: Record<string, File>;
	_attFiles: Record<string, File>;
	_attTempImages?: Record<string, File>;
	_attImages: Record<string, File>;
	_recodes: {
        recodeNotes: Node[],
        recodeConting: number,
        recodeLimit: number,
	};
	_elements: {
		template: HTMLDivElement,
		textarea: HTMLElement,
		tool: HTMLDivElement,
		toolToggleButton: HTMLSpanElement,
		paragraphStyleSelect: HTMLSpanElement,
		paragraphStyleSelectBox: HTMLDivElement,
		paragraphStyleNormalButton: HTMLDivElement,
		paragraphStyleHeader1Button: HTMLHeadingElement,
		paragraphStyleHeader2Button: HTMLHeadingElement,
		paragraphStyleHeader3Button: HTMLHeadingElement,
		paragraphStyleHeader4Button: HTMLHeadingElement,
		paragraphStyleHeader5Button: HTMLHeadingElement,
		paragraphStyleHeader6Button: HTMLHeadingElement,

		boldButton: HTMLSpanElement,
		underlineButton: HTMLSpanElement,
		italicButton: HTMLSpanElement,
		ulButton: HTMLSpanElement,
		olButton: HTMLSpanElement,
		textAlignSelect: HTMLSpanElement,
		textAlignSelectBox: HTMLDivElement,
		textAlignLeftButton: HTMLSpanElement,
		textAlignCenterButton: HTMLSpanElement,
		textAlignRightButton: HTMLSpanElement,
		attLinkButton: HTMLSpanElement,
		attFileButton: HTMLSpanElement,
		attImageButton: HTMLSpanElement,
		attVideoButton: HTMLSpanElement,

		fontSizeInputBox: HTMLSpanElement,
		fontSizeInput: HTMLInputElement,
		letterSpacingInputBox: HTMLSpanElement,
		letterSpacingInput: HTMLInputElement,
		lineHeightInputBox: HTMLSpanElement,
		lineHeightInput: HTMLInputElement,
		fontFamilySelect: HTMLSpanElement,
		fontFamilySelectBox: HTMLDivElement,

		colorTextSelect: HTMLSpanElement,
		colorTextSelectBox: HTMLDivElement,
		colorTextRIcon: HTMLSpanElement,
		colorTextRInput: HTMLInputElement,
		colorTextGIcon: HTMLSpanElement,
		colorTextGInput: HTMLInputElement,
		colorTextBIcon: HTMLSpanElement,
		colorTextBInput: HTMLInputElement,
		colorTextOpacityIcon: HTMLSpanElement,
		colorTextOpacityInput: HTMLInputElement,
		colorText0: HTMLDivElement,
		colorText1: HTMLDivElement,
		colorText2: HTMLDivElement,
		colorText3: HTMLDivElement,
		colorText4: HTMLDivElement,
		colorText5: HTMLDivElement,
		colorText6: HTMLDivElement,
		colorText7: HTMLDivElement,

		colorBackSelect: HTMLSpanElement,
		colorBackSelectBox: HTMLDivElement,
		colorBackRIcon: HTMLSpanElement,
		colorBackRInput: HTMLInputElement,
		colorBackGIcon: HTMLSpanElement,
		colorBackGInput: HTMLInputElement,
		colorBackBIcon: HTMLSpanElement,
		colorBackBInput: HTMLInputElement,
		colorBackOpacityIcon: HTMLSpanElement,
		colorBackOpacityInput: HTMLInputElement,
		colorBack0: HTMLDivElement,
		colorBack1: HTMLDivElement,
		colorBack2: HTMLDivElement,
		colorBack3: HTMLDivElement,
		colorBack4: HTMLDivElement,
		colorBack5: HTMLDivElement,
		colorBack6: HTMLDivElement,
		colorBack7: HTMLDivElement,

		formatClearButton: HTMLSpanElement,
		undoButton: HTMLSpanElement,
		redoButton: HTMLSpanElement,
		helpButton: HTMLSpanElement,

		modalBack: HTMLDivElement,
		attLinkModal: HTMLDivElement,
		attLinkModalTitle: HTMLDivElement,
		attLinkInTextExplain: HTMLDivElement,
		attLinkText: HTMLInputElement,
		attLinkInLinkExplain: HTMLDivElement,
		attLinkHref: HTMLInputElement,
		attLinkIsBlankCheckbox: HTMLInputElement,
		attLinkIsOpenExplain: HTMLLabelElement,
		attLinkValidCheckText: HTMLSpanElement,
		attLinkValidCheckbox: HTMLInputElement,
		attModalBox: HTMLDivElement,
		attLinkInsertButton: HTMLButtonElement,

		attFileModal: HTMLDivElement,
		attFileModalTitle: HTMLDivElement,
		attFilelayout: HTMLDivElement,
		attFileExplain1: HTMLDivElement,
		attFileUploadDivBox: HTMLDivElement,
		attFileUploadDiv: HTMLDivElement,
		attFileUploadButtonBox: HTMLDivElement,
		attFileUploadButton: HTMLButtonElement,
		attFileUpload: HTMLInputElement,
		attFileInsertButtonBox: HTMLDivElement,
		attFileInsertButton: HTMLButtonElement,

		attImageModal: HTMLDivElement,
		attImageModalTitle: HTMLDivElement,
		attImageExplain1: HTMLDivElement,
		attImageUploadButtonAndViewBox: HTMLDivElement,
		attImageViewPreButtion: HTMLButtonElement,
		attImageUploadButtonAndView: HTMLDivElement,
		attImageViewNextButtion: HTMLButtonElement,
		attImageUpload: HTMLInputElement,
		attImageExplain2: HTMLDivElement,
		attImageURL: HTMLInputElement,
		attImageInsertButtonBox: HTMLDivElement,
		attImageInsertButton: HTMLButtonElement,

		attVideoModal: HTMLDivElement,
		attVideoModalTitle: HTMLDivElement,
		attVideoExplain1: HTMLDivElement,
		attVideoEmbedId: HTMLInputElement,
		attVideoExplain2: HTMLDivElement,
		attVideoWidthTextBox: HTMLDivElement,
		attVideoWidthText: HTMLSpanElement,
		attVideoWidth: HTMLInputElement,
		attVideoWidthUnit: HTMLSpanElement,
		attVideoHeightTextBox: HTMLDivElement,
		attVideoHeightText: HTMLSpanElement,
		attVideoHeight: HTMLInputElement,
		attVideoHeightUnit: HTMLSpanElement,
		attVideoFooter: HTMLDivElement,
		attVideoValidCheckText: HTMLSpanElement,
		attVideoValidCheckbox: HTMLInputElement,
		attVideoInsertButton: HTMLButtonElement,

		attLinkTooltip: HTMLDivElement,
		attLinkTooltipHref: HTMLAnchorElement,
		attLinkTooltipEditButton: HTMLSpanElement,
		attLinkTooltipUnlinkButton: HTMLSpanElement,
		attImageAndVideoTooltip: HTMLDivElement,
		attImageAndVideoTooltipWidthAndFloatBox: HTMLDivElement,
		attImageAndVideoTooltipWidthText: HTMLSpanElement,
		attImageAndVideoTooltipWidthInput: HTMLInputElement,
		attImageAndVideoTooltipWidthUnit: HTMLSpanElement,
		attImageAndVideoTooltipFloatRadioBox: HTMLSpanElement,
		attImageAndVideoTooltipFloatRadioNone: HTMLInputElement,
		attImageAndVideoTooltipFloatRadioNoneLabel: HTMLLabelElement,
		attImageAndVideoTooltipFloatRadioLeft: HTMLInputElement,
		attImageAndVideoTooltipFloatRadioLeftLabel: HTMLLabelElement,
		attImageAndVideoTooltipFloatRadioRight: HTMLInputElement,
		attImageAndVideoTooltipFloatRadioRightLabel: HTMLLabelElement,
		attImageAndVideoTooltipShapeBox: HTMLDivElement,
		attImageAndVideoTooltipShapeRadioBox: HTMLSpanElement,
		attImageAndVideoTooltipShapeRadioSquare: HTMLInputElement,
		attImageAndVideoTooltipShapeRadioSquareLabel: HTMLLabelElement,
		attImageAndVideoTooltipShapeRadioRadius: HTMLInputElement,
		attImageAndVideoTooltipShapeRadioRadiusLabel: HTMLLabelElement,
		attImageAndVideoTooltipShapeRadioCircle: HTMLInputElement,
		attImageAndVideoTooltipShapeRadioCircleLabel: HTMLLabelElement,

		helpModal: HTMLDivElement,
		helpHeader: HTMLDivElement,
		helpMain: HTMLDivElement,
		helpMainTable: HTMLTableElement,
		helpFooter: HTMLDivElement,
		placeholder: HTMLDivElement,
	};
	_cssEvents: {
        target_onBeforeClick(event: MouseEvent): boolean;
        target_onAfterClick(event: MouseEvent): void;
        target_onBeforeMouseover(event: MouseEvent): boolean;
        target_onAfterMouseover(event: MouseEvent): void;
        target_onBeforeMouseout(event: MouseEvent): boolean;
        target_onAfterMouseout(event: MouseEvent): void;
        target_onBeforeTouchstart(event: TouchEvent): boolean;
        target_onAfterTouchstart(event: TouchEvent): void;
        target_onBeforeTouchend(event: TouchEvent): boolean;
        target_onAfterTouchend(event: TouchEvent): void;
	};
	_elementEvents: {
		//textarea event
		textarea_onBeforeClick(event: Event): boolean;
		textarea_onAfterClick(event: Event): void;
		textarea_onBeforeFocus(event: Event): boolean;
		textarea_onAfterFocus(event: Event): void;
		textarea_onBeforeBlur(event: Event): boolean;
		textarea_onAfterBlur(event: Event): void;
		//paragraphStyleSelect event
		paragraphStyleSelect_onBeforeClick(event: Event): boolean;
		paragraphStyleSelect_onAfterClick(event: Event): void;
		//toolToggleButton event
		toolToggleButton_onBeforeClick(event: Event): boolean;
		toolToggleButton_onAfterClick(event: Event): void;
		//styleNomal event
		styleNomal_onBeforeClick(event: Event): boolean;
		styleNomal_onAfterClick(event: Event): void;
		//styleHeader1 event
		styleHeader1_onBeforeClick(event: Event): boolean;
		styleHeader1_onAfterClick(event: Event): void;
		//styleHeader2 event
		styleHeader2_onBeforeClick(event: Event): boolean;
		styleHeader2_onAfterClick(event: Event): void;
		
		//styleHeader3 event
		styleHeader3_onBeforeClick(event: Event): boolean;
		styleHeader3_onAfterClick(event: Event): void;
		
		//styleHeader4 event
		styleHeader4_onBeforeClick(event: Event): boolean;
		styleHeader4_onAfterClick(event: Event): void;
		
		//styleHeader5 event
		styleHeader5_onBeforeClick(event: Event): boolean;
		styleHeader5_onAfterClick(event: Event): void;
		
		//styleHeader6 event
		styleHeader6_onBeforeClick(event: Event): boolean;
		styleHeader6_onAfterClick(event: Event): void;
		
		//boldButton event
		boldButton_onBeforeClick(event: Event): boolean;
		boldButton_onAfterClick(event: Event): void;
		
		//underlineButton event
		underlineButton_onBeforeClick(event: Event): boolean;
		underlineButton_onAfterClick(event: Event): void;
		
		//italicButton event
		italicButton_onBeforeClick(event: Event): boolean;
		italicButton_onAfterClick(event: Event): void;
		
		//ulButton event
		ulButton_onBeforeClick(event: Event): boolean;
		ulButton_onAfterClick(event: Event): void;
		
		//olButton event
		olButton_onBeforeClick(event: Event): boolean;
		olButton_onAfterClick(event: Event): void;
		
		//textAlignSelect event
		textAlignSelect_onBeforeClick(event: Event): boolean;
		textAlignSelect_onAfterClick(event: Event): void;
		
		//textAlignLeft event
		textAlignLeft_onBeforeClick(event: Event): boolean;
		textAlignLeft_onAfterClick(event: Event): void;
		
		//textAlignCenter event
		textAlignCenter_onBeforeClick(event: Event): boolean;
		textAlignCenter_onAfterClick(event: Event): void;
		
		//textAlignRight event
		textAlignRight_onBeforeClick(event: Event): boolean;
		textAlignRight_onAfterClick(event: Event): void;
		
		//attLinkButton event
		attLinkButton_onBeforeClick(event: Event): boolean;
		attLinkButton_onAfterClick(event: Event): void;
		
		//attFileButton event
		attFileButton_onBeforeClick(event: Event): boolean;
		attFileButton_onAfterClick(event: Event): void;
		
		//attImageButton event
		attImageButton_onBeforeClick(event: Event): boolean;
		attImageButton_onAfterClick(event: Event): void;
		
		//attVideoButton event
		attVideoButton_onBeforeClick(event: Event): boolean;
		attVideoButton_onAfterClick(event: Event): void;
		
		//fontSizeInputBox event
		fontSizeInputBox_onBeforeClick(event: Event): boolean;
		fontSizeInputBox_onAfterClick(event: Event): void;
		
		//fontSizeInput event
		fontSizeInput_onBeforeClick(event: Event): boolean;
		fontSizeInput_onAfterClick(event: Event): void;
		fontSizeInput_onBeforeInput(event: Event): boolean;
		fontSizeInput_onAfterInput(event: Event): void;
		fontSizeInput_onBeforeBlur(event: Event): boolean;
		fontSizeInput_onAfterBlur(event: Event): void;
		
		//letterSpacingInputBox event
		letterSpacingInputBox_onBeforeClick(event: Event): boolean;
		letterSpacingInputBox_onAfterClick(event: Event): void;
		
		//letterSpacingInput event
		letterSpacingInput_onBeforeClick(event: Event): boolean;
		letterSpacingInput_onAfterClick(event: Event): void;
		letterSpacingInput_onBeforeInput(event: Event): boolean;
		letterSpacingInput_onAfterInput(event: Event): void;
		letterSpacingInput_onBeforeBlur(event: Event): boolean;
		letterSpacingInput_onAfterBlur(event: Event): void;
		
		//lineHeightInputBox event
		lineHeightInputBox_onBeforeClick(event: Event): boolean;
		lineHeightInputBox_onAfterClick(event: Event): void;
		
		//lineHeightInput event
		lineHeightInput_onBeforeClick(event: Event): boolean;
		lineHeightInput_onAfterClick(event: Event): void;
		lineHeightInput_onBeforeInput(event: Event): boolean;
		lineHeightInput_onAfterInput(event: Event): void;
		lineHeightInput_onBeforeBlur(event: Event): boolean;
		lineHeightInput_onAfterBlur(event: Event): void;
		
		//fontFamilySelect event
		fontFamilySelect_onBeforeClick(event: Event): boolean;
		fontFamilySelect_onAfterClick(event: Event): void;
		
		//color text select
		colorTextSelect_onBeforeClick(event: Event): boolean;
		colorTextSelect_onAfterClick(event: Event): void;
		//color text select box
		colorTextSelectBox_onBeforeClick(event: Event): boolean;
		colorTextSelectBox_onAfterClick(event: Event): void;
		//colorText0 button
		colorText0_onBeforeClick(event: Event): boolean;
		colorText0_onAfterClick(event: Event): void;
		//colorText1 button
		colorText1_onBeforeClick(event: Event): boolean;
		colorText1_onAfterClick(event: Event): void;
		//colorText2 button
		colorText2_onBeforeClick(event: Event): boolean;
		colorText2_onAfterClick(event: Event): void;
		//colorText3 button
		colorText3_onBeforeClick(event: Event): boolean;
		colorText3_onAfterClick(event: Event): void;
		//colorText4 button
		colorText4_onBeforeClick(event: Event): boolean;
		colorText4_onAfterClick(event: Event): void;
		//colorText5 button
		colorText5_onBeforeClick(event: Event): boolean;
		colorText5_onAfterClick(event: Event): void;
		//colorText6 button
		colorText6_onBeforeClick(event: Event): boolean;
		colorText6_onAfterClick(event: Event): void;
		//colorText7 button
		colorText7_onBeforeClick(event: Event): boolean;
		colorText7_onAfterClick(event: Event): void;
		//colorText R Input event
		colorTextRInput_onBeforeClick(event: Event): boolean;
		colorTextRInput_onAfterClick(event: Event): void;
		colorTextRInput_onBeforeInput(event: Event): boolean;
		colorTextRInput_onAfterInput(event: Event): void;
		colorTextRInput_onBeforeBlur(event: Event): boolean;
		colorTextRInput_onAfterBlur(event: Event): void;
		//colorText G Input event
		colorTextGInput_onBeforeClick(event: Event): boolean;
		colorTextGInput_onAfterClick(event: Event): void;
		colorTextGInput_onBeforeInput(event: Event): boolean;
		colorTextGInput_onAfterInput(event: Event): void;
		colorTextGInput_onBeforeBlur(event: Event): boolean;
		colorTextGInput_onAfterBlur(event: Event): void;
		//colorText B Input event
		colorTextBInput_onBeforeClick(event: Event): boolean;
		colorTextBInput_onAfterClick(event: Event): void;
		colorTextBInput_onBeforeInput(event: Event): boolean;
		colorTextBInput_onAfterInput(event: Event): void;
		colorTextBInput_onBeforeBlur(event: Event): boolean;
		colorTextBInput_onAfterBlur(event: Event): void;
		//colorText Opacity Input event
		colorTextOpacityInput_onBeforeClick(event: Event): boolean;
		colorTextOpacityInput_onAfterClick(event: Event): void;
		colorTextOpacityInput_onBeforeInput(event: Event): boolean;
		colorTextOpacityInput_onAfterInput(event: Event): void;
		colorTextOpacityInput_onBeforeBlur(event: Event): boolean;
		colorTextOpacityInput_onAfterBlur(event: Event): void;
		
		//color background select
		colorBackSelect_onBeforeClick(event: Event): boolean;
		colorBackSelect_onAfterClick(event: Event): void;
		//color back select box
		colorBackSelectBox_onBeforeClick(event: Event): boolean;
		colorBackSelectBox_onAfterClick(event: Event): void;
		//colorBack0 button
		colorBack0_onBeforeClick(event: Event): boolean;
		colorBack0_onAfterClick(event: Event): void;
		//colorBack1 button
		colorBack1_onBeforeClick(event: Event): boolean;
		colorBack1_onAfterClick(event: Event): void;
		//colorBack2 button
		colorBack2_onBeforeClick(event: Event): boolean;
		colorBack2_onAfterClick(event: Event): void;
		//colorBack3 button
		colorBack3_onBeforeClick(event: Event): boolean;
		colorBack3_onAfterClick(event: Event): void;
		//colorBack4 button
		colorBack4_onBeforeClick(event: Event): boolean;
		colorBack4_onAfterClick(event: Event): void;
		//colorBack5 button
		colorBack5_onBeforeClick(event: Event): boolean;
		colorBack5_onAfterClick(event: Event): void;
		//colorBack6 button
		colorBack6_onBeforeClick(event: Event): boolean;
		colorBack6_onAfterClick(event: Event): void;
		//colorBack7 button
		colorBack7_onBeforeClick(event: Event): boolean;
		colorBack7_onAfterClick(event: Event): void;
		//colorBack R Input event
		colorBackRInput_onBeforeClick(event: Event): boolean;
		colorBackRInput_onAfterClick(event: Event): void;
		colorBackRInput_onBeforeInput(event: Event): boolean;
		colorBackRInput_onAfterInput(event: Event): void;
		colorBackRInput_onBeforeBlur(event: Event): boolean;
		colorBackRInput_onAfterBlur(event: Event): void;
		//colorBack G Input event
		colorBackGInput_onBeforeClick(event: Event): boolean;
		colorBackGInput_onAfterClick(event: Event): void;
		colorBackGInput_onBeforeInput(event: Event): boolean;
		colorBackGInput_onAfterInput(event: Event): void;
		colorBackGInput_onBeforeBlur(event: Event): boolean;
		colorBackGInput_onAfterBlur(event: Event): void;
		//colorBack B Input event
		colorBackBInput_onBeforeClick(event: Event): boolean;
		colorBackBInput_onAfterClick(event: Event): void;
		colorBackBInput_onBeforeInput(event: Event): boolean;
		colorBackBInput_onAfterInput(event: Event): void;
		colorBackBInput_onBeforeBlur(event: Event): boolean;
		colorBackBInput_onAfterBlur(event: Event): void;
		//colorBack Opacity Input event
		colorBackOpacityInput_onBeforeClick(event: Event): boolean;
		colorBackOpacityInput_onAfterClick(event: Event): void;
		colorBackOpacityInput_onBeforeInput(event: Event): boolean;
		colorBackOpacityInput_onAfterInput(event: Event): void;
		colorBackOpacityInput_onBeforeBlur(event: Event): boolean;
		colorBackOpacityInput_onAfterBlur(event: Event): void;
		
		//formatClearButton event
		formatClearButton_onBeforeClick(event: Event): boolean;
		formatClearButton_onAfterClick(event: Event): void;
		
		//undo event
		undoButton_onBeforeClick(event: Event): boolean;
		undoButton_onAfterClick(event: Event): void;
		
		//redo event
		redoButton_onBeforeClick(event: Event): boolean;
		redoButton_onAfterClick(event: Event): void;
		
		//help event
		helpButton_onBeforeClick(event: Event): boolean;
		helpButton_onAfterClick(event: Event): void;
		
		//modal back event
		modalBack_onBeforeClick(event: Event): boolean;
		modalBack_onAfterClick(event: Event): void;
		
		//modal att link event
		attLinkModal_onBeforeClick(event: Event): boolean;
		attLinkModal_onAfterClick(event: Event): void;
		
		//modal att link text input event
		attLinkText_onBeforeInput(event: Event): boolean;
		attLinkText_onAfterInput(event: Event): void;
		attLinkText_onBeforeBlur(event: Event): boolean;
		attLinkText_onAfterBlur(event: Event): void;
		
		//modal att link href input event
		attLinkHref_onBeforeInput(event: Event): boolean;
		attLinkHref_onAfterInput(event: Event): void;
		attLinkHref_onBeforeBlur(event: Event): boolean;
		attLinkHref_onAfterBlur(event: Event): void;
		
		//modal att link insert button event
		attLinkInsertButton_onBeforeClick(event: Event): boolean;
		attLinkInsertButton_onAfterClick(event: Event): void;
		
		//modal att file event
		attFileModal_onBeforeClick(event: Event): boolean;
		attFileModal_onAfterClick(event: Event): void;
		
		//modal att file upload button event
		attFileUploadButton_onBeforeClick(event: Event): boolean;
		attFileUploadButton_onAfterClick(event: Event): void;
		
		//modal att file upload div event
		attFileUploadDiv_onBeforeDragover(event: Event): boolean;
		attFileUploadDiv_onAfterDragover(event: Event): void;
		attFileUploadDiv_onBeforeDrop(event: Event): boolean;
		attFileUploadDiv_onAfterDrop(event: Event): void;
		attFileUploadDiv_onBeforeClick(event: Event): boolean;
		attFileUploadDiv_onAfterClick(event: Event): void;
		
		//modal att file upload input event
		attFileUpload_onBeforeInput(event: Event): boolean;
		attFileUpload_onAfterInput(event: Event): void;
		attFileUpload_onBeforeBlur(event: Event): boolean;
		attFileUpload_onAfterBlur(event: Event): void;
		
		//modal att file insert button event
		attFileInsertButton_onBeforeClick(event: Event): boolean;
		attFileInsertButton_onAfterClick(event: Event): void;
		
		//att link tooltip edit button event
		attLinkTooltipEditButton_onBeforeClick(event: Event): boolean;
		attLinkTooltipEditButton_onAfterClick(event: Event): void;
		
		//att link tooltip unlink button event
		attLinkTooltipUnlinkButton_onBeforeClick(event: Event): boolean;
		attLinkTooltipUnlinkButton_onAfterClick(event: Event): void;
		
		//modal att image event
		attImageModal_onBeforeClick(event: Event): boolean;
		attImageModal_onAfterClick(event: Event): void;
		
		//modal att image upload button and view event
		attImageUploadButtonAndView_onBeforeDragover(event: Event): boolean;
		attImageUploadButtonAndView_onAfterDragover(event: Event): void;
		attImageUploadButtonAndView_onBeforeDrop(event: Event): boolean;
		attImageUploadButtonAndView_onAfterDrop(event: Event): void;
		attImageUploadButtonAndView_onBeforeClick(event: Event): boolean;
		attImageUploadButtonAndView_onAfterClick(event: Event): void;
		
		//modal att image view pre button event
		attImageViewPreButtion_onBeforeClick(event: Event): boolean;
		attImageViewPreButtion_onAfterClick(event: Event): void;
		
		//modal att image view next button event
		attImageViewNextButtion_onBeforeClick(event: Event): boolean;
		attImageViewNextButtion_onAfterClick(event: Event): void;
		
		//modal att image upload input event
		attImageUpload_onBeforeInput(event: Event): boolean;
		attImageUpload_onAfterInput(event: Event): void;
		attImageUpload_onBeforeBlur(event: Event): boolean;
		attImageUpload_onAfterBlur(event: Event): void;
		
		//modal att image url input event
		attImageURL_onBeforeInput(event: Event): boolean;
		attImageURL_onAfterInput(event: Event): void;
		attImageURL_onBeforeBlur(event: Event): boolean;
		attImageURL_onAfterBlur(event: Event): void;
		
		//modal att image insert button event
		attImageInsertButton_onBeforeClick(event: Event): boolean;
		attImageInsertButton_onAfterClick(event: Event): void;
		
		//modal att video event
		attVideoModal_onBeforeClick(event: Event): boolean;
		attVideoModal_onAfterClick(event: Event): void;
		
		//modal att video embed id input event
		attVideoEmbedId_onBeforeInput(event: Event): boolean;
		attVideoEmbedId_onAfterInput(event: Event): void;
		attVideoEmbedId_onBeforeBlur(event: Event): boolean;
		attVideoEmbedId_onAfterBlur(event: Event): void;
		
		//modal att video width input event
		attVideoWidth_onBeforeInput(event: Event): boolean;
		attVideoWidth_onAfterInput(event: Event): void;
		attVideoWidth_onBeforeBlur(event: Event): boolean;
		attVideoWidth_onAfterBlur(event: Event): void;
		
		//modal att video height input event
		attVideoHeight_onBeforeInput(event: Event): boolean;
		attVideoHeight_onAfterInput(event: Event): void;
		attVideoHeight_onBeforeBlur(event: Event): boolean;
		attVideoHeight_onAfterBlur(event: Event): void;
		
		//modal att video insert button event
		attVideoInsertButton_onBeforeClick(event: Event): boolean;
		attVideoInsertButton_onAfterClick(event: Event): void;
		
		//att image tooltip width input event
		attImageAndVideoTooltipWidthInput_onBeforeInput(event: Event): boolean;
		attImageAndVideoTooltipWidthInput_onAfterInput(event: Event): void;
		attImageAndVideoTooltipWidthInput_onBeforeBlur(event: Event): boolean;
		attImageAndVideoTooltipWidthInput_onAfterBlur(event: Event): void;
		attImageAndVideoTooltipWidthInput_onBeforeKeyup(event: Event): boolean;
		attImageAndVideoTooltipWidthInput_onAfterKeyup(event: Event): void;
		
		//att image tooltip float none radio input event
		attImageAndVideoTooltipFloatRadioNone_onBeforeClick(event: Event): boolean;
		attImageAndVideoTooltipFloatRadioNone_onAfterClick(event: Event): void;
		
		//att image tooltip float left radio input event
		attImageAndVideoTooltipFloatRadioLeft_onBeforeClick(event: Event): boolean;
		attImageAndVideoTooltipFloatRadioLeft_onAfterClick(event: Event): void;
		
		//att image tooltip float right radio input event
		attImageAndVideoTooltipFloatRadioRight_onBeforeClick(event: Event): boolean;
		attImageAndVideoTooltipFloatRadioRight_onAfterClick(event: Event): void;
		
		//att image tooltip shape square radio input event
		attImageAndVideoTooltipShapeRadioSquare_onBeforeClick(event: Event): boolean;
		attImageAndVideoTooltipShapeRadioSquare_onAfterClick(event: Event): void;
		
		//att image tooltip shape radius radio input event
		attImageAndVideoTooltipShapeRadioRadius_onBeforeClick(event: Event): boolean;
		attImageAndVideoTooltipShapeRadioRadius_onAfterClick(event: Event): void;
		
		//att image tooltip shape circle radio input event
		attImageAndVideoTooltipShapeRadioCircle_onBeforeClick(event: Event): boolean;
		attImageAndVideoTooltipShapeRadioCircle_onAfterClick(event: Event): void;
		
		//modal help event
		helpModal_onBeforeClick(event: Event): boolean;
		helpModal_onAfterClick(event: Event): void;
		
		//placeholder event
		placeholder_onBeforeClick(event: Event): boolean;
		placeholder_onAfterClick(event: Event): void;
	};
	_vn: Vanillanote;

	/**
	 * Returns the data object of the current Vanillanote editor instance.
	 *
	 * - Retrieves the internal state for the specific editor this element represents.
	 * - Includes the `noteIndex` (the DOM order-based index of this editor),
	 *   the `textarea` (the `contenteditable="true"` div representing the editor's content),
	 *   and `files` (a collection of currently attached files and images used in the editor).
	 * - Only files and images currently present in the editor (not deleted by the user) are returned.
	 * - Can be used when submitting form data or exporting the editor state.
	 *
	 * @returns An object containing:
	 *  - `noteIndex`: The index number of this editor in the DOM.
	 *  - `textarea`: The HTML element representing the editable content.
	 *  - `files`: A `Record<string, File>` object of active attached files and images.
	 *
	 * @example
	 * const editorEl = document.querySelectorAll('[data-vanillanote]')[0];
	 * const data = editorEl.getNoteData();
	 * console.log(data.noteIndex); // 0
	 * console.log(data.files); // Object containing file UUID keys and File objects
	 * console.log(data.textarea); // The editor's contenteditable div element
	 */
	_getNoteData(): {
		textarea: HTMLTextAreaElement;
	  	files: Record<string, File>;
	};

	_setNoteData(data: HTMLTextAreaElement): void; //???????
}
