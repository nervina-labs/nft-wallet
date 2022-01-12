import styled from '@emotion/styled'
import { MainContainer } from '../../styles'
import { Box, Image, Button, HStack } from '@chakra-ui/react'
import { useInnerSize } from '../../hooks/useInnerSize'
import { CONTAINER_MAX_WIDTH } from '../../constants'
import { useAudioPlayer } from './hooks/useAudioPlayer'
import { useEffect, useState } from 'react'
import { CD } from './components/cd'
// import BgPath from '../../assets/album-player/bg.png'
import BrushedMetalPath from '../../assets/album-player/brushed-metal-bg.png'
import LightPath from '../../assets/album-player/light.png'
import DecorateControlPath from '../../assets/album-player/decorate-control.png'
import StylusArmPath from '../../assets/album-player/stylus-arm.png'

const StyledMainContainer = styled(MainContainer)`
  background-color: #000;
  position: relative;
  display: flex;
  flex-direction: column;

  @keyframes arm-run {
    0% {
      transform: rotate(-0.05deg);
    }
    100% {
      transform: rotate(0.05deg);
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
    'https://oss.jinse.cc/production/644b6076-af37-4934-a64f-011707efb53e.mp3?i=0',
    'https://oss.jinse.cc/production/814df820-f4e9-4ebd-ab68-b70dfc3d4a84.mp3?i=1',
  ]
  const cover =
    'https://oss.jinse.cc/production/78e719bc-b653-4b1b-b4bf-ce276988e127.webp'
  const [isCdPlaying, setIsCdPlaying] = useState(false)
  const { width: innerWidth, height } = useInnerSize()
  const width = Math.min(innerWidth, CONTAINER_MAX_WIDTH)
  const scale = width / CONTAINER_MAX_WIDTH
  const {
    index,
    onChangeIndex,
    audioEl,
    onPlayToggle,
    onPrev,
    onNext,
    currentTime,
    duration,
    isPlaying,
  } = useAudioPlayer(list)

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

  const albumTitle = '李健 - 依然'

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
          height: `${Math.floor(scale * 620)}px`,
        }}
      >
        <Box
          position="absolute"
          top="35px"
          right="20px"
          w="260px"
          h="40px"
          lineHeight="40px"
          bg="rgba(0, 0, 0, 1)"
          color="white"
          zIndex={2}
          fontSize="18px"
          rounded="100px"
          fontWeight="bold"
          textAlign="center"
          px="20px"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
          overflow="hidden"
        >
          {albumTitle}
        </Box>
        <Box
          position="absolute"
          top="91.5px"
          right="65px"
          zIndex={2}
          width="10px"
          height="5px"
          bg="rgb(255, 84, 0)"
          shadow="0 0 8px rgb(255, 84, 0)"
          rounded="1px"
          style={{
            opacity: isPlaying ? 1 : 0,
            transition: isPlaying ? '0ms' : '200ms',
          }}
        />
        <Image
          src={LightPath}
          w="56px"
          height="auto"
          draggable="false"
          position="absolute"
          top="514px"
          left="67px"
          zIndex={3}
          style={{
            opacity: isPlaying ? 1 : 0,
          }}
        />
        <Image src={BrushedMetalPath} w="full" draggable="false" />
        <Image
          src={DecorateControlPath}
          w="full"
          h="auto"
          position="absolute"
          top="0"
          left="0"
          draggable="false"
        />
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
              animation: `arm-run 0.2s infinite alternate ${
                isCdPlaying ? 'running' : 'paused'
              }`,
            }}
            w="full"
            draggable="false"
          />
        </Box>
        <CD
          src={cover}
          isPlaying={isCdPlaying}
          position="absolute"
          top="194px"
          left="65px"
          w="370px"
          h="370px"
          zIndex={1}
        />
      </Box>
      {audioEl}
      <Box w="full" color="white">
        {list.map((_, i) => (
          <Box
            key={i}
            opacity={index === i ? 1 : 0.5}
            onClick={() => {
              if (i === index) return
              onChangeIndex(i)
            }}
          >
            测试曲目 {i}
          </Box>
        ))}
      </Box>

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
