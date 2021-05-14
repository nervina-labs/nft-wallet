/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useRef, useState } from 'react'
import Tilt from 'react-parallax-tilt'
import { LazyLoadImage } from '../Image'
import FallbackImg from '../../assets/img/detail-fallback.png'
// eslint-disable-next-line @typescript-eslint/no-var-requires

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
  const timer = useRef<NodeJS.Timeout>()
  const tilt = useRef<Tilt>(null)
  // const [boxShadow, setBoxShadow] = useState('rgb(240 46 170 / 40%) -10px 10px')
  return (
    <Tilt
      ref={tilt}
      tiltReverse
      reset={false}
      tiltEnable={isTiltEnable}
      tiltAngleYInitial={15}
      style={{ margin: 'auto' }}
      transitionSpeed={1000}
      onEnter={() => {
        timer.current && clearInterval()
      }}
      onLeave={() => {
        timer.current && clearTimeout(timer.current)
        timer.current = setTimeout(() => {
          const autoResetEvent = new CustomEvent('autoreset')
          // @ts-expect-error
          tilt.current?.onMove(autoResetEvent)
        }, 1500)
      }}
    >
      <LazyLoadImage
        src={src}
        width={width}
        height={height}
        imageStyle={{
          borderRadius: '10px',
          maxHeight: `${window.innerHeight - 44 - 300 - 30 * 2}px`,
        }}
        setImageHeight={false}
        onLoaded={async (img) => {
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
