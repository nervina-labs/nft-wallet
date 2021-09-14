import { useEffect, useMemo, useState } from 'react'
import html2canvas from 'html2canvas-objectfit-fix'

export function useHtml2Canvas(
  element: HTMLDivElement | null,
  options?: {
    deps?: any[]
    enable?: boolean
  }
): string {
  const [imgSrc, setImgSrc] = useState('')
  useEffect(() => {
    if (element && options?.enable !== false) {
      html2canvas(element, { useCORS: true, allowTaint: true })
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

export function useHtml2CanvasImageUrl<U extends string | undefined>(
  url?: U
): U extends string ? string : undefined {
  const time = new Date().getTime()
  return useMemo(() => {
    if (!url) {
      return url as any
    }
    const replacedHostUrl = url.replace(
      'https://oss.jinse.cc/',
      'https://goldenlegend.oss-accelerate.aliyuncs.com/'
    )
    const urlObj = new URL(replacedHostUrl)
    urlObj.searchParams.set('time', `${time}`)
    return decodeURI(urlObj.toString())
  }, [url])
}
