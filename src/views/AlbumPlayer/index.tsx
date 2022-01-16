import styled from '@emotion/styled'
import { MainContainer } from '../../styles'
import {
  Box,
  Image,
  Button,
  HStack,
  Stack,
  Flex,
  AspectRatio,
} from '@chakra-ui/react'
import { Image as MibaoImage } from '@mibao-ui/components'
import { useInnerSize } from '../../hooks/useInnerSize'
import { CONTAINER_MAX_WIDTH } from '../../constants'
import { useAudioPlayer } from './hooks/useAudioPlayer'
import { useEffect, useMemo, useState } from 'react'
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
import { Redirect, useParams } from 'react-router-dom'
import { useQueryNft } from './hooks/useQueryNft'
import { NftType } from '../../models'
import { RoutePath } from '../../routes'
import { CD } from '../../components/Cd'

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
      transform: rotate(-0.04deg);
    }
    100% {
      transform: rotate(0.04deg);
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

  @keyframes open-cd-cover {
    0%,
    30% {
      width: 300px;
      transform: translateY(50px) translateX(-50%) scale(1.1);
    }

    50%,
    100% {
      width: 300px;
      transform: translateY(-450px) translateX(-50%);
    }
  }

  @keyframes open-cd {
    0%,
    30% {
      width: 280px;
      transform: translateY(-60px) translateX(-50%) scale(1.1);
      z-index: 3;
    }
    40% {
      transform: translateY(-80px) translateX(-50%) scale(1.1);
      z-index: 3;
    }

    70%,
    100% {
      transform: translateY(0) translateX(-50%);
      z-index: 1;
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
  const { id } = useParams<{ id: string }>()
  const { data, isLoading } = useQueryNft(id)
  const [isCdPlaying, setIsCdPlaying] = useState(false)
  const { width: innerWidth, height } = useInnerSize()
  const width = Math.min(innerWidth, CONTAINER_MAX_WIDTH)

  const list = useMemo(
    () => data?.album_audios?.map((audio) => audio.url) || [],
    [data?.album_audios]
  )
  console.log('list: ', data, list)
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

  if (data && data?.renderer_type !== NftType.Audio) {
    return <Redirect to={`${RoutePath.NFT}/${id}`} />
  }

  return (
    <StyledMainContainer style={{ minHeight: `${height}px` }}>
      {isLoading ? (
        <Box position="absolute" top="0" left="0" w="100%" h="100%" bg="#000" />
      ) : null}

      <Box position="relative" w="full" userSelect="none">
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
          id="i123"
        />
        <Image
          src={LightPath}
          w="56px"
          height="auto"
          draggable="false"
          position="absolute"
          top="81%"
          left="13%"
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
          transition="200ms"
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
        <AspectRatio
          position="absolute"
          top="85px"
          left="50%"
          animation="open-cd-cover 3s forwards"
          transformOrigin="center"
          zIndex={4}
          shadow="0 4px 4px rgba(0, 0, 0, 0.7)"
          w="75%"
          ratio={1 / 1}
        >
          <MibaoImage src={data?.bg_image_url} w="full" />
        </AspectRatio>
        <Box
          position="absolute"
          w="74%"
          top="31.3%"
          left="50%"
          transform="translateX(-50%)"
          transformOrigin="center"
          animation="open-cd 3s"
        >
          <Box>
            <CD
              src={data?.bg_image_url ?? ''}
              isPlaying={isCdPlaying}
              w="full"
              h="full"
              zIndex={1}
            />
          </Box>
        </Box>
      </Box>
      {audioEl}
      <Stack w="full" color="white" px="20px" py="20px" spacing="10px">
        {data?.album_audios?.length}
        {data?.album_audios?.map((audio, i) => (
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
              {audio.name}
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
