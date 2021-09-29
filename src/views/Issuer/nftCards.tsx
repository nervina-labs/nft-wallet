import styled from 'styled-components'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
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
import { useInfiniteQuery } from 'react-query'
import { useWalletModel } from '../../hooks/useWallet'
import { Tabs, Tab } from '../../components/Tab'

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

function useNftCardWidth() {
  const [width, setWidth] = useState(
    (Math.min(window.innerWidth, 530) - 35) / 2
  )
  const resizeWidth = useCallback(() => {
    setWidth((Math.min(window.innerWidth, 530) - 35) / 2)
  }, [])

  useEffect(() => {
    window.addEventListener('resize', resizeWidth)
    return () => {
      window.removeEventListener('resize', resizeWidth)
    }
  })
  return width
}

interface NftCardsProps {
  id: string
  onLoaded?: (tokenClasses: IssuerTokenClass[]) => void
}

export const NftCards: React.FC<NftCardsProps> = ({ id, onLoaded }) => {
  const ITEM_LIMIT = 20
  const width = useNftCardWidth()
  const [t] = useTranslation('translations')
  const { api } = useWalletModel()
  const [loaded, setLoaded] = useState(false)
  const productState = useRouteQuery<ProductState>(
    'productState',
    'product_state'
  )
  const query = useInfiniteQuery(
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
      refetchOnMount: true,
    }
  )
  const { hasNextPage, refetch, fetchNextPage, isLoading } = query
  const tokenClasses = useMemo(() => {
    const tokenClasses =
      query.data?.pages.reduce(
        (acc, page) => acc.concat(page.token_classes),
        [] as IssuerTokenClass[]
      ) ?? []
    if (onLoaded && !loaded && tokenClasses.length) {
      onLoaded(tokenClasses)
      setLoaded(true)
    }
    return tokenClasses
  }, [query.data?.pages, onLoaded, loaded])

  return (
    <NftCardsContainer>
      <Header />
      <div className="card-group">
        <InfiniteScroll
          dataLength={tokenClasses.length}
          hasMore={hasNextPage === true}
          loader={<Loading />}
          refreshFunction={refetch}
          next={fetchNextPage}
        >
          {tokenClasses.length > 0 && (
            <Masonry columns={2}>
              {tokenClasses.map((token, i) => (
                <NftCard token={token} key={i} uuid={id} imgSize={width} />
              ))}
            </Masonry>
          )}
          {isLoading && <Loading />}
        </InfiniteScroll>
        {tokenClasses.length === 0 && !isLoading && (
          <div className="no-data">{t('issuer.no-data')}</div>
        )}
      </div>
    </NftCardsContainer>
  )
}
