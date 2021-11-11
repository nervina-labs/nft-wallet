import React, { useCallback, useMemo } from 'react'
import { Order, OrderState } from '../../models/order'
import {
  Box,
  Flex,
  Issuer,
  Text,
  NftImage,
  Button,
  HStack,
} from '@mibao-ui/components'
import { useTranslation } from 'react-i18next'
import { RoutePath } from '../../routes'
import { useHistory } from 'react-router'
import { formatCurrency } from '../../utils'
import { useContinueOrder, useDeleteOrder } from '../../hooks/useOrder'

export interface OrderCardProps {
  order: Order
  isInList: boolean
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, isInList }) => {
  const [t] = useTranslation('translations')
  const history = useHistory()
  const state = order.state
  const status = useMemo(() => {
    if (!isInList) {
      return null
    }
    const isClosed =
      state === OrderState.Closed ||
      state === OrderState.Expired ||
      state === OrderState.Refunded
    return (
      <Text fontSize="12px" color={isClosed ? 'gray.500' : '#5065E5'}>
        {t(`orders.state.${state ?? ''}`)}
      </Text>
    )
  }, [t, state, isInList])
  const issuerHref = `${RoutePath.Issuer}/${order.issuer_info?.uuid as string}`
  const isNeededToPay = order.state === OrderState.OrderPlaced && isInList
  const continueOrder = useContinueOrder()

  const continuePayment = useCallback(
    (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e?.preventDefault?.()
      e?.stopPropagation?.()
      continueOrder({
        uuid: order.uuid as string,
        count: Number(order.product_count),
        currency: order.currency as string,
        price: order.product_price as string,
      })
    },
    [continueOrder, order]
  )
  const deleteOrder = useDeleteOrder()

  const gotoClassDetail = useCallback(() => {
    if (order.token_class_uuid) {
      history.push(`/class/${order.token_class_uuid}`)
    }
  }, [history, order])

  return (
    <Box
      px="10px"
      py="12px"
      mb="20px"
      bg="white"
      borderRadius="22px"
      cursor={isInList ? 'pointer' : undefined}
      onClick={() => {
        if (!order.uuid) {
          return
        }
        if (!isInList) {
          return
        }
        history.push(`${RoutePath.OrderDetail}/${order.uuid}`)
      }}
    >
      <Flex
        justifyContent="space-between"
        alignItems="center"
        className="issuer"
      >
        <Issuer
          src={order.issuer_info?.avatar_url}
          name={order.issuer_info?.name as string}
          color="black"
          href={issuerHref}
          size="25px"
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            history.push(issuerHref)
          }}
          isVerified={order.verified_info?.is_verified}
        />
        {status}
      </Flex>
      <Flex mt="20px" mb="10px" className="card">
        <NftImage
          resizeScale={200}
          type="image"
          src={order.product_image_url}
          hasCardBack={false}
          width="100px"
          height="100px"
          borderRadius="22px"
          cursor={order.token_class_uuid ? 'pointer' : undefined}
          onClick={gotoClassDetail}
        />
        <Flex flex={1} ml="16px" flexDirection="column">
          <Flex flex={1}>
            <Text noOfLines={3} fontWeight={500} flex={1} fontSize="13px">
              {order.product_name}
            </Text>
            <Flex ml="8px" flexDirection="column">
              <Text textAlign="right" fontSize="12px" mb="12px">
                {formatCurrency(order.product_price)}
              </Text>
              <Text textAlign="right" fontSize="12px" color="gray.500">
                &times;{order.product_count}
              </Text>
            </Flex>
          </Flex>
          <Flex marginTop="auto" justifyContent="flex-end" fontSize="14px">
            <Text fontWeight={500}>
              {isNeededToPay
                ? t('orders.needed-payment')
                : t('orders.paid-payment')}
            </Text>
            <Text fontWeight={500} color="#f48538">
              {formatCurrency(
                order.state === OrderState.Expired
                  ? '0'
                  : order.order_amount_total,
                order.currency
              )}
            </Text>
          </Flex>
        </Flex>
      </Flex>
      {isNeededToPay ? (
        <Flex className="actions" justifyContent="flex-end">
          <HStack>
            <Button
              size="xs"
              px="16px"
              py="4px"
              fontWeight="normal"
              onClick={async (e) => {
                e.stopPropagation()
                e.preventDefault()
                await deleteOrder(order.uuid as string, continuePayment)
              }}
            >
              {t('orders.actions.cancel')}
            </Button>
            <Button
              size="xs"
              px="16px"
              py="4px"
              fontWeight="normal"
              colorScheme="primary"
              variant="solid"
              onClick={continuePayment}
            >
              {t('orders.actions.pay-and-hold')}
            </Button>
          </HStack>
        </Flex>
      ) : null}
    </Box>
  )
}
