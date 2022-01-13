import styled from '@emotion/styled'
import { MainContainer } from '../../styles'
import { Box, Image, Button, HStack, Stack, Flex } from '@chakra-ui/react'
import { useInnerSize } from '../../hooks/useInnerSize'
import { CONTAINER_MAX_WIDTH } from '../../constants'
import { useAudioPlayer } from './hooks/useAudioPlayer'
import { useEffect, useState } from 'react'
import { CD } from './components/cd'
import BrushedMetalPath from '../../assets/album-player/brushed-metal-bg.png'
import LightPath from '../../assets/album-player/light.png'
import DecorateControlPath from '../../assets/album-player/decorate-control.png'
import StylusArmPath from '../../assets/album-player/stylus-arm.png'
import { ReactComponent as PrevSvg } from '../../assets/album-player/prev.svg'
import { ReactComponent as NextSvg } from '../../assets/album-player/next.svg'
import { ReactComponent as PlaySvg } from '../../assets/album-player/play.svg'
import { ReactComponent as StopSvg } from '../../assets/album-player/stop.svg'
import { ReactComponent as PlayingIconSvg } from '../../assets/album-player/playing-icon.svg'
import { ProgressBar } from './components/progressBar'

const StyledMainContainer = styled(MainContainer)`
  background-color: #000;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  padding-bottom: 132px;
  transition: 200ms;

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

const StyledPlayingIconSvg = styled(PlayingIconSvg)`
  height: 14px;
  margin: auto 5px auto 0;
  flex-shrink: 0;
`

const PlayButton = styled(Button)`
  width: 66px;
  height: 66px;
  display: inline-flex;
  justify-content: center;

  svg {
    transform: scale(0.6);
  }

  .play-icon {
    transform: scale(0.6) translateX(2px);
  }
`

const ARM_RUN_RANGE = [17, 36] as const

export const AlbumPlayer: React.FC = () => {
  const list = [
    'https://oss.jinse.cc/production/644b6076-af37-4934-a64f-011707efb53e.mp3?i=0',
    'https://oss.jinse.cc/production/814df820-f4e9-4ebd-ab68-b70dfc3d4a84.mp3?i=1',
    'https://oss.jinse.cc/production/644b6076-af37-4934-a64f-011707efb53e.mp3?i=2',
    'https://oss.jinse.cc/production/814df820-f4e9-4ebd-ab68-b70dfc3d4a84.mp3?i=3',
    'https://oss.jinse.cc/production/644b6076-af37-4934-a64f-011707efb53e.mp3?i=4',
    'https://oss.jinse.cc/production/814df820-f4e9-4ebd-ab68-b70dfc3d4a84.mp3?i=5',
    'https://oss.jinse.cc/production/644b6076-af37-4934-a64f-011707efb53e.mp3?i=6',
    'https://oss.jinse.cc/production/814df820-f4e9-4ebd-ab68-b70dfc3d4a84.mp3?i=7',
    'https://oss.jinse.cc/production/644b6076-af37-4934-a64f-011707efb53e.mp3?i=8',
    'https://oss.jinse.cc/production/814df820-f4e9-4ebd-ab68-b70dfc3d4a84.mp3?i=9',
  ]
  const cover =
    'https://oss.jinse.cc/production/78e719bc-b653-4b1b-b4bf-ce276988e127.webp'
  const [isCdPlaying, setIsCdPlaying] = useState(false)
  const { width: innerWidth, height } = useInnerSize()
  const width = Math.min(innerWidth, CONTAINER_MAX_WIDTH)
  const scale = width / CONTAINER_MAX_WIDTH
  const {
    index,
    willIndex,
    onChangeIndex,
    audioEl,
    onPlayToggle,
    onPrev,
    onNext,
    currentTime,
    duration,
    isPlaying,
    onChangeProgress,
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

  const progress = isNaN(currentTime / duration) ? 0 : currentTime / duration
  const cdProgress = Number(
    ((1 / list.length) * index + (1 / list.length) * progress).toFixed(5)
  )
  const armRotate =
    (ARM_RUN_RANGE[1] - ARM_RUN_RANGE[0]) * cdProgress + ARM_RUN_RANGE[0]
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
      <Stack w="full" color="white" px="20px" py="20px" spacing="10px">
        {list.map((_, i) => (
          <Flex
            key={i}
            cursor="pointer"
            onClick={() => {
              if (i === willIndex) return
              onChangeIndex(i)
            }}
            style={{ color: i !== willIndex ? '#666' : undefined }}
          >
            {i === willIndex ? <StyledPlayingIconSvg /> : null}
            <Box whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden">
              测试曲目 {i}
            </Box>
          </Flex>
        ))}
      </Stack>

      <HStack
        mt="auto"
        justify="center"
        spacing="10px"
        position="fixed"
        bottom="0"
        height="112px"
        bg="#000"
        transition="200ms"
        style={{
          width: `${width}px`,
        }}
      >
        <ProgressBar
          progress={progress}
          progressBarMaxWidth={width}
          onChangeProgress={onChangeProgress}
          position="absolute"
          top="0"
          left="0"
          m="0"
          zIndex={1}
        />
        <PlayButton onClick={onPrev} variant="unstyled">
          <PrevSvg />
        </PlayButton>
        <PlayButton
          onClick={onPlayToggle}
          variant="unstyled"
          border="0.5px solid white"
          rounded="full"
          style={{
            backgroundImage: isPlaying
              ? 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%)'
              : undefined,
          }}
        >
          {isPlaying ? <StopSvg /> : <PlaySvg className="play-icon" />}
        </PlayButton>
        <PlayButton onClick={onNext} variant="unstyled">
          <NextSvg />
        </PlayButton>
      </HStack>
    </StyledMainContainer>
  )
}
