/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useCallback, useMemo, useState } from 'react'
import { useInfiniteQuery } from 'react-query'
import styled from 'styled-components'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Card } from '../../components/Card'
import {
  IS_IPHONE,
  IS_WEXIN,
  NFT_EXPLORER_URL,
  PER_ITEM_LIMIT,
} from '../../constants'
import { useWalletModel } from '../../hooks/useWallet'
import { Query } from '../../models'
import { Empty } from './empty'
import { Loading } from '../../components/Loading'
import { Redirect, useHistory } from 'react-router'
import { RoutePath } from '../../routes'
import { MainContainer } from '../../styles'
// import { ReactComponent as ShareSvg } from '../../assets/svg/share.svg'
import { ReactComponent as ShareSvg } from '../../assets/svg/share-new.svg'
import { ReactComponent as AccountSvg } from '../../assets/svg/account-new.svg'
import Bg from '../../assets/svg/home-bg.svg'
import { Share } from '../../components/Share'
import { useTranslation } from 'react-i18next'
import { HiddenBar } from '../../components/HiddenBar'

const Container = styled(MainContainer)`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding: 0;
  position: relative;
  h4 {
    text-align: center;
    color: rgba(0, 0, 0, 0.6);
  }
  .share {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px 10px 6px 15px;
    background: rgba(255, 246, 235, 0.553224);
    backdrop-filter: blur(13px);
    position: fixed;
    right: 0;
    top: 15px;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
    z-index: 10;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
    font-size: 13px;
    line-height: 18px;
    color: #333;
    svg {
      margin-right: 6px;
    }
  }

  @media (min-width: 500px) {
    .share {
      right: calc(50% - 250px);
    }
  }
  .account {
    background: rgba(255, 246, 235, 0.553224);
    width: 24px;
    height: 24px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    left: 20px;
    top: 20px;
    cursor: pointer;
  }
  .bg {
    position: fixed;
    top: 0;
    width: 100%;
    max-width: 500px;
    height: 215px;
    background: darkgray url(${Bg as any});
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 0 -80px;
    display: flex;
    flex-direction: column-reverse;
    /* padding-left: 16px; */
    h3 {
      font-size: 16px;
      margin: 0;
      margin-left: 16px;
      color: whitesmoke;
      font-weight: normal;
    }

    p {
      font-size: 12px;
      margin-left: 16px;
      color: whitesmoke;
      margin-top: 6px;
      margin-bottom: 55px;
    }
  }
  .center {
    display: flex;
    justify-content: center;
    align-items: center;
    > span {
      font-size: 16px;
      margin-right: 8px;
    }
  }
  .list {
    flex: 1;
    background-color: white;
    background: #ecf2f5;
    border-radius: 35px 35px 0px 0px;
    margin-top: 184px;
    z-index: 2;
    padding-top: 10px;
    .infinite-scroll-component {
      > div {
        &:nth-child(2) {
          margin-top: 20px;
        }
      }
    }
  }
`

export const NFTs: React.FC = () => {
  const { api, isLogined, address } = useWalletModel()
  const { t } = useTranslation('translations')
  const history = useHistory()
  const {
    data,
    status,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery(
    [Query.NFTList, address],
    async ({ pageParam = 1 }) => {
      const { data } = await api.getNFTs(pageParam)
      return data
    },
    {
      getNextPageParam: (lastPage) => {
        const { meta } = lastPage
        const current = meta.current_page
        const total = meta.total_count
        if (total <= current * PER_ITEM_LIMIT) {
          return undefined
        }
        return meta.current_page + 1
      },
    }
  )

  const [isRefetching, setIsRefetching] = useState(false)

  const refresh = useCallback(async () => {
    setIsRefetching(true)
    await refetch()
    setIsRefetching(false)
  }, [refetch])

  const dataLength = useMemo(() => {
    return (
      data?.pages.reduce((acc, token) => token.token_list.length + acc, 0) ?? 0
    )
  }, [data])

  const explorerURL = useMemo(() => {
    return `${NFT_EXPLORER_URL}/holder/tokens/${address}`
  }, [address])

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const openDialog = useCallback(() => {
    setIsDialogOpen(true)
  }, [])

  const closeDialog = (): void => setIsDialogOpen(false)

  if (!isLogined) {
    return <Redirect to={RoutePath.Explore} />
  }

  return (
    <Container>
      <div className="share" onClick={openDialog}>
        <ShareSvg />
        {t('nfts.share')}
      </div>
      <div className="bg">
        <p>{t('nfts.hi')}</p>
        <h3>{t('nfts.welcome')}</h3>
        <div
          className="account"
          onClick={() => history.push(RoutePath.Account)}
        >
          <AccountSvg />
        </div>
      </div>
      <section
        className="list"
        style={IS_IPHONE ? { width: '100%', maxWidth: '100%' } : undefined}
      >
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
              <h4 className="end">
                {dataLength <= 5 ? ' ' : t('common.actions.pull-to-down')}
              </h4>
            }
          >
            {data?.pages?.map((group, i) => {
              return (
                <React.Fragment key={i}>
                  {group.token_list.map((token, j) => {
                    return (
                      <Card
                        className={i === 0 && j === 0 ? 'first' : ''}
                        token={token}
                        key={token.token_uuid ?? `${i}${j}`}
                        address={address}
                      />
                    )
                  })}
                </React.Fragment>
              )
            })}
            {status === 'success' && dataLength === 0 ? <Empty /> : null}
          </InfiniteScroll>
        )}
      </section>
      <Share
        displayText={explorerURL}
        copyText={explorerURL}
        closeDialog={closeDialog}
        isDialogOpen={isDialogOpen}
      />
      <HiddenBar />
    </Container>
  )
}
