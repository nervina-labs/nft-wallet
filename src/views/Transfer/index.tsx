import React, { useCallback, useRef, useState } from 'react'
import { Redirect, useHistory, useLocation } from 'react-router'
import styled from 'styled-components'
import { Appbar } from '../../components/Appbar'
import { NFTDetail } from '../../models'
import { RoutePath } from '../../routes'
import { ReactComponent as BackSvg } from '../../assets/svg/back.svg'
import { ReactComponent as ScanSvg } from '../../assets/svg/scan.svg'
import { ReactComponent as ErrorSvg } from '../../assets/svg/error.svg'
import { ReactComponent as SuccessSvg } from '../../assets/svg/success.svg'
import { ReactComponent as FailSvg } from '../../assets/svg/fail.svg'
import { Button } from '../../components/Button'
import { Drawer } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'
import { LazyLoadImage } from '../../components/Image'
import { isValidCkbLongAddress } from '../../utils'
import { ActionDialog } from '../../components/ActionDialog'
import { useWalletModel } from '../../hooks/useWallet'
import { nftTransaction } from '../../mock/transaction'
import { nftDetail as mockNftDetail } from '../../mock/nft'
import { rawTransactionToPWTransaction } from '../../pw/toPwTransaction'
import { QrcodeScaner } from '../../components/QRcodeScaner.tsx'

const Container = styled.main`
  display: flex;
  height: 100%;
  flex-direction: column;
  background: linear-gradient(187.7deg, #ffffff 4.33%, #f0f0f0 94.27%);
  .content {
    display: flex;
    flex-direction: column;
    margin: 0 36px;
    height: 100%;
    label {
      font-weight: 600;
      font-size: 14px;
      line-height: 16px;
      color: rgba(0, 0, 0, 0.6);
      margin-top: 120px;
      margin-bottom: 12px;
    }
    .error {
      font-weight: 600;
      font-size: 12px;
      line-height: 17px;
      color: #d03a3a;
      display: flex;
      align-items: center;
      margin-top: 10px;
      svg {
        margin-right: 4px;
      }
    }
    .form {
      display: flex;
      justify-content: center;
      align-items: center;
      .input {
        width: 100%;
        border: none;
        overflow: auto;
        outline: none;
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
  label {
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 16px;
    color: rgba(0, 0, 0, 0.6);
    margin: 0;
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
      .title {
        color: #000000;
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
  SignFail = '签名失败，请重新签名',
  TranferFail = '发送失败，请检查当前网络情况，重新发送',
}

export const Transfer: React.FC = () => {
  const location = useLocation<{ nftDetail?: NFTDetail }>()
  const history = useHistory()
  const { signTransaction } = useWalletModel()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [ckbAddress, setCkbAddress] = useState('')
  const [failedMessage, setFailedMessage] = useState(FailedMessage.TranferFail)
  const [isSendingNFT, setIsSendingNFT] = useState(false)
  const [isAddressValid, setIsAddressValid] = useState(false)
  const [isSendDialogSuccess, setIsSendDialogSuccess] = useState(false)
  const [isSendDialogFail, setIsSendDialogFail] = useState(false)
  const [isScaning, setIsScaning] = useState(false)
  const qrcodeScanerRef = useRef<QrcodeScaner>(null)
  const textareaOnChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const val = e.target.value
      setIsAddressValid(isValidCkbLongAddress(val))
      setCkbAddress(val)
    },
    []
  )
  const stopTranfer = (isSuccess: boolean): void => {
    setIsSendingNFT(false)
    setIsDrawerOpen(false)
    if (isSuccess) {
      setIsSendDialogSuccess(true)
    } else {
      setIsSendDialogFail(true)
    }
  }
  const transferOnClock = useCallback(() => {
    setIsDrawerOpen(true)
  }, [])
  const sendNFT = useCallback(async () => {
    setIsSendingNFT(true)
    try {
      const tx = await rawTransactionToPWTransaction(nftTransaction)
      const signedTx = await signTransaction(tx)
      console.log(signedTx)
    } catch (error) {
      setFailedMessage(FailedMessage.SignFail)
      stopTranfer(false)
      return
    }
    stopTranfer(true)
  }, [signTransaction])
  const closeDrawer = (): void => setIsDrawerOpen(false)
  const stopScan = (): void => {
    setIsScaning(false)
    qrcodeScanerRef.current?.stopScan()
  }
  const startScan = (): void => {
    setIsScaning(true)
    qrcodeScanerRef.current?.startScan()
  }
  const { nftDetail } = location.state ?? {
    nftDetail: mockNftDetail,
  }
  return nftDetail !== undefined ? (
    <Container>
      <Appbar
        title="转让"
        left={<BackSvg onClick={() => history.goBack()} />}
        right={<div />}
      />
      <QrcodeScaner
        ref={qrcodeScanerRef}
        isDrawerOpen={isScaning}
        onCancel={stopScan}
        onScanCkbAddress={(address) => {
          setCkbAddress(address)
          stopScan()
          setIsAddressValid(true)
        }}
      />
      <div className="content">
        <label>接收方地址</label>
        <div className="form">
          <textarea
            className="input"
            placeholder="请输入 CKB 长地址"
            value={ckbAddress}
            onChange={textareaOnChange}
          />
          <ScanSvg onClick={startScan} />
        </div>
        <div
          className="error"
          style={{
            visibility:
              !isAddressValid && ckbAddress !== '' ? 'visible' : 'hidden',
          }}
        >
          <ErrorSvg />
          请输入正确的 CKB 地址
        </div>
        <div className="action">
          <Button
            type="primary"
            onClick={transferOnClock}
            disbaled={!isAddressValid}
          >
            转让
          </Button>
        </div>
        <div className="desc">
          <p>请仔细检查输入的地址，</p>
          <p>一旦转让，将无法撤回</p>
        </div>
      </div>
      <ActionDialog
        icon={<SuccessSvg />}
        content="已提交转让交易"
        detail="提示: 链上确认可能需要半分钟时间"
        open={isSendDialogSuccess}
        onConfrim={() => {
          setIsSendDialogSuccess(false)
          history.push(RoutePath.Transactions)
        }}
      />
      <ActionDialog
        icon={<FailSvg />}
        content={failedMessage}
        open={isSendDialogFail}
        onConfrim={() => setIsSendDialogFail(false)}
        onBackdropClick={() => setIsSendDialogFail(false)}
      />
      <Drawer
        anchor="bottom"
        open={isDrawerOpen}
        onBackdropClick={isSendingNFT ? undefined : closeDrawer}
      >
        <DrawerContainer>
          <label>转让：</label>
          <div className="card">
            <LazyLoadImage src={nftDetail.renderer} width={80} height={80} />
            <div className="info">
              <div className="title">{nftDetail.name}</div>
              <div className="row">
                {nftDetail.total === 0 ? '不限量' : `限量：${nftDetail.total}`}
              </div>
              <div className="row">发行方：{nftDetail.issuer_info.name}</div>
            </div>
          </div>
          <label>接收方地址：</label>
          <p className="address">{ckbAddress}</p>
          <div className="center">
            <Button type="primary" onClick={sendNFT} disbaled={isSendingNFT}>
              确认
              {isSendingNFT ? (
                <CircularProgress size="1em" className="loading" />
              ) : null}
            </Button>
          </div>
        </DrawerContainer>
      </Drawer>
    </Container>
  ) : (
    <Redirect to={RoutePath.Login} />
  )
}
