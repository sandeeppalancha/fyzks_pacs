import { Button, Card, Form, Input, Menu, Tooltip } from "antd"
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { BASE_API } from "../../axios";
import { setAccessToken, setUserDetails } from "../../utils/helper";
import "./settings.css";
import { AddNewNode } from "../ManageNodes";
import { NavigationItems } from "./constants";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import AddUser from "../AddUser";
import UserList from "../UserList";

const Settings = () => {

  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('');

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
  }, []);

  const onNavChange = (item) => {
    console.log("onNavChange", item);
    setSelectedMenu(item.key);
  }

  const menuToPage = {
    // nodes_list: <NodeList />,
    add_node: <AddNewNode />,
    users_list: <UserList />,
    add_user: <AddUser />
  };


  return (
    <div className="settings-container h-100">
      <div className="d-flex h-100">
        <div className="side-menu">
          <Tooltip title={collapsed ? 'Expand' : 'Collapse'}>
            <Button type="primary" className="toggle-btn" onClick={toggleCollapsed} style={{ marginBottom: 16 }}>
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </Button>
          </Tooltip>
          <Menu
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="inline"
            // theme="dark"
            inlineCollapsed={collapsed}
            items={NavigationItems(onNavChange)}
            onClick={onNavChange}
          />
        </div>
        <div className="flex-1 content-area">
          {/* <div className="page-title text-center">SETTINGS</div> */}
          {menuToPage[selectedMenu]}
        </div>
      </div>
    </div>
  )
}


export default Settings;
