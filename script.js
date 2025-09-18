// Robust full script for Galaxy Quiz - includes error reporting overlay for debugging
(function(){
  'use strict';
  // helpers
  const $ = sel => document.querySelector(sel);
  const el = id => document.getElementById(id);

  // DOM refs
  const questionEl = el('question');
  const answersEl = el('answers');
  const nextBtn = el('next-btn');
  const progressBar = el('progress-bar');
  const questionNumEl = el('question-num');

  const settingsBtn = el('settings-btn');
  const settingsModal = el('settings-modal');
  const closeSettingsBtn = el('close-settings-btn');
  const videoToggle = el('video-toggle');
  const audioToggle = el('audio-toggle');
  const loadQuestionsBtn = el('load-questions-btn');
  const clearScoresBtn = el('clear-scores-btn');
  const fileInput = el('file-input');
  const soundToggleBtn = el('sound-toggle');
  const bgVideo = el('bg-video');
  const errorOverlay = el('error-overlay');

  let audioEl = null;
  let questions = [];
  let shuffled = [];
  let currentIndex = 0;
  let score = 0;
  let modalOpen = false;

  // Error handler: show overlay and console.log
  function showError(msg, err){
    console.error(msg, err);
    if(errorOverlay){
      errorOverlay.classList.remove('hidden');
      errorOverlay.textContent = msg + (err ? '\n' + (err.message || String(err)) : '');
    } else {
      alert(msg + (err ? '\n' + (err.message || String(err)) : ''));
    }
  }
  window.addEventListener('error', (e)=>{ showError('A runtime error occurred', e.error || e.message); });

  function stripLabel(q){ return q.replace(/^Q\d+:\s*/i, '').trim(); }

  // Load questions.json (supports {questions:[]} or array)
  async function loadQuestionsSource(){
    try{
      const saved = localStorage.getItem('customQuestions');
      if(saved){
        const parsed = JSON.parse(saved);
        questions = parsed.questions || parsed;
        return;
      }
      const res = await fetch('questions.json', {cache: 'no-store'});
      if(!res.ok) throw new Error('Failed to fetch questions.json: ' + res.status);
      const j = await res.json();
      questions = j.questions || j;
    }catch(err){
      showError('Could not load questions.json. Using a small fallback set.', err);
      questions = [
        {question:'Q1: Fallback - What is the powerhouse of the cell?', answers:[{text:'Mitochondria',correct:true},{text:'Nucleus',correct:false},{text:'Ribosome',correct:false},{text:'Chloroplast',correct:false}]},
        {question:'Q2: Fallback - Which macromolecule stores genetic information?', answers:[{text:'DNA',correct:true},{text:'Protein',correct:false},{text:'Lipid',correct:false},{text:'Carbohydrate',correct:false}]}
      ];
    }
  }

  function startQuiz(){
    currentIndex = 0;
    score = 0;
    shuffled = [...questions].sort(()=>Math.random()-0.5);
    nextBtn.innerText = 'Next';
    updateProgress();
    showQuestion();
  }

  function showQuestion(){
    try{
      resetState();
      const qObj = shuffled[currentIndex];
      if(!qObj) throw new Error('No question object at index ' + currentIndex);
      questionNumEl.innerText = `Question ${currentIndex+1} of ${shuffled.length}`;
      questionEl.innerText = stripLabel(qObj.question || 'No question text');
      const answers = [...(qObj.answers || [])].sort(()=>Math.random()-0.5);
      if(answers.length===0) throw new Error('Question has no answers: ' + qObj.question);
      answers.forEach(a=>{
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.innerText = a.text;
        btn.addEventListener('click', ()=> selectAnswer(btn, a.correct));
        answersEl.appendChild(btn);
      });
    }catch(err){
      showError('Failed to render question', err);
    }
  }

  function resetState(){
    nextBtn.classList.add('hidden');
    while(answersEl.firstChild) answersEl.removeChild(answersEl.firstChild);
  }

  function selectAnswer(btn, correct){
    try{
      const btns = answersEl.querySelectorAll('button');
      btns.forEach(b=>b.disabled=true);
      if(correct){ btn.classList.add('correct'); score++; }
      else{ btn.classList.add('wrong'); }
      nextBtn.classList.remove('hidden');
      updateProgress();
    }catch(err){ showError('Error handling answer selection', err); }
  }

  function showScore(){
    resetState();
    questionEl.innerText = `You scored ${score} out of ${shuffled.length}! 🎉`;
    nextBtn.innerText = 'Play Again';
    nextBtn.classList.remove('hidden');
    saveScore(score);
    // small scoreboard alert for now
    setTimeout(()=>{ alert('Score saved.'); }, 100);
  }

  function handleNext(){
    currentIndex++;
    if(currentIndex < shuffled.length) showQuestion();
    else showScore();
  }
  nextBtn.addEventListener('click', ()=> {
    if(currentIndex < shuffled.length) handleNext();
    else startQuiz();
  });

  function updateProgress(){
    const total = shuffled.length || 1;
    const answered = currentIndex;
    const pct = (answered/total)*100;
    progressBar.style.width = pct + '%';
  }

  // Local storage scoreboard
  function saveScore(s){ let arr = JSON.parse(localStorage.getItem('quizScores')||'[]'); arr.unshift(s); if(arr.length>5) arr=arr.slice(0,5); localStorage.setItem('quizScores', JSON.stringify(arr)); }
  function clearScores(){ localStorage.removeItem('quizScores'); alert('Scores cleared'); }

  // SETTINGS modal pause behavior
  function openSettings(){ modalOpen = true; settingsModal.classList.remove('hidden'); settingsModal.setAttribute('aria-hidden','false'); }
  function closeSettings(){ modalOpen = false; settingsModal.classList.add('hidden'); settingsModal.setAttribute('aria-hidden','true'); }
  settingsBtn.addEventListener('click', openSettings);
  closeSettingsBtn.addEventListener('click', closeSettings);

  // FILE input for custom questions
  fileInput.addEventListener('change', (e)=>{
    const f = e.target.files[0]; if(!f) return;
    const reader = new FileReader();
    reader.onload = evt => {
      try{
        const parsed = JSON.parse(evt.target.result);
        const toSave = parsed.questions ? parsed : {questions: parsed};
        localStorage.setItem('customQuestions', JSON.stringify(toSave));
        loadQuestionsSource().then(()=>{ startQuiz(); closeSettings(); });
      }catch(err){
        alert('Invalid JSON file. Must be an array or {questions:[...]}');
      }
    };
    reader.readAsText(f);
  });
  // trigger file input from button
  loadQuestionsBtn.addEventListener('click', ()=> fileInput.click());

  // Clear scores button
  clearScoresBtn.addEventListener('click', ()=> { if(confirm('Clear all saved scores?')) clearScores(); });

  // VIDEO & AUDIO controls
  // Fade-in when canplaythrough
  bgVideo.addEventListener('canplaythrough', ()=> {
    try{
      const prefer = (localStorage.getItem('videoEnabled') || 'true') === 'true';
      if(prefer){ bgVideo.style.opacity = '1'; }
    }catch(e){ console.warn(e); }
  });
  bgVideo.playbackRate = 0.5;
  bgVideo.muted = true; // visuals muted; audio via separate element

  function ensureAudio(){
    if(audioEl) return;
    audioEl = document.createElement('audio');
    audioEl.src = 'background.mp4';
    audioEl.loop = true; audioEl.preload = 'auto'; audioEl.style.display='none'; audioEl.playbackRate = 1.0;
    document.body.appendChild(audioEl);
  }

  // toggles in settings
  videoToggle.addEventListener('change', (e)=>{
    localStorage.setItem('videoEnabled', e.target.checked ? 'true' : 'false');
    if(e.target.checked){ bgVideo.play().catch(()=>{}); bgVideo.style.opacity='1'; } else { bgVideo.pause(); bgVideo.style.opacity='0'; }
  });
  audioToggle.addEventListener('change', (e)=>{
    localStorage.setItem('audioEnabled', e.target.checked ? 'true' : 'false');
    if(e.target.checked){ ensureAudio(); try{ audioEl.currentTime = bgVideo.currentTime; }catch(_){} audioEl.play().catch(()=>{}); soundToggleBtn.innerText='🔊'; } else { if(audioEl) audioEl.pause(); soundToggleBtn.innerText='🔇'; }
  });

  // top bar quick toggle
  soundToggleBtn.addEventListener('click', ()=>{
    const currently = (localStorage.getItem('audioEnabled')||'false') === 'true';
    const target = !currently;
    audioToggle.checked = target;
    audioToggle.dispatchEvent(new Event('change'));
  });

  // apply saved settings
  function applySavedSettings(){
    const videoEnabled = (localStorage.getItem('videoEnabled') || 'true') === 'true';
    const audioEnabled = (localStorage.getItem('audioEnabled') || 'false') === 'true';
    videoToggle.checked = videoEnabled; audioToggle.checked = audioEnabled;
    if(videoEnabled){ bgVideo.play().catch(()=>{}); bgVideo.style.opacity='1'; } else { bgVideo.pause(); bgVideo.style.opacity='0'; }
    if(audioEnabled){ ensureAudio(); try{ audioEl.currentTime = bgVideo.currentTime; }catch(_){} audioEl.play().catch(()=>{}); soundToggleBtn.innerText='🔊'; } else { soundToggleBtn.innerText='🔇'; }
  }

  // click outside settings closes modal
  window.addEventListener('click', (e)=>{ if(!settingsModal.classList.contains('hidden') && !settingsModal.contains(e.target) && !settingsBtn.contains(e.target)) closeSettings(); });

  // STAR FIELD (slower cinematic)
  function initStars(){
    const canvas = document.getElementById('stars');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    function resize(){ canvas.width = innerWidth; canvas.height = innerHeight; }
    window.addEventListener('resize', resize);
    resize();
    const stars = [];
    const num = Math.max(60, Math.floor((canvas.width*canvas.height)/80000));
    for(let i=0;i<num;i++){
      stars.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,r:Math.random()*1.4+0.4,vx:(Math.random()*0.2-0.1)*0.35,vy:(Math.random()*0.2-0.1)*0.35,alpha:Math.random()*0.6+0.3});
    }
    function frame(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      for(const s of stars){
        s.x += s.vx; s.y += s.vy;
        if(s.x<0) s.x = canvas.width; if(s.x>canvas.width) s.x = 0;
        if(s.y<0) s.y = canvas.height; if(s.y>canvas.height) s.y = 0;
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
        ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill();
      }
      if(!modalOpen) requestAnimationFrame(frame); else setTimeout(frame, 1000/30);
    }
    frame();
  }

  // initialization flow
  (async function init(){
    try{
      await loadQuestionsSource();
      applySavedSettings();
      initStars();
      startQuiz();
    }catch(err){
      showError('Initialization failed', err);
    }
  })();

})();