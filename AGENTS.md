# UNIDOLOR Platform — Guía de Deploy

## Infraestructura Actual

| Servicio | Plataforma | URL | Estado |
|----------|------------|-----|--------|
| Chatbot WhatsApp | Cloudflare Workers | https://unidolor-bot.unidolor.workers.dev | ✅ Activo |
| CRM (Backend + Frontend) | Render.com (free) | https://unidolor-crm.onrender.com | ⏳ Pendiente deploy |
| Base de Datos | MongoDB Atlas (free) | mongodb+srv://... | ✅ Activo |

## Credenciales

| Credencial | Valor | Dónde se usa |
|------------|-------|--------------|
| `WEBHOOK_API_KEY` | `unidolor-webhook-key-2026` | Chatbot ↔ CRM |
| `JWT_SECRET` | `unidolor_secret_key_2026` | CRM auth |
| `MONGODB_URI` | *(ver .env o MongoDB Atlas)* | CRM → BD |

## Comandos de Deploy

### Chatbot (Cloudflare Workers)
```bash
cd apps/chatbot
wrangler deploy
```

### CRM (Render.com)
```bash
# No hay CLI de Render. Deploy automático vía GitHub.
# Pasos:
cd apps/crm
git add .
git commit -m "descripción del cambio"
git push origin feat/cierre-fiscal-it17
# Render detecta el push y redeploya automáticamente (~3-5 min)
```

### CRM (Railway — trial expirado, no usar)
```bash
# railway up --detach  # NO FUNCIONA - trial expirado
```

## Estructura del Proyecto

```
Unidolor-Platform/
├── apps/
│   ├── chatbot/          # WhatsApp Bot (Cloudflare Workers)
│   │   └── src/
│   │       ├── bot.js          # Lógica principal del bot
│   │       ├── crm.js          # Integración con CRM
│   │       ├── state.js        # Estado de conversaciones
│   │       ├── contact-reason.js  # Motivos de contacto (nuevo)
│   │       ├── knowledge-data.js  # Base de conocimiento
│   │       ├── index.js        # Endpoints HTTP
│   │       └── ...
│   └── crm/              # CRM (MERN Stack)
│       ├── backend/
│       │   └── src/
│       │       ├── models/appModels/
│       │       │   ├── Case.js           # Caso/Episodio (nuevo)
│       │       │   ├── Procedure.js      # Procedimientos (nuevo)
│       │       │   ├── ConsentTemplate.js # Consentimientos (nuevo)
│       │       │   ├── ConsentInstance.js  # Firmas (nuevo)
│       │       │   ├── Service.js         # Servicios (modificado)
│       │       │   └── ...
│       │       ├── controllers/coreControllers/
│       │       │   └── webhookController/
│       │       │       └── index.js       # handleBotWebhook + handleCreateCase
│       │       ├── routes/coreRoutes/
│       │       │   └── coreWebhook.js     # /webhook/bot + /webhook/case
│       │       └── scripts/
│       │           └── seed-catalog.js    # Seed procedimientos + consentimientos
│       └── frontend/          # React (Ant Design)
├── services-catalog.js        # Catálogo unificado (fuente de verdad)
├── render.yaml                # Config Render.com
└── packages/core/             # Config institucional compartida
```

## Modelos CRM (Nuevos)

### Case (Caso/Episodio)
- `caseNumber`: Auto-generado (CASO-YYYY-NNNN)
- `client`: Ref → Client
- `motivoContacto`: { tipo, descripcion, ubicacionDolor, intensidadDolor }
- `servicio`: Ref → Service
- `procedimiento`: Ref → Procedure
- `consentimientos`: [{ template, instance, firmado }]
- `status`: abierto | en_evaluacion | planificado | en_proceso | completado | cancelado | seguimiento

### Procedure (Procedimiento)
- `codigo`: Único (INF-EPIDURAL, SONO-ABDOMINAL, etc.)
- `servicioRef`: Código del servicio padre
- `requiereConsent`: ID del template de consentimiento
- `requiereIndicacion`: Boolean
- `material`: [strings]

### ConsentTemplate
- `templateId`: Único (CONSENT_INFILTRACION, etc.)
- `version`: String ('3.0')
- `html`: HTML del consentimiento
- `obligatorio`: Boolean

### ConsentInstance
- Snapshot inmutable del template al momento de firma
- `htmlFirmado`: HTML con campos rellenados
- `status`: pendiente | firmado | rechazado | vencido

## Endpoints CRM

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/webhook/bot` | x-api-key | Crea/actualiza Cliente + Oportunidad |
| POST | `/api/webhook/case` | x-api-key | Crea un Caso/Episodio |

## Flujo del Paciente

```
WhatsApp → Bot → detecta motivo → recolecta datos → crea Case en CRM
                                                            ↓
                                              evaluating → plan → procedimiento → consentimiento → atención
```

## Notas Técnicas

- **MongoDB Atlas free**: 512MB, suficiente para empezar
- **Render free**: 512 MB RAM, spin down after 15 min inactivity (~30s para despertar)
- **Cloudflare Workers free**: 100k requests/día
- **El bot y el CRM se comunican** via webhook con API key
- **El catálogo unificado** (`services-catalog.js`) es la fuente de verdad para ambos
