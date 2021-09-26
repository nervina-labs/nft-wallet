import React, { useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { Redirect, useHistory, useParams } from 'react-router'
import styled from 'styled-components'
import { Appbar } from '../../components/Appbar'
import { Loading } from '../../components/Loading'
import { Query } from '../../models'
import { RoutePath, useRoute } from '../../routes'
import { MainContainer } from '../../styles'
import { ReactComponent as BackSvg } from '../../assets/svg/back.svg'
import { useTranslation } from 'react-i18next'
import { formatTime } from '../../utils'
import { Divider } from '@material-ui/core'
import classNames from 'classnames'
import {
  isCustomReward,
  RedeemDetailModel,
  RedeemStatus,
  UserRedeemState,
} from '../../models/redeem'
import { Creator } from '../../components/Creator'
import { createStyles, withStyles, Theme } from '@material-ui/core/styles'
import LinearProgress from '@material-ui/core/LinearProgress'
import { Prize } from '../Reedem/Prize'
import { Condition } from './Condition'
import Alert from '@material-ui/lab/Alert'
import { Footer } from './Footer'
import { Tab, Tabs } from '../../components/Tab'
import { useSignRedeem } from '../../hooks/useRedeem'
import { SubmitInfo } from './SubmitInfo'
import { useAPI } from '../../hooks/useAccount'

const BorderLinearProgress = withStyles((theme: Theme) =>
  createStyles({
    root: {
      height: 8,
      borderRadius: 5,
    },
    colorPrimary: {
      backgroundColor:
        theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    },
    bar: {
      borderRadius: 5,
      backgroundColor: '#45B26B',
    },
  })
)(LinearProgress)

const Container = styled(MainContainer)`
  display: flex;
  flex-direction: column;
  background: #f6f6f6;
  main {
    .MuiAlert-root {
      font-size: 12px;
      margin: 8px 20px;
      margin-bottom: 80px;
    }
    .tab {
      font-size: 14px;
    }
    background: #f6f6f6;
    flex: 1;
    .article {
      height: 135px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: rgb(245, 175, 55);
      .box {
        width: 100%;
        margin: 0 20px;
        padding: 16px 20px;
        background-color: white;
        border-radius: 20px;
        .status {
          color: #ff8201;
          text-align: center;
          font-size: 15px;
          font-weight: bold;
          margin-bottom: 18px;
          &.closed {
            color: #666666;
          }
        }
        .MuiLinearProgress-bar {
          background-color: #ff8201;
        }
        .closed {
          .MuiLinearProgress-bar {
            background-color: #999999;
          }
        }
        .progress {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          &.closed {
            color: #666666;
          }
          .exchanged {
            color: #777e91;
          }
        }
      }
    }
    .issue-time {
      padding: 6px 20px;
      font-size: 12px;
    }
    .title {
      font-weight: bolder;
      font-size: 16px;
      margin: 16px 20px;
    }
    .desc {
      font-size: 14px;
      margin: 16px 20px;
      color: #666666;
      white-space: pre-line;
    }
    .issue {
      margin-left: 20px;
      margin-bottom: 16px;
      margin-right: 20px;
      .issuer {
        margin-top: 8px;
        color: #999999;
        font-size: 12px;
      }
    }

    .tabs {
      max-width: 500px;
      width: 100%;
      font-size: 14px;
      color: #8e8e93;
      display: flex;
      .tab {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 50%;
        &.active {
          font-weight: 500;
          color: #000000;
        }
        position: relative;
        .active-line {
          background: #ff5c00;
          border-radius: 10px;
          position: absolute;
          height: 3px;
          width: 28px;
          top: 22px;
        }
      }
    }
  }
`

interface CustomFooterProps {
  data: RedeemDetailModel
}

const CustomFooter: React.FC<CustomFooterProps> = ({ data }) => {
  const { onRedeem } = useSignRedeem()

  return (
    <Footer
      status={data.state}
      willDestroyed={data?.rule_info?.will_destroyed}
      isReedemable={
        data.user_redeemed_state === UserRedeemState.AllowRedeem &&
        data?.state === RedeemStatus.Open
      }
      onClick={() => {
        onRedeem({
          isAllow: data?.user_redeemed_state === UserRedeemState.AllowRedeem,
          willDestroyed: data?.rule_info?.will_destroyed,
          id: data.uuid,
          deliverType: isCustomReward(data?.reward_info)
            ? data?.reward_info.delivery_type
            : undefined,
        })
      }}
    />
  )
}

export const RedeemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { t, i18n } = useTranslation('translations')
  const api = useAPI()
  const history = useHistory()
  const { isError, data } = useQuery(
    [Query.RedeemDetail, id, api],
    async () => {
      const { data } = await api.getRedeemDetail(id)
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

  const isClosed = data?.state === RedeemStatus.Closed
  const isDone = data?.state === RedeemStatus.Done
  const { from } = useRoute()

  const status = useMemo(() => {
    const status = data?.state
    if (status === RedeemStatus.Closed) {
      return t('exchange.event.closed')
    } else if (status === RedeemStatus.Done) {
      return t('exchange.event.end')
    }
    return t('exchange.event.on-going')
  }, [data?.state, t])
  const [showPrize, setShowPrice] = useState(true)

  if (isError) {
    return <Redirect to={RoutePath.NotFound} />
  }

  return (
    <Container>
      <Appbar
        title={t('exchange.event.title')}
        left={
          <BackSvg
            onClick={() =>
              history.replace(
                from === location.pathname ? RoutePath.Redeem : from
              )
            }
          />
        }
        right={<></>}
      />
      <main>
        {data == null ? (
          <Loading />
        ) : (
          <>
            <div className="article">
              <div className="box">
                <div className={classNames('status', { closed: isClosed })}>
                  {status}
                </div>
                <BorderLinearProgress
                  variant="determinate"
                  value={
                    isDone
                      ? 100
                      : (data?.progress.claimed / data?.progress.total) * 100
                  }
                  style={{ flex: 1, marginBottom: '6px' }}
                  className={classNames({ closed: isClosed })}
                />
                <div className={classNames('progress', { closed: isClosed })}>
                  <span>{t('exchange.progress')}</span>
                  <span>
                    <span className="exchanged">{data?.progress.claimed}</span>/
                    <span>{data?.progress.total}</span>
                  </span>
                </div>
              </div>
            </div>
            <div className="issue-time">
              {t('exchange.issue-time')}
              {formatTime(data.start_timestamp, i18n.language)}
            </div>
            <Divider />
            <div className="title">{data.name}</div>
            <div className="desc">{data.description}</div>
            <div className="issue">
              <Creator
                title=""
                baned={data?.issuer_info?.is_issuer_banned}
                url={data.issuer_info.avatar_url}
                name={data.issuer_info?.name}
                uuid={data.issuer_info?.issuer_id ?? data.issuer_info?.uuid}
                vipAlignRight={false}
                color="#333333"
                isVip={
                  data?.issuer_info?.is_issuer_banned
                    ? false
                    : data?.verified_info?.is_verified
                }
                vipTitle={data?.verified_info?.verified_title}
                vipSource={data?.verified_info?.verified_source}
              />
              <div className="issuer">{t('exchange.issuer')}</div>
            </div>
            <Tabs activeKey={showPrize ? 0 : 1}>
              <Tab
                active={showPrize}
                onClick={() => setShowPrice(true)}
                className="tab"
              >
                {t('exchange.event.tabs.price')}
              </Tab>
              <Tab
                active={!showPrize}
                onClick={() => setShowPrice(false)}
                className="tab"
              >
                {t('exchange.event.tabs.requirement')}
              </Tab>
            </Tabs>
            <Divider
              style={{ position: 'relative', top: '5px', margin: '0 20px' }}
            />
            {showPrize ? (
              <Prize prizes={data.reward_info} type={data.reward_type} />
            ) : (
              <Condition detail={data} />
            )}
            <Alert severity="error">
              {t(
                `exchange.warning${
                  data?.rule_info?.will_destroyed ? '-destroyed' : ''
                }`
              )}
            </Alert>
            <CustomFooter data={data} />
            <SubmitInfo data={data} />
          </>
        )}
      </main>
    </Container>
  )
}
