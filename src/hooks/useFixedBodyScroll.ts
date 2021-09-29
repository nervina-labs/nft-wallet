import { useEffect } from 'react'

export function useFixedBodyScroll(isFixed: boolean) {
  useEffect(() => {
    const bodyOverflowIsHidden = document.body.style.overflow === 'hidden'
    if (!bodyOverflowIsHidden && isFixed) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      if (!bodyOverflowIsHidden) {
        document.body.style.overflow = ''
      }
    }
  }, [isFixed])
}
