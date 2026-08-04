import { useState, useEffect, useRef, useCallback } from 'react';
import { Form, Input, InputNumber, Row, Col, Select } from 'antd';

import { DeleteOutlined } from '@ant-design/icons';
import { useMoney, useDate } from '@/settings';
import calculate from '@/utils/calculate';
import { request } from '@/request';

export default function ItemRow({ field, remove, current = null }) {
  const [totalState, setTotal] = useState(undefined);
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [serviceList, setServiceList] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const form = Form.useFormInstance();
  const money = useMoney();

  const updateQt = (value) => setQuantity(value);
  const updatePrice = (value) => setPrice(value);

  useEffect(() => {
    setLoadingServices(true);
    request.listAll({ entity: 'service' }).then((res) => {
      if (res.success && res.result) {
        setServiceList(res.result);
      }
      setLoadingServices(false);
    });
  }, []);

  const handleServiceSelect = useCallback(
    (serviceId) => {
      const service = serviceList.find((s) => s._id === serviceId);
      if (!service) return;
      const currentItems = form.getFieldValue('items') || [];
      currentItems[field.name] = {
        ...(currentItems[field.name] || {}),
        itemName: service.name,
        price: service.basePrice,
        service: service._id,
        cupsCode: service.cupsCode || '',
        simonLevel: service.simonLevel || '',
      };
      form.setFieldsValue({ items: currentItems });
      setPrice(service.basePrice);
    },
    [serviceList, form, field.name]
  );

  useEffect(() => {
    if (current) {
      const { items, invoice } = current;

      if (invoice) {
        const item = invoice[field.fieldKey];
        if (item) {
          setQuantity(item.quantity);
          setPrice(item.price);
        }
      } else {
        const item = items[field.fieldKey];
        if (item) {
          setQuantity(item.quantity);
          setPrice(item.price);
        }
      }
    }
  }, [current]);

  useEffect(() => {
    const currentTotal = calculate.multiply(price, quantity);
    setTotal(currentTotal);
  }, [price, quantity]);

  const [selectedServiceId, setSelectedServiceId] = useState(undefined);

  useEffect(() => {
    if (current) {
      const item = current.items?.[field.fieldKey] || current.invoice?.[field.fieldKey];
      if (item?.service) {
        setSelectedServiceId(item.service);
      }
    }
  }, [current, field.fieldKey]);

  return (
    <Row gutter={[12, 12]} style={{ position: 'relative' }}>
      <Col className="gutter-row" span={6}>
        <Select
          showSearch
          loading={loadingServices}
          value={selectedServiceId}
          placeholder="Buscar servicio por nombre o CUPS..."
          filterOption={(input, option) => {
            const label = option?.label?.toLowerCase() || '';
            return label.includes(input.toLowerCase());
          }}
          onChange={(id) => {
            setSelectedServiceId(id);
            handleServiceSelect(id);
          }}
          style={{ width: '100%' }}
          options={serviceList.map((s) => ({
            value: s._id,
            label: `${s.name}${s.cupsCode ? ` | CUPS: ${s.cupsCode}` : ''}`,
          }))}
        />
        <Form.Item name={[field.name, 'itemName']} hidden>
          <Input />
        </Form.Item>
        <Form.Item name={[field.name, 'service']} hidden>
          <Input />
        </Form.Item>
        <Form.Item name={[field.name, 'cupsCode']} hidden>
          <Input />
        </Form.Item>
        <Form.Item name={[field.name, 'simonLevel']} hidden>
          <Input />
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={5}>
        <Form.Item name={[field.name, 'description']}>
          <Input placeholder="Descripción" />
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={3}>
        <Form.Item name={[field.name, 'quantity']} rules={[{ required: true }]}>
          <InputNumber style={{ width: '100%' }} min={0} onChange={updateQt} />
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={4}>
        <Form.Item name={[field.name, 'price']} rules={[{ required: true }]}>
          <InputNumber
            className="moneyInput"
            onChange={updatePrice}
            min={0}
            controls={false}
            addonAfter={money.currency_position === 'after' ? money.currency_symbol : undefined}
            addonBefore={money.currency_position === 'before' ? money.currency_symbol : undefined}
          />
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={5}>
        <Form.Item name={[field.name, 'total']}>
          <Form.Item>
            <InputNumber
              readOnly
              className="moneyInput"
              value={totalState}
              min={0}
              controls={false}
              addonAfter={money.currency_position === 'after' ? money.currency_symbol : undefined}
              addonBefore={money.currency_position === 'before' ? money.currency_symbol : undefined}
              formatter={(value) =>
                money.amountFormatter({ amount: value, currency_code: money.currency_code })
              }
            />
          </Form.Item>
        </Form.Item>
      </Col>

      <div style={{ position: 'absolute', right: '-20px', top: ' 5px' }}>
        <DeleteOutlined onClick={() => remove(field.name)} />
      </div>
    </Row>
  );
}
