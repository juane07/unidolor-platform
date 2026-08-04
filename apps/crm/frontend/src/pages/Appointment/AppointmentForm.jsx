import { Divider, Form } from 'antd';
import DynamicForm from '@/forms/DynamicForm';
import useLanguage from '@/locale/useLanguage';
import { domiciliaryFields } from './config';

export default function AppointmentForm({ fields, isUpdateForm = false }) {
  const translate = useLanguage();

  return (
    <div>
      <DynamicForm fields={fields} isUpdateForm={isUpdateForm} />
      <Form.Item noStyle shouldUpdate={(prev, cur) => prev.type !== cur.type}>
        {({ getFieldValue }) => {
          const type = getFieldValue('type');
          const isDomiciliary = type === 'visita_domiciliaria';
          if (!isDomiciliary) return null;
          return (
            <div>
              <Divider style={{ margin: '16px 0 8px' }}>
                {translate('Ficha de atención domiciliaria')}
              </Divider>
              <DynamicForm fields={domiciliaryFields} isUpdateForm={isUpdateForm} />
            </div>
          );
        }}
      </Form.Item>
    </div>
  );
}
