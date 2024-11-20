import { Button, Card, Form, Input, message, Radio, Select } from "antd"
import axios from "axios";
import React, { useEffect } from "react";
import { BASE_API } from "../../axios";
import { getUserDetails, makePostCall, setAccessToken, setUserDetails } from "../../utils/helper";
import "./manage-nodes.css";
import { useForm } from "antd/es/form/Form";

const AddNewNode = () => {

  const [nodeForm] = useForm();

  useEffect(() => {
  }, []);

  const onSubmit = () => {
    console.log("on submit", nodeForm.getFieldsValue());
    const { ip, port, aet, name, operations, location, comments } = nodeForm.getFieldsValue();
    const payload = {
      ip, port, aet, name, operations, location, user_id: getUserDetails().username, comments
    };
    makePostCall('/add-modality', payload)
      .then(res => {
        console.log("added modality");
        message.success('Added successfully')
      })
      .catch(e => {
        console.error("Error while adding", e);
        message.error(e)
      })
  }

  return (
    <div className="add-node-container">
      <div>
        <Card title="Add New Node" style={{ width: '600px', margin: '2rem auto' }}>
          <Form form={nodeForm} onFinish={onSubmit}>
            <Form.Item
              name="name"
              label="Node Name"
              rules={[
                {
                  required: true,
                  message: "Please input node name!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="location"
              label="Location"
              rules={[
                {
                  required: true,
                  message: "Please select Location!",
                },
              ]}
            >
              <Select />
            </Form.Item>
            <Form.Item
              name="ip"
              label="IP Address"
              rules={[
                {
                  required: true,
                  message: "Please input ip address!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="port"
              label="Port"
              rules={[
                {
                  required: true,
                  message: "Please input port!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="AE Title"
              name="aet"
              rules={[
                {
                  required: true,
                  message: "Please input ae title!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Allowed Operations"
              name="operations"
              rules={[
                {
                  required: true,
                  message: "Please select!",
                },
              ]}
            >
              <Radio.Group >
                <Radio value={1}>push</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label="Comments"
              name="comments"
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                SUBMIT
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  )
}


export default AddNewNode;
