import React, { useMemo } from 'react'
import { Appbar, AppbarSticky } from '../../components/Appbar'
import styled from 'styled-components'
import { MainContainer } from '../../styles'
import { useTranslation } from 'react-i18next'
import { Redirect, useParams } from 'react-router'
import { RoutePath } from '../../routes'
import { useQuery } from 'react-query'
import { Query } from '../../models'
import { Loading } from '../../components/Loading'
import { RedeemLabel } from '../Redeem/Label'
import { Prize } from '../Redeem/Prize'
import { formatTime } from '../../utils'
import { isCustomReward } from '../../models/redeem'
import { useAccount, useAPI } from '../../hooks/useAccount'
import { Box, Divider, Flex } from '@chakra-ui/react'

const BoxContainer = styled(Box)`
  padding: 16px;
  margin: 20px;
  border-radius: 20px;
  background: #fff;
`

const RowContainer = styled(Box)`
  margin-top: 8px;
  .row {
    display: flex;
    .value,
    .label {
      font-size: 12px;
    }
    .label {
      word-break: keep-all;
    }
    .value {
      margin-left: 4px;
      flex: 1;
      word-break: break-all;
    }
  }
`

interface RowProps {
  label: React.ReactNode
}

const Row: React.FC<RowProps> = ({ label, children }) => {
  return (
    <div className="row">
      <div className="label">{label}</div>
      <div className="value">{children}</div>
    </div>
  )
}

const Container = styled(MainContainer)`
  display: flex;
  flex-direction: column;
  min-height: 100%;

  background: #f6f6f6;
  h4 {
    text-align: center;
    color: rgba(0, 0, 0, 0.6);
  }
  main {
    background: #f6f6f6;
    flex: 1;
  }
`

export const RedeemPrize: React.FC = () => {
  const { t, i18n } = useTranslation('translations')
  const { id } = useParams<{ id: string }>()
  const api = useAPI()
  const { address } = useAccount()
  const { isError, data } = useQuery(
    [Query.RedeemPrize, id, api],
    async () => {
      const { data } = await api.getRedeemPrize(id)
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

  const comment = useMemo(() => {
    if (isCustomReward(data?.record_info)) {
      return data?.record_info.comment
    }
  }, [data])

  const addressInfo = useMemo(() => {
    if (isCustomReward(data?.record_info)) {
      return data?.record_info.delivery_info
    }
  }, [data])

  if (isError) {
    return <Redirect to={RoutePath.NotFound} />
  }

  return (
    <Container>
      <AppbarSticky>
        <Appbar title={t('exchange.prize.title')} />
      </AppbarSticky>

      <Box>
        {data == null ? (
          <Loading />
        ) : (
          <Box>
            <BoxContainer>
              <Flex justify="space-between" alignItems="center" mb="8px">
                <Box fontSize="16px" fontWeight="bold" color="#000">
                  {t('exchange.prize.get')}
                </Box>
                <RedeemLabel type={data.reward_type} />
              </Flex>
              <Divider mb="20px" />
              <Prize prizes={data.record_info} showLabel={false} />
              <Divider mt="10px" />
              <Box color="#777E90" fontSize="12px" mt="10px">
                {t('exchange.redeem-time')}
                {formatTime(data.redeemed_timestamp, i18n.language)}
              </Box>
            </BoxContainer>

            <BoxContainer>
              <Box fontSize="16px" fontWeight="bold" color="#000">
                {t('exchange.prize.receiver.info')}
              </Box>
              <Divider mt="8px" />
              {addressInfo?.name ? (
                <RowContainer>
                  <Row label={t('exchange.prize.address.name')}>
                    {addressInfo.name}
                  </Row>
                </RowContainer>
              ) : null}
              {addressInfo?.phone_number ? (
                <RowContainer>
                  <Row label={t('exchange.prize.address.phone')}>
                    {addressInfo.phone_number}
                  </Row>
                </RowContainer>
              ) : null}
              {addressInfo?.address ? (
                <RowContainer>
                  <Row label={t('exchange.prize.address.address')}>
                    {addressInfo.address}
                  </Row>
                </RowContainer>
              ) : null}
              {addressInfo?.ckb_address ? (
                <RowContainer>
                  <Row label={t('exchange.prize.ckb')}>
                    {addressInfo.ckb_address}
                  </Row>
                </RowContainer>
              ) : null}
              {addressInfo == null ? (
                <RowContainer>
                  <Row label={t('exchange.prize.address.address')}>
                    {address}
                  </Row>
                </RowContainer>
              ) : null}
            </BoxContainer>

            {comment ? (
              <BoxContainer>
                <Box fontSize="16px" fontWeight="bold" color="#000">
                  {t('exchange.prize.issuer.comment')}
                </Box>
                <Divider my="8px" />
                <Box fontSize="12px" mt="8px" whiteSpace="pre-line">
                  {comment}
                </Box>
              </BoxContainer>
            ) : null}
          </Box>
        )}
      </Box>
    </Container>
  )
}
