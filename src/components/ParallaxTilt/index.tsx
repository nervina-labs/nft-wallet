/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useMemo, useRef, useState, useEffect } from 'react'
import Tilt from 'react-better-tilt'
import { LazyLoadImage } from '../Image'
import FallbackImg from '../../assets/img/detail-fallback.png'
import { ReactComponent as PlayerSvg } from '../../assets/svg/player.svg'
import classNames from 'classnames'
import styled from 'styled-components'
import { IS_IPHONE, IS_MAC_SAFARI } from '../../constants'
import 'viewerjs/dist/viewer.css'
import { getImagePreviewUrl } from '../../utils'
import { Player } from '../Player'
import { NftType } from '../../models'

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
          usePreview={true}
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
        close={() => {
          setIsPlayerOpen(false)
          setIsTileEnable(true)
        }}
      />
    </>
  )
}
