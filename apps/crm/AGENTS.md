# Alegro X — Sistema de Gestión para UNIDOLOR

> Fork de **IDURAR ERP/CRM** (rebrandado como **Alegro X**) adaptado para UNIDOLOR (clínica de dolor y cuidados paliativos) y Mejórate en Casa® (servicios de salud a domicilio).
> **Reemplaza: Nimbo (gestión médica + CRM) + Alegra (contabilidad + inventario + facturación RD).**
> **El flujo empieza en el WhatsApp Bot** — el paciente habla con el bot, el bot extrae los datos y los envía al CRM automáticamente.

---

## ⚡ Quick Reference

| Qué | Dónde |
|-----|-------|
| Código fuente | `C:\Users\nomei\Documents\Unidolor - CRM` |
| Repo (fork propio) | https://github.com/juane07/unidolor-crm (rama `master`) |
| CRM desplegado | https://unidolor-crm-production.up.railway.app |
| Repo original | https://github.com/idurar/idurar-erp-crm |
| Stack | MERN (MongoDB, Express, React, Node) + Ant Design |
| Licencia | AGPL v3 |
| Hosting | Railway.app (proyecto `charming-happiness`, servicio `unidolor-crm`) |
| BD | MongoDB Atlas — db `idurar` |
| Login | admin@admin.com / admin123 |
| API Key webhook | `unidolor-webhook-key-2026` (env `WEBHOOK_API_KEY`) |

---

## 🗺️ Estado Actual (Agosto 2026)

### ✅ Completado — Sesión 03/08/2026 (T9-T11): Ficha domiciliaria + bugfix citas
- **T9 Ficha domiciliaria**: modelo Appointment con tipo `visita_domiciliaria` + campos (`serviceName, policyNumber, sector, familyName, familyIdNumber, familyPhone, familyDomicile, familyEmail, pdf`) y `opportunity` autopopulate; plantilla `backend/src/pdf/Appointment.pug` (A4, logo, secciones AFILIADO/RESPONSABLE, firmas, "Vers. 1.01 Unidolor S.R.L."); `pdfController` añade `appointment` a `pugFiles`; `appointmentController.generateFicha()` genera y guarda PDF en `src/public/download/appointment/`; auto-genera en create/update si `type==='visita_domiciliaria'`; frontend `AppointmentForm.jsx` con campos condicionales según tipo + opción morada en `config.js`
- **T10 Bugfix `date` en citas**: create/update/reschedule mutaban `apptDate` con `.setHours(23,59,59,999)` para el query de conflicto y guardaban ese objeto mutado como `date` → la cita quedaba con fecha fin-de-día. Corregido con `dayStart`/`dayEnd` separados en `appointmentController/index.js` y `corePublicRouter.js` (reschedule)
- **T11 Restauración Carla Reyes**: cita `6a6fea3eed78d0debd384bca` estaba `removed:true/status:cancelada` (de pruebas previas) → restaurada a `programada` (12/08 08:00-09:00, date medianoche). Diagnóstico: el CRM SÍ creaba las citas, pero 4 de prueba quedaron canceladas y el frontend filtra `removed:false` → invisibles en Citas
- Deploy a Railway verificado (HTTP 200)

### ✅ Completado — Sesión 03/08/2026 (T1-T8)
- **T1 e-CF**: ITBIS 18% fijo → usa `invoice.taxRate` (salud exenta 0%)
- **T2 Impuesto Exento**: seeds renombrados a "Exento (0%)"; selector de ITBIS en facturas/cotizaciones reemplazado por opción fija (el endpoint `taxes` no existe en el fork)
- **T3 Contactos Alegra**: BD 1,937 → **2,402 clientes** (importados 461 pendientes: 18 proveedores por RNC 9 dígitos, 443 clientes)
- **T4 Citas**: modelo ahora guarda `startTime`/`endTime`; TimePicker nuevo en DynamicForm; calendario los muestra
- **T5 NCF**: selector de tipo NCF en facturas; seed `/api/ncfsequence/seed`; 5 secuencias (01-04, 11) creadas para sucursal Santo Domingo
- **T6 DGII**: corregido `client.rfc` → `identity_number` en reportes y e-CF; 608 validado
- **T7 Retenciones**: controller propio con auto-cálculo (ITBIS 18% / ISR 10%) + NCF tipo 04
- **T8 Nimbo X**: script `backend/scripts/import-nimbo.js` (CSV→Clientes, detecta duplicados, probado)
- Deploy a Railway verificado (HTTP 200)

