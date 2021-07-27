import React from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import styled from 'styled-components'
import { Card } from './card'
import { useWalletModel } from '../../hooks/useWallet'
import { ClassSortType, Query } from '../../models'
import { Collection } from './Collection'
import { RecommendIssuser } from './Issuer'

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
  }
`

export const Home: React.FC = () => {
  const [t] = useTranslation('translations')
  const { api } = useWalletModel()
  const { data: hotest } = useQuery(
    [Query.NFTDetail, api],
    async () => {
      const { data } = await api.getClassListByTagId(
        'all',
        1,
        ClassSortType.Likes
      )
      return data
    },
    {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  )

  const { data: collections } = useQuery(
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

  const { data: issuers } = useQuery(
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

  return (
    <Container className="content">
      <div className="header">
        <h3 className="h3">{t('explore.hotest')}</h3>
      </div>
      <div className="row">
        {hotest?.class_list?.slice(0, 8).map((token) => {
          return <Card token={token} key={token.uuid} isHorizontal />
        })}
      </div>
      <div className="header">
        <h3 className="h3">{t('explore.collections')}</h3>
      </div>
      <div className="row">
        {collections?.special_categories?.map((c) => {
          return <Collection collection={c} key={c.name} />
        })}
      </div>
      <div className="header">
        <h3 className="h3">{t('explore.issuers')}</h3>
      </div>
      <div className="row">
        {issuers?.map((c) => {
          return <RecommendIssuser issuer={c} key={c.uuid} />
        })}
      </div>
    </Container>
  )
}
