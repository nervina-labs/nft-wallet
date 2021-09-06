import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { TokenClass } from '../../models/class-list'
import { RedeemDetailModel, RedeemType } from '../../models/redeem'
import { Label } from './Label'
import { NFTCard } from './NFTCard'
import Alert from '@material-ui/lab/Alert'

export interface PriceCardProps {
  token: TokenClass
  count: number
}

const PriceCardContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;

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
}

const PriceContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  .contain {
    background: #fff5c5;
    margin: 10px 0;
    font-size: 12px;
    padding: 8px;
  }

  .MuiAlert-root {
    margin-top: 8px;
    font-size: 12px;
  }
`

export const Price: React.FC<PriceProps> = ({ detail }) => {
  return (
    <PriceContainer>
      {detail.type === RedeemType.Other ? (
        <OtherPrice detail={detail} />
      ) : (
        <NFTPrice detail={detail} />
      )}
    </PriceContainer>
  )
}

export const NFTPrice: React.FC<PriceProps> = ({ detail }) => {
  const [t] = useTranslation('translations')
  return (
    <>
      <Label type={detail.type} />
      <div className="contain">
        {detail.type === RedeemType.NFT
          ? t('exchange.nft-price')
          : t('exchange.blind-price', { min: 2, max: 3 })}
      </div>
      {detail.tokens.map((token) => {
        return <PriceCard token={token} count={3} key={token.uuid} />
      })}
      <Alert severity="error">{t('exchange.warning')}</Alert>
    </>
  )
}

export const OtherPrice: React.FC<PriceProps> = ({ detail }) => {
  const [t] = useTranslation('translations')
  return (
    <>
      <Label type={detail.type} />
      <div className="contain">
        {t('exchange.blind-price', { min: 2, max: 3 })}
      </div>
      {detail.tokens.map((token) => {
        return <PriceCard token={token} count={3} key={token.uuid} />
      })}
      <Alert severity="error">{t('exchange.warning')}</Alert>
    </>
  )
}
