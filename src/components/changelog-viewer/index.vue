<script setup lang="ts">
import useChangelog from '@/composables/useChangelog';

const props = defineProps({
  path: {
    type: String,
    required: true,
    default: '/changelog.md',
  },
});

const { changelogData, error, isLoading } = useChangelog(props.path);
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8 text-gray-900">Changelog</h1>

    <!-- Загрузка -->
    <div v-if="isLoading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
    </div>

    <!-- Ошибка -->
    <div 
      v-else-if="error" 
      class="bg-red-50 border-l-4 border-red-500 p-4 mb-6"
    >
      <p class="text-red-700 font-medium">{{ error }}</p>
      <p class="text-red-600 text-sm mt-1">Проверьте формат файла changelog.md</p>
    </div>

    <!-- Успешная загрузка -->
    <div v-else class="space-y-8">
      <div 
        v-for="(entry, index) in changelogData" 
        :key="index" 
        class="border-b border-gray-200 pb-6 last:border-0"
      >
        <div class="flex items-baseline gap-2">
          <h2 class="text-xl font-semibold text-gray-800">{{ entry.title }}</h2>
          <span class="text-sm text-gray-500">{{ entry.date }}</span>
        </div>

        <!-- Выводим HTML-описание (списки уже обработаны) -->
        <div 
          class="mt-4 text-gray-600"
          v-html="entry.htmlDescription"
        />
      </div>
    </div>
  </div>
</template>