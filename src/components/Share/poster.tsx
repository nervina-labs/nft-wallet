import React from 'react'
import styled from 'styled-components'
import ShareNftBackground from '../../assets/img/share-bg/share-nft@3x.png'

const BaseContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
`

const BackgroundContainer = styled.div`
  width: 100%;
  height: auto;
  max-width: 400px;
  margin: auto;
  img {
    width: 100%;
    height: 100%;
  }
`

const SharingNftPostContainer = styled(BaseContainer)``

export const SharingNftPost: React.FC = () => {
  return (
    <SharingNftPostContainer>
      <BackgroundContainer>
        <img src={ShareNftBackground} alt="bg" />
      </BackgroundContainer>
    </SharingNftPostContainer>
  )
}
