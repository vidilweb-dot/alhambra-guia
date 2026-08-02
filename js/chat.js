// ⚠️ Sustituye esta URL por la de tu Worker una vez desplegado
const WORKER_URL = 'https://TU-WORKER.TU-USUARIO.workers.dev';

const chatEls = {
  fab: document.getElementById('chatFab'),
  panel: document.getElementById('chatPanel'),
  close: document.getElementById('chatClose'),
  log: document.getElementById('chatLog'),
  input: document.getElementById('chatInput'),
  send: document.getElementById('sendBtn'),
  contextLabel: document.getElementById('chatContextLabel'),
};

window.updateChatContextLabel = function () {
  chatEls.contextLabel.textContent = `Sobre: ${STOPS[current].title}`;
};

chatEls.fab.addEventListener('click', () => {
  chatEls.panel.classList.add('open');
  window.updateChatContextLabel();
  chatEls.input.focus();
});
chatEls.close.addEventListener('click', () => chatEls.panel.classList.remove('open'));
chatEls.panel.addEventListener('click', (e) => {
  if (e.target === chatEls.panel) chatEls.panel.classList.remove('open');
});

function addMsg(text, cls) {
  const div = document.createElement('div');
  div.className = `msg ${cls}`;
  div.textContent = text;
  chatEls.log.appendChild(div);
  chatEls.log.scrollTop = chatEls.log.scrollHeight;
  return div;
}

async function sendQuestion() {
  const question = chatEls.input.value.trim();
  if (!question) return;
  chatEls.input.value = '';
  addMsg(question, 'user');
  const pending = addMsg('Pensando…', 'pending');

  try {
    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question,
        stopContext: window.currentStopContext || '',
        stopTitle: STOPS[current].title,
      }),
    });
    if (!res.ok) throw new Error('Worker error');
    const data = await res.json();
    pending.remove();
    addMsg(data.answer || 'No he podido obtener respuesta.', 'assistant');
  } catch (err) {
    pending.remove();
    addMsg('Sin conexión o el servicio no responde ahora mismo. Prueba de nuevo cuando tengas cobertura.', 'assistant');
  }
}

chatEls.send.addEventListener('click', sendQuestion);
chatEls.input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendQuestion();
});
