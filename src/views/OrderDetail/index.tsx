import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Appbar, AppbarSticky } from '../../components/Appbar'
import { MainContainer } from '../../styles'
import {
  Center,
  Text,
  HStack,
  Button,
  Loading,
  Box,
  Heading,
} from '@mibao-ui/components'
import { useParams } from 'react-router'
import { OrderDrawer } from '../../components/OrderDrawer'
import { OrderDetail as Order, OrderState } from '../../models/order'
import { ReactComponent as OrderPlacedSvg } from '../../assets/svg/order-place.svg'
import { ReactComponent as OrderCloseSvg } from '../../assets/svg/order-close.svg'
import { ReactComponent as OrderSuccessSvg } from '../../assets/svg/order-success.svg'
import { ReactComponent as OrderSendingSvg } from '../../assets/svg/order-sending.svg'
import { useQuery } from 'react-query'
import { useAPI } from '../../hooks/useAccount'
import { Query } from '../../models'
import { useContinueOrder, useDeleteOrder } from '../../hooks/useOrder'
import { OrderCard } from '../Orders/OrderCard'
import { useGetAndSetAuth } from '../../hooks/useProfile'
import { Table, Tbody, Tr, Td } from '@chakra-ui/react'
import { formatTime } from '../../utils'

const Container = styled(MainContainer)`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  .main {
    flex: 1;
    background: #f7f7f7;
  }

  .footer {
    position: fixed;
    bottom: 20px;
    background: white;
    justify-content: center;
    width: 100%;
    max-width: 500px;
  }
`

interface RowProps {
  label: React.ReactNode
}

const Row: React.FC<RowProps> = ({ label, children }) => {
  return (
    <Tr className="row" fontSize="12px">
      <Td
        className="label"
        px={0}
        py="5px"
        wordBreak="keep-all"
        style={{ display: 'flex' }}
      >
        {label}
      </Td>
      <Td
        className="value"
        px={0}
        py="5px"
        paddingLeft="8px"
        wordBreak="break-all"
      >
        {children}
      </Td>
    </Tr>
  )
}

interface JumbotronProps {
  order: Order
}

const Jumbotron: React.FC<JumbotronProps> = ({ order }) => {
  const state = order.state
  const [t] = useTranslation('translations')
  const icon = useMemo(() => {
    switch (state) {
      case OrderState.Done:
        return <OrderSuccessSvg />
      case OrderState.Paid:
        return <OrderSendingSvg />
      case OrderState.OrderPlaced:
        return <OrderPlacedSvg />
      default:
        return <OrderCloseSvg />
    }
  }, [state])

  return (
    <Center py="35px" bg="white" mb="20px" flexDirection="column">
      {icon}
      <Text mt="8px">{t(`orders.state.${state ?? ''}`)}</Text>
    </Center>
  )
}

export const OrderDetail: React.FC = () => {
  const { t, i18n } = useTranslation('translations')

  const api = useAPI()
  const { id } = useParams<{ id: string }>()
  const getAuth = useGetAndSetAuth()
  const { data: order } = useQuery(
    [Query.OrderDetail, id, api],
    async () => {
      const auth = await getAuth()
      const { data } = await api.getOrderDetail(id, auth)
      return data.token_order
    },
    {
      enabled: id != null,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  )

  const continueOrder = useContinueOrder()

  const continuePayment = useCallback(() => {
    continueOrder({
      uuid: order?.uuid as string,
      count: Number(order?.product_count),
      currency: order?.currency as string,
      price: order?.product_price as string,
    })
  }, [continueOrder, order])
  const deleteOrder = useDeleteOrder()

  return (
    <Container>
      <AppbarSticky>
        <Appbar title={t('orders.detail')} />
      </AppbarSticky>
      {order ? (
        <section className="main">
          <Jumbotron order={order} />
          <Box marginX="20px">
            <OrderCard isInList={false} order={order} />
          </Box>
          <Box
            bg="white"
            borderRadius="22px"
            px="10px"
            py="20px"
            paddingBottom="14px"
            marginX="20px"
          >
            <Heading fontSize="16px" fontWeight={500} mb="16px">
              {t('orders.info.title')}
            </Heading>
            <Table variant="unstyled">
              <Tbody>
                {order?.ckb_address ? (
                  <Row label={t('orders.info.address')}>
                    {order?.ckb_address}
                  </Row>
                ) : null}
                {order?.uuid ? (
                  <Row label={t('orders.info.uuid')}>{order?.uuid}</Row>
                ) : null}
                {order?.created_at ? (
                  <Row label={t('orders.info.created_at')}>
                    {formatTime(order?.created_at, i18n.language, true)}
                  </Row>
                ) : null}
                {order?.paid_at ? (
                  <Row label={t('orders.info.paid_at')}>
                    {formatTime(order?.paid_at, i18n.language, true)}
                  </Row>
                ) : null}
                {order?.send_at ? (
                  <Row label={t('orders.info.send-at')}>
                    {formatTime(order?.send_at, i18n.language, true)}
                  </Row>
                ) : null}
              </Tbody>
            </Table>
          </Box>
          {order.state === OrderState.OrderPlaced ? (
            <footer className="footer">
              <HStack spacing="15px">
                <Button
                  isFullWidth
                  fontWeight="normal"
                  colorScheme="primary"
                  variant="solid"
                  onClick={continuePayment}
                >
                  {t('orders.actions.pay-and-hold')}
                </Button>
                <Button
                  isFullWidth
                  fontWeight="normal"
                  onClick={async () =>
                    await deleteOrder(order.uuid as string, continuePayment)
                  }
                >
                  {t('orders.actions.cancel')}
                </Button>
              </HStack>
            </footer>
          ) : null}
        </section>
      ) : (
        <Center>
          <Loading size="lg" />
        </Center>
      )}
      <OrderDrawer />
    </Container>
  )
}
