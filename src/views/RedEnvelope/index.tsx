/* eslint-disable @typescript-eslint/indent */
import styled from '@emotion/styled'
import { AspectRatio, Box } from '@mibao-ui/components'
import { Center, Flex, Image, Spinner } from '@chakra-ui/react'
import { MainContainer } from '../../styles'
import DEFAULT_RED_ENVELOPE_COVER_PATH from '../../assets/svg/red-envelope-cover.svg'
import { useThemeColor } from '../../hooks/useThemeColor'
import { useInnerSize } from '../../hooks/useInnerSize'
import { Cover, OnOpenOptions } from './components/cover'
import { Redirect, useHistory, useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import {
  useAccount,
  useAccountStatus,
  useAPI,
  WalletType,
} from '../../hooks/useAccount'
import {
  Query,
  RedEnvelopeResponse,
  RedEnvelopeState,
  RuleType,
} from '../../models'
import { RoutePath } from '../../routes'
import { AxiosError } from 'axios'
import { Records } from './components/records'
import { useCallback, useEffect, useState } from 'react'
import { useGetAndSetAuth } from '../../hooks/useProfile'
import { useTranslation } from 'react-i18next'
import { sleep, UnipassConfig } from '../../utils'
import { useToast } from '../../hooks/useToast'
import { useRouteQuery } from '../../hooks/useRouteQuery'

const Container = styled(MainContainer)`
  background-color: #e15f4c;
  display: flex;
  flex-direction: column;
  transition: 200ms;
  position: relative;

  @keyframes show {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes show-down {
    0% {
      transform: translateY(-100%);
    }
    100% {
      transform: translateY(0);
    }
  }
`

export const RedEnvelope: React.FC = () => {
  useThemeColor('#E94030')
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation('translations')
  const { height } = useInnerSize()
  const api = useAPI()
  const isAutoOpen = useRouteQuery<'true' | 'false'>('open', 'false')
  const { address, walletType } = useAccount()
  const [isRefetching, setIsRefetching] = useState(false)
  const [isRefetch, setIsRefetch] = useState(false)
  const toast = useToast()
  const { isLogined } = useAccountStatus()
  const getAuth = useGetAndSetAuth()
  const { push } = useHistory()
  const { data, error, refetch, isLoading } = useQuery<
    RedEnvelopeResponse,
    AxiosError
  >(
    [Query.RedEnvelope, id],
    async () => {
      const { data } = await api.getRedEnvelopeEvent(id, {
        address,
      })
      return data
    },
    {
      retry: 2,
    }
  )
  const isOpened =
    !isLoading &&
    (data?.current_user_reward_record !== null ||
      data?.state !== RedEnvelopeState.Ongoing)
  const onOpenTheRedEnvelope = useCallback<(o?: OnOpenOptions) => void>(
    async (options) => {
      if (isRefetching) return
      if (!isLogined) {
        const redirectUri = `${location.pathname}?open=true`
        UnipassConfig.setRedirectUri(redirectUri)
        push(RoutePath.Login, {
          redirect: redirectUri,
        })
        return
      }
      setIsRefetching(true)
      const auth = options?.auth || (await getAuth())
      await api
        .openRedEnvelopeEvent(id, address, auth, {
          input: options?.input,
        })
        .then(async () => {
          if (isOpened) return
          let i = 0
          for (; i < 3; i++) {
            const res = await refetch()
            const isPolling =
              res.data?.current_user_reward_record === null &&
              res.data?.state === RedEnvelopeState.Ongoing
            if (!isPolling) break
            await sleep(1000)
          }
          setIsRefetching(false)
          if (i >= 3) {
            throw new Error('try it again')
          }
        })
        .catch((err: AxiosError) => {
          const ignoreCodeSet = new Set([1069, 1070, 1071])
          const response =
            err.request && typeof err?.request?.response === 'string'
              ? JSON.parse(err.request.response)
              : err?.request?.response
          if (!ignoreCodeSet.has(response?.code)) {
            if (data?.rule_info?.rule_type === RuleType.password) {
              toast(t('red-envelope.error-password'))
            } else if (data?.rule_info?.rule_type === RuleType.puzzle) {
              toast(t('red-envelope.error-puzzle'))
            } else if (err.response?.status === 400) {
              toast(t('red-envelope.error-conditions'))
            } else {
              toast(t('red-envelope.try-again'))
            }
          }
          setIsRefetching(false)
          throw err
        })
        .finally(() => {
          setIsRefetch(true)
          setIsRefetching(false)
        })
    },
    [
      address,
      api,
      data?.rule_info?.rule_type,
      getAuth,
      id,
      isLogined,
      isOpened,
      isRefetching,
      push,
      refetch,
      t,
      toast,
    ]
  )

  useEffect(() => {
    if (isAutoOpen === 'true' && data?.rule_info === null && !isOpened) {
      onOpenTheRedEnvelope()
    }
  }, [data?.rule_info, getAuth, isAutoOpen, isOpened, onOpenTheRedEnvelope])

  if (error?.response?.status === 404) {
    return <Redirect to={RoutePath.NotFound} />
  }

  const coverHeight = `${Math.max(Math.floor(height * 0.3), 200)}px`

  return (
    <Container minH={height}>
      {isLoading ? (
        <Center h={height}>
          <Spinner color="#F9E0B7" />
        </Center>
      ) : (
        <>
          <Box
            w="100%"
            minH={isOpened ? '80px' : '200px'}
            overflow="hidden"
            top="0"
            transition="300ms"
            zIndex={5}
            transform="translate3d(0, 0, 0)"
            animation="show-down 0.2s"
            style={{
              height: isOpened ? '80px' : coverHeight,
              position: isOpened ? 'sticky' : undefined,
            }}
          >
            <AspectRatio
              rounded="full"
              position="absolute"
              bottom="10px"
              left="-100%"
              w="300%"
              ratio={1 / 1}
              shadow="0 2px 4px rgba(0, 0, 0, 0.25)"
              border="2px solid #F9E0B7"
              overflow="hidden"
              bgColor="#E94030"
            >
              <Flex>
                <Image
                  src={DEFAULT_RED_ENVELOPE_COVER_PATH}
                  position="absolute"
                  w="calc(100% / 3 + 2px)"
                  h={coverHeight}
                  bottom="0"
                  zIndex={0}
                />
                {data?.cover_image_url ? (
                  <Image
                    src={data?.cover_image_url}
                    w="calc(100% / 3 + 2px)"
                    h={coverHeight}
                    objectFit="cover"
                    mt="auto"
                    transition="300ms"
                    top={`calc(100% - ${coverHeight})`}
                    zIndex={1}
                  />
                ) : null}
              </Flex>
            </AspectRatio>
          </Box>
          <Flex direction="column" animation="show 0.2s" h="70%" flex={1}>
            {isOpened ? (
              <Records
                uuid={id}
                data={data}
                address={address}
                isAlreadyOpened={
                  !isRefetch && data?.state === RedEnvelopeState.Ongoing
                }
              />
            ) : (
              <Cover
                address={address}
                data={data}
                onOpen={onOpenTheRedEnvelope}
                isOpening={isRefetching}
                isLogined={isLogined}
                autoGetAuth={walletType === WalletType.Metamask}
              />
            )}
          </Flex>
        </>
      )}
    </Container>
  )
}
