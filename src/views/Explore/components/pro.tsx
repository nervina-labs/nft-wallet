import { Box } from '@mibao-ui/components'
// import { NftSortOrKindList } from '../../../components/NftSortOrKindList'
import { RankingList } from './rankingList'
import { Recommend } from './recommend'

export const Pro: React.FC = () => {
  return (
    <Box mt="30px">
      <Box fontWeight="200" fontSize="24px" px="20px">
        秘宝推荐
      </Box>
      <Recommend />
      <Box fontWeight="200" fontSize="24px" px="20px">
        排行榜
      </Box>
      <RankingList />
      <Box mt="10px" px="20px">
        {/* <NftSortOrKindList /> */}
      </Box>
    </Box>
  )
}
