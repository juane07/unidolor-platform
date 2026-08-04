export const fields = {
  name: {
    type: 'string',
    label: 'Nombre',
  },
  specialty: {
    type: 'string',
    label: 'Especialidad',
  },
  phone: {
    type: 'phone',
    label: 'Teléfono',
  },
  email: {
    type: 'email',
    label: 'Email',
  },
  commissionRate: {
    type: 'number',
    label: 'Comisión (%)',
  },
  branch: {
    type: 'async',
    dataIndex: ['branch', 'name'],
    entity: 'branch',
    displayLabels: ['name'],
    outputValue: '_id',
    label: 'Sucursal',
  },
  isActive: {
    type: 'boolean',
    label: 'Activo',
  },
};
