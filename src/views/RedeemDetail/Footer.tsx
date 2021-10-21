import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory, useLocation } from 'react-router'
import styled from 'styled-components'
import { useAccountStatus } from '../../hooks/useAccount'
import { RedeemStatus } from '../../models/redeem'
import { RoutePath } from '../../routes'
import { UnipassConfig } from '../../utils'
import { Button, ButtonProps } from '../Reedem/Button'

const Container = styled.footer`
  background: #ffffff;
  width: 100%;
  max-width: 500px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 8px 0;
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`

export interface FooterProps extends ButtonProps {
  status: RedeemStatus
  isReedemable: boolean
  willDestroyed: boolean
}

export const Footer: React.FC<FooterProps> = ({
  isReedemable,
  status,
  willDestroyed,
  ...props
}) => {
  const [t] = useTranslation('translations')
  const { isLogined } = useAccountStatus()
  const history = useHistory()
  const location = useLocation()
  const text = useMemo(() => {
    if (!isLogined) {
      return t('common.login')
    }
    if (status === RedeemStatus.Closed) {
      return t('exchange.event.closed')
    } else if (status === RedeemStatus.Done) {
      return t('exchange.event.end')
    }
    if (isReedemable) {
      return t('exchange.actions.redeem')
    }
    return t('exchange.actions.insufficient')
  }, [isReedemable, status, t, isLogined])

  const onClick = useCallback(
    (e: any) => {
      if (!isLogined) {
        UnipassConfig.setRedirectUri(location.pathname)
        history.replace(RoutePath.Login, {
          redirect: location.pathname,
        })
      }
      props.onClick?.(e)
    },
    [isLogined, history, props, location.pathname]
  )

  const disabled = useMemo(() => {
    if (isLogined) {
      return props.disabled || !isReedemable
    }
    return false
  }, [props.disabled, isReedemable, isLogined])
  return (
    <Container>
      <Button {...props} onClick={onClick} disabled={disabled}>
        {text}
      </Button>
    </Container>
  )
}
