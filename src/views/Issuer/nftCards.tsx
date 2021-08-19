import styled from 'styled-components'
import { NAVIGATION_BAR_HEIGHT } from '../../components/NavigationBar'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import classNames from 'classnames'
import { useParams } from 'react-router'
import { useWalletModel } from '../../hooks/useWallet'
import { useQuery } from 'react-query'
import { Query } from '../../models'
import { NftCard } from './nftCard'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Masonry } from '../../components/Masonry'
import { useTranslation } from 'react-i18next'

const NftCardsContainer = styled.div`
  --header-border-color: #ececec;
  --bg-color: #f8fafd;
  --header-bg-color: #fff;
  --active-color: #ff5c00;
  --filter-color: #8e8e93;
  --filter-font-color: #000;
  --header-height: 40px;
  position: sticky;
  top: ${NAVIGATION_BAR_HEIGHT}px;
  min-height: 100vh;
  z-index: 10;
  background-color: var(--bg-color);

  .header {
    width: 100%;
    height: var(--header-height);
    line-height: var(--header-height);
    background-color: var(--header-bg-color);
    display: flex;
    border-bottom: 1px solid var(--header-border-color);
    z-index: 11;
    user-select: none;

    &.fixed {
      width: 100%;
      position: fixed;
      top: ${NAVIGATION_BAR_HEIGHT}px;
    }

    &.hide {
      opacity: 0;
      pointer-events: none;
    }
  }

  .filters {
    width: 184px;
    height: 100%;
    display: flex;
    margin: auto;
    position: relative;
    font-size: 15px;

    .filter {
      width: 80px;
      text-align: center;
      color: var(--filter-color);
      cursor: pointer;

      &.active {
        font-weight: 500;
        color: var(--filter-font-color);
      }
    }

    .active-bar {
      bottom: 0;
      left: 0;
      position: absolute;
      display: flex;
      width: 80px;
      height: 3px;
      transition: 0.2s;
      &:before {
        content: ' ';
        width: 30px;
        height: 100%;
        background-color: var(--active-color);
        margin: auto;
        border-radius: 10px;
      }
    }
  }

  .card-group {
    --padding-bottom: calc(15px + env(safe-area-inset-bottom));
    padding: 15px 15px var(--padding-bottom);
    transition: 0.2s;

    ul {
      padding: 0;
      margin: 0;
      grid-gap: 5px;
    }
  }
`

export const NftCards: React.FC = () => {
  const [headerFixed, setHeaderFixed] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)
  const [t] = useTranslation('translations')

  const filters = useMemo(() => {
    return (
      <nav className="filters">
        <div className="filter active">{t('issuer.created')}</div>
        <div className="filter">{t('issuer.selling')}</div>
        <div className="active-bar" />
      </nav>
    )
  }, [t])

  const setHeaderFixedByHeaderRef = useCallback(() => {
    const top =
      (headerRef?.current?.getClientRects()[0].top ?? 0) - NAVIGATION_BAR_HEIGHT
    setHeaderFixed(top <= 0)
  }, [headerRef])

  useEffect(() => {
    window.addEventListener('scroll', setHeaderFixedByHeaderRef)
    return () => window.removeEventListener('scroll', setHeaderFixedByHeaderRef)
  })

  const { id } = useParams<{ id: string }>()
  const { api } = useWalletModel()

  const { data, isLoading } = useQuery(
    [Query.Issuers, api, id],
    async () => {
      const { data } = await api.getIssuerTokenClass(id)
      return data
    },
    {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  )

  return (
    <NftCardsContainer>
      <header
        className={classNames('header', { hide: headerFixed })}
        ref={headerRef}
      >
        {filters}
      </header>
      <header className={classNames('header', 'fixed', { hide: !headerFixed })}>
        {filters}
      </header>

      <div className="card-group">
        {isLoading && <div className="loading">Loading</div>}

        {!isLoading && (
          <InfiniteScroll
            dataLength={data?.token_classes.length ?? 0}
            hasMore
            loader={null}
            next={() => {
              console.log('next')
            }}
          >
            <Masonry columns={2}>
              {(data?.token_classes ?? []).map((item, i) => (
                <NftCard token={item} key={i} uuid={id} />
              ))}
            </Masonry>
          </InfiniteScroll>
        )}
      </div>
    </NftCardsContainer>
  )
}
