import React from 'react'
import styled from 'styled-components'
import { TokenClass } from '../../models/class-list'
import { Media } from './Media'
import { Limited } from '../../components/Limited'

const Container = styled.div`
  display: flex;
  flex: 1;
  .content {
    display: flex;
    flex-direction: column;
    flex: 1;
    margin: 8px 0;
    margin-left: 8px;
    justify-content: space-between;
    .name {
      font-size: 12px;
      color: #000000;
      display: -webkit-box;
      display: -moz-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
      -webkit-line-clamp: 1;
      line-clamp: 1;
      margin-bottom: 4px;
    }
  }
`

export interface NFTCardProps {
  token: TokenClass
}

export const NFTCard: React.FC<NFTCardProps> = ({ token }) => {
  return (
    <Container>
      <Media isPlayable hasCardBack src={token.bg_image_url} width={70} />
      <div className="content">
        <div className="name">{token.name}</div>
        <Limited
          count={token.total}
          fontSize={12}
          bold={false}
          color="#999999"
        />
      </div>
    </Container>
  )
}
