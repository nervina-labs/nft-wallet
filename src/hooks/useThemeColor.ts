import { useEffect } from 'react'

export function useThemeColor(color: string) {
  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]')
    const originColor = meta?.getAttribute('content')
    meta?.setAttribute('content', color)

    return () => {
      if (originColor) {
        meta?.setAttribute('content', originColor)
      }
    }
  })
}
