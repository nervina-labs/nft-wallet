import { useEffect, useMemo, useState } from 'react'

const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

export function useTextEllipsis(
  text: string,
  width: number,
  options?: {
    font?: string
  }
) {
  const font = useMemo(() => {
    if (options?.font) {
      return options.font
    }
    const bodyStyle = window.getComputedStyle(document.body)
    const { fontSize, fontFamily } = bodyStyle
    return `${fontSize} ${fontFamily}`
  }, [options?.font])
  const [content, setContent] = useState(text)
  const [cutIndex, setCutIndex] = useState(text.length)
  useEffect(() => {
    ctx.font = font
    let i = 1
    for (; i < text.length; i++) {
      if (ctx.measureText(text.substring(0, i)).width > width) {
        break
      }
    }
    setContent(text.substring(0, i) + (i === text.length ? '' : '…'))
    setCutIndex(i)
  }, [text, width, font])
  return [content, cutIndex]
}
