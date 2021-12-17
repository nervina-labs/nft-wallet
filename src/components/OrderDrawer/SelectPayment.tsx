import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Stack, HStack, Text, Loading, Center, Box } from '@mibao-ui/components'
import {
  OrderStep,
  PaymentChannel,
  useSetChannel,
  useSetOrderStep,
  useSubmitOrder,
} from '../../hooks/useOrder'
import { ReactComponent as NextStepSvg } from '../../assets/svg/next-step.svg'
import { ReactComponent as PrevStepSvg } from '../../assets/svg/prev-step.svg'
// import { IS_DESKTOP } from '../../constants'
import { Payment } from './Payment'
import { useConfirmDialog } from '../../hooks/useConfirmDialog'

interface ItemProps {
  channel: PaymentChannel
}

const Item: React.FC<ItemProps> = ({ channel }) => {
  const setChannel = useSetChannel()
  const [isLoading, setIsLoading] = useState(false)
  const submitOrder = useSubmitOrder()
  const setStep = useSetOrderStep()
  const confirmDialog = useConfirmDialog()
  const [t] = useTranslation('tranlsations')
  const onClick = async () => {
    setIsLoading(true)
    try {
      await submitOrder()
      setChannel(channel)
      setStep(OrderStep.ConfirmOrder)
    } catch (error) {
      confirmDialog({
        type: 'error',
        title: t('orders.drawer.submit-order-error'),
      })
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <HStack justifyContent="space-between" cursor="pointer" onClick={onClick}>
      <Payment channel={channel} size="big" />
      {isLoading ? <Loading size="sm" /> : <NextStepSvg />}
    </HStack>
  )
}

export const SelectPayment = () => {
  const [t] = useTranslation('translations')
  const setOrderStep = useSetOrderStep()
  return (
    <>
      <Center className="header" mt="12px">
        <Box
          w="40px"
          onClick={() => {
            setOrderStep(OrderStep.Init)
          }}
        >
          <PrevStepSvg />
        </Box>
        <Text flex={1} fontSize="20px" textAlign="center">
          {t('orders.drawer.select-title')}
        </Text>
        <Box w="40px" />
      </Center>
      <Stack mt="32px" spacing="30px">
        {/* <Item
          channel={
            IS_DESKTOP ? PaymentChannel.AlipayPC : PaymentChannel.AlipayMobile
          }
        /> */}
        {/* {IS_DESKTOP ? (
          <Item channel={PaymentChannel.WechatScan} />
        ) : (
          <Item
            channel={
              IS_WEXIN ? PaymentChannel.WechatPub : PaymentChannel.WechatMobile
            }
          />
        )} */}
        <Item channel={PaymentChannel.Paypal} />
      </Stack>
    </>
  )
}
