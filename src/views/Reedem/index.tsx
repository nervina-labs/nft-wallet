import React, { useCallback, useMemo, useState } from 'react'
import {
  Appbar,
  AppbarButton,
  AppbarSticky,
  HEADER_HEIGHT,
} from '../../components/Appbar'
import { ReactComponent as MyExchangeSvg } from '../../assets/svg/my-exchange.svg'
import styled from 'styled-components'
import { MainContainer } from '../../styles'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
import { useRouteQuery } from '../../hooks/useRouteQuery'
import { RoutePath } from '../../routes'
import { useInfiniteQuery } from 'react-query'
import { Query } from '../../models'
import { IS_WEXIN, PER_ITEM_LIMIT } from '../../constants'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Loading } from '../../components/Loading'
import { ReedemCard } from './RedeemCard'
import { Link } from 'react-router-dom'
import { SubmitInfo } from '../RedeemDetail/SubmitInfo'
import { RedeemListType } from '../../models/redeem'
import { useAccount, useAccountStatus, useAPI } from '../../hooks/useAccount'
import { Tab, TabList, Tabs } from '@mibao-ui/components'

export const RedeemContainer = styled(MainContainer)`
  display: flex;
  flex-direction: column;
  min-height: 100%;

  background: #f6f6f6;
  h4 {
    text-align: center;
    color: rgba(0, 0, 0, 0.6);
  }

  .list {
    flex: 1;
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

  const api = useAPI()
  const { isLogined } = useAccountStatus()
  const { address } = useAccount()

  const {
    data,
    status,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery(
    [`${Query.RedeemList}${isRedeemable.toString()}`, address, isRedeemable],
    async ({ pageParam = 1 }) => {
      const { data } = await api.getAllRedeemEvents(
        pageParam,
        isRedeemable ? RedeemListType.CanRedeem : RedeemListType.All
      )
      return data
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
      data?.pages.reduce((acc, token) => token.event_list.length + acc, 0) ?? 0
    )
  }, [data])

  return (
    <RedeemContainer>
      <AppbarSticky>
        <Appbar
          title={t('exchange.title')}
          onLeftClick={() => history.replace(RoutePath.Apps)}
          right={
            isLogined ? (
              <AppbarButton>
                <Link to={RoutePath.MyRedeem}>
                  <MyExchangeSvg />
                </Link>
              </AppbarButton>
            ) : (
              <div />
            )
          }
        />
      </AppbarSticky>
      <AppbarSticky top={`${HEADER_HEIGHT}px`} bg="white">
        <Tabs
          index={isRedeemable ? 1 : 0}
          colorScheme="black"
          align="space-around"
        >
          <TabList px="20px">
            <Tab onClick={() => tabOnClick('all')}>
              {t('exchange.tabs.all')}
            </Tab>
            <Tab onClick={() => tabOnClick('redeemable')}>
              {t('exchange.tabs.redeemable')}
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
                  {group.event_list.map((e, j: number) => {
                    return <ReedemCard item={e} key={`${i}+${j}`} />
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
      <SubmitInfo />
    </RedeemContainer>
  )
}
