import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { HiddenBar } from '../../components/HiddenBar'
import { MainContainer } from '../../styles'
import Exhibition from '../../assets/img/exhibition.png'
import PlzWait from '../../assets/img/plz-wait.png'
import PlzWaitEN from '../../assets/img/plz-wait-en.png'
import Red from '../../assets/svg/red-bucket.svg'
import Ticket from '../../assets/svg/ticket.svg'
import DAO from '../../assets/svg/dao.svg'
import Exchange from '../../assets/svg/exchange.svg'
import Vip from '../../assets/svg/vip.svg'
import classNames from 'classnames'
import { useWalletModel } from '../../hooks/useWallet'
import { RED_ENVELOP_APP_URL, TICKET_APP_URL } from '../../constants'

const Container = styled(MainContainer)`
  padding-top: 20px;
  max-width: 500px;
  min-height: calc(100% - 20px);
  background: white;
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
  height: 184px;
  background: url(${(props: { bg: string }) => props.bg});
  background-size: cover;
  background-color: white;
  width: 168px;
  display: inline-block;
  cursor: not-allowed;
  text-align: left;
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
    color: white;
    margin: 12px;
    margin-top: 24px;
    text-align: left;
  }
  .desc {
    text-align: left;
    margin: 0 12px;
    font-size: 12px;
    line-height: 17px;
    color: white;
    margin: 0 12px;
    word-break: break-all;
  }
  .wait {
    img {
      margin-top: 36px;
      margin-left: 12px;
      width: 38px;
      height: 35px;
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
}

export const Item: React.FC<ItemProps> = ({
  title,
  desc,
  bg,
  available,
  onClick,
  lang,
}) => {
  return (
    <ItemContainer
      bg={bg}
      className={classNames({ available })}
      onClick={onClick}
    >
      <div className="title">{title}</div>
      <div className="desc">{desc}</div>
      {available ? null : (
        <div className="wait">
          <img src={lang === 'en' ? PlzWaitEN : PlzWait} />
        </div>
      )}
    </ItemContainer>
  )
}

export const Apps: React.FC = () => {
  const { t, i18n } = useTranslation('translations')
  const { pubkey, email } = useWalletModel()
  const getAppUrl = (baseUrl: string): string => {
    const url = `${baseUrl}/${i18n.language}`
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
  }
  const data: ItemProps[] = [
    {
      title: t('apps.red-envelope.title'),
      desc: t('apps.red-envelope.desc'),
      bg: Red as any,
      available: true,
      onClick: () => {
        location.href = getAppUrl(RED_ENVELOP_APP_URL)
      },
    },
    {
      title: t('apps.ticket.title'),
      desc: t('apps.ticket.desc'),
      bg: Ticket as any,
      available: true,
      onClick: () => {
        location.href = getAppUrl(TICKET_APP_URL)
      },
    },
    {
      title: t('apps.dao.title'),
      desc: t('apps.dao.desc'),
      bg: DAO as any,
      available: false,
    },
    {
      title: t('apps.exchange.title'),
      desc: t('apps.exchange.desc'),
      bg: Exchange as any,
      available: false,
    },
    {
      title: t('apps.exhibition.title'),
      desc: t('apps.exhibition.desc'),
      bg: Exhibition,
      available: false,
    },
    {
      title: t('apps.vip.title'),
      desc: t('apps.vip.desc'),
      bg: Vip as any,
      available: false,
    },
  ]
  return (
    <Container>
      <HiddenBar alwaysShow />
      <div className="main">
        {data.map(({ title, desc, bg, onClick, available }) => {
          return (
            <Item
              title={title}
              desc={desc}
              key={title}
              bg={bg}
              onClick={onClick}
              available={available}
              lang={i18n.language}
            />
          )
        })}
        <h4>{t('apps.welcome')}</h4>
      </div>
    </Container>
  )
}
