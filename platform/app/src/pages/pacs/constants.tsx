import { Tag, Button, Upload, Tooltip, Popconfirm } from "antd";
import React from "react";
import { CheckSquareOutlined, CloseSquareOutlined, EyeOutlined, FileOutlined, FileTextOutlined, PrinterOutlined, UploadOutlined } from '@ant-design/icons';
import { calculateExactAge, ConvertStringToDate, getUserDetails } from "../../utils/helper";
import moment from 'moment';
import classNames from "classnames";

const statusColors = {
  'PENDING': 'red',
  'DRAFTED': 'orange',
  'REPORT_SUBMITTED': 'yellow',
  'SIGNEDOFF': 'green',
  'REVIEWED': 'blue',
};

export const orderColumns = ({ openViewer, openReportEditor, role, addFile, viewNotes, printReport, assignToSelfTechnician, toggleReporting, toggleConfirmation, toggleFeatures }) => {
  const userDetails = getUserDetails();

  return ([
    {
      title: '', // upload
      render: (_, rec) => {
        return (
          <div>
            <Tooltip title="Upload Notes or Files">
              <Button onClick={() => addFile(rec)} icon={<UploadOutlined />}></Button>
            </Tooltip>
          </div>
        )
      },
      width: 50,
      hidden: userDetails?.user_type !== 'technician'
    },
    {
      title: '',
      render: (_, rec) => {
        return (
          <Tooltip title={rec.ris_notes?.length > 0 ? 'View Notes' : 'No Notes available'}>
            <Button disabled={!rec.ris_notes?.length > 0} style={{ padding: '0 0.5rem' }} onClick={() => viewNotes(rec)}>
              <FileOutlined />
            </Button>
          </Tooltip>
        )
      },
      width: 50,
    },
    {
      title: '',
      dataIndex: 'po_reporting_status',
      width: 50,
    },
    {
      dataIndex: "po_pat_name",
      title: "Patient Name",
      render: (text, record) => {
        return (
          <Tooltip title={text}>
            <Button
              color="blue"
              className="ms-auto d-flex align-items-center"
              type="link" onClick={() => { openReportEditor(record); openViewer(record) }}
            >
              <Tooltip title="Open Only Viewer">
                <EyeOutlined color="orange" onClick={(e) => { e.preventDefault(); e.stopPropagation(); openViewer(record); }} />
              </Tooltip>
              {text}
            </Button>
          </Tooltip>
        )
      },
      width: 200
    },
    {
      dataIndex: "po_diag_desc",
      title: "Study Desc.",
      width: 200,
      render: (txt, rec) => {
        return (
          <Tooltip
            title={rec.po_emergency === 'Y' ? 'Emergency' : ''}
          >
            <span>
              {txt}
            </span>
          </Tooltip>
        )
      },
      onCell: (record) => ({
        className: record.po_emergency === 'Y' ? 'emergency' : ''
      }),
    },
    {
      dataIndex: "po_pin",
      title: "Pat. ID",
      width: 130
    },
    {
      dataIndex: "po_ord_no",
      title: "Order No",
      width: 100
    },
    {
      dataIndex: "po_acc_no",
      title: "Acc. No",
      width: 100
    },
    {
      dataIndex: "po_his_status",
      title: "HIS Status",
      width: 120,
      render: (text, rec, ind) => {
        const currentlyConfirmed = rec.po_his_status === 'CONFIRMED'
        return (
          <span>
            {text}
            {
              userDetails?.user_type === 'technician' ? (
                <Popconfirm
                  title={!currentlyConfirmed ? "Mark Confirmed?" : 'Mark Unconfirm?'}
                  onConfirm={() => {
                    // toggleConfirmation(rec, ind);
                    toggleFeatures(rec, ind, 'confirmation');
                  }}
                  onCancel={() => {
                  }}
                  okText="Yes"
                  cancelText="No"
                >
                  <Tooltip
                    title={!currentlyConfirmed ? 'Mark as Confirmed' : 'Mark as Unconfirmed'}
                    placement='bottom'
                  >
                    <span className="pointer ms-1">
                      {!currentlyConfirmed ? <CheckSquareOutlined style={{ color: 'green' }} /> : <CloseSquareOutlined style={{ color: 'red' }} />}
                    </span>
                  </Tooltip>
                </Popconfirm>
              ) : null
            }

          </span>
        )
      }
    },
    {
      dataIndex: "po_pat_age",
      title: "Pat. Age",
      width: 80,
      render: (val, record) => {
        return calculateExactAge(record.po_pat_dob) //record.po_pat_dob ? moment(record.po_pat_dob, 'YYYYMMDD').fromNow(true) : '';
      }
    },
    {
      dataIndex: "po_pat_sex",
      title: "Pat. Sex",
      width: 80
    },

    {
      dataIndex: "po_body_part",
      title: "Body Part",
      width: 100
    },
    {
      dataIndex: "po_site",
      title: "Site",
      width: 150
    },
    {
      dataIndex: "modality",
      title: "Modality",
      width: 90
    },

    {
      dataIndex: "po_ref_doc",
      title: "Ref Doc",
      width: 120
    },
    {
      dataIndex: "po_scan_date",
      title: "Scan Dt.",
      render: (val, record) => {
        return (
          <span>{moment(ConvertStringToDate(record?.po_study_dt, record?.po_study_tm)).format("DD-MM-YYYY HH:mm:ss")}</span>
        )
      },
      width: 150
    },

    {
      dataIndex: "po_received_date",
      title: "Received Dt.",
      width: 150
    },
    {
      dataIndex: "po_assigned_to",
      title: "Assigned To",
      width: 150,
      hidden: userDetails?.user_type === 'technician'
    },
    {
      dataIndex: "po_status",
      title: "Status",
      fixed: 'right',
      render: (text, record) => {
        return (
          <>
            {record.po_status === 'SIGNEDOFF' && (
              <span className="pointer md-icon" onClick={() => printReport(record)}>
                <PrinterOutlined />
              </span>
            )}
            <Tag color={statusColors[text]}>{text.replaceAll('_', ' ')}</Tag>
            {record.po_status !== 'PENDING' && (
              <span className="pointer md-icon" onClick={() => openReportEditor(record)}>
                <FileTextOutlined />
              </span>
            )}
          </>
        )
      },
      width: 150,
      hidden: userDetails?.user_type === 'technician'
    },
    {
      dataIndex: "po_signed_by",
      title: "Signed by",
      fixed: 'right',
      render: (text, record) => {
        return (
          <>
            {record?.ordersUser?.user_fullname}
          </>
        )
      },
      width: 150,
      hidden: userDetails?.user_type === 'technician'
    },
    {
      dataIndex: "po_status",
      title: "Assigned to",
      fixed: 'right',
      render: (text, record, ind) => {
        return (
          <>
            {
              record.po_assigned_technician ? (<span>{record?.po_assigned_technician}</span>) :
                (<Popconfirm
                  title={"Assign to yourself?"}
                  onConfirm={() => {
                    assignToSelfTechnician(record, ind);
                  }}
                  onCancel={() => {
                  }}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button>
                    Self Assgin
                  </Button>
                </Popconfirm>
                )
            }
          </>
        )
      },
      width: 150,
      hidden: userDetails?.user_type !== 'technician'
    },
    {
      dataIndex: "po_status",
      title: "Actions",
      fixed: 'right',
      render: (text, rec, ind) => {
        const currentlyBlocked = rec.po_block_reporting === 'Y';
        const currentlyEmergency = rec.po_emergency === 'Y';
        return (
          <>
            <Popconfirm
              title={currentlyBlocked ? "Enable Reporting?" : 'Disable Reporting'}
              onConfirm={() => {
                // toggleReporting(rec, ind);
                toggleFeatures(rec, ind, 'reporting');
              }}
              onCancel={() => {
              }}
              okText="Yes"
              cancelText="No"
            >
              {/* <Tooltip
                title={currentlyBlocked ? 'Enable Reporting' : 'Disable Reporting'}
                placement='bottom'
              > */}
              <span className="pointer ms-1">
                {/* {rec.po_block_reporting === 'Y' ? <CheckSquareOutlined style={{ color: 'green' }} /> : <CloseSquareOutlined style={{ color: 'red' }} />} */}
                {currentlyBlocked ? <Button>Enable Reporting</Button> : <Button>Disable Reporting</Button>}
              </span>
              {/* </Tooltip> */}
            </Popconfirm>

            <Popconfirm
              title={currentlyEmergency ? "Remove Emergency?" : 'Mark Emergency'}
              onConfirm={() => {
                toggleFeatures(rec, ind, 'emergency');
              }}
              onCancel={() => {
              }}
              okText="Yes"
              cancelText="No"
            >
              {/* <Tooltip
                title={currentlyEmergency ? 'Remove as Emergency' : 'Mark Emergency'}
                placement='bottom'
              > */}
              <span className="pointer ms-1">
                {/* {rec.po_block_reporting === 'Y' ? <CheckSquareOutlined style={{ color: 'green' }} /> : <CloseSquareOutlined style={{ color: 'red' }} />} */}
                {currentlyEmergency ? <Button>Mark Emergency</Button> : <Button>Not Emergency</Button>}
              </span>
              {/* </Tooltip> */}
            </Popconfirm>
          </>
        )
      },
      width: 300,
      hidden: userDetails?.user_type !== 'technician'
    }
  ].filter(itm => !itm.hidden))
};
