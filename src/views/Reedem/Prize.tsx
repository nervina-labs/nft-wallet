/* eslint-disable @typescript-eslint/indent */
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { LazyLoadImage } from '../../components/Image'
import {
  BlindRewardInfo,
  CustomRewardInfo,
  isCustomReward,
  isNormalReward,
  NormalRewardInfo,
  RedeemType,
  RewardInfo,
} from '../../models/redeem'
import { getImagePreviewUrl } from '../../utils'
import { RedeemLabel } from './Label'
import FallbackImg from '../../assets/svg/fallback.svg'
import { NFTCard } from './NFTCard'
import { Preview, useDisclosure } from '@mibao-ui/components'

export interface PriceCardProps {
  info: RewardInfo
  count: number
}

export interface NftPriceCardProps {
  info: NormalRewardInfo
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

export const PriceCard: React.FC<NftPriceCardProps> = ({ info, count }) => {
  const [t] = useTranslation('translations')
  return (
    <PriceCardContainer>
      <NFTCard info={info} />
      <div className="count">{t('exchange.count', { count })}</div>
    </PriceCardContainer>
  )
}

export interface PriceProps {
  prizes: RewardInfo
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
      {isCustomReward(prizes) ? (
        <OtherPrice prizes={prizes} type={type} showLabel={showLabel} />
      ) : (
        <NFTPrice prizes={prizes} type={type} showLabel={showLabel} />
      )}
    </PriceContainer>
  )
}

export interface NFTPriceProps extends PriceProps {
  prizes: NormalRewardInfo[] | BlindRewardInfo
}

export const NFTPrice: React.FC<NFTPriceProps> = ({
  prizes,
  type,
  showLabel,
}) => {
  const [t] = useTranslation('translations')
  const tokens = useMemo(() => {
    if (isNormalReward(prizes)) {
      return prizes
    }
    return prizes.options
  }, [prizes])
  const desc = isNormalReward(prizes)
    ? t('exchange.nft-prize')
    : t('exchange.blind-prize', {
        count: prizes.every_box_reward_count as any,
      })
  return (
    <>
      {showLabel ? (
        <>
          <div style={{ display: 'flex' }}>
            <RedeemLabel type={type} />
          </div>
          <div className="contain">{desc}</div>
        </>
      ) : null}
      {tokens.map((info, i) => {
        return <PriceCard info={info} count={info.item_count} key={i} />
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
    white-space: pre-line;
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

export interface OtherPriceProps extends PriceProps {
  prizes: CustomRewardInfo
}

export const OtherPrice: React.FC<OtherPriceProps> = ({
  prizes,
  type,
  showLabel,
}) => {
  const [t] = useTranslation('translations')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [previewImage, setPreviewImage] = useState('')
  return (
    <OthderPriceContainer>
      {showLabel ? (
        <>
          <div style={{ display: 'flex' }}>
            <RedeemLabel type={type} />
          </div>
          <div className="contain">{t('exchange.othder-prize')}</div>
        </>
      ) : null}
      <div className="price-title">{prizes.reward_name}</div>
      <div className="price-desc">{prizes.reward_description}</div>
      <div className="imgs">
        {prizes.images.map((p, i) => {
          return (
            <div
              className="img"
              key={p + i}
              onClick={() => {
                setPreviewImage(p)
                onOpen()
              }}
            >
              <LazyLoadImage
                src={getImagePreviewUrl(p)}
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
      </div>
      <Preview
        isOpen={isOpen}
        onClose={onClose}
        renderer={previewImage}
        bgImgUrl={previewImage}
        type="image"
        render3D={() => null}
      />
    </OthderPriceContainer>
  )
}
