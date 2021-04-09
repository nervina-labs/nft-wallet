/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useMemo } from 'react'
import { useInfiniteQuery } from 'react-query'
import styled from 'styled-components'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Appbar } from '../../components/Appbar'
import { Card } from '../../components/Card'
import { PER_ITEM_LIMIT } from '../../constants'
import { useWalletModel } from '../../hooks/useWallet'
import { Query } from '../../models'
import { Empty } from './empty'
import { CircularProgress } from '@material-ui/core'

const Container = styled.main`
  display: flex;
  flex-direction: column;
  h4 {
    text-align: center;
    color: rgba(0, 0, 0, 0.6);
  }
`

export const NFTs: React.FC = () => {
  const { api } = useWalletModel()
  const { data, status, hasNextPage, fetchNextPage } = useInfiniteQuery(
    Query.NFTList,
    async ({ pageParam = 1 }) => {
      const { data } = await api.getNFTs(pageParam)
      return data
    },
    {
      getNextPageParam: (lastPage) => {
        const { meta } = lastPage
        const current = meta.current_page
        const total = meta.token_count
        if (total <= current * PER_ITEM_LIMIT) {
          return undefined
        }
        return meta.current_page + 1
      },
    }
  )

  const dataLength = useMemo(() => {
    return (
      data?.pages.reduce((acc, token) => token.token_list.length + acc, 0) ?? 0
    )
  }, [data])
  return (
    <Container>
      <Appbar title="我的秘宝" />
      {status === 'success' && dataLength === 0 ? <Empty /> : null}
      {data === undefined && status === 'loading' ? (
        <h4>
          加载中...
          <CircularProgress size="1em" style={{ marginLeft: '10px' }} />
        </h4>
      ) : (
        <InfiniteScroll
          dataLength={dataLength}
          next={fetchNextPage}
          hasMore={hasNextPage!}
          scrollThreshold="200px"
          loader={
            <h4>
              加载中...
              <CircularProgress size="1em" style={{ marginLeft: '10px' }} />
            </h4>
          }
          endMessage={<h4>已经拉到底了</h4>}
        >
          {data?.pages?.map((group, i) => {
            return (
              <React.Fragment key={i}>
                {group.token_list.map((token) => {
                  return <Card token={token} key={token.token_id} />
                })}
              </React.Fragment>
            )
          })}
        </InfiniteScroll>
      )}
    </Container>
  )
}
