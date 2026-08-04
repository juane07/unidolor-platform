import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';
import useLanguage from '@/locale/useLanguage';

export default function Withholding() {
  const translate = useLanguage();
  const entity = 'withholding';
  const searchConfig = { displayLabels: ['ncf'], searchFields: 'ncf' };
  const deleteModalLabels = ['ncf', 'tipo'];
  const Labels = {
    PANEL_TITLE: 'Retenciones',
    DATATABLE_TITLE: 'Listado de retenciones',
    ADD_NEW_ENTITY: 'Agregar retención',
    ENTITY_NAME: 'Retención',
  };
  const config = { entity, ...Labels, fields, searchConfig, deleteModalLabels };
  return <CrudModule createForm={<DynamicForm fields={fields} />} updateForm={<DynamicForm fields={fields} />} config={config} />;
}
