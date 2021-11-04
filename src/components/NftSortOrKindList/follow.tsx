import { useCallback } from 'react'
import { useAPI } from '../../hooks/useAccount'
import { useGetAndSetAuth } from '../../hooks/useProfile'
import { InfiniteList } from '../InfiniteList'
import { Query, ClassSortType as SortType } from '../../models'
import { Box, Flex, Issuer, Limited, NFTCard } from '@mibao-ui/components'
import { useTranslation } from 'react-i18next'
import { TokenClass } from '../../models/class-list'
import { useHistory } from 'react-router-dom'

const Card: React.FC<{ token: TokenClass }> = ({ token }) => {
  const { t, i18n } = useTranslation('translations')
  const { push } = useHistory()
  const gotoClass = useCallback(() => {
    push(`/class/${token.uuid}`)
  }, [push, token.uuid])
  const gotoIssuer = useCallback(() => {
    if (token.issuer_info?.uuid) {
      push(`/issuer/${token.issuer_info?.uuid}`)
    }
  }, [push, token.issuer_info?.uuid])

  return (
    <Box key={token.uuid} w="full" pb="30px" cursor="pointer">
      <NFTCard
        locale={i18n.language}
        src={token.bg_image_url === null ? '' : token.bg_image_url}
        title={token.name}
        type={token.renderer_type}
        hasCardback={token.card_back_content_exist}
        w="full"
        onClick={gotoClass}
      />
      <Flex justify="space-between">
        <Issuer
          name={token.issuer_info?.name ?? ''}
          src={
            token.issuer_info?.avatar_url === null
              ? ''
              : token.issuer_info?.avatar_url
          }
          isVerified={token.verified_info?.is_verified}
          size="25px"
          onClick={gotoIssuer}
          mr="5px"
        />
        <Limited
          count={0}
          limitedText={t('common.limit.limit')}
          unlimitedText={t('common.limit.unlimit')}
          my="auto"
          display="block"
        />
      </Flex>
    </Box>
  )
}

export const Follow: React.FC<{
  sort: SortType
}> = ({ sort }) => {
  const { t } = useTranslation('translations')
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
          return <Card token={token} />
        })
      }}
    />
  )
}
