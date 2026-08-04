import useLanguage from '@/locale/useLanguage';
import UpdateQuoteModule from '@/modules/QuoteModule/UpdateQuoteModule';

export default function QuoteUpdate() {
  const translate = useLanguage();
  const config = {
    entity: 'quote',
    PANEL_TITLE: translate('quote'),
    ENTITY_NAME: translate('quote'),
  };
  return <UpdateQuoteModule config={config} />;
}
