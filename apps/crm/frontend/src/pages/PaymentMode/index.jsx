import { useEffect, useState } from 'react';
import { ErpLayout } from '@/layout';
import PaymentModeForm from '@/forms/PaymentModeForm';
import useLanguage from '@/locale/useLanguage';
import { request } from '@/request';
import { Card, message } from 'antd';

export default function PaymentMode() {
  const translate = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    request.listAll({ entity: 'paymentmode' })
      .then((res) => { if (res.success) setData(res.result); })
      .catch(() => message.error('Error loading payment modes'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ErpLayout>
      <Card title={translate('Payment Mode')} loading={loading}>
        <PaymentModeForm isUpdateForm={false} />
      </Card>
    </ErpLayout>
  );
}
