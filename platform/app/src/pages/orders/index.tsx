import { Button, Input, Modal, Select, Table, Space, DatePicker } from 'antd';
import React, { useEffect, useState } from 'react';
import { SavedSearches, orderColumns } from './constants';
import ReportEditor from '../ReportEditor';
import "./orders.css";
import FloatLabel from '../../components/FloatingLabel';
import axiosInstance, { BASE_API } from '../../axios';
import { getUserDetails, makePostCall } from '../../utils/helper';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const OrdersList = ({ appDateRange }) => {
  const [orders, setOrders] = useState({ data: [], loading: true });
  const [reportEditorModal, setReportEditorModal] = useState({ visible: false, data: {} });
  const [saveFiltersModal, setSaveFiltersModal] = useState({ visible: false, data: {} });
  const [filterName, setFilterName] = useState(null);
  const [filters, setFilters] = useState({});
  const [savedFilters, setSavedFilters] = useState([]);
  const userDetails = getUserDetails();
  const today = dayjs();
  const yesterday = dayjs().subtract(1, 'days');

  // Set the default value to [yesterday, today]
  const [dateRange, setDateRange] = useState([yesterday, today]);

  useEffect(() => {
    getOrdersList();
    getSavedFilters();
  }, []);

  const onSave = (newContent, status, currentReport, { proxy_user }, callback) => {
    // console.log("onsave newContent", reportEditorModal);
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
        // console.log("resp", res);
        callback && callback();
      })
      .catch(e => {
        console.log(e);
      });
  }


  const getOrdersList = async () => {
    makePostCall('/orders', {
      role: userDetails?.user_type,
    })
      .then(res => {
        // console.log("resp", res);
        setOrders({ data: res.data?.data || [], loading: false })
      })
      .catch(e => {
        console.log(e);
        setOrders({ data: [], loading: false })
      });
  }

  const cancelReport = () => {
    // console.log("cancel report");
    setReportEditorModal({ visible: false, data: {} });
  }

  const openReport = (record) => {
    setReportEditorModal({ visible: true, data: record })
  }

  const getSavedFilters = async () => {
    makePostCall('/get-saved-filters', { user_id: getUserDetails()?.username })
      .then(res => {
        // console.log("resp", res);
        setSavedFilters(res.data?.data || []);
      })
      .catch(e => {
        console.log(e);
        setSavedFilters([]);
      });
  }

  const submitSaveFilters = () => {
    const payload = {
      filters: JSON.stringify(filters),
      uf_filter_name: filterName,
      user_id: getUserDetails()?.username
    };
    // console.log("Filters", payload);
    makePostCall('/save-my-filters', payload)
      .then(res => {
        // console.log("resp", res);
        getSavedFilters();
      })
      .catch(e => {
        console.log(e);
      });
  }

  const filterResults = () => {
    setOrders({ loading: true, data: [] });
    const payload = {};
    if (filters['pat_name']) {
      payload['name'] = filters['pat_name'];
    }

    if (filters['pat_pin']) {
      payload['yh_no'] = filters['yh_no'];
    }

    if (filters['status']) {
      payload['status'] = filters['status'];
    }

    makePostCall('/orders', { payload })
      .then(res => {
        // console.log("resp", res);
        setOrders({ data: res.data?.data || [], loading: false })
      })
      .catch(e => {
        console.log(e);
        setOrders({ data: [], loading: false })
      });
  }

  const handleFilterChange = (key, value) => {
    // console.log("handleFilterChange", key, value);
    const temp_filters = { ...filters };
    temp_filters[key] = value;
    setFilters(temp_filters);
  }

  const refreshScanStatus = () => {
    axiosInstance.get(BASE_API + '/update-status')
      .then(res => {
        // console.log("res", res);
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

  const handleFilterSelection = (selectedSavedFilter) => {
    // console.log("selectedSavedFilter", selectedSavedFilter);
    const filterString = selectedSavedFilter.uf_filter_json;
    const filterJson = JSON.parse(filterString);
    // console.log("filter json", filterJson);

    setFilters(filterJson);
  }

  return (
    <div>
      <SavedSearches savedFilters={savedFilters || []} handleFilterSelection={handleFilterSelection} />
      <div className='filters-section'>
        {/* <Space.Compact> */}
        {/* <span style={{ width: 140 }} className='!ms-3'>Patient Name</span> */}
        <div className='d-flex flex-wrap'>
          <FloatLabel label="Patient Name" value={filters['pat_name']}>
            <Input value={filters['pat_name']} width={300} onChange={(e) => handleFilterChange('pat_name', e.target.value)} />
          </FloatLabel>

          <FloatLabel label="YH No" value={filters['pat_pin']} className="ms-3">
            <Input width={300} onChange={(e) => handleFilterChange('pat_pin', e.target.value)} />
          </FloatLabel>
          <FloatLabel label="Status" value={filters['status']} className="ms-3">
            <Select style={{ width: 200 }} options={statusOptions} onChange={(val) => handleFilterChange('status', val)} />
          </FloatLabel>
          <FloatLabel label="Body Part" value={filters['body_part']} className="ms-3">
            <Select style={{ width: 200 }} options={bodyPartOptions} onChange={(val) => handleFilterChange('body_part', val)} />
          </FloatLabel>
          <FloatLabel label="Location" value={filters['site']} className="ms-3">
            <Select style={{ width: 200 }} options={siteOptions} onChange={(val) => handleFilterChange('site', val)} />
          </FloatLabel>
          <FloatLabel label="Modality" value={filters['modality']} className="ms-3">
            <Select style={{ width: 200 }} options={modalityOptions} onChange={(val) => handleFilterChange('modality', val)} />
          </FloatLabel>
          <FloatLabel label="Date" value={filters['assigned_to']} className="ms-3">
            <RangePicker size="middle" value={dateRange} onChange={(val) => {
              setDateRange([val[0], val[1]]);
            }} />
          </FloatLabel>
        </div>
        <Button className='ms-3' type='primary' onClick={filterResults}>Search</Button>
        <Button className='ms-3' type='primary' onClick={() => { setSaveFiltersModal({ visible: true }) }}>Save Filters</Button>
        <Button className='ms-3' type='dashed' danger onClick={() => { refreshScanStatus() }} >Refresh</Button>
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

        {saveFiltersModal.visible && (
          <Modal className='save-filter-modal' onCancel={() => { setSaveFiltersModal({ visible: false }) }}
            okButtonProps={{ disabled: !filterName }} onOk={submitSaveFilters}
            open={saveFiltersModal.visible}
          >
            <Input width={300} onChange={(e) => setFilterName(e.target.value)} />
          </Modal>
        )}
      </div>
    </div>
  );
}

export default OrdersList;
