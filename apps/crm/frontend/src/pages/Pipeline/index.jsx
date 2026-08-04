import { useState } from 'react';
import { Segmented } from 'antd';
import { UnorderedListOutlined, AppstoreOutlined } from '@ant-design/icons';
import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import KanbanBoard from '@/modules/KanbanModule';
import { fields } from './config';

import useLanguage from '@/locale/useLanguage';

export default function Pipeline() {
  const translate = useLanguage();
  const entity = 'opportunity';
  const [view, setView] = useState('table');

  const searchConfig = {
    displayLabels: ['service'],
    searchFields: 'service',
  };
  const deleteModalLabels = ['client.name', 'service'];

  const Labels = {
    PANEL_TITLE: translate('pipeline'),
    DATATABLE_TITLE: translate('pipeline_list'),
    ADD_NEW_ENTITY: translate('add_new_opportunity'),
    ENTITY_NAME: translate('opportunity'),
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
            { label: translate('table'), value: 'table', icon: <UnorderedListOutlined /> },
            { label: translate('kanban'), value: 'kanban', icon: <AppstoreOutlined /> },
          ]}
          value={view}
          onChange={setView}
        />
      </div>
      {view === 'table' ? (
        <CrudModule
          createForm={<DynamicForm fields={fields} />}
          updateForm={<DynamicForm fields={fields} />}
          config={config}
        />
      ) : (
        <KanbanBoard entity={entity} />
      )}
    </div>
  );
}
