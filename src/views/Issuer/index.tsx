import React, { useState } from 'react'
import styled from 'styled-components'
import { IssuerInfo } from './components/issuerInfo'
import { NftCards } from './components/nftCards'
import { ReactComponent as BackSvg } from '../../assets/svg/back.svg'
import { ReactComponent as ShareSvg } from '../../assets/svg/share.svg'
import { Appbar, AppbarButton, AppbarSticky } from '../../components/Appbar'
import { Share } from '../../components/Share'
import { useHistoryBack } from '../../hooks/useHistoryBack'
import { MainContainer } from '../../styles'
import { useScrollRestoration } from '../../hooks/useScrollRestoration'

const IssuerContainer = styled(MainContainer)`
  position: relative;
  user-select: none;
`

export const Issuer: React.FC = () => {
  const goBack = useHistoryBack()
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  useScrollRestoration()

  return (
    <IssuerContainer>
      <AppbarSticky>
        <Appbar
          left={
            <AppbarButton onClick={goBack}>
              <BackSvg />
            </AppbarButton>
          }
          right={
            <AppbarButton
              transparent
              onClick={() => setIsShareDialogOpen(true)}
            >
              <ShareSvg />
            </AppbarButton>
          }
        />
      </AppbarSticky>
      <IssuerInfo />
      <NftCards />
      <Share
        isDialogOpen={isShareDialogOpen}
        closeDialog={() => setIsShareDialogOpen(false)}
        displayText={location.href}
        copyText={location.href}
      />
    </IssuerContainer>
  )
}
