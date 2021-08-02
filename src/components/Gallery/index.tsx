import React from 'react'
import styled from 'styled-components'
import FallbackImg from '../../assets/img/card-fallback.png'
import { LazyLoadImage } from '../../components/Image'

const Container = styled.header`
  height: 74px;
  position: relative;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  width: 100%;
  .first,
  .second,
  .third {
    position: absolute;
  }

  .first {
    bottom: 11px;
    left: 80px;
    z-index: 3;
  }

  .second {
    left: 20px;
    bottom: 16px;
  }

  .third {
    right: 20px;
    bottom: 16px;
  }
`

export interface GalleryProps {
  imgs: string[]
  bg: string
  primaryWidth?: number
  secondWidth?: number
  containerWidth?: number
  primaryMarginBottom?: number
  secondMarginBottom?: number
  secondHiddenWidth?: number
  height?: number
}

export const Gallery: React.FC<GalleryProps> = ({
  bg,
  imgs,
  primaryWidth = 87,
  primaryMarginBottom = 11,
  secondMarginBottom = 16,
  secondWidth = 70,
  containerWidth = 248,
  secondHiddenWidth = 12,
  height = 74,
}) => {
  const [first, second, third] = imgs
  const primaryLeft = (containerWidth - primaryWidth) / 2
  const secondLength = primaryLeft - secondWidth + secondHiddenWidth
  return (
    <Container style={{ background: bg, height }} className="gallery">
      <div
        className="first"
        style={{ left: primaryLeft, bottom: primaryMarginBottom }}
      >
        <LazyLoadImage
          src={first}
          width={primaryWidth}
          height={primaryWidth}
          imageStyle={{ borderRadius: '4px' }}
          skeletonStyle={{ borderRadius: '4px' }}
          cover
          disableContextMenu={true}
          backup={
            <LazyLoadImage
              imageStyle={{ borderRadius: '4px' }}
              cover
              skeletonStyle={{ borderRadius: '4px' }}
              width={primaryWidth}
              height={primaryWidth}
              src={FallbackImg}
            />
          }
        />
      </div>
      <div
        className="second"
        style={{ bottom: secondMarginBottom, left: secondLength }}
      >
        <LazyLoadImage
          src={second}
          width={secondWidth}
          height={secondWidth}
          imageStyle={{ borderRadius: '4px' }}
          skeletonStyle={{ borderRadius: '4px' }}
          cover
          disableContextMenu={true}
          backup={
            <LazyLoadImage
              cover
              imageStyle={{ borderRadius: '4px' }}
              skeletonStyle={{ borderRadius: '4px' }}
              width={secondWidth}
              height={secondWidth}
              src={FallbackImg}
            />
          }
        />
      </div>
      <div
        className="third"
        style={{ bottom: secondMarginBottom, right: secondLength }}
      >
        <LazyLoadImage
          src={third}
          width={secondWidth}
          height={secondWidth}
          imageStyle={{ borderRadius: '4px' }}
          skeletonStyle={{ borderRadius: '4px' }}
          cover
          disableContextMenu={true}
          backup={
            <LazyLoadImage
              cover
              imageStyle={{ borderRadius: '4px' }}
              skeletonStyle={{ borderRadius: '4px' }}
              width={secondWidth}
              height={secondWidth}
              src={FallbackImg}
            />
          }
        />
      </div>
    </Container>
  )
}
