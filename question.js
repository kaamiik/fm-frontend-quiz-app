import correctIcon from "/assets/images/icon-correct.svg";
import incorrectIcon from "/assets/images/icon-incorrect.svg";
import htmlIcon from "/assets/images/icon-html.svg";
import cssIcon from "/assets/images/icon-css.svg";
import jsIcon from "/assets/images/icon-js.svg";
import accessibilityIcon from "/assets/images/icon-accessibility.svg";

document.addEventListener("DOMContentLoaded", async function () {
  // Cache elements
  const lightThemeRadio = document.querySelector("#light");
  const darkThemeRadio = document.querySelector("#dark");
  const questionForm = document.querySelector(".js-question-form");
  const subjectWithIcon = document.querySelector(".js-subject-icon");
  const numOfQuestion = document.querySelector(".js-number");
  const questionEl = document.querySelector(".js-question");
  const progressBar = document.querySelector(".progress-bar");
  const optionsList = document.querySelector(".options");
  const submitButton = document.querySelector(".js-submit-button");
  const noAnswerError = document.querySelector(".js-error-check");

  let currentQuestionIndex = 0;
  let hasAnswered = false;
  let quiz;
  let correctAnswers = 0;

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

  // Function to fetch quiz data based on subject
  async function fetchQuizData(subject) {
    try {
      const response = await fetch("/data.json");
      const data = await response.json();
      const quizzes = data.quizzes;
      quiz = quizzes.find((q) => q.title.toLowerCase() === subject);
      localStorage.setItem("quiz", JSON.stringify(quiz));
      updateSubjectIcon(quiz);
      await updateQuestion();
    } catch (error) {
      console.error("Error: ", error);
    }
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
    subjectWithIcon.innerHTML = newHtml;
  }

  // Function to update the question displayed
  async function updateQuestion() {
    const question = quiz.questions[currentQuestionIndex];
    numOfQuestion.textContent = currentQuestionIndex + 1;
    questionEl.textContent = question.question;

    const newHtml = question.options
      .map(
        (option, index) => `
          <li>
            <label class="option" for="option-${index + 1}">
              <div class="option-wrapper">
                <input type="radio" name="option" id="option-${
                  index + 1
                }" value="${option}"  />
                <div class="option-num">
                  <p class="heading-s">${String.fromCharCode(65 + index)}</p>
                </div>
                <p class="option-text | heading-s">${option
                  .replace(/</g, "&lt;")
                  .replace(/>/g, "&gt;")}</p>
              </div>
              <img class="icon-correct | hidden" src="${correctIcon}" alt="Correct Icon"
                    aria-hidden="true" />
              <img class="icon-incorrect hidden" src="${incorrectIcon}" alt="Incorrect Icon"
                    aria-hidden="true" />
            </label>
          </li>
        `
      )
      .join("");
    optionsList.innerHTML = newHtml;
  }

  // Function to handle question form submission
  function handleFormSubmit(event) {
    event.preventDefault();
    const allOptions = questionForm.querySelectorAll('input[name="option"]');
    if (!hasAnswered) {
      const selectedOption = questionForm.querySelector(
        'input[name="option"]:checked'
      );
      if (!selectedOption) {
        noAnswerError.classList.remove("hidden");
        noAnswerError.setAttribute("aria-hidden", "false");
        return;
      }

      noAnswerError.classList.add("hidden");
      const selectedLabel = selectedOption.parentElement.parentElement;

      allOptions.forEach((option) => {
        option.disabled = true;
      });

      progressBar.value = currentQuestionIndex + 1;
      progressBar.setAttribute("aria-valuenow", currentQuestionIndex + 1);

      if (
        selectedOption.value === quiz.questions[currentQuestionIndex].answer
      ) {
        selectedLabel.classList.add("correct");
        selectedLabel.querySelector(".icon-correct").classList.remove("hidden");
        selectedLabel
          .querySelector(".icon-correct")
          .setAttribute("aria-hidden", "false");
        allOptions.forEach((option) => {
          option.checked = false;
        });
        correctAnswers++;
      } else {
        selectedLabel.classList.add("incorrect");
        selectedLabel
          .querySelector(".icon-incorrect")
          .classList.remove("hidden");
        selectedLabel
          .querySelector(".icon-incorrect")
          .setAttribute("aria-hidden", "false");
        allOptions.forEach((option) => {
          option.checked = false;
        });
        const correctOption = Array.from(allOptions).find(
          (option) =>
            decodeURIComponent(option.value) ===
            quiz.questions[currentQuestionIndex].answer
        );
        const correctLabel = correctOption.parentElement.parentElement;
        correctLabel.querySelector(".icon-correct").classList.remove("hidden");
        correctLabel
          .querySelector(".icon-correct")
          .setAttribute("aria-hidden", "false");
      }

      submitButton.textContent =
        currentQuestionIndex === quiz.questions.length - 1
          ? "Show My Score"
          : "Next Question";
      hasAnswered = true;
    } else {
      currentQuestionIndex++;
      if (currentQuestionIndex < quiz.questions.length) {
        updateQuestion();
        submitButton.textContent = "Submit Answer";
        hasAnswered = false;
        submitButton.blur();
        const allOptions = questionForm.querySelectorAll(
          'input[name="option"]'
        );
        allOptions.forEach((option) => {
          option.disabled = false;
        });
      } else {
        localStorage.setItem("correctAnswers", correctAnswers);
        window.location.href = "score.html";
      }
    }
  }

  // Initialize theme on page load
  initializeTheme();
  setupThemeChangeListeners();

  // Fetch quiz data
  const params = new URLSearchParams(window.location.search);
  const subject = params.get("subject");
  localStorage.setItem("subject", subject);
  await fetchQuizData(subject);

  // Setup event listener for form submission
  questionForm.addEventListener("submit", handleFormSubmit);
});
