import React, { useEffect, useMemo, useState } from "react";
import RichTextEditor from "./rich-text-editor";
import "./editor.css";
import { ConvertStringToDate, getUserDetails, makeGetCall, makePostCall, RADIOLOGY_URL } from "../../utils/helper";
import moment from "moment";
import { Button, Card, Checkbox, message, Modal, Radio, Select, Table } from "antd";
import { TemplateHeader } from "./constants";
import { RightSquareOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import CriticalFinding from "./critical-finding";


const ReportEditor = ({ cancel, onSave, patientDetails, selected_report }) => {
  const [content, setContent] = React.useState(null);
  const [reportsData, setReportsData] = React.useState([]);
  const [currentReport, setCurrentReport] = React.useState(null);
  const [templates, setTemplates] = React.useState([]);
  const [nodes, setNodes] = React.useState([]);
  const [selectedNode, setSelectedNode] = React.useState(null);
  const [proxyUser, setProxyUser] = React.useState(null);
  const [moreAction, setMoreAction] = React.useState(null);
  const [radUsers, setRadUsers] = React.useState([]);
  const userType = getUserDetails().user_type;
  const [correlated, setCorrelated] = useState(null);
  const [diagnosed, setDiagnosed] = useState(null);
  const [submitTriggered, setSubmitTrigged] = useState(false);
  const [criticalFindingModal, setCriticalFindingModal] = useState({ visible: false, data: {} })

  const handleContentChange = (newContent) => {
    console.log("newContent", newContent);
    setContent(newContent);
  }

  useEffect(() => {
    fetchPrevReports();
    // getTemplates();
    getNodes();
    fetchRadUsers();
  }, []);

  useEffect(() => {
    if (patientDetails) {
      setCorrelated(patientDetails?.po_correlated);
      setDiagnosed(patientDetails?.po_diagnosed);
    }
  }, [patientDetails]);

  const refreshAfterUpdate = () => {
    fetchPrevReports();
  }

  const handleSave = (newContent, status, curReport, moreInfo = {}) => {
    if (onSave) {
      onSave(content, status, curReport, { ...moreInfo, proxy_user: proxyUser, correlated, diagnosed }, refreshAfterUpdate)
    } else {
      saveReport(content, status, curReport, { ...moreInfo, proxy_user: proxyUser }, refreshAfterUpdate)
    };
  }

  const saveReport = (newContent, status, currentReport, { proxy_user }, callback) => {
    makePostCall('/submit-report', {
      html: newContent,
      yh_no: patientDetails?.po_pin,
      order_no: patientDetails?.po_ord_no,
      acc_no: patientDetails?.po_acc_no,
      user_id: getUserDetails()?.username,
      proxy_user: proxy_user,
      status,
      report_id: currentReport?.pr_id,
      // correlated: correlated,
      // diagnosed: diagnosed,
    })
      .then(res => {
        callback && callback();
      })
      .catch(e => {
        console.log(e);
      });
  }

  const fetchRadUsers = () => {
    makeGetCall('/get-rad-users')
      .then(res => {
        setRadUsers(res.data?.data || []);
      })
      .catch(e => {
        console.log(e);
        setRadUsers([]);
      })
  }

  const fetchPrevReports = () => {
    makePostCall('/get-reports', {
      yh_no: patientDetails?.po_pin,
      order_no: patientDetails?.po_ord_no,
      acc_no: patientDetails?.po_acc_no,
    })
      .then(res => {
        const resp_data = res.data?.data || [];
        setReportsData(resp_data);
        setCurrentReport(resp_data[0]);
      })
      .catch(e => {
        console.log(e);
      })
  }

  const getTemplates = () => {
    makeGetCall(`/get-templates?modality=${patientDetails?.modality}&node=${selectedNode}`)
      .then(res => {
        setTemplates(res?.data?.data || []);
      })
      .catch(e => {
        console.log(e);
      })
  }

  const getNodes = () => {
    makeGetCall(`/get-nodes?modality=${patientDetails?.modality}`)
      .then(res => {
        setNodes(res?.data?.data || []);
      })
      .catch(e => {
        console.log(e);
      })
  }

  useEffect(() => {
    if (selectedNode) {
      getTemplates()
    }
  }, [selectedNode]);

  useEffect(() => {
    if (currentReport) {
      // setContent(`${TemplateHeader(patientDetails)}${currentReport?.pr_html}`);
      setContent(`${currentReport?.pr_html}`);
    }
  }, [currentReport]);

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
    // setCurrentReport(rec);
    setCurrentReport(rec)
  }

  const handleDelete = (rec) => {
    makePostCall('/delete-report', {
      report_id: rec?.pr_id,
      yh_no: patientDetails?.po_pin,
    })
      .then(res => {
        fetchPrevReports();
      })
      .catch(e => {
        console.log(e);
      });
  }

  const handleTemplateChange = (val) => {
    setCurrentReport({ pr_html: val })
    // fetch(`/templates/${val}.html`)
    //   .then(response => response.text())
    //   .then(html => {
    //     // Do something with the HTML content
    //     // setContent(html)
    //     setCurrentReport({ pr_html: html });
    //   })
    //   .catch(error => console.error('Error:', error));
  }

  const radUserOptions = useMemo(() => {
    return radUsers.map(user => ({
      label: user.user_fullname,
      value: user.username
    }));

  }, [radUsers]);

  const handleSaveForm = (status) => {
    setSubmitTrigged(true);
    if (!correlated || !diagnosed) {
      message.error("Please select the Correlated & Diagnosed options");
      return;
    }
    handleSave(content, status, currentReport,);
  }

  const handlePrint = () => {
    makePostCall('/print-report', {
      report: currentReport,
      patDetails: patientDetails,
      html: content, //.replaceAll(' ', '&nbsp'),
    }, {
      responseType: "arraybuffer",
    })
      .then(res => {
        const pdfBlob = new Blob([res.data], { type: "application/pdf" });
        const pdf_url = URL.createObjectURL(pdfBlob);
        // setPdfUrl(url);
        const printWindow = window.open(pdf_url, "_blank");
        printWindow.print();
      })
      .catch(err => {
        console.log("Error", err);
      })
  }

  const statusOrder = ['DRAFTED', 'REVIEWED', 'SIGNEDOFF'];

  const handleNotification = () => {
    setCriticalFindingModal({ visible: true, data: patientDetails })
  }

  const goToRadiologyDesk = (patDetails) => {
    const { po_pin, po_acc_no, po_site } = patDetails;
    window.open(`${RADIOLOGY_URL(po_pin, po_site)}`, '_blank')
  }

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
              <Button danger className="ms-auto" type="default" onClick={() => { goToRadiologyDesk(patientDetails) }}> Radiology Desk</Button>
            </div>
            <div>
              {`${patientDetails?.po_pat_sex} / ${patientDetails?.po_pat_dob ? moment(patientDetails?.po_pat_dob).fromNow(true) : 'NA'}`}
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
              <Select style={{ width: 180 }} onChange={(val) => { setSelectedNode(val) }} options={nodes?.map((itm) => ({ label: itm?.label, value: itm?.code }))} />
              <span className="ms-3">Template</span>
              <Select onChange={(val) => {
                handleTemplateChange(val);
              }} style={{ width: 200 }} options={templates?.map(itm => ({ label: itm.rt_display_name, value: itm.template_html }))} />
            </div>
          </div>
        </Card>
        <Card className="mb-3">
          <div className="!more-options">
            <div className="bold-font">More Options</div>
            <div><Button onClick={handleNotification}> Notify Physician</Button></div>
            <div><Checkbox /> Need peer opinion from</div>
            <div><Checkbox /> Requires Sub-Speciality Opinion</div>
            <div><Checkbox /> Report Co-Signing</div>

            <div><Checkbox onChange={(e) => {
              setMoreAction(e.target.checked ? 'proxy-draft' : null)
            }} /> Proxy Draft
              {moreAction === 'proxy-draft' && (
                <Select style={{ width: 180 }} onChange={(val) => { setProxyUser(val) }} options={radUserOptions} />
              )}
            </div>

            <div><Checkbox onChange={(e) => {
              setMoreAction(e.target.checked ? 'proxy-signoff' : null)
            }} /> Proxy Signoff
              {moreAction === 'proxy-signoff' && (
                <Select style={{ width: 180 }} onChange={(val) => { setProxyUser(val) }} options={radUserOptions} />
              )}
            </div>

            <div>Clinically diagnosed
              <Radio.Group value={diagnosed} className={submitTriggered ? (!!diagnosed ? '' : 'error') : ''} onChange={(e) => { setDiagnosed(e.target.value) }}>
                <Radio value={'diagnosed'}>Yes</Radio>
                <Radio value={'notdiagnosed'}>No</Radio>
              </Radio.Group>
              {submitTriggered && !diagnosed && <div style={{ color: 'red', marginBottom: '8px' }}>This field is required</div>}
            </div>
            <div>Clinically correlated
              <Radio.Group value={correlated} className={submitTriggered ? (!!correlated ? '' : 'error') : ''} onChange={(e) => { setCorrelated(e.target.value) }}>
                <Radio value={'correlated'}>Yes</Radio>
                <Radio value={'notcorrelated'}>No</Radio>
              </Radio.Group>
              {submitTriggered && !correlated && <div style={{ color: 'red', marginBottom: '8px' }}>This field is required</div>}
            </div>
          </div>
          <div className='d-flex' >
            <Button className='mt-3' type='default' onClick={cancel}>Cancel</Button>
            <Button className='mt-3' type='default' onClick={handlePrint}>PRINT REPORT</Button>
            <Button
              disabled={statusOrder.indexOf(currentReport?.pr_status) > 0}
              danger className='mt-3 ms-auto' type='default'
              color='primary' onClick={() => handleSaveForm('draft')}
            >DRAFT</Button>
            <Button
              disabled={currentReport?.pr_status === 'SIGNEDOFF'}
              danger className='mt-3 ms-3' type='default' color='primary'
              onClick={() => handleSaveForm('reviewed')}
            >REVIEWED</Button>
            <Button
              // disabled={statusOrder.indexOf(currentReport?.pr_status) < 1}
              className='mt-3 ms-3' type='primary' color='primary'
              onClick={() => handleSaveForm('signoff')}
              disabled={['hod', 'radiologist'].indexOf(userType) < 0}
            >
              SIGN OFF
            </Button>
          </div>
        </Card>
      </div>
      <div className="right-section">
        <RichTextEditor fromReporting={true} patDetails={patientDetails} currentReport={currentReport} cancel={cancel} content={content || "<div></div>"}
          onSave={handleSave} onChange={handleContentChange} />
      </div>
      {
        criticalFindingModal && (
          <Modal
            width={800}
            open={criticalFindingModal?.visible}
            onCancel={() => { setCriticalFindingModal({ visible: false, data: null }) }}
            okButtonProps={{ style: { display: 'none' } }}
          >
            <CriticalFinding closeNotificationModal={() => { setCriticalFindingModal({}) }} patDetails={criticalFindingModal?.data} />
          </Modal>
        )
      }
    </div>
  );
};

export default ReportEditor;
