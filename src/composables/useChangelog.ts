import { ref, computed } from 'vue';

interface ChangelogEntry {
  date?: string;
  title?: string;
  description?: string;
  htmlDescription?: string; // Добавляем HTML-версию описания
}

export default function useChangelog(path: string) {
  const changelogData = ref<ChangelogEntry[]>([]);
  const error = ref<string | null>(null);
  const isLoading = ref(true);

  // Преобразуем Markdown-списки в HTML
  const parseMarkdownLists = (text: string): string => {
    // Обрабатываем ненумерованные списки (-, *, +)
    let html = text.replace(/^-\s(.+)$/gm, '<li>$1</li>');
    html = html.replace(/^[*+]\s(.+)$/gm, '<li>$1</li>');
    
    // Обрабатываем нумерованные списки (1., 2.)
    html = html.replace(/^\d+\.\s(.+)$/gm, '<li>$1</li>');
    
    // Обернём все li в ul или ol
    html = html.replace(/<li>.*<\/li>/gms, (match) => {
      // Если перед списком есть цифра (1., 2.), то это <ol>
      const isOrdered = /^\d+\.\s.+$/m.test(match);
      return isOrdered 
        ? `<ol class="list-decimal pl-5 my-2">${match}</ol>`
        : `<ul class="list-disc pl-5 my-2">${match}</ul>`;
    });

    // Простые переносы строк -> <br> (опционально)
    html = html.replace(/\n/g, '<br>');

    return html;
  };

  const fetchChangelog = async () => {
    try {
      const response = await fetch(path);
      if (!response.ok) throw new Error("Не удалось загрузить changelog");
      
      const rawText = await response.text();
      const entries = rawText.split('## ').slice(1);

      changelogData.value = entries.map((entry) => {
        const [firstLine, ...rest] = entry.trim().split('\n');
        const titleMatch = firstLine.match(/^(.*?)\s*\[(\d{4}-\d{2}-\d{2})\]/);

        if (!titleMatch) {
          throw new Error(`Неверный формат записи: "${firstLine}"`);
        }

        const description = rest.join('\n').trim();
        const htmlDescription = parseMarkdownLists(description);

        return {
          title: titleMatch[1].trim(),
          date: titleMatch[2].trim(),
          description,
          htmlDescription, // Добавляем HTML-версию
        };
      });
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Неизвестная ошибка";
    } finally {
      isLoading.value = false;
    }
  };

  fetchChangelog();

  return {
    changelogData: computed(() => changelogData.value),
    error,
    isLoading,
    reload: fetchChangelog,
  };
}