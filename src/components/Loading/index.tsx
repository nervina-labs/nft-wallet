import { CircularProgress } from '@material-ui/core'
import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const LoadingContainer = styled.h4`
  text-align: center;
  color: rgba(0, 0, 0, 0.6);
  .loading {
    margin-left: 10px;
  }
`

export const Loading: React.FC<{ desc?: string }> = ({ desc }) => {
  const { t } = useTranslation('translations')
  return (
    <LoadingContainer>
      {desc ?? t('common.actions.loading')}
      <CircularProgress size="1em" className="loading" />
    </LoadingContainer>
  )
}
