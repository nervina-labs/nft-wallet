import React from 'react'
import {
  BrowserRouter,
  Redirect,
  Route,
  RouteProps,
  Switch,
} from 'react-router-dom'
import { useWalletModel } from '../hooks/useWallet'
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
  const { isLogined } = useWalletModel()
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  )
}
