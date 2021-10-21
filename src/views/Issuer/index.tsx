import React, { useState } from 'react'
import styled from 'styled-components'
import { IssuerInfo } from './info'
import { NftCards } from './nftCards'
import { ReactComponent as BackSvg } from '../../assets/svg/back.svg'
import { ReactComponent as ShareSvg } from '../../assets/svg/share.svg'
import { Appbar, AppbarButton, AppbarSticky } from '../../components/Appbar'
import { Share } from '../../components/Share'
import { useHistoryBack } from '../../hooks/useHistoryBack'

const IssuerContainer = styled.main`
  --max-width: 500px;
  position: relative;
  max-width: var(--max-width);
  margin: 0 auto;

  .appbar {
    max-width: var(--max-width);
  }
`

export const Issuer: React.FC = () => {
  const goBack = useHistoryBack()
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)

  return (
    <IssuerContainer>
      <AppbarSticky>
        <Appbar
          left={
            <AppbarButton>
              <BackSvg onClick={goBack} />
            </AppbarButton>
          }
          right={
            <AppbarButton transparent>
              <ShareSvg onClick={() => setIsShareDialogOpen(true)} />
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
