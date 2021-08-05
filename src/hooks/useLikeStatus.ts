import { useCallback, useState } from 'react'
import { createModel } from 'hox'

export interface UseLikeStatus {
  likeStatus: Record<string, boolean>
  setLikeStatus: (uuid: string, like: boolean) => void
}

export const useLikeStatus = (): UseLikeStatus => {
  const [likeStatus, _setLikeStatus] = useState<Record<string, boolean>>({})
  const setLikeStatus = useCallback((uuid: string, like: boolean) => {
    _setLikeStatus((status) => {
      return {
        ...status,
        [uuid]: like,
      }
    })
  }, [])

  return {
    likeStatus,
    setLikeStatus,
  }
}

export const useLikeStatusModel = createModel(useLikeStatus)
