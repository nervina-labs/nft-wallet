/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useCallback, useMemo, useState } from 'react'
import { useInfiniteQuery, useQuery } from 'react-query'
import styled from 'styled-components'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Card } from '../../components/Card'
import {
  IS_IPHONE,
  IS_WEXIN,
  NFT_EXPLORER_URL,
  PER_ITEM_LIMIT,
} from '../../constants'
import { useWalletModel } from '../../hooks/useWallet'
import { Query } from '../../models'
import { Empty } from './empty'
import { Loading } from '../../components/Loading'
import { Redirect, useHistory } from 'react-router'
import { RoutePath } from '../../routes'
import { MainContainer } from '../../styles'
import { ReactComponent as ShareSvg } from '../../assets/svg/share-new.svg'
import { ReactComponent as AccountSvg } from '../../assets/svg/account-new.svg'
import Bg from '../../assets/svg/home-bg.svg'
import { Share } from '../../components/Share'
import { useTranslation } from 'react-i18next'
import { HiddenBar } from '../../components/HiddenBar'
import { LazyLoadImage } from '../../components/Image'
import { ReactComponent as PeopleSvg } from '../../assets/svg/people.svg'
import { ReactComponent as SettingSvg } from '../../assets/svg/setting.svg'
import { ReactComponent as MaleSvg } from '../../assets/svg/male.svg'
import { ReactComponent as FemaleSvg } from '../../assets/svg/female.svg'
import dayjs from 'dayjs'
import { getRegionFromCode } from '../Profile/SetRegion'
import { CircularProgress } from '@material-ui/core'
import classNames from 'classnames'
import { DrawerImage } from '../Profile/DrawerImage'
import { useRouteMatch } from 'react-router-dom'
import { SetUsername } from '../Profile/SetUsername'
import { SetDesc } from '../Profile/setDesc'

const Container = styled(MainContainer)`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding: 0;
  position: relative;
  h4 {
    text-align: center;
    color: rgba(0, 0, 0, 0.6);
  }
  .share {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px 10px 6px 15px;
    background: rgba(255, 246, 235, 0.553224);
    backdrop-filter: blur(13px);
    position: fixed;
    right: 0;
    top: 15px;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
    z-index: 10;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
    font-size: 13px;
    line-height: 18px;
    color: #333;
    svg {
      margin-right: 6px;
    }
  }

  @media (min-width: 500px) {
    .share {
      right: calc(50% - 250px);
    }
  }
  .account {
    background: rgba(255, 246, 235, 0.553224);
    width: 24px;
    height: 24px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    left: 20px;
    top: 20px;
    cursor: pointer;
  }
  .bg {
    position: fixed;
    top: 0;
    width: 100%;
    max-width: 500px;
    height: 245px;
    background: darkgray url(${Bg as any});
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 0 -80px;
    display: flex;
    flex-direction: column;
    &.loading {
      align-items: center;
      justify-content: center;
    }
    /* padding-left: 16px; */
    .user {
      margin-left: 25px;
      margin-top: 65px;
      display: flex;
      align-items: center;
      justify-content: center;
      .avatar {
        height: 56px;
        svg {
          width: 56px;
          height: 56px;
        }
      }
      .content {
        margin-left: 16px;
        flex: 1;
        display: flex;
        justify-content: space-between;
        color: white;
        flex-direction: column;
        height: calc(100% - 8px);
        &.empty {
          justify-content: center;
        }
        .nickname {
          color: white;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
        .info {
          color: white;
          font-size: 12px;
          display: flex;
          align-items: center;
          span {
            margin-right: 6px;
            &.region {
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 1;
              -webkit-box-orient: vertical;
            }
            &.year {
              white-space: nowrap;
            }
          }
          .gender {
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            width: 21px;
            height: 21px;
            min-width: 21px;
            background: rgba(240, 240, 240, 0.5);
          }
        }
      }
      .action {
        display: flex;
        /* justify-content: flex-end; */
        height: 100%;
        flex-direction: column-reverse;
        margin-right: 25px;

        .icon {
          cursor: pointer;
          background: rgba(255, 246, 235, 0.553224);
          width: 24px;
          height: 24px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          top: -5px;
        }
      }
    }
    .desc {
      margin-left: 25px;
      margin-right: 25px;
      margin-top: 16px;
      color: white;
      font-size: 14px;
      line-height: 16px;
      white-space: pre-line;
      word-break: break-all;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3; /* number of lines to show */
      -webkit-box-orient: vertical;
    }
  }
  .center {
    display: flex;
    justify-content: center;
    align-items: center;
    > span {
      font-size: 16px;
      margin-right: 8px;
    }
  }
  .list {
    flex: 1;
    background-color: white;
    background: #ecf2f5;
    border-radius: 35px 35px 0px 0px;
    margin-top: 199px;
    z-index: 2;
    padding-top: 10px;
    .infinite-scroll-component {
      > div {
        &:nth-child(2) {
          margin-top: 20px;
        }
      }
    }
  }
`

enum ProfilePath {
  Username = '/nfts/username',
  Description = '/nfts/description',
}

interface GotoProfileProps {
  path: ProfilePath
  children: React.ReactNode
}

