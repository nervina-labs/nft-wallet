import React, { useState } from 'react'
import styled from 'styled-components'
import { IssuerInfo } from './info'
import { NftCards } from './nftCards'
import { useTranslation } from 'react-i18next'
import { ReactComponent as BackSvg } from '../../assets/svg/back.svg'
import { ReactComponent as ShareSvg } from '../../assets/svg/share.svg'
import { Appbar, HEADER_HEIGHT } from '../../components/Appbar'
import { useHistory } from 'react-router-dom'
import { Share } from '../../components/Share'
import { PosterType } from '../../components/Share/poster.interface'
import { useInfiniteQuery, useQuery } from 'react-query'
import { PRODUCT_STATUE_SET, ProductState, Query } from '../../models'
import { useWalletModel } from '../../hooks/useWallet'
import { useParams } from 'react-router'
import { useRouteQuery } from '../../hooks/useRouteQuery'
import { IssuerTokenClass } from '../../models/issuer'

const IssuerContainer = styled.main`
  --max-width: 500px;
  position: relative;
  max-width: var(--max-width);
  margin: 0 auto;

  .appbar {
    max-width: var(--max-width);
  }
`

const ITEM_LIMIT = 20

export const Issuer: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [t] = useTranslation('translations')
  const history = useHistory()
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const { api } = useWalletModel()
  const productState = useRouteQuery<ProductState>(
    'productState',
    'product_state'
  )

  const issuerInfoQuery = useQuery([Query.Issuers, api, id], async () => {
    const { data } = await api.getIssuerInfo(id)
    return data
  })
  const tokenClassesQuery = useInfiniteQuery(
    [Query.Issuers, api, id, productState],
    async ({ pageParam = 0 }) => {
      const productStateParam = PRODUCT_STATUE_SET.find(
        (e) => e === productState
      )
        ? productState
        : undefined

      const { data } = await api.getIssuerTokenClass(id, productStateParam, {
        page: pageParam,
      })
      return data
    },
    {
      getNextPageParam(lastPage) {
        return ITEM_LIMIT * lastPage.meta.current_page >=
          lastPage.meta.total_count
          ? undefined
          : lastPage.meta.current_page + 1
      },
      enabled: true,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  )
  const tokenClasses =
    tokenClassesQuery.data?.pages.reduce(
      (acc, page) => acc.concat(page.token_classes),
      [] as IssuerTokenClass[]
    ) ?? []

  if (issuerInfoQuery.error && tokenClassesQuery.error) {
    history.replace('/404')
  }

  return (
    <IssuerContainer>
      <Appbar
        className="appbar"
        title={t('issuer.title')}
        left={<BackSvg onClick={() => history.goBack()} />}
        right={<ShareSvg onClick={() => setIsShareDialogOpen(true)} />}
      />
      <div style={{ height: `${HEADER_HEIGHT}px` }} />
      <IssuerInfo
        data={issuerInfoQuery.data}
        isLoading={issuerInfoQuery.isLoading}
        refetch={issuerInfoQuery.refetch}
      />
      <NftCards
        id={id}
        tokenClasses={tokenClasses}
        isLoading={tokenClassesQuery.isLoading && tokenClassesQuery.isFetching}
        fetchNextPage={tokenClassesQuery.fetchNextPage}
        refetch={tokenClassesQuery.refetch}
        hasNextPage={tokenClassesQuery.hasNextPage}
      />
      {issuerInfoQuery.data && tokenClassesQuery.data && (
        <Share
          isDialogOpen={isShareDialogOpen}
          closeDialog={() => setIsShareDialogOpen(false)}
          displayText={location.href}
          copyText={location.href}
          type={PosterType.Issuer}
          data={{
            issuerInfo: issuerInfoQuery.data,
            tokenClasses: tokenClasses,
          }}
        />
      )}
    </IssuerContainer>
  )
}
