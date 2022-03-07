/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  lazy,
} from 'react'
import { Redirect, useHistory, useLocation, useParams } from 'react-router'
import {
  transferMnftWithRedirect,
  transferCotaNftWithRedirect,
} from '@nervina-labs/flashsigner'
import classnames from 'classnames'
import { Appbar } from '../../components/Appbar'
import { NFTDetail, NftType, Query } from '../../models'
import { RoutePath } from '../../routes'
import { ReactComponent as ScanSvg } from '../../assets/svg/scan.svg'
import { ReactComponent as CloseSvg } from '../../assets/svg/close.svg'
import TextareaAutosize from 'react-textarea-autosize'
import {
  verifyCkbAddress,
  verifyEthAddress,
  verifyDasAddress,
  generateUnipassSignTxUrl,
  buildFlashsignerOptions,
  isUnipassV2Address,
} from '../../utils'
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
import { useGetAndSetAuth } from '../../hooks/useProfile'
import { CardImage } from '../../components/Card/CardImage'
import {
  useAccount,
  useAccountStatus,
  useAPI,
  useProvider,
  useSignTransaction,
  WalletType,
} from '../../hooks/useAccount'
import { Button, Drawer } from '@mibao-ui/components'
import { ReactComponent as FullLogo } from '../../assets/svg/full-logo.svg'
import { useConfirmDialog } from '../../hooks/useConfirmDialog'
import { LoadableComponent } from '../../components/GlobalLoader'
import type Scaner from '../../components/QRcodeScaner'
import { Alert, AlertIcon, AlertDescription } from '@chakra-ui/react'

const QrcodeScaner = lazy(
  async () => await import('../../components/QRcodeScaner')
)

export enum FailedMessage {
  SignFail = 'sign-fail',
  TranferFail = 'tranfer-fail',
  NoCamera = 'no-camera',
  ContractAddress = 'contract-address',
  IOSWebkit = 'ios-webkit',
  Upgrade = 'upgrade',
  ContinuousTransfer = 'continuous-transfer',
}

export interface TransferState {
  nftDetail?: NFTDetail
  signature?: string
  prevState?: UnipassTransferNftState
  tx?: RPC.RawTransaction
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
  const isRedirectFromSigner =
    !!routerLocation.state?.signature || !!routerLocation.state?.tx
  const [isDrawerOpen, setIsDrawerOpen] = useState(
    isRedirectFromSigner ?? false
  )
  const [ckbAddress, setCkbAddress] = useState(prevState?.ckbAddress ?? '')
  const [isSendingNFT, setIsSendingNFT] = useState(false)
  const [isSendDialogSuccess, setIsSendDialogSuccess] = useState(false)
  const [isScaning, setIsScaning] = useState(false)
  // eslint-disable-next-line prettier/prettier
  const dasPopoutVisibleTrigger = useRef<(popoutVisible: boolean) => void>()
  const [
    selectedDasAccount,
    setSelectedDasAccount,
  ] = useState<AccountRecord | null>(null)
  const qrcodeScanerRef = useRef<Scaner>(null)
  const { t } = useTranslation('translations')

  const buildFailedMessage = useCallback(
    (msg?: FailedMessage) => {
      return msg
        ? t(`transfer.error.${msg}`)
        : t('transfer.error.transfer-fail')
    },
    [t]
  )

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

  const confirmDialog = useConfirmDialog()

  const stopTranfer = useCallback(
    (isSuccess: boolean, msg?: FailedMessage, code?: string): void => {
      setIsSendingNFT(false)
      setIsDrawerOpen(false)
      if (isSuccess) {
        setIsSendDialogSuccess(true)
        confirmDialog({
          type: 'success',
          title: t('transfer.submitted'),
          description: t('transfer.tips'),
          showCloseButton: false,
          onConfirm: () => {
            history.push(RoutePath.Transactions)
          },
        })
      } else {
        confirmDialog({
          type: 'warning',
          title: buildFailedMessage(msg),
          description:
            code && Number(code) !== 1095
              ? t('transfer.error-code', { code })
              : undefined,
        })
      }
    },
    [confirmDialog, buildFailedMessage, history, t]
  )

  const { id } = useParams<{ id: string }>()

  const getAuth = useGetAndSetAuth()
  const { data: remoteNftDetail, failureCount } = useQuery(
    [Query.NFTDetail, id, api, getAuth],
    async () => {
      const auth = await getAuth()
      const { data } = await api.getNFTDetail(id, auth)
      return data
    },
    { enabled: id != null && routerLocation.state?.nftDetail == null }
  )

  const nftDetail = useMemo(() => {
    return routerLocation.state?.nftDetail ?? remoteNftDetail
  }, [routerLocation.state, remoteNftDetail])

  const transferOnClick = useCallback(async () => {
    if (
      isUnipassV2Address(finalUsedAddress) &&
      nftDetail?.script_type === 'cota'
    ) {
      confirmDialog({
        type: 'warning',
        title: t('transfer.error.unipass-v2'),
        okText: t('auth.ok'),
      })
    } else {
      setIsDrawerOpen(true)
    }
  }, [confirmDialog, finalUsedAddress, t, nftDetail?.script_type])

