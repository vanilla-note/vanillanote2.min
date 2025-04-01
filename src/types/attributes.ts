import { NoteModeByDevice, ToolPosition } from "./enums";

/**
 * Runtime variables and settings that manage editor creation and behavior.
 * - Includes per-instance configurations and global values.
 * - Properties with `[index]` support allow individual editor customization.
 *
 * @example
 * if (isMobileDevice) {
 *   vn.variables.attFileMaxSizes[0] = 50 * 1024 * 1024; // Increase max upload size on mobile
 * }
 */
export interface Attributes {
    noteModeByDevice: NoteModeByDevice.adaptive | NoteModeByDevice.desktop | NoteModeByDevice.mobile;
    /**
     * - Variables for dynamically setting the size of the textarea
     * - Default width of the textarea. If not set, the value of textarea-width is inserted. Used for dynamically changing the width.
     */
    textareaOriginWidth: string;
    /**
     * - Variables for dynamically setting the size of the textarea
     * - Default height of the textarea. If not set, the value of textarea-height is inserted. Used for dynamically changing the height. Only insert css style in px units.(ex. 400px)
     */
    textareaOriginHeight: string;
    /**
     * - Variables for dynamically setting the max size of the textarea
     * - Default max-width of the textarea. If not set, the value of textarea-max-width is inserted. Used for dynamically changing the width.
     */
    textareaMaxWidth: string;
    /**
     * - Variables for dynamically setting the max size of the textarea
     * - Default max-height of the textarea. If not set, the value of textarea-max-height is inserted. Used for dynamically changing the height. Only insert css style in px units.(ex. 900px)
     */
    textareaMaxHeight: string;
    /**
     * Whether the user can change the height of the textarea. If true, it can be changed.
     */
    textareaHeightIsModify: boolean;
    /**
     * - Values related to placeholders. The attribute placeholder- can be used, but using these variables allows dynamic control of placeholders.
     * - `true` : Uses a placeholder.
     * - `false` : Default value. Does not use a placeholder.
     */
    placeholderIsVisible: boolean;
    /**
     * - Values related to placeholders. The attribute placeholder- can be used, but using these variables allows dynamic control of placeholders.
     * - Adjusts the vertical position of the placeholder. Negative values are possible. The unit is px. Default value is 0.
     */
    placeholderAddTop: number;
    /**
     * - Values related to placeholders. The attribute placeholder- can be used, but using these variables allows dynamic control of placeholders.
     * - Adjusts the horizontal position of the placeholder. Negative values are possible. The unit is px. Default value is 0.
     */
    placeholderAddLeft: number;
    /**
     * - Values related to placeholders. The attribute placeholder- can be used, but using these variables allows dynamic control of placeholders.
     * - Sets the width of the placeholder. The default value is the size of the flexible textarea.
     */
    placeholderWidth: string;
    /**
     * - Variables controlling file attachments.
     * - Data obtained from note.getNoteData() does not include files deleted by the user from the screen, but .attFiles[idx] contains all files attached by the user.
     * - File types to block for file attachment. Written in MIME type (ex image/png). Default is [].
     */
    attFilePreventTypes: string[];
    /**
     * - Variables controlling file attachments.
     * - Data obtained from note.getNoteData() does not include files deleted by the user from the screen, but .attFiles[idx] contains all files attached by the user.
     * - File types to allow for file attachment. Written in MIME type (ex image/png). Default is []. If present, only those files can be attached.
     */
    attFileAcceptTypes: string[];
    /**
     * - Variables controlling file attachments.
     * - Data obtained from note.getNoteData() does not include files deleted by the user from the screen, but .attFiles[idx] contains all files attached by the user.
     * - Maximum size allowed for file attachment. Default is 20MB.
     * 
     * ```typescript
     * vn.variables.attFileMaxSizes[0] = 50 * 1024 * 1024;
     * ```
     */
    attFileMaxSizes: number;
    /**
     * - Variables controlling image file attachments.
     * - Data obtained from note.getNoteData() does not include files deleted by the user from the screen, but .attImages[idx] contains all image files attached by the user.
     * - File types to block for image attachment. Written in MIME type (ex image/png). Default is [].
     */
    attImagePreventTypes: string[];
    /**
     * - Variables controlling image file attachments.
     * - Data obtained from note.getNoteData() does not include files deleted by the user from the screen, but .attImages[idx] contains all image files attached by the user.
     * - File types to allow for image attachment. Written in MIME type (ex image/png). Default is []. If present, only those files can be attached.
     */
    attImageAcceptTypes: string[];
    /**
     * - Variables controlling image file attachments.
     * - Data obtained from note.getNoteData() does not include files deleted by the user from the screen, but .attImages[idx] contains all image files attached by the user.
     * - Maximum size allowed for image attachment. Default is 20MB.
     * 
     * ```typescript
     * vn.variables.attImageMaxSizes[0] = 50 * 1024 * 1024;
     * ```
     */
    attImageMaxSizes: number;

    /**
     * default textarea font-size
     */
    defaultTextareaFontSize: number;
    /**
     * default textarea line-height
     */
    defaultTextareaLineHeight: number;
    /**
     * default textarea font-family
     */
    defaultTextareaFontFamily: string;
    /**
     * default tool box font-family
     */
    defaultToolFontFamily: string;

    /**
     * - Sets the language of the editor. Used in conjunction with .languageSet. An error occurs if a key not in .languageSet is entered.
     * - `'ENG'` : Default value. Sets the language of the note to English.
     * - `'KOR'` : Sets the language of the note to Korean.
     * - `'...'` : Can be used after being defined in .languageSet.
     */
    language: string;

    placeholderColor: string;
    placeholderBackgroundColor: string;
    placeholderTitle: string;
    placeholderTextContent: string;

    defaultFontFamilies: string[];

    recodeLimit: number;

    mainColor: string;
    colorSet: string;
    invertColor: boolean;

    usingParagraphStyle: boolean;
    usingBold: boolean;
    usingUnderline: boolean;
    usingItalic: boolean;
    usingUl: boolean;
    usingOl: boolean;
    usingTextAlign: boolean;
    usingAttLink: boolean;
    usingAttFile: boolean;
    usingAttImage: boolean;
    usingAttVideo: boolean;
    usingFontSize: boolean;
    usingLetterSpacing: boolean;
    usingLineHeight: boolean;
    usingFontFamily: boolean;
    usingColorText: boolean;
    usingColorBack: boolean;
    usingFormatClear: boolean;
    usingUndo: boolean;
    usingRedo: boolean;
    usingHelp: boolean;
}

export interface NoteAttributes extends Attributes {
    isNoteByMobile: boolean;
    toolPosition: ToolPosition.bottom | ToolPosition.top;
    toolDefaultLine: number;
    toolToggleUsing: boolean;
    sizeRate: number;
}
