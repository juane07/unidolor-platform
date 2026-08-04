export const fields = {
  company: {
    type: 'async',
    dataIndex: ['company', 'name'],
    entity: 'insurancecompany',
    displayLabels: ['name'],
    outputValue: '_id',
    label: 'ARS',
  },
  name: { type: 'string', label: 'Nombre del plan' },
  coveragePercent: { type: 'number', label: 'Cobertura (%)' },
  copayPercent: { type: 'number', label: 'Copago (%)' },
  isActive: { type: 'boolean', label: 'Activo' },
};
