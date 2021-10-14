import React, { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf/dist/esm/entry.webpack'
import styled from 'styled-components'
import { useRouteQuery } from '../../hooks/useRouteQuery'

import 'react-pdf/dist/esm/Page/AnnotationLayer.css'

const options = {
  cMapUrl: 'cmaps/',
  cMapPacked: true,
}

const Container = styled.div`
  overflow-x: hidden;
  .pdf__container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .pdf__container__load {
    color: white;
  }
  .pdf__container__document .react-pdf__Document {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .pdf__container__document .react-pdf__Page {
    max-width: calc(100% - 2em);
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
    margin: 1em;
  }
  .pdf__container__document .react-pdf__Page canvas {
    max-width: 100%;
    height: auto !important;
  }
  .pdf__container__document .react-pdf__message {
    padding: 20px;
    color: white;
  }
`

export function PDFViewer() {
  pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'
  const [numPages, setNumPages] = useState(null)
  const url = useRouteQuery('url', '')

  function onDocumentLoadSuccess({ numPages }: any) {
    setNumPages(numPages)
  }

  return (
    <Container>
      <div className="pdf">
        <div className="pdf__container">
          <div className="pdf__container__document">
            <Document
              file={decodeURIComponent(url)}
              onLoadSuccess={onDocumentLoadSuccess}
              options={options}
            >
              {Array.from(new Array(numPages), (el, index) => (
                <Page key={`page_${index + 1}`} pageNumber={index + 1} />
              ))}
            </Document>
          </div>
        </div>
      </div>
    </Container>
  )
}
