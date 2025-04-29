<script setup lang="ts">
import ChangelogViewer from './components/changelog-viewer/index.vue'
import ThemeToggler from '@/components/theme-toggler/index.vue'
</script>

<template>
  <div class=" w-screen h-screen dark:bg-black">
    <ThemeToggler/>
    <ChangelogViewer path="/CHANGELOG.md" />
  </div>
</template>

