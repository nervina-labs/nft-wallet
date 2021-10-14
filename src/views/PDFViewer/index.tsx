import React, { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { useRouteQuery } from '../../hooks/useRouteQuery'

export function PDFViewer() {
  pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'
  const [numPages, setNumPages] = useState(null)
  const url = useRouteQuery('url', '')

  function onDocumentLoadSuccess({ numPages }: any) {
    setNumPages(numPages)
  }

  return (
    <div className="main" style={{ display: 'flex', justifyContent: 'center' }}>
      <Document
        file={decodeURIComponent(url)}
        onLoadSuccess={onDocumentLoadSuccess}
        loading=""
      >
        {Array.from(new Array(numPages), (el, index) => (
          <Page key={`page_${index + 1}`} pageNumber={index + 1} loading="" />
        ))}
      </Document>
    </div>
  )
}
