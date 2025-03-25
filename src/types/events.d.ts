export interface documentEvents {
	selectionchange: null | ((e: any) => void);
	keydown: null | ((e: any) => void);
	resize: null | ((e: any) => void);
	resizeViewport: null | ((e: any) => void);
}
