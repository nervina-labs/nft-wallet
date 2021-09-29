import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import CreatePosterIconPath from '../../assets/svg/create-poster.svg'
import ShareDownloadIconPath from '../../assets/svg/share-download.svg'
import { ReactComponent as ShareMoreIcon } from '../../assets/svg/share-more.svg'
import { ReactComponent as ShareCopyLinkIcon } from '../../assets/svg/share-copy-link.svg'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import { NftPoster, IssuerPoster, HolderPoster } from './posters'
import { Poster, PosterType } from './posters/poster.interface'
import { IS_ANDROID, IS_SUPPORT_DOWNLOAD, IS_WEXIN } from '../../constants'
import { copyContent, download } from '../../utils'
import { useProfileModel } from '../../hooks/useProfile'
import { useHtml2Canvas } from '../../hooks/useHtml2Canvas'

const ModelContentContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  touch-action: none;
  z-index: 101;
  pointer-events: auto;
  transition: opacity 0.2s;

  &.hide {
    opacity: 0;
    touch-action: auto;
    pointer-events: none;
  }

  .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    background-color: rgba(0, 0, 0, 0.4);
  }

  .share-poster-image {
    max-width: 450px;
    max-height: calc(100vh - 270px);
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
  padding: 0 15px 80px;
  box-sizing: border-box;
  user-select: none;
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 1;
  transition: 0.2s;

  &.hide {
    transform: translateX(-50%) translateY(100%);
    pointer-events: none;
    opacity: 0;
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
  padding-bottom: 10px;
`

const IconGroupContainer = styled.div`
  display: flex;
  height: 86px;
  overflow-y: hidden;
  overflow-x: auto;
`

const IconContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-right: 15px;
  font-size: 12px;
  line-height: 30px;
  text-align: center;
  color: #666666;
  cursor: pointer;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 70px;
  a {
    color: #666666;
    text-decoration: none;
  }
`

const Icon = styled.div`
  width: 60px;
  height: 60px;
  background-color: #fff;
  border-radius: 6px;
  margin: 0 auto;
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
  cursor: pointer;
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
  const { snackbar } = useProfileModel()
  const [isCreatedPoster, setIsCreatedPoster] = useState(false)
  const [el, setEl] = useState<HTMLDivElement | null>(null)
  const { imgSrc, isLoading } = useHtml2Canvas(el, {
    enable: isCreatedPoster,
  })
  const downloadOrCreatePoster = useCallback(() => {
    if (imgSrc) {
      if (!IS_SUPPORT_DOWNLOAD) {
        snackbar(t('common.share.long-press-save'))
      } else {
        download(imgSrc, 'poster.png')
      }
      return
    }
    setIsCreatedPoster(true)
  }, [imgSrc, snackbar, t])

  return (
    <ModelContentContainer
      className={classNames({
        hide: !isDialogOpen,
      })}
    >
      <div className="mask" onClick={closeDialog} />
      {isDialogOpen && (
        <>
          {isCreatedPoster && imgSrc && (
            <img
              className="share-poster-image"
              src={imgSrc}
              alt="share-poster-image"
            />
          )}
          {data && (
            <div style={{ opacity: 0 }}>
              {type === PosterType.Nft ? (
                <NftPoster
                  data={data as any}
                  onLoad={setEl}
                  shareUrl={copyText}
                />
              ) : null}
              {type === PosterType.Issuer ? (
                <IssuerPoster
                  data={data as any}
                  onLoad={setEl}
                  shareUrl={copyText}
                />
              ) : null}
              {type === PosterType.Holder ? (
                <HolderPoster
                  data={data as any}
                  onLoad={setEl}
                  shareUrl={copyText}
                />
              ) : null}
            </div>
          )}
        </>
      )}
      <ShareContainer
        className={classNames({
          hide: !isDialogOpen,
        })}
      >
        <HandleBar>{t('common.share.title')}</HandleBar>
        <IconGroupContainer>
          <IconContainer onClick={downloadOrCreatePoster}>
            <Icon>
              <img
                src={
                  isCreatedPoster && imgSrc
                    ? ShareDownloadIconPath
                    : CreatePosterIconPath
                }
                alt="icon"
              />
            </Icon>
            {imgSrc && t('common.share.download')}
            {!imgSrc
              ? isLoading
                ? t('common.share.creating-poster')
                : t('common.share.create-poster')
              : null}
          </IconContainer>

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

          {
            <IconContainer
              onClick={async () => {
                const isAndroidWeChat = IS_WEXIN && IS_ANDROID
                const content = isAndroidWeChat
                  ? copyText.replace('https://', '').replace('http://', '')
                  : copyText
                await copyContent(content)
                snackbar(t('common.share.copied'))
              }}
            >
              <Icon>
                <ShareCopyLinkIcon />
              </Icon>
              {t('common.share.copy-link')}
            </IconContainer>
          }
        </IconGroupContainer>
        <Button onClick={closeDialog}>{t('common.share.cancel')}</Button>
      </ShareContainer>
    </ModelContentContainer>
  )
}
