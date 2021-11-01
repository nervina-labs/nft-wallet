/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react'
import { BrowserQRCodeReader, Result } from '@zxing/library/esm'
import { TFunction } from 'react-i18next'
import styled from 'styled-components'
import { History } from 'history'
import {
  verifyCkbAddress,
  verifyEthAddress,
  verifyDasAddress,
} from '../../utils'
import ScanError from '../../assets/img/scan-error.png'
import { ReactComponent as BackSvg } from '../../assets/svg/back.svg'
import { ReactComponent as SwitchCam } from '../../assets/svg/switch-cam.svg'
import { Appbar, AppbarButton } from '../Appbar'
import { Button } from '../Button'
import { Drawer } from '@mibao-ui/components'

const Container = styled.div`
  display: flex;
  height: 100%;
  width: ${(props: { width?: number }) =>
    props.width !== undefined ? `${props.width}px` : '375px'};
  flex-direction: column;

  video {
    max-width: 100%;
    margin-bottom: 20px;
  }

  p {
    margin: 0;
    text-align: center;
    font-size: 14px;
    &.white {
      color: white;
    }
  }

  .dot {
    height: 5px;
    width: 5px;
    background-color: white;
    border-radius: 50%;
    display: inline-block;
  }

  .result {
    margin: 0 36px;
    margin-top: -44px;
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    img {
      width: 220px;
    }
    p {
      font-size: 12px;
      line-height: 16px;
      margin: 0;
      margin-top: 12px;
    }
    .warn {
      color: #f77d48;
    }
    .detect {
      color: #4c4c4c;
    }
    .content {
      color: #4c4c4c;
      opacity: 0.8;
    }

    button {
      margin-top: 32px;
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
export default class QrcodeScaner extends React.Component<QrcodeScanerProps, QrcodeScanerState> {
  private readonly videoRef = React.createRef<HTMLVideoElement>()
  private currentDeviceId: string | null = null

  public scaner: BrowserQRCodeReader | null = null

  state = {
    nonAddressResult: '',
    isScaning: false,
  }

  private facingMode: 'user' | 'environment' = 'environment'

  private readonly toggle = async (): Promise<void> => {
    await this.startScan(true)
  }

  private isSupportedFacingMode(): boolean {
    return (
      navigator?.mediaDevices?.getSupportedConstraints?.()?.facingMode ?? false
    )
  }

  public async startScan(toggle = false): Promise<void> {
    const { onDecode, onDecodeError, onScanCkbAddress } = this.props
    if (this.scaner === null) {
      this.scaner = new BrowserQRCodeReader()
    }
    if (toggle) {
      this.scaner.reset()
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
    const handleResult = (result?: Result): void => {
      if (result == null) {
        return
      }
      const text = result.getText().replace(/^ethereum:/, '')
      onDecode?.(text)
      this.setState({ isScaning: false })
      if (
        verifyCkbAddress(text) ||
        verifyEthAddress(text) ||
        verifyDasAddress(text)
      ) {
        this.setState({ nonAddressResult: '' })
        onScanCkbAddress(text)
      } else {
        this.setState({ nonAddressResult: text })
      }
      this.stopScan()
    }
    this.setState({ nonAddressResult: '', isScaning: true }, () => {
      if (this.isSupportedFacingMode()) {
        this.scaner?.decodeFromConstraints(
          { video: { facingMode: this.facingMode } },
          this.videoRef.current!,
          handleResult
        )
        this.facingMode =
          this.facingMode === 'environment' ? 'user' : 'environment'
      } else {
        this.scaner!.decodeOnceFromVideoDevice(deviceId, this.videoRef.current!)
          .then(handleResult)
          .catch(onDecodeError)
      }
    })
  }

  componentWillUnmount(): void {
    this.stopScan()
  }

  componentDidMount(): void {
    this.startScan()
  }

  public stopScan(): void {
    this.scaner?.reset()
    this.scaner = null
    this.setState({ isScaning: false })
  }

  render(): React.ReactNode {
    const { nonAddressResult: nonCkbAddressResult, isScaning } = this.state
    const { onCancel, isDrawerOpen, width, t } = this.props
    return (
      <Drawer
        isOpen={isDrawerOpen}
        onClose={onCancel}
        placement="left"
        hasOverlay
        contentProps={{
          padding: 0,
          width,
          backgroundColor: isScaning ? '#000' : '#fff',
        }}
        bodyProps={{
          padding: 0,
          width,
        }}
      >
        <Container
          width={width}
          style={{ backgroundColor: isScaning ? '#000' : '#fff' }}
        >
          <Appbar
            left={
              <AppbarButton onClick={onCancel}>
                <BackSvg />
              </AppbarButton>
            }
            transparent
            title={nonCkbAddressResult === '' ? '' : t('transfer.scan.result')}
            right={
              isScaning ? (
                <AppbarButton onClick={this.toggle}>
                  <SwitchCam />
                </AppbarButton>
              ) : null
            }
          />
          {isScaning ? (
            <>
              <video ref={this.videoRef} />
              <div style={{ textAlign: 'center' }}>
                <p className="white">{t('transfer.scan.qrcode')}</p>
                <p style={{ lineHeight: '10px' }}>
                  <span className="dot"></span>
                </p>
              </div>
            </>
          ) : null}
          {nonCkbAddressResult === '' ? null : (
            <div className="result">
              <img src={ScanError} alt={t('transfer.scan.error')} />
              <p className="warn">{t('transfer.scan.error')}</p>
              <p className="detect">{t('transfer.scan.detected')}</p>
              <p className="content">{nonCkbAddressResult}</p>
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
