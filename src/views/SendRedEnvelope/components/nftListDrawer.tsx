import { Box, Flex, Grid } from '@chakra-ui/react'
import { Drawer, Issuer, Limited, NftImage } from '@mibao-ui/components'
import { InfiniteList } from '../../../components/InfiniteList'
import styled from '@emotion/styled'
import { CONTAINER_MAX_WIDTH } from '../../../constants'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAPI } from '../../../hooks/useAccount'
import { getNFTQueryParams, isSupportWebp, sleep } from '../../../utils'
import { NFTToken, Query } from '../../../models'
import { useTranslation } from 'react-i18next'
import { ReactComponent as SelectedArrow } from '../../../assets/svg/selected-arrow.svg'
import { ReactComponent as LeftSvg } from '../../../assets/svg/left.svg'

const LeftIcon = styled(LeftSvg)`
  width: 16px;
  height: 16px;
  object-fit: contain;
`

const StyledSelectedArrow = styled(SelectedArrow)`
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 2;
`

const LIMIT = 50

export const NftListDrawer: React.FC<{
  isOpen: boolean
  onClose: () => void
  left?: string
  onChange?: (selectedTokens: NFTToken[]) => void
}> = ({ isOpen, onClose, left, onChange }) => {
  const api = useAPI()
  const { t, i18n } = useTranslation('translations')
  const [isEnableQueryNftList, setIsEnableQueryNftList] = useState(false)
  const querySelectableNftList = useCallback(
    async ({ pageParam = 1 }) => {
      const { data } = await api.getNFTs(pageParam, {
        exclude_banned: true,
        include_submitting: false,
      })
      return data
    },
    [api]
  )
  const [selectedTokens, setSelectedTokens] = useState<NFTToken[]>([])
  const [selectingTokens, setSelectingTokens] = useState<NFTToken[]>([])
  const selectingNftUuidSet = useMemo(
    () => new Set(selectingTokens.map((t) => t.token_uuid)),
    [selectingTokens]
  )
  const [tokenList, setTokenList] = useState<NFTToken[]>([])
  useEffect(() => {
    ;(async () => {
      if (isOpen) {
        setSelectingTokens(selectedTokens)
        setIsEnableQueryNftList(false)
        await sleep(600) // Wait the drawer animation
        setIsEnableQueryNftList(true)
      }
    })()
  }, [isOpen, selectedTokens])
  useEffect(() => {
    onChange?.(selectedTokens)
  }, [selectedTokens, onChange, tokenList])

  const onConfirm = useCallback(() => {
    setSelectedTokens(selectingTokens)
    onClose()
  }, [onClose, selectingTokens])

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      hasOverlay
      placement="bottom"
      rounded="md"
      header={
        <Grid
          templateColumns="50px calc(100% - 100px) 50px"
          textAlign="center"
          lineHeight="30px"
        >
          <Flex align="center" onClick={onClose}>
            <LeftIcon />
          </Flex>
          <Box fontSize="18px">
            {t('send-red-envelope.form-items.select-nft-title')}
          </Box>

          <Box
            className="left"
            onClick={onConfirm}
            fontSize="14px"
            fontWeight="normal"
          >
            {t('send-red-envelope.form-items.ok')}
          </Box>
        </Grid>
      }
      contentProps={{
        maxH: 'calc(100% - 50px)',
        h: 'calc(100% - 50px)',
        style: {
          left,
          width: '100%',
          maxWidth: CONTAINER_MAX_WIDTH + 'px',
          paddingBottom: '40px',
        },
      }}
    >
      <Flex
        h="full"
        direction="column"
        overflowX="hidden"
        overflowY="auto"
        id="selectNftListContainerId"
      >
        <InfiniteList
          enableQuery={isEnableQueryNftList}
          queryFn={querySelectableNftList}
          queryKey={[Query.SendableEnvelopeNfts]}
          noMoreElement={''}
          calcDataLength={(data) =>
            data?.pages.reduce(
              (acc, token) => token?.token_list?.length + acc,
              0
            ) ?? 0
          }
          queryOptions={{
            cacheTime: 0,
          }}
          columnCount={2}
          gap="15px"
          pullDownToRefresh={false}
          scrollableTarget="selectNftListContainerId"
          onDataChange={(data) => {
            if (!data) return
            setTokenList(
              data.pages.reduce<NFTToken[]>(
                (acc, page) => acc.concat(page.token_list),
                []
              )
            )
          }}
          renderItems={(pages, i) =>
            pages.token_list.map((item, j) => {
              const selected = selectingNftUuidSet.has(item.token_uuid)
              const notSelectable =
                (selectingTokens.length >= LIMIT && !selected) ||
                item.script_type === 'cota'
              return (
                <Box
                  key={`${i}-${j}`}
                  mb="20px"
                  opacity={notSelectable ? 0.5 : 1}
                  cursor={notSelectable ? 'not-allowed' : 'pointer'}
                  onClick={() => {
                    if (item.script_type === 'cota') {
                      return
                    }
                    const removeFn = (t: NFTToken) =>
                      t.token_uuid !== item.token_uuid
                    const changedTokens = selected
                      ? selectingTokens.filter(removeFn)
                      : selectingTokens.concat([item])
                    if (changedTokens.length <= LIMIT) {
                      setSelectingTokens(changedTokens)
                    }
                  }}
                >
                  <Box
                    _before={
                      selected
                        ? {
                            position: 'absolute',
                            content: '" "',
                            width: '100px',
                            height: '80px',
                            bg: 'primary.500',
                            top: 0,
                            right: 0,
                            display: 'block',
                            transform: 'rotate(45deg) translate(0%, -80%)',
                            zIndex: 2,
                          }
                        : undefined
                    }
                    _after={
                      selected
                        ? {
                            position: 'absolute',
                            content: '" "',
                            width: '100%',
                            height: '100%',
                            borderStyle: 'solid',
                            borderWidth: '2px',
                            borderColor: 'primary.500',
                            top: 0,
                            right: 0,
                            display: 'block',
                            rounded: 'calc(10% + 5px)',
                            zIndex: 2,
                          }
                        : undefined
                    }
                    overflow="hidden"
                    position="relative"
                    rounded="calc(10% + 5px)"
                  >
                    {selected ? <StyledSelectedArrow /> : null}
                    <NftImage
                      src={item.class_bg_image_url}
                      srcQueryParams={getNFTQueryParams(
                        item.n_token_id,
                        i18n.language
                      )}
                      webp={isSupportWebp()}
                      resizeScale={500}
                      customizedSize={{ fixed: 'large' }}
                    />
                  </Box>
                  <Box
                    fontSize="14px"
                    my="10px"
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                  >
                    {item.class_name}
                  </Box>
                  <Issuer
                    size="25px"
                    name={item.issuer_name ?? ''}
                    src={item.issuer_avatar_url}
                    webp={isSupportWebp()}
                    resizeScale={100}
                    customizedSize={{ fixed: 'small' }}
                    isVerified={item.verified_info?.is_verified}
                  />
                  <Limited
                    count={item.class_total}
                    fontSize="12px"
                    limitedText={t('common.limit.limit')}
                    unlimitedText={t('common.limit.unlimit')}
                    color="#999999"
                    serialNumber={item.n_token_id}
                    mt="10px"
                  />
                </Box>
              )
            })
          }
        />
        <Box
          position="absolute"
          bottom="0"
          left="0"
          w="full"
          h="50px"
          lineHeight="50px"
          bg="white"
          textAlign="center"
          fontSize="14px"
          zIndex={2}
        >
          {t('send-red-envelope.total-nft', { total: selectingTokens.length })}
        </Box>
      </Flex>
    </Drawer>
  )
}
