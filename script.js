// Dark mode toggle
const darkToggle = document.getElementById('darkToggle');
darkToggle.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
});

// CTA ripple coords
const ctaBtn = document.getElementById('ctaBtn');
ctaBtn.addEventListener('mousemove', (e) => {
  const rect = ctaBtn.getBoundingClientRect();
  ctaBtn.style.setProperty('--x', `${e.clientX - rect.left}px`);
  ctaBtn.style.setProperty('--y', `${e.clientY - rect.top}px`);
});

// Bottom nav scroll
document.querySelectorAll('.nav-btn').forEach(b=>{
  b.addEventListener('click', ()=> {
    const target = document.querySelector(b.dataset.target);
    target?.scrollIntoView({behavior:'smooth', block:'start'});
  });
});

// Aurora animated gradient background
(function aurora() {
  const canvas = document.getElementById('auroraCanvas');
  const ctx = canvas.getContext('2d');
  function resize(){ canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; }
  resize(); window.addEventListener('resize', resize);
  let t = 0;
  function draw(){
    t += 0.01;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const grd = ctx.createRadialGradient(canvas.width*0.3, canvas.height*0.3, 50, canvas.width*0.5, canvas.height*0.6, canvas.width*0.9);
    grd.addColorStop(0, `hsla(${(t*40)%360}, 80%, 75%, .35)`);
    grd.addColorStop(1, 'transparent');
    ctx.fillStyle = grd; ctx.fillRect(0,0,canvas.width,canvas.height);
    requestAnimationFrame(draw);
  }
  draw();
})();

// Seasonal themes
(function seasonTheme(){
  const m = new Date().getMonth()+1; // 1-12
  const root = document.documentElement;
  const seasonText = document.getElementById('seasonText');
  if ([9,10,11].includes(m)) { root.classList.add('autumn'); seasonText.textContent = 'Autumn warm wood tones 🍂'; }
  else if ([3,4,5].includes(m)) { root.classList.add('spring'); seasonText.textContent = 'Spring pastel flowers 🌸'; }
  else { seasonText.textContent = 'Classic dreamy aurora ✨'; }
})();

// Carousel swipe + buttons
(function carousel(){
  const container = document.getElementById('carousel');
  const prev = document.getElementById('prevBtn');
  const next = document.getElementById('nextBtn');
  let isDown=false, startX=0, scrollLeft=0;
  container.addEventListener('mousedown', e=>{ isDown=true; startX=e.pageX - container.offsetLeft; scrollLeft=container.scrollLeft; });
  container.addEventListener('mouseleave', ()=> isDown=false );
  container.addEventListener('mouseup', ()=> isDown=false );
  container.addEventListener('mousemove', e=>{
    if(!isDown) return;
    e.preventDefault();
    const x=e.pageX - container.offsetLeft;
    const walk=(x - startX)*1.5;
    container.scrollLeft = scrollLeft - walk;
  });
  container.addEventListener('touchstart', e=>{ startX=e.touches[0].pageX; scrollLeft=container.scrollLeft; }, {passive:true});
  container.addEventListener('touchmove', e=>{
    const x=e.touches[0].pageX;
    const walk=(x - startX)*1.2;
    container.scrollLeft = scrollLeft - walk;
  }, {passive:true});
  prev.addEventListener('click', ()=> container.scrollBy({left:-320, behavior:'smooth'}) );
  next.addEventListener('click', ()=> container.scrollBy({left:320, behavior:'smooth'}) );
})();

// Testimonials avatar gentle parallax on scroll
document.addEventListener('scroll', ()=>{
  document.querySelectorAll('.avatar.animated').forEach(el=>{
    const r = el.getBoundingClientRect();
    const o = (window.innerHeight - r.top) / window.innerHeight;
    el.style.transform = `translateY(${(o-0.5)*6}px)`;
  });
});

