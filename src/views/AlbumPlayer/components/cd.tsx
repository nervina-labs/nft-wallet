import { AspectRatio, Box, BoxProps, Image } from '@chakra-ui/react'
import styled from '@emotion/styled'
import CDPath from '../../../assets/album-player/cd.png'

const CDContainer = styled(Box)`
  @keyframes cd-run {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`

export interface CDProps extends BoxProps {
  isPlaying?: boolean
  src: string
}

export const CD: React.FC<CDProps> = ({ isPlaying, src, ...props }) => {
  return (
    <CDContainer
      position="relative"
      style={{
        animation: `cd-run 5s infinite linear ${
          isPlaying ? 'running' : 'paused'
        }`,
      }}
      {...props}
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
          <Image objectFit="cover" src={src} draggable="false" rounded="full" />
          <Box
            position="absolute"
            w="8px"
            h="8px"
            rounded="full"
            bg="#000"
            top="calc(50% - 4px)"
            left="calc(50% - 4px)"
            zIndex={2}
          />
        </Box>
      </AspectRatio>
    </CDContainer>
  )
}
