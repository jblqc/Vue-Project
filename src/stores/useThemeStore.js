import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";

export const useThemeStore = defineStore(
  "theme",
  () => {
    const theme = ref("light");
    const isDark = computed(() => theme.value === "dark");

    const applyToDom = mode => {
      document.documentElement.setAttribute("data-bs-theme", mode);
    };

    const setTheme = mode => {
      if (mode !== "light" && mode !== "dark") return;
      theme.value = mode;
    };

    const toggleTheme = () => {
      theme.value = theme.value === "dark" ? "light" : "dark";
    };

    watch(theme, mode => applyToDom(mode), { immediate: true });

    return { theme, isDark, setTheme, toggleTheme };
  },
  {
    persist: {
      key: "bs-theme",
      paths: ["theme"],
    },
  },
);
