import { useEffect } from 'react'
import { useAtom } from 'jotai'
import { useRouteQuery } from './useRouteQuery'
import { atomWithStorage } from 'jotai/utils'
import { useHistory } from 'react-router'
import { useAccountStatus } from './useAccount'
import { RoutePath } from '../routes'

export const IS_LITE_MODE_QUERY_NAME = 'is_lite_mode'

const isLiteAtom = atomWithStorage<boolean>(IS_LITE_MODE_QUERY_NAME, false, {
  getItem: (key) => sessionStorage.getItem(key) === 'true',
  setItem: (key, value) => {
    sessionStorage.setItem(key, `${value ? 'true' : 'false'}`)
  },
})

export function useLite() {
  const isLiteModeRouteQuery = useRouteQuery<'true' | 'false'>(
    IS_LITE_MODE_QUERY_NAME,
    'false'
  )
  const [isLite, setIsLite] = useAtom(isLiteAtom)
  const { replace } = useHistory()
  const { isLogined } = useAccountStatus()

  useEffect(() => {
    if (isLiteModeRouteQuery === 'true') {
      setIsLite(true)
    }
  }, [isLiteModeRouteQuery, setIsLite])

  useEffect(() => {
    if (!isLite) return
    if (isLogined) {
      return replace(RoutePath.NFTs)
    } else {
      return replace(RoutePath.Login)
    }
  }, [isLite, isLogined, replace])

  return {
    isLite,
  }
}
