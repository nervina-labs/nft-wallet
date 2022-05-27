/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useInfiniteQuery } from 'react-query'
import {
  Query,
  TransactionDirection,
  TransactionStatus,
  Tx,
} from '../../models'
import dayjs from 'dayjs'
import InfiniteScroll from 'react-infinite-scroll-component'
import { ReactComponent as ExplorerSvg } from '../../assets/svg/explorer.svg'
import { truncateMiddle } from '../../utils'
import { IS_WEXIN, NFT_EXPLORER_URL, PER_ITEM_LIMIT } from '../../constants'
import { Loading } from '../../components/Loading'
import SendPng from '../../assets/img/send.png'
import ReceivePng from '../../assets/img/receive.png'
import { useTranslation } from 'react-i18next'
import { ReactComponent as VipSvg } from '../../assets/svg/vip.svg'
import { ReactComponent as NoDataSvg } from '../../assets/svg/no-records.svg'
import { useAPI } from '../../hooks/useAccount'
import { Flex, Text, Tooltip } from '@mibao-ui/components'
import { MainContainer } from '../../styles'
import { Appbar, AppbarSticky } from '../../components/Appbar'
import { useHistory } from 'react-router'
import { RoutePath } from '../../routes'
import { Center } from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'

const Container = styled(MainContainer)`
  display: flex;
  flex-direction: column;
  width: 100%;

  .list {
    flex: 1;
  }
  h4 {
    text-align: center;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.6);
  }

  .no-data {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 300px;
  }
`

const ListItemContainer = styled.div`
  display: flex;
  height: 80px;
  align-items: center;
  background: #ffffff;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  margin: 20px 15px;
  &.first {
    margin-top: 5px;
  }
  .icon {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 15px;
    img {
      width: 42px;
      height: 42px;
    }
  }
  .error {
    color: #d03a3a;
  }
  .content {
    height: 42px;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    font-size: 12px;
    line-height: 17px;
    color: #0e0e0e;
    margin-left: 10px;
    overflow: hidden;
    margin-right: 4px;
    flex: 1;
    span {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .creator {
      font-weight: normal;
      font-size: 10px;
      display: flex;
      align-items: center;
      .vip {
        width: 13px;
        min-width: 13px;
        height: 13px;
        margin-left: 4px;
        cursor: pointer;
      }
    }
  }
  .status {
    margin-left: auto;
    font-size: 10px;
    line-height: 16px;
    height: 42px;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    .time {
      color: rgba(0, 0, 0, 0.6);
    }
    .waiting {
      font-weight: bold;
      color: #fd821f;
    }
    .confirming {
      text-align: right;
      font-weight: bold;
      color: #779be3;
    }
  }
  .link {
    margin: 0 8px;
  }
`

const DAY_FORMAT_CN = 'YYYY-MM-DD'
const DAY_FORMAT_EN = 'MMM DD, YYYY'
const TIME_FORMAT = 'HH:mm:ss'

interface ListItemProps {
  tx: Tx
  className?: string
}

