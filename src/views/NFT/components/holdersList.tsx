import { Grid, Avatar, Box } from '@mibao-ui/components'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { InfiniteList } from '../../../components/InfiniteList'
import { useAPI } from '../../../hooks/useAccount'
import { Query } from '../../../models'
import FallbackAvatarSrc from '../../../assets/svg/fallback.svg'
import { getNFTQueryParams, isSupportWebp } from '../../../utils'

export const HolderList: React.FC<{
  uuid: string
  isLoading?: boolean
}> = ({ uuid, isLoading }) => {
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
      enableQuery={!isLoading}
      queryKey={[Query.NftHolderList, api, uuid]}
      queryFn={queryFn}
      noMoreElement={t('nft.no-more-holder')}
      calcDataLength={(data) =>
        data?.pages.reduce(
          (acc, page) => page.token_holder_list.length + acc,
          0
        ) ?? 0
      }
      renderItems={(items, i) => {
        return items.token_holder_list.map((item, j) => (
          <Grid
            key={`${i}-${j}`}
            templateColumns="48px auto auto"
            h="60px"
            lineHeight="48px"
            onClick={() => push(`/holder/${item.holder_info.address}`)}
            cursor="pointer"
            pt="12px"
            px="20px"
          >
            <Avatar
              src={
                item.holder_info.avatar_url === null
                  ? ''
                  : item.holder_info.avatar_url
              }
              type={item.holder_info.avatar_type}
              fallbackSrc={FallbackAvatarSrc}
              srcQueryParams={getNFTQueryParams(
                item.holder_info.avatar_tid,
                i18n.language
              )}
              resizeScale={100}
              webp={isSupportWebp()}
              customizedSize={{
                fixed: 'small',
              }}
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
