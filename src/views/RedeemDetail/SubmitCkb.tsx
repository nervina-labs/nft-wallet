import { makeStyles, InputAdornment } from '@material-ui/core'
import React, { useEffect, useReducer } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { RedeemDrawer } from './Drawer'
import { InputBaseFix } from '../Profile/InputMod'
import styled from 'styled-components'
import { Footer } from './Footer'
import { CustomRewardType, RedeemStatus } from '../../models/redeem'
import Alert from '@material-ui/lab/Alert'
import { useWalletModel } from '../../hooks/useWallet'
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

export const SubmitCkb: React.FC<SubmitAddressProps> = ({
  open,
  close,
  status,
  willDestroyed,
  id,
}) => {
  const [t] = useTranslation('translations')
  const location = useLocation<FormState>()
  const { address } = useWalletModel()
  const routerState = location.state ?? { ckb: '' }
  const [formState, dispatch] = useReducer(
    (prevState: FormState, { key, value }: FormAction) => {
      return { ...prevState, [key]: value }
    },
    routerState
  )
  const classes = useStyles()

  useEffect(() => {
    if (!open) {
      dispatch({ key: 'ckb', value: routerState.ckb ?? '' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const isReadyForSumit = !!formState.ckb

  const { onRedeem, isRedeeming } = useSignRedeem()

  return (
    <Container
      isDrawerOpen={open}
      close={close}
      title={t('exchange.form.ckb.title')}
      isValid
    >
      <div className="container">
        <div className="label">{t('exchange.form.ckb.label')}</div>
        <InputBaseFix
          className={classes.input}
          placeholder={t('exchange.form.ckb.placeholder')}
          type="text"
          value={formState.ckb}
          multiline
          rows={6}
          onChange={(e: any) => dispatch({ key: 'ckb', value: e.target.value })}
          endAdornment={
            <InputAdornment position="end" className="adornment-container">
              <span
                className="adornment"
                onClick={() => dispatch({ key: 'ckb', value: address })}
              >
                {t('exchange.form.ckb.fill')}
              </span>
            </InputAdornment>
          }
        />
        <Alert severity="error">
          {t(`exchange.warning${willDestroyed ? '-destroyed' : ''}`)}
        </Alert>
      </div>
      <Footer
        status={status}
        isReedemable
        willDestroyed={willDestroyed}
        isLoading={isRedeeming}
        onClick={() =>
          onRedeem({
            deliverType: CustomRewardType.Ckb,
            isAllow: true,
            customData: { ckb_address: formState.ckb },
            id,
            willDestroyed,
          })
        }
        disabled={!isReadyForSumit}
      />
    </Container>
  )
}
