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

/**
 * The `Vanillanote` interface defines the structure of the main global object
 * representing the entire Vanillanote editor system at runtime.
 *
 * - This object is created **once** and **only once** via the `getVanillanote()` function.
 * - It follows a **singleton pattern**, meaning that all operations related to editor creation, mounting, unmounting, 
 *   and destruction share the same `Vanillanote` instance.
 * - This object consolidates critical constants, configurations, runtime state, event handlers, and mounted editor elements
 *   in a single, centralized location.
 *
 * ### Composition
 * - Inherits from `VanillanoteConfig`, which includes user-provided or default editor settings.
 * - Includes additional properties for managing the editor’s internal states, events, and DOM elements dynamically.
 *
 * ---
 *
 * ### Properties
 *
 * #### consts: `Consts`
 * - Immutable critical constants used internally by Vanillanote for HTML structure, tag management, and logic control.
 * - **Do not modify manually** as it may cause critical errors.
 *
 * #### events
 * - **documentEvents**: Document-wide event handlers (e.g., `selectionchange`, `keydown`, `resize`).
 * - **cssEvents**: General event handlers related to CSS hover/touch interactions.
 * - **elementEvents**: Fine-grained event hooks for specific Vanillanote buttons, inputs, and modals.
 *
 * #### vanillanoteElements: `Record<string, VanillanoteElement>`
 * - Stores references to all editor instances mounted onto the page.
 * - Keyed by each editor's unique ID (`data-id` or auto-generated ID).
 *
 * #### _initialized: `boolean`
 * - A flag indicating whether the global initialization (`init()`) has already been performed.
 * - Prevents re-initializing event handlers and global styles multiple times.
 *
 * ---
 *
 * ### Methods
 *
 * #### getNote(noteId: string): `VanillanoteElement | null`
 * - Retrieves a mounted `VanillanoteElement` based on its `data-id` or auto-assigned index.
 * - Provides convenient, type-safe access to specific editors for programmatic control.
 * - Supports both:
 *   - Numeric index (DOM order, starting from 0).
 *   - String ID (custom `data-id` attribute).
 *
 * #### init(): `void`
 * - Initializes document-level event listeners, styles, and Google Fonts required by Vanillanote.
 * - **Must be called exactly once** before mounting any editors.
 *
 * #### mountNote(element?: HTMLElement): `void`
 * - Scans the given `element` (or entire `document` if omitted) for `[data-vanillanote]` attributes
 *   and converts matching `div` elements into fully functional Vanillanote editors.
 * - Multiple editors can be created with a single call.
 *
 * #### destroy(): `void`
 * - Cleans up all global event listeners, removes injected styles, and resets the singleton instance.
 * - Should be called during full page unload, application shutdown, or manual editor lifecycle management.
 *
 * #### unmountNote(element?: HTMLElement): `void`
 * - Destroys only specific mounted editor(s) within the given element or globally if no element is provided.
 * - Useful for unmounting individual editors dynamically (e.g., in SPA frameworks like Vue, React).
 *
 * ---
 *
 * ### Usage Example
 *
 * ```typescript
 * import { getVanillanote } from 'vanillanote2';
 *
 * const vn = getVanillanote();
 * vn.init();  // Set up document-wide styles and events
 *
 * // Mount all editors inside a specific container
 * const container = document.getElementById('editor-container');
 * vn.mountNote(container);
 *
 * // Later, unmount only the editors inside that container
 * vn.unmountNote(container);
 *
 * // Or destroy everything at once
 * vn.destroy();
 * ```
 *
 * ---
 *
 * ### Important Notes
 * - `getVanillanote()` always returns the same object across the entire application lifecycle.
 * - You should always call `init()` before trying to `mountNote()` or `getNote()`.
 * - Custom configuration (colors, languages, attributes) must be injected via `getVanillanote(config)` before the first use.
 * - Internally, Vanillanote ensures clean separation between global logic (document events, styles) and per-instance logic (editors).
 */
