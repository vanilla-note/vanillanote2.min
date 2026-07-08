// vanillanote2 smoke test — run: npm test (requires prior npm run build)
// jsdom(devDependency)으로 DOM을 구성해 mount→데이터→undo/redo·이벤트 계약까지 검증한다.
// (IME 조합·visualViewport 등 실브라우저 전용 동작은 코드 리뷰 + playground로 보완)
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>', { pretendToBeVisual: true });
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.HTMLSpanElement = dom.window.HTMLSpanElement;
globalThis.HTMLBRElement = dom.window.HTMLBRElement;
globalThis.Element = dom.window.Element;
globalThis.Node = dom.window.Node;
globalThis.MutationObserver = dom.window.MutationObserver;
globalThis.getComputedStyle = dom.window.getComputedStyle.bind(dom.window);
if (!globalThis.requestAnimationFrame) globalThis.requestAnimationFrame = (cb) => setTimeout(cb, 0);
if (!globalThis.cancelAnimationFrame) globalThis.cancelAnimationFrame = (id) => clearTimeout(id);

const M = await import('../dist/Vanillanote2.bundle.js');
const { getVanillanote } = M.default ?? M;

let pass = 0, fail = 0;
const eq = (label, actual, expected) => {
    const a = JSON.stringify(actual), e = JSON.stringify(expected);
    if (a === e) { pass++; }
    else { fail++; console.error(`FAIL ${label}\n  expected: ${e}\n  actual  : ${a}`); }
};
const noThrow = (label, fn) => {
    try { fn(); pass++; }
    catch (err) { fail++; console.error(`FAIL ${label} (threw: ${err.message})`); }
};
const tick = () => new Promise(r => setTimeout(r, 0));

document.body.innerHTML = `
<input id="outside-input" type="text" />
<div data-vanillanote data-id="note1" note-mode-by-device="DESKTOP" add-font-family="TestFontA"></div>
<div data-vanillanote data-id="note2" note-mode-by-device="MOBILE"></div>`;

const vn = getVanillanote();
const globalFontsBefore = vn.attributes.defaultFontFamilies.length;
vn.init();
noThrow('mountNote', () => vn.mountNote());

const note1 = vn.getNote('note1');
const note2 = vn.getNote('note2');
eq('getNote(note1)', !!note1, true);
eq('getNote(note2)', !!note2, true);

/* 초기 구조: P > BR */
eq('초기 P', note1._elements.textarea.firstChild.tagName, 'P');
eq('초기 BR', note1._elements.textarea.firstChild.firstChild.tagName, 'BR');

/* B4: note-mode-by-device 파싱 정상화 */
eq('B4 DESKTOP', note1._attributes.isNoteByMobile, false);
eq('B4 MOBILE', note2._attributes.isNoteByMobile, true);

/* C1: colorBackSelectBox id 오타 수정 */
eq('C1 colorBackSelectBox id', note1._elements.colorBackSelectBox.getAttribute('id').includes('colorBackSelectBox'), true);
eq('C1 id 중복 없음', document.querySelectorAll('#' + note1._elements.colorTextSelectBox.getAttribute('id')).length, 1);

/* C2: 전역 defaultFontFamilies 오염 방지 (add-font-family가 노트에만 반영) */
eq('C2 전역 폰트목록 불변', vn.attributes.defaultFontFamilies.length, globalFontsBefore);
eq('C2 노트별 폰트 추가', note1._attributes.defaultFontFamilies.includes('TestFontA'), true);
eq('C2 타 노트 미반영', note2._attributes.defaultFontFamilies.includes('TestFontA'), false);

/* setNoteData / getNoteData */
note1.setNoteData({ html: '<p><span>hello</span></p>', plainText: '', links: [], files: [], images: [], videos: [], fileObjects: {}, imageObjects: {} });
eq('setNoteData→plainText', note1.getNoteData().plainText, 'hello');
eq('getNoteData html', note1.getNoteData().html.includes('hello'), true);

/* A3: 노트 밖 Ctrl+Z는 브라우저 기본 동작 보존 (preventDefault 안 함) */
{
    const outside = document.getElementById('outside-input');
    outside.focus();
    const ev = new dom.window.KeyboardEvent('keydown', { key: 'z', ctrlKey: true, bubbles: true, cancelable: true });
    outside.dispatchEvent(ev);
    eq('A3 노트 밖 Ctrl+Z 미차단', ev.defaultPrevented, false);
}

