import { makeStyles } from '@material-ui/core'
import React, { useEffect, useReducer } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { RedeemDrawer } from './Drawer'
import { InputBaseFix } from '../Profile/InputMod'
import styled from 'styled-components'
import { Footer } from './Footer'
import { CustomRewardType, RedeemStatus } from '../../models/redeem'
import Alert from '@material-ui/lab/Alert'
import { useSignRedeem } from '../../hooks/useRedeem'

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
    fontSize: '14px',
  },
}))

export interface SubmitAddressProps {
  open: boolean
  close: () => void
  status: RedeemStatus
  willDestroyed: boolean
  id: string
}

const Container = styled(RedeemDrawer)`
  .label {
    font-size: 14px;
    margin: 8px 0;
  }
`

export interface FormState {
  name?: string
  phone?: string
  address?: string
  email?: string
  ckb?: string
}

export interface FormAction {
  key: keyof FormState
  value: string
}

export const SubmitEmail: React.FC<SubmitAddressProps> = ({
  open,
  close,
  status,
  willDestroyed,
  id,
}) => {
  const [t] = useTranslation('translations')
  const location = useLocation<FormState>()
  const routerState = location.state ?? { email: '' }
  const [formState, dispatch] = useReducer(
    (prevState: FormState, { key, value }: FormAction) => {
      return { ...prevState, [key]: value }
    },
    routerState
  )
  const classes = useStyles()

  useEffect(() => {
    if (!open) {
      dispatch({ key: 'email', value: routerState.email ?? '' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const isReadyForSumit = !!formState.email
  const { onRedeem, isRedeeming } = useSignRedeem()

  return (
    <Container
      isDrawerOpen={open}
      close={close}
      title={t('exchange.form.email.title')}
      isValid
    >
      <div className="container">
        <div className="label">{t('exchange.form.email.label')}</div>
        <InputBaseFix
          className={classes.input}
          placeholder={t('exchange.form.email.placeholder')}
          type="email"
          value={formState.email}
          onChange={(e: any) =>
            dispatch({ key: 'email', value: e.target.value })
          }
        />
        <Alert severity="error">
          {t(`exchange.warning${willDestroyed ? '-destroyed' : ''}`)}
        </Alert>
      </div>
      <Footer
        status={status}
        isReedemable
        isLoading={isRedeeming}
        willDestroyed={willDestroyed}
        onClick={() => {
          onRedeem({
            deliverType: CustomRewardType.None,
            isAllow: true,
            customData: { email: formState.email },
            id,
            willDestroyed,
          })
        }}
        disabled={!isReadyForSumit}
      />
    </Container>
  )
}
