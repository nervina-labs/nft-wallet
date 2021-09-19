import { useEffect, useState } from 'react'
import html2canvas from 'html2canvas-objectfit-fix'

export function useHtml2Canvas(
  element: HTMLDivElement | null,
  options?: {
    deps?: any[]
    enable?: boolean
  }
): string {
  const [imgSrc, setImgSrc] = useState('')
  const scrollTop =
    document.documentElement.scrollTop || document.body.scrollTop
  useEffect(() => {
    if (element && options?.enable !== false) {
      html2canvas(element, {
        useCORS: true,
        allowTaint: true,
        height: element.offsetHeight,
        width: element.offsetWidth,
        x: 0,
        y: scrollTop,
      })
        .then((canvas) => {
          setImgSrc(canvas.toDataURL('image/png'))
        })
        .catch((error) => {
          console.error('oops, something went wrong!', error)
        })
    }
  }, [element, options?.enable].concat(options?.deps ?? []))
  return imgSrc
}
