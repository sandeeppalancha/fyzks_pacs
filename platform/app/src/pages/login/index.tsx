import { Button, Card, Form, Input } from "antd"
import React from "react";

const Login = () => {
  const [loginForm] = Form.useForm();

  const onFinish = () => {

  }
  return (
    <div className="login-container">
      <Card style={{ width: 600 }} className="ms-auto">
        <div>
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
