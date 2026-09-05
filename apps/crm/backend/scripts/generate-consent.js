/*
 * UNIDOLOR — Generador de Consentimientos Informados (PDF)
 * Ejecutar: cd apps/crm/backend && node scripts/generate-consent.js
 * Requiere: puppeteer-core (ya instalado en backend)
 *
 * Cumple con:
 * - Ley 42-01 Art. 28 (Ley General de Salud)
 * - Reglamento Técnico del Expediente Clínico (MSP)
 * - Jurisprudencia SCJ 2015-2025
 * - Ley 74-25 (Nuevo Código Penal) Art. 8 compliance
 */

const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

// ── CSS compacto para 1 página ──
const PDF_CSS = `
@page { size: A4 portrait; margin: 30px 35px; }
* { box-sizing: border-box; }
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 8.5pt;
  line-height: 1.3;
  color: #1a1a1a;
  padding: 0;
  margin: 0;
}
.header {
  text-align: center;
  border-bottom: 2px solid #1a3a5c;
  padding-bottom: 6px;
  margin-bottom: 6px;
}
.header h2 {
  color: #1a3a5c;
  margin: 0;
  font-size: 11pt;
  border: none;
  padding: 0;
}
.header .company {
  font-weight: bold;
  font-size: 9pt;
  margin: 2px 0;
}
.meta-table {
  width: 100%;
  border-collapse: collapse;
  margin: 4px 0;
  font-size: 8pt;
}
.meta-table td {
  padding: 2px 4px;
  vertical-align: top;
}
.meta-label { font-weight: bold; white-space: nowrap; }
.line { border-bottom: 1px solid #333; display: inline-block; min-width: 100px; height: 14px; }
.line.wide { min-width: 280px; }
.line.medium { min-width: 150px; }
.line.short { min-width: 80px; }
.name-block {
  margin: 5px 0;
  padding: 4px 6px;
  border: 1px solid #ccc;
  border-radius: 3px;
  background: #fafafa;
}
.name-block p { margin: 2px 0; }
.name-row {
  display: flex;
  align-items: flex-end;
  margin: 4px 0;
}
.name-underline {
  flex: 1;
  border-bottom: 1px solid #333;
  min-height: 18px;
}
h3 {
  color: #2c5282;
  margin: 6px 0 2px 0;
  font-size: 8.5pt;
  border-bottom: none;
}
p { text-align: justify; margin: 2px 0; }
strong { color: #1a3a5c; }
ul { margin: 2px 0 2px 12px; padding-left: 10px; }
li { margin: 1px 0; }
.signature-grid {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
}
.sig-box {
  width: 30%;
  text-align: center;
  font-size: 7.5pt;
}
.sig-line {
  border-top: 1px solid #333;
  margin-top: 25px;
  padding-top: 3px;
}
.version {
  text-align: center;
  font-size: 7pt;
  color: #888;
  margin-top: 4px;
}
.disclaimer {
  font-size: 7pt;
  color: #666;
  border-top: 1px solid #ddd;
  padding-top: 3px;
  margin-top: 4px;
}
`;

