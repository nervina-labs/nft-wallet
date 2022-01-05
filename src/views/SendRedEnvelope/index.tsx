import { Appbar, AppbarButton } from '../../components/Appbar'
import { RainbowBackground } from '../../components/RainbowBackground'
import { ReactComponent as MoreSvg } from '../../assets/svg/more.svg'
import { ReactComponent as RightSvg } from '../../assets/svg/right.svg'
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

const formItemProps: BoxProps = {
  rounded: '8px',
  py: '12px',
  px: '15px',
  bg: 'white',
  mx: '20px',
  mb: '15px',
  fontSize: '16px',
}

const RightIcon = styled(RightSvg)`
  width: 25px;
  height: 25px;
  position: absolute;
  top: calc(50% - 12.5px);
  right: 5px;
`

export const SendRedEnvelope: React.FC = () => {
  const {
    isOpen: isOpenNftList,
    onOpen: onOpenNftList,
    onClose: onCloseNftList,
  } = useDisclosure()

  return (
    <RainbowBackground>
      <Flex direction="column" position="relative" zIndex={2} h="full">
        <Appbar
          transparent
          title="秘宝红包"
          right={
            <AppbarButton transparent>
              <MoreSvg />
            </AppbarButton>
          }
        />
        <Drawer
          isOpen={isOpenNftList}
          onClose={onCloseNftList}
          hasCloseBtn
          hasOverlay
          placement="bottom"
          rounded="md"
        >
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </Drawer>
        <Tabs colorScheme="sendRedEnvelope">
          <TabList justifyContent="center" borderBottom="none" mb="20px">
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
        >
          生成秘宝红包
        </Button>
      </Flex>
    </RainbowBackground>
  )
}
