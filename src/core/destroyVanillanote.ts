import type { Vanillanote } from "../types/vanillanote";

export const destroyVanillanote = (vn: Vanillanote, element?: HTMLElement) => {
    const targetElement = element ? element : document;

    //if there is no note, no create.
    const notes = targetElement.querySelectorAll('[data-vanillanote]');
}
