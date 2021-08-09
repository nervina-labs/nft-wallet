import React from 'react'
import styled from 'styled-components'
import { Dialog } from '@material-ui/core'

export interface VideoPreviewProps {
  src?: string
  poster?: string
  onClose?: () => void
  open: boolean
}

const VideoPreviewContainer = styled.div`
  display: flex;
  background-color: rgba(0, 0, 0, 0);
  width: 100%;
  max-width: 500px;

  .video {
    width: 100%;
    background-color: #000;
    margin: auto;
  }
`

const VideoPreview: React.FC<VideoPreviewProps> = (props) => {
  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <VideoPreviewContainer>
        <video
          src={props.src}
          className="video"
          autoPlay
          controls
          controlsList="nodownload"
          playsInline
          poster={props.poster}
        />
      </VideoPreviewContainer>
    </Dialog>
  )
}

export default VideoPreview
