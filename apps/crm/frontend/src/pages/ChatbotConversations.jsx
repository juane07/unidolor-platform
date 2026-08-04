import { useEffect, useRef, useState } from 'react';
import { Layout, Spin } from 'antd';
import useLanguage from '@/locale/useLanguage';

const { Content } = Layout;

export default function ChatbotConversations() {
  const translate = useLanguage();
  const iframeRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.onload = () => setLoaded(true);
    }
  }, []);

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Content style={{ margin: 0, padding: 0, overflow: 'hidden' }}>
        {!loaded && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
              background: '#fff',
            }}
          >
            <Spin size="large" tipContent={translate('loading')} />
          </div>
        )}
        <iframe
          ref={iframeRef}
          src="https://unidolor-bot.unidolor.workers.dev/conversations"
          title={translate('chatbot_conversations')}
          style={{
            width: '100%',
            height: '100vh',
            border: 'none',
            display: loaded ? 'block' : 'none',
            background: '#fff',
          }}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
        />
      </Content>
    </Layout>
  );
}