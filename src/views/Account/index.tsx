import React from 'react'
import { Route, useHistory, useRouteMatch, Switch } from 'react-router'
import styled from 'styled-components'
import { Appbar } from '../../components/Appbar'
import { ReactComponent as BackSvg } from '../../assets/svg/back.svg'
import { RoutePath } from '../../routes'
import { Info } from '../Info'
import { Transactions } from '../Transactions'

const Container = styled.main`
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
  const matchInfo = useRouteMatch(RoutePath.Info)
  const matchTx = useRouteMatch(RoutePath.Transactions)
  const isInfo = matchInfo?.isExact != null
  const isTx = matchTx?.isExact != null
  return (
    <Container>
      <Appbar
        title="我的帐号"
        left={<BackSvg onClick={() => history.goBack()} />}
        right={<div />}
      />
      <section className="detail">
        <div className="tabs">
          <span
            className={`tab ${isInfo ? 'active' : ''}`}
            onClick={() => !isInfo && history.push(RoutePath.Info)}
          >
            基本信息
          </span>
          <span
            className={`tab ${isTx ? 'active' : ''}`}
            onClick={() => !isTx && history.push(RoutePath.Transactions)}
          >
            交易
          </span>
        </div>
        <Switch>
          <Route component={Info} path={RoutePath.Info} />
          <Route component={Transactions} path={RoutePath.Transactions} />
        </Switch>
      </section>
    </Container>
  )
}
