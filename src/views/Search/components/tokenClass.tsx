import { Box, Flex, NftImage } from '@mibao-ui/components'
import { useTranslation } from 'react-i18next'
import { InfiniteList } from '../../../components/InfiniteList'
import { Query, SearchType } from '../../../models'
import { useSearchAPICallback } from '../hooks/useSearchAPI'
import { LinkContainer } from './linkContainer'
import { Loading } from './loading'
import { NoData } from './noData'

export const TokenClass: React.FC<{ keyword: string }> = ({ keyword }) => {
  const { t } = useTranslation('translations')
  const queryFn = useSearchAPICallback(keyword, SearchType.TokenClass)

  return (
    <InfiniteList
      enableQuery={!!keyword}
      queryFn={queryFn}
      queryKey={[Query.Issuers, keyword]}
      loader={<Loading />}
      emptyElement={keyword ? <NoData /> : ''}
      noMoreElement={t('common.actions.pull-to-down')}
      calcDataLength={(data) =>
        data?.pages.reduce(
          (acc, token) => token?.token_classes?.length + acc,
          0
        ) ?? 0
      }
      renderItems={(group, i) => {
        return group?.token_classes?.map((tokenClass, j: number) => (
          <LinkContainer to={`/class/${tokenClass.uuid}`} key={`${i}-${j}`}>
            <Flex w="full" alignItems="center">
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
