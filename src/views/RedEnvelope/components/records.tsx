import { Box, Button, Divider, Flex } from '@chakra-ui/react'
import { Image } from '@mibao-ui/components'
import { useMemo } from 'react'
import { ReactComponent as RedEnvelopeHiddenModelIcon } from '../../../assets/svg/red-envelope-hidden-model.svg'

export const Records: React.FC<{
  isHiddenModel?: boolean
  userClaimed?: boolean
  status?: 'done' | 'closed' | 'expired'
}> = ({ status, isHiddenModel, userClaimed }) => {
  const statusText = useMemo(() => {
    if (isHiddenModel) {
      return '恭喜您抽到隐藏款'
    }
    if (userClaimed) {
      return '恭喜您领取成功!' || '您已领取过了'
    }
    if (status) {
      return {
        done: '来晚了，被抢光了',
        closed: '该红包已被发起者关闭',
        expired: '该红包已失效',
      }[status]
    }
    return '恭喜您领取成功!'
  }, [isHiddenModel, status, userClaimed])

  return (
    <Flex
      direction="column"
      alignItems="center"
      h="calc(100% - 60px)"
      textAlign="center"
    >
      <Box color="white" fontSize="12px" mb="10px" mt="50px">
        来自 test@nervina.io 分享的秘宝红包
      </Box>
      <Box color="#F9E0B7" fontSize="18px" fontWeight="bold">
        {statusText}
      </Box>

      <Box color="#F9E0B7" fontSize="16px" mb="10px" mt="50px">
        大吉大利今晚吃鸡
      </Box>
      <Button
        variant="solid"
        bg="#F9E0B7"
        w="150px"
        _hover={{
          bg: '#F9E0B7',
        }}
        _active={{
          bg: '#dac4a0',
          transition: '0s',
        }}
      >
        点击去看看
      </Button>

      <Divider
        borderBottomColor="rgba(239, 239, 239, 0.2)"
        mt="50px"
        w="calc(100% - 40px)"
      />

      <Box
        color="rgba(255, 255, 255, 0.5)"
        h="32px"
        lineHeight="32px"
        fontSize="12px"
        textAlign="left"
        w="calc(100% - 40px)"
      >
        共 2 个秘宝，已被领取 1 个，还剩 1 个
      </Box>

      <Box w="full" mt="15px" mb="60px">
        <Flex
          justify="space-between"
          alignItems="center"
          color="white"
          fontSize="14px"
          w="full"
          px="20px"
          textAlign="left"
          h="48px"
        >
          <Flex justify="center" direction="column">
            <Box w="full">ckb1q3s5...hs6tl</Box>
            <Box fontSize="12px" w="full">
              14 : 34
            </Box>
          </Flex>
          <Image src="" w="38px" h="38px" rounded="8px" />
        </Flex>
        <Flex
          justify="space-between"
          alignItems="center"
          color="white"
          fontSize="14px"
          w="full"
          px="20px"
          textAlign="left"
          h="48px"
          bg="#E47767"
        >
          <Flex justify="center" direction="column">
            <Box w="full">ckb1q3s5...hs6tl</Box>
            <Box fontSize="12px" w="full">
              14 : 34
            </Box>
          </Flex>
          <Flex lineHeight="48px" alignItems="center" fontSize="12px">
            <RedEnvelopeHiddenModelIcon />
            <Box as="span" ml="6px">
              隐藏款
            </Box>
          </Flex>
          <Image src="" w="38px" h="38px" rounded="8px" />
        </Flex>
      </Box>
    </Flex>
  )
}
