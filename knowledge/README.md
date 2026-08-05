# Base de Conocimiento UNIDOLOR

Fuente oficial de conocimiento institucional. Originada en `Unidolor - Cerebro` y migrada al monorepo.

## Estructura

| Carpeta | Contenido |
|---|---|
| `./` (raíz) | Documentación institucional (11 docs originados en `Unidolor - Cerebro`) |
| `chatbot/` | Conocimiento operativo del WhatsApp Bot (config, manual, formularios) |

## Documentos

| Documento | Contenido |
|---|---|
| `01_CONTEXT.md` | Contexto maestro: identidad, misión, visión, valores, cultura |
| `02_SERVICES.md` | Catálogo maestro de servicios y preguntas de cotización |
| `03_CLINICAL.md` | Conocimiento clínico institucional |
| `04_OPERATIONS.md` | Flujos operativos y roles |
| `05_ADMINISTRATION.md` | Reglas administrativas, financieras y de facturación |
| `06_MARKETING.md` | Marketing, comunicación y experiencia del paciente |
| `07_SYSTEMS.md` | Ecosistema tecnológico e integraciones |
| `08_KNOWLEDGE.md` | Metodología de gestión del conocimiento |
| `09_FAQ.md` | Preguntas frecuentes oficiales (base empírica) |
| `10_ROADMAP.md` | Planificación estratégica y proyectos |
| `11_PATRONES_CHATS.md` | Patrones de conversación extraídos de WhatsApp real |

## Conocimiento del chatbot

| Documento | Contenido |
|---|---|
| `chatbot/chatbot-config.md` | Keywords, detección de intención, urgencias, pipeline del bot |
| `chatbot/conocimiento-unidolor.md` | Documento único con servicios, FAQ, horarios, políticas, ubicaciones |
| `chatbot/manual-institucional-whatsapp.md` | Manual de políticas, formularios y respuestas institucionales |
| `chatbot/unidolor-master.md` | Documento maestro consolidado (referencia histórica) |
| `chatbot/formularios.json` | Estructura de formularios del bot |

Originado en `Unidolor - ChatBot/knowledge/` y migrado al monorepo.

## Relación con el chatbot

`apps/chatbot/src/knowledge-generated.js` es **generado** por `scripts/sync-chatbot-knowledge.ts`
a partir del MongoDB del CRM (modelos `InstitutionalFAQ` y `Service`), no de estos archivos.
`knowledge-base.js` contiene la lista curada de servicios con códigos estables.

Estos documentos son la referencia **humana/institucional** y el contrato que el sync debe
mantener sincronizado con la BD. El `09_FAQ.md` documenta la base empírica de las respuestas.
