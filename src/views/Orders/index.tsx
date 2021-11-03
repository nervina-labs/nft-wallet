import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Appbar, AppbarSticky, HEADER_HEIGHT } from '../../components/Appbar'
import { MainContainer } from '../../styles'
import { Tabs, Tab, TabList } from '@mibao-ui/components'
import { RoutePath } from '../../routes'
import { useHistory, useLocation, useRouteMatch } from 'react-router'
import { OrderList, MatchRoute } from './OrderList'

const Container = styled(MainContainer)`
  display: flex;
  flex-direction: column;
  height: 100%;
  .list {
    flex: 1;
    background: #eee;
    padding: 24px 20px;
    padding-top: 0;
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
        <Appbar title={t('orders.title')} />
      </AppbarSticky>
      <AppbarSticky top={`${HEADER_HEIGHT}px`}>
        <Tabs index={matchRoute} align="space-between" colorScheme="black">
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
    </Container>
  )
}
