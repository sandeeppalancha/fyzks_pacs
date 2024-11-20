import { Button, Card, Form, Input, message, Radio, Select } from "antd"
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_API } from "../../axios";
import { getUserDetails, makeGetCall, makePostCall, setAccessToken, setUserDetails } from "../../utils/helper";
import "./manage-nodes.css";
import { useForm } from "antd/es/form/Form";

const AddNewNode = () => {

  const [nodeForm] = useForm();
  const [nodesList, setNodesList] = useState({});

  useEffect(() => {
    getNodesList();
  }, []);

  const getNodesList = () => {
    makeGetCall('/nodes-list')
      .then(res => {
        console.log("resp", res);
        setNodesList({ data: res.data, loading: false });
      })
      .catch(e => {
        console.log("Error ftching nodes", e);
        setNodesList({ loading: false, data: [] })
      })
  }

  return (
    <div className="nodes-list">
      <div>
      </div>
    </div>
  )
}


export default AddNewNode;
