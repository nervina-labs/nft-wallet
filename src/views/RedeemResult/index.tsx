import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useHistory, useLocation, useParams } from 'react-router'
import { Loading } from '../../components/Loading'
import { TransferState } from '../../hooks/useRedeem'
import { useRouteQuery } from '../../hooks/useRouteQuery'
import { Query } from '../../models'
import { ReactComponent as SuccessSvg } from '../../assets/svg/order-success.svg'
import { ReactComponent as FailSvg } from '../../assets/svg/fail.svg'
import { RoutePath } from '../../routes'
import { formatTime } from '../../utils'
import { useAccount, useAPI, WalletType } from '../../hooks/useAccount'
import { RainbowBackground } from '../../components/RainbowBackground'
import { AspectRatio, Box, Center, Flex, Heading } from '@chakra-ui/react'
import { Appbar, AppbarSticky } from '../../components/Appbar'
import { Button } from '@mibao-ui/components'
import { ReactComponent as FullLogo } from '../../assets/svg/full-logo.svg'
import { Link } from 'react-router-dom'
import { appendSignatureToTransaction } from '@nervina-labs/flashsigner'

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
      <AspectRatio ratio={1 / 1} w="70px" h="70px" mb="20px" mx="auto">
        {type === ResultFlag.Success ? <SuccessSvg /> : <FailSvg />}
      </AspectRatio>
      <Heading fontSize="30px" mb="10px">
        {title}
      </Heading>
      <Box fontSize="14px">{time}</Box>
      <Box fontSize="16px" color="#FD6A3C" whiteSpace="pre-line" mt="80px">
        {desc}
      </Box>
    </>
  )
}

export const RedeemResult: React.FC = () => {
  const api = useAPI()
  const { replace } = useHistory()
  const resultFlag = useRouteQuery<ResultFlag>('result', ResultFlag.None)
  const { id } = useParams<{ id: string }>()
  const location = useLocation<TransferState>()
  const { walletType } = useAccount()
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
    if (walletType === WalletType.Flashsigner && signature) {
      const { unSignedTx } = await api.getRedeemTransaction(id, walletType)
      const { data } = await api.redeem({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        tx: appendSignatureToTransaction(unSignedTx!, signature),
        uuid: id,
        customData,
      })
      return data
    }
    const { tx: unsignTx } = await api.getRedeemTransaction(id, walletType)
    const { data } = await api.redeem({
      uuid: id,
      customData,
      tx: unsignTx,
      sig: signature,
    })
    return data
  }, [id, api, location?.state, walletType])
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
    <RainbowBackground
      px="24px"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <AppbarSticky position="absolute" top="0" zIndex={2}>
        <Appbar
          transparent
          onLeftClick={() => {
            replace(isSucceed ? RoutePath.MyRedeem : RoutePath.Redeem)
          }}
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
        px="30px"
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
        <Link to={isSucceed ? RoutePath.MyRedeem : RoutePath.Redeem} replace>
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
