// Requisitos unificados de la solicitud, compartidos por el bot WhatsApp y el
// formulario web /solicitud para que SIEMPRE pidan lo mismo.
//
// Documentos/fotos obligatorios: foto de cédula y foto de carnet de seguro.
// Números obligatorios (por texto o extraídos de la foto): cédula y afiliado.

export const REQUIRED_PHOTOS = {
  cedula: { label: 'cédula', message: '📷 Foto de su cédula', tipo: 'cedula' },
  seguro: { label: 'seguro', message: '📷 Foto del carnet de seguro', tipo: 'seguro' },
};

// Números que además deben registrarse en texto (o extraerse de la visión)
export const REQUIRED_NUMBERS = {
  cedula: { label: 'número de cédula', hint: '000-0000000-0' },
  afiliado: { label: 'número de afiliado/seguro', hint: '000-000000' },
};

export function missingPhotos(receivedImages = {}) {
  const missing = [];
  if (!receivedImages.cedula && !receivedImages.ambos) missing.push('cedula');
  if (!receivedImages.seguro && !receivedImages.ambos) missing.push('seguro');
  return missing;
}

export function missingNumbers(formData = {}) {
  const missing = [];
  if (!formData.cedula) missing.push('cedula');
  if (!formData.afiliado) missing.push('afiliado');
  return missing;
}

export function hasAllPhotos(receivedImages = {}) {
  return missingPhotos(receivedImages).length === 0;
}

export function hasAllNumbers(formData = {}) {
  return missingNumbers(formData).length === 0;
}

export function missingLabel(item) {
  return (REQUIRED_PHOTOS[item] || REQUIRED_NUMBERS[item] || {}).label || item;
}

// Construye el mensaje unificado que debe pedir el bot
export function buildRequirementsMessage(formData = {}, receivedImages = {}) {
  const faltanFotos = missingPhotos(receivedImages);
  const faltanNumeros = missingNumbers(formData);
  if (faltanFotos.length === 0 && faltanNumeros.length === 0) return '';
  const partes = [];
  for (const foto of faltanFotos) partes.push(REQUIRED_PHOTOS[foto].message);
  for (const num of faltanNumeros) partes.push(`📝 ${REQUIRED_NUMBERS[num].label} (${REQUIRED_NUMBERS[num].hint})`);
  return `Para completar la solicitud necesitamos:\n\u2022 ${partes.join('\n\u2022 ')}`;
}

// Requisitos que el formulario web marca como obligatorios (números)
export const FORM_REQUIRED_TEXT = ['cedula', 'afiliado'];