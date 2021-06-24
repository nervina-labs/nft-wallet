import { useEffect, useRef } from 'react'
import VConsole from 'vconsole'

const v = new VConsole()
console.log(v)
export const useDisableScrollBounce = (): void => {
  const startY = useRef(0)
  const currentY = useRef(0)
  const dragging = useRef(false)
  const lastScrollTop = useRef(0)
  // const onTouchStart = useCallback((e: TouchEvent) => {
  //   dragging.current = true
  //   startY.current = e.touches[0].pageY
  //   currentY.current = startY.current
  // }, [])
  useEffect(() => {
    window.addEventListener(
      'scroll',
      (e) => {
        lastScrollTop.current =
          window.pageYOffset || document.documentElement.scrollTop
      },
      false
    )
    window.addEventListener(
      'touchstart',
      (e) => {
        if (lastScrollTop.current) return
        dragging.current = true
        startY.current = e.touches[0].pageY
        currentY.current = startY.current
      },
      false
    )
    window.addEventListener(
      'touchend',
      (e) => {
        startY.current = 0
        currentY.current = 0
        dragging.current = false
      },
      false
    )
    window.addEventListener(
      'touchmove',
      (e) => {
        if (lastScrollTop.current !== 0) {
          console.log('e.preventDefault()')
          e.stopPropagation()
          e.preventDefault()
        }
        // console.log('e.preventDefault()')
        // e.preventDefault()
      },
      { passive: false }
    )
  }, [])
}
