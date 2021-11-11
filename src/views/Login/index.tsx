import React, { useCallback, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { ReactComponent as ImtokenSvg } from '../../assets/svg/imtoken.svg'
import { RoutePath } from '../../routes'
import { MainContainer } from '../../styles'
import { CONTAINER_MAX_WIDTH, IS_IMTOKEN } from '../../constants'
import { ReactComponent as QuestionSvg } from '../../assets/svg/question.svg'
import detectEthereumProvider from '@metamask/detect-provider'
import { Redirect, useHistory, useLocation, Link } from 'react-router-dom'
import { useTranslation, Trans } from 'react-i18next'
import { useWidth } from '../../hooks/useWidth'
import { getHelpUnipassUrl } from '../../data/help'
import { getLicenseUrl } from '../../data/license'
import { UnipassConfig } from '../../utils'
import { useToast } from '../../hooks/useToast'
import { useAccountStatus, useLogin, WalletType } from '../../hooks/useAccount'
import { ReactComponent as FullLogo } from '../../assets/svg/full-logo.svg'
import { Appbar, AppbarButton } from '../../components/Appbar'
import { ReactComponent as BackSvg } from '../../assets/svg/back.svg'
import AccountBg from '../../assets/img/account-bg.png'
import {
  Drawer,
  useDisclosure,
  Center,
  Text,
  Stack,
  Flex,
  Heading,
} from '@mibao-ui/components'
import { Checkbox } from '@chakra-ui/react'
import { useConfirmDialog } from '../../hooks/useConfirmDialog'
import { LoginButton } from '../../components/LoginButton'
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react.js'
import { Autoplay } from 'swiper'
import Slide1 from '../../assets/img/login/slide-1.png'
import Slide2 from '../../assets/img/login/slide-2.png'
import Slide3 from '../../assets/img/login/slide-3.png'

const Container = styled(MainContainer)`
  display: flex;
  align-items: center;
  flex-direction: column;
  background: white;
  background: url(${AccountBg});
  background-size: cover;
  background-repeat: repeat-y;
  min-height: 100%;

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
    max-width: 100%;
    padding: 0 24px;
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
    font-size: 12px;
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

export const Login: React.FC = () => {
  const { login } = useLogin()
  const { isLogined } = useAccountStatus()
  const { t, i18n } = useTranslation('translations')
  const onConfirm = useConfirmDialog()
  const [isUnipassLogining, setIsUnipassLoging] = useState(false)
  const [isMetamaskLoging, setIsMetamaskLoging] = useState(false)
  const [isWalletConnectLoging, setIsWalletConnectLoging] = useState(false)
  const [isLicenseChecked, setIsLicenseChecked] = useState(false)
  const toast = useToast()
  const history = useHistory()
  const location = useLocation<{ redirect?: string }>()
  const redirectUrl = location?.state?.redirect
  const {
    isOpen: isDrawerOpen,
    onOpen: drawerOnOpen,
    onClose: drawerOnClose,
  } = useDisclosure()

  const containerRef = useRef(null)

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
            onConfirm({
              type: 'error',
              title: t(`login.errors.${ErrorMsg.NotSupport}`),
            })
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
          onConfirm({
            type: 'error',
            title: t(`login.errors.${ErrorMsg.Imtoken}`),
          })
          setLoading(false, walletType)
        }
      }
    },
    [login, redirectUrl, onConfirm, t, history]
  )

  const slides = [
    {
      src: Slide1,
      desc1: '',
      desc2: '',
    },
    {
      src: Slide2,
      desc1: '',
      desc2: '',
    },
    {
      src: Slide3,
      desc1: '',
      desc2: '',
    },
  ]

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
        <Swiper
          modules={[Autoplay]}
          navigation={false}
          className="swiper"
          pagination={{ clickable: true }}
          loop
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
        >
          {slides?.map((slide, i) => (
            <SwiperSlide key={i}>
              <Stack direction="column">
                <img src={slide.src} />
                <Flex flexDirection="column" fontSize="24px" px="30px">
                  <Heading textAlign="left" size="lg">
                    {t(`login.slides.${i + 1}.line-1`)}
                  </Heading>
                  <Heading textAlign="right" color="#5065e5" size="lg">
                    {t(`login.slides.${i + 1}.line-2`)}
                  </Heading>
                </Flex>
              </Stack>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <LoginButton
        mt="15%"
        onClick={() => {
          if (!isLicenseChecked) {
            toast(t('license.warn'), {
              textProps: {
                fontSize: '12px',
                px: '20px',
                py: '5px',
              },
            })
            return
          }
          drawerOnOpen()
        }}
      >
        {t('common.login')}
      </LoginButton>
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
            variant={IS_IMTOKEN ? 'outline' : 'solid'}
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
            variant={!IS_IMTOKEN ? 'outline' : 'solid'}
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
        <Checkbox
          isChecked={isLicenseChecked}
          size="sm"
          iconSize="12px"
          onChange={() => setIsLicenseChecked(!isLicenseChecked)}
        >
          <Trans
            ns="translations"
            i18nKey="license.agree"
            t={t}
            components={{
              a: (
                <span
                  style={{ color: '#5065E5' }}
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
        </Checkbox>
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
    </Container>
  )
}
