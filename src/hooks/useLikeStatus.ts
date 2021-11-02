import React, { useCallback, useMemo, useState } from 'react'
import { atom, useAtom } from 'jotai'
import { useToggleLike } from './useProfile'
import { useAccountStatus } from './useAccount'
import { RoutePath } from '../routes'
import { useHistory } from 'react-router'
import { formatCount } from '../utils'

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

export interface LikeProps {
  count: number
  liked: boolean
  uuid: string
  locale: string
  likeble?: boolean
}

export const useLike = ({
  count = 0,
  uuid,
  liked: isLikedFromList,
  locale,
}: LikeProps) => {
  const { likeStatus, setLikeStatus } = useLikeStatus()
  const isLiked = useMemo(() => {
    return likeStatus[uuid] ?? isLikedFromList
  }, [likeStatus, uuid, isLikedFromList])
  const [isLoading, setIsLoading] = useState(false)
  const likeCount = useMemo(() => {
    let c = Number(count)
    if (isLikedFromList) {
      c = isLiked ? c : c - 1
    } else {
      c = isLiked ? c + 1 : c
    }
    return formatCount(c, locale) as number
  }, [locale, count, isLiked, isLikedFromList])
  const toggleLike = useToggleLike()
  const { isLogined } = useAccountStatus()
  const history = useHistory()

  const toggle = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsLoading(true)
      try {
        if (!isLogined) {
          history.push(RoutePath.Login)
          return
        }
        const res = await toggleLike(uuid, false)
        setLikeStatus(uuid, res)
      } catch (error) {
        //
      } finally {
        setIsLoading(false)
      }
    },
    [uuid, toggleLike, isLogined, history, setLikeStatus]
  )

  return {
    likeCount,
    isLikeLoading: isLoading,
    toggleLike: toggle,
    isLiked,
  }
}
