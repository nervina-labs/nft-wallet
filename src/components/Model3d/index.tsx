import '@google/model-viewer'
import { useEffect, useRef } from 'react'

const Model = (props: {
  src: string
  poster?: string
  reveal?: 'auto' | 'interaction' | 'manual'
  className?: string
  style?: React.CSSProperties
  onClick?: React.EventHandler<React.SyntheticEvent>
  onLoad?: () => void
}) => {
  const ref = useRef<any>()
  useEffect(() => {
    const modelViewerElement = ref.current
    if (props.onLoad && modelViewerElement) {
      modelViewerElement.addEventListener('load', props.onLoad)
    }
    return () => {
      if (props.onLoad && modelViewerElement) {
        modelViewerElement.removeEventListener('load', props.onLoad)
      }
    }
  }, [props.onLoad])

  return (
    <>
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
    </>
  )
}

export default Model
