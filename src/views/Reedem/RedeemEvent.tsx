import React, { useMemo } from 'react'
import styled from 'styled-components'
import { createStyles, withStyles, Theme } from '@material-ui/core/styles'
import LinearProgress from '@material-ui/core/LinearProgress'
import { LazyLoadImage } from '../../components/Image'
import { getImagePreviewUrl } from '../../utils'
import FallbackImg from '../../assets/img/card-fallback.png'
import { ReactComponent as PlayerSvg } from '../../assets/svg/player.svg'
import { CardBack } from '../../components/Cardback'
import { useTranslation } from 'react-i18next'
import { Creator } from '../../components/Creator'
import { RedeemEventItem, RedeemStatus } from '../../models/redeem'
import { Divider } from '@material-ui/core'
import { Label } from './Label'
import classNames from 'classnames'
import { useHistory } from 'react-router'
import { RoutePath } from '../../routes'

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
    &.exchange {
      color: #ff6e30;
    }
    &.exchanged {
      color: black;
    }
    .wait {
      color: #fb5d3b;
      position: absolute;
      right: 16px;
    }
  }
`

export interface MediaProps {
  src: string
  isPlayable: boolean
  hasCardBack: boolean
  width?: number
}

const MediaContainer = styled.div`
  position: relative;
  border-radius: 8px;
  margin-right: 4px;
  overflow: hidden;
  .player {
    position: absolute;
    right: 6px;
    bottom: 6px;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    svg {
      width: 20px;
      height: 20px;
    }
  }
`

export const Media: React.FC<MediaProps> = ({
  src,
  isPlayable,
  hasCardBack,
  width = 70,
}) => {
  return (
    <MediaContainer style={{ minWidth: `${width}px` }}>
      <LazyLoadImage
        src={getImagePreviewUrl(src)}
        width={width}
        height={width}
        skeletonStyle={{ borderRadius: '8px' }}
        cover={true}
        imageStyle={{ borderRadius: '8px' }}
        disableContextMenu={true}
        backup={
          <LazyLoadImage
            skeletonStyle={{ borderRadius: '8px' }}
            width={width}
            cover
            height={width}
            src={FallbackImg}
          />
        }
      />
      {isPlayable ? (
        <span className="player">
          <PlayerSvg />
        </span>
      ) : null}
      {hasCardBack ? <CardBack tooltipPlacement="top-start" /> : null}
    </MediaContainer>
  )
}

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

const ExchangeAction: React.FC<{ status: RedeemStatus }> = ({ status }) => {
  const [t] = useTranslation('translations')
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
    return t('exchange.actions.exchange')
  }, [status, t])
  return (
    <div
      className={classNames('status', {
        exchange: status === RedeemStatus.Open,
        exchanged: status === RedeemStatus.Exchanged,
      })}
    >
      <span>{text}</span>
      {status === RedeemStatus.Wait ? (
        <span className="wait">{t('exchange.check.wait')}</span>
      ) : null}
    </div>
  )
}

export const ReedemEvent: React.FC<ExchangeEventProps> = ({ item }) => {
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
        <Label type={item.type} />
      </div>
      <div className="content">
        {item.tokens.slice(0, 4).map((token) => {
          return <Media isPlayable hasCardBack src={token.bg_image_url} />
        })}
      </div>
      <Progress exchanged={item.exchanged} total={item.total} />
      <Divider />
      <ExchangeAction status={item.status} />
    </Container>
  )
}
