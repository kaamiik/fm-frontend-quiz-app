document.addEventListener("DOMContentLoaded", async function () {
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

  const params = new URLSearchParams(window.location.search);
  const subject = params.get("subject");
  localStorage.setItem("subject", subject);

  async function fetchQuizData() {
    try {
      const response = await fetch("/data.json");
      const data = await response.json();

      const quizzes = data.quizzes;
      quiz = quizzes.find((q) => q.title.toLowerCase() === subject);
      const quizString = JSON.stringify(quiz);
      localStorage.setItem("quiz", quizString);

      updateSubjectIcon(quiz);
      await updateQuestion(quiz);
    } catch (error) {
      console.error("Error: ", error);
    }
  }

  function updateSubjectIcon(quiz) {
    const newHtml = `
    <div class="img-wrapper ${quiz.title.toLowerCase()}">
      <img src="${quiz.icon}" class="${quiz.title.toLowerCase()}-icon" alt="" />
    </div>
    <p>${quiz.title}</p>
  `;

    subjectWithIcon.innerHTML = newHtml;
  }

  async function updateQuestion(quiz) {
    const question = quiz.questions[currentQuestionIndex];
    numOfQuestion.textContent = currentQuestionIndex + 1;
    questionEl.textContent = question.question;

    const newHtml = question.options
      .map(
        (option, index) =>
          `
        <li>
          <label class="option" for="option-${index + 1}">
            <div class="option-wrapper">
              <input
                type="radio"
                name="option"
                id="option-${index + 1}"
                value="${option}"
                aria-checked="false"
              />
              <div class="option-num">
                <p class="heading-s">${String.fromCharCode(65 + index)}</p>
              </div>
              <p class="option-text | heading-s">${option
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")}
              </p>
            </div>
            <img
              class="icon-correct | hidden"
              src="/assets/images/icon-correct.svg"
              alt=""
            />
            <img
              class="icon-incorrect hidden"
              src="/assets/images/icon-incorrect.svg"
              alt=""
            />
          </label>
        </li>
      `
      )
      .join("");
    optionsList.innerHTML = newHtml;
  }

  await fetchQuizData();

  questionForm.addEventListener("submit", function (event) {
    event.preventDefault();
    submitButton.blur();

    if (!hasAnswered) {
      const selectedOption = questionForm.querySelector(
        'input[name="option"]:checked'
      );
      if (!selectedOption) {
        noAnswerError.classList.remove("hidden");
        return;
      }

      noAnswerError.classList.add("hidden");

      const selectedLabel = selectedOption.parentElement.parentElement;

      const allOptions = questionForm.querySelectorAll('input[name="option"]');
      allOptions.forEach((option) => {
        option.disabled = true;
      });

      progressBar.value = currentQuestionIndex + 1;

      if (
        selectedOption.value === quiz.questions[currentQuestionIndex].answer
      ) {
        selectedLabel.classList.add("correct");
        selectedLabel.querySelector(".icon-correct").classList.remove("hidden");
        selectedOption.checked = false;
        correctAnswers++;
      } else {
        selectedLabel.classList.add("incorrect");
        selectedLabel
          .querySelector(".icon-incorrect")
          .classList.remove("hidden");
        selectedOption.checked = false;
        const correctOption = Array.from(
          questionForm.querySelectorAll('input[name="option"]')
        ).find(
          (option) =>
            decodeURIComponent(option.value) ===
            quiz.questions[currentQuestionIndex].answer
        );

        const correctLabel = correctOption.parentElement.parentElement;
        correctLabel.querySelector(".icon-correct").classList.remove("hidden");
      }

      submitButton.textContent =
        currentQuestionIndex === quiz.questions.length - 1
          ? "Show My Score"
          : "Next Question";
      hasAnswered = true;
    } else {
      currentQuestionIndex++;
      if (currentQuestionIndex < quiz.questions.length) {
        updateQuestion(quiz);
        submitButton.textContent = "submit Answer";
        hasAnswered = false;

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
  });
});
