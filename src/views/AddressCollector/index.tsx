import React, { useState, useMemo, useCallback, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { ActionDialog } from '../../components/ActionDialog'
import { ReactComponent as FailSvg } from '../../assets/svg/fail.svg'
import { ReactComponent as AddressesSvg } from '../../assets/svg/address.svg'
import { ReactComponent as AddrSuccess } from '../../assets/svg/addr-success.svg'
import { ReactComponent as AddrDup } from '../../assets/svg/addr-dup.svg'
import { useWalletModel, WalletType } from '../../hooks/useWallet'
import detectEthereumProvider from '@metamask/detect-provider'
import { IS_IMTOKEN } from '../../constants'
import { useProfileModel } from '../../hooks/useProfile'
import { Redirect, useHistory, useParams } from 'react-router-dom'
import { CircularProgress } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import { ReactComponent as ImtokenSvg } from '../../assets/svg/imtoken.svg'
import { RoutePath } from '../../routes'
import { MainContainer } from '../../styles'
import { getHelpUnipassUrl } from '../../data/help'
import { ReactComponent as QuestionSvg } from '../../assets/svg/question.svg'
import { UnipassConfig } from '../../utils'

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
      margin: 0;
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
  const [errorStatus, setErrorMsg] = useState(ErrorMsg.NotSupport)
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false)
  const { t, i18n } = useTranslation('translations')
  const errorMsg = useMemo(() => {
    return t(`addresses.errors.${errorStatus}`)
  }, [errorStatus, t])
  const {
    login,
    api,
    walletType,
    isLogined,
    address,
    provider,
  } = useWalletModel()
  const { getAuth, isAuthenticated } = useProfileModel()
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
      default:
        setIsUnipassLoging(loading)
        break
    }
  }

  const [isNotFound, setIsNotFound] = useState(false)

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
          setErrorMsg(ErrorMsg.Imtoken)
          setIsErrorDialogOpen(true)
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
        await api.submitAddress(id, auth)
        setSubmitStatus(SubmitStatus.Success)
      } catch (error) {
        const data = error?.response?.data
        if (data?.status === 404) {
          setIsNotFound(true)
          return
        }
        if (data?.code === 1091) {
          setSubmitStatus(SubmitStatus.Duplicate)
        } else {
          setErrorMsg(ErrorMsg.SubmitFail)
          setIsErrorDialogOpen(true)
        }
      }
      setLoading(false, walletType)
    },
    [api, id, getAuth, isAuthenticated]
  )

  const loginBtnOnClick = useCallback(
    async (targetType = WalletType.Unipass) => {
      setLoading(true, targetType)
      if (walletType === targetType) {
        await submit(targetType)
        return
      }
      if (WalletType.Unipass === targetType) {
        UnipassConfig.setRedirectUri(`${RoutePath.AddressCollector}/${id}`)
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
    [login, walletType, id]
  )

  useLayoutEffect(() => {
    if (isLogined && walletType && address) {
      if (
        walletType === WalletType.Metamask &&
        provider?.address?.addressString
      ) {
        submit(walletType).catch(Boolean)
      }
      if (walletType === WalletType.Unipass) {
        submit(walletType).catch(Boolean)
      }
    }
  }, [walletType, isLogined, address, provider?.address?.addressString])

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
          <Button
            className={'metamask connect'}
            disabled={isUnipassLogining || isMetamaskLoging}
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
        </>
      )
    }
    return (
      <>
        <p className="desc">{desc[submitStatus]}</p>
        <p>{t('addresses.continue')}</p>
        <Button
          className="connect recommend"
          onClick={() => {
            history.push(RoutePath.Explore)
          }}
        >
          {t('addresses.explore')}
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
    desc,
  ])

  if (isNotFound) {
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
