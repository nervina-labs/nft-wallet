import { Flex } from '@mibao-ui/components'
import { Box, Image } from '@chakra-ui/react'
import Logo from '../../../assets/share/logo.png'
import QRCode from 'qrcode.react'
import { useTranslation } from 'react-i18next'

export const Footer: React.FC<{
  url: string
  text?: string
}> = ({ text, url }) => {
  const { t } = useTranslation('translations')
  return (
    <Flex justify="space-between" mt="auto">
      <Image src={Logo} w="40px" h="40px" objectFit="contain" />

      <Box
        fontSize="12px"
        ml="auto"
        mr="8px"
        textAlign="right"
        my="auto"
        lineHeight="17px"
      >
        <Box color="#777E90">{t('common.share.poster.desc-1')}</Box>
        {text ?? t('common.share.poster.desc-nft')}
      </Box>
      <QRCode
        value={url}
        style={{
          width: '40px',
          height: '40px',
          marginTop: 'auto',
        }}
      />
    </Flex>
  )
}
