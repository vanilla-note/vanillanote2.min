export interface DocumentEvents {
	selectionchange: null | ((e: Event) => void);
	keydown: null | ((e: KeyboardEvent) => void);
	resize: null | ((e: UIEvent) => void);
	resizeViewport: null | ((e: Event) => void);
}
