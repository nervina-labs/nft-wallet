/* eslint-disable @typescript-eslint/indent */
import styled from '@emotion/styled'
import { AspectRatio } from '@mibao-ui/components'
import { Box, Center, Flex, Image, Spinner } from '@chakra-ui/react'
import { MainContainer } from '../../styles'
import DEFAULT_RED_ENVELOPE_COVER_PATH from '../../assets/svg/red-envelope-cover.svg'
import { useThemeColor } from '../../hooks/useThemeColor'
import { useInnerSize } from '../../hooks/useInnerSize'
import { Cover } from './components/cover'
import { Redirect, useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useAccount, useAPI } from '../../hooks/useAccount'
import { Query, RedEnvelopeResponse, RedEnvelopeState } from '../../models'
import { RoutePath } from '../../routes'
import { AxiosError } from 'axios'
import { Records } from './components/records'
import { useCallback, useState } from 'react'

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
  const { id } = useParams<{ id: string }>()
  useThemeColor('#E94030')
  const { height } = useInnerSize()

  const api = useAPI()
  const { address } = useAccount()
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
  const [isRefetching, setIsRefetching] = useState(false)
  const [isRefetch, setIsRefetch] = useState(false)
  const isOpened =
    data?.user_claimed || (data && data?.state !== RedEnvelopeState.Ongoing)

  const onReload = useCallback(async () => {
    setIsRefetching(true)
    await refetch().finally(() => {
      setIsRefetching(false)
    })
    setIsRefetch(true)
  }, [refetch])

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
                uuid={id}
                data={data}
                onOpen={onReload}
                opening={isRefetching}
              />
            )}
          </Flex>
        </>
      )}
    </Container>
  )
}
