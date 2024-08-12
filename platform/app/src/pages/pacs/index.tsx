import { Button, Input, Modal, Select, Table, Space, DatePicker } from 'antd';
import React, { useEffect, useState } from 'react';
import { orderColumns } from './constants';
import ReportEditor from '../ReportEditor';
import "./pacs.css";
import FloatLabel from '../../components/FloatingLabel';
import axiosInstance, { BASE_API } from '../../axios';
import { getUserDetails, hisStatusOptions, makePostCall } from '../../utils/helper';
import { SavedSearches } from '../orders/constants';

import dayjs from 'dayjs';
import FyzksInput from '../../components/FyzksInput';

const { RangePicker } = DatePicker;

const PacsList = ({ appDateRange }) => {
  const [orders, setOrders] = useState({ data: [], loading: true });
  const [reportEditorModal, setReportEditorModal] = useState({ visible: false, data: {} });
  const [saveFiltersModal, setSaveFiltersModal] = useState({ visible: false, data: {} });
  const [assignModal, setAssignModal] = useState({ visible: false, data: {} });
  const [selectedUsersToAssign, setSelectedUsersToAssign] = useState([]);
  const [userList, setUserList] = useState([]);

  const [filterName, setFilterName] = useState(null);
  const [filters, setFilters] = useState({});
  const [savedFilters, setSavedFilters] = useState([]);
  const userDetails = getUserDetails();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const today = dayjs();
  const yesterday = dayjs().subtract(1, 'days');

  // Set the default value to [yesterday, today]
  const [dateRange, setDateRange] = useState([yesterday, today]);

  const isHOD = userDetails?.user_type === 'hod';

  useEffect(() => {
    getPacsList();
    getSavedFilters();
    getUsersList();
  }, []);

  const getUsersList = () => {
    makePostCall('/user-list', {}).then(res => {
      setUserList(res.data?.data || []);
    })
      .catch(e => {
        console.log(e);
        setUserList([]);
      })
  }

  const onSave = (newContent, status, currentReport, { proxy_user }, callback) => {
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
        callback && callback();
      })
      .catch(e => {
        console.log(e);
      });
  }


  const getPacsList = async () => {
    makePostCall('/pacs-list', {
      role: userDetails?.user_type,
    })
      .then(res => {
        setOrders({ data: res.data?.data || [], loading: false })
      })
      .catch(e => {
        console.log(e);
        setOrders({ data: [], loading: false })
      });
  }

  const cancelReport = () => {
    setReportEditorModal({ visible: false, data: {} });
  }

  const openReport = (record) => {
    setReportEditorModal({ visible: true, data: record })
  }

  const getSavedFilters = async () => {
    makePostCall('/get-saved-filters', { user_id: getUserDetails()?.username })
      .then(res => {
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
    makePostCall('/save-my-filters', payload)
      .then(res => {
        getSavedFilters();
      })
      .catch(e => {
        console.log(e);
      });
  }

  const filterResults = () => {
    setOrders({ loading: true, data: [] });
    const payload = { ...filters };

    if (dateRange) {
      payload['from_date'] = dayjs(dateRange[0]).format('YYYYMMDD');
      payload['to_date'] = dayjs(dateRange[1]).format('YYYYMMDD');
    }

    makePostCall('/pacs-list', payload)
      .then(res => {
        setOrders({ data: res.data?.data || [], loading: false })
      })
      .catch(e => {
        console.log(e);
        setOrders({ data: [], loading: false })
      });
  }

  const handleFilterChange = (key, value) => {
    const temp_filters = { ...filters };
    temp_filters[key] = value;
    setFilters(temp_filters);
  }

  const refreshScanStatus = () => {
    axiosInstance.get(BASE_API + '/update-status')
      .then(res => {
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
    const filterString = selectedSavedFilter.uf_filter_json;
    const filterJson = JSON.parse(filterString);

    setFilters(filterJson);
  }

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: (record: DataType) => ({
      disabled: !isHOD, // Column configuration not to be checked
    }),
  };

  const assignToUser = () => {
    setAssignModal({ visible: false, data: {} });
    // send request to assign users to the selected report
    makePostCall('/assign-to-user', { acc_nos: selectedRowKeys, assigned_to: selectedUsersToAssign })
      .then(res => {
        // refresh the report data
        filterResults();
      })
      .catch(e => {
        console.log(e);
      });
  }

  return (
    <div>
      <SavedSearches savedFilters={savedFilters || []} handleFilterSelection={handleFilterSelection} />
      <div className='filters-section'>
        {/* <Space.Compact> */}
        {/* <span style={{ width: 140 }} className='!ms-3'>Patient Name</span> */}
        <div className='d-flex flex-wrap'>
          <FloatLabel label="Patient Name" value={filters['pat_name']} className="me-3">
            <FyzksInput value={filters['pat_name']} onChange={(e) => handleFilterChange('pat_name', e.target.value)} />
          </FloatLabel>

          <FloatLabel label="YH No" value={filters['pat_pin']} className="me-3">
            <FyzksInput width={200} onChange={(e) => handleFilterChange('pat_pin', e.target.value)} />
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
          <FloatLabel label="Status" value={filters['status']} className="me-3">
            <Select style={{ width: 200 }} options={statusOptions} onChange={(val) => handleFilterChange('status', val)} />
          </FloatLabel>
          <FloatLabel label="Site" value={filters['site']} className="me-3">
            <Select style={{ width: 200 }} options={siteOptions} onChange={(val) => handleFilterChange('site', val)} />
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
              setDateRange([val[0], val[1]]);
            }} />
          </FloatLabel>
        </div>
        <Button className='ms-3' type='primary' onClick={filterResults}>Search</Button>
        <Button className='ms-3' type='primary' onClick={() => { setSaveFiltersModal({ visible: true }) }}>Save Filters</Button>
        <Button className='ms-3' type='secondary' onClick={() => { setAssignModal({ visible: true }) }}>Assign</Button>
        <Button className='ms-auto' type='dashed' danger onClick={() => { refreshScanStatus() }} >Refresh</Button>
      </div>
      <div className='orders-list'>
        <Table
          rowSelection={rowSelection}
          loading={orders.loading}
          columns={orderColumns(openReport)}
          rowKey={(rec) => rec.po_acc_no}
          dataSource={orders.data || []}
          onRow={(record, rowIndex) => {
            return {
            }
          }}
        />
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

        {assignModal.visible && (
          <Modal className='save-filter-modal' onCancel={() => { setAssignModal({ visible: false }) }}
            okButtonProps={{ disabled: !selectedUsersToAssign }} onOk={assignToUser}
            open={assignModal.visible}
          >
            Select User
            <div>
              <Select
                showSearch
                style={{ width: 200 }}
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={userList?.map((user) => ({ label: user.user_fullname, value: user.username }))}
                onChange={(val) => { setSelectedUsersToAssign(val) }}
              />
            </div>
          </Modal>
        )}
      </div>
    </div>
  )
}

export default PacsList;
