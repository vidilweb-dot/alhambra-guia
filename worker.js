// Cloudflare Worker — intermediario entre la web y la API de Claude.
// Guarda tu clave de API como "secret" en Cloudflare (nunca en este archivo).
//
// Despliegue:
// 1. dash.cloudflare.com → Workers & Pages → Create → Create Worker
// 2. Pega este código en el editor
// 3. Settings → Variables → Add secret: ANTHROPIC_API_KEY = tu clave sk-ant-...
// 4. Deploy. Copia la URL (algo como https://alhambra-guia.tu-usuario.workers.dev)
// 5. Pega esa URL en WORKER_URL dentro de js/chat.js

export default {
  async fetch(request, env) {
    // CORS: permite que tu web (GitHub Pages) llame a este worker
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*', // opcional: restringe a tu dominio de GitHub Pages
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    try {
      const { question, stopContext, stopTitle } = await request.json();

      const systemPrompt = `Eres un guía experto de la Alhambra de Granada, acompañando a un grupo durante su visita.
Están actualmente en o cerca de: "${stopTitle}".
Contexto de esta parada: ${stopContext}

Responde a preguntas puntuales de forma breve (2-4 frases), clara y en un tono cercano de guía turístico.
Si la pregunta no tiene relación con la Alhambra, la Alcazaba, el Generalife, los nazaríes o Granada en esa época, indícalo amablemente y redirige a algo relevante de la visita.`;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 400,
          system: systemPrompt,
          messages: [{ role: 'user', content: question }],
        }),
      });

      const data = await response.json();
      const answer = data.content?.find(b => b.type === 'text')?.text || 'No he podido generar una respuesta.';

      return new Response(JSON.stringify({ answer }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (err) {
      return new Response(JSON.stringify({ answer: 'Error procesando la pregunta.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  },
};
