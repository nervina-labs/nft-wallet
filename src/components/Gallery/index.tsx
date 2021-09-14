import React from 'react'
import styled from 'styled-components'
import { CardImage } from '../Card/CardImage'

const Container = styled.header`
  height: 74px;
  position: relative;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  width: 100%;

  .image {
    position: absolute;

    img {
      border-radius: 4px;
    }

    &:nth-child(1) {
      bottom: 11px;
      left: 80px;
      z-index: 3;
    }
    &:nth-child(2) {
      left: 20px;
      bottom: 16px;
    }
    &:nth-child(3) {
      right: 20px;
      bottom: 16px;
    }
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
  const primaryLeft = (containerWidth - primaryWidth) / 2
  const secondLength = primaryLeft - secondWidth + secondHiddenWidth
  return (
    <Container style={{ background: bg, height }} className="gallery">
      {imgs.map((img, i) => (
        <div
          key={i}
          className="image"
          style={{
            ...(i < 2
              ? { left: i === 0 ? primaryLeft : secondLength }
              : { right: secondLength }),
            bottom: i === 0 ? primaryMarginBottom : secondMarginBottom,
          }}
        >
          <CardImage
            src={img}
            width={i === 0 ? primaryWidth : secondWidth}
            height={i === 0 ? primaryWidth : secondWidth}
          />
        </div>
      ))}
    </Container>
  )
}
