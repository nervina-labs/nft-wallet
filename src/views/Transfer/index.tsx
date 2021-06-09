import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Redirect, useHistory, useLocation, useParams } from 'react-router'
import { Appbar } from '../../components/Appbar'
import { NFTDetail, Query } from '../../models'
import { RoutePath } from '../../routes'
import { ReactComponent as BackSvg } from '../../assets/svg/back.svg'
import { ReactComponent as ScanSvg } from '../../assets/svg/scan.svg'
import { ReactComponent as ErrorSvg } from '../../assets/svg/error.svg'
import { ReactComponent as CloseSvg } from '../../assets/svg/close.svg'
import ArrowPng from '../../assets/img/arrow.png'
import SuccessPng from '../../assets/img/success.png'
import FailPng from '../../assets/img/fail.png'
import InfoIcon from '@material-ui/icons/Info'
import { Button } from '../../components/Button'
import { Drawer, TextareaAutosize } from '@material-ui/core'
import { LazyLoadImage } from '../../components/Image'
import {
  verifyEthContractAddress,
  verifyCkbLongAddress,
  verifyEthAddress,
} from '../../utils'
import { ActionDialog } from '../../components/ActionDialog'
import { useWalletModel, WalletType } from '../../hooks/useWallet'
import { QrcodeScaner } from '../../components/QRcodeScaner.tsx'
import { useWidth } from '../../hooks/useWidth'
import { useQuery } from 'react-query'
import { CONTAINER_MAX_WIDTH, IS_IPHONE, IS_MAINNET } from '../../constants'
import UnipassProvider from '../../pw/UnipassProvider'
import { Address, AddressType } from '@lay2/pw-core'
import { useTranslation } from 'react-i18next'
import { Box, Container, DrawerContainer } from './styled'

export enum FailedMessage {
  SignFail = 'sign-fail',
  TranferFail = 'tranfer-fail',
  NoCamera = 'no-camera',
  ContractAddress = 'contract-address',
  IOSWebkit = 'ios-webkit',
}

