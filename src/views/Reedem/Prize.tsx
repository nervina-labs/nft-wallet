import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { LazyLoadImage } from '../../components/Image'
import { TokenClass } from '../../models/class-list'
import { RedeemDetailModel, RedeemType } from '../../models/redeem'
import { getImagePreviewUrl } from '../../utils'
import { RedeeemLabel } from './Label'
import FallbackImg from '../../assets/svg/fallback.svg'
import { NFTCard } from './NFTCard'
import { PhotoProvider } from 'react-photo-view'

export interface PriceCardProps {
  token: TokenClass
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

export const PriceCard: React.FC<PriceCardProps> = ({ token, count }) => {
  const [t] = useTranslation('translations')
  return (
    <PriceCardContainer>
      <NFTCard token={token} />
      <div className="count">{t('exchange.count', { count })}</div>
    </PriceCardContainer>
  )
}

export interface PriceProps {
  detail: RedeemDetailModel
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
  detail,
  showLabel = true,
  className,
}) => {
  return (
    <PriceContainer className={className}>
      {detail.type === RedeemType.Other ? (
        <OtherPrice detail={detail} showLabel={showLabel} />
      ) : (
        <NFTPrice detail={detail} showLabel={showLabel} />
      )}
    </PriceContainer>
  )
}

export const NFTPrice: React.FC<PriceProps> = ({ detail, showLabel }) => {
  const [t] = useTranslation('translations')
  return (
    <>
      {showLabel ? (
        <>
          <RedeeemLabel type={detail.type} />
          <div className="contain">
            {detail.type === RedeemType.NFT
              ? t('exchange.nft-prize')
              : t('exchange.blind-prize', { min: 2, max: 3 })}
          </div>
        </>
      ) : null}
      {detail.tokens.map((token) => {
        return <PriceCard token={token} count={3} key={token.uuid} />
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

export const OtherPrice: React.FC<PriceProps> = ({ detail, showLabel }) => {
  const [t] = useTranslation('translations')
  return (
    <OthderPriceContainer>
      {showLabel ? (
        <>
          <RedeeemLabel type={detail.type} />
          <div className="contain">{t('exchange.othder-prize')}</div>
        </>
      ) : null}
      <div className="price-title">{detail.priceTitle}</div>
      <div className="price-desc">{detail.priceDesciption}</div>
      <div className="imgs">
        <PhotoProvider maskClassName="preview-mask" toolbarRender={() => null}>
          {detail.priceImages.map((src) => {
            return (
              <div className="img">
                <LazyLoadImage
                  src={getImagePreviewUrl(src)}
                  dataSrc={src}
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
