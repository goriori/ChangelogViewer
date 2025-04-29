import { ref, computed } from "vue";
import { marked } from "marked";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";

interface ChangelogEntry {
  date: string;
  title: string;
  description: string;
  htmlDescription: string;
}

// Инициализация marked с подсветкой кода
marked.setOptions({
  highlight: (code, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(lang, code).value;
    }
    return hljs.highlightAuto(code).value;
  },
  breaks: true,
});

export default function useChangelog() {
  const changelogData = ref<ChangelogEntry[]>([]);
  const error = ref<string | null>(null);
  const isLoading = ref(true);

  const parseChangelog = (rawText: string): ChangelogEntry[] => {
    // Используем marked.lexer для получения AST
    const tokens = marked.lexer(rawText);
    const entries: ChangelogEntry[] = [];
    let currentEntry: Partial<ChangelogEntry> = {};

    tokens.forEach((token) => {
      if (token.type === "heading" && token.depth === 2) {
        // Завершаем предыдущую запись если есть
        if (currentEntry.title) {
          entries.push(currentEntry as ChangelogEntry);
        }

        // Парсим новый заголовок: "Название [YYYY-MM-DD]"
        const match = token.text.match(/^(.*?)\s*\[(\d{4}-\d{2}-\d{2})\]/);
        if (match) {
          currentEntry = {
            title: match[1].trim(),
            date: match[2].trim(),
            htmlContent: "",
          };
        }
      } else if (currentEntry.title) {
        // Добавляем контент к текущей записи
        currentEntry.htmlContent += marked.parser([token]);
      }
    });

    // Добавляем последнюю запись
    if (currentEntry.title) {
      entries.push(currentEntry as ChangelogEntry);
    }

    return entries;
  };

  const fetchChangelog = async (path: string) => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await fetch(path);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const text = await response.text();
      changelogData.value = parseChangelog(text);
    } catch (err) {
      error.value =
        err instanceof Error
          ? err.message
          : "Неизвестная ошибка при загрузке changelog";
      console.error("Changelog error:", err);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    changelogData,
    error,
    isLoading,
    fetchChangelog,
  };
}
