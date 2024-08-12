// RichTextEditor.js
import React, { useRef, useEffect } from 'react';
import Quill from 'quill';

import 'quill/dist/quill.snow.css';
import { Button } from 'antd';
import { makePostCall } from '../../utils/helper';
import CustomEditor from '../custom-editor';

const RichTextEditor = ({ content, onChange, onSave, cancel, currentReport, patDetails }) => {
  // const editorRef = useRef(null);
  // const quillInstance = useRef(null);

  // useEffect(() => {
  //   console.log("content", content);

  //   if (!quillInstance.current && false) {
  //     quillInstance.current = new Quill(editorRef.current, {
  //       theme: 'snow',
  //       modules: {
  //         clipboard: {
  //           matchVisual: false, // Disable Quill's default behavior of matching visual elements
  //         },
  //       }
  //     });
  //   }

  //   if (quillInstance.current) {
  //     quillInstance.current.on('text-change', (delta, oldDelta, source) => {
  //       // console.log("changed", quillInstance.current.root.innerHTML);

  //       // onChange && onChange(quillInstance.current.root.innerHTML);
  //     });

  //     quillInstance.current.on('text-change', () => {
  //       // console.log("changed", quillInstance.current.root.innerHTML);
  //       // onChange(quillInstance.current.root.innerHTML);
  //     });

  //     // if (content) {
  //     //   quill.root.innerHTML = content;
  //     // }

  //     // Convert HTML to Delta format
  //     const delta = quillInstance.current.clipboard.convert(content);

  //     console.log("delta", delta);


  //     // Load Delta into Quill
  //     quillInstance.current.setContents(delta);

  //     quillInstance.current.root.innerHTML = content;
  //   }
  // }, [content]);

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
        console.log("repo", res);
        const pdfBlob = new Blob([res.data], { type: "application/pdf" });
        // setPdfBlob(pdfBlob);
        // saveAs(pdfBlob, "generated-pdf.pdf");
        // const pdfBlob = rawToBlob(response.data);
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
    <div className='d-flex' >
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
        onClick={() => handleSave('SIGNEDOFF')}>
        SIGN OFF
      </Button>
    </div>
  </div>);
};

export default RichTextEditor;
