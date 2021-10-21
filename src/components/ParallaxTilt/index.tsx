/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import Tilt from 'react-better-tilt'
import { LazyLoadImage } from '../Image'
import FallbackImg from '../../assets/svg/fallback.svg'
import { ReactComponent as PlayerSvg } from '../../assets/svg/player.svg'
import { ReactComponent as DotSvg } from '../../assets/svg/dot.svg'
import { ReactComponent as LockSvg } from '../../assets/svg/lock.svg'
import lockpng from '../../assets/img/lock.png'
import { ReactComponent as CloseSvg } from '../../assets/svg/close.svg'
import classNames from 'classnames'
import styled from 'styled-components'
import { IS_IPHONE, IS_MAC_SAFARI, IS_SAFARI } from '../../constants'
import { Player } from '../Player'
import { NftType } from '../../models'
import { PhotoProvider } from 'react-photo-view'
import { useTranslation } from 'react-i18next'
import { Dialog } from '@material-ui/core'
import { useSnackbar } from '../../hooks/useSnackbar'
import { downloadCardBackPDF, disableImagePreviewContext } from '../../utils'

export interface ParallaxTiltProps {
  src: string | undefined
  width: number
  height: number
  onColorDetected: (color: string) => void
  onFallBackImageLoaded: () => void
  enable: boolean
  renderer?: string
  type?: NftType
  tiltRef?: React.RefObject<Tilt>
  flipped?: boolean
  cardBackContent?: string
}

const Container = styled(Tilt)`
  position: relative;
  /* margin: auto; */
  display: flex;
  align-items: center;
  justify-content: center;

  &.disabled {
    transform: none !important;
  }

  .player {
    position: absolute;
    right: 10px;
    bottom: 10px;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }

  .flip-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    cursor: pointer;
    transform-style: preserve-3d;
    transform-origin: center right;
    transition: transform 0.5s;
  }

  .flipped {
    transform: translateX(-100%) rotateY(-180deg);
  }

  .flip-card-front {
    > div {
      position: relative;
    }
    &.hide {
      opacity: 0;
    }

    transition: opacity 0.5s;
  }

  .flip-card-front,
  .flip-card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .flip-card-back {
    transform: rotateY(180deg);
    .card-back {
      border-radius: 10px;
      position: relative;
      .bottom-right,
      .bottom-left,
      .top-right,
      .top-left {
        position: absolute;
      }
      .top-left {
        top: 6px;
        left: 6px;
      }
      .top-right {
        top: 6px;
        right: 6px;
      }
      .bottom-left {
        bottom: 6px;
        left: 6px;
      }
      .bottom-right {
        bottom: 6px;
        right: 6px;
      }
      .card-back-container {
        overflow: auto;
        margin: 16px;
      }
      /* backdrop-filter: blur(40px); */
      /* border: 5px solid rgb(165, 165, 165); */
      background: linear-gradient(
          180deg,
          rgba(255, 255, 255, 0.2) 0%,
          rgba(0, 0, 0, 0.2) 100%
        ),
        rgba(143, 137, 137, 0.65);
      /* box-shadow: inset 0px 0px 8px rgba(122, 122, 122, 0.95); */
      /* backdrop-filter: blur(40px); */
    }
  }
`

const AudioContainer = styled.div`
  position: fixed;
  bottom: 10px;
  width: calc(100% - 20px);
  max-width: 500px;
  transform: translateX(-50%);
  left: 50%;

  audio {
    width: 100%;
    height: 36px;
  }
`

interface CardbackProps {
  width: number | undefined
  height: number | undefined
  content?: string
  openPreview: () => void
}

const CardbackContainer = styled.div`
  border-radius: 10px;
  position: relative;
  overflow: auto;
  outline: none;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  .bottom-right,
  .bottom-left,
  .top-right,
  .top-left {
    position: absolute;
  }
  .top-left {
    top: 6px;
    left: 6px;
  }
  .top-right {
    top: 6px;
    right: 6px;
  }
  .bottom-left {
    bottom: 6px;
    left: 6px;
  }
  .bottom-right {
    bottom: 6px;
    right: 6px;
  }
  .card-back-container {
    margin: 16px;
    width: calc(100% - 32px);
    overflow-y: auto;
    &.center {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }
    audio {
      max-width: 100%;
    }
  }
  .lock {
    width: calc(50% + 16px);
    background: rgba(0, 0, 0, 0.2);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
      width: 50%;
      height: 50%;
    }
    img {
      width: 50%;
      height: 50%;
    }
  }
  .desc {
    /* text-shadow: 0px 4px 4px rgba(254, 160, 5, 0.04); */
    font-size: 16px;
    margin-top: 20px;
    color: #4f4f4f;
    font-weight: 600;
    text-align: center;
  }
  background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.2) 0%,
      rgba(0, 0, 0, 0.2) 100%
    ),
    rgba(143, 137, 137, 0.65);
`

