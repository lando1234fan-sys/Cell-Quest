# Galaxy Quiz

Welcome to **Galaxy Quiz** — a glowing, space-themed multiple-choice quiz you can run locally or publish with GitHub Pages.

## Quick start (student-friendly)
1. Unzip the project folder.
2. Open **index.html** in any modern browser (Chrome, Edge, Firefox).
3. The quiz will load automatically. Questions are taken from `questions.json`.

## Edit questions
- Open `questions.json` in a text editor.
- Each question is an object with `question` and `answers` (each answer has `text` and `correct` boolean).
- Save and refresh the page to apply changes.

## Run online (GitHub Pages)
1. Create a new GitHub repository and push the project files.
2. In the repo go to **Settings → Pages** and set the source to `main` branch `/ (root)`.
3. Wait a minute and visit `https://<your-username>.github.io/<repo-name>/`.

## Settings (gear icon, top-right)
- **Galaxy Background** → Turn the UHD galaxy video on/off.
- **Background Sound** → Enable or mute the video’s background sound.
  - 🔇 Starts muted on first visit.
  - 🎶 If you turn it on, the choice is remembered next time you play.
- **Load Questions** → Upload a `questions.json` file to replace the current set.
- **Clear Scoreboard** → Reset saved scores.

## Files included
- `index.html`, `style.css`, `script.js` — the game.
- `questions.json` — default biology questions.
- `questions_backup.json` — backup of previous questions.
- `questions_raw.txt` — plain-text extracted questions.
- `sample_questions.json` — small sample set.
- `screenshot.png` — demo screenshot.
- `galaxy_video.mp4` — UHD galaxy background (embedded).

Enjoy — and good luck studying! 🚀