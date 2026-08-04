export const fields = {
  tipo: {
    type: 'select',
    label: 'Reporte',
    options: [
      { value: '606', label: '606 - Compras' },
      { value: '607', label: '607 - Retenciones' },
      { value: '608', label: '608 - Ventas' },
      { value: '609', label: '609 - Anulados' },
    ],
  },
  mes: { type: 'number', label: 'Mes (1-12)' },
  anno: { type: 'number', label: 'Año' },
  status: {
    type: 'selectWithTranslation',
    options: [
      { value: 'draft', label: 'Borrador', color: 'gray' },
      { value: 'generated', label: 'Generado', color: 'blue' },
      { value: 'filed', label: 'Presentado', color: 'green' },
    ],
    renderAsTag: true,
    label: 'Estado',
  },
  totalRecords: { type: 'number', label: 'Registros', isDisabled: true },
  totalAmount: { type: 'currency', label: 'Total RD$', isDisabled: true },
};
