/* eslint-disable @typescript-eslint/indent */
import React, { useState, useCallback, useEffect, useMemo } from 'react'
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
import { Grid } from '@mibao-ui/components'

const H4 = styled.h4`
  color: rgba(0, 0, 0, 0.6);
  text-align: center;
  margin: 16px 0;
`

const GridItem = styled.div`
  content-visibility: auto;
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
  emptyElement?: React.ReactNode
  noMoreElement: React.ReactNode
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
}

interface GridsProps<TQueryFnData = unknown, TData = TQueryFnData> {
  data: InfiniteData<TData> | undefined
  renderItems: (
    item: TData,
    index: number,
    refetch?: () => Promise<void>
  ) => React.ReactNode
  columnCount: number
}

function Grids<TQueryFnData = unknown, TData = TQueryFnData>({
  data,
  renderItems,
  columnCount,
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
    <Grid templateColumns={`repeat(${columnCount}, 1fr)`} gap="10px">
      {columns.map((column, i) => (
        <GridItem key={i}>{column}</GridItem>
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
  pullDownToRefreshThreshold = 80,
  enableQuery,
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
              <H4>&#8595; {t('common.actions.pull-down-refresh')}</H4>
            )
          }
          pullDownToRefreshThreshold={pullDownToRefreshThreshold}
          releaseToRefreshContent={
            releaseToRefreshContent ?? (
              <H4>&#8593; {t('common.actions.release-refresh')}</H4>
            )
          }
          dataLength={dataLength}
          next={fetchNextPage}
          hasMore={hasNextPage === true}
          scrollThreshold={scrollThreshold}
          loader={loader ?? <Loading />}
          endMessage={<H4>{dataLength <= 5 ? ' ' : noMoreElement}</H4>}
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
            />
          )}
          {status === 'success' && dataLength === 0
            ? emptyElement ?? <H4>{t('issuer.no-data')}</H4>
            : null}
        </InfiniteScroll>
      )}
    </>
  )
}
