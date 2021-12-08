import { Box } from '@mibao-ui/components'
import { Banner } from './banner'
import { NftSortOrKindList } from '../../../components/NftSortOrKindList'
import { RankingList } from './rankingList'
import { Recommend } from './recommend'
import { Search } from './search'

export const Pro: React.FC = () => {
  return (
    <Box>
      <Search />
      <Banner />
      <Recommend />
      <RankingList />
      <Box mt="10px" px="20px">
        <NftSortOrKindList noTypeLine />
      </Box>
    </Box>
  )
}
