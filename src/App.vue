<script setup lang="ts">
import ChangelogViewer from './components/changelog-viewer/index.vue'
import ThemeToggler from '@/components/theme-toggler/index.vue'

</script>

<template>
  <div class=" w-screen dark:bg-gray-950">
    <ThemeToggler/>
    
    <ChangelogViewer path="/CHANGELOG.md" />
  </div>
</template>

