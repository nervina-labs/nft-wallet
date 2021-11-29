import { Button, Flex } from '@mibao-ui/components'
import { useTranslation } from 'react-i18next'
import { MainContainer } from '../../styles'
import { Search as SearchInput } from '../../components/Search'
import { useHistoryBack } from '../../hooks/useHistoryBack'
import { useDebounce } from '../../hooks/useDebounce'
import { useState } from 'react'

export const Search: React.FC = () => {
  const { t } = useTranslation('translations')
  const onBack = useHistoryBack()
  const [inputValue, setInputValue] = useState('')
  const searchKeyword = useDebounce(inputValue, 300)
  console.log(searchKeyword)

  return (
    <MainContainer>
      <Flex w="full" px="20px" py="8px">
        <SearchInput
          containerProps={{ w: 'full', shrink: 1, mr: '8px' }}
          autoFocus
          value={inputValue}
          hiddenCleanButton={!inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onClean={() => setInputValue('')}
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
        >
          {t('search.cancel')}
        </Button>
      </Flex>
    </MainContainer>
  )
}