const CardbackPreviewContainer = styled(CardbackContainer)`
  max-width: 500px;
  width: 100%;
  height: 100%;
  .close {
    position: fixed;
    right: 10px;
    top: 10px;
  }
  .full-card-back-content {
    margin: 20px;
    width: calc(100% - 40px);
    height: calc(100% - 40px);
    overflow: auto;
  }
`

const Cardback: React.FC<CardbackProps> = ({
  width,
  height,
  content,
  openPreview,
}) => {
  const [t] = useTranslation('translations')
  const hasContent = !!content
  const lockHeight = useMemo(() => {
    const w = width ?? 0
    const h = height ?? 0
    if (w < h) {
      return `${w / 2}px`
    }
    return `${h / 2}px`
  }, [width, height])

  useLayoutEffect(() => {
    if (content) {
      downloadCardBackPDF('.card-back-content')
    }
  }, [content])

  return (
    <CardbackContainer
      style={{
        width: `${width ?? 0}px`,
      }}
      onClick={openPreview}
    >
      <DotSvg className="top-left" />
      <DotSvg className="top-right" />
      <DotSvg className="bottom-left" />
      <DotSvg className="bottom-right" />
      <div
        className={classNames('card-back-container', { center: !hasContent })}
        style={{
          height: `${(height ?? 36) - 36}px`,
        }}
      >
        {content ? (
          <div
            className="card-back-content"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <>
            <div
              className="lock"
              style={{ height: lockHeight, width: lockHeight }}
            >
              {IS_SAFARI ? <img alt="lock" src={lockpng} /> : <LockSvg />}
            </div>
            {(width ?? 0) > 200 ? (
              <span className="desc">{t('nft.lock')}</span>
            ) : null}
          </>
        )}
      </div>
    </CardbackContainer>
  )
}