// Joke spinner + localStorage + confetti
const jokes = [
  "Umubaji ati: ‘Ntawuca igiti n’ishoka yabunzwe!’ 🤭",
  "Imbaho ziravuga: ‘Turakunda glowing finish!’ 😄",
  "Placard yaremye akajambo: ‘Ndafise imyanya menshi!’ 😂",
  "Intebe iti: ‘Wicare neza, umutekano mbere ya vyose!’ 😌",
];
const jokeText = document.getElementById('jokeText');
const spinJokeBtn = document.getElementById('spinJokeBtn');
const clearJokesBtn = document.getElementById('clearJokesBtn');
function getSeen(){ return JSON.parse(localStorage.getItem('seenJokes')||'[]'); }
function setSeen(arr){ localStorage.setItem('seenJokes', JSON.stringify(arr)); }
function confetti(){
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width=window.innerWidth; canvas.height=window.innerHeight;
  const parts = Array.from({length: 120}).map(()=>({
    x: Math.random()*canvas.width,
    y: -10,
    vx: (Math.random()*2 -1)*2,
    vy: Math.random()*3 + 2,
    size: Math.random()*6 + 3,
    color: `hsl(${Math.random()*360}, 90%, 70%)`,
    rot: Math.random()*Math.PI
  }));
  let frames = 0;
  function draw(){
    frames++;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    parts.forEach(p=>{
      p.x += p.vx; p.y += p.vy; p.rot += 0.05;
      ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot);
      ctx.fillStyle = p.color; ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size);
      ctx.restore();
    });
    if (frames < 160) requestAnimationFrame(draw);
    else ctx.clearRect(0,0,canvas.width,canvas.height);
  }
  draw();
}
function spinJoke(){
  const seen = getSeen();
  const pool = jokes.filter(j=> !seen.includes(j));
  const pick = pool.length ? pool[Math.floor(Math.random()*pool.length)] : jokes[Math.floor(Math.random()*jokes.length)];
  jokeText.textContent = pick;
  if(!seen.includes(pick)) { seen.push(pick); setSeen(seen); }
  confetti();
}
spinJokeBtn.addEventListener('click', spinJoke);
clearJokesBtn.addEventListener('click', ()=> localStorage.removeItem('seenJokes') );

// Google Maps: WhatsApp link + QR area
const waLink = document.getElementById('waLink');
// Simbuza numero yawe & autoresponder message
const waNumber = '25771633859'; // 257... (Bujumbura)
const waMsg = encodeURIComponent('Muraho! Nshaka devis y\'ibikoresho by\'imbaho. Izina: , Igihe: ');
waLink.href = `https://wa.me/${waNumber}?text=${waMsg}`;
waLink.textContent = 'WhatsApp Devis';

// Price estimator
const len = document.getElementById('len');
const wid = document.getElementById('wid');
const woodType = document.getElementById('woodType');
const lenVal = document.getElementById('lenVal');
const widVal = document.getElementById('widVal');
const priceOut = document.getElementById('priceOut');
function calcPrice(){
  const L = Number(len.value), W = Number(wid.value);
  lenVal.textContent = L; widVal.textContent = W;
  const area = (L * W) / 10000; // m^2
  const base = 50000; // BIF base per m^2 (placeholder)
  const mult = woodType.value==='oak' ? 1.6 : woodType.value==='teak' ? 1.8 : 1.2;
  const price = Math.round(area * base * mult);
  priceOut.textContent = `BIF ${price.toLocaleString('en-US')}`;
}
[len,wid,woodType].forEach(el=> el.addEventListener('input', calcPrice));
calcPrice();

// Before/After slider logic
document.querySelectorAll('.ba-wrap').forEach(w=>{
  const after = w.querySelector('.after');
  const slider = w.querySelector('.ba-slider');
  slider.addEventListener('input', ()=> {
    const v = slider.value; // 0 - 100
    after.style.clipPath = `inset(0 0 0 ${100 - v}%)`;
  });
});

// Appointment scheduler -> WhatsApp or Email
const apptForm = document.getElementById('apptForm');
const emailBtn = document.getElementById('emailBtn');
apptForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const n = document.getElementById('name').value.trim();
  const d = document.getElementById('date').value;
  const t = document.getElementById('time').value;
  const need = document.getElementById('need').value.trim();
  const msg = encodeURIComponent(`Rendez-vous: ${n}, ${d} ${t}, Icyo nkeneye: ${need}`);
  window.open(`https://wa.me/${waNumber}?text=${msg}`, '_blank');
});
emailBtn.addEventListener('click', ()=>{
  const n = document.getElementById('name').value.trim();
  const d = document.getElementById('date').value;
  const t = document.getElementById('time').value;
  const need = document.getElementById('need').value.trim();
  const subject = encodeURIComponent(`Rendez-vous: ${n}`);
  const body = encodeURIComponent(`Itariki: ${d} ${t}\nIcyo nkeneye: ${need}\nMerci!`);
  window.location.href = `mailto:ornoirbruce5@gmail.com?subject=${subject}&body=${body}`;
});

// Analytics charts (vanilla canvas)
function drawLineChart(canvasId, data, colorA='#c7f0ff', colorB='#ffcfe4'){
  const c = document.getElementById(canvasId);
  const ctx = c.getContext('2d');
  const padding = 18; const W = c.width; const H = c.height;
  ctx.clearRect(0,0,W,H);
  // bg glow
  const g = ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0, 'rgba(199,240,255,.18)');
  g.addColorStop(1, 'rgba(255,207,228,.08)');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);

  const max = Math.max(...data);
  const stepX = (W - padding*2) / (data.length-1);
  ctx.strokeStyle = colorA; ctx.lineWidth = 2.2; ctx.beginPath();
  data.forEach((v,i)=>{
    const x = padding + i*stepX;
    const y = H - padding - (v/max)*(H - padding*2);
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    // point glow
    ctx.fillStyle = colorB; ctx.shadowColor = colorB; ctx.shadowBlur = 8;
    ctx.beginPath(); ctx.arc(x,y,3,0,Math.PI*2); ctx.fill(); ctx.shadowBlur=0;
  });
  ctx.stroke();
}
drawLineChart('visitsChart', [3,6,9,5,8,12,10]);
drawLineChart('quotesChart', [1,2,3,2,4,5,6], '#ffcfe4', '#c7f0ff');

