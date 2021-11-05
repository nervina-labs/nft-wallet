import {
  Box,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@mibao-ui/components'
import { Explore } from './explore'
import { ClassSortType as SortType } from '../../models'
import { Follow } from './follow'
import { useState } from 'react'

export const NftSortOrKindList: React.FC = () => {
  const sortKinds = [
    {
      value: SortType.OnSale,
      label: '在售',
    },
    {
      value: SortType.Latest,
      label: '最新创作',
    },
    {
      value: SortType.Likes,
      label: '最热',
    },
  ]
  const types = [
    {
      label: '探索',
    },
    {
      label: '关注',
    },
  ]
  const [sortIndex, setSortIndex] = useState(0)
  const [typeIndex, setTypeIndex] = useState(0)

  return (
    <Box mt="10px" userSelect="none" position="relative">
      <Tabs
        variant="solid-rounded"
        position="absolute"
        right="0"
        top="8px"
        size="sm"
        zIndex={1}
        index={sortIndex}
        onChange={setSortIndex}
      >
        <TabList>
          {sortKinds.map((sort, i) => (
            <Tab
              key={i}
              py="4px"
              px="8px"
              rounded="6px"
              whiteSpace="nowrap"
              _selected={{
                bg: '#f6f6f6',
                color: '#5065E5',
              }}
            >
              {sort.label}
            </Tab>
          ))}
        </TabList>
      </Tabs>

      <Tabs colorScheme="black" index={typeIndex} onChange={setTypeIndex}>
        <TabList borderBottom="none">
          {types.map((type) => (
            <Tab
              fontWeight="200"
              fontSize="24px"
              px="0"
              py="0"
              mr="15px"
              _selected={{ fontWeight: '500' }}
            >
              {type.label}
            </Tab>
          ))}
        </TabList>
        <TabPanels>
          <TabPanel px="0">
            {typeIndex === 0 && (
              <Explore sort={sortKinds[sortIndex ?? 0].value} />
            )}
          </TabPanel>
          <TabPanel px="0">
            {typeIndex === 1 && (
              <Follow sort={sortKinds[sortIndex ?? 0].value} />
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}
