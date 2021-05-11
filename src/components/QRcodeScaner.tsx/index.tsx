/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react'
import { BrowserQRCodeReader } from '@zxing/library'
import { TFunction } from 'react-i18next'
import styled from 'styled-components'
import { Drawer } from '@material-ui/core'
import { History } from 'history'
import { verifyCkbLongAddress, verifyEthAddress } from '../../utils'
import { ReactComponent as BackSvg } from '../../assets/svg/back.svg'
import { ReactComponent as CameraSvg } from '../../assets/svg/camera.svg'
import { Appbar } from '../Appbar'
import { Button } from '../Button'

const Container = styled.div`
  display: flex;
  height: 100%;
  width: ${(props: { width?: number }) =>
    props.width !== undefined ? `${props.width}px` : '375px'};
  flex-direction: column;

  video {
    margin-top: 2px;
    max-width: 100%;
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
  width?: number
  history: History<unknown>
  t: TFunction<'translations'>
}

export interface QrcodeScanerState {
  nonAddressResult: string
  isScaning: boolean
}

// eslint-disable-next-line prettier/prettier
export class QrcodeScaner extends React.Component<QrcodeScanerProps, QrcodeScanerState> {
  private readonly videoRef = React.createRef<HTMLVideoElement>()
  private currentDeviceId: string | null = null

  public scaner: BrowserQRCodeReader | null = null

  state = {
    nonAddressResult: '',
    isScaning: false,
  }

  private readonly toggle = async (): Promise<void> => {
    await this.startScan(true)
  }

  public async startScan(toggle = false): Promise<void> {
    const { onDecode, onDecodeError, onScanCkbAddress } = this.props
    if (this.scaner === null) {
      this.scaner = new BrowserQRCodeReader()
    }
    const devices = await this.scaner.listVideoInputDevices()
    let deviceId =
      devices.find((d) => {
        const label = d.label.toLowerCase()
        return label.includes('back') || label.includes('后')
      })?.deviceId ?? devices[0].deviceId

    if (this.currentDeviceId === null) {
      this.currentDeviceId = deviceId
    }

    if (toggle) {
      deviceId =
        devices.find((d) => d.deviceId !== this.currentDeviceId)?.deviceId ??
        deviceId
    }
    this.currentDeviceId = deviceId
    this.setState({ nonAddressResult: '', isScaning: true }, () => {
      this.scaner!.decodeOnceFromVideoDevice(deviceId, this.videoRef.current!)
        .then((result) => {
          if (result == null) {
            return
          }
          const text = result.getText().replace(/^ethereum:/, '')
          onDecode?.(text)
          this.setState({ isScaning: false })
          if (verifyCkbLongAddress(text) || verifyEthAddress(text)) {
            this.setState({ nonAddressResult: '' })
            onScanCkbAddress(text)
          } else {
            this.setState({ nonAddressResult: text })
          }
          this.stopScan()
        })
        .catch(onDecodeError)
    })
  }

  componentWillUnmount(): void {
    this.stopScan()
  }

  public stopScan(): void {
    this.setState({ isScaning: false }, () => {
      this.scaner?.reset()
      this.scaner = null
    })
  }

  render(): React.ReactNode {
    const { nonAddressResult: nonCkbAddressResult, isScaning } = this.state
    const { onCancel, isDrawerOpen, width, t } = this.props
    return (
      <Drawer open={isDrawerOpen}>
        <Container width={width}>
          <Appbar
            left={<BackSvg onClick={onCancel} />}
            title={
              nonCkbAddressResult === ''
                ? t('transfer.scan.qrcode')
                : t('transfer.scan.result')
            }
            right={<CameraSvg onClick={this.toggle} />}
          />
          {isScaning ? <video ref={this.videoRef} /> : null}
          {nonCkbAddressResult === '' ? null : (
            <div className="result">
              <h3 className="title">{t('transfer.scan.detected')}</h3>
              <div className="qrcode">{nonCkbAddressResult}</div>
              <div className="error">{t('transfer.scan.error')}</div>
              <Button type="primary" onClick={this.startScan.bind(this)}>
                {t('transfer.scan.rescan')}
              </Button>
            </div>
          )}
        </Container>
      </Drawer>
    )
  }
}
