import { useCallback, useEffect, useState } from 'react'
import html2canvas from 'html2canvas-objectfit-fix'

export function useHtml2Canvas(
  element: HTMLDivElement | null,
  options?: {
    enable?: boolean
    onError?: <E>(error: E) => void
  }
) {
  const [imgSrc, setImgSrc] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<any>()

  const reload = useCallback(() => {
    setImgSrc(undefined)
  }, [])

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
        scale: 3,
      })
        .then((canvas) => {
          setImgSrc(canvas.toDataURL('image/png'))
        })
        .catch((err) => {
          setError(err)
          if (options?.onError) {
            options.onError(err)
          }
          console.error('oops, something went wrong!', err)
        })
        .then(() => {
          setIsLoading(false)
        })
    }
  }, [element, options, options?.enable])
  return {
    imgSrc,
    isLoading,
    error,
    reload,
  }
}
