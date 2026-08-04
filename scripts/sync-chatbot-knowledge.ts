/**
 * sync-chatbot-knowledge.ts
 * ------------------------------------------------------------------
 * Sincroniza el conocimiento del ChatBot con la fuente única del CRM:
 *   - FAQs  → InstitutionalFAQ (MongoDB) → export `faq`
 *   - Servicios → Service (MongoDB)      → export `CATALOGO_COMPLETO`
 *   - Políticas/Horarios → @unidolor/core → export `politicas`/`horarios`
 *
 * Genera: apps/chatbot/src/knowledge-generated.js (NO editar a mano).
 *
 * Uso:
 *   pnpm run sync:knowledge            (usa DATABASE de apps/crm/backend/.env)
 *   DATABASE=mongodb://... pnpm run sync:knowledge
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { institutionalConfig } from '@unidolor/core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const CRM_BACKEND_ENV = path.join(REPO_ROOT, 'apps', 'crm', 'backend', '.env');
const OUTPUT_FILE = path.join(REPO_ROOT, 'apps', 'chatbot', 'src', 'knowledge-generated.js');

const { institucion, segurosConvenio } = institutionalConfig;

// ------------------------------------------------------------------
// Esquemas ligeros (solo campos que necesitamos; evita cargar el backend)
// ------------------------------------------------------------------
const FaqSchema = new mongoose.Schema(
  {
    removed: { type: Boolean, default: false },
    enabled: { type: Boolean, default: true },
    categoria: String,
    subcategoria: String,
    pregunta: String,
    respuesta: String,
    tags: [String],
    prioridad: Number,
  },
  { strict: false }
);
const ServiceSchema = new mongoose.Schema(
  {
    removed: { type: Boolean, default: false },
    enabled: { type: Boolean, default: true },
    name: String,
    cupsCode: String,
    description: String,
    grupoCatalogo: String,
    modalidad: String,
    tipoServicio: String,
    preguntasCotizacion: [String],
    requiereIndicacionMedica: Boolean,
    materiales: [String],
    personalRequerido: [String],
    tiempoEstimadoMin: Number,
    isActive: Boolean,
  },
  { strict: false }
);

const FaqModel = mongoose.model('InstitutionalFAQ', FaqSchema);
const ServiceModel = mongoose.model('Service', ServiceSchema);

// ------------------------------------------------------------------
// Mapeo heurístico pregunta/respuesta → intención del bot
// ------------------------------------------------------------------
const INTENCION_RULES: Array<{ pattern: RegExp; intencion: string }> = [
  // Identidad institucional + FAQs internas (nunca son un tema de servicio)
  { pattern: /que es unidolor|que hace unidolor|quien es unidolor|presentacion institucional|servicios ofrece|servicios con los que cuenta|que servicios tienen|manejo de situaciones|indicadores operativos|productividad|sistemas utiliza|acceder a los sistemas|problemas tecnicos|inteligencia artificial|reglas para la ia|consentimiento informado|ayudar al paciente|ayudar en el cuidado|como ayudar/i, intencion: 'general' },
  // Reprogramación/cancelación/reembolso (muy específicas)
  { pattern: /reprogram|reprogramar|cambio de fecha/i, intencion: 'reprogramacion' },
  { pattern: /cancelar|cancelaci|reembols|devolver|devuelven|dinero de vuelta/i, intencion: 'cancelacion' },
  // Servicios específicos (ganan sobre "seguro" que suele aparecer de pasada)
  { pattern: /quimioterapia|oncomejorate|inmunoterapia|biologicas/i, intencion: 'quimioterapia' },
  { pattern: /transfusi|hemohogar|sangre/i, intencion: 'transfusion' },
  { pattern: /hospitalizacion|internamiento|ingreso/i, intencion: 'hospitalizacion' },
  { pattern: /enfermeria|enfermero|curaciones|canalizac/i, intencion: 'enfermeria' },
  { pattern: /terapia fisica|rehabilitac|fisioterapia/i, intencion: 'terapia' },
  { pattern: /rayos\s*x|radiografia/i, intencion: 'rayosx' },
  { pattern: /sonografia.*(prepar|ayuno)|preparac.*sonografi/i, intencion: 'sonografia_prep' },
  { pattern: /preparac|ayuno|vejiga/i, intencion: 'sonografia_prep' },
  { pattern: /receta|medicamento controlado/i, intencion: 'receta' },
  { pattern: /paliativ/i, intencion: 'paliativos' },
  // Flujo/agendamiento
  { pattern: /solicit.*servicio domiciliar|proceso de solicitud/i, intencion: 'domicilio' },
  { pattern: /solicit.*propuesta|propuesta/i, intencion: 'empresarial' },
  { pattern: /agendar|cita|solicit|programar|reservar|apartar/i, intencion: 'agendar_cita' },
  { pattern: /necesito.*agendar|requisito|que necesito|datos.*agendar|documentos|documentacion|debo llevar|que llevar|que debo traer|indicacion medica|necesito orden|orden medica|referimiento/i, intencion: 'requisitos' },
  { pattern: /pacientes privados|atienden.*privados|particular/i, intencion: 'seguro' },
  // Temas institucionales
  { pattern: /precio|costo|tarifa|cuanto cuesta|cotiza|valor/i, intencion: 'precio' },
  { pattern: /horario de atencion|horario|cuando atienden|abierto|disponibilidad|domingo|sabado/i, intencion: 'horario' },
  { pattern: /domicili|visita a|visitas a|en casa|mejorate en casa/i, intencion: 'domicilio' },
  { pattern: /zona|cubr|ubicacion geografica|terrenas|nagua|santiago/i, intencion: 'cobertura' },
  { pattern: /pago|pagar|cuenta|transferencia|deposito|efectivo|tarjeta|banco/i, intencion: 'pago' },
  { pattern: /resultado|entrega.*(result|examen)|result.*entrega/i, intencion: 'resultados' },
  { pattern: /referir|referido|referimiento/i, intencion: 'general' },
  { pattern: /signos de alarma|alarma/i, intencion: 'emergencia' },
  { pattern: /comunicarme|contactar|contactarnos|contacto/i, intencion: 'ubicacion' },
  { pattern: /ubicad|donde estan|direccion|oficina|local/i, intencion: 'ubicacion' },
  { pattern: /emergencia|urgencia|911/i, intencion: 'emergencia' },
  { pattern: /dura.*consulta|cuanto dura/i, intencion: 'duracion' },
  { pattern: /empresa|empresarial|empleado|corporativo|jornada/i, intencion: 'empresarial' },
  { pattern: /factura|recibo|ncf/i, intencion: 'factura' },
  { pattern: /nimbo/i, intencion: 'nimbo' },
  { pattern: /contabil/i, intencion: 'contabilidad' },
  { pattern: /rrhh|recursos humanos|personal/i, intencion: 'rrhh' },
  { pattern: /bethania|dra\.|doctora|especialista/i, intencion: 'doctor' },
  // Seguro al final: solo cuando el tema REAL es seguro/ARS
  { pattern: /seguro|ars\b|aseguradora|afiliado|convenio.*(bupa|monumental|aps|colonial|aetna)|bupa|monumental|aps\b|colonial|metas|metasaud|aetna|humano|senasa|palic|universal|mapfre/i, intencion: 'seguro' },
];

// Normaliza: minúsculas + sin acentos (patrones escritos sin tildes)
function norm(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function inferirIntencion(faq: {
  pregunta: string;
  respuesta: string;
  categoria?: string;
  subcategoria?: string;
}): string {
  // 1) La PREGUNTA es la señal más fuerte (evita falsos positivos de la respuesta/tags)
  const pregunta = norm(faq.pregunta);
  for (const regla of INTENCION_RULES) {
    if (regla.pattern.test(pregunta)) return regla.intencion;
  }
  // 2) Contexto de clasificación (subcategoría/categoría son señales manuales confiables)
  const contexto = norm(`${faq.subcategoria || ''} ${faq.categoria || ''}`);
  for (const regla of INTENCION_RULES) {
    if (regla.pattern.test(contexto)) return regla.intencion;
  }
  // 3) La respuesta solo como refuerzo (puede mencionar temas de pasada)
  const respuesta = norm(faq.respuesta);
  for (const regla of INTENCION_RULES) {
    if (regla.pattern.test(respuesta)) return regla.intencion;
  }
  return 'general';
}

// ------------------------------------------------------------------
// Agrupación legible de servicios por grupoCatalogo
// ------------------------------------------------------------------
const GRUPO_TITULOS: Record<string, string> = {
  consultas_medicas: 'Consultas Médicas',
  medicina_dolor: 'Medicina del Dolor',
  procedimientos_intervencionistas: 'Procedimientos Intervencionistas',
  cuidados_paliativos: 'Cuidados Paliativos',
  enfermeria: 'Enfermería',
  rayos_x: 'Rayos X',
  sonografia: 'Sonografía / Ecografía',
  doppler_vascular: 'Doppler Vascular',
  estudios_cardiacos: 'Estudios Cardíacos',
  laboratorio: 'Laboratorio Clínico',
  hospitalizacion_domiciliaria: 'Hospitalización Domiciliaria',
  hemohogar: 'Hemohogar (Transfusiones)',
  oncomejorate: 'Oncomejórate (Quimioterapia)',
  terapias: 'Terapias',
  programas_especiales: 'Programas Especiales',
  programas_empresariales: 'Programas Empresariales',
  sin_clasificar: 'Otros Servicios',
};

interface ServiceDoc {
  name: string;
  cupsCode?: string;
  description?: string;
  grupoCatalogo?: string;
  preguntasCotizacion?: string[];
  requiereIndicacionMedica?: boolean;
  materiales?: string[];
  personalRequerido?: string[];
  tiempoEstimadoMin?: number;
}

function buildCatalogo(services: ServiceDoc[]) {
  const grupos = new Map<string, ServiceDoc[]>();
  for (const s of services) {
    const grupo = s.grupoCatalogo || 'sin_clasificar';
    if (!grupos.has(grupo)) grupos.set(grupo, []);
    grupos.get(grupo)!.push(s);
  }
  return Array.from(grupos.entries()).map(([grupo, lista]) => ({
    grupo,
    titulo: GRUPO_TITULOS[grupo] || grupo,
    total: lista.length,
    servicios: lista.map((s) => ({
      nombre: s.name,
      descripcion: s.description || '',
      cupsCode: s.cupsCode || null,
      preguntar: s.preguntasCotizacion || [],
      requiereIndicacionMedica: s.requiereIndicacionMedica || false,
      materiales: s.materiales || [],
      personalRequerido: s.personalRequerido || [],
      tiempoEstimadoMin: s.tiempoEstimadoMin || 0,
    })),
  }));
}

// ------------------------------------------------------------------
// Generación del archivo
// ------------------------------------------------------------------
function buildFile(faqs: any[], catalogo: any[]) {
  const faqExport = faqs.map((f) => ({
    pregunta: f.pregunta,
    respuesta: f.respuesta,
    intencion: f.intencion,
    categoria: f.categoria,
    subcategoria: f.subcategoria,
    tags: f.tags,
  }));

  const politicas = {
    pago: {
      metodo: 'Efectivo, transferencia bancaria, tarjeta (débito/crédito), cheque',
      cuenta: institucion.cuentaBancaria.numero,
      banco: institucion.cuentaBancaria.banco,
      titular: institucion.cuentaBancaria.titular,
      tipo: institucion.cuentaBancaria.tipo,
      rnc: institucion.rnc,
    },
    programacion: { plazo: '24 a 48 horas después de confirmación', corte_diario: '4:00 pm' },
    resultados: {
      plazo: '24 a 48 horas',
      envio: 'WhatsApp y correo electrónico',
      retiro_fisico: institucion.direccion,
    },
    cancelacion: {
      politica:
        'No ofrecemos reembolsos en efectivo. En su lugar, proporcionamos un crédito por el monto pagado, el cual podrá ser utilizado exclusivamente para futuros servicios dentro de los siguientes 6 meses. Para servicios continuos (ej. enfermería 24/7) se requiere aviso con al menos 1 mes de anticipación.',
      cotizacion_vigencia: '15 días',
    },
    oficinas: [institucion.direccion],
  };

  const horarios = {
    clinica: { lunes_a_viernes: '8:00am - 5:00pm', sabado: '8:00am - 12:00pm', domingo: 'Cerrado' },
    domicilio: { lunes_a_viernes: '8:00am - 6:00pm', sabado: 'Disponibilidad limitada', domingo: 'No laboramos' },
    corte_pago: '4:00 pm',
    programacion_servicios: '24 a 48 horas',
    entrega_resultados: '24 a 48 horas',
    zonas_cobertura: institucion.zonaCobertura,
    contactos: {
      telefonos: [institucion.telefono, institucion.whatsapp],
      emails: [institucion.email],
      websites: [institucion.website.replace(/^https?:\/\//, '')],
    },
    seguros_convenio: segurosConvenio,
  };

  const header = `/*
 * ============================================================
 *  GENERADO AUTOMÁTICAMENTE por scripts/sync-chatbot-knowledge.ts
 *  NO editar a mano. Fuentes: CRM MongoDB (InstitutionalFAQ,
 *  Service) + @unidolor/core. Regenerar con: pnpm run sync:knowledge
 * ============================================================
 */`;

  const content = `${header}

