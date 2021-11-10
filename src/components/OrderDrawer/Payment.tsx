import React from 'react'
import { PaymentChannel } from '../../hooks/useOrder'
import { ReactComponent as AlipaySvg } from '../../assets/svg/alipay.svg'
import { ReactComponent as WechatSvg } from '../../assets/svg/wechat.svg'
import { ReactComponent as PaypalSvg } from '../../assets/svg/paypal.svg'
import { HStack, Center, Text } from '@mibao-ui/components'
import { useTranslation } from 'react-i18next'

export interface PaymentChannelProps {
  channel?: PaymentChannel
  size: 'small' | 'big'
}

export const Payment: React.FC<PaymentChannelProps> = ({ channel, size }) => {
  const [t] = useTranslation('translations')
  let icon = <WechatSvg />
  let text = t('orders.drawer.wechat')
  if (
    channel === PaymentChannel.AlipayMobile ||
    channel === PaymentChannel.AlipayPC
  ) {
    icon = <AlipaySvg />
    text = t('orders.drawer.alipay')
  } else if (channel === PaymentChannel.Paypal) {
    icon = <PaypalSvg />
    text = t('orders.drawer.paypal')
  }
  const width = size === 'big' ? '40px' : '20px'
  return (
    <HStack flex={1}>
      <Center w={width} h={width}>
        {icon}
      </Center>
      <Text fontSize={size === 'big' ? '16px' : '12px'}>{text}</Text>
    </HStack>
  )
}
