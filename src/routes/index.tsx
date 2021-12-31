import React, { useEffect, useMemo } from 'react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import { NotFound } from '../views/NotFound'
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
import { ConfirmDialog } from '../components/ConfirmDialog'
import { LoadableComponent } from '../components/GlobalLoader'
import { MibaoProvider, mibaoTheme } from '@mibao-ui/components'
import { extendTheme } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import NFTFallbackImg from '../assets/img/nft-fallback.png'
import { PwaGuide } from '../components/PwaGuide'
import { HiddenBarContainer } from '../components/HiddenBar'
export * from './path'

export const Routers: React.FC = () => {
  const { t } = useTranslation('translations')
  const { walletType } = useAccount()
  const { isLogined } = useAccountStatus()
  const { login } = useLogin()
  useEffect(() => {
    if (isLogined && walletType && walletType === WalletType.Metamask) {
      login(walletType).catch((e) => {
        console.error('login-error', e)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const theme = useMemo(() => {
    const font = `"PingFang SC", Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
      "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
      sans-serif`

    return extendTheme(mibaoTheme, {
      locales: {
        issuer: {
          banned: t('common.baned.issuer'),
        },
        nft: {
          banned: t('common.baned.nft'),
          cardBackTooltips: t('common.card-back'),
          limited: t('common.limit.limit'),
          unlimited: t('common.limit.unlimit'),
        },
      },
      fallbacks: {
        nft: NFTFallbackImg,
      },
      fonts: {
        body: font,
      },
      colors: {
        process: {
          500: '#02C2C6',
        },
      },
    })
  }, [t])

  return (
    <MibaoProvider theme={theme}>
      <BrowserRouter>
        <RouterProvider>
          <AccountChange>
            <LoadableComponent>
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
                <Route path="/alipay.htm" />
                <Route component={NotFound} path="*" />
              </Switch>
            </LoadableComponent>
            <ConfirmDialog />
            <HiddenBarContainer />
          </AccountChange>
        </RouterProvider>
      </BrowserRouter>
      <PwaGuide />
    </MibaoProvider>
  )
}
