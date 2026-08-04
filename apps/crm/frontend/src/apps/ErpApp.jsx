import React, { Component, useLayoutEffect } from 'react';
import { useEffect } from 'react';
import { selectAppSettings } from '@/redux/settings/selectors';
import { useDispatch, useSelector } from 'react-redux';

import { Layout } from 'antd';

import { useAppContext } from '@/context/appContext';

import Navigation from '@/apps/Navigation/NavigationContainer';

import HeaderContent from '@/apps/Header/HeaderContainer';
import PageLoader from '@/components/PageLoader';

import { settingsAction } from '@/redux/settings/actions';

import { selectSettings } from '@/redux/settings/selectors';

import AppRouter from '@/router/AppRouter';

import useResponsive from '@/hooks/useResponsive';

import storePersist from '@/redux/storePersist';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('=== ERROR BOUNDARY CAPTURED ===');
    console.error('Error:', error);
    console.error('Stack:', error?.stack);
    console.error('Component Stack:', info?.componentStack);
  }
  render() {
    if (this.state.hasError) {
      return React.createElement('div', {
        style: {
          padding: 40, fontFamily: 'monospace', whiteSpace: 'pre-wrap',
          background: '#f5f5f5', minHeight: '100vh',
          color: 'red'
        }
      }, [
        'ERROR CAPTURADO:\n',
        this.state.error?.toString(),
        '\n\nStack:\n',
        this.state.error?.stack
      ]);
    }
    return this.props.children;
  }
}

export default function ErpCrmApp() {
  const { Content } = Layout;

  // const { state: stateApp, appContextAction } = useAppContext();
  // // const { app } = appContextAction;
  // const { isNavMenuClose, currentApp } = stateApp;

  const { isMobile } = useResponsive();

  const dispatch = useDispatch();

  useLayoutEffect(() => {
    dispatch(settingsAction.list({ entity: 'setting' }));
  }, []);

  // const appSettings = useSelector(selectAppSettings);

  const { isSuccess: settingIsloaded } = useSelector(selectSettings);

  // useEffect(() => {
  //   const { loadDefaultLang } = storePersist.get('firstVisit');
  //   if (appSettings.idurar_app_language && !loadDefaultLang) {
  //     window.localStorage.setItem('firstVisit', JSON.stringify({ loadDefaultLang: true }));
  //   }
  // }, [appSettings]);

  if (settingIsloaded)
    return (
      <ErrorBoundary>
        <Layout hasSider>
          <Navigation />

          {isMobile ? (
            <Layout style={{ marginLeft: 0 }}>
              <HeaderContent />
              <Content
                style={{
                  margin: '40px auto 30px',
                  overflow: 'initial',
                  width: '100%',
                  padding: '0 25px',
                  maxWidth: 'none',
                }}
              >
                <AppRouter />
              </Content>
            </Layout>
          ) : (
            <Layout>
              <HeaderContent />
              <Content
                style={{
                  margin: '40px auto 30px',
                  overflow: 'initial',
                  width: '100%',
                  padding: '0 50px',
                  maxWidth: 1400,
                }}
              >
                <AppRouter />
              </Content>
            </Layout>
          )}
        </Layout>
      </ErrorBoundary>
    );
  else return <PageLoader />;
}
