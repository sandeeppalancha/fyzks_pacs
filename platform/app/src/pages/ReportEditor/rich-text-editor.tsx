// RichTextEditor.js
import React, { useRef, useEffect } from 'react';
import Quill from 'quill';

import 'quill/dist/quill.snow.css';
import { Button } from 'antd';
import { getUserDetails, makePostCall } from '../../utils/helper';
import CustomEditor from '../custom-editor';

const RichTextEditor = ({ content, onChange, onSave, cancel, currentReport, patDetails }) => {

  const userDetails = getUserDetails();
  const userType = userDetails?.user_type;

  const handleSave = (status) => {
    onSave && onSave(content, status, currentReport,);
  }

  const handlePrint = () => {
    makePostCall('/print-report', {
      report: currentReport,
      patDetails: patDetails,
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

  return (<div id='editor-container'>
    {/* <div ref={editorRef}></div> */}
    <CustomEditor initialContent={content} placeholder={"placeholder..."} handleChange={onChange} />
    {/* <div className='d-flex' >
      <Button className='mt-3' type='default' onClick={cancel}>Cancel</Button>
      <Button className='mt-3' type='default' onClick={handlePrint}>PRINT REPORT</Button>
      <Button
        disabled={statusOrder.indexOf(currentReport?.pr_status) > 0}
        danger className='mt-3 ms-auto' type='default'
        color='primary' onClick={() => handleSave('DRAFTED')}
      >DRAFT</Button>
      <Button
        disabled={currentReport?.pr_status === 'SIGNEDOFF'}
        danger className='mt-3 ms-3' type='default' color='primary'
        onClick={() => handleSave('REVIEWED')}
      >REVIEWED</Button>
      <Button
        // disabled={statusOrder.indexOf(currentReport?.pr_status) < 1}
        className='mt-3 ms-3' type='primary' color='primary'
        onClick={() => handleSave('SIGNEDOFF')}
        disabled={['hod', 'radiologist'].indexOf(userType) < 0}
      >
        SIGN OFF
      </Button>
    </div> */}
  </div>);
};

export default RichTextEditor;
