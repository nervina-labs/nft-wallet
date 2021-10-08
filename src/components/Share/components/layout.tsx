import React from 'react'
import styled from 'styled-components'

export const BackgroundImage: React.FC<{ src: string }> = ({ src }) => {
  return (
    <BackgroundImageContainer>
      <img src={src} alt="bg" />
    </BackgroundImageContainer>
  )
}

const BackgroundImageContainer = styled.div`
  width: 100%;
  height: auto;
  img {
    width: 100%;
    height: 100%;
  }
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
`

export const PosterContainer = styled.div`
  top: 0;
  left: 0;
  position: fixed;
  width: 323px;
  height: 484px;
  content-visibility: hidden;
  z-index: 10;
  overflow: hidden;
  pointer-events: none;

  .qrcode {
    position: absolute;
    width: 42px;
    height: 42px;
    bottom: 16px;
    right: 30px;
  }
`

export const UserContainer = styled.div`
  --avatar-size: ${(props: { avatarSize?: number }) =>
    props.avatarSize ? `${props.avatarSize}px` : '35px'};
  --width: calc(180px - var(--avatar-size) - 30px);
  width: 100%;
  display: flex;
  height: var(--height);
  line-height: var(--height);
  margin-bottom: 6px;
  font-size: 14px;

  .avatar {
    width: var(--avatar-size);
    min-width: var(--avatar-size);
    height: var(--avatar-size);
    background: #fff;
    overflow: hidden;
    border-radius: 100%;

    img,
    svg {
      width: var(--avatar-size);
      height: var(--avatar-size);
    }
  }

  .issuer-name {
    margin: auto 0 auto 10px;
    height: 15px;
    line-height: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    font-weight: 500;
    width: var(--width);
  }
`
