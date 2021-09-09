import React, { useCallback, useMemo, useState } from 'react'
import { Appbar } from '../../components/Appbar'
import { ReactComponent as BackSvg } from '../../assets/svg/back.svg'
import { ReactComponent as MyExchangeSvg } from '../../assets/svg/my-exchange.svg'
import styled from 'styled-components'
import { MainContainer } from '../../styles'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
import { useRouteQuery } from '../../hooks/useRouteQuery'
import classNames from 'classnames'
import { RoutePath } from '../../routes'
import { useInfiniteQuery } from 'react-query'
import { Query } from '../../models'
import { useWalletModel } from '../../hooks/useWallet'
import { IS_WEXIN, PER_ITEM_LIMIT } from '../../constants'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Loading } from '../../components/Loading'
import { ReedemCard } from './RedeemEvent'

const Container = styled(MainContainer)`
  display: flex;
  flex-direction: column;

  background: #f6f6f6;
  h4 {
    text-align: center;
    color: rgba(0, 0, 0, 0.6);
  }
  .list {
    flex: 1;
  }
  .filters {
    margin-right: 15px;
    font-size: 14px;
    color: #333333;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    width: 100%;
    max-width: 500px;
    border-bottom: 1px solid #ececec;
    background-color: white;
    transition: all 0.3s;
    position: sticky;
    top: 0;
    z-index: 10;

    &.fixed {
      position: fixed;
      top: 0;
      justify-content: center;
      border-radius: 0;
      background: rgba(255, 255, 255, 0.9);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      backdrop-filter: blur(10px);
    }
    .filter {
      cursor: pointer;
      display: flex;
      flex-direction: column;
      position: relative;
      justify-content: center;
      align-items: center;
      margin-right: 48px;
      &:last-child {
        margin-right: 0;
      }
    }
    .active-line {
      background: #ff5c00;
      border-radius: 10px;
      height: 3px;
      width: 28px;
      position: relative;
      top: 1px;
    }
  }
`

export const Redeem: React.FC = () => {
  const { t } = useTranslation('translations')
  const history = useHistory()
  const isRedeemable = !!useRouteQuery<string>('redeemable', '')
  const tabOnClick = useCallback(
    (type: 'all' | 'redeemable') => {
      if (type === 'all' && isRedeemable) {
        history.push(RoutePath.Redeem)
      }
      if (type === 'redeemable' && !isRedeemable) {
        history.push(RoutePath.Redeem + '?redeemable=true')
      }
    },
    [isRedeemable, history]
  )

  const { address, api } = useWalletModel()

  const {
    data,
    status,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery(
    [`${Query.RedeemList}${isRedeemable.toString()}`, address, isRedeemable],
    async ({ pageParam = 1 }) => {
      return await api.getRedeemEvents(pageParam)
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
    <Container>
      <Appbar
        title={t('exchange.title')}
        left={<BackSvg onClick={() => history.goBack()} />}
        right={<MyExchangeSvg />}
      />
      <div className="filters">
        <div
          className={classNames('filter', { active: !isRedeemable })}
          onClick={() => tabOnClick('all')}
        >
          {t('exchange.tabs.all')}
          {!isRedeemable ? <span className="active-line" /> : null}
        </div>
        <div
          className={classNames('filter', { active: isRedeemable })}
          onClick={() => tabOnClick('redeemable')}
        >
          {t('exchange.tabs.redeemable')}
          {isRedeemable ? <span className="active-line" /> : null}
        </div>
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
    </Container>
  )
}
