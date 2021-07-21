import { Dialog } from '@material-ui/core'
import classNames from 'classnames'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
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
          poster={poster}
          disablePictureInPicture
          style={{
            height: `${
              ((window.innerWidth > 500 ? 500 : window.innerWidth) * 9) / 16
            }px`,
          }}
          controls
          autoPlay
          controlsList="nodownload"
        />
      )
    }
    return null
  }, [isVideo, renderer, poster, open])

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
    </Container>
  )
}
