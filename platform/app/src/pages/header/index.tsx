import React, { useState } from "react";
import "./header.css";
import UserOutlined from "@ant-design/icons/UserOutlined.js";
import { Avatar, Dropdown, Space, Menu, DatePicker, Select, Modal } from "antd";
import myImage from './fyzks-logo.png';
import { getUserDetails } from "../../utils/helper";
import dayjs from 'dayjs';
import FloatLabel from "../../components/FloatingLabel";
import ReportSearch from "../report-search";
import ReportEditor from "../ReportEditor";

const { RangePicker } = DatePicker;

const AppHeader = ({ handleDateChange }) => {
  const userId = localStorage.getItem("user_id");
  const userToken = localStorage.getItem("access_token");
  const [reportSearchModal, setReportSearchModal] = useState({ visible: false });
  const [reportEditorModal, setReportEditorModal] = useState({ visible: false, pat_details: null, selected_report: null });

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  }

  const handleReportSearch = () => {
    // navigate(`/reports?startDate=${startDate}&endDate=${endDate}`);
    setReportSearchModal({ visible: true });
  }

  const items = [
    {
      key: "1",
      label: <a onClick={handleLogout}>Logout</a>,
    },
    {
      key: "2",
      label: <a onClick={handleReportSearch}>Search Reports</a>,
    },
  ];

  const isAdmin = getUserDetails()?.user_type === 'admin';
  if (isAdmin) {
    items.push({
      key: "3",
      label: <a href="settings">Settings</a>,
    })
  }

  const userDetails = getUserDetails();

  const rangePresets = [
    { label: 'Today', value: 0 },
    { label: 'Last 2 Days', value: 1 },
    { label: 'Last 7 Days', value: 6 },
    { label: 'Last 30 Days', value: 30 },
  ];

  const onRangeChange = (val) => {
    handleDateChange(val);
    // [dayjs().add(-7, 'd'), dayjs()]
  }

  const openEditor = ({ pat_details, selected_report }) => {
    setReportSearchModal({ visible: false });
    setReportEditorModal({ visible: true, pat_details, selected_report });
  }

  const cancelReport = () => {
    setReportEditorModal({ visible: false, pat_details: null, selected_report: null });
  }

  return (
    <div className="header-container">
      <div className="logo">
        <img src={myImage} alt="Header" onClick={() => { window.location.href = "/" }} />
      </div>

      {/* <RangePicker className="ms-auto me-2" presets={rangePresets} onChange={onRangeChange} /> */}
      {
        userDetails ? <FloatLabel label="Date Range" className="ms-auto mt-auto me-3">
          <Select
            style={{ width: 200 }}
            options={rangePresets}
            onChange={onRangeChange}
          />
        </FloatLabel> : null
      }

      <div className="hospital-name">
        <span className="user-name">{userDetails?.user_fullname}</span>
      </div>
      <div className="profile">
        <Dropdown menu={{ items }}>
          <a onClick={(e) => e.preventDefault()}>
            {/* <Space> */}
            {userDetails ? <Avatar icon={<UserOutlined />} /> : null}
            {/* </Space> */}
          </a>
        </Dropdown>
      </div>
      {reportSearchModal.visible && (
        <Modal
          className="report-search-modal"
          open={reportSearchModal.visible}
          width={1000}
          onCancel={() => { setReportSearchModal({ visible: false }) }}
        >
          <ReportSearch openEditor={openEditor} />
        </Modal>
      )}
      {reportEditorModal.visible && (
        <Modal
          className="report-search-modal"
          open={reportEditorModal.visible}
          width={'100%'}
          onCancel={() => { setReportEditorModal({ visible: false }) }}
          footer={null}
        >
          <ReportEditor cancel={cancelReport} patientDetails={reportEditorModal.pat_details} selected_report={reportEditorModal.selected_report} />
        </Modal>
      )}
    </div>
  );
};

export default AppHeader;
