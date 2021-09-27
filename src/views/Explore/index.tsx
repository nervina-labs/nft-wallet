import React, { useCallback, useMemo, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { MainContainer } from '../../styles'
import { TokenClass } from '../../models/class-list'
import { ClassSortType as SortType, Query } from '../../models'
import { useWalletModel } from '../../hooks/useWallet'
import { useInfiniteQuery, useQuery } from 'react-query'
import { IS_WEXIN, PER_ITEM_LIMIT } from '../../constants'
import { Masonry } from '../../components/Masonry'
import { Loading } from '../../components/Loading'
import InfiniteScroll from 'react-infinite-scroll-component'
import { HiddenBar } from '../../components/HiddenBar'
import { useHistory } from 'react-router'
import { useRouteQuery } from '../../hooks/useRouteQuery'
import { useRouteMatch } from 'react-router-dom'
import { RoutePath } from '../../routes'
import classNames from 'classnames'
import { useScrollRestoration } from '../../hooks/useScrollRestoration'
import { isVerticalScrollable } from '../../utils'
import { Home } from './home'
import { Card } from './card'
import { useProfileModel } from '../../hooks/useProfile'
import { Empty } from '../NFTs/empty'
import { Tab, Tabs } from '../../components/Tab'

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
      height: 3px;
      width: 28px;
      top: 22px;
    }

    &.fixed-header {
      position: fixed;
      top: 0;
      z-index: 3;
      justify-content: center;
      background: rgba(255, 255, 255, 0.9);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      backdrop-filter: blur(10px);
      transition: 0.2s;
    }

    &.fixed-header.hide {
      pointer-events: none;
      opacity: 0;
      transform: translateY(-100%);
    }

    h3 {
      font-size: 24px;
      margin: 0 0 0 15px;
      color: #333333;
    }

    .filters {
      width: 50%;

      &.fixed {
        flex: 1;
      }

      .filter {
        color: #333333;
        font-size: 14px;
      }
    }
  }

  .tags {
    margin: 18px 0 18px 6px;
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

const Header: React.FC<{
  currentTagId?: string
  currentTagName?: string
  sortType: SortType
  currentTag: string
  enableFixed?: boolean
}> = ({ currentTagId, sortType, currentTagName, currentTag, enableFixed }) => {
  const history = useHistory()
  const [t] = useTranslation('translations')
  const [scrollY, setScrollY] = useState(window.scrollY)
  useEffect(() => {
    const fn = (): void => {
      setScrollY(window.scrollY)
    }
    if (enableFixed) {
      window.addEventListener('scroll', fn)
    }
    return () => {
      if (enableFixed) {
        window.removeEventListener('scroll', fn)
      }
    }
  })

  const goToRecommend = useCallback(() => {
    if (sortType === SortType.Recommend) {
      return
    }
    history.push(RoutePath.Explore + '?tag=all')
  }, [history, sortType])

  const goToLatest = useCallback(() => {
    if (sortType === SortType.Latest) {
      return
    }
    const o = new URLSearchParams(location.search)
    if (currentTag === 'all') {
      o.set('sort', 'latest')
    } else {
      o.delete('sort')
    }
    const s = decodeURIComponent(o.toString())
    const target = `${RoutePath.Explore}${s.length === 0 ? '' : '?' + s}`
    history.push(target)
  }, [currentTag, history, sortType])

  const goToLikes = useCallback(() => {
    if (sortType === SortType.Likes) {
      return
    }
    const o = new URLSearchParams(location.search)
    o.set('sort', 'likes')
    const target = `${RoutePath.Explore}?${decodeURIComponent(o.toString())}`
    history.push(target)
  }, [history, sortType])

  const tabsActiveKey = Math.max(
    [
      ...(currentTagId === 'all' ? [SortType.Recommend] : []),
      SortType.Latest,
      SortType.Likes,
    ].findIndex((e) => e === sortType),
    0
  )
  return (
    <div
      className={classNames('header', {
        hide: enableFixed && scrollY <= 72,
        'fixed-header': enableFixed,
      })}
    >
      {!enableFixed && <h3>{currentTagName}</h3>}
      <Tabs
        activeKey={tabsActiveKey}
        className="filters"
        tabCount={currentTagId === 'all' ? 3 : 2}
      >
        {currentTagId === 'all' ? (
          <Tab className="filter" onClick={goToRecommend}>
            {t('explore.recommended')}
          </Tab>
        ) : null}
        <Tab className="filter" onClick={goToLatest}>
          {t('explore.latest')}
        </Tab>
        <Tab className="filter" onClick={goToLikes}>
          {t('explore.most-liked')}
        </Tab>
      </Tabs>
    </div>
  )
}

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 150px;
  .desc {
    font-size: 14px;
    line-height: 20px;
    color: #a7a7a7;
    margin-bottom: 16px;
  }

  button {
    margin-top: 34px;
    border: 1px solid #000000;
    border-radius: 44px;
    width: 200px;
    background-color: transparent;
    height: 46px;
    font-size: 18px;
    line-height: 25px;
    color: #a7a7a7;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`

const Login: React.FC = () => {
  const history = useHistory()
  const [t] = useTranslation('translations')
  return (
    <LoginContainer>
      <span className="desc">{t('follow.login.desc-1')}</span>
      <span className="desc">{t('follow.login.desc-2')}</span>
      <button onClick={() => history.push(RoutePath.Login)}>
        {t('follow.login.login')}
      </button>
    </LoginContainer>
  )
}

export const Explore: React.FC = () => {
  const [t, i18n] = useTranslation('translations')
  const history = useHistory()
  const currentTag = useRouteQuery<string>('tag', '')
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
    return [
      { name: t('explore.home'), uuid: null, routeName: null },
      { name: t('follow.follow'), uuid: 'follow', routeName: 'follow' },
      { name: t('explore.all'), uuid: 'all', routeName: 'all' },
    ]
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
  const { getAuth, isAuthenticated } = useProfileModel()
  const {
    data,
    hasNextPage,
    fetchNextPage,
    refetch,
    status,
  } = useInfiniteQuery(
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    [
      Query.Explore + currentTag + sortType,
      currentTagId,
      sortType,
      isAuthenticated,
    ],
    async ({ pageParam = 1 }) => {
      if (currentTag === 'follow') {
        const auth = await getAuth()
        const { data } = await api.getFollowTokenClasses(
          auth,
          pageParam,
          sortType
        )
        return {
          class_list: data.token_classes,
          meta: data.meta,
        }
      }
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
        !!(matchExplore?.isExact || tagsResult != null) &&
        currentTagId != null &&
        ((currentTag === 'follow' && isAuthenticated) ||
          currentTag !== 'follow'),
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
      <HiddenBar alwaysShow={currentTag === '' ? false : alwayShowTabbar} />
      <div className="tags">
        <div
          className={classNames({ tag: true, active: currentTag === '' })}
          onClick={() => {
            if (currentTag === '') {
              return
            }
            history.push(RoutePath.Explore)
          }}
        >
          {allTags[0]?.name}
        </div>
        {allTags.slice(1).map((t) => (
          <div
            key={t.uuid}
            className={`tag ${currentTagId === t.uuid ? 'active' : ''}`}
            onClick={() => {
              if (currentTagId === t.uuid) {
                return
              }
              history.push(
                t.routeName === null
                  ? RoutePath.Explore
                  : `${RoutePath.Explore}?tag=${t.routeName}`
              )
            }}
          >
            {t.name}
          </div>
        ))}
      </div>
      {currentTag === '' ? (
        <Home />
      ) : (
        <>
          <Header
            currentTag={currentTag}
            currentTagId={currentTagId ?? ''}
            sortType={sortType}
            currentTagName={currentTagName}
          />
          <Header
            currentTag={currentTag}
            currentTagId={currentTagId ?? ''}
            sortType={sortType}
            currentTagName={currentTagName}
            enableFixed={true}
          />
          <section className="content">
            {isRefetching ? <Loading /> : null}
            {currentTag === 'follow' && !isAuthenticated ? (
              <Login />
            ) : data === undefined && status === 'loading' ? (
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
                {status === 'success' && dataLength === 0 ? (
                  <Empty showExplore={false} />
                ) : null}
              </InfiniteScroll>
            )}
          </section>
        </>
      )}
    </Container>
  )
}
