import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { RoutePath } from '../../routes'
import { DrawerAction } from './DrawerAction'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { DrawerConfig } from './DrawerConfig'
import { useInfiniteQuery } from 'react-query'
import { NFTToken, Query } from '../../models'
import { Loading } from '../../components/Loading'
import { ReactComponent as SelectedArrow } from '../../assets/svg/selected-arrow.svg'
import styled from 'styled-components'
import { Empty } from '../NFTs/empty'
import { useAccount, useAPI } from '../../hooks/useAccount'
import { NFTCard, Box, Flex, Text } from '@mibao-ui/components'
import { formatCount, getNFTQueryParams, isUnlimited } from '../../utils'
import { Masonry } from '../../components/Masonry'
import { useConfirmDialog } from '../../hooks/useConfirmDialog'
import Fallback from '../../assets/svg/fallback.svg'

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
  box-sizing: border-box;
  user-select: none;
  h4 {
    text-align: center;
    color: rgba(0, 0, 0, 0.6);
  }
`

const CardContainer = styled(Box)`
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  overflow: hidden;
  .arrow {
    --size: 60px;
    border-top: var(--size) solid #5065e5;
    border-right: var(--size) solid rgba(0, 0, 0, 0);
    border-bottom: var(--size) solid rgba(0, 0, 0, 0);
    border-left: var(--size) solid rgba(0, 0, 0, 0);
    position: absolute;
    top: 0;
    right: calc(0% - var(--size));
    z-index: 10;

    svg,
    img {
      transform: scale(1.25);
      transform-origin: center;
      position: absolute;
      top: 8px;
      right: 8px;
    }
  }

  .selected {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 10;
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
  const { t, i18n } = useTranslation('translations')
  const onConfirm = useConfirmDialog()
  const history = useHistory()
  const ITEM_LIMIT = 15
  const uploadInputRef = useRef<HTMLInputElement>(null)

  const [openChooseTokenClassModal, setOpenChooseTokenClassModal] = useState(
    false
  )
  const api = useAPI()
  const { address } = useAccount()
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
  const [isSaving] = useState(false)

  const tokenList = useMemo(() => {
    return (
      data?.pages?.reduce(
        (acc, page) => [...acc, ...(page?.token_list ?? [])],
        [] as NFTToken[]
      ) ?? []
    )
  }, [data])

  const onSave = useCallback(async () => {
    const token = tokenList[activeIndex]
    history.push(RoutePath.ImagePreview, {
      datauri: token.class_bg_image_url || '',
      tokenUuid: token.token_uuid,
      tid: `${token.n_token_id}`,
    })
  }, [activeIndex, history, tokenList])

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
      <input
        ref={uploadInputRef}
        type="file"
        id="upload"
        accept={allowedTypes}
        onChange={(e) => {
          const [file] = e.target.files ?? []
          const [, ext] = file == null ? [] : file?.type?.split('/')
          if (!file) return
          if (file.size >= 5242880) {
            onConfirm({
              type: 'error',
              title: t('profile.size-limit'),
            })
            return
          }
          if (!allowedTypes.split(', ').includes(file.type)) {
            onConfirm({
              type: 'error',
              title: t('profile.wrong-image-format'),
            })
            return
          }
          history.push(RoutePath.ImagePreview, {
            datauri: URL.createObjectURL(file),
            ext,
          })
        }}
        style={{ display: 'none' }}
      />
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
          <Masonry columns={2}>
            {tokenList.map((token, i) => {
              const isSelected = activeIndex === i
              return (
                <CardContainer
                  position="relative"
                  w="100%"
                  key={token.token_uuid}
                >
                  {isSelected ? (
                    <>
                      <div className="arrow"></div>
                      <SelectedArrow className="selected" />
                    </>
                  ) : null}
                  <NFTCard
                    w="100%"
                    isIssuerBanned={token.is_issuer_banned}
                    isNFTBanned={token.is_class_banned}
                    resizeScale={300}
                    title={token.class_name}
                    bannedText={t('common.baned.nft')}
                    type="image"
                    src={token.class_bg_image_url || ''}
                    locale={i18n.language}
                    srcQueryParams={getNFTQueryParams(
                      token.n_token_id,
                      i18n.language
                    )}
                    imageProps={{
                      border: isSelected ? '4px solid #5065E5' : undefined,
                      fallbackSrc: Fallback,
                    }}
                    issuerProps={{
                      name: token.issuer_name as string,
                      src: token.issuer_avatar_url,
                      bannedText: t('common.baned.issuer'),
                      width: '25px',
                      isVerified: token.verified_info?.is_verified,
                    }}
                    titleProps={{ noOfLines: 2 }}
                    onClick={() => {
                      setActiveIndex(i)
                    }}
                  />
                  <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    fontSize="12px"
                  >
                    <Text color="gray.500">
                      {isUnlimited(token.class_total)
                        ? t('common.limit.unlimit')
                        : `${t('common.limit.limit')} ${formatCount(
                            Number(token.class_total),
                            i18n.language
                          )}`}
                    </Text>
                    <Text color="gray.500">#{`${token.n_token_id}`}</Text>
                  </Flex>
                </CardContainer>
              )
            })}
          </Masonry>

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
              <Box
                onClick={() => {
                  uploadInputRef.current?.click()
                }}
              >
                {t('profile.avatar.photo-lib')}
              </Box>
            ),
            value: 'lib',
          },
        ]}
        actionOnClick={(val) => {
          if (val === 'camera') {
            history.push(RoutePath.Profile, {
              showCamera: true,
            })
          }
          if (val === 'nft') {
            setOpenChooseTokenClassModal(true)
          }
        }}
      />
    </>
  )
}
