import { Box, Button, Flex } from '@mibao-ui/components'
import { useTranslation } from 'react-i18next'
import { MainContainer } from '../../styles'
import { Search as SearchInput } from '../../components/Search'
import { useHistoryBack } from '../../hooks/useHistoryBack'
import { useDebounce } from '../../hooks/useDebounce'
import { useRouteQuerySearch } from '../../hooks/useRouteQuery'
import { NoType } from './components/noType'
import { useType } from './hooks/useType'
import { TokenClass } from './components/tokenClass'
import { Back } from './components/back'
import { Issuer } from './components/issuer'
import { SearchType } from '../../models'

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
  const isNoType = !TYPE_SET.has(type)
  console.log(type)

  return (
    <MainContainer>
      <Flex w="full" px="20px" py="8px" alignItems="center" userSelect="none">
        {isNoType ? null : <Back onClick={() => setType('')} />}
        <SearchInput
          containerProps={{ w: 'full', shrink: 1 }}
          autoFocus
          value={keyword}
          hiddenCleanButton={!keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onClean={() => setKeyword('')}
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
        >
          {t('search.cancel')}
        </Button>
      </Flex>

      <Box w="full" mt="28px" px="20px" userSelect="none">
        {type === SearchType.TokenClass ? (
          <TokenClass keyword={searchKeyword} />
        ) : null}
        {type === SearchType.Issuer ? <Issuer keyword={searchKeyword} /> : null}
        {isNoType ? <NoType keyword={searchKeyword} /> : null}
      </Box>
    </MainContainer>
  )
}
