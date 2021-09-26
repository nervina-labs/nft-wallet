import { useCallback } from 'react'
import { atom, useAtom } from 'jotai'

export interface UseFollowStatus {
  followStatus: Record<string, boolean>
  setFollowStatus: (uuid: string, like: boolean) => void
}

const followStatusAtom = atom<Record<string, boolean>>({})

export const useFollowStatus = (): UseFollowStatus => {
  const [followStatus, _setFollowStatus] = useAtom(followStatusAtom)
  const setFollowStatus = useCallback((uuid: string, like: boolean) => {
    _setFollowStatus((status) => {
      return {
        ...status,
        [uuid]: like,
      }
    })
  }, [])

  return {
    followStatus,
    setFollowStatus,
  }
}
