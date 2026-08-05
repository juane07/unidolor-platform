import { createBot } from './bot.js';
import { getPromptText, setPromptText, DEFAULT_PROMPT } from './prompt.js';
import { PHONE, SITE_URL } from './knowledge.js';
import { searchPatient, createPatient, createConsultation } from './nimbo.js';
import { sendToCRM } from './crm.js';
import { getFormServicioValue, getFormServicioLabel, FORM_REQUISITOS } from './knowledge-data.js';

const rateLimit = new Map();
const RATE_WINDOW = 60_000;
const RATE_MAX = 20;

// Orígenes de prueba / ficticios que NO deben crear clientes o citas reales en el CRM
function esOrigenPrueba(from, env) {
  if (from === 'chat-web') return true;
  if (env.ESCALATION_PHONE_NUMBER && from === env.ESCALATION_PHONE_NUMBER) return true;
  const digits = (from || '').replace(/\D/g, '');
  if (digits.length >= 10 && (digits.slice(3, 6) === '555' || /5555/.test(digits))) return true;
  return false;
}

async function fetchWithTimeout(url, options, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

async function hmacSHA256(secret, body) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body));
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function checkRateLimit(from) {
  const now = Date.now();
  const entry = rateLimit.get(from);
  if (!entry || now > entry.resetAt) {
    rateLimit.set(from, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  entry.count++;
  return entry.count <= RATE_MAX;
}

function checkAdminKey(url, env) {
  if (!env.ADMIN_TOKEN) return true;
  const key = url.searchParams.get('key');
  return key && key === env.ADMIN_TOKEN;
}

function denyAdmin() {
  return new Response('Acceso denegado', { status: 401 });
}

async function isDuplicate(msgId, kv) {
  if (!kv || !msgId) return false;
  const key = `dedup:${msgId}`;
  const exists = await kv.get(key);
  if (exists) return true;
  await kv.put(key, '1', { expirationTtl: 300 });
  return false;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const method = request.method;

    if (method === 'GET') {
      if (url.pathname === '/privacy') {
        return servePrivacyPolicy();
      }
      if (url.pathname === '/debug') {
        if (!checkAdminKey(url, env)) return denyAdmin();
        return serveDebug(env);
      }
      if (url.pathname === '/prompt') {
        return servePromptEditor(env);
      }
      if (url.pathname === '/' && !url.searchParams.has('hub.mode')) {
        return serveChatUI();
      }
      if (url.pathname === '/reset') {
        if (!checkAdminKey(url, env)) return denyAdmin();
        return serveReset(env);
      }
      if (url.pathname === '/admin') {
        if (!checkAdminKey(url, env)) return denyAdmin();
        return serveAdmin(env);
      }
      if (url.pathname === '/api/forms') {
        return serveFormsAPI(env);
      }
      if (url.pathname === '/api/send-forms-to-phone') {
        if (!checkAdminKey(url, env)) return denyAdmin();
        return sendFormsToPhone(env, url);
      }
      if (url.pathname === '/solicitud') {
        return serveForm(url);
      }
      if (url.pathname === '/conversations') {
        return serveConversations(env, url);
      }
      if (url.pathname === '/api/conversations') {
        return serveConversationsJSON(env, url);
      }
      if (url.pathname === '/api/fix-conversation-names') {
        if (!checkAdminKey(url, env)) return denyAdmin();
        return fixConversationNames(env);
      }
      if (url.pathname === '/api/fix-encoding') {
        if (!checkAdminKey(url, env)) return denyAdmin();
        return fixEncoding(env);
      }
      if (url.pathname === '/api/cleanup-keys') {
        if (!checkAdminKey(url, env)) return denyAdmin();
        return cleanupKeys(env);
      }
      if (url.searchParams.has('hub.mode')) {
        return handleWebhookVerification(request, env);
      }
      return new Response('Not found', { status: 404 });
    }

    if (method === 'POST') {
      if (url.pathname === '/chat') {
        return handleChatAPI(request, env);
      }
      if (url.pathname === '/prompt') {
        return handlePromptUpdate(request, env);
      }
      if (url.pathname === '/api/submit-form') {
        return handleFormSubmit(request, env);
      }
      return handleIncomingMessage(request, env);
    }

    return new Response('Method not allowed', { status: 405 });
  },

  async scheduled(event, env) {
    await processFollowUps(env);
  },
};

function serveChatUI() {
  const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<title>UNIDOLOR ChatBot</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { height: 100%; }
  body { font-family: -apple-system, BlinkMacSystemFont, system-ui, sans-serif; background: #f0f4f8; display: flex; justify-content: center; padding: 0; }
  .chat { max-width: 600px; width: 100%; background: white; display: flex; flex-direction: column; height: 100dvh; }
  .header { background: #1a73e8; color: white; padding: 16px 20px; text-align: center; flex-shrink: 0; }
  .header h1 { font-size: 18px; margin-bottom: 2px; }
  .header p { font-size: 13px; opacity: .8; }
  .messages { flex: 1; overflow-y: auto; padding: 12px 16px; background: #f8fafc; -webkit-overflow-scrolling: touch; }
  .msg { margin-bottom: 10px; display: flex; }
  .msg.bot { justify-content: flex-start; }
  .msg.user { justify-content: flex-end; }
  .msg .bubble { max-width: 85%; padding: 10px 14px; border-radius: 12px; font-size: 15px; line-height: 1.5; white-space: pre-wrap; word-break: break-word; }
  .msg.bot .bubble { background: white; border: 1px solid #e2e8f0; border-bottom-left-radius: 4px; color: #1a202c; }
  .msg.user .bubble { background: #1a73e8; color: white; border-bottom-right-radius: 4px; }
  .input-area { display: flex; border-top: 1px solid #e2e8f0; flex-shrink: 0; }
  .input-area input { flex: 1; border: none; padding: 14px 16px; font-size: 16px; outline: none; -webkit-appearance: none; }
  .input-area button { background: #1a73e8; color: white; border: none; padding: 14px 20px; font-size: 15px; font-weight: 600; cursor: pointer; -webkit-appearance: none; }
  .input-area button:disabled { opacity: .5; }
  #status { color: #94a3b8; font-size: 13px; padding: 4px 16px; min-height: 22px; flex-shrink: 0; }
</style>
</head>
<body>
<div class="chat">
    <div class="header">
      <h1>UNIDOLOR</h1>
      <p>ChatBot de prueba</p>
      <p style="font-size:12px;opacity:.7;margin-top:4px"><a href="/prompt" style="color:#fff;text-decoration:underline">Prompt</a> &middot; <a href="/solicitud" style="color:#fff;text-decoration:underline">Formulario</a> &middot; <a href="/admin" style="color:#fff;text-decoration:underline">Solicitudes</a> &middot; <a href="/debug" style="color:#fff;text-decoration:underline">Debug</a></p>
    </div>
  <div class="messages" id="messages">
    <div class="msg bot"><div class="bubble">Hola! Soy el asistente de UNIDOLOR. Puede consultarme sobre servicios, precios o agendar una cita.</div></div>
  </div>
  <div id="status" class="typing"></div>
  <form class="input-area" id="form" action="#">
    <input type="text" id="input" placeholder="Escriba su mensaje..." autofocus>
    <button id="send" type="submit">Enviar</button>
  </form>
</div>
<script>
(function() {
  const messages = document.getElementById('messages');
  const input = document.getElementById('input');
  const sendBtn = document.getElementById('send');
  const status = document.getElementById('status');
  const form = document.getElementById('form');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    send();
  });

  function send() {
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    addMsg(text, 'user');
    sendBtn.disabled = true;
    status.textContent = 'UNIDOLOR esta escribiendo...';
    fetch('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text })
    }).then(function(r) { return r.json(); }).then(function(data) {
      status.textContent = '';
      addMsg(data.reply, 'bot');
      sendBtn.disabled = false;
      input.focus();
    }).catch(function() {
      status.textContent = 'Error de conexion';
      sendBtn.disabled = false;
      input.focus();
    });
  }

  function addMsg(text, role) {
    var div = document.createElement('div');
    div.className = 'msg ' + role;
    div.innerHTML = '<div class="bubble">' + escHtml(text) + '</div>';
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function escHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\\n/g,'<br>');
  }
})();
</script>
</body>
</html>`;
  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }
  });
}

const webhookLog = [];
function logWebhook(data) {
  webhookLog.unshift({ time: new Date().toISOString(), data });
  if (webhookLog.length > 10) webhookLog.pop();
}

async function servePromptEditor(env) {
  const promptText = await getPromptText(env.SEGUIMIENTO);
  const isCustom = promptText !== DEFAULT_PROMPT;
  const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Editor de Prompt - UNIDOLOR</title><style>
body{font-family:-apple-system,sans-serif;max-width:900px;margin:0 auto;padding:20px;color:#333}
h1{color:#1a73e8}
textarea{width:100%;height:400px;font-family:monospace;font-size:13px;padding:10px;border:1px solid #ddd;border-radius:6px}
.info{background:#e8f4fd;padding:12px 16px;border-radius:6px;margin:12px 0;font-size:14px}
.actions{display:flex;gap:10px;margin:12px 0}
.btn{background:#1a73e8;color:#fff;border:none;padding:10px 20px;border-radius:6px;cursor:pointer;font-size:14px}
.btn:hover{background:#1557b0}
.btn-reset{background:#dc3545}
.btn-reset:hover{background:#b02a37}
#status{margin-top:10px;font-size:14px}
</style></head>
<body>
<h1>Editor de Prompt</h1>
<div class="info">${isCustom ? '⚠️ Usando prompt personalizado (guardado en KV)' : '✅ Usando prompt por defecto (desde código)'}</div>
<form id="form">
<textarea id="prompt">${escapeHtml(promptText)}</textarea>
<div class="actions">
<button type="submit" class="btn">Guardar Prompt</button>
<button type="button" class="btn btn-reset" onclick="resetPrompt()">Restaurar Por Defecto</button>
</div>
</form>
<pre id="status"></pre>
<script>
document.getElementById('form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const text = document.getElementById('prompt').value;
  const status = document.getElementById('status');
  status.textContent = 'Guardando...';
  try {
    const r = await fetch('/prompt', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({prompt:text}) });
    const d = await r.json();
    status.textContent = d.ok ? '✅ Guardado correctamente' : '❌ Error: ' + d.error;
  } catch(e) { status.textContent = '❌ Error de conexión'; }
});
async function resetPrompt() {
  if (!confirm('¿Restaurar el prompt por defecto?')) return;
  const status = document.getElementById('status');
  status.textContent = 'Restaurando...';
  try {
    const r = await fetch('/prompt', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({reset:true}) });
    const d = await r.json();
    document.getElementById('prompt').value = d.default;
    status.textContent = '✅ Restaurado al prompt por defecto';
  } catch(e) { status.textContent = '❌ Error de conexión'; }
}
</script>
</body></html>`;
  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }
  });
}

function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function handlePromptUpdate(request, env) {
  try {
    const { prompt, reset } = await request.json();
    if (reset) {
      await setPromptText(env.SEGUIMIENTO, DEFAULT_PROMPT);
      return new Response(JSON.stringify({ ok: true, default: DEFAULT_PROMPT }), {
        status: 200, headers: { 'Content-Type': 'application/json' }
      });
    }
    if (!prompt || !prompt.trim()) {
      return new Response(JSON.stringify({ ok: false, error: 'Prompt vacío' }), {
        status: 200, headers: { 'Content-Type': 'application/json' }
      });
    }
    await setPromptText(env.SEGUIMIENTO, prompt.trim());
    return new Response(JSON.stringify({ ok: true }), {
      status: 200, headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: err.message }), {
      status: 200, headers: { 'Content-Type': 'application/json' }
    });
  }
}

