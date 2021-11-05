import { Box, Tab, TabList, Tabs } from '@mibao-ui/components'
import { Explore } from './explore'
import { ClassSortType as SortType } from '../../models'
import { Follow } from './follow'
import { useCallback, useMemo } from 'react'
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
        label: t('explore.latest'),
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
  const onChangeSortIndex = useCallback(
    (i: number) => setSort(sortKinds[i ?? 0].value),
    [setSort, sortKinds]
  )
  const onChangeTypeIndex = useCallback(
    (i: number) => setListType(types[i ?? 0].value),
    [setListType, types]
  )
  const sortIndex = useMemo(() => {
    const index = sortKinds.findIndex((s) => s.value === sort)
    return index === -1 ? 0 : index
  }, [sort, sortKinds])
  const typeIndex = useMemo(() => {
    const index = types.findIndex((t) => t.value === listType)
    return index === -1 ? 0 : index
  }, [listType, types])

  return (
    <Box mt="10px" userSelect="none" position="relative" minHeight="628px">
      <Tabs
        variant="solid-rounded"
        position="absolute"
        right="0"
        top="8px"
        size="sm"
        zIndex={2}
        index={sortIndex}
        onChange={onChangeSortIndex}
      >
        <TabList>
          {sortKinds.map((sort, i) => (
            <Tab
              key={i}
              py="4px"
              px="8px"
              rounded="6px"
              whiteSpace="nowrap"
              fontSize="12px"
              fontWeight="normal"
              _selected={{
                bg: '#f6f6f6',
                color: '#5065E5',
                fontWeight: 'bold',
              }}
            >
              {sort.label}
            </Tab>
          ))}
        </TabList>
      </Tabs>

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
