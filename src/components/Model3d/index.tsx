import '@google/model-viewer'

const Model = (props: {
  src: string
  poster?: string
  reveal?: 'auto' | 'interaction' | 'manual'
  className?: string
  style?: React.CSSProperties
  onClick?: React.EventHandler<React.SyntheticEvent>
}) => {
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
      />
    </>
  )
}

export default Model
