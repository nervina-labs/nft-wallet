import React from 'react'
import styled from 'styled-components'
import { LazyLoadImage } from '../Image'
import { AvatarType } from '../../models/user'
import PeopleSrc, {
  ReactComponent as PeopleSvg,
} from '../../assets/svg/people.svg'
import NftAvatarDiamonds from '../../assets/svg/nft-avatar-diamonds.svg'
import classNames from 'classnames'
import { getImagePreviewUrl } from '../../utils'
import { CardImage } from '../Card/CardImage'

const Container = styled.div`
  width: 44px;
  height: 44px;
  position: relative;

  .icon {
    position: absolute;
    top: -5%;
    right: -5%;
    width: 30% !important;
    height: auto !important;
  }
`

const AvatarContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;

  &.animation:before {
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
    animation: background-animation 3s ease infinite alternate;
    box-shadow: 0 0 5px rgba(250, 190, 60, 1);
  }

  @keyframes background-animation {
    0% {
      background-position: 0, 50%;
    }

    50% {
      background-position: 100%, 50%;
      box-shadow: 0 0 5px rgba(205, 130, 15, 1);
    }

    100% {
      background-position: 0, 50%;
    }
  }

  img,
  svg {
    border-radius: 100%;
    width: 100%;
    height: 100%;
    z-index: 1;
    position: relative;
    background: #fff;
  }
`

interface HolderAvatarProps {
  avatar?: string
  avatarType?: AvatarType
  size?: number
  enablePreview?: boolean
}

const Backup: React.FC<{ size: number }> = ({ size }) => {
  return (
    <LazyLoadImage
      src={(PeopleSrc as unknown) as string}
      width={size}
      height={size}
      variant="circle"
      backup={<PeopleSvg />}
    />
  )
}

export const HolderAvatar: React.FC<HolderAvatarProps> = ({
  avatar,
  avatarType = AvatarType.Image,
  size = 44,
  enablePreview,
}) => {
  const sizePx = `${size}px`
  if (!avatar) {
    return (
      <Container style={{ width: sizePx, height: sizePx }}>
        <AvatarContainer>
          <Backup size={size} />
        </AvatarContainer>
      </Container>
    )
  }

  return (
    <Container style={{ width: sizePx, height: sizePx }}>
      <AvatarContainer
        className={classNames({
          animation: avatarType === AvatarType.Token,
        })}
      >
        {avatarType === AvatarType.Token ? (
          <CardImage
            src={getImagePreviewUrl(avatar, 100)}
            width={size}
            height={size}
            variant="circle"
          />
        ) : (
          <LazyLoadImage
            src={getImagePreviewUrl(avatar, 100)}
            dataSrc={avatar}
            width={size}
            height={size}
            variant="circle"
            backup={<Backup size={size} />}
            enablePreview={enablePreview}
          />
        )}
        {avatarType === AvatarType.Token && (
          <img
            src={(NftAvatarDiamonds as unknown) as string}
            alt="nftAvatarDiamonds"
            className="icon"
          />
        )}
      </AvatarContainer>
    </Container>
  )
}
