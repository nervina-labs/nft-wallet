import React from 'react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import { NotFound } from '../views/NotFound'
import i18n from '../i18n'
import { Comfirm } from '../components/Confirm'
import { WarningDialog } from '../components/WarningDialog'
import { ErrorToastDialog } from '../components/ErrorToast'
import { GlobalSnackbar } from '../components/GlobalSnackbar'
import { ConfirmToast } from '../components/ConfirmToast'
import { RoutePath } from './path'
import { routes } from './routes'
import { RouterProvider } from '../hooks/useRoute'
export * from './path'

export const Routers: React.FC = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <RouterProvider>
          <Switch>
            {routes.map((route) => (
              <Route
                {...route}
                key={route.key}
                path={`${route.path}${route.params ?? ''}`}
              />
            ))}
            <Redirect exact from={RoutePath.Launch} to={RoutePath.NFTs} />
            <Redirect exact from="/nfts" to={RoutePath.NFTs} />
            <Route component={NotFound} path="*" />
          </Switch>
          <WarningDialog />
          <ErrorToastDialog />
          <ConfirmToast />
          <GlobalSnackbar />
          <Comfirm open disableBackdropClick />
        </RouterProvider>
      </BrowserRouter>
    </I18nextProvider>
  )
}
