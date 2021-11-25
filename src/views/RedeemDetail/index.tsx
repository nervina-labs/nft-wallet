import React, { useMemo } from 'react'
import { useQuery } from 'react-query'
import { Redirect, useHistory, useParams } from 'react-router'
import styled from 'styled-components'
import { Appbar } from '../../components/Appbar'
import { Loading } from '../../components/Loading'
import { Query } from '../../models'
import { RoutePath } from '../../routes'
import { MainContainer } from '../../styles'
import { useTranslation } from 'react-i18next'
import { formatTime } from '../../utils'
import {
  isCustomReward,
  RedeemDetailModel,
  RedeemStatus,
  UserRedeemState,
} from '../../models/redeem'
import { Prize } from '../Redeem/Prize'
import { Condition } from './Condition'
import { Footer } from './Footer'
import { useSignRedeem } from '../../hooks/useRedeem'
import { SubmitInfo } from './SubmitInfo'
import { useAPI } from '../../hooks/useAccount'
import {
  Issuer,
  Progress,
  Box,
  Tab,
  TabList,
  Tabs,
  AspectRatio,
  Flex,
  Stack,
  Center,
  Heading,
  Text,
} from '@mibao-ui/components'
import { Alert } from '../../components/Alert'
import { RedeemLabel } from '../Redeem/Label'
import { useRouteQuerySearch } from '../../hooks/useRouteQuery'

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

interface CustomFooterProps {
  data: RedeemDetailModel
}

const CustomFooter: React.FC<CustomFooterProps> = ({ data }) => {
  const { onRedeem } = useSignRedeem()

  return (
    <Footer
      status={data.state}
      willDestroyed={data?.rule_info?.will_destroyed}
      isRedeemable={
        data.user_redeemed_state === UserRedeemState.AllowRedeem &&
        data?.state === RedeemStatus.Open
      }
      onClick={() => {
        onRedeem({
          isAllow: data?.user_redeemed_state === UserRedeemState.AllowRedeem,
          willDestroyed: data?.rule_info?.will_destroyed,
          id: data.uuid,
          deliverType: isCustomReward(data?.reward_info)
            ? data?.reward_info.delivery_type
            : undefined,
        })
      }}
    />
  )
}

const TAB_TYPE_SET = ['prize', 'condition'] as const
type TabType = typeof TAB_TYPE_SET[number]

export const RedeemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { t, i18n } = useTranslation('translations')
  const api = useAPI()
  const history = useHistory()
  const { isError, data } = useQuery(
    [Query.RedeemDetail, id, api],
    async () => {
      const { data } = await api.getRedeemDetail(id)
      return data
    },
    {
      enabled: id != null,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: false,
    }
  )

  const isClosed = data?.state === RedeemStatus.Closed
  const isDone = data?.state === RedeemStatus.Done

  const [tabType, setTabType] = useRouteQuerySearch<TabType>(
    'type',
    TAB_TYPE_SET[0]
  )
  const tabIndex = useMemo(() => {
    const i = TAB_TYPE_SET.indexOf(tabType)
    return i === -1 ? 0 : i
  }, [tabType])

  const status = useMemo(() => {
    const status = data?.state
    if (status === RedeemStatus.Closed) {
      return t('exchange.event.closed')
    } else if (status === RedeemStatus.Done) {
      return t('exchange.event.end')
    }
    return t('exchange.event.on-going')
  }, [data?.state, t])

  if (isError) {
    return <Redirect to={RoutePath.NotFound} />
  }

  return (
    <Container>
      <Box position="relative" zIndex={1}>
        <Appbar transparent title={t('exchange.event.title')} />
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
        {data == null ? (
          <Loading />
        ) : (
          <>
            <Flex h="110px" justify="space-between" px="20px">
              <Stack spacing="4px" my="auto">
                <Heading
                  fontSize="26px"
                  fontWeight="500"
                  color={
                    data.state === RedeemStatus.Closed ? '#777E90' : undefined
                  }
                >
                  {status}
                </Heading>
                <Box fontSize="12px">
                  {t('exchange.issue-time')}
                  {formatTime(data.start_timestamp, i18n.language)}
                </Box>
              </Stack>
              <Center>
                <RedeemLabel type={data.reward_type} />
              </Center>
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
                {t('exchange.progress')}
              </Box>
              <Progress
                value={
                  isDone
                    ? 100
                    : (data?.progress.claimed / data?.progress.total) * 100
                }
                colorScheme={isClosed ? 'gray' : 'process'}
                mb="8px"
                height="8px"
              />
              <Flex fontSize="12px" justify="space-between">
                <Box>
                  {t('exchange.exchanged')}: {data?.progress.claimed}
                </Box>
                <Box>
                  {t('exchange.remain')}:{' '}
                  {data?.progress.total - data?.progress.claimed}
                </Box>
              </Flex>
            </Box>

            <Heading fontSize="16px" m="20px" mb="10px">
              {data.name}
            </Heading>

            <Text
              mx="20px"
              fontSize="14px"
              color="#777E90"
              whiteSpace="pre-line"
            >
              {data.description}
            </Text>

            <Box m="20px">
              <Issuer
                isBanned={data?.issuer_info?.is_issuer_banned}
                src={data.issuer_info.avatar_url}
                name={data.issuer_info?.name}
                isVerified={
                  data?.issuer_info?.is_issuer_banned
                    ? false
                    : data?.verified_info?.is_verified
                }
                verifiedTitle={t('exchange.issuer')}
                href={`${RoutePath.Issuer}/${
                  data.issuer_info?.issuer_id ?? data.issuer_info?.uuid
                }`}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  history.push(
                    `${RoutePath.Issuer}/${
                      data.issuer_info?.issuer_id ?? data.issuer_info?.uuid
                    }`
                  )
                }}
                size="40px"
              />
            </Box>

            <Tabs
              index={tabIndex}
              colorScheme="black"
              align="space-around"
              mb="auto"
            >
              <TabList px="20px">
                <Tab onClick={() => setTabType('prize')}>
                  {t('exchange.event.tabs.price')}
                </Tab>
                <Tab onClick={() => setTabType('condition')}>
                  {t('exchange.event.tabs.requirement')}
                </Tab>
              </TabList>
            </Tabs>
            <Box my="20px">
              {tabIndex === 0 ? <Prize prizes={data.reward_info} /> : null}
              {tabIndex === 1 ? <Condition detail={data} /> : null}
            </Box>
            <Box px="20px" mt="auto">
              <Alert
                borderRadius="8px"
                bg="rgba(255, 206, 166, 0.1)"
                color="#FF5C00"
              >
                {t(
                  `exchange.warning${
                    data?.rule_info?.will_destroyed ? '-destroyed' : ''
                  }`
                )}
              </Alert>
            </Box>
            <CustomFooter data={data} />
            <SubmitInfo data={data} />
          </>
        )}
      </Box>
    </Container>
  )
}
