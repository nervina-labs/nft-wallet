import React, { useMemo } from 'react'
import { Appbar } from '../../components/Appbar'
import { ReactComponent as BackSvg } from '../../assets/svg/back.svg'
import styled from 'styled-components'
import { MainContainer } from '../../styles'
import { useTranslation } from 'react-i18next'
import { Redirect, useHistory, useParams } from 'react-router'
import { RoutePath } from '../../routes'
import { useQuery } from 'react-query'
import { Query } from '../../models'
import { useWalletModel } from '../../hooks/useWallet'
import { Loading } from '../../components/Loading'
import { RedeeemLabel } from '../Reedem/Label'
import { Divider } from '@material-ui/core'
import { Prize } from '../Reedem/Prize'
import { formatTime } from '../../utils'
import { isCustomReward } from '../../models/redeem'

const BoxContainer = styled.div`
  padding: 16px;
  margin: 20px;
  border-radius: 20px;
  background: #fff;
  .comment {
    font-size: 12px;
    margin-top: 8px;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    .title {
      font-size: 16px;
      font-weight: bold;
      color: #000;
    }
  }

  .prize {
    margin: 10px 0;
    padding: 0;
  }

  .time {
    font-size: 12px;
    margin-top: 8px;
  }
`

const RowContainer = styled.div`
  margin-top: 8px;
  .row {
    display: flex;
    .value,
    .label {
      font-size: 12px;
    }
    .label {
      word-break: keep-all;
    }
    .value {
      margin-left: 4px;
      flex: 1;
      word-break: break-all;
    }
  }
`

interface RowProps {
  label: React.ReactNode
}

const Row: React.FC<RowProps> = ({ label, children }) => {
  return (
    <div className="row">
      <div className="label">{label}</div>
      <div className="value">{children}</div>
    </div>
  )
}

const Container = styled(MainContainer)`
  display: flex;
  flex-direction: column;

  background: #f6f6f6;
  h4 {
    text-align: center;
    color: rgba(0, 0, 0, 0.6);
  }
  main {
    background: #f6f6f6;
    flex: 1;
  }
`

export const RedeemPrize: React.FC = () => {
  const { t, i18n } = useTranslation('translations')
  const history = useHistory()
  const { id } = useParams<{ id: string }>()
  const { api } = useWalletModel()
  const { isError, data } = useQuery(
    [Query.RedeemPrize, id, api],
    async () => {
      const { data } = await api.getRedeemPrize(id)
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

  const { address } = useWalletModel()

  const comment = useMemo(() => {
    if (isCustomReward(data?.record_info)) {
      return data?.record_info.comment
    }
  }, [data])

  const addressInfo = useMemo(() => {
    if (isCustomReward(data?.record_info)) {
      return data?.record_info.delivery_info
    }
  }, [data])

  if (isError) {
    return <Redirect to={RoutePath.NotFound} />
  }
  return (
    <Container>
      <Appbar
        title={t('exchange.prize.title')}
        left={<BackSvg onClick={() => history.goBack()} />}
        right={<div />}
      />
      <main>
        {data == null ? (
          <Loading />
        ) : (
          <>
            <BoxContainer>
              <div className="header">
                <span title="title">{t('exchange.prize.get')}</span>
                <RedeeemLabel type={data.reward_type} />
              </div>
              <Divider />
              <Prize
                type={data.reward_type}
                prizes={data.record_info}
                showLabel={false}
                className="prize"
              />
              <Divider />
              <div className="time">
                {t('exchange.redeem-time')}
                {formatTime(data.redeemed_timestamp, i18n.language)}
              </div>
            </BoxContainer>
            <BoxContainer>
              <div className="header">
                <span title="title">{t('exchange.prize.receiver.info')}</span>
              </div>
              <Divider />
              {addressInfo?.name ? (
                <RowContainer>
                  <Row label={t('exchange.prize.address.name')}>
                    {addressInfo.name}
                  </Row>
                </RowContainer>
              ) : null}
              {addressInfo?.phone_number ? (
                <RowContainer>
                  <Row label={t('exchange.prize.address.phone')}>
                    {addressInfo.phone_number}
                  </Row>
                </RowContainer>
              ) : null}
              {addressInfo?.address ? (
                <RowContainer>
                  <Row label={t('exchange.prize.address.address')}>
                    {addressInfo.address}
                  </Row>
                </RowContainer>
              ) : null}
              {addressInfo?.ckb_address ? (
                <RowContainer>
                  <Row label={t('exchange.prize.ckb')}>
                    {addressInfo.ckb_address}
                  </Row>
                </RowContainer>
              ) : null}
              {addressInfo == null ? (
                <RowContainer>
                  <Row label={t('exchange.prize.address.address')}>
                    {address}
                  </Row>
                </RowContainer>
              ) : null}
            </BoxContainer>
            {comment ? (
              <BoxContainer>
                <div className="header">
                  <span title="title">
                    {t('exchange.prize.issuer.comment')}
                  </span>
                </div>
                <Divider />
                <div className="comment">{comment}</div>
              </BoxContainer>
            ) : null}
          </>
        )}
      </main>
    </Container>
  )
}
