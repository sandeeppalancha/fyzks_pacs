import { Button, Input, Modal, Select, Table, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { orderColumns } from './constants';
import ReportEditor from '../ReportEditor';
import "./orders.css";
import FloatLabel from '../../components/FloatingLabel';
import axiosInstance, { BASE_API } from '../../axios';
import { makePostCall } from '../../utils/helper';

const OrdersList = () => {
  const [orders, setOrders] = useState({ data: [], loading: true });
  const [reportEditorModal, setReportEditorModal] = useState({ visible: false, data: {} });
  const [filters, setFilters] = useState({});

  useEffect(() => {
    getOrdersList();
  }, []);

  const onSave = (newContent) => {
    console.log("onsave newContent", reportEditorModal);
    makePostCall('/submit-report', {
      html: newContent,
      yh_no: reportEditorModal.data?.po_pin,
      order_no: reportEditorModal.data?.po_ord_no,
      acc_no: reportEditorModal.data?.po_acc_no,
      user_id: "test_user"
    })
      .then(res => {
        console.log("resp", res);
      })
      .catch(e => {
        console.log(e);
      });
  }


  const getOrdersList = async () => {
    makePostCall('/orders', {
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
    const payload = {};
    if (filters['pat_name']) {
      payload['name'] = filters['pat_name'];
    }

    if (filters['pat_pin']) {
      payload['yh_no'] = filters['pat_pin'];
    }

    if (filters['status']) {
      payload['status'] = filters['status'];
    }

    makePostCall('/orders', { payload })
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

  return (
    <div>
      <div className='filters-section'>
        {/* <Space.Compact> */}
        {/* <span style={{ width: 140 }} className='!ms-3'>Patient Name</span> */}
        <FloatLabel label="Patient Name" value={filters['pat_name']}>
          <Input width={300} onChange={(e) => handleFilterChange('pat_name', e.target.value)} />
        </FloatLabel>

        <FloatLabel label="YH No" value={filters['pat_pin']} className="ms-3">
          <Input width={300} onChange={(e) => handleFilterChange('pat_pin', e.target.value)} />
        </FloatLabel>
        <FloatLabel label="Status" value={filters['status']} className="ms-3">
          <Select style={{ width: 300 }} options={[
            { label: 'PENDING', value: 'PENDING' },
            { label: 'SCANNED', value: 'SCANNED' },
            { label: 'REPORT DRAFTED', value: 'REPORT_DRAFTED' },
            { label: 'REPORT SIGNEDOFF', value: 'REPORT_SIGNEDOFF' },
          ]} onChange={(val) => handleFilterChange('status', val)} />
        </FloatLabel>
        <Button className='ms-3' type='primary' onClick={filterResults}>Search</Button>
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

export default OrdersList;
