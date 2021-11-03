import { useCallback } from 'react'
import { useAPI } from '../../hooks/useAccount'
import { useGetAndSetAuth } from '../../hooks/useProfile'
import { InfiniteList } from '../InfiniteList'
import { Query, ClassSortType as SortType } from '../../models'
import { Box, NFTCard } from '@mibao-ui/components'
import { useTranslation } from 'react-i18next'

export const Follow: React.FC<{
  sort: SortType
}> = ({ sort }) => {
  const { t, i18n } = useTranslation('translations')
  const getAuth = useGetAndSetAuth()
  const api = useAPI()
  const queryFn = useCallback(
    async ({ pageParam = 0 }) => {
      const auth = await getAuth()
      const { data } = await api.getFollowTokenClasses(auth, pageParam, sort)
      return {
        class_list: data.token_classes,
        meta: data.meta,
      }
    },
    [api, getAuth, sort]
  )

  return (
    <InfiniteList
      enableQuery
      queryFn={queryFn}
      queryKey={[Query.Explore, sort, api]}
      emptyElement={null}
      noMoreElement={t('common.actions.pull-to-down')}
      calcDataLength={(data) =>
        data?.pages.reduce(
          (acc, token) => token?.class_list?.length + acc,
          0
        ) ?? 0
      }
      columnCount={1}
      renderItems={(group) => {
        return group.class_list.map((token) => {
          return (
            <Box key={token.uuid} w="full" pb="30px">
              <NFTCard
                issuerProps={{
                  name: token.issuer_info?.name ?? '',
                  src:
                    token.issuer_info?.avatar_url === null
                      ? ''
                      : token.issuer_info?.avatar_url,
                  verifiedTitle: token.verified_info?.verified_title,
                }}
                locale={i18n.language}
                src={token.bg_image_url === null ? '' : token.bg_image_url}
                title={token.name}
                type={token.renderer_type}
                hasCardback={token.card_back_content_exist}
                w="full"
              />
            </Box>
          )
        })
      }}
    />
  )
}
