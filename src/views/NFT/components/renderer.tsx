import { NFTDetail } from '../../../models'
import Tilt from 'react-better-tilt'
import styled from 'styled-components'
import { HEADER_HEIGHT } from '../../../components/Appbar'
import {
  Box,
  Center,
  Image,
  Modal,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from '@mibao-ui/components'
import { TokenClass } from '../../../models/class-list'
import { ReactComponent as CardbackSvg } from '../../../assets/svg/card-back.svg'
import { useTranslation } from 'react-i18next'
import FallbackAvatarSrc from '../../../assets/svg/fallback.svg'
import { useState } from 'react'
import { CloseIcon } from '@chakra-ui/icons'
import { isSupportWebp } from '../../../utils'

const TiltContainer = styled(Tilt)`
  position: relative;
  max-width: calc(100% - 60px);
  aspect-ratio: 1/1;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  margin: auto;
  max-height: 340px;

  &.disabled {
    transform: none !important;
  }

  .flip-card {
    transform-style: preserve-3d;
    transform-origin: center right;
    transition: transform 0.4s;
    .flip-card-img {
      animation: flip-card-img-show 0.2s;
    }
  }

  .flip-card.flipped {
    transform: translateX(-100%) rotateY(-180deg);

    .flip-card-img {
      animation: flip-card-img-hide 0.2s;
      animation-fill-mode: forwards;
      pointer-events: none;
    }
  }

  @keyframes flip-card-img-show {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 0;
    }
    51% {
      opacity: 1;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes flip-card-img-hide {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 1;
    }
    51% {
      opacity: 0;
    }
    100% {
      opacity: 0;
    }
  }
`

const CardBack: React.FC<{
  content: string
  clickable: boolean
}> = ({ content, clickable = true }) => {
  const {
    isOpen: isFullScreen,
    onOpen: onFullScreen,
    onClose: unFullScreen,
  } = useDisclosure()

  return (
    <>
      <Box
        rounded="30px"
        position="absolute"
        top="0"
        left="0"
        width="100%"
        height="100%"
        zIndex={2}
        bg="rgba(255, 255, 255, 0.5)"
        transform="rotateY(180deg)"
        overflow="auto"
        p="10px"
        dangerouslySetInnerHTML={{
          __html: content,
        }}
        onClick={clickable ? onFullScreen : undefined}
      />

      <Modal isOpen={isFullScreen} onClose={unFullScreen}>
        <ModalOverlay />
        <ModalContent
          bg="rgba(255, 255, 255, 0.9)"
          p="20px"
          rounded="30px"
          backdropFilter="blur(10px)"
          w="95%"
        >
          <Center
            position="absolute"
            bg="white"
            rounded="full"
            top="20px"
            right="20px"
            w="20px"
            h="20px"
            onClick={unFullScreen}
            cursor="pointer"
          >
            <CloseIcon color="rgba(119, 126, 144, 0.5)" w="10px" h="10px" />
          </Center>
          <Box
            dangerouslySetInnerHTML={{
              __html: content,
            }}
          />
        </ModalContent>
      </Modal>
    </>
  )
}

export const Renderer: React.FC<{ detail?: NFTDetail | TokenClass }> = ({
  detail,
}) => {
  const { t } = useTranslation('translations')
  const hasCardBack =
    detail?.card_back_content_exist || detail?.class_card_back_content_exist
  const [showCardBackContent, setShowCardBackContent] = useState(false)

  return (
    <Box
      mt={`-${HEADER_HEIGHT}px`}
      bg="gray.200"
      h="460px"
      w="100%"
      pt={`${HEADER_HEIGHT + 10}px`}
      position="relative"
      overflow="hidden"
    >
      <TiltContainer
        tiltReverse
        adjustGyroscope
        gyroscope
        tiltEnable
        transitionSpeed={1000}
      >
        <Box
          m="auto"
          w="auto"
          h="auto"
          position="relative"
          className={`flip-card ${showCardBackContent ? 'flipped' : ''}`}
          opacity={!detail?.bg_image_url ? 0 : 1}
        >
          <Image
            maxH="300px"
            src={detail?.bg_image_url}
            rounded="30px"
            resizeScale={400}
            m="auto"
            webp={isSupportWebp()}
            fallbackSrc={FallbackAvatarSrc}
            zIndex={3}
            className="flip-card-img"
          />
          <CardBack
            clickable={showCardBackContent}
            content={
              detail?.class_card_back_content ?? detail?.card_back_content ?? ''
            }
          />
        </Box>
      </TiltContainer>

      <Box position="absolute" top={0} left={0} w="100%" h="100%" zIndex={0}>
        <Image
          src={detail?.bg_image_url}
          w="110%"
          h="110%"
          resizeScale={400}
          opacity={0.8}
          webp
          transform="translate(-5%, -5%)"
          filter="blur(50px) contrast(1.2)"
          fallbackSrc={FallbackAvatarSrc}
        />
      </Box>

      {hasCardBack ? (
        <Center position="absolute" bottom="20px" w="full" transition="0.2s">
          <Center
            zIndex={2}
            position="relative"
            color="white"
            fontSize="12px"
            bg="rgba(0, 0, 0, 0.4)"
            rounded="8px"
            pr="6px"
            cursor="pointer"
            userSelect="none"
            onClick={() => setShowCardBackContent((bool) => !bool)}
          >
            <CardbackSvg />
            {t('nft.show-card-back')}
          </Center>
        </Center>
      ) : null}
    </Box>
  )
}
