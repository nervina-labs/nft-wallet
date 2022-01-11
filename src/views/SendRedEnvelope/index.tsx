import { Appbar, AppbarButton } from '../../components/Appbar'
import { RainbowBackground } from '../../components/RainbowBackground'
import { ReactComponent as MoreSvg } from '../../assets/svg/more.svg'
import { ReactComponent as LeftSvg } from '../../assets/svg/left.svg'
import {
  Box,
  BoxProps,
  Button,
  Flex,
  Input,
  TabPanel,
  TabPanels,
  useDisclosure,
} from '@chakra-ui/react'
import styled from '@emotion/styled'
import { Drawer, Tab, TabList, Tabs } from '@mibao-ui/components'
import { useInnerSize } from '../../hooks/useInnerSize'
import { CONTAINER_MAX_WIDTH } from '../../constants'
import { NftListDrawer } from './components/nftListDrawer'
import { useCallback, useState } from 'react'
import { limitNumberInput } from '../../utils'

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
  const [selectedNftUuids, setSelectedNftUuids] = useState<string[]>([])
  const [redEnvelopeCount, setRedEnvelopeCount] = useState('')
  const [greeting, setGreeting] = useState('')
  const [puzzleQuestion, setPuzzleQuestion] = useState('')
  const [puzzleAnswer, setPuzzleAnswer] = useState('')

  const onSubmit = useCallback(() => {
    // TODO: Validation data
    // TODO: API
    console.log({
      selectedNftUuids,
      redEnvelopeCount,
      greeting,
      puzzleQuestion,
      puzzleAnswer,
    })
  }, [
    greeting,
    puzzleAnswer,
    puzzleQuestion,
    redEnvelopeCount,
    selectedNftUuids,
  ])

  return (
    <RainbowBackground>
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
          onChange={setSelectedNftUuids}
          left={modalLeft}
        />
        <Tabs colorScheme="sendRedEnvelope">
          <TabList justifyContent="center" borderBottom="none" mb="25px">
            <Tab px="0" mr="40px" fontSize="14px">
              普通红包
            </Tab>
            <Tab px="0" fontSize="14px">
              谜语红包
            </Tab>
          </TabList>
          <Box {...formItemProps} position="relative" onClick={onOpenNftList}>
            选择秘宝
            <RightIcon />
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
                value={redEnvelopeCount}
                onChange={(e) =>
                  setRedEnvelopeCount(
                    limitNumberInput(
                      e,
                      redEnvelopeCount,
                      selectedNftUuids.length
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
    </RainbowBackground>
  )
}
