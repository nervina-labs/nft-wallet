import { Box, BoxProps } from '@chakra-ui/react'
import { Button, ButtonProps } from '@mibao-ui/components'
import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory, useLocation } from 'react-router'
import { useAccountStatus } from '../../hooks/useAccount'
import { RedeemStatus } from '../../models/redeem'
import { RoutePath } from '../../routes'
import { UnipassConfig } from '../../utils'

export interface FooterProps extends ButtonProps {
  status: RedeemStatus
  isRedeemable: boolean
  willDestroyed: boolean
  isInDialog?: boolean
  inDrawer?: boolean
}

export const Footer: React.FC<FooterProps> = ({
  isRedeemable,
  status,
  willDestroyed,
  isInDialog,
  inDrawer,
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
    }
    if (status === RedeemStatus.Done) {
      return t('exchange.event.end')
    }
    if (isRedeemable) {
      return t('exchange.actions.redeem')
    }
    return t('exchange.actions.insufficient')
  }, [isRedeemable, status, t, isLogined])

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
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
      return props.disabled || !isRedeemable
    }
    return false
  }, [props.disabled, isRedeemable, isLogined])

  const containerProps: BoxProps = inDrawer ? { left: '0px' } : {}

  return (
    <>
      <Box
        as="footer"
        left="unset"
        right="unset"
        {...containerProps}
        position="fixed"
        bottom="-40px"
        transform="translateY(calc(0px - var(--safe-area-inset-bottom)))"
        transition="transform 100ms"
        h="100px"
        bg="white"
        px="20px"
        pt="10px"
        pb="50px"
        mt="auto"
        mb="0"
        w="100%"
        maxW="500px"
        borderTop="1px solid #e1e1e1"
        zIndex={5}
      >
        <Button
          {...props}
          onClick={onClick}
          disabled={disabled}
          w="full"
          mx="0"
          colorScheme="primary"
          variant="solid"
        >
          {text}
        </Button>
      </Box>
      <Box h="calc(60px + var(--safe-area-inset-bottom))" mt="20px" />
    </>
  )
}
