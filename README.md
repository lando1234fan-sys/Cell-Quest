# Galaxy Quiz

An animated quiz game with:
- Galaxy background (drifting + twinkling + shooting stars)
- Glowing futuristic quiz card UI
- Easy-to-edit question set

## 🚀 How to Use

1. Download or clone this repo.
2. Place your galaxy image (`NGC_4414_(NASA-med).jpg`) in the same folder as `index.html`.
3. Open `index.html` in a browser to play the quiz.

## 🌌 Deploy on GitHub Pages

1. Create a new repo on GitHub (e.g., `galaxy-quiz`).
2. Upload all files (`index.html`, `style.css`, `script.js`, `questions.js`, and your galaxy image).
3. Go to **Settings → Pages → Source** and select **main branch / root**.
4. After ~1–2 minutes, your site will be live at:

```
https://<your-username>.github.io/galaxy-quiz/
```

---

## ✏️ How to Add New Questions

All quiz questions are stored in **`questions.js`** in this format:

```js
const questions = [
  {
    question: "Your question text here?",
    answers: [
      { text: "Answer 1", correct: false },
      { text: "Answer 2", correct: true },
      { text: "Answer 3", correct: false },
      { text: "Answer 4", correct: false }
    ]
  },
  // Add more questions below
];
```

### Example
```js
const questions = [
  {
    question: "What is 2 + 2?",
    answers: [
      { text: "3", correct: false },
      { text: "4", correct: true },
      { text: "5", correct: false },
      { text: "22", correct: false }
    ]
  },
  {
    question: "Which planet is known as the Red Planet?",
    answers: [
      { text: "Venus", correct: false },
      { text: "Mars", correct: true },
      { text: "Jupiter", correct: false },
      { text: "Mercury", correct: false }
    ]
  }
];
```

### Steps
1. Open `questions.js` in any text editor (Notepad, VS Code, etc.).
2. Replace or add question objects inside the `questions = [ ... ];` array.
3. Save the file.
4. Refresh your quiz page — new questions will appear!

---

## ✅ Tips
- Always have exactly **one correct: true** per question.
- You can add as many questions as you like (no limit).
- Order of answers will display as written (randomization can be added later if desired).

Enjoy your galaxy quiz game! ✨
