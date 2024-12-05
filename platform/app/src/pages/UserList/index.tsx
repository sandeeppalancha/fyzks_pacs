import { Button, Card, message, Popconfirm, Spin, Table } from "antd"
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { makePostCall } from "../../utils/helper";
import "./user-list.css";

const UserList = () => {

  const [unitsList, setUnitsList] = useState([]);
  const [permissionsList, setPermissionsList] = useState([]);
  const [rolesList, setRolesList] = useState([]);
  const [usersList, setUsersList] = useState({ data: [], loading: false });
  const [deleteInProgress, setDeleteInProgress] = useState(false);

  useEffect(() => {
    getUnitsList();
    getPermissionsList();
    getRolesList();
    getUsersList();
  }, []);

  const getUsersList = () => {
    setUsersList({ loading: true, data: [] });
    makePostCall('/user-list', {})
      .then(res => {
        setUsersList({ data: res.data?.data || [], loading: false });
      })
      .catch(e => {
        setUsersList({ data: [], loading: false });
        message.error("Error while getting units", e.message)
      })
  }

  const getUnitsList = () => {
    makePostCall('/units-list')
      .then(res => {
        setUnitsList(res.data?.data || []);
      })
      .catch(e => {
        message.error("Error while getting units", e.message)
      })
  }

  const getPermissionsList = () => {
    makePostCall('/permissions-list')
      .then(res => {
        setPermissionsList(res.data?.data || []);
      })
      .catch(e => {
        message.error("Error while getting units", e.message)
      })
  }

  const getRolesList = () => {
    makePostCall('/roles-list')
      .then(res => {
        setRolesList(res.data?.data || []);
      })
      .catch(e => {
        message.error("Error while getting units", e.message)
      })
  }

  const editUser = (user) => {
    console.log("edit user", user);
  }

  const deleteUser = (usr) => {
    console.log("delete user", usr);
    setDeleteInProgress(true);
    makePostCall('/deactivate-user', { username: usr.username })
      .then(res => {
        getUsersList();
        setDeleteInProgress(false);
      })
      .catch(e => {
        message.error(e || "Something went wrong");
        setDeleteInProgress(false);
      })
  }

  const USER_COLUMNS = [
    {
      title: "Full Name",
      key: 'fullname',
      render: (_, record) => {
        return record.first_name ? `${record.first_name} ${record.last_name || ''}` : record.user_fullname
      }
    },
    {
      title: "Login",
      key: 'login',
      render: (_, record) => {
        return `${record.username}`
      }
    },
    {
      title: "Profile",
      key: 'profile',
      render: (_, record) => {
        return `${record.user_type || 'NA'}`
      }
    },
    {
      title: "Site Name",
      key: 'sitename',
      render: (_, record) => {
        return `${record.user_unit_name || 'NA'}`
      }
    },

    {
      title: "Created Date",
      key: 'created_dt',
      render: (_, record) => {
        return `${record.user_created_dt || 'NA'}`
      }
    },
    {
      title: "",
      key: 'action',
      render: (_, record) => {
        return (
          <div>
            <Button><EditOutlined onClick={editUser} /> </Button>
            <Popconfirm
              title={"Delete user?"}
              onConfirm={() => {
                deleteUser(record);
              }}
              onCancel={() => {
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button>
                <DeleteOutlined />
              </Button>
            </Popconfirm>
          </div>
        )
      }
    }
  ];

  return (
    <Spin spinning={usersList?.loading || deleteInProgress}>
      <div className="users-container">
        <div>
          <Card bordered={false} title={<div className="page-title">USERS</div>} style={{ width: '100%', margin: '2rem auto' }}>
            <Table
              columns={USER_COLUMNS}
              dataSource={usersList?.data}
            />
          </Card>
        </div>
      </div>
    </Spin>
  )
}


export default UserList;
