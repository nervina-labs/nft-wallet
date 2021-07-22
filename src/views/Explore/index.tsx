import React, { useCallback, useMemo, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
// import { RoutePath } from '../../routes'
import { ReactComponent as PlayerSvg } from '../../assets/svg/player.svg'
import { MainContainer } from '../../styles'
import { TokenClass } from '../../models/class-list'
import { ClassSortType as SortType, NftType, Query } from '../../models'
import { useWalletModel } from '../../hooks/useWallet'
import { useInfiniteQuery, useQuery } from 'react-query'
import { IS_WEXIN, PER_ITEM_LIMIT } from '../../constants'
import { LazyLoadImage } from '../../components/Image'
import FallbackImg from '../../assets/img/card-fallback.png'
import { Creator } from '../../components/Creator'
import { Masonry } from '../../components/Masonry'
import { Loading } from '../../components/Loading'
import InfiniteScroll from 'react-infinite-scroll-component'
import { HiddenBar } from '../../components/HiddenBar'
import { useHistory } from 'react-router'
import { useRouteQuery } from '../../hooks/useRouteQuery'
import { useRouteMatch } from 'react-router-dom'
import { RoutePath } from '../../routes'
import { Limited } from '../../components/Limited'
import { Like } from '../../components/Like'
import { useScrollTrigger } from '@material-ui/core'
import classNames from 'classnames'
import qs from 'querystring'
import { useScrollRestoration } from '../../hooks/useScrollRestoration'
import { getImagePreviewUrl, isVerticalScrollable } from '../../utils'

const Container = styled(MainContainer)`
  min-height: 100%;
  padding: 0;
  max-width: 500px;
  display: flex;
  background: white;
  flex-direction: column;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    width: 100%;
    max-width: 500px;
    height: 40px;
    .active-line {
      background: #ff5c00;
      border-radius: 10px;
      position: absolute;
      border-radius: 10px;
      height: 3px;
      width: 28px;
      position: absolute;
      top: 22px;
    }
    &.fixed-header {
      position: fixed;
      top: 0;
      z-index: 3;
      justify-content: center;
      background: rgba(255, 255, 255, 0.9);
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
      backdrop-filter: blur(10px);
    }
    h3 {
      font-size: 24px;
      margin: 0;
      margin-left: 15px;
      color: #333333;
    }
    .filters {
      margin-right: 15px;
      font-size: 14px;
      color: #333333;
      display: flex;
      align-items: center;
      justify-content: center;
      &.fixed {
        flex: 1;
      }
      .filter {
        cursor: pointer;
        display: flex;
        flex-direction: column;
        position: relative;
        justify-content: center;
        align-items: center;
        margin-right: 32px;
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
  .tags {
    margin: 18px 0;
    margin-left: 6px;
    display: flex;
    align-items: center;
    overflow-x: auto;
    word-break: keep-all;

    /* &::-webkit-scrollbar {
      display: none;
    } */

    @media (max-width: 500px) {
      &::-webkit-scrollbar {
        display: none;
      }
    }

    .tag {
      cursor: pointer;
      padding: 7px 23px;
      border-radius: 8px;
      background-color: transparent;
      white-space: nowrap;
      &.active {
        color: white;
        background-color: #2c454d;
      }
      &:last-child {
        margin-right: 15px;
      }
    }
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

    /* justify-content: space-around; */
  }
`

const CardContainer = styled.div`
  display: flex;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  flex-direction: column;
  overflow: hidden;
  cursor: pointer;

  .media {
    position: relative;
    img {
      border-radius: 8px;
    }
    .player {
      position: absolute;
      right: 6px;
      bottom: 6px;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      svg {
        width: 20px;
        height: 20px;
      }
    }
  }

  .title {
    font-size: 14px;
    line-height: 16px;
    color: #000000;
    margin: 10px 8px;
    margin-bottom: 16px;
    display: -webkit-box;
    display: -moz-box;
    flex: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 2;
    line-clamp: 2;
  }

  .issuer {
    margin: 10px;
    margin-top: 0;
    .name {
      display: -webkit-box;
      display: -moz-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
      -webkit-line-clamp: 1;
      white-space: inherit;
      word-break: break-all;
    }
  }

  .info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 10px;
    margin-bottom: 16px;
  }
`

interface CardProps {
  token: TokenClass
}

const Card: React.FC<CardProps> = ({ token }) => {
  const width = ((window.innerWidth > 500 ? 500 : window.innerWidth) - 48) / 2
  const history = useHistory()
  return (
    <CardContainer
      onClick={() => {
        history.push(`class/${token.uuid}`)
      }}
    >
      <div className="media">
        <LazyLoadImage
          src={getImagePreviewUrl(token.bg_image_url)}
          width={width}
          height={width}
          skeletonStyle={{ borderRadius: '8px' }}
          cover={true}
          disableContextMenu={true}
          backup={
            <LazyLoadImage
              skeletonStyle={{ borderRadius: '8px' }}
              width={width}
              cover
              height={width}
              src={FallbackImg}
            />
          }
        />
        {token.type === NftType.Audio || token.type === NftType.Video ? (
          <span className="player">
            <PlayerSvg />
          </span>
        ) : null}
      </div>
      <div className="title">{token.name}</div>
      <div className="issuer">
        <Creator
          title=""
          baned={token.is_issuer_banned}
          url={token.issuer_info?.avatar_url}
          name={token.issuer_info?.name}
          uuid={token.issuer_info?.uuid}
          vipAlignRight
          color="rgb(51, 51, 51)"
          isVip={token?.verified_info?.is_verified}
          vipTitle={token?.verified_info?.verified_title}
          vipSource={token?.verified_info?.verified_source}
        />
      </div>
      <div className="info">
        <Limited count={token.total} bold={false} banned={false} color="#666" />
        <Like
          count={token.class_likes}
          liked={token.class_liked}
          uuid={token.uuid}
        />
      </div>
    </CardContainer>
  )
}

export const Explore: React.FC = () => {
  const [t, i18n] = useTranslation('translations')
  const history = useHistory()
  const currentTag = useRouteQuery('tag', 'all')
  const sortRoute = useRouteQuery<string>('sort', '')
  const sortType = useMemo(() => {
    if (currentTag === 'all') {
      if (sortRoute === 'likes') {
        return SortType.Likes
      } else if (sortRoute === '') {
        return SortType.Recommend
      }
      return SortType.Latest
    }
    return sortRoute === 'likes' ? SortType.Likes : SortType.Latest
  }, [sortRoute, currentTag])
  useScrollRestoration()
  const matchExplore = useRouteMatch({
    path: RoutePath.Explore,
    exact: true,
    strict: true,
  })
  const triggerHeader = useScrollTrigger({
    threshold: 72,
    disableHysteresis: true,
  })
  const { data: tagsResult } = useQuery(
    Query.Tags,
    async () => {
      const { data } = await api.getTags()
      return data
    },
    {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  )
  const allTags = useMemo(() => {
    const tags =
      tagsResult?.tags.map((tag) => {
        return {
          uuid: tag.uuid,
          name: tag.locales[i18n.language],
          routeName: tag.locales.en.trim().toLowerCase(),
        }
      }) ?? []
    return [{ name: t('explore.all'), uuid: 'all', routeName: 'all' }]
      .concat(tags)
      .concat([
        {
          uuid: 'others',
          name: t('explore.others'),
          routeName: 'others',
        },
      ])
  }, [tagsResult, i18n.language, t])

  const currentTagId = useMemo(() => {
    return allTags.find((t) => t.routeName === currentTag)?.uuid
  }, [allTags, currentTag])

  const currentTagName = useMemo(() => {
    return allTags.find((t) => t.routeName === currentTag)?.name
  }, [allTags, currentTag])

  const { api } = useWalletModel()
  const {
    data,
    hasNextPage,
    fetchNextPage,
    refetch,
    status,
  } = useInfiniteQuery(
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    [Query.Explore + currentTag + sortType, currentTagId, sortType],
    async ({ pageParam = 1 }) => {
      // eslint-disable-next-line
      const { data } = await api.getClassListByTagId(currentTagId!, pageParam, sortType)
      return data
    },
    {
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
      enabled:
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        !!(matchExplore?.isExact || tagsResult != null) && currentTagId != null,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  )

  const tokens = useMemo(() => {
    const list = data?.pages.reduce(
      (acc, p) => acc.concat(p.class_list),
      [] as TokenClass[]
    )
    if (list == null || SortType.Likes !== sortType || list?.length === 0) {
      return list
    }
    const set = new Set()
    for (let i = 0; i < list.length; i++) {
      const token = list[i]
      if (set.has(token.uuid)) {
        list.splice(i, 1)
      }
      set.add(token.uuid)
    }
    return list
  }, [data, sortType])

  const [isRefetching, setIsRefetching] = useState(false)

  const refresh = useCallback(async () => {
    setIsRefetching(true)
    await refetch()
    setIsRefetching(false)
  }, [refetch])

  const dataLength = useMemo(() => {
    return tokens?.length ?? 0
  }, [tokens])

  const [alwayShowTabbar, setAlwaysShowTabbar] = useState(false)

  useEffect(() => {
    setAlwaysShowTabbar(!isVerticalScrollable())
  }, [data])

  return (
    <Container>
      <HiddenBar alwaysShow={alwayShowTabbar} />
      <div className="tags">
        {allTags.map((t) => (
          <div
            key={t.uuid}
            className={`tag ${currentTagId === t.uuid ? 'active' : ''}`}
            onClick={() => {
              if (currentTagId === t.uuid) {
                return
              }
              history.push(
                t.uuid === 'all'
                  ? RoutePath.Explore
                  : `${RoutePath.Explore}?tag=${t.routeName}`
              )
            }}
          >
            {t.name}
          </div>
        ))}
      </div>
      <div className={classNames('header', { 'fixed-header': triggerHeader })}>
        {triggerHeader ? null : <h3>{currentTagName}</h3>}
        <div className={classNames('filters', { fixed: triggerHeader })}>
          {currentTagId === 'all' ? (
            <div
              className={classNames('filter', {
                active: sortType === SortType.Recommend,
              })}
              onClick={() => {
                if (sortRoute === '') {
                  return
                }
                history.push(RoutePath.Explore)
              }}
            >
              <span>{t('explore.recommended')}</span>
              {sortType === SortType.Recommend ? (
                <span className="active-line"></span>
              ) : null}
            </div>
          ) : null}
          <div
            className={classNames('filter', {
              active: sortType === SortType.Latest,
            })}
            onClick={() => {
              if (sortType === SortType.Latest) {
                return
              }
              const o = qs.parse(location.search.slice(1))
              if (currentTag === 'all') {
                o.sort = 'latest'
              } else {
                delete o.sort
              }
              const s = qs.stringify(o)
              const target = `${RoutePath.Explore}${
                s.length === 0 ? '' : '?' + s
              }`
              history.push(target)
            }}
          >
            <span>{t('explore.latest')}</span>
            {sortType === SortType.Latest ? (
              <span className="active-line"></span>
            ) : null}
          </div>
          <div
            className={classNames('filter', {
              active: sortType === SortType.Likes,
            })}
            onClick={() => {
              if (sortType === SortType.Likes) {
                return
              }
              const o = qs.parse(location.search.slice(1))
              o.sort = 'likes'
              const target = `${RoutePath.Explore}?${qs.stringify(o)}`
              history.push(target)
            }}
          >
            <span>{t('explore.most-liked')}</span>
            {sortType === SortType.Likes ? (
              <span className="active-line"></span>
            ) : null}
          </div>
        </div>
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
