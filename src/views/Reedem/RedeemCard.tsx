import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { createStyles, withStyles, Theme } from '@material-ui/core/styles'
import LinearProgress from '@material-ui/core/LinearProgress'
import { useTranslation } from 'react-i18next'
import { Creator } from '../../components/Creator'
import { RedeemEventItem, RedeemStatus } from '../../models/redeem'
import { Divider } from '@material-ui/core'
import { RedeeemLabel } from './Label'
import classNames from 'classnames'
import { useHistory } from 'react-router'
import { RoutePath } from '../../routes'
import { Media } from './Media'
import { useWarning } from '../../hooks/useWarning'

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

const Container = styled.div`
  box-shadow: 0px 1px 8px rgba(0, 0, 0, 0.08);
  border-radius: 20px;
  background-color: white;
  margin: 16px 20px;
  /* margin-top: 0; */
  .issuer {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 12px 16px;
    > span {
      font-size: 12px;
      margin-left: auto;
      color: #999999;
    }
  }
  .header {
    padding: 12px 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    /* margin-bottom: 0; */
    .title {
      font-size: 14px;
      font-weight: 500;
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      word-break: break-all;
      text-overflow: ellipsis;
      color: black;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
    > span {
      margin-left: auto;
    }
  }

  .content {
    display: flex;
    /* justify-content: center; */
    align-items: center;
    padding: 8px 16px;
  }

  .progress {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    padding: 8px 16px;
    .exchanged {
      color: #777e91;
    }
  }

  .status {
    padding: 10px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    color: #999999;
    font-size: 14px;
    cursor: pointer;
    &.exchange {
      color: #ff6e30;
    }
    &.exchanged {
      color: black;
    }
    &.disabled {
      color: #999999;
      cursor: not-allowed;
    }
    .wait {
      color: #fb5d3b;
      position: absolute;
      right: 16px;
    }
  }
`
interface ProgressProps {
  total: number
  exchanged: number
}

const Progress: React.FC<ProgressProps> = ({ total, exchanged }) => {
  const [t] = useTranslation('translations')
  return (
    <div className="progress">
      <span>{t('exchange.progress')}</span>
      <BorderLinearProgress
        variant="determinate"
        value={(exchanged / total) * 100}
        style={{ flex: 1, margin: '0 12px' }}
      />
      <span>
        <span className="exchanged">{exchanged}</span>/{total}
      </span>
    </div>
  )
}

export interface ExchangeEventProps {
  item: RedeemEventItem
}

interface ActionProps {
  status: RedeemStatus
  id: string
}

const ExchangeAction: React.FC<ActionProps> = ({ status, id }) => {
  const [t] = useTranslation('translations')
  const history = useHistory()
  const text = useMemo(() => {
    if (status === RedeemStatus.Closed) {
      return t('exchange.event.closed')
    } else if (status === RedeemStatus.Ended) {
      return t('exchange.event.end')
    } else if (status === RedeemStatus.Exchanged) {
      return t('exchange.check.price')
    } else if (status === RedeemStatus.Wait) {
      return t('exchange.check.wait')
    }
    return t('exchange.actions.redeem')
  }, [status, t])
  const warning = useWarning()
  const onClick = useCallback(
    (e: React.SyntheticEvent) => {
      e.stopPropagation()
      e.preventDefault()
      if (status === RedeemStatus.Exchanged) {
        history.push(`${RoutePath.RedeemPrize}/${id}`)
      } else {
        warning(t('exchange.warning'))
      }
    },
    [warning, t, history, status, id]
  )
  return (
    <div
      className={classNames('status', {
        exchange: status === RedeemStatus.Open,
        exchanged: status === RedeemStatus.Exchanged,
        disabled:
          status === RedeemStatus.Closed || status === RedeemStatus.Ended,
      })}
      onClick={onClick}
    >
      <span>{text}</span>
      {status === RedeemStatus.Wait ? (
        <span className="wait">{t('exchange.check.wait')}</span>
      ) : null}
    </div>
  )
}

export const ReedemCard: React.FC<ExchangeEventProps> = ({ item }) => {
  const [t] = useTranslation('translations')
  const history = useHistory()
  return (
    <Container onClick={() => history.push(`${RoutePath.Redeem}/${item.uuid}`)}>
      <div className="issuer">
        <Creator
          title=""
          baned={false}
          url={item.issuer.avatar_url}
          name={item.issuer?.name}
          uuid={item.issuer?.uuid}
          vipAlignRight
          color="rgb(51, 51, 51)"
          isVip={item?.issuer?.verified_info?.is_verified}
          vipTitle={item?.issuer?.verified_info?.verified_title}
          vipSource={item?.issuer?.verified_info?.verified_source}
        />
        <span>{t('exchange.issuer')}</span>
      </div>
      <Divider />
      <div className="header">
        <span className="title">{item.title}</span>
        <RedeeemLabel type={item.type} />
      </div>
      <div className="content">
        {item.tokens.slice(0, 4).map((token) => {
          return <Media isPlayable hasCardBack src={token.bg_image_url} />
        })}
      </div>
      <Progress exchanged={item.exchanged} total={item.total} />
      <Divider />
      <ExchangeAction status={item.status} id={item.uuid} />
    </Container>
  )
}
