import React, { useEffect } from 'react'
import {
  BrowserRouter,
  Redirect,
  Route,
  RouteProps,
  Switch,
  useHistory,
} from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import { useWalletModel, WalletType } from '../hooks/useWallet'
import { Account } from '../views/Account'
import { Login } from '../views/Login'
import { NFT } from '../views/NFT'
import { NFTs } from '../views/NFTs'
import { NotFound } from '../views/NotFound'
import { Transfer } from '../views/Transfer'
import i18n from '../i18n'
import { Profile } from '../views/Profile'
import { ImagePreview } from '../views/Profile/ImagePreview'
import { TakePhoto } from '../views/Profile/TakePhoto'
import { Explore } from '../views/Explore'

export enum RoutePath {
  Launch = '/',
  Login = '/login',
  Account = '/account',
  NFT = '/nft/:id',
  TokenClass = '/class/:id',
  NFTs = '/nfts',
  NotFound = '/404',
  Transfer = '/transfer/:id',
  Info = '/account/info',
  Transactions = '/account/tx',
  Profile = '/profile',
  ImagePreview = '/avatar/preview',
  TakePhoto = '/avatar/camera',
  Explore = '/explore',
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
    key: 'NFTs',
    path: RoutePath.NFTs,
  },
  {
    component: Account,
    exact: false,
    key: 'Account',
    path: RoutePath.Account,
  },
  {
    component: NFT,
    exact: true,
    key: 'NFT',
    path: RoutePath.NFT,
  },
  {
    component: NFT,
    exact: true,
    key: 'TokenClass',
    path: RoutePath.TokenClass,
  },
  {
    component: Transfer,
    exact: true,
    key: 'Transfer',
    path: RoutePath.Transfer,
  },
  {
    component: Login,
    exact: true,
    key: 'Login',
    path: RoutePath.Login,
  },
  {
    component: Profile,
    exact: true,
    key: 'Profile',
    path: RoutePath.Profile,
  },
  {
    component: ImagePreview,
    exact: true,
    key: 'ImagePreview',
    path: RoutePath.ImagePreview,
  },
  {
    component: TakePhoto,
    exact: true,
    key: 'TakePhoto',
    path: RoutePath.TakePhoto,
  },
  {
    component: Explore,
    exact: true,
    key: 'Explore',
    path: RoutePath.Explore,
  },
]

export const Routers: React.FC = () => {
  const { isLogined, walletType, login } = useWalletModel()

  useEffect(() => {
    if (isLogined && walletType && walletType !== WalletType.Unipass) {
      login(walletType).catch((e) => {
        console.log('login-error', e)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <WalletChange>
          <Switch>
            {routes.map((route) => (
              <Route {...route} key={route.key} path={route.path} />
            ))}
            <Redirect
              exact
              from={RoutePath.Launch}
              to={isLogined ? RoutePath.NFTs : RoutePath.Explore}
            />
            <Route component={NotFound} path="*" />
          </Switch>
        </WalletChange>
      </BrowserRouter>
    </I18nextProvider>
  )
}
