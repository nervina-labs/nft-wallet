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
  imageStyle?: React.CSSProperties
  setImageHeight?: boolean
  disableContextMenu?: boolean
  imgRef?: React.MutableRefObject<HTMLImageElement | null>
  onClick?: (e: React.SyntheticEvent<HTMLImageElement>) => void
  dataSrc?: string
}

const disableConext: React.MouseEventHandler = (e): boolean => {
  e.preventDefault()
  e.stopPropagation()
  return false
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
  disableContextMenu = true,
  imgRef,
  onClick,
  dataSrc,
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
          src={src == null ? '' : src}
          ref={imgRef}
          onContextMenu={disableContextMenu ? disableConext : undefined}
          data-src={dataSrc}
          onLoad={async () => {
            try {
              await onLoaded?.()
            } catch (error) {
              //
            }
            setLoaded(true)
            setShouldUseBackup(false)
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
            pointerEvents: disableContextMenu ? 'none' : 'auto',
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
