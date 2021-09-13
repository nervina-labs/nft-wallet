import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useInfiniteQuery, useQuery } from 'react-query'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { HiddenBar } from '../../components/HiddenBar'
import { useWalletModel } from '../../hooks/useWallet'
import { Query } from '../../models'
import { TokenClass } from '../../models/class-list'
import { isVerticalScrollable } from '../../utils'
import { Masonry } from '../../components/Masonry'
import { Loading } from '../../components/Loading'
import InfiniteScroll from 'react-infinite-scroll-component'
import { IS_WEXIN } from '../../constants'
import { Card } from '../Explore/card'
import { Appbar } from '../../components/Appbar'
import { RoutePath } from '../../routes'
import { ReactComponent as BackSvg } from '../../assets/svg/back.svg'
import { MainContainer } from '../../styles'
import { useWidth } from '../../hooks/useWidth'
import { Gallery } from '../../components/Gallery'

const Container = styled(MainContainer)`
  padding-top: 44px;
  max-width: 500px;
  display: flex;
  background: white;
  flex-direction: column;

  .gallery-container {
    margin-top: 50px;
    margin-bottom: 16px;
    padding: 0 16px;
  }

  .content {
    flex: 1;
    padding: 0 16px;
    h4 {
      text-align: center;
      color: rgba(0, 0, 0, 0.6);
    }
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    p {
      margin: 0;
    }
  }
`

export interface CollectionData {
  title?: string
  bgColor?: string
}

export const Collection: React.FC = () => {
  const { t, i18n } = useTranslation('translations')
  const { api } = useWalletModel()
  const history = useHistory()
  const { id } = useParams<{ id: string }>()
  const location = useLocation<CollectionData>()
  const {
    data,
    hasNextPage,
    fetchNextPage,
    refetch,
    status,
  } = useInfiniteQuery(
    [Query.Collection, api, id],
    async ({ pageParam = 1 }) => {
      const { data } = await api.getCollection(id, pageParam)
      return data
    },
    {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  )

  const { data: remoteCollectionDetail } = useQuery(
    [Query.CollectionDetail, api, id],
    async () => {
      const { data } = await api.getCollectionDetail(id)
      return data
    },
    {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  )

  const [isRefetching, setIsRefetching] = useState(false)

  const refresh = useCallback(async () => {
    setIsRefetching(true)
    await refetch()
    setIsRefetching(false)
  }, [refetch])

  const tokens = useMemo(() => {
    return data?.pages.reduce(
      (acc, p) => acc.concat(p.class_list),
      [] as TokenClass[]
    )
  }, [data])

  const dataLength = useMemo(() => {
    return tokens?.length ?? 0
  }, [tokens])

  const [alwayShowTabbar, setAlwaysShowTabbar] = useState(false)

  useEffect(() => {
    setAlwaysShowTabbar(!isVerticalScrollable())
  }, [data])

  const title = useMemo(() => {
    return (
      remoteCollectionDetail?.locales[i18n.language] ??
      location?.state?.title ??
      ''
    )
  }, [location?.state?.title, remoteCollectionDetail, i18n.language])

  const bgColor = useMemo(() => {
    return remoteCollectionDetail?.bg_color ?? location?.state?.bgColor ?? ''
  }, [location?.state?.bgColor, remoteCollectionDetail])

  const appRef = useRef(null)
  const containerWidth = useWidth(appRef)
  const imgs = useMemo(() => {
    return tokens?.slice(0, 3).map((t) => t.bg_image_url) ?? []
  }, [tokens])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  return (
    <Container>
      <HiddenBar alwaysShow={alwayShowTabbar} />
      <Appbar
        title={title}
        left={<BackSvg onClick={() => history.push(RoutePath.Explore)} />}
        right={<div />}
        ref={appRef}
      />
      <div className="gallery-container">
        <Gallery
          bg={bgColor}
          imgs={imgs}
          primaryWidth={120}
          primaryMarginBottom={15}
          secondWidth={96}
          secondMarginBottom={22}
          secondHiddenWidth={17.5}
          containerWidth={containerWidth ? containerWidth - 32 : undefined}
          height={102}
        />
      </div>
      <section className="content">
        {isRefetching ? <Loading /> : null}
        {data === undefined && status === 'loading' ? (
          <Loading />
        ) : (
          <InfiniteScroll
            refreshFunction={refresh}
            pullDownToRefresh={!IS_WEXIN}
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
            scrollThreshold="300px"
            loader={<Loading />}
            endMessage={
              <h4 className="end">
                {dataLength <= 5 ? ' ' : t('common.actions.pull-to-down')}
              </h4>
            }
          >
            <Masonry columns={2}>
              {tokens?.map((token, i) => {
                return <Card token={token} key={`${i}`} />
              })}
            </Masonry>
          </InfiniteScroll>
        )}
      </section>
    </Container>
  )
}
