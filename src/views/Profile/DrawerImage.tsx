import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { useWalletModel } from '../../hooks/useWallet'
import { RoutePath } from '../../routes'
import { DrawerAction } from './DrawerAction'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { DrawerConfig } from './DrawerConfig'
import { useInfiniteQuery } from 'react-query'
import { NFTToken, Query } from '../../models'
import { Loading } from '../../components/Loading'
import { Card } from '../../components/Card'
import { ReactComponent as SelectedArrow } from '../../assets/svg/selected-arrow.svg'
import styled from 'styled-components'
import classNames from 'classnames'
import { Empty } from '../NFTs/empty'
import { useProfileModel } from '../../hooks/useProfile'
import { AvatarType } from '../../models/user'
import { useErrorToast } from '../../hooks/useErrorToast'

export interface DrawerImageProps {
  showAvatarAction: boolean
  setShowAvatarAction: React.Dispatch<React.SetStateAction<boolean>>
  reloadProfile?: () => void
}

const allowedTypes =
  'image/png, image/jpeg, image/jpg, image/gif, image/svg+xml, image/webp'

const InfiniteScrollContainer = styled.div`
  height: calc(100% - 79px);
  overflow-x: hidden;
  overflow-y: scroll;
  padding: 15px 15px;
  box-sizing: border-box;
  user-select: none;
  h4 {
    text-align: center;
    color: rgba(0, 0, 0, 0.6);
  }
`

const CardContainer = styled.div`
  box-sizing: content-box;
  margin-bottom: 15px;
  border: 1px solid rgba(0, 0, 0, 0);
  overflow: hidden;
  position: relative;
  border-radius: 12px;
  cursor: pointer;

  .arrow {
    opacity: 0;
    --size: 36px;
    border-top: var(--size) solid #ff5c00;
    border-right: var(--size) solid rgba(0, 0, 0, 0);
    border-bottom: var(--size) solid rgba(0, 0, 0, 0);
    border-left: var(--size) solid rgba(0, 0, 0, 0);
    position: absolute;
    top: 0;
    right: calc(0% - var(--size));
    z-index: 2;

    svg,
    img {
      transform: scale(1.25);
      transform-origin: center;
      position: absolute;
      top: -27px;
      left: -15px;
    }
  }

  &.active {
    border: 1px solid #ff5c00;
  }

  &.active .arrow {
    opacity: 1;
  }

  .card {
    pointer-events: none;
    margin: 0;
  }
`

