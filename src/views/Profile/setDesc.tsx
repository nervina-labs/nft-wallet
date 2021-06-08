import { InputAdornment, InputBase, makeStyles } from '@material-ui/core'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DrawerConfig } from './DrawerConfig'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 400,
  },
  input: {
    flex: 1,
    width: '100%',
    background: '#FBFBFC',
    border: '1px solid #EAEAEA',
    borderRadius: '8px',
    padding: '11px 16px',
    paddingBottom: '26px',
    fontSize: '14px',
    alignItems: 'flex-end',
    flexDirection: 'column',
  },
}))

export interface SetUsernameProps {
  open: boolean
  close: () => void
  desc?: string
}

export const SetDesc: React.FC<SetUsernameProps> = ({ open, close, desc }) => {
  const [t] = useTranslation('translations')
  const [value, setValue] = useState(desc ?? '')
  const len = useMemo(() => {
    return value.length
  }, [value])

  const classes = useStyles()

  useEffect(() => {
    if (!open) {
      setValue(desc ?? '')
    }
  }, [open, desc])
  return (
    <DrawerConfig
      isDrawerOpen={open}
      close={close}
      title={t('profile.desc.edit')}
      isValid={len <= 100}
    >
      <div className="username">
        <InputBase
          className={classes.input}
          placeholder={t('profile.desc.placeholder')}
          type="text"
          value={value}
          multiline
          rows={8}
          onChange={(e) => setValue(e.target.value)}
          endAdornment={
            <InputAdornment position="end" style={{ alignItems: 'baseline' }}>
              <span className="adornment">{`${len}/100`}</span>
            </InputAdornment>
          }
        />
      </div>
    </DrawerConfig>
  )
}
