import { InputAdornment, makeStyles } from '@material-ui/core'
import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { useHistory } from 'react-router-dom'
import { useConfirm } from '../../hooks/useConfirm'
import { usePrevious } from '../../hooks/usePrevious'
import { useSetServerProfile } from '../../hooks/useProfile'
import { Query } from '../../models'
import { DrawerConfig } from './DrawerConfig'
import { InputBaseFix } from './InputMod'
import { useRoute } from '../../hooks/useRoute'

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
  const prevValue = usePrevious(value)
  const len = useMemo(() => {
    if (value.length >= 100) return 100
    return value.length
  }, [value])
  const confirm = useConfirm()

  const classes = useStyles()

  const [isSaving, setIsSaving] = useState(false)
  const history = useHistory()
  const setRemoteProfile = useSetServerProfile()
  const qc = useQueryClient()
  const route = useRoute()
  const onSave = useCallback(async () => {
    if (isSaving) {
      return
    }
    setIsSaving(true)
    try {
      await setRemoteProfile({
        description: value,
      })
      history.replace(route.from)
    } catch (error) {
      //
      console.log(error)
    } finally {
      await qc.refetchQueries(Query.Profile)
      setIsSaving(false)
    }
  }, [value, setRemoteProfile, history, isSaving, qc, route])

  useEffect(() => {
    if (!open) {
      setValue(desc ?? '')
    }
  }, [open, desc])

  const onClose = useCallback(() => {
    if (prevValue !== value) {
      confirm(t('profile.save-edit'), onSave, close).catch(Boolean)
    } else {
      close()
    }
  }, [onSave, close, t, prevValue, value, confirm])

  return (
    <DrawerConfig
      isDrawerOpen={open}
      close={onClose}
      title={t('profile.desc.edit')}
      isValid={len <= 100}
      isSaving={isSaving}
      onSaving={onSave}
    >
      <div className="username">
        <InputBaseFix
          className={classes.input}
          placeholder={t('profile.desc.placeholder')}
          type="text"
          value={value}
          multiline
          rows={8}
          formatter={(v: string) => v.slice(0, 100)}
          onChange={(e: any) => {
            setValue(e.target.value)
          }}
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