export const DrawerImage: React.FC<DrawerImageProps> = ({
  showAvatarAction,
  setShowAvatarAction,
  reloadProfile,
}) => {
  const [t] = useTranslation('translations')
  const toast = useErrorToast()
  const history = useHistory()
  const ITEM_LIMIT = 15

  const [openChooseTokenClassModal, setOpenChooseTokenClassModal] = useState(
    false
  )
  const { api, address } = useWalletModel()
  const { setRemoteProfile } = useProfileModel()
  const {
    data,
    status,
    hasNextPage,
    fetchNextPage,
    isFetching,
  } = useInfiniteQuery(
    [`${Query.NFTList}`, address],
    async ({ pageParam = 0 }) => {
      const { data } = await api.getNFTs(pageParam, { exclude_banned: true })
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
        if (total <= current * ITEM_LIMIT) {
          return undefined
        }
        return meta.current_page + 1
      },
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      enabled: openChooseTokenClassModal,
    }
  )
  const [activeIndex, setActiveIndex] = useState(-1)
  const [isSaving, setIsSaving] = useState(false)

  const tokenList =
    useMemo(() => {
      return data?.pages?.reduce(
        (acc, page) => [...acc, ...(page?.token_list ?? [])],
        [] as NFTToken[]
      )
    }, [data]) ?? []

  const onSave = useCallback(async () => {
    const token = tokenList[activeIndex]
    if (!token) return
    if (!token.class_bg_image_url && token.token_uuid) {
      setIsSaving(true)
      await setRemoteProfile({
        avatar_token_uuid: token.token_uuid,
        avatar_type: AvatarType.Token,
      })
      setOpenChooseTokenClassModal(false)
      setShowAvatarAction(false)
      if (reloadProfile) {
        reloadProfile()
      }
      setIsSaving(false)
      return
    }
    history.push(RoutePath.ImagePreview, {
      datauri: token.class_bg_image_url,
      tokenUuid: token.token_uuid,
      tid: `${token.n_token_id}`,
    })
  }, [
    activeIndex,
    history,
    reloadProfile,
    setRemoteProfile,
    setShowAvatarAction,
    tokenList,
  ])

  const infiniteScrollContainerRef = useRef<HTMLDivElement>(null)
  const infiniteScrollContainerScroll = async (
    e: React.UIEvent<HTMLDivElement>
  ) => {
    const el = e.target as HTMLDivElement
    if (el.scrollTop + el.offsetHeight + 30 > el.scrollHeight && hasNextPage) {
      await fetchNextPage()
    }
  }

  return (
    <>
      <DrawerConfig
        isDrawerOpen={openChooseTokenClassModal}
        close={() => setOpenChooseTokenClassModal(false)}
        title={t('profile.choose-nft-avatar')}
        isSaving={isSaving}
        onSaving={onSave}
        isValid={
          tokenList.length > 0 &&
          activeIndex < tokenList.length &&
          activeIndex >= 0
        }
      >
        <InfiniteScrollContainer
          ref={infiniteScrollContainerRef}
          onScroll={async (e) => await infiniteScrollContainerScroll(e)}
        >
          {tokenList.map((token, i) => (
            <CardContainer
              className={classNames({
                active: i === activeIndex,
              })}
              onClick={() => setActiveIndex(i)}
            >
              <div className="arrow">
                <SelectedArrow />
              </div>
              <Card
                className="card"
                token={token}
                key={token.token_uuid || `${i}`}
                address={address}
                isClass={false}
              />
            </CardContainer>
          ))}
          {((!data && status === 'loading') || isFetching) && <Loading />}
          {status === 'success' && tokenList.length === 0 ? <Empty /> : null}
          {!hasNextPage && !(status === 'loading') && !isFetching && (
            <h4 className="end">
              {tokenList.length <= 5 ? ' ' : t('common.actions.pull-to-down')}
            </h4>
          )}
        </InfiniteScrollContainer>
      </DrawerConfig>
      <DrawerAction
        isDrawerOpen={!openChooseTokenClassModal && showAvatarAction}
        close={() => setShowAvatarAction(false)}
        actions={[
          {
            content: (
              <span
                style={{
                  background:
                    'linear-gradient(90.37deg, #69EDFF -1.67%, #76FFA9 41.89%, #FFB800 105.86%)',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                {t('profile.avatar.nft')}
              </span>
            ),
            value: 'nft',
          },
          { content: t('profile.avatar.camera'), value: 'camera' },
          {
            content: (
              <label htmlFor="upload" className="label">
                {t('profile.avatar.photo-lib')}
                <input
                  type="file"
                  id="upload"
                  accept={allowedTypes}
                  onChange={(e) => {
                    const [file] = e.target.files ?? []
                    const [, ext] = file == null ? [] : file?.type?.split('/')
                    if (file) {
                      if (file.size >= 5242880) {
                        toast(t('profile.size-limit'))
                        return
                      } else if (
                        !allowedTypes.split(', ').includes(file.type)
                      ) {
                        toast(t('profile.wrong-image-format'))
                        return
                      }
                      history.push(RoutePath.ImagePreview, {
                        datauri: URL.createObjectURL(file),
                        ext,
                      })
                    }
                  }}
                  style={{ display: 'none' }}
                />
              </label>
            ),
            value: 'lib',
          },
        ]}
        actionOnClick={(val) => {
          if (val === 'camera') {
            history.push(RoutePath.TakePhoto)
          }
          if (val === 'nft') {
            setOpenChooseTokenClassModal(true)
          }
        }}
      />
    </>
  )
}
