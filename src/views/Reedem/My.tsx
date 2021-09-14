import React, { useCallback, useMemo, useState } from 'react'
import { Appbar } from '../../components/Appbar'
import { ReactComponent as BackSvg } from '../../assets/svg/back.svg'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
import { useRouteQuery } from '../../hooks/useRouteQuery'
import { RoutePath } from '../../routes'
import { useInfiniteQuery } from 'react-query'
import { Query } from '../../models'
import { useWalletModel } from '../../hooks/useWallet'
import { IS_WEXIN, PER_ITEM_LIMIT } from '../../constants'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Loading } from '../../components/Loading'
import { ReedemCard } from './RedeemEvent'
import { Tab, Tabs } from '../../components/Tab'
import { RedeemContainer } from '.'

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

  const { address, api } = useWalletModel()

  const {
    data,
    status,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery(
    [`${Query.MyRedeemList}${isWait.toString()}`, address, isWait],
    async ({ pageParam = 1 }) => {
      return await api.getMyRedeemEvents(pageParam)
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
      refetchOnMount: false,
    }
  )

  const [isRefetching, setIsRefetching] = useState(false)
  const refresh = useCallback(async () => {
    setIsRefetching(true)
    await refetch()
    setIsRefetching(false)
  }, [refetch])

  const dataLength = useMemo(() => {
    return data?.pages.reduce((acc, token) => token.events.length + acc, 0) ?? 0
  }, [data])

  return (
    <RedeemContainer>
      <Appbar
        title={t('exchange.mine.title')}
        left={<BackSvg onClick={() => history.replace(RoutePath.Apps)} />}
        right={<div />}
      />
      <div className="tabs">
        <Tabs activeKey={isWait ? 1 : 0}>
          <Tab
            className="tab"
            active={!isWait}
            onClick={() => tabOnClick('all')}
          >
            {t('exchange.mine.all')}
          </Tab>
          <Tab
            className="tab"
            active={isWait}
            onClick={() => tabOnClick('wait')}
          >
            {t('exchange.mine.wait')}
          </Tab>
        </Tabs>
      </div>
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
                  {group.events.map((e, j: number) => {
                    return <ReedemCard item={e} />
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
