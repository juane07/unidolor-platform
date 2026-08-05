# ChatBot UNIDOLOR — Configuración Interna

> Configuración de detección, keywords y reglas del chatbot.
> La fuente de verdad del conocimiento de negocio está en `conocimiento-unidolor.md`.

---

## 1. Mapa de Keywords → Códigos de Servicio

Usado por `findService()` para detectar qué servicio menciona el paciente.

| Keyword(s) | Código |
|------------|--------|
| rayos x, radiografia, rx, placa | RX |
| sonografia, ecografia, ultrasonido, eco | SONO |
| doppler | DOP |
| holter, ritmo cardiaco | HOL |
| mapa, presion arterial, monitoreo presion | MAPA |
| bomba intratecal, medtronic, recarga bomba | BOM |
| bomba elastomerica, infusion continua | BEL |
| transfusion, hemohogar, hemoglobina, sangre | HEMO |
| pie diabetico, ulcera diabetico | PD |
| terapia fisica, rehabilitacion, fisioterapia | TF |
| enfermeria, enfermero, enfermera | ENF |
| curaciones, cura, herida, ulcera, aposito | CUR |
| inyeccion, inyectable, aplicar medicamento | MED |
| nebulizacion, nebulizar, oxigeno, inhalacion | NEB |
| sondas, sonda, foley, nasogastrica | SON |
| sueros, suero, venoclisis, intravenoso | SUE |
| laboratorio, analisis | LAB |
| examen sangre, muestra | MUES |
| consulta, medico a domicilio, medico domicilio | CMD |
| consulta clinica, consultorio, presencial | CMC |
| especialista, ortopedia, neurologia | CE |
| dolor, paliativos, cuidados paliativos | DOL |
| adulto mayor, anciano, programa adulto | AM |
| paquete, combo, integral | PAQ |
| cirugia | PD |
| signos vitales, tomar signos | SV |
| electrocardiograma, ecg | ECG |
| ecocardiograma, eco cardiaco | ECO |
| internamiento, hospitalizacion, ingreso | HOS |
| quimioterapia, oncomejorate, inmunoterapia | QUIMIO |
| antibiotico, antibioterapia | ANT |
| dialisis, dialisis peritoneal | DP |
| nutricion, nutricional, dieta | NUTRI |
| odontologia, dentista, dientes, muela | ODONTO |
| postquirurgico, post operatorio, post cirugia | POST |
| cuidadora, cuidador | CUIDA |
| acompanamiento, traslado, acompanante | ACOMP |
| receta, receta controlada | RECETA |

**Nota:** Un mismo keyword puede mapear a un solo código. Si hay conflicto (ej. `eco` → SONO, no ECO como ecocardiograma), la keyword más específica tiene prioridad por orden en el objeto.

---

## 2. Detección de Intención

Usado por `detectarIntencion()` para clasificar el mensaje del paciente y seleccionar la sección de conocimiento a inyectar.

| Intención | Keywords de activación |
|-----------|----------------------|
| cierre | gracias, perfecto, ok, de acuerdo, chao, adios, nos vemos, encantado, gusto |
| precio | precio, cuanto cuesta, costo, cotiz, cuanto vale, tarifa, valor, presupuesto |
| agendar | agendar, cita, visita, domicilio, quiero, necesito, programar, reservar |
| seguro | seguro, ars, aseguradora, cobertura, humano, mapfre, universal, palic, senasa, banco central |
| horario | horario, hora, atienden, abierto, domingo, sabado, abren, disponibilidad |
| ubicacion | donde, ubicacion, direccion, oficina, estan |
| cancelacion | cancelar, reprogramar, cambiar, modificar |
| reembolso | reembolso, devolver, devolución, dinero, reembolsar, reintegro, devuelvan, me devuelven |
| balance_favor | balance a favor, dejar en fondo, crédito, credito, fondo, balance |
| reprogramacion | reprogramar, cambiar fecha, cambiar cita, nueva fecha |
| pago | pago, pagar, transferencia, cuenta, banco, deposito, efectivo, tarjeta |
| factura | factura, recibo, fra, comprobante de pago, facturación |
| nimbo | nimbo, nimbox, agendar nimbo, cita nimbo, acceder nimbo, plataforma nimbo |
| contabilidad | contabilidad, contable, RRHH, rrhh, recurso humano, facturación, departamento |
| resultados | resultado, entrega, cuando (está listo/sale/estar) |
| preparacion | preparacion, ayuno, preparar, necesito hacer |
| orden_medica | orden medica, indicacion, receta, referimiento, necesito orden |
| empresarial | empresa, empleado, corporativo, trabajadore |
| hospitalizacion | internamiento, hospitalizacion, ingreso |
| servicio | (detectado por findService() — ver sección 1) |
| doctor | dra bethania, dra ximena, dr marmol, doctor, especialista, ortopedia, neurologia |
| saludo | hola, bueno, saludos, buenas, que tal |
| general | (ninguna intención detectada) |

