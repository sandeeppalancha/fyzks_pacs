import React, { useEffect, useState } from 'react';
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
import PacsList from './pages/pacs';
import { getUserDetails } from './utils/helper';
import dayjs from 'dayjs';
import Settings from './pages/settings';
import DispatchList from './pages/Dispatch';

const MyViewer = ({ appProps }) => {

  useEffect(() => {
    const app = React.createElement(App, appProps, null);
    const pacs_app_element = document.getElementById('pacs-app');
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

  const userDetails = getUserDetails();
  const isTechnician = userDetails?.user_type === 'technician';
  const userType = userDetails?.user_type;
  const [selectedTabKey, setSelectedTabKey] = React.useState(isTechnician ? 'orders' : userType === 'dispatch' ? 'dispatch' : 'worklist');
  const currentUrl = window.location.href;
  const [appDateRange, setAppDateRange] = useState([null, null]);


  useEffect(() => {
  }, [currentUrl]);

  const ordersPage = {
    key: 'orders',
    label: 'Orders',
    children: <OrdersList appDateRange={appDateRange} />,
  };

  const workListTab = {
    key: 'worklist',
    label: 'My Worklist',
    children: <>
      <MyWorklist appDateRange={appDateRange} />
    </>,
  };

  const pacsTab = {
    key: 'pacs',
    label: 'PACS',
    children: <>
      <PacsList appDateRange={appDateRange} />
    </>,
  };

  const dispatchTab = {
    key: 'dispatch',
    label: 'Dispatch',
    children: <>
      <DispatchList appDateRange={appDateRange} />
    </>,
  };

  const viewerTab = {
    key: 'viewer_pacs',
    label: 'Viewer',
    children: <MyViewer appProps={appProps} />,
    disabled: true,
  };

  let items: TabsProps['items'] = userType === 'technician' ? [
    ordersPage
  ] : userType === 'dispatch' ? [
    dispatchTab
  ] : [
    workListTab,
    pacsTab,
  ];

  const ViewerElement = () => {
    return (
      <MyViewer appProps={appProps} />
    );
  };

  const AppView = ({ appDateRange }) => {
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
            <Route
              path="/settings"
              element={
                <>
                  <Settings />
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

  const handleDateChange = (val) => {
    setAppDateRange([dayjs().add(-val, 'd'), dayjs()]);
    // [dayjs().add(-7, 'd'), dayjs()]
  }

  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#EF8200",
          },
        }}
      >
        {currentUrl.includes('/viewer') ? null : <AppHeader handleDateChange={handleDateChange} />}
        <div className={currentUrl.includes('/viewer') ? 'viewer-body' : 'custom-body'}>
          {
            currentUrl.includes('/viewer') ?
              <ViewerElement /> :
              <AppView appDateRange={appDateRange} />
          }
        </div>
      </ConfigProvider>
    </>
  );
};

export default CustomApp;
