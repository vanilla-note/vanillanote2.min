/**
 * CSS definitions applied to each Vanillanote instance.
 * - The styles are injected dynamically, scoped to each editor by index-based class selectors.
 * - Supports dynamic styling for states like mouseover, mouseout, focus, and more.
 * - Styles are defined as key-value objects, and custom styles can be set in `vanillanote_onBeforeCreate()`.
 */
export interface Csses {
	/**
	 * CSS for the h1 tag inserted into the editor's textarea.
	 */
	"template h1" : Record<string, string>;
	/**
	 * CSS for the h2 tag inserted into the editor's textarea.
	 */
	"template h2" : Record<string, string>;
	/**
	 * CSS for the h3 tag inserted into the editor's textarea.
	 */
	"template h3" : Record<string, string>;
	/**
	 * CSS for the h4 tag inserted into the editor's textarea.
	 */
	"template h4" : Record<string, string>;
	/**
	 * CSS for the h5 tag inserted into the editor's textarea.
	 */
	"template h5" : Record<string, string>;
	/**
	 * CSS for the h6 tag inserted into the editor's textarea.
	 */
	"template h6" : Record<string, string>;
	/**
	 * CSS for the ul tag inserted into the editor's textarea.
	 */
	"textarea ul" : Record<string, string>;
	/**
	 * CSS for the ol tag inserted into the editor's textarea.
	 */
	"textarea ol" : Record<string, string>;
	/**
	 * CSS for the li tag inserted into the editor's textarea.
	 */
	"textarea li" : Record<string, string>;
	/**
	 * CSS for the p tag inserted into the editor's textarea.
	 */
	"textarea p" : Record<string, string>;
	/**
	 * CSS for the div tag inserted into the editor's textarea.
	 */
	"textarea div" : Record<string, string>;
	/**
	 * CSS for the span tag inserted into the editor's textarea.
	 */
	"textarea span" : Record<string, string>;
	/**
	 * CSS for the a tag inserted into the editor's textarea.
	 */
	"textarea a" : Record<string, string>;
	/**
	 * CSS for the largest div that wraps both the toolbar and textarea of the editor (template).
	 */
	"template" : Record<string, string>;
	/**
	 * CSS for the editor's textarea.
	 */
	"textarea" : Record<string, string>;
	/**
	 * CSS for the editor's toolbar.
	 */
	"tool" : Record<string, string>;
	/**
	 * CSS for the icons of the editor.
	 */
	"icon" : Record<string, string>;
	/**
	 * CSS for the buttons on the toolbar of the editor.
	 */
	"button" : Record<string, string>;
	/**
	 * CSS for the combo button on the toolbar of the editor.
	 */
	"select" : Record<string, string>;
	/**
	 * CSS for the combo window of the editor. font-family, paragraph-style.
	 */
	"select_box_a" : Record<string, string>;
	/**
	 * CSS for the combo window of the editor. text-align.
	 */
	"select_box_b" : Record<string, string>;
	/**
	 * CSS for the combo window of the editor. text-color, background-color.
	 */
	"select_box_c" : Record<string, string>;
	/**
	 * CSS for the combo items of the editor. font-family, paragraph-style.
	 */
	"select_list" : Record<string, string>;
	/**
	 * CSS for the combo items of the editor. text-align.
	 */
	"select_list_button" : Record<string, string>;
	/**
	 * CSS for the button wrapping the small_input on the toolbar of the editor. font-size, letter-spacing, line-height.
	 */
	"small_input_box" : Record<string, string>;
	/**
	 * CSS for the small_input on the toolbar of the editor. font-size, letter-spacing, line-height.
	 */
	"small_input" : Record<string, string>;
	/**
	 * CSS for the small_input on the toolbar of the editor when focused.
	 */
	"small_input:focus" : Record<string, string>;
	/**
	 * CSS for the -webkit-inner-spin-button of the small_input on the toolbar of the editor.
	 */
	"small_input::-webkit-inner-spin-button" : Record<string, string>;
	/**
	 * CSS for the -webkit-outer-spin-button of the small_input on the toolbar of the editor.
	 */
	"small_input::-webkit-outer-spin-button" : Record<string, string>;
	/**
	 * CSS for the [type=number] of the small_input on the toolbar of the editor.
	 */
	"small_input[type=number]" : Record<string, string>;
	/**
	 * CSS for the general buttons of the editor. Buttons at the bottom of each modal.
	 */
	"normal_button" : Record<string, string>;
	/**
	 * CSS for the opacity buttons of the editor. Image next, prev buttons in image attachment modal.
	 */
	"opacity_button" : Record<string, string>;
	/**
	 * CSS for the span where text is inserted in the image tooltip of the editor.
	 */
	"small_text_box" : Record<string, string>;
	/**
	 * CSS for the modal background of the editor.
	 */
	"modal_back" : Record<string, string>;
	/**
	 * CSS for the modal body of the editor.
	 */
	"modal_body" : Record<string, string>;
	/**
	 * CSS for the modal header of the editor.
	 */
	"modal_header" : Record<string, string>;
	/**
	 * CSS for the modal footer of the editor.
	 */
	"modal_footer" : Record<string, string>;
	/**
	 * CSS for the modal explain (explanation text) of the editor.
	 */
	"modal_explain" : Record<string, string>;
	/**
	 * CSS for the modal long input of the editor.
	 */
	"modal_input" : Record<string, string>;
	/**
	 * CSS for the modal long input of the editor when focused.
	 */
	"modal_input:focus" : Record<string, string>;
	/**
	 * editor's modal input(long input) readonly state css.
	 */
	"modal_input[readonly]" : Record<string, string>;
	/**
	 * editor's modal input(small input) css.
	 */
	"modal_small_input" : Record<string, string>;
	/**
	 * editor's modal input(small input) focus css.
	 */
	"modal_small_input:focus" : Record<string, string>;
	/**
	 * editor's modal input(small input) -webkit-inner-spin-button css.
	 */
	"modal_small_input::-webkit-inner-spin-button" : Record<string, string>;
	/**
	 * editor's modal input(small input) -webkit-outer-spin-button css.
	 */
	"modal_small_input::-webkit-outer-spin-button" : Record<string, string>;
	/**
	 * editor's modal input(small input) [type=number] css.
	 */
	"modal_small_input[type=number]" : Record<string, string>;
	/**
	 * editor's modal input(small input) readonly state css.
	 */
	"modal_small_input[readonly]" : Record<string, string>;
	/**
	 * editor's link attachment modal blank checkbox label css.
	 */
	"att_link_is_blank_label" : Record<string, string>;
	/**
	 * editor's link attachment modal validation checkbox css.
	 */
	"att_valid_checktext" : Record<string, string>;
	/**
	 * editor's input checkboxes css.
	 */
	"input_checkbox" : Record<string, string>;
	/**
	 * editor's input checkboxes focus css.
	 */
	"input_checkbox:focus" : Record<string, string>;
	/**
	 * editor's input checkboxes disabled state css.
	 */
	"input_checkbox[disabled]" : Record<string, string>;
	/**
	 * editor's small px input css for image tooltip.
	 */
	"smallpx_input" : Record<string, string>;
	/**
	 * editor's small px input focus css.
	 */
	"smallpx_input:focus" : Record<string, string>;
	/**
	 * editor's small px input -webkit-inner-spin-button css.
	 */
	"smallpx_input::-webkit-inner-spin-button" : Record<string, string>;
	/**
	 * editor's input radios css.
	 */
	"input_radio" : Record<string, string>;
	/**
	 * editor's input radios focus css.
	 */
	"input_radio:focus" : Record<string, string>;
	/**
	 * editor's input radios checked css.
	 */
	"input_radio:checked" : Record<string, string>;
	/**
	 * editor's input radios disabled state css.
	 */
	"input_radio[disabled]" : Record<string, string>;
	/**
	 * editor's modal file input css.
	 */
	"modal_input_file" : Record<string, string>;
	/**
	 * editor's modal file drag and drop div css.
	 */
	"drag_drop_div" : Record<string, string>;
	/**
	 * editor's modal image display div css.
	 */
	"image_view_div" : Record<string, string>;
	/**
	 * editor's color combo window color buttons css.
	 */
	"color_button" : Record<string, string>;
	/**
	 * editor's color combo window rgb, opacity input css.
	 */
	"color_input" : Record<string, string>;
	/**
	 * editor's color combo window rgb, opacity input focus css.
	 */
	"color_input:focus" : Record<string, string>;
	/**
	 * editor's color combo window rgb, opacity input -webkit-inner-spin-button css.
	 */
	"color_input::-webkit-inner-spin-button" : Record<string, string>;
	/**
	 * editor's color combo window rgb, opacity label text span css.
	 */
	"color_explain" : Record<string, string>;
	/**
	 * editor's tooltip css.
	 */
	"tooltip" : Record<string, string>;
	/**
	 * editor's tooltip button css.
	 */
	"tooltip_button" : Record<string, string>;
	/**
	 * editor's link tooltip href text css.
	 */
	"att_link_tooltip_href" : Record<string, string>;
	/**
	 * editor's modal help main body css.
	 */
	"help_main" : Record<string, string>;
	/**
	 * editor's placeholder css.
	 */
	"placeholder" : Record<string, string>;
	/**
	 * editor's button, combo etc. on state css.
	 */
	"on_button_on" : Record<string, string>;
	/**
	 * editor's button, combo etc. active state css.
	 */
	"on_active" : Record<string, string>;
	/**
	 * editor's button, combo etc. mouse over state css.
	 */
	"on_mouseover" : Record<string, string>;
	/**
	 * editor's button, combo etc. mouse out state css.
	 */
	"on_mouseout" : Record<string, string>;
	/**
	 * editor's display inline defined
	 */
	"on_display_inline" : Record<string, string>;
	/**
	 * editor's display inline block defined
	 */
	"on_display_inline_block" : Record<string, string>;
	/**
	 * editor's display block defined
	 */
	"on_display_block" : Record<string, string>;
	/**
	 * editor's display none defined
	 */
	"on_display_none" : Record<string, string>;
}

