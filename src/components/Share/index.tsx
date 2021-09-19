import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { ReactComponent as ShareDownloadIcon } from '../../assets/svg/share-download.svg'
import { ReactComponent as ShareMoreIcon } from '../../assets/svg/share-more.svg'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import { NftPoster } from './nftPoster'
import { Poster, PosterType } from './poster.interface'
import { useHtml2Canvas } from './shareUtils'
import { IssuerPoster } from './issuerPoster'
import { HolderPoster } from './holderPoster'

const DialogContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.2);
    z-index: 0;
    transition: 0.2s;
  }
  z-index: 101;

  &.hide {
    pointer-events: none;
  }

  &.hide .mask {
    opacity: 0;
  }

  .share-poster-image {
    max-width: 450px;
    max-height: calc(100% - 270px);
    object-fit: contain;
    z-index: 9;
    position: absolute;
    top: 30px;
    left: 50%;
    transform: translate(-50%, 0);
    animation: show-poster 0.2s;
  }

  @keyframes show-poster {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`

const ShareContainer = styled.div`
  position: absolute;
  width: 100%;
  max-width: 500px;
  left: 50%;
  bottom: 0;
  border-radius: 10px 10px 0 0;
  --padding-bottom: calc(70px - env(safe-area-inset-bottom));
  transform: translateX(-50%) translateY(var(--padding-bottom));
  padding: 10px 15px 80px;
  box-sizing: border-box;
  user-select: none;
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  z-index: 1;
  transition: 0.2s;

  &.hide {
    transform: translateX(-50%) translateY(100%);
  }
`

const HandleBar = styled.div`
  width: 100%;
  height: 36px;
  line-height: 36px;
  display: flex;
  flex-direction: column;
  font-size: 13px;
  text-align: center;
  color: #666666;
`

const IconGroupContainer = styled.div`
  display: flex;
`

const IconContainer = styled.div`
  display: flex;
  flex-direction: column;

  &:not(:last-child) {
    margin-right: 15px;
  }
  width: 56px;
  font-size: 13px;
  line-height: 30px;
  text-align: center;
  color: #666666;
  cursor: pointer;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`

const Icon = styled.div`
  width: 56px;
  height: 56px;
  background-color: #fff;
  border-radius: 6px;
  display: flex;

  svg,
  img {
    width: 32px;
    height: 32px;
    object-fit: cover;
    margin: auto;
  }
`

const Button = styled.button`
  width: 100%;
  height: 56px;
  line-height: 56px;
  border: none;
  background-color: #ffffff;
  color: #333;
  border-radius: 40px;
  font-size: 18px;
  margin-top: 15px;
`

export type ShareProps = {
  isDialogOpen: boolean
  closeDialog: () => void
  displayText: string
  copyText: string
} & Partial<Poster>

export const Share: React.FC<ShareProps> = ({
  isDialogOpen,
  closeDialog,
  displayText,
  copyText,
  data,
  type,
}) => {
  const { t } = useTranslation('translations')
  useEffect(() => {
    if (isDialogOpen) {
      document.body.classList.add('fixed')
    } else {
      document.body.classList.remove('fixed')
    }
    return () => {
      document.body.classList.remove('fixed')
    }
  }, [isDialogOpen])

  const [el, setEl] = useState<HTMLDivElement | null>(null)
  const imgSrc = useHtml2Canvas(el, {
    enable: isDialogOpen,
  })

  return (
    <DialogContainer
      className={classNames({
        hide: !isDialogOpen,
      })}
    >
      {isDialogOpen && (
        <>
          {imgSrc && (
            <img
              className="share-poster-image"
              src={imgSrc}
              alt="share-poster-image"
            />
          )}
          {data && (
            <>
              {type === PosterType.Nft ? (
                <NftPoster
                  data={data as any}
                  onLoad={(x) => {
                    setEl(x)
                  }}
                />
              ) : null}
              {type === PosterType.Issuer ? (
                <IssuerPoster
                  data={data as any}
                  onLoad={(x) => {
                    setEl(x)
                  }}
                />
              ) : null}
              {type === PosterType.Holder ? (
                <HolderPoster data={data as any} onLoad={setEl} />
              ) : null}
            </>
          )}
        </>
      )}
      <div className="mask" onClick={closeDialog} />
      <ShareContainer
        className={classNames({
          hide: !isDialogOpen,
        })}
      >
        <HandleBar>{t('common.share.title')}</HandleBar>
        <IconGroupContainer>
          {imgSrc && (
            <a
              href={imgSrc}
              download="poster.png"
              style={{ textDecoration: 'none' }}
            >
              <IconContainer>
                <Icon>
                  <ShareDownloadIcon />
                </Icon>
                {t('common.share.download')}
              </IconContainer>
            </a>
          )}

          {navigator?.share !== undefined ? (
            <IconContainer
              onClick={async () => {
                await navigator.share({
                  title: document.title,
                  text: 'Share',
                  url: copyText,
                })
              }}
            >
              <Icon>
                <ShareMoreIcon />
              </Icon>
              {t('common.share.more')}
            </IconContainer>
          ) : null}
        </IconGroupContainer>
        <Button onClick={closeDialog}>{t('common.share.cancel')}</Button>
      </ShareContainer>
    </DialogContainer>
  )
}