### ✅ Completado — Fase 1: Deploy base
- Fork clonado, deploy funcional en Railway (`unidolor-crm-production.up.railway.app`)
- Rebranding: logo UNIDOLOR + nombre "Alegro X" en título/login/sidebar/emails
- Menú lateral organizado en grupos (Pacientes, Equipo, ARS, Ventas, Impuestos, Sistema)
- Traducción al español (es_do)

### ✅ Completado — Fase 2: Webhook Bot → CRM
- Endpoint `POST /api/webhook/bot` implementado (auth por header `x-api-key` = `WEBHOOK_API_KEY`)
- Crea/actualiza Cliente (busca por teléfono o cédula), crea/actualiza Oportunidad (etapa `cita_solicitada`), crea Notificación
- Pipeline de oportunidades con etapas: `cotizacion → cita_solicitada → cita_programada → visita → orden_servicio → factura → perdido`
- Página `/chatbot-conversations` para ver interacciones del bot

### ✅ Completado — Fase 3 parcial: Agenda médica + ARS
- **DoctorSchedule** (horarios por doctor/sucursal, día, franja, duración de slot, tipos de cita, excepciones)
- Endpoints públicos `/schedule/available`, `/schedule/available/:doctorId`, `/schedule/seed-bethania`, `/schedule/seed-initial` (protegidos por API key)
- Citas con validación de horario del doctor (rango, slot, tipo de cita) en `appointmentController`
- **ClinicalRecord** (historial clínico por paciente)
- **ARS**: InsuranceCompany, InsurancePlan, ArsAuthorization
- **Doctores** con comisión y asociación a sucursal
- Tipos de consulta: primera vez / seguimiento / urgencia

### ✅ Completado — Migración de datos
- **SISALRIL**: 260 servicios importados (CUPS/SIMON, precios premium) de `Tarifario Cartera de Servicios Unidolor...SISALRIL.xlsx`
- **Alegra (contactos)**: 2,528 contactos vía API → 1,678 clientes + 259 proveedores (campo `type` en Client)
- Proveedores y clientes separados en pestañas en la página Clientes

### 🔶 En curso / Pendiente — Fase 4: Facturación RD
- Módulo **NCF** (secuencias): ✅ tipos 01-04 y 11 sembrados por sucursal, selector en facturas, seed `/api/ncfsequence/seed`
- Módulo **e-CF** (ECF): ✅ genera XML/eNCF con ITBIS según la factura (servicios de salud exentos = 0%). ⏳ Falta firma digital real + envío a DGII
- Módulo **DGII** (reportes 606/607/608/609): ✅ 608/607/609 generan con `identity_number` corregido; ⏳ 606 (compras) pendiente
- Módulo **Retenciones** (Withholding): ✅ auto-cálculo de monto (ITBIS 18% / ISR 10%) + NCF tipo 04 automático
- **ITBIS**: ✅ impuesto "Exento (0%)" fijo en facturas/cotizaciones (salud exenta)
- Conciliación bancaria: ❌
- Contratos con ARS (tarifas por servicio): ❌
- Inventario con lotes/vencimientos: ❌
- Multi-empresa (Unidolor + Mejórate en Casa): ❌ (sin decidir)

