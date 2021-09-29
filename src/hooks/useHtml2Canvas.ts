import { useEffect, useState } from 'react'
import html2canvas from 'html2canvas-objectfit-fix'

export function useHtml2Canvas(
  element: HTMLDivElement | null,
  options?: {
    deps?: any[]
    enable?: boolean
  }
) {
  const [imgSrc, setImgSrc] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop
    if (element && options?.enable !== false) {
      setIsLoading(true)
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
        .then(() => {
          setIsLoading(false)
        })
    }
  }, [element, options?.enable].concat(options?.deps ?? []))
  return {
    imgSrc,
    isLoading,
  }
}
