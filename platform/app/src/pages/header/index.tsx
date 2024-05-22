import React, { useState } from "react";
import "./header.css";
import UserOutlined from "@ant-design/icons/UserOutlined.js";
import { Avatar, Dropdown, Space, Menu } from "antd";
import myImage from './fyzks-logo.png';
import { getUserDetails } from "../../utils/helper";

const AppHeader = () => {
  const userId = localStorage.getItem("user_id");
  const userToken = localStorage.getItem("access_token");

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  }

  const items = [
    {
      key: "1",
      label: <a onClick={handleLogout}>Logout</a>,
    },
  ];

  const userDetails = getUserDetails();

  return (
    <div className="header-container">
      <div className="logo">
        <img src={myImage} alt="Header" />
      </div>
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
    </div>
  );
};

export default AppHeader;
