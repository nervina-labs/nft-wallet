import { useEffect } from 'react'
import { useAtom } from 'jotai'
import { useRouteQuery } from './useRouteQuery'
import { atomWithStorage } from 'jotai/utils'

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

  useEffect(() => {
    if (isLiteModeRouteQuery === 'true') {
      setIsLite(true)
    }
  }, [isLiteModeRouteQuery, setIsLite])

  return {
    isLite,
  }
}
