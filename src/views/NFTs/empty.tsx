import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import Emptypng from '../../assets/img/empty.png'
import { LazyLoadImage } from '../../components/Image'
import { RoutePath } from '../../routes'
import { useRouteQuery } from '../../hooks/useRouteQuery'
import { Link } from 'react-router-dom'

const Container = styled.div`
  margin-top: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  img {
    margin-top: 100px;
  }
  .desc {
    margin-top: 30px;
    font-size: 15px;
    line-height: 22px;
    color: rgba(0, 0, 0, 0.6);
    font-weight: 600;
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
  const isLiked = useRouteQuery('liked', '')
  const tag = useRouteQuery<string>('tag', '')
  const follow = useRouteQuery<string>('follow', '')
  const isFollow = tag === 'follow' || follow
  const desc = useMemo(() => {
    if (isLiked) {
      return t('nfts.no-likes')
    } else if (isFollow) {
      return t('follow.no-data')
    }
    return t('nfts.no-data')
  }, [t, isLiked, isFollow])
  return (
    <Container>
      <LazyLoadImage src={Emptypng} width={260} height={172} />
      <div className="desc">{desc}</div>
      {showExplore ? (
        <Link className="link" to={RoutePath.Explore}>
          {t('nfts.link')}
        </Link>
      ) : null}
    </Container>
  )
}
