import { Button, Flex } from '@mibao-ui/components'
import { useTranslation } from 'react-i18next'
import { MainContainer } from '../../styles'
import { Search as SearchInput } from '../../components/Search'
import { useHistoryBack } from '../../hooks/useHistoryBack'

export const Search: React.FC = () => {
  const { t } = useTranslation('translations')
  const onBack = useHistoryBack()

  return (
    <MainContainer>
      <Flex w="full" px="20px" py="8px">
        <SearchInput
          containerProps={{ w: 'full', shrink: 1, mr: '8px' }}
          autoFocus
        />
        <Button
          variant="link"
          whiteSpace="nowrap"
          _hover={{
            textDecoration: 'none',
          }}
          onClick={onBack}
        >
          {t('search.cancel')}
        </Button>
      </Flex>
    </MainContainer>
  )
}
