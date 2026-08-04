import { useState, useEffect, useCallback } from 'react';
import dayjs from 'dayjs';
import { Calendar, Badge, List, Tag, Typography, Segmented, Card, Modal, Button, Empty } from 'antd';
import { UnorderedListOutlined, CalendarOutlined } from '@ant-design/icons';
import CrudModule from '@/modules/CrudModule/CrudModule';
import { request } from '@/request';
import { fields } from './config';
import AppointmentForm from './AppointmentForm';
import useLanguage from '@/locale/useLanguage';

const TYPE_COLORS = {
  primera_vez: 'blue',
  seguimiento: 'green',
  urgencia: 'red',
  visita_domiciliaria: 'purple',
};

const STATUS_COLORS = {
  programada: 'blue',
  realizada: 'green',
  cancelada: 'red',
  no_asistio: 'orange',
};

function AppointmentCalendar({ entity, onRefresh }) {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const translate = useLanguage();

  const fetchAll = useCallback(async () => {
    const res = await request.listAll({ entity });
    if (res.success) setAppointments(res.result);
  }, [entity]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll, onRefresh]);

  const getListData = (date) => {
    const dayStart = date.startOf('day');
    const dayEnd = date.endOf('day');
    return appointments.filter((a) => {
      const d = dayjs(a.date);
      return d.isAfter(dayStart) && d.isBefore(dayEnd) && !a.removed;
    });
  };

  const selectedDayAppts = getListData(selectedDate);

  const cellRender = (date) => {
    const list = getListData(date);
    return (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {list.slice(0, 3).map((item) => (
          <li key={item._id} style={{ fontSize: 11, lineHeight: '1.4' }}>
            <Badge
              color={STATUS_COLORS[item.status] || 'default'}
              text={(item.startTime || dayjs(item.date).format('HH:mm')) + ' ' + (item.client?.name || '')}
              style={{ fontSize: 11 }}
            />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <div style={{ flex: 1 }}>
        <Calendar cellRender={cellRender} onSelect={(date) => setSelectedDate(date)} />
      </div>
      <div style={{ width: 320, minWidth: 280 }}>
        <Card
          title={
            <span>
              <CalendarOutlined style={{ marginRight: 8 }} />
              {selectedDate.format('DD/MM/YYYY')}
            </span>
          }
          size="small"
        >
          {selectedDayAppts.length === 0 ? (
            <Empty description={translate('no_appointments')} image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : (
            <List
              size="small"
              dataSource={selectedDayAppts}
              renderItem={(item) => (
                <List.Item>
                  <div style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography.Text strong>{item.client?.name}</Typography.Text>
                      <Tag color={STATUS_COLORS[item.status]} style={{ fontSize: 10 }}>
                        {item.status}
                      </Tag>
                    </div>
                    <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                      {item.startTime || dayjs(item.date).format('HH:mm')} — {item.doctor?.name}
                    </div>
                    <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                      <Tag color={TYPE_COLORS[item.type]} style={{ fontSize: 10 }}>
                        {item.type}
                      </Tag>
                      {item.duration} min
                    </div>
                  </div>
                </List.Item>
              )}
            />
          )}
        </Card>
      </div>
    </div>
  );
}

export default function Appointment() {
  const translate = useLanguage();
  const entity = 'appointment';
  const [view, setView] = useState('calendar');
  const [refreshKey, setRefreshKey] = useState(0);

  const searchConfig = {
    displayLabels: ['client.name'],
    searchFields: 'client',
  };
  const deleteModalLabels = ['client.name', 'date'];

  const Labels = {
    PANEL_TITLE: translate('appointment'),
    DATATABLE_TITLE: translate('appointment_list'),
    ADD_NEW_ENTITY: translate('add_new_appointment'),
    ENTITY_NAME: translate('appointment'),
  };
  const configPage = {
    entity,
    ...Labels,
  };
  const config = {
    ...configPage,
    fields,
    searchConfig,
    deleteModalLabels,
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <Segmented
          options={[
            { label: translate('calendar'), value: 'calendar', icon: <CalendarOutlined /> },
            { label: translate('table'), value: 'table', icon: <UnorderedListOutlined /> },
          ]}
          value={view}
          onChange={setView}
        />
      </div>
      {view === 'calendar' ? (
        <AppointmentCalendar entity={entity} onRefresh={refreshKey} />
      ) : (
        <CrudModule
          createForm={<AppointmentForm fields={fields} />}
          updateForm={<AppointmentForm fields={fields} isUpdateForm />}
          config={config}
        />
      )}
    </div>
  );
}
