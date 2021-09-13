/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import React, { useEffect, useState, useContext, useRef } from 'react'
import {
  BrowserRouter,
  Redirect,
  Route,
  RouteProps,
  Switch,
  useHistory,
  useLocation,
} from 'react-router-dom'
import { I18nextProvider, useTranslation } from 'react-i18next'
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
import { Help } from '../views/Help'
import { Unipass } from '../views/Unipass'
import { Apps } from '../views/Apps'
import { AddressCollector } from '../views/AddressCollector'
import { useToast } from '../hooks/useToast'
import { Collection } from '../views/Collection'
import { Claim } from '../views/Claim'
import { Issuer } from '../views/Issuer'
import { UnipassConfig } from '../utils'
import { Shop } from '../views/Shop'
import { Redeem } from '../views/Reedem'
import { RedeemDetail } from '../views/RedeemDetail'
import { HolderAddress } from '../views/HolderAddress'
import { WarningDialog } from '../components/WarningDialog'

const Alert: React.FC<AlertProps> = (props: AlertProps) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />
}

export enum RoutePath {
  Launch = '/',
  Login = '/login',
  Account = '/account',
  NFT = '/nft/:id',
  TokenClass = '/class/:id',
  NFTs = '/home',
  NotFound = '/404',
  Transfer = '/transfer/:id',
  Info = '/account/info',
  Transactions = '/account/tx',
  Profile = '/profile',
  ImagePreview = '/avatar/preview',
  TakePhoto = '/avatar/camera',
  Explore = '/explore',
  Help = '/help',
  Unipass = '/unipass',
  Apps = '/apps',
  License = '/license',
  Shop = '/shop',
  AddressCollector = '/addresses',
  Claim = '/claim',
  Collection = '/explore/collection',
  Issuer = '/issuer',
  Redeem = '/redeem',
  Holder = '/holder',
  HolderAddress = '/holder/address',
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

const allowWithoutAuthList = new Set([
  RoutePath.Unipass,
  RoutePath.Explore,
  RoutePath.Apps,
  RoutePath.AddressCollector,
  RoutePath.Claim,
  RoutePath.NotFound,
])

const forceAuthList = new Set([`${RoutePath.Explore}?tag=follow`])

const WalletChange: React.FC = ({ children }) => {
  const {
    address,
    prevAddress,
    walletType,
    isLogined,
    pubkey,
  } = useWalletModel()
  const history = useHistory()
  const location = useLocation()
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
  const { isAuthenticated, getAuth } = useProfileModel()
  const isSigning = useRef(false)
  const { toast, closeToast } = useToast()
  const [t] = useTranslation('translations')

  useEffect(() => {
    const pathInForceAuthList = forceAuthList.has(
      location.pathname + location.search
    )
    const pathInAllowList = [...allowWithoutAuthList].some((p) =>
      location.pathname.startsWith(p)
    )
    if (
      isLogined &&
      !isAuthenticated &&
      (!pathInAllowList || pathInForceAuthList) &&
      !isSigning.current
    ) {
      if (
        (WalletType.Unipass === walletType && pubkey) ||
        WalletType.Metamask === walletType
      ) {
        isSigning.current = true
        toast({
          title: t('auth.title'),
          content: t('auth.content'),
          okText: t('auth.ok'),
          showCloseIcon: false,
          show: true,
          onConfirm: () => {
            if (pathInForceAuthList && WalletType.Unipass === walletType) {
              UnipassConfig.setRedirectUri(location.pathname + location.search)
            }
            getAuth()
              .then(() => {
                if (WalletType.Metamask === walletType) {
                  closeToast()
                }
              })
              .catch(Boolean)
          },
        })
      }
    }
  }, [
    isAuthenticated,
    walletType,
    address,
    location.pathname,
    location.search,
    isLogined,
    pubkey,
    t,
    toast,
    closeToast,
    getAuth,
  ])

  return <>{children}</>
}

interface MibaoRouterProps extends RouteProps {
  key: string
  params?: string
  path: string
}

const routes: MibaoRouterProps[] = [
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
    component: AddressCollector,
    exact: true,
    key: 'Addresses',
    path: RoutePath.AddressCollector,
    params: '/:id',
  },
  {
    component: Explore,
    exact: true,
    key: 'Explore',
    path: RoutePath.Explore,
  },
  {
    component: Shop,
    exact: true,
    key: 'Shop',
    path: RoutePath.Shop,
  },
  {
    component: Help,
    exact: false,
    key: 'Help',
    path: RoutePath.Help,
  },
  {
    component: Help,
    exact: false,
    key: 'License',
    path: RoutePath.License,
  },
  {
    component: Unipass,
    exact: false,
    key: 'Unipass',
    path: RoutePath.Unipass,
  },
  {
    component: Apps,
    exact: true,
    key: 'Apps',
    path: RoutePath.Apps,
  },
  {
    component: Claim,
    exact: true,
    key: 'claim',
    path: RoutePath.Claim,
  },
  {
    component: Claim,
    exact: true,
    key: 'claim-with-id',
    path: RoutePath.Claim,
    params: '/:id',
  },
  {
    component: Collection,
    exact: true,
    key: 'Collection',
    path: RoutePath.Collection,
    params: '/:id',
  },
  {
    component: Redeem,
    exact: true,
    key: 'Redeem',
    path: RoutePath.Redeem,
  },
  {
    component: RedeemDetail,
    exact: false,
    key: 'ReedemDetail',
    path: RoutePath.Redeem,
    params: '/:id',
  },
  {
    component: Issuer,
    exact: true,
    key: 'Issuer',
    path: RoutePath.Issuer,
    params: '/:id',
  },
  {
    component: HolderAddress,
    exact: true,
    key: 'HolderAddress',
    path: RoutePath.HolderAddress,
    params: '/:address',
  },
  {
    component: NFTs,
    exact: true,
    key: 'Holder',
    path: RoutePath.Holder,
    params: '/:address',
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
  const { toastConfig } = useToast()
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
                <Route
                  {...route}
                  key={route.key}
                  path={`${route.path}${route.params ?? ''}`}
                />
              ))}
              <Redirect
                exact
                from={RoutePath.Launch}
                to={isLogined ? RoutePath.NFTs : RoutePath.Explore}
              />
              <Redirect
                exact
                from="/nfts"
                to={isLogined ? RoutePath.NFTs : RoutePath.Explore}
              />
              <Route component={NotFound} path="*" />
            </Switch>
            <WarningDialog />
            <ActionDialog
              icon={<FailSvg />}
              content={errorMsg}
              open={isErrorDialogOpen}
              onConfrim={() => setIsErrorDialogOpen(false)}
              onBackdropClick={() => setIsErrorDialogOpen(false)}
            />
            <ActionDialog
              icon={null}
              dialogTitle={toastConfig.title}
              content={toastConfig.content}
              open={toastConfig.show}
              okText={toastConfig.okText}
              showCloseIcon={toastConfig.showCloseIcon}
              onConfrim={toastConfig.onConfirm}
              onBackdropClick={toastConfig.onBackdropClick}
            />
            <Snackbar
              open={showEditSuccess}
              autoHideDuration={1500}
              onClose={closeSnackbar}
              style={{
                bottom: `${window.innerHeight / 2 + 16}px`,
              }}
            >
              <Alert
                style={{
                  borderRadius: '16px',
                  background: 'rgba(51, 51, 51, 0.692657)',
                  padding: '0px 40px',
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
