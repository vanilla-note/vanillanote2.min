<template>
  <div ref="editorWrap">
    <button @click="getNoteData">getNoteData 1</button>
    <button @click="setNoteData">setNoteData 3</button>
    <div
    data-vanillanote
    data-id="note1"
    language="KOR"
    textarea-height="300px"
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
    textarea-height="300px"
    size-level-desktop="1"
    color-set="green"
    ></div>
  </div>
</template>

<script setup lang="ts">
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
};
const setNoteData = () => {
  const note3: VanillanoteElement = vn.getNote('note3')!;
  note3.setNoteData(noteData);
};

onMounted(()=>{
  if(!editorWrap.value) return;
  vn.mountNote(editorWrap.value);
  const note1 = vn.getNote('note1')!;
  note1._elementEvents.fontFamilySelect_onBeforeClick = (e) => {
    return true;
  }
})
onBeforeUnmount(()=>{
  if(!editorWrap.value) return;
  vn.unmountNote(editorWrap.value);
})
</script>
