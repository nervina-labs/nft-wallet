import React from 'react'
import {
  Route,
  useHistory,
  useRouteMatch,
  Switch,
  Redirect,
} from 'react-router'
import styled from 'styled-components'
import { Appbar } from '../../components/Appbar'
import { ReactComponent as BackSvg } from '../../assets/svg/back.svg'
import LogoutPng from '../../assets/img/logout.png'
import { RoutePath } from '../../routes'
import { Info } from '../Info'
import { Transactions } from '../Transactions'
import { MainContainer } from '../../styles'
import { useTranslation } from 'react-i18next'
import Bg from '../../assets/img/account-bg.png'
import { useAccount, useAccountStatus, useLogout } from '../../hooks/useAccount'

const Container = styled(MainContainer)`
  display: flex;
  flex-direction: column;

  .bg {
    position: fixed;
    top: 0;
    width: 100%;
    max-width: 500px;
    height: 215px;
    background: darkgray url(${Bg});
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    display: flex;
    justify-content: center;
    .tabs {
      display: flex;
      margin-top: 100px;
      border-radius: 20px;
      background-color: rgba(255, 255, 255, 0.65);
      padding: 5px;
      height: 40px;
      font-size: 14px;
      line-height: 18px;
      .tab {
        cursor: pointer;
        width: 120px;
        height: 40px;
        font-size: 14px;
        font-weight: bold;
        line-height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #0e0e0e;
        &.active {
          background-color: white;
          border-radius: 20px;
        }
      }
    }
    /* padding-left: 16px; */
  }

  .detail {
    flex: 1;
    background-color: white;
    z-index: 2;
  }
`

export const InfoComponent: React.FC = () => {
  const { address } = useAccount()
  return <Info address={address} />
}

export const Account: React.FC = () => {
  const history = useHistory()
  const { t } = useTranslation('translations')
  const logout = useLogout()
  const { isLogined } = useAccountStatus()
  const matchInfo = useRouteMatch(RoutePath.Info)
  const matchAccount = useRouteMatch(RoutePath.Account)
  const isInfo = matchInfo?.isExact != null
  const isAccount = matchAccount?.isExact === true

  if (!isLogined) {
    return <Redirect to={RoutePath.Explore} />
  }
  if (isAccount) {
    return <Redirect from={RoutePath.Account} exact to={RoutePath.Info} />
  }
  return (
    <Container>
      <Appbar
        title={isInfo ? t('account.title') : t('account.transactions')}
        left={<BackSvg onClick={() => history.push(RoutePath.NFTs)} />}
        right={<img src={LogoutPng} onClick={logout.bind(null, history)} />}
      />
      <section className="detail">
        <Switch>
          <Route component={InfoComponent} path={RoutePath.Info} exact />
          <Route component={Transactions} path={RoutePath.Transactions} exact />
          <Redirect to={RoutePath.NotFound} />
        </Switch>
      </section>
    </Container>
  )
}
