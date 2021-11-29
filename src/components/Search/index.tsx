import styled from '@emotion/styled'
import { Box, Flex, FlexProps, Input, InputProps } from '@mibao-ui/components'
import { useTranslation } from 'react-i18next'
import { ReactComponent as SearchIconSvg } from '../../assets/svg/search.svg'

const StyledSearchIconSvg = styled(SearchIconSvg)`
  margin: auto 8px auto 0;
  width: 20px;
  height: 20px;
  min-width: 20px;
`

export interface SearchProps extends InputProps {
  containerProps?: FlexProps
  noInput?: boolean
}

export const Search: React.FC<SearchProps> = ({
  containerProps,
  noInput,
  ...props
}) => {
  const { t } = useTranslation('translations')
  const placeholderText = t('search.search-placeholder')

  return (
    <Flex
      h="40px"
      lineHeight="40px"
      bg="#F6F7FC"
      px="8px"
      rounded="8px"
      fontSize="14px"
      whiteSpace="nowrap"
      {...containerProps}
    >
      <StyledSearchIconSvg />
      {noInput ? (
        <Box as="span" color="rgba(119, 126, 144, 0.5)">
          {placeholderText}
        </Box>
      ) : (
        <Input
          color="#777e90"
          h="full"
          w="full"
          bg="none"
          border="none"
          p="0"
          _placeholder={{
            color: 'rgba(119, 126, 144, 0.5)',
          }}
          _focus={{
            border: 'none',
          }}
          placeholder={placeholderText}
          {...props}
        />
      )}
    </Flex>
  )
}
