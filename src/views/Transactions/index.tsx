/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useInfiniteQuery } from 'react-query'
import { useWalletModel } from '../../hooks/useWallet'
import {
  Query,
  TransactionDirection,
  TransactionStatus,
  Tx,
} from '../../models'
import dayjs from 'dayjs'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Divider } from '@material-ui/core'
import { ReactComponent as SendSvg } from '../../assets/svg/send.svg'
import { ReactComponent as ReceiveSvg } from '../../assets/svg/receive.svg'
import { ReactComponent as LinkSvg } from '../../assets/svg/link.svg'
import { truncateMiddle } from '../../utils'
import { NFT_EXPLORER_URL, PER_ITEM_LIMIT } from '../../constants'
import { Loading } from '../../components/Loading'
import pendingSrc from '../../assets/img/pending.png'

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
    img {
      width: 16px;
      height: 16px;
    }
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
  .link {
    margin-left: 12px;
  }
`

const TIME_FORMAT = 'YYYY-MM-DD, HH:mm:ss'
const ListItem: React.FC<{ tx: Tx }> = ({ tx }) => {
  let icon =
    tx.tx_direction === TransactionDirection.Receive ? (
      <ReceiveSvg />
    ) : (
      <SendSvg />
    )
  if (tx.tx_state !== TransactionStatus.Committed) {
    icon = <img src={pendingSrc as any} alt="pending" />
  }
  const time =
    tx.on_chain_timestamp === null
      ? '等待中'
      : dayjs(Number(tx.on_chain_timestamp + '000')).format(TIME_FORMAT)
  return (
    <ListItemContainer>
      <div className="icon">{icon}</div>
      <div className="content">
        <span>{tx.class_name}</span>
        <span>
          {tx.tx_direction === TransactionDirection.Receive
            ? `发送至 ${truncateMiddle(tx.to_address, 8, 5)}`
            : `接收自 ${truncateMiddle(tx.from_address, 8, 5)}`}
        </span>
      </div>
      <div className="time">{time}</div>
      <a
        className="link"
        target="_blank"
        rel="noopener noreferrer"
        href={`${NFT_EXPLORER_URL}/transaction/${tx.uuid}`}
      >
        <LinkSvg />
      </a>
    </ListItemContainer>
  )
}

export const Transactions: React.FC = () => {
  const { api } = useWalletModel()
  const {
    data,
    status,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery(
    Query.Transactions,
    async ({ pageParam = 1 }) => {
      const { data } = await api.getTransactions(pageParam)
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
      data?.pages.reduce((acc, tx) => tx.transaction_list.length + acc, 0) ?? 0
    )
  }, [data])

  return (
    <Container>
      <section className="list" id="list">
        <Divider />
        {isRefetching ? <Loading /> : null}
        {status === 'loading' && data === undefined ? (
          <Loading />
        ) : (
          <InfiniteScroll
            dataLength={data!.pages.reduce(
              (acc, tx) => tx.transaction_list.length + acc,
              0
            )}
            pullDownToRefresh
            refreshFunction={refresh}
            next={fetchNextPage}
            hasMore={hasNextPage === true}
            pullDownToRefreshContent={<h4>&#8595; 下拉刷新</h4>}
            pullDownToRefreshThreshold={80}
            releaseToRefreshContent={<h4>&#8593; 下拉刷新</h4>}
            scrollThreshold="200px"
            loader={<Loading />}
            endMessage={dataLength <= 9 ? null : <h4>已经拉到底了</h4>}
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
            {status === 'success' && dataLength === 0 ? (
              <h4>还没有交易...</h4>
            ) : null}
          </InfiniteScroll>
        )}
      </section>
    </Container>
  )
}