export const Transfer: React.FC = () => {
  const location = useLocation<{ nftDetail?: NFTDetail }>()
  const history = useHistory()
  const {
    signTransaction,
    api,
    isLogined,
    address,
    prevAddress,
    provider,
    walletType,
  } = useWalletModel()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [ckbAddress, setCkbAddress] = useState('')
  const [failedStatus, setFailedMessage] = useState(FailedMessage.TranferFail)
  const [isSendingNFT, setIsSendingNFT] = useState(false)
  const [isAddressValid, setIsAddressValid] = useState(false)
  const [isSendDialogSuccess, setIsSendDialogSuccess] = useState(false)
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false)
  const [isScaning, setIsScaning] = useState(false)
  const qrcodeScanerRef = useRef<QrcodeScaner>(null)
  const { t } = useTranslation('translations')

  const failedMessage = useMemo(() => {
    return t(`transfer.error.${failedStatus}`)
  }, [t, failedStatus])

  useEffect(() => {
    if (
      prevAddress &&
      address &&
      prevAddress !== address &&
      provider instanceof UnipassProvider
    ) {
      provider.terminate()
      history.replace(RoutePath.NFT)
    }
  }, [prevAddress, address, provider, history])

  const isEthAddress = useMemo(() => {
    return verifyEthAddress(ckbAddress)
  }, [ckbAddress])

  const isSameAddress = useMemo(() => {
    if (isEthAddress) {
      return new Address(ckbAddress, AddressType.eth).toCKBAddress() === address
    }
    return address !== '' && address === ckbAddress
  }, [address, ckbAddress, isEthAddress])

  const inputOnChange = useCallback(
    (val: string) => {
      let isValidAddress = verifyCkbLongAddress(val)
      let isSameAddress = val !== '' && address === val
      const isEthAddress = verifyEthAddress(val)
      if (isEthAddress) {
        isSameAddress =
          new Address(val, AddressType.eth).toCKBAddress() === address
      }
      if (isSameAddress) {
        isValidAddress = false
      }
      if (IS_MAINNET && val.startsWith('ckt')) {
        isValidAddress = false
      }
      if (!IS_MAINNET && val.startsWith('ckb')) {
        isValidAddress = false
      }
      if (isEthAddress && !isSameAddress) {
        isValidAddress = true
      }
      setIsAddressValid(isValidAddress)
      setCkbAddress(val)
    },
    [address]
  )

  const textareaOnChange = useCallback(
    async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const val = e.target.value
      inputOnChange(val)
    },
    [inputOnChange]
  )

  const stopTranfer = (isSuccess: boolean): void => {
    setIsSendingNFT(false)
    setIsDrawerOpen(false)
    if (isSuccess) {
      setIsSendDialogSuccess(true)
    } else {
      setIsErrorDialogOpen(true)
    }
  }
  const transferOnClick = useCallback(async () => {
    if (isEthAddress) {
      const isContract = await verifyEthContractAddress(ckbAddress)
      if (isContract) {
        setFailedMessage(FailedMessage.ContractAddress)
        setIsErrorDialogOpen(true)
        return
      }
    }
    setIsDrawerOpen(true)
  }, [isEthAddress, ckbAddress])
  const { id } = useParams<{ id: string }>()

  const sendNFT = useCallback(async () => {
    setIsSendingNFT(true)
    try {
      const sentAddress = new Address(
        ckbAddress,
        isEthAddress ? AddressType.eth : AddressType.ckb
      ).toCKBAddress()
      const { tx } = await api
        .getTransferNftTransaction(
          id,
          sentAddress,
          walletType === WalletType.Unipass
        )
        .catch((err) => {
          setFailedMessage(FailedMessage.TranferFail)
          stopTranfer(false)
          throw new Error(err)
        })

      const signTx = await signTransaction(tx).catch((err) => {
        setFailedMessage(FailedMessage.SignFail)
        stopTranfer(false)
        throw new Error(err)
      })

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await api.transfer(id, signTx!, sentAddress).catch((err) => {
        setFailedMessage(FailedMessage.TranferFail)
        stopTranfer(false)
        console.log(err)
        throw err
      })
    } catch (error) {
      console.log(error)
      return
    }
    stopTranfer(true)
  }, [signTransaction, id, ckbAddress, api, walletType, isEthAddress])
  const closeDrawer = (): void => setIsDrawerOpen(false)
  const stopScan = (): void => {
    setIsScaning(false)
    qrcodeScanerRef.current?.stopScan()
  }
  const [hasPermission, setHasPermission] = useState(true)
  const [hasVideoDevice, setHasVideoDevice] = useState(false)
  const startScan = useCallback(() => {
    if (!hasVideoDevice) {
      setFailedMessage(
        IS_IPHONE ? FailedMessage.IOSWebkit : FailedMessage.NoCamera
      )
      setIsErrorDialogOpen(true)
      return
    }
    if (hasPermission) {
      setIsScaning(true)
      qrcodeScanerRef.current?.startScan()
    } else {
      alert(t('transfer.error.camera-auth'))
    }
  }, [hasPermission, hasVideoDevice, t])

  useEffect(() => {
    try {
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          setHasVideoDevice(devices.some((d) => d.kind === 'videoinput'))
        })
        .catch(Boolean)
    } catch (error) {
      setHasVideoDevice(false)
    }
  }, [])

  const { data: remoteNftDetail, failureCount } = useQuery(
    [Query.NFTDetail, id, api],
    async () => {
      const { data } = await api.getNFTDetail(id)
      return data
    },
    { enabled: id != null && location.state?.nftDetail == null }
  )

  const nftDetail = useMemo(() => {
    return location.state?.nftDetail ?? remoteNftDetail
  }, [location.state, remoteNftDetail])

  const appRef = useRef(null)
  const containerRef = useRef(null)
  const containerWidth = useWidth(appRef)
  const bodyRef = useRef(document.body)
  const bodyWidth = useWidth(bodyRef)

  const drawerLeft = useMemo(() => {
    if (bodyWidth == null) {
      return 0
    }
    if (bodyWidth <= CONTAINER_MAX_WIDTH) {
      return 0
    }
    return `${(bodyWidth - CONTAINER_MAX_WIDTH) / 2}px`
  }, [bodyWidth])

  const isInvalid = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    if (remoteNftDetail?.is_class_banned || remoteNftDetail?.is_issuer_banned) {
      return true
    }
    return (
      failureCount >= 2 ||
      remoteNftDetail?.tx_state === 'pending' ||
      (remoteNftDetail?.to_address !== address &&
        remoteNftDetail?.to_address !== undefined)
    )
  }, [address, remoteNftDetail, failureCount])

  const alertMsg = useMemo(() => {
    if (ckbAddress.startsWith('0x') && !verifyEthAddress(ckbAddress)) {
      return t('transfer.error.eth')
    }
    if (
      (ckbAddress.startsWith('ckt') || ckbAddress.startsWith('ckb')) &&
      !verifyCkbLongAddress(ckbAddress)
    ) {
      return t('transfer.error.ckb')
    }
    if (isEthAddress) {
      return isSameAddress
        ? t('transfer.error.self')
        : t('transfer.error.receive-eth')
    }
    return isSameAddress ? t('transfer.error.self') : t('transfer.error.common')
  }, [isSameAddress, isEthAddress, ckbAddress, t])

  const colonWithSpace = useMemo(() => {
    const c = t('common.colon')
    return c === ':' ? ': ' : c
  }, [t])

  if (isInvalid) {
    return <Redirect to={RoutePath.NotFound} />
  }

  return isLogined ? (
    <Container ref={containerRef}>
      <Appbar
        title={t('transfer.transfer')}
        left={<BackSvg onClick={() => history.goBack()} />}
        right={<div />}
        ref={appRef}
      />
      <QrcodeScaner
        ref={qrcodeScanerRef}
        isDrawerOpen={isScaning}
        onCancel={stopScan}
        history={history}
        width={containerWidth}
        t={t}
        onScanCkbAddress={(addr) => {
          inputOnChange(addr)
          stopScan()
        }}
        onDecodeError={(e) => {
          const msg = e.toString()
          if (msg.includes('permission')) {
            setHasPermission(false)
          }
          if (msg.includes('before any code')) {
            return
          }
          stopScan()
        }}
      />
      <section className="main">
        <div className="boxes">
          <Box>
            <label>{t('transfer.address')}</label>
            <div className="form">
              <TextareaAutosize
                className="input"
                placeholder={t('transfer.placeholder')}
                value={ckbAddress}
                onChange={textareaOnChange}
                rowsMax={4}
              />
              <ScanSvg onClick={startScan} />
            </div>
            <div
              className={`alert ${
                isEthAddress && isAddressValid ? 'info' : 'error'
              }`}
              style={{
                visibility:
                  (!isAddressValid && ckbAddress !== '') ||
                  (isEthAddress && isAddressValid)
                    ? 'visible'
                    : 'hidden',
              }}
            >
              {isEthAddress ? <InfoIcon /> : <ErrorSvg />}
              {alertMsg}
            </div>
            <div className="action">
              <div
                className={`${!isAddressValid ? 'disabled' : ''} transfer`}
                onClick={isAddressValid ? transferOnClick : undefined}
              >
                <img src={ArrowPng} />
              </div>
            </div>
          </Box>
          <Box
            style={{
              margin: '0 22px',
              opacity: '.6',
              top: '-210px',
              zIndex: 2,
            }}
          ></Box>
          <Box
            style={{
              margin: '0 29px',
              opacity: '.3',
              top: '-420px',
              zIndex: 1,
            }}
          ></Box>
        </div>
        <div className="desc">
          {t('transfer.check')}&nbsp;
          {t('transfer.once-transfer')}
        </div>
      </section>
      <ActionDialog
        icon={<img src={SuccessPng} />}
        content={t('transfer.tips')}
        extra={
          <p style={{ color: '#1FD345', fontSize: '13px' }}>
            {t('transfer.submitted')}
          </p>
        }
        open={isSendDialogSuccess}
        onConfrim={() => {
          setIsSendDialogSuccess(false)
          history.push(RoutePath.Transactions)
        }}
      />
      <ActionDialog
        icon={<img src={FailPng} />}
        content={failedMessage}
        open={isErrorDialogOpen}
        onConfrim={() => setIsErrorDialogOpen(false)}
        onBackdropClick={() => setIsErrorDialogOpen(false)}
      />
      <Drawer
        anchor="bottom"
        open={isDrawerOpen}
        PaperProps={{
          style: {
            position: 'absolute',
            width: drawerLeft === 0 ? '100%' : `${CONTAINER_MAX_WIDTH}px`,
            left: drawerLeft,
            borderRadius: '20px 20px 0px 0px',
          },
        }}
        disableEnforceFocus
        disableEscapeKeyDown
      >
        {nftDetail !== undefined ? (
          <DrawerContainer>
            <div className="header">
              <span></span>
              {
                <CloseSvg
                  style={{ visibility: isSendingNFT ? 'hidden' : 'visible' }}
                  onClick={closeDrawer}
                />
              }
            </div>
            <div className="card">
              <LazyLoadImage
                src={nftDetail.bg_image_url}
                width={100}
                height={100}
                cover
                imageStyle={{ borderRadius: '10px' }}
              />
            </div>
            <div className="title">
              {`${t('transfer.transfer')}${colonWithSpace}${nftDetail.name}`}
            </div>
            <p className="address">
              {`${t('transfer.address')}${colonWithSpace}${ckbAddress}`}
            </p>
            <div className="center">
              <Button
                type="primary"
                onClick={sendNFT}
                disbaled={isSendingNFT}
                isLoading={isSendingNFT}
              >
                {isSendingNFT ? t('transfer.signing') : t('transfer.comfirm')}
              </Button>
            </div>
          </DrawerContainer>
        ) : null}
      </Drawer>
    </Container>
  ) : (
    <Redirect to={RoutePath.Explore} />
  )
}
