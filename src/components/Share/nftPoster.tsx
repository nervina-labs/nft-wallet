import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import BackgroundImage from '../../assets/img/share-bg/share-nft@3x.png'
import { NFTDetail } from '../../models'
import { LazyLoadImage } from '../Image'
import { ReactComponent as PeopleSvg } from '../../assets/svg/people.svg'
import { Limited } from '../Limited'
import {
  BackgroundImageContainer,
  IssuerContainer,
  PosterContainer,
} from './shareUtils'
import { NftPosterData, PosterProps } from './poster.interface'

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

export const NftPoster: React.FC<PosterProps<NftPosterData>> = ({
  data,
  onLoad,
}) => {
  const posterRef = useRef<HTMLDivElement>(null)
  const issuerName = (data.issuer_info?.name ?? '').substring(0, 10)
  const [loadedCount, serLoadedCount] = useState(0)
  const [cardImageUrl, avatarImageUrl] = [
    data.bg_image_url ?? '',
    data.issuer_info?.avatar_url ?? '',
  ]

  useEffect(() => {
    if (posterRef.current && loadedCount >= 2) {
      onLoad(posterRef.current)
    }
  }, [onLoad, cardImageUrl, avatarImageUrl, loadedCount])

  return (
    <PosterContainer ref={posterRef}>
      <BackgroundImageContainer>
        <img src={BackgroundImage} alt="bg" />
      </BackgroundImageContainer>
      <IssuerContainer
        style={{ top: '33px', left: '22px', position: 'absolute' }}
      >
        <div className="avatar">
          <LazyLoadImage
            src={avatarImageUrl}
            width={35}
            height={35}
            backup={<PeopleSvg />}
            onLoaded={() => serLoadedCount(loadedCount + 1)}
            variant="circle"
          />
        </div>
        <div className="issuer-name">{issuerName}</div>
      </IssuerContainer>

      <CardContainer>
        <Card>
          <img
            src={cardImageUrl}
            alt=""
            className="img"
            crossOrigin="anonymous"
          />
          <div className="nft-name">{data.name}</div>
          <IssuerContainer height={18} style={{ fontSize: '12px' }}>
            <div className="avatar">
              <LazyLoadImage
                src={avatarImageUrl}
                width={18}
                height={18}
                onLoaded={() => serLoadedCount(loadedCount + 1)}
                backup={<PeopleSvg />}
                variant="circle"
              />
            </div>
            <div className="issuer-name">{issuerName}</div>
          </IssuerContainer>
          <Limited count={data.total} sn={(data as NFTDetail).n_token_id} />
        </Card>
      </CardContainer>
    </PosterContainer>
  )
}
