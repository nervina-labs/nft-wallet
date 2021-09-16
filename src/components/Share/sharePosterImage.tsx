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
    if (loaded) return
    if (!isLoading) {
      setFailed(true)
      setLoaded(true)
    }
    if (onLoaded) {
      onLoaded()
    }
  }, [onLoaded, loaded, isLoading])
  const onLoad = useCallback(() => {
    if (loaded) return
    if (!isLoading) {
      setFailed(false)
      setLoaded(true)
    }
    if (onLoaded) {
      onLoaded()
    }
  }, [onLoaded, loaded, isLoading])

  useEffect(() => {
    if (!isLoading) {
      if (data) {
        onLoad()
      } else {
        onError()
      }
    }
    console.log('loaded src', src)
  }, [isLoading, error])

  return (
    <img
      src={failed ? fallbackImg : data}
      alt="url"
      data-src={src}
      data-loading={isLoading}
    />
  )
}
