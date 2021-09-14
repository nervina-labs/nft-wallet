import React, { useEffect, useRef } from 'react'
import { IssuerPosterData, PosterProps } from './poster.interface'
import {
  BackgroundImageContainer,
  IssuerContainer,
  PosterContainer,
} from './shareUtils'
import BackgroundImage from '../../assets/img/share-bg/share-issuer@3x.png'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { getImageForwardingsUrl } from '../../utils'
import { Gallery } from './gallery'

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
  const posterRef = useRef<HTMLDivElement>(null)
  const base64Strings = getImageForwardingsUrl(
    data.tokenClasses.slice(0, 5).map((tokenClass) => tokenClass.bg_image_url)
  )
  const avatarImageUrl = getImageForwardingsUrl(data.issuerInfo.avatar_url)
  const nftImages = base64Strings
  const [t] = useTranslation('translations')
  useEffect(() => {
    if (posterRef.current) {
      onLoad(posterRef.current)
    }
  }, [onLoad, avatarImageUrl, posterRef.current])

  return (
    <PosterContainer
      ref={posterRef}
      style={{
        width: '292px',
        height: '442px',
      }}
    >
      <BackgroundImageContainer>
        <img src={BackgroundImage} alt="bg" />
      </BackgroundImageContainer>
      <IssuerContainer
        height={21}
        style={{
          top: '23px',
          left: '23px',
          position: 'absolute',
          fontSize: '13px',
        }}
      >
        <div className="avatar">
          <img src={avatarImageUrl} alt="" width="21px" height="21px" />
        </div>
        <div className="issuer-name">{data.issuerInfo.name}</div>
      </IssuerContainer>

      <Gallery images={nftImages} />

      <IssuerInfoContainer>
        <div className="avatar">
          <img src={avatarImageUrl} alt="" width="30px" height="30px" />
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
