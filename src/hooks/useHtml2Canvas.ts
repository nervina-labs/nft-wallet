import { useCallback, useState } from 'react'
import html2canvas from 'html2canvas-objectfit-fix'

export function useHtml2Canvas(options?: {
  onError?: <E>(error: E) => void
  toBlob?: boolean
}) {
  const [imgSrc, setImgSrc] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<any>()
  const toBlob = options?.toBlob === undefined ? true : options.toBlob

  const reload = useCallback(() => {
    setImgSrc(undefined)
  }, [])

  const onRender = useCallback(
    (element: HTMLDivElement | null) => {
      if (!element) {
        return
      }
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop
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
        .then(async (canvas) => {
          if (toBlob) {
            canvas.toBlob((blob) => {
              if (!blob) {
                throw new Error('not blob')
              }
              const url = URL.createObjectURL(blob)
              setImgSrc(url)
            })
          } else {
            const url = canvas.toDataURL()
            setImgSrc(url)
          }
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
    },
    [options, toBlob]
  )

  return {
    imgSrc,
    isLoading,
    error,
    reload,
    onRender,
  }
}
