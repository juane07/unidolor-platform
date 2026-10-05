# Unidolor Platform

Monorepo que sostiene los sistemas de gestión de **UNIDOLOR**, una clínica de dolor y cuidados paliativos en República Dominicana, junto con **Mejórate en Casa®** (servicios de salud a domicilio).

Sustituye tres herramientas de terceros — **Nimbo** (gestión médica + CRM), **Alegra** (contabilidad, inventario y facturación RD) e **IDURAR ERP/CRM** — con un sistema propio, construido sobre un fork de IDURAR rebrandado y adaptado al dominio de salud.

---

## Arquitectura

El flujo de negocio empieza en WhatsApp y termina en el CRM:

```
Paciente (WhatsApp)
   ↓
Chatbot — Cloudflare Workers (@unidolor/chatbot)
   ↓  POST /api/webhook/bot
Alegro X — CRM (@unidolor/crm)
   ├─ Crea paciente (Cliente)
   ├─ Crea Oportunidad en el pipeline
   └─ Notifica al operador
```

```
unidolor-platform/
├── apps/
│   ├── crm/                Alegro X — gestión de pacientes, agenda y facturación
│   │   ├── backend/        API Node.js + Prisma
│   │   ├── frontend/       Interfaz web
│   │   └── doc/            Documentación funcional
│   └── chatbot/            Bot de WhatsApp sobre Cloudflare Workers
├── packages/
│   └── core/               Lógica compartida entre apps
├── knowledge/              Base de conocimiento institucional (12 documentos)
│                           Contexto, servicios, clínico, operaciones,
│                           administración, marketing, sistemas, roadmap
├── consentimientos/        Formularios de consentimiento informado por procédure
└── render.yaml             Configuración de despliegue (Render + Supabase)
```

### Stack

| Capa | Tecnología |
|---|---|
| Orquestación | pnpm workspaces + Turborepo |
| CRM backend | Node.js, Prisma, PostgreSQL |
| CRM frontend | JavaScript, Vite |
| Chatbot | Cloudflare Workers, Wrangler |
| Base de datos | Supabase (PostgreSQL) |
| Despliegue | Render |
| Compartido | TypeScript en `@unidolor/core` |

---

## Pipeline comercial

```
cotizacion → cita_solicitada → cita_programada → visita
           → orden_servicio → factura → perdido
```

---

## Desarrollo

```bash
# Instalar dependencias
corepack enable && corepack prepare pnpm@11.20.0 --activate
pnpm install

# Ejecutar cada aplicación
pnpm dev:crm          # Alegro X
pnpm dev:chatbot      # Bot de WhatsApp (wrangler dev)

# Verificación
pnpm build
pnpm test
pnpm lint
```

Requiere Node.js >= 20.

---

## Configuración y secretos

**Ningún valor secreto vive en este repositorio.** Toda configuración sensible se define en el entorno:

- `.env.local` en cada aplicación (ignorado por git)
- Panel de variables de entorno de Render
- Secrets de Cloudflare (`wrangler secret put`)

Los archivos `.env.example` y `*.env.example` documentan las variables **sin valores**. `render.yaml` contiene únicamente placeholders; los valores reales se configuran en el panel de Render.

Si alguna credencial llega a commitearse por error, **no basta con borrarla**: la rotación en el proveedor es obligatoria, porque el valor permanece en el historial de git.

---

## Licencia

El código deriva de **IDURAR ERP/CRM**, bajo **AGPL v3** (ver `apps/crm/LICENSE`). Las modificaciones y adaptaciones de UNIDOLOR se distribuyen bajo los mismos términos.

El material de `consentimientos/` es documentación clínica de la organización y se utiliza bajo uso interno.