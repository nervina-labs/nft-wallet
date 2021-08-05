import { useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { debounce } from '../utils'
import { useWalletModel } from './useWallet'

export const useScrollRestoration = (): void => {
  const {
    setScrollScrollRestoration,
    getScrollScrollRestoration,
  } = useWalletModel()
  const location = useLocation()
  const history = useHistory()

  useEffect(() => {
    const path = location.pathname + location.search
    const pos = getScrollScrollRestoration(path)
    if (pos && history.action !== 'POP') {
      window.scrollTo(pos.x, pos.y)
    }
    const handleScroll = (): void => {
      const x = window.pageXOffset
      const y = window.pageYOffset
      setScrollScrollRestoration(path, { x, y })
    }

    const cb = debounce(handleScroll, 100)

    window.addEventListener('scroll', cb, false)

    return () => {
      window.removeEventListener('scroll', cb, false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search])
}
