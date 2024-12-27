import { Tag, Button, Upload, Tooltip } from "antd";
import React from "react";
import { FileOutlined, FileTextOutlined, PrinterOutlined, UploadOutlined } from '@ant-design/icons';
import { ConvertStringToDate, getUserDetails } from "../../utils/helper";
import moment from 'moment';

const statusColors = {
  'PENDING': 'red',
  'DRAFTED': 'orange',
  'REPORT_SUBMITTED': 'yellow',
  'SIGNEDOFF': 'green',
  'REVIEWED': 'blue',
};

export const orderColumns = ({ openReportEditor, role, addFile, viewNotes, printReport, captureReceiver }) => {
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
          <Button disabled={!rec.ris_notes?.length > 0} style={{ padding: '0 0.5rem' }} onClick={() => viewNotes(rec)}>
            <FileOutlined />
          </Button>
        )
      },
      width: 50,
    },
    {
      dataIndex: "po_pat_name",
      title: "Patient Name",
      render: (text, record) => {
        return (
          <Button
            color="blue"
            className="ms-auto"
            type="link" onClick={() => { openReportEditor(record) }}
          >
            {text}
          </Button>
        )
      },
      width: 200
    },
    {
      dataIndex: "po_diag_desc",
      title: "Study Desc.",
      width: 200
    },
    {
      dataIndex: "po_pin",
      title: "Pat. ID",
      width: 130
    },
    {
      dataIndex: "po_his_status",
      title: "HIS Status",
      width: 120
    },
    {
      dataIndex: "po_pat_age",
      title: "Pat. Age",
      width: 80,
      render: (val, record) => {
        return record.po_pat_dob ? moment(record.po_pat_dob, 'YYYYMMDD').fromNow(true) : '';
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
      width: 150
    },
    {
      dataIndex: "po_status",
      title: "Status",
      fixed: 'right',
      render: (text, record) => {
        return (
          <>
            {record.po_status === 'SIGNEDOFF' && (
              <span className="pointer md-icon" onClick={() => captureReceiver(record)}>
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
      width: 150
    }
  ].filter(itm => !itm.hidden))
};
