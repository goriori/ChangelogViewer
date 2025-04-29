import { ref, onMounted, watch } from 'vue';

export default function useDarkMode() {
  const isDark = ref(false);

  // Проверяем тему в localStorage и системных настройках
  const applyTheme = () => {
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark');
      isDark.value = true;
    } else {
      document.documentElement.classList.remove('dark');
      isDark.value = false;
    }
  };

  // Переключаем тему
  const toggleDarkMode = () => {
    isDark.value = !isDark.value;
    if (isDark.value) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  };

  // Следим за изменениями системной темы
  const watchSystemTheme = () => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      if (!('theme' in localStorage)) {
        isDark.value = e.matches;
        if (e.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    });
  };

  // Инициализация при монтировании
  onMounted(() => {
    applyTheme();
    watchSystemTheme();
  });

  return {
    isDark,
    toggleDarkMode,
  };
}