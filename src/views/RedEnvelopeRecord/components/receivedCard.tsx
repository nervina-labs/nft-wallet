import { Box, Divider, Flex, Heading } from '@chakra-ui/react'
import styled from '@emotion/styled'
import { Issuer, Button } from '@mibao-ui/components'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ReceivedRedEnvelopeRecordItem } from '../../../models'
import { RoutePath } from '../../../routes'
import { ellipsisString, isSupportWebp } from '../../../utils'
import { CardImageGroup } from './cardImageGroup'

export const StyledLink = styled(Link)`
  display: inline-flex;
  height: 100%;
`

export const UserLink = styled(Link)`
  display: flex;
`

const FlexImagesLink = styled(Link)`
  display: flex;
  width: 100%;
`

export const ReceivedCard: React.FC<{
  data: ReceivedRedEnvelopeRecordItem
}> = ({ data }) => {
  const { t } = useTranslation('translations')
  return (
    <Box
      shadow="0 0 8px rgba(0, 0, 0, 0.08)"
      rounded="22px"
      px="15px"
      pb="10px"
      mb="10px"
      bg="white"
    >
      <Flex h="52px" justify="space-between" align="center">
        {data.user_info ? (
          <UserLink to={`/holder/${data.user_info.address}`}>
            <Issuer
              name={
                data.user_info.nickname ||
                ellipsisString(data.user_info.address, [8, 8])
              }
              src={
                data.user_info.avatar_url === null
                  ? ''
                  : data.user_info.avatar_url
              }
              type={data.user_info.avatar_type}
              webp={isSupportWebp()}
              resizeScale={100}
              customizedSize={{
                fixed: 'small',
              }}
              size="25px"
              href={`/holder/${data.user_info.address}`}
            />
          </UserLink>
        ) : null}
        {data.issuer_info ? (
          <UserLink to={`/issuer/${data.issuer_info.uuid}`}>
            <Issuer
              name={data.issuer_info.name}
              src={
                data.issuer_info.avatar_url === null
                  ? ''
                  : data.issuer_info.avatar_url
              }
              webp={isSupportWebp()}
              resizeScale={100}
              isVerified={data.issuer_info.verified_info?.is_verified}
              customizedSize={{
                fixed: 'small',
              }}
              size="25px"
              href={`/issuer/${data.issuer_info.uuid}`}
            />
          </UserLink>
        ) : null}
        <Box color="#999999" fontSize="12px" ml="auto" whiteSpace="nowrap">
          {t('red-envelope-records.creator')}
        </Box>
      </Flex>
      <Divider />
      <Heading fontSize="14px" my="8px">
        {data.greetings}
      </Heading>
      <FlexImagesLink to={`${RoutePath.RedEnvelope}/${data.uuid}/received`}>
        <CardImageGroup
          items={data.record_items.slice(0, 4).map((record) => ({
            src: record.bg_image_url === null ? '' : record.bg_image_url,
            tid: record.n_token_id,
          }))}
          total={data.record_items.length}
        />
      </FlexImagesLink>
      <Divider mt="10px" />
      <Flex mt="10px" fontSize="12px" h="25px" lineHeight="25px">
        <Box mr="auto" color="#777E90">
          {t('red-envelope-records.state.received')}
        </Box>
        <StyledLink to={`${RoutePath.RedEnvelope}/${data.uuid}/received`}>
          <Button colorScheme="black" size="small" px="10px">
            {t('red-envelope-records.details')}
          </Button>
        </StyledLink>
      </Flex>
    </Box>
  )
}
