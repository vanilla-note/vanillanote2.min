import { NoteModeByDevice, ToolPosition } from "./enums";

/**
 * Runtime variables and settings that manage editor creation and behavior.
 * - Includes per-instance configurations and global values.
 * - Properties with `[index]` support allow individual editor customization.
 *
 * @example
 * if (isMobileDevice) {
 *   vn.variables.attFileMaxSize[0] = 50 * 1024 * 1024; // Increase max upload size on mobile
 * }
 */
export interface Attributes {
    /**
     * The shape of the note changes depending on the user's terminal.
     */
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
     * vn.variables.attFileMaxSize[0] = 50 * 1024 * 1024;
     * ```
     */
    attFileMaxSize: number;
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
     * vn.variables.attImageMaxSize[0] = 50 * 1024 * 1024;
     * ```
     */
    attImageMaxSize: number;

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
    /** 
     * Placeholder text color
     */
    placeholderColor: string;
    /** 
     * Placeholder background color
     */
    placeholderBackgroundColor: string;
    /** 
     * Placeholder title text
     */
    placeholderTitle: string;
    /** 
     * Placeholder body text
     */
    placeholderTextContent: string;
    /** 
     * Default selectable font families
     */
    defaultFontFamilies: string[];
    /** 
     * Maximum undo/redo record count
     */
    recodeLimit: number;
    /** 
     * Main theme color for the editor
     */
    mainColor: string;
    /** 
     * Predefined color set name
     */
    colorSet: string;
    /** 
     * Whether to use inverted (dark mode) colors
     */
    invertColor: boolean;
    /** 
     * Whether to use paragraph style buttons (normal, heading, etc.)
     */
    usingParagraphStyle: boolean;
    /** 
     * Whether to use bold button
     */
    usingBold: boolean;
    /** 
     * Whether to use underline button
     */
    usingUnderline: boolean;
    /** 
     * Whether to use italic button
     */
    usingItalic: boolean;
    /** 
     * Whether to use unordered list (ul) button
     */
    usingUl: boolean;
    /** 
     * Whether to use ordered list (ol) button
     */
    usingOl: boolean;
    /** 
     * Whether to use text align buttons (left, center, right)
     */
    usingTextAlign: boolean;
    /** 
     * Whether to use attach link button
     */
    usingAttLink: boolean;
    /** 
     * Whether to use attach file button
     */
    usingAttFile: boolean;
    /** 
     * Whether to use attach image button
     */
    usingAttImage: boolean;
    /** 
     * Whether to use attach video button
     */
    usingAttVideo: boolean;
    /** 
     * Whether to allow font size adjustment
     */
    usingFontSize: boolean;
    /** 
     * Whether to allow letter spacing adjustment
     */
    usingLetterSpacing: boolean;
    /** 
     * Whether to allow line height adjustment
     */
    usingLineHeight: boolean;
    /** 
     * Whether to allow font family change
     */
    usingFontFamily: boolean;
    /** 
     * Whether to allow text color change
     */
    usingColorText: boolean;
    /** 
     * Whether to allow background color change
     */
    usingColorBack: boolean;
    /** 
     * Whether to use format clear (remove styles) button
     */
    usingFormatClear: boolean;
    /** 
     * Whether to use undo button
     */
    usingUndo: boolean;
    /** 
     * Whether to use redo button
     */
    usingRedo: boolean;
    /** 
     * Whether to use help (shortcut guide) button
     */
    usingHelp: boolean;
}

export interface NoteAttributes extends Attributes {
    /**
     * Whether to perform mobile operation mode
     */
    isNoteByMobile: boolean;
    /**
     * Position of the toolbar
     */
    toolPosition: ToolPosition.bottom | ToolPosition.top;
    /**
     * Toolbar Line Count
     */
    toolDefaultLine: number;
    /**
     * Whether to use the toolbar fold/unfold function
     */
    toolToggleUsing: boolean;
    /**
     * Note size scale
     */
    sizeRate: number;
}
