import { Box, Flex } from '@mibao-ui/components'
import { useCallback, useState } from 'react'
import CopySvg from '../../../assets/svg/copy.svg'
import SuccessSvg from '../../../assets/svg/success.svg'
import { copyFallback, ellipsisIssuerID } from '../../../utils'
import styled from 'styled-components'

const Icon = styled.img`
  width: 16px;
  height: 16px;
  object-fit: contain;
`

export const Address: React.FC<{ content: string }> = ({ content }) => {
  const [copied, setCopied] = useState(false)
  const onCopy = useCallback(() => {
    if (copied) {
      return
    }
    setCopied(true)
    if (content) {
      copyFallback(content)
    }
    setTimeout(() => {
      setCopied(false)
    }, 100000)
  }, [content, copied])

  return (
    <Flex fontSize="12px" whiteSpace="nowrap" onClick={onCopy} cursor="pointer">
      ID:
      <Box mx="6px">{ellipsisIssuerID(content)}</Box>
      <Icon src={copied ? SuccessSvg : CopySvg} />
    </Flex>
  )
}
