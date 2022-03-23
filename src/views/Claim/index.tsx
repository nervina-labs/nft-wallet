import React, { useState, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { ReactComponent as AddressesSvg } from '../../assets/svg/address.svg'
import { ReactComponent as AddrSuccess } from '../../assets/svg/addr-success.svg'
import { ReactComponent as AddrDup } from '../../assets/svg/addr-dup.svg'
import { ReactComponent as ClaimSuccessSvg } from '../../assets/svg/claim-success.svg'
import detectEthereumProvider from '@metamask/detect-provider'
import { IS_IMTOKEN, IS_MOBILE_ETH_WALLET } from '../../constants'
import { Link, Redirect, useHistory, useParams } from 'react-router-dom'
import { ReactComponent as ImtokenSvg } from '../../assets/svg/imtoken.svg'
import { RoutePath } from '../../routes'
import { MainContainer } from '../../styles'
import { getHelpUnipassUrl } from '../../data/help'
import { ReactComponent as QuestionSvg } from '../../assets/svg/question.svg'
import { UnipassConfig } from '../../utils'
import { Query } from '../../models'
import { useQuery } from 'react-query'
import classNames from 'classnames'
import {
  useAccount,
  useAccountStatus,
  useAPI,
  useLogin,
  WalletType,
} from '../../hooks/useAccount'
import { useConfirmDialog } from '../../hooks/useConfirmDialog'
import { LoginButton } from '../../components/LoginButton'
import { Box } from '@chakra-ui/layout'
import { useUnipassV2Dialog } from '../../hooks/useUnipassV2Dialog'
import { useGeeTest } from '../../hooks/useGeetst'
import { Skeleton } from '@chakra-ui/skeleton'

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
    .input {
      background: #f6f6f6;
      border: 1px solid #d1d1d1;
      box-sizing: border-box;
      border-radius: 20px;
      margin: 12px 0;
      height: 46px;
      text-align: center;
      min-width: 280px;
      .error {
        border: 1px solid #ff0000;
      }
      &:focus {
        outline: none;
      }
    }
    .desc {
      font-size: 18px;
      line-height: 25px;
      color: #fe7a0c;
      &.error {
        color: #ff0000;
      }
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
      width: 295px;
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
  Unlogin = 'Unlogin',
  Success = 'Success',
  Claiming = 'Claiming',
  Claimed = 'Claimed',
}

enum ErrorMsg {
  NotSupport = 'not-support',
  Imtoken = 'refuse',
  SubmitFail = 'submit-fail',
}

const captchId = 'gt-container'

export const Claim: React.FC = () => {
  const [isUnipassLogining, setIsUnipassLoging] = useState(false)
  const [isMetamaskLoging, setIsMetamaskLoging] = useState(false)
  const [isFlashsignerLogin, setIsFlashsignerLogin] = useState(false)
  const onConfirm = useConfirmDialog()
  const { t, i18n } = useTranslation('translations')
  const { login } = useLogin()
  const api = useAPI()
  const { walletType } = useAccount()
  const { isLogined } = useAccountStatus()
  const { id } = useParams<{ id: string }>()
  const history = useHistory()
  const [submitStatus, setSubmitStatus] = useState(
    !isLogined ? SubmitStatus.Unlogin : SubmitStatus.Claiming
  )

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

  const loginBtnOnClick = useCallback(
    async (targetType = WalletType.Unipass) => {
      setLoading(true, targetType)
      if (WalletType.Metamask !== targetType) {
        UnipassConfig.setRedirectUri(
          id ? `${RoutePath.Claim}/${id}` : RoutePath.Claim
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
        if (targetType === WalletType.Metamask) {
          setSubmitStatus(SubmitStatus.Claiming)
        }
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
    [login, walletType, id, isLogined]
  )

  const { error: claimCodeError } = useQuery(
    [Query.DetectClaim, id, api],
    async () => {
      const { data } = await api.getClaimStatus(id)
      return data
    },
    {
      enabled: id != null,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: false,
    }
  )

  const { isReady, isSuccess, captcha, setIsSuccess } = useGeeTest(
    `#${captchId}`,
    submitStatus === SubmitStatus.Claiming &&
      claimCodeError == null &&
      isLogined
  )

  const [isClaimError, setIsClaimError] = useState(false)
  const [isClaiming, setIsClaiming] = useState(false)
  const unipassDialog = useUnipassV2Dialog()
  const claim = useCallback(
    async (code: string) => {
      setIsClaiming(true)
      const geetest = captcha as any
      try {
        const result = geetest.getValidate()
        await api.claim(code, {
          challenge: result.geetest_challenge,
          validate: result.geetest_validate,
          seccode: result.geetest_seccode,
        })
        setSubmitStatus(SubmitStatus.Success)
      } catch (error: any) {
        const errorCode = error?.response?.data.code
        geetest.reset()
        setIsSuccess(false)
        if (errorCode === 1022) {
          setSubmitStatus(SubmitStatus.Claimed)
        } else if (errorCode === 2022) {
          unipassDialog()
        } else {
          setIsClaimError(true)
        }
      } finally {
        setIsClaiming(false)
      }
    },
    [api, unipassDialog, captcha, setIsSuccess]
  )

  const imgs = {
    [SubmitStatus.Unlogin]: <AddressesSvg />,
    [SubmitStatus.Claiming]: <AddrSuccess />,
    [SubmitStatus.Claimed]: <AddrDup />,
    [SubmitStatus.Success]: <ClaimSuccessSvg />,
  }

  const [code, setCode] = useState(id ?? '')

  const actions = useMemo(() => {
    if (SubmitStatus.Unlogin === submitStatus || !isLogined) {
      return (
        <>
          <p className="desc">{t('claim.tips')}</p>
          <p>{t('claim.login')}</p>
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
    if (submitStatus === SubmitStatus.Claiming) {
      return (
        <>
          <p className={classNames('desc', { error: isClaimError })}>
            {isClaimError ? t('claim.error') : t('claim.last-step')}
          </p>
          <input
            className={classNames('input', { error: isClaimError })}
            placeholder={t('claim.placeholder')}
            onChange={(e) => {
              setCode(e.target.value)
              setIsClaimError(false)
            }}
            value={code}
          />
          <Skeleton isLoaded={isReady}>
            <Box id={captchId} height="50px" w="280px" />
          </Skeleton>
          <LoginButton
            mt="12px"
            onClick={async () => await claim(code)}
            disabled={isClaiming || isClaimError || !isSuccess || !isReady}
            isLoading={isClaiming}
          >
            {t('claim.confirm')}
          </LoginButton>
          <Box textDecoration="underline" color="blue">
            <Link to={RoutePath.NFTs}>{t('exchange.home')}</Link>
          </Box>
        </>
      )
    }
    return (
      <>
        <p className="desc">
          {submitStatus === SubmitStatus.Success
            ? t('claim.success')
            : t('claim.claimed')}
        </p>
        {submitStatus === SubmitStatus.Success ? (
          <p>{t('claim.continue')}</p>
        ) : null}
        <LoginButton
          onClick={() => {
            history.push(RoutePath.NFTs)
          }}
        >
          {t(
            `claim.${
              submitStatus === SubmitStatus.Success ? 'go-home' : 'go-explore'
            }`
          )}
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
    claim,
    code,
    isClaiming,
    isClaimError,
    isFlashsignerLogin,
    isLogined,
    isReady,
    isSuccess,
  ])

  if (claimCodeError) {
    return <Redirect to={RoutePath.NotFound} />
  }

  return (
    <Container>
      <div className="bg">{imgs[submitStatus]}</div>
      <div className="action">{actions}</div>
    </Container>
  )
}
