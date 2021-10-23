import React from 'react'
import { NFTToken, TransactionStatus } from '../../models'
import { Box, NFTCard } from '@mibao-ui/components'
import { useTranslation } from 'react-i18next'
import { RoutePath } from '../../routes'
import styled from '@emotion/styled'
import { useHistory } from 'react-router'

export interface CardProps {
  token: NFTToken
  isClass: boolean
  address: string
  showTokenID: boolean
}

interface LabelProps {
  nft: NFTToken
  address: string
}

const LabelContainer = styled.div`
  font-size: 12px;
  line-height: 16px;
  border-radius: 22px;
  padding: 3px 8px;
  white-space: nowrap;
  position: absolute;
  top: 10px;
  left: 10px;
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
      color: 'rgba(80, 101, 229, 0.6)',
      text: t('nfts.status.comfirming'),
    },
    [LabelStatus.Receiving]: {
      color: 'rgba(255, 92, 0, 0.6)',
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

export const Card: React.FC<CardProps> = ({
  token,
  isClass,
  address,
  showTokenID,
}) => {
  const { t, i18n } = useTranslation('translations')
  const history = useHistory()
  const isBanned = token.is_issuer_banned || token.is_class_banned
  return (
    <Box position="relative" w="100%" mb="24px" px="20px">
      <Label address={address} nft={token} />
      <NFTCard
        w="100%"
        isIssuerBanned={token.is_issuer_banned}
        isNFTBanned={token.is_class_banned}
        hasCardback={token.card_back_content_exist}
        resizeScale={600}
        title={token.class_name}
        bannedText={t('common.baned.nft')}
        type={token.renderer_type}
        src={token.class_bg_image_url || ''}
        locale={i18n.language}
        issuerProps={{
          name: token.issuer_name as string,
          src: token.issuer_avatar_url,
          bannedText: t('common.baned.nft'),
          onClick: (e) => {
            e.stopPropagation()
            history.push(`${RoutePath.Issuer}/${token.issuer_uuid as string}`)
          },
        }}
        limitProps={{
          count: token.class_total,
          limitedText: t('common.limit.limit'),
          unlimitedText: t('common.limit.unlimit'),
          serialNumber: showTokenID ? token.n_token_id : undefined,
          whiteSpace: 'nowrap',
          ml: '4px',
        }}
        titleProps={{ noOfLines: 2 }}
        onClick={() => {
          if (isBanned) return
          if (isClass) {
            history.push(`/class/${token.class_uuid}`)
          } else {
            history.push(`/nft/${token.token_uuid}`)
          }
        }}
      />
    </Box>
  )
}