---

## 3. Urgencias

Usado por `detectUrgency()` en `intent.js` para detectar emergencias.

### Palabras clave de emergencia
```
emergencia, dolor intenso, mucho dolor, sangrando,
dificultad para respirar, no puede respirar, se desmayo,
perdio el conocimiento, infarto, derrame, accidente, 911
```

### Respuesta del bot
1. Instruir al paciente a acudir a la sala de urgencias más cercana o llamar al 911.
2. NO ofrecer servicios ni intentar agendar.
3. Escalar el mensaje al asesor humano (ESCALACION).

---

## 4. Pipeline de Procesamiento

El bot procesa los mensajes en 4 capas secuenciales:

```
Cliente → Meta Cloud API → Cloudflare Worker (webhook)
  → CAPA 1 (Urgencia) → mensaje de emergencia + escalación
  → CAPA 2 (Caché KV) → reply instantáneo si ya existe
  → CAPA 3 (Gemini IA con prompt) → reply natural + FORMDATA/ESCALACION
  → Fallback (Groq IA si Gemini agotado) → sigue respondiendo con IA
  → Fallback (Humano) → "un asesor se comunicará"
```

### Markers especiales en la respuesta del LLM
| Marker | Significado |
|--------|-------------|
| `FORMDATA:{...}` | Datos estructurados recolectados (se elimina del mensaje al usuario) |
| `ESCALACION` | Indica que se debe escalar a un asesor humano |

### Reglas del prompt (DEFAULT_PROMPT)
1. Identidad: asistente de UNIDOLOR (clínica de dolor y cuidados paliativos). Mejórate en Casa® es su marca de servicios a domicilio.
2. Saludo solo la primera vez del día
3. Precios: consulta en clínica RD$5,000 (primera y subsecuente). Domicilio y otros servicios → pedir datos y escalar.
4. Preguntar un dato a la vez, no todo de golpe
5. Con 3+ datos, marcar FORMDATA + ESCALACION
6. Si es urgencia, redirigir a emergencias
7. Respuestas naturales, cortas, español correcto sin mezclar inglés
8. Seguros/ARS: solo mencionar si el cliente pregunta. Domiciliario no tiene cobertura ARS directa — ofrecere carta y factura para reembolso.
9. Servicios continuos (enfermería 24/7): requieren aviso de 1 mes para cancelar/modificar.

---

## 5. Políticas de Cancelación, Reembolso y Balance

### cancelacion
- No se ofrecen reembolsos en efectivo.
- Se otorga crédito por el monto pagado, utilizable exclusivamente para futuros servicios dentro de los siguientes 6 meses.
- Para servicios continuos (ej. enfermería 24/7) se requiere aviso con al menos 1 mes de anticipación.
- Se sugiere cancelar con la mayor antelación posible.

### reembolso
- No hay reembolsos en efectivo.
- El monto pagado se convierte en crédito para futuros servicios, válido por 6 meses.

### balance_favor
- Al cancelar, el monto se convierte en crédito para futuros servicios, válido por 6 meses.
- No hay reembolsos en efectivo.

---

## 7. Caché

- **Ubicación:** KV namespace `SEGUIMIENTO`
- **TTL:** 24 horas
- **Versión actual:** v2 (clave con prefijo `v2:`)
- **Hash:** Normalización del texto del usuario (minúsculas, sin tildes, sin espacios extras)

---

## 8. Respuestas Mock (TEST_MODE)

Cuando `TEST_MODE=1` (solo en `.env` local, nunca en Cloudflare secrets), el bot responde sin llamar APIs externas:

| Intención | Respuesta mock |
|-----------|---------------|
| agendar | "Con gusto le ayudo a agendar. Para empezar, ¿me podría indicar su nombre completo?" |
| precio | "Gracias por su interés. Para darle una cotización personalizada necesito algunos datos. ¿Podría indicarme su nombre y el servicio que necesita?" |
| seguro | "Trabajamos con varias ARS. ¿Podría indicarme cuál es su seguro para verificar si tenemos convenio?" |
| horario | "Nuestro horario es..." |
| saludo | "Bienvenido a UNIDOLOR. ¿En qué puedo ayudarle?" |
| urgencia | "Esto parece una emergencia. Por favor acuda a la sala de urgencias más cercana o llame al 911." |
| cierre | "¡De nada! Quedamos atentos a cualquier otra consulta." |
| general | "Gracias por contactar a UNIDOLOR. ¿En qué puedo ayudarle?" |
