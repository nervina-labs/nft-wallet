import { useEffect, useState } from 'react'
import html2canvas from 'html2canvas-objectfit-fix'

export function useHtml2Canvas(element: HTMLDivElement): string {
  const [imgSrc, setImgSrc] = useState('')
  useEffect(() => {
    if (element) {
      html2canvas(element, { useCORS: true, allowTaint: true })
        .then((canvas) => {
          setImgSrc(canvas.toDataURL('image/png'))
        })
        .catch((error) => {
          console.error('oops, something went wrong!', error)
        })
    }
  }, [element])
  return imgSrc
}
