import { Col, Row } from "antd"
import { BASE_API } from "../../axios"
import { Document, Page, pdfjs } from "react-pdf";
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { getAccessToken } from "../../utils/helper";

const ViewNotes = ({ viewNotesModal, handleNoteSelection, selectedNote }) => {
  pdfjs.GlobalWorkerOptions.workerSrc = '/pdf-worker-min.js';

  const customHeaders = {
    Authorization: `Bearer ${getAccessToken()}`, // Add your token here
  };

  return (
    <div>
      <div className='notes-header'>RIS NOTES</div>
      <div >
        <div>
          <Row>
            <Col span={8}>
              <span className='notes-label'>Name: </span>
              <span className='notes-value'>{viewNotesModal?.details?.po_pat_name}</span>
            </Col>
            <Col span={8}>
              <span className='notes-label'>PIN: </span>
              <span className='notes-value'>{viewNotesModal?.details?.po_pin}</span>
            </Col>
            <Col span={8}>
              <span className='notes-label'>Age: </span>
              <span className='notes-value'>{viewNotesModal?.details?.po_pat_dob}</span>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <span className='notes-label'>Order No: </span>
              <span className='notes-value'>{viewNotesModal?.details?.po_ord_no}</span>
            </Col>
            <Col span={8}>
              <span className='notes-label'>Accession No: </span>
              <span className='notes-value'>{viewNotesModal?.details?.po_pin}</span>
            </Col>
            <Col span={8}>
              <span className='notes-label'>Ref Doc: </span>
              <span className='notes-value'>{viewNotesModal?.details?.po_ref_doc}</span>
            </Col>
          </Row>
        </div>
      </div>
      <Row className='mt-3'>
        <Col span={8}>
          <div className='notes-list'>
            {viewNotesModal?.details?.ris_notes?.map(note => (
              <div
                className={`notes-list-item ${note.rn_id === selectedNote?.rn_id ? 'selected' : ''}`}
                onClick={() => { handleNoteSelection(note, viewNotesModal?.details) }}
              >
                {`${note.rn_upload_type?.toUpperCase()} ${note.rn_file_name ? ' | ' + note.rn_file_name : ''}`}
              </div>
            ))}
          </div>
        </Col>
        <Col span={16}>
          <div className='notes-detail' style={{ maxHeight: '500px', overflowY: 'auto' }}>
            {
              selectedNote?.rn_upload_type === 'notes' ? (
                <div>
                  {selectedNote?.rn_notes}
                </div>
              ) : (
                selectedNote?.rn_upload_path && (<Document
                  // file={{ url: `http://localhost:4000/uploads/400583092/557780/401080713/prescription/OldHIS3.pdf`, httpHeaders: customHeaders }}
                  file={{ url: `${BASE_API}/uploads/${selectedNote?.rn_upload_path}`, httpHeaders: customHeaders }}
                  // file={`${BASE_API}/uploads/${selectedNote?.rn_upload_path}`}
                  onLoadError={(error) => console.error('Failed to load PDF', error)}
                >
                  <Page pageNumber={1} />
                </Document>)
              )
            }
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default ViewNotes
