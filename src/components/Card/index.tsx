import React from 'react'
import { useHistory } from 'react-router'
import styled from 'styled-components'
import { NFTToken, NftType, TransactionStatus } from '../../models'
import { Limited } from '../Limited'
import { Creator } from '../Creator'
import { useTranslation } from 'react-i18next'
import { CardImage } from './CardImage'

export interface CardProps {
  token: NFTToken
  address: string
  className?: string
  isClass: boolean
  showTokenId?: boolean
}

interface LabelProps {
  nft: NFTToken
  address: string
}

const LabelContainer = styled.div`
  font-size: 11px;
  line-height: 16px;
  border-radius: 30px;
  padding: 3px 8px;
  border: 1px solid;
  margin-left: auto;
  white-space: nowrap;
`

enum LabelStatus {
  Receiving,
  Comfirming,
  Tranferring,
  None,
}

interface LabelResult {
  color: string
  text: string
}

const Label: React.FC<LabelProps> = ({ nft, address }) => {
  const { t } = useTranslation('translations')
  if (nft.tx_state === TransactionStatus.Committed) {
    return null
  }

  let status: LabelStatus = LabelStatus.None

  if (
    address === nft?.from_address &&
    nft.tx_state === TransactionStatus.Pending
  ) {
    status = LabelStatus.Tranferring
  }

  if (
    address === nft?.to_address &&
    nft.tx_state === TransactionStatus.Pending
  ) {
    status = LabelStatus.Receiving
  }

  if (nft.tx_state === TransactionStatus.Submitting) {
    status = LabelStatus.Comfirming
  }

  const statusMap: Record<LabelStatus, LabelResult | null> = {
    [LabelStatus.Comfirming]: {
      color: '#F9A44C',
      text: t('nfts.status.comfirming'),
    },
    [LabelStatus.Receiving]: {
      color: '#67D696',
      text: t('nfts.status.receiving'),
    },
    [LabelStatus.Tranferring]: {
      color: '#00A0E9',
      text: t('nfts.status.tranferring'),
    },
    [LabelStatus.None]: null,
  }

  if (status === LabelStatus.None) {
    return null
  }

  const color = statusMap[status]?.color

  return (
    <LabelContainer style={{ color: color, borderColor: color }}>
      {statusMap[status]?.text}
    </LabelContainer>
  )
}

const Container = styled.div`
  display: flex;
  overflow: hidden;
  cursor: pointer;
  margin-bottom: 15px;
  margin-left: 16px;
  margin-right: 16px;
  background: #fff;
  border-radius: 10px;
  position: relative;
  &.first {
    margin-top: 20px;
  }
  .error {
    color: #d03a3a;
  }
  /* box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1); */
  .media {
    width: 100px;
    height: 125px;
    min-width: 100px;
    border-radius: 10px;
    img {
      border-radius: 10px;
    }
  }
  .content {
    margin: 12px;
    padding-left: 12px;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    overflow: hidden;
    width: 100%;
    position: relative;
    .title {
      font-size: 14px;
      line-height: 26px;
      color: #000000;
      width: 100%;
      display: flex;
      /* justify-content: center; */
      align-items: center;
      > span {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        /* margin-right: 4px; */
      }
    }
    .desc {
      font-weight: normal;
      font-size: 12px;
      line-height: 16px;
      color: rgba(0, 0, 0, 0.6);
      margin: 8px 0;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3; /* number of lines to show */
      -webkit-box-orient: vertical;
    }
    .creator {
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: 600;
      font-size: 12px;
      line-height: 17px;
      color: rgba(0, 0, 0, 0.6);
      .avatar {
        margin-left: 12px;
        margin-right: 6px;
        img {
          border-radius: 50%;
          width: 24px;
          height: 24px;
        }
        svg {
          position: relative;
          top: 2px;
        }
      }
      .name {
        color: rgba(0, 0, 0, 0.8);
        font-weight: normal;
        text-overflow: ellipsis;
      }
    }
  }
`

export const Card: React.FC<CardProps> = ({
  token,
  address,
  className,
  isClass,
  showTokenId,
}) => {
  const history = useHistory()
  const isClassBanned = token.is_class_banned
  const isIssuerBaned = token.is_issuer_banned
  const isBanned = isClassBanned || isIssuerBaned
  const [t] = useTranslation('translations')

  return (
    <Container
      onClick={() => {
        if (isBanned) return
        if (isClass) {
          history.push(`/class/${token.class_uuid}`)
        } else {
          history.push(`/nft/${token.token_uuid}`)
        }
      }}
      className={className}
      style={{
        cursor: isBanned ? 'default' : 'pointer',
      }}
    >
      <CardImage
        src={isClassBanned || isIssuerBaned ? '' : token.class_bg_image_url}
        className="media"
        width={100}
        height={125}
        hasCardBack={token.card_back_content_exist}
        isPlayable={
          token.renderer_type === NftType.Audio ||
          token.renderer_type === NftType.Video
        }
        tid={!isClass ? `${token.n_token_id}` : undefined}
      />
      <div className="content">
        <div className="title">
          <span className={isBanned ? 'error' : ''}>
            {isBanned ? t('common.baned.nft') : token.class_name}
          </span>
          <Label nft={token} address={address} />
        </div>
        <Limited
          banned={isBanned}
          count={token.class_total}
          bold={false}
          sn={showTokenId === false ? undefined : token.n_token_id}
          color="rgba(63, 63, 63, 0.66) !important"
        />
        <Creator
          title=""
          baned={isIssuerBaned}
          url={token.issuer_avatar_url}
          name={token.issuer_name}
          uuid={token.issuer_uuid}
          isVip={token?.verified_info?.is_verified}
          vipTitle={token?.verified_info?.verified_title}
          vipSource={token?.verified_info?.verified_source}
          color="rgba(63, 63, 63, 0.66)"
        />
      </div>
    </Container>
  )
}
