import { Appbar, AppbarButton } from '../../components/Appbar'
import { RainbowBackground } from '../../components/RainbowBackground'
import { ReactComponent as MoreSvg } from '../../assets/svg/more.svg'
import { ReactComponent as LeftSvg } from '../../assets/svg/left.svg'
import {
  Box,
  BoxProps,
  Button,
  Flex,
  VStack,
  Input,
  TabPanel,
  TabPanels,
  useDisclosure,
} from '@chakra-ui/react'
import styled from '@emotion/styled'
import { Drawer, Tab, TabList, Tabs, Image } from '@mibao-ui/components'
import { useInnerSize } from '../../hooks/useInnerSize'
import { CONTAINER_MAX_WIDTH } from '../../constants'
import { NftListDrawer } from './components/nftListDrawer'
import { useCallback, useState } from 'react'
import { isSupportWebp, limitNumberInput } from '../../utils'
import { NFTToken } from '../../models'
import { useToast } from '../../hooks/useToast'

const formItemProps: BoxProps = {
  rounded: '8px',
  py: '12px',
  px: '15px',
  bg: 'white',
  mx: '20px',
  mb: '15px',
  fontSize: '16px',
}

const RightIcon = styled(LeftSvg)`
  width: 14px;
  height: 14px;
  position: absolute;
  top: calc(50% - 7px);
  transform: rotate(180deg);
  right: 10px;
`

const Container = styled(RainbowBackground)`
  height: auto;
  min-height: 100vh;
`