### ⏳ Pendiente inmediato
- **Desplegar en Railway** cada cambio (ya hecho el último `railway up --detach`, verificado HTTP 200)
- Solicitar extracción de **Nimbo X** a soporte@nimbo-x.com → correr `node scripts/import-nimbo.js <archivo.csv>`
- Validar rangos NCF reales de la DGII y actualizar las 5 secuencias sembradas
- Reporte DGII **606** (compras) — menor prioridad para UNIDOLOR

### 📋 Lista pendiente (alto esfuerzo, siguientes)
1. **Contratos con ARS** (tarifas negociadas por servicio) — alto impacto
2. **Multi-empresa** (Unidolor + Mejórate en Casa) — requiere decisión
3. **Inventario con lotes/vencimientos** — impacto medio
4. **Conciliación bancaria** — impacto bajo
5. **e-CF con firma digital** real y envío a DGII

### 📋 Pendiente de datos
- Migración desde **Nimbo X** (SaaS): solicitar extracción masiva a soporte@nimbo-x.com (admin). Entrega en Excel: Pacientes, Consultas, Antecedentes, Diagnósticos, etc. (gratis 1×/año; extras $1,300 MXN)

---

## 🏗️ Arquitectura (Flujo Completo)

```
                     FLUJO PRINCIPAL
  ─────────────────────────────────────────────────────
  1. PACIENTE                            (WhatsApp)
       │
       ▼
  2. WHATSAPP BOT                        (Cloudflare Workers)
       │  Detecta intención + urgencia
       │  Recolecta datos (nombre, servicio, dirección, seguro...)
       │  Detecta 3+ datos → fuerza FORMDATA + ESCALACION
       │
       ├─→ WhatsApp al operador (cuando esté activo)
       │
       └─→ POST /api/webhook/bot ←─── (nuevo endpoint en CRM)
              Body: { nombre, telefono, direccion, servicio, 
                      seguro, afiliado, notas, fuente: "whatsapp" }
       │
       ▼
  3. UNIDOLOR CRM                        (Railway.app)
       ┌─────────────────────────────────┐
       │  Crea CONTACTO (paciente)       │
       │  Crea OPORTUNIDAD (en pipeline) │
       │  Historial de interacciones     │
       └─────────────────────────────────┘
       │
       ▼
  4. FACTURACIÓN RD                      (IDURAR + custom)
       ┌─────────────────────────────────┐
       │  Cotización → Orden de servicio │
       │  Factura con NCF               │
       │  e-CF (DGII)                   │
       │  Reportes 606-609              │
       │  Cuentas por cobrar            │
       └─────────────────────────────────┘


                     PANEL ADMIN
  ┌─────────────────────────────────────────────────┐
  │  React (AntD)                                   │
  │  Dashboard ventas · Pipeline · Pacientes         │
  │  Calendario visitas · Facturación · Reportes    │
  └─────────────────────────────────────────────────┘
```

---

## 🚀 Deploy — Fase 1

### Prerrequisitos
```bash
# Node.js v18+
node -v

# Git
git --version
```

### 1. Clonar
```bash
cd C:\Users\nomei\Documents\Unidolor CRM
git clone https://github.com/idurar/idurar-erp-crm.git .
```

### 2. MongoDB Atlas (gratis)
1. Ir a https://www.mongodb.com/atlas → Register
2. Crear cluster free (M0, 512MB)
3. Network Access → Add IP `0.0.0.0/0` (allow all)
4. Database Access → Create user (guardar usuario/contraseña)
5. Clusters → Connect → Drivers → Copiar URI:
   `mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/idurar?retryWrites=true&w=majority`

### 3. Configurar variables
Crear `backend/.env`:
```
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/idurar
JWT_SECRET=unidolor_secret_key_2026
PORT=8080
```

### 4. Deploy en Railway (gratis)
```bash
# Instalar Railway CLI
npm i -g @railway/cli
railway login

# En la raíz del proyecto
railway init
railway up
```