const GotoProfile: React.FC<GotoProfileProps> = ({ children, path }) => {
  const history = useHistory()
  return (
    <span
      style={{ cursor: 'pointer' }}
      onClick={() => {
        history.push(path)
      }}
    >
      {children}
    </span>
  )
}

const Gender: React.FC<{ gender: string }> = ({ gender }) => {
  return (
    <span className="gender">
      {gender === 'male' ? <MaleSvg /> : <FemaleSvg />}
    </span>
  )
}

export const NFTs: React.FC = () => {
  const { api, isLogined, address } = useWalletModel()
  const { t, i18n } = useTranslation('translations')
  const history = useHistory()
  const [showAvatarAction, setShowAvatarAction] = useState(false)
  const { data: user, isLoading: isUserLoading } = useQuery(
    [Query.Profile, address],
    async () => {
      const profile = await api.getProfile()
      return profile
    },
    {
      enabled: !!address,
    }
  )

  const {
    data,
    status,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery(
    [Query.NFTList, address],
    async ({ pageParam = 1 }) => {
      const { data } = await api.getNFTs(pageParam)
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
    }
  )

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

  const explorerURL = useMemo(() => {
    return `${NFT_EXPLORER_URL}/holder/tokens/${address}`
  }, [address])

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const openDialog = useCallback(() => {
    setIsDialogOpen(true)
  }, [])

  const matchDesc = useRouteMatch(ProfilePath.Description)
  const matchUsername = useRouteMatch(ProfilePath.Username)

  const closeDialog = (): void => setIsDialogOpen(false)

  const isInfoEmpty = useMemo(() => {
    return !user?.birthday && !user?.gender && !user?.region
  }, [user])

  const userInfo = useMemo(() => {
    const y = dayjs().year() - dayjs(user?.birthday ?? Date.now()).year()
    const years = user?.birthday ? t('profile.years', { year: y }) : null
    const region = getRegionFromCode(user?.region, i18n.language as 'zh')
    return (
      <>
        {user?.gender ? <Gender gender={user?.gender} /> : null}
        {years ? <span className="year">{years}</span> : null}
        {region ? <span className="region">{region}</span> : null}
      </>
    )
  }, [user, t, i18n.language])

  if (!isLogined) {
    return <Redirect to={RoutePath.Explore} />
  }

  return (
    <Container>
      <div className="share" onClick={openDialog}>
        <ShareSvg />
        {t('nfts.share')}
      </div>
      <div className={classNames('bg', { loading: isUserLoading })}>
        {isUserLoading ? (
          <CircularProgress size="20px" style={{ color: 'white' }} />
        ) : (
          <>
            <div className="user">
              <div
                className="avatar"
                onClick={() => {
                  if (!user?.avatar_url) {
                    setShowAvatarAction(true)
                  }
                }}
              >
                {user?.avatar_url ? (
                  <LazyLoadImage
                    src={user?.avatar_url}
                    width={56}
                    height={56}
                    imageStyle={{ borderRadius: '50%' }}
                    variant="circle"
                    backup={<PeopleSvg />}
                  />
                ) : (
                  <PeopleSvg />
                )}
              </div>
              <div className={classNames('content', { empty: isInfoEmpty })}>
                <div className="nickname">
                  {user?.nickname ? (
                    user?.nickname
                  ) : (
                    <GotoProfile path={ProfilePath.Username}>
                      {t('profile.user-name.empty')}
                    </GotoProfile>
                  )}
                </div>
                {!isInfoEmpty ? <div className="info">{userInfo}</div> : null}
              </div>
              <div className="action">
                <div
                  className="icon"
                  onClick={() => history.push(RoutePath.Profile)}
                >
                  <SettingSvg />
                </div>
              </div>
            </div>
            <div className="desc">
              {user?.description ? (
                user?.description
              ) : (
                <GotoProfile path={ProfilePath.Description}>
                  {t('profile.desc.empty')}
                </GotoProfile>
              )}
            </div>
          </>
        )}
        <div
          className="account"
          onClick={() => history.push(RoutePath.Account)}
        >
          <AccountSvg />
        </div>
      </div>
      <section
        className="list"
        style={IS_IPHONE ? { width: '100%', maxWidth: '100%' } : undefined}
      >
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
                  {group.token_list.map((token, j) => {
                    return (
                      <Card
                        className={i === 0 && j === 0 ? 'first' : ''}
                        token={token}
                        key={token.token_uuid ?? `${i}${j}`}
                        address={address}
                      />
                    )
                  })}
                </React.Fragment>
              )
            })}
            {status === 'success' && dataLength === 0 ? <Empty /> : null}
          </InfiniteScroll>
        )}
      </section>
      <Share
        displayText={explorerURL}
        copyText={explorerURL}
        closeDialog={closeDialog}
        isDialogOpen={isDialogOpen}
      />
      <DrawerImage
        showAvatarAction={showAvatarAction}
        setShowAvatarAction={setShowAvatarAction}
      />
      <SetUsername
        username={user?.nickname}
        open={!!matchUsername?.isExact}
        close={() => history.goBack()}
      />
      <SetDesc
        desc={user?.description}
        open={!!matchDesc?.isExact}
        close={() => history.goBack()}
      />
      <HiddenBar />
    </Container>
  )
}
