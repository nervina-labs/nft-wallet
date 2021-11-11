import React, { useMemo } from 'react'
import QRCode from 'qrcode.react'
import { useTranslation } from 'react-i18next'
import { Text, Center, Button } from '@mibao-ui/components'
import { useClipboard } from '@chakra-ui/react'
import { useToast } from '../../hooks/useToast'

export const Info: React.FC<{ address: string }> = ({ address = '' }) => {
  const { t } = useTranslation('translations')
  const { onCopy } = useClipboard(address)
  const toast = useToast()

  const qrCodeContent = useMemo(
    () => (
      <>
        <Center bg="white" borderRadius="22px" padding="14px" marginY="24px">
          <QRCode
            style={{ width: '190px', height: '190px' }}
            className="qr-code"
            value={address}
          />
        </Center>
      </>
    ),
    [address]
  )
  return (
    <>
      <Center
        paddingX="14px"
        paddingTop="24px"
        paddingBottom="16px"
        bg="rgba(255, 255, 255, 0.7)"
        borderRadius="22px"
        flexDirection="column"
      >
        <Text fontSize="12px">{t('account.qrcode')}</Text>
        {qrCodeContent}
        <Text fontSize="12px">{t('account.address')}</Text>
        <Center
          bg="white"
          padding="14px"
          borderRadius="10px"
          w="100%"
          mt="12px"
        >
          <Text
            color="gray.500"
            fontSize="12px"
            wordBreak="break-all"
            textAlign="center"
          >
            {address}
          </Text>
        </Center>
        <Button
          mt="16px"
          onClick={() => {
            onCopy()
            toast(t('info.copied'))
          }}
          size="sm"
          colorScheme="primary"
          borderRadius="10px"
          fontWeight="normal"
          variant="solid"
          fontSize="12px"
          padding="8px 20px"
        >
          {t('info.copy')}
        </Button>
      </Center>
    </>
  )
}
