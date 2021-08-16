/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect, useMemo, useRef, useState } from 'react'
import Tilt from 'react-better-tilt'
import { LazyLoadImage } from '../Image'
import FallbackImg from '../../assets/img/detail-fallback.png'
import { ReactComponent as PlayerSvg } from '../../assets/svg/player.svg'
import classNames from 'classnames'
import styled from 'styled-components'
import { IS_IPHONE, IS_MAC_SAFARI } from '../../constants'
import { getImagePreviewUrl } from '../../utils'
import { Player } from '../Player'
import { NftType } from '../../models'
import { PhotoProvider } from 'react-photo-view'
import { useTranslation } from 'react-i18next'
import { useProfileModel } from '../../hooks/useProfile'

export interface ParallaxTiltProps {
  src: string | undefined
  width: number
  height: number
  onColorDetected: (color: string) => void
  onFallBackImageLoaded: () => void
  enable: boolean
  renderer?: string
  type?: NftType
}

const Container = styled(Tilt)`
  position: relative;
  margin: auto;

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

export const ParallaxTilt: React.FC<ParallaxTiltProps> = ({
  src,
  onColorDetected,
  width,
  height,
  onFallBackImageLoaded,
  enable,
  type,
  renderer,
}) => {
  const [isTiltEnable, setIsTileEnable] = useState(false)
  const isTouchDevice = useMemo(() => {
    return 'ontouchstart' in document.documentElement
  }, [])
  const [enableGyroscope, setEnableGyroscope] = useState(isTouchDevice)
  const [isPlayerOpen, setIsPlayerOpen] = useState(false)
  const { snackbar } = useProfileModel()
  const [t] = useTranslation('translations')
  const shouldReverseTilt = useMemo(() => {
    if (!isTouchDevice) {
      return true
    }
    return !enableGyroscope
  }, [isTouchDevice, enableGyroscope])
  const timer = useRef<NodeJS.Timeout>()
  const tilt = useRef<Tilt>(null)
  const enableImagePreview =
    type === NftType.Picture || (Boolean(src) && type === NftType.Audio)
  const isAudioOrVideo = type === NftType.Audio || type === NftType.Video
  const enablePlayer = !enableImagePreview && isAudioOrVideo
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
    }
  }, [])

  const imagePreviewUrl = useMemo(() => getImagePreviewUrl(src), [src])
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
        // @ts-expect-error
        tilt.current?.onMove(autoResetEvent)
      }, 1500)
    }
  }
  const onError = (): void => {
    if (isPlayerOpen) {
      snackbar(t('resource.fail'))
    }
    setIsPlayerOpen(false)
  }

  return (
    <>
      <Container
        tiltReverse={shouldReverseTilt}
        reset={false}
        tiltEnable={isTiltEnable && enable}
        disableTouch
        tiltAngleYInitial={!isTouchDevice ? 15 : undefined}
        adjustGyroscope
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
        <div onClick={openPreview}>
          <PhotoProvider
            maskClassName="preview-mask"
            onVisibleChange={(visible) => {
              setPhotoPreviewToolbarAudioVisible(visible)
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
              src={imagePreviewUrl}
              dataSrc={src}
              width={width}
              height={height}
              imageStyle={{
                borderRadius: '10px',
                // 44 = header, 300 = nft detail, 30 * 2 = margin
                maxHeight: `${window.innerHeight - 44 - 300 - 30 * 2}px`,
                width: '100%',
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
        {enablePlayer && (
          <Player
            poster={imagePreviewUrl}
            type={type as NftType}
            renderer={renderer}
            open={isPlayerOpen}
            onClose={() => setIsPlayerOpen(false)}
            onError={onError}
          />
        )}
      </Container>
    </>
  )
}
