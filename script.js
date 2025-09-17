const questionElement = document.getElementById("question");
const answersElement = document.getElementById("answers");
const nextButton = document.getElementById("next-btn");
const scoreboardButton = document.getElementById("scoreboard-btn");
const progressBar = document.getElementById("progress-bar");

let currentQuestionIndex = 0;
let score = 0;
let shuffledQuestions = [];
let scoreboardInterval = null;

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
  showScoreboard();
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

function buildScoreboardContent() {
  const scores = getScores();
  const highScore = getHighScore();
  const answered = currentQuestionIndex;
  const total = shuffledQuestions.length;
  const percentage = total > 0 ? Math.round((score / answered) * 100) : 0;

  return `
    <h2>📊 Scoreboard</h2>
    <p>Current Score: ${score}</p>
    <p>Questions Answered: ${answered} / ${total}</p>
    <p>Percentage Correct: ${answered > 0 ? percentage : 0}%</p>
    <p>Highest Score: ${highScore}</p>
    <h3>Last 5 Saved Scores:</h3>
    <ul>${scores.map(s => `<li>${s}</li>`).join("")}</ul>
    <button class="close-btn">Close</button>
    <button class="clear-btn">Clear Scores</button>
  `;
}

function showScoreboard() {
  let modal = document.querySelector(".modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.classList.add("modal");
    document.body.appendChild(modal);
  }

  modal.innerHTML = buildScoreboardContent();
  attachModalButtons(modal);

  if (scoreboardInterval) clearInterval(scoreboardInterval);
  scoreboardInterval = setInterval(() => {
    if (document.body.contains(modal)) {
      modal.innerHTML = buildScoreboardContent();
      attachModalButtons(modal);
    } else {
      clearInterval(scoreboardInterval);
    }
  }, 1000);
}

function attachModalButtons(modal) {
  modal.querySelector(".close-btn").addEventListener("click", () => {
    modal.remove();
    clearInterval(scoreboardInterval);
  });
  modal.querySelector(".clear-btn").addEventListener("click", () => {
    clearScores();
    modal.innerHTML = buildScoreboardContent();
    attachModalButtons(modal);
  });
}

scoreboardButton.addEventListener("click", showScoreboard);

startQuiz();