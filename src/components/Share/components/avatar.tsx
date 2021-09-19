import React from 'react'
import { AvatarType } from '../../../models/user'
import classnames from 'classnames'
import styled from 'styled-components'
import NftAvatarDiamonds from '../../../assets/svg/nft-avatar-diamonds.svg'

const ShareAvatarContainer = styled.div`
  --size: ${(props: { size?: number }) =>
    props.size ? `${props.size}px` : '40px'};
  position: relative;
  display: flex;
  width: var(--size);
  height: var(--size);
  .avatar-img {
    width: 100%;
    height: 100%;
    border-radius: 100%;
    object-fit: cover;
    margin: auto;
    position: relative;
    z-index: 1;
    background-color: #fff;
  }
  &.nft:before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    width: calc(100% + 4px);
    height: calc(100% + 4px);
    border-radius: 100%;
    z-index: 0;
    background-image: linear-gradient(
      60deg,
      rgb(205, 130, 15),
      rgb(250, 190, 60),
      rgb(205, 130, 15),
      rgb(250, 190, 60),
      rgb(205, 130, 15),
      rgb(250, 190, 60)
    );
    background-size: 300%, 300%;
  }
  &.nft:after {
    content: '';
    background: url('${NftAvatarDiamonds}') no-repeat;
    background-size: 100%, 100%;
    display: block;
    top: -2px;
    right: -2px;
    width: calc(var(--size) / 3);
    height: calc(var(--size) / 3);
    position: absolute;
    z-index: 2;
  }
`

export const ShareAvatar: React.FC<{
  avatar?: string
  avatarType?: AvatarType
  size: number
}> = ({ avatar, avatarType = AvatarType.Image, size = 44 }) => {
  return (
    <ShareAvatarContainer
      className={classnames({
        nft: avatarType === AvatarType.Token,
      })}
      size={size}
    >
      <img src={avatar} alt={avatarType} className="avatar-img" />
    </ShareAvatarContainer>
  )
}
