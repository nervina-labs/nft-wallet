import {
  AspectRatio,
  Box,
  Image,
  ListItem,
  OrderedList,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'
import { useLayoutEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { RainbowBackground } from '../../components/RainbowBackground'
import { useHtml2Canvas } from '../../hooks/useHtml2Canvas'
import DEFAULT_RED_ENVELOPE_COVER_PATH from '../../assets/svg/share-red-envelope-cover.svg'
import styled from '@emotion/styled'
import QRCode from 'qrcode.react'
import { AppbarSticky, Appbar } from '../../components/Appbar'
import {
  Button,
  Image as MibaoImage,
  Modal,
  ModalBody,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
} from '@mibao-ui/components'

const Container = styled(RainbowBackground)`
  height: auto;
  min-height: 100vh;
  align-items: center;
  display: flex;
  flex-direction: column;
`

export const ShareRedEnvelope: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { onRender, imgSrc } = useHtml2Canvas()
  const sharePosterRef = useRef<HTMLDivElement>(null)
  const qrcodeValue = 'https://mibao.net'
  const {
    isOpen: isOpenCopySucceedDialog,
    onOpen: onOpenCopySucceedDialog,
    onClose: onCloseCopySucceedDialog,
  } = useDisclosure()

  useLayoutEffect(() => {
    if (sharePosterRef.current) {
      onRender(sharePosterRef.current)
    }
  }, [id, onRender])

  return (
    <Container>
      <AppbarSticky position="relative" zIndex={1}>
        <Appbar title="分享红包" transparent />
      </AppbarSticky>
      <Box
        opacity="0"
        w="0"
        h="0"
        pointerEvents="none"
        position="fixed"
        top="0"
        left="0"
      >
        <Box
          w="375px"
          h="564px"
          mx="auto"
          position="fixed"
          zIndex={2}
          bg="#E15F4C"
          ref={sharePosterRef}
        >
          <Box w="full" h="full">
            <Box w="full" h="full">
              <Image
                src={DEFAULT_RED_ENVELOPE_COVER_PATH}
                position="absolute"
                w="full"
                h="auto"
                top="0"
                left="0"
                zIndex={0}
                objectFit="cover"
              />
              <AspectRatio
                rounded="20px"
                bg="#EA5A5A"
                border="1px solid #F9E0B7"
                w="34%"
                ratio={1 / 1}
                position="absolute"
                left="50%"
                top="30%"
                transform="translateX(-50%)"
              >
                <Box p="15px">
                  <QRCode
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                    fgColor="#F9E0B7"
                    bgColor="rgba(0, 0, 0, 0)"
                    value={qrcodeValue}
                  />
                </Box>
              </AspectRatio>
              <VStack
                position="absolute"
                top="55%"
                transform="translateX(-50%)"
                left="50%"
                w="full"
                color="#F9E0B7"
              >
                <Box
                  whiteSpace="nowrap"
                  color="white"
                  fontSize="12px"
                  style={{
                    overflow: 'initial',
                  }}
                >
                  长按识别二维码领取红包
                </Box>
                <Box
                  fontSize="24px"
                  w="calc(100% - 20px)"
                  textAlign="center"
                  mt="20px"
                >
                  大吉大利好运连连大吉大利好运连连大吉大利
                </Box>
                <Box fontSize="14px" mt="20px">
                  猜中以下谜题，抢数字藏品红包
                </Box>
                <Box color="white" fontSize="20px" mt="6px">
                  「 热爱创作 」
                </Box>
              </VStack>
            </Box>
          </Box>
        </Box>
      </Box>

      <AspectRatio
        ratio={375 / 564}
        w="calc(100% - calc(47px * 2))"
        position="relative"
        zIndex={1}
        mx="auto"
        mt="20px"
      >
        <MibaoImage src={imgSrc} />
      </AspectRatio>

      <Box fontSize="14px" my="24px" w="full" textAlign="center">
        长按图片添加到「照片」分享给朋友
      </Box>

      <Box fontSize="12px" mt="auto" mb="32px" color="#777e90">
        <Box as="span" color="#CAA255">
          为了保障数字资产安全，红包将在1-3分钟内生成
        </Box>
        <OrderedList>
          <ListItem>您可以保存二维码后随时扫码查看进度分享</ListItem>
          <ListItem>也可以返回红包页面点击右上角『...』查看与分享</ListItem>
        </OrderedList>
      </Box>

      <Button
        colorScheme="primary"
        w="calc(100% - 40px)"
        mx="auto"
        mb="calc(20px - var(--safe-area-inset-bottom))"
        size="lg"
        variant="solid"
        onClick={onOpenCopySucceedDialog}
      >
        复制分享链接
      </Button>

      <Modal
        onClose={onCloseCopySucceedDialog}
        isOpen={isOpenCopySucceedDialog}
        isCentered
      >
        <ModalOverlay />
        <ModalContent
          maxW="sm"
          style={{
            width: 'calc(100% - 40px)',
          }}
        >
          <ModalHeader textAlign="center" mt="32px">
            复制成功
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody py="0" mt="20px">
            <Box fontSize="14px" textAlign="center">
              已成功复制到剪切板，去粘贴分享吧！
            </Box>
            <Box
              bg="#F6F9FC"
              color="primary.600"
              p="16px"
              fontSize="12px"
              textAlign="center"
              mt="6px"
            >
              https://mibao.net 红包口令：恭喜发财
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  )
}
