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
  margin-right: 10px;
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
      py="10px"
      mb="10px"
    >
      <Flex h="52px" justify="space-between" align="center">
        {data.user_info ? (
          <>
            <Issuer
              name={
                data.user_info.nickname ||
                ellipsisString(data.user_info.address, [8, 8])
              }
              src={data.user_info.avatar_url}
              type={data.user_info.avatar_type}
              webp={isSupportWebp()}
              resizeScale={100}
              customizedSize={{
                fixed: 'small',
              }}
            />
          </>
        ) : null}
        <Box color="#999999">发出人</Box>
      </Flex>
      <Divider />
      <Heading fontSize="14px" my="8px">
        {data.greetings}
      </Heading>
      <CardImageGroup
        items={[
          {
            src:
              'https://oss.jinse.cc/production/7744ffc9-81b1-4c4e-a711-0536eb8bf10a.png',
            tid: null,
          },
        ]}
      />
      <Divider />
      <Flex mt="10px" fontSize="12px" h="25px" lineHeight="25px">
        <Box mr="auto" color="#777E90">
          {t('red-envelope-records.state.done')}
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
