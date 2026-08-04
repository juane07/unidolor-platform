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
  branch: {
    type: 'async',
    dataIndex: ['branch', 'name'],
    entity: 'branch',
    displayLabels: ['name'],
    outputValue: '_id',
    label: 'Sucursal',
  },
  date: {
    type: 'date',
    label: 'Fecha',
  },
  startTime: {
    type: 'time',
    required: true,
    label: 'Hora inicio',
  },
  endTime: {
    type: 'time',
    required: true,
    label: 'Hora fin',
  },
  duration: {
    type: 'number',
    label: 'Duración (min)',
  },
  type: {
    type: 'selectWithTranslation',
    options: [
      { value: 'primera_vez', label: 'Primera vez', color: 'blue' },
      { value: 'seguimiento', label: 'Seguimiento', color: 'green' },
      { value: 'urgencia', label: 'Urgencia', color: 'red' },
      { value: 'visita_domiciliaria', label: 'Visita domiciliaria', color: 'purple' },
    ],
    renderAsTag: true,
    label: 'Tipo',
  },
  status: {
    type: 'selectWithTranslation',
    options: [
      { value: 'programada', label: 'Programada', color: 'blue' },
      { value: 'realizada', label: 'Realizada', color: 'green' },
      { value: 'cancelada', label: 'Cancelada', color: 'red' },
      { value: 'no_asistio', label: 'No asistió', color: 'orange' },
    ],
    renderAsTag: true,
    label: 'Estado',
  },
  notes: {
    type: 'textarea',
    label: 'Notas',
  },
};

export const domiciliaryFields = {
  serviceName: {
    type: 'string',
    label: 'Servicio solicitado',
  },
  policyNumber: {
    type: 'string',
    label: 'Número de póliza',
  },
  sector: {
    type: 'string',
    label: 'Sector',
  },
  familyName: {
    type: 'string',
    label: 'Familiar / Responsable - Nombre y Apellido',
  },
  familyIdNumber: {
    type: 'string',
    label: 'Familiar / Responsable - Núm. documento',
  },
  familyPhone: {
    type: 'string',
    label: 'Familiar / Responsable - Teléfono',
  },
  familyDomicile: {
    type: 'string',
    label: 'Familiar / Responsable - Domicilio',
  },
  familyEmail: {
    type: 'email',
    label: 'Familiar / Responsable - Mail',
  },
};
