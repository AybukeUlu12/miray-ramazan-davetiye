const cover = document.getElementById('cover');
const seal = document.getElementById('seal');
const invite = document.getElementById('invite');
const music = document.getElementById('music');
const musicToggle = document.getElementById('musicToggle');

const MAX_VOLUME = 0.72;
const FADE_SECONDS = 2.2;
let fadeFrame = null;
let restarting = false;

function stopFade(){
  if (fadeFrame) cancelAnimationFrame(fadeFrame);
  fadeFrame = null;
}
function fadeTo(target, durationMs, done){
  stopFade();
  const start = performance.now();
  const from = music.volume;
  const tick = now => {
    const t = Math.min(1, (now-start)/durationMs);
    music.volume = from + (target-from)*t;
    if(t < 1) fadeFrame = requestAnimationFrame(tick);
    else { fadeFrame=null; if(done) done(); }
  };
  fadeFrame=requestAnimationFrame(tick);
}
async function startMusicSoft(){
  restarting = false;
  music.currentTime = 0;
  music.volume = 0;
  try { await music.play(); fadeTo(MAX_VOLUME, 1200); } catch (_) {}
}

seal.addEventListener('click', async () => {
  await startMusicSoft();
  invite.classList.add('show');
  invite.setAttribute('aria-hidden','false');
  cover.classList.add('open');
  setTimeout(() => {
    cover.style.display = 'none';
    document.body.classList.remove('locked');
    musicToggle.classList.add('show');
    window.scrollTo(0,0);
  }, 1550);
}, { once:true });

music.addEventListener('timeupdate', () => {
  if (!music.duration || restarting || music.paused) return;
  const remaining = music.duration - music.currentTime;
  if (remaining <= FADE_SECONDS) {
    restarting = true;
    fadeTo(0, Math.max(250, remaining * 1000), async () => {
      if (!music.paused) await startMusicSoft();
    });
  }
});

music.addEventListener('ended', async () => {
  if (!music.paused) await startMusicSoft();
});

musicToggle.addEventListener('click', async () => {
  if (music.paused) {
    try {
      music.volume = 0;
      await music.play();
      fadeTo(MAX_VOLUME, 700);
    } catch (_) {}
    musicToggle.classList.remove('muted');
    musicToggle.textContent = '♪';
  } else {
    fadeTo(0, 450, () => music.pause());
    musicToggle.classList.add('muted');
    musicToggle.textContent = '×';
  }
});

const target = new Date('2026-09-12T20:00:00+03:00').getTime();
function updateCountdown(){
  let left = Math.max(0, target - Date.now());
  const d = Math.floor(left / 86400000); left %= 86400000;
  const h = Math.floor(left / 3600000); left %= 3600000;
  const m = Math.floor(left / 60000); left %= 60000;
  const s = Math.floor(left / 1000);
  document.getElementById('days').textContent = String(d).padStart(2,'0');
  document.getElementById('hours').textContent = String(h).padStart(2,'0');
  document.getElementById('minutes').textContent = String(m).padStart(2,'0');
  document.getElementById('seconds').textContent = String(s).padStart(2,'0');
}
updateCountdown();
setInterval(updateCountdown, 1000);
