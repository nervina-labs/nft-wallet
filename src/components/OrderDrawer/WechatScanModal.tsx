import React from 'react'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Center,
  Text,
} from '@mibao-ui/components'
import {
  isWechatScanModalOpenAtom,
  useCloseWechatScanModal,
  useOrderPrice,
  wechatPaymentQrCodeAtom,
} from '../../hooks/useOrder'
import { useAtomValue } from 'jotai/utils'
import { useTranslation } from 'react-i18next'
import QRCode from 'qrcode.react'

export const WechatScanModal: React.FC = () => {
  const isOpen = useAtomValue(isWechatScanModalOpenAtom)
  const closeModal = useCloseWechatScanModal()
  const [t] = useTranslation('translations')
  const { prime, decimal } = useOrderPrice()
  const qrcode = useAtomValue(wechatPaymentQrCodeAtom)
  return (
    <Modal isOpen={isOpen} onClose={closeModal} isCentered>
      <ModalOverlay />
      <ModalContent borderRadius="22px" width="325px" py="0">
        <ModalBody>
          <Center borderRadius="22px" bg="white" flexDirection="column">
            <Text fontSize="16px" mb="8px">
              {t('orders.wechat.buy')}
            </Text>
            <Text color="#5065E5" fontSize="18px" mb="28px" textAlign="center">
              {prime}
              <Text fontSize="14px" as="span">
                .{decimal}
              </Text>
            </Text>
            <Center borderRadius="22px" bg="#E6E8EC" padding="14px" mb="12px">
              <QRCode
                style={{ width: '100%', height: '100%', borderRadius: '14px' }}
                className="qr-code"
                value={qrcode}
              />
            </Center>
            <Text fontSize="12px" px="12px" whiteSpace="pre-wrap">
              {t('orders.wechat.desc')}
            </Text>
          </Center>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
