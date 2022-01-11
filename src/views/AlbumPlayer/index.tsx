import styled from '@emotion/styled'
import { MainContainer } from '../../styles'
import { Box, Image, Button, HStack } from '@chakra-ui/react'
import { useInnerSize } from '../../hooks/useInnerSize'
import BgPath from '../../assets/album-player/bg.png'
import StylusArmPath from '../../assets/album-player/stylus-arm.png'
import CDPath from '../../assets/album-player/cd.png'
import { CONTAINER_MAX_WIDTH } from '../../constants'
import { useAudioPlayer } from './hooks/useAudioPlayer'
import { useEffect, useState } from 'react'

const StyledMainContainer = styled(MainContainer)`
  background-color: #000;
  position: relative;
  display: flex;
  flex-direction: column;

  @keyframes arm-run {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(0.1deg);
    }
  }

  @keyframes cd-run {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`

const ARM_RUN_RANGE = [17, 36] as const

export const AlbumPlayer: React.FC = () => {
  const list = [
    'https://oss.jinse.cc/production/1cc614e6-411c-4b9e-a1a9-fbf4be8fda35.mp3?i=0',
    'https://oss.jinse.cc/production/814df820-f4e9-4ebd-ab68-b70dfc3d4a84.mp3?i=1',
  ]
  const { width: innerWidth, height } = useInnerSize()
  const {
    audioEl,
    onPlayToggle,
    onPrev,
    onNext,
    currentTime,
    duration,
    isPlaying,
  } = useAudioPlayer(list)
  const width = Math.min(innerWidth, CONTAINER_MAX_WIDTH)
  const scale = width / CONTAINER_MAX_WIDTH
  const [isCdPlaying, setIsCdPlaying] = useState(false)

  useEffect(() => {
    if (isPlaying) {
      setTimeout(() => {
        setIsCdPlaying(true)
      }, 200)
    } else {
      setIsCdPlaying(false)
    }
  }, [isPlaying])

  const progress = currentTime / duration
  const armRotate =
    (ARM_RUN_RANGE[1] - ARM_RUN_RANGE[0]) * progress + ARM_RUN_RANGE[0]

  return (
    <StyledMainContainer style={{ minHeight: `${height}px` }}>
      <Box
        position="relative"
        w={`${CONTAINER_MAX_WIDTH}px`}
        userSelect="none"
        transformOrigin="top left"
        transition="200ms"
        style={{
          transform: `scale(${scale})`,
        }}
      >
        <Image src={BgPath} w="full" draggable="false" />
        <Box
          position="absolute"
          top="80px"
          left="40px"
          w="400px"
          zIndex={2}
          transformOrigin="92px 32px"
          transition="200ms"
          style={{
            transform: isPlaying ? `rotate(${armRotate}deg)` : undefined,
          }}
        >
          <Image
            src={StylusArmPath}
            transformOrigin="92px 32px"
            style={{
              animation: 'arm-run 0.2s infinite alternate',
            }}
            w="full"
            draggable="false"
          />
        </Box>
        <Image
          src={CDPath}
          w={'370px'}
          position="absolute"
          top="194px"
          left="65px"
          zIndex={1}
          draggable="false"
          style={{
            animation: `cd-run 5s infinite linear ${
              isCdPlaying ? 'running' : 'paused'
            }`,
          }}
        />
      </Box>
      {audioEl}

      <HStack
        borderTop="1px solid white"
        mt="auto"
        justify="center"
        spacing="10px"
        py="30px"
        position="relative"
      >
        <Box
          position="absolute"
          top="0"
          left="0"
          h="2px"
          w="1px"
          bg="white"
          opacity={0.5}
          transformOrigin="top left"
          transition="200ms"
          style={{
            transform: `scaleX(${Math.floor(progress * width)})`,
          }}
        />
        <Button onClick={onPrev}>Prev</Button>
        <Button onClick={onPlayToggle}>Play</Button>
        <Button onClick={onNext}>Next</Button>
      </HStack>
    </StyledMainContainer>
  )
}
