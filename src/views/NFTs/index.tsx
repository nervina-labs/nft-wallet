/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useMemo } from 'react'
import { useQuery } from 'react-query'
import { Query } from '../../models'
import { Redirect, useParams } from 'react-router'
import { RoutePath } from '../../routes'
import { HiddenBar, HiddenBarFill } from '../../components/HiddenBar'
import { useScrollRestoration } from '../../hooks/useScrollRestoration'
import { Container } from './styled'
import { Intro } from '../../components/Intro'
import { Info } from './info'
import { useAccount, useAccountStatus, useAPI } from '../../hooks/useAccount'
import { Appbar } from './components/appbar'
import { NftList } from './components/nftList'
import { useTrackDidMount } from '../../hooks/useTrack'

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
  useScrollRestoration()
  const { data: user, isLoading: isUserLoading } = useQuery(
    [Query.Profile, address, api],
    async () => await api.getProfile(address),
    {
      enabled: !!address,
    }
  )

  const showGuide = useMemo(() => {
    if (isUserLoading) {
      return false
    }
    return !user?.guide_finished
  }, [user, isUserLoading])

  useTrackDidMount('home')

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
      <NftList isHolder={isHolder} address={address} />
      {!isHolder && (
        <>
          <Intro show={showGuide} />
          <HiddenBar />
          <HiddenBarFill />
        </>
      )}
    </Container>
  )
}
