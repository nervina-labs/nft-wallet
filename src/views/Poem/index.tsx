import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  Button,
  Center,
  Flex,
  Grid,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Spinner,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'
import { Drawer, ModalCloseButton } from '@mibao-ui/components'
import axios from 'axios'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import {
  useAccount,
  useAccountStatus,
  useLogin,
  useSignTransaction,
} from '../../hooks/useAccount'
import { useToast } from '../../hooks/useToast'
import { MainContainer } from '../../styles'
import { generateUnipassUrl, UnipassConfig } from '../../utils'
import {
  Poetry,
  PoetrySort,
  PoetryVoteCounts,
  UnSignedTx,
} from './api.interface'
import { Title } from './components/title'
import ListBgSvgPath from './assets/list-bg.svg'
import { useRouteQuerySearch } from '../../hooks/useRouteQuery'
import { useGetAndSetAuth } from '../../hooks/useProfile'
import { NFT_EXPLORER_URL, PER_ITEM_LIMIT, SERVER_URL } from '../../constants'
import { rawTransactionToPWTransaction } from '../../pw/toPwTransaction'
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { useHistory, useLocation } from 'react-router-dom'
import { RoutePath } from '../../routes'
import { UnipassAction } from '../../models/unipass'
import {
  normalizers,
  Reader,
  SerializeWitnessArgs,
  transformers,
  WitnessArgs,
} from '@lay2/pw-core'

type VoteType = 'normal' | 'special'

interface RouteState {
  signature?: string
  prevState?: {
    vote_type: VoteType
    poem_uuid: string
    rawTx: string
  }
}

