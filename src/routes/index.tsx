import React, { useEffect, useState, useContext } from 'react'
import {
  BrowserRouter,
  Redirect,
  Route,
  RouteProps,
  Switch,
  useHistory,
  useLocation,
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
import { ActionDialog } from '../components/ActionDialog'
import { Comfirm } from '../components/Confirm'
import { ReactComponent as FailSvg } from '../assets/svg/fail.svg'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert'
import { useProfileModel } from '../hooks/useProfile'

const Alert: React.FC<AlertProps> = (props: AlertProps) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />
}

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

export const RouterContext = React.createContext({
  to: '',
  from: '',
})

export interface Routes {
  from: string
  to: string
}

export const useRoute = (): Routes => {
  return useContext(RouterContext)
}

const RouterProvider: React.FC = ({ children }) => {
  const location = useLocation()
  const [route, setRoute] = useState<Routes>({
    to: location.pathname,
    from: location.pathname,
  })

  useEffect(() => {
    setRoute((prev) => ({ to: location.pathname, from: prev.to }))
  }, [location])

  return (
    <RouterContext.Provider value={route}>{children}</RouterContext.Provider>
  )
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
    exact: false,
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
    exact: false,
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

export enum ProfilePath {
  Regions = '/profile/regions',
  Provinces = '/profile/regions/provinces',
  Cities = '/profile/regions/cities',
  Username = '/profile/username',
  Description = '/profile/description',
  Birthday = '/profile/birthday',
}

export const Routers: React.FC = () => {
  const {
    isLogined,
    walletType,
    login,
    errorMsg,
    isErrorDialogOpen,
    setIsErrorDialogOpen,
  } = useWalletModel()
  const { showEditSuccess, closeSnackbar, snackbarMsg } = useProfileModel()

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
        <RouterProvider>
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
            <ActionDialog
              icon={<FailSvg />}
              content={errorMsg}
              open={isErrorDialogOpen}
              onConfrim={() => setIsErrorDialogOpen(false)}
              onBackdropClick={() => setIsErrorDialogOpen(false)}
            />
            <Snackbar
              open={showEditSuccess}
              autoHideDuration={1500}
              onClose={closeSnackbar}
              style={{
                bottom: '88px',
              }}
            >
              <Alert
                style={{
                  borderRadius: '16px',
                  background: 'rgba(51, 51, 51, 0.592657)',
                  padding: '4px 30px',
                }}
                icon={false}
                severity="success"
              >
                {snackbarMsg}
              </Alert>
            </Snackbar>
            <Comfirm open disableBackdropClick />
          </WalletChange>
        </RouterProvider>
      </BrowserRouter>
    </I18nextProvider>
  )
}
