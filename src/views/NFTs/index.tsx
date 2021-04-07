import React from 'react'
import styled from 'styled-components'
import { Appbar } from '../../components/Appbar'
import { Card } from '../../components/Card'
import { nfts } from '../../mock'
import { Empty } from './empty'

const Container = styled.main`
  display: flex;
  height: 100vh;
  flex-direction: column;
`

export const NFTs: React.FC = () => {
  return (
    <Container>
      <Appbar title="我的秘宝" />
      <Empty />
      {nfts.map((nft) => (
        <Card token={nft} key={nft.token_id} />
      ))}
    </Container>
  )
}
