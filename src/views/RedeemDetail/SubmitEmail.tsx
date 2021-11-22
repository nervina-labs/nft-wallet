import React, { useMemo, useReducer } from 'react'
import { useTranslation } from 'react-i18next'
import { RedeemDrawer } from './Drawer'
import styled from 'styled-components'
import { Footer } from './Footer'
import { CustomRewardType, RedeemStatus } from '../../models/redeem'
import { useSignRedeem } from '../../hooks/useRedeem'
import { verifyEmail } from '../../utils'
import { Alert } from '../../components/Alert'
import { Input } from '../Profile/Input'

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
  const [formState, dispatch] = useReducer(
    (prevState: FormState, { key, value }: FormAction) => {
      return { ...prevState, [key]: value }
    },
    { email: '' }
  )

  const { onRedeem, isRedeeming } = useSignRedeem()

  const showAlert = useMemo(() => {
    if (formState.email == null) {
      return false
    }
    if (formState.email === '') {
      return false
    }
    if (verifyEmail(formState.email)) {
      return false
    }
    return true
  }, [formState.email])

  const isReadyForSumit = !!formState.email && !showAlert

  return (
    <Container
      isDrawerOpen={open}
      close={() => {
        dispatch({ key: 'email', value: '' })
        close()
      }}
      title={t('exchange.form.email.title')}
      isValid
    >
      <div className="container">
        <div className="label">{t('exchange.form.email.label')}</div>
        <Input
          placeholder={t('exchange.form.email.placeholder')}
          type="email"
          value={formState.email}
          onChange={(e: any) =>
            dispatch({ key: 'email', value: e.target.value })
          }
        />
        <div
          className="alert"
          style={{ visibility: showAlert ? 'visible' : 'hidden' }}
        >
          {t('exchange.form.email.error')}
        </div>
        <Alert mt="10px">
          {t(`exchange.warning${willDestroyed ? '-destroyed' : ''}`)}
        </Alert>
      </div>
      <Footer
        status={status}
        isRedeemable
        isInDialog
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
