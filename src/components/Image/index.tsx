import React, { useCallback, useState } from 'react'
import Skeleton from '@material-ui/lab/Skeleton'

export interface LazyLoadImageProps {
  src: string | undefined
  alt?: string
  width: number
  height: number
  backup?: React.ReactNode
  variant?: 'circle' | 'rect' | 'text'
  cover?: boolean
  skeletonStyle?: React.CSSProperties
  onLoaded?: () => void
}

export const LazyLoadImage: React.FC<LazyLoadImageProps> = ({
  src,
  alt,
  width,
  height,
  variant,
  backup,
  cover,
  skeletonStyle,
  onLoaded,
}) => {
  const [loaded, setLoaded] = useState(false)
  const [shouldUseBackup, setShouldUseBackup] = useState(false)
  const onError = useCallback(() => {
    if (backup != null) {
      setShouldUseBackup(true)
      setLoaded(true)
    }
  }, [backup])
  return (
    <>
      {shouldUseBackup ? (
        backup
      ) : (
        <img
          src={src}
          onLoad={() => {
            setLoaded(true)
            onLoaded?.()
          }}
          onError={onError}
          alt={alt}
          style={{
            objectFit: variant === 'circle' || cover ? 'cover' : 'contain',
            display: loaded ? 'block' : 'none',
            width: `${width}px`,
            height: `${height}px`,
            maxWidth: '100%',
          }}
        />
      )}
      {!loaded ? (
        <Skeleton
          variant={variant ?? 'rect'}
          width={width}
          height={height}
          style={skeletonStyle}
        />
      ) : null}
    </>
  )
}