export const faq = ${JSON.stringify(faqExport, null, 2)};

export const politicas = ${JSON.stringify(politicas, null, 2)};

export const horarios = ${JSON.stringify(horarios, null, 2)};

export const CATALOGO_COMPLETO = ${JSON.stringify(catalogo, null, 2)};
`;

  writeFileSync(OUTPUT_FILE, content, 'utf8');
  return {
    faqs: faqExport.length,
    grupos: catalogo.length,
    servicios: catalogo.reduce((n, g) => n + g.total, 0),
  };
}

// ------------------------------------------------------------------
async function main() {
  let uri = process.env.DATABASE;
  if (!uri) {
    dotenv.config({ path: CRM_BACKEND_ENV, quiet: true });
    uri = process.env.DATABASE;
  }
  if (!uri) {
    console.error('ERROR: DATABASE no definida. Ej: pnpm run sync:knowledge o exportar DATABASE');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('Conectado a MongoDB...');

  const faqsRaw = await FaqModel.find({ removed: false, enabled: true }).sort({ prioridad: 1 }).lean();
  const faqs = faqsRaw.map((f: any) => ({
    pregunta: f.pregunta,
    respuesta: f.respuesta,
    categoria: f.categoria,
    subcategoria: f.subcategoria,
    tags: f.tags || [],
    intencion: inferirIntencion(f),
  }));

  const servicesRaw = await ServiceModel.find({ removed: false, enabled: true }).lean();
  const catalogo = buildCatalogo(servicesRaw as unknown as ServiceDoc[]);

  const stats = buildFile(faqs, catalogo);
  await mongoose.disconnect();

  console.log('knowledge-generated.js actualizado:');
  console.log(`  FAQs:       ${stats.faqs}`);
  console.log(`  Grupos:     ${stats.grupos}`);
  console.log(`  Servicios:  ${stats.servicios}`);
  console.log(`  Archivo:    ${OUTPUT_FILE}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
