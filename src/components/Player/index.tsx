import React, { useEffect, useRef, useState } from 'react'
import { NftType } from '../../models'
import styled from 'styled-components'
import { Dialog, Icon } from '@material-ui/core'
import { Close } from '@material-ui/icons'

export interface PlayerProps {
  type: NftType
  renderer?: string
  poster?: string
  open: boolean
  onClose: () => void
  onError?: () => void
}

const PreviewContainer = styled.div`
  display: flex;
  background-color: rgba(0, 0, 0, 0);
  flex-direction: column;
  width: 100%;
  max-width: 500px;
  position: relative;
  overflow: hidden;
  min-width: 300px;
  min-height: 52px;

  .img {
    width: 100%;
    max-height: calc(100vh - 200px);
  }

  .audio {
    width: calc(100% - 20px);
    position: absolute;
    bottom: 10px;
    left: 10px;
    height: 32px;
  }

  .video {
    width: 100%;
    background-color: #000;
    margin: auto;
  }

  .close {
    position: fixed;
    top: 10px;
    right: 10px;
    cursor: pointer;
    color: #fff;
    opacity: 0.75;
    &:hover {
      opacity: 1;
    }
  }
`

export const Player: React.FC<PlayerProps> = ({
  type,
  renderer,
  poster,
  open,
  onClose,
  onError,
}) => {
  const isVideo = type === NftType.Video
  const isAudio = type === NftType.Audio
  const [noPoster, setNoPoster] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const close = (): void => {
    audioRef?.current?.pause()
    videoRef?.current?.pause()
    onClose()
  }

  useEffect(() => {
    const catchRefHandleError = (): void => {
      if (onError) {
        onError()
      }
    }

    if (open) {
      audioRef?.current?.play().catch(catchRefHandleError)
      videoRef?.current?.play().catch(catchRefHandleError)
    }
  }, [open, audioRef, videoRef])

  return (
    <>
      <Dialog open={open} onClose={close} onEscapeKeyDown={close} keepMounted>
        <PreviewContainer>
          <Icon className="close" onClick={close}>
            <Close />
          </Icon>
          {isVideo && open && (
            <video
              ref={videoRef}
              src={renderer}
              className="video"
              onError={onError}
              controls
              controlsList="nodownload"
              playsInline
            />
          )}
          {isAudio && open && (
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
                ref={audioRef}
                src={renderer}
                onError={onError}
                className="audio"
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
