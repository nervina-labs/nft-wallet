import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Flex,
  Grid,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Skeleton,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'
import { Drawer, ModalCloseButton } from '@mibao-ui/components'
import axios from 'axios'
import { useCallback } from 'react'
import { useQuery } from 'react-query'
import { useAccount, useAccountStatus, useLogin } from '../../hooks/useAccount'
import { useToast } from '../../hooks/useToast'
import { MainContainer } from '../../styles'
import { sleep, UnipassConfig } from '../../utils'
import { Poetry, PoetrySort, PoetryVoteCounts } from './api.interface'
import { Title } from './components/title'
import ListBgSvgPath from './assets/list-bg.svg'
import { BottomLogo } from './components/bottomLogo'
import { useRouteQuerySearch } from '../../hooks/useRouteQuery'

type VoteType = 'normal' | 'special'

const IS_MOCK = true

export const Poem: React.FC = () => {
  const { address } = useAccount()
  const { isLogined } = useAccountStatus()
  const { login } = useLogin()
  const {
    isOpen: isOpenLoginDialog,
    onOpen: onOpenLoginDialog,
    onClose: onCloseLoginDialog,
  } = useDisclosure()
  const {
    isOpen: isOpenVoteDialog,
    onOpen: onOpenVoteDialog,
    onClose: onCloseVoteDialog,
  } = useDisclosure()
  const [voteSort, setVoteSort] = useRouteQuerySearch<PoetrySort>('sort', '')
  const toast = useToast()

  const onClickVoteMiddleware = useCallback(() => {
    if (isLogined) {
      console.log('开启投票的对话框')
      onOpenVoteDialog()
    } else {
      console.log('开启登录的对话框')
      onOpenLoginDialog()
    }
  }, [isLogined, onOpenLoginDialog, onOpenVoteDialog])

  const onLogin = useCallback(async () => {
    UnipassConfig.setRedirectUri(location.pathname + location.search)
    await login()
  }, [login])

  const onVote = useCallback(
    (type: VoteType) => {
      console.log(type)
      toast('投票成功')
    },
    [toast]
  )

  const {
    data: poetryVotesData,
    isLoading: isLoadingPoetryVotesData,
  } = useQuery(
    ['/api/wallet/v1/poetries', voteSort],
    async () => {
      if (IS_MOCK) {
        await sleep(1000)
        return {
          poetries: new Array(13).fill(0).map((_, i) => ({
            uuid: 'fake_uuid',
            name: 'fake_name' + i,
            reciter_name: 'fake_username' + i,
            votes_count: 100 + i * 100,
            serial_no: i + 1,
          })),
        }
      }
      const { data } = await axios.get<Poetry>('/api/wallet/v1/poetries', {
        params: {
          sort: voteSort,
        },
      })
      return data
    },
    {}
  )

  const { data: poetryVotesCountData } = useQuery(
    `/api/wallet/v1/poetry_votes/${address}`,
    async () => {
      const { data } = await axios.get<PoetryVoteCounts>(
        `/api/wallet/v1/poetry_votes/${address}`
      )
      return data
    },
    {
      enabled: isLogined,
    }
  )

  return (
    <MainContainer bg="#1a1a1a" py="60px" color="#fff" minH="100vh">
      <Title />

      <Grid
        templateColumns="51px calc(100% - 51px)"
        h="105px"
        mx="20px"
        position="relative"
        userSelect="none"
        _after={{
          content: '" "',
          w: '30px',
          h: '30px',
          bg: '#1a1a1a',
          position: 'absolute',
          left: '36px',
          rounded: 'full',
          top: '-15px',
        }}
        _before={{
          content: '" "',
          w: '30px',
          h: '30px',
          bg: '#1a1a1a',
          position: 'absolute',
          left: '36px',
          rounded: 'full',
          bottom: '-15px',
        }}
      >
        <Flex
          bg="#F5C57B"
          color="#484848"
          fontWeight="bold"
          fontSize="18px"
          textAlign="center"
          alignItems="center"
          justify="center"
        >
          <Box>
            规<br />则
          </Box>
        </Flex>
        <Flex
          direction="column"
          bg="#fff"
          py="8px"
          color="#000"
          textAlign="center"
          fontSize="14px"
          lineHeight="22px"
        >
          <Box fontSize="16px" fontWeight="600">
            本次诗歌节采用 NFT 进行投票
          </Box>
          <List w="160px" mx="auto" whiteSpace="nowrap">
            <ListItem
              position="relative"
              _before={{
                content: '" "',
                width: '5px',
                height: '5px',
                rounded: 'full',
                display: 'block',
                position: 'absolute',
                top: 'calc(50% - 2.5px)',
                left: '-10px',
                bg: '#F5C57B',
              }}
            >
              投出一个诗人 NFT{' '}
              <Box as="span" color="#F5C57B">
                计3票
              </Box>
            </ListItem>
            <ListItem
              position="relative"
              _before={{
                content: '" "',
                width: '5px',
                height: '5px',
                rounded: 'full',
                display: 'block',
                position: 'absolute',
                top: 'calc(50% - 2.5px)',
                left: '-10px',
                bg: '#F5C57B',
              }}
            >
              投出一个普通 NFT{' '}
              <Box as="span" color="#F5C57B">
                计1票
              </Box>
            </ListItem>
          </List>
          <Box>快去投出你喜欢的诗歌吧！</Box>
        </Flex>
      </Grid>

      <Flex justify="flex-end" pt="35px" mb="30px" px="20px">
        <Button
          variant="link"
          textDecoration="underline"
          color="#F5C57B"
          mb="16px"
          fontSize="16px"
          onClick={() => setVoteSort(voteSort === 'votes' ? '' : 'votes')}
        >
          {voteSort === 'votes' ? '返回默认列表' : '查看排名'}
        </Button>
      </Flex>

      <Box
        zIndex={1}
        position="relative"
        bg={`url(${ListBgSvgPath})`}
        bgSize="100% auto"
        px="20px"
      >
        {isLoadingPoetryVotesData ? (
          <VStack spacing="10px">
            <Skeleton h="70px" w="full" />
            <Skeleton h="70px" w="full" />
            <Skeleton h="70px" w="full" />
            <Skeleton h="70px" w="full" />
          </VStack>
        ) : (
          poetryVotesData?.poetries.map((item, i) => (
            <Flex
              key={i}
              justify="space-between"
              align="center"
              borderBottom="1px solid rgba(245, 197, 123, 0.4)"
              py="16px"
            >
              <Flex direction="column">
                <Box fontSize="15px">
                  {item.serial_no}. {item.name}
                </Box>
                <Box pl="25px" fontSize="14px" mt="8px">
                  {item.reciter_name}

                  <Box as="span" color="#F5C57B" ml="15px">
                    {item.votes_count}票
                  </Box>
                </Box>
              </Flex>

              <Button
                onClick={onClickVoteMiddleware}
                variant="link"
                textDecoration="underline"
                color="#F5C57B"
                mt="auto"
                fontSize="14px"
              >
                去投票
              </Button>
            </Flex>
          ))
        )}
      </Box>

      <BottomLogo />

      <Drawer
        onClose={onCloseLoginDialog}
        placement="bottom"
        isOpen={isOpenLoginDialog}
        hasCloseBtn
        hasOverlay
        contentProps={{
          pt: '40px',
          pb: 'calc(20px + var(--safe-area-inset-bottom))',
          style: {
            borderRadius: '20px 20px 0 0',
          },
        }}
      >
        <Box textAlign="center" mb="45px">
          请先链接身份管理器
        </Box>

        <Button
          isFullWidth
          onClick={async () => await onLogin()}
          colorScheme="primary"
        >
          连接 Unipass
        </Button>
      </Drawer>

      <Modal
        size="xs"
        closeOnEsc
        closeOnOverlayClick
        isOpen={isOpenVoteDialog}
        onClose={onCloseVoteDialog}
        isCentered
      >
        <ModalOverlay />
        <ModalContent borderRadius="24px" pt="80px" w="90vw">
          <ModalCloseButton zIndex="2" />
          <ModalBody>
            <Alert
              status="warning"
              variant="subtle"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              bg="white"
            >
              <AlertIcon boxSize="70px" mr={0} mb={4} color="#FFA940" />
              <AlertTitle mb={2} mx={0} fontSize="16px" fontWeight="normal">
                您当前有 {poetryVotesCountData?.poetry_vote.special_count}{' '}
                张专家票，{poetryVotesCountData?.poetry_vote.normal_count}{' '}
                张普通票
              </AlertTitle>
              <AlertDescription
                maxWidth="sm"
                fontSize="14px"
                color="gray.500"
                whiteSpace="pre-wrap"
              >
                注意：投票会将你的 NFT
                临时转入一个计票地址，2022.01.04号计票结束后，NFT
                将返回到您的账户
              </AlertDescription>
            </Alert>
          </ModalBody>

          <ModalFooter>
            <VStack spacing="8px" w="full">
              <Button
                isFullWidth
                onClick={() => onVote('special')}
                colorScheme="primary"
              >
                投诗人票
              </Button>
              <Button
                isFullWidth
                onClick={() => onVote('normal')}
                variant="outline"
              >
                投普通票
              </Button>
            </VStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </MainContainer>
  )
}
