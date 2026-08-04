import { useEffect, useState } from 'react';
import { Tabs, Card, Row, Col, Statistic, Spin, Alert, Button, Breadcrumb } from 'antd';
import { 
  UserOutlined, CalendarOutlined, FileTextOutlined, DollarCircleOutlined,
  CreditCardOutlined, TransactionOutlined, SafetyOutlined, BankOutlined,
  ArrowLeftOutlined, EditOutlined, PlusOutlined
} from '@ant-design/icons';
import { useNavigate, useParams, Link } from 'react-router-dom';

import { request } from '@/request';
import useLanguage from '@/locale/useLanguage';
import { useDate } from '@/settings';
import { formatCurrency } from '@/utils/helpers';

import { 
  tabsConfig, summaryFields, appointmentsColumns, clinicalColumns,
  invoicesColumns, quotesColumns, paymentsColumns, opportunitiesColumns,
  arsColumns, withholdingsColumns
} from './config';

export default function ClientDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const translate = useLanguage();
  const { dateFormat } = useDate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('summary');

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await request.get(`/client/detail/${id}`);
        if (response.data.success) {
          setData(response.data.result);
        }
      } catch (error) {
        console.error('Error fetching client detail:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return <Spin size="large" tip="Cargando detalle del cliente..." />;
  }

  if (!data) {
    return (
      <Alert
        message="Cliente no encontrado"
        description="El cliente solicitado no existe o ha sido eliminado."
        type="error"
        showIcon
        style={{ margin: 24 }}
      />
    );
  }

  const { client, stats, appointments, clinicalRecords, invoices, opportunities, payments, arsAuthorizations, withholdings } = data;

  const getStatusColor = (status) => {
    const colors = {
      programada: 'blue', realizada: 'green', cancelada: 'red', no_asistio: 'orange',
      pagada: 'green', pendiente: 'orange', vencida: 'red', anulada: 'gray',
      cotizacion: 'blue', cita_solicitada: 'purple', cita_programada: 'cyan',
      visita: 'gold', orden_servicio: 'magenta', factura: 'green', perdido: 'red',
      aprobada: 'green', rechazada: 'red', vencida: 'orange', active: 'green', cancelled: 'red',
      cliente: 'blue', proveedor: 'purple',
    };
    return colors[status] || 'default';
  };

  const getStageColor = (stage) => getStatusColor(stage);
  const getTypeColor = (type) => getStatusColor(type);

  const renderTag = (value, colorFn = getStatusColor) => (
    <span style={{ 
      background: `var(--ant-${colorFn(value)}-1)`, 
      color: `var(--ant-${colorFn(value)}-6)`,
      padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 500 
    }}>
      {translate(value) || value}
    </span>
  );

  const renderSummary = () => (
    <Row gutter={[16, 24]}>
      {summaryFields.map(field => (
        <Col key={field.key} xs={24} sm={12} lg={8}>
          <Card>
            <p style={{ margin: 0, color: '#999', fontSize: '12px' }}>{translate(field.label)}</p>
            <p style={{ margin: '4px 0 0', fontSize: '16px', fontWeight: 500 }}>
              {field.type === 'tag' && client[field.key] 
                ? renderTag(client[field.key], getTypeColor)
                : field.type === 'phone' && client[field.key]
                ? <a href={`tel:${client[field.key]}`}>{client[field.key]}</a>
                : field.type === 'email' && client[field.key]
                ? <a href={`mailto:${client[field.key]}`}>{client[field.key]}</a>
                : client[field.key] || '—'}
            </p>
          </Card>
        </Col>
      ))}
    </Row>
  );

  const renderStatsCards = () => (
    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
      <Col xs={24} sm={12} lg={6}>
        <Statistic title={translate('total_appointments') || 'Total Citas'} value={stats.totalAppointments} />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Statistic title={translate('upcoming_appointments') || 'Próximas Citas'} value={stats.upcomingAppointments} />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Statistic title={translate('total_invoices') || 'Total Facturas'} value={stats.totalInvoices.length} />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Statistic title={translate('total_paid') || 'Total Pagado'} value={formatCurrency(stats.totalPaid)} />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Statistic title={translate('total_pending') || 'Total Pendiente'} value={formatCurrency(stats.totalPending)} />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Statistic title={translate('total_opportunities') || 'Oportunidades'} value={stats.totalOpportunities} />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Statistic title={translate('active_opportunities') || 'Oportunidades Activas'} value={stats.activeOpportunities} />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Statistic title={translate('total_payments') || 'Total Pagos'} value={formatCurrency(stats.totalPaidAmount)} />
      </Col>
    </Row>
  );

  const renderDataTable = (items, columns, emptyText) => {
    if (!items || items.length === 0) {
      return <Alert message={emptyText} type="info" showIcon style={{ margin: 16 }} />;
    }
    return (
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
              {columns.map(col => (
                <th key={col.dataIndex} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#595959' }}>
                  {translate(col.title)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={item._id || idx} style={{ borderBottom: '1px solid #f0f0f0', transition: 'background 0.2s' }}>
                {columns.map(col => {
                  let value = col.dataIndex.split('.').reduce((obj, key) => obj?.[key], item);
                  let display = value;
                  if (col.type === 'date' && value) {
                    display = new Date(value).toLocaleDateString('es-DO', { year: 'numeric', month: 'short', day: 'numeric' });
                  } else if (col.type === 'currency' && value != null) {
                    display = formatCurrency(value);
                  } else if (col.type === 'tag' && value) {
                    display = renderTag(value, getStatusColor);
                  }
                  return (
                    <td key={col.dataIndex} style={{ padding: '12px 16px' }}>
                      {display ?? '—'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderTabContent = (tabKey) => {
    switch (tabKey) {
      case 'summary':
        return (
          <>
            {renderStatsCards()}
            {renderSummary()}
          </>
        );
      case 'appointments':
        return renderDataTable(appointments, appointmentsColumns, translate('no_appointments') || 'Sin citas registradas');
      case 'clinical':
        return renderDataTable(clinicalRecords, clinicalColumns, translate('no_clinical_records') || 'Sin historial clínico');
      case 'invoices':
        return renderDataTable(invoices, invoicesColumns, translate('no_invoices') || 'Sin facturas');
      case 'quotes':
        return renderDataTable(opportunities.filter(o => o.stage === 'cotizacion'), quotesColumns, translate('no_quotes') || 'Sin cotizaciones');
      case 'payments':
        return renderDataTable(payments, paymentsColumns, translate('no_payments') || 'Sin pagos registrados');
      case 'opportunities':
        return renderDataTable(opportunities, opportunitiesColumns, translate('no_opportunities') || 'Sin oportunidades');
      case 'ars':
        return renderDataTable(arsAuthorizations, arsColumns, translate('no_ars') || 'Sin autorizaciones ARS');
      case 'withholdings':
        return renderDataTable(withholdings, withholdingsColumns, translate('no_withholdings') || 'Sin retenciones');
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: '0 24px 24px' }}>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item><Link to="/customer">{translate('client_list') || 'Clientes'}</Link></Breadcrumb.Item>
        <Breadcrumb.Item>{client.name}</Breadcrumb.Item>
      </Breadcrumb>

      <Row style={{ marginBottom: 16, alignItems: 'center' }}>
        <Col>
          <h1 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <UserOutlined style={{ fontSize: 24 }} />
            {client.name}
            {client.type && <span style={{ marginLeft: 8 }}>{renderTag(client.type, getTypeColor)}</span>}
          </h1>
        </Col>
        <Col style={{ textAlign: 'right' }}>
          <Button onClick={() => navigate('/customer')} icon={<ArrowLeftOutlined />}>
            {translate('back_to_list') || 'Volver a la lista'}
          </Button>
        </Col>
      </Row>

      <Tabs
        type="card"
        tabPosition="left"
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabsConfig.map(tab => ({
          key: tab.key,
          label: (
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <tab.icon />
              {translate(tab.label)}
            </span>
          ),
          children: <Card style={{ height: '100%' }}>{renderTabContent(tab.key)}</Card>,
        }))}
      />
    </div>
  );
}