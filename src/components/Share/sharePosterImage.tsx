import React, { useCallback, useEffect, useState } from 'react'
import FallbackImg from '../../assets/svg/fallback.svg'
import { useUrlToBase64 } from './shareUtils'

export const SharePosterImage: React.FC<{
  src?: string
  onLoaded?: () => void
  fallbackImg?: string
}> = ({ src, onLoaded, fallbackImg = FallbackImg }) => {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const { data, isLoading, error } = useUrlToBase64(src)
  const onError = useCallback(() => {
    if (onLoaded && !loaded) {
      onLoaded()
    }
    setFailed(true)
    setLoaded(true)
  }, [onLoaded, loaded])

  useEffect(() => {
    if (error) {
      onError()
    }
  }, [error, onError])

  useEffect(() => {
    if (!src) {
      setFailed(true)
      setLoaded(true)
    } else {
      setLoaded(false)
    }
  }, [src])

  return (
    <img
      src={failed ? fallbackImg : data}
      alt="url"
      data-src={src}
      data-loading={isLoading}
      onLoad={onLoaded}
      onError={onError}
    />
  )
}
