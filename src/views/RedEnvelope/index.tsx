import styled from '@emotion/styled'
import { AspectRatio, Box } from '@mibao-ui/components'
import { Flex, Image } from '@chakra-ui/react'
import { MainContainer } from '../../styles'
import DEFAULT_RED_ENVELOPE_COVER_PATH from '../../assets/svg/red-envelope-cover.svg'

const Container = styled(MainContainer)`
  background-color: #e15f4c;
  min-height: 100vh;
`

export const RedEnvelope: React.FC = () => {
  return (
    <Container>
      <Box w="100%" h="400px" overflow="hidden" position="relative">
        <AspectRatio
          rounded="full"
          position="absolute"
          bottom="10px"
          left="-100%"
          w="300%"
          ratio={1 / 1}
          shadow="0 2px 4px rgba(0, 0, 0, 0.25)"
          border="2px solid #F9E0B7"
          bg="#E94030"
          overflow="hidden"
        >
          <Flex>
            <Image
              src={DEFAULT_RED_ENVELOPE_COVER_PATH}
              w="33.3%"
              h="full"
              m="auto"
              objectFit="cover"
            />
          </Flex>
        </AspectRatio>
      </Box>
    </Container>
  )
}
