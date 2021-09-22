import React, { useCallback } from 'react'
import { useHistory, useLocation } from 'react-router'
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
  data?: RedeemDetailModel | RedeemEventItem
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
  const rlocation = useLocation<RedeemDetailModel>()
  const state = rlocation?.state ?? {}
  const data = formatToRedeemItem(item || state)
  const onClose = useCallback(() => {
    const url = new URL(location.href)
    const { searchParams } = url
    for (const [k] of searchParams.entries()) {
      if (k === 'deliverType') {
        searchParams.delete(k)
      }
    }
    const s = decodeURIComponent(searchParams.toString())
    const target = `${location.pathname}${s.length === 0 ? '' : '?' + s}`
    history.replace(target)
  }, [history])

  return (
    <>
      <SubmitAddress
        id={data?.uuid}
        open={!!matchAddress}
        willDestroyed={data?.rule_info?.will_destroyed}
        status={data.state}
        close={onClose}
      />
      <SubmitEmail
        id={data?.uuid}
        willDestroyed={data?.rule_info?.will_destroyed}
        open={!!matchEmail}
        status={data?.state}
        close={onClose}
      />
      <SubmitCkb
        id={data?.uuid}
        willDestroyed={data?.rule_info?.will_destroyed}
        open={!!matchCkb}
        status={data?.state}
        close={onClose}
      />
    </>
  )
}
