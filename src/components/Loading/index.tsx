import { Loading as L, Center, CenterProps } from '@mibao-ui/components'
import React from 'react'
import { useTranslation } from 'react-i18next'

export interface LoadingProps extends CenterProps {
  desc?: string
}

export const Loading: React.FC<LoadingProps> = ({ desc, ...rest }) => {
  const { t } = useTranslation('translations')
  return (
    <Center marginY="16px" {...rest}>
      {desc ?? t('common.actions.loading')}
      <L ml="10px" size="sm" />
    </Center>
  )
}