// ── Template común ──
function buildConsent({ title, procedureName, description, benefits, risks, alternatives, extraSections, version, hasDoctor }) {
  return `
<div class="header">
  <h2>${title}</h2>
  <div class="company">Unidad Intervencionista de Dolor y Cuidados Paliativos S.R.L.</div>
</div>
<table class="meta-table">
  <tr><td class="meta-label">Establecimiento:</td><td><span class="line wide">Unidad Intervencionista de Dolor y Cuidados Paliativos S.R.L.</span></td></tr>
  <tr><td class="meta-label">Médico tratante:</td><td><span class="line wide"></span></td></tr>
  <tr><td class="meta-label">Lugar y fecha:</td><td><span class="line wide"></span></td></tr>
</table>
<div class="name-block">
  <p><strong>AUTORIZACIÓN DEL PACIENTE</strong></p>
  <p><strong>Yo,</strong></p>
  <div class="name-row"><span class="name-underline"></span></div>
  <p>portador(a) de la cédula de identidad N.º <span class="line medium"></span>,
  de forma libre, expresa e informada, <strong>AUTORIZO</strong> al personal médico de
  <strong>Unidad Intervencionista de Dolor y Cuidados Paliativos S.R.L.</strong> para que me realice el siguiente procedimiento:</p>
  <p style="text-align:center; margin:4px 0;"><strong>${procedureName}</strong></p>
</div>
<h3>DESCRIPCIÓN DEL PROCEDIMIENTO</h3>
<p>${description}</p>
<h3>BENEFICIOS ESPERADOS</h3>
<ul>${benefits.map(b => `<li>${b}</li>`).join('')}</ul>
<h3>RIESGOS Y POSIBLES COMPLICACIONES</h3>
<ul>${risks.map(r => `<li>${r}</li>`).join('')}</ul>
<h3>ALTERNATIVAS AL PROCEDIMIENTO</h3>
<p>${alternatives}</p>
${extraSections || ''}
<h3>AUTORIZACIÓN PARA CONTINGENCIAS</h3>
<p>Autorizo al personal de salud para la atención de contingencias y urgencias derivadas del acto autorizado,
atendiendo al principio de libertad prescriptiva.</p>
<h3>DERECHOS DEL PACIENTE</h3>
<ul>
  <li>Derecho a recibir información completa antes del procedimiento.</li>
  <li>Derecho a formular preguntas y recibir respuestas claras.</li>
  <li>Derecho a retirar este consentimiento en cualquier momento antes de que se inicie la intervención.</li>
  <li>Derecho a recibir copia de este documento.</li>
</ul>
<div class="signature-grid">
  <div class="sig-box"><div class="sig-line">Firma del paciente o representante</div></div>
  <div class="sig-box"><div class="sig-line">Firma del médico tratante</div></div>
  <div class="sig-box"><div class="sig-line">Firma del testigo</div></div>
</div>
<p class="version">${version} — Unidad Intervencionista de Dolor y Cuidados Paliativos S.R.L. — Conforme Ley 42-01, Reglamento Expediente Clínico, Ley 74-25</p>
<p class="disclaimer">Este documento se emite en dos (2) ejemplares de igual tenor: uno para el paciente y otro para el expediente clínico.
Conserve este documento. Es su derecho.</p>`;
}

