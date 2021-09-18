import React, { useRef } from 'react'
import styled from 'styled-components'
import BackgroundImagePath from '../../assets/img/share-bg/share-nft@3x.png'
import { NFTDetail } from '../../models'
import PeopleImage from '../../assets/svg/people.svg'
import { Limited } from '../Limited'
import {
  BackgroundImage,
  IssuerContainer,
  PosterContainer,
  usePosterLoader,
  useUrlToBase64,
} from './shareUtils'
import { NftPosterData, PosterProps } from './poster.interface'
import { ShareAvatar } from './avatar'

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
  const { data: cardImageUrl, isLoading: cardImageLoading } = useUrlToBase64(
    data.bg_image_url
  )
  const {
    data: avatarImageUrl,
    isLoading: avatarImageLoading,
  } = useUrlToBase64(data.issuer_info?.avatar_url, { fallbackImg: PeopleImage })
  const isLoading = cardImageLoading || avatarImageLoading
  usePosterLoader(posterRef.current, onLoad, isLoading)

  return (
    <PosterContainer ref={posterRef}>
      <BackgroundImage src={BackgroundImagePath} />
      <IssuerContainer
        style={{ top: '33px', left: '22px', position: 'absolute' }}
      >
        <div className="avatar">
          {avatarImageUrl && <ShareAvatar avatar={avatarImageUrl} size={35} />}
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
              {avatarImageUrl && (
                <ShareAvatar avatar={avatarImageUrl} size={18} />
              )}
            </div>
            <div className="issuer-name">{issuerName}</div>
          </IssuerContainer>
          <Limited count={data.total} sn={(data as NFTDetail).n_token_id} />
        </Card>
      </CardContainer>
    </PosterContainer>
  )
}
