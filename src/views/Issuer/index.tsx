import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { IssuerInfo } from './info'
import { NftCards } from './nftCards'
import { useTranslation } from 'react-i18next'
import { ReactComponent as BackSvg } from '../../assets/svg/back.svg'
import { ReactComponent as ShareSvg } from '../../assets/svg/share.svg'
import { Appbar, HEADER_HEIGHT } from '../../components/Appbar'
import { useHistory } from 'react-router-dom'
import { Share } from '../../components/Share'
import { PosterType } from '../../components/Share/posters/poster.interface'
import { useQuery } from 'react-query'
import { Query } from '../../models'
import { useWalletModel } from '../../hooks/useWallet'
import { useParams } from 'react-router'
import { IssuerInfoResult, IssuerTokenClass } from '../../models/issuer'

const IssuerContainer = styled.main`
  --max-width: 500px;
  position: relative;
  max-width: var(--max-width);
  margin: 0 auto;

  .appbar {
    max-width: var(--max-width);
  }
`

export const AppbarContainer: React.FC<{
  issuerInfo?: IssuerInfoResult
  tokenClasses?: IssuerTokenClass[]
}> = ({ issuerInfo, tokenClasses }) => {
  const [t] = useTranslation('translations')
  const history = useHistory()
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const closeShareDialog = useCallback(() => setIsShareDialogOpen(false), [])

  return (
    <>
      <Appbar
        className="appbar"
        title={t('issuer.title')}
        left={<BackSvg onClick={() => history.goBack()} />}
        right={<ShareSvg onClick={() => setIsShareDialogOpen(true)} />}
      />
      {issuerInfo && (
        <Share
          isDialogOpen={isShareDialogOpen}
          closeDialog={closeShareDialog}
          displayText={location.href}
          copyText={location.href}
          type={PosterType.Issuer}
          data={{
            issuerInfo: issuerInfo,
            tokenClasses: tokenClasses ?? [],
          }}
        />
      )}
    </>
  )
}

export const Issuer: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { api } = useWalletModel()
  const history = useHistory()

  const issuerInfoQuery = useQuery([Query.Issuers, api, id], async () => {
    const { data } = await api.getIssuerInfo(id)
    return data
  })
  const [tokenClasses, setTokenClasses] = useState<IssuerTokenClass[]>([])

  if (issuerInfoQuery.error) {
    history.replace('/404')
  }
  console.log('issuer render')

  return (
    <IssuerContainer>
      <div style={{ height: `${HEADER_HEIGHT}px` }} />
      <IssuerInfo
        data={issuerInfoQuery.data}
        isLoading={issuerInfoQuery.isLoading}
        refetch={issuerInfoQuery.refetch}
      />
      <NftCards id={id} onLoaded={setTokenClasses} />
      <AppbarContainer
        tokenClasses={tokenClasses}
        issuerInfo={issuerInfoQuery.data}
      />
    </IssuerContainer>
  )
}