  const sendNFT = useCallback(async () => {
    setIsSendingNFT(true)
    try {
      const isFinalUsedAddressTypeEth =
        finalUsedAddressType === AddressVerifiedType.eth
      const sentAddress = isFinalUsedAddressTypeEth
        ? new Address(finalUsedAddress, AddressType.eth).toCKBAddress()
        : finalUsedAddress
      if (walletType === WalletType.Flashsigner) {
        const { tx } = routerLocation.state ?? {}
        if (tx) {
          await api.transfer(id, tx, sentAddress).catch((err) => {
            stopTranfer(
              false,
              FailedMessage.TranferFail,
              err?.response?.data?.code
            )
            console.log(err)
            throw err
          })
          stopTranfer(true)
        } else {
          const url = `${location.origin}${RoutePath.Flashsigner}`
          if (nftDetail?.script_type === 'cota') {
            const options = buildFlashsignerOptions({
              tokenIndex: `${nftDetail?.n_token_id!}`,
              cotaId: nftDetail?.class_id!,
              fromAddress: address,
              toAddress: finalUsedAddress,
              extra: {
                uuid: id,
                ckbAddress: finalUsedAddress,
              },
            })
            transferCotaNftWithRedirect(url, options)
          } else {
            const options = buildFlashsignerOptions({
              classId: nftDetail?.class_id!,
              issuerId: `${nftDetail?.n_issuer_id!}`,
              tokenId: `${nftDetail?.n_token_id!}`,
              fromAddress: address,
              toAddress: finalUsedAddress,
              extra: {
                uuid: id,
                ckbAddress: finalUsedAddress,
              },
            })
            transferMnftWithRedirect(url, options)
          }
        }
        return
      }
      const { tx } = await api
        .getTransferNftTransaction(id, sentAddress, walletType)
        .catch((err) => {
          let msg: FailedMessage = FailedMessage.TranferFail
          if (err?.response?.data?.code === 1092) {
            msg = FailedMessage.Upgrade
          } else if (err?.response?.data?.code === 1095) {
            msg = FailedMessage.ContinuousTransfer
          }
          stopTranfer(false, msg, err?.response?.data?.code)
          throw new Error(err)
        })

      const signTx = await signTransaction(tx).catch((err) => {
        stopTranfer(false, FailedMessage.SignFail, err?.response?.data?.code)
        throw new Error(err)
      })

      if (walletType === WalletType.Unipass) {
        const { signature } = routerLocation.state ?? {}
        if (signature) {
          await api.transfer(id, tx, sentAddress, signature).catch((err) => {
            stopTranfer(
              false,
              FailedMessage.TranferFail,
              err?.response?.data?.code
            )
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
          stopTranfer(
            false,
            FailedMessage.TranferFail,
            err?.response?.data?.code
          )
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
    stopTranfer,
    address,
    nftDetail,
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
      confirmDialog({
        type: 'error',
        title: buildFailedMessage(
          IS_IPHONE ? FailedMessage.IOSWebkit : FailedMessage.NoCamera
        ),
      })
      return
    }
    if (hasPermission) {
      setIsScaning(true)
      qrcodeScanerRef.current?.startScan()
    } else {
      alert(t('transfer.error.camera-auth'))
    }
  }, [hasPermission, hasVideoDevice, t, buildFailedMessage, confirmDialog])

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

  const initSending = useRef(false)
  useEffect(() => {
    const { prevState, signature, tx } = routerLocation.state ?? {}
    if (
      prevState &&
      (signature || tx) &&
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
        addr.length !== 95 &&
        addr.length !== 97
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
      (valid &&
        finalUsedAddress.length !== 95 &&
        finalUsedAddress.length !== 97)
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

  if (isInvalid && !isSendDialogSuccess) {
    return <Redirect to={RoutePath.NotFound} />
  }

  return isLogined ? (
    <Container ref={containerRef}>
      <Appbar
        title={t('transfer.transfer')}
        right={<div />}
        ref={appRef}
        transparent
      />
      {isScaning ? (
        <LoadableComponent>
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
        </LoadableComponent>
      ) : null}
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
                maxRows={4}
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
            <div className="desc">
              {t('transfer.check')}
              {t('transfer.once-transfer')}
            </div>
            <Alert
              style={{ visibility: showAlert ? 'visible' : 'hidden' }}
              status={(alertLevel as any) || 'info'}
              variant="subtle"
              bg="white"
            >
              <AlertIcon boxSize="12px" />
              <AlertDescription
                fontSize="10px"
                lineHeight="normal"
                color={alertLevel === 'error' ? '#d03a3a' : '#2196f3'}
              >
                {alertMsg}
              </AlertDescription>
            </Alert>
            <div className="action">
              <Button
                isDisabled={!isAddressValid}
                w="118px"
                fontSize="14px"
                variant="solid"
                colorScheme={'primary'}
                borderRadius="20px"
                color="white"
                onClick={isAddressValid ? transferOnClick : undefined}
              >
                {t('nft.transfer')}
              </Button>
            </div>
          </Box>
        </div>
      </section>
      <footer className="footer">
        <FullLogo />
      </footer>
      <Drawer
        placement="bottom"
        isOpen={isDrawerOpen && !!nftDetail}
        onClose={() => setIsDrawerOpen(false)}
        contentProps={{
          width: drawerLeft === 0 ? '100%' : `${CONTAINER_MAX_WIDTH}px`,
          style: {
            left: drawerLeft,
          },
          overflow: 'hidden',
        }}
        rounded="lg"
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
                has3dIcon={nftDetail.renderer_type === NftType.ThreeD}
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
                variant="solid"
                colorScheme="primary"
                onClick={sendNFT}
                isLoading={isSendingNFT}
                size="sm"
              >
                {isSendingNFT ? t('transfer.signing') : t('transfer.confirm')}
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
