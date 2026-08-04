<div align="center">
  <img src="frontend/src/style/images/unidolor-logo.jpeg" width="160px" />
  <h1>Alegro X — Sistema de Gestión para UNIDOLOR</h1>
  <p>Sistema de gestión de pacientes, agenda médica y facturación para UNIDOLOR (clínica de dolor y cuidados paliativos) y Mejórate en Casa® (servicios de salud a domicilio).</p>
</div>

> **Alegro X** es un fork de **IDURAR ERP/CRM** (AGPL v3) rebrandado y adaptado para el negocio de salud. Reemplaza **Nimbo** (gestión médica + CRM) y **Alegra** (contabilidad + inventario + facturación RD).

---

## 🎯 Qué resuelve

El flujo empieza en el **WhatsApp Bot** (proyecto separado). El paciente habla con el bot, el bot extrae los datos y los envía al CRM automáticamente:

```
Paciente (WhatsApp) → Bot (Cloudflare Workers) → POST /api/webhook/bot → Alegro X CRM
                                                                  ├─ Crea paciente (Cliente)
                                                                  ├─ Crea Oportunidad en el pipeline
                                                                  └─ Notifica al operador
```

## ✨ Módulos

- **Pacientes y Proveedores**: contactos separados por tipo (campo `type`: `cliente` | `proveedor`) con pestañas en la página Clientes
- **Pipeline de Oportunidades**: `cotizacion → cita_solicitada → cita_programada → visita → orden_servicio → factura → perdido`
- **Agenda médica**: horarios por doctor/sucursal (`DoctorSchedule`), slots, tipos de cita, endpoints públicos de disponibilidad
- **Historial clínico**: `ClinicalRecord` por paciente (diagnósticos, órdenes, evolución)
- **ARS**: empresas de seguro, planes y autorizaciones
- **Catálogo SISALRIL**: 260 servicios importados (CUPS/SIMON, precios)
- **Facturación RD**: NCF (secuencias), e-CF (generación XML/eNCF), reportes DGII 606-609, comisiones de doctores por pago
- **Webhook del bot**: `POST /api/webhook/bot` (auth por header `x-api-key` = `WEBHOOK_API_KEY`)

## 🧱 Stack

MERN — MongoDB · Express · React · Node — con Ant Design (AntD) y Redux.

## 🚀 Instalación y despliegue

1. Clonar: `git clone https://github.com/juane07/unidolor-crm.git`
2. Seguir [INSTALLATION-INSTRUCTIONS.md](INSTALLATION-INSTRUCTIONS.md)
3. Variables de entorno en `backend/.env`: `DATABASE`, `JWT_SECRET`, `WEBHOOK_API_KEY`, `PORT=8080`
4. Desplegar en Railway: `railway up --detach` (proyecto `charming-happiness`, servicio `unidolor-crm`)

### Endpoints públicos

| Endpoint | Método | Protegido por | Uso |
|----------|--------|---------------|-----|
| `/schedule/available` | GET | — | Slots disponibles |
| `/schedule/available/:doctorId` | GET | — | Slots de un doctor |
| `/schedule/seed-initial` | POST | API key | Cargar doctores/sucursales/horarios |
| `/schedule/seed-bethania` | POST | API key | Cargar horarios Dra. Bethania |
| `/api/webhook/bot` | POST | `x-api-key` | Recibir datos del WhatsApp Bot |

## 📂 Documentación

| Documento | Contenido |
|-----------|-----------|
| [AGENTS.md](AGENTS.md) | Estado actual, arquitectura, roadmap por fases |
| [CHECKLIST.md](CHECKLIST.md) | Checklist ejecutable de terminado |
| [INSTALLATION-INSTRUCTIONS.md](INSTALLATION-INSTRUCTIONS.md) | Pasos de instalación |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Guía de contribución |

## 🔗 Repos y URLs

| Recurso | URL |
|---------|-----|
| Repo del proyecto | https://github.com/juane07/unidolor-crm |
| CRM desplegado | https://unidolor-crm-production.up.railway.app |
| Chatbot WhatsApp | https://unidolor-bot.juanemilioabreu.workers.dev |
| IDURAR original | https://github.com/idurar/idurar-erp-crm |

## 📄 Licencia

Fork de IDURAR, publicado bajo la **GNU Affero General Public License v3.0** (AGPL-3.0).
