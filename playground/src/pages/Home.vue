<template>
    <div>
      <h1>Welcome to Vanillanote Playground</h1>
      <p>Click the menu to test the editor.</p>
    </div>
</template>

<script setup lang="ts">
import { getVanillanoteConfig } from 'vanillanote2'
import type { VanillanoteConfig } from 'vanillanote2'
const vnConfig: VanillanoteConfig = getVanillanoteConfig();
console.log(vnConfig);
</script>
