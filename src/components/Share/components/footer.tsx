import { Flex } from '@mibao-ui/components'
import { Box, Image } from '@chakra-ui/react'
import Logo from '../../../assets/share/logo.png'
import QRCode from 'qrcode.react'

export const Footer: React.FC<{
  url: string
}> = ({ url }) => {
  return (
    <Flex justify="space-between" mt="auto">
      <Image src={Logo} w="40px" h="40px" />

      <Box
        fontSize="12px"
        ml="auto"
        mr="8px"
        textAlign="right"
        my="auto"
        lineHeight="17px"
      >
        <Box color="#777E90">长按识别二维码</Box>
        一起欣赏这份数字藏品
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
