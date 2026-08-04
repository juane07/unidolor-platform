const tipoOptions = [
  { value: '01', label: '01 - Factura de crédito fiscal' },
  { value: '02', label: '02 - Factura de consumo' },
  { value: '03', label: '03 - Nota de débito' },
  { value: '04', label: '04 - Nota de crédito' },
  { value: '05', label: '05 - Comprobante de compras' },
  { value: '06', label: '06 - Registro único de ingreso' },
  { value: '07', label: '07 - Comprobante de pago al exterior' },
  { value: '08', label: '08 - Factura gubernamental' },
  { value: '09', label: '09 - Comprobante para gastos menores' },
  { value: '10', label: '10 - Nota de crédito para gastos menores' },
  { value: '11', label: '11 - Comprobante de regímenes especiales' },
  { value: '12', label: '12 - Comprobante de pago de nómina' },
  { value: '13', label: '13 - Comprobante de donaciones' },
  { value: '14', label: '14 - Comprobante para exportaciones' },
  { value: '15', label: '15 - Comprobante para proveedores del exterior' },
];

export const fields = {
  tipo: {
    type: 'select',
    label: 'Tipo NCF',
    options: tipoOptions,
  },
  nombre: { type: 'string', label: 'Nombre' },
  regimen: {
    type: 'select',
    label: 'Régimen',
    options: [
      { value: 'RST', label: 'RST - Simplificado' },
      { value: 'RDL', label: 'RDL - Asalariado' },
      { value: 'RGN', label: 'RGN - Normal' },
    ],
  },
  secuenciaActual: { type: 'number', label: 'Secuencia actual' },
  rangoDesde: { type: 'number', label: 'Rango desde' },
  rangoHasta: { type: 'number', label: 'Rango hasta' },
  vigenciaDesde: { type: 'date', label: 'Vigencia desde' },
  vigenciaHasta: { type: 'date', label: 'Vigencia hasta' },
  isActive: { type: 'boolean', label: 'Activo' },
};
