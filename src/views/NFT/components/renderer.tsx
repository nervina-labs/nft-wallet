import { NFTDetail, NftType } from '../../../models'
import Tilt from 'react-better-tilt'
import styled from 'styled-components'
import { HEADER_HEIGHT } from '../../../components/Appbar'
import {
  Box,
  Center,
  Flex,
  Image,
  Modal,
  ModalContent,
  ModalOverlay,
  Preview,
  useDisclosure,
} from '@mibao-ui/components'
import { TokenClass } from '../../../models/class-list'
import { ReactComponent as CardbackSvg } from '../../../assets/svg/card-back.svg'
import { ReactComponent as LockSvg } from '../../../assets/svg/lock.svg'
import { ReactComponent as NftPlaySvg } from '../../../assets/svg/nft-play.svg'
import { ReactComponent as ThreeDSvg } from '../../../assets/svg/3D.svg'
import { useTranslation } from 'react-i18next'
import FALLBACK_SRC from '../../../assets/img/nft-fallback.png'
import React, { useCallback, useState } from 'react'
import { CloseIcon } from '@chakra-ui/icons'
import { isSupportWebp } from '../../../utils'
import { useTilt } from '../hooks/useTilt'
import { ThreeDPreviewWithLoading } from '../../../components/ThreeDPreview'
import { useToast } from '../../../hooks/useToast'

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
      animation: flip-show 0.2s;
    }
    .flip-card-back {
      animation: flip-hide 0.2s;
      animation-fill-mode: forwards;
    }
  }

  .flip-card.flipped {
    transform: translateX(-100%) rotateY(-180deg);

    .flip-card-img {
      animation: flip-hide 0.2s;
      animation-fill-mode: forwards;
    }

    .flip-card-back {
      animation: flip-show 0.2s;
    }
  }

  @keyframes flip-show {
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

  @keyframes flip-hide {
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
  content?: string
  clickable: boolean
}> = ({ content, clickable = true }) => {
  const { t } = useTranslation('translations')
  const {
    isOpen: isFullScreen,
    onOpen: onFullScreen,
    onClose: unFullScreen,
  } = useDisclosure()

  return (
    <>
      <Box
        className="flip-card-back"
        rounded="30px"
        position="absolute"
        top="0"
        left="0"
        width="100%"
        height="100%"
        zIndex={2}
        transform="rotateY(180deg)"
        bg="rgba(255, 255, 255, 0.2)"
        backdropFilter="blur(20px)"
        overflow="hidden"
        userSelect="text"
        pointerEvents={clickable ? undefined : 'none'}
      >
        {typeof content === 'string' ? (
          <Box
            rounded="30px"
            overflow="auto"
            w="full"
            h="full"
            p="10px"
            dangerouslySetInnerHTML={{
              __html: content,
            }}
            onClick={clickable ? onFullScreen : undefined}
          />
        ) : (
          <Flex
            width="100%"
            height="100%"
            position="relative"
            direction="column"
          >
            <Center
              bg="rgba(255, 255, 255, 0.2)"
              m="auto"
              w="90px"
              h="90px"
              rounded="full"
            >
              <LockSvg />
            </Center>

            <Box
              bg="rgba(0, 0, 0, 0.3)"
              h="48px"
              lineHeight="48px"
              color="white"
              textAlign="center"
              fontSize="14px"
              whiteSpace="nowrap"
              textOverflow="ellipsis"
              overflow="hidden"
            >
              {t('nft.lock')}
            </Box>
          </Flex>
        )}
      </Box>

      <Modal isOpen={isFullScreen} onClose={unFullScreen}>
        <ModalOverlay />
        <ModalContent
          bg="rgba(255, 255, 255, 0.9)"
          p="20px"
          rounded="30px"
          backdropFilter="blur(10px)"
          w="95%"
          minH="70%"
        >
          <Center
            position="absolute"
            bg="white"
            rounded="full"
            top="20px"
            right="20px"
            w="25px"
            h="25px"
            onClick={unFullScreen}
            cursor="pointer"
          >
            <CloseIcon color="rgba(119, 126, 144, 0.5)" w="10px" h="10px" />
          </Center>
          <Box
            dangerouslySetInnerHTML={{
              __html: content as string,
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
  const { t, i18n } = useTranslation('translations')
  const hasCardBack =
    detail?.card_back_content_exist || detail?.class_card_back_content_exist
  const [showCardBackContent, setShowCardBackContent] = useState(false)
  const cardbackContent =
    detail?.class_card_back_content ?? detail?.card_back_content
  const hasCardback = Boolean(
    detail?.card_back_content_exist || detail?.class_card_back_content_exist
  )
  const { tiltAngleYInitial, shouldReverseTilt } = useTilt(hasCardback)
  const [imgLoaded, setImgLoaded] = useState(false)
  const {
    isOpen: isOpenPreview,
    onOpen: onOpenPreview,
    onClose: onClosePreview,
  } = useDisclosure()
  const toast = useToast()
  const onRendererError = useCallback(() => {
    toast(t('resource.fail'))
    onClosePreview()
  }, [onClosePreview, t, toast])
  const onPreview = useCallback(
    (e) => {
      if (!showCardBackContent) {
        onOpenPreview()
      }
      e.stopPropagation()
    },
    [onOpenPreview, showCardBackContent]
  )
  const hasPlayIcon =
    (detail?.renderer_type === NftType.Audio ||
      detail?.renderer_type === NftType.Video) &&
    imgLoaded
  const imgUrl = detail?.bg_image_url === null ? '' : detail?.bg_image_url
  const tid = (detail as NFTDetail)?.n_token_id

  return (
    <Flex
      mt={`-${HEADER_HEIGHT}px`}
      bg="gray.200"
      h="460px"
      w="100%"
      pt={`${HEADER_HEIGHT + 10}px`}
      position="relative"
      overflow="hidden"
      pb="60px"
    >
      <TiltContainer
        adjustGyroscope
        gyroscope
        tiltReverse={shouldReverseTilt}
        tiltEnable
        transitionSpeed={1000}
        tiltAngleYInitial={tiltAngleYInitial}
        onClick={onPreview}
      >
        <Box
          m="auto"
          w="auto"
          h="auto"
          position="relative"
          className={`flip-card ${showCardBackContent ? 'flipped' : ''} ${
            !cardbackContent ? 'keep-img' : ''
          }`}
          opacity={typeof detail?.bg_image_url === 'undefined' ? 0 : 1}
        >
          <Box position="relative" className="flip-card-img">
            <Image
              maxH="300px"
              src={imgUrl}
              rounded="30px"
              resizeScale={400}
              m="auto"
              webp={isSupportWebp()}
              fallbackSrc={FALLBACK_SRC}
              zIndex={3}
              onLoad={() => setImgLoaded(true)}
              srcQueryParams={tid ? { tid, locale: i18n.language } : {}}
            />
            {hasPlayIcon ? (
              <Box position="absolute" bottom="10px" right="10px" zIndex={4}>
                <NftPlaySvg />
              </Box>
            ) : null}
            {detail?.renderer_type === NftType.ThreeD && imgLoaded ? (
              <Center
                position="absolute"
                bottom="10px"
                right="10px"
                zIndex={4}
                rounded="100%"
                w="25px"
                h="25px"
                border="1px solid var(--chakra-colors-gray-200)"
                bg="linear-gradient(180deg, rgba(35, 38, 47, 0.5) 0%, rgba(35, 38, 47, 0) 100%)"
              >
                <ThreeDSvg />
              </Center>
            ) : null}
          </Box>
          {hasCardback ? (
            <CardBack
              clickable={showCardBackContent}
              content={cardbackContent}
            />
          ) : null}
        </Box>
      </TiltContainer>
      {detail && isOpenPreview ? (
        <Preview
          bgImgUrl={imgUrl}
          renderer={detail.renderer}
          isOpen={isOpenPreview}
          onClose={onClosePreview}
          render3D={(renderer) => (
            <ThreeDPreviewWithLoading
              src={renderer}
              onError={onRendererError}
            />
          )}
          type={detail?.renderer_type}
          onError={onRendererError}
        />
      ) : null}

      <Box position="absolute" top={0} left={0} w="100%" h="100%" zIndex={0}>
        <Image
          src={imgUrl}
          w="110%"
          h="110%"
          resizeScale={400}
          opacity={0.8}
          webp
          transform="translate(-5%, -5%)"
          filter="blur(50px) contrast(1.2)"
          fallbackSrc={FALLBACK_SRC}
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
    </Flex>
  )
}
