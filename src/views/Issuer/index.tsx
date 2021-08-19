import React from 'react'
import { NavigationBar } from '../../components/NavigationBar'
import styled from 'styled-components'
import { IssuerInfo } from './info'
import { NftCards } from './nftCards'
import { useTranslation } from 'react-i18next'

const IssuerContainer = styled.main`
  position: relative;
`

export const Issuer: React.FC = () => {
  const [t] = useTranslation('translations')
  return (
    <IssuerContainer>
      <NavigationBar title={t('issuer.issuer_home')} />
      <IssuerInfo />
      <NftCards />
    </IssuerContainer>
  )
}
