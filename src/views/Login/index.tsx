import React, { useCallback, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import Logo from '../../assets/img/login.png'
import { ReactComponent as ImtokenSvg } from '../../assets/svg/imtoken.svg'
import { RoutePath } from '../../routes'
import { MainContainer } from '../../styles'
import { CONTAINER_MAX_WIDTH, IS_IMTOKEN } from '../../constants'
import { FormControlLabel, Checkbox } from '@material-ui/core'
import { LazyLoadImage } from '../../components/Image'
import { ActionDialog } from '../../components/ActionDialog'
import { ReactComponent as FailSvg } from '../../assets/svg/fail.svg'
import { ReactComponent as QuestionSvg } from '../../assets/svg/question.svg'
import detectEthereumProvider from '@metamask/detect-provider'
import { Redirect, useHistory, useLocation, Link } from 'react-router-dom'
import { useTranslation, Trans } from 'react-i18next'
import { useWidth } from '../../hooks/useWidth'
import { getHelpUnipassUrl } from '../../data/help'
import { getLicenseUrl } from '../../data/license'
import { UnipassConfig } from '../../utils'
import { useSnackbar } from '../../hooks/useSnackbar'
import { useAccountStatus, useLogin, WalletType } from '../../hooks/useAccount'
import { ReactComponent as FullLogo } from '../../assets/svg/full-logo.svg'
import { Appbar, AppbarButton } from '../../components/Appbar'
import { ReactComponent as BackSvg } from '../../assets/svg/back.svg'
import AccountBg from '../../assets/img/account-bg.png'
import {
  Button,
  ButtonProps,
  Drawer,
  useDisclosure,
  Center,
  Text,
} from '@mibao-ui/components'

const Container = styled(MainContainer)`
  display: flex;
  align-items: center;
  flex-direction: column;
  background: white;
  background: url(${AccountBg});
  background-size: cover;
  background-repeat: repeat-y;
  height: 100%;

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

  .license {
    .MuiFormControlLabel-label {
      font-size: 12px;
    }
    .MuiFormControlLabel-root {
      margin: 0;
    }
  }

  .beian {
    position: fixed;
    bottom: 20px;
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

enum ErrorMsg {
  NotSupport = 'not-support',
  Imtoken = 'refuse',
}

const LoginButton: React.FC<ButtonProps> = ({ children, ...rest }) => {
  return (
    <Button
      colorScheme="primary"
      fontWeight="normal"
      w="280px"
      variant="solid"
      fontSize="16px"
      mb="24px"
      {...rest}
    >
      {children}
    </Button>
  )
}

export const Login: React.FC = () => {
  const { login } = useLogin()
  const { isLogined } = useAccountStatus()
  const { t, i18n } = useTranslation('translations')
  const [isUnipassLogining, setIsUnipassLoging] = useState(false)
  const [isMetamaskLoging, setIsMetamaskLoging] = useState(false)
  const [isWalletConnectLoging, setIsWalletConnectLoging] = useState(false)
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false)
  const [isLicenseChecked, setIsLicenseChecked] = useState(false)
  const [errorStatus, setErrorMsg] = useState(ErrorMsg.NotSupport)
  const { snackbar } = useSnackbar()
  const history = useHistory()
  const location = useLocation<{ redirect?: string }>()
  const redirectUrl = location?.state?.redirect
  const errorMsg = useMemo(() => {
    return t(`login.errors.${errorStatus}`)
  }, [errorStatus, t])
  const {
    isOpen: isDrawerOpen,
    onOpen: drawerOnOpen,
    onClose: drawerOnClose,
  } = useDisclosure()

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
    [login, redirectUrl, history]
  )

  if (isLogined && redirectUrl == null) {
    return <Redirect to={RoutePath.NFTs} />
  }

  return (
    <Container ref={containerRef}>
      <Appbar
        transparent
        left={
          <AppbarButton
            onClick={() => {
              UnipassConfig.clear()
              history.replace(RoutePath.Explore)
            }}
          >
            <BackSvg />
          </AppbarButton>
        }
        title={<FullLogo />}
      />
      <div className="logo">
        <LazyLoadImage src={Logo} width={width} height={width * 1.091} />
      </div>
      <LoginButton
        onClick={() => {
          if (!isLicenseChecked) {
            snackbar(t('license.warn'))
            return
          }
          drawerOnOpen()
        }}
      >
        {t('common.login')}
      </LoginButton>
      <ActionDialog
        icon={<FailSvg />}
        content={errorMsg}
        open={isErrorDialogOpen}
        onConfrim={() => setIsErrorDialogOpen(false)}
        onBackdropClick={() => setIsErrorDialogOpen(false)}
      />
      <Drawer
        placement="bottom"
        isOpen={isDrawerOpen}
        onClose={drawerOnClose}
        hasOverlay
        rounded="lg"
        contentProps={{
          width: drawerLeft === 0 ? '100%' : `${CONTAINER_MAX_WIDTH}px`,
          style: {
            left: drawerLeft,
          },
          overflow: 'hidden',
        }}
      >
        <Center flexDirection="column" my="24px">
          <Text fontSize="16px" mb="32px">
            {t('login.select')}
          </Text>
          <LoginButton
            className={`${IS_IMTOKEN ? '' : 'recommend'} connect`}
            isLoading={isUnipassLogining}
            disabled={
              isUnipassLogining || isMetamaskLoging || isWalletConnectLoging
            }
            onClick={loginBtnOnClick.bind(null, WalletType.Unipass)}
          >
            {t('login.connect.unipass')}
          </LoginButton>
          <LoginButton
            className={`${IS_IMTOKEN ? 'recommend' : ''} connect`}
            disabled={
              isUnipassLogining || isMetamaskLoging || isWalletConnectLoging
            }
            isLoading={isMetamaskLoging}
            onClick={loginBtnOnClick.bind(null, WalletType.Metamask)}
            variant="outline"
          >
            {IS_IMTOKEN ? (
              <>
                {t('login.connect.connect')}
                <ImtokenSvg className="imtoken" />
              </>
            ) : (
              t('login.connect.metamask')
            )}
          </LoginButton>
          <Link
            to={`${RoutePath.Help}?url=${encodeURIComponent(
              getHelpUnipassUrl(i18n.language)
            )}`}
          >
            <Center>
              <QuestionSvg />
              <Text fontSize="12px" ml="4px">
                {t('help.question')}
              </Text>
            </Center>
          </Link>
        </Center>
      </Drawer>

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
        <footer className="beian">
          <a
            href="https://beian.miit.gov.cn/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('common.beian')}
          </a>
        </footer>
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
