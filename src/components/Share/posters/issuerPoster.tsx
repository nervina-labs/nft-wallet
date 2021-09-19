import React, { useMemo, useRef } from 'react'
import {
  BackgroundImage,
  UserContainer,
  PosterContainer,
} from '../components/layout'
import BackgroundImagePath from '../../../assets/img/share-bg/share-issuer@3x.png'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { Gallery } from '../components/gallery'
import { ShareAvatar } from '../components/avatar'
import PeopleImage from '../../../assets/img/people.png'
import { useUrlToBase64, usePosterLoader, useTextEllipsis } from '../hooks'
import { useQrcode } from '../hooks/useQrcode'
import { IssuerPosterData, PosterProps } from './poster.interface'

const IssuerInfoContainer = styled.div`
  position: absolute;
  width: calc(100% - 46px);
  top: 255px;
  left: 23px;
  z-index: 2;

  .avatar {
    width: 100%;
    display: flex;
    justify-content: center;
    img {
      object-fit: cover;
      background-color: #fff;
      border-radius: 100%;
    }
  }

  .name {
    width: 100%;
    text-align: center;
    font-weight: 500;
    font-size: 14px;
    margin-bottom: 4px;
  }

  .follow-and-likes {
    font-weight: 300;
    font-size: 12px;
    text-align: center;
    white-space: pre;
    margin-bottom: 10px;
  }

  .description {
    width: 100%;
    height: 36px;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    font-weight: 300;
    font-size: 12px;
    line-height: 17px;
    white-space: pre-wrap;
  }
`

export const IssuerPoster: React.FC<PosterProps<IssuerPosterData>> = ({
  data,
  onLoad,
  shareUrl,
}) => {
  const [t] = useTranslation('translations')
  const posterRef = useRef<HTMLDivElement>(null)
  const [issuerName] = useTextEllipsis(data.issuerInfo?.name ?? '', 100)
  const [description] = useTextEllipsis(data.issuerInfo?.description ?? '', 500)
  const nftImageUrls = useMemo(() => {
    return data.tokenClasses.slice(0, 5).map((token) => token.bg_image_url)
  }, [data.tokenClasses])
  const {
    data: avatarImageUrlBase64,
    isLoading: avatarImageLoading,
  } = useUrlToBase64(data.issuerInfo.avatar_url, {
    fallbackImg: PeopleImage,
    toBlob: true,
  })
  const {
    data: nftImageUrlsBase64,
    isLoading: nftImageLoading,
  } = useUrlToBase64(nftImageUrls, {
    toBlob: true,
  })
  const { qrcodeSrc, isLoading: QrcodeLoading } = useQrcode(shareUrl)
  const isLoading = avatarImageLoading || nftImageLoading || QrcodeLoading
  usePosterLoader(posterRef.current, onLoad, isLoading)

  return (
    <PosterContainer
      ref={posterRef}
      style={{
        width: '292px',
        height: '442px',
      }}
    >
      <BackgroundImage src={BackgroundImagePath} />
      <UserContainer
        avatarSize={21}
        style={{
          top: '23px',
          left: '23px',
          position: 'absolute',
          fontSize: '13px',
        }}
      >
        {avatarImageUrlBase64 && (
          <ShareAvatar
            avatar={avatarImageUrlBase64}
            size={21}
            verify={data.issuerInfo.verified_info?.is_verified}
          />
        )}
        <div className="issuer-name">{issuerName}</div>
      </UserContainer>

      {nftImageUrlsBase64 && (
        <Gallery
          images={nftImageUrlsBase64}
          style={{
            width: 'calc(100% - 46px)',
            position: 'absolute',
            top: '83px',
            left: '23px',
            backgroundColor: '#fff',
          }}
        />
      )}

      <IssuerInfoContainer>
        <div className="avatar">
          {avatarImageUrlBase64 && (
            <ShareAvatar
              avatar={avatarImageUrlBase64}
              size={30}
              verify={data.issuerInfo.verified_info?.is_verified}
            />
          )}
        </div>
        <div className="name">{issuerName}</div>
        <div className="follow-and-likes">
          {t('issuer.follower')}: {data.issuerInfo.issuer_follows}
          {'   |   '}
          {t('issuer.like')}: {data.issuerInfo.issuer_likes}
        </div>
        <div className="description">{description}</div>
      </IssuerInfoContainer>

      {qrcodeSrc && (
        <img
          className="qrcode"
          src={qrcodeSrc}
          alt="qrcode"
          style={{ bottom: '13px' }}
        />
      )}
    </PosterContainer>
  )
}
