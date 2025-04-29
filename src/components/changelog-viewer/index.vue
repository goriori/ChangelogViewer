<script setup lang="ts">
import { onMounted } from "vue";
import useChangelog from "@/composables/useChangelog";
import Timeline from "@/components/timeline/index.vue";
const props = defineProps({
  path: {
    type: String,
    required: true,
    default: "/changelog.md",
  },
});

const { changelogData, error, isLoading, fetchChangelog } = useChangelog();

// Загружаем при монтировании
onMounted(() => {
  fetchChangelog(props.path);
});
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 py-8 relative">
    <Timeline class="h-full " />
    <div>
      <!-- Загрузка -->
      <div v-if="isLoading" class="text-center py-12">
        <div
          class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"
        ></div>
      </div>

      <!-- Ошибка -->
      <div
        v-else-if="error"
        class="bg-red-50 border-l-4 border-red-500 p-4 mb-6"
      >
        <p class="text-red-700 font-medium">{{ error }}</p>
        <p class="text-red-600 text-sm mt-1">
          Проверьте формат файла changelog.md
        </p>
      </div>

      <!-- Успешная загрузка -->
      <div v-else class="space-y-8">
        <div
          v-for="entry in changelogData"
          :key="entry.date"
          class="dark:text-gray-300 space-y-3 "
        >
          <h2 class="text-2xl font-bold">
            {{ entry.title }} <small>{{ entry.date }}</small>
          </h2>
          <div v-html="entry.htmlContent" class="markdown-content" />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.markdown-body {
  color: #4b5563; /* gray-600 */
}

.markdown-body h3 {
  font-size: 1.125rem; /* text-lg */
  font-weight: 600; /* font-semibold */
  margin-top: 1rem; /* mt-4 */
  margin-bottom: 0.5rem; /* mb-2 */
  color: #1f2937; /* gray-800 */
}

.markdown-body ul {
  padding-left: 1.25rem; /* pl-5 */
  list-style-type: disc; /* list-disc */
}

.markdown-body ol {
  padding-left: 1.25rem; /* pl-5 */
  list-style-type: decimal; /* list-decimal */
}
</style>
