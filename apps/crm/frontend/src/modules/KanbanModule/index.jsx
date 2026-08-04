import { useState, useEffect, useCallback } from 'react';
import { Card, Tag, Typography, message } from 'antd';
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core';
import { request } from '@/request';
import useLanguage from '@/locale/useLanguage';

const STAGES = [
  { key: 'solicitud', label: 'Solicitud', color: 'blue' },
  { key: 'recepcion_informacion', label: 'Recepción de información', color: 'cyan' },
  { key: 'verificacion_datos', label: 'Verificación de datos', color: 'geekblue' },
  { key: 'clasificacion_caso', label: 'Clasificación del caso', color: 'gold' },
  { key: 'cotizacion_autorizacion', label: 'Cotización / Autorización', color: 'purple' },
  { key: 'programacion', label: 'Programación', color: 'magenta' },
  { key: 'confirmacion', label: 'Confirmación', color: 'orange' },
  { key: 'preparacion', label: 'Preparación', color: 'volcano' },
  { key: 'ejecucion', label: 'Ejecución', color: 'green' },
  { key: 'documentacion', label: 'Documentación', color: 'lime' },
  { key: 'facturacion', label: 'Facturación', color: 'green' },
  { key: 'seguimiento', label: 'Seguimiento', color: 'cyan' },
  { key: 'cierre_caso', label: 'Cierre del caso', color: 'blue' },
  { key: 'perdido', label: 'Perdido', color: 'red' },
];

const SOURCE_COLORS = {
  whatsapp: 'green',
  manual: 'blue',
  web: 'cyan',
  referido: 'gold',
};

function KanbanCard({ item }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item._id,
    data: { item, stage: item.stage },
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} style={{ ...style, opacity: isDragging ? 0.5 : 1 }}>
      <Card size="small" style={{ marginBottom: 8, cursor: 'grab' }}>
        <Typography.Text strong style={{ fontSize: 13 }}>
          {item.client?.name || 'Sin cliente'}
        </Typography.Text>
        <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>{item.service}</div>
        <div style={{ marginTop: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Tag color={SOURCE_COLORS[item.source] || 'default'} style={{ fontSize: 10, margin: 0 }}>
            {item.source}
          </Tag>
          {item.amount > 0 && (
            <Typography.Text style={{ fontSize: 12, fontWeight: 500 }}>
              ${item.amount}
            </Typography.Text>
          )}
        </div>
      </Card>
    </div>
  );
}

function Column({ stage, items }) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.key });

  return (
    <div
      ref={setNodeRef}
      style={{
        flex: 1,
        minWidth: 220,
        maxWidth: 280,
        background: isOver ? '#f0f5ff' : '#f5f5f5',
        borderRadius: 8,
        padding: 12,
        transition: 'background 0.2s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
        <Tag color={stage.color} style={{ marginRight: 8, fontWeight: 600 }}>
          {stage.label}
        </Tag>
        <span style={{ fontSize: 13, color: '#888' }}>{items.length}</span>
      </div>
      <div style={{ minHeight: 100 }}>
        {items.map((item) => (
          <KanbanCard key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
}

export default function KanbanBoard({ entity }) {
  const [items, setItems] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const translate = useLanguage();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    const res = await request.listAll({ entity });
    if (res.success) {
      setItems(res.result);
    }
    setLoading(false);
  };

  const grouped = STAGES.map((stage) => ({
    stage,
    items: items.filter((item) => item.stage === stage.key && !item.removed),
  }));

  const handleDragStart = useCallback((event) => {
    const { active } = event;
    setActiveItem(active.data.current.item);
  }, []);

  const handleDragEnd = useCallback(
    async (event) => {
      setActiveItem(null);
      const { active, over } = event;
      if (!over) return;

      const itemId = active.id;
      const newStage = over.id;
      const currentItem = active.data.current.item;

      if (newStage === currentItem.stage) return;

      setItems((prev) =>
        prev.map((i) => (i._id === itemId ? { ...i, stage: newStage } : i))
      );

      const res = await request.update({
        entity,
        id: itemId,
        jsonData: { stage: newStage },
      });

      if (!res.success) {
        setItems((prev) =>
          prev.map((i) => (i._id === itemId ? { ...i, stage: currentItem.stage } : i))
        );
        message.error(translate('error_updating_stage'));
      }
    },
    [entity]
  );

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>{translate('loading')}</div>;
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '16px 0' }}>
        {grouped.map(({ stage, items: stageItems }) => (
          <Column key={stage.key} stage={stage} items={stageItems} />
        ))}
      </div>
      <DragOverlay>
        {activeItem ? (
          <Card size="small" style={{ width: 240, opacity: 0.9 }}>
            <Typography.Text strong>{activeItem.client?.name}</Typography.Text>
            <div style={{ fontSize: 12, color: '#666' }}>{activeItem.service}</div>
          </Card>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
