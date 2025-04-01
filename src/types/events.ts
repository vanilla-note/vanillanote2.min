export interface DocumentEvents {
	noteObserver: null | MutationObserver;
	selectionchange: null | ((e: Event) => void);
	keydown: null | ((e: KeyboardEvent) => void);
	resize: null | ((e: UIEvent) => void);
	resizeViewport: null | ((e: Event) => void);
}

export interface CssEvents {
	target_onClick: null | ((e: Event) => void);
    target_onMouseover: null | ((e: Event) => void);
    target_onMouseout: null | ((e: Event) => void);
    target_onTouchstart: null | ((e: Event) => void);
    target_onTouchend: null | ((e: Event) => void);
}

export interface ElementEvents {
	//toolToggleButton event
	toolToggleButton_onClick: null | ((e: Event) => void);
	//paragraphStyleSelect event
	paragraphStyleSelect_onClick: null | ((e: Event) => void);
	//styleNomal event
	styleNomal_onClick: null | ((e: Event) => void);
	//styleHeader1 event
	styleHeader1_onClick: null | ((e: Event) => void);
	//styleHeader2 event
	styleHeader2_onClick: null | ((e: Event) => void);
	//styleHeader3 event
	styleHeader3_onClick: null | ((e: Event) => void);
	//styleHeader4 event
	styleHeader4_onClick: null | ((e: Event) => void);
	//styleHeader5 event
	styleHeader5_onClick: null | ((e: Event) => void);
	//styleHeader6 event
	styleHeader6_onClick: null | ((e: Event) => void);
	//boldButton event
	boldButton_onClick: null | ((e: Event) => void);
	//underlineButton event
	underlineButton_onClick: null | ((e: Event) => void);
	//italic
	italicButton_onClick: null | ((e: Event) => void);
	//ul
	ulButton_onClick: null | ((e: Event) => void);
	//ol
	olButton_onClick: null | ((e: Event) => void);
	//text-align
	textAlignSelect_onClick: null | ((e: Event) => void);
	//text-align-left
	textAlignLeft_onClick: null | ((e: Event) => void);
	//text-align-center
	textAlignCenter_onClick: null | ((e: Event) => void);
	//text-align-right
	textAlignRight_onClick: null | ((e: Event) => void);
	//att link
	attLinkButton_onClick: null | ((e: Event) => void);
	//modal att link
	attLinkModal_onClick: null | ((e: Event) => void);
	//modal att link text
	attLinkText_onInput: null | ((e: Event) => void);
	attLinkText_onBlur: null | ((e: Event) => void);
	//modal att link href
	attLinkHref_onInput: null | ((e: Event) => void);
	attLinkHref_onBlur: null | ((e: Event) => void);
	//modal att link insert
	attLinkInsertButton_onClick: null | ((e: Event) => void);
	//att link tooltip
	//edit button
	attLinkTooltipEditButton_onClick: null | ((e: Event) => void);
	//unlink button
	attLinkTooltipUnlinkButton_onClick: null | ((e: Event) => void);
	//att file
	attFileButton_onClick: null | ((e: Event) => void);
	//modal att file
	attFileModal_onClick: null | ((e: Event) => void);
	//modal att file upload button
	attFileUploadButton_onClick: null | ((e: Event) => void);
	//modal att file upload div
	attFileUploadDiv_onDragover: null | ((e: Event) => void);
	attFileUploadDiv_onDrop: null | ((e: Event) => void);
	attFileUploadDiv_onClick: null | ((e: Event) => void);
	//modal att file upload
	attFileUpload_onInput: null | ((e: Event) => void);
	attFileUpload_onBlur: null | ((e: Event) => void);
	//modal att file insert
	attFileInsertButton_onClick: null | ((e: Event) => void);
	//att image
	attImageButton_onClick: null | ((e: Event) => void);
	//modal att image
	attImageModal_onClick: null | ((e: Event) => void);
	//modalatt image uplaod button and view
	attImageUploadButtonAndView_onDragover: null | ((e: Event) => void);
	attImageUploadButtonAndView_onDrop: null | ((e: Event) => void);
	attImageUploadButtonAndView_onClick: null | ((e: Event) => void);
	//modal att image view pre button
	attImageViewPreButtion_onClick: null | ((e: Event) => void);
	//modal att image view next button
	attImageViewNextButtion_onClick: null | ((e: Event) => void);
	//modal att image upload
	attImageUpload_onInput: null | ((e: Event) => void);
	attImageUpload_onBlur: null | ((e: Event) => void);
	attImageURL_onInput: null | ((e: Event) => void);
	attImageURL_onBlur: null | ((e: Event) => void);
	//modal att image insert
	attImageInsertButton_onClick: null | ((e: Event) => void);
	//att video
	attVideoButton_onClick: null | ((e: Event) => void);
	//modal att video
	attVideoModal_onClick: null | ((e: Event) => void);
	//modal att video embed id
	attVideoEmbedId_onInput: null | ((e: Event) => void);
	attVideoEmbedId_onBlur: null | ((e: Event) => void);
	attVideoWidth_onInput: null | ((e: Event) => void);
	attVideoWidth_onBlur: null | ((e: Event) => void);
	//modal att video height
	attVideoHeight_onInput: null | ((e: Event) => void);
	attVideoHeight_onBlur: null | ((e: Event) => void);
	//modal att video insert
	attVideoInsertButton_onClick: null | ((e: Event) => void);
	//att image tooltip width input event
	attImageAndVideoTooltipWidthInput_onInput: null | ((e: Event) => void);
	attImageAndVideoTooltipWidthInput_onBlur: null | ((e: Event) => void);
	attImageAndVideoTooltipWidthInput_onKeyup: null | ((e: Event) => void);
	//att image tooltip float radio none input event
	attImageAndVideoTooltipFloatRadioNone_onClick: null | ((e: Event) => void);
	//att image tooltip float radio left input event
	attImageAndVideoTooltipFloatRadioLeft_onClick: null | ((e: Event) => void);
	//att image tooltip float radio right input event
	attImageAndVideoTooltipFloatRadioRight_onClick: null | ((e: Event) => void);
	//att image tooltip shape square radio input event
	attImageAndVideoTooltipShapeRadioSquare_onClick: null | ((e: Event) => void);
	//att image tooltip shape radius radio input event
	attImageAndVideoTooltipShapeRadioRadius_onClick: null | ((e: Event) => void);
	//att image tooltip shape circle radio input event
	attImageAndVideoTooltipShapeRadioCircle_onClick: null | ((e: Event) => void);
	//fontSizeInputBox event
	fontSizeInputBox_onClick: null | ((e: Event) => void);
	//fontSizeInput event
	fontSizeInput_onClick: null | ((e: Event) => void);
	fontSizeInput_onInput: null | ((e: Event) => void);
	fontSizeInput_onBlur: null | ((e: Event) => void);
	//letterSpacingInputBox event
	letterSpacingInputBox_onClick: null | ((e: Event) => void);
	//letterSpacingInput event
	letterSpacingInput_onClick: null | ((e: Event) => void);
	letterSpacingInput_onInput: null | ((e: Event) => void);
	letterSpacingInput_onBlur: null | ((e: Event) => void);
	//lineHeightInputBox event
	lineHeightInputBox_onClick: null | ((e: Event) => void);
	lineHeightInputBox_onInput: null | ((e: Event) => void);
	//lineHeightInput event
	lineHeightInput_onClick: null | ((e: Event) => void);
	lineHeightInput_onInput: null | ((e: Event) => void);
	lineHeightInput_onBlur: null | ((e: Event) => void);
	//fontFamilySelect event
	fontFamilySelect_onClick: null | ((e: Event) => void);
	//color text select
	colorTextSelect_onClick: null | ((e: Event) => void);
	//color text select box
	colorTextSelectBox_onClick: null | ((e: Event) => void);
	//colorText R Input event
	colorTextRInput_onClick: null | ((e: Event) => void);
	colorTextRInput_onInput: null | ((e: Event) => void);
	colorTextRInput_onBlur: null | ((e: Event) => void);
	//colorText G Input event
	colorTextGInput_onClick: null | ((e: Event) => void);
	colorTextGInput_onInput: null | ((e: Event) => void);
	colorTextGInput_onBlur: null | ((e: Event) => void);
	//colorText B Input event
	colorTextBInput_onClick: null | ((e: Event) => void);
	colorTextBInput_onInput: null | ((e: Event) => void);
	colorTextBInput_onBlur: null | ((e: Event) => void);
	//colorText Opacity Input event
	colorTextOpacityInput_onClick: null | ((e: Event) => void);
	colorTextOpacityInput_onInput: null | ((e: Event) => void);
	colorTextOpacityInput_onBlur: null | ((e: Event) => void);
	//colorText0 event
	colorText0_onClick: null | ((e: Event) => void);
	//colorText1 event
	colorText1_onClick: null | ((e: Event) => void);
	//colorText2 event
	colorText2_onClick: null | ((e: Event) => void);
	//colorText3 event
	colorText3_onClick: null | ((e: Event) => void);
	//colorText4 event
	colorText4_onClick: null | ((e: Event) => void);
	//colorText5 event
	colorText5_onClick: null | ((e: Event) => void);
	//colorText6 event
	colorText6_onClick: null | ((e: Event) => void);
	//colorText7 event
	colorText7_onClick: null | ((e: Event) => void);
	//color background select
	colorBackSelect_onClick: null | ((e: Event) => void);
	//color background select box
	colorBackSelectBox_onClick: null | ((e: Event) => void);
	colorBackRInput_onClick: null | ((e: Event) => void);
	colorBackRInput_onInput: null | ((e: Event) => void);
	colorBackRInput_onBlur: null | ((e: Event) => void);
	//colorBack G Input event
	colorBackGInput_onClick: null | ((e: Event) => void);
	colorBackGInput_onInput: null | ((e: Event) => void);
	colorBackGInput_onBlur: null | ((e: Event) => void);
	//colorBack B Input event
	colorBackBInput_onClick: null | ((e: Event) => void);
	colorBackBInput_onInput: null | ((e: Event) => void);
	colorBackBInput_onBlur: null | ((e: Event) => void);
	//colorBack Opacity Input event
	colorBackOpacityInput_onClick: null | ((e: Event) => void);
	colorBackOpacityInput_onInput: null | ((e: Event) => void);
	colorBackOpacityInput_onBlur: null | ((e: Event) => void);
	//colorBack0 event
	colorBack0_onClick: null | ((e: Event) => void);
	//colorBack1 event
	colorBack1_onClick: null | ((e: Event) => void);
	//colorBack2 event
	colorBack2_onClick: null | ((e: Event) => void);
	//colorBack3 event
	colorBack3_onClick: null | ((e: Event) => void);
	//colorBack4 event
	colorBack4_onClick: null | ((e: Event) => void);
	//colorBack5 event
	colorBack5_onClick: null | ((e: Event) => void);
	//colorBack6 event
	colorBack6_onClick: null | ((e: Event) => void);
	//colorBack7 event
	colorBack7_onClick: null | ((e: Event) => void);
	//formatClearButton
	formatClearButton_onClick: null | ((e: Event) => void);
	//undo
	undoButton_onClick: null | ((e: Event) => void);
	//redo
	redoButton_onClick: null | ((e: Event) => void);
	//help
	helpButton_onClick: null | ((e: Event) => void);
	helpModal_onClick: null | ((e: Event) => void);
	//modal back
	modalBack_onClick: null | ((e: Event) => void);
	//placeholder
	placeholder_onClick: null | ((e: Event) => void);
	//textarea
	textarea_onClick: null | ((e: Event) => void);
	textarea_onFocus: null | ((e: Event) => void);
	textarea_onBlur: null | ((e: Event) => void);
	textarea_onKeydown: null | ((e: Event) => void);
	textarea_onKeyup: null | ((e: Event) => void);
	textarea_onBeforeinput: null | ((e: Event) => void);
}
