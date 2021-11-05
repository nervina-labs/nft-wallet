import { MainContainer } from '../../styles'
import { HiddenBar } from '../../components/HiddenBar'
import { NftSortOrKindList } from '../../components/NftSortOrKindList'

export const ExploreAll: React.FC = () => {
  return (
    <MainContainer>
      <NftSortOrKindList />
      <HiddenBar />
    </MainContainer>
  )
}
