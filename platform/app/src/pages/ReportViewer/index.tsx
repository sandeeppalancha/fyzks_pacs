import React from "react";
import { Document, Page, pdfjs } from "react-pdf";

const ReportViewer = ({ pdfData, pdfBlob, pdf_url }) => {

  console.log("pdf data", pdfData);
  console.log("pdf blob", pdfBlob);
  pdfjs.GlobalWorkerOptions.workerSrc = '/pdf-worker-min.js';
  return (
    <div>
      <Document
        file={pdf_url}
        // file={pdfData}
        onLoadError={(error) => console.error('Failed to load PDF', error)}
      >
        <Page pageNumber={1} renderTextLayer={false} renderAnnotationLayer={false} />
      </Document>
    </div>
  )
}

export default ReportViewer;
