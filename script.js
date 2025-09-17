const questionElement = document.getElementById("question");
const answersElement = document.getElementById("answers");
const nextButton = document.getElementById("next-btn");
const scoreboardButton = document.getElementById("scoreboard-btn");
const progressBar = document.getElementById("progress-bar");

let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let shuffledQuestions = [];
let scoreboardInterval = null;

// Load default or saved JSON questions
async function loadQuestions() {
  const saved = localStorage.getItem("customQuestions");
  if (saved) {
    questions = JSON.parse(saved);
  } else {
    const res = await fetch("questions.json");
    questions = await res.json();
  }
  startQuiz();
}

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  nextButton.innerText = "Next";
  shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);
  updateProgressBar();
  showQuestion();
}

function showQuestion() {
  resetState();
  let currentQuestion = shuffledQuestions[currentQuestionIndex];
  questionElement.innerText = currentQuestion.question;

  const shuffledAnswers = [...currentQuestion.answers].sort(() => Math.random() - 0.5);
  shuffledAnswers.forEach(answer => {
    const button = document.createElement("button");
    button.innerText = answer.text;
    button.classList.add("answer-btn");
    button.addEventListener("click", () => selectAnswer(button, answer.correct));
    answersElement.appendChild(button);
  });
  updateProgressBar();
}

function resetState() {
  nextButton.classList.add("hidden");
  while (answersElement.firstChild) {
    answersElement.removeChild(answersElement.firstChild);
  }
}

function selectAnswer(button, correct) {
  const buttons = answersElement.querySelectorAll("button");
  buttons.forEach(b => b.disabled = true);

  if (correct) {
    button.classList.add("correct");
    score++;
  } else {
    button.classList.add("wrong");
  }

  nextButton.classList.remove("hidden");
}

function showScore() {
  resetState();
  questionElement.innerText = `You scored ${score} out of ${shuffledQuestions.length}! 🎉`;
  nextButton.innerText = "Play Again";
  nextButton.classList.remove("hidden");

  saveScore(score);
  showScoreboard(true);
}

function handleNextButton() {
  currentQuestionIndex++;
  if (currentQuestionIndex < shuffledQuestions.length) {
    showQuestion();
  } else {
    showScore();
  }
}

nextButton.addEventListener("click", () => {
  if (currentQuestionIndex < shuffledQuestions.length) {
    handleNextButton();
  } else {
    startQuiz();
  }
});

function updateProgressBar() {
  const total = shuffledQuestions.length;
  const answered = currentQuestionIndex;
  const percentage = total > 0 ? (answered / total) * 100 : 0;
  progressBar.style.width = percentage + "%";
}

// Scoreboard functions
function saveScore(newScore) {
  let scores = JSON.parse(localStorage.getItem("quizScores")) || [];
  scores.unshift(newScore);
  if (scores.length > 5) scores = scores.slice(0, 5);
  localStorage.setItem("quizScores", JSON.stringify(scores));
}

function getScores() {
  return JSON.parse(localStorage.getItem("quizScores")) || [];
}

function getHighScore() {
  const scores = getScores();
  return scores.length ? Math.max(...scores) : 0;
}

function clearScores() {
  localStorage.removeItem("quizScores");
}

function buildScoreboardContent(final = false) {
  const scores = getScores();
  const highScore = getHighScore();
  const answered = currentQuestionIndex;
  const total = shuffledQuestions.length;
  const percentage = answered > 0 ? Math.round((score / answered) * 100) : 0;

  let buttons = final ? 
    '<button class="close-btn">Close</button><button class="clear-btn">Clear Scores</button><button class="load-btn">Load Questions</button><button class="reset-btn">Reset to Default</button>'
    : '<button class="close-btn">Close</button><button class="clear-btn">Clear Scores</button>';

  return `
    <h2>📊 Scoreboard</h2>
    <p>Current Score: ${score}</p>
    <p>Questions Answered: ${answered} / ${total}</p>
    <p>Percentage Correct: ${percentage}%</p>
    <p>Highest Score: ${highScore}</p>
    <h3>Last 5 Saved Scores:</h3>
    <ul>${scores.map(s => `<li>${s}</li>`).join("")}</ul>
    ${buttons}
  `;
}

function showScoreboard(final = false) {
  let modal = document.querySelector(".modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.classList.add("modal");
    document.body.appendChild(modal);
  }

  modal.innerHTML = buildScoreboardContent(final);
  attachModalButtons(modal, final);

  if (scoreboardInterval) clearInterval(scoreboardInterval);
  scoreboardInterval = setInterval(() => {
    if (document.body.contains(modal)) {
      modal.innerHTML = buildScoreboardContent(final);
      attachModalButtons(modal, final);
    } else {
      clearInterval(scoreboardInterval);
    }
  }, 1000);
}

function attachModalButtons(modal, final) {
  modal.querySelector(".close-btn").addEventListener("click", () => {
    modal.remove();
    clearInterval(scoreboardInterval);
  });
  modal.querySelector(".clear-btn").addEventListener("click", () => {
    clearScores();
    modal.innerHTML = buildScoreboardContent(final);
    attachModalButtons(modal, final);
  });
  if (final) {
    modal.querySelector(".load-btn").addEventListener("click", () => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".json";
      input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = evt => {
          try {
            const custom = JSON.parse(evt.target.result);
            localStorage.setItem("customQuestions", JSON.stringify(custom));
            questions = custom;
            modal.remove();
            startQuiz();
          } catch (err) {
            alert("Invalid JSON file!");
          }
        };
        reader.readAsText(file);
      };
      input.click();
    });
    modal.querySelector(".reset-btn").addEventListener("click", () => {
      localStorage.removeItem("customQuestions");
      modal.remove();
      loadQuestions();
    });
  }
}

scoreboardButton.addEventListener("click", () => showScoreboard(false));

loadQuestions();