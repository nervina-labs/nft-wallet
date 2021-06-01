import React, { useCallback, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import Logo from '../../assets/img/logo.png'
import { useWalletModel, WalletType } from '../../hooks/useWallet'
import { RoutePath } from '../../routes'
import { MainContainer } from '../../styles'
import { IS_IMTOKEN } from '../../constants'
import Button from '@material-ui/core/Button'
import { CircularProgress } from '@material-ui/core'
import { LazyLoadImage } from '../../components/Image'
import { ActionDialog } from '../../components/ActionDialog'
import { ReactComponent as FailSvg } from '../../assets/svg/fail.svg'
import { ReactComponent as CloseSvg } from '../../assets/svg/close.svg'
import detectEthereumProvider from '@metamask/detect-provider'
import { Redirect, useHistory } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useWidth } from '../../hooks/useWidth'
import { LocalCache } from '../../cache'

const Container = styled(MainContainer)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: white;
  padding: 20px 0;

  .close {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    left: 20px;
    top: 20px;
    cursor: pointer;
  }

  @media (min-width: 500px) {
    .close {
      left: calc(50% - 250px);
    }
  }

  .center {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 20px 0;
  }

  .header {
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
    margin-top: 15px;
    margin-bottom: 15px;
    margin-left: 50px;
    margin-right: 50px;
  }

  .desc {
    margin: 0;
    padding: 0;
    font-size: 20px;
    color: #191919;
    line-height: 26px;
  }

  .connect {
    border: 1px solid #d2d2d2;
    border-radius: 25px;
    width: calc(100% - 150px);
    margin-left: 50px;
    margin-right: 50px;
    margin-top: 12px;
    &:disabled {
      color: rgb(214, 214, 214) !important;
      background-color: white !important;
    }
    &.MuiButton-text {
      padding-top: 12px;
      padding-bottom: 12px;
      text-transform: none;
    }
    &.recommend {
      background: #2b454e;
      width: calc(100% - 100px);
      color: white;
      margin-top: 15px;
      font-size: 16px;
    }
  }

  .lang {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #232222;
    font-size: 12px;
    margin-top: 30px;
    .pointer {
      cursor: pointer;
    }
    .divider {
      margin: 0 15px;
    }
    .active {
      font-weight: bold;
      color: #2b454e;
    }
  }

  .beian {
    display: flex;
    align-items: center;
    margin-top: 30px;
    color: #000000;
    opacity: 0.4;
    a {
      text-decoration: none;
      font-size: 10px;
      color: #000000;
      &:visited {
        color: #000000;
      }
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
  NotSupport = 'not-support',
  Imtoken = 'refuse',
}

export const Login: React.FC = () => {
  const { login, isLogined } = useWalletModel()
  const [t, i18n] = useTranslation('translations')
  const [isUnipassLogining, setIsUnipassLoging] = useState(false)
  const [isMetamaskLoging, setIsMetamaskLoging] = useState(false)
  const [isWalletConnectLoging, setIsWalletConnectLoging] = useState(false)
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false)
  const [errorStatus, setErrorMsg] = useState(ErrorMsg.NotSupport)
  const history = useHistory()
  const errorMsg = useMemo(() => {
    return t(`login.errors.${errorStatus}`)
  }, [errorStatus, t])

  const containerRef = useRef(null)
  const containerWidth = useWidth(containerRef)
  const width = useMemo(() => {
    const w = containerWidth ?? 0
    if (w === 0) {
      return 0
    }
    // 100 = margin * 2
    return w - 100
  }, [containerWidth])

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
        if (IS_IMTOKEN && walletType === WalletType.Metamask) {
          setErrorMsg(ErrorMsg.Imtoken)
          setIsErrorDialogOpen(true)
          setLoading(false, walletType)
        }
      }
    },
    [login]
  )

  const setLanguage = (lang: 'zh' | 'en') => async () => {
    if (i18n.language === lang) return
    await i18n.changeLanguage(lang)
    LocalCache.setI18nLng(lang)
    document.title = t('common.title')
  }

  if (isLogined) {
    return <Redirect to={RoutePath.NFTs} />
  }

  return (
    <Container ref={containerRef}>
      <div className="close" onClick={() => history.goBack()}>
        <CloseSvg />
      </div>
      <div className="header">
        <Title style={{ marginRight: '8px' }}>{t('login.title')}</Title>
      </div>
      <div className="logo">
        <LazyLoadImage src={Logo} width={width} height={width * 1.091} />
      </div>
      <ActionDialog
        icon={<FailSvg />}
        content={errorMsg}
        open={isErrorDialogOpen}
        onConfrim={() => setIsErrorDialogOpen(false)}
        onBackdropClick={() => setIsErrorDialogOpen(false)}
      />
      <div className="center">
        <p className="desc">{t('login.desc-1')}</p>
        <p className="desc">{t('login.desc-2')}</p>
      </div>
      <Button
        className={`${IS_IMTOKEN ? '' : 'recommend'} connect`}
        disabled={
          isUnipassLogining || isMetamaskLoging || isWalletConnectLoging
        }
        onClick={loginBtnOnClick}
      >
        {t('login.connect.unipass')}
        {isUnipassLogining ? (
          <CircularProgress className="loading" size="1em" />
        ) : null}
      </Button>
      <Button
        className={`${IS_IMTOKEN ? 'recommend' : ''} connect`}
        disabled={
          isUnipassLogining || isMetamaskLoging || isWalletConnectLoging
        }
        onClick={loginBtnOnClick.bind(null, WalletType.Metamask)}
      >
        {t(`login.connect.${IS_IMTOKEN ? 'imtoken' : 'metamask'}`)}&nbsp;
        {isMetamaskLoging ? (
          <CircularProgress className="loading" size="1em" />
        ) : null}
      </Button>
      <div className="lang">
        <span
          className={`${i18n.language === 'zh' ? 'active' : 'pointer'}`}
          onClick={setLanguage('zh')}
        >
          中文
        </span>
        <span className="divider">|</span>
        <span
          onClick={setLanguage('en')}
          className={`${i18n.language === 'en' ? 'active' : 'pointer'}`}
        >
          English
        </span>
      </div>
      <div className="beian">
        <a
          href="https://beian.miit.gov.cn/"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('common.beian')}
        </a>
      </div>
      {/* <Button
          disabled={
            isUnipassLogining || isMetamaskLoging || isWalletConnectLoging
          }
          onClick={loginBtnOnClick.bind(null, WalletType.WalletConnect)}
        >
          {t('login.connect.wallet-connect')}&nbsp;
          {isWalletConnectLoging ? (
            <CircularProgress className="loading" size="1em" />
          ) : null}
        </Button> */}
    </Container>
  )
}
