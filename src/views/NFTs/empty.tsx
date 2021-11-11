import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useRouteQuery } from '../../hooks/useRouteQuery'
import { ReactComponent as NoNFT } from '../../assets/svg/no-nft.svg'
import { ReactComponent as NoLike } from '../../assets/svg/no-like.svg'
import { ReactComponent as NoFollower } from '../../assets/svg/no-follow.svg'

const Container = styled.div`
  margin-top: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .desc {
    font-size: 14px;
    color: #777e90;
  }
  .link {
    margin-top: 15px;
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    text-decoration-line: underline;
    color: rgba(0, 0, 0, 0.8);
  }
`

export const Empty: React.FC<{
  showExplore?: boolean
}> = ({ showExplore = true }) => {
  const { t } = useTranslation('translations')
  const listTag = useRouteQuery<string>('list', '')
  const isLiked = listTag === 'liked'
  const isFollow = listTag === 'follow'
  const desc = useMemo(() => {
    if (isLiked) {
      return t('nfts.no-likes')
    } else if (isFollow) {
      return t('follow.no-data')
    }
    return t('nfts.no-data')
  }, [t, isLiked, isFollow])

  const img = useMemo(() => {
    if (isLiked) {
      return <NoLike />
    } else if (isFollow) {
      return <NoFollower />
    }
    return <NoNFT />
  }, [isLiked, isFollow])

  return (
    <Container>
      {img}
      <div className="desc">{desc}</div>
    </Container>
  )
}
