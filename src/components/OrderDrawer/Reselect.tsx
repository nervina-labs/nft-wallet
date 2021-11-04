import React from 'react'
import { useTranslation } from 'react-i18next'
import { Stack, HStack, Text, Center, Box } from '@mibao-ui/components'
import {
  OrderStep,
  PaymentChannel,
  useSetChannel,
  useSetOrderStep,
} from '../../hooks/useOrder'
import { ReactComponent as NextStepSvg } from '../../assets/svg/next-step.svg'
import { BOWSER_BROWSER, IS_WEXIN } from '../../constants'
import { Payment } from './Payment'

interface ItemProps {
  channel: PaymentChannel
}

const Item: React.FC<ItemProps> = ({ channel }) => {
  const setChannel = useSetChannel()
  const setStep = useSetOrderStep()
  const onClick = async () => {
    setChannel(channel)
    setStep(OrderStep.ConfirmOrder)
  }
  return (
    <HStack justifyContent="space-between" cursor="pointer" onClick={onClick}>
      <Payment channel={channel} size="big" />
      <NextStepSvg />
    </HStack>
  )
}

export const Reselect = () => {
  const [t] = useTranslation('translations')
  return (
    <>
      <Center className="header" mt="12px">
        <Box w="40px"></Box>
        <Text flex={1} fontSize="20px" textAlign="center">
          {t('orders.drawer.select-title')}
        </Text>
        <Box w="40px" />
      </Center>
      <Stack mt="32px" spacing="30px">
        <Item
          channel={
            IS_WEXIN ? PaymentChannel.WechatPub : PaymentChannel.WechatMobile
          }
        />
        <Item
          channel={
            BOWSER_BROWSER.getPlatformType() === 'desktop'
              ? PaymentChannel.AlipayPC
              : PaymentChannel.AlipayMobile
          }
        />
        <Item channel={PaymentChannel.Paypal} />
      </Stack>
    </>
  )
}
