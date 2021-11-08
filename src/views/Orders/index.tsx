import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Appbar, AppbarSticky, HEADER_HEIGHT } from '../../components/Appbar'
import { MainContainer } from '../../styles'
import { Tabs, Tab, TabList } from '@mibao-ui/components'
import { RoutePath } from '../../routes'
import { useHistory, useLocation, useRouteMatch } from 'react-router'
import { OrderList, MatchRoute } from './OrderList'
import { OrderDrawer } from '../../components/OrderDrawer'
import { Contact } from '../../components/Contact'

const Container = styled(MainContainer)`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  .list {
    flex: 1;
    background: #f7f7f7;
    padding: 24px 20px;
    padding-bottom: 0;
  }
`

export const Orders: React.FC = () => {
  const [t] = useTranslation('translations')
  const matchAllOrders = useRouteMatch(RoutePath.Orders)
  const matchPlacedOrders = useRouteMatch(RoutePath.PlacedOrders)
  const matchPaidOrders = useRouteMatch(RoutePath.PaidOrders)
  const matchDoneOrders = useRouteMatch(RoutePath.DoneOrders)

  const matchRoute: MatchRoute = [
    matchAllOrders?.isExact,
    matchPlacedOrders?.isExact,
    matchPaidOrders?.isExact,
    matchDoneOrders?.isExact,
  ].findIndex((b) => b)

  const history = useHistory()
  const location = useLocation()

  const go = useCallback(
    (path: RoutePath) => {
      return () => {
        if (location.pathname === path) {
          return
        }
        history.replace(path)
      }
    },
    [history, location.pathname]
  )

  return (
    <Container>
      <AppbarSticky>
        <Appbar
          title={t('orders.title')}
          onLeftClick={() => history.replace(RoutePath.NFTs)}
        />
      </AppbarSticky>
      <AppbarSticky top={`${HEADER_HEIGHT}px`}>
        <Tabs
          index={matchRoute}
          align="space-between"
          colorScheme="black"
          bg="white"
        >
          <TabList px="20px">
            <Tab onClick={go(RoutePath.Orders)}>{t('orders.tabs.all')}</Tab>
            <Tab onClick={go(RoutePath.PlacedOrders)}>
              {t('orders.tabs.placed')}
            </Tab>
            <Tab onClick={go(RoutePath.PaidOrders)}>
              {t('orders.tabs.paid')}
            </Tab>
            <Tab onClick={go(RoutePath.DoneOrders)}>
              {t('orders.tabs.done')}
            </Tab>
          </TabList>
        </Tabs>
      </AppbarSticky>
      <section className="list">
        <OrderList route={matchRoute} />
      </section>
      <OrderDrawer />
      <Contact />
    </Container>
  )
}
