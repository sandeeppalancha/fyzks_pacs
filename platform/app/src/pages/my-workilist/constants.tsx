import { Button, Tag } from "antd";
import React from "react";
import moment from "moment";
import { FileTextOutlined } from '@ant-design/icons';
import { ConvertStringToDate } from "../../utils/helper";

const statusColors = {
  'PENDING': 'red',
  'DRAFTED': 'orange',
  'REPORT_SUBMITTED': 'yellow',
  'SIGNEDOFF': 'green',
  'REVIEWED': 'blue',
};

export const orderColumns = (openReportEditor) => ([
  {
    dataIndex: "po_pat_name",
    title: "Patient Name",
    render: (text, record) => {
      return (
        <Button
          color="blue"
          className="ms-auto"
          type="link" onClick={() => { window.open(`/viewer?StudyInstanceUIDs=${record?.po_study_uid}`, '_blank') }}
        >
          {text}
        </Button>
      )
    }
  },
  {
    dataIndex: "po_pin",
    title: "Pat. ID",
  },
  {
    dataIndex: "po_his_status",
    title: "HIS Status",
  },
  {
    dataIndex: "po_pat_age",
    title: "Pat. Age",
  },
  {
    dataIndex: "po_pat_sex",
    title: "Pat. Sex",
  },

  {
    dataIndex: "po_body_part",
    title: "Body Part",
  },
  {
    dataIndex: "po_site",
    title: "Site",
  },
  {
    dataIndex: "modality",
    title: "Modality",
  },
  {
    dataIndex: "po_ord_no",
    title: "Order No",
  },
  {
    dataIndex: "po_acc_no",
    title: "Acc. No",
  },
  {
    dataIndex: "po_ref_doc",
    title: "Ref Doc",
  },
  {
    dataIndex: "po_scan_date",
    title: "Scan Dt.",
    render: (val, record) => {
      return (
        <span>{moment(ConvertStringToDate(record?.po_study_dt, record?.po_study_tm)).format("DD-MM-YYYY HH:mm:ss")}</span>
      )
    }
  },

  {
    dataIndex: "po_received_date",
    title: "Received Dt.",
  },
  {
    dataIndex: "po_assigned_to",
    title: "Assigned To",
  },
  {
    dataIndex: "po_status",
    title: "Status",
    render: (text, record) => {
      return (
        <>
          <Tag color={statusColors[text]}>{text.replaceAll('_', ' ')}</Tag>
          {record.po_status !== 'PENDING' && (
            <span className="pointer md-icon" onClick={() => openReportEditor(record)}>
              <FileTextOutlined />
            </span>
          )}
        </>
      )
    }
  }
]);
