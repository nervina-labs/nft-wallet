import React from 'react'
import QrScanner from 'qr-scanner'
import styled from 'styled-components'
import { Drawer } from '@material-ui/core'
import { isValidCkbLongAddress } from '../../utils'
import { ReactComponent as BackSvg } from '../../assets/svg/back.svg'
import { Appbar } from '../Appbar'
import { Button } from '../Button'

const Container = styled.div`
  display: flex;
  height: 100%;
  width: 375px;
  flex-direction: column;

  video {
    margin-top: 2px;
  }

  .result {
    margin: 0 36px;
    margin-top: 80px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .title {
      font-weight: 600;
      font-size: 16px;
      line-height: 22px;
      color: rgba(0, 0, 0, 0.6);
      margin: 0;
      margin-bottom: 12px;
    }
    .qrcode {
      font-weight: 600;
      font-size: 16px;
      line-height: 22px;
      color: #000;
      word-break: break-all;
    }
    .error {
      font-weight: 600;
      font-size: 12px;
      line-height: 17px;
      text-align: center;
      color: #d03a3a;
      margin: 32px 0;
    }
  }
`

export interface QrcodeScanerProps {
  onScanCkbAddress: (address: string) => void
  onCancel: () => void
  isDrawerOpen: boolean
  onDecode?: (result: string) => void
  onDecodeError?: ((error: string) => void) | undefined
  onStartError?: (error: any) => void
}

export interface QrcodeScanerState {
  nonCkbAddressResult: string
  isScaning: boolean
}

// eslint-disable-next-line prettier/prettier
export class QrcodeScaner extends React.Component<QrcodeScanerProps, QrcodeScanerState> {
  private readonly videoRef = React.createRef<HTMLVideoElement>()
  public scaner: QrScanner | null = null

  state = {
    nonCkbAddressResult: '',
    isScaning: false,
  }

  public startScan(): void {
    this.setState({ nonCkbAddressResult: '', isScaning: true }, () => {
      const {
        onDecode,
        onDecodeError,
        onScanCkbAddress,
        onStartError,
      } = this.props
      // eslint-disable-next-line no-debugger
      // debugger
      setTimeout(() => {
        if (this.scaner === null) {
          this.scaner = new QrScanner(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.videoRef.current!,
            (result) => {
              onDecode?.(result)
              this.setState({ isScaning: false })
              if (isValidCkbLongAddress(result)) {
                this.setState({ nonCkbAddressResult: '' })
                onScanCkbAddress(result)
              } else {
                this.setState({ nonCkbAddressResult: result })
              }
              this.stopScan()
            },
            onDecodeError
          )

          this.scaner.start().catch(onStartError)
        }
      }, 400)
    })
  }

  componentWillUnmount(): void {
    this.stopScan()
  }

  public stopScan(): void {
    this.setState({ isScaning: false }, () => {
      this.scaner?.stop()
      this.scaner?.destroy()
      this.scaner = null
    })
  }

  render(): React.ReactNode {
    const { nonCkbAddressResult, isScaning } = this.state
    const { onCancel, isDrawerOpen } = this.props
    return (
      <Drawer open={isDrawerOpen}>
        <Container>
          <Appbar
            left={<BackSvg onClick={onCancel} />}
            title={nonCkbAddressResult === '' ? '二维码扫描' : '扫描结果'}
            right={<div />}
          />
          {isScaning ? <video ref={this.videoRef} /> : null}
          {nonCkbAddressResult === '' ? null : (
            <div className="result">
              <h3 className="title">已识别到的二维码内容</h3>
              <div className="qrcode">{nonCkbAddressResult}</div>
              <div className="error">请扫描正确的CKB地址二维码</div>
              <Button type="primary" onClick={this.startScan.bind(this)}>
                重新扫描
              </Button>
            </div>
          )}
        </Container>
      </Drawer>
    )
  }
}
