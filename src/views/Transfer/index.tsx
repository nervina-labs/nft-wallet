import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Redirect, useHistory, useLocation, useParams } from 'react-router'
import classnames from 'classnames'
import { Appbar } from '../../components/Appbar'
import { NFTDetail, NftType, Query } from '../../models'
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
import {
  verifyEthContractAddress,
  verifyCkbAddress,
  verifyEthAddress,
  verifyDasAddress,
  generateUnipassSignTxUrl,
} from '../../utils'
import { ActionDialog } from '../../components/ActionDialog'
import { QrcodeScaner } from '../../components/QRcodeScaner'
import { useWidth } from '../../hooks/useWidth'
import { useQuery } from 'react-query'
import { CONTAINER_MAX_WIDTH, IS_IPHONE, IS_MAINNET } from '../../constants'
import UnipassProvider from '../../pw/UnipassProvider'
import { Address, AddressType } from '@lay2/pw-core'
import { useTranslation } from 'react-i18next'
import { AccountRecord } from 'das-sdk'
import { Box, Container, DrawerContainer } from './styled'
import { UnipassTransferNftState } from '../../models/unipass'
import { DasSelector } from './dasSelector'
import { CardImage } from '../../components/Card/CardImage'
import {
  useAccount,
  useAccountStatus,
  useAPI,
  useProvider,
  useSignTransaction,
  WalletType,
} from '../../hooks/useAccount'

export enum FailedMessage {
  SignFail = 'sign-fail',
  TranferFail = 'tranfer-fail',
  NoCamera = 'no-camera',
  ContractAddress = 'contract-address',
  IOSWebkit = 'ios-webkit',
}

export interface TransferState {
  nftDetail?: NFTDetail
  signature?: string
  prevState?: UnipassTransferNftState
}

enum AlertLevel {
  info = 'info',
  error = 'error',
}

enum AddressVerifiedType {
  empty = 'empty',
  self = 'self',
  unsupported = 'unsupported',
  ckb = 'ckb',
  eth = 'eth',
  das = 'das',
}

function verifyAddress(address: string, self?: string): AddressVerifiedType {
  // empty
  if (address === '' || address === null || address === undefined) {
    return AddressVerifiedType.empty
  }
  // self
  if (self === address) {
    return AddressVerifiedType.self
  }
  // ckb
  if (verifyCkbAddress(address)) {
    if (IS_MAINNET && address.startsWith('ckt')) {
      return AddressVerifiedType.unsupported
    }
    if (!IS_MAINNET && address.startsWith('ckb')) {
      return AddressVerifiedType.unsupported
    }
    return AddressVerifiedType.ckb
  }
  // eth
  if (verifyEthAddress(address)) {
    const eth2ckbAddress = new Address(address, AddressType.eth).toCKBAddress()
    if (self === eth2ckbAddress) {
      return AddressVerifiedType.self
    }
    return AddressVerifiedType.eth
  }
  // das
  if (verifyDasAddress(address)) {
    return AddressVerifiedType.das
  }
  return AddressVerifiedType.unsupported
}

