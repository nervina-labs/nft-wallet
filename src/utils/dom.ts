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

export function isVerticalScrollable(): boolean {
  return document.body.scrollHeight > document.body.clientHeight
}
