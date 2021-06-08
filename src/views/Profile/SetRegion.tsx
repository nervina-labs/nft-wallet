import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DrawerConfig } from './DrawerConfig'
// import pc from 'china-division/dist/pc-code.json'

export interface SetUsernameProps {
  open: boolean
  close: () => void
  region?: string
}

export const SetRegion: React.FC<SetUsernameProps> = ({
  open,
  close,
  region,
}) => {
  const [t] = useTranslation('translations')
  const [value, setValue] = useState(region ?? '')

  useEffect(() => {
    if (!open) {
      setValue(region ?? '')
    }
  }, [open, region])
  return (
    <DrawerConfig
      isDrawerOpen={open}
      close={close}
      title={t('profile.edit-region')}
      isValid={!!value}
    >
      <div className="region">
        <div className="label">{t('profile.region.location')}</div>
        <div className="label">{t('profile.region.all')}</div>
      </div>
    </DrawerConfig>
  )
}
