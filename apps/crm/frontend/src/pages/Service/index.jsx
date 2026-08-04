import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';
import useLanguage from '@/locale/useLanguage';

export default function Service() {
  const translate = useLanguage();
  const entity = 'service';
  const searchConfig = { displayLabels: ['name'], searchFields: 'name' };
  const deleteModalLabels = ['name'];
  const Labels = {
    PANEL_TITLE: translate('service_catalog'),
    DATATABLE_TITLE: translate('service_catalog_list'),
    ADD_NEW_ENTITY: translate('add_new_service'),
    ENTITY_NAME: translate('service'),
  };
  const config = { entity, ...Labels, fields, searchConfig, deleteModalLabels };
  return <CrudModule createForm={<DynamicForm fields={fields} />} updateForm={<DynamicForm fields={fields} />} config={config} />;
}
