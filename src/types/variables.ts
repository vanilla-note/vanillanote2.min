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
export interface Variables {
	/**
	 * - A unique name assigned during the editor's creation. The name assigned to elements, CSS, etc., can be dynamically set through .noteName to be completely separated from the user's existing source.
	 * - For example, changing vn.variables.noteName to 'test' will set all element IDs to 'test_[idx]_[element]', e.g., 'test_0_textarea'.
	 */
	noteName: string;
	observerOptions: {
		characterData: boolean,
		childList: boolean,
		subtree: boolean
	};
	lastActiveNoteId: string;
	lastScreenHeight: number | null;
	mobileKeyboardExceptHeight: number | null;
	isSelectionProgress: boolean;
	preventChangeScroll: number;
	/**
	 * - Interval time for each event. There’s no need to change, but might be necessary in special situations like drawing more than 20 editors on one screen.
	 * - Interval of the window resize event. Default value is 50.
	 */
	resizeInterval: number;
	/**
	 * - Interval time for each event. There’s no need to change, but might be necessary in special situations like drawing more than 20 editors on one screen.
	 * - Interval of the textarea input event. Default value is 50.
	 */
	inputInterval: number;
	/**
	 * - Interval time for each event. There’s no need to change, but might be necessary in special situations like drawing more than 20 editors on one screen.
	 * - Interval given when loading the editor. Default value is 100. For arranging visual elements like converting text to icons and adjusting editor size before displaying.
	 */
	loadInterval: number;
	canEvent: boolean;
}
