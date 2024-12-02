import { Button, Card, Checkbox, Form, Input, message, Radio, Select } from "antd"
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_API } from "../../axios";
import { getUserDetails, makePostCall, setAccessToken, setUserDetails } from "../../utils/helper";
import "./add-user.css";
import { useForm } from "antd/es/form/Form";

const AddUser = () => {

  const [userForm] = useForm();
  const [unitsList, setUnitsList] = useState([]);
  const [permissionsList, setPermissionsList] = useState([]);
  const [rolesList, setRolesList] = useState([]);
  const [image, setImage] = useState(null);

  useEffect(() => {
    getUnitsList();
    getPermissionsList();
    getRolesList();
  }, []);

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

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = () => {
    const { user_firstname, user_lastname, username, password, user_designation, user_mobile, user_email, user_type, user_unit_name,
      user_degree, user_signature, permissions, confirmPassword } = userForm.getFieldsValue();

    if (password !== confirmPassword) {
      message.error("Password confirmation doesn't match. Please retry")
    }
    const payload = {
      user_firstname, user_lastname, username, password: password.toUpperCase(), user_designation, user_mobile, user_email, user_type, user_unit_name,
      user_degree, permissions, user_id: getUserDetails().username, user_signature: image
    };
    makePostCall('/add-user', payload)
      .then(res => {
        if (res.data?.success) {
          message.success('Added successfully')
        } else {
          message.error(res.data?.message)
        }
      })
      .catch(e => {
        console.error("Error while adding", e);
        message.error(e.message)
      })
  }

  return (
    <div className="add-user-container">
      <div>
        <Card title="ADD NEW USER" style={{ width: '600px', margin: '2rem auto' }}>
          <Form form={userForm} onFinish={onSubmit}>
            <Form.Item
              name="username"
              label="Login"
              rules={[
                {
                  required: true,
                  message: "Please input login ID!",
                },
              ]}
            >
              <Input autoComplete="off" />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[
                {
                  required: true,
                  message: "Please input user password!",
                },
              ]}
              className="password"
            >
              <Input autoComplete="off" />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              label="Re-type Password"
              rules={[
                {
                  required: true,
                  message: "Please re-type password!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="user_firstname"
              label="First Name"
              rules={[
                {
                  required: true,
                  message: "Please input first name!",
                },
              ]}
            >
              <Input autoComplete="off" />
            </Form.Item>
            <Form.Item
              name="user_lastname"
              label="Last Name"
            >
              <Input autoComplete="off" />
            </Form.Item>

            <Form.Item
              name="user_email"
              label="Email"
              rules={[
                {
                  type: "email",
                  message: "Please enter a valid email address!",
                },
              ]}
            >
              <Input type="email" autoComplete="off" />
            </Form.Item>
            <Form.Item
              name="user_mobile"
              label="Mobile"
              rules={[
                {
                  pattern: /^[6-9]\d{9}$/,
                  message: "Please enter a valid 10-digit mobile number!",
                },
              ]}
            >
              <Input type="number" autoComplete="off" />
            </Form.Item>

            <Form.Item
              label="Designation"
              name="user_designation"
              rules={[
                {
                  required: true,
                  message: "Please input designation!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Degree"
              name="user_degree"
              rules={[
                {
                  required: true,
                  message: "Please input degree!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Profile"
              name="user_type"
              rules={[
                {
                  required: true,
                  message: "Please input profile!",
                },
              ]}
            >
              <Select
                options={rolesList?.map(itm => ({
                  label: itm.role_label,
                  value: itm.role_code
                }))}
              />
            </Form.Item>
            <Form.Item
              label="Location"
              name="user_unit_name"
              rules={[
                {
                  required: true,
                  message: "Please select unit!",
                },
              ]}
            >
              <Select
                options={unitsList?.map(itm => ({
                  label: itm.unit_label,
                  value: itm.unit_code
                }))}

              />
            </Form.Item>
            <Form.Item
              label="Signature"
              name="user_signature"
              rules={[
                {
                  required: userForm.getFieldValue('user_type') === 'hod',
                  message: "Please input signature!",
                },
              ]}
            >
              <Input type="file" accept="image/*" onChange={handleImageChange} />
            </Form.Item>
            <Form.Item
              label="Permissions"
              name="permissions"
              rules={[
                {
                  required: true,
                  message: "Please select!",
                },
              ]}
            >
              <Checkbox.Group >
                {
                  permissionsList?.map(itm => (
                    <Checkbox key={itm.permission_code} value={itm.permission_code}>{itm.permission_label}</Checkbox>
                  ))
                }
              </Checkbox.Group>
            </Form.Item>
            <Form.Item className="text-center">
              <Button style={{ width: 250 }} type="primary" htmlType="submit" className="text-center mx-auto">
                CREATE USER
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  )
}


export default AddUser;
