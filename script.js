const seal=document.getElementById('seal');
const envelope=document.getElementById('envelope');
const intro=document.getElementById('nameIntro');
const music=document.getElementById('music');
const sound=document.getElementById('soundToggle');

seal.addEventListener('click', async ()=>{
  try { music.volume=.72; await music.play(); } catch(e) {}
  envelope.classList.add('open');
  setTimeout(()=>{
    envelope.style.display='none';
    intro.classList.add('show');
    intro.setAttribute('aria-hidden','false');
  },1500);
  setTimeout(()=>intro.classList.add('hide'),3900);
  setTimeout(()=>{
    intro.style.display='none';
    document.body.classList.remove('locked');
    sound.classList.add('visible');
    window.scrollTo(0,0);
  },4650);
},{once:true});

sound.addEventListener('click', async ()=>{
  if(music.paused){ try{await music.play()}catch(e){} sound.classList.remove('muted'); sound.textContent='♪'; }
  else { music.pause(); sound.classList.add('muted'); sound.textContent='×'; }
});

const target=new Date('2026-09-12T20:00:00+03:00').getTime();
function updateCountdown(){
  let d=Math.max(0,target-Date.now());
  const days=Math.floor(d/86400000); d%=86400000;
  const hours=Math.floor(d/3600000); d%=3600000;
  const minutes=Math.floor(d/60000); d%=60000;
  const seconds=Math.floor(d/1000);
  document.getElementById('days').textContent=String(days).padStart(2,'0');
  document.getElementById('hours').textContent=String(hours).padStart(2,'0');
  document.getElementById('minutes').textContent=String(minutes).padStart(2,'0');
  document.getElementById('seconds').textContent=String(seconds).padStart(2,'0');
}
updateCountdown(); setInterval(updateCountdown,1000);
