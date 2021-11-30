import { CloseIcon } from '@chakra-ui/icons'
import styled from '@emotion/styled'
import {
  Box,
  Center,
  Flex,
  FlexProps,
  Input,
  InputProps,
} from '@mibao-ui/components'
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
  hiddenCleanButton?: boolean
  onClean?: () => void
}

export const Search: React.FC<SearchProps> = ({
  containerProps,
  noInput,
  onClean,
  hiddenCleanButton,
  ...props
}) => {
  const { t } = useTranslation('translations')
  const placeholderText = t('search.search-placeholder')
  const hasCleanIcon = onClean && !hiddenCleanButton

  return (
    <Flex
      h="40px"
      lineHeight="40px"
      bg="#F6F7FC"
      px="8px"
      rounded="8px"
      fontSize="14px"
      whiteSpace="nowrap"
      position="relative"
      {...containerProps}
    >
      <StyledSearchIconSvg />
      {noInput ? (
        <Box as="span" color="rgba(119, 126, 144, 0.5)">
          {placeholderText}
        </Box>
      ) : (
        <Input
          color="#23262F"
          h="full"
          w="full"
          bg="none"
          border="none"
          p="0"
          pr={hasCleanIcon ? '28px' : undefined}
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
      {hasCleanIcon ? (
        <Center
          as="a"
          position="absolute"
          top="50%"
          right="8px"
          bg="rgba(145, 145, 166, 0.1)"
          h="20px"
          w="20px"
          rounded="full"
          transform="translateY(-50%)"
          onClick={onClean}
          cursor="pointer"
        >
          <CloseIcon w="6px" h="6px" />
        </Center>
      ) : null}
    </Flex>
  )
}
