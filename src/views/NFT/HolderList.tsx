import React from 'react'
import styled from 'styled-components'
import { Holder } from '../../components/Holder'
import { useInfiniteQuery } from 'react-query'
import { Query } from '../../models'
import { useWalletModel } from '../../hooks/useWallet'
import { TokenClassUuidHolder } from '../../models/holder'
import { Loading } from '../../components/Loading'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useTranslation } from 'react-i18next'
import { StatusText } from './StatusText'

const HolderItem = styled.div`
  width: 100%;
  display: flex;
  &:not(:last-child) {
    margin-bottom: 12px;
  }

  .id {
    margin-left: auto;
    color: #000000;
    font-size: 15px;
    line-height: 44px;
    font-weight: 500;
  }
`

export const TokenHolderList: React.FC<{
  id: string
  limit?: number
}> = ({ id, limit = 20 }) => {
  const { api } = useWalletModel()
  const { t } = useTranslation('translations')
  const {
    data,
    refetch,
    fetchNextPage,
    isLoading,
    isFetching,
    hasNextPage,
  } = useInfiniteQuery(
    [Query.NftHolderList, id, api],
    async ({ pageParam = 0 }) => {
      const result = await api.getHolderByTokenClassUuid(id, {
        page: pageParam,
        limit: limit,
      })
      return result.data
    },
    {
      getNextPageParam(lastPage) {
        return limit * lastPage.meta.current_page >= lastPage.meta.total_count
          ? undefined
          : lastPage.meta.current_page + 1
      },
      enabled: true,
      refetchOnMount: true,
    }
  )

  const holders =
    data?.pages.reduce(
      (acc, page) => acc.concat(page.token_holder_list),
      [] as TokenClassUuidHolder[]
    ) ?? []

  if (!holders.length && !isLoading && !isFetching) {
    return <StatusText>{t('nft.no-holder')}</StatusText>
  }

  return (
    <InfiniteScroll
      dataLength={holders.length}
      hasMore={hasNextPage === true}
      loader={<Loading />}
      refreshFunction={refetch}
      next={fetchNextPage}
      style={{ overflow: 'initial' }}
    >
      {holders.map((item, index) => (
        <HolderItem key={item.n_token_id ?? index}>
          <Holder
            key={item.n_token_id}
            username={item.holder_info.nickname}
            address={item.holder_info.address}
            avatar={item.holder_info.avatar_url}
            avatarType={item.holder_info.avatar_type}
          />
          <div className="id">#{item.n_token_id}</div>
        </HolderItem>
      ))}
      {isLoading && <Loading />}
    </InfiniteScroll>
  )
}
