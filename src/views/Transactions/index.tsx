/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react'
import styled from 'styled-components'
import { useInfiniteQuery } from 'react-query'
import { useWalletModel } from '../../hooks/useWallet'
import {
  Query,
  TransactionDirection,
  TransactionStatus,
  Tx,
} from '../../models'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Divider } from '@material-ui/core'
import { ReactComponent as SendSvg } from '../../assets/svg/send.svg'
import { ReactComponent as ReceiveSvg } from '../../assets/svg/receive.svg'
import { ReactComponent as PendingSvg } from '../../assets/svg/pending.svg'
import { truncateMiddle } from '../../utils'
import { PER_ITEM_LIMIT } from '../../constants'
import { Loading } from '../../components/Loading'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  h4 {
    text-align: center;
    color: rgba(0, 0, 0, 0.6);
  }

  .list {
    margin-top: 16px;
  }
`

const ListItemContainer = styled.div`
  display: flex;
  height: 75px;
  border-bottom: 1px dashed rgba(0, 0, 0, 0.2);
  align-items: center;
  margin: 0 16px;
  .icon {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .content {
    height: 42px;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    font-weight: 600;
    font-size: 12px;
    line-height: 17px;
    color: #000000;
    margin-left: 12px;
    flex: 1;
  }
  .time {
    margin-left: auto;
    font-size: 12px;
    line-height: 16px;
    color: rgba(0, 0, 0, 0.6);
  }
`

const ListItem: React.FC<{ tx: Tx }> = ({ tx }) => {
  let icon =
    tx.tx_direction === TransactionDirection.Receive ? (
      <ReceiveSvg />
    ) : (
      <SendSvg />
    )
  if (tx.tx_state === TransactionStatus.Pending) {
    icon = <PendingSvg />
  }
  return (
    <ListItemContainer>
      <div className="icon">{icon}</div>
      <div className="content">
        <span>
          {tx.tx_direction === TransactionDirection.Receive
            ? '接收秘宝'
            : '发送秘宝'}
        </span>
        <span>
          {tx.tx_direction === TransactionDirection.Receive
            ? `至 ${truncateMiddle(tx.to_address, 10, 6)}`
            : `自 ${truncateMiddle(tx.from_address, 10, 6)}`}
        </span>
      </div>
      <div className="time">2021-11-10, 12:12:12</div>
    </ListItemContainer>
  )
}

export const Transactions: React.FC = () => {
  const { api } = useWalletModel()
  const { data, status, hasNextPage, fetchNextPage } = useInfiniteQuery(
    Query.Transactions,
    async ({ pageParam = 1 }) => {
      const { data } = await api.getTransactions(pageParam)
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
  return (
    <Container>
      {status === 'loading' && data === undefined ? (
        <Loading />
      ) : (
        <section className="list">
          <Divider />
          <InfiniteScroll
            dataLength={data!.pages.reduce(
              (acc, tx) => tx.transaction_list.length + acc,
              0
            )}
            next={fetchNextPage}
            hasMore={hasNextPage!}
            scrollThreshold="200px"
            loader={<Loading />}
            endMessage={<h4>已经拉到底了</h4>}
          >
            {data?.pages?.map((group, i) => {
              return (
                <React.Fragment key={i}>
                  {group.transaction_list.map((tx) => {
                    return <ListItem tx={tx} key={tx.tx_hash} />
                  })}
                </React.Fragment>
              )
            })}
          </InfiniteScroll>
        </section>
      )}
    </Container>
  )
}
