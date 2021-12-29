import React from 'react'
import styled from 'styled-components'
import { RoutePath } from '../../routes'
import { MainContainer } from '../../styles'
import { ReactComponent as FullLogo } from '../../assets/svg/full-logo.svg'
import { Appbar, AppbarButton } from '../../components/Appbar'
import { ReactComponent as BackSvg } from '../../assets/svg/back.svg'
import AccountBg from '../../assets/img/account-bg.png'
import { useHistory, Link, useParams, Redirect } from 'react-router-dom'
import { Center, Heading, Text, Box } from '@mibao-ui/components'
import { ReactComponent as SuccessSvg } from '../../assets/svg/order-success.svg'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useGetAndSetAuth } from '../../hooks/useProfile'
import { Query } from '../../models'
import { IS_WEXIN } from '../../constants'
import { OrderState } from '../../models/order'
import {
  useAccount,
  useAccountStatus,
  useLogin,
  WalletType,
  useAPI,
} from '../../hooks/useAccount'
import { useRouteQuery } from '../../hooks/useRouteQuery'

const Container = styled(MainContainer)`
  display: flex;
  align-items: center;
  flex-direction: column;
  background: white;
  background: url(${AccountBg});
  background-size: cover;
  background-repeat: repeat-y;
  height: 100%;

  .footer {
    position: fixed;
    bottom: 20px;
    display: flex;
    justify-content: center;
    width: 100%;
    max-width: 500px;
  }
`

export const OrderStatus: React.FC = () => {
  const history = useHistory()
  const [t] = useTranslation('translations')
  const getAuth = useGetAndSetAuth()
  const api = useAPI()
  const { id } = useParams<{ id: string }>()
  const { walletType } = useAccount()
  const { isLogined } = useAccountStatus()
  const { login } = useLogin()
  const { data: order, isError } = useQuery(
    [Query.OrderDetail, id, api],
    async () => {
      if (isLogined && walletType && walletType === WalletType.Metamask) {
        await login(walletType)
      }
      const auth = await getAuth()
      const { data } = await api.getOrderDetail(id, auth)
      return data.token_order
    },
    {
      enabled: id != null,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      cacheTime: IS_WEXIN ? 0 : undefined,
    }
  )

  const redirectFrom = useRouteQuery('redirect_from', '')

  if (order?.token_class_uuid) {
    const state = order?.state
    if (state === OrderState.OrderPlaced) {
      const toURL =
        decodeURIComponent(redirectFrom) || `/class/${order?.token_class_uuid}`
      return <Redirect to={`${toURL}?from_wechat=true`} />
    }
  }

  if (isError) {
    return <Redirect to={RoutePath.NotFound} />
  }

  const isPaid =
    order?.state === OrderState.Paid || order?.state === OrderState.Done

  if (!isPaid) {
    return null
  }

  return (
    <Container>
      <Appbar
        transparent
        left={
          <AppbarButton
            onClick={() => {
              history.replace(RoutePath.PaidOrders)
            }}
          >
            <BackSvg />
          </AppbarButton>
        }
      />
      <Box w="100%" px="24px" mt="50px">
        <Center
          height="390px"
          flexDirection="column"
          w="100%"
          bg="rgba(255, 255, 255, 0.7)"
          borderRadius="22px"
        >
          <SuccessSvg />
          <Heading fontSize="30px" mb="30px" mt="20px">
            {t('orders.success')}
          </Heading>
          <Text color="#FF5C00" mb="20px">
            {t('orders.send-soon')}
          </Text>
          <Text fontSize="18px" color="#23262F">
            {t('orders.be-patient')}
          </Text>
        </Center>
      </Box>
      <Center mt="40px" textDecoration="underline">
        <Link to={RoutePath.PaidOrders}>{t('orders.check')}</Link>
      </Center>
      <footer className="footer">
        <FullLogo />
      </footer>
    </Container>
  )
}
