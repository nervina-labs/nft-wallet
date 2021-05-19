import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Redirect, useHistory, useLocation, useParams } from 'react-router'
import styled from 'styled-components'
import { Appbar } from '../../components/Appbar'
import { NFTDetail, Query } from '../../models'
import { RoutePath } from '../../routes'
import { ReactComponent as BackSvg } from '../../assets/svg/back.svg'
import { ReactComponent as ScanSvg } from '../../assets/svg/scan.svg'
import { ReactComponent as ErrorSvg } from '../../assets/svg/error.svg'
import { ReactComponent as SuccessSvg } from '../../assets/svg/success.svg'
import { ReactComponent as FailSvg } from '../../assets/svg/fail.svg'
import { ReactComponent as CloseSvg } from '../../assets/svg/close.svg'
import InfoIcon from '@material-ui/icons/Info'
import { Button } from '../../components/Button'
import { Drawer } from '@material-ui/core'
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
import { Limited } from '../../components/Limited'
import { Creator } from '../../components/Creator'
import { useQuery } from 'react-query'
import { MainContainer } from '../../styles'
import { CONTAINER_MAX_WIDTH, IS_MAINNET } from '../../constants'
import UnipassProvider from '../../pw/UnipassProvider'
import { Address, AddressType } from '@lay2/pw-core'
import { useTranslation } from 'react-i18next'

const Container = styled(MainContainer)`
  display: flex;
  flex-direction: column;
  .content {
    display: flex;
    flex-direction: column;
    margin: 0 36px;
    height: 100%;
    flex: 1;
    label {
      font-weight: 600;
      font-size: 14px;
      line-height: 16px;
      color: rgba(0, 0, 0, 0.6);
      margin-top: 120px;
      margin-bottom: 12px;
    }
    .alert {
      font-weight: 600;
      font-size: 12px;
      line-height: 17px;
      display: flex;
      align-items: center;
      margin-top: 10px;
      height: 34px;
      svg {
        width: 12px;
        height: 12px;
        margin-right: 4px;
      }
      &.error {
        color: #d03a3a;
      }
      &.info {
        color: #2196f3;
      }
    }
    .form {
      display: flex;
      justify-content: center;
      align-items: center;
      .input {
        background: transparent;
        width: 100%;
        border: none;
        overflow: auto;
        outline: none;
        border-radius: 0;
        -webkit-box-shadow: none;
        -moz-box-shadow: none;
        box-shadow: none;
        resize: none;
        border-bottom: 1px solid #000000;
      }
      svg {
        margin-left: 10px;
      }
    }
    .action {
      display: flex;
      justify-content: center;
      margin-top: 35px;
    }
    .desc {
      margin-top: auto;
      margin-bottom: 50px;
      font-weight: 600;
      font-size: 14px;
      line-height: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      color: rgba(0, 0, 0, 0.6);
      p {
        margin: 0;
      }
    }
  }
`

const DrawerContainer = styled.div`
  margin: 32px 36px;
  margin-bottom: 0;
  .header {
    display: flex;
    align-items: center;
    label {
      font-style: normal;
      font-weight: 600;
      font-size: 14px;
      line-height: 16px;
      color: rgba(0, 0, 0, 0.6);
      margin: 0;
      display: flex;
      align-items: center;
    }
    svg {
      margin-left: auto;
      cursor: pointer;
    }
  }
  .card {
    margin-top: 8px;
    margin-bottom: 32px;
    display: flex;
    height: 80px;
    .info {
      margin: 4px 0;
      flex: 1;
      margin-left: 12px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      font-weight: 600;
      font-size: 12px;
      line-height: 17px;
      overflow: hidden;
      .title {
        color: #000000;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
      .row {
        color: rgba(0, 0, 0, 0.6);
      }
    }
  }
  .address {
    margin-top: 12px;
    font-size: 14px;
    line-height: 16px;
    color: #000000;
    font-weight: 600;
    word-break: break-all;
  }
  .center {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 32px;
    margin-bottom: 40px;
    .loading {
      margin-left: 10px;
    }
  }
`

export enum FailedMessage {
  SignFail = 'sign-fail',
  TranferFail = 'tranfer-fail',
  NoCamera = 'no-camera',
  ContractAddress = 'contract-address',
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
      setFailedMessage(FailedMessage.NoCamera)
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
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        setHasVideoDevice(devices.some((d) => d.kind === 'videoinput'))
      })
      .catch(Boolean)
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

  useEffect(() => {}, [])

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
      <div className="content">
        <label>{t('transfer.address')}</label>
        <div className="form">
          <textarea
            className="input"
            placeholder={t('transfer.placeholder')}
            value={ckbAddress}
            onChange={textareaOnChange}
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
          <Button
            type="primary"
            onClick={transferOnClick}
            disbaled={!isAddressValid}
          >
            {t('transfer.transfer')}
          </Button>
        </div>
        <div className="desc">
          <p>{t('transfer.check')}</p>
          <p>{t('transfer.once-transfer')}</p>
        </div>
      </div>
      <ActionDialog
        icon={<SuccessSvg />}
        content={t('transfer.submitted')}
        detail={t('transfer.tips')}
        open={isSendDialogSuccess}
        onConfrim={() => {
          setIsSendDialogSuccess(false)
          history.push(RoutePath.Transactions)
        }}
      />
      <ActionDialog
        icon={<FailSvg />}
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
          },
        }}
        disableEnforceFocus
        disableEscapeKeyDown
      >
        {nftDetail !== undefined ? (
          <DrawerContainer>
            <div className="header">
              <label>{`${t('transfer.transfer')}${t('common.colon')}`}</label>
              {isSendingNFT ? null : <CloseSvg onClick={closeDrawer} />}
            </div>
            <div className="card">
              <LazyLoadImage
                src={nftDetail.bg_image_url}
                width={80}
                height={80}
              />
              <div className="info">
                <div className="title">{nftDetail.name}</div>
                <div className="row">
                  <Limited count={nftDetail.total} />
                </div>
                <div className="row">
                  <Creator
                    name={nftDetail.issuer_info.name}
                    url={nftDetail.issuer_info.avatar_url}
                  />
                </div>
              </div>
            </div>
            <label>{`${t('transfer.address')}${t('common.colon')}`}</label>
            <p className="address">{ckbAddress}</p>
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
    <Redirect to={RoutePath.Login} />
  )
}
