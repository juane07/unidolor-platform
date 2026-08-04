export const fields = {
  client: {
    type: 'search',
    dataIndex: ['client', 'name'],
    entity: 'client',
    displayLabels: ['name'],
    searchFields: 'name',
    outputValue: '_id',
    label: 'Paciente',
  },
  doctor: {
    type: 'async',
    dataIndex: ['doctor', 'name'],
    entity: 'doctor',
    displayLabels: ['name'],
    outputValue: '_id',
    label: 'Doctor',
  },
  date: {
    type: 'date',
    label: 'Fecha',
  },
  modalidad: {
    type: 'selectWithTranslation',
    options: [
      { value: 'clinica', label: 'Clínica', color: 'blue' },
      { value: 'domicilio', label: 'Domicilio', color: 'green' },
      { value: 'telemedicina', label: 'Telemedicina', color: 'cyan' },
    ],
    renderAsTag: true,
    label: 'Modalidad',
  },
  tipoServicio: {
    type: 'selectWithTranslation',
    options: [
      { value: 'consulta', label: 'Consulta', color: 'blue' },
      { value: 'procedimiento', label: 'Procedimiento', color: 'purple' },
      { value: 'diagnostico', label: 'Diagnóstico', color: 'cyan' },
      { value: 'enfermeria', label: 'Enfermería', color: 'green' },
      { value: 'hospitalizacion_domiciliaria', label: 'Hospitalización domiciliaria', color: 'orange' },
      { value: 'programa_especial', label: 'Programa especial', color: 'magenta' },
    ],
    renderAsTag: true,
    label: 'Tipo de servicio',
  },
  diagnosis: {
    type: 'textarea',
    label: 'Diagnóstico',
  },
  treatment: {
    type: 'textarea',
    label: 'Tratamiento',
  },
  prescription: {
    type: 'textarea',
    label: 'Prescripción',
  },
  evolutionNotes: {
    type: 'textarea',
    label: 'Notas de evolución',
  },
  'dolor.intensidad': {
    type: 'number',
    dataIndex: ['dolor', 'intensidad'],
    label: 'Dolor (0-10)',
  },
};
