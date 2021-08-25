import React from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import styled from 'styled-components'
import { Card } from './card'
import { useWalletModel } from '../../hooks/useWallet'
import { Query } from '../../models'
import { Collection } from './Collection'
import { RecommendIssuser } from './Issuer'
import { Skeleton } from '@material-ui/lab'
import { Notifications } from './Notifications'

const Container = styled.section`
  .header {
    .h3 {
      margin-left: 0;
    }
  }

  padding-right: 0 !important;

  .row {
    display: flex;
    align-items: center;
    overflow-x: auto;
    /* height: 484px; */
  }

  .MuiSkeleton-root {
    margin-right: 8px;
  }
`

export const Home: React.FC = () => {
  const [t] = useTranslation('translations')
  const { api } = useWalletModel()
  const { data: hotest, isLoading: isHotestLoading } = useQuery(
    [Query.Hotest, api],
    async () => {
      const { data } = await api.getRecommendClasses()
      return data
    },
    {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  )

  const { data: collections, isLoading: isSpecialAssetLoading } = useQuery(
    [Query.Collections, api],
    async () => {
      const { data } = await api.getSpecialAssets()
      return data
    },
    {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  )

  const { data: issuers, isLoading: isIssuerLoading, refetch } = useQuery(
    [Query.Issuers, api],
    async () => {
      const { data } = await api.getRecommendIssuers()
      return data
    },
    {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  )

  const { data: notifications, isLoading: isNotificationsLoading } = useQuery(
    [Query.Notifications, api],
    async () => {
      const { data } = await api.getNotifications()
      return data
    },
    {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  )

  return (
    <Container className="content">
      <Notifications
        banners={notifications?.['Notification::Banner']}
        announcements={notifications?.['Notification::Announcement']}
        isLoading={isNotificationsLoading}
      />
      <div className="header">
        <h3 className="h3">{t('explore.hotest')}</h3>
      </div>
      <div className="row">
        {isHotestLoading ? (
          <>
            <Skeleton
              variant="rect"
              width={186}
              height={295}
              style={{ minWidth: '186px' }}
            />
            <Skeleton
              variant="rect"
              width={186}
              height={295}
              style={{ minWidth: '186px' }}
            />
            <Skeleton
              variant="rect"
              width={186}
              height={295}
              style={{ minWidth: '186px' }}
            />
          </>
        ) : (
          hotest?.slice(0, 8).map((token) => {
            return (
              <Card token={token} key={token.uuid} isHorizontal oneLineName />
            )
          })
        )}
      </div>
      <div className="header">
        <h3 className="h3">{t('explore.collections')}</h3>
      </div>
      <div className="row">
        {isSpecialAssetLoading ? (
          <>
            <Skeleton
              variant="rect"
              width={250}
              style={{ minWidth: '250px' }}
              height={286}
            />
            <Skeleton
              variant="rect"
              width={250}
              style={{ minWidth: '250px' }}
              height={286}
            />
          </>
        ) : (
          collections?.special_categories?.map((c) => {
            return <Collection collection={c} key={c.name} />
          })
        )}
      </div>
      <div className="header">
        <h3 className="h3">{t('explore.issuers')}</h3>
      </div>
      <div className="row">
        {isIssuerLoading ? (
          <>
            <Skeleton
              variant="rect"
              width={250}
              style={{ minWidth: '250px' }}
              height={146}
            />
            <Skeleton
              variant="rect"
              width={250}
              style={{ minWidth: '250px' }}
              height={146}
            />
          </>
        ) : (
          issuers?.map((c) => {
            return (
              <RecommendIssuser issuer={c} key={c.uuid} afterToggle={refetch} />
            )
          })
        )}
      </div>
    </Container>
  )
}
