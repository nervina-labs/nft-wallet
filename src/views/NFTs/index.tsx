/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useCallback, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { NFTToken, Query, TransactionStatus } from '../../models'
import { Empty } from './empty'
import { Redirect, useHistory, useParams } from 'react-router'
import { RoutePath } from '../../routes'
import { useTranslation } from 'react-i18next'
import { HiddenBar } from '../../components/HiddenBar'
import { useLocation } from 'react-router-dom'
import { useRouteQuery } from '../../hooks/useRouteQuery'
import { useScrollRestoration } from '../../hooks/useScrollRestoration'
import { isVerticalScrollable } from '../../utils'
import { Container } from './styled'
import { Intro } from '../../components/Intro'
import { IssuerList } from './IssuerList'
import { AppbarSticky, HEADER_HEIGHT } from '../../components/Appbar'
import { Info } from './info'
import { useAccount, useAccountStatus, useAPI } from '../../hooks/useAccount'
import { InfiniteList } from '../../components/InfiniteList'
import { Share } from '../../components/Share'
import { HOST } from '../../constants'
import { Card } from './card'
import { Tabs, Tab, TabList } from '@mibao-ui/components'
import { Appbar } from './components/appbar'
import { useShareListInfo } from './hooks/useShareListInfo'

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

  const [alwayShowTabbar, setAlwaysShowTabbar] = useState(false)
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const showGuide = useMemo(() => {
    if (isUserLoading) {
      return false
    }
    return !user?.guide_finished
  }, [user, isUserLoading])

  const [, setShareListInfo] = useShareListInfo()

  if (!isLogined && !isHolder) {
    return <Redirect to={RoutePath.Explore} />
  }
  if (params.address === localAddress && isLogined) {
    return <Redirect to={RoutePath.NFTs} />
  }

  return (
    <Container id="main">
      <Appbar isHolder={isHolder} user={user} address={address} />
      <Info
        isLoading={isUserLoading}
        user={user}
        isHolder={isHolder}
        address={address}
      />
      <section className="list">
        <AppbarSticky
          top={!isHolder ? '0' : `${HEADER_HEIGHT}px`}
          mb="20px"
          className="filters"
        >
          <Tabs index={filterIndex} align="space-between" colorScheme="black">
            <TabList px="20px">
              <Tab onClick={() => history.replace(history.location.pathname)}>
                {t('nfts.owned')}
              </Tab>
              <Tab
                onClick={() =>
                  history.replace(history.location.pathname + '?liked=true')
                }
              >
                {t('nfts.liked')}
              </Tab>
              <Tab
                onClick={() =>
                  history.replace(history.location.pathname + '?follow=true')
                }
              >
                {t('follow.follow')}
              </Tab>
            </TabList>
          </Tabs>
        </AppbarSticky>
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
            onDataChange={(group) => {
              setAlwaysShowTabbar(!isVerticalScrollable())
              setShareListInfo({
                len: group?.pages[0].meta.total_count ?? 0,
                firstImageUrl:
                  group?.pages?.[0].token_list?.[0]?.class_bg_image_url ?? '',
              })
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
                  token={token}
                  key={token.token_uuid || `${i}.${j}`}
                  address={address}
                  isClass={isLiked}
                  showTokenID={!isLiked}
                />
              ))
            }}
          />
        )}
      </section>
      {!isHolder && (
        <>
          <Intro show={showGuide} />
          <HiddenBar alwaysShow={alwayShowTabbar} />
        </>
      )}
      <Share
        isDialogOpen={isShareDialogOpen}
        closeDialog={() => setIsShareDialogOpen(false)}
        displayText={HOST + location.pathname}
        copyText={HOST + location.pathname}
      />
    </Container>
  )
}