O usar el botón "Deploy on Railway" desde el README original.

### 5. Probar
- Abrir la URL que da Railway
- Login: admin@admin.com / admin123 (cambiar luego)

---

## 🔗 Integración con ChatBot (Fase 2)

El **WhatsApp Bot** es el punto de entrada de todo el flujo. Cuando detecta 3+ datos del paciente, debe enviarlos al CRM automáticamente.

### Endpoint en el CRM: `POST /api/webhook/bot`

Crear este endpoint en IDURAR (backend/routes/) para recibir los datos del bot:

```js
// POST /api/webhook/bot
// Body: { nombre, telefono, direccion, servicio, seguro, afiliado, notas, fuente }
// 1. Busca contacto por teléfono o crea uno nuevo
// 2. Crea una oportunidad en pipeline "Cotizaciones"
// 3. Asigna el servicio como producto
// 4. Responde { ok: true, contactId, opportunityId }
```

### Configuración en el Bot

El bot (en `C:\Users\nomei\Documents\ChatBot Unidolor`) necesita:
```js
// En workers/unidolor-bot/src/index.js
// Cuando se guarda un form, también POSTear al CRM:
if (data.nombre && data.servicio) {
  await fetch('https://<crm-url>/api/webhook/bot', {
    method: 'POST',
    body: JSON.stringify({ ...data, fuente: 'whatsapp' }),
    headers: { 'Content-Type': 'application/json' }
  });
}
```

### Lo que genera en el CRM automáticamente
| Paso | Resultado |
|------|-----------|
| Bot recibe "Quiero una consulta" | — |
| Bot recolecta nombre, dirección, seguro | → POST al CRM |
| CRM crea contacto (paciente) | Contacto tipo "Paciente" |
| CRM crea oportunidad | Pipeline "Servicios", etapa "Cotización" |
| Admin revisa en dashboard | Ve la solicitud, la convierte en visita/factura |

---

## 📋 Mapeo: Nimbo + Alegra → Alegro X

### Lo que Nimbo hace para UNIDOLOR
| Funcionalidad | Alegro X la tiene |
|---------------|:---------------:|
| Contactos/pacientes | ✅ |
| Pipeline de oportunidades | ✅ |
| Cotizaciones | ✅ |
| Agenda de doctores (horarios, asignación visitas) | ✅ (DoctorSchedule + endpoints públicos) |
| Historial clínico por paciente (diagnósticos, órdenes, evolución) | ✅ (ClinicalRecord) |
| Gestión de ARS (cobertura, autorizaciones, tarifas por plan) | ✅ Parcial (empresas, planes, autorizaciones) |
| Recordatorios de citas | ❌ (lo hace el bot parcialmente) |
| Múltiples doctores con horarios distintos | ✅ |
| Tipos de consulta: primera vez vs seguimiento, precios diferenciales | ✅ |
| Migración de expedientes desde Nimbo X | ⏳ Solicitar extracción masiva (admin) |

### Lo que Alegra hace para UNIDOLOR
| Funcionalidad | Alegro X la tiene |
|---------------|:---------------:|
| Facturación básica | ✅ |
| Cotizaciones → Facturas | ✅ |
| Productos/Servicios | ✅ |
| Inventario (insumos, medicamentos, control de stock, entradas/salidas) | ✅ Parcial |
| Cuentas x cobrar con ARS (pagos a 30-60-90 días) | ✅ Genérico |
| Órdenes de compra | ✅ |
| Conciliación bancaria | ❌ |
| Notas de crédito / devoluciones | ✅ |
| Contratos con ARS (tarifas negociadas por servicio) | ❌ |
| NCF (11 tipos fiscales RD) | 🟡 Esqueleto (secuencias) |
| Facturación electrónica e-CF | 🟡 Genera XML pero ITBIS 18% fijo (mal para salud) |
| Reportes DGII (606, 607, 608, 609) | 🟡 Controller básico sin validar |
| Retenciones ITBIS/ISR | ❌ Esqueleto |
| Multi-empresa (Unidolor + Mejórate en Casa) | ❌ |