export const Transfer: React.FC = () => {
  const routerLocation = useLocation<TransferState>()
  const history = useHistory()
  const signTransaction = useSignTransaction()
  const api = useAPI()
  const { isLogined, prevAddress } = useAccountStatus()
  const { address, walletType, pubkey } = useAccount()
  const provider = useProvider()
  const prevState = routerLocation.state?.prevState
  const hasSignature = !!routerLocation.state?.signature
  const [isDrawerOpen, setIsDrawerOpen] = useState(hasSignature ?? false)
  const [ckbAddress, setCkbAddress] = useState(prevState?.ckbAddress ?? '')
  const [failedStatus, setFailedMessage] = useState(FailedMessage.TranferFail)
  const [isSendingNFT, setIsSendingNFT] = useState(false)
  const [isSendDialogSuccess, setIsSendDialogSuccess] = useState(false)
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false)
  const [isScaning, setIsScaning] = useState(false)
  // eslint-disable-next-line prettier/prettier
  const dasPopoutVisibleTrigger = useRef<(popoutVisible: boolean) => void>()
  const [
    selectedDasAccount,
    setSelectedDasAccount,
  ] = useState<AccountRecord | null>(null)
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

  const ckbAddressType = useMemo(() => {
    return verifyAddress(ckbAddress, address)
  }, [ckbAddress, address])

  const isEthAddress = useMemo(() => {
    return ckbAddressType === AddressVerifiedType.eth
  }, [ckbAddressType])

  // const isSameAddress = useMemo(() => {
  //   return ckbAddressType === AddressVerifiedType.self
  // }, [ckbAddressType])

  const isDasAddress = useMemo(() => {
    return ckbAddressType === AddressVerifiedType.das
  }, [ckbAddressType])

  const finalUsedAddress = useMemo(() => {
    if (isDasAddress && selectedDasAccount) {
      return selectedDasAccount.value
    }
    return ckbAddress
  }, [ckbAddress, isDasAddress, selectedDasAccount])

  const finalUsedAddressType = useMemo(() => {
    if (isDasAddress && selectedDasAccount) {
      return verifyAddress(selectedDasAccount.value, address)
    }
    return ckbAddressType
  }, [isDasAddress, selectedDasAccount, ckbAddressType, address])

  const textareaOnChange = useCallback(
    async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      let val = e.target.value
      if (verifyDasAddress(val)) {
        val = val.toLowerCase()
      }
      setCkbAddress(val)
    },
    [setCkbAddress]
  )

  const handleTextareaFocus = useCallback(() => {
    if (isDasAddress && dasPopoutVisibleTrigger.current) {
      dasPopoutVisibleTrigger.current(true)
    }
  }, [isDasAddress])

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
    if (isEthAddress || (isDasAddress && verifyEthAddress(finalUsedAddress))) {
      const isContract = await verifyEthContractAddress(finalUsedAddress)
      if (isContract) {
        setFailedMessage(FailedMessage.ContractAddress)
        setIsErrorDialogOpen(true)
        return
      }
    }
    setIsDrawerOpen(true)
  }, [isEthAddress, finalUsedAddress, isDasAddress])
  const { id } = useParams<{ id: string }>()

  const sendNFT = useCallback(async () => {
    setIsSendingNFT(true)
    try {
      const isFinalUsedAddressTypeEth =
        finalUsedAddressType === AddressVerifiedType.eth
      const sentAddress = new Address(
        finalUsedAddress,
        isFinalUsedAddressTypeEth ? AddressType.eth : AddressType.ckb
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

      if (walletType === WalletType.Unipass) {
        const { signature } = routerLocation.state ?? {}
        if (signature) {
          await api.transfer(id, tx, sentAddress, signature).catch((err) => {
            setFailedMessage(FailedMessage.TranferFail)
            stopTranfer(false)
            console.log(err)
            throw err
          })
        } else {
          const url = `${location.origin}${RoutePath.Unipass}`
          location.href = generateUnipassSignTxUrl(url, url, pubkey, signTx, {
            uuid: id,
            ckbAddress: sentAddress,
          })
          return
        }
      } else {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        await api.transfer(id, signTx, sentAddress).catch((err) => {
          setFailedMessage(FailedMessage.TranferFail)
          stopTranfer(false)
          console.log(err)
          throw err
        })
      }
    } catch (error) {
      console.log(error)
      return
    }
    stopTranfer(true)
  }, [
    signTransaction,
    id,
    finalUsedAddress,
    finalUsedAddressType,
    api,
    walletType,
    routerLocation.state,
    pubkey,
  ])

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
    { enabled: id != null && routerLocation.state?.nftDetail == null }
  )

  const nftDetail = useMemo(() => {
    return routerLocation.state?.nftDetail ?? remoteNftDetail
  }, [routerLocation.state, remoteNftDetail])

  const initSending = useRef(false)
  useEffect(() => {
    const { prevState, signature } = routerLocation.state ?? {}
    if (
      prevState &&
      signature &&
      nftDetail &&
      isDrawerOpen &&
      !initSending.current
    ) {
      initSending.current = true
      sendNFT().catch(Boolean)
    }
  }, [routerLocation.state, isDrawerOpen, nftDetail, sendNFT])

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

  const getAlertMsg = useCallback(
    (addr: string, type: AddressVerifiedType): [AlertLevel, string] => {
      if (addr.startsWith('0x') && type === AddressVerifiedType.unsupported) {
        return [AlertLevel.error, t('transfer.error.eth')]
      }
      if (
        (addr.startsWith('ckt') || addr.startsWith('ckb')) &&
        type === AddressVerifiedType.unsupported
      ) {
        return [AlertLevel.error, t('transfer.error.ckb')]
      }
      if (
        (addr.startsWith('ckt') || addr.startsWith('ckb')) &&
        addr.length !== 95
      ) {
        return [AlertLevel.info, t('transfer.error.short-address')]
      }
      if (type === AddressVerifiedType.eth) {
        return [AlertLevel.info, t('transfer.error.receive-eth')]
      }
      if (type === AddressVerifiedType.self) {
        return [AlertLevel.error, t('transfer.error.self')]
      }
      return [AlertLevel.error, t('transfer.error.common')]
    },
    [t]
  )

  const [isAddressValid, showAlert, alertLevel, alertMsg] = useMemo(() => {
    const valid =
      finalUsedAddressType === AddressVerifiedType.eth ||
      finalUsedAddressType === AddressVerifiedType.ckb
    const showAlert =
      (!valid && finalUsedAddress !== '') ||
      (finalUsedAddressType === AddressVerifiedType.eth && valid) ||
      (valid && finalUsedAddress.length !== 95)
    let level = ''
    let alertMsg = ''
    if (showAlert) {
      if (isDasAddress && !selectedDasAccount) {
        ;[level, alertMsg] = [AlertLevel.info, t('transfer.error.das')]
      } else {
        ;[level, alertMsg] = getAlertMsg(finalUsedAddress, finalUsedAddressType)
      }
    }

    return [valid, showAlert, level, alertMsg]
  }, [
    finalUsedAddressType,
    finalUsedAddress,
    getAlertMsg,
    isDasAddress,
    selectedDasAccount,
    t,
  ])

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
          setCkbAddress(addr)
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
                onFocus={handleTextareaFocus}
              />
              <div
                className={classnames('form-extra', {
                  das: isDasAddress,
                })}
              >
                <ScanSvg className="scan-btn" onClick={startScan} />
                <DasSelector
                  visible={isDasAddress}
                  url={ckbAddress}
                  onSelect={setSelectedDasAccount}
                  selectedAccount={selectedDasAccount}
                  dasPopoutVisibleTriggerRef={dasPopoutVisibleTrigger}
                />
              </div>
            </div>
            <div
              className={`alert ${alertLevel}`}
              style={{
                visibility: showAlert ? 'visible' : 'hidden',
              }}
            >
              {alertLevel === AlertLevel.info ? <InfoIcon /> : <ErrorSvg />}
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
        open={isDrawerOpen && !!nftDetail}
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
              <CardImage
                src={nftDetail.bg_image_url}
                width={100}
                height={100}
                tid={`${nftDetail.n_token_id}`}
                has3dIcon={nftDetail.renderer_type === NftType._3D}
              />
            </div>
            <div className="title">
              {`${t('transfer.transfer')}${colonWithSpace}${nftDetail.name}`}
            </div>
            <p className="address">
              {`${t('transfer.address')}${colonWithSpace}${finalUsedAddress}`}
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
    <Redirect to={RoutePath.NFTs} />
  )
}
