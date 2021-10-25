import React, { useMemo, useRef } from 'react'
import { Grid } from '@mibao-ui/components'
import {
  InfiniteData,
  QueryFunction,
  QueryKey,
  UseInfiniteQueryOptions,
  useInfiniteQuery,
} from 'react-query'
import { PER_ITEM_LIMIT } from '../../constants'
import { Virtuoso } from 'react-virtuoso'
import { useObservable } from 'rxjs-hooks'
import { fromEvent, tap } from 'rxjs'
import styled from 'styled-components'
import { Loading } from '../Loading'

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
  const {
    data,
    status,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    // refetch,
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

  const listRef = useRef<HTMLDivElement>(null)

  useObservable(() =>
    fromEvent(window, 'scroll').pipe(
      tap(() => {
        if (!listRef.current || !hasNextPage || isFetchingNextPage) return
        const scrollY = window.scrollY + document.body.offsetHeight
        const listBottom =
          listRef.current.offsetTop + listRef.current.offsetHeight
        if (scrollY <= listBottom - 100) return
        fetchNextPage()
      })
    )
  )

  return (
    <>
      <Grid templateColumns="repeat(2, 1fr)" gap="10px" ref={listRef}>
        {columns.map((column) => (
          <Virtuoso
            useWindowScroll
            data={column}
            itemContent={(index) => column[index]}
          />
        ))}
      </Grid>
      <Tips hide={status !== 'loading' && !isFetchingNextPage}>
        <Loading />
      </Tips>
    </>
  )
}
