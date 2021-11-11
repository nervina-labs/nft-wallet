import { useEffect, useState } from 'react'

export function useFirstOpenScrollToTop(options?: { enable?: boolean }) {
  const [isFirstOpen, setIsFirstOpen] = useState(true)
  useEffect(() => {
    if (options?.enable !== false && isFirstOpen) {
      window.scroll(0, 0)
      setIsFirstOpen(false)
    }
  }, [isFirstOpen, options])
}
