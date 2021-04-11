import React from 'react'
import QrScanner from 'qr-scanner'

export interface QrcodeScanerProps {
  onDecode: (result: string) => void
  onDecodeError?: ((error: string) => void) | undefined
  onStartError?: (error: any) => void
}

export class QrcodeScaner extends React.Component<QrcodeScanerProps> {
  private readonly videoRef = React.createRef<HTMLVideoElement>()
  public scaner: QrScanner | null = null

  componentDidMount(): void {
    const { onDecode, onDecodeError, onStartError } = this.props
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.scaner = new QrScanner(this.videoRef.current!, onDecode, onDecodeError)

    this.scaner.start().catch(onStartError)
  }

  componentWillUnmount(): void {
    this.scaner?.destroy()
    this.scaner = null
  }

  render(): React.ReactNode {
    return <video ref={this.videoRef} />
  }
}
