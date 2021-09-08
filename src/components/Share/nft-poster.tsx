import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import ShareNftBackground from '../../assets/img/share-bg/share-nft@3x.png'
import { TokenClass } from '../../models/class-list'
import { NFTDetail } from '../../models'
import { LazyLoadImage } from '../Image'
import { ReactComponent as PeopleSvg } from '../../assets/svg/people.svg'
import { Limited } from '../Limited'
import classNames from 'classnames'
import html2canvas from 'html2canvas'
import * as imageToBase64 from 'image-to-base64'

const BaseContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  pointer-events: none;
  transition: opacity 0.2s;

  &.hide {
    opacity: 0;
  }

  @media (max-height: 736px) {
    transform: scale(0.9) translateY(-5%);
  }

  @media (max-height: 667px) {
    transform: scale(0.85) translateY(-10%);
  }

  @media (max-height: 568px) {
    transform: scale(0.7) translateY(-20%);
  }

  canvas {
    position: fixed;
  }
`

const BackgroundContainer = styled.div`
  width: 100%;
  height: auto;
  img {
    width: 100%;
    height: 100%;
  }
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
`

const SharingNftPostContainer = styled.div`
  top: 0;
  left: 0;
  position: absolute;
  width: 95%;
  height: auto;
  min-height: 493px;
  max-width: 328px;
  //content-visibility: hidden;
`

const IssuerContainer = styled.div`
  z-index: 2;
  width: 100%;
  position: absolute;
  top: 6%;
  left: 0;
  margin-left: 6%;
`

const Issuer = styled.div`
  --height: 35px;
  --width: 180px;
  width: 100%;
  display: flex;
  height: var(--height);
  &.small {
    --width: 100px;
    --height: 18px;
    margin-bottom: 6px;

    .issuer-name {
      font-weight: unset;
      font-size: 13px;
    }
  }

  .avatar {
    width: var(--height);
    height: var(--height);
    background: #fff;
    overflow: hidden;
    border-radius: 100%;
    margin-right: 10px;

    img,
    svg {
      width: var(--height);
      height: var(--height);
    }
  }

  .issuer-name {
    line-height: var(--height);
    height: var(--height);
    text-overflow: ellipsis;
    width: var(--width);
    white-space: nowrap;
    overflow: hidden;
    font-weight: 500;
    font-size: 14px;
  }
`

const CardContainer = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  top: 28%;
  left: 0;
  z-index: 2;
`

const Card = styled.div`
  --width: 50%;
  width: var(--width);
  background-color: #fff;
  border-radius: 10px;
  margin: auto;
  padding: 10px;
  box-sizing: border-box;

  .img {
    width: calc(var(--width) - 20px);
    height: calc(var(--width) - 20px);
    border-radius: 8px;
    margin: 0;
    object-fit: cover;
  }

  .nft-name {
    font-size: 14px;
    margin: 8px 0;
    font-weight: 500;
  }
`

export const SharingNftPoster: React.FC<{
  tokenOrClass: TokenClass | NFTDetail
  open?: boolean
}> = ({ tokenOrClass, open }) => {
  const imgRef = useRef<HTMLImageElement>(null)
  const posterRef = useRef<HTMLDivElement>(null)
  const baseRef = useRef<HTMLDivElement>(null)
  const issuerAvatar = tokenOrClass.issuer_info?.avatar_url
  const issuerName = tokenOrClass.issuer_info?.name
  const height = imgRef.current?.height ?? 328
  const width = imgRef.current?.width ?? 328

  const [imgSrc, setImgSrc] = useState('')

  useEffect(() => {
    setTimeout(() => {
      if (posterRef.current && baseRef.current) {
        // eslint-disable-next-line no-void
        void html2canvas(posterRef.current).then((canvas) => {
          setImgSrc(canvas.toDataURL('image/png'))
        })
      }
    }, 10000)
  }, [baseRef.current])

  const [avatarSrc, setAvatarSrc] = useState('')

  useEffect(() => {
    imageToBase64.then((base64) => {
      setAvatarSrc(base64)
    })
  }, [tokenOrClass])
  console.log(width)

  return (
    <BaseContainer className={classNames({ hide: !open })} ref={baseRef}>
      {imgSrc && <img src={imgSrc} alt="" />}

      <SharingNftPostContainer
        ref={posterRef}
        style={{
          height: `${height}px`,
        }}
      >
        <BackgroundContainer>
          <img src={ShareNftBackground} alt="bg" ref={imgRef} />
        </BackgroundContainer>
        <IssuerContainer>
          <Issuer>
            <div className="avatar">
              <LazyLoadImage
                src={avatarSrc}
                width={35}
                height={35}
                backup={<PeopleSvg />}
                variant="circle"
              />
            </div>
            <div className="issuer-name">{issuerName}</div>
          </Issuer>
        </IssuerContainer>

        <CardContainer>
          <Card>
            <img
              src={tokenOrClass.bg_image_url}
              alt=""
              className="img"
              style={{
                width: `${Math.floor(width * 0.5) - 20}px`,
                height: `${Math.floor(width * 0.5) - 20}px`,
              }}
            />
            <div className="nft-name">{tokenOrClass.name}</div>
            <Issuer className="small">
              <div className="avatar">
                <LazyLoadImage
                  src={issuerAvatar}
                  width={18}
                  height={18}
                  backup={<PeopleSvg />}
                  variant="circle"
                />
              </div>
              <div className="issuer-name">{issuerName}</div>
            </Issuer>
            <Limited
              count={tokenOrClass.total}
              sn={(tokenOrClass as NFTDetail).n_token_id}
            />
          </Card>
        </CardContainer>
      </SharingNftPostContainer>
    </BaseContainer>
  )
}
