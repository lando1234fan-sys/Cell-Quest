/* script.js - improved checks + more robust layering/troubleshooting */

const galaxyUrl = 'NGC_4414_(NASA-med).jpg';
const shootingContainer = document.querySelector('.shooting-stars');
const layers = [
  { selector: '.layer1', count: 80, drift: 60 },  // closest, fastest
  { selector: '.layer2', count: 100, drift: 90 }, // mid
  { selector: '.layer3', count: 120, drift: 120 } // farthest, slowest
];

// Check whether the galaxy image exists (helps debug missing-file issues)
(function checkGalaxyImage() {
  const img = new Image();
  img.onload = () => {
    // image loaded successfully; ensure the background is set (some hosts are picky)
    const g = document.querySelector('.galaxy');
    if (g) g.style.backgroundImage = `url("${galaxyUrl}")`;
    console.log('Galaxy image loaded:', galaxyUrl);
  };
  img.onerror = () => {
    console.warn('Galaxy image not found:', galaxyUrl);
    // If the image is missing, display a small on-page warning and reduce twinkle intensity
    const msg = document.createElement('div');
    msg.className = 'debug-msg';
    msg.textContent = 'Warning: galaxy image not found. Upload NGC_4414_(NASA-med).jpg to the repo root (case-sensitive).';
    document.body.appendChild(msg);

    // Optionally make the star layers a bit dimmer so the missing galaxy is obvious
    const style = document.createElement('style');
    style.textContent = '.twinkle{ opacity: 0.35 !important; }';
    document.head.appendChild(style);
  };
  img.src = galaxyUrl + '?v=' + Date.now(); // cache-bust attempt
})();


// Create twinkling stars with parallax drift
function createTwinkles(container, count, driftSpeed) {
  if (!container) return;
  // clear any previous content (useful if re-running on resize)
  container.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const twinkle = document.createElement('div');
    twinkle.classList.add('twinkle');

    // Random position
    twinkle.style.top = Math.random() * window.innerHeight + 'px';
    twinkle.style.left = Math.random() * window.innerWidth + 'px';

    // Random size
    const size = Math.random() * 2 + 1; // 1–3px
    twinkle.style.width = twinkle.style.height = size + 'px';

    // Random twinkle speed/delay
    const twinkleDuration = (1.5 + Math.random() * 3);
    const driftDuration = driftSpeed + Math.random() * driftSpeed;
    const delay1 = Math.random() * 2;
    const delay2 = Math.random() * driftSpeed;

    twinkle.style.animationDuration = twinkleDuration + 's, ' + driftDuration + 's';
    twinkle.style.animationDelay = delay1 + 's, ' + delay2 + 's';

    container.appendChild(twinkle);
  }
}

// Create shooting stars
function createShootingStar() {
  const star = document.createElement('div');
  star.classList.add('star');

  // Random position
  star.style.top = Math.random() * window.innerHeight + 'px';
  star.style.left = Math.random() * window.innerWidth + 'px';

  // Random size & speed
  const thickness = Math.random() * 2 + 1;  // 1–3px
  const length = Math.random() * 60 + 40;   // 40–100px
  star.style.width = thickness + 'px';
  star.style.height = length + 'px';

  // Random brightness
  const brightness = Math.random() * 0.7 + 0.3; // 0.3–1
  star.style.opacity = brightness;

  // Random speed
  star.style.animationDuration = (2 + Math.random() * 3) + 's';

  shootingContainer.appendChild(star);

  setTimeout(() => {
    star.remove();
  }, 4500);

  // Schedule the next shooting star randomly (1–5s)
  setTimeout(createShootingStar, Math.random() * 4000 + 1000);
}

// Initialize star layers
function init() {
  layers.forEach(layer => {
    const container = document.querySelector(layer.selector);
    createTwinkles(container, layer.count, layer.drift);
  });
  createShootingStar();
}

// Re-create twinkles on resize for correct positioning
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(init, 350);
});

// Run
init();