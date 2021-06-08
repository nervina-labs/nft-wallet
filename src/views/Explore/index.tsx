import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { tags } from '../../data/tags'
// import { RoutePath } from '../../routes'
import { MainContainer } from '../../styles'
import { TokenClass } from '../../models/class-list'
import { Query } from '../../models'
import { useWalletModel } from '../../hooks/useWallet'
import { useInfiniteQuery } from 'react-query'
import { IS_WEXIN, PER_ITEM_LIMIT } from '../../constants'
import { LazyLoadImage } from '../../components/Image'
import FallbackImg from '../../assets/img/card-fallback.png'
import { Creator } from '../../components/Creator'
import { Divider } from '@material-ui/core'
import { Masonry } from '../../components/Masonry'
import { Loading } from '../../components/Loading'
import InfiniteScroll from 'react-infinite-scroll-component'
import { HiddenBar } from '../../components/HiddenBar'

const Container = styled(MainContainer)`
  min-height: 100%;
  padding: 0;
  max-width: 500px;
  display: flex;
  background: white;
  flex-direction: column;

  .tags {
    margin: 18px 0;
    margin-left: 6px;
    display: flex;
    align-items: center;
    overflow-x: auto;
    word-break: keep-all;

    &::-webkit-scrollbar {
      display: none;
    }

    .tag {
      cursor: pointer;
      padding: 7px 23px;
      border-radius: 8px;
      background-color: transparent;
      &.active {
        color: white;
        background-color: #2c454d;
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

  .media {
    img {
      border-radius: 8px;
    }
  }

  .title {
    font-size: 14px;
    line-height: 16px;
    color: #000000;
    margin: 10px 8px;
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
`

interface CardProps {
  token: TokenClass
}

const Card: React.FC<CardProps> = ({ token }) => {
  const width = ((window.innerWidth > 500 ? 500 : window.innerWidth) - 48) / 2
  return (
    <CardContainer>
      <div className="media">
        <LazyLoadImage
          src={token.bg_image_url}
          width={width}
          height={width}
          skeletonStyle={{ borderRadius: '8px' }}
          cover={true}
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
      </div>
      <div className="title">{token.name}</div>
      <Divider />
      <div className="issuer">
        <Creator
          title=""
          baned={token.is_issuer_banned}
          url={token.issuer_info.avatar_url}
          name={token.issuer_info.name}
          uuid={token.issuer_info.uuid}
          color="#333"
        />
      </div>
    </CardContainer>
  )
}

export const Explore: React.FC = () => {
  const [t, i18n] = useTranslation('translations')
  const [currentTag, setCurrentTag] = useState('all')
  const allTags = [{ name: t('explore.all'), uuid: 'all' }].concat(
    tags[i18n.language as 'zh']
  )

  const { api } = useWalletModel()
  const {
    data,
    hasNextPage,
    fetchNextPage,
    refetch,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery(
    [Query.explore + currentTag, currentTag],
    async ({ pageParam = 1 }) => {
      const { data } = await api.getClassListByTagId(currentTag, pageParam)
      return data
    },
    {
      getNextPageParam: (lastPage) => {
        const { meta } = lastPage
        const current = meta.current_page
        const total = meta.total_count
        if (total <= current * PER_ITEM_LIMIT) {
          return undefined
        }
        return meta.current_page + 1
      },
      refetchOnWindowFocus: false,
    }
  )

  const tokens = useMemo(() => {
    return data?.pages.reduce(
      (acc, p) => acc.concat(p.class_list),
      [] as TokenClass[]
    )
  }, [data])

  const [isRefetching, setIsRefetching] = useState(false)

  const refresh = useCallback(async () => {
    setIsRefetching(true)
    await refetch()
    setIsRefetching(false)
  }, [refetch])

  const dataLength = useMemo(() => {
    return tokens?.length ?? 0
  }, [tokens])

  return (
    <Container>
      <HiddenBar />
      <div className="tags">
        {allTags.map((t) => (
          <div
            key={t.uuid}
            className={`tag ${currentTag === t.uuid ? 'active' : ''}`}
            onClick={() => setCurrentTag(t.uuid)}
          >
            {t.name}
          </div>
        ))}
      </div>
      <section className="content">
        {(isFetching && !isFetchingNextPage) || isRefetching ? (
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