---

## ❓ Preguntas pendientes (resolver antes de Fase 3-4)

| Pregunta | Impacta |
|----------|---------|
| ¿Manejan descuentos por paquetes de servicios o por frecuencia? | Precios, cotizaciones |
| ¿Control de medicamentos controlados (recetas, seguimiento)? | Módulo clínico |
| ¿Comisiones por doctor por visita realizada? | Contabilidad, pagos |
| ¿Facturación separada por sucursal o por doctor? | Multi-empresa, reportes |
| ¿Portal web donde pacientes vean historial, citas, pagos? | Fase futura |
| ¿Inventario con control de lotes y fechas de vencimiento? | Fase 4 (inventario) |
| ¿Cuentas bancarias separadas por servicio o todo a la misma? | Conciliación |
| ¿Régimen tributario (RST, RDL, regimen normal)? | NCF, reportes DGII |
| ¿Unidolor y Mejórate en Casa® comparten equipo o son operaciones separadas? | Multi-empresa en el CRM |

---

## 🌐 URLs

| Recurso | URL |
|---------|-----|
| Chatbot WhatsApp | https://unidolor-bot.juanemilioabreu.workers.dev |
| CRM | https://unidolor-crm-production.up.railway.app |
| MongoDB Atlas | https://cloud.mongodb.com |
| Railway dashboard | https://railway.app/dashboard |
| Repo del proyecto | https://github.com/juane07/unidolor-crm |
| IDURAR original | https://github.com/idurar/idurar-erp-crm |

---

## 📝 Límite entre Proyectos

```
┌──────────────────────────────────────┐
│  SESIÓN 1: ChatBot Unidolor          │
│  Carpeta: C:\...\ChatBot Unidolor\   │
│  AGENTS.md propio                    │
│  Tema: WhatsApp bot, webhook,        │
│        conocimiento del negocio      │
└──────────────────────────────────────┘
          │ Webhook POST /api/webhook/bot
          ▼
┌──────────────────────────────────────┐
│  SESIÓN 2: Unidolor CRM             │
│  Carpeta: C:\Users\nomei\Documents\ │
│           Unidolor - CRM\            │
│  AGENTS.md propio ← ESTE ARCHIVO    │
│  Tema: CRM, facturación, NCF,        │
│        reportes DGII, pacientes     │
└──────────────────────────────────────┘
```

### Reglas de contexto
1. **El bot y el CRM son proyectos separados**, cada uno con su propia carpeta y `AGENTS.md`.
2. **NUNCA trabajes ambos en la misma sesión.** Cuando entres a trabajar, el usuario te dirá cuál de los dos tocar.
3. **Si el usuario habla del bot** (WhatsApp, webhook Meta, Gemini, knowledge) → abrir `ChatBot Unidolor`.
4. **Si el usuario habla del CRM** (facturas, pacientes, pipeline, IDURAR, Railway, MongoDB) → abrir `Unidolor CRM`.
5. **El punto de conexión entre ambos** es el endpoint `POST /api/webhook/bot` en el CRM, que el bot llama cuando recolecta datos de un paciente. Eso se documenta en la Fase 2 de este proyecto.

### Notas técnicas
- La rama `master` del repo original es estable. Hacer fork propio para customizaciones.
- MongoDB Atlas free tiene 512MB — suficiente para empezar. Si crece, migrar a MongoDB Atlas M2 ($9/mes).
- Railway free da $5/mes de crédito, suficiente para un proyecto pequeño.
- Credenciales de Alegra viven en variables de entorno de usuario de Windows: `ALEGRA_EMAIL`, `ALEGRA_TOKEN`.