/* undo/redo + A4(한도 도달 후에도 observer 생존) */
{
    // DOM 변경 → observer가 기록
    const p = document.createElement('p');
    p.textContent = 'record1';
    note1._elements.textarea.appendChild(p);
    await tick(); await tick();
    const recodesAfterEdit = note1._recodes.recodeNotes.length;
    eq('observer 기록 동작', recodesAfterEdit > 0, true);

    // undo를 한도(0)까지 반복 + 한도 초과 클릭 (A4: 예전엔 여기서 observer가 영구 disconnect)
    for (let i = 0; i < recodesAfterEdit + 3; i++) note1._elements.undoButton.click();
    eq('undo 한도 가드', note1._recodes.recodeCount, 0);

    // A4 검증: 한도 초과 undo 후에도 새 변경이 기록되는가
    const before = note1._recodes.recodeNotes.length;
    const p2 = document.createElement('p');
    p2.textContent = 'record2';
    note1._elements.textarea.appendChild(p2);
    await tick(); await tick();
    eq('A4 observer 생존', note1._recodes.recodeNotes.length > before, true);

    // redo 한도 초과 클릭 후에도 동일
    for (let i = 0; i < 30; i++) note1._elements.redoButton.click();
    const before2 = note1._recodes.recodeNotes.length;
    const p3 = document.createElement('p');
    p3.textContent = 'record3';
    note1._elements.textarea.appendChild(p3);
    await tick(); await tick();
    eq('A4 redo 후 observer 생존', note1._recodes.recodeNotes.length > before2, true);
}

/* A2: IME 조합 중 기록 스킵, compositionend에서 1회 기록 */
{
    const textarea = note1._elements.textarea;
    textarea.dispatchEvent(new dom.window.CompositionEvent('compositionstart', { bubbles: true }));
    eq('A2 조합 플래그 on', note1._isComposing, true);
    const before = note1._recodes.recodeNotes.length;
    const span = document.createElement('span');
    span.textContent = 'ㄱ';
    textarea.appendChild(span);
    await tick(); await tick();
    eq('A2 조합 중 기록 스킵', note1._recodes.recodeNotes.length, before);
    textarea.dispatchEvent(new dom.window.CompositionEvent('compositionend', { bubbles: true }));
    eq('A2 조합 플래그 off', note1._isComposing, false);
    eq('A2 조합 완료 기록', note1._recodes.recodeNotes.length, before + 1);
}

/* 리팩토링 검증: 이벤트 키 유지 + 팩토리 동작 + note._colors 참조 교정 */
{
    const keys = ['styleNomal_onClick','styleHeader1_onClick','styleHeader6_onClick','boldButton_onClick',
        'underlineButton_onClick','italicButton_onClick','textAlignLeft_onClick','textAlignRight_onClick',
        'colorText1_onClick','colorText7_onClick','colorBack1_onClick','colorBack7_onClick',
        'colorTextRInput_onInput','colorBackBInput_onBlur'];
    eq('리팩토링 키 유지', keys.every(k => typeof vn.events.elementEvents[k] === 'function'), true);

    vn.events.elementEvents.colorText3_onClick({ target: note1._elements.colorText3 });
    eq('팩토리 colorText3', note1._recodes && note1._status.colorTextRGB, note1._colors.color16);
    vn.events.elementEvents.colorBack5_onClick({ target: note1._elements.colorBack5 });
    eq('팩토리 colorBack5 (note._colors 참조)', note1._status.colorBackRGB, note1._colors.color18);

    // bold 토글 팩토리
    const boldBefore = note1._status.boldToggle;
    vn.events.elementEvents.boldButton_onClick({ target: note1._elements.boldButton });
    eq('팩토리 boldToggle', note1._status.boldToggle, !boldBefore);

    // RGB hex input 팩토리
    note1._elements.colorTextRInput.value = 'a1';
    vn.events.elementEvents.colorTextRInput_onInput({ target: note1._elements.colorTextRInput });
    eq('팩토리 hexInput', note1._status.colorTextR, 'a1');
}

/* createElementInput 등 부속 요소 */
eq('fontSize input 존재', !!note1._elements.fontSizeInput, true);
eq('paragraphStyleSelectBox 존재', !!note1._elements.paragraphStyleSelectBox, true);

/* unmount / destroy */
noThrow('unmountNote', () => vn.unmountNote());
eq('unmount 후 getNote', vn.getNote('note1'), null);
noThrow('destroy', () => vn.destroy());

console.log(`\nsmoke: ${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
