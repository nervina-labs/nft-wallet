import React, { useCallback, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import Logo from '../../assets/img/login.png'
import { ReactComponent as ImtokenSvg } from '../../assets/svg/imtoken.svg'
import { useWalletModel, WalletType } from '../../hooks/useWallet'
import { RoutePath } from '../../routes'
import { MainContainer } from '../../styles'
import { IS_IMTOKEN } from '../../constants'
import Button from '@material-ui/core/Button'
import { CircularProgress, FormControlLabel, Checkbox } from '@material-ui/core'
import { LazyLoadImage } from '../../components/Image'
import { ActionDialog } from '../../components/ActionDialog'
import { ReactComponent as FailSvg } from '../../assets/svg/fail.svg'
import { ReactComponent as CloseSvg } from '../../assets/svg/close.svg'
import { ReactComponent as QuestionSvg } from '../../assets/svg/question.svg'
import detectEthereumProvider from '@metamask/detect-provider'
import { Redirect, useHistory, useLocation } from 'react-router'
import { useTranslation, Trans } from 'react-i18next'
import { useWidth } from '../../hooks/useWidth'
import { getHelpUnipassUrl } from '../../data/help'
import { useProfileModel } from '../../hooks/useProfile'
import { getLicenseUrl } from '../../data/license'
import { UnipassConfig } from '../../utils'

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

    .imtoken {
      margin: 0 4px;
    }

    svg {
      g {
        fill: white;
      }
    }

    &:disabled {
      color: rgb(214, 214, 214) !important;
      background-color: white !important;

      svg {
        g {
          fill: rgb(214, 214, 214);
        }
      }
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

  .question {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #232222;
    font-size: 12px;
    margin-top: 30px;
    cursor: pointer;
    svg {
      margin-right: 4px;
    }
  }

  .license {
    .MuiFormControlLabel-label {
      font-size: 12px;
    }
    .MuiFormControlLabel-root {
      margin: 0;
    }
  }

  .beian {
    display: flex;
    align-items: center;
    margin-top: 12px;
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
  const { t, i18n } = useTranslation('translations')
  const [isUnipassLogining, setIsUnipassLoging] = useState(false)
  const [isMetamaskLoging, setIsMetamaskLoging] = useState(false)
  const [isWalletConnectLoging, setIsWalletConnectLoging] = useState(false)
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false)
  const [isLicenseChecked, setIsLicenseChecked] = useState(false)
  const [errorStatus, setErrorMsg] = useState(ErrorMsg.NotSupport)
  const { snackbar } = useProfileModel()
  const history = useHistory()
  const location = useLocation<{ redirect?: string }>()
  const redirectUrl = location?.state?.redirect
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
      if (!isLicenseChecked) {
        snackbar(t('license.warn'))
        return
      }
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
        if (redirectUrl) {
          history.replace(redirectUrl)
        }
      } catch (error) {
        setLoading(false, walletType)
        if (IS_IMTOKEN && walletType === WalletType.Metamask) {
          setErrorMsg(ErrorMsg.Imtoken)
          setIsErrorDialogOpen(true)
          setLoading(false, walletType)
        }
      }
    },
    [login, isLicenseChecked, snackbar, t, redirectUrl, history]
  )

  if (isLogined && redirectUrl == null) {
    return <Redirect to={RoutePath.NFTs} />
  }

  return (
    <Container ref={containerRef}>
      <div
        className="close"
        onClick={() => {
          UnipassConfig.clear()
          history.replace(RoutePath.Explore)
        }}
      >
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
        onClick={loginBtnOnClick.bind(null, WalletType.Unipass)}
      >
        {t('login.connect.unipass')}&nbsp;
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
        {IS_IMTOKEN ? (
          <>
            {t('login.connect.connect')}
            <ImtokenSvg className="imtoken" />
          </>
        ) : (
          t('login.connect.metamask')
        )}
        &nbsp;
        {isMetamaskLoging ? (
          <CircularProgress className="loading" size="1em" />
        ) : null}
      </Button>
      <div
        className="question"
        onClick={() => {
          history.push(
            `${RoutePath.Help}?url=${encodeURIComponent(
              getHelpUnipassUrl(i18n.language)
            )}`
          )
        }}
      >
        <QuestionSvg />
        <span>{t('help.question')}</span>
      </div>
      <div className="license">
        <FormControlLabel
          control={
            <Checkbox
              checked={isLicenseChecked}
              onChange={() => setIsLicenseChecked(!isLicenseChecked)}
              color="default"
              name="license"
              size="small"
            />
          }
          label={
            <Trans
              ns="translations"
              i18nKey="license.agree"
              t={t}
              components={{
                a: (
                  <span
                    style={{ color: '#D8B340' }}
                    onClick={() => {
                      history.push(
                        `${RoutePath.License}?url=${encodeURIComponent(
                          getLicenseUrl(i18n.language)
                        )}`
                      )
                    }}
                  />
                ),
              }}
            />
          }
        />
      </div>
      {i18n.language !== 'en' ? (
        <div className="beian">
          <a
            href="https://beian.miit.gov.cn/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('common.beian')}
          </a>
        </div>
      ) : null}
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
