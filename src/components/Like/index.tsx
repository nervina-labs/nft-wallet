import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { ReactComponent as Heart } from '../../assets/svg/liked.svg'
import { ReactComponent as UnHeart } from '../../assets/svg/unlike.svg'
import { useAccountStatus } from '../../hooks/useAccount'
import { useLikeStatus } from '../../hooks/useLikeStatus'
import { useToggleLike } from '../../hooks/useProfile'
import { RoutePath } from '../../routes'
import { formatCount } from '../../utils'
import { Loading } from '@mibao-ui/components'

const Container = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  justify-content: center;
  /* line-height: 17px; */
  > svg {
    margin-right: 6px;
  }
  span {
    color: #666;
    font-size: 12px;
  }

  .loading {
    margin-right: 6px;
    color: #ddd;
  }
`

export interface LikeProps {
  count: number
  liked: boolean
  uuid: string
  likeble?: boolean
}

export const Like: React.FC<LikeProps> = ({
  count = 0,
  uuid,
  liked: isLikedFromList,
  likeble = true,
}) => {
  const { i18n } = useTranslation('translations')
  const { likeStatus, setLikeStatus } = useLikeStatus()
  const isLiked = useMemo(() => {
    return likeStatus[uuid] ?? isLikedFromList
  }, [likeStatus, uuid, isLikedFromList])
  const [isLoading, setIsLoading] = useState(false)
  const likesCount = useMemo(() => {
    let c = Number(count)
    if (isLikedFromList) {
      c = isLiked ? c : c - 1
    } else {
      c = isLiked ? c + 1 : c
    }
    return formatCount(c, i18n.language)
  }, [i18n.language, count, isLiked, isLikedFromList])
  const toggleLike = useToggleLike()
  const { isLogined } = useAccountStatus()
  const history = useHistory()

  const toggle = useCallback(async () => {
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
  }, [uuid, toggleLike, isLogined, history, setLikeStatus])

  return (
    <Container
      onClick={
        likeble
          ? (e) => {
              e.preventDefault()
              e.stopPropagation()
              toggle().catch(Boolean)
            }
          : undefined
      }
      style={{
        cursor: likeble ? 'pointer' : 'default',
      }}
    >
      {isLoading ? (
        <Loading width="16px" />
      ) : !isLiked ? (
        <UnHeart />
      ) : (
        <Heart />
      )}
      <span>{likesCount}</span>
    </Container>
  )
}
