import React, { useCallback, useRef, useState } from 'react'
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
  onLoaded?: (img: HTMLImageElement | null) => void
  imageStyle?: React.CSSProperties
  setImageHeight?: boolean
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
  imageStyle,
  setImageHeight = true,
}) => {
  const [loaded, setLoaded] = useState(false)
  const [shouldUseBackup, setShouldUseBackup] = useState(false)
  const onError = useCallback(() => {
    if (backup != null) {
      setShouldUseBackup(true)
      setLoaded(true)
    }
  }, [backup])
  const imgRef = useRef(null)
  return (
    <>
      {shouldUseBackup ? (
        backup
      ) : (
        <img
          src={src}
          ref={imgRef}
          onLoad={() => {
            setLoaded(true)
            onLoaded?.(imgRef.current)
          }}
          onError={onError}
          alt={alt}
          style={{
            ...imageStyle,
            objectFit: variant === 'circle' || cover ? 'cover' : 'contain',
            display: loaded ? 'block' : 'none',
            width: `${width}px`,
            height: setImageHeight ? `${height}px` : 'auto',
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
