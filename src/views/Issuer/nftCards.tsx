import styled from 'styled-components'
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useWalletModel } from '../../hooks/useWallet'
import { useInfiniteQuery } from 'react-query'
import { PRODUCT_STATUE_SET, ProductState, Query } from '../../models'
import { NftCard } from './nftCard'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Masonry } from '../../components/Masonry'
import { useTranslation } from 'react-i18next'
import { useRouteQuery } from '../../hooks/useRouteQuery'
import { useHistory } from 'react-router-dom'
import { Loading } from '../../components/Loading'
import { HEADER_HEIGHT } from '../../components/Appbar'
import { IssuerTokenClass } from '../../models/issuer'
import { Tab, Tabs } from '../../components/Tab'

const ITEM_LIMIT = 20

const NftCardsContainer = styled.div`
  --header-border-color: #ececec;
  --bg-color: #f8fafd;
  --header-bg-color: #fff;
  --active-color: #ff5c00;
  --filter-color: #8e8e93;
  --filter-font-color: #000;
  --header-height: 40px;
  position: relative;
  min-height: calc(100vh - 200px);
  z-index: 10;
  background-color: var(--bg-color);

  .header {
    position: sticky;
    top: ${HEADER_HEIGHT}px;
    width: 100%;
    height: var(--header-height);
    line-height: var(--header-height);
    background-color: var(--header-bg-color);
    display: flex;
    border-bottom: 1px solid var(--header-border-color);
    z-index: 11;
    user-select: none;
    max-width: var(--max-width);

    .filters {
      width: 60%;
      margin: auto;
      .filter {
        color: var(--filter-font-color);
      }
    }
  }

  .card-group {
    --padding-bottom: calc(15px + env(safe-area-inset-bottom));
    padding: 15px 0 var(--padding-bottom);
    transition: 0.2s;
    max-width: 500px;
    margin: auto;

    ul {
      margin: 0;
      grid-gap: 5px;
      padding: 0 15px;
    }

    li {
      grid-gap: 10px;
    }
  }

  .no-data {
    width: 100%;
    text-align: center;
    color: rgba(0, 0, 0, 0.6);
    margin: 10px 0;
    font-weight: 500;
  }
`

const Header: React.FC = () => {
  const { replace, location } = useHistory()
  const [t] = useTranslation('translations')
  const productState = useRouteQuery<ProductState>(
    'productState',
    'product_state'
  )
  const [index, setIndex] = useState(
    PRODUCT_STATUE_SET.findIndex((item) => item === productState) || 0
  )
  const updateSearchParams = (i: number, search: string) => {
    replace(`${location.pathname}?${search}`)
    setIndex(i)
  }

  return (
    <header className="header">
      <Tabs activeKey={index} className="filters">
        <Tab
          className="filter"
          onClick={() => updateSearchParams(0, 'productState=product_state')}
        >
          {t('issuer.created')}
        </Tab>
        <Tab
          className="filter"
          onClick={() => updateSearchParams(1, 'productState=on_sale')}
        >
          {t('issuer.selling')}
        </Tab>
      </Tabs>
    </header>
  )
}

const CardGroup: React.FC = () => {
  const [width, setWidth] = useState(
    (Math.min(window.innerWidth, 530) - 35) / 2
  )
  const [t] = useTranslation('translations')
  const resizeWidth = useCallback(() => {
    setWidth((Math.min(window.innerWidth, 530) - 35) / 2)
  }, [])

  useEffect(() => {
    window.addEventListener('resize', resizeWidth)
    return () => {
      window.removeEventListener('resize', resizeWidth)
    }
  })

  const { id } = useParams<{ id: string }>()
  const productState = useRouteQuery<ProductState>(
    'productState',
    'product_state'
  )
  const { api } = useWalletModel()

  const {
    data,
    isLoading,
    refetch,
    fetchNextPage,
    isFetching,
    hasNextPage,
  } = useInfiniteQuery(
    [Query.Issuers, api, id, productState],
    async ({ pageParam = 0 }) => {
      const productStateParam = PRODUCT_STATUE_SET.find(
        (e) => e === productState
      )
        ? productState
        : undefined

      const { data } = await api.getIssuerTokenClass(id, productStateParam, {
        page: pageParam,
      })
      return data
    },
    {
      getNextPageParam(lastPage) {
        return ITEM_LIMIT * lastPage.meta.current_page >=
          lastPage.meta.total_count
          ? undefined
          : lastPage.meta.current_page + 1
      },
      enabled: true,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  )

  const tokenClasses =
    data?.pages.reduce(
      (acc, page) => acc.concat(page.token_classes),
      [] as IssuerTokenClass[]
    ) ?? []
  const tokenClassLength = tokenClasses.length

  return (
    <div className="card-group">
      <InfiniteScroll
        dataLength={tokenClassLength}
        hasMore={hasNextPage === true}
        loader={<Loading />}
        refreshFunction={refetch}
        next={fetchNextPage}
      >
        {tokenClassLength > 0 && (
          <Masonry columns={2}>
            {tokenClasses.map((token, i) => (
              <NftCard token={token} key={i} uuid={id} imgSize={width} />
            ))}
          </Masonry>
        )}
        {isLoading && <Loading />}
      </InfiniteScroll>
      {tokenClassLength === 0 && !isLoading && !isFetching && (
        <div className="no-data">{t('issuer.no-data')}</div>
      )}
    </div>
  )
}

export const NftCards: React.FC = () => {
  return (
    <NftCardsContainer>
      <Header />
      <CardGroup />
    </NftCardsContainer>
  )
}
