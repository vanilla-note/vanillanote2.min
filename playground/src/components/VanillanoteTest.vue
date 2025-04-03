<template>
  <div ref="editorWrap">
    <button @click="getNoteData">getNoteData 1</button>
    <button @click="setNoteData">setNoteData 3</button>
    <div
    data-vanillanote
    data-id="note1"
    language="KOR"
    textarea-height="150px"
    size-level-desktop="1"
    placeholder-is-visible="true"
    placeholder-title="TEST"
    ></div>
    <div
    data-vanillanote
    data-id="note2"
    invert-color="true"
    textarea-height="150px"
    default-font-size="50"
    default-line-height="50"
    size-level-desktop="1"
    ></div>
    <div
    data-vanillanote
    data-id="note3"
    textarea-height="150px"
    size-level-desktop="1"
    color-set="green"
    ></div>
    <!--
    <div>
      <div style="display: inline-block;">
        <div
        data-vanillanote
        data-id="note1"
        language="KOR"
        textarea-width="250px"
        textarea-height="300px"
        note-mode-by-device="MOBILE"
        size-level-mobile="4"
        ></div>
      </div>
      <div style="display: inline-block;">
        <div
        data-vanillanote
        data-id="note2"
        invert-color="true"
        default-font-size="50"
        textarea-width="250px"
        textarea-height="300px"
        note-mode-by-device="MOBILE"
        size-level-mobile="4"
        ></div>
      </div>
      <div style="display: inline-block;">
        <div
        data-vanillanote
        data-id="note3"
        textarea-width="250px"
        textarea-height="300px"
        note-mode-by-device="MOBILE"
        size-level-mobile="4"
        ></div>
      </div>
    </div>
    -->
  </div>
</template>

<script setup lang="ts">
/*
import { onMounted } from 'vue';

onMounted(() => {
// Playground 최초 로딩 시 자동 생성 원하면 여기에
});
*/
import type { Vanillanote, VanillanoteElement } from 'vanillanote2';
import { ref } from 'vue';
import { getCurrentInstance, onMounted, onBeforeUnmount } from 'vue';

const { proxy } = getCurrentInstance()!;
const vn: Vanillanote = (proxy as any)!.$vn;
const editorWrap = ref<HTMLElement | null>(null);

let noteData;

const getNoteData = () => {
  const note1: VanillanoteElement = vn.getNote('note1')!;
  noteData = note1.getNoteData();
  console.log(noteData);
};
const setNoteData = () => {
  const note3: VanillanoteElement = vn.getNote('note3')!;
  note3.setNoteData(noteData);
};

onMounted(()=>{
  if(!editorWrap.value) return;
  vn.mountNote(editorWrap.value);
})
onBeforeUnmount(()=>{
  if(!editorWrap.value) return;
  vn.unmountNote(editorWrap.value);
})
</script>
