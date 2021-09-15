import styled from 'styled-components'
import React from 'react'

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
  images: string[]
  style?: React.CSSProperties
}> = ({ images, style }) => {
  return (
    <GalleryContainer className={`count-${images.length}`} style={style}>
      {images.slice(0, 4).map((src, i) => (
        <img src={src} key={i} alt="img" />
      ))}
      {images[4] && (
        <div className="center">{<img src={images[4]} alt="" />}</div>
      )}
    </GalleryContainer>
  )
}
