# Unidolor CRM — Checklist Ejecutable de Terminado

> Criterio real de "terminado": **el negocio opera un mes completo sin Nimbo ni Alegra.**
> Cada tarea tiene responsable y forma de verificar. Marcar `[x]` cuando se complete.

---

## 🟦 FASE 1 — Base y Operación Segura

| # | Tarea | Responsable | Cómo verificar |
|---|-------|-------------|----------------|
| [ ] | Cambiar contraseña de admin@admin.com (quitar admin123) | Admin | Login con credencial nueva |
| [ ] | Activar backups en MongoDB Atlas (M2+ o script manual) | Dev | Restaurar en entorno de prueba |
| [ ] | Configurar dominio propio (unidolorcrm.com) con HTTPS | Admin | https:// funcionando |
| [ ] | Agregar 2FA o al menos contraseña fuerte | Admin | Cambio exitoso |
| [ ] | Prueba de deploy: `railway up` desde cero | Dev | App responde en URL nueva |
| [ ] | Documentar credenciales en lugar seguro (no en el repo) | Admin | Acceso compartido seguro |

---

## 🟨 FASE 2 — Bot WhatsApp → CRM

| # | Tarea | Responsable | Cómo verificar |
|---|-------|-------------|----------------|
| [ ] | Bot en producción llama `POST /api/webhook/bot` con `x-api-key` | Dev bot | Mensaje real desde WhatsApp crea paciente |
| [ ] | Probar flujo real: paciente escribe → aparece en Oportunidades | Dev + Admin | Nueva tarjeta "Cita Solicitada" en Pipeline |
| [ ] | Verificar que `notas` (no `notes`) llega bien al webhook | Dev | Nota visible en oportunidad |
| [ ] | Notificación visible en dashboard al llegar solicitud | Admin | Campana muestra notificación |
| [ ] | Admin avanza: Cita Solicitada → Programada → Visita | Admin | Drag en Kanban cambia etapa |
| [ ] | Bot responde al paciente que su solicitud fue recibida | Dev bot | WhatsApp del paciente confirma |

---

## 🟩 FASE 3 — Agenda Médica y ARS

| # | Tarea | Responsable | Cómo verificar |
|---|-------|-------------|----------------|
| [ ] | Doctor tiene horarios cargados (Dra. Bethania: miér/jue 8-18) | Dev | `/schedule/available` devuelve slots |
| [ ] | Admin agenda cita real asignando doctor/fecha/hora | Admin | Cita aparece en Agenda |
| [ ] | Doctor marca cita como realizada / cancelada | Doctor | Estado cambia en el sistema |
| [ ] | Tipos de consulta con precio: primera vez vs seguimiento vs urgencia | Admin | Cotización refleja precio correcto |
| [ ] | ARS con tarifas por servicio cargadas | Admin | Factura calcula con tarifa ARS |
| [ ] | Autorización ARS se crea, se aprueba y vence | Admin | Autorización visible + alerta vencida |
| [ ] | Historial clínico: 1 paciente de prueba con diagnósticos y evolución | Doctor | Expediente completo en pantalla |
| [ ] | Recordatorio de cita (bot o email) funciona | Dev bot | Paciente recibe aviso |

---

## 🟥 FASE 4 — Facturación RD (crítica legal)

| # | Tarea | Responsable | Cómo verificar |
|---|-------|-------------|----------------|
| [ ] | Secuencias NCF cargadas por sucursal y tipo | Admin | `/ncfsequence/next` devuelve NCF válido |
| [ ] | Factura emite NCF automáticamente al crear | Dev | Factura nueva tiene NCF 01XXXXXXXX |
| [ ] | Comisión de doctor calculada al registrar pago | Dev | Pago muestra commissionAmount |
| [ ] | Retención ITBIS/ISR aplicada correctamente | Admin + Contador | Factura muestra retención |
| [ ] | e-CF: firma digital funciona (no solo UI) | Dev + Contador | DGII acepta envío de prueba |
| [ ] | Reporte 606/607/608/609 se genera y descarga | Admin | PDF/CSV válido de 1 mes |
| [ ] | Cuentas x cobrar ARS: factura con pago 30/60/90 | Admin | Estado partial/paid correcto |
| [ ] | Conciliación bancaria de 1 mes cuadra | Contador | Bancos = sistema |
| [ ] | **Prueba DGII real**: factura aceptada en portal | Contador | Confirmación DGII |

---

## 📊 MIGRACIÓN y CORTE (lo que hace que Nimbo/Alegra dejen de usarse)

| # | Tarea | Responsable | Cómo verificar |
|---|-------|-------------|----------------|
| [ ] | Migrar pacientes activos desde Nimbo | Admin | Contar = misma cantidad que Nimbo |
| [ ] | Migrar citas/historial de últimos 12 meses | Dev | Muestreo de 10 expedientes completos |
| [ ] | Migrar catálogo de servicios con precios | Admin | Catálogo idéntico a Alegra |
| [ ] | Migrar saldos pendientes (cxc) | Contador | Total cuadra con Alegra |
| [ ] | Migrar ARS/contratos/tarifas | Admin | Planes con cobertura correcta |
| [ ] | Un mes paralelo: operar en CRM + copiar a Nimbo/Alegra | Equipo | Datos coinciden al 100% |
| [ ] | **Corte oficial** de Nimbo y Alegra | Admin | No se vuelve a abrir |

---

## 🎓 CAPACITACIÓN y SOPORTE

| # | Tarea | Responsable | Cómo verificar |
|---|-------|-------------|----------------|
| [ ] | Documento guía de 1 página por rol (admin, doctor, recepción) | Dev | Equipo lo usa sin preguntar |
| [ ] | Sesión de capacitación real con cada rol | Dev | Usan el CRM solos |
| [ ] | Backups automáticos + restauración probada | Dev | Restaurar en clon y abrir |
| [ ] | Contacto de soporte definido (quién responde si falla) | Admin | Número/correo de soporte |
| [ ] | 30 días de operación real sin abrir Nimbo/Alegra | Equipo | Log completo de uso |

---

## ✅ DEFINICIÓN DE TERMINADO (resumen)

El proyecto está **terminado** cuando:

1. Un paciente entra por WhatsApp → bot → CRM → factura → NCF → cobro **sin reingresar datos**
2. Los doctores usan su agenda a diario
3. La DGII acepta las facturas electrónicas
4. Las comisiones de doctores se calculan solas
5. El mes en paralelo cuadró y se hizo el corte
6. El equipo opera 30 días sin ayuda del desarrollador