/**
 * Color schemes for the editor's UI components.
 * - 20 predefined color sets, each defined as an array for multi-editor customization.
 * - Used for styling icons, backgrounds, text colors, borders, and modals.
 * - Can be customized per editor instance for unique appearances.
 */
export interface Colors {
	/**
	 * filled color(icon)
	 */
	color1 : string;
	/**
	 * empty color(textarea)
	 */
	color2 : string;
	/**
	 * toolbar color
	 */
	color3 : string;
	/**
	 * button color
	 */
	color4 : string;
	/**
	 * active color
	 */
	color5 : string;
	/**
	 * border color(modal)
	 */
	color6 : string;
	/**
	 * 	box-shadow color(button)
	 */
	color7 : string;
	/**
	 * correct text color
	 */
	color8 : string;
	/**
	 * notice or error text color
	 */
	color9 : string;
	/**
	 * modal text color
	 */
	color10: string;
	/**
	 * a tag color
	 */
	color11: string;
	/**
	 * default of user custom textarea text color
	 */
	color12: string;
	/**
	 * default of user custom textarea text background color
	 */
	color13: string;
	/**
	 * textarea text and background color1
	 */
	color14: string;
	/**
	 * textarea text and background color2
	 */
	color15: string;
	/**
	 * textarea text and background color3
	 */
	color16: string;
	/**
	 * textarea text and background color4
	 */
	color17: string;
	/**
	 * textarea text and background color5
	 */
	color18: string;
	/**
	 * textarea text and background color6
	 */
	color19: string;
	/**
	 * textarea text and background color7
	 */
	color20: string;
}
