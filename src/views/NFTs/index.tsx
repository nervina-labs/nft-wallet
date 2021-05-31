/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useCallback, useMemo, useState } from 'react'
import { useInfiniteQuery } from 'react-query'
import styled from 'styled-components'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Appbar } from '../../components/Appbar'
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
import AccountPng from '../../assets/img/account.png'
import { ReactComponent as ShareSvg } from '../../assets/svg/share.svg'
import Bg from '../../assets/img/nft-bg.png'
import { Share } from '../../components/Share'
import { useTranslation } from 'react-i18next'

const Container = styled(MainContainer)`
  display: flex;
  flex-direction: column;
  h4 {
    text-align: center;
    color: rgba(0, 0, 0, 0.6);
  }
  .bg {
    position: fixed;
    top: 0;
    width: 100%;
    max-width: 500px;
    height: 215px;
    background: darkgray url(${Bg});
    background-repeat: no-repeat;
    background-size: cover;
    background-position: bottom;
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
      margin-bottom: 45px;
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
    margin-top: 140px;
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
    if (navigator.share) {
      navigator
        .share({
          url: explorerURL,
          text: 'Share test',
          title: t('common.title'),
        })
        .catch(() => {
          console.error('share failed')
        })
    } else {
      setIsDialogOpen(true)
    }
  }, [explorerURL, t])

  const closeDialog = (): void => setIsDialogOpen(false)

  if (!isLogined) {
    return <Redirect to={RoutePath.Login} />
  }

  return (
    <Container>
      <Appbar
        transparent
        title={
          <div className="center">
            <span>{t('nfts.title')}</span>
          </div>
        }
        left={
          <img
            src={AccountPng}
            onClick={() => {
              history.push(RoutePath.Info)
            }}
          />
        }
        right={<ShareSvg onClick={openDialog} />}
      />
      <div className="bg">
        <p>{t('nfts.hi')}</p>
        <h3>{t('nfts.welcome')}</h3>
      </div>
      <section
        className="list"
        style={
          IS_IPHONE
            ? { position: 'fixed', width: '100%', maxWidth: '100%' }
            : undefined
        }
      >
        {isRefetching ? <Loading /> : null}
        {data === undefined && status === 'loading' ? (
          <Loading />
        ) : (
          <InfiniteScroll
            pullDownToRefresh={!IS_WEXIN}
            refreshFunction={refresh}
            height={window.innerHeight - 194}
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
    </Container>
  )
}
