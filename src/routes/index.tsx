import React from 'react'
import {
  BrowserRouter,
  Redirect,
  Route,
  RouteProps,
  Switch,
} from 'react-router-dom'
import { Account } from '../views/Account'
import { Login } from '../views/Login'
import { NFT } from '../views/NFT'
import { NFTs } from '../views/NFTs'
import { Transfer } from '../views/Transfer'

export enum RoutePath {
  Launch = '/',
  Login = '/login',
  MyAccount = '/account',
  NFT = '/nft/:id',
  NFTs = '/nfts/',
  NotFound = '/404',
  Transfer = '/transfer',
}

const routes: Array<RouteProps & { name: string }> = [
  {
    component: Login,
    exact: true,
    name: Login.name,
  },
  {
    component: Account,
    exact: false,
    name: Account.name,
  },
  {
    component: NFT,
    exact: true,
    name: NFT.name,
  },
  {
    component: NFTs,
    exact: true,
    name: NFTs.name,
  },
  {
    component: Transfer,
    exact: false,
    name: Transfer.name,
  },
]

export const Routers: React.FC = () => {
  // TODO: logined redirect to nft, otherwise redirect to login
  return (
    <BrowserRouter>
      <Switch>
        {routes.map((route) => (
          <Route {...route} key={route.name} />
        ))}
        <Redirect exact from={RoutePath.Launch} to={RoutePath.Login} />
      </Switch>
    </BrowserRouter>
  )
}
