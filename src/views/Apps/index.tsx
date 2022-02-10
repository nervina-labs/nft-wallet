/* eslint-disable @typescript-eslint/restrict-template-expressions */
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { HiddenBarFill } from '../../components/HiddenBar'
import { MainContainer } from '../../styles'
import Exhibition from '../../assets/img/exhibition2.png'
import PlzWait from '../../assets/img/plz-wait.png'
import PlzWaitEN from '../../assets/img/plz-wait-en.png'
import Red from '../../assets/svg/red-bucket2.svg'
import Ticket from '../../assets/svg/ticket2.svg'
import DAO from '../../assets/svg/dao2.svg'
import Exchange from '../../assets/svg/exchange2.svg'
import Vip from '../../assets/svg/vip2.svg'
import ShopBg from '../../assets/svg/shop-bg.svg'
import classNames from 'classnames'
import { TICKET_APP_URL } from '../../constants'
import { RoutePath } from '../../routes'
import { useHistory } from 'react-router-dom'
import { useAccount } from '../../hooks/useAccount'
import {
  trackLabels,
  useTrackClick,
  useTrackDidMount,
} from '../../hooks/useTrack'

const Container = styled(MainContainer)`
  padding-top: 20px;
  max-width: 500px;
  min-height: 100%;
  background: #fafafa;
  .welcome {
    width: 343px;
    height: 40px;
    color: #3d2a83;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto;
    margin-bottom: 16px;
    > span {
      padding: 0 50px;
      line-height: 16px;
      text-align: center;
    }
  }
  .shop {
    width: 343px;
    height: 96px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto;
    background: #ffffff;
    box-shadow: 0px 10px 20px rgba(227, 227, 227, 0.25);
    border-radius: 25px;
    .content {
      cursor: pointer;
      width: 231px;
      margin-left: 10px;
      margin-right: 10px;
      padding: 10px;
      background: #f8f7fb;
      box-shadow: 0px 10px 20px rgba(227, 227, 227, 0.25);
      border-radius: 15px;
      .title {
        font-size: 16px;
        color: black;
        font-weight: bold;
      }
      .desc {
        margin: 6px 0;
        text-align: left;
        font-size: 12px;
        color: black;
      }
    }
  }
  .main {
    text-align: center;
    margin-top: 20px;

    h4 {
      font-weight: normal;
    }
  }
`

export const ItemContainer = styled.div`
  color: white;
  height: ${(props: { isEn: boolean }) => (props.isEn ? '214px' : '194px')};
  background-size: cover;
  background-color: white;
  width: 168px;
  display: inline-block;
  cursor: not-allowed;
  text-align: left;
  position: relative;
  .icon {
    margin-top: 18px;
    margin-left: 10px;
    max-width: 63px;
    height: 53px;
  }
  &.available {
    cursor: pointer;
  }
  &:nth-child(odd) {
    margin-right: 10px;
  }
  border-radius: 25px;
  margin-bottom: 12px;
  .title {
    font-size: 16px;
    color: black;
    font-weight: bold;
  }
  .desc {
    margin: 6px 0;
    text-align: left;
    font-size: 12px;
    color: black;
  }
  .content {
    margin-top: 10px;
    margin-left: 10px;
    text-align: left;
    border-radius: 15px;
    width: 136px;
    height: ${(props: { isEn: boolean }) => (props.isEn ? '120px' : '100px')};
    padding: 10px 6px;
    position: absolute;
  }
  .wait {
    img {
      position: absolute;
      top: 25px;
      right: 10px;
      width: 43px;
      height: 39px;
    }
  }
`

export interface ItemProps {
  title: string
  desc: string
  bg: string
  onClick?: () => void
  available: boolean
  lang?: string
  color?: string
}

export const Item: React.FC<ItemProps> = ({
  title,
  desc,
  bg,
  available,
  onClick,
  lang,
  color,
}) => {
  const { i18n } = useTranslation('translations')
  return (
    <ItemContainer
      isEn={i18n.language === 'en'}
      className={classNames({ available })}
      onClick={onClick}
    >
      <img src={bg} className="icon" />
      {available ? null : (
        <div className="wait">
          <img src={lang === 'en' ? PlzWaitEN : PlzWait} />
        </div>
      )}
      <div className="content" style={{ backgroundColor: color }}>
        <div className="title">{title}</div>
        <div className="desc">{desc}</div>
      </div>
    </ItemContainer>
  )
}

export const Apps: React.FC = () => {
  const { t, i18n } = useTranslation('translations')
  const { pubkey, email } = useAccount()
  const history = useHistory()
  useTrackDidMount('apps')
  const getAppUrl = useCallback(
    (baseUrl: string): string => {
      const url = `${baseUrl}`
      if (pubkey && email) {
        return `${url}/?unipass_ret=${encodeURIComponent(
          JSON.stringify({
            code: 200,
            info: 'login success',
            data: {
              pubkey,
              email,
            },
          })
        )}`
      }
      return url
    },
    [pubkey, email]
  )
  const trackClick = useTrackClick('apps', 'click')
  const data: ItemProps[] = [
    {
      title: t('apps.exchange.title'),
      desc: t('apps.exchange.desc'),
      color: '#F7F3FF',
      bg: Exchange,
      available: true,
      onClick: () => {
        history.push(RoutePath.Redeem)
        trackClick(trackLabels.apps.redeem)
      },
    },
    {
      title: t('apps.red-envelope.title'),
      desc: t('apps.red-envelope.desc'),
      bg: Red,
      color: '#FFF6F1',
      available: true,
      onClick: () => {
        history.push(RoutePath.RedEnvelope)
        trackClick(trackLabels.apps.pocket)
      },
    },
    {
      title: t('apps.ticket.title'),
      desc: t('apps.ticket.desc'),
      bg: Ticket,
      available: true,
      color: '#F7FFF0',
      onClick: () => {
        location.href = getAppUrl(TICKET_APP_URL)
        trackClick(trackLabels.apps.ticket)
      },
    },
    {
      title: t('apps.dao.title'),
      color: '#F1FBFF',
      desc: t('apps.dao.desc'),
      bg: DAO,
      available: false,
      onClick: () => {
        trackClick(trackLabels.apps.dao)
      },
    },
    {
      title: t('apps.exhibition.title'),
      desc: t('apps.exhibition.desc'),
      bg: Exhibition,
      color: '#E5FFF6',
      available: false,
      onClick: () => {
        trackClick(trackLabels.apps.hall)
      },
    },
    {
      title: t('apps.vip.title'),
      desc: t('apps.vip.desc'),
      color: '#FFF9E8',
      bg: Vip,
      available: false,
      onClick: () => {
        trackClick(trackLabels.apps.vip)
      },
    },
  ]

  return (
    <Container>
      <div className="welcome" style={{ background: `url(${ShopBg})` }}>
        <span>{t('apps.welcome')}</span>
      </div>
      <div className="main">
        {data.map(({ title, desc, bg, onClick, available, color }) => {
          return (
            <Item
              title={title}
              desc={desc}
              key={title}
              bg={bg}
              onClick={onClick}
              available={available}
              lang={i18n.language}
              color={color}
            />
          )
        })}
      </div>
      <br />
      <br />
      <br />
      <HiddenBarFill />
    </Container>
  )
}
