import { Box } from '@mibao-ui/components'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const DescriptionContent = styled.div`
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  user-select: text;
  white-space: pre-wrap;
  ${(props: { folded?: boolean }) =>
    props.folded
      ? `
    -webkit-line-clamp: 3;  
    cursor: pointer;
    `
      : ''}
`

export const Description: React.FC<{ content: string }> = ({ content }) => {
  const [folded, setFolded] = useState(content.length > 100)
  const { t } = useTranslation('translations')

  return (
    <Box
      w="100%"
      fontSize="13px"
      pt="8px"
      position="relative"
      onClick={() => {
        if (folded) {
          setFolded(false)
        }
      }}
    >
      <DescriptionContent folded={folded}>{content}</DescriptionContent>
      {folded && (
        <Box
          position="absolute"
          bottom={0}
          right={0}
          bg="white"
          color="gray.500"
          shadow="-10px 0 10px #fff"
          pl="5px"
          cursor="pointer"
        >
          ... {t('issuer.more')}
        </Box>
      )}
    </Box>
  )
}
