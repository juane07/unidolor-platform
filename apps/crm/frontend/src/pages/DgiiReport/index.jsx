import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';
import useLanguage from '@/locale/useLanguage';

export default function DgiiReport() {
  const translate = useLanguage();
  const entity = 'dgiireport';
  const searchConfig = { displayLabels: ['tipo', 'mes', 'anno'], searchFields: 'tipo' };
  const deleteModalLabels = ['tipo', 'mes', 'anno'];
  const Labels = {
    PANEL_TITLE: 'Reportes DGII',
    DATATABLE_TITLE: 'Listado de reportes',
    ADD_NEW_ENTITY: 'Generar reporte',
    ENTITY_NAME: 'Reporte DGII',
  };
  const config = { entity, ...Labels, fields, searchConfig, deleteModalLabels };
  return <CrudModule createForm={<DynamicForm fields={fields} />} updateForm={<DynamicForm fields={fields} />} config={config} />;
}
