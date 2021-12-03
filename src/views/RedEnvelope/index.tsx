import styled from '@emotion/styled'
import { AspectRatio } from '@mibao-ui/components'
import { Box, Flex, Image } from '@chakra-ui/react'
import { MainContainer } from '../../styles'
import DEFAULT_RED_ENVELOPE_COVER_PATH from '../../assets/svg/red-envelope-cover.svg'
import { useThemeColor } from '../../hooks/useThemeColor'
import { useInnerSize } from '../../hooks/useInnerSize'
import { useState } from 'react'
import { Cover } from './components/cover'
import { Records } from './components/records'

const Container = styled(MainContainer)`
  background-color: #e15f4c;
  display: flex;
  flex-direction: column;
  transition: 200ms;
  position: relative;
`

export const RedEnvelope: React.FC = () => {
  useThemeColor('#E94030')
  const { height } = useInnerSize()
  const [isOpened, setIsOpened] = useState(false)

  return (
    <Container minH={height}>
      <Box
        w="100%"
        h={isOpened ? '80px' : '30%'}
        flex={isOpened ? undefined : 1}
        minH={isOpened ? '80px' : '200px'}
        overflow="hidden"
        position="sticky"
        top="0"
        transition="300ms"
        zIndex={5}
        transform="translate3d(0, 0, 0)"
      >
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
              w="35%"
              h="35%"
              mt="auto"
              objectFit="cover"
            />
          </Flex>
        </AspectRatio>
      </Box>
      {isOpened ? <Records /> : <Cover open={() => setIsOpened(true)} />}
    </Container>
  )
}
