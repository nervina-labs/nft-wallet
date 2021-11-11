import React from 'react'
import styled from 'styled-components'
import { IssuerInfo } from './components/issuerInfo'
import { NftCards } from './components/nftCards'
import { Appbar } from './components/appbar'
import { MainContainer } from '../../styles'

const IssuerContainer = styled(MainContainer)`
  position: relative;
  user-select: none;
`

export const Issuer: React.FC = () => {
  return (
    <IssuerContainer>
      <Appbar />
      <IssuerInfo />
      <NftCards />
    </IssuerContainer>
  )
}
