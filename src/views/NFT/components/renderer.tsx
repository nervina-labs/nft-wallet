import { NFTDetail, NftType } from '../../../models'
import Tilt from 'react-better-tilt'
import styled from 'styled-components'
import { HEADER_HEIGHT } from '../../../components/Appbar'
import {
  Box,
  Center,
  Flex,
  HStack,
  Image,
  Modal,
  ModalContent,
  ModalOverlay,
  Preview,
  useDisclosure,
} from '@mibao-ui/components'
import { isTokenClass, TokenClass } from '../../../models/class-list'
import { ReactComponent as CardbackSvg } from '../../../assets/svg/card-back.svg'
import { ReactComponent as LockSvg } from '../../../assets/svg/lock.svg'
import { ReactComponent as NftPlaySvg } from '../../../assets/svg/nft-play.svg'
import { ReactComponent as ThreeDSvg } from '../../../assets/svg/3D.svg'
import { useTranslation } from 'react-i18next'
import FALLBACK_SRC from '../../../assets/img/nft-fallback.png'
import React, { lazy, useCallback, useMemo, useRef, useState } from 'react'
import { CloseIcon } from '@chakra-ui/icons'
import {
  addParamsToUrl,
  getNFTQueryParams,
  isSupportWebp,
  isUsdz,
} from '../../../utils'
import { useTilt } from '../hooks/useTilt'
import { useToast } from '../../../hooks/useToast'
import { LoadableComponent } from '../../../components/GlobalLoader'
import { trackLabels, useTrackEvent } from '../../../hooks/useTrack'
import { useParams } from 'react-router'
import { IS_SUPPORT_AR } from '../../../constants'
import { ArButton } from './arButton'
import { CD } from '../../../components/Cd'
import { AlbumPlayerDrawer } from './albumPlayerDrawer'

const ThreeDPreview = lazy(
  async () => await import('../../../components/ThreeDPreview')
)

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

const BgImage = styled(Box)`
  -webkit-backface-visibility: hidden;
  -webkit-perspective: 1000;
  -webkit-transform: translate3d(0, 0, 0);
  -webkit-transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000;
  transform: translate3d(0, 0, 0);
  transform: translateZ(0);
  filter: blur(50px) contrast(1);
`

