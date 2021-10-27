/* eslint-disable @typescript-eslint/restrict-plus-operands */
import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { Follow } from '../../components/Follow'
import { Issuer as IIssuer } from '../../models/issuer'
import { Query } from '../../models'
import { useGetAndSetAuth } from '../../hooks/useProfile'
import { useTranslation } from 'react-i18next'
import { Empty } from './empty'
import { truncateMiddle } from '../../utils'
import { RoutePath } from '../../routes'
import { useAPI } from '../../hooks/useAccount'
import { Issuer as RawIssuer, Text } from '@mibao-ui/components'
import { InfiniteList } from '../../components/InfiniteList'
import { useHistory } from 'react-router'

interface IssuerProps {
  issuer: IIssuer
  afterToggle?: (params: any) => Promise<any>
}

const IssuerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px;
  margin-top: 0;
  cursor: pointer;
  text-decoration: none;
  .issuer {
    width: 100%;
    margin-right: 4px;
  }
`

const Issuer: React.FC<IssuerProps> = ({ issuer, afterToggle }) => {
  const isBanned = issuer.is_banned || issuer.is_issuer_banned
  const [t] = useTranslation('translations')
  const history = useHistory()
  const href = `${RoutePath.Issuer}/${issuer.uuid}`
  return (
    <IssuerContainer>
      <RawIssuer
        className="issuer"
        src={issuer.avatar_url}
        resizeScale={100}
        size="50px"
        href={href}
        isLinkExternal={false}
        isBanned={isBanned}
        name={issuer.name}
        id={`ID: ${truncateMiddle(issuer.issuer_id, 10, 8)}`}
        isVerified={issuer?.verified_info?.is_verified}
        disableCopy
        bannedText={t('common.baned.issuer')}
        onClick={(e) => {
          e.preventDefault()
          history.push(href)
        }}
      />
      <Follow
        uuid={issuer.uuid}
        followed={issuer.issuer_followed}
        afterToggle={afterToggle}
      />
    </IssuerContainer>
  )
}

export interface IssuerListProps {
  isFollow: boolean
  address: string
}

export const IssuerList: React.FC<IssuerListProps> = ({
  isFollow,
  address,
}) => {
  const getAuth = useGetAndSetAuth()
  const api = useAPI()
  const { t } = useTranslation('translations')

  const getRemoteData = useCallback(
    async ({ pageParam = 1 }) => {
      const { data } = await api.getFollowIssuers({
        address,
        page: pageParam,
      })
      return data
    },
    [api, address]
  )

  const [count, setCount] = useState<number>()

  if (!isFollow) {
    return null
  }
  return (
    <>
      {count != null ? (
        <Text color="#8E8E93" fontSize="13px" margin="20px">
          {t('follow.count', { count })}
        </Text>
      ) : null}
      <InfiniteList
        enableQuery={isFollow}
        queryFn={getRemoteData}
        queryKey={[Query.FollowedIssuers, address, getAuth]}
        emptyElement={<Empty />}
        noMoreElement={t('follow.end')}
        calcDataLength={(data) => {
          return (
            data?.pages.reduce((acc, token) => token.issuers.length + acc, 0) ??
            0
          )
        }}
        renderItems={(group, i, refetch) => {
          return group.issuers.map((issuer, j: number) => (
            <Issuer
              issuer={issuer}
              key={issuer.issuer_id || `${i}.${j}`}
              afterToggle={refetch}
            />
          ))
        }}
        onDataChange={(data) => {
          setCount(data?.pages?.[0].meta?.total_count)
        }}
      />
    </>
  )
}
