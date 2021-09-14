import styled from 'styled-components'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import classNames from 'classnames'
import { PRODUCT_STATUE_SET, ProductState } from '../../models'
import { NftCard } from './nftCard'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Masonry } from '../../components/Masonry'
import { useTranslation } from 'react-i18next'
import { useRouteQuery } from '../../hooks/useRouteQuery'
import { useHistory } from 'react-router-dom'
import { Loading } from '../../components/Loading'
import { HEADER_HEIGHT } from '../../components/Appbar'
import { IssuerTokenClass } from '../../models/issuer'

const NftCardsContainer = styled.div`
  --header-border-color: #ececec;
  --bg-color: #f8fafd;
  --header-bg-color: #fff;
  --active-color: #ff5c00;
  --filter-color: #8e8e93;
  --filter-font-color: #000;
  --header-height: 40px;
  position: sticky;
  top: ${HEADER_HEIGHT}px;
  min-height: calc(100vh - 200px);
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
    max-width: var(--max-width);

    &.fixed {
      width: 100%;
      position: fixed;
      top: ${HEADER_HEIGHT}px;
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
  const [headerFixed, setHeaderFixed] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)
  const { replace, location } = useHistory()
  const [t] = useTranslation('translations')
  const productState = useRouteQuery<ProductState>(
    'productState',
    'product_state'
  )
  const [index, setIndex] = useState(
    PRODUCT_STATUE_SET.findIndex((item) => item === productState) || 0
  )

  const setHeaderFixedByHeaderRef = useCallback(() => {
    const isFixed =
      (headerRef?.current?.getClientRects()[0].top ?? 0) - HEADER_HEIGHT <= 0
    if (isFixed !== headerFixed) {
      setHeaderFixed(isFixed)
    }
  }, [headerRef, headerFixed])

  useEffect(() => {
    window.addEventListener('scroll', setHeaderFixedByHeaderRef)
    return () => window.removeEventListener('scroll', setHeaderFixedByHeaderRef)
  })

  const filterEl = useMemo(() => {
    const activeBarTranslateX = `${index * 100}%`
    const filterList = [
      {
        active: productState === 'product_state',
        path: location.pathname + '?productState=product_state',
        label: t('issuer.created'),
      },
      {
        active: productState === 'on_sale',
        path: location.pathname + '?productState=on_sale',
        label: t('issuer.selling'),
      },
    ]

    return (
      <nav className="filters">
        {filterList.map((item, i) => (
          <div
            className={classNames('filter', {
              active: item.active,
            })}
            onClick={() => {
              replace(item.path)
              setIndex(i)
              setHeaderFixedByHeaderRef()
            }}
            key={`${i}`}
          >
            {item.label}
          </div>
        ))}
        <div
          className="active-bar"
          style={{
            transform: `translateX(${activeBarTranslateX})`,
          }}
        />
      </nav>
    )
  }, [
    index,
    location.pathname,
    productState,
    replace,
    setHeaderFixedByHeaderRef,
    t,
  ])

  return (
    <>
      <header className="header" ref={headerRef}>
        {filterEl}
      </header>
      <header className={classNames('header', 'fixed', { hide: !headerFixed })}>
        {filterEl}
      </header>
    </>
  )
}

interface CardGroupProps {
  id: string
  tokenClasses: IssuerTokenClass[]
  isLoading: boolean
  fetchNextPage: () => void
  refetch: () => void
  hasNextPage?: boolean
}

const CardGroup: React.FC<CardGroupProps> = ({
  id,
  tokenClasses,
  isLoading,
  fetchNextPage,
  hasNextPage,
  refetch,
}) => {
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

  return (
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
  )
}

export const NftCards: React.FC<CardGroupProps> = (props) => {
  return (
    <NftCardsContainer>
      <Header />
      <CardGroup {...props} />
    </NftCardsContainer>
  )
}
