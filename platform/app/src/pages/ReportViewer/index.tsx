import React from "react";
import { Document, Page, pdfjs } from "react-pdf";

const ReportViewer = ({ pdfData, pdfBlob }) => {

  return (
    <div>
      <Document
        // file={window.URL.createObjectURL(pdfData)}
        file={pdfBlob}
        onLoadError={(error) => console.error('Failed to load PDF', error)}
      >
        <Page pageNumber={1} />
      </Document>
    </div>
  )
}

export default ReportViewer;
