document.addEventListener("DOMContentLoaded", function () {
  const lightThemeRadio = document.querySelector("#light");
  const darkThemeRadio = document.querySelector("#dark");
  const quiz = JSON.parse(localStorage.getItem("quiz"));
  const subjectWithIcon = document.querySelectorAll(".js-subject-icon");

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

  function updateSubjectIcon(quiz) {
    const newHtml = `
      <div class="img-wrapper ${quiz.title.toLowerCase()}">
        <img src="${
          quiz.icon
        }" class="${quiz.title.toLowerCase()}-icon" alt="" />
      </div>
      <p>${quiz.title}</p>
    `;

    subjectWithIcon.forEach((item) => {
      item.innerHTML = newHtml;
    });
  }

  updateSubjectIcon(quiz);

  const score = localStorage.getItem("correctAnswers");
  document.querySelector(
    ".score"
  ).innerHTML = `${score} <span class="body-m">out of 10</span>`;
});
