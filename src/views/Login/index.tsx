import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import Logo from '../../assets/img/logo.png'
import { useWalletModel, WalletType } from '../../hooks/useWallet'
import { RoutePath } from '../../routes'
import { MainContainer } from '../../styles'
import { IS_IMTOKEN, MAIN_NET_URL, TEST_NET_URL } from '../../constants'
import { NetChange } from '../../components/NetChange'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import { CircularProgress } from '@material-ui/core'
import { LazyLoadImage } from '../../components/Image'
import { ActionDialog } from '../../components/ActionDialog'
import { ReactComponent as FailSvg } from '../../assets/svg/fail.svg'
import detectEthereumProvider from '@metamask/detect-provider'
import { Redirect } from 'react-router'

const Container = styled(MainContainer)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-position: bottom;
  background-repeat: no-repeat;
  background-size: cover;

  .header {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    .status {
      margin-right: 4px;
      font-weight: normal;
      font-size: 12px;
      line-height: 17px;
      color: #000000;
    }
  }
  .logo {
    margin-top: 20px;
    margin-bottom: 20px;
  }
`

const BtnGroup = styled(ButtonGroup)`
  width: calc(100% - 40px);
  margin-bottom: 20px;
  button {
    color: black;
    font-weight: 500;
    padding: 12px 6px 12px 16px;
    .MuiButton-label {
      justify-content: flex-start;
      text-transform: none;
      font-size: 14px;
      line-height: 22px;
    }
    &:disabled {
      font-weight: 300;
      color: rgba(0, 0, 0, 0.6);
    }
    &.MuiButton-outlinedPrimary {
      border: 1px solid rgba(0, 0, 0, 0.23);
      border-bottom: none;
      &:last-child {
        border: 1px solid rgba(0, 0, 0, 0.23);
      }
      /* border-bottom: none; */
    }
  }
`

const Title = styled.h2`
  font-weight: 600;
  font-size: 20px;
  line-height: 28px;
  color: #000000;
  margin: 0;
`

enum ErrorMsg {
  NotSupport = '当前环境 MetaMask 不可用',
  Imtoken = '用户拒绝授权，请重新打开页面重新授权',
}

export const Login: React.FC = () => {
  const { login, isLogined } = useWalletModel()
  const [isUnipassLogining, setIsUnipassLoging] = useState(false)
  const [isMetamaskLoging, setIsMetamaskLoging] = useState(false)
  const [isWalletConnectLoging, setIsWalletConnectLoging] = useState(false)
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState(ErrorMsg.NotSupport)
  const setLoading = (loading: boolean, walletType: WalletType): void => {
    switch (walletType) {
      case WalletType.Metamask:
        setIsMetamaskLoging(loading)
        break
      case WalletType.Unipass:
        setIsUnipassLoging(loading)
        break
      case WalletType.WalletConnect:
        setIsWalletConnectLoging(loading)
        break
      default:
        setIsUnipassLoging(loading)
        break
    }
  }
  const loginBtnOnClick = useCallback(
    async (walletType = WalletType.Unipass) => {
      setLoading(true, walletType)
      try {
        if (walletType === WalletType.Metamask) {
          const provider = await detectEthereumProvider()
          if (!provider) {
            setErrorMsg(ErrorMsg.NotSupport)
            setIsErrorDialogOpen(true)
            setLoading(false, walletType)
            return
          }
        }
        await login(walletType)
        setLoading(false, walletType)
      } catch (error) {
        setLoading(false, walletType)
        if (IS_IMTOKEN) {
          setErrorMsg(ErrorMsg.Imtoken)
          setIsErrorDialogOpen(true)
          setLoading(false, walletType)
        }
      }
    },
    [login]
  )

  if (isLogined) {
    return <Redirect to={RoutePath.NFTs} />
  }

  return (
    <Container>
      <div className="header">
        <Title style={{ marginRight: '8px' }}>秘宝账户</Title>
        <NetChange mainnetURL={MAIN_NET_URL} testnetURL={TEST_NET_URL} />
      </div>
      <div className="logo">
        <LazyLoadImage src={Logo as any} width={340} height={415} />
      </div>
      <ActionDialog
        icon={<FailSvg />}
        content={errorMsg}
        open={isErrorDialogOpen}
        onConfrim={() => setIsErrorDialogOpen(false)}
        onBackdropClick={() => setIsErrorDialogOpen(false)}
      />
      <BtnGroup
        orientation="vertical"
        color="primary"
        aria-label="vertical outlined primary button group"
      >
        <Button
          disabled={
            isUnipassLogining || isMetamaskLoging || isWalletConnectLoging
          }
          onClick={loginBtnOnClick}
        >
          连接 Unipass（推荐）
          {isUnipassLogining ? (
            <CircularProgress className="loading" size="1em" />
          ) : null}
        </Button>
        <Button
          disabled={
            isUnipassLogining || isMetamaskLoging || isWalletConnectLoging
          }
          onClick={loginBtnOnClick.bind(null, WalletType.Metamask)}
        >
          连接以太坊环境&nbsp;
          {isMetamaskLoging ? (
            <CircularProgress className="loading" size="1em" />
          ) : null}
        </Button>
        {/* <Button
          disabled={
            isUnipassLogining || isMetamaskLoging || isWalletConnectLoging
          }
          onClick={loginBtnOnClick.bind(null, WalletType.WalletConnect)}
        >
          连接 Wallet Connect&nbsp;
          {isWalletConnectLoging ? (
            <CircularProgress className="loading" size="1em" />
          ) : null}
        </Button> */}
      </BtnGroup>
    </Container>
  )
}
