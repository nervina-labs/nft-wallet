import styled from '@emotion/styled'
import { Box, Flex, Issuer, NftImage } from '@mibao-ui/components'
import { Link } from 'react-router-dom'
import { SearchTokenClass, SearchIssuer } from '../../../models'
import { isSupportWebp } from '../../../utils'

export const LinkContainer = styled(Link)`
  width: 100%;
  display: block;
  &:not(:last-child) {
    margin-bottom: 20px;
  }
`

export const IssuerItem: React.FC<{ issuer: SearchIssuer }> = ({ issuer }) => {
  return (
    <LinkContainer to={`/issuer/${issuer.uuid}`}>
      <Issuer
        name={issuer.name}
        src={issuer.avatar_url === null ? '' : issuer.avatar_url}
        verifiedTitle={issuer.verified_info?.verified_title}
        isVerified={issuer.verified_info?.is_verified}
        webp={isSupportWebp()}
        resizeScale={100}
        size="48px"
        containerProps={{
          w: '100%',
        }}
      />
    </LinkContainer>
  )
}

export const TokenClassItem: React.FC<{ tokenClass: SearchTokenClass }> = ({
  tokenClass,
}) => {
  return (
    <LinkContainer to={`/class/${tokenClass.uuid}`}>
      <Flex w="full" alignItems="center">
        <NftImage
          src={tokenClass.bg_image_url}
          w="48px"
          webp={isSupportWebp()}
          resizeScale={100}
        />
        <Box fontSize="14px" ml="16px">
          {tokenClass.name}
        </Box>
      </Flex>
    </LinkContainer>
  )
}
