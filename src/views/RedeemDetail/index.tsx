import React, { useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { Redirect, useHistory, useParams } from 'react-router'
import styled from 'styled-components'
import { Appbar, AppbarSticky } from '../../components/Appbar'
import { Loading } from '../../components/Loading'
import { Query } from '../../models'
import { RoutePath } from '../../routes'
import { MainContainer } from '../../styles'
import { useTranslation } from 'react-i18next'
import { formatTime } from '../../utils'
import classNames from 'classnames'
import {
  isCustomReward,
  RedeemDetailModel,
  RedeemStatus,
  UserRedeemState,
} from '../../models/redeem'
import { Prize } from '../Reedem/Prize'
import { Condition } from './Condition'
import { Footer } from './Footer'
import { useSignRedeem } from '../../hooks/useRedeem'
import { SubmitInfo } from './SubmitInfo'
import { useAPI } from '../../hooks/useAccount'
import { useRoute } from '../../hooks/useRoute'
import {
  Issuer,
  Progress,
  Box,
  Divider,
  Tab,
  TabList,
  Tabs,
} from '@mibao-ui/components'
import { Alert } from '../../components/Alert'

const Container = styled(MainContainer)`
  display: flex;
  flex-direction: column;
  background: #f6f6f6;
  min-height: 100%;
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
      <AppbarSticky>
        <Appbar
          title={t('exchange.event.title')}
          onLeftClick={() =>
            history.replace(
              from === location.pathname ? RoutePath.Redeem : from
            )
          }
          right={<></>}
        />
      </AppbarSticky>
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
                <Progress
                  value={
                    isDone
                      ? 100
                      : (data?.progress.claimed / data?.progress.total) * 100
                  }
                  colorScheme={isClosed ? 'gray' : 'orange'}
                  mb="8px"
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
            <Divider size="1px" />
            <div className="title">{data.name}</div>
            <div className="desc">{data.description}</div>
            <div className="issue">
              <Issuer
                isBanned={data?.issuer_info?.is_issuer_banned}
                src={data.issuer_info.avatar_url}
                name={data.issuer_info?.name}
                isVerified={
                  data?.issuer_info?.is_issuer_banned
                    ? false
                    : data?.verified_info?.is_verified
                }
                href={`${RoutePath.Issuer}/${
                  data.issuer_info?.issuer_id ?? data.issuer_info?.uuid
                }`}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  history.push(
                    `${RoutePath.Issuer}/${
                      data.issuer_info?.issuer_id ?? data.issuer_info?.uuid
                    }`
                  )
                }}
                size="25px"
              />
              <div className="issuer">{t('exchange.issuer')}</div>
            </div>
            <Tabs
              index={showPrize ? 0 : 1}
              colorScheme="black"
              align="space-around"
            >
              <TabList px="20px">
                <Tab onClick={() => setShowPrice(true)}>
                  {t('exchange.event.tabs.price')}
                </Tab>
                <Tab onClick={() => setShowPrice(false)}>
                  {t('exchange.event.tabs.requirement')}
                </Tab>
              </TabList>
            </Tabs>
            {showPrize ? (
              <Prize prizes={data.reward_info} type={data.reward_type} />
            ) : (
              <Condition detail={data} />
            )}
            <Box px="20px" mb="80px" mt="8px">
              <Alert borderRadius="8px">
                {t(
                  `exchange.warning${
                    data?.rule_info?.will_destroyed ? '-destroyed' : ''
                  }`
                )}
              </Alert>
            </Box>
            <CustomFooter data={data} />
            <SubmitInfo data={data} />
          </>
        )}
      </main>
    </Container>
  )
}
