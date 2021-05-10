import React, { useEffect } from 'react'
import {
  BrowserRouter,
  Redirect,
  Route,
  RouteProps,
  Switch,
  useHistory,
} from 'react-router-dom'
import { IS_IMTOKEN } from '../constants'
import { useWalletModel, WalletType } from '../hooks/useWallet'
import { Account } from '../views/Account'
import { Login } from '../views/Login'
import { NFT } from '../views/NFT'
import { NFTs } from '../views/NFTs'
import { NotFound } from '../views/NotFound'
import { Transfer } from '../views/Transfer'

export enum RoutePath {
  Launch = '/',
  Login = '/login',
  Account = '/account',
  NFT = '/nft/:id',
  NFTs = '/nfts',
  NotFound = '/404',
  Transfer = '/transfer/:id',
  Info = '/account/info',
  Transactions = '/account/tx',
}

const WalletChange: React.FC = ({ children }) => {
  const { address, prevAddress, walletType } = useWalletModel()
  const history = useHistory()

  useEffect(() => {
    if (
      prevAddress &&
      address &&
      prevAddress !== address &&
      walletType &&
      walletType !== WalletType.Unipass
    ) {
      history.push(RoutePath.NFTs)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevAddress, address, walletType])

  return <>{children}</>
}

const routes: Array<RouteProps & { key: string }> = [
  {
    component: NFTs,
    exact: true,
    key: NFTs.name,
    path: RoutePath.NFTs,
  },
  {
    component: Account,
    exact: false,
    key: Account.name,
    path: RoutePath.Account,
  },
  {
    component: NFT,
    exact: true,
    key: NFT.name,
    path: RoutePath.NFT,
  },
  {
    component: Transfer,
    exact: true,
    key: Transfer.name,
    path: RoutePath.Transfer,
  },
  {
    component: Login,
    exact: true,
    key: Login.name,
    path: RoutePath.Login,
  },
]

export const Routers: React.FC = () => {
  const { isLogined, walletType, login } = useWalletModel()

  useEffect(() => {
    if (IS_IMTOKEN) {
      login(walletType).catch((e) => {
        console.log('login-error', e)
      })
    } else if (isLogined && walletType && walletType !== WalletType.Unipass) {
      login(walletType).catch((e) => {
        console.log('login-error', e)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <BrowserRouter>
      <WalletChange>
        <Switch>
          {routes.map((route) => (
            <Route {...route} key={route.key} path={route.path} />
          ))}
          <Redirect
            exact
            from={RoutePath.Launch}
            to={isLogined ? RoutePath.NFTs : RoutePath.Login}
          />
          <Route component={NotFound} path="*" />
        </Switch>
      </WalletChange>
    </BrowserRouter>
  )
}
