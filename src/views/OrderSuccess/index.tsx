import React from 'react'
import styled from 'styled-components'
import { RoutePath } from '../../routes'
import { MainContainer } from '../../styles'
import { ReactComponent as FullLogo } from '../../assets/svg/full-logo.svg'
import { Appbar, AppbarButton } from '../../components/Appbar'
import { ReactComponent as BackSvg } from '../../assets/svg/back.svg'
import AccountBg from '../../assets/img/account-bg.png'
import { useHistory, Link } from 'react-router-dom'
import { Center, Heading, Text, Box } from '@mibao-ui/components'
import { ReactComponent as SuccessSvg } from '../../assets/svg/order-success.svg'
import { useTranslation } from 'react-i18next'

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

export const OrderSuccess: React.FC = () => {
  const history = useHistory()
  const [t] = useTranslation('translations')
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
