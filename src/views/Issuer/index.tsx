import React, { useState } from 'react'
import styled from 'styled-components'
import { IssuerInfo } from './info'
import { NftCards } from './nftCards'
import { useTranslation } from 'react-i18next'
import { ReactComponent as BackSvg } from '../../assets/svg/back-next.svg'
import { ReactComponent as ShareSvg } from '../../assets/svg/share-next.svg'
import { Appbar, AppbarButton, AppbarSticky } from '../../components/Appbar'
import { useHistory } from 'react-router-dom'
import { Share } from '../../components/Share'

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
  const [t] = useTranslation('translations')
  const history = useHistory()
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)

  return (
    <IssuerContainer>
      <AppbarSticky>
        <Appbar
          title={t('issuer.title')}
          left={
            <AppbarButton>
              <BackSvg onClick={() => history.goBack()} />
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
