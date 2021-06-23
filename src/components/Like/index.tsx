import { CircularProgress } from '@material-ui/core'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { ReactComponent as Heart } from '../../assets/svg/liked.svg'
import { ReactComponent as UnHeart } from '../../assets/svg/unlike.svg'
import { useProfileModel } from '../../hooks/useProfile'
import { useWalletModel } from '../../hooks/useWallet'
import { RoutePath } from '../../routes'

const Container = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  justify-content: center;
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
  count: string
  liked: boolean
  uuid: string
}

const formatCount = (count: number, lang: string): number | string => {
  if (lang === 'zh') {
    return count > 10000 ? `${count / 10000} 万` : count
  }
  return count > 1000 ? `${count / 1000}k` : count
}

export const Like: React.FC<LikeProps> = ({
  count = 0,
  uuid,
  liked: isLikedFromList,
}) => {
  const { i18n } = useTranslation('translations')
  const [isLiked, setIsLiked] = useState(isLikedFromList)
  const [isLoading, setIsLoading] = useState(false)
  const likesCount = useMemo(() => {
    let c = Number(count)
    if (isLikedFromList) {
      c = isLiked ? c : c - 1
    } else {
      c = isLiked ? c + 1 : c
    }
    return formatCount(c, i18n.language)
  }, [i18n.language, count, isLikedFromList, isLiked])
  const { toggleLike } = useProfileModel()
  const { isLogined } = useWalletModel()
  const history = useHistory()

  const toggle = useCallback(async () => {
    setIsLoading(true)
    try {
      if (!isLogined) {
        history.push(RoutePath.Login)
        return
      }
      await toggleLike(uuid, !isLiked)
      setIsLiked(!isLiked)
    } catch (error) {
      //
    } finally {
      setIsLoading(false)
    }
  }, [isLiked, uuid, toggleLike, isLogined, history])

  return (
    <Container
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggle().catch(Boolean)
      }}
    >
      {isLoading ? (
        <CircularProgress size="16px" className="loading" />
      ) : !isLiked ? (
        <UnHeart />
      ) : (
        <Heart />
      )}
      <span>{likesCount}</span>
    </Container>
  )
}
