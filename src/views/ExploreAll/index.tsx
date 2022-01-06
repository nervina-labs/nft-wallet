import { MainContainer } from '../../styles'
import { HiddenBarFill } from '../../components/HiddenBar'
import { NftSortOrKindList } from '../../components/NftSortOrKindList'
import { useScrollRestoration } from '../../hooks/useScrollRestoration'
import { Link } from 'react-router-dom'
import { Search } from '../../components/Search'
import { RoutePath } from '../../routes'
import styled from '@emotion/styled'

const StyledLink = styled(Link)`
  display: block;
  padding: 8px 0;
`

export const ExploreAll: React.FC = () => {
  useScrollRestoration()
  return (
    <MainContainer px="20px">
      <StyledLink to={RoutePath.Search}>
        <Search noInput />
      </StyledLink>
      <NftSortOrKindList isFirstOpenScrollToTop />
      <HiddenBarFill />
    </MainContainer>
  )
}
