import React from 'react'
import { useHistory } from 'react-router'
import styled from 'styled-components'
import { NFTToken, TransactionStatus } from '../../models'
import { LazyLoadImage } from '../Image'
import { Limited } from '../Limited'
import { Creator } from '../Creator'

export interface CardProps {
  token: NFTToken
  address: string
}

interface LabelProps {
  nft: NFTToken
  address: string
}

const LabelContainer = styled.div`
  position: absolute;
  color: white;
  top: 12px;
  right: 0;
  font-size: 10px;
  line-height: 16px;
  width: 46px;
  text-align: center;
  border-radius: 2px 0px 0px 2px;
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
      color: 'rgba(255, 165, 90, 0.8)',
      text: '确认中',
    },
    [LabelStatus.Receiving]: {
      color: '#61D8A4',
      text: '接收中',
    },
    [LabelStatus.Tranferring]: {
      color: 'rgba(89, 106, 255, 0.7)',
      text: '转让中',
    },
    [LabelStatus.None]: null,
  }

  if (status === LabelStatus.None) {
    return null
  }

  const bgColor = statusMap[status]?.color

  return (
    <LabelContainer style={{ backgroundColor: bgColor }}>
      {statusMap[status]?.text}
    </LabelContainer>
  )
}

const Container = styled.div`
  display: flex;
  cursor: pointer;
  margin-top: 16px;
  margin-left: 16px;
  margin-right: 16px;
  background: #fff;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  position: relative;
  .media {
    width: 120px;
    height: 120px;
    min-width: 120px;
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .content {
    margin: 8px;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    overflow: hidden;
    width: 100%;
    .title {
      font-weight: 600;
      font-size: 16px;
      line-height: 22px;
      color: #000000;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
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

export const Card: React.FC<CardProps> = ({ token, address }) => {
  const history = useHistory()
  return (
    <Container onClick={() => history.push(`/nft/${token.token_uuid}`)}>
      <div className="media">
        <LazyLoadImage
          src={token.class_bg_image_url}
          width={120}
          height={120}
          backup={
            <LazyLoadImage
              width={90}
              height={90}
              src={`${location.origin}/logo512.png`}
            />
          }
        />
      </div>
      <div className="content">
        <div
          className="title"
          style={{
            width:
              token.tx_state === TransactionStatus.Committed
                ? '100%'
                : 'calc(100% - 46px)',
          }}
        >
          {token.class_name}
        </div>
        <Limited count={token.class_total} />
        <Creator
          url={token.issuer_avatar_url}
          name={token.issuer_name}
          uuid={token.issuer_uuid}
        />
      </div>
      <Label nft={token} address={address} />
    </Container>
  )
}
