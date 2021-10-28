import React from 'react'
import styled from 'styled-components'
import { Appbar, AppbarButton, AppbarSticky } from '../../components/Appbar'
import { ReactComponent as BackSvg } from '../../assets/svg/back.svg'
import { ReactComponent as ShareSvg } from '../../assets/svg/share.svg'
import { useHistoryBack } from '../../hooks/useHistoryBack'
import { Redirect, useParams } from 'react-router-dom'
import { useNFTDetailApi } from './hooks/useNFTDetailApi'
import { RoutePath } from '../../routes'
import { Renderer } from './components/renderer'
import { NftDetail } from './components/nftDetail'

const Container = styled.main`
  --max-width: 500px;
  position: relative;
  max-width: var(--max-width);
  margin: 0 auto;
`

export const NFT: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const goBack = useHistoryBack()
  const { detail, failureCount, isLoading, refetch } = useNFTDetailApi(id)
  const isNotFound =
    failureCount >= 3 || detail?.is_class_banned || detail?.is_issuer_banned

  if (isNotFound) {
    return <Redirect to={RoutePath.NotFound} />
  }

  return (
    <Container>
      <AppbarSticky>
        <Appbar
          transparent
          left={
            <AppbarButton onClick={goBack}>
              <BackSvg />
            </AppbarButton>
          }
          right={
            <AppbarButton transparent>
              <ShareSvg />
            </AppbarButton>
          }
        ></Appbar>
      </AppbarSticky>

      <Renderer detail={detail} />
      <NftDetail detail={detail} isLoading={isLoading} refetch={refetch} />
    </Container>
  )
}
