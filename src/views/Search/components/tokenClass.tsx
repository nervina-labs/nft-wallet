import { Box, Flex, NftImage } from '@mibao-ui/components'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { InfiniteList } from '../../../components/InfiniteList'
import { useAPI } from '../../../hooks/useAccount'
import { Query } from '../../../models'
import { LinkContainer } from './linkContainer'
import { Loading } from './loading'
import { NoData } from './noData'

export const TokenClass: React.FC<{ keyword: string }> = ({ keyword }) => {
  const { t } = useTranslation('translations')
  const api = useAPI()
  const queryFn = useCallback(
    async ({ pageParam = 1 }) => {
      if (!keyword) {
        return {
          issuer_list: [],
          token_class_list: [],
          meta: {
            current_page: pageParam,
            total_count: 0,
            type: 'token',
          },
        }
      }
      const { data } = await api.search(keyword, {
        type: 'token_class',
        page: pageParam,
      })
      return data
    },
    [api, keyword]
  )

  if (!keyword && !Loading) {
    return null
  }

  return (
    <InfiniteList
      enableQuery={!!keyword}
      queryFn={queryFn}
      queryKey={[Query.Issuers, api, keyword]}
      loader={<Loading />}
      emptyElement={keyword ? <NoData /> : ''}
      noMoreElement={t('common.actions.pull-to-down')}
      calcDataLength={(data) =>
        data?.pages.reduce(
          (acc, token) => token.token_class_list.length + acc,
          0
        ) ?? 0
      }
      columnCount={2}
      renderItems={(group, i) => {
        return group.token_class_list.map((tokenClass, j: number) => (
          <LinkContainer to={`/class/${tokenClass.uuid}`}>
            <Flex key={`${i}-${j}`} w="full" alignItems="center">
              <NftImage src={tokenClass.bg_image_url} w="48px" />
              <Box fontSize="14px" ml="16px">
                {tokenClass.name}
              </Box>
            </Flex>
          </LinkContainer>
        ))
      }}
    />
  )
}
