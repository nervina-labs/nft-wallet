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

export const NftSortOrKindList: React.FC = () => {
  return (
    <Box mt="10px" userSelect="none">
      <Tabs colorScheme="black">
        <TabList borderBottom="none">
          <Tab
            fontWeight="200"
            fontSize="24px"
            px="0"
            py="0"
            mr="15px"
            _selected={{ fontWeight: '500' }}
          >
            探索
          </Tab>
          <Tab
            fontWeight="200"
            fontSize="24px"
            px="0"
            py="0"
            mr="15px"
            _selected={{ fontWeight: '500' }}
          >
            关注
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel px="0">
            <Explore sort={SortType.Recommend} />
          </TabPanel>
          <TabPanel></TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}