export const SendRedEnvelope: React.FC = () => {
  const {
    isOpen: isOpenNftList,
    onOpen: onOpenNftList,
    onClose: onCloseNftList,
  } = useDisclosure()
  const {
    isOpen: isOpenMore,
    onOpen: onOpenMore,
    onClose: onCloseMore,
  } = useDisclosure()
  const { width } = useInnerSize()
  const modalLeft = `calc(50% - ${Math.min(width, CONTAINER_MAX_WIDTH) / 2}px)`
  const [selectedTokens, setSelectedTokens] = useState<NFTToken[]>([])
  const [redEnvelopeCountValue, setRedEnvelopeCountValue] = useState('')
  const [greeting, setGreeting] = useState('')
  const [puzzleQuestion, setPuzzleQuestion] = useState('')
  const [puzzleAnswer, setPuzzleAnswer] = useState('')
  const [tabIndex, setTabIndex] = useState<number>(0)
  const toast = useToast()

  const onSubmit = useCallback(async () => {
    const redEnvelopeCount = Number(redEnvelopeCountValue)
    if (!selectedTokens.length) {
      toast('请选择秘宝')
      return
    }
    if (!redEnvelopeCount) {
      toast('请输入红包数量')
      return
    }
    if (tabIndex === 1) {
      if (!puzzleQuestion) {
        toast('请输入谜题')
        return
      }
      if (!puzzleAnswer) {
        toast('请输入谜底')
        return
      }
    }
    // TODO: API
    console.log({
      selectedTokens,
      redEnvelopeCountValue,
      greeting,
      puzzleQuestion,
      puzzleAnswer,
    })
  }, [
    greeting,
    puzzleAnswer,
    puzzleQuestion,
    redEnvelopeCountValue,
    selectedTokens,
    tabIndex,
    toast,
  ])

  return (
    <Container>
      <Flex direction="column" position="relative" zIndex={2} h="full">
        <Appbar
          transparent
          title="秘宝红包"
          right={
            <AppbarButton transparent onClick={onOpenMore}>
              <MoreSvg />
            </AppbarButton>
          }
        />
        <Drawer
          placement="bottom"
          isOpen={isOpenMore}
          hasOverlay
          onClose={onCloseMore}
          rounded="lg"
          contentProps={{
            style: {
              left: `calc(${modalLeft} + 20px)`,
              bottom: '40px',
              width: 'calc(100% - 40px)',
              maxWidth: CONTAINER_MAX_WIDTH - 40 + 'px',
            },
            textAlign: 'center',
            borderRadius: '20px',
          }}
        >
          <Box
            h="50px"
            lineHeight="50px"
            borderBottom="1px solid #E1E1E1"
            fontSize="16px"
          >
            红包记录
          </Box>
          <Box h="50px" lineHeight="50px" fontSize="16px" onClick={onCloseMore}>
            取消
          </Box>
        </Drawer>

        <NftListDrawer
          isOpen={isOpenNftList}
          onClose={onCloseNftList}
          onChange={setSelectedTokens}
          left={modalLeft}
        />
        <Tabs
          colorScheme="sendRedEnvelope"
          onChange={setTabIndex}
          index={tabIndex}
        >
          <TabList justifyContent="center" borderBottom="none" mb="25px">
            <Tab px="0" mr="40px" fontSize="14px">
              普通红包
            </Tab>
            <Tab px="0" fontSize="14px">
              谜语红包
            </Tab>
          </TabList>
          <Box
            {...formItemProps}
            bg="rgba(255, 255, 255, 0.5)"
            rounded="8px"
            px="0"
            py="0"
          >
            <Box
              {...formItemProps}
              position="relative"
              onClick={onOpenNftList}
              mx="0"
            >
              选择秘宝
              <RightIcon />
            </Box>

            {selectedTokens.length > 0 ? (
              <>
                <VStack px="10px" spacing="15px">
                  {selectedTokens.map((token, i) => (
                    <Box w="full">
                      <Flex key={i} justify="flex-start" w="full">
                        <Image
                          src={token.class_bg_image_url}
                          w="58px"
                          h="58px"
                          rounded="16px"
                          webp={isSupportWebp()}
                          resizeScale={300}
                          customizedSize={{
                            fixed: 'large',
                          }}
                        />
                        <Flex
                          pl="10px"
                          direction="column"
                          justify="center"
                          fontSize="14px"
                        >
                          <Box
                            whiteSpace="nowrap"
                            textOverflow="ellipsis"
                            overflow="hidden"
                          >
                            {token.class_name}
                          </Box>
                          <Box
                            fontSize="12px"
                            color="#777E90"
                            whiteSpace="nowrap"
                            textOverflow="ellipsis"
                            overflow="hidden"
                          >
                            {token.issuer_name}
                          </Box>
                        </Flex>
                      </Flex>
                      <Box color="#777E90" fontSize="14px" mt="5px">
                        #{token.n_token_id}
                      </Box>
                    </Box>
                  ))}
                </VStack>
                <Box
                  color="#FF5C00"
                  px="10px"
                  pb="15px"
                  pt="10px"
                  w="full"
                  textAlign="right"
                  fontSize="12px"
                >
                  共计：{selectedTokens.length} 秘宝
                </Box>
              </>
            ) : null}
          </Box>

          <Flex {...formItemProps} justify="space-between" whiteSpace="nowrap">
            <Box>红包个数</Box>
            <Flex>
              <Input
                bg="rgba(0, 0, 0, 0)"
                placeholder="填写红包个数"
                border="none"
                h="24px"
                px="0"
                pr="5px"
                textAlign="right"
                _focus={{
                  border: 'none',
                }}
                value={redEnvelopeCountValue}
                onChange={(e) =>
                  setRedEnvelopeCountValue(
                    limitNumberInput(
                      e,
                      redEnvelopeCountValue,
                      selectedTokens.length
                    )
                  )
                }
              />
              个
            </Flex>
          </Flex>
          <Flex {...formItemProps} justify="space-between" whiteSpace="nowrap">
            <Box>祝福语</Box>
            <Input
              placeholder="大吉大利，好运连连！"
              w="full"
              border="none"
              px="0"
              h="24px"
              ml="24px"
              textAlign="right"
              _focus={{
                border: 'none',
              }}
              value={greeting}
              onChange={(e) => setGreeting(e.currentTarget.value)}
            />
          </Flex>
          <TabPanels>
            <TabPanel p="0"></TabPanel>
            <TabPanel {...formItemProps} pt="20px">
              <Box color="#777E90" fontSize="12px" mb="4px">
                输入红包谜题
              </Box>
              <Input
                bg="#EFEFEF"
                fontSize="18px"
                size="lg"
                textAlign="center"
                border="1px solid #E8E8E8"
                outline="none"
                rounded="8px"
                _focus={{
                  border: '1px solid #E8E8E8',
                  outline: 'none',
                }}
                placeholder="红包谜题"
                value={puzzleQuestion}
                onChange={(e) => setPuzzleQuestion(e.currentTarget.value)}
              />
              <Box color="#777E90" fontSize="12px" mb="4px" mt="16px">
                输入红包谜底
              </Box>
              <Input
                bg="#EFEFEF"
                fontSize="18px"
                size="lg"
                textAlign="center"
                border="1px solid #E8E8E8"
                outline="none"
                rounded="8px"
                _focus={{
                  border: '1px solid #E8E8E8',
                  outline: 'none',
                }}
                placeholder="红包谜底"
                value={puzzleAnswer}
                onChange={(e) => setPuzzleAnswer(e.currentTarget.value)}
              />
              <Box color="#777E90" fontSize="12px" mt="8px" textAlign="center">
                好友输入谜底即可领取秘宝
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
        <Button
          colorScheme="primary"
          isFullWidth
          mx="20px"
          w="calc(100% - 40px)"
          h="48px"
          mt="auto"
          mb="calc(15px - var(--safe-area-inset-bottom))"
          onClick={onSubmit}
        >
          生成秘宝红包
        </Button>
      </Flex>
    </Container>
  )
}
