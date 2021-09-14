import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import ShareNftBackground from '../../assets/img/share-bg/share-nft@3x.png'
import { TokenClass } from '../../models/class-list'
import { NFTDetail } from '../../models'
import { LazyLoadImage } from '../Image'
import { ReactComponent as PeopleSvg } from '../../assets/svg/people.svg'
import { Limited } from '../Limited'
import { useHtml2CanvasImageUrl } from './tools'

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
  z-index: -1;
`

const SharingNftPostContainer = styled.div`
  top: -100%;
  left: -100%;
  position: fixed;
  width: 323px;
  height: 484px;
  content-visibility: hidden;
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

export const NftPoster: React.FC<{
  tokenOrClass: TokenClass | NFTDetail
  onLoad?: (el: HTMLDivElement) => void
}> = ({ tokenOrClass, onLoad }) => {
  const imgRef = useRef<HTMLImageElement>(null)
  const posterRef = useRef<HTMLDivElement>(null)
  const issuerName = (tokenOrClass.issuer_info?.name ?? '').substring(0, 10)
  const cardImageUrl = useHtml2CanvasImageUrl(tokenOrClass.bg_image_url ?? '')
  const avatarImageUrl = useHtml2CanvasImageUrl(
    tokenOrClass.issuer_info?.avatar_url ?? ''
  )

  useEffect(() => {
    if (onLoad && posterRef.current) {
      onLoad(posterRef.current)
    }
  }, [onLoad, cardImageUrl, avatarImageUrl, posterRef.current])

  return (
    <SharingNftPostContainer ref={posterRef}>
      <BackgroundContainer>
        <img src={ShareNftBackground} alt="bg" ref={imgRef} />
      </BackgroundContainer>
      <IssuerContainer>
        <Issuer>
          <div className="avatar">
            <LazyLoadImage
              src={avatarImageUrl}
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
            src={cardImageUrl}
            alt=""
            className="img"
            crossOrigin="anonymous"
          />
          <div className="nft-name">{tokenOrClass.name}</div>
          <Issuer className="small">
            <div className="avatar">
              <LazyLoadImage
                src={avatarImageUrl}
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
  )
}
