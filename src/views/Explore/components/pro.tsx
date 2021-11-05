import { Box } from '@mibao-ui/components'
import { Banner } from './banner'
import { NftSortOrKindList } from '../../../components/NftSortOrKindList'
import { RankingList } from './rankingList'
import { Recommend } from './recommend'
import { useTranslation } from 'react-i18next'

export const Pro: React.FC = () => {
  const { t } = useTranslation('translations')
  return (
    <Box>
      <Banner />
      <Box fontWeight="200" fontSize="24px" px="20px" mt="30px">
        {t('explore.title-recommended')}
      </Box>
      <Recommend />
      <Box fontWeight="200" fontSize="24px" px="20px" mt="30px">
        {t('explore.ranking')}
      </Box>
      <RankingList />
      <Box mt="10px" px="20px">
        <NftSortOrKindList />
      </Box>
    </Box>
  )
}