// Dynamic wood selector -> CSS variables shift
const woodMap = {
  pine: { overlay:'#f9d4b9', stroke:'#c89f83' },
  oak: { overlay:'#cfa27e', stroke:'#a17457' },
  teak:{ overlay:'#b8845d', stroke:'#7a5037' }
};
document.querySelectorAll('[data-wood]').forEach(b=>{
  b.addEventListener('click', ()=>{
    const w = woodMap[b.dataset.wood];
    document.documentElement.style.setProperty('--wood1', w.overlay);
    document.documentElement.style.setProperty('--wood2', w.stroke);
  });
});

// Onboarding tour (one-time using localStorage)
const onboarding = document.getElementById('onboarding');
(function tour(){
  if(localStorage.getItem('mm_onboarded')==='1') return;
  onboarding.classList.remove('hidden');
  const steps = Array.from(onboarding.querySelectorAll('.onboarding-step'));
  let i=0;
  onboarding.querySelectorAll('[data-next]').forEach(btn=> btn.addEventListener('click', ()=>{
    steps[i].classList.add('hidden'); i++; steps[i]?.classList.remove('hidden');
  }));
  onboarding.querySelector('[data-done]').addEventListener('click', ()=>{
    onboarding.classList.add('hidden');
    localStorage.setItem('mm_onboarded','1');
  });
})();

// PWA install prompt
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e)=>{
  e.preventDefault(); deferredPrompt = e;
});
document.getElementById('installBtn').addEventListener('click', async ()=>{
  if(!deferredPrompt) return alert('Install option izaza vuba...');
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
});

// AR placement - camera + draggable furniture
(async function initAR(){
  const video = document.getElementById('camera');
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    video.srcObject = stream;
  } catch(e){ console.warn('Camera access refused', e); }
  const stage = document.getElementById('arStage');
  const furnImgs = {
    table: 'assets/ar/table.png',
    door:  'assets/ar/door.png',
    chair: 'assets/ar/chair.png'
  };
  function addFurn(type){
    const f = document.createElement('div');
    f.className = 'furn';
    f.style.background = `url(${furnImgs[type]}) center/cover, linear-gradient(135deg, var(--wood1), var(--wood2))`;
    stage.appendChild(f);
    // drag
    let ix=0, iy=0, dragging=false;
    f.addEventListener('mousedown',(e)=>{ dragging=true; ix=e.offsetX; iy=e.offsetY; });
    stage.addEventListener('mouseup',()=> dragging=false);
    stage.addEventListener('mousemove',(e)=>{ if(!dragging) return; const r=stage.getBoundingClientRect(); f.style.left=(e.clientX - r.left - ix)+'px'; f.style.top=(e.clientY - r.top - iy)+'px'; });
    // resize via wheel
    f.addEventListener('wheel',(e)=>{ e.preventDefault(); const scale = Math.max(.5, Math.min(3, (parseFloat(f.dataset.scale)||1) + (e.deltaY<0? .1 : -.1))); f.dataset.scale=scale; f.style.transform=`scale(${scale})`; });
    // touch
    f.addEventListener('touchstart',(e)=>{ dragging=true; const t=e.touches[0]; const rect=f.getBoundingClientRect(); ix=t.clientX-rect.left; iy=t.clientY-rect.top; },{passive:true});
    stage.addEventListener('touchmove',(e)=>{ if(!dragging) return; const t=e.touches[0]; const r=stage.getBoundingClientRect(); f.style.left=(t.clientX - r.left - ix)+'px'; f.style.top=(t.clientY - r.top - iy)+'px'; },{passive:true});
    stage.addEventListener('touchend',()=> dragging=false);
  }
  document.querySelectorAll('[data-furn]').forEach(b=> b.addEventListener('click', ()=> addFurn(b.dataset.furn) ));
  document.getElementById('clearAR').addEventListener('click', ()=> stage.innerHTML='' );
})();

// Bottom nav safe area for mobile
document.addEventListener('DOMContentLoaded', ()=>{
  const nav = document.querySelector('.bottom-nav');
  document.body.style.paddingBottom = (nav.offsetHeight + 16) + 'px';
});
