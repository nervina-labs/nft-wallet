import { Button } from '@mibao-ui/components'
import {
  Box,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Image,
} from '@chakra-ui/react'
import CopyLinkPath from '../../assets/share/icons/copy-link.svg'
import CreatePosterPath from '../../assets/share/icons/create-poster.svg'
import LoadingPath from '../../assets/share/icons/loading.svg'
import DownloadPath from '../../assets/share/icons/download.svg'
import MorePath from '../../assets/share/icons/more.svg'
import { useEffect, useMemo, useState } from 'react'
import { Nft, NftProps } from './components/posters/nft'
import { useHtml2Canvas } from '../../hooks/useHtml2Canvas'

enum PosterState {
  None,
  Creating,
  Created,
}

export enum PosterType {
  Nft = 'nft',
}

export interface ShareProps {
  isOpen: boolean
  onClose: () => void
  shareUrl: string
  poster?: {
    type: PosterType.Nft
    data: NftProps
  }
}

export const Share: React.FC<ShareProps> = ({
  isOpen,
  onClose,
  shareUrl,
  poster,
}) => {
  const [posterState, setPosterState] = useState(PosterState.None)
  const { posterIcon, posterText, posterAction } = useMemo(() => {
    if (posterState === PosterState.None) {
      return {
        posterIcon: CreatePosterPath,
        posterText: '生成分享图',
        posterAction: () => setPosterState(PosterState.Creating),
      }
    }
    if (posterState === PosterState.Creating) {
      return {
        posterIcon: LoadingPath,
        posterText: '生成中',
        posterAction: undefined,
      }
    }
    return {
      posterIcon: DownloadPath,
      posterText: '下载',
      posterAction: undefined,
    }
  }, [posterState])
  const [el, setEl] = useState<HTMLDivElement | null>(null)
  const { imgSrc } = useHtml2Canvas(el)
  useEffect(() => {
    if (imgSrc) {
      setPosterState(PosterState.Created)
    }
  }, [imgSrc])
  const showPosterEl =
    poster &&
    poster.type === PosterType.Nft &&
    posterState === PosterState.Creating

  const items = useMemo(
    () => [
      {
        icon: posterIcon,
        text: posterText,
        action: posterAction,
      },
      {
        icon: CopyLinkPath,
        text: '复制',
        action: undefined,
      },
      {
        icon: MorePath,
        text: '更多',
        action: undefined,
      },
    ],
    [posterAction, posterIcon, posterText]
  )

  return (
    <Drawer placement="bottom" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      {showPosterEl ? (
        <Box position="fixed" top="0" left="0" opacity="0" pointerEvents="none">
          <Nft {...poster.data} shareUrl={shareUrl} onLoaded={setEl} />
        </Box>
      ) : null}

      <DrawerContent bg="rgba(0, 0, 0, 0)" maxH="unset" h="100%">
        {imgSrc ? (
          <Image
            src={imgSrc}
            position="absolute"
            bottom="211px"
            left="50%"
            transform="translateX(-50%)"
            h="calc(100% - 231px)"
            maxW="500px"
            maxWidth="100%"
            objectFit="contain"
            zIndex={'calc(var(--chakra-zIndices-modal) + 1)'}
            p="20px"
          />
        ) : null}

        <Flex
          bg="rgba(255, 255, 255, 0.7)"
          backdropFilter="blur(15px)"
          w="full"
          maxW="500px"
          mx="auto"
          rounded="22px 22px 0 0"
          py="30px"
          direction="column"
          mt="auto"
        >
          <Flex overflowX="auto" overflowY="hidden" shrink={0}>
            {items.map((item, i) => (
              <Flex
                direction="column"
                ml="20px"
                minW="56px"
                key={i}
                onClick={item.action}
              >
                <Image
                  w="56px"
                  h="56px"
                  bg="white"
                  rounded="8px"
                  p="12px"
                  src={item.icon}
                />
                <Box
                  fontSize="12px"
                  whiteSpace="nowrap"
                  color="#777E90"
                  mt="8px"
                  textAlign="center"
                >
                  {item.text}
                </Box>
              </Flex>
            ))}
          </Flex>

          <Button
            isFullWidth
            mt="25px"
            variant="solid"
            size="lg"
            bg="white"
            rounded="44px"
            h="44px"
            fontSize="18px"
            fontWeight="normal"
            onClick={onClose}
            mx="20px"
            w="calc(100% - 40px)"
          >
            取消
          </Button>
        </Flex>
      </DrawerContent>
    </Drawer>
  )
}
