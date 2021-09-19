import React, { useMemo, useRef } from 'react'
import { HolderPosterData, PosterProps } from '../poster.interface'
import {
  BackgroundImage,
  UserContainer,
  PosterContainer,
} from '../components/layout'
import BackgroundImagePath from '../../../assets/img/share-bg/share-holder@3x.png'
import { getImagePreviewUrl } from '../../../utils'
import { Gallery } from '../components/gallery'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { ShareAvatar } from '../components/avatar'
import PeopleImage from '../../../assets/img/people.png'
import { useUrlToBase64, usePosterLoader } from '../hooks'
import { useQrcode } from '../hooks/useQrcode'

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

export const HolderPoster: React.FC<PosterProps<HolderPosterData>> = ({
  data,
  onLoad,
  shareUrl,
}) => {
  const [t] = useTranslation('translations')
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
  } = useUrlToBase64(nftImageUrls, {
    toBlob: true,
  })
  const {
    data: avatarImageUrlBase64,
    isLoading: avatarImageLoading,
  } = useUrlToBase64(data.userInfo.avatar_url, {
    fallbackImg: PeopleImage,
    toBlob: true,
  })
  const { qrcodeSrc, isLoading: QrcodeLoading } = useQrcode(shareUrl)
  const isLoading = nftImageLoading || avatarImageLoading || QrcodeLoading
  usePosterLoader(posterRef.current, onLoad, isLoading)

  return (
    <PosterContainer
      ref={posterRef}
      style={{
        width: '292px',
        height: '519px',
      }}
    >
      <BackgroundImage src={BackgroundImagePath} />
      <UserContainer
        avatarSize={21}
        style={{
          top: '46px',
          left: '33px',
          position: 'absolute',
          fontSize: '13px',
        }}
      >
        {avatarImageUrlBase64 && (
          <ShareAvatar
            avatar={avatarImageUrlBase64}
            avatarType={data.userInfo.avatar_type}
            size={21}
          />
        )}
        <div className="issuer-name">{data.userInfo.nickname}</div>
      </UserContainer>

      <ContentContainer>
        {nftImageUrlsBase64 && <Gallery images={nftImageUrlsBase64} />}
        <div className="avatar">
          {avatarImageUrlBase64 && (
            <ShareAvatar
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

      {qrcodeSrc && (
        <img
          className="qrcode"
          src={qrcodeSrc}
          alt="qrcode"
          style={{
            bottom: '40px',
          }}
        />
      )}
    </PosterContainer>
  )
}
