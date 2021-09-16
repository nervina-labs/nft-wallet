import styled from 'styled-components'
import React from 'react'
import { SharePosterImage } from './sharePosterImage'
import { useLoaded } from './shareUtils'

const GalleryContainer = styled.div`
  width: 100%;
  height: 191px;
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: 50% 50%;
  z-index: 2;
  overflow: hidden;
  border-radius: 10px;
  position: relative;

  &.count-1 {
    grid-template-columns: 100%;
    grid-template-rows: 100%;
  }

  &.count-2 {
    grid-template-columns: 50% 50%;
    grid-template-rows: 100%;
  }

  &.count-3 {
    img:nth-child(3) {
      grid-column-start: 2;
      grid-column-end: 2;
      grid-row-start: 1;
      grid-row-end: 3;
    }
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    background-color: #fff;
  }

  .center {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    z-index: 3;
    img {
      border-radius: 5px;
      width: 100px;
      height: 80px;
      margin: auto;
      box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    }
  }
`

export const Gallery: React.FC<{
  images: Array<string | undefined>
  style?: React.CSSProperties
  onLoaded?: () => void
}> = ({ images, style, onLoaded }) => {
  const addLoadedCount = useLoaded(images.length, onLoaded ?? (() => {}))

  return (
    <GalleryContainer className={`count-${images.length}`} style={style}>
      {images.slice(0, 4).map((src, i) => (
        <SharePosterImage src={src} key={i} onLoaded={addLoadedCount} />
      ))}
      {images[4] && (
        <div className="center">
          <SharePosterImage src={images[4]} onLoaded={addLoadedCount} />
        </div>
      )}
    </GalleryContainer>
  )
}
