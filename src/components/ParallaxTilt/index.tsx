/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useMemo, useRef, useState, useEffect } from 'react'
import Tilt from 'react-better-tilt'
import { LazyLoadImage } from '../Image'
import FallbackImg from '../../assets/img/detail-fallback.png'
import { ReactComponent as PlayerSvg } from '../../assets/svg/player.svg'
import classNames from 'classnames'
import styled from 'styled-components'
import { IS_IPHONE } from '../../constants'
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.css'
import { getImagePreviewUrl } from '../../utils'
import { Player } from '../Player'
import { NftType } from '../../models'
import { useProfileModel } from '../../hooks/useProfile'
import { useTranslation } from 'react-i18next'
import { emptyImageBase64 } from '../../data/empty'

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
  const imgRef = useRef<HTMLImageElement | null>(null)
  const viewerRef = useRef<Viewer | null>(null)
  const imageOnClick = (e: React.SyntheticEvent<HTMLDivElement>): void => {
    e.preventDefault()
    e.stopPropagation()
    setIsTileEnable(false)
    if (type === NftType.Video) {
      setIsPlayerOpen(true)
      return
    }
    if (type !== NftType.Audio && imgRef.current === null) {
      return
    }
    const img = document.createElement('img')
    if (imgRef.current === null) {
      img.src = emptyImageBase64
    }
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    viewerRef.current = new Viewer(imgRef.current || img, {
      hidden: () => {
        viewerRef.current?.destroy()
        setIsTileEnable(true)
      },
      shown: () => {
        if (type !== NftType.Audio) {
          return
        }
        const audio = document.createElement('audio')
        const width =
          window.innerWidth > 500 ? '500px' : `${window.innerWidth}px`
        audio.style.width = width
        audio.setAttribute('controlsList', 'nodownload')
        audio.autoplay = true
        audio.setAttribute('controls', 'true')
        audio.src = renderer!
        audio.onerror = () => {
          audio.remove()
          snackbar(t('resource.fail'))
        }
        const footer = document.querySelector('.viewer-footer')
        if (footer) {
          footer.appendChild(audio)
        }
      },
      url: 'data-src',
      navbar: false,
      title: false,
      toolbar: false,
    })
    viewerRef.current.show()
  }

  useEffect(() => {
    return () => {
      viewerRef?.current?.destroy()
    }
  }, [])
  // const [boxShadow, setBoxShadow] = useState('rgb(240 46 170 / 40%) -10px 10px')
  return (
    <>
      <Container
        tiltReverse={shouldReverseTilt}
        reset={false}
        tiltEnable={isTiltEnable && enable && !isPlayerOpen}
        disableTouch
        onClick={imageOnClick}
        tiltAngleYInitial={!isTouchDevice ? 15 : undefined}
        adjustGyroscope
        className={classNames({ disabled: !enable && IS_IPHONE })}
        style={{ margin: 'auto' }}
        transitionSpeed={1000}
        gyroscope={enableGyroscope}
        onEnter={() => {
          setEnableGyroscope(false)
          timer.current && clearInterval()
        }}
        onLeave={() => {
          setEnableGyroscope(true)
          timer.current && clearTimeout(timer.current)
          if (!isTouchDevice) {
            timer.current = setTimeout(() => {
              const autoResetEvent = new CustomEvent('autoreset')
              // @ts-expect-error
              tilt.current?.onMove(autoResetEvent)
            }, 1500)
          }
        }}
      >
        <LazyLoadImage
          src={getImagePreviewUrl(src)}
          dataSrc={src}
          imgRef={imgRef}
          width={width}
          height={height}
          imageStyle={{
            borderRadius: '10px',
            // 44 = header, 300 = nft detail, 30 * 2 = margin
            maxHeight: `${window.innerHeight - 44 - 300 - 30 * 2}px`,
            pointerEvents: 'none',
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
        />
        {type === NftType.Audio || type === NftType.Video ? (
          <span className="player">
            <PlayerSvg />
          </span>
        ) : null}
      </Container>
      <Player
        open={isPlayerOpen}
        poster={src}
        type={NftType.Video}
        renderer={renderer}
        close={() => setIsPlayerOpen(false)}
      />
    </>
  )
}
