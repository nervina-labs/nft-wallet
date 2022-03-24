import { Button } from '@mibao-ui/components'
import {
  Box,
  Center,
  CloseButton,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Image as RowImage,
  useClipboard,
} from '@chakra-ui/react'
import CopyLinkPath from '../../assets/share/icons/copy-link.svg'
import CreatePosterPath from '../../assets/share/icons/create-poster.svg'
import LoadingPath from '../../assets/share/icons/loading.svg'
import LoadingPathWhite from '../../assets/share/icons/loading-white.png'
import DownloadPath from '../../assets/share/icons/download.svg'
import MorePath from '../../assets/share/icons/more.svg'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Nft } from './components/posters/nft'
import { useHtml2Canvas } from '../../hooks/useHtml2Canvas'
import { useTranslation } from 'react-i18next'
import { downloadImage } from '../../utils'
import { useToast } from '../../hooks/useToast'
import { Issuer } from './components/posters/issuer'
import { Holder } from './components/posters/holder'
import styled from '@emotion/styled'
import { PosterType, ShareProps } from './share.interface'
import { useHistory } from 'react-router-dom'
import { IS_ANDROID, IS_WEXIN } from '../../constants'

const IconContainer = styled(RowImage)`
  &.loading {
    animation: loading 1.5s infinite linear;
  }
  @keyframes loading {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`

enum PosterState {
  None,
  Creating,
  Created,
}

