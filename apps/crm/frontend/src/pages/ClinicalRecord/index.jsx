import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';
import ClinicalRecordForm from './ClinicalRecordForm';

import useLanguage from '@/locale/useLanguage';

export default function ClinicalRecord() {
  const translate = useLanguage();
  const entity = 'clinicalrecord';
  const searchConfig = {
    displayLabels: ['client.name'],
    searchFields: 'client',
  };
  const deleteModalLabels = ['client.name', 'date'];

  const Labels = {
    PANEL_TITLE: translate('clinical_record'),
    DATATABLE_TITLE: translate('clinical_record_list'),
    ADD_NEW_ENTITY: translate('add_new_clinical_record'),
    ENTITY_NAME: translate('clinical_record'),
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
    <CrudModule
      createForm={<ClinicalRecordForm />}
      updateForm={<ClinicalRecordForm />}
      config={config}
    />
  );
}
