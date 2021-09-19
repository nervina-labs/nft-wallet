import React, { useMemo, useRef } from 'react'
import { IssuerPosterData, PosterProps } from './poster.interface'
import {
  BackgroundImage,
  UserContainer,
  PosterContainer,
  usePosterLoader,
  useUrlToBase64,
} from './shareUtils'
import BackgroundImagePath from '../../assets/img/share-bg/share-issuer@3x.png'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { getImagePreviewUrl } from '../../utils'
import { Gallery } from './gallery'
import { ShareAvatar } from './avatar'
import PeopleImage from '../../assets/img/people.png'

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
  }
`

export const IssuerPoster: React.FC<PosterProps<IssuerPosterData>> = ({
  data,
  onLoad,
}) => {
  const [t] = useTranslation('translations')
  const posterRef = useRef<HTMLDivElement>(null)
  const nftImageUrls = useMemo(() => {
    return data.tokenClasses.slice(0, 5).map((token) => {
      if (!token.bg_image_url) {
        return undefined
      }
      const url = new URL(token.bg_image_url)
      return getImagePreviewUrl(`${url.origin}${url.pathname}`)
    })
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
  const isLoading = avatarImageLoading || nftImageLoading
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
          <ShareAvatar avatar={avatarImageUrlBase64} size={21} />
        )}
        <div className="issuer-name">{data.issuerInfo.name}</div>
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
            <ShareAvatar avatar={avatarImageUrlBase64} size={30} />
          )}
        </div>
        <div className="name">{data.issuerInfo.name}</div>
        <div className="follow-and-likes">
          {t('issuer.follower')}: {data.issuerInfo.issuer_follows}
          {'   |   '}
          {t('issuer.like')}: {data.issuerInfo.issuer_likes}
        </div>
        <div className="description">{data.issuerInfo.description}</div>
      </IssuerInfoContainer>
    </PosterContainer>
  )
}
