import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';
import useLanguage from '@/locale/useLanguage';

export default function NcfSequence() {
  const translate = useLanguage();
  const entity = 'ncfsequence';
  const searchConfig = { displayLabels: ['nombre', 'tipo'], searchFields: 'nombre,tipo' };
  const deleteModalLabels = ['nombre', 'tipo'];
  const Labels = {
    PANEL_TITLE: 'Secuencias NCF',
    DATATABLE_TITLE: 'Listado de secuencias NCF',
    ADD_NEW_ENTITY: 'Agregar secuencia NCF',
    ENTITY_NAME: 'Secuencia NCF',
  };
  const config = { entity, ...Labels, fields, searchConfig, deleteModalLabels };
  return <CrudModule createForm={<DynamicForm fields={fields} />} updateForm={<DynamicForm fields={fields} />} config={config} />;
}
