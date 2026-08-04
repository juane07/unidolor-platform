export const fields = {
  invoice: {
    type: 'async',
    dataIndex: ['invoice', 'number'],
    entity: 'invoice',
    displayLabels: ['number'],
    outputValue: '_id',
    label: 'Factura',
  },
  branch: {
    type: 'async',
    dataIndex: ['branch', 'name'],
    entity: 'branch',
    displayLabels: ['name'],
    outputValue: '_id',
    label: 'Sucursal',
  },
  client: {
    type: 'search',
    dataIndex: ['client', 'name'],
    entity: 'client',
    displayLabels: ['name'],
    searchFields: 'name',
    outputValue: '_id',
    label: 'Cliente',
  },
  tipo: {
    type: 'select',
    label: 'Tipo',
    options: [
      { value: 'ITBIS', label: 'ITBIS' },
      { value: 'ISR', label: 'ISR' },
    ],
  },
  percentage: { type: 'number', label: '% Retención' },
  baseAmount: { type: 'currency', label: 'Base imponible' },
  amount: { type: 'currency', label: 'Monto retenido' },
  ncf: { type: 'string', label: 'NCF' },
  date: { type: 'date', label: 'Fecha' },
  status: {
    type: 'selectWithTranslation',
    options: [
      { value: 'active', label: 'Activa', color: 'green' },
      { value: 'cancelled', label: 'Anulada', color: 'red' },
    ],
    renderAsTag: true,
    label: 'Estado',
  },
};
