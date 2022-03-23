import React, { useState, useMemo, useCallback, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { ReactComponent as AddressesSvg } from '../../assets/svg/address.svg'
import { ReactComponent as AddrSuccess } from '../../assets/svg/addr-success.svg'
import { ReactComponent as AddrDup } from '../../assets/svg/addr-dup.svg'
import detectEthereumProvider from '@metamask/detect-provider'
import { IS_IMTOKEN, IS_MOBILE_ETH_WALLET } from '../../constants'
import { useGetAndSetAuth, useProfile } from '../../hooks/useProfile'
import { Redirect, useHistory, useParams } from 'react-router-dom'
import { ReactComponent as ImtokenSvg } from '../../assets/svg/imtoken.svg'
import { RoutePath } from '../../routes'
import { MainContainer } from '../../styles'
import { getHelpUnipassUrl } from '../../data/help'
import { ReactComponent as QuestionSvg } from '../../assets/svg/question.svg'
import { UnipassConfig } from '../../utils'
import { Query } from '../../models'
import { useQuery } from 'react-query'
import {
  useAccount,
  useAccountStatus,
  useAPI,
  useLogin,
  useProvider,
  WalletType,
} from '../../hooks/useAccount'
import { useConfirmDialog } from '../../hooks/useConfirmDialog'
import { LoginButton } from '../../components/LoginButton'
import { Box } from '@chakra-ui/layout'
import { useUnipassV2Dialog } from '../../hooks/useUnipassV2Dialog'

const Container = styled(MainContainer)`
  padding-top: 10px;
  min-height: calc(100% - 10px);
  max-width: 500px;
  flex-direction: column;
  display: flex;
  .bg {
    svg {
      width: 100%;
      max-width: 100%;
    }
    position: relative;
    display: flex;
    justify-content: center;
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

  .action {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    background: white;
    flex-direction: column;
    border-top-left-radius: 35px;
    border-top-right-radius: 35px;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1);
    min-height: 300px;
    .desc {
      font-size: 18px;
      line-height: 25px;
      color: #fe7a0c;
    }
    p {
      font-size: 14px;
      color: #000000;
      margin: 0 20px;
      margin-bottom: 14px;
    }

    .connect {
      &.metamask {
        background-color: #d7e4e3;
      }
      border: 1px solid #d2d2d2;
      border-radius: 25px;
      width: 280px;
      margin-left: 50px;
      margin-right: 50px;
      margin-top: 12px;
      font-size: 16px;

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
        padding-top: 8px;
        padding-bottom: 8px;
        text-transform: none;
      }
      &.recommend {
        background: #2b454e;
        color: white;
      }
    }
  }
`

enum SubmitStatus {
  None = 'None',
  Success = 'Success',
  Duplicate = 'Duplicate',
}

enum ErrorMsg {
  NotSupport = 'not-support',
  Imtoken = 'refuse',
  SubmitFail = 'submit-fail',
}

export const AddressCollector: React.FC = () => {
  const [isUnipassLogining, setIsUnipassLoging] = useState(false)
  const [isMetamaskLoging, setIsMetamaskLoging] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(SubmitStatus.None)
  const [isFlashsignerLogin, setIsFlashsignerLogin] = useState(false)
  const onConfirm = useConfirmDialog()
  const { t, i18n } = useTranslation('translations')

  const { login } = useLogin()
  const api = useAPI()
  const { walletType, address } = useAccount()
  const { isLogined } = useAccountStatus()
  const provider = useProvider()
  const { isAuthenticated } = useProfile()
  const getAuth = useGetAndSetAuth()
  const { id } = useParams<{ id: string }>()
  const history = useHistory()

  const setLoading = (loading: boolean, walletType: WalletType): void => {
    switch (walletType) {
      case WalletType.Metamask:
        setIsMetamaskLoging(loading)
        break
      case WalletType.Unipass:
        setIsUnipassLoging(loading)
        break
      case WalletType.Flashsigner:
        setIsFlashsignerLogin(loading)
        break
      default:
        setIsUnipassLoging(loading)
        break
    }
  }

  const [isNotFound, setIsNotFound] = useState(false)
  const unipassDialog = useUnipassV2Dialog()
  const submit = useCallback(
    async (walletType: WalletType): Promise<void> => {
      setLoading(true, walletType)
      let auth
      try {
        if (WalletType.Unipass === walletType && !isAuthenticated) {
          UnipassConfig.setRedirectUri(`${RoutePath.AddressCollector}/${id}`)
        }
        auth = await getAuth()
        if (!auth.address) {
          setLoading(false, walletType)
          return
        }
      } catch (error) {
        if (walletType === WalletType.Metamask) {
          onConfirm({
            type: 'error',
            title: t(`addresses.errors.${ErrorMsg.Imtoken}`),
          })
        }
      }
      if (WalletType.Unipass === walletType && !isAuthenticated) {
        setLoading(false, walletType)
        return
      }
      if (auth == null) {
        return
      }
      try {
        await api.submitAddress(id, walletType, auth)
        setSubmitStatus(SubmitStatus.Success)
      } catch (error: any) {
        const data = error?.response?.data
        if (data?.status === 404) {
          setIsNotFound(true)
          return
        }
        if (data?.code === 1091) {
          setSubmitStatus(SubmitStatus.Duplicate)
        } else if (data?.code === 2022) {
          unipassDialog()
        } else {
          onConfirm({
            type: 'error',
            title: t(`addresses.errors.${ErrorMsg.SubmitFail}`),
          })
        }
      }
      setLoading(false, walletType)
    },
    [isAuthenticated, getAuth, id, onConfirm, t, api, unipassDialog]
  )

  const loginBtnOnClick = useCallback(
    async (targetType = WalletType.Unipass) => {
      setLoading(true, targetType)
      if (walletType === targetType && isLogined) {
        await submit(targetType)
        return
      }
      if (WalletType.Metamask !== targetType) {
        UnipassConfig.setRedirectUri(
          id
            ? `${RoutePath.AddressCollector}/${id}`
            : RoutePath.AddressCollector
        )
      }
      try {
        if (targetType === WalletType.Metamask) {
          const provider = await detectEthereumProvider()
          if (!provider) {
            onConfirm({
              type: 'error',
              title: t(`addresses.errors.${ErrorMsg.NotSupport}`),
            })
            setLoading(false, targetType)
            return
          }
        }
        await login(targetType)
        setLoading(false, targetType)
      } catch (error) {
        console.log(error)
        setLoading(false, targetType)
        if (IS_IMTOKEN && targetType === WalletType.Metamask) {
          onConfirm({
            type: 'error',
            title: t(`addresses.errors.${ErrorMsg.Imtoken}`),
          })
          setLoading(false, targetType)
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [login, walletType, id, isLogined, t]
  )

  const { data: isAddressPackageExist, isError } = useQuery(
    [Query.DetectAddress, id, api],
    async () => {
      const { data } = await api.detectAddress(id)
      return data
    },
    {
      enabled: id != null,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  )

  useLayoutEffect(() => {
    if (isLogined && walletType && address && isAddressPackageExist) {
      if (
        walletType === WalletType.Metamask &&
        provider?.address?.addressString
      ) {
        submit(walletType).catch(Boolean)
      }
      if (
        walletType === WalletType.Unipass ||
        walletType === WalletType.Flashsigner
      ) {
        submit(walletType).catch(Boolean)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    walletType,
    isLogined,
    address,
    provider?.address?.addressString,
    isAddressPackageExist,
  ])

  const imgs = {
    [SubmitStatus.None]: <AddressesSvg />,
    [SubmitStatus.Success]: <AddrSuccess />,
    [SubmitStatus.Duplicate]: <AddrDup />,
  }

  const desc = useMemo(() => {
    return {
      [SubmitStatus.None]: t('addresses.submit'),
      [SubmitStatus.Success]: t('addresses.submited'),
      [SubmitStatus.Duplicate]: t('addresses.duplicate'),
    }
  }, [t])

  const actions = useMemo(() => {
    if (SubmitStatus.None === submitStatus) {
      return (
        <>
          <p className="desc">{desc[submitStatus]}</p>
          <p>{t('addresses.select')}</p>
          {IS_MOBILE_ETH_WALLET ? null : (
            <LoginButton
              className={`${IS_IMTOKEN ? '' : 'recommend'} connect`}
              isLoading={isUnipassLogining}
              disabled={
                isUnipassLogining || isMetamaskLoging || isFlashsignerLogin
              }
              onClick={async () =>
                await loginBtnOnClick(WalletType.Flashsigner)
              }
              variant={IS_IMTOKEN ? 'outline' : 'solid'}
              size="lg"
            >
              <Box py="8px">
                <Box fontSize="16px">{t('login.connect.flashsigner')}</Box>
                <Box fontSize="12px">{t('login.connect.or-use-phone')}</Box>
              </Box>
            </LoginButton>
          )}
          <LoginButton
            isLoading={isUnipassLogining}
            disabled={isUnipassLogining || isMetamaskLoging}
            onClick={loginBtnOnClick.bind(null, WalletType.Unipass)}
            variant={IS_IMTOKEN ? 'outline' : 'solid'}
          >
            {t('login.connect.unipass')}
          </LoginButton>
          <LoginButton
            disabled={isUnipassLogining || isMetamaskLoging}
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
        </>
      )
    }
    return (
      <>
        <p className="desc">{desc[submitStatus]}</p>
        <p>{t('addresses.continue')}</p>
        <LoginButton
          onClick={() => {
            history.push(RoutePath.Explore)
          }}
        >
          {t('addresses.explore')}
        </LoginButton>
      </>
    )
  }, [
    submitStatus,
    t,
    history,
    isUnipassLogining,
    isMetamaskLoging,
    loginBtnOnClick,
    i18n,
    desc,
    isFlashsignerLogin,
  ])

  if (isNotFound || isAddressPackageExist === false || isError) {
    return <Redirect to={RoutePath.NotFound} />
  }

  return (
    <Container>
      <div className="bg">{imgs[submitStatus]}</div>
      <div className="action">{actions}</div>
    </Container>
  )
}
