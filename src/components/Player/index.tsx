import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useProfileModel } from '../../hooks/useProfile'
import { NftType } from '../../models'
import styled from 'styled-components'
import { Dialog } from '@material-ui/core'

export interface PlayerProps {
  type: NftType
  renderer?: string
  poster?: string
  open: boolean
  close: () => void
}

const PreviewContainer = styled.div`
  display: flex;
  background-color: rgba(0, 0, 0, 0);
  flex-direction: column;
  width: 100%;
  max-width: 500px;
  position: relative;
  overflow: hidden;

  .img {
    width: 100%;
    max-height: calc(100vh - 200px);
  }

  .audio {
    width: calc(100% - 20px);
    position: absolute;
    bottom: 10px;
    left: 10px;
  }

  .video {
    width: 100%;
    background-color: #000;
    margin: auto;
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
  const [noPoster, setNoPoster] = useState(false)
  const [t] = useTranslation('translations')
  const onError = (): void => {
    snackbar(t('resource.fail'))
    close()
  }

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        close()
      }
    }
    document.addEventListener('keydown', handleKeydown, true)

    return () => {
      document.removeEventListener('keydown', handleKeydown)
    }
  })

  return (
    <>
      <Dialog open={open} onClose={close}>
        <PreviewContainer>
          {isVideo && (
            <video
              src={renderer}
              className="video"
              onError={onError}
              autoPlay
              controls
              controlsList="nodownload"
              playsInline
              poster={poster}
            />
          )}
          {isAudio && (
            <>
              {poster && !noPoster && (
                <img
                  className="img"
                  src={poster}
                  alt="nft"
                  onError={() => setNoPoster(true)}
                />
              )}
              <audio
                src={renderer}
                onError={onError}
                className="audio"
                autoPlay
                controls
                controlsList="nodownload"
              />
            </>
          )}
        </PreviewContainer>
      </Dialog>
    </>
  )
}
