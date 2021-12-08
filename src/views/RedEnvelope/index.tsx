/* eslint-disable @typescript-eslint/indent */
import styled from '@emotion/styled'
import { AspectRatio } from '@mibao-ui/components'
import { Box, Center, Flex, Image, Spinner } from '@chakra-ui/react'
import { MainContainer } from '../../styles'
import DEFAULT_RED_ENVELOPE_COVER_PATH from '../../assets/svg/red-envelope-cover.svg'
import { useThemeColor } from '../../hooks/useThemeColor'
import { useInnerSize } from '../../hooks/useInnerSize'
import { Cover } from './components/cover'
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
import { useCallback, useState } from 'react'
import { useGetAndSetAuth } from '../../hooks/useProfile'
import { useTranslation } from 'react-i18next'
import { UnipassConfig } from '../../utils'
import { useToast } from '../../hooks/useToast'

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
  const { address } = useAccount()
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
  const onOpenTheRedEnvelope = useCallback(
    async (input?: string) => {
      if (!isLogined) {
        UnipassConfig.setRedirectUri(location.pathname)
        push(RoutePath.Login)
        return
      }
      setIsRefetching(true)
      const auth = await getAuth()
      await api
        .openRedEnvelopeEvent(id, address, auth, {
          input,
        })
        .catch((err: AxiosError) => {
          if (data?.rule_info?.rule_type === RuleType.password) {
            toast(t('red-envelope.error-password'))
          } else if (data?.rule_info?.rule_type === RuleType.puzzle) {
            toast(t('red-envelope.error-puzzle'))
          } else if (err.response?.status === 400) {
            toast(t('red-envelope.error-conditions'))
          }
          throw err
        })
        .then(async () => await refetch())
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
      push,
      refetch,
      t,
      toast,
    ]
  )

  const isOpened =
    data?.user_claimed || (data && data?.state !== RedEnvelopeState.Ongoing)

  if (error?.response?.status === 404) {
    return <Redirect to={RoutePath.NotFound} />
  }

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
            h={isOpened ? '80px' : '30%'}
            minH={isOpened ? '80px' : '200px'}
            overflow="hidden"
            position="sticky"
            top="0"
            transition="300ms"
            zIndex={5}
            transform="translate3d(0, 0, 0)"
            animation="show-down 0.2s"
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
              bg="#E94030"
              overflow="hidden"
            >
              <Flex>
                <Image
                  src={data?.cover_image_url || DEFAULT_RED_ENVELOPE_COVER_PATH}
                  w="35%"
                  h="35%"
                  mt="auto"
                  objectFit="cover"
                />
              </Flex>
            </AspectRatio>
          </Box>
          <Flex direction="column" animation="show 0.2s" h="70%" flex={1}>
            {isOpened ? (
              <Records
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
              />
            )}
          </Flex>
        </>
      )}
    </Container>
  )
}