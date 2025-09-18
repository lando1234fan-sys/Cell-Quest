# Biology Quiz — Galaxy Edition

This is an interactive quiz game built with HTML, CSS, and JavaScript.

## 🚀 How to Deploy on GitHub Pages

1. Create a new repository on GitHub (for example: `bio-quiz`).
2. Upload these files to the root of the repository:
   ```
   index.html
   questions.json
   /assets/background.mp4
   /assets/ambient_loop.wav
   ```
3. Commit and push.

4. In your GitHub repository, go to **Settings → Pages**.

5. Under "Source", select **Deploy from branch**, set branch = `main`, folder = `/ (root)`.

6. Save. GitHub will give you a URL like:
   ```
   https://your-username.github.io/bio-quiz/
   ```

7. Open that link — the quiz should load with your galaxy video background.

## 📝 Editing Questions

- Default questions are stored in **questions.json**.  
- To update questions, edit that file in your repo.  
- The format is:
  ```json
  [
    {
      "question": "What is in a hydroxyl group?",
      "options": ["-OH", "-COOH", "-NH2", "-CH3"],
      "answer": 0
    }
  ]
  ```
- Players on the live site can also upload their own question sets via the **Settings → Upload Questions** option.

## 🎵 Music

- A default background loop is included (`/assets/ambient_loop.wav`).
- Players can toggle music or upload their own audio file in the settings tab.

## ⚠️ Video Size Note

GitHub has a file size limit of **100 MB per file**. If your background video is larger, compress it or host it elsewhere.