function serveDebug(env) {
  const lines = [
    'DEBUG - Unidolor Bot',
    '---',
    `META_PHONE_NUMBER_ID: ${env.META_PHONE_NUMBER_ID || '❌ no configurado'}`,
    `META_ACCESS_TOKEN: ${env.META_ACCESS_TOKEN ? '✅ configurado (' + env.META_ACCESS_TOKEN.substring(0, 10) + '...)' : '❌ no configurado'}`,
    `META_APP_SECRET: ${env.META_APP_SECRET ? '✅ configurado' : '❌ no configurado'}`,
    `META_WEBHOOK_TOKEN: ${env.META_WEBHOOK_TOKEN ? '✅ configurado' : '❌ no configurado'}`,
    `GEMINI_API_KEY: ${env.GEMINI_API_KEY ? '✅ configurado' : '❌ no configurado'}`,
    `ESCALATION_PHONE_NUMBER: ${!env.ESCALATION_PHONE_NUMBER || env.ESCALATION_PHONE_NUMBER === '8095550100' ? '❌ deshabilitado' : '✅ configurado'}`,
    `SEGUIMIENTO KV: ${env.SEGUIMIENTO ? '✅ configurado' : '❌ no configurado'}`,
    `TEST_MODE: ${env.TEST_MODE ? '✅ ACTIVADO (sin Gemini)' : '❌ desactivado (usa Gemini)'}`,
    `Prompt: ${env.SEGUIMIENTO ? '✅ editable en /prompt' : '❌ no editable (sin KV)'}`,
    '---',
    'Últimos webhooks recibidos:',
  ];
  if (webhookLog.length === 0) {
    lines.push('  (ninguno)');
  } else {
    for (const log of webhookLog) {
      lines.push(`  ${log.time} - ${log.data}`);
    }
  }
  lines.push('---');
  lines.push(`Bot respondió: ${env.TEST_MODE ? '✅ (modo prueba, sin Gemini)' : '✅ (vía /chat funciona)'}`);
  lines.push('---');
  lines.push(`Links: /prompt (editor de prompt) | /chat (API) | /reset (borrar conversaciones) | /conversations (conversaciones) | /admin (solicitudes) | /api/forms (JSON) | /solicitud (formulario web)`);
  return new Response(lines.join('\n'), {
    status: 200,
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' }
  });
}

async function serveReset(env) {
  if (!env.SEGUIMIENTO) {
    return new Response('KV no configurado', { status: 200 });
  }
  try {
    const list = await env.SEGUIMIENTO.list();
    let deleted = 0;
    for (const key of list.keys) {
      if (key.name.startsWith('msgh:') || key.name.startsWith('state:conv:') || key.name.startsWith('dedup:') || key.name.startsWith('cache:') || key.name.startsWith('form:') || key.name.startsWith('fu_')) {
        await env.SEGUIMIENTO.delete(key.name);
        deleted++;
      }
    }
    return new Response(`✅ ${deleted} keys de conversación eliminadas`, {
      status: 200, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' }
    });
  } catch (err) {
    return new Response('Error: ' + err.message, {
      status: 200, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' }
    });
  }
}

function servePrivacyPolicy() {
  const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Política de Privacidad - Unidolor Bot</title><style>body{font-family:-apple-system,sans-serif;max-width:700px;margin:0 auto;padding:20px;line-height:1.6;color:#333}h1{color:#1a73e8}</style></head>
<body>
<h1>Política de Privacidad</h1>
<p><strong>Unidolor Bot</strong> (en adelante, "el Bot") es un asistente automatizado de WhatsApp para Unidolor SRL, servicio de atención médica a domicilio en República Dominicana.</p>
<h2>Datos que recopilamos</h2>
<p>El Bot recopila y almacena temporalmente:</p>
<ul>
<li>Número de teléfono del usuario</li>
<li>Mensajes enviados durante la conversación</li>
<li>Datos del formulario de solicitud de servicio (nombre, dirección, servicio solicitado, información del paciente)</li>
</ul>
<h2>Uso de los datos</h2>
<p>Los datos se utilizan exclusivamente para:</p>
<ul>
<li>Procesar solicitudes de servicio</li>
<li>Coordinar citas médicas a domicilio</li>
<li>Dar seguimiento post-servicio</li>
<li>Mejorar la calidad del servicio</li>
</ul>
<h2>Almacenamiento</h2>
<p>Los datos se almacenan en los servidores de Cloudflare (KV) y Google (Gemini AI) con estándares de seguridad industrial. Los datos de conversación se eliminan automáticamente después de 24 horas de inactividad. Los formularios de solicitud completados se conservan de forma permanente para la coordinación de servicios.</p>
<h2>Compartición de datos</h2>
<p>No compartimos datos personales con terceros. La información de los formularios se comparte internamente con el equipo de Unidolor para coordinar los servicios solicitados.</p>
<h2>Contacto</h2>
<p>Para consultas sobre privacidad: juanemilioabreu@gmail.com</p>
<p>Unidolor SRL<br>Ave. Gustavo Mejía Ricart No.54, Torre Solazar, Piso 3, Local 3F, Ensanche Naco<br>Santo Domingo, República Dominicana</p>
<p><em>Última actualización: julio 2026</em></p>
</body></html>`;
  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }
  });
}

async function handleChatAPI(request, env) {
  try {
    const contentType = request.headers.get('content-type') || '';
    const bodyText = await request.text();
    console.log('Chat API request:', { contentType, bodyLength: bodyText.length, bodyPreview: bodyText.substring(0, 100) });
    
    let message = '';
    try {
      const body = JSON.parse(bodyText);
      message = body.message || '';
    } catch (e) {
      console.error('JSON parse error:', e, 'body:', bodyText);
      return new Response(JSON.stringify({ reply: 'Error parsing JSON: ' + e.message + ', body: ' + bodyText, type: 'error' }), {
        status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
      });
    }
    
    if (!message || !message.trim()) {
      return new Response(JSON.stringify({ reply: 'Por favor escribe un mensaje.' }), {
        status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
      });
    }

    const bot = createBot(env);
    const result = await bot.handleMessage('chat-web', message.trim());

    return new Response(JSON.stringify({ reply: result.reply, type: result.type }), {
      status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
    });
  } catch (error) {
    console.error('Chat API error:', error, error.stack);
    return new Response(JSON.stringify({ reply: 'Ocurrió un error: ' + error.message, type: 'error' }), {
      status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
    });
  }
}

function handleWebhookVerification(request, env) {
  const url = new URL(request.url);
  const mode = url.searchParams.get('hub.mode');
  const token = url.searchParams.get('hub.verify_token');
  const challenge = url.searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === env.META_WEBHOOK_TOKEN) {
    console.log('Webhook verified successfully');
    return new Response(challenge, { status: 200 });
  }

  console.warn('Webhook verification failed:', { mode, token, expectedToken: env.META_WEBHOOK_TOKEN });
  return new Response('Verification failed', { status: 403 });
}

async function handleIncomingMessage(request, env) {
  try {
    // HMAC verification
    let payload;
    if (env.META_APP_SECRET) {
      const signature = request.headers.get('X-Hub-Signature-256');
      if (!signature) {
        console.error('Missing HMAC signature');
        return new Response('Forbidden', { status: 403 });
      }
      const raw = await request.text();
      const expected = 'sha256=' + await hmacSHA256(env.META_APP_SECRET, raw);
      if (signature !== expected) {
        console.error('Invalid HMAC signature');
        return new Response('Forbidden', { status: 403 });
      }
      payload = JSON.parse(raw);
    } else {
      payload = await request.json();
    }
    const entry = payload?.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;

    if (!value) {
      return new Response('OK', { status: 200 });
    }

    const messages = value.messages;
    if (!messages || messages.length === 0) {
      return new Response('OK', { status: 200 });
    }

    logWebhook(`Webhook: ${messages.length} mensaje(s) de ${messages[0].from || 'desconocido'}`);

    const bot = createBot(env);
    const kv = env.SEGUIMIENTO;

    for (const msg of messages) {
      const from = msg.from;
      const msgId = msg.id;

      // Deduplication
      if (await isDuplicate(msgId, kv)) {
        console.log(`Duplicate message skipped: ${msgId}`);
        continue;
      }

      // Rate limit
      if (!checkRateLimit(from)) {
        console.warn(`Rate limit exceeded for ${from}`);
        sendWhatsAppMessage(env, from, 'Está enviando mensajes muy rápido. Por favor espere un momento y vuelva a escribir.').catch(() => {});
        continue;
      }

      if (msg.type === 'text') {
        const text = msg.text?.body?.trim();
        if (!text) continue;

        logWebhook(`Msg de ${from}: "${text.substring(0, 60)}"`);
        await logMessage(env, from, 'user', text);
        const result = await bot.handleMessage(from, text);

        if (result.reply) {
          if (result.type !== 'cache' && result.type !== 'test') {
            await typingDelay();
          }
          await sendWhatsAppMessage(env, from, result.reply);
        }

        // Update conversation name if extracted from chat
        if (result.extractedName) {
          await updateConvName(env, from, result.extractedName);
        }

        if (result.requiresEscalation && result.summary) {
          const summary = formatEscalation(result.summary);
          await sendEscalation(env, summary);
          await saveFormData(env, from, result.summary);
          try {
            const info = JSON.parse(result.summary);
            const formData = info.formData ? JSON.parse(info.formData) : info;
            const name = formData.nombre || formData.paciente || '';
            const service = formData.servicio || '';
            if (name) {
              await updateConvName(env, from, name);
            }
            if (name && service) {
              await saveFollowUp(env, from, name, service);
            }
            if (!esOrigenPrueba(from, env)) {
              const crmResult = await sendToCRM(env, { ...formData, telefono: formData.telefono || from });
              if (!crmResult.ok) {
                console.error('CRM sync failed in text msg escalation:', crmResult.error);
              }
            }
          } catch {}
        }
      } else if (msg.type === 'image' || msg.type === 'document') {
        const mediaId = msg.image?.id || msg.document?.id;
        const mimeType = msg.image?.mime_type || msg.document?.mime_type;

        if (mediaId && mimeType) {
          logWebhook(`Imagen/Documento de ${from}: ${mimeType} (${mediaId})`);
          await logMessage(env, from, 'user', `[imagen: ${mimeType}]`);

          const result = await bot.handleImage(from, mediaId, mimeType, env);

          if (result.reply) {
            if (result.type !== 'cache' && result.type !== 'test') {
              await typingDelay();
            }
            await sendWhatsAppMessage(env, from, result.reply);
          }

          if (result.requiresEscalation && result.summary) {
            const summary = formatEscalation(result.summary);
            await sendEscalation(env, summary);
            await saveFormData(env, from, result.summary);
            try {
              const info = JSON.parse(result.summary);
              const formData = info.formData ? JSON.parse(info.formData) : info;
              const name = formData.nombre || formData.paciente || '';
              const service = formData.servicio || '';
              if (name) {
                await updateConvName(env, from, name);
              }
              if (name && service) {
                await saveFollowUp(env, from, name, service);
              }
              if (!esOrigenPrueba(from, env)) {
                const crmResult = await sendToCRM(env, { ...formData, telefono: formData.telefono || from });
                if (!crmResult.ok) {
                  console.error('CRM sync failed in image msg escalation:', crmResult.error);
                }
              }
            } catch {}
          }
        } else {
          logWebhook(`Imagen/Documento sin mediaId o mimeType de ${from}`);
        }
      } else {
        logWebhook(`Tipo no manejado de ${from}: ${msg.type}`);
      }
    }

    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response('OK', { status: 200 });
  }
}

async function sendWhatsAppMessage(env, to, text) {
  const url = `https://graph.facebook.com/v22.0/${env.META_PHONE_NUMBER_ID}/messages`;

  const body = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'text',
    text: { preview_url: false, body: text },
  };

  try {
    const res = await fetchWithTimeout(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.META_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }, 10000);

    if (!res.ok) {
      const err = await res.text();
      console.error('WhatsApp API error:', res.status, err);
    }

    return res;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    throw error;
  }
}

