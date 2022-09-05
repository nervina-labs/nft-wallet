import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const IS_LITE_MODE_QUERY_NAME = 'token_city_is_lite_mode'

const isLiteAtom = atomWithStorage<boolean>(IS_LITE_MODE_QUERY_NAME, true, {
  getItem: (key) => sessionStorage.getItem(key) === 'true',
  setItem: (key, value) => {
    sessionStorage.setItem(key, `${value ? 'true' : 'false'}`)
  },
})

export function useLite() {
  const [isLite] = useAtom(isLiteAtom)

  return {
    isLite,
  }
}

export function useIsLiteAtom() {
  return useAtom(isLiteAtom)
}
