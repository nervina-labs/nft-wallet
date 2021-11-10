import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Redirect } from 'react-router'
import { InfiniteList, ListDesciption } from '../../components/InfiniteList'
import { useAccount, useAccountStatus, useAPI } from '../../hooks/useAccount'
import { useGetAndSetAuth } from '../../hooks/useProfile'
import { Query } from '../../models'
import { OrderState } from '../../models/order'
import { RoutePath } from '../../routes'
import { OrderCard } from './OrderCard'

export enum MatchRoute {
  All = 0,
  Placed = 1,
  Paid = 2,
  Done = 3,
}

export const OrderStates: Record<MatchRoute, OrderState | undefined> = {
  [MatchRoute.All]: undefined,
  [MatchRoute.Placed]: OrderState.OrderPlaced,
  [MatchRoute.Paid]: OrderState.Paid,
  [MatchRoute.Done]: OrderState.Done,
}

export interface OrderListProps {
  route: MatchRoute
}

export const OrderList: React.FC<OrderListProps> = ({ route }) => {
  const [t] = useTranslation('translations')
  const api = useAPI()
  const getAuth = useGetAndSetAuth()
  const getRemoteData = useCallback(
    async ({ pageParam = 1 }) => {
      const auth = await getAuth()
      const { data } = await api.getOrders(pageParam, auth, OrderStates[route])
      return data
    },
    [api, route, getAuth]
  )
  const { address } = useAccount()
  const { isLogined } = useAccountStatus()

  if (!isLogined) {
    return <Redirect to={RoutePath.Login} />
  }
  return (
    <InfiniteList
      queryFn={getRemoteData}
      queryKey={[Query.OrderList, route, address]}
      noMoreElement={t('orders.no-more')}
      emptyElement={<ListDesciption>{t('orders.no-data')}</ListDesciption>}
      calcDataLength={(data) => {
        return (
          data?.pages.reduce(
            (acc, token) => token.token_orders.length + acc,
            0
          ) ?? 0
        )
      }}
      renderItems={(group, i) => {
        return group.token_orders.map((order, j: number) => {
          return (
            <OrderCard order={order} key={order.uuid || `${i}.${j}`} isInList />
          )
        })
      }}
    />
  )
}
