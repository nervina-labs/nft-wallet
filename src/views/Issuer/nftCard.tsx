import React from 'react'
import { IssuerTokenClass } from '../../models/issuer'
import styled from 'styled-components'
import { LazyLoadImage } from '../../components/Image'
import { Limited } from '../../components/Limited'
import { Like } from '../../components/Like'
import FallbackImg from '../../assets/img/card-fallback.png'
import { ReactComponent as CardBackIcon } from '../../assets/svg/card-back.svg'

const NftCardContainer = styled.div`
  --bg-color: #fff;
  background-color: var(--bg-color);
  box-shadow: 0 2px 7px 1px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  overflow: hidden;
  position: relative;

  .img {
    pointer-events: none;
    user-select: none;
    img {
      width: 100%;
    }
  }

  .issuer {
    padding: 10px;
    overflow: hidden;
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

  .card-back {
    position: absolute;
    top: 0;
    right: 0;
    width: 25px;
    height: auto;
    background-color: rgba(0, 0, 0, 0.5);
    padding: 5px;
    border-radius: 0 0 0 8px;
  }
`

export const NftCard: React.FC<{
  token: IssuerTokenClass
  uuid: string
  imgSize: number
}> = ({ token, uuid, imgSize }) => {
  return (
    <NftCardContainer>
      <div className="img">
        <LazyLoadImage
          cover
          src={token.bg_image_url}
          width={imgSize}
          height={imgSize}
          backup={
            <LazyLoadImage
              skeletonStyle={{ borderRadius: '8px' }}
              width={imgSize}
              height={imgSize}
              cover
              src={FallbackImg}
            />
          }
        />
      </div>
      {token.card_back_content_exist && <CardBackIcon className="card-back" />}
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
