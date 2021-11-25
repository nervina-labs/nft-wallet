import { Box, Flex } from '@mibao-ui/components'
import CopySvg from '../../../assets/svg/copy.svg'
import SuccessSvg from '../../../assets/svg/success.svg'
import styled from 'styled-components'
import { useClipboard } from '@chakra-ui/react'

const Icon = styled.img`
  width: 16px;
  height: 16px;
  object-fit: contain;
`

export const Address: React.FC<{ content: string }> = ({ content }) => {
  const { hasCopied, onCopy } = useClipboard(content)
  return (
    <Flex
      fontSize="12px"
      whiteSpace="nowrap"
      onClick={onCopy}
      cursor="pointer"
      w="100%"
    >
      ID:
      <Box
        ml="6px"
        textOverflow="ellipsis"
        overflow="hidden"
        whiteSpace="nowrap"
        minW="40px"
      >
        {content.substring(0, content.length - 5)}
      </Box>
      <Box mr="6px">{content.substring(content.length - 5)}</Box>
      <Icon src={hasCopied ? SuccessSvg : CopySvg} />
    </Flex>
  )
}
