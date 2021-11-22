import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useHistory, useLocation, useParams } from 'react-router'
import styled from 'styled-components'
import { Loading } from '../../components/Loading'
import { TransferState } from '../../hooks/useRedeem'
import { useRouteQuery } from '../../hooks/useRouteQuery'
import { Query } from '../../models'
import { MainContainer } from '../../styles'
import { ReactComponent as WarningSvg } from '../../assets/svg/warning-dialog.svg'
import { ReactComponent as FailSvg } from '../../assets/svg/fail.svg'
import { Button } from '../Redeem/Button'
import { RedeemResultResponse } from '../../models/redeem'
import { RoutePath } from '../../routes'
import { formatTime } from '../../utils'
import { useAPI } from '../../hooks/useAccount'

const Container = styled(MainContainer)`
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: white;

  .icon {
    text-align: center;
    margin: 32px 0;
    svg {
      width: 70px;
      height: 70px;
    }
  }
  .title {
    color: #23262f;
    font-size: 16px;
    color: #23262f;
    font-weight: bold;
    margin-bottom: 8px;
  }
  .time {
    color: #23262f;
    font-size: 16px;
  }
  button {
    margin-top: 32px;
  }
`

export enum ResultFlag {
  None = 'none',
  Success = 'success',
  Fail = 'fail',
}

interface ResultStateProps {
  state?: TransferState
  result: RedeemResultResponse
}

const Success: React.FC<ResultStateProps> = ({ state, result }) => {
  const { t, i18n } = useTranslation('translations')
  const history = useHistory()
  const hasCustomData = !!state?.customData
  return (
    <>
      <div className="icon">
        <WarningSvg />
      </div>
      <div className="title">
        {hasCustomData
          ? t('exchange.result.submited')
          : t('exchange.result.success')}
      </div>
      <div className="time">
        {t('exchange.result.time')}
        {formatTime(result?.redeemed_timestamp, i18n.language)}
      </div>
      <Button onClick={() => history.push(RoutePath.MyRedeem)}>
        {hasCustomData
          ? t('exchange.result.confirm')
          : t('exchange.result.check')}
      </Button>
    </>
  )
}

const Fail: React.FC = () => {
  const { t } = useTranslation('translations')
  const history = useHistory()
  return (
    <>
      <div className="icon">
        <FailSvg />
      </div>
      <div className="title">{t('exchange.result.fail')}</div>
      <div className="time">{t('exchange.result.error')}</div>
      <Button onClick={() => history.push(RoutePath.Redeem)}>
        {t('exchange.result.go-back')}
      </Button>
    </>
  )
}

export const RedeemResult: React.FC = () => {
  const api = useAPI()
  const resultFlag = useRouteQuery<ResultFlag>('result', ResultFlag.None)
  const { id } = useParams<{ id: string }>()
  const location = useLocation<TransferState>()
  const { t } = useTranslation('translations')
  const transfer = useCallback(async () => {
    const { signature = '', tx, customData } = location?.state
    if (tx) {
      const { data } = await api.redeem({
        uuid: id,
        customData,
        tx,
      })
      return data
    }
    const { tx: unsignTx } = await api.getRedeemTransaction(id, true)
    const { data } = await api.redeem({
      uuid: id,
      customData,
      tx: unsignTx,
      sig: signature,
    })
    return data
  }, [id, api, location?.state])

  const { data, isError, isLoading } = useQuery(
    [Query.SendRedeem, id, api, resultFlag],
    transfer,
    {
      enabled: id != null && resultFlag === ResultFlag.None,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      staleTime: Infinity,
    }
  )

  return (
    <Container>
      {!isLoading ? (
        <>
          {!isError && data ? (
            <Success state={location.state} result={data} />
          ) : (
            <Fail />
          )}
        </>
      ) : (
        <Loading desc={t('exchange.result.redeeming')} />
      )}
    </Container>
  )
}
