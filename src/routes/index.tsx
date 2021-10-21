import React, { useEffect } from 'react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import { NotFound } from '../views/NotFound'
import i18n from '../i18n'
import { Comfirm } from '../components/Confirm'
import { WarningDialog } from '../components/WarningDialog'
import { ErrorToastDialog } from '../components/ErrorToast'
import { GlobalSnackbar } from '../components/GlobalSnackbar'
import { ConfirmToast } from '../components/ConfirmToast'
import {
  useAccount,
  useAccountStatus,
  useLogin,
  WalletType,
} from '../hooks/useAccount'
import { RoutePath } from './path'
import { AccountChange } from './AccountChange'
import { routes } from './routes'
import { RouterProvider } from '../hooks/useRoute'
export * from './path'

export const Routers: React.FC = () => {
  const { walletType } = useAccount()
  const { isLogined } = useAccountStatus()
  const { login } = useLogin()
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
          <AccountChange>
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
            <ErrorToastDialog />
            <ConfirmToast />
            <GlobalSnackbar />
            <Comfirm open disableBackdropClick />
          </AccountChange>
        </RouterProvider>
      </BrowserRouter>
    </I18nextProvider>
  )
}
