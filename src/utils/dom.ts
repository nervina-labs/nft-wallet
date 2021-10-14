import { IS_IPHONE, IS_IMTOKEN } from '../constants/env'
import { RoutePath } from '../routes'

export const disableImageContext = (e: any): boolean => {
  e?.preventDefault?.()
  e?.stopPropagation?.()
  return false
}

export const disableImagePreviewContext = (visible: boolean) => {
  const backdrop: HTMLDivElement | null = document.querySelector(
    '.PhotoView-PhotoSlider__Backdrop'
  )
  backdrop?.addEventListener('animationend', () => {
    const img: HTMLImageElement | null = document.querySelector(
      '.PhotoView__Photo'
    )
    if (img && visible) {
      img.addEventListener('contextmenu', disableImageContext)
    }
  })
}

export async function downloadImage(
  imageSrc: string,
  filename = 'qrcode.jpg'
): Promise<void> {
  const headers = new Headers()
  headers.append('Access-Control-Allow-Origin', location.href)
  headers.append('Access-Control-Allow-Credentials', 'true')
  const image = await fetch(imageSrc, {
    headers,
  })
  const imageBlog = await image.blob()
  const imageURL = URL.createObjectURL(imageBlog)

  const link = document.createElement('a')
  link.href = imageURL
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const downloadCardBackPDF = (selector: string) => {
  if (IS_IPHONE || IS_IMTOKEN) {
    return
  }
  const container = document.querySelector(selector)
  const nodeList = container?.querySelectorAll('a')
  nodeList?.forEach?.((el) => {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    el.addEventListener('click', async (e) => {
      const target = e.currentTarget as any
      e.stopPropagation()
      if (target.href?.endsWith('.pdf') && !target.download) {
        e.preventDefault()
        window.open(
          `${RoutePath.PDFViewer}?url=${encodeURIComponent(target.href)}`
        )
      }
    })
  })
}
