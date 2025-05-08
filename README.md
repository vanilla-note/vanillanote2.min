# Vanillanote2

**A Lightweight, Framework-agnostic Rich Text Editor, Rebuilt with TypeScript**

[Homepage (Vanillanote v1)](https://vanilla-note.github.io)

> ⚠️ Currently, Vanillanote2 does not have a dedicated homepage. Please refer to this README and TypeScript documentation.

---

## ✨ Overview

Vanillanote2 is the next evolution of the original Vanillanote editor.

* **Built fully with TypeScript** for improved type safety and development experience.
* **Supports multiple editors** on a single page.
* **SSR-compatible** initialization (for Nuxt, Next, etc.).
* **Highly customizable** via HTML attributes and API.
* **No external dependencies** — pure, minimal, fast.
* **Safe internal structure**: separation of DOM management, event handling, and editor states.

---

## 🔹 Why Vanillanote2?

* 🗕️ **SSR Compatible**: Handles DOM operations safely even in server-rendered applications.
* 🔧 **Customize Per Editor**: Adjust font, color, toolbar position, allowed features via simple HTML attributes.
* 🔍 **Internal Control Access**: Fine-tune editor behavior through exposed internal structures like `_elements` and `_elementEvents`.
* ✨ **Flexible Multi-language Support**: Easily extend or replace language packs.
* ⚡ **Fast and Lightweight**: No runtime overhead.
* 🕺 **No Global Pollution**: Clean lifecycle management with explicit `init()`, `mountNote()`, `unmountNote()`, `destroy()` APIs.

---

## ⚙️ Installation

### Using npm

```bash
npm install vanillanote2
```

---

## 🚀 Getting Started

### 1. Import and Initialize

```typescript
import { getVanillanote, getVanillanoteConfig } from 'vanillanote2';

const vnConfig = getVanillanoteConfig();
const vn = getVanillanote(vnConfig);
vn.init();
```

* In SSR environments (e.g., Nuxt), call `init()` **after** DOM is ready.
* `init()` ensures that Vanillanote2 initializes only once safely using `_initialized`.

### 2. Add HTML Editor Elements

```html
<div data-vanillanote data-id="note1" placeholder-title="Start writing..."></div>
<div data-vanillanote data-id="note2" textarea-height="300px" tool-position="top"></div>
```

### 3. Mount Editors

```typescript
const container = document.getElementById('editorWrap');
vn.mountNote(container);
```

### 4. Access Editor Instances

```typescript
const note1 = vn.getNote('note1');
const noteData = note1?.getNoteData();
```

### 5. Unmount or Destroy

```typescript
vn.unmountNote(container);
// or
vn.destroy();
```

---

## 📋 Customizing Editors via HTML Attributes

Vanillanote2 supports **per-editor customization** directly through `data-vanillanote` element attributes.

| Attribute                  | Description                         | Example                              |
| :------------------------- | :---------------------------------- | :----------------------------------- |
| `note-mode-by-device`      | adaptive, desktop, mobile           | `note-mode-by-device="desktop"`      |
| `textarea-width`           | Width (e.g., `100%`)                | `textarea-width="100%"`              |
| `textarea-height`          | Height (in px)                      | `textarea-height="300px"`            |
| `tool-position`            | top or bottom                       | `tool-position="top"`                |
| `placeholder-is-visible`   | Show placeholder                    | `placeholder-is-visible="true"`      |
| `placeholder-title`        | Placeholder title text              | `placeholder-title="Write here"`     |
| `main-color`               | Main toolbar color                  | `main-color="blue"`                  |
| `color-set`                | Predefined color set                | `color-set="green"`                  |
| `invert-color`             | Invert color scheme                 | `invert-color="true"`                |
| `language`                 | Language key                        | `language="ENG"`                     |
| `default-font-size`        | Initial font size                   | `default-font-size="18"`             |
| `default-line-height`      | Initial line height                 | `default-line-height="24"`           |
| `default-font-family`      | Font family for textarea            | `default-font-family="Arial"`        |
| `default-tool-font-family` | Font family for toolbar             | `default-tool-font-family="Georgia"` |
| `add-font-family`          | Add font(s) to font-family dropdown | `add-font-family="Noto Sans KR"`     |
| `remove-font-family`       | Remove font(s) from dropdown        | `remove-font-family="Comic Sans MS"` |
| `att-file-accept-types`    | Allowed MIME types                  | `att-file-accept-types=".pdf,.docx"` |
| `att-image-max-size`       | Max image size in bytes             | `att-image-max-size="5242880"`       |

**Feature Toggles:**
Disable specific tools by setting them to `false`:

```html
<div data-vanillanote using-bold="false" using-italic="false"></div>
```

| Group Attribute                     | What it disables                       |
| :---------------------------------- | :------------------------------------- |
| `using-paragraph-all-style="false"` | Paragraph, UL, OL, Text-align          |
| `using-character-style="false"`     | Bold, Underline, Italic, Font, Color   |
| `using-character-size="false"`      | Font-size, Letter-spacing, Line-height |
| `using-attach-file="false"`         | Link, File, Image, Video Attach        |
| `using-do="false"`                  | Undo / Redo                            |

> ⚠️ **Attributes override the global config (`vnConfig`) when present.**

---

## 🏠 Internal Structures for Advanced Customization

### 1. `_elements`

```ts
const boldButton = vn.getNote('note1')?._elements.boldButton;
```

* Contains **references to all core DOM elements** used in a specific editor instance.
* All elements (`id`, `class`, `name`) are **strictly assigned internally**.
* ❌ Do **NOT** reassign elements (e.g., `note._elements.boldButton = newSpan`) — it will break internal logic.
* ✅ You **can modify styles safely**:

```ts
boldButton.style.backgroundColor = 'red';
```

### 2. `_elementEvents`

```ts
const note = vn.getNote('note1');
note._elementEvents.boldButton_onBeforeClick = (e) => {
  console.log('Before bold clicked');
  return true;
};
```

* Used to control **tool behavior before/after user interaction**.
* Each method follows the pattern:

  * `onBeforeClick`: return `false` to cancel the action.
  * `onAfterClick`: post-action hook.

```ts
note._elementEvents.boldButton_onAfterClick = (e) => {
  console.log('Bold toggled');
};
```

### 3. `_cssEvents`

* Hooks for general target interactions (click, mouseover, touch).
* More suitable for styling or preview behaviors.

### 4. `iconSpanElement`

Vanillanote2 supports **custom icon replacement**:

```ts
const span = document.createElement('span');
span.classList.add('material-symbols-rounded');
span.textContent = 'edit';
vnConfig.iconSpanElement.boldButtonIcon = span;
```

* Use `getVanillanoteConfig().iconSpanElement` to override any icon button with your own HTMLSpanElement.
* To **disable Google icons**, set:

```ts
vnConfig.useGoogleIcon = false;
```

---

## 📊 Architecture Summary

| Feature                 | Vanillanote v1 | Vanillanote2                         |
| :---------------------- | :------------- | :----------------------------------- |
| Language                | ES5            | TypeScript                           |
| Mounting                | Auto           | Explicit `mountNote()`               |
| SSR Support             | ❌              | ✅                                    |
| Attribute Customization | Limited        | Extensive                            |
| Internal State Access   | Minimal        | Full (`_elements`, `_elementEvents`) |
| Icon Customization      | ❌              | ✅ `iconSpanElement` support          |

---

## 🏦 License

MIT License

---

## 📧 Contact

* **Author**: Hani Son
* **Email**: [hison0319@gmail.com](mailto:hison0319@gmail.com)

---

## ✅ Let's build better editors with **Vanillanote2**!
