import { Button, Input, Modal, Select, Table, Space, DatePicker, message, Tabs, Upload, Row, Col } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { orderColumns } from './constants';
import ReportEditor from '../ReportEditor';
import "./pacs.css";
import FloatLabel from '../../components/FloatingLabel';
import axiosInstance, { BASE_API, BASE_URL } from '../../axios';
import { getAccessToken, getUserDetails, hisStatusOptions, makePostCall } from '../../utils/helper';
import { SavedSearches } from '../orders/constants';

import dayjs from 'dayjs';
import FyzksInput from '../../components/FyzksInput';
import { debounce } from 'lodash';
import TabPane from 'antd/es/tabs/TabPane';
import TextArea from 'antd/es/input/TextArea';
import ViewNotes from '../ManageNodes/ViewNotes';


const { RangePicker } = DatePicker;

const PacsList = ({ appDateRange }) => {
  const [orders, setOrders] = useState({ data: [], loading: true });
  const [reportEditorModal, setReportEditorModal] = useState({ visible: false, data: {} });
  const [saveFiltersModal, setSaveFiltersModal] = useState({ visible: false, data: {} });
  const [assignModal, setAssignModal] = useState({ visible: false, data: {} });
  const [selectedUsersToAssign, setSelectedUsersToAssign] = useState([]);
  const [userList, setUserList] = useState([]);
  const [addFileModal, setAddFileModal] = useState({ visible: false, notes: null, modalType: 'upload', file: null, fileType: null });
  const [viewNotesModal, setViewNotesModal] = useState({ visible: false, details: null });
  const [selectedNote, setSelectedNote] = useState({});

  const [filterName, setFilterName] = useState(null);
  const [filters, setFilters] = useState({});
  const [savedFilters, setSavedFilters] = useState([]);
  const userDetails = getUserDetails();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [refreshDisabled, setRefreshDisabled] = useState(false)

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

  useEffect(() => {

  }, [dateRange])

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

  const openReport = async (record) => {
    if (!record?.po_reported_by || record?.po_reported_by === getUserDetails().username) {
      setReportEditorModal({ visible: true, data: record });
      window.open(`/viewer?StudyInstanceUIDs=${record?.po_study_uid}`, '_blank')
    } else {
      message.error(`Study is taken by ${record.po_reported_by}`)
    }
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
    setSaveFiltersModal({ saveLoading: true })
    const payload = {
      filters: JSON.stringify(filters),
      uf_filter_name: filterName,
      user_id: getUserDetails()?.username
    };
    makePostCall('/save-my-filters', payload)
      .then(res => {
        getSavedFilters();
        setSaveFiltersModal({ visible: false })
      })
      .catch(e => {
        console.log(e);
        message.error(e);
      });
  }

  const filterResults = () => {
    setOrders({ loading: true, data: [] });
    const payload = { ...filters };

    if (dateRange) {
      payload['from_date'] = dayjs(dateRange[0]).format('YYYYMMDD');
      payload['to_date'] = dayjs(dateRange[1]).format('YYYYMMDD');
      payload['po_study_date'] = dateRange;
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
    setRefreshDisabled(true); // Disable the button
    setTimeout(() => {
      setRefreshDisabled(false); // Re-enable the button after 5 seconds
    }, 20000);

    axiosInstance.get(BASE_API + '/update-status')
      .then(res => {
        filterResults();
      })
      .catch(e => {
        console.log(e);
      })
  }

  const debouncedRefresh = useCallback(
    debounce(() => {
      console.log('Debounced value:');
      refreshScanStatus();
    }, 200),
    []
  );

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
    { label: 'DX', value: 'DX' },
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

  const addFile = (rec) => {
    setAddFileModal({ visible: true, data: rec, modalType: 'upload' });
  }

  const uploadRisNotes = async () => {
    const { data, modalType, fileType, notes, file, isNotes } = addFileModal;

    const { po_acc_no, po_ord_no, po_pin } = data;
    const formData = new FormData();


    formData.append('acc_no', po_acc_no);
    formData.append('ord_no', po_ord_no);
    formData.append('pin', po_pin);

    let headers = {
      'Content-Type': 'multipart/form-data',
    };
    if (isNotes) {
      formData.append('type', 'notes');
      formData.append('notes', notes);
    } else {
      formData.append('file_type', fileType);
      formData.append('file', file);
    }

    const url = isNotes ? '/upload-notes' : '/upload-file';

    try {
      makePostCall(url, formData, {
        headers,
      }).then((res) => {
        console.log("response", res);
        setAddFileModal(null);
      }).catch((error) => {
        message.error('Failed to upload file');
      })
    } catch (error) {
      message.error('Failed to upload file');
    }
  };

  const printReport = (rec) => {
    console.log("print report", rec);
    const { po_acc_no, po_ord_no, po_pin } = rec;
    makePostCall('/print-acc-report', {
      acc_no: po_acc_no,
      pin: po_pin,
      ord_no: po_ord_no, //.replaceAll(' ', '&nbsp'),
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

  const viewNotes = (rec) => {
    console.log("view notes", rec);
    const firstNote = rec.ris_notes[0] || {};
    setSelectedNote(firstNote)
    setViewNotesModal({ visible: true, details: rec })
  }

  const handleNoteSelection = (note, record) => {
    setSelectedNote(note);
  }

  const reportedByOptions = useMemo(() => {
    return userList?.map((user) => ({ label: user.user_fullname, value: user.username }))
  }, [userList])

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

          <FloatLabel label="YH No" value={filters['po_pin']} className="me-3">
            <FyzksInput width={200} onChange={(e) => handleFilterChange('po_pin', e.target.value)} />
          </FloatLabel>
          <FloatLabel label="Acc. No" value={filters['po_acc_no']} className="me-3">
            <FyzksInput width={200} onChange={(e) => handleFilterChange('po_acc_no', e.target.value)} />
          </FloatLabel>
          <FloatLabel label="Ref Doc." value={filters['po_ref_doc']} className="me-3">
            <Select allowClear style={{ width: 200 }} options={statusOptions} onChange={(val) => handleFilterChange('po_ref_doc', val)} />
          </FloatLabel>
          <FloatLabel label="Body Part / Study Desc" value={filters['po_body_part']} className="me-3">
            <FyzksInput width={200} onChange={(e) => handleFilterChange('po_body_part', e.target.value)} />
          </FloatLabel>
          <FloatLabel label="HIS Status" value={filters['po_his_status']} className="me-3">
            <Select allowClear style={{ width: 200 }} options={hisStatusOptions} onChange={(val) => handleFilterChange('po_his_status', val)} />
          </FloatLabel>

          <FloatLabel label="Order No" value={filters['po_ord_no']} className="me-3">
            <FyzksInput width={200} onChange={(e) => handleFilterChange('po_ord_no', e.target.value)} />
          </FloatLabel>
          <FloatLabel label="Status" value={filters['status']} className="me-3">
            <Select allowClear style={{ width: 200 }} options={statusOptions} onChange={(val) => handleFilterChange('status', val)} />
          </FloatLabel>
          <FloatLabel label="Site" value={filters['po_site']} className="me-3">
            <Select value={filters['po_site']} allowClear style={{ width: 200 }} options={siteOptions} onChange={(val) => handleFilterChange('site', val)} />
          </FloatLabel>
          <FloatLabel label="Modality" value={filters['modality']} className="me-3">
            <Select allowClear value={filters['modality']} style={{ width: 200 }} options={modalityOptions} onChange={(val) => handleFilterChange('modality', val)} />
          </FloatLabel>
          <FloatLabel label="Reported By" value={filters['po_reported_by']} className="me-3">
            <Select
              showSearch
              value={filters['po_reported_by']}
              style={{ width: 200 }}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={reportedByOptions}
              onChange={(val) => handleFilterChange('po_reported_by', val)}
            />
          </FloatLabel>
          <FloatLabel label="Assigned to" value={filters['po_assigned_to']} className="me-3">
            <Select
              showSearch
              style={{ width: 200 }}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={reportedByOptions}
              onChange={(val) => handleFilterChange('po_assigned_to', val)}
            />
          </FloatLabel>
          <FloatLabel label="Study Date" value={filters['study_date']} className="me-3">
            <RangePicker size="middle" value={dateRange} onChange={(val) => {
              if (val) {
                setDateRange([val[0], val[1]]);
              } else {
                setDateRange(null);
              }
            }} />
          </FloatLabel>
        </div>
        <Button className='ms-3' type='primary' onClick={filterResults}>Search</Button>
        <Button className='ms-3' type='primary' onClick={() => { setSaveFiltersModal({ visible: true }) }}>Save Filters</Button>
        {isHOD && (
          <Button className='ms-3' type='secondary' onClick={() => { setAssignModal({ visible: true }) }}>Assign</Button>
        )}
        <Button disabled={refreshDisabled} className='!ms-auto ms-3' type='dashed' danger onClick={() => { debouncedRefresh() }} >Refresh</Button>
      </div>
      <div className='orders-list'>
        <Table
          tableLayout="fixed"
          rowSelection={rowSelection}
          loading={orders.loading}
          columns={orderColumns({ openReportEditor: openReport, role: userDetails?.user_type, addFile, viewNotes, printReport })}
          rowKey={(rec) => rec.po_acc_no}
          dataSource={orders.data || []}
          onRow={(record, rowIndex) => {
            return {
            }
          }}
          style={{ width: '100%' }}
          scroll={{
            x: 1200
          }}
        />
        {reportEditorModal.visible && (
          <Modal className='report-modal' width={'100%'} onCancel={() => { setReportEditorModal({ visible: false }) }} footer={null} open={reportEditorModal.visible}>
            <ReportEditor cancel={cancelReport} onSave={onSave} patientDetails={reportEditorModal.data} />
          </Modal>
        )}

        {saveFiltersModal.visible && (
          <Modal className='save-filter-modal' onCancel={() => { setSaveFiltersModal({ visible: false }) }}
            okButtonProps={{ disabled: !filterName || saveFiltersModal.saveLoading }} onOk={submitSaveFilters}
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

        {
          addFileModal && addFileModal?.visible && (
            <Modal
              open={addFileModal?.visible}
              onOk={() => { uploadRisNotes() }}
              onCancel={() => { setAddFileModal({}) }}
              okButtonProps={{
                disabled: (addFileModal?.modalType === 'upload' && !addFileModal?.file) || (addFileModal?.modalType === 'notes' && !addFileModal?.notes),
              }}
            >
              <Tabs
                activeKey={addFileModal.modalType}
                onTabClick={(activeKey) => {
                  if (addFileModal.modalType !== activeKey) {
                    setAddFileModal({ ...addFileModal, modalType: activeKey, isNotes: activeKey === 'notes' });
                  }
                }}
              >
                <TabPane key='notes' tab="Notes">
                  <span>Enter Notes / Remarks</span>
                  <TextArea onChange={(e) => {
                    setAddFileModal({ ...addFileModal, notes: e.target.value })
                  }} />
                </TabPane>
                <TabPane key='upload' tab="Upload">
                  <Select
                    placeholder="File Type"
                    options={[
                      { label: 'Prescription', value: 'prescription' },
                      { label: 'Consent', value: 'consent' },
                    ]}
                    style={{ width: 200 }}
                    onSelect={(val) => { setAddFileModal({ ...addFileModal, fileType: val }) }}
                  />
                  <Upload customRequest={({ file }) => { setAddFileModal({ ...addFileModal, file }) }} accept="application/pdf" multiple={false} disabled={!addFileModal.fileType} >
                    <Button disabled={!addFileModal?.fileType}>Select File</Button>
                  </Upload>
                </TabPane>
              </Tabs>
            </Modal>
          )}

        {
          viewNotesModal && viewNotesModal.visible && (
            <Modal
              open={viewNotesModal.visible}
              onCancel={() => { setViewNotesModal(null) }}
              onOk={() => { setViewNotesModal(null) }}
              style={{ width: '100%', height: '100%' }}
              width={'90%'}
            >
              <ViewNotes handleNoteSelection={handleNoteSelection} selectedNote={selectedNote} viewNotesModal={viewNotesModal} />
            </Modal>
          )
        }
      </div>
    </div >
  )
}

export default PacsList;
