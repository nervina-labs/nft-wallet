import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { ReactComponent as PlayerSvg } from '../../assets/svg/player.svg'
import { CardBack } from '../Cardback'
import FallbackImg from '../../assets/svg/fallback.svg'
import { addLocaleToUrl, addTidToUrl, getImagePreviewUrl } from '../../utils'
import { LazyLoadImage } from '../Image'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import i18n from 'i18next'

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

    &.center {
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      bottom: unset;
      right: unset;
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
`

interface CardImageProps {
  src: string
  tid?: string
  locale?: string
  isBanned?: string
  hasCardBack?: boolean
  isPlayable?: boolean
  width?: number
  height?: number
  className?: string
  loadOriginal?: boolean
  playerCenter?: boolean
  hideFallBackText?: boolean
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
  playerCenter,
  hideFallBackText,
}) => {
  const [isFallBackImgLoaded, setFallBackImgLoaded] = useState(
    Boolean(isBanned)
  )
  const [t] = useTranslation('translations')
  const finalSrc = useMemo(() => {
    let ret = loadOriginal ? src : getImagePreviewUrl(src)
    if (tid) {
      ret = addTidToUrl(ret, tid)
      ret = addLocaleToUrl(ret, i18n.language === 'en' ? 'en' : 'zh')
    }
    return ret
  }, [src, loadOriginal, tid])

  return (
    <CardImageContainer className={className}>
      <LazyLoadImage
        src={isBanned ? FallbackImg : finalSrc}
        dataSrc={src}
        width={width}
        height={height}
        cover
        disableContextMenu={true}
        backup={
          <LazyLoadImage
            width={width}
            height={height}
            src={FallbackImg}
            onLoaded={() => setFallBackImgLoaded(true)}
          />
        }
      />
      {isFallBackImgLoaded && !hideFallBackText && (
        <div className="fallback">{t('common.img-lost')}</div>
      )}
      {isPlayable && (
        <span
          className={classNames('player', {
            center: playerCenter,
          })}
        >
          <PlayerSvg />
        </span>
      )}
      {hasCardBack && (
        <CardBack
          style={{
            borderTopRightRadius: '10px',
          }}
          tooltipPlacement="top-start"
        />
      )}
    </CardImageContainer>
  )
}
