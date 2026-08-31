import { ErpLayout } from '@/layout';
import ErpPanel from '@/modules/ErpPanelModule';
import useLanguage from '@/locale/useLanguage';
import { CreditCardOutlined, StopOutlined } from '@ant-design/icons';

export default function InvoiceDataTableModule({ config }) {
  const translate = useLanguage();
  return (
    <ErpLayout>
      <ErpPanel
        config={config}
        extra={[
          {
            label: translate('Record Payment'),
            key: 'recordPayment',
            icon: <CreditCardOutlined />,
          },
          {
            label: translate('Anular'),
            key: 'anular',
            icon: <StopOutlined />,
            showWhen: (record) => record.estadoFiscal === 'emitida',
          },
        ]}
      ></ErpPanel>
    </ErpLayout>
  );
}
