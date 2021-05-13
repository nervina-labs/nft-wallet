/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState } from 'react'
import Tilt from 'react-parallax-tilt'
import { LazyLoadImage } from '../Image'
import FallbackImg from '../../assets/img/detail-fallback.png'
// eslint-disable-next-line @typescript-eslint/no-var-requires
import Vibrant from 'node-vibrant'

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
  return (
    <Tilt tiltReverse tiltEnable={isTiltEnable} style={{ margin: 'auto' }}>
      <LazyLoadImage
        src={src}
        width={width}
        height={height}
        imageStyle={{ borderRadius: '10px' }}
        setImageHeight={false}
        onLoaded={async (img) => {
          if (img === null) {
            return
          }
          // img.crossOrigin = 'anonymous'
          try {
            const palette = await Vibrant.from(src!).getPalette()
            onColorDetected(
              // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
              `radial-gradient(${palette.Vibrant?.hex!}, #393d41)`
            )
          } catch (error) {
            console.log(error)
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
