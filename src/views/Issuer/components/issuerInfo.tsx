import { Flex, Avatar } from '@mibao-ui/components'
import React from 'react'
import { useIssuerInfo } from '../hooks/useIssuerInfo'
import { useParams } from 'react-router'

export const IssuerInfo: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { data } = useIssuerInfo(id)

  return (
    <Flex>
      <Avatar
        src={data?.avatar_url}
        isVerified={data?.verified_info?.is_verified}
        isBanned={data?.is_issuer_banned}
      />
    </Flex>
  )
}
