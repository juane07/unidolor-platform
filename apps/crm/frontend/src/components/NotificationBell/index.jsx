import { useState, useEffect, useCallback } from 'react';
import { Badge, Popover, List, Button, Tag, Typography, Empty } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { request } from '@/request';
import useLanguage from '@/locale/useLanguage';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const translate = useLanguage();
  const navigate = useNavigate();

  const fetchNotifications = useCallback(async () => {
    const res = await request.get({ entity: 'notification/listUnread' });
    if (res.success) {
      setNotifications(res.result);
      setCount(res.count);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleMarkRead = async (id) => {
    await request.patch({ entity: 'notification/markRead/' + id });
    fetchNotifications();
  };

  const handleMarkAllRead = async () => {
    await request.patch({ entity: 'notification/markAllRead' });
    fetchNotifications();
  };

  const handleClick = (item) => {
    handleMarkRead(item._id);
    if (item.link) navigate(item.link);
    setOpen(false);
  };

  const content = (
    <div style={{ width: 320 }}>
      {notifications.length === 0 ? (
        <Empty description={translate('no_notifications')} image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <>
          <List
            size="small"
            dataSource={notifications.slice(0, 10)}
            renderItem={(item) => (
              <List.Item
                onClick={() => handleClick(item)}
                style={{ cursor: 'pointer', padding: '8px 12px' }}
              >
                <List.Item.Meta
                  title={
                    <span style={{ fontSize: 13, fontWeight: 600 }}>
                      {item.title}
                    </span>
                  }
                  description={
                    <span style={{ fontSize: 12, color: '#888' }}>{item.message}</span>
                  }
                />
              </List.Item>
            )}
          />
          {notifications.length > 0 && (
            <div style={{ padding: '8px 12px', borderTop: '1px solid #f0f0f0' }}>
              <Button size="small" type="link" onClick={handleMarkAllRead} style={{ padding: 0 }}>
                {translate('mark_all_read')}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <Popover
      content={content}
      trigger="click"
      open={open}
      onOpenChange={setOpen}
      placement="bottomRight"
    >
      <Badge count={count} size="small" style={{ cursor: 'pointer' }}>
        <BellOutlined style={{ fontSize: 20, cursor: 'pointer', color: '#555' }} />
      </Badge>
    </Popover>
  );
}