function formatEscalation(summary) {
  try {
    const data = JSON.parse(summary);
    if (data.servicio || data.nombre) {
      let msg = `══════ NUEVA SOLICITUD ══════\nServicio: ${getFormServicioLabel(data.servicio) || data.servicio || ''}\nNombre: ${data.nombre || ''}\nTeléfono: ${data.telefono || ''}`;
      if (data.email) msg += `\nEmail: ${data.email}`;
      if (data.genero) msg += `\nSexo: ${data.genero}`;
      if (data.fecha_nacimiento) msg += `\nNacimiento: ${data.fecha_nacimiento}`;
      msg += `\nDirección: ${data.direccion || ''}`;
      if (data.sucursal) msg += `\nSucursal: ${data.sucursal}`;
      msg += `\nSeguro: ${data.seguro || ''}\nAfiliado: ${data.afiliado || ''}\nNotas: ${data.notas || ''}`;
      if (data.requisitos && typeof data.requisitos === 'object') {
        for (const [k, v] of Object.entries(data.requisitos)) {
          if (v && String(v).trim()) msg += `\n• ${k}: ${v}`;
        }
      }
      msg += `\n─────────────────────────\nUNIDOLOR`;
      return msg;
    }
    return `Escalación: ${data.escalation || summary}`;
  } catch {
    return summary;
  }
}

async function sendEscalation(env, summary) {
  const nums = [
    env.ESCALATION_PHONE_NUMBER,
    env.ESCALATION_PHONE_NUMBER_2
  ].filter(n => n && n !== '8095550100');
  
  if (nums.length === 0) {
    console.log('Escalation disabled. Summary:', summary);
    return;
  }

  const text = `🔔 *Escalación - Chatbot Unidolor*\n\n${summary}`;
  for (const num of nums) {
    await sendWhatsAppMessage(env, num, text);
  }
}

async function saveFormData(env, from, summary) {
  if (!env.SEGUIMIENTO) return;
  try {
    const raw = JSON.parse(summary);
    const form = raw.formData && typeof raw.formData === 'object' ? raw.formData
      : raw.formData && typeof raw.formData === 'string' ? JSON.parse(raw.formData)
      : raw;
    const data = {
      phone: from,
      nombre: form.nombre || form.paciente || '',
      first_name: form.first_name || '',
      last_name: form.last_name || '',
      servicio: form.servicio || '',
      direccion: form.direccion || '',
      seguro: form.seguro || '',
      afiliado: form.afiliado || '',
      email: form.email || '',
      fecha_nacimiento: form.fecha_nacimiento || '',
      genero: form.genero || '',
      sucursal: form.sucursal || '',
      notas: form.notas || '',
      telefono: form.telefono || from,
      paciente: form.paciente || '',
      created: new Date().toISOString()
    };
    if (data.nombre || data.servicio) {
      // Use consistent key per phone to avoid duplicates, keep latest
      const key = `form:latest:${from}`;
      await env.SEGUIMIENTO.put(key, JSON.stringify(data));
      // Also keep timestamped copy for history
      const histKey = `form:${Date.now()}:${from}`;
      await env.SEGUIMIENTO.put(histKey, JSON.stringify(data));
    }
  } catch {}
}

async function updateConvName(env, phone, name) {
  if (!env.SEGUIMIENTO || !name || name === '(solicitado)') return;
  try {
    const key = `conv:${phone}`;
    const existing = await env.SEGUIMIENTO.get(key, 'json');
    // Always update if we have a valid name (not the phone number or garbage)
    const isGarbage = !name || name === '(solicitado)' || /^\d/.test(name) || name.length < 3;
    if (!isGarbage) {
      if (existing) {
        existing.name = name;
        await env.SEGUIMIENTO.put(key, JSON.stringify(existing), { expirationTtl: 604800 });
      } else {
        await env.SEGUIMIENTO.put(key, JSON.stringify({ phone, name, messages: [], messageCount: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }), { expirationTtl: 604800 });
      }
    }
  } catch (err) {
    console.error('Update conv name error:', err);
  }
}

