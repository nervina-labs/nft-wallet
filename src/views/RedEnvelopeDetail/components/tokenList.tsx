import { Box, Flex } from '@chakra-ui/react'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { InfiniteList } from '../../../components/InfiniteList'
import { useAPI } from '../../../hooks/useAccount'
import { useGetAndSetAuth } from '../../../hooks/useProfile'
import { Query } from '../../../models'
import { isSupportWebp } from '../../../utils'
import { Image } from '@mibao-ui/components'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

const StyledLink = styled(Link)`
  display: flex;
  margin-bottom: 12px;
`

export const TokenList: React.FC<{
  uuid: string
}> = ({ uuid }) => {
  const { t } = useTranslation('translations')
  const api = useAPI()
  const getAuth = useGetAndSetAuth()
  const queryFn = useCallback(
    async ({ pageParam = 1 }) => {
      const auth = await getAuth()
      const { data } = await api.getSentRedEnvelopeDetailRewards(uuid, auth, {
        page: pageParam,
      })
      return data
    },
    [api, getAuth, uuid]
  )
  return (
    <InfiniteList
      enableQuery
      queryFn={queryFn}
      queryKey={[Query.GetSentRedEnvelopeDetailRewards]}
      noMoreElement={t('no-more')}
      calcDataLength={(data) =>
        data?.pages.reduce(
          (acc, item) => item.redpack_reward_plan_items.length + acc,
          0
        ) ?? 0
      }
      renderItems={(data) =>
        data.redpack_reward_plan_items.map((reward, i) => (
          <StyledLink key={i} to={`/nft/${reward.token.uuid}`}>
            <Image
              src={reward.token.bg_image_url}
              resizeScale={300}
              webp={isSupportWebp()}
              customizedSize={{
                fixed: 'large',
              }}
              w="50px"
              h="50px"
              rounded="16px"
            />
            <Flex
              justify="center"
              fontSize="14px"
              ml="10px"
              mr="auto"
              direction="column"
            >
              <Box
                color="#000"
                whiteSpace="nowrap"
                textOverflow="ellipsis"
                overflow="hidden"
              >
                {reward.token.name}
              </Box>
              <Box
                fontSize="12px"
                whiteSpace="nowrap"
                textOverflow="ellipsis"
                overflow="hidden"
              >
                #{reward.token.n_token_id}
              </Box>
            </Flex>
            <Box my="auto" fontSize="14px">
              {reward.state === 'pending'
                ? t('red-envelope-detail.item-unreceived')
                : ''}
              {reward.state === 'grabed'
                ? t('red-envelope-detail.item-received')
                : ''}
            </Box>
          </StyledLink>
        ))
      }
      style={{
        padding: '0 20px',
      }}
    />
  )
}
