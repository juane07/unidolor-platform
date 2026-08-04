import { useState, useRef } from 'react';
import { Form, Input, DatePicker, AutoComplete, InputNumber, TimePicker, Select } from 'antd';
import dayjs from 'dayjs';
import { request } from '@/request';
import useLanguage from '@/locale/useLanguage';
import { useDate } from '@/settings';
import AutoCompleteAsync from '@/components/AutoCompleteAsync';

export default function ClinicalRecordForm() {
  const translate = useLanguage();
  const { dateFormat } = useDate();
  const [serviceOptions, setServiceOptions] = useState([]);
  const debounceRef = useRef(null);

  const handleServiceSearch = (value) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!value || value.length < 2) {
      setServiceOptions([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await request.search({ entity: 'service', options: { q: value, fields: 'name,cupsCode,aliases' } });
        if (res.success && res.result) {
          setServiceOptions(
            res.result.map((s) => ({
              value: s._id,
              label: `${s.name}${s.cupsCode ? ` — CUPS: ${s.cupsCode}` : ''}`,
            }))
          );
        }
      } catch (e) {
        setServiceOptions([]);
      }
    }, 400);
  };

  return (
    <>
      <Form.Item
        name="client"
        label={translate('paciente')}
        rules={[{ required: true }]}
      >
        <AutoCompleteAsync
          entity={'client'}
          displayLabels={['name']}
          searchFields={'name'}
          redirectLabel={'Add New Client'}
          withRedirect
          urlToRedirect={'/customer'}
        />
      </Form.Item>
      <Form.Item
        name="doctor"
        label={translate('doctor')}
      >
        <AutoCompleteAsync
          entity={'doctor'}
          displayLabels={['name']}
          searchFields={'name'}
        />
      </Form.Item>
      <Form.Item
        name="service"
        label={translate('servicio')}
      >
        <AutoComplete
          allowClear
          options={serviceOptions}
          onSearch={handleServiceSearch}
          placeholder="Buscar servicio por nombre o código CUPS..."
          filterOption={false}
        >
          <Input />
        </AutoComplete>
      </Form.Item>
      <Form.Item name="modalidad" label={translate('modalidad')}>
        <Select
          options={[
            { value: 'clinica', label: 'Clínica' },
            { value: 'domicilio', label: 'Domicilio' },
            { value: 'telemedicina', label: 'Telemedicina' },
          ]}
        />
      </Form.Item>
      <Form.Item name="tipoServicio" label={translate('tipo_servicio')}>
        <Select
          options={[
            { value: 'consulta', label: 'Consulta' },
            { value: 'procedimiento', label: 'Procedimiento' },
            { value: 'diagnostico', label: 'Diagnóstico' },
            { value: 'enfermeria', label: 'Enfermería' },
            { value: 'hospitalizacion_domiciliaria', label: 'Hospitalización domiciliaria' },
            { value: 'programa_especial', label: 'Programa especial' },
          ]}
        />
      </Form.Item>
      <Form.Item
        name="date"
        label={translate('fecha')}
        initialValue={dayjs()}
      >
        <DatePicker style={{ width: '100%' }} format={dateFormat} />
      </Form.Item>
      <Form.Item name="hora" label={translate('hora')}>
        <TimePicker style={{ width: '100%' }} format="HH:mm" />
      </Form.Item>

      {/* Evaluación clínica (Cerebro 03_CLINICAL.md) */}
      <Form.Item name="motivoConsulta" label={translate('motivo_consulta')}>
        <Input.TextArea rows={2} />
      </Form.Item>
      <Form.Item name="enfermedadActual" label={translate('enfermedad_actual')}>
        <Input.TextArea rows={3} />
      </Form.Item>
      <Form.Item name="antecedentes" label={translate('antecedentes')}>
        <Input.TextArea rows={3} />
      </Form.Item>
      <Form.Item name="alergias" label={translate('alergias')}>
        <Select
          mode="tags"
          style={{ width: '100%' }}
          placeholder="Escribir y Enter para agregar"
          tokenSeparators={[',']}
        />
      </Form.Item>
      <Form.Item name="examenFisico" label={translate('examen_fisico')}>
        <Input.TextArea rows={3} />
      </Form.Item>
      <Form.Item name="estudiosDisponibles" label={translate('estudios_disponibles')}>
        <Input.TextArea rows={2} />
      </Form.Item>

      {/* Evaluación del dolor */}
      <Form.Item name={['dolor', 'localizacion']} label={translate('dolor_localizacion')}>
        <Input />
      </Form.Item>
      <Form.Item name={['dolor', 'intensidad']} label={translate('dolor_intensidad')}>
        <InputNumber min={0} max={10} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name={['dolor', 'duracion']} label={translate('dolor_duracion')}>
        <Input />
      </Form.Item>
      <Form.Item name={['dolor', 'irradiacion']} label={translate('dolor_irradiacion')}>
        <Input />
      </Form.Item>
      <Form.Item name={['dolor', 'calidad']} label={translate('dolor_calidad')}>
        <Input />
      </Form.Item>
      <Form.Item name={['dolor', 'factoresAgravantes']} label={translate('dolor_agravantes')}>
        <Input />
      </Form.Item>
      <Form.Item name={['dolor', 'factoresAtenuantes']} label={translate('dolor_atenuantes')}>
        <Input />
      </Form.Item>
      <Form.Item name={['dolor', 'limitacionFuncional']} label={translate('dolor_limitacion_funcional')}>
        <Input />
      </Form.Item>
      <Form.Item name={['dolor', 'impactoEmocional']} label={translate('dolor_impacto_emocional')}>
        <Input />
      </Form.Item>
      <Form.Item name={['dolor', 'tratamientosPrevios']} label={translate('dolor_tratamientos_previos')}>
        <Input />
      </Form.Item>
      <Form.Item name={['dolor', 'respuestaPrevia']} label={translate('dolor_respuesta_previa')}>
        <Input />
      </Form.Item>

      <Form.Item name="diagnosis" label={translate('diagnostico')}>
        <Input.TextArea rows={3} />
      </Form.Item>
      <Form.Item name="diagnosticosDiferenciales" label={translate('diagnosticos_diferenciales')}>
        <Input.TextArea rows={2} />
      </Form.Item>
      <Form.Item name="objetivosTerapeuticos" label={translate('objetivos_terapeuticos')}>
        <Input.TextArea rows={2} />
      </Form.Item>
      <Form.Item name="plan" label={translate('plan')}>
        <Input.TextArea rows={2} />
      </Form.Item>
      <Form.Item name="treatment" label={translate('tratamiento_procedimiento')}>
        <Input.TextArea rows={2} />
      </Form.Item>
      <Form.Item name="prescription" label={translate('prescripcion')}>
        <Input.TextArea rows={3} />
      </Form.Item>
      <Form.Item name="seguimiento" label={translate('seguimiento')}>
        <Input.TextArea rows={2} />
      </Form.Item>
      <Form.Item name="evolutionNotes" label={translate('notas_de_evolucion')}>
        <Input.TextArea rows={3} />
      </Form.Item>
    </>
  );
}
