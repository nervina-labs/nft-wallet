/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useCallback, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { Card } from '../../components/Card'
import { HOST } from '../../constants'
import { NFTToken, Query, TransactionStatus } from '../../models'
import { Empty } from './empty'
import { Redirect, useHistory, useParams } from 'react-router'
import { RoutePath } from '../../routes'
import { ReactComponent as ShareSvg } from '../../assets/svg/share-new.svg'
import { ReactComponent as ProfileSvg } from '../../assets/svg/menu.svg'
import { Share } from '../../components/Share'
import { useTranslation } from 'react-i18next'
import { HiddenBar } from '../../components/HiddenBar'
import { DrawerImage } from '../Profile/DrawerImage'
import { useLocation, useRouteMatch } from 'react-router-dom'
import { SetUsername } from '../Profile/SetUsername'
import { SetDesc } from '../Profile/setDesc'
import { useRouteQuery } from '../../hooks/useRouteQuery'
import { useScrollRestoration } from '../../hooks/useScrollRestoration'
import { isVerticalScrollable } from '../../utils'
import { ProfilePath } from './User'
import { Container } from './styled'
import { DrawerMenu } from './DrawerMenu'
import { Intro } from '../../components/Intro'
import { IssuerList } from './IssuerList'
import { ReactComponent as BackSvg } from '../../assets/svg/back.svg'
import { Appbar, HEADER_HEIGHT } from '../../components/Appbar'
import { Info } from './info'
import { Tab, Tabs, TabsAffix } from '../../components/Tab'
import { useAccount, useAccountStatus, useAPI } from '../../hooks/useAccount'
import { InfiniteList } from '../../components/InfiniteList'

export const NFTs: React.FC = () => {
  const params = useParams<{ address?: string }>()
  const api = useAPI()
  const { isLogined } = useAccountStatus()
  const { address: localAddress } = useAccount()
  const address = useMemo(
    () => (params.address ? params.address : localAddress),
    [localAddress, params.address]
  )
  const isHolder = useMemo(() => Boolean(params.address), [params.address])
  const { t } = useTranslation('translations')
  const history = useHistory()
  const [showAvatarAction, setShowAvatarAction] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  useScrollRestoration()
  const { data: user, isLoading: isUserLoading } = useQuery(
    [Query.Profile, address, api],
    async () => await api.getProfile(address),
    {
      enabled: !!address,
    }
  )

  const location = useLocation()
  const isLiked = !!useRouteQuery<string>('liked', '')
  const isFollow = !!useRouteQuery<string>('follow', '')
  const isOwned = location.search === ''

  const filterIndex = [isOwned, isLiked, isFollow].findIndex((bool) => bool)

  const getRemoteData = useCallback(
    async ({ pageParam = 1 }) => {
      if (isLiked) {
        const { data } = await api.getUserLikesClassList(pageParam, { address })
        return {
          meta: data.meta,
          token_list: data.class_list.map<NFTToken>((c) => ({
            class_name: c.name,
            class_bg_image_url: c.bg_image_url,
            class_uuid: c.uuid,
            class_description: c.description,
            class_total: c.total,
            token_uuid: '',
            issuer_avatar_url: c.issuer_info?.avatar_url,
            issuer_name: c.issuer_info?.name,
            issuer_uuid: c.issuer_info?.uuid,
            tx_state: TransactionStatus.Committed,
            is_class_banned: c.is_class_banned,
            is_issuer_banned: c.is_issuer_banned,
            n_token_id: 0,
            verified_info: c.verified_info,
            renderer_type: c.renderer_type,
            card_back_content_exist: c.card_back_content_exist,
            card_back_content: c.card_back_content,
          })),
        }
      }
      const { data } = await api.getNFTs(pageParam, { address })
      return data
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLiked, api, address]
  )

  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)

  const matchDesc = useRouteMatch(ProfilePath.Description)
  const matchUsername = useRouteMatch(ProfilePath.Username)

  const [alwayShowTabbar, setAlwaysShowTabbar] = useState(false)

  const showGuide = useMemo(() => {
    if (isUserLoading) {
      return false
    }
    return !user?.guide_finished
  }, [user, isUserLoading])

  if (!isLogined && !isHolder) {
    return <Redirect to={RoutePath.Explore} />
  }
  if (params.address === localAddress && isLogined) {
    return <Redirect to={RoutePath.NFTs} />
  }

  return (
    <Container id="main">
      {isHolder && (
        <Appbar
          title={t('holder.title')}
          left={<BackSvg onClick={() => history.goBack()} />}
          right={<ShareSvg onClick={() => setIsShareDialogOpen(true)} />}
        />
      )}
      <Info
        isLoading={isUserLoading}
        user={user}
        setShowAvatarAction={setShowAvatarAction}
        closeMenu={() => setShowMenu(false)}
        isHolder={isHolder}
        address={address}
      />
      <section className="list">
        <TabsAffix top={isHolder ? HEADER_HEIGHT : 0} className="filters">
          <Tabs activeKey={filterIndex}>
            <Tab
              onClick={() => history.replace(history.location.pathname)}
              active={isOwned}
            >
              {t('nfts.owned')}
            </Tab>
            <Tab
              onClick={() =>
                history.replace(history.location.pathname + '?liked=true')
              }
              active={isLiked}
            >
              {t('nfts.liked')}
            </Tab>
            <Tab
              onClick={() =>
                history.replace(history.location.pathname + '?follow=true')
              }
              active={isFollow}
            >
              {t('follow.follow')}
            </Tab>
          </Tabs>
        </TabsAffix>
        {isFollow ? (
          <IssuerList isFollow={isFollow} address={address} />
        ) : (
          <InfiniteList
            queryFn={getRemoteData}
            queryKey={[
              `${Query.NFTList}${isLiked.toString()}`,
              address,
              isLiked,
            ]}
            enableQuery={!isFollow}
            emptyElement={<Empty />}
            noMoreElement={t('common.actions.pull-to-down')}
            onDataChange={() => {
              setAlwaysShowTabbar(!isVerticalScrollable())
            }}
            calcDataLength={(data) => {
              return (
                data?.pages.reduce(
                  (acc, token) => token.token_list.length + acc,
                  0
                ) ?? 0
              )
            }}
            renderItems={(group, i) => {
              return group.token_list.map((token, j: number) => (
                <Card
                  className={i === 0 && j === 0 ? 'first' : ''}
                  token={token}
                  key={token.token_uuid || `${i}.${j}`}
                  address={address}
                  isClass={isLiked}
                  showTokenId={!isLiked}
                />
              ))
            }}
          />
        )}
      </section>
      <Share
        displayText={HOST + `${RoutePath.Holder}/${address}`}
        copyText={HOST + `${RoutePath.Holder}/${address}`}
        closeDialog={() => setIsShareDialogOpen(false)}
        isDialogOpen={isShareDialogOpen}
      />
      {!isHolder && (
        <>
          <div className="account" onClick={() => setShowMenu(true)}>
            <ProfileSvg />
          </div>
          <div className="share" onClick={() => setIsShareDialogOpen(true)}>
            <ShareSvg />
            {t('nfts.share')}
          </div>
          <DrawerImage
            showAvatarAction={showAvatarAction}
            setShowAvatarAction={setShowAvatarAction}
          />
          <DrawerMenu
            close={() => setShowMenu(false)}
            isDrawerOpen={showMenu}
            user={user}
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
          <Intro show={showGuide} />
          <HiddenBar alwaysShow={alwayShowTabbar} />
        </>
      )}
    </Container>
  )
}
