import { AspectRatio, Box, BoxProps, Image } from '@chakra-ui/react'
import styled from '@emotion/styled'
import CDPath from '../../assets/album-player/cd.png'
import CDLightPath from '../../assets/album-player/cd-light.png'

const CDContainer = styled(Box)`
  @keyframes cd-run {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes cd-light-run {
    0% {
      transform: translateX(0) scale(2);
    }
    100% {
      transform: translateX(-200%) scale(2);
    }
  }
`

export interface CDProps extends BoxProps {
  isPlaying?: boolean
  src: string
}

export const CD: React.FC<CDProps> = ({ isPlaying, src, ...props }) => {
  return (
    <CDContainer position="relative" {...props}>
      <Box
        style={{
          animation: `cd-run 5s infinite linear ${
            isPlaying ? 'running' : 'paused'
          }`,
        }}
      >
        <Image
          w="full"
          h="full"
          objectFit="cover"
          src={CDPath}
          draggable="false"
          zIndex={1}
        />
        <AspectRatio
          w="32.5%"
          ratio={1 / 1}
          top="50%"
          left="50%"
          transform="translate(calc(-50% + 1px), -50%)"
          zIndex={1}
          position="absolute"
        >
          <Box>
            <Image
              objectFit="cover"
              src={src}
              draggable="false"
              rounded="full"
            />
            <Box
              position="absolute"
              w="8px"
              h="8px"
              rounded="full"
              bg="#000"
              top="calc(50% - 4px)"
              left="calc(50% - 4px)"
              zIndex={3}
            />
          </Box>
        </AspectRatio>
      </Box>

      <Box
        position="absolute"
        w="full"
        h="full"
        top="0"
        left="0"
        overflow="hidden"
      >
        <Image
          src={CDLightPath}
          draggable="false"
          zIndex={2}
          position="absolute"
          top="0"
          left="0"
          transform="scale(2)"
          transformOrigin="top left"
          style={{
            animation: `cd-light-run 300ms steps(2) infinite ${
              isPlaying ? 'running' : 'paused'
            }`,
          }}
        />
      </Box>
    </CDContainer>
  )
}
