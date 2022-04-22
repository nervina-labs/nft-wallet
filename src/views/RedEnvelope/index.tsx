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
import { useAccount, useAccountStatus, useAPI } from '../../hooks/useAccount'
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
import { useGetAndSetAuth, useProfile } from '../../hooks/useProfile'
import { useTranslation } from 'react-i18next'
import { UnipassConfig } from '../../utils'
import { useToast } from '../../hooks/useToast'
import { useRouteQuery } from '../../hooks/useRouteQuery'
import { useUnipassV2Dialog } from '../../hooks/useUnipassV2Dialog'
import {
  concat,
  defer,
  delay,
  from,
  lastValueFrom,
  scan,
  switchMap,
  takeWhile,
  tap,
} from 'rxjs'
import { ErrorCode } from '../../utils/error'

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

const WAIT_PENDING_TIME = 2000

export const RedEnvelope: React.FC = () => {
  useThemeColor('#E94030')
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation('translations')
  const { height } = useInnerSize()
  const api = useAPI()
  const isAutoOpen = useRouteQuery<'true' | 'false'>('open', 'false')
  const { address } = useAccount()
  const [isRefetching, setIsRefetching] = useState(false)
  const [isRefetch, setIsRefetch] = useState(false)
  const toast = useToast()
  const { isLogined } = useAccountStatus()
  const getAuth = useGetAndSetAuth()
  const { isAuthenticated } = useProfile()
  const { push } = useHistory()
  const [isOpenedWithError, setIsOpenedWithError] = useState(false)
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
  const unipassDialog = useUnipassV2Dialog()
  const isOngoing = [
    RedEnvelopeState.Ongoing,
    RedEnvelopeState.Pending,
  ].includes(data?.state as RedEnvelopeState)
  const isOpened = !isLoading && (data?.is_current_user_claimed || !isOngoing)
  const [isClickedOpenButton, setIsClickedOpenButton] = useState(false)
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
      const auth = await getAuth().catch((err) => {
        setIsRefetching(false)
        throw err
      })

      const refetchFn = defer(() => from(refetch())).pipe(delay(1500))
      const POLLING_TIMES = 10
      const openAndReload = concat(
        isClickedOpenButton
          ? refetchFn
          : from(
              api.openRedEnvelopeEvent(id, address, auth, {
                input: options?.input,
              })
            ).pipe(
              tap(() => setIsClickedOpenButton(true)),
              switchMap(() => refetchFn)
            ),
        ...new Array(POLLING_TIMES).fill(0).map(() => refetchFn)
      ).pipe(
        scan((_, item, i) => {
          if (POLLING_TIMES <= i) {
            throw new Error('try again')
          }
          return item
        }),
        takeWhile(
          (res) =>
            !res.data?.is_current_user_claimed &&
            res.data?.state === RedEnvelopeState.Ongoing
        )
      )
      await lastValueFrom(openAndReload)
        .then(() => {
          setIsRefetch(true)
          setIsRefetching(false)
        })
        .catch(async (err) => {
          console.error({ err })
          const ignoreCodeSet = new Set([
            ErrorCode.RedEnvelopeClosed,
            ErrorCode.RedEnvelopeDone,
            ErrorCode.RedEnvelopeNotPending,
          ])
          const response =
            err.request && typeof err?.request?.response === 'string'
              ? JSON.parse(err.request.response)
              : err?.request?.response
          const code = response?.code
          if (code === 2022) {
            unipassDialog()
          } else if (code === ErrorCode.RedEnvelopeClaimed) {
            await refetch()
          } else if (
            !ignoreCodeSet.has(response?.code) &&
            err?.name !== 'EmptyError'
          ) {
            if (
              data?.rule_info?.rule_type === RuleType.password &&
              code === ErrorCode.RedEnvelopeRuleMatch
            ) {
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
          setIsOpenedWithError(true)
          setIsRefetch(true)
        })
    },
    [
      address,
      api,
      data?.rule_info?.rule_type,
      getAuth,
      id,
      isClickedOpenButton,
      isLogined,
      isRefetching,
      push,
      refetch,
      t,
      toast,
      unipassDialog,
    ]
  )

  useEffect(() => {
    if (
      isAutoOpen === 'true' &&
      data?.rule_info === null &&
      !isOpened &&
      isAuthenticated &&
      !isOpenedWithError
    ) {
      onOpenTheRedEnvelope()
    }
  }, [
    address,
    data?.rule_info,
    getAuth,
    isAutoOpen,
    isOpened,
    isAuthenticated,
    onOpenTheRedEnvelope,
    isOpenedWithError,
  ])

  useEffect(() => {
    if (data?.state !== RedEnvelopeState.Pending) {
      return
    }
    const timer = setInterval(() => {
      refetch()
      if (data?.state !== RedEnvelopeState.Pending) {
        clearInterval(timer)
      }
    }, WAIT_PENDING_TIME)
    return () => clearInterval(timer)
  }, [data?.state, refetch])

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
              />
            )}
          </Flex>
        </>
      )}
    </Container>
  )
}
