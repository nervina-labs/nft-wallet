import { Grid, Avatar, Box } from '@mibao-ui/components'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { InfiniteList } from '../../../components/InfiniteList'
import { useAPI } from '../../../hooks/useAccount'
import { Query } from '../../../models'
import FallbackAvatarSrc from '../../../assets/svg/fallback.svg'
import { isSupportWebp } from '../../../utils'

export const HolderList: React.FC<{
  uuid: string
}> = ({ uuid }) => {
  const { t, i18n } = useTranslation('translations')
  const { push } = useHistory()
  const api = useAPI()
  const queryFn = useCallback(
    async ({ pageParam = 0 }) => {
      const { data } = await api.getHolderByTokenClassUuid(uuid, {
        page: pageParam,
      })
      return data
    },
    [api, uuid]
  )

  return (
    <InfiniteList
      queryKey={[Query.NftHolderList, api, uuid]}
      queryFn={queryFn}
      noMoreElement={t('nft.no-more-holder')}
      calcDataLength={(data) =>
        data?.pages.reduce(
          (acc, page) => page.token_holder_list.length + acc,
          0
        ) ?? 0
      }
      renderItems={(items, index) => {
        return items.token_holder_list.map((item) => (
          <Grid
            templateColumns="48px auto auto"
            h="60px"
            lineHeight="48px"
            onClick={() => push(`/holder/${item.holder_info.address}`)}
            cursor="pointer"
          >
            <Avatar
              src={
                item.holder_info.avatar_url === null
                  ? ''
                  : item.holder_info.avatar_url
              }
              border="2px solid #f6f6f6"
              fallbackSrc={FallbackAvatarSrc}
              srcQueryParams={{
                tid: item.n_token_id,
                locale: i18n.language,
              }}
              resizeScale={100}
              webp={isSupportWebp()}
            />
            <Box
              ml="18px"
              fontWeight="500"
              fontSize="14px"
              whiteSpace="nowrap"
              textOverflow="ellipsis"
              overflow="hidden"
            >
              {item.holder_info.nickname
                ? item.holder_info.nickname
                : t('holder.user-name-empty')}
            </Box>
            <Box
              textAlign="right"
              fontWeight="600"
              fontSize="14px"
              whiteSpace="nowrap"
            >
              #{item.n_token_id}
            </Box>
          </Grid>
        ))
      }}
    />
  )
}
