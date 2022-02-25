import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tab,
  TabList,
  Tabs,
} from '@mibao-ui/components'
import { Explore } from './explore'
import { ClassSortType as SortType } from '../../models'
import { Follow } from './follow'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouteQuerySearch } from '../../hooks/useRouteQuery'
import { ReactComponent as MenuArrowSvg } from '../../assets/svg/menu-arrow.svg'
import { useFirstOpenScrollToTop } from '../../hooks/useFirstOpenScrollToTop'
import { trackLabels, useTrackClick } from '../../hooks/useTrack'

interface SortWithLabel {
  value: SortType
  label: string
}

export const NftSortOrKindList: React.FC<{
  noTypeLine?: boolean
  isFirstOpenScrollToTop?: boolean
}> = ({ noTypeLine: hiddenTypeLine, isFirstOpenScrollToTop }) => {
  const { t } = useTranslation('translations')
  const [listType, setListType] = useRouteQuerySearch<'metaverse' | 'follow'>(
    'type',
    'metaverse'
  )
  const sortKinds: SortWithLabel[] = useMemo(
    () => [
      {
        value: SortType.OnSale,
        label: t('explore.on-sale'),
      },
      {
        value: SortType.Latest,
        label: t('explore.latest'),
      },
      {
        value: SortType.Likes,
        label: t('explore.most-liked'),
      },
    ],
    [t]
  )
  const types = useMemo(
    () =>
      [
        {
          value: 'metaverse',
          label: t('explore.metaverse'),
        },
        {
          value: 'follow',
          label: t('explore.follow'),
        },
      ] as const,
    [t]
  )
  const [sort, setSort] = useRouteQuerySearch<SortType>('sort', SortType.OnSale)
  const [sortLabel, setSortLabel] = useState<string>(
    sortKinds.find((s) => s.value === sort)?.label ?? sortKinds[0].label
  )
  const onChangeTypeIndex = useCallback(
    (i: number) => setListType(types[i ?? 0].value),
    [setListType, types]
  )
  const onChangeSort = useCallback(
    (s: SortWithLabel) => {
      setSort(s.value)
      setSortLabel(s.label)
    },
    [setSort]
  )
  const typeIndex = useMemo(() => {
    const index = types.findIndex((t) => t.value === listType)
    return index === -1 ? 0 : index
  }, [listType, types])
  useFirstOpenScrollToTop({ enable: isFirstOpenScrollToTop })

  const trackMenu = useTrackClick(
    listType === 'follow' ? 'explore-follow' : 'explore-explore',
    'switchover'
  )
  const trackSwitchFollow = useTrackClick('explore-explore', 'switchover')
  return (
    <Box mt="10px" userSelect="none" position="relative" minHeight="628px">
      <Box position="absolute" right="0" top="4px" zIndex={3}>
        <Menu matchWidth offset={[100, 0]}>
          <MenuButton
            as={Button}
            h="25px"
            lineHeight="25px"
            bg="#F6F6F6"
            fontSize="13px"
            rightIcon={<MenuArrowSvg />}
            px="10px"
          >
            {sortLabel}
          </MenuButton>
          <Box
            right="6px"
            w="84px"
            h="1px"
            position="absolute"
            top="calc(100% + 8px)"
          >
            <MenuList
              minW="90px"
              border="none"
              shadow="0px 1px 8px rgba(0, 0, 0, 0.08)"
            >
              {sortKinds.map((sort, i) => (
                <MenuItem
                  _hover={{ bg: 'rgba(0, 0, 0, 0)' }}
                  _focus={{ bg: 'rgba(0, 0, 0, 0)' }}
                  value={sort.value}
                  key={i}
                  onClick={() => {
                    onChangeSort(sort)
                    trackMenu(sort.label)
                  }}
                  whiteSpace="nowrap"
                  fontSize="13px"
                  lineHeight="24px"
                >
                  {sort.label}
                </MenuItem>
              ))}
            </MenuList>
          </Box>
        </Menu>
      </Box>

      <Tabs
        variant={hiddenTypeLine ? 'unstyled' : 'line'}
        colorScheme="black"
        onChange={onChangeTypeIndex}
        mb="20px"
        index={typeIndex}
      >
        <TabList borderBottom="none">
          {types.map((type, i) => (
            <Tab
              key={i}
              fontSize="24px"
              px="0"
              py="0"
              mr="15px"
              fontWeight="200"
              _selected={{ fontWeight: 'normal' }}
              onClick={() => {
                if (type.value === 'follow') {
                  trackSwitchFollow(trackLabels.explore['switch-follow'])
                }
              }}
            >
              {type.label}
            </Tab>
          ))}
        </TabList>
      </Tabs>
      {listType === 'metaverse' && <Explore sort={sort} />}
      {listType === 'follow' && <Follow sort={sort} />}
    </Box>
  )
}
