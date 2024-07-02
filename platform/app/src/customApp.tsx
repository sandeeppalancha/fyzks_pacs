import React, { useEffect } from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import ReactDOM from 'react-dom';
import App from './App';
import { Tabs } from "antd";
import OrdersList from './pages/orders';
import { ConfigProvider } from "antd";
import AppHeader from './pages/header';
import "./custom-app.css";
import "./index.css";
import WysigEditor from './pages/ReportEditor/wysig';
import Login from './pages/login';
import { ErrorBoundary } from "react-error-boundary";
import MyWorklist from './pages/my-workilist';

const MyViewer = ({ appProps }) => {
  useEffect(() => {
    console.log("inside use viewer", appProps);

    const app = React.createElement(App, appProps, null);
    const pacs_app_element = document.getElementById('pacs-app');
    console.log("pcs app eellment", pacs_app_element);

    if (pacs_app_element) {
      ReactDOM.render(app, pacs_app_element);
    }

  }, []);

  return (<div id="!pacs-app">
    <ErrorBoundary fallback={<div>Something went wrong. Please refresh the browser tab</div>}>
      <App config={appProps.config} defaultExtensions={appProps.defaultExtensions} defaultModes={appProps.defaultModes} />
    </ErrorBoundary>
  </div>);
};

function CustomApp(appProps) {

  const [selectedTabKey, setSelectedTabKey] = React.useState('worklist');
  const currentUrl = window.location.href;

  useEffect(() => {
    console.log("inside use custom app", currentUrl);
  }, [currentUrl]);

  const items: TabsProps['items'] = [
    {
      key: 'worklist',
      label: 'My Worklist',
      children: <>
        <MyWorklist />
      </>,
    },
    {
      key: 'orders',
      label: 'Orders',
      children: <OrdersList />,
    },
    {
      key: 'viewer_pacs',
      label: 'Viewer',
      children: <MyViewer appProps={appProps} />,
      disabled: true,
    },
  ];

  const ViewerElement = () => {
    return (
      <MyViewer appProps={appProps} />
    );
  };

  const AppView = () => {
    return (
      <BrowserRouter>
        <div className="app-content" style={{ background: "white", height: '100vh' }}>
          <Routes>
            <Route path='/' element={
              <>
                <Tabs onTabClick={(activeKey) => {
                  if (selectedTabKey !== activeKey) {
                    setSelectedTabKey(activeKey);
                    // if (activeKey !== 'viewer_pacs') {
                    //   window.location.href = '/';
                    // }
                  }
                }} activeKey={selectedTabKey} style={{ background: 'white' }} items={items} />

              </>
            }
            />
            <Route
              path="/orders"
              element={
                <>
                  <OrdersList />
                </>
              }
            />
            <Route
              path="/login"
              element={
                <>
                  <Login />
                </>
              }
            />
            {/* <Route
              path="/viewer"
              element={
                <>
                  <MyViewer appProps={{ appProps }} />
                </>
              }
            /> */}
          </Routes>
        </div>
      </BrowserRouter>
    )
  };

  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#EF8200",
          },
        }}
      >
        {currentUrl.includes('/viewer') ? null : <AppHeader />}
        <div className={currentUrl.includes('/viewer') ? 'viewer-body' : 'custom-body'}>
          {
            currentUrl.includes('/viewer') ?
              <ViewerElement /> :
              <AppView />
          }
        </div>
      </ConfigProvider>

    </>
  );
};

export default CustomApp;
