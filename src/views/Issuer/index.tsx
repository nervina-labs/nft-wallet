import React, { useCallback } from 'react'
import styled from 'styled-components'
import { IssuerInfo } from './info'
import { NftCards } from './nftCards'
import { useTranslation } from 'react-i18next'
import { ReactComponent as BackSvg } from '../../assets/svg/back.svg'
import { ReactComponent as ShareSvg } from '../../assets/svg/share.svg'
import { Appbar, HEADER_HEIGHT } from '../../components/Appbar'
import { useHistory } from 'react-router-dom'
import { useRouteQuery } from '../../hooks/useRouteQuery'
import { QUERY_PRE_URL } from '../../constants'

const IssuerContainer = styled.main`
  --max-width: 500px;
  position: relative;
  max-width: var(--max-width);
  margin: 0 auto;

  .appbar {
    max-width: var(--max-width);
  }
`

export const useIssuerPath = (uuid: string): string => {
  const { location } = useHistory()
  return `/issuer/${uuid}?${QUERY_PRE_URL}=${location.pathname}`
}

export const Issuer: React.FC = () => {
  const [t] = useTranslation('translations')
  const history = useHistory()
  const preUrl = useRouteQuery<string>(QUERY_PRE_URL, '')
  const onBack = useCallback(() => {
    if (preUrl) {
      history.push(preUrl)
      return
    }
    history.goBack()
  }, [preUrl, history])

  return (
    <IssuerContainer>
      <Appbar
        className="appbar"
        title={t('issuer.title')}
        left={<BackSvg onClick={onBack} />}
        right={<ShareSvg />}
      />
      <div style={{ height: `${HEADER_HEIGHT}px` }} />
      <IssuerInfo />
      <NftCards />
    </IssuerContainer>
  )
}
