import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { RedeemStatus } from '../../models/redeem'
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
  // const history = useHistory()
  // const location = useLocation()
  const text = useMemo(() => {
    if (status === RedeemStatus.Closed) {
      return t('exchange.event.closed')
    } else if (status === RedeemStatus.Done) {
      return t('exchange.event.end')
    }
    if (isReedemable) {
      return t('exchange.actions.redeem')
    }
    return t('exchange.actions.insufficient')
  }, [isReedemable, status, t])
  const onClick = () => {}
  return (
    <Container>
      <Button
        {...props}
        onClick={props.onClick ?? onClick}
        disabled={props.disabled || !isReedemable}
      >
        {text}
      </Button>
    </Container>
  )
}
