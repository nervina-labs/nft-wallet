import { Link } from 'react-router-dom'
import { RoutePath } from '../../../routes'
import { Search as SearchInput } from '../../../components/Search'
import styled from '@emotion/styled'

const StyledLink = styled(Link)`
  margin: 8px 20px;
  display: block;
`

export const Search: React.FC = () => {
  return (
    <StyledLink to={RoutePath.Search}>
      <SearchInput noInput />
    </StyledLink>
  )
}
