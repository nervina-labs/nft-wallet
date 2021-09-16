import React, { useEffect, useRef, useState } from 'react'
import { HolderPosterData, PosterProps } from './poster.interface'
import {
  BackgroundImageContainer,
  IssuerContainer,
  PosterContainer,
  useLoaded,
  useUrlToBase64,
} from './shareUtils'
import BackgroundImage from '../../assets/img/share-bg/share-holder@3x.png'
import { getImageForwardingsUrl, getImagePreviewUrl } from '../../utils'
import { Gallery } from './gallery'
import { HolderAvatar } from '../HolderAvatar'
import styled from 'styled-components'
import { AvatarType } from '../../models/user'

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

export const HolderAvatarBase64: React.FC<{
  avatar: string
  avatarType: AvatarType
  size: number
  onLoaded?: () => void
}> = ({ avatar, avatarType = AvatarType.Image, size = 44, onLoaded }) => {
  const { data, isLoading } = useUrlToBase64(avatar)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!isLoading && onLoaded && !loaded) {
      onLoaded()
      setLoaded(true)
      console.log('loaded')
    }
  }, [isLoading, onLoaded, loaded])

  return <HolderAvatar avatar={data} avatarType={avatarType} size={21} />
}

export const HolderPoster: React.FC<PosterProps<HolderPosterData>> = ({
  data,
  onLoad,
}) => {
  const posterRef = useRef<HTMLDivElement>(null)
  const avatarImageUrl = getImageForwardingsUrl(data.userInfo.avatar_url)
  const [loaded, setLoaded] = useState(false)
  const addLoadedCount = useLoaded(2, () => setLoaded(true))
  const base64Strings = data.tokens.slice(0, 5).map((token) => {
    if (!token.class_bg_image_url) {
      return undefined
    }
    const url = new URL(token.class_bg_image_url)
    return getImagePreviewUrl(`${url.origin}${url.pathname}`)
  })

  useEffect(() => {
    if (posterRef.current && loaded) {
      onLoad(posterRef.current)
    }
  }, [onLoad, posterRef.current, loaded])

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
        <div className="avatar">
          <HolderAvatarBase64
            avatar={avatarImageUrl}
            avatarType={data.userInfo.avatar_type}
            size={21}
            onLoaded={addLoadedCount}
          />
        </div>
        <div className="issuer-name">{data.userInfo.nickname}</div>
      </IssuerContainer>

      <ContentContainer>
        <Gallery images={base64Strings} onLoaded={addLoadedCount} />
        <div className="avatar">
          <HolderAvatar
            avatar={avatarImageUrl}
            avatarType={data.userInfo.avatar_type}
            size={45}
          />
        </div>
        <div className="text bold">{data.userInfo.nickname}</div>
        <div className="text">已收藏秘宝: {data.tokenLength}</div>
      </ContentContainer>
    </PosterContainer>
  )
}
