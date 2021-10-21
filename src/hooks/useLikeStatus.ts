import { useCallback } from 'react'
import { atom, useAtom } from 'jotai'

export interface UseLikeStatus {
  likeStatus: Record<string, boolean>
  setLikeStatus: (uuid: string, like: boolean) => void
}

const likeStatusAtom = atom<Record<string, boolean>>({})

export const useLikeStatus = (): UseLikeStatus => {
  const [likeStatus, _setLikeStatus] = useAtom(likeStatusAtom)
  const setLikeStatus = useCallback(
    (uuid: string, like: boolean) => {
      _setLikeStatus((status) => {
        return {
          ...status,
          [uuid]: like,
        }
      })
    },
    [_setLikeStatus]
  )

  return {
    likeStatus,
    setLikeStatus,
  }
}
