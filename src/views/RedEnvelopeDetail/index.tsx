import {
  AspectRatio,
  Box,
  Flex,
  Heading,
  Stack,
  VStack,
} from '@chakra-ui/react'
import { Progress, Image } from '@mibao-ui/components'
import styled from 'styled-components'
import { Appbar } from '../../components/Appbar'
import { MainContainer } from '../../styles'
import { isSupportWebp } from '../../utils'

const Container = styled(MainContainer)`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  position: relative;

  .bg-part-1 {
    position: absolute;
    width: 155px;
    height: 155px;
    right: 50px;
    top: -30px;
    background: #ffeb90;
    filter: blur(80px);
    z-index: 1;
  }

  .bg-part-2 {
    position: absolute;
    width: 120px;
    height: 120px;
    right: -30px;
    top: 20px;
    background: #ffa4e0;
    filter: blur(80px);
    z-index: 1;
  }
`

export const RedEnvelopeDetail: React.FC = () => {
  const isClosed = false

  return (
    <Container position="relative">
      <Box position="relative" zIndex={1}>
        <Appbar transparent title={'红包详情'} />
      </Box>

      <Box
        position="absolute"
        h="280px"
        top="0"
        left="0"
        w="full"
        overflow="hidden"
        zIndex={0}
      >
        <AspectRatio
          bg="linear-gradient(192.04deg, #DAF1FF 44.62%, #FFF0DF 100%)"
          radio={1 / 1}
          position="absolute"
          w="200%"
          rounded="100%"
          bottom="0"
          left="-50%"
        >
          <Box />
        </AspectRatio>
        <Box className="bg-part-1" />
        <Box className="bg-part-2" />
      </Box>
      <Box position="relative" zIndex={1}>
        <Flex h="110px" justify="space-between" px="20px">
          <Stack spacing="4px" my="auto">
            <Heading fontSize="26px" fontWeight="500" color={'#777E90'}>
              进行中
            </Heading>
            <Box fontSize="12px">发起时间：2021-07-10 12:12:12</Box>
          </Stack>
        </Flex>
        <Box
          px="15px"
          py="20px"
          bg="white"
          shadow="0px 4px 16px rgba(0, 0, 0, 0.08)"
          rounded="20px"
          mx="20px"
        >
          <Box fontSize="16px" mb="16px">
            领取进度
          </Box>
          <Progress
            value={20}
            colorScheme={isClosed ? 'gray' : 'process'}
            mb="8px"
            height="8px"
          />
          <Flex fontSize="12px" justify="space-between">
            <Box>已领取：1</Box>
            <Box>剩余：1</Box>
          </Flex>
        </Box>
        <Heading
          fontSize="12px"
          mt="32px"
          mb="15px"
          color="primary.600"
          mx="20px"
          fontWeight="normal"
        >
          红包包含下面所有NFT
        </Heading>
        <VStack spacing="10px" mx="20px">
          <Flex w="full">
            <Image
              src={
                'https://oss.jinse.cc/production/7744ffc9-81b1-4c4e-a711-0536eb8bf10a.png'
              }
              resizeScale={300}
              webp={isSupportWebp()}
              customizedSize={{
                fixed: 'large',
              }}
              w="50px"
              h="50px"
              rounded="16px"
            />
            <Flex
              justify="center"
              fontSize="14px"
              ml="10px"
              mr="auto"
              direction="column"
            >
              <Box
                color="#000"
                whiteSpace="nowrap"
                textOverflow="ellipsis"
                overflow="hidden"
              >
                未知世界2 ...
              </Box>
              <Box
                fontSize="12px"
                whiteSpace="nowrap"
                textOverflow="ellipsis"
                overflow="hidden"
              >
                #8
              </Box>
            </Flex>
            <Box my="auto" fontSize="14px">
              已领取
            </Box>
          </Flex>
        </VStack>
      </Box>
    </Container>
  )
}
