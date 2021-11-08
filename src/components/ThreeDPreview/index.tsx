import { Box } from '@chakra-ui/react'
import styled from '@emotion/styled'
import '@google/model-viewer'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ReactComponent as ThreeDLoadingSvg } from '../../assets/svg/loading.svg'

interface ThreeDPreviewProps {
  src: string
  poster?: string
  reveal?: 'auto' | 'interaction' | 'manual'
  className?: string
  style?: React.CSSProperties
  onClick?: React.EventHandler<React.SyntheticEvent>
  onLoad?: () => void
  onError?: <T>(error: T) => void
}

const ThreeDPreviewContainer = styled(Box)`
  width: 100%;
  height: 100%;
  position: relative;

  .three-d-loading {
    width: 100px;
    height: 100px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -50px;
    margin-top: -50px;
    animation: three-d-loading 1.5s infinite linear;
  }

  @keyframes three-d-loading {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`

export const ThreeDPreview: React.FC<ThreeDPreviewProps> = ({
  onLoad,
  onError,
  ...props
}) => {
  const ref = useRef<any>()
  useEffect(() => {
    const modelViewerElement = ref.current
    if (Boolean(onLoad) && Boolean(modelViewerElement)) {
      modelViewerElement.addEventListener('load', onLoad)
    }
    return () => {
      if (Boolean(onLoad) && Boolean(modelViewerElement)) {
        modelViewerElement.removeEventListener('load', onLoad)
      }
    }
  }, [onLoad])

  useEffect(() => {
    const modelViewerElement = ref.current
    if (Boolean(onError) && Boolean(modelViewerElement)) {
      modelViewerElement.addEventListener('error', onError)
    }
    return () => {
      if (Boolean(onError) && Boolean(modelViewerElement)) {
        modelViewerElement.removeEventListener('error', onError)
      }
    }
  }, [onError])

  return (
    <model-viewer
      {...props}
      shadow-intensity="1"
      camera-controls
      auto-rotate
      loading="lazy"
      style={{
        width: '100%',
        height: '100%',
      }}
      ref={ref}
    />
  )
}

export const ThreeDPreviewWhitLoading: React.FC<{
  src: string
  onError?: () => void
  loader?: string
}> = ({ src, onError, loader }) => {
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    setIsLoading(Boolean(src))
  }, [src])

  const onLoad = useCallback(() => {
    setIsLoading(false)
  }, [])

  return (
    <ThreeDPreviewContainer>
      {src ? (
        <ThreeDPreview src={src} onLoad={onLoad} onError={onError} />
      ) : null}
      {isLoading
        ? loader ?? <ThreeDLoadingSvg className="three-d-loading" />
        : null}
    </ThreeDPreviewContainer>
  )
}