export const Share: React.FC<ShareProps> = ({
  isOpen,
  onClose,
  shareUrl,
  poster,
  reloadByRoute,
}) => {
  const { t, i18n } = useTranslation('translations')
  const [posterState, setPosterState] = useState(PosterState.None)
  const toast = useToast()
  const onRenderError = useCallback(
    (e) => {
      toast(e)
    },
    [toast]
  )

  const option = useMemo(
    () => ({
      onError: onRenderError,
      toBlob: !(IS_ANDROID && IS_WEXIN),
    }),
    [onRenderError]
  )

  const { imgSrc, reload, onRender } = useHtml2Canvas(option)
  useEffect(() => {
    if (imgSrc) {
      setPosterState(PosterState.Created)
    }
  }, [imgSrc])
  const { onCopy } = useClipboard(shareUrl)
  const onDownload = useCallback(() => {
    const isSupportDownload = 'download' in document.createElement('a')
    if (!isSupportDownload || IS_WEXIN) {
      toast(t('common.share.long-press-to-save'))
      return
    }
    if (imgSrc) {
      downloadImage(imgSrc, 'poster.png')
    }
  }, [imgSrc, t, toast])
  const onCopyShareUrl = useCallback(() => {
    onCopy()
    toast(t('common.share.copied'))
  }, [onCopy, t, toast])
  const onShare = useCallback(() => {
    if (!navigator?.share) return
    navigator.share({
      url: shareUrl,
    })
  }, [shareUrl])
  const { posterIcon, posterText, posterAction } = useMemo(() => {
    if (posterState === PosterState.None) {
      return {
        posterIcon: CreatePosterPath,
        posterText: t('common.share.icons.create-poster'),
        posterAction: () => setPosterState(PosterState.Creating),
      }
    }
    if (posterState === PosterState.Creating) {
      return {
        posterIcon: LoadingPath,
        posterText: t('common.share.icons.creating'),
        posterAction: undefined,
      }
    }
    return {
      posterIcon: DownloadPath,
      posterText: t('common.share.icons.download'),
      posterAction: onDownload,
    }
  }, [onDownload, posterState, t])
  const items = useMemo(
    () =>
      [
        {
          icon: posterIcon,
          text: posterText,
          action: posterAction,
          id: 'poster',
        },
        {
          icon: CopyLinkPath,
          text: t('common.share.icons.copy'),
          action: onCopyShareUrl,
          id: 'copy-link',
        },
      ].concat(
        navigator?.share !== undefined
          ? [
              {
                icon: MorePath,
                text: t('common.share.icons.more'),
                action: onShare,
                id: 'more',
              },
            ]
          : []
      ),
    [onCopyShareUrl, onShare, posterAction, posterIcon, posterText, t]
  )
  const showPoster =
    posterState === PosterState.Creating || posterState === PosterState.Created
  const creatingPoster = poster && posterState === PosterState.Creating
  const { location } = useHistory()

  const reloadKey = useMemo(() => {
    if (!reloadByRoute) {
      return ''
    }
    return location.pathname + location.search
  }, [location.pathname, location.search, reloadByRoute])

  useEffect(() => {
    setPosterState(PosterState.None)
    reload()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadKey])

  return (
    <Drawer placement="bottom" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent bg="rgba(0, 0, 0, 0)" maxH="unset" h="100%">
        {isOpen ? (
          <>
            {creatingPoster ? (
              <Box
                position="fixed"
                top="0"
                left="0"
                opacity="0"
                fontFamily="Poppins"
              >
                {poster.type === PosterType.Nft && (
                  <Nft
                    {...poster.data}
                    shareUrl={shareUrl}
                    onLoaded={onRender}
                  />
                )}
                {poster.type === PosterType.Issuer && (
                  <Issuer
                    {...poster.data}
                    shareUrl={shareUrl}
                    onLoaded={onRender}
                  />
                )}
                {poster.type === PosterType.Holder && (
                  <Holder
                    {...poster.data}
                    shareUrl={shareUrl}
                    onLoaded={onRender}
                  />
                )}
              </Box>
            ) : null}
            {showPoster && !!imgSrc && (
              <Box top="20px" left="20px" zIndex={999} position="absolute">
                <CloseButton
                  color="white"
                  size="lg"
                  h="50px"
                  w="50px"
                  border="none"
                  onClick={() => {
                    setPosterState(PosterState.None)
                    reload()
                    onClose?.()
                  }}
                />
              </Box>
            )}
            {showPoster ? (
              <Box
                position="absolute"
                bottom="211px"
                maxW="500px"
                left="50%"
                top="50%"
                transform="translate(-50%, -48%)"
                h="90%"
                zIndex={'calc(var(--chakra-zIndices-modal) + 1)'}
                p="20px"
                w="100%"
              >
                <RowImage
                  src={imgSrc}
                  m="auto"
                  h="auto"
                  w="auto"
                  maxW="100%"
                  maxH="100%"
                  objectFit="contain"
                  rounded="20px"
                />
                {!imgSrc && (
                  <IconContainer
                    position="absolute"
                    top="50%"
                    left="50%"
                    mt="-25px"
                    ml="-25px"
                    w="50px"
                    h="50px"
                    src={LoadingPathWhite}
                    className="loading"
                  />
                )}
                {!!imgSrc && (
                  <Box
                    bg="rgba(0,0,0,0.5)"
                    mt="20px"
                    h="40px"
                    fontSize={i18n.language !== 'en' ? '14px' : '12px'}
                    textAlign="center"
                    lineHeight="40px"
                    w="100%"
                    color="white"
                    borderRadius="76px"
                  >
                    {t('common.share.long-press-or-save')}
                  </Box>
                )}
              </Box>
            ) : null}

            {!showPoster && (
              <Flex
                bg="linear-gradient(0deg, rgba(255, 255, 255, 0.8) 100%, #F2F2F2 100%);"
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
                      ml="10px"
                      minW="56px"
                      key={i}
                      onClick={item.action}
                      w="80px"
                      cursor="pointer"
                    >
                      <Center
                        w="56px"
                        h="56px"
                        bg="white"
                        rounded="8px"
                        p="12px"
                        mx="auto"
                      >
                        <IconContainer
                          src={item.icon}
                          className={
                            item.id === 'poster' && creatingPoster
                              ? 'loading'
                              : ''
                          }
                        />
                      </Center>
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
                  {t('common.share.cancel')}
                </Button>
              </Flex>
            )}
          </>
        ) : null}
      </DrawerContent>
    </Drawer>
  )
}

export default Share
