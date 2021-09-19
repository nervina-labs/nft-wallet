import React from 'react'
import { AvatarType } from '../../../models/user'
import classnames from 'classnames'
import styled from 'styled-components'
import NftAvatarDiamondsPath from '../../../assets/img/nft-avatar-diamonds.png'
import IssuerVerifyPath from '../../../assets/img/issuer-verify.png'

const ShareAvatarContainer = styled.div`
  --size: ${(props: { size?: number }) =>
    props.size ? `${props.size}px` : '40px'};
  position: relative;
  display: flex;
  width: var(--size);
  height: var(--size);
  .verify {
    position: absolute;
    bottom: -1px;
    right: -1px;
    width: calc(var(--size) / 3);
    z-index: 2;
  }
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

  &.nft .avatar-img {
    border: 2px solid rgb(250, 190, 60);
  }
  .nft-icon {
    content: '';
    background: url('${NftAvatarDiamondsPath}') no-repeat;
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
  verify?: boolean
}> = ({ avatar, avatarType = AvatarType.Image, size = 44, verify }) => {
  return (
    <ShareAvatarContainer
      className={classnames({
        nft: avatarType === AvatarType.Token,
      })}
      size={size}
    >
      <img src={avatar} alt={avatarType} className="avatar-img" />
      {verify && (
        <img src={IssuerVerifyPath} alt="issuerVerify" className="verify" />
      )}
      {avatarType === AvatarType.Token && (
        <img src={NftAvatarDiamondsPath} alt="nftIcon" className="nft-icon" />
      )}
    </ShareAvatarContainer>
  )
}
