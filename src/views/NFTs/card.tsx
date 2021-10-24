import React from 'react'
import { NFTToken, TransactionStatus } from '../../models'
import { Box, NFTCard } from '@mibao-ui/components'
import { Tag } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { RoutePath } from '../../routes'
import styled from '@emotion/styled'
import { useHistory } from 'react-router'
import { getNFTQueryParams } from '../../utils'
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

const LabelContainer = styled(Tag)`
  font-size: 12px;
  line-height: 16px;
  border-radius: 22px;
  padding: 3px 8px;
  color: white;
  position: absolute;
  top: 10px;
  left: 30px;
  z-index: 3;
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
    <LabelContainer style={{ background: color }}>
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
  const isBanned = token.is_issuer_banned || token.is_class_banned
  const history = useHistory()
  const href = isClass
    ? `/class/${token.class_uuid}`
    : `/nft/${token.token_uuid}`

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
        href={isBanned ? undefined : href}
        srcQueryParams={getNFTQueryParams(token.n_token_id, i18n.language)}
        issuerProps={{
          name: token.issuer_name as string,
          src: token.issuer_avatar_url,
          bannedText: t('common.baned.issuer'),
          href: `${RoutePath.Issuer}/${token.issuer_uuid as string}`,
          isLinkExternal: false,
          onClick: (e) => {
            e.stopPropagation()
            e.preventDefault()
            history.push(`${RoutePath.Issuer}/${token.issuer_uuid as string}`)
          },
        }}
        limitProps={{
          count: token.class_total,
          limitedText: t('common.limit.limit'),
          unlimitedText: t('common.limit.unlimit'),
          serialNumber: showTokenID ? token.n_token_id : undefined,
          ml: '4px',
        }}
        titleProps={{ noOfLines: 2 }}
        onClick={(e) => {
          e.preventDefault()
          if (isBanned) {
            return
          }
          history.push(href)
        }}
      />
    </Box>
  )
}
