export const fields = {
  invoice: {
    type: 'async',
    dataIndex: ['invoice', 'number'],
    entity: 'invoice',
    displayLabels: ['number'],
    outputValue: '_id',
    label: 'Factura',
  },
  ncf: { type: 'string', label: 'NCF' },
  ncfTipo: {
    type: 'select',
    label: 'Tipo NCF',
    options: [
      { value: '01', label: '01 - Crédito fiscal' },
      { value: '02', label: '02 - Consumo' },
    ],
  },
  regimen: {
    type: 'select',
    label: 'Régimen',
    options: [
      { value: 'RST', label: 'RST' },
      { value: 'RDL', label: 'RDL' },
      { value: 'RGN', label: 'RGN' },
    ],
  },
  dgiiStatus: {
    type: 'selectWithTranslation',
    options: [
      { value: 'pending', label: 'Pendiente', color: 'orange' },
      { value: 'submitted', label: 'Enviado', color: 'blue' },
      { value: 'approved', label: 'Aprobado', color: 'green' },
      { value: 'rejected', label: 'Rechazado', color: 'red' },
    ],
    renderAsTag: true,
    label: 'Estado DGII',
  },
  submittedAt: { type: 'date', label: 'Fecha envío' },
  approvedAt: { type: 'date', label: 'Fecha aprobación' },
  errorMessage: { type: 'textarea', label: 'Error' },
};
