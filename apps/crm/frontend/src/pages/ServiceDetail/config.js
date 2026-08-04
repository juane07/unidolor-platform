import { 
  FileTextOutlined, DollarCircleOutlined, FileTextOutlined as QuoteIcon, CalendarOutlined
} from '@ant-design/icons';

export const serviceTabsConfig = [
  { key: 'summary', label: 'Resumen', icon: FileTextOutlined },
  { key: 'invoices', label: 'Facturas', icon: DollarCircleOutlined },
  { key: 'quotes', label: 'Cotizaciones', icon: QuoteIcon },
  { key: 'appointments', label: 'Citas', icon: CalendarOutlined },
];

export const summaryFields = [
  { key: 'name', label: 'Nombre' },
  { key: 'cupsCode', label: 'Código CUPS' },
  { key: 'simonLevel', label: 'Nivel SIMON' },
  { key: 'category', label: 'Categoría', type: 'tag' },
  { key: 'type', label: 'Tipo', type: 'tag' },
  { key: 'modalidad', label: 'Modalidad', type: 'tag' },
  { key: 'tipoServicio', label: 'Tipo de servicio', type: 'tag' },
  { key: 'grupoCatalogo', label: 'Grupo del catálogo', type: 'tag' },
  { key: 'clasificacion', label: 'Clasificación', type: 'tags' },
  { key: 'prioridadDefault', label: 'Prioridad', type: 'tag' },
  { key: 'tiempoEstimadoMin', label: 'Tiempo estimado (min)' },
  { key: 'requiereConsentimiento', label: 'Requiere consentimiento', type: 'boolean' },
  { key: 'requiereIndicacionMedica', label: 'Requiere indicación médica', type: 'boolean' },
  { key: 'basePrice', label: 'Precio Base', type: 'currency' },
  { key: 'materiales', label: 'Materiales', type: 'tags' },
  { key: 'personalRequerido', label: 'Personal requerido', type: 'tags' },
  { key: 'preguntasCotizacion', label: 'Preguntas para cotizar', type: 'tags' },
  { key: 'description', label: 'Descripción' },
];

export const invoicesColumns = [
  { dataIndex: 'invoiceNumber', title: 'Número Factura' },
  { dataIndex: 'invoiceYear', title: 'Año' },
  { dataIndex: 'invoiceDate', title: 'Fecha', type: 'date' },
  { dataIndex: 'client.name', title: 'Cliente' },
  { dataIndex: 'quantity', title: 'Cantidad' },
  { dataIndex: 'price', title: 'Precio Unit.', type: 'currency' },
  { dataIndex: 'total', title: 'Total', type: 'currency' },
  { dataIndex: 'status', title: 'Estado', type: 'tag' },
];

export const appointmentsColumns = [
  { dataIndex: 'date', title: 'Fecha', type: 'date' },
  { dataIndex: 'startTime', title: 'Hora Inicio' },
  { dataIndex: 'endTime', title: 'Hora Fin' },
  { dataIndex: 'type', title: 'Tipo', type: 'tag' },
  { dataIndex: 'status', title: 'Estado', type: 'tag' },
  { dataIndex: 'client.name', title: 'Paciente' },
  { dataIndex: 'doctor.name', title: 'Doctor' },
  { dataIndex: 'branch.name', title: 'Sucursal' },
];