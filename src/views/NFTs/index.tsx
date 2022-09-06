/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useMemo } from 'react'
import { useQuery } from 'react-query'
import { Query } from '../../models'
import { Redirect, useParams, useRouteMatch } from 'react-router'
import { RoutePath } from '../../routes'
import { HiddenBarFill } from '../../components/HiddenBar'
import { useScrollRestoration } from '../../hooks/useScrollRestoration'
import { Container } from './styled'
import { Info } from './info'
import { useAccount, useAccountStatus, useAPI } from '../../hooks/useAccount'
import { Appbar } from './components/appbar'
import { NftList } from './components/nftList'
import { useTrackDidMount } from '../../hooks/useTrack'
import { useWechatShare } from '../../hooks/useWechat'
import { useTranslation } from 'react-i18next'
import { useGetAndSetAuth, useProfile } from '../../hooks/useProfile'
import { PwaGuide } from '../../components/PwaGuide'

export const NFTs: React.FC = () => {
  const params = useParams<{ address?: string }>()
  const api = useAPI()
  const { isLogined } = useAccountStatus()
  const { address: localAddress } = useAccount()
  const { isAuthenticated } = useProfile()
  const address = useMemo(
    () => (params.address ? params.address : localAddress),
    [localAddress, params.address]
  )
  const isHolder = useMemo(() => Boolean(params.address), [params.address])
  useScrollRestoration()
  const wechatShare = useWechatShare()
  const [t] = useTranslation('translations')
  const matchHome = useRouteMatch(RoutePath.NFTs)
  const getAuth = useGetAndSetAuth()
  const { data: user, isLoading: isUserLoading } = useQuery(
    [Query.Profile, address, api, isAuthenticated],
    async () => {
      if (isAuthenticated) {
        const auth = await getAuth()
        return await api.getProfile(address, auth)
      }
    },
    {
      enabled: !!address,
      onSuccess: (d) => {
        wechatShare({
          title: t('common.share.wx.collector.title', {
            name: d?.nickname || t('holder.title'),
          }),
          desc: t(`common.share.wx.${matchHome ? 'home' : 'collector'}.desc`),
          link: `${location.origin}${RoutePath.Holder}/${address}`,
        })
      },
    }
  )

  useTrackDidMount(isHolder ? 'home' : 'collector')

  if (!isLogined && !isHolder) {
    return <Redirect to={RoutePath.Login} />
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
      <NftList isHolder={isHolder} address={address} />
      {!isHolder && (
        <>
          <HiddenBarFill />
          <PwaGuide />
        </>
      )}
    </Container>
  )
}
