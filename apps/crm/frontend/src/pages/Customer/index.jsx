import { useState } from 'react';
import { Segmented } from 'antd';
import { TeamOutlined, ShopOutlined } from '@ant-design/icons';
import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';

import useLanguage from '@/locale/useLanguage';

export default function Customer() {
  const translate = useLanguage();
  const entity = 'client';
  const [typeFilter, setTypeFilter] = useState('cliente');

  const searchConfig = {
    displayLabels: ['name'],
    searchFields: 'name',
  };
  const deleteModalLabels = ['name'];

  const Labels = {
    PANEL_TITLE: translate('client'),
    DATATABLE_TITLE: translate('client_list'),
    ADD_NEW_ENTITY: translate('add_new_client'),
    ENTITY_NAME: translate('client'),
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
    listFilter: { filter: 'type', equal: typeFilter },
  };
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <Segmented
          options={[
            {
              label: translate('clients_tab'),
              value: 'cliente',
              icon: <TeamOutlined />,
            },
            {
              label: translate('providers_tab'),
              value: 'proveedor',
              icon: <ShopOutlined />,
            },
          ]}
          value={typeFilter}
          onChange={setTypeFilter}
        />
      </div>
      <CrudModule
        createForm={<DynamicForm fields={fields} />}
        updateForm={<DynamicForm fields={fields} />}
        config={config}
        refreshKey={typeFilter}
      />
    </div>
  );
}
