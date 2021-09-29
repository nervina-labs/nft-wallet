declare namespace JSX {
  type ModelViewerProps = React.HTMLAttributes<HTMLElement> & {
    src: string
    ar?: boolean
    poster?: string
    'auto-rotate'?: boolean
    'shadow-intensity'?: string
    'camera-controls'?: boolean
    loading?: 'auto' | 'lazy' | 'eager'
    reveal?: 'auto' | 'interaction' | 'manual'
  }

  type ModelViewer = React.DetailedHTMLProps<ModelViewerProps, HTMLElement>

  interface IntrinsicElements {
    'model-viewer': ModelViewer
  }
}
