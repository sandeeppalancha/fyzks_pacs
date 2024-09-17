import { Button, Card, Form, Input } from "antd"
import axios from "axios";
import React, { useEffect } from "react";
import { BASE_API } from "../../axios";
import { setAccessToken, setUserDetails } from "../../utils/helper";
import "./login.css";

const Login = () => {
  const [loginForm] = Form.useForm();

  useEffect(() => {
    if (localStorage.getItem("user_details")) {
      window.location.href = "/";
    }
  });

  const onFinish = () => {
    const { username, password } = loginForm.getFieldsValue();
    axios.post(BASE_API + "/login", {
      username,
      password: password.toUpperCase(),
    })
      .then(res => {
        console.log("res", res);
        const resp_data = res?.data?.data;
        if (resp_data) {
          setUserDetails(resp_data.user_details);
          setAccessToken(resp_data.access_token);
        }
        window.location.href = "";
      })
      .catch(e => {
        console.log("error", e);
      })
  }

  return (
    <div className="login-container">
      <Card style={{ width: 600 }} className="ms-auto login-card">
        <div>
          <div className="login-header">Login</div>
          <Form form={loginForm} onFinish={onFinish}>
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                },
              ]}
            >
              <Input placeholder="Username" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Log in
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Card>
    </div>
  )
}


export default Login;
