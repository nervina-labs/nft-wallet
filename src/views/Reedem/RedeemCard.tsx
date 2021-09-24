import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { createStyles, withStyles, Theme } from '@material-ui/core/styles'
import LinearProgress from '@material-ui/core/LinearProgress'
import { useTranslation } from 'react-i18next'
import { Creator } from '../../components/Creator'
import {
  CustomRewardType,
  isBlindReward,
  isCustomReward,
  RedeemEventItem,
  RedeemStatus,
  UserRedeemState,
} from '../../models/redeem'
import { Divider } from '@material-ui/core'
import { RedeeemLabel } from './Label'
import classNames from 'classnames'
import { useHistory, useRouteMatch } from 'react-router'
import { RoutePath } from '../../routes'
import { Media } from './Media'
import { NftType } from '../../models'
import { useSignRedeem } from '../../hooks/useRedeem'

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
      transition: 'none',
      animation: 'none',
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
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    > span {
      font-size: 12px;
      margin-left: auto;
      color: #999999;
      word-break: keep-all;
      margin-left: 4px;
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
  prizeId: string
  userState: UserRedeemState
  willDestroyed: boolean
  deliverType: CustomRewardType
  item?: RedeemEventItem
}

const ExchangeAction: React.FC<ActionProps> = ({
  status,
  id,
  userState,
  prizeId,
  willDestroyed,
  deliverType,
  item,
}) => {
  const [t] = useTranslation('translations')
  const history = useHistory()
  const isAllowRedeem =
    status === RedeemStatus.Open && UserRedeemState.AllowRedeem === userState
  const matchMyRedeem = useRouteMatch(RoutePath.MyRedeem)
  const text = useMemo(() => {
    if (matchMyRedeem) {
      if (
        deliverType === CustomRewardType.None ||
        userState === UserRedeemState.WaittingRedeem
      ) {
        return t('exchange.check.price')
      }
      return t('exchange.check.comment')
    }
    if (status === RedeemStatus.Closed) {
      return t('exchange.event.closed')
    } else if (status === RedeemStatus.Done) {
      return t('exchange.event.end')
    } else if (userState === UserRedeemState.AllowRedeem) {
      return t('exchange.actions.redeem')
    }

    return t('exchange.actions.insufficient')
  }, [status, t, userState, deliverType, matchMyRedeem])

  const { onRedeem } = useSignRedeem()
  const onClick = useCallback(
    (e: React.SyntheticEvent) => {
      e.stopPropagation()
      e.preventDefault()
      if (matchMyRedeem) {
        history.push(`${RoutePath.RedeemPrize}/${prizeId}`)
      } else if (isAllowRedeem) {
        onRedeem({
          deliverType,
          isAllow: true,
          id,
          willDestroyed,
          item,
        })
      }
    },
    [
      history,
      prizeId,
      isAllowRedeem,
      willDestroyed,
      id,
      onRedeem,
      deliverType,
      item,
      matchMyRedeem,
    ]
  )

  return (
    <div
      className={classNames('status', {
        exchange: isAllowRedeem,
        exchanged: !!matchMyRedeem,
        disabled: !isAllowRedeem && !matchMyRedeem,
      })}
      onClick={onClick}
    >
      <span>{text}</span>
      {userState === UserRedeemState.WaittingRedeem && matchMyRedeem ? (
        <span className="wait">{t('exchange.check.wait')}</span>
      ) : null}
    </div>
  )
}

export const ReedemCard: React.FC<ExchangeEventProps> = ({ item }) => {
  const [t] = useTranslation('translations')
  const history = useHistory()
  const rewards = useMemo(() => {
    if (isCustomReward(item.reward_info)) {
      return item.reward_info.images.slice(0, 4).map((src, i) => {
        return (
          <Media isPlayable={false} hasCardBack={false} src={src} key={i} />
        )
      })
    }
    const tokens = isBlindReward(item.reward_info)
      ? item.reward_info.options
      : item.reward_info

    return tokens.slice(0, 4).map((t, i) => {
      const isBaned = t.is_banned || t.is_class_banned || t.is_issuer_banned
      return (
        <Media
          isPlayable={isBaned ? false : t.renderer_type !== NftType.Picture}
          hasCardBack={isBaned ? false : t.card_back_content_exist}
          src={isBaned ? '' : t.class_bg_image_url}
          key={i}
        />
      )
    })
  }, [item.reward_info])
  return (
    <Container
      onClick={() => history.push(`${RoutePath.Redeem}/${item.uuid}`, item)}
    >
      <div className="issuer">
        <Creator
          title=""
          baned={item.issuer_info.is_issuer_banned}
          url={item.issuer_info.avatar_url}
          name={item.issuer_info?.name}
          uuid={item.issuer_info?.uuid}
          vipAlignRight={false}
          color="rgb(51, 51, 51)"
          isVip={
            item.issuer_info.is_issuer_banned
              ? false
              : item?.verified_info?.is_verified
          }
          vipTitle={item?.verified_info?.verified_title}
          vipSource={item?.verified_info?.verified_source}
        />
        <span>{t('exchange.issuer')}</span>
      </div>
      <Divider />
      <div className="header">
        <span className="title">{item.name}</span>
        <RedeeemLabel type={item.reward_type} />
      </div>
      {rewards.length ? <div className="content">{rewards}</div> : null}
      <Progress exchanged={item.progress.claimed} total={item.progress.total} />
      <Divider />
      <ExchangeAction
        status={item.state}
        id={item.uuid}
        willDestroyed={item?.rule_info?.will_destroyed}
        prizeId={item.user_redeemed_record_uuid}
        userState={item.user_redeemed_state}
        item={item}
        deliverType={
          isCustomReward(item?.reward_info)
            ? item?.reward_info?.delivery_type
            : CustomRewardType.None
        }
      />
    </Container>
  )
}
