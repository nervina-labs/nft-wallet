import { Box, Select, Tab, TabList, Tabs } from '@mibao-ui/components'
import { Explore } from './explore'
import { ClassSortType as SortType } from '../../models'
import { Follow } from './follow'
import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouteQuerySearch } from '../../hooks/useRouteQuery'

export const NftSortOrKindList: React.FC<{
  noTypeLine?: boolean
}> = ({ noTypeLine: hiddenTypeLine }) => {
  const { t } = useTranslation('translations')
  const [listType, setListType] = useRouteQuerySearch<'metaverse' | 'follow'>(
    'type',
    'metaverse'
  )
  const [sort, setSort] = useRouteQuerySearch<SortType>('sort', SortType.OnSale)
  const sortKinds: Array<{
    value: SortType
    label: string
  }> = useMemo(
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
  const onChangeTypeIndex = useCallback(
    (i: number) => setListType(types[i ?? 0].value),
    [setListType, types]
  )
  const onChangeSort = useCallback(
    (e: React.SyntheticEvent<HTMLInputElement | HTMLSelectElement>) => {
      setSort(e.currentTarget.value as SortType)
    },
    [setSort]
  )
  const typeIndex = useMemo(() => {
    const index = types.findIndex((t) => t.value === listType)
    return index === -1 ? 0 : index
  }, [listType, types])

  return (
    <Box mt="10px" userSelect="none" position="relative" minHeight="628px">
      <Select
        onChange={onChangeSort}
        variant="filled"
        position="absolute"
        right="0"
        top="6px"
        w="96px"
        zIndex={2}
        size="xs"
        rounded="6px"
        fontSize="13px"
        bg="#F6F6F6"
        value={sort}
      >
        {sortKinds.map((sort, i) => (
          <option value={sort.value} key={i}>
            {sort.label}
          </option>
        ))}
      </Select>

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
              fontWeight="normal"
              _selected={{ fontWeight: '500' }}
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
