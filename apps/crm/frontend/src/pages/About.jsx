import { Button, Result } from 'antd';

import useLanguage from '@/locale/useLanguage';

const About = () => {
  const translate = useLanguage();
  return (
    <Result
      status="info"
      title={'Alegro X'}
      subTitle={translate('Do you need help on customize of this app')}
      extra={
        <>
          <Button
            type="primary"
            onClick={() => {
              window.open(`https://unidolor-crm-production.up.railway.app`);
            }}
          >
            {translate('Contact us')}
          </Button>
        </>
      }
    />
  );
};

export default About;
