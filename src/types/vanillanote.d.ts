import { Csses, Colors } from './csses'
import { documentEvents } from './events';
import { LanguageSet } from './language'
import { Variables } from './variables';

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
     * The editor's CSS definitions.
     * - The final CSS styles are dynamically inserted into the document’s header.
     * - CSS selectors are generated in the format: `.vanillanote_[index]_[css-key] { ... }`
     * - Values are defined as key-value pairs and can be customized before creation using `vanillanote_onBeforeCreate()`.
     */
	csses: Csses;
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
	 *
	 * @example
	 * if (isMobileDevice) {
	 *   vn.variables.attFileMaxSizes[0] = 50 * 1024 * 1024; // Increase max upload size on mobile
	 * }
	 */
	variables: Variables;
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
     * vn._beforeAlert = function(message) {
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
    /**
     * Keyframe animation definitions used within the editor’s UI.
     */
	keyframes: Keyframes;
    /**
     * Stores registered event handlers, allowing runtime tracking and dynamic removal if necessary.
     */
	documentEvents: documentEvents;
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
	get(noteId: string): Vanillanote | null;

	create(element: HTMLElement):void;
	destroy(element: HTMLElement):void;
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
	getNoteData(): {
	  noteIndex: number;
	  textarea: HTMLElement;
	  files: Record<string, File>;
	};
	/**
	 * Returns the automatically assigned index of this editor.
	 *
	 * - The index is assigned in the order the editor elements are created and inserted into the DOM.
	 * - This value matches the `data-index` attribute of the editor element.
	 * - Can be used for event handling or to easily access related editor controls by index.
	 *
	 * @returns The numeric index of this editor in the DOM.
	 *
	 * @example
	 * const editorEl = document.querySelectorAll('[data-vanillanote]')[0];
	 * const index = editorEl.getNoteIndex();
	 * console.log(index); // 0
	 */
	getNoteIndex(): number;

}
