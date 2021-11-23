import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  CustomRewardType,
  isBlindReward,
  isCustomReward,
  RedeemEventItem,
  RedeemStatus,
  UserRedeemState,
} from '../../models/redeem'
import { RedeemLabel } from './Label'
import { useHistory, useRouteMatch } from 'react-router'
import { RoutePath } from '../../routes'
import { Media } from './Media'
import { useSignRedeem } from '../../hooks/useRedeem'
import {
  Issuer,
  Progress as RawProgress,
  Divider,
  Stack,
  Box,
  Flex,
  Button,
  Center,
} from '@mibao-ui/components'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

const Container = styled(Link)`
  box-shadow: 0px 1px 8px rgba(0, 0, 0, 0.08);
  border-radius: 20px;
  background-color: white;
  margin: 0 20px 16px 20px;
  display: block;
`
interface ProgressProps {
  total: number
  exchanged: number
}

const Progress: React.FC<ProgressProps> = ({ total, exchanged }) => {
  const [t] = useTranslation('translations')
  return (
    <Stack spacing={2} mt="10px" mb="15px" mx="12px">
      <Box fontSize="12px">
        {t('exchange.progress')}:
        <Box as="span" ml="6px">
          {exchanged}/{total}
        </Box>
      </Box>
      <RawProgress
        colorScheme="process"
        value={(exchanged / total) * 100}
        height="6px"
      />
    </Stack>
  )
}

export interface ExchangeEventProps {
  item: RedeemEventItem
}

interface ActionProps {
  status: RedeemStatus
  id: string
  prizeId: string
  userState: UserRedeemState
  willDestroyed: boolean
  deliverType: CustomRewardType
  item?: RedeemEventItem
}

const ExchangeAction: React.FC<ActionProps> = ({
  status,
  id,
  userState,
  prizeId,
  willDestroyed,
  deliverType,
  item,
}) => {
  const [t] = useTranslation('translations')
  const isAllowRedeem =
    status === RedeemStatus.Open && UserRedeemState.AllowRedeem === userState
  const matchMyRedeem = useRouteMatch(RoutePath.MyRedeem)
  const text = useMemo(() => {
    if (status === RedeemStatus.Closed) {
      return t('exchange.event.closed')
    } else if (status === RedeemStatus.Done) {
      return t('exchange.event.end')
    } else if (userState === UserRedeemState.AllowRedeem) {
      return ''
    }
    if (matchMyRedeem) {
      return ''
    }
    return t('exchange.actions.insufficient')
  }, [status, t, userState, matchMyRedeem])

  const { onRedeem } = useSignRedeem()

  return (
    <Flex justify="space-between" h="45px" px="15px">
      <Box
        as="span"
        fontSize="12px"
        color="#777E90"
        py="auto"
        lineHeight="45px"
        overflow="hidden"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
      >
        {text}
      </Box>
      <Stack my="auto" spacing="12px" direction="row">
        <Button size="sm" fontSize="12px">
          {t('exchange.actions.view-prizes')}
        </Button>
        {status === RedeemStatus.Open ? (
          <Button
            size="sm"
            fontSize="12px"
            disabled={!isAllowRedeem}
            colorScheme="primary"
            onClick={(e) => {
              onRedeem({
                deliverType,
                isAllow: true,
                id,
                willDestroyed,
                item,
              })
              e?.stopPropagation()
              e?.preventDefault()
            }}
          >
            {t('exchange.actions.redeem')}
          </Button>
        ) : null}
      </Stack>
    </Flex>
  )
}

export const RedeemCard: React.FC<ExchangeEventProps> = ({ item }) => {
  const [t] = useTranslation('translations')
  const history = useHistory()
  const rewards = useMemo(() => {
    if (isCustomReward(item.reward_info)) {
      return item.reward_info.images.slice(0, 4).map((src, i) => {
        return <Media src={src} key={i} />
      })
    }
    const tokens = isBlindReward(item.reward_info)
      ? item.reward_info.options
      : item.reward_info

    return tokens.slice(0, 4).map((t, i) => {
      const isBaned = t.is_banned || t.is_class_banned || t.is_issuer_banned
      return <Media src={isBaned ? '' : t.class_bg_image_url} key={i} />
    })
  }, [item.reward_info])
  return (
    <Container
      to={{
        pathname: `${RoutePath.Redeem}/${item.uuid}`,
        state: item,
      }}
    >
      <Flex px="16px" py="12px" justify="space-between">
        <Issuer
          isBanned={item?.issuer_info?.is_issuer_banned}
          src={item?.issuer_info.avatar_url}
          name={item?.issuer_info?.name}
          isVerified={
            item?.issuer_info?.is_issuer_banned
              ? false
              : item?.verified_info?.is_verified
          }
          href={`${RoutePath.Issuer}/${
            item?.issuer_info?.issuer_id ?? item?.issuer_info?.uuid
          }`}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            history.push(
              `${RoutePath.Issuer}/${
                item?.issuer_info?.issuer_id ?? item?.issuer_info?.uuid
              }`
            )
          }}
          size="25px"
        />
        <Box
          as="span"
          color="#999"
          fontSize="12px"
          display="inline-block"
          my="auto"
          whiteSpace="nowrap"
        >
          {t('exchange.issuer')}
        </Box>
      </Flex>
      <Divider />
      <Flex justify="space-between" px="16px" py="12px">
        <Box
          as="span"
          fontSize="14px"
          fontWeight="500"
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          mr="10px"
        >
          {item.name}
        </Box>
        <Center>
          <RedeemLabel type={item.reward_type} />
        </Center>
      </Flex>
      {rewards.length ? (
        <Flex
          px="16px"
          py="8px"
          alignItems="center"
          overflowY="hidden"
          overflowX="auto"
        >
          {rewards}
        </Flex>
      ) : null}
      <Progress exchanged={item.progress.claimed} total={item.progress.total} />
      <Divider />
      <ExchangeAction
        status={item.state}
        id={item.uuid}
        willDestroyed={item?.rule_info?.will_destroyed}
        prizeId={item.user_redeemed_record_uuid}
        userState={item.user_redeemed_state}
        item={item}
        deliverType={
          isCustomReward(item?.reward_info)
            ? item?.reward_info?.delivery_type
            : CustomRewardType.None
        }
      />
    </Container>
  )
}
