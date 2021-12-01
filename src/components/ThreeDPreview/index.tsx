import { Box, Center, Flex } from '@chakra-ui/react'
import styled from '@emotion/styled'
import '@google/model-viewer'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ReactComponent as ThreeDLoadingSvg } from '../../assets/svg/loading.svg'
import { ReactComponent as ThreeDTipsArrowSvg } from '../../assets/svg/three-d-tips-arrow.svg'
import { ReactComponent as ThreeDTipsIconSvg } from '../../assets/svg/three-d-tips-icon.svg'
import { ReactComponent as ThreeDTipsCloseSvg } from '../../assets/svg/three-d-tips-close.svg'
import { IS_ANDROID, IS_WEXIN } from '../../constants'

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

  .tips-icon {
    margin-right: 6px;
  }

  .tips-arrow {
    position: absolute;
    top: 0;
    right: -60px;
  }

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

const ThreeDPreview: React.FC<ThreeDPreviewProps> = ({
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

const ThreeDPreviewWithLoading: React.FC<{
  src: string
  onError?: () => void
  loader?: string
}> = ({ src, onError, loader }) => {
  const { t } = useTranslation('translations')
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    setIsLoading(Boolean(src))
  }, [src])

  const onLoad = useCallback(() => {
    setIsLoading(false)
  }, [])

  const [isClosedTips, setIsClosedTips] = useState(false)

  return (
    <ThreeDPreviewContainer>
      {IS_ANDROID && IS_WEXIN && !isClosedTips ? (
        <Box
          position="absolute"
          top="8px"
          left="calc(50% - 20px)"
          w="245px"
          bg="white"
          fontSize="13px"
          rounded="8px"
          py="10px"
          px="20px"
          transform="translateX(-60%)"
          zIndex={1}
          onClick={() => setIsClosedTips(true)}
        >
          <Flex fontSize="14px" fontWeight="bold" w="full" alignItems="center">
            <ThreeDTipsIconSvg className="tips-icon" />
            {t('common.3d.tips-title')}
          </Flex>
          {t('common.3d.tips-desc')}
          <ThreeDTipsArrowSvg className="tips-arrow" />
          <Center
            position="absolute"
            top="10px"
            right="10px"
            bg="#F5F5F5"
            rounded="full"
            w="15px"
            h="15px"
          >
            <ThreeDTipsCloseSvg />
          </Center>
        </Box>
      ) : null}

      {src ? (
        <ThreeDPreview src={src} onLoad={onLoad} onError={onError} />
      ) : null}
      {isLoading
        ? loader ?? <ThreeDLoadingSvg className="three-d-loading" />
        : null}
    </ThreeDPreviewContainer>
  )
}

export default ThreeDPreviewWithLoading
