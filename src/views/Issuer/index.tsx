import React from 'react'
import styled from 'styled-components'
import { IssuerInfo } from './info'
import { NftCards } from './nftCards'
import { useTranslation } from 'react-i18next'
import { ReactComponent as BackSvg } from '../../assets/svg/back.svg'
import { ReactComponent as ShareSvg } from '../../assets/svg/share.svg'
import { Appbar, HEADER_HEIGHT } from '../../components/Appbar'
import { useHistory } from 'react-router-dom'

const IssuerContainer = styled.main`
  position: relative;

  .appbar {
    max-width: unset;
  }
`

export const Issuer: React.FC = () => {
  const [t] = useTranslation('translations')
  const history = useHistory()
  return (
    <IssuerContainer>
      <Appbar
        className="appbar"
        title={t('issuer.title')}
        left={<BackSvg onClick={() => history.goBack()} />}
        right={<ShareSvg />}
      />
      <div style={{ height: `${HEADER_HEIGHT}px` }} />
      <IssuerInfo />
      <NftCards />
    </IssuerContainer>
  )
}
