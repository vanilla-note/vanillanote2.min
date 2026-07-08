# vanillanote2 — hisonvue HNote의 원천 라이브러리

hisonvue **HNote(리치 텍스트 에디터) 컴포넌트가 사용하는 npm `vanillanote2`의 소스 저장소**. 의존성 없는 순수 TypeScript 에디터.

## ⚠️ 형제 폴더 주의 — 분석/작업 대상은 이 저장소(vanillanote2.min)만

부모 폴더에는 구버전 저장소들이 함께 있으나 hisonvue와 무관:

```
vanilla/note/
├─ vanillanote/             ← v1 원천 (구버전 — 분석 불필요)
├─ vanillanote.min/         ← v1 배포본 (구버전 — 분석 불필요)
├─ vanillanote2.min/        ← ★ v2. hisonvue가 사용하는 npm `vanillanote2` (v1.1.1)
│  ├─ src/
│  │  ├─ index.ts           ← export: getVanillanote, getVanillanoteConfig, 타입/enum
│  │  ├─ core/              ← getVanillanote(싱글톤, 1,030줄), mountVanillanote(3,556줄), unmountVanillanote
│  │  ├─ types/             ← vanillanote(1,501줄 = 핵심 인터페이스), attributes, csses, language, consts, enums
│  │  ├─ events/            ← setDocumentEvent / setElementEvent(2,058줄) / setCssEvent
│  │  └─ utils/             ← handleSelection/Active/Element, createElement
│  └─ playground/
└─ vanilla-note.github.io/  ← 전용 문서 사이트 소스
```

## 핵심 사실 (vanillanote2.min v1.1.1)

**v1.1.1 (2026-07-08)**: 보완 프로젝트 6단계에서 버그 15건+리팩토링(~840줄 감소) (내역 = `../../../../md/hisondev-vanillanote.md` 보완 내역 절). 로컬 빌드·스모크(npm test, jsdom 33케이스) 완료, npm publish는 사용자 대기. ⚠️ **한글(IME) 입력 개선은 실브라우저 확인 필요** — playground에서 굵기 켜고 한글 입력 테스트 권장.

- npm `vanillanote2` / 런타임 의존성 없음 / MIT / TypeScript + webpack 번들
- **생명주기 (vanillagrid2와 동일 패턴)**: `getVanillanoteConfig()` → `getVanillanote(config)`(싱글톤) → `vn.init()`(1회) → `vn.mountNote(el?)` → `vn.getNote(id)` → `vn.unmountNote(el?)` → `vn.destroy()`
- HTML 선언: `[data-vanillanote]` 속성 요소를 mountNote가 에디터로 변환
- `vn.getNote(id)` → **VanillanoteElement** (HTMLDivElement 확장). 공개 API: `getNoteData()` / `setNoteData(data)`
- **NoteData**: html, plainText, links/files/images/videos 메타 + fileObjects/imageObjects(실제 File — 업로드용)
- config: colors / languageSet(다국어 툴팁) / attributes / variables / 아이콘 커스텀(iconSpanElement, useGoogleIcon)
- attributes: noteModeByDevice(ADAPTIVE/MOBILE/DESKTOP), toolPosition(TOP/BOTTOM), using* 기능 토글 20종, 첨부 제한(attFile/ImageMaxSize 등), placeholder, recodeLimit(undo 한도)
- 이벤트 3계층(document/css/element) 분리 관리 — unmount 시 자동 해제로 메모리 누수 방지
- **hisonvue 연동**: getDefaultHisonConfig()가 getVanillanoteConfig()를 내부 호출해 `hisonConfig.component.note`에 주입. HNote가 mount/unmount 관리

## 상세 문서

- 가이드: `../../../../md/hisondev-vanillanote.md` (소스 검증 완료)
- 생태계 전체: `../../../../md/hisondev-ecosystem.md`

## 알려진 이슈

1. `recodeLimit` 오타(record→recode) — 공개 속성 키라 rename 시 breaking. **유지 결정** (문서 명시)
2. ~~test 스크립트 미구현~~ → **v1.1.1 해결** (`npm test` = test/smoke.mjs, jsdom 33케이스)
3. 의도 확정 사항: iOS는 blur 대신 mouseout 사용(+v1.1.1에서 실제 포커스 아웃 가드 추가) / 모바일은 beforeinput 마커 스킵("드래그 후 스타일만") 유지

## 작업 규칙

- 이 폴더의 소스/README 수정은 사용자의 명시적 지시가 있을 때만 진행 (프로젝트 루트 CLAUDE.md 규칙 준수)
