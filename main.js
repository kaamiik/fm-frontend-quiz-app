const lightThemeRadio = document.querySelector("#light");
const darkThemeRadio = document.querySelector("#dark");

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);

  if (theme === "dark") {
    darkThemeRadio.checked = true;
  } else {
    lightThemeRadio.checked = true;
  }
}

const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  applyTheme(savedTheme);
} else {
  const systemPrefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  applyTheme(systemPrefersDark ? "dark" : "light");
}

lightThemeRadio.addEventListener("change", function () {
  if (lightThemeRadio.checked) {
    applyTheme("light");
    localStorage.setItem("theme", "light");
  }
});
darkThemeRadio.addEventListener("change", function () {
  if (darkThemeRadio.checked) {
    applyTheme("dark");
    localStorage.setItem("theme", "dark");
  }
});
