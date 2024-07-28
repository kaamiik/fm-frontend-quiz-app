import htmlIcon from "/assets/images/icon-html.svg";
import cssIcon from "/assets/images/icon-css.svg";
import jsIcon from "/assets/images/icon-js.svg";
import accessibilityIcon from "/assets/images/icon-accessibility.svg";
document.addEventListener("DOMContentLoaded", function () {
  // Cache elements
  const lightThemeRadio = document.querySelector("#light");
  const darkThemeRadio = document.querySelector("#dark");
  const quiz = JSON.parse(localStorage.getItem("quiz"));
  const subjectWithIconElements = document.querySelectorAll(".js-subject-icon");

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

  // Function to setup event listeners for theme changes
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

  // Function to update the subject icon
  function updateSubjectIcon(quiz) {
    const iconPaths = {
      html: htmlIcon,
      css: cssIcon,
      javascript: jsIcon,
      accessibility: accessibilityIcon,
    };
    const newHtml = `
      <div class="img-wrapper ${quiz.title.toLowerCase()}">
        <img src="${
          iconPaths[quiz.title.toLowerCase()]
        }" class="${quiz.title.toLowerCase()}-icon" alt="" />
      </div>
      <p>${quiz.title}</p>
    `;
    subjectWithIconElements.forEach((item) => {
      item.innerHTML = newHtml;
    });
  }

  // Function to update the score display
  function updateScoreDisplay() {
    const score = localStorage.getItem("correctAnswers");
    document.querySelector(
      ".score"
    ).innerHTML = `${score} <span class="body-m">out of 10</span>`;
  }

  // Initialize theme on page load
  initializeTheme();
  setupThemeChangeListeners();

  // Update subject icon and score display
  updateSubjectIcon(quiz);
  updateScoreDisplay();
});
