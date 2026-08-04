import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';
import useLanguage from '@/locale/useLanguage';

export default function ArsAuthorization() {
  const translate = useLanguage();
  const entity = 'arsauthorization';
  const searchConfig = { displayLabels: ['client.name'], searchFields: 'client' };
  const deleteModalLabels = ['authorizationNumber'];
  const Labels = {
    PANEL_TITLE: translate('ars_authorization'),
    DATATABLE_TITLE: translate('ars_authorization_list'),
    ADD_NEW_ENTITY: translate('add_new_ars_authorization'),
    ENTITY_NAME: translate('ars_authorization'),
  };
  const config = { entity, ...Labels, fields, searchConfig, deleteModalLabels };
  return <CrudModule createForm={<DynamicForm fields={fields} />} updateForm={<DynamicForm fields={fields} />} config={config} />;
}
