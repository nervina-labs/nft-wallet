import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Center, Text, HStack } from '@mibao-ui/components'
import {
  currentOrderInfoAtom,
  OrderStep,
  placeOrderPropsAtom,
  usePlaceOrder,
  useSetOrderStep,
} from '../../hooks/useOrder'
import { useAtomValue } from 'jotai/utils'
import { formatCurrency } from '../../utils'
import { Payment } from './Payment'
import { ReactComponent as NextStepSvg } from '../../assets/svg/next-step.svg'
import { useConfirmDialog } from '../../hooks/useConfirmDialog'
import { useHistory } from 'react-router'
import { RoutePath } from '../../routes'

export const ConfirmPayment = () => {
  const [t] = useTranslation('translations')
  const [isSubmiting, setIsSubmitting] = useState(false)
  const placeOrder = usePlaceOrder()
  const confirmDialog = useConfirmDialog()
  const hisotry = useHistory()
  const onSumit = useCallback(async () => {
    setIsSubmitting(true)
    try {
      await placeOrder()
      hisotry.push(RoutePath.OrderSuccess)
    } catch (error) {
      confirmDialog({
        type: 'error',
        title: t('orders.drawer.place-order-error'),
      })
    } finally {
      setIsSubmitting(false)
    }
  }, [placeOrder, confirmDialog, t, hisotry])
  const order = useAtomValue(currentOrderInfoAtom)
  const orderProps = useAtomValue(placeOrderPropsAtom)
  const [prime, decimal] = useMemo(() => {
    const price = order.price
    const count = orderProps.count
    const tp = formatCurrency(Number(price) * Number(count), order.currency)
    return tp.split('.')
  }, [order, orderProps])
  const setOrderStep = useSetOrderStep()

  return (
    <>
      <Center fontSize="20px" mt="12px" mb="24px">
        {t('orders.drawer.confirm-title')}
      </Center>
      <Text color="#5065E5" fontSize="30px" mb="40px" textAlign="center">
        {prime}
        <Text fontSize="14px" as="span">
          .{decimal}
        </Text>
      </Text>
      <HStack justifyContent="space-between">
        <Text fontSize="14px">{t('orders.drawer.channel')}</Text>
        <HStack
          onClick={() => {
            setOrderStep(OrderStep.Reselect)
          }}
          cursor="pointer"
        >
          <Payment channel={orderProps.channel} size="small" />
          <NextStepSvg />
        </HStack>
      </HStack>
      <Text color="gray.500" fontSize="12px" textAlign="right" mb="32px">
        {t('orders.drawer.select-more')}
      </Text>
      <Text color="#FF3C3C" fontSize="12px">
        {t('orders.drawer.warning')}
      </Text>
      <footer className="footer">
        <Button
          colorScheme="primary"
          variant="solid"
          onClick={onSumit}
          type="submit"
          isLoading={isSubmiting}
          isFullWidth
        >
          {t('orders.drawer.confirm')}
        </Button>
      </footer>
    </>
  )
}
