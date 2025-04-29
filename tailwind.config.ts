module.exports = {
  darkMode: "class", // Включаем ручное управление темой через классы
  theme: {
    extend: {},
  },
  content: [
    // Убедитесь, что пути до компонентов указаны
    "./src/**/*.{vue,js,ts}",
  ],
  plugins: [
    require("@tailwindcss/typography"), // Плагин для Markdown-стилей
  ],
};
