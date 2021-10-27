import { Box } from '@mibao-ui/components'
import { useState } from 'react'
import styled from 'styled-components'

const DescriptionContent = styled.div`
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  ${(props: { folded?: boolean }) =>
    props.folded ? '-webkit-line-clamp: 3;' : ''}
`

export const Description: React.FC<{ content: string }> = ({ content }) => {
  const [folded, setFolded] = useState(content.length > 100)

  return (
    <Box
      w="100%"
      fontSize="13px"
      pt="8px"
      position="relative"
      cursor="pointer"
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
        >
          ...更多
        </Box>
      )}
    </Box>
  )
}
