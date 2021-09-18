import React, { useEffect, useMemo, useRef } from 'react'
import { HolderPosterData, PosterProps } from './poster.interface'
import {
  BackgroundImageContainer,
  IssuerContainer,
  PosterContainer,
  useUrlsToBase64,
} from './shareUtils'
import BackgroundImage from '../../assets/img/share-bg/share-holder@3x.png'
import { getImagePreviewUrl } from '../../utils'
import { Gallery } from './gallery'
import styled from 'styled-components'
import { AvatarType } from '../../models/user'
import { useTranslation } from 'react-i18next'
import classnames from 'classnames'
import NftAvatarDiamonds from '../../assets/svg/nft-avatar-diamonds.svg'

const ContentContainer = styled.div`
  background-color: #fff;
  width: 235px;
  left: 29px;
  top: 112px;
  position: absolute;
  border-radius: 10px;
  padding: 10px;
  box-sizing: border-box;
  .avatar {
    display: flex;
    justify-content: center;
    width: 100%;
    position: relative;
    top: -10px;
    z-index: 3;
  }
  .text {
    font-size: 12px;
    text-align: center;
    margin-bottom: 4px;
  }
  .text.bold {
    font-weight: 500;
  }
`

const HolderAvatarBase64Container = styled.div`
  --size: ${(props: { size?: number }) =>
    props.size ? `${props.size}px` : '40px'};
  padding: 2px;
  position: relative;
  display: flex;
  width: var(--size);
  height: var(--size);
  .img {
    width: 100%;
    height: 100%;
    border-radius: 100%;
    object-fit: cover;
    margin: auto;
    position: relative;
    z-index: 1;
  }
  &.nft:before {
    content: '';
    position: absolute;
    top: -1px;
    left: -1px;
    width: calc(100% + 2px);
    height: calc(100% + 2px);
    border-radius: 100%;
    z-index: 0;
    background-image: linear-gradient(
      60deg,
      rgb(205, 130, 15),
      rgb(250, 190, 60),
      rgb(205, 130, 15),
      rgb(250, 190, 60),
      rgb(205, 130, 15),
      rgb(250, 190, 60)
    );
    background-size: 300%, 300%;
  }
  &.nft:after {
    content: '';
    background: url('${NftAvatarDiamonds}') no-repeat;
    background-size: 100%, 100%;
    display: block;
    top: 0;
    right: 0;
    width: calc(var(--size) / 3);
    height: calc(var(--size) / 3);
    position: absolute;
    z-index: 2;
  }
`

export const HolderAvatarBase64: React.FC<{
  avatar?: string
  avatarType: AvatarType
  size: number
}> = ({ avatar, avatarType = AvatarType.Image, size = 44 }) => {
  return (
    <HolderAvatarBase64Container
      className={classnames({
        nft: avatarType === AvatarType.Token,
      })}
      size={size}
    >
      <img src={avatar} alt={avatarType} className="img" />
    </HolderAvatarBase64Container>
  )
}

export const HolderPoster: React.FC<PosterProps<HolderPosterData>> = ({
  data,
  onLoad,
}) => {
  const { t } = useTranslation('translations')
  const posterRef = useRef<HTMLDivElement>(null)
  const nftImageUrls = useMemo(() => {
    return data.tokens.slice(0, 5).map((token) => {
      if (!token.class_bg_image_url) {
        return undefined
      }
      const url = new URL(token.class_bg_image_url)
      return getImagePreviewUrl(`${url.origin}${url.pathname}`)
    })
  }, [data.tokens])
  const {
    data: nftImageUrlsBase64,
    isLoading: nftImageLoading,
  } = useUrlsToBase64(nftImageUrls)
  const {
    data: avatarImageUrlsBase64,
    isLoading: avatarImageLoading,
  } = useUrlsToBase64([data.userInfo.avatar_url])
  const isLoading = nftImageLoading || avatarImageLoading
  const avatarImageUrlBase64 = avatarImageUrlsBase64
    ? avatarImageUrlsBase64[0]
    : undefined

  useEffect(() => {
    if (posterRef.current && !isLoading) {
      onLoad(posterRef.current)
    }
  }, [onLoad, posterRef.current, isLoading])

  return (
    <PosterContainer
      ref={posterRef}
      style={{
        width: '292px',
        height: '519px',
      }}
    >
      <BackgroundImageContainer>
        <img src={BackgroundImage} alt="bg" />
      </BackgroundImageContainer>

      <IssuerContainer
        height={21}
        style={{
          top: '46px',
          left: '33px',
          position: 'absolute',
          fontSize: '13px',
        }}
      >
        {avatarImageUrlBase64 && (
          <HolderAvatarBase64
            avatar={avatarImageUrlBase64}
            avatarType={data.userInfo.avatar_type}
            size={21}
          />
        )}
        <div className="issuer-name">{data.userInfo.nickname}</div>
      </IssuerContainer>

      <ContentContainer>
        {nftImageUrlsBase64 && <Gallery images={nftImageUrlsBase64} />}
        <div className="avatar">
          {avatarImageUrlBase64 && (
            <HolderAvatarBase64
              avatar={avatarImageUrlBase64}
              avatarType={data.userInfo.avatar_type}
              size={45}
            />
          )}
        </div>
        <div className="text bold">{data.userInfo.nickname}</div>
        <div className="text">
          {t('common.share.collected-nft')}: {data.tokenLength}
        </div>
      </ContentContainer>
    </PosterContainer>
  )
}
