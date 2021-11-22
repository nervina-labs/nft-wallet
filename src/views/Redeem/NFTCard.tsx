import React, { useMemo } from 'react'
import styled from 'styled-components'
import { NormalRewardInfo } from '../../models/redeem'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Box, Flex, Limited, NftImage } from '@mibao-ui/components'

const Container = styled(Link)`
  display: flex;
  flex: 1;
  text-decoration: none;
`

export interface NFTCardProps {
  info: NormalRewardInfo
}

export const NFTCard: React.FC<NFTCardProps> = ({ info }) => {
  const [t] = useTranslation('translations')
  const id = useMemo(() => {
    if (info.n_token_id == null && info.token_uuid) {
      return info.token_class_uuid
    }
    return info.token_uuid ?? info.class_uuid
  }, [info])
  const isBaned = !!(
    info.is_banned ||
    info.is_issuer_banned ||
    info.is_class_banned
  )
  const to = isBaned
    ? '#'
    : `${info.n_token_id != null ? '/nft' : '/class'}/${id}`

  return (
    <Container to={to}>
      <NftImage
        src={
          isBaned || info.class_bg_image_url === null
            ? ''
            : info.class_bg_image_url
        }
        w="50px"
      />
      <Flex justify="center" direction="column" pl="10px">
        <Box
          fontSize="12px"
          textOverflow="ellipsis"
          overflow="hidden"
          noOfLines={1}
          color={info.is_banned ? '#d03a3a' : undefined}
        >
          {isBaned ? t('common.baned.nft') : info.class_name}
        </Box>
        <Limited
          count={info.class_total}
          fontSize="12px"
          limitedText={t('common.limit.limit')}
          unlimitedText={t('common.limit.unlimit')}
          isBaned={isBaned}
          color="#999999"
          serialNumber={info.n_token_id}
        />
      </Flex>
    </Container>
  )
}