export interface Vanillanote extends VanillanoteConfig{
	/**
     * Critical constants required for the editor’s internal logic.
     * Modifying these values may cause severe errors and is not recommended.
     */
	consts: Consts;
	/**
	 * Stores all event handlers and listeners used by the Vanillanote system.
	 *
	 * - Divided into three categories based on their scope:
	 *   - `documentEvents`: Events bound to the global `document` or `window` (e.g., selection changes, window resize).
	 *   - `cssEvents`: Style-related interactions like hover, click, and touch feedback.
	 *   - `elementEvents`: Detailed events tied to specific UI components inside each editor (e.g., toolbars, modals, inputs).
	 *
	 * All event references are initialized as `null` and properly assigned during editor initialization.
	 * When destroying the editor, these events are removed and nulled to prevent memory leaks.
	 *
	 * @remarks
	 * Managing events separately by type improves maintainability and enables fine-grained control when mounting or unmounting editors individually.
	 */
	events: {
		/**
		 * Global event listeners attached to the `document` or `window`.
		 * 
		 * - Manages editor-wide behaviors such as text selection, keyboard input, and window resizing.
		 * - Examples: `selectionchange`, `keydown`, `resize`, `visualViewport.resize`.
		 */
		documentEvents: DocumentEvents;
		/**
		 * Event handlers related to general mouse, hover, and touch interactions.
		 * 
		 * - Typically used for toggling button hover states, tooltip activation, or touch-specific feedback.
		 * - Applied globally to editor-related CSS targets.
		 */
		cssEvents: CssEvents;
		/**
		 * Fine-grained event handlers attached to individual editor elements.
		 * 
		 * - Manages UI components like toolbars, buttons, modals, and input fields.
		 * - Covers `click`, `input`, `blur`, `keydown`, and other element-specific interactions.
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
	 * - Allows convenient access to the editor’s programmatic API (`getNoteData()`, `setNoteData()`) without manual casting.
	 *
	 * ### Example usage:
	 * ```ts
	 * // Using custom ID:
	 * const note = Vanillanote.getNote('my-editor-id');
	 * console.log(note.getNoteData());
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
	/**
	 * Initializes the Vanillanote system.
	 *
	 * - Sets up shared handlers and utility functions globally.
	 * - Registers necessary global event listeners on `document` and `window`.
	 * - Injects required styles and icon links (`<style>`, `<link>`) into the `<head>`.
	 * - Prepares the Vanillanote singleton (`_initialized = true`) for mounting editors later.
	 *
	 * @remarks
	 * - **SSR (Server-Side Rendering) consideration:**  
	 *   In server-side environments like Nuxt, Next.js, etc., `document` and `window` are unavailable during server rendering.
	 *   To safely use Vanillanote2 in SSR, you must call `init()` **after** the DOM is fully available (e.g., on `mounted` in Vue, or `useEffect` in React).
	 * - Originally, this logic was performed inside `getVanillanote()`,  
	 *   but to support SSR environments, it was separated into an explicit `init()` method.
	 * - Multiple calls to `init()` are safe:  
	 *   If Vanillanote has already been initialized (`_initialized = true`), the method does nothing and exits immediately.
	 *
	 * @example
	 * ```ts
	 * const vn = getVanillanote();
	 * vn.init(); // Safe to call multiple times
	 * vn.mountNote();
	 * ```
	 */
	init():void;
	/**
	 * Mounts Vanillanote editors inside a given container.
	 *
	 * - Searches the specified `element` (or `document` if omitted) for elements with `[data-vanillanote]` attributes.
	 * - Converts each matched element into a fully functional Vanillanote editor.
	 * - Registers the mounted editors into the `vanillanoteElements` record for later management.
	 *
	 * @param element - Optional root HTML element. If not provided, the entire `document` will be scanned.
	 *
	 * @example
	 * ```ts
	 * const vn = getVanillanote();
	 * vn.init();
	 * vn.mountNote(document.getElementById('editor-wrapper'));
	 * ```
	 */
	mountNote(element?: HTMLElement): void;
	/**
	 * Completely destroys the Vanillanote system.
	 *
	 * - Removes all global styles, fonts, and event listeners.
	 * - Unmounts and cleans up all existing editors.
	 * - Clears the `vanillanoteElements` record.
	 * - Resets the singleton object (`singletonVanillanote`) to `null`.
	 *
	 * @remarks
	 * After calling `destroy()`, Vanillanote must be re-initialized via `getVanillanote()` before reuse.
	 */
	destroy(): void;
	/**
	 * Unmounts Vanillanote editors inside a given container.
	 *
	 * - Searches the specified `element` (or the entire `document` if omitted) for `[data-vanillanote]` editors.
	 * - For each found editor:
	 *   - Removes its associated inline `<style>` block.
	 *   - Deletes the corresponding record in `vanillanoteElements`.
	 *   - Clears all child nodes from the editor's DOM element.
	 *
	 * @param element - Optional root element. If not provided, unmounts all editors from the document.
	 *
	 * @example
	 * ```ts
	 * const vn = getVanillanote();
	 * vn.unmountNote(document.getElementById('partial-wrapper'));
	 * ```
	 *
	 * @remarks
	 * Use `destroy()` instead if you want to completely remove the entire Vanillanote system, including global styles and event listeners.
	 */
	unmountNote(element?: HTMLElement): void;

	_initialized: boolean;
}

/**
 * Represents a hyperlink (`<a>`) embedded within the Vanillanote editor.
 * 
 * Used by `NoteData.links`.
 */
export interface NoteLinkData {
    /** Displayed text for the link. */
    text: string;
    /** URL that the link points to. */
    href: string;
    /** (Optional) Target attribute (e.g., "_blank" for opening in a new tab). */
    target?: string;
}

/**
 * Represents a file attached inside the Vanillanote editor.
 * 
 * Used by `NoteData.files`.
 */
export interface NoteFileData {
    /** UUID assigned to the file for unique identification. */
    uuid: string;
    /** Original filename of the uploaded file. */
    name: string;
}
  
/**
 * Represents an image attached inside the Vanillanote editor.
 * 
 * Used by `NoteData.images`.
 */
export interface NoteImageData {
    /** Source URL or base64 string for the image. */
    src: string;
    /** (Optional) UUID assigned if the image was uploaded. */
    uuid?: string;
}

/**
 * Represents a video (typically YouTube embedded) attached inside the Vanillanote editor.
 * 
 * Used by `NoteData.videos`.
 */
export interface NoteVideoData {
    /** Source URL or embed ID for the video. */
    src: string;
    /** (Optional) Width value as a percentage string (e.g., "80%"). */
    width?: string;
    /** (Optional) Height value as a pixel string (e.g., "400px"). */
    height?: string;
}

/**
 * Full data snapshot of a single Vanillanote editor instance.
 *
 * - Returned by `VanillanoteElement.getNoteData()`.
 * - Can be used with `VanillanoteElement.setNoteData()` to restore the editor's content.
 *
 * Includes:
 * - HTML structure (`html`).
 * - Plain text without formatting (`plainText`).
 * - Lists of attached links, files, images, and videos.
 * - Active `File` objects for files and images (used during uploads).
 * 
 * @example
 * ```typescript
 * const note = vn.getNote('myEditorId');
 * const data = note?.getNoteData();
 * 
 * // Save or send to server
 * saveNoteData(data);
 * 
 * // Later...
 * note?.setNoteData(savedData);
 * ```
 */
export interface NoteData {
    /** Serialized HTML content of the editor. */
    html: string;
    /** Plain text representation without any HTML tags. */
    plainText: string;
    /** List of embedded hyperlinks. */
    links: NoteLinkData[];
    /** List of attached files. */
    files: NoteFileData[];
    /** List of attached images. */
    images: NoteImageData[];
    /** List of attached videos. */
    videos: NoteVideoData[];
    /** Actual `File` objects for attached files, keyed by UUID. */
    fileObjects: Record<string, File>;
    /** Actual `File` objects for attached images, keyed by UUID. */
    imageObjects: Record<string, File>;
}

/**
 * Represents a single editable Vanillanote instance within the DOM.
 *
 * - Each Vanillanote editor on the page is mounted into a `VanillanoteElement`, 
 *   which extends `HTMLDivElement` and adds additional internal properties and methods.
 * - All editors are dynamically generated based on a `<div data-vanillanote>` element.
 * - Editors are automatically assigned a unique `_id`, based on creation order or a custom `data-id`.
 * - Each `VanillanoteElement` manages its own selection state, styling, events, attachment data, and DOM references.
 *
 * ### Key Features:
 * - Manages internal selections, styles, file attachments, and UI states independently per editor.
 * - Provides API methods like `getNoteData()` to export editor content and `setNoteData()` to restore editor state.
 * - Supports rich text editing features including text styling, file/image/video attachment, undo/redo history, placeholders, and more.
 * - Integrates before/after event hooks to customize interaction behaviors.
 *
 * ### Internal Structure:
 * - `_selection`: Tracks selection state like current selection range, start/end nodes, and drag selections.
 * - `_attributes`: Stores editor behavior settings like device mode, language, and size constraints.
 * - `_status`: Stores current toggled states (e.g., bold active, selected color).
 * - `_elements`: References to important DOM elements (textarea, toolbar buttons, modals, etc.).
 * - `_cssEvents`: Low-level event handlers (click, touch) for custom interaction logic.
 * - `_elementEvents`: High-level hooks for specific UI elements.
 * - `_attFiles`, `_attImages`: Manage attached files/images.
 * - `_recodes`: Manage undo/redo history for editing actions.
 *
 * ### Usage Example:
 * ```ts
 * const note = Vanillanote.getNote('my-editor-id');
 * const data = note.getNoteData();
 * 
 * console.log(data.html); // Editor HTML content
 * editor.setNoteData(data); // Restore content
 * ```
 *
 * @remarks
 * - `VanillanoteElement` is automatically created when calling `vn.mountNote()`.
 * - It should not be manually instantiated by developers.
 * - Each `VanillanoteElement` belongs to a shared singleton `Vanillanote` object.
 * - Supports multiple editors per page.
 *
 * @see Vanillanote
 * @see getNoteData
 * @see setNoteData
 */
export interface VanillanoteElement extends HTMLDivElement {
	/**
	 * The name of the note. Do not change.
	 */
	_noteName: string;
	/**
	 * The id of the note. Do not change.
	 */
	_id: string;
	/**
	 * Color schemes for the editor's UI components.
	 * - 20 predefined color sets, each defined as an array for multi-editor customization.
	 * - Used for styling icons, backgrounds, text colors, borders, and modals.
	 * - Can be customized per editor instance for unique appearances.
	 */
	_colors: Colors;
	/**
	 * Variables that manipulate the selection behavior within a note
	 */
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
	/**
	 * Setting properties that note has. Note settings are changed when changed.
	 */
	_attributes: {
		/**
		 * Whether to perform mobile operation mode
		 */
		isNoteByMobile: boolean;
		/**
		 * Key value for language setting of note
		 */
		language: string;
		/**
		 * Note size scale
		 */
		sizeRate: number;
		/**
		 * Position of the toolbar
		 */
		toolPosition: ToolPosition.bottom | ToolPosition.top;
		/**
		 * Whether to use the toolbar fold/unfold function
		 */
		toolToggleUsing: boolean;
		/**
		 * Toolbar Line Count
		 */
		toolDefaultLine: number;
		/**
		 * - Variables for dynamically setting the size of the textarea
		 * - Default height of the textarea. If not set, the value of textarea-height is inserted. Used for dynamically changing the height. Only insert css style in px units.(ex. 400px)
		 */
		textareaOriginHeight: string;
		/**
		 * default textarea font-size
		 */
		defaultTextareaFontSize: number;
		/**
		 * default textarea line-height
		 */
		defaultTextareaLineHeight: number;
		/**
		 * default tool box font-family
		 */
		defaultTextareaFontFamily: string;
		/**
		 * Default selectable font families
		 */
		defaultFontFamilies: string[];
		/**
		 * File MIME types to block for file attachments
		 */
		attFilePreventTypes: string[];
		/**
		 * File MIME types to allow for file attachments
		 */
		attFileAcceptTypes: string[];
		/**
		 * Maximum size allowed for file attachments (in bytes)
		 */
		attFileMaxSize: number;
		/**
		 * Image MIME types to block for image attachments
		 */
		attImagePreventTypes: string[];
		/**
		 * Image MIME types to allow for image attachments
		 */
		attImageAcceptTypes: string[];
		/**
		 * Maximum size allowed for image attachments (in bytes)
		 */
		attImageMaxSize: number;
		/**
		 * Whether to use a placeholder
		 */
		placeholderIsVisible: boolean;
		/**
		 * Placeholder width
		 */
		placeholderWidth: string;
		/**
		 * Placeholder vertical offset (in px)
		 */
		placeholderAddTop: number;
		/**
		 * Placeholder horizontal offset (in px)
		 */
		placeholderAddLeft: number;
		/**
		 * Placeholder title text
		 */
		placeholderTitle: string;
		/**
		 * Placeholder body text
		 */
		placeholderTextContent: string;
	}
	/**
	 * Current note's editor style application status
	 */
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
        recodeCount: number,
        recodeLimit: number,
	};
	/**
	 * Contains references to all core DOM elements managed by a Vanillanote editor instance.
	 *
	 * - When the editor is initialized, Vanillanote dynamically creates and stores references to important UI components
	 *   (such as the toolbar, buttons, inputs, modals, tooltips, and editable areas) into this `_elements` object.
	 * - Each property corresponds to a specific HTML element (e.g., `<div>`, `<input>`, `<span>`) used in the editor’s structure.
	 *
	 * ## Important Notes
	 * - **Identity Attributes Management**:  
	 *   Each element's `id`, `name`, and `class` attributes are strictly assigned internally according to Vanillanote2's internal conventions.
	 *   **Never manually replace elements** (e.g., by setting `_elements.xxx = newElement`) because this could break internal event bindings and functionality.
	 * - **Safe Modification**:  
	 *   If customization is necessary, **only modify the element’s style properties or attributes safely** without altering or replacing the actual DOM reference.
	 * 
	 *   > Example: `vn.getNote('noteId')._elements.boldButton.style.backgroundColor = 'red';`
	 *
	 * ## Usage Scenarios
	 * - Adjust the appearance of buttons or inputs without breaking editor functionality.
	 * - Retrieve specific elements to attach external behaviors if needed (recommended only for advanced use cases).
	 * - Query child elements to create additional extensions, animations, or effects.
	 *
	 * ## Example
	 * ```ts
	 * const vnEditor = vn.getNote('noteId');
	 * const boldButton = vnEditor?._elements.boldButton;
	 * if (boldButton) {
	 *   boldButton.style.backgroundColor = 'blue'; // OK
	 *   // DO NOT: vnEditor._elements.boldButton = document.createElement('span'); (Not Allowed)
	 * }
	 * ```
	 *
	 * @remarks
	 * - All elements here are guaranteed to exist once `mountNote()` has been called.
	 * - Always validate the existence of an element before manipulating it in case it was conditionally rendered.
	 */
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
	/**
	 * Contains event hook functions applied to individual editable elements inside the Vanillanote editor.
	 *
	 * These events primarily handle low-level mouse and touch interactions such as click, mouseover, and touch gestures.
	 *
	 * - Each event is divided into a **before** and **after** phase:
	 *   - `onBeforeX(event)` is called **before** the default editor behavior occurs.
	 *   - `onAfterX(event)` is called **after** the default editor behavior has been applied.
	 *
	 * - In `onBeforeX(event)`, if `false` is explicitly returned, the corresponding editor behavior will be **canceled**.
	 *   (For example, if `target_onBeforeClick()` returns `false`, the click action will not proceed.)
	 *
	 * - This system allows developers to inject **custom validations, overrides, or intercept actions** without modifying core behavior.
	 *
	 * ## List of Available Event Hooks
	 * | Event Phase | Mouse Events | Touch Events |
	 * |:------------|:-------------|:-------------|
	 * | Before Event | `target_onBeforeClick` / `target_onBeforeMouseover` / `target_onBeforeMouseout` | `target_onBeforeTouchstart` / `target_onBeforeTouchend` |
	 * | After Event | `target_onAfterClick` / `target_onAfterMouseover` / `target_onAfterMouseout` | `target_onAfterTouchstart` / `target_onAfterTouchend` |
	 *
	 * ## Example
	 * ```ts
	 * vn._cssEvents.target_onBeforeClick = (event) => {
	 *   if (event.target instanceof HTMLElement && event.target.dataset.preventClick) {
	 *     return false; // Cancel the click if the target element has a special attribute
	 *   }
	 *   return true;
	 * };
	 * ```
	 *
	 * @remarks
	 * - These are **internal extension points** for developers who want fine-grained control over how mouse and touch interactions are handled inside editable zones.
	 * - They are **optional** to override and default to simple passthrough behavior (`return true`).
	 */
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
	/**
	 * Defines event handlers for specific UI elements within a Vanillanote editor.
	 * 
	 * - Every major interactive element (buttons, inputs, selects, etc.) has paired `_onBeforeX` and `_onAfterX` event hooks.
	 * - `_onBeforeX(event)` is called **before** the default action is processed.
	 * - `_onAfterX(event)` is called **after** the default action is processed.
	 * 
	 * ### Behavior of `_onBeforeX` handlers:
	 * - Must return a `boolean` value.
	 * - If the return value is `false`, the corresponding action (such as a formatting command, modal open, or input handling) will **be canceled**.
	 * - This provides a powerful interception point for validation, customization, or conditional execution.
	 * 
	 * ### Example flow:
	 * 1. User clicks a button (e.g., `boldButton`).
	 * 2. `boldButton_onBeforeClick(event)` is triggered:
	 *    - If it returns `false`, no further action is taken.
	 *    - If it returns `true`, the bold style toggle logic runs.
	 * 3. After processing, `boldButton_onAfterClick(event)` is triggered for any post-processing.
	 * 
	 * ### Usage examples:
	 * ```ts
 	 * const note = Vanillanote.getNote('my-editor-id');
	 * note._elementEvents.boldButton_onBeforeClick(event) {
	 *   if (!canApplyBold()) return false; // Prevent bold if not allowed
	 *   return true;
	 * },
	 * note._elementEvents.italicButton_onAfterClick(event) {
	 *   console.log('Italic style applied!');
	 * }
	 * ```
	 *
	 * @remarks
	 * - This separation allows full control over editor behavior without directly modifying core event handling logic.
	 * - Useful for customizing or extending specific user interactions (e.g., blocking specific tools, adding animation after actions).
	 * - Applies consistently across all editor controls (tools, inputs, modals, etc.).
	 */
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
	/**
	 * Exports the current content and attachment data of this Vanillanote editor instance.
	 *
	 * - Collects the current editor's HTML content (`textarea.innerHTML`) and plain text (`textarea.textContent`).
	 * - Extracts and serializes all attached links, files, images, and videos into structured arrays.
	 * - Captures actual `File` objects (for file uploads) separately for server-side transmission.
	 *
	 * ### When to use:
	 * - Saving or backing up the current editor state.
	 * - Submitting editor content and attachments as form data.
	 * - Synchronizing or transferring editor data between client and server.
	 *
	 * @returns A `NoteData` object containing:
	 * - `html`: The editor's full HTML content.
	 * - `plainText`: The plain text extracted from the editor.
	 * - `links`, `files`, `images`, `videos`: Arrays containing meta-information about inserted links, files, images, and videos.
	 * - `fileObjects`, `imageObjects`: Actual `File` objects mapped by their UUID for uploads.
	 *
	 * @example
	 * ```ts
 	 * const note = Vanillanote.getNote('my-editor-id');
	 * const data = note.getNoteData();
	 * console.log(data.html); // Editor HTML
	 * console.log(Object.keys(data.fileObjects)); // Attached file UUIDs
	 * ```
	 *
	 * @see NoteData
	 * @see setNoteData
	 */
	getNoteData(): NoteData;
	/**
	 * Restores the editor's content and attachments using a previously saved `NoteData` object.
	 *
	 * - Sets the editor's HTML content (`textarea.innerHTML`) and plain text.
	 * - Reattaches previously uploaded files and images based on the provided `NoteData`.
	 * - Reconstructs links, files, images, and video elements inside the editor.
	 * 
	 * ### When to use:
	 * - Loading a previously saved editor state.
	 * - Prepopulating the editor with initial content from server responses.
	 * - Implementing undo/redo snapshots manually.
	 *
	 * ### Important behavior:
	 * - Clears the current editor content before restoring.
	 * - If `fileObjects` or `imageObjects` are present, they are re-linked internally.
	 * - Assumes the incoming `NoteData` was originally generated by `getNoteData()`.
	 *
	 * @param data - A `NoteData` object representing the content and attachments to restore.
	 *
	 * @example
	 * ```ts
 	 * const note = Vanillanote.getNote('my-editor-id');
	 * const savedData = fetchSavedEditorState();
	 * note.setNoteData(savedData);
	 * ```
	 *
	 * @see NoteData
	 * @see getNoteData
	 */
	setNoteData(data: NoteData): void;
}
