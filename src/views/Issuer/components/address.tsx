import { Box, Flex } from '@mibao-ui/components'
import { useCallback, useState } from 'react'
import CopySvg from '../../../assets/svg/copy.svg'
import SuccessSvg from '../../../assets/svg/success.svg'
import { copyFallback, ellipsisIssuerID } from '../../../utils'

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
    }, 2000)
  }, [content, copied])

  return (
    <Flex fontSize="12px" whiteSpace="nowrap" onClick={onCopy}>
      ID:
      <Box mx="6px">{ellipsisIssuerID(content)}</Box>
      <img
        src={copied ? SuccessSvg : CopySvg}
        alt="copy-icon"
        height="16px"
        width="16px"
      />
    </Flex>
  )
}
