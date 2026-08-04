import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';
import useLanguage from '@/locale/useLanguage';

export default function InsurancePlan() {
  const translate = useLanguage();
  const entity = 'insuranceplan';
  const searchConfig = { displayLabels: ['name'], searchFields: 'name' };
  const deleteModalLabels = ['name'];
  const Labels = {
    PANEL_TITLE: translate('insurance_plan'),
    DATATABLE_TITLE: translate('insurance_plan_list'),
    ADD_NEW_ENTITY: translate('add_new_insurance_plan'),
    ENTITY_NAME: translate('insurance_plan'),
  };
  const config = { entity, ...Labels, fields, searchConfig, deleteModalLabels };
  return <CrudModule createForm={<DynamicForm fields={fields} />} updateForm={<DynamicForm fields={fields} />} config={config} />;
}
