/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useCallback, useMemo, useState } from 'react'
import { useInfiniteQuery, useQuery } from 'react-query'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Card } from '../../components/Card'
import { IS_WEXIN, PER_ITEM_LIMIT } from '../../constants'
import { Query } from '../../models'
import { Empty } from './empty'
import { Loading } from '../../components/Loading'
import { Redirect, useParams } from 'react-router'
import { RoutePath } from '../../routes'
import { useTranslation } from 'react-i18next'
import { useScrollRestoration } from '../../hooks/useScrollRestoration'
import { Container } from './styled'
import { Info } from './info'
import { useAccount, useAccountStatus, useAPI } from '../../hooks/useAccount'

export const NFTs: React.FC = () => {
  const params = useParams<{ address?: string }>()
  const api = useAPI()
  const { isLogined } = useAccountStatus()
  const { address: localAddress } = useAccount()
  const address = useMemo(
    () => (params.address ? params.address : localAddress),
    [localAddress, params.address]
  )
  const isHolder = useMemo(() => Boolean(params.address), [params.address])
  const { t } = useTranslation('translations')
  useScrollRestoration()

  const { data: user, isLoading: isUserLoading } = useQuery(
    [Query.Profile, address, api],
    async () => await api.getProfile(address),
    {
      enabled: !!address,
    }
  )

  const getRemoteData = useCallback(
    async ({ pageParam = 1 }) => {
      const { data } = await api.getNFTs(pageParam, { address })
      return data
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [api, address]
  )

  const {
    data,
    status,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery([`${Query.NFTList}`, address], getRemoteData, {
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
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
  })

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

  if (params.address === localAddress && isLogined) {
    return <Redirect to={RoutePath.NFTs} />
  }

  return (
    <Container id="main">
      <Info
        isLoading={isUserLoading}
        user={user}
        isHolder={isHolder}
        address={address}
      />
      <section className="list">
        <>
          {isRefetching ? <Loading /> : null}
          {data === undefined && status === 'loading' ? (
            <Loading />
          ) : (
            <InfiniteScroll
              pullDownToRefresh={!IS_WEXIN}
              refreshFunction={refresh}
              pullDownToRefreshContent={
                <h4>&#8595; {t('common.actions.pull-down-refresh')}</h4>
              }
              pullDownToRefreshThreshold={80}
              releaseToRefreshContent={
                <h4>&#8593; {t('common.actions.release-refresh')}</h4>
              }
              dataLength={dataLength}
              next={fetchNextPage}
              hasMore={hasNextPage === true}
              scrollThreshold="250px"
              loader={<Loading />}
              endMessage={
                <h4 className="end">
                  {dataLength <= 5 ? ' ' : t('common.actions.pull-to-down')}
                </h4>
              }
            >
              {data?.pages?.map((group, i) => {
                return (
                  <React.Fragment key={i}>
                    {group.token_list.map((token, j: number) => (
                      <Card
                        className={i === 0 && j === 0 ? 'first' : ''}
                        token={token}
                        key={token.token_uuid || `${i}.${j}`}
                        address={address}
                        isClass={false}
                        showTokenId={true}
                      />
                    ))}
                  </React.Fragment>
                )
              })}
              {status === 'success' && dataLength === 0 ? <Empty /> : null}
            </InfiniteScroll>
          )}
        </>
      </section>
    </Container>
  )
}
