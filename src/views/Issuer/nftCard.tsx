import React from 'react'
import { IssuerTokenClass } from '../../models/issuer'
import styled from 'styled-components'
import { Limited } from '../../components/Limited'
import { Like } from '../../components/Like'
import { useHistory } from 'react-router-dom'
import { NftType } from '../../models'
import { CardImage } from '../../components/Card/CardImage'

const NftCardContainer = styled.div`
  --bg-color: #fff;
  background-color: var(--bg-color);
  box-shadow: 0 2px 7px 1px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  cursor: pointer;

  a {
    color: #000;
    text-decoration: none !important;
  }

  .issuer {
    padding: 10px;
    overflow: hidden;
    cursor: pointer;
  }

  .nft-name {
    font-size: 15px;
    margin-bottom: 15px;
  }

  .nft-info {
    display: flex;
    justify-content: space-between;
    user-select: none;
  }
`

export const NftCard: React.FC<{
  token: IssuerTokenClass
  uuid: string
  imgSize: number
}> = ({ token, uuid, imgSize }) => {
  const history = useHistory()
  return (
    <NftCardContainer
      onClick={() => {
        history.push(`/class/${token.uuid}`)
      }}
    >
      <CardImage
        src={token.bg_image_url}
        width={imgSize}
        height={imgSize}
        isPlayable={
          token.renderer_type === NftType.Video ||
          token.renderer_type === NftType.Audio
        }
        hasCardBack={token.card_back_content_exist}
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
            uuid={token.uuid}
          />
        </div>
      </div>
    </NftCardContainer>
  )
}
