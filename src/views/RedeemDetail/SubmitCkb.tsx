import React, { useMemo, useReducer } from 'react'
import { useTranslation } from 'react-i18next'
import { RedeemDrawer } from './Drawer'
import styled from 'styled-components'
import { Footer } from './Footer'
import { CustomRewardType, RedeemStatus } from '../../models/redeem'
import { useSignRedeem } from '../../hooks/useRedeem'
import { verifyCkbAddress } from '../../utils'
import { useAccount } from '../../hooks/useAccount'
import { Alert } from '../../components/Alert'
import { Input } from '../Profile/Input'
import { Button, Flex } from '@mibao-ui/components'

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
  .alert {
    font-size: 10px;
    color: #d03a3a;
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
  const { address } = useAccount()
  const [formState, dispatch] = useReducer(
    (prevState: FormState, { key, value }: FormAction) => {
      return { ...prevState, [key]: value }
    },
    { ckb: '' }
  )

  const { onRedeem, isRedeeming } = useSignRedeem()

  const showAlert = useMemo(() => {
    if (formState.ckb == null) {
      return false
    }
    if (formState.ckb === '') {
      return false
    }
    if (verifyCkbAddress(formState.ckb)) {
      return false
    }
    return true
  }, [formState.ckb])

  const isReadyForSumit = !!formState.ckb && !showAlert

  return (
    <Container
      isDrawerOpen={open}
      close={() => {
        dispatch({ key: 'ckb', value: '' })
        close()
      }}
      title={t('exchange.form.ckb.title')}
      isValid
    >
      <div className="container">
        <div className="label">{t('exchange.form.ckb.label')}</div>
        <Input
          placeholder={t('exchange.form.ckb.placeholder')}
          type="text"
          value={formState.ckb}
          isTextarea
          onChange={(e: any) => dispatch({ key: 'ckb', value: e.target.value })}
        />
        <Flex justifyContent="space-between" alignItems="center">
          <div
            className="alert"
            style={{ visibility: showAlert ? 'visible' : 'hidden', margin: 0 }}
          >
            {t('exchange.form.ckb.error')}
          </div>
          <Button
            className="adornment"
            size="xs"
            onClick={() => dispatch({ key: 'ckb', value: address })}
          >
            {t('exchange.form.ckb.fill')}
          </Button>
        </Flex>
        <Alert
          mt="10px"
          borderRadius="8px"
          bg="rgba(255, 206, 166, 0.1)"
          color="#FF5C00"
        >
          {t(`exchange.warning${willDestroyed ? '-destroyed' : ''}`)}
        </Alert>
      </div>
      <Footer
        status={status}
        isRedeemable
        isInDialog
        inDrawer
        willDestroyed={willDestroyed}
        isLoading={isRedeeming}
        onClick={() =>
          onRedeem({
            deliverType: CustomRewardType.None,
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
