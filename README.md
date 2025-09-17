# Galaxy Background (Fixed)

This version includes a few fixes and troubleshooting helpers.

**What I changed**
- Fixed z-index ordering so the galaxy image is the base layer and stars appear above it.
- Added a JS check that warns you (on-page and in console) if the galaxy image file is missing or misnamed.
- Slight tuning of animation and will-change hints for smoother rendering.

**Troubleshooting** (if you still only see stars)
1. Make sure the image `NGC_4414_(NASA-med).jpg` is uploaded to your repo root **exactly** with that filename (case-sensitive).
2. Verify the image appears in the GitHub file list and that you committed it.
3. Hard-refresh the page (Ctrl/Cmd+Shift+R) to bypass cache.
4. Open DevTools (F12) → Console to see the "Galaxy image not found" warning if the image didn't load.

**How to use**
1. Download or clone this repo.
2. Ensure `NGC_4414_(NASA-med).jpg` is in the same folder as `index.html`.
3. Open `index.html` locally, or upload to GitHub Pages (root branch).

---

