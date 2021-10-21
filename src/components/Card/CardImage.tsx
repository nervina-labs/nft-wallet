import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { ReactComponent as PlayerSvg } from '../../assets/svg/player.svg'
import FallbackImg from '../../assets/svg/fallback.svg'
import { addParamsToUrl, getImagePreviewUrl } from '../../utils'
import { LazyLoadImage, LazyLoadImageVariant } from '../Image'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import i18n from 'i18next'
import NFT3dSvg from '../../assets/svg/3D.svg'
import { CardTags } from './CardTags'

const CardImageContainer = styled.div`
  position: relative;
  display: flex;
  user-select: none;

  img {
    -webkit-user-drag: none;
  }

  .player {
    position: absolute;
    right: 6px;
    bottom: 6px;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    svg {
      width: 20px;
      height: 20px;
    }
  }

  .fallback {
    width: 100%;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 8px;
    font-size: 10px;
    color: #2b2b2b;
    opacity: 0.6;
    text-align: center;
  }

  .MuiSkeleton-root {
    margin-right: 0 !important;
  }

  .icon3d {
    position: absolute;
    right: 6px;
    bottom: 6px;
    width: 30px;
    height: 30px;
    background: rgba(0, 0, 0, 0.33);
    backdrop-filter: blur(4px);
    border-radius: 100%;
  }

  .center {
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    bottom: unset;
    right: unset;
  }
`

interface CardImageProps {
  src: string
  tid?: string | number
  locale?: string
  isBanned?: string
  hasCardBack?: boolean
  isPlayable?: boolean
  width?: number
  height?: number
  className?: string
  loadOriginal?: boolean
  playerOr3dIconCenter?: boolean
  hideFallBackText?: boolean
  variant?: LazyLoadImageVariant
  backup?: React.ReactNode
  has3dIcon?: boolean
}

export const CardImage: React.FC<CardImageProps> = ({
  src,
  tid,
  isBanned,
  hasCardBack,
  isPlayable,
  width = 100,
  height = 100,
  className,
  loadOriginal,
  playerOr3dIconCenter,
  hideFallBackText = true,
  variant,
  backup,
  has3dIcon,
}) => {
  const [isFallBackImgLoaded, setFallBackImgLoaded] = useState(
    Boolean(isBanned)
  )
  const [t] = useTranslation('translations')
  const dataSrc = useMemo(() => {
    if (!src) {
      return src
    }
    return addParamsToUrl(
      src,
      tid !== undefined
        ? { tid: `${tid}`, locale: i18n.language === 'en' ? 'en' : 'zh' }
        : {}
    )
  }, [src, tid])
  const previewSrc = useMemo(() => {
    return loadOriginal ? dataSrc : getImagePreviewUrl(dataSrc)
  }, [dataSrc, loadOriginal])

  const tags = useMemo(() => {
    const icons = []
    if (has3dIcon) {
      icons.push(NFT3dSvg)
    }
    return icons
  }, [has3dIcon])

  return (
    <CardImageContainer className={className}>
      <LazyLoadImage
        src={isBanned ? FallbackImg : previewSrc}
        dataSrc={dataSrc}
        width={width}
        height={height}
        cover
        disableContextMenu={true}
        variant={variant}
        backup={
          backup ?? (
            <LazyLoadImage
              width={width}
              height={height}
              src={FallbackImg}
              dataSrc={dataSrc}
              variant={variant}
              onLoaded={() => setFallBackImgLoaded(true)}
            />
          )
        }
      />
      {isFallBackImgLoaded && !hideFallBackText && (
        <div className="fallback">{t('common.img-lost')}</div>
      )}
      {isPlayable && (
        <span
          className={classNames('player', {
            center: playerOr3dIconCenter,
          })}
        >
          <PlayerSvg />
        </span>
      )}
      {has3dIcon && playerOr3dIconCenter && (
        <img
          className={classNames('icon3d', {
            center: playerOr3dIconCenter,
          })}
          src={NFT3dSvg}
          alt="3d-icon"
        />
      )}
      {tags.length > 0 && !playerOr3dIconCenter && <CardTags icons={tags} />}
    </CardImageContainer>
  )
}
