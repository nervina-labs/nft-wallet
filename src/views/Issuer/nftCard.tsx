import React from 'react'
import { IssuerTokenClass } from '../../models/issuer'
import styled from 'styled-components'
import { LazyLoadImage } from '../../components/Image'
import { Limited } from '../../components/Limited'
import { Like } from '../../components/Like'

const NftCardContainer = styled.div`
  --bg-color: #fff;
  background-color: var(--bg-color);
  box-shadow: 0 2px 7px 1px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  overflow: hidden;

  .issuer {
    padding: 10px;
  }

  .nft-name {
    font-size: 15px;
    margin-bottom: 15px;
  }

  .nft-info {
    display: flex;
    justify-content: space-between;
  }
`

export const NftCard: React.FC<{
  token: IssuerTokenClass
  uuid: string
}> = ({ token, uuid }) => {
  const width = (window.innerWidth - 35) / 2

  return (
    <NftCardContainer>
      <LazyLoadImage
        cover
        src={token.bg_image_url}
        width={width}
        height={width}
      />
      <div className="issuer">
        <div className="nft-name">{token.name}</div>
        <div className="nft-info">
          <Limited
            count={token.total}
            bold={false}
            banned={false}
            color="#666"
          />
          <Like
            count={String(token.class_likes)}
            liked={token.class_liked}
            uuid={uuid}
          />
        </div>
      </div>
    </NftCardContainer>
  )
}
