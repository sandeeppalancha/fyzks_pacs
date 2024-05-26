import React, { useEffect } from "react";
import RichTextEditor from "./rich-text-editor";
import "./editor.css";
import { ConvertStringToDate, makeGetCall, makePostCall } from "../../utils/helper";
import moment from "moment";
import { Button, Card, Checkbox, Radio, Select, Table } from "antd";
import { TemplateHeader } from "./constants";
import { RightSquareOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";


const ReportEditor = ({ cancel, onSave, patientDetails }) => {
  const [content, setContent] = React.useState(null);
  const [reportsData, setReportsData] = React.useState([]);
  const [currentReport, setCurrentReport] = React.useState(null);
  const [templates, setTemplates] = React.useState([]);
  const [selectedNode, setSelectedNode] = React.useState(null);

  const handleContentChange = (newContent) => {
    // console.log("newContent", newContent);
    // setContent(newContent);
  }

  console.log("patientDetails", patientDetails);

  useEffect(() => {
    fetchPrevReports();
    getTemplates();
  }, []);

  const refreshAfterUpdate = () => {
    fetchPrevReports();
  }

  const handleSave = (newContent, status, curReport) => {
    onSave(newContent, status, curReport, refreshAfterUpdate);
  }

  const fetchPrevReports = () => {
    makePostCall('/get-reports', {
      yh_no: patientDetails?.po_pin,
      order_no: patientDetails?.po_ord_no,
      acc_no: patientDetails?.po_acc_no,
    })
      .then(res => {
        console.log("resp", res);
        const resp_data = res.data?.data || [];
        setReportsData(resp_data);
        setCurrentReport(resp_data[0]);
      })
      .catch(e => {
        console.log(e);
      })
  }

  const getTemplates = () => {
    makeGetCall('/get-templates')
      .then(res => {
        console.log("templ", res);
        setTemplates(res?.data?.data || []);
      })
      .catch(e => {
        console.log(e);
      })
  }

  useEffect(() => {
    if (currentReport) {
      // setContent(`${TemplateHeader(patientDetails)}${currentReport?.pr_html}`);
      setContent(`${currentReport?.pr_html}`);
    }
  }, [currentReport]);

  console.log("templates", templates);

  const reportColumns = [
    {
      title: 'Created By',
      dataIndex: 'pr_created_by',
      key: 'pr_created_by',
    },
    {
      title: 'Created Date',
      dataIndex: 'created_at',
      key: 'created_at',
    },
    {
      title: 'Status',
      dataIndex: 'pr_status',
      key: 'pr_status',
    },
    {
      title: '',
      key: 'actions',
      render: (_, record) => {
        return (
          <span>
            <DeleteOutlined style={{ fontSize: '16px', color: 'red' }} className="mr-2" onClick={() => handleDelete(record)} />
            <RightSquareOutlined style={{ fontSize: '16px', color: 'blue' }} onClick={() => loadTemplate(record)} />
          </span>
        )
      }
    }
  ];

  const loadTemplate = (rec) => {
    console.log("rec", rec);
    // setCurrentReport(rec);
    setCurrentReport(rec)
  }

  const handleDelete = (rec) => {
    console.log("rec", rec);
    makePostCall('/delete-report', {
      report_id: rec?.pr_id,
      yh_no: patientDetails?.po_pin,
    })
      .then(res => {
        console.log("resp", res);
        fetchPrevReports();
      })
      .catch(e => {
        console.log(e);
      });
  }

  const handleTemplateChange = (val) => {
    console.log('selected template', val);
    fetch(`/templates/${val}.html`)
      .then(response => response.text())
      .then(html => {
        // Do something with the HTML content
        console.log(html);
        // setContent(html)
        setCurrentReport({ pr_html: html });
      })
      .catch(error => console.error('Error:', error));
  }

  console.log("selected", templates[selectedNode]);

  return (
    <div className="editor-container">
      <div className="left-section">
        <Card className="mb-3">
          <div className="!patient-details">
            <div className="d-flex">
              <div className="pat-name">
                {`${patientDetails?.po_pat_name}, ${patientDetails?.po_pin}`}
              </div>
              {/* <Link to={}>Go to Viewer</Link> */}
              <Button danger className="ms-auto" type="default" onClick={() => { window.open(`/viewer?StudyInstanceUIDs=${patientDetails?.po_study_uid}`, '_blank') }}> Launch Viewer</Button>
            </div>
            <div>
              {`${patientDetails?.po_pat_sex} / ${patientDetails?.po_age}`}
            </div>
            <div>{`${patientDetails?.modality} / ${patientDetails?.po_ref_doc} ,
            ${moment(ConvertStringToDate(patientDetails?.po_study_dt, patientDetails?.po_study_tm)).format("DD-MM-YYYY HH:mm:ss")}`}
            </div>
          </div>
        </Card>
        <Card className="mb-3">
          <div className="!previous-reports">
            <Table
              pagination={false}
              columns={reportColumns}
              dataSource={reportsData ? reportsData?.slice(0, 2) : []}
            />

          </div>
        </Card>
        <Card className="mb-3">
          <div className="!templates-section">
            <div className="bold-font">Load Template</div>
            <div>
              <span>Node</span>
              <Select style={{ width: 180 }} onChange={(val) => { setSelectedNode(val) }} options={Object.keys(templates)?.map((itm) => ({ label: itm, value: itm }))} />
              <span className="ms-3">Template</span>
              <Select onChange={(val) => {
                handleTemplateChange(val);
              }} style={{ width: 200 }} options={(templates && templates[selectedNode]) ? templates[selectedNode]?.map(itm => ({ label: itm.label, value: itm.template })) : []} />
            </div>
          </div>
        </Card>
        <Card className="mb-3">
          <div className="!more-options">
            <div className="bold-font">More Options</div>
            <div><Checkbox /> There is a critical finding. Notify to physician</div>
            <div><Checkbox /> Need peer opinion from</div>
            <div><Checkbox /> Requires Sub-Speciality Opinion</div>
            <div><Checkbox /> Report Co-Signing</div>
            <div><Checkbox /> Proxy Draft</div>
            <div><Checkbox /> Proxy Signoff</div>
            <div>Clinically diagnosed
              <Radio.Group >
                <Radio value={1}>A</Radio>
                <Radio value={2}>B</Radio>
              </Radio.Group>
            </div>
          </div>
        </Card>
      </div>
      <div className="right-section">
        <RichTextEditor patDetails={patientDetails} currentReport={currentReport} cancel={cancel} content={content || "<div></div>"}
          onSave={handleSave} onChange={handleContentChange} />
      </div>
    </div>
  );
};

export default ReportEditor;
