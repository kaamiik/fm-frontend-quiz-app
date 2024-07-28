document.addEventListener("DOMContentLoaded", function () {
  // Cache theme radio buttons
  const lightThemeRadio = document.querySelector("#light");
  const darkThemeRadio = document.querySelector("#dark");

  // Function to apply the chosen theme
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    theme === "dark"
      ? (darkThemeRadio.checked = true)
      : (lightThemeRadio.checked = true);
  }

  // Function to save the chosen theme to localStorage
  function saveTheme(theme) {
    localStorage.setItem("theme", theme);
  }

  // Function to initialize the theme based on saved preference or system setting
  function initializeTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      applyTheme(savedTheme);
    } else {
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      applyTheme(systemPrefersDark ? "dark" : "light");
    }
  }

  // Event listener for theme changes
  function setupThemeChangeListeners() {
    lightThemeRadio.addEventListener("change", function () {
      if (lightThemeRadio.checked) {
        applyTheme("light");
        saveTheme("light");
      }
    });

    darkThemeRadio.addEventListener("change", function () {
      if (darkThemeRadio.checked) {
        applyTheme("dark");
        saveTheme("dark");
      }
    });
  }

  // Initialize theme on page load
  initializeTheme();

  // Setup event listeners for theme changes
  setupThemeChangeListeners();
});
