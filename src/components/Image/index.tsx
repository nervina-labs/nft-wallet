import React, { useCallback, useEffect, useState } from 'react'
import Skeleton from '@material-ui/lab/Skeleton'
import { PhotoConsumer } from 'react-photo-view'

export type LazyLoadImageVariant = 'circle' | 'rect' | 'text'

export interface LazyLoadImageProps {
  src: string | undefined
  alt?: string
  width: number
  height: number
  backup?: React.ReactNode
  variant?: LazyLoadImageVariant
  cover?: boolean
  skeletonStyle?: React.CSSProperties
  onLoaded?: () => void
  imageStyle?: React.CSSProperties
  setImageHeight?: boolean
  disableContextMenu?: boolean
  imgRef?: React.MutableRefObject<HTMLImageElement | null>
  onClick?: (e: React.SyntheticEvent<HTMLImageElement>) => void
  dataSrc?: string
  enablePreview?: boolean
}

const disableContext: React.MouseEventHandler = (e): boolean => {
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
  enablePreview,
}) => {
  const [loaded, setLoaded] = useState(false)
  const [shouldUseBackup, setShouldUseBackup] = useState(false)
  const onError = useCallback(() => {
    if (backup != null) {
      setShouldUseBackup(true)
      setLoaded(true)
    }
  }, [backup])

  useEffect(() => {
    const img = new Image()
    if (src) {
      img.src = src
    }
    img.onload = async () => {
      try {
        await onLoaded?.()
      } catch (error) {
        console.log(error)
      }
      setLoaded(true)
      setShouldUseBackup(false)
    }
    img.onerror = () => {
      console.log('error')
      onError()
    }
  }, [src, onError, onLoaded])

  const ImgElement = (
    <img
      src={src === null ? '' : src}
      ref={imgRef}
      onContextMenu={disableContextMenu ? disableContext : undefined}
      data-src={dataSrc}
      onClick={onClick}
      alt={alt}
      style={{
        objectFit: variant === 'circle' || cover ? 'cover' : 'contain',
        display: loaded ? 'block' : 'none',
        width: `${width}px`,
        height: setImageHeight ? `${height}px` : 'auto',
        maxWidth: '100%',
        cursor: enablePreview ? 'zoom-in' : undefined,
        ...imageStyle,
      }}
    />
  )

  return (
    <>
      {shouldUseBackup ? (
        backup
      ) : enablePreview ? (
        <PhotoConsumer src={(dataSrc ?? src) as string}>
          {ImgElement}
        </PhotoConsumer>
      ) : (
        ImgElement
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
