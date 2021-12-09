import React from 'react'
import styled from 'styled-components'
import { Appbar } from './components/appbar'
import { Redirect, useParams, useRouteMatch } from 'react-router-dom'
import { useNFTDetailApi } from './hooks/useNFTDetailApi'
import { RoutePath } from '../../routes'
import { Renderer } from './components/renderer'
import { NftDetail } from './components/nftDetail'
import { MainContainer } from '../../styles'
import { Footer } from './components/footer'
import { OrderDrawer } from '../../components/OrderDrawer'
import { useScrollRestoration } from '../../hooks/useScrollRestoration'
import { useFirstOpenScrollToTop } from '../../hooks/useFirstOpenScrollToTop'
import { useTrackDidMount } from '../../hooks/useTrack'

const Container = styled(MainContainer)`
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  user-select: none;
`

interface RouteParams {
  id: string
  tid?: string
}

export const NFT: React.FC = () => {
  const { id, tid } = useParams<RouteParams>()
  const matchTokenClass = useRouteMatch(RoutePath.TokenClass)
  const isClass = matchTokenClass?.isExact
  const { detail, failureCount, isLoading, refetch } = useNFTDetailApi(id, {
    isClass,
    tid,
  })
  useScrollRestoration()
  useFirstOpenScrollToTop()
  const isNotFound =
    failureCount >= 3 || detail?.is_class_banned || detail?.is_issuer_banned

  useTrackDidMount('nft-detail', id)

  if (isNotFound) {
    return <Redirect to={RoutePath.NotFound} />
  }

  const uuid = detail?.uuid || id

  return (
    <Container>
      <Appbar detail={detail} />
      <Renderer detail={detail} />
      <NftDetail
        uuid={uuid}
        detail={detail}
        isLoading={isLoading}
        refetch={refetch}
        isClass={isClass}
      />
      <Footer
        uuid={uuid}
        detail={detail}
        hidden={isLoading}
        isClass={isClass}
      />
      <OrderDrawer />
    </Container>
  )
}
