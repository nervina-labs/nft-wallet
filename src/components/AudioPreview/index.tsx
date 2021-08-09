import React, { useState } from 'react'
import styled from 'styled-components'
import { Dialog } from '@material-ui/core'

export interface AudioPreviewProps {
  img?: string
  src?: string
  onClose?: () => void
  open: boolean
}

const AudioPreviewContainer = styled.div`
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
`

const AudioPreview: React.FC<AudioPreviewProps> = (props) => {
  const [noImg, setNoImg] = useState(false)

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <AudioPreviewContainer>
        {props.img && !noImg && (
          <img
            className="img"
            src={props.img}
            alt="nft"
            onError={() => setNoImg(true)}
          />
        )}
        <audio
          src={props.src}
          className="audio"
          autoPlay
          controls
          controlsList="nodownload"
        />
      </AudioPreviewContainer>
    </Dialog>
  )
}

export default AudioPreview
