import { Box, Divider, Flex, Heading, HStack } from '@chakra-ui/react'
import { Issuer, Image, Button, Progress } from '@mibao-ui/components'
import { isSupportWebp } from '../../../utils'
import { ReactComponent as RedEnvelopeShare } from '../../../assets/svg/red-envelope-share.svg'

export const Card: React.FC = () => {
  const isClosed = false
  return (
    <Box
      shadow="0 0 8px rgba(0, 0, 0, 0.08)"
      rounded="22px"
      px="15px"
      pb="10px"
    >
      <Flex h="52px" align="center" justify="space-between">
        <Issuer
          src={
            'https://oss.jinse.cc/production/95983a3f-e573-44e9-bdca-737c1f305206.gif'
          }
          name={'用户名'}
          size="25px"
          isVerified
          webp={isSupportWebp()}
          customizedSize={{
            fixed: 'small',
          }}
          resizeScale={150}
        />
        <RedEnvelopeShare />
      </Flex>
      <Divider />
      <Heading fontSize="14px" fontWeight="bold" my="10px">
        大吉大利！好运连连
      </Heading>
      <HStack overflowX="auto" overflowY="hidden" spacing="5px">
        <Image
          src={
            'https://oss.jinse.cc/production/7744ffc9-81b1-4c4e-a711-0536eb8bf10a.png'
          }
          resizeScale={300}
          webp={isSupportWebp()}
          customizedSize={{
            fixed: 'large',
          }}
          w="60px"
          minW="60px"
          h="60px"
          rounded="16px"
        />
      </HStack>
      <Box mt="10px" fontSize="12px">
        领取进度：1/2
      </Box>
      <Progress
        value={20}
        colorScheme={isClosed ? 'gray' : 'process'}
        mb="15px"
        mt="5px"
        height="8px"
      />
      <Divider />
      <Flex mt="10px" fontSize="12px" h="25px" lineHeight="25px">
        <Box mr="auto">进行中</Box>
        <Button colorScheme="black" size="small" mr="10px" px="10px">
          查看详情
        </Button>
        <Button colorScheme="primary" size="small" px="10px">
          关闭
        </Button>
      </Flex>
    </Box>
  )
}
