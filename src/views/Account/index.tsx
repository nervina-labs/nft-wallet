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
import { ReactComponent as LogoutSvg } from '../../assets/svg/logout.svg'
import { RoutePath } from '../../routes'
import { Info } from '../Info'
import { Transactions } from '../Transactions'
import { useWalletModel } from '../../hooks/useWallet'
import { MainContainer } from '../../styles'
import { useTranslation } from 'react-i18next'

const Container = styled(MainContainer)`
  display: flex;
  flex-direction: column;

  .detail {
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    .tabs {
      display: flex;
      margin-top: 20px;
      .tab {
        cursor: pointer;
        width: 120px;
        height: 40px;
        font-size: 16px;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.6);
        line-height: 22px;
        display: flex;
        align-items: center;
        justify-content: center;
        &.active {
          background: rgba(251, 207, 164, 0.5);
          color: rgba(0, 0, 0, 0.8);
          border-radius: 8px;
        }
      }
    }
  }
`

export const Account: React.FC = () => {
  const history = useHistory()
  const { t } = useTranslation('translations')
  const { logout } = useWalletModel()
  const matchInfo = useRouteMatch(RoutePath.Info)
  const matchTx = useRouteMatch(RoutePath.Transactions)
  const matchAccount = useRouteMatch(RoutePath.Account)
  const isInfo = matchInfo?.isExact != null
  const isTx = matchTx?.isExact != null
  const isAccount = matchAccount?.isExact === true

  const { isLogined } = useWalletModel()
  if (!isLogined) {
    return <Redirect to={RoutePath.Login} />
  }
  if (isAccount) {
    return <Redirect from={RoutePath.Account} exact to={RoutePath.Info} />
  }
  return (
    <Container>
      <Appbar
        title={t('account.title')}
        left={<BackSvg onClick={() => history.push(RoutePath.NFTs)} />}
        right={<LogoutSvg onClick={logout.bind(null, history)} />}
      />
      <section className="detail">
        <div className="tabs">
          <span
            className={`tab ${isInfo ? 'active' : ''}`}
            onClick={() => !isInfo && history.replace(RoutePath.Info)}
          >
            {t('account.info')}
          </span>
          <span
            className={`tab ${isTx ? 'active' : ''}`}
            onClick={() => !isTx && history.replace(RoutePath.Transactions)}
          >
            {t('account.transactions')}
          </span>
        </div>
        <Switch>
          <Route component={Info} path={RoutePath.Info} exact />
          <Route component={Transactions} path={RoutePath.Transactions} exact />
          <Redirect to={RoutePath.NotFound} />
        </Switch>
      </section>
    </Container>
  )
}
