import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Flex,
  Grid,
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
import {
  useAccount,
  useAccountStatus,
  useLogin,
  useSignTransaction,
} from '../../hooks/useAccount'
import { useToast } from '../../hooks/useToast'
import { MainContainer } from '../../styles'
import { UnipassConfig } from '../../utils'
import {
  Poetry,
  PoetrySort,
  PoetryVoteCounts,
  UnSignedTx,
} from './api.interface'
import { Title } from './components/title'
import ListBgSvgPath from './assets/list-bg.svg'
import { BottomLogo } from './components/bottomLogo'
import { useRouteQuerySearch } from '../../hooks/useRouteQuery'
import { useGetAndSetAuth } from '../../hooks/useProfile'
import { SERVER_URL } from '../../constants'

type VoteType = 'normal' | 'special'

export const Poem: React.FC = () => {
  const { address } = useAccount()
  const { isLogined } = useAccountStatus()
  const getAuth = useGetAndSetAuth()
  const signTransaction = useSignTransaction()
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
    async (type: VoteType) => {
      const auth = await getAuth()
      const headers = {
        auth: JSON.stringify(auth),
      }
      const unsignedTx = await axios
        .get<UnSignedTx>(SERVER_URL + '/poem_votes', { headers })
        .then((res) => res.data.unsigned_tx)

      const signTx = await signTransaction(unsignedTx as any)

      console.log(type, signTx)
      toast('投票成功')
    },
    [getAuth, signTransaction, toast]
  )

  const {
    data: poetryVotesData,
    isLoading: isLoadingPoetryVotesData,
  } = useQuery(
    ['/poems', voteSort],
    async () => {
      const { data } = await axios.get<Poetry>(SERVER_URL + '/poems', {
        params: {
          sort: voteSort,
        },
      })
      return data
    },
    {}
  )

  const { data: poetryVotesCountData } = useQuery(
    `/poetry_votes/${address}`,
    async () => {
      const { data } = await axios.get<PoetryVoteCounts>(
        SERVER_URL + `/poetry_votes/${address}`
      )
      return data
    },
    {
      enabled: isLogined,
    }
  )

  return (
    <MainContainer bg="#1a1a1a" py="60px" color="#fff" minH="100vh">
      <Title isRank={voteSort === 'votes'} />
      <Flex justify="flex-end" pt="35px" mb="30px" px="20px">
        <Button
          variant="link"
          textDecoration="underline"
          color="#F5C57B"
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
          <VStack spacing="6px">
            <Skeleton h="55px" w="full" />
            <Skeleton h="55px" w="full" />
            <Skeleton h="55px" w="full" />
            <Skeleton h="55px" w="full" />
          </VStack>
        ) : (
          poetryVotesData?.poems.map((item, i) => (
            <Grid
              key={i}
              templateColumns="60% 20% 20%"
              align="center"
              borderBottom="1px solid rgba(245, 197, 123, 0.4)"
              fontSize="14px"
              h="60px"
              lineHeight="60px"
            >
              <Box
                textAlign="left"
                whiteSpace="nowrap"
                textOverflow="ellipsis"
                overflow="hidden"
              >
                {item.reciter_name}
              </Box>
              <Box color="#F5C57B">{item.votes_count}票</Box>

              <Button
                onClick={onClickVoteMiddleware}
                variant="link"
                textDecoration="underline"
                color="#F5C57B"
                fontSize="14px"
                my="auto"
              >
                去投票
              </Button>
            </Grid>
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
                onClick={async () => await onVote('special')}
                colorScheme="primary"
              >
                投诗人票
              </Button>
              <Button
                isFullWidth
                onClick={async () => await onVote('normal')}
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
