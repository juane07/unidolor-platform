# Base de Conocimiento UNIDOLOR

Fuente oficial de conocimiento institucional. Originada en `Unidolor - Cerebro` y migrada al monorepo.

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

## Relación con el chatbot

`apps/chatbot/src/knowledge-generated.js` es **generado** por `scripts/sync-chatbot-knowledge.ts`
a partir del MongoDB del CRM (modelos `InstitutionalFAQ` y `Service`), no de estos archivos.
`knowledge-base.js` contiene la lista curada de servicios con códigos estables.

Estos documentos son la referencia **humana/institucional** y el contrato que el sync debe
mantener sincronizado con la BD. El `09_FAQ.md` documenta la base empírica de las respuestas.
