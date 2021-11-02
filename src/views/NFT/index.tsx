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

const Container = styled(MainContainer)`
  position: relative;
`

export const NFT: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const matchTokenClass = useRouteMatch(RoutePath.TokenClass)
  const { detail, failureCount, isLoading, refetch } = useNFTDetailApi(id, {
    isClass: matchTokenClass?.isExact,
  })
  const isNotFound =
    failureCount >= 3 || detail?.is_class_banned || detail?.is_issuer_banned

  if (isNotFound) {
    return <Redirect to={RoutePath.NotFound} />
  }

  return (
    <Container>
      <Appbar />

      <Renderer detail={detail} />
      <NftDetail
        uuid={id}
        detail={detail}
        isLoading={isLoading}
        refetch={refetch}
        isClass={matchTokenClass?.isExact}
      />
      <Footer uuid={id} detail={detail} hidden={isLoading} />
    </Container>
  )
}
