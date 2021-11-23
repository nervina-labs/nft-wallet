import React, { useCallback, useMemo, useState } from 'react'
import { Appbar, AppbarSticky, HEADER_HEIGHT } from '../../components/Appbar'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
import { useRouteQuery } from '../../hooks/useRouteQuery'
import { RoutePath } from '../../routes'
import { useInfiniteQuery } from 'react-query'
import { Query } from '../../models'
import { IS_WEXIN, PER_ITEM_LIMIT } from '../../constants'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Loading } from '../../components/Loading'
import { RedeemCard } from './RedeemCard'
import { RedeemContainer } from '.'
import { RedeemListType } from '../../models/redeem'
import { useAccount, useAPI } from '../../hooks/useAccount'
import { Tab, TabList, Tabs } from '@mibao-ui/components'

export const MyRedeem: React.FC = () => {
  const { t } = useTranslation('translations')
  const history = useHistory()
  const isWait = !!useRouteQuery<string>('wait', '')
  const tabOnClick = useCallback(
    (type: 'all' | 'wait') => {
      if (type === 'all' && isWait) {
        history.replace(RoutePath.MyRedeem)
      }
      if (type === 'wait' && !isWait) {
        history.replace(RoutePath.MyRedeem + '?wait=true')
      }
    },
    [isWait, history]
  )

  const api = useAPI()
  const { address } = useAccount()

  const {
    data,
    status,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery(
    [`${Query.MyRedeemList}${isWait.toString()}`, address, isWait],
    async ({ pageParam = 1 }) => {
      const { data } = await api.getMyRedeemEvents(
        pageParam,
        isWait ? RedeemListType.UserWaitingRedeem : RedeemListType.UserRedeemed
      )

      return {
        ...data,
        record_list: data.record_list.map((d: any) => {
          return {
            ...d.event_info,
            ...d,
          }
        }),
      }
    },
    {
      getNextPageParam: (lastPage) => {
        if (lastPage?.meta == null) {
          return undefined
        }
        const { meta } = lastPage
        const current = meta.current_page
        const total = meta.total_count
        if (total <= current * PER_ITEM_LIMIT) {
          return undefined
        }
        return meta.current_page + 1
      },
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    }
  )

  const [isRefetching, setIsRefetching] = useState(false)
  const refresh = useCallback(async () => {
    setIsRefetching(true)
    await refetch()
    setIsRefetching(false)
  }, [refetch])

  const dataLength = useMemo(() => {
    return (
      data?.pages.reduce((acc, token) => token.record_list.length + acc, 0) ?? 0
    )
  }, [data])

  return (
    <RedeemContainer>
      <AppbarSticky>
        <Appbar
          title={t('exchange.mine.title')}
          onLeftClick={() => history.replace(RoutePath.Redeem)}
        />
      </AppbarSticky>
      <AppbarSticky top={`${HEADER_HEIGHT}px`} bg="white">
        <Tabs index={isWait ? 1 : 0} colorScheme="black" align="space-around">
          <TabList px="20px">
            <Tab onClick={() => tabOnClick('all')}>
              {t('exchange.mine.all')}
            </Tab>
            <Tab onClick={() => tabOnClick('wait')}>
              {t('exchange.mine.wait')}
            </Tab>
          </TabList>
        </Tabs>
      </AppbarSticky>
      <section className="list">
        {isRefetching ? <Loading /> : null}
        {data === undefined && status === 'loading' ? (
          <Loading />
        ) : (
          <InfiniteScroll
            pullDownToRefresh={!IS_WEXIN}
            refreshFunction={refresh}
            pullDownToRefreshContent={
              <h4>&#8595; {t('common.actions.pull-down-refresh')}</h4>
            }
            pullDownToRefreshThreshold={80}
            releaseToRefreshContent={
              <h4>&#8593; {t('common.actions.release-refresh')}</h4>
            }
            dataLength={dataLength}
            next={fetchNextPage}
            hasMore={hasNextPage === true}
            scrollThreshold="250px"
            loader={<Loading />}
            endMessage={
              <h4 className="end">
                {dataLength <= 3 ? ' ' : t('exchange.no-more')}
              </h4>
            }
          >
            {data?.pages?.map((group, i) => {
              return (
                <React.Fragment key={i}>
                  {group.record_list.map((e, j: number) => {
                    return <RedeemCard item={e} key={`${i}+${j}`} />
                  })}
                </React.Fragment>
              )
            })}
            {status === 'success' && dataLength === 0 ? (
              <h4>{t('exchange.empty')}</h4>
            ) : null}
          </InfiniteScroll>
        )}
      </section>
    </RedeemContainer>
  )
}
