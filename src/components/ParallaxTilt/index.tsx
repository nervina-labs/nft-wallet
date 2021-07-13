/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useMemo, useRef, useState, useEffect } from 'react'
import Tilt from 'react-better-tilt'
import { LazyLoadImage } from '../Image'
import FallbackImg from '../../assets/img/detail-fallback.png'
import classNames from 'classnames'
import styled from 'styled-components'
import { IS_IPHONE } from '../../constants'
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.css'
import { getImagePreviewUrl } from '../../utils'

export interface ParallaxTiltProps {
  src: string | undefined
  width: number
  height: number
  onColorDetected: (color: string) => void
  onFallBackImageLoaded: () => void
  enable: boolean
}

const Container = styled(Tilt)`
  &.disabled {
    transform: none !important;
  }
`

export const ParallaxTilt: React.FC<ParallaxTiltProps> = ({
  src,
  onColorDetected,
  width,
  height,
  onFallBackImageLoaded,
  enable,
}) => {
  const [isTiltEnable, setIsTileEnable] = useState(false)
  const isTouchDevice = useMemo(() => {
    return 'ontouchstart' in document.documentElement
  }, [])
  const [enableGyroscope, setEnableGyroscope] = useState(isTouchDevice)
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

  const imageOnClick = (e: React.SyntheticEvent<HTMLDivElement>): void => {
    e.preventDefault()
    e.stopPropagation()
    setIsTileEnable(false)
    const viewer = new Viewer(imgRef.current!, {
      hidden: () => {
        viewer.destroy()
        setIsTileEnable(true)
      },
      url: 'data-src',
      navbar: false,
      title: false,
      toolbar: false,
    })
    viewer.show()
  }
  // const [boxShadow, setBoxShadow] = useState('rgb(240 46 170 / 40%) -10px 10px')
  return (
    <Container
      tiltReverse={shouldReverseTilt}
      reset={false}
      tiltEnable={isTiltEnable && enable}
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
    </Container>
  )
}
