import { Button, Input, Modal, Select, Table, Space, DatePicker } from 'antd';
import React, { useEffect, useState } from 'react';
import { orderColumns } from './constants';
import ReportEditor from '../ReportEditor';
import "./worklist.css";
import FloatLabel from '../../components/FloatingLabel';
import axiosInstance, { BASE_API } from '../../axios';
import { getUserDetails, hisStatusOptions, makePostCall } from '../../utils/helper';
import dayjs from 'dayjs';
import FyzksInput from '../../components/FyzksInput';

const { RangePicker } = DatePicker;

const MyWorklist = ({ appDateRange }) => {
  const [orders, setOrders] = useState({ data: [], loading: true });
  const [reportEditorModal, setReportEditorModal] = useState({ visible: false, data: {} });
  const [filters, setFilters] = useState({});
  const userDetails = getUserDetails();
  // Set the default value to [yesterday, today]
  const [dateRange, setDateRange] = useState([]);

  useEffect(() => {
    getOrdersList();
  }, []);

  useEffect(() => {
    if (appDateRange && appDateRange[0] !== null && appDateRange[1] !== null) {
      console.log("appDateRange", appDateRange);
      setDateRange(appDateRange)
    } else {
      const today = dayjs();
      const yesterday = dayjs().subtract(1, 'days');
      setDateRange([yesterday, today])
    }
  }, [appDateRange])

  const onSave = (newContent, status, currentReport, { proxy_user }, callback) => {
    console.log("onsave newContent", reportEditorModal);
    makePostCall('/submit-report', {
      html: newContent,
      yh_no: reportEditorModal.data?.po_pin,
      order_no: reportEditorModal.data?.po_ord_no,
      acc_no: reportEditorModal.data?.po_acc_no,
      user_id: getUserDetails()?.username,
      proxy_user: proxy_user,
      status,
      report_id: currentReport?.pr_id,
    })
      .then(res => {
        console.log("resp", res);
        callback && callback();
      })
      .catch(e => {
        console.log(e);
      });
  }


  const getOrdersList = async () => {
    makePostCall('/my-worklist', {
      role: userDetails?.user_type,
      user_id: getUserDetails()?.username,
    })
      .then(res => {
        console.log("resp", res);
        setOrders({ data: res.data?.data || [], loading: false })
      })
      .catch(e => {
        console.log(e);
        setOrders({ data: [], loading: false })
      });
  }

  const cancelReport = () => {
    console.log("cancel report");
    setReportEditorModal({ visible: false, data: {} });
  }

  const openReport = (record) => {
    setReportEditorModal({ visible: true, data: record })
  }

  const filterResults = () => {
    setOrders({ loading: true, data: [] });
    const payload = { ...filters };
    payload['role'] = userDetails?.user_type;
    payload['user_id'] = getUserDetails()?.username;

    if (dateRange) {
      payload['from_date'] = dayjs(dateRange[0]).format('YYYYMMDD');
      payload['to_date'] = dayjs(dateRange[1]).format('YYYYMMDD');
    }

    makePostCall('/my-worklist', payload)
      .then(res => {
        console.log("resp", res);
        setOrders({ data: res.data?.data || [], loading: false })
      })
      .catch(e => {
        console.log(e);
        setOrders({ data: [], loading: false })
      });
  }

  const handleFilterChange = (key, value) => {
    console.log("handleFilterChange", key, value);
    const temp_filters = { ...filters };
    temp_filters[key] = value;
    setFilters(temp_filters);
  }

  const refreshScanStatus = () => {
    axiosInstance.get(BASE_API + '/update-status')
      .then(res => {
        console.log("res", res);
        filterResults();
      })
      .catch(e => {
        console.log(e);
      })
  }

  const statusOptions = userDetails?.user_type === 'doc' ? [
    { label: 'REVIEWED', value: 'REVIEWED' },
    { label: 'SIGNEDOFF', value: 'SIGNEDOFF' },
  ] :
    [
      { label: 'PENDING', value: 'PENDING' },
      { label: 'SCANNED', value: 'SCANNED' },
      { label: 'DRAFTED', value: 'DRAFTED' },
      { label: 'SIGNEDOFF', value: 'SIGNEDOFF' },
    ]

  const bodyPartOptions = [
    { label: 'Head', value: 'HEAD' },
    { label: 'Brain', value: 'BRAIN' },
    { label: 'Abdomen', value: 'ABDOMEN' },
    { label: 'Chest', value: 'CHEST' },
    { label: 'Leg', value: 'LEG' },
    { label: 'Hand', value: 'HAND' },
  ];

  const siteOptions = [
    { label: 'Somajiguda', value: 'SOMAJIGUDA' },
    { label: 'HiTech City', value: 'HITEC CITY' },
    { label: 'Secunderabad', value: 'SECUNDERABAD' },
  ];

  const modalityOptions = [
    { label: 'CT', value: 'CT' },
    { label: 'Ultra Sound', value: 'US' },
    { label: 'MRI', value: 'MRI' },
  ];

  console.log("defaultDateRange", dateRange);

  return (
    <div>
      <div className='filters-section'>
        {/* <Space.Compact> */}
        {/* <span style={{ width: 140 }} className='!ms-3'>Patient Name</span> */}
        <div className='d-flex flex-wrap'>
          <FloatLabel label="Patient Name" value={filters['pat_name']} className="me-3">
            <FyzksInput value={filters['pat_name']} onChange={(e) => handleFilterChange('pat_name', e.target.value)} />
          </FloatLabel>
          <FloatLabel label="YH No" value={filters['po_pin']} className="me-3">
            <FyzksInput width={200} onChange={(e) => handleFilterChange('po_pin', e.target.value)} />
          </FloatLabel>
          <FloatLabel label="Acc. No" value={filters['po_acc_no']} className="me-3">
            <FyzksInput width={200} onChange={(e) => handleFilterChange('po_acc_no', e.target.value)} />
          </FloatLabel>
          <FloatLabel label="Ref Doc." value={filters['po_ref_doc']} className="me-3">
            <Select style={{ width: 200 }} options={statusOptions} onChange={(val) => handleFilterChange('po_ref_doc', val)} />
          </FloatLabel>
          <FloatLabel label="Body Part / Study Desc" value={filters['po_body_part']} className="me-3">
            <FyzksInput width={200} onChange={(e) => handleFilterChange('po_body_part', e.target.value)} />
          </FloatLabel>
          <FloatLabel label="HIS Status" value={filters['po_his_status']} className="me-3">
            <Select style={{ width: 200 }} options={hisStatusOptions} onChange={(val) => handleFilterChange('po_his_status', val)} />
          </FloatLabel>

          <FloatLabel label="Order No" value={filters['po_ord_no']} className="me-3">
            <FyzksInput width={200} onChange={(e) => handleFilterChange('po_ord_no', e.target.value)} />
          </FloatLabel>
          <FloatLabel label="Status" value={filters['po_status']} className="me-3">
            <Select style={{ width: 200 }} options={statusOptions} onChange={(val) => handleFilterChange('po_status', val)} />
          </FloatLabel>
          <FloatLabel label="Site" value={filters['po_site']} className="me-3">
            <Select style={{ width: 200 }} options={siteOptions} onChange={(val) => handleFilterChange('po_site', val)} />
          </FloatLabel>
          <FloatLabel label="Modality" value={filters['modality']} className="me-3">
            <Select style={{ width: 200 }} options={modalityOptions} onChange={(val) => handleFilterChange('modality', val)} />
          </FloatLabel>
          <FloatLabel label="Reported By" value={filters['po_reported_by']} className="me-3">
            <Select style={{ width: 200 }} options={modalityOptions} onChange={(val) => handleFilterChange('po_reported_by', val)} />
          </FloatLabel>
          <FloatLabel label="Assigned to" value={filters['po_assigned_to']} className="me-3">
            <Select style={{ width: 200 }} options={modalityOptions} onChange={(val) => handleFilterChange('po_assigned_to', val)} />
          </FloatLabel>
          <FloatLabel label="Study Date" value={filters['study_date']} className="me-3">
            <RangePicker size="middle" value={dateRange} onChange={(val) => {
              console.log("date picker change", val);
              setDateRange([val[0], val[1]]);
            }} />
          </FloatLabel>
        </div>
        <Button className='ms-4' type='primary' onClick={filterResults}>Search Worklist</Button>
        <Button className='ms-auto' type='dashed' danger onClick={() => { refreshScanStatus() }} >Refresh</Button>
      </div>
      <div className='orders-list'>
        <Table loading={orders.loading} columns={orderColumns(openReport)} dataSource={orders.data || []} onRow={(record, rowIndex) => {
          return {
          }
        }} />
        {reportEditorModal.visible && (
          <Modal className='report-modal' width={'100%'} onCancel={() => { setReportEditorModal({ visible: false }) }} footer={null} open={reportEditorModal.visible}>
            <ReportEditor cancel={cancelReport} onSave={onSave} patientDetails={reportEditorModal.data} />
          </Modal>
        )}
      </div>
    </div>
  );
}

export default MyWorklist;
