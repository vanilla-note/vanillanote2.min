<template>
  <div ref="editorWrap">
    <button @click="mountEditor">Mount Editor</button>
    <button @click="unmountEditor">Unmount Editor</button>
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
import type { Vanillanote } from 'vanillanote2';
import { ref } from 'vue';
import { getCurrentInstance, onMounted, onBeforeUnmount } from 'vue';

const { proxy } = getCurrentInstance()!;
const vn: Vanillanote = (proxy as any)!.$vn;
const editorWrap = ref<HTMLElement | null>(null);

const mountEditor = () => {
if(!editorWrap.value) return;
vn.mountNote(editorWrap.value);
};
const unmountEditor = () => {
if(!editorWrap.value) return;
vn.unmountNote(editorWrap.value);
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