const BottomButton = styled(Center)`
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  cursor: pointer;
  user-select: none;
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
        zIndex={3}
        transform="rotateY(180deg)"
        bg="rgba(222, 222, 222, 0.6)"
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
            bg="rgba(255, 255, 255, 0.6)"
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
              color="white"
              textAlign="center"
              fontSize="12px"
              textOverflow="ellipsis"
              overflow="hidden"
              px="20px"
              py="10px"
              bg="rgba(200, 200, 200, 0.5)"
              noOfLines={2}
            >
              {t('nft.lock')}
            </Box>
          </Flex>
        )}
      </Box>

      <Modal isOpen={isFullScreen} onClose={unFullScreen}>
        <ModalOverlay />
        <ModalContent
          bg="rgba(255, 255, 255, 0.95)"
          p="20px"
          pt="40px"
          rounded="30px"
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
  const { id } = useParams<{ id?: string }>()
  const { tiltAngleYInitial, shouldReverseTilt } = useTilt(hasCardback)
  const {
    isOpen: isOpenPreview,
    onOpen: onOpenPreview,
    onClose: onClosePreview,
  } = useDisclosure()
  const toast = useToast()
  const onRendererError = useCallback(() => {
    if (isOpenPreview) {
      toast(t('resource.fail'))
    }
  }, [t, toast, isOpenPreview])
  const trackCardBack = useTrackEvent('nft-detail-cardback', 'click')
  const trackPreview = useTrackEvent('nft-detail', 'click')
  const hasPlayIcon =
    detail?.renderer_type === NftType.Audio ||
    detail?.renderer_type === NftType.Video
  const tid = (detail as NFTDetail)?.n_token_id
  const tidParams = useMemo(() => getNFTQueryParams(tid, i18n.language) ?? {}, [
    i18n.language,
    tid,
  ])
  const imgUrl = detail?.bg_image_url === null ? '' : detail?.bg_image_url
  const arButtonRef = useRef<HTMLAnchorElement>(null)
  const isRendererUsdz = isUsdz(detail?.renderer)
  const {
    isOpen: isOpenAlbumPlayer,
    onOpen: onOpenAlbumPlayer,
    onClose: onCloseAlbumPlayer,
  } = useDisclosure()
  const onPreview = useCallback(
    (e) => {
      e.stopPropagation()
      if (!showCardBackContent) {
        if (detail?.renderer_type === NftType.Audio) {
          if ('album_audios' in detail) {
            onOpenAlbumPlayer()
          } else {
            toast(t('nft.only-the-owner-can-play'))
          }
          return
        }
        onOpenPreview()
      }
      trackPreview(trackLabels.nftDetail.check + id)
    },
    [
      detail,
      showCardBackContent,
      trackPreview,
      id,
      onOpenAlbumPlayer,
      toast,
      t,
      onOpenPreview,
    ]
  )

  const imageEl = useMemo(() => {
    if (detail?.renderer_type === NftType.Audio) {
      return (
        <Box position="relative" w="250px" h="250px">
          <Image
            src={detail.renderer}
            shadow="0 4px 4px rgba(0, 0, 0, 0.7)"
            w="full"
            h="250px"
            webp={isSupportWebp()}
            fallbackSrc={FALLBACK_SRC}
            srcQueryParams={tidParams}
            zIndex={3}
            position="relative"
            bg="#000"
          />
          <CD
            src={detail.renderer}
            top="45px"
            w="full"
            left="0"
            position="absolute"
            zIndex={2}
            tid={!isTokenClass(detail) ? detail.n_token_id : undefined}
          />
          <Box
            position="absolute"
            bottom="-12.5px"
            left={'calc(50% - 12.5px)'}
            zIndex={4}
          >
            <NftPlaySvg />
          </Box>
        </Box>
      )
    }

    return (
      <>
        <Image
          maxH="300px"
          src={imgUrl}
          rounded="30px"
          m="auto"
          webp={isSupportWebp()}
          fallbackSrc={FALLBACK_SRC}
          zIndex={2}
          srcQueryParams={tidParams}
          minW="100px"
          minH="100px"
          cursor="pointer"
        />
        {hasPlayIcon ? (
          <Box position="absolute" bottom="10px" right="10px" zIndex={4}>
            <NftPlaySvg />
          </Box>
        ) : null}
        {detail?.renderer_type === NftType.ThreeD ? (
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
      </>
    )
  }, [detail?.renderer, detail?.renderer_type, hasPlayIcon, imgUrl, tidParams])

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
      {detail && 'album_audios' in detail ? (
        <AlbumPlayerDrawer
          isLoading={!detail}
          data={detail}
          isOpen={isOpenAlbumPlayer}
          onClose={onCloseAlbumPlayer}
        />
      ) : null}
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
          <Box
            position="relative"
            className="flip-card-img"
            pointerEvents={showCardBackContent ? 'none' : undefined}
          >
            {imageEl}
          </Box>
          {hasCardback ? (
            <CardBack
              clickable={showCardBackContent}
              content={cardbackContent}
            />
          ) : null}
        </Box>
      </TiltContainer>
      {detail ? (
        <Preview
          bgImgUrl={addParamsToUrl(imgUrl, tidParams) || FALLBACK_SRC}
          renderer={addParamsToUrl(detail.renderer, tidParams)}
          isOpen={isOpenPreview}
          onClose={onClosePreview}
          render3D={(renderer) => {
            if (isRendererUsdz) {
              arButtonRef?.current?.click()
              onClosePreview()
              return
            }
            if (isOpenPreview) {
              return (
                <LoadableComponent>
                  <ThreeDPreview src={renderer} onError={onRendererError} />
                </LoadableComponent>
              )
            }
          }}
          bgImageOnError={() => {
            if (detail?.renderer_type === NftType.Picture) {
              onRendererError()
            }
          }}
          type={detail?.renderer_type}
          onError={onRendererError}
        />
      ) : null}

      <BgImage
        position="absolute"
        top={0}
        left={0}
        w="100%"
        h="100%"
        zIndex={0}
      >
        <Image
          src={imgUrl}
          w="110%"
          h="110%"
          opacity={0.8}
          webp={isSupportWebp()}
          transform="translate(-5%, -5%)"
          fallbackSrc={FALLBACK_SRC}
        />
      </BgImage>

      <HStack
        position="absolute"
        bottom="20px"
        w="full"
        justify="center"
        fontSize="12px"
        color="white"
        zIndex={2}
        lineHeight="25px"
        spacing="8px"
      >
        {isRendererUsdz ? (
          <BottomButton
            bg="rgba(0, 0, 0, 0.2)"
            rounded="8px"
            cursor="pointer"
            pr="6px"
            whiteSpace="nowrap"
            opacity={IS_SUPPORT_AR ? 1 : 0.5}
          >
            <ArButton href={detail?.renderer} ref={arButtonRef} />
          </BottomButton>
        ) : null}

        {hasCardBack ? (
          <BottomButton
            pr="6px"
            onClick={() => {
              if (!showCardBackContent) {
                trackCardBack(id)
              }
              setShowCardBackContent((bool) => !bool)
            }}
          >
            <CardbackSvg />
            {t('nft.show-card-back')}
          </BottomButton>
        ) : null}
      </HStack>
    </Flex>
  )
}
