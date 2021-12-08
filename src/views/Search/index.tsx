import { Box, Button, Flex } from '@mibao-ui/components'
import { useTranslation } from 'react-i18next'
import { MainContainer } from '../../styles'
import { Search as SearchInput } from '../../components/Search'
import { useHistoryBack } from '../../hooks/useHistoryBack'
import { useDebounce } from '../../hooks/useDebounce'
import { useRouteQuerySearch } from '../../hooks/useRouteQuery'
import { NoType } from './components/noType'
import { useType } from './hooks/useType'
import { Back } from './components/back'
import { Query, SearchType } from '../../models'
import { InfiniteList } from '../../components/InfiniteList'
import { useSearchAPICallback } from './hooks/useSearchAPI'
import { NoData } from './components/noData'
import { Loading } from './components/loading'
import { useScrollRestoration } from '../../hooks/useScrollRestoration'
import { IssuerItem, TokenClassItem } from './components/item'
import { Title } from './components/title'
import { useMemo } from 'react'

const TYPE_SET = new Set<SearchType | ''>([
  SearchType.TokenClass,
  SearchType.Issuer,
])

export const Search: React.FC = () => {
  const { t } = useTranslation('translations')
  const onBack = useHistoryBack()
  const [keyword, setKeyword] = useRouteQuerySearch<string>('keyword', '')
  const searchKeyword = useDebounce(keyword, 300)
  const [type, setType] = useType()
  const queryFn = useSearchAPICallback(keyword, type || SearchType.Issuer)
  useScrollRestoration()
  const isNoType = !TYPE_SET.has(type)
  const placeholderText = useMemo(() => {
    if (type === SearchType.Issuer) {
      return t('search.search-placeholder-issuer')
    }
    if (type === SearchType.TokenClass) {
      return t('search.search-placeholder-token-class')
    }
    return t('search.search-placeholder')
  }, [t, type])

  return (
    <MainContainer position="relative">
      <Flex
        w="full"
        px="20px"
        py="8px"
        alignItems="center"
        userSelect="none"
        position="sticky"
        top="0"
        bg="white"
        zIndex={5}
      >
        {isNoType ? null : <Back onClick={() => setType('')} />}
        <SearchInput
          containerProps={{ w: 'full', shrink: 1 }}
          autoFocus
          value={keyword}
          hiddenCleanButton={!keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onClean={() => setKeyword('')}
          fontSize="14px"
          placeholder={placeholderText}
        />
        <Button
          as="a"
          variant="link"
          whiteSpace="nowrap"
          _hover={{
            textDecoration: 'none',
          }}
          onClick={onBack}
          cursor="pointer"
          ml="8px"
          w="auto"
          flexShrink={0}
          color="black"
          fontSize="14px"
        >
          {t('search.cancel')}
        </Button>
      </Flex>

      <Box
        w="full"
        mt="15px"
        px="20px"
        userSelect="none"
        pb="calc(20px + var(--safe-area-inset-bottom))"
      >
        {!isNoType ? (
          <Title>
            {type === SearchType.Issuer ? t('search.issuer') : null}
            {type === SearchType.TokenClass ? t('search.token-class') : null}
          </Title>
        ) : null}

        {isNoType ? (
          <NoType keyword={searchKeyword} />
        ) : (
          <InfiniteList
            enableQuery={!!keyword}
            queryFn={queryFn}
            queryKey={[Query.Issuers, keyword, type]}
            loader={<Loading />}
            emptyElement={keyword ? <NoData /> : ''}
            noMoreElement={''}
            calcDataLength={(data) =>
              data?.pages.reduce((acc, token) => {
                if ('issuers' in token) {
                  return token.issuers.length + acc
                }
                if ('token_classes' in token) {
                  return token.token_classes.length + acc
                }
                return acc
              }, 0) ?? 0
            }
            renderItems={(group, i) => {
              if ('token_classes' in group) {
                return group?.token_classes?.map((tokenClass, j: number) => (
                  <TokenClassItem
                    tokenClass={tokenClass}
                    key={`${i}-${j}-tokenClass`}
                  />
                ))
              }
              if ('issuers' in group) {
                return group?.issuers?.map((issuer, j: number) => (
                  <IssuerItem key={`${i}-${j}-issuer`} issuer={issuer} />
                ))
              }
              return <></>
            }}
          />
        )}
      </Box>
    </MainContainer>
  )
}
