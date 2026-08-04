import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';
import useLanguage from '@/locale/useLanguage';

export default function ECF() {
  const translate = useLanguage();
  const entity = 'ecf';
  const searchConfig = { displayLabels: ['ncf'], searchFields: 'ncf' };
  const deleteModalLabels = ['ncf'];
  const Labels = {
    PANEL_TITLE: 'e-CF (Factura Electrónica)',
    DATATABLE_TITLE: 'Listado de e-CF',
    ADD_NEW_ENTITY: 'Agregar e-CF',
    ENTITY_NAME: 'e-CF',
  };
  const config = { entity, ...Labels, fields, searchConfig, deleteModalLabels };
  return <CrudModule createForm={<DynamicForm fields={fields} />} updateForm={<DynamicForm fields={fields} />} config={config} />;
}
