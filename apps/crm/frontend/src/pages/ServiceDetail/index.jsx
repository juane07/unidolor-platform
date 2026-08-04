import { useEffect, useState } from 'react';
import { Tabs, Card, Row, Col, Statistic, Spin, Alert, Button, Breadcrumb } from 'antd';
import { 
  FileTextOutlined, DollarCircleOutlined, CalendarOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { useNavigate, useParams, Link } from 'react-router-dom';

import { request } from '@/request';
import useLanguage from '@/locale/useLanguage';
import { useDate } from '@/settings';
import { formatCurrency } from '@/utils/helpers';

import { 
  serviceTabsConfig, summaryFields, invoicesColumns, appointmentsColumns
} from './config';

export default function ServiceDetail() {
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
        const response = await request.get(`/service/detail/${id}`);
        if (response.data.success) {
          setData(response.data.result);
        }
      } catch (error) {
        console.error('Error fetching service detail:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return <Spin size="large" tip="Cargando detalle del servicio..." />;
  }

  if (!data) {
    return (
      <Alert
        message="Servicio no encontrado"
        description="El servicio solicitado no existe o ha sido eliminado."
        type="error"
        showIcon
        style={{ margin: 24 }}
      />
    );
  }

  const { service, stats, invoices, appointments } = data;

  const getStatusColor = (status) => {
    const colors = {
      programada: 'blue', realizada: 'green', cancelada: 'red', no_asistio: 'orange',
      pagada: 'green', pendiente: 'orange', vencida: 'red', anulada: 'gray',
      cliente: 'blue', proveedor: 'purple',
      consulta: 'blue', procedimiento: 'purple', visita_domicilio: 'green', estudio: 'cyan', otro: 'gray',
      primera_vez: 'blue', seguimiento: 'green', urgencia: 'red',
    };
    return colors[status] || 'default';
  };

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
              {field.type === 'tag' && service[field.key] 
                ? renderTag(service[field.key])
                : field.type === 'tags' && Array.isArray(service[field.key]) && service[field.key].length > 0
                ? service[field.key].map((v, i) => (
                    <span key={i} style={{ marginRight: 4 }}>{renderTag(v)}</span>
                  ))
                : field.type === 'boolean' && service[field.key] != null
                ? (service[field.key] ? 'Sí' : 'No')
                : field.type === 'currency' && service[field.key] != null
                ? formatCurrency(service[field.key])
                : service[field.key] || '—'}
            </p>
          </Card>
        </Col>
      ))}
    </Row>
  );

  const renderStatsCards = () => (
    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
      <Col xs={24} sm={12} lg={6}>
        <Statistic title={translate('total_invoices') || 'Facturas'} value={stats.totalInvoices} />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Statistic title={translate('total_quantity') || 'Cantidad Total'} value={stats.totalQuantitySold} />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Statistic title={translate('total_revenue') || 'Ingresos Totales'} value={formatCurrency(stats.totalRevenue)} />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Statistic title={translate('total_appointments') || 'Citas'} value={stats.totalAppointments} />
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
              <tr key={item.invoiceId || item._id || idx} style={{ borderBottom: '1px solid #f0f0f0' }}>
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
      case 'invoices':
        return renderDataTable(invoices, invoicesColumns, translate('no_invoices') || 'Sin facturas con este servicio');
      case 'appointments':
        return renderDataTable(appointments, appointmentsColumns, translate('no_appointments') || 'Sin citas con este servicio');
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: '0 24px 24px' }}>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item><Link to="/service">{translate('service_list') || 'Servicios'}</Link></Breadcrumb.Item>
        <Breadcrumb.Item>{service.name}</Breadcrumb.Item>
      </Breadcrumb>

      <Row style={{ marginBottom: 16, alignItems: 'center' }}>
        <Col>
          <h1 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileTextOutlined style={{ fontSize: 24 }} />
            {service.name}
            {service.cupsCode && <span style={{ marginLeft: 8, color: '#999' }}>CUPS: {service.cupsCode}</span>}
          </h1>
        </Col>
        <Col style={{ textAlign: 'right' }}>
          <Button onClick={() => navigate('/service')} icon={<ArrowLeftOutlined />}>
            {translate('back_to_list') || 'Volver a la lista'}
          </Button>
        </Col>
      </Row>

      <Tabs
        type="card"
        activeKey={activeTab}
        onChange={setActiveTab}
        items={serviceTabsConfig.map(tab => ({
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