async function reprocessConvNames(env) {
  if (!env.SEGUIMIENTO) return { processed: 0 };
  try {
    const list = await env.SEGUIMIENTO.list({ prefix: 'conv:' });
    let processed = 0;
    for (const key of list.keys) {
      const data = await env.SEGUIMIENTO.get(key.name, 'json');
      if (!data || !data.messages || !data.messages.length) continue;
      
      const userMessages = data.messages.filter(m => m.role === 'user').map(m => m.content);
      if (userMessages.length === 0) continue;
      
      // Use the same name detection logic inline
      let detectedName = null;
      for (const msg of userMessages) {
        if (!msg) continue;
        const t = msg.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        
        // Pattern: "Le habla la Sra Magaly Díaz", "Y quien le habla su esposa Sra Magaly Díaz"
        const spoken = msg.match(/(?:le\s+habla|y\s+quien\s+le\s+habla|es|soy)\s+(?:la\s+)?(?:su\s+(?:esposa|esposo)\s+)?(?:sra?\.?|sr?\.?|don|doña)\s+([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)?(?:\s|$|,|\.|;)/i);
        if (spoken) {
          detectedName = spoken[1];
          break;
        }
        // Pattern 2: Name followed by phone - "Yanely Martinez Nuñez. 8096027571", "Sterlin Feliz, 8097033363", "Magaly Díaz 809-7080241"
        if (!detectedName) {
          const namePhone = msg.match(/^([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)?\s*[.,\n]?\s*\d/);
          if (namePhone) {
            detectedName = namePhone[1];
            break;
          }
        }
        // Pattern 3: "Soy Yanely", "Mi nombre es Juan", "Me llamo Carla"
        if (!detectedName) {
          const intro = msg.match(/(?:soy|me\s+llamo|mi\s+nombre\s+es|llámame|me dicen)\s+([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)/i);
          if (intro) {
            detectedName = intro[1];
            break;
          }
        }
        // Pattern 4: "Hola, me llamo Carla Reyes"
        if (!detectedName) {
          const greetingIntro = msg.match(/(?:hola|buenos?\s+d[ií]as|buenas\s+tardes|buenas\s+noches)[\s,;]*(?:me\s+llamo|mi\s+nombre\s+es|soy)\s+([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)/i);
          if (greetingIntro) {
            detectedName = greetingIntro[1];
            break;
          }
        }
        // Pattern 5: Message starts with capitalized name (2-3 words) - "Yanely Martinez Nuñez", "Sterlin Feliz"
        if (!detectedName) {
          const startName = msg.match(/^([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)?(?:\s|$|,|\.|;|\n)/);
          if (startName) {
            detectedName = startName[1];
            break;
          }
        }
      }
      
      if (detectedName) {
        data.name = detectedName;
        await env.SEGUIMIENTO.put(key.name, JSON.stringify(data), { expirationTtl: 604800 });
        processed++;
        console.log(`Fixed name for ${data.phone}: ${detectedName}`);
      }
    }
    return { processed };
  } catch (err) {
    console.error('Reprocess names error:', err);
    return { error: err.message };
  }
}

async function logMessage(env, phone, role, content) {
  if (!env.SEGUIMIENTO) return;
  try {
    const key = `conv:${phone}`;
    const existing = await env.SEGUIMIENTO.get(key, 'json');
    const entry = existing || { phone, messages: [], createdAt: new Date().toISOString() };
    entry.messages.push({ role, content, timestamp: new Date().toISOString() });
    entry.messageCount = entry.messages.length;
    entry.updatedAt = new Date().toISOString();
    if (entry.messages.length > 100) entry.messages = entry.messages.slice(-100);
    await env.SEGUIMIENTO.put(key, JSON.stringify(entry), { expirationTtl: 604800 });
  } catch (err) {
    console.error('Log message error:', err);
  }
}

function serveForm(url) {
  const phone = url.searchParams.get('phone') || '';
  let servicio = url.searchParams.get('servicio') || '';
  if (getFormServicioValue(servicio)) servicio = getFormServicioValue(servicio);
  const servOptions = [
    ['consulta', 'Consulta médica a domicilio'],
    ['rayos-x', 'Rayos X a domicilio'],
    ['sonografia', 'Sonografía / Eco'],
    ['doppler', 'Doppler / Holter / MAPA'],
    ['enfermeria', 'Enfermería a domicilio'],
    ['terapia', 'Terapia física'],
    ['laboratorio', 'Laboratorio clínico'],
    ['transfusion', 'Transfusiones (Hemohogar)'],
    ['curacion', 'Curaciones / Nebulizaciones'],
    ['manejo-dolor', 'Manejo del dolor / Bomba intratecal'],
    ['cuidados-paliativos', 'Cuidados paliativos'],
    ['pie-diabetico', 'Cirugía de pie diabético'],
    ['otro', 'Otro'],
  ].map(([value, label]) => `<option value="${value}"${servicio === value ? ' selected' : ''}>${label}</option>`).join('');
  const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no,viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="theme-color" content="#0f6b3e">
<title>Solicitar Servicio - UNIDOLOR</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent}
body{font-family:-apple-system,BlinkMacSystemFont,system-ui,sans-serif;background:#f5f7fa;color:#1a202c;min-height:100vh;min-height:100dvh;display:flex;flex-direction:column;padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom)}
.top{background:#fff;padding:18px 20px calc(18px + env(safe-area-inset-top));text-align:center;box-shadow:0 1px 3px rgba(0,0,0,.06)}
.top h1{font-size:20px;color:#0f6b3e;margin-bottom:2px;letter-spacing:-.3px}
.top p{font-size:14px;color:#64748b}
.container{flex:1;width:100%;max-width:480px;margin:0 auto;padding:20px 16px 24px}
.form-group{margin-bottom:18px}
label{display:block;font-size:15px;font-weight:600;color:#1e293b;margin-bottom:6px}
label .req{color:#dc2626}
input,select,textarea{width:100%;padding:14px 16px;font-size:16px;border:2px solid #e2e8f0;border-radius:12px;outline:none;transition:border-color .2s,box-shadow .2s;background:#fff;font-family:inherit;color:#1a202c;-webkit-appearance:none;appearance:none}
input::placeholder,textarea::placeholder{color:#94a3b8}
input:focus,select:focus,textarea:focus{border-color:#0f6b3e;box-shadow:0 0 0 4px rgba(15,107,62,.12)}
textarea{resize:vertical;min-height:88px;border-radius:12px}
select{background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E") no-repeat right 14px center;padding-right:44px}
input[type=date]{min-height:52px}
.btn{width:100%;padding:16px;font-size:17px;font-weight:600;border:none;border-radius:12px;cursor:pointer;transition:background .2s,transform .1s;color:#fff;background:#0f6b3e;-webkit-font-smoothing:antialiased}
.btn:active{transform:scale(.98)}
.btn:disabled{opacity:.5;cursor:not-allowed;transform:none}
.btn-secondary{background:#f1f5f9;color:#475569;margin-top:10px;font-size:15px;padding:14px}
.btn-secondary:active{background:#e2e8f0}
.status{margin-top:16px;padding:14px 16px;border-radius:12px;font-size:15px;display:none;text-align:center;line-height:1.4}
.status.success{display:block;background:#f0fdf4;color:#166534;border:1px solid #bbf7d0}
.status.error{display:block;background:#fef2f2;color:#991b1b;border:1px solid #fecaca}
.footer{text-align:center;font-size:13px;color:#94a3b8;padding:16px 20px calc(16px + env(safe-area-inset-bottom))}
.footer a{color:#0f6b3e;text-decoration:none;font-weight:500}
.hint{font-size:13px;color:#94a3b8;margin-top:6px;padding-left:4px}
.requisitos-box{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:14px 16px;margin-bottom:18px}
.requisitos-box h3{font-size:15px;color:#166534;margin-bottom:12px}
.requisitos-box .form-group{margin-bottom:12px}
.requisitos-box .form-group:last-child{margin-bottom:0}
.row{display:flex;gap:12px}
.row .form-group{flex:1}
.success-screen{text-align:center;padding:48px 0 24px}
.success-screen .icon{width:72px;height:72px;border-radius:50%;background:#f0fdf4;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:36px}
.success-screen h2{font-size:22px;color:#166534;margin-bottom:8px}
.success-screen p{color:#475569;font-size:16px;line-height:1.6}
@media(max-width:420px){.row{flex-direction:column;gap:0}.container{padding:16px 14px 20px}input,select,textarea{padding:13px 14px;font-size:15px}.btn{padding:15px;font-size:16px}}
</style>
</head>
<body>
<div class="top">
  <h1>UNIDOLOR</h1>
  <p>Solicitud de servicio a domicilio</p>
</div>
<div class="container">
  <form id="form" novalidate>
    <div class="form-group">
      <label>Nombre completo <span class="req">*</span></label>
      <input type="text" id="nombre" required placeholder="María García">
    </div>
    <div class="form-group">
      <label>Cédula <span class="req">*</span></label>
      <input type="text" id="cedula" required placeholder="000-0000000-0" inputmode="numeric">
    </div>
    <div class="form-group">
      <label>Teléfono <span class="req">*</span></label>
      <input type="tel" id="telefono" required placeholder="809-555-0100" value="${phone ? escapeHtml(phone) : ''}" inputmode="numeric">
      <div class="hint">Incluya código de área</div>
    </div>
    <div class="form-group">
      <label>Servicio que necesita <span class="req">*</span></label>
      <select id="servicio" required>
        <option value="">Seleccione...</option>
        ${servOptions}
      </select>
    </div>
    <div id="requisitos"></div>
    <div class="form-group">
      <label>Dirección <span class="req">*</span></label>
      <input type="text" id="direccion" required placeholder="Calle, sector, ciudad">
    </div>
    <div class="row">
      <div class="form-group">
        <label>Seguro / ARS</label>
        <input type="text" id="seguro" placeholder="Humano, MAPFRE...">
      </div>
      <div class="form-group">
        <label>No. afiliado</label>
        <input type="text" id="afiliado" placeholder="Número">
      </div>
    </div>
    <div class="row">
      <div class="form-group">
        <label>Correo electrónico</label>
        <input type="email" id="email" placeholder="ejemplo@correo.com" inputmode="email">
        <div class="hint">Opcional</div>
      </div>
      <div class="form-group">
        <label>Fecha de nacimiento</label>
        <input type="date" id="fecha_nacimiento">
      </div>
    </div>
    <div class="row">
      <div class="form-group">
        <label>Sexo</label>
        <select id="genero">
          <option value="">No especifica</option>
          <option value="Femenino">Femenino</option>
          <option value="Masculino">Masculino</option>
        </select>
      </div>
      <div class="form-group">
        <label>Sucursal</label>
        <select id="sucursal">
          <option value="">Sin preferencia</option>
          <option value="Unidolor Santo Domingo">Unidolor Santo Domingo</option>
          <option value="Unidolor Terrenas">Unidolor Terrenas</option>
          <option value="Mejorate en Casa">Mejórate en Casa</option>
        </select>
      </div>
    </div>
    <div class="form-group">
      <label>Notas</label>
      <textarea id="notas" placeholder="Detalles útiles para la cotización..."></textarea>
    </div>
    <button type="submit" class="btn" id="submitBtn">Enviar solicitud</button>
    <button type="button" class="btn btn-secondary" onclick="window.location.href='/'">Volver al chat</button>
  </form>
  <div id="status" class="status"></div>
</div>
<div class="footer">
  <a href="/privacy">Política de privacidad</a> &middot; UNIDOLOR SRL
</div>
<script>
(function(){
  var REQ = ${JSON.stringify(FORM_REQUISITOS)};
  var form = document.getElementById('form');
  var status = document.getElementById('status');
  var btn = document.getElementById('submitBtn');
  var servSelect = document.getElementById('servicio');
  var reqContainer = document.getElementById('requisitos');

  function fieldHtml(campo, idPref) {
    var id = idPref + '_' + campo.id;
    if (campo.tipo === 'select') {
      var opts = '<option value="">Seleccione...</option>' + campo.opciones.map(function(o) {
        return '<option value="' + o + '">' + o + '</option>';
      }).join('');
      return '<div class="form-group"><label>' + campo.label + '</label><select id="' + id + '">' + opts + '</select></div>';
    }
    return '<div class="form-group"><label>' + campo.label + '</label><input type="text" id="' + id + '" placeholder="' + (campo.placeholder || '') + '"></div>';
  }

  function renderRequisitos() {
    var req = REQ[servSelect.value];
    if (!req) { reqContainer.innerHTML = ''; return; }
    var html = '<div class="requisitos-box">';
    html += '<h3>' + req.titulo + '</h3>';
    if (req.requiere_orden) {
      html += '<div class="form-group"><label>¿Tiene indicación u orden médica? <span class="req">*</span></label>'
        + '<select id="req_orden"><option value="">Seleccione...</option>'
        + '<option value="Sí">Sí</option><option value="No">No</option><option value="No sé">No sé</option>'
        + '</select><div class="hint">Para este servicio es necesaria la orden médica. Puede enviar la foto de la orden por WhatsApp al 809-636-3656.</div></div>';
      html += '<div class="form-group"><label>Detalles de la orden (opcional)</label>'
        + '<textarea id="req_detalle_orden" placeholder="Número de orden, doctor que la emite..."></textarea></div>';
    }
    for (var i = 0; i < req.campos.length; i++) {
      html += fieldHtml(req.campos[i], 'req');
    }
    html += '</div>';
    reqContainer.innerHTML = html;
  }

  servSelect.addEventListener('change', renderRequisitos);
  renderRequisitos();

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    btn.disabled = true;
    btn.textContent = 'Enviando...';
    status.className = 'status';
    status.textContent = '';
    status.style.display = 'none';

    var data = {
      nombre: document.getElementById('nombre').value.trim(),
      cedula: document.getElementById('cedula').value.trim(),
      telefono: document.getElementById('telefono').value.trim(),
      servicio: servSelect.value,
      direccion: document.getElementById('direccion').value.trim(),
      seguro: document.getElementById('seguro').value.trim(),
      afiliado: document.getElementById('afiliado').value.trim(),
      email: document.getElementById('email').value.trim(),
      fecha_nacimiento: document.getElementById('fecha_nacimiento').value,
      genero: document.getElementById('genero').value,
      sucursal: document.getElementById('sucursal').value,
      notas: document.getElementById('notas').value.trim()
    };
    var req = REQ[servSelect.value];
    if (req) {
      data.requisitos = {};
      if (req.requiere_orden) {
        data.requisitos['tiene_orden_medica'] = document.getElementById('req_orden').value;
        var detalleOrden = document.getElementById('req_detalle_orden');
        if (detalleOrden && detalleOrden.value.trim()) data.requisitos['detalle_orden'] = detalleOrden.value.trim();
      }
      for (var r = 0; r < req.campos.length; r++) {
        var el = document.getElementById('req_' + req.campos[r].id);
        if (el && el.value.trim()) data.requisitos[req.campos[r].label] = el.value.trim();
      }
    }

    fetch('/api/submit-form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(function(r) { return r.json(); }).then(function(res) {
      if (res.ok) {
        form.innerHTML = '<div class="success-screen"><div class="icon">✓</div><h2>Solicitud recibida</h2><p>Gracias, ' + escHtml(data.nombre) + '.<br>Hemos recibido su solicitud de <strong>' + escHtml(document.getElementById('servicio').options[document.getElementById('servicio').selectedIndex].text) + '</strong>.</p><p style="margin-top:16px">Un asesor se comunicará pronto con usted.</p><button class="btn" style="margin-top:24px" onclick="window.location.href=\'/\'">Volver al inicio</button></div>';
      } else {
        status.className = 'status error';
        status.textContent = 'Error: ' + (res.error || 'No se pudo enviar. Intente de nuevo.');
        status.style.display = 'block';
        btn.disabled = false;
        btn.textContent = 'Enviar solicitud';
      }
    }).catch(function() {
      status.className = 'status error';
      status.textContent = 'Error de conexión. Verifique su internet e intente de nuevo.';
      status.style.display = 'block';
      btn.disabled = false;
      btn.textContent = 'Enviar solicitud';
    });
  });

  function escHtml(s) {
    if (!s) return '';
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
})();
</script>
</body>
</html>`;
  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }
  });
}

async function handleFormSubmit(request, env) {
  try {
    const data = await request.json();
    const { nombre, cedula, telefono, servicio, direccion, seguro, afiliado, email, fecha_nacimiento, genero, sucursal, notas, requisitos } = data;

    const errors = [];
    if (!nombre || !nombre.trim()) errors.push('nombre');
    if (!servicio) errors.push('servicio');
    if (!direccion || !direccion.trim()) errors.push('dirección');
    if (!telefono || !telefono.trim()) errors.push('teléfono');

    if (errors.length > 0) {
      return new Response(JSON.stringify({ ok: false, error: 'Campos requeridos: ' + errors.join(', ') }), {
        status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
      });
    }

    const nameParts = nombre.trim().split(' ');
    const first_name = nameParts[0] || '';
    const last_name = nameParts.slice(1).join(' ') || '';

    const formPayload = {
      nombre: nombre.trim(),
      first_name,
      last_name,
      cedula: (cedula || '').trim(),
      telefono: telefono.trim(),
      servicio: servicio,
      direccion: direccion.trim(),
      seguro: (seguro || '').trim(),
      afiliado: (afiliado || '').trim(),
      email: (email || '').trim(),
      fecha_nacimiento: fecha_nacimiento || '',
      genero: genero || '',
      sucursal: sucursal || '',
      notas: (notas || '').trim(),
      requisitos: requisitos && typeof requisitos === 'object' ? requisitos : {},
      paciente: nombre.trim(),
      phone: telefono.trim(),
      created: new Date().toISOString()
    };

    const nimboResult = { attempted: false };
    if (env.NIMBO_BASE_URL && env.NIMBO_ACCESS_TOKEN) {
      nimboResult.attempted = true;
      try {
        const search = await searchPatient(env, telefono.trim());
        if (search.ok && search.patients && search.patients.length > 0) {
          const existing = search.patients[0];
          nimboResult.person_id = existing.id || (existing.person && existing.person.id);
          nimboResult.person_name = existing.first_name || (existing.person && existing.person.first_name);
          nimboResult.existing = true;
        } else {
          const created = await createPatient(env, {
            first_name,
            last_name,
            telefono: telefono.trim(),
            email: email || undefined,
            fecha_nacimiento: fecha_nacimiento || undefined,
            genero: genero || undefined,
            notas: notas || undefined,
            cedula: cedula || undefined,
          });
          if (created.ok) {
            nimboResult.person_id = created.person_id;
            nimboResult.existing = false;
          } else {
            nimboResult.error = created.error;
          }
        }
        if (nimboResult.person_id) {
          const consult = await createConsultation(env, nimboResult.person_id, {
            servicio,
            cause: servicio,
            starts_at: new Date().toISOString(),
            account_id: '',
          });
          if (consult.ok) {
            nimboResult.consultation_id = consult.consultation_id;
          } else {
            nimboResult.consultationError = consult.error;
          }
        }
      } catch (err) {
        nimboResult.error = err.message;
      }
    }
    formPayload.nimbo = nimboResult;

    if (env.SEGUIMIENTO) {
      const key = `form:latest:${telefono.trim()}`;
      await env.SEGUIMIENTO.put(key, JSON.stringify(formPayload));
      // Also keep timestamped copy for history
      const histKey = `form:${Date.now()}:${telefono.trim()}`;
      await env.SEGUIMIENTO.put(histKey, JSON.stringify(formPayload));
    }

    const summary = JSON.stringify(formPayload);
    const escalationText = formatEscalation(summary);
    await sendEscalation(env, escalationText);

    if (nombre.trim() && servicio) {
      await saveFollowUp(env, telefono.trim(), nombre.trim(), servicio);
    }

    let crmResult;
    if (!esOrigenPrueba(telefono, env)) {
      crmResult = await sendToCRM(env, formPayload);
      if (!crmResult.ok) {
        console.error('CRM sync failed in handleFormSubmit:', crmResult.error);
      }
    } else {
      crmResult = { ok: true, skipped: 'test_origin' };
    }

    return new Response(JSON.stringify({ ok: true, nimbo: nimboResult.attempted ? { person_id: nimboResult.person_id, consultation_id: nimboResult.consultation_id, existing: nimboResult.existing, error: nimboResult.error } : null, crm: crmResult }), {
      status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: err.message }), {
      status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
    });
  }
}

async function fixConversationNames(env) {
  const result = await reprocessConvNames(env);
  return new Response(JSON.stringify(result), {
    status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  });
}

// Re-escribe las keys de conversación con codificación UTF-8 limpia para corregir
// mojibake (texto guardado con bytes Latin-1 que rompen los acentos).
async function fixEncoding(env) {
  if (!env.SEGUIMIENTO) {
    return new Response(JSON.stringify({ error: 'KV no configurado' }), {
      status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
    });
  }
  const kv = env.SEGUIMIENTO;
  const MAX_KEYS = 5000;
  const results = { conv: 0, msgh: 0, forms: 0, errors: [] };

  function fixString(str) {
    if (typeof str !== 'string' || !/[^\u0000-\u007F]/.test(str)) return str;
    // Si ya tiene caracteres latinos válidos (acentos normales), no tocar.
    if (/[áéíóúñÁÉÍÓÚÑ¿¡]/.test(str) && !/\uFFFD/.test(str)) return str;
    // Re-encode: bytes mal interpretados como Latin-1 -> UTF-8.
    try {
      const fixed = decodeURIComponent(escape(str));
      return fixed;
    } catch {
      return str;
    }
  }

  function fixObject(obj) {
    if (!obj || typeof obj !== 'object') return obj;
    for (const k of Object.keys(obj)) {
      if (typeof obj[k] === 'string') {
        obj[k] = fixString(obj[k]);
      } else if (Array.isArray(obj[k])) {
        obj[k] = obj[k].map((item) => (typeof item === 'string' ? fixString(item) : fixObject(item)));
      } else if (obj[k] && typeof obj[k] === 'object') {
        obj[k] = fixObject(obj[k]);
      }
    }
    return obj;
  }

  try {
    // Keys conv:*
    let cursor;
    do {
      const res = await kv.list({ prefix: 'conv:', limit: 1000, cursor });
      for (const key of res.keys) {
        const data = await kv.get(key.name, 'json');
        if (!data) continue;
        const fixed = fixObject(JSON.parse(JSON.stringify(data)));
        const original = JSON.stringify(data);
        const reencoded = JSON.stringify(fixed);
        if (original !== reencoded) {
          await kv.put(key.name, reencoded, { expirationTtl: 604800 });
          results.conv++;
        }
      }
      cursor = res.cursor;
      if (results.conv > MAX_KEYS) break;
    } while (cursor);

    // Keys msgh:*
    cursor = null;
    do {
      const res = await kv.list({ prefix: 'msgh:', limit: 1000, cursor });
      for (const key of res.keys) {
        const data = await kv.get(key.name, 'json');
        if (!data) continue;
        const fixed = fixObject(JSON.parse(JSON.stringify(data)));
        const original = JSON.stringify(data);
        const reencoded = JSON.stringify(fixed);
        if (original !== reencoded) {
          await kv.put(key.name, reencoded, { expirationTtl: 86400 });
          results.msgh++;
        }
      }
      cursor = res.cursor;
      if (results.msgh > MAX_KEYS) break;
    } while (cursor);

    // Keys form:*
    cursor = null;
    do {
      const res = await kv.list({ prefix: 'form:', limit: 1000, cursor });
      for (const key of res.keys) {
        const data = await kv.get(key.name, 'json');
        if (!data) continue;
        const fixed = fixObject(JSON.parse(JSON.stringify(data)));
        const original = JSON.stringify(data);
        const reencoded = JSON.stringify(fixed);
        if (original !== reencoded) {
          await kv.put(key.name, reencoded);
          results.forms++;
        }
      }
      cursor = res.cursor;
      if (results.forms > MAX_KEYS) break;
    } while (cursor);

    await kv.delete('cache:conv-list');
    return new Response(JSON.stringify(results), {
      status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message, ...results }), {
      status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
    });
  }
}

// Borra keys basura: conv: sin phone, conv:chat-web, y cache de lista.
async function cleanupKeys(env) {
  if (!env.SEGUIMIENTO) {
    return new Response(JSON.stringify({ error: 'KV no configurado' }), {
      status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
    });
  }
  const kv = env.SEGUIMIENTO;
  const results = { conv: 0, msgh: 0, cache: 0, errors: [] };

  try {
    let cursor;
    do {
      const res = await kv.list({ prefix: 'conv:', limit: 1000, cursor });
      for (const key of res.keys) {
        const data = await kv.get(key.name, 'json');
        if (!data) continue;
        const p = data.phone || '';
        if (!p || p === 'undefined' || p === 'chat-web') {
          await kv.delete(key.name);
          results.conv++;
          continue;
        }
      }
      cursor = res.cursor;
    } while (cursor);

    cursor = null;
    do {
      const res = await kv.list({ prefix: 'msgh:', limit: 1000, cursor });
      for (const key of res.keys) {
        const p = key.name.slice('msgh:'.length).split(':')[0];
        if (!p || p === 'undefined' || p === 'chat-web') {
          await kv.delete(key.name);
          results.msgh++;
        }
      }
      cursor = res.cursor;
    } while (cursor);

    cursor = null;
    do {
      const res = await kv.list({ prefix: 'cache:', limit: 1000, cursor });
      for (const key of res.keys) {
        await kv.delete(key.name);
        results.cache++;
      }
      cursor = res.cursor;
    } while (cursor);

    return new Response(JSON.stringify(results), {
      status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message, ...results }), {
      status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
    });
  }
}

function serveAdmin(env) {
  const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Solicitudes - UNIDOLOR</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,system-ui,sans-serif;background:#f0f4f8;color:#1a202c;padding:20px}
h1{color:#1a73e8;font-size:22px;margin-bottom:4px}
.sub{color:#64748b;font-size:14px;margin-bottom:20px}
table{width:100%;border-collapse:collapse;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.08)}
th{background:#1a73e8;color:#fff;padding:10px 12px;font-size:13px;text-align:left;white-space:nowrap}
td{padding:10px 12px;font-size:14px;border-bottom:1px solid #e2e8f0;vertical-align:top}
tr:hover td{background:#f8fafc}
.empty{text-align:center;padding:40px;color:#94a3b8;font-size:15px}
.fecha{white-space:nowrap;font-size:13px;color:#64748b}
.nav{display:flex;gap:12px;margin-bottom:16px;font-size:14px}
.nav a{color:#1a73e8;text-decoration:none}
.nav a:hover{text-decoration:underline}
.badge{display:inline-block;background:#e2e8f0;padding:2px 8px;border-radius:4px;font-size:12px;color:#475569}
@media(max-width:640px){table{font-size:13px}th,td{padding:8px 6px}}
</style>
</head>
<body>
<h1>Solicitudes</h1>
<p class="sub" id="sub">Cargando...</p>
<div class="nav"><a href="/">&larr; Chat</a> &middot; <a href="/debug">Debug</a> &middot; <a href="/api/forms">JSON</a></div>
<div style="overflow-x:auto"><table>
<thead><tr>
<th>Fecha</th><th>Nombre</th><th>Teléfono</th><th>Servicio</th><th>Dirección</th><th>Seguro</th><th>Afiliado</th><th>Requisitos</th>
</tr></thead>
<tbody id="tbody"></tbody>
</table></div>
<script>
function reqSummary(f){
  if(!f.requisitos) return '';
  var out=[];
  for(var k in f.requisitos){ if(f.requisitos[k] && String(f.requisitos[k]).trim()) out.push(k+': '+f.requisitos[k]); }
  return out.join(' · ');
}
fetch('/api/forms').then(r=>r.json()).then(forms=>{
  const tbody=document.getElementById('tbody');
  const sub=document.getElementById('sub');
  if(!forms.length){sub.textContent='No hay solicitudes';return}
  sub.textContent=forms.length+' solicitud'+(forms.length>1?'es':'');
  forms.forEach(f=>{
    const tr=document.createElement('tr');
    const d=new Date(f.created);
    const fecha=d.toLocaleDateString('es-DO',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'});
    tr.innerHTML='<td class="fecha">'+fecha+'</td><td>'+(f.nombre||'')+'</td><td>'+(f.phone||f.telefono||'')+'</td><td>'+(f.servicio||'')+'</td><td>'+(f.direccion||'')+'</td><td>'+(f.seguro||'')+'</td><td>'+(f.afiliado||'')+'</td><td>'+escHtml(reqSummary(f))+'</td>';
    tbody.appendChild(tr);
  });
}).catch(()=>document.getElementById('sub').textContent='Error al cargar');
function escHtml(s){ if(!s) return ''; return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
</script>
</body>
</html>`;
  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }
  });
}

async function serveFormsAPI(env) {
  if (!env.SEGUIMIENTO) {
    return new Response(JSON.stringify([]), {
      status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
    });
  }
  try {
    const list = await env.SEGUIMIENTO.list({ prefix: 'form:latest:' });
    const forms = [];
    for (const key of list.keys) {
      const data = await env.SEGUIMIENTO.get(key.name, 'json');
      if (data) forms.push(data);
    }
    forms.sort((a, b) => new Date(b.created) - new Date(a.created));
    return new Response(JSON.stringify(forms), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
    });
  }
}

async function sendFormsToPhone(env, url) {
  if (!env.SEGUIMIENTO) {
    return new Response(JSON.stringify({ error: 'KV not configured' }), {
      status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
    });
  }
  const targetPhone = url.searchParams.get('phone') || env.ESCALATION_PHONE_NUMBER;
  if (!targetPhone || targetPhone === '8095550100') {
    return new Response(JSON.stringify({ error: 'No target phone configured' }), {
      status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
    });
  }

  try {
    const list = await env.SEGUIMIENTO.list();
    const forms = [];
    for (const key of list.keys) {
      if (key.name.startsWith('form:')) {
        const data = await env.SEGUIMIENTO.get(key.name, 'json');
        if (data) forms.push(data);
      }
    }
    forms.sort((a, b) => new Date(b.created) - new Date(a.created));

    if (forms.length === 0) {
      return new Response(JSON.stringify({ sent: 0, message: 'No forms found' }), {
        status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
      });
    }

    const today = new Date().toISOString().split('T')[0];
    const todayForms = forms.filter(f => f.created?.startsWith(today));

    let msg = `📋 *Formularios del día (${todayForms.length} de ${forms.length} totales)*\n\n`;
    for (const f of todayForms) {
      const d = new Date(f.created);
      const fecha = d.toLocaleString('es-DO', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
      msg += `🕐 ${fecha}\n`;
      msg += `👤 ${f.nombre || f.paciente || 'N/A'}\n`;
      msg += `📞 ${f.telefono || f.phone || 'N/A'}\n`;
      msg += `🏥 ${getFormServicioLabel(f.servicio) || f.servicio || 'N/A'}\n`;
      msg += `📍 ${f.direccion || 'N/A'}\n`;
      if (f.seguro) msg += `🛡️ Seguro: ${f.seguro}${f.afiliado ? ` (${f.afiliado})` : ''}\n`;
      if (f.requisitos && Object.keys(f.requisitos).length) {
        msg += `📝 Requisitos:\n`;
        for (const [k, v] of Object.entries(f.requisitos)) {
          if (v && String(v).trim()) msg += `   • ${k}: ${v}\n`;
        }
      }
      if (f.notas) msg += `💬 ${f.notas}\n`;
      msg += `──────────────\n`;
    }

    await sendWhatsAppMessage(env, targetPhone, msg);

    return new Response(JSON.stringify({ sent: todayForms.length, total: forms.length, message: 'Enviado correctamente' }), {
      status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
    });
  } catch (err) {
    console.error('sendFormsToPhone error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
    });
  }
}

function serveConversations(env, url) {
  const phone = url.searchParams.get('phone') || '';
  const currentService = url.searchParams.get('service') || '';
  const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Conversaciones - UNIDOLOR</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,system-ui,sans-serif;background:#f0f4f8;color:#1a202c;padding:20px}
h1{color:#1a73e8;font-size:22px;margin-bottom:4px}
.sub{color:#64748b;font-size:14px;margin-bottom:16px}
.nav{display:flex;gap:12px;margin-bottom:16px;font-size:14px;flex-wrap:wrap}
.nav a{color:#1a73e8;text-decoration:none}
.nav a:hover{text-decoration:underline}
.filter-bar{display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;align-items:center}
.filter-bar select{padding:8px 12px;border:1px solid #cbd5e1;border-radius:6px;background:#fff;font-size:14px;color:#1a202c}
.filter-bar select:focus{outline:none;border-color:#1a73e8;box-shadow:0 0 0 2px rgba(26,115,232,.2)}
.conv-list{display:flex;flex-direction:column;gap:8px}
.conv-card{background:#fff;border-radius:8px;padding:14px 16px;box-shadow:0 1px 3px rgba(0,0,0,.06);cursor:pointer;transition:box-shadow .2s;text-decoration:none;display:block;color:inherit}
.conv-card:hover{box-shadow:0 2px 8px rgba(0,0,0,.1)}
.conv-card .phone{font-weight:600;font-size:15px;color:#1a202c}
.conv-card .service-tag{display:inline-block;background:#e0f2fe;color:#0369a1;padding:2px 8px;border-radius:4px;font-size:12px;margin-left:8px;font-weight:500}
.conv-card .meta{font-size:13px;color:#64748b;margin-top:4px}
.conv-card .preview{font-size:14px;color:#475569;margin-top:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.conv-card .badge{display:inline-block;background:#1a73e8;color:#fff;padding:1px 8px;border-radius:10px;font-size:12px;margin-left:8px}
.empty{text-align:center;padding:40px;color:#94a3b8;font-size:15px}

.chat-view{max-width:700px;margin:0 auto}
.chat-view .header-bar{display:flex;align-items:center;gap:12px;margin-bottom:16px}
.chat-view .header-bar a{color:#1a73e8;text-decoration:none;font-size:14px}
.chat-view .header-bar h2{font-size:18px;color:#1a202c}
.msg-row{display:flex;margin-bottom:10px}
.msg-row.user{justify-content:flex-end}
.msg-row.bot{justify-content:flex-start}
.msg-row .bubble{max-width:80%;padding:10px 14px;border-radius:12px;font-size:14px;line-height:1.5;white-space:pre-wrap;word-break:break-word}
.msg-row.user .bubble{background:#1a73e8;color:#fff;border-bottom-right-radius:4px}
.msg-row.bot .bubble{background:#fff;border:1px solid #e2e8f0;border-bottom-left-radius:4px;color:#1a202c}
.msg-row .time{font-size:11px;color:#94a3b8;margin-top:4px;text-align:${ph => ph === 'user' ? 'right' : 'left'}}
.msg-row.user .time{text-align:right}
.msg-row.bot .time{text-align:left}
</style>
</head>
<body>
${phone ? `<div class="chat-view"><div class="header-bar"><a href="/conversations">&larr; Volver</a><h2 id="convTitle">${phone}</h2></div><div id="msgs">Cargando...</div></div>` : `<h1>Conversaciones</h1><p class="sub" id="sub">Cargando...</p><div class="nav"><a href="/">&larr; Chat</a> &middot; <a href="/debug">Debug</a> &middot; <a href="/admin">Solicitudes</a></div>
<div class="filter-bar">
  <label style="font-size:14px;color:#475569">Filtrar por servicio:</label>
  <select id="serviceFilter" onchange="filterByService()">
    <option value="">Todos los servicios</option>
  </select>
</div>
<div class="conv-list" id="list">Cargando...</div>`}
<script>
${phone ? `
function loadConv(){
  fetch('/api/conversations?phone=${encodeURIComponent(phone)}').then(r=>r.json()).then(data=>{
    const div=document.getElementById('msgs');
    const title=document.getElementById('convTitle');
    if(!data||!data.messages||!data.messages.length){div.innerHTML='<div class="empty">No hay mensajes</div>';return}
    if(data.name) title.innerHTML=data.name+' <span style="color:#94a3b8;font-size:14px;font-weight:400">'+data.phone+'</span>';
    if(data.service) title.innerHTML+=' <span style="background:#e0f2fe;color:#0369a1;padding:1px 8px;border-radius:4px;font-size:12px;margin-left:8px">'+data.service+'</span>';
    div.innerHTML=data.messages.map(m=>{
      const role=m.role==='user'?'user':'bot';
      const label=role==='user'?(data.name||'${phone}'):'UNIDOLOR';
      const time=new Date(m.timestamp).toLocaleString('es-DO',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'});
      return '<div class="msg-row '+role+'"><div class="bubble"><strong>'+label+'</strong><br>'+m.content+'<div class="time">'+time+'</div></div></div>';
    }).join('');
    document.getElementById('statusDot')&&(document.getElementById('statusDot').textContent='●');
  }).catch(function(){});
}
loadConv();
setInterval(loadConv,3000);
` : `
function formatPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 12 && cleaned.startsWith('18')) {
      return '+1 (' + cleaned.substring(2,5) + ') ' + cleaned.substring(5,8) + '-' + cleaned.substring(8);
    }
    if (cleaned.length === 10) {
      return '(' + cleaned.substring(0,3) + ') ' + cleaned.substring(3,6) + '-' + cleaned.substring(6);
    }
    return phone;
  }
  
  function loadList(){
    fetch('/api/conversations').then(r=>r.json()).then(list=>{
      const sub=document.getElementById('sub');
      const div=document.getElementById('list');
      if(!list||!list.length){sub.textContent='No hay conversaciones';div.innerHTML='<div class="empty">No hay conversaciones recientes</div>';return}
      sub.textContent=list.length+' conversacion'+(list.length>1?'es':'')+' <span id="statusDot" style="color:#22c55e">●</span>';
      
      // Populate service filter dropdown
      const services = [...new Set(list.map(c => c.service).filter(Boolean))].sort();
      const select = document.getElementById('serviceFilter');
      services.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s;
        opt.textContent = s;
        if (s === '${currentService}') opt.selected = true;
        select.appendChild(opt);
      });
      
      div.innerHTML=list.map(c=>{
        const last=c.lastMessage||{};
        const pre=last.content?last.content.substring(0,80):'';
        const time=c.updatedAt?new Date(c.updatedAt).toLocaleString('es-DO',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}):'';
        const displayName = c.name ? c.name : formatPhone(c.phone);
        const serviceHtml = c.service ? '<span class="service-tag">'+c.service+'</span>' : '';
        return '<a class="conv-card" href="/conversations?phone='+encodeURIComponent(c.phone)+'">'+
          '<div class="phone">'+displayName+' <span class="badge">'+c.messageCount+'</span>'+(c.name?'<span style="color:#94a3b8;font-size:12px;margin-left:6px">'+formatPhone(c.phone)+'</span>':'')+serviceHtml+'</div>'+
          '<div class="meta">'+time+'</div>'+
          (pre?'<div class="preview">'+pre+'</div>':'')+
          '</a>';
      }).join('');
    }).catch(function(){});
  }
function filterByService(){
  const service = document.getElementById('serviceFilter').value;
  window.location.href = '/conversations' + (service ? '?service=' + encodeURIComponent(service) : '');
}
loadList();
setInterval(loadList,5000);
`}
</script>
</body>
</html>`;
  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }
  });
}

async function serveConversationsJSON(env, url) {
  if (!env.SEGUIMIENTO) {
    return new Response(JSON.stringify([]), {
      status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
    });
  }
  try {
    const kv = env.SEGUIMIENTO;
    const phone = url.searchParams.get('phone');
    const serviceFilter = url.searchParams.get('service'); // filter by service

    // Lectura paralela en lotes para no disparar el límite de subrequests y ser rápido.
    async function getMany(keys, batch = 20) {
      const out = [];
      for (let i = 0; i < keys.length; i += batch) {
        const chunk = keys.slice(i, i + batch);
        const vals = await Promise.all(chunk.map((k) => kv.get(k, 'json').catch(() => null)));
        out.push(...vals);
      }
      return out;
    }

    // Vista de conversación individual: solo carga los mensajes de esa conversa.
    if (phone) {
      const [data, msgs] = await Promise.all([kv.get(`conv:${phone}`, 'json'), loadMsgsFromKV(kv, phone)]);
      if (msgs.length > 0) {
        const mapped = msgs.map((h) => ({
          role: h.role === 'user' ? 'user' : 'bot',
          content: h.content,
          timestamp: new Date(h.ts || Date.now()).toISOString(),
        }));
        const result = {
          phone,
          name: (data && data.name) || '',
          service: '',
          messages: mapped,
          messageCount: mapped.length,
          createdAt: new Date(msgs[0].ts || Date.now()).toISOString(),
          updatedAt: new Date(msgs[msgs.length - 1].ts || Date.now()).toISOString(),
        };
        // service friendly label desde forms
        const form = await kv.get(`form:latest:${phone}`, 'json');
        if (form && form.servicio) result.service = getFormServicioLabel(form.servicio) || form.servicio;
        return new Response(JSON.stringify(result), {
          status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
        });
      }
      return new Response(JSON.stringify(data ? { phone, name: data.name || '', messages: [], messageCount: 0 } : { phone, messages: [], messageCount: 0 }), {
        status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
      });
    }

    // VISTA DE LISTA — cache corta (20s) para que el polling de 5s del front no recalcule todo.
    const CACHE_KEY = 'cache:conv-list';
    const cached = await kv.get(CACHE_KEY, 'json');
    if (cached && Array.isArray(cached.list)) {
      let out = cached.list;
      if (serviceFilter) out = out.filter((c) => c.service && c.service.toLowerCase().includes(serviceFilter.toLowerCase()));
      return new Response(JSON.stringify(out), {
        status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
      });
    }

    const [convList, latestForms] = await Promise.all([
      kv.list({ prefix: 'conv:' }),
      kv.list({ prefix: 'form:latest:' }),
    ]);

    // Mapa phone -> form (nombre + servicio)
    const formNameMap = new Map();
    const phoneToService = new Map();
    const formVals = await getMany(latestForms.keys.map((k) => k.name));
    for (const data of formVals) {
      if (!data) continue;
      if (data.phone && data.nombre) formNameMap.set(data.phone, data.nombre);
      if (data.phone && data.servicio) phoneToService.set(data.phone, getFormServicioLabel(data.servicio) || data.servicio);
    }

    const convVals = await getMany(convList.keys.map((k) => k.name));
    const conversations = [];
    for (const data of convVals) {
      if (!data) continue;
      const p = data.phone || '';
      if (!p || p === 'undefined' || p === 'chat-web') continue; // filtrar basura
      // Para la lista NO cargamos todos los mensajes: usamos datos ya almacenados en conv:
      const messages = Array.isArray(data.messages) ? data.messages : [];
      const last = messages.length > 0 ? messages[messages.length - 1] : null;
      conversations.push({
        phone: p,
        name: data.name || formNameMap.get(p) || '',
        service: phoneToService.get(p) || '', // formNameMap/phoneToService
        messageCount: typeof data.messageCount === 'number' ? data.messageCount : messages.length,
        lastMessage: last ? { role: last.role, content: last.content, timestamp: last.timestamp } : null,
        updatedAt: data.updatedAt || (last && last.timestamp) || new Date().toISOString(),
      });
    }

    // Conversation keys que no quedaron en conv: (solo de msgh:) — por teléfono válido
    const knownPhones = new Set(conversations.map((c) => c.phone));
    const msgList = await kv.list({ prefix: 'msgh:' });
    const byPhone = new Map();
    for (const key of msgList.keys) {
      const p = key.name.slice('msgh:'.length).split(':')[0];
      if (!p || p === 'undefined' || p === 'chat-web' || knownPhones.has(p)) continue;
      if (!byPhone.has(p)) byPhone.set(p, []);
      byPhone.get(p).push(key.name);
    }
    for (const [p, keys] of byPhone) {
      const vals = await getMany(keys);
      const msgs = vals.filter((v) => v && v.role).sort((a, b) => (a.ts || 0) - (b.ts || 0));
      if (msgs.length === 0) continue;
      conversations.push({
        phone: p,
        name: formNameMap.get(p) || '',
        service: phoneToService.get(p) || '',
        messageCount: msgs.length,
        lastMessage: msgs[msgs.length - 1] ? { role: msgs[msgs.length - 1].role, content: msgs[msgs.length - 1].content, timestamp: new Date(msgs[msgs.length - 1].ts || Date.now()).toISOString() } : null,
        updatedAt: new Date(msgs[msgs.length - 1].ts || Date.now()).toISOString(),
      });
    }

    // Ordenar por última actividad y aplicar filtro
    conversations.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
    let filtered = conversations;
    if (serviceFilter) filtered = filtered.filter((c) => c.service && c.service.toLowerCase().includes(serviceFilter.toLowerCase()));

    // Escribir cache
    try { await kv.put(CACHE_KEY, JSON.stringify({ generated: new Date().toISOString(), list: conversations }), { expirationTtl: 20 }); } catch {}

    return new Response(JSON.stringify(filtered), {
      status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
    });
  }
}

async function loadMsgsFromKV(kv, phone) {
  const list = await kv.list({ prefix: `msgh:${phone}:` });
  const msgs = [];
  for (let i = 0; i < list.keys.length; i += 20) {
    const chunk = list.keys.slice(i, i + 20);
    const vals = await Promise.all(chunk.map((key) => kv.get(key.name, 'json').catch(() => null)));
    for (const v of vals) {
      if (v && v.role) msgs.push(v);
    }
  }
  msgs.sort((a, b) => (a.ts || 0) - (b.ts || 0));
  return msgs;
}

async function processFollowUps(env) {
  if (!env.SEGUIMIENTO) {
    console.log('KV namespace SEGUIMIENTO not configured');
    return;
  }

  try {
    const list = await env.SEGUIMIENTO.list();
    const now = Date.now();

    for (const key of list.keys) {
      if (!key.name.startsWith('fu_')) continue;

      const data = await env.SEGUIMIENTO.get(key.name, 'json');
      if (!data || !Array.isArray(data.followUps)) continue;

      for (const fu of data.followUps) {
        if (fu.sent) continue;
        if (now >= fu.dueAt) {
          if (env.META_ACCESS_TOKEN && env.META_PHONE_NUMBER_ID) {
            await sendWhatsAppMessage(env, data.phone, fu.message);
            console.log(`Follow-up sent to ${data.phone}: ${fu.label}`);
          } else {
            console.log(`Follow-up due for ${data.phone}: ${fu.label} (WhatsApp not configured)`);
          }

          fu.sent = true;
          fu.sentAt = new Date().toISOString();
          await env.SEGUIMIENTO.put(key.name, JSON.stringify(data));
        }
      }

      const allSent = data.followUps.every(fu => fu.sent);
      if (allSent) {
        await env.SEGUIMIENTO.delete(key.name);
        console.log(`Follow-up completed for ${data.phone}, key deleted`);
      }
    }
  } catch (error) {
    console.error('Error processing follow-ups:', error);
  }
}

export async function saveFollowUp(env, phone, name, service) {
  if (!env.SEGUIMIENTO) return;

  const key = `fu_${phone}_${Date.now()}`;
  const now = Date.now();
  const serviceLabel = getFormServicioLabel(service) || service;

  const messages = {
    day1: `Buenos dias ${name}. Esperamos que todo haya ido bien con su servicio de ${serviceLabel}. Si tiene alguna duda, estamos a su disposicion.\n\nUNIDOLOR\n${PHONE}`,
    day3: `Hola ${name}. Queremos saber como sigue de su ${serviceLabel}. Si necesita algo, no dude en contactarnos.\n\nUNIDOLOR\n${PHONE}`,
    day7: `Hola ${name}. Esperamos que se encuentre bien. Recuerde que en Unidolor estamos para servirle.\n\nUNIDOLOR\n${PHONE}`,
    day30: `Hola ${name}. Ha pasado un mes desde su servicio con Unidolor. Si requiere atencion nuevamente, estamos a su disposicion.\n\nUNIDOLOR\n${PHONE}`,
  };

  const followUps = [
    { label: '1 dia', dueAt: now + 1 * 24 * 60 * 60 * 1000, message: messages.day1, sent: false },
    { label: '3 dias', dueAt: now + 3 * 24 * 60 * 60 * 1000, message: messages.day3, sent: false },
    { label: '7 dias', dueAt: now + 7 * 24 * 60 * 60 * 1000, message: messages.day7, sent: false },
    { label: '30 dias', dueAt: now + 30 * 24 * 60 * 60 * 1000, message: messages.day30, sent: false },
  ];

  await env.SEGUIMIENTO.put(key, JSON.stringify({ phone, name, service, followUps, created: new Date().toISOString() }));
  console.log(`Follow-up saved for ${phone} (${name})`);
}

function typingDelay() {
  const min = 1000;
  const max = 3000;
  return new Promise(r => setTimeout(r, Math.floor(Math.random() * (max - min + 1)) + min));
}
