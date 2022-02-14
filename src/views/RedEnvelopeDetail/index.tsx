import { AspectRatio, Box, Flex, Heading, Stack } from '@chakra-ui/react'
import { Progress } from '@mibao-ui/components'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { Redirect, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { Appbar } from '../../components/Appbar'
import { useAccountStatus, useAPI } from '../../hooks/useAccount'
import { useGetAndSetAuth } from '../../hooks/useProfile'
import { Query, RedEnvelopeState } from '../../models'
import { RoutePath } from '../../routes'
import { MainContainer } from '../../styles'
import { formatTime } from '../../utils'
import { TokenList } from './components/tokenList'

const Container = styled(MainContainer)`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  position: relative;

  .bg-part-1 {
    position: absolute;
    width: 155px;
    height: 155px;
    right: 50px;
    top: -30px;
    background: #ffeb90;
    filter: blur(80px);
    z-index: 1;
  }

  .bg-part-2 {
    position: absolute;
    width: 120px;
    height: 120px;
    right: -30px;
    top: 20px;
    background: #ffa4e0;
    filter: blur(80px);
    z-index: 1;
  }
`

export const RedEnvelopeDetail: React.FC = () => {
  const { t, i18n } = useTranslation('translations')
  const { id } = useParams<{ id: string }>()
  const api = useAPI()
  const getAuth = useGetAndSetAuth()
  const { data } = useQuery([Query.GetSentRedEnvelopeDetail, id], async () => {
    const auth = await getAuth()
    const { data } = await api.getSentRedEnvelopeDetail(id, auth)
    return data
  })
  const isClosed =
    data?.state === RedEnvelopeState.Closed ||
    data?.state === RedEnvelopeState.Expired
  const statusText = useMemo(() => {
    switch (data?.state) {
      case RedEnvelopeState.Closed:
        return t('red-envelope-records.state.closed')
      case RedEnvelopeState.Done:
        return t('red-envelope-records.state.done')
      case RedEnvelopeState.Expired:
        return t('red-envelope-records.state.expired')
      case RedEnvelopeState.Pending:
      case RedEnvelopeState.Ongoing:
        return (
          <Box color="#0A0B26" as="span">
            {t('red-envelope-records.state.ongoing')}
          </Box>
        )
    }
    return '-'
  }, [data?.state, t])

  const { isLogined } = useAccountStatus()

  if (!isLogined) {
    return <Redirect to={RoutePath.Login} />
  }

  const progressValue = data
    ? Math.floor((data.progress.claimed / data.progress.total) * 100)
    : 0
  const time = data?.created_at
    ? formatTime(data.created_at, i18n.language, true)
    : '----:--:--'

  return (
    <Container position="relative">
      <Box position="relative" zIndex={1}>
        <Appbar transparent title={t('red-envelope-detail.title')} />
      </Box>

      <Box
        position="absolute"
        h="280px"
        top="0"
        left="0"
        w="full"
        overflow="hidden"
        zIndex={0}
      >
        <AspectRatio
          bg="linear-gradient(192.04deg, #DAF1FF 44.62%, #FFF0DF 100%)"
          radio={1 / 1}
          position="absolute"
          w="200%"
          rounded="100%"
          bottom="0"
          left="-50%"
        >
          <Box />
        </AspectRatio>
        <Box className="bg-part-1" />
        <Box className="bg-part-2" />
      </Box>
      <Box position="relative" zIndex={1}>
        <Flex h="110px" justify="space-between" px="20px">
          <Stack spacing="4px" my="auto">
            <Heading fontSize="26px" fontWeight="500" color={'#777E90'}>
              {statusText}
            </Heading>
            <Box fontSize="12px">
              {t('red-envelope-detail.generation-time')} {time}
            </Box>
          </Stack>
        </Flex>
        <Box
          px="15px"
          py="20px"
          bg="white"
          shadow="0px 4px 16px rgba(0, 0, 0, 0.08)"
          rounded="20px"
          mx="20px"
        >
          <Box fontSize="16px" mb="16px">
            {t('red-envelope-detail.progress')}
          </Box>
          <Progress
            value={progressValue}
            colorScheme={isClosed ? 'gray' : 'process'}
            mb="8px"
            height="8px"
          />
          <Flex fontSize="12px" justify="space-between">
            <Box>
              {t('red-envelope-detail.unopened')}
              {data ? data.progress.total - data.progress.claimed : 0 || '-'}
            </Box>
            <Box>
              {t('red-envelope-detail.received')}
              {data?.progress.claimed ?? '-'}
            </Box>
          </Flex>
        </Box>
        <Heading
          fontSize="12px"
          mt="32px"
          mb="15px"
          color="primary.600"
          mx="20px"
          fontWeight="normal"
        >
          {t('red-envelope-detail.contains-the-following-collections')}
        </Heading>
        <TokenList uuid={id} />
      </Box>
    </Container>
  )
}
