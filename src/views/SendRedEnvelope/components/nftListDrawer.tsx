import { Box, Flex, Grid } from '@chakra-ui/react'
import { Drawer, Issuer, Limited, NftImage } from '@mibao-ui/components'
import { InfiniteList } from '../../../components/InfiniteList'
import styled from '@emotion/styled'
import { CONTAINER_MAX_WIDTH } from '../../../constants'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAPI } from '../../../hooks/useAccount'
import { getNFTQueryParams, isSupportWebp, sleep } from '../../../utils'
import { Search } from '../../../components/Search'
import { Query } from '../../../models'
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

export const NftListDrawer: React.FC<{
  isOpen: boolean
  onClose: () => void
  left?: string
  onChange?: (uuids: string[]) => void
}> = ({ isOpen, onClose, left, onChange }) => {
  const api = useAPI()
  const { t, i18n } = useTranslation('translations')
  const [isEnableQueryNftList, setIsEnableQueryNftList] = useState(false)
  const querySelectableNftList = useCallback(
    async ({ pageParam = 1 }) => {
      const { data } = await api.getNFTs(pageParam, { exclude_banned: true })
      return data
    },
    [api]
  )
  const [selectedNftUuids, setSelectedNftUuids] = useState<string[]>([])
  const selectedNftUuidSet = useMemo(() => new Set(selectedNftUuids), [
    selectedNftUuids,
  ])
  useEffect(() => {
    ;(async () => {
      if (isOpen) {
        setIsEnableQueryNftList(false)
        await sleep(600) // Wait the drawer animation
        setIsEnableQueryNftList(true)
      }
    })()
  }, [isOpen])
  useEffect(() => {
    onChange?.(selectedNftUuids)
  }, [selectedNftUuids, onChange])

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
          <Box fontSize="18px">请选择秘宝</Box>

          <Box
            className="left"
            onClick={onClose}
            fontSize="14px"
            fontWeight="normal"
          >
            确定
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
        <Search
          placeholder="搜索秘宝名称/创作者名称"
          containerProps={{
            mb: '15px',
            flexShrink: 0,
          }}
          tabIndex={-1}
          fontSize="14px"
        />
        <InfiniteList
          enableQuery={isEnableQueryNftList}
          queryFn={querySelectableNftList}
          queryKey={[Query.SendableEnvelopeNfts]}
          noMoreElement={'没有更多'}
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
          renderItems={(pages, i) =>
            pages.token_list.map((item, j) => {
              const selected = selectedNftUuidSet.has(item.token_uuid)
              return (
                <Box
                  key={`${i}-${j}`}
                  mb="20px"
                  onClick={() => {
                    const removeFn = (id: string) => id !== item.token_uuid
                    setSelectedNftUuids(
                      selected
                        ? selectedNftUuids.filter(removeFn)
                        : selectedNftUuids.concat([item.token_uuid])
                    )
                  }}
                >
                  <Box
                    borderWidth="2px"
                    borderStyle="solid"
                    borderColor={selected ? 'primary.500' : 'rgba(0, 0, 0, 0)'}
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
      </Flex>
    </Drawer>
  )
}
