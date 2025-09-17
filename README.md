# Galaxy Quiz - Biology Edition

## 📂 Editing Questions

The quiz uses **questions.json** as the default question bank.

### Format
Each entry looks like this:
```json
{
  "question": "Which functional group is present in alcohols such as ethanol?",
  "answers": [
    { "text": "Hydroxyl group (-OH)", "correct": true },
    { "text": "Carbonyl group (C=O)", "correct": false },
    { "text": "Amino group (-NH2)", "correct": false },
    { "text": "Carboxyl group (-COOH)", "correct": false }
  ]
}
```

### Steps to Edit
1. Open **questions.json** in a text editor (like Notepad, VS Code, or Sublime Text).  
2. Add, remove, or modify questions.  
   - Always include **4 answers per question**.  
   - Exactly **one answer must have `"correct": true`**.  
3. Save the file.  
4. Refresh your quiz webpage to see the changes.

### Using Custom Question Sets
- You can also upload a new JSON file while playing by clicking **"Load Questions"** on the start/restart screen.  
- Uploaded sets are saved in your browser's memory (localStorage).  
- Use **"Reset to Default"** to return to the built-in `questions.json`.

---

✅ Tip: Keep backups of your custom JSON sets for different quizzes!  