// ── Templates ──
const CONSENT_TEMPLATES = [
  {
    id: 'CONSENT_INFILTRACION',
    nombre: 'Consentimiento Informado — Infiltraciones',
    version: 'Versión 3.1',
    html: buildConsent({
      title: 'CONSENTIMIENTO INFORMADO PARA INFILTRACIONES',
      procedureName: 'INFILTRACIONES',
      description: 'Las infiltraciones consisten en la inyección de medicamentos (anestésicos locales, corticoides y/u otros fármacos) en articulaciones, tejidos blandos, puntos gatillo o estructuras anatómicas específicas, con fines terapéuticos (alivio del dolor, reducción de inflamación, mejoría funcional). Puede realizarse con o sin guía ecográfica.',
      benefits: ['Reducción del dolor en la zona tratada.', 'Disminución de la inflamación.', 'Mejora de la movilidad y función.'],
      risks: ['<strong>Frecuentes:</strong> dolor temporal en el sitio de inyección, enrojecimiento, inflamación leve.', '<strong>Poco frecuentes:</strong> infección en el sitio de punción, hematoma, reacción alérgica al medicamento.', '<strong>Raros:</strong> lesión nerviosa, daño vascular, complicaciones sistémicas.'],
      alternatives: 'Medicamentos orales, fisioterapia, cirugía u otras modalidades que su médico le indicará.',
      version: 'Versión 3.1',
    }),
  },
  {
    id: 'CONSENT_BLOQUEO',
    nombre: 'Consentimiento Informado — Neurolisis',
    version: 'Versión 2.2',
    html: buildConsent({
      title: 'CONSENTIMIENTO INFORMADO PARA NEUROLISIS',
      procedureName: 'NEUROLISIS (BLOQUEOS NERVIOSOS)',
      description: 'La neurolisis (también denominada bloqueo nervioso) es la inyección de anestésicos locales y/o corticoides cerca de un nervio o grupo de nervios, con fines diagnósticos o terapéuticos. Puede realizarse con guía ecográfica o fluoroscópica. Incluye bloqueos periféricos, simpáticos, de plexo y de otra localización.',
      benefits: ['Alivio del dolor agudo o crónico.', 'Mejora de la función neuromuscular.', 'Reducción del uso de analgésicos orales.'],
      risks: ['<strong>Frecuentes:</strong> dolor transitorio en el sitio de punción, parestesia temporal.', '<strong>Poco frecuentes:</strong> hematomas, infección, hipotensión ortostática.', '<strong>Raros:</strong> lesión nerviosa permanente, toxicidad por anestésico local, neumotórax (en bloqueos del plano cervical).'],
      alternatives: 'Tratamiento oral, infiltraciones, fisioterapia, intervención quirúrgica.',
      version: 'Versión 2.2',
    }),
  },
  {
    id: 'CONSENT_RADIOFRECUENCIA',
    nombre: 'Consentimiento Informado — Radiofrecuencia',
    version: 'Versión 2.1',
    html: buildConsent({
      title: 'CONSENTIMIENTO INFORMADO PARA RADIOFRECUENCIA',
      procedureName: 'RADIOFRECUENCIA (Corporal, Rizólisis o Neurotomía)',
      description: 'La radiofrecuencia utiliza energía de radiofrecuencia para generar calor controlado en estructuras nerviosas específicas, interrumpiendo la transmisión del dolor. Puede ser pulsada (diagnóstica) o continua (terapéutica). Incluye rizólisis y neurotomía por radiofrecuencia.',
      benefits: ['Alivio del dolor crónico de moderado a severo.', 'Reducción significativa del uso de analgésicos.', 'Mejora de la calidad de vida y función.'],
      risks: ['<strong>Frecuentes:</strong> dolor temporal, enrojecimiento en el sitio de punción.', '<strong>Poco frecuentes:</strong> hematoma, hinchazón, irritación nerviosa transitoria.', '<strong>Raros:</strong> lesión nerviosa permanente, infección, quemadura en piel.'],
      alternatives: 'Infiltraciones, neurolisis, medicamentos orales, cirugía.',
      version: 'Versión 2.1',
    }),
  },
  {
    id: 'CONSENT_IMAGENES',
    nombre: 'Consentimiento Informado — Estudios de Imágenes',
    version: 'Versión 1.1',
    html: buildConsent({
      title: 'CONSENTIMIENTO INFORMADO PARA ESTUDIOS DE IMÁGENES',
      procedureName: 'ESTUDIOS DE IMÁGENES (Rayos X, Ecografía, etc.)',
      description: 'El estudio de imagen es un procedimiento diagnóstico que utiliza tecnología (rayos X, ecografía, etc.) para obtener imágenes del interior del cuerpo con fines médicos. Las imágenes serán interpretadas por un radiólogo certificado.',
      benefits: ['Diagnóstico preciso de la condición médica.', 'Resultados en un plazo de 24 a 48 horas.', 'Procedimiento no invasivo y de bajo riesgo.'],
      risks: ['En caso de Rayos X, existe exposición mínima a radiación ionizante.', 'Posible molestia menor por posición durante el estudio.', 'Raramente, reacción alérgica al contraste (si se utiliza).'],
      alternatives: 'Otros estudios diagnósticos (resonancia magnica, tomografía, etc.) que su médico le indicará.',
      version: 'Versión 1.1',
    }),
  },
  {
    id: 'CONSENT_ENFERMERIA',
    nombre: 'Consentimiento Informado — Procedimientos de Enfermería',
    version: 'Versión 1.1',
    html: buildConsent({
      title: 'CONSENTIMIENTO INFORMADO PARA PROCEDIMIENTOS DE ENFERMERÍA',
      procedureName: 'PROCEDIMIENTOS DE ENFERMERÍA',
      description: 'Procedimientos de enfermería que incluyen: canalización venosa, administración de medicamentos (IM, SC, IV), nebulizaciones, colocación/retiro de sondas, curaciones y otros procedimientos de enfermería según indicación médica.',
      benefits: ['Atención profesional calificada.', 'Cumplimiento del tratamiento médico indicado.', 'Mejora de la condición de salud.'],
      risks: ['<strong>Frecuentes:</strong> dolor en el sitio de punción, hematoma leve.', '<strong>Poco frecuentes:</strong> infección en el sitio de punción, reacción alérgica al medicamento.', '<strong>Raros:</strong> lesión nerviosa, tromboflebitis.'],
      alternatives: 'Otros métodos de administración de medicamentos o tratamientos que su médico le indicará.',
      version: 'Versión 1.1',
    }),
  },
  {
    id: 'CONSENT_CURACION',
    nombre: 'Consentimiento Informado — Curaciones',
    version: 'Versión 1.1',
    html: buildConsent({
      title: 'CONSENTIMIENTO INFORMADO PARA CURACIONES',
      procedureName: 'CURACIONES DE HERIDAS',
      description: 'Las curaciones consisten en la limpieza, desinfección y cubrimiento de heridas utilizando materiales estériles y soluciones antisépticas. Se seguirán las indicaciones médicas para frecuencia y tipo de curación.',
      benefits: ['Prevención de infección.', 'Promoción de la cicatrización.', 'Monitoreo de la evolución de la herida.'],
      risks: ['Molestias leves temporales durante el procedimiento.', 'Posible reacción alérgica a soluciones antisépticas (raro).', 'Riesgo mínimo de infección si se siguenprotocolos de asepsia.'],
      alternatives: 'Tratamiento tópico alternativo, curación por el paciente o cuidador (con capacitación), otros métodos que su médico le indicará.',
      version: 'Versión 1.1',
    }),
  },
  {
    id: 'CONSENT_TRANSFUSION',
    nombre: 'Consentimiento Informado — Transfusiones',
    version: 'Versión 2.1',
    html: buildConsent({
      title: 'CONSENTIMIENTO INFORMADO PARA TRANSFUSIONES',
      procedureName: 'TRANSFUSIÓN DE SANGRE Y/O HEMODERIVADOS',
      description: 'La transfusión consiste en administrar sangre o productos derivados de la sangre por vía intravenosa. La sangre utilizada proviene de donantes voluntarios y ha sido sometida a pruebas de tamizaje obligatorias.',
      benefits: ['Restauración de la capacidad de transporte de oxígeno.', 'Prevención de complicaciones por anemia severa.', 'Mejora del estado clínico general.'],
      risks: ['<strong>Frecuentes:</strong> fiebre, urticaria leve.', '<strong>Poco frecuentes:</strong> reacción hemolítica, infección.', '<strong>Raros:</strong> reacción anafiláctica, sobrecarga circulatoria, enfermedad injerto contra huésped.'],
      alternatives: 'Medicamentos eritropoyéticos, suplementos de hierro,nutrición parenteral, según indicación médica.',
      version: 'Versión 2.1',
      extraSections: `
<h3>REQUISITOS PREVIOS</h3>
<ul>
  <li>Indicación médica con diagnóstico.</li>
  <li>Hemograma completo reciente.</li>
  <li>Sangre autorizada por Banco de Sangre.</li>
  <li>Pruebas cruzadas realizadas.</li>
</ul>`,
    }),
  },
];

async function generatePDFs() {
  console.log('Generando consentimientos informados (cumple Ley 42-01, Reglamento Expediente Clínico, Ley 74-25)...\n');

  const outputDir = path.join(__dirname, '..', '..', '..', '..', 'consentimientos');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  for (const template of CONSENT_TEMPLATES) {
    const filename = `${template.id}.pdf`;
    const filepath = path.join(outputDir, filename);

    const page = await browser.newPage();
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>${PDF_CSS}</style>
      </head>
      <body>
        ${template.html}
      </body>
      </html>
    `);

    await page.pdf({
      path: filepath,
      format: 'A4',
      printBackground: true,
      margin: { top: '30px', right: '35px', bottom: '30px', left: '35px' },
    });

    await page.close();
    console.log(`✅ ${filename}`);
  }

  await browser.close();
  console.log(`\n🎉 ${CONSENT_TEMPLATES.length} PDFs generados en: ${outputDir}`);
}

generatePDFs().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
