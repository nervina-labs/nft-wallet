import { useCallback, useState } from 'react'
import { createModel } from 'hox'

export interface UseFollowStatus {
  followStatus: Record<string, boolean>
  setFollowStatus: (uuid: string, like: boolean) => void
}

export const useFollowStatus = (): UseFollowStatus => {
  const [followStatus, _setFollowStatus] = useState<Record<string, boolean>>({})
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

export const useFollowStatusModel = createModel(useFollowStatus)