export const ParallaxTilt: React.FC<ParallaxTiltProps> = ({
  src,
  onColorDetected,
  width,
  height,
  onFallBackImageLoaded,
  enable,
  type,
  renderer,
  tiltRef,
  flipped,
  cardBackContent,
}) => {
  const [isTiltEnable, setIsTileEnable] = useState(false)
  const isTouchDevice = useMemo(() => {
    return 'ontouchstart' in document.documentElement
  }, [])
  const [enableGyroscope, setEnableGyroscope] = useState(isTouchDevice)
  const [isPlayerOpen, setIsPlayerOpen] = useState(false)
  const { snackbar } = useSnackbar()
  const [t] = useTranslation('translations')
  const shouldReverseTilt = useMemo(() => {
    if (!isTouchDevice) {
      return true
    }
    return !enableGyroscope
  }, [isTouchDevice, enableGyroscope])
  const timer = useRef<NodeJS.Timeout>()
  const enableImagePreview =
    type === NftType.Picture || (Boolean(src) && type === NftType.Audio)
  const isAudioOrVideo = type === NftType.Audio || type === NftType.Video
  const enablePlayer =
    !enableImagePreview && (isAudioOrVideo || type === NftType._3D)
  const [
    photoPreviewToolbarAudioVisible,
    setPhotoPreviewToolbarAudioVisible,
  ] = useState(false)
  const photoPreviewToolbarAudioRef = useRef<HTMLAudioElement>(null)
  const onTouchMove = (e: TouchEvent): void => {
    const target = e.target as any
    if (target?.className?.includes?.('ParallaxTilt')) {
      e.preventDefault()
    }
  }
  useEffect(() => {
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    return () => {
      window.removeEventListener('touchmove', onTouchMove)
      clearBackdrop()
    }
  }, [])

  const openPreview = (): void => {
    if (!enableImagePreview) {
      setIsPlayerOpen(true)
    }
  }
  const onContainerLeave = (): void => {
    setEnableGyroscope(true)
    timer.current && clearTimeout(timer.current)
    if (!isTouchDevice) {
      timer.current = setTimeout(() => {
        const autoResetEvent = new CustomEvent('autoreset')
        try {
          // @ts-expect-error
          tiltRef.current?.onMove(autoResetEvent)
        } catch (error) {
          //
        }
      }, 1500)
    }
  }
  const onError = (): void => {
    if (isPlayerOpen) {
      snackbar(t('resource.fail'))
    }
    setIsPlayerOpen(false)
  }

  // 44 = header, 300 = nft detail, 30 * 2 = margin
  const imageMaxHeight = `${window.innerHeight - 44 - 300 - 30 * 2}px`
  const imageRef = useRef<HTMLImageElement>(null)
  const hasCardCackContent = !!cardBackContent
  const [isPreviewCardback, setIsPreviewCardback] = useState(false)
  const clearBackdrop = () => {
    const root = document.getElementById('root')
    if (root) {
      root.style.filter = ''
    }
  }
  const closePreviewCardback = (): void => {
    setIsPreviewCardback(false)
    clearBackdrop()
  }
  const openPreviewCardback = (): void => {
    if (!hasCardCackContent) {
      return
    }
    setIsPreviewCardback(true)
    const root = document.getElementById('root')
    if (root) {
      root.style.filter = 'blur(10px)'
    }
  }

  const shouldEnableTile = useMemo(() => {
    if (flipped && !isTouchDevice) {
      return false
    }
    if (flipped && !hasCardCackContent) {
      return false
    }
    return isTiltEnable && enable
  }, [isTiltEnable, enable, flipped, isTouchDevice, hasCardCackContent])

  return (
    <>
      <Container
        tiltReverse={shouldReverseTilt}
        reset={false}
        tiltEnable={shouldEnableTile}
        disableTouch
        tiltAngleYInitial={
          !isTouchDevice && !hasCardCackContent ? 15 : undefined
        }
        adjustGyroscope
        ref={tiltRef}
        className={classNames({
          disabled: (!enable && IS_IPHONE) || (isPlayerOpen && IS_MAC_SAFARI),
        })}
        transitionSpeed={1000}
        gyroscope={enableGyroscope}
        onEnter={() => {
          setEnableGyroscope(false)
          timer.current && clearInterval()
        }}
        onLeave={onContainerLeave}
      >
        <div
          className={classNames('flip-card-inner', { flipped })}
          style={{ maxHeight: imageMaxHeight, width, maxWidth: width }}
        >
          <div
            onClick={openPreview}
            className={classNames('flip-card-front', { hide: flipped })}
          >
            <div ref={imageRef}>
              <PhotoProvider
                maskClassName="preview-mask"
                onVisibleChange={(visible) => {
                  setPhotoPreviewToolbarAudioVisible(visible)
                  requestAnimationFrame(() =>
                    disableImagePreviewContext(visible)
                  )
                  if (visible) {
                    setTimeout(() => {
                      photoPreviewToolbarAudioRef?.current?.play()
                    })
                  }
                }}
                toolbarRender={() =>
                  type === NftType.Audio && photoPreviewToolbarAudioVisible ? (
                    <AudioContainer>
                      <audio
                        ref={photoPreviewToolbarAudioRef}
                        src={renderer}
                        controls
                        controlsList="nodownload"
                        onError={onError}
                      />
                    </AudioContainer>
                  ) : null
                }
              >
                <LazyLoadImage
                  src={src}
                  dataSrc={src}
                  width={width}
                  height={height}
                  imageStyle={{
                    borderRadius: '10px',
                    maxHeight: imageMaxHeight,
                    width: IS_SAFARI ? '' : '100%',
                    maxWidth: width,
                  }}
                  setImageHeight={false}
                  onLoaded={() => {
                    if (!src) {
                      return
                    }
                    setIsTileEnable(true)
                  }}
                  backup={
                    <LazyLoadImage
                      width={width}
                      height={width}
                      src={FallbackImg}
                      onLoaded={() => {
                        onFallBackImageLoaded()
                      }}
                    />
                  }
                  enablePreview={enableImagePreview}
                />
              </PhotoProvider>
              {isAudioOrVideo && (
                <span className="player">
                  <PlayerSvg />
                </span>
              )}
            </div>
          </div>
          <div
            className="flip-card-back"
            style={{
              width,
            }}
          >
            <Cardback
              width={imageRef.current?.offsetWidth}
              height={imageRef.current?.offsetHeight}
              content={cardBackContent}
              openPreview={openPreviewCardback}
            />
          </div>
        </div>
      </Container>
      {enablePlayer && (
        <Player
          poster={src}
          type={type as NftType}
          renderer={renderer}
          open={isPlayerOpen}
          onClose={() => setIsPlayerOpen(false)}
          onError={onError}
        />
      )}
      <Dialog
        open={isPreviewCardback}
        onClose={closePreviewCardback}
        onEscapeKeyDown={closePreviewCardback}
        onBackdropClick={closePreviewCardback}
        TransitionProps={{
          onEntered: () => {
            downloadCardBackPDF('.full-card-back-content')
          },
        }}
        PaperProps={{
          style: {
            width: '100%',
            height: '100%',
            maxWidth: '500px',
            background: 'transparent',
            boxShadow: 'none',
          },
        }}
      >
        <CardbackPreviewContainer>
          <DotSvg className="top-left" />
          <DotSvg className="top-right" />
          <DotSvg className="bottom-left" />
          <DotSvg className="bottom-right" />
          <CloseSvg className="close" onClick={closePreviewCardback} />
          {cardBackContent ? (
            <div
              className="full-card-back-content"
              dangerouslySetInnerHTML={{ __html: cardBackContent }}
            />
          ) : null}
        </CardbackPreviewContainer>
      </Dialog>
    </>
  )
}
