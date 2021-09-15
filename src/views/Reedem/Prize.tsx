import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { LazyLoadImage } from '../../components/Image'
import { RedeemType, RewardInfo } from '../../models/redeem'
import { getImagePreviewUrl } from '../../utils'
import { RedeeemLabel } from './Label'
import FallbackImg from '../../assets/svg/fallback.svg'
import { NFTCard } from './NFTCard'
import { PhotoProvider } from 'react-photo-view'

export interface PriceCardProps {
  info: RewardInfo
  count: number
}

const PriceCardContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  margin-right: 6px;

  .count {
    font-size: 12px;
    margin-left: 4px;
  }
`

export const PriceCard: React.FC<PriceCardProps> = ({ info, count }) => {
  const [t] = useTranslation('translations')
  return (
    <PriceCardContainer>
      <NFTCard info={info} />
      <div className="count">{t('exchange.count', { count })}</div>
    </PriceCardContainer>
  )
}

export interface PriceProps {
  prizes: RewardInfo[]
  type: RedeemType
  showLabel?: boolean
  className?: string
}

const PriceContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  padding-bottom: 0;
  .contain {
    background: #fff5c5;
    margin: 10px 0;
    font-size: 12px;
    padding: 8px;
  }
`

export const Prize: React.FC<PriceProps> = ({
  prizes,
  type,
  showLabel = true,
  className,
}) => {
  return (
    <PriceContainer className={className}>
      {type === RedeemType.Other ? (
        <OtherPrice prizes={prizes} type={type} showLabel={showLabel} />
      ) : (
        <NFTPrice prizes={prizes} type={type} showLabel={showLabel} />
      )}
    </PriceContainer>
  )
}

export const NFTPrice: React.FC<PriceProps> = ({ prizes, type, showLabel }) => {
  const [t] = useTranslation('translations')
  return (
    <>
      {showLabel ? (
        <>
          <RedeeemLabel type={type} />
          <div className="contain">
            {type === RedeemType.NFT
              ? t('exchange.nft-prize')
              : t('exchange.blind-prize', { min: 2, max: 3 })}
          </div>
        </>
      ) : null}
      {prizes.map((info, i) => {
        return <PriceCard info={info} count={3} key={i} />
      })}
    </>
  )
}

const OthderPriceContainer = styled.div`
  .price-title {
    font-size: 14px;
    margin-bottom: 8px;
    font-weight: normal;
  }
  .price-desc {
    color: #666666;
    font-size: 12px;
    margin-bottom: 16px;
  }
  .imgs {
    display: flex;
    align-items: center;
    overflow-x: auto;
    .img {
      margin-right: 8px;
      border-radius: 8px;
      min-width: 140px;
    }
  }
`

export const OtherPrice: React.FC<PriceProps> = ({
  prizes,
  type,
  showLabel,
}) => {
  const [t] = useTranslation('translations')
  return (
    <OthderPriceContainer>
      {showLabel ? (
        <>
          <RedeeemLabel type={type} />
          <div className="contain">{t('exchange.othder-prize')}</div>
        </>
      ) : null}
      <div className="price-title">{'detail.priceTitle'}</div>
      <div className="price-desc">{'detail.priceDesciption'}</div>
      <div className="imgs">
        <PhotoProvider maskClassName="preview-mask" toolbarRender={() => null}>
          {prizes.map((p) => {
            return (
              <div className="img">
                <LazyLoadImage
                  src={getImagePreviewUrl(p.class_bg_image_url)}
                  dataSrc={p.class_bg_image_url}
                  enablePreview
                  width={140}
                  height={140}
                  skeletonStyle={{ borderRadius: '8px' }}
                  cover={true}
                  imageStyle={{ borderRadius: '8px' }}
                  disableContextMenu={true}
                  backup={
                    <LazyLoadImage
                      skeletonStyle={{ borderRadius: '8px' }}
                      width={140}
                      cover
                      height={140}
                      src={FallbackImg}
                    />
                  }
                />
              </div>
            )
          })}
        </PhotoProvider>
      </div>
    </OthderPriceContainer>
  )
}
