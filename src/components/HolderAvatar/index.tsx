import React from 'react'
import styled from 'styled-components'
import animationPath from '../../assets/img/nft-avatar-animation.png'
import { LazyLoadImage } from '../Image'
import { AvatarType } from '../../models/user'
import PeopleSrc, {
  ReactComponent as PeopleSvg,
} from '../../assets/svg/people.svg'
import { IS_IPHONE } from '../../constants'

const Container = styled.div`
  width: 44px;
  height: 44px;
  position: relative;
  .bg-animation-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    transform: scale(1.35);
    transform-origin: center;
    pointer-events: none;
    z-index: 1;
  }
  .bg-animation-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 132px;
    height: 88px;
    animation: border-animation 0.6s step-end infinite;
    border-radius: 0;
  }

  @keyframes border-animation {
    0% {
      transform: translate(0, 0);
    }

    16% {
      transform: translateX(-33.3%);
    }

    32% {
      transform: translateX(-66.6%);
    }

    48% {
      transform: translateX(0) translateY(-50%);
    }

    64% {
      transform: translateX(-33.3%) translateY(-50%);
    }

    80% {
      transform: translateX(-66.6%) translateY(-50%);
    }

    100% {
      transform: translate(0, 0);
    }
  }
`

const AvatarContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;

  img,
  svg {
    border-radius: 100%;
    width: 100%;
    height: 100%;
  }
`

interface HolderAvatarProps {
  avatar?: string
  avatarType?: AvatarType
  size?: number
  enablePreview?: boolean
}

const Backup: React.FC<{ size: number }> = ({ size }) => {
  return IS_IPHONE ? (
    <LazyLoadImage
      src={PeopleSrc.src}
      width={size}
      height={size}
      variant="circle"
      backup={<PeopleSvg />}
    />
  ) : (
    <PeopleSvg />
  )
}

export const HolderAvatar: React.FC<HolderAvatarProps> = ({
  avatar,
  avatarType = AvatarType.Image,
  size = 44,
  enablePreview,
}) => {
  const sizePx = `${size}px`

  return (
    <Container style={{ width: sizePx, height: sizePx }}>
      {avatar && avatarType === AvatarType.Token && (
        <div className="bg-animation-container">
          <img
            src={animationPath}
            alt="animation"
            className="bg-animation-img"
            style={{ width: `${size * 3}px`, height: `${size * 2}px` }}
          />
        </div>
      )}
      <AvatarContainer>
        {avatar ? (
          <LazyLoadImage
            src={avatar}
            dataSrc={avatar}
            width={size}
            height={size}
            variant="circle"
            backup={<Backup size={size} />}
            enablePreview={enablePreview}
          />
        ) : (
          <Backup size={size} />
        )}
      </AvatarContainer>
    </Container>
  )
}