export const Poem: React.FC = () => {
  const { pubkey } = useAccount()
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
  const {
    isOpen: isVoting,
    onOpen: onOpenVoting,
    onClose: onCloseVoting,
  } = useDisclosure()
  const [activeUuid, setActiveUuid] = useState<string | undefined>(undefined)
  const [voteSort] = useRouteQuerySearch<PoetrySort>('sort', '')
  const [routePageIndex, setRoutePageIndex] = useRouteQuerySearch<string>(
    'page',
    '1'
  )
  const [pageIndex, setPageIndex] = useState<string>(routePageIndex)
  const [pageCount, setPageCount] = useState<number>(1)
  const [isUsedVotingCallback, setIsUsedVotingCallback] = useState(false)
  const toast = useToast()
  const { replace } = useHistory()
  const location = useLocation<RouteState | undefined>()

  const onClickVoteMiddleware = useCallback(
    (uuid?: string) => {
      setActiveUuid(uuid)
      if (isLogined) {
        onOpenVoteDialog()
      } else {
        onOpenLoginDialog()
      }
    },
    [isLogined, onOpenLoginDialog, onOpenVoteDialog]
  )

  const onLogin = useCallback(async () => {
    UnipassConfig.setRedirectUri(location.pathname + location.search)
    await login()
  }, [location.pathname, location.search, login])

  useEffect(() => {
    if (isNaN(parseInt(routePageIndex))) {
      setRoutePageIndex('1')
      setPageIndex('1')
    } else {
      setPageIndex(routePageIndex)
    }
  }, [routePageIndex, setRoutePageIndex])

  const {
    data: poetryVotesData,
    isLoading: isLoadingPoetryVotesData,
    refetch: refetchPoetryVotesData,
  } = useQuery(
    ['/poems', voteSort, routePageIndex],
    async () => {
      const body = {
        params: {
          sort_by: voteSort,
          limit: PER_ITEM_LIMIT,
          page: parseInt(routePageIndex) || 1,
        },
      }
      const { data } = await axios
        .get<Poetry>(SERVER_URL + '/poems', body)
        .catch((err) => {
          if (err.response.data.code === 1003) {
            setRoutePageIndex('1')
          }
          throw err
        })
      setPageCount(Math.round((data?.meta.total_count ?? 1) / PER_ITEM_LIMIT))
      return data
    },
    {}
  )

  const {
    data: poetryVotesCountData,
    refetch: refetchPoetryVotesCountData,
  } = useQuery(
    '/poem_vote',
    async () => {
      const auth = await getAuth()
      const headers = {
        auth: JSON.stringify(auth),
      }
      const { data } = await axios.get<PoetryVoteCounts>(
        SERVER_URL + '/poem_vote',
        { headers }
      )
      return data
    },
    {
      enabled: isLogined && poetryVotesData?.meta.event_state === 'ongoing',
    }
  )

  const onVote = useCallback(
    async (type: VoteType, poemUuid: string) => {
      const auth = await getAuth()
      const config = {
        headers: {
          auth: JSON.stringify(auth),
        },
        params: {
          poem_uuid: poemUuid,
          vote_type: type,
        },
      }
      try {
        onOpenVoting()
        const unsignedTx = await axios
          .get<UnSignedTx>(SERVER_URL + '/poem_vote/new', config)
          .then(
            async (res) =>
              await rawTransactionToPWTransaction(res.data.unsigned_tx)
          )
        const signTx = await signTransaction(unsignedTx)
        const url = `${window.location.origin}${RoutePath.Unipass}`
        if (!location?.state?.signature) {
          window.location.href = generateUnipassUrl(
            UnipassAction.Poem,
            url,
            url,
            pubkey,
            signTx,
            {
              poem_uuid: poemUuid as string,
              vote_type: type,
              rawTx: JSON.stringify(unsignedTx),
            }
          )
          return
        }
        const rawTx = transformers.TransformTransaction(unsignedTx) as any
        const witnessArgs: WitnessArgs = {
          lock: location?.state.signature,
          input_type: '',
          output_type: '',
        }
        const witness = new Reader(
          SerializeWitnessArgs(normalizers.NormalizeWitnessArgs(witnessArgs))
        ).serializeJson()
        rawTx.witnesses[0] = witness
        await axios.post<{ tx_hash: string }>(
          SERVER_URL + '/poem_vote',
          {
            poem_uuid: location.state?.prevState?.poem_uuid,
            vote_type: location.state?.prevState?.vote_type,
            signed_tx: JSON.stringify(rawTx),
          },
          {
            headers: {
              auth: JSON.stringify(auth),
            },
          }
        )
        await refetchPoetryVotesData()
        await refetchPoetryVotesCountData()
        onCloseVoting()
        toast('投票成功')
      } catch (e) {
        onCloseVoting()
        toast('投票失败' + e)
      }
      replace(location.pathname + location.search, {})
      setActiveUuid(undefined)
      onCloseVoteDialog()
    },
    [
      getAuth,
      location.pathname,
      location.search,
      location.state?.prevState?.poem_uuid,
      location.state?.prevState?.vote_type,
      location.state?.signature,
      onCloseVoteDialog,
      onCloseVoting,
      onOpenVoting,
      pubkey,
      refetchPoetryVotesCountData,
      refetchPoetryVotesData,
      replace,
      signTransaction,
      toast,
    ]
  )

  useEffect(() => {
    if (
      isUsedVotingCallback ||
      !location.state?.signature ||
      !location.state?.prevState
    ) {
      return
    }
    setIsUsedVotingCallback(true)
    onVote(
      location.state.prevState.vote_type,
      location.state.prevState.poem_uuid
    )
  }, [getAuth, isUsedVotingCallback, location.state, onVote])

  const poemVote = poetryVotesCountData?.poem_vote
  const noNftTicket =
    poemVote && poemVote.special_count <= 0 && poemVote.normal_count <= 0
  const ticketText = useMemo(() => {
    if (!poemVote) {
      return ''
    }
    const { special_count: specialCount, normal_count: normalCount } = poemVote
    return (
      <>
        您当前有 <br />
        <Box as="span" whiteSpace="nowrap">
          {specialCount > 0
            ? ` ${specialCount} 张诗人 NFT${normalCount > 0 ? '，' : ''}`
            : ''}
          {normalCount > 0 ? ` ${normalCount} 张普通 NFT` : ''}
        </Box>
      </>
    )
  }, [poemVote])

  return (
    <MainContainer bg="#1a1a1a" py="60px" color="#fff" minH="100vh">
      <Title
        isRank={voteSort === 'votes'}
        specialClassUuid={poetryVotesData?.meta.special_class_uuid}
        normalClassUuid={poetryVotesData?.meta.normal_class_uuid}
        eventState={poetryVotesData?.meta.event_state}
      />
      <Flex justify="flex-end" pt="35px" mb="30px" px="20px">
        <Button
          variant="link"
          textDecoration="underline"
          color="#F5C57B"
          fontSize="16px"
          onClick={() => {
            replace(
              `${location.pathname}${voteSort === 'votes' ? '' : '?sort=votes'}`
            )
          }}
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
        minH="1200px"
      >
        {isLoadingPoetryVotesData ? (
          <Center>
            <Spinner color="#F5C57B" />
          </Center>
        ) : (
          poetryVotesData?.poems.map((item, i) => {
            const rankNumber =
              (poetryVotesData.meta.current_page - 1) * PER_ITEM_LIMIT + i + 1
            const templateColumns = `${
              poetryVotesData?.meta.event_state === 'ongoing'
                ? '60% 20% 20%'
                : '80% 20%'
            }`
            return (
              <Grid
                key={i}
                templateColumns={templateColumns}
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
                  {poetryVotesData && voteSort === 'votes'
                    ? `${rankNumber}. `
                    : null}
                  {item.reciter_name}
                </Box>
                <Box
                  color="#F5C57B"
                  textDecoration="underline"
                  textAlign={
                    poetryVotesData?.meta.event_state === 'ongoing'
                      ? 'center'
                      : 'right'
                  }
                >
                  <a
                    href={`${NFT_EXPLORER_URL}/holder/tokens/${
                      item.address as string
                    }`}
                  >
                    {item.votes_count}票
                  </a>
                </Box>

                {poetryVotesData?.meta.event_state === 'ongoing' ? (
                  <Button
                    onClick={() => onClickVoteMiddleware(item.uuid)}
                    variant="link"
                    textDecoration="underline"
                    color="#F5C57B"
                    fontSize="14px"
                    my="auto"
                    ml="auto"
                  >
                    去投票
                  </Button>
                ) : null}
              </Grid>
            )
          })
        )}
      </Box>

      <Center mt="20px">
        <Button
          size="sm"
          ml="20px"
          onClick={() => {
            const n = Number(pageIndex)
            if (n <= 1) return
            setRoutePageIndex(`${n - 1}`)
          }}
          variant="link"
          color="#F5C57B"
          fontSize="14px"
        >
          <ChevronLeftIcon />
        </Button>
        <Input
          value={pageIndex}
          onChange={(e) => {
            const { value } = e.currentTarget
            if (!value) {
              setPageIndex('')
              return
            }
            if (!/^\d*$/.test(value)) {
              return
            }
            const p = +value
            if (Number.isNaN(p) || p < 1 || p > pageCount) {
              return
            }
            setPageIndex(`${p}`)
          }}
          size="sm"
          w="45px"
          _focus={{
            outline: 'none',
          }}
          rounded="8px"
        />
        <Box ml="10px">
          {' / '}
          {pageCount}
        </Box>
        <Button
          size="sm"
          ml="20px"
          onClick={() => {
            const n = parseInt(pageIndex)
            if (isNaN(parseInt(pageIndex)) || n <= 1) {
              setRoutePageIndex('1')
              setPageIndex('1')
            } else {
              setRoutePageIndex(pageIndex)
            }
          }}
          variant="link"
          textDecoration="underline"
          color="#F5C57B"
          fontSize="14px"
        >
          跳转
        </Button>
        <Button
          size="sm"
          ml="20px"
          onClick={() => {
            const n = Number(pageIndex)
            if (n >= pageCount) return
            setRoutePageIndex(`${n + 1}`)
          }}
          variant="link"
          color="#F5C57B"
          fontSize="14px"
        >
          <ChevronRightIcon />
        </Button>
      </Center>

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
        <ModalContent borderRadius="24px" pt="60px" w="90vw">
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
              <AlertTitle mb={2} mx={0} fontSize="16px" fontWeight="bold">
                {noNftTicket ? '您当前没有 NFT 票' : ticketText}
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

          <ModalFooter mb="10px">
            <VStack spacing="8px" w="full">
              {(poetryVotesCountData?.poem_vote.special_count || 0) > 0 ? (
                <Button
                  isFullWidth
                  onClick={async () =>
                    await onVote('special', activeUuid as string)
                  }
                  colorScheme="primary"
                >
                  投诗人 NFT
                </Button>
              ) : null}
              {(poetryVotesCountData?.poem_vote.normal_count || 0) > 0 ? (
                <Button
                  isFullWidth
                  onClick={async () =>
                    await onVote('normal', activeUuid as string)
                  }
                  variant="outline"
                  colorScheme="primary"
                >
                  投普通 NFT
                </Button>
              ) : null}
            </VStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isVoting}
        closeOnEsc={false}
        closeOnOverlayClick={false}
        onClose={onCloseVoting}
      >
        <Flex
          direction="column"
          position="fixed"
          top="50%"
          left="50%"
          bg="rgba(0, 0, 0, 0.8)"
          color="#fff"
          pt="20px"
          pb="10px"
          px="15px"
          zIndex="calc(var(--chakra-zIndices-modal) + 1)"
          transform="translate(-50%, -50%)"
          rounded="10px"
        >
          <Spinner color="white" mx="auto" mb="10px" />
          <Box textAlign="center">投票中</Box>
        </Flex>
      </Modal>
    </MainContainer>
  )
}
