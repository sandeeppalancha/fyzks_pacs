import { Button, Card, Checkbox, Col, Form, Input, message, Radio, Row, Select, Spin } from "antd"
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_API } from "../../axios";
import { getUserDetails, makePostCall, setAccessToken, setUserDetails } from "../../utils/helper";
import "./add-template.scss";
import { useForm } from "antd/es/form/Form";
import CustomEditor from "../custom-editor";

const AddTemplate = () => {

  const [templateForm] = useForm();
  const [modalitites, setModalities] = useState([]);
  const [bodyPartsList, setBodyPartsList] = useState([]);
  const [prevTemplate, setPrevTemplate] = useState({});

  const [templateHtml, setTemplateHtml] = useState(null);
  const [submitInProgress, setSubmitInProgress] = useState(false);

  useEffect(() => {
    getModalities();
    getBodyParts();
  }, []);

  const getModalities = () => {
    makePostCall('/modalities-list')
      .then(res => {
        setModalities(res.data?.data || []);
      })
      .catch(e => {
        message.error("Error while getting units", e.message)
      })
  }

  const getBodyParts = () => {
    makePostCall('/body-parts-list')
      .then(res => {
        setBodyPartsList(res.data?.data || []);
      })
      .catch(e => {
        message.error("Error while getting units", e.message)
      })
  }

  const onSubmit = () => {
    const { modality, body_part, name } = templateForm.getFieldsValue();

    if (!templateHtml) {
      message.error("Please input the template html")
    }
    const payload = {
      modality, body_part, name, user_id: getUserDetails().username, html: templateHtml
    };
    setSubmitInProgress(true);
    makePostCall('/add-template', payload)
      .then(res => {
        if (res.data?.success) {
          message.success('Added successfully');
        } else {
          message.error(res.data?.message)
        }
      })
      .catch(e => {
        console.error("Error while adding", e);
        message.error(e.message)
      })
      .finally(() => {
        setSubmitInProgress(false)
      })
  }

  return (
    <Spin spinning={submitInProgress}>
      <div className="add-template-container">
        <div>
          <Card title="ADD NEW TEMPLATE" style={{ width: '1200px', margin: '2rem auto' }}>
            <Form form={templateForm} onFinish={onSubmit}>
              <Row>
                <Col >
                  <Form.Item
                    label="Modality"
                    name="modality"
                    rules={[
                      {
                        required: true,
                        message: "Please select modality!",
                      },
                    ]}
                  >
                    <Select
                      style={{ width: '200px' }}
                      options={modalitites?.map(itm => ({
                        label: itm.label,
                        value: itm.code
                      }))}
                    />
                  </Form.Item>
                </Col>
                <Col className="ms-3 me-3">
                  <Form.Item
                    label="Body Part"
                    name="body_part"
                    rules={[
                      {
                        required: true,
                        message: "Please select body part!",
                      },
                    ]}
                  >
                    <Select
                      style={{ width: '200px' }}
                      options={bodyPartsList?.map(itm => ({
                        label: itm.label,
                        value: itm.code
                      }))}
                    />
                  </Form.Item>


                </Col>
                <Col >
                  <Form.Item
                    label="Name"
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: "Please input template name!",
                      },
                    ]}
                  >
                    <Input style={{ width: '200px' }} />
                  </Form.Item>
                </Col>
              </Row>

              <CustomEditor initialContent={''} handleChange={(html) => {
                setTemplateHtml(html);
              }} />

              <Form.Item className="text-center mt-2">
                <Button style={{ width: 250 }} type="primary" htmlType="submit" className="text-center mx-auto">
                  SUBMIT
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>
    </Spin>
  )
}


export default AddTemplate;
