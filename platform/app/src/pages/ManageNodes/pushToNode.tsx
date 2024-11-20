import { Button, Card, Form, Input, message, Radio, Select } from "antd"
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_API } from "../../axios";
import { getUserDetails, makeGetCall, makePostCall, setAccessToken, setUserDetails } from "../../utils/helper";
import "./manage-nodes.css";
import { useForm } from "antd/es/form/Form";

const PushToNode = ({ selectedStudies }) => {

  const [nodeForm] = useForm();
  const [nodesList, setNodesList] = useState({});
  const [selectedNode, setSelectedNode] = useState();

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

  const pushImages = () => {
    console.log("push images", selectedNode, selectedStudies);
    const payload = {
      nodeDetails: selectedNode,
      studiesToPush: selectedStudies,
    }
    makePostCall('/push-studies', payload)
      .then(res => {
        console.log("Pushing done");
      }).catch(e => {
        console.error("Error while pushing -- " + e);
      })
  }

  return (
    <div className="nodes-list">
      <div>
        <div>Select Node</div>
        <Select
          options={nodesList?.data?.map(itm => ({
            label: itm.en_node_name,
            value: itm.en_id
          }))
          }
          onChange={(val) => setSelectedNode(val)}
        />
        <Button onClick={pushImages}>Push Images</Button>
      </div>
    </div>
  )
}

export default PushToNode;
