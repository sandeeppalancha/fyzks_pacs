import { Button, Card, Form, Input } from "antd"
import axios from "axios";
import React, { useEffect } from "react";
import { BASE_API } from "../../axios";
import { setAccessToken, setUserDetails } from "../../utils/helper";
import "./settings.css";
import { AddNewNode } from "../ManageNodes";

const Settings = () => {

  useEffect(() => {
  }, []);

  return (
    <div className="settings-container h-100">
      <div className="d-flex h-100">
        <div className="side-panel"></div>
        <div className="flex-1">
          <AddNewNode />
        </div>
      </div>
    </div>
  )
}


export default Settings;
