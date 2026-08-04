import { 
  UserOutlined, CalendarOutlined, FileTextOutlined, DollarCircleOutlined,
  CreditCardOutlined, TransactionOutlined, SafetyOutlined, BankOutlined
} from '@ant-design/icons';

export const tabsConfig = [
  { key: 'summary', label: 'Resumen', icon: UserOutlined },
  { key: 'appointments', label: 'Citas', icon: CalendarOutlined },
  { key: 'clinical', label: 'Historial Clínico', icon: FileTextOutlined },
  { key: 'invoices', label: 'Facturas', icon: DollarCircleOutlined },
  { key: 'quotes', label: 'Cotizaciones', icon: FileTextOutlined },
  { key: 'payments', label: 'Pagos', icon: CreditCardOutlined },
  { key: 'opportunities', label: 'Oportunidades', icon: TransactionOutlined },
  { key: 'ars', label: 'ARS', icon: SafetyOutlined },
  { key: 'withholdings', label: 'Retenciones', icon: BankOutlined },
];

export const summaryFields = [
  { key: 'name', label: 'Nombre' },
  { key: 'type', label: 'Tipo', type: 'tag' },
  { key: 'identity_number', label: 'Cédula/RNC' },
  { key: 'phone', label: 'Teléfono', type: 'phone' },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'address', label: 'Dirección' },
  { key: 'country', label: 'País' },
];

export const appointmentsColumns = [
  { dataIndex: 'date', title: 'Fecha', type: 'date' },
  { dataIndex: 'startTime', title: 'Hora Inicio' },
  { dataIndex: 'endTime', title: 'Hora Fin' },
  { dataIndex: 'type', title: 'Tipo', type: 'tag' },
  { dataIndex: 'status', title: 'Estado', type: 'tag' },
  { dataIndex: 'doctor.name', title: 'Doctor' },
  { dataIndex: 'branch.name', title: 'Sucursal' },
  { dataIndex: 'serviceName', title: 'Servicio' },
];

export const clinicalColumns = [
  { dataIndex: 'date', title: 'Fecha', type: 'date' },
  { dataIndex: 'tipoServicio', title: 'Tipo', type: 'tag' },
  { dataIndex: 'modalidad', title: 'Modalidad', type: 'tag' },
  { dataIndex: 'diagnosis', title: 'Diagnóstico' },
  { dataIndex: 'treatment', title: 'Tratamiento' },
  { dataIndex: 'doctor.name', title: 'Doctor' },
  { dataIndex: 'dolor.intensidad', title: 'Dolor' },
  { dataIndex: 'prescription', title: 'Receta' },
];

export const invoicesColumns = [
  { dataIndex: 'number', title: 'Número' },
  { dataIndex: 'year', title: 'Año' },
  { dataIndex: 'date', title: 'Fecha', type: 'date' },
  { dataIndex: 'total', title: 'Total', type: 'currency' },
  { dataIndex: 'status', title: 'Estado', type: 'tag' },
  { dataIndex: 'branch.name', title: 'Sucursal' },
  { dataIndex: 'doctor.name', title: 'Doctor' },
];

export const quotesColumns = [
  { dataIndex: 'number', title: 'Número' },
  { dataIndex: 'year', title: 'Año' },
  { dataIndex: 'date', title: 'Fecha', type: 'date' },
  { dataIndex: 'total', title: 'Total', type: 'currency' },
  { dataIndex: 'status', title: 'Estado', type: 'tag' },
];

export const paymentsColumns = [
  { dataIndex: 'number', title: 'Número' },
  { dataIndex: 'date', title: 'Fecha', type: 'date' },
  { dataIndex: 'amount', title: 'Monto', type: 'currency' },
  { dataIndex: 'invoice.number', title: 'Factura' },
  { dataIndex: 'doctor.name', title: 'Doctor' },
];

export const opportunitiesColumns = [
  { dataIndex: 'service', title: 'Servicio' },
  { dataIndex: 'stage', title: 'Etapa', type: 'tag' },
  { dataIndex: 'amount', title: 'Monto', type: 'currency' },
  { dataIndex: 'source', title: 'Fuente', type: 'tag' },
  { dataIndex: 'assignedTo.name', title: 'Asignado a' },
  { dataIndex: 'created', title: 'Creado', type: 'date' },
];

export const arsColumns = [
  { dataIndex: 'plan.name', title: 'Plan' },
  { dataIndex: 'plan.company.name', title: 'ARS' },
  { dataIndex: 'service', title: 'Servicio' },
  { dataIndex: 'amount', title: 'Monto', type: 'currency' },
  { dataIndex: 'authorizedAmount', title: 'Autorizado', type: 'currency' },
  { dataIndex: 'authorizationNumber', title: 'Núm. Autorización' },
  { dataIndex: 'status', title: 'Estado', type: 'tag' },
  { dataIndex: 'validUntil', title: 'Válido hasta', type: 'date' },
];

export const withholdingsColumns = [
  { dataIndex: 'tipo', title: 'Tipo', type: 'tag' },
  { dataIndex: 'percentage', title: '%' },
  { dataIndex: 'baseAmount', title: 'Base', type: 'currency' },
  { dataIndex: 'amount', title: 'Monto', type: 'currency' },
  { dataIndex: 'ncf', title: 'NCF' },
  { dataIndex: 'date', title: 'Fecha', type: 'date' },
  { dataIndex: 'status', title: 'Estado', type: 'tag' },
];