import { ConfigProvider } from 'antd';
import antdLocale from './antdLocale';
import coreTranslation from './coreTranslation';

const DEFAULT_LANG = 'es_do';

const getActiveLang = () => {
  try {
    const stored = window.localStorage.getItem('app_lang');
    if (stored && coreTranslation.includes(stored)) return stored;
  } catch (_) {}
  return DEFAULT_LANG;
};

export default function Localization({ children }) {
  const lang = getActiveLang();
  const locale = antdLocale[lang] || antdLocale[DEFAULT_LANG];

  return (
    <ConfigProvider
      locale={locale}
      theme={{
        token: {
          colorPrimary: '#339393',
          colorLink: '#1640D6',
          borderRadius: 0,
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
