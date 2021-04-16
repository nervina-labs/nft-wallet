/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useCallback, useMemo, useState } from 'react'
import { useInfiniteQuery } from 'react-query'
import styled from 'styled-components'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Appbar } from '../../components/Appbar'
import { Card } from '../../components/Card'
import { PER_ITEM_LIMIT } from '../../constants'
import { useWalletModel } from '../../hooks/useWallet'
import { Query } from '../../models'
import { Empty } from './empty'
import { Loading } from '../../components/Loading'
import { Redirect } from 'react-router'
import { RoutePath } from '../../routes'

const Container = styled.main`
  display: flex;
  flex-direction: column;
  height: 100%;
  h4 {
    text-align: center;
    color: rgba(0, 0, 0, 0.6);
  }
  .list {
    flex: 1;
    background: linear-gradient(187.7deg, #ffffff 4.33%, #f0f0f0 94.27%);
  }
`

export const NFTs: React.FC = () => {
  const { api, isLogined } = useWalletModel()
  const {
    data,
    status,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery(
    Query.NFTList,
    async ({ pageParam = 1 }) => {
      const { data } = await api.getNFTs(pageParam)
      return data
    },
    {
      getNextPageParam: (lastPage) => {
        const { meta } = lastPage
        const current = meta.current_page
        const total = meta.total_count
        if (total <= current * PER_ITEM_LIMIT) {
          return undefined
        }
        return meta.current_page + 1
      },
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
      data?.pages.reduce((acc, token) => token.token_list.length + acc, 0) ?? 0
    )
  }, [data])

  if (!isLogined) {
    return <Redirect to={RoutePath.Login} />
  }

  return (
    <Container>
      <Appbar title="我的秘宝" />
      <section className="list">
        {isRefetching ? <Loading /> : null}
        {data === undefined && status === 'loading' ? (
          <Loading />
        ) : (
          <InfiniteScroll
            pullDownToRefresh
            refreshFunction={refresh}
            pullDownToRefreshContent={<h4>&#8595; 下拉刷新</h4>}
            pullDownToRefreshThreshold={80}
            releaseToRefreshContent={<h4>&#8593; 下拉刷新</h4>}
            dataLength={dataLength}
            next={fetchNextPage}
            hasMore={hasNextPage === true}
            scrollThreshold="200px"
            loader={<Loading />}
            endMessage={<h4>{dataLength <= 5 ? ' ' : '已经拉到底了'}</h4>}
          >
            {data?.pages?.map((group, i) => {
              return (
                <React.Fragment key={i}>
                  {group.token_list.map((token) => {
                    return <Card token={token} key={token.token_uuid} />
                  })}
                </React.Fragment>
              )
            })}
            {status === 'success' && dataLength === 0 ? <Empty /> : null}
          </InfiniteScroll>
        )}
      </section>
    </Container>
  )
}
