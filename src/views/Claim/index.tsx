import React, { useState, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { ActionDialog } from '../../components/ActionDialog'
import { ReactComponent as FailSvg } from '../../assets/svg/fail.svg'
import { ReactComponent as AddressesSvg } from '../../assets/svg/address.svg'
import AddrSuccess from '../../assets/img/claim.png'
import { ReactComponent as AddrDup } from '../../assets/svg/addr-dup.svg'
import { ReactComponent as ClaimSuccessSvg } from '../../assets/svg/claim-success.svg'
import detectEthereumProvider from '@metamask/detect-provider'
import { IS_IMTOKEN } from '../../constants'
import { Redirect, useHistory, useParams } from 'react-router-dom'
import { CircularProgress } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import { RoutePath } from '../../routes'
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
import { UnipassAction } from '../../models/unipass'
import { useGetAndSetAuth } from '../../hooks/useProfile'
import { Container } from './styled'

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

export const Claim: React.FC = () => {
  const [isUnipassLogining, setIsUnipassLoging] = useState(false)
  const [isMetamaskLoging, setIsMetamaskLoging] = useState(false)
  const [errorStatus, setErrorMsg] = useState(ErrorMsg.NotSupport)
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false)
  const { t, i18n } = useTranslation('translations')
  const errorMsg = useMemo(() => {
    return t(`addresses.errors.${errorStatus}`)
  }, [errorStatus, t])
  const { login } = useLogin()
  const api = useAPI()
  const { walletType, pubkey } = useAccount()
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
      default:
        setIsUnipassLoging(loading)
        break
    }
  }

  const loginBtnOnClick = useCallback(
    async (targetType = WalletType.Unipass) => {
      setLoading(true, targetType)
      if (WalletType.Unipass === targetType) {
        UnipassConfig.setRedirectUri(
          id ? `${RoutePath.Claim}/${id}` : RoutePath.Claim
        )
      }
      try {
        if (targetType === WalletType.Metamask) {
          const provider = await detectEthereumProvider()
          if (!provider) {
            setErrorMsg(ErrorMsg.NotSupport)
            setIsErrorDialogOpen(true)
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
          setErrorMsg(ErrorMsg.Imtoken)
          setIsErrorDialogOpen(true)
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

  const [isClaimError, setIsClaimError] = useState(false)
  const [isClaiming, setIsClaiming] = useState(false)
  const claim = useCallback(
    async (code: string) => {
      setIsClaiming(true)
      try {
        await api.claim(code)
        setSubmitStatus(SubmitStatus.Success)
      } catch (error: any) {
        const errorCode = error?.response?.data.code
        if (errorCode === 1022) {
          setSubmitStatus(SubmitStatus.Claimed)
        } else {
          setIsClaimError(true)
        }
      } finally {
        setIsClaiming(false)
      }
    },
    [api]
  )

  useQuery(
    [Query.Claim, claim, id, claimCodeError],
    async () => {
      await claim(id)
    },
    {
      enabled: id != null && claimCodeError === null && isLogined,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  )

  const imgs = {
    [SubmitStatus.Unlogin]: <AddressesSvg />,
    [SubmitStatus.Claiming]: <img src={AddrSuccess} />,
    [SubmitStatus.Claimed]: <AddrDup />,
    [SubmitStatus.Success]: <ClaimSuccessSvg />,
  }

  const [code, setCode] = useState(id ?? '')
  const getAuth = useGetAndSetAuth()
  const onSuccess = useCallback(async () => {
    if (submitStatus === SubmitStatus.Success) {
      const baseURL =
        'https://nft-wallet-git-lite-with-unipass-nervina.vercel.app/'
      const url = new URL(`${baseURL}/unipass`)
      url.searchParams.set('action', UnipassAction.Sign)
      const auth = await getAuth()
      url.searchParams.set(
        'unipass_ret',
        JSON.stringify({
          code: 200,
          data: {
            pubkey,
            sig: auth.signature.replace(/^0x01/i, '0x'),
          },
        })
      )

      console.log(url.href)
      location.href = url.href
    } else {
      setCode('')
      setSubmitStatus(SubmitStatus.Claiming)
    }
  }, [submitStatus, pubkey, getAuth])

  const actions = useMemo(() => {
    if (SubmitStatus.Unlogin === submitStatus) {
      return (
        <>
          <p className="desc">{t('claim.tips')}</p>
          <p>{t('claim.login')}</p>
          <Button
            className="connect recommend"
            disabled={isUnipassLogining || isMetamaskLoging}
            onClick={loginBtnOnClick.bind(null, WalletType.Unipass)}
          >
            {t('login.connect.unipass')}&nbsp;
            {isUnipassLogining ? (
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
          <Button
            className="connect recommend"
            onClick={async () => await claim(code)}
            disabled={isClaiming || isClaimError}
          >
            {t('claim.confirm')}&nbsp;
            {isClaiming ? (
              <CircularProgress className="loading" size="1em" />
            ) : null}
          </Button>
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
        <Button className="connect recommend" onClick={onSuccess}>
          {t(
            `claim.${
              submitStatus === SubmitStatus.Success ? 'go-home' : 'claim-other'
            }`
          )}
        </Button>
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
    onSuccess,
  ])

  if (claimCodeError) {
    return <Redirect to={RoutePath.NotFound} />
  }

  return (
    <Container>
      <ActionDialog
        icon={<FailSvg />}
        content={errorMsg}
        open={isErrorDialogOpen}
        onConfrim={() => setIsErrorDialogOpen(false)}
        onBackdropClick={() => setIsErrorDialogOpen(false)}
      />
      <div className="bg">{imgs[submitStatus]}</div>
      <div className="action">{actions}</div>
    </Container>
  )
}
