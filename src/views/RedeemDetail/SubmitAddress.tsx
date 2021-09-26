import { makeStyles } from '@material-ui/core'
import React, { useReducer } from 'react'
import { useTranslation } from 'react-i18next'
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
  name: string
  phone: string
  address: string
}

export interface FormAction {
  key: keyof FormState
  value: string
}

export const SubmitAddress: React.FC<SubmitAddressProps> = ({
  open,
  close,
  status,
  willDestroyed,
  id,
}) => {
  const [t] = useTranslation('translations')
  const [formState, dispatch] = useReducer(
    (prevState: FormState, { key, value }: FormAction) => {
      return { ...prevState, [key]: value }
    },
    { name: '', phone: '', address: '' }
  )
  const classes = useStyles()

  const isReadyForSumit = !!(
    formState.address &&
    formState.name &&
    formState.phone
  )

  const { onRedeem, isRedeeming } = useSignRedeem()

  return (
    <Container
      isDrawerOpen={open}
      close={() => {
        dispatch({ key: 'name', value: '' })
        dispatch({ key: 'phone', value: '' })
        dispatch({ key: 'address', value: '' })
        close()
      }}
      title={t('exchange.form.address.title')}
      isValid
    >
      <div className="container">
        <div className="label">{t('exchange.form.address.name-label')}</div>
        <InputBaseFix
          className={classes.input}
          placeholder={t('exchange.form.address.name-placeholder')}
          type="text"
          value={formState.name}
          onChange={(e: any) =>
            dispatch({ key: 'name', value: e.target.value })
          }
        />
        <div className="label">{t('exchange.form.address.phone-label')}</div>
        <InputBaseFix
          className={classes.input}
          placeholder={t('exchange.form.address.phone-placeholder')}
          type="text"
          value={formState.phone}
          onChange={(e: any) =>
            dispatch({ key: 'phone', value: e.target.value })
          }
        />
        <div className="label">{t('exchange.form.address.address-label')}</div>
        <InputBaseFix
          className={classes.input}
          placeholder={t('exchange.form.address.address-placeholder')}
          type="text"
          multiline
          rows={6}
          value={formState.address}
          onChange={(e: any) =>
            dispatch({ key: 'address', value: e.target.value })
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
        onClick={() => {
          onRedeem({
            deliverType: CustomRewardType.None,
            isAllow: true,
            customData: {
              phone_number: formState.phone,
              name: formState.name,
              address: formState.address,
            },
            id,
            willDestroyed,
          })
        }}
        disabled={!isReadyForSumit}
      />
    </Container>
  )
}
