import React, { useCallback, useMemo, useState } from 'react'
import { Grid } from '@mibao-ui/components'
import {
  InfiniteData,
  QueryFunction,
  QueryKey,
  UseInfiniteQueryOptions,
  useInfiniteQuery,
} from 'react-query'
import { IS_WEXIN, PER_ITEM_LIMIT } from '../../constants'
import { Virtuoso } from 'react-virtuoso'
import styled from 'styled-components'
import { Loading } from '../Loading'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useTranslation } from 'react-i18next'

const Tips = styled.div`
  width: 100%;
  color: rgba(0, 0, 0, 0.6);
  text-align: center;
  margin: 16px 0;
  opacity: ${(props: { hide?: boolean }) => (props.hide ? 0 : 1)};
`
export interface InfiniteListProps<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
> {
  queryKey: TQueryKey
  queryFn: QueryFunction<TQueryFnData, TQueryKey>
  /* eslint-disable @typescript-eslint/indent */
  queryOptions?: UseInfiniteQueryOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryFnData,
    TQueryKey
  >
  emptyElement?: React.ReactNode
  noMoreElement: React.ReactNode
  loader?: React.ReactNode
  pullDownToRefreshContent?: React.ReactNode
  releaseToRefreshContent?: React.ReactNode
  scrollThreshold?: string
  pullDownToRefreshThreshold?: number
  calcDataLength: (data?: InfiniteData<TData>) => number
  onDataChange?: (data?: InfiniteData<TData>) => void
  renderItems: (item: TData, index: number) => React.ReactNode
  enableQuery?: boolean
  itemLimit?: number
  columnCount?: number
}

export function InfiniteListNext<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>({
  queryFn,
  queryKey,
  queryOptions,
  emptyElement,
  noMoreElement,
  calcDataLength,
  renderItems,
  onDataChange,
  loader,
  pullDownToRefreshContent,
  releaseToRefreshContent,
  scrollThreshold = '250px',
  pullDownToRefreshThreshold = 80,
  enableQuery,
  itemLimit = PER_ITEM_LIMIT,
  columnCount = 1,
}: InfiniteListProps<TQueryFnData, TError, TData, TQueryKey>) {
  const [t] = useTranslation('translations')
  const {
    data,
    status,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery(queryKey, queryFn, {
    getNextPageParam: (lastPage: any) => {
      if (lastPage?.meta == null) {
        return undefined
      }
      const { meta } = lastPage
      const current = meta.current_page
      const total = meta.total_count
      if (total <= current * itemLimit) {
        return undefined
      }
      return meta.current_page + 1
    },
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...queryOptions,
    enabled: enableQuery,
  })
  const dataLength = useMemo(() => calcDataLength(data), [data, calcDataLength])

  const elements: React.ReactNode[] = useMemo(
    () => data?.pages.map((page, i) => renderItems(page, i)).flat() ?? [],
    [data?.pages, renderItems]
  )

  const columns: React.ReactNode[][] = useMemo(
    () =>
      elements.reduce<React.ReactNode[][]>((acc, child, i) => {
        acc[i % columnCount] = [...acc[i % columnCount], child]
        return acc
      }, new Array(columnCount).fill([])) ?? [],
    [columnCount, elements]
  )

  const [isRefetching, setIsRefetching] = useState(false)
  const refresh = useCallback(async () => {
    setIsRefetching(true)
    await refetch()
    setIsRefetching(false)
  }, [refetch])

  return (
    <>
      {isRefetching ? <Loading /> : null}
      {data === undefined && status === 'loading' ? (
        <Loading />
      ) : (
        <InfiniteScroll
          pullDownToRefresh={!IS_WEXIN}
          refreshFunction={refresh}
          pullDownToRefreshContent={
            pullDownToRefreshContent ?? (
              <Tips>&#8595; {t('common.actions.pull-down-refresh')}</Tips>
            )
          }
          pullDownToRefreshThreshold={pullDownToRefreshThreshold}
          releaseToRefreshContent={
            releaseToRefreshContent ?? (
              <Tips>&#8593; {t('common.actions.release-refresh')}</Tips>
            )
          }
          dataLength={dataLength}
          next={fetchNextPage}
          hasMore={hasNextPage === true}
          scrollThreshold={scrollThreshold}
          loader={loader ?? <Loading />}
          endMessage={<Tips>{dataLength <= 5 ? ' ' : noMoreElement}</Tips>}
        >
          <Grid templateColumns="repeat(2, 1fr)" gap="10px">
            {columns.map((column) => (
              <Virtuoso
                useWindowScroll
                data={column}
                itemContent={(index) => column[index]}
              />
            ))}
          </Grid>
          {status === 'success' && dataLength === 0
            ? emptyElement ?? <Tips>{t('issuer.no-data')}</Tips>
            : null}
        </InfiniteScroll>
      )}
    </>
  )
}
