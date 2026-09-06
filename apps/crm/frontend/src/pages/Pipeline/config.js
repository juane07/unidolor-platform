export const fields = {
  client: {
    type: 'search',
    dataIndex: ['client', 'name'],
    entity: 'client',
    displayLabels: ['name'],
    searchFields: 'name',
    outputValue: 'id',
    label: 'Cliente',
  },
  stage: {
    type: 'selectWithTranslation',
    options: [
      { value: 'cotizacion', label: 'Cotización', color: 'blue' },
      { value: 'cita_solicitada', label: 'Cita solicitada', color: 'cyan' },
      { value: 'cita_programada', label: 'Cita programada', color: 'geekblue' },
      { value: 'visita', label: 'Visita realizada', color: 'gold' },
      { value: 'orden_servicio', label: 'Orden de servicio', color: 'purple' },
      { value: 'factura', label: 'Facturado', color: 'green' },
      { value: 'seguimiento', label: 'Seguimiento', color: 'cyan' },
      { value: 'perdido', label: 'Perdido', color: 'red' },
    ],
    renderAsTag: true,
    label: 'Etapa',
  },
  service: {
    type: 'string',
    label: 'Servicio',
  },
  source: {
    type: 'selectWithTranslation',
    options: [
      { value: 'whatsapp', label: 'WhatsApp', color: 'green' },
      { value: 'manual', label: 'Manual', color: 'blue' },
      { value: 'web', label: 'Web', color: 'cyan' },
      { value: 'referido', label: 'Referido', color: 'gold' },
    ],
    renderAsTag: true,
    label: 'Origen',
  },
  amount: {
    type: 'currency',
    label: 'Monto',
  },
  notes: {
    type: 'textarea',
    label: 'Notas',
  },
};
