import { Dialog } from '@material-ui/core'
import classNames from 'classnames'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { IS_IPHONE } from '../../constants'
import { useProfileModel } from '../../hooks/useProfile'
import { NftType } from '../../models'

export interface PlayerProps {
  type: NftType
  renderer?: string
  poster?: string
  open: boolean
  close: () => void
}

const Container = styled(Dialog)`
  .MuiDialog-paper {
    margin: 0;
  }
  .MuiDialog-paperScrollPaper {
    background: transparent;
    box-shadow: none;
  }
  background: transparent;
  .video {
    display: flex;
    align-items: center;
    justify-content: center;
    video {
      width: 100%;
    }
  }
  .viewer-button {
    position: fixed;
  }
`

export const Player: React.FC<PlayerProps> = ({
  type,
  renderer,
  poster,
  open,
  close,
}) => {
  const isVideo = type === NftType.Video
  const isAudio = type === NftType.Audio
  const { snackbar } = useProfileModel()
  const [t] = useTranslation('translations')
  const videoPlayer = useMemo(() => {
    if (isVideo && open) {
      return (
        <video
          src={renderer}
          onError={() => {
            snackbar(t('resource.fail'))
            close()
          }}
          disablePictureInPicture
          controls
          webkit-playsinline
          playsInline
          autoPlay
          controlsList="nodownload"
          style={{
            objectFit: 'cover',
            maxHeight: IS_IPHONE ? '300px' : 'auto',
          }}
        />
      )
    }
    return null
  }, [isVideo, renderer, open, close, snackbar, t])

  return (
    <Container
      className={classNames({
        video: isVideo,
        audio: isAudio,
      })}
      open={open}
      onBackdropClick={close}
    >
      {videoPlayer}
      <div
        className="viewer-button viewer-close"
        data-viewer-action="mix"
        role="button"
        onClick={close}
      ></div>
    </Container>
  )
}
