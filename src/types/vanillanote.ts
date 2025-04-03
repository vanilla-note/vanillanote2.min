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
export interface LanguagePack {
	/**
	 * Title attribute to be inserted in textarea element.
	 */
	textareaTooltip: string;
	/**
	 * Text that appears when conditions are met (insertion of text and links).
	 */
	thanks: string;
	/**
	 * Title attribute to be inserted in paragraph-style button element.
	 */
	styleTooltip: string;
	/**
	 * Title attribute to be inserted in bold button element.
	 */
	boldTooltip: string;
	/**
	 * Title attribute to be inserted in underline button element.
	 */
	underlineTooltip: string;
	/**
	 * Title attribute to be inserted in italic button element.
	 */
	italicTooltip: string;
	/**
	 * Title attribute to be inserted in ul button element.
	 */
	ulTooltip: string;
	/**
	 * Title attribute to be inserted in ol button element.
	 */
	olTooltip: string;
	/**
	 * Title attribute to be inserted in text-align button element.
	 */
	textAlignTooltip: string;
	/**
	 * Title attribute to be inserted in link-attachment button element.
	 */
	attLinkTooltip: string;
	/**
	 * Title attribute to be inserted in file-attachment button element.
	 */
	attFileTooltip: string;
	/**
	 * Title attribute to be inserted in image-attachment button element.
	 */
	attImageTooltip: string;
	/**
	 * Title attribute to be inserted in You-tube video-attachment button element.
	 */
	attVideoTooltip: string;
	/**
	 * Title attribute to be inserted in font-size button element.
	 */
	fontSizeTooltip: string;
	/**
	 * Title attribute to be inserted in letter-spacing button element.
	 */
	letterSpacingTooltip: string;
	/**
	 * Title attribute to be inserted in line-height button element.
	 */
	lineHeightTooltip: string;
	/**
	 * Title attribute to be inserted in font-family button element.
	 */
	fontFamilyTooltip: string;
	/**
	 * Title attribute to be inserted in color text button element.
	 */
	colorTextTooltip: string;
	/**
	 * Title attribute to be inserted in color back button element.
	 */
	colorBackTooltip: string;
	/**
	 * Title attribute to be inserted in format clear button element.
	 */
	formatClearButtonTooltip: string;
	/**
	 * Title attribute to be inserted in undo button element.
	 */
	undoTooltip: string;
	/**
	 * Title attribute to be inserted in redo button element.
	 */
	redoTooltip: string;
	/**
	 * Title attribute to be inserted in help button element.
	 */
	helpTooltip: string;
	/**
	 * Title of link-attachment modal.
	 */
	attLinkModalTitle: string;
	/**
	 * Text input description in link-attachment modal.
	 */
	attLinkInTextExplain: string;
	/**
	 * Link input description in link-attachment modal.
	 */
	attLinkInLinkExplain: string;
	/**
	 * New window opening description in link-attachment modal.
	 */
	attLinkIsOpenExplain: string;
	/**
	 * Title attribute of text input in link-attachment modal.
	 */
	attLinkInTextTooltip: string;
	/**
	 * Title attribute of link input in link-attachment modal.
	 */
	attLinkInLinkTooltip: string;
	/**
	 * Title attribute of new window opening checkbox in link-attachment modal.
	 */
	attLinkIsOpenTooltip: string;
	/**
	 * Title attribute of file-attachment modal.
	 */
	attFileModalTitle: string;
	/**
	 * Description in file-attachment modal.
	 */
	attFileExplain1: string;
	/**
	 * Text of file upload button in file-attachment modal.
	 */
	attFileUploadButton: string;
	/**
	 * Text of drag and drop div in file-attachment modal.
	 */
	attFileUploadDiv: string;
	/**
	 * Title attribute of file elements in drag and drop div in file-attachment modal.
	 */
	attFileListTooltip: string;
	/**
	 * Title of image-attachment modal.
	 */
	attImageModalTitle: string;
	/**
	 * Text of upload button and view in image-attachment modal.
	 */
	attImageUploadButtonAndView: string;
	/**
	 * Description 1 in image-attachment modal.
	 */
	attImageExplain1: string;
	/**
	 * Description 2 in image-attachment modal.
	 */
	attImageExplain2: string;
	/**
	 * Title attribute of url input element in image-attachment modal.
	 */
	attImageURLTooltip: string;
	/**
	 * Alert text when file size is over upon attachment.
	 */
	attOverSize: string;
	/**
	 * Alert text when an invalid type is attached.
	 */
	attPreventType: string;
	/**
	 * Title of You-tube video-attachment modal.
	 */
	attVideoModalTitle: string;
	/**
	 * Description 1 in You-tube video-attachment modal.
	 */
	attVideoExplain1: string;
	/**
	 * Description 2 in You-tube video-attachment modal.
	 */
	attVideoExplain2: string;
	/**
	 * Title attribute of embed id input element in You-tube video-attachment modal.
	 */
	attVideoEmbedIdTooltip: string;
	/**
	 * Title attribute of width input element in You-tube video-attachment modal.
	 */
	attVideoWidthTooltip: string;
	/**
	 * Title attribute of height input element in You-tube video-attachment modal.
	 */
	attVideoHeightTooltip: string;
	/**
	 * Text description for width in image tooltip.
	 */
	attImageAndVideoTooltipWidthInput: string;
	/**
	 * Text description for float in image tooltip.
	 */
	attImageAndVideoTooltipFloatRadio: string;
	/**
	 * Text description for shape in image tooltip.
	 */
	attImageAndVideoTooltipShapeRadio: string;
	/**
	 * Title of help modal.
	 */
	helpModalTitle: string;
	/**
	 * Contents of the help modal. Inserted as an array. Inserted in the form { key (table left) : value (table right) }.
	 */
	helpContent : Record<string, string>[];
}

export interface LanguageSet {
	[languageCode: string]: LanguagePack;
}
