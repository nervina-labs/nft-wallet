/* eslint-disable */
import React from 'react'
import { IssuerTokenClass } from '../../models/issuer'
import styled from 'styled-components'
import { LazyLoadImage } from '../../components/Image'
import { Limited } from '../../components/Limited'
import { Like } from '../../components/Like'
import FallbackImg from '../../assets/img/card-fallback.png'
import { ReactComponent as CardBackIcon } from '../../assets/svg/card-back.svg'
import { useHistory } from 'react-router-dom'
import { getImagePreviewUrl } from '../../utils'
import { NftType } from '../../models'
import { ReactComponent as PlayerSvg } from '../../assets/svg/player.svg'

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

  .img {
    pointer-events: none;
    user-select: none;
    position: relative;
    img {
      width: 100%;
    }
    .player {
      position: absolute;
      bottom: 10px;
      right: 10px;
    }
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
  const history = useHistory()
  return (
    <NftCardContainer
      onClick={() => {
        history.push(`/class/${token.uuid}`)
      }}
    >
      <div className="img">
        <LazyLoadImage
          cover
          src={getImagePreviewUrl(token.bg_image_url)}
          dataSrc={token.bg_image_url}
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
        {(token.renderer_type === NftType.Video ||
          token.renderer_type === NftType.Audio) && (
          <span className="player">
            <PlayerSvg />
          </span>
        )}
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
            uuid={token.uuid}
          />
        </div>
      </div>
    </NftCardContainer>
  )
}
