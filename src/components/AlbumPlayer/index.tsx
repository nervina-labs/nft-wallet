import styled from '@emotion/styled'
import { Box, Image, Button, Flex, useDisclosure } from '@chakra-ui/react'
import { useEffect, useMemo, useState } from 'react'
import { useObservable } from 'rxjs-hooks'
import { map, timer } from 'rxjs'
import { useInnerSize } from '../../hooks/useInnerSize'
import { CONTAINER_MAX_WIDTH } from '../../constants'
import { useAudioPlayer } from './hooks/useAudioPlayer'
import { NFTDetail } from '../../models'
import { CD } from '../../components/Cd'
import { PlayListDrawer } from './components/playListDrawer'
import { PlayingIcon } from './components/playingIcon'
import { ProgressBar } from './components/progressBar'
import BrushedMetalPath from '../../assets/album-player/brushed-metal-bg.png'
import LightPath from '../../assets/album-player/light.png'
import DecorateControlPath from '../../assets/album-player/decorate-control.png'
import StylusArmPath from '../../assets/album-player/stylus-arm.png'
import { ReactComponent as PrevSvg } from '../../assets/album-player/prev.svg'
import { ReactComponent as NextSvg } from '../../assets/album-player/next.svg'
import { ReactComponent as PlaySvg } from '../../assets/album-player/play.svg'
import { ReactComponent as StopSvg } from '../../assets/album-player/stop.svg'
import { ReactComponent as PlayListSvg } from '../../assets/album-player/play-list.svg'

const Container = styled(Box)`
  background-color: #000;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  padding-bottom: 200px;
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

  @keyframes open-cd {
    0%,
    30% {
      transform: translateY(-40px);
      z-index: 3;
    }
    38% {
      transform: translateY(-80px);
      z-index: 3;
    }

    80%,
    100% {
      transform: translateY(0);
      z-index: 1;
    }
  }
`

const StyledPlayListSvg = styled(PlayListSvg)`
  height: 14px;
  margin: auto 5px auto auto;
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
const STYLUS_ARM_TRANSITION = 200

export const AlbumPlayer: React.FC<{
  data: NFTDetail
  isLoading?: boolean
}> = ({ data, isLoading = true }) => {
  const [isCdPlaying, setIsCdPlaying] = useState(false)
  const { width: innerWidth, height } = useInnerSize({ dueTime: 0 })
  const width = Math.min(innerWidth, CONTAINER_MAX_WIDTH)
  const scale = width / CONTAINER_MAX_WIDTH
  const list = useMemo(
    () => data?.album_audios?.map((audio) => audio.url) || [],
    [data?.album_audios]
  )
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
      // wait the arm animation
      setTimeout(() => {
        setIsCdPlaying(true)
      }, STYLUS_ARM_TRANSITION)
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

  const {
    isOpen: isOpenList,
    onOpen: onOpenList,
    onClose: onCloseList,
  } = useDisclosure()

  const isReleaseCdWidth = useObservable(
    () => timer(1000).pipe(map(() => true)),
    false
  )
  const isClosedCoverAnimation = useObservable(
    () => timer(1500).pipe(map(() => true)),
    false
  )
  const [coverCdTransition, setCoverCdTransition] = useState('500ms')

  return (
    <Container
      style={{
        minHeight: `${height}px`,
        pointerEvents: isClosedCoverAnimation ? undefined : 'none',
      }}
    >
      {isLoading ? (
        <Box position="absolute" top="0" left="0" w="100%" h="100%" bg="#000" />
      ) : null}

      <Box
        position="relative"
        w="full"
        userSelect="none"
        style={{
          height: `${Math.floor(620 * scale)}px`,
        }}
      >
        <Box
          position="absolute"
          top="5%"
          right="5%"
          w="50%"
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
          {data?.name}
        </Box>
        <Box
          position="absolute"
          top="14.9%"
          right="13%"
          zIndex={2}
          width="2.1%"
          height="0.6%"
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
          w="12%"
          height="auto"
          draggable="false"
          position="absolute"
          top="82.2%"
          left="13.4%"
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
          w="full"
          position="absolute"
          top="0"
          left="0"
          transformOrigin="26.5% 57%"
          transition={`${STYLUS_ARM_TRANSITION}ms`}
          style={{
            transform: isPlaying ? `rotate(${armRotate}deg)` : undefined,
          }}
          zIndex={2}
        >
          <Image
            src={StylusArmPath}
            w="80%"
            ml="8%"
            mt="16%"
            transformOrigin="23% 28%"
            userSelect="none"
            draggable={false}
            style={{
              animation: `arm-run 0.2s infinite alternate ${
                isCdPlaying ? 'running' : 'paused'
              }`,
            }}
          />
        </Box>
        <Box
          position="absolute"
          w="74%"
          top="31.3%"
          left="50%"
          transformOrigin="center"
          animation="open-cd 3s"
          style={{
            width: !isReleaseCdWidth ? '80%' : undefined,
            left: `calc(50% - ${
              (!isReleaseCdWidth ? width * 0.8 : width * 0.74) / 2
            }px)`,
            transition: coverCdTransition,
          }}
          onAnimationEnd={() => setCoverCdTransition('0ms')}
        >
          <Box>
            <CD
              src={data?.renderer ?? ''}
              isPlaying={isCdPlaying}
              w="full"
              h="full"
              zIndex={1}
              tid={data.n_token_id}
            />
          </Box>
        </Box>
      </Box>
      {audioEl}

      <PlayListDrawer
        width={width}
        onClose={onCloseList}
        isOpen={isOpenList}
        onChangeIndex={onChangeIndex}
        index={willIndex}
        data={data}
      />

      <Flex
        direction="column"
        mt="auto"
        justify="center"
        position="fixed"
        bottom="0"
        height="180px"
        bg="#000"
        transition="200ms"
        maxW={`calc(${CONTAINER_MAX_WIDTH}px + var(--removed-body-scroll-bar-size))`}
        w="full"
        left="50%"
        transform="translateX(-50%)"
        zIndex={10}
      >
        <Flex
          h="70px"
          lineHeight="70px"
          w="full"
          align="center"
          onClick={onOpenList}
          color="white"
          cursor="pointer"
        >
          <Box ml="15px" mr="10px">
            <PlayingIcon />
          </Box>
          <Box whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
            {data?.album_audios?.[willIndex]?.name}
          </Box>
          <Box ml="auto" mr="15px">
            <StyledPlayListSvg />
          </Box>
        </Flex>
        <Flex
          w="full"
          height="110px"
          m="0"
          justify="center"
          align="center"
          position="relative"
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
          <PlayButton onClick={onPrev} variant="unstyled" mr="10px">
            <PrevSvg />
          </PlayButton>
          <PlayButton
            onClick={onPlayToggle}
            variant="unstyled"
            border="1px solid white"
            rounded="full"
            mr="10px"
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
        </Flex>
      </Flex>
    </Container>
  )
}
