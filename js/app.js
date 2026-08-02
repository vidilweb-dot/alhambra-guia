// ---------- Estado ----------
let current = parseInt(localStorage.getItem('alhambra_current') || '0', 10);
const player = document.getElementById('player');

// ---------- Elementos ----------
const els = {
  counter: document.getElementById('stopCounter'),
  context: document.getElementById('stopContext'),
  title: document.getElementById('stopTitle'),
  summary: document.getElementById('stopSummary'),
  playBtn: document.getElementById('playBtn'),
  playIcon: document.getElementById('playIcon'),
  prevBtn: document.getElementById('prevBtn'),
  nextBtn: document.getElementById('nextBtn'),
  scrub: document.getElementById('scrub'),
  timeCurrent: document.getElementById('timeCurrent'),
  timeTotal: document.getElementById('timeTotal'),
  listToggle: document.getElementById('listToggle'),
  stopList: document.getElementById('stopList'),
  tileRing: document.getElementById('tileRing'),
  cacheBanner: document.getElementById('cacheBanner'),
};

const ICON_PLAY = '<path d="M8 5v14l11-7z"/>';
const ICON_PAUSE = '<path d="M6 5h4v14H6zM14 5h4v14h-4z"/>';

function fmtTime(sec) {
  if (!isFinite(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// ---------- Anillo de progreso (13 teselas, motivo de alicatado) ----------
function renderTileRing() {
  const n = STOPS.length;
  const tileR = 6.5;
  // Disposición lineal: 13 teselas en fila, más legible en móvil que un semicírculo
  const spacing = 400 / (n + 1);
  const svg = STOPS.map((s, i) => {
    const x = spacing * (i + 1);
    const y = 30;
    let cls = 'pending';
    if (i < current) cls = 'done';
    if (i === current) cls = 'current';
    return `<rect class="tile ${cls}" data-i="${i}" x="${x - tileR / 2}" y="${y - tileR / 2}" width="${tileR}" height="${tileR}" transform="rotate(45 ${x} ${y})" rx="1.5"/>`;
  }).join('');
  els.tileRing.innerHTML = svg;
  els.tileRing.querySelectorAll('.tile').forEach(t => {
    t.addEventListener('click', () => loadStop(parseInt(t.dataset.i, 10)));
  });
}

// ---------- Lista de paradas ----------
function renderStopList() {
  els.stopList.innerHTML = STOPS.map((s, i) => `
    <div class="stop-item ${i === current ? 'active' : ''}" data-i="${i}">
      <span class="n mono">${String(i).padStart(2, '0')}</span>
      <span class="t">${s.title}</span>
    </div>
  `).join('');
  els.stopList.querySelectorAll('.stop-item').forEach(item => {
    item.addEventListener('click', () => {
      loadStop(parseInt(item.dataset.i, 10));
      els.stopList.classList.remove('open');
    });
  });
}

// ---------- Cargar una parada ----------
function loadStop(i, autoplay = false) {
  current = Math.max(0, Math.min(STOPS.length - 1, i));
  localStorage.setItem('alhambra_current', current);
  const s = STOPS[current];

  els.counter.textContent = `PARADA ${current + 1} DE ${STOPS.length}`;
  els.context.textContent = s.context || '';
  els.title.textContent = s.title;
  els.summary.textContent = s.summary;
  els.prevBtn.disabled = current === 0;
  els.nextBtn.disabled = current === STOPS.length - 1;

  player.src = s.audio;
  els.scrub.value = 0;
  els.timeCurrent.textContent = '0:00';
  els.playIcon.innerHTML = ICON_PLAY;

  if (autoplay) player.play().catch(() => {});

  renderTileRing();
  renderStopList();
  window.currentStopContext = `${s.title}. ${s.summary}`;
  if (window.updateChatContextLabel) window.updateChatContextLabel();
}

// ---------- Controles de transporte ----------
els.playBtn.addEventListener('click', () => {
  if (player.paused) {
    player.play().catch(() => {});
  } else {
    player.pause();
  }
});
player.addEventListener('play', () => els.playIcon.innerHTML = ICON_PAUSE);
player.addEventListener('pause', () => els.playIcon.innerHTML = ICON_PLAY);

player.addEventListener('timeupdate', () => {
  if (!player.duration) return;
  els.scrub.value = (player.currentTime / player.duration) * 100;
  els.timeCurrent.textContent = fmtTime(player.currentTime);
});
player.addEventListener('loadedmetadata', () => {
  els.timeTotal.textContent = fmtTime(player.duration);
});
player.addEventListener('ended', () => {
  if (current < STOPS.length - 1) loadStop(current + 1, true);
});

els.scrub.addEventListener('input', () => {
  if (player.duration) player.currentTime = (els.scrub.value / 100) * player.duration;
});

els.prevBtn.addEventListener('click', () => loadStop(current - 1, true));
els.nextBtn.addEventListener('click', () => loadStop(current + 1, true));

els.listToggle.addEventListener('click', () => {
  els.stopList.classList.toggle('open');
});

// ---------- Caché offline de audios ----------
async function cacheAllAudio() {
  if (!('caches' in window)) {
    els.cacheBanner.style.display = 'none';
    return;
  }
  try {
    const cache = await caches.open('alhambra-audio-v1');
    let done = 0;
    await Promise.all(STOPS.map(async s => {
      const match = await cache.match(s.audio);
      if (!match) await cache.add(s.audio);
      done++;
      els.cacheBanner.textContent = `Descargando audios sin cobertura… ${done}/${STOPS.length}`;
    }));
    els.cacheBanner.textContent = '✓ Audios listos para reproducir sin conexión';
    els.cacheBanner.classList.add('ready');
    setTimeout(() => { els.cacheBanner.style.display = 'none'; }, 4000);
  } catch (e) {
    els.cacheBanner.textContent = 'No se pudieron precargar todos los audios (revisa tu conexión)';
  }
}

// Intercepta las peticiones de audio para servir desde caché si existe
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}

// ---------- Init ----------
loadStop(current);
cacheAllAudio();
