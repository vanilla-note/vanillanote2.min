<template>
    <div ref="editorWrap">
      <div data-vanillanote data-id="note1"></div>
      <button @click="initEditor">Create Editor</button>
    </div>
</template>

<script setup lang="ts">
/*
import { onMounted } from 'vue';

onMounted(() => {
// Playground 최초 로딩 시 자동 생성 원하면 여기에
});
*/
import { ref } from 'vue';
import { getCurrentInstance } from 'vue';

const { proxy } = getCurrentInstance()!;
const vn = (proxy as any)!.$vn;
const editorWrap = ref<HTMLElement | null>(null);

const initEditor = () => {
  if(!editorWrap.value) return;
  console.log(vn);
  vn.create(editorWrap.value);
};
</script>
