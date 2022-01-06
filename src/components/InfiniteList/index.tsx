/* eslint-disable @typescript-eslint/indent */
import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  CSSProperties,
} from 'react'
import {
  useInfiniteQuery,
  QueryFunction,
  UseInfiniteQueryOptions,
  QueryKey,
  InfiniteData,
} from 'react-query'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Loading } from '../Loading'
import { useTranslation } from 'react-i18next'
import { IS_WEXIN, PER_ITEM_LIMIT } from '../../constants'
import styled from 'styled-components'
import { Box, Grid } from '@mibao-ui/components'

export const ListDesciption = styled.h4`
  color: rgba(0, 0, 0, 0.6);
  text-align: center;
  margin: 16px 0;
`

export interface InfiniteListProps<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
> {
  queryKey: TQueryKey
  queryFn: QueryFunction<TQueryFnData, TQueryKey>
  queryOptions?: UseInfiniteQueryOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryFnData,
    TQueryKey
  >
  pullDownToRefresh?: boolean
  emptyElement?: React.ReactNode
  noMoreElement: React.ReactNode
  scrollableTarget?: React.ReactNode | string
  loader?: React.ReactNode
  pullDownToRefreshContent?: React.ReactNode
  releaseToRefreshContent?: React.ReactNode
  scrollThreshold?: string
  pullDownToRefreshThreshold?: number
  calcDataLength: (data?: InfiniteData<TData>) => number
  onDataChange?: (data?: InfiniteData<TData>) => void
  renderItems: (
    item: TData,
    index: number,
    refetch?: () => Promise<void>
  ) => React.ReactNode
  enableQuery?: boolean
  columnCount?: number
  gap?: string
  style?: CSSProperties
}

interface GridsProps<TQueryFnData = unknown, TData = TQueryFnData> {
  data: InfiniteData<TData> | undefined
  renderItems: (
    item: TData,
    index: number,
    refetch?: () => Promise<void>
  ) => React.ReactNode
  columnCount: number
  gap?: string
}

function Grids<TQueryFnData = unknown, TData = TQueryFnData>({
  data,
  renderItems,
  columnCount,
  gap = '10px',
}: GridsProps<TQueryFnData, TData>) {
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

  return (
    <Grid
      templateColumns={`repeat(${columnCount}, calc(calc(100% - ${gap}) / ${columnCount}))`}
      gap={gap}
    >
      {columns.map((column, i) => (
        <Box key={i}>{column}</Box>
      ))}
    </Grid>
  )
}

export function InfiniteList<
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
  pullDownToRefresh = !IS_WEXIN,
  pullDownToRefreshThreshold = 80,
  enableQuery,
  scrollableTarget,
  columnCount = 1,
  gap = '10px',
  style,
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
      if (total <= current * PER_ITEM_LIMIT) {
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

  const dataLength = useMemo(() => {
    return calcDataLength(data)
  }, [data, calcDataLength])

  const [isRefetching, setIsRefetching] = useState(false)

  const refresh = useCallback(async () => {
    setIsRefetching(true)
    await refetch()
    setIsRefetching(false)
  }, [refetch])

  useEffect(() => {
    onDataChange?.(data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  const loaderEl = useMemo(() => loader || <Loading />, [loader])

  return (
    <>
      {isRefetching ? loaderEl : null}
      {data === undefined && status === 'loading' ? (
        loaderEl
      ) : (
        <InfiniteScroll
          pullDownToRefresh={pullDownToRefresh}
          refreshFunction={refresh}
          pullDownToRefreshContent={
            pullDownToRefreshContent ?? (
              <ListDesciption>
                &#8595; {t('common.actions.pull-down-refresh')}
              </ListDesciption>
            )
          }
          pullDownToRefreshThreshold={pullDownToRefreshThreshold}
          releaseToRefreshContent={
            releaseToRefreshContent ?? (
              <ListDesciption>
                &#8593; {t('common.actions.release-refresh')}
              </ListDesciption>
            )
          }
          dataLength={dataLength}
          next={fetchNextPage}
          hasMore={hasNextPage === true}
          scrollThreshold={scrollThreshold}
          loader={loaderEl}
          endMessage={
            <ListDesciption>
              {dataLength <= 5 ? ' ' : noMoreElement}
            </ListDesciption>
          }
          scrollableTarget={scrollableTarget}
          style={style}
        >
          {columnCount === 1 ? (
            data?.pages?.map((group, i) => {
              return (
                <React.Fragment key={i}>
                  {renderItems(group, i, refresh)}
                </React.Fragment>
              )
            })
          ) : (
            <Grids
              renderItems={renderItems}
              columnCount={columnCount}
              data={data}
              gap={gap}
            />
          )}
          {status === 'success' && dataLength === 0
            ? emptyElement ?? (
                <ListDesciption>{t('issuer.no-data')}</ListDesciption>
              )
            : null}
        </InfiniteScroll>
      )}
    </>
  )
}
