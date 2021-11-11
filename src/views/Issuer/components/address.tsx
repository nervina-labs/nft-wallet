import { Box, Flex } from '@mibao-ui/components'
import CopySvg from '../../../assets/svg/copy.svg'
import SuccessSvg from '../../../assets/svg/success.svg'
import { ellipsisIssuerID } from '../../../utils'
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
    <Flex fontSize="12px" whiteSpace="nowrap" onClick={onCopy} cursor="pointer">
      ID:
      <Box mx="6px">{ellipsisIssuerID(content)}</Box>
      <Icon src={hasCopied ? SuccessSvg : CopySvg} />
    </Flex>
  )
}
