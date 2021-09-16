import React from 'react'
import { useHistory } from 'react-router'
import { useRouteQuery } from '../../hooks/useRouteQuery'
import {
  CustomRewardType,
  formatToRedeemItem,
  RedeemDetailModel,
  RedeemEventItem,
} from '../../models/redeem'
import { SubmitAddress } from './SubmitAddress'
import { SubmitCkb } from './SubmitCkb'
import { SubmitEmail } from './SubmitEmail'

export interface SubmitInfoProps {
  data: RedeemDetailModel | RedeemEventItem
}

export const SubmitInfo: React.FC<SubmitInfoProps> = ({ data: item }) => {
  const deliverType = useRouteQuery<CustomRewardType>(
    'deliverType',
    CustomRewardType.None
  )
  const history = useHistory()
  const matchAddress = deliverType === CustomRewardType.Address
  const matchEmail = deliverType === CustomRewardType.Email
  const matchCkb = deliverType === CustomRewardType.Ckb
  const data = formatToRedeemItem(item)

  return (
    <>
      <SubmitAddress
        id={data?.uuid}
        open={!!matchAddress}
        willDestroyed={data?.rule_info?.will_destroyed}
        status={data.state}
        close={() => history.goBack()}
      />
      <SubmitEmail
        id={data?.uuid}
        willDestroyed={data?.rule_info?.will_destroyed}
        open={!!matchEmail}
        status={data?.state}
        close={() => history.goBack()}
      />
      <SubmitCkb
        id={data?.uuid}
        willDestroyed={data?.rule_info?.will_destroyed}
        open={!!matchCkb}
        status={data?.state}
        close={() => history.goBack()}
      />
    </>
  )
}
