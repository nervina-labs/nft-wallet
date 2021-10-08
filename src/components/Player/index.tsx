import React, { useCallback, useEffect, useRef, useState } from 'react'
import { NftType } from '../../models'
import styled from 'styled-components'
import { Icon, Modal } from '@material-ui/core'
import { Close } from '@material-ui/icons'
import Model from '../Model3d'
import Model3dLoadingPath from '../../assets/svg/loading.svg'

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
  position: relative;
  overflow: hidden;
  min-width: 300px;
  min-height: 52px;
  outline: none;

  .img {
    width: 100%;
    max-height: calc(100vh - 200px);
  }

  .main {
    position: fixed;
    width: 100%;
    max-width: 500px;
    height: 500px;
    top: 50%;
    left: 50%;
    margin: auto;
    transform: translate(-50%, -50%);
    display: flex;
  }

  .audio {
    width: 100%;
    position: absolute;
    bottom: 10px;
    left: 10px;
    height: 32px;
  }

  .video {
    width: calc(100% - 20px);
    background-color: #000;
    height: 500px;
    margin: auto;
  }

  .model3d {
    width: 100%;
    height: 100%;
    position: fixed;
    touch-action: none;
    backdrop-filter: blur(10px);
    background-color: rgba(0, 0, 0, 0);

    .model3d-loading {
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -25px;
      margin-left: -25px;
      width: 50px;
      height: 50px;
      animation: model3d-loading 1.5s infinite linear;
    }
  }

  @keyframes model3d-loading {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .close {
    position: fixed;
    top: 10px;
    right: 10px;
    cursor: pointer;
    color: #fff;
    opacity: 0.75;
    z-index: 10;
    &:hover {
      opacity: 1;
    }
  }
`

const Model3dContainer: React.FC<{ renderer?: string }> = ({ renderer }) => {
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    setIsLoading(true)
  }, [renderer])

  const onLoad = useCallback(() => {
    setIsLoading(false)
  }, [])

  return (
    <div className="model3d">
      {renderer ? <Model src={renderer} onLoad={onLoad} /> : null}
      {isLoading && (
        <img
          className="model3d-loading"
          src={Model3dLoadingPath}
          alt="loading"
        />
      )}
    </div>
  )
}

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
  const is3D = type === NftType._3D
  const [noPoster, setNoPoster] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [height, setHeight] = useState(window.innerHeight)
  const [previewContainerOffset, setPreviewContainerOffset] = useState('')

  const close = (): void => {
    audioRef?.current?.pause()
    videoRef?.current?.pause()
    onClose()
  }

  const updateHeight = () => setHeight(window.innerHeight)

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
  }, [open, audioRef, onError])

  useEffect(() => {
    setPreviewContainerOffset(open ? document.body.style.paddingRight : '')
  }, [open])

  useEffect(() => {
    window.addEventListener('resize', updateHeight)
    return () => window.addEventListener('resize', updateHeight)
  })

  return (
    <>
      <Modal open={open} onClose={close} onEscapeKeyDown={close} keepMounted>
        <PreviewContainer>
          <Icon className="close" onClick={close}>
            <Close />
          </Icon>
          {open && (
            <div
              className="main"
              style={{
                height: `${height}px`,
                paddingRight: previewContainerOffset,
              }}
            >
              {isVideo && (
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
                    ref={audioRef}
                    src={renderer}
                    onError={onError}
                    className="audio"
                    controls
                    controlsList="nodownload"
                  />
                </>
              )}
              {is3D && <Model3dContainer renderer={renderer} />}
            </div>
          )}
        </PreviewContainer>
      </Modal>
    </>
  )
}
