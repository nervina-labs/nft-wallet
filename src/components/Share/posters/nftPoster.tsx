import React, { useMemo, useRef } from 'react'
import styled from 'styled-components'
import BackgroundImagePath from '../../../assets/img/share-bg/share-nft@3x.png'
import { NFTDetail, NftType } from '../../../models'
import PeopleImage from '../../../assets/img/people.png'
import { Limited } from '../../Limited'
import {
  BackgroundImage,
  PosterContainer,
  UserContainer,
} from '../components/layout'
import { NftPosterData, PosterProps } from './poster.interface'
import { ShareAvatar } from '../components/avatar'
import { usePosterLoader, useTextEllipsis } from '../hooks'
import { useQrcode } from '../../../hooks/useQrcode'
import PlayerPath from '../../../assets/img/player.png'
import CardBackPath from '../../../assets/svg/card-back.svg'
import { CardTags } from '../../Card/CardTags'
import NFT3dSvg from '../../../assets/svg/3D.svg'
import { useUrlToBase64 } from '../../../hooks/useUrlToBase64'
import { ReactComponent as WeiboSvg } from '../../../assets/svg/weibo.svg'

const CardContainer = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  top: 28%;
  left: 0;
  z-index: 2;
`

const Card = styled.div`
  --width: 182px;
  width: var(--width);
  background-color: #fff;
  border-radius: 10px;
  margin: auto;
  padding: 10px;
  box-sizing: border-box;

  .img {
    width: calc(var(--width) - 20px);
    height: calc(var(--width) - 20px);
    margin: 0;
    object-fit: cover;
  }

  .player {
    position: absolute;
    right: 6px;
    bottom: 12px;
    width: 20px;
    height: auto;
  }

  .card-back {
    position: absolute;
    top: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    border-bottom-left-radius: 8px;
    padding: 3px;
    width: 24px;
  }

  .img-container {
    position: relative;
    overflow: hidden;
    border-radius: 8px;
  }

  .nft-name {
    font-size: 14px;
    margin: 8px 0;
    font-weight: 500;
  }
`

export const NftPoster: React.FC<PosterProps<NftPosterData>> = ({
  data,
  onLoad,
  shareUrl,
}) => {
  const posterRef = useRef<HTMLDivElement>(null)
  const [issuerName] = useTextEllipsis(data.issuer_info?.name ?? '', 100)
  const [nftName] = useTextEllipsis(data.name ?? '', 150)
  const { data: cardImageUrl, isLoading: cardImageLoading } = useUrlToBase64(
    data.bg_image_url,
    {
      toBlob: true,
      usePreviewUrl: true,
    }
  )
  const {
    data: avatarImageUrl,
    isLoading: avatarImageLoading,
  } = useUrlToBase64(data.issuer_info?.avatar_url, {
    fallbackImg: PeopleImage,
    toBlob: true,
  })
  const { qrcodeSrc, isLoading: QrcodeLoading } = useQrcode(shareUrl)
  const isLoading = cardImageLoading || avatarImageLoading || QrcodeLoading
  usePosterLoader(posterRef.current, onLoad, isLoading)
  const hasPlayer =
    data.renderer_type === NftType.Video || data.renderer_type === NftType.Audio
  const hasCardBack = data.card_back_content_exist
  const tags = useMemo(() => {
    const icons = []
    if (hasCardBack) {
      icons.push(CardBackPath)
    }
    if (data.renderer_type === NftType._3D) {
      icons.push(NFT3dSvg)
    }
    return icons
  }, [hasCardBack, data.renderer_type])

  return (
    <PosterContainer ref={posterRef}>
      <BackgroundImage src={BackgroundImagePath} />
      <UserContainer
        avatarSize={35}
        style={{ top: '33px', left: '22px', position: 'absolute' }}
      >
        {avatarImageUrl && <ShareAvatar avatar={avatarImageUrl} size={35} />}
        <div className="issuer-name">
          {issuerName}
          {data?.verified_info?.is_verified && (
            <WeiboSvg className="issuer-verify" />
          )}
        </div>
      </UserContainer>

      <CardContainer>
        <Card>
          <div className="img-container">
            <img
              src={cardImageUrl}
              alt=""
              className="img"
              crossOrigin="anonymous"
            />
            <CardTags icons={tags} />
            {hasPlayer && (
              <img className="player" src={PlayerPath} alt="player" />
            )}
          </div>
          <div className="nft-name">{nftName}</div>
          <UserContainer avatarSize={18} style={{ fontSize: '12px' }}>
            {avatarImageUrl && (
              <ShareAvatar avatar={avatarImageUrl} size={18} />
            )}
            <div className="issuer-name">
              {issuerName}
              {data?.verified_info?.is_verified && (
                <WeiboSvg className="issuer-verify" />
              )}
            </div>
          </UserContainer>
          <Limited count={data.total} sn={(data as NFTDetail).n_token_id} />
        </Card>
      </CardContainer>
      {qrcodeSrc && <img className="qrcode" src={qrcodeSrc} alt="qrcode" />}
    </PosterContainer>
  )
}
