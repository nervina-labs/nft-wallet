/* eslint-disable @typescript-eslint/restrict-plus-operands */
import React, { useCallback, useMemo, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import styled from 'styled-components'
import { Follow } from '../../components/Follow'
import { LazyLoadImage } from '../../components/Image'
import { Issuer as IIssuer } from '../../models/issuer'
import { ReactComponent as PeopleSvg } from '../../assets/svg/people.svg'
import { Creator } from '../../components/Creator'
import { useInfiniteQuery } from 'react-query'
import { Query } from '../../models'
import { useProfileModel } from '../../hooks/useProfile'
import { IS_WEXIN, PER_ITEM_LIMIT } from '../../constants'
import { Loading } from '../../components/Loading'
import { useTranslation } from 'react-i18next'
import { Empty } from './empty'
import { getImagePreviewUrl, truncateMiddle } from '../../utils'
import { Link } from 'react-router-dom'
import { RoutePath } from '../../routes'
import { useAPI } from '../../hooks/useAccount'

interface IssuerProps {
  issuer: IIssuer
  afterToggle?: (params: any) => Promise<any>
}

const IssuerContainer = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 16px;
  margin-top: 0;
  cursor: pointer;
  text-decoration: none;
  .main {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .avatar {
      height: 44px;
      width: 44px;
      min-width: 44px;
      img,
      svg {
        width: 44px;
        height: 44px;
      }
    }
    .content {
      margin-left: 16px;
      margin-right: 8px;
      flex: 1;
      display: flex;
      justify-content: space-between;
      color: white;
      flex-direction: column;
      height: calc(100% - 8px);
      .id {
        font-size: 12px;
        color: #333333;
      }
    }
  }
`

const LabelContainer = styled.div`
  position: absolute;
  top: 40px;
  left: 0;
  padding: 10px 20px 20px 10px;
  .label {
    background: #f1f1f1;
    border-radius: 50px;
    padding: 4px 10px;
    font-size: 12px;
    color: #666;
  }
`

const LabelPlaceholder = styled.div`
  height: 52px;
`

const Issuer: React.FC<IssuerProps> = ({ issuer, afterToggle }) => {
  const isBanned = issuer.is_banned || issuer.is_issuer_banned
  return (
    <IssuerContainer
      to={isBanned ? '#' : `${RoutePath.Issuer}/${issuer.uuid}`}
      style={{ pointerEvents: isBanned ? 'none' : 'auto' }}
    >
      <div className="main">
        <div className="avatar">
          <LazyLoadImage
            src={getImagePreviewUrl(issuer?.avatar_url, 100)}
            width={44}
            height={44}
            imageStyle={{ borderRadius: '50%' }}
            variant="circle"
            backup={<PeopleSvg />}
          />
        </div>
        <div className="content">
          <Creator
            title=""
            baned={isBanned}
            name={issuer.name}
            isVip={issuer?.verified_info?.is_verified}
            vipTitle={issuer?.verified_info?.verified_title}
            vipSource={issuer?.verified_info?.verified_source}
            color="#999999"
            showAvatar={false}
          />
          <span
            className="id"
            style={{ visibility: isBanned ? 'hidden' : 'inherit' }}
          >
            ID: {truncateMiddle(issuer.issuer_id, 12, 12)}
          </span>
        </div>
      </div>
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
  const { getAuth } = useProfileModel()
  const api = useAPI()
  const { t } = useTranslation('translations')
  const {
    data,
    status,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery(
    [Query.FollowedIssuers, address, getAuth],
    async ({ pageParam }) => {
      const { data } = await api.getFollowIssuers({ address, page: pageParam })
      return data
    },
    {
      getNextPageParam: (lastPage) => {
        if (lastPage?.meta == null) {
          return undefined
        }
        const { meta } = lastPage
        const current = meta.current_page
        const total = meta.total_count
        if (total <= current * PER_ITEM_LIMIT) {
          return undefined
        }
        return meta.current_page + 1
      },
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      enabled: isFollow,
    }
  )

  const [isRefetching, setIsRefetching] = useState(false)
  const dataLength = useMemo(() => {
    return (
      data?.pages.reduce((acc, token) => token.issuers.length + acc, 0) ?? 0
    )
  }, [data])
  const refresh = useCallback(async () => {
    setIsRefetching(true)
    await refetch()
    setIsRefetching(false)
  }, [refetch])

  if (!isFollow) {
    return null
  }
  return (
    <>
      <LabelContainer>
        <span className="label">
          {t('follow.count', { count: dataLength })}
        </span>
      </LabelContainer>
      {dataLength > 0 && <LabelPlaceholder />}
      {isRefetching ? <Loading /> : null}
      {data === undefined && status === 'loading' ? (
        <Loading />
      ) : (
        <InfiniteScroll
          pullDownToRefresh={!IS_WEXIN}
          refreshFunction={refresh}
          pullDownToRefreshContent={
            <h4>&#8595; {t('common.actions.pull-down-refresh')}</h4>
          }
          pullDownToRefreshThreshold={80}
          releaseToRefreshContent={
            <h4>&#8593; {t('common.actions.release-refresh')}</h4>
          }
          dataLength={dataLength}
          next={fetchNextPage}
          hasMore={hasNextPage === true}
          scrollThreshold="250px"
          loader={<Loading />}
          endMessage={
            <h4 className="end">{dataLength <= 6 ? ' ' : t('follow.end')}</h4>
          }
        >
          {data?.pages?.map((group, i) => {
            return (
              <React.Fragment key={i}>
                {group.issuers.map((issuer, j: number) => (
                  <Issuer
                    issuer={issuer}
                    key={issuer.issuer_id || `${i}.${j}`}
                    afterToggle={refetch}
                  />
                ))}
              </React.Fragment>
            )
          })}
          {status === 'success' && dataLength === 0 ? <Empty /> : null}
        </InfiniteScroll>
      )}
    </>
  )
}