const ListItem: React.FC<ListItemProps> = ({ tx, className }) => {
  const [t, i18n] = useTranslation('translations')
  const isBanned = tx.is_class_banned || tx.is_issuer_banned
  const icon = useMemo(() => {
    if (tx.tx_state === TransactionStatus.Rejected) {
      return (
        <Center w="42px" h="42px" rounded="100%" bg="#f5f5f5">
          <CloseIcon color="red.500" />
        </Center>
      )
    }
    if (tx.tx_direction === TransactionDirection.Receive) {
      return <img src={ReceivePng} />
    }
    return <img src={SendPng} />
  }, [tx.tx_direction])

  const vipTitle = tx?.verified_info?.verified_title
  const vt = useMemo(() => {
    if (vipTitle) {
      return t('common.vip.weibo', { title: vipTitle })
    }
    return t('common.vip.weibo-no-desc')
  }, [t, vipTitle])
  const creator = useMemo(() => {
    if (tx.is_issuer_banned) {
      return (
        <>
          {tx.tx_direction === TransactionDirection.Receive
            ? t('transactions.receive-from')
            : t('transactions.send-to')}
          &nbsp;
          {!tx.from_address && !tx.to_address ? (
            <span className="error">{t('common.baned.issuer')}</span>
          ) : null}
          {tx.from_address && tx.tx_direction === TransactionDirection.Receive
            ? truncateMiddle(tx.from_address, 5, 5)
            : null}
          {tx.to_address && tx.tx_direction === TransactionDirection.Send
            ? truncateMiddle(tx.to_address, 5, 5)
            : null}
        </>
      )
    }
    return tx.tx_direction === TransactionDirection.Receive ? (
      <>
        <span>{`${t('transactions.receive-from')} ${
          tx.issuer_uuid
            ? tx.from_address
            : truncateMiddle(tx.from_address, 5, 5)
        }`}</span>
        {tx?.verified_info?.is_verified && tx.issuer_uuid !== '' ? (
          <Tooltip label={vt} placement="top">
            <VipSvg className="vip" />
          </Tooltip>
        ) : null}
      </>
    ) : (
      `${t('transactions.send-to')} ${truncateMiddle(tx.to_address, 5, 5)}`
    )
  }, [tx, t, vt])

  const Link = isBanned ? 'div' : 'a'

  const isConfirming = useMemo(() => {
    return (
      tx.tx_state === TransactionStatus.Submitting &&
      tx.on_chain_timestamp != null
    )
  }, [tx.tx_state, tx.on_chain_timestamp])
  console.log(tx.tx_state)

  const dayInst = dayjs(Number(tx.on_chain_timestamp + '000'))
  return (
    <ListItemContainer className={className}>
      <div className="icon">{icon}</div>
      <div className="content">
        <span className={`name ${isBanned ? 'error' : ''}`}>
          {isBanned ? t('common.baned.nft') : tx.class_name}
        </span>
        <span className="creator">{creator}</span>
      </div>
      <div
        className="status"
        style={{ justifyContent: isConfirming ? 'space-between' : 'center' }}
      >
        {tx.tx_state === TransactionStatus.Pending ? (
          <span className="waiting">{t('transactions.status.waiting')}</span>
        ) : null}
        {tx.tx_state === TransactionStatus.Submitting ? (
          <span className="confirming">
            {t('transactions.status.confirming')}
          </span>
        ) : null}
        {tx.on_chain_timestamp != null ? (
          <Flex
            justifyContent="space-between"
            flexDirection="column"
            textAlign="right"
            color="#999"
          >
            <Text>
              {dayInst.format(
                i18n.language !== 'en' ? DAY_FORMAT_CN : DAY_FORMAT_EN
              )}
            </Text>
            <Text>{dayInst.format(TIME_FORMAT)}</Text>
          </Flex>
        ) : null}
      </div>
      <Link
        className="link"
        target="_blank"
        rel="noopener noreferrer"
        href={`${NFT_EXPLORER_URL}/transaction/${tx.uuid}`}
      >
        <ExplorerSvg />
      </Link>
    </ListItemContainer>
  )
}

export const Transactions: React.FC = () => {
  const api = useAPI()
  const { t } = useTranslation('translations')
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
      return {
        ...data,
        transaction_list: data.transaction_list.sort((a, b) => {
          if (a.on_chain_timestamp === null) {
            return 1
          }
          if (b.on_chain_timestamp === null) {
            return 1
          }
          return Number(b.on_chain_timestamp) - Number(a.on_chain_timestamp)
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

  const history = useHistory()

  return (
    <Container>
      <AppbarSticky>
        <Appbar
          onLeftClick={() => {
            history.push(RoutePath.NFTs)
          }}
          title={t('account.transactions')}
        />
      </AppbarSticky>
      <section className="list">
        {isRefetching ? <Loading /> : null}
        {status === 'loading' && data === undefined ? (
          <Loading />
        ) : (
          <InfiniteScroll
            dataLength={data!.pages.reduce(
              (acc, tx) => tx.transaction_list.length + acc,
              0
            )}
            pullDownToRefresh={!IS_WEXIN}
            refreshFunction={refresh}
            next={fetchNextPage}
            hasMore={hasNextPage === true}
            pullDownToRefreshContent={
              <h4>&#8595; {t('common.actions.pull-down-refresh')}</h4>
            }
            pullDownToRefreshThreshold={80}
            releaseToRefreshContent={
              <h4>&#8593; {t('common.actions.release-refresh')}</h4>
            }
            scrollThreshold="300px"
            loader={<Loading />}
            endMessage={
              <h4>{dataLength <= 5 ? '' : t('transactions.no-data')}</h4>
            }
          >
            {data?.pages?.map((group, i) => {
              return (
                <React.Fragment key={i}>
                  {group.transaction_list.map((tx, j) => {
                    return (
                      <ListItem
                        tx={tx}
                        key={tx.uuid ?? `${i}${j}`}
                        className={i === 0 && j === 0 ? 'first' : ''}
                      />
                    )
                  })}
                </React.Fragment>
              )
            })}
            {status === 'success' && dataLength === 0 ? (
              <div className="no-data">
                <NoDataSvg />
                <Text color="gray.500" fontSize="14px">
                  {t('transactions.no-data')}
                </Text>
              </div>
            ) : null}
          </InfiniteScroll>
        )}
      </section>
    </Container>
  )
}
