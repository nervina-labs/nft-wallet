/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useCallback, useMemo, useState, useEffect, useRef } from 'react'
import { useInfiniteQuery, useQuery } from 'react-query'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Card } from '../../components/Card'
import {
  IS_IPHONE,
  IS_WEXIN,
  NFT_EXPLORER_URL,
  PER_ITEM_LIMIT,
} from '../../constants'
import { useWalletModel } from '../../hooks/useWallet'
import { NFTToken, Query, TransactionStatus } from '../../models'
import { Empty } from './empty'
import { Loading } from '../../components/Loading'
import { Redirect, useHistory } from 'react-router'
import { RoutePath } from '../../routes'
import { ReactComponent as ShareSvg } from '../../assets/svg/share-new.svg'
import { ReactComponent as ProfileSvg } from '../../assets/svg/menu.svg'
import { Share } from '../../components/Share'
import { useTranslation } from 'react-i18next'
import { HiddenBar } from '../../components/HiddenBar'
import { CircularProgress, useScrollTrigger } from '@material-ui/core'
import classNames from 'classnames'
import { DrawerImage } from '../Profile/DrawerImage'
import { useRouteMatch } from 'react-router-dom'
import { SetUsername } from '../Profile/SetUsername'
import { SetDesc } from '../Profile/setDesc'
import { useRouteQuery } from '../../hooks/useRouteQuery'
import { useScrollRestoration } from '../../hooks/useScrollRestoration'
import { isVerticalScrollable } from '../../utils'
import { User, ProfilePath, GotoProfile } from './User'
import { Container } from './styled'
import { DrawerMenu } from './DrawerMenu'
import { Addressbar } from '../../components/AddressBar'

export const NFTs: React.FC = () => {
  const { api, isLogined, address } = useWalletModel()
  const { t } = useTranslation('translations')
  const history = useHistory()
  const [showAvatarAction, setShowAvatarAction] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const closeMenu = (): void => setShowMenu(false)
  useScrollRestoration()
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

  const liked = useRouteQuery('liked', '')

  const getRemoteData = useCallback(
    async ({ pageParam = 1 }) => {
      if (liked) {
        const { data } = await api.getUserLikesClassList(pageParam)
        return {
          meta: data.meta,
          token_list: data.class_list.map((c) => {
            const token: NFTToken = {
              class_name: c.name,
              class_bg_image_url: c.bg_image_url,
              class_uuid: c.uuid,
              class_description: c.description,
              class_total: c.total,
              token_uuid: '',
              issuer_avatar_url: c.issuer_info.avatar_url,
              issuer_name: c.issuer_info.name,
              issuer_uuid: c.issuer_info.uuid,
              tx_state: TransactionStatus.Committed,
              is_class_banned: false,
              is_issuer_banned: false,
              n_token_id: 0,
              verified_info: c.verified_info,
            }
            return token
          }),
        }
      }
      const { data } = await api.getNFTs(pageParam)
      return data
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [liked]
  )

  const {
    data,
    status,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery(
    [`${Query.NFTList}${liked.toString()}`, address, liked],
    getRemoteData,
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

  const triggerHeader = useScrollTrigger({
    threshold: 200,
    disableHysteresis: true,
  })

  const bgRef = useRef<HTMLDivElement>(null)
  const [bgheight, setBgHeight] = useState(16)
  const [alwayShowTabbar, setAlwaysShowTabbar] = useState(false)

  useEffect(() => {
    setAlwaysShowTabbar(!isVerticalScrollable())
  }, [data])

  useEffect(() => {
    const height = bgRef.current?.clientHeight
    if (height) {
      setBgHeight(height)
    }
  }, [user, isUserLoading])

  if (!isLogined) {
    return <Redirect to={RoutePath.Explore} />
  }

  return (
    <Container id="main">
      <div className="share" onClick={openDialog}>
        <ShareSvg />
        {t('nfts.share')}
      </div>
      <div className={classNames('bg', { loading: isUserLoading })}>
        {isUserLoading ? (
          <CircularProgress size="20px" style={{ color: 'white' }} />
        ) : (
          <>
            <User
              user={user}
              setShowAvatarAction={setShowAvatarAction}
              closeMenu={closeMenu}
            />
            <div className="desc" ref={bgRef}>
              {user?.description ? (
                user?.description
              ) : (
                <GotoProfile
                  path={ProfilePath.Description}
                  closeMenu={closeMenu}
                >
                  {t('profile.desc.empty')}
                </GotoProfile>
              )}
            </div>
            <Addressbar address={address} />
            <br />
            <br />
          </>
        )}
        <div className="account" onClick={() => setShowMenu(true)}>
          <ProfileSvg />
        </div>
      </div>
      <section
        className="list"
        style={
          IS_IPHONE
            ? {
                width: '100%',
                maxWidth: '100%',
                marginTop: `${bgheight + 192}px`,
              }
            : { marginTop: `${bgheight + 192}px` }
        }
      >
        <div className={classNames('filters', { fixed: triggerHeader })}>
          <div
            className={classNames('filter', { active: !liked })}
            onClick={() => {
              if (liked) {
                history.push(RoutePath.NFTs)
              }
            }}
          >
            {t('nfts.owned')}
            {!liked ? <span className="active-line"></span> : null}
          </div>
          <div
            className={classNames('filter', { active: liked })}
            onClick={() => {
              if (!liked) {
                history.push(RoutePath.NFTs + '?liked=true')
              }
            }}
          >
            {t('nfts.liked')}
            {liked ? <span className="active-line"></span> : null}
          </div>
        </div>
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
                  {group.token_list.map((token, j: number) => {
                    return (
                      <Card
                        className={i === 0 && j === 0 ? 'first' : ''}
                        token={token}
                        key={token.token_uuid || `${i}.${j}`}
                        address={address}
                        isClass={liked === 'true'}
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
      <DrawerMenu
        close={closeMenu}
        isDrawerOpen={showMenu}
        user={user}
        setShowAvatarAction={setShowAvatarAction}
      />
      <HiddenBar alwaysShow={alwayShowTabbar} />
    </Container>
  )
}
