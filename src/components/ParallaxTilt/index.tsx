/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useMemo, useRef, useState } from 'react'
import Tilt from 'react-better-tilt'
import { LazyLoadImage } from '../Image'
import FallbackImg from '../../assets/img/detail-fallback.png'

export interface ParallaxTiltProps {
  src: string | undefined
  width: number
  height: number
  onColorDetected: (color: string) => void
  onFallBackImageLoaded: () => void
}

export const ParallaxTilt: React.FC<ParallaxTiltProps> = ({
  src,
  onColorDetected,
  width,
  height,
  onFallBackImageLoaded,
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
  // const [boxShadow, setBoxShadow] = useState('rgb(240 46 170 / 40%) -10px 10px')
  return (
    <Tilt
      ref={tilt}
      tiltReverse={shouldReverseTilt}
      reset={false}
      tiltEnable={isTiltEnable}
      tiltAngleYInitial={!isTouchDevice ? 15 : undefined}
      adjustGyroscope
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
        src={src}
        width={width}
        height={height}
        imageStyle={{
          borderRadius: '10px',
          // 44 = header, 300 = nft detail, 30 * 2 = margin
          maxHeight: `${window.innerHeight - 44 - 300 - 30 * 2}px`,
          pointerEvents: 'none',
        }}
        setImageHeight={false}
        onLoaded={(img) => {
          if (img === null || !src) {
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
    </Tilt>
  )
}
