import React from "react";
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from '@ant-design/icons';

export const NavigationItems = (onNavChange) => {
  return [
    {
      key: 'users',
      label: 'Manage Users',
      icon: <MailOutlined />,
      children: [
        { key: 'users_list', label: 'Users' },
        { key: 'add_user', label: 'Add User' },
      ],
    },
    {
      key: 'nodes',
      label: 'Node Configuration',
      icon: <AppstoreOutlined />,
      children: [
        { key: 'nodes_list', label: 'Nodes List' },
        { key: 'add_node', label: 'Add New Node' },
      ],
    },
    {
      key: 'templates',
      label: 'Templates',
      icon: <AppstoreOutlined />,
      children: [
        // { key: 'templates', label: 'Nodes List' },
        { key: 'add_template', label: 'Add New Template' },
      ],
    },
  ];
}
