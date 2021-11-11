import React from 'react'
import styled from 'styled-components'
import { IssuerInfo } from './components/issuerInfo'
import { NftCards } from './components/nftCards'
import { Appbar } from './components/appbar'
import { MainContainer } from '../../styles'
import { useScrollRestoration } from '../../hooks/useScrollRestoration'

const IssuerContainer = styled(MainContainer)`
  position: relative;
  user-select: none;
`

export const Issuer: React.FC = () => {
  useScrollRestoration()

  return (
    <IssuerContainer>
      <Appbar />
      <IssuerInfo />
      <NftCards />
    </IssuerContainer>
  )
}
