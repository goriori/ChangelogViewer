import { ref, computed } from 'vue';

interface ChangelogEntry {
  date?: string;
  title?: string;
  description?: string;
}

export default function useChangelog(path: string) {
  const changelogData = ref<ChangelogEntry[]>([]);
  const error = ref<string | null>(null);
  const isLoading = ref(true);

  const fetchChangelog = async () => {
    try {
      const response = await fetch(path);
      if (!response.ok) throw new Error("Failed to load changelog");
      
      const rawText = await response.text();
      const entries = rawText.split('## ').slice(1); // Разделяем по заголовкам

      changelogData.value = entries.map((entry) => {
        const [firstLine, ...rest] = entry.trim().split('\n');
        const titleMatch = firstLine.match(/^(.*?)\s*\[(\d{4}-\d{2}-\d{2})\]/);

        if (!titleMatch) {
          throw new Error(`Invalid entry format: "${firstLine}"`);
        }

        return {
          title: titleMatch[1].trim(),
          date: titleMatch[2].trim(),
          description: rest.join('\n').trim(),
        };
      });
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unknown error";
    } finally {
      isLoading.value = false;
    }
  };

  // Автоматически загружаем при вызове
  fetchChangelog();

  return {
    changelogData: computed(() => changelogData.value),
    error,
    isLoading,
    reload: fetchChangelog, // Для ручного обновления
  };
}