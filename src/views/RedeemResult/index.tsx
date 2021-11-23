import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useLocation, useParams } from 'react-router'
import { Loading } from '../../components/Loading'
import { TransferState } from '../../hooks/useRedeem'
import { useRouteQuery } from '../../hooks/useRouteQuery'
import { Query } from '../../models'
import { ReactComponent as SuccessSvg } from '../../assets/svg/order-success.svg'
import { ReactComponent as FailSvg } from '../../assets/svg/fail.svg'
import { ReactComponent as BackSvg } from '../../assets/svg/back.svg'
import { RoutePath } from '../../routes'
import { formatTime } from '../../utils'
import { useAPI } from '../../hooks/useAccount'
import { RainbowBackground } from '../../components/RainbowBackground'
import { Box, Center, Flex, Heading, Link } from '@chakra-ui/react'
import { Appbar, AppbarButton, AppbarSticky } from '../../components/Appbar'
import { useHistoryBack } from '../../hooks/useHistoryBack'
import { Button } from '@mibao-ui/components'
import { ReactComponent as FullLogo } from '../../assets/svg/full-logo.svg'

export enum ResultFlag {
  None = 'none',
  Success = 'success',
  Fail = 'fail',
}

interface ResultProps {
  type: ResultFlag
  title: string
  time: string
  desc?: string
}

const Result: React.FC<ResultProps> = ({ type, title, time, desc }) => {
  return (
    <>
      <Center mb="20px">
        {type === ResultFlag.Success ? <SuccessSvg /> : null}
        {type === ResultFlag.Fail ? <FailSvg /> : null}
      </Center>
      <Heading fontSize="30px" mb="8px">
        {title}
      </Heading>
      <Box fontSize="12px">{time}</Box>
      <Box fontSize="16px" color="#FD6A3C" whiteSpace="pre-line" mt="80px">
        {desc}
      </Box>
    </>
  )
}

export const RedeemResult: React.FC = () => {
  const api = useAPI()
  const resultFlag = useRouteQuery<ResultFlag>('result', ResultFlag.None)
  const { id } = useParams<{ id: string }>()
  const location = useLocation<TransferState>()
  const { t, i18n } = useTranslation('translations')
  const transfer = useCallback(async () => {
    const { signature = '', tx, customData } = location?.state
    if (tx) {
      const { data } = await api.redeem({
        uuid: id,
        customData,
        tx,
      })
      return data
    }
    const { tx: unsignTx } = await api.getRedeemTransaction(id, true)
    const { data } = await api.redeem({
      uuid: id,
      customData,
      tx: unsignTx,
      sig: signature,
    })
    return data
  }, [id, api, location?.state])
  const onBack = useHistoryBack()
  const { data, isError, isLoading } = useQuery(
    [Query.SendRedeem, id, api, resultFlag],
    transfer,
    {
      enabled: id != null && resultFlag === ResultFlag.None,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      staleTime: Infinity,
    }
  )
  const isSucceed = !isError && data
  const hasCustomData = !!location.state?.customData
  const resultProps = isSucceed
    ? {
        type: ResultFlag.Success,
        title: hasCustomData
          ? t('exchange.result.submited')
          : t('exchange.result.success'),
        time:
          t('exchange.result.time') +
          formatTime(data?.redeemed_timestamp, i18n.language),
        desc: hasCustomData
          ? t('exchange.result.custom')
          : t('exchange.result.succeed-desc'),
      }
    : {
        type: ResultFlag.Fail,
        title: t('exchange.result.fail'),
        time: t('exchange.result.error'),
      }

  return (
    <RainbowBackground px="24px">
      <AppbarSticky position="absolute" top="0" zIndex={2}>
        <Appbar
          left={
            <AppbarButton onClick={onBack}>
              <BackSvg />
            </AppbarButton>
          }
          transparent
        />
      </AppbarSticky>

      <Flex
        w="full"
        h="60%"
        bg="rgba(255, 255, 255, 0.7)"
        zIndex={2}
        position="relative"
        rounded="22px"
        justify="center"
        direction="column"
        textAlign="center"
        mt="auto"
      >
        {!isLoading ? (
          <>
            <Result {...resultProps} />
          </>
        ) : (
          <Loading desc={t('exchange.result.redeeming')} />
        )}
      </Flex>

      <Box mt="30px" w="full">
        <Link to={isSucceed ? RoutePath.MyRedeem : RoutePath.Redeem}>
          <Button variant="solid" isFullWidth colorScheme="primary">
            {isSucceed
              ? hasCustomData
                ? t('exchange.result.confirm')
                : t('exchange.result.check')
              : t('exchange.result.go-back')}
          </Button>
        </Link>
      </Box>

      <Center mt="auto" mb="50px">
        <FullLogo />
      </Center>
    </RainbowBackground>
  )
}
