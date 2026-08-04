import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';
import useLanguage from '@/locale/useLanguage';

export default function InsuranceCompany() {
  const translate = useLanguage();
  const entity = 'insurancecompany';
  const searchConfig = { displayLabels: ['name'], searchFields: 'name' };
  const deleteModalLabels = ['name'];
  const Labels = {
    PANEL_TITLE: translate('insurance_company'),
    DATATABLE_TITLE: translate('insurance_company_list'),
    ADD_NEW_ENTITY: translate('add_new_insurance_company'),
    ENTITY_NAME: translate('insurance_company'),
  };
  const config = { entity, ...Labels, fields, searchConfig, deleteModalLabels };
  return <CrudModule createForm={<DynamicForm fields={fields} />} updateForm={<DynamicForm fields={fields} />} config={config} />;
}
