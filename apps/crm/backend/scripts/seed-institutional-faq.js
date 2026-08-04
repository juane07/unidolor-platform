const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

require('module-alias/register');
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

// Conectar a MongoDB
const DATABASE = process.env.DATABASE || process.env.MONGODB_URI;
if (!DATABASE) {
  console.error('❌ DATABASE no configurada en .env');
  process.exit(1);
}

mongoose.connect(DATABASE);

const InstitutionalFAQ = require('@/models/coreModels/InstitutionalFAQ');

const FAQ_PATH = 'C:\\Users\\nomei\\Documents\\Unidolor - Cerebro\\09_FAQ.md';

function parseFAQ(markdown) {
  const lines = markdown.split('\n');
  const faqs = [];
  
  let currentCategoria = '';
  let currentSubcategoria = '';
  let currentAudiencia = [];
  let currentQuestion = '';
  let inAnswer = false;
  let answerLines = [];
  let validadoEnConversaciones = 0;
  
  const categoriaToAudiencia = {
    'PACIENTES': ['paciente'],
    'FAMILIARES': ['familiar'],
    'MÉDICOS REFERIDORES': ['medico_referidor'],
    'EMPRESAS': ['empresa'],
    'ARS': ['ars'],
    'ENFERMERÍA': ['enfermeria'],
    'SECRETARIAS': ['secretaria'],
    'FACTURACIÓN': ['facturacion'],
    'GERENCIA': ['gerencia'],
    'TECNOLOGÍA': ['tecnologia'],
    'INTELIGENCIA ARTIFICIAL': ['ia'],
    'REGLAS INSTITUCIONALES': ['secretaria', 'enfermeria', 'facturacion', 'gerencia'],
    'MANTENIMIENTO': ['gerencia', 'tecnologia'],
    'OBJETIVO FINAL': ['gerencia'],
  };
  
  const subcategoriaToTags = {
    'Información General': ['general', 'información', 'servicios', 'ubicación', 'horario', 'contacto', 'cita', 'pacientes_privados', 'seguros'],
    'Consultas': ['consulta', 'preparación', 'indicación_médica', 'resultados', 'dolor', 'duración'],
    'Procedimientos': ['procedimiento', 'consentimiento', 'complicaciones'],
    'Medicina Domiciliaria': ['domicilio', 'mejórate_en_casa', 'solicitud', 'zonas', 'proceso'],
    'Hemohogar': ['hemohogar', 'transfusión', 'requisitos', 'sangre'],
    'Oncomejórate': ['oncomejórate', 'quimioterapia', 'inmunoterapia', 'infusiones'],
    'Programa Adulto Mayor': ['adulto_mayor', 'geriátrico', 'caídas', 'fracturas'],
    'Cuidados Paliativos': ['paliativos', 'cáncer', 'enfermedades_avanzadas'],
    'Facturación': ['facturación', 'pago', 'precios', 'cotización', 'ncf', 'factura'],
    'Manejo de situaciones comunes en chat': ['chat', 'secretaria', 'precio', 'seguros', 'urgencia', 'quejas'],
    'Datos institucionales para facturación': ['datos_institucionales', 'rnc', 'banco'],
    '¿Para qué utiliza UNIDOLOR Inteligencia Artificial?': ['ia', 'inteligencia_artificial', 'automatización'],
    'Reglas para la IA': ['ia', 'reglas', 'gobernanza'],
  };
  
  function saveCurrentFAQ() {
    if (currentQuestion && answerLines.length > 0) {
      faqs.push({
        categoria: currentCategoria,
        subcategoria: currentSubcategoria || 'General',
        pregunta: currentQuestion.trim(),
        respuesta: answerLines.join('\n').trim(),
        audiencia: currentAudiencia,
        tags: subcategoriaToTags[currentSubcategoria] || [],
        validadoEnConversaciones,
        prioridad: faqs.length + 1,
      });
      // console.log(`  ✓ [${currentCategoria} > ${currentSubcategoria}] ${currentQuestion}`);
    }
    currentQuestion = '';
    answerLines = [];
    inAnswer = false;
    validadoEnConversaciones = 0;
  }
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Detectar categoría principal (# PACIENTES, # FAMILIARES, etc.)
    if (trimmed.match(/^# [A-ZÁÉÍÓÚÑ ]+$/) && !trimmed.startsWith('##') && !trimmed.startsWith('###')) {
      // Guardar FAQ anterior si existe
      saveCurrentFAQ();
      
      currentCategoria = trimmed.replace('# ', '').trim();
      currentSubcategoria = '';
      currentAudiencia = categoriaToAudiencia[currentCategoria] || ['paciente'];
      continue;
    }
    
    // Detectar subcategoría (## Información General, ## Consultas, etc.)
    if (trimmed.startsWith('## ')) {
      // Guardar FAQ anterior si existe
      saveCurrentFAQ();
      
      currentSubcategoria = trimmed.replace('## ', '').trim();
      continue;
    }
    
    // Detectar validación de conversaciones
    const conversacionesMatch = trimmed.match(/\(Confirmado por ~(\d+) conversaciones?/);
    if (conversacionesMatch) {
      validadoEnConversaciones = parseInt(conversacionesMatch[1], 10);
      continue;
    }
    
    const mensajesMatch = trimmed.match(/Basado en el análisis de conversaciones reales/);
    if (mensajesMatch) {
      validadoEnConversaciones = 50; // estimado
      continue;
    }
    
    // Detectar pregunta (### ¿Qué es...?)
    if (trimmed.startsWith('### ¿') || trimmed.startsWith('### ¿')) {
      // Guardar FAQ anterior
      saveCurrentFAQ();
      
      currentQuestion = trimmed.replace('### ', '').trim();
      inAnswer = true;
      answerLines = [];
      validadoEnConversaciones = 0;
      continue;
    }
    
    // Detectar otras preguntas que empiezan con ### pero no con ¿
    if (trimmed.startsWith('### ') && !trimmed.startsWith('### ¿')) {
      saveCurrentFAQ();
      
      currentQuestion = trimmed.replace('### ', '').trim();
      inAnswer = true;
      answerLines = [];
      validadoEnConversaciones = 0;
      continue;
    }
    
    // Acumular respuesta
    if (inAnswer && currentQuestion) {
      // Detectar fin de sección (--- o # )
      if (trimmed.startsWith('---') || (trimmed.startsWith('# ') && !trimmed.startsWith('## ') && !trimmed.startsWith('### '))) {
        saveCurrentFAQ();
        continue;
      }
      answerLines.push(line);
    }
  }
  
  // Último FAQ
  saveCurrentFAQ();
  
  return faqs;
}

async function seedFAQ() {
  try {
    console.log('📖 Leyendo FAQ desde:', FAQ_PATH);
    const markdown = fs.readFileSync(FAQ_PATH, 'utf-8');
    
    console.log('🔍 Parseando FAQ...');
    const faqs = parseFAQ(markdown);
    console.log(`✅ Parseados ${faqs.length} FAQs`);
    
    // Mostrar resumen por categoría
    const byCategoria = {};
    faqs.forEach(f => {
      byCategoria[f.categoria] = (byCategoria[f.categoria] || 0) + 1;
    });
    console.log('\n📊 Por categoría:');
    Object.entries(byCategoria).forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count}`);
    });
    
    // Limpiar colección existente
    console.log('\n🗑️  Limpiando FAQs existentes...');
    await InstitutionalFAQ.deleteMany({});
    
    // Insertar nuevos
    console.log('💾 Insertando FAQs...');
    const inserted = await InstitutionalFAQ.insertMany(faqs);
    console.log(`✅ Insertados ${inserted.length} FAQs`);
    
    // Verificar
    const count = await InstitutionalFAQ.countDocuments({ enabled: true, removed: false });
    console.log(`🔍 Verificación: ${count} FAQs activos en BD`);
    
    // Mostrar algunos ejemplos
    const ejemplos = await InstitutionalFAQ.find({ enabled: true, removed: false })
      .sort({ categoria: 1, subcategoria: 1, prioridad: 1 })
      .limit(10)
      .select('categoria subcategoria pregunta validadoEnConversaciones');
    console.log('\n📝 Ejemplos:');
    ejemplos.forEach((f, i) => {
      console.log(`  ${i+1}. [${f.categoria} > ${f.subcategoria}] ${f.pregunta} (validado: ${f.validadoEnConversaciones})`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Desconectado de MongoDB');
    process.exit(0);
  }
}

seedFAQ();